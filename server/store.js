/* ============================================================
   STORE — the app's own database (SQLite, one file)
   state      the current save: one row, with a revision number that goes up on every write
   snapshots  earlier saves, so a bad import or "Vymazať všetko" can be undone:
              the save being replaced is kept when the last snapshot is over 10 minutes old,
              and always when an import / reset / upgrade replaces it.
              Everything from the last two days stays; older ones thin out to one per day.
   backups/   a copy of the whole database file once a day, the newest 30 kept
   ============================================================ */
const fs = require("node:fs");
const path = require("node:path");
const {DatabaseSync} = require("node:sqlite");

const SNAPSHOT_EVERY = 10 * 60 * 1000;
const KEEP_ALL_FOR = 2 * 86400000;
const KEEP_BACKUPS = 30;

function openStore(dir){
  fs.mkdirSync(dir, {recursive:true});
  const file = path.join(dir, "maturita.db");
  const backupDir = path.join(dir, "backups");
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA synchronous = FULL;
    CREATE TABLE IF NOT EXISTS state(
      id    INTEGER PRIMARY KEY CHECK (id = 1),
      rev   INTEGER NOT NULL,
      saved INTEGER NOT NULL,
      data  TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS snapshots(
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      saved   INTEGER NOT NULL,
      rated   INTEGER NOT NULL,
      notes   INTEGER NOT NULL,
      entries INTEGER NOT NULL,
      data    TEXT NOT NULL
    );
  `);

  const q = {
    get:      db.prepare("SELECT rev, saved, data FROM state WHERE id = 1"),
    put:      db.prepare("INSERT INTO state(id, rev, saved, data) VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET rev = excluded.rev, saved = excluded.saved, data = excluded.data"),
    lastSnap: db.prepare("SELECT MAX(saved) AS at FROM snapshots"),
    addSnap:  db.prepare("INSERT INTO snapshots(saved, rated, notes, entries, data) VALUES (?, ?, ?, ?, ?)"),
    list:     db.prepare("SELECT id, saved, rated, notes, entries FROM snapshots ORDER BY saved DESC, id DESC"),
    one:      db.prepare("SELECT saved, data FROM snapshots WHERE id = ?"),
    thin:     db.prepare(`DELETE FROM snapshots WHERE saved < ? AND id NOT IN (
                SELECT MAX(id) FROM snapshots WHERE saved < ? GROUP BY date(saved / 1000, 'unixepoch', 'localtime'))`)
  };

  function current(){
    const row = q.get.get();
    return row ? {rev:row.rev, saved:row.saved, data:row.data} : {rev:0, saved:0, data:null};
  }

  function snapshot(data, saved){
    let s = {};
    try{ s = JSON.parse(data) || {}; }catch(e){}
    const count = o => o && typeof o === "object" ? Object.keys(o).length : 0;
    const notes = Object.values(s.notes || {}).reduce((a, l) => a + (Array.isArray(l) ? l.length : 0), 0);
    q.addSnap.run(saved, count(s.slv), notes, Array.isArray(s.log) ? s.log.length : 0, data);
    const cutoff = Date.now() - KEEP_ALL_FOR;
    q.thin.run(cutoff, cutoff);
  }

  /* write a new save if `base` is still the current revision; otherwise report the conflict */
  function put(base, state){
    const data = JSON.stringify(state);
    db.exec("BEGIN IMMEDIATE");
    try{
      const cur = current();
      if(base !== cur.rev){ db.exec("ROLLBACK"); return {conflict:true, ...cur}; }
      const now = Date.now();
      if(cur.data){
        let old = {};
        try{ old = JSON.parse(cur.data) || {}; }catch(e){}
        const replaced = (old.epoch || 0) !== (state.epoch || 0) || old.v !== state.v;
        if(replaced || now - (q.lastSnap.get().at || 0) > SNAPSHOT_EVERY) snapshot(cur.data, cur.saved);
      }
      q.put.run(cur.rev + 1, now, data);
      db.exec("COMMIT");
      dailyBackup();
      return {rev:cur.rev + 1, saved:now};
    }catch(e){
      try{ db.exec("ROLLBACK"); }catch(_){}
      throw e;
    }
  }

  function snapshots(){ return q.list.all().map(r => ({...r})); }
  function getSnapshot(id){
    const row = q.one.get(id);
    return row ? {saved:row.saved, data:row.data} : null;
  }

  /* a whole-file copy per day, outside the live database */
  let lastBackupDay = "";
  function dailyBackup(){
    const d = new Date();
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if(day === lastBackupDay) return;
    try{
      fs.mkdirSync(backupDir, {recursive:true});
      const target = path.join(backupDir, `maturita-${day}.db`);
      if(!fs.existsSync(target)) db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
      lastBackupDay = day;
      const old = fs.readdirSync(backupDir).filter(f => /^maturita-\d{4}-\d\d-\d\d\.db$/.test(f)).sort().slice(0, -KEEP_BACKUPS);
      for(const f of old) fs.rmSync(path.join(backupDir, f), {force:true});
    }catch(e){
      console.error("Daily backup failed:", e.message);
    }
  }
  if(current().data) dailyBackup();

  /* a consistent copy of the database to a file of your choice */
  function copyTo(target){
    if(fs.existsSync(target)) fs.rmSync(target);
    db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
  }

  return {file, dir, backupDir, current, put, snapshots, getSnapshot, copyTo, close:() => db.close()};
}

module.exports = {openStore};

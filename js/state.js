/* ============================================================
   STATE + STORAGE
   state = {
     v: 3,
     lv:     { topicId: 0–4 },                  level per topic
     notes:  { topicId: [ {id, title, body, c, u} ] }
                                                named notes; c = created, u = updated
     upd:    { topicId: timestamp },            last change to level or notes
     log:    [ {id, d:"YYYY-MM-DD", text, ts, links:[{t, n?}]} ]
                                                study diary; links point at topics / notes
     recent: [ topicId ],                       last opened topics, newest first
     prefs:  { noteOrder: "new" | "old" }
   }
   Two places progress can live:
     1. window.storage — exists when this page runs inside Claude
     2. localStorage   — exists when the file is opened from disk
   If neither works, the Copy / Paste buttons are the backup.
   ============================================================ */
const KEY = "maturita-mat-v2";              /* storage slot name; the data inside carries its own version */
const OLD_KEY = "maturita-mat-progress";
const BACKUP_KEY = "maturita-mat-v2-backup"; /* untouched copy of a v2 save, written once before upgrading */

const emptyState = () => ({v:3, lv:{}, notes:{}, upd:{}, log:[], recent:[], prefs:{}});
let state = emptyState();
let store = "none";

const hasClaudeStore = typeof window !== "undefined"
  && window.storage && typeof window.storage.get === "function";

const hasLocal = (()=>{
  try{ localStorage.setItem("__probe","1"); localStorage.removeItem("__probe"); return true; }
  catch(e){ return false; }
})();

if(hasClaudeStore)   store = "claude";
else if(hasLocal)    store = "local";

const isObj = o => o && typeof o === "object" && !Array.isArray(o);

/* bring any older or hand-edited save up to v3 */
function migrate(old){
  if(!isObj(old)) return emptyState();
  if(old.v === 2 || old.v === 3){
    const s = emptyState();
    for(const k of ["lv","notes","upd","prefs"]) if(isObj(old[k])) s[k] = old[k];
    if(Array.isArray(old.log)) s.log = old.log;
    if(Array.isArray(old.recent)) s.recent = old.recent;
    return tidy(s);
  }
  /* v1: {id: 0|1|2} or {id:{p,t}} → five-level scale */
  const s = emptyState();
  const map = [0, 2, 4];
  for(const id in old){
    const v = old[id];
    const p = typeof v === "number" ? v : (v && v.p) || 0;
    if(p > 0 && BY_ID[id]) s.lv[id] = map[p] || 0;
  }
  return s;
}

function tidy(s){
  for(const id in s.notes){
    const v = s.notes[id];
    let list = [];
    if(typeof v === "string"){
      /* v2 kept one plain-text note per topic */
      const ts = +s.upd[id] || Date.now();
      if(v.trim()) list = [{id:uid(), title:"", body:v, c:ts, u:ts}];
    } else if(Array.isArray(v)){
      list = v.filter(isObj).map(n => ({
        id: String(n.id || uid()), title: String(n.title || ""), body: String(n.body || ""),
        c: +n.c || Date.now(), u: +n.u || +n.c || Date.now()
      }));
    }
    if(list.length && BY_ID[id]) s.notes[id] = list; else delete s.notes[id];
  }
  s.log = s.log.filter(e => isObj(e) && typeof e.d === "string").map(e => ({
    id: String(e.id || uid()), d: e.d, text: String(e.text || ""), ts: +e.ts || Date.now(),
    links: Array.isArray(e.links)
      ? e.links.filter(l => isObj(l) && BY_ID[l.t]).map(l => l.n ? {t:l.t, n:String(l.n)} : {t:l.t})
      : []
  }));
  s.recent = s.recent.filter(id => BY_ID[id]).slice(0, 8);
  return s;
}

async function readKey(k){
  if(hasClaudeStore){
    try{ const r = await window.storage.get(k); if(r && r.value) return r.value; }catch(e){}
  }
  if(hasLocal){
    try{ const v = localStorage.getItem(k); if(v) return v; }catch(e){}
  }
  return null;
}

async function writeKey(k, txt){
  let ok = false;
  if(hasClaudeStore){ try{ await window.storage.set(k, txt); ok = true; }catch(e){} }
  if(hasLocal){ try{ localStorage.setItem(k, txt); ok = true; }catch(e){} }
  return ok;
}

async function load(){
  let raw = await readKey(KEY);
  if(raw){
    try{
      const parsed = JSON.parse(raw);
      state = migrate(parsed);
      if(parsed.v !== 3){
        if(!(await readKey(BACKUP_KEY))) await writeKey(BACKUP_KEY, raw);
        await save();
      }
      return;
    }catch(e){}
  }
  raw = await readKey(OLD_KEY);
  if(raw){ try{ state = migrate(JSON.parse(raw)); await save(); }catch(e){} }
}

async function save(){
  const ok = await writeKey(KEY, JSON.stringify(state));
  if(!ok) store = "none";
  renderStoreNote();
}

let saveTimer = null;
function saveSoon(){ clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }

function renderStoreNote(){
  const el = document.getElementById("storeNote");
  if(!el) return;
  if(store === "claude"){
    el.textContent = "Postup sa ukladá sem do Claude a nájdeš ho tu aj nabudúce. Ak si súbor stiahneš a otvoríš v prehliadači, ukladá sa doň zvlášť.";
  } else if(store === "local"){
    el.textContent = "Postup sa ukladá priamo v tomto prehliadači. Zostane tam, kým nevymažeš dáta stránok — priečinok si nechaj na jednom mieste a otváraj ten istý súbor.";
  } else {
    el.textContent = "Ukladanie tu nefunguje. Po každom sedení klikni Skopírovať postup a text si nechaj; cez Vložiť postup ho vrátiš späť.";
  }
}

/* ---------- levels ---------- */
const lv = id => state.lv[id] || 0;
const touch = id => { state.upd[id] = Date.now(); };

function setLevel(id, v){
  if(v === 0) delete state.lv[id]; else state.lv[id] = v;
  touch(id);
}

const changedToday = id => state.upd[id] && isoOf(state.upd[id]) === todayIso();
const blocked = item => (item.pre||[]).filter(p => lv(p) < 3);
const dependents = id => T.filter(x => (x.pre||[]).includes(id));

function itemsOf(k){ return T.filter(x => x.t === k); }

/* ---------- notes ---------- */
const notesOf = id => state.notes[id] || [];
const findNote = (tid, nid) => notesOf(tid).find(n => n.id === nid);

function sortedNotes(id){
  const dir = state.prefs.noteOrder === "old" ? 1 : -1;
  return [...notesOf(id)].sort((a, b) => (a.c - b.c) * dir);
}
/* newest by creation, whatever the display order */
const latestNote = id => notesOf(id).reduce((a, n) => (!a || n.c > a.c ? n : a), null);

function noteTitle(n){
  return n.title.trim() || plainText(n.body.split("\n").find(l => l.trim()) || "", 60) || "Bez názvu";
}

function addNote(tid){
  const now = Date.now();
  const n = {id:uid(), title:"", body:"", c:now, u:now};
  (state.notes[tid] ||= []).push(n);
  touch(tid);
  return n;
}
function updateNote(tid, nid, patch){
  const n = findNote(tid, nid);
  if(!n) return;
  Object.assign(n, patch, {u:Date.now()});
  touch(tid);
}
function removeNote(tid, nid){
  const list = notesOf(tid);
  const i = list.findIndex(n => n.id === nid);
  if(i < 0) return null;
  const [n] = list.splice(i, 1);
  if(!list.length) delete state.notes[tid];
  return n;
}
function restoreNote(tid, n){ (state.notes[tid] ||= []).push(n); }

const noteHaystack = id => notesOf(id).map(n => n.title + " " + n.body).join(" ");

/* ---------- log ---------- */
const byLogDesc = (a, b) => b.d.localeCompare(a.d) || b.ts - a.ts;
const logFor = tid => state.log.filter(e => e.links.some(l => l.t === tid)).sort(byLogDesc);
const logForNote = (tid, nid) => state.log.filter(e => e.links.some(l => l.t === tid && l.n === nid));
const sameLink = (a, b) => a.t === b.t && (a.n || null) === (b.n || null);

function addLog(d, text, links){
  const e = {id:uid(), d, text, ts:Date.now(), links:links.map(l => ({...l}))};
  state.log.push(e);
  return e;
}

/* ---------- recently opened ---------- */
function markRecent(id){
  state.recent = [id, ...state.recent.filter(x => x !== id)].slice(0, 8);
}

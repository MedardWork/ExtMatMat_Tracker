/* ============================================================
   STATE + STORAGE
   state = {
     v: 4,
     slv:    { "topicId/subKey": 1–4 },         level per subtopic — a topic's level is computed from these
     slvAt:  { "topicId/subKey": timestamp },   when that level last changed
     subs:   { topicId: [ {id, n, c, u} ] },    subtopics you added yourself
     rel:    { topicId: {off, at} },            off = moved to "Nerelevantné", left out of the estimate
     notes:  { topicId: [ {id, title, body, c, u, lv, sub} ] }
                                                named notes; c = created, u = updated,
                                                lv = how well you understand it (0 = not set), sub = subtopic key
     upd:    { topicId: timestamp },            last change to levels or notes
     log:    [ {id, d:"YYYY-MM-DD", text, ts, u, links:[{t, n?}]} ]
                                                study diary; links point at topics / notes
     del:    { noteOrEntryId: timestamp },      tombstones, so a deletion survives merging
     epoch:  timestamp,                         bumped by import / reset: a newer epoch wins outright
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
const STATE_V = 4;
/* untouched copy of an older save, written once before upgrading it */
const backupKey = v => `maturita-mat-v${v || 1}-backup`;

const emptyState = () => ({v:STATE_V, slv:{}, slvAt:{}, subs:{}, rel:{}, notes:{}, upd:{}, log:[], del:{}, epoch:0, recent:[], prefs:{}});
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

/* subtopics: the list in SUBS, each keyed by its name */
const subKey = name => norm(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
const SUB_LIST = Object.fromEntries(T.map(x => [x.id, (SUBS[x.id] || [x.n]).map(n => ({k:subKey(n), n}))]));

/* bring any older or hand-edited save up to v4 */
function migrate(old){
  if(!isObj(old)) return emptyState();
  const s = emptyState();
  let levels = {}, levelAt = {};
  if(old.v >= 2 && old.v <= STATE_V){
    for(const k of ["slv","slvAt","subs","rel","notes","upd","del","prefs"]) if(isObj(old[k])) s[k] = old[k];
    s.epoch = +old.epoch || 0;
    if(Array.isArray(old.log)) s.log = old.log;
    if(Array.isArray(old.recent)) s.recent = old.recent;
    if(isObj(old.lv)) levels = old.lv;          /* v2, v3: one level per topic */
    if(isObj(old.lvAt)) levelAt = old.lvAt;
  } else {
    /* v1: {id: 0|1|2} or {id:{p,t}} → five-level scale */
    const map = [0, 2, 4];
    for(const id in old){
      const v = old[id];
      const p = typeof v === "number" ? v : (v && v.p) || 0;
      if(p > 0) levels[id] = map[p] || 0;
    }
  }
  /* from before subtopics: the topic's level becomes the level of each of its subtopics */
  for(const id in levels){
    const v = +levels[id];
    if(!BY_ID[id] || !(v >= 1 && v <= 4)) continue;
    const at = +levelAt[id] || +s.upd[id] || 0;
    for(const sb of SUB_LIST[id]){
      const key = `${id}/${sb.k}`;
      if(key in s.slv) continue;
      s.slv[key] = v;
      if(at) s.slvAt[key] = at;
    }
  }
  return tidy(s);
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
        c: +n.c || Date.now(), u: +n.u || +n.c || Date.now(),
        lv: n.lv >= 1 && n.lv <= 4 ? +n.lv : 0, sub: String(n.sub || "")
      }));
    }
    if(list.length && BY_ID[id]) s.notes[id] = list; else delete s.notes[id];
  }
  s.log = s.log.filter(e => isObj(e) && typeof e.d === "string").map(e => ({
    id: String(e.id || uid()), d: e.d, text: String(e.text || ""), ts: +e.ts || Date.now(), u: +e.u || +e.ts || Date.now(),
    links: Array.isArray(e.links)
      ? e.links.filter(l => isObj(l) && BY_ID[l.t]).map(l => l.n ? {t:l.t, n:String(l.n)} : {t:l.t})
      : []
  }));
  for(const id in s.subs){
    const list = Array.isArray(s.subs[id]) ? s.subs[id].filter(x => isObj(x) && String(x.n || "").trim()).map(x => ({
      id: String(x.id || "u" + uid()), n: String(x.n).trim(), c: +x.c || Date.now(), u: +x.u || +x.c || Date.now()
    })) : [];
    if(list.length && BY_ID[id]) s.subs[id] = list; else delete s.subs[id];
  }
  for(const id in s.rel){
    const r = s.rel[id];
    if(BY_ID[id] && isObj(r)) s.rel[id] = {off:!!r.off, at:+r.at || 0}; else delete s.rel[id];
  }
  for(const key in s.slv){
    const v = +s.slv[key];
    if(BY_ID[key.split("/")[0]] && v >= 1 && v <= 4) s.slv[key] = v; else delete s.slv[key];
  }
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
      if(parsed.v !== STATE_V){
        if(!(await readKey(backupKey(parsed.v)))) await writeKey(backupKey(parsed.v), raw);
        await save();
      }
      return;
    }catch(e){}
  }
  raw = await readKey(OLD_KEY);
  if(raw){ try{ state = migrate(JSON.parse(raw)); await save(); }catch(e){} }
}

async function save(){
  clearTimeout(saveTimer);
  /* another tab may have saved since we loaded — fold its changes in instead of overwriting them */
  if(hasLocal){
    try{
      const raw = localStorage.getItem(KEY);
      const stored = raw && JSON.parse(raw);
      /* only the current format carries ids and timestamps to merge by; an older save is being upgraded right now */
      if(stored && stored.v === STATE_V) state = mergeStates(state, migrate(stored));
    }catch(e){}
  }
  const ok = await writeKey(KEY, JSON.stringify(state));
  if(!ok) store = "none";
  renderStoreNote();
}

let saveTimer = null;
function saveSoon(){ clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
/* a pending save must not be lost when the tab closes */
window.addEventListener("pagehide", () => { if(saveTimer) save(); });

/* ---------- several tabs at once ----------
   Every level, note and diary entry carries the time it last changed; deletions leave a tombstone.
   Merging two copies keeps the newer version of each piece, so tabs never undo each other.
   Import and "Vymazať všetko" start a new epoch, which replaces older copies instead of merging. */
function mergeStates(a, b){
  if((a.epoch || 0) !== (b.epoch || 0)) return (b.epoch || 0) > (a.epoch || 0) ? b : a;
  const out = emptyState();
  out.epoch = a.epoch || 0;
  const cutoff = Date.now() - 90 * 86400000;
  for(const src of [b.del, a.del]) for(const id in src)
    if(src[id] > cutoff && !(out.del[id] >= src[id])) out.del[id] = src[id];
  const alive = x => !(out.del[x.id] >= x.u);

  const ids = new Set([a.upd, b.upd, a.notes, b.notes, a.subs, b.subs].flatMap(Object.keys));
  for(const id of ids){
    const u = Math.max(a.upd[id] || 0, b.upd[id] || 0);
    if(u) out.upd[id] = u;
    const notes = newest([...(b.notes[id] || []), ...(a.notes[id] || [])]).filter(alive);
    if(notes.length) out.notes[id] = notes;
    const subs = newest([...(b.subs[id] || []), ...(a.subs[id] || [])]).filter(alive);
    if(subs.length) out.subs[id] = subs;
  }
  for(const id of new Set([a.rel, b.rel].flatMap(Object.keys))){
    const ra = a.rel[id], rb = b.rel[id];
    out.rel[id] = !rb || (ra && ra.at >= rb.at) ? ra : rb;
  }
  for(const key of new Set([a.slv, b.slv, a.slvAt, b.slvAt].flatMap(Object.keys))){
    const la = a.slvAt[key] || 0, lb = b.slvAt[key] || 0;
    const v = (la >= lb ? a : b).slv[key];
    if(v) out.slv[key] = v;
    if(la || lb) out.slvAt[key] = Math.max(la, lb);
  }
  out.log = newest([...b.log, ...a.log]).filter(alive);
  out.recent = [...new Set([...a.recent, ...b.recent])].slice(0, 8);
  out.prefs = {...b.prefs, ...a.prefs};
  return out;
}
/* one item per id, the most recently changed (ties go to the later copy = this tab) */
function newest(list){
  const m = new Map();
  for(const x of list){ const y = m.get(x.id); if(!y || x.u >= y.u) m.set(x.id, x); }
  return [...m.values()];
}
const bury = id => { state.del[id] = Date.now(); };
function newEpoch(){ state.epoch = Date.now(); }

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

/* ---------- levels: set per subtopic, computed per topic ---------- */
const touch = id => { state.upd[id] = Date.now(); };

function subsOf(tid){
  const own = state.subs[tid];
  return own ? [...SUB_LIST[tid], ...own.map(x => ({k:x.id, n:x.n, own:true}))] : SUB_LIST[tid];
}
const subLv = (tid, k) => state.slv[`${tid}/${k}`] || 0;
const subName = (tid, k) => (subsOf(tid).find(x => x.k === k) || {}).n || "";

/* all perfektne → perfektne; nothing rated → nepozreté; otherwise the rounded average, between neviem and ide to */
function lv(id){
  const subs = subsOf(id);
  let sum = 0, any = false, all4 = true;
  for(const x of subs){
    const v = subLv(id, x.k);
    sum += v;
    if(v) any = true;
    if(v !== 4) all4 = false;
  }
  if(!any) return 0;
  if(all4) return 4;
  return Math.min(3, Math.max(1, Math.round(sum / subs.length)));
}
/* 0–1: how much of the topic you have — what the score estimate counts */
function understanding(id){
  const subs = subsOf(id);
  return subs.reduce((a, x) => a + LV[subLv(id, x.k)].w, 0) / subs.length;
}
const ratedSubs = id => subsOf(id).filter(x => subLv(id, x.k)).length;

function setSubLevel(tid, k, v){
  const key = `${tid}/${k}`;
  if(v === 0) delete state.slv[key]; else state.slv[key] = v;
  state.slvAt[key] = Date.now();
  touch(tid);
}
/* every subtopic at once; returns what was there before, for undo */
function setLevel(id, v){
  const before = {};
  for(const x of subsOf(id)){ before[x.k] = subLv(id, x.k); setSubLevel(id, x.k, v); }
  return before;
}
function restoreLevels(id, before){ for(const k in before) setSubLevel(id, k, before[k]); }
const allSubsAt = (id, v) => subsOf(id).every(x => subLv(id, x.k) === v);

function addSub(tid, n){
  const now = Date.now();
  const x = {id:"u" + uid(), n, c:now, u:now};
  (state.subs[tid] ||= []).push(x);
  touch(tid);
  return x;
}
function removeSub(tid, sid){
  const list = state.subs[tid] || [];
  const i = list.findIndex(x => x.id === sid);
  if(i < 0) return null;
  const [x] = list.splice(i, 1);
  if(!list.length) delete state.subs[tid];
  bury(sid);
  touch(tid);
  return x;
}
function restoreSub(tid, x){
  delete state.del[x.id];
  x.u = Date.now();
  (state.subs[tid] ||= []).push(x);
  touch(tid);
}

const changedToday = id => state.upd[id] && isoOf(state.upd[id]) === todayIso();
const blocked = item => (item.pre||[]).filter(p => lv(p) < 3);
const dependents = id => T.filter(x => (x.pre||[]).includes(id));

/* ---------- relevance: topics you've decided won't be on the test ---------- */
const isOff = id => !!(state.rel[id] && state.rel[id].off);
function setOff(id, off){ state.rel[id] = {off, at:Date.now()}; touch(id); }
/* which tab a topic shows in: its own, or "x" = Nerelevantné */
const tabOf = x => isOff(x.id) ? "x" : x.t;
function itemsOf(k){ return T.filter(x => tabOf(x) === k); }
/* the topics that count toward the external-part estimate */
const ecItems = () => T.filter(x => x.t === "a" && !isOff(x.id));

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

function addNote(tid, sub = ""){
  const now = Date.now();
  const n = {id:uid(), title:"", body:"", c:now, u:now, lv:0, sub};
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
  bury(nid);
  return n;
}
function restoreNote(tid, n){
  delete state.del[n.id];
  n.u = Date.now();
  (state.notes[tid] ||= []).push(n);
}

const noteHaystack = id => notesOf(id).map(n => n.title + " " + n.body).join(" ");
const subHaystack = id => subsOf(id).map(x => x.n).join(" ");

/* ---------- log ---------- */
const byLogDesc = (a, b) => b.d.localeCompare(a.d) || b.ts - a.ts;
const logFor = tid => state.log.filter(e => e.links.some(l => l.t === tid)).sort(byLogDesc);
const logForNote = (tid, nid) => state.log.filter(e => e.links.some(l => l.t === tid && l.n === nid));
const sameLink = (a, b) => a.t === b.t && (a.n || null) === (b.n || null);

function addLog(d, text, links){
  const now = Date.now();
  const e = {id:uid(), d, text, ts:now, u:now, links:links.map(l => ({...l}))};
  state.log.push(e);
  return e;
}
const findLog = id => state.log.find(e => e.id === id);
function updateLog(id, patch){
  const e = findLog(id);
  if(e) Object.assign(e, patch, {u:Date.now()});
  return e;
}
function removeLog(id){
  const i = state.log.findIndex(e => e.id === id);
  if(i < 0) return null;
  bury(id);
  return state.log.splice(i, 1)[0];
}
function restoreLog(e){
  delete state.del[e.id];
  e.u = Date.now();
  state.log.push(e);
}

/* ---------- recently opened ---------- */
function markRecent(id){
  state.recent = [id, ...state.recent.filter(x => x !== id)].slice(0, 8);
}

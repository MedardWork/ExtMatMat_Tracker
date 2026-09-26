/* ============================================================
   STATE + STORAGE
   state = {
     v: 2,
     lv:    { id: 0–4 },            level per topic
     notes: { id: "text" },         free notes per topic
     upd:   { id: timestamp },      last change to level or note
     log:   [ {id, d:"YYYY-MM-DD", text, ts} ]   study diary
   }
   Two places progress can live:
     1. window.storage — exists when this page runs inside Claude
     2. localStorage   — exists when the file is opened from disk
   If neither works, the Copy / Paste buttons are the backup.
   ============================================================ */
const KEY = "maturita-mat-v2";
const OLD_KEY = "maturita-mat-progress";

const emptyState = () => ({v:2, lv:{}, notes:{}, upd:{}, log:[]});
let state = emptyState();
let tab = "a";
let filter = "all";
let query = "";
let store = "none";
let showAllLog = false;
const openNotes = new Set();
const openDesc = new Set();
let allDesc = false;

const hasClaudeStore = typeof window !== "undefined"
  && window.storage && typeof window.storage.get === "function";

const hasLocal = (()=>{
  try{ localStorage.setItem("__probe","1"); localStorage.removeItem("__probe"); return true; }
  catch(e){ return false; }
})();

if(hasClaudeStore)   store = "claude";
else if(hasLocal)    store = "local";

/* old saves: {id: 0|1|2} or {id:{p,t}} → new five-level scale */
function migrate(old){
  if(!old || typeof old !== "object") return emptyState();
  if(old.v === 2){
    const s = Object.assign(emptyState(), old);
    if(!Array.isArray(s.log)) s.log = [];
    return s;
  }
  const s = emptyState();
  const map = [0, 2, 4];
  for(const id in old){
    const v = old[id];
    const p = typeof v === "number" ? v : (v && v.p) || 0;
    if(p > 0 && BY_ID[id]) s.lv[id] = map[p] || 0;
  }
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

async function load(){
  let raw = await readKey(KEY);
  if(raw){ try{ state = migrate(JSON.parse(raw)); return; }catch(e){} }
  raw = await readKey(OLD_KEY);
  if(raw){ try{ state = migrate(JSON.parse(raw)); await save(); }catch(e){} }
}

async function save(){
  const txt = JSON.stringify(state);
  let ok = false;
  if(hasClaudeStore){ try{ await window.storage.set(KEY, txt); ok = true; }catch(e){} }
  if(hasLocal){ try{ localStorage.setItem(KEY, txt); ok = true; }catch(e){} }
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
    el.textContent = "Postup sa ukladá priamo v tomto prehliadači. Zostane tam, kým nevymažeš dáta stránok — súbor si nechaj na jednom mieste a otváraj ten istý.";
  } else {
    el.textContent = "Ukladanie tu nefunguje. Po každom sedení klikni Skopírovať postup a text si nechaj; cez Vložiť postup ho vrátiš späť.";
  }
}

/* ---------- accessors ---------- */
const lv = id => state.lv[id] || 0;
const note = id => (state.notes[id] || "");

function setLevel(id, v){
  if(v === 0) delete state.lv[id]; else state.lv[id] = v;
  state.upd[id] = Date.now();
}

const changedToday = id => state.upd[id] && isoOf(state.upd[id]) === todayIso();
const blocked = item => (item.pre||[]).filter(p => lv(p) < 3);

function itemsOf(k){ return T.filter(x => x.t === k); }

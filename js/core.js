/* ============================================================
   CORE — UI state, routing, delegated actions, toast
   Views register themselves in VIEWS; buttons say what they do
   with data-act="name" and inputs with data-in="name".
   Routes:  #/            overview
            #/temy/a|c|x  topic list for a tab (x = Nerelevantné; old #/temy/b links land on a)
            #/tema/<id>[/n/<noteId>]   one topic, optionally a note
            #/tema/<id>/t/<testId>     one topic, scrolled to one of its tests
            #/tema/<id>/teoria[/<sub>] the topic's theory, optionally scrolled to a subtopic
            #/nastroje[/<toolId>]      interactive tools, all of them or one
            #/dennik[/<entryId>]       old diary links → the diary week in the calendar
            #/info        sources, backup, shortcuts
            #/kalendar[/m|t[/<iso>[/p]]]  the study plan as a month or week calendar; p = the diary
   ============================================================ */
const ui = {
  route: {view:"prehlad"},
  tab: "a",
  filter: "all",
  query: "",
  openDesc: new Set(),
  allDesc: false,
  seq: null,          /* topic ids for ‹ › in the topic view, snapshotted from the list */
  lastTopic: null,    /* highlighted in the list when coming back */
  editing: null,      /* {t, n} note open in the editor */
  testEdit: null,     /* {t, x} test whose score, day and name are open for typing */
  pendingTest: null,  /* {t, d}: open topic t with a new test written on day d (from the calendar) */
  pendingNew: null,   /* topic id that should open with a fresh note */
  pendingSub: null,   /* …filed under this subtopic (set from the theory tab) */
  collapsed: new Set(),
  showOut: false,     /* topic list: also topics out of the chosen scope (js/ec.js) */
  sortPph: false,     /* topic list: by points per hour within a block */
  pastSub: null,      /* topic page, Úlohy z maturít: only the tasks of this subtopic */
  pastAll: false      /* … and all of them, not the newest few */
};

const VIEWS = {};
const ACTIONS = {};
const INPUTS = {};
const action  = (name, fn) => { ACTIONS[name] = fn; };
const onInput = (name, fn) => { INPUTS[name] = fn; };

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if(!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if(fn) fn(el, e);
});
document.addEventListener("input", e => {
  const el = e.target.closest("[data-in]");
  if(el && INPUTS[el.dataset.in]) INPUTS[el.dataset.in](el, e);
});

/* ---------- routing ---------- */
function parseRoute(){
  const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  switch(p[0]){
    case "temy":   return {view:"temy", tab:p[1] === "c" || p[1] === "x" ? p[1] : p[1] ? "a" : ui.tab};
    case "tema":   return BY_ID[p[1]] ? {view:"tema", id:p[1], note:p[2] === "n" ? p[3] || null : null, test:p[2] === "t" ? p[3] || null : null,
                                         tab:p[2] === "teoria" ? "teoria" : null, sub:p[2] === "teoria" ? p[3] || null : null}
                                      : {view:"temy", tab:ui.tab};
    case "nastroje": return {view:"nastroje", tool:TOOLS[p[1]] ? p[1] : null};
    case "dennik": { const e = p[1] && p[1] !== "t" && state.log.find(x => x.id === p[1]);
                     return {view:"kalendar", mode:"t", d:e ? e.d : null, notes:true, entry:e ? e.id : null}; }
    case "info":   return {view:"info"};
    case "kalendar": return {view:"kalendar", mode:p[1] === "t" ? "t" : "m", d:/^\d{4}-\d\d-\d\d$/.test(p[2] || "") ? p[2] : null, notes:p.includes("p")};
    default:       return {view:"prehlad"};
  }
}

const go = hash => { if(location.hash === hash) render(); else location.hash = hash; };
const scrollMem = {};

function render(){
  ensurePlan();
  const r = ui.route;
  const v = VIEWS[r.view];
  $$("#mainnav [data-nav]").forEach(a => a.toggleAttribute("aria-current", a.dataset.nav === r.view || (r.view === "tema" && a.dataset.nav === "temy")));
  document.body.dataset.view = r.view;
  document.title = (v.title ? v.title(r) + " · " : "") + "Maturita z matematiky";
  v.render($("#view"));
  renderMiniClock();
}

/* re-draw whatever is on screen after a data change; views may do it more surgically */
function refresh(what){
  ensurePlan();
  const v = VIEWS[ui.route.view];
  if(v.refresh) v.refresh(what); else v.render($("#view"));
  renderMiniClock();
}

window.addEventListener("hashchange", e => {
  const oldHash = new URL(e.oldURL).hash || "#/";
  scrollMem[oldHash] = window.scrollY;
  const prev = ui.route;
  if(prev.view === "tema" && ui.editing) finishEditing(true);
  ui.route = parseRoute();
  if(prev.view === "tema" && ui.testEdit && ui.route.view !== "tema") finishTest(true);   /* another topic: its render closes it */
  closePalette();
  render();
  const key = location.hash || "#/";
  if(ui.route.view === "temy" && scrollMem[key] != null) window.scrollTo(0, scrollMem[key]);
  else if(!(ui.route.view === "tema" && (ui.route.note || ui.route.test || ui.testEdit)) && !(ui.route.view === "kalendar" && ui.route.entry)) window.scrollTo(0, 0);
});

/* ---------- another tab (or window) saved ---------- */
let remotePending = false;
window.addEventListener("storage", e => {
  if(e.key !== KEY || !e.newValue) return;
  let incoming;
  try{ incoming = migrate(JSON.parse(e.newValue)); }catch(err){ return; }
  takeRemote(incoming);
});
/* fold another copy into ours and redraw if anything changed */
function takeRemote(incoming){
  const before = JSON.stringify(state);
  state = mergeStates(state, incoming);
  if(JSON.stringify(state) === before) return;
  if(ui.editing && !findNote(ui.editing.t, ui.editing.n)) ui.editing = null;
  if(ui.testEdit && !findTest(ui.testEdit.t, ui.testEdit.x)) ui.testEdit = null;
  if(cal.edit && cal.edit.startsWith("cn|e|") && !findLog(cal.edit.split("|")[2])) cal.edit = null;
  /* don't yank the text box out from under someone typing — redraw once they leave it */
  if(isTyping()) remotePending = true; else refresh("remote");
}
function isTyping(){
  const a = document.activeElement;
  return !!(a && a.closest && a.closest("#view") && a.matches("input, textarea"));
}
document.addEventListener("focusout", () => setTimeout(() => {
  if(remotePending && !isTyping()){ remotePending = false; refresh("remote"); }
}, 0));

/* ---------- toast with optional undo ---------- */
let toastTimer = null, toastUndo = null;
function toast(msg, undo){
  const t = $("#toast");
  toastUndo = undo || null;
  t.innerHTML = `<span>${esc(msg)}</span>${undo ? `<button data-act="toast-undo">Späť</button>` : ""}`;
  t.hidden = false;
  t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, undo ? 7000 : 2800);
}
function hideToast(){ const t = $("#toast"); t.classList.remove("show"); t.hidden = true; toastUndo = null; }
action("toast-undo", () => { const u = toastUndo; hideToast(); if(u) u(); });

/* briefly highlight an element that navigation just landed on */
function flashEl(el){
  if(!el) return;
  el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
}

/* ---------- level buttons, shared by every view ---------- */
/* a topic's button sets all its subtopics at once — undoable when they differed */
action("lv", el => {
  const id = el.dataset.id, v = Number(el.dataset.v);
  if(allSubsAt(id, v)) return;
  const before = setLevel(id, v);
  save();
  refresh("level");
  if(new Set(Object.values(before)).size > 1)
    toast(`Všetky podtémy (${Object.keys(before).length}) nastavené na „${LV[v].label}“.`, () => {
      restoreLevels(id, before); save(); refresh("level");
    });
});
/* move a topic to / from Nerelevantné */
action("rel", el => {
  const id = el.dataset.id, off = !isOff(id);
  const x = BY_ID[id];
  setOff(id, off);
  save();
  refresh("rel");
  toast(off ? `„${shortName(x)}“ presunuté do Nerelevantné — nepočíta sa do odhadu.` : `„${shortName(x)}“ vrátené ${TAB_INTO[x.t]}.`, () => {
    setOff(id, !off); save(); refresh("rel");
  });
});
action("slv", el => {
  const id = el.dataset.id, k = el.dataset.k, v = Number(el.dataset.v);
  ui.subSel = k;
  if(subLv(id, k) === v) return;
  setSubLevel(id, k, v);
  save();
  refresh("level");
});

/* ---------- shared bits of markup ---------- */
const LV_CLASS = v => `l${v}`;

function levelSeg(id){
  const v = lv(id);
  const x = BY_ID[id];
  return `<div class="seg" role="group" aria-label="Úroveň: ${esc(x.n)}">${LV.map(l =>
    `<button class="b${l.k}" data-act="lv" data-id="${id}" data-v="${l.k}" aria-pressed="${v === l.k}" title="${l.desc} — nastaví všetky podtémy">${l.label}</button>`
  ).join("")}</div>`;
}
function subSeg(tid, k, name){
  const v = subLv(tid, k);
  return `<div class="seg" role="group" aria-label="Úroveň: ${esc(name)}">${LV.map(l =>
    `<button class="b${l.k}" data-act="slv" data-id="${tid}" data-k="${k}" data-v="${l.k}" aria-pressed="${v === l.k}" title="${l.desc} (kláves ${l.k})">${l.label}</button>`
  ).join("")}</div>`;
}
/* one small cell per subtopic, coloured by its level */
function subMeter(id){
  const subs = subsOf(id);
  return `<span class="submeter">${subs.map(x => {
    const v = subLv(id, x.k);
    return `<i class="l${v}" title="${esc(x.n)}: ${LV[v].label}"></i>`;
  }).join("")}</span>`;
}

/* a topic (and optionally one of its notes) as a clickable chip */
function linkChip(link, opts = {}){
  const x = BY_ID[link.t];
  if(!x) return "";
  const n = link.n ? findNote(link.t, link.n) : null;
  const href = `#/tema/${link.t}${n ? "/n/" + n.id : ""}`;
  const rm = opts.remove ? `<button class="chip-x" data-act="${opts.remove}" data-t="${link.t}" data-n="${link.n || ""}" ${opts.data || ""} aria-label="Odobrať">×</button>` : "";
  return `<span class="chip ${LV_CLASS(lv(link.t))}"><a href="${href}" title="${esc(x.n)}"><i class="dot l${lv(link.t)}"></i>${esc(shortName(x))}${n ? `<span class="chip-note">✎ ${esc(noteTitle(n))}</span>` : ""}</a>${rm}</span>`;
}

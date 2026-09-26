/* ============================================================
   CORE — UI state, routing, delegated actions, toast
   Views register themselves in VIEWS; buttons say what they do
   with data-act="name" and inputs with data-in="name".
   Routes:  #/            overview
            #/temy/a|b|c  topic list for a tab
            #/tema/<id>[/n/<noteId>]   one topic, optionally a note
            #/dennik[/<entryId>]       study diary (#/dennik/t/<id>: only entries about a topic)
            #/info        sources, backup, shortcuts
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
  pendingNew: null,   /* topic id that should open with a fresh note */
  collapsed: new Set()
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
    case "temy":   return {view:"temy", tab:["a","b","c"].includes(p[1]) ? p[1] : ui.tab};
    case "tema":   return BY_ID[p[1]] ? {view:"tema", id:p[1], note:p[2] === "n" ? p[3] || null : null}
                                      : {view:"temy", tab:ui.tab};
    case "dennik": return p[1] === "t" && BY_ID[p[2]] ? {view:"dennik", topic:p[2]} : {view:"dennik", entry:p[1] || null};
    case "info":   return {view:"info"};
    default:       return {view:"prehlad"};
  }
}

const go = hash => { if(location.hash === hash) render(); else location.hash = hash; };
const scrollMem = {};

function render(){
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
  closePalette();
  render();
  const key = location.hash || "#/";
  if(ui.route.view === "temy" && scrollMem[key] != null) window.scrollTo(0, scrollMem[key]);
  else if(!(ui.route.view === "tema" && ui.route.note) && !(ui.route.view === "dennik" && ui.route.entry)) window.scrollTo(0, 0);
});

/* ---------- another tab saved ---------- */
let remotePending = false;
window.addEventListener("storage", e => {
  if(e.key !== KEY || !e.newValue) return;
  let incoming;
  try{ incoming = migrate(JSON.parse(e.newValue)); }catch(err){ return; }
  const before = JSON.stringify(state);
  state = mergeStates(state, incoming);
  if(JSON.stringify(state) === before) return;
  if(ui.editing && !findNote(ui.editing.t, ui.editing.n)) ui.editing = null;
  if(jr.edit && !findLog(jr.edit)) jr.edit = null;
  /* don't yank the text box out from under someone typing — redraw once they leave it */
  if(isTyping()) remotePending = true; else refresh("remote");
});
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
action("lv", el => {
  const id = el.dataset.id, v = Number(el.dataset.v);
  if(lv(id) === v) return;
  setLevel(id, v);
  save();
  refresh("level");
});

/* ---------- shared bits of markup ---------- */
const LV_CLASS = v => `l${v}`;

function levelSeg(id, big){
  const v = lv(id);
  const x = BY_ID[id];
  return `<div class="seg${big ? " big" : ""}" role="group" aria-label="Úroveň: ${esc(x.n)}">${LV.map(l =>
    `<button class="b${l.k}" data-act="lv" data-id="${id}" data-v="${l.k}" aria-pressed="${v === l.k}" title="${l.desc}${big ? ` (kláves ${l.k})` : ""}">${l.label}</button>`
  ).join("")}</div>`;
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

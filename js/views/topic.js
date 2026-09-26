/* ============================================================
   TOPIC — one topic on the whole page: level, named notes,
   description, prerequisites and the diary entries that mention it
   Keys (when not typing): ← → previous / next · 0–4 level · N new note · Esc back to list
   ============================================================ */
const qlog = {};   /* per-topic quick diary draft: {text, n} */

VIEWS.tema = {
  title: r => shortName(BY_ID[r.id]),
  render(host){
    const id = ui.route.id, x = BY_ID[id];
    if(ui.editing && ui.editing.t !== id) finishEditing(true);
    markRecent(id); saveSoon();
    ui.lastTopic = id;
    if(!ui.seq || !ui.seq.includes(id)){ ui.seq = itemsOf(x.t).map(y => y.id); ui.seqLabel = ""; }
    if(ui.pendingNew === id){ ui.pendingNew = null; startNote(id); }

    host.innerHTML = `<article class="page topic${ui.editing ? " editing" : ""}" id="topicPage">
      <div class="t-nav" id="tNav"></div>
      <header class="t-head" id="tHead"></header>
      <div class="t-grid">
        <section class="t-notes" id="tNotes" aria-label="Poznámky"></section>
        <aside class="t-side" id="tSide"></aside>
      </div>
    </article>`;
    drawTNav(); drawTHead(); drawTNotes(); drawTSide();

    if(ui.editing) focusEditor();
    else if(ui.route.note){
      const el = $(`#note-${ui.route.note}`);
      if(el){ ui.collapsed.delete(ui.route.note); el.classList.remove("collapsed"); el.scrollIntoView({block:"start"}); flashEl(el); }
    }
  },
  refresh(what){
    if(what === "level"){ drawTNav(); drawTHead(); drawTSide(); }
    else { drawTNav(); drawTHead(); drawTNotes(); drawTSide(); }
  },
  key(e){
    const id = ui.route.id;
    const [prev, next] = neighbours(id);
    if(e.key === "ArrowLeft" && prev){ e.preventDefault(); go(`#/tema/${prev}`); }
    else if(e.key === "ArrowRight" && next){ e.preventDefault(); go(`#/tema/${next}`); }
    else if(/^[0-4]$/.test(e.key)){ setLevel(id, Number(e.key)); save(); refresh("level"); }
    else if(e.key === "n" || e.key === "N"){ e.preventDefault(); ACTIONS["note-new"](); }
    else if(e.key === "Escape"){ go(`#/temy/${BY_ID[id].t}`); }
  }
};

function neighbours(id){
  const i = ui.seq.indexOf(id);
  return [ui.seq[i - 1] || null, ui.seq[i + 1] || null];
}

/* ---------- top strip: back, breadcrumb, ‹ › ---------- */
function drawTNav(){
  const id = ui.route.id, x = BY_ID[id];
  const [prev, next] = neighbours(id);
  const pos = ui.seq.indexOf(id);
  const arrow = (to, cls, label, key) => to
    ? `<a class="t-step ${cls}" href="#/tema/${to}" title="${esc(BY_ID[to].n)} (${key})"><span>${label}</span><b>${esc(shortName(BY_ID[to]))}</b></a>`
    : `<span class="t-step ${cls} off"><span>${label}</span></span>`;
  $("#tNav").innerHTML = `
    <a class="t-back" href="#/temy/${x.t}" title="Späť na zoznam (Esc)">← ${TABS.find(t => t.k === x.t).label.split(" · ")[0]}</a>
    <span class="t-pos">${pos + 1} / ${ui.seq.length}${ui.seqLabel ? ` · ${ui.seqLabel}` : ""}</span>
    <span class="t-steps">${arrow(prev, "prev", "‹ Predošlá", "←")}${arrow(next, "next", "Ďalšia ›", "→")}</span>`;
}

/* ---------- title + level ---------- */
function drawTHead(){
  const id = ui.route.id, x = BY_ID[id], v = lv(id);
  const head = $("#tHead");
  head.className = `t-head s${v}`;
  const upd = state.upd[id] ? `<span class="upd${changedToday(id) ? " today" : ""}">${changedToday(id) ? "zmenené dnes" : "zmenené " + fmtIso(isoOf(state.upd[id]))}</span>` : "";
  const weight = x.t !== "c" ? `<span class="t-weight">blok <b>${AREAS[x.area].w}</b> úloh v teste</span>` : "";
  head.innerHTML = `
    <div class="t-kicker">${esc(areaName(x))} · ${TAB_LABEL[x.t]}${x.src ? ` <span class="src">${x.src}</span>` : ""}${weight}</div>
    <h1 class="t-title">${x.n}</h1>
    ${x.dk ? `<div class="t-dk"><span class="dkterm">${x.dk}</span></div>` : ""}
    <div class="t-level">${levelSeg(id, true)}${upd}</div>
    ${x.m ? `<p class="t-remark">${x.m}</p>` : ""}`;
}

/* ---------- notes ---------- */
function drawTNotes(){
  const id = ui.route.id;
  const list = sortedNotes(id);
  const order = state.prefs.noteOrder === "old" ? "old" : "new";
  let html = `<div class="notes-head">
    <h2>Poznámky${list.length ? ` <span class="count">${list.length}</span>` : ""}</h2>
    ${list.length > 1 ? `<button class="sort-btn" data-act="note-order" title="Zoradené podľa dátumu vytvorenia">${order === "old" ? "Najstaršie hore ↑" : "Najnovšie hore ↓"}</button>` : ""}
    <button class="btn" data-act="note-new" title="Nová poznámka (N)">+ Nová poznámka</button>
  </div>`;

  if(!list.length){
    html += `<div class="notes-empty">
      <p><b>Ešte tu nemáš žiadnu poznámku.</b></p>
      <p>Dobré poznámky sú krátke a konkrétne — jeden vzorec, jedna typická chyba, jeden vyriešený príklad. Každej daj názov, neskôr ju nájdeš cez <kbd>/</kbd>.</p>
      <button class="btn" data-act="note-new">+ Prvá poznámka</button>
    </div>`;
  }

  for(const n of list){
    if(ui.editing && ui.editing.n === n.id){ html += noteEditorHtml(id, n); continue; }
    const logs = logForNote(id, n.id);
    const edited = n.u - n.c > 60000 ? ` · upravené ${fmtAgo(isoOf(n.u))}` : "";
    const folded = ui.collapsed.has(n.id);
    html += `<article class="note${folded ? " collapsed" : ""}" id="note-${n.id}" data-note="${id}/${n.id}">
      <header class="note-h">
        <button class="note-fold" data-act="note-fold" data-n="${n.id}" aria-expanded="${!folded}" title="${folded ? "Rozbaliť" : "Zbaliť"}">▾</button>
        <div class="note-hd">
          <h3 class="note-title">${inline(noteTitle(n))}</h3>
          <div class="note-date">${fmtIso(isoOf(n.c))} · ${weekdayOf(isoOf(n.c))}${edited}${logs.length ? ` · <a href="#/dennik/${logs.sort(byLogDesc)[0].id}">v denníku ${logs.length}×</a>` : ""}</div>
        </div>
        <div class="note-acts">
          <button data-act="note-log" data-n="${n.id}" title="Zapísať do denníka s odkazom na túto poznámku">→ Denník</button>
          <button data-act="note-edit" data-n="${n.id}">Upraviť</button>
          <button class="danger" data-act="note-del" data-n="${n.id}" title="Zmazať poznámku">Zmazať</button>
        </div>
      </header>
      <div class="note-body md">${n.body.trim() ? md(n.body, {checks:true}) : `<p class="muted">Prázdna poznámka.</p>`}</div>
    </article>`;
  }
  $("#tNotes").innerHTML = html;
  mountEditors($("#tNotes"));
}

function noteEditorHtml(tid, n){
  const key = `note:${tid}:${n.id}`;
  EDITORS[key] = {
    onChange: text => { updateNote(tid, n.id, {body:text}); savedMark(); },
    onDone: () => finishEditing()
  };
  return `<article class="note editing" id="note-${n.id}">
    <input class="note-title-in" data-in="note-title" data-n="${n.id}" value="${esc(n.title)}"
      placeholder="Názov — napr. Skúška koreňov, Vzorce, Príklad z písomky" aria-label="Názov poznámky">
    ${editorHtml(key, n.body, {rows:10, placeholder:"Čo si zistil, kde robíš chyby, vzorce, vyriešený príklad…\n\nVzorec napíš medzi dolármi: $x^2 - 5x + 6 = 0$ — alebo klikni na ƒ Vzorec."})}
    <div class="note-edit-foot">
      <span class="saved" id="savedMark">Uložené</span>
      <button class="btn ghost" data-act="note-del" data-n="${n.id}">Zmazať</button>
      <button class="btn" data-act="note-done">Hotovo</button>
    </div>
  </article>`;
}

const savedMark = (() => {
  let t = null;
  return () => {
    saveSoon();
    const el = $("#savedMark");
    if(!el) return;
    el.textContent = "Ukladá sa…"; el.classList.add("busy");
    clearTimeout(t);
    t = setTimeout(() => { el.textContent = "Uložené"; el.classList.remove("busy"); }, 600);
  };
})();

function startNote(tid){
  const n = addNote(tid);
  ui.editing = {t:tid, n:n.id};
  ui.collapsed.delete(n.id);
  return n;
}

function focusEditor(){
  const page = $("#topicPage");
  if(page) page.classList.add("editing");
  const el = ui.editing && $(`#note-${ui.editing.n}`);
  if(!el) return;
  el.scrollIntoView({block:"start"});
  const n = findNote(ui.editing.t, ui.editing.n);
  const target = n && !n.title && !n.body ? $(".note-title-in", el) : $(".ed-in", el);
  if(target){ target.focus(); if(target.setSelectionRange) target.setSelectionRange(target.value.length, target.value.length); }
}

function finishEditing(silent){
  const ed = ui.editing;
  if(!ed) return;
  ui.editing = null;
  const n = findNote(ed.t, ed.n);
  if(n && !n.title.trim() && !n.body.trim()) removeNote(ed.t, ed.n);
  save();
  if(silent || ui.route.view !== "tema") return;
  $("#topicPage").classList.remove("editing");
  drawTNotes(); drawTSide();
  flashEl($(`#note-${ed.n}`));
}

onInput("note-title", el => {
  if(!ui.editing) return;
  updateNote(ui.editing.t, el.dataset.n, {title:el.value});
  savedMark();
});
document.addEventListener("keydown", e => {
  if(!e.target.matches || !e.target.matches(".note-title-in")) return;
  if(e.key === "Enter" || e.key === "ArrowDown"){ e.preventDefault(); const ta = $(".ed-in", e.target.closest(".note")); if(ta) ta.focus(); }
  if(e.key === "Escape"){ e.preventDefault(); finishEditing(); }
});

action("note-new", () => {
  if(ui.route.view !== "tema") return;
  if(ui.editing) finishEditing(true);
  startNote(ui.route.id);
  save();
  drawTNotes(); drawTHead();
  focusEditor();
});
action("note-edit", el => {
  if(ui.editing) finishEditing(true);
  ui.editing = {t:ui.route.id, n:el.dataset.n};
  drawTNotes();
  focusEditor();
});
action("note-done", () => finishEditing());
action("note-del", el => {
  const tid = ui.route.id, nid = el.dataset.n;
  const n = findNote(tid, nid);
  if(!n) return;
  const empty = !n.title.trim() && !n.body.trim();
  if(ui.editing && ui.editing.n === nid){ ui.editing = null; $("#topicPage").classList.remove("editing"); }
  removeNote(tid, nid);
  touch(tid);
  save();
  drawTNotes(); drawTSide();
  if(!empty) toast(`Poznámka „${noteTitle(n)}“ zmazaná.`, () => {
    restoreNote(tid, n); save();
    if(ui.route.view === "tema" && ui.route.id === tid){ drawTNotes(); drawTSide(); }
  });
});
action("note-fold", el => {
  const nid = el.dataset.n;
  if(ui.collapsed.has(nid)) ui.collapsed.delete(nid); else ui.collapsed.add(nid);
  const art = $(`#note-${nid}`);
  art.classList.toggle("collapsed", ui.collapsed.has(nid));
  el.setAttribute("aria-expanded", !ui.collapsed.has(nid));
});
action("note-order", () => {
  state.prefs.noteOrder = state.prefs.noteOrder === "old" ? "new" : "old";
  saveSoon();
  drawTNotes();
});
action("md-check", el => {
  const host = el.closest("[data-note]");
  if(!host) return;
  const [tid, nid] = host.dataset.note.split("/");
  const n = findNote(tid, nid);
  if(!n) return;
  updateNote(tid, nid, {body:toggleCheck(n.body, Number(el.dataset.i))});
  saveSoon();
  el.closest("li").classList.toggle("done", el.checked);
});
action("note-log", el => {
  const tid = ui.route.id;
  (qlog[tid] ||= {text:""}).n = el.dataset.n;
  drawTSide();
  const ta = $("#qlogText");
  ta.scrollIntoView({block:"center", behavior:"smooth"});
  ta.focus({preventScroll:true});
});

/* ---------- side column ---------- */
function drawTSide(){
  const id = ui.route.id, x = BY_ID[id];
  let html = "";

  const dsc = DESC[id];
  if(dsc) html += `<section class="card t-desc">
    <h2>O čom to je</h2>
    <p>${esc(dsc[0])}</p>
    <div class="ex"><b>Typická úloha</b>${esc(dsc[1])}</div>
  </section>`;

  const pre = x.pre || [];
  const deps = dependents(id);
  if(pre.length || deps.length){
    const group = (label, ids, hint) => ids.length
      ? `<div class="rel"><h3>${label}</h3>${hint ? `<p class="rel-hint">${hint}</p>` : ""}<div class="chips">${ids.map(i => linkChip({t:i})).join("")}</div></div>` : "";
    const b = blocked(x);
    html += `<section class="card t-rel">
      <h2>Súvislosti</h2>
      ${group("Najprv treba vedieť", pre, b.length ? `Ešte nie na <i>ide to</i>: ${b.map(i => esc(shortName(BY_ID[i]))).join(", ")}` : "")}
      ${group("Na toto nadväzuje", deps.map(d => d.id))}
    </section>`;
  }

  const q = qlog[id] ||= {text:""};
  const qn = q.n && findNote(id, q.n);
  const logs = logFor(id);
  html += `<section class="card t-log">
    <h2>V denníku${logs.length ? ` <span class="count">${logs.length}</span>` : ""}</h2>
    <div class="qlog">
      <textarea id="qlogText" data-in="qlog" rows="3" placeholder="Čo si dnes k tejto téme robil? Stačí pár slov.">${esc(q.text)}</textarea>
      <div class="qlog-foot">
        <div class="chips">${linkChip({t:id})}${qn ? linkChip({t:id, n:q.n}, {remove:"qlog-unnote"}) : ""}</div>
        <button class="btn small" data-act="qlog-add">Zapísať · dnes</button>
      </div>
    </div>
    ${logs.length ? `<ul class="side-log">${logs.slice(0, 6).map(e => {
      const notes = e.links.filter(l => l.t === id && l.n && findNote(id, l.n));
      return `<li><a href="#/dennik/${e.id}">
        <span class="sl-date">${fmtAgo(e.d)}</span>
        <span class="sl-text">${inline(plainText(e.text, 120)) || "<i>bez textu</i>"}</span>
        ${notes.length ? `<span class="sl-notes">${notes.map(l => "✎ " + esc(noteTitle(findNote(id, l.n)))).join(" · ")}</span>` : ""}
      </a></li>`;
    }).join("")}</ul>
    ${logs.length > 6 ? `<a class="more" href="#/dennik/t/${id}">Všetky záznamy k téme (${logs.length}) →</a>` : ""}`
    : `<p class="muted small">Záznamy z denníka, ktoré spomínajú túto tému, sa zobrazia tu.</p>`}
  </section>`;

  $("#tSide").innerHTML = html;
}

onInput("qlog", el => { (qlog[ui.route.id] ||= {text:""}).text = el.value; });
document.addEventListener("keydown", e => {
  if(e.target.id === "qlogText" && (e.ctrlKey || e.metaKey) && e.key === "Enter"){ e.preventDefault(); ACTIONS["qlog-add"](); }
});
action("qlog-unnote", () => { qlog[ui.route.id].n = null; drawTSide(); });
action("qlog-add", () => {
  const id = ui.route.id;
  const q = qlog[id] ||= {text:""};
  const links = [{t:id}];
  if(q.n && findNote(id, q.n)) links[0] = {t:id, n:q.n};
  const e = addLog(todayIso(), q.text.trim(), links);
  qlog[id] = {text:""};
  save();
  drawTSide(); drawTNotes();
  toast("Zapísané do denníka.", () => {
    removeLog(e.id); save();
    if(ui.route.view === "tema"){ drawTSide(); drawTNotes(); }
  });
});

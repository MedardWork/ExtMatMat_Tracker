/* ============================================================
   TOPIC — one topic on the whole page: subtopics with their own levels,
   named notes, description, prerequisites and the diary entries that mention it
   Keys (when not typing): ← → previous / next topic · ↑ ↓ pick a subtopic · 0–4 its level
                           N new note · Esc back to list
   ============================================================ */
const qlog = {};   /* per-topic quick diary draft: {text, n} */
const nf = {t:null, sub:null, lv:null};   /* note filter on the open topic: subtopic key, note level */

VIEWS.tema = {
  title: r => shortName(BY_ID[r.id]),
  render(host){
    const id = ui.route.id, x = BY_ID[id];
    if(ui.editing && ui.editing.t !== id) finishEditing(true);
    markRecent(id); saveSoon();
    ui.lastTopic = id;
    if(!ui.seq || !ui.seq.includes(id)){ ui.seq = itemsOf(tabOf(x)).map(y => y.id); ui.seqLabel = ""; }
    if(ui.pendingNew === id){ ui.pendingNew = null; startNote(id); }
    if(nf.t !== id){ nf.t = id; nf.sub = null; nf.lv = null; ui.subSel = null; }

    host.innerHTML = `<article class="page topic${ui.editing ? " editing" : ""}" id="topicPage">
      <div class="t-nav" id="tNav"></div>
      <header class="t-head" id="tHead"></header>
      <div class="t-grid">
        <div class="t-main">
          <section class="card t-subs" id="tSubs" aria-label="Podtémy"></section>
          <section class="t-notes" id="tNotes" aria-label="Poznámky"></section>
        </div>
        <aside class="t-side" id="tSide"></aside>
      </div>
    </article>`;
    drawTNav(); drawTHead(); drawTSubs(); drawTNotes(); drawTSide();

    if(ui.editing) focusEditor();
    else if(ui.route.note){
      const el = $(`#note-${ui.route.note}`);
      if(el){ ui.collapsed.delete(ui.route.note); el.classList.remove("collapsed"); el.scrollIntoView({block:"start"}); flashEl(el); }
    }
  },
  refresh(what){
    if(what === "level"){ drawTNav(); drawTHead(); drawTSubs(); drawTSide(); }
    else { drawTNav(); drawTHead(); drawTSubs(); drawTNotes(); drawTSide(); }
  },
  key(e){
    const id = ui.route.id;
    const [prev, next] = neighbours(id);
    const subs = subsOf(id);
    const i = subs.findIndex(x => x.k === ui.subSel);
    if(e.key === "ArrowLeft" && prev){ e.preventDefault(); go(`#/tema/${prev}`); }
    else if(e.key === "ArrowRight" && next){ e.preventDefault(); go(`#/tema/${next}`); }
    else if(e.key === "ArrowDown" || e.key === "ArrowUp"){
      e.preventDefault();
      const j = i < 0 ? 0 : Math.max(0, Math.min(subs.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)));
      ui.subSel = subs[j].k;
      drawTSubs();
      const row = $(`#tSubs .sub-row.sel`);
      if(row) row.scrollIntoView({block:"nearest"});
    }
    else if(/^[0-4]$/.test(e.key)){
      const k = i < 0 ? subs[0].k : ui.subSel;
      ui.subSel = k;
      setSubLevel(id, k, Number(e.key)); save(); refresh("level");
    }
    else if(e.key === "n" || e.key === "N"){ e.preventDefault(); ACTIONS["note-new"](); }
    else if(e.key === "Escape"){ go(`#/temy/${tabOf(BY_ID[id])}`); }
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
    <a class="t-back" href="#/temy/${tabOf(x)}" title="Späť na zoznam (Esc)">← ${TAB_LABEL[tabOf(x)]}</a>
    <span class="t-pos">${pos + 1} / ${ui.seq.length}${ui.seqLabel ? ` · ${ui.seqLabel}` : ""}</span>
    <span class="t-steps">${arrow(prev, "prev", "‹ Predošlá", "←")}${arrow(next, "next", "Ďalšia ›", "→")}</span>`;
}

/* ---------- title + level ---------- */
function drawTHead(){
  const id = ui.route.id, x = BY_ID[id], v = lv(id);
  const head = $("#tHead");
  head.className = `t-head s${v}`;
  const upd = state.upd[id] ? `<span class="upd${changedToday(id) ? " today" : ""}">${changedToday(id) ? "zmenené dnes" : "zmenené " + fmtIso(isoOf(state.upd[id]))}</span>` : "";
  const weight = isOff(id) ? `<span class="t-weight off">mimo odhadu</span>`
    : x.t !== "c" ? `<span class="t-weight">blok <b>${AREAS[x.area].w}</b> úloh v teste</span>` : "";
  head.innerHTML = `
    <div class="t-kicker">${esc(areaName(x))} · ${TAB_LABEL[tabOf(x)]}${x.src ? ` <span class="src">${x.src}</span>` : ""}${weight}</div>
    <h1 class="t-title">${x.n}</h1>
    ${x.dk ? `<div class="t-dk"><span class="dkterm">${x.dk}</span></div>` : ""}
    <div class="t-level">
      <span class="lv-pill l${v}" title="Počíta sa z podtém">${LV[v].label}</span>
      ${subMeter(id)}
      <span class="t-pct">porozumenie <b>${Math.round(understanding(id) * 100)} %</b> · ohodnotené ${ratedSubs(id)} z ${subsOf(id).length} podtém</span>
      ${upd}
    </div>
    <div class="t-rel">${isOff(id)
      ? `<span class="t-rel-note">Táto téma je v <b>Nerelevantné</b> — nepočíta sa do odhadu ani do „Čo ďalej“.</span> <button class="btn ghost small" data-act="rel" data-id="${id}">↩ Vrátiť ${TAB_INTO[x.t]}</button>`
      : `<button class="linkish rel-link" data-act="rel" data-id="${id}">⊘ Nebude na teste — vyradiť z odhadu</button>`}</div>
    ${x.m ? `<p class="t-remark">${x.m}</p>` : ""}`;
}

/* ---------- subtopics ---------- */
function drawTSubs(){
  const id = ui.route.id;
  const subs = subsOf(id);
  const counts = {};
  notesOf(id).forEach(n => { if(n.sub) counts[n.sub] = (counts[n.sub] || 0) + 1; });
  const rows = subs.map(x => {
    const v = subLv(id, x.k);
    const n = counts[x.k] || 0;
    return `<div class="sub-row s${v}${ui.subSel === x.k ? " sel" : ""}" data-act="sub-sel" data-k="${x.k}">
      <div class="sub-main">
        <span class="sub-name">${esc(x.n)}${x.own ? ` <em class="sub-own">vlastná</em>` : ""}</span>
        <span class="sub-tools">
          ${n ? `<button class="sub-notes${nf.sub === x.k ? " on" : ""}" data-act="sub-filter" data-k="${x.k}" title="Zobraziť len poznámky k tejto podtéme">✎ ${n}</button>` : ""}
          <button class="sub-new" data-act="note-new" data-sub="${x.k}" title="Nová poznámka k tejto podtéme">+ poznámka</button>
          ${x.own ? `<button class="sub-del" data-act="sub-del" data-k="${x.k}" title="Odstrániť vlastnú podtému">×</button>` : ""}
        </span>
      </div>
      ${subSeg(id, x.k, x.n)}
    </div>`;
  }).join("");
  $("#tSubs").innerHTML = `
    <div class="subs-head">
      <h2>Podtémy</h2>
      <span class="subs-hint"><kbd>↑</kbd><kbd>↓</kbd> vyber · <kbd>0</kbd>–<kbd>4</kbd> úroveň</span>
      <label class="subs-all">Všetky na
        <select data-in="subs-all" aria-label="Nastaviť všetky podtémy"><option value="">—</option>${LV.map(l => `<option value="${l.k}">${l.label}</option>`).join("")}</select>
      </label>
    </div>
    <div class="sub-list">${rows}</div>
    <div class="sub-add"><input id="subNew" type="text" placeholder="+ Pridať vlastnú podtému (Enter)" aria-label="Nová podtéma" maxlength="120"></div>`;
}

action("sub-sel", el => {
  ui.subSel = el.dataset.k;
  $$("#tSubs .sub-row").forEach(r => r.classList.toggle("sel", r.dataset.k === ui.subSel));
});
onInput("subs-all", el => {
  if(el.value === "") return;
  ACTIONS.lv({dataset:{id:ui.route.id, v:el.value}});
});
document.addEventListener("keydown", e => {
  if(e.target.id !== "subNew") return;
  if(e.key === "Escape"){ e.target.value = ""; e.target.blur(); return; }
  if(e.key !== "Enter" || !e.target.value.trim()) return;
  e.preventDefault();
  const x = addSub(ui.route.id, e.target.value.trim());
  ui.subSel = x.id;
  save();
  drawTSubs(); drawTHead();
  $("#subNew").focus();
});
action("sub-del", el => {
  const tid = ui.route.id;
  const x = removeSub(tid, el.dataset.k);
  if(!x) return;
  if(nf.sub === x.id) nf.sub = null;
  save(); refresh();
  toast(`Podtéma „${x.n}“ odstránená.`, () => { restoreSub(tid, x); save(); refresh(); });
});
action("sub-filter", el => {
  nf.sub = nf.sub === el.dataset.k ? null : el.dataset.k;
  drawTSubs(); drawTNotes();
  $("#tNotes").scrollIntoView({behavior:"smooth", block:"start"});
});

/* ---------- notes ---------- */
const NOTE_LV = [1, 2, 3, 4];

/* how well you understand what a note says — the same scale as topics, without "nepozreté" */
function noteLvSeg(n){
  return `<div class="nlv" role="group" aria-label="Ako rozumieš tejto poznámke">
    <span class="nlv-label">Rozumiem:</span>${NOTE_LV.map(v =>
      `<button class="nb${v}" data-act="note-lv" data-n="${n.id}" data-v="${v}" aria-pressed="${n.lv === v}" title="${LV[v].desc}">${LV[v].label}</button>`
    ).join("")}</div>`;
}

function drawTNotes(){
  const id = ui.route.id;
  const all = sortedNotes(id);
  const list = all.filter(n => (!nf.sub || n.sub === nf.sub) && (nf.lv === null || (n.lv || 0) === nf.lv));
  const order = state.prefs.noteOrder === "old" ? "old" : "new";

  /* how the notes split by understanding — each chip filters */
  const byLv = {};
  all.forEach(n => { byLv[n.lv || 0] = (byLv[n.lv || 0] || 0) + 1; });
  const rated = all.some(n => n.lv);
  const chips = [];
  if(nf.sub) chips.push(`<button class="chip active" data-act="sub-filter" data-k="${nf.sub}">Podtéma: ${esc(subName(id, nf.sub))} ×</button>`);
  if(rated) [4, 3, 2, 1, 0].forEach(v => {
    if(!byLv[v]) return;
    chips.push(`<button class="chip${nf.lv === v ? " active" : ""}" data-act="note-lv-filter" data-v="${v}"><i class="dot l${v}"></i>${v ? LV[v].label : "bez hodnotenia"} <span class="chip-n">${byLv[v]}</span></button>`);
  });

  let html = `<div class="notes-head">
    <h2>Poznámky${all.length ? ` <span class="count">${all.length}</span>` : ""}</h2>
    ${all.length > 1 ? `<button class="sort-btn" data-act="note-order" title="Zoradené podľa dátumu vytvorenia">${order === "old" ? "Najstaršie hore ↑" : "Najnovšie hore ↓"}</button>` : ""}
    <button class="btn" data-act="note-new" title="Nová poznámka (N)">+ Nová poznámka</button>
  </div>
  ${chips.length ? `<div class="chips notes-filter">${chips.join("")}</div>` : ""}`;

  if(all.length && !list.length){
    html += `<p class="empty">Pri tomto filtri tu nie je žiadna poznámka. <button class="linkish" data-act="note-filter-clear">Zobraziť všetky</button></p>`;
  }

  if(!all.length){
    html += `<div class="notes-empty">
      <p><b>Ešte tu nemáš žiadnu poznámku.</b></p>
      <p>Dobré poznámky sú krátke a konkrétne — jeden vzorec, jedna typická chyba, jeden vyriešený príklad. Každej daj názov, neskôr ju nájdeš cez <kbd>/</kbd>.</p>
      <button class="btn" data-act="note-new">+ Prvá poznámka</button>
    </div>`;
  }

  const editingHidden = ui.editing && ui.editing.t === id && !list.some(n => n.id === ui.editing.n);
  for(const n of editingHidden ? [findNote(id, ui.editing.n), ...list].filter(Boolean) : list){
    if(ui.editing && ui.editing.n === n.id){ html += noteEditorHtml(id, n); continue; }
    const logs = logForNote(id, n.id);
    const edited = n.u - n.c > 60000 ? ` · upravené ${fmtAgo(isoOf(n.u))}` : "";
    const folded = ui.collapsed.has(n.id);
    const sn = n.sub && subName(id, n.sub);
    html += `<article class="note nl${n.lv || 0}${folded ? " collapsed" : ""}" id="note-${n.id}" data-note="${id}/${n.id}">
      <header class="note-h">
        <button class="note-fold" data-act="note-fold" data-n="${n.id}" aria-expanded="${!folded}" title="${folded ? "Rozbaliť" : "Zbaliť"}">▾</button>
        <div class="note-hd">
          <h3 class="note-title">${inline(noteTitle(n))}</h3>
          <div class="note-date">${sn ? `<button class="note-sub" data-act="sub-filter" data-k="${n.sub}" title="Poznámky k tejto podtéme">${esc(sn)}</button>` : ""}${fmtIso(isoOf(n.c))} · ${weekdayOf(isoOf(n.c))}${edited}${logs.length ? ` · <a href="#/dennik/${logs.sort(byLogDesc)[0].id}">v denníku ${logs.length}×</a>` : ""}</div>
          ${noteLvSeg(n)}
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
  return `<article class="note editing nl${n.lv || 0}" id="note-${n.id}">
    <input class="note-title-in" data-in="note-title" data-n="${n.id}" value="${esc(n.title)}"
      placeholder="Názov — napr. Skúška koreňov, Vzorce, Príklad z písomky" aria-label="Názov poznámky">
    <div class="note-meta-in">
      <label class="note-sub-in">Podtéma
        <select data-in="note-sub" data-n="${n.id}">
          <option value="">celá téma</option>
          ${subsOf(tid).map(x => `<option value="${x.k}"${n.sub === x.k ? " selected" : ""}>${esc(x.n)}</option>`).join("")}
        </select>
      </label>
      ${noteLvSeg(n)}
    </div>
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

function startNote(tid, sub = nf.t === tid && nf.sub || ""){
  const n = addNote(tid, sub);
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
  drawTSubs(); drawTNotes(); drawTSide();
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

action("note-new", el => {
  if(ui.route.view !== "tema") return;
  if(ui.editing) finishEditing(true);
  const sub = el && el.dataset && el.dataset.sub;
  startNote(ui.route.id, sub === undefined ? undefined : sub);
  save();
  drawTSubs(); drawTNotes(); drawTHead();
  focusEditor();
});
action("note-lv", el => {
  const tid = ui.route.id, nid = el.dataset.n, v = Number(el.dataset.v);
  const n = findNote(tid, nid);
  if(!n) return;
  updateNote(tid, nid, {lv: n.lv === v ? 0 : v});   /* clicking the chosen level again clears it */
  saveSoon();
  if(ui.editing && ui.editing.n === nid){
    /* don't redraw an open editor — just flip the buttons */
    const art = $(`#note-${nid}`);
    art.className = art.className.replace(/\bnl\d\b/, `nl${n.lv}`);
    $$(`[data-act="note-lv"]`, art).forEach(b => b.setAttribute("aria-pressed", Number(b.dataset.v) === n.lv));
  } else drawTNotes();
});
action("note-lv-filter", el => {
  const v = Number(el.dataset.v);
  nf.lv = nf.lv === v ? null : v;
  drawTNotes();
});
action("note-filter-clear", () => { nf.sub = null; nf.lv = null; drawTSubs(); drawTNotes(); });
onInput("note-sub", el => {
  if(!ui.editing) return;
  updateNote(ui.editing.t, el.dataset.n, {sub:el.value});
  savedMark();
  drawTSubs();
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
  drawTSubs(); drawTNotes(); drawTSide();
  if(!empty) toast(`Poznámka „${noteTitle(n)}“ zmazaná.`, () => {
    restoreNote(tid, n); save();
    if(ui.route.view === "tema" && ui.route.id === tid){ drawTSubs(); drawTNotes(); drawTSide(); }
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

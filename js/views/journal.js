/* ============================================================
   JOURNAL — study diary: activity calendar, new entry with linked
   topics / notes, searchable list of entries
   ============================================================ */
const jr = {
  draft: "",       /* text of the entry being written */
  date: null,      /* null = today */
  links: [],       /* [{t, n?}] linked to the entry being written */
  shown: 12,
  q: "",
  day: null,       /* show only this day */
  topic: null,     /* show only entries linking this topic */
  edit: null       /* id of the entry open for editing */
};

VIEWS.dennik = {
  title: () => "Denník",
  render(host){
    const r = ui.route;
    jr.topic = r.topic || null;
    if(r.topic){ jr.q = ""; jr.day = null; }
    host.innerHTML = `<div class="page journal">
      <header class="page-head">
        <h1>Denník učenia</h1>
        <p class="sub">Po každom sedení pár viet: čo si riešil, kde si sa zasekol, čo ti docvaklo. Pripoj témy a poznámky — z denníka sa k nim dostaneš jedným klikom a v téme uvidíš, kedy si na nej robil.</p>
      </header>
      <section class="card j-activity" id="jAct"></section>
      <section class="card j-compose" id="jCompose"></section>
      <div class="j-tools" id="jTools"></div>
      <section class="j-list" id="jList"></section>
    </div>`;
    drawActivity(); drawCompose(); drawJTools(); drawEntries();

    if(r.entry){
      if(!filteredEntries().some(e => e.id === r.entry)){ jr.q = ""; jr.day = null; drawActivity(); drawJTools(); }
      const i = filteredEntries().findIndex(e => e.id === r.entry);
      if(i >= jr.shown){ jr.shown = i + 1; drawEntries(); }
      const el = $(`#entry-${r.entry}`);
      if(el){ el.scrollIntoView({block:"center"}); flashEl(el); }
    } else if(ui.focusCompose){
      ui.focusCompose = false;
      const ta = $("#jCompose .ed-in");
      if(ta) ta.focus();
    }
  },
  refresh(){ drawActivity(); drawSuggest(); drawEntries(); }
};

/* ---------- activity calendar ---------- */
function activityMap(){
  const map = {};
  const add = d => { map[d] = (map[d] || 0) + 1; };
  state.log.forEach(e => add(e.d));
  for(const id in state.notes) state.notes[id].forEach(n => add(isoOf(n.c)));
  for(const id in state.upd) add(isoOf(state.upd[id]));
  return map;
}

function drawActivity(){
  const map = activityMap();
  const today = todayIso();
  const WEEKS = 18;
  const start = dateOf(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (WEEKS - 1) * 7);   /* Monday, 17 weeks back */

  let cols = "", months = "", lastMonth = -1;
  for(let w = 0; w < WEEKS; w++){
    let cells = "";
    for(let d = 0; d < 7; d++){
      const day = new Date(start); day.setDate(start.getDate() + w * 7 + d);
      const iso = isoOf(day.getTime());
      if(iso > today){ cells += `<i class="hm-cell future"></i>`; continue; }
      const n = map[iso] || 0;
      const k = n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4;
      const hasLog = state.log.some(e => e.d === iso);
      cells += `<i class="hm-cell k${k}${iso === today ? " today" : ""}${jr.day === iso ? " sel" : ""}"${hasLog ? ` data-act="j-day" data-d="${iso}"` : ""} title="${fmtIso(iso)} · ${n ? n + " " + plural(n, "aktivita", "aktivity", "aktivít") : "nič"}"></i>`;
    }
    const last = new Date(start); last.setDate(start.getDate() + w * 7 + 6);
    const m = last.getMonth();
    months += `<span>${m !== lastMonth && last.getDate() <= 7 ? MONTHS[m].slice(0, 3) : ""}</span>`;
    lastMonth = m;
    cols += `<div class="hm-col">${cells}</div>`;
  }

  /* streak: consecutive days with something, counting back from today (or yesterday) */
  let streak = 0;
  const cur = dateOf(today);
  if(!map[today]) cur.setDate(cur.getDate() - 1);
  while(map[isoOf(cur.getTime())]){ streak++; cur.setDate(cur.getDate() - 1); }
  let active30 = 0;
  for(let i = 0; i < 30; i++){ const d = dateOf(today); d.setDate(d.getDate() - i); if(map[isoOf(d.getTime())]) active30++; }

  $("#jAct").innerHTML = `
    <div class="hm-stats">
      <div><b>${streak}</b><span>${plural(streak, "deň", "dni", "dní")} v rade</span></div>
      <div><b>${active30}</b><span>z posledných 30 dní</span></div>
      <div><b>${state.log.length}</b><span>${skEntries(state.log.length)} v denníku</span></div>
    </div>
    <div class="hm">
      <div class="hm-months">${months}</div>
      <div class="hm-grid">${cols}</div>
      <div class="hm-legend">menej <i class="hm-cell k0"></i><i class="hm-cell k1"></i><i class="hm-cell k2"></i><i class="hm-cell k3"></i><i class="hm-cell k4"></i> viac · záznamy, nové poznámky a hodnotenia</div>
    </div>`;
}

/* ---------- new entry ---------- */
function drawCompose(){
  EDITORS["log:new"] = {
    onChange: t => { jr.draft = t; },
    onDone: () => ACTIONS["j-add"](),
    onEsc: () => document.activeElement.blur()
  };
  const d = jr.date || todayIso();
  $("#jCompose").innerHTML = `
    <div class="jc-top">
      <h2>Nový záznam</h2>
      <label class="jc-date">
        <input type="date" data-in="j-date" value="${d}" max="${todayIso()}" aria-label="Dátum sedenia">
        <span id="jcWeekday">${weekdayOf(d)}</span>
      </label>
    </div>
    ${editorHtml("log:new", jr.draft, {rows:4, placeholder:"Napr. iracionálne rovnice — zabudol som na 2ab v (a − b)², skúška koreňov cez podmienku 2 − x >= 0…", foot:"Ctrl+Enter pridá záznam · Markdown aj vzorce fungujú ako v poznámkach"})}
    <div class="jc-links" id="jcLinks"></div>
    <div class="jc-sugg" id="jcSugg"></div>
    <div class="jc-actions"><button class="btn" data-act="j-add">Pridať záznam</button></div>`;
  mountEditors($("#jCompose"));
  drawLinks();
  drawSuggest();
}

function drawLinks(){
  $("#jcLinks").innerHTML = `<span class="jc-label">Témy a poznámky</span>
    <div class="chips">${jr.links.map(l => linkChip(l, {remove:"j-unlink", data:`data-target="new"`})).join("")}
    <button class="chip add" data-act="j-link" data-target="new">+ Pripojiť tému alebo poznámku</button></div>`;
}

/* topics you touched today, and their notes edited today */
function suggestions(){
  const out = [];
  for(const x of T){
    if(!changedToday(x.id)) continue;
    const todays = notesOf(x.id).filter(n => isoOf(n.u) === todayIso());
    if(todays.length) todays.forEach(n => out.push({t:x.id, n:n.id}));
    else out.push({t:x.id});
  }
  return out.filter(l => !jr.links.some(k => sameLink(k, l) || (!l.n && k.t === l.t)));
}

function drawSuggest(){
  const host = $("#jcSugg");
  if(!host) return;
  const s = suggestions().slice(0, 10);
  host.innerHTML = s.length ? `<span class="jc-label">Dnes si robil na</span>
    <div class="chips">${s.map(l => {
      const n = l.n && findNote(l.t, l.n);
      return `<button class="chip sugg" data-act="j-sugg" data-t="${l.t}" data-n="${l.n || ""}" title="Pripojiť"><i class="dot l${lv(l.t)}"></i>+ ${esc(shortName(BY_ID[l.t]))}${n ? `<span class="chip-note">✎ ${esc(noteTitle(n))}</span>` : ""}</button>`;
    }).join("")}
    ${s.length > 1 ? `<button class="chip add" data-act="j-sugg-all">Pripojiť všetky</button>` : ""}</div>` : "";
}

onInput("j-date", el => {
  jr.date = el.value && el.value !== todayIso() ? el.value : null;
  const w = $("#jcWeekday"); if(w && el.value) w.textContent = weekdayOf(el.value);
});

action("j-add", () => {
  const text = jr.draft.trim();
  if(!text && !jr.links.length){ const ta = $("#jCompose .ed-in"); if(ta) ta.focus(); toast("Napíš aspoň pár slov alebo pripoj tému."); return; }
  const e = addLog(jr.date || todayIso(), text, jr.links);
  jr.draft = ""; jr.links = []; jr.date = null;
  save();
  drawCompose(); drawActivity(); drawEntries();
  flashEl($(`#entry-${e.id}`));
  toast("Záznam pridaný.", () => { removeLog(e.id); save(); refresh(); });
});

/* target "new" = the entry being written, otherwise an entry id */
const linksOf = target => target === "new" ? jr.links : (findLog(target) || {links:[]}).links;
function redrawLinks(target){
  if(target === "new"){ drawLinks(); drawSuggest(); refocusCompose(); }
  else { updateLog(target, {}); saveSoon(); drawEntries(); }
}
/* the chip that was clicked is gone after a redraw — put the cursor back in the text */
function refocusCompose(){ const ta = $("#jCompose .ed-in"); if(ta) ta.focus({preventScroll:true}); }

action("j-link", el => {
  const target = el.dataset.target;
  openPalette({pick:true, title:"Pripojiť tému alebo poznámku", exclude:linksOf(target), onPick: link => {
    const links = linksOf(target);
    /* a note link covers its topic */
    if(link.n){ const i = links.findIndex(l => l.t === link.t && !l.n); if(i >= 0) links.splice(i, 1); }
    if(!links.some(l => sameLink(l, link))) links.push(link);
    redrawLinks(target);
  }});
});
action("j-unlink", el => {
  const target = el.dataset.target;
  const links = linksOf(target);
  const i = links.findIndex(l => sameLink(l, {t:el.dataset.t, n:el.dataset.n || null}));
  if(i >= 0) links.splice(i, 1);
  redrawLinks(target);
});
action("j-sugg", el => {
  jr.links.push(el.dataset.n ? {t:el.dataset.t, n:el.dataset.n} : {t:el.dataset.t});
  redrawLinks("new");
});
action("j-sugg-all", () => {
  jr.links.push(...suggestions());
  redrawLinks("new");
});

/* ---------- list ---------- */
function entryHay(e){
  return norm(e.text + " " + e.links.map(l => {
    const x = BY_ID[l.t], n = l.n && findNote(l.t, l.n);
    return x.n + " " + (n ? noteTitle(n) : "");
  }).join(" "));
}

function filteredEntries(){
  const words = norm(jr.q).split(/\s+/).filter(Boolean);
  return [...state.log].sort(byLogDesc).filter(e =>
    (!jr.day || e.d === jr.day) &&
    (!jr.topic || e.links.some(l => l.t === jr.topic)) &&
    (!words.length || words.every(w => entryHay(e).includes(w))));
}

function drawJTools(){
  const chips = [];
  if(jr.day) chips.push(`<button class="chip active" data-act="j-clear" data-what="day">${fmtIso(jr.day)} ×</button>`);
  if(jr.topic) chips.push(`<button class="chip active" data-act="j-clear" data-what="topic"><i class="dot l${lv(jr.topic)}"></i>${esc(shortName(BY_ID[jr.topic]))} ×</button>`);
  $("#jTools").innerHTML = `
    <h2>Záznamy</h2>
    <input class="search" type="search" data-in="j-search" value="${esc(jr.q)}" placeholder="Hľadať v denníku — text, téma, poznámka…" aria-label="Hľadať v denníku">
    ${chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}`;
}

function drawEntries(){
  const all = filteredEntries();
  const list = all.slice(0, jr.shown);
  let html = "", month = null;
  for(const e of list){
    const m = monthOf(e.d);
    if(m !== month){ month = m; html += `<h3 class="j-month">${m}</h3>`; }
    const [, mm, dd] = e.d.split("-").map(Number);
    const editing = jr.edit === e.id;
    html += `<article class="entry${editing ? " editing" : ""}" id="entry-${e.id}">
      <div class="e-date"><b>${dd}. ${mm}.</b><span>${weekdayOf(e.d)}</span>${e.d === todayIso() ? `<em>dnes</em>` : ""}</div>
      <div class="e-body">${editing ? entryEditorHtml(e) : `
        ${e.text.trim() ? `<div class="e-text md">${md(e.text)}</div>` : ""}
        ${e.links.length ? `<div class="chips">${e.links.map(l => linkChip(l)).join("")}</div>` : ""}`}
      </div>
      ${editing ? "" : `<div class="e-acts">
        <button data-act="j-edit" data-id="${e.id}" title="Upraviť záznam">✎</button>
        <button data-act="j-del" data-id="${e.id}" title="Zmazať záznam">×</button>
      </div>`}
    </article>`;
  }
  if(!all.length){
    html = state.log.length
      ? `<p class="empty">Nič sa nenašlo. <button class="linkish" data-act="j-clear" data-what="all">Zrušiť hľadanie</button></p>`
      : `<p class="empty">Zatiaľ prázdne. Prvý záznam napíš hore — aj jedna veta stačí.</p>`;
  }
  if(all.length > jr.shown) html += `<button class="more-btn" data-act="j-more">Zobraziť ďalšie (${all.length - jr.shown})</button>`;
  $("#jList").innerHTML = html;
  mountEditors($("#jList"));
}

function entryEditorHtml(e){
  EDITORS[`log:${e.id}`] = {
    onChange: t => { updateLog(e.id, {text:t}); saveSoon(); },
    onDone: () => ACTIONS["j-edit-done"]()
  };
  return `<div class="e-edit">
    <label class="jc-date"><input type="date" data-in="j-edit-date" data-id="${e.id}" value="${e.d}" max="${todayIso()}" aria-label="Dátum"></label>
    ${editorHtml(`log:${e.id}`, e.text, {rows:3})}
    <div class="jc-links"><span class="jc-label">Témy a poznámky</span><div class="chips">
      ${e.links.map(l => linkChip(l, {remove:"j-unlink", data:`data-target="${e.id}"`})).join("")}
      <button class="chip add" data-act="j-link" data-target="${e.id}">+ Pripojiť</button></div></div>
    <div class="jc-actions"><button class="btn" data-act="j-edit-done">Hotovo</button></div>
  </div>`;
}

onInput("j-search", el => { jr.q = el.value; jr.shown = 12; drawEntries(); });
onInput("j-edit-date", el => {
  if(el.value){ updateLog(el.dataset.id, {d:el.value}); saveSoon(); }
});

action("j-more", () => { jr.shown += 20; drawEntries(); });
action("j-day", el => {
  jr.day = jr.day === el.dataset.d ? null : el.dataset.d;
  drawActivity(); drawJTools(); drawEntries();
  if(jr.day) $("#jTools").scrollIntoView({behavior:"smooth", block:"start"});
});
action("j-clear", el => {
  const w = el.dataset.what;
  if(w === "day" || w === "all") jr.day = null;
  if(w === "topic" || w === "all"){ jr.topic = null; if(ui.route.topic) history.replaceState(null, "", "#/dennik"); ui.route = {view:"dennik"}; }
  if(w === "all") jr.q = "";
  drawActivity(); drawJTools(); drawEntries();
});
action("j-edit", el => {
  jr.edit = el.dataset.id;
  drawEntries();
  const ta = $(`#entry-${jr.edit} .ed-in`);
  if(ta){ ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
});
action("j-edit-done", () => {
  const id = jr.edit;
  jr.edit = null;
  save();
  drawActivity(); drawEntries();
  flashEl($(`#entry-${id}`));
});
action("j-del", el => {
  const e = removeLog(el.dataset.id);
  if(!e) return;
  save(); refresh();
  toast("Záznam zmazaný.", () => { restoreLog(e); save(); refresh(); });
});

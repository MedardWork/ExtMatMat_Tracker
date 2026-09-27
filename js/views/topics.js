/* ============================================================
   TOPIC LIST — tabs, search, filters, one row per topic
   ============================================================ */
const TABS = [
  {k:"a", label:"Externá maturita", intro:'Všetko učivo na <strong>externú časť</strong> maturity z matematiky, rozdelené podľa blokov testu. Štítok Y1–Y3 pri téme hovorí, v ktorom ročníku sa podľa sylabu preberala.'},
  {k:"c", label:"Navyše pre Matematik A", intro:'Čo dánska Matematik A (STX) žiada <strong>nad rámec</strong> slovenskej maturity. Do odhadu na EČ sa nepočíta.'},
  {k:"x", label:"Nerelevantné", intro:'Témy, o ktorých vieš, že na teste nebudú. <strong>Do odhadu sa nepočítajú</strong> — úlohy ich bloku sa rozdelia medzi zvyšné témy. Tlačidlom <b>↩ Vrátiť</b> ich presunieš späť; hodnotenie aj poznámky zostávajú.'}
];

const FILTERS = [
  {f:"all",   label:"Všetko",       test: () => true},
  {f:"n0",    label:"Nepozreté",    test: x => lv(x.id) === 0},
  {f:"n1",    label:"Neviem",       test: x => lv(x.id) === 1},
  {f:"mid",   label:"Rozrobené",    test: x => lv(x.id) === 2 || lv(x.id) === 3},
  {f:"n4",    label:"Perfektne",    test: x => lv(x.id) === 4},
  {f:"note",  label:"S poznámkou",  test: x => notesOf(x.id).length > 0},
  {f:"today", label:"Zmenené dnes", test: x => changedToday(x.id)}
];

const areasOf = tab => tab === "c" ? DK_AREAS : tab === "x" ? {...AREAS, ...DK_AREAS} : AREAS;

VIEWS.temy = {
  title: () => "Témy",
  render(host){
    ui.tab = ui.route.tab;
    host.innerHTML = `<div class="page topics">
      <nav class="tabs" role="tablist" id="tabs"></nav>
      <p class="intro" id="intro"></p>
      <details class="levels-help">
        <summary>Čo znamenajú úrovne?</summary>
        <div class="levels-key">${LV.map(l =>
          `<div style="border-top-color:${LV_COLOR[l.k]}"><b>${l.label}</b>${l.desc}</div>`).join("")}</div>
      </details>
      <div class="list-tools">
        <input class="search" type="search" data-in="list-search" value="${esc(ui.query)}"
          placeholder="Hľadať tému, popis alebo text v poznámkach…" aria-label="Hľadať v zozname">
        <div class="filters" id="filters"></div>
      </div>
      <div class="area-jump" id="areaJump"></div>
      <div id="list"></div>
    </div>`;
    this.refresh();
    const back = ui.lastTopic && $(`#row-${ui.lastTopic}`);
    if(back) flashEl(back);
  },
  refresh(){ renderTabs(); renderFilters(); renderList(); }
};

function renderTabs(){
  /* Nerelevantné only appears once something is in it */
  $("#tabs").innerHTML = TABS.filter(t => t.k !== "x" || ui.tab === "x" || itemsOf("x").length).map(t => {
    const left = t.k === "x" ? itemsOf("x").length : itemsOf(t.k).filter(x => lv(x.id) < 4).length;
    return `<a class="tab" role="tab" href="#/temy/${t.k}" aria-selected="${ui.tab === t.k}">
      ${t.label}<span class="count" title="ešte nie na perfektne">${left}</span></a>`;
  }).join("");
  $("#intro").innerHTML = TABS.find(t => t.k === ui.tab).intro;
}

function renderFilters(){
  const items = itemsOf(ui.tab);
  $("#filters").innerHTML = FILTERS.map(F => {
    const n = items.filter(F.test).length;
    return `<button data-act="filter" data-f="${F.f}" aria-pressed="${ui.filter === F.f}"${!n && F.f !== "all" ? " disabled" : ""}>
      ${F.label}${F.f !== "all" ? `<span>${n}</span>` : ""}</button>`;
  }).join("") + `<button class="desc-all" data-act="desc-all">${ui.allDesc ? "Zbaliť všetky popisy" : "Rozbaliť všetky popisy"}</button>`;
}

function passes(x){
  const F = FILTERS.find(F => F.f === ui.filter) || FILTERS[0];
  if(!F.test(x)) return false;
  if(!ui.query) return true;
  const words = norm(ui.query).split(/\s+/);
  const hay = norm([x.n, x.dk || "", DESC[x.id] ? DESC[x.id].join(" ") : "", subHaystack(x.id), noteHaystack(x.id)].join(" "));
  return words.every(w => hay.includes(w));
}

/* ids in the order they're shown, for ‹ › in the topic view */
function visibleIds(){
  const areas = areasOf(ui.tab);
  return Object.keys(areas).flatMap(key => T.filter(x => tabOf(x) === ui.tab && x.area === key && passes(x)).map(x => x.id));
}

const gluedArrow = name => {
  const i = name.lastIndexOf(" ");
  return `${name.slice(0, i + 1)}<span class="nw">${name.slice(i + 1)}<span class="go" aria-hidden="true">›</span></span>`;
};

function rowHtml(x){
  const v = lv(x.id);
  const notes = notesOf(x.id);

  const nSub = subsOf(x.id).length, rated = ratedSubs(x.id);
  let meta = `<span class="sub-count" title="Ohodnotené podtémy">${subMeter(x.id)}${rated}/${nSub}</span>`;
  if(x.src) meta += `<span class="src">${x.src}</span>`;
  if(state.upd[x.id]){
    const t = changedToday(x.id);
    meta += `<span class="upd${t ? " today" : ""}">${t ? "zmenené dnes" : "zmenené " + fmtIso(isoOf(state.upd[x.id]))}</span>`;
  }
  if(x.dk) meta += `<span class="dkterm">${x.dk}</span>`;
  const b = blocked(x);
  if(b.length) meta += `<span class="pre">najprv: ${b.map(id => `<a href="#/tema/${id}">${esc(shortName(BY_ID[id]))}</a>`).join(", ")}</span> `;
  if(x.m) meta += x.m;

  const last = latestNote(x.id);
  const preview = last ? `<a class="note-prev nl${last.lv || 0}" href="#/tema/${x.id}/n/${last.id}" data-act="from-list" data-id="${x.id}">
      <b>✎ ${inline(noteTitle(last))}</b>${last.title.trim() && last.body.trim() ? ` — ${inline(plainText(last.body, 110))}` : ""}
      ${notes.length > 1 ? `<em>+ ${notes.length - 1} ${plural(notes.length - 1, "ďalšia", "ďalšie", "ďalších")}</em>` : ""}</a>` : "";

  const dsc = DESC[x.id];
  const dOpen = ui.allDesc || ui.openDesc.has(x.id);
  const descHtml = dsc ? `<button class="desc-toggle" data-act="desc" data-id="${x.id}" aria-expanded="${dOpen}">${dOpen ? "▾ Skryť popis" : "▸ O čom to je"}</button>
    ${dOpen ? `<div class="desc-box"><p>${esc(dsc[0])}</p><div class="ex"><b>Typická úloha:</b> ${esc(dsc[1])}</div></div>` : ""}` : "";

  const noteBtn = notes.length
    ? `<a class="note-btn has" href="#/tema/${x.id}" data-act="from-list" data-id="${x.id}" title="${notes.length} ${skNotes(notes.length)}">✎ ${notes.length}</a>`
    : `<a class="note-btn" href="#/tema/${x.id}" data-act="from-list" data-id="${x.id}" data-new="1" title="Otvorí tému s novou poznámkou">+ Poznámka</a>`;

  return `<div class="row s${v}" id="row-${x.id}">
    <div class="row-main">
      <a class="row-name" href="#/tema/${x.id}" data-act="from-list" data-id="${x.id}">${gluedArrow(x.n)}</a>
      ${descHtml}
      <div class="row-meta">${meta}</div>
      ${preview}
    </div>
    <div class="row-side">
      ${levelSeg(x.id)}
      ${noteBtn}
      ${relBtn(x)}
    </div>
  </div>`;
}

function renderList(){
  const host = $("#list");
  const areas = areasOf(ui.tab);
  let html = "", shown = 0, jump = "";

  for(const key in areas){
    const all = T.filter(x => tabOf(x) === ui.tab && x.area === key);
    const items = all.filter(passes);
    if(!items.length) continue;
    shown += items.length;

    const done = all.filter(x => lv(x.id) === 4).length;
    const badge = ui.tab === "x" ? `${all.length} ${skPieces(all.length)} mimo odhadu`
      : ui.tab === "c" ? `<b>${done}</b> / ${all.length} perfektne`
      : `<b>${AREAS[key].w}</b> úloh v teste · ${done} / ${all.length} perfektne`;
    const name = areas[key].name;
    jump += `<button data-act="jump" data-to="area-${key}">${esc(name.split(/[,—]/)[0].trim())}<span>${items.length}</span></button>`;

    html += `<section class="area" id="area-${key}"><div class="area-head">
      <h3>${name}</h3><div class="area-weight">${badge}</div></div>`;
    items.forEach(x => { html += rowHtml(x); });
    html += `</section>`;
  }
  if(!shown && ui.tab === "x" && !itemsOf("x").length) html = `<p class="empty">Nič tu nie je. Tému sem presunieš tlačidlom ⊘ v jej riadku alebo v okne témy.</p>`;
  else if(!shown) html = `<p class="empty">Pri tomto filtri tu nič nie je.${ui.query || ui.filter !== "all" ? ` <button class="linkish" data-act="clear-filters">Zrušiť filter a hľadanie</button>` : ""}</p>`;
  host.innerHTML = html;
  $("#areaJump").innerHTML = shown > 6 ? `<span>Skok na:</span>${jump}` : "";
}

function relBtn(x){
  return isOff(x.id)
    ? `<button class="rel-btn back" data-act="rel" data-id="${x.id}" title="Vrátiť medzi témy na test a do odhadu">↩ Vrátiť</button>`
    : `<button class="rel-btn" data-act="rel" data-id="${x.id}" title="Nebude na teste — presunúť do Nerelevantné a vyradiť z odhadu" aria-label="Označiť ako nerelevantné">⊘</button>`;
}

/* ---------- actions ---------- */
onInput("list-search", el => { ui.query = el.value.trim(); renderList(); });

action("filter", el => { ui.filter = el.dataset.f; renderFilters(); renderList(); });
action("clear-filters", () => {
  ui.filter = "all"; ui.query = "";
  const s = $(".list-tools .search"); if(s) s.value = "";
  renderFilters(); renderList();
});
action("desc-all", () => {
  ui.allDesc = !ui.allDesc;
  if(!ui.allDesc) ui.openDesc.clear();
  renderFilters(); renderList();
});
action("desc", el => {
  const id = el.dataset.id;
  if(ui.allDesc){
    /* leaving "all open" mode: keep everything open except this one */
    ui.allDesc = false;
    T.forEach(x => ui.openDesc.add(x.id));
    ui.openDesc.delete(id);
    renderFilters();
  } else if(ui.openDesc.has(id)) ui.openDesc.delete(id);
  else ui.openDesc.add(id);
  renderList();
});
action("jump", el => {
  const t = document.getElementById(el.dataset.to);
  if(t) t.scrollIntoView({behavior:"smooth", block:"start"});
});
action("from-list", el => {
  ui.seq = visibleIds();
  ui.seqLabel = ui.filter !== "all" || ui.query ? "vo filtri" : "";
  if(el.dataset.new) ui.pendingNew = el.dataset.id;
});

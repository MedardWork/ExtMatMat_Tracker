/* ============================================================
   TABS + LIST
   ============================================================ */
const TABS = [
  {k:"a", label:"Prebraté · malo by sedieť", intro:'Témy, ktoré podľa sylabov Y1–Y3 už prebehli — čo je tu slabé, je najlacnejší bod na teste, lebo si to raz videl.'},
  {k:"b", label:"Čaká nás · štvrták", intro:'Učivo na <strong>externú časť</strong>, ktoré sa v žiadnom z troch sylabov neobjavuje. Označuj podľa toho, ako to preberiete alebo dobehneš sám.'},
  {k:"c", label:"Navyše pre Matematik A", intro:'Čo dánska Matematik A (STX) žiada <strong>nad rámec</strong> slovenskej maturity. Do odhadu na EČ sa nepočíta.'}
];

function renderTabs(){
  document.getElementById("tabs").innerHTML = TABS.map(t => {
    const left = itemsOf(t.k).filter(x => lv(x.id) < 4).length;
    return `<button class="tab" role="tab" data-k="${t.k}" aria-selected="${tab===t.k}">
      ${t.label}<span class="count">${left}</span></button>`;
  }).join("");
  document.getElementById("intro").innerHTML = TABS.find(t => t.k === tab).intro;
}

function renderKey(){
  document.getElementById("levelsKey").innerHTML = LV.map(l =>
    `<div style="border-top-color:${LV_COLOR[l.k]}"><b>${l.label}</b>${l.desc}</div>`
  ).join("");
}

function passes(x){
  const v = lv(x.id);
  const f = filter;
  const ok = f === "all" || (f === "n0" && v === 0) || (f === "n1" && v === 1)
          || (f === "mid" && (v === 2 || v === 3)) || (f === "n4" && v === 4)
          || (f === "note" && note(x.id).trim()) || (f === "today" && changedToday(x.id));
  if(!ok) return false;
  if(!query) return true;
  const q = norm(query);
  const d = DESC[x.id] ? DESC[x.id].join(" ") : "";
  return norm(x.n).includes(q) || norm(note(x.id)).includes(q) || (x.dk && norm(x.dk).includes(q)) || norm(d).includes(q);
}

function rowHtml(x){
  const v = lv(x.id);
  const nt = note(x.id);
  const open = openNotes.has(x.id);

  let meta = "";
  if(x.src) meta += `<span class="src">${x.src}</span>`;
  if(state.upd[x.id]){
    const t = changedToday(x.id);
    meta += `<span class="upd${t ? " today" : ""}">${t ? "zmenené dnes" : "zmenené " + fmtIso(isoOf(state.upd[x.id]))}</span>`;
  }
  if(x.dk) meta += `<span class="dkterm">${x.dk}</span>`;
  const b = blocked(x);
  if(b.length) meta += `<span class="pre">najprv: ${b.map(id => BY_ID[id].n.split(/[:—,]/)[0].trim()).join(", ")}</span> `;
  if(x.m) meta += x.m;

  const seg = LV.map(l =>
    `<button class="b${l.k}" data-id="${x.id}" data-v="${l.k}" aria-pressed="${v===l.k}" title="${l.desc}">${l.label}</button>`
  ).join("");

  const preview = (!open && nt.trim())
    ? `<div class="note-prev" data-open="${x.id}">${esc(nt.length > 220 ? nt.slice(0,220) + "…" : nt)}</div>` : "";

  const box = open ? `<div class="note-box">
      <textarea data-note="${x.id}" placeholder="Čo si zistil, kde robíš chyby, vzorce, na čo si dať pozor…">${esc(nt)}</textarea>
      <div class="note-hint">Ukladá sa automaticky.</div>
    </div>` : "";

  const dsc = DESC[x.id];
  const dOpen = allDesc || openDesc.has(x.id);
  const descHtml = dsc ? `<button class="desc-toggle" data-desc="${x.id}" aria-expanded="${dOpen}">${dOpen ? "▾ Skryť popis" : "▸ O čom to je"}</button>
    ${dOpen ? `<div class="desc-box"><p>${esc(dsc[0])}</p><div class="ex"><b>Typická úloha:</b> ${esc(dsc[1])}</div></div>` : ""}` : "";

  return `<div class="row s${v}">
    <div class="row-main">
      <div class="row-name">${x.n}</div>
      ${descHtml}
      ${meta ? `<div class="row-meta">${meta}</div>` : ""}
      ${preview}
    </div>
    <div class="row-side">
      <div class="seg" role="group" aria-label="${x.n.replace(/"/g,"")}">${seg}</div>
      <button class="note-toggle${nt.trim() ? " has" : ""}" data-toggle="${x.id}" aria-expanded="${open}">✎ ${open ? "Zavrieť" : (nt.trim() ? "Poznámka" : "Pridať poznámku")}</button>
    </div>
    ${box}
  </div>`;
}

function renderList(){
  const host = document.getElementById("list");
  const areas = tab === "c" ? DK_AREAS : AREAS;
  let html = "", shown = 0;

  for(const key in areas){
    const all = T.filter(x => x.t === tab && x.area === key);
    const items = all.filter(passes);
    if(!items.length) continue;
    shown += items.length;

    const done = all.filter(x => lv(x.id) === 4).length;
    const badge = tab === "c"
      ? `<b>${done}</b> / ${all.length} perfektne`
      : `<b>${AREAS[key].w}</b> úloh v teste · ${done} / ${all.length} perfektne`;

    html += `<section class="area"><div class="area-head">
      <h3>${areas[key].name}</h3><div class="area-weight">${badge}</div></div>`;
    items.forEach(x => { html += rowHtml(x); });
    html += `</section>`;
  }
  if(!shown) html = `<p class="empty">Pri tomto filtri tu nič nie je.</p>`;
  host.innerHTML = html;
}

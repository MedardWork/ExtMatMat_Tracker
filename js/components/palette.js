/* ============================================================
   QUICK SEARCH — "/" or Ctrl+K from anywhere
   openPalette()                         jump to a topic or note
   openPalette({pick:true, onPick})      choose a topic (and note) to link
   ============================================================ */
let pal = null;   /* {opts, items, sel, back} while open */

function openPalette(opts = {}){
  pal = {opts, items:[], sel:0, back:document.activeElement};
  const root = $("#palette");
  root.innerHTML = `<div class="pal" role="dialog" aria-modal="true" aria-label="${esc(opts.title || "Hľadať")}">
    <div class="pal-head">
      <span class="pal-title">${esc(opts.title || "Prejsť na tému alebo poznámku")}</span>
      <input class="pal-input" type="search" placeholder="${opts.pick ? "Napíš časť názvu témy alebo poznámky…" : "Hľadaj v témach, popisoch aj poznámkach…"}" aria-label="Hľadať" autocomplete="off">
    </div>
    <div class="pal-list" role="listbox"></div>
    <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> vybrať</span><span><kbd>Enter</kbd> ${opts.pick ? "pridať" : "otvoriť"}</span><span><kbd>Esc</kbd> zavrieť</span></div>
  </div>`;
  root.hidden = false;
  document.body.classList.add("pal-open");
  const inp = $(".pal-input", root);
  inp.addEventListener("input", () => { pal.sel = 0; palSearch(inp.value); });
  inp.addEventListener("keydown", palKey);
  palSearch("");
  inp.focus();
}

function closePalette(restore){
  if(!pal) return;
  const back = pal.back;
  pal = null;
  const root = $("#palette");
  root.hidden = true;
  root.innerHTML = "";
  document.body.classList.remove("pal-open");
  if(restore && back && back.focus) back.focus();
}

function palSearch(q){
  const o = pal.opts;
  const items = [];
  const qn = norm(q.trim());
  const skip = o.exclude || [];
  const excluded = l => skip.some(s => sameLink(s, l));

  if(!qn){
    const seen = new Set();
    const add = (id, group) => {
      if(seen.has(id) || excluded({t:id})) return;
      seen.add(id);
      items.push({t:id, group});
    };
    if(o.pick) T.filter(x => changedToday(x.id)).forEach(x => add(x.id, "Zmenené dnes"));
    state.recent.forEach(id => add(id, "Naposledy otvorené"));
    if(items.length < 8) EC_ITEMS.filter(x => lv(x.id) > 0 && lv(x.id) < 4).slice(0, 8 - items.length).forEach(x => add(x.id, "Rozrobené"));
    if(o.notes !== false && o.pick){
      /* in pick mode, today's notes are the most likely thing to link */
      T.forEach(x => notesOf(x.id).forEach(n => {
        if(isoOf(n.u) === todayIso() && !excluded({t:x.id, n:n.id})) items.push({t:x.id, n:n.id, group:"Poznámky upravené dnes"});
      }));
    }
  } else {
    const words = qn.split(/\s+/);
    const hit = s => { const h = norm(s); return words.every(w => h.includes(w)); };
    const topics = [];
    for(const x of T){
      if(excluded({t:x.id})) continue;
      const name = norm(x.n);
      let score = 0;
      if(name.startsWith(qn)) score = 5;
      else if(hit(x.n)) score = 4;
      else if(x.dk && hit(x.dk)) score = 3;
      else if(hit(areaName(x)) || x.id === qn) score = 2;
      else if(DESC[x.id] && hit(DESC[x.id].join(" "))) score = 1;
      if(score) topics.push({t:x.id, score, group:"Témy"});
    }
    topics.sort((a, b) => b.score - a.score);
    items.push(...topics.slice(0, 14));
    if(o.notes !== false){
      const notes = [];
      for(const x of T) for(const n of notesOf(x.id)){
        if(excluded({t:x.id, n:n.id})) continue;
        if(hit(n.title + " " + n.body)) notes.push({t:x.id, n:n.id, group:"Poznámky", c:n.c});
      }
      notes.sort((a, b) => b.c - a.c);
      items.push(...notes.slice(0, 10));
    }
  }
  pal.items = items;
  pal.q = qn;
  palDraw();
}

function palDraw(){
  const list = $(".pal-list");
  if(!pal.items.length){
    list.innerHTML = `<div class="pal-empty">${pal.q ? "Nič sa nenašlo." : "Začni písať."}</div>`;
    return;
  }
  let html = "", group = null;
  pal.items.forEach((it, i) => {
    if(it.group !== group){ group = it.group; html += `<div class="pal-group">${group}</div>`; }
    const x = BY_ID[it.t];
    const n = it.n ? findNote(it.t, it.n) : null;
    const main = n ? `✎ ${esc(noteTitle(n))}` : esc(x.n);
    const sub = n
      ? `${esc(shortName(x))} · ${fmtAgo(isoOf(n.c))}`
      : `${esc(areaName(x))} · ${TAB_LABEL[x.t]}${notesOf(x.id).length ? ` · ✎ ${notesOf(x.id).length}` : ""}`;
    html += `<div class="pal-item${i === pal.sel ? " sel" : ""}" role="option" aria-selected="${i === pal.sel}" data-act="pal-pick" data-i="${i}">
      <i class="dot l${lv(it.t)}"></i><div><div class="pal-main">${main}</div><div class="pal-sub">${sub}</div></div>
      ${!n ? `<span class="pal-lv">${LV[lv(it.t)].label}</span>` : ""}
    </div>`;
  });
  list.innerHTML = html;
  const sel = $(".pal-item.sel", list);
  if(sel) sel.scrollIntoView({block:"nearest"});
}

function palKey(e){
  if(e.key === "ArrowDown" || e.key === "ArrowUp"){
    e.preventDefault();
    const n = pal.items.length;
    if(!n) return;
    pal.sel = (pal.sel + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
    palDraw();
  } else if(e.key === "Enter"){
    e.preventDefault();
    palChoose(pal.sel);
  } else if(e.key === "Escape"){
    e.preventDefault(); e.stopPropagation();
    closePalette(true);
  }
}

function palChoose(i){
  const it = pal && pal.items[i];
  if(!it) return;
  const o = pal.opts;
  const link = it.n ? {t:it.t, n:it.n} : {t:it.t};
  closePalette(!!o.pick);
  if(o.pick) o.onPick(link);
  else go(`#/tema/${it.t}${it.n ? "/n/" + it.n : ""}`);
}

action("pal-pick", el => palChoose(Number(el.dataset.i)));
action("palette", () => openPalette());
document.addEventListener("mousedown", e => {
  if(pal && e.target.id === "palette") closePalette(true);
});

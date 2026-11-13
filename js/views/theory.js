/* ============================================================
   THEORY TAB — #/tema/<id>/teoria[/<subtopic key>]
   The second face of a topic page: text broken into short pieces, each followed by the tool that
   shows it. Drawn by VIEWS.tema (topic.js) when the route says tab "teoria".
   ============================================================ */
let thSpy = null;

/* the switch between the two faces of a topic */
function topicTabs(id, cur){
  const has = hasTheory(id);
  return `<nav class="t-tabs" aria-label="Zobrazenie témy">
    <a href="#/tema/${id}"${cur === "notes" ? ` aria-current="page"` : ""}>Podtémy a poznámky</a>
    <a href="#/tema/${id}/teoria"${cur === "teoria" ? ` aria-current="page"` : ""}>Teória${has ? "" : ` <small>pripravuje sa</small>`}</a>
  </nav>`;
}

function renderTheory(host){
  const id = ui.route.id;
  if(thSpy){ thSpy.disconnect(); thSpy = null; }
  host.innerHTML = `<article class="page topic theory" id="topicPage">
    <div class="t-nav" id="tNav"></div>
    <header class="t-head" id="tHead"></header>
    ${topicTabs(id, "teoria")}
    <div class="th-cols">
      <nav class="th-toc" id="thToc" aria-label="Podtémy v teórii"></nav>
      <div class="th-main" id="thMain"><p class="th-load">Načítavam teóriu…</p></div>
    </div>
  </article>`;
  drawTNav(); drawTHead();
  loadTheory(id).then(ok => {
    const r = ui.route;
    if(r.view === "tema" && r.id === id && r.tab === "teoria" && $("#thMain")) drawTheory(ok);
  });
}

function drawTheory(ok){
  const id = ui.route.id, th = THEORY[id];
  const main = $("#thMain"), toc = $("#thToc");
  if(!ok || !th){
    toc.hidden = true;
    main.innerHTML = `<div class="th-empty">
      <p><b>Teória k tejto téme sa ešte pripravuje.</b></p>
      <p>Hotová je zatiaľ k týmto témam:</p>
      <div class="chips">${THEORY_LIST.filter(t => BY_ID[t]).map(t =>
        `<span class="chip"><a href="#/tema/${t}/teoria"><i class="dot l${lv(t)}"></i>${esc(shortName(BY_ID[t]))}</a></span>`).join("")}</div>
      <p class="muted small">Medzitým si môžeš pozrieť <a href="#/nastroje">Nástroje</a> alebo si k téme písať vlastné <a href="#/tema/${id}">poznámky</a>.</p>
    </div>`;
    return;
  }
  const secs = theorySections(id), tools = theoryToolCount(id);
  toc.hidden = false;
  toc.innerHTML = `<span class="th-toc-h">Podtémy</span>` + secs.map(s =>
    `<a href="#/tema/${id}/teoria/${s.k}" data-act="th-jump" data-k="${s.k}"><i class="dot l${subLv(id, s.k)}"></i><span>${esc(s.n)}</span></a>`).join("");
  main.innerHTML = `
    <p class="th-meta">${secs.length} ${plural(secs.length, "podtéma", "podtémy", "podtém")} · ${tools} ${plural(tools, "interaktívna ukážka", "interaktívne ukážky", "interaktívnych ukážok")}${th.mins ? ` · asi ${th.mins} minút` : ""}</p>
    ${th.brief ? `<details class="th-brief"><summary>V skratke (na zopakovanie)</summary><div class="md">${md(th.brief.map(l => "- " + l).join("\n"))}</div></details>` : ""}
    ${secs.map((s, i) => theorySectionHtml(id, s, i, secs.length)).join("")}`;

  /* highlight in the list whichever subtopic is being read */
  const mark = k => $$("#thToc a").forEach(a => a.toggleAttribute("aria-current", a.dataset.k === k));
  mark(ui.route.sub && secs.some(s => s.k === ui.route.sub) ? ui.route.sub : secs[0] && secs[0].k);
  if("IntersectionObserver" in window){
    const seen = {};
    thSpy = new IntersectionObserver(es => {
      es.forEach(en => { seen[en.target.dataset.k] = en.isIntersecting; });
      const cur = secs.find(s => seen[s.k]);
      if(cur) mark(cur.k);
    }, {rootMargin:"-25% 0px -60% 0px"});
    $$("#thMain .th-sec").forEach(s => thSpy.observe(s));
  }
  if(ui.route.sub) setTimeout(() => { const el = $(`#th-${ui.route.sub}`); if(el) el.scrollIntoView({block:"start"}); }, 0);
}

/* a level changed (here, in another tab, or by key): update the buttons and dots without touching the tools */
function refreshTheory(){
  const id = ui.route.id;
  drawTNav(); drawTHead();
  $$("#thMain .th-seg").forEach(s => { s.innerHTML = subSeg(id, s.dataset.k, subName(id, s.dataset.k)); });
  $$("#thToc a").forEach(a => { $("i", a).className = `dot l${subLv(id, a.dataset.k)}`; });
}

action("th-jump", (el, e) => {
  e.preventDefault();
  const t = $(`#th-${el.dataset.k}`);
  if(t) t.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"});
});
/* jump to the notes side with a fresh note already filed under this subtopic */
action("th-note", el => {
  ui.pendingNew = ui.route.id;
  ui.pendingSub = el.dataset.k;
  go(`#/tema/${ui.route.id}`);
});

/* ============================================================
   TOOLS PAGE — #/nastroje (all tools, each with a live miniature) and #/nastroje/<id> (one tool,
   everything unlocked). The same tools appear pre-filled inside theory; "Otvoriť v Nástrojoch"
   there lands here with the example's values carried over.
   ============================================================ */
const tp = {tool:null, preset:null, blk:null, from:null};

VIEWS.nastroje = {
  title: r => r.tool ? TOOLS[r.tool].name : "Nástroje",
  render(host){
    if(ui.route.tool) drawToolPage(host); else drawToolGrid(host);
  },
  /* saved data changing elsewhere has nothing to redraw here — leave the tool as the reader set it */
  refresh(){},
  key(e){
    if(e.key === "Escape" && ui.route.tool) go(tp.from || "#/nastroje");
  }
};

function drawToolGrid(host){
  host.innerHTML = `<div class="page tools">
    <header class="page-head">
      <h1>Nástroje</h1>
      <p class="sub">Interaktívne pomôcky, s ktorými si môžeš voľne skúšať. Tie isté nájdeš vložené v teórii, tam s hodnotami nastavenými na konkrétny príklad.</p>
    </header>
    <div class="tool-grid">${Object.values(TOOLS).map(t => {
        const key = `thumb:${t.id}`;
        TOOL_BLOCKS[key] = {tool:t.id, cfg:t.thumb || (t.presets && t.presets[0] ? t.presets[0].cfg : {})};
        return `<a class="tool-card" href="#/nastroje/${t.id}">
          <figure class="tw tw-thumb" data-tool="${t.id}" data-tk="${key}"><div class="tw-body"></div></figure>
          <em>${esc(t.area)}</em>
          <b>${esc(t.name)}</b>
          <span>${esc(t.desc)}</span>
        </a>`;
      }).join("")}</div>
    <p class="muted small tools-more">Ďalšie nástroje pribúdajú spolu s teóriou k ďalším témam.</p>
  </div>`;
}

function drawToolPage(host){
  const t = TOOLS[ui.route.tool];
  if(tp.tool !== t.id){ tp.tool = t.id; tp.preset = 0; tp.blk = null; tp.from = null; }
  if(TOOL_HANDOFF && TOOL_HANDOFF.tool === t.id){
    const h = TOOL_HANDOFF;
    tp.blk = {tool:t.id, cfg:h.data ? Object.assign({}, h.cfg, {data:h.data}) : h.cfg, values:h.values};
    tp.preset = null;
    tp.from = h.from;
  }
  TOOL_HANDOFF = null;
  if(!tp.blk) tp.blk = {tool:t.id, cfg:t.presets && t.presets[0] ? t.presets[0].cfg : {}};
  const used = (t.topics || []).filter(id => BY_ID[id] && hasTheory(id));
  host.innerHTML = `<div class="page tools tool-one">
    <div class="t-nav"><a class="t-back" href="${tp.from || "#/nastroje"}">← ${tp.from ? "Späť do teórie" : "Nástroje"}</a></div>
    <header class="page-head">
      <h1>${esc(t.name)}</h1>
      <p class="sub">${esc(t.desc)}</p>
    </header>
    ${t.presets && t.presets.length ? `<div class="chips tool-presets" role="group" aria-label="Pripravené ukážky">${t.presets.map((p, i) =>
      `<button class="chip${tp.preset === i ? " active" : ""}" data-act="tool-preset" data-i="${i}">${esc(p.name)}</button>`).join("")}
      ${tp.preset === null ? `<span class="chip active">z teórie</span>` : ""}</div>` : ""}
    <div id="toolHost"></div>
    <div class="tool-under">
      <button class="btn ghost small" data-act="tool-copy" title="Skopíruje blok, ktorý môžeš vložiť do poznámky">Skopírovať do poznámky</button>
      <span class="muted small">Vlož do ľubovoľnej poznámky a nástroj sa v nej zobrazí s týmito hodnotami.</span>
    </div>
    ${t.help ? `<details class="tool-help"><summary>Ako sa to píše</summary><div class="md">${md(t.help)}</div></details>` : ""}
    ${used.length ? `<section class="tool-used"><h2>Použité v teórii</h2><div class="chips">${used.map(id =>
      `<span class="chip"><a href="#/tema/${id}/teoria"><i class="dot l${lv(id)}"></i>${esc(shortName(BY_ID[id]))}</a></span>`).join("")}</div></section>` : ""}
  </div>`;
  placeTool();
}

function placeTool(){
  const key = `page:${tp.tool}:${uid()}`;
  $("#toolHost").innerHTML = toolFigure(Object.assign({}, tp.blk, {ask:null, take:null, hint:null, goal:null}), key, "tw-full");
}

action("tool-preset", el => {
  const t = TOOLS[ui.route.tool], i = Number(el.dataset.i);
  tp.preset = i;
  tp.blk = {tool:t.id, cfg:t.presets[i].cfg};
  $$(".tool-presets .chip").forEach(c => { if(c.dataset.i != null) c.classList.toggle("active", Number(c.dataset.i) === i); else c.remove(); });
  placeTool();
});

/* the current state of the tool on screen as a block a note understands (see toolText in markdown.js) */
action("tool-copy", () => {
  const st = [...toolLive].find(s => s.root.closest("#toolHost"));
  if(!st) return;
  if(!st.tool.toText){ toast("Tento nástroj sa do poznámky zatiaľ vložiť nedá."); return; }
  const text = `:::nastroj ${st.tool.id}\n${st.tool.toText(st)}\n:::`;
  const done = () => toast("Skopírované. Vlož to do poznámky (Ctrl+V).");
  const manual = () => {
    const box = $(".tool-under");
    box.insertAdjacentHTML("afterend", `<textarea class="tool-snippet" rows="6" readonly>${esc(text)}</textarea>`);
    const ta = $(".tool-snippet"); ta.focus(); ta.select();
  };
  try{ navigator.clipboard.writeText(text).then(done, manual); }catch(e){ manual(); }
});

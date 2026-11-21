/* ============================================================
   OVERVIEW — countdown, score estimate, today by the plan, next in the plan, pace, topic tests, milestones
   ============================================================ */
VIEWS.prehlad = {
  title: () => "Prehľad",
  render(host){
    host.innerHTML = `<div class="page overview">
      <header class="page-head">
        <h1>Maturita z matematiky — externá časť</h1>
        <p class="sub">Externá časť je <b>30 úloh za 150 minút</b>. Po každom bloku ohodnoť tému, ktorú si riešil. Poznámky k dňu a k témam píšeš v Kalendári pod Poznámky.</p>
      </header>
      ${store === "server" && isEmptyState() ? `<section class="card welcome">
        <h2>Prvé spustenie</h2>
        <p>Postup sa odteraz ukladá sám do databázy aplikácie — nič už nemusíš kopírovať. Ak máš postup zo starej verzie, prenes si ho sem jedenkrát: súbor zo „Stiahnuť ako súbor“ alebo skopírovaný text.</p>
        <div class="tools">
          <button class="btn" data-act="import-file">Načítať zo súboru</button>
          <a class="btn ghost" href="#/info" data-act="open-import">Vložiť skopírovaný text</a>
        </div>
      </section>` : ""}
      <div class="ov-grid">
        <div class="ov-main">
          <section class="gauge">
            <div class="blocks" id="blocks"></div>
            <div class="readout">
              <div><div class="score" id="score">0<span> / 30</span></div></div>
              <p id="verdict"></p>
            </div>
            <div class="bar">
              <div class="bar-fill" id="barFill" style="width:0%"></div>
              <div class="tick" style="left:25%"></div>
              <div class="tick" style="left:33.3%"></div>
            </div>
            <div class="tick-labels"><span>0</span><span>25 % a 33 % — hranice úspešnosti</span><span>30</span></div>
            <div class="dist" id="dist"></div>
            <div class="dist-legend" id="distLegend"></div>
          </section>
          <section class="card resume plan-today" id="planToday"></section>
          <section class="next" id="next"></section>
        </div>
        <div class="ov-side">
          <div class="clock" id="clockEc"></div>
          <section class="card plan-pace" id="planPace"></section>
          <section class="card tests-card" id="testsCard"></section>
          <section class="card" id="milestones"></section>
          ${planRulesHtml()}
        </div>
      </div>
    </div>`;
    renderClock(); renderGauge(); renderPlanToday(); renderPlanNext(); renderPlanPace(); renderTestsCard(); renderMilestones();
  }
};


action("open-import", () => { ui.openImport = true; });
action("filter-today", () => { ui.filter = "today"; });
action("focus-compose", () => { ui.focusCompose = true; });

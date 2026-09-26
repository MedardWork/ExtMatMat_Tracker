/* ============================================================
   OVERVIEW — countdown, score estimate, what next, where you left off
   ============================================================ */
VIEWS.prehlad = {
  title: () => "Prehľad",
  render(host){
    host.innerHTML = `<div class="page overview">
      <header class="page-head">
        <h1>Maturita z matematiky — externá časť</h1>
        <p class="sub">Externá časť je <b>30 úloh za 150 minút</b>. Po každom sedení: ohodnoť témy, ktoré si riešil, zapíš si k nim poznámky a pridaj krátky záznam do denníka.</p>
      </header>
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
          <section class="next" id="next"></section>
        </div>
        <div class="ov-side">
          <div class="clock" id="clockEc"></div>
          <section class="card resume" id="resume"></section>
        </div>
      </div>
    </div>`;
    renderClock(); renderGauge(); renderNext(); renderResume();
  }
};

function renderResume(){
  const host = $("#resume");
  const last = [...state.log].sort(byLogDesc)[0];
  const today = T.filter(x => changedToday(x.id)).length;
  let html = `<h2>Pokračuj, kde si skončil</h2>`;

  if(last){
    html += `<a class="resume-log" href="#/dennik/${last.id}">
      <span class="rl-when">Posledné sedenie · ${fmtAgo(last.d)}</span>
      <span class="rl-text">${inline(plainText(last.text, 140)) || "<i>bez textu</i>"}</span>
    </a>`;
    if(last.links.length) html += `<div class="chips">${last.links.map(l => linkChip(l)).join("")}</div>`;
  }

  const recent = state.recent.slice(0, 5);
  if(recent.length){
    html += `<h3>Naposledy otvorené</h3><ul class="recent">${recent.map(id => {
      const x = BY_ID[id], n = notesOf(id).length;
      return `<li><a href="#/tema/${id}"><i class="dot l${lv(id)}"></i><span>${esc(x.n)}</span>${n ? `<em>✎ ${n}</em>` : ""}</a></li>`;
    }).join("")}</ul>`;
  }

  if(!last && !recent.length){
    html += `<p class="muted">Keď otvoríš tému alebo zapíšeš sedenie do denníka, nájdeš ich tu — aby si sa vedel rýchlo vrátiť.</p>`;
  }

  html += `<div class="resume-acts">
    <a class="btn" href="#/dennik" data-act="focus-compose">+ Zapísať dnešné sedenie</a>
    ${today ? `<a class="btn ghost" href="#/temy/${T.find(x => changedToday(x.id)).t}" data-act="filter-today">Dnes zmenené: ${today} ${skPieces(today)}</a>` : ""}
  </div>`;
  host.innerHTML = html;
}

action("filter-today", () => { ui.filter = "today"; });
action("focus-compose", () => { ui.focusCompose = true; });

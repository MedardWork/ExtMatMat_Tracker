/* ============================================================
   SCORING — each subtopic weighs what it was worth in the past tests (js/ec.js)
   ============================================================ */
function areaStats(key){
  /* what share of the block's points (from the past tests, js/ec.js) your levels cover, in the chosen scope;
     a subtopic out of scope or a topic in Nerelevantné brings nothing */
  const items = T.filter(x => x.t === "a" && x.area === key);
  let all = 0, got = 0, solid = 0, mid = 0;
  for(const x of items) for(const s of SUB_LIST[x.id]){
    const o = ecSub(x.id, s.k);
    if(!o) continue;
    all += o.pts;
    if(isOff(x.id) || !subIn(x.id, s.k)) continue;
    const v = subLv(x.id, s.k);
    got += o.pts * LV[v].w;
    if(v === 4) solid += o.pts; else if(v >= 2) mid += o.pts;
  }
  const w = AREAS[key].w, n = all || 1;
  return { w, solidFrac: solid / n, midFrac: mid / n, est: got / n * w };
}

function renderGauge(){
  const host = document.getElementById("blocks");
  if(!host) return;
  let total = 0, html = "";
  for(const key in AREAS){
    const st = areaStats(key);
    total += st.est;
    const teal  = Math.min(st.w, Math.round(st.solidFrac * st.w));
    const amber = Math.min(st.w - teal, Math.round(st.midFrac * st.w));
    let cells = "";
    for(let i=0;i<st.w;i++){
      const cls = i<teal ? "solid" : (i<teal+amber ? "shaky" : "");
      cells += `<div class="cell ${cls}"></div>`;
    }
    html += `<div class="block"><div class="cells">${cells}</div>
      <div class="block-label">${AREAS[key].name.split(",")[0]} <b>${st.w}</b></div></div>`;
  }
  host.innerHTML = html;

  const rounded = Math.round(total*10)/10;
  const sc = ecScope(), cov = ecCover(sc);
  const scopeNote = sc === "all" ? "" : ` Rozsah <b>${ecScopeOf(sc).label}</b> pokrýva ${ecNum(cov.pts)} z 30 bodov, viac sa z neho získať nedá.`;
  document.getElementById("score").innerHTML = `${rounded}<span> / 30 odhad na EČ</span>`;
  document.getElementById("barFill").style.width = (total/30*100).toFixed(1)+"%";

  const v = document.getElementById("verdict");
  const pct = Math.round(total/30*100);
  if(total === 0){
    v.innerHTML = "Odhad rastie z toho, čo si označíš nižšie — <b>perfektne</b> celé, <b>ide to</b> za dve tretiny, <b>slabo</b> za tretinu. Každá podtéma váži toľko, koľko bodov za ňu bývalo v minulých testoch." + scopeNote;
  } else {
    let msg;
    if(pct < 25)      msg = "Zatiaľ pod oboma hranicami. Najrýchlejší posun dostaneš z blokov, kde má jedna téma najväčšiu váhu.";
    else if(pct < 34) msg = "Medzi hranicami 25 % a 33 %. Tesné — jeden slabý blok vie výsledok stiahnuť.";
    else if(pct < 60) msg = "Nad hranicami. Odtiaľto už ide o percentil, nie o prejdenie.";
    else if(pct < 85) msg = "Silné pásmo. Rozdiel teraz robia úlohy na hodnotenie a tvorenie — tých býva 6 až 8.";
    else              msg = "Takmer plná mapa. Zvyšok je rýchlosť a presnosť pod 150 minútami.";
    v.innerHTML = `Približne <b>${pct} %</b> testu. ${msg}${scopeNote}`;
  }

  /* distribution across the five levels */
  const counts = [0,0,0,0,0];
  const ec = ecItems();
  ec.forEach(x => counts[lv(x.id)]++);
  const n = ec.length || 1;
  document.getElementById("dist").innerHTML = counts.map((c,i) =>
    `<div style="width:${(c/n*100).toFixed(2)}%;background:${LV_COLOR[i]};${i===0?"opacity:.45":""}" title="${LV[i].label}: ${c}"></div>`
  ).join("");
  document.getElementById("distLegend").innerHTML = counts.map((c,i) =>
    `<span><i style="background:${LV_COLOR[i]}"></i>${LV[i].label} <b>${c}</b></span>`
  ).join("");
}

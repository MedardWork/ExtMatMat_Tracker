/* ============================================================
   SCORING — weighted by the real test blueprint
   ============================================================ */
function areaStats(key){
  const items = T.filter(x => x.area === key);
  const n = items.length || 1;
  let sum = 0, s4 = 0, mid = 0;
  items.forEach(x => {
    const v = lv(x.id);
    sum += LV[v].w;
    if(v === 4) s4++; else if(v >= 2) mid++;
  });
  const w = AREAS[key].w;
  return { n, s4, mid, w, solidFrac: s4/n, midFrac: mid/n, est: sum / n * w };
}

function renderGauge(){
  const host = document.getElementById("blocks");
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
  document.getElementById("score").innerHTML = `${rounded}<span> / 30 odhad na EČ</span>`;
  document.getElementById("barFill").style.width = (total/30*100).toFixed(1)+"%";

  const v = document.getElementById("verdict");
  const pct = Math.round(total/30*100);
  if(total === 0){
    v.innerHTML = "Odhad rastie z toho, čo si označíš nižšie — <b>perfektne</b> celé, <b>ide to</b> za dve tretiny, <b>slabo</b> za tretinu.";
  } else {
    let msg;
    if(pct < 25)      msg = "Zatiaľ pod oboma hranicami. Najrýchlejší posun dostaneš z blokov, kde má jedna téma najväčšiu váhu.";
    else if(pct < 34) msg = "Medzi hranicami 25 % a 33 %. Tesné — jeden slabý blok vie výsledok stiahnuť.";
    else if(pct < 60) msg = "Nad hranicami. Odtiaľto už ide o percentil, nie o prejdenie.";
    else if(pct < 85) msg = "Silné pásmo. Rozdiel teraz robia úlohy na hodnotenie a tvorenie — tých býva 6 až 8.";
    else              msg = "Takmer plná mapa. Zvyšok je rýchlosť a presnosť pod 150 minútami.";
    v.innerHTML = `Približne <b>${pct} %</b> testu. ${msg}`;
  }

  /* distribution across the five levels */
  const counts = [0,0,0,0,0];
  EC_ITEMS.forEach(x => counts[lv(x.id)]++);
  const n = EC_ITEMS.length;
  document.getElementById("dist").innerHTML = counts.map((c,i) =>
    `<div style="width:${(c/n*100).toFixed(2)}%;background:${LV_COLOR[i]};${i===0?"opacity:.45":""}" title="${LV[i].label}: ${c}"></div>`
  ).join("");
  document.getElementById("distLegend").innerHTML = counts.map((c,i) =>
    `<span><i style="background:${LV_COLOR[i]}"></i>${LV[i].label} <b>${c}</b></span>`
  ).join("");
}

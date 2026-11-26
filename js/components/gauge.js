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

/* the marks on the score bar, in % of the test */
const GAUGE_MARKS = [33.3, 80];

/* the estimate drawn as the test itself: one box per task, grouped into the five blocks. A block's estimate
   fills its boxes from the left, each box from the bottom: teal for what subtopics on "perfektne" bring,
   amber for what the subtopics in progress bring. */
function renderGauge(){
  const host = document.getElementById("blocks");
  if(!host) return;
  let total = 0, html = "";
  const clamp = v => Math.max(0, Math.min(1, v));
  for(const key in AREAS){
    const st = areaStats(key);
    total += st.est;
    const solid = st.solidFrac * st.w;
    let cells = "";
    for(let i = 0; i < st.w; i++){
      const all = clamp(st.est - i), teal = Math.min(all, clamp(solid - i));
      cells += `<div class="cell"><i class="solid" style="height:${(teal * 100).toFixed(1)}%"></i><i class="shaky" style="height:${((all - teal) * 100).toFixed(1)}%;bottom:${(teal * 100).toFixed(1)}%"></i></div>`;
    }
    const name = AREAS[key].name.split(",")[0];
    html += `<div class="block" style="flex-grow:${st.w}" data-act="gauge-area" data-k="${key}" role="button" tabindex="0"
      title="${esc(AREAS[key].name)}: odhad ${ecNum(st.est)} z ${st.w} bodov · otvoriť témy bloku">
      <div class="cells">${cells}</div>
      <div class="block-label"><span>${name}</span> <span><b>${ecNum(st.est)}</b> / ${st.w}</span></div></div>`;
  }
  host.innerHTML = html;

  const rounded = Math.round(total*10)/10;
  const sc = ecScope(), cov = ecCover(sc);
  const scopeNote = sc === "all" ? "" : ` Rozsah <b>${ecScopeOf(sc).label}</b> pokrýva ${ecNum(cov.pts)} z 30 bodov, viac sa z neho získať nedá.`;
  document.getElementById("score").innerHTML = `${ecNum(rounded)}<span> / 30</span>`;
  document.getElementById("barFill").style.width = (total/30*100).toFixed(1)+"%";

  const v = document.getElementById("verdict");
  const pct = Math.round(total/30*100);
  if(total === 0){
    v.innerHTML = foldTxt("Odhad rastie z toho, ako ohodnotíš podtémy.", "Podtéma na <b>perfektne</b> sa počíta celá, <b>ide to</b> za dve tretiny, <b>slabo</b> za tretinu. Každá váži toľko, koľko bodov za ňu bývalo v minulých testoch." + scopeNote);
  } else {
    const to = p => ecNum(Math.max(0, p / 100 * 30 - total));
    let msg;
    if(pct < 33)      msg = `Pod čiarou 33 %, chýba ti ${to(33.3)} b.`;
    else if(pct < 80) msg = `Nad čiarou 33 %. Do 80 % ti chýba ${to(80)} b.`;
    else              msg = "Nad 80 %. Zvyšok je rýchlosť a presnosť pod 150 minútami.";
    v.innerHTML = `Približne <b>${pct} %</b> testu. ${msg}`;
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

/* a block of the sheet opens the topic list at that block */
action("gauge-area", el => {
  go("#/temy/a");
  setTimeout(() => { const t = document.getElementById("area-" + el.dataset.k); if(t) t.scrollIntoView({block:"start"}); }, 60);
});

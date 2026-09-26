/* ============================================================
   NEXT UP
   ============================================================ */
function renderNext(){
  const host = document.getElementById("next");
  const pool = EC_ITEMS.filter(x => lv(x.id) < 4);
  if(!pool.length){
    host.innerHTML = `<h2>Čo ďalej</h2><p class="done">Všetko je na úrovni perfektne. Rob celé testy na čas.</p>`;
    return;
  }
  const scored = pool.map(x => {
    let p = AREAS[x.area].w / T.filter(y => y.area === x.area).length;
    if(x.t === "a") p *= 2.2;
    const v = lv(x.id);
    if(v === 3) p *= 1.5;       /* skoro hotové — dotiahni */
    else if(v === 2) p *= 1.3;
    const b = blocked(x).length;
    if(b) p /= (1 + b);
    return {x, p, b};
  }).sort((m,k) => k.p - m.p).slice(0,5);

  const li = scored.map(({x,b}) => {
    const v = lv(x.id);
    const why = v >= 2 ? `rozrobené (${LV[v].label}) — dotiahni to`
              : x.t === "a" ? "prebrané, ale ešte nesedí"
              : `nové učivo · ${AREAS[x.area].name.split(",")[0]}`;
    const pre = b ? ` · najprv: ${blocked(x).map(id => BY_ID[id].n.split(/[:—,]/)[0].trim()).join(", ")}` : "";
    return `<li>${x.n}<br><em>${why}${pre}</em></li>`;
  }).join("");
  host.innerHTML = `<h2>Čo ďalej — podľa váhy v teste a toho, čo si označil</h2><ol>${li}</ol>`;
}

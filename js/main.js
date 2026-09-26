/* ============================================================
   BOOT — runs last, after every other script has loaded
   ============================================================ */
function renderAll(){
  renderClock(); renderGauge(); renderNext(); renderLog(); renderTabs(); renderList();
}

/* ---------- go ---------- */
renderKey();
load().then(() => { renderAll(); renderStoreNote(); });
setInterval(renderClock, 60*60*1000);

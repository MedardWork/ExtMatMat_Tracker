/* ============================================================
   STUDY LOG
   ============================================================ */
function renderLog(){
  const host = document.getElementById("logList");
  const entries = [...state.log].sort((a,b) => b.d.localeCompare(a.d) || (b.ts||0) - (a.ts||0));
  const shown = showAllLog ? entries : entries.slice(0, 4);
  let html = shown.map(e => `
    <div class="entry">
      <div class="entry-date">${fmtIso(e.d)}</div>
      <div class="entry-text">${esc(e.text)}</div>
      <button class="entry-del" data-del="${e.id}" title="Zmazať záznam" aria-label="Zmazať záznam">×</button>
    </div>`).join("");
  if(entries.length > 4){
    html += `<button class="more" id="logMore">${showAllLog ? "Zobraziť menej" : `Zobraziť všetky (${entries.length})`}</button>`;
  }
  host.innerHTML = html;

  const tl = document.getElementById("todayLink");
  const nToday = T.filter(x => changedToday(x.id)).length;
  if(nToday){
    tl.hidden = false;
    tl.textContent = `Dnes si zmenil ${nToday} ${skPieces(nToday)} → zobraziť`;
  } else tl.hidden = true;
}

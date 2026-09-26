/* ============================================================
   COUNTDOWN
   ============================================================ */
const EXAM = {d:"2027-03-11", label:"Externá časť", full:"štvrtok 11. marca 2027"};

function daysTo(iso){
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y,m,d] = iso.split("-").map(Number);
  return Math.round((new Date(y, m-1, d) - today) / 86400000);
}

function renderClock(){
  const left = EC_ITEMS.filter(x => lv(x.id) < 4).length;
  const days = daysTo(EXAM.d);
  const weeks = Math.floor(days / 7);
  const rest = days - weeks * 7;
  const host = document.getElementById("clockEc");
  if(!host) return;
  host.classList.toggle("past", days < 0);

  let big, when;
  if(days < 0){ big = `<div class="big">po skúške</div>`; when = EXAM.full; }
  else if(days === 0){ big = `<div class="big">dnes</div>`; when = EXAM.full; }
  else {
    big = `<div class="big">${weeks}<span>${skWeeks(weeks)}${rest ? " a " + rest + " " + skDays(rest) : ""}</span></div>`;
    when = `${EXAM.full} · ${days} ${skDays(days)}`;
  }

  let pace = "";
  if(days > 0 && left > 0){
    const per = left / Math.max(weeks, 1);
    const shown = per >= 10 ? Math.round(per) : Math.round(per * 10) / 10;
    pace = `<div class="pace">Ešte nie je na <i>perfektne</i> <b>${left}</b> ${skPieces(left)} — to je <b>${shown}</b> na týždeň.</div>`;
  } else if(left === 0){
    pace = `<div class="pace">Všetko na úrovni perfektne.</div>`;
  }
  host.innerHTML = `<h4>${EXAM.label}</h4>${big}<div class="when">${when}</div>${pace}`;
}

/* compact version for the top bar */
function renderMiniClock(){
  const el = document.getElementById("miniClock");
  if(!el) return;
  const days = daysTo(EXAM.d);
  el.textContent = days > 0 ? `${days} ${skDays(days)} do EČ` : days === 0 ? "EČ je dnes" : "";
  el.title = EXAM.full;
}

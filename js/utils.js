/* ============================================================
   HELPERS — escaping, search normalisation, dates, Slovak plurals
   ============================================================ */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function todayIso(){
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function isoOf(ts){
  const n = new Date(ts);
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function fmtIso(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

function skWeeks(n){ return n === 1 ? "týždeň" : (n >= 2 && n <= 4 ? "týždne" : "týždňov"); }
function skDays(n){  return n === 1 ? "deň"    : (n >= 2 && n <= 4 ? "dni"    : "dní"); }
function skPieces(n){return n === 1 ? "téma"   : (n >= 2 && n <= 4 ? "témy"   : "tém"); }

/* ============================================================
   HELPERS — escaping, search normalisation, dates, Slovak plurals
   ============================================================ */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function debounce(fn, ms){
  let t = null;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* ---------- dates ---------- */
function isoOf(ts){
  const n = new Date(ts);
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function todayIso(){ return isoOf(Date.now()); }
function fmtIso(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
function dateOf(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d);
}
/* whole days from a to b (both "YYYY-MM-DD") */
function dayDiff(a, b){ return Math.round((dateOf(b) - dateOf(a)) / 86400000); }

const WEEKDAYS = ["nedeľa","pondelok","utorok","streda","štvrtok","piatok","sobota"];
const MONTHS = ["január","február","marec","apríl","máj","jún","júl","august","september","október","november","december"];
const weekdayOf = iso => WEEKDAYS[dateOf(iso).getDay()];
const monthOf = iso => { const d = dateOf(iso); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

/* "dnes", "včera", "pred 3 dňami", otherwise the date */
function fmtAgo(iso){
  const n = dayDiff(iso, todayIso());
  if(n === 0) return "dnes";
  if(n === 1) return "včera";
  if(n > 1 && n < 7) return `pred ${n} dňami`;
  return fmtIso(iso);
}

/* ---------- Slovak plurals ---------- */
const plural = (n, one, few, many) => n === 1 ? one : (n >= 2 && n <= 4 ? few : many);
const skWeeks  = n => plural(n, "týždeň", "týždne", "týždňov");
const skDays   = n => plural(n, "deň", "dni", "dní");
const skPieces = n => plural(n, "téma", "témy", "tém");
const skNotes  = n => plural(n, "poznámka", "poznámky", "poznámok");
const skEntries= n => plural(n, "záznam", "záznamy", "záznamov");

/* ---------- text ---------- */
/* first words of a topic name, for chips and "najprv:" hints */
const shortName = x => x.n.split(/[:—,]/)[0].trim();

/* strip markdown down to a one-line snippet */
function plainText(md, max = 160){
  const s = String(md)
    .replace(/\[\[([a-c]\d+)\]\]/g, (_, id) => BY_ID[id] ? shortName(BY_ID[id]) : id)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*>\s*\[![^\]]+\]\s*/gm, "")
    .replace(/^\s*(#{1,3}|>|[-*+]\s+\[[ xX]\]|[-*+]|\d+[.)])\s+/gm, "")
    .replace(/\$\$/g, "").replace(/\*\*|==|~~|`/g, "")
    .replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max).trimEnd() + "…" : s;
}

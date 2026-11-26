/* ============================================================
   PLAN MODEL — the study plan is data, a JSON object in the format "maturita-plan-1":
   state.plan.def once the person pasted one in Info, otherwise PLAN_DEFAULT (js/data/plan.js;
   null in the public app, where everyone makes their own plan with an AI: then PLAN_NONE is true,
   the PLAN_* tables are empty and the calendar, the overview and Info offer "Vytvoriť plán s AI").
   compilePlan(def) turns it into the PLAN_* tables that the calendar and the overview read;
   ensurePlan() (called by render / refresh in core.js) recompiles whenever the def changed.
   The format is explained in planAiText() — the text that goes to an AI with the plan —
   and checked by validatePlan(); keep the three in step when the format grows.
   ============================================================ */
const PLAN_FORMAT = "maturita-plan-1";
/* kinds of slots in a day template (CSS: .k-<kind> in calendar.css) */
const PLAN_KIND = {math:"blok na tému z plánu", rev:"opakovanie", test:"test na čas", dses:"príprava na iný predmet (napríklad ústnu skúšku)",
  school:"škola alebo stáž", food:"jedlo", flex:"škola alebo rezerva; sem idú témy, ktoré sa nezmestia", free:"voľno", break:"prestávka"};
const PLAN_WD = ["Ne","Po","Ut","St","Št","Pi","So"];   /* keys of def.weekdays, by Date.getDay() */
const PLAN_TOP = ["format","start","exam","weeks","tests","day_texts","events","milestones","weekdays","periods","reserve_days","changes","days","rules"];

let PLAN;                 /* the def compiled last (undefined before the first compile; null = no plan) */
let PLAN_ERR = null;      /* errors of a stored def that could not be used (then the default is shown) */
let PLAN_NONE = false;    /* no plan at all: nothing pasted and no default */
let PLAN_START, PLAN_EXAM, PLAN_WEEKS, PLAN_ITEMS, PLAN_TESTS, PLAN_PHASE2, PLAN_MILESTONES, PLAN_DAYS,
    PLAN_EVENTS, PLAN_RULES, PLAN_REVIEW, PLAN_SLOTS, PLAN_OVER, PLAN_BY_DAY, PLAN_TOTAL, planDayType;

const planDef = () => state.plan.def || PLAN_DEFAULT;
const planIsCustom = () => !!state.plan.def && !PLAN_ERR;

function ensurePlan(){
  const def = planDef();
  if(def === PLAN) return;
  PLAN_ERR = null;
  let P = null;
  if(def && def !== PLAN_DEFAULT){
    const errs = validatePlan(def);
    if(errs.length) PLAN_ERR = errs;
    else try{ P = compilePlan(def); }catch(err){ PLAN_ERR = [String(err)]; }
  }
  if(!P && PLAN_DEFAULT) P = compilePlan(PLAN_DEFAULT);
  PLAN_NONE = !P;
  usePlan(P || {start:"", exam:"", weeks:[], items:[], tests:[], texts:[], milestones:[], days:{}, events:[], rules:[], review:{},
    slots:{}, over:{}, byDay:{}, total:0, dayType:() => null});
  PLAN = def;
}
function usePlan(P){
  ({start:PLAN_START, exam:PLAN_EXAM, weeks:PLAN_WEEKS, items:PLAN_ITEMS, tests:PLAN_TESTS, texts:PLAN_PHASE2,
    milestones:PLAN_MILESTONES, days:PLAN_DAYS, events:PLAN_EVENTS, rules:PLAN_RULES, review:PLAN_REVIEW,
    slots:PLAN_SLOTS, over:PLAN_OVER, byDay:PLAN_BY_DAY, total:PLAN_TOTAL, dayType:planDayType} = P);
}

const planAddDays = (s, n) => { const d = dateOf(s); d.setDate(d.getDate() + n); return isoOf(d); };

/* ---------- def → tables. Internal shapes (short keys) are what calendar.js and plancards.js use. ---------- */
function compilePlan(def){
  const P = {start:def.start, exam:def.exam};
  P.weeks = def.weeks.map((w, i) => ({id:"w" + i, from:w.from, to:w.to, cap:w.capacity, phase:w.phase === 2 ? 2 : 0, notes:w.notes || []}));
  P.tests = (def.tests || []).map(t => ({id:t.id, d:t.date, y:t.year == null ? "" : String(t.year), n:t.name}));
  const testBy = Object.fromEntries(P.tests.map(t => [t.id, t]));
  P.review = {};
  P.items = def.weeks.flatMap((w, i) => (w.items || []).map(it => {
    const rev = it.id.startsWith("opak:") ? it.id.slice(5) : null;
    if(rev) P.review[it.id] = rev;
    const n = it.name || (rev ? `Opakovanie: ${shortName(BY_ID[rev])}` : BY_ID[it.id] ? BY_ID[it.id].n : testBy[it.id].n);
    return {id:it.id, w:"w" + i, s:+it.sessions, n};
  }));
  P.texts = (def.day_texts || []).map(p => ({d:p.date, to:p.to, w:p.text}));
  P.events = (def.events || []).map(e => ({d:e.date, to:e.to, n:e.name, note:e.note, k:e.kind}));
  P.milestones = (def.milestones || []).map(m => ({d:m.date, t:m.text, ids:m.ids && m.ids.length ? m.ids : null, exam:!!m.exam}));
  P.days = Object.fromEntries(Object.entries(def.days).map(([k, v]) => [k, {n:v.name, note:v.note || "", s:v.slots}]));
  P.rules = (def.rules || []).map(r => [r.title, r.points || []]);

  /* which template a date follows: a test that day → "test"; else the first period it falls in; else its weekday */
  const testDays = new Set(P.tests.map(t => t.d));
  P.dayType = d => {
    const wd = dateOf(d).getDay();
    if(testDays.has(d) && P.days.test) return "test";
    for(const p of def.periods || []) if(d >= p.from && d <= p.to && !(p.weekdays_only && (wd === 0 || wd === 6))) return p.day;
    return def.weekdays[PLAN_WD[wd]];
  };
  /* a day hour by hour: its template with that day's changes (a change replaces whatever lies in its time) */
  const changes = {};
  for(const c of def.changes || []) (changes[c.date] ||= []).push(c);
  const daySlots = d => {
    let s = P.days[P.dayType(d)].s.map(([f, t, k, l]) => ({f, t, k, l}));
    for(const c of changes[d] || []){
      const out = [];
      for(const x of s){
        if(x.t <= c.from || x.f >= c.to){ out.push(x); continue; }
        if(x.f < c.from) out.push({...x, t:c.from});
        if(x.t > c.to) out.push({...x, f:c.to});
      }
      out.push({f:c.from, t:c.to, k:c.kind, l:c.label || ""});
      s = out.sort((a, b) => a.f.localeCompare(b.f));
    }
    return s;
  };

  /* the week's items put into its maths blocks, in order (1 block = half a session); what does not fit
     goes into the flex blocks of the reserve days; what still does not fit is listed in P.over */
  P.slots = {}; P.over = {};
  for(let d = P.start; d <= P.exam; d = planAddDays(d, 1)) P.slots[d] = daySlots(d);
  const reserve = new Set(def.reserve_days || []);
  for(const w of P.weeks){
    const items = P.items.filter(x => x.w === w.id);
    if(!items.length) continue;
    for(const x of items.filter(x => testBy[x.id])){
      const slot = (P.slots[testBy[x.id].d] || []).find(s => s.k === "test");
      if(slot) Object.assign(slot, {it:x, n:1, of:1});
    }
    const free = items.filter(x => !testBy[x.id]);
    const need = free.reduce((a, x) => a + Math.round(x.s * 2), 0);
    const cand = [];
    for(let d = w.from; d <= w.to; d = planAddDays(d, 1)){
      const type = P.dayType(d);
      if(type === "test" || !P.slots[d]) continue;
      for(const s of P.slots[d]) if(s.k === "math" || (s.k === "flex" && reserve.has(type))) cand.push(s);
    }
    let extra = need - cand.filter(s => s.k === "math").length;
    const use = cand.filter(s => s.k === "math" || extra-- > 0);
    let i = 0;
    for(const x of free){
      const of = Math.round(x.s * 2);
      for(let n = 1; n <= of; n++){
        if(i < use.length){ Object.assign(use[i++], {it:x, n, of}); continue; }
        const o = P.over[w.id] ||= [], last = o[o.length - 1];
        if(last && last.it === x) last.blocks++; else o.push({it:x, blocks:1});
      }
    }
  }
  /* per day: which items, how many blocks, whether the item starts / ends that day */
  P.byDay = {};
  for(const d in P.slots){
    const m = new Map();
    for(const s of P.slots[d]){
      if(!s.it) continue;
      const e = m.get(s.it) || {it:s.it, blocks:0, first:false, last:false};
      e.blocks++;
      if(s.n === 1) e.first = true;
      if(s.n === s.of) e.last = true;
      m.set(s.it, e);
    }
    if(m.size) P.byDay[d] = [...m.values()].map(e => ({...e, amt: testBy[e.it.id] ? e.it.s : e.blocks / 2}));
  }
  P.total = P.items.reduce((a, x) => a + x.s, 0);
  return P;
}

/* ---------- checking a def; every message names the place in the JSON ---------- */
function validatePlan(def){
  const E = [], err = (path, msg) => E.push(`${path}: ${msg}`);
  if(!isObj(def)) return ["Plán musí byť jeden objekt { … }."];
  const str = x => typeof x === "string" && x.trim() !== "";
  const iso = x => typeof x === "string" && /^\d{4}-\d\d-\d\d$/.test(x) && isoOf(dateOf(x)) === x;
  const hm = x => typeof x === "string" && /^\d\d:\d\d$/.test(x) && x >= "07:00" && x <= "23:00" && +x.slice(3) < 60;
  const arr = (x, path, req) => { if(x == null && !req) return []; if(!Array.isArray(x)){ err(path, "musí byť zoznam [ … ]"); return []; } return x; };
  const date = (x, path) => { if(!iso(x)) err(path, `dátum musí byť "RRRR-MM-DD", je ${JSON.stringify(x)}`); };
  const range = (o, path) => {
    date(o.date, path + ".date");
    if(o.to != null){ date(o.to, path + ".to"); if(iso(o.to) && iso(o.date) && o.to < o.date) err(path + ".to", "je skôr ako date"); }
  };
  if(def.format !== PLAN_FORMAT) err("format", `musí byť "${PLAN_FORMAT}"`);
  date(def.start, "start"); date(def.exam, "exam");
  if(iso(def.start) && iso(def.exam) && def.start >= def.exam) err("exam", "musí byť po start");
  const inside = x => !iso(def.start) || !iso(def.exam) || (x >= def.start && x <= def.exam);

  /* day templates */
  const days = isObj(def.days) ? def.days : (err("days", "chýba objekt so šablónami dní"), {});
  for(const k in days){
    const p = `days.${k}`, v = days[k];
    if(!/^[a-z0-9_]+$/.test(k)) err(p, "názov šablóny len z malých písmen bez diakritiky, číslic a _");
    if(!isObj(v)){ err(p, "musí byť objekt {name, note, slots}"); continue; }
    if(!str(v.name)) err(p + ".name", "chýba názov");
    if(v.note != null && typeof v.note !== "string") err(p + ".note", "musí byť text");
    const sl = arr(v.slots, p + ".slots", true);
    if(!sl.length) err(p + ".slots", "šablóna nemá žiadne bloky");
    let prev = null;
    sl.forEach((s, i) => {
      const q = `${p}.slots[${i}]`;
      if(!Array.isArray(s) || s.length < 3 || s.length > 4){ err(q, "blok má tvar [od, do, druh, popis]"); return; }
      const [f, t, k2, l] = s;
      if(!hm(f) || !hm(t)) err(q, `časy musia byť "HH:MM" medzi 07:00 a 23:00 (kalendár ukazuje 7 – 23 h), sú ${JSON.stringify(f)}, ${JSON.stringify(t)}`);
      else if(f >= t) err(q, "začiatok musí byť pred koncom");
      else if(prev && f < prev) err(q, `začína ${f}, ale predošlý blok končí ${prev} (bloky idú po sebe a neprekrývajú sa)`);
      if(!PLAN_KIND[k2]) err(q, `neznámy druh ${JSON.stringify(k2)}; povolené: ${Object.keys(PLAN_KIND).join(", ")}`);
      if(l != null && typeof l !== "string") err(q, "popis musí byť text");
      if(hm(t)) prev = t;
    });
  }
  const dayKey = (x, path) => { if(!days[x]) err(path, `neznáma šablóna dňa ${JSON.stringify(x)}; sú: ${Object.keys(days).join(", ")}`); };

  /* which template when */
  if(!isObj(def.weekdays)) err("weekdays", `chýba objekt {${PLAN_WD.slice(1).concat("Ne").map(x => `"${x}": …`).join(", ")}}`);
  else for(const w of PLAN_WD) dayKey(def.weekdays[w], `weekdays.${w}`);
  arr(def.periods, "periods").forEach((p, i) => {
    const q = `periods[${i}]`;
    if(!isObj(p)){ err(q, "musí byť objekt {from, to, day}"); return; }
    date(p.from, q + ".from"); date(p.to, q + ".to");
    if(iso(p.from) && iso(p.to) && p.to < p.from) err(q + ".to", "je skôr ako from");
    dayKey(p.day, q + ".day");
    if(p.weekdays_only != null && typeof p.weekdays_only !== "boolean") err(q + ".weekdays_only", "musí byť true alebo false");
  });
  arr(def.reserve_days, "reserve_days").forEach((k, i) => dayKey(k, `reserve_days[${i}]`));
  arr(def.changes, "changes").forEach((c, i) => {
    const q = `changes[${i}]`;
    if(!isObj(c)){ err(q, "musí byť objekt {date, from, to, kind, label}"); return; }
    date(c.date, q + ".date");
    if(iso(c.date) && !inside(c.date)) err(q + ".date", "leží mimo plánu (start – exam)");
    if(!hm(c.from) || !hm(c.to)) err(q, `časy from / to musia byť "HH:MM" medzi 07:00 a 23:00`);
    else if(c.from >= c.to) err(q, "from musí byť pred to");
    if(!PLAN_KIND[c.kind]) err(q + ".kind", `neznámy druh ${JSON.stringify(c.kind)}; povolené: ${Object.keys(PLAN_KIND).join(", ")}`);
    if(c.label != null && typeof c.label !== "string") err(q + ".label", "musí byť text");
  });

  /* tests */
  const tests = {};
  arr(def.tests, "tests").forEach((t, i) => {
    const q = `tests[${i}]`;
    if(!isObj(t)){ err(q, "musí byť objekt {id, date, name, year}"); return; }
    if(!str(t.id) || BY_ID[t.id] || t.id.startsWith("opak:")) err(q + ".id", `id testu nesmie byť prázdne ani rovnaké ako id témy, je ${JSON.stringify(t.id)}`);
    else if(tests[t.id]) err(q + ".id", `id ${t.id} je dvakrát`);
    else tests[t.id] = t;
    date(t.date, q + ".date");
    if(iso(t.date) && !inside(t.date)) err(q + ".date", "leží mimo plánu (start – exam)");
    if(!str(t.name)) err(q + ".name", "chýba názov");
  });
  if(Object.keys(tests).length && !(days.test && arr(days.test.slots, "days.test.slots").some(s => Array.isArray(s) && s[2] === "test")))
    err("days.test", "keď sú v pláne testy, treba šablónu dňa \"test\" s blokom druhu \"test\"");

  /* weeks and their items */
  const seen = {};
  let last = null;
  arr(def.weeks, "weeks", true).forEach((w, i) => {
    const q = `weeks[${i}]`;
    if(!isObj(w)){ err(q, "musí byť objekt {from, to, capacity, notes, items}"); return; }
    date(w.from, q + ".from"); date(w.to, q + ".to");
    if(iso(w.from) && iso(w.to)){
      if(w.to < w.from) err(q + ".to", "je skôr ako from");
      if(!inside(w.from) || !inside(w.to)) err(q, "týždeň leží mimo plánu (start – exam)");
      if(last && w.from <= last) err(q + ".from", `týždne idú po sebe a neprekrývajú sa (predošlý končí ${last})`);
      last = w.to;
    }
    if(w.phase != null && w.phase !== 2) err(q + ".phase", "môže byť len 2 (fáza testov) alebo chýbať");
    if(w.capacity != null && !(typeof w.capacity === "number" && w.capacity >= 0)) err(q + ".capacity", "musí byť číslo (sedenia)");
    arr(w.notes, q + ".notes").forEach((n, j) => { if(typeof n !== "string") err(`${q}.notes[${j}]`, "musí byť text"); });
    arr(w.items, q + ".items").forEach((it, j) => {
      const p = `${q}.items[${j}]`;
      if(!isObj(it)){ err(p, "musí byť objekt {id, sessions}"); return; }
      const id = it.id;
      const rev = typeof id === "string" && id.startsWith("opak:") ? id.slice(5) : null;
      if(typeof id !== "string" || !(BY_ID[id] || (rev && BY_ID[rev]) || tests[id])) err(p + ".id", `neznáme id ${JSON.stringify(id)}: má byť id témy (napr. "b36"), "opak:" + id témy alebo id testu z tests`);
      else if(seen[id]) err(p + ".id", `${id} je v pláne dvakrát (aj v ${seen[id]}); každá položka smie byť len raz`);
      else seen[id] = p;
      if(!(typeof it.sessions === "number" && it.sessions > 0 && Number.isInteger(it.sessions * 2))) err(p + ".sessions", `počet sedení musí byť kladný násobok 0,5, je ${JSON.stringify(it.sessions)}`);
      if(it.name != null && !str(it.name)) err(p + ".name", "musí byť text");
      if(tests[id] && iso(w.from) && iso(w.to) && iso(tests[id].date) && (tests[id].date < w.from || tests[id].date > w.to))
        err(p + ".id", `test ${id} je ${tests[id].date}, mimo tohto týždňa`);
    });
  });
  if(Array.isArray(def.weeks) && !def.weeks.length) err("weeks", "plán nemá žiadny týždeň");

  arr(def.day_texts, "day_texts").forEach((p, i) => {
    const q = `day_texts[${i}]`;
    if(!isObj(p)){ err(q, "musí byť objekt {date, text}"); return; }
    range(p, q);
    if(!str(p.text)) err(q + ".text", "chýba text");
  });
  arr(def.events, "events").forEach((e, i) => {
    const q = `events[${i}]`;
    if(!isObj(e)){ err(q, "musí byť objekt {date, name}"); return; }
    range(e, q);
    if(!str(e.name)) err(q + ".name", "chýba názov");
    if(e.note != null && typeof e.note !== "string") err(q + ".note", "musí byť text");
    if(e.kind != null && e.kind !== "free" && e.kind !== "exam") err(q + ".kind", `môže byť "free", "exam" alebo chýbať`);
  });
  arr(def.milestones, "milestones").forEach((m, i) => {
    const q = `milestones[${i}]`;
    if(!isObj(m)){ err(q, "musí byť objekt {date, text}"); return; }
    date(m.date, q + ".date");
    if(!str(m.text)) err(q + ".text", "chýba text");
    arr(m.ids, q + ".ids").forEach((id, j) => { if(!seen[id] && !tests[id]) err(`${q}.ids[${j}]`, `${JSON.stringify(id)} nie je položka týždňa ani test`); });
  });
  arr(def.rules, "rules").forEach((r, i) => {
    const q = `rules[${i}]`;
    if(!isObj(r) || !str(r.title)) err(q, "musí byť objekt {title, points}");
    else arr(r.points, q + ".points").forEach((p, j) => { if(typeof p !== "string") err(`${q}.points[${j}]`, "musí byť text"); });
  });
  return E;
}

/* ---------- JSON for people and AIs: short lists and objects stay on one line ---------- */
function planJson(v, ind = "", pre = 0){
  const one = JSON.stringify(v);
  if(v === null || typeof v !== "object" || pre + ind.length + one.length <= 120) return one;
  const ind2 = ind + "  ";
  if(Array.isArray(v)) return v.length ? `[\n${v.map(x => ind2 + planJson(x, ind2)).join(",\n")}\n${ind}]` : "[]";
  const ks = Object.keys(v).filter(k => v[k] !== undefined);
  return `{\n${ks.map(k => `${ind2}${JSON.stringify(k)}: ${planJson(v[k], ind2, k.length + 4)}`).join(",\n")}\n${ind}}`;
}
/* the def with its top-level keys in the usual order (unknown keys last) */
function planOrdered(def){
  const out = {};
  for(const k of PLAN_TOP) if(def[k] !== undefined) out[k] = def[k];
  for(const k in def) if(!(k in out)) out[k] = def[k];
  return out;
}

/* ---------- a plan out of pasted text: the AI's whole answer, a ```json block, the bare JSON or a full backup ---------- */
function planFromText(txt){
  const t = String(txt || "").trim();
  const cands = [];
  const re = /```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
  let m;
  while((m = re.exec(t))) cands.push(m[1]);
  cands.push(t);
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if(a >= 0 && b > a) cands.push(t.slice(a, b + 1));
  let found = null;
  for(const c of cands){
    let o;
    try{ o = JSON.parse(c); }catch(err){ continue; }
    if(!isObj(o)) continue;
    if(o.format === PLAN_FORMAT) return {def:o};
    if(isObj(o.slv) && isObj(o.plan)) found ||= {def:o.plan.def || null, backup:true};
    else found ||= {def:o};
  }
  return found;
}

/* ---------- what changes between two plans, for the preview before a pasted plan is used ---------- */
function planDiff(a, b){
  const out = [], push = (h, ls) => { if(ls.length) out.push([h, ls]); };
  const wl = w => `${fmtD(w.from)} – ${fmtD(w.to)}`;
  const nm = (id, it) => (it && it.name) || (id.startsWith("opak:") && BY_ID[id.slice(5)] ? `Opakovanie: ${shortName(BY_ID[id.slice(5)])}` : BY_ID[id] ? shortName(BY_ID[id]) : id);
  const items = def => { const m = {}; (def.weeks || []).forEach(w => (w.items || []).forEach(it => { m[it.id] = {w, it}; })); return m; };
  const A = items(a), B = items(b);
  const add = [], del = [], mv = [], ses = [], ren = [];
  for(const id in B){
    const x = B[id], y = A[id];
    if(!y){ add.push(`${nm(id, x.it)} (${id}): týždeň ${wl(x.w)}, ${calNum(x.it.sessions)} ${skSed(x.it.sessions)}`); continue; }
    if(x.w.from !== y.w.from) mv.push(`${nm(id, x.it)}: z týždňa ${wl(y.w)} do ${wl(x.w)}`);
    if(x.it.sessions !== y.it.sessions) ses.push(`${nm(id, x.it)}: ${calNum(y.it.sessions)} → ${calNum(x.it.sessions)} ${skSed(x.it.sessions)}`);
    if((x.it.name || "") !== (y.it.name || "")) ren.push(`${id}: „${nm(id, y.it)}“ → „${nm(id, x.it)}“`);
  }
  for(const id in A) if(!B[id]) del.push(`${nm(id, A[id].it)} (${id})`);
  push("Pridané položky", add); push("Odobraté položky", del); push("Presunuté do iného týždňa", mv);
  push("Iný počet sedení", ses); push("Iný názov", ren);
  /* weeks: by their start */
  const wa = Object.fromEntries((a.weeks || []).map(w => [w.from, w])), wb = Object.fromEntries((b.weeks || []).map(w => [w.from, w]));
  const wk = [];
  for(const f in wb){
    const x = wb[f], y = wa[f];
    if(!y){ wk.push(`nový týždeň ${wl(x)}`); continue; }
    if(x.to !== y.to) wk.push(`${fmtD(f)}: koniec ${fmtD(y.to)} → ${fmtD(x.to)}`);
    if((x.phase || 0) !== (y.phase || 0)) wk.push(`${wl(x)}: ${x.phase === 2 ? "teraz fáza testov" : "už nie fáza testov"}`);
    if(x.capacity !== y.capacity && x.capacity != null && y.capacity != null) wk.push(`${wl(x)}: kapacita ${calNum(y.capacity)} → ${calNum(x.capacity)}`);
    if(JSON.stringify(x.notes || []) !== JSON.stringify(y.notes || [])) wk.push(`${wl(x)}: iné poznámky k týždňu`);
    const both = id => A[id] && B[id] && A[id].w.from === f && B[id].w.from === f;
    const oa = (y.items || []).map(i => i.id).filter(both), ob = (x.items || []).map(i => i.id).filter(both);
    if(oa.join() !== ob.join()) wk.push(`${wl(x)}: iné poradie tém`);
  }
  for(const f in wa) if(!wb[f]) wk.push(`zrušený týždeň ${wl(wa[f])}`);
  push("Týždne", wk);
  const sc = [];
  if(a.start !== b.start) sc.push(`začiatok plánu: ${fmtD(a.start)} → ${fmtD(b.start)}`);
  if(a.exam !== b.exam) sc.push(`maturita: ${fmtD(a.exam)} → ${fmtD(b.exam)}`);
  push("Dátumy", sc);
  /* the other lists: added, removed, changed, by a key */
  const keyed = (h, la, lb, key, label) => {
    const ma = new Map((la || []).map(x => [key(x), x])), mb = new Map((lb || []).map(x => [key(x), x])), ls = [];
    for(const [k, x] of mb){
      if(!ma.has(k)) ls.push(`pridané: ${label(x)}`);
      else if(JSON.stringify(x) !== JSON.stringify(ma.get(k))) ls.push(`zmenené: ${label(x)}`);
    }
    for(const [k, x] of ma) if(!mb.has(k)) ls.push(`odobraté: ${label(x)}`);
    push(h, ls);
  };
  const when = x => x.to && x.to !== x.date ? `${fmtD(x.date)} – ${fmtD(x.to)}` : fmtD(x.date);
  keyed("Testy", a.tests, b.tests, x => x.id, x => `${x.name} (${fmtD(x.date)})`);
  keyed("Zmeny jednotlivých dní", a.changes, b.changes, x => x.date + x.from, x => `${fmtD(x.date)} ${x.from}–${x.to} ${x.label || x.kind}`);
  keyed("Udalosti", a.events, b.events, x => x.date + x.name, x => `${x.name} (${when(x)})`);
  keyed("Texty k dňom", a.day_texts, b.day_texts, x => x.date, x => `${when(x)}: ${x.text}`);
  keyed("Míľniky", a.milestones, b.milestones, x => x.date, x => `${fmtD(x.date)}: ${x.text}`);
  keyed("Obdobia", a.periods, b.periods, x => x.from + x.day, x => `${x.day} ${fmtD(x.from)} – ${fmtD(x.to)}`);
  keyed("Šablóny dní", Object.entries(a.days || {}), Object.entries(b.days || {}), x => x[0], x => `${x[0]} (${x[1].name})`);
  keyed("Pravidlá", a.rules, b.rules, x => x.title, x => x.title);
  const other = [];
  if(JSON.stringify(a.weekdays) !== JSON.stringify(b.weekdays)) other.push("ktorá šablóna platí v ktorý deň týždňa (weekdays)");
  if(JSON.stringify(a.reserve_days || []) !== JSON.stringify(b.reserve_days || [])) other.push(`rezervné dni: ${(b.reserve_days || []).join(", ") || "žiadne"}`);
  push("Ďalšie", other);
  return out;
}

/* ---------- the plan with instructions and the person's progress, to paste into an AI chat ---------- */
function planFormatText(){
  return `AKO PLÁN FUNGUJE (formát ${PLAN_FORMAT})
- Sedenie = 2 bloky po 45 minút. Dátumy sú "RRRR-MM-DD", časy "HH:MM".
- weeks: týždne po sebe, bez prekrývania: {from, to, capacity, notes, items}.
  - items sú položky týždňa v poradí, v akom sa majú robiť: {id, sessions, name?}. Appka ich sama rozloží do blokov druhu "math" v dňoch toho týždňa (1 blok = pol sedenia). Čo sa nezmestí, ide do blokov "flex" v dňoch, ktorých šablóna je v reserve_days. Čo sa nezmestí ani tam, appka ukáže pri týždni ako varovanie.
  - id je id témy z appky (napr. "b36"), "opak:" + id témy pre opakovanie (napr. "opak:b4", vtedy daj aj name) alebo id testu z tests (taký test sa dá na svoj deň do bloku "test").
  - Každé id smie byť v celom pláne len raz. sessions je násobok 0,5.
  - name je nepovinný krátky názov do kalendára; bez neho appka použije názov témy.
  - capacity je počet sedení, ktoré sa do týždňa zmestia; appka ho len ukáže. Týždeň fázy testov má namiesto neho "phase": 2.
  - notes sú poznámky k týždňu, ukážu sa v kalendári.
- tests: testy na čas {id, date, name, year}. V deň testu platí šablóna dňa "test". Body si zapisujem v appke.
- days: šablóny dňa {name, note, slots}. slots sú [od, do, druh, popis], idú po sebe, neprekrývajú sa a ležia medzi 07:00 a 23:00. Druhy blokov: ${Object.entries(PLAN_KIND).map(([k, v]) => `"${k}" (${v})`).join(", ")}.
- Ktorá šablóna platí v ktorý deň: v deň testu "test"; inak prvé obdobie z periods, do ktorého dátum padne (weekdays_only: true znamená, že obdobie platí len Po–Pi a cez víkend sa ide ďalej); inak podľa weekdays (Po … Ne).
- changes: zmena jedného dňa {date, from, to, kind, label}. Nahradí všetko, čo v šablóne leží v tom čase (oslava, písomka, voľné doobedie).
- events: udalosti {date, to?, name, note?, kind?}, kind je "free" (voľno) alebo "exam". Iba sa zobrazia a rozvrh nemenia; na to sú changes a periods.
- day_texts: text k dňu alebo obdobiu {date, to?, text}, napríklad čo robiť vo fáze testov.
- milestones: míľniky {date, text, ids?, exam?}; ids sú položky týždňov alebo testy, ktoré majú byť do toho dňa hotové.
- rules: pravidlá plánu {title, points}, ukazujú sa na prehľade; **tučné** funguje.

AKO APPKA RÁTA POKROK (to do plánu nepíš, appka to berie zo svojich dát)
- Téma je hotová od úrovne „ide to“; „neviem“ a „slabo“ sa za hotové nerátajú (často je to len moje prvé hodnotenie, nie začatá práca).
- Položka má byť hotová po poslednom dni, ktorý jej plán dáva; čo sa do týždňa nezmestí, do konca ďalšieho týždňa. Dovtedy nerobí sklz, a keď ju dokončím skôr, mám náskok.
- Opakovanie je hotové, keď mám k jeho téme poznámku alebo test z tejto témy (s bodmi) z toho týždňa alebo neskôr.
- Test je hotový, keď má zapísané body.
- Testy z tém sú krátke testy, ktoré si zapisujem k jednotlivým témam (každá úloha 1 bod, čiastočne pol bodu). Do tempa sa nerátajú. Téma, ktorej posledný test je pod ${Math.round(TEST_WEAK * 100)} %, potrebuje opakovanie.`;
}

/* a small valid plan to show an AI the shape when there is no plan yet (generic, nothing personal) */
function planStarter(){
  const t = todayIso(), exam = typeof EXAM !== "undefined" && EXAM.d > t ? EXAM.d : planAddDays(t, 120);
  const sun = planAddDays(t, (7 - dateOf(t).getDay()) % 7);
  return {format:PLAN_FORMAT, start:t, exam,
    weeks:[{from:t, to:sun, capacity:4, notes:["Príklad týždňa: nahraď ho skutočnými týždňami až do maturity."],
      items:[{id:"a14", sessions:2}, {id:"a15", sessions:1.5}, {id:"opak:a1", sessions:0.5, name:"Percentá: zopakovať"}]}],
    tests:[{id:"t1", date:planAddDays(exam, -7), name:"Test 1 na čas", year:"2025"}],
    day_texts:[], events:[],
    milestones:[{date:exam, text:"Maturita z matematiky", exam:true}],
    weekdays:{Po:"skola", Ut:"skola", St:"skola", "Št":"skola", Pi:"skola", So:"vikend", Ne:"vikend"},
    periods:[], reserve_days:["vikend"], changes:[],
    days:{
      skola:{name:"Školský deň", note:"Po škole dva bloky matiky.", slots:[
        ["07:00","15:00","school","Škola"], ["15:00","15:30","food","Obed"], ["15:30","16:15","math","Blok 1"], ["16:15","16:30","break","Prestávka"],
        ["16:30","17:15","math","Blok 2"], ["17:15","23:00","free","Voľno"]]},
      vikend:{name:"Víkend", note:"Tri bloky doobeda, poobede rezerva.", slots:[
        ["07:00","09:00","free","Ráno"], ["09:00","09:45","math","Blok 1"], ["09:45","10:00","break","Prestávka"], ["10:00","10:45","math","Blok 2"],
        ["10:45","11:00","break","Prestávka"], ["11:00","11:45","math","Blok 3"], ["11:45","15:00","free","Obed a oddych"],
        ["15:00","15:45","flex","Rezerva: čo sa cez týždeň nestihlo"], ["15:45","23:00","free","Voľno"]]},
      test:{name:"Testový deň", note:"Test na čas doobeda, potom rozbor chýb.", slots:[
        ["07:00","08:00","free","Raňajky"], ["08:00","10:30","test","Test na čas: 150 minút"], ["10:30","10:45","break","Prestávka"],
        ["10:45","11:45","math","Rozbor chýb"], ["11:45","23:00","free","Voľno"]]},
      volno:{name:"Voľno", note:"Bez matiky.", slots:[["07:00","23:00","free","Voľný deň"]]}},
    rules:[
      {title:"Jednotka času", points:["**Blok** = 45 minút práce + 15 minút prestávka. **Sedenie** = 2 bloky."]},
      {title:"Keď meškáš", points:["Doťahuj v rezervných blokoch. Pri ľahkých témach stačí menej sedení."]}]};
}

/* the latest scored topic test, for the AI texts: "8/10 (80 %, 21. 11.)" */
const testForAi = id => { const x = lastScored(id); return x ? `${scoreTxt(id, x)} (${pctTxt(id, x)}, ${fmtD(x.d)})` : ""; };

/* no plan yet: ask the AI to make one, after asking the person what it needs */
function planCreateText(){
  const F = "```", t = todayIso();
  const tops = T.filter(x => /^[ab]/.test(x.id) && !(state.rel[x.id] && state.rel[x.id].off))
    .map(x => `- ${x.id} ${shortName(x)}: ${LV[lv(x.id)].label}${testForAi(x.id) ? `, posledný test ${testForAi(x.id)}` : ""}`);
  return `Pomôž mi vytvoriť študijný plán na externú maturitu z matematiky pre moju appku (Maturita z matematiky). Appka z plánu spraví kalendár: rozloží témy do blokov v dňoch a ukazuje, či idem podľa plánu.

AKO POSTUPOVAŤ
- Najprv sa ma opýtaj na všetko, čo potrebuješ vedieť, a plán napíš až potom. Napríklad: kedy mám maturitu a od kedy chcem začať; ako vyzerá môj bežný týždeň (škola, tréningy, krúžky) a koľko času mám v ktorý deň na matiku; prázdniny a dni, keď sa učiť nebudem; či chcem pred maturitou písať testy z minulých rokov na čas.
- Témy vyber a zoraď podľa mojich úrovní nižšie: najprv to, čo neviem, zvládnuté témy len zopakuj alebo vynechaj.
- Celý plán vráť ako jeden blok ${F}json. Appka si ho z odpovede vyberie sama, skontroluje ho a pred použitím mi ho ukáže.
- Pod blok napíš v pár vetách, ako je plán postavený.

${planFormatText()}

MOJE TÉMY A ÚROVNE (dnes je ${WEEKDAYS[dateOf(t).getDay()]} ${fmtD(t)} ${t.slice(0, 4)})
${tops.join("\n")}

KOSTRA PLÁNU (len príklad tvaru: dni, týždne aj témy prispôsob mne)
${F}json
${planJson(planStarter())}
${F}
`;
}

function planAiText(){
  ensurePlan();
  if(PLAN_NONE) return planCreateText();
  const def = planOrdered(planDef()), t = todayIso(), pc = planPace();
  const st = x => {
    const k = itemKind(x);
    if(k === "test") return planScore(x.id) != null ? `napísaný, ${planScore(x.id)}/30 b.` : "nenapísaný";
    if(k === "rev") return planStatus(x) === 2 ? "hotové" : "nezačaté";
    return `${planStatus(x) === 2 ? "hotové" : "nehotové"} (${LV[lv(x.id)].label})`;
  };
  const weeks = PLAN_WEEKS.map(w => {
    const its = PLAN_ITEMS.filter(x => x.w === w.id);
    return its.length ? `  - ${fmtD(w.from)} – ${fmtD(w.to)}: ${its.map(x => `${x.id} ${st(x)}`).join("; ")}` : null;
  }).filter(Boolean);
  const tests = PLAN_TESTS.filter(x => planScore(x.id) != null).map(x => `${x.n} (${x.id}) ${planScore(x.id)}/30`);
  const topicTests = T.filter(x => testForAi(x.id)).map(x => `${x.id} ${testForAi(x.id)}`);
  const weak = T.filter(x => !(state.rel[x.id] && state.rel[x.id].off) && weakTopic(x.id)).map(x => x.id);
  const inPlanIds = new Set(PLAN_ITEMS.map(planTopicOf).filter(Boolean));
  const outside = T.filter(x => /^[ab]/.test(x.id) && !inPlanIds.has(x.id) && !(state.rel[x.id] && state.rel[x.id].off) && topicIn(x.id))
    .map(x => `${x.id} ${shortName(x)} (${LV[lv(x.id)].label})`);
  const pace = t < PLAN_START ? `plán ešte nezačal (začína ${fmtD(PLAN_START)})`
    : `podľa plánu som mal mať do dnes hotové ${calNum(pc.ex)} ${skSed(pc.ex)}, mám ${calNum(pc.done)} (hotová téma = od „ide to“)` +
      (Math.abs(pc.delta) < 0.5 ? ", idem presne podľa plánu" : pc.delta > 0 ? `, náskok ${calNum(pc.delta)}` : `, sklz ${calNum(-pc.delta)}`) +
      (pc.open.length ? `; mešká (plán to už mal, nie je hotové): ${pc.open.map(x => x.id).join(", ")}` : "");
  const F = "```";
  return `Toto je môj študijný plán na externú maturitu z matematiky z mojej appky. Uprav ho, prosím, podľa toho, o čo ťa požiadam (pod týmto textom alebo v ďalšej správe).

AKO ODPOVEDAŤ
- Vráť celý upravený plán ako jeden blok ${F}json, nie iba zmenené časti. Appka si ho z odpovede vyberie sama, skontroluje ho a pred použitím mi ukáže, čo sa mení.
- Pod blok napíš v pár vetách, čo si zmenil a prečo.
- Meň len to, čo treba. Názvy polí a formát nechaj tak.

${planFormatText()}

MÔJ STAV (dnes je ${WEEKDAYS[dateOf(t).getDay()]} ${fmtD(t)} ${t.slice(0, 4)})
- Tempo: ${pace}.
- Položky plánu po týždňoch:
${weeks.join("\n")}
- Body z testov: ${tests.length ? tests.join(", ") : "zatiaľ žiadne"}.
- Testy z tém (môj posledný test z témy): ${topicTests.length ? topicTests.join("; ") : "zatiaľ žiadne"}.${weak.length ? `
- Slabý posledný test (pod ${Math.round(TEST_WEAK * 100)} %), na zopakovanie: ${weak.join(", ")}.` : ""}
- Témy, ktoré v pláne nie sú (id, názov, moja úroveň): ${outside.join("; ") || "žiadne"}.
${ecAiText()}
PLÁN
${F}json
${planJson(def)}
${F}
`;
}

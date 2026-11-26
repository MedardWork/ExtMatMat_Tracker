/* ============================================================
   EČ SCOPE — what the past external tests asked, per subtopic (data: js/data/ec.js)

   Per subtopic: in which years it was asked, its expected points per test, a time estimate and so
   its points per hour of study. Three scopes the person picks from (state.prefs.scope):
     min  Nutné minimum  the subtopics with the most points per hour, until they cover EC_MIN_TARGET
                         of the 30 points of an average test
     ec   Externá časť   every subtopic asked at least twice, or at least once since EC_RECENT
     all  Celá maturita  everything (the default; the app behaves as before)
   The scope applies to the Slovak topics only; the Danish c… topics are a separate exam.
   A subtopic the person added (own) is always in scope. lv() and understanding() count only the
   subtopics in scope, so everything built on them (lists, pace, plan, estimate) follows the scope.
   ============================================================ */
const EC_SCOPES = [
  {k:"min", label:"Nutné minimum", desc:"Podtémy s najväčším ziskom bodov za hodinu učenia, kým spolu nepokryjú polovicu bodov priemerného testu. Aj s chybami tak máš rezervu nad hranicou 33 %."},
  {k:"ec",  label:"Externá časť",  desc:"Všetko, na čo sa externá časť pýtala aspoň dvakrát, alebo aspoň raz od roku 2017."},
  {k:"all", label:"Celá maturita", desc:"Všetky témy, aj tie, ktoré v externej časti neboli: patria do písomnej a ústnej časti."}
];
const EC_MIN_TARGET = 15;     /* points of 30 the minimum should cover */
const EC_RECENT = 2017;       /* "asked lately" */
const EC_SESSION_H = 1.5;     /* one plan session = two 45-minute blocks */
/* newer tests count more: 2019+ is today's format, 2005–2011 an older curriculum (and level A until 2008) */
const ecYearW = y => y >= 2019 ? 1 : y >= 2012 ? 0.75 : 0.5;
/* hours to learn a subtopic from zero, from how hard its tasks were (1 → 1 h, 2 → 1,5 h, 3 → 2 h) */
const ecHours = d => 0.5 + 0.5 * d;
const EC_DEFAULT_H = 1;       /* a subtopic never asked */

const EC = (() => {
  const W = EC_TESTS.reduce((a, t) => a + ecYearW(t.y), 0);
  const sub = {}, topic = {}, diff = {};
  for(const t of EC_TESTS) t.t.forEach(([refs, d, l], i) => {
    const list = refs.split(" ");
    const ws = list.map((_, j) => j ? 1 : 2), sum = ws.reduce((a, b) => a + b, 0);   /* the main subtopic counts double */
    list.forEach((ref, j) => {
      const [tid, ix] = ref.split(".");
      const name = (SUBS[tid] || [])[+ix];
      if(!name) return;                                     /* dev/eccheck.js reports these */
      const key = `${tid}/${subKey(name)}`;
      const o = sub[key] ||= {tid, k:subKey(name), n:name, pts:0, years:[], tasks:[]};
      o.pts += ws[j] / sum * ecYearW(t.y) / W;              /* points per average test (all 30 tasks: 1 point) */
      if(!o.years.includes(t.y)) o.years.push(t.y);
      o.tasks.push({y:t.y, q:i + 1, d, l, main:j === 0});
      (diff[key] ||= []).push(d);
    });
  });
  for(const key in sub){
    const o = sub[key], ds = diff[key];
    o.d = ds.reduce((a, b) => a + b, 0) / ds.length;
    o.h = ecHours(o.d);
    o.pph = o.pts / o.h;
    o.recent = o.years.filter(y => y >= EC_RECENT).length;
  }
  for(const x of T){
    if(x.t === "c") continue;
    const subs = (SUBS[x.id] || [x.n]).map(n => sub[`${x.id}/${subKey(n)}`]);
    const years = new Set(subs.flatMap(o => o ? o.years : []));
    topic[x.id] = {pts:subs.reduce((a, o) => a + (o ? o.pts : 0), 0), years:years.size,
      h:subs.reduce((a, o) => a + (o ? o.h : EC_DEFAULT_H), 0)};
  }
  /* the scopes as sets of "topic/subKey"; a subtopic brings along what it needs (EC_NEEDS) */
  const keyOf = ref => { const [tid, ix] = ref.split("."), n = (SUBS[tid] || [])[+ix]; return n ? `${tid}/${subKey(n)}` : null; };
  const needs = {};
  for(const ref in EC_NEEDS){ const k = keyOf(ref); if(k) needs[k] = EC_NEEDS[ref].map(keyOf).filter(Boolean); }
  const take = (set, k) => { if(set.has(k)) return 0; set.add(k); return (sub[k] ? sub[k].pts : 0) + (needs[k] || []).reduce((a, n) => a + take(set, n), 0); };
  const ec = new Set();
  Object.keys(sub).filter(k => sub[k].years.length >= 2 || sub[k].recent >= 1).forEach(k => take(ec, k));
  const min = new Set();
  let got = 0;
  for(const k of Object.keys(sub).sort((a, b) => sub[b].pph - sub[a].pph)){
    if(got >= EC_MIN_TARGET) break;
    got += take(min, k);
  }
  return {sub, topic, nTests:EC_TESTS.length, first:EC_TESTS[EC_TESTS.length - 1].y, last:EC_TESTS[0].y, set:{min, ec}};
})();

const ecScope = () => EC.set[state.prefs.scope] ? state.prefs.scope : "all";
const ecScopeOf = k => EC_SCOPES.find(s => s.k === k);
const ecSub = (tid, k) => EC.sub[`${tid}/${k}`] || null;
const isOwnSub = (tid, k) => !SUB_LIST[tid] || !SUB_LIST[tid].some(x => x.k === k);
function subIn(tid, k, scope = ecScope()){
  if(scope === "all" || !EC.topic[tid] || isOwnSub(tid, k)) return true;
  return EC.set[scope].has(`${tid}/${k}`);
}
const topicIn = (id, scope = ecScope()) => scope === "all" || !EC.topic[id] || SUB_LIST[id].some(x => subIn(id, x.k, scope));
/* the subtopics that count in the current scope (all of them when none does, so a topic page still has a level) */
function scopeSubs(id){
  const all = subsOf(id);
  if(ecScope() === "all") return all;
  const l = all.filter(x => subIn(id, x.k));
  return l.length ? l : all;
}
/* expected points per test and hours of the topic's subtopics in a scope */
function ecTopicIn(id, scope = ecScope()){
  let pts = 0, h = 0;
  for(const x of SUB_LIST[id] || []){
    if(!subIn(id, x.k, scope)) continue;
    const o = ecSub(id, x.k);
    pts += o ? o.pts : 0; h += o ? o.h : EC_DEFAULT_H;
  }
  return {pts, h, pph: h ? pts / h : 0};
}
/* how much of an average test a scope covers, and how many hours it takes from zero */
function ecCover(scope){
  let pts = 0, h = 0, topics = 0, subs = 0;
  for(const x of T){
    if(x.t === "c" || isOff(x.id) || !topicIn(x.id, scope)) continue;
    topics++;
    const r = ecTopicIn(x.id, scope);
    pts += r.pts; h += r.h;
    subs += SUB_LIST[x.id].filter(s => subIn(x.id, s.k, scope)).length;
  }
  return {pts, h, topics, subs};
}
/* hours still to go in a scope: each subtopic's hours times what is left of it (by its level) */
function ecLeft(scope = ecScope()){
  let h = 0, pts = 0;
  for(const x of T){
    if(x.t === "c" || isOff(x.id) || !topicIn(x.id, scope)) continue;
    for(const s of SUB_LIST[x.id]){
      if(!subIn(x.id, s.k, scope)) continue;
      const o = ecSub(x.id, s.k), left = 1 - LV[subLv(x.id, s.k)].w;
      h += (o ? o.h : EC_DEFAULT_H) * left; pts += (o ? o.pts : 0) * left;
    }
  }
  return {h, pts};
}
/* subtopics in scope that are not done yet, the most points per hour first */
function ecPriorities(scope = ecScope()){
  const out = [];
  for(const key in EC.sub){
    const o = EC.sub[key];
    if(!BY_ID[o.tid] || isOff(o.tid) || !subIn(o.tid, o.k, scope)) continue;
    const v = subLv(o.tid, o.k);
    if(v >= 3) continue;
    out.push({...o, v, gain:o.pts * (1 - LV[v].w)});
  }
  return out.sort((a, b) => b.pph - a.pph || b.pts - a.pts);
}
const ecNum = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toString().replace(".", ",");
const ecPts = v => `${ecNum(v, v < 0.1 ? 2 : 1)} b.`;
const ecYearsTxt = n => `${n} ${plural(n, "test", "testy", "testov")}`;
function ecSubBadge(tid, k){
  const o = ecSub(tid, k);
  if(!EC.topic[tid]) return "";
  if(!o) return `<span class="ec-badge none" title="Na túto podtému sa externá časť v rokoch ${EC.first}–${EC.last} nepýtala.">v EČ nebola</span>`;
  const t = o.tasks.map(x => `${x.y}/${String(x.q).padStart(2, "0")} ${x.l}`).join("\n");
  return `<span class="ec-badge${o.recent ? "" : " old"}" title="Úlohy z externej časti (rok/úloha):\n${esc(t)}">EČ ${o.years.length}× · ${ecPts(o.pts)}/test · ${ecNum(o.pph, 2)} b./h</span>`;
}
function ecScopeSwitch(where){
  const cur = ecScope();
  return `<span class="ec-scope" role="radiogroup" aria-label="Rozsah učenia">${EC_SCOPES.map(s =>
    `<button class="ec-opt${s.k === cur ? " on" : ""}" role="radio" aria-checked="${s.k === cur}" data-act="ec-scope" data-k="${s.k}" data-w="${where}" title="${esc(s.desc)}">${s.label}</button>`).join("")}</span>`;
}
action("ec-scope", el => {
  const k = el.dataset.k;
  if(k === ecScope()) return;
  state.prefs.scope = k;
  save();
  render();
  const c = ecCover(k);
  toast(`Rozsah: ${ecScopeOf(k).label} · ${c.topics} ${skPieces(c.topics)}, ${ecNum(c.pts)} z 30 bodov testu.`);
});

/* ---------- the plan and the scope ---------- */
/* a plan item counts in the scope when its topic does (a test or an item without a topic always does) */
const planItemIn = x => { const t = planTopicOf(x); return !t || topicIn(t); };
const EC_BLOCK_H = EC_SESSION_H / 2;
/* does the plan still fit the scope? Blocks still to come for unfinished items in and out of scope, blocks
   of items in scope that did not fit into their week, and the topics in scope the plan lacks */
function ecPlanFit(){
  const t = todayIso(), r = {bIn:0, bOut:0, overIn:0, missing:[], missBlocks:0};
  if(PLAN_NONE) return null;
  for(const d in PLAN_BY_DAY){
    if(d < t) continue;
    for(const e of PLAN_BY_DAY[d]){
      if(isPlanTest(e.it) || planStatus(e.it) === 2) continue;
      if(planItemIn(e.it)) r.bIn += e.blocks; else r.bOut += e.blocks;
    }
  }
  for(const w of PLAN_WEEKS){
    if(w.to < t) continue;
    for(const o of PLAN_OVER[w.id] || []) if(planItemIn(o.it) && planStatus(o.it) !== 2) r.overIn += o.blocks;
  }
  const planned = new Set(PLAN_ITEMS.map(x => x.id));
  for(const x of T){
    if(x.t === "c" || isOff(x.id) || planned.has(x.id) || !topicIn(x.id) || lv(x.id) >= 3) continue;
    let h = 0;
    for(const s of SUB_LIST[x.id]) if(subIn(x.id, s.k)){ const o = ecSub(x.id, s.k); h += (o ? o.h : EC_DEFAULT_H) * (1 - LV[subLv(x.id, s.k)].w); }
    const b = Math.max(1, Math.round(h / EC_BLOCK_H));
    r.missing.push({id:x.id, b}); r.missBlocks += b;
  }
  r.need = r.overIn + r.missBlocks;
  return r;
}
/* the part of the AI text about the scope: what to keep, in which order, what to drop */
function ecAiText(){
  const sc = ecScope();
  if(sc === "all") return "";
  const cov = ecCover(sc), fit = ecPlanFit();
  const pr = ecPriorities(sc);
  const byTopic = {};
  for(const o of pr) (byTopic[o.tid] ||= []).push(o);
  const order = Object.keys(byTopic).map(id => ({id, ...ecTopicIn(id, sc)})).sort((a, b) => b.pph - a.pph);
  const out = T.filter(x => x.t !== "c" && !topicIn(x.id, sc)).map(x => x.id);
  const fmt = o => `${o.id} ${shortName(BY_ID[o.id])} (${ecNum(o.pts, 2)} b./test, ${ecNum(o.pph, 2)} b./h; podtémy: ${byTopic[o.id].map(s => SUB_LIST[o.id].findIndex(y => y.k === s.k) + 1).join(", ")})`;
  return `
ROZSAH UČENIA: ${ecScopeOf(sc).label.toUpperCase()}
- Učím sa len to, na čo sa pýta externá časť (podľa testov ${EC.first}–${EC.last}). ${ecScopeOf(sc).desc} Rozsah pokrýva ${ecNum(cov.pts)} z 30 bodov priemerného testu.
- Témy mimo rozsahu z plánu vyhoď (alebo ich daj až za posledný test ako nepovinné): ${out.join(", ") || "žiadne"}.
- Nehotové témy v rozsahu, od najväčšieho zisku bodov za hodinu (b./test = koľko bodov z 30 za ne priemerne býva, b./h = body za hodinu učenia; čísla podtém sú poradie v appke). Zoraď nové témy v pláne približne v tomto poradí, ak tomu nebránia nadväznosti (napríklad rovnice pred funkciami):
${order.map(o => "  - " + fmt(o)).join("\n")}
- Odhad času: 1 sedenie = 2 bloky po 45 min. ${fit ? `V pláne od dnes zostáva ${fit.bIn} blokov na témy v rozsahu a ${fit.bOut} blokov na témy mimo rozsahu${fit.overIn ? `, ${fit.overIn} blokov tém v rozsahu sa nezmestilo do svojich týždňov` : ""}${fit.missing.length ? `; v pláne chýbajú témy v rozsahu: ${fit.missing.map(m => `${m.id} (asi ${calNum(m.b / 2)} ${skSed(m.b / 2)})`).join(", ")}` : ""}.` : ""}
`;
}

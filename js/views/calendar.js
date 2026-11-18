/* ============================================================
   KALENDÁR — the study plan (js/planmodel.js; Info → Plán changes it) as a month / week calendar,
   and the study diary (notes per day and per topic) in the same place.
   Routes: #/kalendar[/m|t[/<iso>[/p]]]   m month, t week (the one containing <iso>);
                                          p = Poznámky (diary) instead of Témy (the plan)
           #/dennik… (old links) land on the diary week of that entry.
   A topic's state is its level in the app (no separate ticks); a review counts as done once
   the diary has a note about its topic from that week on; tests by the score typed into the day.
   Diary: state.log entries with k:"day" (note about a day) or k:"t" (note about one topic on a day,
   links[0].t); entries without k are old free entries and are shown on their day.
   ============================================================ */
const cal = {edit: null};    /* open note editor: "cn|day|<d>" · "cn|t|<d>|<topic>" · "cn|e|<entry id>" */

const addDays = (s, n) => { const d = dateOf(s); d.setDate(d.getDate() + n); return isoOf(d); };
const mondayOf = s => addDays(s, -((dateOf(s).getDay() + 6) % 7));
const calNum = x => (Math.round(x * 10) / 10).toString().replace(".", ",");
const skSed = n => { const r = Math.abs(n); return r === 1 ? "sedenie" : (r >= 2 && r <= 4 && Number.isInteger(r)) ? "sedenia" : "sedení"; };
const skBlocks = n => plural(n, "blok", "bloky", "blokov");
const WD_SHORT = ["Ne","Po","Ut","St","Št","Pi","So"];
const fmtD = s => { const d = dateOf(s); return `${d.getDate()}. ${d.getMonth()+1}.`; };
const fmtDW = s => `${WD_SHORT[dateOf(s).getDay()]} ${fmtD(s)}`;
const inPlan = s => s >= PLAN_START && s <= PLAN_EXAM;
const planTestOn = s => PLAN_TESTS.find(t => t.d === s);
const isPlanTest = x => PLAN_TESTS.some(t => t.id === x.id);
const toMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const mdBold = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const PLAN_DAY_LABEL = {prazdniny:"Prázdniny", volno:"Voľno", staze:"Stáž", test:"Test", precvic:"Bez testu", pred:"Pred maturitou"};
const calHash = (mode, d, notes) => `#/kalendar/${mode}/${d}${notes ? "/p" : ""}`;

/* the plan's tables (PLAN_SLOTS, PLAN_BY_DAY, PLAN_OVER …) come from compilePlan() in js/planmodel.js */
const planDaysOf = x => Object.keys(PLAN_BY_DAY).filter(d => PLAN_BY_DAY[d].some(p => p.it === x)).sort();

/* ---------- state of a plan item, from the app's own data ---------- */
/* 0 not started, 1 started, 2 done */
function planStatus(x){
  if(PLAN_REVIEW[x.id]){
    const w = PLAN_WEEKS.find(w => w.id === x.w);
    return state.log.some(e => e.d >= w.from && e.links.some(l => l.t === PLAN_REVIEW[x.id]) && (e.text.trim() || !e.k)) ? 2 : 0;
  }
  if(isPlanTest(x)) return planScore(x.id) != null ? 2 : 0;
  const v = lv(x.id);
  return v >= 3 ? 2 : v >= 1 ? 1 : 0;
}
const planScore = id => { const t = state.plan.tests[id]; return t && t.s != null ? t.s : null; };
const planTopicOf = x => PLAN_REVIEW[x.id] || (BY_ID[x.id] ? x.id : null);

function planPace(){
  const t = todayIso();
  let ex = 0;
  for(const d in PLAN_BY_DAY) if(d < t) for(const p of PLAN_BY_DAY[d]) ex += p.amt;
  const done = PLAN_ITEMS.reduce((a, x) => { const s = planStatus(x); return a + (s === 2 ? x.s : s === 1 ? x.s / 2 : 0); }, 0);
  return {ex, done, delta: done - ex};
}

function eventsOn(d){ return PLAN_EVENTS.filter(e => e.d === d || (e.to && d > e.d && d <= e.to)); }
function phase2On(d){ return PLAN_PHASE2.find(p => p.d === d || (p.to && d > p.d && d <= p.to)); }

/* ---------- small pieces ---------- */
const itemKind = x => PLAN_REVIEW[x.id] ? "rev" : isPlanTest(x) ? "test" : "top";
function itemLevel(x){ const t = planTopicOf(x); return t && itemKind(x) === "top" ? lv(t) : planStatus(x) === 2 ? 4 : 0; }
function itemName(x, full){ const t = planTopicOf(x); return !full && t && itemKind(x) === "top" ? shortName(BY_ID[t]) : x.n; }
/* an item as a chip in a month cell */
function itemChip(p){
  const x = p.it, s = planStatus(x), tid = planTopicOf(x), v = itemLevel(x);
  const title = `${x.n} · ${p.blocks} ${skBlocks(p.blocks)}${p.first ? "" : " (pokračovanie)"}${itemKind(x) === "top" ? ` · ${LV[v].label}` : ""}`;
  const inner = `<i class="dot l${v}"></i><span class="ci-n">${!p.first ? "↳ " : ""}${esc(itemName(x))}</span>`;
  const cls = `ci ck-${itemKind(x)} s${s}${p.first ? "" : " cont"}`;
  return tid ? `<a class="${cls}" href="#/tema/${tid}" title="${esc(title)}">${inner}</a>` : `<span class="${cls}" title="${esc(title)}">${inner}</span>`;
}
function scoreInput(test){
  const v = planScore(test.id);
  return `<span class="sc-in"><input type="number" min="0" max="30" inputmode="numeric" data-in="cal-score" data-id="${test.id}" value="${v == null ? "" : v}" aria-label="Body za ${esc(test.n)}"> / 30</span>`;
}

/* ============================================================
   TÉMY — month
   ============================================================ */
function monthGrid(anchor, cell){
  const d0 = dateOf(anchor), mon = d0.getMonth();
  let d = mondayOf(isoOf(new Date(d0.getFullYear(), mon, 1)));
  const t = todayIso();
  let cells = "";
  do {
    for(let k = 0; k < 7; k++, d = addDays(d, 1)) cells += cell(d, {out: dateOf(d).getMonth() !== mon, today: d === t, week: k === 0});
  } while(dateOf(d).getMonth() === mon);
  return `<div class="cal-month">${["Po","Ut","St","Št","Pi","So","Ne"].map(x => `<div class="cal-wd">${x}</div>`).join("")}${cells}</div>`;
}
function cellHead(d){
  const dd = dateOf(d);
  return `<div class="cal-dn">${dd.getDate()}${dd.getDate() === 1 ? `<small>${MONTHS[dd.getMonth()].slice(0, 3)}</small>` : ""}</div>`;
}
function planCell(d, o){
  const cls = ["cal-cell", o.out ? "out" : "", o.today ? "today" : "", inPlan(d) ? "p-" + planDayType(d) : "off"].join(" ");
  let body = "";
  if(inPlan(d)){
    const type = planDayType(d);
    if(PLAN_DAY_LABEL[type]) body += `<span class="cal-tag t-${type}">${PLAN_DAY_LABEL[type]}</span>`;
    body += eventsOn(d).filter(e => e.d === d || o.week).map(e => `<div class="cal-ev ${e.k || ""}" title="${esc(e.n + (e.note ? ": " + e.note : ""))}">${esc(e.n)}</div>`).join("");
    const test = planTestOn(d), ph = phase2On(d);
    if(test){
      const sc = planScore(test.id);
      body += `<span class="ci ck-test s${sc != null ? 2 : 0}" title="${esc(ph ? ph.w : test.n)}"><i class="dot ${sc != null ? "l4" : "l0"}"></i><span class="ci-n">${esc(test.n)}${sc != null ? ` · ${sc}/30` : ""}</span></span>`;
    } else if(ph) body += `<div class="cal-ph" title="${esc(ph.w)}">${esc(ph.w)}</div>`;
    body += (PLAN_BY_DAY[d] || []).filter(p => !isPlanTest(p.it)).map(itemChip).join("");
  }
  return `<div class="${cls}" data-act="cal-open" data-d="${d}" role="button" tabindex="0" aria-label="${esc(WEEKDAYS[dateOf(d).getDay()] + " " + fmtD(d))}">${cellHead(d)}${body}</div>`;
}

/* ============================================================
   TÉMY — week, hour by hour
   ============================================================ */
const H0 = 7, H1 = 23, PX = 52;    /* the grid shows 7:00–23:00, PX pixels an hour */

function weekHead(m, notes){
  const days = [0,1,2,3,4,5,6].map(k => addDays(m, k));
  const ws = PLAN_WEEKS.filter(w => days.some(d => d >= w.from && d <= w.to));
  let out = "";
  for(const w of ws){
    const items = PLAN_ITEMS.filter(x => x.w === w.id);
    const P = items.reduce((a, x) => a + x.s, 0);
    const sum = w.phase ? `Fáza testov` : `<b>${items.filter(x => planStatus(x) === 2).length}/${items.length}</b> hotových · plán ${calNum(P)} z kapacity ${calNum(w.cap)} sedení`;
    const over = PLAN_OVER[w.id] ? `<li class="warn">Nezmestí sa do blokov ani rezervy: ${PLAN_OVER[w.id].map(o => `${esc(itemName(o.it))} (${o.blocks} ${skBlocks(o.blocks)})`).join(", ")}. Dobehni to v rezerve ďalšieho týždňa.</li>` : "";
    out += `<div class="cal-weekhead"><span>${ws.length > 1 ? `${fmtD(w.from)} – ${fmtD(w.to)}: ` : ""}${sum}</span>
      ${!notes && (w.notes && w.notes.length || over) ? `<ul class="wnotes">${(w.notes || []).map(n => `<li>${esc(n)}</li>`).join("")}${over}</ul>` : ""}</div>`;
  }
  return out;
}

function slotLabel(s, d){
  const phaseWeek = PLAN_ITEMS.some(x => x.w === (PLAN_WEEKS.find(w => d >= w.from && d <= w.to) || {}).id);
  if(s.k === "math" && !s.it && phaseWeek && planDayType(d) !== "test") return "Rezerva: ďalšia téma v poradí";
  return s.l;
}
/* consecutive blocks of the same item become one row (breaks between them are left out) */
function groupSlots(slots){
  const out = [];
  for(const s of slots){
    if(s.k === "break") continue;
    const p = out[out.length - 1];
    if(p && s.it && p.it === s.it && p.k === s.k) Object.assign(p, {t:s.t, n2:s.n});
    else out.push({...s, n2:s.n});
  }
  return out;
}
function slotBody(s, d, compact){
  if(s.it && itemKind(s.it) !== "test"){
    const x = s.it, v = itemLevel(x), tid = planTopicOf(x);
    const which = compact ? `${s.n}/${s.of}` : s.n2 > s.n ? `bloky ${s.n}–${s.n2} z ${s.of}` : `blok ${s.n} z ${s.of}`;
    return `<a class="sl-it s${planStatus(x)}" href="#/tema/${tid}" title="${esc(x.n)} · ${LV[v].label} · blok ${s.n} z ${s.of}">
      <i class="dot l${v}"></i><span class="sl-n">${esc(compact ? itemName(x) : x.n)}</span>
      <span class="sl-meta">${itemKind(x) === "rev" ? "opakovanie · " : ""}${which}${s.k === "flex" ? " · v rezerve" : ""}</span></a>`;
  }
  const test = s.k === "test" && planTestOn(d);
  if(test) return `<span class="sl-n">${esc(test.n)} · NÚCEM ${test.y}</span>${scoreInput(test)}`;
  return `<span class="sl-n">${esc(slotLabel(s, d))}</span>`;
}

function dayHeader(d){
  const type = planDayType(d), dd = dateOf(d);
  const ev = eventsOn(d), ph = phase2On(d);
  return `<div class="wk-dh${d === todayIso() ? " today" : ""}">
    <b>${WD_SHORT[dd.getDay()]} ${fmtD(d)}</b><span>${esc(PLAN_DAY_LABEL[type] ? PLAN_DAYS[type].n : WEEKDAYS[dd.getDay()].replace(/^./, c => c.toUpperCase()))}</span>
    ${ev.map(e => `<div class="cal-ev ${e.k || ""}" title="${esc(e.n + (e.note ? ": " + e.note : ""))}">${esc(e.n)}</div>`).join("")}
    ${ph && !planTestOn(d) ? `<div class="cal-ph" title="${esc(ph.w)}">${esc(ph.w)}</div>` : ""}
  </div>`;
}

function weekGrid(anchor){
  const m = mondayOf(anchor), t = todayIso();
  const days = [0,1,2,3,4,5,6].map(k => addDays(m, k));
  const hours = [];
  for(let h = H0; h <= H1; h += 1) hours.push(`<span style="top:${(h - H0) * PX}px">${h}:00</span>`);
  const H = (H1 - H0) * PX;
  let heads = `<div class="wk-corner"></div>`, cols = `<div class="wk-hours" style="height:${H}px">${hours.join("")}</div>`, agenda = "";
  for(const d of days){
    if(!inPlan(d)){
      heads += `<div class="wk-dh off"><b>${fmtDW(d)}</b><span>${d < PLAN_START ? "pred plánom" : "po maturite"}</span></div>`;
      cols += `<div class="wk-col off" style="height:${H}px"></div>`;
      continue;
    }
    heads += dayHeader(d);
    let sl = "";
    for(const s of PLAN_SLOTS[d]){
      if(s.k === "break") continue;
      const top = (toMin(s.f) - H0 * 60) * PX / 60, h = (toMin(s.t) - toMin(s.f)) * PX / 60;
      sl += `<div class="sl k-${s.k}${s.it ? " has" : ""}${h < 34 ? " thin" : ""}" style="top:${top}px;height:${h - 2}px" title="${s.f}–${s.t} ${esc(s.it ? s.it.n : slotLabel(s, d))}">
        <span class="sl-t">${s.f}</span>${slotBody(s, d, true)}</div>`;
    }
    if(d === t){
      const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
      if(mins > H0 * 60 && mins < H1 * 60) sl += `<i class="wk-now" style="top:${(mins - H0 * 60) * PX / 60}px"></i>`;
    }
    cols += `<div class="wk-col${d === t ? " today" : ""}" style="height:${H}px">${sl}</div>`;
    agenda += `<section class="ag-day${d === t ? " today" : ""}">${dayHeader(d)}<ul>${groupSlots(PLAN_SLOTS[d]).map(s =>
      `<li class="ag k-${s.k}${s.it ? " has" : ""}"><span class="ag-t">${s.f}–${s.t}</span><i class="sw k-${s.k}"></i><div>${slotBody(s, d, false)}</div></li>`).join("")}</ul></section>`;
  }
  return `${weekHead(m)}
    <div class="wk"><div class="wk-grid">${heads}${cols}</div></div>
    <div class="wk-agenda">${agenda}</div>`;
}

/* ============================================================
   POZNÁMKY — the diary
   ============================================================ */
const newestFirst = (a, b) => b.u - a.u;
const dayNotes = d => state.log.filter(e => e.d === d);
const dayNote = d => dayNotes(d).filter(e => e.k === "day").sort(newestFirst)[0];
const topicNote = (d, t) => dayNotes(d).filter(e => e.k === "t" && e.links[0] && e.links[0].t === t).sort(newestFirst)[0];

/* write the day's / a topic's note for a day; an emptied note disappears */
function setNote(kind, d, t, text){
  let e = kind === "day" ? dayNote(d) : topicNote(d, t);
  if(!text.trim()){ if(e && kind === "day") removeLog(e.id); else if(e) updateLog(e.id, {text:""}); return e; }
  if(e) return updateLog(e.id, {text});
  e = addLog(d, text, t ? [{t}] : []);
  e.k = kind;
  return e;
}
/* topic notes left empty when their editor closes are dropped */
function dropEmpty(){
  for(const e of [...state.log]) if(e.k === "t" && !e.text.trim()) removeLog(e.id);
}

/* topics of a day: planned for it, rated or noted that day, or with a diary note */
function dayTopics(d){
  const out = [];
  const add = (t, why) => {
    if(!BY_ID[t]) return;
    let r = out.find(x => x.t === t);
    if(!r) out.push(r = {t, why:new Set(), notes:[]});
    r.why.add(why);
    return r;
  };
  for(const p of PLAN_BY_DAY[d] || []){ const t = planTopicOf(p.it); if(t) add(t, PLAN_REVIEW[p.it.id] ? "rev" : "plan"); }
  for(const key in state.slvAt) if(isoOf(state.slvAt[key]) === d) add(key.split("/")[0], "lv");
  for(const t in state.notes) for(const n of state.notes[t]) if(isoOf(n.c) === d || isoOf(n.u) === d) add(t, "note").notes.push(n);
  for(const e of dayNotes(d)) if(e.k === "t" && e.links[0]) add(e.links[0].t, "log");
  return out;
}

/* how much happened on each day (diary, new notes, rated topics) */
function activityMap(){
  const map = {};
  const add = (d, n = 1) => { map[d] = (map[d] || 0) + n; };
  state.log.forEach(e => { if(e.text.trim() || !e.k) add(e.d); });
  for(const id in state.notes) state.notes[id].forEach(n => add(isoOf(n.c)));
  const rated = {};
  for(const key in state.slvAt) (rated[isoOf(state.slvAt[key])] ||= new Set()).add(key.split("/")[0]);
  for(const d in rated) add(d, rated[d].size);
  return map;
}
const heat = n => !n ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4;

function noteField(key, text, placeholder){
  if(cal.edit === key){
    EDITORS[key] = {
      onChange: t => { writeNote(key, t); saveSoon(); },
      onDone: () => closeNote(),
      onEsc: () => closeNote()
    };
    return editorHtml(key, text, {rows:3, placeholder, foot:"Ukladá sa samo · Esc alebo Ctrl+Enter zavrie"});
  }
  return text.trim()
    ? `<div class="cn-text md" data-act="cn-edit" data-k="${esc(key)}" title="Klikni a uprav">${md(text)}</div>`
    : `<button class="cn-add" data-act="cn-edit" data-k="${esc(key)}">${esc(placeholder)}</button>`;
}
function writeNote(key, text){
  const [, kind, a, b] = key.split("|");
  if(kind === "e"){ updateLog(a, {text}); return; }
  setNote(kind, a, b, text);
}
function closeNote(){
  cal.edit = null;
  dropEmpty();
  save();
  rerenderCal();
}

function notesStats(map){
  const today = todayIso();
  let streak = 0, cur = map[today] ? today : addDays(today, -1);
  while(map[cur]){ streak++; cur = addDays(cur, -1); }
  let active30 = 0;
  for(let i = 0; i < 30; i++) if(map[addDays(today, -i)]) active30++;
  const n = state.log.filter(e => e.text.trim()).length;
  return `<div class="hm-stats">
    <div><b>${streak}</b><span>${plural(streak, "deň", "dni", "dní")} v rade</span></div>
    <div><b>${active30}</b><span>z posledných 30 dní</span></div>
    <div><b>${n}</b><span>${plural(n, "poznámka", "poznámky", "poznámok")} v denníku</span></div>
  </div>`;
}

function notesCell(map){
  return (d, o) => {
    const t = todayIso(), n = map[d] || 0;
    const cls = ["cal-cell", "nt", o.out ? "out" : "", o.today ? "today" : "", d > t ? "future" : ""].join(" ");
    let body = "";
    if(d <= t){
      const dn = dayNote(d), tops = dayTopics(d).filter(r => !(r.why.size === 1 && (r.why.has("plan") || r.why.has("rev"))));
      if(dn) body += `<div class="nt-day">${esc(plainText(dn.text, 70))}</div>`;
      if(tops.length) body += `<div class="nt-dots">${tops.map(r => `<i class="dot l${lv(r.t)}" title="${esc(BY_ID[r.t].n)}"></i>`).join("")}</div>`;
      const cnt = dayNotes(d).filter(e => e.text.trim()).length;
      if(cnt) body += `<span class="nt-cnt">✎ ${cnt}</span>`;
    }
    return `<div class="${cls}" data-act="cal-open" data-d="${d}" role="button" tabindex="0" title="${fmtIso(d)} · ${n ? n + " " + plural(n, "aktivita", "aktivity", "aktivít") : "nič"}">${cellHead(d)}${body}</div>`;
  };
}

function notesWeek(anchor, map){
  const m = mondayOf(anchor), t = todayIso();
  let html = "";
  for(let k = 0; k < 7; k++){
    const d = addDays(m, k), dd = dateOf(d);
    const head = `<header class="cn-head"><b>${WEEKDAYS[dd.getDay()].replace(/^./, c => c.toUpperCase())} ${fmtD(d)}</b>
      ${d === t ? `<em>dnes</em>` : ""}${eventsOn(d).map(e => `<span class="cal-ev ${e.k || ""}">${esc(e.n)}</span>`).join("")}</header>`;
    if(d > t){
      const plan = (PLAN_BY_DAY[d] || []).filter(p => planTopicOf(p.it));
      html += `<section class="card cn-day future">${head}${plan.length ? `<p class="muted cn-plan">Podľa plánu: ${plan.map(p => `<a href="#/tema/${planTopicOf(p.it)}">${esc(itemName(p.it))}</a>`).join(", ")}</p>` : `<p class="muted cn-plan">Ešte nenastal.</p>`}</section>`;
      continue;
    }
    const dn = dayNote(d), tops = dayTopics(d);
    const legacy = dayNotes(d).filter(e => !e.k || (e.k === "day" && e !== dn) || (e.k === "t" && e !== topicNote(d, e.links[0] && e.links[0].t)));
    const rows = tops.map(r => {
      const tn = topicNote(d, r.t), v = lv(r.t);
      const tags = [];
      if(r.why.has("plan")) tags.push("podľa plánu");
      if(r.why.has("rev")) tags.push("opakovanie podľa plánu");
      if(r.why.has("lv")) tags.push(`ohodnotené: ${LV[v].label}`);
      const notes = r.notes.map(n => `<a class="cn-tnote" href="#/tema/${r.t}/n/${n.id}">✎ ${esc(noteTitle(n))}</a>`).join("");
      return `<div class="cn-topic" ${tn ? `id="cn-${tn.id}"` : ""}>
        <div class="cn-th"><a href="#/tema/${r.t}"><i class="dot l${v}"></i>${esc(BY_ID[r.t].n)}</a>${tags.map(x => `<span class="cn-tag">${x}</span>`).join("")}</div>
        ${notes ? `<div class="cn-tnotes">${notes}</div>` : ""}
        ${noteField(`cn|t|${d}|${r.t}`, tn ? tn.text : "", "+ poznámka k téme v tento deň")}
      </div>`;
    }).join("");
    const old = legacy.map(e => `<div class="cn-old" id="cn-${e.id}">
      ${noteField(`cn|e|${e.id}`, e.text, "+ text záznamu")}
      ${e.links.length ? `<div class="chips">${e.links.map(l => linkChip(l)).join("")}</div>` : ""}
      <button class="cn-del" data-act="cn-del" data-id="${e.id}" title="Zmazať záznam">×</button></div>`).join("");
    html += `<section class="card cn-day${d === t ? " today" : ""}" ${dn ? `id="cn-${dn.id}"` : ""}>${head}
      <div class="cn-dnote"><span class="cn-label">Deň</span>${noteField(`cn|day|${d}`, dn ? dn.text : "", "+ poznámka k celému dňu")}</div>
      ${rows ? `<div class="cn-topics">${rows}</div>` : `<p class="muted cn-plan">V tento deň nie je nič v pláne ani ohodnotené.</p>`}
      ${old ? `<div class="cn-olds"><span class="cn-label">Záznamy</span>${old}</div>` : ""}
      <button class="chip add" data-act="cn-topic" data-d="${d}">+ Pridať tému</button>
    </section>`;
  }
  return html;
}

/* ============================================================
   VIEW
   ============================================================ */
function calAnchor(r){
  const t = todayIso();
  return r.d || (r.notes || PLAN_NONE || inPlan(t) ? t : t < PLAN_START ? PLAN_START : PLAN_EXAM);
}
function calTitle(r, a){
  if(r.mode === "t"){ const m = mondayOf(a), s = addDays(m, 6); return `${fmtD(m)} – ${fmtD(s)} ${dateOf(s).getFullYear()}`; }
  return monthOf(a).replace(/^./, c => c.toUpperCase());
}

VIEWS.kalendar = {
  title: r => r.notes ? "Poznámky" : "Kalendár",
  render(host){
    const r = ui.route, a = calAnchor(r);
    const map = r.notes ? activityMap() : null;
    const main = r.notes
      ? (r.mode === "t" ? notesWeek(a, map) : monthGrid(a, notesCell(map)) + `<div class="cal-legend"><span>bodky: témy, ktoré si v ten deň bral, farba je ich úroveň</span><span>✎ počet poznámok</span></div>`)
      : PLAN_NONE ? planNoneHtml()
      : (r.mode === "t" ? weekGrid(a) : monthGrid(a, planCell) + `<div class="cal-legend"><span><i class="dot l0"></i>nepozreté</span><span><i class="dot l1"></i>neviem</span><span><i class="dot l2"></i>slabo</span><span><i class="dot l3"></i>ide to</span><span><i class="dot l4"></i>perfektne</span><span>↳ pokračovanie témy</span></div>`);
    host.innerHTML = `<div class="page cal${r.notes ? " notes" : ""}">
      <header class="page-head"><h1>Kalendár</h1>
        <p class="sub">${r.notes
          ? "Denník po dňoch: poznámka k celému dňu a ku každej téme, ktorú si v ten deň bral. Témy sa pridajú samé, keď ich ohodnotíš alebo k nim napíšeš poznámku. Všetko sa ukladá počas písania."
          : PLAN_NONE ? `Zatiaľ bez plánu. Vytvoríš si ho s AI v <a href="#/info" data-act="plan-goto">Info → Plán v kalendári</a>, poznámky k dňom môžeš písať aj bez neho.`
          : `${planSpan()} Stav témy je jej úroveň v appke, klik na tému ju otvorí. <a href="#/info" data-act="plan-goto">Zmeniť plán</a>`}</p></header>
      <div class="cal-bar">
        <div class="cal-navb">
          <button class="btn ghost small" data-act="cal-nav" data-dir="-1" aria-label="Predošlý">‹</button>
          <button class="btn ghost small" data-act="cal-today">Dnes</button>
          <button class="btn ghost small" data-act="cal-nav" data-dir="1" aria-label="Ďalší">›</button>
          <h2>${calTitle(r, a)}</h2>
        </div>
        <div class="cal-segs">
          <div class="seg cal-mode" role="group" aria-label="Čo zobraziť">
            <button data-act="cal-pane" data-p="" aria-pressed="${!r.notes}">Témy</button>
            <button data-act="cal-pane" data-p="p" aria-pressed="${!!r.notes}">Poznámky</button>
          </div>
          <div class="seg cal-mode" role="group" aria-label="Zobrazenie">
            <button data-act="cal-mode" data-m="m" aria-pressed="${r.mode !== "t"}">Mesiac</button>
            <button data-act="cal-mode" data-m="t" aria-pressed="${r.mode === "t"}">Týždeň</button>
          </div>
        </div>
      </div>
      ${r.notes ? notesStats(map) : ""}
      <div class="cal-main">${main}</div>
    </div>`;
    mountEditors(host);
    if(cal.edit){ const ta = $(`.editor[data-key="${CSS.escape(cal.edit)}"] .ed-in`, host); if(ta){ ta.focus({preventScroll:true}); ta.setSelectionRange(ta.value.length, ta.value.length); } }
    if(r.entry){ const el = $(`#cn-${CSS.escape(r.entry)}`); if(el){ el.scrollIntoView({block:"center"}); flashEl(el); } r.entry = null; }
    else if(r.mode === "t" && !r.notes && !r.scrolled){ const g = $(".wk", host); if(g) g.scrollTop = 0; }
  },
  refresh(what){ if(what === "remote" && cal.edit) return; rerenderCal(); },
  key(e){
    if(e.key === "ArrowLeft" || e.key === "ArrowRight"){ e.preventDefault(); calNav(e.key === "ArrowLeft" ? -1 : 1); }
    else if(e.key === "t" || e.key === "m") go(calHash(e.key, calAnchor(ui.route), ui.route.notes));
    else if(e.key === "p") go(calHash(ui.route.mode, calAnchor(ui.route), !ui.route.notes));
  }
};
function rerenderCal(){
  if(ui.route.view !== "kalendar") return;
  const y = window.scrollY;
  VIEWS.kalendar.render($("#view"));
  window.scrollTo(0, y);
}

function calNav(dir){
  const r = ui.route, a = calAnchor(r);
  let n;
  if(r.mode === "t") n = addDays(a, 7 * dir);
  else { const d = dateOf(a); n = isoOf(new Date(d.getFullYear(), d.getMonth() + dir, 1)); }
  go(calHash(r.mode, n, r.notes));
}
action("cal-nav", el => calNav(+el.dataset.dir));
/* no plan yet (the public app starts like this) */
function planNoneHtml(){
  return `<section class="card plan-none"><h2>Zatiaľ nemáš študijný plán</h2>
    <p>Plán si vytvoríš s AI (Claude, ChatGPT…). V Info klikni na <b>Vytvoriť plán s AI</b> a skopírovaný text vlož do chatu. AI sa ťa opýta, kedy maturuješ, ako vyzerá tvoj týždeň a koľko času máš na matiku. Potom ti pošle plán. Celú jej odpoveď vlož v Info cez <b>Vložiť plán</b>.</p>
    <p>Appka potom rozloží témy do blokov v dňoch a ukáže ich tu, na prehľade uvidíš tempo a míľniky. Poznámky k dňom môžeš písať aj bez plánu.</p>
    <a class="btn" href="#/info" data-act="plan-goto">Vytvoriť plán</a></section>`;
}
/* "témy od … do …, potom testy" for the subtitle */
function planSpan(){
  const last = [...PLAN_WEEKS].reverse().find(w => PLAN_ITEMS.some(x => x.w === w.id && !isPlanTest(x)));
  const firstTest = PLAN_TESTS.filter(t => !PLAN_ITEMS.some(x => x.id === t.id)).map(t => t.d).sort()[0];
  return `Plán do maturity (${fmtD(PLAN_EXAM)}): témy od ${fmtD(PLAN_START)}${last ? ` do ${fmtD(last.to)}` : ""}${firstTest ? `, od ${fmtD(firstTest)} testy z minulých rokov` : ""}.`;
}
action("plan-goto", () => { ui.showPlan = true; });
action("cal-today", () => go(calHash(ui.route.mode, todayIso(), ui.route.notes)));
action("cal-mode", el => go(calHash(el.dataset.m, calAnchor(ui.route), ui.route.notes)));
action("cal-pane", el => go(calHash(ui.route.mode, calAnchor(ui.route), !!el.dataset.p)));
action("cal-open", (el, e) => {
  if(e.target.closest("a, input")) return;
  go(calHash("t", el.dataset.d, ui.route.notes));
});
document.addEventListener("keydown", e => {
  if((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(".cal-cell")){ e.preventDefault(); e.target.click(); }
});
action("cn-edit", (el, e) => {
  if(e.target.closest("a, input[type=checkbox]")) return;
  if(cal.edit) dropEmpty();
  cal.edit = el.dataset.k;
  save();
  rerenderCal();
});
action("cn-del", el => {
  const e = removeLog(el.dataset.id);
  if(!e) return;
  save(); rerenderCal();
  toast("Záznam zmazaný.", () => { restoreLog(e); save(); rerenderCal(); });
});
action("cn-topic", el => {
  const d = el.dataset.d;
  openPalette({pick:true, title:"Pridať tému k dňu", onPick: link => {
    if(!topicNote(d, link.t)){ const e = addLog(d, "", [{t:link.t}]); e.k = "t"; }
    cal.edit = `cn|t|${d}|${link.t}`;
    rerenderCal();
  }});
});
onInput("cal-score", el => {
  const v = el.value.trim();
  state.plan.tests[el.dataset.id] = {s: v === "" ? null : Math.max(0, Math.min(30, Math.round(+v))), at:Date.now()};
  saveSoon();
});

/* ============================================================
   PLAN CARDS on the overview — today by the plan, next topics in the plan's
   order, pace, milestones, the plan's rules. The plan's tables come from js/planmodel.js,
   its status helpers from js/views/calendar.js (loaded later; these run only when the overview renders).
   ============================================================ */

/* today's maths blocks with their topics; before the plan starts, its first day */
function renderPlanToday(){
  const host = $("#planToday");
  if(!host) return;
  const t = todayIso();
  let d = t;
  if(PLAN_NONE) d = null;
  else if(!inPlan(d) || !PLAN_SLOTS[d].some(s => s.it || s.k === "math" || s.k === "test")){
    d = Object.keys(PLAN_SLOTS).sort().find(x => x > t && PLAN_SLOTS[x].some(s => s.it || s.k === "math" || s.k === "test")) || null;
  }
  let html = "";
  if(PLAN_NONE) html = `<h2>Študijný plán</h2><p>Zatiaľ nemáš plán. Vytvor si ho s AI v <a href="#/info" data-act="plan-goto">Info → Plán v kalendári</a>: appka z neho spraví kalendár s témami po dňoch a ukáže ti, či ideš podľa plánu.</p>`;
  else if(!d) html = `<h2>Dnes podľa plánu</h2><p class="muted">Plán skončil.</p>`;
  else {
    const slots = groupSlots(PLAN_SLOTS[d]).filter(s => s.it || ["math", "rev", "test", "dses"].includes(s.k));
    const ev = eventsOn(d), ph = phase2On(d);
    html = `<h2>${d === t ? "Dnes podľa plánu" : `Najbližšie podľa plánu · ${WEEKDAYS[dateOf(d).getDay()]} ${fmtD(d)}`}</h2>
      ${ev.map(e => `<div class="cal-ev ${e.k || ""}"><b>${esc(e.n)}</b>${e.note ? ` ${esc(e.note)}` : ""}</div>`).join("")}
      ${ph ? `<div class="cal-ph full">${esc(ph.w)}</div>` : ""}
      <ul class="pt-slots">${slots.map(s => `<li class="k-${s.k}-row"><span class="ag-t">${s.f}–${s.t}</span><i class="sw k-${s.k}"></i><div>${slotBody(s, d, false)}</div></li>`).join("")}</ul>`;
  }
  /* the last day you studied (the old "Pokračuj, kde si skončil") */
  const map = activityMap();
  const last = Object.keys(map).filter(x => x < t).sort().pop();
  if(last){
    const tops = dayTopics(last).filter(r => !(r.why.size === 1 && (r.why.has("plan") || r.why.has("rev"))));
    const dn = dayNote(last);
    html += `<a class="pt-last" href="${calHash("t", last, true)}"><span class="rl-when">Naposledy · ${fmtAgo(last)}</span>
      ${dn ? `<span class="rl-text">${inline(plainText(dn.text, 140))}</span>` : ""}
      ${tops.length ? `<span class="pt-tops">${tops.map(r => `<i class="dot l${lv(r.t)}"></i>${esc(shortName(BY_ID[r.t]))}${testsOf(r.t).filter(x => x.d === last && x.s != null).map(x => ` <span class="tt-badge ${testCls(x)}">test ${scoreTxt(x)}</span>`).join("")}`).join(" · ")}</span>` : ""}</a>`;
  }
  html += `<div class="resume-acts">
    ${PLAN_NONE ? `<a class="btn" href="#/info" data-act="plan-goto">Vytvoriť plán</a>` : ""}
    <a class="btn${PLAN_NONE ? " ghost" : ""}" href="${calHash("t", t, true)}">✎ Poznámky k dnešku</a>
    ${PLAN_NONE ? "" : `<a class="btn ghost" href="${calHash("t", d || t, false)}">Týždeň v kalendári</a>`}</div>`;
  host.innerHTML = html;
}

/* the next unfinished items in the plan's order */
function renderPlanNext(){
  const host = $("#next");
  if(!host) return;
  host.style.display = PLAN_NONE ? "none" : "";
  if(PLAN_NONE) return;
  const t = todayIso();
  const left = PLAN_ITEMS.filter(x => !isPlanTest(x) && planStatus(x) !== 2);
  if(!left.length){ host.innerHTML = `<h2>Ďalej na rade podľa plánu</h2><p class="done">Všetky témy z plánu sú hotové. Teraz testy na čas.</p>`; return; }
  const list = left.slice(0, 5).map(x => {
    const days = planDaysOf(x), tid = planTopicOf(x), v = itemLevel(x);
    const from = days[0], to = days[days.length - 1], end = planEndOf(x);
    const late = end < t;
    const when = late ? `<b class="late">mešká</b>${from ? ` · podľa plánu ${from === to ? fmtDW(to) : `${fmtDW(from)} – ${fmtDW(to)}`}` : ` · malo byť do ${fmtDW(end)}`}`
      : !from ? `nezmestilo sa do blokov · dobehni do ${fmtDW(end)}` : from <= t ? `podľa plánu ${from === end ? "dnes" : `do ${fmtDW(end)}`}` : `podľa plánu ${fmtDW(from)}`;
    const what = itemKind(x) === "rev" ? "opakovanie · zapíš ho do poznámok k téme alebo si daj test" : LV[v].label;
    return {tid, li: `<li><a class="next-link" href="#/tema/${tid}" data-act="seq-next"><i class="dot l${v}"></i>${esc(x.n)}</a><em>${what} · ${calNum(x.s)} ${skSed(x.s)}${when ? " · " + when : ""}</em></li>`};
  });
  host.dataset.ids = list.map(x => x.tid).join(" ");
  host.innerHTML = `<h2>Ďalej na rade podľa plánu</h2><ol>${list.map(x => x.li).join("")}</ol>`;
}
/* ‹ › in the topic view then walks through these */
action("seq-next", () => { ui.seq = $("#next").dataset.ids.split(" "); ui.seqLabel = "z plánu"; });

function renderPlanPace(){
  const host = $("#planPace");
  if(!host) return;
  host.style.display = PLAN_NONE ? "none" : "";
  if(PLAN_NONE) return;
  const t = todayIso(), pc = planPace();
  let pace;
  /* what the plan already wanted finished and is not: topics and reviews to finish first, tests to score */
  const late = pc.open.filter(x => !isPlanTest(x)), tests = pc.open.filter(isPlanTest), behind = pc.delta <= -0.5;
  const link = x => { const tid = planTopicOf(x); return tid ? `<a href="#/tema/${tid}"><i class="dot l${itemLevel(x)}"></i>${esc(itemName(x))}</a>` : esc(itemName(x)); };
  const todo = [
    late.length ? `Najprv dotiahni, čo už malo byť hotové: ${late.slice(0, 3).map(link).join(", ")}${late.length > 3 ? ` a ešte ${late.length - 3}` : ""}.${behind ? " Využi na to rezervné bloky." : ""}` : "",
    tests.length ? `Zapíš do kalendára body za ${tests.length > 1 ? "testy" : "test"}: ${tests.map(x => `<a href="${calHash("t", planEndOf(x), false)}">${esc(x.n)}</a>`).join(", ")}.` : ""
  ].filter(Boolean).join(" ");
  if(t < PLAN_START) pace = `Plán začína ${WEEKDAYS[dateOf(PLAN_START).getDay()]} ${fmtD(PLAN_START)}`;
  else if(!behind && pc.delta < 0.5) pace = `Ideš <b>presne podľa plánu</b>${pc.ex ? `: ${calNum(pc.done)} z ${calNum(pc.ex)} sedení` : ""}.${todo ? " " + todo : ""}`;
  else if(!behind) pace = `<span class="ahead">Náskok ${calNum(pc.delta)} ${skSed(pc.delta)}.</span> Podľa plánu ${calNum(pc.ex)}, máš ${calNum(pc.done)}. ${todo || "Ber ďalšiu tému v poradí."}`;
  else pace = `<span class="behind">Sklz ${calNum(-pc.delta)} ${skSed(pc.delta)}.</span> Podľa plánu ${calNum(pc.ex)}, máš ${calNum(pc.done)}. ${todo || "Doťahuj v rezervných blokoch."}`;
  const scored = PLAN_TESTS.filter(x => planScore(x.id) != null);
  const avg = scored.length ? scored.reduce((a, x) => a + planScore(x.id), 0) / scored.length : null;
  host.innerHTML = `<h2>Tempo podľa plánu</h2><p>${pace}</p>
    <div class="bar"><div class="bar-fill" style="width:${Math.min(100, pc.done / PLAN_TOTAL * 100)}%"></div><div class="tick" style="left:${Math.min(100, pc.ex / PLAN_TOTAL * 100)}%"></div></div>
    <p class="muted pp-hint">Červená čiarka: kde by si mal byť dnes. Téma sa ráta až od „ide to“ a hotová má byť po poslednom dni, ktorý jej dáva plán. Témy na dnes a ďalšie dni ti sklz nerobia; keď niektorú dokončíš vopred, máš náskok.${avg != null ? ` Testy: priemer <b>${calNum(avg)}/30</b> z ${scored.length}.` : ""}</p>`;
}

function renderMilestones(){
  const host = $("#milestones");
  if(!host) return;
  host.style.display = PLAN_NONE ? "none" : "";
  if(PLAN_NONE) return;
  const t = todayIso();
  /* a milestone's ids are week items or tests */
  const idDone = i => { const x = PLAN_ITEMS.find(x => x.id === i); return x ? planStatus(x) === 2 : planScore(i) != null; };
  const done = m => m.ids ? m.ids.every(idDone) : false;
  const now = PLAN_MILESTONES.find(m => m.d >= t && !done(m));
  host.innerHTML = `<h2>Míľniky</h2><ul class="ms">${PLAN_MILESTONES.map(m => {
    let s;
    if(m.ids){
      const left = m.ids.filter(i => !idDone(i)).length, tests = m.ids.every(i => !PLAN_ITEMS.some(x => x.id === i));
      s = left ? `ešte ${left} z ${m.ids.length}${tests ? " testov" : ""}` : "splnené";
    }
    else { const n = dayDiff(t, m.d); s = n > 0 ? `o ${n} ${skDays(n)}` : n === 0 ? "dnes" : "hotovo"; }
    const ok = done(m), late = !ok && !m.exam && t > m.d;
    return `<li class="${ok ? "ok" : late ? "late" : ""}${m === now ? " now" : ""}"><a class="d" href="${calHash("t", m.d, false)}">${fmtD(m.d)}</a><span class="t">${esc(m.t)}</span><span class="s">${late ? "mešká · " : ""}${s}</span></li>`;
  }).join("")}</ul>`;
}

function planRulesHtml(){
  ensurePlan();
  if(PLAN_NONE) return "";
  return `<details class="card plan-rules"><summary>Pravidlá plánu</summary>${PLAN_RULES.map(([h, ps]) => `<h3>${esc(h)}</h3><ul>${ps.map(p => `<li>${mdBold(p)}</li>`).join("")}</ul>`).join("")}
    <p class="muted">Plán sa mení v <a href="#/info" data-act="plan-goto">Info → Plán v kalendári</a>: skopíruješ ho pre AI a jej odpoveď vložíš späť.</p></details>`;
}

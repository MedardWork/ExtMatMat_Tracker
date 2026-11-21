/* ============================================================
   TEST CARDS — topic tests (js/state.js "topic tests") outside the topic page:
   small pieces the calendar and the topic list use, and the "Testy z tém" card on the overview.
   Colours: tg0–tg4 (css/tests.css) follow the level colours, from testGrade().
   ============================================================ */

/* "Kvadratické rovnice · 2. test · sobota 21. 11. 2026: 8/10 (80 %)" */
function testTitle(t, x){
  const p = pctTxt(x);
  return `${BY_ID[t].n} · ${testName(t, x)} · ${weekdayOf(x.d)} ${fmtIso(x.d)}: ${scoreTxt(x)}${p ? ` (${p})` : ""}`;
}
const testHref = (t, x) => `#/tema/${t}/t/${x.id}`;
const testCls = x => `tg${testGrade(testPct(x))}`;

/* a pill with the score (or what is given), linking to the test */
function testBadge(t, x, label){
  return `<a class="tt-badge ${testCls(x)}" href="${testHref(t, x)}" title="${esc(testTitle(t, x))}">${label || scoreTxt(x)}</a>`;
}
/* in a month cell of the plan: the score, then the topic */
function testChip(t, x){
  return `<a class="ci ck-tt ${testCls(x)}" href="${testHref(t, x)}" title="${esc(testTitle(t, x))}"><b class="ci-s">${scoreTxt(x)}</b><span class="ci-n">${esc(shortName(BY_ID[t]))}</span></a>`;
}
/* in the head of a day in the week: "Test · Kvadratické rovnice 8/10" */
function testLine(t, x){
  return `<a class="cal-tt ${testCls(x)}" href="${testHref(t, x)}" title="${esc(testTitle(t, x))}">Test · ${esc(shortName(BY_ID[t]))} <b>${scoreTxt(x)}</b></a>`;
}
const dayTestLines = d => testsOnDay(d).map(r => testLine(r.t, r.x)).join("");

/* ---------- overview: the latest tests, topics to go over again, finished topics without a test ---------- */
function renderTestsCard(){
  const host = $("#testsCard");
  if(!host) return;
  const all = [];
  for(const t in state.tests) if(BY_ID[t]) for(const x of state.tests[t]) all.push({t, x});
  all.sort((a, b) => b.x.d.localeCompare(a.x.d) || b.x.c - a.x.c);
  const scored = all.filter(r => testPct(r.x) != null);
  const weak = Object.keys(state.tests).filter(t => BY_ID[t] && !isOff(t) && weakTopic(t))
    .map(t => ({t, x:lastScored(t)})).sort((a, b) => testPct(a.x) - testPct(b.x));
  const untested = T.filter(x => !isOff(x.id) && lv(x.id) >= 3 && !testsOf(x.id).length)
    .sort((a, b) => (state.upd[b.id] || 0) - (state.upd[a.id] || 0));
  const more = (n, shown) => n > shown ? ` <span class="muted">a ešte ${n - shown}</span>` : "";
  const topicLink = t => `<a href="#/tema/${t}"><i class="dot l${lv(t)}"></i>${esc(shortName(BY_ID[t]))}</a>`;

  let html = `<h2>Testy z tém</h2>`;
  if(!all.length){
    html += `<p class="tc-intro">Na konci témy si daj krátky test a zapíš ho na stránke témy pod <b>Testy</b>: koľko si mal správne a úlohy, v ktorých si chyboval. Tu potom uvidíš posledné výsledky a čo treba zopakovať, v kalendári body po dňoch.</p>`;
  } else {
    const avg = scored.length ? scored.reduce((a, r) => a + testPct(r.x), 0) / scored.length : null;
    const topics = new Set(all.map(r => r.t)).size;
    html += `<p class="tc-sum"><b>${all.length}</b> ${plural(all.length, "test", "testy", "testov")} z ${topics} ${plural(topics, "témy", "tém", "tém")}${avg != null ? ` · priemer <b>${Math.round(avg * 100)} %</b>` : ""}</p>
      <ul class="tc-list">${all.slice(0, 5).map(r => `<li><a href="${testHref(r.t, r.x)}" title="${esc(testTitle(r.t, r.x))}">
        <span class="tc-d">${fmtAgo(r.x.d)}</span><span class="tc-n">${esc(shortName(BY_ID[r.t]))}</span><span class="tt-badge ${testCls(r.x)}">${scoreTxt(r.x)}</span></a></li>`).join("")}</ul>`;
  }
  if(weak.length) html += `<h3>Na zopakovanie</h3><p class="tc-note">Posledný test z témy pod ${Math.round(TEST_WEAK * 100)} %.</p>
    <ul class="tc-weak">${weak.slice(0, 4).map(r => `<li>${topicLink(r.t)} ${testBadge(r.t, r.x)}</li>`).join("")}</ul>${more(weak.length, 4)}`;
  if(untested.length) html += `<h3>Hotové bez testu</h3><p class="tc-note">Témy na <i>ide to</i> a lepšie, ktoré ešte nemajú test.</p>
    <p class="tc-chips">${untested.slice(0, 5).map(x => topicLink(x.id)).join("")}${more(untested.length, 5)}</p>`;
  host.innerHTML = html;
}

/* ============================================================
   PAST TASKS (topic page) — the tasks of past external-part tests that need this topic, newest first,
   each linked to the official test on the page where it starts (data and links: js/data/ec.js, js/ec.js).
   The tests are copyrighted (NIVAM), so only our own one-line description is shown, never the task itself.
   Filters: subtopic (ui.pastSub) and year (ui.pastYear); the side card "Téma v maturitách" (ecVizHtml) sets both.
   ============================================================ */
const PAST_SHOW = 8;

function drawTPast(){
  const host = $("#tPast");
  if(!host) return;
  const id = ui.route.id, all = ecTasksOf(id);
  host.hidden = !all.length;
  if(!all.length){ host.innerHTML = ""; return; }
  const subs = SUB_LIST[id] || [];
  const count = k => all.filter(x => x.subs.includes(k)).length;
  if(ui.pastSub && !count(ui.pastSub)) ui.pastSub = null;
  if(ui.pastYear && !all.some(x => x.y === ui.pastYear)) ui.pastYear = null;
  const list = all.filter(x => (!ui.pastSub || x.subs.includes(ui.pastSub)) && (!ui.pastYear || x.y === ui.pastYear));
  const shown = ui.pastAll ? list : list.slice(0, PAST_SHOW);
  const tests = new Set(all.map(x => x.y)).size;
  const chips = subs.filter(s => count(s.k)).map(s =>
    `<button class="tp-chip${ui.pastSub === s.k ? " on" : ""}${subIn(id, s.k) ? "" : " ec-out"}" data-act="past-sub" data-k="${s.k}">${esc(s.n)} <b>${count(s.k)}</b></button>`);
  host.innerHTML = `<div class="tp-head"><h2>Úlohy z maturít</h2>
      <span class="muted">${all.length} ${skTasks(all.length)} v ${tests} ${plural(tests, "teste", "testoch", "testoch")} externej časti</span></div>
    <p class="muted tp-note">Odkaz otvorí test na stránke NIVAM na strane s úlohou, výsledok skontroluj v kľúči. Zadania tu nie sú, testy chráni autorské právo.</p>
    ${chips.length > 1 || ui.pastYear ? `<div class="tp-chips">${chips.length > 1 ? `<button class="tp-chip${ui.pastSub ? "" : " on"}" data-act="past-sub" data-k="">Všetky <b>${all.length}</b></button>${chips.join("")}` : ""}${ui.pastYear ? `<button class="tp-chip on" data-act="past-year" data-y="${ui.pastYear}" title="Zrušiť filter roka">Rok ${ui.pastYear} ×</button>` : ""}</div>` : ""}
    ${list.length ? "" : `<p class="muted">Pri tomto filtri tu nie je žiadna úloha.</p>`}
    <ol class="tp-list">${shown.map(x => pastRow(id, x)).join("")}</ol>
    ${list.length > shown.length ? `<button class="btn ghost" data-act="past-all">Zobraziť všetky (${list.length})</button>` : ""}`;
}

function pastRow(id, x){
  const q = String(x.q).padStart(2, "0"), u = ecTaskUrl(x.y, x.q), k = ecKeyUrl(x.y);
  const name = `${x.y} · úloha ${q}`;
  const head = u
    ? `<a class="tp-id" href="${esc(u)}" target="_blank" rel="noopener" title="Otvoriť test ${x.y} na strane s úlohou ${q}">${name} ↗</a>`
    : `<a class="tp-id none" href="${esc(ecYearUrl(x.y))}" target="_blank" rel="noopener" title="Test z roku ${x.y} na stránke NIVAM nie je, len údaje o ňom">${name}</a>`;
  const names = x.subs.map(s => (SUB_LIST[id].find(o => o.k === s) || {}).n).filter(Boolean);
  const other = x.main !== id && BY_ID[x.main] ? ` · hlavne <a href="#/tema/${x.main}">${esc(shortName(BY_ID[x.main]))}</a>` : "";
  const out = x.subs.some(s => subIn(id, s)) ? "" : " ec-out";
  return `<li class="tp-row${out}">${head}
    <span class="tp-l">${esc(x.l)}</span>
    <span class="tp-d" title="Náročnosť ${x.d} z 3">${"●".repeat(x.d)}${"○".repeat(3 - x.d)}</span>
    ${k ? `<a class="tp-key" href="${esc(k)}" target="_blank" rel="noopener" title="Kľúč správnych odpovedí ${x.y}">kľúč</a>` : `<span class="tp-key none" title="Kľúč z roku ${x.y} nie je zverejnený">—</span>`}
    <em class="tp-meta">${esc(names.join(", "))}${other}${x.note ? ` · ${esc(x.note)}` : ""}</em></li>`;
}

/* after a filter changed: the list, and the marks on the side card */
function pastFiltered(){
  ui.pastAll = false; drawTPast();
  $$(".ev-s").forEach(b => b.classList.toggle("on", b.dataset.k === ui.pastSub));
  $$(".ev-y").forEach(b => b.classList.toggle("on", Number(b.dataset.y) === ui.pastYear));
}
action("past-sub", el => {
  const k = el.dataset.k || null;
  ui.pastSub = el.closest(".t-ecviz") && ui.pastSub === k ? null : k;   /* a subtopic on the side card toggles */
  pastFiltered();
});
action("past-year", el => { const y = Number(el.dataset.y); ui.pastYear = ui.pastYear === y ? null : y; pastFiltered(); });
action("past-all", () => { ui.pastAll = true; drawTPast(); });
action("past-go", el => {          /* the EČ badge of a subtopic (tab Podtémy): that subtopic's tasks on Precvičovanie */
  ui.pastSub = el.dataset.k; ui.pastYear = null; ui.pastAll = false; ui.pastJump = true;
  go(`#/tema/${ui.route.id}/precvic`);
});

/* ---------- side card of Precvičovanie: the topic in the past tests ----------
   Years: one column per test, oldest left, a square per task that needs the topic (pale: the task is mainly
   about another topic); the older tests count less in the points (ecYearW), so their labels are pale.
   Subtopics: points per average test with your level. (Your own tests have their chart in #tTests.) */
function ecVizHtml(id){
  const all = ecTasksOf(id), ec = EC.topic[id];
  if(!ec) return "";
  let h = "";
  {
    const years = [...EC_TESTS].reverse();
    const cols = years.map(t => {
      const xs = all.filter(x => x.y === t.y), other = xs.filter(x => x.main !== id).length;
      const tip = `${t.y}: ${xs.length ? `${xs.length} ${skTasks(xs.length)}${other ? `, ${other} hlavne z inej témy` : ""}` : "žiadna úloha"}`;
      return `<button class="ev-y${ui.pastYear === t.y ? " on" : ""}" data-act="past-year" data-y="${t.y}" title="${tip}"${xs.length ? "" : " disabled"}>${
        xs.map(x => `<i${x.main === id ? "" : ` class="side"`}></i>`).join("") || `<i class="z"></i>`}</button>`;
    }).join("");
    const labels = years.map(t => `<span${ecYearW(t.y) < 1 ? ` class="old"` : ""}>${String(t.y).slice(2)}</span>`).join("");
    const subs = subsOf(id).filter(s => !s.own).map(s => ({s, o:ecSub(id, s.k)}));
    const max = Math.max(0.01, ...subs.map(r => r.o ? r.o.pts : 0));
    const rows = subs.map(({s, o}) => `<button class="ev-s${ui.pastSub === s.k ? " on" : ""}${subIn(id, s.k) ? "" : " ec-out"}" data-act="past-sub" data-k="${s.k}"${o ? "" : " disabled"}
        title="${esc(s.n)}: ${o ? `${o.years.length}× v testoch, ${ecPts(o.pts)} b. na test` : "v externej časti nebola"} · tvoja úroveň ${LV[subLv(id, s.k)].label}">
        <span class="nm"><i class="dot l${subLv(id, s.k)}"></i>${esc(s.n)}</span>
        <span class="br"><i style="width:${o ? Math.max(3, o.pts / max * 100) : 0}%"></i></span>
        <span class="v">${o ? ecPts(o.pts).replace(" b.", "") : "—"}</span></button>`).join("");
    h += ec.years
        ? foldTxt(`V <b>${ec.years} z ${EC.nTests}</b> testov, priemerne <b>${ecPts(ec.pts)}</b> z 30.`, "Stĺpec = rok, štvorček = úloha (bledý: hlavne z inej témy). Klik na rok alebo podtému vyberie úlohy.", "ev-cap")
        : `<p class="ev-cap">V rokoch ${EC.first}–${EC.last} sa na túto tému externá časť nepýtala.</p>`;
    h += `
      ${ec.years ? `<div class="ev-years">${cols}</div><div class="ev-yl">${labels}</div>` : ""}
      ${rows ? `<h3>Podtémy: body na test <span>bodka = tvoja úroveň</span></h3><div class="ev-subs">${rows}</div>` : ""}`;
  }
  return `<section class="card t-ecviz" data-tp="precvic"><h2>Téma v maturitách</h2>${h}</section>`;
}

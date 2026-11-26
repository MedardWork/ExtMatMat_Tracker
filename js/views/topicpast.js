/* ============================================================
   PAST TASKS (topic page) — the tasks of past external-part tests that need this topic, newest first,
   each linked to the official test on the page where it starts (data and links: js/data/ec.js, js/ec.js).
   The tests are copyrighted (NIVAM), so only our own one-line description is shown, never the task itself.
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
  const list = ui.pastSub ? all.filter(x => x.subs.includes(ui.pastSub)) : all;
  const shown = ui.pastAll ? list : list.slice(0, PAST_SHOW);
  const tests = new Set(all.map(x => x.y)).size;
  const chips = subs.filter(s => count(s.k)).map(s =>
    `<button class="tp-chip${ui.pastSub === s.k ? " on" : ""}${subIn(id, s.k) ? "" : " ec-out"}" data-act="past-sub" data-k="${s.k}">${esc(s.n)} <b>${count(s.k)}</b></button>`);
  host.innerHTML = `<div class="tp-head"><h2>Úlohy z maturít</h2>
      <span class="muted">${all.length} ${skTasks(all.length)} v ${tests} ${plural(tests, "teste", "testoch", "testoch")} externej časti</span></div>
    <p class="muted tp-note">Odkaz otvorí test na stránke NIVAM na strane s úlohou, výsledok skontroluj v kľúči. Zadania tu nie sú, testy chráni autorské právo.</p>
    ${chips.length > 1 ? `<div class="tp-chips"><button class="tp-chip${ui.pastSub ? "" : " on"}" data-act="past-sub" data-k="">Všetky <b>${all.length}</b></button>${chips.join("")}</div>` : ""}
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

action("past-sub", el => { ui.pastSub = el.dataset.k || null; ui.pastAll = false; drawTPast(); });
action("past-all", () => { ui.pastAll = true; drawTPast(); });
action("past-go", el => {          /* the EČ badge of a subtopic: show that subtopic's tasks */
  ui.pastSub = el.dataset.k; ui.pastAll = false; drawTPast();
  const s = $("#tPast"); if(s) s.scrollIntoView({behavior:"smooth", block:"start"});
});

/* ============================================================
   TOPIC TESTS — the "Testy" section of the topic page (js/views/topic.js).
   A short test on the topic: the day, an optional name and its tasks: notes bound to the test (n.test), each marked
   správne / čiastočne / zle (n.res). The score is counted from the marks (testScore in js/state.js): a task is one point.
   "+ ✓ / ½ / ✗" adds a task with only its mark (shown as a small chip); "+ s poznámkou" opens the note editor.
   Data: js/state.js ("topic tests"). The calendar, overview, topic list, search and the AI text show them too.
   Route #/tema/<id>/t/<testId> opens the topic scrolled to a test.
   ============================================================ */
const TASK_MARK = {ok:["✓", "správne"], part:["½", "čiastočne"], bad:["✗", "zle"]};
const skTasks = n => plural(n, "úloha", "úlohy", "úloh");

function drawTTests(){
  const host = $("#tTests");
  if(!host) return;
  drawTTabs();
  const id = ui.route.id, v = lv(id);
  const list = testsByDate(id).reverse();     /* newest first */
  const head = `<div class="tt-head">
    <h2>Testy${list.length ? ` <span class="count">${list.length}</span>` : ""}</h2>
    <button class="btn${list.length ? " ghost" : ""}" data-act="test-new" title="Zapísať test z tejto témy (T)">+ Nový test</button>
  </div>`;
  if(!list.length){
    host.innerHTML = `${head}<p class="tt-empty">${v >= 3 ? `Téma je na <i>${LV[v].label}</i>, over si to krátkym testom.` : "Na konci témy si daj krátky test."}
      Každú úlohu testu si zapíšeš ako ✓, ½ alebo ✗ a body sa spočítajú samy. K úlohe, v ktorej si chyboval, si pripíšeš poznámku. Body uvidíš aj v kalendári pri dni, keď si test písal.</p>`;
    return;
  }
  host.innerHTML = `${head}<div id="ttHint">${testHintHtml(id)}</div>${testTrendHtml(id)}
    ${list.map(x => testCardHtml(id, x)).join("")}`;
  mountEditors(host);
}

/* the latest score next to the topic's own level: does the test agree with it? */
function testHintHtml(id){
  const x = lastScored(id), v = lv(id);
  if(!x) return "";
  const g = testGrade(testPct(id, x)), sc = scoreTxt(id, x);
  const marked = testTasks(id, x.id).some(n => n.res === "bad" || n.res === "part");
  if(g <= 2 && v >= 3) return `<p class="tt-hint">Posledný test (<b>${sc}</b>) dopadol slabšie, než hovorí úroveň témy (<i>${LV[v].label}</i>). ${marked ? "Pozri úlohy označené ✗ a ½" : "Pozri, v ktorých úlohách si chyboval,"} a podľa toho uprav podtémy, ktoré ešte nejdú.</p>`;
  if(g === 4 && v >= 1 && v <= 2) return `<p class="tt-hint good">Posledný test (<b>${sc}</b>) dopadol výborne, no téma je len na <i>${LV[v].label}</i>. Možno si ju podceňuješ: skontroluj podtémy.</p>`;
  return "";
}

/* one bar per scored test, oldest on the left (from two tests on) */
function testTrendHtml(id){
  const scored = testsByDate(id).filter(x => testPct(id, x) != null).slice(-12);
  if(scored.length < 2) return "";
  return `<div class="tt-trend" role="img" aria-label="Výsledky testov po poradí: ${scored.map(x => pctTxt(id, x)).join(", ")}">${scored.map(x => {
    const p = testPct(id, x);
    return `<a class="tg${testGrade(p)}" href="#/tema/${id}/t/${x.id}" title="${esc(testName(id, x))} · ${fmtIso(x.d)} · ${scoreTxt(id, x)} (${pctTxt(id, x)})">
      <span>${Math.round(p * 100)}</span><i style="height:${Math.max(3, Math.round(p * 40))}px"></i><small>${fmtD(x.d)}</small></a>`;
  }).join("")}</div>`;
}

function testMetaHtml(id, x){
  const n = testTasks(id, x.id).length, r = testScore(id, x);
  return `${weekdayOf(x.d)} ${fmtIso(x.d)}${n ? ` · ${n} ${skTasks(n)}` : ""}${r.hand ? ` · <span class="tt-open">body zadané ručne</span>`
    : r.open ? ` · <span class="tt-open" title="Úloha bez ✓ ½ ✗ sa ráta ako 0 bodov">${r.open} bez známky</span>` : ""}`;
}
function testScoreHtml(id, x){
  return `<b class="tt-s">${scoreTxt(id, x)}</b><span class="tt-p">${pctTxt(id, x)}</span>`;
}

function testCardHtml(id, x){
  const p = testPct(id, x);
  const editing = !!(ui.testEdit && ui.testEdit.x === x.id);
  const folded = ui.collapsed.has(x.id) && !editing;
  const tasks = testTasks(id, x.id);
  return `<article class="tt tg${testGrade(p)}${editing ? " editing" : ""}${folded ? " collapsed" : ""}" id="test-${x.id}">
    <header class="tt-h">
      <button class="note-fold" data-act="test-fold" data-x="${x.id}" aria-expanded="${!folded}" title="${folded ? "Rozbaliť" : "Zbaliť"}">▾</button>
      <div class="tt-hd">
        <h3 class="tt-title">${esc(testName(id, x))}</h3>
        <div class="tt-meta">${testMetaHtml(id, x)}</div>
      </div>
      <div class="tt-score">${testScoreHtml(id, x)}</div>
      <div class="note-acts">
        ${editing ? "" : `<button data-act="test-edit" data-x="${x.id}">Upraviť</button>`}
        <button class="danger" data-act="test-del" data-x="${x.id}" title="Zmazať test aj s jeho úlohami">Zmazať</button>
      </div>
    </header>
    <div class="tt-bar"><i style="width:${p == null ? 0 : Math.round(p * 1000) / 10}%"></i></div>
    ${editing ? testFormHtml(id, x) : ""}
    <div class="tt-body">
      ${tasks.length ? `<div class="tt-tasks">${tasks.map((n, i) => taskHtml(id, n, i)).join("")}</div>` : ""}
      <div class="tt-adds" role="group" aria-label="Pridať úlohu">
        <span class="tt-adds-l">Pridať úlohu</span>
        ${TASK_RES.map(r => `<button class="tq tr-${r}" data-act="task-quick" data-x="${x.id}" data-r="${r}" title="Pridať úlohu, ktorú si mal ${TASK_MARK[r][1]}">+ ${TASK_MARK[r][0]} ${TASK_MARK[r][1]}</button>`).join("")}
        <button class="tq tq-note" data-act="task-new" data-x="${x.id}" title="Pridať úlohu s poznámkou: zadanie, postup, kde bola chyba">+ s poznámkou</button>
      </div>
      ${tasks.length ? "" : `<p class="tt-how">Každá úloha je 1 bod: ✓ správne 1, ½ čiastočne 0,5, ✗ zle 0. Počet úloh aj body sa spočítajú samy.</p>`}
    </div>
    ${editing ? `<div class="tt-foot"><span class="muted small">Ukladá sa samo.</span><button class="btn" data-act="test-done">Hotovo</button></div>` : ""}
  </article>`;
}

function testFormHtml(id, x){
  return `<div class="tt-form">
    <label class="tt-f"><span>Dátum</span><input type="date" data-in="test-f" data-f="d" data-x="${x.id}" value="${x.d}"></label>
    <label class="tt-f tt-name"><span>Názov</span><input data-in="test-f" data-f="n" data-x="${x.id}" value="${esc(x.n)}" maxlength="80" placeholder="nepovinné, napr. Zbierka str. 34"></label>
  </div>
  ${x.s != null ? `<p class="tt-warn">Body ${scoreTxt(id, x)} si k tomuto testu zadal ručne. Odteraz sa počítajú z úloh.
    <button class="btn ghost" data-act="test-hand-off" data-x="${x.id}">Počítať z úloh</button></p>` : ""}`;
}

/* ---------- a task of a test: a note bound to it ---------- */
const taskTitle = (n, i) => n.title.trim() || `Úloha ${i + 1}`;
/* the three marks; short = symbols only (a task chip) */
function taskResSeg(n, short){
  return `<div class="nlv tres" role="group" aria-label="Ako dopadla úloha">${TASK_RES.map(r =>
    `<button class="tr-${r}" data-act="task-res" data-n="${n.id}" data-r="${r}" aria-pressed="${n.res === r}"${short ? ` title="${TASK_MARK[r][1]}"` : ""}>${TASK_MARK[r][0]}${short ? "" : " " + TASK_MARK[r][1]}</button>`).join("")}</div>`;
}
/* a task with nothing written: only its number and mark */
const bareTask = n => !n.title.trim() && !n.body.trim() && !n.sub;
function taskHtml(tid, n, i){
  if(ui.editing && ui.editing.n === n.id) return noteEditorHtml(tid, n);
  if(bareTask(n)) return `<div class="task-chip r-${n.res || "no"}" id="note-${n.id}">
    <span class="tk-no">Úloha ${i + 1}</span>${taskResSeg(n, true)}
    <span class="tk-acts"><button data-act="note-edit" data-n="${n.id}" title="Pripísať k úlohe poznámku">✎</button><button class="danger" data-act="note-del" data-n="${n.id}" title="Zmazať úlohu">×</button></span>
  </div>`;
  const folded = ui.collapsed.has(n.id);
  const sn = n.sub && subName(tid, n.sub);
  return `<article class="note task r-${n.res || "no"}${folded ? " collapsed" : ""}" id="note-${n.id}" data-note="${tid}/${n.id}">
    <header class="note-h">
      <button class="note-fold" data-act="note-fold" data-n="${n.id}" aria-expanded="${!folded}" title="${folded ? "Rozbaliť" : "Zbaliť"}">▾</button>
      <div class="note-hd">
        <h4 class="note-title">${inline(taskTitle(n, i))}</h4>
        ${sn ? `<div class="note-date"><span class="note-sub">${esc(sn)}</span></div>` : ""}
        ${taskResSeg(n)}
      </div>
      <div class="note-acts">
        <button data-act="note-edit" data-n="${n.id}">Upraviť</button>
        <button class="danger" data-act="note-del" data-n="${n.id}" title="Zmazať úlohu">Zmazať</button>
      </div>
    </header>
    ${n.body.trim() ? `<div class="note-body md">${md(n.body, {checks:true})}</div>` : ""}
  </article>`;
}

/* ---------- editing ---------- */
function startTest(tid, d){
  if(ui.editing) finishEditing(true);
  finishTest(true);
  const x = addTest(tid, d);
  ui.testEdit = {t:tid, x:x.id};
  save();
  return x;
}
/* a new test waits for its first task: "+ ✓ správne" gets the focus, so Enter adds one task after another */
function focusTest(xid){
  const art = $(`#test-${xid}`);
  if(!art) return;
  art.scrollIntoView({block:"center"});
  const b = $(`[data-act="task-quick"]`, art);
  if(b) b.focus({preventScroll:true});
}
/* close the test's fields; a test left without a name or a task is dropped */
function finishTest(silent){
  const te = ui.testEdit;
  if(!te) return;
  ui.testEdit = null;
  const x = findTest(te.t, te.x);
  if(x && emptyTest(te.t, x)) removeTest(te.t, te.x);
  save();
  if(silent || ui.route.view !== "tema" || ui.route.id !== te.t) return;
  drawTTests(); drawTHead();
  flashEl($(`#test-${te.x}`));
}
/* after typing or marking: score, bar and colour of the card, the hint and the page head, without redrawing the fields */
function testReadout(tid, x){
  const art = $(`#test-${x.id}`);
  if(!art) return;
  const p = testPct(tid, x);
  art.className = art.className.replace(/\btg\d\b/, `tg${testGrade(p)}`);
  $(".tt-score", art).innerHTML = testScoreHtml(tid, x);
  $(".tt-title", art).textContent = testName(tid, x);
  $(".tt-meta", art).innerHTML = testMetaHtml(tid, x);
  $(".tt-bar i", art).style.width = `${p == null ? 0 : Math.round(p * 1000) / 10}%`;
  const h = $("#ttHint");
  if(h) h.innerHTML = testHintHtml(tid);
  drawTHead();
}

onInput("test-f", el => {
  const tid = ui.route.id, f = el.dataset.f, x = findTest(tid, el.dataset.x);
  if(!x) return;
  const val = el.value.trim();
  let patch;
  if(f === "d"){ if(!/^\d{4}-\d\d-\d\d$/.test(val)) return; patch = {d:val}; }
  else patch = {n:el.value};
  updateTest(tid, x.id, patch);
  saveSoon();
  testReadout(tid, x);
});
document.addEventListener("keydown", e => {
  if(!e.target.matches || !e.target.matches(".tt-form input")) return;
  if(e.key === "Enter"){ e.preventDefault(); finishTest(); }
  else if(e.key === "Escape"){ e.preventDefault(); finishTest(); }
});

action("test-new", () => {
  if(ui.route.view !== "tema") return;
  if(topicPane() !== "precvic"){ ui.pendingTest = {t:ui.route.id, d:todayIso()}; go(`#/tema/${ui.route.id}/precvic`); return; }
  const x = startTest(ui.route.id);
  drawTTests(); drawTHead(); drawTNotes(); drawTSide();
  $("#topicPage").classList.remove("editing");
  focusTest(x.id);
});
action("test-edit", el => {
  const tid = ui.route.id;
  if(ui.editing) finishEditing(true);
  finishTest(true);
  ui.testEdit = {t:tid, x:el.dataset.x};
  ui.collapsed.delete(el.dataset.x);
  drawTTests(); drawTNotes();
  $("#topicPage").classList.remove("editing");
  focusTest(el.dataset.x);
});
action("test-done", () => {
  if(ui.editing){ const n = findNote(ui.editing.t, ui.editing.n); if(n && n.test === (ui.testEdit || {}).x) finishEditing(true); }
  finishTest();
});
action("test-del", el => {
  const tid = ui.route.id, xid = el.dataset.x, x = findTest(tid, xid);
  if(!x) return;
  const empty = emptyTest(tid, x), name = testName(tid, x);
  if(ui.editing && (findNote(tid, ui.editing.n) || {}).test === xid){ ui.editing = null; $("#topicPage").classList.remove("editing"); }
  if(ui.testEdit && ui.testEdit.x === xid) ui.testEdit = null;
  const rec = removeTest(tid, xid);
  save();
  drawTTests(); drawTHead(); drawTSide();
  if(!empty) toast(`Test „${name}“ zmazaný${rec.tasks.length ? ` aj s ${rec.tasks.length} ${plural(rec.tasks.length, "úlohou", "úlohami", "úlohami")}` : ""}.`, () => {
    restoreTest(tid, rec); save();
    if(ui.route.view === "tema" && ui.route.id === tid){ drawTTests(); drawTHead(); drawTSide(); }
  });
});
/* a score typed by hand in the first version: from now on it comes from the tasks */
action("test-hand-off", el => {
  const tid = ui.route.id;
  if(!updateTest(tid, el.dataset.x, {s:null, m:null})) return;
  save();
  drawTTests(); drawTHead();
  focusTest(el.dataset.x);
});
action("test-fold", el => {
  const xid = el.dataset.x;
  if(ui.collapsed.has(xid)) ui.collapsed.delete(xid); else ui.collapsed.add(xid);
  const art = $(`#test-${xid}`);
  art.classList.toggle("collapsed", ui.collapsed.has(xid));
  el.setAttribute("aria-expanded", !ui.collapsed.has(xid));
});
action("task-new", el => {
  if(ui.route.view !== "tema") return;
  const tid = ui.route.id, xid = el.dataset.x;
  if(!findTest(tid, xid)) return;
  if(ui.editing) finishEditing(true);
  const n = addNote(tid, "", xid);
  ui.editing = {t:tid, n:n.id};
  ui.collapsed.delete(xid);
  save();
  drawTTests(); drawTNotes(); drawTHead();
  focusEditor();
});
/* a task with only its mark, added at the end; the button keeps the focus, so Enter adds the next one */
action("task-quick", el => {
  if(ui.route.view !== "tema") return;
  const tid = ui.route.id, xid = el.dataset.x, r = el.dataset.r;
  if(!findTest(tid, xid) || !TASK_RES.includes(r)) return;
  const wasEditing = !!ui.editing;
  if(wasEditing){ finishEditing(true); $("#topicPage").classList.remove("editing"); }
  const n = addNote(tid, "", xid);
  n.res = r;
  ui.collapsed.delete(xid);
  save();
  drawTTests(); drawTHead();
  if(wasEditing){ drawTNotes(); drawTSide(); }
  const b = $(`#test-${xid} [data-act="task-quick"][data-r="${r}"]`);
  if(b) b.focus({preventScroll:true});
});
/* the mark of a task; clicking the chosen one again clears it. The card keeps its fields and focus. */
action("task-res", el => {
  const tid = ui.route.id, nid = el.dataset.n, r = el.dataset.r;
  const n = findNote(tid, nid);
  if(!n) return;
  updateNote(tid, nid, {res: n.res === r ? "" : r});
  saveSoon();
  const art = $(`#note-${nid}`), x = findTest(tid, n.test);
  if(art){
    art.className = art.className.replace(/\br-\w+\b/, `r-${n.res || "no"}`);
    $$(`[data-act="task-res"]`, art).forEach(b => b.setAttribute("aria-pressed", b.dataset.r === n.res));
  }
  if(x) testReadout(tid, x);
});

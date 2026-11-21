/* ============================================================
   TOPIC TESTS — the "Testy" section of the topic page (js/views/topic.js).
   A short test on the topic: the day, how many points / tasks right out of how many, an optional name,
   and its tasks: notes bound to the test (n.test), each marked správne / čiastočne / zle (n.res).
   Data: js/state.js ("topic tests"). The calendar, overview, topic list, search and the AI text show them too.
   Route #/tema/<id>/t/<testId> opens the topic scrolled to a test.
   ============================================================ */
const TASK_MARK = {ok:["✓", "správne"], part:["½", "čiastočne"], bad:["✗", "zle"]};
const skTasks = n => plural(n, "úloha", "úlohy", "úloh");
/* "8" or "7,5" from what was typed; null for anything else (an empty field is handled by the caller) */
const testNum = s => /^\d+(?:[.,]\d+)?$/.test(s) ? Math.round(parseFloat(s.replace(",", ".")) * 100) / 100 : null;

function drawTTests(){
  const host = $("#tTests");
  if(!host) return;
  const id = ui.route.id, v = lv(id);
  const list = testsByDate(id).reverse();     /* newest first */
  const head = `<div class="tt-head">
    <h2>Testy${list.length ? ` <span class="count">${list.length}</span>` : ""}</h2>
    <button class="btn${list.length ? " ghost" : ""}" data-act="test-new" title="Zapísať test z tejto témy (T)">+ Nový test</button>
  </div>`;
  if(!list.length){
    host.innerHTML = `${head}<p class="tt-empty">${v >= 3 ? `Téma je na <i>${LV[v].label}</i>, over si to krátkym testom.` : "Na konci témy si daj krátky test."}
      Zapíšeš si, koľko si mal správne, a úlohy, v ktorých si chyboval, si k testu napíšeš ako poznámky. Body uvidíš aj v kalendári pri dni, keď si test písal.</p>`;
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
  const g = testGrade(testPct(x));
  const marked = testTasks(id, x.id).some(n => n.res === "bad" || n.res === "part");
  if(g <= 2 && v >= 3) return `<p class="tt-hint">Posledný test (<b>${scoreTxt(x)}</b>) dopadol slabšie, než hovorí úroveň témy (<i>${LV[v].label}</i>). ${marked ? "Pozri úlohy označené ✗ a ½" : "Pozri, v ktorých úlohách si chyboval,"} a podľa toho uprav podtémy, ktoré ešte nejdú.</p>`;
  if(g === 4 && v >= 1 && v <= 2) return `<p class="tt-hint good">Posledný test (<b>${scoreTxt(x)}</b>) dopadol výborne, no téma je len na <i>${LV[v].label}</i>. Možno si ju podceňuješ: skontroluj podtémy.</p>`;
  return "";
}

/* one bar per scored test, oldest on the left (from two tests on) */
function testTrendHtml(id){
  const scored = testsByDate(id).filter(x => testPct(x) != null).slice(-12);
  if(scored.length < 2) return "";
  return `<div class="tt-trend" role="img" aria-label="Výsledky testov po poradí: ${scored.map(pctTxt).join(", ")}">${scored.map(x => {
    const p = testPct(x);
    return `<a class="tg${testGrade(p)}" href="#/tema/${id}/t/${x.id}" title="${esc(testName(id, x))} · ${fmtIso(x.d)} · ${scoreTxt(x)} (${pctTxt(x)})">
      <span>${Math.round(p * 100)}</span><i style="height:${Math.max(3, Math.round(p * 40))}px"></i><small>${fmtD(x.d)}</small></a>`;
  }).join("")}</div>`;
}

function testMetaHtml(id, x){
  const tasks = testTasks(id, x.id);
  const marks = TASK_RES.map(r => { const n = tasks.filter(t => t.res === r).length; return n ? `<span class="tt-m r-${r}" title="${TASK_MARK[r][1]}: ${n}">${TASK_MARK[r][0]} ${n}</span>` : ""; }).join("");
  return `${weekdayOf(x.d)} ${fmtIso(x.d)}${tasks.length ? ` · ${tasks.length} ${skTasks(tasks.length)}` : ""}${marks}`;
}
function testScoreHtml(x){
  return `<b class="tt-s">${scoreTxt(x)}</b><span class="tt-p">${pctTxt(x)}</span>`;
}

function testCardHtml(id, x){
  const p = testPct(x);
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
      <div class="tt-score">${testScoreHtml(x)}</div>
      <div class="note-acts">
        ${editing ? "" : `<button data-act="test-edit" data-x="${x.id}">Upraviť</button>`}
        <button class="danger" data-act="test-del" data-x="${x.id}" title="Zmazať test aj s jeho úlohami">Zmazať</button>
      </div>
    </header>
    <div class="tt-bar"><i style="width:${p == null ? 0 : Math.round(p * 1000) / 10}%"></i></div>
    ${editing ? testFormHtml(x) : ""}
    <div class="tt-body">
      ${tasks.length ? `<div class="tt-tasks">${tasks.map((n, i) => taskHtml(id, n, i)).join("")}</div>` : ""}
      <button class="tt-add" data-act="task-new" data-x="${x.id}">+ Úloha${tasks.length ? "" : "<span> — úlohu, v ktorej si chyboval, si sem zapíš ako poznámku</span>"}</button>
    </div>
    ${editing ? `<div class="tt-foot"><span class="muted small">Ukladá sa samo.</span><button class="btn" data-act="test-done">Hotovo</button></div>` : ""}
  </article>`;
}

function testFormHtml(x){
  const val = v => v == null ? "" : numTxt(v);
  return `<div class="tt-form">
    <label class="tt-f tt-sc"><span>Správne</span>
      <input class="tt-num" data-in="test-f" data-f="s" data-x="${x.id}" value="${val(x.s)}" inputmode="decimal" autocomplete="off" aria-label="Koľko bodov alebo úloh si mal správne">
      <span>z</span>
      <input class="tt-num" data-in="test-f" data-f="m" data-x="${x.id}" value="${val(x.m)}" inputmode="decimal" autocomplete="off" placeholder="10" aria-label="Z koľkých bodov alebo úloh">
    </label>
    <label class="tt-f"><span>Dátum</span><input type="date" data-in="test-f" data-f="d" data-x="${x.id}" value="${x.d}"></label>
    <label class="tt-f tt-name"><span>Názov</span><input data-in="test-f" data-f="n" data-x="${x.id}" value="${esc(x.n)}" maxlength="80" placeholder="nepovinné, napr. Zbierka str. 34"></label>
  </div>
  <p class="tt-warn" id="ttWarn-${x.id}">${testWarn(x)}</p>`;
}
const testWarn = x => x.s != null && x.m && x.s > x.m ? "Správnych je viac ako maximum. Skontroluj čísla." : "";

/* ---------- a task of a test: a note bound to it ---------- */
const taskTitle = (n, i) => n.title.trim() || `Úloha ${i + 1}`;
function taskResSeg(n){
  return `<div class="nlv tres" role="group" aria-label="Ako dopadla úloha">${TASK_RES.map(r =>
    `<button class="tr-${r}" data-act="task-res" data-n="${n.id}" data-r="${r}" aria-pressed="${n.res === r}">${TASK_MARK[r][0]} ${TASK_MARK[r][1]}</button>`).join("")}</div>`;
}
function taskHtml(tid, n, i){
  if(ui.editing && ui.editing.n === n.id) return noteEditorHtml(tid, n);
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
function focusTest(xid){
  const art = $(`#test-${xid}`);
  if(!art) return;
  art.scrollIntoView({block:"center"});
  const inp = $(`[data-f="s"]`, art);
  if(inp){ inp.focus({preventScroll:true}); inp.select(); }
}
/* close the test's fields; a test left without a score, a name or a task is dropped */
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
/* after typing: score, bar and colour of the card, without redrawing the fields */
function testReadout(tid, x){
  const art = $(`#test-${x.id}`);
  if(!art) return;
  const p = testPct(x);
  art.className = art.className.replace(/\btg\d\b/, `tg${testGrade(p)}`);
  $(".tt-score", art).innerHTML = testScoreHtml(x);
  $(".tt-title", art).textContent = testName(tid, x);
  $(".tt-meta", art).innerHTML = testMetaHtml(tid, x);
  $(".tt-bar i", art).style.width = `${p == null ? 0 : Math.round(p * 1000) / 10}%`;
  const w = $(`#ttWarn-${x.id}`);
  if(w) w.textContent = testWarn(x);
}

onInput("test-f", el => {
  const tid = ui.route.id, f = el.dataset.f, x = findTest(tid, el.dataset.x);
  if(!x) return;
  const val = el.value.trim();
  let patch;
  if(f === "s" || f === "m"){
    /* "8/10" (or "8 z 10") typed into the first field fills both; the field is tidied when it is left */
    const both = f === "s" && val.match(/^(\d+(?:[.,]\d+)?)\s*(?:\/|z)\s*(\d+(?:[.,]\d+)?)?$/);
    if(both){
      patch = {s:testNum(both[1])};
      if(both[2]){
        patch.m = testNum(both[2]) || null;
        const m = $(`[data-f="m"][data-x="${x.id}"]`);
        if(m) m.value = both[2];
      }
    } else {
      const v = val === "" ? null : testNum(val);
      if(val !== "" && v == null) return;      /* half-typed ("7,") or not a number: keep what was there */
      patch = {[f]: f === "m" ? v || null : v};
    }
  }
  else if(f === "d"){ if(!/^\d{4}-\d\d-\d\d$/.test(val)) return; patch = {d:val}; }
  else patch = {n:el.value};
  updateTest(tid, x.id, patch);
  saveSoon();
  testReadout(tid, x);
});
document.addEventListener("change", e => {
  const el = e.target;
  if(!el.matches || !el.matches(".tt-num[data-f=\"s\"]")) return;
  const x = findTest(ui.route.id, el.dataset.x);
  if(x && /[^\d.,\s]/.test(el.value)) el.value = x.s == null ? "" : numTxt(x.s);
});
document.addEventListener("keydown", e => {
  if(!e.target.matches || !e.target.matches(".tt-form input")) return;
  if(e.key === "Enter"){ e.preventDefault(); finishTest(); }
  else if(e.key === "Escape"){ e.preventDefault(); finishTest(); }
});

action("test-new", () => {
  if(ui.route.view !== "tema") return;
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
action("task-res", el => {
  const tid = ui.route.id, nid = el.dataset.n, r = el.dataset.r;
  const n = findNote(tid, nid);
  if(!n) return;
  updateNote(tid, nid, {res: n.res === r ? "" : r});   /* the chosen mark again clears it */
  saveSoon();
  if(ui.editing && ui.editing.n === nid){
    const art = $(`#note-${nid}`);
    art.className = art.className.replace(/\br-\w+\b/, `r-${n.res || "no"}`);
    $$(`[data-act="task-res"]`, art).forEach(b => b.setAttribute("aria-pressed", b.dataset.r === n.res));
    const x = findTest(tid, n.test), card = x && $(`#test-${x.id} .tt-meta`);
    if(card) card.innerHTML = testMetaHtml(tid, x);
  } else drawTTests();
});

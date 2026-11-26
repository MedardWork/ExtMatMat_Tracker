// Drives the app's own pages in a real browser (dev/check.js covers theory and tools):
//   node dev/app-check.js            topic tests end to end, then every page at 1280 and 400 px
//   SHOTS=/some/dir node dev/app-check.js    also saves a full-page picture of each page
// Starts from an empty save (a fresh browser profile, file://), adds the starter plan and a few topic tests,
// and checks: no console errors, no sideways scrolling, and what the topic tests should do.
const { chromium } = require("playwright");
const path = require("path");
const BASE = "file://" + path.resolve(__dirname, "..", "maturita-matematika-tracker.html");
const SHOTS = process.env.SHOTS;

let bad = 0;
const check = (cond, what) => { if(!cond) bad++; console.log(`${cond ? "ok  " : "FAIL"} ${what}`); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  // the desktop app and Docker forbid eval (Content-Security-Policy), so this does too
  await ctx.addInitScript(() => {
    const real = window.eval;
    const no = () => { console.error("eval used: forbidden by the app's Content-Security-Policy"); throw new EvalError("eval is forbidden"); };
    window.eval = s => /UtilityScript/.test(new Error().stack) ? real(s) : no();
    window.Function = new Proxy(Function, { construct: no, apply: no });
  });
  page.on("console", m => { if(m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", e => errs.push(e.message));
  page.on("dialog", d => d.accept());
  const wait = ms => page.waitForTimeout(ms);
  const ev = (fn, arg) => page.evaluate(fn, arg);

  await page.goto(BASE + "#/");
  await wait(600);
  const d2 = await ev(() => isoOf(Date.now() - 2 * 86400000));   /* a day two days ago */

  /* ---------- topic tests ---------- */
  await page.goto(BASE + "#/tema/a5");
  await wait(300);
  await page.keyboard.press("t");
  await wait(200);
  const focusedQuick = () => ev(() => { const a = document.activeElement; return !!a && a.dataset.act === "task-quick" && a.dataset.r === "ok"; });
  check(await focusedQuick(), "T on a topic page: a new test, '+ ✓ správne' focused");
  for(let i = 0; i < 3; i++){ await page.keyboard.press("Enter"); await wait(80); }
  check(await focusedQuick() && await ev(() => state.notes.a5.length === 3 && state.notes.a5.every(n => n.res === "ok")), "Enter, Enter, Enter: three tasks marked ✓, the button keeps the focus");
  await page.click('#tTests [data-act="task-quick"][data-r="part"]');
  await page.fill('[data-f="n"]', "Zbierka");
  await wait(150);
  check(await ev(() => { const x = state.tests.a5[0], r = testScore("a5", x); return r.s === 3.5 && r.m === 4 && x.s == null && x.n === "Zbierka" && x.d === todayIso(); }), "the score is counted from the marks (3,5/4), the name is kept, the day is today");
  check(await ev(() => document.querySelectorAll("#tTests .task-chip").length === 4 && /3,5\/4/.test(document.querySelector("#tTests .tt-score").innerText)), "tasks with only a mark are chips, the card shows 3,5/4");
  await page.click('[data-act="task-new"]');
  await wait(150);
  await page.keyboard.type("Úloha 3");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Zabudol som na $a^2$.");
  await page.click('.note.task.editing [data-act="task-res"][data-r="bad"]');
  await page.click('[data-act="note-done"]');
  await wait(150);
  check(await ev(() => /3,5\/5/.test(document.querySelector("#tTests .tt-score").innerText) && /70 %/.test(document.querySelector("#tTests .tt-p").innerText)), "a task with a note marked ✗: 3,5/5, 70 %");
  await page.click('#tTests .task-chip [data-act="task-res"][data-r="ok"][aria-pressed="true"]');
  await wait(100);
  check(await ev(() => /2,5\/5/.test(document.querySelector("#tTests .tt-score").innerText) && /1 bez známky/.test(document.querySelector("#tTests .tt-meta").innerText)), "clearing a mark: 2,5/5, '1 bez známky'");
  await page.click('#tTests .task-chip.r-no [data-act="task-res"][data-r="ok"]');
  await page.click('[data-act="test-done"]');
  await wait(200);
  check(await ev(() => state.notes.a5.length === 5 && state.notes.a5.every(n => n.test) && !ui.testEdit && scoreTxt("a5", state.tests.a5[0]) === "3,5/5"), "five tasks bound to the test, test closed, 3,5/5");
  check(await ev(() => !document.querySelector("#tNotes .note")), "tasks are not listed among the topic's notes");

  await page.goto(BASE + `#/kalendar/t/${d2}/p`);
  await wait(300);
  await page.click(`[data-act="cal-test-pick"][data-d="${d2}"]`);
  await wait(150);
  await page.keyboard.type("kvadraticka rovnica");
  await wait(150);
  await page.keyboard.press("Enter");
  await wait(400);
  const te = await ev(() => ui.testEdit);
  check(te && await ev(([t, x, d]) => findTest(t, x).d === d, [te.t, te.x, d2]), "diary: + Test z témy opens the topic with a test on that day");
  await page.goto(BASE + "#/");
  await wait(200);
  check(await ev(t => !state.tests[t], te.t), "a test left empty is dropped");
  await page.goto(BASE + `#/kalendar/t/${d2}/p`);
  await wait(200);
  await ev(([t, d]) => { const e = addLog(d, "", [{t}]); e.k = "t"; save(); rerenderCal(); }, [te.t, d2]);
  await page.click(`[data-act="cal-test-new"][data-t="${te.t}"]`);
  await wait(300);
  for(let i = 0; i < 6; i++){ await page.keyboard.press("Enter"); await wait(60); }
  for(let i = 0; i < 3; i++){ await page.click('#tTests [data-act="task-quick"][data-r="bad"]'); await wait(60); }
  await page.click('[data-act="test-done"]');
  await wait(200);
  check(await ev(t => { const x = state.tests[t][0]; return scoreTxt(t, x) === "6/9" && !ui.testEdit; }, te.t), "diary row: + test, six ✓ and three ✗ make 6/9");
  await page.goto(BASE + `#/kalendar/t/${d2}/p`);
  await wait(200);
  check(/6\/9/.test(await ev(() => document.querySelector(".cn-tests").innerText)), "the diary day shows the score next to its topic");
  await page.goto(BASE + `#/kalendar/m/${d2}/p`);
  await wait(200);
  check(await ev(() => document.querySelectorAll(".nt-tests .tt-badge").length === 2), "diary month: a score badge on both days");

  await ev(t => { setLevel(t, 3); save(); }, te.t);
  await page.goto(BASE + `#/tema/${te.t}`);
  await wait(200);
  check(/slabšie/.test(await ev(() => document.querySelector("#ttHint").innerText)), "a weak test on a topic at ide to: the hint says so");
  await page.goto(BASE + "#/temy/a");
  await wait(200);
  await page.click('[data-act="filter"][data-f="weak"]');
  check(await ev(t => [...document.querySelectorAll("#list .row")].map(r => r.id).join() === "row-" + t, te.t), "topic list: Slabý test lists only that topic");

  const nid = await ev(() => state.notes.a5[0].id), xid = await ev(() => state.tests.a5[0].id);
  await page.goto(BASE + "#/tema/a5");
  await wait(200);
  await page.click(`[data-act="test-fold"][data-x="${xid}"]`);
  await page.goto(BASE + `#/tema/a5/n/${nid}`);
  await wait(300);
  check(await ev(n => { const el = document.getElementById("note-" + n); return !!el && el.offsetParent !== null; }, nid), "a link to a task opens its folded test");
  await page.keyboard.press("/");
  await page.keyboard.type("zabudol");
  await wait(200);
  check(/úloha z testu/.test(await ev(() => document.querySelector(".pal-list").innerText)), "quick search finds a task and names its test");
  await page.keyboard.press("Escape");

  const plan = await ev(t => {
    const def = planStarter(), d = isoOf(Date.now() - 2 * 86400000);
    def.start = def.weeks[0].from = d;
    def.weeks[0].items.push({id:"opak:" + t, sessions:0.5, name:"Opakovanie"});
    state.plan.def = def; state.plan.at = Date.now(); save(); ensurePlan();
    return {rev: planStatus(PLAN_ITEMS.find(x => x.id === "opak:" + t)), ai: planAiText()};
  }, te.t);
  check(plan.rev === 2, "a scored test that week counts as the plan's review of the topic");
  check(/Testy z tém \(môj posledný test z témy\): .*6\/9/.test(plan.ai) && /na zopakovanie: /.test(plan.ai), "the text for an AI lists topic tests and weak topics");

  await page.goto(BASE + "#/tema/a5");
  await wait(200);
  await page.click(`[data-act="test-del"][data-x="${xid}"]`);
  check(await ev(() => !state.tests.a5 && !state.notes.a5), "deleting a test deletes its tasks");
  await page.click('[data-act="toast-undo"]');
  check(await ev(() => state.tests.a5.length === 1 && state.notes.a5.length === 5), "undo brings both back");
  await page.reload();
  await wait(500);
  check(await ev(() => scoreTxt("a5", state.tests.a5[0]) === "3,5/5"), "kept after reload");
  /* a score typed by hand in the first version stays until it is switched to the tasks */
  await ev(() => { const x = addTest("a7", todayIso()); updateTest("a7", x.id, {s:8, m:10}); const n = addNote("a7", "", x.id); n.res = "bad"; save(); });
  await page.goto(BASE + "#/tema/a7");
  await wait(250);
  check(await ev(() => /8\/10/.test(document.querySelector("#tTests .tt-score").innerText) && /ručne/.test(document.querySelector("#tTests .tt-meta").innerText)), "a hand-typed score from before is kept and said to be typed by hand");
  await page.click('#tTests [data-act="test-edit"]');
  await page.click('[data-act="test-hand-off"]');
  await wait(150);
  check(await ev(() => scoreTxt("a7", state.tests.a7[0]) === "0/1"), "'Počítať z úloh' counts it from the tasks");
  await ev(() => { removeTest("a7", state.tests.a7[0].id); ui.testEdit = null; save(); });
  const dump = await ev(() => JSON.stringify(state));
  await ev(d => { state = emptyState(); newEpoch(); save(); importText(d); }, dump);
  await wait(200);
  check(await ev(() => state.tests.a5 && state.notes.a5.every(n => n.test)), "a backup brings the tests back");
  const other = await ctx.newPage();
  await other.goto(BASE + "#/");
  await other.waitForTimeout(400);
  await other.evaluate(() => { const x = addTest("a14", todayIso()); addNote("a14", "", x.id).res = "ok"; save(); });
  await wait(400);
  check(await ev(() => !!state.tests.a14 && !!state.tests.a5 && scoreTxt("a14", state.tests.a14[0]) === "1/1"), "a test added in another tab is merged in, with its task");
  await other.close();

  /* ---------- a zápis from an old session with an AI: preview, added to the progress, undo ---------- */
  await ev(() => {
    const a = addNote("a12"); Object.assign(a, {title:"Test z nerovníc", body:"8/10, chyba v úlohe 3"});
    const b = addNote("a12"); Object.assign(b, {title:"Vzorce na nerovnice", body:"…", lv:2});
    const c = addNote("a12"); Object.assign(c, {title:"A1: zlomok", body:"postup A1"});
    const e = addNote("a12"); Object.assign(e, {title:"A2: Definičný obor", body:"postup A2"});
    setSubLevel("a12", subsOf("a12")[0].k, 4);      /* rated today: newer than the session */
    save();
  });
  const a1 = await ev(() => topicNotes("a12").find(n => n.title === "A1: zlomok").id);
  const zap = await ev(([d, n14, a1]) => "Zhrnutie: dva testy...\n\n```json\n" + JSON.stringify({format:"maturita-zapis-1", date:d, topics:[
    {topic:"a12", level:"ide to", tests:[{date:d, name:"Zbierka", from_note:"test z nerovnic", tasks:[{res:"ok", note:a1}, {res:"✓"}, {res:"part", note:"mvs31wtcib58", title:"A2: Definičný obor"}, {res:"bad", title:"Úloha 4", text:"$\\frac{1}{2}$"}, {res:"bad", note:"mvs3262ojk50"}, {res:"ok", title:"vzorce na nerovnice"}]}],
      notes:[{note:a1, level:4}, {note:"mvs322zkf8ft", level:2}]},
    {topic:n14, level:"slabo"},
    {topic:"Téma, ktorá nie je", level:2}]}, null, 2) + "\n```\nHotovo.", [d2, await ev(() => BY_ID.a14.n), a1]);
  const before = await ev(() => JSON.stringify(state));
  await page.goto(BASE + "#/info");
  await wait(250);
  await page.click('[data-act="import-toggle"]');
  await page.fill("#importArea", '{"format":"niečo iné", "slv":{}}');
  await page.click('[data-act="import"]');
  await wait(100);
  check(await ev(b => JSON.stringify(state) === b, before), "a text with another format never replaces the progress");
  await page.fill("#importArea", zap);
  await page.click('[data-act="import"]');
  await wait(150);
  const prev = await ev(() => document.querySelector("#zapisCheck").innerText);
  check(/3,5\/6/.test(prev) && /zmaže/.test(prev) && /3 poznámky sa presunú/.test(prev) && /Téma, ktorá nie je/.test(prev) && /neskôr/.test(prev) && /ide to/.test(prev), "zápis: the preview lists the test (3,5/6), the three notes moved into it (one found by its title when its id is wrong, one given by its title only), the note it replaces, an unknown topic and a newer rating");
  check(/1 poznámka k úlohe sa v appke nenašla \(„mvs3262ojk50“\), úloha sa zapíše nová/.test(prev) && /1 poznámka na nové hodnotenie sa v appke nenašla \(„mvs322zkf8ft“\)/.test(prev) && !/mvs31/.test(prev), "zápis: ids the app does not have are listed once per topic; a wrong id with the right title is found");
  check(await ev(b => JSON.stringify(state) === b, before), "zápis: the preview changes nothing");
  await page.click('[data-act="zapis-apply"]');
  await wait(200);
  check(await ev(d => {
    const x = (state.tests.a12 || [])[0], subs = subsOf("a12");
    const tasks = testTasks("a12", x ? x.id : "");
    return !!x && x.d === d && x.n === "Zbierka" && scoreTxt("a12", x) === "3,5/6" && tasks.some(n => n.title === "Vzorce na nerovnice" && n.res === "ok" && n.body === "…") && tasks.filter(n => n.res === "bad" && !n.title).length === 1 && !tasks.some(n => /mvs/.test(n.title))
      && tasks.some(n => n.title === "A1: zlomok" && n.body === "postup A1" && n.res === "ok") && tasks.some(n => n.title === "A2: Definičný obor" && n.res === "part")
      && !topicNotes("a12").some(n => /^A[12]:/.test(n.title))
      && !topicNotes("a12").some(n => n.title === "Test z nerovníc") 
      && subLv("a12", subs[0].k) === 4 && subs.slice(1).every(y => subLv("a12", y.k) === 3 && isoOf(state.slvAt["a12/" + y.k]) === d)
      && subsOf("a14").every(y => subLv("a14", y.k) === 2) && !!state.tests.a5;
  }, d2), "zápis added: the test with its tasks (two of them the session's notes, text kept), the old note gone, levels as of that day (a newer one kept), the note re-rated, the rest untouched");
  await page.goto(BASE + "#/info");
  await wait(200);
  await page.click('[data-act="import-toggle"]');
  await page.fill("#importArea", zap);
  await page.click('[data-act="import"]');
  await wait(150);
  check(/už v appke je/.test(await ev(() => document.querySelector("#zapisCheck").innerText)), "the same zápis again: the test is not added twice");
  await page.click('[data-act="zapis-cancel"]');
  await ev(b => { state = migrate(JSON.parse(b)); newEpoch(); save(); render(); }, before);
  await wait(150);
  await page.click('[data-act="import-toggle"]');
  await page.fill("#importArea", zap);
  await page.click('[data-act="import"]');
  await wait(150);
  await page.click('[data-act="zapis-apply"]');
  await wait(150);
  await page.click('[data-act="toast-undo"]');
  await wait(150);
  check(await ev(() => !state.tests.a12 && topicNotes("a12").some(n => n.title === "Test z nerovníc") && topicNotes("a12").some(n => n.title === "A1: zlomok")), "Späť takes the whole zápis back");

  /* ---------- the layout of 2026-11-26: overview, Stav plánu, the diary's grid, Nastavenia ---------- */
  await page.goto(BASE + "#/");
  await wait(250);
  check(await ev(() => document.querySelectorAll("#blocks .cell").length === 30 && !document.querySelector("#scopeCard") && !document.querySelector("#milestones")),
    "overview: the estimate as 30 boxes of the test; scope and milestones are not here");
  check(await ev(() => document.querySelectorAll("#testsCard .tc-list li").length === 3 && document.querySelectorAll("#testsCard .tc-weak li").length <= 3), "overview: Testy z tém shows the 3 latest, at most 3 to go over");
  await page.goto(BASE + "#/kalendar/s");
  await wait(250);
  check(await ev(() => !!document.querySelector("#planCard") && !!document.querySelector("#scopeCard h2") && document.querySelectorAll(".fit-row").length === 3 && !!document.querySelector("#milestones")),
    "Stav plánu: scope with the three Zmestí sa? bars, the plan card and the milestones");
  await page.click('.fit-row[data-k="min"]');
  await wait(150);
  check(await ev(() => ecScope() === "min" && document.querySelector('.fit-row.on').dataset.k === "min"), "Stav plánu: a bar switches the scope");
  await ev(() => { state.prefs.scope = "all"; save(); render(); });
  await page.goto(BASE + `#/kalendar/g/${d2}/p`);
  await wait(250);
  check(await ev(() => document.querySelectorAll(".hm-cell[data-act]").length > 100 && !!document.querySelector(".hm-cell.today")), "Poznámky → Mriežka: the days as a grid, today marked");
  await page.click(`.hm-cell[data-d="${d2}"]`);
  await wait(200);
  check(await ev(d => location.hash === `#/kalendar/t/${d}/p`, d2), "a day of the grid opens its week with notes");
  await page.goto(BASE + "#/info");
  await wait(200);
  check(await ev(() => document.body.dataset.view === "nastavenia" && !!document.querySelector(".gear-btn[aria-current]") && !document.querySelector("#planCard")), "old #/info links open Nastavenia (no plan card there)");
  await page.click('[data-act="import-toggle"]');
  await page.fill("#importArea", await ev(() => "Tu je plán:\n" + JSON.stringify(planDef())));
  await page.click('[data-act="import"]');
  await wait(300);
  check(await ev(() => location.hash === "#/kalendar/s" && !document.querySelector("#planBox").hidden), "a plan pasted in Nastavenia opens in Stav plánu");

  /* ---------- every page, both widths ---------- */
  const pages = ["#/", "#/temy/a", "#/tema/a5", `#/tema/a5/t/${xid}`, "#/kalendar/m", "#/kalendar/t", `#/kalendar/m/${d2}/p`, `#/kalendar/t/${d2}/p`, `#/kalendar/g/${d2}/p`, "#/kalendar/s", "#/nastavenia"];
  for(const w of [1280, 400]){
    await page.setViewportSize({ width: w, height: 880 });
    for(const h of pages){
      errs.length = 0;
      await page.goto(BASE + h);
      await wait(350);
      const over = await ev(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(over <= 0 && !errs.length, `${String(w).padStart(4)}px ${h}${over > 0 ? ` scrolls sideways by ${over}px` : ""}${errs.length ? " console: " + errs.slice(0, 2).join(" | ") : ""}`);
      if(SHOTS) await page.screenshot({ path: path.join(SHOTS, `app-${w}${h.replace(/[#\/]+/g, "_")}.png`), fullPage: true });
    }
  }
  if(errs.length) check(false, "console: " + errs.slice(0, 3).join(" | "));
  await browser.close();
  console.log(bad ? `${bad} problem(s)` : "all ok");
  process.exit(bad ? 1 : 0);
})();

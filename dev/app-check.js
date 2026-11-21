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

  /* ---------- every page, both widths ---------- */
  const pages = ["#/", "#/temy/a", "#/tema/a5", `#/tema/a5/t/${xid}`, "#/kalendar/m", "#/kalendar/t", `#/kalendar/m/${d2}/p`, `#/kalendar/t/${d2}/p`, "#/info"];
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

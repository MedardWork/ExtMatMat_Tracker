// Opens theory pages in a real browser and reports what is broken.
//   node dev/check.js a21 a22          check these topics (a tool's name, e.g. graf, checks its Nástroje page)
//   node dev/check.js                  check every topic in THEORY_LIST, plus the Nástroje pages
//   SHOTS=/some/dir node dev/check.js a21     also save a picture of every tool there (SHOTW=400: at the narrow width)
//   A tool's own page is checked with every prepared example; SHOTS saves them as <tool>-p<i>.png
// Needs Playwright (preinstalled in Claude cloud sessions; elsewhere: npm i -D playwright).
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const SHOTW = Number(process.env.SHOTW) || 1280;
const BASE ="file://" + path.resolve(__dirname, "..", "maturita-matematika-tracker.html");

(async () => {
  let ids = process.argv.slice(2);
  const all = !ids.length;
  if (all) ids = eval(fs.readFileSync(path.resolve(__dirname, "../js/data/theory/index.js"), "utf8") + ";THEORY_LIST");
  const pages = ids.map(id => [id, `#/tema/${id}/teoria`]);
  const tools = fs.readdirSync(path.resolve(__dirname, "../js/tools")).map(f => f.replace(".js", "")).filter(t => t !== "core");
  for (const t of ids.filter(id => tools.includes(id))) pages[ids.indexOf(t)] = [t, `#/nastroje/${t}`];   // a tool's name checks its own page
  if (all) pages.push(["nastroje", "#/nastroje"], ...tools.map(t => [t, `#/nastroje/${t}`]));
  const browser = await chromium.launch();
  let bad = 0;
  for (const width of [1280, 400]) {
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    const errs = [];
    page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
    page.on("pageerror", e => errs.push(e.message + " | " + (e.stack || "").split("\n")[1]));
    for (const [name, hash] of pages) {
      errs.length = 0;
      await page.goto(BASE + hash);
      await page.waitForTimeout(1300);
      const r = await page.evaluate(() => ({
        tools: document.querySelectorAll(".tw[data-on]").length,
        failed: document.querySelectorAll(".tw-fail").length,
        tex: document.querySelectorAll(".katex-error, .tex-raw").length, texs: [...document.querySelectorAll(".katex-error, .tex-raw")].map(e => (e.getAttribute("title") || "") + " | " + e.textContent.slice(0, 120)),
        nan: [...document.querySelectorAll(".tw-out")].filter(e => /NaN|undefined|—/.test(e.innerText)).length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        empty: !!document.querySelector(".th-empty")
      }));
      const problems = [];
      if (r.empty) problems.push("no theory rendered");
      if (r.failed) problems.push(r.failed + " tool(s) failed to mount");
      if (r.tex) problems.push(r.tex + " formula error(s): " + r.texs.join(" ;; "));
      if (r.nan) problems.push(r.nan + " readout(s) show NaN/undefined/—");
      if (r.overflow > 0) problems.push("page scrolls sideways by " + r.overflow + "px");
      if (errs.length) problems.push("console: " + errs.slice(0, 3).join(" || "));
      bad += problems.length;
      console.log(`${problems.length ? "FAIL" : "ok  "} ${name.padEnd(12)} ${String(width).padStart(4)}px  ${r.tools} tools${problems.length ? "\n     " + problems.join("\n     ") : ""}`);
      // on a tool's own page: walk through every prepared example as well
      const chips = hash.startsWith("#/nastroje/") ? await page.$$(".tool-presets .chip[data-i]") : [];
      for (let i = 1; i < chips.length; i++) {
        errs.length = 0;
        await (await page.$$(".tool-presets .chip[data-i]"))[i].click();
        await page.waitForTimeout(350);
        const q = await page.evaluate(() => ({
          failed: document.querySelectorAll(".tw-fail").length,
          tex: [...document.querySelectorAll(".katex-error, .tex-raw")].map(e => (e.getAttribute("title") || "") + " | " + e.textContent.slice(0, 120)),
          nan: [...document.querySelectorAll(".tw-out, .tw-svg")].filter(e => /NaN|undefined/.test(e.innerHTML)).length,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        const pp = [];
        if (q.failed) pp.push("failed to mount");
        if (q.tex.length) pp.push("formula error(s): " + q.tex.join(" ;; "));
        if (q.nan) pp.push("NaN/undefined in the output");
        if (q.overflow > 0) pp.push("scrolls sideways by " + q.overflow + "px");
        if (errs.length) pp.push("console: " + errs.slice(0, 2).join(" || "));
        if (pp.length) { bad += pp.length; console.log("FAIL " + name + " preset " + i + "  " + width + "px\n     " + pp.join("\n     ")); }
        if (process.env.SHOTS && width === SHOTW) await (await page.$(".tw-full")).screenshot({ path: path.join(process.env.SHOTS, name + "-p" + i + ".png") });
      }
      if (chips.length > 1) { await (await page.$$(".tool-presets .chip[data-i]"))[0].click(); await page.waitForTimeout(250); }
      if (process.env.SHOTS && width === SHOTW) {
        const els = await page.$$(".tw:not(.tw-thumb):not(.tw-bare)");
        for (let i = 0; i < els.length; i++) {
          await els[i].scrollIntoViewIfNeeded();
          await els[i].screenshot({ path: path.join(process.env.SHOTS, `${name}-${String(i).padStart(2, "0")}.png`) });
        }
      }
    }
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();

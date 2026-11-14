// Lists formula boxes ({def}) with a relation too wide for the box (it would scroll sideways).
// Relations split by \qquad are set unbroken and wrap as wholes (defParts in js/theory.js).
//   node dev/defwrap.js [ids…]      (all theory topics when no id is given; checks 1280, 900 and 400 px)
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const BASE = "file://" + path.resolve(__dirname, "..", "maturita-matematika-tracker.html");
(async () => {
  let ids = process.argv.slice(2);
  if (!ids.length) ids = eval(fs.readFileSync(path.resolve(__dirname, "../js/data/theory/index.js"), "utf8") + ";THEORY_LIST");
  const browser = await chromium.launch();
  for (const width of [1280, 900, 400]) {
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    for (const id of ids) {
      await page.goto(BASE + `#/tema/${id}/teoria`);
      await page.waitForTimeout(900);
      const bad = await page.evaluate(() => [...document.querySelectorAll(".th-def")].map(d => {
        const over = [...d.querySelectorAll(".th-def-p")].some(p => p.scrollWidth > p.clientWidth + 3);
        return over ? (d.querySelector(".th-label") || d).textContent.trim().slice(0, 40) : null;
      }).filter(Boolean));
      bad.forEach(t => console.log(`${width}\t${id}\t${t}`));
    }
  }
  await browser.close();
})();

// Puts the pictures saved by SHOTS=<dir> node dev/check.js … side by side into one image, so many
// tools can be looked at in one go.
//   node dev/tile.js <dir> [filter] [columns]      → <dir>/_all.png   (filter: start of the file names)
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const filter = process.argv[3] || "", cols = Number(process.argv[4]) || 3;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".png") && f !== "_all.png" && f.startsWith(filter)).sort();
  if (!files.length) { console.log("no pictures in " + dir); return; }
  const html = `<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px;font:12px sans-serif">`
    + files.map(f => `<div style="background:#fff"><div style="padding:2px 6px">${f}</div><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString("base64")}" style="width:100%;display:block"></div>`).join("") + "</body>";
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 620 * cols, height: 800 } })).newPage();
  await page.setContent(html);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(dir, "_all.png"), fullPage: true });
  await browser.close();
  console.log(files.length + " pictures → " + path.join(dir, "_all.png"));
})();

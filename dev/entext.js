// Lists Slovak words that tools print on the English (Danish c…) theory pages.
//   node dev/entext.js c1 c2      checks these topics; prints "ok" or the words with the tool's number
// Looks at what the tools themselves write (sliders, notes, output, pictures), not at the app's own frame.
const { chromium } = require("playwright");
const path = require("path");
const BASE = "file://" + path.resolve(__dirname, "..", "maturita-matematika-tracker.html");
const SK = /[A-Za-z]*[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ][A-Za-záäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]*/g;

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  for (const id of process.argv.slice(2)) {
    await page.goto(BASE + `#/tema/${id}/teoria`);
    await page.waitForTimeout(1500);
    const found = await page.evaluate(sk => {
      const re = new RegExp(sk, "g"), out = [];
      document.querySelectorAll(".tw:not(.tw-thumb)").forEach((tw, i) => {
        const parts = [...tw.querySelectorAll(".tw-ctl, .tw-out, .tw-inputs, svg text, .JXGtext, .tw-hint")].map(e => e.textContent).join(" ");
        const words = [...new Set(parts.replace(/Nápoveď/g, " ").match(re) || [])];
        if (words.length) out.push(`tool ${i + 1}: ${words.join(", ")}`);
      });
      return out;
    }, SK.source);
    console.log(found.length ? `${id}\n  ` + found.join("\n  ") : `ok   ${id}`);
  }
  await browser.close();
})();

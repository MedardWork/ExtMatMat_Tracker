// Starts the real desktop app (Electron) and checks what dev/check.js cannot see, because that one opens the
// page from file://: the app:// scheme, the Content-Security-Policy of server/app.js, saving to the database,
// export to a file, the clipboard, links to other sites, reload and closing the window.
//   npm ci                                    (once; Electron is a dev dependency)
//   xvfb-run -a node dev/desktop-check.js     (Linux without a screen; elsewhere without xvfb-run)
//   node dev/desktop-check.js quick           only a few pages instead of every tool with every example
// Needs Playwright (preinstalled in Claude cloud sessions; elsewhere: npm i -D playwright).
const { _electron } = require("playwright");
const path = require("path");
const fs = require("fs");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const quick = process.argv[2] === "quick";

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "maturita-check-"));
  let bad = 0;
  const report = (ok, name, more) => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}${more ? "\n     " + more : ""}`); };

  const launch = () => _electron.launch({ executablePath: require(path.join(ROOT, "node_modules/electron")), cwd: ROOT, args: [".", "--no-sandbox"], env: { ...process.env, MATURITA_DATA_DIR: dir, MATURITA_SMOKE: "" } });
  let app = await launch();
  let page = await app.firstWindow();
  const errs = [];
  const listen = p => {
    // JSXGraph reports a string it could not compile with console.log, the browser a blocked resource with console.error
    p.on("console", m => { if (m.type() === "error" || /error compiling|EvalError|Content Security Policy/i.test(m.text())) errs.push(m.text().replace(/\s+/g, " ").slice(0, 200)); });
    p.on("pageerror", e => errs.push(e.message));
    p.on("dialog", d => d.accept());
  };
  listen(page);
  await page.waitForSelector("a[href^='#/']");
  await page.waitForTimeout(800);

  /* ---------- every kind of page: nothing blocked, nothing failed ---------- */
  const tools = fs.readdirSync(path.join(ROOT, "js/tools")).map(f => f.replace(".js", "")).filter(t => t !== "core");
  const hashes = ["#/", "#/temy/a", "#/temy/c", "#/tema/a22", "#/dennik", "#/info", "#/nastroje",
    ...(quick ? ["a22", "b9", "c5"] : ["a1", "a22", "a28", "b9", "b20", "b28", "b31", "b40", "c5", "c10", "c15", "c23", "c27", "c33"]).map(t => `#/tema/${t}/teoria`),
    ...(quick ? ["graf", "derivacia", "kocka"] : tools).map(t => `#/nastroje/${t}`)];
  for (const hash of hashes) {
    errs.length = 0;
    await page.evaluate(h => { location.hash = h; }, hash);
    await page.waitForTimeout(hash.includes("teoria") ? 1800 : 900);
    const probe = () => page.evaluate(() => ({
      tools: document.querySelectorAll(".tw[data-on]").length,
      failed: document.querySelectorAll(".tw-fail").length,
      tex: document.querySelectorAll(".katex-error, .tex-raw").length,
      text: document.body.innerText.length
    }));
    const problems = [];
    const look = (r, tag) => {
      if (r.failed) problems.push(`${tag}${r.failed} tool(s) failed to mount`);
      if (r.tex) problems.push(`${tag}${r.tex} formula error(s)`);
      if (r.text < 200) problems.push(`${tag}page is empty`);
    };
    look(await probe(), "");
    if (hash.startsWith("#/nastroje/")) {
      const n = await page.locator(".tool-presets .chip[data-i]").count();
      for (let i = 0; i < n; i++) {
        await page.locator(".tool-presets .chip[data-i]").nth(i).click();
        await page.waitForTimeout(350);
        look(await probe(), `example ${i + 1}: `);
      }
    }
    if (errs.length) problems.push("console: " + [...new Set(errs)].slice(0, 3).join(" || "));
    report(!problems.length, hash, problems.join("\n     "));
  }

  /* ---------- saving: a click reaches the database and survives a reload ---------- */
  errs.length = 0;
  const rev = () => page.evaluate(() => fetch("api/state", { cache: "no-store" }).then(r => r.json()).then(j => j.rev));
  const rev0 = await rev();
  await page.evaluate(() => { location.hash = "#/temy/a"; });
  await page.waitForSelector('[data-act="rel"]');
  const id = await page.locator('[data-act="rel"]').first().getAttribute("data-id");
  await page.locator('[data-act="rel"]').first().click();
  await page.evaluate(() => window.flushSave());
  const rev1 = await rev();
  report(rev1 > rev0, "a change is saved to the database", `rev ${rev0} -> ${rev1}`);
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.reload());
  await page.waitForTimeout(1500);
  await page.waitForSelector("a[href^='#/']");
  const kept = await page.evaluate(i => fetch("api/state").then(r => r.json()).then(j => JSON.stringify(j.state).includes(i)), id);
  report(kept && (await rev()) === rev1, "the change is still there after a reload (Zobraziť -> Obnoviť)");

  /* ---------- export: file, clipboard ---------- */
  const file = path.join(dir, "export.json");
  await app.evaluate(({ session }, f) => {
    global.__dl = "none";
    session.defaultSession.on("will-download", (e, item) => { item.setSavePath(f); item.once("done", (e2, state) => { global.__dl = state; }); });
  }, file);
  await page.evaluate(() => { location.hash = "#/info"; });
  await page.locator('[data-act="download"]').first().click();
  await page.waitForTimeout(1500);
  let exported = null;
  try { exported = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) {}
  report(!!exported && await app.evaluate(() => global.__dl) === "completed", "Stiahnuť ako súbor writes the backup", exported ? "" : "no file was saved");

  await app.evaluate(({ clipboard }) => clipboard.writeText("empty"));
  await page.locator('[data-act="export"]').first().click();
  await page.waitForTimeout(700);
  const clip = await app.evaluate(({ clipboard }) => clipboard.readText());
  report(clip.trim().startsWith("{"), "copying the backup reaches the clipboard", clip.slice(0, 60));

  const chooser = page.waitForEvent("filechooser", { timeout: 4000 }).catch(() => null);
  await page.locator('[data-act="import-file"]').first().click();
  const fc = await chooser;
  if (fc && exported) {
    await fc.setFiles(file);
    await page.waitForTimeout(800);
    await page.evaluate(() => window.flushSave());
  }
  report(!!fc && (await rev()) > rev1, "import from a file opens the file dialog and loads the backup");

  /* ---------- links to other sites go to the normal browser, the app stays where it is ---------- */
  await app.evaluate(({ shell }) => { global.__opened = []; shell.openExternal = async u => { global.__opened.push(u); }; });
  await page.evaluate(() => {
    document.body.insertAdjacentHTML("beforeend", '<a id="lnkA" href="https://example.com/a" target="_blank" rel="noopener">a</a><a id="lnkB" href="https://example.com/b">b</a>');
    document.getElementById("lnkA").click();
    document.getElementById("lnkB").click();
  });
  await page.waitForTimeout(700);
  const opened = await app.evaluate(() => global.__opened);
  const here = page.url();
  report(opened.length === 2 && here.startsWith("app://tracker/"), "links to other sites open outside the app", `opened ${JSON.stringify(opened)}, page ${here}`);

  /* ---------- theme is remembered (localStorage on app://) ---------- */
  const stored = await page.evaluate(() => { try { localStorage.setItem("maturita-probe", "1"); return localStorage.getItem("maturita-probe"); } catch (e) { return String(e); } });
  report(stored === "1", "localStorage works", stored);
  report(!errs.length, "no errors during these steps", [...new Set(errs)].slice(0, 4).join(" || "));

  /* ---------- closing the window saves and ends the app; the next start finds the data ---------- */
  await page.evaluate(() => { location.hash = "#/temy/a"; });
  await page.waitForSelector('[data-act="rel"]');
  await page.locator('[data-act="rel"]').first().click();   // unsaved at the moment of closing
  const closed = new Promise(res => app.once("close", () => res(true)));
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].close());
  const done = await Promise.race([closed, new Promise(res => setTimeout(() => res(false), 9000))]);
  report(done, process.platform === "darwin" ? "closing the window (macOS keeps the app running)" : "closing the window ends the app");
  if (!done) await app.close().catch(() => {});

  app = await launch();
  page = await app.firstWindow();
  listen(page);
  await page.waitForSelector("a[href^='#/']");
  const rev3 = await page.evaluate(() => fetch("api/state").then(r => r.json()).then(j => j.rev));
  report(rev3 > rev1 + 1, "what was changed just before closing is in the database at the next start", `rev ${rev3}`);
  await app.close().catch(() => {});

  console.log(bad ? `\n${bad} problem(s)` : "\nall fine");
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

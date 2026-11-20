/* Drives the desktop app (desktop/update.js) against a fake release server on port 8765:
   update, restart, "Vrátiť nainštalovanú verziu", no re-pull, another shell, bad checksum.
     npm ci && xvfb-run -a node dev/update-check.js      (read the printed lines: mark A only in the first two) */
const {_electron} = require("playwright");
const http = require("node:http"), fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), crypto = require("node:crypto");
const REPO = path.resolve(__dirname, "..");
const {ROOT, pageFiles, shellId} = require(REPO + "/server/webfiles");
const T = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "upd-"));

function pack(version, shell, mark){
  const files = {};
  for(const rel of pageFiles()){
    let b = fs.readFileSync(path.join(ROOT, rel));
    if(rel === "maturita-matematika-tracker.html") b = Buffer.from(b.toString().replace("<head>", `<head><meta name="upd" content="${mark}">`));
    files[rel] = b.toString("base64");
  }
  files["../evil.txt"] = Buffer.from("x").toString("base64");          /* must be ignored */
  files["js/data/plan.js"] = Buffer.from("const PLAN_DEFAULT = 'HACK';").toString("base64"); /* must be ignored */
  const buf = zlib.gzipSync(JSON.stringify({version, shell, files}));
  return {buf, meta:{version, shell, file:`Maturita-${version}-web.json.gz`, size:buf.length, sha256:crypto.createHash("sha256").update(buf).digest("hex")}};
}
let rel = pack("9.0.0", shellId(), "A");
const srv = http.createServer((q, r) => {
  if(q.url === "/web.json"){ r.setHeader("Content-Type", "application/json"); return r.end(JSON.stringify(rel.meta)); }
  if(q.url === "/" + rel.meta.file) return r.end(rel.buf);
  r.statusCode = 404; r.end();
}).listen(8765);

const env = {...process.env, HOME:T, MATURITA_DATA_DIR:path.join(T, "data"), MATURITA_UPDATE_URL:"http://127.0.0.1:8765"};
delete env.NODE_OPTIONS;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function launch(){
  const app = await _electron.launch({executablePath:REPO + "/node_modules/electron/dist/electron", args:[REPO, "--no-sandbox"], env, cwd:REPO});
  await app.evaluate(({dialog}) => { global.__boxes = []; dialog.showMessageBox = async (w, o) => { global.__boxes.push((o || w).message); return {response:0}; }; });
  const page = await app.firstWindow(); await page.waitForLoadState("domcontentloaded");
  return {app, page};
}
const state = async page => page.evaluate(async () => ({
  mark:document.querySelector("meta[name=upd]")?.content || "-",
  version:(await fetch("/api/state").then(r => r.json())).version,
  plan:(await fetch("/js/data/plan.js").then(r => r.text())).includes("HACK") ? "HACKED" : "installed"
}));
const boxes = app => app.evaluate(() => global.__boxes);
const ud = () => { const d = fs.readdirSync(path.join(T, ".config")).map(x => path.join(T, ".config", x, "web")).find(fs.existsSync); return d ? fs.readdirSync(d).sort().join(",") : "(none)"; };

(async () => {
  let {app, page} = await launch();
  console.log("start      ", await state(page));
  await sleep(8000); await page.waitForLoadState("domcontentloaded"); await sleep(1500);
  console.log("after check", await state(page), await boxes(app), ud());
  console.log("evil file?", fs.existsSync(path.join(T, ".config")) && JSON.stringify(require("child_process").execSync(`find ${T} -name evil.txt`).toString()));
  await app.close();

  ({app, page} = await launch()); await sleep(1500);
  console.log("restart    ", await state(page));
  /* menu: back to the installed version */
  await app.evaluate(({Menu}) => Menu.getApplicationMenu().items.find(i => i.label === "Pomocník").submenu.items.find(i => i.label.startsWith("Vrátiť")).click());
  await sleep(2500);
  console.log("reset      ", await state(page), ud());
  await app.evaluate(({Menu}) => Menu.getApplicationMenu().items.find(i => i.label === "Pomocník").submenu.items.find(i => i.label.startsWith("Verzia")).label).then(l => console.log("menu label ", l));
  await app.close();

  /* restart after reset: the same version is not pulled again */
  ({app, page} = await launch()); await sleep(8000);
  console.log("no re-pull ", await state(page), await boxes(app), ud());
  await app.close();

  /* a release for another shell: only the installer is offered */
  rel = pack("9.1.0", "othershell", "B");
  ({app, page} = await launch()); await sleep(8000);
  console.log("new shell  ", await state(page), await boxes(app), ud());
  await app.close();

  /* bad checksum: nothing applied */
  rel = pack("9.2.0", shellId(), "C"); rel.meta.sha256 = "0".repeat(64);
  ({app, page} = await launch()); await sleep(8000);
  console.log("bad sha    ", await state(page), await boxes(app), ud());
  await app.close();
  srv.close();
})().catch(e => { console.error(e); process.exit(1); });

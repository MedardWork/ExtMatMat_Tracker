/* ============================================================
   UPDATES — new versions of the page (HTML, CSS, JS) without reinstalling the app.
   A release carries web.json ({version, shell, file, size, sha256}) and the file it names,
   Maturita-<version>-web.json.gz = {version, shell, files:{path: base64}} (dev/webbundle.js).
   The app reads <repo>/releases/latest/download/web.json at start and every 6 hours. A newer version
   packed for this very shell (server/webfiles.js shellId) is unpacked to <userData>/web/<version>/
   and server/app.js serves its files instead of the installed ones (the plan always stays installed).
   A release whose shell differs needs the installer: the app then offers the download page once.
   Only one unpacked version is kept; an installer at least as new as it makes it go away.
   No signing key: the files come over HTTPS from the repo's own releases, and the size and SHA-256
   in web.json must match what arrives.
   ============================================================ */
const {app, net, dialog, shell} = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const {updatable, shellId} = require("../server/webfiles");

const REPO = require("../package.json").updateRepo || "MedardWork/ExtMatMat_Tracker";
const BASE = process.env.MATURITA_UPDATE_URL || `https://github.com/${REPO}/releases/latest/download`;
const PAGE = `https://github.com/${REPO}/releases/latest`;
const EVERY = 6 * 3600 * 1000;
const MAX = 40 * 1024 * 1024;

/* "1.10.0" > "1.9.3" */
function cmp(a, b){
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for(let i = 0; i < 3; i++){ const d = (x[i] || 0) - (y[i] || 0); if(d) return d > 0 ? 1 : -1; }
  return 0;
}
const readJson = f => { try{ return JSON.parse(fs.readFileSync(f, "utf8")); }catch(e){ return null; } };
const rm = p => { try{ fs.rmSync(p, {recursive:true, force:true}); }catch(e){} };

function createUpdater({getWindow, beforeReload, onChange = () => {}}){
  const dir = path.join(app.getPath("userData"), "web");
  const curFile = path.join(dir, "current.json");
  const seenFile = path.join(dir, "offered.json");    /* an installer offered once, or a version sent back by "Vrátiť" */
  const SHELL = shellId();
  let active = null, ready = null, busy = false;

  /* at start: the unpacked version, if it is newer than the installed app and made for this shell;
     anything else in the folder goes */
  function pick(){
    const cur = readJson(curFile);
    const ok = cur && cur.shell === SHELL && cmp(cur.version, app.getVersion()) > 0
      && fs.existsSync(path.join(dir, cur.version, "maturita-matematika-tracker.html"));
    active = ok ? {version:cur.version, dir:path.join(dir, cur.version)} : null;
    if(!ok) rm(curFile);
    try{
      for(const e of fs.readdirSync(dir)) if(!["current.json", "offered.json"].includes(e) && !(active && e === active.version)) rm(path.join(dir, e));
    }catch(e){}
  }

  async function get(url, type){
    const r = await net.fetch(url, {cache:"no-store"});
    if(!r.ok) throw new Error(`${r.status} ${url}`);
    return type === "json" ? r.json() : Buffer.from(await r.arrayBuffer());
  }

  const version = () => (ready || active || {}).version || app.getVersion();

  async function unpack(meta){
    const buf = await get(`${BASE}/${encodeURIComponent(meta.file)}`);
    if(buf.length !== meta.size || buf.length > MAX) throw new Error("size does not match");
    if(crypto.createHash("sha256").update(buf).digest("hex") !== meta.sha256) throw new Error("checksum does not match");
    const pack = JSON.parse(zlib.gunzipSync(buf).toString("utf8"));
    if(pack.version !== meta.version || pack.shell !== SHELL || !pack.files || !pack.files["maturita-matematika-tracker.html"]) throw new Error("bad pack");
    const tmp = path.join(dir, `.${meta.version}-${Date.now()}`), dest = path.join(dir, meta.version);
    rm(tmp);
    for(const [rel, b64] of Object.entries(pack.files)){
      if(!updatable(rel)) continue;
      const f = path.join(tmp, rel);
      fs.mkdirSync(path.dirname(f), {recursive:true});
      fs.writeFileSync(f, Buffer.from(b64, "base64"));
    }
    rm(dest);
    fs.renameSync(tmp, dest);
    fs.writeFileSync(curFile, JSON.stringify({version:meta.version, shell:SHELL, at:Date.now()}));
    return {version:meta.version, dir:dest};
  }

  async function check(manual = false){
    if(busy) return;
    busy = true;
    const win = getWindow();
    const box = o => win && !win.isDestroyed() ? dialog.showMessageBox(win, o) : dialog.showMessageBox(o);
    try{
      const meta = await get(`${BASE}/web.json`, "json");
      if(!meta || !meta.version || cmp(meta.version, version()) <= 0){
        if(manual) box({type:"info", message:"Máš najnovšiu verziu.", detail:`Verzia ${version()}`});
        return;
      }
      const seen = readJson(seenFile);
      if(!manual && seen && seen.version === meta.version) return;
      if(meta.shell !== SHELL){
        try{ fs.mkdirSync(dir, {recursive:true}); fs.writeFileSync(seenFile, JSON.stringify({version:meta.version})); }catch(e){}
        const r = await box({type:"info", buttons:["Otvoriť stránku na stiahnutie", "Neskôr"], defaultId:0, cancelId:1,
          message:`Vyšla verzia ${meta.version}.`,
          detail:"Táto verzia mení aj samotnú aplikáciu, preto ju treba raz stiahnuť a nainštalovať. Tvoje dáta zostanú."});
        if(r.response === 0) shell.openExternal(PAGE);
        return;
      }
      fs.mkdirSync(dir, {recursive:true});
      ready = await unpack(meta);
      const r = await box({type:"info", buttons:["Načítať teraz", "Pri ďalšom spustení"], defaultId:0, cancelId:1,
        message:`Nová verzia ${meta.version} je pripravená.`,
        detail:"Stiahli sa len zmenené súbory aplikácie. Tvoje dáta zostanú."});
      if(r.response === 0) await use();
    }catch(e){
      console.error("update:", e.message);
      if(manual) box({type:"warning", message:"Aktualizáciu sa nepodarilo skontrolovať.", detail:e.message});
    }finally{ busy = false; }
  }

  /* switch to the unpacked version now: let the page save, then load it again */
  async function use(){
    if(!ready) return;
    const old = active;
    active = ready; ready = null;
    if(old && old.dir !== active.dir) rm(old.dir);
    await beforeReload();
    const win = getWindow();
    if(win && !win.isDestroyed()) win.webContents.reloadIgnoringCache();
    onChange();
  }

  /* back to the files of the installed app */
  async function reset(){
    const v = (active || ready || {}).version;
    rm(dir); active = null; ready = null;
    if(v) try{ fs.mkdirSync(dir, {recursive:true}); fs.writeFileSync(seenFile, JSON.stringify({version:v})); }catch(e){}
    await beforeReload();
    const win = getWindow();
    if(win && !win.isDestroyed()) win.webContents.reloadIgnoringCache();
    onChange();
  }

  function start(){
    if(process.env.MATURITA_NO_UPDATE || process.env.MATURITA_SMOKE) return;
    if(!app.isPackaged && !process.env.MATURITA_UPDATE_URL) return;
    setTimeout(() => check(false), 5000);
    setInterval(() => check(false), EVERY).unref?.();
  }

  pick();
  return {web:() => active, version, check, reset, start, shell:SHELL, isUpdated:() => !!active};
}

module.exports = {createUpdater, cmp};

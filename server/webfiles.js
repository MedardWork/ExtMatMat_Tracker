/* ============================================================
   WEB FILES — which files make up the page, and the id of the app shell that serves them.
   Shared by the server (server/app.js), the desktop updater (desktop/update.js) and the script that
   packs a release's page files (dev/webbundle.js). No Electron here: plain Node only.
   ============================================================ */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "..");

/* only the tracker itself is served — not the database, node_modules or anything else in the folder */
const PUBLIC = /^(index\.html|maturita-matematika-tracker\.html|(css|js|vendor)\/[\w./-]+)$/;

/* the study plan always comes from the installed app: the private build carries the person's own plan,
   the public one none, and an update packed from either must not swap it */
const KEEP_INSTALLED = new Set(["js/data/plan.js"]);

const servable = rel => PUBLIC.test(rel) && !rel.split("/").includes("..");
const updatable = rel => servable(rel) && !KEEP_INSTALLED.has(rel);

function walk(root, dir, out){
  for(const e of fs.readdirSync(path.join(root, dir), {withFileTypes:true})){
    const rel = dir ? `${dir}/${e.name}` : e.name;
    if(e.isDirectory()) walk(root, rel, out);
    else if(e.isFile()) out.push(rel);
  }
  return out;
}

/* every file of the page that an update may replace, sorted */
function pageFiles(root = ROOT){
  const out = ["index.html", "maturita-matematika-tracker.html"].filter(f => fs.existsSync(path.join(root, f)));
  for(const d of ["css", "js", "vendor"]) if(fs.existsSync(path.join(root, d))) walk(root, d, out);
  return out.filter(updatable).sort();
}

/* the shell = the code that serves the page and runs the window (server/, desktop/). An update of the
   page files is applied only by a shell with the same id; a changed shell needs the installer.
   Line endings are ignored, so a Windows checkout (CRLF) gets the same id as the Linux one. */
function shellId(root = ROOT){
  const h = crypto.createHash("sha256");
  for(const d of ["server", "desktop"]){
    const dir = path.join(root, d);
    if(!fs.existsSync(dir)) continue;
    for(const rel of walk(root, d, []).filter(f => f.endsWith(".js")).sort()){
      h.update(rel + "\n");
      h.update(fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n"));
      h.update("\n");
    }
  }
  return h.digest("hex").slice(0, 16);
}

module.exports = {ROOT, PUBLIC, servable, updatable, pageFiles, shellId};

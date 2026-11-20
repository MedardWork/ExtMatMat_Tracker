/* Packs the page files of this checkout for the desktop app's updates (desktop/update.js):
     node dev/webbundle.js <out dir>
   writes <out>/Maturita-<version>-web.json.gz ({version, shell, files:{path: base64}}) and
   <out>/web.json ({version, shell, file, size, sha256}). The release workflow attaches both. */
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const {ROOT, pageFiles, shellId} = require("../server/webfiles");

const out = path.resolve(process.argv[2] || "dist");
const version = require("../package.json").version;
const shell = shellId();
const files = {};
for(const rel of pageFiles()) files[rel] = fs.readFileSync(path.join(ROOT, rel)).toString("base64");
const buf = zlib.gzipSync(JSON.stringify({version, shell, files}), {level:9});
const file = `Maturita-${version}-web.json.gz`;
fs.mkdirSync(out, {recursive:true});
fs.writeFileSync(path.join(out, file), buf);
const meta = {version, shell, file, size:buf.length, sha256:crypto.createHash("sha256").update(buf).digest("hex")};
fs.writeFileSync(path.join(out, "web.json"), JSON.stringify(meta, null, 1) + "\n");
console.log(`${file}: ${Object.keys(files).length} files, ${(buf.length / 1048576).toFixed(1)} MB, shell ${shell}`);

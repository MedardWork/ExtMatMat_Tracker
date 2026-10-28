/* ============================================================
   APP — serves the tracker's files and the small API it saves through.
   Written against the web-standard Request / Response, so the same handler runs
   behind Node's http server (server/main.js, Docker) and Electron's app:// protocol.
     GET  /api/state            {app, rev, saved, where, state}
     PUT  /api/state            {base, state} → {rev, saved}, or 409 with the newer save to merge
     GET  /api/snapshots        earlier saves, newest first
     GET  /api/snapshots/<id>   one of them
   ============================================================ */
const fs = require("node:fs/promises");
const path = require("node:path");
const net = require("node:net");

const APP_ID = "maturita-tracker";
const ROOT = path.resolve(__dirname, "..");
const MAX_BODY = 50 * 1024 * 1024;

/* only the tracker itself is served — not the database, node_modules or anything else in the folder */
const PUBLIC = /^(index\.html|maturita-matematika-tracker\.html|(css|js|vendor)\/[\w./-]+)$/;
const TYPES = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".json":"application/json", ".woff2":"font/woff2", ".woff":"font/woff", ".ttf":"font/ttf", ".svg":"image/svg+xml", ".png":"image/png"
};

/* everything comes from here; the inline bits are the theme script and KaTeX's styles */
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'";

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers:{"Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store"}
});
const text = (body, status) => new Response(body, {status, headers:{"Content-Type":"text/plain; charset=utf-8"}});

/* a web page can point its own domain name at 127.0.0.1 and talk to this server as if it were
   same-origin ("DNS rebinding"); answering only to localhost, IP addresses and the names in
   ALLOWED_HOSTS shuts that out */
function hostAllowed(req, extra){
  const host = new URL(req.url).hostname.replace(/^\[|\]$/g, "");
  return host === "localhost" || net.isIP(host) !== 0 || extra.includes(host);
}

function createApp({store, where = store.dir, checkHost = true, allowedHosts = []}){
  async function api(req, url){
    const p = url.pathname;
    if(p === "/api/state" && req.method === "GET"){
      const cur = store.current();
      return json({app:APP_ID, rev:cur.rev, saved:cur.saved, where, state:cur.data ? JSON.parse(cur.data) : null});
    }
    if(p === "/api/state" && req.method === "PUT"){
      /* a plain cross-site form can't send JSON, so this also keeps other pages from writing here */
      if(!(req.headers.get("content-type") || "").startsWith("application/json")) return text("Expected JSON", 415);
      const raw = await req.text();
      if(raw.length > MAX_BODY) return text("Too large", 413);
      let body;
      try{ body = JSON.parse(raw); }catch(e){ return text("Bad JSON", 400); }
      const {base, state} = body || {};
      if(!Number.isInteger(base) || !state || typeof state !== "object" || Array.isArray(state)) return text("Expected {base, state}", 400);
      const r = store.put(base, state);
      if(r.conflict) return json({rev:r.rev, saved:r.saved, state:r.data ? JSON.parse(r.data) : null}, 409);
      return json(r);
    }
    if(p === "/api/snapshots" && req.method === "GET") return json({snapshots:store.snapshots()});
    const m = p.match(/^\/api\/snapshots\/(\d+)$/);
    if(m && req.method === "GET"){
      const s = store.getSnapshot(Number(m[1]));
      return s ? json({saved:s.saved, state:JSON.parse(s.data)}) : text("Not found", 404);
    }
    return text("Not found", 404);
  }

  async function file(url){
    let rel;
    try{ rel = decodeURIComponent(url.pathname).replace(/^\/+/, ""); }catch(e){ return text("Bad path", 400); }
    if(rel === "") rel = "maturita-matematika-tracker.html";
    if(!PUBLIC.test(rel) || rel.split("/").includes("..")) return text("Not found", 404);
    try{
      const data = await fs.readFile(path.join(ROOT, rel));
      const ext = path.extname(rel).toLowerCase();
      const headers = {"Content-Type":TYPES[ext] || "application/octet-stream", "Cache-Control":"no-cache"};
      if(ext === ".html") headers["Content-Security-Policy"] = CSP;
      return new Response(data, {headers});
    }catch(e){
      return text("Not found", 404);
    }
  }

  return async function handle(req){
    if(checkHost && !hostAllowed(req, allowedHosts)) return text("Host not allowed", 403);
    const url = new URL(req.url);
    try{
      if(url.pathname.startsWith("/api/")) return await api(req, url);
      if(req.method !== "GET" && req.method !== "HEAD") return text("Method not allowed", 405);
      return await file(url);
    }catch(e){
      console.error(e);
      return text("Server error", 500);
    }
  };
}

module.exports = {createApp, APP_ID};

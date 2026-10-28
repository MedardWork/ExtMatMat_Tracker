/* ============================================================
   Runs the tracker as a small local web server — what the Docker image starts.
     PORT           default 8080
     HOST           default 127.0.0.1 (the Docker image sets 0.0.0.0)
     DATA_DIR       where maturita.db and backups/ live, default ./data
     DATA_LABEL     how the Info page names that place, default the path itself
     ALLOWED_HOSTS  extra host names to answer to, comma separated (localhost and IPs always work)
   ============================================================ */
const http = require("node:http");
const path = require("node:path");
const {Readable} = require("node:stream");
const {openStore} = require("./store");
const {createApp} = require("./app");

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || "127.0.0.1";
const dir = path.resolve(process.env.DATA_DIR || path.join(__dirname, "..", "data"));
const store = openStore(dir);
const handle = createApp({
  store,
  where: process.env.DATA_LABEL || store.dir,
  allowedHosts: (process.env.ALLOWED_HOSTS || "").split(",").map(s => s.trim()).filter(Boolean)
});

const server = http.createServer(async (req, res) => {
  try{
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const request = new Request(`http://${req.headers.host || "localhost"}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: hasBody ? Readable.toWeb(req) : undefined,
      duplex: hasBody ? "half" : undefined
    });
    const response = await handle(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(req.method === "HEAD" ? undefined : Buffer.from(await response.arrayBuffer()));
  }catch(e){
    console.error(e);
    if(!res.headersSent) res.writeHead(400);
    res.end();
  }
});

server.listen(port, host, () => {
  console.log(`Maturita tracker: http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
  console.log(`Data: ${store.file}`);
});

/* writes are synchronous, so none is cut in half here — just close the database cleanly */
for(const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => {
  server.close();
  store.close();
  process.exit(0);
});

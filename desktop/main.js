/* ============================================================
   DESKTOP APP — the tracker in its own window, saving to a database on this computer.
   The page is served over app://tracker/ by the same handler as the Docker server
   (server/app.js), so nothing listens on a network port.
   Data: data/maturita.db (+ data/backups/) in the app's user-data folder — "Súbor → Otvoriť priečinok s dátami".
   It stays there when the app is uninstalled or updated.
   ============================================================ */
const {app, BrowserWindow, Menu, protocol, shell, dialog, nativeTheme} = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const {openStore} = require("../server/store");
const {createApp} = require("../server/app");

const START = "app://tracker/maturita-matematika-tracker.html";

/* a standard, secure scheme: localStorage (the theme), fetch and the clipboard work as on https */
protocol.registerSchemesAsPrivileged([
  {scheme:"app", privileges:{standard:true, secure:true, supportFetchAPI:true}}
]);

/* one copy of the app at a time: opening it again brings the running one forward */
const primary = app.requestSingleInstanceLock();
if(!primary) app.quit();

let win = null, store = null, closing = false, quitting = false;

/* ---------- window size and position survive a restart ---------- */
const boundsFile = () => path.join(app.getPath("userData"), "window.json");
function loadBounds(){
  try{ return JSON.parse(fs.readFileSync(boundsFile(), "utf8")); }catch(e){ return {width:1280, height:860}; }
}
function saveBounds(){
  if(!win || win.isDestroyed()) return;
  try{ fs.writeFileSync(boundsFile(), JSON.stringify({...win.getNormalBounds(), maximized:win.isMaximized()})); }catch(e){}
}

function createWindow(){
  const b = loadBounds();
  win = new BrowserWindow({
    x:b.x, y:b.y, width:b.width || 1280, height:b.height || 860, minWidth:380, minHeight:480,
    title:"Maturita z matematiky",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#11151B" : "#F2F4F7",
    show:false,
    webPreferences:{contextIsolation:true, sandbox:true, nodeIntegration:false}
  });
  if(b.maximized) win.maximize();
  win.once("ready-to-show", () => win.show());
  win.loadURL(START);

  /* links to other sites open in the normal browser */
  win.webContents.setWindowOpenHandler(({url}) => {
    if(/^https?:/.test(url)) shell.openExternal(url);
    return {action:"deny"};
  });
  win.webContents.on("will-navigate", (e, url) => {
    if(!url.startsWith("app://tracker/")){ e.preventDefault(); if(/^https?:/.test(url)) shell.openExternal(url); }
  });

  /* let the page finish its last save before the window goes away */
  win.on("close", e => {
    saveBounds();
    if(closing) return;
    e.preventDefault();
    closing = true;
    const flush = win.webContents.executeJavaScript("window.flushSave ? window.flushSave() : true").catch(() => true);
    const timeout = new Promise(r => setTimeout(r, 4000));
    Promise.race([flush, timeout]).finally(() => {
      if(!win.isDestroyed()) win.destroy();
      if(quitting) app.quit();   /* the close above interrupted a quit — carry it on */
    });
  });
  win.on("closed", () => { win = null; closing = false; });
}

/* ---------- menu ---------- */
function buildMenu(){
  const mac = process.platform === "darwin";
  const template = [
    ...(mac ? [{role:"appMenu"}] : []),
    {label:"Súbor", submenu:[
      {label:"Otvoriť priečinok s dátami", click:() => shell.openPath(store.dir)},
      {label:"Uložiť kópiu databázy…", click:saveCopy},
      {type:"separator"},
      mac ? {role:"close", label:"Zavrieť okno"} : {role:"quit", label:"Koniec"}
    ]},
    {label:"Úpravy", submenu:[
      {role:"undo", label:"Späť"}, {role:"redo", label:"Znova"}, {type:"separator"},
      {role:"cut", label:"Vystrihnúť"}, {role:"copy", label:"Kopírovať"}, {role:"paste", label:"Vložiť"},
      {role:"selectAll", label:"Vybrať všetko"}
    ]},
    {label:"Zobraziť", submenu:[
      {role:"reload", label:"Obnoviť"},
      {role:"resetZoom", label:"Pôvodná veľkosť"}, {role:"zoomIn", label:"Zväčšiť"}, {role:"zoomOut", label:"Zmenšiť"},
      {type:"separator"},
      {role:"togglefullscreen", label:"Celá obrazovka"},
      {role:"toggleDevTools", label:"Nástroje pre vývojárov"}
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function saveCopy(){
  const d = new Date();
  const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const r = await dialog.showSaveDialog(win, {
    title:"Uložiť kópiu databázy",
    defaultPath:path.join(app.getPath("documents"), `maturita-${day}.db`),
    filters:[{name:"Databáza", extensions:["db"]}]
  });
  if(r.canceled || !r.filePath) return;
  try{ store.copyTo(r.filePath); }
  catch(e){ dialog.showErrorBox("Kópia sa nepodarila", e.message); }
}

/* ---------- start ---------- */
app.on("second-instance", () => {
  if(!win) return createWindow();
  if(win.isMinimized()) win.restore();
  win.focus();
});

app.on("before-quit", () => { quitting = true; });

app.whenReady().then(() => {
  if(!primary) return;
  store = openStore(process.env.MATURITA_DATA_DIR || path.join(app.getPath("userData"), "data"));
  const handle = createApp({store, checkHost:false});
  protocol.handle("app", handle);
  buildMenu();
  createWindow();
  app.on("activate", () => { if(!win) createWindow(); });
});

app.on("window-all-closed", () => { if(process.platform !== "darwin") app.quit(); });
app.on("will-quit", () => { if(store) store.close(); });

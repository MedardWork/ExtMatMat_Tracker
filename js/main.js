/* ============================================================
   BOOT — runs last, after every other script has loaded
   ============================================================ */

/* ---------- theme: follows the system until you pick one ---------- */
const THEME_KEY = "maturita-theme";
function currentTheme(){
  return document.documentElement.dataset.theme
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
action("theme", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
});

/* ---------- keys that work everywhere ---------- */
document.addEventListener("keydown", e => {
  if(pal) return;
  const mod = e.ctrlKey || e.metaKey;
  if(mod && e.key.toLowerCase() === "k"){ e.preventDefault(); openPalette(); return; }
  if(mod || e.altKey) return;
  if(e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
  if(e.key === "/"){ e.preventDefault(); openPalette(); return; }
  const v = VIEWS[ui.route.view];
  if(v.key) v.key(e);
});

/* ---------- go ---------- */
load().then(() => {
  ui.route = parseRoute();
  render();
});
setInterval(() => { renderMiniClock(); if(ui.route.view === "prehlad") renderClock(); }, 60*60*1000);

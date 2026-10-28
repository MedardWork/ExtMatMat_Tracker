/* ============================================================
   INFO — where the data comes from, backup, keyboard shortcuts
   ============================================================ */
const SHORTCUTS = [
  ["<kbd>/</kbd> alebo <kbd>Ctrl</kbd>+<kbd>K</kbd>", "hľadať tému alebo poznámku"],
  ["<kbd>←</kbd> <kbd>→</kbd>", "predošlá / ďalšia téma"],
  ["<kbd>↑</kbd> <kbd>↓</kbd>", "vybrať podtému v otvorenej téme"],
  ["<kbd>0</kbd> – <kbd>4</kbd>", "nastaviť úroveň vybranej podtémy"],
  ["<kbd>N</kbd>", "nová poznámka k otvorenej téme"],
  ["<kbd>Esc</kbd>", "zavrieť editor, späť na zoznam"],
  ["<kbd>Ctrl</kbd>+<kbd>Enter</kbd>", "uložiť a zavrieť poznámku, pridať záznam do denníka"],
  ["<kbd>Ctrl</kbd>+<kbd>B</kbd> · <kbd>Ctrl</kbd>+<kbd>I</kbd>", "tučné · kurzíva"],
  ["<kbd>Ctrl</kbd>+<kbd>M</kbd>", "vzorec"]
];

VIEWS.info = {
  title: () => "Info a záloha",
  render(host){
    host.innerHTML = `<div class="page info">
      <header class="page-head"><h1>Info a záloha</h1></header>

      <section class="card">
        <h2>Záloha</h2>
        <p><span id="storeNote"></span></p>
        <p class="muted">Záloha obsahuje hodnotenia, všetky poznámky aj denník. Pri prechode na novú verziu sa staré poznámky zmenili na pomenované poznámky a pôvodné dáta sa uložili bokom ako záloha.</p>
        <div class="tools">
          <button class="btn ghost" data-act="export">Skopírovať postup</button>
          <button class="btn ghost" data-act="download">Stiahnuť ako súbor</button>
          <button class="btn ghost" data-act="import-toggle">Vložiť postup</button>
          <button class="btn ghost" data-act="import-file">Načítať zo súboru</button>
          <button class="btn ghost danger" data-act="reset">Vymazať všetko</button>
        </div>
        <div id="importBox" hidden>
          <textarea id="importArea" placeholder="Sem vlož skopírovaný text alebo obsah stiahnutého súboru."></textarea>
          <button class="btn" data-act="import">Načítať</button>
        </div>
      </section>

      ${store === "server" ? `<section class="card">
        <h2>História</h2>
        <p class="muted">Staršie verzie postupu, ktoré si databáza odkladá sama: počas práce každých 10 minút a vždy pred načítaním zálohy alebo vymazaním. Posledné dva dni zostávajú všetky, staršie po jednej za deň. Obnovením sa terajší stav nestratí — pribudne do histórie.</p>
        <div id="history" class="history"><p class="muted">Načítavam…</p></div>
      </section>` : ""}

      <section class="card">
        <h2>Klávesové skratky</h2>
        <table class="keys"><tbody>${SHORTCUTS.map(([k, what]) =>
          `<tr><td>${k}</td><td>${what}</td></tr>`).join("")}</tbody></table>
      </section>

      <section class="card prose">
        <h2>Odkiaľ sú dáta</h2>
        <p>Zoznam tém vychádza z Cieľových požiadaviek na vedomosti a zručnosti maturantov z matematiky (ŠPÚ) a z rozdelenia úloh v teste podľa špecifikácie NIVaM: základy 7, funkcie 8, planimetria 6, stereometria 5, kombinatorika s pravdepodobnosťou a štatistikou 4. Štítky Y1–Y3 pri témach sú z porovnania sylabov s týmito požiadavkami — sylabus hovorí, čo sa učilo, nie čo sa naozaj stihlo.</p>
        <p><b>Úrovne a odhad.</b> Každá téma sa delí na podtémy a úroveň sa dáva každej zvlášť. Odhad bodov na EČ počíta podtému na <i>perfektne</i> celú, <i>ide to</i> za dve tretiny a <i>slabo</i> za tretinu. <i>Nepozreté</i> a <i>neviem</i> sa nepočítajú, ale rozlišujú sa, aby si videl, čo ešte vôbec neotvoril. Úroveň celej témy je priemer podtém — <i>perfektne</i> je až vtedy, keď sú perfektne všetky.</p>
        <p><b>Nerelevantné.</b> Témy, o ktorých vieš, že na teste nebudú, vyradíš tlačidlom ⊘ (v zozname alebo v okne témy). Presunú sa do záložky Nerelevantné a do odhadu, „Čo ďalej“ ani odpočtu sa nepočítajú — úlohy ich bloku sa rozdelia medzi zvyšné témy. Hodnotenie aj poznámky zostávajú a tlačidlom ↩ Vrátiť ich kedykoľvek vrátiš.</p>
        <p><b>Poznámky</b> majú vlastné „rozumiem“: ako rozumieš tomu, čo je napísané práve v nich. Do odhadu sa nepočíta — slúži na orientáciu a filtrovanie.</p>
        <p><b>Dánsko.</b> Záložka Matematik A je nastavená na Matematik A na STX podľa læreplanu z roku 2024 a do odhadu na EČ sa nepočíta. Písomná skúška má 5 hodín: delprøve 1 (3 h, iba formelsamling) a delprøve 2 (2 h, všetky pomôcky vrátane CAS).</p>
      </section>
    </div>`;
    renderStoreNote();
    if(store === "server") renderHistory();
    if(ui.openImport){ ui.openImport = false; $("#importBox").hidden = false; $("#importArea").focus(); }
  }
};

/* ---------- history: earlier saves kept by the app's database ---------- */
async function renderHistory(){
  const host = $("#history");
  let list;
  try{ list = (await (await fetch("api/snapshots", {cache:"no-store"})).json()).snapshots; }
  catch(err){ if(host) host.innerHTML = `<p class="muted">Históriu sa nepodarilo načítať.</p>`; return; }
  if(!host) return;
  if(!list.length){ host.innerHTML = `<p class="muted">Zatiaľ prázdna — prvá staršia verzia sa odloží po pár minútach práce.</p>`; return; }
  host.innerHTML = `<ul>${list.map(x => `<li>
    <span class="h-when">${fmtStamp(x.saved)}</span>
    <span class="h-what muted">hodnotené podtémy ${x.rated} · ${x.notes} ${skNotes(x.notes)} · ${x.entries} ${skEntries(x.entries)}</span>
    <span class="h-acts">
      <button class="btn ghost small" data-act="snap-download" data-id="${x.id}">Stiahnuť</button>
      <button class="btn ghost small" data-act="snap-restore" data-id="${x.id}">Obnoviť</button>
    </span>
  </li>`).join("")}</ul>`;
}
async function fetchSnapshot(id){
  const r = await fetch(`api/snapshots/${id}`, {cache:"no-store"});
  if(!r.ok) throw new Error(r.status);
  return r.json();
}
action("snap-restore", async el => {
  let snap;
  try{ snap = await fetchSnapshot(el.dataset.id); }catch(err){ toast("Túto verziu sa nepodarilo načítať."); return; }
  if(!confirm(`Obnoviť postup z ${fmtStamp(snap.saved)}? Terajší stav sa odloží do histórie.`)) return;
  state = migrate(snap.state);
  newEpoch();
  ui.editing = null;
  await save();
  toast("Obnovené.");
  render();
});
action("snap-download", async el => {
  try{
    const snap = await fetchSnapshot(el.dataset.id);
    downloadJson(snap.state, `maturita-postup-${isoOf(snap.saved)}.json`);
  }catch(err){ toast("Túto verziu sa nepodarilo načítať."); }
});

action("export", async () => {
  const txt = JSON.stringify(state);
  try{ await navigator.clipboard.writeText(txt); toast("Postup je v schránke."); }
  catch(err){
    $("#importBox").hidden = false;
    $("#importArea").value = txt;
    toast("Skopíruj text z poľa nižšie.");
  }
});
function downloadJson(data, name){
  const blob = new Blob([JSON.stringify(data, null, 1)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
action("download", () => downloadJson(state, `maturita-postup-${todayIso()}.json`));
action("import-toggle", () => { const b = $("#importBox"); b.hidden = !b.hidden; });
action("import", () => importText($("#importArea").value));
/* the .json from "Stiahnuť ako súbor" */
action("import-file", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.txt,application/json,text/plain";
  input.onchange = async () => { if(input.files[0]) importText(await input.files[0].text()); };
  input.click();
});
function importText(txt){
  try{
    state = migrate(JSON.parse(txt.trim()));
    newEpoch();   /* the import replaces what other open tabs hold */
    ui.editing = null;
    save(); toast("Načítané.");
    render();
  }catch(err){ toast("Text sa nedal prečítať — skontroluj, či je celý."); }
}
action("reset", () => {
  if(!confirm("Naozaj vymazať všetky hodnotenia, poznámky aj denník?")) return;
  state = emptyState(); newEpoch(); ui.editing = null; save(); toast("Vymazané.");
});

/* ============================================================
   INFO — where the data comes from, backup, keyboard shortcuts
   ============================================================ */
const SHORTCUTS = [
  ["<kbd>/</kbd> alebo <kbd>Ctrl</kbd>+<kbd>K</kbd>", "hľadať tému alebo poznámku"],
  ["<kbd>←</kbd> <kbd>→</kbd>", "predošlá / ďalšia téma (na tej istej záložke)"],
  ["<kbd>↑</kbd> <kbd>↓</kbd>", "vybrať podtému (záložka Podtémy)"],
  ["<kbd>0</kbd> – <kbd>4</kbd>", "nastaviť úroveň vybranej podtémy"],
  ["<kbd>N</kbd>", "nová poznámka k otvorenej téme (otvorí Poznámky)"],
  ["<kbd>T</kbd>", "nový test k otvorenej téme (otvorí Precvičovanie)"],
  ["<kbd>Esc</kbd>", "zavrieť editor, späť na zoznam"],
  ["<kbd>Ctrl</kbd>+<kbd>Enter</kbd>", "uložiť a zavrieť poznámku"],
  ["Kalendár: <kbd>←</kbd> <kbd>→</kbd> · <kbd>M</kbd> <kbd>T</kbd> <kbd>G</kbd> · <kbd>P</kbd> · <kbd>S</kbd>", "predošlý / ďalší · mesiac / týždeň / mriežka poznámok · témy alebo poznámky · stav plánu"],
  ["<kbd>Ctrl</kbd>+<kbd>B</kbd> · <kbd>Ctrl</kbd>+<kbd>I</kbd>", "tučné · kurzíva"],
  ["<kbd>Ctrl</kbd>+<kbd>M</kbd>", "vzorec"]
];

/* the gear in the top bar (#/nastavenia; old #/info links land here). The plan's card (planCardHtml below)
   is shown in the calendar's "Stav plánu" (js/views/calendar.js). */
VIEWS.nastavenia = {
  title: () => "Nastavenia",
  render(host){
    host.innerHTML = `<div class="page info">
      <header class="page-head"><h1>Nastavenia</h1>
        <p class="sub">Záloha a obnova postupu, import starých testov, klávesové skratky a odkiaľ sú dáta. Študijný plán sa mení v <a href="#/kalendar/s">Kalendári → Stav plánu</a>.</p></header>

      <section class="card">
        <h2>Záloha</h2>
        <p><span id="storeNote"></span></p>
        <p class="muted">Záloha obsahuje hodnotenia, všetky poznámky, testy z tém, denník aj plán v kalendári. Pri prechode na novú verziu sa staré poznámky zmenili na pomenované poznámky a pôvodné dáta sa uložili bokom ako záloha.</p>
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
          <p class="muted small zapis-how">Staré testy a úrovne zo session s AI: <button class="btn ghost small" data-act="zapis-prompt">Skopírovať pokyny pre AI</button>
            Vlož ich do tej session a celú jej odpoveď potom sem. Appka ukáže, čo pridá, a nič iné nezmení.</p>
          <textarea id="zapisOut" class="plan-out" readonly hidden></textarea>
          <div id="zapisCheck"></div>
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
        <p><b>Testy z tém.</b> Na stránke témy si pod <i>Testy</i> zapíšeš krátky test: deň a jeho úlohy, každú ako ✓ správne, ½ čiastočne alebo ✗ zle. Body sa spočítajú samy: každá úloha je 1 bod, ½ je pol bodu. K úlohe, v ktorej si chyboval, si pripíšeš poznámku. Farba výsledku: od 90 % ako <i>perfektne</i>, od 70 % <i>ide to</i>, od 40 % <i>slabo</i>, menej <i>neviem</i>. Téma s posledným testom pod 70 % je na prehľade medzi „Na zopakovanie“ a v zozname tém pod filtrom Slabý test. Body vidíš aj v kalendári pri dni, keď si test písal, a test splní opakovanie témy z plánu. Do odhadu bodov ani do tempa sa nepočítajú. Staré testy zo session s AI prenesieš cez <i>Vložiť postup</i> → <i>Skopírovať pokyny pre AI</i>: AI z tej session pripraví testy, úroveň témy a úrovne poznámok a appka ich k postupu pridá.</p>
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
  /* a zápis from an old session (js/zapis.js) is added to the progress, after a preview */
  const zs = zapisFromText(txt);
  if(zs.length){ zapisShow(zs); return; }
  let data = null;
  try{ data = JSON.parse(txt.trim()); }catch(err){}
  /* a plan (or an AI's answer with one) pasted here goes to the plan card instead of replacing the progress */
  const pl = (!data || data.format === PLAN_FORMAT) && planFromText(txt);
  if(pl && pl.def && pl.def.format === PLAN_FORMAT){
    $("#importBox").hidden = true;
    ui.openPlan = txt;
    go("#/kalendar/s");
    toast("Toto je plán, nie celý postup. Skontroluj zmeny v karte Plán a potvrď ich.");
    return;
  }
  /* something else with a format of its own is not a backup: never let it replace the progress */
  if(isObj(data) && data.format){ toast("Tento text nie je záloha postupu, nič som nezmenil."); return; }
  try{
    state = migrate(data);
    newEpoch();   /* the import replaces what other open tabs hold */
    ui.editing = null;
    save(); toast("Načítané.");
    render();
  }catch(err){ toast("Text sa nedal prečítať — skontroluj, či je celý."); }
}
/* ---------- zápis zo session: preview, then add (js/zapis.js) ---------- */
let zapisPending = null;
function zapisShow(zs){
  const p = zapisPending = zapisPreview(zs);
  const host = $("#zapisCheck");
  if(!host) return;
  host.innerHTML = `<div class="plan-check${p.ops.length ? "" : " bad"}">
    <p><b>${p.ops.length ? "Do postupu sa pridá" : "Nič nové na pridanie"}</b></p>
    ${p.lines.length ? `<ul>${p.lines.map(l => `<li>${l}</li>`).join("")}</ul>` : ""}
    ${p.skip.length ? `<h4>Preskočí sa</h4><ul class="muted">${p.skip.map(l => `<li>${l}</li>`).join("")}</ul>` : ""}
    ${p.ops.length ? `<button class="btn" data-act="zapis-apply">Pridať do postupu</button> ` : ""}<button class="btn ghost" data-act="zapis-cancel">Zrušiť</button>
  </div>`;
  host.scrollIntoView({block:"nearest"});
}
action("zapis-apply", () => {
  if(!zapisPending) return;
  const before = JSON.stringify(state);
  const r = zapisApply(zapisPending);
  zapisPending = null;
  save(); render();
  const what = [r.tests ? `${r.tests} ${plural(r.tests, "test", "testy", "testov")}` : "", r.removed ? `zmazané ${r.removed} ${plural(r.removed, "poznámka", "poznámky", "poznámok")} s testami` : ""].filter(Boolean).join(", ");
  toast(`Pridané do postupu${what ? `: ${what}` : ""}.`, () => { state = migrate(JSON.parse(before)); newEpoch(); save(); render(); });
});
action("zapis-cancel", () => { zapisPending = null; $("#zapisCheck").innerHTML = ""; });
action("zapis-prompt", async () => {
  const txt = zapisPrompt(true);
  try{ await navigator.clipboard.writeText(txt); toast("Pokyny sú v schránke. Vlož ich do starej session s AI."); }
  catch(err){ const o = $("#zapisOut"); o.hidden = false; o.value = txt; o.select(); toast("Skopíruj text z poľa nižšie."); }
});
action("reset", () => {
  if(!confirm("Naozaj vymazať všetky hodnotenia, poznámky aj denník?")) return;
  state = emptyState(); newEpoch(); ui.editing = null; save(); toast("Vymazané.");
});

/* ============================================================
   PLAN — copy it for an AI, paste the answer back (with a preview of the changes), earlier versions.
   Only state.plan.def / .at / .hist change; levels, notes and test scores stay. The model is js/planmodel.js.
   ============================================================ */
function planCardHtml(){
  ensurePlan();
  const h = state.plan.hist;
  const count = d => d.weeks.reduce((a, w) => a + (w.items || []).length, 0);
  return `<section class="card" id="planCard">
    <h2>Plán</h2>
    <p>${PLAN_NONE ? "Zatiaľ nemáš študijný plán." : `${planIsCustom() ? `${PLAN_DEFAULT ? "Upravený plán" : "Plán"} z ${fmtStamp(state.plan.at)}` : "Pôvodný plán"} · ${nWeeks(PLAN_WEEKS.length)} · ${nItems(PLAN_ITEMS.length)} · ${calNum(PLAN_TOTAL)} ${skSed(PLAN_TOTAL)} · maturita ${fmtD(PLAN_EXAM)}`}</p>
    ${PLAN_ERR ? `<p class="warn">Uložený plán sa nedá použiť${PLAN_NONE ? "" : ", kalendár preto ukazuje pôvodný"}: ${esc(PLAN_ERR.slice(0, 3).join(" · "))}</p>` : ""}
    <p class="muted">${PLAN_NONE
      ? "Plán si vytvoríš s AI (Claude, ChatGPT…): klikni na „Vytvoriť plán s AI“, vlož text do chatu a odpovedz na jej otázky (kedy maturuješ, ako vyzerá tvoj týždeň, koľko času máš na matiku). Keď ti pošle plán, vlož celú jej odpoveď cez „Vložiť plán“. Appka ho skontroluje a ukáže, než ho použije."
      : "Keď si napred alebo pozadu, skopíruj plán pre AI (Claude, ChatGPT…), napíš, čo treba zmeniť, a celú odpoveď vlož späť. Appka plán skontroluje a ukáže zmeny. Mení sa len plán: hodnotenia, poznámky a body z testov zostanú."}</p>
    <div class="tools">
      <button class="btn ${PLAN_NONE ? "" : "ghost"}" data-act="plan-copy">${PLAN_NONE ? "Vytvoriť plán s AI" : "Skopírovať pre AI"}</button>
      ${PLAN_NONE ? "" : `<button class="btn ghost" data-act="plan-copy-raw" title="Len údaje plánu (JSON), bez pokynov pre AI">Skopírovať len plán</button>`}
      <button class="btn ghost" data-act="plan-paste">Vložiť plán</button>
      ${PLAN_NONE ? "" : `<button class="btn ghost" data-act="plan-download">Stiahnuť plán</button>`}
      <button class="btn ghost" data-act="plan-file">Načítať zo súboru</button>
      ${state.plan.def ? `<button class="btn ghost" data-act="plan-reset">${PLAN_DEFAULT ? "Vrátiť pôvodný plán" : "Zmazať plán"}</button>` : ""}
    </div>
    <textarea id="planOut" class="plan-out" readonly hidden></textarea>
    <div id="planBox" hidden>
      <textarea id="planArea" data-in="plan-check" placeholder="Sem vlož celú odpoveď od AI (plán si z nej appka vyberie sama) alebo obsah stiahnutého súboru."></textarea>
      <div id="planCheck"></div>
    </div>
    ${h.length ? `<details class="plan-hist"><summary>Predošlé verzie plánu (${h.length})</summary><div class="history"><ul>${h.map((x, i) => `<li>
      <span class="h-when">${fmtStamp(x.at)}</span>
      <span class="h-what muted">${nWeeks(x.def.weeks.length)} · ${nItems(count(x.def))}</span>
      <span class="h-acts">
        <button class="btn ghost small" data-act="plan-hist-dl" data-i="${i}">Stiahnuť</button>
        <button class="btn ghost small" data-act="plan-hist-use" data-i="${i}">Obnoviť</button>
      </span></li>`).join("")}</ul></div></details>` : ""}
  </section>`;
}

let planPending = null, planErrs = null;
const nWeeks = n => `${n} ${skWeeks(n)}`, nItems = n => `${n} ${plural(n, "položka", "položky", "položiek")}`;
function openPlanBox(txt){
  const box = $("#planBox");
  if(!box) return;
  box.hidden = false;
  if(txt != null){ $("#planArea").value = txt; planCheck(txt); }
  $("#planCard").scrollIntoView({block:"start"});
  $("#planArea").focus();
}
function planCheck(txt){
  const host = $("#planCheck");
  planPending = null; planErrs = null;
  if(!txt.trim()){ host.innerHTML = ""; return; }
  const got = planFromText(txt);
  if(!got){ host.innerHTML = `<p class="warn">V texte nie je žiadny plán (JSON). Vlož celú odpoveď od AI alebo obsah stiahnutého súboru.</p>`; return; }
  const def = got.def || PLAN_DEFAULT;
  if(!def){ host.innerHTML = `<p class="warn">V tejto zálohe nie je žiadny plán.</p>`; return; }
  const errs = validatePlan(def);
  if(errs.length){
    planErrs = errs;
    host.innerHTML = `<div class="plan-check bad"><p><b>Tento plán sa nedá použiť.</b> Pošli AI chyby nižšie, nech ho opraví.</p>
      <ul>${errs.slice(0, 15).map(e => `<li><code>${esc(e)}</code></li>`).join("")}${errs.length > 15 ? `<li class="muted">… a ďalších ${errs.length - 15}</li>` : ""}</ul>
      <button class="btn ghost small" data-act="plan-errs-copy">Skopírovať chyby pre AI</button></div>`;
    return;
  }
  const diff = PLAN_NONE ? [["Nový plán", [`${fmtD(def.start)} ${def.start.slice(0, 4)} – maturita ${fmtD(def.exam)} ${def.exam.slice(0, 4)}`]]] : planDiff(planDef(), def);
  if(!diff.length){ host.innerHTML = `<p class="muted">Tento plán je rovnaký ako ten, ktorý už máš.</p>`; return; }
  const P = compilePlan(def);
  const over = Object.entries(P.over).map(([wid, o]) => { const w = P.weeks.find(w => w.id === wid); return `týždeň ${fmtD(w.from)} – ${fmtD(w.to)}: ${o.map(x => `${x.it.n} (${x.blocks} ${skBlocks(x.blocks)})`).join(", ")}`; });
  planPending = def;
  host.innerHTML = `<div class="plan-check"><p><b>Čo sa zmení${got.backup ? " (plán zo zálohy postupu)" : ""}</b></p>
    ${diff.map(([hd, ls]) => `<h4>${esc(hd)}</h4><ul>${ls.slice(0, 12).map(l => `<li>${esc(l)}</li>`).join("")}${ls.length > 12 ? `<li class="muted">… a ďalších ${ls.length - 12}</li>` : ""}</ul>`).join("")}
    ${over.length ? `<p class="warn">Nezmestí sa do blokov ani do rezervy: ${esc(over.join("; "))}.</p>` : ""}
    <p class="muted">Nový plán: ${nWeeks(P.weeks.length)}, ${nItems(P.items.length)}, ${calNum(P.total)} ${skSed(P.total)}.${PLAN_NONE ? "" : " Terajší plán sa odloží medzi predošlé verzie."}</p>
    <button class="btn" data-act="plan-apply">Použiť tento plán</button></div>`;
}
onInput("plan-check", el => planCheck(el.value));

/* set a new plan; the one it replaces goes to the history (the default is always there to go back to) */
function setPlan(def){
  const p = state.plan;
  if(def && PLAN_DEFAULT && JSON.stringify(planOrdered(def)) === JSON.stringify(planOrdered(PLAN_DEFAULT))) def = null;
  if(p.def) p.hist = [{def:p.def, at:p.at || Date.now()}, ...p.hist].slice(0, PLAN_HIST);
  p.def = def;
  p.at = Date.now();
  save();
  render();
}
const planText = def => planJson(planOrdered(def)) + "\n";
function downloadText(text, name){
  const blob = new Blob([text], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
async function copyOr(txt, ok){
  try{ await navigator.clipboard.writeText(txt); toast(ok); }
  catch(err){ const o = $("#planOut"); o.hidden = false; o.value = txt; o.select(); toast("Skopíruj text z poľa nižšie."); }
}
action("plan-copy", () => { ensurePlan(); copyOr(planAiText(), PLAN_NONE ? "Text je v schránke. Vlož ho do chatu s AI a odpovedz na jej otázky." : "Plán je v schránke. Vlož ho do chatu s AI a napíš, čo treba zmeniť."); });
action("plan-copy-raw", () => { ensurePlan(); const d = planDef(); if(d) copyOr(planText(d), "Plán (bez pokynov pre AI) je v schránke."); });
action("plan-errs-copy", () => planErrs && copyOr(
  `Appka tento plán neprijala. Oprav, prosím, tieto chyby a pošli znova celý plán ako jeden blok \`\`\`json:\n${planErrs.map(e => "- " + e).join("\n")}\n`,
  "Chyby sú v schránke. Vlož ich do chatu s AI."));
action("plan-paste", () => { const b = $("#planBox"); if(b.hidden) openPlanBox(); else b.hidden = true; });
action("plan-apply", () => { if(!planPending) return; setPlan(planPending); toast("Plán zmenený, kalendár sa prepočítal."); });
action("plan-reset", () => {
  if(!confirm(PLAN_DEFAULT ? "Vrátiť pôvodný plán? Terajší sa odloží medzi predošlé verzie." : "Zmazať plán? Odloží sa medzi predošlé verzie.")) return;
  setPlan(null); toast(PLAN_DEFAULT ? "Kalendár ukazuje pôvodný plán." : "Plán zmazaný.");
});
action("plan-download", () => planDef() && downloadText(planText(planDef()), `maturita-plan-${todayIso()}.json`));
action("plan-file", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.txt,.md,application/json,text/plain";
  input.onchange = async () => { if(input.files[0]) openPlanBox(await input.files[0].text()); };
  input.click();
});
action("plan-hist-dl", el => { const h = state.plan.hist[+el.dataset.i]; if(h) downloadText(planText(h.def), `maturita-plan-${isoOf(new Date(h.at))}.json`); });
action("plan-hist-use", el => {
  const i = +el.dataset.i, h = state.plan.hist[i];
  if(!h || !confirm(`Obnoviť plán z ${fmtStamp(h.at)}? Terajší sa odloží medzi predošlé verzie.`)) return;
  state.plan.hist.splice(i, 1);
  setPlan(h.def);
  toast("Plán obnovený.");
});

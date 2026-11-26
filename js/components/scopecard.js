/* ============================================================
   SCOPE CARD (overview) — Nutné minimum / Externá časť / Celá maturita, what each covers,
   whether the plan still fits, and the subtopics with the most points per hour (js/ec.js)
   ============================================================ */
function renderScopeCard(){
  const host = $("#scopeCard");
  if(!host) return;
  const sc = ecScope(), left = ecLeft(sc);
  const cols = EC_SCOPES.map(s => {
    const c = ecCover(s.k);
    return `<div class="ec-col${s.k === sc ? " on" : ""}"><b>${s.label}</b>
      <span>${ecNum(c.pts)} z 30 b.</span><span>${c.topics} ${skPieces(c.topics)} · ${c.subs} podtém</span><span>od nuly asi ${Math.round(c.h)} h</span></div>`;
  }).join("");
  host.innerHTML = `<h2>Rozsah učenia</h2>
    ${ecScopeSwitch("ov")}
    <p class="muted">${ecScopeOf(sc).desc} Podľa ${EC.nTests} testov externej časti z rokov ${EC.first}–${EC.last}; novšie testy vážia viac.</p>
    <div class="ec-cols">${cols}</div>
    <p class="ec-left">Podľa tvojich úrovní ti v tomto rozsahu zostáva asi <b>${Math.round(left.h)} h</b> učenia na <b>${ecNum(left.pts)} b.</b> testu.</p>
    ${planFitHtml(sc)}
    ${prioritiesHtml(sc)}`;
}

function planFitHtml(sc){
  const f = ecPlanFit();
  if(!f) return "";
  const lines = [`V pláne od dnes zostáva <b>${f.bIn}</b> ${skBlocks(f.bIn)} na témy v rozsahu${f.bOut ? ` a <b>${f.bOut}</b> na témy mimo rozsahu` : ""}.`];
  if(f.overIn) lines.push(`Do svojich týždňov sa nezmestilo ${f.overIn} ${skBlocks(f.overIn)} tém v rozsahu.`);
  if(f.missing.length) lines.push(`V pláne chýba ${f.missing.length} ${skPieces(f.missing.length)} z rozsahu (asi ${f.missBlocks} ${skBlocks(f.missBlocks)}): ${f.missing.slice(0, 6).map(m => `<a href="#/tema/${m.id}">${esc(shortName(BY_ID[m.id]))}</a>`).join(", ")}${f.missing.length > 6 ? " …" : ""}.`);
  let verdict, cls;
  if(!f.need && !f.bOut){ verdict = "Plán sedí s rozsahom."; cls = "ok"; }
  else if(f.need <= f.bOut){ verdict = `Plán sa zmestí: ${f.need ? `na chýbajúce stačí ${f.need} ${skBlocks(f.need)} z tých, čo sa uvoľnia` : `uvoľní sa ${f.bOut} ${skBlocks(f.bOut)}`}.`; cls = "ok"; }
  else { const d = f.need - f.bOut; verdict = `Nezmestí sa: chýba asi ${d} ${skBlocks(d)} (${ecNum(d * EC_BLOCK_H)} h).`; cls = "late"; }
  const replan = f.need || f.bOut;
  return `<div class="ec-fit">
    <p class="ec-verdict ${cls}"><b>${verdict}</b></p>
    <p class="muted">${lines.join(" ")}</p>
    ${replan ? `<div class="tools"><button class="btn${cls === "late" ? "" : " ghost"}" data-act="ec-replan" title="Skopíruje plán s pokynmi pre AI: vyhodiť témy mimo rozsahu, doplniť chýbajúce a zoradiť ich podľa bodov za hodinu">Preplánovať s AI</button>
      <a class="btn ghost" href="#/info" data-act="plan-goto">Vložiť nový plán</a></div>
    <textarea id="ecOut" class="plan-out" readonly hidden></textarea>` : ""}
  </div>`;
}

function prioritiesHtml(sc){
  const pr = ecPriorities(sc).slice(0, 8);
  if(!pr.length) return `<p class="done">Všetky podtémy v rozsahu máš aspoň na „ide to“.</p>`;
  return `<h3>Najviac bodov za hodinu</h3>
    <ol class="ec-prio">${pr.map(o => `<li><a href="#/tema/${o.tid}"><i class="dot l${o.v}"></i>${esc(o.n)}</a>
      <em>${esc(shortName(BY_ID[o.tid]))} · v ${ecYearsTxt(o.years.length)} · ${ecPts(o.pts)}/test · ${ecNum(o.pph, 2)} b./h</em></li>`).join("")}</ol>`;
}

action("ec-replan", async () => {
  ensurePlan();
  const txt = planAiText() + "\nUprav plán podľa časti ROZSAH UČENIA.\n";
  try{ await navigator.clipboard.writeText(txt); toast("Plán s rozsahom je v schránke. Vlož ho do chatu s AI, jej odpoveď potom do Info → Vložiť plán."); }
  catch(err){ const o = $("#ecOut"); if(o){ o.hidden = false; o.value = txt; o.select(); } toast("Skopíruj text z poľa nižšie."); }
});

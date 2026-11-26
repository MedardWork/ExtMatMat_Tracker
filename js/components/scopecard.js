/* ============================================================
   SCOPE CARD (calendar → Stav plánu) — Nutné minimum / Externá časť / Celá maturita, what each covers,
   whether the plan still fits (in words and as bars, "Zmestí sa?"), and the subtopics with the most points per hour (js/ec.js)
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
    ${fitBarsHtml(sc)}
    ${planFitHtml(sc)}
    ${prioritiesHtml(sc)}`;
}

function planFitHtml(sc){
  const f = ecPlanFit();
  if(!f) return "";
  const lines = [`V pláne od dnes zostáva <b>${f.bIn}</b> ${skBlocks(f.bIn)} na témy v rozsahu${f.bOut ? ` a <b>${f.bOut}</b> na témy mimo rozsahu` : ""}.`];
  if(f.overIn) lines.push(`Do svojich týždňov sa nezmestilo ${f.overIn} ${skBlocks(f.overIn)} tém v rozsahu.`);
  if(f.missing.length) lines.push(`V pláne chýba ${f.missing.length} ${skPieces(f.missing.length)} z rozsahu (asi ${f.missBlocks} ${skBlocks(f.missBlocks)}).`);
  const missing = f.missing.length ? `Chýbajú: ${f.missing.slice(0, 15).map(m => `<a href="#/tema/${m.id}">${esc(shortName(BY_ID[m.id]))}</a>`).join(", ")}${f.missing.length > 15 ? ` a ďalších ${f.missing.length - 15}` : ""}.` : "";
  let verdict, cls;
  if(!f.need && !f.bOut){ verdict = "Plán sedí s rozsahom."; cls = "ok"; }
  else if(f.need <= f.bOut){ verdict = `Plán sa zmestí: ${f.need ? `na chýbajúce stačí ${f.need} ${skBlocks(f.need)} z tých, čo sa uvoľnia` : `uvoľní sa ${f.bOut} ${skBlocks(f.bOut)}`}.`; cls = "ok"; }
  else { const d = f.need - f.bOut; verdict = `Nezmestí sa: chýba asi ${d} ${skBlocks(d)} (${ecNum(d * EC_BLOCK_H)} h).`; cls = "late"; }
  const replan = f.need || f.bOut;
  return `<div class="ec-fit">
    <p class="ec-verdict ${cls}"><b>${verdict}</b></p>
    ${foldTxt(lines.join(" "), missing, "muted ec-lines")}
    ${replan ? `<div class="tools"><button class="btn${cls === "late" ? "" : " ghost"}" data-act="ec-replan" title="Skopíruje plán s pokynmi pre AI: vyhodiť témy mimo rozsahu, doplniť chýbajúce a zoradiť ich podľa bodov za hodinu">Preplánovať s AI</button>
      <a class="btn ghost" href="#/kalendar/s" data-act="plan-goto">Vložiť nový plán</a></div>
    <textarea id="ecOut" class="plan-out" readonly hidden></textarea>` : ""}
  </div>`;
}

/* "Zmestí sa?": per scope, the blocks its unfinished topics need from today (those already in the plan and those
   the plan lacks) against the blocks the plan has from today; what lies past the line does not fit. Same numbers
   as the verdict below (ecPlanFit), shown in hours. A row switches the scope. */
function fitBarsHtml(sc){
  if(PLAN_NONE) return "";
  const rows = EC_SCOPES.map(s => { const f = ecPlanFit(s.k); return {s, inPlan:f.bIn, need:f.bIn + f.need, cap:f.bIn + f.bOut}; });
  const cap = rows[0].cap, max = Math.max(cap, ...rows.map(r => r.need)) || 1;
  const pc = b => (b / max * 100).toFixed(2) + "%", hh = b => `${Math.round(b * EC_BLOCK_H)} h`;
  return `<h3>Zmestí sa?</h3>
    <div class="fit-bars" style="--capf:${(cap / max).toFixed(4)}">${rows.map(r => `<button class="fit-row${r.s.k === sc ? " on" : ""}" data-act="ec-scope" data-k="${r.s.k}" data-w="fit"
      title="${esc(r.s.label)}: v pláne ${hh(r.inPlan)}, v pláne chýba ${hh(r.need - r.inPlan)}${r.need > cap ? `, nezmestí sa ${hh(r.need - cap)}` : ""}">
      <span class="fit-n">${r.s.label}</span>
      <span class="fit-tr"><i class="fit-in" style="width:${pc(r.inPlan)}"></i><i class="fit-miss" style="left:${pc(r.inPlan)};width:${pc(r.need - r.inPlan)}"></i>${r.need > cap ? `<i class="fit-over" style="left:${pc(cap)};width:${pc(r.need - cap)}"></i>` : ""}</span>
      <span class="fit-v">${hh(r.need)}</span></button>`).join("")}
      <div class="fit-cap"><span>plán od dnes ${hh(cap)}</span></div>
    </div>
    <p class="fit-legend"><span><i class="fit-in"></i>témy v pláne</span><span><i class="fit-miss"></i>v pláne chýbajú</span><span><i class="fit-over"></i>nezmestí sa</span><span>čiara: bloky, ktoré má plán od dnes</span></p>`;
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
  try{ await navigator.clipboard.writeText(txt); toast("Plán s rozsahom je v schránke. Vlož ho do chatu s AI, jej odpoveď potom sem cez Vložiť plán."); }
  catch(err){ const o = $("#ecOut"); if(o){ o.hidden = false; o.value = txt; o.select(); } toast("Skopíruj text z poľa nižšie."); }
});

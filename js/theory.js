/* ============================================================
   THEORY — turns a topic's theory (js/data/theory/<id>.js) into a page
   A theory file sets  THEORY.<id> = {mins, brief:[…], subs:{"<subtopic name>":[blocks]}}
   and is loaded only when its topic's Teória tab is opened.
   A block is a string of Markdown (formulas between $…$) or one of:
     {def:"Title", tex:R`y = \va{k}x + \vb{q}`, mid:true, legend:[["k", "a", "smernica", "what it does"]]}
     {tool:"graf", kind:"skus"|"uloha"|"obr", ask:"…", take:"…", hint:"…", goal:"k == 2", cfg:{…}}
     {cards:[{fig, t:"title", d:"text", tex}]}      fig: {fns:["x^2"], view:[-3, 5, 3, -1]} draws a tiny graph
     {steps:[{t:"title", d:"text", tex}]}           a short procedure
     {ex:"task", steps:[["what", R`tex`]], res:"result", fig:{tool, cfg}}     worked example, answered before its
                                                    solution shows (js/exercise.js); ans:[numbers] / ans:false override
                                                    the numbers read from res (node dev/excheck.js lists them)
     {map:[["sentence", "what it is", R`tex`]], sum:["…", R`tex`]}            words → symbols
     {warn:"…"}  {tip:"…", label:"Súvislosť"}  {h:"Sub-heading"}
   In formulas \va{…} \vb{…} \vc{…} \vd{…} colour a quantity — the same four colours the tools use,
   so k is the same colour in the sentence, in the formula, on the slider and in the graph.
   Write formulas with R`…` (String.raw) so backslashes survive.
   ============================================================ */
const THEORY = {};
const R = String.raw;
const hasTheory = id => THEORY_LIST.includes(id);

/* a formula box holds one or more relations separated by \qquad (at the top level, outside braces and
   environments); each relation is set unbroken and the relations wrap as wholes, never inside one */
function defParts(src){
  const parts = [];
  let depth = 0, env = 0, start = 0;
  for(let i = 0; i < src.length; i++){
    const c = src[i];
    if(c === "\\"){
      if(src.startsWith("\\begin", i)) env++;
      else if(src.startsWith("\\end", i)) env--;
      else if(!depth && !env && src.startsWith("\\qquad", i) && !/[a-zA-Z]/.test(src[i + 6] || "")){
        parts.push(src.slice(start, i).replace(/,\s*$/, ""));
        start = i + 6; i += 5; continue;
      }
      i++; continue;
    }
    if(c === "{") depth++;
    else if(c === "}") depth--;
  }
  parts.push(src.slice(start));
  return parts.map(t => t.trim()).filter(Boolean);
}

/* a relation wider than its formula box is set smaller until it fits (not below 55 %):
   new boxes are fitted when they enter the page, all of them again when the window changes size */
function fitDefs(all){
  document.querySelectorAll(all ? ".th-def-p" : ".th-def-p:not([data-fit])").forEach(p => {
    p.style.fontSize = "";
    const w = p.parentElement.clientWidth;
    if(!w){ delete p.dataset.fit; return; }
    p.dataset.fit = "1";
    const need = p.scrollWidth;
    if(need > w + 3) p.style.fontSize = Math.max(.55, (w - 8) / need).toFixed(3) + "em";
  });
}
(() => {
  let queued = 0;
  const run = () => { const all = queued === 2; queued = 0; fitDefs(all); };
  const ask = all => { if(!queued) requestAnimationFrame(run); queued = Math.max(queued, all ? 2 : 1); };
  const view = document.getElementById("view");
  if(view) new MutationObserver(() => ask(false)).observe(view, {childList:true, subtree:true});
  addEventListener("resize", () => ask(true));
  try{ document.fonts.ready.then(() => ask(true)); document.fonts.addEventListener("loadingdone", () => ask(true)); }catch(e){}
})();

const theoryWait = {};
function loadTheory(id){
  if(THEORY[id]) return Promise.resolve(true);
  if(!hasTheory(id)) return Promise.resolve(false);
  return theoryWait[id] ||= new Promise(res => {
    const s = document.createElement("script");
    s.src = `js/data/theory/${id}.js`;
    s.onload = () => res(!!THEORY[id]);
    s.onerror = () => { delete theoryWait[id]; res(false); };
    document.head.appendChild(s);
  });
}

/* the sections a topic's theory has, in the order of its subtopics: [{k, n, blocks}] */
function theorySections(tid){
  const th = THEORY[tid];
  if(!th) return [];
  const byKey = {};
  for(const name in th.subs) byKey[subKey(name)] = th.subs[name];
  return subsOf(tid).filter(x => byKey[x.k]).map(x => ({k:x.k, n:x.n, blocks:byKey[x.k]}));
}
const theoryToolCount = tid => theorySections(tid).reduce((n, s) => n + s.blocks.filter(b => b && (b.tool || b.fig)).length, 0);

/* ---------- a tiny static graph for cards: {fns:["x^2", …], view:[left, top, right, bottom], dots:[[x, y]]} ---------- */
function miniPlot(spec){
  const W = 132, H = 78, [x1, y1, x2, y2] = spec.view || [-4, 4, 4, -4];
  const sx = x => (x - x1) / (x2 - x1) * W, sy = y => (y1 - y) / (y1 - y2) * H;
  let h = "";
  if(y1 > 0 && y2 < 0) h += `<line class="ax" x1="0" y1="${sy(0).toFixed(1)}" x2="${W}" y2="${sy(0).toFixed(1)}"/>`;
  if(x1 < 0 && x2 > 0) h += `<line class="ax" x1="${sx(0).toFixed(1)}" y1="0" x2="${sx(0).toFixed(1)}" y2="${H}"/>`;
  (spec.fns || []).forEach((f, i) => {
    const e = mathExpr(f), pad = (y1 - y2) * .3;
    let d = "", pen = false;
    for(let k = 0; k <= 96; k++){
      const x = x1 + (x2 - x1) * k / 96, y = e.f({x});
      if(!isFinite(y) || y > y1 + pad || y < y2 - pad){ pen = false; continue; }
      d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
      pen = true;
    }
    h += `<path class="ln${i ? " l" + i : ""}" d="${d}"/>`;
  });
  (spec.dots || []).forEach(p => { h += `<circle class="dt" cx="${sx(p[0]).toFixed(1)}" cy="${sy(p[1]).toFixed(1)}" r="3.6"/>`; });
  return `<svg class="th-mini" viewBox="0 0 ${W} ${H}" aria-hidden="true">${h}</svg>`;
}

/* ---------- blocks ---------- */
function theoryBlock(b, key){
  if(typeof b === "string") return `<div class="md th-p">${md(b)}</div>`;
  if(b.h) return `<h3 class="th-h3">${inline(b.h)}</h3>`;
  if(b.warn) return `<div class="callout co-warn th-call"><div class="co-label">Pozor</div>${md(b.warn)}</div>`;
  if(b.tip) return `<div class="callout co-tip th-call"><div class="co-label${b.label ? " plain" : ""}">${esc(b.label || "Tip")}</div>${md(b.tip)}</div>`;
  if(b.tool) return toolFigure(b, key);

  if(b.def != null) return `<div class="th-def">
    <div class="th-label">${inline(b.def)}</div>
    <div class="th-def-f${b.mid ? " mid" : ""}">${defParts(b.tex).map(t => `<span class="th-def-p">${tex(t, false)}</span>`).join("")}</div>
    ${b.note ? `<div class="th-def-note">${inline(b.note)}</div>` : ""}
    ${b.legend ? `<div class="th-legend">${b.legend.map(l =>
      `<div><span class="th-sym c-${l[1]}">${tex(l[0], false)}</span><div><b>${inline(l[2])}</b><span>${inline(l[3])}</span></div></div>`).join("")}</div>` : ""}
  </div>`;

  if(b.cards) return `<div class="th-cards">${b.cards.map(c => `<div class="th-card">
      ${c.fig ? miniPlot(c.fig) : ""}
      ${c.t ? `<b>${inline(c.t)}</b>` : ""}
      ${c.d ? `<span>${inline(c.d)}</span>` : ""}
      ${c.tex ? `<div class="th-card-f">${tex(c.tex, false)}</div>` : ""}
    </div>`).join("")}</div>`;

  if(b.ex != null){
    /* a worked example as a task: the steps and the result stay hidden until answered (js/exercise.js) */
    const k = exKey(key.split(":")[0], b);
    exBlocks[k] = b;
    const x = exOf(k), hints = x ? Infinity : (exUi[k] || {}).hints || 0;
    return `<div class="th-ex${x ? "" : " ex-shut"}" data-ex="${esc(k)}">
    <div class="th-ex-h"><div class="th-label">Riešený príklad</div><div class="md">${md(b.ex)}</div></div>
    <div class="${b.fig ? "th-ex-two" : ""}">
      <div class="th-ex-sol">
        <p class="ex-ph"${x || hints ? " hidden" : ""}>Riešenie je skryté. Skús to vypočítať a napíš odpoveď, potom sa ukáže postup aj výsledok.</p>
        <ol class="th-ex-steps">${b.steps.map((s, i) => `<li${i >= hints ? " hidden" : ""}><span>${inline(s[0])}</span>${s[1] ? `<div class="th-ex-f">${tex("\\displaystyle " + s[1], false)}</div>` : ""}</li>`).join("")}</ol>
      </div>
      ${b.fig ? `<div class="th-ex-fig">${toolFigure(Object.assign({kind:"obr"}, b.fig), key, "tw-bare")}</div>` : ""}
    </div>
    <div class="th-ex-ans">${exFormHtml(k, b)}</div>
    <div class="th-ex-res"${x ? "" : " hidden"}><div class="th-label">Výsledok</div><div class="md">${md(b.res)}</div></div>
  </div>`;
  }

  if(b.steps) return `<ol class="th-steps">${b.steps.map(s => `<li><b>${inline(s.t)}</b>
      ${s.d ? `<span>${inline(s.d)}</span>` : ""}${s.tex ? `<div class="th-card-f">${tex("\\displaystyle " + s.tex, false)}</div>` : ""}</li>`).join("")}</ol>`;

  if(b.map) return `<div class="th-map">${b.map.map(r => `<div><span>${inline(r[0])}${r[1] ? `<small>${inline(r[1])}</small>` : ""}</span><i>→</i><span class="th-map-f">${tex(r[2], false)}</span></div>`).join("")}
    ${b.sum ? `<div class="sum"><span>${inline(b.sum[0])}</span><i>→</i><span class="th-map-f">${tex(b.sum[1], false)}</span></div>` : ""}</div>`;

  return "";
}

function theorySectionHtml(tid, sec, i, total){
  return `<section class="th-sec" id="th-${sec.k}" data-k="${sec.k}">
    <div class="th-eye">Podtéma ${i + 1} z ${total}</div>
    <h2>${esc(sec.n)}</h2>
    ${sec.blocks.map((b, j) => theoryBlock(b, `${tid}:${sec.k}:${j}`)).join("")}
    <div class="th-rate">
      <span>Ako tomu rozumieš?</span>
      <span class="th-seg" data-k="${sec.k}">${subSeg(tid, sec.k, sec.n)}</span>
      <button class="linkish" data-act="th-note" data-k="${sec.k}">+ poznámka k tejto podtéme</button>
    </div>
  </section>`;
}

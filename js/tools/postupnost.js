/* ============================================================
   TOOL: postupnost — the terms of a sequence as bars (or dots); pick a term, watch aₙ and the sum
   Plain SVG. Click a bar to choose n.
   cfg:
     typ      "ar" (a₁, d) | "geo" (a₁, q) | "vzorec" (f, a formula in n)
     a1, d, q, n   a number or {v, min, max, step, lock, name, note} laid over the default slider
     f        "n^2 - 2n"               for typ "vzorec"; other letters need an entry in params
     params   {p:{v:5, min:0, max:10}} extra sliders a formula may use
     count    10                       how many terms are drawn
     first    1                        index of the first term (0 for "value after n years")
     y        [lo, hi]                 fixed vertical range; left out → fitted to the terms
     dots     true                     dots on stems instead of bars (a sequence as a graph)
     sym      "K"                      the letter under the bars (default a)
     marks    [{y:20, label:"20"}]     dashed horizontal lines, e.g. a value to reach
     on       {vals:true, steps:false, sum:false, pairs:false, line:false}   what is shown from the start
     toggles  ["sum"]                  which of those the reader may switch here
     out(P, h, st)                     h.seq = {n, an, sn, v:[terms], at(i)}
   ============================================================ */
const SEQ_MARKS = [
  ["vals", "Hodnoty členov", null],
  ["steps", "Kroky medzi členmi", "a"],
  ["sum", "Súčet prvých n členov", "d"],
  ["pairs", "Dvojice z opačných koncov", "b"],
  ["line", "Čiara cez vrcholy", "c"]
];
const SEQ_TYPES = {ar:"aritmetická", geo:"geometrická", vzorec:"vzorec"};

/* a round step for about `parts` gridlines across `span` */
function niceStep(span, parts = 5){
  const raw = span / parts, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

defTool("postupnost", {
  name:"Postupnosť",
  area:"Funkcie",
  desc:"Členy postupnosti ako stĺpce. Meň prvý člen, diferenciu alebo kvocient a sleduj n-tý člen a súčet.",
  topics:["a25", "a26"],
  presets:[
    {name:"Aritmetická", cfg:{typ:"ar", on:{vals:true, steps:true}}},
    {name:"Geometrická", cfg:{typ:"geo", on:{vals:true, steps:true}}},
    {name:"Klesajúca geometrická", cfg:{typ:"geo", a1:{v:64, min:-100, max:100, step:1}, q:{v:.5}, on:{vals:true, sum:true}}},
    {name:"Súčet po dvojiciach", cfg:{typ:"ar", a1:{v:1}, d:{v:1}, n:{v:10}, on:{vals:true, sum:true, pairs:true}}},
    {name:"Vlastný vzorec", cfg:{typ:"vzorec", f:"n^2 - 2n", on:{vals:true}}}
  ],
  help:`Kliknutím na stĺpec vyberieš $n$. Každé číslo pri posuvníku sa dá prepísať.

Pri ukážke **Vlastný vzorec** napíš $n$-tý člen ako na kalkulačke: \`2n + 1\`, \`n^2\`, \`3*2^(n-1)\`, \`1/n\`, \`(-1)^n\`.`,

  /* typ: aritmeticka / a1: 3 / d: 2 / n: 5 / clenov: 10 / vzorec: n^2 / ukaz: hodnoty, kroky, sucet, dvojice, ciara */
  fromText(kv){
    const cfg = {typ:"ar", on:{}, toggles:SEQ_MARKS.map(m => m[0])};
    let shown = false;
    kv.forEach(([k, v]) => {
      const key = norm(k), n = toolNums(v);
      if(key === "typ") cfg.typ = /geo/.test(norm(v)) ? "geo" : /vzor/.test(norm(v)) ? "vzorec" : "ar";
      else if(key === "vzorec"){ if(v){ cfg.f = v; cfg.typ = "vzorec"; } }
      else if(["a1", "d", "q", "n"].includes(key)){ if(n.length) cfg[key] = {v:n[0]}; }
      else if(key === "clenov"){ if(n.length) cfg.count = Math.max(2, Math.min(30, Math.round(n[0]))); }
      else if(key === "od"){ if(n.length) cfg.first = Math.round(n[0]); }
      else if(key === "ukaz"){ shown = true; toolWords(v).forEach(w => {
        if(/hodnot/.test(w)) cfg.on.vals = true; else if(/krok/.test(w)) cfg.on.steps = true; else if(/sucet/.test(w)) cfg.on.sum = true;
        else if(/dvojic/.test(w)) cfg.on.pairs = true; else if(/ciar/.test(w)) cfg.on.line = true;
      }); }
    });
    if(!shown) cfg.on = {vals:true};
    if(cfg.typ === "vzorec" && !mathExpr(cfg.f || "", ["n"]).ok) cfg.f = "n";
    return cfg;
  },
  toText(st){
    const c = st.cfg, typ = c.typ || "ar", out = [`typ: ${SEQ_TYPES[typ]}`];
    if(typ === "vzorec") out.push(`vzorec: ${c.f || "n"}`);
    else out.push(`a1: ${toolNum(st.P.a1)}`, typ === "geo" ? `q: ${toolNum(st.P.q)}` : `d: ${toolNum(st.P.d)}`);
    out.push(`n: ${toolNum(st.P.n)}`, `clenov: ${c.count || 10}`);
    if(c.first != null && c.first !== 1) out.push(`od: ${c.first}`);
    const names = {vals:"hodnoty", steps:"kroky", sum:"súčet", pairs:"dvojice", line:"čiara"};
    const show = SEQ_MARKS.filter(m => st.P[m[0]]).map(m => names[m[0]]);
    if(show.length) out.push(`ukaz: ${show.join(", ")}`);
    return out.join("\n");
  },

  make(cfg, env){
    const typ = SEQ_TYPES[cfg.typ] ? cfg.typ : "ar";
    const first = cfg.first != null ? cfg.first : 1, count = cfg.count || 10;
    const over = (def, o) => Object.assign(def, typeof o === "number" ? {v:o} : o);
    const params = {};
    if(typ === "ar"){
      params.a1 = over({v:2, min:-10, max:20, step:1, color:"b", name:"a₁", note:"prvý člen"}, cfg.a1);
      params.d = over({v:3, min:-5, max:5, step:.5, color:"a", note:"diferencia"}, cfg.d);
    } else if(typ === "geo"){
      params.a1 = over({v:1, min:-10, max:20, step:1, color:"b", name:"a₁", note:"prvý člen"}, cfg.a1);
      params.q = over({v:2, min:-3, max:3, step:.25, color:"a", note:"kvocient"}, cfg.q);
    } else Object.assign(params, cfg.params);
    params.n = over({v:Math.min(first + 4, first + count - 1), min:first, max:first + count - 1, step:1, color:"d", note:"poradie člena"}, cfg.n);

    const on = cfg.on || {vals:true};
    const free = env.full ? SEQ_MARKS.map(m => m[0]) : cfg.toggles || [];
    SEQ_MARKS.forEach(([id, name, color]) => {
      if(id === "pairs" && typ !== "ar") return;
      params[id] = {type:"check", v:!!on[id], name, color, lock:!free.includes(id)};
    });

    const fx = typ === "vzorec" ? mathExpr(cfg.f || "n", [...Object.keys(cfg.params || {}), "n"]) : null;
    /* the term with index i — i may be a real number, which is what the line through the tops uses */
    const term = (P, i) => {
      if(typ === "ar") return P.a1 + (i - first) * P.d;
      if(typ === "geo") return P.a1 * Math.pow(P.q, i - first);
      const s = Object.create(P); s.n = i;
      return fx.f(s);
    };
    const pick = P => Math.max(first, Math.round(P.n));
    const seq = P => {
      const n = pick(P), N = Math.max(count, n - first + 1), v = [];
      for(let k = 0; k < N; k++) v.push(term(P, first + k));
      let sn = 0;
      for(let k = 0; k <= n - first; k++) sn += v[k];
      return {n, N, v, an:v[n - first], sn:Math.round(sn * 1e9) / 1e9, at:i => v[i - first]};
    };

    const W = 520, H = 300, L = 48, Rt = 12, T = 52, B = 40, PB = H - B;
    const sub = i => String(i).replace(/\d/g, c => "₀₁₂₃₄₅₆₇₈₉"[c]).replace("-", "₋");

    return {
      params, aspect:`${W}/${H}`,
      hint:params.n.lock ? null : `Výber $n$: klikni na ${cfg.dots ? "bod" : "stĺpec"}.`,
      inputs:typ === "vzorec" ? [{
        label:"n-tý člen: aₙ =", wide:true, value:cfg.f || "n",
        apply(text){
          const e = mathExpr(text, [...Object.keys(cfg.params || {}), "n"]);
          if(!e.ok) return {error:e.err};
          const odd = e.vars.filter(v => v !== "n" && v !== "pi" && v !== "e" && !(cfg.params && cfg.params[v]));
          if(odd.length) return {error:`Vo vzorci môže byť len n, nie „${odd[0]}“.`};
          return Object.assign({}, cfg, {f:text});
        }
      }] : null,

      svg(P, st){
        const s = seq(P), {n, N, v} = s, k0 = n - first;
        const fin = v.filter(isFinite);
        const pairOk = P.pairs && typ === "ar" && v.slice(0, k0 + 1).every(x => x >= 0);
        /* vertical range: the one given, or whatever holds the terms (and the stacked pairs) */
        let lo, hi;
        if(cfg.y && !st.env.full){ [lo, hi] = cfg.y; }
        else {
          lo = Math.min(0, ...fin); hi = Math.max(0, ...fin);
          if(pairOk) hi = Math.max(hi, v[0] + v[k0]);
          if(hi - lo < 1e-9) hi = lo + 1;
          const st0 = niceStep(hi - lo);
          lo = Math.floor(lo / st0 + 1e-9) * st0; hi = Math.ceil(hi / st0 - 1e-9) * st0;
        }
        const tick = cfg.tick || niceStep(hi - lo);
        const slot = (W - L - Rt) / N, bw = Math.min(slot * .62, 46);
        const X = k => L + (k + .5) * slot;
        const Y = y => T + (hi - Math.max(lo, Math.min(hi, y))) / (hi - lo) * (PB - T);
        const f1 = x => x.toFixed(1);
        const thumb = st.env.thumb;
        /* a hidden, locked n means "no term is picked here" */
        const mark = !(params.n.lock && params.n.hide && !st.open);
        const fit = (x, room) => { const t = fmtN(x, 2); return t.length * 7 <= room ? t : fmtN(x, 0); };
        let h = "";

        if(P.sum && mark) h += `<rect class="ps-band" x="${f1(X(0) - slot / 2)}" y="${T - 12}" width="${f1(slot * (k0 + 1))}" height="${PB - T + 12}" rx="6"/>`;
        if(!thumb) for(let t = Math.ceil(lo / tick - 1e-9) * tick; t <= hi + 1e-9; t += tick){
          h += `<line class="ps-grid" x1="${L}" y1="${f1(Y(t))}" x2="${W - Rt}" y2="${f1(Y(t))}"/><text class="ps-yl" x="${L - 7}" y="${f1(Y(t) + 4)}">${fmtN(t, 4)}</text>`;
        }
        h += `<line class="ps-zero" x1="${L}" y1="${f1(Y(0))}" x2="${W - Rt}" y2="${f1(Y(0))}"/>`;

        /* the pairs: on top of each bar the bar from the other end, so every column is a₁ + aₙ tall */
        if(pairOk){
          for(let k = 0; k <= k0; k++) h += `<rect class="ps-pair" x="${f1(X(k) - bw / 2)}" y="${f1(Y(v[k] + v[k0 - k]))}" width="${f1(bw)}" height="${f1(Math.max(0, Y(v[k]) - Y(v[k] + v[k0 - k])))}"/>`;
          if(!thumb) h += `<text class="ps-lab b" x="${f1((X(0) + X(k0)) / 2)}" y="${f1(Y(v[0] + v[k0]) - 7)}">${k0 ? `každý stĺpec ${fmtN(v[0])} + ${fmtN(v[k0])} = ${fmtN(v[0] + v[k0])}` : fmtN(2 * v[0])}</text>`;
        }

        v.forEach((y, k) => {
          if(!isFinite(y)) return;
          const x = X(k), sel = mark && k === k0, cls = `${sel ? " sel" : ""}${k === 0 ? " first" : ""}`;
          if(cfg.dots){
            h += `<line class="ps-stem" x1="${f1(x)}" y1="${f1(Y(0))}" x2="${f1(x)}" y2="${f1(Y(y))}"/>`;
            if(P.steps && k && isFinite(v[k - 1])) h += `<path class="ps-run" d="M${f1(X(k - 1))} ${f1(Y(v[k - 1]))}H${f1(x)}"/><path class="ps-rise" d="M${f1(x)} ${f1(Y(v[k - 1]))}V${f1(Y(y))}"/>`;
          } else {
            const top = Math.min(Y(0), Y(y)), ht = Math.abs(Y(0) - Y(y));
            h += `<rect class="ps-bar${cls}" x="${f1(x - bw / 2)}" y="${f1(top)}" width="${f1(bw)}" height="${f1(Math.max(ht, 1))}" rx="2"/>`;
            /* what was added since the previous term — or, when the terms shrink, what is missing */
            const p = v[k - 1];
            if(P.steps && k && isFinite(p) && p * y >= 0 && p !== y){
              const a = Y(p), b = Y(y), grow = Math.abs(y) > Math.abs(p);
              h += `<rect class="ps-cap${grow ? "" : " gone"}" x="${f1(x - bw / 2)}" y="${f1(Math.min(a, b))}" width="${f1(bw)}" height="${f1(Math.abs(a - b))}" rx="2"/>`;
            }
          }
        });
        if(cfg.dots) v.forEach((y, k) => { if(isFinite(y)) h += `<circle class="ps-dot${mark && k === k0 ? " sel" : ""}${k === 0 ? " first" : ""}" cx="${f1(X(k))}" cy="${f1(Y(y))}" r="${mark && k === k0 ? 6.5 : 5}"/>`; });

        if(P.line && (typ !== "geo" || P.q > 0)){
          let d = "", pen = false;
          for(let j = 0; j <= 80; j++){
            const i = first - .4 + (N - .2) * j / 80, y = term(P, i);
            if(!isFinite(y) || y > hi || y < lo){ pen = false; continue; }
            d += `${pen ? "L" : "M"}${f1(L + (i - first + .5) * slot)} ${f1(Y(y))}`;
            pen = true;
          }
          h += `<path class="ps-line" d="${d}"/>`;
        }
        (cfg.marks || []).forEach(m => {
          h += `<line class="ps-mark" x1="${L}" y1="${f1(Y(m.y))}" x2="${W - Rt}" y2="${f1(Y(m.y))}"/>`
            + (m.label && !thumb ? `<text class="ps-lab c" x="${L + 6}" y="${f1(Y(m.y) - 6)}" style="text-anchor:start">${esc(m.label)}</text>` : "");
        });

        if(!thumb){
          /* the step from one term to the next, written above the gap between them */
          if(P.steps && slot >= 30){
            for(let k = 0; k < N - 1; k++){
              if(!isFinite(v[k]) || !isFinite(v[k + 1])) continue;
              const dv = v[k + 1] - v[k];
              const t = typ === "geo" ? "·" + (P.q < 0 ? `(${fmtN(P.q)})` : fmtN(P.q)) : (dv < 0 ? "−" : "+") + fit(Math.abs(dv), slot - 16);
              const a = X(k) + 6, b = X(k + 1) - 6, m = (a + b) / 2;
              h += `<path class="ps-arc" d="M${f1(a)} 30Q${f1(m)} 15 ${f1(b)} 30"/><path class="ps-arh" d="M${f1(b - 6)} 26.5L${f1(b)} 30L${f1(b - 1.5)} 23.5"/>`;
              if(t.length * 7 <= slot + 4) h += `<text class="ps-lab a" x="${f1(m)}" y="13">${t}</text>`;
            }
          }
          v.forEach((y, k) => {
            const x = X(k), sel = mark && k === k0;
            h += `<text class="ps-ix${sel ? " sel" : ""}" x="${f1(x)}" y="${H - 12}">${slot >= 34 ? esc(cfg.sym || "a") + sub(first + k) : first + k}</text>`;
            if(!isFinite(y) || (!P.vals && !sel)) return;
            let t = fit(y, sel ? slot + 4 : slot - 4);
            if(t.length * 7 > slot + 6 && !sel) return;
            const up = y >= 0 || cfg.dots, off = cfg.dots ? 11 : 6;
            const yy = pairOk && k <= k0 ? Y(y) + 14 : up ? Y(y) - off : Y(y) + 15;
            if(pairOk && k <= k0 && Y(0) - Y(y) < 18) return;
            h += `<text class="ps-val${sel ? " sel" : ""}${pairOk && k <= k0 ? " in" : ""}" x="${f1(x)}" y="${f1(yy)}">${t}</text>`;
          });
          v.forEach((y, k) => { h += `<rect class="ps-hit" data-i="${first + k}" x="${f1(X(k) - slot / 2)}" y="${T - 12}" width="${f1(slot)}" height="${H - T + 12}"/>`; });
        }
        return `<svg viewBox="0 0 ${W} ${H}" class="ps-svg${params.n.lock && !st.open ? "" : " pick"}" xmlns="http://www.w3.org/2000/svg">${h}</svg>`;
      },

      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest(".ps-hit");
          const p = st.w.params.n;
          if(!hit || !p || (p.lock && !st.open)) return;
          st.P.n = Number(hit.dataset.i);
          toolCtl(st);
          toolUpdate(st);
        });
      },

      out(P, h, st){
        const s = seq(P), {n, an, sn} = s;
        h.seq = s;
        if(cfg.out) return cfg.out(P, h, st);
        const tn = h.tn, eq = x => Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? "=" : "\\doteq";
        const c = (x, col) => x < 0 ? `\\left(\\v${col}{${tn(x)}}\\right)` : `\\v${col}{${tn(x)}}`;
        const steps = n - first, cnt = steps + 1;
        let o = "";
        if(typ === "ar"){
          o += h.calc(`a_{\\vd{${n}}} = \\vb{${tn(P.a1)}} + ${steps} \\cdot ${c(P.d, "a")} = ${tn(an)}`);
          if(P.sum) o += h.calc(`s_{\\vd{${n}}} = \\dfrac{${cnt} \\cdot (${tn(P.a1)} + ${tn(an)})}{2} = ${tn(sn)}`);
          o += P.d > 0 ? h.pill("d > 0 · rastúca", "up") : P.d < 0 ? h.pill("d < 0 · klesajúca", "down") : h.pill("d = 0 · konštantná", "flat");
        } else if(typ === "geo"){
          o += h.calc(`a_{\\vd{${n}}} = \\vb{${tn(P.a1)}} \\cdot ${c(P.q, "a")}^{${steps}} ${eq(an)} ${tn(an)}`);
          if(P.sum) o += P.q === 1 ? h.calc(`s_{\\vd{${n}}} = ${cnt} \\cdot ${tn(P.a1)} = ${tn(sn)}`)
            : h.calc(`s_{\\vd{${n}}} = \\vb{${tn(P.a1)}} \\cdot \\dfrac{${c(P.q, "a")}^{${cnt}} - 1}{${tn(P.q)} - 1} ${eq(sn)} ${tn(sn)}`);
          if(P.q < 0) o += h.pill("q < 0 · znamienka sa striedajú", "flat");
        } else {
          o += h.calc(`a_{\\vd{${n}}} ${eq(an)} ${tn(an)}`);
          if(P.sum) o += h.calc(`s_{\\vd{${n}}} = a_{${first}} + \\dots + a_{${n}} ${eq(sn)} ${tn(sn)}`);
        }
        return o;
      }
    };
  }
});

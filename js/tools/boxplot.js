/* ============================================================
   TOOL: boxplot — quartiles and the box plot: read from the cumulative frequency curve of grouped data,
   or found in a sorted list of raw values. Plain SVG.
   cfg:
     typ      "skupiny"   grouped data: hranice:[150, 160, 170, 180, 190, 200] (interval ends), pocty:[3, 8, 12, 5, 2]
                          the cumulative curve in %; slider p (a percentile read off the curve);
                          switches kvartily (25 %, 50 %, 75 % read off), box (the box plot under the curve)
              "data"      raw values: data:[…] as dots you can drag, the box plot above them;
                          data2:[…] a second set drawn as a box for comparison, mena:["A", "B"];  min, max, step: the axis
     on, toggles, free, lock, hide    as in toolParams
     en       true        English texts (theory of the Danish topics)
     out(P, h, st)     h.box = {n, min, q1, med, q3, max, iqr (interquartile range), rozpatie (range), pct (value at the percentile p), cum:[…] (%)}
   Quartiles of raw data: the median splits the sorted list in two halves (the middle value itself is left out
   when the count is odd); the quartiles are the medians of the halves.
   ============================================================ */
function fiveNum(data){
  const s = data.slice().sort((a, b) => a - b), n = s.length;
  const med = a => a.length ? (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2) : NaN;
  const half = Math.floor(n / 2), lower = s.slice(0, half), upper = s.slice(n - half);
  const q1 = n > 1 ? med(lower) : med(s), q3 = n > 1 ? med(upper) : med(s);
  return {n, sorted:s, lower, upper, min:s[0], q1, med:med(s), q3, max:s[n - 1], iqr:q3 - q1, rozpatie:s[n - 1] - s[0]};
}

defTool("boxplot", {
  name:"Kvartily, sumárna krivka a krabicový graf",
  area:"Štatistika",
  desc:"Kvartily a percentily odčítané z krivky kumulatívnych početností a krabicový graf z údajov.",
  topics:["c29"],
  presets:[
    {name:"Sumárna krivka", cfg:{typ:"skupiny", on:{kvartily:true, box:true}}},
    {name:"Percentil z krivky", cfg:{typ:"skupiny", p:90}},
    {name:"Krabicový graf z údajov", cfg:{typ:"data"}},
    {name:"Dva súbory", cfg:{typ:"data", data:[12, 14, 15, 15, 17, 18, 20, 21, 24], data2:[9, 13, 16, 17, 18, 19, 19, 22, 27], mena:["A", "B"], min:8, max:28}}
  ],

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = cfg.typ === "data" ? "data" : "skupiny";
    const edges = (cfg.hranice || [150, 160, 170, 180, 190, 200]).slice(0, 12), freq = (cfg.pocty || [3, 8, 12, 5, 2]).slice(0, edges.length - 1);
    const raw = (cfg.data || [3, 5, 6, 6, 8, 9, 11, 12, 12, 15, 19]).slice(0, 40), raw2 = cfg.data2 || null;
    const all = typ === "data" ? [...raw, ...(raw2 || [])] : edges;
    const lo = cfg.min != null ? cfg.min : typ === "data" ? Math.min(0, Math.floor(Math.min(...all))) : edges[0];
    const hi = cfg.max != null ? cfg.max : typ === "data" ? Math.ceil(Math.max(...all) / 5) * 5 : edges[edges.length - 1], step = cfg.step || 1;
    const params = toolParams(typ === "skupiny" ? {
      p:{v:50, min:5, max:95, step:5, color:"d", note:T("percentil", "percentile")},
      kvartily:{type:"check", v:false, name:T("Kvartily (25 %, 50 %, 75 %)", "Quartiles (25 %, 50 %, 75 %)"), color:"a"},
      box:{type:"check", v:false, name:T("Krabicový graf", "Box plot"), color:"b"}
    } : {}, cfg, env);
    const W = 560, H = 320, X0 = 48, X1 = W - 18, X = v => X0 + (X1 - X0) * (v - lo) / (hi - lo);
    const total = freq.reduce((a, b) => a + b, 0), cum = freq.reduce((a, f) => [...a, a[a.length - 1] + f / total * 100], [0]);
    /* the value below which pct % of the grouped data lie: straight lines between the interval ends */
    const inv = pct => { for(let i = 1; i < cum.length; i++) if(pct <= cum[i] + 1e-9){ const d = cum[i] - cum[i - 1]; return d ? edges[i - 1] + (edges[i] - edges[i - 1]) * (pct - cum[i - 1]) / d : edges[i]; } return edges[edges.length - 1]; };
    const box = (b, y, hh, c, name) => {
      let s = SV.line(X(b.min), y, X(b.q1), y, `s ${c}`) + SV.line(X(b.q3), y, X(b.max), y, `s ${c}`) + SV.line(X(b.min), y - hh * .5, X(b.min), y + hh * .5, `s ${c}`) + SV.line(X(b.max), y - hh * .5, X(b.max), y + hh * .5, `s ${c}`)
        + SV.rect(X(b.q1), y - hh, X(b.q3) - X(b.q1), 2 * hh, `bg ${c} pa-on`) + SV.line(X(b.med), y - hh, X(b.med), y + hh, `s ${c} w3`);
      if(name) s += SV.text(X0 - 8, y + 5, name, `end ${c}`);
      return s;
    };
    const axis = (y, thumb) => {
      let s = SV.line(X0 - 6, y, X1 + 6, y, "s");
      const span = hi - lo, tk = [1, 2, 5, 10, 20, 25, 50, 100].find(t => span / t <= 12) || span / 10;
      for(let v = Math.ceil(lo / tk) * tk; v <= hi + 1e-9; v += tk) s += SV.line(X(v), y, X(v), y + 5, "s w1 csoft") + (thumb ? "" : SV.text(X(v), y + 19, fmtN(v), "mid sm csoft"));
      return s;
    };
    const five = st => typ === "data" ? fiveNum(st.data.d) : {n:total, min:edges[0], q1:inv(25), med:inv(50), q3:inv(75), max:edges[edges.length - 1], iqr:inv(75) - inv(25), rozpatie:edges[edges.length - 1] - edges[0]};

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "data" ? T("Bodky sa dajú **ťahať** po osi.", "The dots can be **dragged** along the axis.") : null,
      init(st){ st.data = typ === "data" ? {d:raw.slice()} : null; },
      inputs:typ === "data" ? [{label:T("Hodnoty (oddelené medzerou)", "Values (separated by spaces)"), wide:true, value:"", read:st => (st.data ? st.data.d : raw).map(v => fmtN(v, 4)).join(" "),
        apply(text){ const d = text.split(/[\s;]+/).map(t => toolParse(t.replace(/,$/, ""))).filter(v => !isNaN(v)).slice(0, 40); return d.length ? Object.assign({}, cfg, {data:d, min:Math.min(lo, Math.floor(Math.min(...d))), max:Math.max(hi, Math.ceil(Math.max(...d)))}) : {error:T("Napíš aspoň jednu hodnotu.", "Type at least one value.")}; }}] : null,
      svg(P, st){
        const thumb = st.env.thumb, b = five(st);
        let h = "";
        if(typ === "data"){
          const AX = H - 60, r = Math.max(4, Math.min(8, (X(lo + step) - X(lo)) * .46)), seen = {};
          h += box(b, raw2 ? 58 : 80, raw2 ? 20 : 26, "ca", raw2 ? (cfg.mena || ["A", "B"])[0] : "");
          if(raw2) h += box(fiveNum(raw2), 116, 20, "cb", (cfg.mena || ["A", "B"])[1]);
          if(!thumb && !raw2) [["min", b.min], ["Q₁", b.q1], [T("medián", "median"), b.med], ["Q₃", b.q3], ["max", b.max]].forEach(([n, v], i) => { h += SV.text(X(v), i % 2 ? 122 : 44, `${n} ${fmtN(v)}`, "mid sm ca halo"); });
          h += axis(AX, thumb);
          st.data.d.forEach((v, i) => {
            const k = seen[v] = (seen[v] || 0) + 1, y = AX - 5 - r - (k - 1) * r * 2.1, inBox = v >= b.q1 && v <= b.q3;
            h += SV.circle(X(v), y, r, `h ${inBox ? "ca" : "cink"}`, thumb ? "" : ` data-drag="${i}"`);
          });
          return SV.wrap(W, H, h);
        }
        const Y0 = 22, Y1 = P.box ? H - 106 : H - 44, Y = pc => Y1 - (Y1 - Y0) * pc / 100;
        for(let pc = 0; pc <= 100; pc += 25) h += SV.line(X0, Y(pc), X1, Y(pc), "s cgrid w1") + (thumb ? "" : SV.text(X0 - 6, Y(pc) + 4, pc + " %", "end sm csoft"));
        edges.forEach(e => { h += SV.line(X(e), Y0, X(e), Y1, "s cgrid w1"); });
        const read = (pc, c, name) => { const v = inv(pc); return SV.path(`M${X0} ${Y(pc)}H${X(v)}V${Y1}`, `s ${c} w1 dash`) + SV.circle(X(v), Y(pc), 3.5, `f ${c}`) + (thumb ? "" : SV.text(X(v) + 6, Y1 - 6, `${name ? name + " = " : ""}${fmtN(v, 1)}`, `sm ${c} halo`)); };
        if(P.kvartily) h += read(25, "ca", "Q₁") + read(50, "ca", "m") + read(75, "ca", "Q₃");
        else h += read(P.p, "cd", "");
        h += SV.path(SV.d(edges.map((e, i) => [X(e), Y(cum[i])])), "s w3") + edges.map((e, i) => SV.circle(X(e), Y(cum[i]), 3.2, "f cink")).join("") + axis(Y1, thumb);
        if(P.box) h += box(b, H - 44, 18, "cb", "");
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        svgDrag(el, st, (id, x) => {
          const i = Number(id), v = round2(Math.max(lo, Math.min(hi, Math.round((lo + (x - X0) / (X1 - X0) * (hi - lo)) / step) * step)));
          if(v === st.data.d[i]) return false;
          st.data.d[i] = v;
        });
      },
      out(P, h, st){
        const tn = h.tn, b = five(st);
        h.box = Object.assign({}, b, typ === "skupiny" ? {pct:inv(P.p), cum} : null);
        if(cfg.out) return cfg.out(P, h, st);
        const sum5 = h.calc(`Q_1 = \\va{${tn(b.q1, 1)}}, \\quad m = \\va{${tn(b.med, 1)}}, \\quad Q_3 = \\va{${tn(b.q3, 1)}}`) + h.calc(`\\text{min} = ${tn(b.min, 1)}, \\qquad \\text{max} = ${tn(b.max, 1)}`)
          + h.calc(`Q_3 - Q_1 = ${tn(b.iqr, 1)}, \\qquad \\text{max} - \\text{min} = ${tn(b.rozpatie, 1)}`);
        if(typ === "data"){
          const mark = (arr, c) => arr.map(v => fmtN(v)).join(", ");
          return `<div>${T("Zoradené", "Sorted")} (${b.n}): <span class="ca">${mark(b.lower)}</span>${b.n % 2 ? ` | <b>${fmtN(b.med)}</b> | ` : " | "}<span class="ca">${mark(b.upper)}</span></div>`
            + sum5 + h.p(T("Medián delí zoradené údaje na dve polovice, kvartily sú mediány týchto polovíc. V krabici leží prostredná polovica údajov.", "The median splits the sorted data in two halves; the quartiles are the medians of the halves. The box holds the middle half of the data."));
        }
        const rows = freq.map((f, i) => `<tr><td class="l">${fmtN(edges[i])}–${fmtN(edges[i + 1])}</td><td>${f}</td><td>${fmtN(cum[i + 1], 1)} %</td></tr>`).join("");
        return `<div class="tw-tab"><table><tr><th class="l">${T("interval", "interval")}</th><th>${T("počet", "count")}</th><th>${T("kumul.", "cumul.")}</th></tr>${rows}</table></div>`
          + (P.kvartily || P.box ? sum5 : h.calc(`\\vd{${P.p}\\ \\%}\\ \\text{${T("údajov je najviac", "of the data are at most")}}\\ \\vd{${tn(inv(P.p), 1)}}`))
          + h.p(T("Od percenta na zvislej osi choď vodorovne ku krivke a potom zvislo dolu.", "From the percentage on the vertical axis go across to the curve, then straight down."));
      }
    };
  }
});

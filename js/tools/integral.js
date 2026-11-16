/* ============================================================
   TOOL: integral — the definite integral as an area: sums of rectangles, signed area with the area
   function, the area between two graphs, a solid of revolution. JSXGraph board.
   cfg:
     f        "x^2/4 + 1"    the function of x (typed on the tool's own page);  g  the second one (typ "medzi")
     typ      "sucty"        n rectangles on [a, b];  druh: "lavy" | "pravy" | "stred" | "lichobeznik" (how their height is taken)
              "plocha"       the area between the graph and the x-axis on [a, b], counted with its sign;
                             F:"x^3/3" (an antiderivative: F(b) − F(a) is printed);  switch funkcia (the area function A(x) = ∫ from a to x)
              "medzi"        the area between f and g; the limits are their intersections (auto:false → sliders a, b)
              "rotacia"      the graph on [a, b] turned round the x-axis: V = π ∫ f(x)² dx
     a, b, n  a number or {v, min, max, step, lock};  on / toggles / free / lock / hide as in toolParams
     view     [left, top, right, bottom];  tick, aspect;  apart:true scales the axes separately (give tick:[x, y])
     en       true           English texts (theory of the Danish topics)
     out(P, h, st)     h.int = {a, b, I (the integral), S (sum of the rectangles), A (area, unsigned), V, xs:[intersections]}
   Helper: simpson(f, a, b) — a numerical integral
   ============================================================ */
function simpson(f, a, b, n = 400){
  if(!(b > a)) return b < a ? -simpson(f, b, a, n) : 0;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for(let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
}

defTool("integral", {
  name:"Určitý integrál a plocha",
  area:"Matematická analýza",
  desc:"Plocha pod grafom z obdĺžnikov, určitý integrál so znamienkom, plocha medzi dvoma grafmi a objem rotačného telesa.",
  topics:["c8", "c9", "c11", "c12"],
  presets:[
    {name:"Súčty obdĺžnikov", cfg:{typ:"sucty"}, tip:"Pridávaj diely: súčet obsahov obdĺžnikov sa blíži k obsahu pod grafom, teda k integrálu."},
    {name:"Stredy a lichobežníky", cfg:{typ:"sucty", druh:"lichobeznik", n:4}, tip:"Výška obdĺžnika v strede dielu alebo lichobežník namiesto obdĺžnika dajú lepší odhad pri rovnakom počte dielov."},
    {name:"Integrál so znamienkom", cfg:{typ:"plocha"}, tip:"Plocha pod osou $x$ sa počíta záporne. Integrál preto nie je to isté ako obsah."},
    {name:"Funkcia plochy", cfg:{typ:"plocha", f:"x/2 + 1", a:0, b:3, view:[-1, 7, 6, -1], on:{funkcia:true}}, tip:"Posúvaj hornú hranicu: plocha $A(x)$ rastie rýchlosťou $f(x)$. To je základná veta integrálneho počtu."},
    {name:"Plocha medzi grafmi", cfg:{typ:"medzi"}, tip:"Medze sú priesečníky grafov. Integruje sa rozdiel „horná mínus dolná“."},
    {name:"Rotačné teleso", cfg:{typ:"rotacia"}, tip:"Otáčaním grafu okolo osi $x$ vzniká teleso z tenkých kotúčov: $V = \\pi \\int f(x)^2\\,dx$."}
  ],
  help:"Funkciu píš ako v nástroji Graf funkcie: `x^2/4 + 1`, `sin(x)`, `sqrt(x)`, `exp(-x)`.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = ["sucty", "plocha", "medzi", "rotacia"].includes(cfg.typ) ? cfg.typ : "sucty";
    const druh = ["lavy", "pravy", "stred", "lichobeznik"].includes(cfg.druh) ? cfg.druh : "lavy";
    const src = cfg.f || {sucty:"x^2/4 + 1", plocha:"x^2 - 2x", medzi:"x + 2", rotacia:"sqrt(x)"}[typ], src2 = typ === "medzi" ? cfg.g || "x^2" : null;
    const E = mathExpr(src, []), f = x => E.f({x}), E2 = src2 ? mathExpr(src2, []) : null, g2 = x => E2.f({x}), EF = cfg.F ? mathExpr(cfg.F, []) : null;
    const view = cfg.view || {sucty:[-1, 6, 5, -1], plocha:[-2, 4, 4, -2], medzi:[-3, 5, 4, -1], rotacia:[-1, 3.5, 6, -3.5]}[typ];
    const xs = typ === "medzi" ? findRoots(x => f(x) - g2(x), view[0], view[2]) : [], auto = typ === "medzi" && cfg.auto !== false && xs.length > 1;
    const lim = (v, color) => ({v, min:Math.ceil(view[0]), max:Math.floor(view[2]), step:.25, color});
    const ab = {sucty:[0, 4], plocha:[-1, 3], medzi:[-1, 2], rotacia:[0, 4]}[typ];
    const params = toolParams({
      a:auto ? null : lim(ab[0], "a"), b:auto ? null : lim(ab[1], "b"),
      n:typ === "sucty" ? {v:6, min:1, max:40, step:1, color:"d", note:T("počet dielov", "number of strips")} : null,
      funkcia:typ === "plocha" ? {type:"check", v:false, name:T("Funkcia plochy A(x)", "Area function A(x)"), color:"c"} : null
    }, cfg, env);
    const A = P => auto ? xs[0] : Math.min(P.a, P.b), B = P => auto ? xs[xs.length - 1] : Math.max(P.a, P.b);
    const hgt = (x, w) => druh === "lavy" ? f(x) : druh === "pravy" ? f(x + w) : druh === "stred" ? f(x + w / 2) : (f(x) + f(x + w)) / 2;
    const sum = P => { const a = A(P), w = (B(P) - a) / P.n; let s = 0; for(let i = 0; i < P.n; i++) s += hgt(a + i * w, w) * w; return s; };

    return {
      params,
      board:{bbox:view, tick:cfg.tick || 1, free:!!cfg.apart, aspect:cfg.aspect || (typ === "rotacia" ? "1/1" : "7/6")},
      inputs:[{label:"f(x) =", value:src, apply(text){ const e = mathExpr(text, []); return e.ok && e.vars.every(v => ["x", "pi", "e"].includes(v)) ? Object.assign({}, cfg, {f:text, F:null}) : {error:e.err || T("Funkcia smie obsahovať len premennú x.", "Only the variable x may be used.")}; }},
        ...(typ === "medzi" ? [{label:"g(x) =", value:src2, apply(text){ const e = mathExpr(text, []); return e.ok ? Object.assign({}, cfg, {g:text}) : {error:e.err}; }}] : [])],
      draw(g, P){
        /* a filled shape whose outline is computed again on every change */
        const shape = (color, data, o) => { const c = g.b.create("curve", [[0], [0]], Object.assign({strokeWidth:0, fillColor:g.col(color), fillOpacity:.24, highlight:false, fixed:true}, o)); c.updateDataArray = function(){ const d = data(); this.dataX = d.map(p => p[0]); this.dataY = d.map(p => p[1]); }; return c; };
        const along = (fn, a, b, n = 120) => Array.from({length:n + 1}, (_, i) => { const x = a + (b - a) * i / n, y = fn(x); return [x, isFinite(y) ? y : 0]; });
        if(typ === "sucty") shape("d", () => {
          const a = A(P), w = (B(P) - a) / P.n, pts = [[a, 0]];
          for(let i = 0; i < P.n; i++){
            const x = a + i * w;
            if(druh === "lichobeznik") pts.push([x, f(x)], [x + w, f(x + w)], [x + w, 0]);
            else { const y = hgt(x, w); pts.push([x, y], [x + w, y], [x + w, 0]); }
          }
          return pts;
        }, {strokeWidth:1.2, strokeColor:g.col("d")});
        if(typ === "plocha"){
          shape("a", () => [[A(P), 0], ...along(x => Math.max(0, f(x)), A(P), B(P)), [B(P), 0]]);
          shape("warn", () => [[A(P), 0], ...along(x => Math.min(0, f(x)), A(P), B(P)), [B(P), 0]]);
          g.fn((x, p) => p.funkcia && x >= A(p) - 1e-9 ? simpson(f, A(p), x, 60) : NaN, "c", {dash:2, strokeWidth:2.2});
        }
        if(typ === "medzi") shape("a", () => [...along(f, A(P), B(P)), ...along(g2, B(P), A(P))]);
        if(typ === "rotacia"){
          shape("a", () => [...along(f, A(P), B(P)), ...along(x => -f(x), B(P), A(P))]);
          g.fn((x, p) => x >= A(p) && x <= B(p) ? -f(x) : NaN, "ink", {dash:2, strokeWidth:1.6});
          for(let i = 0; i <= 4; i++){
            const at = p => A(p) + (B(p) - A(p)) * i / 4, st2 = Object.create(null);
            g.b.create("curve", [t => at(P) + .22 * Math.abs(f(at(P))) * Math.cos(t), t => f(at(P)) * Math.sin(t), 0, 2 * Math.PI], {strokeColor:g.col(i === 0 || i === 4 ? "ink" : "soft"), strokeWidth:i === 0 || i === 4 ? 1.8 : 1, highlight:false, fixed:true});
          }
        }
        g.fn(x => f(x), "ink");
        if(typ === "medzi") g.fn(x => g2(x), "c");
        [A, B].forEach((L, i) => {
          g.seg([p => L(p), 0], [p => L(p), p => f(L(p))], i ? "b" : "a", {dash:2, strokeWidth:1.6});
          g.txt(p => L(p), 0, i ? "b" : "a", i ? "b" : "a", {at:f(L(P)) >= 0 ? "b" : "t"});
        });
        if(typ === "medzi") xs.forEach(x => g.pt(x, f(x), "d"));
      },
      out(P, h, st){
        const tn = h.tn, a = A(P), b = B(P), I = simpson(typ === "medzi" ? x => f(x) - g2(x) : f, a, b), ftex = exprShow(src, {}, {}, []);
        const r = h.int = {a, b, I, xs};
        if(typ === "sucty") r.S = sum(P);
        if(typ === "plocha" || typ === "medzi") r.A = simpson(x => Math.abs(typ === "medzi" ? f(x) - g2(x) : f(x)), a, b, 2000);
        if(typ === "rotacia") r.V = Math.PI * simpson(x => f(x) * f(x), a, b);
        if(cfg.out) return cfg.out(P, h, st);
        const lims = `\\int_{\\va{${tn(a)}}}^{\\vb{${tn(b)}}}`;
        if(typ === "sucty"){
          const name = {lavy:T("výška v ľavom kraji", "height at the left end"), pravy:T("výška v pravom kraji", "height at the right end"), stred:T("výška v strede", "height at the midpoint"), lichobeznik:T("lichobežníky", "trapezoids")}[druh];
          return h.calc(`f(x) = ${ftex}`) + h.p(`$\\vd{${P.n}}$ ${T("dielov šírky", "strips of width")} $${tn((b - a) / P.n, 3)}$, ${name}`)
            + h.calc(`\\text{${T("súčet", "sum")}} \\doteq \\vd{${tn(r.S, 3)}}`) + h.calc(`${lims} f(x)\\,dx \\doteq ${tn(I, 3)}`)
            + h.p(`${T("Rozdiel", "Difference")}: $${tn(Math.abs(r.S - I), 3)}$. ${T("S rastúcim počtom dielov sa zmenšuje.", "It shrinks as the number of strips grows.")}`);
        }
        if(typ === "plocha"){
          const Fa = EF ? EF.f({x:a}) : NaN, Fb = EF ? EF.f({x:b}) : NaN;
          return h.calc(`f(x) = ${ftex}`) + h.calc(`${lims} f(x)\\,dx \\doteq ${tn(I, 3)}`)
            + (EF && EF.ok ? h.calc(`F(x) = ${exprShow(cfg.F, {}, {}, [])}`) + h.calc(`F(\\vb{${tn(b)}}) - F(\\va{${tn(a)}}) = ${tn(Fb, 3)} - ${Fa < 0 ? `(${tn(Fa, 3)})` : tn(Fa, 3)} = ${tn(Fb - Fa, 3)}`) : "")
            + (Math.abs(r.A - Math.abs(I)) > 1e-6 ? h.p(`${T("Časť pod osou sa odčíta. Skutočná plocha je", "The part below the axis is subtracted. The actual area is")} $${tn(r.A, 3)}$.`) : "")
            + (P.funkcia ? h.p(T("Čiarkovaná krivka je $A(x) = \\int_a^x f(t)\\,dt$. Jej sklon v každom bode je $f(x)$.", "The dashed curve is $A(x) = \\int_a^x f(t)\\,dt$. Its slope at every point is $f(x)$.")) : "");
        }
        if(typ === "medzi") return h.calc(`f(x) = ${ftex}, \\qquad \\vc{g(x) = ${exprShow(src2, {}, {}, [])}}`)
          + (auto ? h.p(`${T("Priesečníky", "Intersections")}: ${xs.map(x => `$x = ${tn(x, 3)}$`).join(", ")}`) : "")
          + h.calc(`${lims} \\big(f(x) - g(x)\\big)\\,dx \\doteq ${tn(I, 3)}`) + h.calc(`\\text{${T("plocha", "area")}} \\doteq \\va{${tn(r.A, 3)}}`)
          + (Math.abs(r.A - Math.abs(I)) > 1e-6 ? h.p(T("Grafy sa medzi hranicami krížia: integruj po častiach, vždy horná mínus dolná.", "The graphs cross between the limits: integrate piece by piece, always upper minus lower.")) : "");
        return h.calc(`f(x) = ${ftex}`) + h.calc(`V = \\pi ${lims} f(x)^2\\,dx \\doteq \\pi \\cdot ${tn(r.V / Math.PI, 3)} \\doteq \\va{${tn(r.V, 2)}}`)
          + h.p(T("Rez kolmý na os $x$ je kruh s polomerom $f(x)$, teda s obsahom $\\pi f(x)^2$.", "A slice perpendicular to the $x$-axis is a disc of radius $f(x)$, so its area is $\\pi f(x)^2$."));
      }
    };
  }
});

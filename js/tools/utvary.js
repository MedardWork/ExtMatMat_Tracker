/* ============================================================
   TOOL: utvary — perimeter and area of plane figures: rectangle, parallelogram, triangle, trapezium,
   rhombus (from its diagonals) and regular polygons. Plain SVG, drawn in one fixed scale.
   cfg:
     typ      "obdlznik"      a, b
              "rovnobeznik"   a, b, uhol (the angle between them)
              "trojuholnik"   a (base), v (height), posun (where the top sits above the base)
              "lichobeznik"   a, c (the parallel sides), v, posun
              "kosostvorec"   e, f (the diagonals)
              "mnohouholnik"  n (number of sides), a (side)
     on       {premena:true}  the rectangle the figure can be turned into (why the formula works)
     a, b, c, v, e, f, n, uhol, posun     a number or {v, min, max, step, lock};  free / lock / hide / toggles
     out(P, h, st)     h.fig = {S, o, v, strana, uhol, uhlopriecok, r, ro}
   ============================================================ */
defTool("utvary", {
  name:"Obvod a obsah",
  area:"Planimetria",
  desc:"Obdĺžnik, rovnobežník, trojuholník, lichobežník, kosoštvorec a pravidelný mnohouholník: obvod, obsah a prečo vzorec funguje.",
  topics:["a33", "a35"],
  presets:[
    {name:"Rovnobežník", cfg:{typ:"rovnobeznik", on:{premena:true}}},
    {name:"Trojuholník", cfg:{typ:"trojuholnik", on:{premena:true}}},
    {name:"Lichobežník", cfg:{typ:"lichobeznik", on:{premena:true}}},
    {name:"Kosoštvorec", cfg:{typ:"kosostvorec", on:{premena:true}}},
    {name:"Obdĺžnik", cfg:{typ:"obdlznik"}},
    {name:"Pravidelný mnohouholník", cfg:{typ:"mnohouholnik"}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["obdlznik", "rovnobeznik", "trojuholnik", "lichobeznik", "kosostvorec", "mnohouholnik"].includes(cfg.typ) ? cfg.typ : "rovnobeznik";
    const sl = (v, color, note, min = 1, max = 10) => ({v, min, max, step:.5, color, note});
    const pre = {type:"check", v:false, name:"Premena na obdĺžnik"};
    const defs = typ === "obdlznik" ? {a:sl(6, "a"), b:sl(4, "b", null, 1, 8)}
      : typ === "rovnobeznik" ? {a:sl(6, "a"), b:sl(4, "b", null, 1, 8), uhol:{v:60, min:20, max:160, step:5, name:"α", note:"uhol strán", color:"d"}, premena:pre}
      : typ === "trojuholnik" ? {a:sl(7, "a", "základňa"), v:sl(4, "b", "výška", 1, 8), posun:{v:2, min:-3, max:12, step:.5, name:"posun", note:"vrcholu", plain:true}, premena:pre}
      : typ === "lichobeznik" ? {a:sl(8, "a", "základňa"), c:sl(4, "d", "základňa", 1, 8), v:sl(4, "b", "výška", 1, 8), posun:{v:1.5, min:-2, max:8, step:.5, name:"posun", note:"hornej základne", plain:true}, premena:pre}
      : typ === "kosostvorec" ? {e:sl(8, "a", "uhlopriečka", 1, 12), f:sl(5, "b", "uhlopriečka", 1, 8), premena:pre}
      : {n:{v:6, min:3, max:12, step:1, color:"d", note:"počet strán"}, a:sl(3, "a", "strana", 1, 5)};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, u = typ === "mnohouholnik" ? 14 : 27, rad = d => d * Math.PI / 180;
    const calc = P => {
      if(typ === "obdlznik") return {S:P.a * P.b, o:2 * (P.a + P.b), d:Math.hypot(P.a, P.b), pts:[[0, 0], [P.a, 0], [P.a, P.b], [0, P.b]]};
      if(typ === "rovnobeznik"){ const v = P.b * Math.sin(rad(P.uhol)), x = P.b * Math.cos(rad(P.uhol)); return {S:P.a * v, o:2 * (P.a + P.b), v, x, pts:[[0, 0], [P.a, 0], [P.a + x, v], [x, v]]}; }
      if(typ === "trojuholnik"){ const b = Math.hypot(P.a - P.posun, P.v), c = Math.hypot(P.posun, P.v); return {S:P.a * P.v / 2, o:P.a + b + c, v:P.v, b, c, pts:[[0, 0], [P.a, 0], [P.posun, P.v]]}; }
      if(typ === "lichobeznik"){ const d = Math.hypot(P.posun, P.v), b = Math.hypot(P.a - P.posun - P.c, P.v); return {S:(P.a + P.c) * P.v / 2, o:P.a + P.c + b + d, v:P.v, b, d, m:(P.a + P.c) / 2, pts:[[0, 0], [P.a, 0], [P.posun + P.c, P.v], [P.posun, P.v]]}; }
      if(typ === "kosostvorec"){ const a = Math.hypot(P.e, P.f) / 2; return {S:P.e * P.f / 2, o:4 * a, strana:a, pts:[[0, P.f / 2], [P.e / 2, 0], [P.e, P.f / 2], [P.e / 2, P.f]]}; }
      const n = Math.round(P.n), r = P.a / (2 * Math.sin(Math.PI / n)), ro = P.a / (2 * Math.tan(Math.PI / n)), pts = [];
      for(let i = 0; i < n; i++){ const t = -Math.PI / 2 - Math.PI / n + 2 * Math.PI * i / n; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
      return {S:n * P.a * ro / 2, o:n * P.a, n, r, ro, uhol:(n - 2) * 180 / n, uhlopriecok:n * (n - 3) / 2, pts};
    };

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const k = calc(P), thumb = st.env.thumb, T = (p, s, c) => thumb ? "" : SV.text(p[0], p[1] + 5, s, `mid halo ${c}`);
        const xs = k.pts.map(p => p[0]), ys = k.pts.map(p => p[1]);
        const x0 = (W - (Math.max(...xs) + Math.min(...xs)) * u) / 2, y0 = (H + (Math.max(...ys) + Math.min(...ys)) * u) / 2 + 4;
        const px = p => [x0 + p[0] * u, y0 - p[1] * u], q = k.pts.map(px);
        let h = "";
        const ghost = pts => SV.poly(pts.map(px), "bg cok vn-on") + SV.poly(pts.map(px), "s cok w1 dash");
        if(P.premena){
          if(typ === "rovnobeznik") h += ghost([[0, 0], [P.a, 0], [P.a, k.v], [0, k.v]]);
          else if(typ === "trojuholnik") h += ghost([[0, 0], [P.a, 0], [P.a, P.v / 2], [0, P.v / 2]]);
          else if(typ === "lichobeznik"){ const m0 = P.posun / 2; h += ghost([[m0, 0], [m0 + k.m, 0], [m0 + k.m, P.v], [m0, P.v]]); }
          else if(typ === "kosostvorec") h += ghost([[0, 0], [P.e, 0], [P.e, P.f], [0, P.f]]);
        }
        h += SV.poly(q, "bg cink") + SV.poly(q, "s w3");
        const base = (i, j, cls, label, off) => SG.seg(q[i], q[j], `s ${cls} w3`) + T([(q[i][0] + q[j][0]) / 2, (q[i][1] + q[j][1]) / 2 + off], label, cls);
        const height = (x, v, label) => { const f = px([x, 0]), t = px([x, v]); return SG.seg(f, t, "s cb dash") + SG.right(f, t, [f[0] + 30, f[1]]) + T([f[0] + 22, (f[1] + t[1]) / 2], label, "cb"); };
        if(typ === "obdlznik") h += base(0, 1, "ca", `a = ${fmtN(P.a)}`, 16) + SG.seg(q[1], q[2], "s cb w3") + T([q[1][0] + 34, (q[1][1] + q[2][1]) / 2], `b = ${fmtN(P.b)}`, "cb");
        else if(typ === "rovnobeznik") h += base(0, 1, "ca", `a = ${fmtN(P.a)}`, 16) + SG.seg(q[0], q[3], "s cd w3") + T([(q[0][0] + q[3][0]) / 2 - 16, (q[0][1] + q[3][1]) / 2], "b", "it cd") + height(k.x, k.v, `v = ${fmtN(k.v)}`) + SG.angle(q[0], q[1], q[3], 20, "s cd w1");
        else if(typ === "trojuholnik") h += base(0, 1, "ca", `a = ${fmtN(P.a)}`, 16) + height(P.posun, P.v, `v = ${fmtN(P.v)}`) + (P.posun < 0 || P.posun > P.a ? SG.seg(px([Math.min(0, P.posun), 0]), px([Math.max(P.a, P.posun), 0]), "s csoft w1 dash") : "");
        else if(typ === "lichobeznik") h += base(0, 1, "ca", `a = ${fmtN(P.a)}`, 16) + base(3, 2, "cd", `c = ${fmtN(P.c)}`, -14) + height(P.posun, P.v, `v = ${fmtN(P.v)}`);
        else if(typ === "kosostvorec") h += SG.seg(q[0], q[2], "s ca") + SG.seg(q[1], q[3], "s cb") + T([q[0][0] + 40, q[0][1] - 10], `e = ${fmtN(P.e)}`, "ca") + T([q[1][0] + 30, q[1][1] - 26], `f = ${fmtN(P.f)}`, "cb");
        else {
          const c = px([0, 0]), m = SG.mid(q[0], q[1]);
          h += SV.circle(c[0], c[1], k.r * u, "s cgrid w1") + SG.seg(c, q[0], "s cb w1") + SG.seg(c, q[1], "s cb w1") + SG.seg(c, m, "s cok dash") + SG.seg(q[0], q[1], "s ca w3") + SG.dot(c, "f", 3)
            + T([m[0], m[1] + 15], `a = ${fmtN(P.a)}`, "ca") + SG.angle(q[1], q[0], q[2 % k.n], 16, "s cd w1");
        }
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const k = calc(P), tn = h.tn;
        h.fig = k;
        if(cfg.out) return cfg.out(P, h, st);
        const A = `\\va{${tn(P.a)}}`;
        if(typ === "obdlznik") return h.calc(`S = \\va{a} \\cdot \\vb{b} = ${A} \\cdot \\vb{${tn(P.b)}} = ${tn(k.S)}`) + h.calc(`o = 2(\\va{a} + \\vb{b}) = ${tn(k.o)}`) + h.p(`Uhlopriečka: $\\sqrt{a^2 + b^2} \\doteq ${tn(k.d)}$`);
        if(typ === "rovnobeznik") return h.calc(`\\vb{v} = \\vd{b} \\cdot \\sin \\vd{\\alpha} \\doteq \\vb{${tn(k.v)}}`) + h.calc(`S = \\va{a} \\cdot \\vb{v} \\doteq ${A} \\cdot \\vb{${tn(k.v)}} \\doteq ${tn(k.S)}`) + h.calc(`o = 2(\\va{a} + \\vd{b}) = ${tn(k.o)}`)
          + (P.premena ? h.p("Odrež trojuholník na jednej strane a prilož ho na druhú: vznikne obdĺžnik $a \\times v$.") : "");
        if(typ === "trojuholnik") return h.calc(`S = \\dfrac{\\va{a} \\cdot \\vb{v}}{2} = \\dfrac{${A} \\cdot \\vb{${tn(P.v)}}}{2} = ${tn(k.S)}`) + h.calc(`o \\doteq ${tn(P.a)} + ${tn(k.b)} + ${tn(k.c)} \\doteq ${tn(k.o)}`)
          + h.p("Posúvaním vrcholu rovnobežne so základňou sa obsah **nemení**, obvod áno.");
        if(typ === "lichobeznik") return h.calc(`S = \\dfrac{(\\va{a} + \\vd{c}) \\cdot \\vb{v}}{2} = \\dfrac{(${A} + \\vd{${tn(P.c)}}) \\cdot \\vb{${tn(P.v)}}}{2} = ${tn(k.S)}`)
          + h.p(`Stredná priečka má dĺžku $\\dfrac{a + c}{2} = ${tn(k.m)}$, lichobežník má rovnaký obsah ako obdĺžnik s touto stranou a výškou $v$.`) + h.calc(`o \\doteq ${tn(k.o)}`);
        if(typ === "kosostvorec") return h.calc(`S = \\dfrac{\\va{e} \\cdot \\vb{f}}{2} = \\dfrac{\\va{${tn(P.e)}} \\cdot \\vb{${tn(P.f)}}}{2} = ${tn(k.S)}`)
          + h.calc(`a = \\sqrt{\\left(\\tfrac{e}{2}\\right)^2 + \\left(\\tfrac{f}{2}\\right)^2} \\doteq ${tn(k.strana)}, \\quad o = 4a \\doteq ${tn(k.o)}`) + h.p("Uhlopriečky sú na seba kolmé a navzájom sa rozpoľujú.");
        return h.calc(`\\text{vnútorný uhol} = \\dfrac{(\\vd{${k.n}} - 2) \\cdot 180^\\circ}{\\vd{${k.n}}} ${Number.isInteger(k.uhol) ? "=" : "\\doteq"} ${tn(k.uhol)}^\\circ`)
          + h.calc(`\\text{uhlopriečok} = \\dfrac{\\vd{${k.n}} \\cdot (\\vd{${k.n}} - 3)}{2} = ${k.uhlopriecok}`)
          + h.calc(`o = \\vd{${k.n}} \\cdot ${A} = ${tn(k.o)}, \\quad S = \\vd{${k.n}} \\cdot \\dfrac{\\va{a} \\cdot \\varrho}{2} \\doteq ${tn(k.S)}`)
          + h.p(`Polomer opísanej kružnice $r \\doteq ${tn(k.r)}$, vpísanej $\\varrho \\doteq ${tn(k.ro)}$.`);
      }
    };
  }
});

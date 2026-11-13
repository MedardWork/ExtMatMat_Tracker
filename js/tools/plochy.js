/* ============================================================
   TOOL: plochy — algebra formulas as areas: (a + b)², (a − b)², a² − b², (a + b)(c + d) and completing
   the square. Plain SVG; every piece of the picture is one term of the formula.
   cfg:
     typ      "sucet"      (a + b)² = a² + 2ab + b²
              "rozdiel"    (a − b)² = a² − 2ab + b²
              "stvorce"    a² − b² = (a − b)(a + b)        (the L-shape laid out as one rectangle)
              "sucin"      (a + b)(c + d) = ac + ad + bc + bd
              "doplnenie"  x² + p·x = (x + p/2)² − (p/2)²   sliders x and p
     a, b, c, d, x, p      a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)         h.ar = {left, right, parts:[…]}   both sides of the identity as numbers
   ============================================================ */
defTool("plochy", {
  name:"Vzorce ako obsahy",
  area:"Základy",
  desc:"Štvorec so stranou a + b rozrezaný na časti. Vidíš, odkiaľ sa berie 2ab, prečo a² − b² = (a − b)(a + b) a čo znamená doplniť na štvorec.",
  topics:["a10", "a15"],
  presets:[
    {name:"(a + b)²", cfg:{typ:"sucet"}},
    {name:"(a − b)²", cfg:{typ:"rozdiel"}},
    {name:"a² − b²", cfg:{typ:"stvorce"}},
    {name:"(a + b)(c + d)", cfg:{typ:"sucin"}},
    {name:"Doplnenie na štvorec", cfg:{typ:"doplnenie"}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["sucet", "rozdiel", "stvorce", "sucin", "doplnenie"].includes(cfg.typ) ? cfg.typ : "sucet";
    const sl = (v, color, max = 8) => ({v, min:.5, max, step:.5, color});
    const defs = typ === "sucin" ? {a:sl(4, "a"), b:sl(2, "b"), c:sl(3, "c"), d:sl(1.5, "d")}
      : typ === "doplnenie" ? {x:sl(4, "a"), p:{v:6, min:1, max:10, step:1, color:"b"}}
      : typ === "sucet" ? {a:sl(4, "a"), b:sl(2, "b")} : {a:sl(5, "a"), b:sl(2, "b", 7)};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320;

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const thumb = st.env.thumb, n = v => fmtN(v);
        let h = "";
        /* a labelled rectangle: the name of the term when it fits, its value under it */
        const box = (x, y, w, ht, cls, name, val, at = "") => {
          let s = SV.rect(x, y, w, ht, `bg ${cls}`, at) + SV.rect(x, y, w, ht, `s ${cls} w1`, at);
          if(!thumb && w > 34 && ht > 20) s += SV.text(x + w / 2, y + ht / 2 + (ht > 44 ? -2 : 5), name, `mid ${cls}`) + (ht > 44 && val != null ? SV.text(x + w / 2, y + ht / 2 + 15, n(val), `mid sm thin ${cls}`) : "");
          return s;
        };
        const side = (x0, y0, x1, y1, label, cls) => {
          const v = x0 === x1, o = 12;
          return SV.line(v ? x0 - o : x0, v ? y0 : y0 - o, v ? x1 - o : x1, v ? y1 : y1 - o, `s ${cls} w1`)
            + (thumb ? "" : SV.text(v ? x0 - o - 6 : (x0 + x1) / 2, v ? (y0 + y1) / 2 + 5 : y0 - o - 6, label, `${v ? "end" : "mid"} it ${cls}`));
        };
        if(typ === "sucet" || typ === "sucin"){
          const [a, b, c, d] = typ === "sucet" ? [P.a, P.b, P.a, P.b] : [P.a, P.b, P.c, P.d];
          const u = Math.min(250 / (c + d), 440 / (a + b)), x0 = (W - (a + b) * u) / 2 + 10, y0 = 46;
          const sq = typ === "sucet";
          h += box(x0, y0, a * u, c * u, sq ? "ca" : "cc", sq ? "a²" : "a·c", a * c) + box(x0 + a * u, y0, b * u, c * u, "cd", sq ? "a·b" : "b·c", b * c)
            + box(x0, y0 + c * u, a * u, d * u, "cd", sq ? "a·b" : "a·d", a * d) + box(x0 + a * u, y0 + c * u, b * u, d * u, sq ? "cb" : "cok", sq ? "b²" : "b·d", b * d);
          h += side(x0, y0, x0 + a * u, y0, "a", "ca") + side(x0 + a * u, y0, x0 + (a + b) * u, y0, "b", "cb")
            + side(x0, y0, x0, y0 + c * u, sq ? "a" : "c", sq ? "ca" : "cc") + side(x0, y0 + c * u, x0, y0 + (c + d) * u, sq ? "b" : "d", sq ? "cb" : "cd");
        } else if(typ === "rozdiel"){
          const a = P.a, b = Math.min(P.b, a), u = 250 / a, x0 = (W - a * u) / 2 + 10, y0 = 46, k = (a - b) * u;
          h += box(x0, y0, k, k, "cok", "(a − b)²", (a - b) * (a - b)) + box(x0 + k, y0, b * u, k, "cd", "(a−b)·b", (a - b) * b)
            + box(x0, y0 + k, k, b * u, "cd", "(a−b)·b", (a - b) * b) + box(x0 + k, y0 + k, b * u, b * u, "cb", "b²", b * b);
          h += SV.rect(x0, y0, a * u, a * u, "s ca");
          h += side(x0, y0, x0 + k, y0, "a − b", "cok") + side(x0 + k, y0, x0 + a * u, y0, "b", "cb") + side(x0, y0, x0, y0 + a * u, "a", "ca");
        } else if(typ === "stvorce"){
          const a = P.a, b = Math.min(P.b, a), u = Math.min(230 / a, 250 / (a + b)), y0 = 56, xl = 30, k = (a - b) * u;
          /* left: the square a² with the corner b² taken out; right: the same two pieces as one rectangle */
          h += box(xl, y0, a * u, k, "ca", "a·(a − b)", a * (a - b)) + box(xl, y0 + k, k, b * u, "cd", "(a−b)·b", (a - b) * b)
            + SV.rect(xl + k, y0 + k, b * u, b * u, "s cb w1 dash") + (thumb || b * u < 30 ? "" : SV.text(xl + k + b * u / 2, y0 + k + b * u / 2 + 5, "b²", "mid cb"));
          h += side(xl, y0, xl + a * u, y0, "a", "ca") + side(xl, y0, xl, y0 + a * u, "a", "ca");
          const xr = xl + a * u + 46;
          h += box(xr, y0, a * u, k, "ca", "a·(a − b)", a * (a - b)) + box(xr + a * u, y0, b * u, k, "cd", "b·(a−b)", (a - b) * b);
          h += side(xr, y0, xr + (a + b) * u, y0, "a + b", "cc") + SV.line(xr + (a + b) * u + 12, y0, xr + (a + b) * u + 12, y0 + k, "s cok w1")
            + (thumb ? "" : SV.text(xr + (a + b) * u + 18, y0 + k / 2 + 5, "a − b", "it cok"));
          if(!thumb) h += SV.text(xl + a * u + 23, y0 + k / 2 + 5, "=", "xl mid csoft");
        } else {
          const x = P.x, q = P.p / 2, u = 250 / (x + q), x0 = (W - (x + q) * u) / 2 + 10, y0 = 46;
          h += box(x0, y0, x * u, x * u, "ca", "x²", x * x) + box(x0 + x * u, y0, q * u, x * u, "cb", "p/2 · x", q * x) + box(x0, y0 + x * u, x * u, q * u, "cb", "p/2 · x", q * x)
            + SV.rect(x0 + x * u, y0 + x * u, q * u, q * u, "s cd dash") + (thumb || q * u < 34 ? "" : SV.text(x0 + (x + q / 2) * u, y0 + (x + q / 2) * u + 5, "(p/2)²", "mid sm cd"));
          h += side(x0, y0, x0 + x * u, y0, "x", "ca") + side(x0 + x * u, y0, x0 + (x + q) * u, y0, "p/2", "cb") + side(x0, y0, x0, y0 + x * u, "x", "ca") + side(x0, y0 + x * u, x0, y0 + (x + q) * u, "p/2", "cb");
        }
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const tn = h.tn, A = `\\va{${tn(P.a)}}`, B = `\\vb{${tn(P.b)}}`;
        let o = "", left, right;
        if(typ === "sucet"){
          left = (P.a + P.b) ** 2; right = P.a * P.a + 2 * P.a * P.b + P.b * P.b;
          o = h.big(`(\\va{a} + \\vb{b})^2 = \\va{a}^2 + \\vd{2ab} + \\vb{b}^2`) + h.calc(`(${A} + ${B})^2 = ${tn(P.a * P.a)} + \\vd{2 \\cdot ${tn(P.a * P.b)}} + ${tn(P.b * P.b)} = ${tn(right)}`)
            + h.p(`Dva obdĺžniky $\\vd{a \\cdot b}$ sú to, čo chýba, ak niekto napíše len $a^2 + b^2 = ${tn(P.a * P.a + P.b * P.b)}$.`);
        } else if(typ === "rozdiel"){
          left = (P.a - P.b) ** 2; right = P.a * P.a - 2 * P.a * P.b + P.b * P.b;
          o = h.big(`(\\va{a} - \\vb{b})^2 = \\va{a}^2 - \\vd{2ab} + \\vb{b}^2`) + h.calc(`(${A} - ${B})^2 = ${tn(P.a * P.a)} - \\vd{2 \\cdot ${tn(P.a * P.b)}} + ${tn(P.b * P.b)} = ${tn(right)}`)
            + h.p(`Od $a^2$ odoberieš dva pásy $a \\cdot b$. Rohový štvorec $\\vb{b^2}$ si tým odobral dvakrát, preto ho raz vrátiš.`);
        } else if(typ === "stvorce"){
          left = P.a * P.a - P.b * P.b; right = (P.a - P.b) * (P.a + P.b);
          o = h.big(`\\va{a}^2 - \\vb{b}^2 = (\\va{a} - \\vb{b})(\\va{a} + \\vb{b})`) + h.calc(`${tn(P.a * P.a)} - ${tn(P.b * P.b)} = ${tn(P.a - P.b)} \\cdot ${tn(P.a + P.b)} = ${tn(right)}`);
        } else if(typ === "sucin"){
          left = (P.a + P.b) * (P.c + P.d); right = left;
          o = h.big(`(\\va{a} + \\vb{b})(\\vc{c} + \\vd{d}) = ac + ad + bc + bd`)
            + h.calc(`${tn(P.a + P.b)} \\cdot ${tn(P.c + P.d)} = ${tn(P.a * P.c)} + ${tn(P.a * P.d)} + ${tn(P.b * P.c)} + ${tn(P.b * P.d)} = ${tn(left)}`)
            + h.p("Každý člen prvej zátvorky sa násobí s každým členom druhej: štyri obdĺžniky.");
        } else {
          const q = P.p / 2;
          left = P.x * P.x + P.p * P.x; right = (P.x + q) ** 2 - q * q;
          o = h.big(`\\va{x}^2 + \\vb{${tn(P.p)}}\\va{x} = (\\va{x} + \\vb{${tn(q)}})^2 - \\vd{${tn(q * q)}}`)
            + h.p(`Do úplného štvorca chýba roh $\\vd{(p/2)^2 = ${tn(q * q)}}$. Pridáš ho a hneď zasa odčítaš.`)
            + h.calc(`x = ${tn(P.x)}:\\quad ${tn(P.x * P.x)} + ${tn(P.p * P.x)} = ${tn((P.x + q) ** 2)} - ${tn(q * q)} = ${tn(left)}`);
        }
        h.ar = {left, right};
        return cfg.out ? cfg.out(P, h, st) : o;
      }
    };
  }
});

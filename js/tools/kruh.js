/* ============================================================
   TOOL: kruh — parts of a circle: arc, sector and segment; a chord and its distance from the centre;
   tangents from an outside point; the central and the inscribed angle (with Thales as the 180° case).
   Plain SVG.
   cfg:
     typ      "vysek"      r, alfa (degrees); switches odsek (the segment cut off by the chord), tetiva
              "tetiva"     r, d (distance of the chord from the centre)
              "dotycnica"  r, d (distance of the outside point from the centre)
              "uhly"       omega (central angle), fi (where the vertex V sits, degrees round the circle);
                           switch druhy (a second vertex over the same arc). V can be dragged.
     r, alfa, d, omega, fi   a number or {v, min, max, step, lock};  free / lock / hide / on / toggles as in toolParams
     out(P, h, st)   h.ci = {r, alfa, obvod, obsah, obluk, vysek, odsek, tetiva, dot, uhol, omega, obvodovy}
   ============================================================ */
defTool("kruh", {
  name:"Kružnica a kruh",
  area:"Planimetria",
  desc:"Oblúk, výsek a odsek, tetiva, dotyčnice z bodu a stredový a obvodový uhol vrátane Tálesovej vety.",
  topics:["a31", "a34", "b18", "b8"],
  presets:[
    {name:"Oblúk a výsek", cfg:{typ:"vysek"}},
    {name:"Odsek", cfg:{typ:"vysek", alfa:120, on:{odsek:true, tetiva:true}}},
    {name:"Tetiva", cfg:{typ:"tetiva"}},
    {name:"Dotyčnice", cfg:{typ:"dotycnica"}},
    {name:"Stredový a obvodový uhol", cfg:{typ:"uhly"}},
    {name:"Tálesova veta", cfg:{typ:"uhly", omega:180, lock:["omega"]}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["vysek", "tetiva", "dotycnica", "uhly"].includes(cfg.typ) ? cfg.typ : "vysek";
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const defs = typ === "vysek" ? {r:{v:4, min:1, max:6, step:.5, color:"b", note:"polomer"}, alfa:{v:60, min:0, max:360, step:5, color:"d", name:"α", note:"stredový uhol"},
        odsek:ck(false, "Odsek (výsek bez trojuholníka)", "a"), tetiva:ck(false, "Tetiva")}
      : typ === "tetiva" ? {r:{v:5, min:1, max:6, step:.5, color:"b", note:"polomer"}, d:{v:3, min:0, max:6, step:.25, color:"a", note:"vzdialenosť od stredu"}}
      : typ === "dotycnica" ? {r:{v:3, min:1, max:5, step:.5, color:"b", note:"polomer"}, d:{v:6, min:1, max:14, step:.5, color:"a", note:"vzdialenosť bodu od stredu"}}
      : {omega:{v:100, min:10, max:350, step:5, color:"a", name:"ω", note:"stredový uhol"}, fi:{v:80, min:0, max:360, step:5, color:"b", name:"V", note:"poloha vrcholu"}, druhy:ck(false, "Druhý vrchol nad tým istým oblúkom", "c")};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, rad = d => d * Math.PI / 180, deg = x => x * 180 / Math.PI;
    const cx = typ === "dotycnica" ? 150 : W / 2, cy = 162, RU = 122;
    const u = typ === "dotycnica" ? 26 : 21;
    const pol = (r, a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
    /* the inscribed angle at V (degrees round the circle) over the arc at the bottom spanning omega */
    const inscribed = (om, fi) => {
      const A = pol(1, 270 - om / 2), B = pol(1, 270 + om / 2), V = pol(1, fi);
      const a = [A[0] - V[0], A[1] - V[1]], b = [B[0] - V[0], B[1] - V[1]];
      return deg(Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1)))));
    };
    const calc = P => {
      if(typ === "vysek"){
        const r = P.r, a = rad(P.alfa), vysek = Math.PI * r * r * P.alfa / 360, tri = r * r * Math.sin(a) / 2;
        return {r, alfa:P.alfa, obvod:2 * Math.PI * r, obsah:Math.PI * r * r, obluk:r * a, vysek, tri, odsek:vysek - tri, tetiva:2 * r * Math.sin(a / 2)};
      }
      if(typ === "tetiva"){ const d = Math.min(P.d, P.r); return {r:P.r, d, tetiva:2 * Math.sqrt(P.r * P.r - d * d)}; }
      if(typ === "dotycnica"){ const d = P.d, r = P.r, out = d > r; return {r, d, out, dot:out ? Math.sqrt(d * d - r * r) : d === r ? 0 : NaN, uhol:out ? 2 * deg(Math.asin(r / d)) : NaN}; }
      return {omega:P.omega, obvodovy:inscribed(P.omega, P.fi), major:!(P.fi > 270 - P.omega / 2 && P.fi < 270 + P.omega / 2)};
    };
    const movable = st => typ === "uhly" && !(params.fi.lock && !st.open);

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "uhly" && !params.fi.lock ? "Vrchol **V** ťahaj po kružnici." : null,
      svg(P, st){
        const k = calc(P), thumb = st.env.thumb, T = (p, s, c) => thumb ? "" : SV.text(p[0], p[1] + 5, s, `mid halo ${c}`);
        const S = [cx, cy];
        let h = "";
        if(typ === "vysek"){
          const R = k.r * u, A = pol(R, 0), B = pol(R, k.alfa), a = k.alfa;
          if(a > 0) h += SV.path(`M${cx} ${cy}` + SV.arc(cx, cy, R, 0, a).replace("M", "L") + "Z", "bg cd");
          if(P.odsek && a > 0 && a < 360) h += SV.path(SV.arc(cx, cy, R, 0, a) + "Z", "bg ca vn-on") + SG.seg(A, B, "s ca");
          h += SV.circle(cx, cy, R, "s w1") + SV.path(SV.arc(cx, cy, R, 0, a), "s cd w5") + SG.seg(S, A, "s cb") + SG.seg(S, B, "s cb");
          if(P.tetiva && !P.odsek && a > 0 && a < 360) h += SG.seg(A, B, "s ca");
          h += SV.path(SV.arc(cx, cy, 20, 0, a), "s cd w1") + SG.dot(S, "f");
          h += T(pol(34, a / 2), "α", "it cd") + T(pol(R / 2, -12), "r", "it cb") + (a >= 20 ? T(pol(R + 16, a / 2), `l = ${fmtN(k.obluk)}`, "cd") : "");
          if((P.tetiva || P.odsek) && a >= 30 && a < 360) h += T(pol(R * Math.cos(rad(a / 2)) - 12, a / 2), "t", "it ca");
        } else if(typ === "tetiva"){
          const R = k.r * u, d = k.d * u, half = k.tetiva / 2 * u, A = [cx - half, cy - d], B = [cx + half, cy - d], M = [cx, cy - d];
          h += SV.circle(cx, cy, R, "s") + SV.poly([S, M, B], "bg cink") + SG.seg(A, B, "s cd w3") + SG.seg(S, M, "s ca w3") + SG.seg(S, B, "s cb") + SG.seg(S, A, "s cb w1 dash");
          if(d > 12 && half > 12) h += SG.right(M, S, B);
          h += SG.dot(S, "f") + SG.dot(A, "f cd") + SG.dot(B, "f cd");
          h += T([cx - 12, cy - d / 2], "d", "it ca") + T([cx + half / 2 + 10, cy - d / 2 + 10], "r", "it cb") + T([cx, cy - d - 14], `t = ${fmtN(k.tetiva)}`, "cd") + T([cx - 12, cy + 10], "S", "");
        } else if(typ === "dotycnica"){
          const R = k.r * u, X = [cx + k.d * u, cy];
          h += SV.circle(cx, cy, R, "s") + SG.seg(S, X, "s ca");
          if(k.out){
            const b = deg(Math.acos(k.r / k.d)), T1 = pol(R, b), T2 = pol(R, -b);
            const far = (p, q, e) => [q[0] + (q[0] - p[0]) * e, q[1] + (q[1] - p[1]) * e];
            h += SG.seg(far(T1, X, .12), far(X, T1, .3), "s cd w1") + SG.seg(far(T2, X, .12), far(X, T2, .3), "s cd w1") + SG.seg(X, T1, "s cd w3") + SG.seg(X, T2, "s cd w3")
              + SG.seg(S, T1, "s cb") + SG.seg(S, T2, "s cb") + SG.right(T1, S, X) + SG.right(T2, S, X) + SG.dot(T1, "f cd") + SG.dot(T2, "f cd");
            h += T([T1[0] - 4, T1[1] - 14], "T₁", "cd") + T([T2[0] - 4, T2[1] + 14], "T₂", "cd") + T(SG.mid(S, T1).map((v, i) => v - [12, 4][i]), "r", "it cb")
              + T([(X[0] + T1[0]) / 2 + 8, (X[1] + T1[1]) / 2 - 12], `${fmtN(k.dot)}`, "cd");
          }
          h += SG.dot(S, "f") + SG.dot(X, "h ca", 5.5) + T([cx - 12, cy + 12], "S", "") + T([X[0] + 12, X[1] - 12], "X", "ca") + T([(cx + X[0]) / 2 + 20, cy + 14], `d = ${fmtN(k.d)}`, "ca");
        } else {
          const om = k.omega, A = pol(RU, 270 - om / 2), B = pol(RU, 270 + om / 2), V = pol(RU, P.fi);
          h += SV.circle(cx, cy, RU, "s w1") + SV.path(SV.arc(cx, cy, RU, 270 - om / 2, 270 + om / 2), "s cd w5");
          h += SG.seg(S, A, "s ca") + SG.seg(S, B, "s ca") + SV.path(SV.arc(cx, cy, 24, 270 - om / 2, 270 + om / 2), "s ca w1");
          const vert = (p, cls, name) => SG.seg(p, A, `s ${cls}`) + SG.seg(p, B, `s ${cls}`) + SG.angle(p, A, B, 26, `s ${cls} w1`) + SG.dot(p, `h ${cls}`, 6)
            + T(SG.inAngle(p, A, B, 42), `${fmtN(inscribed(om, name === "V" ? P.fi : P.fi + 55), 1)}°`, cls) + (thumb ? "" : SG.label(p, name, cls, S, 16));
          if(P.druhy) h += vert(pol(RU, P.fi + 55), "cc", "V′");
          h += vert(V, "cb", "V");
          h += SG.dot(S, "f") + SG.dot(A, "f cd") + SG.dot(B, "f cd") + T(pol(40, 270), `${fmtN(om)}°`, "ca");
          if(!thumb) h += SG.label(A, "A", "cd", S, 16) + SG.label(B, "B", "cd", S, 16) + T([cx + 12, cy - 10], "S", "");
          if(movable(st) && !thumb) h += `<circle class="hit" cx="${cx}" cy="${cy}" r="${RU}" fill="none" stroke-width="34" pointer-events="stroke" data-drag="V"/>`;
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        if(typ !== "uhly") return;
        svgDrag(el, st, (id, x, y) => {
          const step = params.fi.step || 5;
          let a = Math.round(deg(Math.atan2(cy - y, x - cx)) / step) * step;
          a = ((a % 360) + 360) % 360;
          if(a === st.P.fi) return false;
          st.P.fi = a;
        });
      },
      out(P, h, st){
        const k = calc(P), tn = h.tn;
        h.ci = k;
        if(cfg.out) return cfg.out(P, h, st);
        if(typ === "vysek"){
          let o = h.calc(`o = 2\\pi \\vb{r} \\doteq ${tn(k.obvod)}, \\quad S = \\pi \\vb{r}^2 \\doteq ${tn(k.obsah)}`)
            + h.calc(`l = 2\\pi \\vb{r} \\cdot \\dfrac{\\vd{${tn(k.alfa)}^\\circ}}{360^\\circ} \\doteq \\vd{${tn(k.obluk)}}`)
            + h.calc(`S_{\\text{výsek}} = \\pi \\vb{r}^2 \\cdot \\dfrac{\\vd{${tn(k.alfa)}^\\circ}}{360^\\circ} \\doteq ${tn(k.vysek)}`);
          if(P.odsek) o += h.calc(`S_{\\text{odsek}} = ${tn(k.vysek)} - \\tfrac12 \\vb{r}^2 \\sin \\vd{\\alpha} \\doteq \\va{${tn(k.odsek)}}`);
          if(P.tetiva || P.odsek) o += h.calc(`\\va{t} = 2\\vb{r} \\sin \\dfrac{\\vd{\\alpha}}{2} \\doteq \\va{${tn(k.tetiva)}}`);
          return o + h.p(`Oblúk aj výsek sú z celku rovnaká časť: $\\dfrac{${tn(k.alfa)}}{360} \\doteq ${tn(k.alfa / 360, 3)}$.`);
        }
        if(typ === "tetiva") return h.calc(`\\left(\\dfrac{\\vd{t}}{2}\\right)^2 = \\vb{r}^2 - \\va{d}^2 = ${tn(k.r * k.r)} - ${tn(k.d * k.d)} = ${tn(k.r * k.r - k.d * k.d)}`)
          + h.calc(`\\vd{t} = 2\\sqrt{${tn(k.r * k.r - k.d * k.d)}} \\doteq \\vd{${tn(k.tetiva)}}`)
          + h.p(k.d === 0 ? "Tetiva cez stred je priemer, najdlhšia zo všetkých." : "Spojnica stredu so stredom tetivy je na tetivu kolmá, preto Pytagorova veta.");
        if(typ === "dotycnica"){
          if(!k.out) return h.pill(k.d === k.r ? "bod leží na kružnici: jediná dotyčnica" : "bod je vnútri kruhu: dotyčnica neexistuje", "flat");
          return h.calc(`|XT|^2 = \\va{d}^2 - \\vb{r}^2 = ${tn(k.d * k.d)} - ${tn(k.r * k.r)} = ${tn(k.d * k.d - k.r * k.r)}`) + h.calc(`|XT| \\doteq \\vd{${tn(k.dot)}}`)
            + h.p(`Polomer do bodu dotyku je na dotyčnicu **kolmý**. Uhol dotyčníc: $${tn(k.uhol, 1)}^\\circ$.`);
        }
        let o = h.calc(`\\va{\\omega} = \\va{${tn(k.omega)}^\\circ}`) + (k.major ? h.calc(`\\vb{\\gamma} = \\dfrac{\\va{\\omega}}{2} = \\vb{${tn(k.obvodovy, 1)}^\\circ}`)
          : h.calc(`\\vb{\\gamma} = 180^\\circ - \\dfrac{\\va{\\omega}}{2} = \\vb{${tn(k.obvodovy, 1)}^\\circ}`) + h.p("Vrchol je na oblúku AB, pozerá sa na doplnkový oblúk."));
        if(k.omega === 180) o += h.pill("Tálesova veta: nad priemerom je uhol pravý", "ok");
        else if(k.major) o += h.p("Obvodový uhol je polovica stredového, nech je vrchol kdekoľvek na zvyšku kružnice.");
        return o;
      }
    };
  }
});

/* ============================================================
   TOOL: analyticka — analytic geometry in the plane with points you can drag: distance and midpoint,
   vectors, the equations of a line, two lines, a circle and a line, the area of a triangle. JSXGraph board.
   cfg:
     typ      "body"       A, B: vector AB, distance, midpoint; switch pomer + sliders m, n (the point dividing AB as m : n)
              "vektory"    u = OU, v = OV; switches sucet, rozdiel, uhol (scalar product and angle),
                           kolmy (the perpendicular vector), plocha (determinant, parallelogram), priemet (projection of u on v)
              "priamka"    the line AB in all its forms; switches vektory (direction and normal), vzdialenost (of point C)
              "priamky"    lines AB and CD: intersection, angle, parallel or perpendicular
              "kruznica"   circle with centre S and radius r, and the line AB: common points
              "obsah"      triangle ABC: area from the coordinates
     pts      {A:[-3, -1]}            starting positions          fixed  ["A"]   points that cannot be moved
     view     [left, top, right, bottom]                          snap   1       grid the points snap to
     on, toggles, free, lock, hide    as in toolParams
     out(P, h, st)     h.an — the measured values of the scene (see calc below), e.g. {d, S, u, n, k, q, a, b, c}
   Helper: linTex([[2, "x"], [-3, "y"], [5, ""]]) → "2x - 3y + 5"
   ============================================================ */
function linTex(terms, n = texN){
  let s = "";
  terms.forEach(([k, v]) => {
    if(Math.abs(k) < 1e-9) return;
    const a = Math.abs(k), body = (a === 1 && v ? "" : n(a)) + v;
    s += s ? (k < 0 ? " - " : " + ") + body : (k < 0 ? "-" : "") + body;
  });
  return s || "0";
}

defTool("analyticka", {
  name:"Analytická geometria",
  area:"Planimetria",
  desc:"Body, vektory, priamka a kružnica v súradniciach. Ťahaj body a sleduj vzdialenosť, rovnice, priesečníky a uhly.",
  topics:["b19", "b20", "b21", "b22", "b23", "b24", "b25"],
  presets:[
    {name:"Vzdialenosť a stred", cfg:{typ:"body"}},
    {name:"Deliaci pomer", cfg:{typ:"body", on:{pomer:true}}},
    {name:"Vektory", cfg:{typ:"vektory", on:{sucet:true}}},
    {name:"Skalárny súčin a uhol", cfg:{typ:"vektory", on:{uhol:true}}},
    {name:"Rovnica priamky", cfg:{typ:"priamka", on:{vektory:true}}},
    {name:"Vzdialenosť bodu od priamky", cfg:{typ:"priamka", on:{vzdialenost:true}}},
    {name:"Dve priamky", cfg:{typ:"priamky"}},
    {name:"Kružnica a priamka", cfg:{typ:"kruznica"}},
    {name:"Obsah trojuholníka", cfg:{typ:"obsah"}}
  ],
  help:"Body ťahaj myšou alebo im vpíš súradnice do polí vpravo.",

  make(cfg, env){
    const typ = ["body", "vektory", "priamka", "priamky", "kruznica", "obsah"].includes(cfg.typ) ? cfg.typ : "body";
    const start = {
      body:{A:[-3, -1], B:[5, 3]}, vektory:{U:[4, 1], V:[1, 3]}, priamka:{A:[-4, -1], B:[4, 3], C:[2, -3]},
      priamky:{A:[-5, -2], B:[3, 2], C:[-3, 4], D:[3, -2]}, kruznica:{S:[0, 0], A:[-6, -2], B:[5, 4]}, obsah:{A:[-4, -2], B:[5, -1], C:[1, 4]}
    }[typ];
    const colors = {A:"a", B:"a", C:"d", D:"d", S:"b", U:"a", V:"b"};
    const points = {};
    for(const n in start){ const p = (cfg.pts && cfg.pts[n]) || start[n]; points[n] = [p[0], p[1], {fixed:(cfg.fixed || []).includes(n), color:colors[n], name:typ === "vektory" ? "" : n}]; }
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const defs = typ === "body" ? {pomer:ck("Bod deliaci AB v pomere m : n", "d"), m:{v:1, min:1, max:6, step:1, color:"d"}, n:{v:2, min:1, max:6, step:1, color:"d"}}
      : typ === "vektory" ? {sucet:ck("Súčet u + v", "d"), rozdiel:ck("Rozdiel u − v", "c"), uhol:ck("Skalárny súčin a uhol"), kolmy:ck("Kolmý vektor k u"), plocha:ck("Determinant a rovnobežník"), priemet:ck("Priemet u do smeru v")}
      : typ === "priamka" ? {vektory:ck("Smerový a normálový vektor", "b"), vzdialenost:ck("Vzdialenosť bodu C", "d")}
      : typ === "kruznica" ? {r:{v:4, min:1, max:6, step:.5, color:"b", note:"polomer"}} : {};
    const params = toolParams(defs, cfg, env);
    if(typ === "body" && !params.pomer.v && params.pomer.lock){ params.m.lock = params.m.hide = params.n.lock = params.n.hide = true; }

    /* a line through two points as a·x + b·y + c = 0 with tidy whole coefficients when possible */
    const lineOf = (x1, y1, x2, y2) => {
      let a = y1 - y2, b = x2 - x1, c = -(a * x1 + b * y1);
      const whole = [a, b, c].every(v => Math.abs(v - Math.round(v)) < 1e-9);
      if(whole){ const g = [a, b, c].map(v => Math.abs(Math.round(v))).reduce((p, q) => { while(q){ [p, q] = [q, p % q]; } return p; }, 0) || 1; a = Math.round(a) / g; b = Math.round(b) / g; c = Math.round(c) / g; }
      if(a < 0 || (a === 0 && b < 0)){ a = -a; b = -b; c = -c; }
      return {a, b, c, u:[x2 - x1, y2 - y1], n:[a, b], ok:Math.abs(a) + Math.abs(b) > 1e-9, k:b ? -a / b : NaN, q:b ? -c / b : NaN};
    };
    const deg = x => x * 180 / Math.PI, r3 = v => Math.round(v * 1000) / 1000;
    const calc = P => {
      if(typ === "body"){
        const u = [P.Bx - P.Ax, P.By - P.Ay], t = P.m / (P.m + P.n);
        return {u, d:Math.hypot(u[0], u[1]), S:[(P.Ax + P.Bx) / 2, (P.Ay + P.By) / 2], X:[P.Ax + u[0] * t, P.Ay + u[1] * t]};
      }
      if(typ === "vektory"){
        const u = [P.Ux, P.Uy], v = [P.Vx, P.Vy], dot = u[0] * v[0] + u[1] * v[1], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]), det = u[0] * v[1] - u[1] * v[0];
        const t = lv ? dot / (lv * lv) : 0;
        return {u, v, dot, lu, lv, det, uhol:lu && lv ? deg(Math.acos(Math.max(-1, Math.min(1, dot / (lu * lv))))) : NaN, sucet:[u[0] + v[0], u[1] + v[1]], rozdiel:[u[0] - v[0], u[1] - v[1]],
          kolmy:[-u[1], u[0]], priemet:[v[0] * t, v[1] * t]};
      }
      if(typ === "priamka"){
        const l = lineOf(P.Ax, P.Ay, P.Bx, P.By), den = Math.hypot(l.a, l.b) || 1, val = l.a * P.Cx + l.b * P.Cy + l.c;
        return Object.assign(l, {d:Math.abs(val) / den, F:[P.Cx - l.a * val / (den * den), P.Cy - l.b * val / (den * den)]});
      }
      if(typ === "priamky"){
        const p = lineOf(P.Ax, P.Ay, P.Bx, P.By), q = lineOf(P.Cx, P.Cy, P.Dx, P.Dy), det = p.a * q.b - q.a * p.b;
        const X = Math.abs(det) > 1e-9 ? [(p.b * q.c - q.b * p.c) / det, (q.a * p.c - p.a * q.c) / det] : null;
        const cos = Math.abs(p.u[0] * q.u[0] + p.u[1] * q.u[1]) / ((Math.hypot(...p.u) * Math.hypot(...q.u)) || 1);
        return {p, q, X, uhol:deg(Math.acos(Math.min(1, cos))), same:!X && Math.abs(p.a * P.Cx + p.b * P.Cy + p.c) < 1e-9};
      }
      if(typ === "kruznica"){
        const l = lineOf(P.Ax, P.Ay, P.Bx, P.By), den = Math.hypot(l.a, l.b) || 1, val = l.a * P.Sx + l.b * P.Sy + l.c, d = Math.abs(val) / den;
        const F = [P.Sx - l.a * val / (den * den), P.Sy - l.b * val / (den * den)], half = Math.sqrt(Math.max(0, P.r * P.r - d * d)), e = [-l.b / den, l.a / den];
        const pts = d > P.r + 1e-9 ? [] : half < 1e-6 ? [F] : [[F[0] - e[0] * half, F[1] - e[1] * half], [F[0] + e[0] * half, F[1] + e[1] * half]];
        return {l, d, F, pts, m:P.Sx, n:P.Sy, r:P.r};
      }
      const det = (P.Bx - P.Ax) * (P.Cy - P.Ay) - (P.By - P.Ay) * (P.Cx - P.Ax);
      return {det, S:Math.abs(det) / 2, u:[P.Bx - P.Ax, P.By - P.Ay], v:[P.Cx - P.Ax, P.Cy - P.Ay]};
    };
    const C = st => toolDerive(st, "an", calc);

    return {
      params, points, snap:cfg.snap || 1,
      hint:"Body ťahaj alebo im vpíš súradnice.",
      board:{bbox:cfg.view || [-9, 7, 9, -7], aspect:"9/7"},
      draw(g, P, st){
        const K = () => C(st), on = (id, f) => () => P[id] ? f() : NaN;
        const arrow = (p, q, color, o) => g.seg(p, q, color, Object.assign({strokeWidth:2.6, lastArrow:{type:2, size:6}}, o));
        if(typ === "body"){
          arrow(["Ax", "Ay"], ["Bx", "By"], "ink");
          g.pt(() => K().S[0], () => K().S[1], "b", {label:"S", at:"t", size:3.5});
          g.pt(on("pomer", () => K().X[0]), () => K().X[1], "d", {label:"X", at:"b"});
          g.seg(["Ax", "Ay"], ["Bx", "Ay"], "soft", {dash:2, strokeWidth:1.2}); g.seg(["Bx", "Ay"], ["Bx", "By"], "soft", {dash:2, strokeWidth:1.2});
        } else if(typ === "vektory"){
          const O = [0, 0];
          g.poly([O, ["Ux", "Uy"], [() => P.plocha ? K().sucet[0] : NaN, () => K().sucet[1]], ["Vx", "Vy"]], "d");
          arrow(O, ["Ux", "Uy"], "a"); arrow(O, ["Vx", "Vy"], "b");
          g.txt(() => P.Ux / 2, () => P.Uy / 2, "u", "a", {at:"br"}); g.txt(() => P.Vx / 2, () => P.Vy / 2, "v", "b", {at:"tl"});
          arrow(O, [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "d");
          g.seg(["Ux", "Uy"], [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "b", {dash:2, strokeWidth:1.3}); g.seg(["Vx", "Vy"], [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "a", {dash:2, strokeWidth:1.3});
          arrow([on("rozdiel", () => P.Vx), "Vy"], ["Ux", "Uy"], "c");
          arrow(O, [on("kolmy", () => K().kolmy[0]), () => K().kolmy[1]], "ok");
          arrow(O, [on("priemet", () => K().priemet[0]), () => K().priemet[1]], "warn", {strokeWidth:4});
          g.seg(["Ux", "Uy"], [on("priemet", () => K().priemet[0]), () => K().priemet[1]], "soft", {dash:2, strokeWidth:1.3});
        } else if(typ === "priamka" || typ === "priamky" || typ === "kruznica"){
          g.line(["Ax", "Ay"], ["Bx", "By"], "ink", {strokeWidth:2.4});
          if(typ === "priamka"){
            arrow(["Ax", "Ay"], [on("vektory", () => P.Bx), "By"], "b");
            arrow(["Ax", "Ay"], [on("vektory", () => P.Ax + K().n[0] / (Math.hypot(...K().n) || 1) * 2), () => P.Ay + K().n[1] / (Math.hypot(...K().n) || 1) * 2], "ok");
            g.seg(["Cx", "Cy"], [on("vzdialenost", () => K().F[0]), () => K().F[1]], "d", {strokeWidth:2.4});
            g.pt(on("vzdialenost", () => K().F[0]), () => K().F[1], "d", {size:3, label:"P", at:"b"});
          } else if(typ === "priamky"){
            g.line(["Cx", "Cy"], ["Dx", "Dy"], "d", {strokeWidth:2.4});
            g.pt(() => K().X ? K().X[0] : NaN, () => K().X ? K().X[1] : NaN, "ok", {label:"P", at:"t"});
          } else {
            g.circle("Sx", "Sy", "r", "b", {strokeWidth:2.6});
            [0, 1].forEach(i => g.pt(() => K().pts[i] ? K().pts[i][0] : NaN, () => K().pts[i] ? K().pts[i][1] : NaN, "ok", {label:"P" + "₁₂"[i], at:i ? "br" : "tl"}));
            g.seg(["Sx", "Sy"], [() => K().F[0], () => K().F[1]], "d", {dash:2, strokeWidth:1.6});
          }
        } else {
          g.poly([["Ax", "Ay"], ["Bx", "By"], ["Cx", "Cy"]], "d");
          g.seg(["Ax", "Ay"], ["Bx", "By"], "ink"); g.seg(["Bx", "By"], ["Cx", "Cy"], "ink"); g.seg(["Cx", "Cy"], ["Ax", "Ay"], "ink");
        }
      },
      out(P, h, st){
        const k = C(st), tn = h.tn, t3 = v => tn(r3(v), 3);
        h.an = k;
        if(cfg.out) return cfg.out(P, h, st);
        const vec = v => `(${t3(v[0])};\\ ${t3(v[1])})`, pt = (x, y) => `[${t3(x)};\\ ${t3(y)}]`;
        const sq = v => v < 0 ? `(${tn(v)})` : tn(v), eq = x => Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? "=" : "\\doteq";
        if(typ === "body"){
          let o = h.calc(`\\overrightarrow{AB} = B - A = ${vec(k.u)}`) + h.calc(`|AB| = \\sqrt{${sq(k.u[0])}^2 + ${sq(k.u[1])}^2} = \\sqrt{${tn(k.u[0] ** 2 + k.u[1] ** 2)}} ${eq(k.d)} ${tn(k.d)}`)
            + h.calc(`\\vb{S} = \\left[\\tfrac{${tn(P.Ax)} + ${sq(P.Bx)}}{2};\\ \\tfrac{${tn(P.Ay)} + ${sq(P.By)}}{2}\\right] = \\vb{${pt(k.S[0], k.S[1])}}`);
          if(P.pomer) o += h.calc(`\\vd{X} = A + \\tfrac{${P.m}}{${P.m + P.n}} \\cdot \\overrightarrow{AB} = \\vd{${pt(k.X[0], k.X[1])}}`) + h.p(`$|AX| : |XB| = \\vd{${P.m} : ${P.n}}$, úsečka má $${P.m + P.n}$ rovnakých dielov.`);
          return o;
        }
        if(typ === "vektory"){
          let o = h.calc(`\\va{\\vec u} = \\va{${vec(k.u)}},\\ |\\vec u| ${eq(k.lu)} ${tn(k.lu)}`) + h.calc(`\\vb{\\vec v} = \\vb{${vec(k.v)}},\\ |\\vec v| ${eq(k.lv)} ${tn(k.lv)}`);
          if(P.sucet) o += h.calc(`\\vd{\\vec u + \\vec v} = \\vd{${vec(k.sucet)}}`);
          if(P.rozdiel) o += h.calc(`\\vc{\\vec u - \\vec v} = \\vc{${vec(k.rozdiel)}}`);
          if(P.uhol) o += h.calc(`\\vec u \\cdot \\vec v = ${tn(k.u[0])} \\cdot ${sq(k.v[0])} + ${sq(k.u[1])} \\cdot ${sq(k.v[1])} = ${tn(k.dot)}`)
            + h.calc(`\\cos \\varphi = \\dfrac{${tn(k.dot)}}{${tn(k.lu)} \\cdot ${tn(k.lv)}} \\Rightarrow \\varphi \\doteq ${tn(k.uhol, 1)}^\\circ`) + (Math.abs(k.dot) < 1e-9 ? h.pill("skalárny súčin 0: vektory sú kolmé", "ok") : "");
          if(P.kolmy) o += h.calc(`\\hat{u} = (-u_2;\\ u_1) = ${vec(k.kolmy)}`);
          if(P.plocha) o += h.calc(`\\det(\\vec u, \\vec v) = ${tn(k.u[0])} \\cdot ${sq(k.v[1])} - ${sq(k.u[1])} \\cdot ${sq(k.v[0])} = ${tn(k.det)}`) + h.p(`Obsah rovnobežníka: $|\\det| = ${tn(Math.abs(k.det))}$${Math.abs(k.det) < 1e-9 ? ", vektory sú rovnobežné" : ""}.`);
          if(P.priemet) o += h.calc(`\\vec u_v = \\dfrac{\\vec u \\cdot \\vec v}{|\\vec v|^2} \\, \\vec v = ${vec(k.priemet)}`);
          return o;
        }
        const general = l => `${linTex([[l.a, "x"], [l.b, "y"], [l.c, ""]], t3)} = 0`;
        const slope = l => l.b ? `y = ${linTex([[l.k, "x"], [l.q, ""]], t3)}` : `x = ${t3(-l.c / l.a)}`;
        if(typ === "priamka"){
          if(!k.ok) return h.p("Body A a B splývajú, priamka nimi nie je určená.");
          let o = h.calc(`\\vb{\\vec s} = B - A = \\vb{${vec(k.u)}}, \\quad \\vec n = ${vec(k.n)}`)
            + h.calc(`x = ${tn(P.Ax)} ${k.u[0] < 0 ? "-" : "+"} ${t3(Math.abs(k.u[0]))}t,\\quad y = ${tn(P.Ay)} ${k.u[1] < 0 ? "-" : "+"} ${t3(Math.abs(k.u[1]))}t`)
            + h.calc(general(k)) + h.calc(slope(k));
          if(P.vzdialenost) o += h.calc(`\\vd{d} = \\dfrac{|${t3(k.a)} \\cdot ${sq(P.Cx)} ${k.b < 0 ? "-" : "+"} ${t3(Math.abs(k.b))} \\cdot ${sq(P.Cy)} ${k.c < 0 ? "-" : "+"} ${t3(Math.abs(k.c))}|}{\\sqrt{${sq(r3(k.a))}^2 + ${sq(r3(k.b))}^2}} ${eq(k.d)} \\vd{${tn(k.d)}}`);
          return o;
        }
        if(typ === "priamky"){
          let o = h.calc(`p:\\ ${general(k.p)}`) + h.calc(`\\vd{q}:\\ ${general(k.q)}`);
          if(k.X) o += h.calc(`P = ${pt(k.X[0], k.X[1])}, \\quad \\varphi \\doteq ${tn(k.uhol, 1)}^\\circ`) + (Math.abs(k.uhol - 90) < 1e-6 ? h.pill("kolmé: normálové vektory majú skalárny súčin 0", "ok") : h.pill("rôznobežné: jeden priesečník", "flat"));
          else o += h.pill(k.same ? "totožné: nekonečne veľa spoločných bodov" : "rovnobežné: žiadny spoločný bod", k.same ? "ok" : "down");
          return o;
        }
        if(typ === "kruznica"){
          const part = (v, c) => c === 0 ? `${v}^2` : `(${v} ${c < 0 ? "+" : "-"} ${t3(Math.abs(c))})^2`;
          let o = h.calc(`${part("x", k.m)} + ${part("y", k.n)} = \\vb{${tn(k.r * k.r)}}`) + h.calc(`p:\\ ${general(k.l)}`) + h.calc(`\\vd{d(S, p)} ${eq(k.d)} \\vd{${tn(k.d)}} ${k.pts.length === 2 ? "<" : k.pts.length ? "=" : ">"} \\vb{r} = \\vb{${tn(k.r)}}`);
          o += k.pts.length === 2 ? h.pill("sečnica: dva spoločné body", "ok") : k.pts.length ? h.pill("dotyčnica: jeden spoločný bod", "flat") : h.pill("vonkajšia priamka: žiadny spoločný bod", "down");
          if(k.pts.length) o += h.p(k.pts.map((p, i) => `$P_{${i + 1}} = ${pt(p[0], p[1])}$`).join(", "));
          return o;
        }
        return h.calc(`\\overrightarrow{AB} = ${vec(k.u)}, \\quad \\overrightarrow{AC} = ${vec(k.v)}`)
          + h.calc(`S = \\tfrac12 \\left| ${tn(k.u[0])} \\cdot ${sq(k.v[1])} - ${sq(k.u[1])} \\cdot ${sq(k.v[0])} \\right| = \\tfrac12 \\cdot |${tn(k.det)}| = \\vd{${tn(k.S)}}`)
          + (k.S === 0 ? h.pill("obsah 0: body ležia na jednej priamke", "flat") : "");
      }
    };
  }
});

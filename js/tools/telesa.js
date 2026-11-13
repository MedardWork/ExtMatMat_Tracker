/* ============================================================
   TOOL: telesa — volume and surface of solids, drawn in oblique projection, or unfolded into a net.
   Plain SVG.
   cfg:
     typ      "kocka" (a) | "kvader" (a, b, c) | "hranol" (regular: n, a, v) | "ihlan" (regular: n, a, v)
              "valec" (r, v) | "kuzel" (r, v) | "gula" (r)
     on       {siet:true}     show the net instead of the solid;  toggles:["siet"] lets the reader switch
     a, b, c, v, r, n         a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)     h.sol = {V, S, Sp (base), Spl (lateral), s (slant edge / side of a cone), w (height of a side face), u (space diagonal), ro, R}
   ============================================================ */
defTool("telesa", {
  name:"Objem a povrch telies",
  area:"Stereometria",
  desc:"Kocka, kváder, hranol, ihlan, valec, kužeľ a guľa: rozmery, objem, povrch a sieť telesa.",
  topics:["a36", "a37", "b35"],
  presets:[
    {name:"Kváder", cfg:{typ:"kvader"}},
    {name:"Kocka", cfg:{typ:"kocka"}},
    {name:"Hranol", cfg:{typ:"hranol"}},
    {name:"Ihlan", cfg:{typ:"ihlan"}},
    {name:"Valec", cfg:{typ:"valec"}},
    {name:"Kužeľ", cfg:{typ:"kuzel"}},
    {name:"Guľa", cfg:{typ:"gula"}},
    {name:"Sieť ihlana", cfg:{typ:"ihlan", on:{siet:true}}},
    {name:"Sieť kužeľa", cfg:{typ:"kuzel", on:{siet:true}}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["kocka", "kvader", "hranol", "ihlan", "valec", "kuzel", "gula"].includes(cfg.typ) ? cfg.typ : "kvader";
    const sl = (v, color, note, max = 8) => ({v, min:1, max, step:.5, color, note});
    const N = {v:typ === "ihlan" ? 4 : 6, min:3, max:8, step:1, note:"počet strán podstavy", plain:true, name:"n"};
    const defs = typ === "kocka" ? {a:sl(4, "a", "hrana")} : typ === "kvader" ? {a:sl(5, "a"), b:sl(3, "b"), c:sl(4, "d")}
      : typ === "hranol" || typ === "ihlan" ? {n:N, a:sl(3, "a", "hrana podstavy", 6), v:sl(5, "b", "výška")}
      : typ === "gula" ? {r:sl(3, "a", "polomer", 5)} : {r:sl(3, "a", "polomer", 5), v:sl(5, "b", "výška")};
    if(typ !== "gula") defs.siet = {type:"check", v:false, name:"Sieť telesa"};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 340, K = .5 * Math.SQRT1_2, PI = Math.PI;
    const ngon = (n, a) => { const R = a / (2 * Math.sin(PI / n)), out = []; for(let i = 0; i < n; i++){ const t = -PI / 2 - PI / n + 2 * PI * i / n; out.push([R * Math.cos(t), R * Math.sin(t)]); } return out; };
    const calc = P => {
      if(typ === "kocka") return {V:P.a ** 3, S:6 * P.a * P.a, us:P.a * Math.SQRT2, u:P.a * Math.sqrt(3)};
      if(typ === "kvader") return {V:P.a * P.b * P.c, S:2 * (P.a * P.b + P.b * P.c + P.a * P.c), u:Math.hypot(P.a, P.b, P.c)};
      if(typ === "hranol" || typ === "ihlan"){
        const n = Math.round(P.n), ro = P.a / (2 * Math.tan(PI / n)), R = P.a / (2 * Math.sin(PI / n)), Sp = n * P.a * ro / 2;
        if(typ === "hranol") return {n, ro, R, Sp, Spl:n * P.a * P.v, V:Sp * P.v, S:2 * Sp + n * P.a * P.v};
        const w = Math.hypot(P.v, ro), s = Math.hypot(P.v, R);
        return {n, ro, R, Sp, w, s, Spl:n * P.a * w / 2, V:Sp * P.v / 3, S:Sp + n * P.a * w / 2};
      }
      if(typ === "valec") return {Sp:PI * P.r * P.r, Spl:2 * PI * P.r * P.v, V:PI * P.r * P.r * P.v, S:2 * PI * P.r * (P.r + P.v)};
      if(typ === "kuzel"){ const s = Math.hypot(P.r, P.v); return {s, Sp:PI * P.r * P.r, Spl:PI * P.r * s, V:PI * P.r * P.r * P.v / 3, S:PI * P.r * (P.r + s), uhol:360 * P.r / s}; }
      return {V:4 / 3 * PI * P.r ** 3, S:4 * PI * P.r * P.r};
    };

    /* a convex solid as corners + faces; an edge is drawn solid when one of its faces looks at the viewer */
    const solid = P => {
      if(typ === "kocka" || typ === "kvader"){
        const [a, b, c] = typ === "kocka" ? [P.a, P.a, P.a] : [P.a, P.b, P.c];
        return {v:[[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]], f:[[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]};
      }
      const n = Math.round(P.n), base = ngon(n, P.a), ix = base.map((p, i) => i);
      if(typ === "hranol") return {v:[...base.map(p => [p[0], p[1], 0]), ...base.map(p => [p[0], p[1], P.v])], f:[ix, ix.map(i => i + n), ...ix.map(i => [i, (i + 1) % n, (i + 1) % n + n, i + n])]};
      return {v:[...base.map(p => [p[0], p[1], 0]), [0, 0, P.v]], f:[ix, ...ix.map(i => [i, (i + 1) % n, n])]};
    };
    const drawSolid = (P, T) => {
      const s = solid(P), xs = s.v.map(p => p[0] + p[1] * K), ys = s.v.map(p => p[2] + p[1] * K);
      const f = svFit(W, H, [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], 40), pr = p => f.p([p[0] + p[1] * K, p[2] + p[1] * K]);
      const c = s.v.reduce((m, p) => [m[0] + p[0] / s.v.length, m[1] + p[1] / s.v.length, m[2] + p[2] / s.v.length], [0, 0, 0]), view = [K, -1, K];
      const seen = {};
      s.f.forEach(face => {
        const p = s.v[face[0]], q = s.v[face[1]], r = s.v[face[2]], u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], w = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
        let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
        if(n[0] * (p[0] - c[0]) + n[1] * (p[1] - c[1]) + n[2] * (p[2] - c[2]) < 0) n = n.map(x => -x);
        const vis = n[0] * view[0] + n[1] * view[1] + n[2] * view[2] > 1e-9;
        face.forEach((a, i) => { const b = face[(i + 1) % face.length], key = Math.min(a, b) + "-" + Math.max(a, b); seen[key] = seen[key] || vis; });
      });
      let h = "";
      Object.keys(seen).sort((x, y) => seen[x] - seen[y]).forEach(key => { const [a, b] = key.split("-").map(Number); h += SG.seg(pr(s.v[a]), pr(s.v[b]), seen[key] ? "s" : "s csoft w1 dash"); });
      if(typ === "kocka" || typ === "kvader"){
        const lab = (i, j, name, cls, dx, dy) => { const m = SG.mid(pr(s.v[i]), pr(s.v[j])); return SG.seg(pr(s.v[i]), pr(s.v[j]), `s ${cls} w3`) + T([m[0] + dx, m[1] + dy], name, cls); };
        h += lab(0, 1, `a = ${fmtN(P.a)}`, "ca", 0, 16) + (typ === "kvader" ? lab(1, 2, `b = ${fmtN(P.b)}`, "cb", 30, 6) + lab(1, 5, `c = ${fmtN(P.c)}`, "cd", 34, 0) : "");
        h += SG.seg(pr(s.v[0]), pr(s.v[6]), "s cok w1 dash");
      } else {
        const top = pr([0, 0, P.v]), o = pr([0, 0, 0]), m = SG.mid(pr(s.v[0]), pr(s.v[1]));
        h += SG.seg(pr(s.v[0]), pr(s.v[1]), "s ca w3") + T([m[0], m[1] + 16], `a = ${fmtN(P.a)}`, "ca") + SG.seg(o, top, "s cb dash") + T([o[0] + 12, (o[1] + top[1]) / 2], "v", "it cb");
        if(typ === "ihlan") h += SG.seg(top, m, "s cd w1") + SG.seg(o, m, "s cok w1 dash") + T([(top[0] + m[0]) / 2 - 12, (top[1] + m[1]) / 2], "w", "it cd");
      }
      return h;
    };
    const drawRound = (P, T) => {
      const r = P.r, v = typ === "gula" ? 2 * r : P.v, ry0 = typ === "gula" ? r * .32 : r * K;
      const f = svFit(W, H, [-r, -ry0, r, v + (typ === "valec" ? ry0 : 0)], 40), cx = f.X(0), R = r * f.u, ry = ry0 * f.u, y0 = f.Y(0), y1 = f.Y(v);
      const half = (y, front, cls) => SV.path(`M${SV.n(cx - R)} ${SV.n(y)}A${SV.n(R)} ${SV.n(ry)} 0 0 ${front ? 0 : 1} ${SV.n(cx + R)} ${SV.n(y)}`, cls);
      let h = "";
      if(typ === "gula"){
        const cy = f.Y(r);
        h += SV.circle(cx, cy, R, "s") + half(cy, false, "s csoft w1 dash") + half(cy, true, "s w1") + SV.line(cx, cy, cx + R, cy, "s ca w3") + SV.circle(cx, cy, 3, "f") + T([cx + R / 2, cy - 10], `r = ${fmtN(r)}`, "ca");
        return h;
      }
      h += half(y0, false, "s csoft w1 dash") + half(y0, true, "s");
      if(typ === "valec") h += SV.path(`M${SV.n(cx - R)} ${SV.n(y1)}A${SV.n(R)} ${SV.n(ry)} 0 1 0 ${SV.n(cx + R)} ${SV.n(y1)}A${SV.n(R)} ${SV.n(ry)} 0 1 0 ${SV.n(cx - R)} ${SV.n(y1)}`, "s") + SV.line(cx - R, y0, cx - R, y1, "s") + SV.line(cx + R, y0, cx + R, y1, "s");
      else h += SV.line(cx - R, y0, cx, y1, "s") + SV.line(cx + R, y0, cx, y1, "s cd w3") + T([cx + R / 2 + 16, (y0 + y1) / 2], "s", "it cd");
      h += SV.line(cx, y0, cx + R, y0, "s ca w3") + SV.line(cx, y0, cx, y1, "s cb dash") + SV.circle(cx, y0, 3, "f") + T([cx + R / 2, y0 + 14], `r = ${fmtN(r)}`, "ca") + T([cx - 14, (y0 + y1) / 2], "v", "it cb");
      return h;
    };
    /* the net: a list of flat pieces in one plane */
    const drawNet = (P, k, T) => {
      const polys = [], circles = [];
      if(typ === "kocka" || typ === "kvader"){
        const [a, b, c] = typ === "kocka" ? [P.a, P.a, P.a] : [P.a, P.b, P.c], rect = (x, y, w, ht, cls) => polys.push({p:[[x, y], [x + w, y], [x + w, y + ht], [x, y + ht]], cls});
        rect(0, 0, a, b, "ca"); rect(0, b, a, c, "cd"); rect(0, -c, a, c, "cd"); rect(-c, 0, c, b, "cb"); rect(a, 0, c, b, "cb"); rect(a + c, 0, a, b, "ca");
      } else if(typ === "hranol"){
        const n = k.n, base = ngon(n, P.a), low = Math.min(...base.map(p => p[1]));
        for(let i = 0; i < n; i++) polys.push({p:[[i * P.a, 0], [(i + 1) * P.a, 0], [(i + 1) * P.a, P.v], [i * P.a, P.v]], cls:"cb"});
        polys.push({p:base.map(p => [p[0] + P.a / 2, p[1] - low + P.v]), cls:"ca"}, {p:base.map(p => [p[0] + P.a / 2, -(p[1] - low)]), cls:"ca"});
      } else if(typ === "ihlan"){
        const n = k.n, base = ngon(n, P.a);
        polys.push({p:base, cls:"ca"});
        base.forEach((p, i) => { const q = base[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], l = Math.hypot(m[0], m[1]) || 1; polys.push({p:[p, q, [m[0] + m[0] / l * k.w, m[1] + m[1] / l * k.w]], cls:"cb"}); });
      } else if(typ === "valec"){
        const w = 2 * PI * P.r;
        polys.push({p:[[0, 0], [w, 0], [w, P.v], [0, P.v]], cls:"cb"}); circles.push([w / 2, P.v + P.r, P.r], [w / 2, -P.r, P.r]);
      } else {
        const a = Math.min(359.9, k.uhol), half = a / 2, pts = [[0, 0]];
        for(let i = 0; i <= 60; i++){ const t = (90 - half + a * i / 60) * PI / 180; pts.push([k.s * Math.cos(t), k.s * Math.sin(t)]); }
        polys.push({p:pts, cls:"cb"}); circles.push([0, k.s + P.r, P.r]);
      }
      const all = [...polys.flatMap(q => q.p), ...circles.flatMap(c => [[c[0] - c[2], c[1] - c[2]], [c[0] + c[2], c[1] + c[2]]])];
      const f = svFit(W, H, [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))], 22);
      return polys.map(q => SV.poly(q.p.map(f.p), `bg ${q.cls}`) + SV.poly(q.p.map(f.p), `s ${q.cls} w1`)).join("") + circles.map(c => SV.circle(f.X(c[0]), f.Y(c[1]), c[2] * f.u, "bg ca") + SV.circle(f.X(c[0]), f.Y(c[1]), c[2] * f.u, "s ca w1")).join("")
        + (typ === "valec" ? T([f.X(PI * P.r), f.Y(P.v / 2)], `2πr = ${fmtN(2 * PI * P.r)}`, "cb") : typ === "kuzel" ? T([f.X(0), f.Y(k.s * .6)], `s = ${fmtN(k.s)},  ${fmtN(k.uhol, 1)}°`, "cb") : "");
    };

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const thumb = st.env.thumb, T = (p, s, c) => thumb ? "" : SV.text(p[0], p[1] + 5, s, `mid halo ${c}`);
        const body = P.siet && typ !== "gula" ? drawNet(P, calc(P), T) : ["valec", "kuzel", "gula"].includes(typ) ? drawRound(P, T) : drawSolid(P, T);
        return SV.wrap(W, H, body);
      },
      out(P, h, st){
        const k = calc(P), tn = h.tn, A = `\\va{${tn(P.a)}}`, R = `\\va{${tn(P.r)}}`, Vv = `\\vb{${tn(P.v)}}`;
        h.sol = k;
        if(cfg.out) return cfg.out(P, h, st);
        if(typ === "kocka") return h.calc(`V = \\va{a}^3 = ${A}^3 = ${tn(k.V)}`) + h.calc(`S = 6\\va{a}^2 = 6 \\cdot ${tn(P.a * P.a)} = ${tn(k.S)}`) + h.p(`Stenová uhlopriečka $a\\sqrt2 \\doteq ${tn(k.us)}$, telesová $a\\sqrt3 \\doteq ${tn(k.u)}$.`);
        if(typ === "kvader") return h.calc(`V = \\va{a}\\vb{b}\\vd{c} = ${A} \\cdot \\vb{${tn(P.b)}} \\cdot \\vd{${tn(P.c)}} = ${tn(k.V)}`)
          + h.calc(`S = 2(ab + bc + ac) = 2(${tn(P.a * P.b)} + ${tn(P.b * P.c)} + ${tn(P.a * P.c)}) = ${tn(k.S)}`) + h.calc(`u = \\sqrt{a^2 + b^2 + c^2} \\doteq ${tn(k.u)}`);
        if(typ === "hranol") return h.calc(`S_p \\doteq ${tn(k.Sp)}`) + h.calc(`V = S_p \\cdot \\vb{v} \\doteq ${tn(k.Sp)} \\cdot ${Vv} \\doteq ${tn(k.V)}`)
          + h.calc(`S = 2S_p + ${k.n} \\cdot \\va{a} \\cdot \\vb{v} \\doteq ${tn(2 * k.Sp)} + ${tn(k.Spl)} \\doteq ${tn(k.S)}`) + h.p(`Podstava je pravidelný ${k.n}-uholník, plášť tvorí ${k.n} obdĺžnikov $a \\times v$.`);
        if(typ === "ihlan") return h.calc(`V = \\tfrac13 S_p \\cdot \\vb{v} \\doteq \\tfrac13 \\cdot ${tn(k.Sp)} \\cdot ${Vv} \\doteq ${tn(k.V)}`)
          + h.calc(`\\vd{w} = \\sqrt{\\vb{v}^2 + \\varrho^2} \\doteq \\vd{${tn(k.w)}}`) + h.calc(`S = S_p + ${k.n} \\cdot \\dfrac{\\va{a} \\cdot \\vd{w}}{2} \\doteq ${tn(k.Sp)} + ${tn(k.Spl)} \\doteq ${tn(k.S)}`)
          + h.p(`$\\varrho \\doteq ${tn(k.ro)}$ je vzdialenosť stredu podstavy od jej strany, bočná hrana meria $${tn(k.s)}$.`);
        if(typ === "valec") return h.calc(`V = \\pi \\va{r}^2 \\vb{v} = \\pi \\cdot ${tn(P.r * P.r)} \\cdot ${Vv} \\doteq ${tn(k.V)}`) + h.calc(`S = 2\\pi \\va{r}(\\va{r} + \\vb{v}) = 2\\pi \\cdot ${R} \\cdot ${tn(P.r + P.v)} \\doteq ${tn(k.S)}`)
          + h.p(`Plášť je obdĺžnik $2\\pi r \\times v \\doteq ${tn(2 * PI * P.r)} \\times ${tn(P.v)}$.`);
        if(typ === "kuzel") return h.calc(`\\vd{s} = \\sqrt{\\va{r}^2 + \\vb{v}^2} \\doteq \\vd{${tn(k.s)}}`) + h.calc(`V = \\tfrac13 \\pi \\va{r}^2 \\vb{v} \\doteq ${tn(k.V)}`) + h.calc(`S = \\pi \\va{r}(\\va{r} + \\vd{s}) \\doteq ${tn(k.S)}`)
          + h.p(`Plášť je kruhový výsek s polomerom $s$ a uhlom $360^\\circ \\cdot \\dfrac{r}{s} \\doteq ${tn(k.uhol, 1)}^\\circ$.`);
        return h.calc(`V = \\tfrac43 \\pi \\va{r}^3 = \\tfrac43 \\pi \\cdot ${tn(P.r ** 3)} \\doteq ${tn(k.V)}`) + h.calc(`S = 4\\pi \\va{r}^2 = 4\\pi \\cdot ${tn(P.r * P.r)} \\doteq ${tn(k.S)}`);
      }
    };
  }
});

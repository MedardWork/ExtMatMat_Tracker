/* ============================================================
   TOOL: trojuholnik — a triangle you can pull by its corners, with its lines and circles
   cfg:
     pts      {A:[1, 1], B:[9, 1], C:[4, 7]}       starting corners
     fixed    ["A", "B"]                            corners that stay put in this example
     on       {taznice:true, …}                     layers shown from the start
     toggles  ["vysky"]                             layers the reader may switch here (the rest stay as set)
     view, snap, draw(g, P, st), out(P, h, st)     h.geo is everything measured (see triGeo)
   Layers: strany, uhly, taznice, vysky, priecky, opisana, vpisana
   ============================================================ */
const TRI_LAYERS = [
  ["strany",  "Dĺžky strán"],
  ["uhly",    "Veľkosti uhlov"],
  ["taznice", "Ťažnice a ťažisko"],
  ["vysky",   "Výšky"],
  ["priecky", "Stredné priečky"],
  ["opisana", "Opísaná kružnica (osi strán)"],
  ["vpisana", "Vpísaná kružnica (osi uhlov)"]
];
const TRI_COLOR = {taznice:"a", vysky:"b", priecky:"d", opisana:"c", vpisana:"ok"};

/* everything worth knowing about triangle ABC, from its corner coordinates */
function triGeo(P){
  const A = [P.Ax, P.Ay], B = [P.Bx, P.By], C = [P.Cx, P.Cy];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], len = v => Math.hypot(v[0], v[1]);
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const dist = (p, q) => len(sub(p, q));
  const a = dist(B, C), b = dist(C, A), c = dist(A, B);
  const cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
  const S = Math.abs(cross) / 2, o = a + b + c;
  const ok = S > 1e-6;
  /* foot of the perpendicular from p to line qr, and how far along qr it lies (0…1 = on the side) */
  const foot = (p, q, r) => {
    const d = sub(r, q), t = ((p[0] - q[0]) * d[0] + (p[1] - q[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]);
    return {p:[q[0] + t * d[0], q[1] + t * d[1]], t};
  };
  const ang = (p, q, r) => {   /* angle at p */
    const u = sub(q, p), v = sub(r, p);
    return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (len(u) * len(v))))) * 180 / Math.PI;
  };
  const A1 = mid(B, C), B1 = mid(C, A), C1 = mid(A, B);
  const T = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const D = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const sq = p => p[0] * p[0] + p[1] * p[1];
  const O = ok ? [(sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / D,
                  (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / D] : [NaN, NaN];
  const I = ok ? [(a * A[0] + b * B[0] + c * C[0]) / o, (a * A[1] + b * B[1] + c * C[1]) / o] : [NaN, NaN];
  const Pa = foot(A, B, C), Pb = foot(B, C, A), Pc = foot(C, A, B);
  return {
    ok, A, B, C, a, b, c, S, o, s:o / 2,
    alfa:ang(A, B, C), beta:ang(B, C, A), gama:ang(C, A, B),
    A1, B1, C1, T,
    ta:dist(A, A1), tb:dist(B, B1), tc:dist(C, C1),
    Pa, Pb, Pc, va:dist(A, Pa.p), vb:dist(B, Pb.p), vc:dist(C, Pc.p),
    V:[A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]],   /* orthocentre, by Euler's line */
    O, r:ok ? a * b * c / (4 * S) : NaN,
    I, ro:ok ? S / (o / 2) : NaN,
    Ua:[(b * B[0] + c * C[0]) / (b + c), (b * B[1] + c * C[1]) / (b + c)],   /* where the bisector from A meets BC */
    Ub:[(a * A[0] + c * C[0]) / (a + c), (a * A[1] + c * C[1]) / (a + c)],
    Uc:[(a * A[0] + b * B[0]) / (a + b), (a * A[1] + b * B[1]) / (a + b)],
    Da:foot(I, B, C).p, Db:foot(I, C, A).p, Dc:foot(I, A, B).p
  };
}

defTool("trojuholnik", {
  name:"Trojuholník",
  area:"Planimetria",
  desc:"Ťahaj vrcholy a zapínaj ťažnice, výšky, stredné priečky, opísanú a vpísanú kružnicu.",
  topics:["a28"],
  presets:[
    {name:"Ťažnice", cfg:{on:{taznice:true}}},
    {name:"Výšky", cfg:{on:{vysky:true}}},
    {name:"Stredné priečky", cfg:{on:{priecky:true, strany:true}}},
    {name:"Opísaná kružnica", cfg:{on:{opisana:true}}},
    {name:"Vpísaná kružnica", cfg:{on:{vpisana:true}}},
    {name:"Strany a uhly", cfg:{on:{strany:true, uhly:true}}}
  ],

  /* A: 1 1 / B: 9 1 / C: 4 7 / ukaz: taznice, vysky */
  fromText(kv){
    const cfg = {pts:{}, on:{}, toggles:TRI_LAYERS.map(l => l[0])};
    kv.forEach(([k, v]) => {
      const key = norm(k);
      if(/^[abc]$/.test(key)){ const n = toolNums(v); if(n.length > 1) cfg.pts[key.toUpperCase()] = [n[0], n[1]]; }
      else if(key === "ukaz") toolWords(v).forEach(w => {
        const hit = TRI_LAYERS.find(l => w.startsWith(l[0].slice(0, 5)) || norm(l[1]).includes(w));
        if(hit) cfg.on[hit[0]] = true;
      });
    });
    return cfg;
  },
  toText(st){
    const P = st.P, out = ["A", "B", "C"].map(n => `${n}: ${toolNum(P[n + "x"])} ${toolNum(P[n + "y"])}`);
    const show = TRI_LAYERS.filter(l => P[l[0]]).map(l => l[0]);
    if(show.length) out.push(`ukaz: ${show.join(", ")}`);
    return out.join("\n");
  },

  make(cfg, env){
    const pts = Object.assign({A:[1, 1], B:[9, 1], C:[4, 7]}, cfg.pts);
    const fixed = cfg.fixed || [];
    const on = cfg.on || (env.full ? {taznice:true} : {});
    const free = env.full ? TRI_LAYERS.map(l => l[0]) : cfg.toggles || [];
    const params = {};
    TRI_LAYERS.forEach(([id, name]) => { params[id] = {type:"check", v:!!on[id], name, lock:!free.includes(id), color:TRI_COLOR[id]}; });
    const points = {};
    const off = {A:[-18, -12], B:[10, -12], C:[-4, 18]};
    for(const n of ["A", "B", "C"]) points[n] = [pts[n][0], pts[n][1], {fixed:fixed.includes(n), color:"ink", offset:off[n]}];
    const geo = st => toolDerive(st, "geo", triGeo);

    return {
      params, points, snap:cfg.snap || .5,
      hint:fixed.length === 3 ? null : fixed.length ? `Vrchol ${["A", "B", "C"].filter(n => !fixed.includes(n)).map(n => `**${n}**`).join(" a ")} sa dá ťahať.` : "Vrcholy **A**, **B**, **C** ťahaj alebo im vpíš súradnice.",
      board:{bbox:cfg.view || [-1.5, 8.5, 11.5, -1.5], axis:false, aspect:"13/10"},
      draw(g, P, st){
        const G = () => geo(st);
        const X = (get, i) => () => { const d = G(); return d.ok ? get(d)[i] : NaN; };
        const xy = get => [X(get, 0), X(get, 1)];
        const layer = (id, get) => [() => P[id] ? X(get, 0)() : NaN, X(get, 1)];
        const A = xy(d => d.A), B = xy(d => d.B), C = xy(d => d.C);

        g.poly([A, B, C], "ink", {fillOpacity:.05});
        g.seg(A, B, "ink", {strokeWidth:2.6}); g.seg(B, C, "ink", {strokeWidth:2.6}); g.seg(C, A, "ink", {strokeWidth:2.6});

        /* side lengths, pushed a little outwards from the centre */
        const outward = (get, k) => () => { const d = G(), m = get(d), v = [m[0] - d.T[0], m[1] - d.T[1]], l = Math.hypot(v[0], v[1]) || 1; return m[k] + v[k] / l * .55; };
        [["a", d => d.A1], ["b", d => d.B1], ["c", d => d.C1]].forEach(([n, get]) =>
          g.txt(() => P.strany ? outward(get, 0)() : NaN, outward(get, 1), () => `${n} = ${fmtN(G()[n])}`, "ink", {anchorX:"middle"}));
        /* angles, a little inside each corner */
        const inward = (get, k) => () => { const d = G(), m = get(d), v = [d.I[0] - m[0], d.I[1] - m[1]], l = Math.hypot(v[0], v[1]) || 1; return m[k] + v[k] / l * 1.05; };
        [["alfa", "α", d => d.A], ["beta", "β", d => d.B], ["gama", "γ", d => d.C]].forEach(([n, s, get]) =>
          g.txt(() => P.uhly ? inward(get, 0)() : NaN, inward(get, 1), () => `${s} = ${fmtN(G()[n], 1)}°`, "soft", {anchorX:"middle", fontSize:12}));

        /* medians */
        const med = (v, m, name) => {
          g.seg(layer("taznice", v), xy(m), "a", {strokeWidth:2.2});
          g.pt(layer("taznice", m)[0], X(m, 1), "a", {size:3, label:name, at:"b"});
        };
        med(d => d.A, d => d.A1, "A₁"); med(d => d.B, d => d.B1, "B₁"); med(d => d.C, d => d.C1, "C₁");
        g.pt(layer("taznice", d => d.T)[0], X(d => d.T, 1), "a", {size:5, label:"T", at:"tr"});

        /* altitudes: the line itself, the side extended when the foot falls outside, a right-angle mark */
        const alt = (v, f, q, r) => {
          g.seg(layer("vysky", v), xy(d => f(d).p), "b", {strokeWidth:2.2});
          const outside = () => { const t = f(G()).t; return P.vysky && (t < 0 || t > 1); };
          g.seg([() => outside() ? X(d => f(d).p, 0)() : NaN, X(d => f(d).p, 1)],
                [() => { const d = G(); return (f(d).t < 0 ? q(d) : r(d))[0]; }, () => { const d = G(); return (f(d).t < 0 ? q(d) : r(d))[1]; }], "soft", {dash:2, strokeWidth:1.4});
          g.seg([() => outside() ? X(v, 0)() : NaN, X(v, 1)], xy(d => d.V), "b", {dash:2, strokeWidth:1.2});
          g.seg([() => outside() ? X(d => f(d).p, 0)() : NaN, X(d => f(d).p, 1)], xy(d => d.V), "b", {dash:2, strokeWidth:1.2});
          const mark = k => () => {   /* corners of a small square at the foot */
            const d = G(), F = f(d).p, Vx = v(d), s = .32;
            const u = [r(d)[0] - q(d)[0], r(d)[1] - q(d)[1]], ul = Math.hypot(u[0], u[1]) || 1;
            const n = [Vx[0] - F[0], Vx[1] - F[1]], nl = Math.hypot(n[0], n[1]) || 1;
            const e = [u[0] / ul * s, u[1] / ul * s], h = [n[0] / nl * s, n[1] / nl * s];
            return [[F[0] + e[0], F[1] + e[1]], [F[0] + e[0] + h[0], F[1] + e[1] + h[1]], [F[0] + h[0], F[1] + h[1]]][k];
          };
          const mp = k => [() => P.vysky && G().ok ? mark(k)()[0] : NaN, () => mark(k)()[1]];
          g.seg(mp(0), mp(1), "b", {strokeWidth:1.2}); g.seg(mp(1), mp(2), "b", {strokeWidth:1.2});
        };
        alt(d => d.A, d => d.Pa, d => d.B, d => d.C); alt(d => d.B, d => d.Pb, d => d.C, d => d.A); alt(d => d.C, d => d.Pc, d => d.A, d => d.B);
        g.pt(layer("vysky", d => d.V)[0], X(d => d.V, 1), "b", {size:4.5, label:"V", at:"tr"});

        /* midsegments */
        g.seg(layer("priecky", d => d.A1), xy(d => d.B1), "d", {strokeWidth:3});
        g.seg(layer("priecky", d => d.B1), xy(d => d.C1), "d", {strokeWidth:3});
        g.seg(layer("priecky", d => d.C1), xy(d => d.A1), "d", {strokeWidth:3});
        [[d => d.A1, "A₁"], [d => d.B1, "B₁"], [d => d.C1, "C₁"]].forEach(([m, name]) =>
          g.pt(() => P.priecky && !P.taznice ? X(m, 0)() : NaN, X(m, 1), "d", {size:3.5, label:name, at:"b"}));

        /* circumscribed circle: perpendicular bisectors meet in its centre */
        const bis = m => {
          const far = k => () => { const d = G(), M = m(d), v = [d.O[0] - M[0], d.O[1] - M[1]], l = Math.hypot(v[0], v[1]); return l < 1e-6 ? M[k] : d.O[k] + v[k] / l * .8; };
          g.seg(layer("opisana", m), [far(0), far(1)], "c", {dash:2, strokeWidth:1.4});
        };
        bis(d => d.A1); bis(d => d.B1); bis(d => d.C1);
        g.circle(layer("opisana", d => d.O)[0], X(d => d.O, 1), () => G().r, "c");
        g.pt(layer("opisana", d => d.O)[0], X(d => d.O, 1), "c", {size:4.5, label:"S", at:"tr"});

        /* inscribed circle: angle bisectors meet in its centre */
        g.seg(layer("vpisana", d => d.A), xy(d => d.Ua), "ok", {dash:2, strokeWidth:1.4});
        g.seg(layer("vpisana", d => d.B), xy(d => d.Ub), "ok", {dash:2, strokeWidth:1.4});
        g.seg(layer("vpisana", d => d.C), xy(d => d.Uc), "ok", {dash:2, strokeWidth:1.4});
        g.circle(layer("vpisana", d => d.I)[0], X(d => d.I, 1), () => G().ro, "ok");
        g.pt(layer("vpisana", d => d.I)[0], X(d => d.I, 1), "ok", {size:4.5, label:"O", at:"tr"});
        [d => d.Da, d => d.Db, d => d.Dc].forEach(m => g.pt(layer("vpisana", m)[0], X(m, 1), "ok", {size:2.5}));

        if(cfg.draw) cfg.draw(g, P, st);
      },
      out(P, h, st){
        const d = geo(st);
        h.geo = d;
        if(!d.ok) return h.p("Vrcholy ležia na jednej priamke, trojuholník nevznikol.");
        if(cfg.out) return cfg.out(P, h, st);
        let s = h.p(`Strany: $a = ${texN(d.a)}$, $b = ${texN(d.b)}$, $c = ${texN(d.c)}$`)
          + h.p(`Obvod $o = ${texN(d.o)}$, obsah $S = ${texN(d.S)}$`);
        if(P.uhly) s += h.p(`Uhly: $\\alpha = ${texN(d.alfa, 1)}°$, $\\beta = ${texN(d.beta, 1)}°$, $\\gamma = ${texN(d.gama, 1)}°$`);
        if(P.taznice) s += h.p(`Ťažnice: $\\va{t_a = ${texN(d.ta)}}$, $\\va{t_b = ${texN(d.tb)}}$, $\\va{t_c = ${texN(d.tc)}}$`)
          + h.p(`Ťažisko delí $t_a$ na $${texN(d.ta * 2 / 3)}$ a $${texN(d.ta / 3)}$, teda $2 : 1$.`);
        if(P.vysky) s += h.p(`Výšky: $\\vb{v_a = ${texN(d.va)}}$, $\\vb{v_b = ${texN(d.vb)}}$, $\\vb{v_c = ${texN(d.vc)}}$`);
        if(P.priecky) s += h.p(`Stredná priečka $\\vd{|A_1B_1| = ${texN(d.c / 2)}}$ je polovica strany $c = ${texN(d.c)}$.`);
        if(P.opisana) s += h.p(`Polomer opísanej kružnice $\\vc{r = ${texN(d.r)}}$`);
        if(P.vpisana) s += h.p(`Polomer vpísanej kružnice $\\varrho = ${texN(d.ro)}$`);
        return s;
      }
    };
  }
});

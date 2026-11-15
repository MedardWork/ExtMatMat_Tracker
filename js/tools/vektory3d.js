/* ============================================================
   TOOL: vektory3d — vectors, planes, lines and spheres in space, drawn in a view you can turn
   (sliders "otoč" and "sklon", or drag with the mouse). Plain SVG.
   cfg:
     typ      "vektory"   a and b from the origin; switches sucin (cross product a × b and the parallelogram), uhol (dot product and angle)
              "rovina"    the plane through P with normal n: its equation;  smery:[[1, 0, 1], [0, 1, 1]] gives it by two direction
                          vectors instead (parametric form → normal → equation);  switch bod (distance of the point Q from the plane)
              "priamka"   the line through P with direction r, the point for the parameter t;
                          switches rovina (a plane with normal n through the point S: intersection and angle), bod (distance of Q from the line)
              "gula"      the sphere with centre C and radius R: its equation; switch bod (where Q lies)
     a, b, P, n, r, Q, S, C    vectors and points as [x, y, z];  single coordinates can be set as a1:{v, lock…}, P2:3 …
     t, R, otoc (azimuth), sklon (elevation)   sliders;  rozsah:4 (how far the axes reach)
     on, toggles, free, lock, hide    as in toolParams (ids: a1 a2 a3 b1 … P1 … n1 … r1 … Q1 … S1 … C1 …, t, R, otoc, sklon)
     en       true        English texts (theory of the Danish topics)
     out(P, h, st)     h.v3 = {a, b, kriz (a × b), skal (a · b), uhol, obsah, n, d (plane: n·x + d = 0), vzd (distance), X (intersection / foot), bod (point on the line)}
   ============================================================ */
defTool("vektory3d", {
  name:"Vektory, roviny a priamky v priestore",
  area:"Stereometria",
  desc:"Vektorový súčin, rovnica roviny, priamka v priestore a guľa v otočnom pohľade.",
  topics:["c22", "c23", "c24", "c25"],
  presets:[
    {name:"Vektorový súčin", cfg:{typ:"vektory", on:{sucin:true}}, tip:"Prepíš súradnice vektorov. Vektor $\\vec a \\times \\vec b$ je kolmý na oba a jeho dĺžka sa rovná obsahu rovnobežníka."},
    {name:"Skalárny súčin a uhol", cfg:{typ:"vektory", on:{uhol:true}}, tip:"Nastav vektory tak, aby bol skalárny súčin 0. Aký uhol vtedy zvierajú?"},
    {name:"Rovnica roviny", cfg:{typ:"rovina"}, tip:"Zmeň normálový vektor $\\vec n$ a bod $P$. Koeficienty pri $x$, $y$, $z$ sú súradnice normály."},
    {name:"Rovina z dvoch smerov", cfg:{typ:"rovina", smery:[[2, 0, 1], [0, 2, 1]], P:[0, 0, 1]}, tip:"Rovina je daná bodom a dvoma smerovými vektormi. Normálu dá ich vektorový súčin."},
    {name:"Vzdialenosť bodu od roviny", cfg:{typ:"rovina", on:{bod:true}}, tip:"Prepíš bod $Q$ a sleduj dosadenie do vzorca. Kedy vyjde vzdialenosť 0?"},
    {name:"Priamka v priestore", cfg:{typ:"priamka"}, tip:"Meň parameter $t$: bod sa posúva po priamke. Pre $t = 0$ je v bode $P$."},
    {name:"Priamka a rovina", cfg:{typ:"priamka", on:{rovina:true}}, tip:"Zmeň smer priamky tak, aby bola s rovinou rovnobežná. Čo sa stane s priesečníkom?"},
    {name:"Guľa", cfg:{typ:"gula", on:{bod:true}}, tip:"Presuň bod $Q$ dovnútra gule, na jej povrch a von. Rozhoduje porovnanie $|CQ|$ s polomerom."}
  ],
  help:"Súradnice vektorov a bodov sa píšu priamo do políčok (šípky ↑ ↓ ich menia po jednej). Pohľad otočíš posuvníkmi **otoč** a **sklon**, alebo ťahaním myšou po obrázku.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = ["vektory", "rovina", "priamka", "gula"].includes(cfg.typ) ? cfg.typ : "vektory";
    const RNG = cfg.rozsah || 4, smery = typ === "rovina" && cfg.smery ? cfg.smery : null;
    /* three sliders for one vector or point; cfg may give it whole as [x, y, z] */
    const c2 = Object.assign({}, cfg);
    /* note + sw: what the row is, and the switch it belongs to (it is listed only while that switch is on) */
    const vec = (k, def, color, name, note, sw) => { const v = Array.isArray(cfg[k]) ? cfg[k] : def; delete c2[k]; return Object.fromEntries([0, 1, 2].map(i => [k + (i + 1),
      {v:v[i], min:-RNG, max:RNG, step:1, color, name:`${name || k}${"₁₂₃"[i]}`, row:k, rowName:name || k, rowNote:note, when:sw ? P => !!P[sw] : null}])); };
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const Qd = vec("Q", typ === "gula" ? [3, 2, 2] : [3, 3, 4], "d", null, T("bod", "point"), "bod");
    /* on the tool's own page the two directions of a plane can be retyped */
    const dirs = smery && env.full ? Object.assign(vec("u", smery[0], "c", "r₁", "smer"), vec("v", smery[1], "c", "r₂", "smer")) : null;
    const defs = Object.assign({},
      typ === "vektory" ? Object.assign(vec("a", [2, 1, 0], "a", null, T("vektor", "vector")), vec("b", [0, 2, 1], "b", null, T("vektor", "vector")), {sucin:ck(T("Vektorový súčin a × b", "Cross product a × b"), "d"), uhol:ck(T("Skalárny súčin a uhol", "Dot product and angle"), "c")})
      : typ === "rovina" ? Object.assign(vec("P", [1, 1, 2], "a", null, T("bod roviny", "point of the plane")), smery ? dirs : vec("n", [1, 1, 2], "b", null, T("normála", "normal")), {bod:ck(T("Vzdialenosť bodu Q od roviny", "Distance of the point Q from the plane"), "d")}, Qd)
      : typ === "priamka" ? Object.assign(vec("P", [-3, -2, 0], "a", null, T("bod priamky", "point of the line")), vec("r", [1, 2, 1], "b", null, T("smer", "direction")), {t:{v:1, min:-3, max:3, step:.5, color:"c", note:T("parameter", "parameter")},
          rovina:ck(T("Rovina: priesečník a uhol", "A plane: intersection and angle"), "d"), bod:ck(T("Vzdialenosť bodu Q od priamky", "Distance of the point Q from the line"), "d")}, vec("n", [0, 0, 1], "d", null, T("normála roviny", "normal of the plane"), "rovina"), vec("S", [0, 0, 3], "d", null, T("bod roviny", "point of the plane"), "rovina"), Qd)
      : Object.assign(vec("C", [1, 1, 1], "a", null, T("stred", "centre")), {R:{v:2.5, min:1, max:3, step:.5, color:"b", note:T("polomer", "radius")}, bod:ck(T("Bod Q", "The point Q"), "d")}, Qd),
      {otoc:{v:25, min:-180, max:180, step:5, name:T("otoč", "turn"), plain:true}, sklon:{v:20, min:5, max:85, step:5, name:T("sklon", "tilt"), plain:true}});
    const params = toolParams(defs, c2, env);
    /* points of objects that are switched off are not listed among the sliders */
    const quiet = (keys, sw) => keys.forEach(k => [1, 2, 3].forEach(i => { const p = params[k + i]; if(p && !params[sw].v && params[sw].lock && !env.full){ p.lock = true; p.hide = true; } }));
    if(params.bod) quiet(["Q"], "bod");
    if(typ === "priamka") quiet(["n", "S"], "rovina");
    const W = 560, H = 360, U = Math.min(W, H) / (2 * RNG * 1.2), {add, sub, mul, dot, cross, len} = V3;
    const V = (P, k) => [P[k + 1], P[k + 2], P[k + 3]];
    const view = P => {
      const az = P.otoc * Math.PI / 180, el = P.sklon * Math.PI / 180, ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
      return {p:q => [W / 2 + (-q[0] * sa + q[1] * ca) * U, H / 2 + 14 - (-(q[0] * ca + q[1] * sa) * se + q[2] * ce) * U], depth:q => (q[0] * ca + q[1] * sa) * ce + q[2] * se};
    };
    /* the part of a plane inside the cube of the axes, corners in order */
    const patch = (P0, n) => {
      const pts = [], put = p => { if(!pts.some(q => len(sub(p, q)) < 1e-6)) pts.push(p); }, c = [-RNG, RNG];
      for(let ax = 0; ax < 3; ax++) c.forEach(u => c.forEach(w => {
        const p = [0, 0, 0], q = [0, 0, 0]; p[ax] = -RNG; q[ax] = RNG; p[(ax + 1) % 3] = q[(ax + 1) % 3] = u; p[(ax + 2) % 3] = q[(ax + 2) % 3] = w;
        const dp = dot(n, sub(p, P0)), dq = dot(n, sub(q, P0));
        if(Math.abs(dp) < 1e-9) put(p);
        if(Math.abs(dq) < 1e-9) put(q);
        if(dp * dq < -1e-12) put(add(p, mul(sub(q, p), dp / (dp - dq))));
      }));
      if(pts.length < 3) return [];
      const m = mul(pts.reduce(add, [0, 0, 0]), 1 / pts.length), e1 = sub(pts[0], m), e2 = cross(n, e1), at = p => Math.atan2(dot(sub(p, m), e2) / len(e2), dot(sub(p, m), e1) / len(e1));
      return pts.sort((p, q) => at(p) - at(q));
    };
    const clipLine = (P0, r) => {
      let t0 = -Infinity, t1 = Infinity;
      for(let i = 0; i < 3; i++){
        if(Math.abs(r[i]) < 1e-9){ if(Math.abs(P0[i]) > RNG) return null; continue; }
        const x = (-RNG - P0[i]) / r[i], y = (RNG - P0[i]) / r[i];
        t0 = Math.max(t0, Math.min(x, y)); t1 = Math.min(t1, Math.max(x, y));
      }
      return t0 < t1 ? [add(P0, mul(r, t0)), add(P0, mul(r, t1))] : null;
    };
    const calc = P => {
      const r = {};
      if(typ === "vektory"){
        const a = V(P, "a"), b = V(P, "b");
        Object.assign(r, {a, b, kriz:cross(a, b), skal:dot(a, b), obsah:len(cross(a, b)), uhol:len(a) && len(b) ? Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (len(a) * len(b))))) * 180 / Math.PI : NaN});
      } else if(typ === "rovina"){
        const sm = smery ? (params.u1 ? [V(P, "u"), V(P, "v")] : smery) : null;
        const P0 = V(P, "P"), n = sm ? cross(sm[0], sm[1]) : V(P, "n"), Q = V(P, "Q");
        Object.assign(r, {P0, n, d:-dot(n, P0), Q, sm});
        if(len(n) > 1e-9){ const w = dot(n, sub(Q, P0)); r.vzd = Math.abs(w) / len(n); r.X = sub(Q, mul(n, w / dot(n, n))); }
      } else if(typ === "priamka"){
        const P0 = V(P, "P"), d = V(P, "r"), n = V(P, "n"), S = V(P, "S"), Q = V(P, "Q");
        Object.assign(r, {P0, r:d, n, S, Q, bod:add(P0, mul(d, P.t)), d:-dot(n, S)});
        if(P.rovina && len(n) > 1e-9 && len(d) > 1e-9){
          const dn = dot(d, n);
          r.uhol = Math.asin(Math.min(1, Math.abs(dn) / (len(d) * len(n)))) * 180 / Math.PI;
          if(Math.abs(dn) > 1e-9){ r.tX = dot(n, sub(S, P0)) / dn; r.X = add(P0, mul(d, r.tX)); }
        }
        if(P.bod && len(d) > 1e-9){ const tq = dot(sub(Q, P0), d) / dot(d, d); r.F = add(P0, mul(d, tq)); r.vzd = len(sub(Q, r.F)); }
      } else {
        const C = V(P, "C"), Q = V(P, "Q");
        Object.assign(r, {C, R:P.R, Q, vzd:len(sub(Q, C))});
      }
      return r;
    };
    const col = c => `\\begin{pmatrix}${c.map(v => texN(v)).join("\\\\")}\\end{pmatrix}`, pt = c => `(${c.map(v => texN(v)).join(";\\ ")})`;

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const v = view(P), r = calc(P), thumb = st.env.thumb, O = [0, 0, 0];
        const seg = (p, q, c) => SG.seg(v.p(p), v.p(q), c);
        const arrow = (p, q, c, name) => { const a = v.p(p), b = v.p(q); return Math.hypot(b[0] - a[0], b[1] - a[1]) < 3 ? "" : SV.line(a[0], a[1], b[0], b[1], `s ${c} w3`) + SV.head(b[0], b[1], b[0] - a[0], b[1] - a[1], `f ${c}`, 10) + (thumb || !name ? "" : SV.text(b[0] + 8, b[1] - 6, name, `${c} halo`)); };
        const dot3 = (p, c, name) => { const a = v.p(p); return SG.dot(a, `h ${c}`, 5) + (thumb || !name ? "" : SV.text(a[0] + 8, a[1] - 7, name, `${c} halo`)); };
        const drop = (p, c) => seg(p, [p[0], p[1], 0], `s ${c} w1 dash`) + seg([p[0], p[1], 0], [p[0], 0, 0], "s cgrid w1 dash") + seg([p[0], p[1], 0], [0, p[1], 0], "s cgrid w1 dash");
        let h = "";
        for(let i = -RNG; i <= RNG; i++) h += seg([i, -RNG, 0], [i, RNG, 0], "s cgrid w1") + seg([-RNG, i, 0], [RNG, i, 0], "s cgrid w1");
        const axes = [[[RNG + .6, 0, 0], "x"], [[0, RNG + .6, 0], "y"], [[0, 0, RNG + .6], "z"]].map(([e, n]) => {
          const a = v.p(mul(e, n === "z" ? -.45 : -1)), b = v.p(e);
          return SV.line(a[0], a[1], b[0], b[1], "s w1 csoft") + SV.head(b[0], b[1], b[0] - a[0], b[1] - a[1], "f csoft", 7) + (thumb ? "" : SV.text(b[0] + (b[0] - a[0]) * .04, b[1] + (b[1] - a[1]) * .04 + 4, n, "mid it csoft"));
        }).join("");
        if(typ === "vektory"){
          if(P.sucin) h += SV.poly([O, r.a, add(r.a, r.b), r.b].map(v.p), "bg cd po-pl");
          h += axes + drop(r.a, "ca") + drop(r.b, "cb");
          if(P.sucin) h += seg(r.a, add(r.a, r.b), "s cd w1") + seg(r.b, add(r.a, r.b), "s cd w1") + arrow(O, r.kriz, "cd", "a × b");
          if(P.uhol && len(r.a) && len(r.b)){ const ua = mul(r.a, 1 / len(r.a)), ub = mul(r.b, 1 / len(r.b)); h += SV.path(SV.d(Array.from({length:13}, (_, i) => { const w = add(mul(ua, 1 - i / 12), mul(ub, i / 12)); return v.p(mul(w, 1.1 / (len(w) || 1))); })), "s cc"); }
          h += arrow(O, r.a, "ca", "a") + arrow(O, r.b, "cb", "b");
        } else if(typ === "rovina"){
          const poly = len(r.n) > 1e-9 ? patch(r.P0, r.n).map(v.p) : [];
          if(poly.length > 2) h += SV.poly(poly, "bg cb po-pl") + SV.poly(poly, "s cb w1");
          h += axes;
          if(smery) h += arrow(r.P0, add(r.P0, r.sm[0]), "cc", "r₁") + arrow(r.P0, add(r.P0, r.sm[1]), "cc", "r₂");
          h += arrow(r.P0, add(r.P0, r.n), "cb", "n") + dot3(r.P0, "ca", "P");
          if(P.bod && r.X) h += seg(r.Q, r.X, "s cd w3") + SG.dot(v.p(r.X), "f cd", 3.5) + dot3(r.Q, "cd", "Q");
        } else if(typ === "priamka"){
          if(P.rovina && len(r.n) > 1e-9){ const poly = patch(r.S, r.n).map(v.p); if(poly.length > 2) h += SV.poly(poly, "bg cd po-pl") + SV.poly(poly, "s cd w1"); }
          h += axes;
          const e = len(r.r) > 1e-9 ? clipLine(r.P0, r.r) : null;
          if(e) h += seg(e[0], e[1], "s w3");
          h += arrow(r.P0, add(r.P0, r.r), "cb", "r") + dot3(r.P0, "ca", "P") + drop(r.bod, "cc") + dot3(r.bod, "cc", `t = ${fmtN(P.t)}`);
          if(P.rovina && r.X && r.X.every(c => Math.abs(c) <= RNG + 1e-9)) h += dot3(r.X, "cd", "X");
          if(P.bod && r.F) h += seg(r.Q, r.F, "s cd w3") + SG.dot(v.p(r.F), "f cd", 3.5) + dot3(r.Q, "cd", "Q");
        } else {
          const c = v.p(r.C), ring = (f, n = 72) => { const front = [], back = []; for(let i = 0; i <= n; i++){ const t = 2 * Math.PI * i / n, q = add(r.C, f(t)); (v.depth(sub(q, r.C)) >= -1e-9 ? front : back).push(v.p(q)); if(v.depth(sub(q, r.C)) < 0) front.push(null); else back.push(null); } return SV.path(SV.d(back), "s cb w1 dash") + SV.path(SV.d(front), "s cb"); };
          h += axes + SV.circle(c[0], c[1], r.R * U, "bg cb po-pl") + SV.circle(c[0], c[1], r.R * U, "s cb")
            + ring(t => [r.R * Math.cos(t), r.R * Math.sin(t), 0]) + ring(t => [r.R * Math.cos(t), 0, r.R * Math.sin(t)])
            + drop(r.C, "ca") + dot3(r.C, "ca", "C");
          if(P.bod) h += seg(r.C, r.Q, "s cd w1 dash") + drop(r.Q, "cd") + dot3(r.Q, "cd", "Q");
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        let last = null;
        el.addEventListener("pointerdown", e => { if(e.pointerType === "mouse"){ last = [e.clientX, e.clientY]; el.setPointerCapture(e.pointerId); e.preventDefault(); } });
        el.addEventListener("pointermove", e => {
          if(!last) return;
          const snap = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          st.P.otoc = snap(((st.P.otoc - (e.clientX - last[0]) * .5 + 540) % 360) - 180, -180, 180);
          st.P.sklon = snap(st.P.sklon + (e.clientY - last[1]) * .5, 5, 85);
          last = [e.clientX, e.clientY];
          toolCtlSync(st); toolUpdate(st);
        });
        const end = () => { last = null; };
        el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
      },
      out(P, h, st){
        const tn = h.tn, r = h.v3 = calc(P), eq = v => Math.abs(v - Math.round(v * 100) / 100) < 1e-9 ? "=" : "\\doteq";
        if(cfg.out) return cfg.out(P, h, st);
        const plane = (n, d) => `${linTex([[n[0], "x"], [n[1], "y"], [n[2], "z"], [d, ""]])} = 0`;
        if(typ === "vektory"){
          const a = r.a, b = r.b, pm = v => v < 0 ? `(${tn(v)})` : tn(v);
          return h.calc(`\\va{\\vec a} = \\va{${col(a)}}, \\qquad \\vb{\\vec b} = \\vb{${col(b)}}`)
            + (P.uhol ? h.calc(`\\vec a \\cdot \\vec b = ${a.map((v, i) => `${pm(v)} \\cdot ${pm(b[i])}`).join(" + ")} = \\vc{${tn(r.skal)}}`)
              + (isFinite(r.uhol) ? h.calc(`\\cos v = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a| \\cdot |\\vec b|} = \\dfrac{${tn(r.skal)}}{${tn(len(a), 3)} \\cdot ${tn(len(b), 3)}}, \\qquad v ${eq(r.uhol)} \\vc{${tn(r.uhol, 1)}^\\circ}`) : "")
              + (Math.abs(r.skal) < 1e-9 ? h.pill(T("skalárny súčin je 0: vektory sú kolmé", "the dot product is 0: the vectors are perpendicular"), "ok") : "") : "")
            + (P.sucin ? h.calc(`\\vec a \\times \\vec b = \\begin{pmatrix}a_2 b_3 - a_3 b_2\\\\ a_3 b_1 - a_1 b_3\\\\ a_1 b_2 - a_2 b_1\\end{pmatrix} = \\vd{${col(r.kriz)}}`)
              + h.calc(`|\\vec a \\times \\vec b| ${eq(r.obsah)} \\vd{${tn(r.obsah)}}`) + h.p(T("Vektorový súčin je kolmý na oba vektory a jeho dĺžka je obsah rovnobežníka.", "The cross product is perpendicular to both vectors and its length is the area of the parallelogram.")) : "");
        }
        if(typ === "rovina"){
          if(len(r.n) < 1e-9) return h.pill(smery ? T("smerové vektory sú rovnobežné: rovinu neurčujú", "the direction vectors are parallel: no plane") : T("normálový vektor nesmie byť nulový", "the normal vector must not be zero"), "flat");
          return (smery ? h.calc(`\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\va{${col(r.P0)}} + s \\vc{${col(r.sm[0])}} + t \\vc{${col(r.sm[1])}}`) + h.calc(`\\vb{\\vec n} = \\vec r_1 \\times \\vec r_2 = \\vb{${col(r.n)}}`)
              : h.calc(`\\va{P}${pt(r.P0)}, \\qquad \\vb{\\vec n} = \\vb{${col(r.n)}}`))
            + h.calc(`${r.n.map((v, i) => `${v < 0 ? "-" : i ? "+" : ""} \\vb{${tn(Math.abs(v))}}${r.P0[i] ? `(${"xyz"[i]} ${r.P0[i] < 0 ? "+" : "-"} ${tn(Math.abs(r.P0[i]))})` : "xyz"[i]}`).join(" ")} = 0`) + h.calc(plane(r.n, r.d))
            + (P.bod ? h.calc(`\\text{dist}(\\vd{Q}, \\alpha) = \\dfrac{|${linTex([[r.n[0], `\\cdot ${r.Q[0] < 0 ? `(${tn(r.Q[0])})` : tn(r.Q[0])}`], [r.n[1], `\\cdot ${r.Q[1] < 0 ? `(${tn(r.Q[1])})` : tn(r.Q[1])}`], [r.n[2], `\\cdot ${r.Q[2] < 0 ? `(${tn(r.Q[2])})` : tn(r.Q[2])}`], [r.d, ""]], v => texN(v))}|}{\\sqrt{${tn(dot(r.n, r.n))}}} ${eq(r.vzd)} \\vd{${tn(r.vzd)}}`) : "");
        }
        if(typ === "priamka"){
          if(len(r.r) < 1e-9) return h.pill(T("smerový vektor nesmie byť nulový", "the direction vector must not be zero"), "flat");
          let o = h.calc(`\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix} = \\va{${col(r.P0)}} + t \\cdot \\vb{${col(r.r)}}`) + h.calc(`\\vc{t = ${tn(P.t)}}: \\quad \\vc{${pt(r.bod)}}`);
          if(P.rovina && len(r.n) > 1e-9) o += h.calc(`\\vd{\\alpha}: \\ ${plane(r.n, r.d)}`)
            + (r.X ? h.calc(`t = ${tn(r.tX, 3)}: \\quad \\vd{X}${pt(r.X.map(c => Math.round(c * 1000) / 1000))}`) + h.calc(`\\sin v = \\dfrac{|\\vec r \\cdot \\vec n|}{|\\vec r| \\cdot |\\vec n|}, \\qquad v ${eq(r.uhol)} ${tn(r.uhol, 1)}^\\circ`)
              : h.pill(Math.abs(dot(r.n, sub(r.P0, r.S))) < 1e-9 ? T("priamka leží v rovine", "the line lies in the plane") : T("priamka je s rovinou rovnobežná", "the line is parallel to the plane"), "flat"));
          if(P.bod) o += h.calc(`\\text{dist}(\\vd{Q}, l) = \\dfrac{|\\vec r \\times \\overrightarrow{PQ}|}{|\\vec r|} ${eq(r.vzd)} \\vd{${tn(r.vzd)}}`);
          return o;
        }
        const C = r.C, sq = (x, c) => c === 0 ? `${x}^2` : `(${x} ${c < 0 ? "+" : "-"} ${tn(Math.abs(c))})^2`;
        return h.calc(`${sq("x", C[0])} + ${sq("y", C[1])} + ${sq("z", C[2])} = \\vb{${tn(r.R)}}^2`) + h.calc(`\\va{C}${pt(C)}, \\qquad \\vb{r = ${tn(r.R)}}`)
          + (P.bod ? h.calc(`|CQ| = \\sqrt{${sub(r.Q, C).map(v => `${v < 0 ? `(${tn(v)})` : tn(v)}^2`).join(" + ")}} ${eq(r.vzd)} \\vd{${tn(r.vzd)}}`)
            + h.pill(Math.abs(r.vzd - r.R) < 1e-9 ? T("Q leží na guli", "Q lies on the sphere") : r.vzd < r.R ? T("Q leží vnútri gule", "Q lies inside the sphere") : T("Q leží mimo gule", "Q lies outside the sphere"), Math.abs(r.vzd - r.R) < 1e-9 ? "ok" : "flat") : "");
      }
    };
  }
});

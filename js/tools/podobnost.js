/* ============================================================
   TOOL: podobnost — similar triangles: a triangle and its copy enlarged k times (lengths grow k times,
   the area k² times), and the classic shadow problem. Plain SVG.
   cfg:
     typ      "trojuholniky"   the triangle with sides a, b and angle gama between them, and its copy · k
                               switch obsah (compare the areas)
              "tien"           a pole of height h1 with shadow s1, a tree with shadow s2 → its height
     a, b, gama, k, h1, s1, s2     a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)     h.sim = {a, b, c, k, sides:[a′, b′, c′], S, S2, alfa, beta, gama, h2}
   ============================================================ */
defTool("podobnost", {
  name:"Podobnosť trojuholníkov",
  area:"Planimetria",
  desc:"Trojuholník a jeho k-násobná kópia: strany sa násobia k, obsah k², uhly zostávajú. A úloha s tieňom stromu.",
  topics:["a32", "b27"],
  presets:[
    {name:"Koeficient podobnosti", cfg:{typ:"trojuholniky"}},
    {name:"Obsahy", cfg:{typ:"trojuholniky", k:2, on:{obsah:true}}},
    {name:"Zhodné (k = 1)", cfg:{typ:"trojuholniky", k:1}},
    {name:"Tieň stromu", cfg:{typ:"tien"}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = cfg.typ === "tien" ? "tien" : "trojuholniky";
    const defs = typ === "tien" ? {
      h1:{v:2, min:.5, max:4, step:.1, color:"a", name:"h₁", note:"výška tyče"}, s1:{v:3, min:.5, max:6, step:.1, color:"b", name:"s₁", note:"tieň tyče"},
      s2:{v:12, min:1, max:20, step:.5, color:"b", name:"s₂", note:"tieň stromu"}
    } : {
      k:{v:1.5, min:.25, max:3, step:.25, color:"d", note:"koeficient podobnosti"},
      a:{v:4, min:1, max:6, step:.5, color:"a"}, b:{v:3, min:1, max:6, step:.5, color:"b"}, gama:{v:70, min:20, max:150, step:5, name:"γ", note:"uhol medzi a, b"},
      obsah:{type:"check", v:false, name:"Porovnať obsahy"}
    };
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, rad = d => d * Math.PI / 180, deg = x => x * 180 / Math.PI;
    const calc = P => {
      if(typ === "tien") return {k:P.s2 / P.s1, h2:P.h1 * P.s2 / P.s1};
      const g = rad(P.gama), c = Math.sqrt(P.a * P.a + P.b * P.b - 2 * P.a * P.b * Math.cos(g)), S = P.a * P.b * Math.sin(g) / 2;
      const alfa = deg(Math.acos((P.b * P.b + c * c - P.a * P.a) / (2 * P.b * c)));
      return {a:P.a, b:P.b, c, k:P.k, sides:[P.a * P.k, P.b * P.k, c * P.k], S, S2:S * P.k * P.k, alfa, beta:180 - alfa - P.gama, gama:P.gama};
    };

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb, T = (p, s, c) => thumb ? "" : SV.text(p[0], p[1] + 5, s, `mid halo ${c}`);
        let h = "";
        if(typ === "tien"){
          /* fixed scale, so that a longer shadow really looks longer */
          const u = 22, gy = 280, x1 = 40, x2 = 40 + 6.6 * u, ray = (x, s, ht) => SV.line(x + s * u, gy, x - .25 * s * u, gy - 1.25 * ht * u, "s cd w1 dash");
          const h2 = Math.min(r.h2, 11.5);
          h += SV.line(16, gy, W - 16, gy, "s csoft w1");
          h += SV.poly([[x1, gy], [x1 + P.s1 * u, gy], [x1, gy - P.h1 * u]], "bg cink") + ray(x1, P.s1, P.h1) + SV.line(x1, gy, x1, gy - P.h1 * u, "s ca w3") + SV.line(x1, gy, x1 + P.s1 * u, gy, "s cb w3");
          const sw = Math.min(P.s2 * u, W - x2 - 20), su = sw / P.s2;
          h += SV.poly([[x2, gy], [x2 + sw, gy], [x2, gy - h2 * su]], "bg cink") + SV.line(x2 + sw, gy, x2, gy - h2 * su, "s cd w1 dash")
            + SV.line(x2, gy, x2, gy - h2 * su, "s ca w3") + SV.line(x2, gy, x2 + sw, gy, "s cb w3") + SV.circle(x2, gy - h2 * su, Math.min(26, 8 + h2 * su * .12), "bg cok") ;
          h += T([x1 - 4, gy - P.h1 * u - 12], `h₁ = ${fmtN(P.h1)}`, "ca") + T([x1 + P.s1 * u / 2, gy + 16], `s₁ = ${fmtN(P.s1)}`, "cb")
            + T([x2 + 46, gy - h2 * su - 4], `h₂ = ${fmtN(r.h2)}`, "ca") + T([x2 + sw / 2, gy + 16], `s₂ = ${fmtN(P.s2)}`, "cb");
        } else {
          /* both triangles in one fixed scale: C at the left, side a along the bottom */
          /* the scale follows the shape and the largest k the slider allows, not k itself */
          const kmax = (st.lim.k || params.k).max, cg = Math.cos(rad(P.gama)), w1 = Math.max(P.a, P.b * cg) - Math.min(0, P.b * cg);
          const u = Math.min(250 / (kmax * P.b * Math.sin(rad(P.gama))), (W - 70) / ((1 + kmax) * w1));
          const tri = (x0, k, cls, dash) => {
            const C = [x0, 270], B = [x0 + P.a * k * u, 270], A = [x0 + P.b * k * u * Math.cos(rad(P.gama)), 270 - P.b * k * u * Math.sin(rad(P.gama))];
            const min = Math.min(C[0], A[0]);
            return {C, B, A, min, max:Math.max(B[0], A[0]), draw(dx){
              const m = p => [p[0] + dx, p[1]], c = m(C), b = m(B), a = m(A), mid = [(c[0] + b[0] + a[0]) / 3, (c[1] + b[1] + a[1]) / 3];
              return SV.poly([c, b, a], `bg ${cls}`) + SG.seg(c, b, "s ca w3") + SG.seg(c, a, "s cb w3") + SG.seg(a, b, `s${dash ? " cd" : ""}`) + SG.angle(c, b, a, 18, "s csoft w1")
                + SG.label(SG.mid(c, b), fmtN(P.a * k), "ca halo", mid, 14) + SG.label(SG.mid(c, a), fmtN(P.b * k), "cb halo", mid, 16) + SG.label(SG.mid(a, b), fmtN(r.c * k), "halo", mid, 16)
                + (P.obsah && !thumb && k * Math.sqrt(r.S) * u > 26 ? SV.text(mid[0], mid[1] + 5, `S = ${fmtN(r.S * k * k)}`, "mid sm thin") : "");
            }};
          };
          const t1 = tri(0, 1, "cink"), t2 = tri(0, P.k, "cd", true);
          const total = (t1.max - t1.min) + 40 + (t2.max - t2.min), x0 = Math.max(12, (W - total) / 2);
          h += t1.draw(x0 - t1.min) + t2.draw(x0 + (t1.max - t1.min) + 40 - t2.min);
        }
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const r = calc(P), tn = h.tn;
        h.sim = r;
        if(cfg.out) return cfg.out(P, h, st);
        if(typ === "tien") return h.calc(`\\dfrac{\\va{h_2}}{\\vb{s_2}} = \\dfrac{\\va{h_1}}{\\vb{s_1}}`) + h.calc(`\\va{h_2} = \\dfrac{\\va{${tn(P.h1)}} \\cdot \\vb{${tn(P.s2)}}}{\\vb{${tn(P.s1)}}} \\doteq \\va{${tn(r.h2)}}`)
          + h.p(`Slnko svieti na oba predmety pod rovnakým uhlom, trojuholníky sú preto podobné (veta uu). Koeficient: $k = \\dfrac{${tn(P.s2)}}{${tn(P.s1)}} \\doteq ${tn(r.k)}$.`);
        let o = h.calc(`\\va{a'} = \\vd{${tn(r.k)}} \\cdot \\va{${tn(r.a)}} = ${tn(r.sides[0])}, \\quad \\vb{b'} = \\vd{${tn(r.k)}} \\cdot \\vb{${tn(r.b)}} = ${tn(r.sides[1])}`)
          + h.calc(`c' = \\vd{${tn(r.k)}} \\cdot ${tn(r.c)} \\doteq ${tn(r.sides[2])}`)
          + h.p(`Uhly sa nemenia: $${tn(r.alfa, 1)}^\\circ$, $${tn(r.beta, 1)}^\\circ$, $${tn(r.gama)}^\\circ$.`);
        if(P.obsah) o += h.calc(`S' = \\vd{k}^2 \\cdot S = ${tn(r.k * r.k)} \\cdot ${tn(r.S)} \\doteq ${tn(r.S2)}`);
        o += r.k === 1 ? h.pill("k = 1: zhodné trojuholníky", "ok") : r.k > 1 ? h.pill("k > 1: zväčšenie", "up") : h.pill("k < 1: zmenšenie", "down");
        return o;
      }
    };
  }
});

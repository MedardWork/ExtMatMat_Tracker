/* ============================================================
   TOOL: pytagoras — the right triangle: Pythagoras' theorem with squares on the sides, Euclid's theorems
   with the altitude on the hypotenuse, and telling the kind of a triangle from its three sides. Plain SVG.
   cfg:
     typ      "veta"     legs a, b → c; switch stvorce (the three squares)
              "euklid"   hypotenuse c and its part ca (next to side a); switches obsahy (c² cut into a² and b²),
                         kruznica (the Thales half circle)
              "druh"     three sides a, b, c → acute / right / obtuse, or no triangle at all
     a, b, c, ca         a number or {v, min, max, step, lock};  free / lock / hide / on / toggles as in toolParams
     out(P, h, st)       h.py = {a, b, c, ca, cb, v, S, kind:"ostro"|"pravo"|"tupo"|null, sum, big}
   ============================================================ */
defTool("pytagoras", {
  name:"Pytagorova a Euklidove vety",
  area:"Planimetria",
  desc:"Pravouhlý trojuholník so štvorcami nad stranami, výška na preponu a Euklidove vety, a rozpoznanie druhu trojuholníka zo strán.",
  topics:["a29", "a30", "b16"],
  presets:[
    {name:"Pytagorova veta", cfg:{typ:"veta", on:{stvorce:true}}},
    {name:"Euklidove vety", cfg:{typ:"euklid", on:{obsahy:true}}},
    {name:"Výška a Tálesova kružnica", cfg:{typ:"euklid", on:{kruznica:true}}},
    {name:"Druh trojuholníka", cfg:{typ:"druh"}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["veta", "euklid", "druh"].includes(cfg.typ) ? cfg.typ : "veta";
    const sl = (v, color, name, note, max = 8) => ({v, min:1, max, step:.5, color, name, note});
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const defs = typ === "veta" ? {a:sl(3, "a", "a", "odvesna"), b:sl(4, "b", "b", "odvesna"), stvorce:ck(true, "Štvorce nad stranami")}
      : typ === "euklid" ? {c:sl(10, "d", "c", "prepona", 14), ca:{v:3.6, min:.4, max:13.6, step:.2, color:"a", name:"cₐ", note:"úsek pri strane a"},
          obsahy:ck(false, "Štvorec nad preponou rozdelený výškou"), kruznica:ck(false, "Tálesova kružnica", "c")}
      : {a:sl(3, "a", "a", null, 12), b:sl(4, "b", "b", null, 12), c:sl(5, "d", "c", null, 12)};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 330;
    const calc = P => {
      if(typ === "veta") return {a:P.a, b:P.b, c:Math.hypot(P.a, P.b), S:P.a * P.b / 2};
      if(typ === "euklid"){
        const c = P.c, ca = Math.max(.2, Math.min(c - .2, P.ca)), cb = c - ca;
        return {c, ca, cb, v:Math.sqrt(ca * cb), a:Math.sqrt(c * ca), b:Math.sqrt(c * cb), S:c * Math.sqrt(ca * cb) / 2};
      }
      const s = [P.a, P.b, P.c].sort((x, y) => x - y), big = s[2], sum = s[0] * s[0] + s[1] * s[1];
      const ok = s[0] + s[1] > big + 1e-9, d = sum - big * big;
      return {a:P.a, b:P.b, c:P.c, big, small:[s[0], s[1]], sum, ok, kind:!ok ? null : Math.abs(d) < 1e-9 ? "pravo" : d > 0 ? "ostro" : "tupo"};
    };

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb, T = (p, s, c) => thumb ? "" : SV.text(p[0], p[1] + 5, s, `mid halo ${c}`);
        let h = "";
        if(typ === "veta"){
          const {a, b} = r, f = svFit(W, H, P.stvorce ? [-b, -a, a + b, a + b] : [-.6, -.8, a + .6, b + .6], 16);
          const C = f.p([0, 0]), B = f.p([a, 0]), A = f.p([0, b]);
          if(P.stvorce){
            const sq = (pts, cls, name, val) => { const q = pts.map(f.p), m = SG.mid(q[0], q[2]); return SV.poly(q, `bg ${cls}`) + SV.poly(q, `s ${cls} w1`) + (f.u * Math.sqrt(val) > 34 ? T(m, `${name}² = ${fmtN(val)}`, cls) : ""); };
            h += sq([[0, 0], [a, 0], [a, -a], [0, -a]], "ca", "a", a * a) + sq([[0, 0], [0, b], [-b, b], [-b, 0]], "cb", "b", b * b) + sq([[a, 0], [0, b], [b, a + b], [a + b, a]], "cd", "c", r.c * r.c);
          }
          h += SV.poly([A, B, C], "s w3") + SG.right(C, A, B);
          if(!P.stvorce){ h += T([(C[0] + B[0]) / 2, C[1] + 14], `a = ${fmtN(a)}`, "ca") + T([C[0] - 30, (C[1] + A[1]) / 2], `b = ${fmtN(b)}`, "cb") + T([(A[0] + B[0]) / 2 + 30, (A[1] + B[1]) / 2 - 8], `c = ${fmtN(r.c)}`, "cd"); }
        } else if(typ === "euklid"){
          const {c, cb, v} = r, f = svFit(W, H, P.obsahy ? [0, -c, c, Math.max(v, 1)] : [-.4, -1, c + .4, P.kruznica ? c / 2 + .3 : v + .6], 20);
          const A = f.p([0, 0]), B = f.p([c, 0]), F = f.p([cb, 0]), C = f.p([cb, v]);
          if(P.obsahy){
            const A2 = f.p([0, -c]), B2 = f.p([c, -c]), F2 = f.p([cb, -c]);
            h += SV.poly([A, F, F2, A2], "bg cb") + SV.poly([A, F, F2, A2], "s cb w1") + SV.poly([F, B, B2, F2], "bg ca") + SV.poly([F, B, B2, F2], "s ca w1");
            if(f.u * cb > 70) h += T(SG.mid(A, F2), `c·c_b = b² = ${fmtN(c * cb)}`, "cb");
            if(f.u * r.ca > 70) h += T(SG.mid(F, B2), `c·c_a = a² = ${fmtN(c * r.ca)}`, "ca");
          }
          if(P.kruznica) h += SV.path(SV.arc(f.X(c / 2), f.Y(0), c / 2 * f.u, 0, 180), "s cc w1 dash") + SG.dot(f.p([c / 2, 0]), "f cc", 3);
          h += SG.seg(C, F, "s cok") + SG.right(F, C, B) + SV.poly([A, B, C], "s w3") + SG.right(C, A, B);
          h += SG.seg(A, F, "s cb w3") + SG.seg(F, B, "s ca w3");
          if(!thumb){
            h += SG.label(A, "A", "", C) + SG.label(B, "B", "", C) + SG.label(C, "C", "", SG.mid(A, B));
            h += T([(A[0] + C[0]) / 2 - 14, (A[1] + C[1]) / 2 - 8], "b", "it cb") + T([(B[0] + C[0]) / 2 + 14, (B[1] + C[1]) / 2 - 8], "a", "it ca") + T([C[0] + 12, (C[1] + F[1]) / 2], "v", "it cok");
            if(!P.obsahy) h += T([(A[0] + F[0]) / 2, A[1] + 15], `c_b = ${fmtN(cb)}`, "cb") + T([(F[0] + B[0]) / 2, A[1] + 15], `c_a = ${fmtN(r.ca)}`, "ca");
          }
        } else {
          if(!r.ok){
            h += SV.text(W / 2, H / 2 - 6, "Z týchto strán sa trojuholník nedá zostrojiť.", "mid cno") + SV.text(W / 2, H / 2 + 16, `${fmtN(r.small[0])} + ${fmtN(r.small[1])} ≤ ${fmtN(r.big)}`, "mid lg cno");
          } else {
            /* the longest side lies at the bottom, the angle to judge is at the top */
            const s = [["a", P.a, "ca"], ["b", P.b, "cb"], ["c", P.c, "cd"]].sort((x, y) => y[1] - x[1]);
            const base = s[0][1], p = s[1][1], q = s[2][1], x = (base * base + q * q - p * p) / (2 * base), y = Math.sqrt(Math.max(0, q * q - x * x));
            const f = svFit(W, H, [0, 0, base, Math.max(y, 1)], 38), A = f.p([0, 0]), B = f.p([base, 0]), C = f.p([x, y]);
            h += SV.poly([A, B, C], "bg cink") + SG.seg(A, B, `s w3 ${s[0][2]}`) + SG.seg(B, C, `s w3 ${s[1][2]}`) + SG.seg(A, C, `s w3 ${s[2][2]}`);
            h += r.kind === "pravo" ? SG.right(C, A, B, "s w1") : SG.angle(C, A, B, 20, `s w1 ${r.kind === "tupo" ? "cno" : "cok"}`);
            h += T([(A[0] + B[0]) / 2, A[1] + 16], `${s[0][0]} = ${fmtN(base)}`, s[0][2]) + T([(B[0] + C[0]) / 2 + 26, (B[1] + C[1]) / 2 - 6], `${s[1][0]} = ${fmtN(p)}`, s[1][2]) + T([(A[0] + C[0]) / 2 - 26, (A[1] + C[1]) / 2 - 6], `${s[2][0]} = ${fmtN(q)}`, s[2][2]);
          }
        }
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const r = calc(P), tn = h.tn;
        h.py = r;
        if(cfg.out) return cfg.out(P, h, st);
        const eq = x => Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? "=" : "\\doteq";
        if(typ === "veta") return h.big(`\\va{a}^2 + \\vb{b}^2 = \\vd{c}^2`) + h.calc(`\\va{${tn(r.a)}}^2 + \\vb{${tn(r.b)}}^2 = ${tn(r.a * r.a)} + ${tn(r.b * r.b)} = ${tn(r.c * r.c)}`)
          + h.calc(`\\vd{c} = \\sqrt{${tn(r.c * r.c)}} ${eq(r.c)} \\vd{${tn(r.c)}}`) + h.p(`Obsah: $S = \\dfrac{a \\cdot b}{2} = ${tn(r.S)}$`);
        if(typ === "euklid") return h.calc(`v^2 = \\va{c_a} \\cdot \\vb{c_b} = ${tn(r.ca)} \\cdot ${tn(r.cb)} = ${tn(r.ca * r.cb)} \\Rightarrow v ${eq(r.v)} ${tn(r.v)}`)
          + h.calc(`\\va{a}^2 = \\vd{c} \\cdot \\va{c_a} = ${tn(r.c * r.ca)} \\Rightarrow \\va{a} ${eq(r.a)} \\va{${tn(r.a)}}`)
          + h.calc(`\\vb{b}^2 = \\vd{c} \\cdot \\vb{c_b} = ${tn(r.c * r.cb)} \\Rightarrow \\vb{b} ${eq(r.b)} \\vb{${tn(r.b)}}`)
          + h.p(`Spolu: $a^2 + b^2 = c \\cdot (c_a + c_b) = c^2 = ${tn(r.c * r.c)}$, čo je Pytagorova veta.`);
        if(!r.ok) return h.calc(`${tn(r.small[0])} + ${tn(r.small[1])} \\le ${tn(r.big)}`) + h.pill("trojuholníková nerovnosť neplatí", "down");
        const rel = r.kind === "pravo" ? "=" : r.kind === "ostro" ? ">" : "<";
        return h.calc(`${tn(r.small[0])}^2 + ${tn(r.small[1])}^2 = ${tn(r.sum)} ${rel} ${tn(r.big * r.big)} = ${tn(r.big)}^2`)
          + h.pill(r.kind === "pravo" ? "pravouhlý: súčet štvorcov sa rovná" : r.kind === "ostro" ? "ostrouhlý: súčet štvorcov je väčší" : "tupouhlý: súčet štvorcov je menší", r.kind === "pravo" ? "ok" : r.kind === "ostro" ? "up" : "down")
          + h.p("Porovnáva sa vždy štvorec **najdlhšej** strany so súčtom štvorcov dvoch kratších.");
      }
    };
  }
});

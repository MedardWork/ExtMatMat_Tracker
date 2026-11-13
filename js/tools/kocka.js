/* ============================================================
   TOOL: kocka — a cube or a cuboid ABCDEFGH in oblique projection with points on its edges: the section
   by the plane through three points, the distance of two points, the angle at a point. Plain SVG.
   cfg:
     typ      "rez"          the plane through X, Y, Z cuts the solid: the section polygon, its sides and area
              "vzdialenost"  |XY| from the coordinates (the right-angled steps are drawn)
              "uhol"         the angle YXZ between the lines XY and XZ
     body     [["AE", .5], ["BF", .25], ["CG", 1]]     where X, Y, Z start: an edge and the place on it
                             (0 = its first end, 1 = its second end, so ["AE", 0] is the corner A)
     a, b, c  the edges AB, AD, AE (4, 4, 4);  kvader:true lists them as sliders
     t1, t2, t3              the places of X, Y, Z on their edges, {v, lock}
     klikaj   false          forbid moving a point to another edge by clicking the edge
     free, lock, hide        as in toolParams
     out(P, h, st)     h.cube = {X, Y, Z (coordinates), poly:[[x, y, z]…], n (corners of the section), area, perimeter, d, uhol}
   ============================================================ */
const CUBE_EDGES = ["AB", "BC", "CD", "DA", "EF", "FG", "GH", "HE", "AE", "BF", "CG", "DH"];

defTool("kocka", {
  name:"Kocka a kváder v priestore",
  area:"Stereometria",
  desc:"Rez kocky rovinou cez tri body, vzdialenosť dvoch bodov a uhol priamok vo voľnom rovnobežnom premietaní.",
  topics:["b29", "b30", "b31", "b32", "b33", "b34"],
  presets:[
    {name:"Rez kocky", cfg:{typ:"rez"}},
    {name:"Šesťuholníkový rez", cfg:{typ:"rez", body:[["AB", .5], ["BC", .5], ["GH", .5]]}},
    {name:"Trojuholníkový rez", cfg:{typ:"rez", body:[["AB", 1], ["DA", 0], ["AE", 1]]}},
    {name:"Rez kvádra", cfg:{typ:"rez", kvader:true, a:6, b:4, c:3, body:[["AE", .5], ["BF", 1], ["CD", .5]]}},
    {name:"Telesová uhlopriečka", cfg:{typ:"vzdialenost", body:[["AE", 0], ["CG", 1]]}},
    {name:"Uhol uhlopriečok", cfg:{typ:"uhol", body:[["AE", 0], ["CG", 1], ["BC", 1]]}}
  ],
  help:"Body **X**, **Y**, **Z** ťahaj po hranách. Kliknutím na inú hranu na ňu presunieš ďalší bod v poradí.",

  make(cfg, env){
    const typ = ["rez", "vzdialenost", "uhol"].includes(cfg.typ) ? cfg.typ : "rez";
    const np = typ === "vzdialenost" ? 2 : 3;
    const init = (cfg.body || [["AE", .5], ["BF", .25], ["CG", 1]]).slice(0, np);
    while(init.length < np) init.push([["AE", "BF", "CG"][init.length], .5]);
    const dim = (v, color) => ({v, min:1, max:8, step:.5, color:null, plain:true, lock:!cfg.kvader && !env.full, hide:!cfg.kvader && !env.full});
    const defs = {a:dim(4), b:dim(4), c:dim(4)};
    ["X", "Y", "Z"].slice(0, np).forEach((n, i) => { defs["t" + (i + 1)] = {v:init[i][1], min:0, max:1, step:.05, color:"abd"[i], name:n, note:"poloha na hrane"}; });
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 340, K = .5 * Math.SQRT1_2;
    const corners = P => ({A:[0, 0, 0], B:[P.a, 0, 0], C:[P.a, P.b, 0], D:[0, P.b, 0], E:[0, 0, P.c], F:[P.a, 0, P.c], G:[P.a, P.b, P.c], H:[0, P.b, P.c]});
    const fit = P => svFit(W, H, [0, 0, P.a + P.b * K, P.c + P.b * K], 34);
    const proj = (f, p) => f.p([p[0] + p[1] * K, p[2] + p[1] * K]);
    const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
    const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]], len = p => Math.hypot(p[0], p[1], p[2]);
    const edges = st => (st.data && st.data.e) || init.map(x => x[0]);
    const pts = (P, st) => { const V = corners(P); return edges(st).map((e, i) => { const p = V[e[0]], q = V[e[1]], t = P["t" + (i + 1)]; return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]; }); };

    const calc = (P, st) => {
      const V = corners(P), X = pts(P, st), r = {X:X[0], Y:X[1], Z:X[2]};
      if(typ === "vzdialenost"){ r.v = sub(X[1], X[0]); r.d = len(r.v); return r; }
      const u = sub(X[1], X[0]), v = sub(X[2], X[0]);
      if(typ === "uhol"){ r.uhol = len(u) && len(v) ? Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (len(u) * len(v))))) * 180 / Math.PI : NaN; r.u = u; r.v = v; return r; }
      const n = cross(u, v);
      r.poly = [];
      if(len(n) < 1e-9) return r;
      const add = p => { if(!r.poly.some(q => len(sub(p, q)) < 1e-6)) r.poly.push(p); };
      CUBE_EDGES.forEach(e => {
        const p = V[e[0]], q = V[e[1]], dp = dot(n, sub(p, X[0])), dq = dot(n, sub(q, X[0]));
        if(Math.abs(dp) < 1e-9) add(p);
        if(Math.abs(dq) < 1e-9) add(q);
        if(dp * dq < -1e-12){ const s = dp / (dp - dq); add([p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s, p[2] + (q[2] - p[2]) * s]); }
      });
      /* put the corners in order round the centre of the section */
      const c = r.poly.reduce((m, p) => [m[0] + p[0] / r.poly.length, m[1] + p[1] / r.poly.length, m[2] + p[2] / r.poly.length], [0, 0, 0]);
      const e1 = sub(r.poly[0] || c, c), e2 = cross(n, e1);
      r.poly.sort((p, q) => Math.atan2(dot(sub(p, c), e2) / (len(e2) || 1), dot(sub(p, c), e1) / (len(e1) || 1)) - Math.atan2(dot(sub(q, c), e2) / (len(e2) || 1), dot(sub(q, c), e1) / (len(e1) || 1)));
      r.n = r.poly.length;
      r.sides = r.poly.map((p, i) => len(sub(r.poly[(i + 1) % r.n], p)));
      r.perimeter = r.sides.reduce((s, x) => s + x, 0);
      let area = [0, 0, 0];
      for(let i = 1; i + 1 < r.n; i++){ const w = cross(sub(r.poly[i], r.poly[0]), sub(r.poly[i + 1], r.poly[0])); area = [area[0] + w[0], area[1] + w[1], area[2] + w[2]]; }
      r.area = len(area) / 2;
      return r;
    };
    const free = (i, st) => !(params["t" + (i + 1)].lock && !st.open);

    return {
      params, aspect:`${W}/${H}`,
      hint:"Body **ťahaj** po hranách" + (cfg.klikaj === false ? "." : ", kliknutím na inú hranu tam presunieš ďalší bod."),
      init(st){ st.data = {e:init.map(x => x[0]), next:0}; },
      svg(P, st){
        const f = fit(P), V = corners(P), r = calc(P, st), thumb = st.env.thumb, X = pts(P, st), col = ["ca", "cb", "cd"];
        const pp = n => proj(f, V[n]);
        let h = "";
        if(typ === "rez" && r.poly.length > 2) h += SV.poly(r.poly.map(p => proj(f, p)), "bg cd vn-on");
        CUBE_EDGES.forEach(e => { h += SG.seg(pp(e[0]), pp(e[1]), e.includes("D") ? "s csoft w1 dash" : "s"); });
        if(typ === "rez" && r.poly.length > 2) h += SV.poly(r.poly.map(p => proj(f, p)), "s cd w3");
        if(typ === "vzdialenost"){
          const foot = [X[1][0], X[1][1], X[0][2]], mid = [X[1][0], X[0][1], X[0][2]];
          h += SG.seg(proj(f, X[0]), proj(f, mid), "s cb w1 dash") + SG.seg(proj(f, mid), proj(f, foot), "s cb w1 dash") + SG.seg(proj(f, foot), proj(f, X[1]), "s cb w1 dash") + SG.seg(proj(f, X[0]), proj(f, foot), "s cok w1")
            + SG.seg(proj(f, X[0]), proj(f, X[1]), "s cd w3");
        }
        if(typ === "uhol") h += SG.seg(proj(f, X[0]), proj(f, X[1]), "s cb w3") + SG.seg(proj(f, X[0]), proj(f, X[2]), "s cd w3") + SG.angle(proj(f, X[0]), proj(f, X[1]), proj(f, X[2]), 22, "s ca w1");
        if(!thumb){
          const c = proj(f, [P.a / 2, P.b / 2, P.c / 2]);
          "ABCDEFGH".split("").forEach(n => { h += SG.label(pp(n), n, "csoft halo", c, 13); });
          CUBE_EDGES.forEach(e => { const p = pp(e[0]), q = pp(e[1]); h += `<line class="hit" x1="${SV.n(p[0])}" y1="${SV.n(p[1])}" x2="${SV.n(q[0])}" y2="${SV.n(q[1])}" stroke-width="16" data-pick="${e}"/>`; });
        }
        X.forEach((p, i) => {
          const q = proj(f, p);
          h += SG.dot(q, `h ${col[i]}`, 6.5) + (thumb ? "" : SV.text(q[0] + 9, q[1] - 9, "XYZ"[i], `${col[i]} halo`) + (free(i, st) ? SV.circle(q[0], q[1], 14, "hit", ` data-drag="${i}"`) : ""));
        });
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        const near = (x, y, e, P) => {
          const f = fit(P), V = corners(P), p = proj(f, V[e[0]]), q = proj(f, V[e[1]]), d = [q[0] - p[0], q[1] - p[1]], l2 = d[0] * d[0] + d[1] * d[1] || 1;
          return Math.max(0, Math.min(1, ((x - p[0]) * d[0] + (y - p[1]) * d[1]) / l2));
        };
        svgDrag(el, st, (id, x, y) => {
          const i = Number(id), v = Math.round(near(x, y, st.data.e[i], st.P) * 20) / 20;
          st.moved = true;
          if(v === st.P["t" + (i + 1)]) return false;
          st.P["t" + (i + 1)] = v;
        });
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit || cfg.klikaj === false || st.moved){ st.moved = false; return; }
          const p = svgPoint(el, e), i = st.data.next % np;
          if(!p || !free(i, st)) return;
          st.data.e[i] = hit.dataset.pick;
          st.P["t" + (i + 1)] = Math.round(near(p[0], p[1], hit.dataset.pick, st.P) * 4) / 4;
          st.data.next = (i + 1) % np;
          toolCtlSync(st); toolUpdate(st);
        });
      },
      out(P, h, st){
        const r = calc(P, st), tn = h.tn, c = p => `[${p.map(v => tn(v)).join(";\\ ")}]`;
        h.cube = r;
        if(cfg.out) return cfg.out(P, h, st);
        const where = edges(st).map((e, i) => `$\\v${"abd"[i]}{${"XYZ"[i]}} \\in ${e}$`).join(", ");
        if(typ === "vzdialenost") return h.p(where) + h.calc(`\\va{X}${c(r.X)}, \\quad \\vb{Y}${c(r.Y)}`)
          + h.calc(`|XY| = \\sqrt{${r.v.map(v => (v < 0 ? `(${tn(v)})` : tn(v)) + "^2").join(" + ")}} = \\sqrt{${tn(dot(r.v, r.v))}} \\doteq \\vd{${tn(r.d)}}`)
          + h.p("Dvakrát Pytagorova veta: najprv v podstave, potom v zvislom trojuholníku.");
        if(typ === "uhol") return h.p(where) + h.calc(`\\cos \\va{\\varphi} = \\dfrac{\\overrightarrow{XY} \\cdot \\overrightarrow{XZ}}{|XY| \\cdot |XZ|} = \\dfrac{${tn(dot(r.u, r.v))}}{${tn(len(r.u))} \\cdot ${tn(len(r.v))}}`) + h.calc(`\\va{\\varphi} \\doteq \\va{${tn(r.uhol, 1)}^\\circ}`);
        if(!r.n) return h.p(where) + h.pill("tri body na jednej priamke rovinu neurčujú", "flat");
        const name = {3:"trojuholník", 4:"štvoruholník", 5:"päťuholník", 6:"šesťuholník"}[r.n] || "bod alebo úsečka";
        return h.p(where) + h.pill(`rez je ${name}`, "ok") + (r.n > 2 ? h.p(`Strany: ${r.sides.map(s => `$${tn(s)}$`).join(", ")}`) + h.calc(`o \\doteq ${tn(r.perimeter)}, \\quad S \\doteq \\vd{${tn(r.area)}}`) : "")
          + h.p("Rovina pretína dve rovnobežné steny v **rovnobežných** úsečkách.");
      }
    };
  }
});

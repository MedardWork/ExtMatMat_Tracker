/* ============================================================
   TOOL: premietanie — a solid in oblique (free parallel) projection next to its three views:
   front (nárys), top (pôdorys) and side from the right (bokorys). Plain SVG.
   cfg:
     typ      "kocky"    a building of unit cubes; click a cell of the top view to add a cube
              "teleso"   one solid: teleso:"kvader" (a, b, c) | "ihlan" (a, v) | "valec" (r, v) | "kuzel" (r, v),
                         with the sliders uhol (ω, the angle of the edges running back) and q (their shortening)
     vysky    [[3, 1, 0], [2, 1, 0], [1, 1, 1]]     (kocky) heights seen from above, the back row first
     max      4          (kocky) the tallest tower allowed
     klikaj   false      (kocky) the building cannot be changed
     ciel     {narys:[3, 1, 1], bokorys:[1, 2, 3], podorys:[[1, 1, 0], …]}   (kocky) views to be matched, drawn dashed;
                         narys from the left, bokorys from the front, podorys like vysky with 1 = occupied
     on       {obraz, narys, podorys, bokorys, cisla}    what is shown from the start;  toggles:[…] what the reader may switch
     a, b, c, v, r, uhol, q    a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)     h.pr = {n (cubes), S (surface in unit squares), narys:[…], bokorys:[…], vysky:[[…]] (front row first), ok (ciel matched)}
                       for a solid: h.pr = {a, b, c, kresli (drawn length of the edge running back)}
   ============================================================ */
defTool("premietanie", {
  name:"Premietanie a pohľady na teleso",
  area:"Stereometria",
  desc:"Stavba z kociek alebo teleso vo voľnom rovnobežnom premietaní a jeho nárys, pôdorys a bokorys.",
  topics:["b29"],
  presets:[
    {name:"Stavba z kociek", cfg:{typ:"kocky"}, tip:"Klikaj na políčka pôdorysu: pridávaš kocky na seba. Sleduj, ako sa mení nárys a bokorys."},
    {name:"Prázdna podložka", cfg:{typ:"kocky", vysky:[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]}, tip:"Postav vlastnú stavbu. Číslo v pôdoryse hovorí, koľko kociek stojí na políčku."},
    {name:"Postav podľa pohľadov", cfg:{typ:"kocky", vysky:[[0, 0, 0], [0, 0, 0], [0, 0, 0]], on:{obraz:false}, ciel:{narys:[2, 3, 1], bokorys:[1, 3, 2]}}, tip:"Stavba je skrytá, vidíš len jej tri pohľady. Postav takú, ktorá im vyhovuje."},
    {name:"Kváder: uhol a skrátenie", cfg:{typ:"teleso", teleso:"kvader"}, tip:"Hrany idúce dozadu sa kreslia pod uhlom $\\omega$ a skrátené koeficientom $q$. Bežne $\\omega = 45^\\circ$, $q = \\frac{1}{2}$."},
    {name:"Ihlan", cfg:{typ:"teleso", teleso:"ihlan"}, tip:"V náryse a bokoryse je ihlan trojuholník, v pôdoryse štvorec s uhlopriečkami."},
    {name:"Valec", cfg:{typ:"teleso", teleso:"valec"}, tip:"Podstava valca sa vo voľnom rovnobežnom premietaní kreslí ako elipsa."},
    {name:"Kužeľ", cfg:{typ:"teleso", teleso:"kuzel"}, tip:"Nárys kužeľa je rovnoramenný trojuholník, pôdorys kruh so stredom."}
  ],
  help:"V stavbe z kociek **klikaj na políčka pôdorysu**: každý klik pridá kocku, po najvyššej veži sa políčko vyprázdni.",

  make(cfg, env){
    const typ = cfg.typ === "teleso" ? "teleso" : "kocky";
    const tel = ["kvader", "ihlan", "valec", "kuzel"].includes(cfg.teleso) ? cfg.teleso : "kvader";
    const round = typ === "teleso" && (tel === "valec" || tel === "kuzel");
    const ck = (name, color, v = true) => ({type:"check", v, name, color});
    const sl = (v, color, note, min = 1, max = 6) => ({v, min, max, step:.5, color, note});
    const defs = Object.assign({},
      typ === "kocky" ? null : round ? {r:sl(2, "a", "polomer", 1, 3), v:sl(4, "d", "výška")}
        : tel === "ihlan" ? {a:sl(4, "a", "hrana podstavy"), v:sl(4, "d", "výška")} : {a:sl(4, "a"), b:sl(4, "b", "hrana dozadu"), c:sl(4, "d")},
      typ === "teleso" ? {uhol:{v:45, min:0, max:90, step:5, name:"ω", note:"uhol hrán idúcich dozadu", plain:true}, q:{v:.5, min:.25, max:1, step:.25, note:"skrátenie dozadu", plain:true}} : null,
      {obraz:ck("Obraz telesa"), narys:ck("Nárys (spredu)", "b"), podorys:ck("Pôdorys (zhora)", "a"), bokorys:ck("Bokorys (sprava)", "d")},
      typ === "kocky" ? {cisla:ck("Počty kociek v pôdoryse")} : null);
    const params = toolParams(defs, cfg, env);
    const rows = cfg.vysky || [[3, 1, 0], [2, 1, 0], [1, 1, 1]];
    const ny = rows.length, nx = Math.max(...rows.map(r => r.length)), hmax = cfg.max || 4;
    const canEdit = st => typ === "kocky" && !st.env.thumb && (st.open || cfg.klikaj !== false);
    const W = 560, H = 340;
    const dims = P => typ === "kocky" ? {a:nx, b:ny, c:hmax} : round ? {a:2 * P.r, b:2 * P.r, c:P.v} : tel === "ihlan" ? {a:P.a, b:P.a, c:P.v} : {a:P.a, b:P.b, c:P.c};

    /* the building: its views and what it is made of */
    const calc = st => {
      const g = st.data.h, r = {vysky:g, n:0, S:0};
      r.narys = Array.from({length:nx}, (_, x) => Math.max(...g.map(row => row[x])));
      r.bokorys = g.map(row => Math.max(...row));
      const has = (x, y, z) => x >= 0 && x < nx && y >= 0 && y < ny && z >= 0 && z < g[y][x];
      for(let y = 0; y < ny; y++) for(let x = 0; x < nx; x++) for(let z = 0; z < g[y][x]; z++){
        r.n++;
        [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach(d => { if(!has(x + d[0], y + d[1], z + d[2])) r.S++; });
      }
      const c = cfg.ciel;
      if(c) r.ok = (!c.narys || c.narys.every((v, x) => v === r.narys[x])) && (!c.bokorys || c.bokorys.every((v, y) => v === r.bokorys[y]))
        && (!c.podorys || c.podorys.every((row, i) => row.every((v, x) => !!v === g[ny - 1 - i][x] > 0)));
      return r;
    };
    /* the solid as corners and faces, or null for the round ones */
    const solid = P => {
      const d = dims(P), a = d.a, b = d.b, c = d.c;
      if(round) return null;
      if(tel === "ihlan") return {v:[[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [a / 2, b / 2, c]], names:"ABCDV", f:[[0, 3, 2, 1], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]]};
      return {v:[[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]], names:"ABCDEFGH",
        f:[[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [3, 0, 4, 7]]};
    };
    const ring = (r, z, t0, t1, n = 48) => Array.from({length:n + 1}, (_, i) => { const t = t0 + (t1 - t0) * i / n; return [r + r * Math.cos(t), r + r * Math.sin(t), z]; });

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "kocky" && cfg.klikaj !== false ? "**Klikaj** na políčka pôdorysu: pridáš kocku." : null,
      init(st){ st.data = typ === "kocky" ? {h:Array.from({length:ny}, (_, y) => Array.from({length:nx}, (_, x) => Math.min(hmax, rows[ny - 1 - y][x] || 0)))} : null; },
      actions:typ === "kocky" ? [{label:"Vyprázdniť podložku", run(st){ st.data.h.forEach(row => row.fill(0)); }}] : null,
      actionsAlways:typ === "kocky" && cfg.klikaj !== false,

      svg(P, st){
        const thumb = st.env.thumb, D = dims(P), vs = ["narys", "podorys", "bokorys"].filter(k => P[k]);
        const om = (typ === "teleso" ? P.uhol : 45) * Math.PI / 180, q = typ === "teleso" ? P.q : .5, kx = q * Math.cos(om), ky = q * Math.sin(om);
        const PW = !P.obraz ? 0 : vs.length ? Math.round(W * .5) : W;
        let h = "";
        if(P.obraz){
          const f = svFit(PW, H, [0, 0, D.a + D.b * kx, D.c + D.b * ky], thumb ? 12 : 30);
          const pr = p => f.p([p[0] + p[1] * kx, p[2] + p[1] * ky]);
          if(typ === "kocky"){
            const g = st.data.h, has = (x, y, z) => x >= 0 && x < nx && y >= 0 && y < ny && z < g[y][x];
            for(let x = 0; x <= nx; x++) h += SG.seg(pr([x, 0, 0]), pr([x, ny, 0]), "s cgrid w1");
            for(let y = 0; y <= ny; y++) h += SG.seg(pr([0, y, 0]), pr([nx, y, 0]), "s cgrid w1");
            for(let y = ny - 1; y >= 0; y--) for(let x = 0; x < nx; x++) for(let z = 0; z < g[y][x]; z++){
              const c = (dx, dy, dz) => pr([x + dx, y + dy, z + dz]);
              if(!has(x, y - 1, z)) h += SV.poly([c(0, 0, 0), c(1, 0, 0), c(1, 0, 1), c(0, 0, 1)], "pr-c pr-f");
              if(!has(x, y, z + 1)) h += SV.poly([c(0, 0, 1), c(1, 0, 1), c(1, 1, 1), c(0, 1, 1)], "pr-c pr-t");
              if(!has(x + 1, y, z)) h += SV.poly([c(1, 0, 0), c(1, 1, 0), c(1, 1, 1), c(1, 0, 1)], "pr-c pr-r");
            }
          } else if(round){
            const r = P.r, v = P.v, t0 = Math.atan(kx), A = Math.hypot(1, kx), line = (pts, c) => SV.path(SV.d(pts.map(pr)), c);
            if(tel === "valec"){
              h += line(ring(r, 0, t0, t0 + Math.PI), "s csoft w1 dash") + line(ring(r, 0, t0 + Math.PI, t0 + 2 * Math.PI), "s") + line(ring(r, v, 0, 2 * Math.PI), "s");
              [t0, t0 + Math.PI].forEach(t => { h += SG.seg(pr([r + r * Math.cos(t), r + r * Math.sin(t), 0]), pr([r + r * Math.cos(t), r + r * Math.sin(t), v]), "s"); });
              h += SG.seg(pr([r, r, 0]), pr([r, r, v]), "s cd w1 dash") + SG.seg(pr([r, r, v]), pr([2 * r, r, v]), "s ca");
            } else {
              const s = q * r * Math.sin(om) / (v * A);
              if(s >= 1) h += line(ring(r, 0, 0, 2 * Math.PI), "s");
              else {
                const t1 = t0 + Math.asin(s), t2 = t0 + Math.PI - Math.asin(s);
                h += line(ring(r, 0, t1, t2), "s csoft w1 dash") + line(ring(r, 0, t2, t1 + 2 * Math.PI), "s");
                [t1, t2].forEach(t => { h += SG.seg(pr([r + r * Math.cos(t), r + r * Math.sin(t), 0]), pr([r, r, v]), "s"); });
              }
              h += SG.seg(pr([r, r, 0]), pr([r, r, v]), "s cd w1 dash") + SG.seg(pr([r, r, 0]), pr([2 * r, r, 0]), "s ca w1 dash");
            }
          } else {
            const sol = solid(P), E = solidEdges(sol, [-kx, 1, -ky]), pp = sol.v.map(pr);
            const tint = e => tel === "kvader" ? ({"0,1":"ca", "0,3":"cb", "0,4":"cd"})[e.a + "," + e.b] || "" : e.a === 0 && e.b === 1 ? "ca" : "";
            E.filter(e => !e.on).forEach(e => { h += SG.seg(pp[e.a], pp[e.b], `s w1 dash ${tint(e) || "csoft"}`); });
            E.filter(e => e.on).forEach(e => { h += SG.seg(pp[e.a], pp[e.b], `s ${tint(e)}`); });
            if(tel === "ihlan") h += SG.seg(pr([D.a / 2, D.b / 2, 0]), pp[4], "s cd w1 dash") + SG.seg(pp[0], pp[2], "s cgrid w1") + SG.seg(pp[1], pp[3], "s cgrid w1");
            if(!thumb){ const c = pr([D.a / 2, D.b / 2, D.c / 2]); pp.forEach((p, i) => { h += SG.label(p, sol.names[i], "csoft halo", c, 13); }); }
          }
        }
        if(!vs.length) return SV.wrap(W, H, h);

        /* the three views in the usual arrangement: front above top, side to the right of front */
        const up = P.narys || P.bokorys, VW = W - PW, gap = thumb ? 12 : 30, ttl = thumb ? 0 : 16;
        const cols = (P.narys || P.podorys ? D.a : 0) + (P.bokorys ? D.b : 0), rws = (up ? D.c : 0) + (P.podorys ? D.b : 0);
        const gx = (P.narys || P.podorys) && P.bokorys ? gap : 0, gy = up && P.podorys ? gap : 0;
        const u = Math.min((VW - 30 - gx) / cols, (H - 24 - gy - ttl * (up && P.podorys ? 2 : 1)) / rws, typ === "kocky" ? 44 : 40);
        const ox = PW + (VW - cols * u - gx) / 2, oy = (H - rws * u - gy - ttl * (up && P.podorys ? 2 : 1)) / 2 + ttl;
        const bx = ox + (P.narys || P.podorys ? D.a * u + gx : 0), py = oy + (up ? D.c * u + gy + ttl : 0);
        const VIEW = {
          narys:{name:"nárys", c:"cb", x0:ox, w:D.a, hh:D.c, at:p => [ox + p[0] * u, oy + (D.c - p[2]) * u], d:[0, 1, 0]},
          bokorys:{name:"bokorys", c:"cd", x0:bx, w:D.b, hh:D.c, at:p => [bx + p[1] * u, oy + (D.c - p[2]) * u], d:[-1, 0, 0]},
          podorys:{name:"pôdorys", c:"ca", x0:ox, w:D.a, hh:D.b, at:p => [ox + p[0] * u, py + (D.b - p[1]) * u], d:[0, 0, -1]}
        };
        const r = typ === "kocky" ? calc(st) : null, goal = cfg.ciel || {};
        vs.forEach(k => {
          const v = VIEW[k], top = k === "podorys" ? py : oy;
          if(!thumb) h += SV.text(v.x0, top - 6, v.name, `sm ${v.c}`);
          if(typ === "kocky"){
            const cell = (i, j, c, at = "") => SV.rect(v.x0 + i * u, top + (v.hh - 1 - j) * u, u, u, c, at);
            if(k === "podorys"){
              for(let y = 0; y < ny; y++) for(let x = 0; x < nx; x++){
                const n = r.vysky[y][x];
                h += cell(x, y, n ? "pr-v ca" : "pr-e", canEdit(st) ? ` data-pick="${x},${y}"` : "");
                if(n && P.cisla && !thumb) h += SV.text(v.x0 + (x + .5) * u, top + (ny - 1 - y + .5) * u + 5, n, "mid ca");
              }
              if(goal.podorys) goal.podorys.forEach((row, i) => row.forEach((on, x) => { if(on) h += cell(x, ny - 1 - i, "s cok w1 dash"); }));
            } else {
              const hs = r[k];
              h += SV.line(v.x0 - 4, top + v.hh * u, v.x0 + v.w * u + 4, top + v.hh * u, "s csoft w1");
              hs.forEach((n, i) => { for(let z = 0; z < n; z++) h += cell(i, z, `pr-v ${v.c}`); });
              if(goal[k]) goal[k].forEach((n, i) => { for(let z = 0; z < n; z++) h += cell(i, z, "s cok w1 dash"); });
            }
          } else if(round){
            const R = P.r, a = v.at, c = `s ${v.c}`;
            if(k === "podorys") h += SV.circle(a([R, R, 0])[0], a([R, R, 0])[1], R * u, `bg ${v.c}`) + SV.circle(a([R, R, 0])[0], a([R, R, 0])[1], R * u, c) + (tel === "kuzel" ? SV.circle(a([R, R, 0])[0], a([R, R, 0])[1], 2.5, `f ${v.c}`) : "");
            else {
              const lo = k === "narys" ? [[0, R, 0], [2 * R, R, 0]] : [[R, 0, 0], [R, 2 * R, 0]];
              const pts = tel === "valec" ? [lo[0], lo[1], [lo[1][0], lo[1][1], P.v], [lo[0][0], lo[0][1], P.v]] : [lo[0], lo[1], [R, R, P.v]];
              h += SV.poly(pts.map(a), `bg ${v.c}`) + SV.poly(pts.map(a), c);
            }
          } else {
            const sol = solid(P), E = solidEdges(sol, v.d), pp = sol.v.map(v.at);
            const hull = k === "podorys" ? [0, 1, 2, 3] : tel === "ihlan" ? (k === "narys" ? [0, 1, 4] : [1, 2, 4]) : k === "narys" ? [0, 1, 5, 4] : [1, 2, 6, 5];
            h += SV.poly(hull.map(i => pp[i]), `bg ${v.c}`);
            E.filter(e => !e.on).forEach(e => { h += SG.seg(pp[e.a], pp[e.b], `s w1 dash ${v.c}`); });
            E.filter(e => e.on).forEach(e => { h += SG.seg(pp[e.a], pp[e.b], `s ${v.c}`); });
          }
        });
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit || !canEdit(st)) return;
          const [x, y] = hit.dataset.pick.split(",").map(Number);
          st.data.h[y][x] = (st.data.h[y][x] + 1) % (hmax + 1);
          toolUpdate(st);
        });
      },
      out(P, h, st){
        const tn = h.tn;
        if(typ === "kocky"){
          const r = h.pr = calc(st);
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`\\text{počet kociek: } \\va{${r.n}}`)
            + (P.narys ? h.p(`Nárys: stĺpce výšky $\\vb{${r.narys.join(",\\ ")}}$ (zľava doprava)`) : "")
            + (P.bokorys ? h.p(`Bokorys: stĺpce výšky $\\vd{${r.bokorys.join(",\\ ")}}$ (spredu dozadu)`) : "")
            + h.p(`Povrch stavby: $${r.S}$ štvorcov`)
            + (cfg.ciel ? h.pill(r.ok ? "pohľady sedia" : "pohľady ešte nesedia", r.ok ? "ok" : "flat") : "");
        }
        const D = dims(P);
        h.pr = {a:D.a, b:D.b, c:D.c, kresli:P.q * D.b};
        if(cfg.out) return cfg.out(P, h, st);
        const shape = {kvader:["obdĺžnik", "obdĺžnik", "obdĺžnik"], ihlan:["trojuholník", "štvorec s uhlopriečkami", "trojuholník"], valec:["obdĺžnik", "kruh", "obdĺžnik"], kuzel:["trojuholník", "kruh so stredom", "trojuholník"]}[tel];
        return (P.obraz ? h.p(`Hrany idúce dozadu: uhol $\\omega = ${tn(P.uhol)}^\\circ$, dĺžka krát $q = ${tn(P.q)}$.`)
            + (tel === "kvader" ? h.calc(`\\vb{b} = ${tn(P.b)} \\ \\to\\ \\text{na obrázku } q \\cdot \\vb{b} = \\vb{${tn(P.q * P.b)}}`) : "")
            + h.p("Predná stena je v skutočnej veľkosti, rovnobežky zostávajú rovnobežné.") : "")
          + (P.narys ? h.p(`Nárys: **${shape[0]}** $${tn(D.a)} \\times ${tn(D.c)}$`) : "")
          + (P.podorys ? h.p(`Pôdorys: **${shape[1]}**${round ? ` s polomerom $${tn(P.r)}$` : ` $${tn(D.a)} \\times ${tn(D.b)}$`}`) : "")
          + (P.bokorys ? h.p(`Bokorys: **${shape[2]}** $${tn(D.b)} \\times ${tn(D.c)}$`) : "");
      }
    };
  }
});

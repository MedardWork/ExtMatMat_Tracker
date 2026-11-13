/* ============================================================
   TOOL: zobrazenia — a shape and its image on a grid: reflection in a line or in a point, translation,
   rotation, homothety. Plain SVG; the centre S can be dragged.
   cfg:
     typ      "osova"         the axis runs through S = [sx, sy] under the angle uhol (90 = vertical)
              "stredova"      centre S
              "posunutie"     vector [ux, uy]
              "otocenie"      centre S, angle uhol (positive = anticlockwise)
              "rovnolahlost"  centre S, coefficient k
     tvar     [[1, 1], [4, 1], [2, 3]]      the shape (its corners get the names A, B, C, …)
     sx, sy, uhol, ux, uy, k   a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)     h.tr = {pts:[[x, y]…], img:[[x′, y′]…], S:[sx, sy]}
   ============================================================ */
defTool("zobrazenia", {
  name:"Zobrazenia v rovine",
  area:"Planimetria",
  desc:"Útvar a jeho obraz: osová a stredová súmernosť, posunutie, otočenie a rovnoľahlosť na štvorcovej sieti.",
  topics:["b26", "b27"],
  presets:[
    {name:"Osová súmernosť", cfg:{typ:"osova"}},
    {name:"Šikmá os", cfg:{typ:"osova", uhol:45}},
    {name:"Stredová súmernosť", cfg:{typ:"stredova"}},
    {name:"Posunutie", cfg:{typ:"posunutie"}},
    {name:"Otočenie", cfg:{typ:"otocenie"}},
    {name:"Rovnoľahlosť", cfg:{typ:"rovnolahlost"}},
    {name:"Záporný koeficient", cfg:{typ:"rovnolahlost", k:-1.5}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["osova", "stredova", "posunutie", "otocenie", "rovnolahlost"].includes(cfg.typ) ? cfg.typ : "osova";
    const xy = (v, name, m) => ({v, min:-m, max:m, step:.5, color:"d", name});
    const S = typ === "posunutie" ? {} : {sx:xy(0, "Sₓ", 8), sy:xy(0, "Sᵧ", 4)};
    const defs = Object.assign(S, typ === "osova" ? {uhol:{v:90, min:0, max:180, step:15, color:"b", name:"φ", note:"sklon osi"}}
      : typ === "posunutie" ? {ux:{v:-5, min:-8, max:8, step:.5, color:"d", name:"uₓ"}, uy:{v:-3, min:-5, max:5, step:.5, color:"d", name:"uᵧ"}}
      : typ === "otocenie" ? {uhol:{v:90, min:-180, max:180, step:15, color:"b", name:"α", note:"uhol otočenia"}}
      : typ === "rovnolahlost" ? {k:{v:2, min:-2, max:3, step:.25, color:"b", note:"koeficient"}} : {});
    if(typ === "rovnolahlost"){ defs.sx.v = -1; defs.sy.v = -1; }
    const params = toolParams(defs, cfg, env);
    const pts = cfg.tvar || (typ === "rovnolahlost" ? [[1, 0], [3, 0], [2, 2]] : [[1, 1], [4, 1], [2, 3]]);
    const W = 560, H = 320, u = 30, ox = W / 2, oy = H / 2, px = p => [ox + p[0] * u, oy - p[1] * u];
    const rad = d => d * Math.PI / 180;
    const map = P => {
      const s = [P.sx || 0, P.sy || 0];
      if(typ === "posunutie") return p => [p[0] + P.ux, p[1] + P.uy];
      if(typ === "stredova") return p => [2 * s[0] - p[0], 2 * s[1] - p[1]];
      if(typ === "rovnolahlost") return p => [s[0] + P.k * (p[0] - s[0]), s[1] + P.k * (p[1] - s[1])];
      const a = rad(typ === "osova" ? 2 * P.uhol : P.uhol), c = Math.cos(a), n = Math.sin(a);
      if(typ === "otocenie") return p => [s[0] + c * (p[0] - s[0]) - n * (p[1] - s[1]), s[1] + n * (p[0] - s[0]) + c * (p[1] - s[1])];
      return p => [s[0] + c * (p[0] - s[0]) + n * (p[1] - s[1]), s[1] + n * (p[0] - s[0]) - c * (p[1] - s[1])];
    };
    const tidy = v => Math.round(v * 1000) / 1000;
    const movable = st => typ !== "posunutie" && !(params.sx.lock && params.sy.lock && !st.open);
    const names = "ABCDEFGH";

    return {
      params, aspect:`${W}/${H}`,
      hint:typ !== "posunutie" && !(params.sx.lock && params.sy.lock) ? "Bod **S** sa dá ťahať." : null,
      svg(P, st){
        const thumb = st.env.thumb, f = map(P), img = pts.map(f), s = [P.sx || 0, P.sy || 0], sp = px(s);
        let h = "";
        for(let x = -9; x <= 9; x++) h += SV.line(ox + x * u, 0, ox + x * u, H, x ? "s cgrid w1" : "s csoft w1");
        for(let y = -5; y <= 5; y++) h += SV.line(0, oy - y * u, W, oy - y * u, y ? "s cgrid w1" : "s csoft w1");
        if(!thumb) h += SV.text(W - 12, oy - 8, "x", "it csoft end") + SV.text(ox + 8, 14, "y", "it csoft") + SV.text(ox + u, oy + 15, "1", "mid sm csoft") + SV.text(ox - 8, oy - u + 4, "1", "end sm csoft");
        if(typ === "osova"){ const d = [Math.cos(rad(P.uhol)) * 600, -Math.sin(rad(P.uhol)) * 600]; h += SV.line(sp[0] - d[0], sp[1] - d[1], sp[0] + d[0], sp[1] + d[1], "s cb"); }
        pts.forEach((p, i) => {
          const a = px(p), b = px(img[i]);
          if(typ === "otocenie"){
            const r = Math.hypot(a[0] - sp[0], a[1] - sp[1]), a0 = Math.atan2(sp[1] - a[1], a[0] - sp[0]) * 180 / Math.PI;
            h += SV.path(SV.arc(sp[0], sp[1], r, a0, a0 + P.uhol), "s cb w1 dots");
          } else if(typ === "rovnolahlost"){
            h += SG.seg(sp, a, "s cb w1 dots") + SG.seg(sp, b, "s cb w1 dots");
          } else h += SG.seg(a, b, `s ${typ === "posunutie" ? "cd" : "cb"} w1 dots`);
        });
        if(typ === "posunutie"){ const a = px(pts[0]), b = px(img[0]); h += SG.seg(a, b, "s cd") + SV.head(b[0], b[1], b[0] - a[0], b[1] - a[1], "f cd", 10); }
        if(typ === "otocenie"){ h += SG.seg(sp, px(pts[0]), "s cb w1") + SG.seg(sp, px(img[0]), "s cb w1"); }
        const shape = (q, cls, dash) => { const pp = q.map(px), c = pp.reduce((m, p) => [m[0] + p[0] / pp.length, m[1] + p[1] / pp.length], [0, 0]);
          return SV.poly(pp, `bg ${cls}`) + SV.poly(pp, `s ${cls}`) + (thumb ? "" : pp.map((p, i) => SG.label(p, names[i] + (dash ? "′" : ""), `${cls} halo`, c, 13)).join("")); };
        h += shape(pts, "cink") + shape(img, "ca", true);
        if(typ !== "posunutie"){
          h += SG.dot(sp, "h cd", 6.5) + (thumb ? "" : SV.text(sp[0] + 10, sp[1] + 17, "S", "cd halo"));
          if(movable(st) && !thumb) h += SV.circle(sp[0], sp[1], 16, "hit", ' data-drag="S"');
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        svgDrag(el, st, (id, x, y) => {
          const sn = v => Math.round(v * 2) / 2, nx = Math.max(-8, Math.min(8, sn((x - ox) / u))), ny = Math.max(-4, Math.min(4, sn((oy - y) / u)));
          if(nx === st.P.sx && ny === st.P.sy) return false;
          if(!(params.sx.lock && !st.open)) st.P.sx = nx;
          if(!(params.sy.lock && !st.open)) st.P.sy = ny;
        });
      },
      out(P, h, st){
        const f = map(P), img = pts.map(f).map(p => p.map(tidy)), tn = h.tn;
        h.tr = {pts, img, S:[P.sx || 0, P.sy || 0]};
        if(cfg.out) return cfg.out(P, h, st);
        let o = pts.map((p, i) => h.calc(`${names[i]}[${tn(p[0])};\\ ${tn(p[1])}] \\to \\va{${names[i]}'[${tn(img[i][0])};\\ ${tn(img[i][1])}]}`)).join("");
        if(typ === "osova") o += h.p("Os je osou každej úsečky $XX'$: pretína ju v strede a kolmo.") + h.pill("zhodné zobrazenie · poradie vrcholov sa obráti", "flat");
        else if(typ === "stredova") o += h.p("Stred $\\vd{S}$ je stredom každej úsečky $XX'$. Je to otočenie o $180^\\circ$.") + h.pill("zhodné zobrazenie", "ok");
        else if(typ === "posunutie") o += h.calc(`[x;\\ y] \\to [x ${P.ux < 0 ? "-" : "+"} \\vd{${tn(Math.abs(P.ux))}};\\ y ${P.uy < 0 ? "-" : "+"} \\vd{${tn(Math.abs(P.uy))}}]`) + h.pill("zhodné zobrazenie", "ok");
        else if(typ === "otocenie") o += h.p(`Každý bod zostáva rovnako ďaleko od $\\vd{S}$ a pootočí sa o $\\vb{${tn(P.uhol)}^\\circ}$ ${P.uhol >= 0 ? "proti smeru" : "v smere"} hodinových ručičiek.`) + h.pill("zhodné zobrazenie", "ok");
        else o += h.calc(`|SX'| = |\\vb{${tn(P.k)}}| \\cdot |SX|`) + h.p(`Dĺžky sa násobia $${tn(Math.abs(P.k))}$, obsah $${tn(P.k * P.k)}$. ${P.k < 0 ? "Záporný koeficient: obraz leží na opačnej strane od S." : ""}`)
          + h.pill(Math.abs(P.k) === 1 ? "|k| = 1: zhodné zobrazenie" : "podobné zobrazenie", Math.abs(P.k) === 1 ? "ok" : "flat");
        return o;
      }
    };
  }
});

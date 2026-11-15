/* ============================================================
   TOOL: poloha — lines and planes given by corners of a cube ABCDEFGH: how two lines, a line and a plane,
   or two planes lie to each other (parallel, intersecting, skew…), with the angle and the distance. Plain SVG.
   cfg:
     typ      "priamky"   lines p and q             p:"AB", q:"CG"
              "rovina"    line p and plane ρ        p:"AG", r:"BDE"
              "roviny"    planes ρ and σ            r:"ABG", s:"BCE"
     a, b, c  the edges AB, AD, AE (4, 4, 4), plain numbers
     body     {M:["AB", .5]}     extra points on edges (one-letter names), usable in p, q, r, s
     pevne    "p"         objects the reader cannot re-pick by clicking (a string of p, q, r, s);  klikaj:false forbids all
     on       {miery:true}     angle and distance are printed;  {hrany:true} (priamky) colours every edge of the cube
                               by how it lies to p, and counts them;  toggles:["miery", "hrany"]
     out(P, h, st)     h.pol = {vztah, uhol, d, X, pocty:{rov, roz, mim}}
                       vztah: "totozne" "rovnobezne" "roznobezne" "mimobezne" | "lezi" "rovnobezna" "pretina" "kolma" | (planes) "totozne" "rovnobezne" "roznobezne"
   ============================================================ */
const POLOHA_TXT = {
  priamky:{totozne:"totožné priamky", rovnobezne:"rovnobežky", roznobezne:"rôznobežky", mimobezne:"mimobežky"},
  rovina:{lezi:"priamka leží v rovine", rovnobezna:"priamka je rovnobežná s rovinou", pretina:"priamka pretína rovinu", kolma:"priamka je kolmá na rovinu"},
  roviny:{totozne:"totožné roviny", rovnobezne:"rovnobežné roviny", roznobezne:"rôznobežné roviny"}
};

defTool("poloha", {
  name:"Priamky a roviny v kocke",
  area:"Stereometria",
  desc:"Dve priamky, priamka a rovina alebo dve roviny určené vrcholmi kocky: vzájomná poloha, odchýlka a vzdialenosť.",
  topics:["b31", "b33", "b34"],
  presets:[
    {name:"Mimobežky", cfg:{typ:"priamky", p:"AB", q:"CG"}},
    {name:"Rovnobežky", cfg:{typ:"priamky", p:"AB", q:"HG"}},
    {name:"Rôznobežky", cfg:{typ:"priamky", p:"AG", q:"BH"}},
    {name:"Hrany a priamka AB", cfg:{typ:"priamky", p:"AB", q:"CG", on:{hrany:true}}},
    {name:"Priamka kolmá na rovinu", cfg:{typ:"rovina", p:"AG", r:"BDE"}},
    {name:"Priamka rovnobežná s rovinou", cfg:{typ:"rovina", p:"EG", r:"ABC"}},
    {name:"Rôznobežné roviny", cfg:{typ:"roviny", r:"ABG", s:"BCE"}},
    {name:"Rovnobežné roviny", cfg:{typ:"roviny", r:"BDE", s:"CFH"}}
  ],
  help:"**Klikaj na vrcholy**: postupne nimi určíš prvý a potom druhý útvar (priamku dvoma bodmi, rovinu troma). Krúžok ukazuje bod, ktorý sa zmení ďalším klikom.",

  make(cfg, env){
    const typ = ["priamky", "rovina", "roviny"].includes(cfg.typ) ? cfg.typ : "priamky";
    const objs = typ === "priamky" ? [["p", 2, cfg.p || "AB"], ["q", 2, cfg.q || "CG"]] : typ === "rovina" ? [["p", 2, cfg.p || "AG"], ["r", 3, cfg.r || "BDE"]] : [["r", 3, cfg.r || "ABG"], ["s", 3, cfg.s || "BCE"]];
    const start = objs.map(o => o[2].slice(0, o[1])).join("");
    const slots = objs.flatMap(o => Array.from({length:o[1]}, () => o[0]));
    const fixed = i => cfg.klikaj === false || (cfg.pevne || "").includes(slots[i]);
    const COL = {p:"a", q:"b", r:"d", s:"b"}, TEX = {p:"p", q:"q", r:"\\varrho", s:"\\sigma"};
    const params = toolParams({
      miery:{type:"check", v:env.full, name:"Odchýlka a vzdialenosť"},
      hrany:typ === "priamky" ? {type:"check", v:false, name:"Zafarbi hrany podľa polohy k priamke p"} : null
    }, cfg, env);
    const A = cfg.a || 4, B = cfg.b || 4, C = cfg.c || 4, W = 560, H = 340, K = .5 * Math.SQRT1_2, EPS = 1e-7;
    const PT = {A:[0, 0, 0], B:[A, 0, 0], C:[A, B, 0], D:[0, B, 0], E:[0, 0, C], F:[A, 0, C], G:[A, B, C], H:[0, B, C]};
    for(const n in (cfg.body || {})){ const [e, t] = cfg.body[n], p = PT[e[0]], q = PT[e[1]]; PT[n] = V3.add(p, V3.mul(V3.sub(q, p), t)); }
    const f = svFit(W, H, [-.6, -.3, A + B * K + .6, C + B * K + .3], 26), proj = p => f.p([p[0] + p[1] * K, p[2] + p[1] * K]);
    const {sub, add, mul, dot, cross, len} = V3;
    const ang = x => Math.acos(Math.max(-1, Math.min(1, x))) * 180 / Math.PI;
    const nameOf = X => Object.keys(PT).find(n => len(sub(PT[n], X)) < 1e-6);

    const lineOf = s => { const P0 = PT[s[0]], u = sub(PT[s[1]], P0); return len(u) < EPS ? null : {P0, u}; };
    const planeOf = s => { const R0 = PT[s[0]], n = cross(sub(PT[s[1]], R0), sub(PT[s[2]], R0)); return len(n) < EPS ? null : {R0, n}; };
    const lines = (l, m) => {
      const w = cross(l.u, m.u), g = sub(m.P0, l.P0), a = ang(Math.abs(dot(l.u, m.u)) / (len(l.u) * len(m.u)));
      if(len(w) < EPS){ const d = len(cross(g, l.u)) / len(l.u); return d < EPS ? {vztah:"totozne", uhol:0, d:0} : {vztah:"rovnobezne", uhol:0, d}; }
      const t = dot(cross(g, m.u), w) / dot(w, w), s = dot(cross(g, l.u), w) / dot(w, w), X = add(l.P0, mul(l.u, t)), Y = add(m.P0, mul(m.u, s));
      return Math.abs(dot(g, w)) < EPS ? {vztah:"roznobezne", uhol:a, d:0, X} : {vztah:"mimobezne", uhol:a, d:Math.abs(dot(g, w)) / len(w), X, Y};
    };
    const calc = st => {
      const sel = st.data.sel, part = i => sel.slice(objs.slice(0, i).reduce((s, o) => s + o[1], 0)).slice(0, objs[i][1]);
      const o1 = (objs[0][1] === 2 ? lineOf : planeOf)(part(0)), o2 = (objs[1][1] === 2 ? lineOf : planeOf)(part(1));
      const r = {o1, o2, n1:part(0).join(""), n2:part(1).join("")};
      if(!o1 || !o2) return r;
      if(typ === "priamky"){
        Object.assign(r, lines(o1, o2));
        r.hrany = CUBE_EDGES.map(e => ({e, v:lines(o1, lineOf(e)).vztah}));
        r.pocty = {rov:0, roz:0, mim:0};
        r.hrany.forEach(x => { if(x.v === "rovnobezne") r.pocty.rov++; else if(x.v === "roznobezne") r.pocty.roz++; else if(x.v === "mimobezne") r.pocty.mim++; });
      } else if(typ === "rovina"){
        const un = dot(o1.u, o2.n), g = dot(sub(o2.R0, o1.P0), o2.n);
        if(Math.abs(un) < EPS){ r.uhol = 0; r.d = Math.abs(g) / len(o2.n); r.vztah = r.d < EPS ? "lezi" : "rovnobezna"; }
        else { r.X = add(o1.P0, mul(o1.u, g / un)); r.d = 0; r.uhol = 90 - ang(Math.abs(un) / (len(o1.u) * len(o2.n))); r.vztah = r.uhol > 90 - 1e-6 ? "kolma" : "pretina"; }
      } else {
        const w = cross(o1.n, o2.n);
        r.uhol = ang(Math.abs(dot(o1.n, o2.n)) / (len(o1.n) * len(o2.n)));
        if(len(w) < EPS){ r.uhol = 0; r.d = Math.abs(dot(sub(o2.R0, o1.R0), o1.n)) / len(o1.n); r.vztah = r.d < EPS ? "totozne" : "rovnobezne"; }
        else { r.d = 0; r.vztah = "roznobezne"; r.L = {P0:mul(add(mul(cross(o2.n, w), dot(o1.n, o1.R0)), mul(cross(w, o1.n), dot(o2.n, o2.R0))), 1 / dot(w, w)), u:w}; }
      }
      return r;
    };
    /* the part of a line inside the box of the cube grown by m */
    const clip = (l, m) => {
      let t0 = -Infinity, t1 = Infinity;
      [A, B, C].forEach((s, i) => {
        if(Math.abs(l.u[i]) < EPS){ if(l.P0[i] < -m - EPS || l.P0[i] > s + m + EPS) t0 = Infinity; return; }
        const x = (-m - l.P0[i]) / l.u[i], y = (s + m - l.P0[i]) / l.u[i];
        t0 = Math.max(t0, Math.min(x, y)); t1 = Math.min(t1, Math.max(x, y));
      });
      return t0 < t1 ? [add(l.P0, mul(l.u, t0)), add(l.P0, mul(l.u, t1))] : null;
    };
    /* the section of the cube by a plane, corners in order */
    const section = pl => {
      const poly = [], put = p => { if(!poly.some(q => len(sub(p, q)) < 1e-6)) poly.push(p); };
      CUBE_EDGES.forEach(e => {
        const p = PT[e[0]], q = PT[e[1]], dp = dot(pl.n, sub(p, pl.R0)), dq = dot(pl.n, sub(q, pl.R0));
        if(Math.abs(dp) < EPS) put(p);
        if(Math.abs(dq) < EPS) put(q);
        if(dp * dq < -EPS) put(add(p, mul(sub(q, p), dp / (dp - dq))));
      });
      if(poly.length < 3) return poly;
      const c = mul(poly.reduce(add, [0, 0, 0]), 1 / poly.length), e1 = sub(poly[0], c), e2 = cross(pl.n, e1);
      const at = p => Math.atan2(dot(sub(p, c), e2) / len(e2), dot(sub(p, c), e1) / len(e1));
      return poly.sort((p, q) => at(p) - at(q));
    };

    return {
      params, aspect:`${W}/${H}`,
      hint:cfg.klikaj === false ? null : "**Klikaj** na vrcholy: určíš nimi priamky a roviny.",
      init(st){ st.data = {sel:start.split(""), next:Math.max(0, slots.findIndex((s, i) => !fixed(i)))}; },
      svg(P, st){
        const r = calc(st), thumb = st.env.thumb, sel = st.data.sel;
        const pp = n => proj(PT[n]), seg3 = (a, b, c) => SG.seg(proj(a), proj(b), c);
        let h = "", top = "";
        [[r.o1, objs[0]], [r.o2, objs[1]]].forEach(([o, def]) => {
          if(!o) return;
          const c = "c" + COL[def[0]];
          if(def[1] === 3){ const poly = section(o).map(proj); if(poly.length > 2){ h += SV.poly(poly, `bg ${c} po-pl`); top += SV.poly(poly, `s ${c} w1`); } }
          else if(!(P.hrany && def[0] === "q")){ const e = clip(o, .55); if(e) top += seg3(e[0], e[1], `s ${c}`) + seg3(o.P0, add(o.P0, o.u), `s ${c} w3`); }
        });
        const tint = {rovnobezne:"cb", roznobezne:"cok", mimobezne:"cd", totozne:"ca"};
        CUBE_EDGES.forEach((e, i) => {
          const c = P.hrany && r.hrany ? `${tint[r.hrany[i].v]} w3` : e.includes("D") ? "csoft w1" : "";
          h += SG.seg(pp(e[0]), pp(e[1]), `s ${c}${e.includes("D") ? " dash" : ""}`);
        });
        h += top;
        if(r.L){ const e = clip(r.L, .3); if(e) h += seg3(e[0], e[1], "s cc w3"); }
        if(r.vztah === "mimobezne" && P.miery && !P.hrany) h += seg3(r.X, r.Y, "s cc w3 dots") + SG.dot(proj(r.X), "f cc", 3.5) + SG.dot(proj(r.Y), "f cc", 3.5);
        if(r.X && r.vztah !== "mimobezne" && !P.hrany && [0, 1, 2].every(i => r.X[i] > -.6 && r.X[i] < [A, B, C][i] + .6)){
          const x = proj(r.X);
          h += SG.dot(x, "h cc", 5.5) + (thumb || nameOf(r.X) ? "" : SV.text(x[0] + 9, x[1] - 8, "P", "cc halo"));
        }
        if(thumb) return SV.wrap(W, H, h);
        const mid = proj([A / 2, B / 2, C / 2]);
        Object.keys(PT).forEach(n => {
          const p = pp(n), on = sel.map((s, i) => s === n && !(P.hrany && slots[i] === "q") ? i : -1).filter(i => i >= 0);
          h += SG.label(p, n, on.length ? `c${COL[slots[on[0]]]} halo` : "csoft halo", mid, 14);
          h += on.length ? SG.dot(p, `h c${COL[slots[on[0]]]}`, 5) : n.length === 1 && !"ABCDEFGH".includes(n) ? SG.dot(p, "f csoft", 3.5) : "";
          if(cfg.klikaj !== false && sel[st.data.next] === n && !fixed(st.data.next)) h += SV.circle(p[0], p[1], 10, `s w1 c${COL[slots[st.data.next]]}`);
          if(cfg.klikaj !== false) h += SV.circle(p[0], p[1], 15, "hit", ` data-pick="${n}"`);
        });
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit || cfg.klikaj === false || fixed(st.data.next)) return;
          st.data.sel[st.data.next] = hit.dataset.pick;
          for(let k = 1; k <= slots.length; k++){ const i = (st.data.next + k) % slots.length; if(!fixed(i)){ st.data.next = i; break; } }
          toolUpdate(st);
        });
      },
      out(P, h, st){
        const r = calc(st), tn = h.tn;
        h.pol = r;
        if(cfg.out) return cfg.out(P, h, st);
        const tag = (o, s) => `$\\v${COL[o[0]]}{${TEX[o[0]]}} = ${s}$`;
        let o = h.p(`${tag(objs[0], r.n1)}, ${P.hrany ? "hrany kocky" : tag(objs[1], r.n2)}`);
        if(!r.o1 || !r.o2) return o + h.pill(objs.some((x, i) => x[1] === 3 && !(i ? r.o2 : r.o1)) ? "tri body na jednej priamke rovinu neurčujú" : "priamku určujú dva rôzne body", "flat");
        if(P.hrany) return o + h.p(`Rovnobežné s $p$: $\\vb{${r.pocty.rov}}$`) + `<div>${h.m("Rôznobežné s $p$: ")}<b class="po-roz">${r.pocty.roz}</b></div>` + h.p(`Mimobežné s $p$: $\\vd{${r.pocty.mim}}$`)
          + h.p("Mimobežná hrana s $p$ nemá spoločný bod a nie je s ňou rovnobežná.");
        const X = r.X && r.vztah !== "mimobezne" ? nameOf(r.X) || `P[${r.X.map(v => tn(v)).join(";\\ ")}]` : "";
        o += h.pill(POLOHA_TXT[typ][r.vztah], r.vztah === "mimobezne" ? "flat" : "ok");
        o += h.p({
          priamky:{totozne:"Majú spoločné všetky body.", rovnobezne:"Ležia v jednej rovine a nemajú spoločný bod.", roznobezne:`Majú spoločný práve jeden bod $${X}$, ležia teda v jednej rovine.`, mimobezne:"Nemajú spoločný bod a neležia v jednej rovine."},
          rovina:{lezi:"Všetky body priamky patria rovine.", rovnobezna:"Priamka nemá s rovinou žiadny spoločný bod.", pretina:`Spoločný je práve jeden bod $${X}$.`, kolma:`Spoločný je práve jeden bod $${X}$ a priamka je kolmá na každú priamku roviny.`},
          roviny:{totozne:"Majú spoločné všetky body.", rovnobezne:"Nemajú žiadny spoločný bod.", roznobezne:"Spoločné body tvoria priamku: **priesečnicu**."}
        }[typ][r.vztah]);
        if(P.miery){
          if(r.uhol > 1e-6 || r.vztah === "roznobezne") o += h.calc(`\\text{odchýlka } \\varphi ${Math.abs(r.uhol - Math.round(r.uhol)) < 1e-6 ? "=" : "\\doteq"} ${tn(r.uhol, 1)}^\\circ`);
          if(r.d > EPS) o += h.calc(`\\text{vzdialenosť } d ${Math.abs(r.d - Math.round(r.d)) < 1e-6 ? "=" : "\\doteq"} \\vc{${tn(r.d)}}`);
        }
        return o;
      }
    };
  }
});

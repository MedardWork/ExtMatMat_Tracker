/* ============================================================
   TOOL: kruznica — the unit circle: an angle in degrees and radians, sin / cos / tg as segments,
   and their graphs unrolling beside the circle. Plain SVG; the point on the circle can be dragged.
   cfg:
     uhol     40 | {v, min, max, step, lock}   the angle in degrees; a range wider than 0…360 shows more periods
     on       {sin, cos, tg, rad, body, znam, graf}   layers shown from the start
                sin cos tg  the three segments (and their curves when graf is on)
                rad         the arc measured in radians, labels in multiples of π
                body        the notable angles (multiples of 30° and 45°) marked on the circle
                znam        signs of the functions in the four quadrants
                graf        the graph beside the circle
     toggles  ["cos"]                           layers the reader may switch here
     eq       "sin" | "cos" | "tg"              adds the equation  sin x = c  with a slider c and its solutions
     c        0.5 | {v, min, max, step, lock}   the right side of that equation
     free, lock, hide                           see toolParams in core.js
     out(P, h, st)     h.kr = {deg, rad, sin, cos, tg, radTex, exact:{sin, cos, tg}, sols:[degrees]}
   Helpers usable from theory: trigExact(deg, "sin"), radTex(deg), trigSolve("sin", c, lo, hi)
   ============================================================ */
const KR_LAYERS = [
  ["sin", "Sínus (zvislá úsečka)", "a"],
  ["cos", "Kosínus (vodorovná úsečka)", "b"],
  ["tg", "Tangens (na dotyčnici)", "c"],
  ["rad", "Oblúková miera", "d"],
  ["body", "Význačné uhly", null],
  ["znam", "Znamienka v kvadrantoch", null],
  ["graf", "Graf vedľa kružnice", null]
];
const KR_FN = {sin:Math.sin, cos:Math.cos, tg:Math.tan};

/* TeX of the exact value at a multiple of 30° or 45°; null elsewhere */
function trigExact(deg, fn){
  const d = ((deg % 360) + 360) % 360;
  if(d % 30 !== 0 && d % 45 !== 0) return null;
  const ref = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d;
  const S = {0:"0", 30:"\\frac{1}{2}", 45:"\\frac{\\sqrt{2}}{2}", 60:"\\frac{\\sqrt{3}}{2}", 90:"1"};
  const T = {0:"0", 30:"\\frac{\\sqrt{3}}{3}", 45:"1", 60:"\\sqrt{3}", 90:null};
  const neg = fn === "sin" ? d > 180 : fn === "cos" ? d > 90 && d < 270 : (d > 90 && d < 180) || d > 270;
  const v = fn === "sin" ? S[ref] : fn === "cos" ? S[90 - ref] : T[ref];
  if(v == null) return null;
  return (neg && v !== "0" ? "-" : "") + v;
}
/* 150 → \frac{5\pi}{6}; plain: "5π/6" */
function radTex(deg, plain){
  if(!Number.isInteger(deg)) return null;
  if(deg === 0) return "0";
  const gcd = (a, b) => b ? gcd(b, a % b) : a, g = gcd(Math.abs(deg), 180);
  const n = Math.abs(deg) / g, m = 180 / g, sign = deg < 0 ? (plain ? "−" : "-") : "";
  const top = (n === 1 ? "" : n) + (plain ? "π" : "\\pi");
  return sign + (m === 1 ? top : plain ? `${top}/${m}` : `\\frac{${top}}{${m}}`);
}
/* all x in ⟨lo, hi) (degrees) with fn(x) = c */
function trigSolve(fn, c, lo, hi){
  const deg = r => r * 180 / Math.PI, out = [];
  if(fn !== "tg" && Math.abs(c) > 1) return out;
  const base = fn === "sin" ? [deg(Math.asin(c)), 180 - deg(Math.asin(c))] : fn === "cos" ? [deg(Math.acos(c)), -deg(Math.acos(c))] : [deg(Math.atan(c))];
  const per = fn === "tg" ? 180 : 360;
  base.forEach(b => {
    for(let k = Math.ceil((lo - b) / per - 1e-9); b + k * per < hi - 1e-9; k++){
      const x = Math.round((b + k * per) * 1e6) / 1e6;
      if(!out.some(o => Math.abs(o - x) < 1e-4)) out.push(x);
    }
  });
  return out.sort((x, y) => x - y);
}

defTool("kruznica", {
  name:"Jednotková kružnica",
  area:"Funkcie",
  desc:"Bod na kružnici s polomerom 1. Uhol v stupňoch aj radiánoch, sínus, kosínus a tangens ako úsečky a graf, ktorý sa z nich odvíja.",
  topics:["b8", "b9", "b10", "b11"],
  presets:[
    {name:"Sínus a kosínus", cfg:{on:{sin:true, cos:true, graf:true}}},
    {name:"Oblúková miera", cfg:{uhol:60, on:{rad:true, body:true}}},
    {name:"Tangens", cfg:{on:{tg:true, graf:true}}},
    {name:"Znamienka", cfg:{uhol:130, on:{sin:true, cos:true, znam:true}}},
    {name:"Rovnica sin x = c", cfg:{eq:"sin", on:{sin:true, graf:true}}},
    {name:"Rovnica cos x = c", cfg:{eq:"cos", on:{cos:true, graf:true}}},
    {name:"Viac periód", cfg:{uhol:{v:30, min:-360, max:720}, on:{sin:true, graf:true}}}
  ],
  help:"Bod na kružnici potiahni alebo napíš uhol k posuvníku. Uhol môže byť aj záporný alebo väčší než 360°.",
  textKeys:["eq"],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const eq = KR_FN[cfg.eq] ? cfg.eq : null;
    const defs = {
      uhol:{v:40, min:0, max:360, step:5, color:"d", name:"α", note:"uhol v stupňoch"},
      c:eq ? (eq === "tg" ? {v:1, min:-3, max:3, step:.25, color:"c", note:"pravá strana"} : {v:.5, min:-1, max:1, step:.05, color:"c", note:"pravá strana"}) : null
    };
    KR_LAYERS.forEach(([id, name, color]) => { defs[id] = {type:"check", v:false, name, color}; });
    const on = cfg.on || {sin:true, cos:true, graf:true};
    const params = toolParams(defs, Object.assign({}, cfg, {on}), env);

    const W = 580, H = 300, cx = 142, cy = 150, R = 96, gx0 = 318, gx1 = 562, WC = 284;
    const rad = d => d * Math.PI / 180;
    const col = {sin:"ca", cos:"cb", tg:"cc"};
    const info = P => {
      const deg = P.uhol, t = rad(deg), r = {deg, rad:t, sin:Math.sin(t), cos:Math.cos(t), tg:Math.tan(t)};
      if(Math.abs(r.cos) < 1e-9) r.tg = NaN;
      r.radTex = radTex(deg);
      r.exact = {sin:trigExact(deg, "sin"), cos:trigExact(deg, "cos"), tg:trigExact(deg, "tg")};
      return r;
    };
    const span = st => { const l = st.lim.uhol || params.uhol; return [Math.min(l.min, 0), Math.max(l.max, 360)]; };
    const sols = (P, st) => eq ? trigSolve(eq, P.c, span(st)[0], span(st)[1]) : [];
    const movable = st => !(params.uhol.lock && !st.open);

    return {
      params, aspect:`${W}/${H}`,
      hint:params.uhol.lock ? null : "Bod na kružnici sa dá **ťahať**.",

      svg(P, st){
        const k = info(P), thumb = st.env.thumb, graf = P.graf;
        const px = cx + R * k.cos, py = cy - R * k.sin;
        const pos = (deg, r) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
        const angLab = d => P.rad ? radTex(d, true) : d + "°";
        let h = "";

        /* axes and the circle */
        h += SV.line(cx - R - 26, cy, cx + R + 30, cy, "s csoft w1") + SV.line(cx, cy + R + 26, cx, cy - R - 28, "s csoft w1");
        if(!thumb) h += SV.text(cx + R + 32, cy + 15, "x", "it csoft") + SV.text(cx + 8, cy - R - 22, "y", "it csoft");
        h += SV.circle(cx, cy, R, "s");
        if(!thumb && !P.body) h += SV.text(cx + R + 5, cy + 15, "1", "sm csoft") + SV.text(cx - R - 5, cy + 15, "−1", "sm csoft end") + SV.text(cx - 6, cy - R - 5, "1", "sm csoft end") + SV.text(cx - 6, cy + R + 14, "−1", "sm csoft end");

        if(P.znam && !thumb) [[45, "+", "+", "+"], [135, "+", "−", "−"], [225, "−", "−", "+"], [315, "−", "+", "−"]].forEach(([d, s, c, t], i) => {
          const [x, y] = pos(d, R * .58);
          h += SV.text(x, y - 14, ["I", "II", "III", "IV"][i], "mid sm csoft")
            + SV.text(x, y + 2, `sin ${s}`, "mid sm ca") + SV.text(x, y + 16, `cos ${c}`, "mid sm cb") + (P.tg ? SV.text(x, y + 30, `tg ${t}`, "mid sm cc") : "");
        });
        if(P.body) for(let d = 0; d < 360; d += 15){
          if(d % 30 && d % 45) continue;
          const [x, y] = pos(d, R), [lx, ly] = pos(d, R + (P.rad ? 17 : 15));
          h += SV.circle(x, y, 3, "f csoft");
          if(!thumb) h += SV.text(lx, ly + 4, angLab(d), "mid sm csoft thin");
        }

        /* the equation fn(x) = c on the circle */
        const S = sols(P, st);
        if(eq){
          const c = P.c;
          if(eq === "sin") h += SV.line(cx - R - 20, cy - R * c, graf ? gx1 : cx + R + 20, cy - R * c, "s cok w1 dash");
          else if(eq === "cos") h += SV.line(cx + R * c, cy - R - 20, cx + R * c, cy + R + 20, "s cok w1 dash");
          const seen = [];
          S.forEach(x => {
            const m = ((x % 360) + 360) % 360;
            if(seen.some(o => Math.abs(o - m) < 1e-4)) return;
            seen.push(m);
            const [sx, sy] = pos(m, R);
            h += SV.line(cx, cy, sx, sy, "s cok w1") + SV.circle(sx, sy, 5, "f cok");
          });
        }

        /* the angle, the arc, the three segments */
        const turn = Math.max(-360, Math.min(360, k.deg));
        h += SV.path(SV.arc(cx, cy, 22, 0, turn), "s cd w1");
        if(P.rad) h += SV.path(SV.arc(cx, cy, R, 0, turn), "s cd w5");
        if(P.tg){
          const tx = cx + R, lim = 1.42, ty = cy - R * Math.max(-lim, Math.min(lim, k.tg));
          h += SV.line(tx, cy - R * lim, tx, cy + R * lim, "s csoft w1");
          if(isFinite(k.tg)){
            const far = Math.abs(k.tg) > lim, e = far ? Math.sign(k.tg) * lim / k.tg : 1;
            h += SV.line(cx, cy, cx + R * e, cy - R * k.tg * e, "s csoft w1 dash") + SV.line(tx, cy, tx, ty, "s cc w3");
            if(!far) h += SV.circle(tx, ty, 4, "f cc");
          }
        }
        if(P.cos) h += SV.line(cx, cy, px, cy, "s cb w3");
        if(P.sin) h += SV.line(px, cy, px, py, "s ca w3");
        h += SV.line(cx, cy, px, py, "s");
        if(!thumb){
          const mid = turn / 2, [ax, ay] = pos(mid, 36);
          h += SV.text(ax, ay + 5, "α", "mid it cd halo");
          if(P.sin && !P.znam && Math.abs(k.sin) > .16) h += SV.text(px + (k.cos >= 0 ? 7 : -7), (cy + py) / 2 + 4, "sin α", `sm ca halo${k.cos >= 0 ? "" : " end"}`);
          if(P.cos && !P.znam && Math.abs(k.cos) > .22) h += SV.text((cx + px) / 2, cy + (k.sin >= 0 ? 15 : -7), "cos α", "sm cb mid halo");
          if(P.tg && isFinite(k.tg) && Math.abs(k.tg) > .12) h += SV.text(cx + R + 8, cy - R * Math.max(-1.3, Math.min(1.3, k.tg)) / 2 + 4, "tg α", "sm cc halo");
          if(P.rad && Math.abs(turn) >= 20){ const [rx, ry] = pos(mid, R + 16); h += SV.text(rx, ry + 4, fmtN(Math.abs(rad(turn))), "mid sm cd halo"); }
        }

        /* the graph beside the circle */
        if(graf){
          const [lo, hi] = span(st), X = d => gx0 + (d - lo) / (hi - lo) * (gx1 - gx0), Y = v => cy - R * v;
          const step = hi - lo > 720 ? 180 : 90;
          h += SV.line(gx0 - 8, cy, gx1 + 10, cy, "s csoft w1") + SV.line(X(0), cy + R + 26, X(0), cy - R - 28, "s csoft w1");
          [1, -1].forEach(v => { h += SV.line(cx, Y(v), gx1, Y(v), "s cgrid w1 dash"); });
          for(let d = Math.ceil(lo / step) * step; d <= hi; d += step){
            if(d === 0) continue;
            h += SV.line(X(d), cy - 4, X(d), cy + 4, "s csoft w1");
            if(!thumb) h += SV.text(X(d), cy + 17, angLab(d), "mid sm csoft thin halo");
          }
          const shown = ["sin", "cos", "tg"].filter(f => P[f]);
          if(!shown.length) shown.push(eq || "sin");
          if(eq && !shown.includes(eq)) shown.push(eq);
          shown.forEach(f => {
            const pts = [];
            for(let i = 0; i <= 240; i++){
              const d = lo + (hi - lo) * i / 240, v = KR_FN[f](rad(d));
              pts.push(Math.abs(v) > 1.42 ? null : [X(d), Y(v)]);
            }
            h += SV.path(SV.d(pts), `s ${col[f]}`);
          });
          if(eq){
            if(eq !== "sin") h += SV.line(gx0 - 8, Y(P.c), gx1, Y(P.c), "s cok w1 dash");
            S.forEach(x => { h += SV.circle(X(x), Y(P.c), 5, "f cok"); });
          }
          if(P.sin) h += SV.line(px, py, X(k.deg), py, "s ca w1 dots");
          shown.forEach(f => {
            const v = k[f];
            if(!isFinite(v) || Math.abs(v) > 1.42) return;
            h += SV.line(X(k.deg), cy, X(k.deg), Y(v), `s ${col[f]} w3`) + SV.circle(X(k.deg), Y(v), 4.5, `h ${col[f]}`);
          });
        }

        h += SV.circle(px, py, 7.5, "h cd");
        if(movable(st) && !thumb) h += `<circle class="hit" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke-width="30" pointer-events="stroke" data-drag="P"/>` + SV.circle(px, py, 15, "hit", ' data-drag="P"');
        return SV.wrap(graf ? W : WC, H, h);
      },

      bind(el, st){
        svgDrag(el, st, (id, x, y) => {
          const p = st.w.params.uhol, lim = st.lim.uhol || p, step = p.step || 1;
          let a = Math.atan2(cy - y, x - cx) * 180 / Math.PI;
          a += 360 * Math.round((st.P.uhol - a) / 360);
          a = Math.round(a / step) * step;
          while(a > lim.max) a -= 360;
          while(a < lim.min) a += 360;
          a = Math.min(lim.max, a);
          if(a === st.P.uhol) return false;
          st.P.uhol = a;
        });
      },

      out(P, h, st){
        const k = info(P);
        k.sols = sols(P, st);
        h.kr = k;
        if(cfg.out) return cfg.out(P, h, st);
        const tn = h.tn, d3 = x => tn(Math.round(x * 1000) / 1000, 3);
        const val = (f, v) => {
          const c = f === "sin" ? "a" : f === "cos" ? "b" : "c", ex = k.exact[f], lhs = `\\${f}\\, \\vd{${tn(k.deg)}^\\circ}`;
          if(!isFinite(v)) return h.calc(`${lhs}\\text{ nie je definovaný}`);
          if(ex == null) return h.calc(`${lhs} \\doteq \\v${c}{${d3(v)}}`);
          if(!/frac|sqrt/.test(ex)) return h.calc(`${lhs} = \\v${c}{${ex}}`);
          return h.calc(`${lhs} = \\v${c}{${ex}} ${/sqrt/.test(ex) ? "\\doteq" : "="} ${d3(v)}`);
        };
        const radPart = k.deg === 0 ? "= 0" : k.radTex ? `= \\vd{${k.radTex}} \\doteq ${d3(k.rad)}` : `\\doteq ${d3(k.rad)}`;
        let o = h.calc(`\\vd{\\alpha} = \\vd{${tn(k.deg)}^\\circ} ${radPart}\\ \\text{rad}`);
        ["sin", "cos", "tg"].forEach(f => { if(P[f] || f === eq) o += val(f, k[f]); });
        if(!P.sin && !P.cos && !P.tg && !eq) o += val("sin", k.sin) + val("cos", k.cos);
        if(P.rad) o += h.p(`Oblúk má pri polomere 1 dĺžku $\\vd{${d3(Math.abs(k.rad))}}$, to je veľkosť uhla v radiánoch.`);
        if(eq){
          const [lo, hi] = span(st), S = k.sols;
          const list = S.map(x => `${tn(Math.round(x * 10) / 10, 1)}^\\circ`).join(";\\ ");
          o += h.calc(`\\${eq}\\, x = \\vc{${tn(P.c)}}`);
          o += S.length ? h.p(`V intervale $\\langle ${tn(lo)}^\\circ;\\ ${tn(hi)}^\\circ)$: $x \\in \\{${list}\\}$`) : h.pill("žiadne riešenie", "down");
          if(S.length) o += h.pill(`${S.length} ${S.length === 1 ? "riešenie" : S.length < 5 ? "riešenia" : "riešení"} · perióda ${eq === "tg" ? 180 : 360}°`, "ok");
        }
        return o;
      }
    };
  }
});

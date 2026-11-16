/* ============================================================
   TOOL: derivacia — the derivative on a graph: secant turning into a tangent, the tangent line and its
   equation, where a function rises and falls, Newton's method, limits. JSXGraph board.
   cfg:
     f        "x^2/2"        the function of x (typed on the tool's own page)
     typ      "secna"        points A [x0; f(x0)] and B [x0 + h; f(x0 + h)]: slope of the secant → slope of the tangent as h → 0
                             switch dot (the tangent is drawn too)
              "dotycnica"    the tangent at x0 with its equation; switch der (the graph of f′ with the point [x0; f′(x0)])
              "priebeh"      rising / falling marked on the x-axis, stationary points named; switch der
              "newton"       Newton's method from x0, n steps drawn
              "limita"       x approaches x0 from both sides (distance h): values of f, the limit, continuity;
                             inf:true → x grows without bound instead (slider x0 is then that x)
     x0, h, n   a number or {v, min, max, step, lock};  on / toggles / free / lock / hide as in toolParams
     view     [left, top, right, bottom];  tick, aspect as in graf;  apart:true scales the axes separately (give tick:[x, y])
     en       true           English texts (theory of the Danish topics)
     out(P, h, st)     h.der = {x0, y0, m (f′(x0)), q (tangent: y = m·x + q), sec (slope of the secant), stac:[{x, y, kind}], xs:[Newton iterates], L (limit), spojita}
   ============================================================ */
defTool("derivacia", {
  name:"Derivácia na grafe",
  area:"Matematická analýza",
  desc:"Sečnica prechádza do dotyčnice, rovnica dotyčnice, rast a klesanie, Newtonova metóda a limita.",
  topics:["c1", "c2", "c4", "c5", "c6", "c7"],
  presets:[
    {name:"Sečnica a dotyčnica", cfg:{typ:"secna"}, tip:"Zmenšuj $h$: bod $B$ sa blíži k $A$ a sečnica prechádza do dotyčnice. Jej smernica je derivácia."},
    {name:"Rovnica dotyčnice", cfg:{typ:"dotycnica"}, tip:"Dotyčnica v bode $x_0$ má smernicu $f'(x_0)$. Funkciu môžeš prepísať."},
    {name:"Graf derivácie", cfg:{typ:"dotycnica", f:"sin(x)", view:[-7, 3, 7, -3], on:{der:true}}, tip:"Kde $f$ rastie, je $f'$ kladná. Kde má $f$ vrchol, pretína $f'$ os $x$."},
    {name:"Rast, klesanie, extrémy", cfg:{typ:"priebeh", on:{der:true}}, tip:"Znamienko derivácie určuje, či funkcia rastie alebo klesá. Stacionárne body sú tam, kde $f'(x) = 0$."},
    {name:"Newtonova metóda", cfg:{typ:"newton"}, tip:"Z bodu na grafe choď po dotyčnici k osi $x$. Každý krok je bližšie ku koreňu."},
    {name:"Limita v bode", cfg:{typ:"limita"}, tip:"Zmenšuj $\\delta$: hodnoty funkcie z oboch strán sa blížia k tomu istému číslu, hoci v bode samom nie je definovaná."},
    {name:"Limita v nekonečne", cfg:{typ:"limita", inf:true, f:"(2x + 1)/(x + 2)", view:[-1, 4, 30, -1], apart:true, tick:[5, 1], aspect:"16/10"}, tip:"Zväčšuj $x$: graf sa pritíska k vodorovnej asymptote."}
  ],
  help:"Funkciu píš ako v nástroji Graf funkcie: `x^3/3 - x`, `sin(x)`, `sqrt(x)`, `exp(-x)`, `ln(x)`, `(x^2 - 1)/(x - 1)`.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = ["secna", "dotycnica", "priebeh", "newton", "limita"].includes(cfg.typ) ? cfg.typ : "secna";
    const src = cfg.f || {secna:"x^2/2", dotycnica:"x^3/4 - x", priebeh:"x^3/3 - x", newton:"x^2 - 2", limita:"(x^2 - 1)/(x - 1)"}[typ];
    const E = mathExpr(src, []), f = x => E.f({x}), d = x => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
    const view = cfg.view || (typ === "newton" ? [-1, 9, 5, -3] : [-5, 5, 5, -5]), inf = typ === "limita" && cfg.inf;
    const apart = cfg.apart != null ? cfg.apart : typ === "newton" && !cfg.view;
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const x0def = {secna:1, dotycnica:2, priebeh:-2, newton:3, limita:1}[typ];
    const defs = {
      x0:inf ? {v:10, min:1, max:Math.max(20, view[2]), step:1, color:"a", name:"x"} : {v:x0def, min:Math.ceil(view[0]), max:Math.floor(view[2]), step:typ === "newton" ? .5 : .1, color:"a", name:"x₀"},
      h:typ === "secna" ? {v:1.5, min:-2, max:2, step:.1, color:"b", note:T("vzdialenosť bodu B", "distance of B")} : typ === "limita" && !inf ? {v:1, min:.05, max:2, step:.05, color:"b", name:"δ", note:T("vzdialenosť od x₀", "distance from x₀")} : null,
      n:typ === "newton" ? {v:3, min:1, max:6, step:1, color:"b", note:T("počet krokov", "number of steps")} : null,
      dot:typ === "secna" ? ck(T("Dotyčnica v bode A", "Tangent at A"), "a") : null,
      der:typ === "dotycnica" || typ === "priebeh" ? ck(T("Graf derivácie f′", "Graph of the derivative f′"), "c") : null
    };
    const params = toolParams(defs, cfg, env);
    /* stationary points in view: where f′ changes sign or touches zero */
    const stac = findRoots(d, view[0], view[2]).filter(x => isFinite(f(x))).map(x => {
      const l = d(x - .05), r = d(x + .05);
      return {x, y:f(x), kind:l > 0 && r < 0 ? "max" : l < 0 && r > 0 ? "min" : "sedlo"};
    });
    const newton = P => { const xs = [P.x0]; for(let k = 0; k < 6; k++){ const x = xs[k], m = d(x); xs.push(Math.abs(m) < 1e-9 ? NaN : x - f(x) / m); } return xs; };
    const limit = a => {
      if(inf){ const v = f(1e7), w = f(1e9); return Math.abs(v - w) < 1e-4 * Math.max(1, Math.abs(v)) ? v : NaN; }
      const l = f(a - 1e-6), r = f(a + 1e-6);
      return isFinite(l) && isFinite(r) && Math.abs(l - r) < 1e-3 * Math.max(1, Math.abs(l)) ? (l + r) / 2 : NaN;
    };
    const sub = k => "₀₁₂₃₄₅₆"[k];

    return {
      params,
      board:{bbox:view, tick:cfg.tick || (apart && !cfg.view ? [1, 2] : 1), free:!!apart, aspect:cfg.aspect || "1/1"},
      inputs:[{label:"f(x) =", value:src, apply(text){ const e = mathExpr(text, []); return e.ok && e.vars.every(v => ["x", "pi", "e"].includes(v)) ? Object.assign({}, cfg, {f:text}) : {error:e.err || T("Funkcia smie obsahovať len premennú x.", "Only the variable x may be used.")}; }}],
      draw(g, P){
        const fx = p => f(p.x0);
        g.fn(x => f(x), "ink");
        if(typ === "secna"){
          const bx = p => p.x0 + p.h;
          g.line([p => p.dot || !p.h ? p.x0 : NaN, fx], [p => p.x0 + 1, p => f(p.x0) + d(p.x0)], "a", {dash:2});
          g.line([p => p.h ? p.x0 : NaN, fx], [bx, p => f(bx(p))], "d", {strokeWidth:2});
          g.seg([p => p.x0, fx], [bx, fx], "b", {dash:2});
          g.seg([bx, fx], [bx, p => f(bx(p))], "c", {dash:2});
          g.txt(p => p.x0 + p.h / 2, fx, "Δx", "b", {at:"b", if:p => Math.abs(p.h) > .3});
          g.txt(bx, p => (f(p.x0) + f(bx(p))) / 2, "Δy", "c", {at:"r", if:p => Math.abs(p.h) > .3});
          g.pt(bx, p => f(bx(p)), "d", {label:"B", at:"tl", if:p => p.h !== 0});
          g.pt(p => p.x0, fx, "a", {label:"A", at:"br"});
        } else if(typ === "dotycnica"){
          g.fn((x, p) => p.der ? d(x) : NaN, "c", {dash:2, strokeWidth:2});
          g.line([p => p.x0, fx], [p => p.x0 + 1, p => f(p.x0) + d(p.x0)], "a", {strokeWidth:2});
          g.seg([p => p.der ? p.x0 : NaN, fx], [p => p.x0, p => d(p.x0)], "soft", {dash:2, strokeWidth:1.2});
          g.pt(p => p.x0, p => d(p.x0), "c", {if:"der", label:"f′(x₀)", at:"r"});
          g.pt(p => p.x0, fx, "a", {label:"T", at:"tl"});
        } else if(typ === "priebeh"){
          g.fn((x, p) => p.der ? d(x) : NaN, "c", {dash:2, strokeWidth:2});
          const cuts = [view[0], ...stac.map(s => s.x), view[2]];
          for(let i = 0; i + 1 < cuts.length; i++){
            const m = d((cuts[i] + cuts[i + 1]) / 2);
            if(isFinite(m) && Math.abs(m) > 1e-9) g.seg([cuts[i], 0], [cuts[i + 1], 0], m > 0 ? "ok" : "warn", {strokeWidth:6, strokeOpacity:.55});
          }
          stac.forEach(s => g.pt(s.x, s.y, s.kind === "sedlo" ? "soft" : "d", {label:s.kind === "sedlo" ? T("sedlo", "saddle") : s.kind, at:s.kind === "max" ? "t" : "b"}));
          g.seg([p => p.x0 - .8, p => f(p.x0) - .8 * d(p.x0)], [p => p.x0 + .8, p => f(p.x0) + .8 * d(p.x0)], "a", {strokeWidth:2.4});
          g.pt(p => p.x0, fx, "a");
        } else if(typ === "newton"){
          for(let k = 0; k < 6; k++){
            const x = p => newton(p)[k], on = p => p.n > k;
            g.seg([p => on(p) ? x(p) : NaN, 0], [x, p => f(x(p))], "soft", {dash:2, strokeWidth:1.3});
            g.seg([p => on(p) ? x(p) : NaN, p => f(x(p))], [p => newton(p)[k + 1], 0], "d", {strokeWidth:2});
            g.pt(x, p => f(x(p)), "d", {if:on, size:3});
          }
          for(let k = 0; k <= 6; k++) g.pt(p => newton(p)[k], 0, k ? "b" : "a", {if:p => p.n >= k, label:"x" + sub(k), at:k % 2 ? "b" : "t", size:k ? 3.5 : 4.5});
        } else if(inf){
          g.line([0, p => limit()], [1, p => limit()], "d", {dash:2});
          g.pt(p => p.x0, fx, "a", {label:p => `f(${fmtN(p.x0)}) = ${fmtN(f(p.x0), 4)}`, at:"t"});
        } else {
          g.line([p => p.x0, 0], [p => p.x0, 1], "soft", {dash:2, strokeWidth:1.2});
          g.pt(p => p.x0 - p.h, p => f(p.x0 - p.h), "b", {label:T("zľava", "from the left"), at:"tl"});
          g.pt(p => p.x0 + p.h, p => f(p.x0 + p.h), "d", {label:T("sprava", "from the right"), at:"br"});
          g.pt(p => p.x0, p => limit(p.x0), "a", {open:true, if:p => !(Math.abs(f(p.x0) - limit(p.x0)) < 1e-6)});
          g.pt(p => p.x0, fx, "a", {if:p => isFinite(f(p.x0))});
        }
      },
      out(P, h, st){
        const tn = h.tn, x0 = P.x0, y0 = f(x0), m = d(x0), q = y0 - m * x0, ftex = exprShow(src, {}, {}, []);
        const r = h.der = {x0, y0, m, q, stac};
        if(typ === "secna") r.sec = P.h ? (f(x0 + P.h) - y0) / P.h : NaN;
        if(typ === "newton") r.xs = newton(P).slice(0, P.n + 1);
        if(typ === "limita"){ r.L = limit(x0); r.spojita = !inf && isFinite(r.L) && Math.abs(y0 - r.L) < 1e-6; }
        if(cfg.out) return cfg.out(P, h, st);
        const head = h.calc(`f(x) = ${ftex}`), pm = v => v < 0 ? `(${tn(v)})` : tn(v);
        if(typ === "secna") return head
          + (P.h ? h.calc(`\\dfrac{\\vc{\\Delta y}}{\\vb{\\Delta x}} = \\dfrac{f(${tn(x0 + P.h)}) - f(${tn(x0)})}{\\vb{${tn(P.h)}}} = \\dfrac{${tn(f(x0 + P.h) - y0, 3)}}{${tn(P.h)}} = \\vd{${tn(r.sec, 3)}}`)
            : h.p(T("Pre $h = 0$ body splynú a podiel je $\\tfrac{0}{0}$. Zmysel má len limita.", "For $h = 0$ the points merge and the quotient is $\\tfrac{0}{0}$. Only the limit makes sense.")))
          + h.calc(`f'(\\va{${tn(x0)}}) = \\lim_{h \\to 0} \\dfrac{f(x_0 + h) - f(x_0)}{h} = \\va{${tn(m, 3)}}`)
          + h.p(T("Čím menšie $h$, tým bližšie je smernica sečnice k smernici dotyčnice.", "The smaller $h$ is, the closer the slope of the secant gets to the slope of the tangent."));
        if(typ === "dotycnica") return head + h.calc(`f(\\va{${tn(x0)}}) = ${tn(y0, 3)}, \\qquad f'(\\va{${tn(x0)}}) = \\vd{${tn(m, 3)}}`)
          + h.calc(`y = \\vd{${tn(m, 3)}}\\,(x - ${pm(x0)}) + ${pm(round2(y0 * 10) / 10 === y0 ? y0 : Math.round(y0 * 1000) / 1000)}`)
          + h.calc(`y = ${linTex([[Math.round(m * 1000) / 1000, "x"], [Math.round(q * 1000) / 1000, ""]], v => texN(v, 3))}`)
          + (P.der ? h.p(T("Čiarkovaná krivka je $f'$: jej hodnota v $x_0$ je smernica dotyčnice.", "The dashed curve is $f'$: its value at $x_0$ is the slope of the tangent.")) : "");
        if(typ === "priebeh") return head
          + (stac.length ? h.p(T("Stacionárne body ($f'(x) = 0$): ", "Stationary points ($f'(x) = 0$): ") + stac.map(s => `$x = ${tn(s.x)}$ (${s.kind === "sedlo" ? T("sedlo", "saddle") : s.kind})`).join(", ")) : h.p(T("V zobrazenej časti nie je žiadny stacionárny bod.", "No stationary point in view.")))
          + h.calc(`f'(\\va{${tn(x0)}}) = ${tn(m, 3)}`) + h.pill(Math.abs(m) < 1e-6 ? T("dotyčnica je vodorovná", "the tangent is horizontal") : m > 0 ? T("f tu rastie", "f is increasing here") : T("f tu klesá", "f is decreasing here"), Math.abs(m) < 1e-6 ? "flat" : m > 0 ? "up" : "down")
          + h.p(T("Na osi $x$: zelená = rastie ($f' > 0$), červená = klesá ($f' < 0$).", "On the $x$-axis: green = increasing ($f' > 0$), red = decreasing ($f' < 0$)."));
        if(typ === "newton"){
          const xs = newton(P), rows = xs.slice(0, P.n + 1).map((x, k) => `<tr><td class="m">${k}</td><td>${fmtN(x, 6)}</td><td>${isFinite(x) ? fmtN(f(x), 6) : ""}</td></tr>`).join("");
          return head + h.calc(`x_{n+1} = x_n - \\dfrac{f(x_n)}{f'(x_n)}`)
            + `<div class="tw-tab"><table><tr><th class="m">n</th><th>${tex("x_n")}</th><th>${tex("f(x_n)")}</th></tr>${rows}</table></div>`
            + (xs.slice(0, P.n + 1).every(isFinite) ? "" : h.pill(T("dotyčnica je vodorovná, metóda zlyhá", "horizontal tangent: the method fails"), "down"));
        }
        if(inf){
          const rows = [10, 100, 1000, 10000].map(x => `<tr><td>${fmtN(x)}</td><td>${fmtN(f(x), 5)}</td></tr>`).join("");
          return head + `<div class="tw-tab"><table><tr><th>x</th><th>f(x)</th></tr>${rows}</table></div>`
            + (isFinite(r.L) ? h.calc(`\\lim_{x \\to \\infty} f(x) = \\vd{${tn(r.L, 3)}}`) + h.p(T("Graf sa blíži k vodorovnej asymptote.", "The graph approaches a horizontal asymptote.")) : h.pill(T("konečná limita neexistuje", "no finite limit"), "down"));
        }
        const rows = [1, .1, .01, .001].map(e => `<tr><td>${fmtN(e, 3)}</td><td class="cb">${fmtN(f(x0 - e), 5)}</td><td class="cd">${fmtN(f(x0 + e), 5)}</td></tr>`).join("");
        return head + `<div class="tw-tab"><table><tr><th>δ</th><th>f(x₀ − δ)</th><th>f(x₀ + δ)</th></tr>${rows}</table></div>`
          + (isFinite(r.L) ? h.calc(`\\lim_{x \\to ${tn(x0)}} f(x) = \\va{${tn(r.L, 3)}}`) : h.pill(T("limita v tomto bode neexistuje", "the limit does not exist here"), "down"))
          + (isFinite(r.L) ? h.pill(r.spojita ? T("f je v tomto bode spojitá", "f is continuous here") : isFinite(y0) ? T("f(x₀) sa nerovná limite: nespojitá", "f(x₀) differs from the limit: not continuous") : T("f(x₀) nie je definované: diera v grafe", "f(x₀) is not defined: a hole in the graph"), r.spojita ? "ok" : "flat") : "");
      }
    };
  }
});

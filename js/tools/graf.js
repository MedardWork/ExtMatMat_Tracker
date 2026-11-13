/* ============================================================
   TOOL: graf — graphs of functions with parameters
   cfg:
     fns     ["k*x+q", {f:"x^2", color:"c", dash:true, thin:true, dom:[0, 20], name:"A", label:"A"}]
             ghost:true marks a helper curve (not named, not listed); lhs:"y" sets the left side of its equation
     params  {k:{v:1, min:-3, max:3, step:.5, lock:true, color:"a", note:"smernica"}}
             left out → every letter in the functions except x becomes a slider
     points  {A:[1, 2], B:[3, 8]}      draggable; use Ax, Ay, Bx, By in expressions
     view    [left, top, right, bottom]   tick, free (axes scaled separately), axes:["km","€"], aspect:"4/3"
     show    things drawn on top, coordinates are numbers or expressions:
               {pt:[x, y], color, label:"[0; {q}]", at:"tr", if:"k != 0"…}
               {seg:[[x1,y1],[x2,y2]], color, dash, w}      {poly:[[x,y],…], color}
               {text:[x, y], s:"Δx = {Bx-Ax}", color, at}   {vline:x, color}   {hline:y}   {drop:[x, y], color}
               {curve:["3cos(t)", "3sin(t)"], t:[0, "2pi"], color, dash}   a curve given by x(t), y(t)
               pt takes open:true for a point that is left out (drawn hollow)
               {step:0, at:0, color:"a"}        the slope stair on function 0: one right, k up
               {target:[2, 5], fn:0, label:"A [2; 5]"}     turns green when the graph passes through
               {roots:0}  {yint:0}  {turns:0}  {meet:[0, 1]}      found numerically, redrawn as you move
     auto    {roots, yint, turns, meet}   the same as switches (this is what the full page uses)
     draw(g, P, st), out(P, h, st)        escape hatches for theory; h.eq(i) is function i as TeX
   ============================================================ */
defTool("graf", {
  name:"Graf funkcie",
  area:"Funkcie",
  desc:"Napíš funkciu, pridaj do nej parametre a sleduj, čo ktorý robí s grafom.",
  topics:["a21", "a22"],
  presets:[
    {name:"Lineárna", cfg:{fns:["k*x+q"], params:{k:{v:1, min:-4, max:4, step:.5, color:"a", note:"smernica"}, q:{v:1, min:-5, max:5, step:.5, color:"b", note:"posun"}}}},
    {name:"Kvadratická", cfg:{fns:["a*x^2+b*x+c"], params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}, b:{v:-2, min:-6, max:6, step:.5, color:"b"}, c:{v:-3, min:-6, max:6, step:.5, color:"d"}}}},
    {name:"Vrcholový tvar", cfg:{fns:["a*(x-m)^2+n"], params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}, m:{v:1, min:-5, max:5, step:.5, color:"b"}, n:{v:-2, min:-5, max:5, step:.5, color:"d"}}}},
    {name:"Dve funkcie", cfg:{fns:["x^2-3", "k*x+1"], params:{k:{v:1, min:-3, max:3, step:.5, color:"a"}}, on:{meet:true}}},
    {name:"Mocninová", cfg:{fns:["x^n"], params:{n:{v:3, min:-3, max:5, step:1, color:"a"}}}},
    {name:"Exponenciálna", cfg:{fns:["a^x"], params:{a:{v:2, min:.2, max:4, step:.1, color:"a", note:"základ"}}, view:[-5, 8, 5, -2]}},
    {name:"Sínus", cfg:{fns:["a*sin(b*x)"], params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}, b:{v:1, min:.5, max:4, step:.5, color:"b"}}, view:[-7, 4, 7, -4]}}
  ],

  help:`Funkciu píš ako na kalkulačke: \`2x + 1\`, \`x^2 - 4\`, \`a*(x-m)^2 + n\`, \`sin(x)\`, \`sqrt(x)\`, \`|x - 2|\`, \`1/x\`.

- Každé písmeno okrem \`x\` sa stane posuvníkom.
- Funkcie: \`sin\`, \`cos\`, \`tg\`, \`cotg\`, \`sqrt\`, \`abs\`, \`ln\`, \`log\` (dekadický), \`exp\`. Konštanty \`pi\` a \`e\`.
- Graf posúvaš ťahaním, približuješ tlačidlami v rohu alebo kolieskom so stlačeným Shift.`,

  /* f: a*x^2 + 1 / g: x / a: 2 [-5, 5] / os x: -6 6 / os y: -4 8 / ukaz: nulove body, vrcholy, priesecniky */
  fromText(kv){
    const cfg = {fns:[], auto:true, on:{}}, params = {};
    let xs = null, ys = null;
    const PICK = ["a", "b", "d", "c"];
    kv.forEach(([k, v]) => {
      const key = norm(k);
      if(/^[fgh]$/.test(key)){ if(v) cfg.fns.push(v); }
      else if(key === "os x") xs = toolNums(v);
      else if(key === "os y") ys = toolNums(v);
      else if(key === "ukaz") toolWords(v).forEach(w => {
        if(/nulov|os x/.test(w)) cfg.on.roots = true;
        else if(/os y/.test(w)) cfg.on.yint = true;
        else if(/vrchol|extrem/.test(w)) cfg.on.turns = true;
        else if(/priesecnik/.test(w)) cfg.on.meet = true;
      });
      else if(/^[a-zA-Z]\d*$/.test(k)){
        const n = toolNums(v);
        if(!n.length) return;
        const span = Math.max(5, Math.abs(n[0]) * 2);
        params[k] = {v:n[0], min:n.length > 2 ? n[1] : -span, max:n.length > 2 ? n[2] : span, step:n[3] || .5, color:PICK[Object.keys(params).length % 4]};
      }
    });
    if(!cfg.fns.length) cfg.fns.push("x");
    /* sliders for every letter used, whether or not the note gave it a value */
    cfg.fns.forEach(f => mathExpr(f, []).vars.forEach(v => {
      if(v !== "x" && v !== "pi" && v !== "e" && !params[v]) params[v] = {v:1, min:-5, max:5, step:.5, color:PICK[Object.keys(params).length % 4]};
    }));
    for(const k in params) if(!cfg.fns.some(f => mathExpr(f, []).vars.includes(k))) delete params[k];
    cfg.params = params;
    if(xs && xs.length > 1 && ys && ys.length > 1 && xs[0] < xs[1] && ys[0] < ys[1]) cfg.view = [xs[0], ys[1], xs[1], ys[0]];
    return cfg;
  },
  toText(st){
    const w = st.w, out = [];
    (w.inputs || []).forEach((x, i) => { if(x.value) out.push(`${"fgh"[i]}: ${x.value}`); });
    for(const k in w.params){
      const p = w.params[k];
      if(p.type !== "check") out.push(`${k}: ${toolNum(st.P[k])} [${toolNum(p.min)}, ${toolNum(p.max)}, ${toolNum(p.step || 1)}]`);
    }
    if(st.board){
      const b = st.board.getBoundingBox();
      out.push(`os x: ${toolNum(b[0])} ${toolNum(b[2])}`, `os y: ${toolNum(b[3])} ${toolNum(b[1])}`);
    }
    const show = [["_roots", "nulové body"], ["_yint", "os y"], ["_turns", "vrcholy"], ["_meet", "priesečníky"]].filter(x => st.P[x[0]]).map(x => x[1]);
    if(show.length) out.push(`ukaz: ${show.join(", ")}`);
    return out.join("\n");
  },

  make(cfg, env){
    const fns = (cfg.fns || ["x"]).map(f => typeof f === "object" ? Object.assign({}, f) : {f});
    const points = cfg.points || null;
    const ptNames = Object.keys(points || {}).flatMap(n => [n + "x", n + "y"]);
    const PICK = ["a", "b", "d", "c"];

    let params = cfg.params ? Object.assign({}, cfg.params) : null;
    if(!params){
      params = {};
      fns.forEach(fn => {
        if(typeof fn.f !== "string") return;
        mathExpr(fn.f, ptNames).vars.forEach(v => {
          if(v === "x" || v === "pi" || v === "e" || ptNames.includes(v) || params[v]) return;
          params[v] = {v:1, min:-5, max:5, step:.5, color:PICK[Object.keys(params).length % 4]};
        });
      });
    }
    const names = [...Object.keys(params), ...ptNames];
    const colors = {};
    for(const k in params) if(params[k].color) colors[k] = params[k].color;

    /* switches for the features found numerically */
    const auto = env.full || cfg.auto;
    const on = Object.assign({}, cfg.on, typeof cfg.auto === "object" ? cfg.auto : null);
    if(auto){
      const sw = (id, name) => { params["_" + id] = {type:"check", v:!!on[id], name, lock:false}; };
      sw("roots", "Priesečníky s osou x");
      sw("yint", "Priesečník s osou y");
      sw("turns", "Vrcholy (maximá a minimá)");
      if(fns.length > 1) sw("meet", "Priesečníky grafov");
    }

    const E = fns.map(fn => typeof fn.f === "function" ? null : mathExpr(fn.f, names));
    const real = fns.filter(fn => !fn.ghost).length;
    const lhs = i => fns[i].lhs || (fns[i].name ? `${fns[i].name}(x)` : real > 1 ? `${"fgh"[i] || "f"}(x)` : "y");
    const eq = (i, P) => E[i] && E[i].ok ? `${lhs(i)} = ${exprShow(fns[i].f, P, colors, names)}` : "";
    const color = i => fns[i].color || (i === 0 ? "ink" : i === 1 ? "c" : "d");

    /* everything found numerically for the current values and the visible part of the plane */
    const scan = st => toolDerive(st, "scan", () => {
      const bb = st.board ? st.board.getBoundingBox() : (cfg.view || [-6, 6, 6, -6]);
      const lo = bb[0], hi = bb[2];
      const F = fns.map((fn, i) => {
        const s = Object.create(st.P);
        return typeof fn.f === "function" ? x => fn.f(x, st.P) : x => { s.x = x; return E[i].f(s); };
      });
      const dom = (i, x) => !fns[i].dom || (x >= toolVal(fns[i].dom[0], st)() - 1e-9 && x <= toolVal(fns[i].dom[1], st)() + 1e-9);
      const meets = [];
      for(let i = 0; i < F.length; i++) for(let j = i + 1; j < F.length; j++)
        findRoots(x => F[i](x) - F[j](x), lo, hi).forEach(x => { if(dom(i, x) && dom(j, x)) meets.push({i, j, x, y:F[i](x)}); });
      return {
        F, lo, hi,
        roots:F.map((f, i) => findRoots(f, lo, hi).filter(x => dom(i, x))),
        turns:F.map((f, i) => findTurns(f, lo, hi).filter(t => dom(i, t.x))),
        yint:F.map(f => f(0)),
        meets
      };
    });

    function feature(g, s, P, st){
      const C = g.C, V = g.V;
      const F = i => x => scan(st).F[i](x);
      if(s.pt) return g.pt(s.pt[0], s.pt[1], s.color || "ink", s);
      if(s.seg) return g.seg(s.seg[0], s.seg[1], s.color || "soft", Object.assign({strokeWidth:s.w || 2, dash:s.dash ? 2 : 0}, s.if != null ? {if:s.if} : null));
      if(s.poly) return g.poly(s.poly, s.color || "c");
      if(s.text) return g.txt(s.text[0], s.text[1], s.s, s.color || "ink", Object.assign({if:s.if}, s.at ? {at:s.at} : {anchorX:s.anchor || "middle"}));
      if(s.vline != null){
        const x = V(s.vline);
        return g.line([x, 0], [x, 1], s.color || "soft", {dash:2});
      }
      if(s.hline != null){
        const y = V(s.hline);
        return g.line([0, y], [1, y], s.color || "soft", {dash:2});
      }
      if(s.curve) return g.curve(s.curve[0], s.curve[1], s.t[0], s.t[1], s.color || "c", {dash:s.dash ? 2 : 0, strokeWidth:s.thin ? 1.4 : 2.6});
      if(s.drop){
        const x = V(s.drop[0]), y = V(s.drop[1]);
        g.seg([x, y], [x, 0], s.color || "ok", {dash:2, strokeWidth:1.6});
        g.seg([x, y], [0, y], s.color || "ok", {dash:2, strokeWidth:1.6});
        return;
      }
      if(s.step != null){
        const i = s.step, x0 = V(s.at == null ? 0 : s.at), f = F(i);
        const y0 = () => f(x0()), y1 = () => f(x0() + 1);
        g.seg([x0, y0], [() => x0() + 1, y0], "soft", {dash:2});
        g.seg([() => x0() + 1, y0], [() => x0() + 1, y1], s.color || "a", {strokeWidth:4});
        g.txt(() => x0() + .5, y0, "1", "soft", {at:"b", if:() => y1() >= y0()});
        g.txt(() => x0() + .5, y0, "1", "soft", {at:"t", if:() => y1() < y0()});
        g.txt(() => x0() + 1, () => (y0() + y1()) / 2, s.label || (() => fmtN(y1() - y0())), s.color || "a", {at:"r"});
        return;
      }
      if(s.target){
        const tx = V(s.target[0]), ty = V(s.target[1]), f = F(s.fn || 0);
        const hit = () => Math.abs(f(tx()) - ty()) < 1e-9;
        g.pt(tx, ty, "ink", {size:6, strokeWidth:2.2, fillColor:() => hit() ? C.ok : C.panel, strokeColor:() => hit() ? C.ok : C.ink});
        if(s.label) g.txt(tx, ty, s.label, "ink", {at:s.at || "r"});
        return;
      }
      /* the next ones change in number as you move, so a small pool of points is drawn and the spare ones hidden */
      const pool = (n, get, col, label, at) => {
        for(let k = 0; k < n; k++){
          const X = () => { const v = get()[k]; return v ? v[0] : NaN; }, Y = () => { const v = get()[k]; return v ? v[1] : NaN; };
          g.pt(X, Y, col, {label:label === false ? null : () => `[${fmtN(X())}; ${fmtN(Y())}]`, at});
        }
      };
      const visible = s.if != null ? V(s.if) : () => true;
      if(s.roots != null) return pool(4, () => visible() ? scan(st).roots[s.roots].map(x => [x, 0]) : [], s.color || "c", s.label, s.at || "b");
      if(s.turns != null) return pool(3, () => visible() ? scan(st).turns[s.turns].map(t => [t.x, t.y]) : [], s.color || "a", s.label, s.at || "t");
      if(s.yint != null) return pool(1, () => { const y = scan(st).yint[s.yint]; return visible() && isFinite(y) ? [[0, y]] : []; }, s.color || "b", s.label, s.at || "tr");
      if(s.meet){
        const get = () => visible() ? scan(st).meets.filter(m => m.i === s.meet[0] && m.j === s.meet[1]).map(m => [m.x, m.y]) : [];
        return pool(4, get, s.color || "ok", s.label, s.at || "t");
      }
    }

    return {
      params, points, snap:cfg.snap,
      hint:points ? cfg.dragHint || `Body ${Object.keys(points).map(n => `**${n}**`).join(" a ")} sa dajú ťahať po mriežke.` : null,
      board:{bbox:cfg.view || [-6, 6, 6, -6], tick:cfg.tick || 1, free:cfg.free, axes:cfg.axes, aspect:cfg.aspect},
      inputs:[0, 1, 2].filter(i => i <= fns.length && (i < fns.length ? typeof fns[i].f === "string" && !fns[i].ghost : true)).map(i => ({
        label:`$${"fgh"[i]}(x) =$`,
        value:fns[i] ? fns[i].f : "",
        apply(text){
          const list = fns.filter(fn => !fn.ghost).map(fn => fn.f).filter(f => typeof f === "string");
          if(text.trim()) list[i] = text.trim(); else list.splice(i, 1);
          if(!list.length) return {error:"Napíš aspoň jednu funkciu, napríklad x^2 − 1."};
          const bad = list.map(f => mathExpr(f, [])).find(e => !e.ok);
          if(bad) return {error:bad.err + "."};
          /* a typed-in function drops the hand-made extras of a theory example — they no longer fit */
          return {fns:list, view:cfg.view, tick:cfg.tick, on:cfg.on, auto:true,
                  params:Object.keys(cfg.params || {}).length && list.every(f => mathExpr(f, []).vars.every(v => v === "x" || (cfg.params || {})[v])) ? cfg.params : undefined};
        }
      })),
      draw(g, P, st){
        fns.forEach((fn, i) => {
          if(E[i] && !E[i].ok) return;
          g.fn(fn.f, color(i), {dash:fn.dash ? 2 : 0, strokeWidth:fn.thin ? 1.4 : 2.6}, fn.dom);
          if(fn.label){
            const bb = cfg.view || [-6, 6, 6, -6], x = fn.labelAt != null ? fn.labelAt : bb[2] - (bb[2] - bb[0]) * .07;
            g.txt(x, () => scan(st).F[i](x), fn.label, color(i), {at:fn.labelSide || "t", fontSize:14});
          }
        });
        (cfg.show || []).forEach(s => feature(g, s, P, st));
        if(auto) fns.forEach((fn, i) => {
          feature(g, {roots:i, if:() => P._roots, color:"c"}, P, st);
          feature(g, {yint:i, if:() => P._yint, color:"b"}, P, st);
          feature(g, {turns:i, if:() => P._turns, color:"a"}, P, st);
        });
        if(auto && fns.length > 1) for(let i = 0; i < fns.length; i++) for(let j = i + 1; j < fns.length; j++) feature(g, {meet:[i, j], if:() => P._meet}, P, st);
        if(cfg.draw) cfg.draw(g, P, st);
      },
      out(P, h, st){
        h.eq = i => eq(i || 0, P);
        h.scan = () => scan(st);
        if(cfg.out) return cfg.out(P, h, st);
        let s = fns.map((fn, i) => fn.ghost ? "" : E[i] && !E[i].ok ? `<div class="tw-err">${esc(E[i].err)}</div>`
          : `<div class="tw-big${i ? " f" + i : ""}">${tex(eq(i, P), false)}</div>`).join("");
        if(!auto) return s;
        const d = scan(st);
        const list = a => a.length ? a.map(v => `$${texN(v)}$`).join(", ") : "žiadne v zobrazenej časti";
        fns.forEach((fn, i) => {
          const tag = fns.length > 1 ? ` (${"fgh"[i]})` : "";
          if(P._roots) s += h.p(`Nulové body${tag}: ${list(d.roots[i])}`);
          if(P._yint && isFinite(d.yint[i])) s += h.p(`Os $y$ pretína${tag} v bode $[0;\\ ${texN(d.yint[i])}]$`);
          if(P._turns) s += h.p(`Vrcholy${tag}: ${d.turns[i].length ? d.turns[i].map(t => `$[${texN(t.x)};\\ ${texN(t.y)}]$ ${t.max ? "maximum" : "minimum"}`).join(", ") : "žiadne v zobrazenej časti"}`);
        });
        if(P._meet) s += h.p(`Priesečníky grafov: ${d.meets.length ? d.meets.map(m => `$[${texN(m.x)};\\ ${texN(m.y)}]$`).join(", ") : "žiadne v zobrazenej časti"}`);
        return s;
      }
    };
  }
});

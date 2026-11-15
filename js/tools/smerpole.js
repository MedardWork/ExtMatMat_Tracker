/* ============================================================
   TOOL: smerpole — a slope field of the differential equation y′ = F(x, y), the solution through a point
   you can drag, and Euler's method step by step. JSXGraph board.
   cfg:
     f        "x - y"        the right-hand side F(x, y); letters other than x, y become sliders (params below)
     params   {k:{v:.5, min:-1, max:1, step:.1, color:"b"}}     as in graf; left out → every other letter gets a slider
     start    [0, 1]         the point A = [x0; y0], the initial condition (draggable; fixed:true pins it)
     on       {pole:true, riesenie:true, euler:false}    what is drawn;  toggles:[…]
     h, n     Euler's step and the number of steps (sliders, shown with euler)
     view     [left, top, right, bottom];  tick, aspect;  apart:true scales the axes separately (give tick:[x, y]);  husto: grid of the field (default = tick)
     en       true           English texts (theory of the Danish topics)
     out(P, h, st)     h.sp = {x0, y0, m (slope at A), eul:[[x, y]…], yE (Euler's last y), yR (the solution's y at the same x), chyba}
   ============================================================ */
defTool("smerpole", {
  name:"Smerové pole a Eulerova metóda",
  area:"Matematická analýza",
  desc:"Diferenciálna rovnica y′ = F(x, y) ako pole smerníc, riešenie cez zvolený bod a Eulerove kroky.",
  topics:["c13", "c14", "c16", "c17"],
  presets:[
    {name:"y′ = x − y", cfg:{f:"x - y"}},
    {name:"Exponenciálny rast y′ = k·y", cfg:{f:"k*y", params:{k:{v:.5, min:-1, max:1, step:.1, color:"b"}}, start:[0, 1]}},
    {name:"y′ = b − a·y", cfg:{f:"b - a*y", params:{b:{v:2, min:0, max:4, step:.5, color:"b"}, a:{v:1, min:.5, max:2, step:.5, color:"d"}}, start:[0, 0], view:[-1, 5, 7, -1]}},
    {name:"Logistický rast", cfg:{f:"a*y*(M - y)", params:{a:{v:.3, min:.1, max:.6, step:.05, color:"b"}, M:{v:4, min:2, max:5, step:.5, color:"d"}}, start:[0, .5], view:[-1, 6, 9, -1]}},
    {name:"Eulerova metóda", cfg:{f:"x - y", start:[0, 1], view:[-1, 4, 5, -1], on:{euler:true}}},
    {name:"Kružnice y′ = −x/y", cfg:{f:"-x/y", start:[0, 3], on:{riesenie:false}}}
  ],
  help:"Pravú stranu píš s premennými `x` a `y`: `x - y`, `k*y`, `y*(1 - y)`, `-x/y`. Bod **A** je začiatočná podmienka, ťahaj ho.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const src = cfg.f || "x - y";
    let user = cfg.params ? Object.assign({}, cfg.params) : null;
    if(!user){ user = {}; mathExpr(src, []).vars.forEach(v => { if(!["x", "y", "pi", "e"].includes(v)) user[v] = {v:1, min:-3, max:3, step:.25, color:"bdc"[Object.keys(user).length % 3]}; }); }
    const names = Object.keys(user), E = mathExpr(src, names), view = cfg.view || [-5, 5, 5, -5], tick = cfg.tick || 1, grid = cfg.husto || (Array.isArray(tick) ? tick : [tick, tick]);
    const ck = (name, color, v) => ({type:"check", v, name, color});
    const eulerOn = !!(cfg.on && cfg.on.euler) || env.full || (cfg.toggles || []).includes("euler");
    const params = toolParams(Object.assign({}, user, {
      pole:ck(T("Smerové pole", "Slope field"), null, true), riesenie:ck(T("Riešenie cez bod A", "Solution through A"), "a", true), euler:ck(T("Eulerova metóda", "Euler's method"), "d", false),
      h:eulerOn ? {v:.5, min:.1, max:1, step:.1, color:"d", note:T("krok", "step")} : null, n:eulerOn ? {v:4, min:1, max:12, step:1, color:"d", note:T("počet krokov", "steps"), plain:true} : null
    }), cfg, env);
    const F = (x, y, P) => { const s = Object.create(P); s.x = x; s.y = y; return E.f(s); };
    const p0 = cfg.start || [0, 1];
    const euler = P => { const pts = [[P.Ax, P.Ay]]; for(let k = 0; k < (P.n || 0); k++){ const [x, y] = pts[k]; pts.push([x + P.h, y + P.h * F(x, y, P)]); } return pts; };
    /* the solution from A to the x wanted, by small Runge–Kutta steps; null once it runs away */
    const rk = (P, to, each) => {
      let x = P.Ax, y = P.Ay;
      const n = Math.max(1, Math.ceil(Math.abs(to - x) / .02)), d = (to - x) / n, span = Math.abs(view[1] - view[3]) * 3;
      for(let i = 0; i < n; i++){
        const k1 = F(x, y, P), k2 = F(x + d / 2, y + d * k1 / 2, P), k3 = F(x + d / 2, y + d * k2 / 2, P), k4 = F(x + d, y + d * k3, P);
        y += d * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += d;
        if(!isFinite(y) || Math.abs(y) > span + Math.abs(view[1]) + Math.abs(view[3])) return null;
        if(each) each(x, y);
      }
      return y;
    };

    return {
      params,
      points:{A:[p0[0], p0[1], {color:"a", fixed:!!cfg.fixed}]},
      snap:cfg.snap || .5,
      board:{bbox:view, tick, free:!!cfg.apart, aspect:cfg.aspect || "1/1"},
      inputs:[{label:"y′ =", value:src, apply(text){ const e = mathExpr(text, []); return e.ok ? Object.assign({}, cfg, {f:text, params:null}) : {error:e.err}; }}],
      draw(g, P){
        const b = g.b, curve = (color, data, o) => { const c = b.create("curve", [[0], [0]], Object.assign({strokeColor:g.col(color), strokeWidth:2.6, highlight:false, fixed:true}, o)); c.updateDataArray = function(){ const d = data(); this.dataX = d.map(p => p[0]); this.dataY = d.map(p => p[1]); }; return c; };
        curve("soft", () => {
          const pts = [];
          if(!P.pole) return [[NaN, NaN]];
          const bb = b.getBoundingBox(), L = .36 * Math.min(grid[0] * b.unitX, grid[1] * b.unitY);
          for(let x = Math.ceil(bb[0] / grid[0]) * grid[0]; x <= bb[2] + 1e-9; x += grid[0]) for(let y = Math.ceil(bb[3] / grid[1]) * grid[1]; y <= bb[1] + 1e-9; y += grid[1]){
            const m = F(x, y, P);
            if(!isFinite(m)){ if(Math.abs(m) === Infinity) pts.push([x, y - L / b.unitY], [x, y + L / b.unitY], [NaN, NaN]); continue; }
            const dx = b.unitX, dy = m * b.unitY, l = Math.hypot(dx, dy), ux = dx / l * L / b.unitX, uy = dy / l * L / b.unitY;
            pts.push([x - ux, y - uy], [x + ux, y + uy], [NaN, NaN]);
          }
          return pts;
        }, {strokeWidth:1.4});
        curve("a", () => {
          if(!P.riesenie) return [[NaN, NaN]];
          const bb = b.getBoundingBox(), left = [], right = [];
          rk(P, bb[0], (x, y) => left.push([x, y]));
          rk(P, bb[2], (x, y) => right.push([x, y]));
          return [...left.reverse(), [P.Ax, P.Ay], ...right];
        });
        curve("d", () => P.euler ? euler(P) : [[NaN, NaN]], {strokeWidth:2});
        for(let k = 1; k <= 12; k++) g.pt(p => euler(p).length > k ? euler(p)[k][0] : NaN, p => euler(p).length > k ? euler(p)[k][1] : NaN, "d", {if:p => p.euler && p.n >= k, size:3});
      },
      out(P, h, st){
        const tn = h.tn, m = F(P.Ax, P.Ay, P), colors = Object.fromEntries(names.map(k => [k, user[k].color])), eul = P.euler ? euler(P) : [];
        const last = eul[eul.length - 1], yR = last ? rk(P, last[0]) : null;
        h.sp = {x0:P.Ax, y0:P.Ay, m, eul, yE:last ? last[1] : null, yR, chyba:last && yR != null ? Math.abs(last[1] - yR) : null};
        if(cfg.out) return cfg.out(P, h, st);
        let o = h.calc(`y' = ${exprShow(src, P, colors, names)}`)
          + h.calc(`\\va{A}[${tn(P.Ax)};\\ ${tn(P.Ay)}]: \\quad y' ${isFinite(m) ? `= ${tn(m, 3)}` : `\\ \\text{${T("nie je definované", "is not defined")}}`}`)
          + h.p(T("Každá čiarka má smernicu, ktorú rovnica predpisuje v danom bode. Riešenie sa ich všade dotýka.", "Each dash has the slope the equation prescribes at that point. A solution is tangent to them everywhere."));
        if(P.euler){
          const rows = eul.map((p, k) => `<tr><td class="m">${k}</td><td>${fmtN(p[0], 3)}</td><td class="cd">${fmtN(p[1], 4)}</td><td>${k < eul.length - 1 ? fmtN(F(p[0], p[1], P), 4) : ""}</td></tr>`).join("");
          o += h.calc(`y_{n+1} = y_n + \\vd{h} \\cdot F(x_n, y_n)`)
            + `<div class="tw-tab"><table><tr><th class="m">n</th><th>${tex("x_n")}</th><th>${tex("y_n")}</th><th>${tex("y'")}</th></tr>${rows}</table></div>`
            + (yR != null && isFinite(last[1]) ? h.p(`${T("Presné riešenie v", "The exact solution at")} $x = ${tn(last[0], 3)}$: $\\va{${tn(yR, 4)}}$, ${T("chyba Eulera", "Euler's error")} $${tn(Math.abs(last[1] - yR), 4)}$.`) : "");
        }
        return o;
      }
    };
  }
});

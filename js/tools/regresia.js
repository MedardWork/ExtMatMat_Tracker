/* ============================================================
   TOOL: regresia — fit a model to data points you can drag: linear, exponential, power, quadratic, sine.
   Residuals, r², a prediction, and semi-log / log-log axes on which exponential / power models turn straight. Plain SVG.
   cfg:
     data     [[1, 2.1], [2, 2.9], …]      the points (typed on the tool's own page)
     model    "lin" (y = a·x + b) | "exp" (y = b·a^x) | "pot" (y = b·x^a) | "kvad" (y = a·x² + b·x + c) | "sin" (y = A·sin(ω·x + φ) + d)
     os       "lin" | "semilog" (y on a logarithmic scale) | "loglog" (both)
     xr, yr   [lo, hi] the axes (left out → fitted to the data once);  drag:false pins the points;  snap:.1
     x        the place of the prediction (slider);  on:{rezidua, graf2 (residual plot), predpoved};  toggles:[…]
     en       true        English texts (theory of the Danish topics)
     out(P, h, st)     h.reg = {ok, a, b, c, d, A, omega, fi, r2, f (the fitted function), res:[y − f(x)…], pred, T2 (doubling time, negative = halving)}
   Helper: regFit(model, data) → the same fit, for theory that wants to compute with it
   ============================================================ */
function linSolve(M, v){
  const n = v.length, A = M.map((r, i) => [...r, v[i]]);
  for(let c = 0; c < n; c++){
    let p = c;
    for(let r = c + 1; r < n; r++) if(Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if(Math.abs(A[p][c]) < 1e-12) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for(let r = 0; r < n; r++) if(r !== c){ const k = A[r][c] / A[c][c]; for(let j = c; j <= n; j++) A[r][j] -= k * A[c][j]; }
  }
  return A.map((r, i) => r[n] / r[i]);
}
/* least squares for y ≈ Σ c_j · basis_j(x) */
function lsq(data, basis){
  const m = basis.length, M = Array.from({length:m}, () => Array(m).fill(0)), v = Array(m).fill(0);
  data.forEach(([x, y]) => { const b = basis.map(f => f(x)); for(let i = 0; i < m; i++){ v[i] += b[i] * y; for(let j = 0; j < m; j++) M[i][j] += b[i] * b[j]; } });
  return linSolve(M, v);
}
function regFit(model, data){
  const bad = {ok:false, f:() => NaN, res:data.map(() => NaN), r2:NaN};
  let r = null;
  if(data.length < 2) return bad;
  if(model === "lin"){ const c = lsq(data, [x => x, () => 1]); if(c) r = {a:c[0], b:c[1], f:x => c[0] * x + c[1]}; }
  else if(model === "kvad"){ const c = data.length > 2 && lsq(data, [x => x * x, x => x, () => 1]); if(c) r = {a:c[0], b:c[1], c:c[2], f:x => c[0] * x * x + c[1] * x + c[2]}; }
  else if(model === "exp"){
    if(data.some(p => p[1] <= 0)) return bad;
    const c = lsq(data.map(p => [p[0], Math.log(p[1])]), [x => x, () => 1]);
    if(c){ const a = Math.exp(c[0]), b = Math.exp(c[1]); r = {a, b, f:x => b * Math.pow(a, x), T2:Math.abs(c[0]) > 1e-12 ? Math.LN2 / c[0] : NaN}; }
  } else if(model === "pot"){
    if(data.some(p => p[0] <= 0 || p[1] <= 0)) return bad;
    const c = lsq(data.map(p => [Math.log(p[0]), Math.log(p[1])]), [x => x, () => 1]);
    if(c){ const a = c[0], b = Math.exp(c[1]); r = {a, b, f:x => b * Math.pow(x, a)}; }
  } else {
    if(data.length < 4) return bad;
    const xs = data.map(p => p[0]), span = Math.max(...xs) - Math.min(...xs) || 1;
    const at = w => { const c = lsq(data, [x => Math.sin(w * x), x => Math.cos(w * x), () => 1]); return c ? {c, sse:data.reduce((s, p) => s + (p[1] - c[0] * Math.sin(w * p[0]) - c[1] * Math.cos(w * p[0]) - c[2]) ** 2, 0)} : {sse:Infinity}; };
    let best = null, bw = 0;
    const w0 = 2 * Math.PI / (2.5 * span), w1 = Math.PI * (data.length - 1) / span / 1.5;
    for(let i = 0; i <= 500; i++){ const w = w0 + (w1 - w0) * i / 500, t = at(w); if(!best || t.sse < best.sse){ best = t; bw = w; } }
    let lo = bw - (w1 - w0) / 500, hi = bw + (w1 - w0) / 500;
    for(let k = 0; k < 40; k++){ const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if(at(m1).sse < at(m2).sse) hi = m2; else lo = m1; }
    bw = (lo + hi) / 2; best = at(bw);
    if(best.c){ const [p, q, d] = best.c, A = Math.hypot(p, q), fi = Math.atan2(q, p); r = {A, omega:bw, fi, d, f:x => A * Math.sin(bw * x + fi) + d}; }
  }
  if(!r) return bad;
  const my = data.reduce((s, p) => s + p[1], 0) / data.length, sst = data.reduce((s, p) => s + (p[1] - my) ** 2, 0);
  r.res = data.map(p => p[1] - r.f(p[0]));
  r.r2 = sst > 1e-12 ? 1 - r.res.reduce((s, e) => s + e * e, 0) / sst : 1;
  r.ok = true;
  return r;
}

defTool("regresia", {
  name:"Regresia: model z údajov",
  area:"Funkcie",
  desc:"Preloženie údajov priamkou, exponenciálou, mocninou, parabolou alebo sínusoidou; reziduá a logaritmické osi.",
  topics:["c31", "c32", "c33", "c34", "c35", "c36"],
  presets:[
    {name:"Lineárna", cfg:{model:"lin", on:{rezidua:true}}, tip:"Ťahaj body alebo napíš vlastné údaje. Priamka je tá, pri ktorej je súčet štvorcov odchýlok najmenší."},
    {name:"Exponenciálna", cfg:{model:"exp", data:[[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]]}, tip:"Základ $a$ hovorí, koľkokrát vzrastie $y$, keď $x$ stúpne o 1. Skús prepnúť model na priamku a porovnaj $r^2$."},
    {name:"Exponenciálna na semilog osiach", cfg:{model:"exp", os:"semilog", data:[[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]]}, tip:"Na zvislej logaritmickej osi ležia body exponenciálneho rastu na priamke. Prepni osi späť na obyčajné."},
    {name:"Mocninová na log-log osiach", cfg:{model:"pot", os:"loglog", data:[[1, 3.1], [2, 8.3], [4, 24.5], [8, 67], [16, 195]]}, tip:"Keď sú obe osi logaritmické, mocninová závislosť je priamka a jej sklon je exponent."},
    {name:"Kvadratická", cfg:{model:"kvad", data:[[0, 1.2], [1, 3.8], [2, 5.1], [3, 5.2], [4, 3.9], [5, 1.1]]}, tip:"Body stúpajú a zasa klesajú: priamka ich nevystihne, parabola áno."},
    {name:"Sínusová", cfg:{model:"sin", data:[[0, 4.1], [2, 6.4], [4, 7.1], [6, 5.8], [8, 3.4], [10, 1.2], [12, .9], [14, 2.7], [16, 5.1], [18, 6.8]]}, tip:"Údaje sa opakujú. Zo sínusoidy prečítaš amplitúdu, periódu aj stredovú hodnotu."},
    {name:"Nevhodný model a reziduá", cfg:{model:"lin", data:[[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]], on:{rezidua:true, graf2:true}}, tip:"Reziduá priamky tvoria oblúk: znamenie, že model nesedí. Prepni model na exponenciálu a oblúk zmizne."}
  ],
  help:"Body sa dajú **ťahať**. Vlastné údaje napíš ako dvojice `x y` oddelené bodkočiarkou: `1 2,1; 2 2,9; 3 4,2`. Model aj osi prepneš tlačidlami nad údajmi, body pritom zostanú.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const model = ["lin", "exp", "pot", "kvad", "sin"].includes(cfg.model) ? cfg.model : "lin";
    const os = ["semilog", "loglog"].includes(cfg.os) ? cfg.os : "lin", logX = os === "loglog", logY = os !== "lin";
    const d0 = (cfg.data || [[1, 2.1], [2, 2.9], [3, 4.2], [4, 4.8], [5, 6.1], [6, 6.8]]).slice(0, 30).map(p => [p[0], p[1]]);
    const nice = (lo, hi, log) => {
      if(log) return [Math.floor(Math.log10(Math.max(1e-9, lo)) + 1e-9), Math.ceil(Math.log10(Math.max(1e-9, hi)) - 1e-9) || 1, 1];
      const span = hi - lo || 1, st = [.1, .2, .5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find(s => span * 1.2 / s <= 9) || span / 6;
      return [Math.floor((lo - span * .06) / st) * st, Math.ceil((hi + span * .06) / st) * st, st];
    };
    const xs = d0.map(p => p[0]), ys = d0.map(p => p[1]);
    const xr = cfg.xr ? [...(logX ? cfg.xr.map(Math.log10) : cfg.xr), nice(...cfg.xr, logX)[2]] : nice(Math.min(...xs), Math.max(...xs), logX);
    const yr = cfg.yr ? [...(logY ? cfg.yr.map(Math.log10) : cfg.yr), nice(...cfg.yr, logY)[2]] : nice(logY ? Math.min(...ys) : Math.min(0, ...ys), Math.max(...ys), logY);
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const xlo = logX ? 10 ** xr[0] : xr[0], xhi = logX ? 10 ** xr[1] : xr[1];
    const params = toolParams({
      rezidua:ck(T("Reziduá (odchýlky od modelu)", "Residuals (deviations from the model)"), "d"), graf2:ck(T("Graf reziduí", "Residual plot"), "d"), predpoved:ck(T("Predpoveď modelu v x", "Prediction of the model at x"), "b"),
      x:{when:P => !!P.predpoved, v:round2((xlo + xhi) / 2), min:round2(xlo), max:round2(xhi + (logX ? 0 : (xhi - xlo) * .5)), step:logX ? 1 : round2((xhi - xlo) / 40) || .1, color:"b"}
    }, cfg, env);
    const W = 560, H = 340, X0 = 50, X1 = W - 16, Y0 = 16;
    const tx = x => logX ? Math.log10(x) : x, ty = y => logY ? Math.log10(y) : y;
    const frame = P => { const Y1 = P.graf2 ? H - 122 : H - 34; return {Y1, X:x => X0 + (X1 - X0) * (tx(x) - xr[0]) / (xr[1] - xr[0]), Y:y => Y1 - (Y1 - Y0) * (ty(y) - yr[0]) / (yr[1] - yr[0])}; };
    const canDrag = st => !st.env.thumb && (cfg.drag !== false || st.open);
    const fit = st => toolDerive(st, "fit", () => regFit(model, st.data.d));
    const sup = n => String(n).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] || (c === "-" ? "⁻" : c)).join("");

    return {
      params, aspect:`${W}/${H}`,
      hint:cfg.drag === false ? null : T("Body sa dajú **ťahať**.", "The points can be **dragged**."),
      init(st){ st.data = {d:d0.map(p => p.slice())}; },
      picks:[
        {name:T("Model", "Model"), opts:T(["priamka", "exponenciála", "mocnina", "parabola", "sínusoida"], ["line", "exponential", "power", "parabola", "sine"]), v:["lin", "exp", "pot", "kvad", "sin"].indexOf(model),
          set:(k, st) => Object.assign({}, cfg, {model:["lin", "exp", "pot", "kvad", "sin"][k], data:st.data.d.map(p => p.slice())})},
        {name:T("Osi", "Axes"), opts:T(["obyčajné", "semilog (log y)", "log-log"], ["plain", "semi-log (log y)", "log-log"]), v:["lin", "semilog", "loglog"].indexOf(os),
          set(k, st){
            if(k > 0 && st.data.d.some(p => p[1] <= 0 || (k === 2 && p[0] <= 0))){ toast(k === 2 ? "Logaritmické osi potrebujú kladné x aj y." : "Logaritmická os potrebuje kladné y."); return null; }
            return Object.assign({}, cfg, {os:["lin", "semilog", "loglog"][k], xr:null, yr:null, data:st.data.d.map(p => p.slice())});
          }}
      ],
      inputs:[{label:T("Body (x y; x y; …)", "Points (x y; x y; …)"), wide:true, value:"", read:st => (st.data ? st.data.d : d0).map(p => `${fmtN(p[0], 4)} ${fmtN(p[1], 4)}`).join("; "),
        apply(text){
          const d = text.split(/[;\n]+/).map(t => t.trim().split(/\s+/).map(v => toolParse(v))).filter(p => p.length === 2 && p.every(v => !isNaN(v))).slice(0, 30);
          return d.length > 1 ? Object.assign({}, cfg, {data:d, xr:null, yr:null}) : {error:T("Napíš aspoň dva body, napríklad 1 2; 2 3,5", "Type at least two points, e.g. 1 2; 2 3,5")};
        }}],
      svg(P, st){
        const thumb = st.env.thumb, r = fit(st), {Y1, X, Y} = frame(P), d = st.data.d;
        let h = "";
        /* grid and numbers: plain steps, or decades with their 2…9 lines */
        const gridAxis = (rng, log, vert) => {
          let s = "";
          const line = (t, cls) => vert ? SV.line(X0, Y1 - (Y1 - Y0) * (t - rng[0]) / (rng[1] - rng[0]), X1, Y1 - (Y1 - Y0) * (t - rng[0]) / (rng[1] - rng[0]), cls) : SV.line(X0 + (X1 - X0) * (t - rng[0]) / (rng[1] - rng[0]), Y0, X0 + (X1 - X0) * (t - rng[0]) / (rng[1] - rng[0]), Y1, cls);
          const label = (t, text) => vert ? SV.text(X0 - 6, Y1 - (Y1 - Y0) * (t - rng[0]) / (rng[1] - rng[0]) + 4, text, "end sm csoft") : SV.text(X0 + (X1 - X0) * (t - rng[0]) / (rng[1] - rng[0]), Y1 + 16, text, "mid sm csoft");
          for(let t = rng[0]; t <= rng[1] + 1e-9; t += rng[2]){
            s += line(t, "s cgrid w1") + (thumb ? "" : label(t, log ? (t >= 0 && t <= 4 ? fmtN(10 ** t) : "10" + sup(t)) : fmtN(t)));
            if(log && t < rng[1]) for(let k = 2; k <= 9; k++) s += line(t + Math.log10(k), "s cgrid w1 re-minor");
          }
          return s;
        };
        h += gridAxis(xr, logX, false) + gridAxis(yr, logY, true) + SV.rect(X0, Y0, X1 - X0, Y1 - Y0, "s w1 csoft");
        if(!logY && yr[0] < 0 && yr[1] > 0) h += SV.line(X0, Y(0), X1, Y(0), "s w1");
        const clipId = `re-clip-${st.n}`;
        h += `<clipPath id="${clipId}"><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}"/></clipPath>`;
        if(r.ok){
          const pts = Array.from({length:201}, (_, i) => { const t = xr[0] + (xr[1] - xr[0]) * i / 200, x = logX ? 10 ** t : t, y = r.f(x); return logY && !(y > 0) ? null : [X(x), Y(y)]; });
          h += `<g clip-path="url(#${clipId})">${SV.path(SV.d(pts), "s ca w3")}${P.rezidua ? d.map((p, i) => SV.line(X(p[0]), Y(p[1]), X(p[0]), Y(logY ? Math.max(1e-9, r.f(p[0])) : r.f(p[0])), "s cd w3")).join("") : ""}</g>`;
          if(P.predpoved && isFinite(r.f(P.x)) && (!logY || r.f(P.x) > 0)){ const px = X(P.x), py = Y(r.f(P.x)); h += SV.path(`M${px} ${Y1}V${py}H${X0}`, "s cb w1 dash") + SV.circle(px, py, 5, "o cb"); }
        }
        d.forEach((p, i) => { if((!logX || p[0] > 0) && (!logY || p[1] > 0)) h += SV.circle(X(p[0]), Y(p[1]), 5.5, "h cink", canDrag(st) ? ` data-drag="${i}"` : ""); });
        if(P.graf2 && r.ok){
          const R0 = H - 92, R1 = H - 14, m = Math.max(1e-9, ...r.res.map(Math.abs)) * 1.15, RY = e => (R0 + R1) / 2 - (R1 - R0) / 2 * e / m;
          h += SV.rect(X0, R0, X1 - X0, R1 - R0, "s w1 csoft") + SV.line(X0, RY(0), X1, RY(0), "s w1") + (thumb ? "" : SV.text(X0 - 6, RY(0) + 4, "0", "end sm csoft") + SV.text(X0 + 6, R0 + 13, T("reziduá", "residuals"), "sm cd"));
          d.forEach((p, i) => { h += SV.line(X(p[0]), RY(0), X(p[0]), RY(r.res[i]), "s cd w3") + SV.circle(X(p[0]), RY(r.res[i]), 3.5, "f cd"); });
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        svgDrag(el, st, (id, x, y) => {
          const {Y1} = frame(st.P), s = cfg.snap || .1, i = Number(id);
          let vx = xr[0] + (x - X0) / (X1 - X0) * (xr[1] - xr[0]), vy = yr[0] + (Y1 - y) / (Y1 - Y0) * (yr[1] - yr[0]);
          vx = Math.max(xr[0], Math.min(xr[1], vx)); vy = Math.max(yr[0], Math.min(yr[1], vy));
          const nx = logX ? Number((10 ** vx).toPrecision(2)) : round2(Math.round(vx / s) * s), ny = logY ? Number((10 ** vy).toPrecision(2)) : round2(Math.round(vy / s) * s);
          if(nx === st.data.d[i][0] && ny === st.data.d[i][1]) return false;
          st.data.d[i] = [nx, ny];
        });
      },
      out(P, h, st){
        const tn = h.tn, r = fit(st), n3 = v => tn(Number(v.toPrecision(4)), 4);
        h.reg = Object.assign({pred:r.ok ? r.f(P.x) : NaN}, r);
        if(cfg.out) return cfg.out(P, h, st);
        if(!r.ok) return h.pill(model === "exp" || model === "pot" ? T("tento model potrebuje kladné hodnoty", "this model needs positive values") : T("na tento model je bodov primálo", "too few points for this model"), "down");
        const sg = v => v < 0 ? `- ${n3(-v)}` : `+ ${n3(v)}`;
        let o = model === "lin" ? h.calc(`y = \\va{${n3(r.a)}}\\,x ${sg(r.b)}`)
          : model === "kvad" ? h.calc(`y = \\va{${n3(r.a)}}\\,x^2 ${sg(r.b)}\\,x ${sg(r.c)}`)
          : model === "exp" ? h.calc(`y = ${n3(r.b)} \\cdot \\va{${n3(r.a)}}^{\\,x}`) + h.p(`${T("Za jednotku $x$ sa $y$ zmení o", "Per unit of $x$, $y$ changes by")} $${tn((r.a - 1) * 100, 1)}\\ \\%$. ${isFinite(r.T2) ? (r.T2 > 0 ? T("Zdvojnásobí sa za", "It doubles in") : T("Na polovicu klesne za", "It halves in")) + ` $${tn(Math.abs(r.T2), 2)}$.` : ""}`)
          : model === "pot" ? h.calc(`y = ${n3(r.b)} \\cdot x^{\\va{${n3(r.a)}}}`) + h.p(`${T("Keď $x$ vzrastie o 1 %, $y$ sa zmení približne o", "When $x$ grows by 1 %, $y$ changes by about")} $${tn(r.a, 2)}\\ \\%$.`)
          : h.calc(`y = \\va{${n3(r.A)}} \\sin(${n3(r.omega)}\\,x ${sg(r.fi)}) ${sg(r.d)}`) + h.p(`${T("Amplitúda", "Amplitude")} $\\va{${tn(r.A, 2)}}$, ${T("perióda", "period")} $\\tfrac{2\\pi}{\\omega} \\doteq ${tn(2 * Math.PI / r.omega, 2)}$, ${T("stredná hodnota", "midline")} $${tn(r.d, 2)}$.`);
        o += h.calc(`r^2 \\doteq ${tn(r.r2, 4)}`);
        if(os !== "lin") o += h.p(os === "semilog" ? T("Na osiach so zvislou logaritmickou stupnicou je exponenciálny model **priamka**.", "With a logarithmic vertical scale an exponential model is a **straight line**.") : T("Keď sú logaritmické obe osi, je mocninový model **priamka**.", "With both scales logarithmic a power model is a **straight line**."));
        if(P.predpoved) o += h.calc(`f(\\vb{${tn(P.x)}}) \\doteq \\vb{${n3(r.f(P.x))}}`) + (P.x > Math.max(...st.data.d.map(p => p[0])) || P.x < Math.min(...st.data.d.map(p => p[0])) ? h.p(T("To je mimo nameraných údajov (extrapolácia): modelu tu treba veriť menej.", "This is outside the measured data (extrapolation): trust the model less here.")) : "");
        if(P.rezidua || P.graf2){
          const big = r.res.reduce((m, e) => Math.abs(e) > Math.abs(m) ? e : m, 0), i = r.res.indexOf(big), runs = r.res.reduce((c, e, k) => k && Math.sign(e) !== Math.sign(r.res[k - 1]) ? c + 1 : c, 1);
          o += h.p(`${T("Najväčšia odchýlka", "Largest deviation")}: $\\vd{${tn(big, 3)}}$ ${T("pri", "at")} $x = ${tn(st.data.d[i][0])}$ (${T("relatívne", "relative")} $${tn(Math.abs(big / (r.f(st.data.d[i][0]) || 1)) * 100, 1)}\\ \\%$).`)
            + (r.res.length >= 6 && runs <= 3 ? h.pill(T("reziduá sa nestriedajú náhodne: systematická odchýlka", "the residuals do not alternate at random: systematic variation"), "flat") : "");
        }
        return o;
      }
    };
  }
});

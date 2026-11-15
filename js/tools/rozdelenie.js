/* ============================================================
   TOOL: rozdelenie — probability distributions: binomial bars, the normal curve, a random variable given
   by a table, and a binomial hypothesis test. Plain SVG.
   cfg:
     typ      "binom"       X ~ b(n, p): the bars for a ≤ X ≤ b are coloured and added up (click a bar to pick one value);
                            switch normal (the normal curve with the same mean and spread laid over)
              "normal"      X ~ N(mu, sigma): the area for a ≤ X ≤ b;  os:[lo, hi] fixes the axis;  switch pravidlo (68–95–99.7 bands)
              "tabulka"     a random variable: x:[0, 1, 2, 3], p:[.1, .3, .4, .2] → expected value, variance, standard deviation
              "test"        binomial test of H0: p = p0 with n tries: critical region for the level alfa, observed x, p-value
                            strana: "obe" (two-sided) | "lava" | "prava"
     n, p, a, b, mu, sigma, alfa, x    a number or {v, min, max, step, lock};  on / toggles / free / lock / hide as in toolParams
     en       true          English texts (theory of the Danish topics)
     out(P, h, st)     h.roz = {p (the probability asked for), mu, sigma, var, K:[kL, kU] (critical region: X ≤ kL or X ≥ kU), pval, zamietni}
   Helpers: binomPmf(n, k, p), normCdf(z)
   ============================================================ */
const binomPmf = (n, k, p) => k < 0 || k > n ? 0 : binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
function normCdf(z){
  const t = 1 / (1 + .2316419 * Math.abs(z)), d = .3989422804 * Math.exp(-z * z / 2);
  const q = d * t * (.31938153 + t * (-.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - q : q;
}

defTool("rozdelenie", {
  name:"Rozdelenia pravdepodobnosti",
  area:"Pravdepodobnosť",
  desc:"Binomické a normálne rozdelenie, náhodná veličina zadaná tabuľkou a test hypotézy o podiele.",
  topics:["b42", "c26", "c27", "c28", "c30"],
  presets:[
    {name:"Binomické rozdelenie", cfg:{typ:"binom"}},
    {name:"Binomické a normálne", cfg:{typ:"binom", n:30, p:.4, a:10, b:14, on:{normal:true}}},
    {name:"Normálne rozdelenie", cfg:{typ:"normal"}},
    {name:"Pravidlo 68–95–99,7", cfg:{typ:"normal", on:{pravidlo:true}}},
    {name:"Náhodná veličina", cfg:{typ:"tabulka"}},
    {name:"Test hypotézy", cfg:{typ:"test"}}
  ],

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = ["binom", "normal", "tabulka", "test"].includes(cfg.typ) ? cfg.typ : "binom";
    const side = ["obe", "lava", "prava"].includes(cfg.strana) ? cfg.strana : "obe";
    const xs = (cfg.x && Array.isArray(cfg.x) ? cfg.x : [0, 1, 2, 3]).slice(0, 12), ps = (cfg.p && Array.isArray(cfg.p) ? cfg.p : [.1, .3, .4, .2]).slice(0, xs.length);
    const num = (v, k) => typeof v === "number" ? v : v && typeof v === "object" && v.v != null ? v.v : k;
    const mu0 = num(cfg.mu, 100), s0 = num(cfg.sigma, 15), axis = cfg.os || [mu0 - 4 * s0, mu0 + 4 * s0], stepN = (axis[1] - axis[0]) / 80;
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const defs = typ === "binom" ? {n:{v:10, min:1, max:40, step:1, color:"d", note:T("počet pokusov", "number of trials")}, p:{v:.5, min:.05, max:.95, step:.05, color:"b", note:T("pravdepodobnosť úspechu", "probability of success")},
          a:{v:3, min:0, max:40, step:1, color:"a", note:T("od", "from")}, b:{v:5, min:0, max:40, step:1, color:"a", note:T("do", "to")}, normal:ck(T("Normálna krivka", "Normal curve"), "c")}
      : typ === "normal" ? {mu:{v:mu0, min:axis[0] + 2 * s0, max:axis[1] - 2 * s0, step:stepN * 2, color:"d", name:"μ", note:T("stredná hodnota", "mean")}, sigma:{v:s0, min:s0 / 3, max:s0 * 1.5, step:s0 / 15, color:"b", name:"σ", note:T("smerodajná odchýlka", "standard deviation")},
          a:{v:mu0 - s0, min:axis[0], max:axis[1], step:stepN, color:"a", note:T("od", "from")}, b:{v:mu0 + s0, min:axis[0], max:axis[1], step:stepN, color:"a", note:T("do", "to")}, pravidlo:ck(T("Pásma 1σ, 2σ, 3σ", "Bands 1σ, 2σ, 3σ"), "c")}
      : typ === "test" ? {n:{v:20, min:5, max:40, step:1, color:"d", note:T("počet pokusov", "number of trials")}, p:{v:.5, min:.05, max:.95, step:.05, color:"b", name:"p₀", note:T("podľa hypotézy", "under the hypothesis")},
          alfa:{v:.05, min:.01, max:.1, step:.01, name:"α", note:T("hladina významnosti", "significance level"), plain:true}, x:{v:15, min:0, max:40, step:1, color:"a", note:T("pozorovaný počet", "observed count")}}
      : {};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 340, X0 = 44, X1 = W - 14, Y0 = 22, Y1 = H - 68;
    const tail = (n, p, lo, hi) => { let s = 0; for(let k = Math.max(0, lo); k <= Math.min(n, hi); k++) s += binomPmf(n, k, p); return s; };
    const test = P => {
      const n = P.n, p = P.p, x = Math.min(P.x, n), al = side === "obe" ? P.alfa / 2 : P.alfa;
      let kL = -1, kU = n + 1;
      if(side !== "prava") while(kL + 1 <= n && tail(n, p, 0, kL + 1) <= al + 1e-12) kL++;
      if(side !== "lava") while(kU - 1 >= 0 && tail(n, p, kU - 1, n) <= al + 1e-12) kU--;
      const left = tail(n, p, 0, x), right = tail(n, p, x, n);
      const pval = side === "lava" ? left : side === "prava" ? right : Math.min(1, 2 * Math.min(left, right));
      return {x, kL, kU, pval, zamietni:x <= kL || x >= kU};
    };
    const yAxis = (top, thumb) => { let h = ""; const st = top > .5 ? .2 : top > .25 ? .1 : top > .1 ? .05 : .02; for(let v = 0; v <= top; v += st) h += SV.line(X0, Y1 - (Y1 - Y0) * v / top, X1, Y1 - (Y1 - Y0) * v / top, "s cgrid w1") + (thumb ? "" : SV.text(X0 - 6, Y1 - (Y1 - Y0) * v / top + 4, fmtN(v), "end sm csoft")); return h; };

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "binom" ? T("**Klikni** na stĺpec: vyberieš jednu hodnotu.", "**Click** a bar to pick one value.") : null,
      inputs:typ === "tabulka" ? [
        {label:T("Hodnoty x", "Values x"), value:xs.map(v => fmtN(v, 4)).join(" "), apply(text){ const v = text.split(/[\s;]+/).map(t => toolParse(t)).filter(n => !isNaN(n)); return v.length ? Object.assign({}, cfg, {x:v, p:v.map((_, i) => ps[i] != null ? ps[i] : 0)}) : {error:T("Napíš aspoň jednu hodnotu.", "Type at least one value.")}; }},
        {label:T("Pravdepodobnosti", "Probabilities"), value:ps.map(v => fmtN(v, 4)).join(" "), apply(text){ const v = text.split(/[\s;]+/).map(t => toolParse(t)).filter(n => !isNaN(n)); return v.length === xs.length ? Object.assign({}, cfg, {p:v}) : {error:T(`Treba ${xs.length} čísel.`, `${xs.length} numbers are needed.`)}; }}] : null,
      svg(P, st){
        const thumb = st.env.thumb;
        let h = "";
        if(typ === "binom" || typ === "test"){
          const n = P.n, p = P.p, pm = Array.from({length:n + 1}, (_, k) => binomPmf(n, k, p)), top = Math.max(...pm) * 1.14, bw = (X1 - X0) / (n + 1), Y = v => Y1 - (Y1 - Y0) * v / top;
          const lo = Math.min(P.a, P.b), hi = Math.max(P.a, P.b), t = typ === "test" ? test(P) : null;
          h += yAxis(top, thumb);
          pm.forEach((v, k) => {
            const x = X0 + k * bw, crit = t && (k <= t.kL || k >= t.kU), c = t ? (crit ? "cno" : "cb") : k >= lo && k <= hi ? "ca" : "cink";
            h += SV.rect(x + bw * .12, Y(v), bw * .76, Y1 - Y(v), `bg ${c} pa-on`, typ === "binom" && !thumb ? ` data-pick="${k}"` : "");
            if(!thumb && (n <= 20 || k % 5 === 0)) h += SV.text(x + bw / 2, Y1 + 16, k, `mid sm ${t && k === t.x ? "ca" : "csoft"}`);
          });
          if(t){ const x = X0 + (t.x + .5) * bw; h += SV.path(`M${x} ${Y1 + 22}l7 11h-14z`, "f ca") + (thumb ? "" : SV.text(x, Y1 + 44, T("pozorované", "observed"), "mid sm ca")); }
          if(typ === "binom" && P.normal){
            const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
            h += SV.path(SV.d(Array.from({length:121}, (_, i) => { const k = -.5 + (n + 1) * i / 120; return [X0 + (k + .5) * bw, Y(Math.exp(-((k - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)))]; })), "s cc");
          }
          h += SV.line(X0, Y1, X1, Y1, "s");
        } else if(typ === "normal"){
          const mu = P.mu, sd = P.sigma, top = 1 / (s0 / 3 * Math.sqrt(2 * Math.PI)) * .62, X = v => X0 + (X1 - X0) * (v - axis[0]) / (axis[1] - axis[0]), Y = v => Y1 - (Y1 - Y0) * Math.min(v, top) / top;
          const pdf = v => Math.exp(-((v - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)), lo = Math.min(P.a, P.b), hi = Math.max(P.a, P.b);
          const run = (a, b, n = 100) => Array.from({length:n + 1}, (_, i) => { const v = a + (b - a) * i / n; return [X(v), Y(pdf(v))]; });
          if(P.pravidlo) [[3, "99,7 %"], [2, "95,4 %"], [1, "68,3 %"]].forEach(([k, t], i) => {
            const a = Math.max(axis[0], mu - k * sd), b = Math.min(axis[1], mu + k * sd);
            h += SV.poly([[X(a), Y1], ...run(a, b, 60), [X(b), Y1]], "bg cc ro-band") + (thumb ? "" : SV.line(X(a), Y1 + 36 + i * 13, X(b), Y1 + 36 + i * 13, "s cc w1") + SV.text(X(mu), Y1 + 40 + i * 13, t, "mid sm cc halo"));
          });
          else h += SV.poly([[X(lo), Y1], ...run(lo, hi, 60), [X(hi), Y1]], "bg ca pa-on");
          h += SV.path(SV.d(run(axis[0], axis[1], 160)), "s") + SV.line(X0, Y1, X1, Y1, "s") + SV.line(X(mu), Y1, X(mu), Y(pdf(mu)), "s cd w1 dash");
          const tk = (axis[1] - axis[0]) / 8;
          if(!thumb) for(let i = 0; i <= 8; i++) h += SV.line(X(axis[0] + i * tk), Y1, X(axis[0] + i * tk), Y1 + 4, "s w1 csoft") + SV.text(X(axis[0] + i * tk), Y1 + 16, fmtN(axis[0] + i * tk, 1), "mid sm csoft");
        } else {
          const mu = xs.reduce((a, x, i) => a + x * ps[i], 0), sd = Math.sqrt(xs.reduce((a, x, i) => a + (x - mu) ** 2 * ps[i], 0));
          const lo = Math.min(...xs), hi = Math.max(...xs), pad = (hi - lo || 1) * .12, X = v => X0 + (X1 - X0) * (v - lo + pad) / (hi - lo + 2 * pad), top = Math.max(...ps) * 1.18, Y = v => Y1 - (Y1 - Y0) * v / top;
          const bw = Math.min(46, (X1 - X0) / (xs.length * 1.6));
          h += yAxis(top, thumb);
          xs.forEach((x, i) => { h += SV.rect(X(x) - bw / 2, Y(ps[i]), bw, Y1 - Y(ps[i]), "bg cb pa-on") + (thumb ? "" : SV.text(X(x), Y1 + 16, fmtN(x), "mid sm") + SV.text(X(x), Y(ps[i]) - 5, fmtN(ps[i], 3), "mid sm cb")); });
          h += SV.line(X0, Y1, X1, Y1, "s") + SV.rect(X(mu - sd), Y1 - 4, X(mu + sd) - X(mu - sd), 8, "bg cc ro-band") + SV.path(`M${X(mu)} ${Y1 + 22}l7 11h-14z`, "f ca") + (thumb ? "" : SV.text(X(mu), Y1 + 44, `E(X) = ${fmtN(mu)}`, "mid sm ca"));
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit) return;
          ["a", "b"].forEach(id => { if(!st.w.params[id].lock || st.open) st.P[id] = Number(hit.dataset.pick); });
          toolCtlSync(st); toolUpdate(st);
        });
      },
      out(P, h, st){
        const tn = h.tn, pc = v => `${tn(v * 100, 1)}\\ \\%`;
        if(typ === "binom"){
          const n = P.n, p = P.p, lo = Math.min(P.a, P.b, n), hi = Math.min(n, Math.max(P.a, P.b)), pr = tail(n, p, lo, hi), mu = n * p, sd = Math.sqrt(n * p * (1 - p));
          h.roz = {p:pr, mu, sigma:sd, var:sd * sd};
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`X \\sim b(\\vd{${n}};\\ \\vb{${tn(p)}})`)
            + (lo === hi ? h.calc(`P(X = \\va{${lo}}) = \\dbinom{${n}}{${lo}} \\cdot ${tn(p)}^{${lo}} \\cdot ${tn(1 - p)}^{${n - lo}} \\doteq \\va{${tn(pr, 4)}}`)
              : h.calc(`P(\\va{${lo}} \\leq X \\leq \\va{${hi}}) = \\sum_{k=${lo}}^{${hi}} P(X = k) \\doteq \\va{${tn(pr, 4)}}`))
            + h.calc(`P(X \\leq ${hi}) \\doteq ${tn(tail(n, p, 0, hi), 4)}`)
            + h.calc(`\\mu = n p = ${tn(mu)}, \\qquad \\sigma = \\sqrt{n p (1 - p)} \\doteq ${tn(sd, 3)}`);
        }
        if(typ === "normal"){
          const lo = Math.min(P.a, P.b), hi = Math.max(P.a, P.b), za = (lo - P.mu) / P.sigma, zb = (hi - P.mu) / P.sigma, pr = normCdf(zb) - normCdf(za);
          h.roz = {p:pr, mu:P.mu, sigma:P.sigma, var:P.sigma ** 2};
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`X \\sim N(\\vd{${tn(P.mu)}};\\ \\vb{${tn(P.sigma)}})`)
            + (P.pravidlo ? h.p(T("V pásme $\\mu \\pm \\sigma$ leží asi 68 % hodnôt, v $\\mu \\pm 2\\sigma$ asi 95 %, v $\\mu \\pm 3\\sigma$ asi 99,7 %.", "About 68 % of the values lie within $\\mu \\pm \\sigma$, about 95 % within $\\mu \\pm 2\\sigma$, about 99.7 % within $\\mu \\pm 3\\sigma$."))
                + h.calc(`\\mu \\pm \\sigma = [${tn(P.mu - P.sigma)};\\ ${tn(P.mu + P.sigma)}]`) + h.calc(`\\mu \\pm 2\\sigma = [${tn(P.mu - 2 * P.sigma)};\\ ${tn(P.mu + 2 * P.sigma)}]`)
              : h.calc(`P(\\va{${tn(lo)}} \\leq X \\leq \\va{${tn(hi)}}) \\doteq \\va{${tn(pr, 4)}}`) + h.p(`${T("To je", "That is")} $${pc(pr)}$ ${T("plochy pod krivkou.", "of the area under the curve.")}`)
                + h.calc(`z = \\dfrac{x - \\mu}{\\sigma}: \\quad ${tn(za)} \\leq z \\leq ${tn(zb)}`));
        }
        if(typ === "tabulka"){
          const mu = xs.reduce((a, x, i) => a + x * ps[i], 0), vr = xs.reduce((a, x, i) => a + (x - mu) ** 2 * ps[i], 0), sum = ps.reduce((a, b) => a + b, 0);
          h.roz = {mu, var:vr, sigma:Math.sqrt(vr), p:sum};
          if(cfg.out) return cfg.out(P, h, st);
          const rows = xs.map((x, i) => `<tr><td>${fmtN(x)}</td><td class="cb">${fmtN(ps[i], 3)}</td><td>${fmtN(x * ps[i], 3)}</td></tr>`).join("");
          return `<div class="tw-tab"><table><tr><th>x</th><th>P(X = x)</th><th>x · P</th></tr>${rows}<tr class="sum"><td></td><td>${fmtN(sum, 3)}</td><td>${fmtN(mu, 3)}</td></tr></table></div>`
            + (Math.abs(sum - 1) > 1e-6 ? h.pill(T("pravdepodobnosti nedávajú spolu 1", "the probabilities do not add up to 1"), "down") : "")
            + h.calc(`E(X) = \\sum x_i p_i = \\va{${tn(mu, 3)}}`) + h.calc(`\\sigma^2 = \\sum (x_i - \\mu)^2 p_i \\doteq ${tn(vr, 3)}, \\qquad \\sigma \\doteq \\vc{${tn(Math.sqrt(vr), 3)}}`);
        }
        const t = test(P), n = P.n;
        h.roz = {K:[t.kL, t.kU], pval:t.pval, zamietni:t.zamietni, p:t.pval};
        if(cfg.out) return cfg.out(P, h, st);
        const K = [t.kL >= 0 ? `X \\leq ${t.kL}` : "", t.kU <= n ? `X \\geq ${t.kU}` : ""].filter(Boolean).join(T("\\ \\text{alebo}\\ ", "\\ \\text{or}\\ "));
        return h.calc(`H_0: p = \\vb{${tn(P.p)}}, \\qquad n = \\vd{${n}}, \\qquad \\alpha = ${tn(P.alfa)}`)
          + h.p(`${T("Kritická oblasť", "Critical region")} (${{obe:T("obojstranný test", "two-sided test"), lava:T("ľavostranný test", "left-sided test"), prava:T("pravostranný test", "right-sided test")}[side]}): ${K ? `$${K}$` : T("prázdna", "empty")}`)
          + h.calc(`\\text{p-${T("hodnota", "value")}} \\doteq \\va{${tn(t.pval, 4)}}`)
          + h.pill(t.zamietni ? T("x leží v kritickej oblasti: H₀ zamietame", "x is in the critical region: H₀ is rejected") : T("x neleží v kritickej oblasti: H₀ nezamietame", "x is outside the critical region: H₀ is not rejected"), t.zamietni ? "down" : "ok")
          + h.p(T("$H_0$ zamietame práve vtedy, keď je p-hodnota najviac $\\alpha$.", "$H_0$ is rejected exactly when the p-value is at most $\\alpha$."));
      }
    };
  }
});

/* ============================================================
   TOOL: percenta — percentages, change by a percentage, sharing in a ratio, direct and inverse proportion,
   all as bars. Plain SVG.
   cfg:
     typ      "cast"     z (base), p (percent) → the part;  promile:true counts in ‰
              "zmena"    z, p (change in %), switch druha + q (a second change, applied to the new value)
              "pomer"    c (the whole) shared a : b (: k with n:3)
              "umera"    x1 → y1, x2 → ?   switch nepriama (inverse proportion)
     z, p, q, c, a, b, k, x1, y1, x2     a number or {v, min, max, step, lock, name, note}
     unit     "€"        written after amounts          free / lock / hide / on / toggles as in toolParams
     out(P, h, st)       h.pc = {cast, novy, zmena, diel, casti:[…], y2, k}
   ============================================================ */
defTool("percenta", {
  name:"Percentá a pomer",
  area:"Základy",
  desc:"Základ, percentá a časť ako pruh. Zmena o percentá, delenie v pomere a trojčlenka.",
  topics:["a1"],
  presets:[
    {name:"Časť zo základu", cfg:{typ:"cast"}},
    {name:"Zmena o percentá", cfg:{typ:"zmena"}},
    {name:"Zdraženie a zľava", cfg:{typ:"zmena", z:100, p:20, q:-20, on:{druha:true}}},
    {name:"Delenie v pomere", cfg:{typ:"pomer"}},
    {name:"Pomer troch", cfg:{typ:"pomer", n:3, c:120, a:1, b:2, k:3}},
    {name:"Priama úmernosť", cfg:{typ:"umera"}},
    {name:"Nepriama úmernosť", cfg:{typ:"umera", x1:3, y1:12, x2:4, on:{nepriama:true}}},
    {name:"Promile", cfg:{typ:"cast", promile:true, z:5000, p:3}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["cast", "zmena", "pomer", "umera"].includes(cfg.typ) ? cfg.typ : "cast";
    const full = cfg.promile ? 1000 : 100, sign = cfg.promile ? "‰" : "%", unit = cfg.unit ? " " + cfg.unit : "";
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const defs = typ === "cast" ? {
      z:{v:80, min:0, max:500, step:5, color:"b", note:"základ"},
      p:{v:25, min:0, max:cfg.promile ? 1000 : 150, step:1, color:"a", note:cfg.promile ? "promile" : "percentá"}
    } : typ === "zmena" ? {
      z:{v:200, min:0, max:1000, step:10, color:"b", note:"pôvodná hodnota"},
      p:{v:15, min:-100, max:100, step:1, color:"a", note:"zmena v %"},
      q:{v:-15, min:-100, max:100, step:1, color:"d", note:"druhá zmena v %"},
      druha:ck(false, "Druhá zmena po prvej", "d")
    } : typ === "pomer" ? {
      c:{v:60, min:0, max:600, step:1, color:"c", note:"celok"},
      a:{v:2, min:1, max:12, step:1, color:"a"}, b:{v:3, min:1, max:12, step:1, color:"b"},
      k:cfg.n === 3 ? {v:1, min:1, max:12, step:1, color:"d", name:"c′", note:"tretí diel"} : null
    } : {
      x1:{v:4, min:1, max:20, step:1, color:"b", name:"x₁"}, y1:{v:10, min:1, max:100, step:1, color:"a", name:"y₁"},
      x2:{v:6, min:1, max:20, step:1, color:"b", name:"x₂"}, nepriama:ck(false, "Nepriama úmernosť")
    };
    const params = toolParams(defs, cfg, env);
    const calc = P => {
      if(typ === "cast") return {cast:P.z * P.p / full, jedno:P.z / full};
      if(typ === "zmena"){ const novy = P.z * (1 + P.p / 100), po = novy * (1 + P.q / 100); return {novy, zmena:novy - P.z, po, spolu:P.z ? (po / P.z - 1) * 100 : 0}; }
      if(typ === "pomer"){ const parts = [P.a, P.b].concat(params.k ? [P.k] : []), sum = parts.reduce((s, v) => s + v, 0); return {parts, sum, diel:P.c / sum, casti:parts.map(v => v * P.c / sum)}; }
      const k = P.x2 / P.x1;
      return {k, y2:P.nepriama ? P.y1 / k : P.y1 * k};
    };
    const W = 560, L = 30, R = 530, H = typ === "pomer" ? 150 : typ === "umera" ? 190 : typ === "zmena" ? 200 : 150;
    const money = v => fmtN(v) + unit;

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb, T = (x, y, s, c) => thumb ? "" : SV.text(x, y, s, c);
        let h = "";
        if(typ === "cast"){
          const top = Math.max(full, P.p), X = v => L + v / top * (R - L), y = 52, bh = 44;
          h += SV.rect(L, y, X(full) - L, bh, "bg cb") + SV.rect(L, y, X(P.p) - L, bh, "bg ca") + SV.rect(L, y, X(P.p) - L, bh, "s ca")
            + SV.rect(L, y, X(full) - L, bh, "s cb w1");
          for(let i = 0; i <= 10; i++){
            const v = full * i / 10, x = X(v), big = i % 5 === 0;
            h += SV.line(x, y + bh, x, y + bh + (big ? 9 : 5), "s csoft w1");
            if(big) h += T(x, y + bh + 24, `${fmtN(v)} ${sign}`, "mid sm csoft") + T(x, y + bh + 40, money(P.z * i / 10), "mid sm cb");
          }
          if(P.p > 0) h += SV.line(X(P.p), y - 10, X(P.p), y + bh, "s ca") + T(X(P.p), y - 16, `${fmtN(P.p)} ${sign} = ${money(r.cast)}`, `ca ${X(P.p) > 380 ? "end" : X(P.p) < 120 ? "" : "mid"}`);
        } else if(typ === "zmena"){
          const vals = [P.z, r.novy].concat(P.druha ? [r.po] : []), top = Math.max(...vals, 1), X = v => L + v / top * (R - L - 70), bh = 34;
          const row = (y, base, now, cls, label, pct) => {
            let s = SV.rect(L, y, X(Math.min(base, now)) - L, bh, "bg cb") + SV.rect(L, y, X(Math.min(base, now)) - L, bh, "s cb w1");
            if(now > base) s += SV.rect(X(base), y, X(now) - X(base), bh, `bg ${cls}`) + SV.rect(X(base), y, X(now) - X(base), bh, `s ${cls}`);
            if(now < base) s += SV.rect(X(now), y, X(base) - X(now), bh, `s ${cls} w1 dash`);
            s += T(X(Math.max(base, now)) + 8, y + bh / 2 + 5, money(now), now === base ? "cb" : cls);
            if(pct != null) s += T(L + 6, y - 6, `${label}: ${pct > 0 ? "+" : pct < 0 ? "−" : ""}${fmtN(Math.abs(pct))} %`, `sm ${cls}`);
            else s += T(L + 6, y - 6, label, "sm cb");
            return s;
          };
          h += row(24, P.z, P.z, "cb", "pôvodná hodnota") + row(84, P.z, r.novy, "ca", "po zmene", P.p);
          if(P.druha) h += row(144, r.novy, r.po, "cd", "po druhej zmene", P.q);
          h += SV.line(X(P.z), 16, X(P.z), P.druha ? 182 : 122, "s cb w1 dots");
        } else if(typ === "pomer"){
          const n = r.sum, w = (R - L) / n, y = 40, bh = 46, col = ["ca", "cb", "cd"];
          let i = 0;
          r.parts.forEach((cnt, g) => {
            const x0 = L + i * w;
            for(let j = 0; j < cnt; j++, i++) h += SV.rect(L + i * w + 1, y, w - 2, bh, `bg ${col[g]}`) + SV.rect(L + i * w + 1, y, w - 2, bh, `s ${col[g]} w1`);
            const mx = (x0 + L + i * w) / 2;
            h += SV.path(`M${SV.n(x0 + 3)} ${y + bh + 8}v6H${SV.n(L + i * w - 3)}v-6`, `s ${col[g]} w1`) + T(mx, y + bh + 30, money(r.casti[g]), `mid ${col[g]}`);
            h += T(mx, y - 9, `${cnt} ${cnt === 1 ? "diel" : cnt < 5 ? "diely" : "dielov"}`, `mid sm ${col[g]}`);
          });
          if(w > 26) for(let j = 0; j < n; j++) h += T(L + (j + .5) * w, y + bh / 2 + 4, fmtN(r.diel), "mid sm thin");
        } else {
          const xm = Math.max(P.x1, P.x2), ym = Math.max(P.y1, r.y2), bw = 190, bh = 30;
          const col = (x0, vals, top, cls, name) => vals.map((v, i) => {
            const y = 44 + i * 74, w = v / top * bw;
            return SV.rect(x0, y, w, bh, `bg ${cls}`) + SV.rect(x0, y, w, bh, `s ${cls} w1`) + T(x0 + w + 8, y + bh / 2 + 5, fmtN(v), cls)
              + T(x0, y - 7, `${name}${"₁₂"[i]}`, `it ${cls}`);
          }).join("");
          h += col(L, [P.x1, P.x2], xm, "cb", "x") + col(300, [P.y1, r.y2], ym, "ca", "y");
          const arrow = (x, up, label, cls) => SV.line(x, 82, x, 110, `s ${cls} w1`) + SV.head(x, up ? 80 : 112, 0, up ? -1 : 1, `f ${cls}`, 7) + T(x + 8, 101, label, `sm ${cls}`);
          const kk = fmtN(r.k, 3);
          h += arrow(L + 46, false, `· ${kk}`, "cb") + arrow(346, !!P.nepriama, P.nepriama ? `: ${kk}` : `· ${kk}`, "ca");
        }
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const r = calc(P), tn = h.tn;
        h.pc = r;
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(typ === "cast"){
          o += h.calc(`1\\,${cfg.promile ? "\\text{‰}" : "\\%"} = \\dfrac{\\vb{${tn(P.z)}}}{${full}} = ${tn(r.jedno, 4)}`);
          o += h.calc(`\\va{${tn(P.p)}}\\,${cfg.promile ? "\\text{‰}" : "\\%"} = \\va{${tn(P.p)}} \\cdot ${tn(r.jedno, 4)} = ${tn(r.cast)}`);
          if(P.p > full) o += h.pill(`viac než ${full} ${sign}: časť je väčšia než základ`, "flat");
        } else if(typ === "zmena"){
          const f = p => tn(1 + p / 100, 4);
          o += h.calc(`\\vb{${tn(P.z)}} \\cdot \\va{${f(P.p)}} = ${tn(r.novy)}`);
          o += h.p(`${P.p >= 0 ? "Zvýšenie" : "Zníženie"} o $\\va{${tn(Math.abs(P.p))}\\,\\%}$ znamená násobiť číslom $\\va{${f(P.p)}}$.`);
          if(P.druha){
            o += h.calc(`${tn(r.novy)} \\cdot \\vd{${f(P.q)}} = ${tn(r.po)}`);
            o += h.calc(`\\va{${f(P.p)}} \\cdot \\vd{${f(P.q)}} = ${tn((1 + P.p / 100) * (1 + P.q / 100), 4)}`);
            o += h.pill(`spolu ${r.spolu >= 0 ? "+" : "−"}${fmtN(Math.abs(r.spolu))} %, nie ${P.p + P.q >= 0 ? "+" : "−"}${fmtN(Math.abs(P.p + P.q))} %`, Math.abs(r.spolu - P.p - P.q) < 1e-9 ? "ok" : "flat");
          }
        } else if(typ === "pomer"){
          const names = ["a", "b", "d"];
          o += h.calc(`${r.parts.map((v, i) => `\\v${names[i]}{${v}}`).join(" + ")} = ${r.sum}\\ \\text{dielov}`);
          o += h.calc(`1\\ \\text{diel} = \\dfrac{\\vc{${tn(P.c)}}}{${r.sum}} = ${tn(r.diel)}`);
          o += h.calc(r.parts.map((v, i) => `\\v${names[i]}{${v}} \\cdot ${tn(r.diel)} = \\v${names[i]}{${tn(r.casti[i])}}`).join(",\\quad "));
        } else {
          o += P.nepriama ? h.calc(`\\vb{x_1} \\cdot \\va{y_1} = \\vb{x_2} \\cdot \\va{y_2}`) : h.calc(`\\dfrac{\\va{y_1}}{\\vb{x_1}} = \\dfrac{\\va{y_2}}{\\vb{x_2}}`);
          o += P.nepriama ? h.calc(`\\va{y_2} = \\dfrac{\\vb{${tn(P.x1)}} \\cdot \\va{${tn(P.y1)}}}{\\vb{${tn(P.x2)}}} = \\va{${tn(r.y2)}}`)
            : h.calc(`\\va{y_2} = \\dfrac{\\va{${tn(P.y1)}} \\cdot \\vb{${tn(P.x2)}}}{\\vb{${tn(P.x1)}}} = \\va{${tn(r.y2)}}`);
          o += h.pill(P.nepriama ? "koľkokrát viac x, toľkokrát menej y" : "koľkokrát viac x, toľkokrát viac y", P.nepriama ? "down" : "up");
        }
        return o;
      }
    };
  }
});

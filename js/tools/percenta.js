/* ============================================================
   TOOL: percenta — percentages, change by a percentage, sharing in a ratio, direct and inverse proportion,
   all as bars. Plain SVG.
   cfg:
     typ      "cast"     z (base), p (percent) → the part;  promile:true counts in ‰
                         co: 0 | 1 | 2   what is looked for: the part, the base (from the part cz and p) or the percent
              "zmena"    z, p (change in %), switch druha + q (a second change, applied to the new value)
                         co: 0 | 1 | 2   the new value, the original one (from the new value nv and p) or the change in %
                         (co is a choice on the tool's own page; in theory give toggles:["co"] to offer it)
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
    {name:"Časť zo základu", cfg:{typ:"cast"}, tip:"Tlačidlami vyber, čo hľadáš: časť, základ alebo počet percent. Zvyšné dve hodnoty nastav alebo napíš."},
    {name:"Zmena o percentá", cfg:{typ:"zmena"}, tip:"Zvýšenie o $p\\,\\%$ je násobenie číslom $1 + \\frac{p}{100}$. Vieš hľadať aj pôvodnú hodnotu alebo o koľko percent sa hodnota zmenila."},
    {name:"Zdraženie a zľava", cfg:{typ:"zmena", z:100, p:20, q:-20, on:{druha:true}}, tip:"Zdraženie o 20 % a potom zľava 20 % nevráti pôvodnú cenu: druhé percentá sa počítajú z nového základu."},
    {name:"Delenie v pomere", cfg:{typ:"pomer"}, tip:"Celok rozdeľ na $a + b$ rovnakých dielov. Jeden dostane $a$ dielov, druhý $b$."},
    {name:"Pomer troch", cfg:{typ:"pomer", n:3, c:120, a:1, b:2, k:3}, tip:"Pri troch členoch pomeru je postup rovnaký: najprv spočítaj, koľko dielov je spolu."},
    {name:"Priama úmernosť", cfg:{typ:"umera"}, tip:"Koľkokrát vzrastie $x$, toľkokrát vzrastie $y$. Podiel $\\frac{y}{x}$ sa nemení."},
    {name:"Nepriama úmernosť", cfg:{typ:"umera", x1:3, y1:12, x2:4, on:{nepriama:true}}, tip:"Viac robotníkov, menej dní: súčin $x \\cdot y$ sa nemení."},
    {name:"Promile", cfg:{typ:"cast", promile:true, z:5000, p:3}, tip:"Promile je tisícina základu, teda desatina percenta."}
  ],
  help:"Každú hodnotu môžeš prepísať v políčku pri posuvníku. Pri percentách vyber tlačidlami **Hľadám**, ktorá z troch hodnôt je neznáma.",
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["cast", "zmena", "pomer", "umera"].includes(cfg.typ) ? cfg.typ : "cast";
    const full = cfg.promile ? 1000 : 100, sign = cfg.promile ? "‰" : "%", unit = cfg.unit ? " " + cfg.unit : "";
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const defs = typ === "cast" ? {
      co:{type:"pick", v:0, name:"Hľadám", opts:["časť", "základ", cfg.promile ? "promile" : "percentá"]},
      z:{v:80, min:0, max:500, step:5, color:"b", note:"základ", when:P => P.co !== 1},
      p:{v:25, min:0, max:cfg.promile ? 1000 : 150, step:1, color:"a", note:cfg.promile ? "promile" : "percentá", when:P => P.co !== 2},
      cz:{v:20, min:0, max:500, step:1, color:"d", name:"č", note:"časť", when:P => P.co > 0}
    } : typ === "zmena" ? {
      co:{type:"pick", v:0, name:"Hľadám", opts:["novú hodnotu", "pôvodnú hodnotu", "zmenu v %"]},
      z:{v:200, min:0, max:1000, step:10, color:"b", note:"pôvodná hodnota", when:P => P.co !== 1},
      p:{v:15, min:-100, max:100, step:1, color:"a", note:"zmena v %", when:P => P.co !== 2},
      nv:{v:230, min:0, max:1500, step:10, color:"d", name:"n", note:"nová hodnota", when:P => P.co > 0},
      druha:Object.assign(ck(false, "Druhá zmena po prvej", "d"), {when:P => !P.co}),
      q:{v:-15, min:-100, max:100, step:1, color:"d", note:"druhá zmena v %", when:P => !!P.druha && !P.co}
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
      if(typ === "cast"){
        let z = P.z, p = P.p, cast = z * p / full;
        if(P.co === 1){ cast = P.cz; z = p ? cast * full / p : NaN; }
        else if(P.co === 2){ cast = P.cz; p = z ? cast / z * full : NaN; }
        return {z, p, cast, jedno:z / full};
      }
      if(typ === "zmena"){
        let z = P.z, p = P.p, novy = z * (1 + p / 100);
        if(P.co === 1){ novy = P.nv; z = p > -100 ? novy / (1 + p / 100) : NaN; }
        else if(P.co === 2){ novy = P.nv; p = z ? (novy / z - 1) * 100 : NaN; }
        const po = novy * (1 + P.q / 100);
        return {z, p, novy, zmena:novy - z, po, spolu:z ? (po / z - 1) * 100 : 0, dr:!!P.druha && !P.co};
      }
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
        if(typ === "cast" && isFinite(r.z) && isFinite(r.p)){
          const pz = {z:r.z, p:Math.round(r.p * 100) / 100};
          const top = Math.max(full, pz.p), X = v => L + v / top * (R - L), y = 52, bh = 44;
          h += SV.rect(L, y, X(full) - L, bh, "bg cb") + SV.rect(L, y, X(pz.p) - L, bh, "bg ca") + SV.rect(L, y, X(pz.p) - L, bh, "s ca")
            + SV.rect(L, y, X(full) - L, bh, "s cb w1");
          for(let i = 0; i <= 10; i++){
            const v = full * i / 10, x = X(v), big = i % 5 === 0;
            h += SV.line(x, y + bh, x, y + bh + (big ? 9 : 5), "s csoft w1");
            if(big) h += T(x, y + bh + 24, `${fmtN(v)} ${sign}`, "mid sm csoft") + T(x, y + bh + 40, money(pz.z * i / 10), "mid sm cb");
          }
          if(pz.p > 0) h += SV.line(X(pz.p), y - 10, X(pz.p), y + bh, "s ca") + T(X(pz.p), y - 16, `${fmtN(pz.p)} ${sign} = ${money(r.cast)}`, `ca ${X(pz.p) > 380 ? "end" : X(pz.p) < 120 ? "" : "mid"}`);
        } else if(typ === "cast"){
          h += T(W / 2, 80, "Z týchto hodnôt sa výsledok určiť nedá.", "mid csoft");
        } else if(typ === "zmena" && !(isFinite(r.z) && isFinite(r.p))){
          h += T(W / 2, 100, "Z týchto hodnôt sa výsledok určiť nedá.", "mid csoft");
        } else if(typ === "zmena"){
          const vals = [r.z, r.novy].concat(r.dr ? [r.po] : []), top = Math.max(...vals, 1), X = v => L + v / top * (R - L - 70), bh = 34;
          const row = (y, base, now, cls, label, pct) => {
            let s = SV.rect(L, y, X(Math.min(base, now)) - L, bh, "bg cb") + SV.rect(L, y, X(Math.min(base, now)) - L, bh, "s cb w1");
            if(now > base) s += SV.rect(X(base), y, X(now) - X(base), bh, `bg ${cls}`) + SV.rect(X(base), y, X(now) - X(base), bh, `s ${cls}`);
            if(now < base) s += SV.rect(X(now), y, X(base) - X(now), bh, `s ${cls} w1 dash`);
            s += T(X(Math.max(base, now)) + 8, y + bh / 2 + 5, money(now), now === base ? "cb" : cls);
            if(pct != null) s += T(L + 6, y - 6, `${label}: ${pct > 0 ? "+" : pct < 0 ? "−" : ""}${fmtN(Math.abs(pct))} %`, `sm ${cls}`);
            else s += T(L + 6, y - 6, label, "sm cb");
            return s;
          };
          h += row(24, r.z, r.z, "cb", "pôvodná hodnota") + row(84, r.z, r.novy, "ca", "po zmene", Math.round(r.p * 100) / 100);
          if(r.dr) h += row(144, r.novy, r.po, "cd", "po druhej zmene", P.q);
          h += SV.line(X(r.z), 16, X(r.z), r.dr ? 182 : 122, "s cb w1 dots");
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
        const pc = cfg.promile ? "\\text{‰}" : "\\%", eq = (v, d = 2) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7 ? "=" : "\\doteq";
        if((typ === "cast" || typ === "zmena") && !(isFinite(r.z) && isFinite(r.p))) return h.pill(typ === "cast" ? (P.co === 1 ? `z 0 ${sign} sa základ vypočítať nedá` : "základ nesmie byť 0") : (P.co === 1 ? "po znížení o 100 % nezostane nič: pôvodná hodnota sa určiť nedá" : "pôvodná hodnota nesmie byť 0"), "flat");
        if(typ === "cast" && P.co === 1){
          o += h.calc(`1\\,${pc} = \\dfrac{\\vd{${tn(P.cz)}}}{\\va{${tn(P.p)}}} ${eq(r.jedno, 4)} ${tn(r.jedno, 4)}`);
          o += h.calc(`${full}\\,${pc} = ${full} \\cdot ${tn(r.jedno, 4)} ${eq(r.z)} \\vb{${tn(r.z)}}`);
          o += h.p(`Základ je $\\vb{${tn(r.z)}}${unit}$: z časti najprv vypočítaj jedno ${cfg.promile ? "promile" : "percento"}.`);
        } else if(typ === "cast" && P.co === 2){
          o += h.calc(`\\dfrac{\\vd{${tn(P.cz)}}}{\\vb{${tn(P.z)}}} \\cdot ${full} ${eq(r.p)} \\va{${tn(r.p)}}\\,${pc}`);
          o += h.p(`Časť vydeľ základom a vynásob ${full === 100 ? "stomi" : "tisícimi"}.`);
          if(r.p > full) o += h.pill(`viac než ${full} ${sign}: časť je väčšia než základ`, "flat");
        } else if(typ === "cast"){
          o += h.calc(`1\\,${cfg.promile ? "\\text{‰}" : "\\%"} = \\dfrac{\\vb{${tn(P.z)}}}{${full}} = ${tn(r.jedno, 4)}`);
          o += h.calc(`\\va{${tn(P.p)}}\\,${cfg.promile ? "\\text{‰}" : "\\%"} = \\va{${tn(P.p)}} \\cdot ${tn(r.jedno, 4)} = ${tn(r.cast)}`);
          if(P.p > full) o += h.pill(`viac než ${full} ${sign}: časť je väčšia než základ`, "flat");
        } else if(typ === "zmena" && P.co === 1){
          const f = tn(1 + P.p / 100, 4);
          o += h.calc(`\\vb{z} \\cdot \\va{${f}} = \\vd{${tn(P.nv)}}`);
          o += h.calc(`\\vb{z} = \\dfrac{\\vd{${tn(P.nv)}}}{\\va{${f}}} ${eq(r.z)} \\vb{${tn(r.z)}}`);
          o += h.p(`Pôvodnú hodnotu dostaneš **delením** číslom $\\va{${f}}$. Odčítať $${tn(Math.abs(P.p))}\\,\\%$ z novej hodnoty je chyba: percentá sa počítajú z pôvodnej.`);
        } else if(typ === "zmena" && P.co === 2){
          o += h.calc(`\\dfrac{\\vd{${tn(P.nv)}}}{\\vb{${tn(P.z)}}} ${eq(r.novy / r.z, 4)} \\va{${tn(r.novy / r.z, 4)}}`);
          o += h.p(`Hodnota sa ${r.p >= 0 ? "zvýšila" : "znížila"} o $\\va{${tn(Math.abs(r.p))}\\,\\%}$ (zmena $${tn(r.zmena)}$ z pôvodných $${tn(P.z)}$).`);
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

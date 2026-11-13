/* ============================================================
   TOOL: urok — interest year by year as a table with bars: a deposit, regular saving, a loan repaid in
   equal instalments (the amortisation plan). Draws an HTML table, no picture.
   cfg:
     typ      "vklad"     k (deposit), p (% p.a.), n (years); switches jednoduche (simple interest beside
                          compound), dan (19 % tax taken from every interest payment)
              "sporenie"  k paid in at the start of every year, p, n
              "pozicka"   k (loan), p, n (years); switch mesacne (monthly instalments)
     k, p, n  a number or {v, min, max, step, lock, name, note}
     rows     12          how many table rows before the middle is folded away
     unit     "€"         free / lock / hide / on / toggles as in toolParams
     out(P, h, st)        h.fin = {q, rows:[…], end, interest, splatka, paid, simple}
   ============================================================ */
defTool("urok", {
  name:"Úrok a splátky",
  area:"Základy",
  desc:"Vklad, pravidelné sporenie a pôžička rok po roku: úrok, stav účtu, splátka, úmor a zostatok dlhu.",
  topics:["a2", "a26"],
  presets:[
    {name:"Vklad", cfg:{typ:"vklad"}},
    {name:"Jednoduché a zložené", cfg:{typ:"vklad", n:10, p:8, on:{jednoduche:true}}},
    {name:"Pravidelné sporenie", cfg:{typ:"sporenie"}},
    {name:"Pôžička", cfg:{typ:"pozicka"}},
    {name:"Hypotéka mesačne", cfg:{typ:"pozicka", k:{v:80000, max:300000, step:1000}, p:4, n:20, on:{mesacne:true}}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["vklad", "sporenie", "pozicka"].includes(cfg.typ) ? cfg.typ : "vklad";
    const unit = cfg.unit || "€";
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const params = toolParams({
      k:{v:typ === "pozicka" ? 10000 : 1000, min:100, max:typ === "pozicka" ? 100000 : 20000, step:100, color:"b", name:typ === "pozicka" ? "D" : typ === "sporenie" ? "a" : "K₀",
         note:typ === "pozicka" ? "pôžička" : typ === "sporenie" ? "ročný vklad" : "vklad"},
      p:{v:5, min:0, max:20, step:.5, color:"a", note:"úrok v % ročne"},
      n:{v:5, min:1, max:30, step:1, color:"d", note:"počet rokov"},
      jednoduche:typ === "vklad" ? ck(false, "Porovnať s jednoduchým úrokovaním", "c") : null,
      dan:typ === "vklad" ? ck(false, "Daň z úroku 19 %") : null,
      mesacne:typ === "pozicka" ? ck(false, "Mesačné splátky") : null
    }, cfg, env);
    const r2 = v => Math.round(v * 100) / 100;

    const calc = P => {
      const n = Math.max(1, Math.round(P.n)), rows = [];
      if(typ === "vklad"){
        const i = P.p / 100 * (P.dan ? .81 : 1), q = 1 + i;
        let s = P.k;
        for(let t = 1; t <= n; t++){ const u = s * i; s += u; rows.push({t, urok:u, stav:s, simple:P.k * (1 + i * t)}); }
        return {q, i, rows, end:s, interest:s - P.k, simple:P.k * (1 + i * n)};
      }
      if(typ === "sporenie"){
        const i = P.p / 100, q = 1 + i;
        let s = 0;
        for(let t = 1; t <= n; t++){ const u = (s + P.k) * i; s = s + P.k + u; rows.push({t, vklad:P.k, urok:u, stav:s}); }
        return {q, i, rows, end:s, interest:s - n * P.k, paid:n * P.k};
      }
      const m = P.mesacne ? 12 : 1, N = n * m, i = P.p / 100 / m, q = 1 + i;
      const a = i === 0 ? P.k / N : P.k * i * Math.pow(q, N) / (Math.pow(q, N) - 1);
      let d = P.k;
      for(let t = 1; t <= N; t++){ const u = d * i, um = a - u; d -= um; rows.push({t, splatka:a, urok:u, umor:um, stav:Math.abs(d) < 1e-6 ? 0 : d}); }
      return {q, i, N, m, rows, splatka:a, paid:a * N, interest:a * N - P.k, end:0};
    };

    return {
      params,
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb, eur = v => fmtN(r2(v)) + " " + unit;
        const max = thumb ? 5 : cfg.rows || 12, all = r.rows;
        const shown = all.length <= max ? all : [...all.slice(0, max - 3), null, ...all.slice(-2)];
        const top = Math.max(...all.map(x => typ === "pozicka" ? P.k : Math.max(x.stav, x.simple || 0)), 1);
        const bar = (v, cls, v2) => `<td class="l" style="min-width:${thumb ? 60 : 110}px"><div class="tw-bar"><i class="${cls}" style="width:${(Math.max(0, v) / top * 100).toFixed(1)}%"></i>${v2 != null ? `<i class="cc alt" style="width:${(v2 / top * 100).toFixed(1)}%"></i>` : ""}</div></td>`;
        const head = typ === "vklad" ? ["Rok", "Úrok", "Stav účtu"].concat(P.jednoduche ? ["Jednoduché"] : [])
          : typ === "sporenie" ? ["Rok", "Vklad", "Úrok", "Stav účtu"] : [P.mesacne ? "Mesiac" : "Rok", "Splátka", "Úrok", "Úmor", "Zostatok"];
        const body = shown.map(x => {
          if(!x) return `<tr><td class="m" colspan="${head.length + 1}">⋮</td></tr>`;
          const c = typ === "vklad" ? [x.t, `<span class="ca">${eur(x.urok)}</span>`, eur(x.stav)].concat(P.jednoduche ? [`<span class="cc">${eur(x.simple)}</span>`] : [])
            : typ === "sporenie" ? [x.t, `<span class="cb">${eur(x.vklad)}</span>`, `<span class="ca">${eur(x.urok)}</span>`, eur(x.stav)]
            : [x.t, eur(x.splatka), `<span class="ca">${eur(x.urok)}</span>`, `<span class="cok">${eur(x.umor)}</span>`, eur(x.stav)];
          return `<tr>${c.map(v => `<td>${v}</td>`).join("")}${bar(x.stav, typ === "pozicka" ? "cb" : "cd", P.jednoduche ? x.simple : null)}</tr>`;
        }).join("");
        const sum = typ === "pozicka" ? `<tr class="sum"><td class="l">Spolu</td><td>${eur(r.paid)}</td><td><span class="ca">${eur(r.interest)}</span></td><td><span class="cok">${eur(P.k)}</span></td><td></td><td></td></tr>` : "";
        return `<div class="tw-tab"><table><thead><tr>${head.map(x => `<th>${x}</th>`).join("")}<th></th></tr></thead><tbody>${body}${sum}</tbody></table></div>`;
      },
      out(P, h, st){
        const r = calc(P), tn = h.tn, n = Math.round(P.n);
        h.fin = r;
        if(cfg.out) return cfg.out(P, h, st);
        const m = v => tn(r2(v)), q = tn(r.q, 6);
        let o = "";
        if(typ === "vklad"){
          if(P.dan) o += h.p(`Po dani zostáva z úroku 81 %: $${tn(P.p)}\\,\\% \\cdot 0{,}81 = ${tn(P.p * .81, 4)}\\,\\%$.`);
          o += h.calc(`K_{\\vd{${n}}} = \\vb{${tn(P.k)}} \\cdot \\va{${q}}^{\\vd{${n}}} \\doteq ${m(r.end)}`);
          if(P.jednoduche) o += h.calc(`\\vc{K_{${n}}} = ${tn(P.k)} \\cdot (1 + ${n} \\cdot ${tn(r.i, 6)}) = \\vc{${m(r.simple)}}`) + h.p(`Zložené úrokovanie prinesie o $${m(r.end - r.simple)}$ ${unit} viac, lebo úročí aj skoršie úroky.`);
          else o += h.p(`Úroky spolu: $\\va{${m(r.interest)}}$ ${unit}.`);
        } else if(typ === "sporenie"){
          o += r.i === 0 ? h.calc(`S_{\\vd{${n}}} = \\vd{${n}} \\cdot \\vb{${tn(P.k)}} = ${m(r.end)}`) : h.calc(`S_{\\vd{${n}}} = \\vb{${tn(P.k)}} \\cdot \\va{${q}} \\cdot \\dfrac{\\va{${q}}^{\\vd{${n}}} - 1}{\\va{${q}} - 1} \\doteq ${m(r.end)}`);
          o += h.p(`Vložené: $${m(r.paid)}$ ${unit}, úroky: $\\va{${m(r.interest)}}$ ${unit}.`);
        } else {
          o += r.i === 0 ? h.calc(`a = \\dfrac{\\vb{D}}{N} = ${m(r.splatka)}`) : h.calc(`a = \\vb{D} \\cdot \\dfrac{i \\cdot q^{N}}{q^{N} - 1} \\doteq ${m(r.splatka)}`);
          o += h.p(`$i = ${tn(r.i, 6)}$, $q = ${q}$, $N = ${r.N}$ splátok. Každá splátka najprv zaplatí úrok z dlhu, zvyšok dlh zmenší (úmor).`);
          o += h.p(`Zaplatíš spolu $${m(r.paid)}$ ${unit}, z toho úroky $\\va{${m(r.interest)}}$ ${unit}.`);
        }
        return o;
      }
    };
  }
});

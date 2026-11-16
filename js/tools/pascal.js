/* ============================================================
   TOOL: pascal — Pascal's triangle and the numbers in it: n!, n over k, the binomial theorem. Plain SVG / table.
   cfg:
     typ      "trojuholnik"  the triangle; click a number to pick n and k.  riadky:8 (rows drawn, up to 12)
                             switches: sucet (the two numbers above add up), symetria, riadok (the sum of a row)
              "cislo"        n over k worked out: the factors of n! with (n − k)! cancelled
              "faktorial"    table of 0! … n!, each built from the one before
              "binom"        (p·x + q)^n term by term (sliders n, p, q, and k to pick a term);  ab:true → (a + b)^n in letters
     n, k, p, q   a number or {v, min, max, step, lock};  on / toggles / free / lock / hide as in toolParams
     out(P, h, st)     h.pas = {n, k, C (n over k), riadok:[…] (row n), koef:[…] (binom: coefficients from x^n down)}
   ============================================================ */
defTool("pascal", {
  name:"Pascalov trojuholník a kombinačné čísla",
  area:"Kombinatorika",
  desc:"Faktoriál, kombinačné číslo s krátením, Pascalov trojuholník a binomická veta.",
  topics:["a39", "b37"],
  presets:[
    {name:"Pascalov trojuholník", cfg:{typ:"trojuholnik", on:{sucet:true}}, tip:"Každé číslo je súčet dvoch nad ním. Klikni na číslo: je to kombinačné číslo $\\binom{n}{k}$."},
    {name:"Súmernosť a súčet riadku", cfg:{typ:"trojuholnik", n:6, k:2, on:{symetria:true, riadok:true}}, tip:"Riadok je súmerný, lebo vybrať $k$ prvkov je to isté ako vybrať $n - k$, ktoré zostanú. Súčet riadku je $2^n$."},
    {name:"Kombinačné číslo", cfg:{typ:"cislo"}, tip:"Vo vzorci sa veľa vykráti: v čitateli zostane $k$ činiteľov od $n$ nadol."},
    {name:"Faktoriál", cfg:{typ:"faktorial"}, tip:"Faktoriál rastie veľmi rýchlo. Platí $n! = n \\cdot (n - 1)!$ a $0! = 1$."},
    {name:"Binomická veta", cfg:{typ:"binom", ab:true}, tip:"Koeficienty rozvoja $(a + b)^n$ sú čísla $n$-tého riadku Pascalovho trojuholníka."},
    {name:"Rozvoj (2x + 3)^4", cfg:{typ:"binom", n:4, p:2, q:3}, tip:"Každý člen je kombinačné číslo krát mocniny oboch sčítancov. Posuvníkom $k$ vyber jeden člen."}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["trojuholnik", "cislo", "faktorial", "binom"].includes(cfg.typ) ? cfg.typ : "trojuholnik";
    const R = Math.max(3, Math.min(12, cfg.riadky || 8)), ck = name => ({type:"check", v:false, name});
    const N = (v, max, min = 0) => ({v, min, max, step:1, color:"a"}), Kp = (v, max) => ({v, min:0, max, step:1, color:"b"});
    const defs = typ === "trojuholnik" ? {n:N(5, R), k:Kp(2, R), sucet:ck("Súčet dvoch čísel nad ním"), symetria:ck("Súmernosť riadku"), riadok:ck("Súčet celého riadku")}
      : typ === "cislo" ? {n:N(7, 10, 1), k:Kp(3, 10)}
      : typ === "faktorial" ? {n:N(6, 10)}
      : {n:N(4, 7, 1), p:cfg.ab ? null : {v:1, min:-3, max:3, step:1, color:"d", note:"koeficient pri x"}, q:cfg.ab ? null : {v:1, min:-3, max:3, step:1, color:"c", note:"druhý člen"}, k:Kp(1, 7)};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, kk = P => Math.min(P.k, P.n);
    const pow = (b, e) => e === 0 ? "" : e === 1 ? b : `${b}^{${e}}`;

    return {
      params, aspect:typ === "trojuholnik" || typ === "cislo" ? `${W}/${typ === "cislo" ? 220 : H}` : null,
      hint:typ === "trojuholnik" ? "**Klikni** na číslo v trojuholníku." : null,
      svg(P, st){
        const n = P.n, k = kk(P), thumb = st.env.thumb;
        if(typ === "trojuholnik"){
          const dx = Math.min(54, (W - 30) / (R + 1)), dy = (H - 30) / (R + 1), r = Math.min(dx, dy) * .46;
          let h = "";
          for(let i = 0; i <= R; i++) for(let j = 0; j <= i; j++){
            const x = W / 2 + (j - i / 2) * dx, y = 15 + dy * (i + .5), v = binom(i, j);
            const sel = i === n && j === k, par = P.sucet && i === n - 1 && (j === k - 1 || j === k), mir = P.symetria && i === n && j === n - k && !sel, row = P.riadok && i === n;
            const c = sel ? "ca" : par ? "cb" : mir ? "cd" : row ? "cc" : "";
            h += SV.circle(x, y, r, c ? `bg ${c} pa-on` : "pa-c", thumb ? "" : ` data-pick="${i},${j}"`)
              + SV.text(x, y + (v > 99 ? 4 : 5), v, `mid ${v > 99 ? "sm" : ""} ${c}`, ' pointer-events="none"');
          }
          if(!thumb) for(let i = 0; i <= R; i++) h += SV.text(W / 2 - (i / 2 + .5) * dx - r - 2, 15 + dy * (i + .5) + 4, `n = ${i}`, `end sm ${i === n ? "ca" : "csoft"}`);
          return SV.wrap(W, H, h);
        }
        if(typ === "cislo"){
          const b = Math.min(46, (W - 150) / Math.max(n, 4)), x0 = 24, y1 = 44, y2 = 134;
          let h = SV.text(x0, 28, `${n}! v čitateli`, "sm csoft") + SV.text(x0, y2 + b + 22, `${k}! · ${n - k}! v menovateli`, "sm csoft");
          for(let i = 0; i < n; i++){
            const top = n - i, keep = i < k, x = x0 + i * b;
            h += SV.rect(x + 2, y1, b - 4, b - 4, keep ? "bg ca pa-on" : "pa-c") + SV.text(x + b / 2, y1 + b / 2 + 3, top, `mid ${keep ? "ca" : "csoft"}`);
            const bot = i < k ? k - i : n - i;
            h += SV.rect(x + 2, y2, b - 4, b - 4, i < k ? "bg cb pa-on" : "pa-c") + SV.text(x + b / 2, y2 + b / 2 + 3, bot, `mid ${i < k ? "cb" : "csoft"}`);
            if(!keep) h += SV.line(x + 6, y1 + b - 8, x + b - 6, y1 + 4, "s cno w1") + SV.line(x + 6, y2 + b - 8, x + b - 6, y2 + 4, "s cno w1");
          }
          h += SV.line(x0, (y1 + b + y2) / 2 - 2, x0 + n * b, (y1 + b + y2) / 2 - 2, "s");
          h += SV.text(x0 + n * b + 16, (y1 + b + y2) / 2 + 5, `= ${fmtN(binom(n, k))}`, "xl");
          return SV.wrap(W, 220, h);
        }
        if(typ === "faktorial"){
          let rows = "";
          for(let m = 0; m <= n; m++) rows += `<tr${m === n ? ' class="sel"' : ""}><td class="m">${m}!</td><td class="l">${m < 2 ? "1" : Array.from({length:m}, (_, i) => m - i).join(" · ")}</td><td class="l">${m ? `${m} · ${m - 1}!` : "dohoda"}</td><td>${fmtN(fact(m))}</td></tr>`;
          return `<div class="tw-tab"><table><tr><th class="m">n!</th><th class="l">súčin</th><th class="l">z predošlého</th><th>hodnota</th></tr>${rows}</table></div>`;
        }
        let rows = "";
        for(let j = 0; j <= n; j++){
          const c = binom(n, j), cls = j === k ? ' class="sel"' : "";
          rows += cfg.ab ? `<tr${cls}><td class="m">${j}</td><td class="cb">${c}</td><td class="l">${tex(`${c > 1 ? c : ""}${pow("a", n - j)}${pow("b", j)}`)}</td></tr>`
            : `<tr${cls}><td class="m">${j}</td><td class="cb">${c}</td><td>${fmtN(P.p ** (n - j))}</td><td>${fmtN(P.q ** j)}</td><td><b>${fmtN(c * P.p ** (n - j) * P.q ** j)}</b></td><td class="l">${tex(pow("x", n - j) || "1")}</td></tr>`;
        }
        return `<div class="tw-tab"><table><tr><th class="m">k</th><th>${tex("\\tbinom{n}{k}")}</th>${cfg.ab ? '<th class="l">člen</th>' : `<th>${tex("p^{\\,n-k}")}</th><th>${tex("q^{\\,k}")}</th><th>koeficient</th><th class="l">pri</th>`}</tr>${rows}</table></div>`;
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit) return;
          const [i, j] = hit.dataset.pick.split(",").map(Number);
          if(!st.w.params.n.lock || st.open) st.P.n = i;
          if(!st.w.params.k.lock || st.open) st.P.k = j;
          toolCtlSync(st); toolUpdate(st);
        });
      },
      out(P, h, st){
        const n = P.n, k = typ === "faktorial" ? 0 : kk(P), tn = h.tn, C = binom(n, k), row = Array.from({length:n + 1}, (_, j) => binom(n, j));
        const koef = typ === "binom" && !cfg.ab ? row.map((c, j) => c * P.p ** (n - j) * P.q ** j) : row;
        h.pas = {n, k, C, riadok:row, koef};
        if(cfg.out) return cfg.out(P, h, st);
        const bn = (a, b) => `\\dbinom{${a}}{${b}}`;
        if(typ === "faktorial") return h.calc(`\\va{${n}}! = ${n < 2 ? "1" : Array.from({length:n}, (_, i) => n - i).join(" \\cdot ")}${n < 2 ? "" : ` = ${tn(fact(n))}`}`)
          + h.p(`Toľkými spôsobmi sa dá zoradiť $\\va{${n}}$ rôznych prvkov.`) + h.calc(`n! = n \\cdot (n - 1)!, \\qquad 0! = 1`);
        if(typ === "cislo") return h.calc(`${bn(`\\va{${n}}`, `\\vb{${k}}`)} = \\dfrac{${n}!}{${k}! \\cdot ${n - k}!}${k ? ` = \\dfrac{${Array.from({length:k}, (_, i) => n - i).join(" \\cdot ")}}{${Array.from({length:k}, (_, i) => k - i).join(" \\cdot ")}}` : ""} = ${tn(C)}`)
          + h.p(`V čitateli zostane $\\vb{${k}}$ činiteľov od $\\va{${n}}$ nadol, zvyšok sa vykráti s $(n - k)!$.`)
          + h.p(`Toľkými spôsobmi sa dá z $\\va{${n}}$ prvkov vybrať $\\vb{${k}}$, keď nezáleží na poradí.`);
        if(typ === "trojuholnik"){
          let o = h.calc(`${bn(`\\va{${n}}`, `\\vb{${k}}`)} = ${tn(C)}`);
          if(P.sucet) o += n > 0 && k > 0 && k < n ? h.calc(`${bn(n - 1, k - 1)} + ${bn(n - 1, k)} = \\vb{${binom(n - 1, k - 1)}} + \\vb{${binom(n - 1, k)}} = \\va{${C}}`) : h.p("Krajné čísla riadku sú vždy 1.");
          if(P.symetria) o += h.calc(`${bn(n, k)} = ${bn(n, n - k)} = \\vd{${C}}`);
          if(P.riadok) o += h.calc(`${row.join(" + ")} = 2^{${n}} = \\vc{${2 ** n}}`);
          return o;
        }
        const terms = koef.map((c, j) => [c, cfg.ab ? pow("a", n - j) + pow("b", j) : pow("x", n - j)]);
        return h.calc(`${cfg.ab ? "(a + b)" : `(${linTex([[P.p, "x"], [P.q, ""]])})`}^{\\va{${n}}} = ${linTex(terms, v => texN(v, 0))}`)
          + h.calc(cfg.ab ? `\\text{člen s } k = \\vb{${k}}: \\quad ${bn(n, k)} ${pow("a", n - k)}${pow("b", k)} = ${C > 1 ? C : ""}${pow("a", n - k)}${pow("b", k)}`
            : `\\text{člen s } k = \\vb{${k}}: \\quad ${bn(n, k)} \\cdot ${P.p < 0 ? `(${P.p})` : P.p}^{${n - k}} \\cdot ${P.q < 0 ? `(${P.q})` : P.q}^{${k}} ${pow("x", n - k)} = ${tn(koef[k], 0)}${pow("x", n - k)}`)
          + h.p("Koeficienty sú čísla z riadku $n$ Pascalovho trojuholníka.");
      }
    };
  }
});

/* ============================================================
   TOOL: sustavy — a number written in another base: place values, repeated division, Roman numerals.
   Draws HTML tables, no picture.
   cfg:
     n        45 | {v, min, max, lock}     the number (in base ten)
     b        2  | {v, min, max, lock}     the base, 2…16
     on       {rady, delenie, rim}         rady: place values and the expanded form
                                           delenie: division by the base, remainders read from the bottom
                                           rim: the Roman numeral
     toggles, free, lock, hide             as in toolParams
     out(P, h, st)     h.base = {n, b, digits:[most significant first], text, steps:[{n, q, r}], roman}
   Helpers: toBase(n, b) → "101101", romanOf(n) → "XLV"
   ============================================================ */
const BASE_DIGITS = "0123456789ABCDEF";
const toBase = (n, b) => Math.round(n).toString(b).toUpperCase();
function romanOf(n){
  if(n < 1 || n > 3999 || !Number.isInteger(n)) return null;
  const parts = [];
  [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]
    .forEach(([v, s]) => { while(n >= v){ parts.push([s, v]); n -= v; } });
  return {text:parts.map(p => p[0]).join(""), parts};
}

defTool("sustavy", {
  name:"Číselné sústavy",
  area:"Základy",
  desc:"To isté číslo v desiatkovej, dvojkovej, šestnástkovej alebo inej sústave. Rády, postupné delenie a rímske číslice.",
  topics:["a4"],
  presets:[
    {name:"Dvojková", cfg:{n:45, b:2, on:{rady:true, delenie:true}}},
    {name:"Šestnástková", cfg:{n:{v:254, max:4095}, b:16, on:{rady:true, delenie:true}}},
    {name:"Osmičková", cfg:{n:100, b:8, on:{rady:true, delenie:true}}},
    {name:"Rímske číslice", cfg:{n:{v:1994, max:3999}, b:10, on:{rim:true}}}
  ],
  help:"Číslo aj základ sa dajú prepísať. Do poľa **Zápis v sústave** môžeš napísať číslo priamo v zvolenej sústave, napríklad `101101` alebo `FE`.",
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const on = cfg.on || {rady:true, delenie:true};
    const params = toolParams({
      n:{v:45, min:0, max:1023, step:1, color:"b", note:"číslo v desiatkovej"},
      b:{v:2, min:2, max:16, step:1, color:"a", note:"základ sústavy"},
      rady:ck(false, "Rády a rozvinutý zápis", "d"),
      delenie:ck(false, "Postupné delenie základom", "a"),
      rim:ck(false, "Rímske číslice")
    }, Object.assign({}, cfg, {on}), env);
    const calc = P => {
      const n = Math.max(0, Math.round(P.n)), b = Math.max(2, Math.min(16, Math.round(P.b)));
      const text = toBase(n, b), digits = [...text].map(c => BASE_DIGITS.indexOf(c)), steps = [];
      let x = n;
      do { steps.push({n:x, q:Math.floor(x / b), r:x % b}); x = Math.floor(x / b); } while(x > 0);
      return {n, b, text, digits, steps, roman:romanOf(n)};
    };

    return {
      params,
      inputs:[{
        label:"Zápis v sústave so zvoleným základom", wide:true,
        read:st => calc(st.P).text,
        apply(){ return null; }
      }],
      init(st){
        /* the typed field needs the live base, so it is wired here instead of through cfg */
        st.w.inputs[0].apply = text => {
          const b = Math.round(st.P.b), t = String(text).trim().toUpperCase();
          if(!t) return null;
          const bad = [...t].find(c => BASE_DIGITS.indexOf(c) < 0 || BASE_DIGITS.indexOf(c) >= b);
          if(bad) return {error:`Číslica „${bad}“ v sústave so základom ${b} neexistuje.`};
          const v = parseInt(t, b);
          if(v > 1e6) return {error:"Príliš veľké číslo."};
          const lim = st.lim.n || (st.lim.n = {min:st.w.params.n.min, max:st.w.params.n.max});
          lim.max = Math.max(lim.max, v);
          st.P.n = v;
          toolCtl(st); toolUpdate(st);
          return null;
        };
      },
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb, k = r.digits.length;
        const dg = d => BASE_DIGITS[d];
        let h = `<div class="tw-tab"><div class="tw-bignum"><span class="cb">${r.n}</span><sub>10</sub> = <span class="cd">${r.text}</span><sub>${r.b}</sub></div>`;
        if(P.rady && !thumb || thumb && !P.rim){
          h += `<table><tbody><tr><th class="l">rád</th>${r.digits.map((d, i) => `<td class="m"><span class="ca">${r.b}</span><sup>${k - 1 - i}</sup></td>`).join("")}</tr>`
            + `<tr><th class="l">hodnota rádu</th>${r.digits.map((d, i) => `<td class="m">${Math.pow(r.b, k - 1 - i)}</td>`).join("")}</tr>`
            + `<tr class="sel"><th class="l">číslica</th>${r.digits.map(d => `<td class="m"><span class="cd">${dg(d)}</span>${d > 9 ? `<small> (${d})</small>` : ""}</td>`).join("")}</tr>`
            + `<tr><th class="l">spolu</th>${r.digits.map((d, i) => `<td class="m">${d * Math.pow(r.b, k - 1 - i)}</td>`).join("")}</tr></tbody></table>`;
        }
        if(P.delenie && !thumb){
          h += `<table><thead><tr><th>delenec</th><th class="m">: ${r.b}</th><th>podiel</th><th>zvyšok</th><th class="l">číslica</th></tr></thead><tbody>`
            + r.steps.map((s, i) => `<tr><td>${s.n}</td><td class="m">: <span class="ca">${r.b}</span> =</td><td>${s.q}</td><td><span class="cd">${s.r}</span></td><td class="l"><span class="cd">${dg(s.r)}</span> ${i === 0 ? "← posledná" : i === r.steps.length - 1 ? "← prvá" : ""}</td></tr>`).join("")
            + `</tbody></table>`;
        }
        if(P.rim){
          h += r.roman ? `<div class="tw-bignum"><span class="cb">${r.n}</span> = <span class="ca">${r.roman.text}</span></div>`
              + (thumb ? "" : `<table><tbody><tr>${r.roman.parts.map(p => `<td class="m"><span class="ca">${p[0]}</span></td>`).join("")}</tr><tr>${r.roman.parts.map(p => `<td class="m">${p[1]}</td>`).join("")}</tr></tbody></table>`)
            : `<p class="muted small">Rímskymi číslicami sa bežne píšu čísla od 1 do 3999.</p>`;
        }
        return h + "</div>";
      },
      out(P, h, st){
        const r = calc(P), k = r.digits.length;
        h.base = r;
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(P.rady){
          const terms = r.digits.map((d, i) => `\\vd{${d}} \\cdot \\va{${r.b}}^{${k - 1 - i}}`);
          o += h.calc(`${r.digits.length > 6 ? terms.slice(0, 2).join(" + ") + " + \\dots + " + terms[k - 1] : terms.join(" + ")} = \\vb{${r.n}}`);
        }
        if(P.delenie) o += h.p(`Zvyšky čítaj **zdola nahor**: $\\vd{${r.text}}_{${r.b}}$. Delenie sa končí, keď je podiel 0.`);
        if(r.b > 10) o += h.p(`Číslice nad 9 sa píšu písmenami: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.`);
        if(P.rim && r.roman) o += h.p(`Menšia číslica pred väčšou sa odčíta (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).`);
        o += h.p(`$${r.text}_{${r.b}}$ má ${k} ${k === 1 ? "číslicu" : k < 5 ? "číslice" : "číslic"}.`);
        return o;
      }
    };
  }
});

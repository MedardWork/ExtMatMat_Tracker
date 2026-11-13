/* ============================================================
   TOOL: rozklad — prime factorisation as a division ladder; with a second number also the greatest
   common divisor and the least common multiple. Draws HTML tables, no picture.
   cfg:
     a, b     84 | {v, min, max, lock}
     on       {dva, delitele, euklid}     dva: the second number, D(a, b) and n(a, b)
                                          delitele: every divisor of a        euklid: Euclid's algorithm
     toggles, free, lock, hide            as in toolParams
     out(P, h, st)     h.nt = {a, b, fa:[2,2,3,7], fb, pa:{2:2,3:1,7:1}, pb, nsd, nsn, divisors, prime}
   Helpers: primeFactors(n) → [2, 2, 3, 7], gcdOf(a, b), powTex({2:2, 3:1}) → "2^{2} \cdot 3"
   ============================================================ */
function primeFactors(n){
  const out = [];
  n = Math.abs(Math.round(n));
  for(let d = 2; n > 1 && d * d <= n; d++) while(n % d === 0){ out.push(d); n /= d; }
  if(n > 1) out.push(n);
  return out;
}
const gcdOf = (a, b) => b ? gcdOf(b, a % b) : Math.abs(a);
const primePowers = list => list.reduce((m, p) => { m[p] = (m[p] || 0) + 1; return m; }, {});
const powTex = m => Object.keys(m).filter(p => m[p] > 0).map(p => m[p] > 1 ? `${p}^{${m[p]}}` : p).join(" \\cdot ") || "1";

defTool("rozklad", {
  name:"Prvočíselný rozklad",
  area:"Základy",
  desc:"Číslo rozložené na prvočísla postupným delením. Pre dve čísla najväčší spoločný deliteľ a najmenší spoločný násobok.",
  topics:["a5"],
  presets:[
    {name:"Jedno číslo", cfg:{a:84, on:{delitele:true}}},
    {name:"NSD a nsn", cfg:{a:84, b:120, on:{dva:true}}},
    {name:"Euklidov algoritmus", cfg:{a:{v:1071, max:5000}, b:{v:462, max:5000}, on:{dva:true, euklid:true}}},
    {name:"Nesúdeliteľné", cfg:{a:35, b:48, on:{dva:true}}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const params = toolParams({
      a:{v:84, min:2, max:999, step:1, color:"a"},
      b:{v:120, min:2, max:999, step:1, color:"b"},
      dva:ck(false, "Druhé číslo: NSD a nsn"),
      delitele:ck(false, "Všetci delitelia čísla a", "a"),
      euklid:ck(false, "Euklidov algoritmus", "d")
    }, cfg, env);
    if(!params.dva.v && !env.full && !(cfg.toggles || []).includes("dva") && !cfg.note) params.b.hide = params.b.lock = true;
    const calc = P => {
      const a = Math.max(1, Math.round(P.a)), b = Math.max(1, Math.round(P.b));
      const fa = primeFactors(a), fb = primeFactors(b), pa = primePowers(fa), pb = primePowers(fb);
      const primes = [...new Set([...fa, ...fb])].sort((x, y) => x - y), nsd = gcdOf(a, b);
      const divisors = [];
      for(let d = 1; d <= a; d++) if(a % d === 0) divisors.push(d);
      const eu = [];
      for(let x = Math.max(a, b), y = Math.min(a, b); y > 0; [x, y] = [y, x % y]) eu.push({x, y, q:Math.floor(x / y), r:x % y});
      return {a, b, fa, fb, pa, pb, primes, nsd, nsn:a / nsd * b, divisors, eu, prime:fa.length === 1};
    };
    const ladder = (n, f, cls) => {
      let x = n, rows = "";
      f.forEach(p => { rows += `<tr><td>${x}</td><td class="l ${cls}"><b>${p}</b></td></tr>`; x /= p; });
      return `<table><tbody>${rows}<tr><td>1</td><td></td></tr></tbody></table>`;
    };
    const pw = (p, e) => e ? `${p}${e > 1 ? `<sup>${e}</sup>` : ""}` : "–";

    return {
      params,
      svg(P, st){
        const r = calc(P), thumb = st.env.thumb;
        let h = `<div class="tw-tab"><div class="tw-row">${ladder(r.a, r.fa, "ca")}${P.dva ? ladder(r.b, r.fb, "cb") : ""}</div>`;
        if(P.dva && !thumb){
          h += `<table><thead><tr><th class="l">prvočíslo</th>${r.primes.map(p => `<th class="m">${p}</th>`).join("")}</tr></thead><tbody>`
            + `<tr><th class="l ca">a = ${r.a}</th>${r.primes.map(p => `<td class="m">${pw(p, r.pa[p])}</td>`).join("")}</tr>`
            + `<tr><th class="l cb">b = ${r.b}</th>${r.primes.map(p => `<td class="m">${pw(p, r.pb[p])}</td>`).join("")}</tr>`
            + `<tr><th class="l cd">D: menší exponent</th>${r.primes.map(p => `<td class="m${Math.min(r.pa[p] || 0, r.pb[p] || 0) ? " yes" : ""}">${pw(p, Math.min(r.pa[p] || 0, r.pb[p] || 0))}</td>`).join("")}</tr>`
            + `<tr><th class="l cc">n: väčší exponent</th>${r.primes.map(p => `<td class="m hl">${pw(p, Math.max(r.pa[p] || 0, r.pb[p] || 0))}</td>`).join("")}</tr></tbody></table>`;
        }
        if(P.delitele && !thumb) h += `<p class="tw-list"><b>Delitelia ${r.a}:</b> ${r.divisors.length > 40 ? r.divisors.slice(0, 40).join(", ") + ", …" : r.divisors.join(", ")}</p>`;
        if(P.euklid && P.dva && !thumb) h += `<table><tbody>${r.eu.map(s => `<tr><td>${s.x}</td><td class="m">=</td><td>${s.q} · <span class="${s.r === 0 ? "cd" : ""}">${s.y}</span></td><td class="m">+</td><td>${s.r}</td></tr>`).join("")}</tbody></table>`;
        return h + "</div>";
      },
      out(P, h, st){
        const r = calc(P);
        h.nt = r;
        if(cfg.out) return cfg.out(P, h, st);
        let o = h.calc(`\\va{${r.a}} = ${powTex(r.pa)}`);
        if(r.prime) o += h.pill(`${r.a} je prvočíslo`, "ok");
        if(P.dva){
          const mn = {}, mx = {};
          r.primes.forEach(p => { mn[p] = Math.min(r.pa[p] || 0, r.pb[p] || 0); mx[p] = Math.max(r.pa[p] || 0, r.pb[p] || 0); });
          o += h.calc(`\\vb{${r.b}} = ${powTex(r.pb)}`);
          o += h.calc(`D(\\va{${r.a}}, \\vb{${r.b}}) = ${r.nsd > 1 ? powTex(mn) + " = " : ""}\\vd{${r.nsd}}`);
          o += h.calc(`n(\\va{${r.a}}, \\vb{${r.b}}) = ${powTex(mx)} = \\vc{${r.nsn}}`);
          o += h.p(`Kontrola: $D \\cdot n = ${r.nsd} \\cdot ${r.nsn} = ${r.nsd * r.nsn} = a \\cdot b$.`);
          if(r.nsd === 1) o += h.pill("nesúdeliteľné čísla", "flat");
          if(P.euklid) o += h.p(`Euklidov algoritmus: väčšie číslo deľ menším, potom deliteľa zvyškom. Posledný nenulový zvyšok je $D = \\vd{${r.nsd}}$.`);
        }
        if(P.delitele){
          const e = Object.values(r.pa);
          o += h.p(`Počet deliteľov: $${e.map(x => `(${x} + 1)`).join(" \\cdot ")} = ${r.divisors.length}$.`);
        }
        return o;
      }
    };
  }
});

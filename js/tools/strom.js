/* ============================================================
   TOOL: strom — a tree of choices that counts: the rule of product, choosing k of n elements
   (variations, permutations, combinations, with or without repetition), arrangements of a word. Plain SVG.
   cfg:
     typ      "strom"    a choice in stages                 volby:[3, 2, 2] (options per stage, sliders n1…),
                         mena:[["P1", "P2", "P3"], ["H1", "H2"], …] (labels), nazvy:["polievka", "hlavné jedlo", …]
              "vyber"    choose k of n elements             n, k (sliders), prvky:"ABCDEF" (their names),
                         switches poradie (order matters) and opak (an element may repeat)
              "slovo"    arrangements of the letters        slovo:"MAMA"
     vetva    3          the branch (leaf number from 1) marked from the start; the reader marks one by clicking a leaf
     on, toggles, free, lock, hide    as in toolParams
     out(P, h, st)     h.strom = {N (the count), druh, zoznam:[…] (every outcome as text), listy (leaves of the tree drawn), vetva (marked outcome)}
                       druh: "sucin" | "variacie" | "permutacie" | "variacie-op" | "kombinacie" | "kombinacie-op" | "slovo"
   ============================================================ */
defTool("strom", {
  name:"Strom možností",
  area:"Kombinatorika",
  desc:"Pravidlo súčinu, variácie, permutácie a kombinácie ako strom: každá vetva je jedna možnosť.",
  topics:["a38", "a40", "b36"],
  presets:[
    {name:"Pravidlo súčinu", cfg:{typ:"strom", volby:[3, 2, 2], nazvy:["polievka", "hlavné jedlo", "dezert"], mena:[["P1", "P2", "P3"], ["H1", "H2"], ["D1", "D2"]]}, tip:"Každá cesta stromom je jedna možnosť. Počty možností na jednotlivých úrovniach sa násobia."},
    {name:"Variácie", cfg:{typ:"vyber", n:4, k:2, on:{poradie:true}}, tip:"Vyberáš $k$ z $n$ a záleží na poradí. Na každej ďalšej úrovni je o jednu možnosť menej."},
    {name:"Permutácie", cfg:{typ:"vyber", n:4, k:4, on:{poradie:true}}, tip:"Poradia všetkých $n$ prvkov: $n \\cdot (n-1) \\cdots 1 = n!$"},
    {name:"Kombinácie", cfg:{typ:"vyber", n:4, k:2}, tip:"Keď na poradí nezáleží, každú skupinu strom obsahuje $k!$-krát. Preto sa počet variácií delí $k!$."},
    {name:"Variácie s opakovaním", cfg:{typ:"vyber", n:3, k:3, prvky:"123", on:{poradie:true, opak:true}}, tip:"Prvky sa môžu opakovať, na každej úrovni je znova $n$ možností: spolu $n^k$."},
    {name:"Poradia písmen slova", cfg:{typ:"slovo", slovo:"MAMA"}, tip:"Napíš slovo. Rovnaké písmená sa nedajú rozlíšiť, preto sa $n!$ delí faktoriálmi ich počtov."}
  ],
  help:"Kliknutím na **koniec vetvy** ju zvýrazníš a uvidíš, ktorú možnosť predstavuje.",

  make(cfg, env){
    const typ = ["strom", "vyber", "slovo"].includes(cfg.typ) ? cfg.typ : "strom";
    const volby = (cfg.volby || [3, 2, 2]).slice(0, 4), L = volby.length, cap = L <= 2 ? 6 : L === 3 ? 4 : 3;
    const word = String(cfg.slovo || "MAMA").toUpperCase().replace(/\s/g, "").slice(0, 8);
    const items = String(cfg.prvky || "ABCDEF");
    const defs = typ === "strom" ? Object.fromEntries(volby.map((v, i) => ["n" + (i + 1), {v:Math.min(cap, v), min:1, max:cap, step:1, color:"abdc"[i], name:`n${"₁₂₃₄"[i]}`, note:(cfg.nazvy || [])[i] || `${i + 1}. voľba`}]))
      : typ === "vyber" ? {n:{v:4, min:1, max:Math.min(5, items.length), step:1, color:"a", note:"počet prvkov"}, k:{v:2, min:1, max:4, step:1, color:"b", note:"koľko vyberáme"},
          poradie:{type:"check", v:false, name:"Záleží na poradí"}, opak:{type:"check", v:false, name:"Prvky sa môžu opakovať"}}
      : {};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, MAXL = 130;
    const label = (i, j) => typ === "strom" ? ((cfg.mena || [])[i] || [])[j] || `${"ABCD"[i]}${j + 1}` : "";

    /* what can follow a path, and how many stages there are */
    const model = P => {
      if(typ === "strom") return {depth:L, next:path => Array.from({length:P["n" + (path.length + 1)]}, (_, j) => label(path.length, j)), mult:volby.map((_, i) => P["n" + (i + 1)])};
      if(typ === "vyber"){
        const k = P.opak ? P.k : Math.min(P.k, P.n), el = items.slice(0, P.n).split("");
        return {depth:k, next:path => P.opak ? el : el.filter(e => !path.includes(e)), mult:Array.from({length:k}, (_, i) => P.opak ? P.n : P.n - i), k, el};
      }
      const cnt = {};
      word.split("").forEach(c => { cnt[c] = (cnt[c] || 0) + 1; });
      return {depth:word.length, cnt, next:path => Object.keys(cnt).filter(c => path.filter(x => x === c).length < cnt[c]).sort()};
    };
    const count = (P, m) => {
      if(typ === "strom") return {N:m.mult.reduce((a, b) => a * b, 1), druh:"sucin"};
      if(typ === "slovo") return {N:fact(word.length) / Object.values(m.cnt).reduce((a, c) => a * fact(c), 1), druh:"slovo"};
      const n = P.n, k = m.k;
      return P.poradie ? (P.opak ? {N:n ** k, druh:"variacie-op"} : {N:fact(n) / fact(n - k), druh:k === n ? "permutacie" : "variacie"})
        : P.opak ? {N:binom(n + k - 1, k), druh:"kombinacie-op"} : {N:binom(n, k), druh:"kombinacie"};
    };
    /* every leaf as its path; stops early when the tree would be too big to draw */
    const leaves = (m, max) => {
      const out = [], walk = path => {
        if(out.length > max) return;
        if(path.length === m.depth){ out.push(path); return; }
        m.next(path).forEach(x => walk([...path, x]));
      };
      walk([]);
      return out;
    };
    const sep = typ === "strom" ? " – " : "";
    const scene = (P, st) => toolDerive(st, "scene", () => {
      const m = model(P), c = count(P, m), lv = leaves(m, 720), big = lv.length > MAXL;
      /* without order only one leaf of each group counts: the one written in ascending order */
      const rep = path => typ !== "vyber" || P.poradie || path.every((x, i) => !i || items.indexOf(path[i - 1]) <= items.indexOf(x));
      const list = lv.length > 720 ? [] : lv.filter(rep).map(p => p.join(sep));
      return Object.assign(c, {m, lv, big, rep, zoznam:list, listy:lv.length});
    });

    return {
      params, aspect:`${W}/${H}`,
      hint:"Klikni na **koniec vetvy**: zvýrazní sa celá cesta.",
      init(st){ st.data = {sel:cfg.vetva ? cfg.vetva - 1 : -1}; },
      inputs:typ === "slovo" ? [{label:"Slovo (najviac 8 písmen)", value:word, apply(text){ const w = text.toUpperCase().replace(/[^\p{L}\d]/gu, "").slice(0, 8); return w ? Object.assign({}, cfg, {slovo:w}) : {error:"Napíš aspoň jedno písmeno."}; }}] : null,
      svg(P, st){
        const s = scene(P, st), thumb = st.env.thumb, m = s.m;
        if(s.big) return SV.wrap(W, H, SV.text(W / 2, H / 2 - 8, `Strom by mal ${fmtN(s.listy > 720 ? s.N : s.listy)} vetiev,`, "mid lg csoft") + SV.text(W / 2, H / 2 + 16, "na obrázok je to priveľa. Počet dá vzorec.", "mid csoft"));
        const n = s.lv.length, x0 = 22, x1 = W - (thumb ? 22 : 64), y0 = 22, y1 = H - (n <= 40 && !thumb ? 34 : 18);
        const lx = i => n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1), ly = d => y0 + (y1 - y0) * d / m.depth;
        const sel = st.data.sel >= 0 && st.data.sel < n ? st.data.sel : -1, selPath = sel >= 0 ? s.lv[sel] : null;
        /* a node = a prefix; it sits above the middle of its leaves */
        const nodes = new Map();
        s.lv.forEach((path, i) => { for(let d = 0; d <= m.depth; d++){ const key = path.slice(0, d).join("\u0001"), o = nodes.get(key) || {d, lo:i, hi:i, path:path.slice(0, d)}; o.hi = i; nodes.set(key, o); } });
        let edges = "", hot = "", dots = "", text = "";
        const perLevel = Array.from({length:m.depth + 1}, () => 0);
        nodes.forEach(o => { perLevel[o.d]++; });
        nodes.forEach(o => {
          const x = (lx(o.lo) + lx(o.hi)) / 2, y = ly(o.d);
          o.x = x;
          if(o.d){
            const par = nodes.get(o.path.slice(0, -1).join("\u0001")), px = (lx(par.lo) + lx(par.hi)) / 2, py = ly(o.d - 1);
            const on = selPath && o.path.every((v, i) => v === selPath[i]), dim = o.d === m.depth && !s.rep(o.path);
            const line = SV.line(px, py, x, y, on ? "s cd w3" : `s w1 ${dim ? "cgrid" : "csoft"}`);
            if(on) hot += line; else edges += line;
            const lab = o.path[o.path.length - 1], room = (x1 - x0) / perLevel[o.d];
            if(!thumb && room > lab.length * 7.5 + 5) text += SV.text(x, y + (o.d === m.depth ? 17 : -7), lab, `mid sm halo ${on ? "cd" : o.d === m.depth && !dim && typ === "vyber" && !P.poradie ? "ca" : ""}`);
            dots += SV.circle(x, y, o.d === m.depth ? 3 : 2.4, `f ${on ? "cd" : dim ? "cgrid" : o.d === m.depth && typ === "vyber" && !P.poradie ? "ca" : "csoft"}`);
          } else dots += SV.circle(x, y, 4, "f cink");
        });
        let side = "";
        if(!thumb && m.mult) m.mult.forEach((v, i) => { side += SV.text(W - 8, (ly(i) + ly(i + 1)) / 2 + 5, `× ${v}`, `end c${"abdc"[typ === "strom" ? i : 0]}`); });
        const hit = thumb ? "" : s.lv.map((_, i) => SV.rect(lx(i) - Math.max(4, (x1 - x0) / Math.max(1, n - 1) / 2), ly(m.depth) - 26, Math.max(8, (x1 - x0) / Math.max(1, n - 1)), 50, "hit", ` data-pick="${i}"`)).join("");
        return SV.wrap(W, H, edges + hot + dots + text + side + hit);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit) return;
          const i = Number(hit.dataset.pick);
          st.data.sel = st.data.sel === i ? -1 : i;
          toolUpdate(st);
        });
      },
      out(P, h, st){
        const s = scene(P, st), m = s.m, tn = h.tn, sel = st.data.sel >= 0 && st.data.sel < s.lv.length && !s.big ? s.lv[st.data.sel] : null;
        h.strom = {N:s.N, druh:s.druh, zoznam:s.zoznam, listy:s.listy, vetva:sel ? sel.join(sep) : null};
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(typ === "strom") o += h.calc(m.mult.map((v, i) => `\\v${"abdc"[i]}{${v}}`).join(" \\cdot ") + ` = ${tn(s.N)}`) + h.p("**Pravidlo súčinu:** počty možností v jednotlivých krokoch sa násobia.");
        else if(typ === "slovo"){
          const rep = Object.entries(m.cnt).filter(e => e[1] > 1);
          o += h.p(`Slovo **${esc(word)}**: ${word.length} písmen${rep.length ? ", opakuje sa " + rep.map(e => `${e[0]} (${e[1]}×)`).join(", ") : ", všetky rôzne"}.`)
            + h.calc(rep.length ? `\\dfrac{${word.length}!}{${rep.map(e => e[1] + "!").join(" \\cdot ")}} = \\dfrac{${tn(fact(word.length))}}{${tn(rep.reduce((a, e) => a * fact(e[1]), 1))}} = ${tn(s.N)}` : `${word.length}! = ${tn(s.N)}`)
            + (rep.length ? h.p("Výmena rovnakých písmen poradie nezmení, preto sa delí.") : "");
        } else {
          const n = P.n, k = m.k, fall = Array.from({length:k}, (_, i) => n - i).join(" \\cdot ");
          const name = {variacie:"Variácie bez opakovania", permutacie:"Permutácie", "variacie-op":"Variácie s opakovaním", kombinacie:"Kombinácie bez opakovania", "kombinacie-op":"Kombinácie s opakovaním"}[s.druh];
          o += h.pill(name, "ok");
          o += s.druh === "variacie" ? h.calc(`V(\\vb{${k}}, \\va{${n}}) = ${fall} = ${tn(s.N)}`)
            : s.druh === "permutacie" ? h.calc(`P(\\va{${n}}) = \\va{${n}}! = ${fall} = ${tn(s.N)}`)
            : s.druh === "variacie-op" ? h.calc(`V'(\\vb{${k}}, \\va{${n}}) = \\va{${n}}^{\\vb{${k}}} = ${tn(s.N)}`)
            : s.druh === "kombinacie" ? h.calc(`C(\\vb{${k}}, \\va{${n}}) = \\dbinom{\\va{${n}}}{\\vb{${k}}} = \\dfrac{${fall}}{\\vb{${k}}!} = \\dfrac{${tn(fact(n) / fact(n - k))}}{${tn(fact(k))}} = ${tn(s.N)}`)
              + h.p(`Strom má ${tn(s.listy)} vetiev, ale každú skupinu obsahuje $${k}! = ${fact(k)}$-krát. Počíta sa len farebná vetva.`)
            : h.calc(`C'(\\vb{${k}}, \\va{${n}}) = \\dbinom{\\va{${n}} + \\vb{${k}} - 1}{\\vb{${k}}} = ${tn(s.N)}`);
          if(P.k > P.n && !P.opak) o += h.p(`Bez opakovania sa dá vybrať najviac $${n}$ prvkov, strom má preto len ${n} poschodí.`);
        }
        if(sel) o += h.p(`Zvýraznená vetva: **${esc(sel.join(typ === "strom" ? " – " : " "))}**`);
        if(s.zoznam.length && typ !== "strom") o += `<div class="tw-list">${s.zoznam.slice(0, 60).map(esc).join(", ")}${s.zoznam.length > 60 ? ", …" : ""}</div>`;
        return o;
      }
    };
  }
});

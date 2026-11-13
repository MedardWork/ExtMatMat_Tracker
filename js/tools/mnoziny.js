/* ============================================================
   TOOL: mnoziny — Venn diagrams of two or three sets: shade the result of an operation, colour regions
   by clicking, or count the elements in each region. Plain SVG.
   cfg:
     typ      "operacie"   vyraz:"A ∩ B'"     the shaded set (typed as  A n B', A u B, A - B, (A u B)' …)
                           klikaj:true        the reader colours regions by clicking instead
                           hladaj:"A - B"     with klikaj: the set to find — st.ok turns true (goal:(P, st) => st.ok)
              "pocty"      numbers of elements: a, b, ab (both), u (everything); with n:3 also c, ac, bc, abc
     n        2 | 3        how many sets
     a, b, ab, u, …        a number or {v, min, max, lock};  free / lock / hide as in toolParams
     out(P, h, st)         h.venn = {atoms:[region ids], tex, regions:{…counts…}, union, ok}
   A region id is a bit mask: 1 = in A, 2 = in B, 4 = in C (0 = outside all of them).
   Helpers: setExpr("A n B'", 3) → {ok, atoms, tex}
   ============================================================ */
function setExpr(src, n = 2){
  const all = []; for(let m = 0; m < (1 << n); m++) all.push(m);
  const s = String(src).replace(/\s+/g, "");
  let p = 0;
  const not = a => all.filter(m => !a.includes(m));
  function expr(){
    let a = term();
    for(;;){
      const c = s[p];
      if(c === "∪" || c === "u" || c === "+" || c === "∨"){ p++; const b = term(); a = {v:all.filter(m => a.v.includes(m) || b.v.includes(m)), t:`${a.t} \\cup ${b.t}`, lo:1}; }
      else if(c === "-" || c === "−" || c === "\\" || c === "∖"){ p++; const b = term(); a = {v:a.v.filter(m => !b.v.includes(m)), t:`${a.t} \\setminus ${b.lo ? `(${b.t})` : b.t}`, lo:1}; }
      else return a;
    }
  }
  function term(){
    let a = post();
    for(;;){
      const c = s[p];
      if(c === "∩" || c === "n" || c === "&" || c === "*" || c === "∧"){ p++; const b = post(); a = {v:a.v.filter(m => b.v.includes(m)), t:`${a.lo ? `(${a.t})` : a.t} \\cap ${b.lo ? `(${b.t})` : b.t}`}; }
      else return a;
    }
  }
  function post(){
    let a = atom();
    while(s[p] === "'" || s[p] === "′" || s[p] === "’"){ p++; a = {v:not(a.v), t:`${a.par ? `(${a.t})` : a.t}'`}; }
    return a;
  }
  function atom(){
    const c = s[p++];
    if(c === "("){ const a = expr(); if(s[p++] !== ")") throw new Error("Chýba zátvorka )"); return {v:a.v, t:a.t, lo:a.lo, par:true}; }
    const i = "ABC".indexOf(c);
    if(i >= 0 && i < n) return {v:all.filter(m => m & (1 << i)), t:c};
    if(c === "U") return {v:all.slice(), t:"U"};
    if(c === "∅" || c === "0") return {v:[], t:"\\emptyset"};
    throw new Error(c ? `Nečakané „${c}“` : "Výraz nie je dokončený");
  }
  try{
    const a = expr();
    if(p < s.length) throw new Error(`Nečakané „${s[p]}“`);
    return {ok:true, atoms:a.v, tex:a.t.replace(/^\((.*)\)$/, (m, x) => /[()]/.test(x) ? m : x)};
  }catch(e){ return {ok:false, atoms:[], tex:"", err:e.message}; }
}

defTool("mnoziny", {
  name:"Vennove diagramy",
  area:"Základy",
  desc:"Dve alebo tri množiny ako kruhy. Vyfarbi prienik, zjednotenie, rozdiel či doplnok, alebo počítaj prvky v jednotlivých častiach.",
  topics:["a6", "a41"],
  presets:[
    {name:"Prienik", cfg:{vyraz:"A ∩ B"}},
    {name:"Zjednotenie", cfg:{vyraz:"A ∪ B"}},
    {name:"Rozdiel", cfg:{vyraz:"A − B"}},
    {name:"Doplnok", cfg:{vyraz:"(A ∪ B)'"}},
    {name:"Tri množiny", cfg:{n:3, vyraz:"(A ∪ B) ∩ C'"}},
    {name:"Vyfarbi sám", cfg:{n:3, klikaj:true}},
    {name:"Počty prvkov", cfg:{typ:"pocty"}},
    {name:"Počty, tri množiny", cfg:{typ:"pocty", n:3}}
  ],
  help:"Výraz píš písmenami `A`, `B`, `C`: zjednotenie `u`, prienik `n`, rozdiel `-`, doplnok apostrofom, napríklad `(A u B) n C'`. Pri ukážke **Vyfarbi sám** klikaj na časti diagramu.",
  textKeys:["vyraz", "hladaj"],
  fromText(kv){ const c = toolTextIn.call(this, kv); if(c.n !== 3) delete c.n; if(!c.vyraz && c.typ !== "pocty") c.klikaj = true; return c; },
  toText:toolTextOut,

  make(cfg, env){
    const n = cfg.n === 3 ? 3 : 2, typ = cfg.typ === "pocty" ? "pocty" : "operacie";
    const cnt = (v, name, note, color) => ({v, min:0, max:60, step:1, name, note, color});
    const defs = typ !== "pocty" ? {} : n === 2 ? {
      a:cnt(18, "|A|", null, "a"), b:cnt(15, "|B|", null, "b"), ab:cnt(7, "|A ∩ B|", null, "d"), u:cnt(30, "|U|", "všetkých")
    } : {
      a:cnt(20, "|A|", null, "a"), b:cnt(18, "|B|", null, "b"), c:cnt(15, "|C|", null, "c"),
      ab:cnt(8, "|A ∩ B|"), ac:cnt(7, "|A ∩ C|"), bc:cnt(6, "|B ∩ C|"), abc:cnt(3, "|A ∩ B ∩ C|", null, "d"), u:cnt(40, "|U|", "všetkých")
    };
    for(const id in defs) defs[id].plain = true;
    const params = toolParams(defs, cfg, env);
    const click = typ === "operacie" && (cfg.klikaj || (env.full && !cfg.vyraz));
    const shade = cfg.vyraz ? setExpr(cfg.vyraz, n) : null, want = cfg.hladaj ? setExpr(cfg.hladaj, n) : null;

    const W = 560, H = 320;
    const C = n === 2 ? [[218, 164, 108], [342, 164, 108]] : [[226, 128, 94], [334, 128, 94], [280, 218, 94]];
    const at = n === 2 ? {0:[62, 286], 1:[170, 168], 2:[390, 168], 3:[280, 168]}
      : {0:[58, 292], 1:[186, 104], 2:[374, 104], 4:[280, 268], 3:[280, 92], 5:[226, 196], 6:[334, 196], 7:[280, 160]};
    const names = ["A", "B", "C"], col = ["ca", "cb", "cc"];
    const NAMED = {"":"\\emptyset", "3":"A \\cap B", "1":"A \\setminus B", "2":"B \\setminus A", "1,3":"A", "2,3":"B", "1,2,3":"A \\cup B", "0":"(A \\cup B)'",
      "1,2":"(A \\setminus B) \\cup (B \\setminus A)", "0,1,2,3":"U", "0,2":"A'", "0,1":"B'", "0,1,2":"(A \\cap B)'"};
    const regions = P => {
      if(n === 2){ const r = {1:P.a - P.ab, 2:P.b - P.ab, 3:P.ab}; r.union = P.a + P.b - P.ab; r[0] = P.u - r.union; return r; }
      const r = {7:P.abc, 3:P.ab - P.abc, 5:P.ac - P.abc, 6:P.bc - P.abc};
      r[1] = P.a - P.ab - P.ac + P.abc; r[2] = P.b - P.ab - P.bc + P.abc; r[4] = P.c - P.ac - P.bc + P.abc;
      r.union = P.a + P.b + P.c - P.ab - P.ac - P.bc + P.abc; r[0] = P.u - r.union;
      return r;
    };
    const picked = st => (st.data && st.data.pick) || [];
    const shown = st => shade ? shade.atoms : click ? picked(st) : [];

    return {
      params, aspect:`${W}/${H}`,
      hint:click ? "Časti diagramu vyfarbíš **kliknutím**." : null,
      init(st){ if(click) st.data = {pick:[]}; },
      inputs:typ === "operacie" ? [{
        label:"Množina (A, B, C; u, n, -, ')", wide:true, value:cfg.vyraz || "",
        apply(text){
          if(!String(text).trim()) return Object.assign({}, cfg, {vyraz:null, klikaj:true});
          const e = setExpr(text, n);
          return e.ok ? Object.assign({}, cfg, {vyraz:text, klikaj:false}) : {error:e.err};
        }
      }] : null,

      svg(P, st){
        const id = "vn" + st.n, thumb = st.env.thumb, on = shown(st);
        const circ = (i, at = "") => `<circle cx="${C[i][0]}" cy="${C[i][1]}" r="${C[i][2]}"${at}/>`;
        let h = `<defs>${C.map((c, i) => `<clipPath id="${id}c${i}">${circ(i)}</clipPath><mask id="${id}m${i}"><rect width="${W}" height="${H}" fill="#fff"/>${circ(i, ' fill="#000"')}</mask>`).join("")}</defs>`;
        h += SV.rect(14, 10, W - 28, H - 20, "s csoft w1", ' rx="10"');
        on.forEach(m => {
          let g = SV.rect(14, 10, W - 28, H - 20, "bg cd vn-on", ' rx="10"');
          C.forEach((c, i) => { g = m & (1 << i) ? `<g clip-path="url(#${id}c${i})">${g}</g>` : `<g mask="url(#${id}m${i})">${g}</g>`; });
          h += g;
        });
        C.forEach((c, i) => { h += SV.circle(c[0], c[1], c[2], `s ${col[i]}`); });
        if(!thumb){
          const lab = n === 2 ? [[120, 62], [440, 62]] : [[140, 52], [420, 52], [386, 296]];
          lab.forEach((p, i) => { h += SV.text(p[0], p[1], names[i], `xl mid ${col[i]}`); });
          h += SV.text(W - 26, 34, "U", "lg end csoft");
          if(typ === "pocty"){
            const r = regions(P);
            Object.keys(at).forEach(m => { h += SV.text(at[m][0], at[m][1] + 6, fmtN(r[m]), `lg mid halo${r[m] < 0 ? " cno" : ""}`); });
          }
        }
        if(click && !thumb) h += `<rect class="hit" x="14" y="10" width="${W - 28}" height="${H - 20}" data-pick="1"/>`;
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          if(!e.target.closest("[data-pick]") || !st.data) return;
          const p = svgPoint(el, e);
          if(!p) return;
          let m = 0;
          C.forEach((c, i) => { if(Math.hypot(p[0] - c[0], p[1] - c[1]) < c[2]) m |= 1 << i; });
          const k = st.data.pick.indexOf(m);
          if(k >= 0) st.data.pick.splice(k, 1); else st.data.pick.push(m);
          toolUpdate(st);
        });
      },
      out(P, h, st){
        const v = {atoms:shown(st).slice().sort((x, y) => x - y)};
        if(typ === "pocty"){ v.regions = regions(P); v.union = v.regions.union; }
        if(want) v.ok = want.ok && want.atoms.slice().sort((x, y) => x - y).join() === v.atoms.join();
        st.ok = !!v.ok;
        v.tex = shade ? shade.tex : n === 2 ? NAMED[v.atoms.join(",")] || "" : "";
        h.venn = v;
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(typ === "pocty"){
          const r = v.regions, bad = Object.keys(at).some(m => r[m] < 0);
          o += n === 2 ? h.calc(`|A \\cup B| = \\va{${P.a}} + \\vb{${P.b}} - \\vd{${P.ab}} = ${r.union}`)
            : h.calc(`|A \\cup B \\cup C| = ${P.a} + ${P.b} + ${P.c} - ${P.ab} - ${P.ac} - ${P.bc} + \\vd{${P.abc}} = ${r.union}`);
          o += h.p(`Mimo všetkých množín: $${P.u} - ${r.union} = ${r[0]}$.`);
          o += bad ? h.pill("záporný počet: takéto zadanie nemôže nastať", "down") : h.p("Začni vždy od prieniku všetkých a postupuj von: z každého čísla odčítaj to, čo je už zapísané vnútri.");
        } else {
          if(want) o += h.p(`Vyfarbi množinu $${want.tex}$.`) + (v.ok ? h.pill("správne", "ok") : "");
          else if(v.tex != null && (shade || v.atoms.length || n === 2)) o += h.big(`\\vd{${v.tex || "\\emptyset"}}`);
          if(shade || click) o += h.p(v.atoms.length || click ? `Vyfarbené časti: ${v.atoms.length} z ${1 << n}.` : "Táto množina je prázdna, nič sa nevyfarbí.");
        }
        return o;
      }
    };
  }
});

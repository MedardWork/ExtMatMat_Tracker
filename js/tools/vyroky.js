/* ============================================================
   TOOL: vyroky — the truth table of a compound statement, built column by column.
   Draws an HTML table, no picture. The switches set the truth of A, B, … and mark that row.
   cfg:
     vyraz    "A => B"  or  "A => B; ¬B => ¬A"     one statement, or several split by ; to compare
              typed as:  ¬ ! ~ (not)   ∧ & (and)   ∨ | v (or)   ⇒ => -> (implies)   ⇔ <=> <-> (iff)
     kroky    false                               leave out the columns of the partial statements
     a, b, c, d   true | false | {v, lock}        the truth of A, B, C, D in the marked row
     toggles  ["a"]                               switches the reader may flip (all of them when left out)
     out(P, h, st)     h.log = {vars, cols:[{text, tex}], rows:[{vals, out:[…]}], taut, contra, equiv, row}
   Helpers: logicExpr("A => B") → {ok, vars, f(values), text, tex, subs}
   ============================================================ */
function logicExpr(src){
  const s = String(src).replace(/<=>|<->|⟺|↔/g, "⇔").replace(/=>|->|⟹|→/g, "⇒").replace(/[!~]/g, "¬").replace(/&&?|\*/g, "∧").replace(/\|\|?|v|\+/g, "∨").replace(/\s+/g, "");
  let p = 0;
  const bin = (op, a, b) => ({op, a, b});
  const iff = () => { let a = imp(); while(s[p] === "⇔"){ p++; a = bin("⇔", a, imp()); } return a; };
  const imp = () => { const a = or(); if(s[p] === "⇒"){ p++; return bin("⇒", a, imp()); } return a; };
  const or = () => { let a = and(); while(s[p] === "∨"){ p++; a = bin("∨", a, and()); } return a; };
  const and = () => { let a = not(); while(s[p] === "∧"){ p++; a = bin("∧", a, not()); } return a; };
  const not = () => { if(s[p] === "¬"){ p++; return {op:"¬", a:not()}; } return atom(); };
  const atom = () => {
    const c = s[p++];
    if(c === "("){ const a = iff(); if(s[p++] !== ")") throw new Error("Chýba zátvorka )"); return a; }
    if(c && /[A-Z]/.test(c)) return {v:c};
    throw new Error(c ? `Nečakané „${c}“` : "Výrok nie je dokončený");
  };
  const rank = {"⇔":1, "⇒":2, "∨":3, "∧":4, "¬":5};
  const TEX = {"⇔":"\\Leftrightarrow", "⇒":"\\Rightarrow", "∨":"\\lor", "∧":"\\land", "¬":"\\lnot"};
  const show = (n, tex) => {
    if(n.v) return n.v;
    const wrap = (x, strict) => { const t = show(x, tex); return !x.v && (rank[x.op] < rank[n.op] || (strict && rank[x.op] === rank[n.op])) ? `(${t})` : t; };
    if(n.op === "¬") return (tex ? TEX["¬"] + " " : "¬") + wrap(n.a);
    return `${wrap(n.a, n.op === "⇒")} ${tex ? TEX[n.op] : n.op} ${wrap(n.b, n.op !== "⇒" && n.op !== "∧" && n.op !== "∨")}`;
  };
  const ev = (n, V) => n.v ? !!V[n.v] : n.op === "¬" ? !ev(n.a, V) : n.op === "∧" ? ev(n.a, V) && ev(n.b, V) : n.op === "∨" ? ev(n.a, V) || ev(n.b, V)
    : n.op === "⇒" ? !ev(n.a, V) || ev(n.b, V) : ev(n.a, V) === ev(n.b, V);
  try{
    const ast = iff();
    if(p < s.length) throw new Error(`Nečakané „${s[p]}“`);
    const vars = new Set(), subs = [];
    (function walk(n){ if(n.v){ vars.add(n.v); return; } walk(n.a); if(n.b) walk(n.b); const t = show(n); if(!subs.some(x => x.text === t)) subs.push({text:t, tex:show(n, true), f:V => ev(n, V)}); })(ast);
    return {ok:true, vars:[...vars].sort(), f:V => ev(ast, V), text:show(ast), tex:show(ast, true), subs};
  }catch(e){ return {ok:false, vars:[], subs:[], f:() => false, text:"", tex:"", err:e.message}; }
}

defTool("vyroky", {
  name:"Pravdivostná tabuľka",
  area:"Základy",
  desc:"Zložený výrok rozobraný po stĺpcoch. Uvidíš, kedy platí, či je tautológiou a či sú dva výroky ekvivalentné.",
  topics:["a7", "a8", "a9"],
  presets:[
    {name:"Implikácia", cfg:{vyraz:"A ⇒ B"}},
    {name:"Spojky", cfg:{vyraz:"A ∧ B; A ∨ B; A ⇒ B; A ⇔ B", kroky:false}},
    {name:"Obmena implikácie", cfg:{vyraz:"A ⇒ B; ¬B ⇒ ¬A"}},
    {name:"Negácia implikácie", cfg:{vyraz:"¬(A ⇒ B); A ∧ ¬B"}},
    {name:"De Morgan", cfg:{vyraz:"¬(A ∧ B); ¬A ∨ ¬B"}},
    {name:"Tri výroky", cfg:{vyraz:"(A ∧ B) ⇒ C"}},
    {name:"Tautológia", cfg:{vyraz:"(A ⇒ B) ∨ (B ⇒ A)"}}
  ],
  help:"Výroky označ veľkými písmenami. Spojky: `!` alebo `¬` negácia, `&` a zároveň, `|` alebo, `=>` implikácia, `<=>` ekvivalencia. Viac výrokov na porovnanie oddeľ bodkočiarkou: `A => B; !B => !A`.",
  textKeys:["vyraz"],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const list = String(cfg.vyraz || "A ⇒ B").split(";").map(x => x.trim()).filter(Boolean).map(logicExpr);
    const good = list.filter(e => e.ok);
    const vars = [...new Set(good.flatMap(e => e.vars))].sort().slice(0, 4);
    const defs = {};
    vars.forEach((v, i) => { defs["abcd"[i]] = {type:"check", v:true, name:`${v} je pravdivý`, color:"abcd"[i]}; });
    const params = toolParams(defs, Object.assign({toggles:cfg.toggles || ["a", "b", "c", "d"]}, cfg), env);
    /* columns: every partial statement once, the statements themselves last and marked */
    const cols = [];
    good.forEach(e => {
      (cfg.kroky === false ? e.subs.slice(-1) : e.subs).forEach(s => {
        const main = s.text === e.text, old = cols.find(c => c.text === s.text);
        if(old) old.main = old.main || main; else cols.push({text:s.text, tex:s.tex, f:s.f, main});
      });
    });
    const table = () => {
      const rows = [], n = vars.length;
      for(let k = 0; k < (1 << n); k++){
        const V = {}, vals = [];
        vars.forEach((v, i) => { V[v] = !(k & (1 << (n - 1 - i))); vals.push(V[v]); });
        rows.push({vals, out:cols.map(c => c.f(V))});
      }
      return rows;
    };
    const rows = table(), mains = cols.map((c, i) => c.main ? i : -1).filter(i => i >= 0);
    const last = mains[mains.length - 1];
    const equiv = mains.length > 1 && rows.every(r => mains.every(i => r.out[i] === r.out[mains[0]]));
    const B = v => v ? "1" : "0";

    return {
      params,
      inputs:[{
        label:"Výrok (viac výrokov oddeľ bodkočiarkou)", wide:true, value:cfg.vyraz || "A ⇒ B",
        error:list.find(e => !e.ok) ? list.find(e => !e.ok).err : "",
        apply(text){
          const bad = String(text).split(";").map(x => x.trim()).filter(Boolean).map(logicExpr).find(e => !e.ok);
          if(bad) return {error:bad.err};
          if(!String(text).trim()) return {error:"Napíš výrok, napríklad A => B."};
          return Object.assign({}, cfg, {vyraz:text});
        }
      }],
      svg(P, st){
        const thumb = st.env.thumb;
        const cur = vars.map((v, i) => !!P["abcd"[i]]);
        let h = `<div class="tw-tab"><table><thead><tr>${vars.map((v, i) => `<th class="m c${"abcd"[i]}">${v}</th>`).join("")}${cols.map(c => `<th class="m${c.main ? " main" : ""}">${esc(c.text)}</th>`).join("")}</tr></thead><tbody>`;
        rows.forEach(r => {
          const sel = !thumb && r.vals.every((v, i) => v === cur[i]);
          h += `<tr${sel ? ' class="sel"' : ""}>${r.vals.map(v => `<td class="m">${B(v)}</td>`).join("")}${r.out.map((v, i) => `<td class="m${cols[i].main ? (v ? " yes" : " no") : ""}">${B(v)}</td>`).join("")}</tr>`;
        });
        return h + "</tbody></table></div>";
      },
      out(P, h, st){
        const cur = vars.map((v, i) => !!P["abcd"[i]]), row = rows.find(r => r.vals.every((v, i) => v === cur[i]));
        const taut = last != null && rows.every(r => r.out[last]), contra = last != null && rows.every(r => !r.out[last]);
        h.log = {vars, cols, rows, row, taut, contra, equiv};
        if(cfg.out) return cfg.out(P, h, st);
        if(!good.length) return h.p("Výrok sa nepodarilo prečítať.");
        let o = "";
        mains.forEach(i => { o += h.calc(`${cols[i].tex} \\;:\\; \\v${row.out[i] ? "b" : "a"}{${B(row.out[i])}}`); });
        o += h.p(`Vo vyznačenom riadku: ${vars.map((v, i) => `$${v} = ${B(cur[i])}$`).join(", ")}.`);
        if(mains.length > 1) o += equiv ? h.pill("ekvivalentné: stĺpce sa zhodujú v každom riadku", "ok") : h.pill("nie sú ekvivalentné: stĺpce sa niekde líšia", "down");
        else if(taut) o += h.pill("tautológia: platí vždy", "ok");
        else if(contra) o += h.pill("kontradikcia: neplatí nikdy", "down");
        else o += h.pill(`platí v ${rows.filter(r => r.out[last]).length} z ${rows.length} riadkov`, "flat");
        return o;
      }
    };
  }
});

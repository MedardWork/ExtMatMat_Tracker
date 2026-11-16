// Recomputes the arithmetic written in theory files: every "a = b" (or ≐, ≈, <, >, ≤, ≥, ≠) whose two sides
// are plain numbers, fractions, roots, powers, logs, sines… is evaluated and compared.
//   node dev/mathcheck.js            all topics in THEORY_LIST
//   node dev/mathcheck.js a2 c11     these topics
//   ALL=1 node dev/mathcheck.js      also list "=" that only holds after rounding (should be \doteq)
// It reads formulas only (tex fields and $…$ in texts), never the tools' configs. What it cannot read as
// numbers it skips, so silence means "nothing found", not "everything proved". Lines it prints need a look:
// some are real slips, some are notation it misreads (1 % = 10 ‰, a ratio 2 : 3 = 4 : 6 is fine).
const fs = require("fs");
const path = require("path");
const DIR = path.resolve(__dirname, "../js/data/theory");

/* ---------- TeX → number ---------- */
function tokens(src){
  let s = src.replace(/\\(?:left|right|displaystyle|bigl|bigr|Bigl|Bigr|big|Big|,|;|!|:|quad|qquad|mathbf|mathrm|boldsymbol|v[abcd](?![a-zA-Z])|dots|ldots|%|€)/g, m => /\\(?:quad|qquad)/.test(m) ? " " : /\\,/.test(m) ? " " : " ");
  s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1").replace(/ /g, " ");          // 1\,200 → 1200
  s = s.replace(/\\text\{[^{}]*\}/g, " ").replace(/\\ /g, " ").replace(/[€‰%°]/g, " ").replace(/\\(?:circ)\b/g, "°");
  s = s.replace(/\^\s*\{?\s*°\s*\}?/g, "°").replace(/\{,\}/g, ".").replace(/(\d),(\d)/g, "$1.$2");
  const out = [];
  let i = 0;
  while(i < s.length){
    const c = s[i];
    if(/\s/.test(c)){ i++; continue; }
    let m;
    if((m = s.slice(i).match(/^\d+(?:\.\d+)?/))){ out.push({t:"n", v:Number(m[0]), d:(m[0].split(".")[1] || "").length}); i += m[0].length; continue; }
    if((m = s.slice(i).match(/^\\[a-zA-Z]+/))){ out.push({t:"c", v:m[0].slice(1)}); i += m[0].length; continue; }
    if("+-*/:^(){}[]|!°_".includes(c)){ out.push({t:"o", v:c}); i++; continue; }
    if(c === "−"){ out.push({t:"o", v:"-"}); i++; continue; }
    if(c === "·"){ out.push({t:"c", v:"cdot"}); i++; continue; }
    if(c === "π"){ out.push({t:"c", v:"pi"}); i++; continue; }
    return null;                                                                     // a letter or anything else: not a pure number
  }
  return out;
}
const FN = {sin:Math.sin, cos:Math.cos, tg:Math.tan, tan:Math.tan, cotg:x => 1 / Math.tan(x), ln:Math.log, log:Math.log10, arcsin:Math.asin, arccos:Math.acos, arctg:Math.atan, arctan:Math.atan};
function evalTex(src){
  const tk = tokens(src);
  if(!tk || !tk.length) return null;
  let p = 0, decimals = 0, deg = false, plain = true;
  const peek = () => tk[p], isO = v => tk[p] && tk[p].t === "o" && tk[p].v === v, isC = v => tk[p] && tk[p].t === "c" && tk[p].v === v;
  const fail = () => { throw new Error("x"); };
  const group = () => { if(isO("{")){ p++; const v = sum(); if(!isO("}")) fail(); p++; return v; } return atomOne(); };
  const atomOne = () => { const t = tk[p]; if(!t) fail(); if(t.t === "n"){ p++; decimals = Math.max(decimals, t.d); return t.v; } return atom(); };
  function sum(){
    let a = term();
    for(;;){
      if(isO("+")){ p++; plain = false; a += term(); }
      else if(isO("-")){ p++; plain = false; a -= term(); }
      else return a;
    }
  }
  function term(){
    let a = unary();
    for(;;){
      const t = peek();
      if(!t) return a;
      if(isC("cdot") || isC("times") || isO("*")){ p++; plain = false; a *= unary(); }
      else if(isO("/") || isO(":") || isC("div")){ p++; plain = false; a /= unary(); }
      else if(t.t === "n" || isO("(") || isO("{") || isO("|") && !bars || (t.t === "c" && (t.v in FN || ["frac", "dfrac", "tfrac", "sqrt", "pi", "binom"].includes(t.v)))){ plain = false; a *= power(); }
      else return a;
    }
  }
  function unary(){ if(isO("-")){ p++; return -unary(); } if(isO("+")){ p++; return unary(); } return power(); }
  function power(){
    let a = postfix();
    if(isO("^")){ p++; plain = false; const b = isO("{") ? group() : isO("-") ? (p++, -atomOne()) : atomOne(); a = Math.pow(a, b); }
    return a;
  }
  function postfix(){
    let a = atom();
    for(;;){
      if(isO("!")){ p++; plain = false; let r = 1; for(let i = 2; i <= a; i++) r *= i; a = r; }
      else if(isO("°")){ p++; deg = true; }
      else return a;
    }
  }
  let bars = 0;
  function atom(){
    const t = tk[p++];
    if(!t) fail();
    if(t.t === "n"){ decimals = Math.max(decimals, t.d); return t.v; }
    if(t.t === "o"){
      if(t.v === "("){ const v = sum(); if(!isO(")")) fail(); p++; return v; }
      if(t.v === "{"){ const v = sum(); if(!isO("}")) fail(); p++; return v; }
      if(t.v === "|"){ bars++; const v = sum(); bars--; if(!isO("|")) fail(); p++; plain = false; return Math.abs(v); }
      fail();
    }
    plain = false;
    if(t.v === "pi") return Math.PI;
    if(t.v === "frac" || t.v === "dfrac" || t.v === "tfrac"){ const a = group(), b = group(); return a / b; }
    if(t.v === "binom"){ const n = group(), k = group(); let r = 1; for(let i = 1; i <= k; i++) r = r * (n - i + 1) / i; return Math.round(r); }
    if(t.v === "sqrt"){ let n = 2; if(isO("[")){ p++; n = sum(); if(!isO("]")) fail(); p++; } return Math.pow(group(), 1 / n); }
    if(t.v in FN){
      let base = null, pw = 1;
      if(t.v === "log" && isO("_")){ p++; base = group(); }
      if(isO("^")){ p++; pw = group(); }                       // sin^2 x
      const before = deg; deg = false;
      let arg = isO("(") || isO("{") ? atom() : unaryArg();
      if(isO("°")){ p++; deg = true; }
      if(deg && ["sin", "cos", "tg", "tan", "cotg"].includes(t.v)) arg = arg * Math.PI / 180;
      let v = FN[t.v](arg);
      if(deg && t.v.startsWith("arc")) fail();
      deg = before;
      if(base != null) v = Math.log(arg) / Math.log(base);
      return Math.pow(v, pw);
    }
    fail();
  }
  /* the argument of sin written without brackets: a number, a fraction, maybe times π */
  function unaryArg(){
    let a = isO("-") ? (p++, -1) : 1;
    a *= atom();
    while(peek() && (peek().t === "c" && ["pi", "frac", "dfrac", "tfrac"].includes(peek().v))) a *= atom();
    return a;
  }
  try{
    const v = sum();
    if(p < tk.length || !isFinite(v)) return null;
    return {v, decimals, plain};
  }catch(e){ return null; }
}

/* ---------- formulas of a file ---------- */
function formulas(id){
  const THEORY = {}, R = String.raw, out = [];
  const src = fs.readFileSync(path.join(DIR, id + ".js"), "utf8");
  new Function("THEORY", "R", "fact", "binom", "findRoots", "fmtN", "texN", src)(THEORY, R, () => 0, () => 0, () => [], String, String);
  const inText = (s, where) => { if(typeof s !== "string") return; (s.match(/\$[^$]+\$/g) || []).forEach(m => out.push([m.slice(1, -1), where])); };
  const t = THEORY[id];
  (t.brief || []).forEach(s => inText(s, "brief"));
  for(const sub in t.subs) t.subs[sub].forEach(b => {
    const w = sub.slice(0, 40);
    if(typeof b === "string") return inText(b, w);
    if(b.tex) out.push([b.tex, w + " / def"]);
    ["note", "ask", "take", "hint", "warn", "tip", "ex", "res"].forEach(k => inText(b[k], w + " / " + k));
    (b.steps || []).forEach(s => Array.isArray(s) ? (inText(s[0], w + " / ex"), s[1] && out.push([s[1], w + " / ex"])) : (inText(s.d, w), s.tex && out.push([s.tex, w + " / step"])));
    (b.cards || []).forEach(c => { inText(c.d, w + " / card"); if(c.tex) out.push([c.tex, w + " / card"]); });
    (b.map || []).forEach(m => { inText(m[0], w); inText(m[1], w); if(m[2]) out.push([m[2], w + " / map"]); });
    (b.sum || []).forEach(s => inText(s, w));
    (b.legend || []).forEach(l => l.forEach(x => inText(x, w)));
  });
  return out;
}

/* split at the top level (outside braces) by a regex that matches at the current position */
function splitTop(s, re){
  const parts = [], seps = [];
  let depth = 0, start = 0;
  for(let i = 0; i < s.length; i++){
    const c = s[i];
    if(c === "\\" && /[{}]/.test(s[i + 1] || "")){ i++; continue; }
    if(c === "{") depth++;
    else if(c === "}") depth--;
    else if(!depth){
      const m = s.slice(i).match(re);
      if(m && m.index === 0){ parts.push(s.slice(start, i)); seps.push(m[0]); i += m[0].length - 1; start = i + 1; }
    }
  }
  parts.push(s.slice(start));
  return {parts, seps};
}
const REL = /^(?:=|\\doteq|\\approx|\\neq|\\ne(?![a-zA-Z])|\\leq?(?![a-zA-Z])|\\geq?(?![a-zA-Z])|<|>)/;
const CUT = /^(?:\\Rightarrow|\\Leftrightarrow|\\Longrightarrow|\\implies|\\iff|\\to(?![a-zA-Z])|\\quad|\\qquad|;|,(?!\})(?=\s|\\)|\\\\|&|\\text\{[^{}]*[a-zA-Zá-ž]{2,}[^{}]*\})/;

function check(id){
  const found = [];
  formulas(id).forEach(([tex, where]) => {
    if(/\\begin\{/.test(tex)) tex = tex.replace(/\\begin\{[a-z]+\*?\}(\{[^{}]*\})?|\\end\{[a-z]+\*?\}/g, "\\\\");
    splitTop(tex, CUT).parts.forEach(stmt => {
      const {parts, seps} = splitTop(stmt, REL);
      if(parts.length < 2) return;
      const vals = parts.map(evalTex);
      for(let i = 0; i + 1 < parts.length; i++){
        const a = vals[i], b = vals[i + 1], op = seps[i];
        if(!a || !b) continue;
        check.pairs = (check.pairs || 0) + 1;
        const tol = 1e-9 * Math.max(1, Math.abs(a.v), Math.abs(b.v)), diff = Math.abs(a.v - b.v);
        const unit = Math.pow(10, -b.decimals), unitA = Math.pow(10, -a.decimals);
        let bad = null;
        if(op === "="){
          if(diff > tol){
            /* equal once rounded to the digits shown on either side: a rounding, which should be written ≐ */
            const rounded = b.plain && diff <= unit * .5 + tol || a.plain && diff <= unitA * .5 + tol;
            bad = rounded ? (process.env.ALL ? "= but only rounded" : null) : "NOT EQUAL";
          }
        } else if(op === "\\doteq" || op === "\\approx"){
          const u = b.plain ? unit : a.plain ? unitA : Math.max(unit, unitA);
          if(diff > u * 1.01 + tol && diff > Math.abs(b.v) * 0.06) bad = "FAR OFF";
          else if(diff > u * 1.01 + tol && op === "\\doteq") bad = "rounded wrongly";
        } else if(op === "<" && !(a.v < b.v) || op === ">" && !(a.v > b.v) || /^\\le/.test(op) && !(a.v <= b.v + tol) || /^\\ge/.test(op) && !(a.v >= b.v - tol)) bad = "INEQUALITY FALSE";
        else if(/^\\ne/.test(op) && diff <= tol) bad = "≠ BUT EQUAL";
        if(bad) found.push(`${id}  ${bad}:  ${parts[i].trim()}  ${op}  ${parts[i + 1].trim()}   [${fmt(a.v)} vs ${fmt(b.v)}]   — ${where}`);
      }
    });
  });
  return found;
}
const fmt = v => String(Math.round(v * 1e6) / 1e6);

const ids = process.argv.slice(2).length ? process.argv.slice(2)
  : eval(fs.readFileSync(path.join(DIR, "index.js"), "utf8") + ";THEORY_LIST");
let n = 0;
ids.forEach(id => { let f; try{ f = check(id); }catch(e){ console.log(id + "  could not be read: " + e.message); return; } f.forEach(l => console.log(l)); n += f.length; });
console.log((n ? `\n${n} place(s) to look at` : "nothing found") + ` (${check.pairs || 0} comparisons made)`);

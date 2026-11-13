/* ============================================================
   TOOLS — the shared engine behind every interactive tool
   A tool is written once with defTool(id, {name, desc, area, presets, make(cfg, env)}) and shows up
     · on its own page under Nástroje (everything unlocked, pan and zoom), and
     · inside theory or a note, pre-filled, with only the values that matter there unlocked.
   make() returns a widget:
     params   {id: {v, min, max, step, lock, color, name, note, type:"check"}}   sliders / switches
     points   {A:[x, y]}            draggable points — read them as P.Ax, P.Ay
     board    {bbox, tick, free, axes, axis, aspect}   → drawn with JSXGraph: draw(g, P, st)
     svg(P, st) + bind(el, st)      → or drawn as plain SVG, re-rendered on every change
     out(P, h, st)                  the text beside the picture
     inputs / actions               text fields and buttons (full page, or once unlocked)
   Any element <figure class="tw" data-tool="…"> that appears inside #view is mounted automatically
   and cleaned up when it leaves the page.
   ============================================================ */
const TOOLS = {};
const TOOL_BLOCKS = {};      /* theory embeds by key — their config may hold functions, so it can't sit in an attribute */
const toolLive = new Set();
let TOOL_HANDOFF = null;     /* what "Otvoriť v Nástrojoch" carries over to the tool's own page */

function defTool(id, spec){ TOOLS[id] = Object.assign({id}, spec); }

/* ---------- numbers the Slovak way: decimal comma, real minus ---------- */
function fmtN(n, d = 2){
  if(typeof n !== "number" || !isFinite(n)) return "—";
  const p = 10 ** d;
  let r = Math.round(n * p) / p;
  if(r === 0) r = 0;
  return String(r).replace(".", ",").replace("-", "−");
}
const texN = (n, d) => fmtN(n, d).replace(",", "{,}").replace("−", "-");
const round2 = n => Math.round(n * 100) / 100;

/* ============================================================
   EXPRESSIONS — "a*(x-m)^2+n", "2x + 1", "sin(x)/x" → something that can be evaluated and printed
   Letters are separate variables (kx = k·x) unless they spell a function or a name passed in.
   ============================================================ */
const MATH_FN = {
  sin:Math.sin, cos:Math.cos, tg:Math.tan, tan:Math.tan, cotg:x => 1 / Math.tan(x),
  sqrt:Math.sqrt, odm:Math.sqrt, abs:Math.abs, ln:Math.log, log:Math.log10, exp:Math.exp
};
const MATH_TEX = {sin:"\\sin", cos:"\\cos", tg:"\\tg", tan:"\\tg", cotg:"\\cotg", ln:"\\ln", log:"\\log", exp:"\\exp"};
const exprCache = new Map();

function exprTokens(s, names){
  const known = [...names, ...Object.keys(MATH_FN), "pi"].sort((a, b) => b.length - a.length);
  s = s.replace(/[₀-₉]/g, c => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).replace(/π/g, "pi").replace(/²/g, "^2").replace(/³/g, "^3");
  const out = [];
  let i = 0;
  while(i < s.length){
    const c = s[i];
    if(/\s/.test(c)){ i++; continue; }
    if(/\d/.test(c)){
      const m = s.slice(i).match(/^\d+(?:[.,]\d+)?/);
      out.push({t:"n", v:Number(m[0].replace(",", "."))});
      i += m[0].length; continue;
    }
    if(/[a-zA-Z]/.test(c)){
      const k = known.find(n => s.startsWith(n, i));
      if(k){ out.push({t:MATH_FN[k] && !names.includes(k) ? "f" : "v", v:k}); i += k.length; continue; }
      const m = s.slice(i).match(/^[a-zA-Z]\d*/);
      out.push({t:"v", v:m[0]});
      i += m[0].length; continue;
    }
    if("+-−*·×/:^()|".includes(c)){
      out.push({t:"o", v:c === "−" ? "-" : c === "·" || c === "×" ? "*" : c === ":" ? "/" : c});
      i++; continue;
    }
    throw new Error(`Neznámy znak „${c}“`);
  }
  return out;
}

function exprParse(src, names){
  const tk = exprTokens(src, names);
  let p = 0, bars = 0;
  const eat = v => tk[p] && tk[p].t === "o" && tk[p].v === v ? (p++, true) : false;
  function sum(){
    let a = term();
    for(;;){
      if(eat("+")) a = {op:"+", a, b:term()};
      else if(eat("-")) a = {op:"-", a, b:term()};
      else return a;
    }
  }
  function term(){
    let a = unary();
    for(;;){
      const t = tk[p];
      if(eat("*")) a = {op:"*", a, b:unary()};
      else if(eat("/")) a = {op:"/", a, b:unary()};
      else if(t && (t.t !== "o" || t.v === "(" || (t.v === "|" && !bars))) a = {op:"*", a, b:power()};
      else return a;
    }
  }
  function unary(){
    if(eat("-")) return {op:"neg", a:unary()};
    if(eat("+")) return unary();
    return power();
  }
  function power(){
    const a = atom();
    return eat("^") ? {op:"^", a, b:unary()} : a;
  }
  function atom(){
    const t = tk[p++];
    if(!t) throw new Error("Výraz nie je dokončený");
    if(t.t === "n") return {num:t.v};
    if(t.t === "v") return {v:t.v};
    if(t.t === "f"){
      if(!eat("(")) throw new Error(`Za ${t.v} patrí zátvorka`);
      const a = sum();
      if(!eat(")")) throw new Error("Chýba zátvorka )");
      return {fn:t.v, a};
    }
    if(t.v === "("){
      const a = sum();
      if(!eat(")")) throw new Error("Chýba zátvorka )");
      return a;
    }
    if(t.v === "|"){
      bars++;
      const a = sum();
      bars--;
      if(!eat("|")) throw new Error("Chýba druhá zvislá čiara |");
      return {fn:"abs", a};
    }
    throw new Error(`Nečakané „${t.v}“`);
  }
  const ast = sum();
  if(p < tk.length) throw new Error(`Nečakané „${tk[p].v}“`);
  return ast;
}

function exprEval(n, s){
  if("num" in n) return n.num;
  if("v" in n){
    const v = s[n.v];
    return v !== undefined ? Number(v) : n.v === "pi" ? Math.PI : n.v === "e" ? Math.E : NaN;
  }
  if(n.fn) return MATH_FN[n.fn](exprEval(n.a, s));
  const a = exprEval(n.a, s);
  if(n.op === "neg") return -a;
  const b = exprEval(n.b, s);
  switch(n.op){
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
    default:  return Math.pow(a, b);
  }
}
function exprVars(n, set = new Set()){
  if("v" in n) set.add(n.v);
  if(n.a) exprVars(n.a, set);
  if(n.b) exprVars(n.b, set);
  return set;
}

/* {ok, f(scope), vars, ast, err} — a number or a function passes straight through */
function mathExpr(src, names = []){
  if(typeof src === "number") return {ok:true, f:() => src, vars:[], ast:{num:src}};
  if(typeof src === "function") return {ok:true, f:src, vars:[], ast:null};
  const key = names.join(",") + "|" + src;
  if(exprCache.has(key)) return exprCache.get(key);
  let r;
  try{
    const ast = exprParse(String(src), names);
    r = {ok:true, ast, f:s => exprEval(ast, s), vars:[...exprVars(ast)]};
  }catch(e){
    r = {ok:false, ast:null, f:() => NaN, vars:[], err:e.message};
  }
  if(exprCache.size > 400) exprCache.clear();
  exprCache.set(key, r);
  return r;
}

/* ---------- printing: put the current values in, tidy up (1·x → x, + −2 → − 2), write TeX ---------- */
function exprFill(n, P, colors){
  if("num" in n) return n;
  if("v" in n) return n.v in P && typeof P[n.v] !== "undefined" && n.v !== "x" ? {num:Number(P[n.v]), col:colors[n.v]} : n;
  if(n.fn) return {fn:n.fn, a:exprFill(n.a, P, colors)};
  return n.op === "neg" ? {op:"neg", a:exprFill(n.a, P, colors)} : {op:n.op, a:exprFill(n.a, P, colors), b:exprFill(n.b, P, colors)};
}
function exprTidy(n){
  if("num" in n || "v" in n) return n;
  if(n.fn) return {fn:n.fn, a:exprTidy(n.a)};
  const a = exprTidy(n.a);
  const is = (x, v) => "num" in x && x.num === v;
  const negLead = x => x.op === "*" && "num" in x.a && x.a.num < 0;
  const flip = x => exprTidy({op:"*", a:{num:-x.a.num, col:x.a.col}, b:x.b});
  if(n.op === "neg"){
    if("num" in a) return {num:-a.num, col:a.col};
    return a.op === "neg" ? a.a : {op:"neg", a};
  }
  const b = exprTidy(n.b);
  switch(n.op){
    case "*":
      if(is(a, 0) || is(b, 0)) return {num:0};
      if(is(a, 1)) return b;
      if(is(b, 1)) return a;
      if(is(a, -1)) return exprTidy({op:"neg", a:b});
      if(a.op === "neg") return {op:"neg", a:exprTidy({op:"*", a:a.a, b})};   /* (−u)·v → −(u·v), so the sign leads */
      if(b.op === "neg") return {op:"neg", a:exprTidy({op:"*", a, b:b.a})};
      return {op:"*", a, b};
    case "+":
      if(is(b, 0)) return a;
      if(is(a, 0)) return b;
      if("num" in b && b.num < 0) return {op:"-", a, b:{num:-b.num, col:b.col}};
      if(b.op === "neg") return {op:"-", a, b:b.a};
      if(negLead(b)) return {op:"-", a, b:flip(b)};
      return {op:"+", a, b};
    case "-":
      if(is(b, 0)) return a;
      if(is(a, 0)) return exprTidy({op:"neg", a:b});
      if("num" in b && b.num < 0) return {op:"+", a, b:{num:-b.num, col:b.col}};
      if(b.op === "neg") return {op:"+", a, b:b.a};
      if(negLead(b)) return {op:"+", a, b:flip(b)};
      return {op:"-", a, b};
    case "/":
      if(is(b, 1)) return a;
      if(is(a, 0)) return {num:0};
      return {op:"/", a, b};
    default:
      if(is(b, 1)) return a;
      if(is(b, 0)) return {num:1};
      return {op:"^", a, b};
  }
}
function exprTex(n){
  const paint = (s, col) => col ? `\\v${col}{${s}}` : s;
  const par = s => `\\left(${s}\\right)`;
  const leadsWithNumber = x => "num" in x || x.op === "/" || ((x.op === "*" || x.op === "^") && leadsWithNumber(x.a));
  const loose = x => x.op === "+" || x.op === "-" || x.op === "neg" || ("num" in x && x.num < 0);
  if("num" in n) return paint(texN(n.num, 4), n.col);
  if("v" in n){
    if(n.v === "pi") return "\\pi";
    const m = n.v.match(/^([a-zA-Z])(.+)$/);
    return m ? `${m[1]}_{${m[2]}}` : n.v;
  }
  if(n.fn){
    const a = exprTex(n.a);
    if(n.fn === "sqrt" || n.fn === "odm") return `\\sqrt{${a}}`;
    if(n.fn === "abs") return `\\left|${a}\\right|`;
    return `${MATH_TEX[n.fn]}${"v" in n.a || ("num" in n.a && n.a.num >= 0) ? " " + a : par(a)}`;
  }
  if(n.op === "neg") return "-" + (n.a.op === "+" || n.a.op === "-" ? par(exprTex(n.a)) : exprTex(n.a));
  if(n.op === "+") return `${exprTex(n.a)} + ${exprTex(n.b)}`;
  if(n.op === "-") return `${exprTex(n.a)} - ${n.b.op === "+" || n.b.op === "-" ? par(exprTex(n.b)) : exprTex(n.b)}`;
  if(n.op === "/") return `\\dfrac{${exprTex(n.a)}}{${exprTex(n.b)}}`;
  if(n.op === "*"){
    const l = loose(n.a) && !("num" in n.a) ? par(exprTex(n.a)) : exprTex(n.a);
    const r = loose(n.b) ? par(exprTex(n.b)) : exprTex(n.b);
    return leadsWithNumber(n.b) && !loose(n.b) ? `${l} \\cdot ${r}` : l + r;
  }
  const base = "v" in n.a || ("num" in n.a && n.a.num >= 0) ? exprTex(n.a) : par(exprTex(n.a));
  return `${base}^{${exprTex(n.b)}}`;
}
/* TeX of an expression with parameter values filled in; colors = {param: "a"|"b"|"c"|"d"} */
function exprShow(src, P, colors = {}, names = []){
  const e = mathExpr(src, names);
  return e.ok && e.ast ? exprTex(exprTidy(exprFill(e.ast, P, colors))) : "";
}

/* "[0; {q}]" → "[0; 2,5]" — {expr} or {expr|decimals} */
function toolTpl(s, scope, names){
  return String(s).replace(/\{([^{}|]+)(?:\|(\d))?\}/g, (_, ex, d) => fmtN(mathExpr(ex, names).f(scope), d ? Number(d) : 2));
}

/* a value typed by hand: "2,5", "−1/3", "sqrt(2)", "pi/2" all work */
function toolParse(text){
  const t = String(text).trim();
  if(!t) return NaN;
  const v = mathExpr(t).f({});
  return isFinite(v) ? Math.round(v * 1e4) / 1e4 : NaN;
}

/* ---------- tools written into a note as "key: value" lines ---------- */
const toolNums = s => (String(s).match(/[-−]?\d+(?:[.,]\d+)?/g) || []).map(x => Number(x.replace("−", "-").replace(",", ".")));
const toolWords = s => norm(s).split(/[,;]+/).map(x => x.trim()).filter(Boolean);
const toolNum = n => String(round2(n));

/* ---------- numeric: where a function crosses zero, and where it turns ---------- */
function findRoots(f, lo, hi, n = 480){
  const out = [], h = (hi - lo) / n;
  const add = x => { const r = Math.round(x * 1e7) / 1e7; if(!out.some(o => Math.abs(o - r) < 1e-4)) out.push(r); };
  let px = lo, py = f(lo);
  for(let i = 1; i <= n; i++){
    const x = lo + i * h, y = f(x);
    if(isFinite(py) && isFinite(y)){
      if(py === 0) add(px);
      else if(py * y < 0){
        if(Math.abs(y - py) > 1e6) { px = x; py = y; continue; }   /* a jump across an asymptote, not a root */
        let a = px, b = x, fa = py;
        for(let k = 0; k < 50; k++){ const m = (a + b) / 2, fm = f(m); if(fa * fm <= 0) b = m; else { a = m; fa = fm; } }
        add((a + b) / 2);
      }
    }
    px = x; py = y;
  }
  if(isFinite(py) && py === 0) add(px);
  /* a graph that only touches the axis never changes sign — look for those separately */
  findTurns(f, lo, hi, n).forEach(t => { if(Math.abs(t.y) < 1e-6) add(t.x); });
  return out.sort((a, b) => a - b);
}
function findTurns(f, lo, hi, n = 480){
  const out = [], h = (hi - lo) / n;
  for(let i = 1; i < n; i++){
    const x = lo + i * h, y0 = f(x - h), y1 = f(x), y2 = f(x + h);
    if(!isFinite(y0) || !isFinite(y1) || !isFinite(y2)) continue;
    const up = y1 >= y0 && y1 > y2, down = y1 <= y0 && y1 < y2;
    if(!up && !down) continue;
    let a = x - h, b = x + h;
    const s = up ? -1 : 1;
    for(let k = 0; k < 60; k++){
      const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
      if(s * f(m1) < s * f(m2)) b = m2; else a = m1;
    }
    const tx = Math.round((a + b) / 2 * 1e6) / 1e6;
    if(!out.some(o => Math.abs(o.x - tx) < 1e-3)) out.push({x:tx, y:f(tx), max:up});
  }
  return out;
}

/* ============================================================
   JSXGraph — loaded only when the first board is needed (it is about 1 MB)
   ============================================================ */
let jxgWait = null;
function needJXG(){
  if(window.JXG) return Promise.resolve();
  return jxgWait ||= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "vendor/jsxgraph/jsxgraphcore.js";
    s.onload = () => window.JXG ? res() : rej(new Error("JSXGraph"));
    s.onerror = () => { jxgWait = null; rej(new Error("JSXGraph")); };
    document.head.appendChild(s);
  });
}

function toolColors(){
  const cs = getComputedStyle(document.documentElement);
  const c = n => cs.getPropertyValue(n).trim();
  return {ink:c("--ink"), soft:c("--ink-soft"), grid:c("--rule"), axis:c("--blank"), panel:c("--panel"),
          a:c("--va"), b:c("--vb"), c:c("--dk"), d:c("--vd"), ok:c("--l4"), warn:c("--l1")};
}

/* number | "expression" | function(P, st)  →  () => number */
function toolVal(v, st){
  if(typeof v === "number") return () => v;
  if(typeof v === "function") return () => v(st.P, st);
  const e = mathExpr(v, st.names);
  return () => e.f(st.P);
}

/* where a label sits relative to its point: pixels + anchors */
const LABEL_AT = {
  r:[11, 0, "left", "middle"], l:[-11, 0, "right", "middle"], t:[0, 12, "middle", "bottom"], b:[0, -12, "middle", "top"],
  tr:[9, 9, "left", "bottom"], tl:[-9, 9, "right", "bottom"], br:[9, -9, "left", "top"], bl:[-9, -9, "right", "top"]
};

/* drawing helpers handed to a widget's draw(): every coordinate may be a number, an expression or a function */
function toolG(b, C, st){
  const base = {highlight:false, fixed:true};
  const V = v => toolVal(v, st);
  const col = c => C[c] || c || C.ink;
  const when = o => o && o.if != null ? V(o.if) : null;
  /* what is left of a feature's options once our own keys are taken out is passed on to JSXGraph */
  const strip = o => { const r = Object.assign({}, o); ["if", "label", "at", "pt", "color", "labelColor", "w", "open"].forEach(k => delete r[k]); return r; };
  const g = {
    b, C, V, col,
    fn(f, color, o, dom){
      const F = typeof f === "function" ? x => f(x, st.P) : (e => x => { st.scope.x = x; return e.f(st.scope); })(mathExpr(f, st.names));
      const args = dom ? [F, V(dom[0]), V(dom[1])] : [F];
      return b.create("functiongraph", args, Object.assign({}, base, {strokeColor:col(color), strokeWidth:2.6}, o));
    },
    hid(x, y){ return b.create("point", [V(x), V(y)], Object.assign({}, base, {visible:false, withLabel:false})); },
    pt(x, y, color, o = {}){
      const c = when(o), fx = V(x), fy = V(y);
      const X = c ? () => c() ? fx() : NaN : fx;
      const p = b.create("point", [X, fy], Object.assign({}, base,
        {withLabel:false, size:4.5, fillColor:col(color), strokeColor:C.panel, strokeWidth:2, showInfobox:false},
        o.open ? {fillColor:C.panel, strokeColor:col(color), strokeWidth:2.2} : null, strip(o)));   /* open: a point that is left out */
      if(o.label != null) g.txt(X, fy, o.label, o.labelColor || color, {at:o.at || "tr"});
      return p;
    },
    seg(p1, p2, color, o = {}){
      const c = when(o);
      const mk = p => Array.isArray(p) ? g.hid(c ? (f => () => c() ? f() : NaN)(V(p[0])) : p[0], p[1]) : p;
      return b.create("segment", [mk(p1), mk(p2)], Object.assign({}, base, {strokeColor:col(color), strokeWidth:2}, strip(o)));
    },
    line(p1, p2, color, o = {}){
      const mk = p => Array.isArray(p) ? g.hid(p[0], p[1]) : p;
      return b.create("line", [mk(p1), mk(p2)], Object.assign({}, base, {strokeColor:col(color), strokeWidth:1.4}, strip(o)));
    },
    /* a curve given by x(t), y(t) — for things that are not graphs of functions, and for mirrored graphs */
    curve(x, y, from, to, color, o = {}){
      const ex = mathExpr(x, [...st.names, "t"]), ey = mathExpr(y, [...st.names, "t"]);
      const at = (e, t) => { const s = Object.create(st.P); s.t = t; return e.f(s); };
      return b.create("curve", [t => at(ex, t), t => at(ey, t), V(from), V(to)],
        Object.assign({}, base, {strokeColor:col(color), strokeWidth:2.6}, strip(o)));
    },
    circle(cx, cy, r, color, o = {}){
      return b.create("circle", [g.hid(cx, cy), V(r)], Object.assign({}, base, {strokeColor:col(color), strokeWidth:2, fillColor:"none"}, strip(o)));
    },
    poly(pts, color, o = {}){
      return b.create("polygon", pts.map(p => Array.isArray(p) ? g.hid(p[0], p[1]) : p), Object.assign({}, base,
        {fillColor:col(color), fillOpacity:.16, withLines:false, vertices:{visible:false}}, strip(o)));
    },
    /* s: text, "template {expr}" or function(P) */
    txt(x, y, s, color, o = {}){
      const at = LABEL_AT[o.at] || [0, 0, o.anchorX || "left", o.anchorY || "middle"];
      const c = when(o), fx = V(x), fy = V(y);
      const S = typeof s === "function" ? () => s(st.P, st) : /\{/.test(s) ? () => toolTpl(s, st.P, st.names) : s;
      return b.create("text", [() => fx() + at[0] / b.unitX, () => fy() + at[1] / b.unitY, S], Object.assign({}, base, {
        strokeColor:col(color), fontSize:13, anchorX:at[2], anchorY:at[3],
        visible:c ? () => !!c() && isFinite(fx()) && isFinite(fy()) : () => isFinite(fx()) && isFinite(fy()),
        cssStyle:"font-weight:650;background:var(--panel);padding:0 4px;border-radius:3px;"}, strip(o)));
    }
  };
  return g;
}

/* ============================================================
   WIDGET — one mounted tool
   ============================================================ */
const TW_LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2"/></svg>';
const TW_HAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg>';
const TW_TAG = {skus:"Vyskúšaj", uloha:"Úloha", obr:"Obrázok"};

/* helpers handed to out(): h.p("text with $math$"), h.big(tex), h.calc(tex), h.pill("rastie", "up") */
const TW_H = {
  n:fmtN, tn:texN,
  m:s => inline(s),
  p:s => `<div>${inline(s)}</div>`,
  big:t => t ? `<div class="tw-big">${tex(t, false)}</div>` : "",
  calc:t => `<div class="tw-calc">${tex("\\displaystyle " + t, false)}</div>`,
  pill:(s, k) => `<div><span class="tw-pill ${k || ""}">${esc(s)}</span></div>`
};

/* the frame around a tool; mountTool() fills .tw-body. b = {tool, cfg, kind, ask, take, hint, goal} */
function toolFigure(b, key, cls = ""){
  TOOL_BLOCKS[key] = b;
  const kind = b.kind || "skus";
  return `<figure class="tw ${cls}${kind === "uloha" ? " tw-task" : ""}" data-tool="${esc(b.tool)}" data-tk="${esc(key)}">
    ${b.ask ? `<div class="tw-h"><span class="tw-tag">${TW_TAG[kind] || TW_TAG.skus}</span><p>${inline(b.ask)}</p></div>` : ""}
    <div class="tw-body"></div>
    ${b.take ? `<figcaption class="tw-take"><b>Čo si videl:</b> ${inline(b.take)}</figcaption>` : ""}
    ${b.hint ? `<details class="tw-hint"><summary>Nápoveď</summary><p>${inline(b.hint)}</p></details>` : ""}
  </figure>`;
}

function toolSig(st){
  let s = "";
  for(const k in st.P) s += k + "=" + st.P[k] + ";";
  return s + (st.data ? JSON.stringify(st.data) : "");
}

function toolDefaults(st){
  const w = st.w, old = st.P || {};
  if(st.jp) for(const n in st.jp) delete st.jp[n];
  st.jp = {};
  st.P = {};
  for(const id in w.params){
    const p = w.params[id];
    st.P[id] = st.keep && id in old && typeof old[id] === typeof p.v ? old[id] : p.v;
  }
  st.pts = {};
  for(const n in (w.points || {})){
    st.pts[n] = w.points[n].slice(0, 2);
    /* P.Ax / P.Ay follow the live point once the board exists */
    ["x", "y"].forEach((ax, i) => Object.defineProperty(st.P, n + ax, {
      enumerable:true, configurable:true,
      get:() => st.jp[n] ? (i ? st.jp[n].Y() : st.jp[n].X()) : st.pts[n][i]
    }));
  }
  st.lim = {};   /* slider ranges widened by typed values */
  st.names = [...Object.keys(w.params), ...Object.keys(w.points || {}).flatMap(n => [n + "x", n + "y"])];
  st.scope = Object.create(st.P);
  st.memo = {};
  if(w.init) w.init(st);
}

/* derived values, recomputed only when a parameter or a point has moved */
function toolDerive(st, key, fn){
  const sig = toolSig(st);
  const m = st.memo[key];
  if(m && m.sig === sig) return m.v;
  const v = fn(st.P, st);
  st.memo[key] = {sig, v};
  return v;
}

function toolBoard(st){
  const w = st.w, bd = w.board, C = toolColors();
  if(st.board){
    for(const n in st.jp) st.pts[n] = [st.jp[n].X(), st.jp[n].Y()];
    if(st.env.full) st.view = st.board.getBoundingBox();
    st.jp = {};
    JXG.JSXGraph.freeBoard(st.board);
    st.board = null;
  }
  st.boardEl.innerHTML = "";
  const full = st.env.full, thumb = st.env.thumb;
  const tk = Array.isArray(bd.tick) ? bd.tick : [bd.tick || 1, bd.tick || 1];   /* [x, y] when the axes are scaled apart */
  const axis = (name, vert) => { const t = tk[vert ? 1 : 0]; return {
    strokeColor:C.axis, strokeWidth:1.4, highlight:false, fixed:true, name:thumb ? "" : name, withLabel:!thumb,
    label:{position:"rt", offset:vert ? [12, -12] : [name.length > 1 ? -22 : -14, 14], strokeColor:C.soft, fontSize:13, highlight:false, cssStyle:"font-weight:600"},
    ticks:Object.assign({majorHeight:-1, minorHeight:-1, strokeColor:C.grid, strokeOpacity:1, minorStrokeColor:C.grid, highlight:false, drawZero:false,
      drawLabels:!thumb, label:{strokeColor:C.soft, fontSize:11, highlight:false}},
      full ? {insertTicks:true, minorTicks:0} : {insertTicks:false, ticksDistance:t, minorTicks:t > 1 && t < 5 ? t - 1 : 0})
  }; };
  const b = JXG.JSXGraph.initBoard(st.boardEl, {
    boundingbox:st.view || bd.bbox, keepAspectRatio:!bd.free, axis:bd.axis !== false,
    showNavigation:!!full, showCopyright:false, showInfobox:false,
    pan:{enabled:!!full, needShift:false, needTwoFingers:false}, zoom:{enabled:!!full, wheel:true, needShift:true, pinch:true},
    keyboard:{enabled:!!w.points && !thumb, panShift:false, panCtrl:false}, resize:{enabled:true, throttle:60},
    defaultAxes:{x:axis(bd.axes ? bd.axes[0] : "x", false), y:axis(bd.axes ? bd.axes[1] : "y", true)}
  });
  /* only boards with something to drag or pan may capture touches — the rest let the page scroll */
  if(!w.points && !full) st.boardEl.style.touchAction = "pan-y";
  st.board = b;
  const g = toolG(b, C, st);
  /* draggable points come first so that everything drawn from P.Ax… follows them within the same update */
  for(const n in (w.points || {})){
    const o = w.points[n][2] || {};
    const locked = thumb || (o.fixed && !st.open);
    st.jp[n] = b.create("point", st.pts[n].slice(), {
      name:o.name || n, size:locked ? 4 : 6, fixed:locked, fillColor:C[o.color] || C.a, strokeColor:C.panel, strokeWidth:2, showInfobox:false,
      snapToGrid:true, snapSizeX:w.snap || 1, snapSizeY:w.snap || 1, highlight:!locked, highlightFillColor:C[o.color] || C.a, highlightStrokeColor:C.ink,
      withLabel:o.label !== false && !thumb, label:{strokeColor:C.ink, fontSize:14, offset:o.offset || [-16, 13], cssStyle:"font-weight:700", highlight:false}
    });
  }
  w.draw(g, st.P, st);
  b.on("update", () => { if(toolSig(st) !== st.shown) toolOut(st); });
  b.update();
}

function toolSvg(st){
  st.boardEl.innerHTML = st.w.svg(st.P, st);
}

/* the typed fields follow whatever was dragged — except the one being typed into */
function toolSync(st){
  if(!st.ctl) return;
  const busy = document.activeElement;
  $$("[data-px]", st.ctl).forEach(el => { if(el !== busy) el.value = fmtN(st.P[el.dataset.px + (el.dataset.ax === "1" ? "y" : "x")], 4); });
  $$("[data-wi]", st.inputsEl).forEach(el => {
    const x = (st.w.inputs || [])[Number(el.dataset.wi)];
    if(x && x.read && el !== busy) el.value = x.read(st);
  });
}

function toolOut(st){
  st.shown = toolSig(st);
  toolSync(st);
  if(st.outEl) st.outEl.innerHTML = st.w.out ? st.w.out(st.P, st.h, st) : "";
  const goal = st.blk.goal;
  if(goal){
    const done = !!(typeof goal === "function" ? goal(st.P, st) : mathExpr(goal, st.names).f(st.P));
    st.root.classList.toggle("done", done);
    const tag = $(".tw-tag", st.root);
    if(tag) tag.textContent = done ? "✓ Hotovo" : TW_TAG.uloha;
  }
}

function toolUpdate(st){
  if(st.board) st.board.update();
  else if(st.w.svg && st.ready) toolSvg(st);
  toolOut(st);
}

const TW_COLOR = {a:"va", b:"vb", c:"vc", d:"vd"};
function toolCtl(st){
  const w = st.w;
  let h = "";
  if(w.hint) h += `<div class="tw-drag">${TW_HAND}<span>${inline(w.hint)}</span></div>`;
  for(const id in w.params){
    const p = w.params[id], locked = p.lock && !st.open;
    const cls = p.color ? " c-" + p.color : "";
    const name = `<span class="tw-pn${p.color && TW_COLOR[p.color] ? " " + TW_COLOR[p.color] : ""}${p.type === "check" || p.plain ? " plain" : ""}">${esc(p.name || id)}${p.note ? `<small>${esc(p.note)}</small>` : ""}</span>`;
    const fid = `tw-${st.n}-${id}`;
    if(p.type === "check"){
      if(locked) continue;
      h += `<label class="tw-pm check${cls}" for="${fid}"><input type="checkbox" id="${fid}" data-p="${id}"${st.P[id] ? " checked" : ""}>${name}</label>`;
    } else if(locked){
      if(p.hide) continue;
      h += `<div class="tw-pm lock${cls}" title="V tejto ukážke zamknuté">${name}${TW_LOCK}<output>${fmtN(st.P[id])}</output></div>`;
    } else {
      const lim = st.lim[id] || p;
      h += `<div class="tw-pm${cls}"><label class="tw-pl" for="${fid}">${name}</label>
        <input type="text" inputmode="decimal" class="tw-num" id="${fid}-n" data-pn="${id}" value="${fmtN(st.P[id], 4)}" autocomplete="off" aria-label="Hodnota ${esc(p.name || id)}, môžeš ju prepísať" title="Klikni a napíš vlastnú hodnotu">
        <input type="range" id="${fid}" data-p="${id}" min="${lim.min}" max="${lim.max}" step="${p.step || 1}" value="${st.P[id]}"></div>`;
    }
  }
  /* draggable points can be placed by typing their coordinates too */
  if(!st.env.thumb) for(const n in (w.points || {})){
    const o = w.points[n][2] || {};
    if(o.fixed && !st.open) continue;
    const f = ax => `<label>${ax ? "y" : "x"}<input type="text" inputmode="decimal" class="tw-num" id="tw-${st.n}-${n}${ax}" data-px="${n}" data-ax="${ax}" value="${fmtN(st.P[n + (ax ? "y" : "x")], 4)}" autocomplete="off" aria-label="Bod ${esc(o.name || n)}, súradnica ${ax ? "y" : "x"}"></label>`;
    h += `<div class="tw-pm xy"><span class="tw-pn plain"><b>${esc(o.name || n)}</b></span>${f(0)}${f(1)}</div>`;
  }
  if(w.actions && (st.open || w.actionsAlways)) h += `<div class="tw-acts">${w.actions.map((a, i) => `<button type="button" class="btn ghost small" data-wa="${i}">${esc(a.label)}</button>`).join("")}</div>`;
  st.ctl.innerHTML = h;
}

function toolInputs(st){
  const ins = st.env.full && st.w.inputs || [];
  st.inputsEl.innerHTML = ins.map((x, i) =>
    `<label class="tw-in${x.wide ? " wide" : ""}"><span>${inline(x.label)}</span><input type="text" data-wi="${i}" id="tw-${st.n}-in${i}" value="${esc(x.read ? x.read(st) : x.value)}" spellcheck="false" autocomplete="off" autocapitalize="off"></label>`
    + `<div class="tw-err" data-we="${i}">${x.error ? esc(x.error) : ""}</div>`).join("");
}

function toolFoot(st){
  const w = st.w;
  let anyLock = false;
  for(const id in w.params) if(w.params[id].lock) anyLock = true;
  for(const n in (w.points || {})) if((w.points[n][2] || {}).fixed) anyLock = true;
  if(w.actions && !w.actionsAlways) anyLock = true;
  st.foot.innerHTML = `<button type="button" data-wf="reset">↺ Pôvodné hodnoty</button>`
    + (anyLock && !st.env.full ? `<button type="button" data-wf="open">${st.open ? "Zamknúť späť" : "Odomknúť všetko"}</button>` : "")
    + (!st.env.full && !st.tool.embedOnly ? `<button type="button" data-wf="tools" title="Otvoriť tento nástroj samostatne, so všetkým odomknutým">Otvoriť v Nástrojoch ↗</button>` : "");
}

async function toolStart(st){
  const w = st.w;
  st.boardEl.className = w.board ? "jxgbox" : "tw-svg";
  st.boardEl.style.aspectRatio = (w.board ? w.board.aspect : w.aspect) || "";
  if(w.board){
    try{ await needJXG(); }
    catch(e){ st.boardEl.innerHTML = `<div class="tw-fail">Graf sa nepodarilo načítať.</div>`; return; }
    if(!st.root.isConnected || st.dead) return;
    toolBoard(st);
  } else {
    st.ready = true;
    toolSvg(st);
    if(w.bind && !st.bound){ st.bound = true; w.bind(st.boardEl, st); }
  }
  toolOut(st);
}

/* build the widget again from a changed config (a new function typed in, another preset) */
function toolRemake(st, cfg, keepValues){
  st.cfg = cfg;
  st.w = st.tool.make(cfg, st.env);
  st.keep = !!keepValues;
  st.view = cfg.view && !keepValues ? null : st.view;
  toolDefaults(st);
  st.keep = false;
  if(!st.env.thumb){ toolCtl(st); toolFoot(st); }
  if(st.board && !st.w.board){ JXG.JSXGraph.freeBoard(st.board); st.board = null; }
  st.ready = false; st.bound = false;
  toolStart(st);
}

let toolSeq = 0;
function mountTool(el){
  el.dataset.on = "1";
  const blk = el.dataset.tk ? TOOL_BLOCKS[el.dataset.tk] : {tool:el.dataset.tool, cfg:JSON.parse(el.dataset.cfg || "{}")};
  const body = $(".tw-body", el);
  const tool = blk && TOOLS[blk.tool];
  if(!tool || !body){
    if(body) body.innerHTML = `<div class="tw-fail">Nástroj „${esc(el.dataset.tool)}“ nepoznám.</div>`;
    return;
  }
  const env = {full:el.classList.contains("tw-full"), thumb:el.classList.contains("tw-thumb")};
  const st = {n:++toolSeq, root:el, tool, blk, env, cfg:blk.cfg || {}, open:env.full, board:null, jp:{}, h:Object.create(TW_H)};
  try{ st.w = tool.make(st.cfg, env); }
  catch(e){ body.innerHTML = `<div class="tw-fail">Túto ukážku sa nepodarilo pripraviť.</div>`; console.error(e); return; }
  body.innerHTML = env.thumb ? `<div class="tw-board"><div></div></div>`
    : `<div class="tw-board"><div></div></div>
       <div class="tw-side"><div class="tw-inputs"></div><div class="tw-ctl"></div><div class="tw-out" aria-live="polite"></div><div class="tw-foot"></div></div>`;
  st.boardEl = $(".tw-board > div", body);
  st.boardEl.setAttribute("role", "img");
  st.boardEl.setAttribute("aria-label", tool.name);
  st.inputsEl = $(".tw-inputs", body); st.ctl = $(".tw-ctl", body); st.outEl = $(".tw-out", body); st.foot = $(".tw-foot", body);
  toolDefaults(st);
  if(blk.values) for(const k in blk.values) if(k in st.w.params) st.P[k] = blk.values[k];
  if(!env.thumb){
    toolInputs(st); toolCtl(st); toolFoot(st);
    const applyInput = debounce(inp => {
      const x = st.w.inputs[Number(inp.dataset.wi)];
      const r = x.apply(inp.value);
      const err = $(`[data-we="${inp.dataset.wi}"]`, st.inputsEl);
      if(r && r.error){ err.textContent = r.error; return; }
      err.textContent = "";
      if(r) toolRemake(st, r, true);
    }, 320);
    body.addEventListener("input", e => {
      const t = e.target;
      if(t.dataset.wi != null){ applyInput(t); return; }
      const id = t.dataset.p;
      if(!id) return;
      st.P[id] = t.type === "checkbox" ? t.checked : round2(Number(t.value));
      const o = document.getElementById(t.id + "-n");
      if(o) o.value = fmtN(st.P[id], 4);
      toolUpdate(st);
    });
    /* a value typed into a slider's number or a point's coordinate; on its own page the range grows to fit */
    const roomy = env.full || el.classList.contains("tw-note");
    const commit = t => {
      if(t.dataset.pn){
        const id = t.dataset.pn, p = st.w.params[id];
        let v = toolParse(t.value);
        if(isNaN(v)){ t.value = fmtN(st.P[id], 4); return; }
        const lim = st.lim[id] || (st.lim[id] = {min:p.min, max:p.max});
        if(roomy){ lim.min = Math.min(lim.min, v); lim.max = Math.max(lim.max, v); }
        else v = Math.max(lim.min, Math.min(lim.max, v));
        st.P[id] = v;
        t.value = fmtN(v, 4);
        const r = document.getElementById(t.id.slice(0, -2));
        if(r){ r.min = lim.min; r.max = lim.max; r.value = v; }
        toolUpdate(st);
      } else if(t.dataset.px){
        const n = t.dataset.px, ax = t.dataset.ax === "1" ? 1 : 0;
        let v = toolParse(t.value);
        if(isNaN(v)){ toolSync(st); return; }
        const bb = st.w.board && st.w.board.bbox;
        if(!roomy && bb) v = ax ? Math.max(bb[3], Math.min(bb[1], v)) : Math.max(bb[0], Math.min(bb[2], v));
        const xy = [st.P[n + "x"], st.P[n + "y"]];
        xy[ax] = v;
        if(st.jp[n]){
          /* typed coordinates are taken as they are, not pulled to the grid the way a drag is */
          st.jp[n].setAttribute({snapToGrid:false});
          st.jp[n].setPosition(JXG.COORDS_BY_USER, xy);
          st.board.update();
          st.jp[n].setAttribute({snapToGrid:true});
        } else st.pts[n] = xy;
        t.value = fmtN(v, 4);
        toolOut(st);
      }
    };
    body.addEventListener("change", e => { if(e.target.classList.contains("tw-num")) commit(e.target); });
    body.addEventListener("keydown", e => { if(e.key === "Enter" && e.target.classList.contains("tw-num")){ e.preventDefault(); commit(e.target); e.target.select(); } });
    body.addEventListener("focusin", e => { if(e.target.classList.contains("tw-num")) e.target.select(); });
    body.addEventListener("click", e => {
      const act = e.target.closest("[data-wa]");
      if(act){ st.w.actions[Number(act.dataset.wa)].run(st); toolUpdate(st); return; }
      const btn = e.target.closest("[data-wf]");
      if(!btn) return;
      if(btn.dataset.wf === "tools"){
        const values = {};
        for(const k in st.w.params) values[k] = st.P[k];
        TOOL_HANDOFF = {tool:tool.id, cfg:st.cfg, values, data:st.data ? JSON.parse(JSON.stringify(st.data)) : null, from:location.hash};
        go(`#/nastroje/${tool.id}`);
        return;
      }
      if(btn.dataset.wf === "open") st.open = !st.open;
      st.view = null;
      toolDefaults(st);
      toolCtl(st); toolFoot(st);
      if(st.board) toolBoard(st);
      toolUpdate(st);
    });
  }
  toolLive.add(st);
  toolStart(st);
}

function toolDestroy(st){
  st.dead = true;
  toolLive.delete(st);
  if(st.board && window.JXG){ try{ JXG.JSXGraph.freeBoard(st.board); }catch(e){} st.board = null; }
}

/* ---------- mount whatever appears in the page, drop whatever left it ---------- */
(() => {
  let queued = false;
  const scan = () => {
    queued = false;
    for(const st of [...toolLive]) if(!st.root.isConnected) toolDestroy(st);
    $$(".tw[data-tool]:not([data-on])").forEach(mountTool);
  };
  new MutationObserver(() => { if(!queued){ queued = true; requestAnimationFrame(scan); } })
    .observe(document.getElementById("view"), {childList:true, subtree:true});

  /* colours are read when a board is drawn, so draw again when the theme flips */
  const repaint = () => toolLive.forEach(st => { if(st.board){ toolBoard(st); toolOut(st); } });
  try{ matchMedia("(prefers-color-scheme: dark)").addEventListener("change", repaint); }catch(e){}
  new MutationObserver(repaint).observe(document.documentElement, {attributes:true, attributeFilter:["data-theme"]});
})();

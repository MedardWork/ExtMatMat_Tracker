/* ============================================================
   WORKED EXAMPLES AS TASKS — the {ex:…} blocks of theory (drawn by theoryBlock in js/theory.js)
   The solution stays hidden until the reader answers. When the result is a number or a few numbers
   (exExpect reads them from res), the answer is checked; otherwise the reader opens the solution,
   compares and marks it. The marks are the topic tests' own (TASK_RES):
     ✓ "ok"   = right at the first try, without a step of the solution
     ½ "part" = right after a shown step or at a later try
     ✗ "bad"  = the solution was opened without a right answer
   The reader can change the mark after the solution is open.
   A block may set  ans:[numbers]  (checked; in this order with ord:true)  or  ans:false  (never checked).
   Stored in state.ex = { "<topic>/<hash of task + result>": {r, a, h, n, u} }  (state.js):
     r = mark ("" = solution open, not marked yet), a = the answer typed, h = steps shown before answering,
     n = tries, u = when. Editing the task or its result in a theory file gives it a new key (a fresh start).
   ============================================================ */
const exUi = {};          /* per example, not saved: {hints, tries, msg, draft} */

function exHash(s){
  let h = 2166136261;
  for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
const exKey = (tid, b) => `${tid}/${exHash(String(b.ex) + "|" + String(b.res))}`;
const exOf = k => { const x = state.ex && state.ex[k]; return x && x.r != null ? x : null; };

/* ---------- reading the expected numbers from the result ---------- */
const EX_NO = /\\infty|∞|\\langle|\\rangle|\\in(?![a-z])|\\notin|\\le(?![a-z])|\\leq|\\ge(?![a-z])|\\geq|\\lt|\\gt|[<>≤≥]|\\pm|±|\\mp|\\neq|≠|\\emptyset|∅|\\varnothing|\\mathbb|\\subset|\\cup|\\cap|\\Rightarrow|\\iff|\\vee|\\wedge|\\neg|\\blacksquare|\\square|\\int|\\lim|\\sum|\\vec|\\overline|\\overrightarrow|\\parallel|\\perp|\\ldots|\\dots/;
const EX_NO_WORDS = new Set(["nie", "ani", "nikdy", "áno", "not", "no", "neither", "nor", "yes", "never", "nej", "ja", "alebo", "or", "každé", "every", "any", "žiadne", "none"]);
const EX_APPROX = /\\doteq|\\approx|≐|≈|približne|asi|about|approximately|cca/;

/* one value written in TeX → {v, d}: d = decimals it was written with, null when exact (a fraction, a root) */
function exTexVal(src){
  let s = String(src).replace(/−/g, "-")
    .replace(/\\(?:text|mathrm|textrm|mbox)\{[^{}]*\}(?:\^\{?\d\}?)?/g, " ")
    .replace(/\{,\}/g, ".").replace(/(\d)(?:\\[,;:! ]|\s)+(?=\d{3}(?!\d))/g, "$1")
    .replace(/\^\s*\{?\s*\\circ\s*\}?|°|\\%|%|\\euro|€|‰/g, " ")
    .replace(/\\(?:left|right|displaystyle|bigl|bigr|big|Big|,|;|:|!| |quad|qquad)/g, " ")
    .replace(/\\(?:cdot|times)/g, "*").replace(/\\pi(?![a-z])/g, "pi");
  let prev;
  do{
    prev = s;
    s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "(($1)/($2))")
         .replace(/\\sqrt\s*\[([^\]]*)\]\s*\{([^{}]*)\}/g, "(($2)^(1/($1)))")
         .replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)")
         .replace(/\{([^{}]*)\}/g, "($1)");
  }while(s !== prev);
  s = s.trim();
  if(!s || /\\|[a-zA-Z]/.test(s.replace(/sqrt|pi/g, ""))) return null;
  const e = mathExpr(s);
  const v = e.ok ? e.f({}) : NaN;
  if(!isFinite(v)) return null;
  const plain = /^-?\d+(?:\.\d+)?$/.test(s.replace(/\s+/g, ""));
  const dec = (s.match(/\.\d+/g) || []).reduce((m, x) => Math.max(m, x.length - 1), 0);
  return {v, d: plain ? dec : null, z: plain && !dec ? (s.match(/0+$/) || [""])[0].length : 0};
}

/* split at top-level separators (outside braces and brackets) */
function exSplit(s, re){
  const out = [];
  let depth = 0, start = 0;
  for(let i = 0; i < s.length; i++){
    const c = s[i];
    if(c === "\\" && /[{}]/.test(s[i + 1] || "")){ i++; continue; }
    if("{[(".includes(c)) depth++;
    else if("}])".includes(c)) depth--;
    else if(!depth){
      const m = s.slice(i).match(re);
      if(m){ out.push(s.slice(start, i)); start = i + m[0].length; i = start - 1; }
    }
  }
  out.push(s.slice(start));
  return out.map(x => x.trim()).filter(Boolean);
}

/* {v:[numbers], d:[decimals|null], z:[trailing zeros], ap, ord} or null when the result is not a plain number */
const exExpCache = new Map();
function exExpect(b){
  if(b.ans === false) return null;
  if(Array.isArray(b.ans)) return {v:b.ans.map(Number), d:b.ans.map(() => null), z:b.ans.map(() => 0), ap:false, ord:!!b.ord};
  const res = String(b.res || "");
  if(exExpCache.has(res)) return exExpCache.get(res);
  let r = null;
  try{ r = exRead(res); }catch(e){ r = null; }
  exExpCache.set(res, r);
  return r;
}
function exRead(res){
  const main = res.split(/(?:Skúška|Kontrola|Check|Overenie)\b/)[0];
  if(EX_NO.test(main)) return null;
  const parts = main.split(/\$([^$]*)\$/);
  /* numbers in bold, when there are some, are the answer; the other numbers of the text repeat the task */
  const bold = /\*\*[^*]*\d[^*]*\*\*/.test(main);
  const v = [], d = [], z = [];
  let words = 0, ord = false;
  const push = x => { v.push(x.v); d.push(x.d); z.push(x.z || 0); };
  for(let i = 0; i < parts.length; i++){
    if(i % 2 === 0){
      const t = parts[i].replace(/(\d)[ \u00a0\u202f](?=\d{3}(?!\d))/g, "$1");
      if(/\d\s*[:×·*\/+=^]\s*\d/.test(t)) return null;              /* 8:36, 120 × 120: not a plain number */
      for(const w of t.split(/[^\p{L}]+/u).filter(Boolean)){
        if(EX_NO_WORDS.has(w.toLowerCase()) || /^[A-Z]{3,}$/.test(w)) return null;
        words++;
      }
      const nums = bold ? (t.match(/\*\*[^*]*\*\*/g) || []).join(" ") : t.replace(/(^|\s)\d+(?:\.(?=\s+\p{Ll})|:)/gu, " ");
      for(const m of nums.matchAll(/(^|[^\p{L}\d])(-?\d+(?:,\d+)?)/gu)){
        const x = exTexVal(m[2].replace(",", "{,}"));
        if(!x) return null;
        push(x);
      }
      continue;
    }
    if(bold) continue;
    for(const piece of exSplit(parts[i], /^(?:;|,\\?[ ,;]|,\s)/)){
      const sides = piece.split(/=|\\doteq|\\approx|≐|≈/);
      let val = sides[sides.length - 1].trim();
      /* "name = value": the name has a letter and is not a sum (a - b = 0 is an equation, not a result) */
      /* "name = value": a name that is a sum (a - b = 0) makes an equation, not a result; "1/3 ≐ 0,33" is fine */
      const named = /[a-zA-Z]/.test(sides[0].replace(/\\(?:cdot|times|[dt]?frac|sqrt|left|right|pi)(?![a-zA-Z])/g, ""));
      if(sides.length > 1 && named && exSplit(sides[0], /^[+-]/).length > 1) return null;
      if(sides.length > 1 && !named && !/\\doteq|\\approx|≐|≈/.test(piece)) return null;
      val = val.replace(/^[A-Za-z]?(?:_\{?\w+\}?)?(?:\\[,;! ]|\s)*(?=\\\{|\[|\()/, "");
      const br = val.match(/^(?:\\left)?\s*(\\\{|\[|\()([\s\S]*?)(?:\\right)?\s*(\\\}|\]|\))$/);
      if(br && /;/.test(br[2])){
        if(br[1] !== "\\{") ord = true;
        for(const it of exSplit(br[2], /^;/)){ const x = exTexVal(it); if(!x) return null; push(x); }
        continue;
      }
      if(sides.length === 1 && /[a-zA-Z]/.test(val.replace(/\\[a-zA-Z]+/g, ""))) return null;
      const x = exTexVal(val);
      if(!x) return null;
      push(x);
    }
  }
  if(!v.length || v.length > 4 || words > 6) return null;
  return {v, d, z, ap:EX_APPROX.test(main), ord};
}

/* ---------- reading the reader's answer ---------- */
const EX_KEEP = ["sqrt", "pi", "ln", "log", "sin", "cos", "tg", "tan"];
function exParse(txt){
  let s = String(txt || "").replace(/[−–]/g, "-").replace(/[·×⋅]/g, "*").replace(/[≐≈]/g, "=").replace(/[\u00a0\u202f]/g, " ");
  s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1");
  s = s.replace(/√\s*(\d+(?:[.,]\d+)?|π|\([^()]*\))/g, (m, a) => `sqrt(${a.replace(/^\(|\)$/g, "")})`).replace(/√/g, "sqrt");
  const v = [], d = [], bad = [];
  for(const raw of s.split(/;|\n|,\s+|\s+(?:a|and|og|i)\s+/i)){
    let p = raw.replace(/^.*=/, "").replace(/[\[\]{}]/g, " ");
    p = p.replace(/\p{L}+\s*(?:[²³]|\^\s*\d)/gu, " ").replace(/[%°€‰]/g, " ")
         .replace(/\p{L}+/gu, w => EX_KEEP.includes(w.toLowerCase()) ? w.toLowerCase() : " ").trim();
    const open = (p.match(/\(/g) || []).length, close = (p.match(/\)/g) || []).length;
    if(open > close && p.startsWith("(")) p = p.slice(1).trim();
    if(close > open && p.endsWith(")")) p = p.slice(0, -1).trim();
    p = p.replace(/\.$/, "").trim();
    if(!p) continue;
    for(const q of p.split(/(?<=[\d)])\s+(?=[\d(])/)){
      const e = mathExpr(q);
      const x = e.ok ? e.f({}) : NaN;
      if(!isFinite(x)){ bad.push(raw.trim()); continue; }
      v.push(x);
      const m = q.replace(/\s+/g, "").match(/^-?\d+(?:[.,](\d+))?$/);
      d.push(m ? (m[1] || "").length : null);
    }
  }
  return {v, d, bad};
}

/* is the answer a close enough copy of the expected value? */
function exClose(e, de, ze, ap, a, da){
  const diff = Math.abs(a - e);
  if(diff <= 1e-9 * Math.max(1, Math.abs(e))) return true;
  if(de != null && de > 0 && diff <= 0.5 * 10 ** -de + 1e-12) return true;                  /* the result is rounded */
  if(ap && de === 0 && diff <= 0.5 * 10 ** (ze || 0) + 1e-9) return true;                  /* ≐ 32 600 */
  if(da != null && diff <= 0.5 * 10 ** -da * (1 + 1e-9) && (da >= 1 || diff <= 0.01 * Math.abs(e))) return true;  /* answer rounded */
  return false;
}
/* "ok" | "count" | "wrong" */
function exCheck(exp, ans){
  if(ans.v.length !== exp.v.length) return "count";
  const n = exp.v.length;
  const fits = (i, j) => exClose(exp.v[i], exp.d[i], exp.z[i], exp.ap, ans.v[j], ans.d[j]);
  if(exp.ord) return exp.v.every((_, i) => fits(i, i)) ? "ok" : "wrong";
  const used = new Array(n).fill(false);
  const go = i => {
    if(i === n) return true;
    for(let j = 0; j < n; j++) if(!used[j] && fits(i, j)){ used[j] = true; if(go(i + 1)) return true; used[j] = false; }
    return false;
  };
  return go(0) ? "ok" : "wrong";
}

/* ---------- counts ---------- */
/* the examples of a topic's theory, [{k, sec}] (the theory file must be loaded) */
function exList(tid){
  const th = THEORY[tid];
  if(!th) return [];
  const out = [];
  for(const sec of theorySections(tid)) for(const b of sec.blocks) if(b && b.ex != null) out.push({k:exKey(tid, b), sec:sec.k});
  return out;
}
const exDone = k => { const x = exOf(k); return !!(x && x.r); };
/* {all, done, ok, part, bad} over a list of keys */
function exStats(list){
  const s = {all:list.length, done:0, ok:0, part:0, bad:0};
  for(const it of list){ const x = exOf(it.k || it); if(x && x.r){ s.done++; s[x.r]++; } }
  return s;
}
/* examples done per topic, from the saved marks alone (no theory file needed) */
function exDoneOf(tid){
  let n = 0;
  for(const k in state.ex || {}) if(k.startsWith(tid + "/") && state.ex[k].r) n++;
  return n;
}

/* ---------- drawing ---------- */
const EX_MARK = {ok:"✓", part:"½", bad:"✗"};
const EX_WORD = {ok:"správne", part:"čiastočne", bad:"nesprávne"};

function exFormHtml(k, b){
  const x = exOf(k), u = exUi[k] || {}, exp = exExpect(b), steps = b.steps.length;
  const hints = Math.min(u.hints || 0, steps);
  if(x){
    const marks = ["ok", "part", "bad"].map(r =>
      `<button class="ex-mk ex-${r}${x.r === r ? " on" : ""}" data-act="ex-mark" data-k="${k}" data-r="${r}" aria-pressed="${x.r === r}" title="${EX_WORD[r]}">${EX_MARK[r]}</button>`).join("");
    const how = x.r === "ok" ? (exp ? "Správne na prvý pokus." : "Správne.")
      : x.r === "part" ? (x.h ? `Správne, s ${x.h} ${plural(x.h, "krokom", "krokmi", "krokmi")} riešenia.` : x.n > 1 ? `Správne na ${x.n}. pokus.` : "Čiastočne.")
      : x.r === "bad" ? (exp ? "Riešenie otvorené bez správnej odpovede." : "Nesprávne.") : "Porovnaj so svojou odpoveďou a označ, ako sa ti darilo.";
    return `<div class="ex-done${x.r ? " ex-" + x.r : " ex-open"}">
      <span class="ex-badge">${x.r ? EX_MARK[x.r] : "?"}</span>
      <div class="ex-what"><b>${esc(how)}</b>${x.a ? `<span>Tvoja odpoveď: <q>${esc(x.a)}</q></span>` : ""}</div>
      <span class="ex-mks" role="group" aria-label="Ako sa darilo">${marks}</span>
      <button class="linkish" data-act="ex-again" data-k="${k}">Skúsiť znova</button>
    </div>`;
  }
  const count = exp && exp.v.length > 1 ? `${exp.v.length} ${plural(exp.v.length, "hodnota", "hodnoty", "hodnôt")}, oddeľ ich bodkočiarkou` : "";
  const msg = u.msg ? `<div class="ex-msg ${u.msgCls || ""}" role="status">${esc(u.msg)}</div>` : "";
  return `<div class="ex-try">
    <label class="ex-lab" for="exa-${k.replace(/\W/g, "_")}">${exp ? "Tvoja odpoveď" : "Tvoja odpoveď <small>(nepovinné, porovnáš ju s riešením)</small>"}</label>
    <div class="ex-row">
      <input id="exa-${k.replace(/\W/g, "_")}" class="ex-in" type="text" autocomplete="off" spellcheck="false" data-ex-in="${k}"
        value="${esc(u.draft || "")}" placeholder="${exp ? "napr. 2,5 · 26/3 · 2√3" : "výsledok vlastnými slovami"}">
      <button class="btn ex-go" data-act="ex-check" data-k="${k}">${exp ? "Skontrolovať" : "Ukázať riešenie"}</button>
    </div>
    ${msg}
    <div class="ex-help">
      ${hints < steps ? `<button class="linkish" data-act="ex-hint" data-k="${k}">${hints ? "Ďalší krok riešenia" : "Nápoveda: prvý krok riešenia"} <small>(${hints + 1}/${steps})</small></button>` : `<span class="muted small">Všetky kroky sú odkryté.</span>`}
      ${exp ? `<button class="linkish" data-act="ex-give" data-k="${k}">Neviem, ukáž riešenie</button>` : ""}
      ${exp && count ? `<span class="muted small">${count}.</span>` : ""}
    </div>
  </div>`;
}

/* show / hide the steps and the result of one example to match its state */
function exSync(el){
  const k = el.dataset.ex, b = exBlocks[k];
  if(!b) return;
  const x = exOf(k), u = exUi[k] || {}, open = !!x, hints = open ? Infinity : u.hints || 0;
  el.classList.toggle("ex-shut", !open);
  $$(".th-ex-steps > li", el).forEach((li, i) => { li.hidden = i >= hints; });
  const ph = $(".ex-ph", el);
  if(ph) ph.hidden = open || hints > 0;
  const res = $(".th-ex-res", el);
  if(res) res.hidden = !open;
  const form = $(".th-ex-ans", el);
  if(form) form.innerHTML = exFormHtml(k, b);
}
const exBlocks = {};     /* key → block, filled as theory pages are drawn */
function exSyncAll(){ $$("#thMain .th-ex[data-ex]").forEach(exSync); exSecCounts(); }

/* "2 / 4 príklady" next to each subtopic in the list on the side and in the page head */
function exSecCounts(){
  const tid = ui.route.id;
  if(!tid) return;
  const all = exList(tid);
  $$("#thToc a[data-k]").forEach(a => {
    const s = exStats(all.filter(e => e.sec === a.dataset.k));
    let c = $(".th-toc-ex", a);
    if(!s.all){ if(c) c.remove(); return; }
    if(!c){ c = document.createElement("small"); c.className = "th-toc-ex"; a.appendChild(c); }
    c.textContent = `${s.done}/${s.all}`;
    c.classList.toggle("full", s.done === s.all);
    c.title = `Riešené príklady: ${s.done} z ${s.all}`;
  });
  const m = $("#thExMeta");
  if(m){
    const s = exStats(all);
    m.innerHTML = s.all ? `${s.done} z ${s.all} ${plural(s.all, "riešeného príkladu", "riešených príkladov", "riešených príkladov")} spravených${s.done ? ` <span class="ex-sum"><b class="ex-ok">✓ ${s.ok}</b> <b class="ex-part">½ ${s.part}</b> <b class="ex-bad">✗ ${s.bad}</b></span>` : ""}` : "";
  }
}

function exSave(k, x){
  state.ex ||= {};
  state.ex[k] = Object.assign({r:"", a:"", h:0, n:0}, x, {u:Date.now()});
  delete state.del["ex:" + k];
  touch(k.split("/")[0]);
  saveSoon();
}
function exEl(k){ return $(`.th-ex[data-ex="${CSS.escape(k)}"]`); }
function exRedraw(k, focus){
  const el = exEl(k);
  if(!el) return;
  exSync(el);
  exSecCounts();
  drawTTabs();
  if(focus){ const i = $(".ex-in", el); if(i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}

action("ex-check", el => {
  const k = el.dataset.k, b = exBlocks[k];
  if(!b) return;
  const u = exUi[k] ||= {};
  const inp = $(".ex-in", exEl(k));
  const txt = (inp ? inp.value : u.draft || "").trim();
  u.draft = txt;
  const exp = exExpect(b), hints = Math.min(u.hints || 0, b.steps.length);
  if(!exp){ exSave(k, {r:"", a:txt, h:hints, n:1}); delete exUi[k]; exRedraw(k); return; }
  if(!txt){ u.msg = "Najprv napíš odpoveď (alebo si odkry krok riešenia)."; u.msgCls = ""; exRedraw(k, true); return; }
  const ans = exParse(txt), how = exCheck(exp, ans);
  if(how === "count"){
    u.msg = ans.bad.length && !ans.v.length ? `Nerozumiem „${ans.bad[0]}“. Napíš číslo, zlomok (26/3) alebo odmocninu (2√3).`
      : `Výsledok má ${exp.v.length} ${plural(exp.v.length, "hodnotu", "hodnoty", "hodnôt")}, v odpovedi vidím ${ans.v.length}. Oddeľ ich bodkočiarkou.`;
    u.msgCls = "";
    exRedraw(k, true);
    return;
  }
  u.tries = (u.tries || 0) + 1;
  if(how === "ok"){
    exSave(k, {r: u.tries === 1 && !hints ? "ok" : "part", a:txt, h:hints, n:u.tries});
    delete exUi[k];
    exRedraw(k);
    return;
  }
  u.msg = `✗ Nesedí to (${u.tries}. pokus). Skús to prepočítať, odkry si krok riešenia, alebo si pozri celé riešenie.`;
  u.msgCls = "bad";
  exRedraw(k, true);
});
action("ex-hint", el => {
  const k = el.dataset.k, u = exUi[k] ||= {};
  const inp = $(".ex-in", exEl(k));
  if(inp) u.draft = inp.value;
  u.hints = (u.hints || 0) + 1;
  u.msg = "";
  exRedraw(k);
});
action("ex-give", el => {
  const k = el.dataset.k, b = exBlocks[k], u = exUi[k] || {};
  const inp = $(".ex-in", exEl(k));
  exSave(k, {r:"bad", a:(inp ? inp.value : u.draft || "").trim(), h:Math.min(u.hints || 0, b ? b.steps.length : 0), n:u.tries || 0});
  delete exUi[k];
  exRedraw(k);
});
action("ex-mark", el => {
  const k = el.dataset.k, x = exOf(k);
  if(!x) return;
  exSave(k, Object.assign({}, x, {r: x.r === el.dataset.r ? "" : el.dataset.r}));
  exRedraw(k);
});
action("ex-again", el => {
  const k = el.dataset.k, x = exOf(k);
  if(!x) return;
  const before = Object.assign({}, x);
  delete state.ex[k];
  state.del["ex:" + k] = Date.now();
  exUi[k] = {draft:""};
  saveSoon();
  exRedraw(k, true);
  toast("Príklad je znova skrytý.", () => { exSave(k, before); exRedraw(k); });
});
document.addEventListener("input", e => {
  const el = e.target.closest && e.target.closest("[data-ex-in]");
  if(!el) return;
  const u = exUi[el.dataset.exIn] ||= {};
  u.draft = el.value;
});
document.addEventListener("keydown", e => {
  const el = e.target.closest && e.target.closest("[data-ex-in]");
  if(!el || e.key !== "Enter" || e.isComposing) return;
  e.preventDefault();
  const btn = $(".ex-go", el.closest(".th-ex"));
  if(btn) btn.click();
});

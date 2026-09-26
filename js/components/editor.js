/* ============================================================
   EDITOR — textarea + toolbar + live preview
   Used for topic notes and diary entries. A view registers
     EDITORS[key] = { onChange(text), onDone() }
   and drops editorHtml(key, text) into its markup.
   ============================================================ */
const EDITORS = {};

/* [what gets inserted (‸ = cursor), how the button looks (TeX), attach?]
   attach: outside a formula, the word before the cursor is pulled in — type x, press xⁿ → $x^{}$ */
const SYMBOLS = [
  {g:"Základ", items:[
    ["\\frac{‸}{}", "\\tfrac{a}{b}"], ["^{‸}", "x^{n}", 1], ["_{‸}", "x_{n}", 1], ["\\sqrt{‸}", "\\sqrt{x}"],
    ["\\sqrt[‸]{}", "\\sqrt[n]{x}"], ["\\cdot ", "\\cdot"], ["\\pm ", "\\pm"], ["\\left|‸\\right|", "|x|"],
    ["^\\circ", "\\alpha^\\circ", 1], ["\\pi", "\\pi"], ["\\infty", "\\infty"], ["\\%", "\\%"]
  ]},
  {g:"Vzťahy a množiny", items:[
    ["\\le ", "\\le"], ["\\ge ", "\\ge"], ["\\ne ", "\\ne"], ["\\approx ", "\\approx"],
    ["\\Rightarrow ", "\\Rightarrow"], ["\\Leftrightarrow ", "\\Leftrightarrow"], ["\\in ", "\\in"], ["\\notin ", "\\notin"],
    ["\\subset ", "\\subset"], ["\\cup ", "\\cup"], ["\\cap ", "\\cap"], ["\\emptyset", "\\emptyset"],
    ["\\R", "\\R"], ["\\N", "\\N"], ["\\Z", "\\Z"], ["\\langle ‸ \\rangle", "\\langle a,b\\rangle"],
    ["\\forall ", "\\forall"], ["\\exists ", "\\exists"], ["\\neg ", "\\neg"], ["\\wedge ", "\\wedge"], ["\\vee ", "\\vee"]
  ]},
  {g:"Funkcie", items:[
    ["\\sin ", "\\sin"], ["\\cos ", "\\cos"], ["\\tg ", "\\tg"], ["\\log_{‸}", "\\log_a"], ["\\ln ", "\\ln"],
    ["\\binom{‸}{}", "\\tbinom{n}{k}"], ["!", "n!", 1], ["\\sum_{i=1}^{‸}", "\\textstyle\\sum"],
    ["\\lim_{x \\to ‸}", "\\lim"], ["\\int_{‸}^{}", "\\textstyle\\int"], ["f'(‸)", "f'(x)"]
  ]},
  {g:"Geometria a grécke písmená", items:[
    ["\\vec{‸}", "\\vec{u}"], ["\\overline{‸}", "\\overline{AB}"], ["|‸|", "|AB|"], ["\\angle ", "\\angle"], ["\\triangle ", "\\triangle"],
    ["\\perp ", "\\perp"], ["\\parallel ", "\\parallel"], ["\\sim ", "\\sim"], ["\\alpha", "\\alpha"], ["\\beta", "\\beta"],
    ["\\gamma", "\\gamma"], ["\\varphi", "\\varphi"], ["\\omega", "\\omega"], ["\\Delta", "\\Delta"]
  ]}
];

const BOXES = [
  ["pozor",  "Pozor",  "typická chyba, na čo si dať pozor"],
  ["vzorec", "Vzorec", "čo si treba zapamätať"],
  ["otázka", "Otázka", "čo sa spýtať učiteľa"],
  ["tip",    "Tip",    "skratka, trik, postup"]
];

const HELP = [
  ["**tučné**, *kurzíva*, ==zvýraznené==", "Ctrl+B, Ctrl+I"],
  ["$x^2 + \\frac{1}{2}$", "vzorec v texte — Ctrl+M"],
  ["$$\\sqrt{a^2+b^2}$$", "vzorec na samostatnom riadku"],
  ["- položka\n- [ ] úloha\n- [x] hotová úloha", "Enter pokračuje v zozname, Tab odsadí"],
  ["> [!pozor] Skúška koreňov!", "farebné boxy: pozor, vzorec, otázka, tip"],
  ["x <= 3, a != 0, A => B", "píš <= >= != -> => a zmenia sa na znaky"],
  ["[[a15]]", "odkaz na inú tému"]
];

function editorHtml(key, text, opts = {}){
  const prev = state.prefs.preview !== false;
  const b = (act, label, title, extra = "") =>
    `<button type="button" data-act="${act}" title="${title}" ${extra}>${label}</button>`;
  return `<div class="editor${prev ? "" : " no-prev"}" data-key="${esc(key)}">
    <div class="ed-bar" role="toolbar" aria-label="Formátovanie">
      ${b("ed-wrap", "<b>B</b>", "Tučné (Ctrl+B)", `data-a="**"`)}
      ${b("ed-wrap", "<i>I</i>", "Kurzíva (Ctrl+I)", `data-a="*"`)}
      ${b("ed-wrap", `<span class="hl">ab</span>`, "Zvýrazniť", `data-a="=="`)}
      <span class="ed-sep"></span>
      ${b("ed-line", "H", "Nadpis", `data-p="## "`)}
      ${b("ed-line", "•&thinsp;≡", "Zoznam", `data-p="- "`)}
      ${b("ed-line", "1.", "Číslovaný zoznam", `data-p="1. "`)}
      ${b("ed-line", "☐", "Úloha na odškrtnutie", `data-p="- [ ] "`)}
      ${b("ed-panel", "Box ▾", "Farebný box — pozor, vzorec, otázka, tip", `data-kind="box"`)}
      <span class="ed-sep"></span>
      ${b("ed-math", `<span class="ed-f">ƒ</span> Vzorec`, "Vzorec v texte (Ctrl+M)")}
      ${b("ed-panel", "√ π ≤ ▾", "Matematické symboly", `data-kind="sym"`)}
      ${b("ed-block", "$$", "Vzorec na samostatnom riadku")}
      ${b("ed-topic", "↗ Téma", "Odkaz na inú tému")}
      <span class="ed-grow"></span>
      ${b("ed-prev", "Náhľad", "Zobraziť / skryť náhľad", `aria-pressed="${prev}"`)}
      ${b("ed-panel", "?", "Ako písať", `data-kind="help"`)}
    </div>
    <div class="ed-panel" hidden></div>
    <div class="ed-panes">
      <textarea class="ed-in" data-in="ed" rows="${opts.rows || 8}" placeholder="${esc(opts.placeholder || "")}" spellcheck="true" lang="sk">${esc(text)}</textarea>
      <div class="ed-prev md">${previewHtml(text)}</div>
    </div>
    <div class="ed-foot">${opts.foot || "Ukladá sa samo · Ctrl+Enter alebo Esc zavrie"}</div>
  </div>`;
}

const previewHtml = t => t.trim() ? md(t) : `<p class="ed-empty">Tu uvidíš, ako bude text vyzerať — vrátane vzorcov.</p>`;

function autosize(ta){
  ta.style.height = "auto";
  ta.style.height = Math.max(ta.scrollHeight + 2, 120) + "px";
}
function mountEditors(root){ $$(".ed-in", root).forEach(autosize); }

const edOf = el => el.closest(".editor");
const taOf = el => edOf(el).querySelector(".ed-in");
const cbOf = el => EDITORS[edOf(el).dataset.key] || {};

onInput("ed", ta => {
  autosize(ta);
  const ed = edOf(ta);
  clearTimeout(ta._pv);
  ta._pv = setTimeout(() => { ed.querySelector(".ed-prev").innerHTML = previewHtml(ta.value); }, 90);
  const cb = EDITORS[ed.dataset.key];
  if(cb && cb.onChange) cb.onChange(ta.value);
});

/* ---------- text surgery (keeps Ctrl+Z working where the browser allows) ---------- */
function replaceSel(ta, text){
  ta.focus();
  let ok = false;
  try{ ok = document.execCommand(text ? "insertText" : "delete", false, text); }catch(e){}
  if(!ok){
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
    ta.dispatchEvent(new Event("input", {bubbles:true}));
  }
}

function inMath(v, pos){
  let inl = false, disp = false;
  for(let i = 0; i < pos; i++){
    const c = v[i];
    if(c === "\\"){ i++; continue; }
    if(c === "\n"){ inl = false; continue; }
    if(c === "$"){
      if(v[i+1] === "$"){ disp = !disp; i++; }
      else if(!disp) inl = !inl;
    }
  }
  return inl || disp;
}

/* insert a snippet; ‸ marks the cursor and receives the selection */
function insertSnippet(ta, snip, {math = false, attach = false} = {}){
  let s = ta.selectionStart;
  const e = ta.selectionEnd;
  const sel = ta.value.slice(s, e);
  const k = snip.indexOf("‸");
  let before = k < 0 ? snip : snip.slice(0, k);
  let after  = k < 0 ? "" : snip.slice(k + 1);
  if(math && !inMath(ta.value, s)){
    if(attach && !sel){
      const run = (ta.value.slice(0, s).match(/[^\s$]+$/) || [""])[0];
      s -= run.length;
      before = "$" + run + before;
    } else before = "$" + before;
    after += "$";
  }
  ta.focus();
  ta.setSelectionRange(s, e);
  replaceSel(ta, before + sel + after);
  const pos = s + before.length + sel.length;
  ta.setSelectionRange(pos, pos);
}

function wrapSel(ta, a, b = a){
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.slice(s, e);
  const v = ta.value;
  /* already wrapped → unwrap */
  if(v.slice(s - a.length, s) === a && v.slice(e, e + b.length) === b){
    ta.setSelectionRange(s - a.length, e + b.length);
    replaceSel(ta, sel);
    ta.setSelectionRange(s - a.length, e - a.length);
    return;
  }
  replaceSel(ta, a + sel + b);
  ta.setSelectionRange(s + a.length, s + a.length + sel.length);
}

function lineRange(ta){
  const v = ta.value;
  const s = v.lastIndexOf("\n", ta.selectionStart - 1) + 1;
  let e = v.indexOf("\n", ta.selectionEnd);
  if(e < 0) e = v.length;
  return [s, e];
}

function prefixLines(ta, prefix){
  const [s, e] = lineRange(ta);
  const lines = ta.value.slice(s, e).split("\n");
  const numbered = prefix === "1. ";
  const re = numbered ? /^\d+[.)]\s/ : new RegExp("^" + prefix.replace(/[[\]().*+?^$|\\]/g, "\\$&"));
  const all = lines.every(l => re.test(l));
  const out = lines.map((l, k) => all ? l.replace(re, "") : (numbered ? `${k + 1}. ` : prefix) + l);
  ta.focus();
  ta.setSelectionRange(s, e);
  replaceSel(ta, out.join("\n"));
}

function insertBlock(ta, text){
  const v = ta.value, s = ta.selectionStart;
  const lead = s > 0 && v[s - 1] !== "\n" ? "\n" : "";
  insertSnippet(ta, lead + text);
}

/* ---------- toolbar ---------- */
action("ed-wrap",  el => wrapSel(taOf(el), el.dataset.a));
action("ed-line",  el => prefixLines(taOf(el), el.dataset.p));
action("ed-math",  el => {
  const ta = taOf(el);
  if(inMath(ta.value, ta.selectionStart)) return ta.focus();
  insertSnippet(ta, "$‸$");
});
action("ed-block", el => insertBlock(taOf(el), "$$\n‸\n$$\n"));
action("ed-sym",   el => {
  insertSnippet(taOf(el), el.dataset.s, {math:true, attach:el.dataset.attach === "1"});
});
action("ed-box",   el => {
  const ta = taOf(el);
  const [s, e] = lineRange(ta);
  const lines = ta.value.slice(s, e).split("\n");
  const tag = `> [!${el.dataset.k}] `;
  const out = lines.map((l, k) => (k ? "> " : tag) + l.replace(/^>\s?(\[![^\]]+\]\s*)?/, "")).join("\n");
  ta.focus(); ta.setSelectionRange(s, e); replaceSel(ta, out);
  edOf(el).querySelector(".ed-panel").hidden = true;
});
action("ed-snip",  el => {
  insertBlock(taOf(el), el.dataset.s.replace(/\\n/g, "\n"));
  edOf(el).querySelector(".ed-panel").hidden = true;
});
action("ed-topic", el => {
  const ta = taOf(el);
  const s = ta.selectionStart, e = ta.selectionEnd;
  openPalette({pick:true, notes:false, title:"Odkaz na tému", onPick: link => {
    ta.focus(); ta.setSelectionRange(s, e); replaceSel(ta, `[[${link.t}]]`);
  }});
});
action("ed-prev", el => {
  const on = !(state.prefs.preview !== false);
  state.prefs.preview = on;
  saveSoon();
  $$(".editor").forEach(ed => {
    ed.classList.toggle("no-prev", !on);
    const btn = ed.querySelector('[data-act="ed-prev"]');
    if(btn) btn.setAttribute("aria-pressed", on);
  });
  mountEditors(document);
});
action("ed-panel", el => {
  const panel = edOf(el).querySelector(".ed-panel");
  const kind = el.dataset.kind;
  if(!panel.hidden && panel.dataset.kind === kind){ panel.hidden = true; return; }
  panel.dataset.kind = kind;
  panel.innerHTML = kind === "sym" ? symbolPanel() : kind === "box" ? boxPanel() : helpPanel();
  panel.hidden = false;
});

function symbolPanel(){
  return SYMBOLS.map(g => `<div class="sym-group"><div class="sym-title">${g.g}</div><div class="sym-grid">${
    g.items.map(([s, label, att]) =>
      `<button type="button" data-act="ed-sym" data-s="${esc(s)}"${att ? ` data-attach="1"` : ""} title="${esc(s.replace("‸", "…"))}">${tex(label, false)}</button>`
    ).join("")}</div></div>`).join("")
    + `<div class="sym-hint">Kliknutý symbol sa vloží ako vzorec. Pri x<sup>n</sup>, x<sub>n</sub> a n! najprv napíš základ (napr. <code>x</code>), potom klikni.</div>`;
}
function boxPanel(){
  return `<div class="box-grid">${BOXES.map(([k, label, hint]) =>
    `<button type="button" class="box-pick co-${CALLOUTS[norm(k)].k}" data-act="ed-box" data-k="${k}"><b>${label}</b><span>${hint}</span></button>`
  ).join("")}
    <button type="button" class="box-pick" data-act="ed-snip" data-s="| x | y |\\n|---|---|\\n|  |  |\\n"><b>Tabuľka</b><span>napr. hodnoty funkcie</span></button>
    <button type="button" class="box-pick" data-act="ed-snip" data-s="---\\n"><b>Čiara</b><span>oddelí časti poznámky</span></button>
  </div>`;
}
function helpPanel(){
  return `<table class="help-table"><tbody>${HELP.map(([src, what]) =>
    `<tr><td><code>${esc(src).replace(/\n/g, "<br>")}</code></td><td class="md">${md(src)}</td><td class="help-what">${what}</td></tr>`
  ).join("")}</tbody></table>`;
}

/* ---------- keyboard inside the editor ---------- */
document.addEventListener("keydown", e => {
  const ta = e.target.closest && e.target.closest(".ed-in");
  if(!ta) return;
  const mod = e.ctrlKey || e.metaKey;
  const k = e.key.toLowerCase();

  if(mod && k === "b"){ e.preventDefault(); return wrapSel(ta, "**"); }
  if(mod && k === "i"){ e.preventDefault(); return wrapSel(ta, "*"); }
  if(mod && k === "m"){ e.preventDefault(); return ACTIONS["ed-math"](ta); }
  if((mod && e.key === "Enter") || e.key === "Escape"){
    const cb = cbOf(ta);
    const fn = e.key === "Escape" ? (cb.onEsc || cb.onDone) : cb.onDone;
    if(fn){ e.preventDefault(); e.stopPropagation(); fn(); }
    return;
  }

  const v = ta.value, s = ta.selectionStart;
  const ls = v.lastIndexOf("\n", s - 1) + 1;
  const line = v.slice(ls, s);
  const list = line.match(/^(\s*(?:>\s?)*)([-*+]|\d+[.)])\s+(\[[ xX]\]\s+)?/);

  if(e.key === "Tab" && list && s === ta.selectionEnd){
    e.preventDefault();
    const end = v.indexOf("\n", s) < 0 ? v.length : v.indexOf("\n", s);
    const full = v.slice(ls, end);
    const next = e.shiftKey ? full.replace(/^ {1,2}/, "") : "  " + full;
    ta.setSelectionRange(ls, end);
    replaceSel(ta, next);
    const pos = Math.max(ls, s + next.length - full.length);
    ta.setSelectionRange(pos, pos);
    return;
  }

  if(e.key === "Enter" && !e.shiftKey && !mod && s === ta.selectionEnd){
    if(list){
      e.preventDefault();
      if(line.trim() === list[0].trim()){      /* empty item ends the list */
        ta.setSelectionRange(ls, s); replaceSel(ta, "");
        return;
      }
      let mark = list[2];
      if(/\d/.test(mark)) mark = (parseInt(mark, 10) + 1) + mark.slice(-1);
      replaceSel(ta, "\n" + list[1] + mark + " " + (list[3] ? "[ ] " : ""));
      return;
    }
    const q = line.match(/^(\s*>\s?)/);
    if(q){
      e.preventDefault();
      if(!line.replace(/^\s*>\s?(\[![^\]]+\]\s*)?/, "").trim() && !/\[!/.test(line)){ ta.setSelectionRange(ls, s); replaceSel(ta, ""); return; }
      replaceSel(ta, "\n> ");
    }
  }
});

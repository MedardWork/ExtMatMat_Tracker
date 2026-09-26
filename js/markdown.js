/* ============================================================
   MARKDOWN + MATH — renders notes and diary entries
   Supported:
     # ## ###  headings          **tučné** *kurzíva* ==zvýraznenie== ~~prečiarknuté~~
     - / 1.    lists             - [ ] / - [x]   checklist (clickable in notes)
     > text    quote             > [!pozor] / [!vzorec] / [!otázka] / [!tip]   boxes
     $x^2$     inline formula    $$ … $$   formula on its own line (KaTeX)
     | a | b | tables            `kód`, ``` blocks ```, ---, [text](https://…)
     [[a5]]    link to a topic   <= >= != -> => <=>  become ≤ ≥ ≠ → ⇒ ⇔
   Everything is escaped first; only the tags produced here reach the page.
   ============================================================ */
const TEX_MACROS = {
  "\\tg":"\\operatorname{tg}", "\\cotg":"\\operatorname{cotg}",
  "\\R":"\\mathbb{R}", "\\N":"\\mathbb{N}", "\\Z":"\\mathbb{Z}", "\\Q":"\\mathbb{Q}", "\\C":"\\mathbb{C}"
};

const texCache = new Map();
function tex(src, display){
  const key = (display ? "D" : "I") + src;
  if(texCache.has(key)) return texCache.get(key);
  let html = null;
  if(window.katex){
    try{
      html = katex.renderToString(src, {displayMode:display, throwOnError:false, strict:"ignore", macros:{...TEX_MACROS}});
    }catch(e){}
  }
  if(!html) html = `<code class="tex-raw">${esc(src)}</code>`;
  if(display) html = `<div class="math-block">${html}</div>`;
  if(texCache.size > 600) texCache.clear();
  texCache.set(key, html);
  return html;
}

const CALLOUTS = {
  pozor:  {k:"warn",    label:"Pozor"},
  vzorec: {k:"formula", label:"Vzorec"},
  otazka: {k:"ask",     label:"Otázka"},
  tip:    {k:"tip",     label:"Tip"}
};

function typo(s){
  return s.replace(/<=>/g, "⇔").replace(/<=/g, "≤").replace(/>=/g, "≥")
          .replace(/=>/g, "⇒").replace(/->/g, "→").replace(/!=/g, "≠")
          .replace(/\+-/g, "±").replace(/\.\.\./g, "…");
}

function topicLink(id){
  const x = BY_ID[id];
  return `<a class="tlink" href="#/tema/${id}" title="${esc(x.n)}"><i class="dot l${lv(id)}"></i>${esc(shortName(x))}</a>`;
}

function inline(src){
  const stash = [];
  const put = html => `\u0000${stash.push(html) - 1}\u0000`;
  let s = String(src);
  s = s.replace(/`([^`]+)`/g, (_, c) => put(`<code>${esc(c)}</code>`));
  s = s.replace(/\\\$/g, () => put("$"));
  /* pandoc rule: no space just inside the $…$, and no digit right after — so "5 $ a 6 $" stays text */
  s = s.replace(/\$(?=\S)([^$\n]*?\S)\$(?!\d)/g, (_, t) => put(tex(t, false)));
  s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, t, u) => put(`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`));
  s = s.replace(/\[\[([a-c]\d+)\]\]/g, (m, id) => BY_ID[id] ? put(topicLink(id)) : m);
  s = s.replace(/\bhttps?:\/\/[^\s<>"]*[^\s<>".,;:!?)\]]/g,
    u => put(`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\/(www\.)?/, ""))}</a>`));
  s = esc(typo(s));
  s = s.replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, "<strong>$1</strong>")
       .replace(/==(?=\S)(.+?)(?<=\S)==/g, "<mark>$1</mark>")
       .replace(/~~(?=\S)(.+?)(?<=\S)~~/g, "<del>$1</del>")
       .replace(/(^|[^*\w])\*(?=\S)(.+?)(?<=\S)\*(?!\w)/g, "$1<em>$2</em>")
       .replace(/(^|[^\w])_(?=\S)(.+?)(?<=\S)_(?!\w)/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, k) => stash[k]);
}

/* split a table row on | but not inside $…$ */
function cells(line){
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const out = [];
  let cur = "", math = false;
  for(let i = 0; i < t.length; i++){
    const c = t[i];
    if(c === "\\" && t[i+1] === "$"){ cur += "\\$"; i++; continue; }
    if(c === "$") math = !math;
    if(c === "|" && !math){ out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map(c => inline(c.trim()));
}

const RE = {
  hr:    /^\s*([-*_])(\s*\1){2,}\s*$/,
  head:  /^(#{1,3})\s+(.*)$/,
  list:  /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
  quote: /^\s*>\s?(.*)$/,
  fence: /^\s*```/,
  tsep:  /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
  task:  /^\[( |x|X)\](?:\s+(.*))?$/
};
const isBlank = l => !l || !l.trim();
const isTableStart = (l, next) => l.trim().startsWith("|") && next != null && RE.tsep.test(next);
const startsBlock = (l, next) => RE.hr.test(l) || RE.head.test(l) || RE.list.test(l) || RE.quote.test(l)
  || RE.fence.test(l) || l.trim().startsWith("$$") || isTableStart(l, next);

function md(src, opts = {}){
  const ctr = opts.ctr || (opts.ctr = {n:0});
  const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  let i = 0, out = "";

  while(i < lines.length){
    const l = lines[i];
    if(isBlank(l)){ i++; continue; }
    const t = l.trim();

    if(RE.fence.test(l)){
      const buf = []; i++;
      while(i < lines.length && !RE.fence.test(lines[i])) buf.push(lines[i++]);
      i++;
      out += `<pre><code>${esc(buf.join("\n"))}</code></pre>`;
      continue;
    }

    if(t.startsWith("$$")){
      const first = t.slice(2);
      if(first.length >= 2 && first.endsWith("$$")){ out += tex(first.slice(0, -2).trim(), true); i++; continue; }
      let j = i + 1;
      while(j < lines.length && !lines[j].trim().endsWith("$$")) j++;
      if(j < lines.length){
        const body = [first, ...lines.slice(i + 1, j), lines[j].trim().slice(0, -2)].join("\n").trim();
        out += tex(body, true);
        i = j + 1;
        continue;
      }
      /* unclosed $$ — fall through and show it as text */
    }

    if(RE.hr.test(l)){ out += "<hr>"; i++; continue; }

    let m = l.match(RE.head);
    if(m){
      const h = m[1].length + 2;
      out += `<h${h} class="md-h${m[1].length}">${inline(m[2])}</h${h}>`;
      i++; continue;
    }

    if(RE.quote.test(l)){
      const buf = [];
      while(i < lines.length && RE.quote.test(lines[i])) buf.push(lines[i++].match(RE.quote)[1]);
      const cm = buf[0].match(/^\[!\s*([^\]\s]+)\s*\]\s*(.*)$/);
      const co = cm && CALLOUTS[norm(cm[1])];
      if(co){
        buf[0] = cm[2];
        out += `<div class="callout co-${co.k}"><div class="co-label">${co.label}</div>${md(buf.join("\n"), opts)}</div>`;
      } else {
        out += `<blockquote>${md(buf.join("\n"), opts)}</blockquote>`;
      }
      continue;
    }

    if(isTableStart(l, lines[i+1])){
      const head = cells(l); i += 2;
      const rows = [];
      while(i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out += `<div class="md-table"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join("")}</tr></thead>`
           + `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }

    m = l.match(RE.list);
    if(m){
      const ordered = /\d/.test(m[2]);
      let items = "";
      while(i < lines.length){
        const lm = lines[i].match(RE.list);
        if(!lm){
          /* an indented line right under an item continues it */
          if(items && !isBlank(lines[i]) && /^\s{2,}/.test(lines[i])){
            items = items.replace(/<\/li>$/, `<br>${inline(lines[i].trim())}</li>`);
            i++; continue;
          }
          break;
        }
        if(/\d/.test(lm[2]) !== ordered) break;
        const depth = Math.min(3, Math.floor(lm[1].replace(/\t/g, "  ").length / 2));
        const ind = depth ? ` ind${depth}` : "";
        const task = lm[3].match(RE.task);
        if(task){
          const k = ctr.n++;
          const on = task[1] !== " ";
          const box = opts.checks
            ? `<input type="checkbox"${on ? " checked" : ""} data-act="md-check" data-i="${k}" aria-label="Splnené">`
            : `<input type="checkbox"${on ? " checked" : ""} disabled aria-label="Splnené">`;
          items += `<li class="task${on ? " done" : ""}${ind}">${box}<span>${inline(task[2] || "")}</span></li>`;
        } else {
          items += `<li${ind ? ` class="${ind.trim()}"` : ""}>${inline(lm[3])}</li>`;
        }
        i++;
      }
      out += ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
      continue;
    }

    const buf = [l]; i++;
    while(i < lines.length && !isBlank(lines[i]) && !startsBlock(lines[i], lines[i+1])) buf.push(lines[i++]);
    out += `<p>${buf.map(inline).join("<br>")}</p>`;
  }
  return out;
}

/* flip the k-th "- [ ]" in the source — same order md() numbers them */
function toggleCheck(src, k){
  const lines = src.split("\n");
  let n = 0, fence = false;
  const re = /^((?:\s*>)*\s*(?:[-*+]|\d+[.)])\s+)\[( |x|X)\](?=\s|$)/;
  for(let i = 0; i < lines.length; i++){
    if(RE.fence.test(lines[i])){ fence = !fence; continue; }
    if(fence) continue;
    const m = lines[i].match(re);
    if(!m) continue;
    if(n++ === k){
      lines[i] = lines[i].replace(re, (_, pre, v) => `${pre}[${v === " " ? "x" : " "}]`);
      break;
    }
  }
  return lines.join("\n");
}

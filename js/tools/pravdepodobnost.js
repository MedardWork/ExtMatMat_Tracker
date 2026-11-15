/* ============================================================
   TOOL: pravdepodobnost — probability as favourable / all, seen on pictures. Plain SVG.
   cfg:
     typ      "kocky"    the 36 outcomes of two dice as a grid; the event is highlighted
                         jav: "sucet" "aspon" "najviac" "sucin" "rozdiel" "max" (these use the slider s) | "rovnake" "sestka" "parny"
                              | "vlastny" (the reader clicks the cells) | (i, j, P) => true/false with popis:"…"
                         oznac:true   the event is not shown, the reader marks its cells; h.pr.ok tells whether they got it
              "kocka"    one die: click the faces that belong to the event.  jav:[2, 4, 6]
              "pokus"    a random experiment repeated: relative frequencies settle near the probabilities
                         pokus: "minca" | "kocka" | "dve" (sum of two dice) | "jav" (an event with probability p);  sleduj: index of the watched outcome;  start: tries already made
              "javy"     two independent events as a unit square (sliders a = P(A), b = P(B)); switches prienik, zjednotenie, opak
              "aspon"    n independent tries with probability p each: P(at least one success) = 1 − (1 − p)^n
              "usecka"   geometric probability on a segment of length d: a point falls into [a, b]
              "plocha"   geometric probability by areas; tvar: "kruh" (circle r in a square with side d) | "terc" (inner circle r of a target R)
                         | "stretnutie" (two people come within d minutes, each waits w)
     s, a, b, p, n, d, r, R, w    a number or {v, min, max, step, lock};  on / toggles / free / lock / hide as in toolParams
     out(P, h, st)     h.pr = {m (favourable), n (all), p (probability), ok, N (tries made), rel (relative frequency of the watched outcome), zasah (points inside / thrown)}
   ============================================================ */
const PR_JAVY = {
  sucet:{name:s => `súčet je ${s}`, f:(i, j, s) => i + j === s, val:(i, j) => i + j, s:[2, 12, 7]},
  aspon:{name:s => `súčet je aspoň ${s}`, f:(i, j, s) => i + j >= s, val:(i, j) => i + j, s:[2, 12, 9]},
  najviac:{name:s => `súčet je najviac ${s}`, f:(i, j, s) => i + j <= s, val:(i, j) => i + j, s:[2, 12, 4]},
  sucin:{name:s => `súčin je ${s}`, f:(i, j, s) => i * j === s, val:(i, j) => i * j, s:[1, 36, 12]},
  rozdiel:{name:s => `čísla sa líšia o ${s}`, f:(i, j, s) => Math.abs(i - j) === s, val:(i, j) => Math.abs(i - j), s:[0, 5, 1]},
  max:{name:s => `väčšie z čísel je ${s}`, f:(i, j, s) => Math.max(i, j) === s, val:(i, j) => Math.max(i, j), s:[1, 6, 4]},
  rovnake:{name:() => "padnú dve rovnaké čísla", f:(i, j) => i === j},
  sestka:{name:() => "padne aspoň jedna šestka", f:(i, j) => i === 6 || j === 6},
  parny:{name:() => "súčet je párny", f:(i, j) => (i + j) % 2 === 0},
  vlastny:{name:() => "políčka, ktoré označíš", f:() => false}
};
const prGcd = (a, b) => b ? prGcd(b, a % b) : Math.abs(a);
/* "\dfrac{6}{36} = \dfrac{1}{6} \doteq 0{,}167" */
function prFrac(m, n, colour = "a"){
  const g = prGcd(m, n) || 1, p = m / n;
  return `\\dfrac{\\v${colour}{${m}}}{${n}}` + (g > 1 && m ? ` = ${m / g === n / g ? "1" : `\\dfrac{${m / g}}{${n / g}}`}` : "")
    + (m === 0 ? " = 0" : m === n ? (g > 1 ? "" : " = 1") : ` ${Math.abs(p * 1000 - Math.round(p * 1000)) < 1e-9 ? "=" : "\\doteq"} ${texN(p, 3)}`);
}

defTool("pravdepodobnost", {
  name:"Pravdepodobnosť",
  area:"Pravdepodobnosť",
  desc:"Priaznivé ku všetkým na dvoch kockách, opakovaný pokus, nezávislé javy, „aspoň jeden“ a geometrická pravdepodobnosť.",
  topics:["a41", "b38", "b39"],
  presets:[
    {name:"Dve kocky: súčet", cfg:{typ:"kocky", jav:"sucet"}},
    {name:"Aspoň jedna šestka", cfg:{typ:"kocky", jav:"sestka"}},
    {name:"Označ si jav sám", cfg:{typ:"kocky", jav:"vlastny"}},
    {name:"Jedna kocka", cfg:{typ:"kocka", jav:[2, 4, 6]}},
    {name:"Opakované hody kockou", cfg:{typ:"pokus", pokus:"kocka", start:60}},
    {name:"Súčet dvoch kociek pokusom", cfg:{typ:"pokus", pokus:"dve", start:60}},
    {name:"Nezávislé javy", cfg:{typ:"javy", on:{prienik:true}}},
    {name:"Aspoň jeden úspech", cfg:{typ:"aspon"}},
    {name:"Bod na úsečke", cfg:{typ:"usecka"}},
    {name:"Kruh vo štvorci", cfg:{typ:"plocha", tvar:"kruh"}},
    {name:"Úloha o stretnutí", cfg:{typ:"plocha", tvar:"stretnutie"}}
  ],

  make(cfg, env){
    const typ = ["kocky", "kocka", "pokus", "javy", "aspon", "usecka", "plocha"].includes(cfg.typ) ? cfg.typ : "kocky";
    const fnJav = typeof cfg.jav === "function", jav = fnJav ? {name:() => cfg.popis || "jav A", f:cfg.jav} : PR_JAVY[cfg.jav] || PR_JAVY.sucet;
    const pokus = ["minca", "kocka", "dve", "jav"].includes(cfg.pokus) ? cfg.pokus : "kocka";
    const tvar = ["kruh", "terc", "stretnutie"].includes(cfg.tvar) ? cfg.tvar : "kruh";
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const pr = (v, color, note) => ({v, min:.05, max:.95, step:.05, color, note});
    const defs = typ === "kocky" ? {s:jav.s ? {v:jav.s[2], min:jav.s[0], max:jav.s[1], step:1, color:"a"} : null}
      : typ === "pokus" ? {p:pokus === "jav" ? pr(.3, "a", "pravdepodobnosť javu") : null}
      : typ === "javy" ? {a:pr(.6, "a", "P(A)"), b:pr(.5, "b", "P(B)"), prienik:ck("A aj B zároveň", "d"), zjednotenie:ck("Aspoň jeden z nich", "c"), opak:ck("Ani jeden")}
      : typ === "aspon" ? {p:pr(.2, "a", "úspech v jednom pokuse"), n:{v:5, min:1, max:15, step:1, color:"b", note:"počet pokusov"}}
      : typ === "usecka" ? {d:{v:10, min:4, max:20, step:1, note:"dĺžka úsečky", plain:true}, a:{v:3, min:0, max:20, step:.5, color:"a", note:"začiatok"}, b:{v:7, min:0, max:20, step:.5, color:"b", note:"koniec"}}
      : typ === "plocha" ? (tvar === "kruh" ? {d:{v:6, min:2, max:10, step:.5, color:"b", note:"strana štvorca"}, r:{v:2, min:.5, max:5, step:.5, color:"a", note:"polomer kruhu"}}
        : tvar === "terc" ? {R:{v:5, min:2, max:8, step:.5, color:"b", note:"polomer terča"}, r:{v:2, min:.5, max:8, step:.5, color:"a", note:"polomer stredu"}}
        : {d:{v:60, min:20, max:120, step:10, color:"b", note:"dĺžka intervalu (min)"}, w:{v:20, min:0, max:120, step:5, color:"a", note:"čakanie (min)"}})
      : {};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 340, marks = cfg.oznac || cfg.jav === "vlastny";
    const OUTC = {minca:{l:["hlava", "znak"], p:() => [.5, .5]}, kocka:{l:["1", "2", "3", "4", "5", "6"], p:() => Array(6).fill(1 / 6)},
      dve:{l:Array.from({length:11}, (_, i) => String(i + 2)), p:() => Array.from({length:11}, (_, i) => (6 - Math.abs(5 - i)) / 36)},
      jav:{l:["nastal", "nenastal"], p:P => [P.p, 1 - P.p]}}[pokus];
    const watch = cfg.sleduj != null ? cfg.sleduj : {minca:0, kocka:5, dve:5, jav:0}[pokus];
    const throwN = (st, k) => {
      const p = OUTC.p(st.P), d = () => 1 + Math.floor(Math.random() * 6);
      for(let t = 0; t < k; t++){
        let i;
        if(pokus === "dve") i = d() + d() - 2;
        else { let u = Math.random(); i = 0; while(i < p.length - 1 && u >= p[i]){ u -= p[i]; i++; } }
        st.data.c[i]++; st.data.N++;
      }
    };
    /* geometric scenes: the region all points come from (w × h units), the test for a favourable point, the exact probability */
    const geo = P => {
      if(tvar === "kruh"){ const r = Math.min(P.r, P.d / 2); return {w:P.d, h:P.d, r, inside:(x, y) => Math.hypot(x - P.d / 2, y - P.d / 2) <= r, p:Math.PI * r * r / (P.d * P.d)}; }
      if(tvar === "terc"){ const r = Math.min(P.r, P.R); return {w:2 * P.R, h:2 * P.R, r, disc:true, all:(x, y) => Math.hypot(x - P.R, y - P.R) <= P.R, inside:(x, y) => Math.hypot(x - P.R, y - P.R) <= r, p:r * r / (P.R * P.R)}; }
      const w = Math.min(P.w, P.d);
      return {w:P.d, h:P.d, wait:w, inside:(x, y) => Math.abs(x - y) <= w, p:1 - Math.pow((P.d - w) / P.d, 2)};
    };
    const throwPts = (st, k) => {
      const g = geo(st.P);
      for(let t = 0; t < k && st.data.pts.length < 3000; t++){
        const x = Math.random(), y = Math.random();
        if(g.all && !g.all(x * g.w, y * g.h)){ t--; continue; }
        st.data.pts.push([x, y]);
      }
    };
    const pips = (x, y, s, v, c) => {
      const at = {1:[[0, 0]], 2:[[-1, -1], [1, 1]], 3:[[-1, -1], [0, 0], [1, 1]], 4:[[-1, -1], [1, -1], [-1, 1], [1, 1]], 5:[[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6:[[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]}[v];
      return at.map(q => SV.circle(x + q[0] * s * .27, y + q[1] * s * .27, s * .085, `f ${c}`)).join("");
    };

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "kocky" && marks ? "**Klikaj** na políčka, ktoré patria javu." : typ === "kocka" ? "**Klikaj** na steny kocky, ktoré patria javu." : typ === "javy" || typ === "usecka" ? "Farebné značky sa dajú **ťahať**." : null,
      init(st){
        st.data = typ === "kocky" ? {sel:{}} : typ === "kocka" ? {sel:Object.fromEntries((Array.isArray(cfg.jav) ? cfg.jav : []).map(v => [v, 1]))}
          : typ === "pokus" ? {c:OUTC.l.map(() => 0), N:0} : typ === "plocha" ? {pts:[]} : null;
        if(typ === "pokus" && cfg.start) throwN(st, cfg.start);
      },
      actions:typ === "pokus" ? [...[1, 10, 100, 1000].map(k => ({label:`${k}×`, run(st){ throwN(st, k); }})), {label:"Odznova", run(st){ st.data.c.fill(0); st.data.N = 0; }}]
        : typ === "plocha" ? [{label:"Hoď 200 bodov", run(st){ throwPts(st, 200); }}, {label:"Zmaž body", run(st){ st.data.pts = []; }}] : null,
      actionsAlways:true,

      svg(P, st){
        const thumb = st.env.thumb;
        let h = "";
        if(typ === "kocky"){
          const cs = 42, x0 = (W - 6 * cs) / 2 + 16, y0 = 52, val = jav.val || ((i, j) => i + j);
          h += SV.text(x0 + 3 * cs, 16, "1. kocka", "mid sm ca") + SV.text(x0 - 46, y0 + 3 * cs, "2. kocka", "mid sm cb", ` transform="rotate(-90 ${x0 - 46} ${y0 + 3 * cs})"`);
          for(let i = 1; i <= 6; i++) h += SV.text(x0 + (i - .5) * cs, y0 - 9, i, "mid ca") + SV.text(x0 - 14, y0 + (i - .5) * cs + 5, i, "mid cb");
          for(let j = 1; j <= 6; j++) for(let i = 1; i <= 6; i++){
            const fav = !cfg.oznac && jav.f(i, j, P.s, P), sel = st.data.sel[i + "," + j], c = sel ? "cd" : fav ? "ca" : "";
            h += SV.rect(x0 + (i - 1) * cs + 1.5, y0 + (j - 1) * cs + 1.5, cs - 3, cs - 3, c ? `bg ${c} pa-on` : "pa-c", marks && !thumb ? ` data-pick="${i},${j}"` : "")
              + SV.text(x0 + (i - .5) * cs, y0 + (j - .5) * cs + 5, val(i, j), `mid ${c || "csoft thin"}`, ' pointer-events="none"');
          }
        } else if(typ === "kocka"){
          const s = 70, x0 = (W - 6 * s - 5 * 14) / 2;
          for(let v = 1; v <= 6; v++){
            const x = x0 + (v - 1) * (s + 14), on = st.data.sel[v];
            h += `<rect class="${on ? "bg ca pa-on" : "pa-c"}" x="${x}" y="${H / 2 - s / 2}" width="${s}" height="${s}" rx="10"${thumb ? "" : ` data-pick="${v}"`}/>` + `<g pointer-events="none">${pips(x + s / 2, H / 2, s, v, on ? "ca" : "csoft")}</g>`;
          }
        } else if(typ === "pokus"){
          const p = OUTC.p(P), n = p.length, N = st.data.N, f = st.data.c.map(c => N ? c / N : 0);
          const top = Math.max(.2, ...p, ...f) * 1.12, x0 = 46, x1 = W - 16, y0 = 24, y1 = H - 44, bw = (x1 - x0) / n, Y = v => y1 - (y1 - y0) * v / top;
          const step = top > .5 ? .25 : top > .25 ? .1 : .05;
          for(let v = 0; v <= top; v += step) h += SV.line(x0, Y(v), x1, Y(v), "s cgrid w1") + (thumb ? "" : SV.text(x0 - 6, Y(v) + 4, fmtN(v), "end sm csoft"));
          p.forEach((q, i) => {
            const x = x0 + i * bw, c = i === watch ? "ca" : "cb";
            h += SV.rect(x + bw * .16, Y(f[i]), bw * .68, y1 - Y(f[i]), `bg ${c} pa-on`) + SV.line(x + bw * .06, Y(q), x + bw * .94, Y(q), "s w3 cd")
              + (thumb ? "" : SV.text(x + bw / 2, y1 + 17, OUTC.l[i], `mid ${i === watch ? "ca" : ""}`) + (N ? SV.text(x + bw / 2, y1 + 32, st.data.c[i], "mid sm csoft") : ""));
          });
          h += SV.line(x0, y1, x1, y1, "s");
        } else if(typ === "javy"){
          const s = 250, x0 = (W - s) / 2, y0 = 44, a = P.a * s, b = P.b * s;
          const cell = (x, y, w, hh, on, c, t, v) => SV.rect(x, y, w, hh, on ? `bg ${c} pa-on` : "pa-c") + (thumb || w < 56 || hh < 30 ? "" : SV.text(x + w / 2, y + hh / 2 - 2, t, `mid sm ${on ? c : "csoft"}`) + SV.text(x + w / 2, y + hh / 2 + 13, fmtN(v, 3), `mid ${on ? c : "csoft"}`));
          h += cell(x0, y0 + s - b, a, b, P.prienik || P.zjednotenie, P.prienik ? "cd" : "cc", "A aj B", P.a * P.b)
            + cell(x0, y0, a, s - b, P.zjednotenie, "cc", "len A", P.a * (1 - P.b))
            + cell(x0 + a, y0 + s - b, s - a, b, P.zjednotenie, "cc", "len B", (1 - P.a) * P.b)
            + cell(x0 + a, y0, s - a, s - b, P.opak, "cink", "ani jeden", (1 - P.a) * (1 - P.b));
          h += SV.line(x0, y0 - 14, x0 + a, y0 - 14, "s ca w3") + SV.text(x0 + a / 2, y0 - 22, `P(A) = ${fmtN(P.a)}`, "mid sm ca")
            + SV.line(x0 - 14, y0 + s, x0 - 14, y0 + s - b, "s cb w3") + SV.text(x0 - 22, y0 + s - b / 2, `P(B) = ${fmtN(P.b)}`, "mid sm cb", ` transform="rotate(-90 ${x0 - 22} ${y0 + s - b / 2})"`);
          if(!thumb) h += SV.circle(x0 + a, y0 - 14, 7, "h ca", ' data-drag="a"') + SV.circle(x0 - 14, y0 + s - b, 7, "h cb", ' data-drag="b"');
        } else if(typ === "aspon"){
          const x0 = 30, x1 = W - 30, y0 = 120, bh = 54, q = 1 - P.p, X = v => x0 + (x1 - x0) * v;
          let at = 0;
          for(let i = 1; i <= P.n; i++){
            const w = P.p * Math.pow(q, i - 1);
            h += SV.rect(X(at), y0, (x1 - x0) * w, bh, `bg ca pa-on`) + ((x1 - x0) * w > 22 && !thumb ? SV.text(X(at + w / 2), y0 + bh / 2 + 5, `${i}.`, "mid ca") : "");
            at += w;
          }
          h += SV.rect(X(at), y0, (x1 - x0) * (1 - at), bh, "bg cink pa-on");
          if(!thumb){
            h += SV.path(`M${X(0)} ${y0 - 10}v-8H${X(at)}v8`, "s ca w1") + SV.text(X(at / 2), y0 - 26, `aspoň jeden úspech: ${fmtN(at, 3)}`, "mid ca")
              + SV.path(`M${X(at)} ${y0 + bh + 10}v8H${X(1)}v-8`, "s w1 csoft") + SV.text(Math.min(X(1) - 4, Math.max(X(at), X((at + 1) / 2))), y0 + bh + 36, `žiadny úspech: ${fmtN(1 - at, 3)}`, `${1 - at < .5 ? "end" : "mid"} csoft`)
              + SV.text(X(0), y0 + bh + 70, "Farebné diely: úspech príde prvý raz v 1., 2., 3. … pokuse.", "sm csoft");
            [0, .25, .5, .75, 1].forEach(v => { h += SV.line(X(v), y0 - 4, X(v), y0, "s w1 csoft"); });
          }
        } else if(typ === "usecka"){
          const x0 = 40, x1 = W - 40, y = 170, X = v => x0 + (x1 - x0) * v / P.d, a = Math.min(P.a, P.b, P.d), b = Math.min(P.d, Math.max(P.a, P.b));
          h += SV.line(x0, y, x1, y, "s w3") + SV.line(X(a), y, X(b), y, "s w5 cd");
          for(let v = 0; v <= P.d; v++) h += SV.line(X(v), y - 5, X(v), y + 5, "s w1 csoft") + (thumb || (P.d > 12 && v % 2) ? "" : SV.text(X(v), y + 24, v, "mid sm csoft"));
          if(!thumb) h += SV.text(X((a + b) / 2), y - 30, `priaznivá časť: ${fmtN(b - a)}`, "mid cd") + SV.text((x0 + x1) / 2, y + 56, `celá úsečka: ${fmtN(P.d)}`, "mid csoft")
            + SV.circle(X(Math.min(P.a, P.d)), y, 8, "h ca", ' data-drag="a"') + SV.circle(X(Math.min(P.b, P.d)), y, 8, "h cb", ' data-drag="b"');
        } else {
          const g = geo(P), f = svFit(W, H, [0, 0, g.w, g.h], thumb ? 14 : 34), o = f.p([0, g.h]), s = g.w * f.u;
          if(tvar === "stretnutie"){
            const w = g.wait, d = P.d;
            h += SV.rect(o[0], o[1], s, s, "pa-c") + SV.poly([[0, 0], [w, 0], [d, d - w], [d, d], [d - w, d], [0, w]].map(f.p), "bg ca pa-on");
            if(!thumb) h += SV.text(o[0] + s / 2, o[1] + s + 20, `príchod prvého (0 až ${fmtN(d)} min)`, "mid sm csoft") + SV.text(o[0] - 12, o[1] + s / 2, "príchod druhého", "mid sm csoft", ` transform="rotate(-90 ${o[0] - 12} ${o[1] + s / 2})"`);
          } else if(tvar === "kruh") h += SV.rect(o[0], o[1], s, s, "bg cb pa-on") + SV.circle(f.X(P.d / 2), f.Y(P.d / 2), g.r * f.u, "bg ca pa-on");
          else h += SV.circle(f.X(P.R), f.Y(P.R), P.R * f.u, "bg cb pa-on") + SV.circle(f.X(P.R), f.Y(P.R), g.r * f.u, "bg ca pa-on");
          st.data.pts.forEach(q => { const x = q[0] * g.w, y = q[1] * g.h; h += SV.circle(f.X(x), f.Y(y), 1.8, `f ${g.inside(x, y) ? "ca" : "csoft"}`); });
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        el.addEventListener("click", e => {
          const hit = e.target.closest("[data-pick]");
          if(!hit) return;
          const k = hit.dataset.pick;
          if(st.data.sel[k]) delete st.data.sel[k]; else st.data.sel[k] = 1;
          toolUpdate(st);
        });
        svgDrag(el, st, (id, x, y) => {
          const p = st.w.params[id], snap = v => Math.max(p.min, Math.min(p.max, Math.round(v / p.step) * p.step));
          const v = typ === "javy" ? snap(id === "a" ? (x - (W - 250) / 2) / 250 : (44 + 250 - y) / 250) : snap((x - 40) / (W - 80) * st.P.d);
          if(v === st.P[id]) return false;
          st.P[id] = round2(v);
        });
      },
      out(P, h, st){
        const tn = h.tn, pc = p => `${tn(p * 100, 1)}\\ \\%`;
        if(typ === "kocky" || typ === "kocka"){
          const all = typ === "kocky" ? 36 : 6, picked = Object.keys(st.data.sel);
          const fav = [];
          if(typ === "kocky") for(let i = 1; i <= 6; i++) for(let j = 1; j <= 6; j++) if(jav.f(i, j, P.s, P)) fav.push(i + "," + j);
          const m = marks || typ === "kocka" ? picked.length : fav.length;
          const ok = cfg.oznac ? picked.length === fav.length && fav.every(k => st.data.sel[k]) : undefined;
          h.pr = {m, n:all, p:m / all, ok};
          if(cfg.out) return cfg.out(P, h, st);
          const list = marks || typ === "kocka" ? picked : fav;
          return (typ === "kocky" ? h.p(`Jav $A$: ${jav.name(P.s)}.`) : h.p("Jav $A$: padne niektorá z označených stien."))
            + h.calc(`P(A) = \\dfrac{\\text{priaznivé}}{\\text{všetky}} = ${prFrac(m, all)}`)
            + (typ === "kocky" && list.length && list.length <= 6 ? h.p(`Priaznivé: ${list.map(k => `$[${k.replace(",", ";\\ ")}]$`).join(", ")}`) : "")
            + (cfg.oznac ? h.pill(ok ? "označené správne" : "ešte to nesedí", ok ? "ok" : "flat") : "");
        }
        if(typ === "pokus"){
          const p = OUTC.p(P)[watch], N = st.data.N, c = st.data.c[watch];
          h.pr = {N, p, rel:N ? c / N : 0, m:c};
          if(cfg.out) return cfg.out(P, h, st);
          return h.p(`Sledovaný výsledok: **${OUTC.l[watch]}**, pravdepodobnosť $\\vd{${tn(p, 3)}}$ (hrubá čiara).`)
            + (N ? h.calc(`\\text{relatívna početnosť} = \\dfrac{\\va{${c}}}{${N}} \\doteq \\va{${tn(c / N, 3)}}`) + h.p(`Rozdiel oproti pravdepodobnosti: $${tn(Math.abs(c / N - p), 3)}$. Pri veľkom počte pokusov sa zmenšuje.`)
              : h.p("Zatiaľ žiadny pokus. Stlač **1×**, **10×**, **100×** alebo **1000×**."));
        }
        if(typ === "javy"){
          const a = P.a, b = P.b;
          h.pr = {p:a * b, zjednotenie:a + b - a * b, ziadny:(1 - a) * (1 - b)};
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`P(A \\cap B) = \\va{${tn(a)}} \\cdot \\vb{${tn(b)}} = \\vd{${tn(a * b, 3)}}`)
            + (P.zjednotenie ? h.calc(`P(A \\cup B) = ${tn(a)} + ${tn(b)} - ${tn(a * b, 3)} = \\vc{${tn(a + b - a * b, 3)}}`) : "")
            + (P.opak ? h.calc(`P(\\text{ani jeden}) = ${tn(1 - a)} \\cdot ${tn(1 - b)} = ${tn((1 - a) * (1 - b), 3)}`) + h.calc(`P(\\text{aspoň jeden}) = 1 - ${tn((1 - a) * (1 - b), 3)} = ${tn(1 - (1 - a) * (1 - b), 3)}`) : "")
            + h.p("Násobiť sa smie len vtedy, keď sú javy **nezávislé**.");
        }
        if(typ === "aspon"){
          const q = 1 - P.p, none = Math.pow(q, P.n);
          h.pr = {p:1 - none, ziadny:none};
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`P(\\text{žiadny}) = (1 - \\va{${tn(P.p)}})^{\\vb{${P.n}}} = ${tn(q)}^{${P.n}} \\doteq ${tn(none, 3)}`)
            + h.calc(`P(\\text{aspoň jeden}) = 1 - ${tn(none, 3)} = \\va{${tn(1 - none, 3)}}`) + h.p("„Aspoň jeden“ sa počíta cez opačný jav „ani jeden“.");
        }
        if(typ === "usecka"){
          const a = Math.min(P.a, P.b, P.d), b = Math.min(P.d, Math.max(P.a, P.b)), p = (b - a) / P.d;
          h.pr = {p, m:b - a, n:P.d};
          if(cfg.out) return cfg.out(P, h, st);
          return h.calc(`P = \\dfrac{\\text{dĺžka priaznivej časti}}{\\text{dĺžka celku}} = \\dfrac{\\vd{${tn(b - a)}}}{${tn(P.d)}} ${Math.abs(p * 1000 - Math.round(p * 1000)) < 1e-9 ? "=" : "\\doteq"} ${tn(p, 3)}`) + h.p(`To je $${pc(p)}$.`);
        }
        const g = geo(P), pts = st.data.pts, hit = pts.filter(q => g.inside(q[0] * g.w, q[1] * g.h)).length;
        h.pr = {p:g.p, zasah:[hit, pts.length]};
        if(cfg.out) return cfg.out(P, h, st);
        return (tvar === "kruh" ? h.calc(`P = \\dfrac{S_{\\text{kruh}}}{S_{\\text{štvorec}}} = \\dfrac{\\pi \\cdot \\va{${tn(g.r)}}^2}{\\vb{${tn(P.d)}}^2} \\doteq ${tn(g.p, 3)}`)
            : tvar === "terc" ? h.calc(`P = \\dfrac{\\pi \\va{r}^2}{\\pi \\vb{R}^2} = \\dfrac{\\va{${tn(g.r)}}^2}{\\vb{${tn(P.R)}}^2} ${Math.abs(g.p * 1000 - Math.round(g.p * 1000)) < 1e-9 ? "=" : "\\doteq"} ${tn(g.p, 3)}`)
            : h.p(`Stretnú sa, keď sa ich príchody líšia najviac o $\\va{${tn(g.wait)}}$ minút: $|x - y| \\leq ${tn(g.wait)}$.`)
              + h.calc(`P = 1 - \\dfrac{(${tn(P.d)} - ${tn(g.wait)})^2}{${tn(P.d)}^2} ${Math.abs(g.p * 1000 - Math.round(g.p * 1000)) < 1e-9 ? "=" : "\\doteq"} ${tn(g.p, 3)}`))
          + (pts.length ? h.p(`Pokus: z $${pts.length}$ náhodných bodov padlo do farebnej časti $\\va{${hit}}$, teda $${tn(hit / pts.length, 3)}$.`) : h.p("Tlačidlom hoď náhodné body a porovnaj podiel zásahov s výpočtom."));
      }
    };
  }
});

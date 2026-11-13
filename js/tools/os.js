/* ============================================================
   TOOL: os — the number line: intervals, two sets and their operations, absolute value as a distance,
   and the sign chart of a product or a quotient. Plain SVG; end points can be dragged.
   cfg:
     typ      "interval"    a, b + switches la, lb (end belongs), linf, rinf (runs to −∞ / ∞)
              "dva"         A from a to b, B from c to d; rows prienik, zjednotenie, rozdiel, doplnok
                            A:"[]"  B:"()"   which ends belong: [ ] closed, ( ) open, "-" / "+" = −∞ / ∞, e.g. "-]" or "(+"
              "abs"         |x − s| < r; switches vonku (> instead of <), rovne (≤ / ≥)
              "znamienka"   sign chart of (x − x1)(x − x2)…; n:1…3 factors, dole:[3] factors in the denominator,
                            minus:true a leading −1; switches kladne (> 0 wanted), rovne (zero counts too)
     min, max, step         the visible part of the line (−6…6, step 0.5)
     a, b, c, d, s, r, x1…  a number or {v, lock, …};  free / lock / hide / on / toggles as in toolParams
     out(P, h, st)          h.os = {set, tex, A, B, prienik, zjednotenie, rozdiel, doplnok, signs}
   Sets are lists of [lo, hi, loBelongs, hiBelongs]; IV.union / inter / diff / comp / has / tex work on them.
   ============================================================ */
const IV = {
  norm(list){
    const v = list.filter(i => i[0] < i[1] || (i[0] === i[1] && i[2] && i[3] && isFinite(i[0]))).map(i => i.slice())
      .sort((p, q) => p[0] - q[0] || (q[2] ? 1 : 0) - (p[2] ? 1 : 0));
    const out = [];
    v.forEach(i => {
      const c = out[out.length - 1];
      if(c && (i[0] < c[1] || (i[0] === c[1] && (i[2] || c[3])))){
        if(i[1] > c[1]){ c[1] = i[1]; c[3] = i[3]; }
        else if(i[1] === c[1]) c[3] = c[3] || i[3];
      } else out.push(i);
    });
    return out;
  },
  comp(a){
    const out = [];
    let lo = -Infinity, li = false;
    IV.norm(a).forEach(i => { out.push([lo, i[0], li, !i[2]]); lo = i[1]; li = !i[3]; });
    out.push([lo, Infinity, li, false]);
    return IV.norm(out);
  },
  union:(a, b) => IV.norm([...a, ...b]),
  inter:(a, b) => IV.comp(IV.union(IV.comp(a), IV.comp(b))),
  diff:(a, b) => IV.inter(a, IV.comp(b)),
  has:(a, x) => a.some(i => (x > i[0] || (x === i[0] && i[2])) && (x < i[1] || (x === i[1] && i[3]))),
  tex(a, n = texN){
    if(!a.length) return "\\emptyset";
    if(a.length === 1 && a[0][0] === -Infinity && a[0][1] === Infinity) return "\\mathbb{R}";
    return a.map(i => i[0] === i[1] ? `\\{${n(i[0])}\\}`
      : (i[0] === -Infinity ? "(-\\infty" : (i[2] ? "\\langle " : "(") + n(i[0])) + ";\\ " + (i[1] === Infinity ? "\\infty)" : n(i[1]) + (i[3] ? "\\rangle" : ")"))).join(" \\cup ");
  },
  /* one interval as an inequality: −2 ≤ x < 3 */
  ineq(i, n = texN){
    const l = i[0] === -Infinity ? "" : `${n(i[0])} ${i[2] ? "\\le" : "<"} `, r = i[1] === Infinity ? "" : ` ${i[3] ? "\\le" : "<"} ${n(i[1])}`;
    if(!l && !r) return "x \\in \\mathbb{R}";
    return l ? `${l}x${r}` : `x${r}`;
  }
};

defTool("os", {
  name:"Číselná os",
  area:"Základy",
  desc:"Intervaly, ich prienik a zjednotenie, absolútna hodnota ako vzdialenosť a znamienka súčinu alebo podielu.",
  topics:["a6", "a12", "a13", "a14", "a16", "b4", "b5"],
  presets:[
    {name:"Interval", cfg:{typ:"interval"}},
    {name:"Dva intervaly", cfg:{typ:"dva", on:{prienik:true, zjednotenie:true}}},
    {name:"Absolútna hodnota", cfg:{typ:"abs"}},
    {name:"Znamienka súčinu", cfg:{typ:"znamienka"}},
    {name:"Znamienka podielu", cfg:{typ:"znamienka", n:3, dole:[3], x1:-2, x2:1, x3:3, on:{rovne:true}}}
  ],
  help:"Krúžky na osi sa dajú ťahať. Plný krúžok znamená, že číslo do množiny patrí, prázdny, že nepatrí.",
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const typ = ["interval", "dva", "abs", "znamienka"].includes(cfg.typ) ? cfg.typ : "interval";
    const lo = cfg.min != null ? cfg.min : -6, hi = cfg.max != null ? cfg.max : 6, step = cfg.step || .5;
    const sl = (v, color, name, note) => ({v, min:lo, max:hi, step, color, name, note});
    const ck = (v, name, color) => ({type:"check", v, name, color});
    const nf = Math.max(1, Math.min(3, cfg.n || 2)), dole = cfg.dole || [];
    let defs;
    if(typ === "interval") defs = {a:sl(-2, "a", "a", "ľavý koniec"), b:sl(3, "b", "b", "pravý koniec"),
      la:ck(true, "a do intervalu patrí", "a"), lb:ck(false, "b do intervalu patrí", "b"), linf:ck(false, "Doľava bez konca (−∞)"), rinf:ck(false, "Doprava bez konca (∞)")};
    else if(typ === "dva") defs = {a:sl(-3, "a", "a", "A od"), b:sl(2, "a", "b", "A do"), c:sl(0, "b", "c", "B od"), d:sl(4, "b", "d", "B do"),
      prienik:ck(true, "Prienik A ∩ B", "d"), zjednotenie:ck(false, "Zjednotenie A ∪ B", "c"), rozdiel:ck(false, "Rozdiel A − B", "ok"), doplnok:ck(false, "Doplnok A′")};
    else if(typ === "abs") defs = {s:sl(1, "b", "s", "stred"), r:{v:3, min:0, max:(hi - lo) / 2, step, color:"a", note:"vzdialenosť"},
      vonku:ck(false, "Ďalej než r (znak >)"), rovne:ck(false, "Vrátane rovnosti (≤, ≥)")};
    else {
      defs = {};
      [-1, 2, 4].slice(0, nf).forEach((v, i) => { defs["x" + (i + 1)] = sl(v, ["a", "b", "d"][i], "x" + "₁₂₃"[i], dole.includes(i + 1) ? "nulový bod menovateľa" : "nulový bod"); });
      defs.kladne = ck(true, "Hľadáme kladné hodnoty (> 0)");
      defs.rovne = ck(false, "Vrátane nuly (≥, ≤)");
    }
    const params = toolParams(defs, cfg, env);
    const ends = (s, x, y) => { s = s || "[]"; return [s[0] === "-" ? -Infinity : x, s[1] === "+" ? Infinity : y, s[0] === "[" || s[0] === "<", s[1] === "]" || s[1] === ">"]; };
    const OPS = [["prienik", "A ∩ B", "cd"], ["zjednotenie", "A ∪ B", "cc"], ["rozdiel", "A − B", "cok"], ["doplnok", "A′", "csoft"]];
    const factor = (x0, tn) => x0 === 0 ? "x" : `x ${x0 < 0 ? "+" : "-"} ${tn(Math.abs(x0))}`;

    /* everything the picture and the text need, from the current values */
    const calc = P => {
      const r = {};
      if(typ === "interval"){
        r.set = IV.norm([[P.linf ? -Infinity : P.a, P.rinf ? Infinity : P.b, P.la && !P.linf, P.lb && !P.rinf]]);
        r.rows = [{set:r.set, cls:"cd"}];
      } else if(typ === "dva"){
        r.A = IV.norm([ends(cfg.A, P.a, P.b)]); r.B = IV.norm([ends(cfg.B || "()", P.c, P.d)]);
        r.prienik = IV.inter(r.A, r.B); r.zjednotenie = IV.union(r.A, r.B); r.rozdiel = IV.diff(r.A, r.B); r.doplnok = IV.comp(r.A);
        r.rows = [{set:r.A, cls:"ca", label:"A"}, {set:r.B, cls:"cb", label:"B"}];
        OPS.forEach(([id, label, cls]) => { if(P[id]) r.rows.push({set:r[id], cls, label}); });
        r.set = r.prienik;
      } else if(typ === "abs"){
        const inside = [[P.s - P.r, P.s + P.r, !!P.rovne, !!P.rovne]];
        r.set = P.vonku ? IV.comp(IV.norm([[P.s - P.r, P.s + P.r, !P.rovne, !P.rovne]])) : IV.norm(inside);
        r.rows = [{set:r.set, cls:"cd"}];
      } else {
        const zs = [];
        for(let i = 1; i <= nf; i++) zs.push({x:P["x" + i], den:dole.includes(i), i});
        const f = x => zs.reduce((p, z) => z.den ? p / (x - z.x) : p * (x - z.x), cfg.minus ? -1 : 1);
        const cut = [...new Set(zs.map(z => z.x))].sort((p, q) => p - q);
        const mids = [cut[0] - 1, ...cut.slice(1).map((x, i) => (x + cut[i]) / 2), cut[cut.length - 1] + 1];
        const want = P.kladne ? 1 : -1, parts = [];
        mids.forEach((m, i) => { if(Math.sign(f(m)) === want) parts.push([i ? cut[i - 1] : -Infinity, i < cut.length ? cut[i] : Infinity, false, false]); });
        const undef = x => zs.some(z => z.den && z.x === x);
        if(P.rovne) cut.forEach(x => { if(!undef(x)) parts.push([x, x, true, true]); });
        r.set = IV.norm(parts);
        r.signs = {zs, cut, mids, f, undef};
        r.rows = [{set:r.set, cls:"cd"}];
      }
      r.tex = IV.tex(r.set);
      return r;
    };

    const W = 560, L = typ === "dva" ? 70 : 34, Rt = W - 34, RH = 30, TOP = 14;
    const X = v => L + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (Rt - L);
    const maxRows = typ === "dva" ? 2 + OPS.filter(o => params[o[0]].v || !params[o[0]].lock).length : 1;
    const tableRows = typ === "znamienka" ? nf + 1 : 0;
    const AX = TOP + maxRows * RH + (typ === "abs" ? 34 : 18);
    const H = AX + 34 + (tableRows ? tableRows * 28 + 14 : 0);
    const movable = (id, st) => params[id] && !(params[id].lock && !st.open);

    return {
      params, aspect:`${W}/${H}`,
      hint:Object.keys(params).some(id => params[id].type !== "check" && !params[id].lock) ? "Krúžky na osi sa dajú **ťahať**." : null,

      svg(P, st){
        const r = calc(P), thumb = st.env.thumb;
        let h = "";
        /* the sets as bars above the line */
        const bar = (set, y, cls) => set.map(i => {
          const inf0 = i[0] === -Infinity || i[0] < lo, inf1 = i[1] === Infinity || i[1] > hi;
          const x0 = inf0 ? L - 20 : X(i[0]), x1 = inf1 ? Rt + 20 : X(i[1]);
          let s = SV.line(x0, y, x1, y, `s ${cls} w5`);
          if(inf0) s += SV.head(x0 - 6, y, -1, 0, `f ${cls}`, 10);
          if(inf1) s += SV.head(x1 + 6, y, 1, 0, `f ${cls}`, 10);
          if(!inf0) s += SV.circle(x0, y, 6, i[2] ? `h ${cls}` : `o ${cls}`);
          if(!inf1 && i[1] !== i[0]) s += SV.circle(x1, y, 6, i[3] ? `h ${cls}` : `o ${cls}`);
          return s;
        }).join("");
        r.rows.forEach((row, k) => {
          const y = AX - (typ === "abs" ? 34 : 18) - (r.rows.length - 1 - k) * RH - 4;
          if(row.label && !thumb) h += SV.text(8, y + 5, row.label, `${row.cls}`);
          h += row.set.length ? bar(row.set, y, row.cls) : (thumb ? "" : SV.text((L + Rt) / 2, y + 5, "∅  prázdna množina", `mid ${row.cls}`));
          /* thin guides from the ends down to the line */
          row.set.forEach(i => [i[0], i[1]].forEach(x => { if(isFinite(x) && x >= lo && x <= hi) h += SV.line(X(x), y, X(x), AX, `s ${row.cls} w1 dots`); }));
        });

        /* the line itself */
        h += SV.line(L - 22, AX, Rt + 22, AX, "s csoft") + SV.head(Rt + 28, AX, 1, 0, "f csoft", 9);
        const every = hi - lo <= 14 ? 1 : hi - lo <= 30 ? 2 : 5;
        for(let v = Math.ceil(lo); v <= hi; v++){
          h += SV.line(X(v), AX - (v % every ? 3 : 5), X(v), AX + (v % every ? 3 : 5), "s csoft w1");
          if(!thumb && v % every === 0) h += SV.text(X(v), AX + 20, fmtN(v), "mid sm csoft thin");
        }

        if(typ === "abs"){
          const y = AX - 14, a = X(P.s - P.r), b = X(P.s + P.r), c = X(P.s);
          if(P.r > 0){
            h += SV.line(c, y, a, y, "s ca w1") + SV.line(c, y, b, y, "s ca w1") + SV.line(a, y - 4, a, y + 4, "s ca w1") + SV.line(b, y - 4, b, y + 4, "s ca w1");
            if(!thumb && b - c > 26) h += SV.text((c + b) / 2, y - 5, "r", "mid it ca") + SV.text((c + a) / 2, y - 5, "r", "mid it ca");
          }
          h += SV.circle(c, AX, 5, "f cb");
          if(!thumb) h += SV.text(c, AX - 20, "s", "mid it cb halo");
        }

        /* the sign chart under the line */
        if(typ === "znamienka"){
          const {zs, cut, mids, f, undef} = r.signs, y0 = AX + 34;
          const col = ["ca", "cb", "cd"], xs = [L - 20, ...cut.map(X), Rt + 20];
          cut.forEach(x => { h += SV.line(X(x), AX, X(x), y0 + tableRows * 28 - 6, "s cgrid w1"); });
          const rowsT = [...zs.map(z => ({name:`(${factor(z.x, fmtN)})`, g:x => x - z.x, cls:col[z.i - 1], z})), {name:"celý výraz", g:f, cls:"cink", all:true}];
          rowsT.forEach((row, k) => {
            const y = y0 + k * 28 + 12;
            if(row.all) h += SV.line(L - 26, y - 17, Rt + 26, y - 17, "s csoft w1");
            mids.forEach((m, i) => {
              const s = Math.sign(row.g(m)), mx = (xs[i] + xs[i + 1]) / 2;
              if(xs[i + 1] - xs[i] > 16) h += SV.text(mx, y + 5, s > 0 ? "+" : "−", `mid lg ${s > 0 ? "cok" : "cno"}`);
            });
            cut.forEach(x => {
              const zero = row.all ? !undef(x) : row.z.x === x;
              if(row.all && undef(x)) h += SV.circle(X(x), y, 5, "o cno");
              else if(zero) h += SV.text(X(x), y + 5, "0", `mid halo ${row.cls}`);
            });
            if(!thumb) h += SV.text(L - 26, y - 6, row.name, `sm halo ${row.cls}`);
          });
          zs.forEach(z => { h += SV.circle(X(z.x), AX, 5.5, z.den ? `o ${col[z.i - 1]}` : `h ${col[z.i - 1]}`); });
        }

        /* handles on the line */
        if(!thumb){
          const grab = (id, x, cls) => movable(id, st) ? SV.circle(x, AX, 7, `h ${cls}`, ` data-drag="${id}"`) + SV.circle(x, AX, 15, "hit", ` data-drag="${id}"`) : "";
          if(typ === "interval") h += (P.linf ? "" : grab("a", X(P.a), "ca")) + (P.rinf ? "" : grab("b", X(P.b), "cb"));
          else if(typ === "dva") h += grab("a", X(P.a), "ca") + grab("b", X(P.b), "ca") + grab("c", X(P.c), "cb") + grab("d", X(P.d), "cb");
          else if(typ === "abs") h += grab("s", X(P.s), "cb") + grab("r", X(P.s + P.r), "ca");
          else for(let i = 1; i <= nf; i++) h += movable("x" + i, st) ? SV.circle(X(P["x" + i]), AX, 15, "hit", ` data-drag="x${i}"`) : "";
        }
        return SV.wrap(W, H, h);
      },

      bind(el, st){
        svgDrag(el, st, (id, x) => {
          let v = lo + (x - L) / (Rt - L) * (hi - lo);
          if(id === "r") v = Math.abs(v - st.P.s);
          const p = st.w.params[id];
          v = round2(Math.max(p.min, Math.min(p.max, Math.round(v / step) * step)));
          if(v === st.P[id]) return false;
          st.P[id] = v;
        });
      },

      out(P, h, st){
        const r = calc(P), tn = h.tn;
        h.os = r;
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(typ === "interval"){
          if(!r.set.length) return h.calc("\\emptyset") + h.p(P.a > P.b ? "Ľavý koniec je väčší než pravý, do takého intervalu nepatrí žiadne číslo." : "Koniec, ktorý do intervalu nepatrí, nemôže byť jeho jediným bodom.");
          const i = r.set[0];
          o += h.calc(`x \\in \\vd{${r.tex}}`) + h.calc(IV.ineq(i));
          const inf = !isFinite(i[0]) || !isFinite(i[1]);
          o += h.pill(i[0] === i[1] ? "jediné číslo" : inf ? "neohraničený interval" : i[2] && i[3] ? "uzavretý interval" : !i[2] && !i[3] ? "otvorený interval" : "polouzavretý interval");
        } else if(typ === "dva"){
          o += h.calc(`\\va{A} = \\va{${IV.tex(r.A)}}`) + h.calc(`\\vb{B} = \\vb{${IV.tex(r.B)}}`);
          const sym = {prienik:["A \\cap B", "d"], zjednotenie:["A \\cup B", "c"], rozdiel:["A \\setminus B", ""], doplnok:["A'", ""]};
          OPS.forEach(([id]) => { if(P[id]) o += h.calc(`${sym[id][0]} = ${sym[id][1] ? `\\v${sym[id][1]}{${IV.tex(r[id])}}` : IV.tex(r[id])}`); });
        } else if(typ === "abs"){
          const rel = P.vonku ? (P.rovne ? "\\ge" : ">") : (P.rovne ? "\\le" : "<");
          o += h.calc(`|${P.s === 0 ? "x" : `x ${P.s < 0 ? "+" : "-"} \\vb{${tn(Math.abs(P.s))}}`}| ${rel} \\va{${tn(P.r)}}`);
          o += h.p(`Čísla, ktoré sú od $\\vb{${tn(P.s)}}$ ${P.vonku ? "ďalej" : "bližšie"} než $\\va{${tn(P.r)}}$${P.rovne ? " alebo presne tak ďaleko" : ""}.`);
          o += h.calc(`x \\in \\vd{${r.tex}}`);
        } else {
          const {zs} = r.signs, col = ["a", "b", "d"];
          const part = list => list.map(z => z.x === 0 ? (list.length > 1 ? "x \\cdot " : "x") : `(x ${z.x < 0 ? "+" : "-"} \\v${col[z.i - 1]}{${tn(Math.abs(z.x))}})`).join("").replace(/ \\cdot $/, "");
          const num = part(zs.filter(z => !z.den)) || "1", den = part(zs.filter(z => z.den));
          const rel = P.kladne ? (P.rovne ? "\\ge" : ">") : (P.rovne ? "\\le" : "<");
          o += h.calc(`${cfg.minus ? "-" : ""}${den ? `\\dfrac{${num}}{${den}}` : num} ${rel} 0`);
          o += h.calc(`x \\in \\vd{${r.tex}}`);
          if(den) o += h.p("Nulový bod menovateľa do riešenia nikdy nepatrí, tam výraz nie je definovaný.");
        }
        return o;
      }
    };
  }
});

/* ============================================================
   TOOL: histogram — a frequency table drawn as a bar chart and a pie chart, or raw data sorted into
   class intervals and drawn as a histogram. Plain SVG.
   cfg:
     typ      "pocetnosti"   hodnoty:["1", "2", "3", "4", "5"] (categories), pocty:[3, 7, 9, 4, 2];  drag the tops of the bars
                             switches: stlpce (bar chart), kruh (pie chart), rel (relative frequencies in %)
                             max:12 (the tallest bar allowed), drag:false (bars cannot be changed), nazov:"známka" (what the categories are)
              "triedenie"    data:[…] raw values, sliders sirka (class width) and od (where the first class starts)
                             switches: polygon (frequency polygon), rel
     on, toggles, free, lock, hide    as in toolParams
     out(P, h, st)     h.hist = {n, hodnoty, pocty, rel:[…] (0–1), uhly:[…] (degrees), modus:[…], priemer (when the categories are numbers),
                                 triedy:[[from, to, count]…], odhad (mean estimated from class midpoints)}
   ============================================================ */
defTool("histogram", {
  name:"Početnosti, stĺpcový a kruhový graf",
  area:"Štatistika",
  desc:"Tabuľka početností ako stĺpcový a kruhový graf, triedenie údajov do intervalov a histogram.",
  topics:["a42", "b42"],
  presets:[
    {name:"Známky: stĺpce a kruh", cfg:{typ:"pocetnosti", nazov:"známka", on:{stlpce:true, kruh:true}}, tip:"Ťahaj vrchy stĺpcov alebo napíš vlastné hodnoty a početnosti. Uhol výseku je podiel z $360^\\circ$."},
    {name:"Kruhový graf", cfg:{typ:"pocetnosti", hodnoty:["pešo", "bicykel", "autobus", "auto"], pocty:[6, 3, 9, 6], nazov:"doprava", on:{kruh:true, stlpce:false, rel:true}}, tip:"Kruhový graf ukazuje podiely z celku. Relatívna početnosť je početnosť delená počtom všetkých."},
    {name:"Relatívne početnosti", cfg:{typ:"pocetnosti", nazov:"známka", on:{stlpce:true, rel:true}}, tip:"Relatívne početnosti dajú spolu vždy 100 %. Hodia sa na porovnanie súborov rôznej veľkosti."},
    {name:"Triedenie do intervalov", cfg:{typ:"triedenie"}, tip:"Napíš vlastné údaje. Meň šírku triedy: príliš úzke triedy dajú zubatý histogram, príliš široké skryjú tvar."},
    {name:"Polygón početností", cfg:{typ:"triedenie", on:{polygon:true}}, tip:"Polygón spája stredy horných strán stĺpcov. Priemer z tried je len odhad."}
  ],
  help:"Vrchy stĺpcov sa dajú **ťahať**. Pri triedení meň šírku triedy a sleduj, ako sa tvar histogramu mení.",

  make(cfg, env){
    const typ = cfg.typ === "triedenie" ? "triedenie" : "pocetnosti";
    const labels = (cfg.hodnoty || ["1", "2", "3", "4", "5"]).map(String).slice(0, 8), c0 = cfg.pocty || [3, 7, 9, 4, 2];
    const raw = (cfg.data || [152, 158, 161, 163, 164, 166, 167, 167, 169, 170, 171, 171, 172, 174, 175, 176, 178, 179, 183, 188]).slice(0, 80);
    const lo = Math.min(...raw), hi = Math.max(...raw), span = hi - lo || 1;
    const nice = [1, 2, 2.5, 5, 10, 20, 25, 50].find(s => span / s <= 8) || Math.ceil(span / 8);
    const ck = (name, v = false) => ({type:"check", v, name});
    const defs = typ === "pocetnosti" ? {stlpce:ck("Stĺpcový graf", true), kruh:ck("Kruhový graf"), rel:ck("Relatívne početnosti v %")}
      : {sirka:{v:nice, min:Math.max(1, Math.round(span / 12)), max:Math.max(2, Math.ceil(span / 2)), step:1, color:"a", name:"šírka triedy", plain:true},
         od:{v:Math.floor(lo / nice) * nice, min:Math.floor(lo - span / 4), max:Math.floor(lo), step:1, color:"b", name:"začiatok prvej triedy", plain:true}, polygon:ck("Polygón početností"), rel:ck("Relatívne početnosti v %")};
    const params = toolParams(defs, cfg, env);
    const W = 560, H = 320, top0 = cfg.max || Math.max(...c0) + 3, canDrag = st => typ === "pocetnosti" && !st.env.thumb && (cfg.drag !== false || st.open);
    const numeric = labels.every(l => l.trim() !== "" && isFinite(Number(l.replace(",", "."))));
    const classes = P => {
      const w = Math.max(.01, P.sirka), from = Math.min(P.od, lo), k = Math.max(1, Math.floor((hi - from) / w) + 1), out = [];
      for(let i = 0; i < k; i++) out.push([from + i * w, from + (i + 1) * w, 0]);
      raw.forEach(v => { out[Math.min(k - 1, Math.floor((v - from) / w + 1e-9))][2]++; });
      return out;
    };
    const calc = (P, st) => {
      if(typ === "triedenie"){
        const tr = classes(P), n = raw.length;
        return {n, triedy:tr, pocty:tr.map(t => t[2]), rel:tr.map(t => t[2] / n), priemer:raw.reduce((a, b) => a + b, 0) / n, odhad:tr.reduce((a, t) => a + (t[0] + t[1]) / 2 * t[2], 0) / n};
      }
      const c = st.data.c, n = c.reduce((a, b) => a + b, 0), mx = Math.max(...c);
      return {n, hodnoty:labels, pocty:c, rel:c.map(v => n ? v / n : 0), uhly:c.map(v => n ? v / n * 360 : 0), modus:mx ? labels.filter((_, i) => c[i] === mx) : [],
        priemer:numeric && n ? c.reduce((a, v, i) => a + v * Number(labels[i].replace(",", ".")), 0) / n : null};
    };
    const bx = P => { const both = P.kruh && P.stlpce; return {x0:44, x1:both ? 318 : W - 16, y0:22, y1:H - 40}; };

    return {
      params, aspect:`${W}/${H}`,
      hint:typ === "pocetnosti" && cfg.drag !== false ? "Vrchy stĺpcov sa dajú **ťahať**." : null,
      init(st){ st.data = typ === "pocetnosti" ? {c:labels.map((_, i) => c0[i] || 0)} : null; },
      inputs:typ === "pocetnosti" ? [
        {label:`Hodnoty (${cfg.nazov || "kategórie"})`, wide:true, value:"", read:() => labels.join(labels.some(l => /\s/.test(l)) ? "; " : " "),
          apply(text, st){
            const l = (/;/.test(text) ? text.split(";") : text.trim().split(/\s+/)).map(s => s.trim()).filter(Boolean).slice(0, 8);
            return l.length < 2 ? {error:"Napíš aspoň dve hodnoty oddelené medzerou (alebo bodkočiarkou)."} : Object.assign({}, cfg, {hodnoty:l, pocty:l.map((_, i) => st.data.c[i] || 0), max:null});
          }},
        {label:"Početnosti", wide:true, value:"", read:st => (st.data ? st.data.c : c0).join(" "),
          apply(text){
            const c = String(text).trim().split(/[\s;]+/).filter(Boolean).map(t => Math.round(toolParse(t)));
            if(c.length !== labels.length || c.some(v => !(v >= 0))) return {error:`Napíš ${labels.length} nezáporných čísel, ku každej hodnote jedno.`};
            return Object.assign({}, cfg, {pocty:c, max:null});
          }}]
      : typ === "triedenie" ? [{label:"Údaje (oddelené medzerou)", wide:true, value:raw.map(v => fmtN(v, 4)).join(" "),
        apply(text){ const d = text.split(/[\s;]+/).map(t => toolParse(t.replace(/,$/, ""))).filter(v => !isNaN(v)).slice(0, 80); return d.length > 1 ? {typ:"triedenie", data:d, on:cfg.on} : {error:"Napíš aspoň dve hodnoty."}; }}] : null,
      svg(P, st){
        const r = calc(P, st), thumb = st.env.thumb;
        let h = "";
        if(typ === "triedenie"){
          const tr = r.triedy, x0 = 44, x1 = W - 16, y0 = 22, y1 = H - 62, a = tr[0][0], b = tr[tr.length - 1][1], top = Math.max(...r.pocty) + 1;
          const X = v => x0 + (x1 - x0) * (v - a) / (b - a), Y = v => y1 - (y1 - y0) * v / top, st1 = top > 12 ? Math.ceil(top / 6) : top > 6 ? 2 : 1;
          for(let v = 0; v <= top; v += st1) h += SV.line(x0, Y(v), x1, Y(v), "s cgrid w1") + (thumb ? "" : SV.text(x0 - 6, Y(v) + 4, P.rel ? fmtN(v / r.n * 100, 0) + " %" : v, "end sm csoft"));
          tr.forEach((t, i) => {
            h += SV.rect(X(t[0]), Y(t[2]), X(t[1]) - X(t[0]), y1 - Y(t[2]), "bg ca pa-on");
            if(!thumb && (tr.length <= 10 || i % 2 === 0)) h += SV.text(X(t[0]), y1 + 16, fmtN(t[0]), "mid sm csoft");
            if(!thumb && t[2] && X(t[1]) - X(t[0]) > 16) h += SV.text((X(t[0]) + X(t[1])) / 2, Y(t[2]) - 5, P.rel ? fmtN(t[2] / r.n * 100, 0) + " %" : t[2], "mid sm ca");
          });
          if(!thumb) h += SV.text(X(b), y1 + 16, fmtN(b), "mid sm csoft");
          if(P.polygon) h += SV.path(SV.d([[X(a - (tr[0][1] - a) / 2), y1], ...tr.map(t => [(X(t[0]) + X(t[1])) / 2, Y(t[2])]), [X(b + (b - tr[tr.length - 1][0]) / 2), y1]]), "s cd w3") + tr.map(t => SV.circle((X(t[0]) + X(t[1])) / 2, Y(t[2]), 3.5, "f cd")).join("");
          h += SV.line(x0, y1, x1, y1, "s");
          const seen = {};
          raw.forEach(v => { const k = seen[v] = (seen[v] || 0) + 1; h += SV.circle(X(v), y1 + 24 + k * 6, 2.6, "f cb"); });
          return SV.wrap(W, H, h);
        }
        const n = labels.length;
        if(P.stlpce){
          const {x0, x1, y0, y1} = bx(P), top = Math.max(st.data.top || top0, ...r.pocty), bw = (x1 - x0) / n, Y = v => y1 - (y1 - y0) * v / top, st1 = top > 12 ? Math.ceil(top / 6) : top > 6 ? 2 : 1;
          for(let v = 0; v <= top; v += st1) h += SV.line(x0, Y(v), x1, Y(v), "s cgrid w1") + (thumb ? "" : SV.text(x0 - 6, Y(v) + 4, v, "end sm csoft"));
          r.pocty.forEach((c, i) => {
            const x = x0 + i * bw;
            h += SV.rect(x + bw * .16, Y(c), bw * .68, y1 - Y(c), P.kruh ? `hi-${i % 8}` : "bg ca pa-on");
            if(!thumb) h += SV.text(x + bw / 2, y1 + 17, labels[i], `mid ${labels[i].length > 6 ? "sm" : ""}`) + SV.text(x + bw / 2, Y(c) - 6, P.rel ? fmtN(r.rel[i] * 100, 1) + " %" : c, "mid sm csoft");
            if(canDrag(st)) h += SV.rect(x + bw * .1, Y(c) - 9, bw * .8, 18, "hit", ` data-drag="${i}"`) + SV.line(x + bw * .3, Y(c), x + bw * .7, Y(c), "s w3", ' pointer-events="none"');
          });
          h += SV.line(x0, y1, x1, y1, "s");
          if(!thumb && cfg.nazov) h += SV.text((x0 + x1) / 2, H - 6, cfg.nazov, "mid sm csoft");
        }
        if(P.kruh && r.n){
          const cx = P.stlpce ? 438 : W / 2, cy = H / 2 - 2, R = P.stlpce ? 86 : 118;
          let a = 90;
          r.uhly.forEach((u, i) => {
            if(u <= 0) return;
            const a1 = a - u, m = (a + a1) / 2 * Math.PI / 180;
            h += u >= 359.99 ? SV.circle(cx, cy, R, `hi-${i % 8}`) : SV.path(`M${cx} ${cy}L${SV.arc(cx, cy, R, a, a1).slice(1)}Z`, `hi-${i % 8}`);
            if(!thumb && u > 14) h += SV.text(cx + R * .62 * Math.cos(m), cy - R * .62 * Math.sin(m) + 4, P.rel ? fmtN(u / 3.6, 0) + " %" : fmtN(u, 0) + "°", "mid sm cpanel hi-t");
            if(!thumb) h += SV.text(cx + (R + 14) * Math.cos(m), cy - (R + 14) * Math.sin(m) + 4, labels[i], `${Math.cos(m) > .3 ? "" : Math.cos(m) < -.3 ? "end" : "mid"} sm`);
            a = a1;
          });
        }
        return SV.wrap(W, H, h);
      },
      bind(el, st){
        svgDrag(el, st, (id, x, y) => {
          const {y0, y1} = bx(st.P), i = Number(id);
          if(!st.data.top) st.data.top = Math.max(top0, ...st.data.c);
          const v = Math.max(0, Math.min(st.data.top, Math.round((y1 - y) / (y1 - y0) * st.data.top)));
          if(v === st.data.c[i]) return false;
          st.data.c[i] = v;
        });
      },
      out(P, h, st){
        const r = h.hist = calc(P, st), tn = h.tn;
        if(cfg.out) return cfg.out(P, h, st);
        if(typ === "triedenie"){
          const rows = r.triedy.map(t => `<tr><td class="l">⟨${fmtN(t[0])}; ${fmtN(t[1])})</td><td class="ca">${t[2]}</td><td>${fmtN(t[2] / r.n * 100, 1)} %</td></tr>`).join("");
          return `<div class="tw-tab"><table><tr><th class="l">trieda</th><th>počet</th><th>podiel</th></tr>${rows}<tr class="sum"><td class="l">spolu</td><td>${r.n}</td><td>100 %</td></tr></table></div>`
            + h.p(`Priemer zo stredov tried: $${tn(r.odhad)}$, presný priemer: $${tn(r.priemer)}$.`);
        }
        const rows = labels.map((l, i) => `<tr><td class="l">${esc(l)}</td><td class="ca">${r.pocty[i]}</td><td>${fmtN(r.rel[i] * 100, 1)} %</td>${P.kruh ? `<td>${fmtN(r.uhly[i], 1)}°</td>` : ""}</tr>`).join("");
        return `<div class="tw-tab"><table><tr><th class="l">${esc(cfg.nazov || "hodnota")}</th><th>počet</th><th>podiel</th>${P.kruh ? "<th>uhol</th>" : ""}</tr>${rows}<tr class="sum"><td class="l">spolu</td><td>${r.n}</td><td>${r.n ? "100 %" : "0 %"}</td>${P.kruh ? `<td>${r.n ? "360°" : "0°"}</td>` : ""}</tr></table></div>`
          + (P.kruh ? h.calc(`\\text{uhol} = \\dfrac{\\text{početnosť}}{${r.n || "n"}} \\cdot 360^\\circ`) : h.calc(`\\text{relatívna početnosť} = \\dfrac{\\text{početnosť}}{${r.n || "n"}}`));
      }
    };
  }
});

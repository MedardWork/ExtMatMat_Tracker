/* ============================================================
   TOOL: statistika — values as dots on a number line; drag one and watch mean, median and mode
   Drawn as plain SVG (no board needed), so it also shows how a tool without JSXGraph looks.
   cfg:
     data     [2, 3, 3, 5, 9]          the values
     dataFn   (P) => [...]             or computed from sliders (then the dots can't be dragged)
     min, max, step                    the number line
     on       {mean:true, median:true, mode:false}    what is marked from the start
     toggles  ["median"]               marks the reader may switch here
     drag     false | [4]              which dots may be dragged (default: all)
     edit     true                     buttons to add / remove a value
     params, out(P, h, st)             h.stat = {n, sum, mean, median, modes, sorted, mid}
   ============================================================ */
const STAT_MARKS = [["mean", "Aritmetický priemer", "a"], ["median", "Medián", "b"], ["mode", "Modus", "d"]];

function statOf(data){
  const sorted = data.slice().sort((x, y) => x - y), n = sorted.length;
  const sum = sorted.reduce((s, v) => s + v, 0);
  const mid = n ? (n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2]) : [];
  const count = {};
  sorted.forEach(v => { count[v] = (count[v] || 0) + 1; });
  const top = Math.max(0, ...Object.values(count));
  /* when every value appears equally often, no value stands out — there is no mode */
  const modes = top > 1 && Object.values(count).some(c => c < top) || (top > 1 && Object.keys(count).length === 1)
    ? Object.keys(count).filter(v => count[v] === top).map(Number).sort((x, y) => x - y) : [];
  return {n, sum, sorted, mid, count, top, modes,
          mean:n ? sum / n : NaN,
          median:n ? mid.reduce((s, i) => s + sorted[i], 0) / mid.length : NaN};
}

defTool("statistika", {
  name:"Priemer, medián, modus",
  area:"Štatistika",
  desc:"Hodnoty ako bodky na číselnej osi. Potiahni jednu a sleduj, čo sa pohne a čo zostane.",
  topics:["b40"],
  presets:[
    {name:"Malý súbor", cfg:{data:[2, 3, 3, 4, 5, 6, 8]}},
    {name:"Odľahlá hodnota", cfg:{data:[3, 4, 4, 5, 5, 6, 19], max:20}},
    {name:"Známky v triede", cfg:{data:[1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5], min:1, max:5}},
    {name:"Párny počet", cfg:{data:[1, 3, 4, 8, 9, 10]}}
  ],

  /* data: 2 3 3 4 5 / os: 0 10 / ukaz: priemer, median, modus */
  fromText(kv){
    const cfg = {on:{}, toggles:STAT_MARKS.map(m => m[0]), edit:true};
    let shown = false;
    kv.forEach(([k, v]) => {
      const key = norm(k);
      if(key === "data"){ const n = toolNums(v); if(n.length) cfg.data = n.slice(0, 40); }
      else if(key === "os"){ const n = toolNums(v); if(n.length > 1 && n[0] < n[1]){ cfg.min = n[0]; cfg.max = n[1]; } }
      else if(key === "ukaz"){ shown = true; toolWords(v).forEach(w => {
        if(/priemer/.test(w)) cfg.on.mean = true; else if(/median/.test(w)) cfg.on.median = true; else if(/modus/.test(w)) cfg.on.mode = true;
      }); }
    });
    if(!shown) cfg.on = {mean:true, median:true};
    if(cfg.data){
      if(cfg.min == null || Math.min(...cfg.data) < cfg.min) cfg.min = Math.min(0, Math.floor(Math.min(...cfg.data)));
      if(cfg.max == null || Math.max(...cfg.data) > cfg.max) cfg.max = Math.max(10, Math.ceil(Math.max(...cfg.data)));
    }
    return cfg;
  },
  toText(st){
    const c = st.cfg, out = [`data: ${(st.data || []).map(toolNum).join(" ")}`, `os: ${c.min != null ? c.min : 0} ${c.max != null ? c.max : 10}`];
    const show = [["mean", "priemer"], ["median", "medián"], ["mode", "modus"]].filter(x => st.P[x[0]]).map(x => x[1]);
    if(show.length) out.push(`ukaz: ${show.join(", ")}`);
    return out.join("\n");
  },

  make(cfg, env){
    const lo = cfg.min != null ? cfg.min : 0, hi = cfg.max != null ? cfg.max : 10, step = cfg.step || 1;
    const on = cfg.on || {mean:true, median:true, mode:env.full};
    const free = env.full ? STAT_MARKS.map(m => m[0]) : cfg.toggles || [];
    const params = Object.assign({}, cfg.params);
    STAT_MARKS.forEach(([id, name, color]) => { params[id] = {type:"check", v:!!on[id], name, color, lock:!free.includes(id)}; });
    const computed = typeof cfg.dataFn === "function";
    const canDrag = (i, st) => !computed && !env.thumb && (st.open || cfg.drag === undefined || cfg.drag === true || (Array.isArray(cfg.drag) && cfg.drag.includes(i)));
    const values = (P, st) => computed ? cfg.dataFn(P, st) : st.data;
    const W = 520, H = 262, L = 30, Rt = 30, AX = 184;
    const some = Array.isArray(cfg.drag);   /* only some dots move here — make them stand out */
    const sx = v => L + (v - lo) / (hi - lo) * (W - L - Rt);

    return {
      params, aspect:`${W}/${H}`,
      hint:computed ? null : cfg.drag === false ? null : Array.isArray(cfg.drag) ? "Zvýraznená bodka sa dá ťahať." : "Bodky sa dajú ťahať po osi.",
      init(st){ st.data = computed ? null : (cfg.data || [2, 3, 3, 4, 5, 6, 8]).slice(); },
      actions:computed ? null : [
        {label:"+ Pridať hodnotu", run(st){ if(st.data.length < 40) st.data.push(Math.round((lo + hi) / 2 / step) * step); }},
        {label:"− Odobrať poslednú", run(st){ if(st.data.length > 1) st.data.pop(); }}
      ],
      actionsAlways:!!cfg.edit || env.full,
      /* on its own page the values can simply be typed */
      inputs:computed ? null : [{
        label:"Hodnoty (oddelené medzerou)", wide:true, value:"",
        read:st => (st.data || []).map(v => fmtN(v, 4)).join(" "),
        apply(text){
          const parts = /[\s;]/.test(text.trim()) ? text.split(/[\s;]+/) : text.split(",");
          const data = parts.map(t => toolParse(t.replace(/,$/, ""))).filter(v => !isNaN(v)).slice(0, 40);
          if(!data.length) return {error:"Napíš aspoň jednu hodnotu, napríklad 2 3 3 5"};
          /* the axis stretches to hold whatever was typed */
          return Object.assign({}, cfg, {data, min:Math.min(lo, Math.floor(Math.min(...data))), max:Math.max(hi, Math.ceil(Math.max(...data)))});
        }
      }],

      svg(P, st){
        const data = values(P, st), s = statOf(data);
        /* stack equal values; shrink the dots if a stack would not fit */
        const tallest = Math.max(1, s.top);
        const r = Math.max(4, Math.min(13, (sx(lo + step) - sx(lo)) * .46, (AX - 38) / (tallest * 2.1)));
        const seen = {};
        const dots = data.map((v, i) => {
          const k = seen[v] = (seen[v] || 0) + 1;
          const drag = canDrag(i, st), mode = P.mode && s.modes.includes(v);
          return `<circle cx="${sx(v).toFixed(1)}" cy="${(AX - 7 - r - (k - 1) * r * 2.1).toFixed(1)}" r="${r.toFixed(1)}" data-i="${i}"
            class="st-dot${drag ? " drag" : ""}${drag && some && !st.open ? " hot" : ""}${mode ? " mode" : ""}"${drag ? ` tabindex="0" role="slider" aria-valuenow="${v}" aria-valuemin="${lo}" aria-valuemax="${hi}" aria-label="Hodnota ${fmtN(v)}"` : ""}/>`;
        }).join("");
        let ticks = "";
        const every = (hi - lo) / step > 24 ? Math.ceil((hi - lo) / step / 12) * step : step;
        for(let v = lo; v <= hi + 1e-9; v += step){
          const major = Math.abs((v - lo) / every - Math.round((v - lo) / every)) < 1e-9;
          ticks += `<line x1="${sx(v)}" y1="${AX}" x2="${sx(v)}" y2="${AX + (major ? 7 : 4)}" class="st-tick"/>`
            + (major ? `<text x="${sx(v)}" y="${AX + 21}" class="st-num">${fmtN(v)}</text>` : "");
        }
        let marks = "";
        if(P.median && s.n){
          const x = sx(s.median);
          marks += `<line x1="${x}" y1="26" x2="${x}" y2="${AX}" class="st-med"/><text x="${x}" y="17" class="st-lab b">medián ${fmtN(s.median)}</text>`;
        }
        if(P.mean && s.n){
          const x = sx(s.mean);
          marks += `<path d="M${x} ${AX + 28} l11 17 h-22 z" class="st-mean"/><text x="${x}" y="${AX + 62}" class="st-lab a">priemer ${fmtN(s.mean)}</text>`;
        }
        if(P.mode && s.modes.length) s.modes.forEach(v => {
          marks += `<text x="${sx(v)}" y="${(AX - 12 - s.count[v] * r * 2.1).toFixed(1)}" class="st-lab d">modus</text>`;
        });
        return `<svg viewBox="0 0 ${W} ${H}" class="st-svg" xmlns="http://www.w3.org/2000/svg">
          ${marks}<line x1="${L - 14}" y1="${AX}" x2="${W - Rt + 14}" y2="${AX}" class="st-axis"/>${ticks}${dots}</svg>`;
      },

      bind(el, st){
        let active = null;
        const valueAt = e => {
          const box = $("svg", el).getBoundingClientRect();
          const x = (e.clientX - box.left) / box.width * W;
          const v = lo + (x - L) / (W - L - Rt) * (hi - lo);
          return Math.max(lo, Math.min(hi, Math.round(v / step) * step));
        };
        const set = (i, v) => {
          v = round2(v);
          if(st.data[i] === v) return;
          st.data[i] = v;
          toolUpdate(st);
        };
        el.addEventListener("pointerdown", e => {
          const d = e.target.closest(".st-dot.drag");
          if(!d) return;
          active = Number(d.dataset.i);
          /* leave the data field, so it can follow the dot being dragged */
          if(document.activeElement && document.activeElement.matches("input")) document.activeElement.blur();
          el.setPointerCapture(e.pointerId);
          el.classList.add("dragging");
          e.preventDefault();
        });
        el.addEventListener("pointermove", e => { if(active != null) set(active, valueAt(e)); });
        const end = () => { active = null; el.classList.remove("dragging"); };
        el.addEventListener("pointerup", end);
        el.addEventListener("pointercancel", end);
        /* a finger on a dot drags it instead of scrolling the page */
        el.addEventListener("touchstart", e => { if(e.target.closest(".st-dot.drag")) e.preventDefault(); }, {passive:false});
        el.addEventListener("keydown", e => {
          const d = e.target.closest && e.target.closest(".st-dot.drag");
          if(!d || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
          e.preventDefault();
          const i = Number(d.dataset.i), dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : -1;
          set(i, Math.max(lo, Math.min(hi, st.data[i] + dir * step)));
          const again = $(`.st-dot[data-i="${i}"]`, el);
          if(again) again.focus();
        });
      },

      out(P, h, st){
        const data = values(P, st), s = statOf(data);
        h.stat = s;
        if(cfg.out) return cfg.out(P, h, st);
        const row = s.sorted.map((v, i) => s.mid.includes(i) && P.median ? `<b class="vb">${fmtN(v)}</b>` : fmtN(v)).join(", ");
        let o = `<div>Zoradené (${s.n}): ${row}</div>`;
        if(P.mean) o += h.calc(`\\va{\\bar{x}} = \\dfrac{${texN(s.sum)}}{${s.n}} = \\va{${texN(s.mean)}}`);
        if(P.median) o += h.p(`Medián: $\\vb{${texN(s.median)}}$${s.n % 2 ? " (prostredná hodnota)" : " (priemer dvoch prostredných)"}`);
        if(P.mode) o += h.p(s.modes.length ? `Modus: $\\vd{${s.modes.map(v => texN(v)).join(";\\ ")}}$ (vyskytuje sa ${s.top}-krát)` : "Modus: žiadna hodnota sa nevyskytuje častejšie než ostatné.");
        return o;
      }
    };
  }
});

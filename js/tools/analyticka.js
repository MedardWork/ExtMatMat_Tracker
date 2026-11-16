/* ============================================================
   TOOL: analyticka — analytic geometry in the plane with points you can drag: distance and midpoint,
   vectors, the equations of a line, two lines, a circle and a line, the area of a triangle. JSXGraph board.
   cfg:
     typ      "body"       A, B: vector AB, distance, midpoint; switch pomer + sliders m, n (the point dividing AB as m : n)
              "vektory"    u = OU, v = OV; switches sucet, rozdiel, uhol (scalar product and angle),
                           kolmy (the perpendicular vector), plocha (determinant, parallelogram), priemet (projection of u on v),
                           nasobok (the multiple k·u; the slider k appears when nasobok is on or k is given)
              "priamka"    the line AB in all its forms; switches vektory (direction and normal), vzdialenost (of point C)
              "priamky"    lines AB and CD: intersection, angle, parallel or perpendicular (parallel: their distance)
              "kruznica"   circle with centre S and radius r, and the line AB: common points
              "obsah"      triangle ABC: area from the coordinates
     pts      {A:[-3, -1]}            starting positions          fixed  ["A"]   points that cannot be moved
     view     [left, top, right, bottom]                          snap   1       grid the points snap to
     on, toggles, free, lock, hide    as in toolParams
     en       true      English texts (theory of the Danish topics)
     On the tool's own page a line can be typed as an equation (2x − y + 3 = 0, y = 2x + 3) and a circle too
     ((x − 1)² + (y + 2)² = 9 or x² + y² − 2x + 4y − 4 = 0): lineFromText / circleFromText below.
     out(P, h, st)     h.an — the measured values of the scene (see calc below), e.g. {d, S, u, n, k, q, a, b, c}
   Helper: linTex([[2, "x"], [-3, "y"], [5, ""]]) → "2x - 3y + 5"
   ============================================================ */
function linTex(terms, n = texN){
  let s = "";
  terms.forEach(([k, v]) => {
    if(Math.abs(k) < 1e-9) return;
    const a = Math.abs(k), body = (a === 1 && v ? "" : n(a)) + v;
    s += s ? (k < 0 ? " - " : " + ") + body : (k < 0 ? "-" : "") + body;
  });
  return s || "0";
}

/* "2x − y + 3 = 0", "y = 2x + 3" → {a, b, c} of a·x + b·y + c = 0, or {error} */
function lineFromText(text){
  const parts = String(text).split("=");
  if(parts.length > 2 || !parts[0].trim()) return {error:"Napíš rovnicu priamky, napríklad 2x − y + 3 = 0 alebo y = 2x + 3."};
  const L = mathExpr(parts[0], []), Rr = mathExpr(parts.length === 2 && parts[1].trim() ? parts[1] : "0", []);
  if(!L.ok || !Rr.ok) return {error:L.err || Rr.err};
  if([...L.vars, ...Rr.vars].some(v => v !== "x" && v !== "y")) return {error:"V rovnici priamky môžu byť len x a y."};
  const f = (x, y) => L.f({x, y}) - Rr.f({x, y}), c = f(0, 0), a = f(1, 0) - c, b = f(0, 1) - c;
  if(![a, b, c].every(isFinite) || Math.abs(f(2, 3) - (2 * a + 3 * b + c)) > 1e-7 || Math.abs(f(-3, 5) - (-3 * a + 5 * b + c)) > 1e-7) return {error:"Toto nie je rovnica priamky (x a y smú byť len v prvej mocnine)."};
  if(Math.abs(a) + Math.abs(b) < 1e-9) return {error:"V rovnici chýba x aj y."};
  return {a, b, c};
}
/* two points of the line a·x + b·y + c = 0 that sit on the grid if any do */
function linePoints(a, b, c){
  const on = [], r3 = v => Math.round(v * 1000) / 1000;
  for(let x = -8; x <= 8; x++) for(let y = -6; y <= 6; y++) if(Math.abs(a * x + b * y + c) < 1e-9) on.push([x, y]);
  if(on.length >= 2) return [on[0], on[on.length - 1]];
  return Math.abs(b) > 1e-9 ? [[-4, r3(-(a * -4 + c) / b)], [4, r3(-(a * 4 + c) / b)]] : [[r3(-c / a), -3], [r3(-c / a), 3]];
}
/* "(x − 1)² + (y + 2)² = 9", "x² + y² − 2x + 4y − 4 = 0" → {m, n, r}, or {error} */
function circleFromText(text){
  const parts = String(text).split("=");
  if(parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return {error:"Napíš rovnicu kružnice, napríklad (x − 1)² + (y + 2)² = 9."};
  const L = mathExpr(parts[0], []), Rr = mathExpr(parts[1], []);
  if(!L.ok || !Rr.ok) return {error:L.err || Rr.err};
  if([...L.vars, ...Rr.vars].some(v => v !== "x" && v !== "y")) return {error:"V rovnici kružnice môžu byť len x a y."};
  const f = (x, y) => L.f({x, y}) - Rr.f({x, y}), c = f(0, 0);
  const A = (f(1, 0) + f(-1, 0)) / 2 - c, D = (f(1, 0) - f(-1, 0)) / 2, B = (f(0, 1) + f(0, -1)) / 2 - c, E = (f(0, 1) - f(0, -1)) / 2;
  const q = (x, y) => A * x * x + B * y * y + D * x + E * y + c;
  if(![A, B, D, E, c].every(isFinite) || Math.abs(f(2, 3) - q(2, 3)) > 1e-6 || Math.abs(f(-3, 1.5) - q(-3, 1.5)) > 1e-6) return {error:"Toto nie je rovnica kružnice."};
  if(Math.abs(A) < 1e-9 || Math.abs(A - B) > 1e-9) return {error:"Pri x² a y² musí byť rovnaký nenulový koeficient."};
  const m = -D / (2 * A), n = -E / (2 * A), rr = m * m + n * n - c / A;
  if(rr <= 1e-9) return {error:`Po úprave vyjde r² = ${fmtN(rr, 3)}: taká kružnica neexistuje.`};
  const r4 = v => Math.round(v * 1e4) / 1e4;
  return {m:r4(m), n:r4(n), r:r4(Math.sqrt(rr))};
}

defTool("analyticka", {
  name:"Analytická geometria",
  area:"Planimetria",
  desc:"Body, vektory, priamka a kružnica v súradniciach. Ťahaj body a sleduj vzdialenosť, rovnice, priesečníky a uhly.",
  topics:["b19", "b20", "b21", "b22", "b23", "b24", "b25"],
  presets:[
    {name:"Vzdialenosť a stred", cfg:{typ:"body"}, tip:"Posuň body $A$, $B$ alebo im napíš súradnice. Vzdialenosť je prepona trojuholníka s odvesnami $|\\Delta x|$ a $|\\Delta y|$."},
    {name:"Deliaci pomer", cfg:{typ:"body", on:{pomer:true}}, tip:"Nastav pomer $m : n$. Bod leží v $\\frac{m}{m+n}$ cesty z $A$ do $B$."},
    {name:"Vektory", cfg:{typ:"vektory", on:{sucet:true}}, tip:"Ťahaj konce vektorov. Súčet je uhlopriečka rovnobežníka, súradnice sa sčítajú po zložkách."},
    {name:"Násobok vektora", cfg:{typ:"vektory", on:{nasobok:true}}, tip:"Meň $k$. Čo urobí s vektorom záporné $k$ a čo $k$ medzi 0 a 1?"},
    {name:"Skalárny súčin a uhol", cfg:{typ:"vektory", on:{uhol:true}}, tip:"Nájdi polohu, v ktorej je skalárny súčin 0. Vektory sú vtedy kolmé."},
    {name:"Rovnica priamky", cfg:{typ:"priamka", on:{vektory:true}}, tip:"Priamku zadaj dvoma bodmi alebo napíš jej rovnicu. Uvidíš všeobecný, smernicový aj parametrický tvar."},
    {name:"Vzdialenosť bodu od priamky", cfg:{typ:"priamka", on:{vzdialenost:true}}, tip:"Posuň bod $C$ na priamku a ďalej od nej. Vzdialenosť sa meria po kolmici."},
    {name:"Dve priamky", cfg:{typ:"priamky"}, tip:"Obe priamky zadaj bodmi alebo rovnicami. Nástroj nájde priesečník a uhol, ktorý zvierajú."},
    {name:"Rovnobežky a ich vzdialenosť", cfg:{typ:"priamky", pts:{A:[-5, -2], B:[3, 2], C:[-3, 2], D:[3, 5]}}, tip:"Rovnobežky majú rovnaký normálový vektor. Posuň bod $D$ a rovnobežnosť sa stratí."},
    {name:"Kružnica a priamka", cfg:{typ:"kruznica"}, tip:"Kružnicu aj priamku môžeš zadať rovnicou. Počet spoločných bodov určí vzdialenosť stredu od priamky."},
    {name:"Obsah trojuholníka", cfg:{typ:"obsah"}, tip:"Ťahaj vrcholy. Obsah je polovica absolútnej hodnoty determinantu z vektorov $\\overrightarrow{AB}$ a $\\overrightarrow{AC}$."}
  ],
  help:"Body ťahaj myšou alebo im vpíš súradnice do polí vpravo. Priamku môžeš napísať aj rovnicou, napríklad `2x - y + 3 = 0` alebo `y = 2x + 3`, kružnicu ako `(x - 1)^2 + (y + 2)^2 = 9` alebo vo všeobecnom tvare `x^2 + y^2 - 2x + 4y - 4 = 0`. Nástroj z rovnice prečíta body, stred a polomer.",

  make(cfg, env){
    const T = (sk, en) => cfg.en ? en : sk;
    const typ = ["body", "vektory", "priamka", "priamky", "kruznica", "obsah"].includes(cfg.typ) ? cfg.typ : "body";
    const start = {
      body:{A:[-3, -1], B:[5, 3]}, vektory:{U:[4, 1], V:[1, 3]}, priamka:{A:[-4, -1], B:[4, 3], C:[2, -3]},
      priamky:{A:[-5, -2], B:[3, 2], C:[-3, 4], D:[3, -2]}, kruznica:{S:[0, 0], A:[-6, -2], B:[5, 4]}, obsah:{A:[-4, -2], B:[5, -1], C:[1, 4]}
    }[typ];
    const colors = {A:"a", B:"a", C:"d", D:"d", S:"b", U:"a", V:"b"};
    const points = {};
    for(const n in start){ const p = (cfg.pts && cfg.pts[n]) || start[n]; points[n] = [p[0], p[1], {fixed:(cfg.fixed || []).includes(n), color:colors[n], name:typ === "vektory" ? "" : n}]; }
    const ck = (name, color) => ({type:"check", v:false, name, color});
    const defs = typ === "body" ? {pomer:ck(T("Bod deliaci AB v pomere m : n", "Point dividing AB in the ratio m : n"), "d"), m:{v:1, min:1, max:6, step:1, color:"d", when:P => !!P.pomer}, n:{v:2, min:1, max:6, step:1, color:"d", when:P => !!P.pomer}}
      : typ === "vektory" ? {sucet:ck(T("Súčet u + v", "Sum u + v"), "d"), rozdiel:ck(T("Rozdiel u − v", "Difference u − v"), "c"), uhol:ck(T("Skalárny súčin a uhol", "Dot product and angle")), kolmy:ck(T("Kolmý vektor k u", "Vector perpendicular to u")), plocha:ck(T("Determinant a rovnobežník", "Determinant and parallelogram")), priemet:ck(T("Priemet u do smeru v", "Projection of u onto v")), nasobok:ck(T("Násobok k · u", "Multiple k · u"), "d"),
          k:env.full || (cfg.on && cfg.on.nasobok) || cfg.k != null ? {v:2, min:-3, max:3, step:.5, color:"d", when:P => !!P.nasobok} : null}
      : typ === "priamka" ? {vektory:ck(T("Smerový a normálový vektor", "Direction and normal vector"), "b"), vzdialenost:ck(T("Vzdialenosť bodu C", "Distance of the point C"), "d")}
      : typ === "kruznica" ? {r:{v:4, min:1, max:6, step:.5, color:"b", note:T("polomer", "radius")}} : {};
    const params = toolParams(defs, cfg, env);
    if(typ === "body" && !params.pomer.v && params.pomer.lock){ params.m.lock = params.m.hide = params.n.lock = params.n.hide = true; }

    /* a line through two points as a·x + b·y + c = 0 with tidy whole coefficients when possible */
    const lineOf = (x1, y1, x2, y2) => {
      let a = y1 - y2, b = x2 - x1, c = -(a * x1 + b * y1);
      /* decimal coefficients (points off the grid) are scaled up to whole ones when a small factor does it */
      const k10 = [1, 2, 4, 5, 10, 20, 25, 50, 100, 1000].find(k => [a, b, c].every(v => Math.abs(v * k - Math.round(v * k)) < 1e-7));
      if(k10 > 1){ a *= k10; b *= k10; c *= k10; }
      const whole = [a, b, c].every(v => Math.abs(v - Math.round(v)) < 1e-7);
      if(whole){ const g = [a, b, c].map(v => Math.abs(Math.round(v))).reduce((p, q) => { while(q){ [p, q] = [q, p % q]; } return p; }, 0) || 1; a = Math.round(a) / g; b = Math.round(b) / g; c = Math.round(c) / g; }
      if(a < 0 || (a === 0 && b < 0)){ a = -a; b = -b; c = -c; }
      return {a, b, c, u:[x2 - x1, y2 - y1], n:[a, b], ok:Math.abs(a) + Math.abs(b) > 1e-9, k:b ? -a / b : NaN, q:b ? -c / b : NaN};
    };
    const deg = x => x * 180 / Math.PI, r3 = v => Math.round(v * 1000) / 1000;
    const calc = P => {
      if(typ === "body"){
        const u = [P.Bx - P.Ax, P.By - P.Ay], t = P.m / (P.m + P.n);
        return {u, d:Math.hypot(u[0], u[1]), S:[(P.Ax + P.Bx) / 2, (P.Ay + P.By) / 2], X:[P.Ax + u[0] * t, P.Ay + u[1] * t]};
      }
      if(typ === "vektory"){
        const u = [P.Ux, P.Uy], v = [P.Vx, P.Vy], dot = u[0] * v[0] + u[1] * v[1], lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]), det = u[0] * v[1] - u[1] * v[0];
        const t = lv ? dot / (lv * lv) : 0;
        return {u, v, dot, lu, lv, det, uhol:lu && lv ? deg(Math.acos(Math.max(-1, Math.min(1, dot / (lu * lv))))) : NaN, sucet:[u[0] + v[0], u[1] + v[1]], rozdiel:[u[0] - v[0], u[1] - v[1]],
          kolmy:[-u[1], u[0]], priemet:[v[0] * t, v[1] * t], ku:[(P.k ?? 1) * u[0], (P.k ?? 1) * u[1]]};
      }
      if(typ === "priamka"){
        const l = lineOf(P.Ax, P.Ay, P.Bx, P.By), den = Math.hypot(l.a, l.b) || 1, val = l.a * P.Cx + l.b * P.Cy + l.c;
        return Object.assign(l, {d:Math.abs(val) / den, F:[P.Cx - l.a * val / (den * den), P.Cy - l.b * val / (den * den)]});
      }
      if(typ === "priamky"){
        const p = lineOf(P.Ax, P.Ay, P.Bx, P.By), q = lineOf(P.Cx, P.Cy, P.Dx, P.Dy), det = p.a * q.b - q.a * p.b;
        const X = Math.abs(det) > 1e-9 ? [(p.b * q.c - q.b * p.c) / det, (q.a * p.c - p.a * q.c) / det] : null;
        const cos = Math.abs(p.u[0] * q.u[0] + p.u[1] * q.u[1]) / ((Math.hypot(...p.u) * Math.hypot(...q.u)) || 1);
        const qd = Math.hypot(q.a, q.b) || 1, qv = q.a * P.Ax + q.b * P.Ay + q.c;
        return {p, q, X, uhol:deg(Math.acos(Math.min(1, cos))), same:!X && Math.abs(p.a * P.Cx + p.b * P.Cy + p.c) < 1e-9,
          dpar:X ? NaN : Math.abs(qv) / qd, Fp:X ? null : [P.Ax - q.a * qv / (qd * qd), P.Ay - q.b * qv / (qd * qd)]};
      }
      if(typ === "kruznica"){
        const l = lineOf(P.Ax, P.Ay, P.Bx, P.By), den = Math.hypot(l.a, l.b) || 1, val = l.a * P.Sx + l.b * P.Sy + l.c, d = Math.abs(val) / den;
        const F = [P.Sx - l.a * val / (den * den), P.Sy - l.b * val / (den * den)], half = Math.sqrt(Math.max(0, P.r * P.r - d * d)), e = [-l.b / den, l.a / den];
        const pts = d > P.r + 1e-9 ? [] : half < 1e-6 ? [F] : [[F[0] - e[0] * half, F[1] - e[1] * half], [F[0] + e[0] * half, F[1] + e[1] * half]];
        return {l, d, F, pts, m:P.Sx, n:P.Sy, r:P.r};
      }
      const det = (P.Bx - P.Ax) * (P.Cy - P.Ay) - (P.By - P.Ay) * (P.Cx - P.Ax);
      return {det, S:Math.abs(det) / 2, u:[P.Bx - P.Ax, P.By - P.Ay], v:[P.Cx - P.Ax, P.Cy - P.Ay]};
    };
    const C = st => toolDerive(st, "an", calc);
    /* typed equations (the tool's own page): the field shows the current line or circle and can be rewritten */
    const eqTxt = l => linTex([[l.a, "x"], [l.b, "y"], [l.c, ""]], v => fmtN(v, 3)) + " = 0";
    const lineIn = (name, p1, p2, get) => ({
      label:T(`Priamka ${name} rovnicou`, `Line ${name} as an equation`), wide:true, keys:["x", "y", "=", "+", "−"],
      read:st => { const l = get(C(st)); return l && l.ok ? eqTxt(l) : ""; },
      apply(text, st){
        const l = lineFromText(text);
        if(l.error) return l;
        const [q1, q2] = linePoints(l.a, l.b, l.c), pts = Object.assign({}, livePts(st), {[p1]:q1, [p2]:q2});
        return Object.assign({}, cfg, {pts, snap:gridOf(pts)});
      }
    });
    /* points are pulled to the grid when they are made: off-grid ones need a fine grid to stay where they were put */
    const gridOf = pts => Object.values(pts).every(p => p.every(v => Math.abs(v - Math.round(v)) < 1e-9)) ? 1 : .001;
    const livePts = st => { const o = {}; for(const n in points) o[n] = st ? [st.P[n + "x"], st.P[n + "y"]] : points[n].slice(0, 2); return o; };
    const sq = (v, s) => Math.abs(v) < 1e-9 ? `${s}²` : `(${s} ${v < 0 ? "+" : "−"} ${fmtN(Math.abs(v), 3)})²`;
    const inputs = typ === "priamka" ? [lineIn("AB", "A", "B", r => r)]
      : typ === "priamky" ? [lineIn("AB", "A", "B", r => r.p), lineIn("CD", "C", "D", r => r.q)]
      : typ === "kruznica" ? [{
          label:T("Kružnica rovnicou", "Circle as an equation"), wide:true, keys:["x", "y", "²", "=", "+", "−"],
          read:st => `${sq(st.P.Sx, "x")} + ${sq(st.P.Sy, "y")} = ${fmtN(st.P.r * st.P.r, 3)}`,
          apply(text, st){
            const c = circleFromText(text);
            if(c.error) return c;
            st.P.r = c.r;   /* values are kept across the rebuild, so the new radius goes in first */
            const pts = Object.assign({}, livePts(st), {S:[c.m, c.n]});
            return Object.assign({}, cfg, {r:{v:c.r, max:Math.max(6, Math.ceil(c.r))}, pts, snap:gridOf(pts)});
          }
        }, lineIn("AB", "A", "B", r => r.l)] : null;

    return {
      params, points, snap:cfg.snap || 1,
      hint:T("Body ťahaj alebo im vpíš súradnice.", "Drag the points or type their coordinates."),
      inputs,
      board:{bbox:cfg.view || [-9, 7, 9, -7], aspect:"9/7"},
      draw(g, P, st){
        const K = () => C(st), on = (id, f) => () => P[id] ? f() : NaN;
        const arrow = (p, q, color, o) => g.seg(p, q, color, Object.assign({strokeWidth:2.6, lastArrow:{type:2, size:6}}, o));
        if(typ === "body"){
          arrow(["Ax", "Ay"], ["Bx", "By"], "ink");
          g.pt(() => K().S[0], () => K().S[1], "b", {label:"S", at:"t", size:3.5});
          g.pt(on("pomer", () => K().X[0]), () => K().X[1], "d", {label:"X", at:"b"});
          g.seg(["Ax", "Ay"], ["Bx", "Ay"], "soft", {dash:2, strokeWidth:1.2}); g.seg(["Bx", "Ay"], ["Bx", "By"], "soft", {dash:2, strokeWidth:1.2});
        } else if(typ === "vektory"){
          const O = [0, 0];
          g.poly([O, ["Ux", "Uy"], [() => P.plocha ? K().sucet[0] : NaN, () => K().sucet[1]], ["Vx", "Vy"]], "d");
          arrow(O, ["Ux", "Uy"], "a"); arrow(O, ["Vx", "Vy"], "b");
          g.txt(() => P.Ux / 2, () => P.Uy / 2, "u", "a", {at:"br"}); g.txt(() => P.Vx / 2, () => P.Vy / 2, "v", "b", {at:"tl"});
          arrow(O, [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "d");
          g.seg(["Ux", "Uy"], [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "b", {dash:2, strokeWidth:1.3}); g.seg(["Vx", "Vy"], [on("sucet", () => K().sucet[0]), () => K().sucet[1]], "a", {dash:2, strokeWidth:1.3});
          arrow([on("rozdiel", () => P.Vx), "Vy"], ["Ux", "Uy"], "c");
          arrow(O, [on("kolmy", () => K().kolmy[0]), () => K().kolmy[1]], "ok");
          arrow(O, [on("nasobok", () => K().ku[0]), () => K().ku[1]], "d", {strokeWidth:4});
          arrow(O, [on("priemet", () => K().priemet[0]), () => K().priemet[1]], "warn", {strokeWidth:4});
          g.seg(["Ux", "Uy"], [on("priemet", () => K().priemet[0]), () => K().priemet[1]], "soft", {dash:2, strokeWidth:1.3});
        } else if(typ === "priamka" || typ === "priamky" || typ === "kruznica"){
          g.line(["Ax", "Ay"], ["Bx", "By"], "ink", {strokeWidth:2.4});
          if(typ === "priamka"){
            arrow(["Ax", "Ay"], [on("vektory", () => P.Bx), "By"], "b");
            arrow(["Ax", "Ay"], [on("vektory", () => P.Ax + K().n[0] / (Math.hypot(...K().n) || 1) * 2), () => P.Ay + K().n[1] / (Math.hypot(...K().n) || 1) * 2], "ok");
            g.seg(["Cx", "Cy"], [on("vzdialenost", () => K().F[0]), () => K().F[1]], "d", {strokeWidth:2.4});
            g.pt(on("vzdialenost", () => K().F[0]), () => K().F[1], "d", {size:3, label:"P", at:"b"});
          } else if(typ === "priamky"){
            g.line(["Cx", "Cy"], ["Dx", "Dy"], "d", {strokeWidth:2.4});
            g.pt(() => K().X ? K().X[0] : NaN, () => K().X ? K().X[1] : NaN, "ok", {label:"P", at:"t"});
            g.seg(["Ax", "Ay"], [() => K().Fp && !K().same ? K().Fp[0] : NaN, () => K().Fp ? K().Fp[1] : NaN], "c", {strokeWidth:2.4, dash:2});
          } else {
            g.circle("Sx", "Sy", "r", "b", {strokeWidth:2.6});
            [0, 1].forEach(i => g.pt(() => K().pts[i] ? K().pts[i][0] : NaN, () => K().pts[i] ? K().pts[i][1] : NaN, "ok", {label:"P" + "₁₂"[i], at:i ? "br" : "tl"}));
            g.seg(["Sx", "Sy"], [() => K().F[0], () => K().F[1]], "d", {dash:2, strokeWidth:1.6});
          }
        } else {
          g.poly([["Ax", "Ay"], ["Bx", "By"], ["Cx", "Cy"]], "d");
          g.seg(["Ax", "Ay"], ["Bx", "By"], "ink"); g.seg(["Bx", "By"], ["Cx", "Cy"], "ink"); g.seg(["Cx", "Cy"], ["Ax", "Ay"], "ink");
        }
      },
      out(P, h, st){
        const k = C(st), tn = h.tn, t3 = v => tn(r3(v), 3);
        h.an = k;
        if(cfg.out) return cfg.out(P, h, st);
        const vec = v => `(${t3(v[0])};\\ ${t3(v[1])})`, pt = (x, y) => `[${t3(x)};\\ ${t3(y)}]`;
        const sq = v => v < 0 ? `(${tn(v)})` : tn(v), eq = x => Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? "=" : "\\doteq";
        if(typ === "body"){
          let o = h.calc(`\\overrightarrow{AB} = B - A = ${vec(k.u)}`) + h.calc(`|AB| = \\sqrt{${sq(k.u[0])}^2 + ${sq(k.u[1])}^2} = \\sqrt{${tn(k.u[0] ** 2 + k.u[1] ** 2)}} ${eq(k.d)} ${tn(k.d)}`)
            + h.calc(`\\vb{S} = \\left[\\tfrac{${tn(P.Ax)} + ${sq(P.Bx)}}{2};\\ \\tfrac{${tn(P.Ay)} + ${sq(P.By)}}{2}\\right] = \\vb{${pt(k.S[0], k.S[1])}}`);
          if(P.pomer) o += h.calc(`\\vd{X} = A + \\tfrac{${P.m}}{${P.m + P.n}} \\cdot \\overrightarrow{AB} = \\vd{${pt(k.X[0], k.X[1])}}`) + h.p(`$|AX| : |XB| = \\vd{${P.m} : ${P.n}}$, ${T("úsečka má", "the segment has")} $${P.m + P.n}$ ${T("rovnakých dielov", "equal parts")}.`);
          return o;
        }
        if(typ === "vektory"){
          let o = h.calc(`\\va{\\vec u} = \\va{${vec(k.u)}},\\ |\\vec u| ${eq(k.lu)} ${tn(k.lu)}`) + h.calc(`\\vb{\\vec v} = \\vb{${vec(k.v)}},\\ |\\vec v| ${eq(k.lv)} ${tn(k.lv)}`);
          if(P.sucet) o += h.calc(`\\vd{\\vec u + \\vec v} = \\vd{${vec(k.sucet)}}`);
          if(P.rozdiel) o += h.calc(`\\vc{\\vec u - \\vec v} = \\vc{${vec(k.rozdiel)}}`);
          if(P.uhol) o += h.calc(`\\vec u \\cdot \\vec v = ${tn(k.u[0])} \\cdot ${sq(k.v[0])} + ${sq(k.u[1])} \\cdot ${sq(k.v[1])} = ${tn(k.dot)}`)
            + h.calc(`\\cos \\varphi = \\dfrac{${tn(k.dot)}}{${tn(k.lu)} \\cdot ${tn(k.lv)}} \\Rightarrow \\varphi \\doteq ${tn(k.uhol, 1)}^\\circ`) + (Math.abs(k.dot) < 1e-9 ? h.pill(T("skalárny súčin 0: vektory sú kolmé", "dot product 0: the vectors are perpendicular"), "ok") : "");
          if(P.nasobok) o += h.calc(`\\vd{${tn(P.k ?? 1)}} \\cdot \\va{\\vec u} = \\vd{${vec(k.ku)}}`) + h.p(`$|k \\vec u| = |k| \\cdot |\\vec u| ${eq(Math.abs(P.k ?? 1) * k.lu)} ${tn(Math.abs(P.k ?? 1) * k.lu)}$${(P.k ?? 1) < 0 ? T(", opačný smer", ", opposite direction") : ""}`);
          if(P.kolmy) o += h.calc(`\\hat{u} = (-u_2;\\ u_1) = ${vec(k.kolmy)}`);
          if(P.plocha) o += h.calc(`\\det(\\vec u, \\vec v) = ${tn(k.u[0])} \\cdot ${sq(k.v[1])} - ${sq(k.u[1])} \\cdot ${sq(k.v[0])} = ${tn(k.det)}`) + h.p((cfg.en ? `Area of the parallelogram:` : `Obsah rovnobežníka:`) + ` $|\\det| = ${tn(Math.abs(k.det))}$${Math.abs(k.det) < 1e-9 ? T(", vektory sú rovnobežné", ", the vectors are parallel") : ""}.`);
          if(P.priemet) o += h.calc(`\\vec u_v = \\dfrac{\\vec u \\cdot \\vec v}{|\\vec v|^2} \\, \\vec v = ${vec(k.priemet)}`);
          return o;
        }
        const general = l => `${linTex([[l.a, "x"], [l.b, "y"], [l.c, ""]], t3)} = 0`;
        const slope = l => l.b ? `y = ${linTex([[l.k, "x"], [l.q, ""]], t3)}` : `x = ${t3(-l.c / l.a)}`;
        if(typ === "priamka"){
          if(!k.ok) return h.p(T("Body A a B splývajú, priamka nimi nie je určená.", "A and B coincide, they do not determine a line."));
          let o = h.calc(`\\vb{\\vec s} = B - A = \\vb{${vec(k.u)}}, \\quad \\vec n = ${vec(k.n)}`)
            + h.calc(`x = ${tn(P.Ax)} ${k.u[0] < 0 ? "-" : "+"} ${t3(Math.abs(k.u[0]))}t,\\quad y = ${tn(P.Ay)} ${k.u[1] < 0 ? "-" : "+"} ${t3(Math.abs(k.u[1]))}t`)
            + h.calc(general(k)) + h.calc(slope(k));
          if(P.vzdialenost) o += h.calc(`\\vd{d} = \\dfrac{|${t3(k.a)} \\cdot ${sq(P.Cx)} ${k.b < 0 ? "-" : "+"} ${t3(Math.abs(k.b))} \\cdot ${sq(P.Cy)} ${k.c < 0 ? "-" : "+"} ${t3(Math.abs(k.c))}|}{\\sqrt{${sq(r3(k.a))}^2 + ${sq(r3(k.b))}^2}} ${eq(k.d)} \\vd{${tn(k.d)}}`);
          return o;
        }
        if(typ === "priamky"){
          let o = h.calc(`p:\\ ${general(k.p)}`) + h.calc(`\\vd{q}:\\ ${general(k.q)}`);
          if(k.X) o += h.calc(`P = ${pt(k.X[0], k.X[1])}, \\quad \\varphi \\doteq ${tn(k.uhol, 1)}^\\circ`) + (Math.abs(k.uhol - 90) < 1e-6 ? h.pill(T("kolmé: normálové vektory majú skalárny súčin 0", "perpendicular: the normal vectors have dot product 0"), "ok") : h.pill(T("rôznobežné: jeden priesečník", "intersecting: one common point"), "flat"));
          else o += h.pill(k.same ? T("totožné: nekonečne veľa spoločných bodov", "identical: infinitely many common points") : T("rovnobežné: žiadny spoločný bod", "parallel: no common point"), k.same ? "ok" : "down")
            + (k.same ? "" : h.calc(`d(p, \\vd{q}) = d(A, \\vd{q}) ${eq(k.dpar)} ${tn(k.dpar)}`));
          return o;
        }
        if(typ === "kruznica"){
          const part = (v, c) => c === 0 ? `${v}^2` : `(${v} ${c < 0 ? "+" : "-"} ${t3(Math.abs(c))})^2`;
          let o = h.calc(`${part("x", k.m)} + ${part("y", k.n)} = \\vb{${tn(k.r * k.r)}}`) + h.calc(`p:\\ ${general(k.l)}`) + h.calc(`\\vd{d(S, p)} ${eq(k.d)} \\vd{${tn(k.d)}} ${k.pts.length === 2 ? "<" : k.pts.length ? "=" : ">"} \\vb{r} = \\vb{${tn(k.r)}}`);
          o += k.pts.length === 2 ? h.pill(T("sečnica: dva spoločné body", "secant: two common points"), "ok") : k.pts.length ? h.pill(T("dotyčnica: jeden spoločný bod", "tangent: one common point"), "flat") : h.pill(T("vonkajšia priamka: žiadny spoločný bod", "no common point"), "down");
          if(k.pts.length) o += h.p(k.pts.map((p, i) => `$P_{${i + 1}} = ${pt(p[0], p[1])}$`).join(", "));
          return o;
        }
        return h.calc(`\\overrightarrow{AB} = ${vec(k.u)}, \\quad \\overrightarrow{AC} = ${vec(k.v)}`)
          + h.calc(`S = \\tfrac12 \\left| ${tn(k.u[0])} \\cdot ${sq(k.v[1])} - ${sq(k.u[1])} \\cdot ${sq(k.v[0])} \\right| = \\tfrac12 \\cdot |${tn(k.det)}| = \\vd{${tn(k.S)}}`)
          + (k.S === 0 ? h.pill(T("obsah 0: body ležia na jednej priamke", "area 0: the points lie on one line"), "flat") : "");
      }
    };
  }
});

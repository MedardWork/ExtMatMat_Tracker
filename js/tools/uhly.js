/* ============================================================
   TOOL: uhly — two lines cut by a third: vertical, adjacent, corresponding and alternate angles, and
   what happens to them when the two lines stop being parallel. Plain SVG.
   cfg:
     alfa     60 | {v, min, max, step, lock}     the angle between the transversal and the upper line
     sklon    0  | {…}                           tilt of the lower line; 0 = parallel
     on       {vrcholove, susedne, suhlasne, striedave}     pairs marked from the start;  toggles: which may be switched
     free, lock, hide                            as in toolParams
     out(P, h, st)     h.ang = {alfa, dolu, susedny, rovnobezne}
   ============================================================ */
const UH_PAIRS = [["vrcholove", "Vrcholové uhly", "a"], ["susedne", "Susedné uhly", "b"], ["suhlasne", "Súhlasné uhly", "d"], ["striedave", "Striedavé uhly", "c"]];

defTool("uhly", {
  name:"Dvojice uhlov",
  area:"Planimetria",
  desc:"Dve priamky preťaté treťou: vrcholové, susedné, súhlasné a striedavé uhly, a čo sa s nimi stane, keď priamky nie sú rovnobežné.",
  topics:["a27"],
  presets:[
    {name:"Súhlasné a striedavé", cfg:{on:{suhlasne:true, striedave:true}}},
    {name:"Vrcholové a susedné", cfg:{on:{vrcholove:true, susedne:true}}},
    {name:"Nerovnobežné priamky", cfg:{sklon:15, on:{suhlasne:true}}}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const defs = {
      alfa:{v:60, min:20, max:160, step:5, color:"a", name:"α", note:"uhol priečky"},
      sklon:{v:0, min:-20, max:20, step:5, name:"sklon", note:"dolnej priamky", plain:true}
    };
    UH_PAIRS.forEach(([id, name, color]) => { defs[id] = {type:"check", v:false, name, color}; });
    const params = toolParams(defs, Object.assign({}, cfg, {on:cfg.on || {suhlasne:true}}), env);
    const W = 560, H = 320, rad = d => d * Math.PI / 180;

    return {
      params, aspect:`${W}/${H}`,
      svg(P, st){
        const thumb = st.env.thumb, a = P.alfa, s = P.sklon, X1 = [300, 100];
        /* the lower line runs through a fixed point; the transversal meets it at X2 */
        const Q = [280, 232], dq = [Math.cos(rad(s)), -Math.sin(rad(s))], dt = [Math.cos(rad(a)), -Math.sin(rad(a))];
        const den = dt[0] * dq[1] - dt[1] * dq[0], t = ((Q[0] - X1[0]) * dq[1] - (Q[1] - X1[1]) * dq[0]) / den;
        const X2 = [X1[0] + dt[0] * t, X1[1] + dt[1] * t];
        const far = (p, d, k) => [p[0] + d[0] * k, p[1] + d[1] * k];
        let h = "";
        const wedge = (p, a0, a1, cls, r, label) => {
          const m = rad((a0 + a1) / 2), lp = [p[0] + (r + 15) * Math.cos(m), p[1] - (r + 15) * Math.sin(m)];
          return SV.path(`M${SV.n(p[0])} ${SV.n(p[1])}` + SV.arc(p[0], p[1], r, a0, a1).replace("M", "L") + "Z", `bg ${cls} vn-on`) + SV.path(SV.arc(p[0], p[1], r, a0, a1), `s ${cls}`)
            + (thumb ? "" : SV.text(lp[0], lp[1] + 4, label, `mid sm halo ${cls}`));
        };
        const v = x => fmtN(x, 1) + "°", low = a - s;
        if(P.susedne) h += wedge(X1, a, 180, "cb", 30, v(180 - a));
        if(P.vrcholove) h += wedge(X1, 180, 180 + a, "ca", 30, v(a));
        if(P.striedave) h += wedge(X1, 180, 180 + a, "cc", P.vrcholove ? 20 : 30, P.vrcholove ? "" : v(a)) + wedge(X2, s, a, "cc", 20, P.suhlasne ? "" : v(low));
        if(P.suhlasne) h += wedge(X2, s, a, "cd", 30, v(low));
        h += wedge(X1, 0, a, P.suhlasne && !P.vrcholove && !P.susedne ? "cd" : "ca", 30, v(a));
        h += SV.line(30, X1[1], W - 30, X1[1], "s") + SG.seg(far(Q, dq, -300), far(Q, dq, 300), "s") + SG.seg(far(X1, dt, -400), far(X1, dt, 400), "s csoft");
        h += SG.dot(X1, "f") + SG.dot(X2, "f");
        if(!thumb) h += SV.text(40, X1[1] - 9, "p", "it") + SV.text(40, far(Q, dq, -240)[1] - 9, "q", "it");
        return SV.wrap(W, H, h);
      },
      out(P, h, st){
        const tn = h.tn, low = P.alfa - P.sklon, par = P.sklon === 0;
        h.ang = {alfa:P.alfa, dolu:low, susedny:180 - P.alfa, rovnobezne:par};
        if(cfg.out) return cfg.out(P, h, st);
        let o = "";
        if(P.vrcholove) o += h.p(`**Vrcholové** uhly ležia oproti sebe a sú vždy rovnaké: $\\va{${tn(P.alfa)}^\\circ}$.`);
        if(P.susedne) o += h.p(`**Susedné** uhly dávajú spolu priamy uhol: $${tn(P.alfa)}^\\circ + \\vb{${tn(180 - P.alfa)}^\\circ} = 180^\\circ$.`);
        if(P.suhlasne) o += h.p(`**Súhlasné** uhly: $${tn(P.alfa)}^\\circ$ hore a $\\vd{${tn(low)}^\\circ}$ dole.`);
        if(P.striedave) o += h.p(`**Striedavé** uhly: $${tn(P.alfa)}^\\circ$ hore a $\\vc{${tn(low)}^\\circ}$ dole, na opačných stranách priečky.`);
        if(P.suhlasne || P.striedave) o += par ? h.pill("p ∥ q: súhlasné aj striedavé uhly sú rovnaké", "ok") : h.pill("p a q nie sú rovnobežné: uhly sa líšia", "down");
        return o;
      }
    };
  }
});

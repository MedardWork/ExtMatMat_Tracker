/* ============================================================
   TOOL: konstrukcia — ruler-and-compass constructions shown step by step: what is given stays black,
   the step being made is coloured, earlier steps fade, the result is drawn thick. Plain SVG.
   cfg:
     typ      "os"          perpendicular bisector of AB            (d = |AB|, r = compass opening)
              "osuhla"      bisector of an angle                    (alfa, r)
              "kolmica"     perpendicular from a point to a line    (h = distance of the point, 0 = a point of the line; r)
              "rovnobezka"  parallel through a point                (h)
              "dotycnica"   tangents from a point to a circle       (r, d = distance of the point from the centre)
              "sss"         triangle from a, b, c                   "sus"  from c, b, alfa        "usu"  from c, alfa, beta
              "ssu"         triangle from c, a and alfa opposite a: 0, 1 or 2 solutions
              "cvt"         triangle from c, v (height on c), t (median on c)
              "cvg"         triangle from c, v (height on c), gama (angle at C): the arc of points seeing AB under gama
     krok     {v:1}         how many steps are drawn at the start (default: all);  lock it to show a finished picture
     a, b, c, … a number or {v, min, max, step, lock};  free / lock / hide as in toolParams
     out(P, h, st)     h.kon = {n (number of solutions), N (number of steps), krok, kroky:[text…]}
   ============================================================ */
defTool("konstrukcia", {
  name:"Konštrukcie pravítkom a kružidlom",
  area:"Planimetria",
  desc:"Základné konštrukcie a konštrukcie trojuholníka krok za krokom, s počtom riešení.",
  topics:["b28"],
  presets:[
    {name:"Os úsečky", cfg:{typ:"os"}, tip:"Krokuj tlačidlami. Dve kružnice s rovnakým polomerom sa pretnú v bodoch rovnako vzdialených od $A$ aj $B$."},
    {name:"Os uhla", cfg:{typ:"osuhla"}, tip:"Body na osi uhla sú od oboch ramien rovnako ďaleko."},
    {name:"Kolmica z bodu", cfg:{typ:"kolmica"}, tip:"Kružnica so stredom $P$ vytne na priamke úsečku. Jej os prechádza bodom $P$ a je na priamku kolmá."},
    {name:"Rovnobežka bodom", cfg:{typ:"rovnobezka"}, tip:"Tri oblúky s rovnakým polomerom vytvoria kosoštvorec $APCB$. Jeho protiľahlé strany sú rovnobežné."},
    {name:"Dotyčnice z bodu", cfg:{typ:"dotycnica"}, tip:"Body dotyku ležia na Tálesovej kružnici nad úsečkou $SM$, lebo uhol pri nich je pravý."},
    {name:"Trojuholník sss", cfg:{typ:"sss"}, tip:"Tretí vrchol leží na dvoch kružniciach naraz. Zmeň strany tak, aby sa kružnice nepretli."},
    {name:"Trojuholník sus", cfg:{typ:"sus"}, tip:"Dve strany a uhol medzi nimi určujú trojuholník jednoznačne."},
    {name:"Trojuholník usu", cfg:{typ:"usu"}, tip:"Strana a dva priľahlé uhly: tretí vrchol je priesečník ramien."},
    {name:"Trojuholník Ssu: počet riešení", cfg:{typ:"ssu"}, tip:"Uhol oproti kratšej strane nemusí stačiť. Meň $a$: kružnica pretne rameno dvakrát, raz alebo vôbec."},
    {name:"Trojuholník c, v, t", cfg:{typ:"cvt"}, tip:"Vrchol $C$ leží na rovnobežke vo vzdialenosti $v$ a zároveň na kružnici s polomerom $t$ okolo stredu strany $c$."},
    {name:"Trojuholník c, v, γ", cfg:{typ:"cvg"}, tip:"Všetky body, z ktorých vidno stranu $c$ pod uhlom $\\gamma$, ležia na kružnicovom oblúku."}
  ],
  fromText:toolTextIn, toText:toolTextOut,

  make(cfg, env){
    const rad = Math.PI / 180, dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const deg = (o, p) => Math.atan2(p[1] - o[1], p[0] - o[0]) / rad;
    const pol = (o, r, a) => [o[0] + r * Math.cos(a * rad), o[1] + r * Math.sin(a * rad)];
    /* common points of two circles: none, one, or two (the first lies to the left of the way from o1 to o2) */
    const cc = (o1, r1, o2, r2) => {
      const dx = o2[0] - o1[0], dy = o2[1] - o1[1], d = Math.hypot(dx, dy);
      if(d < 1e-9 || d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return [];
      const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a)), m = [o1[0] + a * dx / d, o1[1] + a * dy / d];
      return hh < 1e-6 ? [m] : [[m[0] - hh * dy / d, m[1] + hh * dx / d], [m[0] + hh * dy / d, m[1] - hh * dx / d]];
    };
    /* things a step draws */
    const I = {
      pt:(p, n, at) => ({k:"pt", p, n, at}),
      seg:(a, b, o) => Object.assign({k:"seg", a, b}, o),
      line(a, b, e = 1.2){ const l = dist(a, b) || 1, u = [(b[0] - a[0]) / l * e, (b[1] - a[1]) / l * e]; return {k:"seg", a:[a[0] - u[0], a[1] - u[1]], b:[b[0] + u[0], b[1] + u[1]]}; },
      ray:(a, ang, l) => ({k:"seg", a, b:pol(a, l, ang)}),
      arc:(o, r, a0, a1) => ({k:"arc", o, r, a0, a1}),
      mark:(o, q, w = 13) => ({k:"arc", o, r:dist(o, q), a0:deg(o, q) - w, a1:deg(o, q) + w}),
      ang:(p, a, b, s) => ({k:"ang", p, a, b, s}),
      right:(p, a, b) => ({k:"right", p, a, b}),
      poly:(pts, c) => ({k:"poly", pts, c}),
      txt:(p, s) => ({k:"txt", p, s})
    };
    const res = it => Object.assign(it, {res:true});
    const sl = (v, color, note, min, max, step = .5) => ({v, min, max, step, color, note});
    const angle = (v, color, name, min = 20, max = 150) => ({v, min, max, step:5, color, name, note:"stupne"});
    const AB = (c, P) => [I.seg([0, 0], [c, 0]), I.pt([0, 0], "A", [-1, -1]), I.pt([c, 0], "B", [1, -1]), I.txt([c / 2, -.42], "c")];
    const tri = (Cs, c) => Cs.flatMap((C, i) => [res(I.poly([[0, 0], [c, 0], C], i ? "cb" : "ca")), I.pt(C, Cs.length > 1 ? "C_" + (i + 1) : "C", [i ? 1 : -1, 1])]);
    /* points of the line y = v, or of a ray, hit by a circle: sorted params where disc ≥ 0 */
    const hits = (mid, disc) => disc < -1e-9 ? [] : disc < 1e-9 ? [mid] : [mid - Math.sqrt(disc), mid + Math.sqrt(disc)];

    const KON = {
      os:{defs:{d:sl(6, "a", "dĺžka AB", 2, 8), r:sl(4, "d", "polomer", 1, 7)}, build(P){
        const A = [0, 0], B = [P.d, 0], X = cc(A, P.r, B, P.r), ok = X.length === 2, th = ok ? deg(A, X[0]) : 40;
        return {n:ok ? 1 : 0,
          note:ok ? "Každý bod osi je rovnako ďaleko od $A$ aj od $B$." : "Kružnice sa nepretnú v dvoch bodoch: polomer musí byť väčší než polovica $|AB|$.",
          s:[["Daná je úsečka $AB$.", I.seg(A, B), I.pt(A, "A", [-1, -1]), I.pt(B, "B", [1, -1])],
            ["$k_1(A;\\ \\vd{r})$, kde $r > \\tfrac{1}{2}|AB|$", I.arc(A, P.r, -th - 14, th + 14)],
            ["$k_2(B;\\ \\vd{r})$ s tým istým polomerom; $k_1 \\cap k_2 = \\{P, Q\\}$", I.arc(B, P.r, 180 - th - 14, 180 + th + 14), ...(ok ? [I.pt(X[0], "P", [1, 1]), I.pt(X[1], "Q", [1, -1])] : [])],
            ["Priamka $PQ$ je os úsečky $AB$: je na ňu kolmá a prechádza jej stredom $S$.", ...(ok ? [res(I.line(X[0], X[1], .7)), I.right([P.d / 2, 0], B, X[0]), I.pt([P.d / 2, 0], "S", [-1, -1])] : [])]]};
      }},
      osuhla:{defs:{alfa:angle(70, "d", "α", 20, 160), r:sl(3, "a", "polomer", 1.5, 5)}, build(P){
        const V = [0, 0], X = [P.r, 0], Y = pol(V, P.r, P.alfa), Z = [X[0] + Y[0], X[1] + Y[1]], L = Math.max(P.r + 2, dist(V, Z) + 1);
        return {n:1, note:"Každý bod osi uhla je rovnako ďaleko od oboch ramien.",
          s:[["Daný je uhol $AVB$ veľkosti $\\vd{\\alpha}$.", I.ray(V, 0, L), I.ray(V, P.alfa, L), I.ang(V, X, Y, "α"), I.pt(V, "V", [-1, -1]), I.txt(pol(V, L + .3, 0), "A"), I.txt(pol(V, L + .3, P.alfa), "B")],
            ["$k(V;\\ \\va{r})$ pretne ramená v bodoch $X$, $Y$.", I.arc(V, P.r, -10, P.alfa + 10), I.pt(X, "X", [0, -1]), I.pt(Y, "Y", [-1, 1])],
            ["$k_1(X;\\ \\va{r})$ a $k_2(Y;\\ \\va{r})$ sa pretnú v bode $Z$.", I.mark(X, Z), I.mark(Y, Z), I.pt(Z, "Z", [1, 1])],
            ["Polpriamka $VZ$ je os uhla: delí ho na dva uhly $\\tfrac{\\alpha}{2} = " + texN(P.alfa / 2) + "^\\circ$.", res(I.ray(V, P.alfa / 2, L))]]};
      }},
      kolmica:{defs:{h:sl(2.5, "a", "vzdialenosť bodu P od priamky", 0, 4), r:sl(3.5, "d", "polomer", 1, 6)}, build(P){
        const Pt = [0, P.h], w2 = P.r * P.r - P.h * P.h, ok = w2 > 1e-9, w = Math.sqrt(Math.max(0, w2)), X = [-w, 0], Y = [w, 0];
        const R2 = P.h < .01 ? 1.5 * P.r : P.r, Q = [0, -Math.sqrt(Math.max(0, R2 * R2 - w2))], e = Math.max(w, 2) + 1.2;
        let aX = deg(Pt, X); if(aX > 0) aX -= 360;
        return {n:ok ? 1 : 0,
          note:ok ? "Body $P$ aj $Q$ sú rovnako ďaleko od $X$ a $Y$, ležia teda na osi úsečky $XY$." : "Kružnica priamku nepretne v dvoch bodoch: polomer musí byť väčší než vzdialenosť bodu od priamky.",
          s:[["Daná je priamka $p$ a bod $P$.", I.seg([-e, 0], [e, 0]), I.txt([e - .1, .35], "p"), I.pt(Pt, "P", [1, 1])],
            ["$k(P;\\ \\vd{r})$ pretne $p$ v bodoch $X$, $Y$.", ok ? I.arc(Pt, P.r, aX - 12, deg(Pt, Y) + 12) : I.arc(Pt, P.r, -150, -30), ...(ok ? [I.pt(X, "X", [-1, 1]), I.pt(Y, "Y", [1, 1])] : [])],
            [`$k_1(X;\\ ${R2 === P.r ? "r" : "r'"})$ a $k_2(Y;\\ ${R2 === P.r ? "r" : "r'"})$ sa pretnú v bode $Q$${R2 === P.r ? "" : " (polomer $r' > r$)"}.`, ...(ok ? [I.mark(X, Q), I.mark(Y, Q), I.pt(Q, "Q", [1, -1])] : [])],
            ["Priamka $PQ$ je kolmica na $p$.", ...(ok ? [res(I.line(P.h < .01 ? [0, 1.5] : Pt, Q, .7)), I.right([0, 0], Y, [0, 1])] : [])]]};
      }},
      rovnobezka:{defs:{h:sl(2.5, "a", "vzdialenosť bodu P od priamky", 1, 4)}, build(P){
        const A = [0, 0], Pt = [1.5, P.h], r = dist(A, Pt), B = [r, 0], C = [1.5 + r, P.h];
        return {n:1, note:"V kosoštvorci sú protiľahlé strany rovnobežné.",
          s:[["Daná je priamka $p$ a bod $P$ mimo nej.", I.seg([-1.2, 0], [r + 2.7, 0]), I.txt([r + 2.6, .35], "p"), I.pt(Pt, "P", [-1, 1])],
            ["Zvoľ bod $A \\in p$; $k_1(A;\\ |AP|)$ pretne $p$ v bode $B$.", I.seg(A, Pt), I.arc(A, r, -10, deg(A, Pt) + 10), I.pt(A, "A", [-1, -1]), I.pt(B, "B", [1, -1])],
            ["$k_2(P;\\ |AP|)$ a $k_3(B;\\ |AP|)$ sa pretnú v bode $C$.", I.mark(Pt, C), I.mark(B, C), I.pt(C, "C", [1, 1])],
            ["Priamka $PC$ je rovnobežná s $p$, lebo $APCB$ je kosoštvorec.", res(I.line(Pt, C, 1)), I.seg(B, C)]]};
      }},
      dotycnica:{defs:{r:sl(2.5, "a", "polomer kružnice", 1, 4), d:sl(6, "d", "vzdialenosť bodu M od stredu", 1, 8)}, build(P){
        const S = [0, 0], M = [P.d, 0], O = [P.d / 2, 0], T = cc(S, P.r, O, P.d / 2), n = T.length;
        return {n,
          note:n === 2 ? "Uhol $ST_1M$ je pravý (Tálesova veta), preto je $MT_1$ kolmá na polomer, teda dotyčnica." : n ? "Bod $M$ leží na kružnici: jediná dotyčnica, kolmá na polomer $SM$." : "Bod $M$ leží vnútri kružnice: dotyčnica neexistuje.",
          s:[["Daná je kružnica $k(S;\\ \\va{r})$ a bod $M$.", I.arc(S, P.r, 0, 360), I.pt(S, "S", [-1, -1]), I.pt(M, "M", [1, -1])],
            ["Stred $O$ úsečky $SM$.", I.seg(S, M), I.pt(O, "O", [0, -1])],
            ["Tálesova kružnica $\\tau(O;\\ |OS|)$ nad priemerom $SM$.", I.arc(O, P.d / 2, 0, 360)],
            ["$T_1, T_2 \\in k \\cap \\tau$; priamky $MT_1$, $MT_2$ sú dotyčnice.", ...(n === 2 ? T.flatMap((t, i) => [res(I.line(M, t, 1.3)), I.seg(S, t, {dash:true}), I.right(t, S, M), I.pt(t, "T_" + (i + 1), [-.4, i ? -1 : 1])])
              : n ? [res(I.seg([P.d, -2], [P.d, 2]))] : [])]]};
      }},
      sss:{defs:{a:sl(4, "a", null, 1, 8), b:sl(5, "b", null, 1, 8), c:sl(6, "c", null, 2, 8)}, build(P){
        const A = [0, 0], B = [P.c, 0], X = cc(A, P.b, B, P.a), ok = X.length === 2, C = X[0];
        return {n:ok ? 1 : 0,
          note:ok ? "Druhý priesečník kružníc dá trojuholník súmerný podľa $AB$, teda zhodný: úloha má jedno riešenie." : "Kružnice sa nepretnú v dvoch bodoch: neplatí trojuholníková nerovnosť (súčet dvoch strán musí byť väčší než tretia).",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$.", ...AB(P.c)],
            ["$k_1(A;\\ \\vb{b})$", ok ? I.arc(A, P.b, deg(A, C) - 20, deg(A, C) + 20) : I.arc(A, P.b, 0, 75)],
            ["$k_2(B;\\ \\va{a})$", ok ? I.arc(B, P.a, deg(B, C) - 20, deg(B, C) + 20) : I.arc(B, P.a, 105, 180)],
            ["$C \\in k_1 \\cap k_2$, trojuholník $ABC$.", ...(ok ? [...tri([C], P.c), I.txt([C[0] / 2 - .3, C[1] / 2 + .2], "b"), I.txt([(C[0] + P.c) / 2 + .3, C[1] / 2 + .2], "a")] : [])]]};
      }},
      sus:{defs:{c:sl(6, "c", null, 2, 8), b:sl(4, "b", null, 1, 8), alfa:angle(50, "d", "α")}, build(P){
        const A = [0, 0], C = pol(A, P.b, P.alfa);
        return {n:1, note:"Dve strany a uhol, ktorý zvierajú, určujú trojuholník vždy jednoznačne.",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$.", ...AB(P.c)],
            ["Uhol $\\vd{\\alpha}$ pri vrchole $A$: polpriamka $AX$.", I.ray(A, P.alfa, P.b + 1.3), I.ang(A, [1, 0], pol(A, 1, P.alfa), "α"), I.txt(pol(A, P.b + 1.6, P.alfa), "X")],
            ["$k(A;\\ \\vb{b})$ pretne polpriamku v bode $C$.", I.mark(A, C, 15), I.pt(C, "C", [-1, 1])],
            ["Trojuholník $ABC$.", ...tri([C], P.c)]]};
      }},
      usu:{defs:{c:sl(6, "c", null, 2, 8), alfa:angle(50, "d", "α", 20, 120), beta:angle(60, "b", "β", 20, 120)}, build(P){
        const A = [0, 0], B = [P.c, 0], ok = P.alfa + P.beta < 180, C = ok ? pol(A, P.c * Math.sin(P.beta * rad) / Math.sin((P.alfa + P.beta) * rad), P.alfa) : null;
        const L1 = ok ? Math.min(14, dist(A, C) + 1.2) : 6, L2 = ok ? Math.min(14, dist(B, C) + 1.2) : 6;
        return {n:ok ? 1 : 0, note:ok ? "Strana a dva priľahlé uhly určujú trojuholník jednoznačne." : "Polpriamky sa nepretnú: $\\alpha + \\beta$ musí byť menej než $180^\\circ$.",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$.", ...AB(P.c)],
            ["Polpriamka $AX$: uhol $\\vd{\\alpha}$ pri vrchole $A$.", I.ray(A, P.alfa, L1), I.ang(A, B, pol(A, 1, P.alfa), "α")],
            ["Polpriamka $BY$: uhol $\\vb{\\beta}$ pri vrchole $B$.", I.ray(B, 180 - P.beta, L2), I.ang(B, pol(B, 1, 180 - P.beta), A, "β")],
            ["$C \\in AX \\cap BY$, trojuholník $ABC$.", ...(ok ? tri([C], P.c) : [])]]};
      }},
      ssu:{defs:{c:sl(6, "c", null, 2, 8), a:sl(4, "a", "strana oproti uhlu α", 1, 8), alfa:angle(35, "d", "α", 20, 150)}, build(P){
        const A = [0, 0], B = [P.c, 0], mid = P.c * Math.cos(P.alfa * rad), disc = P.a * P.a - Math.pow(P.c * Math.sin(P.alfa * rad), 2);
        const ts = hits(mid, disc).filter(t => t > 1e-6), Cs = ts.map(t => pol(A, t, P.alfa)), n = Cs.length, F = pol(A, mid, P.alfa);
        const as = Cs.map(C => deg(B, C)), aF = deg(B, F);
        return {n,
          note:n === 2 ? "Dva priesečníky, dva rôzne trojuholníky: uhol leží oproti kratšej strane." : n === 0 ? "Kružnica polpriamku nepretne: strana $a$ je prikrátka, úloha nemá riešenie."
            : Math.abs(disc) < 1e-9 ? "Kružnica sa polpriamky dotýka: jediné riešenie, pravouhlý trojuholník." : "Jeden priesečník, jedno riešenie: uhol leží oproti dlhšej strane (veta Ssu).",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$.", ...AB(P.c)],
            ["Polpriamka $AX$: uhol $\\vd{\\alpha}$ pri vrchole $A$.", I.ray(A, P.alfa, Math.max(2, mid, ...ts) + 1.3), I.ang(A, B, pol(A, 1, P.alfa), "α")],
            ["$k(B;\\ \\va{a})$", n ? I.arc(B, P.a, Math.min(...as) - 18, Math.max(...as) + 18) : I.arc(B, P.a, aF - 40, aF + 40)],
            ["$C \\in AX \\cap k$" + (n === 2 ? ": trojuholníky $ABC_1$ a $ABC_2$." : n ? ", trojuholník $ABC$." : ": žiadny bod."), ...tri(Cs, P.c)]]};
      }},
      cvt:{defs:{c:sl(6, "c", null, 2, 8), v:sl(3, "d", "výška na stranu c", 1, 6), t:sl(3.5, "b", "ťažnica na stranu c", 1, 7)}, build(P){
        const S = [P.c / 2, 0], xs = hits(P.c / 2, P.t * P.t - P.v * P.v), Cs = xs.map(x => [x, P.v]), n = Cs.length;
        const x0 = Math.min(0, ...xs) - .9, x1 = Math.max(P.c, ...xs) + .9, as = Cs.map(C => deg(S, C));
        return {n,
          note:n === 2 ? "Dva priesečníky $C_1$, $C_2$: dve riešenia v jednej polrovine (trojuholníky sú navzájom súmerné, teda zhodné)." : n ? "Kružnica sa priamky dotýka: $t_c = v_c$, trojuholník je rovnoramenný." : "Kružnica priamku $q$ nedosiahne: ťažnica nemôže byť kratšia než výška.",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$ a jej stred $S$.", ...AB(P.c), I.pt(S, "S", [0, -1])],
            ["Priamka $q \\parallel AB$ vo vzdialenosti $\\vd{v_c}$: na nej leží $C$.", I.seg([x0, P.v], [x1, P.v]), I.seg([x0 + .3, 0], [x0 + .3, P.v], {dash:true}), I.txt([x1 - .1, P.v + .32], "q")],
            ["$k(S;\\ \\vb{t_c})$: aj na nej leží $C$.", n ? I.arc(S, P.t, Math.min(...as) - 18, Math.max(...as) + 18) : I.arc(S, P.t, 35, 145)],
            ["$C \\in q \\cap k$" + (n === 2 ? ": trojuholníky $ABC_1$ a $ABC_2$." : n ? ", trojuholník $ABC$." : ": žiadny bod."), ...tri(Cs, P.c), ...Cs.map(C => I.seg(S, C, {dash:true}))]]};
      }},
      cvg:{defs:{c:sl(6, "c", null, 2, 8), v:sl(3, "d", "výška na stranu c", 1, 7), gama:angle(60, "a", "γ", 30, 140)}, build(P){
        const A = [0, 0], B = [P.c, 0], O = [P.c / 2, P.c / (2 * Math.tan(P.gama * rad))], R = P.c / (2 * Math.sin(P.gama * rad));
        const xs = hits(P.c / 2, R * R - Math.pow(P.v - O[1], 2)), Cs = xs.map(x => [x, P.v]), n = Cs.length, aB = deg(O, B);
        let aA = deg(O, A); if(aA < aB) aA += 360;
        const x0 = Math.min(0, O[0] - R) - .5, x1 = Math.max(P.c, O[0] + R) + .5;
        return {n,
          note:n === 2 ? "Dva priesečníky: dve riešenia, navzájom súmerné podľa osi úsečky $AB$." : n ? "Priamka sa oblúka dotýka: jediné riešenie, rovnoramenný trojuholník." : "Priamka $q$ oblúk nepretne: výška je priveľká.",
          s:[["Úsečka $AB$ s dĺžkou $\\vc{c}$.", ...AB(P.c)],
            ["Oblúk $G$: body, z ktorých vidno $AB$ pod uhlom $\\va{\\gamma}$. Jeho stred $O$ leží na osi $AB$ a $|\\angle AOB| = 2\\gamma$.", I.arc(O, R, aB, aA), I.seg(O, A, {dash:true}), I.seg(O, B, {dash:true}), I.pt(O, "O", [1, P.gama < 90 ? -.3 : -1])],
            ["Priamka $q \\parallel AB$ vo vzdialenosti $\\vd{v_c}$.", I.seg([x0, P.v], [x1, P.v]), I.txt([x1 - .1, P.v + .32], "q")],
            ["$C \\in G \\cap q$" + (n === 2 ? ": trojuholníky $ABC_1$ a $ABC_2$." : n ? ", trojuholník $ABC$." : ": žiadny bod."), ...tri(Cs, P.c), ...(n ? [I.ang(Cs[0], A, B, "γ")] : [])]]};
      }}
    };
    const typ = KON[cfg.typ] ? cfg.typ : "os", kon = KON[typ], N = 4;
    const params = toolParams(Object.assign({}, kon.defs, {krok:{v:N, min:1, max:N, step:1, plain:true, note:"koľko krokov je nakreslených"}}), cfg, env);
    const W = 560, H = 340;

    return {
      params, aspect:`${W}/${H}`,
      actions:[
        {label:"◂ Krok späť", run(st){ st.P.krok = Math.max(1, st.P.krok - 1); toolCtlSync(st); }},
        {label:"Ďalší krok ▸", run(st){ st.P.krok = Math.min(N, st.P.krok + 1); toolCtlSync(st); }}
      ],
      actionsAlways:!params.krok.lock,
      svg(P, st){
        const b = kon.build(P), thumb = st.env.thumb, K = Math.round(P.krok);
        /* the frame holds every step, so the picture does not jump while stepping */
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        const see = p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); };
        b.s.forEach(s => s.slice(1).forEach(it => {
          if(it.k === "seg"){ see(it.a); see(it.b); }
          else if(it.k === "arc") for(let i = 0; i <= 8; i++) see(pol(it.o, it.r, it.a0 + (it.a1 - it.a0) * i / 8));
          else if(it.k === "poly") it.pts.forEach(see);
          else if(it.k === "pt" || it.k === "txt") see(it.p);
        }));
        const f = svFit(W, H, [x0, y0, x1, y1], thumb ? 14 : 26), mid = f.p([(x0 + x1) / 2, (y0 + y1) / 2]);
        let under = "", lines = "", over = "";
        b.s.slice(0, K).forEach((s, i) => {
          const now = i === K - 1 && i > 0, cls = i === 0 ? "" : now ? "cd" : "csoft w1";
          s.slice(1).forEach(it => {
            const c = it.res ? `${it.c || "ca"} w3` : cls;
            if(it.k === "seg") lines += SG.seg(f.p(it.a), f.p(it.b), `s ${c}${it.dash ? " dash w1" : ""}`);
            else if(it.k === "arc") lines += SV.path(SV.arc(f.X(it.o[0]), f.Y(it.o[1]), it.r * f.u, it.a0, it.a1), `s ${c}`);
            else if(it.k === "poly"){ under += SV.poly(it.pts.map(f.p), `bg ${it.c}`); lines += SV.poly(it.pts.map(f.p), `s ${it.c} w3`); }
            else if(it.k === "right") lines += SG.right(f.p(it.p), f.p(it.a), f.p(it.b));
            else if(it.k === "ang"){ const p = f.p(it.p), a = f.p(it.a), q = f.p(it.b), l = SG.inAngle(p, a, q, 34); lines += SG.angle(p, a, q, 22, `s w1 ${now ? "cd" : "csoft"}`) + (thumb ? "" : SV.text(l[0], l[1] + 4, it.s, "mid sm csoft")); }
            else if(it.k === "txt"){ if(!thumb){ const p = f.p(it.p); over += SV.text(p[0], p[1] + 4, it.s, "mid it csoft"); } }
            else if(it.k === "pt"){
              const p = f.p(it.p);
              over += SG.dot(p, `f ${now ? "cd" : "cink"}`, 3.6) + (thumb ? "" : SG.label(p, it.n, `halo ${now ? "cd" : ""}`, it.at ? [p[0] - it.at[0], p[1] + it.at[1]] : mid, 13));
            }
          });
        });
        return SV.wrap(W, H, under + lines + over);
      },
      out(P, h, st){
        const b = kon.build(P), K = Math.round(P.krok);
        h.kon = {n:b.n, N, krok:K, kroky:b.s.map(s => s[0])};
        if(cfg.out) return cfg.out(P, h, st);
        let o = `<ol class="kon-steps">${b.s.slice(0, K).map((s, i) => `<li${i === K - 1 ? ' class="now"' : ""}>${h.m(s[0])}</li>`).join("")}</ol>`;
        if(K === N) o += h.pill(b.n === 0 ? "žiadne riešenie" : b.n === 1 ? "1 riešenie" : `${b.n} riešenia`, b.n ? "ok" : "down") + h.p(b.note);
        return o;
      }
    };
  }
});

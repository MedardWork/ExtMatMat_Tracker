/* Kvadratická funkcia a vrchol paraboly */
(() => {
const ABC = (lock, v = {}) => ({
  a:{v:v.a != null ? v.a : 1, min:-3, max:3, step:.5, color:"a", lock:lock.includes("a")},
  b:{v:v.b != null ? v.b : 0, min:-6, max:6, step:.5, color:"b", lock:lock.includes("b")},
  c:{v:v.c != null ? v.c : 0, min:-6, max:6, step:.5, color:"d", lock:lock.includes("c")}
});
const D = P => P.b * P.b - 4 * P.a * P.c;
const xv = P => -P.b / (2 * P.a), yv = P => P.c - P.b * P.b / (4 * P.a);

THEORY.a22 = {
  mins:20,
  brief:[
    R`$y = \va{a}x^2 + \vb{b}x + \vd{c}$, $a \neq 0$. Graf je parabola: pre $\va{a} > 0$ otvorená nahor, pre $\va{a} < 0$ nadol.`,
    R`Os $y$ pretína v bode $[0;\ \vd{c}]$.`,
    R`Vrchol: $x_V = -\dfrac{b}{2a}$, $y_V = f(x_V)$. Vo vrcholovom tvare $y = a(x - m)^2 + n$ je vrchol $[m;\ n]$.`,
    R`Priesečníky s osou $x$: rieš $ax^2 + bx + c = 0$. Počet určí diskriminant $D = b^2 - 4ac$ (dva, jeden, žiadny).`,
    R`Najväčšia alebo najmenšia hodnota je vždy vo vrchole: $y_V$ pri $x = x_V$.`
  ],
  subs:{

"Graf — parabola a jej otvorenie":[
  "Kvadratická funkcia má v predpise $x$ v druhej mocnine a nič vyššie:",
  {def:"Predpis kvadratickej funkcie", tex:R`y = \va{a}x^2 + \vb{b}x + \vd{c}`, note:R`kde $a \neq 0$`, legend:[
    ["a", "a", "kvadratický koeficient", "Určuje, kam je parabola otvorená a aká je široká."],
    ["b", "b", "lineárny koeficient", "Spolu s $a$ určuje, kde leží vrchol."],
    ["c", "d", "absolútny člen", "Hodnota pre $x = 0$, teda priesečník s osou $y$."]
  ]},
  R`Jej grafom je krivka, ktorá sa volá **parabola**. Najjednoduchšia je $y = x^2$. Pre $x$ aj pre $-x$ dáva rovnakú hodnotu, preto je súmerná podľa osi $y$ a jej najnižší bod je v počiatku.`,
  R`Číslo $\va{a}$ túto základnú parabolu naťahuje, stláča alebo prevracia.`,
  {tool:"graf", ask:R`Meň $\va{a}$. Čo sa stane, keď prejde cez nulu? A čo keď je blízko nuly?`,
   take:R`pre $a > 0$ je parabola otvorená nahor, pre $a < 0$ nadol. Čím je $a$ ďalej od nuly, tým je užšia.`,
   cfg:{view:[-5, 7, 5, -7], tick:1,
     fns:["a*x^2+b*x+c", {f:"x^2", color:"axis", dash:true, thin:true, ghost:true}],
     params:ABC(["b", "c"], {a:2}),
     show:[{pt:[1, "a"], color:"a", label:"[1; {a}]", at:"r"}],
     out:(P, h) => h.big(P.a === 0 ? "y = 0" : h.eq(0))
       + (P.a > 0 ? h.pill("otvorená nahor", "up") : P.a < 0 ? h.pill("otvorená nadol", "down") : h.pill("to už nie je parabola", "flat"))
       + h.p(P.a === 0 ? "Pre $a = 0$ člen s $x^2$ zmizne a zostane priamka."
         : R`Pre $x = 1$ je $y = \va{${h.tn(P.a)}}$. Sivá čiarkovaná je $y = x^2$ na porovnanie.`)}},
  {cards:[
    {fig:{fns:["0.8x^2-2"], view:[-3, 3, 3, -3]}, t:R`$\va{a} > 0$`, d:"Otvorená nahor. Vrchol je najnižší bod, funkcia má **minimum**."},
    {fig:{fns:["-0.8x^2+2"], view:[-3, 3, 3, -3]}, t:R`$\va{a} < 0$`, d:"Otvorená nadol. Vrchol je najvyšší bod, funkcia má **maximum**."},
    {fig:{fns:["3x^2-2", "0.3x^2-2"], view:[-3, 3, 3, -3]}, t:R`veľkosť $\va{a}$`, d:"Ďaleko od nuly: úzka. Blízko nuly: široká."}
  ]},

  R`Číslo $\vd{c}$ funguje rovnako ako $q$ pri priamke. Keď dosadíš $x = 0$, zostane $y = \vd{c}$. Parabola preto pretína os $y$ v bode $[0;\ \vd{c}]$.`,
  {tool:"graf", ask:R`Posúvaj $\vd{c}$. Mení sa tvar paraboly?`,
   take:R`zmena $c$ posunie celú parabolu hore alebo dole. Tvar ani otvorenie sa nemení.`,
   cfg:{view:[-5, 7, 5, -7], tick:1, fns:["a*x^2+b*x+c"], params:ABC(["a", "b"], {b:-2, c:1}),
     show:[{pt:[0, "c"], color:"d", label:"[0; {c}]", at:"l"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Os $y$ pretína v bode $\vd{[0;\ ${h.tn(P.c)}]}$.`)}},

  R`Číslo $\vb{b}$ je najmenej priehľadné. Neposúva parabolu len do strán: jej vrchol pri zmene $\vb{b}$ putuje po oblúku. Tvar a priesečník s osou $y$ pritom zostávajú.`,
  {tool:"graf", ask:R`Meň $\vb{b}$ a sleduj vrchol. Čo zostáva na mieste?`,
   take:R`vrchol sa posúva do strany aj zvislo, ale bod $[0;\ c]$ sa nepohne. Kde presne vrchol leží, vypočítaš v ďalšej podtéme.`,
   cfg:{view:[-5, 7, 5, -7], tick:1, fns:["a*x^2+b*x+c", {f:"-a*x^2+c", color:"axis", dash:true, thin:true, ghost:true}],
     params:ABC(["a", "c"], {b:2, c:1}),
     show:[{pt:[0, "c"], color:"d", size:3.5}, {pt:["-b/(2a)", "c-b^2/(4a)"], color:"b", label:"V [{-b/(2a)}; {c-b^2/(4a)}]", at:"b"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Vrchol: $\vb{[${h.tn(xv(P))};\ ${h.tn(yv(P))}]}$`)}},

  {ex:R`Parabola je otvorená nadol a os $y$ pretína v bode $[0;\ 3]$. Ktorý predpis jej môže patriť?

**A)** $y = x^2 + 3$ &nbsp; **B)** $y = -2x^2 + x + 3$ &nbsp; **C)** $y = -x^2 - 3$`.replace(/&nbsp;/g, " "),
   steps:[
     [R`Otvorená nadol znamená $a < 0$. To vylučuje A.`, R`\text{A: } a = 1 > 0`],
     [R`Os $y$ pretína v bode $[0;\ c]$, takže $c = 3$. To vylučuje C.`, R`\text{C: } c = -3`],
     ["Zostáva B, ktoré spĺňa obe podmienky.", R`\text{B: } a = -2 < 0,\quad c = 3`]
   ],
   res:"Správne je **B**."},
  {warn:R`Ak $a = 0$, člen $x^2$ vypadne a funkcia je lineárna. Preto je v definícii podmienka $a \neq 0$.`}
],

"Vrchol paraboly":[
  R`Vrchol je bod, v ktorom parabola mení smer. Pri otvorení nahor je to jej najnižší bod, pri otvorení nadol najvyšší. Zvislá priamka cez vrchol je **os súmernosti** paraboly.`,
  {def:"Súradnice vrcholu", mid:true, tex:R`x_V = -\dfrac{\vb{b}}{2\va{a}}, \qquad y_V = f(x_V)`,
   note:R`Druhú súradnicu dostaneš dosadením $x_V$ do predpisu.`},
  {tool:"graf", ask:R`Meň $\va{a}$ a $\vb{b}$. Sleduj, ako sa vrchol a os súmernosti presúvajú podľa vzorca.`,
   take:R`os súmernosti má rovnicu $x = x_V$ a vždy prechádza vrcholom.`,
   cfg:{view:[-6, 7, 6, -7], tick:1, fns:["a*x^2+b*x+c"],
     params:Object.assign(ABC(["c"], {a:1, b:-4, c:1}), {a:{v:1, min:-3, max:3, step:.5, color:"a"}}),
     show:[{vline:"-b/(2a)", color:"soft"}, {pt:["-b/(2a)", "c-b^2/(4a)"], color:"c", label:"V", at:"tr", if:"a"}],
     out:(P, h) => P.a === 0 ? h.big(h.eq(0) || "y = c") + h.p("Pre $a = 0$ vrchol neexistuje, je to priamka.")
       : h.big(h.eq(0))
       + h.calc(R`x_V = -\dfrac{\vb{${h.tn(P.b)}}}{2 \cdot ${P.a < 0 ? `(\\va{${h.tn(P.a)}})` : `\\va{${h.tn(P.a)}}`}} = ${h.tn(xv(P))}`)
       + h.calc(R`y_V = f(${h.tn(xv(P))}) = ${h.tn(yv(P))}`)
       + h.p(R`Vrchol $\vc{V\,[${h.tn(xv(P))};\ ${h.tn(yv(P))}]}$`)}},

  {h:"Vrcholový tvar"},
  "Ten istý predpis sa dá zapísať aj tak, že vrchol z neho vidno na prvý pohľad:",
  {def:"Vrcholový tvar", tex:R`y = \va{a}(x - \vb{m})^2 + \vd{n}`, legend:[
    ["m", "b", "posun do strany", "Prvá súradnica vrcholu."],
    ["n", "d", "posun zvislo", "Druhá súradnica vrcholu."]
  ], note:R`Vrchol je $V\,[\vb{m};\ \vd{n}]$.`},
  {tool:"graf", ask:R`Posúvaj $\vb{m}$ a $\vd{n}$. Kam ide parabola, keď $m$ rastie?`,
   take:R`$m$ posúva parabolu doprava a doľava, $n$ hore a dole. Vrchol je vždy v bode $[m;\ n]$.`,
   cfg:{view:[-6, 7, 6, -5], tick:1, fns:["a*(x-m)^2+n", {f:"x^2", color:"axis", dash:true, thin:true, ghost:true}],
     params:{a:{v:1, min:-3, max:3, step:.5, color:"a", lock:true}, m:{v:2, min:-4, max:4, step:.5, color:"b"}, n:{v:1, min:-4, max:5, step:.5, color:"d"}},
     show:[{pt:["m", "n"], color:"c", label:"V [{m}; {n}]", at:"b"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Vrchol $[\vb{${h.tn(P.m)}};\ \vd{${h.tn(P.n)}}]$`)}},
  {warn:R`Pozor na znamienko pri $m$. V zátvorke je $x - m$, takže $y = (x - 2)^2$ má vrchol v $x = +2$ a $y = (x + 2)^2$ v $x = -2$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{m}$ a $\vd{n}$ tak, aby mala parabola vrchol v bode $[-1;\ 2]$.`,
   hint:R`Vrchol je $[m;\ n]$, takže $m = -1$ a $n = 2$. V predpise potom uvidíš $(x + 1)^2$.`,
   goal:P => P.m === -1 && P.n === 2,
   cfg:{view:[-6, 7, 6, -5], tick:1, fns:["a*(x-m)^2+n"],
     params:{a:{v:1, min:-3, max:3, step:.5, color:"a", lock:true}, m:{v:2, min:-4, max:4, step:.5, color:"b"}, n:{v:-1, min:-4, max:5, step:.5, color:"d"}},
     show:[{target:[-1, 2], fn:0, label:"[−1; 2]", at:"l"}, {pt:["m", "n"], color:"c", size:3.5}],
     out:(P, h) => h.big(h.eq(0)) + (P.m === -1 && P.n === 2 ? h.pill("✓ Vrchol je na mieste", "ok") : h.p(R`Vrchol je teraz v bode $[${h.tn(P.m)};\ ${h.tn(P.n)}]$.`))}},

  {ex:R`Urč vrchol paraboly $y = x^2 - 4x + 1$. Vyrieš to vzorcom aj doplnením na štvorec.`,
   steps:[
     [R`Vzorcom: $a = 1$, $b = -4$.`, R`x_V = -\dfrac{-4}{2 \cdot 1} = 2`],
     ["Druhú súradnicu dostaneš dosadením.", R`y_V = 2^2 - 4 \cdot 2 + 1 = -3`],
     [R`Doplnením na štvorec: k $x^2 - 4x$ chýba $+4$, tak ho pridaj a hneď odober.`, R`x^2 - 4x + 4 - 4 + 1 = (x - 2)^2 - 3`]
   ],
   res:R`Vrchol je $V\,[2;\ -3]$, oboma spôsobmi.`,
   fig:{tool:"graf", cfg:{view:[-3, 5, 7, -5], tick:1, fns:["a*x^2+b*x+c"], params:ABC(["a", "b", "c"], {a:1, b:-4, c:1}),
     show:[{vline:"-b/(2a)", color:"soft"}, {pt:["-b/(2a)", "c-b^2/(4a)"], color:"c", label:"V [{-b/(2a)}; {c-b^2/(4a)}]", at:"b"}],
     out:(P, h) => h.calc(h.eq(0)) + h.p(R`Vrchol $\vc{[${h.tn(xv(P))};\ ${h.tn(yv(P))}]}$`)}}}
],

"Priesečníky s osami":[
  R`S osou $y$ je to jednoduché: dosadíš $x = 0$ a vyjde bod $[0;\ \vd{c}]$. Každá parabola ho má práve jeden.`,
  R`S osou $x$ hľadáš body, kde je $y = 0$. To znamená vyriešiť kvadratickú rovnicu $ax^2 + bx + c = 0$. Koľko riešení má, povie diskriminant.`,
  {def:"Nulové body", mid:true, tex:R`D = \vb{b}^2 - 4\va{a}\vd{c}, \qquad x_{1,2} = \dfrac{-\vb{b} \pm \sqrt{D}}{2\va{a}}`},
  {tool:"graf", ask:R`Posúvaj $\vd{c}$ a sleduj diskriminant. Koľkokrát parabola pretne os $x$?`,
   take:R`znamienko diskriminantu určuje počet priesečníkov. Pri $D = 0$ sa parabola osi len dotkne vrcholom.`,
   cfg:{view:[-5, 7, 7, -5], tick:1, fns:["a*x^2+b*x+c"], params:ABC(["a", "b"], {a:1, b:-2, c:-3}),
     show:[{roots:0, color:"c"}, {pt:[0, "c"], color:"d", size:3.5}],
     out:(P, h) => {
       const d = D(P);
       let s = h.big(h.eq(0)) + h.calc(R`D = (\vb{${h.tn(P.b)}})^2 - 4 \cdot \va{${h.tn(P.a)}} \cdot ${P.c < 0 ? `(\\vd{${h.tn(P.c)}})` : `\\vd{${h.tn(P.c)}}`} = ${h.tn(d)}`);
       if(d > 0) return s + h.pill("D > 0 · dva priesečníky", "up") + h.p(R`$x_1 = ${h.tn((-P.b - Math.sqrt(d)) / (2 * P.a))}$, $x_2 = ${h.tn((-P.b + Math.sqrt(d)) / (2 * P.a))}$`);
       if(d === 0) return s + h.pill("D = 0 · jeden (dotyk)", "flat") + h.p(R`$x = ${h.tn(-P.b / (2 * P.a))}$, je to zároveň vrchol.`);
       return s + h.pill("D < 0 · žiadny priesečník", "down") + h.p("Rovnica nemá reálne riešenie.");
     }}},
  {cards:[
    {fig:{fns:["x^2-2"], view:[-3, 3, 3, -3]}, t:"$D > 0$", d:"Dva nulové body $x_1$, $x_2$."},
    {fig:{fns:["x^2"], view:[-3, 4, 3, -2]}, t:"$D = 0$", d:"Jeden nulový bod, parabola sa osi dotýka vrcholom."},
    {fig:{fns:["x^2+1.2"], view:[-3, 5, 3, -1]}, t:"$D < 0$", d:"Žiadny nulový bod, parabola os $x$ nepretne."}
  ]},

  {h:"Súčinový tvar"},
  "Ak nulové body poznáš, vieš predpis zapísať ako súčin. Naopak, z takého zápisu ich prečítaš bez počítania.",
  {def:"Súčinový tvar", mid:true, tex:R`y = \va{a}(x - \vb{x_1})(x - \vd{x_2})`},
  {tool:"graf", ask:R`Posúvaj nulové body $\vb{x_1}$ a $\vd{x_2}$. Kde vzhľadom na ne leží vrchol?`,
   take:R`vrchol leží presne v strede medzi nulovými bodmi: $x_V = \dfrac{x_1 + x_2}{2}$.`,
   cfg:{view:[-6, 6, 6, -8], tick:1, fns:["a*(x-x1)*(x-x2)"],
     params:{a:{v:1, min:-2, max:2, step:.5, color:"a", lock:true}, x1:{v:-1, min:-5, max:5, step:.5, color:"b", name:"x₁"}, x2:{v:3, min:-5, max:5, step:.5, color:"d", name:"x₂"}},
     show:[{vline:"(x1+x2)/2", color:"soft"}, {pt:["x1", 0], color:"b"}, {pt:["x2", 0], color:"d"},
           {pt:["(x1+x2)/2", "-a*(x1-x2)^2/4"], color:"c", label:"V", at:"b"}],
     out:(P, h) => h.big(h.eq(0)) + h.calc(R`x_V = \dfrac{\vb{${h.tn(P.x1)}} + ${P.x2 < 0 ? `(\\vd{${h.tn(P.x2)}})` : `\\vd{${h.tn(P.x2)}}`}}{2} = ${h.tn((P.x1 + P.x2) / 2)}`)
       + (P.x1 === P.x2 ? h.p("Nulové body splynuli: parabola sa osi dotýka.") : "")}},

  {ex:R`Nájdi priesečníky paraboly $y = x^2 - 2x - 3$ s oboma osami a jej vrchol.`,
   steps:[
     [R`Os $y$: dosaď $x = 0$.`, R`[0;\ -3]`],
     ["Os $x$: diskriminant.", R`D = (-2)^2 - 4 \cdot 1 \cdot (-3) = 4 + 12 = 16`],
     ["Nulové body.", R`x_{1,2} = \dfrac{2 \pm 4}{2} \;\Rightarrow\; x_1 = -1,\ x_2 = 3`],
     ["Vrchol leží v strede medzi nimi.", R`x_V = \dfrac{-1 + 3}{2} = 1,\qquad y_V = 1 - 2 - 3 = -4`]
   ],
   res:R`Os $y$: $[0;\ -3]$. Os $x$: $[-1;\ 0]$ a $[3;\ 0]$. Vrchol $V\,[1;\ -4]$.`,
   fig:{tool:"graf", cfg:{view:[-4, 4, 6, -6], tick:1, fns:["a*x^2+b*x+c"], params:ABC(["a", "b", "c"], {a:1, b:-2, c:-3}),
     show:[{roots:0, color:"c", at:"t"}, {pt:[0, "c"], color:"d"}, {pt:["-b/(2a)", "c-b^2/(4a)"], color:"a", label:"V", at:"b"}],
     out:(P, h) => h.calc(h.eq(0)) + h.p(R`$D = ${h.tn(D(P))}$`)}}},
  {tip:R`Nulové body sa často dajú uhádnuť rozkladom: $x^2 - 2x - 3 = (x + 1)(x - 3)$. Hľadáš dve čísla so súčinom $c$ a súčtom $-b$.`}
],

"Najväčšia / najmenšia hodnota v slovných úlohách":[
  R`Kvadratická funkcia má najväčšiu alebo najmenšiu hodnotu vždy vo vrchole. Pre $a > 0$ je $y_V$ minimum, pre $a < 0$ maximum.`,
  "Keď sa úloha pýta na „najväčší obsah“, „najvyšší bod“ alebo „najnižšie náklady“ a veličina závisí od neznámej kvadraticky, hľadáš vrchol.",
  {steps:[
    {t:"Zapíš funkciu", d:"Označ neznámu $x$ a vyjadri pomocou nej veličinu, ktorú máš maximalizovať."},
    {t:"Uprav na $ax^2 + bx + c$", d:"Roznásob zátvorky a zoraď členy."},
    {t:"Nájdi vrchol", tex:R`x_V = -\dfrac{b}{2a}`},
    {t:"Odpovedz na otázku", d:"Niekedy chce úloha $x_V$ (pri akej hodnote), inokedy $y_V$ (aká je najväčšia hodnota)."}
  ]},
  {ex:"Z 20 m pletiva chceš ohradiť obdĺžnikový záhon. Aké rozmery má mať, aby bol jeho obsah čo najväčší?",
   steps:[
     [R`Označ šírku $x$. Obvod je 20, takže dĺžka je $10 - x$.`, R`S(x) = x(10 - x)`],
     ["Roznásob.", R`S(x) = -x^2 + 10x`],
     [R`$a = -1 < 0$, funkcia má maximum vo vrchole.`, R`x_V = -\dfrac{10}{2 \cdot (-1)} = 5`],
     ["Dĺžka a obsah.", R`10 - 5 = 5,\qquad S(5) = 25`]
   ],
   res:R`Štvorec $5 \times 5$ m s obsahom $25\ \text{m}^2$.`},
  {tool:"graf", kind:"uloha", ask:"Nájdi šírku záhona, pri ktorej je obsah najväčší.",
   hint:"Najväčší obsah je vo vrchole paraboly. Posúvaj bod, kým nie je úplne hore.",
   goal:P => P.s === 5,
   cfg:{view:[-1.4, 30, 11, -4], tick:5, free:true, axes:["šírka", "obsah"], aspect:"4/3",
     fns:[{f:"-x^2+10x", dom:[0, 10], lhs:"S(x)"}],
     params:{s:{v:2, min:0, max:10, step:.5, color:"a", name:"x", note:"šírka v m"}},
     show:[{drop:["s", "-s^2+10s"], color:"a"}, {pt:["s", "-s^2+10s"], color:"a", size:5.5}],
     out:(P, h) => h.p(R`Šírka $\va{${h.tn(P.s)}}$ m, dĺžka $${h.tn(10 - P.s)}$ m`)
       + h.calc(R`S = \va{${h.tn(P.s)}} \cdot ${h.tn(10 - P.s)} = ${h.tn(P.s * (10 - P.s))}\ \text{m}^2`)
       + (P.s === 5 ? h.pill("✓ Najväčší možný obsah", "ok") : "")}},

  {ex:R`Lopta vyhodená nahor má po $t$ sekundách výšku $h(t) = -5t^2 + 20t + 1$ metrov. Kedy je najvyššie a ako vysoko?`,
   steps:[
     [R`$a = -5 < 0$, najväčšia výška je vo vrchole.`, R`t_V = -\dfrac{20}{2 \cdot (-5)} = 2`],
     ["Výšku dostaneš dosadením.", R`h(2) = -5 \cdot 4 + 20 \cdot 2 + 1 = 21`]
   ],
   res:"Najvyššie je po **2 sekundách**, vo výške **21 m**.",
   fig:{tool:"graf", cfg:{view:[-.7, 25, 4.8, -4], tick:5, free:true, axes:["t", "h"], aspect:"4/3",
     fns:[{f:"-5x^2+20x+1", dom:[0, 4.05], lhs:"h(t)"}],
     show:[{drop:[2, 21], color:"a"}, {pt:[2, 21], color:"a", label:"[2; 21]", at:"t"}, {pt:[0, 1], color:"d", size:3.5}],
     out:(P, h) => h.calc(R`h(t) = -5t^2 + 20t + 1`) + h.p("Loptu vyhodili z výšky 1 m (hodnota pre $t = 0$).")}}},
  {warn:R`Prečítaj si, na čo sa úloha pýta. „Kedy“ alebo „pri akom rozmere“ je $x_V$. „Aká najväčšia“ alebo „ako vysoko“ je $y_V$.`},
  {tip:R`Ak vrchol vyjde mimo hodnôt, ktoré v úlohe dávajú zmysel (napríklad záporná dĺžka), najväčšia hodnota je na kraji povoleného rozsahu.`}
]

  }
};
})();

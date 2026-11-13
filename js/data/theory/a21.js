/* Lineárna funkcia a smernica */
THEORY.a21 = {
  mins:15,
  brief:[
    R`$y = \va{k}x + \vb{q}$, kde $\vb{q}$ je priesečník s osou $y$ a $\va{k}$ je zmena $y$ pri zmene $x$ o 1.`,
    R`$\va{k} > 0$ rastie, $\va{k} < 0$ klesá, $\va{k} = 0$ je konštantná.`,
    R`Graf je priamka. Priesečníky s osami: $[0;\ \vb{q}]$ a $\left[-\frac{\vb{q}}{\va{k}};\ 0\right]$.`,
    R`Z dvoch bodov: najprv $\va{k} = \frac{y_2 - y_1}{x_2 - x_1}$, potom $\vb{q}$ dosadením jedného bodu.`,
    R`V slovnej úlohe je $\vb{q}$ začiatočná hodnota a $\va{k}$ zmena na jednotku.`
  ],
  subs:{

"Smernica k a posun q":[
  "Lineárna funkcia je každá funkcia, ktorej predpis sa dá zapísať takto:",
  {def:"Predpis lineárnej funkcie", tex:R`y = \va{k}x + \vb{q}`, legend:[
    ["k", "a", "smernica", "Určuje sklon priamky: o koľko sa zmení $y$, keď $x$ vzrastie o 1."],
    ["q", "b", "posun", "Určuje výšku priamky: hodnota funkcie pre $x = 0$."]
  ]},
  R`Začnime číslom $\vb{q}$. Keď dosadíš $x = 0$, zo vzorca zostane $y = \vb{q}$. Graf preto pretína os $y$ vo výške $\vb{q}$, v bode $[0;\ \vb{q}]$.`,
  {tool:"graf", ask:R`Posúvaj $\vb{q}$. Sklon priamky je zamknutý, mení sa len jej výška.`,
   take:R`zmena $q$ posunie celú priamku hore alebo dole. Sklon ostáva rovnaký.`,
   cfg:{view:[-6, 6, 6, -6], tick:2,
     fns:["k*x+q", {f:"k*x", color:"axis", dash:true, thin:true, ghost:true}],
     params:{k:{v:1, min:-3, max:3, step:.5, lock:true, color:"a", note:"smernica"}, q:{v:2, min:-4, max:4, step:.5, color:"b", note:"posun"}},
     show:[{seg:[[0, 0], [0, "q"]], color:"b", w:4}, {pt:[0, "q"], color:"b", label:"[0; {q}]", at:"tl"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Os $y$ pretína v bode $\vb{[0;\ ${h.tn(P.q)}]}$.`)}},

  R`Číslo $\va{k}$ je smernica. Hovorí, o koľko sa zmení $y$, keď $x$ vzrastie o 1. Na grafe to vidíš ako schodík: jeden krok doprava a $\va{k}$ krokov nahor. Pri zápornom $\va{k}$ ide schodík nadol.`,
  {tool:"graf", ask:R`Meň $\va{k}$ a sleduj schodík. Čo sa stane, keď $k$ prejde cez nulu?`,
   take:R`priamka sa otáča okolo bodu $[0;\ 1]$. Znamienko $k$ rozhoduje, či funkcia rastie alebo klesá.`,
   cfg:{view:[-4, 5, 4, -3], tick:1, fns:["k*x+q"],
     params:{k:{v:2, min:-3, max:3, step:.5, color:"a", note:"smernica"}, q:{v:1, min:-2, max:3, step:.5, lock:true, color:"b", note:"posun"}},
     show:[{step:0, at:0, color:"a", label:"k = {k}"}, {pt:[0, "q"], color:"b", size:3.5}],
     out:(P, h) => h.big(h.eq(0))
       + (P.k > 0 ? h.pill("rastie", "up") : P.k < 0 ? h.pill("klesá", "down") : h.pill("konštantná", "flat"))
       + h.p(P.k === 0 ? "1 krok doprava, výška sa nemení." : R`1 krok doprava, $\va{${h.tn(Math.abs(P.k))}}$ ${P.k > 0 ? "nahor" : "nadol"}.`)}},
  {cards:[
    {fig:{fns:["0.6x"], view:[-4, 3, 4, -3]}, t:R`$\va{k} > 0$ · rastie`, d:"Väčšie $x$ dá väčšie $y$."},
    {fig:{fns:["1.2"], view:[-4, 3, 4, -3]}, t:R`$\va{k} = 0$ · konštantná`, d:"Vodorovná priamka $y = q$."},
    {fig:{fns:["-0.6x"], view:[-4, 3, 4, -3]}, t:R`$\va{k} < 0$ · klesá`, d:"Väčšie $x$ dá menšie $y$."}
  ]},

  "Smernicu vieš vypočítať z ľubovoľných dvoch bodov grafu: zmena $y$ delená zmenou $x$.",
  {def:"Smernica z dvoch bodov", mid:true, tex:R`\va{k} = \dfrac{y_2 - y_1}{x_2 - x_1}`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{k}$ tak, aby priamka prešla bodom $A\,[2;\ 5]$.`,
   hint:R`Z bodu $[0;\ 1]$ do bodu $A$ je to 2 kroky doprava a 4 nahor. Smernica je teda $4 : 2$.`,
   goal:P => Math.abs(2 * P.k + P.q - 5) < 1e-9,
   cfg:{view:[-4, 7, 6, -3], tick:1, fns:["k*x+q"],
     params:{k:{v:-1, min:-2, max:4, step:.5, color:"a", note:"smernica"}, q:{v:1, min:-2, max:3, step:.5, lock:true, color:"b", note:"posun"}},
     show:[{pt:[0, "q"], color:"b", size:3.5}, {target:[2, 5], fn:0, label:"A [2; 5]"}],
     out:(P, h) => h.big(h.eq(0)) + (Math.abs(2 * P.k + P.q - 5) < 1e-9
       ? h.pill("✓ Prechádza bodom A", "ok") + h.calc(R`\va{k} = \dfrac{5 - 1}{2 - 0} = 2`)
       : h.p(R`Pre $x = 2$ vychádza $y = ${h.tn(2 * P.k + P.q)}$. Treba $5$.`))}},

  {ex:R`Daná je funkcia $f(x) = -2x + 5$. Urč $f(3)$ a zisti, pre ktoré $x$ je $f(x) = 0$.`,
   steps:[
     [R`Hodnotu $f(3)$ dostaneš dosadením $x = 3$.`, R`f(3) = -2 \cdot 3 + 5 = -1`],
     [R`Pre $f(x) = 0$ polož predpis rovný nule a vyrieš rovnicu.`, R`-2x + 5 = 0 \;\Rightarrow\; x = 2{,}5`]
   ],
   res:R`$f(3) = -1$ a nulová hodnota je v $x = 2{,}5$.`},
  {warn:R`Strmosť určuje veľkosť čísla $k$ bez znamienka. Priamka s $k = -3$ je strmšia ako priamka s $k = 2$, len klesá.`},
  {tip:R`Ak $q = 0$, dostaneš priamu úmernosť $y = kx$. Jej graf vždy prechádza počiatkom $[0;\ 0]$.`, label:"Súvislosť"}
],

"Graf lineárnej funkcie":[
  "Grafom lineárnej funkcie je priamka. Na jej narysovanie preto stačia dva body. Najľahšie sa hľadajú tie, v ktorých priamka pretína osi.",
  {cards:[
    {t:R`Priesečník s osou $y$`, d:"Dosaď $x = 0$.", tex:R`[0;\ \vb{q}]`},
    {t:R`Priesečník s osou $x$`, d:"Vyrieš rovnicu $kx + q = 0$.", tex:R`\left[-\dfrac{\vb{q}}{\va{k}};\ 0\right]`}
  ]},
  {tool:"graf", ask:R`Meň $\va{k}$ aj $\vb{q}$ a sleduj oba priesečníky. Kedy priesečník s osou $x$ zmizne?`,
   take:R`pri $k = 0$ je priamka vodorovná a os $x$ nepretne. Výnimkou je $q = 0$, vtedy leží celá na osi $x$.`,
   cfg:{view:[-6, 6, 6, -6], tick:2, fns:["k*x+q"],
     params:{k:{v:-1, min:-3, max:3, step:.5, color:"a", note:"smernica"}, q:{v:3, min:-4, max:4, step:1, color:"b", note:"posun"}},
     show:[{pt:["-q/k", 0], color:"c", if:"k", label:"[{-q/k}; 0]", at:"b"}, {pt:[0, "q"], color:"b", label:"[0; {q}]", at:"tr"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Os $y$: $\vb{[0;\ ${h.tn(P.q)}]}$`)
       + (P.k === 0 ? h.p(P.q === 0 ? "Priamka leží celá na osi $x$." : "Vodorovná priamka, os $x$ nepretína.")
         : h.p(R`Os $x$: $\vc{[${h.tn(-P.q / P.k)};\ 0]}$`) + h.calc(R`x = -\dfrac{\vb{${h.tn(P.q)}}}{\va{${h.tn(P.k)}}} = ${h.tn(-P.q / P.k)}`))}},

  {ex:R`Graf funkcie $y = 2x - 4$ spolu s osami ohraničuje trojuholník. Aký má obsah?`,
   steps:[
     [R`Priesečník s osou $y$: dosaď $x = 0$.`, R`[0;\ -4]`],
     [R`Priesečník s osou $x$: vyrieš rovnicu.`, R`2x - 4 = 0 \;\Rightarrow\; x = 2,\ \text{bod } [2;\ 0]`],
     ["Trojuholník je pravouhlý s odvesnami 2 a 4.", R`S = \tfrac{1}{2} \cdot 2 \cdot 4 = 4`]
   ],
   res:"Obsah trojuholníka je $4$.",
   fig:{tool:"graf", cfg:{view:[-4, 3, 6, -7], tick:2, fns:["k*x+q"],
     params:{k:{v:2, min:.5, max:4, step:.5, lock:true, color:"a", note:"smernica"}, q:{v:-4, min:-6, max:-1, step:1, lock:true, color:"b", note:"posun"}},
     show:[{poly:[[0, 0], ["-q/k", 0], [0, "q"]], color:"c"},
       {seg:[[0, 0], ["-q/k", 0]], color:"c", w:4}, {seg:[[0, 0], [0, "q"]], color:"b", w:4},
       {pt:["-q/k", 0], color:"c"}, {pt:[0, "q"], color:"b"},
       {text:["-q/(2k)", 0], s:"{-q/k}", color:"c", at:"t"}, {text:[0, "q/2"], s:"{-q}", color:"b", at:"l"}],
     out:(P, h) => h.calc(h.eq(0)) + h.calc(R`S = \tfrac{1}{2} \cdot \vc{${h.tn(-P.q / P.k)}} \cdot \vb{${h.tn(-P.q)}} = ${h.tn(P.q * P.q / P.k / 2)}`)}}},

  {h:"Rovnobežné grafy"},
  "Sklon priamky určuje len smernica. Dve lineárne funkcie s rovnakou smernicou majú preto rovnobežné grafy, nech je ich posun akýkoľvek.",
  {tool:"graf", ask:R`Meň smernicu modrej priamky $\vc{k_2}$. Pri akej hodnote priesečník zmizne?`,
   take:R`pri $k_2 = 1$ majú obe priamky rovnaký sklon. Sú rovnobežné a nepretnú sa.`,
   cfg:{view:[-6, 7, 6, -5], tick:2,
     fns:[{f:"k1*x+q1", lhs:"y"}, {f:"k2*x+q2", color:"c", lhs:"y"}],
     params:{k1:{v:1, min:-2, max:3, step:.5, lock:true, name:"k₁", note:"prvá priamka"}, q1:{v:2, min:-3, max:4, step:1, lock:true, name:"q₁", note:"prvá priamka"},
             k2:{v:3, min:-2, max:3, step:.5, color:"c", name:"k₂", note:"modrá priamka"}, q2:{v:-2, min:-4, max:3, step:1, lock:true, color:"c", name:"q₂", note:"modrá priamka"}},
     show:[{meet:[0, 1], label:false}],
     out:(P, h) => {
       let s = h.calc(h.eq(0)) + h.calc(h.eq(1));
       if(P.k1 === P.k2) return s + (P.q1 === P.q2 ? h.p("Priamky splývajú.") : h.pill("rovnobežné", "flat") + h.p("Rovnaká smernica, žiadny priesečník."));
       const x = (P.q2 - P.q1) / (P.k1 - P.k2), y = P.k1 * x + P.q1;
       return s + h.p(R`Priesečník: $[${h.tn(x)};\ ${h.tn(y)}]$${x < -6 || x > 6 || y < -5 || y > 7 ? " (mimo obrázka)" : ""}`);
     }}},
  {warn:R`Zvislá priamka, napríklad $x = 3$, nie je grafom žiadnej funkcie. Jednému $x$ by priradila nekonečne veľa hodnôt $y$.`}
],

"Funkcia z dvoch bodov":[
  "Dvoma rôznymi bodmi prechádza práve jedna priamka. Dva body grafu preto stačia na to, aby si určil $k$ aj $q$.",
  {steps:[
    {t:"Vypočítaj smernicu", tex:R`\va{k} = \dfrac{y_2 - y_1}{x_2 - x_1}`},
    {t:"Dopočítaj $q$", d:"Dosaď jeden z bodov do $y = kx + q$."},
    {t:"Urob skúšku", d:"Druhý bod musí predpisu tiež vyhovovať."}
  ]},
  {tool:"graf", ask:"Ťahaj body $A$ a $B$. Celý výpočet vpravo sa prepočíta.",
   take:R`zvislá strana trojuholníka je $\Delta y$, vodorovná $\Delta x$. Ich podiel je smernica.`,
   cfg:{view:[-4, 10, 10, -4], tick:2, points:{A:[1, 2], B:[3, 8]},
     fns:["Ay + (By-Ay)/(Bx-Ax)*(x-Ax)"],
     show:[{seg:[["Ax", "Ay"], ["Bx", "Ay"]], color:"soft", dash:true, w:2.4}, {seg:[["Bx", "Ay"], ["Bx", "By"]], color:"a", w:4},
       {text:["(Ax+Bx)/2", "Ay"], s:"Δx = {Bx-Ax}", color:"soft", at:"b", if:"Bx-Ax"},
       {text:["Bx", "(Ay+By)/2"], s:"Δy = {By-Ay}", color:"a", at:"r", if:"By-Ay"}],
     out:(P, h) => {
       const x1 = P.Ax, y1 = P.Ay, x2 = P.Bx, y2 = P.By, n = v => v < 0 ? `(${h.tn(v)})` : h.tn(v);
       const head = h.p(R`$A\,[${h.tn(x1)};\ ${h.tn(y1)}]$, $B\,[${h.tn(x2)};\ ${h.tn(y2)}]$`);
       if(x1 === x2 && y1 === y2) return head + h.p("Body splynuli. Jeden bod priamku neurčí.");
       if(x1 === x2) return head + h.pill("nie je funkcia", "down") + h.p(R`Body sú nad sebou, $\Delta x = 0$. Zvislá priamka nie je grafom funkcie.`);
       const k = (y2 - y1) / (x2 - x1), q = y1 - k * x1;
       return head + h.calc(R`\va{k} = \dfrac{${h.tn(y2)} - ${n(y1)}}{${h.tn(x2)} - ${n(x1)}} = \va{${h.tn(k)}}`)
         + h.calc(R`\vb{q} = ${h.tn(y1)} - ${n(round2(k))} \cdot ${n(x1)} = \vb{${h.tn(q)}}`)
         + h.big(`y = ${exprShow("k*x+q", {k:round2(k), q:round2(q)}, {k:"a", q:"b"})}`);
     }}},
  {ex:R`Nájdi lineárnu funkciu, ktorej graf prechádza bodmi $[1;\ 2]$ a $[3;\ 8]$. Sú to body, s ktorými ukážka vyššie začína.`,
   steps:[
     ["Smernica z dvoch bodov.", R`\va{k} = \dfrac{8 - 2}{3 - 1} = \dfrac{6}{2} = 3`],
     [R`Dosaď bod $[1;\ 2]$ do $y = 3x + q$.`, R`2 = 3 \cdot 1 + \vb{q} \;\Rightarrow\; \vb{q} = -1`],
     [R`Skúška bodom $[3;\ 8]$.`, R`3 \cdot 3 - 1 = 8 \ \checkmark`]
   ],
   res:"$y = 3x - 1$"},
  {warn:R`V čitateli aj v menovateli odčítavaj v rovnakom poradí. Ak hore počítaš $y_2 - y_1$ a dole $x_1 - x_2$, vyjde smernica s opačným znamienkom.`}
],

"Lineárne modely v slovných úlohách":[
  "Lineárny model spoznáš podľa jednej vlastnosti: veličina sa za každý rovnaký krok zmení o rovnakú hodnotu. Potom stačí zo zadania vyčítať dve čísla.",
  {map:[
    ["„Nástupné sú 2 €.“", "začiatočná hodnota, pevný poplatok", R`\vb{q} = 2`],
    ["„Každý kilometer stojí 0,80 €.“", "zmena na jednotku", R`\va{k} = 0{,}8`]
   ], sum:["Cena $y$ za jazdu dlhú $x$ km", R`y = \va{0{,}8}x + \vb{2}`]},
  {tip:"Ak veličina ubúda (horiaca sviečka, vypúšťaná nádrž), smernica je záporná."},
  {ex:"Taxi A účtuje nástupné 2 € a 0,80 € za kilometer. Taxi B účtuje nástupné 5 € a 0,50 € za kilometer. Od akej vzdialenosti sa oplatí taxi B?",
   steps:[
     ["Zapíš obe ceny ako funkcie vzdialenosti $x$.", R`A(x) = 0{,}8x + 2,\qquad \vc{B}(x) = 0{,}5x + 5`],
     ["Zisti, kedy stoja rovnako.", R`0{,}8x + 2 = 0{,}5x + 5 \;\Rightarrow\; 0{,}3x = 3 \;\Rightarrow\; x = 10`],
     ["B má menšiu smernicu, takže za týmto bodom rastie pomalšie.", R`A(10) = \vc{B}(10) = 10\ \text{€}`]
   ],
   res:"Taxi B sa oplatí pri jazdách dlhších ako 10 km."},
  (() => {
    const meet = P => { if(P.ka === P.kb) return NaN; const x = (P.qb - P.qa) / (P.ka - P.kb); return x > 0 && x <= 20 ? round2(x) : NaN; };
    return {tool:"graf", ask:"Zmeň cenu za kilometer v taxi B. Kam sa posunie bod, od ktorého sa B oplatí?",
     take:"priesečník grafov je riešením rovnice $A(x) = B(x)$. Takto sa dá graficky skontrolovať každá lineárna rovnica.",
     cfg:{view:[-2.6, 22, 21, -3.2], tick:5, free:true, axes:["km", "€"], aspect:"4/3",
       fns:[{f:"ka*x+qa", dom:[0, 20], name:"A", label:"A", labelAt:19.4, labelSide:"tl"}, {f:"kb*x+qb", color:"c", dom:[0, 20], name:"B", label:"B", labelAt:19.4, labelSide:"br"}],
       params:{qa:{v:2, min:0, max:8, step:.5, lock:true, name:"A", note:"nástupné €", plain:true}, ka:{v:.8, min:.2, max:1.2, step:.1, lock:true, name:"A", note:"€ za km", plain:true},
               qb:{v:5, min:0, max:8, step:.5, lock:true, color:"c", name:"B", note:"nástupné €", plain:true}, kb:{v:.5, min:.2, max:1.2, step:.1, color:"c", name:"B", note:"€ za km", plain:true}},
       show:[{drop:[meet, P => P.ka * meet(P) + P.qa], color:"ok"}, {pt:[meet, P => P.ka * meet(P) + P.qa], color:"ok", size:5}],
       out:(P, h) => {
         const m = meet(P), s = h.calc(h.eq(0)) + h.calc(h.eq(1));
         if(isNaN(m)) return s + h.p(`Do 20 km sa grafy nepretnú. Lacnejšie je vždy taxi **${P.kb * 10 + P.qb < P.ka * 10 + P.qa ? "B" : "A"}**.`);
         return s + h.p(`Rovnaká cena pri **${h.n(m, 1)} km** (${h.n(P.ka * m + P.qa)} €).`) + h.pill(`Od ${h.n(m, 1)} km sa oplatí ${P.kb < P.ka ? "B" : "A"}`, "ok");
       }}};
  })()
]

  }
};

/* Sínusová a kosínusová veta, obsah S = ½ · a · b · sin γ */
/* TOOL-TODO: no tool of its own, written with borrowed tools: law of sines / cosines on a general triangle (trojuholnik, triangle built in graf); subtopic without any tool: "Kedy ktorú vetu použiť". Rework when the tool exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const rad = d => d * Math.PI / 180;
const cLen = P => Math.sqrt(P.a * P.a + P.b * P.b - 2 * P.a * P.b * Math.cos(rad(P.g)));
/* triangle with C at the origin, CB = a on the x axis, CA = b at angle γ */
const SUS = extra => Object.assign({view:[-6, 9, 10, -1.5], tick:1, fns:[],
  show:[
    {poly:[[0, 0], ["a", 0], ["b*cos(g*pi/180)", "b*sin(g*pi/180)"]], color:"c"},
    {seg:[[0, 0], ["a", 0]], color:"a", w:3},
    {seg:[[0, 0], ["b*cos(g*pi/180)", "b*sin(g*pi/180)"]], color:"b", w:3},
    {seg:[["a", 0], ["b*cos(g*pi/180)", "b*sin(g*pi/180)"]], color:"d", w:3},
    {text:["a/2", -0.6], s:"a", color:"a"},
    {text:["b*cos(g*pi/180)/2-0.4", "b*sin(g*pi/180)/2+0.3"], s:"b", color:"b"},
    {text:[0.7, 0.35], s:"γ", color:"ink"},
    {pt:[0, 0], color:"ink", label:"C", at:"bl"}
  ]}, extra);
const P3 = {a:{v:5, min:2, max:8, step:.5, color:"a"}, b:{v:8, min:2, max:8, step:.5, color:"b"}, g:{v:60, min:10, max:170, step:5, color:"ink", name:"γ"}};

THEORY.b17 = {
  mins:35,
  brief:[
    R`Sínusová veta: $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta} = \dfrac{c}{\sin\gamma} = 2r$.`,
    R`Kosínusová veta: $c^2 = a^2 + b^2 - 2ab\cos\gamma$.`,
    R`Obsah: $S = \frac{1}{2}ab\sin\gamma$.`,
    R`Sínusová veta: strana a dva uhly (usu, uus), alebo dve strany a uhol oproti jednej (pozor na dve riešenia). Kosínusová: tri strany (sss) alebo dve strany a uhol medzi nimi (sus).`
  ],
  subs:{

"Sínusová veta":[
  R`V pravouhlom trojuholníku stačili pomery strán. Pre všeobecný trojuholník platí: pomer strany a sínusu protiľahlého uhla je pre všetky tri strany rovnaký. Rovná sa priemeru opísanej kružnice.`,
  {def:"Sínusová veta", tex:R`\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma} = 2r`},
  {tool:"trojuholnik", ask:R`Ťahaj vrcholy a porovnaj tri pomery strany ku sínusu protiľahlého uhla.`,
   take:R`všetky tri pomery sú vždy rovnaké a rovnajú sa priemeru opísanej kružnice $2r$.`,
   cfg:{on:{uhly:true, opisana:true},
     out:(P, h) => { const g = h.geo, s = d => Math.sin(rad(d));
       return h.calc(R`\frac{a}{\sin\alpha} \doteq ${t2(h, g.a / s(g.alfa))},\quad \frac{b}{\sin\beta} \doteq ${t2(h, g.b / s(g.beta))},\quad \frac{c}{\sin\gamma} \doteq ${t2(h, g.c / s(g.gama))}`) + h.calc(R`2r \doteq ${t2(h, 2 * g.r)}`); }}},
  {ex:R`V trojuholníku je $a = 7$ cm, $\alpha = 40^\circ$, $\beta = 65^\circ$. Vypočítaj ostatné strany.`,
   steps:[
     ["Tretí uhol.", R`\gamma = 180^\circ - 40^\circ - 65^\circ = 75^\circ`],
     ["Sínusová veta pre $b$.", R`b = \frac{7 \sin 65^\circ}{\sin 40^\circ} \doteq 9{,}87`],
     ["A pre $c$.", R`c = \frac{7 \sin 75^\circ}{\sin 40^\circ} \doteq 10{,}52`]
   ],
   res:R`$b \doteq 9{,}87$ cm, $c \doteq 10{,}52$ cm.`},
  {ex:R`Trojuholník má $a = 6$, $b = 8$, $\alpha = 40^\circ$. Vypočítaj $\beta$.`,
   steps:[
     ["Sínusová veta.", R`\sin\beta = \frac{8 \sin 40^\circ}{6} \doteq 0{,}857`],
     [R`Sínus má rovnakú hodnotu pre ostrý aj tupý uhol.`, R`\beta \doteq 59{,}0^\circ \;\vee\; \beta \doteq 121{,}0^\circ`],
     [R`Obe možnosti dávajú súčet s $\alpha$ menší než $180^\circ$.`, R`\text{dva trojuholníky}`]
   ],
   res:R`Dve riešenia: $\beta \doteq 59^\circ$ alebo $\beta \doteq 121^\circ$.`},
  {warn:R`Keď hľadáš uhol cez sínus, kalkulačka vráti len ostrý uhol. Tupý $180^\circ - \beta$ môže byť tiež riešením. Over, či súčet uhlov nepresiahne $180^\circ$, a či je uhol oproti väčšej strane väčší.`}
],

"Kosínusová veta":[
  R`Kosínusová veta je zovšeobecnená Pytagorova veta. Pri pravom uhle je $\cos\gamma = 0$ a zostane $c^2 = a^2 + b^2$. Pri ostrom uhle je $c$ kratšia, pri tupom dlhšia.`,
  {def:"Kosínusová veta", tex:R`\vd{c}^2 = \va{a}^2 + \vb{b}^2 - 2\va{a}\vb{b}\cos\gamma`, note:"Platí pre každú stranu: $a^2 = b^2 + c^2 - 2bc\\cos\\alpha$ a podobne."},
  {tool:"graf", ask:R`Meň uhol $\gamma$ medzi stranami $\va{a}$ a $\vb{b}$. Ako sa mení tretia strana $\vd{c}$? Kedy platí Pytagorova veta?`,
   take:R`väčší uhol dáva dlhšiu stranu $c$. Pri $\gamma = 90^\circ$ je $\cos\gamma = 0$ a veta prejde na Pytagorovu.`,
   cfg:SUS({params:P3,
     out:(P, h) => h.calc(R`\vd{c}^2 = \va{${h.tn(P.a)}}^2 + \vb{${h.tn(P.b)}}^2 - 2 \cdot \va{${h.tn(P.a)}} \cdot \vb{${h.tn(P.b)}} \cdot \cos ${P.g}^\circ`) + h.calc(R`\vd{c} \doteq ${t2(h, cLen(P))}`)})},
  {ex:R`Strany $a = 5$, $b = 8$ zvierajú uhol $\gamma = 60^\circ$. Vypočítaj $c$.`,
   steps:[
     [R`$\cos 60^\circ = \frac{1}{2}$.`, R`c^2 = 25 + 64 - 2 \cdot 5 \cdot 8 \cdot \tfrac{1}{2} = 49`],
     ["Odmocni.", R`c = 7`]
   ],
   res:R`$c = 7$`},
  {ex:R`Trojuholník má strany 4, 5, 6. Aký je jeho najväčší uhol?`,
   steps:[
     ["Najväčší uhol je oproti najdlhšej strane. Vyjadri kosínus.", R`\cos\gamma = \frac{4^2 + 5^2 - 6^2}{2 \cdot 4 \cdot 5} = \frac{5}{40} = 0{,}125`],
     ["Uhol.", R`\gamma \doteq 82{,}82^\circ`]
   ],
   res:R`$\gamma \doteq 82{,}82^\circ$, trojuholník je ostrouhlý.`},
  {tool:"graf", kind:"uloha", ask:R`Strany $a = 5$ a $b = 8$. Nastav uhol $\gamma$ tak, aby mala tretia strana dĺžku 7.`,
   hint:R`$\cos\gamma = \frac{25 + 64 - 49}{80}$.`,
   goal:P => P.g === 60,
   cfg:SUS({params:{a:L(5), b:L(8), g:{v:100, min:10, max:170, step:5, color:"ink", name:"γ"}},
     out:(P, h) => h.calc(R`\vd{c} \doteq ${t2(h, cLen(P))}`)})},
  {warn:R`Pri tupom uhle je $\cos\gamma < 0$ a člen $-2ab\cos\gamma$ je **kladný**. Znamienka dosadzuj opatrne: $-2 \cdot 5 \cdot 8 \cdot (-0{,}5) = +40$.`}
],

"Obsah S = ½ · a · b · sin γ":[
  R`Výška na stranu $a$ je $v_a = b\sin\gamma$ (z pravouhlého trojuholníka). Dosadením do $S = \frac{a v_a}{2}$ vznikne vzorec, ktorý potrebuje len dve strany a uhol medzi nimi.`,
  {def:"Obsah z dvoch strán a uhla", tex:R`S = \frac{1}{2}\va{a}\vb{b}\sin\gamma`},
  {tool:"graf", ask:R`Meň uhol $\gamma$ pri pevných stranách. Pri akom uhle je obsah najväčší?`,
   take:R`pri $90^\circ$, keď $\sin\gamma = 1$. Uhly $\gamma$ a $180^\circ - \gamma$ dávajú rovnaký obsah.`,
   cfg:SUS({params:{a:L(5), b:L(8), g:{v:40, min:10, max:170, step:5, color:"ink", name:"γ"}},
     out:(P, h) => h.calc(R`S = \tfrac{1}{2} \cdot 5 \cdot 8 \cdot \sin ${P.g}^\circ \doteq ${t2(h, 20 * Math.sin(rad(P.g)))}`)})},
  {ex:R`Vypočítaj obsah trojuholníka s $a = 6$, $b = 10$, $\gamma = 30^\circ$ a rovnobežníka so stranami 5 a 8, ktoré zvierajú $120^\circ$.`,
   steps:[
     ["Trojuholník.", R`S = \tfrac{1}{2} \cdot 6 \cdot 10 \cdot \tfrac{1}{2} = 15`],
     ["Rovnobežník sú dva také trojuholníky.", R`S = 5 \cdot 8 \cdot \sin 120^\circ = 20\sqrt{3} \doteq 34{,}64`]
   ],
   res:R`$15$ a $20\sqrt{3} \doteq 34{,}64$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav uhol $\gamma$ tak, aby mal trojuholník so stranami 5 a 8 najväčší možný obsah.`,
   hint:R`$\sin\gamma \leq 1$.`,
   goal:P => P.g === 90,
   cfg:SUS({params:{a:L(5), b:L(8), g:{v:40, min:10, max:170, step:5, color:"ink", name:"γ"}},
     out:(P, h) => h.calc(R`S \doteq ${t2(h, 20 * Math.sin(rad(P.g)))}`)})},
  {warn:R`Uhol vo vzorci musí ležať **medzi** stranami $a$ a $b$. Ak poznáš uhol oproti jednej z nich, najprv dopočítaj ten správny.`}
],

"Kedy ktorú vetu použiť":[
  R`Rozhodne, čo je zadané. Pomôže zapamätať si, že kosínusová veta pracuje s uhlom **medzi** dvoma stranami a sínusová s dvojicami „strana a protiľahlý uhol“.`,
  R`| zadané | veta | poznámka |
|---|---|---|
| sss | kosínusová | najprv najväčší uhol |
| sus | kosínusová | tretia strana, potom ďalej |
| usu, uus | sínusová | tretí uhol z $180^\circ$ |
| ssu | sínusová | môžu byť 0, 1 alebo 2 riešenia |`,
  {ex:R`Body $A$ a $B$ sú na opačných brehoch jazera. Z bodu $C$ je $|CA| = 300$ m, $|CB| = 400$ m a $|\angle ACB| = 70^\circ$. Aká je vzdialenosť $AB$?`,
   steps:[
     ["Dve strany a uhol medzi nimi: kosínusová veta.", R`|AB|^2 = 300^2 + 400^2 - 2 \cdot 300 \cdot 400 \cos 70^\circ`],
     ["Vypočítaj.", R`|AB|^2 \doteq 250\,000 - 82\,085 = 167\,915 \;\Rightarrow\; |AB| \doteq 409{,}8`]
   ],
   res:R`Približne 410 m.`},
  {ex:R`Trojuholník má $c = 10$, $\alpha = 45^\circ$, $\beta = 60^\circ$. Vypočítaj $a$.`,
   steps:[
     ["Strana a dva uhly: sínusová veta. Najprv $\\gamma$.", R`\gamma = 75^\circ`],
     ["Dosaď.", R`a = \frac{10 \sin 45^\circ}{\sin 75^\circ} \doteq 7{,}32`]
   ],
   res:R`$a \doteq 7{,}32$`},
  {warn:R`Pri trojuholníku s tromi známymi stranami nezačínaj sínusovou vetou, nepoznáš žiadny uhol. A ak počítaš uhol sínusovou vetou, začni pri menšej strane: uhol oproti nej je určite ostrý.`}
]

  }
};
})();

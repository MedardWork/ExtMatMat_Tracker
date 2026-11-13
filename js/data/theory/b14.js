/* Lineárna lomená funkcia a asymptoty */
(() => {
const xm = (v, h, c) => v === 0 ? "x" : `x ${v > 0 ? "-" : "+"} \\${c}{${h.tn(Math.abs(v))}}`;   /* x - m */
const pl = (v, h, c) => v === 0 ? "" : ` ${v < 0 ? "-" : "+"} \\${c}{${h.tn(Math.abs(v))}}`;      /* + n after a term */
const HYP = (k, n, h) => `y = \\dfrac{${h.tn(k)}}{${xm(n.m, h, "vb")}}${pl(n.n, h, "vd")}`;

THEORY.b14 = {
  mins:20,
  brief:[
    R`$y = \dfrac{ax + b}{cx + d}$, kde $c \neq 0$ a $ad - bc \neq 0$. Graf je **hyperbola** s dvoma vetvami.`,
    R`Zvislá asymptota: $x = -\dfrac{d}{c}$ (kde je menovateľ nula). Vodorovná: $y = \dfrac{a}{c}$.`,
    R`$D(f) = \mathbb{R} \setminus \left\{-\dfrac{d}{c}\right\}$, $H(f) = \mathbb{R} \setminus \left\{\dfrac{a}{c}\right\}$.`,
    R`Úpravou na tvar $y = \dfrac{k}{x - m} + n$ vidno stred hyperboly $[m;\ n]$ a obe asymptoty.`
  ],
  subs:{

"Graf — hyperbola":[
  R`Najjednoduchšia lomená funkcia je **nepriama úmernosť** $y = \dfrac{k}{x}$. Keď sa $x$ zdvojnásobí, $y$ klesne na polovicu. Súčin $x \cdot y$ je stále rovnaký, rovný $k$.`,
  {def:"Nepriama úmernosť", tex:R`y = \dfrac{\va{k}}{x}`, note:R`kde $k \neq 0$ a $x \neq 0$`, legend:[
    ["k", "a", "koeficient", "Súčin $x \\cdot y$ pre každý bod grafu."]
  ]},
  R`Jej grafom je **hyperbola**: dve oddelené vetvy, ktoré sa k osiam približujú, ale nikdy ich nepretnú. Nulou deliť nemožno, preto graf nemá bod pri $x = 0$.`,
  {tool:"graf", ask:R`Meň $\va{k}$. V ktorých kvadrantoch ležia vetvy? Čo sa stane, keď $k$ zmení znamienko?`,
   take:R`pre $k > 0$ ležia vetvy v I. a III. kvadrante, pre $k < 0$ v II. a IV. Čím je $|k|$ väčšie, tým ďalej od počiatku sa vetvy ohýbajú.`,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[{f:"k/x", lhs:"y"}],
     params:{k:{v:2, min:-6, max:6, step:1, color:"a"}},
     show:[{pt:[1, "k"], color:"a", label:"[1; {k}]", at:"r", if:"k"}, {pt:["k", 1], color:"a", size:3.5, if:"k"}],
     out:(P, h) => P.k === 0 ? h.big("y = 0") + h.pill("k = 0 · nie je to hyperbola", "flat")
       : h.big(`y = \\dfrac{\\va{${h.tn(P.k)}}}{x}`) + (P.k > 0 ? h.pill("I. a III. kvadrant", "up") : h.pill("II. a IV. kvadrant", "down"))
       + h.p(R`Body $[1;\ \va{${P.k}}]$ a $[\va{${P.k}};\ 1]$: súčin súradníc je $\va{${P.k}}$.`)}},
  {cards:[
    {fig:{fns:["2/x"], view:[-4, 4, 4, -4]}, t:R`$\va{k} > 0$`, d:"Vetvy v I. a III. kvadrante. Na každej vetve funkcia klesá."},
    {fig:{fns:["-2/x"], view:[-4, 4, 4, -4]}, t:R`$\va{k} < 0$`, d:"Vetvy v II. a IV. kvadrante. Na každej vetve funkcia rastie."}
  ]},

  {h:"Všeobecný tvar"},
  R`Lineárna lomená funkcia má v čitateli aj v menovateli lineárny výraz. Jej graf je vždy hyperbola $\dfrac{k}{x}$, len posunutá: jej stred už nie je v počiatku, ale v bode $[m;\ n]$.`,
  {def:"Lineárna lomená funkcia", tex:R`y = \dfrac{ax + b}{cx + d}`, note:R`kde $c \neq 0$ a $ad - bc \neq 0$`},
  {def:"Posunutý tvar", tex:R`y = \dfrac{\va{k}}{x - \vb{m}} + \vd{n}`, legend:[
    ["k", "a", "koeficient", "Ako pri $\\frac{k}{x}$: znamienko určuje kvadranty."],
    ["m", "b", "posun do strany", "Zvislá asymptota $x = m$."],
    ["n", "d", "posun zvislo", "Vodorovná asymptota $y = n$."]
  ], note:R`Stred hyperboly je $S\,[\vb{m};\ \vd{n}]$, posuny fungujú ako v [[b12]].`},
  {tool:"graf", ask:R`Posúvaj $\vb{m}$ a $\vd{n}$. Kde je stred hyperboly a kadiaľ idú asymptoty?`,
   take:R`stred je v bode $[m;\ n]$ a asymptoty ním prechádzajú: zvislá $x = m$ a vodorovná $y = n$.`,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[{f:"k/(x-m)+n", lhs:"y"}],
     params:{k:{v:2, min:-4, max:4, step:1, color:"a", lock:true}, m:{v:1, min:-4, max:4, step:.5, color:"b"}, n:{v:-1, min:-4, max:4, step:.5, color:"d"}},
     show:[{vline:"m", color:"b"}, {hline:"n", color:"d"}, {pt:["m", "n"], color:"c", label:"S [{m}; {n}]", at:"tr"}],
     out:(P, h) => h.big(HYP(P.k, P, h)) + h.p(R`Asymptoty: $x = \vb{${h.tn(P.m)}}$, $y = \vd{${h.tn(P.n)}}$`)}},
  {ex:R`Uprav funkciu $y = \dfrac{2x + 1}{x - 3}$ na posunutý tvar a urč stred hyperboly.`,
   steps:[
     [R`V čitateli vytvor násobok menovateľa: $2(x - 3) = 2x - 6$, chýba ešte $+7$.`, R`2x + 1 = 2(x - 3) + 7`],
     ["Rozdeľ zlomok na dva.", R`y = \dfrac{2(x - 3) + 7}{x - 3} = 2 + \dfrac{7}{x - 3}`],
     ["Prečítaj parametre.", R`k = 7,\quad m = 3,\quad n = 2`]
   ],
   res:R`$y = \dfrac{7}{x - 3} + 2$, stred $S\,[3;\ 2]$. Vetvy sú v pravom hornom a ľavom dolnom „kvadrante“ okolo stredu, lebo $k > 0$.`,
   fig:{tool:"graf", cfg:{view:[-5, 9, 11, -5], tick:1, fns:[{f:"(2x+1)/(x-3)", lhs:"y"}],
     show:[{vline:3, color:"b"}, {hline:2, color:"d"}, {pt:[3, 2], color:"c", label:"S [3; 2]", at:"tr"}],
     out:(P, h) => h.calc(R`y = \dfrac{2x + 1}{x - 3} = \dfrac{7}{x - 3} + 2`)}}},
  {warn:R`Ak $ad - bc = 0$, výraz sa dá vykrátiť a hyperbola nevznikne. Napríklad $\dfrac{2x + 4}{x + 2} = 2$ pre $x \neq -2$: graf je priamka $y = 2$ s jedným chýbajúcim bodom.`}
],

"Asymptoty":[
  R`**Asymptota** je priamka, ku ktorej sa graf neobmedzene približuje. Lineárna lomená funkcia má vždy dve: jednu zvislú a jednu vodorovnú.`,
  R`**Zvislá** je tam, kde je menovateľ nulový. Pri $x$ blízko tohto čísla sa delí veľmi malým číslom a hodnota uteká do nekonečna. **Vodorovná** popisuje, k čomu sa hodnota blíži pre veľmi veľké $x$: vtedy $b$ a $d$ prestanú hrať rolu a zostane podiel $\dfrac{ax}{cx} = \dfrac{a}{c}$.`,
  {def:"Asymptoty", mid:true, tex:R`x = -\dfrac{\vd{d}}{c} \qquad y = \dfrac{\va{a}}{c}`, note:R`pre $y = \dfrac{\va{a}x + b}{cx + \vd{d}}$`},
  {tool:"graf", ask:R`Funkcia $y = \dfrac{ax + 1}{x + d}$. Meň $\va{a}$ a $\vd{d}$. Ktorý parameter hýbe ktorou asymptotou?`,
   take:R`$d$ posúva zvislú asymptotu $x = -d$, $a$ vodorovnú $y = a$ (tu je $c = 1$).`,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[{f:"(a*x+1)/(x+d)", lhs:"y"}],
     params:{a:{v:2, min:-3, max:3, step:.5, color:"a"}, d:{v:-2, min:-4, max:4, step:.5, color:"d"}},
     show:[{vline:"-d", color:"d"}, {hline:"a", color:"a"}],
     out:(P, h) => h.big(`y = \\dfrac{\\va{${h.tn(P.a)}}x + 1}{${P.d ? `x ${P.d < 0 ? "-" : "+"} \\vd{${h.tn(Math.abs(P.d))}}` : "x"}}`)
       + (P.a * P.d === 1 ? h.pill("ad − bc = 0 · vykráti sa na priamku", "flat")
         : h.p(R`Zvislá: $x = \vd{${h.tn(-P.d)}}$`) + h.p(R`Vodorovná: $y = \va{${h.tn(P.a)}}$`))}},
  {tool:"graf", ask:R`Funkcia $f(x) = \dfrac{2x + 1}{x - 3}$. Posúvaj $\vd{x}$ doprava. K akému číslu sa blíži hodnota?`,
   take:R`hodnota sa blíži k 2, teda k $\dfrac{a}{c} = \dfrac{2}{1}$. Čím väčšie $x$, tým menej záleží na $+1$ a $-3$.`,
   cfg:{view:[-6, 12, 62, -6], tick:[10, 2], free:true, aspect:"4/3", fns:[{f:"(2x+1)/(x-3)", lhs:"f(x)"}],
     params:{s:{v:5, min:4, max:60, step:1, color:"d", name:"x"}},
     show:[{hline:2, color:"a"}, {vline:3, color:"soft"}, {pt:["s", "(2s+1)/(s-3)"], color:"d", size:5}],
     out:(P, h) => h.calc(R`f(\vd{${P.s}}) = \dfrac{${2 * P.s + 1}}{${P.s - 3}} \doteq ${h.tn((2 * P.s + 1) / (P.s - 3), 3)}`)
       + h.p(R`Od asymptoty $y = 2$ je vzdialená $${h.tn(7 / (P.s - 3), 3)}$.`)}},
  {ex:R`Urč asymptoty funkcie $y = \dfrac{2x + 1}{x - 3}$.`,
   steps:[
     ["Zvislá: menovateľ sa rovná nule.", R`x - 3 = 0 \;\Rightarrow\; x = 3`],
     [R`Vodorovná: podiel koeficientov pri $x$.`, R`y = \dfrac{2}{1} = 2`]
   ],
   res:R`Asymptoty sú $x = 3$ a $y = 2$.`},
  {ex:R`Urč asymptoty funkcie $y = \dfrac{3 - x}{2x + 4}$.`,
   steps:[
     ["Zvislá.", R`2x + 4 = 0 \;\Rightarrow\; x = -2`],
     [R`Koeficient pri $x$ v čitateli je $-1$, nie 3. Poradie členov nevadí.`, R`y = \dfrac{-1}{2} = -\dfrac{1}{2}`]
   ],
   res:R`Asymptoty sú $x = -2$ a $y = -\dfrac{1}{2}$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{m}$ a $\vd{n}$ tak, aby mala hyperbola $y = \dfrac{2}{x - m} + n$ asymptoty $x = -1$ a $y = 2$.`,
   hint:R`Zvislá asymptota je $x = m$, vodorovná $y = n$.`,
   goal:P => P.m === -1 && P.n === 2,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[{f:"k/(x-m)+n", lhs:"y"}],
     params:{k:{v:2, min:-4, max:4, step:1, color:"a", lock:true}, m:{v:2, min:-4, max:4, step:.5, color:"b"}, n:{v:-1, min:-4, max:4, step:.5, color:"d"}},
     show:[{vline:"m", color:"b"}, {hline:"n", color:"d"}, {target:[1, 3], fn:0, label:"[1; 3]", at:"r"}],
     out:(P, h) => h.big(HYP(P.k, P, h)) + (P.m === -1 && P.n === 2 ? h.pill("✓ Asymptoty x = −1 a y = 2", "ok")
       : h.p(R`Teraz: $x = \vb{${h.tn(P.m)}}$, $y = \vd{${h.tn(P.n)}}$`))}},
  {warn:R`Vodorovná asymptota nie je $y = \dfrac{b}{d}$. To je priesečník s osou $y$ (hodnota pre $x = 0$). Asymptota je podiel koeficientov **pri $x$**: $\dfrac{a}{c}$.`}
],

"Definičný obor a obor hodnôt":[
  R`Definičný obor tvoria všetky čísla okrem toho, pre ktoré je menovateľ nulový. Obor hodnôt sú všetky čísla okrem hodnoty vodorovnej asymptoty: graf sa k nej blíži, ale nikdy ju nedosiahne.`,
  {def:"Definičný obor a obor hodnôt", mid:true, tex:R`D(f) = \mathbb{R} \setminus \left\{-\dfrac{d}{c}\right\} \qquad H(f) = \mathbb{R} \setminus \left\{\dfrac{a}{c}\right\}`},
  {tool:"graf", kind:"uloha", ask:R`Funkcia $f(x) = \dfrac{2x + 1}{x - 3}$. Posúvaj vodorovnú priamku $y = \vd{h}$. Pre ktoré $h$ nemá rovnica $f(x) = h$ riešenie?`,
   hint:R`Priamka nepretne graf, keď splynie s vodorovnou asymptotou. Tá hodnota nepatrí do oboru hodnôt.`,
   goal:P => P.h === 2,
   cfg:{view:[-5, 9, 11, -5], tick:1, fns:[{f:"(2x+1)/(x-3)", lhs:"f(x)"}, {f:"h", color:"d", lhs:"y"}],
     params:{h:{v:4, min:-4, max:8, step:.5, color:"d"}},
     show:[{meet:[0, 1], color:"d"}, {vline:3, color:"soft"}],
     out:(P, h) => P.h === 2 ? h.big(R`\dfrac{2x + 1}{x - 3} = \vd{2}`) + h.pill("✓ Žiadny priesečník: 2 ∉ H(f)", "ok")
       : h.big(R`\dfrac{2x + 1}{x - 3} = \vd{${h.tn(P.h)}}`) + h.p(R`Riešenie: $x = ${h.tn((3 * P.h + 1) / (P.h - 2))}$`)}},
  R`Priesečníky s osami nájdeš ako pri každej funkcii. S osou $x$: čitateľ je nula. S osou $y$: dosaď $x = 0$.`,
  {cards:[
    {t:"Priesečník s osou x", tex:R`ax + b = 0 \;\Rightarrow\; x = -\dfrac{b}{a}`},
    {t:"Priesečník s osou y", tex:R`x = 0 \;\Rightarrow\; y = \dfrac{b}{d}`}
  ]},
  {ex:R`Vyšetri funkciu $f(x) = \dfrac{2x - 4}{x + 1}$: definičný obor, obor hodnôt, priesečníky s osami, monotónnosť.`,
   steps:[
     ["Definičný obor.", R`x + 1 \neq 0 \;\Rightarrow\; D(f) = \mathbb{R} \setminus \{-1\}`],
     ["Obor hodnôt z vodorovnej asymptoty.", R`y = \dfrac{2}{1} = 2 \;\Rightarrow\; H(f) = \mathbb{R} \setminus \{2\}`],
     ["Priesečníky.", R`2x - 4 = 0 \Rightarrow [2;\ 0],\qquad f(0) = \dfrac{-4}{1} \Rightarrow [0;\ -4]`],
     [R`Posunutý tvar: $2x - 4 = 2(x + 1) - 6$.`, R`f(x) = \dfrac{-6}{x + 1} + 2`],
     [R`$k = -6 < 0$, funkcia rastie na každom intervale zvlášť.`, R`(-\infty;\ -1) \text{ a } (-1;\ \infty)`]
   ],
   res:R`$D(f) = \mathbb{R} \setminus \{-1\}$, $H(f) = \mathbb{R} \setminus \{2\}$, priesečníky $[2;\ 0]$ a $[0;\ -4]$, rastúca na $(-\infty;\ -1)$ aj na $(-1;\ \infty)$.`,
   fig:{tool:"graf", cfg:{view:[-7, 9, 6, -7], tick:1, fns:[{f:"(2x-4)/(x+1)", lhs:"f(x)"}],
     show:[{vline:-1, color:"b"}, {hline:2, color:"d"}, {pt:[2, 0], color:"c", label:"[2; 0]", at:"br"}, {pt:[0, -4], color:"c", label:"[0; −4]", at:"r"}],
     out:(P, h) => h.calc(R`f(x) = \dfrac{2x - 4}{x + 1} = \dfrac{-6}{x + 1} + 2`)}}},
  {ex:R`Hyperbola má asymptoty $x = 2$ a $y = -1$ a prechádza bodom $[3;\ 1]$. Nájdi jej predpis.`,
   steps:[
     ["Asymptoty dávajú $m$ a $n$.", R`y = \dfrac{k}{x - 2} - 1`],
     [R`Dosaď bod $[3;\ 1]$.`, R`1 = \dfrac{k}{3 - 2} - 1 \;\Rightarrow\; k = 2`],
     ["Ak treba, zapíš ako jeden zlomok.", R`y = \dfrac{2}{x - 2} - 1 = \dfrac{2 - (x - 2)}{x - 2} = \dfrac{-x + 4}{x - 2}`]
   ],
   res:R`$y = \dfrac{2}{x - 2} - 1 = \dfrac{4 - x}{x - 2}$.`},
  {warn:R`Funkcia $\dfrac{-6}{x + 1} + 2$ nie je rastúca na celom definičnom obore. Rastie na každej vetve zvlášť, ale $f(-2) = 8 > f(0) = -4$. Monotónnosť preto zapisuj pre každý interval osobitne.`}
]

  }
};
})();

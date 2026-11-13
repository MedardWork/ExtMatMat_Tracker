/* Logaritmická funkcia a jej graf */
(() => {
const A = (extra) => Object.assign({v:2, min:.2, max:4, step:.1, color:"a", note:"základ"}, extra);
const GH = f => ({f, color:"axis", dash:true, thin:true, ghost:true});
const lg = (a, h) => `\\log_{\\va{${h.tn(a)}}} x`;
const xm = (v, h, c) => v === 0 ? "x" : `x ${v > 0 ? "-" : "+"} \\${c}{${h.tn(Math.abs(v))}}`;   /* x - p */

THEORY.b13 = {
  mins:20,
  brief:[
    R`$y = \log_{\va{a}} x$, kde $a > 0$ a $a \neq 1$. Je to inverzná funkcia k $y = a^x$.`,
    R`Pre $\va{a} > 1$ rastie, pre $0 < \va{a} < 1$ klesá. Vždy prechádza bodom $[1;\ 0]$.`,
    R`$D(f) = (0;\ \infty)$, $H(f) = \mathbb{R}$. Os $y$ je asymptota.`,
    R`Definičný obor $\log g(x)$: rieš nerovnicu $g(x) > 0$.`
  ],
  subs:{

"Graf a vlastnosti":[
  R`Logaritmus odpovedá na otázku: na koľkú treba umocniť základ $a$, aby vyšlo $x$? Napríklad $\log_2 8 = 3$, lebo $2^3 = 8$. Podrobne ho preberá téma [[b1]].`,
  {def:"Logaritmus", mid:true, tex:R`\log_{\va{a}} x = y \iff \va{a}^{\,y} = x`, note:R`kde $a > 0$, $a \neq 1$ a $x > 0$`},
  R`Keď za $x$ dosádzaš rôzne kladné čísla, dostaneš **logaritmickú funkciu**.`,
  {def:"Logaritmická funkcia", tex:R`y = \log_{\va{a}} x`, note:R`kde $a > 0$ a $a \neq 1$`, legend:[
    ["a", "a", "základ", "To isté číslo ako pri exponenciálnej funkcii $a^x$."]
  ]},
  {ex:R`Vyplň tabuľku hodnôt funkcie $y = \log_2 x$.`,
   steps:[
     [R`Hľadáš exponent, na ktorý treba umocniť 2.`, R`\log_2 1 = 0,\quad \log_2 2 = 1,\quad \log_2 4 = 2,\quad \log_2 8 = 3`],
     [R`Pre čísla medzi 0 a 1 vyjde záporný exponent.`, R`\log_2 \tfrac{1}{2} = -1,\quad \log_2 \tfrac{1}{4} = -2`]
   ],
   res:R`Keď sa $x$ zdvojnásobí, hodnota stúpne o 1:

| $x$ | $\tfrac14$ | $\tfrac12$ | $1$ | $2$ | $4$ | $8$ |
|---|---|---|---|---|---|---|
| $\log_2 x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |`},
  {tool:"graf", ask:R`Meň základ $\va{a}$. Čo sa stane s grafom, keď prejde cez jednotku? Ktorý bod sa nehýbe?`,
   take:R`pre $a > 1$ funkcia rastie, pre $a < 1$ klesá. Každý graf prechádza bodom $[1;\ 0]$ a bodom $[a;\ 1]$.`,
   cfg:{view:[-1, 4, 9, -4], tick:1, fns:[{f:"ln(x)/ln(a)", lhs:"y"}],
     params:{a:A()},
     show:[{pt:[1, 0], color:"b", label:"[1; 0]", at:"tl"}, {pt:["a", 1], color:"a", label:"[{a}; 1]", at:"tr", if:P => Math.abs(P.a - 1) > .01}],
     out:(P, h) => Math.abs(P.a - 1) < .01 ? h.big("a = 1") + h.pill("základ 1 nie je dovolený", "flat") + h.p("$1^y$ je vždy 1, iné číslo z neho nedostaneš.")
       : h.big(`y = ${lg(P.a, h)}`) + (P.a > 1 ? h.pill("a > 1 · rastúca", "up") : h.pill("0 < a < 1 · klesajúca", "down"))
       + h.p(R`$\log_{\va{${h.tn(P.a)}}} \va{${h.tn(P.a)}} = 1$, lebo $\va{${h.tn(P.a)}}^1 = \va{${h.tn(P.a)}}$.`)}},
  {cards:[
    {fig:{fns:["ln(x)/ln(2)"], view:[-1, 3, 6, -3]}, t:R`$\va{a} > 1$`, d:"Rastúca. Pri nule padá do $-\\infty$, doprava rastie stále pomalšie."},
    {fig:{fns:["-ln(x)/ln(2)"], view:[-1, 3, 6, -3]}, t:R`$0 < \va{a} < 1$`, d:"Klesajúca. Pri nule ide do $+\\infty$, doprava klesá stále pomalšie."}
  ]},
  {cards:[
    {t:"Definičný obor", d:R`$D(f) = (0;\ \infty)$. Logaritmus nuly ani záporného čísla neexistuje.`},
    {t:"Obor hodnôt", d:R`$H(f) = \mathbb{R}$. Vyjsť môže akékoľvek číslo.`},
    {t:R`Bod $[1;\ 0]$`, d:R`$\log_a 1 = 0$ pre každý základ, lebo $a^0 = 1$.`},
    {t:"Asymptota", d:R`Os $y$. Graf sa k nej blíži, ale nikdy ju nepretne.`}
  ]},
  {tool:"graf", ask:R`Posúvaj $\vd{k}$. Bod má súradnice $[2^k;\ k]$. Čo sa deje s hodnotou, keď sa $x$ blíži k nule?`,
   take:R`každým krokom doľava sa $x$ zmenší na polovicu a hodnota klesne o 1. K nule sa $x$ len blíži, hodnota pritom padá bez konca.`,
   cfg:{view:[-1.5, 5, 17, -5], tick:[2, 1], free:true, aspect:"4/3", fns:[{f:"ln(x)/ln(2)", lhs:"y"}],
     params:{k:{v:2, min:-4, max:4, step:1, color:"d", name:"k"}},
     show:[{drop:["2^k", "k"], color:"soft"}, {pt:["2^k", "k"], color:"d", size:5}],
     out:(P, h) => h.calc(R`\log_2 ${P.k < 0 ? `\\tfrac{1}{${2 ** -P.k}}` : 2 ** P.k} = \vd{${P.k}}`)
       + h.p(P.k < 0 ? R`$x = \tfrac{1}{${2 ** -P.k}}$ je blízko nuly, hodnota je záporná.` : R`$x = ${2 ** P.k}$`)}},
  {ex:R`Graf funkcie $y = \log_a x$ prechádza bodom $[9;\ 2]$. Urč základ $a$.`,
   steps:[
     ["Dosaď súradnice bodu.", R`\log_a 9 = 2`],
     ["Prepíš podľa definície logaritmu.", R`a^2 = 9`],
     [R`Základ musí byť kladný.`, R`a = 3`]
   ],
   res:R`$a = 3$, funkcia je $y = \log_3 x$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav základ $\va{a}$ tak, aby graf $y = \log_a x$ prechádzal bodom $[4;\ 2]$.`,
   hint:R`Potrebuješ $\log_a 4 = 2$, teda $a^2 = 4$.`,
   goal:P => Math.abs(P.a - 2) < 1e-9,
   cfg:{view:[-1, 4, 9, -3], tick:1, fns:[{f:"ln(x)/ln(a)", lhs:"y"}],
     params:{a:A({v:3})},
     show:[{target:[4, 2], fn:0, label:"[4; 2]", at:"tl"}],
     out:(P, h) => Math.abs(P.a - 1) < .01 ? h.p("Základ 1 nie je dovolený.")
       : h.big(`y = ${lg(P.a, h)}`) + (Math.abs(P.a - 2) < 1e-9 ? h.pill("✓ Graf prechádza bodom [4; 2]", "ok")
         : h.p(R`$\log_{\va{${h.tn(P.a)}}} 4 \doteq ${h.tn(Math.log(4) / Math.log(P.a))}$`))}},
  {ex:R`Bez kalkulačky rozhodni, ktoré číslo je väčšie: $\log_{0{,}5} 3$ alebo $\log_{0{,}5} 5$.`,
   steps:[
     [R`Základ $0{,}5$ je menší ako 1, funkcia je klesajúca.`, R`0 < 0{,}5 < 1`],
     ["Väčšiemu číslu patrí menšia hodnota.", R`3 < 5 \;\Rightarrow\; \log_{0{,}5} 3 > \log_{0{,}5} 5`]
   ],
   res:R`Väčšie je $\log_{0{,}5} 3$.`},
  {warn:R`Logaritmus nuly a záporného čísla neexistuje, ale samotný logaritmus záporný byť môže: $\log_2 \tfrac{1}{8} = -3$. Zakázané je záporné **číslo pod logaritmom**, nie výsledok.`}
],

"Definičný obor (argument > 0)":[
  R`Výraz, z ktorého počítaš logaritmus, sa volá **argument**. Musí byť kladný, nulu ani záporné číslo nepripúšťa. Pri funkcii $\log g(x)$ preto hľadáš všetky $x$, pre ktoré je $g(x) > 0$.`,
  {def:"Podmienka logaritmu", mid:true, tex:R`y = \log_a g(x) \;\Rightarrow\; g(x) > 0`, note:R`Platí pre každý základ, aj pre $\log$ (základ 10) a $\ln$ (základ $e$).`},
  {tool:"graf", ask:R`Posúvaj $\vb{p}$ vo funkcii $y = \log(x - p)$. Kde graf začína a kam patrí asymptota?`,
   take:R`argument $x - p$ je kladný pre $x > p$. Asymptotou je priamka $x = p$ a definičný obor je $(p;\ \infty)$.`,
   cfg:{view:[-6, 2, 8, -3], tick:1, fns:[{f:"log(x-p)", lhs:"y"}, GH("log(x)")],
     params:{p:{v:2, min:-4, max:5, step:.5, color:"b"}},
     show:[{vline:"p", color:"b"}, {pt:["p+1", 0], color:"ink", label:"[{p+1}; 0]", at:"br"}],
     out:(P, h) => h.big(`y = \\log(${xm(P.p, h, "vb")})`)
       + h.calc(R`${xm(P.p, h, "vb")} > 0 \;\Rightarrow\; x > \vb{${h.tn(P.p)}}`)
       + h.p(R`$D(f) = (\vb{${h.tn(P.p)}};\ \infty)$`)}},
  {steps:[
    {t:"Napíš podmienku", d:"Každý argument každého logaritmu musí byť väčší ako nula."},
    {t:"Vyrieš nerovnicu", d:"Lineárnu, kvadratickú alebo so zlomkom, podľa toho, čo je v argumente."},
    {t:"Zapíš interval", d:"Ak je podmienok viac, musia platiť všetky naraz: urob prienik."}
  ]},
  {ex:R`Urč definičný obor funkcie $f(x) = \log(3 - x)$.`,
   steps:[
     ["Argument musí byť kladný.", R`3 - x > 0`],
     [R`Pripočítaj $x$.`, R`3 > x`]
   ],
   res:R`$D(f) = (-\infty;\ 3)$. Graf je zrkadlovo otočený, asymptota je $x = 3$.`,
   fig:{tool:"graf", cfg:{view:[-7, 2, 5, -3], tick:1, fns:[{f:"log(3-x)", lhs:"f(x)"}],
     show:[{vline:3, color:"b"}, {pt:[2, 0], color:"ink", label:"[2; 0]", at:"bl"}],
     out:(P, h) => h.calc(R`f(x) = \log(3 - x)`) + h.p(R`Asymptota $x = 3$, nulový bod $x = 2$.`)}}},
  {ex:R`Urč definičný obor funkcie $f(x) = \log(x^2 - 4)$.`,
   steps:[
     ["Podmienka.", R`x^2 - 4 > 0`],
     [R`Nulové body výrazu sú $\pm 2$. Parabola $x^2 - 4$ je otvorená nahor, kladná je mimo nich.`, R`x < -2 \text{ alebo } x > 2`]
   ],
   res:R`$D(f) = (-\infty;\ -2) \cup (2;\ \infty)$. Graf má dve oddelené vetvy.`,
   fig:{tool:"graf", cfg:{view:[-6, 2, 6, -3], tick:1, fns:[{f:"log(x^2-4)", lhs:"f(x)"}, GH("x^2-4")],
     show:[{vline:-2, color:"b"}, {vline:2, color:"b"}],
     out:(P, h) => h.calc(R`f(x) = \log(x^2 - 4)`) + h.p("Sivá je parabola $x^2 - 4$. Logaritmus existuje len tam, kde je nad osou $x$.")}}},
  {ex:R`Urč definičný obor funkcie $f(x) = \log_2(x + 3) + \log_2(5 - x)$.`,
   steps:[
     ["Prvý argument.", R`x + 3 > 0 \;\Rightarrow\; x > -3`],
     ["Druhý argument.", R`5 - x > 0 \;\Rightarrow\; x < 5`],
     ["Obe podmienky musia platiť naraz.", R`-3 < x < 5`]
   ],
   res:R`$D(f) = (-3;\ 5)$.`},
  {tool:"graf", ask:R`Funkcia $y = \log_2(x - p) + q$. Posúvaj $\vb{p}$ aj $\vd{q}$. Ktorý z posunov mení definičný obor?`,
   take:R`len vodorovný posun $p$. Zvislý posun $q$ nemení ani definičný obor, ani asymptotu, len zdvihne graf.`,
   cfg:{view:[-5, 5, 8, -4], tick:1, fns:[{f:"ln(x-p)/ln(2)+q", lhs:"y"}, GH("ln(x)/ln(2)")],
     params:{p:{v:1, min:-3, max:4, step:.5, color:"b"}, q:{v:1, min:-3, max:3, step:.5, color:"d"}},
     show:[{vline:"p", color:"b"}, {pt:["p+1", "q"], color:"ink", label:"[{p+1}; {q}]", at:"br"}],
     out:(P, h) => h.big(R`y = \log_2(${xm(P.p, h, "vb")})${P.q ? ` ${P.q < 0 ? "-" : "+"} \\vd{${h.tn(Math.abs(P.q))}}` : ""}`)
       + h.p(R`$D(f) = (\vb{${h.tn(P.p)}};\ \infty)$, $H(f) = \mathbb{R}$`)}},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{p}$ tak, aby funkcia $y = \log(x - p)$ mala definičný obor $(-2;\ \infty)$.`,
   hint:R`Podmienka $x - p > 0$ dáva $x > p$. Hranica intervalu je $p$.`,
   goal:P => P.p === -2,
   cfg:{view:[-6, 2, 6, -3], tick:1, fns:[{f:"log(x-p)", lhs:"y"}],
     params:{p:{v:1, min:-4, max:4, step:.5, color:"b"}},
     show:[{vline:"p", color:"b"}, {target:[-1, 0], fn:0, label:"[−1; 0]", at:"br"}],
     out:(P, h) => h.big(`y = \\log(${xm(P.p, h, "vb")})`) + (P.p === -2 ? h.pill("✓ D(f) = (−2; ∞)", "ok") : h.p(R`$D(f) = (\vb{${h.tn(P.p)}};\ \infty)$`))}},
  {warn:R`$\log x^2$ a $2\log x$ nemajú rovnaký definičný obor. Pri $\log x^2$ stačí $x \neq 0$, lebo $x^2 > 0$. Pri $2\log x$ musí byť $x > 0$. Pravidlo $\log x^2 = 2\log x$ platí len pre kladné $x$.`}
],

"Vzťah k exponenciálnej funkcii":[
  R`Exponenciálna funkcia $y = a^x$ k exponentu priradí výsledok. Logaritmická robí opak: k výsledku nájde exponent. Sú to navzájom **inverzné funkcie**, presne v zmysle [[a20]].`,
  {def:"Inverzné funkcie", mid:true, tex:R`f(x) = \va{a}^x \qquad f^{-1}(x) = \log_{\va{a}} x`, note:R`Platí $\log_a a^x = x$ a $a^{\log_a x} = x$.`},
  R`Inverzná funkcia vymení $x$ a $y$. Bod $[2;\ 4]$ grafu $2^x$ sa zmení na bod $[4;\ 2]$ grafu $\log_2 x$. Preto sú grafy súmerné podľa priamky $y = x$.`,
  {tool:"graf", ask:R`Posúvaj bod $\vd{s}$ po exponenciálnej krivke a meň základ $\va{a}$. Kde leží jeho obraz na logaritmickej krivke?`,
   take:R`bod $[s;\ a^s]$ prejde na $[a^s;\ s]$. Spojnica bodov je kolmá na priamku $y = x$ a tá ju delí na polovicu.`,
   cfg:{view:[-4, 6, 6, -4], tick:1, fns:[{f:"a^x", lhs:"y"}, {f:"ln(x)/ln(a)", color:"c", lhs:"y"}, GH("x")],
     params:{a:A({min:1.2, max:4}), s:{v:1, min:-3, max:2, step:.5, color:"d", name:"s"}},
     show:[{seg:[["s", "a^s"], ["a^s", "s"]], color:"soft", dash:2}, {pt:["s", "a^s"], color:"d", label:"[{s}; {a^s}]", at:"tl"}, {pt:["a^s", "s"], color:"c", label:"[{a^s}; {s}]", at:"br"}],
     out:(P, h) => h.p(R`$y = \va{${h.tn(P.a)}}^x$ a $\vc{y = \log_{${h.tn(P.a)}} x}$`)
       + h.calc(R`\va{${h.tn(P.a)}}^{\vd{${h.tn(P.s)}}} \doteq ${h.tn(P.a ** P.s)} \quad\Longleftrightarrow\quad \log_{\va{${h.tn(P.a)}}} ${h.tn(P.a ** P.s)} \doteq \vd{${h.tn(P.s)}}`)}},
  {map:[
    [R`$D = \mathbb{R}$, $H = (0;\ \infty)$`, R`definičný obor a obor hodnôt sa vymenia`, R`D = (0;\ \infty),\ H = \mathbb{R}`],
    [R`bod $[0;\ 1]$`, "súradnice sa vymenia", R`[1;\ 0]`],
    [R`bod $[1;\ a]$`, "", R`[a;\ 1]`],
    [R`asymptota os $x$`, "osi sa vymenia", R`\text{asymptota os } y`],
    [R`$a > 1$ rastie, $a < 1$ klesá`, "monotónnosť zostane", R`a > 1 \text{ rastie},\ a < 1 \text{ klesá}`]
  ]},
  {ex:R`Nájdi inverznú funkciu k $f(x) = 2^x + 1$ a urči jej definičný obor.`,
   steps:[
     [R`Zapíš $y = 2^x + 1$ a vymeň $x$ a $y$.`, R`x = 2^y + 1`],
     [R`Osamostatni mocninu.`, R`2^y = x - 1`],
     ["Podľa definície logaritmu.", R`y = \log_2(x - 1)`],
     [R`Definičný obor inverznej = obor hodnôt pôvodnej. Pôvodná má $H(f) = (1;\ \infty)$.`, R`x - 1 > 0 \;\Rightarrow\; x > 1`]
   ],
   res:R`$f^{-1}(x) = \log_2(x - 1)$, $D(f^{-1}) = (1;\ \infty)$.`,
   fig:{tool:"graf", cfg:{view:[-4, 6, 7, -4], tick:1, fns:[{f:"2^x+1", lhs:"f(x)"}, {f:"ln(x-1)/ln(2)", color:"c", lhs:"f^{-1}(x)"}, GH("x")],
     show:[{hline:1, color:"soft"}, {vline:1, color:"soft"}, {pt:[0, 2], color:"a", label:"[0; 2]", at:"tl"}, {pt:[2, 0], color:"c", label:"[2; 0]", at:"br"}],
     out:(P, h) => h.p(R`$f(x) = 2^x + 1$`) + h.p(R`$\vc{f^{-1}(x) = \log_2(x - 1)}$`) + h.p("Asymptoty $y = 1$ a $x = 1$ sú tiež súmerné podľa $y = x$.")}}},
  {ex:R`Vyrieš rovnicu $2^x = 5$.`,
   steps:[
     [R`Hľadáš exponent, na ktorý treba umocniť 2, aby vyšlo 5. To je presne logaritmus.`, R`x = \log_2 5`],
     ["Na kalkulačke pomocou zmeny základu.", R`x = \dfrac{\log 5}{\log 2} \doteq \dfrac{0{,}699}{0{,}301} \doteq 2{,}32`]
   ],
   res:R`$x = \log_2 5 \doteq 2{,}32$. Výsledok sedí: $2^2 = 4 < 5 < 8 = 2^3$.`},
  {tool:"graf", kind:"uloha", ask:R`Posúvaj bod $\vd{s}$ po krivke $y = 2^x$. Nájdi ten, ktorého obraz na krivke $y = \log_2 x$ má $x$-ovú súradnicu 8.`,
   hint:R`Obraz bodu $[s;\ 2^s]$ je $[2^s;\ s]$. Potrebuješ $2^s = 8$.`,
   goal:P => P.s === 3,
   cfg:{view:[-3, 9, 10, -3], tick:1, fns:[{f:"2^x", lhs:"y"}, {f:"ln(x)/ln(2)", color:"c", lhs:"y"}, GH("x")],
     params:{s:{v:1, min:-2, max:3.5, step:.5, color:"d", name:"s"}},
     show:[{seg:[["s", "2^s"], ["2^s", "s"]], color:"soft", dash:2}, {pt:["s", "2^s"], color:"d"}, {pt:["2^s", "s"], color:"c", label:"[{2^s}; {s}]", at:"br"}],
     out:(P, h) => h.calc(R`[\vd{${h.tn(P.s)}};\ ${h.tn(2 ** P.s)}] \to [${h.tn(2 ** P.s)};\ \vd{${h.tn(P.s)}}]`)
       + (P.s === 3 ? h.pill("✓ log₂ 8 = 3", "ok") : "")}},
  {tip:R`Logaritmická funkcia rastie veľmi pomaly: $\log 1\,000\,000 = 6$. Preto sa logaritmus hodí na veličiny s obrovským rozsahom, napríklad hlasitosť v decibeloch alebo kyslosť pH.`, label:"Súvislosť"},
  {warn:R`Inverzná k $a^x$ je $\log_a x$, nie $\dfrac{1}{a^x}$. Exponent $-1$ v zápise $f^{-1}$ neznamená prevrátenú hodnotu.`}
]

  }
};
})();

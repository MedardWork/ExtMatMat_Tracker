/* Exponenciálna funkcia a jej graf */
(() => {
const A = (extra) => Object.assign({v:2, min:.2, max:4, step:.1, color:"a", note:"základ"}, extra);

THEORY.a24 = {
  mins:20,
  brief:[
    R`$y = \va{a}^x$, kde $a > 0$ a $a \neq 1$. Premenná je v exponente.`,
    R`Pre $\va{a} > 1$ rastie, pre $0 < \va{a} < 1$ klesá. Vždy prechádza bodom $[0;\ 1]$.`,
    R`$D(f) = \mathbb{R}$, $H(f) = (0;\ \infty)$. Hodnoty sú vždy kladné, os $x$ je asymptota.`,
    R`Rast alebo pokles o $p\,\%$ za obdobie: $N(t) = N_0 \cdot a^t$, kde $a = 1 \pm \dfrac{p}{100}$.`
  ],
  subs:{

"Graf pre a > 1 a pre 0 < a < 1":[
  R`V **exponenciálnej funkcii** je premenná $x$ v exponente a základ je pevné číslo. Je to opačne než pri mocninovej funkcii $x^n$.`,
  {def:"Exponenciálna funkcia", tex:R`y = \va{a}^x`, note:R`kde $a > 0$ a $a \neq 1$`, legend:[
    ["a", "a", "základ", "Číslo, ktorým sa hodnota násobí pri každom zväčšení $x$ o 1."]
  ]},
  {ex:R`Vyplň tabuľku hodnôt funkcie $y = 2^x$ pre $x$ od $-2$ po $3$.`,
   steps:[
     [R`Pre kladné $x$ násobíš dvojkou.`, R`2^1 = 2,\quad 2^2 = 4,\quad 2^3 = 8`],
     [R`Pre $x = 0$ je to vždy 1.`, R`2^0 = 1`],
     [R`Pre záporné $x$ delíš dvojkou.`, R`2^{-1} = \tfrac{1}{2},\quad 2^{-2} = \tfrac{1}{4}`]
   ],
   res:R`Každý krok doprava hodnotu zdvojnásobí, každý krok doľava ju zmenší na polovicu:

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|---|---|
| $2^x$ | $\tfrac14$ | $\tfrac12$ | $1$ | $2$ | $4$ | $8$ |`},
  {tool:"graf", ask:R`Meň základ $\va{a}$. Čo sa stane s grafom, keď prejde cez jednotku?`,
   take:R`pre $a > 1$ funkcia rastie, pre $a < 1$ klesá. Pri $a = 1$ je to vodorovná priamka, preto je jednotka ako základ vylúčená.`,
   cfg:{view:[-5, 8, 5, -2], tick:1, fns:["a^x"], params:{a:A()},
     show:[{pt:[0, 1], color:"b", label:"[0; 1]", at:"tl"}, {pt:[1, "a"], color:"a", label:"[1; {a}]", at:"r"}],
     out:(P, h) => h.big(P.a === 1 ? "y = 1^x = 1" : h.eq(0))
       + (P.a > 1 ? h.pill("a > 1 · rastúca", "up") : P.a < 1 ? h.pill("0 < a < 1 · klesajúca", "down") : h.pill("a = 1 · konštantná", "flat"))
       + h.p(R`Pri kroku o 1 doprava sa hodnota násobí $\va{${h.tn(P.a)}}$.`)}},
  {cards:[
    {fig:{fns:["2^x"], view:[-3, 5, 3, -1]}, t:R`$\va{a} > 1$`, d:"Rastúca. Doprava rastie stále rýchlejšie, doľava sa blíži k nule."},
    {fig:{fns:["0.5^x"], view:[-3, 5, 3, -1]}, t:R`$0 < \va{a} < 1$`, d:"Klesajúca. Doprava sa blíži k nule, doľava rastie."}
  ]},
  R`Funkcie so základmi $a$ a $\dfrac{1}{a}$ spolu úzko súvisia, lebo $\left(\dfrac{1}{a}\right)^x = a^{-x}$.`,
  {tool:"graf", ask:R`Na obrázku sú $y = \va{a}^x$ (čierna) a $y = \left(\tfrac{1}{a}\right)^x$ (modrá). Meň $a$ a sleduj, ako spolu súvisia.`,
   take:R`grafy sú zrkadlovým obrazom podľa osi $y$. Čo robí jedna pre $x$, robí druhá pre $-x$.`,
   cfg:{view:[-5, 8, 5, -2], tick:1, fns:[{f:"a^x", lhs:"y"}, {f:"(1/a)^x", color:"c", lhs:"y"}],
     params:{a:A({min:1.2, max:4})},
     show:[{pt:[0, 1], color:"b"}],
     out:(P, h) => h.calc(`y = \\va{${h.tn(P.a)}}^x`) + h.calc(`\\vc{y = ${h.tn(1 / P.a)}^x}`)
       + h.p(R`$\va{${h.tn(P.a)}}^{2} = ${h.tn(P.a ** 2)}$ a $\vc{${h.tn(1 / P.a)}^{-2} = ${h.tn(P.a ** 2)}}$`)}}
],

"Vlastnosti (kladné hodnoty, bod [0; 1])":[
  "Nech je základ akýkoľvek, všetky exponenciálne funkcie majú niekoľko spoločných vlastností.",
  {cards:[
    {t:"Definičný obor", d:R`$D(f) = \mathbb{R}$. Dosadiť môžeš ľubovoľné číslo.`},
    {t:"Obor hodnôt", d:R`$H(f) = (0;\ \infty)$. Hodnoty sú vždy kladné, nula ani záporné číslo nevyjde nikdy.`},
    {t:R`Bod $[0;\ 1]$`, d:R`$a^0 = 1$ pre každý základ. Tu graf pretína os $y$.`},
    {t:"Prostá", d:R`Je rastúca alebo klesajúca, takže z $a^x = a^y$ vyplýva $x = y$.`}
  ]},
  R`Graf sa k osi $x$ približuje, ale nikdy ju nepretne ani sa jej nedotkne. Os $x$ je jeho **asymptota**.`,
  {tool:"graf", ask:R`Posúvaj $x$ doľava. Dostane sa hodnota $2^x$ niekedy na nulu?`,
   take:R`hodnota sa pri každom kroku doľava zmenší na polovicu. Je stále menšia, ale vždy kladná.`,
   cfg:{view:[-9, 5, 3, -1], tick:[1, 1], free:true, aspect:"4/3", fns:[{f:"2^x", lhs:"f(x)"}],
     params:{s:{v:-2, min:-8, max:2, step:1, color:"a", name:"x"}},
     show:[{drop:["s", "2^s"], color:"soft"}, {pt:["s", "2^s"], color:"a", size:5}],
     out:(P, h) => h.calc(R`2^{\va{${P.s}}} = ${P.s < 0 ? `\\dfrac{1}{${2 ** -P.s}} = ` : ""}${h.tn(2 ** P.s, 5)}`) + h.pill("kladné číslo", "up")}},
  R`Keď k funkcii pripočítaš číslo, celý graf sa posunie zvislo a s ním aj asymptota a obor hodnôt.`,
  {tool:"graf", ask:R`Posúvaj $\vb{c}$ vo funkcii $y = 2^x + c$. Čo sa deje s asymptotou a s oborom hodnôt?`,
   take:R`asymptotou je priamka $y = c$ a obor hodnôt je $(c;\ \infty)$.`,
   cfg:{view:[-6, 7, 5, -5], tick:1, fns:["2^x+c"], params:{c:{v:-2, min:-4, max:3, step:.5, color:"b"}},
     show:[{hline:"c", color:"b"}, {pt:[0, "1+c"], color:"ink", label:"[0; {1+c}]", at:"tl"}],
     out:(P, h) => h.big(P.c === 0 ? "y = 2^x" : h.eq(0)) + h.p(R`Asymptota: $y = \vb{${h.tn(P.c)}}$`) + h.p(R`$H(f) = (\vb{${h.tn(P.c)}};\ \infty)$`)}},
  {ex:R`Urč obor hodnôt funkcie $y = 3^x - 2$ a jej priesečník s osou $y$.`,
   steps:[
     [R`$3^x$ nadobúda všetky kladné hodnoty. Odčítaním 2 sa posunú o 2 nadol.`, R`3^x > 0 \;\Rightarrow\; 3^x - 2 > -2`],
     [R`Priesečník s osou $y$: dosaď $x = 0$.`, R`3^0 - 2 = 1 - 2 = -1`]
   ],
   res:R`$H(f) = (-2;\ \infty)$, priesečník $[0;\ -1]$.`},
  {ex:R`Bez kalkulačky rozhodni, ktoré číslo je väčšie: $0{,}7^5$ alebo $0{,}7^3$.`,
   steps:[
     [R`Základ $0{,}7$ je menší ako 1, funkcia $y = 0{,}7^x$ je klesajúca.`, R`0 < 0{,}7 < 1`],
     ["Pri klesajúcej funkcii patrí väčšiemu exponentu menšia hodnota.", R`5 > 3 \;\Rightarrow\; 0{,}7^5 < 0{,}7^3`]
   ],
   res:R`Väčšie je $0{,}7^3$.`},
  {tip:"To, že exponenciálna funkcia je prostá, je základ riešenia exponenciálnych rovníc: keď dostaneš na oboch stranách rovnaký základ, porovnáš exponenty. Viac v téme [[b2]].", label:"Súvislosť"}
],

"Exponenciálny rast a pokles v úlohách":[
  R`Ak sa veličina za každé rovnako dlhé obdobie zmení o rovnaké **percento**, rastie alebo klesá exponenciálne. Pri lineárnom raste sa mení o rovnakú **hodnotu**.`,
  {def:"Exponenciálny model", tex:R`N(t) = \vb{N_0} \cdot \va{a}^{\,t}`, legend:[
    ["N_0", "b", "začiatočná hodnota", "Hodnota v čase $t = 0$."],
    ["a", "a", "rastový činiteľ", "Čím sa hodnota za jedno obdobie násobí. Pri raste o $p\\,\\%$ je $a = 1 + \\frac{p}{100}$, pri poklese $a = 1 - \\frac{p}{100}$."]
  ]},
  {map:[
    ["„Rastie o 5 % ročne.“", "pripočítaj percentá k jednotke", R`\va{a} = 1{,}05`],
    ["„Klesá o 12 % ročne.“", "odpočítaj percentá od jednotky", R`\va{a} = 0{,}88`],
    ["„Každú hodinu sa zdvojnásobí.“", "", R`\va{a} = 2`],
    ["„Za 8 dní klesne na polovicu.“", "polčas rozpadu", R`\va{a} = \tfrac{1}{2} \text{ za 8 dní}`]
  ]},
  {ex:"Mesto má 20 000 obyvateľov a ich počet rastie o 5 % ročne. Zapíš počet obyvateľov ako funkciu času a vypočítaj, koľko ich bude o 10 rokov.",
   steps:[
     ["Začiatočná hodnota a rastový činiteľ.", R`\vb{N_0} = 20\,000,\qquad \va{a} = 1 + \tfrac{5}{100} = 1{,}05`],
     ["Funkcia.", R`N(t) = 20\,000 \cdot 1{,}05^{\,t}`],
     [R`Dosaď $t = 10$.`, R`N(10) = 20\,000 \cdot 1{,}05^{10} \doteq 20\,000 \cdot 1{,}6289 \doteq 32\,578`]
   ],
   res:"O 10 rokov približne **32 600** obyvateľov."},
  {tool:"graf", ask:R`Začíname so 100 kusmi. Meň ročnú zmenu v percentách a čas. Za koľko rokov sa pri raste o 10 % počet zdvojnásobí?`,
   take:"pri raste o 10 % sa počet zdvojnásobí približne za 7 rokov a potom znova za ďalších 7. Čas zdvojnásobenia nezávisí od toho, s akou hodnotou začínaš.",
   cfg:{view:[-2.5, 430, 21, -50], tick:[5, 100], free:true, axes:["roky", "počet"], aspect:"4/3",
     fns:[{f:"100*(1+p/100)^x", dom:[0, 20], lhs:"N(t)"}, {f:"200", color:"axis", dash:true, thin:true, ghost:true}],
     params:{p:{v:10, min:-20, max:20, step:1, color:"a", name:"p", note:"% ročne"}, t:{v:5, min:0, max:20, step:1, color:"d", name:"t", note:"roky"}},
     show:[{drop:["t", "100*(1+p/100)^t"], color:"d"}, {pt:["t", "100*(1+p/100)^t"], color:"d", size:5}, {pt:[0, 100], color:"b", size:3.5}],
     out:(P, h) => h.calc(R`\va{a} = 1 ${P.p < 0 ? "-" : "+"} \tfrac{${Math.abs(P.p)}}{100} = \va{${h.tn(1 + P.p / 100)}}`)
       + h.calc(R`N(\vd{${P.t}}) = 100 \cdot \va{${h.tn(1 + P.p / 100)}}^{\vd{${P.t}}} \doteq ${h.tn(100 * (1 + P.p / 100) ** P.t, 1)}`)
       + (P.p > 0 ? h.pill("rast", "up") : P.p < 0 ? h.pill("pokles", "down") : h.pill("bez zmeny", "flat"))}},
  R`Exponenciálny rast je spočiatku nenápadný, ale lineárny rast vždy predbehne.`,
  {tool:"graf", ask:R`Čierna rastie o 10 kusov ročne, modrá o 10 % ročne. Obe začínajú na 100. Posúvaj čas a porovnávaj.`,
   take:"prvých pár rokov sú takmer rovnaké. Potom sa exponenciálna krivka odtrhne, lebo 10 % sa počíta zo stále väčšieho čísla.",
   cfg:{view:[-3, 1250, 27, -130], tick:[5, 200], free:true, axes:["roky", "počet"], aspect:"4/3",
     fns:[{f:"100+10x", dom:[0, 25], lhs:"L(t)"}, {f:"100*1.1^x", color:"c", dom:[0, 25], lhs:"E(t)"}],
     params:{t:{v:5, min:0, max:25, step:1, color:"d", name:"t", note:"roky"}},
     show:[{pt:["t", "100+10t"], color:"ink", size:5}, {pt:["t", "100*1.1^t"], color:"c", size:5}, {vline:"t", color:"soft"}],
     out:(P, h) => h.p(R`Lineárne: $100 + 10 \cdot ${P.t} = ${h.tn(100 + 10 * P.t)}$`)
       + h.p(R`Exponenciálne: $\vc{100 \cdot 1{,}1^{${P.t}} \doteq ${h.tn(100 * 1.1 ** P.t, 0)}}$`)
       + h.p(R`Rozdiel: $${h.tn(100 * 1.1 ** P.t - 100 - 10 * P.t, 0)}$`)}},
  {ex:"Rádioaktívna látka má polčas rozpadu 8 dní. Na začiatku jej je 80 g. Koľko jej zostane po 24 dňoch?",
   steps:[
     ["Koľko polčasov uplynie za 24 dní?", R`24 : 8 = 3`],
     ["Po každom polčase zostane polovica.", R`80 \cdot \left(\tfrac{1}{2}\right)^3 = 80 \cdot \tfrac{1}{8} = 10`]
   ],
   res:"Zostane **10 g**."},
  {warn:R`Rast o 5 % ročne počas 10 rokov nie je spolu 50 %. Percentá sa počítajú vždy z novej, väčšej hodnoty: $1{,}05^{10} \doteq 1{,}629$, teda rast o 62,9 %.`}
]

  }
};
})();

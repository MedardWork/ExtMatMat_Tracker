/* Pojem funkcie, definičný obor, obor hodnôt, graf */
(() => {
const F = "0.5x^2-x-1.5";                      /* the curve used for reading from a graph: roots −1 and 3, vertex [1; −2] */
const f = x => .5 * x * x - x - 1.5;

THEORY.a18 = {
  mins:20,
  brief:[
    R`**Funkcia** priradí každému $x$ z definičného oboru **práve jedno** $y$. Zapisuje sa $y = f(x)$.`,
    R`**Definičný obor** $D(f)$: všetky $x$, pre ktoré má predpis zmysel. Menovateľ $\neq 0$, pod párnou odmocninou $\geq 0$, v logaritme $> 0$.`,
    R`**Obor hodnôt** $H(f)$: všetky $y$, ktoré funkcia nadobúda. Na grafe je to jeho priemet na os $y$.`,
    R`**Graf** tvoria body $[x;\ f(x)]$. Hodnotu $f(a)$ čítaš zvislo od $a$, riešenia $f(x) = c$ sú priesečníky s priamkou $y = c$.`
  ],
  subs:{

"Pojem funkcie":[
  R`**Funkcia** je pravidlo, ktoré každému číslu $x$ z nejakej množiny priradí **práve jedno** číslo $y$. Číslo $x$ si volíš, preto sa volá nezávisle premenná. Číslo $y$ z neho vyplynie.`,
  {def:"Zápis funkcie", tex:R`y = f(x)`, legend:[
    ["x", "a", "nezávisle premenná", "Vstup. To, čo do funkcie dosadzuješ."],
    ["f(x)", "b", "hodnota funkcie", "Výstup. Jediné číslo, ktoré k danému $x$ patrí."]
  ]},
  {tool:"graf", ask:R`Posúvaj $\va{x}$. Koľko hodnôt $\vb{y}$ patrí jednému $x$?`,
   take:R`ku každému $x$ patrí presne jeden bod grafu, teda jedna hodnota. Zápis $f(2) = 3$ znamená: pre vstup 2 je výstup 3.`,
   cfg:{view:[-5, 7, 5, -3], tick:1, fns:[{f:"x^2-1", lhs:"f(x)"}],
     params:{s:{v:2, min:-2.5, max:2.5, step:.5, color:"a", name:"x"}},
     show:[{drop:["s", "s^2-1"], color:"soft"}, {pt:["s", 0], color:"a", size:4}, {pt:[0, "s^2-1"], color:"b", size:4},
           {pt:["s", "s^2-1"], color:"ink", label:"[{s}; {s^2-1}]", at:"r"}],
     out:(P, h) => h.big(R`f(x) = x^2 - 1`)
       + h.calc(R`f(\va{${h.tn(P.s)}}) = ${P.s < 0 ? `(\\va{${h.tn(P.s)}})` : `\\va{${h.tn(P.s)}}`}^2 - 1 = \vb{${h.tn(P.s * P.s - 1)}}`)}},
  {cards:[
    {t:"Predpisom", d:"Vzorec, podľa ktorého sa $y$ počíta.", tex:R`y = 2x + 1`},
    {t:"Tabuľkou", d:"Vypísané dvojice $x$ a $y$. Hodí sa pre namerané údaje."},
    {t:"Grafom", d:"Krivka zložená z bodov $[x;\\ f(x)]$."},
    {t:"Slovne", d:"„Každému číslu priraď jeho dvojnásobok zväčšený o jeden.“"}
  ]},
  R`Slová „práve jedno“ sú podstatné. Krivka, na ktorej jednému $x$ patria dve rôzne $y$, grafom funkcie nie je. Overíš to zvislou priamkou: ak niekde pretne krivku viac než raz, o funkciu nejde.`,
  {tool:"graf", ask:"Posúvaj zvislú priamku cez kružnicu. Koľkokrát ju pretne?",
   take:R`zvislá priamka pretína kružnicu v dvoch bodoch, takže jednému $x$ patria dve hodnoty $y$. Kružnica nie je grafom funkcie.`,
   cfg:{view:[-5, 5, 5, -5], tick:1, fns:[],
     params:{s:{v:1, min:-4, max:4, step:.5, color:"a", name:"x"}},
     show:[{curve:["3cos(t)", "3sin(t)"], t:[0, 6.2832], color:"ink"}, {vline:"s", color:"a"},
           {pt:["s", "sqrt(9-s^2)"], color:"b", if:P => Math.abs(P.s) <= 3}, {pt:["s", "-sqrt(9-s^2)"], color:"b", if:P => Math.abs(P.s) < 3}],
     out:(P, h) => {
       const n = Math.abs(P.s) < 3 ? 2 : Math.abs(P.s) === 3 ? 1 : 0, y = Math.sqrt(Math.max(0, 9 - P.s * P.s));
       return h.p(R`Pre $\va{x = ${h.tn(P.s)}}$:`)
         + (n === 2 ? h.p(R`$\vb{y = ${h.tn(y)}}$ aj $\vb{y = ${h.tn(-y)}}$`) + h.pill("dve hodnoty · nie je funkcia", "down")
           : n === 1 ? h.p(R`$\vb{y = 0}$, priamka sa kružnice len dotýka.`) : h.p("Priamka kružnicu nepretína."));
     }}},
  {ex:R`Tabuľka priraďuje číslam $x$ čísla $y$. Je to funkcia?

| $x$ | 1 | 2 | 3 | 2 |
|---|---|---|---|---|
| $y$ | 5 | 6 | 7 | 8 |`,
   steps:[
     [R`Hľadaj $x$, ktoré sa v tabuľke opakuje.`, R`x = 2 \text{ je tam dvakrát}`],
     [R`Porovnaj hodnoty, ktoré mu patria.`, R`y = 6 \quad\text{a}\quad y = 8`]
   ],
   res:R`Nie je. Číslu $x = 2$ patria dve rôzne hodnoty.`},
  {ex:R`Funkcia je daná predpisom $f(x) = 3x - 2$. Vypočítaj $f(4)$ a zisti, pre ktoré $x$ je $f(x) = 7$.`,
   steps:[
     ["Hodnota funkcie: dosaď za $x$.", R`f(4) = 3 \cdot 4 - 2 = 10`],
     [R`Opačná otázka: polož predpis rovný 7 a vyrieš rovnicu.`, R`3x - 2 = 7 \;\Rightarrow\; x = 3`]
   ],
   res:R`$f(4) = 10$ a $f(x) = 7$ pre $x = 3$.`},
  {warn:R`Opačne to nevadí: dvom rôznym $x$ môže patriť to isté $y$. Pre $f(x) = x^2$ je $f(2) = f(-2) = 4$ a je to stále funkcia.`}
],

"Definičný obor":[
  R`**Definičný obor** $D(f)$ je množina všetkých $x$, ktoré smieš do funkcie dosadiť. Ak ho zadanie neuvádza, hľadáš najväčšiu množinu, pre ktorú má predpis zmysel.`,
  "Pri funkciách z maturity ho obmedzujú tri veci:",
  {cards:[
    {t:"Zlomok", d:"Menovateľ nesmie byť nula.", tex:R`\dfrac{1}{x - 3}:\quad x \neq 3`},
    {t:"Párna odmocnina", d:"Výraz pod ňou nesmie byť záporný.", tex:R`\sqrt{x - 2}:\quad x \geq 2`},
    {t:"Logaritmus", d:"Argument musí byť kladný.", tex:R`\log(x + 1):\quad x > -1`}
  ]},
  {tool:"graf", ask:R`Posúvaj $\va{p}$. Kde graf začína a prečo naľavo od toho bodu nie je nič?`,
   take:R`pod odmocninou musí byť nezáporné číslo. Pre $x < p$ by tam bolo záporné, preto tam funkcia neexistuje.`,
   cfg:{view:[-5, 5, 7, -3], tick:1, fns:["sqrt(x-p)"],
     params:{p:{v:2, min:-3, max:4, step:.5, color:"a"}},
     show:[{seg:[["p", 0], [7, 0]], color:"a", w:5}, {pt:["p", 0], color:"a", label:"{p}", at:"b"}],
     out:(P, h) => h.big(h.eq(0)) + h.calc(R`x - ${P.p < 0 ? `(\\va{${h.tn(P.p)}})` : `\\va{${h.tn(P.p)}}`} \geq 0 \;\Rightarrow\; x \geq \va{${h.tn(P.p)}}`)
       + h.p(R`$D(f) = \langle \va{${h.tn(P.p)}};\ \infty)$`)}},
  {tool:"graf", ask:R`Posúvaj $\va{p}$. Ktoré jediné číslo do funkcie dosadiť nemôžeš?`,
   take:R`pre $x = p$ by bol menovateľ nula. Graf sa k tejto zvislej priamke z oboch strán približuje, ale nikdy sa jej nedotkne.`,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:["1/(x-p)"],
     params:{p:{v:1, min:-4, max:4, step:.5, color:"a"}},
     show:[{vline:"p", color:"a"}, {pt:["p", 0], color:"a", open:true, label:"{p}", at:"bl"}],
     out:(P, h) => h.big(h.eq(0)) + h.calc(R`x - ${P.p < 0 ? `(\\va{${h.tn(P.p)}})` : `\\va{${h.tn(P.p)}}`} \neq 0 \;\Rightarrow\; x \neq \va{${h.tn(P.p)}}`)
       + h.p(R`$D(f) = \mathbb{R} \setminus \{\va{${h.tn(P.p)}}\}$`)}},
  "Keď je v predpise viac obmedzení naraz, musia platiť všetky súčasne. Definičný obor je ich prienik.",
  {ex:R`Urč definičný obor funkcie $f(x) = \dfrac{\sqrt{x - 2}}{x - 5}$.`,
   steps:[
     ["Odmocnina: výraz pod ňou nesmie byť záporný.", R`x - 2 \geq 0 \;\Rightarrow\; x \geq 2`],
     ["Zlomok: menovateľ nesmie byť nula.", R`x - 5 \neq 0 \;\Rightarrow\; x \neq 5`],
     ["Obe podmienky naraz: všetko od 2, okrem 5.", R`D(f) = \langle 2;\ 5) \cup (5;\ \infty)`]
   ],
   res:R`$D(f) = \langle 2;\ 5) \cup (5;\ \infty)$`,
   fig:{tool:"graf", cfg:{view:[-1, 5, 10, -5], tick:1, fns:[{f:"sqrt(x-2)/(x-5)", lhs:"f(x)"}],
     show:[{seg:[[2, 0], [10, 0]], color:"a", w:5}, {vline:5, color:"a"}, {pt:[2, 0], color:"a"}, {pt:[5, 0], color:"a", open:true}],
     out:(P, h) => h.p("Fialová časť osi $x$ je definičný obor. Plný bod do neho patrí, prázdny nie.")}}},
  {warn:R`Na zátvorkách záleží. Hranatá $\langle 2$ znamená, že 2 do množiny patrí. Okrúhla $(5$ znamená, že 5 nepatrí. Pri $\infty$ je vždy okrúhla.`},
  {tip:"V slovných úlohách obmedzuje definičný obor aj realita: dĺžka musí byť kladná, počet kusov je prirodzené číslo, čas nemôže byť záporný."}
],

"Obor hodnôt":[
  R`**Obor hodnôt** $H(f)$ je množina všetkých čísel $y$, ktoré funkcia naozaj nadobúda. Na grafe ho uvidíš, keď si graf v duchu premietneš na os $y$.`,
  {tool:"graf", ask:R`Posúvaj $\vb{n}$. Ktoré hodnoty $y$ funkcia nikdy nenadobudne?`,
   take:R`parabola otvorená nahor nejde pod svoj vrchol. Obor hodnôt začína jeho druhou súradnicou.`,
   cfg:{view:[-5, 7, 5, -4], tick:1, fns:["x^2+n"],
     params:{n:{v:1, min:-3, max:4, step:.5, color:"b"}},
     show:[{seg:[[0, "n"], [0, 7]], color:"b", w:5}, {pt:[0, "n"], color:"b", label:"{n}", at:"r"}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`Najmenšia hodnota je $\vb{${h.tn(P.n)}}$ (pre $x = 0$).`) + h.p(R`$H(f) = \langle \vb{${h.tn(P.n)}};\ \infty)$`)}},
  R`Obor hodnôt závisí aj od definičného oboru. Keď funkciu obmedzíš len na časť čísel, môže stratiť niektoré hodnoty.`,
  {tool:"graf", ask:R`Funkcia $y = x^2$ je tu definovaná len na intervale $\langle \va{l};\ 2\rangle$. Posúvaj jeho ľavý koniec a sleduj obor hodnôt.`,
   take:R`najmenšia hodnota nemusí byť na kraji intervalu. Ak interval obsahuje nulu, minimum je vo vrchole.`,
   cfg:{view:[-4, 10, 4, -2], tick:1, fns:[{f:"x^2", dom:["l", 2]}, {f:"x^2", color:"axis", dash:true, thin:true, ghost:true}],
     params:{l:{v:-1, min:-3, max:1.5, step:.5, color:"a"}},
     show:[{seg:[["l", 0], [2, 0]], color:"a", w:5},
           {seg:[[0, P => P.l <= 0 ? 0 : P.l * P.l], [0, P => Math.max(P.l * P.l, 4)]], color:"b", w:5},
           {pt:["l", "l^2"], color:"ink"}, {pt:[2, 4], color:"ink"}],
     out:(P, h) => {
       const lo = P.l <= 0 ? 0 : P.l * P.l, hi = Math.max(P.l * P.l, 4);
       return h.p(R`$D(f) = \langle \va{${h.tn(P.l)}};\ \va{2}\rangle$`) + h.p(R`$H(f) = \langle \vb{${h.tn(lo)}};\ \vb{${h.tn(hi)}}\rangle$`)
         + h.p(P.l <= 0 ? "Interval obsahuje nulu, minimum je vo vrchole." : "Nula v intervale nie je, minimum je na ľavom kraji.");
     }}},
  {ex:R`Urč obor hodnôt funkcií $f(x) = -x^2 + 4$ a $g(x) = 2x - 1$ pre $x \in \langle 0;\ 3\rangle$.`,
   steps:[
     [R`$f$: parabola otvorená nadol s vrcholom $[0;\ 4]$. Nad vrchol nejde, nadol pokračuje bez obmedzenia.`, R`H(f) = (-\infty;\ 4\rangle`],
     [R`$g$: rastúca priamka, stačia hodnoty na krajoch intervalu.`, R`g(0) = -1,\qquad g(3) = 5`],
     ["Medzi nimi nadobudne všetky hodnoty.", R`H(g) = \langle -1;\ 5\rangle`]
   ],
   res:R`$H(f) = (-\infty;\ 4\rangle$, $H(g) = \langle -1;\ 5\rangle$`},
  {tip:"Obor hodnôt sa z predpisu určuje ťažšie než definičný obor. Skoro vždy pomôže načrtnúť si graf."}
],

"Graf funkcie a čítanie z grafu":[
  R`**Graf** funkcie je množina všetkých bodov $[x;\ f(x)]$. Prvá súradnica je vstup, druhá výstup. Z grafu vieš prečítať to isté čo z predpisu, len bez počítania.`,
  {cards:[
    {t:R`Hodnota $f(a)$`, d:"Od čísla $a$ na osi $x$ choď zvislo ku grafu a odtiaľ vodorovne na os $y$."},
    {t:R`Rovnica $f(x) = c$`, d:"Nakresli vodorovnú priamku $y = c$. Riešenia sú prvé súradnice priesečníkov."},
    {t:"Nulové body", d:"Miesta, kde graf pretína os $x$. Sú to riešenia $f(x) = 0$."},
    {t:"Znamienko", d:"Kde je graf nad osou $x$, je $f(x) > 0$. Kde je pod ňou, je $f(x) < 0$."}
  ]},
  {tool:"graf", ask:R`Posúvaj $\va{x}$ a čítaj hodnoty z grafu. Koľko je $f(3)$? A $f(-2)$?`,
   take:R`hodnotu čítaš vždy v tomto poradí: z osi $x$ zvislo ku grafu, potom vodorovne na os $y$.`,
   cfg:{view:[-5, 7, 7, -4], tick:1, fns:[{f:F, lhs:"f(x)"}],
     params:{s:{v:2, min:-3, max:5, step:.5, color:"a", name:"x"}},
     show:[{drop:["s", P => f(P.s)], color:"soft"}, {pt:["s", 0], color:"a", size:4}, {pt:[0, P => f(P.s)], color:"b", size:4}, {pt:["s", P => f(P.s)], color:"ink"}],
     out:(P, h) => h.calc(R`f(\va{${h.tn(P.s)}}) = \vb{${h.tn(f(P.s))}}`) + h.p(R`Bod grafu: $[\va{${h.tn(P.s)}};\ \vb{${h.tn(f(P.s))}}]$`)}},
  {tool:"graf", ask:R`Posúvaj vodorovnú priamku $y = \vb{c}$. Koľko riešení má rovnica $f(x) = c$?`,
   take:R`počet riešení je počet priesečníkov. Môžu byť dva, jeden (priamka sa grafu dotýka vo vrchole) alebo žiadny.`,
   cfg:{view:[-5, 7, 7, -4], tick:1, fns:[{f:F, lhs:"f(x)"}, {f:"c", color:"b", ghost:true}],
     params:{c:{v:2.5, min:-3.5, max:6, step:.5, color:"b"}},
     show:[{meet:[0, 1], color:"b", at:"t"}],
     out:(P, h) => {
       const m = h.scan().meets;
       return h.calc(R`f(x) = \vb{${h.tn(P.c)}}`) + (m.length
         ? h.p(`Riešenia: ${m.map(p => `$x = ${h.tn(p.x)}$`).join(", ")}`) + h.pill(m.length === 2 ? "dve riešenia" : "jedno riešenie", m.length === 2 ? "up" : "flat")
         : h.pill("žiadne riešenie", "down") + h.p("Priamka leží pod najnižším bodom grafu."));
     }}},
  {ex:R`Na obrázku je graf funkcie $f$. Urč $f(0)$, nulové body, najmenšiu hodnotu a všetky $x$, pre ktoré je $f(x) < 0$.`,
   steps:[
     [R`$f(0)$: kde graf pretína os $y$.`, R`f(0) = -1{,}5`],
     ["Nulové body: kde graf pretína os $x$.", R`x = -1 \quad\text{a}\quad x = 3`],
     ["Najmenšia hodnota: najnižší bod grafu.", R`-2 \ \text{pre}\ x = 1`],
     [R`$f(x) < 0$: kde je graf pod osou $x$, teda medzi nulovými bodmi.`, R`x \in (-1;\ 3)`]
   ],
   res:R`$f(0) = -1{,}5$; nulové body $-1$ a $3$; minimum $-2$; $f(x) < 0$ pre $x \in (-1;\ 3)$.`,
   fig:{tool:"graf", cfg:{view:[-3.5, 5, 5.5, -4], tick:1,
     fns:[{f:F, dom:[-4, -1], color:"ok", ghost:true}, {f:F, dom:[-1, 3], color:"warn", ghost:true}, {f:F, dom:[3, 6], color:"ok", ghost:true}],
     show:[{pt:[-1, 0], color:"c"}, {pt:[3, 0], color:"c"}, {pt:[1, -2], color:"a", label:"[1; −2]", at:"b"}, {pt:[0, -1.5], color:"b"}],
     out:(P, h) => h.p("Zelená: $f(x) > 0$. Červená: $f(x) < 0$.")}}},
  {warn:R`Bod grafu má súradnice $[x;\ f(x)]$, v tomto poradí. $f(2) = 5$ znamená bod $[2;\ 5]$, nie $[5;\ 2]$.`}
]

  }
};
})();

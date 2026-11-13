/* Mnohočleny: stupeň, počet reálnych koreňov, polynomická funkcia */
(() => {
const pl = (v, h, c) => v === 0 ? "" : ` ${v < 0 ? "-" : "+"} \\${c}{${h.tn(Math.abs(v))}}`;   /* + q after a term */
const fac = (r, h, c) => `(x ${r < 0 ? "+" : "-"} \\${c}{${h.tn(Math.abs(r))}})`.replace(/\(x - \\v.\{0\}\)/, "x");
const count = f => findRoots(f, -20, 20).length;
const P3 = x => x ** 3 - 2 * x ** 2 - 5 * x + 6;

THEORY.b15 = {
  mins:25,
  brief:[
    R`Mnohočlen $P(x) = a_n x^n + \dots + a_1 x + a_0$, $a_n \neq 0$, má **stupeň** $n$ (najvyšší exponent).`,
    R`Mnohočlen stupňa $n$ má **najviac $n$** reálnych koreňov. Ak je $n$ nepárne, aspoň jeden má vždy.`,
    R`$P(c) = 0$ práve vtedy, keď $P(x)$ je deliteľný $(x - c)$. Zvyšok po delení $(x - c)$ je $P(c)$.`,
    R`Konce grafu určí člen $a_n x^n$. Pri jednoduchom koreni graf os $x$ pretne, pri dvojnásobnom sa jej len dotkne.`
  ],
  subs:{

"Stupeň a počet koreňov":[
  R`**Mnohočlen** (polynóm) je súčet násobkov mocnín $x$ s prirodzenými exponentmi. Lineárna a kvadratická funkcia sú jeho najjednoduchšie prípady.`,
  {def:"Mnohočlen stupňa n", tex:R`P(x) = \va{a_n}x^{\vb{n}} + a_{n-1}x^{n-1} + \dots + a_1x + \vd{a_0}`, note:R`kde $a_n \neq 0$`, legend:[
    ["n", "b", "stupeň", "Najvyšší exponent, pri ktorom je nenulový koeficient."],
    ["a_n", "a", "vedúci koeficient", "Koeficient pri najvyššej mocnine."],
    ["a_0", "d", "absolútny člen", "Hodnota $P(0)$, priesečník grafu s osou $y$."]
  ]},
  R`**Koreň** mnohočlena je číslo $c$, pre ktoré $P(c) = 0$. Na grafe je to nulový bod, priesečník s osou $x$. O ich počte hovorí jednoduché pravidlo:`,
  {def:"Počet koreňov", mid:true, tex:R`\text{stupeň } n \;\Rightarrow\; \text{najviac } n \text{ reálnych koreňov}`, note:R`Pre nepárne $n$ je aspoň jeden, lebo graf ide z $-\infty$ do $+\infty$ a os $x$ musí pretnúť.`},
  {tool:"graf", ask:R`Posúvaj $\vd{q}$ vo funkcii $y = x^3 - 3x + q$. Koľko koreňov môže mať mnohočlen 3. stupňa? Môže mať nula?`,
   take:R`jeden, dva (keď sa graf osi dotkne) alebo tri. Nula nikdy: krivka 3. stupňa vždy prejde zdola nahor.`,
   cfg:{view:[-4, 6, 4, -6], tick:1, fns:[{f:"x^3-3x+q", lhs:"y"}],
     params:{q:{v:0, min:-4, max:4, step:.5, color:"d"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => { const n = count(x => x ** 3 - 3 * x + P.q);
       return h.big(`y = x^3 - 3x${pl(P.q, h, "vd")}`) + h.p(`Počet reálnych koreňov: **${n}**`) + h.pill(n === 3 ? "maximum pre 3. stupeň" : n === 2 ? "dotyk: jeden koreň je dvojnásobný" : "jeden koreň", n === 3 ? "up" : "flat"); }}},
  {cards:[
    {fig:{fns:["x-1"], view:[-3, 3, 3, -3]}, t:"1. stupeň", d:"Priamka. Vždy práve **1** koreň."},
    {fig:{fns:["x^2-2", "x^2+1"], view:[-3, 3, 3, -3]}, t:"2. stupeň", d:"Parabola. **0, 1 alebo 2** korene."},
    {fig:{fns:["x^3-3x", "x^3+1"], view:[-3, 3, 3, -3]}, t:"3. stupeň", d:"**1, 2 alebo 3** korene, nikdy 0."},
    {fig:{fns:["x^4-3x^2+1", "x^4+0.5"], view:[-2.5, 3, 2.5, -2]}, t:"4. stupeň", d:"**0 až 4** korene."}
  ]},

  {h:"Súčinový tvar"},
  R`Ak poznáš všetky korene, mnohočlen sa dá zapísať ako súčin. Z neho sa korene čítajú priamo: súčin je nula, keď je nula niektorý činiteľ.`,
  {def:"Rozklad na koreňové činitele", tex:R`P(x) = \va{a_n}(x - x_1)(x - x_2) \cdots (x - x_n)`, note:R`Ak sa činiteľ opakuje, napríklad $(x - 2)^2$, je $2$ **dvojnásobný** koreň.`},
  {tool:"graf", ask:R`Posúvaj korene $\vb{p}$, $\vd{q}$, $\vc{r}$. Čo sa stane s grafom, keď dva z nich splynú?`,
   take:R`keď dva korene splynú, graf sa osi $x$ v tom bode len dotkne. Taký koreň je dvojnásobný a počíta sa dvakrát.`,
   cfg:{view:[-5, 8, 5, -8], tick:1, fns:[{f:"(x-p)*(x-q)*(x-r)", lhs:"y"}],
     params:{p:{v:-2, min:-4, max:4, step:.5, color:"b"}, q:{v:1, min:-4, max:4, step:.5, color:"d"}, r:{v:3, min:-4, max:4, step:.5, color:"c"}},
     show:[{pt:["p", 0], color:"b"}, {pt:["q", 0], color:"d"}, {pt:["r", 0], color:"c"}],
     out:(P, h) => { const n = new Set([P.p, P.q, P.r]).size;
       return h.big(`y = ${fac(P.p, h, "vb")}${fac(P.q, h, "vd")}${fac(P.r, h, "vc")}`)
         + h.p(`Rôznych koreňov: **${n}**`) + (n < 3 ? h.pill("niektorý koreň je násobný", "flat") : ""); }}},
  {ex:R`Nájdi korene mnohočlena $P(x) = x^3 - 4x$.`,
   steps:[
     [R`Vyber $x$ pred zátvorku.`, R`x^3 - 4x = x(x^2 - 4)`],
     ["Rozlož rozdiel štvorcov.", R`x(x - 2)(x + 2)`],
     ["Súčin je nula, keď je nula niektorý činiteľ.", R`x = 0,\quad x = 2,\quad x = -2`]
   ],
   res:R`Tri korene: $-2$, $0$, $2$. Viac ich mnohočlen 3. stupňa mať nemôže.`},
  {ex:R`Vyrieš rovnicu $x^4 - 5x^2 + 4 = 0$.`,
   steps:[
     [R`Sú tam len párne mocniny. Substitúcia $t = x^2$.`, R`t^2 - 5t + 4 = 0`],
     ["Kvadratická rovnica.", R`(t - 1)(t - 4) = 0 \;\Rightarrow\; t = 1,\ t = 4`],
     [R`Späť k $x$: $x^2 = 1$ alebo $x^2 = 4$.`, R`x = \pm 1,\quad x = \pm 2`]
   ],
   res:R`Štyri korene $-2$, $-1$, $1$, $2$. Maximum pre 4. stupeň.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{q}$ tak, aby mal mnohočlen $x^3 - 3x + q$ práve **dva** rôzne reálne korene.`,
   hint:R`Dva korene vzniknú, keď sa graf osi $x$ dotkne vrcholom. Vrcholy sú pri $x = \pm 1$ a majú hodnoty $q - 2$ a $q + 2$.`,
   goal:P => Math.abs(P.q) === 2,
   cfg:{view:[-4, 6, 4, -6], tick:1, fns:[{f:"x^3-3x+q", lhs:"y"}],
     params:{q:{v:1, min:-4, max:4, step:.5, color:"d"}},
     show:[{pt:[-1, "q+2"], color:"d", size:3.5}, {pt:[1, "q-2"], color:"d", size:3.5}],
     out:(P, h) => h.big(`y = x^3 - 3x${pl(P.q, h, "vd")}`) + (Math.abs(P.q) === 2 ? h.pill("✓ Práve dva korene, jeden dvojnásobný", "ok")
       : h.p(`Počet koreňov: **${count(x => x ** 3 - 3 * x + P.q)}**`))}},
  {warn:R`Pri riešení $x^3 = 4x$ nedeľ obe strany $x$. Stratíš koreň $x = 0$. Správne: $x^3 - 4x = 0$ a vyber $x$ pred zátvorku.`}
],

"Delenie mnohočlenov":[
  R`Mnohočleny sa dajú deliť podobne ako čísla pod sebou. Výsledkom je podiel a zvyšok, ktorého stupeň je menší ako stupeň deliteľa.`,
  {def:"Delenie so zvyškom", mid:true, tex:R`P(x) = D(x) \cdot Q(x) + R(x)`, note:R`$P$ delenec, $D$ deliteľ, $Q$ podiel, $R$ zvyšok so stupňom menším ako $D$.`},
  {steps:[
    {t:"Vydeľ vedúce členy", d:"Najvyšší člen delenca vydeľ najvyšším členom deliteľa. To je prvý člen podielu."},
    {t:"Vynásob a odčítaj", d:"Prvý člen podielu vynásob celým deliteľom a výsledok odčítaj od delenca."},
    {t:"Opakuj", d:"So zvyškom urob to isté, kým nemá menší stupeň ako deliteľ."}
  ]},
  {ex:R`Vydeľ $(x^3 - 2x^2 - 5x + 6) : (x - 1)$.`,
   steps:[
     [R`$x^3 : x = x^2$. Vynásob a odčítaj.`, R`(x^3 - 2x^2) - (x^3 - x^2) = -x^2`],
     [R`Pripíš $-5x$. Potom $-x^2 : x = -x$.`, R`(-x^2 - 5x) - (-x^2 + x) = -6x`],
     [R`Pripíš $+6$. Potom $-6x : x = -6$.`, R`(-6x + 6) - (-6x + 6) = 0`]
   ],
   res:R`$(x^3 - 2x^2 - 5x + 6) : (x - 1) = x^2 - x - 6$, zvyšok 0. Ďalej $x^2 - x - 6 = (x - 3)(x + 2)$, takže korene sú $1$, $3$, $-2$.`},
  R`Keď delíš dvojčlenom $(x - c)$, zvyšok je len číslo. Dosaď do rovnosti $x = c$: člen s podielom zmizne a zostane $P(c) = R$. Preto je $c$ koreň práve vtedy, keď delenie vyjde bez zvyšku.`,
  {def:"Zvyšková veta", mid:true, tex:R`P(x) : (x - \vb{c}) \text{ má zvyšok } P(\vb{c}) \qquad P(\vb{c}) = 0 \iff (x - \vb{c}) \mid P(x)`},
  {tool:"graf", ask:R`$P(x) = x^3 - 2x^2 - 5x + 6$. Skúšaj celé čísla $\vb{c}$. Pre ktoré je zvyšok po delení $(x - c)$ nulový?`,
   take:R`pre $c = -2$, $1$ a $3$. Všetky sú deliteľmi absolútneho člena 6, a to nie je náhoda.`,
   cfg:{view:[-4, 20, 5, -26], tick:[1, 5], free:true, aspect:"4/3", fns:[{f:"x^3-2x^2-5x+6", lhs:"P(x)"}],
     params:{c:{v:0, min:-3, max:4, step:1, color:"b"}},
     show:[{drop:["c", "c^3-2c^2-5c+6"], color:"b"}, {pt:["c", "c^3-2c^2-5c+6"], color:"b", size:5}],
     out:(P, h) => h.calc(R`P(\vb{${P.c}}) = ${h.tn(P3(P.c))}`) + h.p(`Zvyšok po delení $(${P.c ? `x ${P.c < 0 ? "+" : "-"} \\vb{${Math.abs(P.c)}}` : "x"})$ je $${h.tn(P3(P.c))}$.`)
       + (P3(P.c) === 0 ? h.pill(`${h.n(P.c)} je koreň`, "ok") : "")}},
  {tip:R`Ak má mnohočlen celočíselné koeficienty, každý jeho celočíselný koreň delí absolútny člen $a_0$. Pri $x^3 - 2x^2 - 5x + 6$ stačí skúšať $\pm 1$, $\pm 2$, $\pm 3$, $\pm 6$.`},

  {h:"Hornerova schéma"},
  R`Delenie dvojčlenom $(x - c)$ sa dá skrátiť na prácu so samotnými koeficientmi. Prvý opíšeš, každý ďalší dostaneš tak, že predošlý výsledok vynásobíš $c$ a pripočítaš ďalší koeficient.`,
  {ex:R`Hornerovou schémou vydeľ $(x^3 - 2x^2 - 5x + 6) : (x - 1)$.`,
   steps:[
     ["Koeficienty a $c = 1$. Prvý opíš.", R`1`],
     ["Násob 1 a pripočítaj ďalší.", R`1 \cdot 1 + (-2) = -1`],
     ["Znova.", R`-1 \cdot 1 + (-5) = -6`],
     ["Posledný je zvyšok.", R`-6 \cdot 1 + 6 = 0`]
   ],
   res:R`Podiel má koeficienty $1, -1, -6$, teda $x^2 - x - 6$, zvyšok $0$:

| | $1$ | $-2$ | $-5$ | $6$ |
|---|---|---|---|---|
| $c = 1$ | $1$ | $-1$ | $-6$ | $0$ |`},
  {ex:R`Aký zvyšok dá $x^4 - 3x + 2$ po delení $(x + 1)$?`,
   steps:[
     [R`$x + 1 = x - (-1)$, takže $c = -1$. Zvyšok je $P(-1)$.`, R`P(-1) = (-1)^4 - 3 \cdot (-1) + 2`],
     ["Dopočítaj.", R`1 + 3 + 2 = 6`]
   ],
   res:"Zvyšok je **6**."},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{a}$ tak, aby bol mnohočlen $x^3 + ax - 4$ deliteľný dvojčlenom $(x - 2)$.`,
   hint:R`Podľa zvyškovej vety musí byť $P(2) = 0$: $8 + 2a - 4 = 0$.`,
   goal:P => P.a === -2,
   cfg:{view:[-4, 8, 4, -10], tick:[1, 2], free:true, aspect:"1", fns:[{f:"x^3+a*x-4", lhs:"P(x)"}],
     params:{a:{v:1, min:-5, max:5, step:1, color:"a"}},
     show:[{target:[2, 0], fn:0, label:"[2; 0]", at:"br"}],
     out:(P, h) => h.big(`P(x) = x^3${pl(P.a, h, "va").replace(/\}$/, "}x")} - 4`.replace("x^3 + \\va{0}x", "x^3"))
       + h.calc(R`P(2) = 8 + 2 \cdot ${P.a < 0 ? `(\\va{${P.a}})` : `\\va{${P.a}}`} - 4 = ${4 + 2 * P.a}`)
       + (P.a === -2 ? h.pill("✓ Zvyšok 0, (x − 2) delí P(x)", "ok") : "")}},
  {warn:R`Ak niektorá mocnina chýba, v schéme aj pri delení za ňu napíš nulu. Pre $x^3 - 7x + 6$ sú koeficienty $1,\ 0,\ -7,\ 6$. A pri delení $(x + 3)$ je $c = -3$, nie $3$.`}
],

"Graf polynomickej funkcie":[
  R`Graf mnohočlena je súvislá hladká krivka bez zlomov, dier a asymptot. $D(f) = \mathbb{R}$. Ďaleko od počiatku rozhoduje len vedúci člen $a_n x^n$, ostatné sú proti nemu zanedbateľné.`,
  {cards:[
    {fig:{fns:["x^4-2x^2"], view:[-2.5, 3, 2.5, -2]}, t:R`$n$ párne, $a_n > 0$`, d:"Oba konce hore."},
    {fig:{fns:["-x^4+2x^2"], view:[-2.5, 2, 2.5, -3]}, t:R`$n$ párne, $a_n < 0$`, d:"Oba konce dole."},
    {fig:{fns:["x^3-2x"], view:[-2.5, 3, 2.5, -3]}, t:R`$n$ nepárne, $a_n > 0$`, d:"Zľava zdola, doprava hore."},
    {fig:{fns:["-x^3+2x"], view:[-2.5, 3, 2.5, -3]}, t:R`$n$ nepárne, $a_n < 0$`, d:"Zľava zhora, doprava dole."}
  ]},
  {tool:"graf", ask:R`Meň stupeň $\vb{n}$ a znamienko $\va{a}$ vo funkcii $y = ax^n$. Kedy smerujú oba konce rovnako?`,
   take:R`pri párnom $n$ idú oba konce rovnakým smerom, pri nepárnom opačným. Znamienko $a$ celý obrázok preklopí.`,
   cfg:{view:[-3, 5, 3, -5], tick:1, fns:[{f:"a*x^n", lhs:"y"}],
     params:{a:{v:1, min:-2, max:2, step:.5, color:"a"}, n:{v:3, min:1, max:6, step:1, color:"b"}},
     out:(P, h) => h.big(`y = \\va{${h.tn(P.a)}}x^{\\vb{${P.n}}}`)
       + (P.a === 0 ? h.pill("a = 0 · nie je to mnohočlen stupňa n", "flat")
         : h.pill(P.n % 2 ? (P.a > 0 ? "nepárny · zdola nahor" : "nepárny · zhora nadol") : (P.a > 0 ? "párny · oba konce hore" : "párny · oba konce dole"), P.n % 2 ? "flat" : P.a > 0 ? "up" : "down"))}},
  R`Pri koreni rozhoduje jeho **násobnosť**. Jednoduchý koreň graf os $x$ pretne. Dvojnásobný sa jej dotkne a vráti sa späť. Trojnásobný ju pretne, ale v tom mieste sa zľahka vyrovná.`,
  {tool:"graf", ask:R`Meň násobnosť $\vb{m}$ koreňa 1 vo funkcii $y = (x + 2)(x - 1)^m$. Ako sa správa graf pri $x = 1$?`,
   take:R`pri nepárnej násobnosti graf os pretína, pri párnej sa jej len dotkne. Čím vyššia násobnosť, tým je graf pri koreni plochší.`,
   cfg:{view:[-4, 6, 4, -6], tick:1, fns:[{f:"(x+2)*(x-1)^m", lhs:"y"}],
     params:{m:{v:2, min:1, max:3, step:1, color:"b", note:"násobnosť"}},
     show:[{pt:[1, 0], color:"b", label:"1", at:"b"}, {pt:[-2, 0], color:"ink", size:3.5}],
     out:(P, h) => h.big(`y = (x + 2)(x - 1)^{\\vb{${P.m}}}`) + h.pill(P.m % 2 ? "nepárna násobnosť · pretína" : "párna násobnosť · dotyk", P.m % 2 ? "up" : "flat")}},
  {def:"Počet vrcholov", mid:true, tex:R`\text{stupeň } n \;\Rightarrow\; \text{najviac } n - 1 \text{ lokálnych extrémov}`, note:"Parabola má jeden vrchol, kubická krivka najviac dva."},
  {steps:[
    {t:"Korene a ich násobnosť", d:"Z rozkladu prečítaj, kde graf os $x$ pretína a kde sa jej dotýka."},
    {t:"Konce grafu", d:"Stupeň a znamienko vedúceho koeficientu určia, odkiaľ graf prichádza a kam odchádza."},
    {t:"Priesečník s osou y", d:"Dosaď $x = 0$."},
    {t:"Spoj", d:"Zľava doprava prechádzaj cez korene a dodrž znamienko medzi nimi."}
  ]},
  {ex:R`Načrtni graf $P(x) = -(x + 1)(x - 2)^2$.`,
   steps:[
     [R`Korene: $-1$ jednoduchý (pretína), $2$ dvojnásobný (dotyk).`, R`x = -1,\quad x = 2`],
     [R`Stupeň 3, vedúci koeficient $-1$: zľava zhora, doprava dole.`, R`-x^3 + \dots`],
     ["Priesečník s osou $y$.", R`P(0) = -(1)(-2)^2 = -4`],
     [R`Znamienka: pre $x < -1$ kladné, medzi $-1$ a $2$ záporné, za $2$ záporné.`, R`P(-2) = 16,\quad P(3) = -4`]
   ],
   res:R`Graf prichádza zhora, pretne os v $-1$, klesne cez $[0;\ -4]$, pri $x = 2$ sa osi zdola dotkne a odchádza dole.`,
   fig:{tool:"graf", cfg:{view:[-3, 6, 4, -8], tick:1, fns:[{f:"-(x+1)*(x-2)^2", lhs:"P(x)"}],
     show:[{pt:[-1, 0], color:"c", label:"−1", at:"bl"}, {pt:[2, 0], color:"c", label:"2", at:"t"}, {pt:[0, -4], color:"d", label:"[0; −4]", at:"r"}],
     out:(P, h) => h.calc(R`P(x) = -(x + 1)(x - 2)^2`)}}},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{a}$ tak, aby graf $y = a(x + 1)(x - 1)(x - 2)$ prechádzal bodom $[0;\ 4]$.`,
   hint:R`Pre $x = 0$ je $(x + 1)(x - 1)(x - 2) = 1 \cdot (-1) \cdot (-2) = 2$. Potrebuješ $2a = 4$.`,
   goal:P => P.a === 2,
   cfg:{view:[-3, 6, 3, -6], tick:1, fns:[{f:"a*(x+1)*(x-1)*(x-2)", lhs:"y"}],
     params:{a:{v:-1, min:-3, max:3, step:.5, color:"a"}},
     show:[{target:[0, 4], fn:0, label:"[0; 4]", at:"r"}, {pt:[-1, 0], color:"ink", size:3.5}, {pt:[1, 0], color:"ink", size:3.5}, {pt:[2, 0], color:"ink", size:3.5}],
     out:(P, h) => h.big(`y = \\va{${h.tn(P.a)}}(x + 1)(x - 1)(x - 2)`)
       + (P.a === 2 ? h.pill("✓ Graf prechádza bodom [0; 4]", "ok") : h.p(R`Pre $x = 0$: $\va{${h.tn(P.a)}} \cdot 2 = ${h.tn(2 * P.a)}$`))}},
  {warn:R`Korene neurčujú mnohočlen úplne. $(x - 1)(x - 3)$ aj $5(x - 1)(x - 3)$ majú rovnaké korene, líšia sa vedúcim koeficientom. Na jeho určenie treba ešte jeden bod grafu.`}
]

  }
};
})();

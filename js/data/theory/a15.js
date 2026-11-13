/* Kvadratická rovnica: diskriminant, doplnenie na štvorec */
(() => {
const L = v => ({v, lock:true});
const t3 = (h, v) => h.tn(Math.round(v * 1000) / 1000);
const quad = (h, a, b, c) => {
  const s = (v, x) => v === 0 ? "" : `${v < 0 ? "-" : "+"} ${Math.abs(v) === 1 && x ? "" : h.tn(Math.abs(v))}${x}`;
  return `${a === 1 ? "" : a === -1 ? "-" : h.tn(a)}x^2 ${s(b, "x")} ${s(c, "")}`.replace(/\s+/g, " ");
};
const roots = (h, a, b, c) => {
  const D = b * b - 4 * a * c;
  const p = v => v < 0 ? `(${h.tn(v)})` : h.tn(v);
  let o = h.calc(R`D = \vb{${p(b)}}^2 - 4 \cdot \va{${p(a)}} \cdot \vd{${p(c)}} = ${h.tn(D)}`);
  if(D < 0) return o + h.pill("D < 0: žiadny reálny koreň", "down");
  if(D === 0) return o + h.calc(R`x = \frac{-b}{2a} = ${t3(h, -b / 2 / a)}`) + h.pill("D = 0: jeden (dvojnásobný) koreň", "flat");
  return o + h.calc(R`x_{1,2} = \frac{${h.tn(-b)} \pm \sqrt{${h.tn(D)}}}{${h.tn(2 * a)}} \doteq ${t3(h, (-b - Math.sqrt(D)) / 2 / a)};\ ${t3(h, (-b + Math.sqrt(D)) / 2 / a)}`) + h.pill("D > 0: dva korene", "ok");
};

THEORY.a15 = {
  mins:35,
  brief:[
    R`$ax^2 + bx + c = 0$, $a \neq 0$. Diskriminant $D = b^2 - 4ac$: $D > 0$ dva korene, $D = 0$ jeden, $D < 0$ žiadny.`,
    R`$x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$`,
    R`$ax^2 + c = 0$: $x^2 = -\frac{c}{a}$. $ax^2 + bx = 0$: $x(ax + b) = 0$, korene $0$ a $-\frac{b}{a}$.`,
    R`Rozklad: $x^2 + px + q = (x - x_1)(x - x_2)$, kde $x_1 + x_2 = -p$, $x_1 x_2 = q$.`
  ],
  subs:{

"Diskriminant a počet riešení":[
  R`Kvadratická rovnica $ax^2 + bx + c = 0$ hľadá nulové body paraboly $y = ax^2 + bx + c$ ([[a22]]). Parabola môže os $x$ pretnúť dvakrát, dotknúť sa jej, alebo ju minúť. Ktorá možnosť nastane, prezradí jedno číslo: **diskriminant**.`,
  {def:"Diskriminant", tex:R`D = \vb{b}^2 - 4\va{a}\vd{c}`, legend:[
    ["D > 0", "a", "dva rôzne korene", "parabola pretína os $x$ dvakrát"],
    ["D = 0", "b", "jeden dvojnásobný koreň", "vrchol leží na osi $x$"],
    ["D < 0", "d", "žiadny reálny koreň", "parabola os $x$ nepretne"]
  ]},
  {tool:"graf", ask:R`Meň $\vd{c}$ a sleduj diskriminant. Pri akom $c$ sa parabola $y = x^2 - 4x + c$ práve dotýka osi $x$?`,
   take:R`pri $c = 4$ je $D = 0$ a vrchol je na osi. Pre $c < 4$ sú dva korene, pre $c > 4$ žiadny.`,
   cfg:{view:[-2, 7, 6, -5], tick:1, fns:[{f:"a*x^2+b*x+c", lhs:"y"}],
     params:{a:L(1), b:L(-4), c:{v:1, min:-3, max:7, step:1, color:"d"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => h.calc(R`${quad(h, P.a, P.b, P.c)} = 0`) + roots(h, P.a, P.b, P.c)}},
  {ex:R`Koľko koreňov majú rovnice $x^2 - 4x + 3 = 0$, $x^2 - 4x + 4 = 0$ a $x^2 - 4x + 5 = 0$?`,
   steps:[
     ["Prvá.", R`D = 16 - 12 = 4 > 0`],
     ["Druhá.", R`D = 16 - 16 = 0`],
     ["Tretia.", R`D = 16 - 20 = -4 < 0`]
   ],
   res:"Dva, jeden a žiadny."},
  {ex:R`Pre aké $m$ má rovnica $x^2 + mx + 4 = 0$ dva rôzne korene?`,
   steps:[
     ["Podmienka.", R`D = m^2 - 16 > 0`],
     [R`$m^2 > 16$.`, R`|m| > 4`]
   ],
   res:R`$m \in (-\infty;\ -4) \cup (4;\ \infty)$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{c}$ tak, aby mala rovnica $x^2 - 6x + c = 0$ práve jeden koreň.`,
   hint:R`$D = 36 - 4c = 0$.`,
   goal:P => P.c === 9,
   cfg:{view:[-1, 8, 7, -6], tick:1, fns:[{f:"a*x^2+b*x+c", lhs:"y"}],
     params:{a:L(1), b:L(-6), c:{v:4, min:0, max:12, step:1, color:"d"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => h.calc(R`D = 36 - 4 \cdot \vd{${P.c}} = ${36 - 4 * P.c}`)}},
  {warn:R`Pozor na znamienka pri dosadzovaní: pri $b = -4$ je $b^2 = (-4)^2 = 16$, nie $-16$. A pri $a$ alebo $c$ záporných je $-4ac$ kladné.`}
],

"Vzorec pre korene":[
  R`Ak je $D \geq 0$, korene sa vypočítajú zo vzorca. Plus a mínus dávajú dva korene, pri $D = 0$ splynú.`,
  {def:"Korene kvadratickej rovnice", tex:R`x_{1,2} = \frac{-\vb{b} \pm \sqrt{D}}{2\va{a}}`},
  {tool:"graf", ask:R`Meň koeficienty a porovnaj vypočítané korene s priesečníkmi paraboly s osou $x$.`,
   take:R`vzorec dáva presne priesečníky. Znamienko $a$ ani posun nehrá rolu, vzorec platí vždy, keď $D \geq 0$.`,
   cfg:{view:[-5, 6, 5, -6], tick:1, fns:[{f:"a*x^2+b*x+c", lhs:"y"}],
     params:{a:{v:2, min:-3, max:3, step:1, color:"a"}, b:{v:-3, min:-6, max:6, step:1, color:"b"}, c:{v:-2, min:-6, max:6, step:1, color:"d"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => P.a === 0 ? h.p("Pre $a = 0$ to nie je kvadratická rovnica.") : h.calc(R`${quad(h, P.a, P.b, P.c)} = 0`) + roots(h, P.a, P.b, P.c)}},
  {ex:R`Vyrieš $2x^2 - 3x - 2 = 0$.`,
   steps:[
     ["Diskriminant.", R`D = 9 + 16 = 25`],
     ["Vzorec.", R`x_{1,2} = \frac{3 \pm 5}{4}`],
     ["Dva korene.", R`x_1 = 2,\quad x_2 = -\frac{1}{2}`]
   ],
   res:R`$x \in \left\{-\dfrac{1}{2};\ 2\right\}$`},
  {ex:R`Vyrieš $x^2 + 2x - 1 = 0$ a $-x^2 + x + 6 = 0$.`,
   steps:[
     [R`$D = 4 + 4 = 8$, $\sqrt{8} = 2\sqrt{2}$.`, R`x_{1,2} = \frac{-2 \pm 2\sqrt{2}}{2} = -1 \pm \sqrt{2}`],
     [R`Druhú vynásob $-1$, aby bolo $a$ kladné.`, R`x^2 - x - 6 = 0,\quad D = 25,\quad x = \frac{1 \pm 5}{2}`]
   ],
   res:R`$-1 \pm \sqrt{2}$ a $\{-2;\ 3\}$.`},
  {tool:"graf", kind:"uloha", ask:R`Rovnica $x^2 + bx + 3 = 0$. Nastav $\vb{b}$ tak, aby mala korene 1 a 3.`,
   hint:R`Súčet koreňov je $-b$.`,
   goal:P => P.b === -4,
   cfg:{view:[-5, 6, 6, -4], tick:1, fns:[{f:"x^2+b*x+3", lhs:"y"}],
     params:{b:{v:2, min:-6, max:6, step:1, color:"b"}},
     show:[{roots:0, color:"c"}, {target:[3, 0], fn:0, label:"3", at:"t"}],
     out:(P, h) => roots(h, 1, P.b, 3)}},
  {warn:R`Zlomková čiara je pod **celým** čitateľom $-b \pm \sqrt{D}$. Zápis $-b \pm \frac{\sqrt{D}}{2a}$ je chybný.`}
],

"Neúplné kvadratické rovnice":[
  R`Ak chýba lineárny člen ($b = 0$) alebo absolútny člen ($c = 0$), vzorec nie je potrebný. Rovnica sa vyrieši priamo.`,
  {def:"Neúplné rovnice", tex:R`\begin{aligned}ax^2 + c = 0 &: \quad x^2 = -\frac{c}{a}\\ ax^2 + bx = 0 &: \quad x(ax + b) = 0 \;\Rightarrow\; x = 0 \vee x = -\frac{b}{a}\end{aligned}`},
  {tool:"graf", ask:R`Rovnica $x^2 = \vd{k}$: priesečníky paraboly $y = x^2$ s priamkou $y = k$. Koľko ich je pre kladné, nulové a záporné $k$?`,
   take:R`pre $k > 0$ dva, $\pm\sqrt{k}$. Pre $k = 0$ jeden, $0$. Pre $k < 0$ žiadny.`,
   cfg:{view:[-4, 6, 4, -3], tick:1, fns:[{f:"x^2", lhs:"y"}, {f:"k", lhs:"y", color:"d"}],
     params:{k:{v:4, min:-2, max:5, step:.5, color:"d"}},
     show:[{meet:[0, 1], color:"c"}],
     out:(P, h) => h.calc(P.k > 0 ? R`x = \pm\sqrt{\vd{${h.tn(P.k)}}} \doteq \pm ${t3(h, Math.sqrt(P.k))}` : P.k === 0 ? R`x = 0` : R`x^2 = \vd{${h.tn(P.k)}} < 0`)}},
  {ex:R`Vyrieš $3x^2 - 12 = 0$, $x^2 + 9 = 0$ a $5x^2 - 3x = 0$.`,
   steps:[
     ["Prvá: osamostatni $x^2$.", R`x^2 = 4 \;\Rightarrow\; x = \pm 2`],
     ["Druhá.", R`x^2 = -9 \text{ nemá riešenie}`],
     ["Tretia: vyber $x$.", R`x(5x - 3) = 0 \;\Rightarrow\; x = 0 \vee x = \frac{3}{5}`]
   ],
   res:R`$\{\pm 2\}$; $\emptyset$; $\left\{0;\ \frac{3}{5}\right\}$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{b}$ tak, aby mala rovnica $x^2 + bx = 0$ korene 0 a 3.`,
   hint:R`$x(x + b) = 0$, druhý koreň je $-b$.`,
   goal:P => P.b === -3,
   cfg:{view:[-5, 5, 5, -5], tick:1, fns:[{f:"x^2+b*x", lhs:"y"}],
     params:{b:{v:2, min:-5, max:5, step:1, color:"b"}},
     show:[{roots:0, color:"c"}]}},
  {warn:R`Rovnicu $5x^2 = 3x$ nedeľ $x$. Stratíš koreň $x = 0$. Správne je presunúť všetko na jednu stranu a vybrať $x$ pred zátvorku.`}
],

"Riešenie rozkladom a doplnením na štvorec":[
  R`Ak sa dá trojčlen ľahko rozložiť, je to najrýchlejšia cesta: súčin je nula, keď je nula niektorý činiteľ. Pri $a = 1$ hľadáš dve čísla so súčinom $q$ a súčtom $-p$ (Vièteho vzťahy, [[b6]]).`,
  {def:"Rozklad trojčlena", tex:R`x^2 + px + q = (x - x_1)(x - x_2),\qquad x_1 + x_2 = -p,\quad x_1 \cdot x_2 = q`},
  {ex:R`Vyrieš rozkladom $x^2 - 7x + 12 = 0$.`,
   steps:[
     ["Dve čísla so súčinom 12 a súčtom 7.", R`3 \cdot 4 = 12,\quad 3 + 4 = 7`],
     ["Rozklad.", R`(x - 3)(x - 4) = 0`]
   ],
   res:R`$x \in \{3;\ 4\}$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{m}$ a $\vb{n}$ tak, aby sa graf $y = (x - m)(x - n)$ zhodoval s čiarkovaným grafom $y = x^2 - 5x + 6$.`,
   hint:R`Dve čísla so súčinom 6 a súčtom 5.`,
   goal:P => (P.m === 2 && P.n === 3) || (P.m === 3 && P.n === 2),
   cfg:{view:[-3, 6, 6, -3], tick:1, fns:[{f:"(x-m)*(x-n)", lhs:"y"}, {f:"x^2-5x+6", color:"c", dash:true, thin:true}],
     params:{m:{v:-1, min:-3, max:5, step:1, color:"a"}, n:{v:1, min:-3, max:5, step:1, color:"b"}},
     show:[{pt:["m", 0], color:"a"}, {pt:["n", 0], color:"b"}]}},
  R`**Doplnenie na štvorec** ([[a10]]) funguje vždy. Z rovnice vznikne tvar $(x + d)^2 = e$, ktorý sa vyrieši odmocnením. Práve z neho sa odvodzuje vzorec s diskriminantom.`,
  {tool:"plochy", ask:R`Meň $\vb{p}$ a sleduj, aký štvorček chýba do úplného štvorca.`,
   take:R`$x^2 + px = \left(x + \frac{p}{2}\right)^2 - \frac{p^2}{4}$. Rovnica $x^2 + px + q = 0$ sa tak zmení na $\left(x + \frac{p}{2}\right)^2 = \frac{p^2}{4} - q$.`,
   cfg:{typ:"doplnenie"}},
  {ex:R`Vyrieš doplnením na štvorec $x^2 - 4x - 1 = 0$.`,
   steps:[
     [R`$\frac{p}{2} = -2$, doplň 4.`, R`(x - 2)^2 - 4 - 1 = 0`],
     ["Osamostatni štvorec.", R`(x - 2)^2 = 5`],
     ["Odmocni, dve možnosti.", R`x - 2 = \pm\sqrt{5} \;\Rightarrow\; x = 2 \pm \sqrt{5}`]
   ],
   res:R`$x = 2 \pm \sqrt{5}$`},
  {ex:R`Vyrieš $x^4 - 5x^2 + 4 = 0$.`,
   steps:[
     [R`Substitúcia $t = x^2$.`, R`t^2 - 5t + 4 = 0 \;\Rightarrow\; (t - 1)(t - 4) = 0`],
     [R`Späť: $x^2 = 1$ alebo $x^2 = 4$.`, R`x = \pm 1,\quad x = \pm 2`]
   ],
   res:R`Štyri korene $\{-2;\ -1;\ 1;\ 2\}$.`},
  {warn:R`Pri odmocnení $(x - 2)^2 = 5$ nezabudni na obe znamienka: $x - 2 = \pm\sqrt{5}$. Bez mínusu stratíš jeden koreň.`}
]

  }
};
})();

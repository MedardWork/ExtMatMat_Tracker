/* Výrazy s absolútnou hodnotou */
(() => {
const L = v => ({v, lock:true});
const sg = (h, v) => v < 0 ? `+ ${h.tn(-v)}` : v > 0 ? `- ${h.tn(v)}` : "";

THEORY.a13 = {
  mins:25,
  brief:[
    R`$|a|$ je vzdialenosť čísla $a$ od nuly, $|a - b|$ je vzdialenosť čísel $a$ a $b$ na osi.`,
    R`$|A| = A$ pre $A \geq 0$, $|A| = -A$ pre $A < 0$.`,
    R`Na danom intervale sa absolútne hodnoty odstránia podľa znamienka výrazov vnútri. Hranice intervalov sú nulové body.`
  ],
  subs:{

"Absolútna hodnota ako vzdialenosť":[
  R`**Absolútna hodnota** čísla je jeho vzdialenosť od nuly na číselnej osi. Vzdialenosť nie je nikdy záporná: $|5| = 5$, $|-5| = 5$, $|0| = 0$. Rozdiel v absolútnej hodnote $|a - b|$ meria vzdialenosť dvoch čísel.`,
  {def:"Absolútna hodnota", tex:R`|a| = \text{vzdialenosť } a \text{ od } 0,\qquad |a - b| = \text{vzdialenosť } a \text{ a } b`},
  {tool:"os", ask:R`Nerovnosť $|x - \vb{s}| < \va{r}$ hovorí: $x$ je od $s$ vzdialené menej než $r$. Meň stred a vzdialenosť. Aký interval dostaneš?`,
   take:R`interval so stredom $s$ a polomerom $r$: $(s - r;\ s + r)$. S opačným znamienkom ($>$) sú to dve polpriamky von.`,
   cfg:{typ:"abs", s:{v:1}, r:{v:3}, toggles:["vonku", "rovne"]}},
  {ex:R`Vypočítaj $|-7|$, $|3 - 8|$, $|\pi - 4|$.`,
   steps:[
     ["Vzdialenosť od nuly.", R`|-7| = 7`],
     ["Najprv vnútri.", R`|3 - 8| = |-5| = 5`],
     [R`$\pi < 4$, vnútri je záporné číslo, zmeň znamienko.`, R`|\pi - 4| = 4 - \pi`]
   ],
   res:R`$7$, $5$, $4 - \pi \doteq 0{,}86$.`},
  {ex:R`Ktoré čísla spĺňajú $|x - 2| = 5$?`,
   steps:[
     [R`Čísla vzdialené od 2 presne o 5.`, R`2 + 5 = 7,\quad 2 - 5 = -3`]
   ],
   res:R`$x = 7$ alebo $x = -3$.`},
  {tool:"os", kind:"uloha", ask:R`Nastav stred $\vb{s}$ a vzdialenosť $\va{r}$ tak, aby $|x - s| \leq r$ opisovalo interval $\langle -1;\ 5 \rangle$.`,
   hint:R`Stred je v polovici medzi $-1$ a $5$, polomer je polovica dĺžky.`,
   goal:P => P.s === 2 && P.r === 3,
   cfg:{typ:"abs", s:{v:0}, r:{v:1}, on:{rovne:true}}},
  {warn:R`$|x|$ nie je „$x$ bez mínusu“. Pre záporné $x$ je $|x| = -x$, a to je kladné číslo: $|-3| = -(-3) = 3$.`}
],

"Rozpísanie podľa znamienka":[
  R`Absolútna hodnota výrazu $A$ nechá $A$ tak, keď je nezáporný, a zmení mu znamienko, keď je záporný. Graf $y = |A|$ vznikne tak, že časť grafu $y = A$ pod osou $x$ sa preklopí hore ([[b12]]).`,
  {def:"Definícia absolútnej hodnoty", tex:R`|A| = \begin{cases} A & \text{pre } A \geq 0\\ -A & \text{pre } A < 0\end{cases}`},
  {tool:"graf", ask:R`Meň $\vd{a}$ vo funkcii $y = |x - a|$. Na ktorej strane od $a$ je $|x - a| = x - a$ a kde $a - x$?`,
   take:R`vpravo od $a$ je $x - a \geq 0$ a graf je priamka $y = x - a$. Vľavo je preklopená, $y = a - x$. Zlom je v nulovom bode $x = a$.`,
   cfg:{view:[-5, 6, 6, -3], tick:1, fns:[{f:"abs(x-a)", lhs:"y"}, {f:"x-a", color:"axis", dash:true, thin:true, ghost:true}],
     params:{a:{v:2, min:-3, max:4, step:1, color:"d"}},
     show:[{pt:["a", 0], color:"d", label:"x = {a}", at:"b"}],
     out:(P, h) => h.calc(R`|x ${sg(h, P.a)}| = \begin{cases} x ${sg(h, P.a)} & x \geq \vd{${P.a}}\\ ${h.tn(P.a)} - x & x < \vd{${P.a}}\end{cases}`)}},
  {ex:R`Rozpíš bez absolútnej hodnoty: $|2x - 6|$.`,
   steps:[
     ["Nulový bod.", R`2x - 6 = 0 \;\Rightarrow\; x = 3`],
     [R`Pre $x \geq 3$ je výraz nezáporný.`, R`|2x - 6| = 2x - 6`],
     [R`Pre $x < 3$ je záporný, zmeň znamienko celého výrazu.`, R`|2x - 6| = -(2x - 6) = 6 - 2x`]
   ],
   res:R`$|2x - 6| = 2x - 6$ pre $x \geq 3$, $6 - 2x$ pre $x < 3$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{a}$ tak, aby platilo $|x - a| = a - x$ práve pre $x \leq 4$.`,
   hint:R`$|x - a| = a - x$ platí, keď je $x - a \leq 0$.`,
   goal:P => P.a === 4,
   cfg:{view:[-5, 6, 6, -3], tick:1, fns:[{f:"abs(x-a)", lhs:"y"}],
     params:{a:{v:1, min:-3, max:5, step:1, color:"d"}},
     out:(P, h) => h.p(R`$|x - a| = a - x$ pre $x \leq \vd{${P.a}}$.`)}},
  {warn:R`Pri zmene znamienka dávaj zátvorku okolo celého výrazu. Pre $x < 3$ je $|x - 3| = -(x - 3) = 3 - x$, nie $-x - 3$.`}
],

"Úprava výrazu na danom intervale":[
  R`Ak je v zadaní povedané, na akom intervale $x$ leží, každá absolútna hodnota má na ňom pevné znamienko a dá sa odstrániť. Ak interval zadaný nie je, rozdelí os na časti **nulové body** všetkých výrazov v absolútnych hodnotách.`,
  {steps:[
    {t:"Nulové body", d:R`Pre každú $|A|$ vyrieš $A = 0$.`},
    {t:"Znamienka", d:"Na každom intervale medzi nulovými bodmi urči znamienko každého výrazu (dosaď jedno číslo)."},
    {t:"Odstráň a uprav", d:R`Kladný výraz prepíš bez zmeny, záporný so zmeneným znamienkom. Potom zjednoduš.`}
  ]},
  {tool:"os", ask:R`Tabuľka znamienok výrazov $x + 2$ a $x - 1$. Aké znamienka majú v jednotlivých intervaloch?`,
   take:R`vľavo od $-2$ sú obe záporné, medzi $-2$ a $1$ je $x + 2$ kladné a $x - 1$ záporné, vpravo od $1$ sú obe kladné.`,
   cfg:{typ:"znamienka", n:2, x1:L(-2), x2:L(1)}},
  {ex:R`Uprav $|x - 1| + |x + 2|$ na intervaloch $(-\infty;\ -2)$, $\langle -2;\ 1)$ a $\langle 1;\ \infty)$.`,
   steps:[
     [R`$x < -2$: obe záporné.`, R`-(x - 1) - (x + 2) = -2x - 1`],
     [R`$-2 \leq x < 1$: $x + 2 \geq 0$, $x - 1 < 0$.`, R`-(x - 1) + (x + 2) = 3`],
     [R`$x \geq 1$: obe nezáporné.`, R`(x - 1) + (x + 2) = 2x + 1`]
   ],
   res:R`$-2x - 1$; $3$; $2x + 1$. V strednom intervale je výraz konštantný.`},
  {tool:"graf", ask:R`Graf $y = |x - 1| + |x + 2|$. Kde je vodorovný a aký sklon majú krajné časti?`,
   take:R`medzi $-2$ a $1$ je vodorovný vo výške 3, vľavo klesá so sklonom $-2$, vpravo rastie so sklonom 2. Zlomy sú v nulových bodoch.`,
   cfg:{view:[-5, 8, 4, -1], tick:1, fns:[{f:"abs(x-1)+abs(x+2)", lhs:"y"}],
     params:{c:{v:0, min:-4, max:3, step:.5, color:"d", name:"x₀"}},
     show:[{pt:["c", "abs(c-1)+abs(c+2)"], color:"d", label:"{abs(c-1)+abs(c+2)}", at:"t"}, {vline:-2, color:"soft"}, {vline:1, color:"soft"}],
     out:(P, h) => h.calc(P.c < -2 ? R`-2 \cdot (${h.tn(P.c)}) - 1 = ${h.tn(-2 * P.c - 1)}` : P.c < 1 ? R`x \in \langle -2;\ 1):\ y = 3` : R`2 \cdot ${h.tn(P.c)} + 1 = ${h.tn(2 * P.c + 1)}`)}},
  {ex:R`Zjednoduš $|x - 3| - |x|$ pre $x \in (0;\ 3)$.`,
   steps:[
     [R`$x - 3 < 0$, $x > 0$.`, R`-(x - 3) - x`],
     ["Uprav.", R`3 - x - x = 3 - 2x`]
   ],
   res:R`$3 - 2x$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{a}$ tak, aby mal výraz $|x - a| + |x + 2|$ na intervale $\langle -2;\ a \rangle$ hodnotu 5.`,
   hint:R`Pre $-2 \leq x \leq a$ je výraz $(a - x) + (x + 2) = a + 2$.`,
   goal:P => P.a === 3,
   cfg:{view:[-5, 10, 6, -1], tick:1, fns:[{f:"abs(x-a)+abs(x+2)", lhs:"y"}],
     params:{a:{v:0, min:-1, max:5, step:1, color:"d"}},
     show:[{hline:5, color:"soft"}],
     out:(P, h) => h.calc(R`x \in \langle -2;\ \vd{${P.a}} \rangle:\ (\vd{${P.a}} - x) + (x + 2) = ${P.a + 2}`)}},
  {warn:R`Nulový bod patrí do jedného z intervalov, nezabudni naň. Pri hranici $x = 1$ dávaj pozor, či je zátvorka $\langle$ alebo $($.`}
]

  }
};
})();

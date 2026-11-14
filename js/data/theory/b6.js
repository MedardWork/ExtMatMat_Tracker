/* Viètove vzťahy a koreňoví činitelia */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const PV = {view:[-6, 6, 6, -7], tick:1};
const pq = (h, p, q) => `x^2 ${p ? `${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : `\\va{${h.tn(Math.abs(p))}}`}x` : ""} ${q ? `${q < 0 ? "-" : "+"} \\vb{${h.tn(Math.abs(q))}}` : ""}`;
const eqv = v => Number.isInteger(Math.round(v * 1e9) / 1e9) ? "=" : "\\doteq";
const vieta = (P, h) => {
  const D = P.p * P.p - 4 * P.q;
  let o = h.calc(`${pq(h, P.p, P.q)} = 0`);
  if(D < 0) return o + h.pill("D < 0: reálne korene nie sú", "down");
  const x1 = (-P.p - Math.sqrt(D)) / 2, x2 = (-P.p + Math.sqrt(D)) / 2;
  return o + h.calc(R`x_1 ${eqv(x1)} ${t2(h, x1)},\quad x_2 ${eqv(x2)} ${t2(h, x2)}`)
    + h.calc(R`x_1 + x_2 = ${t2(h, x1 + x2)} = -\va{p},\qquad x_1 x_2 = ${t2(h, x1 * x2)} = \vb{q}`);
};

THEORY.b6 = {
  mins:25,
  brief:[
    R`Pre $ax^2 + bx + c = 0$: $x_1 + x_2 = -\dfrac{b}{a}$, $x_1 x_2 = \dfrac{c}{a}$. Pre $x^2 + px + q = 0$: $x_1 + x_2 = -p$, $x_1 x_2 = q$.`,
    R`$ax^2 + bx + c = a(x - x_1)(x - x_2)$`,
    R`Rovnica s koreňmi $x_1$, $x_2$: $x^2 - (x_1 + x_2)x + x_1 x_2 = 0$.`
  ],
  subs:{

"Súčet a súčin koreňov":[
  R`Ak má rovnica $x^2 + px + q = 0$ korene $x_1$, $x_2$, dá sa zapísať ako $(x - x_1)(x - x_2) = 0$. Po roznásobení $x^2 - (x_1 + x_2)x + x_1 x_2$ porovnaj koeficienty: súčet a súčin koreňov sa dajú prečítať priamo z rovnice.`,
  {def:"Vièteho vzťahy", tex:R`x^2 + \va{p}x + \vb{q} = 0:\qquad x_1 + x_2 = -\va{p},\qquad x_1 \cdot x_2 = \vb{q}`, note:R`Pre $ax^2 + bx + c = 0$ najprv vydeľ $a$: $x_1 + x_2 = -\frac{b}{a}$, $x_1 x_2 = \frac{c}{a}$.`},
  {tool:"graf", ask:R`Meň $\va{p}$ a $\vb{q}$ a porovnaj súčet a súčin koreňov s koeficientmi.`,
   take:R`súčet je vždy $-p$ a súčin $q$. Napríklad pri $p = -1$, $q = -6$ sú korene $3$ a $-2$: súčet $1$, súčin $-6$.`,
   cfg:Object.assign({}, PV, {fns:[{f:"x^2+p*x+q", lhs:"y"}],
     params:{p:{v:-1, min:-5, max:5, step:1, color:"a"}, q:{v:-6, min:-6, max:6, step:1, color:"b"}},
     show:[{roots:0, color:"c"}], out:vieta})},
  {ex:R`Bez riešenia urči súčet a súčin koreňov rovnice $2x^2 - 7x + 3 = 0$. Potom over.`,
   steps:[
     ["Vièteho vzťahy.", R`x_1 + x_2 = \frac{7}{2},\quad x_1 x_2 = \frac{3}{2}`],
     [R`Korene sú $3$ a $\frac{1}{2}$.`, R`3 + \tfrac{1}{2} = \tfrac{7}{2},\quad 3 \cdot \tfrac{1}{2} = \tfrac{3}{2}`]
   ],
   res:"Súčet $\\frac{7}{2}$, súčin $\\frac{3}{2}$."},
  {ex:R`Korene rovnice $x^2 - 5x + 2 = 0$ sú $x_1$, $x_2$. Vypočítaj $x_1^2 + x_2^2$ bez riešenia rovnice.`,
   steps:[
     ["Vyjadri pomocou súčtu a súčinu.", R`x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2`],
     ["Dosaď.", R`5^2 - 2 \cdot 2 = 21`]
   ],
   res:"$21$"},
  {ex:R`Rovnica $x^2 + px - 6 = 0$ má koreň $2$. Nájdi druhý koreň a $p$.`,
   steps:[
     ["Zo súčinu.", R`2 \cdot x_2 = -6 \;\Rightarrow\; x_2 = -3`],
     ["Zo súčtu.", R`2 + (-3) = -p \;\Rightarrow\; p = 1`]
   ],
   res:R`$x_2 = -3$, $p = 1$.`},
  {tool:"graf", kind:"uloha", ask:R`Pri $\vb{q} = 3$ nastav $\va{p}$ tak, aby bol súčet koreňov 4.`,
   hint:R`$x_1 + x_2 = -p$.`,
   goal:P => P.p === -4,
   cfg:Object.assign({}, PV, {fns:[{f:"x^2+p*x+q", lhs:"y"}],
     params:{p:{v:0, min:-5, max:5, step:1, color:"a"}, q:L(3)},
     show:[{roots:0, color:"c"}], out:vieta})},
  {warn:R`Pri $ax^2 + bx + c$ s $a \neq 1$ nezabudni deliť $a$. A súčet je $-p$, nie $p$: pre $x^2 - 5x + 6$ je súčet koreňov $+5$.`}
],

"Rozklad na koreňové činitele":[
  R`Ak poznáš korene kvadratického trojčlena, rozložíš ho na súčin **koreňových činiteľov** $(x - x_1)(x - x_2)$. Nezabudni na koeficient $a$ pred zátvorkami.`,
  {def:"Rozklad na koreňové činitele", tex:R`ax^2 + bx + c = a(x - x_1)(x - x_2)`, note:R`Pri $D < 0$ sa trojčlen v reálnych číslach rozložiť nedá.`},
  {tool:"graf", ask:R`Graf $y = \vd{a}(x - x_1)(x - x_2)$. Korene sú dané body na osi $x$. Čo robí $\vd{a}$?`,
   take:R`$a$ graf naťahuje a pri zápornom $a$ ho otočí, ale korene sa nemenia. Preto rovnaké korene má celá „rodina“ trojčlenov, líšia sa len násobkom.`,
   cfg:{view:[-4, 7, 5, -7], tick:1, fns:[{f:"a*(x+1)*(x-3)", lhs:"y"}],
     params:{a:{v:1, min:-2, max:2, step:.5, color:"d"}},
     show:[{pt:[-1, 0], color:"c", label:"−1", at:"tl"}, {pt:[3, 0], color:"c", label:"3", at:"tr"}],
     out:(P, h) => h.calc(R`y = \vd{${h.tn(P.a)}}(x + 1)(x - 3)`)}},
  {ex:R`Rozlož $2x^2 - 7x + 3$ a $x^2 + x - 12$.`,
   steps:[
     [R`Korene $3$ a $\frac{1}{2}$, $a = 2$.`, R`2(x - 3)\left(x - \tfrac{1}{2}\right) = (x - 3)(2x - 1)`],
     [R`Korene majú súčin $-12$ a súčet $-1$: sú to $-4$ a $3$.`, R`(x + 4)(x - 3)`]
   ],
   res:R`$(x - 3)(2x - 1)$ a $(x + 4)(x - 3)$.`},
  {ex:R`Zjednoduš $\dfrac{x^2 - 5x + 6}{x^2 - 4}$.`,
   steps:[
     ["Rozlož čitateľa aj menovateľa.", R`\frac{(x - 2)(x - 3)}{(x - 2)(x + 2)}`],
     [R`Vykráť, podmienky $x \neq \pm 2$.`, R`\frac{x - 3}{x + 2}`]
   ],
   res:R`$\dfrac{x - 3}{x + 2}$ pre $x \neq \pm 2$.`},
  {warn:R`$2x^2 - 7x + 3 \neq (x - 3)\left(x - \frac{1}{2}\right)$. Bez koeficientu 2 pred zátvorkou by to bol iný trojčlen. Skúška roznásobením to odhalí.`}
],

"Zostavenie rovnice z koreňov":[
  R`Opačná úloha: poznáš korene a hľadáš rovnicu. Stačí roznásobiť $(x - x_1)(x - x_2)$, alebo dosadiť súčet a súčin do Vièteho vzťahov.`,
  {def:"Rovnica s danými koreňmi", tex:R`x^2 - (x_1 + x_2)\,x + x_1 x_2 = 0`},
  {ex:R`Zostav kvadratickú rovnicu s koreňmi $2$ a $-5$.`,
   steps:[
     ["Súčet a súčin.", R`x_1 + x_2 = -3,\quad x_1 x_2 = -10`],
     ["Dosaď.", R`x^2 + 3x - 10 = 0`]
   ],
   res:R`$x^2 + 3x - 10 = 0$`},
  {ex:R`Zostav rovnicu s koreňmi $1 + \sqrt{2}$ a $1 - \sqrt{2}$.`,
   steps:[
     ["Súčet.", R`(1 + \sqrt{2}) + (1 - \sqrt{2}) = 2`],
     ["Súčin, rozdiel štvorcov.", R`1 - 2 = -1`]
   ],
   res:R`$x^2 - 2x - 1 = 0$`},
  {ex:R`Zostav rovnicu, ktorej korene sú prevrátené hodnoty koreňov rovnice $x^2 - 5x + 6 = 0$.`,
   steps:[
     [R`Pôvodné korene $2$ a $3$, nové $\frac{1}{2}$ a $\frac{1}{3}$.`, R`\tfrac{1}{2} + \tfrac{1}{3} = \tfrac{5}{6},\quad \tfrac{1}{2} \cdot \tfrac{1}{3} = \tfrac{1}{6}`],
     ["Rovnica, vynásob 6.", R`x^2 - \tfrac{5}{6}x + \tfrac{1}{6} = 0 \;\Rightarrow\; 6x^2 - 5x + 1 = 0`]
   ],
   res:R`$6x^2 - 5x + 1 = 0$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{p}$ a $\vb{q}$ tak, aby mala rovnica $x^2 + px + q = 0$ korene $-1$ a $4$.`,
   hint:R`$-p = -1 + 4$, $q = (-1) \cdot 4$.`,
   goal:P => P.p === -3 && P.q === -4,
   cfg:Object.assign({}, PV, {fns:[{f:"x^2+p*x+q", lhs:"y"}],
     params:{p:{v:0, min:-5, max:5, step:1, color:"a"}, q:{v:0, min:-6, max:6, step:1, color:"b"}},
     show:[{roots:0, color:"c"}, {target:[-1, 0], fn:0, label:"−1", at:"t"}, {target:[4, 0], fn:0, label:"4", at:"t"}], out:vieta})},
  {warn:R`Pri súčte v rovnici je **mínus**: $x^2 - (x_1 + x_2)x$. Pre korene 2 a $-5$ je súčet $-3$, takže člen je $+3x$.`}
]

  }
};
})();

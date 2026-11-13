/* Rovnice a nerovnice s absolútnou hodnotou */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const AV = {view:[-6, 9, 6, -2], tick:1};

THEORY.b5 = {
  mins:35,
  brief:[
    R`Metóda nulových bodov: nulové body výrazov v absolútnych hodnotách rozdelia os na intervaly. Na každom vyrieš rovnicu bez absolútnej hodnoty a koreň over, či do intervalu patrí.`,
    R`$|f(x)| = c$ ($c \geq 0$): $f(x) = c \vee f(x) = -c$.`,
    R`$|f(x)| < c \;\Leftrightarrow\; -c < f(x) < c$. $|f(x)| > c \;\Leftrightarrow\; f(x) < -c \vee f(x) > c$.`,
    R`$|x - a|$ je vzdialenosť $x$ od $a$ na číselnej osi.`
  ],
  subs:{

"Metóda nulových bodov":[
  R`Absolútna hodnota sa dá odstrániť, keď vieme znamienko výrazu vnútri ([[a13]]). Preto sa os rozdelí **nulovými bodmi** na intervaly a na každom sa rovnica rieši zvlášť, už bez absolútnych hodnôt.`,
  {steps:[
    {t:"Nulové body", d:"Každý výraz v absolútnej hodnote polož rovný nule."},
    {t:"Intervaly", d:"Na každom intervale odstráň absolútne hodnoty podľa znamienka."},
    {t:"Vyrieš a over", d:"Koreň platí, len ak leží v intervale, na ktorom si rovnicu riešil. Výsledky zjednoť."}
  ]},
  {tool:"os", ask:R`Znamienka výrazov $x + 2$ a $x - 1$ na intervaloch, ktoré vytvoria nulové body $-2$ a $1$.`,
   take:R`tri intervaly: $(-\infty;\ -2)$, $\langle -2;\ 1)$, $\langle 1;\ \infty)$. Na každom má každý výraz pevné znamienko.`,
   cfg:{typ:"znamienka", n:2, x1:L(-2), x2:L(1)}},
  {ex:R`Vyrieš $|x - 1| + |x + 2| = 5$.`,
   steps:[
     [R`$x < -2$: obe záporné.`, R`-(x - 1) - (x + 2) = 5 \;\Rightarrow\; -2x - 1 = 5 \;\Rightarrow\; x = -3 \ \checkmark`],
     [R`$-2 \leq x < 1$.`, R`-(x - 1) + (x + 2) = 5 \;\Rightarrow\; 3 = 5 \ \text{nikdy}`],
     [R`$x \geq 1$: obe nezáporné.`, R`(x - 1) + (x + 2) = 5 \;\Rightarrow\; 2x + 1 = 5 \;\Rightarrow\; x = 2 \ \checkmark`]
   ],
   res:R`$x \in \{-3;\ 2\}$`},
  {tool:"graf", ask:R`Graf $y = |x - 1| + |x + 2|$ a priamka $y = \vd{c}$. Koľko riešení má rovnica pre rôzne $c$?`,
   take:R`pre $c > 3$ dve, pre $c = 3$ nekonečne veľa (celý interval $\langle -2;\ 1 \rangle$), pre $c < 3$ žiadne.`,
   cfg:Object.assign({}, AV, {fns:[{f:"abs(x-1)+abs(x+2)", lhs:"y"}, {f:"c", lhs:"y", color:"d"}],
     params:{c:{v:5, min:1, max:8, step:.5, color:"d"}},
     show:[{pt:["(c-1)/2", "c"], color:"c", if:P => P.c > 3}, {pt:["-(c+1)/2", "c"], color:"c", if:P => P.c > 3}],
     out:(P, h) => P.c > 3 ? h.calc(R`x = ${t2(h, -(P.c + 1) / 2)},\quad x = ${t2(h, (P.c - 1) / 2)}`) : P.c === 3 ? h.pill("nekonečne veľa riešení: ⟨−2; 1⟩", "flat") : h.pill("žiadne riešenie", "down")})},
  {warn:R`Koreň, ktorý vyjde mimo intervalu, na ktorom si počítal, zahoď. Na intervale $x \geq 1$ by koreň $x = -3$ riešením nebol, hoci rovnicu spĺňa.`}
],

"Rovnice s absolútnou hodnotou":[
  R`Najjednoduchší typ $|f(x)| = c$ sa rieši bez intervalov: výraz vnútri je buď $c$, alebo $-c$. Pre $c < 0$ riešenie nie je. Ak je na pravej strane výraz s $x$, treba metódu nulových bodov alebo skúšku.`,
  {def:"Základná rovnica", tex:R`|f(x)| = \vd{c},\ c \geq 0 \;\Leftrightarrow\; f(x) = \vd{c} \;\vee\; f(x) = -\vd{c}`},
  {tool:"graf", ask:R`Rovnica $|2x - 4| = \vd{c}$. Meň $\vd{c}$. Kde ležia riešenia vzhľadom na bod $x = 2$?`,
   take:R`súmerne okolo 2: $x = 2 \pm \frac{c}{2}$. Pre $c = 0$ splynú do jedného, pre $c < 0$ nie sú žiadne.`,
   cfg:Object.assign({}, AV, {fns:[{f:"abs(2x-4)", lhs:"y"}, {f:"c", lhs:"y", color:"d"}],
     params:{c:{v:6, min:-1, max:8, step:.5, color:"d"}},
     show:[{pt:["2+c/2", "c"], color:"c", if:P => P.c >= 0}, {pt:["2-c/2", "c"], color:"c", if:P => P.c > 0}],
     out:(P, h) => P.c < 0 ? h.pill("c < 0: žiadne riešenie", "down") : h.calc(R`2x - 4 = \pm\vd{${h.tn(P.c)}} \;\Rightarrow\; x = ${P.c ? `${t2(h, 2 - P.c / 2)}\\ \\vee\\ x = ` : ""}${t2(h, 2 + P.c / 2)}`)})},
  {ex:R`Vyrieš $|2x - 4| = 6$.`,
   steps:[
     ["Dve možnosti.", R`2x - 4 = 6 \;\vee\; 2x - 4 = -6`],
     ["Vyrieš každú.", R`x = 5 \;\vee\; x = -1`]
   ],
   res:R`$x \in \{-1;\ 5\}$`},
  {ex:R`Vyrieš $|x - 3| = 2x$.`,
   steps:[
     [R`$x \geq 3$: $x - 3 = 2x$.`, R`x = -3 \notin \langle 3;\ \infty)`],
     [R`$x < 3$: $3 - x = 2x$.`, R`x = 1 \in (-\infty;\ 3) \ \checkmark`]
   ],
   res:R`$x = 1$. Skúška: $|1 - 3| = 2 = 2 \cdot 1$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{c}$ tak, aby mala rovnica $|2x - 4| = c$ práve jedno riešenie.`,
   hint:"Priamka sa musí dotknúť grafu v jeho najnižšom bode.",
   goal:P => P.c === 0,
   cfg:Object.assign({}, AV, {fns:[{f:"abs(2x-4)", lhs:"y"}, {f:"c", lhs:"y", color:"d"}],
     params:{c:{v:3, min:-1, max:8, step:.5, color:"d"}}})},
  {warn:R`Pri $|f(x)| = g(x)$ s neznámou na pravej strane nestačí napísať $f(x) = \pm g(x)$ bez kontroly: pravá strana musí byť nezáporná. Skúška to odhalí.`}
],

"Nerovnice s absolútnou hodnotou":[
  R`$|f(x)| < c$ znamená, že $f(x)$ je od nuly bližšie než $c$: leží medzi $-c$ a $c$. $|f(x)| > c$ znamená, že je ďalej: menšie než $-c$ alebo väčšie než $c$.`,
  {def:"Základné nerovnice", tex:R`\begin{aligned}|f(x)| < c &\;\Leftrightarrow\; -c < f(x) < c\\ |f(x)| > c &\;\Leftrightarrow\; f(x) < -c \;\vee\; f(x) > c\end{aligned}`},
  {tool:"os", ask:R`Nerovnica $|x - \vb{s}| < \va{r}$, a po prepnutí $|x - s| > r$. Ako sa líši tvar riešenia?`,
   take:R`„menej“ dáva jeden interval okolo $s$, „viac“ dve polpriamky smerom von. Sú navzájom doplnkom (okrem hraníc).`,
   cfg:{typ:"abs", s:{v:1}, r:{v:2}, toggles:["vonku", "rovne"]}},
  {ex:R`Vyrieš $|2x - 1| \leq 5$ a $|x + 1| > 3$.`,
   steps:[
     ["Dvojitá nerovnica.", R`-5 \leq 2x - 1 \leq 5 \;\Rightarrow\; -2 \leq x \leq 3`],
     ["Dve možnosti.", R`x + 1 < -3 \;\vee\; x + 1 > 3 \;\Rightarrow\; x < -4 \;\vee\; x > 2`]
   ],
   res:R`$\langle -2;\ 3 \rangle$ a $(-\infty;\ -4) \cup (2;\ \infty)$.`},
  {ex:R`Vyrieš $|x - 2| < 2x - 1$.`,
   steps:[
     [R`$x \geq 2$: $x - 2 < 2x - 1 \Rightarrow x > -1$. S intervalom:`, R`x \in \langle 2;\ \infty)`],
     [R`$x < 2$: $2 - x < 2x - 1 \Rightarrow x > 1$. S intervalom:`, R`x \in (1;\ 2)`],
     ["Zjednoť.", R`(1;\ \infty)`]
   ],
   res:R`$x \in (1;\ \infty)$`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi riešenie nerovnice $|2x - 1| \leq 5$.`,
   hint:R`$-5 \leq 2x - 1 \leq 5$.`,
   goal:P => P.a === -2 && P.la && P.b === 3 && P.lb && !P.linf && !P.rinf,
   cfg:{typ:"interval", a:{v:0}, b:{v:5}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`$|x| > 3$ nie je $-3 > x > 3$, to nespĺňa žiadne číslo. Pri „väčšie“ je výsledok vždy zjednotenie dvoch častí: $x < -3$ alebo $x > 3$.`}
],

"Geometrický význam — vzdialenosť na osi":[
  R`$|x - a|$ je vzdialenosť bodov $x$ a $a$ na číselnej osi ([[a13]]). Mnohé úlohy sa potom dajú vyriešiť úvahou, bez počítania: „Ktoré body sú od $a$ vzdialené menej než 3?“`,
  {def:"Vzdialenosť", tex:R`|x - a| = \text{vzdialenosť } x \text{ od } a,\qquad |x + a| = |x - (-a)|`},
  {ex:R`Vyrieš úvahou $|x + 3| = |x - 1|$ a $|x - 2| \leq 3$.`,
   steps:[
     [R`Bod rovnako vzdialený od $-3$ a od $1$ je v strede.`, R`x = \frac{-3 + 1}{2} = -1`],
     [R`Body od 2 vzdialené najviac 3.`, R`x \in \langle -1;\ 5 \rangle`]
   ],
   res:R`$x = -1$ a $x \in \langle -1;\ 5 \rangle$.`},
  {tool:"graf", ask:R`$y = |x - 1| + |x - 5|$ je súčet vzdialeností $x$ od bodov 1 a 5. Kde je najmenší?`,
   take:R`na celom úseku medzi 1 a 5 je súčet rovný 4, vzdialenosti bodov 1 a 5. Mimo neho rastie.`,
   cfg:{view:[-2, 9, 8, -1], tick:1, fns:[{f:"abs(x-1)+abs(x-5)", lhs:"y"}],
     params:{t:{v:3, min:-1, max:7, step:.5, color:"d", name:"x₀"}},
     show:[{pt:["t", "abs(t-1)+abs(t-5)"], color:"d"}, {pt:[1, 0], color:"a"}, {pt:[5, 0], color:"a"}],
     out:(P, h) => h.calc(R`|${h.tn(P.t)} - 1| + |${h.tn(P.t)} - 5| = ${h.tn(Math.abs(P.t - 1))} + ${h.tn(Math.abs(P.t - 5))} = ${h.tn(Math.abs(P.t - 1) + Math.abs(P.t - 5))}`)}},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{c}$ tak, aby mala rovnica $|x - 1| + |x - 5| = c$ nekonečne veľa riešení.`,
   hint:"Súčet vzdialeností od dvoch bodov je konštantný medzi nimi.",
   goal:P => P.c === 4,
   cfg:{view:[-2, 9, 8, -1], tick:1, fns:[{f:"abs(x-1)+abs(x-5)", lhs:"y"}, {f:"c", lhs:"y", color:"d"}],
     params:{c:{v:6, min:2, max:8, step:.5, color:"d"}}}},
  {warn:R`Pri $|x + 3|$ je druhý bod $-3$, nie $3$: $|x + 3| = |x - (-3)|$.`}
]

  }
};
})();

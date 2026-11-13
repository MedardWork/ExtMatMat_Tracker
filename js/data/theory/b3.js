/* Logaritmické rovnice a nerovnice */
(() => {
const L = v => ({v, lock:true});
const t3 = (h, v) => h.tn(Math.round(v * 1000) / 1000);
const LV = {view:[-3, 4, 11, -3], tick:[1, 1], free:true, aspect:"2"};

THEORY.b3 = {
  mins:35,
  brief:[
    R`Podmienky: argument každého logaritmu $> 0$, základ $> 0$ a $\neq 1$.`,
    R`$\log_a f(x) = c \;\Leftrightarrow\; f(x) = a^c$.`,
    R`Pravidlami zlúč logaritmy do jedného, potom odlogaritmuj: $\log_a f = \log_a g \Rightarrow f = g$. Korene porovnaj s podmienkami.`,
    R`Nerovnica: pri základe $> 1$ znak ostáva, pri $0 < a < 1$ sa otočí. Prienik s podmienkami.`
  ],
  subs:{

"Podmienky (kladný argument)":[
  R`Logaritmus existuje len z kladného čísla. V rovnici preto najprv zapíš, pre ktoré $x$ majú všetky logaritmy zmysel. Na konci vyraď korene, ktoré podmienky nespĺňajú, presne ako pri rovniciach s neznámou v menovateli ([[a16]]).`,
  {def:"Podmienky", tex:R`\log_a f(x):\quad f(x) > 0,\qquad a > 0,\ a \neq 1`},
  {tool:"graf", ask:R`Graf $y = \log(x - \vd{a})$. Meň $\vd{a}$. Kde graf začína?`,
   take:R`graf existuje len pre $x > a$, kde je argument kladný. Pri $x = a$ má zvislú asymptotu.`,
   cfg:Object.assign({}, LV, {fns:[{f:"log(x-a)", lhs:"y"}],
     params:{a:{v:2, min:-2, max:6, step:1, color:"d"}},
     show:[{vline:"a", color:"d"}, {pt:["a+1", 0], color:"c"}],
     out:(P, h) => h.calc(R`x - \vd{${P.a}} > 0 \;\Rightarrow\; x > \vd{${P.a}}`)})},
  {ex:R`Urči podmienky rovníc: a) $\log(x - 3) + \log(x + 1) = 1$, b) $\log_x 5 = 2$, c) $\log(x^2 - 4) = 0$.`,
   steps:[
     [R`a) Oba argumenty kladné.`, R`x > 3 \wedge x > -1 \;\Rightarrow\; x > 3`],
     ["b) Neznáma v základe.", R`x > 0,\ x \neq 1`],
     ["c) Kvadratická nerovnica.", R`x^2 > 4 \;\Rightarrow\; |x| > 2`]
   ],
   res:R`a) $(3;\ \infty)$; b) $(0;\ 1) \cup (1;\ \infty)$; c) $(-\infty;\ -2) \cup (2;\ \infty)$.`},
  {warn:R`Podmienky sa píšu pre **pôvodnú** rovnicu. Po zlúčení $\log(x - 3) + \log(x + 1) = \log((x - 3)(x + 1))$ by stačilo $(x - 3)(x + 1) > 0$, a to pripustí aj $x < -1$, čo je chyba.`}
],

"Riešenie podľa definície":[
  R`Ak je v rovnici jediný logaritmus a na druhej strane číslo, prepíš rovnicu podľa definície logaritmu na mocninu. Logaritmus zmizne.`,
  {def:"Podľa definície", tex:R`\log_a f(x) = \vb{c} \;\Leftrightarrow\; f(x) = a^{\vb{c}}`},
  {tool:"graf", ask:R`Rovnica $\log_2(x - 1) = \vb{c}$: priesečník grafu s priamkou $y = c$. Meň $\vb{c}$. Kde je riešenie?`,
   take:R`riešenie je $x = 2^c + 1$. Pre každé $c$ existuje práve jedno, lebo logaritmus nadobúda všetky reálne hodnoty.`,
   cfg:Object.assign({}, LV, {fns:[{f:"ln(x-1)/ln(2)", lhs:"y"}],
     params:{c:{v:3, min:-2, max:3, step:.5, color:"b"}},
     show:[{hline:"c", color:"b"}, {pt:["2^c+1", "c"], color:"a"}, {drop:["2^c+1", "c"], color:"a"}, {vline:1, color:"soft"}],
     out:(P, h) => h.calc(R`x - 1 = 2^{\vb{${h.tn(P.c)}}} \;\Rightarrow\; x ${Number.isInteger(P.c) && P.c >= 0 ? "=" : "\\doteq"} ${t3(h, 2 ** P.c + 1)}`)})},
  {ex:R`Vyrieš $\log_2(x - 1) = 3$ a $\log x = -1$.`,
   steps:[
     ["Podľa definície.", R`x - 1 = 2^3 = 8 \;\Rightarrow\; x = 9`],
     [R`Dekadický: $10^{-1}$.`, R`x = 0{,}1`]
   ],
   res:R`$x = 9$ a $x = 0{,}1$, obe spĺňajú podmienky.`},
  {ex:R`Vyrieš $\log_3(x^2 - 1) = 1$.`,
   steps:[
     ["Podľa definície.", R`x^2 - 1 = 3 \;\Rightarrow\; x^2 = 4 \;\Rightarrow\; x = \pm 2`],
     [R`Podmienka $x^2 - 1 > 0$: pre $\pm 2$ je argument 3.`, R`3 > 0`]
   ],
   res:R`$x \in \{-2;\ 2\}$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{c}$ tak, aby mala rovnica $\log_2(x - 1) = c$ riešenie $x = 5$.`,
   hint:R`$\log_2 4$.`,
   goal:P => P.c === 2,
   cfg:Object.assign({}, LV, {fns:[{f:"ln(x-1)/ln(2)", lhs:"y"}],
     params:{c:{v:0, min:-2, max:3, step:.5, color:"b"}},
     show:[{hline:"c", color:"b"}, {vline:5, color:"soft"}],
     out:(P, h) => h.calc(R`\log_2(x - 1) = \vb{${h.tn(P.c)}}`)})},
  {warn:R`$\log_2(x - 1) = 3$ neznamená $x - 1 = 3 \cdot 2$ ani $x - 1 = 3^2$. Základ sa umocňuje na pravú stranu: $2^3$.`}
],

"Úprava pravidlami a odlogaritmovanie":[
  R`Ak je v rovnici viac logaritmov, pravidlami ([[b1]]) ich zlúč do jedného na každej strane. Potom **odlogaritmuj**: logaritmická funkcia je prostá, takže z rovnosti logaritmov plynie rovnosť argumentov.`,
  {def:"Odlogaritmovanie", tex:R`\log_a f(x) = \log_a g(x) \;\Rightarrow\; f(x) = g(x)`, note:"Číslo na pravej strane zapíš tiež ako logaritmus: $1 = \\log 10$, $2 = \\log 100$."},
  {ex:R`Vyrieš $\log x + \log(x - 3) = 1$.`,
   steps:[
     [R`Podmienky: $x > 0$, $x > 3$, spolu $x > 3$.`, R`\log x(x - 3) = \log 10`],
     ["Odlogaritmuj.", R`x^2 - 3x - 10 = 0 \;\Rightarrow\; x = 5 \vee x = -2`],
     [R`$-2$ nespĺňa podmienku.`, R`x = 5`]
   ],
   res:R`$x = 5$`},
  {tool:"graf", kind:"obr", ask:R`Rovnica $\log x + \log(x - 3) = 1$ v grafe.`,
   take:R`graf ľavej strany existuje len pre $x > 3$ a priamku $y = 1$ pretne raz, v bode $x = 5$. Koreň $-2$ je cudzí.`,
   cfg:Object.assign({}, LV, {fns:[{f:"log(x)+log(x-3)", lhs:"y"}, {f:"1", lhs:"y", color:"c"}],
     show:[{pt:[5, 1], color:"d", label:"x = 5", at:"tl"}, {vline:3, color:"soft"}]})},
  {ex:R`Vyrieš $\log_2(x + 1) - \log_2(x - 1) = 1$.`,
   steps:[
     [R`Podmienka $x > 1$. Rozdiel je logaritmus podielu.`, R`\log_2 \frac{x + 1}{x - 1} = \log_2 2`],
     ["Odlogaritmuj.", R`x + 1 = 2(x - 1) \;\Rightarrow\; x = 3`]
   ],
   res:R`$x = 3$`},
  {ex:R`Vyrieš $\log^2 x - 3\log x + 2 = 0$.`,
   steps:[
     [R`Substitúcia $t = \log x$ (podmienka $x > 0$).`, R`t^2 - 3t + 2 = 0 \;\Rightarrow\; t = 1 \vee t = 2`],
     ["Späť.", R`\log x = 1 \Rightarrow x = 10,\quad \log x = 2 \Rightarrow x = 100`]
   ],
   res:R`$x \in \{10;\ 100\}$`},
  {warn:R`Odlogaritmovať sa smie, len keď je na každej strane **jediný** logaritmus. Z $\log x + \log 2 = \log 8$ nevyplýva $x + 2 = 8$, správne $2x = 8$.`}
],

"Logaritmické nerovnice":[
  R`Nerovnica sa rieši ako rovnica, s dvoma rozdielmi. Pri základe medzi 0 a 1 sa po odlogaritmovaní otočí znak, lebo funkcia klesá. A výsledok sa vždy spojí s podmienkami (prienik).`,
  {def:"Logaritmická nerovnica", tex:R`\log_a f(x) < \log_a g(x) \;\Leftrightarrow\; \begin{cases} 0 < f(x) < g(x) & a > 1\\ f(x) > g(x) > 0 & 0 < a < 1\end{cases}`},
  {tool:"graf", ask:R`Graf $y = \log_a x$ a priamka $y = -2$. Meň základ $\va{a}$. Pre ktoré $x$ je graf nad priamkou?`,
   take:R`pre $a > 1$ vpravo od priesečníka. Pre $0 < a < 1$ vľavo, od nuly po priesečník: tam sa znak otočí. Pri $a = \frac{1}{2}$ je to $(0;\ 4\rangle$.`,
   cfg:Object.assign({}, LV, {view:[-1, 4, 11, -4], fns:[{f:"ln(x)/ln(a)", lhs:"y", dom:[.01, 11]}, {f:"-2", lhs:"y", color:"c"}],
     params:{a:{v:.5, min:.25, max:4, step:.25, color:"a"}},
     show:[{pt:["a^(-2)", -2], color:"d", if:P => P.a !== 1 && P.a ** -2 < 11}],
     out:(P, h) => P.a === 1 ? h.pill("základ 1 nie je dovolený", "down") : h.calc(R`\log_{\va{${h.tn(P.a)}}} x \geq -2 \;\Leftrightarrow\; ${P.a > 1 ? `x \\geq ${t3(h, P.a ** -2)}` : `0 < x \\leq ${t3(h, P.a ** -2)}`}`)})},
  {ex:R`Vyrieš $\log_2(x - 1) < 3$ a $\log_{\frac{1}{2}} x \geq -2$.`,
   steps:[
     [R`Základ 2: znak ostáva. Podmienka $x - 1 > 0$.`, R`0 < x - 1 < 8 \;\Rightarrow\; 1 < x < 9`],
     [R`Základ $\frac{1}{2}$: znak sa otočí. $-2 = \log_{\frac{1}{2}} 4$.`, R`0 < x \leq 4`]
   ],
   res:R`$(1;\ 9)$ a $(0;\ 4\rangle$.`},
  {ex:R`Vyrieš $\log(2x - 1) > \log(x + 2)$.`,
   steps:[
     [R`Podmienky: $x > \frac{1}{2}$ a $x > -2$, spolu $x > \frac{1}{2}$.`, R`2x - 1 > x + 2 \;\Rightarrow\; x > 3`],
     ["Prienik s podmienkami.", R`x \in (3;\ \infty)`]
   ],
   res:R`$x \in (3;\ \infty)$`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi riešenie nerovnice $\log_2(x - 1) < 3$.`,
   hint:R`Podmienka $x > 1$ a $x - 1 < 2^3$.`,
   goal:P => P.a === 1 && !P.la && P.b === 9 && !P.lb && !P.linf && !P.rinf,
   cfg:{typ:"interval", min:-1, max:11, step:1, a:{v:0}, b:{v:5}, on:{la:true}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`Bez podmienok vyjde z $\log_2(x - 1) < 3$ len $x < 9$, a do riešenia by sa dostali aj čísla, pre ktoré logaritmus neexistuje. Vždy rob prienik s podmienkami.`}
]

  }
};
})();

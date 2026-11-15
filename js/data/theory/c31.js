/* Exponential models, doubling time and half-life (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const EXP = [[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]];

THEORY.c31 = {
  mins:20,
  brief:[
    R`Exponential model $f(x) = b \cdot a^x$: $b = f(0)$ is the start value, $a$ the growth factor; growth rate $r = a - 1$ (e.g. $a = 1{,}05$: +5 % per unit).`,
    R`The same model as $f(x) = b \cdot e^{kx}$ with $k = \ln a$, $a = e^k$.`,
    R`Through two points: $a = \left(\frac{y_2}{y_1}\right)^{1/(x_2 - x_1)}$, then $b = \frac{y_1}{a^{x_1}}$.`,
    R`Doubling time $T_2 = \frac{\ln 2}{\ln a}$ ($a > 1$); half-life $T_{1/2} = \frac{\ln \frac{1}{2}}{\ln a}$ ($0 < a < 1$).`
  ],
  subs:{

"Models b · aˣ and b · e^(k·x)":[
  R`When a quantity is multiplied by the same factor in each time step (interest, population, radioactive decay), it follows an **exponential model**. Adding 1 to $x$ multiplies $f(x)$ by $a$. Written with base $e$, the exponent constant $k$ is the relative growth rate in the sense of differential equations ([[c14]]).`,
  {def:"Exponential model", tex:R`f(x) = \vb{b} \cdot \va{a}^x = \vb{b} \cdot e^{kx} \qquad k = \ln \va{a} \qquad r = \va{a} - 1`},
  {tool:"graf", ask:R`$f(x) = b \cdot a^x$. Change $b$ and $a$: what does each do?`,
   take:R`$b$ is where the graph cuts the $y$-axis; $a > 1$ gives growth, $0 < a < 1$ decay, and the further from 1, the faster.`,
   cfg:{fns:["b*a^x"], params:{b:{v:2, min:.5, max:5, step:.5, color:"b"}, a:{v:1.5, min:.5, max:2.5, step:.05, color:"a"}}, view:[-3, 12, 6, -1], tick:[1, 2], free:true, aspect:"4/3"}},
  {ex:R`An exponential function has $f(2) = 12$ and $f(5) = 96$. Find $b$ and $a$, and write it with base $e$.`,
   steps:[
     ["Ratio of the values over 3 steps.", R`a^3 = \frac{96}{12} = 8 \Rightarrow a = 2`],
     ["Start value.", R`b = \frac{12}{2^2} = 3`],
     ["Base e.", R`k = \ln 2 \approx 0{,}693:\quad f(x) = 3e^{0{,}693x}`]
   ],
   res:R`$f(x) = 3 \cdot 2^x = 3e^{0{,}693x}$.`},
  {tool:"graf", kind:"uloha", ask:R`Set $b$ and $a$ so that the graph passes through both marked points $[0;\ 2]$ and $[2;\ 8]$.`,
   hint:"b = f(0) = 2, then a² = 8/2 = 4.",
   goal:P => P.b === 2 && Math.abs(P.a - 2) < 1e-6,
   cfg:{fns:["b*a^x"], params:{b:{v:1, min:.5, max:5, step:.5, color:"b"}, a:{v:1.5, min:.5, max:2.5, step:.05, color:"a"}}, view:[-3, 12, 6, -1], tick:[1, 2], free:true, aspect:"4/3",
     show:[{target:[0, 2], fn:0, label:"[0; 2]"}, {target:[2, 8], fn:0, label:"[2; 8]"}]}},
  {tool:"regresia", ask:R`Data that grow by roughly the same factor each step, with the fitted model $y = b \cdot a^x$. Drag a point and watch $a$, $b$ and $r^2$.`,
   take:R`the fit gives about $y = 2{,}05 \cdot 1{,}454^x$: growth by about 45 % per step, $r^2 \approx 0{,}9996$.`,
   cfg:{model:"exp", en:true, data:EXP}},
  {warn:R`The growth rate is $a - 1$, not $a$: $a = 1{,}05$ means +5 %, and $a = 0{,}9$ means −10 %. And $k = \ln a$ is close to the rate only when the rate is small.`}
],

"Doubling time and half-life":[
  R`An exponential function needs the same time to double, wherever you start: the **doubling time**. A decaying one halves in a fixed time, the **half-life**. Both follow from $a^T = 2$ or $a^T = \frac{1}{2}$ by taking logarithms.`,
  {def:"Doubling time and half-life", tex:R`T_2 = \frac{\ln 2}{\ln \va{a}} = \frac{\ln 2}{k} \qquad T_{1/2} = \frac{\ln \frac{1}{2}}{\ln \va{a}} = -\frac{\ln 2}{k}`},
  {tool:"regresia", ask:R`The fitted exponential model also prints the doubling time. Drag the last point down and see how it changes.`,
   take:R`for $a \approx 1{,}454$ the doubling time is about $1{,}85$: $\frac{\ln 2}{\ln 1{,}454}$. Slower growth means a longer doubling time.`,
   cfg:{model:"exp", en:true, data:EXP}},
  {ex:R`A population grows by 3,5 % per year. Find its doubling time.`,
   steps:[
     ["Growth factor.", R`a = 1{,}035`],
     ["Doubling time.", R`T_2 = \frac{\ln 2}{\ln 1{,}035} \approx 20{,}1\ \text{years}`]
   ],
   res:"About 20 years."},
  {ex:R`Carbon-14 has a half-life of 5730 years. What fraction is left after 2000 years?`,
   steps:[
     ["After t years.", R`\left(\tfrac{1}{2}\right)^{t/5730}`],
     ["t = 2000.", R`0{,}5^{2000/5730} \approx 0{,}785`]
   ],
   res:"About 78,5 %."},
  {tool:"graf", kind:"uloha", ask:R`$f(x) = 100 \cdot a^x$. Set $a$ so that the half-life is 1 (the graph through the marked points).`,
   hint:"Halving in one step: a = 1/2.",
   goal:P => Math.abs(P.a - .5) < 1e-6,
   cfg:{fns:["100*a^x"], params:{a:{v:.8, min:.3, max:1.2, step:.05, color:"a"}}, view:[-1, 120, 5, -10], tick:[1, 20], free:true, aspect:"4/3",
     show:[{target:[1, 50], fn:0, label:"[1; 50]"}, {target:[2, 25], fn:0, label:"[2; 25]"}]}},
  {warn:R`The doubling time does not depend on $b$, only on $a$. A doubling time of 20 years does not mean "+100 % in 20 years, so +5 % per year": $1{,}05^{20} \approx 2{,}65$.`}
]

  }
};
})();

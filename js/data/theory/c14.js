/* The standard differential equations: y′ = ky, y′ = b − ay, logistic growth (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c14 = {
  mins:30,
  brief:[
    R`$y' = k \cdot y$: $y = C e^{kx}$. Growth ($k > 0$) or decay ($k < 0$) in proportion to the size.`,
    R`$y' = b - a \cdot y$: $y = \frac{b}{a} + C e^{-ax}$. Every solution approaches the equilibrium $\frac{b}{a}$ (Newton's law of cooling).`,
    R`Logistic $y' = a \cdot y \cdot (M - y)$: $y = \frac{M}{1 + C e^{-aMx}}$. Growth levels off at the carrying capacity $M$.`,
    R`These solution formulas are in the formula booklet; $C$ comes from the initial condition.`
  ],
  subs:{

"y′ = k · y":[
  R`If a quantity grows in proportion to its own size (bacteria, money with continuous interest, radioactive decay with $k < 0$), its rate of change is $k \cdot y$. The solutions are exactly the exponential functions.`,
  {def:"Exponential growth and decay", tex:R`y' = \vb{k} \cdot y \iff y = C\,e^{\vb{k}x} \qquad y(0) = C`,
   note:"Doubling time ln 2 / k for k > 0, half-life ln 2 / |k| for k < 0."},
  {tool:"smerpole", ask:R`$y' = k \cdot y$ through $A = [0, 1]$. Change $k$, then drag $A$.`,
   take:R`for $k > 0$ the solutions explode, for $k < 0$ they decay to 0, and $y = 0$ is the equilibrium. Moving $A$ only multiplies the curve by a constant.`,
   cfg:{f:"k*y", en:true, params:{k:{v:.5, min:-1, max:1, step:.1, color:"b"}}, start:[0, 1]}},
  {ex:R`A culture of 500 bacteria grows by $N' = 0{,}2N$ ($t$ in hours). Find $N(t)$, $N(10)$ and the doubling time.`,
   steps:[
     ["Solution with N(0) = 500.", R`N(t) = 500\,e^{0{,}2t}`],
     ["After 10 hours.", R`N(10) = 500\,e^{2} \approx 3\,695`],
     ["Doubling time.", R`e^{0{,}2T} = 2 \Rightarrow T = \frac{\ln 2}{0{,}2} \approx 3{,}47\ \text{h}`]
   ],
   res:"N(t) = 500·e^(0,2t), about 3 695 bacteria after 10 h, doubling every 3,47 h."},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = k \cdot y$ with $y(0) = 1$. Choose $k$ so that the solution halves when $x$ grows by about 1,4 (a decay with half-life $\approx 1{,}4$).`,
   hint:"Half-life ln 2 / |k| = 1,4 gives |k| ≈ 0,5, and decay means k < 0.",
   goal:P => Math.abs(P.k + .5) < 1e-6,
   cfg:{f:"k*y", en:true, params:{k:{v:.5, min:-1, max:1, step:.1, color:"b"}}, start:[0, 1], fixed:true, view:[-1, 3, 6, -1]}},
  {warn:R`$y' = ky$ is about the **rate**: if $N' = 0{,}2N$, the population grows by 20 % of its size per hour at each moment, which is more than 20 % over a whole hour ($e^{0{,}2} \approx 1{,}221$).`}
],

"y′ = b − a · y":[
  R`Here the rate is proportional to the **distance from a level**: $y' = b - ay = -a\left(y - \frac{b}{a}\right)$. Tea cools faster the hotter it is compared with the room, and a medicine level settles where intake equals elimination. All solutions approach the equilibrium $\frac{b}{a}$.`,
  {def:"Approach to an equilibrium", tex:R`y' = \vb{b} - \vd{a} \cdot y \iff y = \frac{\vb{b}}{\vd{a}} + C\,e^{-\vd{a}x}`},
  {tool:"smerpole", ask:R`$y' = b - a \cdot y$. Change $b$ and $a$ and drag $A$ above and below the equilibrium.`,
   take:R`every solution moves towards the horizontal line $y = \frac{b}{a}$, from above or from below; $a$ sets how fast.`,
   cfg:{f:"b - a*y", en:true, params:{b:{v:2, min:0, max:4, step:.5, color:"b"}, a:{v:1, min:.5, max:2, step:.5, color:"d"}}, start:[0, 0], view:[-1, 5, 7, -1]}},
  {ex:R`Tea at $80\,^\circ\text{C}$ cools in a $20\,^\circ\text{C}$ room by $T' = -0{,}1(T - 20)$ ($t$ in minutes). Find $T(t)$, $T(10)$ and when the tea has $30\,^\circ\text{C}$.`,
   steps:[
     [R`$T' = 2 - 0{,}1T$, so $b = 2$, $a = 0{,}1$, $\frac{b}{a} = 20$.`, R`T(t) = 20 + C e^{-0{,}1t}`],
     ["T(0) = 80.", R`C = 60`],
     ["After 10 minutes.", R`T(10) = 20 + 60e^{-1} \approx 42{,}1\,^\circ\text{C}`],
     ["30 °C.", R`60e^{-0{,}1t} = 10 \Rightarrow t = 10 \ln 6 \approx 17{,}9\ \text{min}`]
   ],
   res:"T(t) = 20 + 60·e^(−0,1t); 42,1 °C after 10 minutes, 30 °C after about 18 minutes."},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = b - y$ ($a = 1$). Set $b$ so that the solutions settle at $y = 3$.`,
   hint:"The equilibrium is b / a.",
   goal:P => P.b === 3,
   cfg:{f:"b - a*y", en:true, params:{b:{v:1, min:0, max:4, step:.5, color:"b"}, a:L(1)}, start:[0, 0], view:[-1, 5, 7, -1]}},
  {warn:R`In $T' = -0{,}1(T - 20)$ the equilibrium is the room temperature 20, not $-0{,}1$ or 2. Write the equation as $y' = b - ay$ first, then read $\frac{b}{a}$.`}
],

"Logistic growth":[
  R`Unlimited exponential growth is unrealistic: food and space run out. In the **logistic** model the growth rate is $a \cdot y \cdot (M - y)$: almost exponential while $y$ is small, slowing down as $y$ approaches the **carrying capacity** $M$. The solution is an S-shaped curve.`,
  {def:"Logistic growth", tex:R`y' = \vb{a} \cdot y \cdot (\vd{M} - y) \iff y = \frac{\vd{M}}{1 + C\,e^{-\vb{a}\vd{M}x}}`,
   note:"Equilibria y = 0 and y = M. The growth is fastest at y = M/2, the inflection point of the S-curve."},
  {tool:"smerpole", ask:R`$y' = a \cdot y \cdot (M - y)$. Change $M$ and $a$, and drag $A$ above $M$.`,
   take:R`from below, the curve rises in an S-shape towards $M$; from above, it falls to $M$. The steepest point is at height $\frac{M}{2}$.`,
   cfg:{f:"a*y*(M - y)", en:true, params:{a:{v:.3, min:.1, max:.6, step:.05, color:"b"}, M:{v:4, min:2, max:5, step:.5, color:"d"}}, start:[0, .5], view:[-1, 6, 9, -1]}},
  {ex:R`A population follows $y' = 0{,}002\,y\,(500 - y)$ with $y(0) = 50$ ($t$ in years). Find $y(t)$, $y(2)$, when the growth is fastest and how fast it is then.`,
   steps:[
     [R`$M = 500$, $aM = 1$.`, R`y = \frac{500}{1 + Ce^{-t}}`],
     ["y(0) = 50.", R`\frac{500}{1 + C} = 50 \Rightarrow C = 9`],
     ["After 2 years.", R`y(2) = \frac{500}{1 + 9e^{-2}} \approx 225`],
     ["Fastest at y = 250.", R`1 + 9e^{-t} = 2 \Rightarrow t = \ln 9 \approx 2{,}2`],
     ["Rate then.", R`y' = 0{,}002 \cdot 250 \cdot 250 = 125\ \text{per year}`]
   ],
   res:"y(t) = 500 / (1 + 9e^(−t)); about 225 after 2 years; fastest growth (125 per year) after about 2,2 years."},
  {warn:R`In the booklet formula the exponent is $-aMx$, not $-ax$. Writing the equation as $y' = ay(M - y)$ first tells you both $a$ and $M$.`}
]

  }
};
})();

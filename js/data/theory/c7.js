/* Newton's method (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const D = st => st.h && st.h.der;
const ROOT = -1.7692923542;

THEORY.c7 = {
  mins:20,
  brief:[
    R`Newton's method finds a zero of $f$ numerically: replace the graph by its tangent and take the tangent's zero as the next guess.`,
    R`$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$.`,
    R`Near a simple zero the method is very fast: the number of correct digits roughly doubles in each step.`,
    R`It fails when $f'(x_n) = 0$ (horizontal tangent) and can jump away or cycle from a bad start. Start close to the zero, read it off a graph.`
  ],
  subs:{

"Newton's iteration":[
  R`Most equations, like $x^3 - x - 1 = 0$, cannot be solved by a formula. Newton's idea: near the point $[x_n, f(x_n)]$ the graph is almost its tangent, and the zero of the tangent is easy to find. That zero is the next guess $x_{n+1}$.`,
  {def:"Newton's iteration", tex:R`x_{n+1} = \va{x_n} - \frac{f(\va{x_n})}{f'(\va{x_n})}`,
   note:"The tangent at xₙ is y = f′(xₙ)(x − xₙ) + f(xₙ). Setting y = 0 gives the formula."},
  {tool:"derivacia", ask:R`$f(x) = x^2 - 2$, start $x_0 = 3$. Add steps one by one and follow the tangents.`,
   take:R`each tangent meets the $x$-axis closer to $\sqrt{2} \approx 1{,}41421$. After a few steps the guesses no longer change.`,
   cfg:{typ:"newton", en:true}},
  {ex:R`Use Newton's method on $f(x) = x^2 - 2$ with $x_0 = 1$ to approximate $\sqrt{2}$.`,
   steps:[
     ["Iteration.", R`x_{n+1} = x_n - \frac{x_n^2 - 2}{2x_n}`],
     ["Step 1.", R`x_1 = 1 - \frac{-1}{2} = 1{,}5`],
     ["Step 2.", R`x_2 = 1{,}5 - \frac{0{,}25}{3} \approx 1{,}416667`],
     ["Step 3.", R`x_3 \approx 1{,}414216`],
     ["Step 4.", R`x_4 \approx 1{,}414214`]
   ],
   res:R`$\sqrt{2} \approx 1{,}414214$ after four steps (correct to six decimals).`},
  {ex:R`Solve $x^3 - x - 1 = 0$ with $x_0 = 1{,}5$.`,
   steps:[
     ["Derivative.", R`f'(x) = 3x^2 - 1`],
     ["Step 1.", R`x_1 = 1{,}5 - \frac{0{,}875}{5{,}75} \approx 1{,}347826`],
     ["Steps 2 and 3.", R`x_2 \approx 1{,}325200,\quad x_3 \approx 1{,}324718`],
     ["Step 4 gives the same six decimals.", R`x_4 \approx 1{,}324718`]
   ],
   res:R`$x \approx 1{,}3247$.`},
  {tool:"derivacia", ask:R`$f(x) = x^3 - x - 1$ from $x_0 = 1{,}5$. Compare the iterates with the example.`,
   take:R`the first step already lands close; from then on every step adds correct digits.`,
   cfg:{typ:"newton", en:true, f:"x^3 - x - 1", x0:{v:1.5}, view:[-1, 4, 3, -2], apart:false}},
  {warn:R`Stop when two successive guesses agree to the accuracy you need, and check by substituting: $f(x_n)$ should be close to 0.`}
],

"Choosing a starting point":[
  R`Newton's method does not always work. If the tangent at $x_n$ is horizontal, it never meets the axis ($f'(x_n) = 0$, division by zero). If the tangent is almost horizontal, the next guess lands far away. And for some functions the guesses jump back and forth for ever.`,
  {cards:[
    {t:"Horizontal tangent", d:"f′(xₙ) = 0: the formula divides by zero. Example: x² − 2 from x₀ = 0."},
    {t:"Far jump", d:"A nearly flat tangent sends the next guess far away, maybe towards another zero."},
    {t:"Cycle", d:"x³ − 2x + 2 from x₀ = 0 gives 0, 1, 0, 1, … and never converges."}
  ]},
  {tool:"derivacia", ask:R`$f(x) = x^3 - 2x + 2$ from $x_0 = 0$. Follow the tangents.`,
   take:R`$x_1 = 1$, $x_2 = 0$: the guesses cycle between 0 and 1 and never reach the zero near $-1{,}77$.`,
   cfg:{typ:"newton", en:true, f:"x^3 - 2*x + 2", x0:{v:0}, view:[-3, 6, 2, -3], apart:false}},
  {tool:"derivacia", kind:"uloha", ask:R`Same function. Choose a starting point from which the method finds the zero.`,
   hint:"Look at the graph: the zero is near −1,8. Start to the left of the bump, e.g. at −2.",
   take:R`from $x_0 = -2$: $-1{,}8$; $-1{,}769948$; $-1{,}769293$. A start near the zero works.`,
   goal:(P, st) => !!D(st) && Math.abs(D(st).xs[6] - ROOT) < 1e-6,
   cfg:{typ:"newton", en:true, f:"x^3 - 2*x + 2", x0:{v:0}, view:[-3, 6, 2, -3], apart:false}},
  {steps:[
    {t:"Draw", d:"Plot f and see roughly where it crosses the x-axis."},
    {t:"Start close", d:"Take x₀ near that crossing, away from places where the graph is flat."},
    {t:"Several zeros", d:"Each zero needs its own starting point near it."}
  ]},
  {warn:R`The method finds **one** zero, the one its start leads to. A cubic can have three zeros: to find them all, start near each one.`}
]

  }
};
})();

/* Integration rules and substitution (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c10 = {
  mins:25,
  brief:[
    R`$\int (f + g)\,dx = \int f\,dx + \int g\,dx$ and $\int k f\,dx = k \int f\,dx$. There is **no** simple rule for products.`,
    R`Substitution: $\int f(g(x))\,g'(x)\,dx = F(g(x)) + C$. Look for an inner function whose derivative is also a factor.`,
    R`In practice: $t = g(x)$, $dt = g'(x)\,dx$, integrate in $t$, put $g(x)$ back.`,
    R`For a definite integral, change the limits too: $\int_a^b f(g(x))g'(x)\,dx = \int_{g(a)}^{g(b)} f(t)\,dt$.`
  ],
  subs:{

"Integration rules":[
  R`Like derivatives, integrals can be taken **term by term**, and constant factors stay in front. Together with the table of basic integrals ([[c8]]) this handles every polynomial and many other sums.`,
  {def:"Linearity", tex:R`\int \big(f(x) + g(x)\big)dx = \int f(x)\,dx + \int g(x)\,dx \qquad \int k\,f(x)\,dx = k \int f(x)\,dx`},
  {ex:R`Find $\int \left(3x^2 - \frac{4}{x} + 2e^x\right)dx$.`,
   steps:[
     ["Term by term.", R`3 \cdot \frac{x^3}{3} - 4\ln|x| + 2e^x + C`],
     ["Simplify.", R`x^3 - 4\ln|x| + 2e^x + C`]
   ],
   res:R`$x^3 - 4\ln|x| + 2e^x + C$.`},
  {ex:R`Compute $\int_0^1 (6x^2 - 2x)\,dx$.`,
   steps:[
     ["Antiderivative.", R`F(x) = 2x^3 - x^2`],
     ["Limits.", R`F(1) - F(0) = (2 - 1) - 0 = 1`]
   ],
   res:"1."},
  {tool:"integral", ask:R`$f(x) = 6x^2 - 2x$ with the antiderivative $F(x) = 2x^3 - x^2$ from the example. Check the result and try other limits.`,
   take:R`$F(b) - F(a)$ always equals the signed area; for $[0, 1]$ it is 1. The small dip below the axis near 0 is subtracted.`,
   cfg:{typ:"plocha", en:true, f:"6*x^2 - 2*x", F:"2*x^3 - x^2", a:{v:0}, b:{v:1}, view:[-1, 5, 1.5, -1], apart:true, tick:[.5, 1], aspect:"4/3"}},
  {tool:"integral", kind:"uloha", ask:R`$f(x) = 3x^2$ with $F(x) = x^3$. Move $b$ so that $\int_0^b 3x^2\,dx = 8$.`,
   hint:"b³ − 0 = 8.",
   goal:P => P.b === 2,
   cfg:{typ:"plocha", en:true, f:"3*x^2", F:"x^3", a:L(0), b:{v:1}, view:[-1, 13, 3, -1], apart:true, tick:[1, 2], aspect:"4/3"}},
  {warn:R`$\int f \cdot g\,dx \neq \int f\,dx \cdot \int g\,dx$. For $x \cdot x$ that would give $\frac{x^2}{2} \cdot \frac{x^2}{2} = \frac{x^4}{4}$ instead of $\frac{x^3}{3}$. Multiply out first, or use substitution.`}
],

"Integration by substitution":[
  R`The chain rule says $\big(F(g(x))\big)' = F'(g(x)) \cdot g'(x) = f(g(x)) \cdot g'(x)$. Read backwards: if the integrand is "a function of an inner function, times the derivative of the inner function", its integral is $F(g(x))$. We write $t = g(x)$ and $dt = g'(x)\,dx$, and the integral becomes a simple one in $t$.`,
  {def:"Substitution", tex:R`\int f(\vb{g(x)})\,\vb{g'(x)}\,dx = \int f(t)\,dt = F(\vb{g(x)}) + C \qquad t = \vb{g(x)},\ dt = \vb{g'(x)}\,dx`},
  {steps:[
    {t:"Choose t", d:"Take the inner function as t = g(x); its derivative should appear as a factor (up to a constant)."},
    {t:"Replace dx", d:"dt = g′(x) dx. Everything in x must disappear."},
    {t:"Integrate", d:"Integrate in t, then write g(x) instead of t. Check by differentiating."}
  ]},
  {ex:R`Find $\int 2x\,(x^2 + 1)^3\,dx$.`,
   steps:[
     [R`$t = x^2 + 1$, $dt = 2x\,dx$.`, R`\int t^3\,dt = \frac{t^4}{4} + C`],
     ["Back to x.", R`\frac{(x^2 + 1)^4}{4} + C`]
   ],
   res:R`$\frac{(x^2 + 1)^4}{4} + C$.`},
  {ex:R`Find $\int x\,e^{x^2}\,dx$ and $\int \cos(3x)\,dx$.`,
   steps:[
     [R`$t = x^2$, $dt = 2x\,dx$, so $x\,dx = \frac{1}{2}dt$.`, R`\int \tfrac{1}{2} e^t\,dt = \tfrac{1}{2}e^{x^2} + C`],
     [R`$t = 3x$, $dt = 3\,dx$, so $dx = \frac{1}{3}dt$.`, R`\int \tfrac{1}{3}\cos t\,dt = \tfrac{1}{3}\sin(3x) + C`]
   ],
   res:R`$\frac{1}{2}e^{x^2} + C$ and $\frac{1}{3}\sin(3x) + C$.`},
  {ex:R`Compute $\int_0^1 2x\,(x^2 + 1)^3\,dx$.`,
   steps:[
     [R`$t = x^2 + 1$: the limits change, $x = 0 \to t = 1$, $x = 1 \to t = 2$.`, R`\int_1^2 t^3\,dt`],
     ["Evaluate.", R`\left[\frac{t^4}{4}\right]_1^2 = \frac{16}{4} - \frac{1}{4} = \frac{15}{4} = 3{,}75`]
   ],
   res:R`$\frac{15}{4} = 3{,}75$.`},
  {tool:"integral", ask:R`$f(x) = 2x(x^2 + 1)^3$ with $F(x) = \frac{(x^2 + 1)^4}{4}$ found by substitution. Check the example on $[0, 1]$.`,
   take:R`$F(1) - F(0) = 4 - 0{,}25 = 3{,}75$, the same as with the new limits in $t$.`,
   cfg:{typ:"plocha", en:true, f:"2*x*(x^2 + 1)^3", F:"(x^2 + 1)^4/4", a:{v:0}, b:{v:1}, view:[-1.5, 20, 1.5, -20], apart:true, tick:[.5, 5], aspect:"4/3"}},
  {tool:"integral", kind:"uloha", ask:R`Same function, $b = 1$. Move $a$ so that $\int_a^1 f(x)\,dx = 0$.`,
   hint:"F(a) must equal F(1). F is even: F(−1) = F(1).",
   take:R`$f$ is odd (symmetric about the origin), so the areas on $[-1, 0]$ and $[0, 1]$ cancel.`,
   goal:P => P.a === -1,
   cfg:{typ:"plocha", en:true, f:"2*x*(x^2 + 1)^3", F:"(x^2 + 1)^4/4", a:{v:0}, b:L(1), view:[-1.5, 20, 1.5, -20], apart:true, tick:[.5, 5], aspect:"4/3"}},
  {warn:R`After substituting, no $x$ may remain, and with definite integrals either change the limits to $t$-values or substitute back before using the old limits. Mixing the two gives wrong numbers.`}
]

  }
};
})();

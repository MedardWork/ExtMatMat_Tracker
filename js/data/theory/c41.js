/* The part of the written exam without aids (Danish Matematik A) */
(() => {
const cmp = (rule, g) => (P, h) => h.calc(R`f'(\va{${h.tn(P.x0)}}) \approx ${h.tn(h.der.m)} \qquad ${rule} = ${h.tn(g(P.x0))}`);

THEORY.c41 = {
  mins:25,
  brief:[
    R`In the part without aids only pen, paper and the formula booklet are allowed: no CAS, no calculator.`,
    R`The tasks are short: a derivative, an equation, an integral, a tangent, a vector, reading a graph. Numbers are chosen to come out nicely.`,
    R`Know by heart the basic derivatives, the rules, the quadratic formula, logarithm rules and the basic integrals.`,
    R`Write each step; a clean, short solution with the key steps is the goal.`
  ],
  subs:{

"Differentiation by hand":[
  R`By hand you need the basic derivatives ($x^n$, $e^{kx}$, $\ln x$, $\sin x$, $\cos x$) and the rules: sum, constant factor, product and chain ([[c3]], [[c4]]). Typical tasks: differentiate, find the slope at a point, find the tangent.`,
  {def:"Basic derivatives to know by heart", tex:R`(x^n)' = nx^{n-1} \qquad (e^{kx})' = ke^{kx} \qquad (\ln x)' = \frac{1}{x} \qquad (\sin x)' = \cos x \qquad (\cos x)' = -\sin x`},
  {ex:R`Differentiate $f(x) = 2x^3 - \frac{4}{x} + 3\ln x$ and $g(x) = x\,e^{2x}$.`,
   steps:[
     [R`$-\frac{4}{x} = -4x^{-1}$.`, R`f'(x) = 6x^2 + \frac{4}{x^2} + \frac{3}{x}`],
     ["Product and chain rule.", R`g'(x) = e^{2x} + x \cdot 2e^{2x} = (1 + 2x)e^{2x}`]
   ],
   res:R`$f'(x) = 6x^2 + \frac{4}{x^2} + \frac{3}{x}$, $g'(x) = (1 + 2x)e^{2x}$.`},
  {tool:"derivacia", ask:R`Practise: $g(x) = x\,e^{2x}$. Check the hand result $(1 + 2x)e^{2x}$ against the slopes.`,
   take:R`the slopes match; at $x = -\frac{1}{2}$ the tangent is horizontal, where $1 + 2x = 0$.`,
   cfg:{typ:"dotycnica", en:true, f:"x*exp(2*x)", x0:{v:-.5}, view:[-3, 3, 1, -1], on:{der:true}, out:cmp(R`(1 + 2x_0)e^{2x_0}`, x => (1 + 2 * x) * Math.exp(2 * x))}},
  {ex:R`Find the tangent to $f(x) = x^2 - 4x + 1$ at $x_0 = 3$.`,
   steps:[
     ["Point.", R`f(3) = 9 - 12 + 1 = -2`],
     ["Slope.", R`f'(x) = 2x - 4,\quad f'(3) = 2`],
     ["Tangent.", R`y = 2(x - 3) - 2 = 2x - 8`]
   ],
   res:R`$y = 2x - 8$.`},
  {warn:R`Without CAS, a missed inner derivative is the most common loss: $(e^{2x})' = 2e^{2x}$, $\big((3x - 1)^4\big)' = 12(3x - 1)^3$.`}
],

"Equations by hand":[
  R`The equations in this part are built to be solved exactly: linear, quadratic (factorise or the formula), products equal to zero, simple exponential and logarithmic equations.`,
  {def:"Tools for equations", tex:R`ax^2 + bx + c = 0:\ x = \frac{-b \pm \sqrt{d}}{2a},\ d = b^2 - 4ac \qquad A \cdot B = 0 \iff A = 0 \vee B = 0 \qquad e^x = c \iff x = \ln c`},
  {ex:R`Solve $2x^2 - 8x + 6 = 0$ and $x\,(x - 3)\,e^x = 0$.`,
   steps:[
     ["Divide by 2 and factorise.", R`x^2 - 4x + 3 = (x - 1)(x - 3) = 0 \Rightarrow x = 1 \vee x = 3`],
     [R`Product: $e^x \neq 0$.`, R`x = 0 \vee x = 3`]
   ],
   res:"x = 1 or 3; x = 0 or 3."},
  {ex:R`Solve $3e^{2x} = 12$ and $\ln(x + 1) = 2$.`,
   steps:[
     ["Isolate and take ln.", R`e^{2x} = 4 \Rightarrow 2x = \ln 4 \Rightarrow x = \tfrac{1}{2}\ln 4 = \ln 2`],
     ["Exponentiate.", R`x + 1 = e^2 \Rightarrow x = e^2 - 1`]
   ],
   res:R`$x = \ln 2$; $x = e^2 - 1$ (leave exact answers without a calculator).`},
  {warn:R`Without a calculator, leave answers exact: $\ln 2$, $\sqrt{5}$, $e^2 - 1$. Do not try to give decimals unless the task asks and the numbers are easy.`}
],

"Simple integrals by hand":[
  R`By hand you integrate polynomials, $e^{kx}$, $\frac{1}{x}$, $\sin$ and $\cos$, and simple substitutions where the inner derivative is visible. Definite integrals and areas follow with $F(b) - F(a)$.`,
  {def:"Basic integrals to know by heart", tex:R`\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \qquad \int e^{kx}\,dx = \frac{1}{k}e^{kx} + C \qquad \int \frac{1}{x}\,dx = \ln|x| + C`},
  {ex:R`Compute $\int_0^2 (3x^2 - 2x + 1)\,dx$ and $\int_0^1 e^{2x}\,dx$.`,
   steps:[
     ["Antiderivative.", R`\big[x^3 - x^2 + x\big]_0^2 = 8 - 4 + 2 = 6`],
     ["Exponential.", R`\left[\tfrac{1}{2}e^{2x}\right]_0^1 = \tfrac{1}{2}(e^2 - 1)`]
   ],
   res:R`$6$ and $\frac{1}{2}(e^2 - 1)$.`},
  {ex:R`Find the area between $f(x) = 4 - x^2$ and the $x$-axis.`,
   steps:[
     ["Zeros.", R`x = \pm 2`],
     ["Integral (f ≥ 0 between them).", R`\int_{-2}^{2} (4 - x^2)\,dx = \left[4x - \tfrac{x^3}{3}\right]_{-2}^{2} = \tfrac{16}{3} + \tfrac{16}{3} = \tfrac{32}{3}`]
   ],
   res:R`$\frac{32}{3}$.`},
  {ex:R`Show that $F(x) = x\ln x - x$ is an antiderivative of $f(x) = \ln x$.`,
   steps:[
     ["Differentiate F (product rule).", R`F'(x) = 1 \cdot \ln x + x \cdot \tfrac{1}{x} - 1 = \ln x`]
   ],
   res:"F′ = f, so F is an antiderivative. Checking by differentiation is the typical „vis“ task here."},
  {warn:R`In $F(b) - F(a)$ put brackets around $F(a)$: with $a = -2$, $-\left(4 \cdot (-2) - \frac{(-2)^3}{3}\right) = -\left(-8 + \frac{8}{3}\right) = +\frac{16}{3}$.`}
]

  }
};
})();

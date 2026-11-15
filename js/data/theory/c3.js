/* Rules of differentiation: sum, constant multiple, product, chain (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const D = st => st.h && st.h.der;
/* the tool's slope next to the value the rule gives */
const cmp = (rule, g) => (P, h) => h.calc(R`f'(\va{${h.tn(P.x0)}}) \approx ${h.tn(h.der.m)} \qquad ${rule} = ${h.tn(g(P.x0))}`);

THEORY.c3 = {
  mins:25,
  brief:[
    R`$(f + g)' = f' + g'$ and $(k \cdot f)' = k \cdot f'$: differentiate term by term, constants stay.`,
    R`Product rule: $(f \cdot g)' = f' \cdot g + f \cdot g'$.`,
    R`Chain rule: $\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)$, outer derivative times inner derivative.`,
    R`Check a result by drawing $f'$: its height must equal the slope of the tangent everywhere.`
  ],
  subs:{

"Sum and constant multiple":[
  R`Derivatives from the definition take long. Instead we combine a few known derivatives with rules. The first two rules: the derivative of a **sum** is the sum of the derivatives, and a **constant factor** stays in front. We use $(x^n)' = n x^{n-1}$ ([[c4]]).`,
  {def:"Sum and constant multiple", tex:R`(f + g)' = f' + g' \qquad (k \cdot f)' = k \cdot f' \qquad (c)' = 0`},
  {tool:"derivacia", ask:R`$f(x) = x^3 - 4x$. By the rules $f'(x) = 3x^2 - 4$. Move $x_0$ and compare the slope of the tangent with the rule.`,
   take:R`the dashed graph of $f'$ is the parabola $3x^2 - 4$: the rule and the slopes agree everywhere.`,
   cfg:{typ:"dotycnica", en:true, f:"x^3 - 4*x", x0:{v:1.5}, view:[-3, 6, 3, -6], on:{der:true}, out:cmp(R`3x_0^2 - 4`, x => 3 * x * x - 4)}},
  {ex:R`Differentiate $f(x) = 4x^3 - 5x^2 + 7x - 2$.`,
   steps:[
     ["Term by term, constants in front.", R`4 \cdot 3x^2 - 5 \cdot 2x + 7 \cdot 1 - 0`],
     ["Simplify.", R`f'(x) = 12x^2 - 10x + 7`]
   ],
   res:R`$f'(x) = 12x^2 - 10x + 7$.`},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = x^3 - 3x$. Move $x_0$ to a point where the tangent is horizontal.`,
   hint:"f′(x) = 3x² − 3 = 0 gives x = 1 or x = −1.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"x^3 - 3*x", x0:{v:0}, view:[-3, 4, 3, -4]}},
  {warn:R`The constant term disappears ($(-2)' = 0$), but a constant **factor** stays: $(5x^2)' = 10x$, not $2x$.`}
],

"Product rule":[
  R`The derivative of a product is **not** the product of the derivatives. When both factors change, each contributes: the change of the first times the second, plus the first times the change of the second.`,
  {def:"Product rule", tex:R`(\va{f} \cdot \vb{g})' = \va{f}' \cdot \vb{g} + \va{f} \cdot \vb{g}'`},
  {ex:R`Differentiate $f(x) = (x^2 + 1)(x - 3)$ with the product rule and check by expanding.`,
   steps:[
     [R`$u = x^2 + 1$, $v = x - 3$, $u' = 2x$, $v' = 1$.`, R`f' = 2x(x - 3) + (x^2 + 1) \cdot 1`],
     ["Simplify.", R`= 2x^2 - 6x + x^2 + 1 = 3x^2 - 6x + 1`],
     ["Check: expand first.", R`f = x^3 - 3x^2 + x - 3 \Rightarrow f' = 3x^2 - 6x + 1`]
   ],
   res:R`$f'(x) = 3x^2 - 6x + 1$.`},
  {tool:"derivacia", ask:R`$f(x) = x \cdot e^x$. The product rule gives $f'(x) = 1 \cdot e^x + x \cdot e^x = (1 + x)e^x$. Compare with the slopes.`,
   take:R`the dashed $f'$ crosses the $x$-axis at $x = -1$, exactly where $(1 + x)e^x = 0$ and the tangent is horizontal.`,
   cfg:{typ:"dotycnica", en:true, f:"x*exp(x)", x0:{v:.5}, view:[-5, 4, 2, -2], on:{der:true}, out:cmp(R`(1 + x_0)e^{x_0}`, x => (1 + x) * Math.exp(x))}},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = x \cdot e^x$. Find the point where $f$ has its lowest value, i.e. where the tangent is horizontal.`,
   hint:"(1 + x)eˣ = 0 and eˣ is never 0, so x = −1.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"x*exp(x)", x0:{v:1}, view:[-5, 4, 2, -2]}},
  {ex:R`Differentiate $f(x) = x^2 \ln x$.`,
   steps:[
     [R`$u = x^2$, $v = \ln x$, $u' = 2x$, $v' = \frac{1}{x}$.`, R`f' = 2x \ln x + x^2 \cdot \frac{1}{x}`],
     ["Simplify.", R`= 2x \ln x + x = x(2\ln x + 1)`]
   ],
   res:R`$f'(x) = x(2 \ln x + 1)$ for $x > 0$.`},
  {warn:R`$(f \cdot g)' \neq f' \cdot g'$. For $x \cdot x = x^2$ that would give $1 \cdot 1 = 1$ instead of $2x$.`}
],

"Chain rule":[
  R`A **composite function** puts one function inside another: in $(3x + 1)^4$ the inner function is $3x + 1$, the outer one is "to the power 4". Differentiate the outer function with the inner left untouched, then multiply by the derivative of the inner function.`,
  {def:"Chain rule", tex:R`\big(\va{f}(\vb{g}(x))\big)' = \va{f}'(\vb{g}(x)) \cdot \vb{g}'(x)`,
   note:"Outer derivative (inner unchanged) times inner derivative."},
  {ex:R`Differentiate $(3x + 1)^4$, $e^{2x}$ and $\sin(3x)$.`,
   steps:[
     [R`Outer $u^4$, inner $3x + 1$.`, R`4(3x + 1)^3 \cdot 3 = 12(3x + 1)^3`],
     [R`Outer $e^u$, inner $2x$.`, R`e^{2x} \cdot 2 = 2e^{2x}`],
     [R`Outer $\sin u$, inner $3x$.`, R`\cos(3x) \cdot 3 = 3\cos(3x)`]
   ],
   res:R`$12(3x + 1)^3$, $2e^{2x}$, $3\cos(3x)$.`},
  {tool:"derivacia", ask:R`$f(x) = \sqrt{x^2 + 1}$. The chain rule gives $f'(x) = \frac{1}{2\sqrt{x^2 + 1}} \cdot 2x = \frac{x}{\sqrt{x^2 + 1}}$. Compare.`,
   take:R`the dashed $f'$ stays between $-1$ and $1$: far away the graph of $f$ looks like the lines $y = \pm x$.`,
   cfg:{typ:"dotycnica", en:true, f:"sqrt(x^2 + 1)", x0:{v:1}, view:[-4, 4, 4, -2], on:{der:true}, out:cmp(R`\frac{x_0}{\sqrt{x_0^2 + 1}}`, x => x / Math.sqrt(x * x + 1))}},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = (2x - 1)^3$. Move $x_0$ to a point where the slope of the tangent is 6.`,
   hint:"f′(x) = 3(2x − 1)² · 2 = 6(2x − 1)². It equals 6 when 2x − 1 = ±1.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - 6) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"(2*x - 1)^3", x0:{v:2}, view:[-2, 5, 3, -5]}},
  {ex:R`Differentiate $f(x) = x \cdot e^{-x^2}$ (product and chain together).`,
   steps:[
     [R`Chain: $\left(e^{-x^2}\right)' = e^{-x^2} \cdot (-2x)$.`, R`-2x e^{-x^2}`],
     ["Product rule.", R`f' = 1 \cdot e^{-x^2} + x \cdot (-2x) e^{-x^2}`],
     ["Factor out.", R`= (1 - 2x^2)\,e^{-x^2}`]
   ],
   res:R`$f'(x) = (1 - 2x^2)e^{-x^2}$.`},
  {warn:R`Do not forget the inner derivative: $(e^{2x})' = 2e^{2x}$, not $e^{2x}$; $\big((3x + 1)^4\big)' = 12(3x + 1)^3$, not $4(3x + 1)^3$.`}
]

  }
};
})();

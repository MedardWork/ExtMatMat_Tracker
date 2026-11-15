/* Area between two graphs (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c11 = {
  mins:20,
  brief:[
    R`The limits of the region are usually the intersection points: solve $f(x) = g(x)$.`,
    R`If $f(x) \geq g(x)$ on $[a, b]$: area $= \int_a^b \big(f(x) - g(x)\big)\,dx$, upper minus lower.`,
    R`It does not matter whether the graphs lie above or below the $x$-axis.`,
    R`If the graphs cross inside the interval, split at the crossing and add the pieces.`
  ],
  subs:{

"Intersection points as limits":[
  R`A region enclosed by two graphs starts and ends where the graphs meet. So the first step is always to solve the equation $f(x) = g(x)$; its solutions are the limits of integration. By hand this is often a quadratic equation, otherwise use CAS.`,
  {def:"Limits of the region", tex:R`f(x) = g(x) \iff x = \va{a} \ \text{or}\ x = \vb{b}`},
  {tool:"integral", ask:R`$f(x) = x + 2$ and $g(x) = x^2$. Where do the graphs meet? The tool finds the intersections and uses them as limits.`,
   take:R`they meet at $x = -1$ and $x = 2$; between them the line lies above the parabola.`,
   cfg:{typ:"medzi", en:true}},
  {ex:R`Find the intersection points of $f(x) = x + 2$ and $g(x) = x^2$.`,
   steps:[
     ["Set equal.", R`x^2 = x + 2 \iff x^2 - x - 2 = 0`],
     ["Factorise.", R`(x - 2)(x + 1) = 0`],
     ["Points.", R`x = -1:\ [-1, 1],\qquad x = 2:\ [2, 4]`]
   ],
   res:R`$[-1, 1]$ and $[2, 4]$.`},
  {tool:"integral", kind:"uloha", ask:R`The limits are now set by hand. Move $a$ and $b$ to the intersection points of $f(x) = x + 2$ and $g(x) = x^2$.`,
   hint:"x² = x + 2 at x = −1 and x = 2.",
   goal:P => Math.min(P.a, P.b) === -1 && Math.max(P.a, P.b) === 2,
   cfg:{typ:"medzi", en:true, auto:false, a:{v:0}, b:{v:1}}},
  {warn:R`Check which graph is on top between the intersections, e.g. by substituting a number in between: at $x = 0$, $f(0) = 2 > g(0) = 0$.`}
],

"Area between two graphs":[
  R`Between the limits, each thin vertical strip has the height "upper graph minus lower graph". Adding the strips gives the integral of the difference. The position of the $x$-axis plays no role: shifting both graphs up or down does not change the difference.`,
  {def:"Area between two graphs", tex:R`A = \int_{\va{a}}^{\vb{b}} \big(f(x) - g(x)\big)\,dx \qquad f(x) \geq g(x) \text{ on } [\va{a}, \vb{b}]`},
  {ex:R`Find the area enclosed by $f(x) = x + 2$ and $g(x) = x^2$.`,
   steps:[
     ["Limits from the previous example; f is on top.", R`A = \int_{-1}^{2} (x + 2 - x^2)\,dx`],
     ["Antiderivative.", R`\left[\frac{x^2}{2} + 2x - \frac{x^3}{3}\right]_{-1}^{2}`],
     ["Evaluate.", R`\left(2 + 4 - \tfrac{8}{3}\right) - \left(\tfrac{1}{2} - 2 + \tfrac{1}{3}\right) = \tfrac{10}{3} + \tfrac{7}{6} = \tfrac{9}{2}`]
   ],
   res:R`$A = 4{,}5$.`},
  {tool:"integral", kind:"uloha", ask:R`Same region, $a = -1$. Move $b$ so that the strip from $-1$ to $b$ contains exactly half of the area (2,25).`,
   hint:"The integral of x + 2 − x² from −1 to b must be 2,25. Try b in the middle of the region.",
   take:R`$b = 0{,}5$: the region is symmetric about the middle $x = \frac{-1 + 2}{2}$, because $f - g$ is a parabola with its vertex there.`,
   goal:P => P.b === .5,
   cfg:{typ:"medzi", en:true, auto:false, a:L(-1), b:{v:2}}},
  {ex:R`Find the area enclosed by $f(x) = 4 - x^2$ and $g(x) = x^2 - 4$.`,
   steps:[
     ["Intersections.", R`4 - x^2 = x^2 - 4 \iff x^2 = 4 \iff x = \pm 2`],
     ["f on top (check x = 0).", R`A = \int_{-2}^{2} (8 - 2x^2)\,dx = \left[8x - \tfrac{2x^3}{3}\right]_{-2}^{2}`],
     ["Evaluate.", R`\left(16 - \tfrac{16}{3}\right) - \left(-16 + \tfrac{16}{3}\right) = 32 - \tfrac{32}{3} = \tfrac{64}{3}`]
   ],
   res:R`$A = \frac{64}{3} \approx 21{,}33$; half of the region lies below the $x$-axis, and that does not matter.`},
  {tool:"integral", ask:R`$f(x) = x^3$ and $g(x) = x$ meet three times. Look at which graph is on top in each part.`,
   take:R`on $[-1, 0]$ the cubic is on top, on $[0, 1]$ the line. Each part has area $\frac{1}{4}$, total $\frac{1}{2}$, while $\int_{-1}^{1}(x^3 - x)\,dx = 0$.`,
   cfg:{typ:"medzi", en:true, f:"x^3", g:"x", view:[-2, 2, 2, -2]}},
  {ex:R`Find the area enclosed by $f(x) = \sqrt{x}$ and $g(x) = x^2$.`,
   steps:[
     ["Intersections.", R`\sqrt{x} = x^2 \iff x = 0 \text{ or } x = 1`],
     ["√x is on top on [0, 1].", R`\int_0^1 \left(\sqrt{x} - x^2\right)dx = \left[\tfrac{2}{3}x^{3/2} - \tfrac{x^3}{3}\right]_0^1`],
     ["Evaluate.", R`\tfrac{2}{3} - \tfrac{1}{3} = \tfrac{1}{3}`]
   ],
   res:R`$A = \frac{1}{3}$.`},
  {warn:R`When the graphs cross between the limits, $\int (f - g)\,dx$ over the whole interval subtracts one part from the other. Split at every crossing and add the absolute values.`}
]

  }
};
})();

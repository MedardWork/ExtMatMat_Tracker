/* Area under a curve, fundamental theorem of calculus (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const I = st => st.h && st.h.int;

THEORY.c9 = {
  mins:25,
  brief:[
    R`The area under a graph is approximated by rectangles; with more and thinner rectangles the sum approaches $\int_a^b f(x)\,dx$.`,
    R`$f \geq 0$ on $[a, b]$: area $= \int_a^b f(x)\,dx$. $f \leq 0$: area $= -\int_a^b f(x)\,dx$. If $f$ changes sign, split at its zeros.`,
    R`Area function $A(x) = \int_a^x f(t)\,dt$ has $A'(x) = f(x)$: it is an antiderivative of $f$.`,
    R`Hence $\int_a^b f(x)\,dx = F(b) - F(a)$ for any antiderivative $F$ (the fundamental theorem).`
  ],
  subs:{

"Area under a curve":[
  R`How large is the region between the graph of $f \geq 0$, the $x$-axis and the lines $x = a$, $x = b$? Cut it into $n$ thin strips and replace each by a rectangle. The sum of the rectangles approximates the area, and as $n$ grows the sums approach a limit: the **definite integral**.`,
  {def:"Area as a limit of sums", tex:R`\int_{\va{a}}^{\vb{b}} f(x)\,dx = \lim_{\vd{n} \to \infty} \sum_{i=1}^{\vd{n}} f(x_i)\,\Delta x \qquad \Delta x = \frac{\vb{b} - \va{a}}{\vd{n}}`},
  {tool:"integral", ask:R`$f(x) = \frac{x^2}{4} + 1$ on $[0, 4]$, rectangles with the left endpoint as height. Increase $n$.`,
   take:R`the left sums are too small for a rising function, but the gap shrinks as $n$ grows; the limit is $\frac{28}{3} \approx 9{,}33$.`,
   cfg:{typ:"sucty", en:true}},
  {tool:"integral", kind:"uloha", ask:R`Now the height is taken in the **middle** of each strip. Find the smallest $n$ for which the sum differs from the integral by less than 0,1.`,
   hint:"The midpoint sum is much better than the left one: try small n.",
   take:R`$n = 4$ is enough (error about 0,08), while the left sum needs 80 strips to get below 0,1.`,
   goal:(P, st) => !!I(st) && Math.abs(I(st).S - I(st).I) < .1,
   cfg:{typ:"sucty", en:true, druh:"stred", n:{v:1}}},
  {ex:R`Find the area between the graph of $f(x) = x^2 + 1$, the $x$-axis and the lines $x = 0$, $x = 2$.`,
   steps:[
     [R`$f > 0$, so the area is the integral.`, R`\int_0^2 (x^2 + 1)\,dx = \left[\frac{x^3}{3} + x\right]_0^2`],
     ["Evaluate.", R`\frac{8}{3} + 2 = \frac{14}{3} \approx 4{,}67`]
   ],
   res:R`$\frac{14}{3} \approx 4{,}67$.`},
  {ex:R`Find the area enclosed by $f(x) = x^2 - 2x$ and the $x$-axis on $[0, 3]$.`,
   steps:[
     [R`Zeros: $x = 0$ and $x = 2$. Below the axis on $[0, 2]$, above on $[2, 3]$. $F(x) = \frac{x^3}{3} - x^2$.`, R`F(0) = 0,\ F(2) = -\tfrac{4}{3},\ F(3) = 0`],
     [R`On $[0, 2]$.`, R`\int_0^2 f\,dx = -\tfrac{4}{3} \Rightarrow \text{area } \tfrac{4}{3}`],
     [R`On $[2, 3]$.`, R`\int_2^3 f\,dx = 0 - \left(-\tfrac{4}{3}\right) = \tfrac{4}{3}`],
     ["Total area.", R`\tfrac{4}{3} + \tfrac{4}{3} = \tfrac{8}{3}`]
   ],
   res:R`The area is $\frac{8}{3}$, although $\int_0^3 f(x)\,dx = 0$.`},
  {tool:"integral", ask:R`The example: $f(x) = x^2 - 2x$ from 0 to 3. Compare the integral with the area.`,
   take:R`the integral counts the part below the axis with a minus sign; for the area, split at the zero $x = 2$.`,
   cfg:{typ:"plocha", en:true, F:"x^3/3 - x^2", a:L(0), b:L(3)}},
  {warn:R`An area is never negative. If $f$ changes sign on $[a, b]$, find its zeros and integrate each piece separately, taking absolute values.`}
],

"Fundamental theorem of calculus":[
  R`Fix $a$ and let the right end vary: the area from $a$ to $x$ is a function $A(x)$, the **area function**. When $x$ moves a little ($\Delta x$), the area grows by a thin strip of height about $f(x)$, so $\frac{\Delta A}{\Delta x} \approx f(x)$. In the limit $A'(x) = f(x)$: the area function is an antiderivative of $f$.`,
  {def:"Fundamental theorem of calculus", tex:R`A(x) = \int_{\va{a}}^{x} f(t)\,dt \Rightarrow A'(x) = f(x) \qquad \int_{\va{a}}^{\vb{b}} f(x)\,dx = F(\vb{b}) - F(\va{a})`,
   note:"A and any antiderivative F differ by a constant, and A(a) = 0. That gives the second formula."},
  {tool:"integral", ask:R`$f(x) = \frac{x}{2} + 1$ from $a = 0$. Switch on the area function and move $b$.`,
   take:R`the curve $A(x)$ rises fastest where $f$ is high: its slope is always $f(x)$. Here $A(x) = \frac{x^2}{4} + x$.`,
   cfg:{typ:"plocha", en:true, f:"x/2 + 1", a:L(0), b:{v:3}, view:[-1, 7, 6, -1], on:{funkcia:true}}},
  {ex:R`Find the area function $A(x) = \int_0^x \left(\frac{t}{2} + 1\right)dt$ and check that $A' = f$.`,
   steps:[
     ["Antiderivative.", R`\left[\frac{t^2}{4} + t\right]_0^x = \frac{x^2}{4} + x`],
     ["Derivative.", R`A'(x) = \frac{x}{2} + 1 = f(x)`]
   ],
   res:R`$A(x) = \frac{x^2}{4} + x$.`},
  {tool:"integral", kind:"uloha", ask:R`Same function. Move $b$ so that the area from 0 to $b$ is exactly 3.`,
   hint:"A(b) = b²/4 + b = 3 gives b² + 4b − 12 = 0.",
   take:R`$b = 2$: $\frac{4}{4} + 2 = 3$.`,
   goal:P => P.b === 2,
   cfg:{typ:"plocha", en:true, f:"x/2 + 1", F:"x^2/4 + x", a:L(0), b:{v:3}, view:[-1, 7, 6, -1], on:{funkcia:true}}},
  {ex:R`Find $\frac{d}{dx} \int_1^x \sqrt{t}\,dt$.`,
   steps:[
     ["Fundamental theorem: the derivative of the area function is the integrand.", R`\frac{d}{dx} \int_1^x \sqrt{t}\,dt = \sqrt{x}`]
   ],
   res:R`$\sqrt{x}$ (no integration needed).`},
  {warn:R`In $\int_a^x f(t)\,dt$ the letter $t$ is only a dummy variable; the result is a function of $x$. Do not mix the two inside one formula.`}
]

  }
};
})();

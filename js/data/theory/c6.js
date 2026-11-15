/* Monotonicity, local extrema, optimisation (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const BOX = "x*(12 - 2*x)^2";

THEORY.c6 = {
  mins:30,
  brief:[
    R`$f'(x) > 0$ on an interval: $f$ is increasing there; $f'(x) < 0$: decreasing.`,
    R`Local extrema can only be where $f'(x) = 0$ (or $f'$ does not exist). Check the sign of $f'$ on both sides, or the sign of $f''$.`,
    R`Sign of $f'$: $+$ then $-$ is a maximum, $-$ then $+$ a minimum, no change is no extremum (e.g. $x^3$ at 0).`,
    R`Optimisation: express the quantity as a function of one variable, find its domain, set $f'(x) = 0$ and check the endpoints.`
  ],
  subs:{

"Increasing and decreasing intervals":[
  R`Where the tangent slopes upwards, the graph rises. So the **sign** of the derivative tells us where $f$ increases and where it decreases. The places where $f'$ can change sign are its zeros, so we solve $f'(x) = 0$ first and then test the sign between them.`,
  {def:"Monotonicity", tex:R`f'(x) > 0 \text{ on } I \Rightarrow f \text{ increasing on } I \qquad f'(x) < 0 \text{ on } I \Rightarrow f \text{ decreasing on } I`},
  {tool:"derivacia", ask:R`$f(x) = \frac{x^3}{3} - x$ with the graph of $f'$. Where is the dashed graph above the axis, and what does $f$ do there?`,
   take:R`$f' = x^2 - 1$ is positive outside $[-1, 1]$, where $f$ rises, and negative inside, where $f$ falls.`,
   cfg:{typ:"priebeh", en:true, on:{der:true}}},
  {steps:[
    {t:"Derivative", d:"Compute f′(x) and factorise it if you can."},
    {t:"Zeros", d:"Solve f′(x) = 0. These numbers split the axis into intervals."},
    {t:"Signs", d:"Find the sign of f′ in each interval (test one number, or use the factors)."},
    {t:"Answer", d:"Increasing where f′ > 0, decreasing where f′ < 0. Give the intervals."}
  ]},
  {ex:R`Find where $f(x) = x^3 - 3x^2 - 9x + 2$ is increasing and decreasing.`,
   steps:[
     ["Derivative, factorised.", R`f'(x) = 3x^2 - 6x - 9 = 3(x + 1)(x - 3)`],
     ["Zeros.", R`x = -1,\quad x = 3`],
     [R`Signs: test $x = -2$, $0$, $4$.`, R`f'(-2) = 15 > 0,\ f'(0) = -9 < 0,\ f'(4) = 15 > 0`]
   ],
   res:R`Increasing on $]-\infty, -1]$ and $[3, \infty[$, decreasing on $[-1, 3]$.`},
  {warn:R`$f'(x_0) = 0$ at a single point does not stop $f$ from increasing: $x^3$ is increasing everywhere although $(x^3)' = 0$ at 0.`}
],

"Local extrema":[
  R`At a **local maximum** the graph turns from rising to falling, at a **local minimum** from falling to rising. In both cases the tangent is horizontal: $f'(x_0) = 0$. But not every such point is an extremum, so the sign of $f'$ around it decides.`,
  {def:"Tests for local extrema", tex:R`f'(\va{x_0}) = 0,\ f'\ \text{changes} + \to -:\ \text{max} \qquad - \to +:\ \text{min} \qquad f''(\va{x_0}) < 0:\ \text{max},\ \ f''(\va{x_0}) > 0:\ \text{min}`,
   note:"If f″(x₀) = 0 the second test says nothing; use the sign of f′."},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \frac{x^3}{3} - x$. Move $x_0$ to the local minimum.`,
   hint:"f′(x) = x² − 1 = 0 at ±1; f′ goes from − to + at x = 1.",
   goal:P => Math.abs(P.x0 - 1) < 1e-9,
   cfg:{typ:"priebeh", en:true, x0:{v:-2}}},
  {ex:R`Find the local extrema of $f(x) = x^3 - 3x^2 - 9x + 2$.`,
   steps:[
     ["Stationary points (previous example).", R`x = -1,\quad x = 3`],
     ["Second derivative.", R`f''(x) = 6x - 6`],
     [R`At $-1$.`, R`f''(-1) = -12 < 0:\ \text{max},\quad f(-1) = 7`],
     [R`At $3$.`, R`f''(3) = 12 > 0:\ \text{min},\quad f(3) = -25`]
   ],
   res:R`Local maximum $[-1, 7]$, local minimum $[3, -25]$.`},
  {tool:"derivacia", ask:R`$f(x) = x^3$. The tangent at 0 is horizontal. Is it an extremum?`,
   take:R`no: $f' = 3x^2$ is positive on both sides of 0, so $f$ keeps rising. Such a point is a saddle (horizontal inflection) point.`,
   cfg:{typ:"priebeh", en:true, f:"x^3", view:[-3, 4, 3, -4], on:{der:true}}},
  {ex:R`Find the extremum of $f(x) = x\,e^{-x}$.`,
   steps:[
     ["Product and chain rule.", R`f'(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}`],
     [R`$e^{-x} > 0$, so the sign is that of $1 - x$.`, R`f' > 0 \text{ for } x < 1,\quad f' < 0 \text{ for } x > 1`],
     ["Maximum.", R`f(1) = e^{-1} \approx 0{,}368`]
   ],
   res:R`Local (and global) maximum $\left[1, \frac{1}{e}\right]$.`},
  {warn:R`A local maximum need not be the largest value overall. On a closed interval compare the local extrema with the values at the **endpoints**.`}
],

"Optimisation problems":[
  R`Many tasks ask for the "largest", "smallest", "cheapest": the biggest box, the shortest fence. Write the quantity as a function of **one** variable, find where its derivative is 0, and check that it really is a maximum (or minimum) on the allowed interval.`,
  {steps:[
    {t:"Variable", d:"Choose what x is (draw a picture) and its allowed interval."},
    {t:"Function", d:"Express the quantity to optimise through x only, using the given conditions."},
    {t:"Derivative", d:"Solve f′(x) = 0 inside the interval."},
    {t:"Check", d:"Sign of f′ (or f″), and the endpoints. Answer the question in words with units."}
  ]},
  {tool:"graf", kind:"uloha", ask:R`From a $12 \times 12$ cm sheet we cut squares of side $x$ from the corners and fold an open box. Its volume is $V(x) = x(12 - 2x)^2$. Move $x$ to the largest volume.`,
   hint:"V′(x) = (12 − 2x)(12 − 6x) = 0 inside ]0, 6[ only at x = 2.",
   take:R`$x = 2$ cm gives $V = 2 \cdot 8^2 = 128\ \text{cm}^3$; a larger or smaller cut gives less.`,
   goal:P => P.a === 2,
   cfg:{fns:[BOX], params:{a:{v:4, min:.5, max:5.5, step:.5, color:"a", note:"cut x (cm)"}}, view:[-.5, 150, 6.5, -15], tick:[1, 20], free:true, aspect:"4/3",
     show:[{pt:["a", "a*(12 - 2*a)^2"], color:"a"}],
     out:(P, h) => h.calc(R`V(\va{${h.tn(P.a)}}) = ${h.tn(P.a * (12 - 2 * P.a) ** 2)}\ \text{cm}^3`)}},
  {ex:R`Solve the box problem by calculation.`,
   steps:[
     [R`Domain: $0 < x < 6$.`, R`V(x) = x(12 - 2x)^2`],
     ["Product and chain rule.", R`V'(x) = (12 - 2x)^2 - 4x(12 - 2x) = (12 - 2x)(12 - 6x)`],
     [R`Zeros: $x = 6$ (outside) and $x = 2$. $V'$ changes from $+$ to $-$.`, R`x = 2`],
     ["Volume.", R`V(2) = 2 \cdot 8^2 = 128`]
   ],
   res:R`Cut squares of side 2 cm; the box holds $128\ \text{cm}^3$.`},
  {ex:R`A rectangular field along a wall is fenced on three sides with 40 m of fence. Find the largest area.`,
   steps:[
     [R`Sides perpendicular to the wall: $x$; the side parallel: $40 - 2x$; $0 < x < 20$.`, R`A(x) = x(40 - 2x) = 40x - 2x^2`],
     ["Derivative.", R`A'(x) = 40 - 4x = 0 \Rightarrow x = 10`],
     [R`$A'' = -4 < 0$: maximum.`, R`A(10) = 10 \cdot 20 = 200`]
   ],
   res:R`$10 \times 20$ m, area $200\ \text{m}^2$.`},
  {ex:R`A closed cylindrical can must hold 1 litre ($1000\ \text{cm}^3$). Which radius uses the least metal?`,
   steps:[
     ["Volume gives the height.", R`\pi r^2 h = 1000 \Rightarrow h = \frac{1000}{\pi r^2}`],
     ["Surface as a function of r.", R`O(r) = 2\pi r^2 + 2\pi r h = 2\pi r^2 + \frac{2000}{r}`],
     ["Derivative.", R`O'(r) = 4\pi r - \frac{2000}{r^2} = 0 \Rightarrow r^3 = \frac{500}{\pi}`],
     ["Radius and height.", R`r = \sqrt[3]{\tfrac{500}{\pi}} \approx 5{,}42\ \text{cm},\quad h = 2r \approx 10{,}84\ \text{cm}`]
   ],
   res:R`$r \approx 5{,}42$ cm and $h \approx 10{,}84$ cm (height = diameter), surface about $554\ \text{cm}^2$.`},
  {warn:R`The function must have **one** variable. Use the condition (fixed fence length, fixed volume) to get rid of the second one before you differentiate.`}
]

  }
};
})();

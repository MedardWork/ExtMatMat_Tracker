/* Slope at a point, equation of the tangent (Danish Matematik A) */
(() => {
const D = st => st.h && st.h.der;

THEORY.c5 = {
  mins:20,
  brief:[
    R`The slope of the graph at $x_0$ is $f'(x_0)$. To find where the slope is $m$, solve $f'(x) = m$.`,
    R`Tangent at $x_0$: $y = f'(x_0)(x - x_0) + f(x_0)$.`,
    R`Recipe: compute $f(x_0)$, then $f'(x)$, then $f'(x_0)$, substitute and simplify to $y = ax + b$.`,
    R`Parallel lines have equal slopes; a tangent parallel to $y = ax + b$ touches where $f'(x) = a$.`
  ],
  subs:{

"Slope at a point":[
  R`The derivative is a function: for every $x$ it gives the slope of the graph there. Two kinds of question appear: **given** $x_0$, find the slope $f'(x_0)$; or **given** the slope $m$, find the points where $f'(x) = m$.`,
  {def:"Slope of the graph", tex:R`\text{slope at } \va{x_0}:\ f'(\va{x_0}) \qquad \text{points with slope } m:\ f'(x) = m`},
  {tool:"derivacia", ask:R`$f(x) = x^2 - 3x + 1$. Move $x_0$ and read the slope $f'(x_0) = 2x_0 - 3$.`,
   take:R`the slope grows by 2 for every step of 1 in $x_0$; it is 0 at the vertex $x_0 = 1{,}5$.`,
   cfg:{typ:"dotycnica", en:true, f:"x^2 - 3*x + 1", x0:{v:3}, view:[-2, 6, 5, -3], on:{der:true}}},
  {ex:R`$f(x) = x^3$. Find the slope at $x_0 = -1$ and all points where the slope is 12.`,
   steps:[
     ["Derivative.", R`f'(x) = 3x^2`],
     [R`At $-1$.`, R`f'(-1) = 3`],
     ["Slope 12.", R`3x^2 = 12 \Rightarrow x = \pm 2`],
     ["Points.", R`[2, 8],\ [-2, -8]`]
   ],
   res:R`Slope 3 at $x = -1$; slope 12 at $[2, 8]$ and $[-2, -8]$.`},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = x^2 - 3x + 1$. Move $x_0$ to the point where the tangent has slope 1.`,
   hint:"2x − 3 = 1.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - 1) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"x^2 - 3*x + 1", x0:{v:0}, view:[-2, 6, 5, -3]}},
  {warn:R`$f'(x_0)$ is a slope, not a point. The point of contact is $[x_0, f(x_0)]$: its $y$ comes from $f$, not from $f'$.`}
],

"Tangent line equation":[
  R`A line with slope $a$ through the point $[x_0, y_0]$ is $y = a(x - x_0) + y_0$. For the tangent, the slope is $f'(x_0)$ and the point is $[x_0, f(x_0)]$.`,
  {def:"Equation of the tangent", tex:R`y = f'(\va{x_0})\,(x - \va{x_0}) + f(\va{x_0})`},
  {steps:[
    {t:"Point", d:"Compute f(x₀)."},
    {t:"Slope", d:"Differentiate and compute f′(x₀)."},
    {t:"Substitute", d:"Put both into y = f′(x₀)(x − x₀) + f(x₀) and simplify to y = ax + b."}
  ]},
  {tool:"derivacia", ask:R`The tool writes the equation of the tangent for every $x_0$. Follow the three steps for $x_0 = 2$ and compare.`,
   take:R`for $f(x) = \frac{x^3}{4} - x$ at 2: $f(2) = 0$, $f'(2) = 2$, so $y = 2(x - 2) + 0 = 2x - 4$.`,
   cfg:{typ:"dotycnica", en:true}},
  {ex:R`Find the tangent to $f(x) = x^2 - 3x + 1$ at $x_0 = 2$.`,
   steps:[
     ["Point.", R`f(2) = 4 - 6 + 1 = -1`],
     ["Slope.", R`f'(x) = 2x - 3,\quad f'(2) = 1`],
     ["Tangent.", R`y = 1 \cdot (x - 2) + (-1) = x - 3`]
   ],
   res:R`$y = x - 3$.`},
  {ex:R`Find the tangents to $f(x) = e^x$ at $x_0 = 0$ and to $g(x) = \ln x$ at $x_0 = 1$.`,
   steps:[
     [R`$f(0) = 1$, $f'(0) = e^0 = 1$.`, R`y = 1 \cdot (x - 0) + 1 = x + 1`],
     [R`$g(1) = 0$, $g'(1) = \frac{1}{1} = 1$.`, R`y = 1 \cdot (x - 1) + 0 = x - 1`]
   ],
   res:R`$y = x + 1$ and $y = x - 1$ (the two graphs are mirror images in $y = x$, so are the tangents).`},
  {ex:R`Find the tangent to $f(x) = x^2$ that is parallel to the line $y = 4x - 1$.`,
   steps:[
     ["Parallel: same slope 4.", R`f'(x) = 2x = 4 \Rightarrow x_0 = 2`],
     ["Point.", R`f(2) = 4`],
     ["Tangent.", R`y = 4(x - 2) + 4 = 4x - 4`]
   ],
   res:R`$y = 4x - 4$.`},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = x^2 + 1$. Find a tangent that passes through the origin $[0, 0]$, i.e. whose equation has the constant term 0.`,
   hint:"The tangent at x₀ is y = 2x₀x + 1 − x₀². The constant term 1 − x₀² is 0 for x₀ = ±1.",
   take:R`at $x_0 = \pm 1$ the tangents $y = 2x$ and $y = -2x$ go through the origin.`,
   goal:(P, st) => !!D(st) && Math.abs(D(st).q) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"x^2 + 1", x0:{v:2.5}, view:[-4, 7, 4, -3]}},
  {warn:R`Do not use $f'(x)$ with the variable $x$ as the slope: the slope of a tangent is a number, $f'(x_0)$. "$y = 2x(x - 2) + 4$" is a parabola, not a line.`}
]

  }
};
})();

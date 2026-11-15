/* The derivative: difference quotient, rate of change, slope of the tangent (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const D = st => st.h && st.h.der;

THEORY.c2 = {
  mins:25,
  brief:[
    R`Difference quotient $\frac{f(x_0 + h) - f(x_0)}{h}$: the slope of the secant through $[x_0, f(x_0)]$ and $[x_0 + h, f(x_0 + h)]$, the average rate of change.`,
    R`Derivative: $f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$, the instantaneous rate of change.`,
    R`$f'(x_0)$ is the slope of the tangent to the graph at $x_0$.`,
    R`Units: if $s(t)$ is in metres and $t$ in seconds, $s'(t)$ is in metres per second.`
  ],
  subs:{

"Difference quotient":[
  R`How fast does a function change between $x_0$ and $x_0 + h$? Divide the change in $y$ by the change in $x$. This **difference quotient** is the slope of the **secant**, the line through the two points of the graph.`,
  {def:"Difference quotient", tex:R`\frac{\Delta y}{\Delta x} = \frac{f(\va{x_0} + \vb{h}) - f(\va{x_0})}{\vb{h}}`,
   note:"It is the average rate of change of f on the interval from x₀ to x₀ + h."},
  {tool:"derivacia", ask:R`$f(x) = \frac{x^2}{2}$. Points $A$ at $x_0$ and $B$ at $x_0 + h$. Change $h$ and watch the slope of the secant.`,
   take:R`the slope of the secant is $\frac{\Delta y}{\Delta x}$. When $h$ shrinks, it settles at one number.`,
   cfg:{typ:"secna", en:true, x0:L(1), view:[-2, 5, 4, -1]}},
  {ex:R`$f(x) = x^2$, $x_0 = 1$. Find the difference quotient for $h = 0{,}5$, $h = 0{,}1$ and for a general $h$.`,
   steps:[
     [R`$h = 0{,}5$.`, R`\frac{1{,}5^2 - 1^2}{0{,}5} = \frac{1{,}25}{0{,}5} = 2{,}5`],
     [R`$h = 0{,}1$.`, R`\frac{1{,}1^2 - 1}{0{,}1} = \frac{0{,}21}{0{,}1} = 2{,}1`],
     [R`General $h$.`, R`\frac{(1 + h)^2 - 1}{h} = \frac{2h + h^2}{h} = 2 + h`]
   ],
   res:R`2,5; 2,1; and $2 + h$, which approaches 2 as $h \to 0$.`},
  {ex:R`Find the average rate of change of $f(x) = x^3$ on $[1, 3]$.`,
   steps:[
     ["Change in y over change in x.", R`\frac{f(3) - f(1)}{3 - 1} = \frac{27 - 1}{2} = 13`]
   ],
   res:"13: on average f grows by 13 per unit of x on this interval."},
  {warn:R`Divide by $h$, the change in $x$, not by $x_0 + h$. And keep the order the same in numerator and denominator: $\frac{f(b) - f(a)}{b - a}$.`}
],

"Derivative as rate of change":[
  R`When $h$ gets smaller, the average rate of change over $[x_0, x_0 + h]$ becomes the **instantaneous rate of change** at $x_0$. This limit is the **derivative** $f'(x_0)$. If it exists, $f$ is differentiable at $x_0$.`,
  {def:"Derivative", tex:R`f'(\va{x_0}) = \lim_{\vb{h} \to 0} \frac{f(\va{x_0} + \vb{h}) - f(\va{x_0})}{\vb{h}}`},
  {tool:"graf", ask:R`A stone falls $s(t) = 5t^2$ metres in $t$ seconds. The secant through $t = a$ and $t = b$ has the average velocity as its slope. Move $b$ towards $a = 2$.`,
   take:R`the average velocity $\frac{s(b) - s(2)}{b - 2} = 5(b + 2)$ approaches 20 m/s, the velocity at the moment $t = 2$.`,
   cfg:{fns:["5*x^2", {f:"5*(a + b)*(x - a) + 5*a^2", color:"b", thin:true}], params:{a:{v:2, min:0, max:4, step:.5, color:"a", lock:true, note:"t₁ (s)"}, b:{v:4, min:2.1, max:4, step:.1, color:"b", note:"t₂ (s)"}},
     view:[-.5, 90, 4.5, -10], tick:[1, 10], free:true, aspect:"4/3",
     show:[{pt:["a", "5*a^2"], color:"a"}, {pt:["b", "5*b^2"], color:"b"}],
     out:(P, h) => h.calc(R`\frac{s(\vb{${h.tn(P.b)}}) - s(\va{2})}{\vb{${h.tn(P.b)}} - \va{2}} = ${h.tn(5 * (P.b + 2))}\ \text{m/s}`)}},
  {ex:R`A stone falls $s(t) = 5t^2$ metres. Find its average velocity between $t = 1$ and $t = 3$, and its velocity at $t = 2$.`,
   steps:[
     ["Average velocity.", R`\frac{s(3) - s(1)}{3 - 1} = \frac{45 - 5}{2} = 20\ \text{m/s}`],
     [R`At $t = 2$: difference quotient.`, R`\frac{5(2 + h)^2 - 20}{h} = \frac{20h + 5h^2}{h} = 20 + 5h`],
     [R`Let $h \to 0$.`, R`s'(2) = 20\ \text{m/s}`]
   ],
   res:"Both are 20 m/s (for a parabola the average over [1, 3] equals the value in the middle)."},
  {ex:R`Find $f'(x)$ from the definition for $f(x) = x^2$, and $f'(2)$ for $f(x) = \frac{1}{x}$.`,
   steps:[
     [R`$f(x) = x^2$.`, R`\frac{(x + h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h \to 2x`],
     [R`$f(x) = \frac{1}{x}$ at 2: common denominator.`, R`\frac{\frac{1}{2 + h} - \frac{1}{2}}{h} = \frac{2 - (2 + h)}{2(2 + h)\,h} = \frac{-1}{2(2 + h)}`],
     [R`Let $h \to 0$.`, R`f'(2) = -\frac{1}{4}`]
   ],
   res:R`$(x^2)' = 2x$ and $f'(2) = -\frac{1}{4}$ for $f(x) = \frac{1}{x}$.`},
  {warn:R`$f'(x_0)$ is a rate, so it has units: output units per input unit. A population $N(t)$ with $N'(5) = 300$ grows by about 300 individuals **per year** at $t = 5$, not by 300 in total.`}
],

"Derivative as slope of the tangent":[
  R`Geometrically, when $B$ slides along the graph towards $A$, the secant turns into the **tangent** at $A$. Its slope is the limit of the slopes of the secants, which is exactly $f'(x_0)$.`,
  {def:"Slope of the tangent", tex:R`\text{slope of the tangent at } \va{x_0} = f'(\va{x_0})`},
  {tool:"derivacia", ask:R`Switch on the tangent at $A$ and make $h$ very small (also negative). What happens to the secant?`,
   take:R`for $h$ close to 0 the secant almost coincides with the tangent, from both sides.`,
   cfg:{typ:"secna", en:true, view:[-2, 5, 4, -1], on:{dot:true}}},
  {tool:"derivacia", ask:R`The tangent at $x_0$ and the graph of $f'$ (dashed). Move $x_0$: the height of the dashed graph is the slope of the tangent.`,
   take:R`where the tangent is horizontal, $f'(x_0) = 0$; where the graph rises, $f' > 0$; where it falls, $f' < 0$.`,
   cfg:{typ:"dotycnica", en:true, on:{der:true}}},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \frac{x^2}{2}$. Move $x_0$ to the point where the tangent has slope 2.`,
   hint:"f′(x) = x, so x₀ = 2.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - 2) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"x^2/2", x0:{v:-1}, view:[-4, 6, 4, -2]}},
  {ex:R`Find the slope of the tangent to $f(x) = x^2$ at $x_0 = 3$ and the point of contact.`,
   steps:[
     [R`From above, $f'(x) = 2x$.`, R`f'(3) = 6`],
     ["Point of contact.", R`[3, f(3)] = [3, 9]`]
   ],
   res:R`Slope 6 at $[3, 9]$. The equation of the tangent follows in [[c5]]: $y = 6x - 9$.`},
  {warn:R`A function can be continuous and still have no derivative: $|x|$ has a corner at 0, where secants from the left have slope $-1$ and from the right $+1$.`}
]

  }
};
})();

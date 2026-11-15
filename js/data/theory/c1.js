/* Limits and continuity (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c1 = {
  mins:25,
  brief:[
    R`$\lim_{x \to a} f(x) = L$: the values $f(x)$ get as close to $L$ as we like when $x$ is close enough to $a$ (but $x \neq a$).`,
    R`The value $f(a)$ does not matter for the limit; $f$ need not even be defined at $a$. Factorise and cancel to find it.`,
    R`At infinity, divide by the highest power of $x$: $\lim_{x \to \infty} \frac{2x + 1}{x + 2} = 2$, a horizontal asymptote.`,
    R`$f$ is **continuous** at $a$ when $\lim_{x \to a} f(x) = f(a)$: no hole, no jump, no asymptote.`
  ],
  subs:{

"Limit at a point":[
  R`The function $f(x) = \frac{x^2 - 1}{x - 1}$ is not defined at $x = 1$ (division by zero). Still, for $x$ close to 1 its values are close to 2. We say the **limit** of $f$ at 1 is 2. The limit describes what happens *near* a point, not *at* it.`,
  {def:"Limit at a point", tex:R`\lim_{x \to \va{a}} f(x) = L`,
   note:"f(x) is as close to L as we want for every x ≠ a close enough to a. Both sides must give the same L."},
  {tool:"derivacia", ask:R`$f(x) = \frac{x^2 - 1}{x - 1}$ near $x_0 = 1$. Make the distance $\delta$ smaller and watch $f(x_0 - \delta)$ and $f(x_0 + \delta)$.`,
   take:R`from both sides the values approach 2, although $f(1)$ does not exist. The graph is the line $y = x + 1$ with a hole.`,
   cfg:{typ:"limita", en:true, x0:L(1), view:[-2, 5, 4, -1]}},
  {ex:R`Find $\lim_{x \to 3} \frac{x^2 - 9}{x - 3}$.`,
   steps:[
     [R`Substituting $x = 3$ gives $\frac{0}{0}$, so factorise.`, R`\frac{x^2 - 9}{x - 3} = \frac{(x - 3)(x + 3)}{x - 3}`],
     [R`For $x \neq 3$ cancel.`, R`= x + 3`],
     ["Now substitute.", R`\lim_{x \to 3} (x + 3) = 6`]
   ],
   res:"The limit is 6."},
  {ex:R`Find $\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}$.`,
   steps:[
     ["Again 0/0. Multiply by the conjugate.", R`\frac{\sqrt{x + 4} - 2}{x} \cdot \frac{\sqrt{x + 4} + 2}{\sqrt{x + 4} + 2} = \frac{x + 4 - 4}{x\,(\sqrt{x + 4} + 2)}`],
     [R`Cancel $x$.`, R`= \frac{1}{\sqrt{x + 4} + 2}`],
     ["Substitute.", R`\lim_{x \to 0} \frac{1}{\sqrt{x + 4} + 2} = \frac{1}{4}`]
   ],
   res:R`$\frac{1}{4}$.`},
  {tool:"derivacia", ask:R`$f(x) = \frac{|x|}{x}$ near $x_0 = 0$. Compare the values from the left and from the right.`,
   take:R`from the left $f = -1$, from the right $f = 1$. The one-sided limits differ, so $\lim_{x \to 0} f(x)$ does not exist.`,
   cfg:{typ:"limita", en:true, f:"abs(x)/x", x0:L(0), view:[-3, 2.5, 3, -2.5]}},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \frac{x^2 - 4}{x - 2}$. Move $x_0$ to the point where $f$ is not defined and read off the limit there.`,
   hint:"The denominator is 0 at x = 2. The limit there is 2 + 2 = 4.",
   goal:P => Math.abs(P.x0 - 2) < 1e-9,
   cfg:{typ:"limita", en:true, f:"(x^2 - 4)/(x - 2)", x0:{v:0}, view:[-3, 7, 5, -1]}},
  {warn:R`"$\frac{0}{0}$" is not an answer and not 1. It only tells you to simplify first (factorise, cancel, use the conjugate) and then substitute.`}
],

"Limits at infinity":[
  R`$\lim_{x \to \infty} f(x) = L$ means that $f(x)$ gets close to $L$ when $x$ grows without bound. The graph then approaches the horizontal line $y = L$, a **horizontal asymptote**.`,
  {def:"Limits to remember", tex:R`\lim_{x \to \infty} \frac{1}{x} = 0 \qquad \lim_{x \to \infty} \frac{1}{x^n} = 0\ (n > 0) \qquad \lim_{x \to \infty} e^{-x} = 0`},
  {tool:"derivacia", ask:R`$f(x) = \frac{2x + 1}{x + 2}$. Move $x$ to the right and watch $f(x)$.`,
   take:R`$f(x)$ approaches 2 but never reaches it: the line $y = 2$ is a horizontal asymptote.`,
   cfg:{typ:"limita", en:true, inf:true, f:"(2x + 1)/(x + 2)", view:[-1, 4, 30, -1], apart:true, tick:[5, 1], aspect:"16/10"}},
  {steps:[
    {t:"Highest power", d:"Find the highest power of x in the denominator."},
    {t:"Divide", d:"Divide every term of numerator and denominator by it."},
    {t:"Let x → ∞", d:"Every term c/xⁿ goes to 0. What is left is the limit."}
  ]},
  {ex:R`Find $\lim_{x \to \infty} \frac{3x^2 - x}{x^2 + 5}$ and $\lim_{x \to \infty} \frac{2x + 1}{x^2 + 1}$.`,
   steps:[
     [R`Divide by $x^2$.`, R`\frac{3 - \frac{1}{x}}{1 + \frac{5}{x^2}} \to \frac{3 - 0}{1 + 0} = 3`],
     [R`Divide by $x^2$.`, R`\frac{\frac{2}{x} + \frac{1}{x^2}}{1 + \frac{1}{x^2}} \to \frac{0}{1} = 0`]
   ],
   res:R`3 and 0. Same degree: ratio of the leading coefficients. Denominator of higher degree: 0.`},
  {tool:"graf", kind:"uloha", ask:R`$f(x) = \frac{ax + 1}{x + 2}$. Set $a$ so that the graph has the horizontal asymptote $y = 3$ (dashed).`,
   hint:"Divide by x: (a + 1/x)/(1 + 2/x) → a.",
   take:R`the limit at infinity is the ratio of the leading coefficients, $\frac{a}{1}$.`,
   goal:P => P.a === 3,
   cfg:{fns:["(a*x + 1)/(x + 2)", {f:"3", color:"c", dash:true, thin:true, ghost:true}], params:{a:{v:1, min:-3, max:5, step:.5, color:"a", note:"leading coefficient"}},
     view:[-1, 6, 30, -2], tick:[5, 1], free:true, aspect:"16/10"}},
  {warn:R`Do not substitute $\infty$ as if it were a number: $\frac{\infty}{\infty}$ and $\infty - \infty$ tell you nothing. Divide by the highest power first.`}
],

"Continuity":[
  R`A function is **continuous** at $a$ if its graph goes through the point $[a, f(a)]$ without a break: the limit exists and equals the value. Polynomials, $e^x$, $\sin x$ and $\cos x$ are continuous everywhere, $\ln x$ and $\sqrt{x}$ on their domains.`,
  {def:"Continuity at a point", tex:R`\lim_{x \to \va{a}} f(x) = f(\va{a})`,
   note:"Three things must hold: f(a) is defined, the limit exists, and they are equal."},
  {cards:[
    {t:"Hole", d:"The limit exists but f(a) is missing or different. Example: (x² − 1)/(x − 1) at 1."},
    {t:"Jump", d:"The one-sided limits differ. Example: |x|/x at 0."},
    {t:"Asymptote", d:"f(x) grows without bound near a. Example: 1/x at 0."}
  ]},
  {tool:"graf", kind:"uloha", ask:R`$f(x) = \frac{x^2 - 1}{x - 1}$ for $x \neq 1$, and $f(1) = c$. Choose $c$ so that $f$ is continuous at 1.`,
   hint:"The limit at 1 is 1 + 1 = 2.",
   take:R`with $f(1) = 2$ the filled point closes the hole: limit and value agree.`,
   goal:P => P.c === 2,
   cfg:{fns:["(x^2 - 1)/(x - 1)"], params:{c:{v:3, min:0, max:4, step:.5, color:"a", note:"value f(1)"}},
     view:[-2, 5, 4, -1], show:[{pt:[1, 2], open:true, color:"c"}, {pt:[1, "c"], color:"a", label:"[1; {c}]", at:"r"}]}},
  {ex:R`$f(x) = x^2$ for $x < 2$ and $f(x) = ax - 1$ for $x \geq 2$. Find $a$ so that $f$ is continuous.`,
   steps:[
     ["Limit from the left at 2.", R`\lim_{x \to 2^-} x^2 = 4`],
     ["Value (and limit from the right).", R`f(2) = 2a - 1`],
     ["They must agree.", R`2a - 1 = 4 \Rightarrow a = 2{,}5`]
   ],
   res:R`$a = 2{,}5$.`},
  {tool:"graf", kind:"uloha", ask:R`The two pieces of $f$ from the example. Set $a$ so that they meet at $x = 2$.`,
   hint:"2a − 1 = 4.",
   goal:P => P.a === 2.5,
   cfg:{fns:[{f:"x^2", dom:[-3, 2]}, {f:"a*x - 1", dom:[2, 6]}], params:{a:{v:1, min:0, max:4, step:.5, color:"a"}},
     view:[-3, 10, 5, -2], tick:[1, 2], free:true, aspect:"4/3"}},
  {warn:R`"Defined at every point" is not the same as "continuous". The function with a jump at 0 (e.g. $f(x) = -1$ for $x < 0$, $f(x) = 1$ for $x \geq 0$) is defined at 0 but not continuous there.`}
]

  }
};
})();

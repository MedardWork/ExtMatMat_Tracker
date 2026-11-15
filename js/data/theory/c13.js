/* Differential equations: what they are, checking a solution, qualitative analysis (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const S = st => st.h && st.h.sp;

THEORY.c13 = {
  mins:25,
  brief:[
    R`A **differential equation** links an unknown function $y(x)$ with its derivative, e.g. $y' = 2y$ or $y' = x - y$. A solution is a **function**, not a number.`,
    R`Check a solution by substituting $y$ and $y'$ into both sides.`,
    R`Most equations have a whole family of solutions (with a constant $C$); one point $[x_0, y_0]$ picks one of them.`,
    R`Without solving: $y' = F(x, y)$ gives the slope of the solution through every point; $y' = 0$ for a constant $y$ means an equilibrium.`
  ],
  subs:{

"What a differential equation is":[
  R`In an ordinary equation the unknown is a number. In a **differential equation** the unknown is a function $y(x)$, and the equation says something about its derivative. It describes how a quantity **changes**: a population grows in proportion to its size, a cup of tea cools in proportion to its difference from the room.`,
  {def:"Differential equation (first order)", tex:R`y' = F(x, y)`,
   note:"A solution is a function y = f(x) for which f′(x) = F(x, f(x)) for every x in an interval."},
  {cards:[
    {t:"y′ = 2x", d:"Only x on the right: integrate. y = x² + C."},
    {t:"y′ = k·y", d:"Growth proportional to the size: y = C·e^(kx) ([[c14]])."},
    {t:"y′ = x − y", d:"Both x and y on the right. The solution is y = x − 1 + C·e^(−x)."}
  ]},
  {tool:"smerpole", ask:R`$y' = 2x$. Each short segment shows the slope $2x$ at that point. Drag the point $A$ and watch the solution through it.`,
   take:R`all solutions are parabolas $y = x^2 + C$, shifted up and down. Every point lies on exactly one of them.`,
   cfg:{f:"2*x", en:true, start:[0, -2], view:[-3, 5, 3, -3]}},
  {ex:R`Solve $y' = 6x^2 - 1$.`,
   steps:[
     ["The right side depends only on x: integrate.", R`y = \int (6x^2 - 1)\,dx = 2x^3 - x + C`]
   ],
   res:R`$y = 2x^3 - x + C$, one solution for every $C$.`},
  {warn:R`The answer to a differential equation is a function (or a family of functions), not a number. "$y = 3$" is a solution only if the constant function 3 satisfies the equation.`}
],

"Checking a solution":[
  R`To check whether a given function solves a differential equation, compute its derivative and substitute both into the equation. If the two sides agree **for every $x$**, it is a solution. No solving is needed, so this is a typical by-hand task.`,
  {steps:[
    {t:"Differentiate", d:"Compute y′ from the given y."},
    {t:"Left side", d:"Put y′ into the left side."},
    {t:"Right side", d:"Put x and y into the right side."},
    {t:"Compare", d:"Both sides must be the same expression in x."}
  ]},
  {ex:R`Is $y = 3e^{2x}$ a solution of $y' = 2y$?`,
   steps:[
     ["Left side.", R`y' = 6e^{2x}`],
     ["Right side.", R`2y = 2 \cdot 3e^{2x} = 6e^{2x}`]
   ],
   res:"Yes, both sides are 6e^(2x)."},
  {ex:R`Show that $y = x - 1 + Ce^{-x}$ solves $y' = x - y$ for every $C$.`,
   steps:[
     ["Left side.", R`y' = 1 - Ce^{-x}`],
     ["Right side.", R`x - y = x - (x - 1 + Ce^{-x}) = 1 - Ce^{-x}`]
   ],
   res:"The sides agree, so every member of the family is a solution."},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = x - y$. One of the solutions $y = x - 1 + Ce^{-x}$ is a straight line ($C = 0$). Drag $A$ onto it.`,
   hint:"The line is y = x − 1; for example A = [2; 1] or [0; −1].",
   take:R`on the line $y = x - 1$ the slope $x - y$ is always 1, the slope of the line itself. The other solutions approach it.`,
   goal:(P, st) => !!S(st) && Math.abs(S(st).y0 - (S(st).x0 - 1)) < 1e-6,
   cfg:{f:"x - y", en:true, start:[0, 2]}},
  {tool:"graf", ask:R`The family $y = x - 1 + Ce^{-x}$ drawn as a graph. Change $C$ and compare with the slope field above.`,
   take:R`for every $C$ the curve has the shape of a solution curve in the field; for $C = 0$ it is the line.`,
   cfg:{fns:["x - 1 + C*exp(-x)"], params:{C:{v:2, min:-3, max:3, step:.5, color:"a"}}, view:[-5, 5, 5, -5]}},
  {warn:R`Checking at one value of $x$ is not enough: the two sides must agree as functions. For $y = x^2$ and $y' = 2y$: at $x = 0$ both sides are 0, but $y' = 2x$ and $2y = 2x^2$ differ at $x = 2$ ($4 \neq 8$), so $y = x^2$ is not a solution.`}
],

"Qualitative analysis":[
  R`Even without a formula for the solution, the equation tells us a lot. The right side $F(x, y)$ is the **slope** of the solution through $[x, y]$. Its sign says where solutions rise or fall, and a constant $y$ with $F = 0$ is an **equilibrium**: a horizontal solution.`,
  {def:"Reading the equation", tex:R`F(x, y) > 0:\ \text{rising} \qquad F(x, y) < 0:\ \text{falling} \qquad F(x, y_0) = 0 \text{ for all } x:\ y = y_0 \text{ is a solution}`},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = 0{,}3\,y\,(4 - y)$. Drag $A$ to a point whose solution is a horizontal line (an equilibrium).`,
   hint:"The right side is 0 when y = 0 or y = 4.",
   take:R`$y = 0$ and $y = 4$ are equilibria. Between them solutions rise towards 4; above 4 they fall towards 4.`,
   goal:(P, st) => !!S(st) && (Math.abs(S(st).y0) < 1e-6 || Math.abs(S(st).y0 - 4) < 1e-6),
   cfg:{f:"a*y*(M - y)", en:true, params:{a:L(.3), M:L(4)}, start:[0, 1.5], view:[-1, 6, 9, -1]}},
  {ex:R`Without solving, describe the solutions of $y' = 2 - 0{,}5y$.`,
   steps:[
     ["Equilibrium.", R`2 - 0{,}5y = 0 \iff y = 4`],
     [R`Below 4.`, R`y < 4 \Rightarrow y' > 0:\ \text{rising}`],
     [R`Above 4.`, R`y > 4 \Rightarrow y' < 0:\ \text{falling}`]
   ],
   res:R`All solutions approach $y = 4$; $y = 4$ itself is a solution.`},
  {ex:R`The solution of $y' = x - y$ goes through $[0, 1]$. Find the tangent of the solution curve there.`,
   steps:[
     ["Slope from the equation.", R`y'(0) = 0 - 1 = -1`],
     ["Tangent through [0, 1].", R`y = -1 \cdot (x - 0) + 1 = -x + 1`]
   ],
   res:R`$y = -x + 1$, found without knowing the solution.`},
  {tool:"smerpole", ask:R`$y' = x - y$ through $A = [0, 1]$. The slope at $A$ is printed: compare it with the example.`,
   take:R`the slope at $A$ is $-1$, the tangent from the example.`,
   cfg:{f:"x - y", en:true, start:[0, 1], fixed:true}},
  {warn:R`An equilibrium is a whole horizontal line, so $F(x, y_0)$ must be 0 for **every** $x$. In $y' = x - y$ there is none: $x - y = 0$ is the line $y = x$, not a horizontal one.`}
]

  }
};
})();

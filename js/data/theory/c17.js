/* Slope fields: reading and sketching (Danish Matematik A) */
(() => {
const S = st => st.h && st.h.sp;

THEORY.c17 = {
  mins:20,
  brief:[
    R`A **slope field** draws at many points $[x, y]$ a short segment with the slope $F(x, y)$ from $y' = F(x, y)$.`,
    R`Solution curves are tangent to the segments everywhere and never cross each other.`,
    R`Slopes equal along vertical lines: $y' = f(x)$. Equal along horizontal lines: $y' = g(y)$ (no $x$ on the right).`,
    R`Horizontal segments mark where $F(x, y) = 0$; horizontal rows of them are equilibria.`
  ],
  subs:{

"Reading a slope field":[
  R`Without solving anything, the slope field shows the shape of all solutions at once. Read it like a map of currents: at each point the segment says in which direction a solution curve passes through it.`,
  {cards:[
    {t:"Same along vertical lines", d:"The slope depends only on x: y′ = f(x). The solutions are shifted copies of each other (up/down)."},
    {t:"Same along horizontal lines", d:"The slope depends only on y: y′ = g(y). The solutions are shifted copies sideways."},
    {t:"Horizontal segments", d:"Where F(x, y) = 0. A whole horizontal row of them is an equilibrium solution."},
    {t:"Steep segments", d:"Large |F|: the solution changes fast there."}
  ]},
  {tool:"smerpole", ask:R`$y' = x + y$, field only. Drag $A$ and read the slope. Where are the segments horizontal?`,
   take:R`the slope is 0 along the line $y = -x$; above it the field rises, below it falls.`,
   cfg:{f:"x + y", en:true, start:[1, 1], on:{riesenie:false}}},
  {tool:"smerpole", kind:"uloha", ask:R`Same field. Drag $A$ to a point where the solution through it has a horizontal tangent.`,
   hint:"x + y = 0, for example A = [1; −1].",
   goal:(P, st) => !!S(st) && Math.abs(S(st).m) < 1e-6,
   cfg:{f:"x + y", en:true, start:[1, 1], on:{riesenie:false}}},
  {ex:R`Which of $y' = x$, $y' = y$, $y' = x + y$ has a field in which all segments along each horizontal line are parallel?`,
   steps:[
     ["Parallel along a horizontal line means the slope does not depend on x.", R`y' = g(y)`],
     ["Only one equation has no x on the right.", R`y' = y`]
   ],
   res:R`$y' = y$.`},
  {warn:R`The field shows slopes, not values. A steep segment at $[2, 1]$ says that the solution through $[2, 1]$ changes fast there, not that $y$ is large.`}
],

"Sketching solution curves":[
  R`To sketch a solution through a given point, start there and follow the segments in both directions, always tangent to them, like a leaf on a stream. Two solution curves never cross, so the curves through nearby points run side by side.`,
  {steps:[
    {t:"Start", d:"Mark the initial point A."},
    {t:"Follow", d:"Draw a short piece along the segment at A, then continue along the segments where you arrive, to the right and to the left."},
    {t:"Check", d:"The curve must never cut a segment at an angle and never cross another solution or an equilibrium line."}
  ]},
  {tool:"smerpole", ask:R`$y' = y - x$. Guess the curve through $A$ from the segments, then switch on the solution and compare.`,
   take:R`above the line $y = x + 1$ solutions curve upwards, below it downwards; the line itself is a solution.`,
   cfg:{f:"y - x", en:true, start:[0, 1.5], on:{riesenie:false}, toggles:["riesenie"]}},
  {ex:R`Show that $y = x + 1$ is a solution of $y' = y - x$ and explain what happens to solutions just above and just below it.`,
   steps:[
     ["Check.", R`y' = 1,\quad y - x = (x + 1) - x = 1`],
     [R`Above: $y > x + 1$.`, R`y' = y - x > 1:\ \text{steeper than the line, they move away upwards}`],
     [R`Below: $y < x + 1$.`, R`y' < 1:\ \text{flatter, they fall away below}`]
   ],
   res:R`$y = x + 1$ is a solution; nearby solutions move away from it on both sides.`},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = y - x$. Drag $A$ so that the solution through it is the straight line $y = x + 1$.`,
   hint:"Put A on the line, for example A = [0; 1] or [1; 2].",
   goal:(P, st) => !!S(st) && Math.abs(S(st).y0 - S(st).x0 - 1) < 1e-6,
   cfg:{f:"y - x", en:true, start:[0, 2]}},
  {warn:R`Do not sketch a solution that turns back on itself or goes vertical: a solution of $y' = F(x, y)$ is a function of $x$, one $y$ for each $x$.`}
]

  }
};
})();

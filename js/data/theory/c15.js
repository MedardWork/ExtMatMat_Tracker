/* Separation of variables, initial conditions (Danish Matematik A) */
(() => {
const S = st => st.h && st.h.sp;

THEORY.c15 = {
  mins:20,
  brief:[
    R`If $y' = g(x) \cdot h(y)$, separate: $\int \frac{1}{h(y)}\,dy = \int g(x)\,dx$, then solve for $y$.`,
    R`Only one constant $C$ is needed, on the side of $x$.`,
    R`An **initial condition** $y(x_0) = y_0$ picks one solution: substitute it to find $C$.`,
    R`Through each point there is exactly one solution curve (for the equations at this level).`
  ],
  subs:{

"Separating variables":[
  R`When the right side is a product of a function of $x$ and a function of $y$, write $y' = \frac{dy}{dx}$ and move everything with $y$ to the left and everything with $x$ to the right. Then integrate both sides.`,
  {def:"Separation of variables", tex:R`\frac{dy}{dx} = g(x)\,h(y) \Rightarrow \int \frac{1}{h(y)}\,dy = \int g(x)\,dx`,
   note:"Divide by h(y) only where h(y) ≠ 0; the zeros of h give constant solutions."},
  {steps:[
    {t:"Separate", d:"Write dy/dx and bring all y to the side of dy, all x to the side of dx."},
    {t:"Integrate", d:"Integrate both sides; add one constant C on the x side."},
    {t:"Solve for y", d:"Isolate y if possible (exponentiate when ln|y| appears)."}
  ]},
  {ex:R`Solve $y' = x \cdot y$.`,
   steps:[
     ["Separate.", R`\frac{1}{y}\,dy = x\,dx`],
     ["Integrate.", R`\ln|y| = \frac{x^2}{2} + C`],
     ["Solve for y (the constant changes name).", R`y = K e^{x^2/2}`]
   ],
   res:R`$y = K e^{x^2/2}$ (with $K = 0$ the constant solution $y = 0$).`},
  {tool:"smerpole", ask:R`$y' = x \cdot y$. Drag $A$ and watch the solutions $y = K e^{x^2/2}$.`,
   take:R`the solutions are valleys (for $K > 0$) or hills (for $K < 0$), symmetric about the $y$-axis, with a horizontal tangent at $x = 0$.`,
   cfg:{f:"x*y", en:true, start:[0, 1], view:[-3, 5, 3, -5], tick:1}},
  {ex:R`Solve $y' = -\frac{x}{y}$.`,
   steps:[
     ["Separate.", R`y\,dy = -x\,dx`],
     ["Integrate.", R`\frac{y^2}{2} = -\frac{x^2}{2} + C`],
     ["Rearrange.", R`x^2 + y^2 = 2C = R^2`]
   ],
   res:R`The solution curves are circles centred at the origin (each half-circle is one solution).`},
  {warn:R`Do not forget the constant, and add it **before** solving for $y$: $\ln|y| = \frac{x^2}{2} + C$ gives $y = Ke^{x^2/2}$, a factor, not $e^{x^2/2} + C$.`}
],

"Initial conditions":[
  R`The general solution contains a constant. An **initial condition** $y(x_0) = y_0$ says that the solution curve passes through $[x_0, y_0]$. Substituting it gives the constant and with it the **particular solution**.`,
  {def:"Initial value problem", tex:R`y' = F(x, y),\quad y(\va{x_0}) = \vb{y_0}`},
  {tool:"smerpole", ask:R`$y' = -\frac{x}{y}$, the slope field only. The point $A$ is the initial condition. Follow the segments from $A$ with your eyes: which curve do they form?`,
   take:R`the segments are tangent to circles around the origin. The circle through $A$ has radius $\sqrt{x_0^2 + y_0^2}$.`,
   cfg:{f:"-x/y", en:true, start:[0, 3], on:{riesenie:false}}},
  {tool:"graf", ask:R`The solutions $y = \pm\sqrt{r^2 - x^2}$. Change $r$.`,
   take:R`for $y_0 > 0$ the solution is the upper half-circle, for $y_0 < 0$ the lower one. At $y = 0$ the slope $-\frac{x}{y}$ is not defined, so a solution ends there.`,
   cfg:{fns:["sqrt(r^2 - x^2)", {f:"-sqrt(r^2 - x^2)", color:"b"}], params:{r:{v:3, min:1, max:4.5, step:.5, color:"a"}}, view:[-5, 5, 5, -5]}},
  {ex:R`Solve $y' = -\frac{x}{y}$ with $y(0) = 3$.`,
   steps:[
     ["General solution.", R`x^2 + y^2 = R^2`],
     ["Condition.", R`0 + 9 = R^2`],
     [R`$y_0 = 3 > 0$: the upper half.`, R`y = \sqrt{9 - x^2},\quad -3 < x < 3`]
   ],
   res:R`$y = \sqrt{9 - x^2}$.`},
  {tool:"smerpole", kind:"uloha", ask:R`$y' = -\frac{x}{y}$. Drag $A$ so that the solution is part of the circle with radius 4.`,
   hint:"A must lie at distance 4 from the origin, e.g. [0; 4] or [0; −4].",
   goal:(P, st) => !!S(st) && Math.abs(Math.hypot(S(st).x0, S(st).y0) - 4) < 1e-6 && Math.abs(S(st).y0) > 1e-6,
   cfg:{f:"-x/y", en:true, start:[0, 2], on:{riesenie:false}}},
  {ex:R`Solve $y' = x \cdot y$ with $y(0) = 2$, and $y' = 0{,}2y$ with $y(0) = 500$.`,
   steps:[
     ["General solution and condition.", R`y = Ke^{x^2/2},\quad y(0) = K = 2`],
     ["Particular solution.", R`y = 2e^{x^2/2}`],
     ["Second equation.", R`y = Ke^{0{,}2x},\quad K = 500:\ y = 500e^{0{,}2x}`]
   ],
   res:R`$y = 2e^{x^2/2}$ and $y = 500e^{0{,}2x}$.`},
  {tool:"graf", ask:R`The particular solution $y = 2e^{x^2/2}$ from the example as a graph. Compare with the slope field of $y' = xy$ through $[0, 2]$.`,
   take:R`the same valley through $[0, 2]$, horizontal at 0 and steep for larger $|x|$.`,
   cfg:{fns:["2*exp(x^2/2)"], view:[-3, 9, 3, -1], show:[{pt:[0, 2], color:"a", label:"[0; 2]", at:"r"}]}},
  {ex:R`Solve $y' = 2x(y - 1)$ with $y(0) = 3$.`,
   steps:[
     ["Separate.", R`\frac{1}{y - 1}\,dy = 2x\,dx`],
     ["Integrate.", R`\ln|y - 1| = x^2 + C \Rightarrow y = 1 + Ke^{x^2}`],
     ["Condition.", R`3 = 1 + K \Rightarrow K = 2`]
   ],
   res:R`$y = 1 + 2e^{x^2}$.`},
  {warn:R`Determine the constant from the condition **after** integrating, never before; and when the solution has two branches (like $\pm\sqrt{\ }$), the sign of $y_0$ decides which one.`}
]

  }
};
})();

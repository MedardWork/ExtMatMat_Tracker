/* Euler's method (Danish Matematik A) */
(() => {
const S = st => st.h && st.h.sp;

THEORY.c16 = {
  mins:20,
  brief:[
    R`Euler's method follows the slope field in small straight steps: $x_{n+1} = x_n + h$, $y_{n+1} = y_n + h \cdot F(x_n, y_n)$.`,
    R`Each step goes along the tangent, so the polygon drifts away from the true solution where the curve bends.`,
    R`Smaller step $h$ means a smaller error (roughly proportional to $h$) but more steps.`,
    R`It works for every equation $y' = F(x, y)$, also when no formula for the solution exists.`
  ],
  subs:{

"Euler's step":[
  R`Start at the initial point $[x_0, y_0]$. The equation gives the slope there, $F(x_0, y_0)$. Walk a short distance $h$ to the right along this slope: that gives the next point. Repeat from the new point with its own slope.`,
  {def:"Euler's method", tex:R`x_{n+1} = x_n + \vd{h} \qquad y_{n+1} = y_n + \vd{h} \cdot F(x_n, y_n)`,
   note:"h is the step size. The points [xₙ, yₙ] joined by segments form Euler's polygon."},
  {tool:"smerpole", ask:R`$y' = x - y$ from $A = [0, 1]$ with $h = 0{,}5$. Compare the table of Euler's points with the true solution.`,
   take:R`each segment has the slope of the field at its starting point. The polygon stays below the curve here and the gap grows.`,
   cfg:{f:"x - y", en:true, start:[0, 1], fixed:true, view:[-1, 4, 5, -1], on:{euler:true}}},
  {ex:R`Use Euler's method with $h = 0{,}5$ on $y' = x - y$, $y(0) = 1$, up to $x = 2$.`,
   steps:[
     [R`At $[0;\ 1]$ the slope is $-1$.`, R`y_1 = 1 + 0{,}5 \cdot (-1) = 0{,}5`],
     [R`At $[0{,}5;\ 0{,}5]$ the slope is 0.`, R`y_2 = 0{,}5`],
     [R`At $[1;\ 0{,}5]$ the slope is $0{,}5$.`, R`y_3 = 0{,}5 + 0{,}25 = 0{,}75`],
     [R`At $[1{,}5;\ 0{,}75]$ the slope is $0{,}75$.`, R`y_4 = 0{,}75 + 0{,}375 = 1{,}125`],
     [R`True value: $y = x - 1 + 2e^{-x}$.`, R`y(2) = 1 + 2e^{-2} \approx 1{,}271`]
   ],
   res:R`Euler gives $1{,}125$, the true value is $1{,}271$: error about $0{,}146$.`},
  {ex:R`$y' = 0{,}2y$, $y(0) = 500$. Two Euler steps with $h = 1$, compared with the exact solution.`,
   steps:[
     ["Step 1.", R`y_1 = 500 + 1 \cdot 0{,}2 \cdot 500 = 600`],
     ["Step 2.", R`y_2 = 600 + 0{,}2 \cdot 600 = 720`],
     ["Exact.", R`500\,e^{0{,}4} \approx 745{,}9`]
   ],
   res:R`Euler: 720, exact: 745,9. For growth, Euler stays below, because the true curve bends upwards.`},
  {warn:R`Use the slope at the **start** of each step, $F(x_n, y_n)$, with the new $y_n$ from the step before, not the original $y_0$ again.`}
],

"Accuracy and step size":[
  R`Every step follows a straight line while the solution bends, so a small error appears in each step, and errors add up. Halving the step halves (roughly) the total error, but doubles the number of steps. In practice the steps are done by a spreadsheet or CAS.`,
  {def:"Error of Euler's method", tex:R`\text{error at a fixed } x \approx c \cdot \vd{h}`,
   note:"Halve h → about half the error. The error is largest where the solution curves strongly."},
  {tool:"smerpole", ask:R`Same equation. Make $h$ smaller and raise $n$ so that you still reach $x = 2$. Watch the error printed below the table.`,
   take:R`$h = 0{,}5$: error $0{,}146$; $h = 0{,}2$: error $0{,}056$. The polygon hugs the curve more closely.`,
   cfg:{f:"x - y", en:true, start:[0, 1], fixed:true, view:[-1, 4, 5, -1], on:{euler:true}}},
  {tool:"smerpole", kind:"uloha", ask:R`Choose $h$ and $n$ so that Euler's method ends exactly at $x = 2$ with an error below $0{,}06$.`,
   hint:"n · h = 2 and h as small as the sliders allow: h = 0,2 with n = 10.",
   goal:(P, st) => { const s = S(st); return !!s && !!s.eul && s.eul.length > 1 && Math.abs(s.eul[s.eul.length - 1][0] - 2) < 1e-6 && s.chyba != null && s.chyba < .06; },
   cfg:{f:"x - y", en:true, start:[0, 1], fixed:true, view:[-1, 4, 5, -1], on:{euler:true}}},
  {ex:R`With $h = 0{,}5$ the error at $x = 2$ was $0{,}146$ and with $h = 0{,}25$ it is $0{,}070$. Estimate the error for $h = 0{,}1$.`,
   steps:[
     ["The error is about proportional to h.", R`\frac{0{,}146}{0{,}5} \approx 0{,}29 \approx \frac{0{,}070}{0{,}25}`],
     ["For h = 0,1.", R`0{,}29 \cdot 0{,}1 \approx 0{,}03`]
   ],
   res:R`About $0{,}03$, five times smaller than with $h = 0{,}5$.`},
  {warn:R`A smaller step only helps if you still reach the same $x$: with $h = 0{,}1$ you need 20 steps to get from 0 to 2, not 4.`}
]

  }
};
})();

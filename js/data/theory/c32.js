/* Power functions (Danish Matematik A) */
(() => {
const POT = [[1, 3.1], [2, 8.3], [4, 24.5], [8, 67], [16, 195]];

THEORY.c32 = {
  mins:20,
  brief:[
    R`Power model $f(x) = b \cdot x^a$ ($x > 0$): $b = f(1)$, the exponent $a$ sets the shape.`,
    R`Through two points: $a = \frac{\ln(y_2 / y_1)}{\ln(x_2 / x_1)}$, $b = \frac{y_1}{x_1^a}$.`,
    R`Percent–percent: if $x$ is multiplied by $1 + r_x$, then $y$ is multiplied by $(1 + r_x)^a$.`,
    R`Doubling $x$ multiplies $y$ by $2^a$, whatever $x$ is.`
  ],
  subs:{

"Power functions b · xᵃ":[
  R`In a **power function** the variable is in the base and the exponent is fixed: area of a square $x^2$, volume $x^3$, Kepler's law $T = k \cdot r^{1{,}5}$. For $a > 1$ the graph bends upwards, for $0 < a < 1$ it bends downwards, for $a < 0$ it decreases.`,
  {def:"Power model", tex:R`f(x) = \vb{b} \cdot x^{\va{a}} \qquad a = \frac{\ln(y_2 / y_1)}{\ln(x_2 / x_1)} \qquad b = \frac{y_1}{x_1^{\,a}}`},
  {tool:"graf", ask:R`$f(x) = b \cdot x^a$ for $x > 0$. Change $a$ through 1 and through 0.`,
   take:R`$a = 1$ is a line through the origin; $a > 1$ bends up, $0 < a < 1$ bends down, $a < 0$ falls towards the $x$-axis. All graphs pass through $[1;\ b]$.`,
   cfg:{fns:[{f:"b*x^a", dom:[0, 10]}], params:{b:{v:2, min:.5, max:4, step:.5, color:"b"}, a:{v:1.5, min:-1, max:3, step:.25, color:"a"}}, view:[-1, 12, 6, -1], tick:[1, 2], free:true, aspect:"4/3"}},
  {ex:R`A power function has $f(2) = 12$ and $f(4) = 48$. Find it.`,
   steps:[
     ["Exponent.", R`a = \frac{\ln(48/12)}{\ln(4/2)} = \frac{\ln 4}{\ln 2} = 2`],
     ["Factor.", R`b = \frac{12}{2^2} = 3`]
   ],
   res:R`$f(x) = 3x^2$.`},
  {tool:"graf", kind:"uloha", ask:R`$f(x) = 2 \cdot x^a$. Set $a$ so that the graph passes through $[2;\ 16]$, i.e. doubling $x$ multiplies $y$ by 8.`,
   hint:"2ᵃ = 8.",
   goal:P => Math.abs(P.a - 3) < 1e-6,
   cfg:{fns:[{f:"2*x^a", dom:[0, 10]}], params:{a:{v:1, min:-1, max:4, step:.25, color:"a"}}, view:[-1, 20, 4, -2], tick:[1, 2], free:true, aspect:"4/3",
     show:[{target:[2, 16], fn:0, label:"[2; 16]"}]}},
  {tool:"regresia", ask:R`Data with the fitted power model $y = b \cdot x^a$.`,
   take:R`the fit gives about $y = 3{,}04 \cdot x^{1{,}50}$: doubling $x$ multiplies $y$ by $2^{1{,}5} \approx 2{,}83$.`,
   cfg:{model:"pot", en:true, data:POT}},
  {warn:R`Do not confuse $b \cdot x^a$ (power, variable in the base) with $b \cdot a^x$ (exponential, variable in the exponent). A power model needs $x > 0$.`}
],

"Percent–percent growth":[
  R`Power functions have a special property: a fixed **percentage** change in $x$ always gives the same percentage change in $y$, wherever you are on the graph. That is how to recognise them in words ("if the radius increases by 10 %, the volume increases by …").`,
  {def:"Percent–percent", tex:R`1 + r_y = (1 + r_x)^{\va{a}}`,
   note:"rₓ and r_y are the relative changes of x and y (as decimals)."},
  {ex:R`$y = 3x^2$. By how many percent does $y$ grow if $x$ grows by 10 %?`,
   steps:[
     ["Factor for y.", R`1{,}10^2 = 1{,}21`]
   ],
   res:"By 21 %."},
  {ex:R`$y = 5x^{0{,}8}$. $x$ increases by 25 %. By how many percent does $y$ increase? And how much must $x$ increase for $y$ to double?`,
   steps:[
     ["Factor for y.", R`1{,}25^{0{,}8} \approx 1{,}195`],
     ["Doubling y.", R`(1 + r_x)^{0{,}8} = 2 \Rightarrow 1 + r_x = 2^{1/0{,}8} = 2^{1{,}25} \approx 2{,}378`]
   ],
   res:"y increases by about 19,5 %; x must grow by about 138 % for y to double."},
  {tool:"regresia", ask:R`The power model on log-log axes: both axes logarithmic. What happens to the curve?`,
   take:R`it becomes a straight line with slope $a$: that is the test for a power model ([[c34]]).`,
   cfg:{model:"pot", en:true, os:"loglog", data:POT}},
  {warn:R`Percentages do not add up through the exponent: +10 % in $x$ with $a = 2$ is +21 % in $y$, not +20 %.`}
]

  }
};
})();

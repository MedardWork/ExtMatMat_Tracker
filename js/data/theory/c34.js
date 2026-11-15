/* Semi-log and log-log coordinates (Danish Matematik A) */
(() => {
const EXP = [[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]];
const POT = [[1, 3.1], [2, 8.3], [4, 24.5], [8, 67], [16, 195]];

THEORY.c34 = {
  mins:20,
  brief:[
    R`Semi-log paper: the $y$-axis is logarithmic (equal steps for 1, 10, 100 …), the $x$-axis ordinary.`,
    R`An exponential function $y = b \cdot a^x$ is a **straight line** in semi-log coordinates, because $\log y = \log b + x \log a$.`,
    R`Log-log paper: both axes logarithmic. A power function $y = b \cdot x^a$ is a straight line there, with slope $a$.`,
    R`So: points on a line on semi-log paper → exponential model; on log-log paper → power model.`
  ],
  subs:{

"Semi-log coordinates":[
  R`On a logarithmic axis the distance from 1 to 10 equals the distance from 10 to 100: equal **ratios** have equal steps. An exponential function multiplies $y$ by the same factor $a$ for each step in $x$, so on such an axis it climbs by equal steps: its graph becomes a straight line.`,
  {def:"Exponential function on semi-log paper", tex:R`y = \vb{b} \cdot \va{a}^x \iff \log y = \log \vb{b} + x \cdot \log \va{a}`,
   note:"A straight line in (x, log y) with slope log a and intercept log b."},
  {tool:"regresia", ask:R`The same data on ordinary axes (here) and on semi-log axes (below). Compare the shape of the fitted curve.`,
   take:R`on ordinary axes the curve bends upwards …`,
   cfg:{model:"exp", en:true, data:EXP}},
  {tool:"regresia", ask:R`… and on semi-log axes. What does the exponential curve look like now?`,
   take:R`a straight line: the points lie close to it, so an exponential model fits.`,
   cfg:{model:"exp", en:true, os:"semilog", data:EXP}},
  {ex:R`On semi-log paper the points $(0;\ 2)$ and $(4;\ 32)$ lie on a straight line. Find the exponential function.`,
   steps:[
     ["Start value.", R`b = 2`],
     ["Growth over 4 steps.", R`a^4 = \frac{32}{2} = 16 \Rightarrow a = 2`]
   ],
   res:R`$y = 2 \cdot 2^x$.`},
  {warn:R`Read values on a logarithmic axis carefully: halfway between 10 and 100 is about 32 ($\sqrt{1000}$), not 55. Between grid lines the steps are not even.`}
],

"Log-log coordinates":[
  R`If both axes are logarithmic, a power function $y = b \cdot x^a$ becomes a straight line: taking logarithms gives $\log y = \log b + a \cdot \log x$, a line in $(\log x, \log y)$ whose slope is the exponent $a$.`,
  {def:"Power function on log-log paper", tex:R`y = \vb{b} \cdot x^{\va{a}} \iff \log y = \log \vb{b} + \va{a} \cdot \log x`},
  {tool:"regresia", ask:R`Data with a power model on log-log axes. Drag a point off the line and back.`,
   take:R`the fitted power function is a straight line with slope $a \approx 1{,}5$; one point off the line is easy to spot.`,
   cfg:{model:"pot", en:true, os:"loglog", data:POT}},
  {tool:"regresia", ask:R`The same data with an exponential model on semi-log axes. Does it fit?`,
   take:R`no: on semi-log axes the points bend (and $r^2 \approx 0{,}65$). The right paper shows the right model.`,
   cfg:{model:"exp", en:true, os:"semilog", data:POT}},
  {ex:R`On log-log paper the points $(1;\ 3)$ and $(100;\ 3000)$ lie on a straight line. Find the power function.`,
   steps:[
     ["Slope in log coordinates.", R`a = \frac{\log 3000 - \log 3}{\log 100 - \log 1} = \frac{\log 1000}{2} = 1{,}5`],
     ["At x = 1, y = b.", R`b = 3`]
   ],
   res:R`$y = 3x^{1{,}5}$.`},
  {warn:R`The slope on log-log paper is measured in logarithms (decades), not in the printed numbers: from 1 to 100 is 2 decades, from 3 to 3000 is 3 decades, slope $\frac{3}{2}$.`}
]

  }
};
})();

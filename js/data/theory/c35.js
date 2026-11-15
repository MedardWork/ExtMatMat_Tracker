/* Choosing a model, regression in CAS (Danish Matematik A) */
(() => {
const EXP = [[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]];
const G = st => st.h && st.h.reg;

THEORY.c35 = {
  mins:20,
  brief:[
    R`Choose the model type from the context and the shape of the data first, then let CAS find the parameters.`,
    R`Equal differences in $y$ per step: linear. Equal ratios: exponential. Percent–percent: power. Up and down once: quadratic. Repeating: trigonometric.`,
    R`$r^2$ close to 1 means a close fit, but it does not prove the right model; look at the residuals too ([[c36]]).`,
    R`Report the model with units and sensible rounding, and be careful with predictions far outside the data.`
  ],
  subs:{

"Choosing a model type":[
  R`Regression finds the best parameters for a model type you choose; it does not choose the type. Look at the situation (does it grow by a fixed amount or a fixed percentage? does it level off? repeat?) and at the data: compute differences and ratios of successive values.`,
  {cards:[
    {t:"Linear y = ax + b", d:"Constant differences: y grows by the same amount per step."},
    {t:"Exponential y = b · aˣ", d:"Constant ratios: y grows by the same percentage per step. Straight on semi-log paper."},
    {t:"Power y = b · xᵃ", d:"Percent change in x gives a fixed percent change in y. Straight on log-log paper."},
    {t:"Quadratic, trigonometric", d:"One turning point (e.g. a thrown ball) / a repeating pattern (seasons)."}
  ]},
  {ex:R`Data: $x$: 0, 1, 2, 3, 4, 5; $y$: 2,1; 2,9; 4,4; 6,2; 9,3; 13,4. Linear or exponential?`,
   steps:[
     ["Differences grow.", R`0{,}8;\ 1{,}5;\ 1{,}8;\ 3{,}1;\ 4{,}1`],
     ["Ratios are almost constant.", R`1{,}38;\ 1{,}52;\ 1{,}41;\ 1{,}50;\ 1{,}44`]
   ],
   res:"Exponential (factor about 1,45 per step)."},
  {tool:"regresia", ask:R`The data with a **linear** model. Look at the curve and $r^2$.`,
   take:R`$r^2 \approx 0{,}93$ looks fine, but the line misses systematically: above the points at the ends, below in the middle.`,
   cfg:{model:"lin", en:true, data:EXP, on:{rezidua:true}}},
  {tool:"regresia", ask:R`The same data with an **exponential** model.`,
   take:R`$r^2 \approx 0{,}9996$ and the curve goes through the points: the better model, as the ratios suggested.`,
   cfg:{model:"exp", en:true, data:EXP, on:{rezidua:true}}},
  {warn:R`A higher $r^2$ alone is not enough to choose a model: a quadratic fits these data with $r^2 \approx 0{,}998$ too, but predicts badly outside the data. The context decides.`}
],

"Doing regression in CAS":[
  R`In CAS (and in spreadsheets) you enter the data as two lists or columns, choose the regression type and get the parameters, usually with $r^2$. Then you define the model as a function and use it: compute values, solve equations, draw it together with the data.`,
  {steps:[
    {t:"Enter", d:"Data in two lists (x and y), units noted."},
    {t:"Regress", d:"ExpReg / LinReg / PowerReg … (names differ). Write down the parameters with enough digits."},
    {t:"Check", d:"Plot data and model together; look at r² and the residuals."},
    {t:"Use", d:"Define f(x) from the parameters, then compute predictions or solve f(x) = c."}
  ]},
  {tool:"regresia", kind:"uloha", ask:R`One point was entered wrongly. Drag it back so that the exponential model fits with $r^2 > 0{,}999$.`,
   hint:"The point at x = 3 is far above the curve; move it down to about 6.",
   goal:(P, st) => !!G(st) && G(st).r2 > .999,
   cfg:{model:"exp", en:true, data:[[0, 2.1], [1, 2.9], [2, 4.4], [3, 8.2], [4, 9.3], [5, 13.4]], on:{rezidua:true}}},
  {ex:R`CAS gives $y = 2{,}055 \cdot 1{,}454^x$ for the data above. Predict $y$ at $x = 7$, and find when $y$ reaches 50.`,
   steps:[
     ["Prediction.", R`2{,}055 \cdot 1{,}454^7 \approx 28{,}3`],
     ["Solve.", R`2{,}055 \cdot 1{,}454^x = 50 \Rightarrow x = \frac{\ln(50 / 2{,}055)}{\ln 1{,}454} \approx 8{,}5`]
   ],
   res:"y ≈ 28,3 at x = 7; y = 50 at about x = 8,5 (both outside the data: extrapolation)."},
  {tool:"regresia", kind:"uloha", ask:R`Switch on the prediction and set $x = 7$ to check the example.`,
   hint:"Tick the prediction and move the slider x to 7.",
   take:R`the model predicts about 28,3. Outside the measured range such numbers are only as good as the model.`,
   goal:P => !!P.predpoved && Math.abs(P.x - 7) < 1e-6,
   cfg:{model:"exp", en:true, data:EXP, toggles:["predpoved"]}},
  {warn:R`Round only at the end: with $a = 1{,}45$ instead of $1{,}454$ the prediction at $x = 7$ drops from 28,3 to 27,7.`}
]

  }
};
})();

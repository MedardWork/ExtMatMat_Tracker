/* Residuals, deviations, systematic variation (Danish Matematik A) */
(() => {
const EXP = [[0, 2.1], [1, 2.9], [2, 4.4], [3, 6.2], [4, 9.3], [5, 13.4]];
const G = st => st.h && st.h.reg;

THEORY.c36 = {
  mins:20,
  brief:[
    R`**Residual** = measured value − model value: $e_i = y_i - f(x_i)$. Positive: the point is above the model.`,
    R`Absolute deviation $|y_i - f(x_i)|$; relative deviation $\frac{y_i - f(x_i)}{f(x_i)}$, often in %.`,
    R`A good model leaves residuals that look random: no pattern, small, both signs mixed.`,
    R`A pattern (e.g. +, −, −, −, +) is **systematic variation**: the model type is wrong.`
  ],
  subs:{

"Residuals":[
  R`No model hits every point. The vertical distance from a point to the model, with a sign, is the **residual**. Plotted against $x$ in a **residual plot**, the residuals show at a glance how well and how evenly the model fits.`,
  {def:"Residual", tex:R`e_i = y_i - f(x_i)`},
  {tool:"regresia", ask:R`A linear model with residuals (vertical segments) and the residual plot below. Drag a point and watch its residual.`,
   take:R`a point far from the line gets a long residual and pulls the line towards itself.`,
   cfg:{model:"lin", en:true, on:{rezidua:true, graf2:true}}},
  {tool:"regresia", kind:"uloha", ask:R`One measurement does not fit the line. Drag it so that all residuals are smaller than 0,3 in size.`,
   hint:"The point at x = 3 lies far above; move it down to about 4.",
   goal:(P, st) => !!G(st) && !!G(st).res && G(st).res.every(r => Math.abs(r) < .3),
   cfg:{model:"lin", en:true, data:[[0, 1.1], [1, 2.0], [2, 3.1], [3, 5.2], [4, 4.9], [5, 6.1]], on:{rezidua:true, graf2:true}}},
  {warn:R`Residual = measured − model, in this order. With the opposite order every sign flips and "above the model" becomes negative.`}
],

"Absolute and relative deviation":[
  R`The **absolute deviation** is the size of the residual in the units of $y$. When the values span a large range, a deviation of 1 matters more at $y = 2$ than at $y = 200$; the **relative deviation** divides by the model value and is given in percent.`,
  {def:"Deviations", tex:R`\text{absolute: } |y_i - f(x_i)| \qquad \text{relative: } \frac{y_i - f(x_i)}{f(x_i)} \cdot 100\,\%`},
  {ex:R`The model $f(x) = 2{,}055 \cdot 1{,}454^x$ and the measurement $y = 13{,}4$ at $x = 5$. Find the residual and the relative deviation.`,
   steps:[
     ["Model value.", R`f(5) = 2{,}055 \cdot 1{,}454^5 \approx 13{,}35`],
     ["Residual.", R`13{,}4 - 13{,}35 = 0{,}05`],
     ["Relative.", R`\frac{0{,}05}{13{,}35} \approx 0{,}4\,\%`]
   ],
   res:"Residual 0,05, relative deviation about 0,4 %."},
  {ex:R`A model predicts 250 kg; the measurement is 238 kg. Find the absolute and relative deviation.`,
   steps:[
     ["Absolute.", R`|238 - 250| = 12\ \text{kg}`],
     ["Relative.", R`\frac{238 - 250}{250} = -0{,}048 = -4{,}8\,\%`]
   ],
   res:"12 kg, i.e. −4,8 % (the measurement is below the model)."},
  {tool:"regresia", ask:R`The exponential model on the growth data with its residuals. Are the deviations small compared with the values?`,
   take:R`all residuals are below about 0,12, under 3 % of the values: the model describes the data well.`,
   cfg:{model:"exp", en:true, data:EXP, on:{rezidua:true, graf2:true}}},
  {warn:R`Divide by the model value $f(x_i)$ (or as the task says), and keep the sign if the task asks whether the model over- or underestimates.`}
],

"Systematic variation":[
  R`Measurement errors scatter randomly: residuals of both signs in no particular order. If instead the residuals form a **pattern**, for example positive at both ends and negative in the middle, the model systematically misses the shape of the data: a different model type is needed.`,
  {cards:[
    {t:"Random", d:"Signs mixed, no trend, similar size everywhere: the model type is fine."},
    {t:"Curved pattern", d:"+, −, −, −, +: the data bend more than the model (e.g. a line for exponential data)."},
    {t:"Growing spread", d:"Residuals grow with x: try a model with relative (percentage) behaviour."}
  ]},
  {tool:"regresia", ask:R`Growth data with a **linear** model and the residual plot. Describe the pattern.`,
   take:R`residuals $+1{,}25;\ -0{,}16;\ -0{,}88;\ -1{,}29;\ -0{,}40;\ +1{,}48$: positive at the ends, negative in the middle. Systematic, although $r^2 \approx 0{,}93$.`,
   cfg:{model:"lin", en:true, data:EXP, on:{rezidua:true, graf2:true}}},
  {tool:"regresia", ask:R`The same data with an **exponential** model. Compare the residual plot.`,
   take:R`small residuals with mixed signs and no pattern: only random variation is left.`,
   cfg:{model:"exp", en:true, data:EXP, on:{rezidua:true, graf2:true}}},
  {ex:R`A linear model gives the residuals $1{,}25;\ -0{,}16;\ -0{,}88;\ -1{,}29;\ -0{,}40;\ 1{,}48$. Comment.`,
   steps:[
     ["Signs.", R`+,\ -,\ -,\ -,\ -,\ +`],
     ["Pattern: the data bend upwards relative to the line.", R`\text{systematic variation}`]
   ],
   res:"The linear model is not suitable; an exponential (or other upward-bending) model should be tried."},
  {warn:R`$r^2$ can be high while the residuals still show a pattern. Always look at the residual plot before you accept a model.`}
]

  }
};
})();

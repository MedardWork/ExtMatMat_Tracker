/* CAS: solving, calculus, graphs and regression (Danish Matematik A) */
(() => {

THEORY.c37 = {
  mins:25,
  brief:[
    R`In part 2 of the Danish exam a CAS tool (TI-Nspire, Maple or GeoGebra) is expected. It solves equations, differentiates, integrates, plots and fits models.`,
    R`The command names differ between programs; in GeoGebra: Solve, NSolve, Derivative, Integral, FitLine, FitExp, FitPow, FitSin.`,
    R`Always write down what you asked CAS (the equation, the function) and what it answered, with a sentence. A bare number earns little.`,
    R`Check results by sense: sign, size, units, and a quick sketch.`
  ],
  subs:{

"Solving equations in CAS":[
  R`CAS solves equations exactly (with roots, fractions, logarithms) or numerically (decimals). Exact solving may fail for equations like $e^x = 3 - x$; then use the numerical solver, and if there are several solutions, give an interval or a starting value.`,
  {def:"What to write in the answer", tex:R`\text{equation} \ \to\ \text{CAS: solve} \ \to\ \text{solutions (rounded sensibly)} \ \to\ \text{answer in words}`},
  {steps:[
    {t:"Set up", d:"Write the equation in mathematical notation first (e.g. f(x) = 100)."},
    {t:"Solve", d:"GeoGebra: Solve(equation, x) for exact, NSolve(equation, x) for numerical solutions. TI-Nspire: solve(…, x). Maple: solve(…, x) or fsolve(…)."},
    {t:"Select", d:"Keep only solutions that make sense in the context (positive time, inside the domain)."},
    {t:"Answer", d:"One sentence with units: “The population reaches 100 after about 8,5 years.”"}
  ]},
  {ex:R`Solve $x^2 = 2x + 3$ and $2 \cdot 1{,}05^x = 5$ with CAS, and say what to write.`,
   steps:[
     [R`Command "Solve(x^2 = 2x + 3, x)".`, R`x = -1 \ \vee\ x = 3`],
     [R`Command "Solve(2*1.05^x = 5, x)": exact answer with logarithms.`, R`x = \frac{\ln 2{,}5}{\ln 1{,}05} \approx 18{,}78`]
   ],
   res:"x = −1 or x = 3; x ≈ 18,8. Write the equation, the CAS result and the conclusion."},
  {ex:R`Solve $e^x = 3 - x$.`,
   steps:[
     ["Exact solving gives no closed form (or a special function).", R`\text{use NSolve}`],
     [R`"NSolve(e^x = 3 - x, x)".`, R`x \approx 0{,}792`],
     [R`Check: $e^{0{,}792} \approx 2{,}208$ and $3 - 0{,}792 = 2{,}208$.`, R`\checkmark`]
   ],
   res:"x ≈ 0,792."},
  {warn:R`CAS uses a decimal **point** in input: type 1.05, not 1,05 (a comma separates arguments). In the written answer use the Danish decimal comma.`}
],

"Differentiating and integrating in CAS":[
  R`CAS differentiates and integrates any function you can type. In part 2 that saves time, but the answer must still show what was done: the function, the operation and the result. Define the function once, then refer to it.`,
  {cards:[
    {t:"Define", d:"f(x) := x^3 − 4x (TI, Maple) or f(x) = x^3 − 4x (GeoGebra)."},
    {t:"Derivative", d:"Derivative(f) or f'(x); a value: f'(2)."},
    {t:"Integral", d:"Integral(f) (antiderivative), Integral(f, a, b) (definite)."},
    {t:"Tangent", d:"Tangent(2, f) in GeoGebra; or y = f'(2)(x − 2) + f(2) by hand."}
  ]},
  {ex:R`$f(x) = x^2 e^{-x}$. Find $f'(x)$, the stationary points and $\int_0^3 f(x)\,dx$ with CAS.`,
   steps:[
     ["Derivative.", R`f'(x) = (2x - x^2)\,e^{-x}`],
     [R`"Solve(f'(x) = 0, x)".`, R`x = 0 \ \vee\ x = 2`],
     [R`"Integral(f, 0, 3)".`, R`2 - 17e^{-3} \approx 1{,}154`]
   ],
   res:"Stationary points at x = 0 and x = 2; the integral is about 1,154."},
  {warn:R`CAS gives the antiderivative without "+ C". When the task asks for all antiderivatives or for one through a given point, add the constant yourself.`}
],

"Graphs and regression in CAS":[
  R`A graph is often the quickest check: plot the function, read off zeros, extrema and intersections, then confirm them by a command. For data, enter two lists, choose the regression type and use the fitted function like any other.`,
  {steps:[
    {t:"Plot", d:"Draw the function(s) on a sensible window; for data, a scatter plot first."},
    {t:"Read", d:"Zeros, extrema, intersections: the graphing tools give coordinates."},
    {t:"Fit", d:"GeoGebra: FitLine, FitExp, FitPow, FitPoly(…, 2), FitSin on a list of points; TI: LinReg, ExpReg, PwrReg; Maple: Fit(…)."},
    {t:"Report", d:"Model with parameters (3–4 significant digits), r², and a plot of model and data together."}
  ]},
  {ex:R`Data: $(0;\ 2{,}1)$, $(1;\ 2{,}9)$, $(2;\ 4{,}4)$, $(3;\ 6{,}2)$, $(4;\ 9{,}3)$, $(5;\ 13{,}4)$. Fit an exponential model with CAS and find when it reaches 20.`,
   steps:[
     [R`"FitExp(list)" (GeoGebra may give the form $b e^{kx}$).`, R`y \approx 2{,}055 \cdot 1{,}454^x = 2{,}055\,e^{0{,}374x}`],
     ["Solve.", R`2{,}055 \cdot 1{,}454^x = 20 \Rightarrow x \approx 6{,}1`]
   ],
   res:R`$y \approx 2{,}055 \cdot 1{,}454^x$; it reaches 20 at about $x = 6{,}1$.`},
  {tip:R`The regression tool of this app works the same way and shows $r^2$ and the residuals: see [[c35]] and [[c36]].`, label:"Practice"},
  {warn:R`Different programs present the same exponential fit as $b \cdot a^x$ or $b \cdot e^{kx}$; convert with $a = e^k$. Do not mix parameters from the two forms.`}
]

  }
};
})();

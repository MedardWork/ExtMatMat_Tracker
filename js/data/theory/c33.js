/* Trigonometric models (Danish Matematik A) */
(() => {
const SIN = [[0, 4.1], [2, 6.4], [4, 7.1], [6, 5.8], [8, 3.4], [10, 1.2], [12, .9], [14, 2.7], [16, 5.1], [18, 6.8]];

THEORY.c33 = {
  mins:20,
  brief:[
    R`Periodic model $f(x) = A\sin(\omega x + \varphi) + d$.`,
    R`Amplitude $|A|$ = half the distance from minimum to maximum; equilibrium line $y = d$ = their average.`,
    R`Period $T = \frac{2\pi}{\omega}$, so $\omega = \frac{2\pi}{T}$; $\varphi$ shifts the graph sideways (by $-\frac{\varphi}{\omega}$).`,
    R`From data: $A = \frac{\max - \min}{2}$, $d = \frac{\max + \min}{2}$, $\omega$ from the period; CAS fits all four (sinusoidal regression).`
  ],
  subs:{

"Amplitude, period and shift":[
  R`Tides, temperatures over the year, hours of daylight: they repeat with a fixed **period** and swing evenly around a middle value. The model $A\sin(\omega x + \varphi) + d$ has one parameter for each property: height of the swing, speed, shift and middle line. Angles are in **radians**.`,
  {def:"Trigonometric model", tex:R`f(x) = \va{A}\sin(\vb{\omega} x + \vc{\varphi}) + \vd{d} \qquad T = \frac{2\pi}{\vb{\omega}} \qquad \max = \vd{d} + |\va{A}|,\ \min = \vd{d} - |\va{A}|`},
  {tool:"graf", ask:R`Change $A$, $w$ ($\omega$), $f$ ($\varphi$) and $d$ one at a time.`,
   take:R`$A$ stretches vertically, $\omega$ squeezes horizontally (shorter period), $\varphi$ shifts sideways, $d$ moves the middle line.`,
   cfg:{fns:["A*sin(w*x + f) + d", {f:"d", color:"c", dash:true, thin:true, ghost:true}], params:{A:{v:2, min:-3, max:3, step:.5, color:"a"}, w:{v:1, min:.5, max:3, step:.25, color:"b"}, f:{v:0, min:-3, max:3, step:.25, color:"c"}, d:{v:1, min:-2, max:4, step:.5, color:"d"}},
     view:[-7, 7, 7, -4]}},
  {ex:R`Find the amplitude, period, equilibrium line and range of $f(x) = 3\sin(2x - \pi) + 1$.`,
   steps:[
     ["Amplitude and middle line.", R`|A| = 3,\quad y = 1`],
     ["Period.", R`T = \frac{2\pi}{2} = \pi`],
     ["Range.", R`[1 - 3;\ 1 + 3] = [-2;\ 4]`]
   ],
   res:R`Amplitude 3, period $\pi$, middle line $y = 1$, values from $-2$ to $4$.`},
  {tool:"graf", kind:"uloha", ask:R`Set the parameters so that the graph has maximum 5, minimum 1 and period $2\pi$ (no shift).`,
   hint:"A = (5 − 1)/2 = 2, d = (5 + 1)/2 = 3, ω = 1.",
   goal:P => Math.abs(Math.abs(P.A) - 2) < 1e-6 && Math.abs(P.d - 3) < 1e-6 && Math.abs(P.w - 1) < 1e-6,
   cfg:{fns:["A*sin(w*x + f) + d"], params:{A:{v:1, min:-3, max:3, step:.5, color:"a"}, w:{v:2, min:.5, max:3, step:.25, color:"b"}, f:{v:0, min:-3, max:3, step:.25, color:"c", lock:true}, d:{v:0, min:-2, max:4, step:.5, color:"d"}},
     view:[-7, 7, 7, -4]}},
  {warn:R`The period is $\frac{2\pi}{\omega}$, not $\omega$, and with a period of 12 months $\omega = \frac{2\pi}{12} \approx 0{,}524$. Use radians in CAS.`}
],

"Fitting a trigonometric model to data":[
  R`For data that go up and down periodically, first estimate the parameters by hand from the highest and lowest values and the time between two maxima. Then let CAS do a **sinusoidal regression**, which finds all four parameters at once.`,
  {steps:[
    {t:"Middle and amplitude", d:"d = (max + min)/2, A = (max − min)/2."},
    {t:"Period", d:"Time between two maxima (or twice the time from a maximum to the next minimum); ω = 2π / T."},
    {t:"Shift", d:"Choose φ so that the maximum lands at the right place, or let CAS find it."}
  ]},
  {tool:"regresia", ask:R`Measured data with the fitted model $y = A\sin(\omega x + \varphi) + d$. Drag a point and watch the parameters.`,
   take:R`the fit gives about $A \approx 3{,}14$, $\omega \approx 0{,}413$ (period $\approx 15{,}2$), $d \approx 3{,}97$, with $r^2 \approx 0{,}999$.`,
   cfg:{model:"sin", en:true, data:SIN}},
  {ex:R`From the data: the largest value is about 7,1, the smallest about 0,9, and the maxima are about 15 apart. Estimate the model.`,
   steps:[
     ["Middle line and amplitude.", R`d \approx \frac{7{,}1 + 0{,}9}{2} = 4,\quad A \approx \frac{7{,}1 - 0{,}9}{2} = 3{,}1`],
     ["Angular frequency.", R`\omega \approx \frac{2\pi}{15} \approx 0{,}42`]
   ],
   res:"d ≈ 4, A ≈ 3,1, ω ≈ 0,42: close to the regression (3,97; 3,14; 0,413)."},
  {ex:R`In a Danish town the day is 17,5 hours long at the longest and 7 hours at the shortest. Set up a model for the day length over a year (365 days).`,
   steps:[
     ["Middle and amplitude.", R`d = \frac{17{,}5 + 7}{2} = 12{,}25,\quad A = \frac{17{,}5 - 7}{2} = 5{,}25`],
     ["Angular frequency.", R`\omega = \frac{2\pi}{365} \approx 0{,}0172`]
   ],
   res:R`$L(t) = 5{,}25\sin(0{,}0172\,t + \varphi) + 12{,}25$; $\varphi$ places the longest day at about day 172 (21 June).`},
  {warn:R`A sinusoidal regression needs a reasonable starting guess in some CAS programs; if the result looks wild (period far too short), give your estimates from the data as a start.`}
]

  }
};
})();

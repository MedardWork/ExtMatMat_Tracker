/* Modelling with differential equations (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c18 = {
  mins:20,
  brief:[
    R`"Rate of change" or "grows by … per …" is $y'$. "Proportional to" means "a constant times".`,
    R`Proportional to the amount: $y' = ky$. Constant inflow minus a share out: $y' = b - ay$. Proportional to the amount and to what is left: $y' = ay(M - y)$.`,
    R`Interpret: equilibria (long-run level), the sign of $y'$ (growing or not), the value of $y'$ at a point (speed, with units).`,
    R`Check that the units on both sides agree, e.g. mg per hour.`
  ],
  subs:{

"Translating words into an equation":[
  R`A modelling task describes how something **changes** in words. Each phrase has a mathematical counterpart. Name the quantity (e.g. $N(t)$, the number of fish after $t$ years), then translate the sentence about its rate of change.`,
  {cards:[
    {t:"“grows by 3 % of its size per year”", tex:R`N' = 0{,}03N`},
    {t:"“decreases at a rate proportional to the amount”", tex:R`y' = -ky,\ k > 0`},
    {t:"“50 mg per hour in, 20 % per hour out”", tex:R`y' = 50 - 0{,}2y`},
    {t:"“proportional to the number who know and to those who don’t”", tex:R`y' = ky(M - y)`}
  ]},
  {ex:R`A patient receives a drug at 50 mg per hour, and the body removes 20 % of the amount in the blood per hour. Write the differential equation and find the long-run amount.`,
   steps:[
     [R`$y(t)$ = mg of the drug after $t$ hours.`, R`y' = 50 - 0{,}2y`],
     ["Equilibrium.", R`50 - 0{,}2y = 0 \Rightarrow y = 250`]
   ],
   res:"y′ = 50 − 0,2y; in the long run about 250 mg in the blood."},
  {tool:"smerpole", kind:"uloha", ask:R`The drug model $y' = b - 0{,}2y$ ($b$ = mg per hour). Set the dose rate $b$ so that the amount settles at 250 mg.`,
   hint:"The level is b / 0,2.",
   goal:P => P.b === 50,
   cfg:{f:"b - a*y", en:true, params:{b:{v:30, min:10, max:80, step:10, color:"b", note:"mg per hour"}, a:L(.2)}, start:[0, 0], fixed:true, view:[-2, 420, 30, -30], apart:true, tick:[5, 50], aspect:"4/3"}},
  {ex:R`In a town of 10 000 people a rumour spreads at a rate proportional both to the number $y$ who know it and to the number who do not. Write the equation.`,
   steps:[
     ["Those who do not know it.", R`10\,000 - y`],
     ["Proportional to both: one constant times the product.", R`y' = k\,y\,(10\,000 - y)`]
   ],
   res:R`$y' = ky(10\,000 - y)$, a logistic equation with $M = 10\,000$.`},
  {warn:R`"Proportional to $y$ and to $M - y$" is the product $ky(M - y)$, not the sum. And a percentage per time unit becomes a decimal: 20 % → 0,2.`}
],

"Interpreting the model":[
  R`Once the equation is there, the questions are about meaning: Where does the quantity end up? Is it growing at a given moment, and how fast? What does each constant stand for? Many of these can be answered from the equation without solving it.`,
  {steps:[
    {t:"Equilibrium", d:"Set y′ = 0: the long-run level (carrying capacity, final temperature, steady drug level)."},
    {t:"Sign of y′", d:"Positive: the quantity grows at that moment; negative: it decreases."},
    {t:"Value of y′", d:"The speed of change, in units of y per time unit."},
    {t:"Constants", d:"Say what each one means in the situation (inflow rate, growth rate, capacity)."}
  ]},
  {tool:"smerpole", ask:R`A fish population $y' = a\,y\,(M - y)$ in thousands. Change the capacity $M$ and the rate $a$.`,
   take:R`$M$ sets where the population ends up, $a$ how fast it gets there. The steepest growth is at half the capacity.`,
   cfg:{f:"a*y*(M - y)", en:true, params:{a:{v:.3, min:.1, max:.6, step:.05, color:"b"}, M:{v:4, min:2, max:5, step:.5, color:"d", note:"capacity"}}, start:[0, .5], view:[-1, 6, 9, -1]}},
  {ex:R`A population follows $y' = 0{,}0005\,y\,(2000 - y)$ ($t$ in years). How fast does it grow when it has 500 individuals, and what is its long-run size?`,
   steps:[
     ["Substitute y = 500.", R`y' = 0{,}0005 \cdot 500 \cdot 1500 = 375`],
     ["Equilibria.", R`y = 0 \text{ or } y = 2000`]
   ],
   res:"It grows by 375 individuals per year at that moment; in the long run it approaches 2 000."},
  {tool:"graf", ask:R`The drug model solved with $y(0) = 0$: $y = 250 - 250e^{-0{,}2t}$. When is half of the long-run level reached?`,
   take:R`$e^{-0{,}2t} = \frac{1}{2}$ gives $t = 5\ln 2 \approx 3{,}5$ hours, the same "half-life" as for the elimination alone.`,
   cfg:{fns:["250 - 250*exp(-0.2*x)", {f:"250", color:"c", dash:true, thin:true}], view:[-2, 300, 30, -30], tick:[5, 50], free:true, aspect:"4/3"}},
  {warn:R`Answer in words and with units. "$y' = 375$" alone is not an interpretation; "the population grows by 375 individuals per year at that moment" is.`}
]

  }
};
})();

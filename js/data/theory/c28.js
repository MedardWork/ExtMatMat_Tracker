/* Normal distribution (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c28 = {
  mins:25,
  brief:[
    R`$X \sim N(\mu, \sigma)$: a bell-shaped density, symmetric about the mean $\mu$; $\sigma$ sets its width. The total area under it is 1.`,
    R`Probability = area under the curve: $P(a \leq X \leq b)$ is the area between $a$ and $b$. A single value has probability 0.`,
    R`About 68 %, 95 % and 99,7 % lie within $1\sigma$, $2\sigma$, $3\sigma$ of $\mu$.`,
    R`With CAS: normcdf for probabilities, the inverse (invNorm) for percentiles.`
  ],
  subs:{

"Normal curve, μ and σ":[
  R`Heights, measurement errors, IQ scores: many quantities pile up symmetrically around an average and thin out on both sides. The **normal distribution** models them. Its curve has its top at $\mu$ and turning points at $\mu \pm \sigma$; a larger $\sigma$ means a wider and lower bell.`,
  {def:"Normal distribution", tex:R`X \sim N(\vd{\mu}, \vb{\sigma}) \qquad P(\va{a} \leq X \leq \va{b}) = \text{area under the curve from } \va{a} \text{ to } \va{b}`},
  {tool:"rozdelenie", ask:R`IQ scores: $\mu = 100$, $\sigma = 15$. Change $\mu$ and $\sigma$ and watch the bell.`,
   take:R`$\mu$ moves the bell, $\sigma$ makes it wider and flatter. The area under the whole curve stays 1.`,
   cfg:{typ:"normal", en:true}},
  {ex:R`Heights of adult men are $N(175, 7)$ in cm. Which heights are "typical", and is a height of 196 cm unusual?`,
   steps:[
     [R`Within one $\sigma$.`, R`175 \pm 7:\ 168 \text{ to } 182`],
     [R`196 is $3\sigma$ above the mean.`, R`\frac{196 - 175}{7} = 3`]
   ],
   res:"Typical: 168–182 cm. 196 cm is three standard deviations above: very unusual."},
  {warn:R`For a continuous variable $P(X = 120) = 0$, so $P(X < 120) = P(X \leq 120)$. Only intervals have positive probability.`}
],

"68–95–99.7 rule":[
  R`For every normal distribution the same share of the area lies within a given number of standard deviations from the mean. That gives quick estimates without a calculator.`,
  {def:"The 68–95–99.7 rule", tex:R`P(\mu - \sigma \leq X \leq \mu + \sigma) \approx 68\,\% \qquad P(\mu - 2\sigma \leq X \leq \mu + 2\sigma) \approx 95\,\% \qquad P(\mu - 3\sigma \leq X \leq \mu + 3\sigma) \approx 99{,}7\,\%`},
  {tool:"rozdelenie", ask:R`Switch on the bands $1\sigma$, $2\sigma$, $3\sigma$ and set $a$, $b$ to their edges.`,
   take:R`whatever $\mu$ and $\sigma$ are, the bands always hold about 68 %, 95 % and 99,7 % of the area.`,
   cfg:{typ:"normal", en:true, on:{pravidlo:true}}},
  {ex:R`IQ is $N(100, 15)$. Estimate $P(85 < X < 115)$ and $P(X > 130)$.`,
   steps:[
     [R`$85$ to $115$ is $\mu \pm \sigma$.`, R`\approx 68\,\%`],
     [R`$130 = \mu + 2\sigma$; outside $\pm 2\sigma$ is 5 %, half of it above.`, R`P(X > 130) \approx 2{,}5\,\%`]
   ],
   res:"About 68 % and 2,5 %."},
  {tool:"rozdelenie", kind:"uloha", ask:R`IQ: $N(100, 15)$. Set $a$ and $b$ so that the coloured area is about 95 %, symmetric about the mean.`,
   hint:"μ ± 2σ.",
   goal:P => Math.abs(P.a - 70) < 1e-6 && Math.abs(P.b - 130) < 1e-6,
   cfg:{typ:"normal", en:true, mu:L(100), sigma:L(15), a:{v:85}, b:{v:115}}},
  {warn:R`The rule is approximate. For exact values (e.g. $P(X > 130) = 0{,}0228$) use CAS. And 95 % is for $\pm 2\sigma$, not $\pm 1{,}5\sigma$.`}
],

"Normal probabilities with CAS":[
  R`For limits that are not whole multiples of $\sigma$, CAS computes the area: normcdf$(a, b, \mu, \sigma)$ (the name differs between programs). Conversely, "the value below which 90 % lie" is a **percentile**, found with the inverse function.`,
  {steps:[
    {t:"Draw", d:"Sketch the bell and shade the wanted area: left tail, right tail or middle."},
    {t:"Compute", d:"P(X ≤ b), P(X ≥ a) = 1 − P(X ≤ a), or P(a ≤ X ≤ b) with CAS."},
    {t:"Percentile", d:"For 'x such that P(X ≤ x) = q' use the inverse normal function."}
  ]},
  {tool:"rozdelenie", ask:R`Set $a$ and $b$ to any limits and read the exact area the tool computes.`,
   take:R`e.g. $P(95 \leq X \leq 120) \approx 0{,}539$ for $N(100, 15)$; the rule of thumb could not give that.`,
   cfg:{typ:"normal", en:true, a:{v:95}, b:{v:120}}},
  {ex:R`IQ is $N(100, 15)$. Find $P(X \leq 120)$ and $P(95 \leq X \leq 120)$.`,
   steps:[
     ["CAS.", R`P(X \leq 120) \approx 0{,}909`],
     ["Difference of two left tails.", R`P(95 \leq X \leq 120) = P(X \leq 120) - P(X \leq 95) \approx 0{,}539`]
   ],
   res:"0,909 and 0,539."},
  {ex:R`Men's heights are $N(175, 7)$. What share is taller than 185 cm, and which height do 90 % stay below?`,
   steps:[
     ["Right tail.", R`P(X > 185) = 1 - P(X \leq 185) \approx 0{,}077`],
     ["90th percentile (inverse normal).", R`x \approx 175 + 1{,}28 \cdot 7 \approx 184{,}0`]
   ],
   res:"About 7,7 % are taller than 185 cm; 90 % are below 184 cm."},
  {warn:R`Check the order of arguments in your CAS (some want $\sigma$, some $\sigma^2$) and whether it gives the left tail. A sketch tells you whether the answer should be above or below 0,5.`}
]

  }
};
})();

/* Binomial distribution (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const Rz = st => st.h && st.h.roz;

THEORY.c27 = {
  mins:20,
  brief:[
    R`$X \sim b(n, p)$: the number of successes in $n$ independent trials, each with success probability $p$.`,
    R`$P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}$; with CAS: binompdf / binomcdf.`,
    R`$P(X \geq k) = 1 - P(X \leq k - 1)$.`,
    R`$E(X) = np$, $\sigma = \sqrt{np(1 - p)}$.`
  ],
  subs:{

"Binomial probabilities":[
  R`Repeat the same experiment $n$ times independently and count the successes. The count $X$ is **binomially distributed**. Each sequence with $k$ successes has probability $p^k(1 - p)^{n-k}$, and there are $\binom{n}{k}$ such sequences.`,
  {def:"Binomial distribution", tex:R`P(X = k) = \binom{\vd{n}}{k} \vb{p}^k (1 - \vb{p})^{\vd{n} - k} \qquad P(a \leq X \leq b) = \sum_{k=a}^{b} P(X = k)`},
  {tool:"rozdelenie", ask:R`$X \sim b(20;\ 0{,}3)$. Set $a$ and $b$ to colour the bars you want to add up.`,
   take:R`a probability like $P(X \leq 4)$ is the sum of the bars from 0 to 4; CAS adds them with binomcdf.`,
   cfg:{typ:"binom", en:true, n:{v:20}, p:{v:.3}, a:{v:0}, b:{v:4}}},
  {ex:R`$X \sim b(20;\ 0{,}3)$. Find $P(X = 6)$, $P(X \leq 4)$ and $P(X \geq 10)$.`,
   steps:[
     ["Formula.", R`P(X = 6) = \binom{20}{6} 0{,}3^6 \cdot 0{,}7^{14} \approx 0{,}192`],
     ["Cumulative (CAS).", R`P(X \leq 4) \approx 0{,}238`],
     ["Complement.", R`P(X \geq 10) = 1 - P(X \leq 9) \approx 0{,}048`]
   ],
   res:"0,192; 0,238; 0,048."},
  {tool:"rozdelenie", kind:"uloha", ask:R`$X \sim b(20;\ 0{,}3)$. Set $a$ and $b$ so that the coloured probability is $P(X \geq 10)$.`,
   hint:"At least 10: from 10 to 20.",
   goal:P => P.a === 10 && P.b === 20,
   cfg:{typ:"binom", en:true, n:L(20), p:L(.3), a:{v:0, min:0, max:20}, b:{v:4, min:0, max:20}}},
  {ex:R`Of all screws, 4 % are defective. In a box of 50, find the probability of no defective screw and of at least 3.`,
   steps:[
     [R`$X \sim b(50;\ 0{,}04)$.`, R`P(X = 0) = 0{,}96^{50} \approx 0{,}130`],
     ["At least 3.", R`P(X \geq 3) = 1 - P(X \leq 2) \approx 0{,}323`]
   ],
   res:"0,130 and 0,323."},
  {warn:R`$P(X \geq 10)$ is $1 - P(X \leq 9)$, not $1 - P(X \leq 10)$: the value 10 itself belongs to the event.`}
],

"Mean and spread of a binomial":[
  R`On average, $n$ trials with success probability $p$ give $np$ successes. The spread grows with $n$ but more slowly, like $\sqrt{n}$, and is largest for $p = 0{,}5$. For large $n$ the bars look like a bell: the normal curve with the same $\mu$ and $\sigma$ ([[c28]]).`,
  {def:"Mean and standard deviation", tex:R`E(X) = \vd{n}\vb{p} \qquad \sigma = \sqrt{\vd{n}\vb{p}(1 - \vb{p})}`},
  {tool:"rozdelenie", ask:R`Switch on the normal curve and increase $n$. Where is the peak, and how wide is the bell?`,
   take:R`the peak is at $np$, the width is about $\sigma$ on each side; for large $n$ the curve fits the bars very well.`,
   cfg:{typ:"binom", en:true, n:{v:20}, p:{v:.3}, a:{v:4}, b:{v:8}, on:{normal:true}}},
  {ex:R`$X \sim b(20;\ 0{,}3)$ and $Y \sim b(50;\ 0{,}04)$. Find the expected values and standard deviations.`,
   steps:[
     ["X.", R`E(X) = 6,\quad \sigma = \sqrt{20 \cdot 0{,}3 \cdot 0{,}7} = \sqrt{4{,}2} \approx 2{,}05`],
     ["Y.", R`E(Y) = 2,\quad \sigma = \sqrt{50 \cdot 0{,}04 \cdot 0{,}96} \approx 1{,}39`]
   ],
   res:"E(X) = 6, σ ≈ 2,05; E(Y) = 2, σ ≈ 1,39."},
  {tool:"rozdelenie", kind:"uloha", ask:R`$n = 20$. Set $p$ so that the expected number of successes is 8.`,
   hint:"20 · p = 8.",
   goal:(P, st) => Math.abs(P.p - .4) < 1e-6,
   cfg:{typ:"binom", en:true, n:L(20), p:{v:.2}, a:{v:8}, b:{v:8}}},
  {warn:R`The standard deviation is $\sqrt{np(1 - p)}$, not $np(1 - p)$ (that is the variance) and not $\sqrt{np}$.`}
]

  }
};
})();

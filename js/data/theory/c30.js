/* Binomial hypothesis test (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const Rz = st => st.h && st.h.roz;

THEORY.c30 = {
  mins:25,
  brief:[
    R`Null hypothesis $H_0$: a claimed value of $p$ (the coin is fair: $p = 0{,}5$). The test asks whether the data contradict it.`,
    R`Significance level $\alpha$ (often 5 %): the risk we accept of rejecting a true $H_0$.`,
    R`$p$-value: the probability, if $H_0$ is true, of a result at least as extreme as the observed one.`,
    R`$p$-value $\leq \alpha$: reject $H_0$. Otherwise we cannot reject it (which does not prove it true).`
  ],
  subs:{

"Null hypothesis and significance level":[
  R`A coin gives 15 heads in 20 tosses. Is it unfair, or was it chance? A **hypothesis test** starts from the **null hypothesis** $H_0$ (the coin is fair, $p = 0{,}5$) and asks how surprising the data would be if $H_0$ were true. The **alternative hypothesis** says in which direction we look: $p \neq 0{,}5$ (two-sided), $p > 0{,}5$ or $p < 0{,}5$ (one-sided).`,
  {def:"Test of p", tex:R`H_0:\ p = p_0 \qquad X \sim b(n, p_0) \text{ if } H_0 \text{ is true} \qquad \text{critical region: the most extreme values, total probability} \leq \alpha`,
   note:"Two-sided: α/2 in each tail. One-sided: all of α in the tail of the alternative."},
  {steps:[
    {t:"Hypotheses", d:"State H₀: p = p₀ and the alternative (≠, > or <)."},
    {t:"Model", d:"If H₀ holds, X ~ b(n, p₀). Choose α."},
    {t:"Critical region", d:"The values of X so extreme that, together, they have probability at most α under H₀."},
    {t:"Decide", d:"If the observed x is in the critical region, reject H₀."}
  ]},
  {tool:"rozdelenie", ask:R`$n = 20$, $H_0: p = 0{,}5$, two-sided, $\alpha = 5\,\%$. The red bars are the critical region. Change $\alpha$ and $n$.`,
   take:R`with $\alpha = 5\,\%$ the critical region is $X \leq 5$ or $X \geq 15$. A smaller $\alpha$ makes the region smaller: stronger evidence is needed.`,
   cfg:{typ:"test", en:true}},
  {ex:R`A firm claims that 30 % of its customers buy again. A competitor thinks it is more. Out of 40 customers, 18 buy again. Set up the test at the 5 % level and find the critical region.`,
   steps:[
     ["Hypotheses (one-sided, right).", R`H_0:\ p = 0{,}3 \qquad H_1:\ p > 0{,}3`],
     ["Model under H₀.", R`X \sim b(40;\ 0{,}3)`],
     ["Right tail (CAS).", R`P(X \geq 17) \approx 0{,}063 > 0{,}05,\quad P(X \geq 18) \approx 0{,}032 \leq 0{,}05`],
     ["Critical region and decision.", R`X \geq 18;\quad x = 18 \text{ lies in it}`]
   ],
   res:R`Reject $H_0$ at the 5 % level: the data support more than 30 %.`},
  {tool:"rozdelenie", kind:"uloha", ask:R`The customer test: $n = 40$, $p_0 = 0{,}3$, right-sided, $\alpha = 5\,\%$. Set the observed count $x$ to the smallest value that leads to rejection.`,
   hint:"The smallest value of the critical region: P(X ≥ x) ≤ 0,05.",
   goal:P => P.x === 18,
   cfg:{typ:"test", en:true, n:L(40), p:L(.3), alfa:L(.05), x:{v:12}, strana:"prava"}},
  {warn:R`The hypotheses are about the population ($p$), not about the sample. "$H_0$: 18 out of 40 buy again" is not a hypothesis; "$H_0$: $p = 0{,}3$" is.`}
],

"p-value and conclusion":[
  R`Instead of the critical region, one can compute the **$p$-value**: the probability under $H_0$ of getting the observed result or something even more extreme (in the direction of the alternative; in both directions for a two-sided test). A small $p$-value means the data are unlikely under $H_0$.`,
  {def:"Decision with the p-value", tex:R`p\text{-value} \leq \alpha:\ \text{reject } H_0 \qquad p\text{-value} > \alpha:\ \text{do not reject } H_0`},
  {ex:R`20 tosses give 15 heads. Test $H_0: p = 0{,}5$ against $p \neq 0{,}5$ at the 5 % level.`,
   steps:[
     ["Right tail under H₀.", R`P(X \geq 15) \approx 0{,}0207`],
     ["Two-sided: double it.", R`p\text{-value} \approx 0{,}041`],
     ["Compare.", R`0{,}041 \leq 0{,}05`]
   ],
   res:"Reject H₀ at the 5 % level: the coin is probably not fair. (At the 1 % level we would not reject it.)"},
  {tool:"rozdelenie", ask:R`The coin: $n = 20$, $x = 15$, two-sided. Change $x$ and watch the $p$-value and the decision.`,
   take:R`$x = 15$ gives $p \approx 0{,}041$ (reject); $x = 14$ gives about $0{,}115$ (do not reject). The border is the edge of the critical region.`,
   cfg:{typ:"test", en:true, n:L(20), p:L(.5)}},
  {ex:R`In the customer test ($n = 40$, $p_0 = 0{,}3$, right-sided) we observed 18. Find the $p$-value and conclude at the 5 % and at the 1 % level.`,
   steps:[
     ["p-value.", R`P(X \geq 18) \approx 0{,}032`],
     ["5 % level.", R`0{,}032 \leq 0{,}05:\ \text{reject}`],
     ["1 % level.", R`0{,}032 > 0{,}01:\ \text{do not reject}`]
   ],
   res:"Significant at 5 %, not at 1 %. Always say at which level."},
  {warn:R`"Not rejected" does not mean "proved true": maybe the sample was too small to show a difference. Write the conclusion in words about the situation, e.g. "the data do not show that the coin is unfair".`}
]

  }
};
})();

/* Random variables, expected value, standard deviation (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c26 = {
  mins:20,
  brief:[
    R`A **random variable** $X$ gives a number to every outcome of an experiment. Its **distribution** lists the values $x_i$ with probabilities $p_i$; they add up to 1.`,
    R`Expected value $E(X) = \mu = \sum x_i\,p_i$: the long-run average.`,
    R`Variance $\operatorname{Var}(X) = \sum (x_i - \mu)^2 p_i$, standard deviation $\sigma = \sqrt{\operatorname{Var}(X)}$: the typical distance from $\mu$.`,
    R`A fair game has $E(X) = 0$ for the player's net gain.`
  ],
  subs:{

"Random variable and its distribution":[
  R`Toss three coins and count the heads: the result is a number 0, 1, 2 or 3. Such a rule "outcome → number" is a **random variable**. Its **probability distribution** is the table of its values with their probabilities, often drawn as bars.`,
  {def:"Probability distribution", tex:R`P(X = x_i) = p_i \qquad p_1 + p_2 + \dots + p_k = 1 \qquad 0 \leq p_i \leq 1`},
  {tool:"rozdelenie", ask:R`$X$ = number of heads in three coin tosses. Check that the probabilities add up to 1.`,
   take:R`$\frac{1}{8} + \frac{3}{8} + \frac{3}{8} + \frac{1}{8} = 1$; one and two heads are three times as likely as none or three.`,
   cfg:{typ:"tabulka", en:true, x:[0, 1, 2, 3], p:[.125, .375, .375, .125]}},
  {ex:R`A random variable takes the values 0, 1, 2, 3 with probabilities 0,2; 0,35; $p$; 0,1. Find $p$ and $P(X \geq 2)$.`,
   steps:[
     ["The sum is 1.", R`0{,}2 + 0{,}35 + p + 0{,}1 = 1 \Rightarrow p = 0{,}35`],
     [R`$X = 2$ or $X = 3$.`, R`P(X \geq 2) = 0{,}35 + 0{,}1 = 0{,}45`]
   ],
   res:R`$p = 0{,}35$, $P(X \geq 2) = 0{,}45$.`},
  {tool:"rozdelenie", kind:"uloha", ask:R`Three coin tosses, $X$ = number of heads. Set $a$ and $b$ so that the coloured bars show the event "at least two heads".`,
   hint:"At least two: X = 2 or X = 3.",
   take:R`$P(X \geq 2) = \frac{3}{8} + \frac{1}{8} = \frac{1}{2}$.`,
   goal:P => P.a === 2 && P.b === 3,
   cfg:{typ:"binom", en:true, n:L(3), p:L(.5), a:{v:0, min:0, max:3}, b:{v:0, min:0, max:3}}},
  {warn:R`A table is a probability distribution only if all $p_i \geq 0$ and they add up to exactly 1. Check this first; many tasks hide an unknown probability there.`}
],

"Expected value":[
  R`If the experiment is repeated many times, the average of the values of $X$ settles at the **expected value**: each value weighted by its probability. It need not be a possible value itself (1,5 heads).`,
  {def:"Expected value", tex:R`E(X) = \mu = x_1 p_1 + x_2 p_2 + \dots + x_k p_k`},
  {ex:R`Find the expected number of heads in three coin tosses.`,
   steps:[
     ["Sum of value × probability.", R`0 \cdot \tfrac{1}{8} + 1 \cdot \tfrac{3}{8} + 2 \cdot \tfrac{3}{8} + 3 \cdot \tfrac{1}{8} = \tfrac{12}{8}`]
   ],
   res:R`$E(X) = 1{,}5$.`},
  {ex:R`A game costs 10 kr. You roll a die and receive 50 kr for a six. Find the expected net gain. Is the game fair?`,
   steps:[
     ["Net gain X: +40 with a six, −10 otherwise.", R`P(X = 40) = \tfrac{1}{6},\quad P(X = -10) = \tfrac{5}{6}`],
     ["Expected value.", R`E(X) = 40 \cdot \tfrac{1}{6} - 10 \cdot \tfrac{5}{6} = \tfrac{40 - 50}{6} \approx -1{,}67`]
   ],
   res:"About −1,67 kr per game: the game is not fair (it favours the organiser)."},
  {tool:"rozdelenie", ask:R`The game as a table: values $40$ and $-10$. Read the expected value.`,
   take:R`$E(X) \approx -1{,}67$: on average the player loses 1,67 kr per game.`,
   cfg:{typ:"tabulka", en:true, x:[-10, 40], p:[5 / 6, 1 / 6]}},
  {warn:R`In games, decide first whether $X$ is the payout or the net gain (payout minus stake). The answers differ by the stake.`}
],

"Standard deviation":[
  R`Two random variables can have the same expected value and still behave very differently: one stays close to $\mu$, the other jumps far away. The **variance** averages the squared distances from $\mu$, and its square root, the **standard deviation**, is back in the units of $X$.`,
  {def:"Variance and standard deviation", tex:R`\operatorname{Var}(X) = \sum (x_i - \mu)^2\,p_i \qquad \sigma = \sqrt{\operatorname{Var}(X)}`},
  {ex:R`Find the standard deviation of the number of heads in three tosses ($\mu = 1{,}5$).`,
   steps:[
     ["Squared distances.", R`(0 - 1{,}5)^2 = 2{,}25,\ (1 - 1{,}5)^2 = 0{,}25,\ 0{,}25,\ 2{,}25`],
     ["Weighted sum.", R`2{,}25 \cdot \tfrac{1}{8} + 0{,}25 \cdot \tfrac{3}{8} + 0{,}25 \cdot \tfrac{3}{8} + 2{,}25 \cdot \tfrac{1}{8} = 0{,}75`],
     ["Square root.", R`\sigma = \sqrt{0{,}75} \approx 0{,}866`]
   ],
   res:R`$\sigma \approx 0{,}87$.`},
  {tool:"rozdelenie", ask:R`Game A: win 1 or lose 1 with probability $\frac{1}{2}$ each.`,
   take:R`$E = 0$, $\sigma = 1$: small, safe swings.`,
   cfg:{typ:"tabulka", en:true, x:[-1, 1], p:[.5, .5]}},
  {tool:"rozdelenie", ask:R`Game B: win 10 or lose 10 with probability $\frac{1}{2}$ each. Compare with game A.`,
   take:R`also $E = 0$, but $\sigma = 10$: the same average, ten times more risk.`,
   cfg:{typ:"tabulka", en:true, x:[-10, 10], p:[.5, .5]}},
  {warn:R`Weight the squared distances with the probabilities and do **not** divide by the number of values; the probabilities already do the averaging.`}
]

  }
};
})();

/* Notation and task wording in the Danish exam (Danish Matematik A) */
(() => {

THEORY.c40 = {
  mins:15,
  brief:[
    R`Danish uses a decimal **comma** (2,5) in writing; CAS input usually needs a point (2.5).`,
    R`Open intervals are written with outward brackets: $]2;\ 5[$ in Danish for $(2, 5)$; closed $[2;\ 5]$.`,
    R`The task word tells what is required: „bestem“ = determine (any method, documented), „aflæs“ = read off a graph or table, „vis“ = show with a complete argument.`,
    R`End each answer with a sentence that answers the question, with units and sensible rounding.`
  ],
  subs:{

"Decimal comma and notation":[
  R`Most notation is the same as in Slovakia (which also uses the decimal comma and the outward brackets for open intervals). A few points are worth checking, because a CAS program, a textbook and the formula booklet may each write things slightly differently.`,
  {cards:[
    {t:"Decimal comma", d:"Write 3,14 in the answer; type 3.14 in CAS. A comma in CAS input separates arguments."},
    {t:"Intervals", d:"]a; b[ open, [a; b] closed, [a; b[ half-open. In English texts also (a, b), [a, b)."},
    {t:"Logarithms", d:"log = base 10, ln = base e. In some CAS log means ln: check!"},
    {t:"Vectors and points", d:"Vectors with an arrow, coordinates often in a column; points P(x, y) or P(x, y, z)."},
    {t:"Approximately", d:"≈ for rounded results; give the number of decimals the context needs (money: 2, people: whole numbers)."}
  ]},
  {ex:R`Write the solution set of $x^2 < 9$ and the result $\frac{\ln 2{,}5}{\ln 1{,}05}$ as you would in a Danish answer.`,
   steps:[
     ["Inequality.", R`-3 < x < 3 \iff x \in \ ]-3;\ 3[`],
     ["Number with decimal comma, rounded.", R`\frac{\ln 2{,}5}{\ln 1{,}05} \approx 18{,}78`]
   ],
   res:R`$]-3;\ 3[$ and $\approx 18{,}78$.`},
  {warn:R`Do not round in the middle of a calculation: keep the CAS value and round only the final answer. Early rounding can change the last digit, or more (see [[c35]]).`}
],

"Task wording — „bestem“, „aflæs“, „vis“":[
  R`Danish exam tasks start with an instruction word. It decides what counts as a full answer, so read it before you start.`,
  {cards:[
    {t:"„bestem“ (determine)", d:"Find the result by any method, CAS included. Document how: the equation or command and the result."},
    {t:"„bestem ved beregning“", d:"By calculation: show the steps (they may be done in CAS, but not read off a graph)."},
    {t:"„aflæs“ (read off)", d:"Take the value from a graph or table; show where (a line on the graph, the row of the table). Approximate is fine."},
    {t:"„vis (at)“ (show that)", d:"Give a complete argument that ends in the stated result. Getting the given number in CAS is not enough without the reasoning."},
    {t:"„beregn“, „undersøg“, „opstil“", d:"Compute; investigate (and conclude); set up (a model, an equation)."},
    {t:"„gør rede for“, „begrund“, „skitsér“", d:"Explain; give reasons; sketch (shape and key points, not exact)."}
  ]},
  {ex:R`"Vis, at $f(x) = x^3 - 3x$ har et lokalt maksimum i $x = -1$." What must the answer contain?`,
   steps:[
     ["Derivative and its zero at −1.", R`f'(x) = 3x^2 - 3,\quad f'(-1) = 0`],
     ["Sign change or second derivative.", R`f''(-1) = -6 < 0`],
     ["Conclusion.", R`\text{local maximum at } x = -1`]
   ],
   res:"All three steps with a closing sentence. A graph alone would be „aflæs“, not „vis“."},
  {ex:R`"Aflæs $f(2)$ på grafen" versus "Bestem $f(2)$" for a given formula $f(x) = 3 \cdot 1{,}2^x$.`,
   steps:[
     ["Aflæs: from the graph, with a mark at x = 2.", R`f(2) \approx 4{,}3`],
     ["Bestem: from the formula.", R`f(2) = 3 \cdot 1{,}44 = 4{,}32`]
   ],
   res:"Read-off values are approximate; „bestem“ wants the computed value."},
  {warn:R`Answer the question asked, in words: not only "$x = 8{,}5$" but "the population reaches 100 after about 8,5 years". Missing conclusions cost points in Danish grading.`}
]

  }
};
})();

/* The formula booklet (Danish Matematik A) */
(() => {

THEORY.c39 = {
  mins:15,
  brief:[
    R`The official formula booklet (formelsamling) is allowed in the exam, also in the part without other aids.`,
    R`It contains, among other things: derivatives and integrals of the basic functions, the rules, the standard differential equations with solutions, vectors, lines, planes, the circle and sphere, statistics and probability formulas, and the regression models.`,
    R`It does not explain when to use what, and it does not replace knowing the basics by heart.`,
    R`Know its layout: where each area is and in which notation.`
  ],
  subs:{

"What's in the formula booklet":[
  R`The booklet is a reference, not a textbook: formulas, often in tables, with a short note on the conditions. Use this app's theory to understand a formula, and the booklet in the exam to look up a detail (a sign, a factor, the exact form of a solution).`,
  {cards:[
    {t:"Functions", d:"Linear, exponential, power, logarithms; doubling time and half-life; trigonometric functions."},
    {t:"Calculus", d:"Derivatives and antiderivatives of the basic functions, the rules (sum, product, chain), tangent, volume of revolution."},
    {t:"Differential equations", d:"y′ = ky, y′ = b − ay, logistic growth, with their solutions."},
    {t:"Geometry and vectors", d:"Triangles (sine and cosine rules), vectors in 2D and 3D, dot and cross product, lines, planes, circle and sphere, distances."},
    {t:"Statistics and probability", d:"Mean, quartiles, binomial and normal distribution, tests."}
  ]},
  {ex:R`Which formula from the booklet do you need, and which do you know by heart? $\frac{d}{dx}\big(5e^{-0{,}2x}\big)$.`,
   steps:[
     ["Known by heart: derivative of e^(kx) and the constant rule.", R`(e^{kx})' = k\,e^{kx}`],
     ["Result.", R`5 \cdot (-0{,}2)\,e^{-0{,}2x} = -e^{-0{,}2x}`]
   ],
   res:"No booklet needed; looking it up costs time you need for harder tasks."},
  {warn:R`The booklet lists $y' = b - ay$ with its solution in a fixed form. Your equation may be written differently (e.g. $T' = -0{,}1(T - 20)$): rewrite it into the booklet's form before you copy the solution.`}
],

"Finding things fast":[
  R`In the exam every minute counts. Get to know the booklet before the exam: read it once from start to end, mark (if allowed) the pages you use most, and practise old tasks with it in your hand.`,
  {steps:[
    {t:"Before", d:"Read the table of contents and the section headings; know which part holds vectors, which calculus, which statistics."},
    {t:"While practising", d:"Each time you look something up, note the page. After a few weeks the common pages are familiar."},
    {t:"In the exam", d:"Look up only details; set up and plan the solution yourself."}
  ]},
  {ex:R`You need the volume of the solid formed when $f(x) = \sqrt{x}$, $0 \leq x \leq 4$, turns about the $x$-axis. What do you look up, and what do you do yourself?`,
   steps:[
     ["Look up (or know): the volume formula.", R`V = \pi \int_a^b f(x)^2\,dx`],
     ["Yourself: substitute and integrate.", R`\pi \int_0^4 x\,dx = 8\pi \approx 25{,}1`]
   ],
   res:"The booklet gives the formula; the work and the answer are yours."},
  {warn:R`The notation in the booklet can differ from your textbook (e.g. letters for constants, the form of the logistic solution). Match the meaning, not the letters.`}
]

  }
};
})();

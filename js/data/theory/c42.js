/* Proofs for the oral exam (Danish Matematik A) */
(() => {

THEORY.c42 = {
  mins:25,
  brief:[
    R`In the oral exam you present a topic, usually with a proof or derivation you have prepared.`,
    R`Typical proofs: a derivative from the definition, a differentiation rule, the tangent equation, the solution of $y' = ky$, the fundamental theorem, the volume of revolution, a distance or angle formula with vectors.`,
    R`Learn the idea and the order of the steps, not a text by heart: be able to start from a blank board.`,
    R`Present: what is to be proved, the assumptions, a drawing, the steps with reasons, and the conclusion.`
  ],
  subs:{

"Choosing and learning the proofs":[
  R`Choose proofs that cover your topics and that you can explain in your own words. A good proof for the oral exam has a clear key idea (a limit, a substitution, a geometric picture) and a manageable number of steps.`,
  {cards:[
    {t:"Calculus", d:"(x²)′ = 2x or (√x)′ from the definition; the product rule; the tangent equation; the fundamental theorem A′(x) = f(x)."},
    {t:"Differential equations", d:"y′ = ky has the solutions y = Ce^(kx); checking the logistic solution."},
    {t:"Vectors and geometry", d:"The distance from a point to a line; the angle formula with the dot product; the cosine rule."},
    {t:"Volumes", d:"V = π∫f(x)² dx from slices; the cone or sphere as a check."}
  ]},
  {steps:[
    {t:"Understand", d:"Write the proof out once with a reason for every step."},
    {t:"Skeleton", d:"Reduce it to 4–6 key lines you can reproduce: start, key idea, main steps, conclusion."},
    {t:"Rebuild", d:"Close the notes and rebuild the proof from the skeleton on paper."},
    {t:"Say it", d:"Explain it aloud (or to someone) as at the board, including why each step is allowed."}
  ]},
  {ex:R`Prove that $(x^2)' = 2x$ from the definition of the derivative.`,
   steps:[
     ["Definition.", R`f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}`],
     ["Difference quotient.", R`\frac{(x + h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h \quad (h \neq 0)`],
     ["Limit.", R`\lim_{h \to 0} (2x + h) = 2x`]
   ],
   res:"(x²)′ = 2x. Key idea: expand, cancel h, then let h → 0."},
  {tool:"derivacia", ask:R`The picture behind the proof: the secant through $x$ and $x + h$ turns into the tangent as $h \to 0$.`,
   take:R`the slope of the secant is $2x + h$; it tends to $2x$, the slope of the tangent. A drawing like this helps at the board.`,
   cfg:{typ:"secna", en:true, f:"x^2", x0:{v:1}, view:[-2, 5, 3, -1], on:{dot:true}}},
  {warn:R`Do not skip the reason why you may cancel $h$: it is because $h \neq 0$ in the difference quotient; only afterwards do we let $h \to 0$.`}
],

"Presenting a proof orally":[
  R`At the board, the examiner wants to hear that you understand, not to watch you copy. State the claim first, then lead through the steps and say **why** each holds. Use a drawing where it helps, and end by returning to the claim.`,
  {steps:[
    {t:"Claim", d:"Say and write what you prove, with the assumptions (e.g. f differentiable, y > 0)."},
    {t:"Picture", d:"A quick sketch: secant and tangent, the strip under a graph, the slice of a solid."},
    {t:"Steps", d:"One idea per line, each with a short reason (definition, rule, earlier result)."},
    {t:"Conclusion", d:"Point back to the claim: “so the derivative is 2x, as stated”."},
    {t:"Questions", d:"Expect “why may you do that?” and “what if …?”. Answer briefly, using the right terms."}
  ]},
  {ex:R`Prove that every function $y = Ce^{kx}$ solves $y' = ky$, and that there are no other solutions.`,
   steps:[
     ["They are solutions.", R`(Ce^{kx})' = Cke^{kx} = k \cdot Ce^{kx}`],
     [R`Let $y$ be any solution and set $g(x) = y\,e^{-kx}$.`, R`g'(x) = y'e^{-kx} - ky\,e^{-kx} = (y' - ky)\,e^{-kx} = 0`],
     [R`$g' = 0$ everywhere, so $g$ is a constant $C$.`, R`y\,e^{-kx} = C \Rightarrow y = Ce^{kx}`]
   ],
   res:"All solutions are y = Ce^(kx). Key idea: multiply by e^(−kx) and use the product rule."},
  {ex:R`Prove the tangent equation $y = f'(x_0)(x - x_0) + f(x_0)$.`,
   steps:[
     [R`The tangent is a line with slope $a = f'(x_0)$.`, R`y = ax + b`],
     [R`It passes through $[x_0, f(x_0)]$.`, R`f(x_0) = a x_0 + b \Rightarrow b = f(x_0) - a x_0`],
     ["Substitute b.", R`y = ax + f(x_0) - ax_0 = f'(x_0)(x - x_0) + f(x_0)`]
   ],
   res:"The formula follows from 'slope' and 'point on the line'."},
  {warn:R`Do not read the proof from notes or rush: a short, clear proof with reasons is better than a long one recited. If you get stuck, say what you are trying to show next.`}
]

  }
};
})();

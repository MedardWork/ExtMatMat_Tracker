/* Perpendicular vector, determinant and area (Danish Matematik A) */
(() => {
const A = st => st.h && st.h.an;

THEORY.c19 = {
  mins:20,
  brief:[
    R`The perpendicular vector (Danish *tværvektor*) of $\vec a = (a_1, a_2)$ is $\hat{a} = (-a_2, a_1)$: $\vec a$ turned $90^\circ$ anticlockwise.`,
    R`$\vec a \perp \vec b \iff \vec a \cdot \vec b = a_1 b_1 + a_2 b_2 = 0$.`,
    R`Determinant $\det(\vec a, \vec b) = a_1 b_2 - a_2 b_1 = \hat{a} \cdot \vec b$.`,
    R`$|\det(\vec a, \vec b)|$ is the area of the parallelogram spanned by $\vec a$ and $\vec b$; $\det = 0 \iff \vec a \parallel \vec b$.`
  ],
  subs:{

"Perpendicular vector":[
  R`Turning a vector by $90^\circ$ anticlockwise swaps its coordinates and changes the sign of the new first one. The result is the **perpendicular vector** $\hat{a}$. It has the same length as $\vec a$, and the dot product of the two is always 0.`,
  {def:"Perpendicular vector", tex:R`\vec a = (\va{a_1}, \vb{a_2}) \ \Rightarrow\ \hat{a} = (-\vb{a_2}, \va{a_1}) \qquad \vec a \cdot \hat{a} = -a_1 a_2 + a_2 a_1 = 0`},
  {tool:"analyticka", ask:R`Drag the end of $\vec u$ and watch its perpendicular vector $\hat u$.`,
   take:R`$\hat u$ always has the same length and points $90^\circ$ anticlockwise from $\vec u$.`,
   cfg:{typ:"vektory", en:true, on:{kolmy:true}, hide:["sucet", "rozdiel", "uhol", "plocha", "priemet", "nasobok"]}},
  {ex:R`Find the perpendicular vector of $\vec a = (3, 2)$ and check it.`,
   steps:[
     ["Swap and change the sign of the first.", R`\hat{a} = (-2, 3)`],
     ["Check.", R`\vec a \cdot \hat{a} = 3 \cdot (-2) + 2 \cdot 3 = 0`]
   ],
   res:R`$\hat{a} = (-2, 3)$.`},
  {ex:R`Find $t$ so that $(t, 4)$ is perpendicular to $(2, -3)$.`,
   steps:[
     ["Dot product zero.", R`2t + 4 \cdot (-3) = 0`],
     ["Solve.", R`t = 6`]
   ],
   res:R`$t = 6$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Drag the end of $\vec v$ so that $\vec v$ is perpendicular to $\vec u$.`,
   hint:"The dot product must be 0, e.g. v = (−1, 4) for u = (4, 1).",
   goal:(P, st) => !!A(st) && Math.abs(A(st).dot) < 1e-9 && A(st).lv > 0,
   cfg:{typ:"vektory", en:true, on:{uhol:true}, hide:["sucet", "rozdiel", "kolmy", "plocha", "priemet", "nasobok"]}},
  {warn:R`$\hat a = (-a_2, a_1)$, not $(a_2, -a_1)$: the second is perpendicular too, but turned clockwise ($-\hat a$). In formulas such as $\det = \hat a \cdot \vec b$ the sign matters.`}
],

"Determinant and area of a parallelogram":[
  R`Two vectors from one point span a **parallelogram**. Its area is the base $|\vec a|$ times the height, and the height is the length of the projection of $\vec b$ on $\hat a$. That gives a short formula, the **determinant**.`,
  {def:"Determinant and area", tex:R`\det(\vec a, \vec b) = \begin{vmatrix} a_1 & b_1 \\ a_2 & b_2 \end{vmatrix} = a_1 b_2 - a_2 b_1 \qquad A_{\text{parallelogram}} = |\det(\vec a, \vec b)| \qquad A_{\text{triangle}} = \tfrac{1}{2}|\det(\vec a, \vec b)|`,
   note:"det > 0: b lies anticlockwise from a; det < 0: clockwise; det = 0: the vectors are parallel."},
  {tool:"analyticka", ask:R`The parallelogram spanned by $\vec u$ and $\vec v$. Drag the ends and watch the determinant.`,
   take:R`the area is $|\det|$; when the vectors become parallel, the parallelogram collapses and $\det = 0$.`,
   cfg:{typ:"vektory", en:true, on:{plocha:true}, hide:["sucet", "rozdiel", "uhol", "kolmy", "priemet", "nasobok"]}},
  {ex:R`Find the area of the triangle $A(1, 1)$, $B(5, 2)$, $C(2, 4)$.`,
   steps:[
     ["Two side vectors from A.", R`\overrightarrow{AB} = (4, 1),\quad \overrightarrow{AC} = (1, 3)`],
     ["Determinant.", R`\det = 4 \cdot 3 - 1 \cdot 1 = 11`],
     ["Half of the parallelogram.", R`A = \tfrac{1}{2} \cdot 11 = 5{,}5`]
   ],
   res:"The area is 5,5."},
  {tool:"analyticka", ask:R`A triangle given by three points; the tool computes its area from the determinant. Check the example.`,
   take:R`with $A(1, 1)$, $B(5, 2)$, $C(2, 4)$ the area is 5,5. Drag $C$ onto the line $AB$ and the area becomes 0.`,
   cfg:{typ:"obsah", en:true, pts:{A:[1, 1], B:[5, 2], C:[2, 4]}}},
  {ex:R`Are $\vec a = (6, -4)$ and $\vec b = (-3, 2)$ parallel?`,
   steps:[
     ["Determinant.", R`\det(\vec a, \vec b) = 6 \cdot 2 - (-4) \cdot (-3) = 12 - 12 = 0`]
   ],
   res:R`Yes, $\vec a = -2\vec b$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Drag the end of $\vec v$ so that the parallelogram has area 10.`,
   hint:"|4·v₂ − 1·v₁| = 10, e.g. v = (2, 3) or v = (−2, 2).",
   goal:(P, st) => !!A(st) && Math.abs(Math.abs(A(st).det) - 10) < 1e-9,
   cfg:{typ:"vektory", en:true, on:{plocha:true}, hide:["sucet", "rozdiel", "uhol", "kolmy", "priemet", "nasobok"]}},
  {warn:R`The determinant can be negative; the area is its absolute value. And the order matters: $\det(\vec b, \vec a) = -\det(\vec a, \vec b)$.`}
]

  }
};
})();

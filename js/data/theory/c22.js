/* Vectors in space, cross product (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const V = st => st.h && st.h.v3;

THEORY.c22 = {
  mins:20,
  brief:[
    R`In space a vector has three coordinates: $\vec a = (a_1, a_2, a_3)$, $|\vec a| = \sqrt{a_1^2 + a_2^2 + a_3^2}$.`,
    R`$\vec a \cdot \vec b = a_1b_1 + a_2b_2 + a_3b_3 = |\vec a||\vec b|\cos v$; zero means perpendicular.`,
    R`Cross product $\vec a \times \vec b$: a vector perpendicular to both, with length equal to the area of their parallelogram.`,
    R`$\vec a \times \vec b = (a_2b_3 - a_3b_2,\ a_3b_1 - a_1b_3,\ a_1b_2 - a_2b_1)$, and $\vec b \times \vec a = -\vec a \times \vec b$.`
  ],
  subs:{

"Vectors in 3D":[
  R`Everything from the plane carries over with a third coordinate $z$: vectors are added coordinate by coordinate, the length gets one more square under the root, and the dot product one more product. The angle formula stays the same.`,
  {def:"Length, dot product, angle", tex:R`|\vec a| = \sqrt{a_1^2 + a_2^2 + a_3^2} \qquad \vec a \cdot \vec b = a_1b_1 + a_2b_2 + a_3b_3 \qquad \cos v = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}`},
  {tool:"vektory3d", ask:R`Two vectors from the origin. Change their coordinates and turn the view (or drag the picture).`,
   take:R`the dot product and the angle do not depend on the view; only the picture turns.`,
   cfg:{typ:"vektory", en:true, on:{uhol:true}}},
  {ex:R`$A(1, 2, 3)$, $B(4, 0, 5)$. Find $\overrightarrow{AB}$ and $|AB|$. Then find the angle between $\vec a = (2, 1, 0)$ and $\vec b = (0, 2, 1)$.`,
   steps:[
     ["Vector.", R`\overrightarrow{AB} = (3, -2, 2)`],
     ["Length.", R`|AB| = \sqrt{9 + 4 + 4} = \sqrt{17} \approx 4{,}12`],
     ["Dot product and lengths.", R`\vec a \cdot \vec b = 0 + 2 + 0 = 2,\quad |\vec a| = |\vec b| = \sqrt{5}`],
     ["Angle.", R`\cos v = \frac{2}{5} \Rightarrow v \approx 66{,}4^\circ`]
   ],
   res:R`$\overrightarrow{AB} = (3, -2, 2)$, $|AB| \approx 4{,}12$; the angle is about $66{,}4^\circ$.`},
  {tool:"vektory3d", kind:"uloha", ask:R`$\vec a = (2, 1, 2)$ and $\vec b = (1, 2, b_3)$. Set $b_3$ so that the vectors are perpendicular.`,
   hint:"2 + 2 + 2b₃ = 0.",
   goal:(P, st) => !!V(st) && Math.abs(V(st).skal) < 1e-9,
   cfg:{typ:"vektory", en:true, a:[2, 1, 2], b:[1, 2, 1], lock:["a1", "a2", "a3", "b1", "b2"], on:{uhol:true}}},
  {warn:R`A picture of space is a projection: lengths and angles cannot be read from it. Always compute them from the coordinates.`}
],

"Cross product":[
  R`In space, two non-parallel vectors have a whole line of common perpendiculars. The **cross product** $\vec a \times \vec b$ picks one: perpendicular to both, pointing by the right-hand rule, and as long as the area of the parallelogram spanned by $\vec a$ and $\vec b$.`,
  {def:"Cross product", tex:R`\vec a \times \vec b = \begin{pmatrix} a_2b_3 - a_3b_2 \\ a_3b_1 - a_1b_3 \\ a_1b_2 - a_2b_1 \end{pmatrix} \qquad |\vec a \times \vec b| = |\vec a||\vec b|\sin v = \text{area of the parallelogram}`,
   note:"Each coordinate is a 2 × 2 determinant of the other two coordinates. a × b = 0 exactly when a and b are parallel."},
  {tool:"vektory3d", ask:R`Switch on the cross product. Change $\vec a$ and $\vec b$ and turn the view.`,
   take:R`$\vec a \times \vec b$ always stands perpendicular to the parallelogram, and its length is the parallelogram's area.`,
   cfg:{typ:"vektory", en:true, on:{sucin:true}}},
  {ex:R`Find $\vec a \times \vec b$ for $\vec a = (2, 1, 0)$, $\vec b = (0, 2, 1)$, check it and find the area of the parallelogram.`,
   steps:[
     ["Coordinates.", R`(1 \cdot 1 - 0 \cdot 2,\ 0 \cdot 0 - 2 \cdot 1,\ 2 \cdot 2 - 1 \cdot 0) = (1, -2, 4)`],
     ["Check: perpendicular to both.", R`(1, -2, 4) \cdot \vec a = 2 - 2 + 0 = 0,\quad (1, -2, 4) \cdot \vec b = 0 - 4 + 4 = 0`],
     ["Area.", R`\sqrt{1 + 4 + 16} = \sqrt{21} \approx 4{,}58`]
   ],
   res:R`$\vec a \times \vec b = (1, -2, 4)$, area $\approx 4{,}58$.`},
  {ex:R`Find the area of the triangle $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$.`,
   steps:[
     ["Side vectors.", R`\overrightarrow{AB} = (-1, 2, 0),\quad \overrightarrow{AC} = (-1, 0, 3)`],
     ["Cross product.", R`(2 \cdot 3 - 0 \cdot 0,\ 0 \cdot (-1) - (-1) \cdot 3,\ (-1) \cdot 0 - 2 \cdot (-1)) = (6, 3, 2)`],
     ["Half its length.", R`\tfrac{1}{2}\sqrt{36 + 9 + 4} = \tfrac{1}{2} \cdot 7 = 3{,}5`]
   ],
   res:"The area is 3,5."},
  {tool:"vektory3d", kind:"uloha", ask:R`$\vec a = (2, 1, 0)$ is fixed. Change $\vec b$ (not to the zero vector) so that $\vec a \times \vec b$ is the zero vector.`,
   hint:"The cross product is 0 when b is parallel to a, e.g. b = (4, 2, 0) or (−2, −1, 0).",
   goal:(P, st) => !!V(st) && V(st).obsah < 1e-9 && (P.b1 || P.b2 || P.b3),
   cfg:{typ:"vektory", en:true, a:[2, 1, 0], lock:["a1", "a2", "a3"], on:{sucin:true}}},
  {warn:R`The middle coordinate is $a_3b_1 - a_1b_3$, not $a_1b_3 - a_3b_1$: a sign mistake there is the most common error. Check the result by dotting it with $\vec a$ and $\vec b$.`}
]

  }
};
})();

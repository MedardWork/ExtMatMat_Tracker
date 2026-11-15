/* Intersections, angles and distances in space (Danish Matematik A) */
(() => {
const V = st => st.h && st.h.v3;

THEORY.c25 = {
  mins:30,
  brief:[
    R`Line and plane: put $x$, $y$, $z$ of the line into the plane's equation, solve for $t$, substitute back.`,
    R`Two planes meet in a line with direction $\vec n_1 \times \vec n_2$.`,
    R`Angles: two lines $\cos v = \frac{|\vec r_1 \cdot \vec r_2|}{|\vec r_1||\vec r_2|}$; line and plane $\sin v = \frac{|\vec r \cdot \vec n|}{|\vec r||\vec n|}$; two planes $\cos v = \frac{|\vec n_1 \cdot \vec n_2|}{|\vec n_1||\vec n_2|}$.`,
    R`Distances: point–plane $\frac{|ax_0 + by_0 + cz_0 + d|}{\sqrt{a^2 + b^2 + c^2}}$; point–line $\frac{|\vec r \times \overrightarrow{PQ}|}{|\vec r|}$.`
  ],
  subs:{

"Intersections in 3D":[
  R`A line meets a plane in one point, unless it is parallel to it. The parametric form gives $x$, $y$, $z$ in terms of $t$; putting them into the plane's equation gives one equation in $t$.`,
  {def:"Line meets plane", tex:R`a(x_0 + t r_1) + b(y_0 + t r_2) + c(z_0 + t r_3) + d = 0`,
   note:"No solution: the line is parallel to the plane. Every t a solution: the line lies in the plane."},
  {tool:"vektory3d", ask:R`A line and a plane (normal $\vec n$ through $S$). The tool marks their intersection. Change the direction $\vec r$.`,
   take:R`the intersection moves along the plane; when $\vec r \perp \vec n$, the line is parallel to the plane and there is no intersection.`,
   cfg:{typ:"priamka", en:true, on:{rovina:true}}},
  {ex:R`Find where $X = (1, 0, 2) + t(2, 1, -2)$ meets the plane $x + y + z = 6$.`,
   steps:[
     ["Substitute.", R`(1 + 2t) + t + (2 - 2t) = 6`],
     ["Solve.", R`3 + t = 6 \Rightarrow t = 3`],
     ["Point.", R`(1 + 6,\ 3,\ 2 - 6) = (7, 3, -4)`],
     ["Check.", R`7 + 3 - 4 = 6`]
   ],
   res:R`$(7, 3, -4)$.`},
  {tool:"vektory3d", kind:"uloha", ask:R`The plane is horizontal ($\vec n = (0, 0, 1)$). Change the direction $\vec r$ so that the line is parallel to the plane.`,
   hint:"r · n = r₃ = 0, with r₁ or r₂ not zero.",
   goal:P => P.r3 === 0 && (P.r1 !== 0 || P.r2 !== 0),
   cfg:{typ:"priamka", en:true, on:{rovina:true}, lock:["n1", "n2", "n3", "S1", "S2", "S3"]}},
  {ex:R`Find the line of intersection of $x + y + z = 6$ and $x - y = 0$.`,
   steps:[
     ["Direction from the normals.", R`(1, 1, 1) \times (1, -1, 0) = (0 + 1,\ 1 - 0,\ -1 - 1) = (1, 1, -2)`],
     [R`A common point: $x = y = 0$ gives $z = 6$.`, R`(0, 0, 6)`],
     ["Line.", R`X = (0, 0, 6) + t(1, 1, -2)`]
   ],
   res:R`$X = (0, 0, 6) + t(1, 1, -2)$.`},
  {warn:R`The intersection of two planes is a line, not a point: you get two equations for three unknowns, so one coordinate stays free.`}
],

"Angles between lines and planes":[
  R`Angles are computed from direction vectors and normal vectors with the dot product. Between a line and a plane, the angle with the **normal** is the complement of the wanted angle, so cosine becomes sine.`,
  {def:"Angles in space", tex:R`\cos v = \frac{|\vec r_1 \cdot \vec r_2|}{|\vec r_1||\vec r_2|} \qquad \sin v = \frac{|\vec r \cdot \vec n|}{|\vec r||\vec n|} \qquad \cos v = \frac{|\vec n_1 \cdot \vec n_2|}{|\vec n_1||\vec n_2|}`,
   note:"Line–line, line–plane, plane–plane. The absolute value gives the angle between 0° and 90°."},
  {tool:"vektory3d", ask:R`The line $X = (-3, -2, 0) + t(1, 2, 1)$ and the horizontal plane $z = 3$. Read the angle.`,
   take:R`$\sin v = \frac{|1|}{\sqrt{6} \cdot 1}$, so $v \approx 24{,}1^\circ$: the line rises gently.`,
   cfg:{typ:"priamka", en:true, on:{rovina:true}}},
  {ex:R`Find the angle between $X = (1, 0, 2) + t(2, 1, -2)$ and the plane $x + y + z = 6$.`,
   steps:[
     ["Dot product with the normal (1, 1, 1).", R`|2 + 1 - 2| = 1`],
     ["Lengths.", R`|\vec r| = 3,\quad |\vec n| = \sqrt{3}`],
     ["Sine.", R`\sin v = \frac{1}{3\sqrt{3}} \approx 0{,}192 \Rightarrow v \approx 11{,}1^\circ`]
   ],
   res:R`About $11{,}1^\circ$: the line almost runs along the plane.`},
  {ex:R`Find the angle between the planes $x + y + z = 6$ and $x - y = 0$.`,
   steps:[
     ["Normals.", R`(1, 1, 1) \cdot (1, -1, 0) = 0`]
   ],
   res:R`$90^\circ$: the planes are perpendicular.`},
  {warn:R`For the angle between a line and a plane use **sine** (with the normal vector). Using cosine gives the angle between the line and the normal, i.e. $90^\circ - v$.`}
],

"Distances in 3D":[
  R`The distance from a point to a plane is measured along the normal; there is a direct formula. The distance from a point to a line uses the cross product: the parallelogram spanned by $\vec r$ and $\overrightarrow{PQ}$ has area = base $|\vec r|$ times height $d$.`,
  {def:"Distances", tex:R`d(Q, \alpha) = \frac{|a x_0 + b y_0 + c z_0 + d|}{\sqrt{a^2 + b^2 + c^2}} \qquad d(Q, l) = \frac{|\vec r \times \overrightarrow{PQ}|}{|\vec r|}`,
   note:"Q(x₀, y₀, z₀); α: ax + by + cz + d = 0; l through P with direction r."},
  {tool:"vektory3d", ask:R`The plane $x + y + 2z - 6 = 0$ and the point $Q(3, 3, 4)$. Compare with the example below, then move $Q$.`,
   take:R`$d = \frac{8}{\sqrt{6}} \approx 3{,}27$; the tool also marks the foot of the perpendicular.`,
   cfg:{typ:"rovina", en:true, on:{bod:true}}},
  {ex:R`Find the distance from $Q(3, 3, 4)$ to the plane $x + y + 2z - 6 = 0$.`,
   steps:[
     ["Substitute Q.", R`|3 + 3 + 8 - 6| = 8`],
     ["Divide by |n|.", R`d = \frac{8}{\sqrt{1 + 1 + 4}} = \frac{8}{\sqrt{6}} \approx 3{,}27`]
   ],
   res:R`$d \approx 3{,}27$.`},
  {tool:"vektory3d", kind:"uloha", ask:R`Move $Q$ so that it lies in the plane (distance 0).`,
   hint:"Q must satisfy x + y + 2z = 6, e.g. Q = (2, 2, 1) or (4, 2, 0).",
   goal:(P, st) => !!V(st) && V(st).vzd < 1e-9,
   cfg:{typ:"rovina", en:true, on:{bod:true}, lock:["P1", "P2", "P3", "n1", "n2", "n3"]}},
  {ex:R`Find the distance from $Q(3, 3, 4)$ to the line $X = (-3, -2, 0) + t(1, 2, 1)$.`,
   steps:[
     [R`$\overrightarrow{PQ} = (6, 5, 4)$.`, R`\vec r \times \overrightarrow{PQ} = (2 \cdot 4 - 1 \cdot 5,\ 1 \cdot 6 - 1 \cdot 4,\ 1 \cdot 5 - 2 \cdot 6) = (3, 2, -7)`],
     ["Lengths.", R`|(3, 2, -7)| = \sqrt{62},\quad |\vec r| = \sqrt{6}`],
     ["Distance.", R`d = \frac{\sqrt{62}}{\sqrt{6}} \approx 3{,}21`]
   ],
   res:R`$d \approx 3{,}21$.`},
  {tool:"vektory3d", ask:R`The line and the point from the example. Check the distance.`,
   take:R`the tool gets $\approx 3{,}21$ and marks the closest point of the line.`,
   cfg:{typ:"priamka", en:true, on:{bod:true}}},
  {warn:R`In the point–plane formula use the equation with everything on one side ($= 0$). For $x + y + 2z = 6$ the constant is $d = -6$, not $6$.`}
]

  }
};
})();

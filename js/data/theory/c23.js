/* Planes in space (Danish Matematik A) */
(() => {
const V = st => st.h && st.h.v3;

THEORY.c23 = {
  mins:20,
  brief:[
    R`A plane is given by a point $P(x_0, y_0, z_0)$ and a normal vector $\vec n = (a, b, c)$: $a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$.`,
    R`Multiplied out: $ax + by + cz + d = 0$; the coefficients of $x$, $y$, $z$ form a normal vector.`,
    R`Parametric form: $X = P + s\,\vec u + t\,\vec v$ with two non-parallel direction vectors.`,
    R`From three points or two directions: $\vec n = \vec u \times \vec v$.`
  ],
  subs:{

"Equation of a plane":[
  R`A plane is fixed by one of its points $P$ and the direction perpendicular to it, a **normal vector** $\vec n$. A point $X$ lies in the plane exactly when $\overrightarrow{PX}$ is perpendicular to $\vec n$, i.e. their dot product is 0.`,
  {def:"Equation of a plane", tex:R`\vec n \cdot \overrightarrow{PX} = 0 \iff a(x - x_0) + b(y - y_0) + c(z - z_0) = 0 \iff ax + by + cz + d = 0`},
  {tool:"vektory3d", ask:R`The plane through $P$ with normal $\vec n$. Change $\vec n$ and watch the plane tilt and its equation change.`,
   take:R`the coefficients of $x$, $y$, $z$ in the equation are exactly the coordinates of $\vec n$; $d$ makes the plane pass through $P$.`,
   cfg:{typ:"rovina", en:true}},
  {ex:R`Find the plane through $P(1, 1, 2)$ with normal $\vec n = (1, 1, 2)$. Does $Q(2, 0, 2)$ lie in it?`,
   steps:[
     ["Equation.", R`1(x - 1) + 1(y - 1) + 2(z - 2) = 0 \iff x + y + 2z - 6 = 0`],
     ["Substitute Q.", R`2 + 0 + 4 - 6 = 0`]
   ],
   res:R`$x + y + 2z - 6 = 0$; $Q$ lies in the plane.`},
  {tool:"vektory3d", kind:"uloha", ask:R`Change the normal vector so that the plane through $P$ is horizontal (parallel to the $xy$-plane).`,
   hint:"A horizontal plane has a vertical normal: n = (0, 0, c).",
   goal:(P, st) => !!V(st) && P.n1 === 0 && P.n2 === 0 && P.n3 !== 0,
   cfg:{typ:"rovina", en:true}},
  {ex:R`Find the plane through $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$.`,
   steps:[
     [R`Normal from the cross product (see [[c22]]).`, R`\vec n = \overrightarrow{AB} \times \overrightarrow{AC} = (6, 3, 2)`],
     ["Through A.", R`6(x - 1) + 3y + 2z = 0 \iff 6x + 3y + 2z - 6 = 0`],
     ["Check B and C.", R`0 + 6 + 0 - 6 = 0,\quad 0 + 0 + 6 - 6 = 0`]
   ],
   res:R`$6x + 3y + 2z - 6 = 0$.`},
  {warn:R`The normal vector is perpendicular to the plane, not lying in it. A vector **in** the plane (like $\overrightarrow{AB}$) has dot product 0 with $\vec n$.`}
],

"Parametric form of a plane":[
  R`Instead of a normal, a plane can be given by a point and two **direction vectors** $\vec u$, $\vec v$ lying in it (not parallel). Every point of the plane is reached by going $s$ times along $\vec u$ and $t$ times along $\vec v$.`,
  {def:"Parametric form", tex:R`\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} x_0 \\ y_0 \\ z_0 \end{pmatrix} + s\,\vec u + t\,\vec v \qquad \vec n = \vec u \times \vec v`},
  {tool:"vektory3d", ask:R`A plane given by $P(0, 0, 1)$ and two directions. The tool computes the normal as their cross product and then the equation.`,
   take:R`the normal $\vec u \times \vec v$ is perpendicular to both directions, so the plane can be written with an ordinary equation.`,
   cfg:{typ:"rovina", en:true, smery:[[2, 0, 1], [0, 2, 1]], P:[0, 0, 1]}},
  {ex:R`Convert $X = (0, 0, 1) + s(2, 0, 1) + t(0, 2, 1)$ to an equation.`,
   steps:[
     ["Normal.", R`(2, 0, 1) \times (0, 2, 1) = (0 - 2,\ 0 - 2,\ 4 - 0) = (-2, -2, 4)`],
     ["Simpler normal (divide by −2).", R`\vec n = (1, 1, -2)`],
     ["Through (0, 0, 1).", R`x + y - 2(z - 1) = 0 \iff x + y - 2z + 2 = 0`],
     ["Check the point for s = 1, t = 0: (2, 0, 2).", R`2 + 0 - 4 + 2 = 0`]
   ],
   res:R`$x + y - 2z + 2 = 0$.`},
  {ex:R`Does the point $(4, 2, 4)$ lie in the plane $X = (0, 0, 1) + s(2, 0, 1) + t(0, 2, 1)$?`,
   steps:[
     [R`From $x$: $2s = 4$, $s = 2$. From $y$: $2t = 2$, $t = 1$.`, R`z = 1 + s + t = 4`],
     ["The third coordinate fits.", R`z = 4\ \checkmark`]
   ],
   res:"Yes (s = 2, t = 1). Checking with the equation x + y − 2z + 2 = 4 + 2 − 8 + 2 = 0 gives the same."},
  {warn:R`Two direction vectors must not be parallel; otherwise they span only a line and $\vec u \times \vec v = \vec 0$ gives no normal.`}
]

  }
};
})();

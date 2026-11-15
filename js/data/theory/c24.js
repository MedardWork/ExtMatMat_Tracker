/* Lines in space, the sphere (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c24 = {
  mins:20,
  brief:[
    R`Line in space: $X = P + t\,\vec r$, i.e. $x = x_0 + t r_1$, $y = y_0 + t r_2$, $z = z_0 + t r_3$. There is no single equation $y = ax + b$ in space.`,
    R`Two lines in space are parallel, intersecting or **skew** (neither parallel nor meeting).`,
    R`Sphere with centre $C(a, b, c)$ and radius $r$: $(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2$.`,
    R`From the expanded form, complete the squares to read off the centre and radius.`
  ],
  subs:{

"Lines in 3D":[
  R`A line in space is given exactly as in the plane: a point $P$ and a direction vector $\vec r$. Each value of the parameter $t$ gives one point. A single equation in $x$, $y$, $z$ would describe a plane, so lines are written in parametric form.`,
  {def:"Parametric line in space", tex:R`\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} \va{x_0} \\ \va{y_0} \\ \va{z_0} \end{pmatrix} + t \begin{pmatrix} \vb{r_1} \\ \vb{r_2} \\ \vb{r_3} \end{pmatrix}`},
  {tool:"vektory3d", ask:R`The line through $P$ with direction $\vec r$ and the point for the parameter $t$. Move $t$, then change $\vec r$.`,
   take:R`$t$ slides the point along the line; $t = 0$ is $P$ itself, negative $t$ goes backwards.`,
   cfg:{typ:"priamka", en:true}},
  {ex:R`Find the line through $A(1, 0, 2)$ and $B(3, 1, 0)$. Does $(5, 2, -2)$ lie on it? Where does it meet the $xy$-plane?`,
   steps:[
     ["Direction.", R`\vec r = \overrightarrow{AB} = (2, 1, -2)`],
     ["Line.", R`x = 1 + 2t,\quad y = t,\quad z = 2 - 2t`],
     [R`Point: from $y$, $t = 2$.`, R`x = 5,\ z = -2\ \checkmark`],
     [R`$xy$-plane: $z = 0$.`, R`t = 1 \Rightarrow (3, 1, 0) = B`]
   ],
   res:R`$X = (1, 0, 2) + t(2, 1, -2)$; the point lies on it ($t = 2$); it meets the $xy$-plane at $B$.`},
  {tool:"vektory3d", kind:"uloha", ask:R`The line $X = (-3, -2, -2) + t(1, 2, 1)$. Set $t$ so that the point lies in the $xy$-plane ($z = 0$).`,
   hint:"z = −2 + t = 0.",
   take:R`$t = 2$ gives the point $(-1, 2, 0)$.`,
   goal:P => P.t === 2,
   cfg:{typ:"priamka", en:true, P:[-3, -2, -2], r:[1, 2, 1], lock:["P1", "P2", "P3", "r1", "r2", "r3"], t:{v:0}}},
  {ex:R`Decide how $l: X = (1, 0, 0) + t(1, 1, 0)$ and $m: X = (0, 1, 1) + s(1, -1, 0)$ lie.`,
   steps:[
     ["Directions are not multiples: not parallel.", R`(1, 1, 0) \neq k(1, -1, 0)`],
     ["Common point? Compare z.", R`0 = 1`],
     ["Impossible: no common point.", R`\text{skew}`]
   ],
   res:"The lines are skew."},
  {warn:R`When looking for a common point of two lines, use two parameters ($t$ and $s$) and check **all three** coordinates: two equations can always be solved, the third decides.`}
],

"Equation of a sphere":[
  R`A sphere is the set of points at distance $r$ from a centre $C$. Writing the distance with coordinates and squaring gives its equation, just like the circle with one more term.`,
  {def:"Sphere", tex:R`(x - \va{a})^2 + (y - \va{b})^2 + (z - \va{c})^2 = \vb{r}^2`,
   note:"A point Q lies inside, on or outside the sphere when |CQ| is less than, equal to or greater than r."},
  {tool:"vektory3d", ask:R`The sphere with centre $C$ and radius $R$, and a point $Q$. Move $Q$ and read where it lies.`,
   take:R`the tool compares $|CQ|$ with the radius: inside, on or outside.`,
   cfg:{typ:"gula", en:true, on:{bod:true}}},
  {ex:R`Find the centre and radius of $x^2 + y^2 + z^2 - 2x + 4y - 6z - 2 = 0$. Where does $Q(3, 2, 3)$ lie?`,
   steps:[
     ["Complete the squares.", R`(x - 1)^2 - 1 + (y + 2)^2 - 4 + (z - 3)^2 - 9 - 2 = 0`],
     ["Rearrange.", R`(x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 16`],
     ["Distance of Q from C(1, −2, 3).", R`\sqrt{4 + 16 + 0} = \sqrt{20} \approx 4{,}47 > 4`]
   ],
   res:R`Centre $(1, -2, 3)$, radius 4; $Q$ lies outside.`},
  {tool:"vektory3d", kind:"uloha", ask:R`The sphere has centre $C(1, 1, 1)$ and radius 3. Move $Q$ so that it lies on the sphere.`,
   hint:"Go 3 along one axis from C, e.g. Q = (1, 1, 4), or use 2² + 2² + 1² = 9: Q = (3, 3, 2).",
   goal:P => Math.abs(Math.hypot(P.Q1 - 1, P.Q2 - 1, P.Q3 - 1) - 3) < 1e-9,
   cfg:{typ:"gula", en:true, C:[1, 1, 1], lock:["C1", "C2", "C3"], R:L(3), on:{bod:true}}},
  {warn:R`Signs flip in the equation: $(y + 2)^2$ means the centre has $y = -2$. And the right side is $r^2$: for $= 16$ the radius is 4, not 16.`}
]

  }
};
})();

/* Parametric line and circle in the plane (Danish Matematik A) */
(() => {
const A = st => st.h && st.h.an;

THEORY.c21 = {
  mins:20,
  brief:[
    R`Parametric line through $P_0(x_0, y_0)$ with direction $\vec r = (r_1, r_2)$: $x = x_0 + t\,r_1$, $y = y_0 + t\,r_2$, $t \in \mathbb{R}$.`,
    R`Each value of $t$ gives one point; a point lies on the line if one $t$ fits both equations.`,
    R`Parametric circle with centre $(a, b)$ and radius $r$: $x = a + r\cos t$, $y = b + r\sin t$, $t \in [0, 2\pi]$.`,
    R`Eliminating $t$ gives back $(x - a)^2 + (y - b)^2 = r^2$ (using $\cos^2 t + \sin^2 t = 1$).`
  ],
  subs:{

"Parametric line":[
  R`Start at a point $P_0$ and walk in the direction $\vec r$: after "time" $t$ you are at $P_0 + t\vec r$. All these points form a line. This **parametric form** works the same way in the plane and in space ([[c24]]).`,
  {def:"Parametric line", tex:R`\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} \va{x_0} \\ \va{y_0} \end{pmatrix} + t \begin{pmatrix} \vb{r_1} \\ \vb{r_2} \end{pmatrix}`},
  {tool:"analyticka", ask:R`The line through $A$ and $B$: the direction vector is $\overrightarrow{AB}$. Drag the points and read the parametric equations.`,
   take:R`the same line has many parametric forms: any point of it as $P_0$, any non-zero multiple of $\vec r$ as direction.`,
   cfg:{typ:"priamka", en:true, on:{vektory:true}}},
  {ex:R`Write the line through $A(1, 2)$ and $B(4, -1)$ in parametric form. Does $(7, -4)$ lie on it? Find its equation $y = ax + b$.`,
   steps:[
     ["Direction.", R`\vec r = \overrightarrow{AB} = (3, -3)`],
     ["Parametric form.", R`x = 1 + 3t,\quad y = 2 - 3t`],
     [R`Point $(7, -4)$: from $x$, $t = 2$; check $y$.`, R`y = 2 - 6 = -4\ \checkmark`],
     [R`Eliminate $t$: $t = \frac{x - 1}{3}$.`, R`y = 2 - (x - 1) = -x + 3`]
   ],
   res:R`$x = 1 + 3t$, $y = 2 - 3t$; $(7, -4)$ lies on it ($t = 2$); $y = -x + 3$.`},
  {tool:"analyticka", kind:"uloha", ask:R`$A$ is fixed. Drag $B$ so that the direction vector of the line is $\vec r = (2, 1)$.`,
   hint:"B = A + (2, 1).",
   goal:(P, st) => !!A(st) && !!A(st).u && A(st).u[0] === 2 && A(st).u[1] === 1,
   cfg:{typ:"priamka", en:true, fixed:["A"], on:{vektory:true}}},
  {ex:R`Find the intersection of $l: x = 1 + 2t,\ y = 3 - t$ and $m: x = 4 + s,\ y = 1 + s$.`,
   steps:[
     ["Equal coordinates (different parameters!).", R`1 + 2t = 4 + s,\quad 3 - t = 1 + s`],
     ["Subtract the equations.", R`-2 + 3t = 3 \Rightarrow t = \tfrac{5}{3},\ s = \tfrac{1}{3}`],
     ["Point.", R`x = 1 + \tfrac{10}{3} = \tfrac{13}{3},\quad y = 3 - \tfrac{5}{3} = \tfrac{4}{3}`]
   ],
   res:R`$\left(\frac{13}{3}, \frac{4}{3}\right)$.`},
  {warn:R`Two lines need **two different** parameters ($t$ and $s$). Using the same letter forces both points to be at the same "time", and you miss the intersection.`}
],

"Parametric circle":[
  R`A point moving round a circle has, at angle $t$, the coordinates $\cos t$ and $\sin t$ times the radius, shifted by the centre. As $t$ runs from 0 to $2\pi$, the point goes once round anticlockwise.`,
  {def:"Parametric circle", tex:R`x = \va{a} + \vd{r}\cos t \qquad y = \vb{b} + \vd{r}\sin t \qquad (x - \va{a})^2 + (y - \vb{b})^2 = \vd{r}^2`},
  {tool:"graf", ask:R`The circle $x = a + r\cos t$, $y = b + r\sin t$ and the point for the parameter value $u$. Change $u$, then the centre and radius.`,
   take:R`$u$ moves the point round the circle starting at the right ($u = 0$), anticlockwise; $a$ and $b$ move the centre, $r$ the size.`,
   cfg:{params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}, b:{v:0, min:-3, max:3, step:.5, color:"b"}, r:{v:2, min:.5, max:4, step:.5, color:"d"}, u:{v:1, min:0, max:6.2, step:.1, color:"c", note:"parameter t"}},
     fns:[], view:[-6, 5, 6, -5],
     show:[{curve:["a + r*cos(t)", "b + r*sin(t)"], t:[0, "2pi"], color:"d"}, {pt:["a", "b"], color:"a"}, {pt:["a + r*cos(u)", "b + r*sin(u)"], color:"c"}]}},
  {ex:R`The curve $x = 2 + 3\cos t$, $y = -1 + 3\sin t$. Find its usual equation and the point for $t = \frac{\pi}{2}$.`,
   steps:[
     ["Isolate cos and sin.", R`\cos t = \frac{x - 2}{3},\quad \sin t = \frac{y + 1}{3}`],
     ["Use cos² + sin² = 1.", R`(x - 2)^2 + (y + 1)^2 = 9`],
     [R`$t = \frac{\pi}{2}$: $\cos = 0$, $\sin = 1$.`, R`(2, 2)`]
   ],
   res:R`Circle with centre $(2, -1)$ and radius 3; the point $(2, 2)$ is its top.`},
  {tool:"graf", kind:"uloha", ask:R`Set $a$, $b$ and $r$ so that the parametric curve is the circle $(x - 1)^2 + (y + 2)^2 = 4$.`,
   hint:"Centre (1, −2), radius √4 = 2.",
   goal:P => P.a === 1 && P.b === -2 && P.r === 2,
   cfg:{params:{a:{v:0, min:-3, max:3, step:.5, color:"a"}, b:{v:0, min:-3, max:3, step:.5, color:"b"}, r:{v:3, min:.5, max:4, step:.5, color:"d"}},
     fns:[], view:[-6, 5, 6, -5], show:[{curve:["a + r*cos(t)", "b + r*sin(t)"], t:[0, "2pi"], color:"d"}, {pt:["a", "b"], color:"a"}]}},
  {warn:R`In the parametric form the radius multiplies $\cos t$ and $\sin t$; in the equation it is squared: $r = 3$ gives $= 9$ on the right side.`}
]

  }
};
})();

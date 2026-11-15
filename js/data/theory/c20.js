/* Projection of a vector (Danish Matematik A) */
(() => {
const A = st => st.h && st.h.an;
const HIDE = ["sucet", "rozdiel", "kolmy", "plocha", "nasobok"];

THEORY.c20 = {
  mins:20,
  brief:[
    R`The projection of $\vec a$ on $\vec b$ is the "shadow" of $\vec a$ on the line of $\vec b$: $\vec a_b = \frac{\vec a \cdot \vec b}{|\vec b|^2}\,\vec b$.`,
    R`Its length is $|\vec a_b| = \frac{|\vec a \cdot \vec b|}{|\vec b|}$.`,
    R`$\vec a \cdot \vec b > 0$: the projection points along $\vec b$; $< 0$: against it; $= 0$: it is the zero vector.`,
    R`Distance from a point to a line = length of the projection on a normal vector.`
  ],
  subs:{

"Projection formula":[
  R`Shine light perpendicular to the line of $\vec b$: the shadow of $\vec a$ on that line is the **projection** $\vec a_b$. It is a multiple of $\vec b$, and the dot product tells how long it is.`,
  {def:"Projection of a on b", tex:R`\vec a_b = \frac{\vec a \cdot \vec b}{|\vec b|^2}\,\vec b \qquad |\vec a_b| = \frac{|\vec a \cdot \vec b|}{|\vec b|}`},
  {tool:"analyticka", ask:R`The projection of $\vec u$ on the direction of $\vec v$. Drag the ends of both vectors.`,
   take:R`the projection lies on the line of $\vec v$; the dashed line from the tip of $\vec u$ meets that line at a right angle. If $\vec u \perp \vec v$, the shadow is a single point.`,
   cfg:{typ:"vektory", en:true, on:{priemet:true, uhol:true}, hide:HIDE}},
  {ex:R`Find the projection of $\vec a = (4, 1)$ on $\vec b = (1, 3)$ and its length.`,
   steps:[
     ["Dot product and squared length.", R`\vec a \cdot \vec b = 4 + 3 = 7,\quad |\vec b|^2 = 1 + 9 = 10`],
     ["Projection.", R`\vec a_b = \tfrac{7}{10}(1, 3) = (0{,}7;\ 2{,}1)`],
     ["Length.", R`|\vec a_b| = \frac{7}{\sqrt{10}} \approx 2{,}21`]
   ],
   res:R`$\vec a_b = (0{,}7;\ 2{,}1)$, length $\approx 2{,}21$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Drag the end of $\vec u$ so that its projection on $\vec v = (1, 3)$ is exactly $\vec v$ itself.`,
   hint:"The factor u·v / |v|² must be 1, so u·v = 10, e.g. u = (4, 2) or (−2, 4).",
   take:R`all such $\vec u$ end on the line through the tip of $\vec v$ perpendicular to $\vec v$.`,
   goal:(P, st) => !!A(st) && Math.abs(A(st).dot - A(st).lv * A(st).lv) < 1e-9,
   cfg:{typ:"vektory", en:true, on:{priemet:true}, hide:HIDE.concat(["uhol"]), pts:{U:[4, 1], V:[1, 3]}, fixed:["V"]}},
  {warn:R`Divide by $|\vec b|^2$ for the vector, but by $|\vec b|$ for the length. Mixing them up gives a vector of the wrong length.`}
],

"Using projections in geometry":[
  R`Projections answer "how far in a given direction". The distance from a point $P$ to a line is the length of the projection of $\overrightarrow{AP}$ ($A$ on the line) on a **normal** vector of the line; the projection on the **direction** vector gives the foot of the perpendicular.`,
  {def:"Distance from a point to a line", tex:R`d(P, l) = \frac{|\vec n \cdot \overrightarrow{AP}|}{|\vec n|} \qquad \text{foot: } F = A + \frac{\overrightarrow{AP} \cdot \vec r}{|\vec r|^2}\,\vec r`,
   note:"A is a point on the line, r its direction vector, n a normal vector (n = r̂)."},
  {ex:R`The line $l$ goes through $A(1, 1)$ with direction $\vec r = (3, -1)$. Find the distance from $P(5, 4)$ to $l$ and the foot of the perpendicular.`,
   steps:[
     [R`$\overrightarrow{AP} = (4, 3)$, normal $\vec n = \hat r = (1, 3)$.`, R`\vec n \cdot \overrightarrow{AP} = 4 + 9 = 13`],
     ["Distance.", R`d = \frac{13}{\sqrt{10}} \approx 4{,}11`],
     ["Projection on r.", R`\frac{\overrightarrow{AP} \cdot \vec r}{|\vec r|^2} = \frac{12 - 3}{10} = 0{,}9`],
     ["Foot.", R`F = (1, 1) + 0{,}9 \cdot (3, -1) = (3{,}7;\ 0{,}1)`]
   ],
   res:R`$d \approx 4{,}11$, foot $F(3{,}7;\ 0{,}1)$. Check: $|PF| = \sqrt{1{,}3^2 + 3{,}9^2} \approx 4{,}11$.`},
  {tool:"analyticka", ask:R`The line through $A(1, 1)$ and $B(4, 0)$ (direction $(3, -1)$) and the point $C(5, 4)$. Compare the distance with the example, then drag $C$.`,
   take:R`the tool gets the same $\frac{13}{\sqrt{10}} \approx 4{,}11$. Points on the line have distance 0.`,
   cfg:{typ:"priamka", en:true, pts:{A:[1, 1], B:[4, 0], C:[5, 4]}, on:{vzdialenost:true, vektory:true}}},
  {ex:R`Triangle $A(0, 0)$, $B(6, 0)$, $C(2, 4)$. Find the height from $C$ by projection and the area.`,
   steps:[
     [R`Base $AB$, direction $(6, 0)$, normal $(0, 6)$. $\overrightarrow{AC} = (2, 4)$.`, R`h = \frac{|(0, 6) \cdot (2, 4)|}{6} = \frac{24}{6} = 4`],
     ["Area.", R`\tfrac{1}{2} \cdot 6 \cdot 4 = 12`]
   ],
   res:R`Height 4, area 12 (the same as $\frac{1}{2}|\det(\overrightarrow{AB}, \overrightarrow{AC})| = \frac{1}{2} \cdot 24$).`},
  {warn:R`Project on the **normal** vector for a distance, not on the direction vector: the projection on the direction gives how far along the line you go, not how far from it.`}
]

  }
};
})();

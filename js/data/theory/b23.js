/* Vzdialenosť bodu od priamky, obsah trojuholníka z vrcholov */
/* TOOL-TODO: subtopic without any tool: "Vzdialenosť rovnobežných priamok". Rework when the tool exists (see CLAUDE.md). */
(() => {

THEORY.b23 = {
  mins:25,
  brief:[
    R`Vzdialenosť bodu $M\,[x_0;\ y_0]$ od priamky $ax + by + c = 0$: $d = \dfrac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}$.`,
    R`Rovnobežné priamky $ax + by + c_1 = 0$, $ax + by + c_2 = 0$: $d = \dfrac{|c_1 - c_2|}{\sqrt{a^2 + b^2}}$.`,
    R`Obsah trojuholníka: $S = \frac{1}{2}\left|u_1 v_2 - u_2 v_1\right|$, kde $\vec{u} = \vec{AB}$, $\vec{v} = \vec{AC}$.`
  ],
  subs:{

"Vzdialenosť bodu od priamky":[
  R`Vzdialenosť bodu od priamky je dĺžka **kolmice** z bodu na priamku. Netreba hľadať pätu kolmice, stačí dosadiť bod do všeobecnej rovnice a vydeliť dĺžkou normálového vektora.`,
  {def:"Vzdialenosť bodu od priamky", tex:R`d(M, p) = \frac{|a x_0 + b y_0 + c|}{\sqrt{a^2 + b^2}}`},
  {tool:"analyticka", ask:R`Ťahaj bod $C$. Kedy je jeho vzdialenosť od priamky nulová?`,
   take:R`keď bod leží na priamke: vtedy $ax_0 + by_0 + c = 0$. Čím ďalej od priamky, tým väčší čitateľ.`,
   cfg:{typ:"priamka", on:{vzdialenost:true}}},
  {ex:R`Vypočítaj vzdialenosť bodu $M\,[2;\ -1]$ od priamky $3x + 4y + 8 = 0$.`,
   steps:[
     ["Dosaď bod.", R`|3 \cdot 2 + 4 \cdot (-1) + 8| = |10| = 10`],
     ["Vydeľ dĺžkou normálového vektora.", R`d = \frac{10}{\sqrt{9 + 16}} = \frac{10}{5} = 2`]
   ],
   res:"$d = 2$"},
  {ex:R`Aký polomer má kružnica so stredom $S\,[1;\ 1]$, ktorá sa dotýka priamky $x - y + 4 = 0$?`,
   steps:[["Polomer je vzdialenosť stredu od dotyčnice.", R`r = \frac{|1 - 1 + 4|}{\sqrt{2}} = \frac{4}{\sqrt{2}} = 2\sqrt{2}`]],
   res:R`$r = 2\sqrt{2}$`},
  {tool:"analyticka", kind:"uloha", ask:R`Body $A$ a $B$ sú pevné. Presuň bod $C$ tak, aby ležal na priamke $AB$ (vzdialenosť 0) a nebol zhodný s $A$ ani $B$.`,
   hint:R`Priamka prechádza bodmi $[-4;\ -1]$ a $[4;\ 3]$, smer $(2;\ 1)$. Skús napríklad $[0;\ 1]$.`,
   goal:P => (P.Bx - P.Ax) * (P.Cy - P.Ay) - (P.By - P.Ay) * (P.Cx - P.Ax) === 0 && !(P.Cx === P.Ax && P.Cy === P.Ay) && !(P.Cx === P.Bx && P.Cy === P.By),
   cfg:{typ:"priamka", fixed:["A", "B"], on:{vzdialenost:true}}},
  {warn:R`Nezabudni na absolútnu hodnotu, vzdialenosť nemôže byť záporná. A rovnica musí byť vo **všeobecnom** tvare ($= 0$), zo smernicového ju najprv preveď.`}
],

"Vzdialenosť rovnobežných priamok":[
  R`Rovnobežné priamky majú všade rovnakú vzdialenosť. Stačí zobrať ľubovoľný bod jednej priamky a zmerať jeho vzdialenosť od druhej. Ak majú rovnice rovnaké $a$, $b$, existuje aj priamy vzorec.`,
  {def:"Vzdialenosť rovnobežiek", tex:R`ax + by + c_1 = 0,\ ax + by + c_2 = 0:\qquad d = \frac{|c_1 - c_2|}{\sqrt{a^2 + b^2}}`},
  {ex:R`Vypočítaj vzdialenosť priamok $p: 3x - 4y + 2 = 0$ a $q: 6x - 8y - 16 = 0$.`,
   steps:[
     [R`Druhú vydeľ dvoma, aby mali rovnaké $a$, $b$.`, R`q: 3x - 4y - 8 = 0`],
     ["Vzorec.", R`d = \frac{|2 - (-8)|}{\sqrt{9 + 16}} = \frac{10}{5} = 2`]
   ],
   res:"$d = 2$"},
  {warn:R`Vzorec s $|c_1 - c_2|$ platí len vtedy, keď majú obe rovnice **rovnaké** koeficienty $a$, $b$. Pri $6x - 8y - 16 = 0$ ich najprv uprav.`}
],

"Obsah trojuholníka z vrcholov":[
  R`Ak poznáš súradnice vrcholov, obsah vypočítaš bez výšky. Vektory $\vec{u} = \vec{AB}$ a $\vec{v} = \vec{AC}$ určujú rovnobežník s obsahom $|u_1 v_2 - u_2 v_1|$. Trojuholník je jeho polovica.`,
  {def:"Obsah z vrcholov", tex:R`S = \frac{1}{2}\left|u_1 v_2 - u_2 v_1\right|,\qquad \vec{u} = B - A,\ \vec{v} = C - A`},
  {tool:"analyticka", ask:R`Ťahaj vrcholy trojuholníka. Kedy je obsah nulový?`,
   take:R`keď vrcholy ležia na jednej priamke: vektory $\vec{AB}$ a $\vec{AC}$ sú vtedy rovnobežné a determinant je 0.`,
   cfg:{typ:"obsah"}},
  {ex:R`Vypočítaj obsah trojuholníka $A\,[1;\ 1]$, $B\,[5;\ 2]$, $C\,[2;\ 6]$.`,
   steps:[
     ["Vektory.", R`\vec{u} = (4;\ 1),\quad \vec{v} = (1;\ 5)`],
     ["Determinant.", R`4 \cdot 5 - 1 \cdot 1 = 19`],
     ["Polovica.", R`S = \frac{19}{2} = 9{,}5`]
   ],
   res:R`$S = 9{,}5$`},
  {tool:"analyticka", kind:"uloha", ask:R`Body $A$ a $B$ sú pevné. Presuň vrchol $C$ tak, aby mal trojuholník obsah 9.`,
   hint:R`$\vec{AB} = (9;\ 1)$. Potrebuješ $|9 v_2 - v_1| = 18$ pre $\vec{v} = \vec{AC}$, napríklad $\vec{v} = (0;\ 2)$, teda $C = [-4;\ 0]$.`,
   goal:P => Math.abs((P.Bx - P.Ax) * (P.Cy - P.Ay) - (P.By - P.Ay) * (P.Cx - P.Ax)) === 18,
   cfg:{typ:"obsah", fixed:["A", "B"]}},
  {warn:R`Bez absolútnej hodnoty môže vyjsť záporné číslo (závisí od poradia vrcholov). Obsah je vždy kladný.`}
]

  }
};
})();

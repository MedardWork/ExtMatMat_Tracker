/* Vzájomná poloha priamok, priesečník, uhol dvoch priamok */
(() => {

THEORY.b22 = {
  mins:25,
  brief:[
    R`Rovnobežné: smerové (normálové) vektory sú násobkami. Totožné: navyše majú spoločný bod. Inak rôznobežné.`,
    R`Priesečník: vyrieš sústavu rovníc oboch priamok ([[a14]]).`,
    R`Uhol priamok: $\cos\varphi = \dfrac{|\vec{u} \cdot \vec{v}|}{|\vec{u}|\,|\vec{v}|}$, $\varphi \in \langle 0^\circ;\ 90^\circ \rangle$. Kolmé priamky: $\vec{n}_1 \cdot \vec{n}_2 = 0$.`
  ],
  subs:{

"Rovnobežné, totožné, rôznobežné":[
  R`Dve priamky v rovine môžu byť **rôznobežné** (majú jeden spoločný bod), **rovnobežné rôzne** (žiadny) alebo **totožné** (všetky). Rozhodnú o tom smerové vektory a jeden bod.`,
  {def:"Vzájomná poloha", tex:R`p: a_1x + b_1y + c_1 = 0,\quad q: a_2x + b_2y + c_2 = 0\\[4pt] \frac{a_1}{a_2} = \frac{b_1}{b_2}:\ \text{rovnobežné (pri rovnakom pomere aj } c\text{: totožné)}`},
  {tool:"analyticka", ask:R`Ťahaj body $A$, $B$, $C$, $D$. Kedy sú priamky $AB$ a $CD$ rovnobežné? Kedy kolmé?`,
   take:R`rovnobežné, keď sú vektory $\vec{AB}$ a $\vec{CD}$ násobkami. Kolmé, keď je ich skalárny súčin nula.`,
   cfg:{typ:"priamky"}},
  {ex:R`Urči vzájomnú polohu priamok: a) $2x - y + 3 = 0$ a $4x - 2y + 1 = 0$; b) $x + 2y - 4 = 0$ a $2x + 4y - 8 = 0$; c) $x - y = 0$ a $x + y - 2 = 0$.`,
   steps:[
     [R`a) Pomery $\frac{2}{4} = \frac{-1}{-2}$, ale $\frac{3}{1}$ je iný.`, R`\text{rovnobežné rôzne}`],
     [R`b) Druhá je dvojnásobok prvej.`, R`\text{totožné}`],
     [R`c) $\frac{1}{1} \neq \frac{-1}{1}$.`, R`\text{rôznobežné, dokonca kolmé: } (1;\ -1) \cdot (1;\ 1) = 0`]
   ],
   res:"a) rovnobežné, b) totožné, c) rôznobežné kolmé."},
  {tool:"analyticka", kind:"uloha", ask:R`Body $A$, $B$ sú pevné. Presuň $C$ a $D$ tak, aby bola priamka $CD$ rovnobežná s $AB$ a rôzna od nej.`,
   hint:R`$\vec{CD}$ musí byť násobkom $\vec{AB} = (8;\ 4)$, teda napríklad $(2;\ 1)$.`,
   goal:P => { const ux = P.Bx - P.Ax, uy = P.By - P.Ay, vx = P.Dx - P.Cx, vy = P.Dy - P.Cy;
     return (vx || vy) && ux * vy - uy * vx === 0 && ux * (P.Cy - P.Ay) - uy * (P.Cx - P.Ax) !== 0; },
   cfg:{typ:"priamky", fixed:["A", "B"]}},
  {warn:R`Pri rovnobežnosti porovnávaj **pomery** koeficientov, nie koeficienty samotné. $2x - y + 3 = 0$ a $4x - 2y + 1 = 0$ sú rovnobežné, hoci vyzerajú rôzne.`}
],

"Priesečník priamok":[
  R`Priesečník leží na oboch priamkach, takže jeho súradnice spĺňajú obe rovnice naraz. Stačí vyriešiť sústavu. Ak má sústava nekonečne veľa riešení, priamky sú totožné, ak žiadne, rovnobežné.`,
  {ex:R`Nájdi priesečník priamok $p: 2x - y - 1 = 0$ a $q: x + y - 5 = 0$.`,
   steps:[
     ["Sčítaj rovnice.", R`3x - 6 = 0 \;\Rightarrow\; x = 2`],
     ["Dosaď.", R`y = 5 - 2 = 3`]
   ],
   res:R`$P\,[2;\ 3]$`},
  {ex:R`Nájdi priesečník priamky $x = 1 + 2t$, $y = 3 - t$ s priamkou $x + y - 6 = 0$.`,
   steps:[
     ["Dosaď parametrické vyjadrenie do všeobecnej rovnice.", R`(1 + 2t) + (3 - t) - 6 = 0 \;\Rightarrow\; t = 2`],
     ["Bod pre $t = 2$.", R`[5;\ 1]`]
   ],
   res:R`$[5;\ 1]$`},
  {tool:"analyticka", kind:"uloha", ask:R`Presuň body $C$ a $D$ tak, aby sa priamky pretínali v bode $[1;\ 1]$.`,
   hint:R`Priamka $AB$ prechádza bodom $[1;\ 1]$. Stačí, aby ním prechádzala aj $CD$, napríklad $C$ alebo $D$ priamo v $[1;\ 1]$.`,
   goal:P => { const s = (x1, y1, x2, y2) => (x2 - x1) * (1 - y1) - (y2 - y1) * (1 - x1);
     return s(P.Ax, P.Ay, P.Bx, P.By) === 0 && s(P.Cx, P.Cy, P.Dx, P.Dy) === 0 && (P.Dx - P.Cx) * (P.By - P.Ay) - (P.Dy - P.Cy) * (P.Bx - P.Ax) !== 0; },
   cfg:{typ:"priamky", fixed:["A", "B"]}},
  {warn:R`Po výpočte over priesečník v **oboch** rovniciach. Chyba vo výpočte sa tak hneď ukáže.`}
],

"Uhol dvoch priamok":[
  R`Dve rôznobežné priamky zvierajú dva uhly, $\varphi$ a $180^\circ - \varphi$. Za uhol priamok sa berie menší z nich, preto sa v čitateli používa absolútna hodnota skalárneho súčinu.`,
  {def:"Uhol priamok", tex:R`\cos\varphi = \frac{|\vec{u} \cdot \vec{v}|}{|\vec{u}|\,|\vec{v}|},\qquad \varphi \in \langle 0^\circ;\ 90^\circ \rangle`, note:"Rovnako dobre poslúžia normálové vektory. Pri smerniciach: $\\tg\\varphi = \\left|\\frac{k_1 - k_2}{1 + k_1 k_2}\\right|$."},
  {tool:"analyticka", ask:R`Ťahaj body a sleduj uhol priamok. Môže byť väčší než $90^\circ$?`,
   take:R`nie. Ak vektory zvierajú tupý uhol, uhol priamok je jeho doplnok do $180^\circ$.`,
   cfg:{typ:"priamky"}},
  {ex:R`Vypočítaj uhol priamok $p: x - 2y + 1 = 0$ a $q: 3x + y - 4 = 0$.`,
   steps:[
     ["Normálové vektory.", R`\vec{n}_1 = (1;\ -2),\quad \vec{n}_2 = (3;\ 1)`],
     ["Kosínus.", R`\cos\varphi = \frac{|3 - 2|}{\sqrt{5}\sqrt{10}} = \frac{1}{\sqrt{50}} \doteq 0{,}141`],
     ["Uhol.", R`\varphi \doteq 81{,}87^\circ`]
   ],
   res:R`$\varphi \doteq 81{,}87^\circ$`},
  {ex:R`Pre aké $a$ je priamka $ax + 2y - 1 = 0$ kolmá na $x - 3y + 2 = 0$?`,
   steps:[["Normálové vektory kolmé.", R`(a;\ 2) \cdot (1;\ -3) = a - 6 = 0 \;\Rightarrow\; a = 6`]],
   res:R`$a = 6$`},
  {warn:R`Bez absolútnej hodnoty môže vyjsť tupý uhol. Pri priamkach ho nahraď doplnkom do $180^\circ$.`}
]

  }
};
})();

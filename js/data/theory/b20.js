/* Vektory: súradnice, súčet, násobok, dĺžka, skalárny súčin, uhol */
(() => {

THEORY.b20 = {
  mins:35,
  brief:[
    R`$\vec{AB} = B - A = (x_B - x_A;\ y_B - y_A)$.`,
    R`$\vec{u} + \vec{v} = (u_1 + v_1;\ u_2 + v_2)$, $k\vec{u} = (k u_1;\ k u_2)$.`,
    R`$|\vec{u}| = \sqrt{u_1^2 + u_2^2}$.`,
    R`$\vec{u} \cdot \vec{v} = u_1 v_1 + u_2 v_2$; kolmé $\Leftrightarrow$ $\vec{u} \cdot \vec{v} = 0$; $\cos\varphi = \dfrac{\vec{u} \cdot \vec{v}}{|\vec{u}|\,|\vec{v}|}$.`
  ],
  subs:{

"Súradnice vektora":[
  R`**Vektor** je posunutie: hovorí, o koľko sa treba posunúť vodorovne a o koľko zvislo. Všetky orientované úsečky s rovnakým posunutím predstavujú ten istý vektor, nezáleží, kde začínajú.`,
  {def:"Vektor z dvoch bodov", tex:R`\vec{AB} = B - A = (x_B - x_A;\ y_B - y_A)`},
  {tool:"analyticka", ask:R`Ťahaj body $A$ a $B$. Ako sa mení vektor $\vec{AB}$? Čo sa stane, keď posunieš oba body o rovnaký kus?`,
   take:R`vektor závisí len od rozdielu súradníc. Pri posunutí oboch bodov o to isté sa nezmení.`,
   cfg:{typ:"body"}},
  {ex:R`Urči vektor $\vec{AB}$ a $\vec{BA}$ pre $A\,[2;\ -1]$, $B\,[5;\ 3]$. Potom nájdi bod $C$, ak $\vec{AC} = (-4;\ 2)$.`,
   steps:[
     ["Koniec mínus začiatok.", R`\vec{AB} = (3;\ 4),\quad \vec{BA} = (-3;\ -4)`],
     ["Bod je začiatok plus vektor.", R`C = A + \vec{AC} = [-2;\ 1]`]
   ],
   res:R`$(3;\ 4)$, $(-3;\ -4)$ a $C\,[-2;\ 1]$.`},
  {warn:R`$\vec{AB}$ je **koniec mínus začiatok**: $B - A$. Opačné poradie dá opačný vektor $\vec{BA} = -\vec{AB}$.`}
],

"Súčet a násobok vektora":[
  R`Vektory sa sčítavajú po zložkách. Geometricky: druhý vektor priložíš na koniec prvého (pravidlo trojuholníka), alebo oba z jedného bodu a doplníš rovnobežník. Násobok $k\vec{u}$ je $k$-krát dlhší, pre $k < 0$ opačne orientovaný.`,
  {def:"Súčet a násobok", tex:R`\vec{u} + \vec{v} = (u_1 + v_1;\ u_2 + v_2),\qquad k\vec{u} = (k u_1;\ k u_2)`},
  {tool:"analyticka", ask:R`Ťahaj konce vektorov $\vec{u}$ a $\vec{v}$. Kde leží koniec súčtu?`,
   take:R`súčet je uhlopriečka rovnobežníka, ktorý vektory určujú. Zložky sa jednoducho sčítajú.`,
   cfg:{typ:"vektory", on:{sucet:true}, toggles:["rozdiel"]}},
  {ex:R`$\vec{u} = (2;\ -1)$, $\vec{v} = (-3;\ 4)$. Vypočítaj $\vec{u} + \vec{v}$, $3\vec{u}$ a $2\vec{u} - \vec{v}$.`,
   steps:[
     ["Po zložkách.", R`\vec{u} + \vec{v} = (-1;\ 3)`],
     ["Násobok.", R`3\vec{u} = (6;\ -3)`],
     ["Kombinácia.", R`2\vec{u} - \vec{v} = (4 + 3;\ -2 - 4) = (7;\ -6)`]
   ],
   res:R`$(-1;\ 3)$, $(6;\ -3)$, $(7;\ -6)$.`},
  {ex:R`Body $A\,[1;\ 1]$, $B\,[5;\ 2]$, $C\,[6;\ 5]$ sú tri vrcholy rovnobežníka $ABCD$. Nájdi $D$.`,
   steps:[["V rovnobežníku $\\vec{AD} = \\vec{BC}$.", R`D = A + \vec{BC} = [1;\ 1] + (1;\ 3) = [2;\ 4]`]],
   res:R`$D\,[2;\ 4]$`},
  {tool:"analyticka", kind:"uloha", ask:R`Vektor $\vec{u}$ je $(4;\ 1)$. Nastav $\vec{v}$ tak, aby bol súčet $\vec{u} + \vec{v} = (2;\ 5)$.`,
   hint:R`$\vec{v} = (2;\ 5) - (4;\ 1)$.`,
   goal:P => P.Vx === -2 && P.Vy === 4,
   cfg:{typ:"vektory", fixed:["U"], on:{sucet:true}}},
  {warn:R`Vektory sa nesčítavajú dĺžkami: $|\vec{u} + \vec{v}| \leq |\vec{u}| + |\vec{v}|$, rovnosť len pri rovnako orientovaných vektoroch.`}
],

"Dĺžka vektora":[
  R`**Dĺžka** (veľkosť) vektora je dĺžka každej jeho orientovanej úsečky. Počíta sa Pytagorovou vetou zo zložiek. Vektor dĺžky 1 je **jednotkový**.`,
  {def:"Dĺžka vektora", tex:R`|\vec{u}| = \sqrt{u_1^2 + u_2^2}`},
  {ex:R`Vypočítaj dĺžku vektora $\vec{u} = (6;\ -8)$ a nájdi jednotkový vektor s rovnakým smerom.`,
   steps:[
     ["Dĺžka.", R`|\vec{u}| = \sqrt{36 + 64} = 10`],
     ["Vydeľ dĺžkou.", R`\vec{u}_0 = \tfrac{1}{10}(6;\ -8) = (0{,}6;\ -0{,}8)`]
   ],
   res:R`$10$ a $(0{,}6;\ -0{,}8)$.`},
  {ex:R`Pre aké $t$ má vektor $(t;\ 3)$ dĺžku 5?`,
   steps:[["Rovnica.", R`t^2 + 9 = 25 \;\Rightarrow\; t = \pm 4`]],
   res:R`$t = 4$ alebo $t = -4$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Nastav vektor $\vec{u}$ tak, aby mal dĺžku 5 a obe zložky nenulové.`,
   hint:R`Zložky 3 a 4 (so znamienkami v ľubovoľnom poradí).`,
   goal:P => Math.abs(Math.hypot(P.Ux, P.Uy) - 5) < 1e-9 && P.Ux !== 0 && P.Uy !== 0,
   cfg:{typ:"vektory", fixed:["V"]}},
  {warn:R`$|(6;\ -8)| \neq 6 - 8$. Dĺžka je vždy nezáporná a zložky sa umocňujú.`}
],

"Skalárny súčin a kolmosť":[
  R`**Skalárny súčin** dvoch vektorov je číslo (nie vektor). Je kladný, keď vektory zvierajú ostrý uhol, záporný pri tupom a nulový presne vtedy, keď sú kolmé.`,
  {def:"Skalárny súčin", tex:R`\vec{u} \cdot \vec{v} = u_1 v_1 + u_2 v_2 = |\vec{u}|\,|\vec{v}|\cos\varphi`, note:R`Kolmý vektor k $(a;\ b)$ je napríklad $(-b;\ a)$.`},
  {tool:"analyticka", ask:R`Ťahaj vektory a sleduj skalárny súčin. Kedy je nulový, kladný a záporný?`,
   take:R`nulový pri kolmých vektoroch, kladný pri ostrom uhle, záporný pri tupom.`,
   cfg:{typ:"vektory", on:{uhol:true}, toggles:["kolmy"]}},
  {ex:R`Sú vektory $(3;\ -2)$ a $(4;\ 6)$ kolmé? Nájdi $t$, pre ktoré je $(t;\ 2) \perp (3;\ -6)$.`,
   steps:[
     ["Skalárny súčin.", R`3 \cdot 4 + (-2) \cdot 6 = 0 \;\Rightarrow\; \text{kolmé}`],
     ["Podmienka kolmosti.", R`3t - 12 = 0 \;\Rightarrow\; t = 4`]
   ],
   res:R`Áno, sú kolmé; $t = 4$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Vektor $\vec{u}$ je $(4;\ 1)$. Nastav $\vec{v}$ tak, aby bol na $\vec{u}$ kolmý a nenulový.`,
   hint:R`$4v_1 + v_2 = 0$, napríklad $(-1;\ 4)$ alebo $(1;\ -4)$.`,
   goal:P => 4 * P.Vx + P.Vy === 0 && (P.Vx !== 0 || P.Vy !== 0),
   cfg:{typ:"vektory", fixed:["U"], on:{uhol:true}}},
  {warn:R`Skalárny súčin je číslo. Zápis $(3;\ -2) \cdot (4;\ 6) = (12;\ -12)$ je chybný, správne $12 - 12 = 0$.`}
],

"Uhol dvoch vektorov":[
  R`Zo vzťahu $\vec{u} \cdot \vec{v} = |\vec{u}|\,|\vec{v}|\cos\varphi$ sa dá vypočítať uhol medzi vektormi. Uhol vektorov je z intervalu $\langle 0^\circ;\ 180^\circ \rangle$.`,
  {def:"Uhol vektorov", tex:R`\cos\varphi = \frac{\vec{u} \cdot \vec{v}}{|\vec{u}|\,|\vec{v}|}`},
  {tool:"analyticka", ask:R`Ťahaj vektory a sleduj uhol. Aký je, keď majú vektory rovnaký a keď opačný smer?`,
   take:R`rovnaký smer $0^\circ$ ($\cos = 1$), opačný $180^\circ$ ($\cos = -1$). Uhol vektorov nikdy nepresiahne $180^\circ$.`,
   cfg:{typ:"vektory", on:{uhol:true}}},
  {ex:R`Vypočítaj uhol vektorov $\vec{u} = (1;\ 2)$ a $\vec{v} = (3;\ 1)$.`,
   steps:[
     ["Skalárny súčin a dĺžky.", R`\vec{u} \cdot \vec{v} = 5,\quad |\vec{u}| = \sqrt{5},\quad |\vec{v}| = \sqrt{10}`],
     ["Kosínus.", R`\cos\varphi = \frac{5}{\sqrt{50}} = \frac{\sqrt{2}}{2} \;\Rightarrow\; \varphi = 45^\circ`]
   ],
   res:R`$45^\circ$`},
  {ex:R`Aký uhol zvierajú vektory $(2;\ 0)$ a $(-1;\ \sqrt{3})$?`,
   steps:[["Kosínus.", R`\cos\varphi = \frac{-2}{2 \cdot 2} = -\frac{1}{2} \;\Rightarrow\; \varphi = 120^\circ`]],
   res:R`$120^\circ$`},
  {warn:R`Uhol **vektorov** môže byť tupý, uhol **priamok** nie ([[b22]]). Pri priamkach sa berie absolútna hodnota skalárneho súčinu.`}
]

  }
};
})();

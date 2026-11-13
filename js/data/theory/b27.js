/* Rovnoľahlosť a podobné zobrazenia */
(() => {
const L = v => ({v, lock:true});

THEORY.b27 = {
  mins:25,
  brief:[
    R`Rovnoľahlosť so stredom $S$ a koeficientom $k$: $X' = S + k(X - S)$, teda $\vec{SX'} = k\,\vec{SX}$.`,
    R`$|k| > 1$ zväčšuje, $|k| < 1$ zmenšuje, $k < 0$ obraz je na opačnej strane od $S$.`,
    R`Podobné zobrazenie = rovnoľahlosť (prípadne zložená so zhodným zobrazením). Dĺžky sa násobia $|k|$, obsahy $k^2$.`
  ],
  subs:{

"Rovnoľahlosť":[
  R`**Rovnoľahlosť** (homotétia) so stredom $S$ a koeficientom $k$ zobrazí bod $X$ na bod $X'$ na priamke $SX$, pričom $|SX'| = |k| \cdot |SX|$. Obraz úsečky je rovnobežná úsečka, $k$-krát dlhšia.`,
  {def:"Rovnoľahlosť", tex:R`\vec{SX'} = \vb{k}\,\vec{SX},\qquad X' = S + \vb{k}(X - S)`},
  {tool:"zobrazenia", ask:R`Meň koeficient $\vb{k}$ a ťahaj stred $S$. Čo sa stane pri $k = 1$, $k = -1$ a pri záporných $k$?`,
   take:R`pri $k = 1$ sa nič nezmení, pri $k = -1$ je to stredová súmernosť. Záporné $k$ dáva obraz na opačnej strane od $S$, otočený o $180^\circ$.`,
   cfg:{typ:"rovnolahlost"}},
  {ex:R`Nájdi obraz bodu $A\,[3;\ 1]$ v rovnoľahlosti so stredom $S\,[1;\ -1]$ a koeficientom $k = 2$, potom $k = -\frac{1}{2}$.`,
   steps:[
     ["Vektor $\\vec{SA}$.", R`\vec{SA} = (2;\ 2)`],
     ["$k = 2$.", R`A' = S + 2(2;\ 2) = [5;\ 3]`],
     ["$k = -\\frac{1}{2}$.", R`A'' = S - \tfrac{1}{2}(2;\ 2) = [0;\ -2]`]
   ],
   res:R`$[5;\ 3]$ a $[0;\ -2]$.`},
  {tool:"zobrazenia", kind:"uloha", ask:R`Stred je v počiatku. Nastav koeficient $\vb{k}$ tak, aby sa bod $[1;\ 0]$ zobrazil do bodu $[-2;\ 0]$.`,
   hint:R`$\vec{SX'} = k\,\vec{SX}$: $(-2;\ 0) = k(1;\ 0)$.`,
   goal:P => P.k === -2,
   cfg:{typ:"rovnolahlost", sx:L(0), sy:L(0), k:{v:1}}},
  {warn:R`Vektor sa násobí **od stredu** $S$, nie od počiatku: $X' = S + k(X - S)$. Zápis $X' = kX$ platí len pre stred v počiatku.`}
],

"Podobné zobrazenie":[
  R`**Podobné zobrazenie** s koeficientom $k > 0$ zväčší všetky vzdialenosti $k$-krát. Každé podobné zobrazenie sa dá zložiť z rovnoľahlosti a zhodného zobrazenia ([[b26]]). Útvar a jeho obraz sú **podobné** ([[a32]]): majú rovnaké uhly a strany v pomere $k$.`,
  {def:"Podobné zobrazenie", tex:R`|X'Y'| = k \cdot |XY|\ \text{ pre všetky body } X, Y`},
  {tool:"podobnost", ask:R`Trojuholník a jeho obraz v podobnom zobrazení. Meň $\vd{k}$. Ktoré veličiny sa nemenia?`,
   take:R`uhly sa nemenia, dĺžky sa násobia $k$. Tvar ostáva, mení sa len veľkosť.`,
   cfg:{typ:"trojuholniky"}},
  {ex:R`Trojuholník so stranami 3, 4, 5 sa zobrazí v podobnosti s $k = 2{,}5$. Aké sú strany obrazu? Je pravouhlý?`,
   steps:[
     ["Strany sa násobia $k$.", R`7{,}5,\quad 10,\quad 12{,}5`],
     ["Uhly sa zachovajú, aj pravý.", R`7{,}5^2 + 10^2 = 156{,}25 = 12{,}5^2`]
   ],
   res:"Strany $7{,}5$, $10$, $12{,}5$, obraz je pravouhlý."},
  {warn:R`Podobné zobrazenie zachováva uhly, ale nie dĺžky. Preto nie je zhodné (okrem $k = 1$).`}
],

"Zmena dĺžok a obsahov":[
  R`Pri podobnosti s koeficientom $k$ sa každá dĺžka (strana, obvod, výška, polomer) násobí $|k|$, obsah $k^2$ a objem telesa $|k|^3$. To platí pre ľubovoľný útvar, nielen trojuholník.`,
  {def:"Obvod, obsah, objem", tex:R`o' = |k|\,o,\qquad S' = k^2 S,\qquad V' = |k|^3 V`},
  {tool:"podobnost", ask:R`Zapni porovnanie obsahov. Ako sa mení obsah pri $k = 0{,}5$?`,
   take:R`obsah klesne na štvrtinu, $0{,}5^2 = 0{,}25$. Do pôvodného trojuholníka sa zmestia štyri zmenšené.`,
   cfg:{typ:"trojuholniky", k:{v:.5}, on:{obsah:true}}},
  {ex:R`Útvar s obsahom 12 cm² a obvodom 16 cm zobrazíme v rovnoľahlosti s $k = -3$. Aký je obsah a obvod obrazu?`,
   steps:[
     ["Obvod.", R`o' = 3 \cdot 16 = 48`],
     ["Obsah.", R`S' = 9 \cdot 12 = 108`]
   ],
   res:R`Obvod 48 cm, obsah 108 cm².`},
  {ex:R`Model auta v mierke $1 : 18$ má objem nádrže $0{,}01$ litra. Aký objem má skutočná nádrž?`,
   steps:[["Objem sa zväčší $18^3$-krát.", R`0{,}01 \cdot 18^3 = 0{,}01 \cdot 5\,832 = 58{,}32`]],
   res:R`Približne 58 litrov.`},
  {tool:"podobnost", kind:"uloha", ask:R`Nastav koeficient $\vd{k}$ tak, aby mal obraz deväťkrát väčší obsah.`,
   hint:R`$k^2 = 9$.`,
   goal:P => P.k === 3,
   cfg:{typ:"trojuholniky", k:{v:1}, on:{obsah:true}}},
  {warn:R`Pri zápornom $k$ sa dĺžky násobia $|k|$, nie $k$: dĺžka nemôže byť záporná. Obsah je $k^2 S$, teda tiež kladný.`}
]

  }
};
})();

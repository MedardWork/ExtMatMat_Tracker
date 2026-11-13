/* Zhodné zobrazenia: osová a stredová súmernosť, posunutie, otočenie */
(() => {
const L = v => ({v, lock:true});

THEORY.b26 = {
  mins:30,
  brief:[
    R`Zhodné zobrazenie zachováva dĺžky aj uhly: útvar a jeho obraz sú zhodné.`,
    R`Osová súmernosť podľa osi $o$: os je osou úsečky $XX'$. Podľa osi $x$: $[x;\ y] \to [x;\ -y]$, podľa osi $y$: $[x;\ y] \to [-x;\ y]$.`,
    R`Stredová súmernosť so stredom $S$: $S$ je stred úsečky $XX'$, teda $X' = 2S - X$.`,
    R`Posunutie o vektor $\vec{u}$: $X' = X + \vec{u}$. Otočenie okolo $S$ o uhol $\alpha$: $|SX'| = |SX|$, $|\angle XSX'| = \alpha$.`
  ],
  subs:{

"Osová súmernosť":[
  R`Pri **osovej súmernosti** sa každý bod zrkadlí cez priamku $o$ (os). Spojnica bodu a jeho obrazu je na os kolmá a os ju rozpoľuje. Body na osi sa nehýbu. Obraz má opačnú orientáciu (ako v zrkadle).`,
  {def:"Osová súmernosť", tex:R`o:\ \text{os úsečky } XX',\qquad \text{os } x: [x;\ y] \to [x;\ -y],\quad \text{os } y: [x;\ y] \to [-x;\ y]`},
  {tool:"zobrazenia", ask:R`Ťahaj stred osi a meň jej sklon. Ktoré body sa nepohnú?`,
   take:R`body ležiace na osi. Ostatné sa preklopia na druhú stranu do rovnakej vzdialenosti.`,
   cfg:{typ:"osova"}},
  {ex:R`Nájdi obraz bodu $A\,[3;\ 2]$ v osovej súmernosti podľa osi $x$, podľa osi $y$ a podľa priamky $y = x$.`,
   steps:[
     ["Os $x$: mení sa znamienko $y$.", R`[3;\ -2]`],
     ["Os $y$: mení sa znamienko $x$.", R`[-3;\ 2]`],
     ["Priamka $y = x$: súradnice sa vymenia.", R`[2;\ 3]`]
   ],
   res:R`$[3;\ -2]$, $[-3;\ 2]$, $[2;\ 3]$.`},
  {tool:"zobrazenia", kind:"uloha", ask:R`Os je zvislá. Posuň ju tak, aby sa bod $A\,[1;\ 1]$ zobrazil do bodu $[5;\ 1]$.`,
   hint:R`Os prechádza stredom úsečky medzi $[1;\ 1]$ a $[5;\ 1]$.`,
   goal:P => P.sx === 3,
   cfg:{typ:"osova", uhol:L(90), sx:{v:0}, sy:L(0)}},
  {warn:R`Pri osovej súmernosti sa mení **orientácia**: ak sú vrcholy $A$, $B$, $C$ proti smeru hodinových ručičiek, obrazy sú v smere. Preto ju nedosiahneš posunutím ani otočením.`}
],

"Stredová súmernosť":[
  R`Pri **stredovej súmernosti** so stredom $S$ ide každý bod „cez $S$“ na opačnú stranu do rovnakej vzdialenosti. $S$ je stredom každej úsečky $XX'$. Je to to isté ako otočenie o $180^\circ$.`,
  {def:"Stredová súmernosť", tex:R`X' = 2S - X,\qquad \text{stred } O: [x;\ y] \to [-x;\ -y]`},
  {tool:"zobrazenia", ask:R`Ťahaj stred $S$. Ako sa pohybuje obraz?`,
   take:R`obraz sa hýbe dvakrát rýchlejšie ako stred, lebo $X' = 2S - X$. Útvar sa otočí o $180^\circ$, orientácia sa zachová.`,
   cfg:{typ:"stredova"}},
  {ex:R`Nájdi obraz bodu $A\,[1;\ 4]$ v stredovej súmernosti so stredom $S\,[3;\ 1]$.`,
   steps:[["Dosaď.", R`A' = 2[3;\ 1] - [1;\ 4] = [5;\ -2]`]],
   res:R`$A'\,[5;\ -2]$`},
  {tool:"zobrazenia", kind:"uloha", ask:R`Posuň stred $S$ tak, aby sa bod $A\,[1;\ 1]$ zobrazil do bodu $[-1;\ 3]$.`,
   hint:R`Stred je v polovici medzi bodom a obrazom.`,
   goal:P => P.sx === 0 && P.sy === 2,
   cfg:{typ:"stredova", sx:{v:3}, sy:{v:-1}}},
  {warn:R`Stredová súmernosť nie je osová. Stredovú súmernosť podľa počiatku dostaneš až zložením dvoch osových súmerností, podľa osi $x$ a potom podľa osi $y$.`}
],

"Posunutie":[
  R`**Posunutie** (translácia) o vektor $\vec{u}$ posunie všetky body o ten istý vektor. Útvar sa nepreklopí ani neotočí, len sa presunie.`,
  {def:"Posunutie", tex:R`X' = X + \vec{u} = [x + u_1;\ y + u_2]`},
  {tool:"zobrazenia", ask:R`Meň zložky vektora posunutia. Ako súvisia vektory $\vec{AA'}$, $\vec{BB'}$, $\vec{CC'}$?`,
   take:R`všetky sú rovnaké, rovné $\vec{u}$. Úsečky $AA'$, $BB'$, $CC'$ sú rovnobežné a rovnako dlhé.`,
   cfg:{typ:"posunutie"}},
  {ex:R`Trojuholník $A\,[1;\ 1]$, $B\,[4;\ 1]$, $C\,[2;\ 3]$ posuň o $\vec{u} = (-5;\ 2)$.`,
   steps:[["Pripočítaj vektor ku každému vrcholu.", R`A' = [-4;\ 3],\quad B' = [-1;\ 3],\quad C' = [-3;\ 5]`]],
   res:R`$A'\,[-4;\ 3]$, $B'\,[-1;\ 3]$, $C'\,[-3;\ 5]$.`},
  {tool:"zobrazenia", kind:"uloha", ask:R`Nastav vektor posunutia tak, aby sa bod $A\,[1;\ 1]$ dostal do $[-3;\ 2]$.`,
   hint:R`$\vec{u} = A' - A$.`,
   goal:P => P.ux === -4 && P.uy === 1,
   cfg:{typ:"posunutie", ux:{v:2}, uy:{v:-2}}},
  {warn:R`Vektor posunutia je **obraz mínus vzor**: $\vec{u} = A' - A$. Opačné poradie posunie útvar opačným smerom.`}
],

"Otočenie":[
  R`**Otočenie** (rotácia) okolo stredu $S$ o uhol $\alpha$ zachová vzdialenosť každého bodu od $S$ a otočí ho o $\alpha$. Kladný uhol znamená proti smeru hodinových ručičiek.`,
  {def:"Otočenie okolo počiatku", tex:R`90^\circ: [x;\ y] \to [-y;\ x],\qquad 180^\circ: [x;\ y] \to [-x;\ -y],\qquad -90^\circ: [x;\ y] \to [y;\ -x]`},
  {tool:"zobrazenia", ask:R`Meň uhol otočenia a ťahaj stred. Ktorý bod sa pri otočení nehýbe?`,
   take:R`iba stred otočenia. Pri $180^\circ$ je otočenie rovnaké ako stredová súmernosť.`,
   cfg:{typ:"otocenie"}},
  {ex:R`Otoč bod $A\,[3;\ 1]$ okolo počiatku o $90^\circ$ a o $-90^\circ$.`,
   steps:[
     ["$+90^\\circ$.", R`[-1;\ 3]`],
     ["$-90^\\circ$.", R`[1;\ -3]`]
   ],
   res:R`$[-1;\ 3]$ a $[1;\ -3]$. Kontrola: $|OA| = |OA'| = \sqrt{10}$.`},
  {tool:"zobrazenia", kind:"uloha", ask:R`Stred otočenia je v počiatku. Nastav uhol tak, aby sa bod $A\,[1;\ 1]$ zobrazil do $[-1;\ 1]$.`,
   hint:R`Bod sa posunie z I. do II. kvadrantu, štvrť otáčky proti smeru hodinových ručičiek.`,
   goal:P => P.uhol === 90,
   cfg:{typ:"otocenie", sx:L(0), sy:L(0), uhol:{v:30}}},
  {warn:R`Smer otáčania: kladný uhol je **proti** smeru hodinových ručičiek, ako v goniometrii ([[b8]]).`}
]

  }
};
})();

/* Vzdialenosti v priestore: bod–priamka, bod–rovina, rovnobežné roviny */
/* TOOL-TODO: point–plane distance shown only through the section BDE; kocka has no point–plane distance, and "Vzdialenosť rovnobežných rovín" has no picture. Add the visual when the tool or option exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});
const cube = st => st.h && st.h.cube;

THEORY.b34 = {
  mins:25,
  brief:[
    R`Vzdialenosť je vždy dĺžka **kolmice**: najkratšia spojnica bodu s priamkou alebo rovinou.`,
    R`Bod–priamka: nájdi pätu kolmice v rovine, ktorá obsahuje bod aj priamku, a počítaj v trojuholníku.`,
    R`Bod–rovina: nájdi priamku kolmú na rovinu cez bod. Často pomôže objem ihlana: $v = \frac{3V}{S_p}$.`,
    R`Rovnobežné roviny: vzdialenosť ľubovoľného bodu jednej od druhej.`
  ],
  subs:{

"Vzdialenosť bodu od priamky":[
  R`Bod a priamka určujú rovinu. V nej spusti z bodu kolmicu na priamku, jej dĺžka je vzdialenosť. V kocke stačí často nájsť pravouhlý trojuholník v stene alebo v reze.`,
  {def:"Vzdialenosť bodu od priamky", tex:R`d(X, p) = |XP|,\quad P \in p,\ XP \perp p`},
  {tool:"kocka", kind:"uloha", ask:R`Bod $X$ je vo vrchole $G$. Posúvaj bod $Y$ po hrane $AB$ a nájdi polohu, v ktorej je vzdialenosť najmenšia. To je vzdialenosť $G$ od priamky $AB$.`,
   hint:R`Kolmica z $G$ na $AB$ dopadne do bodu $B$, lebo $BG$ leží v stene kolmej na $AB$.`,
   goal:P => P.t2 === 1,
   cfg:{typ:"vzdialenost", body:[["CG", 1], ["AB", .25]], lock:["t1"], klikaj:false}},
  {ex:R`Kocka s hranou 4. Vypočítaj vzdialenosť vrcholu $G$ od priamky $AB$ a vrcholu $E$ od priamky $BD$.`,
   steps:[
     [R`$BG \perp AB$ (stena $BCGF$ je kolmá na $AB$).`, R`d(G, AB) = |BG| = 4\sqrt{2} \doteq 5{,}66`],
     [R`Trojuholník $BDE$ je rovnostranný so stranou $4\sqrt{2}$, kolmica z $E$ je jeho výška.`, R`d(E, BD) = \frac{4\sqrt{2} \cdot \sqrt{3}}{2} = 2\sqrt{6} \doteq 4{,}90`]
   ],
   res:R`$4\sqrt{2}$ a $2\sqrt{6}$.`},
  {warn:R`Vzdialenosť nie je spojnica s ľubovoľným bodom priamky, ale s pätou **kolmice**. Spojnica so vzdialenejším bodom je dlhšia.`}
],

"Vzdialenosť bodu od roviny":[
  R`Vzdialenosť bodu od roviny je dĺžka kolmice z bodu na rovinu. Ak sa kolmica ťažko hľadá, pomôže objem: rovina rezu spolu s bodom tvorí ihlan, a jeho výška je presne hľadaná vzdialenosť.`,
  {def:"Vzdialenosť cez objem", tex:R`V = \frac{1}{3} S_p \cdot v \;\Rightarrow\; v = \frac{3V}{S_p}`},
  {ex:R`Kocka s hranou 4. Vypočítaj vzdialenosť vrcholu $A$ od roviny $BDE$.`,
   steps:[
     [R`Ihlan $ABDE$ s podstavou $ABD$ a výškou $|AE| = 4$.`, R`V = \tfrac{1}{3} \cdot \tfrac{4 \cdot 4}{2} \cdot 4 = \tfrac{32}{3}`],
     [R`Ten istý ihlan s podstavou $BDE$, rovnostranný trojuholník so stranou $4\sqrt{2}$.`, R`S_{BDE} = \frac{32\sqrt{3}}{4} = 8\sqrt{3}`],
     ["Výška.", R`v = \frac{3 \cdot \frac{32}{3}}{8\sqrt{3}} = \frac{4}{\sqrt{3}} = \frac{4\sqrt{3}}{3} \doteq 2{,}31`]
   ],
   res:R`$\dfrac{4\sqrt{3}}{3} \doteq 2{,}31$, teda tretina telesovej uhlopriečky.`},
  {tool:"kocka", ask:R`Rez rovinou $BDE$. Telesová uhlopriečka $AG$ je na túto rovinu kolmá. Sleduj, akú časť uhlopriečky odreže.`,
   take:R`rovina $BDE$ pretne $AG$ v tretine od $A$. Vzdialenosť $A$ od roviny je $\frac{a\sqrt{3}}{3}$.`,
   cfg:{typ:"rez", body:[["AB", 1], ["DA", 0], ["AE", 1]], klikaj:false, lock:["t1", "t2", "t3"]}},
  {warn:R`Pri metóde objemu dávaj pozor, aby išlo o **ten istý** ihlan, len inak postavený. Objem sa nemení, mení sa podstava aj výška.`}
],

"Vzdialenosť rovnobežných rovín":[
  R`Rovnobežné roviny majú všade rovnakú vzdialenosť. Stačí zobrať jeden bod prvej roviny a vypočítať jeho vzdialenosť od druhej.`,
  {ex:R`Kocka s hranou 4. Vypočítaj vzdialenosť rovín $BDE$ a $CFH$.`,
   steps:[
     [R`Obe roviny sú kolmé na uhlopriečku $AG$ a rozdelia ju na tretiny.`, R`|AG| = 4\sqrt{3}`],
     ["Vzdialenosť je stredná tretina.", R`d = \frac{4\sqrt{3}}{3} \doteq 2{,}31`]
   ],
   res:R`$\dfrac{4\sqrt{3}}{3}$`},
  {ex:R`Kváder $6 \times 4 \times 3$. Aká je vzdialenosť roviny podstavy $ABCD$ od roviny $EFGH$?`,
   steps:[["Roviny sú rovnobežné, kolmica je hrana $AE$.", R`d = |AE| = 3`]],
   res:"$3$"},
  {warn:R`Vzdialenosť rovín nemá zmysel pre rôznobežné roviny, tie sa pretínajú a ich vzdialenosť je 0.`}
]

  }
};
})();

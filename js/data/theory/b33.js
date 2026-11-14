/* Uhly v priestore: dve priamky, priamka a rovina, dve roviny */
/* TOOL-TODO: subtopic "Uhol dvoch rovín" has no picture; kocka typ "uhol" measures only the angle of two lines. Add the visual when the tool or option exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});

THEORY.b33 = {
  mins:25,
  brief:[
    R`Uhol mimobežiek: jednu posuň rovnobežne, aby sa pretli, a meraj uhol rôznobežiek. Je z $\langle 0^\circ;\ 90^\circ \rangle$.`,
    R`Uhol priamky a roviny: uhol priamky a jej kolmého priemetu do roviny.`,
    R`Uhol dvoch rovín: v rovine kolmej na ich priesečnicu veď v každej rovine kolmicu na priesečnicu, meraj uhol týchto kolmíc.`,
    R`Výpočet: nájdi pravouhlý trojuholník a použi $\tg$, $\sin$, $\cos$ ([[b16]]), prípadne kosínusovú vetu ([[b17]]).`
  ],
  subs:{

"Uhol dvoch priamok (aj mimobežiek)":[
  R`Rôznobežky zvierajú uhol v rovine, ktorú určujú. **Mimobežky** sa nepretínajú a neležia v jednej rovine. Ich uhol je uhol rôznobežiek, ktoré vzniknú, keď jednu z nich posunieš rovnobežne do bodu na druhej.`,
  {def:"Uhol mimobežiek", tex:R`\angle(p, q) = \angle(p', q),\quad p' \parallel p,\ p' \cap q \neq \emptyset,\qquad \varphi \in \langle 0^\circ;\ 90^\circ \rangle`},
  {tool:"kocka", ask:R`Uhol pri vrchole $X$ medzi priamkami $XY$ a $XZ$. Posúvaj body a sleduj uhol.`,
   take:R`uhol sa počíta z trojuholníka $XYZ$ (napríklad kosínusovou vetou). Pri hranách kocky vychádzajú často $90^\circ$, $45^\circ$, $60^\circ$.`,
   cfg:{typ:"uhol", body:[["AE", 0], ["CG", 1], ["BC", 1]]}},
  {ex:R`V kocke $ABCDEFGH$ urči uhol mimobežiek $AB$ a $EG$ a uhol priamok $BE$ a $BG$.`,
   steps:[
     [R`$AB \parallel EF$, takže uhol je $\angle FEG$ v hornej stene.`, R`45^\circ`],
     [R`$BE$, $BG$, $EG$ sú stenové uhlopriečky, trojuholník $BEG$ je rovnostranný.`, R`60^\circ`]
   ],
   res:R`$45^\circ$ a $60^\circ$.`},
  {warn:R`Mimobežky sa nepretínajú, no uhol majú. A uhol dvoch priamok nie je nikdy tupý: ak vyjde $120^\circ$, uhol priamok je $60^\circ$.`}
],

"Uhol priamky a roviny":[
  R`Priamka, ktorá rovinu pretína, s ňou zviera uhol, ktorý zviera so svojím **kolmým priemetom** do roviny. Priemet dostaneš, keď z jedného bodu priamky spustíš kolmicu na rovinu.`,
  {def:"Uhol priamky a roviny", tex:R`\tg\varphi = \frac{\text{vzdialenosť bodu od roviny}}{\text{vzdialenosť päty kolmice od priesečníka}}`},
  {ex:R`Kocka s hranou $a$. Aký uhol zviera telesová uhlopriečka $AG$ s rovinou podstavy $ABCD$?`,
   steps:[
     [R`Priemet $AG$ do podstavy je $AC$, pretože $G$ leží nad $C$.`, R`|AC| = a\sqrt{2},\quad |CG| = a`],
     ["Pravouhlý trojuholník $ACG$.", R`\tg\varphi = \frac{a}{a\sqrt{2}} = \frac{\sqrt{2}}{2} \;\Rightarrow\; \varphi \doteq 35{,}26^\circ`]
   ],
   res:R`$\varphi \doteq 35{,}26^\circ$`},
  {tool:"kocka", kind:"uloha", ask:R`$X$ je v $A$, $Y$ v $G$. Posuň bod $Z$ po hrane $CG$ tak, aby bol uhol $YXZ$ uhlom priamky $AG$ s rovinou podstavy.`,
   hint:R`Priemet $AG$ do podstavy je $AC$. Bod $Z$ musí byť v $C$.`,
   goal:P => P.t3 === 0,
   cfg:{typ:"uhol", body:[["AE", 0], ["CG", 1], ["CG", .5]], lock:["t1", "t2"], klikaj:false}},
  {warn:R`Uhol priamky a roviny sa nemeria s ľubovoľnou priamkou v rovine, ale práve s **priemetom**. S inými priamkami roviny zviera priamka väčšie uhly.`}
],

"Uhol dvoch rovín":[
  R`Dve rôznobežné roviny sa pretínajú v priamke (**priesečnici**). Ich uhol zmeriaš v rovine kolmej na priesečnicu: v každej rovine veď kolmicu na priesečnicu z toho istého bodu. Uhol týchto kolmíc je uhol rovín.`,
  {def:"Uhol rovín", tex:R`\angle(\rho, \sigma) = \angle(p, q),\quad p \subset \rho,\ q \subset \sigma,\ p, q \perp \rho \cap \sigma`},
  {ex:R`Kocka $ABCDEFGH$. Aký uhol zviera rovina $ABGH$ s rovinou podstavy $ABCD$?`,
   steps:[
     [R`Priesečnica je $AB$. V rovine $BCGF$ (kolmej na $AB$) sú kolmice $BC$ a $BG$.`, R`\angle(ABGH, ABCD) = \angle CBG`],
     ["Stenová uhlopriečka zviera s hranou $45^\\circ$.", R`45^\circ`]
   ],
   res:R`$45^\circ$`},
  {ex:R`Kocka s hranou 4. Aký uhol zviera rovina $BDE$ s podstavou $ABCD$?`,
   steps:[
     [R`Priesečnica $BD$. Kolmica z $A$ na $BD$ dopadne do stredu $S$ uhlopriečky podstavy, kolmica z $E$ tiež do $S$.`, R`|AS| = 2\sqrt{2},\quad |AE| = 4`],
     ["Pravouhlý trojuholník $ASE$.", R`\tg\varphi = \frac{4}{2\sqrt{2}} = \sqrt{2} \;\Rightarrow\; \varphi \doteq 54{,}74^\circ`]
   ],
   res:R`$\varphi \doteq 54{,}74^\circ$`},
  {warn:R`Kolmice na priesečnicu musia vychádzať z **toho istého** bodu priesečnice a ležať každá v inej rovine. Uhol dvoch ľubovoľných priamok z rovín nie je uhol rovín.`}
]

  }
};
})();

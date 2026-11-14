/* Množiny bodov danej vlastnosti a ich analytické vyjadrenie */
(() => {
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
/* perpendicular bisector of AB drawn as a long segment, X = M + t·n on it */
const MX = "(Ax+Bx)/2", MY = "(Ay+By)/2", NX = "(Ay-By)", NY = "(Bx-Ax)";
const bis = [[`${MX}-3*${NX}`, `${MY}-3*${NY}`], [`${MX}+3*${NX}`, `${MY}+3*${NY}`]];
const X = [`${MX}+t*${NX}`, `${MY}+t*${NY}`];

THEORY.b25 = {
  mins:25,
  brief:[
    R`Os úsečky $AB$: body rovnako vzdialené od $A$ a $B$. Je to kolmica na $AB$ cez jej stred.`,
    R`Os uhla: body rovnako vzdialené od oboch ramien.`,
    R`Kružnica: body vo vzdialenosti $r$ od $S$. Tálesova kružnica nad $AB$: body $X$, pre ktoré $|\angle AXB| = 90^\circ$ (okrem $A$, $B$).`,
    R`Analyticky: vlastnosť bodu $X\,[x;\ y]$ zapíš ako rovnicu a uprav ju.`
  ],
  subs:{

"Os úsečky a os uhla":[
  R`Množina bodov je súhrn všetkých bodov s nejakou vlastnosťou. Najznámejšia: všetky body, ktoré sú od $A$ a $B$ rovnako ďaleko. Ležia na priamke kolmej na $AB$, ktorá prechádza jej stredom, na **osi úsečky**.`,
  {def:"Os úsečky", tex:R`o_{AB} = \{X;\ |XA| = |XB|\}`},
  {tool:"graf", ask:R`Ťahaj body $A$ a $B$ a posúvaj bod $X$ po osi úsečky. Sú vzdialenosti $|XA|$ a $|XB|$ vždy rovnaké?`,
   take:R`áno, každý bod osi je od $A$ aj $B$ rovnako ďaleko. Bod mimo osi je bližšie k jednému z nich.`,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[],
     points:{A:[-3, -1, {color:"a"}], B:[3, 2, {color:"b"}]},
     params:{t:{v:.5, min:-1.5, max:1.5, step:.1, color:"d", name:"X"}},
     show:[{seg:bis, color:"d"}, {seg:[["Ax", "Ay"], ["Bx", "By"]], color:"soft"}, {pt:X, color:"d", label:"X", at:"r"}, {seg:[X, ["Ax", "Ay"]], color:"a", dash:2}, {seg:[X, ["Bx", "By"]], color:"b", dash:2}],
     out:(P, h) => { const x = (P.Ax + P.Bx) / 2 + P.t * (P.Ay - P.By), y = (P.Ay + P.By) / 2 + P.t * (P.Bx - P.Ax);
       return h.calc(R`|XA| \doteq ${t2(h, Math.hypot(x - P.Ax, y - P.Ay))},\quad |XB| \doteq ${t2(h, Math.hypot(x - P.Bx, y - P.By))}`); }}},
  {def:"Os uhla", tex:R`\text{os uhla } pq = \{X;\ d(X, p) = d(X, q)\}`, note:"Osi uhlov trojuholníka sa pretínajú v strede vpísanej kružnice, osi strán v strede opísanej ([[a28]])."},
  {tool:"graf", kind:"uloha", ask:R`Bod $A$ je pevný. Presuň bod $B$ tak, aby os úsečky $AB$ bola os $y$.`,
   hint:R`$B$ musí byť obrazom $A$ v osovej súmernosti podľa osi $y$.`,
   goal:P => P.Bx === -P.Ax && P.By === P.Ay,
   cfg:{view:[-6, 6, 6, -6], tick:1, fns:[],
     points:{A:[-3, 1, {color:"a", fixed:true}], B:[2, -2, {color:"b"}]},
     show:[{seg:bis, color:"d"}, {seg:[["Ax", "Ay"], ["Bx", "By"]], color:"soft"}]}},
  {warn:R`Os úsečky je **kolmá** na úsečku. Priamka cez stred úsečky v inom smere túto vlastnosť nemá.`}
],

"Kružnica a Tálesova kružnica ako množiny":[
  R`**Kružnica** je množina bodov, ktoré majú od stredu $S$ vzdialenosť $r$. **Tálesova kružnica** nad úsečkou $AB$ je množina vrcholov pravých uhlov nad $AB$ ([[a31]]). Obe sa používajú pri konštrukciách: hľadaný bod leží v prieniku dvoch množín.`,
  {def:"Kružnica a Tálesova kružnica", tex:R`k(S, r) = \{X;\ |SX| = r\},\qquad \{X;\ |\angle AXB| = 90^\circ\} = k\left(S_{AB}, \tfrac{|AB|}{2}\right) - \{A, B\}`},
  {tool:"kruh", ask:R`Ťahaj vrchol $V$ po kružnici nad priemerom. Je uhol pri $V$ stále pravý?`,
   take:R`áno. Všetky vrcholy pravých uhlov nad $AB$ tvoria kružnicu s priemerom $AB$.`,
   cfg:{typ:"uhly", omega:{v:180, lock:true}}},
  {ex:R`Nájdi všetky body $X$ na osi $x$, z ktorých vidno úsečku $A\,[0;\ 4]$, $B\,[6;\ 4]$ pod pravým uhlom.`,
   steps:[
     ["Tálesova kružnica: stred $[3;\\ 4]$, polomer 3.", R`(x - 3)^2 + (y - 4)^2 = 9`],
     [R`Na osi $x$ je $y = 0$.`, R`(x - 3)^2 = 9 - 16 < 0`]
   ],
   res:"Žiadne: kružnica os $x$ nepretína (jej najnižší bod je $[3;\\ 1]$)."},
  {warn:R`Body $A$ a $B$ do množiny vrcholov pravého uhla nepatria, uhol $AAB$ nemá zmysel. Preto sa z Tálesovej kružnice vynechávajú.`}
],

"Analytický zápis množiny bodov":[
  R`Ak je vlastnosť zadaná vzdialenosťami, označ hľadaný bod $X\,[x;\ y]$, vlastnosť zapíš rovnicou a uprav ju. Výsledok prezradí, čo je množina: priamka, kružnica, parabola…`,
  {steps:[
    {t:"Bod", d:R`Označ $X = [x;\ y]$.`},
    {t:"Rovnica", d:R`Vzdialenosti zapíš vzorcami ([[b19]], [[b23]]). Pri odmocninách umocni.`},
    {t:"Rozpoznaj", d:"Lineárna rovnica je priamka, $(x - m)^2 + (y - n)^2 = r^2$ kružnica, $y = ax^2 + \\ldots$ parabola."}
  ]},
  {ex:R`Nájdi množinu bodov rovnako vzdialených od $A\,[1;\ 2]$ a $B\,[5;\ 4]$.`,
   steps:[
     ["Rovnica.", R`(x - 1)^2 + (y - 2)^2 = (x - 5)^2 + (y - 4)^2`],
     ["Štvorce $x^2$, $y^2$ sa odčítajú.", R`-2x + 1 - 4y + 4 = -10x + 25 - 8y + 16`],
     ["Uprav.", R`8x + 4y - 36 = 0 \;\Rightarrow\; 2x + y - 9 = 0`]
   ],
   res:R`Priamka $2x + y - 9 = 0$, os úsečky $AB$ (prechádza stredom $[3;\ 3]$).`},
  {ex:R`Nájdi množinu bodov, ktoré sú od $O\,[0;\ 0]$ dvakrát ďalej než od $B\,[3;\ 0]$.`,
   steps:[
     ["Rovnica, umocnená.", R`x^2 + y^2 = 4\left((x - 3)^2 + y^2\right)`],
     ["Uprav.", R`3x^2 + 3y^2 - 24x + 36 = 0 \;\Rightarrow\; x^2 + y^2 - 8x + 12 = 0`],
     ["Doplň na štvorec.", R`(x - 4)^2 + y^2 = 4`]
   ],
   res:R`Kružnica so stredom $[4;\ 0]$ a polomerom 2.`},
  {ex:R`Nájdi množinu bodov rovnako vzdialených od osi $x$ a od bodu $F\,[0;\ 2]$.`,
   steps:[
     [R`Vzdialenosť od osi $x$ je $|y|$.`, R`|y| = \sqrt{x^2 + (y - 2)^2}`],
     ["Umocni a uprav.", R`y^2 = x^2 + y^2 - 4y + 4 \;\Rightarrow\; y = \tfrac{1}{4}x^2 + 1`]
   ],
   res:R`Parabola $y = \frac{1}{4}x^2 + 1$.`},
  {warn:R`Pri umocňovaní rovnice so vzdialenosťami nezabudni, že obe strany sú nezáporné, takže umocnenie je tu ekvivalentná úprava. Pri iných typoch (napríklad rozdiel vzdialeností) to neplatí.`}
]

  }
};
})();

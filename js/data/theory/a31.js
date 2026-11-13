/* Tálesova veta a Tálesova kružnica */
(() => {
const L = v => ({v, lock:true});

THEORY.a31 = {
  mins:20,
  brief:[
    R`Tálesova veta: každý uhol nad priemerom kružnice (s vrcholom na kružnici) je pravý.`,
    R`Obvodový uhol je polovica stredového uhla nad tým istým oblúkom.`,
    R`Stred kružnice opísanej pravouhlému trojuholníku je v strede prepony, $r = \frac{c}{2}$.`,
    R`Body, z ktorých vidno úsečku $AB$ pod pravým uhlom, ležia na Tálesovej kružnici nad $AB$.`
  ],
  subs:{

"Tálesova veta":[
  R`Nakresli kružnicu, jej priemer $AB$ a ľubovoľný ďalší bod $C$ na kružnici. Uhol $ACB$ je vždy pravý, nech je $C$ kdekoľvek. Je to špeciálny prípad všeobecnejšej vety: obvodový uhol je polovicou stredového.`,
  {def:"Tálesova veta", tex:R`AB \text{ priemer},\ C \in k \;\Rightarrow\; |\angle ACB| = 90^\circ`},
  {tool:"kruh", ask:R`Stredový uhol je $180^\circ$ (priemer). Ťahaj vrchol $V$ po kružnici. Mení sa obvodový uhol?`,
   take:R`nie, je stále $90^\circ$. Pravouhlý trojuholník má vždy vrchol pravého uhla na kružnici nad preponou.`,
   cfg:{typ:"uhly", omega:L(180)}},
  {def:"Stredový a obvodový uhol", tex:R`\text{obvodový} = \frac{\text{stredový}}{2}`},
  {tool:"kruh", ask:R`Meň stredový uhol $\va{\omega}$ a ťahaj vrchol $V$. Ako súvisí obvodový uhol so stredovým?`,
   take:R`obvodový uhol je vždy polovicou stredového a nezávisí od polohy $V$ na väčšom oblúku. Tálesova veta je prípad $\omega = 180^\circ$.`,
   cfg:{typ:"uhly", toggles:["druhy"]}},
  {ex:R`Body $A$, $B$, $C$ ležia na kružnici, $AB$ je priemer. $|AC| = 6$ cm, $|BC| = 8$ cm. Aký polomer má kružnica?`,
   steps:[
     ["Podľa Tálesovej vety je uhol pri $C$ pravý.", R`|AB| = \sqrt{6^2 + 8^2} = 10`],
     ["Polomer je polovica priemeru.", R`r = 5`]
   ],
   res:"$r = 5$ cm."},
  {tool:"kruh", kind:"uloha", ask:R`Nastav stredový uhol $\va{\omega}$ tak, aby bol obvodový uhol pravý.`,
   hint:R`Obvodový je polovica stredového.`,
   goal:P => P.omega === 180,
   cfg:{typ:"uhly", omega:{v:100}}},
  {warn:R`Uhol je pravý len vtedy, keď je $AB$ **priemer**, teda úsečka prechádza stredom. Nad obyčajnou tetivou je obvodový uhol iný než $90^\circ$.`}
],

"Tálesova kružnica a jej využitie":[
  R`Tálesova veta platí aj naopak: všetky body, z ktorých vidno úsečku $AB$ pod pravým uhlom, ležia na kružnici s priemerom $AB$ (okrem bodov $A$, $B$). Táto **Tálesova kružnica** pomáha pri konštrukciách aj výpočtoch.`,
  {def:"Kružnica opísaná pravouhlému trojuholníku", tex:R`S = \text{stred prepony},\qquad r = \frac{c}{2}`},
  R`Najznámejšie využitie: **dotyčnice** z bodu $X$ ku kružnici. Dotyčnica je kolmá na polomer v bode dotyku, takže bod dotyku vidno z $S$ a $X$ pod pravým uhlom. Leží preto na Tálesovej kružnici nad $SX$.`,
  {tool:"kruh", ask:R`Meň vzdialenosť $\va{d}$ bodu od stredu. Ako dlhá je dotyčnica?`,
   take:R`úsečka dotyčnice, polomer a $SX$ tvoria pravouhlý trojuholník. Dĺžka dotyčnice je $\sqrt{d^2 - r^2}$, pre $d < r$ dotyčnica neexistuje.`,
   cfg:{typ:"dotycnica", r:L(3)}},
  {ex:R`Bod $X$ je od stredu kružnice s polomerom 5 cm vzdialený 13 cm. Aká dlhá je dotyčnica z $X$?`,
   steps:[
     ["Pravý uhol je v bode dotyku, prepona je $SX$.", R`t = \sqrt{13^2 - 5^2}`],
     ["Vypočítaj.", R`t = \sqrt{169 - 25} = 12`]
   ],
   res:"$12$ cm."},
  {ex:R`Pravouhlý trojuholník má odvesny 9 a 12. Aký polomer má kružnica jemu opísaná?`,
   steps:[
     ["Prepona.", R`c = \sqrt{81 + 144} = 15`],
     ["Stred je v strede prepony.", R`r = \frac{15}{2} = 7{,}5`]
   ],
   res:R`$r = 7{,}5$`},
  {tool:"kruh", kind:"uloha", ask:R`Kružnica má polomer 3. Nastav vzdialenosť $\va{d}$ bodu od stredu tak, aby mala dotyčnica dĺžku 4.`,
   hint:R`$d^2 = 3^2 + 4^2$.`,
   goal:P => P.d === 5,
   cfg:{typ:"dotycnica", r:L(3), d:{v:8}}},
  {warn:R`Stred kružnice opísanej pravouhlému trojuholníku nie je ťažisko ani priesečník výšok, ale stred **prepony**. Pre iné trojuholníky to neplatí.`}
]

  }
};
})();

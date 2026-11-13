/* Stredový a obvodový uhol */
(() => {
const L = v => ({v, lock:true});

THEORY.b18 = {
  mins:20,
  brief:[
    R`Stredový uhol má vrchol v strede kružnice, obvodový na kružnici. Oba sú „nad“ tým istým oblúkom.`,
    R`Obvodový uhol je polovica stredového uhla nad tým istým oblúkom.`,
    R`Všetky obvodové uhly nad tou istou tetivou na tej istej strane sú zhodné. Na opačných stranách sa dopĺňajú do $180^\circ$.`
  ],
  subs:{

"Stredový a obvodový uhol":[
  R`Tetiva $AB$ rozdelí kružnicu na dva oblúky. **Stredový uhol** $\omega = \angle ASB$ má vrchol v strede $S$. **Obvodový uhol** $\angle AVB$ má vrchol $V$ na kružnici, na opačnom oblúku. Oba sú uhly „nad“ menším oblúkom $AB$.`,
  {cards:[
    {t:"Stredový uhol", d:"Vrchol v strede kružnice, ramená prechádzajú bodmi $A$, $B$."},
    {t:"Obvodový uhol", d:"Vrchol na kružnici (mimo oblúka $AB$), ramená prechádzajú bodmi $A$, $B$."}
  ]},
  {tool:"kruh", ask:R`Meň stredový uhol $\va{\omega}$. Ako sa mení obvodový uhol pri vrchole $V$?`,
   take:R`obvodový uhol rastie spolu so stredovým, vždy je presne polovičný.`,
   cfg:{typ:"uhly", lock:["fi"]}},
  {ex:R`Stredový uhol nad tetivou $AB$ má $110^\circ$. Aký je obvodový uhol nad tou istou tetivou?`,
   steps:[["Polovica stredového.", R`\frac{110^\circ}{2} = 55^\circ`]],
   res:R`$55^\circ$`},
  {warn:R`Obvodový uhol musí mať vrchol **na** kružnici. Uhol s vrcholom vnútri alebo zvonku kružnice touto vetou nepočítaj.`}
],

"Vzťah medzi nimi":[
  R`Prečo je obvodový uhol polovicou stredového? Spojnica $VS$ rozdelí obrázok na dva rovnoramenné trojuholníky (ramená sú polomery). Vonkajší uhol každého pri $S$ je dvojnásobkom uhla pri $V$. Sčítaním vyjde $\omega = 2 \cdot \angle AVB$.`,
  {def:"Obvodový a stredový uhol", tex:R`|\angle AVB| = \frac{\va{\omega}}{2}`, note:R`Pre $\omega = 180^\circ$ (priemer) je to Tálesova veta ([[a31]]).`},
  {tool:"kruh", ask:R`Nastav stredový uhol cez $180^\circ$ (tetiva zostáva, ale berieme väčší oblúk). Platí vzťah stále?`,
   take:R`áno, aj pre stredový uhol väčší než $180^\circ$ je obvodový uhol jeho polovicou, teda tupý.`,
   cfg:{typ:"uhly", omega:{v:240}}},
  {ex:R`Body $A$, $B$, $C$ ležia na kružnici so stredom $S$, $|\angle ACB| = 35^\circ$. Aký je uhol $\angle ASB$ a uhol $\angle SAB$?`,
   steps:[
     ["Stredový je dvojnásobok obvodového.", R`|\angle ASB| = 70^\circ`],
     [R`Trojuholník $ASB$ je rovnoramenný ($|SA| = |SB| = r$).`, R`|\angle SAB| = \frac{180^\circ - 70^\circ}{2} = 55^\circ`]
   ],
   res:R`$70^\circ$ a $55^\circ$.`},
  {tool:"kruh", kind:"uloha", ask:R`Nastav stredový uhol $\va{\omega}$ tak, aby mal obvodový uhol $40^\circ$.`,
   hint:"Stredový je dvojnásobok.",
   goal:P => P.omega === 80,
   cfg:{typ:"uhly", omega:{v:150}}},
  {warn:R`Stredový je **dvojnásobok** obvodového, nie naopak. Kontrola: pri priemere je stredový $180^\circ$ a obvodový $90^\circ$.`}
],

"Obvodové uhly nad tou istou tetivou":[
  R`Všetky obvodové uhly s vrcholom na tom istom oblúku majú rovnaký stredový uhol, a preto sú zhodné. Vrcholy na opačných oblúkoch patria k stredovým uhlom $\omega$ a $360^\circ - \omega$, ich obvodové uhly majú súčet $180^\circ$.`,
  {def:"Obvodové uhly nad tetivou", tex:R`\text{rovnaký oblúk: zhodné},\qquad \text{opačné oblúky: } \varphi + \varphi' = 180^\circ`},
  {tool:"kruh", ask:R`Zapni druhý vrchol nad tým istým oblúkom a ťahaj vrcholy. Sú uhly stále rovnaké?`,
   take:R`áno, nech sú vrcholy na tom istom oblúku kdekoľvek, obvodové uhly sú zhodné.`,
   cfg:{typ:"uhly", on:{druhy:true}}},
  {ex:R`Štvoruholník $ABCD$ je vpísaný do kružnice, $|\angle A| = 75^\circ$, $|\angle B| = 110^\circ$. Aké sú uhly $C$ a $D$?`,
   steps:[
     [R`$A$ a $C$ sú obvodové uhly nad tetivou $BD$ z opačných strán.`, R`|\angle C| = 180^\circ - 75^\circ = 105^\circ`],
     ["Podobne $B$ a $D$.", R`|\angle D| = 180^\circ - 110^\circ = 70^\circ`]
   ],
   res:R`$105^\circ$ a $70^\circ$. Protiľahlé uhly tetivového štvoruholníka majú súčet $180^\circ$.`},
  {warn:R`Uhly sú zhodné len vtedy, keď sú vrcholy na **rovnakom** oblúku. Na opačných oblúkoch sa dopĺňajú do $180^\circ$.`}
]

  }
};
})();

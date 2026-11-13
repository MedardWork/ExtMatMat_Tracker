/* Uhly a ich dvojice, súhlasné a striedavé uhly */
(() => {
const L = v => ({v, lock:true});

THEORY.a27 = {
  mins:25,
  brief:[
    R`Vrcholové uhly sú zhodné. Susedné uhly majú súčet $180^\circ$.`,
    R`Pri rovnobežkách preťatých priečkou sú súhlasné aj striedavé uhly zhodné.`,
    R`Súčet vnútorných uhlov trojuholníka je $180^\circ$, $n$-uholníka $(n - 2) \cdot 180^\circ$.`
  ],
  subs:{

"Vrcholové a susedné uhly":[
  R`Dve pretínajúce sa priamky vytvoria štyri uhly. Uhly oproti sebe sa volajú **vrcholové**, uhly vedľa seba so spoločným ramenom **susedné**. Susedné uhly spolu tvoria priamy uhol.`,
  {def:"Vrcholové a susedné uhly", tex:R`\text{vrcholové: } \va{\alpha} = \alpha',\qquad \text{susedné: } \va{\alpha} + \vb{\beta} = 180^\circ`},
  {tool:"uhly", ask:R`Meň uhol $\va{\alpha}$. Ako sa mení vrcholový a susedný uhol?`,
   take:R`vrcholový uhol je vždy rovnaký ako $\alpha$, susedný je $180^\circ - \alpha$. Stačí poznať jeden uhol a vieš všetky štyri.`,
   cfg:{on:{vrcholove:true, susedne:true}, lock:["sklon"]}},
  {ex:R`Dve priamky zvierajú uhol $47^\circ$. Aké sú ostatné tri uhly?`,
   steps:[
     ["Vrcholový.", R`47^\circ`],
     ["Dva susedné.", R`180^\circ - 47^\circ = 133^\circ`]
   ],
   res:R`$47^\circ$, $133^\circ$, $47^\circ$, $133^\circ$.`},
  {ex:R`Susedné uhly sú v pomere $2 : 3$. Aké sú veľké?`,
   steps:[
     [R`Spolu $180^\circ$, päť dielov.`, R`180^\circ : 5 = 36^\circ`],
     ["Uhly.", R`2 \cdot 36^\circ = 72^\circ,\quad 3 \cdot 36^\circ = 108^\circ`]
   ],
   res:R`$72^\circ$ a $108^\circ$.`},
  {tool:"uhly", kind:"uloha", ask:R`Nastav $\va{\alpha}$ tak, aby bol susedný uhol dvakrát väčší než $\alpha$.`,
   hint:R`$\alpha + 2\alpha = 180^\circ$.`,
   goal:P => P.alfa === 60,
   cfg:{alfa:{v:40}, on:{susedne:true}, lock:["sklon"]}},
  {warn:R`Susedné uhly sa sčítajú na $180^\circ$, nie na $90^\circ$. Na $90^\circ$ sa dopĺňajú uhly **doplnkové** (napríklad ostré uhly pravouhlého trojuholníka).`}
],

"Súhlasné a striedavé uhly pri rovnobežkách":[
  R`Keď dve rovnobežky pretne tretia priamka (**priečka**), vznikne osem uhlov. **Súhlasné** uhly ležia na rovnakej strane priečky a na rovnakej strane rovnobežiek, **striedavé** na opačných stranách. Pri rovnobežkách sú zhodné.`,
  {def:"Rovnobežky a priečka", tex:R`\text{súhlasné: } \vd{\alpha} = \vd{\alpha'},\qquad \text{striedavé: } \vc{\alpha} = \vc{\alpha''}`, note:"Platí to aj naopak: ak sú súhlasné (alebo striedavé) uhly zhodné, priamky sú rovnobežné."},
  {tool:"uhly", ask:R`Meň uhol priečky $\va{\alpha}$. Ktoré uhly sú vždy rovnaké?`,
   take:R`súhlasné aj striedavé uhly sú stále zhodné. Pri rovnobežkách sú všetky ostré uhly rovnaké a všetky tupé tiež.`,
   cfg:{on:{suhlasne:true, striedave:true}, lock:["sklon"]}},
  {ex:R`Dva striedavé uhly pri rovnobežkách majú veľkosti $3x + 10^\circ$ a $5x - 30^\circ$. Aké sú veľké?`,
   steps:[
     ["Striedavé uhly sú zhodné.", R`3x + 10 = 5x - 30`],
     ["Vyrieš.", R`40 = 2x \;\Rightarrow\; x = 20`],
     ["Dosaď.", R`3 \cdot 20 + 10 = 70^\circ`]
   ],
   res:R`Oba majú $70^\circ$.`},
  {ex:R`Medzi dvoma rovnobežkami je lomená čiara. Pri hornej rovnobežke zviera s ňou uhol $35^\circ$, pri dolnej $50^\circ$. Aký uhol je v zlome?`,
   steps:[
     ["Cez vrchol zlomu veď tretiu rovnobežku. Rozdelí uhol na dve časti.", R`\gamma = \gamma_1 + \gamma_2`],
     ["Každá časť je striedavý uhol s jednou rovnobežkou.", R`\gamma = 35^\circ + 50^\circ = 85^\circ`]
   ],
   res:R`$85^\circ$`},
  {tool:"uhly", kind:"uloha", ask:R`Dolná priamka je naklonená. Nastav jej sklon tak, aby boli súhlasné uhly zhodné.`,
   hint:"Súhlasné uhly sú zhodné práve pri rovnobežkách.",
   goal:P => P.sklon === 0,
   cfg:{sklon:{v:15}, on:{suhlasne:true}, lock:["alfa"]}},
  {warn:R`Zhodnosť súhlasných a striedavých uhlov platí len pre **rovnobežky**. Ak priamky nie sú rovnobežné, tieto uhly sa líšia.`}
],

"Súčet uhlov v trojuholníku a mnohouholníku":[
  R`Súčet vnútorných uhlov každého trojuholníka je $180^\circ$. Dôkaz: cez vrchol $C$ veď rovnobežku so stranou $AB$. Uhly $\alpha$ a $\beta$ sa pri $C$ zopakujú ako striedavé a spolu s $\gamma$ tvoria priamy uhol.`,
  {def:"Súčet uhlov", tex:R`\alpha + \beta + \gamma = 180^\circ,\qquad n\text{-uholník: } (n - 2) \cdot 180^\circ`, note:"Vonkajší uhol trojuholníka sa rovná súčtu dvoch vnútorných uhlov pri ostatných vrcholoch."},
  {tool:"trojuholnik", ask:R`Ťahaj vrcholy trojuholníka a sleduj veľkosti uhlov. Mení sa ich súčet?`,
   take:R`jednotlivé uhly sa menia, ale súčet je vždy $180^\circ$. Preto má trojuholník najviac jeden tupý alebo pravý uhol.`,
   cfg:{on:{uhly:true},
     out:(P, h) => { const g = h.geo, d = v => h.tn(Math.round(v * 10) / 10); return h.calc(R`\alpha + \beta + \gamma = ${d(g.alfa)}^\circ + ${d(g.beta)}^\circ + ${d(g.gama)}^\circ = ${d(g.alfa + g.beta + g.gama)}^\circ`); }}},
  {ex:R`Uhly trojuholníka sú v pomere $2 : 3 : 4$. Aké sú veľké?`,
   steps:[
     ["Deväť dielov, spolu $180^\circ$.", R`180^\circ : 9 = 20^\circ`],
     ["Uhly.", R`40^\circ,\ 60^\circ,\ 80^\circ`]
   ],
   res:R`$40^\circ$, $60^\circ$, $80^\circ$.`},
  R`Mnohouholník sa dá z jedného vrcholu rozdeliť uhlopriečkami na $n - 2$ trojuholníkov. Každý prispeje $180^\circ$. Pravidelný $n$-uholník má všetky uhly rovnaké.`,
  {tool:"utvary", ask:R`Pravidelný mnohouholník. Meň počet strán $n$ a sleduj veľkosť jedného vnútorného uhla.`,
   take:R`uhol je $\frac{(n - 2) \cdot 180^\circ}{n}$: pri trojuholníku $60^\circ$, štvorci $90^\circ$, šesťuholníku $120^\circ$. S rastúcim $n$ sa blíži k $180^\circ$.`,
   cfg:{typ:"mnohouholnik", lock:["a"]}},
  {ex:R`Aký je súčet vnútorných uhlov pravidelného šesťuholníka a veľkosť jedného z nich?`,
   steps:[
     ["Súčet.", R`(6 - 2) \cdot 180^\circ = 720^\circ`],
     ["Jeden uhol.", R`720^\circ : 6 = 120^\circ`]
   ],
   res:R`$720^\circ$ a $120^\circ$.`},
  {tool:"utvary", kind:"uloha", ask:R`Nastav počet strán pravidelného mnohouholníka tak, aby mal vnútorný uhol $135^\circ$.`,
   hint:R`Vonkajší uhol je $180^\circ - 135^\circ = 45^\circ$ a vonkajšie uhly majú súčet $360^\circ$.`,
   goal:P => P.n === 8,
   cfg:{typ:"mnohouholnik", n:{v:5}, lock:["a"]}},
  {warn:R`Súčet $(n - 2) \cdot 180^\circ$ platí pre vnútorné uhly. Súčet vonkajších uhlov konvexného mnohouholníka je vždy $360^\circ$, nech má koľkokoľvek strán.`}
]

  }
};
})();

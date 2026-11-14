/* Siete telies */
(() => {
const L = v => ({v, lock:true});

THEORY.b35 = {
  mins:20,
  brief:[
    R`Sieť je rozvinutý povrch telesa do roviny. Jej obsah je povrch telesa.`,
    R`Kocka má 11 rôznych sietí, každá má 6 štvorcov.`,
    R`Hranol: 2 podstavy + $n$ obdĺžnikov. Ihlan: 1 podstava + $n$ trojuholníkov.`,
    R`Protiľahlé steny kocky v sieti nikdy nesusedia: v rade štyroch štvorcov sú protiľahlé prvý a tretí, druhý a štvrtý.`
  ],
  subs:{

"Sieť kocky a kvádra":[
  R`Ak teleso rozstriháš pozdĺž niektorých hrán a rozložíš do roviny, vznikne **sieť**. Rovnaké teleso má viac rôznych sietí. Pri kocke je ich 11, každá zo 6 štvorcov, ktoré sa dajú poskladať späť bez prekrytia.`,
  {tool:"telesa", ask:R`Kváder a jeho sieť. Meň rozmery. Ktoré obdĺžniky v sieti sú zhodné?`,
   take:R`tri dvojice zhodných obdĺžnikov: $a \times b$, $b \times c$, $a \times c$. Obsah siete je povrch kvádra.`,
   cfg:{typ:"kvader", on:{siet:true}}},
  {ex:R`Je sieťou kocky útvar zo šiestich štvorcov usporiadaných do tvaru písmena T (štyri v rade a dva nad druhým štvorcom)?`,
   steps:[
     ["Rad štyroch štvorcov sa zroluje do „plášťa“.", R`4 \text{ bočné steny}`],
     ["Dva štvorce nad tým istým štvorcom by sa po zložení prekryli a jedna podstava by chýbala.", R`\text{nie je sieť}`]
   ],
   res:"Nie. Podstavy musia byť na opačných stranách radu (jedna hore, jedna dole)."},
  {warn:R`Šesť štvorcov ešte nie je sieť kocky. Napríklad šesť štvorcov v jednom rade sa nedá zložiť. Over, či sa po zložení žiadne dve steny neprekrývajú.`}
],

"Siete hranolov a ihlanov":[
  R`Sieť kolmého hranola tvoria dve podstavy a plášť, obdĺžnik zložený z $n$ bočných stien. Sieť ihlana tvorí podstava a $n$ trojuholníkov okolo nej. Sieť valca: dva kruhy a obdĺžnik, sieť kužeľa: kruh a kruhový výsek ([[a37]]).`,
  {tool:"telesa", ask:R`Sieť pravidelného hranola. Meň počet strán podstavy. Koľko obdĺžnikov má plášť?`,
   take:R`$n$ obdĺžnikov, každý $a \times v$. Spolu tvoria jeden obdĺžnik $na \times v$.`,
   cfg:{typ:"hranol", on:{siet:true}}},
  {tool:"telesa", ask:R`Sieť pravidelného ihlana. Ako sa zmení, keď zväčšíš výšku?`,
   take:R`trojuholníky stien sa predĺžia, lebo rastie výška steny $w$. Podstava ostane rovnaká.`,
   cfg:{typ:"ihlan", on:{siet:true}, lock:["n", "a"]}},
  {ex:R`Koľko stien, hrán a vrcholov má šesťboký hranol a šesťboký ihlan?`,
   steps:[
     ["Hranol: 2 podstavy + 6 bočných stien.", R`s = 8,\quad h = 18,\quad v = 12`],
     ["Ihlan: 1 podstava + 6 trojuholníkov.", R`s = 7,\quad h = 12,\quad v = 7`],
     ["Eulerov vzťah $v - h + s = 2$.", R`12 - 18 + 8 = 2,\quad 7 - 12 + 7 = 2`]
   ],
   res:"Hranol 8, 18, 12; ihlan 7, 12, 7."},
  {tool:"telesa", kind:"uloha", ask:R`Nastav počet strán podstavy ihlana tak, aby mala sieť spolu 7 mnohouholníkov.`,
   hint:R`Jedna podstava a $n$ trojuholníkov.`,
   goal:P => P.n === 6,
   cfg:{typ:"ihlan", n:{v:4}, on:{siet:true}}},
  {warn:R`Sieť hranola má **dve** podstavy, sieť ihlana jednu. Pri kuželi je plášť kruhový výsek, nie trojuholník.`}
],

"Protiľahlé steny":[
  R`V úlohách sa často pýtajú, ktorá stena bude po zložení oproti danej. Protiľahlé steny kocky nemajú spoločnú hranu, preto v sieti nikdy nesusedia. V rade štyroch štvorcov je oproti každému ten, ktorý je od neho o jeden ďalej.`,
  {cards:[
    {t:"V rade", d:"Štvorce 1, 2, 3, 4 v rade: protiľahlé sú 1 a 3, 2 a 4."},
    {t:"Mimo radu", d:"Dva štvorce pripojené nad a pod rad sú protiľahlé navzájom."},
    {t:"Hracia kocka", d:"Súčet bodov na protiľahlých stenách je 7: 1–6, 2–5, 3–4."}
  ]},
  {ex:R`Sieť kocky: v rade sú štvorce s číslami 1, 2, 3, 4, nad štvorcom 2 je 5 a pod štvorcom 3 je 6. Ktoré čísla sú oproti sebe?`,
   steps:[
     ["Rad.", R`1 \leftrightarrow 3,\quad 2 \leftrightarrow 4`],
     ["Zvyšné dva štvorce sú podstavy.", R`5 \leftrightarrow 6`]
   ],
   res:"Dvojice 1–3, 2–4, 5–6."},
  {tool:"telesa", ask:R`Sieť kocky. Pozri sa, ktoré štvorce po zložení stoja oproti sebe.`,
   take:R`rovnakou farbou sú vyznačené protiľahlé steny. Nikdy nesusedia: v rade sú to prvá a tretia, druhá a štvrtá, a dve steny mimo radu.`,
   cfg:{typ:"kocka", on:{siet:true}}},
  {warn:R`Susedné štvorce v sieti nikdy nie sú protiľahlé, po zložení majú spoločnú hranu.`}
]

  }
};
})();

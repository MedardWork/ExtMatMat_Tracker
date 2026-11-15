/* Opačný jav, nezávislé javy, „aspoň jeden“, súčet a súčin pravdepodobností */
(() => {
const L = v => ({v, lock:true});

THEORY.b38 = {
  mins:30,
  brief:[
    R`$P(A') = 1 - P(A)$. Keď je jav zložitý, často je ľahšie spočítať jeho opak.`,
    R`Javy sú **nezávislé**, ak výsledok jedného nemení pravdepodobnosť druhého. Potom $P(A \cap B) = P(A) \cdot P(B)$.`,
    R`Aspoň jeden úspech v $n$ nezávislých pokusoch: $P = 1 - (1 - p)^n$.`,
    R`$P(A \cup B) = P(A) + P(B) - P(A \cap B)$. Pre nezlučiteľné javy len $P(A) + P(B)$.`
  ],
  subs:{

"Opačný jav":[
  R`Opačný jav $A'$ nastane vtedy, keď nenastane $A$. Jav a jeho opak spolu pokryjú všetky výsledky a neprekrývajú sa, preto sa ich pravdepodobnosti dopĺňajú do 1.`,
  {def:"Opačný jav", tex:R`P(A') = 1 - P(\va{A})`},
  {tool:"pravdepodobnost", ask:R`Jav „padne aspoň jedna šestka“ na dvoch kockách. Spočítaj políčka, ktoré k nemu nepatria.`,
   take:R`mimo javu je $5 \cdot 5 = 25$ políčok, takže $P = 1 - \frac{25}{36} = \frac{11}{36}$. Spočítať opak je jednoduchšie.`,
   cfg:{typ:"kocky", jav:"sestka"}},
  {ex:R`Hodíme dvoma kockami. Aká je pravdepodobnosť, že súčet je aspoň 4?`,
   steps:[
     ["Opačný jav: súčet najviac 3.", R`(1, 1),\ (1, 2),\ (2, 1)`],
     ["Jeho pravdepodobnosť.", R`P(A') = \frac{3}{36} = \frac{1}{12}`],
     ["Hľadaná pravdepodobnosť.", R`P(A) = 1 - \frac{1}{12} = \frac{11}{12} \doteq 0{,}917`]
   ],
   res:R`$\frac{11}{12} \doteq 0{,}917$.`},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Jav „súčet je najviac $s$“. Nastav $s$ tak, aby jeho **opačný** jav mal pravdepodobnosť $\frac{5}{6}$.`,
   hint:"Samotný jav má mať 1/6 = 6/36, teda 6 políčok.",
   goal:P => P.s === 4,
   cfg:{typ:"kocky", jav:"najviac", s:{v:7, min:2, max:12}}},
  {ex:R`Z 10 výrobkov sú 3 chybné. Náhodne vyberieme 2. Aká je pravdepodobnosť, že aspoň jeden je chybný?`,
   steps:[
     ["Opačný jav: oba sú dobré, teda 2 zo 7 dobrých.", R`P(A') = \frac{\binom{7}{2}}{\binom{10}{2}} = \frac{21}{45}`],
     ["Hľadaná pravdepodobnosť.", R`P(A) = 1 - \frac{21}{45} = \frac{24}{45} = \frac{8}{15} \doteq 0{,}533`]
   ],
   res:R`$\frac{8}{15} \doteq 0{,}533$.`},
  {warn:R`Opak javu „aspoň jeden“ je „ani jeden“, nie „práve jeden“. Opak javu „najviac 3“ je „aspoň 4“.`}
],

"Nezávislé javy":[
  R`Dva hody kockou, dva strelci, dva prístroje: výsledok jedného neovplyvní druhý. Takéto javy sú **nezávislé** a pravdepodobnosť, že nastanú oba, je súčin.`,
  {def:"Nezávislé javy", tex:R`P(A \cap B) = P(\va{A}) \cdot P(\vb{B})`,
   note:"Platí len pre nezávislé javy. Pri ťahaní bez vrátenia javy nezávislé nie sú."},
  {tool:"pravdepodobnost", ask:R`Jednotkový štvorec: šírka vľavo je $P(A)$, výška dole $P(B)$. Prepínaj prienik, zjednotenie a „ani jeden“.`,
   take:R`prienik je obdĺžnik $P(A) \times P(B)$, jeho obsah je súčin. „Ani jeden“ je obdĺžnik $(1 - P(A)) \times (1 - P(B))$.`,
   cfg:{typ:"javy", on:{prienik:true}, toggles:["prienik", "zjednotenie", "opak"]}},
  {ex:R`Prvý strelec zasiahne terč s pravdepodobnosťou 0,8, druhý 0,7. Strieľajú nezávisle, každý raz. Aká je pravdepodobnosť, že zasiahnu obaja, ani jeden, práve jeden?`,
   steps:[
     ["Obaja.", R`0{,}8 \cdot 0{,}7 = 0{,}56`],
     ["Ani jeden: obaja minú.", R`0{,}2 \cdot 0{,}3 = 0{,}06`],
     ["Práve jeden: prvý áno a druhý nie, alebo naopak.", R`0{,}8 \cdot 0{,}3 + 0{,}2 \cdot 0{,}7 = 0{,}24 + 0{,}14 = 0{,}38`],
     ["Kontrola.", R`0{,}56 + 0{,}06 + 0{,}38 = 1`]
   ],
   res:"0,56; 0,06; 0,38."},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`$P(B) = 0{,}4$. Nastav $P(A)$ tak, aby oba javy nastali s pravdepodobnosťou 0,24.`,
   hint:"P(A) · 0,4 = 0,24.",
   goal:P => Math.abs(P.a * P.b - .24) < 1e-9,
   cfg:{typ:"javy", a:{v:.3}, b:L(.4), on:{prienik:true}}},
  {warn:R`Nezávislé neznamená nezlučiteľné. Nezlučiteľné javy (padne 1, padne 6 pri jednom hode) nemôžu nastať naraz, preto sú naopak **závislé**: keď nastane jeden, druhý určite nie.`}
],

"Úlohy typu „aspoň jeden“":[
  R`„Aspoň jeden úspech v $n$ pokusoch“ zahŕňa veľa prípadov (jeden, dva, …, všetky). Jeho opak je jediný prípad: **ani jeden** úspech. Ak sú pokusy nezávislé, ten má pravdepodobnosť $(1 - p)^n$.`,
  {def:"Aspoň jeden úspech", tex:R`P = 1 - (1 - \va{p})^{\vb{n}}`,
   note:"p je pravdepodobnosť úspechu v jednom pokuse, n počet nezávislých pokusov."},
  {tool:"pravdepodobnost", ask:R`Pravdepodobnosť úspechu v jednom pokuse je $p$. Zvyšuj počet pokusov $n$.`,
   take:R`pravdepodobnosť „aspoň raz“ rastie k 1, ale nikdy ju nedosiahne. Pri malom $p$ treba veľa pokusov.`,
   cfg:{typ:"aspon"}},
  {ex:R`Strelec zasiahne s pravdepodobnosťou 0,2. Vystrelí 5-krát. Aká je pravdepodobnosť, že zasiahne aspoň raz?`,
   steps:[
     ["Ani raz.", R`0{,}8^5 = 0{,}32768`],
     ["Aspoň raz.", R`1 - 0{,}32768 = 0{,}67232`]
   ],
   res:R`$\doteq 0{,}672$.`},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Pri $p = 0{,}2$ nájdi najmenší počet pokusov, pri ktorom je pravdepodobnosť aspoň jedného úspechu aspoň 0,9.`,
   hint:"0,8¹⁰ ≐ 0,107 je ešte viac ako 0,1.",
   goal:P => P.n === 11,
   cfg:{typ:"aspon", p:L(.2), n:{v:3, min:1, max:15}}},
  {ex:R`Koľkokrát treba hodiť kockou, aby šestka padla aspoň raz s pravdepodobnosťou väčšou ako 0,9?`,
   steps:[
     ["Podmienka.", R`1 - \left(\tfrac{5}{6}\right)^n > 0{,}9 \iff \left(\tfrac{5}{6}\right)^n < 0{,}1`],
     ["Logaritmus, pozor: $\\log \\frac{5}{6} < 0$ otočí nerovnosť.", R`n > \frac{\log 0{,}1}{\log \frac{5}{6}} \doteq 12{,}6`],
     ["Najmenšie celé n.", R`n = 13`]
   ],
   res:"Aspoň 13 hodov."},
  {warn:R`Pravdepodobnosti jednotlivých pokusov sa nesčítajú: 5 výstrelov po 0,2 nie je $5 \cdot 0{,}2 = 1$, istota zásahu. Správne je $1 - 0{,}8^5 \doteq 0{,}67$.`}
],

"Súčet a súčin pravdepodobností":[
  R`Pravdepodobnosť, že nastane **aspoň jeden** z javov $A$, $B$, sa počíta ako počet prvkov zjednotenia ([[a38]]): sčítame a odčítame prienik, aby sme ho nepočítali dvakrát. Pri nezlučiteľných javoch je prienik prázdny.`,
  {def:"Súčet pravdepodobností", tex:R`P(A \cup B) = P(A) + P(B) - P(A \cap B) \qquad A \cap B = \emptyset:\ P(A \cup B) = P(A) + P(B)`},
  {tool:"pravdepodobnost", ask:R`Zapni „aspoň jeden z nich“. Prečo nestačí sčítať šírku a výšku?`,
   take:R`stĺpec $A$ a pás $B$ sa prekrývajú v prieniku. Ten by bol započítaný dvakrát, preto sa odčíta.`,
   cfg:{typ:"javy", on:{zjednotenie:true, prienik:true}}},
  {ex:R`Z 32 mariášových kariet ťaháme jednu. Aká je pravdepodobnosť, že je červená (srdce) alebo eso?`,
   steps:[
     ["Srdcia: 8 kariet, esá: 4, srdcové eso je v oboch.", R`P(A) = \tfrac{8}{32},\ P(B) = \tfrac{4}{32},\ P(A \cap B) = \tfrac{1}{32}`],
     ["Súčet.", R`\frac{8 + 4 - 1}{32} = \frac{11}{32} \doteq 0{,}344`]
   ],
   res:R`$\frac{11}{32} \doteq 0{,}344$.`},
  R`Pri ťahaní **bez vrátenia** sa druhá pravdepodobnosť zmení podľa výsledku prvého ťahu. Súčin sa počíta postupne: pravdepodobnosť prvého ťahu krát pravdepodobnosť druhého za predpokladu, že prvý nastal.`,
  {ex:R`V urne je 5 červených a 3 modré guľky. Ťaháme dve po sebe bez vrátenia. Aká je pravdepodobnosť, že obe sú červené? A že majú rôzne farby?`,
   steps:[
     ["Prvá červená, potom ostane 4 červené zo 7.", R`\frac{5}{8} \cdot \frac{4}{7} = \frac{20}{56} = \frac{5}{14}`],
     ["Rôzne farby: červená–modrá alebo modrá–červená.", R`\frac{5}{8} \cdot \frac{3}{7} + \frac{3}{8} \cdot \frac{5}{7} = \frac{30}{56} = \frac{15}{28}`]
   ],
   res:R`$\frac{5}{14} \doteq 0{,}357$ a $\frac{15}{28} \doteq 0{,}536$. Rovnaký výsledok dá výpočet cez kombinačné čísla ([[a41]]).`},
  {steps:[
    {t:"„a“ (oba, za sebou)", d:"Násob. Pri nezávislých javoch priamo, pri ťahaní bez vrátenia so zmenenou druhou pravdepodobnosťou."},
    {t:"„alebo“ (nezlučiteľné prípady)", d:"Sčítaj, napríklad červená–modrá alebo modrá–červená."},
    {t:"„aspoň“", d:"Skús opačný jav."}
  ]},
  {warn:R`Ak sa javy môžu stať naraz, pri súčte nezabudni odčítať prienik. Inak môže vyjsť pravdepodobnosť väčšia ako 1.`}
]

  }
};
})();

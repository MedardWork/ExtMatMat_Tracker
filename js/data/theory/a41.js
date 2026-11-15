/* Náhodný pokus, jav, klasická pravdepodobnosť */
(() => {
const L = v => ({v, lock:true});
const pr = st => st.h && st.h.pr;
const faces = (st, want) => { const s = st.data && st.data.sel; return !!s && [1, 2, 3, 4, 5, 6].every(v => !!s[v] === want.includes(v)); };

THEORY.a41 = {
  mins:25,
  brief:[
    R`**Náhodný pokus** má viac možných výsledkov a nevieme dopredu, ktorý nastane. Všetky výsledky tvoria množinu $\Omega$.`,
    R`**Jav** je časť množiny výsledkov. Opačný jav $A'$ nastane, keď nenastane $A$.`,
    R`**Klasická pravdepodobnosť** (všetky výsledky rovnako možné): $P(A) = \frac{m}{n}$, priaznivé lomeno všetky.`,
    R`$0 \leq P(A) \leq 1$, $P(A') = 1 - P(A)$. Dve kocky majú 36 výsledkov, tri mince 8, mariášové karty 32.`
  ],
  subs:{

"Náhodný pokus a jav":[
  R`Hod kockou, hod mincou, ťahanie karty: dopredu nevieme, čo padne. Takýto **náhodný pokus** má množinu všetkých možných výsledkov $\Omega$. Pri kocke je $\Omega = \{1, 2, 3, 4, 5, 6\}$.`,
  R`**Jav** je tvrdenie o výsledku, napríklad „padne párne číslo“. Zapíšeme ho ako množinu výsledkov, pri ktorých nastane: $A = \{2, 4, 6\}$.`,
  {tool:"pravdepodobnost", ask:R`Jedna kocka, zvýraznený je jav „padne párne číslo“. Klikaj na steny a vytvor iné javy.`,
   take:R`jav je ľubovoľná skupina výsledkov. Čím viac výsledkov obsahuje, tým je pravdepodobnejší.`,
   cfg:{typ:"kocka", jav:[2, 4, 6]}},
  {cards:[
    {t:"Istý jav", d:"Nastane vždy, je to celé $\\Omega$. Napríklad „padne číslo menšie ako 7“."},
    {t:"Nemožný jav", d:"Nenastane nikdy, $\\emptyset$. Napríklad „padne 7“."},
    {t:"Opačný jav $A'$", d:"Nastane práve vtedy, keď nenastane $A$. K „párne“ je to „nepárne“."},
    {t:"Nezlučiteľné javy", d:"Nemôžu nastať naraz: $A \\cap B = \\emptyset$. Napríklad „padne 1“ a „padne 6“."}
  ]},
  {def:"Javy ako množiny", tex:R`A \cap B:\ \text{nastanú oba} \qquad A \cup B:\ \text{nastane aspoň jeden} \qquad A':\ \text{nenastane } A`},
  {tool:"mnoziny", ask:R`Jav $A$ a jav $B$ ako množiny výsledkov. Ktorá časť obrázka zodpovedá tomu, že „nastane aspoň jeden z nich“?`,
   take:R`„aspoň jeden“ je zjednotenie $A \cup B$, „oba“ je prienik $A \cap B$.`,
   cfg:{typ:"operacie", vyraz:"A u B"}},
  {ex:R`Hádžeme kockou. $A$: padne párne číslo, $B$: padne aspoň 5. Vypíš $A \cap B$, $A \cup B$ a $A'$.`,
   steps:[
     ["Javy ako množiny.", R`A = \{2, 4, 6\},\quad B = \{5, 6\}`],
     ["Oba naraz.", R`A \cap B = \{6\}`],
     ["Aspoň jeden.", R`A \cup B = \{2, 4, 5, 6\}`],
     ["Opačný jav k A.", R`A' = \{1, 3, 5\}`]
   ],
   res:R`$A \cap B = \{6\}$, $A \cup B = \{2, 4, 5, 6\}$, $A' = \{1, 3, 5\}$.`},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Klikaním na steny vytvor jav „padne prvočíslo“.`,
   hint:"Prvočísla na kocke sú 2, 3, 5. Jednotka nie je prvočíslo.",
   goal:(P, st) => faces(st, [2, 3, 5]),
   cfg:{typ:"kocka", jav:[]}},
  {warn:R`Opačný jav k „padne aspoň 5“ je „padne najviac 4“, nie „padne menej ako 5 alebo viac ako 5“. Opačný jav obsahuje presne tie výsledky, ktoré v $A$ nie sú.`}
],

"Klasická pravdepodobnosť":[
  R`Ak sú všetky výsledky pokusu **rovnako možné** (férová kocka, dobre zamiešané karty), pravdepodobnosť javu je podiel výsledkov, pri ktorých jav nastane, a všetkých výsledkov.`,
  {def:"Klasická pravdepodobnosť", tex:R`P(A) = \frac{\va{m}}{n} \qquad 0 \leq P(A) \leq 1 \qquad P(A') = 1 - P(A)`,
   note:"m je počet priaznivých výsledkov, n počet všetkých. P = 0 má nemožný jav, P = 1 istý jav."},
  {tool:"pravdepodobnost", ask:R`Dve kocky: 36 políčok, každé je jeden výsledok. Meň súčet $s$ a sleduj, koľko políčok je priaznivých.`,
   take:R`priaznivé políčka pre súčet ležia na šikmej čiare. Najviac ich je pre súčet 7, a to 6.`,
   cfg:{typ:"kocky", jav:"sucet"}},
  {ex:R`V urne je 5 červených a 3 modré guľky. Vytiahneme jednu. Aká je pravdepodobnosť, že je červená? Potom vytiahneme naraz dve guľky. Aká je pravdepodobnosť, že sú obe červené?`,
   steps:[
     ["Jedna guľka: 8 rovnako možných výsledkov, 5 priaznivých.", R`P = \frac{5}{8} = 0{,}625`],
     ["Dve guľky: všetky dvojice z 8 ([[a40]]).", R`n = \binom{8}{2} = 28`],
     ["Priaznivé: dvojice z 5 červených.", R`m = \binom{5}{2} = 10`],
     ["Pravdepodobnosť.", R`P = \frac{10}{28} = \frac{5}{14} \doteq 0{,}357`]
   ],
   res:R`$\frac{5}{8}$ a $\frac{5}{14} \doteq 0{,}357$.`},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Jav „súčet na dvoch kockách je 8“ nie je vyznačený. Klikaním označ všetky jeho políčka.`,
   hint:"2 + 6, 3 + 5, 4 + 4, 5 + 3, 6 + 2: päť políčok, P = 5/36.",
   goal:(P, st) => !!pr(st) && pr(st).ok,
   cfg:{typ:"kocky", jav:"sucet", s:L(8), oznac:true}},
  {tool:"pravdepodobnost", ask:R`Hádžeme kockou stále znova. Sleduj, kam sa ustáli relatívna početnosť šestky.`,
   take:R`po mnohých hodoch je podiel šestiek blízko $\frac{1}{6} \doteq 0{,}167$. Pravdepodobnosť je to, k čomu sa relatívna početnosť blíži.`,
   cfg:{typ:"pokus", pokus:"kocka", sleduj:5, start:30}},
  {ex:R`Hádžeme dvoma kockami. Aká je pravdepodobnosť, že nepadne ani jedna šestka? A že padne aspoň jedna?`,
   steps:[
     ["Bez šestky: na každej kocke 5 možností.", R`P(A') = \frac{5 \cdot 5}{36} = \frac{25}{36}`],
     ["Aspoň jedna šestka je opačný jav.", R`P(A) = 1 - \frac{25}{36} = \frac{11}{36} \doteq 0{,}306`]
   ],
   res:R`$\frac{25}{36}$ a $\frac{11}{36} \doteq 0{,}306$.`},
  {warn:R`Vzorec $\frac{m}{n}$ platí len pre rovnako možné výsledky. Súčty 2 až 12 na dvoch kockách nie sú rovnako možné, preto $P(\text{súčet } 7) \neq \frac{1}{11}$. Počítaj s 36 dvojicami.`}
],

"Kocky, mince, karty":[
  R`Na maturite sa opakujú tri pokusy. **Dve kocky**: 36 usporiadaných dvojíc, (1, 2) a (2, 1) sú rôzne výsledky. **Mince**: pri $k$ minciach $2^k$ výsledkov. **Karty**: mariášové majú 32 kariet (4 farby po 8), žolíkové 52 (4 farby po 13).`,
  {cards:[
    {t:"Dve kocky", tex:R`n = 6 \cdot 6 = 36`},
    {t:"Tri mince", tex:R`n = 2^3 = 8`},
    {t:"Karta z 32", tex:R`P(\text{eso}) = \frac{4}{32} = \frac{1}{8}`},
    {t:"Dve karty z 32", tex:R`n = \binom{32}{2} = 496`}
  ]},
  {tool:"pravdepodobnost", ask:R`Jav „padnú dve rovnaké čísla“. Kde v mriežke ležia jeho políčka?`,
   take:R`na uhlopriečke, je ich 6, takže $P = \frac{6}{36} = \frac{1}{6}$.`,
   cfg:{typ:"kocky", jav:"rovnake"}},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Nastav súčet $s$, ktorý na dvoch kockách padá najčastejšie.`,
   hint:"Hľadaj najdlhšiu šikmú čiaru v mriežke.",
   take:R`súčet 7 má 6 priaznivých výsledkov z 36, $P = \frac{1}{6}$.`,
   goal:P => P.s === 7,
   cfg:{typ:"kocky", jav:"sucet", s:{v:4, min:2, max:12}}},
  {ex:R`Hodíme tromi mincami. Aká je pravdepodobnosť, že padne práve dvakrát líc?`,
   steps:[
     ["Všetky výsledky (strom z [[a38]]).", R`n = 2^3 = 8`],
     ["Priaznivé: LLR, LRL, RLL.", R`m = 3`],
     ["Pravdepodobnosť.", R`P = \frac{3}{8} = 0{,}375`]
   ],
   res:R`$\frac{3}{8}$.`},
  {ex:R`Z balíčka 32 mariášových kariet vytiahneme naraz dve. Aká je pravdepodobnosť, že sú to dve esá?`,
   steps:[
     ["Všetky dvojice kariet.", R`n = \binom{32}{2} = \frac{32 \cdot 31}{2} = 496`],
     ["Dvojice es zo štyroch.", R`m = \binom{4}{2} = 6`],
     ["Pravdepodobnosť.", R`P = \frac{6}{496} = \frac{3}{248} \doteq 0{,}012`]
   ],
   res:R`$\frac{3}{248} \doteq 0{,}012$.`},
  {ex:R`Hodíme dvoma kockami. Aká je pravdepodobnosť, že súčin čísel je 12?`,
   steps:[
     ["Dvojice so súčinom 12.", R`(2, 6),\ (3, 4),\ (4, 3),\ (6, 2)`],
     ["Pravdepodobnosť.", R`P = \frac{4}{36} = \frac{1}{9} \doteq 0{,}111`]
   ],
   res:R`$\frac{1}{9}$.`},
  {warn:R`Pri dvoch kockách (aj rovnakých) počítaj (2, 6) a (6, 2) ako dva výsledky. Predstav si jednu kocku červenú a druhú modrú.`}
]

  }
};
})();

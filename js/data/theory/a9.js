/* Dôkazy: priamy, nepriamy, sporom */
(() => {
const isPrime = n => n > 1 && primeFactors(n).length === 1;

THEORY.a9 = {
  mins:30,
  brief:[
    R`Priamy dôkaz $A \Rightarrow B$: z $A$ reťazou platných krokov dôjdeš k $B$.`,
    R`Nepriamy dôkaz: namiesto $A \Rightarrow B$ dokážeš obmenu $\neg B \Rightarrow \neg A$. Obrátená implikácia $B \Rightarrow A$ s pôvodnou ekvivalentná nie je.`,
    R`Dôkaz sporom: predpokladáš $\neg A$ a dôjdeš k nezmyslu. Preto platí $A$.`,
    R`Tvrdenie „pre každé“ vyvráti jediný protipríklad.`
  ],
  subs:{

"Priamy dôkaz":[
  R`Matematická veta má často tvar implikácie: „Ak platí $A$, tak platí $B$.“ Pri **priamom dôkaze** vyjdeš z predpokladu $A$ a cez pravdivé implikácie sa dopracuješ k $B$.`,
  {def:"Priamy dôkaz", tex:R`A \Rightarrow C_1 \Rightarrow C_2 \Rightarrow \cdots \Rightarrow B`},
  {tool:"vyroky", ask:R`Prečo smie dôkaz reťaziť implikácie? Pozri, či je výrok $((A \Rightarrow B) \wedge (B \Rightarrow C)) \Rightarrow (A \Rightarrow C)$ pravdivý v každom riadku.`,
   take:R`áno, je to tautológia. Keď platí $A \Rightarrow B$ aj $B \Rightarrow C$, platí aj $A \Rightarrow C$.`,
   cfg:{vyraz:"((A ⇒ B) ∧ (B ⇒ C)) ⇒ (A ⇒ C)", kroky:false}},
  R`Pri dôkazoch o celých číslach sa zapisuje párne číslo ako $2k$, nepárne ako $2k + 1$, násobok troch ako $3k$, kde $k \in \mathbb{Z}$.`,
  {ex:R`Dokáž: súčet dvoch nepárnych čísel je párny.`,
   steps:[
     ["Zapíš nepárne čísla.", R`a = 2k + 1,\quad b = 2l + 1,\quad k, l \in \mathbb{Z}`],
     ["Sčítaj.", R`a + b = 2k + 2l + 2 = 2(k + l + 1)`],
     [R`$k + l + 1$ je celé číslo.`, R`a + b \text{ je násobok } 2`]
   ],
   res:"Súčet je párny. $\\blacksquare$"},
  {ex:R`Dokáž: pre každé celé $n$ je $n^3 - n$ deliteľné šiestimi.`,
   steps:[
     ["Rozlož na súčin.", R`n^3 - n = n(n^2 - 1) = (n - 1)\,n\,(n + 1)`],
     ["Tri po sebe idúce čísla: jedno je párne a jedno deliteľné tromi.", R`2 \mid (n - 1)n(n + 1),\quad 3 \mid (n - 1)n(n + 1)`],
     [R`2 a 3 sú nesúdeliteľné.`, R`6 \mid n^3 - n`]
   ],
   res:"Tvrdenie platí. $\\blacksquare$"},
  {warn:R`Príklady nie sú dôkaz. Overiť tvrdenie pre $n = 1, 2, 3$ nestačí, treba ukázať, že platí pre všeobecné $n$. Preto sa pracuje so zápisom $2k + 1$, nie s konkrétnymi číslami.`}
],

"Nepriamy dôkaz (obmena implikácie)":[
  R`Niekedy sa ťažko postupuje od $A$ k $B$. Implikácia $A \Rightarrow B$ má však rovnakú pravdivostnú hodnotu ako jej **obmena** $\neg B \Rightarrow \neg A$. Stačí dokázať tú.`,
  {def:"Obmena implikácie", tex:R`(A \Rightarrow B) \equiv (\neg B \Rightarrow \neg A)`},
  {tool:"vyroky", ask:R`Porovnaj stĺpce $A \Rightarrow B$ a $\neg B \Rightarrow \neg A$.`,
   take:R`zhodujú sa v každom riadku. Implikácia a jej obmena sú ekvivalentné, dokázať jednu znamená dokázať druhú.`,
   cfg:{vyraz:"A ⇒ B; ¬B ⇒ ¬A"}},
  R`Pozor na **obrátenú** implikáciu $B \Rightarrow A$. Tá s pôvodnou ekvivalentná nie je: „Ak je číslo deliteľné 4, je párne“ platí, „ak je číslo párne, je deliteľné 4“ nie.`,
  {tool:"vyroky", kind:"uloha", ask:R`Nastav $A$ a $B$ tak, aby mali $A \Rightarrow B$ a obrátená $B \Rightarrow A$ rôznu hodnotu.`,
   hint:"Implikácia je nepravdivá len pre 1 ⇒ 0. Stačí, aby $A$ a $B$ mali rôznu hodnotu.",
   goal:P => P.a !== P.b,
   cfg:{vyraz:"A ⇒ B; B ⇒ A"}},
  {ex:R`Dokáž: ak je $n^2$ párne, je párne aj $n$ ($n \in \mathbb{Z}$).`,
   steps:[
     ["Priamo sa ťažko odmocňuje. Obmena: ak $n$ nie je párne, ani $n^2$ nie je párne.", R`n = 2k + 1`],
     ["Umocni.", R`n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1`],
     ["To je nepárne číslo, obmena platí.", R`n^2 \text{ je nepárne}`]
   ],
   res:"Dokázaná obmena, teda platí aj pôvodná implikácia. $\\blacksquare$"},
  {ex:R`Dokáž: ak $a + b > 10$, tak $a > 5$ alebo $b > 5$ ($a, b \in \mathbb{R}$).`,
   steps:[
     [R`Obmena: neguj obe strany. $\neg(a > 5 \vee b > 5)$ je $a \leq 5 \wedge b \leq 5$.`, R`a \leq 5 \wedge b \leq 5 \;\Rightarrow\; a + b \leq 10`],
     ["Sčítaj nerovnosti.", R`a + b \leq 5 + 5 = 10`]
   ],
   res:"Obmena platí, takže aj pôvodné tvrdenie. $\\blacksquare$"},
  {warn:R`Obmena nie je obrátená implikácia. Z „ak prší, je mokro“ vyplýva „ak nie je mokro, neprší“, ale nie „ak je mokro, prší“ (mohli polievať).`}
],

"Dôkaz sporom":[
  R`Pri **dôkaze sporom** predpokladáš, že tvrdenie $A$ **neplatí**. Z tohto predpokladu správnymi krokmi odvodíš niečo zjavne nepravdivé, napríklad $1 = 0$ alebo „číslo je párne aj nepárne“. Predpoklad bol teda chybný a platí $A$.`,
  {tool:"vyroky", ask:R`Výrok $\neg A \Rightarrow (B \wedge \neg B)$ hovorí „z $\neg A$ vyplýva spor“. Porovnaj ho so stĺpcom $A$.`,
   take:R`majú rovnaké hodnoty. Ak z $\neg A$ vyplýva spor, $A$ musí platiť.`,
   cfg:{vyraz:"¬A ⇒ (B ∧ ¬B); A"}},
  {steps:[
    {t:"Predpoklad", d:"Predpokladaj opak tvrdenia, teda jeho negáciu."},
    {t:"Odvodzuj", d:"Z predpokladu vyvodzuj ďalšie tvrdenia."},
    {t:"Spor", d:"Dôjdi k tvrdeniu, ktoré odporuje predpokladu alebo známemu faktu. Pôvodné tvrdenie platí."}
  ]},
  {ex:R`Dokáž, že $\sqrt{2}$ je iracionálne číslo.`,
   steps:[
     [R`Predpokladaj opak: $\sqrt{2} = \frac{p}{q}$, zlomok v základnom tvare, $D(p, q) = 1$.`, R`2 = \frac{p^2}{q^2} \;\Rightarrow\; p^2 = 2q^2`],
     [R`$p^2$ je párne, teda aj $p$ (dokázané vyššie). Zapíš $p = 2k$.`, R`4k^2 = 2q^2 \;\Rightarrow\; q^2 = 2k^2`],
     [R`Aj $q^2$, teda aj $q$, je párne.`, R`2 \mid p,\ 2 \mid q`]
   ],
   res:R`$p$ aj $q$ sú párne, zlomok sa dá krátiť dvomi. To je spor s $D(p, q) = 1$, teda $\sqrt{2}$ je iracionálne. $\blacksquare$`},
  {ex:R`Dokáž, že prvočísel je nekonečne veľa.`,
   steps:[
     [R`Predpokladaj, že ich je konečne veľa: $p_1, p_2, \ldots, p_k$.`, R`N = p_1 \cdot p_2 \cdots p_k + 1`],
     [R`$N$ delené ktorýmkoľvek $p_i$ dáva zvyšok 1.`, R`p_i \nmid N`],
     [R`$N > 1$ má nejakého prvočíselného deliteľa, ten nie je v zozname.`, R`\text{spor}`]
   ],
   res:"Prvočísel je nekonečne veľa. $\\blacksquare$"},
  {warn:R`Na začiatku dôkazu sporom treba správne znegovať tvrdenie (pozri [[a8]]). Negácia „$\sqrt{2}$ je iracionálne“ je „$\sqrt{2}$ je racionálne“, nie „$\sqrt{2}$ je celé číslo“.`}
],

"Protipríklad a chyba v cudzom postupe":[
  R`Tvrdenie „pre každé $x$ platí…“ vyvrátiš jediným **protipríkladom**: jedným $x$, pre ktoré tvrdenie neplatí. Často sa skrýva v okrajových prípadoch: nula, jednotka, záporné čísla, zlomky.`,
  {ex:R`Vyvráť: pre každé reálne $x$ platí $x^2 > x$.`,
   steps:[
     [R`Skús číslo medzi 0 a 1.`, R`x = \tfrac{1}{2}:\quad \tfrac{1}{4} > \tfrac{1}{2}\ \text{neplatí}`]
   ],
   res:R`Protipríklad $x = \frac{1}{2}$ (aj $x = 0$ alebo $x = 1$).`},
  {tool:"rozklad", kind:"uloha", ask:R`Tvrdenie: „Pre každé prirodzené $n$ je $n^2 - n + 11$ prvočíslo.“ Pre $n = 1, 2, 3, \ldots$ dostávaš 11, 13, 17, 23, 31, … Nájdi hodnotu, ktorá prvočíslom nie je, a nastav ju.`,
   hint:R`Skús $n = 11$: $121 - 11 + 11$.`,
   goal:P => !isPrime(P.a) && [...Array(40).keys()].some(n => n * n - n + 11 === P.a),
   cfg:{a:{v:11, max:999}}},
  R`Chyba v cudzom postupe sa často skrýva v kroku, ktorý „vždy funguje“: delenie výrazom, ktorý môže byť nula, odmocnenie, umocnenie rovnice alebo vynásobenie nerovnice záporným číslom.`,
  {ex:R`Nájdi chybu: Nech $a = b$. Potom $a^2 = ab$, $a^2 - b^2 = ab - b^2$, $(a - b)(a + b) = b(a - b)$, $a + b = b$, $2b = b$, $2 = 1$.`,
   steps:[
     [R`Prvé tri kroky sú v poriadku.`, R`(a - b)(a + b) = b(a - b)`],
     [R`Štvrtý krok delí $(a - b)$. Lenže $a = b$, takže $a - b = 0$.`, R`\text{delenie nulou}`]
   ],
   res:R`Chyba je v delení výrazom $a - b = 0$.`},
  {ex:R`Nájdi chybu: „Rovnica $x^2 = 9$, odmocním: $x = 3$.“`,
   steps:[
     [R`$\sqrt{x^2} = |x|$, nie $x$.`, R`|x| = 3`],
     ["Absolútnu hodnotu 3 majú dve čísla.", R`x = 3 \vee x = -3`]
   ],
   res:R`Strata koreňa $-3$.`},
  {warn:R`Ak nájdeš príklad, pre ktorý tvrdenie platí, nič si nedokázal. Ak nájdeš príklad, pre ktorý neplatí, tvrdenie „pre každé“ si vyvrátil. Asymetria je dôležitá.`}
]

  }
};
})();

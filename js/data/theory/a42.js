/* Početnosti, stĺpcový graf, histogram, kruhový graf, čítanie grafov */
(() => {
const L = v => ({v, lock:true});
const H = st => st.h && st.h.hist;
const same = (a, b) => !!a && a.length === b.length && a.every((v, i) => v === b[i]);

THEORY.a42 = {
  mins:25,
  brief:[
    R`**Absolútna početnosť** $n_i$: koľkokrát sa hodnota vyskytla. **Relatívna** $\frac{n_i}{n}$: aká časť zo všetkých, často v percentách. Relatívne početnosti dávajú spolu 1 (100 %).`,
    R`**Stĺpcový graf**: stĺpce s medzerami pre jednotlivé hodnoty. **Histogram**: stĺpce bez medzier pre intervaly (triedy).`,
    R`**Kruhový graf**: výsek má uhol $\frac{n_i}{n} \cdot 360^\circ$.`,
    R`Pri čítaní grafu skontroluj os: odkiaľ začína, aké sú jednotky, či ide o počty alebo percentá.`
  ],
  subs:{

"Absolútna a relatívna početnosť":[
  R`Štatistický súbor sú zozbierané údaje, napríklad známky 25 žiakov. Údaje zhrnieme do **tabuľky početností**: ku každej hodnote napíšeme, koľkokrát sa vyskytla. To je **absolútna početnosť** $n_i$. Ich súčet je rozsah súboru $n$.`,
  {def:"Početnosti", tex:R`n = n_1 + n_2 + \dots + n_k \qquad f_i = \frac{n_i}{n} \qquad f_1 + f_2 + \dots + f_k = 1`,
   note:"fᵢ je relatívna početnosť. Vynásobená 100 dáva percentá."},
  {tool:"histogram", ask:R`Známky 25 žiakov. Prepni na relatívne početnosti. Ťahaj stĺpce a sleduj, ako sa menia percentá všetkých známok.`,
   take:R`zmena jednej absolútnej početnosti zmení rozsah $n$, a tým aj relatívne početnosti všetkých ostatných hodnôt.`,
   cfg:{typ:"pocetnosti", nazov:"známka", toggles:["rel"]}},
  {ex:R`Známky v teste: jednotku má 3 žiakov, dvojku 7, trojku 9, štvorku 4, päťku 2. Urči relatívne početnosti a priemernú známku.`,
   steps:[
     ["Rozsah súboru.", R`n = 3 + 7 + 9 + 4 + 2 = 25`],
     ["Relatívne početnosti.", R`\tfrac{3}{25} = 12\,\%,\ \tfrac{7}{25} = 28\,\%,\ \tfrac{9}{25} = 36\,\%,\ \tfrac{4}{25} = 16\,\%,\ \tfrac{2}{25} = 8\,\%`],
     ["Kontrola súčtu.", R`12 + 28 + 36 + 16 + 8 = 100`],
     ["Priemer: každú známku krát jej početnosť ([[b40]]).", R`\bar{x} = \frac{1 \cdot 3 + 2 \cdot 7 + 3 \cdot 9 + 4 \cdot 4 + 5 \cdot 2}{25} = \frac{70}{25} = 2{,}8`]
   ],
   res:"12 %, 28 %, 36 %, 16 %, 8 %; priemer 2,8."},
  {tool:"histogram", kind:"uloha", ask:R`Ťahaním stĺpcov nastav tabuľku: jednotku má 4 žiakov, dvojku 6, trojku 8, štvorku 2, päťku nikto.`,
   hint:"Ťahaj vrch každého stĺpca, kým nie je na správnej výške.",
   goal:(P, st) => !!H(st) && same(H(st).pocty, [4, 6, 8, 2, 0]),
   cfg:{typ:"pocetnosti", nazov:"známka"}},
  {warn:R`Relatívna početnosť sa delí rozsahom celého súboru $n$, nie počtom rôznych hodnôt. Pri 5 známkach a 25 žiakoch delíš 25.`}
],

"Histogram a stĺpcový graf":[
  R`**Stĺpcový graf** zobrazí početnosti jednotlivých hodnôt: každá hodnota má svoj stĺpec a medzi stĺpcami sú medzery. Keď je hodnôt veľa (výšky, časy, zárobky), rozdelíme ich do **tried** (intervalov rovnakej šírky) a nakreslíme **histogram**: stĺpce bez medzier, každý nad svojím intervalom.`,
  {cards:[
    {t:"Stĺpcový graf", d:"Jednotlivé hodnoty alebo kategórie (známka, druh dopravy). Stĺpce s medzerami."},
    {t:"Histogram", d:"Číselné údaje rozdelené do intervalov. Stĺpce tesne vedľa seba, šírka stĺpca je šírka triedy."}
  ]},
  {tool:"histogram", ask:R`Výšky 20 žiakov v cm. Meň šírku triedy a sleduj, ako sa mení tvar histogramu.`,
   take:R`úzke triedy dajú „zubatý“ histogram, široké zas zakryjú tvar. Obvykle stačí 5 až 8 tried.`,
   cfg:{typ:"triedenie"}},
  {ex:R`Výšky 20 žiakov (cm): 152, 158, 161, 163, 164, 166, 167, 167, 169, 170, 171, 171, 172, 174, 175, 176, 178, 179, 183, 188. Roztrieď ich do tried šírky 10 od 150 cm.`,
   steps:[
     [R`Trieda $\langle 150;\ 160)$: 152, 158.`, R`2`],
     [R`Trieda $\langle 160;\ 170)$: 161 až 169.`, R`7`],
     [R`Trieda $\langle 170;\ 180)$: 170 až 179.`, R`9`],
     [R`Trieda $\langle 180;\ 190)$: 183, 188.`, R`2`],
     ["Kontrola.", R`2 + 7 + 9 + 2 = 20`]
   ],
   res:"Početnosti tried 2, 7, 9, 2. Najviac žiakov meria od 170 do 180 cm."},
  {tool:"histogram", ask:R`Zapni polygón početností: lomená čiara cez stredy vrchov stĺpcov.`,
   take:R`polygón ukazuje tvar rozdelenia rovnako ako histogram, ale dá sa doňho nakresliť aj druhý súbor na porovnanie.`,
   cfg:{typ:"triedenie", on:{polygon:true}}},
  {warn:R`Hranica triedy patrí len do jednej triedy. Pri $\langle 160;\ 170)$ patrí 170 už do nasledujúcej triedy. Inak by sa hodnota započítala dvakrát.`}
],

"Kruhový graf":[
  R`**Kruhový graf** ukáže, akú časť celku tvorí každá kategória. Celý kruh je 100 %, teda $360^\circ$. Výsek kategórie má uhol úmerný jej relatívnej početnosti.`,
  {def:"Uhol výseku", tex:R`\alpha_i = \frac{n_i}{n} \cdot 360^\circ = f_i \cdot 360^\circ \qquad 1\,\% \leftrightarrow 3{,}6^\circ`},
  {tool:"histogram", ask:R`Spôsob dopravy 24 žiakov do školy. Ťahaj stĺpce a sleduj, ako sa menia výseky.`,
   take:R`výseky sa menia všetky naraz, lebo celok je stále celý kruh. Kruhový graf ukazuje podiely, nie počty.`,
   cfg:{typ:"pocetnosti", hodnoty:["pešo", "bicykel", "autobus", "auto"], pocty:[6, 3, 9, 6], nazov:"doprava", on:{kruh:true, stlpce:true, rel:true}}},
  {ex:R`Do školy chodí pešo 6 žiakov, na bicykli 3, autobusom 9 a autom 6. Vypočítaj uhly výsekov kruhového grafu.`,
   steps:[
     ["Rozsah.", R`n = 6 + 3 + 9 + 6 = 24`],
     ["Pešo a autom.", R`\tfrac{6}{24} \cdot 360^\circ = 90^\circ`],
     ["Bicykel.", R`\tfrac{3}{24} \cdot 360^\circ = 45^\circ`],
     ["Autobus.", R`\tfrac{9}{24} \cdot 360^\circ = 135^\circ`],
     ["Kontrola.", R`90 + 45 + 135 + 90 = 360`]
   ],
   res:"Pešo 90°, bicykel 45°, autobus 135°, auto 90°."},
  {tool:"histogram", kind:"uloha", ask:R`Zmeň počet žiakov, ktorí chodia autobusom, tak, aby ich výsek bol presne polkruh.`,
   hint:"Polkruh je 50 %: autobusom musí ísť toľko žiakov ako všetkými ostatnými spôsobmi spolu, 6 + 3 + 6 = 15.",
   goal:(P, st) => !!H(st) && Math.abs(H(st).rel[2] - .5) < 1e-9 && H(st).pocty[0] === 6 && H(st).pocty[1] === 3 && H(st).pocty[3] === 6,
   cfg:{typ:"pocetnosti", hodnoty:["pešo", "bicykel", "autobus", "auto"], pocty:[6, 3, 9, 6], nazov:"doprava", max:16, on:{kruh:true, stlpce:true, rel:true}}},
  {ex:R`V kruhovom grafe o 30 žiakoch má výsek „volejbal“ uhol $72^\circ$. Koľko žiakov hrá volejbal?`,
   steps:[
     ["Časť z celku.", R`\frac{72^\circ}{360^\circ} = \frac{1}{5} = 20\,\%`],
     ["Počet žiakov.", R`\tfrac{1}{5} \cdot 30 = 6`]
   ],
   res:"6 žiakov."},
  {warn:R`Kruhový graf nemá zmysel, keď kategórie nie sú časťami jedného celku, napríklad keď mohol žiak zaškrtnúť viac odpovedí a percentá dávajú spolu viac ako 100.`}
],

"Čítanie dát z grafu":[
  R`Na maturite sa údaje často zadávajú grafom. Najprv si prečítaj, čo je na osiach a v akých jednotkách, potom z grafu prepíš tabuľku početností. Až s ňou počítaj priemer, medián alebo percentá.`,
  {steps:[
    {t:"Osi", d:"Čo je na vodorovnej osi (hodnoty, kategórie, triedy) a čo na zvislej (počet, percentá)?"},
    {t:"Tabuľka", d:"Prepíš výšku každého stĺpca. Skontroluj súčet, či sedí s rozsahom súboru."},
    {t:"Výpočet", d:"Priemer, medián, modus ([[b40]]) alebo podiel v percentách počítaj z tabuľky."}
  ]},
  {tool:"histogram", ask:R`Graf známok, stĺpce sa nedajú meniť. Aký je modus a aký medián?`,
   take:R`modus je 3 (najvyšší stĺpec). Medián je 13. hodnota z 25: do dvojky ich je 10, do trojky 19, takže medián je tiež 3.`,
   cfg:{typ:"pocetnosti", nazov:"známka", drag:false}},
  {ex:R`Podľa grafu známok (3, 7, 9, 4, 2 žiakov so známkou 1 až 5) urči, koľko percent žiakov malo lepšiu známku ako 3 a aký je medián.`,
   steps:[
     ["Lepšia ako 3: jednotky a dvojky.", R`\frac{3 + 7}{25} = \frac{10}{25} = 40\,\%`],
     ["Medián je 13. hodnota v zoradení.", R`3 + 7 = 10 < 13 \leq 19 = 3 + 7 + 9`],
     ["13. hodnota je trojka.", R`\tilde{x} = 3`]
   ],
   res:"40 % žiakov, medián 3."},
  {ex:R`Stĺpcový graf predaja má zvislú os od 900 do 1 000 kusov. Stĺpec v januári siaha po 920, vo februári po 960. Vyzerá to, že sa predaj zvýšil trojnásobne. O koľko percent naozaj stúpol?`,
   steps:[
     ["Skutočné hodnoty.", R`920 \to 960`],
     ["Percentuálna zmena.", R`\frac{960 - 920}{920} \cdot 100\,\% \doteq 4{,}3\,\%`]
   ],
   res:"Len asi o 4,3 %. Stĺpce nad osou začínajúcou na 900 sú 20 a 60 vysoké, preto rozdiel vyzerá trojnásobný."},
  {warn:R`Os, ktorá nezačína nulou, zveličuje rozdiely. Výšky stĺpcov vtedy nemôžeš porovnávať pomerom, vždy čítaj čísla na osi.`}
]

  }
};
})();

/* Základný a výberový súbor, triedenie do intervalov, Bernoulliho pokusy */
(() => {
const L = v => ({v, lock:true});

THEORY.b42 = {
  mins:25,
  brief:[
    R`**Základný súbor**: všetky objekty, o ktorých chceme niečo zistiť. **Výberový súbor**: tie, ktoré naozaj skúmame. Výber má byť náhodný, aby bol reprezentatívny.`,
    R`Pri veľa rôznych hodnotách ich rozdelíme do tried rovnakej šírky. Priemer sa odhadne zo stredov tried.`,
    R`**Bernoulliho pokusy**: $n$ nezávislých opakovaní pokusu s úspechom s pravdepodobnosťou $p$.`,
    R`$P(\text{práve } k \text{ úspechov}) = \binom{n}{k} p^k (1 - p)^{n - k}$.`
  ],
  subs:{

"Základný a výberový súbor":[
  R`Chceme vedieť, koľko hodín denne spia všetci stredoškoláci na Slovensku. Opýtať sa všetkých nejde, preto sa opýtame **výberu**, napríklad 500 náhodne vybraných. Z výsledku výberu potom usudzujeme na celok.`,
  {cards:[
    {t:"Základný súbor", d:"Všetky objekty, ktoré skúmame (všetci stredoškoláci). Jeho veľkosť je rozsah N."},
    {t:"Výberový súbor", d:"Časť základného súboru, ktorú naozaj meriame alebo sa pýtame. Rozsah n."},
    {t:"Reprezentatívny výber", d:"Zodpovedá celku. Najlepšie ho zaručí náhodný výber, kde má každý rovnakú šancu."},
    {t:"Štatistický znak", d:"Vlastnosť, ktorú zisťujeme: číselný (výška, vek) alebo slovný (farba, odbor)."}
  ]},
  {tool:"pravdepodobnost", ask:R`Jav má v celom súbore pravdepodobnosť $p$. Rob výbery (10, 100, 1 000) a sleduj relatívnu početnosť vo výbere.`,
   take:R`malý výber sa od skutočného podielu môže výrazne líšiť. Čím väčší výber, tým bližšie je jeho podiel k podielu v celom súbore.`,
   cfg:{typ:"pokus", pokus:"jav", p:{v:.3}}},
  {ex:R`Na škole je 2 000 žiakov. Z náhodného výberu 400 žiakov chce 120 dlhšiu prestávku. Odhadni, koľko žiakov celej školy chce dlhšiu prestávku.`,
   steps:[
     ["Podiel vo výbere.", R`\frac{120}{400} = 0{,}3 = 30\,\%`],
     ["Ten istý podiel v základnom súbore.", R`0{,}3 \cdot 2\,000 = 600`]
   ],
   res:"Asi 600 žiakov. Je to odhad, iný výber by dal trochu iné číslo."},
  {warn:R`Výber nie je reprezentatívny, keď si ho ľudia volia sami (ankety na internete) alebo keď sa pýtame len časti (iba žiakov jednej triedy, iba tých v knižnici). Taký výber skreslí výsledok bez ohľadu na to, aký je veľký.`}
],

"Triedenie do intervalov":[
  R`Keď má znak veľa rôznych hodnôt (výšky v cm, časy), tabuľka jednotlivých hodnôt je dlhá a málo prehľadná. Hodnoty rozdelíme do **tried**: intervalov rovnakej šírky, ktoré sa neprekrývajú a pokryjú všetky údaje. Každú triedu zastupuje jej **stred**.`,
  {steps:[
    {t:"Rozpätie", d:"Najmenšia a najväčšia hodnota: R = x_max − x_min."},
    {t:"Počet a šírka tried", d:"Zvyčajne 5 až 10 tried. Šírka je asi R / počet tried, zaokrúhlená na pekné číslo."},
    {t:"Hranice", d:"Intervaly tvaru ⟨a; b): ľavá hranica patrí do triedy, pravá do nasledujúcej."},
    {t:"Početnosti a stredy", d:"Spočítaj hodnoty v každej triede, stred triedy je (a + b)/2."}
  ]},
  {tool:"histogram", ask:R`Výšky 20 žiakov. Meň šírku triedy a jej začiatok. Ako sa mení histogram a odhad priemeru?`,
   take:R`rôzne triedenie dá rôzny obraz tých istých údajov. Odhad priemeru zo stredov tried sa od skutočného priemeru líši len málo.`,
   cfg:{typ:"triedenie"}},
  {tool:"histogram", kind:"uloha", ask:R`Nastav triedy šírky 10 začínajúce na 150 cm.`,
   hint:"Šírka triedy 10, začiatok prvej triedy 150.",
   take:R`triedy $\langle 150;\ 160)$ až $\langle 180;\ 190)$ majú početnosti 2, 7, 9, 2.`,
   goal:P => P.sirka === 10 && P.od === 150,
   cfg:{typ:"triedenie", on:{polygon:true}}},
  {def:"Priemer z roztriedených údajov", tex:R`\bar{x} \doteq \frac{n_1 \va{c_1} + n_2 \va{c_2} + \dots + n_k \va{c_k}}{n}`,
   note:"cᵢ je stred i-tej triedy, nᵢ jej početnosť. Je to vážený priemer stredov."},
  {ex:R`Výšky 20 žiakov sú roztriedené: $\langle 150;\ 160)$: 2, $\langle 160;\ 170)$: 7, $\langle 170;\ 180)$: 9, $\langle 180;\ 190)$: 2. Odhadni priemernú výšku.`,
   steps:[
     ["Stredy tried.", R`155,\ 165,\ 175,\ 185`],
     ["Vážený priemer.", R`\bar{x} \doteq \frac{2 \cdot 155 + 7 \cdot 165 + 9 \cdot 175 + 2 \cdot 185}{20} = \frac{3\,410}{20} = 170{,}5`]
   ],
   res:"Asi 170,5 cm. Presný priemer pôvodných údajov je 170,2 cm."},
  {warn:R`Stred triedy $\langle 160;\ 170)$ je 165, nie 160. A pri odhade priemeru násob stred **početnosťou** triedy, nie šírkou.`}
],

"Bernoulliho pokusy":[
  R`Niektoré pokusy majú len dva výsledky: **úspech** (s pravdepodobnosťou $p$) a **neúspech** ($1 - p$). Ak taký pokus opakujeme $n$-krát nezávisle (hod mincou, tipovanie odpovede v teste, kontrola výrobkov), hovoríme o **Bernoulliho pokusoch**.`,
  {def:"Práve k úspechov v n pokusoch", tex:R`P(X = \va{k}) = \binom{\vd{n}}{\va{k}} \vb{p}^{\va{k}} (1 - \vb{p})^{\vd{n} - \va{k}}`,
   note:"Kombinačné číslo hovorí, v ktorých k pokusoch z n nastal úspech. Každé také poradie má pravdepodobnosť pᵏ(1 − p)ⁿ⁻ᵏ."},
  {tool:"rozdelenie", ask:R`Stĺpce ukazujú $P(X = k)$ pre $n$ pokusov. Meň $n$ a $p$ a klikni na stĺpec.`,
   take:R`najvyššie stĺpce sú okolo $n \cdot p$. Pri $p = 0{,}5$ je graf súmerný, inak sa nakloní.`,
   cfg:{typ:"binom", n:10, p:.5, a:5, b:5}},
  {ex:R`Hodíme 5-krát mincou. Aká je pravdepodobnosť, že líc padne práve dvakrát?`,
   steps:[
     [R`$n = 5$, $p = \frac{1}{2}$, $k = 2$.`, R`\binom{5}{2} \left(\tfrac{1}{2}\right)^2 \left(\tfrac{1}{2}\right)^3`],
     ["Výpočet.", R`10 \cdot \frac{1}{32} = \frac{10}{32} = 0{,}3125`]
   ],
   res:R`$\frac{5}{16} = 0{,}3125$.`},
  {ex:R`Test má 10 otázok, každá má 4 možnosti a práve jednu správnu. Žiak všetko tipuje. Aká je pravdepodobnosť, že má správne práve 3 odpovede? A aspoň jednu?`,
   steps:[
     [R`$n = 10$, $p = 0{,}25$, $k = 3$.`, R`\binom{10}{3} \cdot 0{,}25^3 \cdot 0{,}75^7`],
     ["Výpočet.", R`120 \cdot 0{,}015625 \cdot 0{,}13348 \doteq 0{,}250`],
     ["Aspoň jedna: opačný jav je „ani jedna“ ([[b38]]).", R`1 - 0{,}75^{10} \doteq 1 - 0{,}0563 \doteq 0{,}944`]
   ],
   res:R`Práve 3: $\doteq 0{,}250$, aspoň jedna: $\doteq 0{,}944$.`},
  {tool:"rozdelenie", kind:"uloha", ask:R`Tipovanie testu: $n = 10$, $p = 0{,}25$. Nastav $a$ a $b$ tak, aby graf ukazoval pravdepodobnosť, že žiak má **najviac 2** správne odpovede.`,
   hint:"Najviac 2 znamená 0, 1 alebo 2: od a = 0 po b = 2.",
   take:R`$P(X \leq 2) \doteq 0{,}526$: aj pri tipovaní má žiak takmer polovičnú šancu na 3 a viac správnych.`,
   goal:P => P.a === 0 && P.b === 2,
   cfg:{typ:"binom", n:L(10), p:L(.25), a:{v:3, min:0, max:10}, b:{v:5, min:0, max:10}}},
  {ex:R`Hodíme 4-krát kockou. Aká je pravdepodobnosť, že šestka padne práve dvakrát?`,
   steps:[
     [R`$n = 4$, $p = \frac{1}{6}$, $k = 2$.`, R`\binom{4}{2} \left(\tfrac{1}{6}\right)^2 \left(\tfrac{5}{6}\right)^2`],
     ["Výpočet.", R`6 \cdot \frac{1}{36} \cdot \frac{25}{36} = \frac{150}{1\,296} \doteq 0{,}116`]
   ],
   res:R`$\frac{25}{216} \doteq 0{,}116$.`},
  {warn:R`Bez kombinačného čísla by si počítal len jedno poradie (napríklad úspech, úspech, neúspech, …). Výsledkov s $k$ úspechmi je $\binom{n}{k}$ a všetky treba sčítať.`}
]

  }
};
})();

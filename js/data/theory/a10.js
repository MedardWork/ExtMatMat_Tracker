/* Úpravy výrazov, mnohočleny, rozklad na súčin, doplnenie na štvorec */
(() => {

THEORY.a10 = {
  mins:35,
  brief:[
    R`$(a + b)^2 = a^2 + 2ab + b^2$, $(a - b)^2 = a^2 - 2ab + b^2$, $a^2 - b^2 = (a - b)(a + b)$.`,
    R`Vyberanie pred zátvorku: $ab + ac = a(b + c)$. Skúška roznásobením.`,
    R`Rozklad: najprv vyber pred zátvorku, potom vzorce, potom $x^2 + px + q = (x - x_1)(x - x_2)$.`,
    R`Doplnenie na štvorec: $x^2 + px + q = \left(x + \frac{p}{2}\right)^2 - \left(\frac{p}{2}\right)^2 + q$.`
  ],
  subs:{

"Roznásobovanie a vzorce (a ± b)², a² − b²":[
  R`Súčin dvoch zátvoriek sa roznásobí tak, že každý člen prvej vynásobíš každým členom druhej. Pri $(a + b)(c + d)$ vzniknú štyri súčiny, na obrázku štyri obdĺžniky.`,
  {def:"Roznásobenie", tex:R`(\va{a} + \vb{b})(\vc{c} + \vd{d}) = \va{a}\vc{c} + \va{a}\vd{d} + \vb{b}\vc{c} + \vb{b}\vd{d}`},
  {tool:"plochy", ask:R`Meň rozmery. Obsah celého obdĺžnika sa vždy rovná súčtu štyroch častí?`,
   take:R`áno, celý obdĺžnik je $(a + b)(c + d)$ a skladá sa zo štyroch obdĺžnikov $ac$, $ad$, $bc$, $bd$.`,
   cfg:{typ:"sucin"}},
  {def:"Vzorce", tex:R`\begin{aligned}(\va{a} + \vb{b})^2 &= \va{a}^2 + 2\va{a}\vb{b} + \vb{b}^2\\ (\va{a} - \vb{b})^2 &= \va{a}^2 - 2\va{a}\vb{b} + \vb{b}^2\\ \va{a}^2 - \vb{b}^2 &= (\va{a} - \vb{b})(\va{a} + \vb{b})\end{aligned}`},
  {tool:"plochy", ask:R`Štvorec so stranou $a + b$. Prečo to nie je len $a^2 + b^2$?`,
   take:R`okrem štvorcov $a^2$ a $b^2$ sú v ňom ešte dva obdĺžniky $a \cdot b$. To je člen $2ab$.`,
   cfg:{typ:"sucet"}},
  {tool:"plochy", ask:R`Štvorec so stranou $a - b$. Odkiaľ sa berie $+b^2$ na konci?`,
   take:R`od $a^2$ odrežeš dva pásy $a \cdot b$. Štvorček $b^2$ v rohu by si tak odrezal dvakrát, preto sa raz vráti.`,
   cfg:{typ:"rozdiel"}},
  {ex:R`Uprav: a) $(2x - 3)^2$, b) $(3a + 2b)(3a - 2b)$, c) $(x + 2)(x - 5)$.`,
   steps:[
     [R`a) Vzorec, $a = 2x$, $b = 3$.`, R`(2x)^2 - 2 \cdot 2x \cdot 3 + 3^2 = 4x^2 - 12x + 9`],
     ["b) Rozdiel štvorcov.", R`(3a)^2 - (2b)^2 = 9a^2 - 4b^2`],
     ["c) Každý s každým.", R`x^2 - 5x + 2x - 10 = x^2 - 3x - 10`]
   ],
   res:R`$4x^2 - 12x + 9$; $9a^2 - 4b^2$; $x^2 - 3x - 10$.`},
  {ex:R`Vypočítaj spamäti $51^2$ a $49 \cdot 51$.`,
   steps:[
     [R`$51 = 50 + 1$.`, R`51^2 = 2\,500 + 100 + 1 = 2\,601`],
     ["Rozdiel štvorcov.", R`49 \cdot 51 = (50 - 1)(50 + 1) = 2\,500 - 1 = 2\,499`]
   ],
   res:R`$2\,601$ a $2\,499$.`},
  {tool:"plochy", kind:"uloha", ask:R`Nastav $\va{a}$ a $\vb{b}$ tak, aby mal veľký štvorec obsah 36 a dva obdĺžniky spolu 16.`,
   hint:R`$(a + b)^2 = 36$, takže $a + b = 6$. A $2ab = 16$, teda $ab = 8$.`,
   goal:P => P.a + P.b === 6 && P.a * P.b === 8,
   cfg:{typ:"sucet", a:{v:3}, b:{v:1}}},
  {warn:R`$(a + b)^2 \neq a^2 + b^2$. Najčastejšia chyba v algebre. Skúška: $(1 + 2)^2 = 9$, ale $1^2 + 2^2 = 5$.`}
],

"Vyberanie pred zátvorku":[
  R`Vyberanie pred zátvorku je roznásobenie naopak. Ak majú všetky členy spoločného činiteľa, napíšeš ho pred zátvorku a v nej zostane, čím sa jednotlivé členy vydelili.`,
  {def:"Vyberanie pred zátvorku", tex:R`\va{a}\vc{c} + \va{a}\vd{d} = \va{a}(\vc{c} + \vd{d})`},
  {tool:"plochy", ask:R`Pozri sa len na ľavý stĺpec obdĺžnika (šírka $\va{a}$). Ako zapíšeš jeho obsah dvoma spôsobmi?`,
   take:R`ako $ac + ad$, alebo ako $a(c + d)$: stĺpec má šírku $a$ a výšku $c + d$. Spoločný rozmer $a$ ide pred zátvorku.`,
   cfg:{typ:"sucin", b:{v:1.5, lock:true}}},
  {steps:[
    {t:"Čísla", d:"Najväčší spoločný deliteľ koeficientov."},
    {t:"Premenné", d:"Každú premennú, ktorá je vo všetkých členoch, s najmenším exponentom."},
    {t:"Skúška", d:"Roznásob a porovnaj so zadaním."}
  ]},
  {ex:R`Vyber pred zátvorku: a) $6x^2y - 9xy^2$, b) $2^{10} + 2^{11}$.`,
   steps:[
     [R`a) $D(6, 9) = 3$, $x$ najmenej raz, $y$ najmenej raz.`, R`6x^2y - 9xy^2 = 3xy(2x - 3y)`],
     [R`b) $2^{11} = 2^{10} \cdot 2$.`, R`2^{10} + 2^{11} = 2^{10}(1 + 2) = 3 \cdot 2^{10}`]
   ],
   res:R`$3xy(2x - 3y)$ a $3 \cdot 2^{10}$.`},
  {ex:R`Uprav na súčin: $x(a - b) + y(b - a)$.`,
   steps:[
     [R`$b - a = -(a - b)$.`, R`x(a - b) - y(a - b)`],
     [R`Spoločná zátvorka $(a - b)$.`, R`(a - b)(x - y)`]
   ],
   res:R`$(a - b)(x - y)$`},
  {warn:R`Keď vyberieš celý člen, v zátvorke zostane 1, nie nula: $3x + 3 = 3(x + 1)$, nie $3(x)$. Skúška roznásobením to vždy odhalí.`}
],

"Rozklad na súčin":[
  R`Rozklad na súčin sa hodí pri riešení rovníc (súčin je nula, keď je nula niektorý činiteľ), pri krátení zlomkov a pri znamienkach. Postupuje sa v ustálenom poradí.`,
  {steps:[
    {t:"Pred zátvorku", d:"Vždy najprv vyber spoločného činiteľa."},
    {t:"Vzorce", d:R`Hľadaj $a^2 - b^2$, $a^2 \pm 2ab + b^2$.`},
    {t:"Trojčlen", d:R`$x^2 + px + q = (x - x_1)(x - x_2)$, kde $x_1 + x_2 = -p$, $x_1 x_2 = q$.`},
    {t:"Zoskupenie", d:"Pri štyroch členoch skús dvojice so spoločnou zátvorkou."}
  ]},
  {tool:"plochy", ask:R`Rozdiel štvorcov: z $a^2$ odrežeš $b^2$. Ako sa zvyšok poskladá do obdĺžnika?`,
   take:R`zvyšný tvar L sa dá rozrezať a preložiť na obdĺžnik so stranami $a - b$ a $a + b$.`,
   cfg:{typ:"stvorce"}},
  {ex:R`Rozlož: a) $x^3 - 4x$, b) $x^2 - 5x + 6$, c) $4x^2 + 12x + 9$.`,
   steps:[
     ["a) Vyber $x$, potom rozdiel štvorcov.", R`x(x^2 - 4) = x(x - 2)(x + 2)`],
     [R`b) Dve čísla so súčinom 6 a súčtom 5: 2 a 3.`, R`(x - 2)(x - 3)`],
     [R`c) $4x^2 = (2x)^2$, $9 = 3^2$, $12x = 2 \cdot 2x \cdot 3$.`, R`(2x + 3)^2`]
   ],
   res:R`$x(x - 2)(x + 2)$; $(x - 2)(x - 3)$; $(2x + 3)^2$.`},
  {ex:R`Rozlož zoskupením: $x^3 + 2x^2 - x - 2$.`,
   steps:[
     ["Dvojice.", R`x^2(x + 2) - (x + 2)`],
     ["Spoločná zátvorka.", R`(x + 2)(x^2 - 1)`],
     ["Rozdiel štvorcov.", R`(x + 2)(x - 1)(x + 1)`]
   ],
   res:R`$(x + 2)(x - 1)(x + 1)$`},
  {tool:"plochy", kind:"uloha", ask:R`Nastav $\va{a}$ a $\vb{b}$ tak, aby mal obdĺžnik šírku $a - b = 2$ a obsah 24.`,
   hint:R`$(a - b)(a + b) = 24$ a $a - b = 2$, takže $a + b = 12$.`,
   goal:P => P.a - P.b === 2 && P.a * P.a - P.b * P.b === 24,
   cfg:{typ:"stvorce", a:{v:5}, b:{v:2}}},
  {warn:R`Súčet štvorcov $a^2 + b^2$ sa v reálnych číslach rozložiť nedá. $x^2 + 4 \neq (x + 2)(x - 2)$, to je $x^2 - 4$.`}
],

"Doplnenie na štvorec":[
  R`Výraz $x^2 + px$ sa dá doplniť na druhú mocninu dvojčlena. Na obrázku je to štvorec $x^2$ a obdĺžnik $p \cdot x$ rozdelený na dve polovice. Chýba len malý štvorček v rohu.`,
  {def:"Doplnenie na štvorec", tex:R`x^2 + \vb{p}x + q = \left(x + \frac{\vb{p}}{2}\right)^2 - \left(\frac{\vb{p}}{2}\right)^2 + q`},
  {tool:"plochy", ask:R`Meň $\vb{p}$. Aký veľký štvorček treba doplniť?`,
   take:R`štvorček so stranou $\frac{p}{2}$, teda obsahom $\left(\frac{p}{2}\right)^2$. Ten sa pripočíta a hneď aj odčíta, aby sa výraz nezmenil.`,
   cfg:{typ:"doplnenie"}},
  {ex:R`Uprav na štvorec $x^2 + 6x + 5$ a urči najmenšiu hodnotu výrazu.`,
   steps:[
     [R`$\frac{p}{2} = 3$, doplň $3^2 = 9$.`, R`x^2 + 6x + 9 - 9 + 5`],
     ["Zbaľ do štvorca.", R`(x + 3)^2 - 4`],
     [R`Štvorec je najmenej 0, pre $x = -3$.`, R`\min = -4`]
   ],
   res:R`$(x + 3)^2 - 4$, najmenšia hodnota $-4$ pre $x = -3$. To je vrchol paraboly z [[a22]].`},
  {ex:R`Uprav $2x^2 - 8x + 3$ a $x^2 - 3x$.`,
   steps:[
     [R`Pri $a \neq 1$ najprv vyber $a$ z prvých dvoch členov.`, R`2(x^2 - 4x) + 3 = 2\big((x - 2)^2 - 4\big) + 3`],
     ["Roznásob a sčítaj.", R`2(x - 2)^2 - 8 + 3 = 2(x - 2)^2 - 5`],
     [R`$\frac{p}{2} = -\frac{3}{2}$.`, R`x^2 - 3x = \left(x - \tfrac{3}{2}\right)^2 - \tfrac{9}{4}`]
   ],
   res:R`$2(x - 2)^2 - 5$ a $\left(x - \frac{3}{2}\right)^2 - \frac{9}{4}$.`},
  {tool:"plochy", kind:"uloha", ask:R`Nastav $\vb{p}$ tak, aby výraz $x^2 + px$ doplnil štvorec so stranou $x + 4$.`,
   hint:R`Strana je $x + \frac{p}{2}$.`,
   goal:P => P.p === 8,
   cfg:{typ:"doplnenie", p:{v:3}}},
  {warn:R`Čo doplníš, musíš aj odčítať. $x^2 + 6x + 5 = (x + 3)^2 + 5$ je chyba, správne $(x + 3)^2 - 9 + 5$. A koeficient pri $x^2$ musí byť najprv 1.`}
]

  }
};
})();

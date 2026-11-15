/* Geometrická pravdepodobnosť: dĺžky a obsahy */
(() => {
const L = v => ({v, lock:true});

THEORY.b39 = {
  mins:20,
  brief:[
    R`Keď je výsledkov nekonečne veľa (bod na úsečke, bod v štvorci), pravdepodobnosť sa počíta pomerom mier.`,
    R`Na úsečke: $P = \frac{\text{dĺžka priaznivej časti}}{\text{dĺžka celej úsečky}}$.`,
    R`V rovine: $P = \frac{\text{obsah priaznivej časti}}{\text{obsah celej oblasti}}$.`,
    R`Úloha o stretnutí: dva časy príchodu sú bod štvorca, stretnutie je pás okolo uhlopriečky.`
  ],
  subs:{

"Pravdepodobnosť cez dĺžky":[
  R`Autobus chodí každých 10 minút a ty prídeš na zastávku v náhodnom okamihu. Okamihov je nekonečne veľa, takže ich nespočítame. Všetky sú však „rovnako možné“, a preto pravdepodobnosť je pomer **dĺžok**: časť intervalu, ktorá je priaznivá, ku celému intervalu.`,
  {def:"Geometrická pravdepodobnosť na úsečke", tex:R`P = \frac{\va{b} - \va{a}}{d}`,
   note:"Bod padne náhodne na úsečku dĺžky d. Priaznivá je časť od a po b."},
  {tool:"pravdepodobnost", ask:R`Bod padne náhodne na úsečku. Ťahaj značky začiatku a konca priaznivej časti.`,
   take:R`pravdepodobnosť závisí len od dĺžky priaznivej časti, nie od jej polohy.`,
   cfg:{typ:"usecka"}},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Autobus chodí každých 10 minút. Nastav priaznivú časť tak, aby zodpovedala javu „budem čakať najviac 3 minúty“.`,
   hint:"Ak autobus odíde v čase 10, čakáš najviac 3 minúty, keď prídeš medzi 7. a 10. minútou. Priaznivá dĺžka je 3.",
   take:R`$P = \frac{3}{10} = 0{,}3$.`,
   goal:P => Math.abs((P.b - P.a) / P.d - .3) < 1e-9 && P.b === 10,
   cfg:{typ:"usecka", d:L(10), a:{v:2, min:0, max:10}, b:{v:5, min:0, max:10}}},
  {ex:R`Palicu dĺžky 10 cm zlomíme v náhodnom bode. Aká je pravdepodobnosť, že dlhší kus je aspoň dvakrát dlhší ako kratší?`,
   steps:[
     [R`Bod zlomu je $x \in (0;\ 10)$. Ak $x < 5$, kratší kus je $x$ a podmienka je $10 - x \geq 2x$.`, R`x \leq \tfrac{10}{3}`],
     [R`Symetricky pre $x > 5$.`, R`x \geq \tfrac{20}{3}`],
     ["Priaznivá dĺžka.", R`\tfrac{10}{3} + \left(10 - \tfrac{20}{3}\right) = \tfrac{20}{3}`],
     ["Pravdepodobnosť.", R`P = \frac{20/3}{10} = \frac{2}{3}`]
   ],
   res:R`$\frac{2}{3} \doteq 0{,}667$.`},
  {ex:R`Náhodne zvolíme číslo $x$ z intervalu $\langle 0;\ 4 \rangle$. Aká je pravdepodobnosť, že $x^2 < 2$?`,
   steps:[
     [R`Na intervale $\langle 0;\ 4 \rangle$ platí $x^2 < 2$ pre`, R`0 \leq x < \sqrt{2}`],
     ["Pomer dĺžok.", R`P = \frac{\sqrt{2}}{4} \doteq 0{,}354`]
   ],
   res:R`$\frac{\sqrt{2}}{4} \doteq 0{,}354$.`},
  {warn:R`Celá dĺžka je dĺžka intervalu, z ktorého sa vyberá, nie najväčšie číslo. Pri výbere z $\langle 2;\ 6 \rangle$ je to 4.`}
],

"Pravdepodobnosť cez obsahy":[
  R`Ak bod padá náhodne do rovinného útvaru (šípka do terča, kvapka na dlaždicu), pravdepodobnosť zásahu časti je pomer **obsahov**. Útvar musí byť zasiahnutý určite a každé miesto rovnako možné.`,
  {def:"Geometrická pravdepodobnosť v rovine", tex:R`P = \frac{S_{\text{priaznivé}}}{S_{\text{celé}}} \qquad \text{kruh vo štvorci: } P = \frac{\pi \va{r}^2}{\vb{d}^2} \qquad \text{terč: } P = \frac{\va{r}^2}{\vb{R}^2}`},
  {tool:"pravdepodobnost", ask:R`Kruh vo štvorci. Hádž body a porovnaj podiel zásahov kruhu s vypočítanou pravdepodobnosťou.`,
   take:R`pri mnohých bodoch sa podiel zásahov blíži k pomeru obsahov. Pre kruh vpísaný do štvorca je to $\frac{\pi}{4} \doteq 0{,}785$.`,
   cfg:{typ:"plocha", tvar:"kruh"}},
  {ex:R`Do štvorca so stranou 6 cm padne náhodne bod. V strede štvorca je kruh s polomerom 2 cm. Aká je pravdepodobnosť, že bod padne do kruhu?`,
   steps:[
     ["Obsahy.", R`S_k = \pi \cdot 2^2 = 4\pi,\quad S_š = 6^2 = 36`],
     ["Pomer.", R`P = \frac{4\pi}{36} = \frac{\pi}{9} \doteq 0{,}349`]
   ],
   res:R`$\frac{\pi}{9} \doteq 0{,}349$.`},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Terč má polomer 6. Nastav polomer stredu $r$ tak, aby ho náhodná šípka (ktorá terč zasiahne) trafila s pravdepodobnosťou 0,25.`,
   hint:"(r/6)² = 1/4, teda r/6 = 1/2.",
   take:R`polovičný polomer dáva len štvrtinu obsahu.`,
   goal:P => P.r === 3,
   cfg:{typ:"plocha", tvar:"terc", R:L(6), r:{v:1, min:.5, max:6}}},
  {ex:R`Dvaja priatelia prídu na stretnutie náhodne medzi 17:00 a 18:00. Každý čaká na druhého 20 minút, potom odíde. Aká je pravdepodobnosť, že sa stretnú?`,
   steps:[
     [R`Príchody $x$, $y$ v minútach po 17:00 sú bod štvorca $60 \times 60$. Stretnú sa, keď`, R`|x - y| \leq 20`],
     ["Nepriaznivé sú dva rohové trojuholníky s odvesnami 40.", R`2 \cdot \tfrac{40 \cdot 40}{2} = 1\,600`],
     ["Pravdepodobnosť.", R`P = 1 - \frac{1\,600}{3\,600} = 1 - \frac{4}{9} = \frac{5}{9} \doteq 0{,}556`]
   ],
   res:R`$\frac{5}{9} \doteq 0{,}556$.`},
  {tool:"pravdepodobnost", ask:R`Úloha o stretnutí: meň dĺžku intervalu a čas čakania. Priaznivý je pás okolo uhlopriečky.`,
   take:R`$P = 1 - \left(\frac{d - w}{d}\right)^2$. Pre $d = 60$, $w = 20$ vyjde $\frac{5}{9}$.`,
   cfg:{typ:"plocha", tvar:"stretnutie"}},
  {tool:"pravdepodobnost", kind:"uloha", ask:R`Priatelia prídu medzi 17:00 a 18:00. Ako dlho musí každý čakať, aby sa stretli s pravdepodobnosťou $\frac{3}{4}$? Nastav $w$.`,
   hint:"((60 − w)/60)² = 1/4, teda 60 − w = 30.",
   goal:P => P.w === 30,
   cfg:{typ:"plocha", tvar:"stretnutie", d:L(60), w:{v:10, min:0, max:60}}},
  {ex:R`Náhodne zvolíme bod v štvorci $\langle 0;\ 1 \rangle \times \langle 0;\ 1 \rangle$. Aká je pravdepodobnosť, že $x + y < 1$? A že $x^2 + y^2 \leq 1$?`,
   steps:[
     [R`$x + y < 1$ je trojuholník pod uhlopriečkou, polovica štvorca.`, R`P = \tfrac{1}{2}`],
     [R`$x^2 + y^2 \leq 1$ je štvrtina kruhu s polomerom 1.`, R`P = \frac{\pi \cdot 1^2 / 4}{1} = \frac{\pi}{4} \doteq 0{,}785`]
   ],
   res:R`$\frac{1}{2}$ a $\frac{\pi}{4} \doteq 0{,}785$.`},
  {warn:R`Pri terči sa pomer polomerov umocní: stred s polovičným polomerom má štvrtinový obsah, $P = \left(\frac{1}{2}\right)^2$, nie $\frac{1}{2}$.`}
]

  }
};
})();

/* Obvody a obsahy rovinných útvarov */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);

THEORY.a33 = {
  mins:35,
  brief:[
    R`Trojuholník: $S = \frac{a \cdot v_a}{2}$, Herónov vzorec $S = \sqrt{s(s - a)(s - b)(s - c)}$, $s = \frac{a + b + c}{2}$.`,
    R`Obdĺžnik $ab$, rovnobežník $a \cdot v_a$, lichobežník $\frac{(a + c)v}{2}$, kosoštvorec $\frac{e f}{2}$.`,
    R`Kruh: $o = 2\pi r$, $S = \pi r^2$.`,
    R`Zložený útvar rozdeľ na známe časti, obsahy sčítaj alebo odčítaj.`
  ],
  subs:{

"Trojuholník":[
  R`Trojuholník je polovica rovnobežníka s rovnakou základňou a výškou. Preto je jeho obsah polovica súčinu strany a výšky na ňu. Výška je kolmá vzdialenosť vrcholu od priamky, na ktorej leží strana.`,
  {def:"Obsah trojuholníka", tex:R`S = \frac{\va{a} \cdot \vb{v_a}}{2},\qquad o = a + b + c`},
  {tool:"utvary", ask:R`Posúvaj vrchol (posun) pri pevnej základni a výške. Mení sa obsah?`,
   take:R`nie. Všetky trojuholníky s rovnakou základňou a výškou majú rovnaký obsah, aj keď vyzerajú inak. Dva také trojuholníky tvoria rovnobežník.`,
   cfg:{typ:"trojuholnik", on:{premena:true}, lock:["a", "v"]}},
  {def:"Herónov vzorec", tex:R`S = \sqrt{s(s - a)(s - b)(s - c)},\qquad s = \frac{a + b + c}{2}`, note:"Hodí sa, keď poznáš tri strany a nepoznáš výšku."},
  {ex:R`Vypočítaj obsah trojuholníka so stranami 13, 14, 15.`,
   steps:[
     ["Polovica obvodu.", R`s = \frac{13 + 14 + 15}{2} = 21`],
     ["Herónov vzorec.", R`S = \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = \sqrt{7\,056} = 84`]
   ],
   res:"$S = 84$"},
  {ex:R`Pravouhlý trojuholník má odvesny 6 a 8. Vypočítaj obsah a výšku na preponu.`,
   steps:[
     ["Odvesny sú na seba kolmé, jedna je výškou na druhú.", R`S = \frac{6 \cdot 8}{2} = 24`],
     ["Prepona a výška z obsahu.", R`c = 10,\quad v_c = \frac{2S}{c} = 4{,}8`]
   ],
   res:R`$S = 24$, $v_c = 4{,}8$.`},
  {tool:"utvary", kind:"uloha", ask:R`Základňa má dĺžku 6. Nastav výšku $\vb{v}$ tak, aby mal trojuholník obsah 15.`,
   hint:R`$\frac{6 \cdot v}{2} = 15$.`,
   goal:P => P.v === 5,
   cfg:{typ:"trojuholnik", a:L(6), v:{v:2}}},
  {warn:R`Výška nemusí ležať vnútri trojuholníka. Pri tupouhlom trojuholníku padne na predĺženie strany. A k strane $a$ patrí výška $v_a$, nie iná.`}
],

"Štvoruholníky":[
  R`Každý rovnobežník sa dá odrezaním trojuholníka a jeho presunutím premeniť na obdĺžnik s rovnakou základňou a výškou. Lichobežník sa dá doplniť na rovnobežník dvojnásobnej plochy.`,
  {def:"Obsahy štvoruholníkov", tex:R`\begin{aligned}\text{obdĺžnik: } S &= ab & \text{rovnobežník: } S &= a \cdot v_a\\ \text{lichobežník: } S &= \frac{(a + c)\,v}{2} & \text{kosoštvorec: } S &= \frac{e \cdot f}{2}\end{aligned}`},
  {tool:"utvary", ask:R`Rovnobežník. Zapni premenu na obdĺžnik a meň uhol. Mení sa obsah?`,
   take:R`obsah závisí len od základne a výšky. Pri zmene uhla sa výška zmenší a s ňou aj obsah, hoci strany ostávajú rovnaké.`,
   cfg:{typ:"rovnobeznik", on:{premena:true}}},
  {tool:"utvary", ask:R`Lichobežník. Prečo sa základne sčítajú a delia dvoma?`,
   take:R`dva rovnaké lichobežníky, jeden otočený, tvoria rovnobežník so základňou $a + c$ a rovnakou výškou. Lichobežník je jeho polovica.`,
   cfg:{typ:"lichobeznik", on:{premena:true}}},
  {ex:R`Lichobežník má základne 10 a 6 a výšku 4. Kosoštvorec má uhlopriečky 6 a 8. Vypočítaj ich obsahy a obvod kosoštvorca.`,
   steps:[
     ["Lichobežník.", R`S = \frac{(10 + 6) \cdot 4}{2} = 32`],
     ["Kosoštvorec.", R`S = \frac{6 \cdot 8}{2} = 24`],
     ["Uhlopriečky sa rozpoľujú a sú kolmé, strana z Pytagorovej vety.", R`a = \sqrt{3^2 + 4^2} = 5,\quad o = 20`]
   ],
   res:R`$32$; $24$ a obvod $20$.`},
  {tool:"utvary", kind:"uloha", ask:R`Lichobežník so základňami 8 a 4. Nastav výšku $\vb{v}$ tak, aby mal obsah 30.`,
   hint:R`$\frac{(8 + 4) \cdot v}{2} = 6v$.`,
   goal:P => P.v === 5,
   cfg:{typ:"lichobeznik", a:L(8), c:L(4), v:{v:2}}},
  {warn:R`Obsah rovnobežníka nie je $a \cdot b$ (súčin strán), ale $a \cdot v_a$. Rovná sa $ab$ len pri obdĺžniku.`}
],

"Kruh":[
  R`Obvod kruhu (dĺžka kružnice) je vždy $\pi$-krát väčší než priemer. Číslo $\pi \doteq 3{,}14159$ je iracionálne. Obsah kruhu je $\pi r^2$: kruh rozrezaný na tenké výseky sa dá poskladať takmer do obdĺžnika so stranami $\pi r$ a $r$.`,
  {def:"Kruh", tex:R`o = 2\pi \vb{r} = \pi d,\qquad S = \pi \vb{r}^2`},
  {tool:"kruh", ask:R`Meň polomer $\vb{r}$. Koľkokrát sa zväčší obsah, keď polomer zdvojnásobíš?`,
   take:R`obvod sa zdvojnásobí, obsah sa zväčší štyrikrát, lebo závisí od $r^2$.`,
   cfg:{typ:"vysek", alfa:L(360), out:(P, h) => h.calc(R`o = 2\pi \cdot \vb{${h.tn(P.r)}} \doteq ${t2(h, 2 * Math.PI * P.r)}`) + h.calc(R`S = \pi \cdot \vb{${h.tn(P.r)}}^2 \doteq ${t2(h, Math.PI * P.r * P.r)}`)}},
  {ex:R`Vypočítaj obvod a obsah kruhu s polomerom 5 cm. Potom polomer kruhu s obvodom $12\pi$.`,
   steps:[
     ["Obvod a obsah.", R`o = 10\pi \doteq 31{,}42,\quad S = 25\pi \doteq 78{,}54`],
     ["Z obvodu polomer.", R`2\pi r = 12\pi \;\Rightarrow\; r = 6,\quad S = 36\pi`]
   ],
   res:R`$31{,}42$ cm a $78{,}54$ cm²; $r = 6$.`},
  {tool:"kruh", kind:"uloha", ask:R`Nastav polomer $\vb{r}$ tak, aby mal kruh obsah $9\pi$.`,
   hint:R`$\pi r^2 = 9\pi$.`,
   goal:P => P.r === 3,
   cfg:{typ:"vysek", alfa:L(360), r:{v:5}, out:(P, h) => h.calc(R`o = 2\pi \cdot \vb{${h.tn(P.r)}} \doteq ${t2(h, 2 * Math.PI * P.r)}`) + h.calc(R`S = \pi \cdot \vb{${h.tn(P.r)}}^2 \doteq ${t2(h, Math.PI * P.r * P.r)}`)}},
  {warn:R`Obvod a obsah sa ľahko zamenia. Pomôže jednotka: obsah je v cm², preto obsahuje $r^2$. Obvod je dĺžka v cm, obsahuje $r$.`}
],

"Zložené útvary":[
  R`Zložitejší útvar rozdeľ na známe časti (obdĺžniky, trojuholníky, kruhy, polkruhy). Obsahy sčítaj, alebo od väčšieho útvaru odčítaj to, čo v ňom chýba. Pri obvode počítaj len vonkajšiu hranicu.`,
  {tool:"graf", kind:"obr", ask:R`Obdĺžnik $10 \times 6$ s polkruhom na kratšej strane.`,
   take:R`obsah = obdĺžnik + polkruh. Do obvodu nepatrí strana, na ktorej polkruh sedí: tri strany obdĺžnika a polovica kružnice.`,
   cfg:{view:[-1, 7.5, 14, -1], tick:2, fns:[],
     show:[{poly:[[0, 0], [10, 0], [10, 6], [0, 6]], color:"b"}, {curve:["10+3cos(t)", "3+3sin(t)"], t:["-pi/2", "pi/2"], color:"a"}, {poly:[[10, 0], [10, 6], ["10+3cos(pi/4)", "3+3sin(pi/4)"], [13, 3], ["10+3cos(pi/4)", "3-3sin(pi/4)"]], color:"a"}],
     out:(P, h) => h.calc(R`S = 10 \cdot 6 + \frac{\pi \cdot 3^2}{2} \doteq ${t2(h, 60 + 4.5 * Math.PI)}`) + h.calc(R`o = 10 + 6 + 10 + \pi \cdot 3 \doteq ${t2(h, 26 + 3 * Math.PI)}`)}},
  {ex:R`Vypočítaj obsah a obvod útvaru: obdĺžnik $10 \times 6$ cm, na jeho kratšej strane je vonkajší polkruh.`,
   steps:[
     ["Obsah: obdĺžnik plus polkruh s polomerom 3.", R`S = 60 + \frac{9\pi}{2} \doteq 74{,}14`],
     ["Obvod: dve dlhé strany, jedna krátka a polkružnica.", R`o = 10 + 10 + 6 + 3\pi \doteq 35{,}42`]
   ],
   res:R`$S \doteq 74{,}14$ cm², $o \doteq 35{,}42$ cm.`},
  {ex:R`Zo štvorca so stranou 4 cm vystrihneme najväčší kruh. Aký obsah má odpad?`,
   steps:[
     ["Kruh vpísaný do štvorca má polomer polovicu strany.", R`r = 2`],
     ["Odčítaj.", R`S = 16 - 4\pi \doteq 3{,}43`]
   ],
   res:R`$16 - 4\pi \doteq 3{,}43$ cm², asi $21\,\%$ štvorca.`},
  {warn:R`Do obvodu zloženého útvaru nepatria vnútorné hranice medzi časťami. Strana obdĺžnika, na ktorej sedí polkruh, nie je na okraji útvaru.`}
]

  }
};
})();

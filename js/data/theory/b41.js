/* Rozptyl a smerodajná odchýlka */
(() => {
const BASE = [2, 4, 4, 4, 5, 5, 7, 9];

THEORY.b41 = {
  mins:20,
  brief:[
    R`Priemer nehovorí, ako sú hodnoty rozptýlené. Na to slúži **rozptyl** $s^2$: priemer druhých mocnín odchýlok od priemeru.`,
    R`$s^2 = \frac{(x_1 - \bar{x})^2 + \dots + (x_n - \bar{x})^2}{n}$, alebo $s^2 = \overline{x^2} - \bar{x}^2$ (priemer štvorcov mínus štvorec priemeru).`,
    R`**Smerodajná odchýlka** $s = \sqrt{s^2}$ má rovnaké jednotky ako údaje.`,
    R`Pripočítanie konštanty $s$ nezmení, vynásobenie číslom $k$ ho vynásobí $|k|$.`
  ],
  subs:{

"Rozptyl":[
  R`Dve triedy môžu mať rovnaký priemer 5, a predsa sa líšia: v jednej majú všetci okolo 5, v druhej sú hodnoty od 1 po 9. Mieru „rozhádzanosti“ dostaneme z **odchýlok** $x_i - \bar{x}$. Ich súčet je vždy 0, preto ich umocníme a spriemerujeme.`,
  {def:"Rozptyl", tex:R`s^2 = \frac{(x_1 - \va{\bar{x}})^2 + (x_2 - \va{\bar{x}})^2 + \dots + (x_n - \va{\bar{x}})^2}{n} \qquad s^2 = \frac{x_1^2 + \dots + x_n^2}{n} - \va{\bar{x}}^2`,
   note:"Druhý tvar je priemer druhých mocnín mínus druhá mocnina priemeru. Pri desatinnom priemere sa počíta rýchlejšie."},
  {tool:"statistika", ask:R`Súbor 4, 5, 5, 5, 6. Ťahaj bodky ďalej od priemeru a sleduj odchýlky a rozptyl.`,
   take:R`priemer sa nemusí zmeniť, ale rozptyl rastie, keď sa hodnoty vzďaľujú od priemeru. Vzdialené hodnoty vážia najviac, lebo sa umocňujú.`,
   cfg:{data:[4, 5, 5, 5, 6], min:0, max:10, on:{mean:true, median:false, var:true}}},
  {tool:"statistika", ask:R`Súbor 1, 3, 5, 7, 9 má rovnaký priemer ako predošlý. Porovnaj rozptyly.`,
   take:R`priemer je v oboch 5, rozptyl $0{,}4$ oproti $8$. Rozptyl rozlíši to, čo priemer nevidí.`,
   cfg:{data:[1, 3, 5, 7, 9], min:0, max:10, on:{mean:true, median:false, var:true}}},
  {ex:R`Vypočítaj rozptyl súboru 2, 4, 4, 4, 5, 5, 7, 9.`,
   steps:[
     ["Priemer.", R`\bar{x} = \frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \frac{40}{8} = 5`],
     ["Druhé mocniny odchýlok.", R`9,\ 1,\ 1,\ 1,\ 0,\ 0,\ 4,\ 16`],
     ["Rozptyl.", R`s^2 = \frac{32}{8} = 4`]
   ],
   res:R`$s^2 = 4$.`},
  {tool:"statistika", kind:"uloha", ask:R`Prostredná hodnota je 5. Posuň krajné bodky tak, aby bol rozptyl troch hodnôt presne 6.`,
   hint:"Skús ich dať symetricky okolo 5: (d² + 0 + d²)/3 = 6, teda d = 3.",
   goal:(P, st) => Math.abs(statOf(st.data).var - 6) < 1e-9,
   cfg:{data:[3, 5, 7], min:0, max:10, drag:[0, 2], on:{mean:true, median:false, var:true}}},
  {ex:R`Známky z písomky: jednotka 3-krát, dvojka 7-krát, trojka 9-krát, štvorka 4-krát, päťka 2-krát. Vypočítaj rozptyl.`,
   steps:[
     ["Priemer (vážený).", R`\bar{x} = \frac{3 + 14 + 27 + 16 + 10}{25} = 2{,}8`],
     ["Priemer druhých mocnín.", R`\overline{x^2} = \frac{3 \cdot 1 + 7 \cdot 4 + 9 \cdot 9 + 4 \cdot 16 + 2 \cdot 25}{25} = \frac{226}{25} = 9{,}04`],
     ["Rozptyl.", R`s^2 = 9{,}04 - 2{,}8^2 = 9{,}04 - 7{,}84 = 1{,}2`]
   ],
   res:R`$s^2 = 1{,}2$.`},
  {warn:R`Odchýlky treba umocniť **pred** sčítaním. Súčet samotných odchýlok $x_i - \bar{x}$ je vždy 0, a $(\sum x_i)^2$ nie je to isté ako $\sum x_i^2$.`}
],

"Smerodajná odchýlka":[
  R`Rozptyl má štvorcové jednotky (cm², body²), preto sa ťažko porovnáva s údajmi. Jeho odmocnina, **smerodajná odchýlka**, má rovnaké jednotky ako údaje a hovorí, ako ďaleko od priemeru typicky ležia hodnoty.`,
  {def:"Smerodajná odchýlka", tex:R`s = \sqrt{s^2} \qquad \text{v intervale } \langle \va{\bar{x}} - s;\ \va{\bar{x}} + s \rangle \text{ leží zvyčajne väčšina hodnôt}`},
  {tool:"statistika", ask:R`Súbor 2, 4, 4, 4, 5, 5, 7, 9 s vyznačeným pásom $\bar{x} \pm s$. Koľko hodnôt leží v páse?`,
   take:R`$s = 2$, pás je $\langle 3;\ 7 \rangle$ a leží v ňom 6 z 8 hodnôt. Hodnoty 2 a 9 sú „nezvyčajne“ ďaleko.`,
   cfg:{data:BASE.slice(), min:0, max:10, on:{mean:true, median:false, var:true}}},
  {ex:R`Dve skupiny majú v teste body: A: 72, 75, 78, 80, 85; B: 60, 70, 78, 88, 94. Porovnaj ich.`,
   steps:[
     ["Priemery.", R`\bar{x}_A = \frac{390}{5} = 78,\quad \bar{x}_B = \frac{390}{5} = 78`],
     ["Rozptyl A: odchýlky −6, −3, 0, 2, 7.", R`s_A^2 = \frac{36 + 9 + 0 + 4 + 49}{5} = 19{,}6,\quad s_A \doteq 4{,}43`],
     ["Rozptyl B: odchýlky −18, −8, 0, 10, 16.", R`s_B^2 = \frac{324 + 64 + 0 + 100 + 256}{5} = 148{,}8,\quad s_B \doteq 12{,}2`]
   ],
   res:"Priemer je rovnaký (78), ale skupina B je oveľa rozkolísanejšia: smerodajná odchýlka asi 12,2 bodu oproti 4,4."},
  R`Ako sa zmení $s$, keď všetkým pridáme rovnaký počet bodov alebo body prepočítame na percentá? Posun všetkých hodnôt nemení vzdialenosti medzi nimi, násobenie ich natiahne.`,
  {def:"Zmena údajov", tex:R`y_i = \vb{k}\,x_i + \vd{c} \quad\Rightarrow\quad \bar{y} = \vb{k}\,\bar{x} + \vd{c} \qquad s_y = |\vb{k}|\,s_x`},
  {tool:"statistika", ask:R`Hodnoty $\vb{k} \cdot x + \vd{c}$ pre súbor 2, 4, 4, 4, 5, 5, 7, 9. Meň $c$, potom $k$. Čo sa deje s priemerom a so smerodajnou odchýlkou?`,
   take:R`posun $c$ posunie aj priemer, no $s$ ostáva 2. Násobenie $k$ vynásobí priemer aj $s$.`,
   cfg:{min:-2, max:22, on:{mean:true, median:false, var:true},
     params:{k:{v:1, min:.5, max:2, step:.5, color:"b"}, c:{v:0, min:-2, max:4, step:1, color:"d"}},
     dataFn:P => BASE.map(v => P.k * v + P.c),
     out:(P, h) => h.calc(R`\va{\bar{x}} = ${h.tn(h.stat.mean)} \qquad s = ${h.tn(h.stat.sd)}`)}},
  {ex:R`Súbor má priemer 12 a smerodajnú odchýlku 3. Každú hodnotu vynásobíme 2 a pripočítame 5. Aký je nový priemer, smerodajná odchýlka a rozptyl?`,
   steps:[
     ["Priemer.", R`2 \cdot 12 + 5 = 29`],
     ["Smerodajná odchýlka: pripočítanie ju nemení.", R`2 \cdot 3 = 6`],
     ["Rozptyl.", R`6^2 = 36 = 2^2 \cdot 3^2`]
   ],
   res:"Priemer 29, smerodajná odchýlka 6, rozptyl 36."},
  {warn:R`Rozptyl sa pri násobení $k$ zmení $k^2$-krát, smerodajná odchýlka len $|k|$-krát. A $s$ nie je nikdy záporná.`}
]

  }
};
})();

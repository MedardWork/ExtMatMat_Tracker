/* Deliteľnosť, prvočísla, prvočíselný rozklad, NSD a NSN */
(() => {
const L = v => ({v, lock:true});
const lcm = (a, b) => a / gcdOf(a, b) * b;

THEORY.a5 = {
  mins:35,
  brief:[
    R`Deliteľnosť 3 a 9: ciferný súčet. 4: posledné dvojčíslie. 8: posledné trojčíslie. 6: deliteľné 2 aj 3.`,
    R`Prvočíslo má práve dva delitele, 1 a samo seba. Číslo 1 nie je prvočíslo.`,
    R`$D(a, b)$: spoločné prvočísla s **menším** exponentom. $n(a, b)$: všetky prvočísla s **väčším** exponentom. $D \cdot n = a \cdot b$.`,
    R`„Rozdeliť na čo najväčšie rovnaké časti“ → $D$. „Kedy sa znova stretnú“ → $n$.`
  ],
  subs:{

"Pravidlá deliteľnosti":[
  R`Číslo $a$ je **deliteľné** číslom $d$, ak $a : d$ vyjde bez zvyšku. Hovoríme aj, že $d$ je deliteľ $a$ a $a$ je násobok $d$. Pri malých deliteľoch sa to dá zistiť bez delenia.`,
  R`| deliteľ | pravidlo |
|---|---|
| 2 | posledná číslica párna |
| 3 | ciferný súčet deliteľný 3 |
| 4 | posledné dvojčíslie deliteľné 4 |
| 5 | posledná číslica 0 alebo 5 |
| 6 | deliteľné 2 aj 3 |
| 8 | posledné trojčíslie deliteľné 8 |
| 9 | ciferný súčet deliteľný 9 |
| 10 | posledná číslica 0 |
| 25 | posledné dvojčíslie 00, 25, 50, 75 |`,
  {tool:"rozklad", ask:R`Meň číslo $\va{a}$ a pozri si všetky jeho delitele. Ktoré čísla majú veľa deliteľov?`,
   take:R`najviac deliteľov majú čísla poskladané z malých prvočísel, napríklad $60 = 2^2 \cdot 3 \cdot 5$ ich má 12.`,
   cfg:{a:{v:60, max:200}, on:{delitele:true}}},
  {ex:R`Je číslo $7\,452$ deliteľné 3, 4, 6 a 9?`,
   steps:[
     ["Ciferný súčet.", R`7 + 4 + 5 + 2 = 18`],
     ["18 je deliteľné 3 aj 9.", R`3 \mid 7\,452,\quad 9 \mid 7\,452`],
     ["Posledné dvojčíslie 52 je deliteľné 4. Číslo je párne a deliteľné 3, teda aj 6.", R`4 \mid 7\,452,\quad 6 \mid 7\,452`]
   ],
   res:"Áno, všetkými štyrmi."},
  {ex:R`Akú číslicu treba doplniť za $x$, aby bolo číslo $5x8$ deliteľné deviatimi?`,
   steps:[
     ["Ciferný súčet.", R`5 + x + 8 = 13 + x`],
     [R`Najbližší násobok 9 je 18 (27 by potrebovalo $x = 14$).`, R`13 + x = 18 \;\Rightarrow\; x = 5`]
   ],
   res:R`$x = 5$, číslo $558 = 9 \cdot 62$.`},
  {tool:"rozklad", kind:"uloha", ask:R`Nastav najmenšie trojciferné číslo, ktoré je deliteľné 2, 3 aj 5.`,
   hint:R`Je to násobok $2 \cdot 3 \cdot 5 = 30$.`,
   goal:P => P.a === 120,
   cfg:{a:{v:100, max:300}, on:{delitele:true}}},
  {warn:R`Z deliteľnosti 4 a 6 nevyplýva deliteľnosť 24: číslo 12 je deliteľné 4 aj 6, ale nie 24. Pravidlo „deliteľné $a$ aj $b$, teda aj $a \cdot b$“ platí len pre nesúdeliteľné $a$, $b$, napríklad 6 = 2 · 3.`}
],

"Prvočísla a zložené čísla":[
  R`**Prvočíslo** je prirodzené číslo, ktoré má práve dva delitele: 1 a samo seba. Číslo s viac deliteľmi je **zložené**. Číslo 1 nie je ani jedno, má len jedného deliteľa.`,
  {def:"Prvočísla do 50", tex:R`2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19,\ 23,\ 29,\ 31,\ 37,\ 41,\ 43,\ 47`, note:"2 je jediné párne prvočíslo."},
  R`Ako zistiť, či je číslo $n$ prvočíslo? Stačí ho skúsiť deliť prvočíslami po $\sqrt{n}$. Keby malo väčšieho deliteľa, druhý činiteľ by bol menší než $\sqrt{n}$ a už by sme ho našli.`,
  {tool:"rozklad", ask:R`Meň $\va{a}$ a hľadaj prvočísla. Ktoré nepárne čísla nie sú prvočísla, hoci tak vyzerajú?`,
   take:R`napríklad $91 = 7 \cdot 13$, $119 = 7 \cdot 17$ alebo $221 = 13 \cdot 17$. Nepárnosť ani koncovka 1, 3, 7, 9 nestačí.`,
   cfg:{a:{v:91, max:300}}},
  {ex:R`Sú čísla 97 a 221 prvočísla?`,
   steps:[
     [R`$\sqrt{97} \doteq 9{,}8$. Skús 2, 3, 5, 7: žiadne nedelí.`, R`97 \text{ je prvočíslo}`],
     [R`$\sqrt{221} \doteq 14{,}9$. Skús 2, 3, 5, 7, 11, 13.`, R`221 = 13 \cdot 17`]
   ],
   res:"97 je prvočíslo, 221 je zložené."},
  {tool:"rozklad", kind:"uloha", ask:R`Nastav najmenšie prvočíslo väčšie než 100.`,
   hint:R`101: $\sqrt{101} \doteq 10$, skús 2, 3, 5, 7.`,
   goal:P => P.a === 101,
   cfg:{a:{v:90, max:200}}},
  {warn:R`Číslo 1 nie je prvočíslo a 2 je prvočíslo, hoci je párne. Na maturite sa na to často pýtajú v úlohách typu „koľko prvočísel je medzi…“.`}
],

"Prvočíselný rozklad":[
  R`Každé prirodzené číslo väčšie než 1 sa dá zapísať ako súčin prvočísel, a to jediným spôsobom (až na poradie). Rozklad sa hľadá postupným delením najmenšími prvočíslami.`,
  {tool:"rozklad", ask:R`Meň $\va{a}$ a sleduj rebrík delenia. Ktorým prvočíslom sa delí najprv?`,
   take:R`vždy najmenším, ktoré číslo delí. Keď už 2 nedelí, ide 3, potom 5 a tak ďalej, až kým nezostane 1.`,
   cfg:{a:{v:360, max:999}}},
  {def:"Počet deliteľov", tex:R`a = p^{\va{e}} \cdot q^{\vb{f}} \cdot r^{\vd{g}} \;\Rightarrow\; \text{počet deliteľov} = (\va{e} + 1)(\vb{f} + 1)(\vd{g} + 1)`},
  {ex:R`Rozlož 360 na prvočísla a urči počet jeho deliteľov.`,
   steps:[
     ["Deľ postupne.", R`360 \to 180 \to 90 \to 45 \to 15 \to 5 \to 1`],
     ["Deliteľmi boli 2, 2, 2, 3, 3, 5.", R`360 = 2^3 \cdot 3^2 \cdot 5`],
     ["Počet deliteľov.", R`(3 + 1)(2 + 1)(1 + 1) = 24`]
   ],
   res:R`$360 = 2^3 \cdot 3^2 \cdot 5$, má 24 deliteľov.`},
  {tool:"rozklad", kind:"uloha", ask:R`Nastav číslo, ktorého prvočíselný rozklad je $2^2 \cdot 3 \cdot 5^2$.`,
   hint:R`$4 \cdot 3 \cdot 25$.`,
   goal:P => P.a === 300,
   cfg:{a:{v:200, max:500}}},
  {warn:R`V prvočíselnom rozklade sú len prvočísla. $360 = 4 \cdot 9 \cdot 10$ je súčin, ale nie prvočíselný rozklad, lebo 4, 9 ani 10 nie sú prvočísla.`}
],

"Najväčší spoločný deliteľ (NSD)":[
  R`**Najväčší spoločný deliteľ** $D(a, b)$ je najväčšie číslo, ktoré delí $a$ aj $b$. Z rozkladov ho poskladáš zo spoločných prvočísel, každé s menším z oboch exponentov.`,
  {def:"Najväčší spoločný deliteľ", tex:R`D(\va{a}, \vb{b}) = \text{spoločné prvočísla s menším exponentom}`, note:R`Ak $D(a, b) = 1$, čísla sú **nesúdeliteľné**.`},
  {tool:"rozklad", ask:R`Meň $\va{a}$ a $\vb{b}$. Ktoré prvočísla sa dostanú do $D$?`,
   take:R`len tie, ktoré sú v oboch rozkladoch, s menším exponentom. Pre $84 = 2^2 \cdot 3 \cdot 7$ a $120 = 2^3 \cdot 3 \cdot 5$ je $D = 2^2 \cdot 3 = 12$.`,
   cfg:{a:{v:84}, b:{v:120}, on:{dva:true}}},
  {ex:R`Vykráť zlomok $\dfrac{84}{120}$ na základný tvar.`,
   steps:[
     ["Najväčší spoločný deliteľ.", R`D(84, 120) = 12`],
     ["Vydeľ čitateľa aj menovateľa.", R`\frac{84 : 12}{120 : 12} = \frac{7}{10}`]
   ],
   res:R`$\dfrac{7}{10}$`},
  R`Pri veľkých číslach je rýchlejší **Euklidov algoritmus**: väčšie číslo vydeľ menším, potom deliteľa zvyškom a tak ďalej. Posledný nenulový zvyšok je $D$.`,
  {tool:"rozklad", ask:R`Pozri si Euklidov algoritmus pre 1071 a 462. Koľko krokov treba?`,
   take:R`tri delenia: $1071 = 2 \cdot 462 + 147$, $462 = 3 \cdot 147 + 21$, $147 = 7 \cdot 21$. Teda $D = 21$.`,
   cfg:{a:{v:1071, max:5000}, b:{v:462, max:5000}, on:{dva:true, euklid:true}}},
  {tool:"rozklad", kind:"uloha", ask:R`Nastav $\vb{b}$ väčšie než 48 tak, aby $D(48, b) = 16$.`,
   hint:R`$b$ musí byť násobok 16, ale nie násobok 48 ani 32.`,
   goal:P => P.b > 48 && gcdOf(48, P.b) === 16,
   cfg:{a:L(48), b:{v:60, max:200}, on:{dva:true}}},
  {warn:R`Nesúdeliteľné neznamená prvočísla. 8 a 9 nie sú prvočísla, ale $D(8, 9) = 1$, sú nesúdeliteľné.`}
],

"Najmenší spoločný násobok (NSN)":[
  R`**Najmenší spoločný násobok** $n(a, b)$ je najmenšie kladné číslo deliteľné $a$ aj $b$. Musí obsahovať všetky prvočísla z oboch rozkladov, každé s väčším exponentom.`,
  {def:"Najmenší spoločný násobok", tex:R`n(\va{a}, \vb{b}) = \text{všetky prvočísla s väčším exponentom},\qquad D \cdot n = \va{a} \cdot \vb{b}`},
  {tool:"rozklad", ask:R`Meň $\va{a}$ a $\vb{b}$ a porovnaj $D$ a $n$. Kedy je $n = a \cdot b$?`,
   take:R`práve pre nesúdeliteľné čísla, keď $D = 1$. Inak je $n$ menší, lebo spoločné prvočísla sa počítajú len raz.`,
   cfg:{a:{v:12, max:100}, b:{v:18, max:100}, on:{dva:true}}},
  {ex:R`Vypočítaj $n(84, 120)$.`,
   steps:[
     ["Rozklady.", R`84 = 2^2 \cdot 3 \cdot 7,\quad 120 = 2^3 \cdot 3 \cdot 5`],
     ["Všetky prvočísla s väčším exponentom.", R`n = 2^3 \cdot 3 \cdot 5 \cdot 7 = 840`],
     ["Kontrola.", R`D \cdot n = 12 \cdot 840 = 10\,080 = 84 \cdot 120`]
   ],
   res:R`$n(84, 120) = 840$`},
  {ex:R`Sčítaj $\dfrac{5}{12} + \dfrac{7}{18}$.`,
   steps:[
     ["Spoločný menovateľ je najmenší spoločný násobok.", R`n(12, 18) = 2^2 \cdot 3^2 = 36`],
     ["Rozšír a sčítaj.", R`\frac{15}{36} + \frac{14}{36} = \frac{29}{36}`]
   ],
   res:R`$\dfrac{29}{36}$`},
  {tool:"rozklad", kind:"uloha", ask:R`Nastav $\vb{b}$ tak, aby $n(6, b) = 30$ a $b \neq 30$.`,
   hint:R`$30 = 2 \cdot 3 \cdot 5$. V $b$ musí byť päťka.`,
   goal:P => P.b !== 30 && lcm(6, P.b) === 30,
   cfg:{a:L(6), b:{v:8, max:60}, on:{dva:true}}},
  {warn:R`$n(a, b)$ nie je vždy $a \cdot b$. $n(12, 18) = 36$, nie 216. Súčin je spoločný násobok, ale zvyčajne nie najmenší.`}
],

"Slovné úlohy na NSD a NSN":[
  R`V slovnej úlohe treba rozhodnúť, či ide o deliteľa, alebo o násobok. Pomôže otázka: hľadám niečo **menšie** než zadané čísla (veľkosť časti), alebo **väčšie** (čas, keď sa veci zopakujú)?`,
  {cards:[
    {t:R`$D(a, b)$`, d:"Rozdeliť bezo zvyšku na čo najväčšie rovnaké časti. Najväčšia dlaždica, najviac rovnakých balíčkov."},
    {t:R`$n(a, b)$`, d:"Kedy sa znova stretnú, najmenší spoločný počet. Autobusy, ozubené kolesá, najkratšia dĺžka."}
  ]},
  {ex:R`Z 48 červených a 36 bielych ruží chceme urobiť čo najviac rovnakých kytíc a použiť všetky ruže. Koľko kytíc to bude a aké?`,
   steps:[
     ["Počet kytíc musí deliť 48 aj 36, a má byť najväčší.", R`D(48, 36) = 12`],
     ["Ruže v jednej kytici.", R`48 : 12 = 4,\quad 36 : 12 = 3`]
   ],
   res:"12 kytíc, v každej 4 červené a 3 biele ruže."},
  {tool:"rozklad", ask:R`Pre úlohu s ružami: prečo $D$, a nie $n$?`,
   take:R`počet kytíc delí počet ruží, je menší než 48 aj 36. Spoločný násobok by bol väčší než počet ruží, ktoré máme.`,
   cfg:{a:L(48), b:L(36), on:{dva:true}}},
  {ex:R`Z autobusovej stanice odchádza linka A každých 12 minút, linka B každých 18 minút. O 8:00 odišli spolu. Kedy najskôr odídu znova spolu?`,
   steps:[
     ["Čas musí byť násobkom 12 aj 18, najmenší.", R`n(12, 18) = 36`],
     ["Pripočítaj k 8:00.", R`8{:}00 + 36 \text{ min} = 8{:}36`]
   ],
   res:"O 8:36."},
  {ex:R`Podlahu s rozmermi $360 \times 240$ cm treba pokryť rovnakými štvorcovými dlaždicami bez rezania. Aké najväčšie dlaždice sa dajú použiť a koľko ich treba?`,
   steps:[
     ["Strana dlaždice delí obe dĺžky.", R`D(360, 240) = 120`],
     ["Počet dlaždíc.", R`\frac{360}{120} \cdot \frac{240}{120} = 3 \cdot 2 = 6`]
   ],
   res:"Dlaždice $120 \\times 120$ cm, treba ich 6."},
  {tool:"rozklad", kind:"uloha", ask:R`Linka A chodí každých 12 minút. Nastav interval linky B (v minútach, iný než 60), aby sa obe linky prvýkrát znova stretli po 60 minútach.`,
   hint:R`Potrebuješ $n(12, b) = 60$. V $b$ musí byť päťka.`,
   goal:P => P.b !== 60 && lcm(12, P.b) === 60,
   cfg:{a:L(12), b:{v:18, max:60}, on:{dva:true}}},
  {warn:R`Výsledok porovnaj so zadaním. Ak „najväčšia dlaždica“ vyšla väčšia než miestnosť alebo „najbližší spoločný odchod“ skôr než odchody samotné, použil si nesprávne $D$ a $n$.`}
]

  }
};
})();

/* Pozičné číselné sústavy — dvojková, šestnástková, rímske čísla */
(() => {
const L = v => ({v, lock:true});

THEORY.a4 = {
  mins:30,
  brief:[
    R`V sústave so základom $z$ má číslica na $k$-tom mieste sprava hodnotu číslica $\cdot\ z^k$ (počíta sa od $k = 0$).`,
    R`Do desiatkovej: sčítaj číslice krát mocniny základu. Z desiatkovej: opakovane deľ základom, zvyšky čítaj zdola.`,
    R`Šestnástková sústava má číslice $0$–$9$ a $A$–$F$ ($A = 10$, …, $F = 15$). Jedna šestnástková číslica = štyri dvojkové.`,
    R`Rímske: I 1, V 5, X 10, L 50, C 100, D 500, M 1000. Menšia číslica pred väčšou sa odčíta: IV, IX, XL, XC, CD, CM.`
  ],
  subs:{

"Princíp pozičnej sústavy":[
  R`V desiatkovej sústave znamená číslica 3 v čísle $352$ tri stovky, v čísle $53$ tri jednotky. Hodnota číslice závisí od **pozície**. Každé miesto doľava má hodnotu desaťkrát väčšiu, lebo základ je 10.`,
  {def:"Číslo v sústave so základom z", tex:R`(a_k \ldots a_1 a_0)_{\va{z}} = a_k \cdot \va{z}^k + \cdots + a_1 \cdot \va{z} + a_0`, legend:[
    ["z", "a", "základ", "koľko rôznych číslic sústava má: $0$ až $z - 1$"]
  ]},
  {tool:"sustavy", ask:R`Číslo 45 zapíš v rôznych sústavách. Meň základ $\va{z}$. Ako sa mení počet číslic?`,
   take:R`čím menší základ, tým viac číslic treba. V dvojkovej má 45 šesť číslic, v desiatkovej dve, v šestnástkovej $2D$.`,
   cfg:{n:L(45), b:{v:2, name:"z"}, on:{rady:true}}},
  {ex:R`Preveď do desiatkovej sústavy $(2047)_8$ a $(1203)_4$.`,
   steps:[
     [R`Mocniny osmičky: $1, 8, 64, 512$.`, R`2 \cdot 512 + 0 \cdot 64 + 4 \cdot 8 + 7 = 1\,063`],
     [R`Mocniny štvorky: $1, 4, 16, 64$.`, R`1 \cdot 64 + 2 \cdot 16 + 0 \cdot 4 + 3 = 99`]
   ],
   res:R`$(2047)_8 = 1\,063$, $(1203)_4 = 99$.`},
  {tool:"sustavy", kind:"uloha", ask:R`Nájdi základ $\va{z}$, v ktorom sa číslo 100 zapíše ako $(144)_z$.`,
   hint:R`$z^2 + 4z + 4 = 100$, čiže $(z + 2)^2 = 100$.`,
   goal:P => P.b === 8,
   cfg:{n:L(100), b:{v:3, max:12, name:"z"}, on:{rady:true}}},
  {warn:R`Číslica musí byť menšia než základ. Zápis $(1283)_8$ nedáva zmysel, v osmičkovej sústave číslica 8 neexistuje, rovnako ako v desiatkovej neexistuje číslica „10“.`}
],

"Dvojková sústava — prevody":[
  R`Dvojková (binárna) sústava má len číslice 0 a 1. Hodnoty miest sú mocniny dvojky: $1, 2, 4, 8, 16, 32, \ldots$ Počítače ju používajú, lebo 0 a 1 sú dva stavy: prúd nejde, prúd ide.`,
  {def:"Z dvojkovej do desiatkovej", tex:R`(101101)_2 = 32 + 8 + 4 + 1 = 45`, note:"Sčítaj hodnoty tých miest, kde je jednotka."},
  {tool:"sustavy", ask:R`Meň číslo $\vb{n}$ a sleduj, ktoré mocniny dvojky ho skladajú.`,
   take:R`každé číslo je súčet rôznych mocnín dvojky, a to jediným spôsobom. Jednotky v zápise ukazujú, ktoré to sú.`,
   cfg:{n:{v:45, max:255}, b:L(2), on:{rady:true}}},
  R`Opačný smer: číslo opakovane deľ dvoma a zapisuj zvyšky. Zvyšky prečítané **zdola nahor** dávajú zápis v dvojkovej sústave.`,
  {tool:"sustavy", ask:R`Pozri si delenie dvoma. Prečo sa zvyšky čítajú odspodu?`,
   take:R`prvý zvyšok hovorí, či je číslo párne, to je posledná číslica (jednotky). Posledný zvyšok je najvyšší rád.`,
   cfg:{n:{v:77, max:255}, b:L(2), on:{delenie:true}}},
  {ex:R`Preveď 77 do dvojkovej sústavy.`,
   steps:[
     ["Deľ dvoma.", R`77 = 2 \cdot 38 + \mathbf{1},\ 38 = 2 \cdot 19 + \mathbf{0},\ 19 = 2 \cdot 9 + \mathbf{1}`],
     ["Pokračuj až po nulu.", R`9 = 2 \cdot 4 + \mathbf{1},\ 4 = 2 \cdot 2 + \mathbf{0},\ 2 = 2 \cdot 1 + \mathbf{0},\ 1 = 2 \cdot 0 + \mathbf{1}`],
     ["Zvyšky odspodu.", R`77 = (1001101)_2`]
   ],
   res:R`$(1001101)_2$. Kontrola: $64 + 8 + 4 + 1 = 77$.`},
  {ex:R`Sčítaj $(1011)_2 + (110)_2$ a výsledok over v desiatkovej sústave.`,
   steps:[
     [R`Sčítavaj pod sebou, $1 + 1 = (10)_2$: píšeš 0, jednotku prenášaš.`, R`\begin{array}{r} 1011\\ +\ \ 110\\ \hline 10001 \end{array}`],
     ["Kontrola.", R`11 + 6 = 17 = 16 + 1 = (10001)_2`]
   ],
   res:R`$(10001)_2 = 17$.`},
  {tool:"sustavy", kind:"uloha", ask:R`Nastav číslo $\vb{n}$, ktorého dvojkový zápis je $110010$.`,
   hint:R`$32 + 16 + 2$.`,
   goal:P => P.n === 50,
   cfg:{n:{v:20, max:127}, b:L(2), on:{rady:true}}},
  {warn:R`Zvyšky pri delení sa čítajú **odspodu**. Ak ich prečítaš zhora, dostaneš číslo odzadu: pre 77 by vyšlo $1011001 = 89$.`}
],

"Šestnástková sústava — prevody":[
  R`Šestnástková (hexadecimálna) sústava potrebuje 16 číslic. Za 0 až 9 pokračujú písmená: $A = 10$, $B = 11$, $C = 12$, $D = 13$, $E = 14$, $F = 15$. Hodnoty miest sú $1, 16, 256, 4096, \ldots$`,
  {def:"Číslice šestnástkovej sústavy", tex:R`A = 10,\ B = 11,\ C = 12,\ D = 13,\ E = 14,\ F = 15`},
  {tool:"sustavy", ask:R`Meň číslo a sleduj šestnástkový zápis. Aké je najväčšie číslo s dvoma šestnástkovými číslicami?`,
   take:R`$(FF)_{16} = 15 \cdot 16 + 15 = 255$. Dve šestnástkové číslice popíšu jeden bajt.`,
   cfg:{n:{v:254, max:4095}, b:L(16), on:{rady:true, delenie:true}}},
  {ex:R`Preveď $(2F)_{16}$ do desiatkovej a 254 do šestnástkovej sústavy.`,
   steps:[
     [R`$F = 15$.`, R`(2F)_{16} = 2 \cdot 16 + 15 = 47`],
     ["Deľ šestnástimi.", R`254 = 16 \cdot 15 + 14,\quad 15 = 16 \cdot 0 + 15`],
     [R`Zvyšky odspodu: $15 = F$, $14 = E$.`, R`254 = (FE)_{16}`]
   ],
   res:R`$47$ a $(FE)_{16}$.`},
  R`Keďže $16 = 2^4$, každá šestnástková číslica zodpovedá presne štyrom dvojkovým. Prevod medzi nimi je preto jednoduchý: dvojkové číslo rozdeľ sprava na štvorice.`,
  {ex:R`Preveď $(11010110)_2$ do šestnástkovej a desiatkovej sústavy.`,
   steps:[
     ["Štvorice sprava.", R`1101\ |\ 0110`],
     [R`$1101 = 13 = D$, $0110 = 6$.`, R`(11010110)_2 = (D6)_{16}`],
     ["Do desiatkovej.", R`13 \cdot 16 + 6 = 214`]
   ],
   res:R`$(D6)_{16} = 214$.`},
  {tool:"sustavy", kind:"uloha", ask:R`Nastav číslo, ktorého šestnástkový zápis je $1A0$.`,
   hint:R`$1 \cdot 256 + 10 \cdot 16 + 0$.`,
   goal:P => P.n === 416,
   cfg:{n:{v:300, max:1023}, b:L(16), on:{rady:true}}},
  {warn:R`$(10)_{16}$ nie je desať, ale šestnásť. A písmeno $A$ znamená 10, nie 1. Pri prevode si písmená najprv prepíš na čísla.`}
],

"Rímske čísla":[
  R`Rímske čísla nie sú pozičná sústava: znak má vždy rovnakú hodnotu, nech stojí kdekoľvek. Hodnoty sa väčšinou sčítavajú, len menší znak pred väčším sa odčíta.`,
  R`| znak | I | V | X | L | C | D | M |
|---|---|---|---|---|---|---|---|
| hodnota | 1 | 5 | 10 | 50 | 100 | 500 | 1000 |`,
  {def:"Odčítanie", tex:R`\text{IV} = 4,\ \text{IX} = 9,\ \text{XL} = 40,\ \text{XC} = 90,\ \text{CD} = 400,\ \text{CM} = 900`, note:"Odčítať sa smie len I, X, C, a len od dvoch najbližších väčších znakov. Ten istý znak sa opakuje najviac trikrát za sebou."},
  {tool:"sustavy", ask:R`Meň číslo a pozri sa, z akých častí sa skladá rímsky zápis.`,
   take:R`číslo sa rozloží na tisícky, stovky, desiatky a jednotky a každá časť sa zapíše zvlášť. Preto je 1994 = M + CM + XC + IV.`,
   cfg:{n:{v:1994, max:3999}, b:L(10), on:{rim:true}}},
  {ex:R`Prečítaj MCMXCIV a zapíš rímsky 2024 a 49.`,
   steps:[
     ["Rozdeľ na časti.", R`\text{M} + \text{CM} + \text{XC} + \text{IV} = 1000 + 900 + 90 + 4 = 1994`],
     [R`$2024 = 2000 + 20 + 4$.`, R`\text{MM} + \text{XX} + \text{IV} = \text{MMXXIV}`],
     [R`$49 = 40 + 9$, nie $50 - 1$.`, R`\text{XL} + \text{IX} = \text{XLIX}`]
   ],
   res:R`1994; MMXXIV; XLIX.`},
  {tool:"sustavy", kind:"uloha", ask:R`Nastav číslo, ktoré sa rímsky zapíše CDXLIV.`,
   hint:R`CD je 400, XL je 40, IV je 4.`,
   goal:P => P.n === 444,
   cfg:{n:{v:100, max:3999}, b:L(10), on:{rim:true}}},
  {warn:R`49 nie je IL a 95 nie je VC. I sa odčíta len od V a X, X len od L a C. Číslo rozlož najprv na tisícky, stovky, desiatky a jednotky.`}
]

  }
};
})();

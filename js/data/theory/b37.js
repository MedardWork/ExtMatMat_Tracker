/* Pascalov trojuholník, vlastnosti kombinačných čísel, binomická veta */
(() => {
const L = v => ({v, lock:true});
const pas = st => st.h && st.h.pas;

THEORY.b37 = {
  mins:25,
  brief:[
    R`V $n$-tom riadku Pascalovho trojuholníka sú $\binom{n}{0}, \binom{n}{1}, \dots, \binom{n}{n}$. Každé číslo je súčtom dvoch čísel nad ním.`,
    R`$\binom{n}{k} = \binom{n}{n - k}$, $\binom{n}{k} + \binom{n}{k + 1} = \binom{n + 1}{k + 1}$, súčet riadku je $2^n$.`,
    R`Binomická veta: $(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k$.`,
    R`Člen s indexom $k$ (počítané od 0) je $\binom{n}{k} a^{n-k} b^k$, je to $(k + 1)$-vý člen rozvoja.`
  ],
  subs:{

"Pascalov trojuholník":[
  R`Kombinačné čísla ([[a39]]) sa dajú usporiadať do trojuholníka: v riadku $n$ (riadky číslujeme od 0) sú čísla $\binom{n}{0}$ až $\binom{n}{n}$. Na krajoch sú jednotky a každé vnútorné číslo je súčtom dvoch čísel tesne nad ním.`,
  {def:"Pascalov trojuholník", tex:R`\binom{\va{n}}{\vb{k}} + \binom{\va{n}}{\vb{k} + 1} = \binom{\va{n} + 1}{\vb{k} + 1}`},
  {tool:"pascal", ask:R`Klikaj na čísla trojuholníka. Ktoré dve čísla nad ním dávajú súčet?`,
   take:R`každé číslo je súčet ľavého a pravého suseda v riadku nad ním. Tak sa trojuholník dá vypísať bez počítania faktoriálov.`,
   cfg:{typ:"trojuholnik", on:{sucet:true}}},
  {ex:R`Vypíš 6. riadok Pascalovho trojuholníka z 5. riadku $1, 5, 10, 10, 5, 1$.`,
   steps:[
     ["Kraje sú jednotky, vnútri súčty susedov.", R`1,\ 1 + 5,\ 5 + 10,\ 10 + 10,\ 10 + 5,\ 5 + 1,\ 1`],
     ["Riadok.", R`1,\ 6,\ 15,\ 20,\ 15,\ 6,\ 1`]
   ],
   res:R`$1, 6, 15, 20, 15, 6, 1$, teda $\binom{6}{0}$ až $\binom{6}{6}$.`},
  {tool:"pascal", kind:"uloha", ask:R`Klikni v trojuholníku na číslo $\binom{7}{3}$.`,
   hint:"Riadky aj pozície sa číslujú od 0: v riadku 7 je to štvrté číslo zľava.",
   goal:P => P.n === 7 && P.k === 3,
   cfg:{typ:"trojuholnik", n:{v:2, min:0, max:8}, k:{v:1, min:0, max:8}, on:{sucet:true}}},
  {warn:R`Riadky aj miesta v riadku sa počítajú **od nuly**. Riadok $1, 5, 10, 10, 5, 1$ je riadok 5 (nie šiesty) a tretie číslo v ňom je $\binom{5}{2}$, nie $\binom{5}{3}$.`}
],

"Vlastnosti kombinačných čísel":[
  R`Z trojuholníka vidno tri vlastnosti. Je **súmerný**, lebo vybrať $k$ prvkov je to isté ako vybrať $n - k$, ktoré ostanú. Každé číslo je **súčtom dvoch nad ním**. A **súčet riadku** $n$ je $2^n$, počet všetkých podmnožín $n$-prvkovej množiny.`,
  {def:"Vlastnosti", tex:R`\binom{n}{k} = \binom{n}{n - k} \qquad \binom{n}{k} + \binom{n}{k + 1} = \binom{n + 1}{k + 1} \qquad \binom{n}{0} + \binom{n}{1} + \dots + \binom{n}{n} = 2^n`},
  {tool:"pascal", ask:R`Zapni súmernosť a súčet riadku. Meň riadok $n$.`,
   take:R`súčet riadku sa s každým riadkom zdvojnásobí: 1, 2, 4, 8, 16 … Každé číslo totiž prispeje do dvoch čísel pod ním.`,
   cfg:{typ:"trojuholnik", n:6, k:2, on:{symetria:true, riadok:true}}},
  {ex:R`Vypočítaj $\binom{8}{3} + \binom{8}{4}$ bez počítania oboch čísel.`,
   steps:[
     ["Súčet susedov v riadku 8.", R`\binom{8}{3} + \binom{8}{4} = \binom{9}{4}`],
     ["Výpočet.", R`\binom{9}{4} = \frac{9 \cdot 8 \cdot 7 \cdot 6}{24} = 126`]
   ],
   res:R`$126$ (skúška: $56 + 70 = 126$).`},
  {ex:R`Rieš rovnicu $\binom{n}{n - 2} = 28$.`,
   steps:[
     ["Súmernosť.", R`\binom{n}{n - 2} = \binom{n}{2} = \frac{n(n - 1)}{2}`],
     ["Rovnica.", R`n(n - 1) = 56 \Rightarrow n^2 - n - 56 = 0`],
     [R`Rozklad, $n \geq 2$.`, R`(n - 8)(n + 7) = 0 \Rightarrow n = 8`]
   ],
   res:R`$n = 8$.`},
  {tool:"pascal", kind:"uloha", ask:R`Nastav $n$ a $k$ tak, aby $\binom{n}{k} = 56$.`,
   hint:"56 je v riadku 8: 1, 8, 28, 56, 70, …",
   goal:(P, st) => !!pas(st) && pas(st).C === 56,
   cfg:{typ:"cislo", n:{v:5, min:1, max:10}, k:{v:2, min:0, max:10}}},
  {ex:R`Koľko podmnožín má množina $\{a, b, c, d, e\}$? Koľko z nich má aspoň 2 prvky?`,
   steps:[
     ["Súčet riadku 5.", R`2^5 = 32`],
     ["Odpočítame prázdnu a jednoprvkové.", R`32 - \binom{5}{0} - \binom{5}{1} = 32 - 1 - 5 = 26`]
   ],
   res:"32 podmnožín, 26 z nich má aspoň 2 prvky."},
  {warn:R`$\binom{n}{k} + \binom{n}{k + 1}$ sa sčíta do riadku $n + 1$. Súčet $\binom{n}{k} + \binom{n}{k}$ ani $\binom{n}{k} + \binom{n + 1}{k}$ sa takto nezjednoduší.`}
],

"Binomická veta":[
  R`Pri umocňovaní dvojčlena $(a + b)^n$ vzniknú členy $a^{n-k} b^k$. Koeficient pri každom je počet spôsobov, ako z $n$ zátvoriek vybrať $k$, z ktorých berieme $b$: kombinačné číslo $\binom{n}{k}$. Koeficienty sú teda riadok Pascalovho trojuholníka.`,
  {def:"Binomická veta", tex:R`(a + b)^{\va{n}} = \binom{\va{n}}{0} a^{\va{n}} + \binom{\va{n}}{1} a^{\va{n} - 1} b + \dots + \binom{\va{n}}{\va{n}} b^{\va{n}} \qquad T_{\vb{k}} = \binom{\va{n}}{\vb{k}} a^{\va{n} - \vb{k}} b^{\vb{k}}`,
   note:"Exponent pri a klesá od n po 0, pri b rastie od 0 po n. Súčet exponentov je v každom člene n."},
  {tool:"pascal", ask:R`Rozvoj $(a + b)^n$. Meň $n$ a porovnaj koeficienty s riadkom trojuholníka.`,
   take:R`koeficienty sú presne $n$-tý riadok. Pre $n = 2$ je to známe $a^2 + 2ab + b^2$.`,
   cfg:{typ:"binom", ab:true}},
  {ex:R`Rozlož $(2x + 3)^4$.`,
   steps:[
     ["Riadok 4.", R`1,\ 4,\ 6,\ 4,\ 1`],
     ["Členy.", R`(2x)^4 + 4(2x)^3 \cdot 3 + 6(2x)^2 \cdot 3^2 + 4 \cdot 2x \cdot 3^3 + 3^4`],
     ["Výpočet.", R`16x^4 + 96x^3 + 216x^2 + 216x + 81`],
     [R`Skúška: pre $x = 1$ má vyjsť $5^4$.`, R`16 + 96 + 216 + 216 + 81 = 625`]
   ],
   res:R`$16x^4 + 96x^3 + 216x^2 + 216x + 81$.`},
  {tool:"pascal", ask:R`Rozvoj $(px + q)^n$. Nastav $n = 4$, $p = 2$, $q = 3$ a over príklad vyššie. Potom skús záporné $q$.`,
   take:R`pri zápornom $q$ sa znamienka členov striedajú, lebo $q^k$ je záporné pre nepárne $k$.`,
   cfg:{typ:"binom", n:4, p:2, q:3}},
  {tool:"pascal", kind:"uloha", ask:R`Rozvoj $(2x + 3)^4$. Klikni alebo nastav $k$ tak, aby bol vybraný člen s $x^2$.`,
   hint:"Pri x je exponent n − k = 2.",
   take:R`$k = 2$, člen $\binom{4}{2} \cdot 2^2 \cdot 3^2 \cdot x^2 = 216x^2$.`,
   goal:P => P.k === 2,
   cfg:{typ:"binom", n:L(4), p:L(2), q:L(3), k:{v:0, min:0, max:4}}},
  {ex:R`Urči tretí člen rozvoja $(x - 2)^5$.`,
   steps:[
     [R`Tretí člen má $k = 2$ (počítame od 0).`, R`T_2 = \binom{5}{2} x^{3} (-2)^2`],
     ["Výpočet.", R`10 \cdot 4 \cdot x^3 = 40x^3`]
   ],
   res:R`$40x^3$.`},
  {ex:R`Nájdi člen bez $x$ v rozvoji $\left(x + \frac{1}{x}\right)^6$.`,
   steps:[
     [R`Člen $k$.`, R`\binom{6}{k} x^{6-k} \left(\tfrac{1}{x}\right)^k = \binom{6}{k} x^{6-2k}`],
     [R`Bez $x$: exponent 0.`, R`6 - 2k = 0 \Rightarrow k = 3`],
     ["Člen.", R`\binom{6}{3} = 20`]
   ],
   res:"20."},
  {tool:"pascal", kind:"uloha", ask:R`V rozvoji $(x + q)^4$ nastav $q$ tak, aby koeficient pri $x^3$ bol $-12$.`,
   hint:"Člen s x³ má k = 1: 4 · q = −12.",
   goal:P => P.q === -3,
   cfg:{typ:"binom", n:L(4), p:L(1), q:{v:1, min:-3, max:3}, k:L(1)}},
  {warn:R`Pri $(2x + 3)^4$ umocni celý člen: $(2x)^4 = 16x^4$, nie $2x^4$. A pri $(x - 2)^n$ patrí mínus k číslu: $(-2)^k$.`}
]

  }
};
})();

/* Aritmetická postupnosť a súčet n členov */
(() => {
/* "2n − 1" from slope k and shift q, with k coloured as the difference */
const linN = (h, k, q) => {
  const kn = k === 0 ? "" : (k === 1 ? "" : k === -1 ? "-" : R`\va{${h.tn(k)}}`) + "n";
  if(!kn) return h.tn(q);
  return kn + (q === 0 ? "" : ` ${q < 0 ? "-" : "+"} ${h.tn(Math.abs(q))}`);
};
const par = (h, x) => x < 0 ? R`\left(${h.tn(x)}\right)` : h.tn(x);

THEORY.a25 = {
  mins:30,
  brief:[
    R`Postupnosť je zoznam čísel v pevnom poradí: $a_1, a_2, a_3, \dots$ Číslo $a_n$ je jej $n$-tý člen.`,
    R`V aritmetickej postupnosti vznikne každý ďalší člen pripočítaním toho istého čísla $\va{d}$ (diferencia).`,
    R`$n$-tý člen: $a_n = \vb{a_1} + (\vd{n} - 1)\va{d}$. Medzi ľubovoľnými dvoma členmi: $a_r = a_s + (r - s)\va{d}$.`,
    R`Súčet prvých $n$ členov: $s_n = \dfrac{\vd{n}\,(\vb{a_1} + a_n)}{2}$.`
  ],
  subs:{

"Postupnosť a jej n-tý člen":[
  R`**Postupnosť** je zoznam čísel, v ktorom záleží na poradí. Čísla v ňom sa volajú **členy** a označujú sa $a_1, a_2, a_3, \dots$ Malé číslo dole (index) hovorí, koľký v poradí člen je.`,
  {def:"Postupnosť", tex:R`a_1,\ a_2,\ a_3,\ \dots,\ a_{\vd{n}},\ \dots`, legend:[
    ["n", "d", "index", "Poradie člena. Je to vždy prirodzené číslo: 1, 2, 3, …"],
    ["a_n", "c", "$n$-tý člen", "Hodnota, ktorá stojí na $n$-tom mieste."]
  ]},
  {tool:"postupnost", ask:R`Postupnosť $a_n = 2n + 1$. Klikaj na stĺpce alebo meň $\vd{n}$ a sleduj, ako z poradia vznikne hodnota.`,
   take:R`index $n$ hovorí, kde člen stojí, a vzorec z neho vypočíta, aký je veľký. Piaty člen je $2 \cdot 5 + 1 = 11$.`,
   cfg:{typ:"vzorec", f:"2n+1", count:8, y:[0, 18], n:{v:3}, on:{vals:true},
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = 2 \cdot \vd{${P.n}} + 1 = ${h.tn(h.seq.an)}`)
       + h.p(R`Na $\vd{${P.n}}$. mieste stojí číslo $${h.tn(h.seq.an)}$.`)}},
  "Postupnosť môže byť zadaná dvoma spôsobmi.",
  {cards:[
    {t:R`Vzorcom pre $n$-tý člen`, d:R`Dosadíš poradie a hneď máš člen. Stý člen vypočítaš bez toho, aby si poznal tie pred ním.`, tex:R`a_n = n^2 - 2n`},
    {t:"Rekurentne", d:"Poznáš prvý člen a pravidlo, ako z člena vyrobiť nasledujúci. K stému členu sa musíš prepočítať postupne.", tex:R`a_1 = 2,\quad a_{n+1} = 2a_n - 1`}
  ]},
  {ex:R`Postupnosť je daná vzorcom $a_n = n^2 - 2n$. Vypočítaj prvé štyri členy a desiaty člen.`,
   steps:[
     [R`Za $n$ postupne dosaď 1, 2, 3, 4.`, R`a_1 = 1 - 2 = -1,\quad a_2 = 4 - 4 = 0,\quad a_3 = 9 - 6 = 3,\quad a_4 = 16 - 8 = 8`],
     [R`Desiaty člen: dosaď $n = 10$.`, R`a_{10} = 10^2 - 2 \cdot 10 = 80`]
   ],
   res:R`Postupnosť začína $-1,\ 0,\ 3,\ 8,\ \dots$ a $a_{10} = 80$.`},
  {ex:R`Postupnosť je daná rekurentne: $a_1 = 2$, $a_{n+1} = 2a_n - 1$. Vypočítaj $a_5$.`,
   steps:[
     ["Každý člen vypočítaj z predošlého.", R`a_2 = 2 \cdot 2 - 1 = 3`],
     ["", R`a_3 = 2 \cdot 3 - 1 = 5,\qquad a_4 = 2 \cdot 5 - 1 = 9`],
     ["", R`a_5 = 2 \cdot 9 - 1 = 17`]
   ],
   res:R`$a_5 = 17$`},
  R`Postupnosť je vlastne **funkcia**, do ktorej dosadzuješ len prirodzené čísla. Jej grafom preto nie je súvislá čiara, ale jednotlivé body.`,
  {tool:"postupnost", ask:R`Body sú členy postupnosti $a_n = n^2 - 2n$. Zapni a vypni čiaru cez vrcholy. Čo je to za krivku?`,
   take:R`body ležia na parabole $y = x^2 - 2x$. Postupnosť z nej vyberá len body pre $x = 1, 2, 3, \dots$`,
   cfg:{typ:"vzorec", f:"n^2-2n", dots:true, count:6, y:[-3, 27], n:{v:4}, on:{vals:true, line:true}, toggles:["line"],
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = \vd{${P.n}}^2 - 2 \cdot \vd{${P.n}} = ${h.tn(h.seq.an)}`)
       + h.p(R`Bod $[\vd{${P.n}};\ ${h.tn(h.seq.an)}]$`)}},
  R`Častá otázka je opačná: **koľký v poradí** je člen s danou hodnotou? Vtedy poznáš $a_n$ a hľadáš $n$.`,
  {tool:"postupnost", kind:"uloha", ask:R`Postupnosť $a_n = 3n - 7$. Koľký člen sa rovná 20? Vyber ho.`,
   hint:R`Vyrieš rovnicu $3n - 7 = 20$.`, goal:P => P.n === 9,
   cfg:{typ:"vzorec", f:"3n-7", count:10, y:[-6, 26], n:{v:1}, on:{vals:false}, marks:[{y:20, label:"20"}],
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = 3 \cdot \vd{${P.n}} - 7 = ${h.tn(h.seq.an)}`)
       + (P.n === 9 ? h.pill("deviaty člen je 20", "ok") : h.pill(h.seq.an < 20 ? "málo" : "veľa", "flat"))}},
  {ex:R`Je číslo 50 členom postupnosti $a_n = 4n - 6$? A číslo 60?`,
   steps:[
     [R`Polož $a_n = 50$ a vyrieš rovnicu.`, R`4n - 6 = 50 \;\Rightarrow\; 4n = 56 \;\Rightarrow\; n = 14`],
     [R`$n = 14$ je prirodzené číslo, takže 50 je štrnásty člen.`, ""],
     [R`To isté pre 60.`, R`4n - 6 = 60 \;\Rightarrow\; 4n = 66 \;\Rightarrow\; n = 16{,}5`],
     [R`Člen s poradím $16{,}5$ neexistuje.`, ""]
   ],
   res:R`Číslo 50 je členom postupnosti ($a_{14} = 50$), číslo 60 nie je.`},
  {warn:R`Nepleť si $n$ a $a_n$. Zápis $a_5 = 13$ hovorí, že **piaty** člen má **hodnotu** 13. Ak má vyjsť poradie, musí to byť prirodzené číslo.`}
],

"Diferencia a vzorec aₙ":[
  R`Postupnosť je **aritmetická**, ak každý ďalší člen vznikne z predošlého **pripočítaním toho istého čísla**. To číslo sa volá **diferencia** a značí sa $\va{d}$.`,
  {def:"Aritmetická postupnosť", tex:R`a_{n+1} = a_n + \va{d}`, note:R`Diferenciu dostaneš ako rozdiel dvoch susedných členov: $\va{d} = a_{n+1} - a_n$`, legend:[
    ["d", "a", "diferencia", "O koľko sa člen zmení pri kroku na nasledujúci. Môže byť aj záporná alebo nulová."]
  ]},
  {tool:"postupnost", ask:R`Prvý člen je $\vb{2}$. Meň diferenciu $\va{d}$. Kedy postupnosť rastie a kedy klesá?`,
   take:R`pre $d > 0$ postupnosť rastie, pre $d < 0$ klesá a pre $d = 0$ sú všetky členy rovnaké. Kroky medzi susedmi sú vždy rovnako veľké.`,
   cfg:{typ:"ar", a1:{v:2, lock:true}, d:{v:3, min:-3, max:4, step:.5}, n:{v:1, lock:true, hide:true}, count:8, y:[-20, 30], on:{vals:true, steps:true},
     out:(P, h) => h.calc(h.seq.v.slice(0, 5).map(x => h.tn(x)).join(R`;\ `) + R`;\ \dots`)
       + (P.d > 0 ? h.pill("d > 0 · rastúca", "up") : P.d < 0 ? h.pill("d < 0 · klesajúca", "down") : h.pill("d = 0 · konštantná", "flat"))}},
  {ex:R`Je postupnosť $7,\ 4,\ 1,\ -2,\ \dots$ aritmetická? Ak áno, urč $d$ a ďalšie dva členy.`,
   steps:[
     ["Odčítaj každé dva susedné členy, vždy nasledujúci mínus predošlý.", R`4 - 7 = -3,\qquad 1 - 4 = -3,\qquad -2 - 1 = -3`],
     ["Rozdiely sú rovnaké, postupnosť je aritmetická.", R`\va{d} = -3`],
     ["Ďalšie členy dostaneš pripočítaním diferencie.", R`-2 + (-3) = -5,\qquad -5 + (-3) = -8`]
   ],
   res:R`Áno, $d = -3$. Ďalšie členy sú $-5$ a $-8$.`},
  R`K druhému členu sa z prvého dostaneš jedným krokom, k tretiemu dvoma. K $n$-tému členu vedie $n - 1$ krokov, každý dlhý $\va{d}$.`,
  {def:R`Vzorec pre $n$-tý člen`, tex:R`a_{\vd{n}} = \vb{a_1} + (\vd{n} - 1)\,\va{d}`, legend:[
    ["a_1", "b", "prvý člen", "Odtiaľ postupnosť štartuje."],
    ["d", "a", "diferencia", "Dĺžka jedného kroku."],
    ["n", "d", "poradie", R`Ku členu $a_n$ treba od $a_1$ urobiť $n - 1$ krokov.`]
  ]},
  {tool:"postupnost", ask:R`$\vb{a_1 = 3}$, $\va{d = 2}$. Meň $\vd{n}$ a spočítaj oblúčiky medzi $a_1$ a vybraným členom.`,
   take:R`krokov je vždy o jeden menej než poradie člena. Preto je vo vzorci $n - 1$, nie $n$.`,
   cfg:{typ:"ar", a1:{v:3, lock:true}, d:{v:2, lock:true}, n:{v:4}, count:10, y:[0, 24], on:{vals:true, steps:true},
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = \vb{3} + (\vd{${P.n}} - 1) \cdot \va{2} = 3 + ${P.n - 1} \cdot 2 = ${h.tn(h.seq.an)}`)
       + h.p(R`Od $a_1$ je to **${P.n - 1}** ${P.n - 1 === 1 ? "krok" : P.n - 1 >= 2 && P.n - 1 <= 4 ? "kroky" : "krokov"}.`)}},
  {ex:R`V aritmetickej postupnosti je $a_1 = 7$ a $d = 4$. Vypočítaj $a_{20}$.`,
   steps:[
     [R`Dosaď do vzorca $a_n = a_1 + (n - 1)d$.`, R`a_{20} = 7 + (20 - 1) \cdot 4`],
     ["Dopočítaj.", R`a_{20} = 7 + 19 \cdot 4 = 7 + 76 = 83`]
   ],
   res:R`$a_{20} = 83$`},
  R`Nemusíš vždy začínať od prvého člena. Medzi členom $a_s$ a členom $a_r$ je $r - s$ krokov.`,
  {def:"Vzťah medzi dvoma členmi", tex:R`a_r = a_s + (r - s)\,\va{d}`},
  {ex:R`V aritmetickej postupnosti je $a_3 = 11$ a $a_8 = 31$. Urč $d$, $a_1$ a vzorec pre $n$-tý člen.`,
   steps:[
     [R`Od $a_3$ po $a_8$ je $8 - 3 = 5$ krokov.`, R`31 = 11 + 5d \;\Rightarrow\; 5d = 20 \;\Rightarrow\; \va{d} = 4`],
     [R`Od $a_3$ sa vráť o dva kroky k $a_1$.`, R`\vb{a_1} = 11 - 2 \cdot 4 = 3`],
     ["Zostav vzorec a uprav ho.", R`a_n = 3 + (n - 1) \cdot 4 = 4n - 1`],
     ["Skúška.", R`a_8 = 4 \cdot 8 - 1 = 31`]
   ],
   res:R`$d = 4$, $a_1 = 3$, $a_n = 4n - 1$`},
  {tool:"postupnost", kind:"uloha", ask:R`Nastav $\vb{a_1}$ a $\va{d}$ tak, aby $a_2 = 1$ a $a_6 = 13$.`,
   hint:R`Od $a_2$ po $a_6$ sú 4 kroky a hodnota vzrástla o 12.`, goal:P => P.a1 === -2 && P.d === 3,
   cfg:{typ:"ar", a1:{v:1, min:-6, max:8}, d:{v:1, min:-4, max:5, step:1}, n:{v:1, lock:true, hide:true}, count:7, y:[-12, 28], on:{vals:true},
     out:(P, h) => h.calc(R`a_2 = ${h.tn(h.seq.at(2))}`) + h.calc(R`a_6 = ${h.tn(h.seq.at(6))}`)
       + (P.a1 === -2 && P.d === 3 ? h.pill("sedí", "ok") : "")}},
  R`Keď vzorec roznásobíš, dostaneš $a_n = \va{d}\,n + (a_1 - d)$. To je predpis **lineárnej funkcie** so smernicou $\va{d}$.`,
  {tool:"postupnost", ask:R`Meň $\vb{a_1}$ a $\va{d}$. Na akej čiare ležia členy aritmetickej postupnosti?`,
   take:R`členy ležia na priamke. Diferencia je jej smernica: jeden krok doprava, $d$ nahor.`,
   cfg:{typ:"ar", dots:true, a1:{v:1, min:-4, max:6}, d:{v:2, min:-2, max:3, step:.5}, n:{v:1, lock:true, hide:true}, count:8, y:[-18, 28],
     on:{vals:false, steps:true, line:true},
     out:(P, h) => h.calc(R`a_n = \vb{${h.tn(P.a1)}} + (n - 1) \cdot ${par(h, P.d).replace(h.tn(P.d), R`\va{${h.tn(P.d)}}`)}`)
       + h.calc(R`a_n = ${linN(h, P.d, P.a1 - P.d)}`) + h.p(R`Smernica priamky: $\va{${h.tn(P.d)}}$`)}},
  {tip:"Lineárnu funkciu a jej smernicu nájdeš v téme [[a21]]. Aritmetická postupnosť je tá istá priamka, z ktorej berieš len body nad prirodzenými číslami.", label:"Súvislosť"},
  R`Z rovnakých krokov vyplýva ešte jedna vlastnosť: každý člen leží presne v strede medzi svojimi susedmi. Je ich **aritmetickým priemerom**, odtiaľ názov postupnosti.`,
  {def:"Člen je priemerom susedov", tex:R`a_n = \dfrac{a_{n-1} + a_{n+1}}{2}`},
  {ex:R`Čísla $x - 1$, $2x + 1$, $5x - 3$ sú tri po sebe idúce členy aritmetickej postupnosti. Urč $x$.`,
   steps:[
     ["Prostredný člen je priemerom krajných, teda jeho dvojnásobok je ich súčet.", R`2(2x + 1) = (x - 1) + (5x - 3)`],
     ["Uprav a vyrieš.", R`4x + 2 = 6x - 4 \;\Rightarrow\; 2x = 6 \;\Rightarrow\; x = 3`],
     ["Skúška: dosaď a pozri rozdiely.", R`2,\ 7,\ 12 \qquad 7 - 2 = 5,\quad 12 - 7 = 5`]
   ],
   res:R`$x = 3$, členy sú $2,\ 7,\ 12$ a $d = 5$.`},
  {warn:R`Vo vzorci je $(n - 1)$, nie $n$. Desiaty člen je $a_1 + 9d$, lebo prvý člen už máš a krokov zostáva deväť.`}
],

"Súčet n členov":[
  R`Sčítať veľa členov po jednom je zdĺhavé. Malý Gauss vraj dostal v škole za úlohu sčítať čísla od 1 do 100 a všimol si, že $1 + 100$, $2 + 99$, $3 + 98$ dávajú vždy 101.`,
  {tool:"postupnost", ask:R`Na každom stĺpci stojí stĺpec z opačného konca: na prvom posledný, na druhom predposledný. Meň $\vd{n}$ a sleduj výšku dvojíc.`,
   take:R`všetky dvojice sú rovnako vysoké, $a_1 + a_n$. Je ich $n$, ale každý člen je v nich dvakrát. Preto sa súčin $n \cdot (a_1 + a_n)$ delí dvoma.`,
   cfg:{typ:"ar", a1:{v:1, lock:true}, d:{v:1, lock:true}, n:{v:6, min:1, max:10}, count:10, y:[0, 12], on:{vals:true, sum:true, pairs:true},
     out:(P, h) => h.p(R`$\vd{${P.n}}$ ${P.n === 1 ? "stĺpec" : P.n <= 4 ? "stĺpce" : "stĺpcov"} s výškou $1 + ${P.n} = ${P.n + 1}$`)
       + h.calc(R`s_{\vd{${P.n}}} = \dfrac{\vd{${P.n}} \cdot ${P.n + 1}}{2} = ${h.tn(h.seq.sn)}`)
       + h.p(R`Kontrola: $${h.seq.v.slice(0, P.n).map(x => h.tn(x)).join(" + ")} = ${h.tn(h.seq.sn)}$`)}},
  R`Súčet prvých $n$ členov sa značí $s_n$. V aritmetickej postupnosti dáva prvý člen s posledným rovnaký súčet ako druhý s predposledným a tak ďalej.`,
  {def:R`Súčet prvých $n$ členov`, tex:R`s_{\vd{n}} = \dfrac{\vd{n}\,(\vb{a_1} + a_n)}{2}`, legend:[
    ["n", "d", "počet členov", "Koľko členov sčituješ."],
    ["a_1", "b", "prvý sčítanec", ""],
    ["a_n", "c", "posledný sčítanec", "Ak ho nepoznáš, najprv ho vypočítaj zo vzorca pre $n$-tý člen."]
  ]},
  {ex:R`Vypočítaj súčet $1 + 2 + 3 + \dots + 100$.`,
   steps:[
     [R`Je to aritmetická postupnosť s $a_1 = 1$, $d = 1$ a sto členmi.`, R`n = 100,\qquad a_{100} = 100`],
     ["Dosaď do vzorca.", R`s_{100} = \dfrac{100 \cdot (1 + 100)}{2} = 50 \cdot 101 = 5\,050`]
   ],
   res:R`$s_{100} = 5\,050$`},
  R`Keď posledný člen nepoznáš, dosaď za $a_n$ výraz $a_1 + (n - 1)d$. Dostaneš druhý tvar toho istého vzorca.`,
  {def:R`Súčet z $a_1$ a $d$`, tex:R`s_{\vd{n}} = \dfrac{\vd{n}}{2}\,\bigl(2\vb{a_1} + (\vd{n} - 1)\,\va{d}\bigr)`},
  {ex:R`V aritmetickej postupnosti je $a_1 = 5$, $d = 3$. Vypočítaj súčet prvých 20 členov.`,
   steps:[
     ["Dosaď do druhého tvaru vzorca.", R`s_{20} = \dfrac{20}{2}\,(2 \cdot 5 + 19 \cdot 3)`],
     ["Dopočítaj.", R`s_{20} = 10 \cdot (10 + 57) = 10 \cdot 67 = 670`],
     [R`Kontrola cez prvý tvar: $a_{20} = 5 + 19 \cdot 3 = 62$.`, R`s_{20} = \dfrac{20 \cdot (5 + 62)}{2} = 670`]
   ],
   res:R`$s_{20} = 670$`},
  {tool:"postupnost", ask:R`Meň $\vb{a_1}$, $\va{d}$ aj $\vd{n}$. Žltý pás ukazuje, ktoré členy sa sčitujú. Dvojice si môžeš zapnúť.`,
   take:R`súčet závisí len od prvého člena, posledného člena a ich počtu. Je to počet členov krát priemer prvého a posledného.`,
   cfg:{typ:"ar", a1:{v:5, min:0, max:10}, d:{v:3, min:0, max:4, step:.5}, n:{v:4}, count:10, y:[0, 60], on:{vals:true, sum:true}, toggles:["pairs"]}},
  R`Pri súčtoch čísel „od–do“ treba najprv zistiť, **koľko** ich je. Počet členov od $a$ po $b$ s krokom $d$ je $\dfrac{b - a}{d} + 1$.`,
  {ex:"Vypočítaj súčet všetkých dvojciferných čísel deliteľných tromi.",
   steps:[
     ["Najmenšie také číslo je 12, najväčšie 99, krok je 3.", R`a_1 = 12,\qquad a_n = 99,\qquad d = 3`],
     ["Koľko ich je?", R`n = \dfrac{99 - 12}{3} + 1 = 29 + 1 = 30`],
     ["Súčet.", R`s_{30} = \dfrac{30 \cdot (12 + 99)}{2} = 15 \cdot 111 = 1\,665`]
   ],
   res:R`Súčet je $1\,665$.`},
  R`Niekedy poznáš súčet a hľadáš počet členov. Vtedy vyjde **kvadratická rovnica** pre $n$ a z jej koreňov berieš len prirodzené číslo.`,
  {ex:R`Koľko prvých členov postupnosti $3,\ 7,\ 11,\ \dots$ treba sčítať, aby súčet bol 210?`,
   steps:[
     [R`$a_1 = 3$, $d = 4$. Dosaď do vzorca pre súčet.`, R`\dfrac{n}{2}\,(2 \cdot 3 + (n - 1) \cdot 4) = 210`],
     ["Uprav zátvorku a roznásob.", R`\dfrac{n}{2}\,(4n + 2) = 210 \;\Rightarrow\; 2n^2 + n - 210 = 0`],
     ["Vyrieš kvadratickú rovnicu.", R`D = 1 + 4 \cdot 2 \cdot 210 = 1681 = 41^2,\qquad n = \dfrac{-1 \pm 41}{4}`],
     [R`Korene sú $10$ a $-10{,}5$. Počet členov je prirodzené číslo.`, R`n = 10`]
   ],
   res:R`Treba sčítať **10** členov. Skúška: $a_{10} = 39$ a $\dfrac{10 \cdot (3 + 39)}{2} = 210$.`},
  {tool:"postupnost", kind:"uloha", ask:R`Postupnosť $5,\ 8,\ 11,\ \dots$ Koľko prvých členov má súčet 98? Vyber posledný sčítanec.`,
   hint:R`$\dfrac{n}{2}(10 + 3(n - 1)) = 98$ vedie na $3n^2 + 7n - 196 = 0$.`, goal:P => P.n === 7,
   cfg:{typ:"ar", a1:{v:5, lock:true}, d:{v:3, lock:true}, n:{v:2}, count:10, y:[0, 36], on:{vals:true, sum:true},
     out:(P, h) => h.calc(R`s_{\vd{${P.n}}} = \dfrac{\vd{${P.n}} \cdot (5 + ${h.tn(h.seq.an)})}{2} = ${h.tn(h.seq.sn)}`)
       + (P.n === 7 ? h.pill("súčet je 98", "ok") : h.p(h.seq.sn < 98 ? R`Do 98 chýba $${h.tn(98 - h.seq.sn)}$.` : R`To je o $${h.tn(h.seq.sn - 98)}$ viac než 98.`))}},
  {tip:R`Posledný sčítanec dostaneš aj zo súčtov: $a_n = s_n - s_{n-1}$. Ak napríklad $s_5 = 40$ a $s_4 = 28$, tak $a_5 = 12$.`},
  {warn:R`Vo vzorci pre súčet je $n$ **počet** členov, nie hodnota posledného člena. Pri súčte $12 + 15 + \dots + 99$ je $n = 30$, nie 99.`}
],

"Slovné úlohy":[
  R`Aritmetickú postupnosť v texte spoznáš podľa slov „každý ďalší **o** … viac“ alebo „**o** … menej“. Niečo sa pravidelne mení o rovnakú hodnotu.`,
  {map:[
    ["„Prvý rad má 20 sedadiel.“", "prvý člen", R`\vb{a_1} = 20`],
    ["„Každý ďalší rad má o 2 sedadlá viac.“", "diferencia", R`\va{d} = 2`],
    ["„Koľko sedadiel má 15. rad?“", "jeden člen", R`a_{15} = \ ?`],
    ["„Koľko sedadiel je v 15 radoch spolu?“", "súčet", R`s_{15} = \ ?`]
  ]},
  {ex:"Prvý rad amfiteátra má 20 sedadiel a každý ďalší o 2 viac. Koľko sedadiel má 15. rad a koľko ich je v 15 radoch spolu?",
   steps:[
     ["Zapíš, čo poznáš.", R`\vb{a_1} = 20,\qquad \va{d} = 2,\qquad \vd{n} = 15`],
     ["Pätnásty rad.", R`a_{15} = 20 + 14 \cdot 2 = 48`],
     ["Všetky rady spolu.", R`s_{15} = \dfrac{15 \cdot (20 + 48)}{2} = 15 \cdot 34 = 510`]
   ],
   res:"15. rad má **48** sedadiel, spolu je ich **510**."},
  {tool:"postupnost", ask:R`Amfiteáter z príkladu. Meň, o koľko sedadiel je každý rad dlhší, a počet radov $\vd{n}$.`,
   take:R`pri $d = 0$ majú všetky rady 20 sedadiel a spolu je ich $15 \cdot 20 = 300$. Každé sedadlo navyše v diferencii pridá do súčtu ďalších 105.`,
   cfg:{typ:"ar", a1:{v:20, lock:true, note:"sedadiel v 1. rade"}, d:{v:2, min:0, max:4, step:1, note:"o koľko viac"}, n:{v:15, note:"počet radov"},
     count:15, y:[0, 80], on:{vals:true, sum:true},
     out:(P, h) => h.p(R`V $\vd{${P.n}}$. rade:`) + h.calc(R`a_{\vd{${P.n}}} = \vb{20} + ${P.n - 1} \cdot \va{${h.tn(P.d)}} = ${h.tn(h.seq.an)}`)
       + h.p(R`V $\vd{${P.n}}$ radoch spolu:`) + h.calc(R`s_{\vd{${P.n}}} = \dfrac{${P.n} \cdot (20 + ${h.tn(h.seq.an)})}{2} = ${h.tn(h.seq.sn)}`)}},
  {ex:"Jana si v januári odložila 10 € a každý ďalší mesiac odloží o 5 € viac než v predošlom. Koľko si odloží za celý rok? V ktorom mesiaci prvýkrát odloží aspoň 50 €?",
   steps:[
     ["Mesačné sumy tvoria aritmetickú postupnosť.", R`\vb{a_1} = 10,\qquad \va{d} = 5`],
     ["December je dvanásty člen.", R`a_{12} = 10 + 11 \cdot 5 = 65`],
     ["Za rok spolu.", R`s_{12} = \dfrac{12 \cdot (10 + 65)}{2} = 6 \cdot 75 = 450`],
     ["Kedy je mesačná suma aspoň 50?", R`10 + (n - 1) \cdot 5 \ge 50 \;\Rightarrow\; n - 1 \ge 8 \;\Rightarrow\; n \ge 9`]
   ],
   res:"Za rok si odloží **450 €**. Aspoň 50 € odloží prvýkrát v 9. mesiaci, teda v **septembri**."},
  R`Keď je obmedzený súčet (rozpočet, celková dĺžka), vyjde kvadratická nerovnica. Riešenie potom zaokrúhľuješ **nadol** na celé číslo.`,
  {ex:"Vŕtanie studne stojí 30 € za prvý meter a každý ďalší meter je o 4 € drahší než predošlý. Do akej hĺbky sa dá vŕtať s rozpočtom 1 000 €?",
   steps:[
     ["Ceny metrov tvoria aritmetickú postupnosť.", R`\vb{a_1} = 30,\qquad \va{d} = 4`],
     [R`Cena za $n$ metrov je súčet.`, R`s_n = \dfrac{n}{2}\,(60 + (n - 1) \cdot 4) = 2n^2 + 28n`],
     ["Súčet nesmie prekročiť rozpočet.", R`2n^2 + 28n \le 1000 \;\Rightarrow\; n^2 + 14n - 500 \le 0`],
     ["Kladný koreň rovnice.", R`n = \dfrac{-14 + \sqrt{196 + 2000}}{2} \doteq \dfrac{-14 + 46{,}86}{2} \doteq 16{,}43`],
     ["Celé metre: zaokrúhli nadol a over.", R`s_{16} = 2 \cdot 256 + 28 \cdot 16 = 960,\qquad s_{17} = 1054`]
   ],
   res:"Rozpočet stačí na **16 metrov** (960 €). Sedemnásty meter by ho už prekročil."},
  R`V geometrických úlohách sa oplatí zapísať tri po sebe idúce členy ako $a - d,\ a,\ a + d$. Diferencia sa potom pri sčítaní vyruší.`,
  {ex:"Dĺžky strán pravouhlého trojuholníka tvoria aritmetickú postupnosť s diferenciou 3 cm. Aké dlhé sú strany?",
   steps:[
     [R`Strany zapíš pomocou prostrednej. Najdlhšia je prepona.`, R`a - 3,\qquad a,\qquad a + 3`],
     ["Platí Pytagorova veta.", R`(a - 3)^2 + a^2 = (a + 3)^2`],
     ["Roznásob a uprav.", R`a^2 - 6a + 9 + a^2 = a^2 + 6a + 9 \;\Rightarrow\; a^2 - 12a = 0`],
     [R`$a(a - 12) = 0$, dĺžka strany nemôže byť nula.`, R`a = 12`]
   ],
   res:R`Strany merajú **9 cm, 12 cm a 15 cm**. Skúška: $81 + 144 = 225$.`},
  {tool:"postupnost", kind:"uloha", ask:"Turista prejde prvý deň 8 km a každý ďalší deň o 2 km viac. Za koľko dní prejde spolu 120 km? Vyber posledný deň.",
   hint:R`$\dfrac{n}{2}(16 + 2(n - 1)) = 120$ vedie na $n^2 + 7n - 120 = 0$.`, goal:P => P.n === 8,
   cfg:{typ:"ar", a1:{v:8, lock:true, note:"km v 1. deň"}, d:{v:2, lock:true, note:"km navyše"}, n:{v:3, note:"počet dní"}, count:10, y:[0, 30], on:{vals:true, sum:true},
     out:(P, h) => h.p(R`V $\vd{${P.n}}$. deň prejde $${h.tn(h.seq.an)}$ km.`)
       + h.calc(R`s_{\vd{${P.n}}} = \dfrac{\vd{${P.n}} \cdot (8 + ${h.tn(h.seq.an)})}{2} = ${h.tn(h.seq.sn)} \text{ km}`)
       + (P.n === 8 ? h.pill("120 km za 8 dní", "ok") : "")}},
  {warn:R`Rozlišuj „**v** piatom rade“ a „**v** piatich radoch **spolu**“. Prvé je člen $a_5$, druhé súčet $s_5$. Pri čítaní zadania si podčiarkni, na čo sa pýta.`}
]

  }
};
})();

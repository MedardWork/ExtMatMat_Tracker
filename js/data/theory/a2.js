/* Finančná matematika: úrok, pôžička, hypotéka, umorovací plán */
(() => {
const L = v => ({v, lock:true});
const m2 = (h, v) => h.tn(Math.round(v * 100) / 100);

THEORY.a2 = {
  mins:40,
  brief:[
    R`Jednoduché úročenie: úrok vždy len z vkladu, $K_n = K_0\left(1 + \frac{p}{100} \cdot n\right)$.`,
    R`Zložené úročenie: úrok sa pripisuje a ďalej úročí, $K_n = K_0 \cdot q^n$, kde $q = 1 + \frac{p}{100}$.`,
    R`Daň z úroku $19\,\%$: z úroku zostáva $81\,\%$, ročná sadzba sa násobí $0{,}81$.`,
    R`Pôžička splácaná rovnakými splátkami: $a = D \cdot \dfrac{i \cdot q^N}{q^N - 1}$. Každá splátka = úrok + úmor.`
  ],
  subs:{

"Jednoduché úročenie":[
  R`**Úrok** je odmena za požičanie peňazí. Banka ho udáva ako **úrokovú mieru** $\va{p}\,\%$ ročne (p. a.). Pri jednoduchom úročení sa úrok počíta každý rok z tej istej sumy, z pôvodného vkladu $\vb{K_0}$.`,
  {def:"Jednoduché úročenie", tex:R`u = \vb{K_0} \cdot \frac{\va{p}}{100} \cdot \vd{t},\qquad K = \vb{K_0} + u`, legend:[
    ["K₀", "b", "vklad", "istina, z ktorej sa úrok počíta"],
    ["p", "a", "úroková miera", "v percentách za rok"],
    ["t", "d", "doba", R`v rokoch; 8 mesiacov je $t = \frac{8}{12}$`]
  ]},
  {tool:"urok", ask:R`Porovnaj stĺpec jednoduchého úročenia so zloženým. Ako rastie jednoduchý úrok rok po roku?`,
   take:R`jednoduchý úrok pribúda každý rok o rovnakú sumu, stav rastie lineárne. Zložený rastie čím ďalej rýchlejšie.`,
   cfg:{typ:"vklad", k:L(1000), p:{v:8}, n:{v:10}, on:{jednoduche:true}, lock:["n"]}},
  R`Jednoduché úročenie sa v praxi používa najmä pri dobe kratšej než rok, keď sa úrok ešte nepripísal.`,
  {ex:R`Vklad 2 000 € je uložený na 8 mesiacov pri úrokovej miere $3\,\%$ p. a. Aký úrok prinesie?`,
   steps:[
     ["Doba v rokoch.", R`t = \frac{8}{12}`],
     ["Dosaď do vzorca.", R`u = 2\,000 \cdot 0{,}03 \cdot \frac{8}{12} = 40`]
   ],
   res:"Úrok je 40 €."},
  {ex:R`Vklad 5 000 € priniesol pri jednoduchom úročení za 2 roky úrok 150 €. Aká bola úroková miera?`,
   steps:[
     ["Z jedného roka je polovica úroku.", R`150 : 2 = 75`],
     ["Koľko percent je 75 z 5 000?", R`p = \frac{75}{5\,000} \cdot 100 = 1{,}5`]
   ],
   res:R`$1{,}5\,\%$ p. a.`},
  {tool:"urok", kind:"uloha", ask:R`Pri vklade 1 000 € na 5 rokov nastav úrokovú mieru $\va{p}$ tak, aby jednoduché úročenie prinieslo úroky spolu 200 €.`,
   hint:R`Za jeden rok to musí byť 40 €, čo je $4\,\%$ z 1 000.`,
   goal:P => P.p === 4,
   cfg:{typ:"vklad", k:L(1000), n:L(5), p:{v:2}, on:{jednoduche:true}}},
  {warn:R`Úroková miera je ročná. Pri 8 mesiacoch nedosadzuj $t = 8$, ale $t = \frac{8}{12}$. Inak vyjde dvanásťkrát väčší úrok.`}
],

"Zložené úročenie K · (1 + p)ⁿ":[
  R`Banky na vkladoch úrok na konci roka **pripíšu** k vkladu. Ďalší rok sa úročí už väčšia suma, takže sa úročia aj úroky. Každý rok sa stav vynásobí tým istým číslom $q$: je to geometrická postupnosť z [[a26]].`,
  {def:"Zložené úročenie", tex:R`K_n = \vb{K_0} \cdot q^{\vd{n}},\qquad q = 1 + \frac{\va{p}}{100}`, legend:[
    ["q", "a", "úročiteľ", R`pri $3\,\%$ je $q = 1{,}03$`],
    ["n", "d", "počet rokov", "koľkokrát sa úrok pripísal"]
  ]},
  {tool:"urok", ask:R`Meň úrokovú mieru $\va{p}$ a počet rokov $\vd{n}$. Ako sa mení úrok, ktorý pribudne v jednotlivých rokoch?`,
   take:R`úrok každý rok rastie, lebo sa počíta z väčšej sumy. Pri dlhej dobe je rozdiel oproti jednoduchému úročeniu veľký.`,
   cfg:{typ:"vklad", k:L(1000), p:{v:5}, n:{v:8}}},
  {tool:"graf", ask:R`Na grafe je stav účtu pri vklade 1 000 € počas 20 rokov, čiarkovane pri jednoduchom úročení. Meň $\va{p}$. Kedy sa krivky začnú výrazne rozchádzať?`,
   take:R`jednoduché úročenie je priamka, zložené exponenciála. Spočiatku sú takmer rovnaké, rozdiel rastie s počtom rokov aj s úrokom.`,
   cfg:{view:[-1.5, 7000, 21, -500], tick:[5, 1000], free:true, aspect:"4/3", axes:["roky", "€"],
     fns:[{f:"1000*(1+p/100)^x", dom:[0, 20]}, {f:"1000*(1+p/100*x)", color:"c", dash:true, dom:[0, 20]}],
     params:{p:{v:8, min:1, max:10, step:1, color:"a"}},
     show:[{pt:[20, "1000*(1+p/100)^20"], color:"a"}, {pt:[20, "1000*(1+p/5)"], color:"c"}],
     out:(P, h) => h.calc(R`K_{20} = 1\,000 \cdot ${h.tn(1 + P.p / 100)}^{20} \doteq ${m2(h, 1000 * (1 + P.p / 100) ** 20)}`)
       + h.calc(R`\text{jednoduché: } 1\,000 \cdot (1 + ${h.tn(P.p / 100)} \cdot 20) = ${h.tn(1000 * (1 + P.p / 5))}`)}},
  {ex:R`Vklad 5 000 € je uložený na 4 roky pri $2{,}5\,\%$ p. a. so zloženým úročením. Aký bude stav?`,
   steps:[
     ["Úročiteľ.", R`q = 1{,}025`],
     ["Dosaď.", R`K_4 = 5\,000 \cdot 1{,}025^4 \doteq 5\,519{,}06`]
   ],
   res:R`Približne $5\,519{,}06$ €, úroky spolu $519{,}06$ €.`},
  {ex:R`Za koľko rokov sa vklad pri $4\,\%$ p. a. zdvojnásobí?`,
   steps:[
     [R`Hľadáš $n$, pre ktoré $K_0 \cdot 1{,}04^n = 2K_0$.`, R`1{,}04^n = 2`],
     [R`Zlogaritmuj ([[b1]]).`, R`n = \frac{\log 2}{\log 1{,}04} \doteq 17{,}67`],
     ["Úrok sa pripisuje len raz za rok, treba celý rok navyše.", R`n = 18`]
   ],
   res:"Za 18 rokov."},
  {ex:R`Vklad 10 000 € vzrástol za 2 roky na 11 025 €. Aká bola úroková miera?`,
   steps:[
     ["Dosaď do vzorca.", R`10\,000 \cdot q^2 = 11\,025 \;\Rightarrow\; q^2 = 1{,}1025`],
     ["Odmocni.", R`q = 1{,}05 \;\Rightarrow\; p = 5`]
   ],
   res:R`$5\,\%$ p. a.`},
  {tool:"urok", kind:"uloha", ask:R`Vklad 1 000 € pri $5\,\%$ p. a. Nastav najmenší počet rokov $\vd{n}$, po ktorom stav prvýkrát presiahne 1 500 €.`,
   hint:R`Hľadáš najmenšie $n$, pre ktoré $1{,}05^n > 1{,}5$. Sleduj posledný riadok tabuľky.`,
   goal:P => P.n === 9,
   cfg:{typ:"vklad", k:L(1000), p:L(5), n:{v:3, max:15}}},
  {warn:R`$K_0 \cdot (1 + p)^n$ platí len s $p$ ako desatinným číslom: pri $5\,\%$ je to $1{,}05$, nie $1 + 5 = 6$. A $K_0 \cdot q^n$ nie je $(K_0 \cdot q)^n$, mocní sa len úročiteľ.`}
],

"Daň z úroku":[
  R`Z úroku na vklade sa na Slovensku platí **daň $19\,\%$**. Banka ju strhne hneď pri pripísaní úroku, takže na účte pribudne len $81\,\%$ úroku. Pri zloženom úročení sa ďalej úročí už len suma po zdanení.`,
  {def:"Úrok po zdanení", tex:R`u_{\text{čistý}} = 0{,}81 \cdot u,\qquad K_n = \vb{K_0} \cdot \left(1 + 0{,}81 \cdot \frac{\va{p}}{100}\right)^{\vd{n}}`, note:R`Pri $3\,\%$ p. a. je teda skutočný výnos $3 \cdot 0{,}81 = 2{,}43\,\%$.`},
  {tool:"urok", ask:R`Zapni a vypni daň z úroku. O koľko menej bude na účte po $\vd{n}$ rokoch?`,
   take:R`s daňou rastie vklad pomalšie, ako keby bola úroková miera $0{,}81$-krát menšia.`,
   cfg:{typ:"vklad", k:L(4000), p:{v:2}, n:{v:3}, toggles:["dan"], on:{dan:true}}},
  {ex:R`Vklad 4 000 € je uložený na rok pri $2\,\%$ p. a. Aký úrok banka pripíše po zdanení?`,
   steps:[
     ["Úrok pred zdanením.", R`4\,000 \cdot 0{,}02 = 80`],
     [R`Daň $19\,\%$ z úroku.`, R`80 \cdot 0{,}19 = 15{,}20`],
     ["Čistý úrok.", R`80 - 15{,}20 = 64{,}80 = 80 \cdot 0{,}81`]
   ],
   res:R`$64{,}80$ €.`},
  {ex:R`Aký bude stav vkladu 4 000 € po 3 rokoch pri $2\,\%$ p. a. so zloženým úročením a daňou z úroku?`,
   steps:[
     ["Úrok po zdanení je ročne:", R`2\,\% \cdot 0{,}81 = 1{,}62\,\% \;\Rightarrow\; q = 1{,}0162`],
     ["Dosaď.", R`K_3 = 4\,000 \cdot 1{,}0162^3 \doteq 4\,197{,}57`]
   ],
   res:R`Približne $4\,197{,}57$ €. Bez dane by to bolo $4\,244{,}83$ €.`},
  {tool:"urok", kind:"uloha", ask:R`Vklad 10 000 € na 1 rok, s daňou. Nastav úrokovú mieru $\va{p}$ tak, aby čistý úrok bol 243 €.`,
   hint:R`Pred zdanením musí byť úrok $243 : 0{,}81 = 300$ €.`,
   goal:P => P.p === 3,
   cfg:{typ:"vklad", k:L(10000), n:L(1), p:{v:1}, on:{dan:true}}},
  {warn:R`Daň sa neodpočíta raz z konečnej sumy, ale z úroku: od vkladu sa nič nestrháva. Nepočítaj $0{,}81 \cdot K_n$, to by bola daň aj z vlastných peňazí.`}
],

"Pôžička, hypotéka, splátky":[
  R`Pôžička je vklad naopak: dlh $\vb{D}$ sa úročí a dlžník ho spláca. Najčastejšie rovnakými splátkami $a$ (**anuita**) raz za rok alebo raz za mesiac. Hypotéka je dlhodobá pôžička na bývanie, splácaná mesačne.`,
  {def:"Splátka pôžičky", tex:R`a = \vb{D} \cdot \frac{i \cdot q^{N}}{q^{N} - 1},\qquad q = 1 + i`, legend:[
    ["D", "b", "výška pôžičky", "dlh na začiatku"],
    ["i", "a", "úrok za jedno obdobie", R`pri ročnej miere $p\,\%$ a mesačných splátkach $i = \frac{p}{100 \cdot 12}$`],
    ["N", "d", "počet splátok", R`pri mesačných splátkach na $n$ rokov $N = 12n$`]
  ]},
  {tool:"urok", ask:R`Meň dobu splácania $\vd{n}$. Ako sa mení výška splátky a koľko spolu zaplatíš na úrokoch?`,
   take:R`dlhšia doba znamená nižšiu splátku, ale viac zaplatených úrokov. Banke sa vráti viac než požičala.`,
   cfg:{typ:"pozicka", k:L(10000), p:L(6), n:{v:5, max:15}}},
  {ex:R`Pôžičku 10 000 € pri $6\,\%$ p. a. splácaš 5 rokov rovnakými ročnými splátkami. Aká je splátka a koľko zaplatíš na úrokoch?`,
   steps:[
     [R`$i = 0{,}06$, $q = 1{,}06$, $N = 5$.`, R`q^5 = 1{,}06^5 \doteq 1{,}3382`],
     ["Dosaď do vzorca.", R`a = 10\,000 \cdot \frac{0{,}06 \cdot 1{,}06^5}{1{,}06^5 - 1} \doteq 2\,373{,}96`],
     ["Spolu zaplatíš päť splátok.", R`5 \cdot a \doteq 11\,869{,}82`]
   ],
   res:R`Splátka $2\,373{,}96$ €, úroky spolu $1\,869{,}82$ €.`},
  {tool:"urok", ask:R`Hypotéka 80 000 € pri $4\,\%$ p. a. na 20 rokov s mesačnými splátkami. Meň dobu $\vd{n}$.`,
   take:R`mesačná splátka je asi 485 €. Za 20 rokov zaplatíš na úrokoch takmer polovicu požičanej sumy navyše.`,
   cfg:{typ:"pozicka", k:L(80000), p:L(4), n:{v:20, min:5, max:30}, on:{mesacne:true}, rows:8}},
  {ex:R`Aká je mesačná splátka hypotéky 80 000 € pri $4\,\%$ p. a. na 20 rokov?`,
   steps:[
     ["Mesačný úrok a počet splátok.", R`i = \frac{0{,}04}{12} \doteq 0{,}003333,\quad N = 240`],
     ["Dosaď.", R`a = 80\,000 \cdot \frac{i \cdot q^{240}}{q^{240} - 1} \doteq 484{,}78`],
     ["Spolu zaplatíš.", R`240 \cdot 484{,}78 \doteq 116\,348`]
   ],
   res:R`Približne $484{,}78$ € mesačne, úroky spolu asi $36\,348$ €.`},
  {tool:"urok", kind:"uloha", ask:R`Pôžička 10 000 € pri $6\,\%$ p. a. Nastav najkratšiu dobu $\vd{n}$, pri ktorej je ročná splátka nižšia než 1 500 €.`,
   hint:R`Pri 8 rokoch je splátka asi 1 610 €. Skús o rok viac.`,
   goal:P => P.n === 9,
   cfg:{typ:"pozicka", k:L(10000), p:L(6), n:{v:5, max:15}}},
  {warn:R`Pri mesačných splátkach sa ročná úroková miera delí dvanástimi a počet rokov násobí dvanástimi. Ak dosadíš $i = 0{,}04$ a $N = 240$, vyjde nezmysel.`}
],

"Umorovací plán":[
  R`**Umorovací plán** je tabuľka, ktorá ukáže, čo sa deje s každou splátkou. Najprv sa z nej zaplatí úrok z aktuálneho dlhu. Zvyšok, **úmor**, zníži dlh.`,
  {steps:[
    {t:"Úrok", d:R`úrok = zostatok dlhu $\cdot\ i$`},
    {t:"Úmor", d:R`úmor = splátka $-$ úrok`},
    {t:"Nový zostatok", d:R`zostatok = predchádzajúci zostatok $-$ úmor. Po poslednej splátke je nula.`}
  ]},
  {tool:"urok", ask:R`Sleduj stĺpce úrok a úmor. Ako sa mení ich pomer od prvej splátky k poslednej?`,
   take:R`splátka je stále rovnaká, ale úrok klesá, lebo dlh je menší. Úmor preto rastie a ku koncu tvorí takmer celú splátku.`,
   cfg:{typ:"pozicka", k:L(3000), p:{v:5}, n:L(3)}},
  {ex:R`Zostav umorovací plán pre pôžičku 3 000 € pri $5\,\%$ p. a. splácanú 3 rokmi ročnými splátkami.`,
   steps:[
     ["Splátka zo vzorca.", R`a = 3\,000 \cdot \frac{0{,}05 \cdot 1{,}05^3}{1{,}05^3 - 1} \doteq 1\,101{,}63`],
     ["1. rok: úrok z 3 000.", R`u_1 = 150,\quad \text{úmor} = 951{,}63,\quad D_1 = 2\,048{,}37`],
     ["2. rok: úrok zo zostatku.", R`u_2 \doteq 102{,}42,\quad \text{úmor} = 999{,}21,\quad D_2 \doteq 1\,049{,}17`],
     ["3. rok: úrok a posledný úmor.", R`u_3 \doteq 52{,}46,\quad \text{úmor} \doteq 1\,049{,}17,\quad D_3 \doteq 0`]
   ],
   res:R`| rok | splátka | úrok | úmor | zostatok |
|---|---|---|---|---|
| 1 | $1\,101{,}63$ | $150{,}00$ | $951{,}63$ | $2\,048{,}37$ |
| 2 | $1\,101{,}63$ | $102{,}42$ | $999{,}21$ | $1\,049{,}17$ |
| 3 | $1\,101{,}63$ | $52{,}46$ | $1\,049{,}17$ | $0$ |

Čísla sú zaokrúhlené na centy, preto riadky nemusia sedieť presne do centu.`},
  {ex:R`Dlh po druhej splátke je 4 200 €, úroková miera je $6\,\%$ p. a. a ročná splátka 1 500 €. Aký bude dlh po tretej splátke?`,
   steps:[
     ["Úrok v treťom roku.", R`4\,200 \cdot 0{,}06 = 252`],
     ["Úmor.", R`1\,500 - 252 = 1\,248`],
     ["Nový zostatok.", R`4\,200 - 1\,248 = 2\,952`]
   ],
   res:"$2\\,952$ €."},
  {tool:"urok", kind:"uloha", ask:R`Pôžička 8 000 € na 4 roky. Nastav úrokovú mieru $\va{p}$ tak, aby úrok v prvom roku bol 400 €.`,
   hint:R`V prvom roku sa úročí celý dlh 8 000 €.`,
   goal:P => P.p === 5,
   cfg:{typ:"pozicka", k:L(8000), n:L(4), p:{v:2}}},
  {warn:R`Úmor nie je rovnaký každý rok, rovnaká je splátka. Častá chyba je počítať úrok stále z pôvodnej pôžičky, úrok sa počíta vždy zo **zostatku** dlhu.`}
]

  }
};
})();

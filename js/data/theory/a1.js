/* Percentá, promile, pomer, trojčlenka, priama a nepriama úmernosť */
(() => {
const L = v => ({v, lock:true});

THEORY.a1 = {
  mins:35,
  brief:[
    R`$1\,\%$ je stotina základu: časť $= \vb{z} \cdot \dfrac{\va{p}}{100}$. Promile ($‰$) je tisícina.`,
    R`Zvýšenie o $p\,\%$ je násobenie číslom $1 + \frac{p}{100}$, zníženie číslom $1 - \frac{p}{100}$. Viac zmien za sebou sa násobí, nesčítava.`,
    R`Pomer $a : b$ rozdelí celok na $a + b$ dielov.`,
    R`Priama úmernosť $y = kx$: koľkokrát viac $x$, toľkokrát viac $y$. Nepriama $y = \frac{k}{x}$: koľkokrát viac $x$, toľkokrát menej $y$.`
  ],
  subs:{

"Percentá a promile — základ, časť, počet percent":[
  R`Percento znamená „zo sto“. **Základ** $\vb{z}$ je celok, s ktorým porovnávame, a ten má vždy $100\,\%$. Jedno percento je stotina základu, $\va{p}$ percent je $p$ stotín.`,
  {def:"Časť zo základu", tex:R`\text{časť} = \vb{z} \cdot \frac{\va{p}}{100}`, legend:[
    ["z", "b", "základ", R`celok, $100\,\%$`],
    ["p", "a", "počet percent", "koľko stotín základu berieme"]
  ]},
  {tool:"percenta", ask:R`Posúvaj počet percent $\va{p}$. Koľko je $1\,\%$ z čísla 80? A $50\,\%$?`,
   take:R`$1\,\%$ z 80 je $0{,}8$. Každé percento pridá rovnaký kúsok, $50\,\%$ je polovica a nad $100\,\%$ je časť väčšia než základ.`,
   cfg:{typ:"cast", z:L(80), p:{v:25}}},
  R`V úlohách sa pýtajú na hociktorú z troch veličín. Všetky tri vzorce sú ten istý vzťah, len inak upravený.`,
  {def:"Tri otázky", tex:R`\text{časť} = \frac{\vb{z} \cdot \va{p}}{100},\qquad \vb{z} = \frac{\text{časť} \cdot 100}{\va{p}},\qquad \va{p} = \frac{\text{časť}}{\vb{z}} \cdot 100`},
  {ex:R`a) Koľko je $15\,\%$ z 240? b) Z akého čísla je 36 práve $15\,\%$? c) Koľko percent je 18 zo 72?`,
   steps:[
     ["a) Časť zo základu.", R`240 \cdot 0{,}15 = 36`],
     [R`b) Hľadáš základ: $15\,\%$ je 36, takže $1\,\%$ je $36 : 15$.`, R`z = \frac{36 \cdot 100}{15} = 240`],
     ["c) Podiel časti a základu, krát 100.", R`p = \frac{18}{72} \cdot 100 = 25\,\%`]
   ],
   res:R`a) 36, b) 240, c) $25\,\%$.`},
  R`**Promile** ($‰$) znamená „z tisíc“. Používa sa pri malých podieloch: rýdzosť zlata, sklon cesty, alkohol v krvi.`,
  {tool:"percenta", ask:R`Koľko je $3\,‰$ z 5 000? Porovnaj s $3\,\%$.`,
   take:R`$3\,‰$ z 5 000 je 15, desaťkrát menej než $3\,\%$ (150). $1\,\% = 10\,‰$.`,
   cfg:{typ:"cast", promile:true, z:L(5000), p:{v:3, max:50}}},
  {ex:R`Prsteň zo zlata rýdzosti $585\,‰$ váži 4 g. Koľko gramov čistého zlata obsahuje?`,
   steps:[
     [R`$585\,‰$ je $0{,}585$ celku.`, R`4 \cdot \frac{585}{1000} = 4 \cdot 0{,}585`],
     ["Vynásob.", R`4 \cdot 0{,}585 = 2{,}34`]
   ],
   res:"$2{,}34$ g čistého zlata."},
  {tool:"percenta", kind:"uloha", ask:R`Základ je 250. Nastav $\va{p}$ tak, aby bola časť presne 40.`,
   hint:R`$p = \dfrac{40}{250} \cdot 100$.`,
   goal:P => P.p === 16,
   cfg:{typ:"cast", z:L(250), p:{v:30, max:100}}},
  {warn:R`Najprv zisti, čo je **základ**: to, „z čoho“ sa percentá počítajú. „O koľko percent je 60 viac než 50?“ má základ 50 ($20\,\%$). „O koľko percent je 50 menej než 60?“ má základ 60 (asi $16{,}7\,\%$).`}
],

"Opakované zmeny o percentá (zdraženie, zľava)":[
  R`Keď cena stúpne o $\va{p}\,\%$, nová cena je pôvodných $100\,\%$ plus $p\,\%$. Namiesto počítania prírastku a sčítania stačí jedno násobenie.`,
  {def:"Zmena o percentá", tex:R`\text{nová hodnota} = \vb{z} \cdot \left(1 + \frac{\va{p}}{100}\right)`, legend:[
    ["p", "a", "zmena v %", R`kladná pri zvýšení, záporná pri znížení: zľava $20\,\%$ je násobenie $0{,}8$`]
  ]},
  {tool:"percenta", ask:R`Meň zmenu $\va{p}$. Akým číslom sa násobí pri zdražení o $15\,\%$ a pri zľave $30\,\%$?`,
   take:R`zdraženie o $15\,\%$ je $\cdot 1{,}15$, zľava $30\,\%$ je $\cdot 0{,}7$. Zníženie o $100\,\%$ dá nulu.`,
   cfg:{typ:"zmena", z:L(200), p:{v:15}, hide:["q"]}},
  R`Druhá zmena sa počíta z novej hodnoty, nie z pôvodnej. Preto sa koeficienty **násobia**.`,
  {def:"Dve zmeny za sebou", tex:R`\vb{z} \cdot \left(1 + \frac{\va{p}}{100}\right) \cdot \left(1 + \frac{\vd{q}}{100}\right)`},
  {tool:"percenta", ask:R`Cenu zvýš o $\va{20\,\%}$ a potom zníž o $\vd{20\,\%}$. Vrátila sa na pôvodnú hodnotu?`,
   take:R`nie: $1{,}2 \cdot 0{,}8 = 0{,}96$, cena je o $4\,\%$ nižšia. Zľava sa počítala z vyššej ceny.`,
   cfg:{typ:"zmena", z:L(100), p:{v:20}, q:{v:-20}, on:{druha:true}}},
  {ex:R`Tovar za 80 € zdražel o $25\,\%$ a potom zlacnel o $20\,\%$. Aká je jeho cena?`,
   steps:[
     ["Koeficienty oboch zmien.", R`1{,}25 \quad\text{a}\quad 0{,}80`],
     ["Vynásob.", R`80 \cdot 1{,}25 \cdot 0{,}8 = 80 \cdot 1 = 80`]
   ],
   res:R`Opäť 80 €. Zdraženie o $25\,\%$ a zľava $20\,\%$ sa navzájom zrušia.`},
  {ex:R`Po zľave $15\,\%$ stojí bunda 68 €. Aká bola pôvodná cena?`,
   steps:[
     [R`Cena po zľave je $85\,\%$ pôvodnej.`, R`z \cdot 0{,}85 = 68`],
     ["Vydeľ koeficientom.", R`z = \frac{68}{0{,}85} = 80`]
   ],
   res:R`80 €. Nie $68 \cdot 1{,}15 = 78{,}20$ €.`},
  {ex:R`Nájomné trikrát po sebe stúplo o $10\,\%$. O koľko percent stúplo celkovo?`,
   steps:[
     ["Trikrát ten istý koeficient.", R`1{,}1^3 = 1{,}331`],
     [R`$1{,}331$ znamená $133{,}1\,\%$ pôvodnej hodnoty.`, R`133{,}1\,\% - 100\,\% = 33{,}1\,\%`]
   ],
   res:R`O $33{,}1\,\%$, nie o $30\,\%$.`},
  {tool:"percenta", kind:"uloha", ask:R`Cena 100 € stúpla o $\va{25\,\%}$. Nastav druhú zmenu $\vd{q}$ tak, aby sa vrátila presne na 100 €.`,
   hint:R`Po zdražení je 125 €. Potrebuješ $125 \cdot \left(1 + \frac{q}{100}\right) = 100$.`,
   goal:P => P.q === -20,
   cfg:{typ:"zmena", z:L(100), p:L(25), q:{v:-25}, on:{druha:true}}},
  {warn:R`Percentá sa pri viacerých zmenách nesčítavajú. Zdraženie o $20\,\%$ a zľava $20\,\%$ nedajú $0\,\%$, ale $-4\,\%$. A z ceny po zľave sa pôvodná cena nezíska pripočítaním toho istého percenta, ale delením.`}
],

"Pomer a delenie celku v pomere":[
  R`Pomer $\va{a} : \vb{b}$ hovorí, koľko **dielov** dostane každý. Pomer sa nezmení, keď obe čísla vynásobíš alebo vydelíš tým istým číslom: $4 : 6 = 2 : 3$.`,
  {def:"Delenie celku v pomere a : b", tex:R`1 \text{ diel} = \frac{\vc{c}}{\va{a} + \vb{b}},\qquad \text{časti: } \va{a} \cdot \text{diel},\ \ \vb{b} \cdot \text{diel}`},
  {tool:"percenta", ask:R`Celok 60 rozdeľ v pomere $\va{a} : \vb{b}$. Čo sa stane, keď nastavíš $2 : 3$ a potom $4 : 6$?`,
   take:R`$2 : 3$ aj $4 : 6$ dajú tie isté časti 24 a 36. Záleží len na tom, aký diel celku pripadne každému.`,
   cfg:{typ:"pomer", c:L(60), a:{v:2}, b:{v:3}}},
  {ex:R`Dvaja súrodenci si rozdelia 1 200 € v pomere $2 : 3$. Koľko dostane každý?`,
   steps:[
     ["Počet dielov.", R`2 + 3 = 5`],
     ["Veľkosť jedného dielu.", R`1\,200 : 5 = 240`],
     ["Časti.", R`2 \cdot 240 = 480,\quad 3 \cdot 240 = 720`]
   ],
   res:"480 € a 720 €. Kontrola: $480 + 720 = 1\\,200$."},
  {tool:"percenta", ask:R`Pomer troch čísel funguje rovnako. Rozdeľ 120 v pomere $1 : 2 : 3$.`,
   take:R`$1 + 2 + 3 = 6$ dielov po 20, časti sú 20, 40 a 60.`,
   cfg:{typ:"pomer", n:3, c:L(120), a:{v:1}, b:{v:2}, k:{v:3}}},
  {ex:R`Mapa má mierku $1 : 50\,000$. Akú skutočnú dĺžku má cesta, ktorá meria na mape $3{,}4$ cm?`,
   steps:[
     [R`1 cm na mape je $50\,000$ cm v skutočnosti.`, R`3{,}4 \cdot 50\,000 = 170\,000 \text{ cm}`],
     ["Preveď na kilometre.", R`170\,000 \text{ cm} = 1\,700 \text{ m} = 1{,}7 \text{ km}`]
   ],
   res:R`$1{,}7$ km.`},
  {ex:R`Uprav pomer $3 : 4{,}5$ na najjednoduchší tvar v celých číslach.`,
   steps:[
     ["Zbav sa desatinného čísla, vynásob 2.", R`3 : 4{,}5 = 6 : 9`],
     ["Vydeľ najväčším spoločným deliteľom 3.", R`6 : 9 = 2 : 3`]
   ],
   res:R`$2 : 3$`},
  {tool:"percenta", kind:"uloha", ask:R`Celok 60 je rozdelený na časti 24 a 36. Nastav pomer $\va{a} : \vb{b}$, ktorý to dá.`,
   hint:R`$24 : 36$ sa dá vykrátiť.`,
   goal:P => P.a * 36 === P.b * 24,
   cfg:{typ:"pomer", c:L(60), a:{v:1}, b:{v:1}}},
  {warn:R`Pri pomere $2 : 3$ nedostane prvý $\frac{2}{3}$ celku, ale $\frac{2}{5}$. Najprv sčítaj diely: menovateľ je $a + b$.`}
],

"Trojčlenka":[
  R`Trojčlenka je postup, ako z troch známych čísel nájsť štvrté. Prvý a najdôležitejší krok je rozhodnúť, či je závislosť **priama** (viac jedného, viac druhého) alebo **nepriama** (viac jedného, menej druhého).`,
  {steps:[
    {t:"Zápis", d:"Pod seba napíš známy riadok a riadok s neznámou, rovnaké veličiny pod seba."},
    {t:"Šípky", d:"Pri priamej úmernosti majú šípky rovnaký smer, pri nepriamej opačný."},
    {t:"Výpočet", d:R`Priama: $y_2 = y_1 \cdot \dfrac{x_2}{x_1}$. Nepriama: $y_2 = y_1 \cdot \dfrac{x_1}{x_2}$.`}
  ]},
  {tool:"percenta", ask:R`Priama úmernosť: meň $\vb{x_2}$. Koľkokrát sa zmení $\va{y_2}$, keď $x$ zdvojnásobíš?`,
   take:R`aj $y$ sa zdvojnásobí. Pomer $\frac{y}{x}$ zostáva rovnaký.`,
   cfg:{typ:"umera", x1:L(4), y1:L(10), x2:{v:8}}},
  {ex:R`5 kg jabĺk stojí $7{,}50$ €. Koľko stojí 8 kg?`,
   steps:[
     ["Viac kilogramov, viac eur: priama úmernosť.", R`5 \text{ kg} \to 7{,}50\ €,\quad 8 \text{ kg} \to x`],
     ["Násob pomerom v rovnakom smere.", R`x = 7{,}50 \cdot \frac{8}{5} = 12`]
   ],
   res:"12 €."},
  {tool:"percenta", ask:R`Nepriama úmernosť: viac robotníkov, menej dní. Meň $\vb{x_2}$ a sleduj $\va{y_2}$.`,
   take:R`súčin $x \cdot y$ sa nemení. Dvakrát viac robotníkov to stihne za polovicu dní.`,
   cfg:{typ:"umera", x1:L(6), y1:L(15), x2:{v:9}, on:{nepriama:true}}},
  {ex:R`6 robotníkov urobí prácu za 15 dní. Za koľko dní ju urobí 9 robotníkov?`,
   steps:[
     ["Viac robotníkov, menej dní: nepriama úmernosť.", R`6 \to 15,\quad 9 \to x`],
     ["Násob obráteným pomerom.", R`x = 15 \cdot \frac{6}{9} = 10`]
   ],
   res:R`Za 10 dní. Kontrola: $6 \cdot 15 = 9 \cdot 10 = 90$ robotníkodní.`},
  {tool:"percenta", kind:"uloha", ask:R`Turista prejde za $\vb{3}$ hodiny $\va{12}$ km. Nastav $\vb{x_2}$, počet hodín, za ktorý prejde 20 km rovnakým tempom.`,
   hint:R`Za 1 hodinu prejde 4 km.`,
   goal:P => P.x2 === 5,
   cfg:{typ:"umera", x1:L(3), y1:L(12), x2:{v:1}}},
  {warn:R`Trojčlenku nepoužívaj naslepo. Ak 1 kura znesie vajce za deň, 10 kúr neznesie 1 vajce za desatinu dňa. Najprv si over, či je závislosť naozaj úmernosť a akého druhu.`}
],

"Priama a nepriama úmernosť":[
  R`Pri **priamej úmernosti** je podiel $\frac{y}{x}$ stále rovnaké číslo $\va{k}$. Grafom je priamka, ktorá prechádza počiatkom.`,
  {def:"Priama úmernosť", tex:R`y = \va{k} \cdot x,\qquad \frac{y}{x} = \va{k}`, legend:[
    ["k", "a", "koeficient", "cena za kus, rýchlosť, koľko $y$ pripadá na jedno $x$"]
  ]},
  {tool:"graf", ask:R`Meň koeficient $\va{k}$. Prechádza priamka vždy počiatkom?`,
   take:R`áno, pre $x = 0$ je $y = 0$. Väčšie $k$ znamená strmšiu priamku.`,
   cfg:{view:[-1, 10, 10, -1], tick:1, fns:[{f:"k*x", lhs:"y", dom:[0, 10]}],
     params:{k:{v:1.5, min:.5, max:4, step:.5, color:"a"}},
     show:[{pt:[2, "2k"], color:"a", label:"[2; {2k}]", at:"l"}, {pt:[4, "4k"], color:"a", label:"[4; {4k}]", at:"l"}]}},
  R`Pri **nepriamej úmernosti** je stály súčin $x \cdot y$. Grafom je časť hyperboly.`,
  {def:"Nepriama úmernosť", tex:R`y = \frac{\va{k}}{x},\qquad x \cdot y = \va{k}`},
  {tool:"graf", ask:R`Meň $\va{k}$ a pozoruj body. Čo sa stane s $y$, keď $x$ zdvojnásobíš z 2 na 4?`,
   take:R`$y$ klesne na polovicu. Súčin súradníc každého bodu je $k$.`,
   cfg:{view:[-1, 10, 10, -1], tick:1, fns:[{f:"k/x", lhs:"y", dom:[0.2, 10]}],
     params:{k:{v:8, min:2, max:16, step:1, color:"a"}},
     show:[{pt:[2, "k/2"], color:"a", label:"[2; {k/2}]", at:"r"}, {pt:[4, "k/4"], color:"a", label:"[4; {k/4}]", at:"tr"}]}},
  {ex:R`Je $y$ úmerné $x$? Tabuľka: $x$: 2, 3, 6; $y$: 12, 8, 4.`,
   steps:[
     [R`Podiely $\frac{y}{x}$: $6$, $2{,}67$, $0{,}67$. Nie sú rovnaké, nie je to priama úmernosť.`, R`\frac{12}{2} \neq \frac{8}{3}`],
     ["Súčiny sú rovnaké.", R`2 \cdot 12 = 3 \cdot 8 = 6 \cdot 4 = 24`]
   ],
   res:R`Áno, nepriamo: $y = \dfrac{24}{x}$.`},
  {ex:R`$y$ je priamo úmerné $x$ a pre $x = 4$ je $y = 14$. Vypočítaj $y$ pre $x = 10$.`,
   steps:[
     ["Koeficient.", R`k = \frac{14}{4} = 3{,}5`],
     ["Dosaď.", R`y = 3{,}5 \cdot 10 = 35`]
   ],
   res:R`$y = 35$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{k}$ tak, aby graf priamej úmernosti prechádzal bodom $[4;\ 6]$.`,
   hint:R`$k = \dfrac{y}{x}$.`,
   goal:P => P.k === 1.5,
   cfg:{view:[-1, 10, 10, -1], tick:1, fns:[{f:"k*x", lhs:"y", dom:[0, 10]}],
     params:{k:{v:1, min:.5, max:4, step:.5, color:"a"}},
     show:[{target:[4, 6], fn:0, label:"[4; 6]", at:"r"}]}},
  {warn:R`„Čím viac, tým viac“ na priamu úmernosť nestačí. $y = 2x + 1$ tiež rastie, ale pre $x = 0$ nie je nula a podiel $\frac{y}{x}$ sa mení. Priama úmernosť musí prechádzať počiatkom.`}
]

  }
};
})();

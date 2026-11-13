/* Zaokrúhľovanie, približné čísla, zápis v tvare a · 10ⁿ */
(() => {
const L = v => ({v, lock:true});

THEORY.a3 = {
  mins:25,
  brief:[
    R`Rozhoduje prvá vynechaná číslica: $0$–$4$ nadol, $5$–$9$ nahor. Zaokrúhľuje sa naraz, nie po krokoch.`,
    R`Platné číslice sa počítajú od prvej nenulovej číslice zľava.`,
    R`Absolútna chyba $|x - a|$, relatívna $\dfrac{|x - a|}{|x|}$. Pri zaokrúhlení je absolútna chyba najviac pol jednotky posledného rádu.`,
    R`Vedecký zápis $a \cdot 10^n$, kde $1 \leq |a| < 10$ a $n$ je celé číslo.`
  ],
  subs:{

"Zaokrúhľovanie na rády a platné číslice":[
  R`Každá číslica čísla stojí na nejakom **ráde**: jednotky, desiatky, stovky, ale aj desatiny a stotiny. Zaokrúhliť na stovky znamená nahradiť číslo najbližším násobkom 100.`,
  {tool:"sustavy", ask:R`Pozri sa na rády čísla $38\,472$. Ktorá číslica stojí na ráde stoviek a ktorá hneď za ňou?`,
   take:R`na stovkách je 4, za ňou 7. Keďže $7 \geq 5$, zaokrúhlenie na stovky dá $38\,500$.`,
   cfg:{n:{v:38472, max:99999}, b:L(10), on:{rady:true}}},
  {def:"Pravidlo zaokrúhľovania", tex:R`\text{prvá vynechaná číslica } 0\text{–}4 \to \text{nadol},\qquad 5\text{–}9 \to \text{nahor}`, note:R`Čísla za ňou sa nepozerajú. Na mieste vynechaných celých rádov ostanú nuly, desatinné miesta sa vynechajú.`},
  R`**Platné číslice** sú všetky číslice od prvej nenulovej zľava. Nuly na začiatku desatinného čísla platné nie sú, len určujú rád. Zaokrúhlenie na 3 platné číslice zachová prvé tri z nich.`,
  {ex:R`Zaokrúhli $38\,472$ na tisícky a na stovky, $3{,}14159$ na desatiny a na 3 platné číslice a $0{,}004\,507$ na 2 platné číslice.`,
   steps:[
     ["Tisícky: za trojkou na tisícoch je 4.", R`38\,472 \approx 38\,000`],
     ["Stovky: za štvorkou je 7.", R`38\,472 \approx 38\,500`],
     ["Desatiny: za jednotkou je 4. Tri platné číslice: 3, 1, 4, za nimi 1.", R`3{,}14159 \approx 3{,}1 \qquad 3{,}14159 \approx 3{,}14`],
     ["Platné číslice začínajú štvorkou: 4, 5, za nimi 0.", R`0{,}004\,507 \approx 0{,}0045`]
   ],
   res:R`$38\,000$; $38\,500$; $3{,}1$; $3{,}14$; $0{,}0045$.`},
  {ex:R`Zaokrúhli $2{,}996$ na stotiny.`,
   steps:[
     ["Za stotinami (9) je 6, zaokrúhľuje sa nahor.", R`2{,}99 + 0{,}01 = 3{,}00`],
     ["Nuly na konci nechaj: ukazujú, že výsledok je presný na stotiny.", R`2{,}996 \approx 3{,}00`]
   ],
   res:R`$3{,}00$ (nie $3$).`},
  R`Opačná otázka: ktoré čísla sa zaokrúhlia na $3{,}7$? Všetky, ktoré sú bližšie k $3{,}7$ než k $3{,}6$ alebo $3{,}8$. Na číselnej osi je to interval.`,
  {tool:"os", kind:"uloha", ask:R`Nastav interval všetkých čísel, ktoré sa po zaokrúhlení na desatiny rovnajú $3{,}7$. Rozhodni aj, ktoré konce do neho patria.`,
   hint:R`$3{,}65$ sa zaokrúhli nahor na $3{,}7$, ale $3{,}75$ už na $3{,}8$.`,
   goal:P => P.a === 3.65 && P.b === 3.75 && P.la && !P.lb,
   cfg:{typ:"interval", min:3.5, max:3.9, step:.05, a:{v:3.6}, b:{v:3.8}, toggles:["la", "lb"]}},
  {warn:R`Nezaokrúhľuj po krokoch. $2{,}449$ na desatiny je $2{,}4$, lebo rozhoduje číslica 4. Postup $2{,}449 \to 2{,}45 \to 2{,}5$ je chybný.`}
],

"Odhad a približný výpočet":[
  R`Pred počítaním na kalkulačke sa oplatí odhadnúť, aký výsledok čakáš. Čísla zaokrúhli na jednu alebo dve platné číslice tak, aby sa s nimi dalo počítať spamäti. Odhad odhalí preklep alebo chybne umiestnenú desatinnú čiarku.`,
  {ex:R`Odhadni $387 \cdot 52$ a $6\,183 : 29$.`,
   steps:[
     ["Zaokrúhli na čísla, ktoré sa ľahko násobia.", R`387 \cdot 52 \approx 400 \cdot 50 = 20\,000`],
     ["Pri delení zaokrúhli tak, aby to vyšlo bez zvyšku.", R`6\,183 : 29 \approx 6\,000 : 30 = 200`]
   ],
   res:R`Odhady $20\,000$ a $200$. Presne $20\,124$ a približne $213{,}2$.`},
  R`Rozdiel medzi presnou hodnotou $x$ a jej približnou hodnotou $a$ je **absolútna chyba**. Keď ju vydelíš veľkosťou čísla, dostaneš **relatívnu chybu**, zvyčajne v percentách.`,
  {def:"Chyby približného čísla", tex:R`\Delta = |x - a|,\qquad \delta = \frac{|x - a|}{|x|}`, legend:[
    ["Δ", "a", "absolútna chyba", "o koľko sa približná hodnota líši, v jednotkách čísla"],
    ["δ", "b", "relatívna chyba", "aká veľká je chyba v pomere k číslu"]
  ]},
  {tool:"os", ask:R`Číslo zaokrúhlené na desatiny je $3{,}7$. Kde môže ležať presná hodnota? Meň vzdialenosť $\va{r}$.`,
   take:R`presná hodnota je od $3{,}7$ vzdialená najviac $0{,}05$, čo je pol jednotky rádu desatín. To je najväčšia možná absolútna chyba.`,
   cfg:{typ:"abs", min:3.5, max:3.9, step:.05, s:L(3.7), r:{v:.1}, on:{rovne:true}}},
  {ex:R`Číslo $\pi = 3{,}14159\ldots$ nahradíme hodnotou $3{,}14$. Aká je absolútna a relatívna chyba?`,
   steps:[
     ["Absolútna chyba.", R`\Delta = 3{,}14159 - 3{,}14 \doteq 0{,}0016`],
     ["Relatívna chyba.", R`\delta = \frac{0{,}0016}{3{,}1416} \doteq 0{,}0005 = 0{,}05\,\%`]
   ],
   res:R`$\Delta \doteq 0{,}0016$, $\delta \doteq 0{,}05\,\%$.`},
  {ex:R`Dĺžka 12 m je odmeraná s chybou 5 cm, hrúbka 2 mm s chybou $0{,}5$ mm. Ktoré meranie je presnejšie?`,
   steps:[
     ["Relatívna chyba dĺžky.", R`\frac{0{,}05}{12} \doteq 0{,}0042 = 0{,}42\,\%`],
     ["Relatívna chyba hrúbky.", R`\frac{0{,}5}{2} = 0{,}25 = 25\,\%`]
   ],
   res:"Presnejšie je meranie dĺžky, hoci jeho absolútna chyba je stokrát väčšia."},
  {tool:"os", kind:"uloha", ask:R`Výsledok zaokrúhlený na celé čísla je 12. Nastav najväčšiu možnú vzdialenosť $\va{r}$ presnej hodnoty od 12.`,
   hint:"Pol jednotky rádu, na ktorý sa zaokrúhľovalo.",
   goal:P => P.r === .5,
   cfg:{typ:"abs", min:10, max:14, step:.25, s:L(12), r:{v:1}, on:{rovne:true}}},
  {warn:R`Medzivýsledky nezaokrúhľuj. Chyba sa ďalším počítaním zväčšuje: ak medzivýsledok $1{,}234$ zaokrúhliš na $1{,}2$ a potom ho násobíš 100, dostaneš $120$ namiesto $123{,}4$. Zaokrúhli až na konci.`}
],

"Zápis v tvare a · 10ⁿ":[
  R`Veľmi veľké a veľmi malé čísla sa zapisujú pomocou mocnín desiatky. Číslo $a$ má pred desatinnou čiarkou jedinú nenulovú číslicu a exponent $n$ povie, o koľko miest treba čiarku posunúť.`,
  {def:"Vedecký zápis", tex:R`x = \va{a} \cdot 10^{\vd{n}},\qquad 1 \leq |\va{a}| < 10,\quad \vd{n} \in \mathbb{Z}`, legend:[
    ["a", "a", "mantisa", "jedna nenulová číslica pred čiarkou"],
    ["n", "d", "exponent", "kladný pre veľké čísla, záporný pre čísla menšie než 1"]
  ]},
  {tool:"sustavy", ask:R`Meň číslo a sleduj najvyšší rád. Aký exponent bude mať jeho vedecký zápis?`,
   take:R`exponent je rád prvej číslice: pri šesťcifernom čísle $10^5$. Napríklad $384\,000 = 3{,}84 \cdot 10^5$.`,
   cfg:{n:{v:384000, max:999999}, b:L(10), on:{rady:true}}},
  {steps:[
    {t:"Posuň čiarku", d:"Za prvú nenulovú číslicu."},
    {t:"Spočítaj miesta", d:"Koľko miest si čiarku posunul, toľko je $|n|$."},
    {t:"Znamienko", d:R`Posun doľava (veľké číslo): $n > 0$. Posun doprava (číslo menšie než 1): $n < 0$.`}
  ]},
  {ex:R`Zapíš v tvare $a \cdot 10^n$: $384\,000$ a $0{,}000\,52$.`,
   steps:[
     ["Čiarku posuň o 5 miest doľava.", R`384\,000 = 3{,}84 \cdot 10^5`],
     ["Čiarku posuň o 4 miesta doprava.", R`0{,}000\,52 = 5{,}2 \cdot 10^{-4}`]
   ],
   res:R`$3{,}84 \cdot 10^5$ a $5{,}2 \cdot 10^{-4}$.`},
  {ex:R`Vypočítaj $(3 \cdot 10^4) \cdot (5 \cdot 10^{-7})$ a $(8{,}4 \cdot 10^6) : (2{,}1 \cdot 10^{-2})$.`,
   steps:[
     ["Mantisy vynásob, exponenty sčítaj.", R`15 \cdot 10^{-3}`],
     [R`$15$ nie je menšie než 10, posuň čiarku.`, R`15 \cdot 10^{-3} = 1{,}5 \cdot 10^{-2}`],
     ["Pri delení mantisy vydeľ, exponenty odčítaj.", R`\frac{8{,}4}{2{,}1} \cdot 10^{6 - (-2)} = 4 \cdot 10^8`]
   ],
   res:R`$1{,}5 \cdot 10^{-2}$ a $4 \cdot 10^8$.`},
  {ex:R`Slnko je od Zeme vzdialené $1{,}5 \cdot 10^8$ km, svetlo letí rýchlosťou $3 \cdot 10^5$ km/s. Za aký čas dorazí svetlo zo Slnka na Zem?`,
   steps:[
     ["Čas = dráha : rýchlosť.", R`t = \frac{1{,}5 \cdot 10^8}{3 \cdot 10^5} = 0{,}5 \cdot 10^3 = 500 \text{ s}`],
     ["Na minúty.", R`500 : 60 \doteq 8{,}3 \text{ min}`]
   ],
   res:"Asi 500 s, čiže približne 8 minút a 20 sekúnd."},
  R`| predpona | giga | mega | kilo | mili | mikro | nano |
|---|---|---|---|---|---|---|
| značka | G | M | k | m | μ | n |
| násobok | $10^9$ | $10^6$ | $10^3$ | $10^{-3}$ | $10^{-6}$ | $10^{-9}$ |`,
  {warn:R`$38 \cdot 10^4$ ani $0{,}38 \cdot 10^6$ nie sú vedecký zápis, hoci majú správnu hodnotu. Pred čiarkou musí byť práve jedna nenulová číslica: $3{,}8 \cdot 10^5$.`}
]

  }
};
})();

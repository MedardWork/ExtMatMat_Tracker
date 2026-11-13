/* Lineárne rovnice a nerovnice, sústavy */
(() => {
const L = v => ({v, lock:true});
const pm = (h, v) => v < 0 ? `- ${h.tn(-v)}` : `+ ${h.tn(v)}`;

THEORY.a14 = {
  mins:40,
  brief:[
    R`Ekvivalentné úpravy: k obom stranám pripočítaj to isté, obe strany vynásob rovnakým nenulovým číslom. $ax = b$ má pre $a \neq 0$ jedno riešenie $x = \frac{b}{a}$.`,
    R`Pri nerovnici sa po vynásobení alebo vydelení **záporným** číslom otočí znak nerovnosti.`,
    R`Dosadzovacia metóda: z jednej rovnice vyjadri neznámu a dosaď do druhej. Sčítacia: rovnice vynásob tak, aby sa po sčítaní jedna neznáma vyrušila.`,
    R`Graficky je riešenie sústavy priesečník dvoch priamok.`
  ],
  subs:{

"Lineárne rovnice":[
  R`Lineárna rovnica obsahuje neznámu len v prvej mocnine. Rieši sa **ekvivalentnými úpravami**: kroky, ktoré nezmenia množinu riešení. Cieľ je dostať neznámu osamote na jednu stranu.`,
  {def:"Ekvivalentné úpravy", tex:R`A = B \;\Leftrightarrow\; A + C = B + C \;\Leftrightarrow\; k \cdot A = k \cdot B\quad (k \neq 0)`},
  {tool:"graf", ask:R`Riešenie rovnice $\va{a}x + \vb{b} = 0$ je priesečník priamky $y = ax + b$ s osou $x$. Meň $\va{a}$ a $\vb{b}$. Čo sa stane pre $a = 0$?`,
   take:R`pre $a \neq 0$ je priesečník práve jeden, $x = -\frac{b}{a}$. Pre $a = 0$ je priamka vodorovná: buď os $x$ nepretne (žiadne riešenie), alebo s ňou splýva ($b = 0$, nekonečne veľa).`,
   cfg:{view:[-6, 5, 6, -5], tick:1, fns:[{f:"a*x+b", lhs:"y"}],
     params:{a:{v:2, min:-3, max:3, step:.5, color:"a"}, b:{v:-3, min:-4, max:4, step:1, color:"b"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => h.calc(R`\va{${h.tn(P.a)}}x ${pm(h, P.b)} = 0`) + (P.a !== 0 ? h.calc(R`x = ${h.tn(Math.round(-P.b / P.a * 1000) / 1000)}`) : h.pill(P.b === 0 ? "nekonečne veľa riešení" : "žiadne riešenie", "flat"))}},
  {ex:R`Vyrieš $3(x - 2) - 5 = 2x + 1$.`,
   steps:[
     ["Roznásob.", R`3x - 6 - 5 = 2x + 1`],
     ["Neznáme na jednu stranu, čísla na druhú.", R`3x - 2x = 1 + 6 + 5`],
     ["Výsledok a skúška.", R`x = 12:\quad 3 \cdot 10 - 5 = 25 = 2 \cdot 12 + 1`]
   ],
   res:R`$x = 12$`},
  {ex:R`Vyrieš $\dfrac{x + 1}{2} - \dfrac{x - 2}{3} = 1$.`,
   steps:[
     ["Vynásob celú rovnicu spoločným menovateľom 6.", R`3(x + 1) - 2(x - 2) = 6`],
     ["Roznásob, pozor na mínus pred zátvorkou.", R`3x + 3 - 2x + 4 = 6`],
     ["Uprav.", R`x = -1`]
   ],
   res:R`$x = -1$`},
  {ex:R`Vyrieš $2(x + 1) = 2x + 5$ a $2(x + 1) = 2x + 2$.`,
   steps:[
     [R`Prvá: $2x + 2 = 2x + 5$, po odčítaní $2x$.`, R`2 = 5 \text{ neplatí}`],
     [R`Druhá: $2x + 2 = 2x + 2$.`, R`2 = 2 \text{ platí vždy}`]
   ],
   res:R`Prvá nemá riešenie, druhá platí pre každé $x \in \mathbb{R}$.`},
  {tool:"graf", kind:"uloha", ask:R`Pri $\va{a} = 2$ nastav $\vb{b}$ tak, aby rovnica $2x + b = 0$ mala riešenie $x = 3$.`,
   hint:R`Dosaď $x = 3$: $6 + b = 0$.`,
   goal:P => P.b === -6,
   cfg:{view:[-6, 5, 6, -8], tick:1, fns:[{f:"a*x+b", lhs:"y"}],
     params:{a:L(2), b:{v:1, min:-8, max:4, step:1, color:"b"}},
     show:[{target:[3, 0], fn:0, label:"x = 3", at:"tl"}]}},
  {warn:R`Pri odstraňovaní zlomkov vynásob **každý** člen, aj ten na pravej strane bez zlomku. A mínus pred zlomkom zmení znamienka celého čitateľa: $-\frac{x - 2}{3} \cdot 6 = -2(x - 2) = -2x + 4$.`}
],

"Lineárne nerovnice":[
  R`Nerovnica sa rieši rovnakými úpravami ako rovnica, s jednou výnimkou. Keď obe strany vynásobíš alebo vydelíš **záporným** číslom, znak nerovnosti sa otočí: z $-x > 2$ je $x < -2$. Riešením je interval.`,
  {def:"Násobenie nerovnice", tex:R`A < B \;\Leftrightarrow\; kA < kB\ \ (k > 0),\qquad A < B \;\Leftrightarrow\; kA > kB\ \ (k < 0)`},
  {tool:"graf", ask:R`Nerovnica $\va{a}x + \vb{b} > 0$: kde je priamka nad osou $x$? Ako sa to zmení, keď je $a$ záporné?`,
   take:R`pre $a > 0$ je priamka nad osou vpravo od nulového bodu, riešenie $x > -\frac{b}{a}$. Pre $a < 0$ vľavo, $x < -\frac{b}{a}$. Preto sa pri delení záporným $a$ otočí znak.`,
   cfg:{view:[-6, 5, 6, -5], tick:1, fns:[{f:"a*x+b", lhs:"y"}],
     params:{a:{v:-2, min:-3, max:3, step:.5, color:"a"}, b:{v:4, min:-4, max:4, step:1, color:"b"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => P.a === 0 ? h.p("Pre $a = 0$ nie je nerovnica lineárna v $x$.") : h.calc(R`\va{${h.tn(P.a)}}x ${pm(h, P.b)} > 0 \;\Rightarrow\; x ${P.a > 0 ? ">" : "<"} ${h.tn(Math.round(-P.b / P.a * 1000) / 1000)}`)}},
  {ex:R`Vyrieš $3 - 2x > 7$.`,
   steps:[
     ["Odčítaj 3.", R`-2x > 4`],
     [R`Vydeľ $-2$, otoč znak.`, R`x < -2`]
   ],
   res:R`$x \in (-\infty;\ -2)$`},
  {ex:R`Vyrieš $\dfrac{x - 1}{2} \leq \dfrac{2x + 1}{3}$.`,
   steps:[
     ["Vynásob 6 (kladné číslo, znak ostáva).", R`3x - 3 \leq 4x + 2`],
     ["Neznáme doprava.", R`-5 \leq x`]
   ],
   res:R`$x \in \langle -5;\ \infty)$`},
  {ex:R`Vyrieš sústavu nerovníc $2x - 1 > 3$ a $x + 4 \leq 10$.`,
   steps:[
     ["Každú zvlášť.", R`x > 2,\quad x \leq 6`],
     ["Musia platiť obe: prienik.", R`(2;\ \infty) \cap (-\infty;\ 6\rangle = (2;\ 6\rangle`]
   ],
   res:R`$x \in (2;\ 6 \rangle$`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi interval, ktorý je riešením nerovnice $-3x + 6 \geq 0$.`,
   hint:R`$-3x \geq -6$, deľ $-3$ a otoč znak.`,
   goal:P => P.linf && !P.rinf && P.b === 2 && P.lb,
   cfg:{typ:"interval", a:{v:-2}, b:{v:4}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`Najčastejšia chyba: zabudnúť otočiť znak pri delení záporným číslom. Skúška jedným číslom to odhalí: pri $3 - 2x > 7$ skús $x = -3$: $9 > 7$ platí, teda $-3$ v riešení byť má.`}
],

"Sústava — dosadzovacia metóda":[
  R`Sústava dvoch lineárnych rovníc s dvoma neznámymi hľadá dvojicu $[x;\ y]$, ktorá spĺňa obe rovnice. Každá rovnica je priamka, riešenie je ich **priesečník**.`,
  {tool:"graf", ask:R`Priamky $y = 2x - 1$ a $y = \va{k}x + 3$. Meň $\va{k}$. Kedy priesečník neexistuje?`,
   take:R`pre $k = 2$ sú priamky rovnobežné a sústava nemá riešenie. Keby navyše splývali, mala by nekonečne veľa riešení. Inak má práve jedno.`,
   cfg:{view:[-5, 7, 6, -4], tick:1, fns:[{f:"2x-1", lhs:"y"}, {f:"k*x+3", lhs:"y", color:"c"}],
     params:{k:{v:-1, min:-3, max:3, step:.5, color:"a"}},
     show:[{meet:[0, 1], color:"d"}],
     out:(P, h) => P.k === 2 ? h.pill("rovnobežné: žiadne riešenie", "down") : h.calc(R`x = \frac{4}{2 - ${P.k < 0 ? `(\\va{${h.tn(P.k)}})` : `\\va{${h.tn(P.k)}}`}} = ${h.tn(Math.round(4 / (2 - P.k) * 1000) / 1000)},\quad y = ${h.tn(Math.round((8 / (2 - P.k) - 1) * 1000) / 1000)}`)}},
  {steps:[
    {t:"Vyjadri", d:"Z jednej rovnice vyjadri jednu neznámu (najlepšie tú s koeficientom 1)."},
    {t:"Dosaď", d:"Výraz dosaď do druhej rovnice. Vznikne rovnica s jednou neznámou."},
    {t:"Dopočítaj", d:"Vypočítanú hodnotu dosaď do vyjadrenia a urob skúšku v oboch rovniciach."}
  ]},
  {ex:R`Vyrieš sústavu $x + 2y = 7$, $3x - y = 7$.`,
   steps:[
     ["Z prvej vyjadri $x$.", R`x = 7 - 2y`],
     ["Dosaď do druhej.", R`3(7 - 2y) - y = 7 \;\Rightarrow\; 21 - 7y = 7 \;\Rightarrow\; y = 2`],
     ["Dopočítaj a over.", R`x = 7 - 4 = 3;\quad 3 + 4 = 7,\ 9 - 2 = 7`]
   ],
   res:R`$[x;\ y] = [3;\ 2]$`},
  {ex:R`Koľko riešení má sústava $2x - y = 3$, $4x - 2y = 5$?`,
   steps:[
     [R`Z prvej $y = 2x - 3$.`, R`4x - 2(2x - 3) = 5`],
     ["Uprav.", R`6 = 5 \text{ neplatí}`]
   ],
   res:"Žiadne, priamky sú rovnobežné (obe majú smernicu 2)."},
  {tool:"graf", kind:"uloha", ask:R`Priamky $y = 2x - 1$ a $y = -x + \vb{q}$. Nastav $\vb{q}$ tak, aby sa pretli v bode s $x = 2$.`,
   hint:R`Pre $x = 2$ je na prvej priamke $y = 3$. Ten bod musí ležať aj na druhej.`,
   goal:P => P.q === 5,
   cfg:{view:[-4, 7, 6, -4], tick:1, fns:[{f:"2x-1", lhs:"y"}, {f:"-x+q", lhs:"y", color:"c"}],
     params:{q:{v:1, min:-3, max:7, step:1, color:"b"}},
     show:[{meet:[0, 1], color:"d"}, {vline:2, color:"soft"}]}},
  {warn:R`Po výpočte jednej neznámej sa nezastav, sústava chce obe. A skúšku rob dosadením do **pôvodných** rovníc, nie do upravenej.`}
],

"Sústava — sčítacia metóda":[
  R`Ak žiadna neznáma nemá koeficient 1, je pohodlnejšie rovnice vynásobiť vhodnými číslami tak, aby mala jedna neznáma v oboch rovniciach opačné koeficienty. Po sčítaní rovníc zmizne.`,
  {def:"Sčítacia metóda", tex:R`\begin{aligned}a_1 x + b_1 y &= c_1 \quad / \cdot m\\ a_2 x + b_2 y &= c_2 \quad / \cdot n\end{aligned}\qquad m b_1 + n b_2 = 0`},
  {ex:R`Vyrieš sústavu $2x + 3y = 12$, $5x - 2y = 11$.`,
   steps:[
     [R`Aby sa vyrušilo $y$: prvú rovnicu vynásob 2, druhú 3.`, R`4x + 6y = 24,\quad 15x - 6y = 33`],
     ["Sčítaj.", R`19x = 57 \;\Rightarrow\; x = 3`],
     ["Dosaď do prvej.", R`6 + 3y = 12 \;\Rightarrow\; y = 2`]
   ],
   res:R`$[3;\ 2]$`},
  {tool:"graf", kind:"obr", ask:R`Sústava $2x + 3y = 12$, $5x - 2y = 11$ v rovine.`,
   take:R`priamky sa pretínajú v bode $[3;\ 2]$, to je riešenie.`,
   cfg:{view:[-2, 6, 7, -3], tick:1, fns:[{f:"(12-2x)/3", lhs:"y"}, {f:"(5x-11)/2", lhs:"y", color:"c"}], show:[{meet:[0, 1], color:"d"}]}},
  {ex:R`Vyrieš sústavu $\dfrac{x}{2} + \dfrac{y}{3} = 4$, $x - y = 3$.`,
   steps:[
     ["Prvú vynásob 6.", R`3x + 2y = 24`],
     ["Druhú vynásob 2 a sčítaj.", R`2x - 2y = 6 \;\Rightarrow\; 5x = 30 \;\Rightarrow\; x = 6`],
     ["Dopočítaj.", R`y = x - 3 = 3`]
   ],
   res:R`$[6;\ 3]$. Skúška: $3 + 1 = 4$, $6 - 3 = 3$.`},
  {warn:R`Násob celú rovnicu, aj pravú stranu. $2x + 3y = 12$ krát 2 je $4x + 6y = 24$, nie $4x + 6y = 12$.`}
],

"Slovné úlohy":[
  R`Slovná úloha sa prekladá do rovníc. Najťažší je prvý krok: rozhodnúť, čo označiť neznámou, a nájsť vzťahy, ktoré zo zadania vyplývajú.`,
  {steps:[
    {t:"Neznáme", d:"Zapíš, čo je $x$ (a $y$), aj s jednotkou."},
    {t:"Rovnice", d:"Každú informáciu zo zadania prepíš na rovnicu."},
    {t:"Riešenie", d:"Vyrieš a urob skúšku podľa zadania, nie podľa rovníc."},
    {t:"Odpoveď", d:"Odpovedz celou vetou na otázku, ktorú úloha kladie."}
  ]},
  {ex:R`Na koncert sa predalo 120 lístkov, dospelý za 8 €, dieťa za 5 €. Tržba bola 780 €. Koľko lístkov kúpili deti?`,
   steps:[
     [R`$d$ dospelí, $c$ deti.`, R`d + c = 120,\quad 8d + 5c = 780`],
     [R`Dosaď $d = 120 - c$.`, R`960 - 8c + 5c = 780 \;\Rightarrow\; c = 60`],
     ["Skúška.", R`60 \cdot 8 + 60 \cdot 5 = 780`]
   ],
   res:"Deti kúpili 60 lístkov."},
  {tool:"graf", kind:"obr", ask:R`Úloha s lístkami v rovine: $d + c = 120$ a $8d + 5c = 780$.`,
   take:R`priamky sa pretínajú v bode $[60;\ 60]$. Každá rovnica sama má nekonečne veľa riešení, obe naraz len jedno.`,
   cfg:{view:[-10, 170, 130, -15], tick:[20, 20], free:true, aspect:"4/3", axes:["d", "c"], fns:[{f:"120-x", lhs:"c", dom:[0, 120]}, {f:"(780-8x)/5", lhs:"c", color:"c", dom:[0, 97.5]}], show:[{meet:[0, 1], color:"d"}],
     out:(P, h) => h.calc(R`d + c = 120`) + h.calc(R`8d + 5c = 780`)}},
  {ex:R`Dve mestá sú od seba 60 km. Oproti sebe vyrazia naraz dvaja cyklisti rýchlosťou 18 km/h a 12 km/h. Za aký čas sa stretnú?`,
   steps:[
     [R`Za čas $t$ prejdú spolu celú vzdialenosť.`, R`18t + 12t = 60`],
     ["Vyrieš.", R`30t = 60 \;\Rightarrow\; t = 2`]
   ],
   res:"Stretnú sa po 2 hodinách, prvý prejde 36 km."},
  {ex:R`Koľko litrov $60\,\%$ roztoku treba pridať k 10 litrom $30\,\%$ roztoku, aby vznikol $40\,\%$ roztok?`,
   steps:[
     ["Množstvo látky sa sčíta.", R`0{,}3 \cdot 10 + 0{,}6x = 0{,}4(10 + x)`],
     ["Uprav.", R`3 + 0{,}6x = 4 + 0{,}4x \;\Rightarrow\; 0{,}2x = 1 \;\Rightarrow\; x = 5`]
   ],
   res:"5 litrov."},
  {warn:R`Výsledok over v zadaní, nie len v rovnici. Ak vyjde 60,5 lístka alebo záporný počet litrov, chyba je pravdepodobne v zostavení rovnice.`}
]

  }
};
})();

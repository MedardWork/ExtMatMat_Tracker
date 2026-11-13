/* Kvantifikované výroky a ich negácia */
(() => {
const ok = (P, st) => st.ok;

THEORY.a8 = {
  mins:25,
  brief:[
    R`$\forall x$: „pre každé $x$“ (všeobecný kvantifikátor). $\exists x$: „existuje $x$“ (existenčný).`,
    R`Negácia vymení kvantifikátor a neguje tvrdenie: $\neg(\forall x\ V(x)) \equiv \exists x\ \neg V(x)$, $\neg(\exists x\ V(x)) \equiv \forall x\ \neg V(x)$.`,
    R`Negácia „aspoň $n$“ je „najviac $n - 1$“. Negácia „najviac $n$“ je „aspoň $n + 1$“. „Práve $n$“ = „aspoň $n$ a najviac $n$“.`
  ],
  subs:{

"Kvantifikátory „každý“ a „existuje“":[
  R`Výroková forma $x > 3$ nie je výrok. Výrokom sa stane, keď povieš, pre ktoré $x$ má platiť: pre **všetky**, alebo aspoň pre **jedno**. Slová „každý“ a „existuje“ sa volajú **kvantifikátory**.`,
  {def:"Kvantifikátory", tex:R`\forall x \in M:\ V(x)\quad\text{„pre každé } x \text{ z } M \text{ platí } V(x)\text{“}\\[4pt] \exists x \in M:\ V(x)\quad\text{„existuje } x \text{ z } M\text{, pre ktoré platí } V(x)\text{“}`},
  R`Na dôkaz výroku „každý“ treba ukázať, že platí pre všetky prvky, na vyvrátenie stačí **jeden protipríklad**. Pri „existuje“ je to naopak: stačí jeden príklad, na vyvrátenie treba overiť všetky.`,
  {ex:R`Urči pravdivosť: a) $\forall x \in \mathbb{R}:\ x^2 \geq 0$. b) $\forall x \in \mathbb{N}:\ x^2 > x$. c) $\exists x \in \mathbb{Z}:\ x^2 = 2$. d) $\exists x \in \mathbb{R}:\ x^2 = 2$.`,
   steps:[
     ["a) Druhá mocnina nie je nikdy záporná.", R`1`],
     [R`b) Protipríklad $x = 1$: $1 > 1$ neplatí.`, R`0`],
     [R`c) $\sqrt{2}$ nie je celé číslo.`, R`0`],
     [R`d) $x = \sqrt{2}$.`, R`1`]
   ],
   res:"Pravdivé sú a) a d). Rozdiel medzi c) a d) robí len množina, z ktorej $x$ berieme."},
  R`„Každý A je B“ sa dá znázorniť Vennovým diagramom: žiadny prvok $A$ nesmie byť mimo $B$. Časť $A - B$ je prázdna.`,
  {tool:"mnoziny", kind:"uloha", ask:R`$A$ sú žiaci triedy, $B$ tí, čo majú mobil. Výrok „Každý žiak triedy má mobil.“ Vyfarbi časť, ktorá musí byť **prázdna**.`,
   hint:"Žiak triedy, ktorý nemá mobil.",
   goal:ok, cfg:{klikaj:true, skry:true, hladaj:"A − B"}},
  {tool:"mnoziny", kind:"uloha", ask:R`Výrok „Existuje žiak triedy, ktorý má mobil.“ Vyfarbi časť, v ktorej musí byť **aspoň jeden** prvok.`,
   hint:"Žiak, ktorý je v triede a zároveň má mobil.",
   goal:ok, cfg:{klikaj:true, skry:true, hladaj:"A ∩ B"}},
  {warn:R`Výrok „každý“ nedokážeš príkladmi, ani tisíc príkladov nestačí. Jediný protipríklad ho ale vyvráti. Naopak „existuje“ dokáže jediný príklad.`}
],

"„Aspoň“, „najviac“, „práve“":[
  R`Kvantifikátory s počtom hovoria, koľko prvkov má danú vlastnosť. Na číselnej osi sú to intervaly počtov: „aspoň 3“ znamená 3, 4, 5, …, „najviac 3“ znamená 0, 1, 2, 3.`,
  {def:"Počty", tex:R`\begin{aligned}\text{aspoň } n &: \quad \geq n\\ \text{najviac } n &: \quad \leq n\\ \text{práve } n &: \quad = n \;\;(\text{aspoň } n \text{ a najviac } n)\end{aligned}`},
  {tool:"os", ask:R`Interval ukazuje „aspoň 3“. Zapni a vypni, či 3 patrí, a prepni smer. Čo potom znamená zápis?`,
   take:R`„aspoň 3“ je $\langle 3;\ \infty)$, trojka patrí. Bez trojky je to „viac než 3“. Smerom doľava je to „najviac 3“.`,
   cfg:{typ:"interval", min:-1, max:8, step:1, a:{v:3}, b:{v:6}, on:{la:true, rinf:true}, toggles:["la", "linf", "rinf"]}},
  {ex:R`V triede je 25 žiakov. Prelož do čísel: a) Aspoň 5 žiakov má jednotku. b) Najviac 2 žiaci chýbajú. c) Práve 1 žiak má päťku.`,
   steps:[
     ["a)", R`\text{počet jednotkárov} \in \{5, 6, \ldots, 25\}`],
     ["b)", R`\text{počet chýbajúcich} \in \{0, 1, 2\}`],
     ["c)", R`\text{počet päťkárov} = 1`]
   ],
   res:"„Aspoň“ zahŕňa uvedené číslo a všetky väčšie, „najviac“ uvedené číslo a všetky menšie."},
  {warn:R`„Aspoň 2“ neznamená „viac ako 2“, dvojka patrí. A „najviac 2“ zahŕňa aj nulu: výrok „najviac 2 žiaci chýbajú“ platí aj vtedy, keď nechýba nikto.`}
],

"Negácia kvantifikovaných výrokov":[
  R`Negáciou „každý“ nie je „nikto“. Ak nie je pravda, že všetci majú mobil, stačí, že aspoň jeden ho nemá. Negácia preto vymení kvantifikátor a neguje tvrdenie za ním.`,
  {def:"Negácia kvantifikátorov", tex:R`\neg\big(\forall x:\ V(x)\big) \equiv \exists x:\ \neg V(x)\\[4pt] \neg\big(\exists x:\ V(x)\big) \equiv \forall x:\ \neg V(x)`},
  {def:"Negácia počtov", tex:R`\begin{aligned}\neg(\text{aspoň } n) &\equiv \text{najviac } n - 1\\ \neg(\text{najviac } n) &\equiv \text{aspoň } n + 1\\ \neg(\text{práve } n) &\equiv \text{najviac } n - 1 \text{ alebo aspoň } n + 1\end{aligned}`},
  {tool:"os", kind:"uloha", ask:R`Výrok: „Aspoň 3 žiaci prišli.“ Nastav interval počtov, ktorý zodpovedá jeho **negácii**.`,
   hint:R`Negácia „aspoň 3“ je „najviac 2“: 0, 1 alebo 2. Interval ide doľava a trojka do neho nepatrí, alebo končí dvojkou vrátane.`,
   goal:P => P.linf && !P.rinf && ((P.b === 3 && !P.lb) || (P.b === 2 && P.lb)),
   cfg:{typ:"interval", min:-1, max:8, step:1, a:{v:3}, b:{v:6}, on:{la:true, rinf:true}, toggles:["la", "lb", "linf", "rinf"]}},
  {ex:R`Zneguj: a) Každý žiak napísal test. b) Niektoré prvočíslo je párne. c) Aspoň dvaja žiaci prišli neskoro. d) Najviac 3 autá stoja na parkovisku.`,
   steps:[
     [R`a) $\forall \to \exists$, tvrdenie neguj.`, R`\text{Aspoň jeden žiak nenapísal test.}`],
     [R`b) $\exists \to \forall$.`, R`\text{Žiadne prvočíslo nie je párne.}`],
     ["c) Aspoň 2 → najviac 1.", R`\text{Najviac jeden žiak prišiel neskoro.}`],
     ["d) Najviac 3 → aspoň 4.", R`\text{Aspoň 4 autá stoja na parkovisku.}`]
   ],
   res:"Pôvodný výrok a jeho negácia majú vždy opačnú pravdivostnú hodnotu: b) je pravdivé (2 je prvočíslo), jeho negácia nie."},
  {ex:R`Zneguj výrok $\forall x \in \mathbb{R}:\ x^2 + 1 > 0$ a urči, ktorý z nich platí.`,
   steps:[
     ["Vymeň kvantifikátor a neguj nerovnosť.", R`\exists x \in \mathbb{R}:\ x^2 + 1 \leq 0`],
     [R`$x^2 + 1 \geq 1$ pre každé $x$.`, R`\text{pôvodný výrok platí}`]
   ],
   res:"Pravdivý je pôvodný výrok, negácia je nepravdivá."},
  {warn:R`Negácia „Všetci žiaci prišli.“ nie je „Všetci žiaci neprišli.“ (to je „nikto neprišiel“), ale „Aspoň jeden žiak neprišiel.“ Negácia „aspoň 3“ nie je „najviac 3“, ale „najviac 2“.`}
]

  }
};
})();

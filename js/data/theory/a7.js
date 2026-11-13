/* Výrok, negácia, spojky, implikácia, ekvivalencia, pravdivostné tabuľky */
(() => {

THEORY.a7 = {
  mins:30,
  brief:[
    R`Výrok je tvrdenie, o ktorom má zmysel povedať, či je pravdivé (1), alebo nepravdivé (0).`,
    R`$A \wedge B$ pravdivá len keď obe. $A \vee B$ nepravdivá len keď ani jedna. $A \Rightarrow B$ nepravdivá len pre $1 \Rightarrow 0$. $A \Leftrightarrow B$ pravdivá, keď majú rovnakú hodnotu.`,
    R`$\neg(A \wedge B) \equiv \neg A \vee \neg B$, $\neg(A \vee B) \equiv \neg A \wedge \neg B$, $\neg(A \Rightarrow B) \equiv A \wedge \neg B$.`,
    R`Tabuľka pre $n$ výrokov má $2^n$ riadkov. Tautológia je pravdivá v každom riadku.`
  ],
  subs:{

"Výrok a jeho pravdivostná hodnota":[
  R`**Výrok** je oznamovacia veta, o ktorej má zmysel povedať, či platí. Pravdivý výrok má pravdivostnú hodnotu 1, nepravdivý 0. Otázka, rozkaz ani prianie výrokom nie sú.`,
  {cards:[
    {t:"Výrok (1)", d:"„Číslo 7 je prvočíslo.“ „Bratislava je hlavné mesto Slovenska.“"},
    {t:"Výrok (0)", d:"„$2 + 2 = 5$.“ „Každé párne číslo je deliteľné 4.“"},
    {t:"Nie je výrok", d:"„Koľko je hodín?“ „Zatvor okno!“ „$x + 2 = 5$“ (kým nevieme, čo je $x$)."}
  ]},
  R`Výrok, ktorý tvrdí opak, je **negácia** $\neg A$ („nie je pravda, že…“). Má vždy opačnú hodnotu ako $A$.`,
  {def:"Negácia", tex:R`\neg A:\quad 1 \to 0,\qquad 0 \to 1`},
  {tool:"vyroky", ask:R`Prepínaj pravdivosť $A$. Akú hodnotu má $\neg A$ a $\neg\neg A$?`,
   take:R`negácia hodnotu vždy otočí. Dvojitá negácia vráti pôvodnú hodnotu: $\neg\neg A$ má rovnakú hodnotu ako $A$.`,
   cfg:{vyraz:"¬A; ¬¬A"}},
  {ex:R`Ktoré z viet sú výroky? a) $15$ je deliteľné tromi. b) Je dnes pondelok? c) $x^2 \geq 0$ pre každé reálne $x$. d) $x > 3$.`,
   steps:[
     ["a) Tvrdenie, dá sa overiť.", R`\text{výrok, hodnota } 1`],
     ["b) Otázka.", R`\text{nie je výrok}`],
     ["c) Tvrdenie o všetkých $x$.", R`\text{výrok, hodnota } 1`],
     ["d) Závisí od $x$, je to len výroková forma.", R`\text{nie je výrok}`]
   ],
   res:"Výroky sú a) a c)."},
  {warn:R`„$x > 3$“ samo osebe nie je výrok, kým nie je jasné, čo je $x$. Výrokom sa stane po dosadení ($5 > 3$) alebo s kvantifikátorom („pre každé $x$…“, pozri [[a8]]).`}
],

"Logické spojky (a, alebo, ak–tak, práve vtedy)":[
  R`Z jednoduchých výrokov sa spojkami skladajú zložené. Ich pravdivosť závisí len od pravdivosti častí, nie od obsahu.`,
  {def:"Spojky", tex:R`\begin{aligned}A \wedge B &\quad \text{„A a B“ (konjunkcia)}\\ A \vee B &\quad \text{„A alebo B“ (disjunkcia)}\\ A \Rightarrow B &\quad \text{„ak A, tak B“ (implikácia)}\\ A \Leftrightarrow B &\quad \text{„A práve vtedy, keď B“ (ekvivalencia)}\end{aligned}`},
  {tool:"vyroky", ask:R`Prepínaj $A$ a $B$ a porovnaj všetky štyri spojky v jednej tabuľke. Ktorá je pravdivá najčastejšie?`,
   take:R`disjunkcia a implikácia sú nepravdivé len v jednom riadku, konjunkcia je pravdivá len v jednom. Ekvivalencia je pravdivá, keď majú $A$ a $B$ rovnakú hodnotu.`,
   cfg:{vyraz:"A ∧ B; A ∨ B; A ⇒ B; A ⇔ B", kroky:false}},
  R`Najťažšie je pochopiť implikáciu. Je to sľub: „Ak bude pršať, vezmem si dáždnik.“ Sľub je porušený jedine vtedy, keď prší a dáždnik nemám. Keď neprší, sľub porušený nie je, nech robím čokoľvek.`,
  {tool:"vyroky", kind:"uloha", ask:R`Nastav $A$ a $B$ tak, aby bola implikácia $A \Rightarrow B$ nepravdivá.`,
   hint:"Sľub je porušený, keď podmienka nastala a sľúbené sa nestalo.",
   goal:P => P.a && !P.b,
   cfg:{vyraz:"A ⇒ B"}},
  {ex:R`Urči pravdivosť: a) 2 je prvočíslo a 9 je prvočíslo. b) 6 je párne alebo deliteľné 5. c) Ak $2 > 3$, tak $1 = 0$. d) $4 > 1$ práve vtedy, keď $1 > 4$.`,
   steps:[
     ["a) Druhá časť je nepravdivá.", R`1 \wedge 0 = 0`],
     ["b) Stačí jedna pravdivá časť.", R`1 \vee 0 = 1`],
     ["c) Predpoklad je nepravdivý.", R`0 \Rightarrow 0 = 1`],
     ["d) Rôzne hodnoty.", R`1 \Leftrightarrow 0 = 0`]
   ],
   res:"Pravdivé sú b) a c)."},
  {warn:R`„Alebo“ v matematike nie je vylučovacie: $A \vee B$ platí aj vtedy, keď platia obe. A implikácia s nepravdivým predpokladom je vždy pravdivá, aj keď znie nezmyselne.`}
],

"Negácia zložených výrokov":[
  R`Negovať zložený výrok neznamená len dať „nie“ pred každú časť. Spojka sa pri negácii mení: z „a“ sa stane „alebo“ a naopak. Tieto pravidlá sa volajú **de Morganove**.`,
  {def:"Negácie zložených výrokov", tex:R`\begin{aligned}\neg(A \wedge B) &\equiv \neg A \vee \neg B\\ \neg(A \vee B) &\equiv \neg A \wedge \neg B\\ \neg(A \Rightarrow B) &\equiv A \wedge \neg B\\ \neg(A \Leftrightarrow B) &\equiv (A \wedge \neg B) \vee (\neg A \wedge B)\end{aligned}`},
  {tool:"vyroky", ask:R`Porovnaj stĺpce $\neg(A \wedge B)$ a $\neg A \vee \neg B$. Majú v každom riadku rovnakú hodnotu?`,
   take:R`áno, výroky sú ekvivalentné. Kto tvrdí, že neplatí „A a B“, tvrdí, že neplatí aspoň jedno z nich.`,
   cfg:{vyraz:"¬(A ∧ B); ¬A ∨ ¬B"}},
  {tool:"vyroky", ask:R`A teraz negácia implikácie. Porovnaj $\neg(A \Rightarrow B)$ s $A \wedge \neg B$.`,
   take:R`zhodujú sa. Negácia implikácie nie je implikácia, ale konjunkcia: „A nastalo a B nie“.`,
   cfg:{vyraz:"¬(A ⇒ B); A ∧ ¬B"}},
  {ex:R`Zneguj: a) Peter má psa alebo mačku. b) Ak bude pekne, pôjdeme na výlet. c) Číslo je párne a deliteľné tromi.`,
   steps:[
     [R`a) $\neg(A \vee B) = \neg A \wedge \neg B$.`, R`\text{Peter nemá psa a nemá mačku.}`],
     [R`b) $\neg(A \Rightarrow B) = A \wedge \neg B$.`, R`\text{Bude pekne a nepôjdeme na výlet.}`],
     [R`c) $\neg(A \wedge B) = \neg A \vee \neg B$.`, R`\text{Číslo nie je párne alebo nie je deliteľné tromi.}`]
   ],
   res:"Pri a) a c) sa zmenila spojka, pri b) z implikácie vznikla konjunkcia."},
  {tool:"vyroky", kind:"uloha", ask:R`Nastav $A$ a $B$ tak, aby bol výrok $\neg(A \vee B)$ pravdivý.`,
   hint:R`$\neg(A \vee B) \equiv \neg A \wedge \neg B$: neplatí ani jedno.`,
   goal:P => !P.a && !P.b,
   cfg:{vyraz:"¬(A ∨ B)"}},
  {warn:R`Negácia vety „Ak bude pekne, pôjdeme na výlet“ nie je „Ak nebude pekne, nepôjdeme na výlet“. Tá veta môže platiť súčasne s pôvodnou. Správne: „Bude pekne a nepôjdeme na výlet.“`}
],

"Pravdivostné tabuľky":[
  R`Pravdivostná tabuľka ukáže hodnotu zloženého výroku pre všetky možné hodnoty jeho častí. Pri dvoch výrokoch sú 4 kombinácie, pri troch 8, pri $n$ výrokoch $2^n$. Zložitý výrok sa počíta po stĺpcoch, od vnútorných zátvoriek.`,
  {steps:[
    {t:"Riadky", d:R`Vypíš všetky kombinácie $0$ a $1$: pri dvoch výrokoch 11, 10, 01, 00.`},
    {t:"Pomocné stĺpce", d:"Pre každú časť výroku jeden stĺpec, od najvnútornejšej."},
    {t:"Výsledok", d:"Posledný stĺpec je hodnota celého výroku."}
  ]},
  {tool:"vyroky", ask:R`Výrok s tromi časťami $(A \wedge B) \Rightarrow C$. Koľko riadkov má tabuľka a v koľkých je výrok nepravdivý?`,
   take:R`8 riadkov a nepravdivý je len v jednom: keď $A$ aj $B$ platia a $C$ nie.`,
   cfg:{vyraz:"(A ∧ B) ⇒ C"}},
  {def:"Tautológia a ekvivalentné výroky", tex:R`\text{tautológia: v každom riadku } 1,\qquad V_1 \equiv V_2:\ \text{rovnaké stĺpce}`},
  {tool:"vyroky", ask:R`Výrok $(A \Rightarrow B) \vee (B \Rightarrow A)$. Je v niektorom riadku nepravdivý?`,
   take:R`nie, je to tautológia. Aspoň jedna z dvoch implikácií platí vždy.`,
   cfg:{vyraz:"(A ⇒ B) ∨ (B ⇒ A)"}},
  {ex:R`Dokáž tabuľkou, že $A \Rightarrow B$ a $\neg A \vee B$ sú ekvivalentné.`,
   steps:[
     ["Riadok 1 1.", R`1 \Rightarrow 1 = 1,\quad 0 \vee 1 = 1`],
     ["Riadok 1 0.", R`1 \Rightarrow 0 = 0,\quad 0 \vee 0 = 0`],
     ["Riadok 0 1.", R`0 \Rightarrow 1 = 1,\quad 1 \vee 1 = 1`],
     ["Riadok 0 0.", R`0 \Rightarrow 0 = 1,\quad 1 \vee 0 = 1`]
   ],
   res:R`Stĺpce sa zhodujú v každom riadku, teda $A \Rightarrow B \equiv \neg A \vee B$.`},
  {tool:"vyroky", kind:"uloha", ask:R`Nastav $A$, $B$, $C$ tak, aby bol výrok $(A \vee B) \Rightarrow C$ nepravdivý a $B$ bol nepravdivý.`,
   hint:R`Implikácia je nepravdivá pre $1 \Rightarrow 0$. Ľavá strana musí platiť bez pomoci $B$.`,
   goal:P => P.a && !P.b && !P.c,
   cfg:{vyraz:"(A ∨ B) ⇒ C"}},
  {warn:R`Pri troch výrokoch nezabudni na žiaden riadok, je ich 8. Vypisuj ich systematicky: $A$ mení hodnotu každé 4 riadky, $B$ každé 2, $C$ v každom.`}
]

  }
};
})();

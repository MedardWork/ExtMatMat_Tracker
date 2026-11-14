/* Množiny, číselné obory, intervaly, Vennove diagramy */
/* TOOL-TODO: subtopic without any tool: "Číselné obory N, Z, Q, R". Rework when the tool exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});
const ok = (P, st) => st.ok;

THEORY.a6 = {
  mins:35,
  brief:[
    R`$A \cup B$: aspoň v jednej. $A \cap B$: v oboch. $A - B$: v $A$, ale nie v $B$. $A'$: všetko, čo nie je v $A$.`,
    R`$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$. Iracionálne čísla ($\sqrt{2}$, $\pi$) sú reálne, ale nie racionálne.`,
    R`Lomená zátvorka $\langle\ \rangle$: koniec patrí do intervalu. Okrúhla $(\ )$: nepatrí. Pri $\pm\infty$ vždy okrúhla.`,
    R`$|A \cup B| = |A| + |B| - |A \cap B|$. Vennov diagram vypĺňaj od prieniku smerom von.`
  ],
  subs:{

"Operácie s množinami (∪, ∩, rozdiel, doplnok)":[
  R`**Množina** je súbor prvkov, každý prvok v nej je najviac raz. $x \in A$ znamená, že $x$ je prvkom $A$. Celok, z ktorého prvky berieme, sa volá **základná množina** $U$. Z dvoch množín sa dajú vytvoriť nové.`,
  {def:"Operácie", tex:R`\begin{aligned}A \cup B &= \{x;\ x \in A \vee x \in B\} & &\text{zjednotenie}\\ A \cap B &= \{x;\ x \in A \wedge x \in B\} & &\text{prienik}\\ A - B &= \{x;\ x \in A \wedge x \notin B\} & &\text{rozdiel}\\ A' &= U - A & &\text{doplnok}\end{aligned}`},
  {tool:"mnoziny", kind:"uloha", ask:R`Kliknutím vyfarbi rozdiel $A - B$.`,
   hint:R`Časť $A$, ktorá nie je zároveň v $B$: „mesiačik“ vľavo.`,
   goal:ok, cfg:{klikaj:true, hladaj:"A − B"}},
  {tool:"mnoziny", kind:"uloha", ask:R`Vyfarbi doplnok zjednotenia $(A \cup B)'$.`,
   hint:R`Najprv si predstav $A \cup B$, potom vyfarbi všetko ostatné v obdĺžniku.`,
   goal:ok, cfg:{klikaj:true, hladaj:"(A ∪ B)'"}},
  {ex:R`$U = \{1, 2, \ldots, 9\}$, $A = \{1, 2, 3, 4, 5\}$, $B = \{4, 5, 6, 7\}$. Urči $A \cup B$, $A \cap B$, $A - B$, $B - A$ a $A'$.`,
   steps:[
     ["Zjednotenie: všetky prvky, každý raz.", R`A \cup B = \{1, 2, 3, 4, 5, 6, 7\}`],
     ["Prienik: spoločné prvky.", R`A \cap B = \{4, 5\}`],
     ["Rozdiely: odober spoločné prvky.", R`A - B = \{1, 2, 3\},\quad B - A = \{6, 7\}`],
     ["Doplnok do $U$.", R`A' = \{6, 7, 8, 9\}`]
   ],
   res:R`$A - B$ a $B - A$ sú rôzne množiny.`},
  R`Pri doplnku zjednotenia alebo prieniku pomáhajú **de Morganove pravidlá**: doplnok zmení $\cup$ na $\cap$ a naopak.`,
  {def:"De Morganove pravidlá", tex:R`(A \cup B)' = A' \cap B',\qquad (A \cap B)' = A' \cup B'`},
  {tool:"mnoziny", kind:"uloha", ask:R`Tri množiny: vyfarbi $(A \cup B) \cap C'$, teda prvky z $A$ alebo $B$, ktoré nie sú v $C$.`,
   hint:R`Z $A \cup B$ odstráň všetko, čo zasahuje do $C$.`,
   goal:ok, cfg:{n:3, klikaj:true, hladaj:"(A ∪ B) ∩ C'"}},
  {warn:R`Rozdiel nie je súmerný: $A - B \neq B - A$. A doplnok $(A \cup B)'$ nie je $A' \cup B'$, správne je $A' \cap B'$.`}
],

"Číselné obory N, Z, Q, R":[
  R`Čísla tvoria obory, každý ďalší obsahuje predchádzajúci. **Prirodzené** čísla slúžia na počítanie, **celé** pridajú nulu a záporné čísla, **racionálne** zlomky a **reálne** všetky body číselnej osi.`,
  {def:"Číselné obory", tex:R`\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}`, legend:[
    ["ℕ", "a", "prirodzené", R`$1, 2, 3, \ldots$ (na Slovensku zvyčajne bez nuly)`],
    ["ℤ", "b", "celé", R`$\ldots, -2, -1, 0, 1, 2, \ldots$`],
    ["ℚ", "c", "racionálne", R`zlomky $\frac{p}{q}$, $p \in \mathbb{Z}$, $q \in \mathbb{N}$; ukončené alebo periodické desatinné čísla`],
    ["ℝ", "d", "reálne", R`racionálne aj iracionálne: $\sqrt{2}$, $\pi$, $e$`]
  ]},
  {cards:[
    {t:"Racionálne", tex:R`\tfrac{3}{4} = 0{,}75,\quad \tfrac{1}{3} = 0{,}\overline{3}`, d:"Desatinný rozvoj sa skončí alebo sa opakuje."},
    {t:"Iracionálne", tex:R`\sqrt{2} = 1{,}41421\ldots,\quad \pi = 3{,}14159\ldots`, d:"Desatinný rozvoj je nekonečný a neopakuje sa."}
  ]},
  {ex:R`Do ktorých oborov patria čísla $-3$, $0$, $\frac{2}{3}$, $\sqrt{4}$, $\sqrt{5}$, $\pi$, $-1{,}5$?`,
   steps:[
     [R`$\sqrt{4} = 2$ je prirodzené.`, R`\sqrt{4} \in \mathbb{N}`],
     [R`$-3$ a $0$ sú celé, nie prirodzené.`, R`-3,\ 0 \in \mathbb{Z}`],
     [R`$\frac{2}{3}$ a $-1{,}5 = -\frac{3}{2}$ sú zlomky.`, R`\tfrac{2}{3},\ -1{,}5 \in \mathbb{Q}`],
     [R`$\sqrt{5}$ a $\pi$ sú iracionálne.`, R`\sqrt{5},\ \pi \in \mathbb{R} - \mathbb{Q}`]
   ],
   res:"Každé číslo patrí aj do všetkých väčších oborov: $2 \\in \\mathbb{N}$, teda aj do $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{R}$."},
  {ex:R`Zapíš periodické čísla $0{,}\overline{3}$ a $0{,}\overline{27}$ ako zlomky.`,
   steps:[
     [R`$x = 0{,}333\ldots$, $10x = 3{,}333\ldots$, odčítaj.`, R`9x = 3 \;\Rightarrow\; x = \tfrac{1}{3}`],
     [R`Perióda má dve číslice, násob 100.`, R`100x - x = 27 \;\Rightarrow\; x = \tfrac{27}{99} = \tfrac{3}{11}`]
   ],
   res:R`$\dfrac{1}{3}$ a $\dfrac{3}{11}$.`},
  {warn:R`$\sqrt{4}$ nie je iracionálne, je to 2. Iracionálna je len odmocnina, ktorá nevyjde presne. A $0{,}\overline{3}$ je racionálne, hoci má nekonečný rozvoj, lebo sa opakuje.`}
],

"Intervaly a ich zápis":[
  R`**Interval** je množina všetkých reálnych čísel medzi dvoma hranicami. Na rozdiel od $\{1, 2, 3\}$ obsahuje nekonečne veľa čísel, aj všetky desatinné. Zátvorka hovorí, či hranica patrí dnu.`,
  R`| zápis | nerovnice | názov |
|---|---|---|
| $\langle a;\ b \rangle$ | $a \leq x \leq b$ | uzavretý |
| $(a;\ b)$ | $a < x < b$ | otvorený |
| $\langle a;\ b)$ | $a \leq x < b$ | zľava uzavretý |
| $(a;\ \infty)$ | $x > a$ | neohraničený |
| $(-\infty;\ b \rangle$ | $x \leq b$ | neohraničený |`,
  {tool:"os", ask:R`Ťahaj konce intervalu a zapínaj, či do neho patria. Ako sa mení zápis?`,
   take:R`patriaci koniec je plný krúžok a lomená zátvorka, nepatriaci prázdny krúžok a okrúhla zátvorka.`,
   cfg:{typ:"interval", a:{v:-2}, b:{v:3}, toggles:["la", "lb", "linf", "rinf"]}},
  R`Intervaly sú množiny, takže s nimi robíš rovnaké operácie. Najľahšie je nakresliť oba nad číselnú os a čítať, kde sa prekrývajú.`,
  {tool:"os", ask:R`Posúvaj konce $A$ a $B$. Kedy je prienik prázdny?`,
   take:R`keď sa intervaly neprekrývajú. Zjednotenie potom nie je jeden interval, ale dva.`,
   cfg:{typ:"dva", A:"[)", B:"(]", a:{v:-2}, b:{v:3}, c:{v:1}, d:{v:5}, on:{prienik:true, zjednotenie:true}, toggles:["rozdiel", "doplnok"]}},
  {ex:R`Urči $A \cap B$, $A \cup B$ a $A - B$ pre $A = \langle -2;\ 3)$, $B = (1;\ 5 \rangle$.`,
   steps:[
     [R`Prekrývajú sa od 1 po 3. Číslo 1 nepatrí do $B$, 3 nepatrí do $A$.`, R`A \cap B = (1;\ 3)`],
     ["Zjednotenie od najmenšej po najväčšiu hranicu.", R`A \cup B = \langle -2;\ 5 \rangle`],
     [R`Z $A$ odober $B$. Číslo 1 v $B$ nie je, ostáva v rozdiele.`, R`A - B = \langle -2;\ 1 \rangle`]
   ],
   res:R`$(1;\ 3)$, $\langle -2;\ 5 \rangle$, $\langle -2;\ 1 \rangle$.`},
  {tool:"os", kind:"uloha", ask:R`$A = \langle -3;\ 2 \rangle$. Nastav ľavý koniec $B$ tak, aby $A \cap B = \langle 1;\ 2 \rangle$.`,
   hint:R`Prienik začína tam, kde začína $B$. Koniec $B$ je v uzavretej zátvorke.`,
   goal:P => P.c === 1,
   cfg:{typ:"dva", A:"[]", B:"[]", a:L(-3), b:L(2), c:{v:-1}, d:L(5), on:{prienik:true}}},
  {warn:R`Pri $\infty$ a $-\infty$ je zátvorka vždy okrúhla, nekonečno nie je číslo a do intervalu „nepatrí“. $\langle 2;\ \infty \rangle$ je chybný zápis.`}
],

"Vennove diagramy v slovných úlohách":[
  R`V úlohách typu „koľko žiakov hrá futbal aj hokej“ ide o počty prvkov množín. Počet prvkov $A$ sa značí $|A|$. Pri zjednotení sa spoločné prvky nesmú započítať dvakrát.`,
  {def:"Počet prvkov zjednotenia", tex:R`|A \cup B| = |\va{A}| + |\vb{B}| - |\vd{A \cap B}|`},
  {tool:"mnoziny", ask:R`Meň počty a sleduj čísla v jednotlivých častiach diagramu. Prečo sa prienik odčíta?`,
   take:R`žiaci v prieniku sú započítaní v $|A|$ aj v $|B|$, takže by sa rátali dvakrát. Mimo oboch množín zostane $|U| - |A \cup B|$.`,
   cfg:{typ:"pocty", a:{v:18}, b:{v:15}, ab:{v:7}, u:L(30)}},
  {ex:R`V triede je 30 žiakov. Angličtinu sa učí 18, nemčinu 15, oba jazyky 7. Koľko žiakov sa učí len angličtinu, len nemčinu a koľko ani jeden?`,
   steps:[
     ["Začni prienikom, potom zvyšky.", R`\text{len A} = 18 - 7 = 11,\quad \text{len N} = 15 - 7 = 8`],
     ["Aspoň jeden jazyk.", R`11 + 7 + 8 = 26 = 18 + 15 - 7`],
     ["Ani jeden.", R`30 - 26 = 4`]
   ],
   res:"Len angličtinu 11, len nemčinu 8, žiadny jazyk 4 žiaci."},
  {tool:"mnoziny", kind:"uloha", ask:R`V triede je 30 žiakov, 18 chodí na futbal, 15 na hokej a 4 nechodia nikam. Nastav, koľko chodí na oba športy.`,
   hint:R`Aspoň jeden šport má $30 - 4 = 26$ žiakov. Potom $18 + 15 - x = 26$.`,
   goal:P => P.ab === 7,
   cfg:{typ:"pocty", a:L(18), b:L(15), ab:{v:3}, u:L(30)}},
  {tool:"mnoziny", ask:R`Pri troch množinách sa vypĺňa rovnako: najprv stred, potom dvojice, potom zvyšky. Meň prienik všetkých troch.`,
   take:R`každá zmena v strede posunie aj časti okolo, lebo čísla dvojíc a celých množín sú dané.`,
   cfg:{typ:"pocty", n:3, abc:{v:3}, a:L(20), b:L(18), c:L(15), ab:L(8), ac:L(7), bc:L(6), u:L(40)}},
  {ex:R`Zo 40 žiakov hrá 20 volejbal, 18 basketbal, 15 florbal. Volejbal aj basketbal hrá 8, volejbal aj florbal 7, basketbal aj florbal 6, všetky tri 3. Koľko žiakov nehrá nič?`,
   steps:[
     ["Vzorec pre tri množiny: pripočítaj, odčítaj dvojice, pripočítaj trojicu.", R`|A \cup B \cup C| = 20 + 18 + 15 - 8 - 7 - 6 + 3 = 35`],
     ["Zvyšok.", R`40 - 35 = 5`]
   ],
   res:"Nič nehrá 5 žiakov."},
  {warn:R`„18 sa učí angličtinu“ zahŕňa aj tých, čo sa učia oba jazyky. Do časti „len angličtina“ preto nepíš 18, ale $18 - 7$. Diagram vypĺňaj vždy od prieniku.`}
]

  }
};
})();

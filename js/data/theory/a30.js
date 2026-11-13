/* Euklidove vety */
(() => {
const L = v => ({v, lock:true});
const near = (a, b) => Math.abs(a - b) < 1e-9;

THEORY.a30 = {
  mins:20,
  brief:[
    R`Výška na preponu rozdelí preponu na úseky $c_a$ (pri odvesne $a$) a $c_b$ (pri $b$).`,
    R`Veta o výške: $v^2 = c_a \cdot c_b$.`,
    R`Veta o odvesne: $a^2 = c \cdot c_a$, $b^2 = c \cdot c_b$.`
  ],
  subs:{

"Euklidova veta o výške":[
  R`Výška $v$ z vrcholu pravého uhla dopadne na preponu a rozdelí ju na dva **úseky**: $c_a$ priľahlý k odvesne $a$ a $c_b$ priľahlý k $b$. Vzniknú dva menšie pravouhlé trojuholníky podobné pôvodnému ([[a32]]). Z ich podobnosti plynie vzťah pre výšku.`,
  {def:"Euklidova veta o výške", tex:R`v^2 = \va{c_a} \cdot \vb{c_b}`, legend:[
    ["cₐ", "a", "úsek prepony", "medzi pätou výšky a vrcholom pri odvesne $a$"],
    ["c_b", "b", "úsek prepony", "medzi pätou výšky a druhým vrcholom"]
  ]},
  {tool:"pytagoras", ask:R`Meň úsek $\va{c_a}$ pri pevnej prepone. Kedy je výška najväčšia? Kde leží vrchol pravého uhla?`,
   take:R`vrchol leží vždy na Tálesovej kružnici nad preponou ([[a31]]). Výška je najväčšia pre $c_a = c_b$, vtedy sa rovná polomeru.`,
   cfg:{typ:"euklid", c:L(10), on:{kruznica:true}}},
  {ex:R`Úseky prepony sú $c_a = 4$ cm a $c_b = 9$ cm. Vypočítaj výšku a obsah trojuholníka.`,
   steps:[
     ["Veta o výške.", R`v = \sqrt{4 \cdot 9} = 6`],
     ["Prepona a obsah.", R`c = 13,\quad S = \frac{c \cdot v}{2} = \frac{13 \cdot 6}{2} = 39`]
   ],
   res:R`$v = 6$ cm, $S = 39$ cm².`},
  {ex:R`Výška na preponu je 12, úsek $c_a = 9$. Vypočítaj druhý úsek a preponu.`,
   steps:[
     ["Z vety o výške.", R`144 = 9 \cdot c_b \;\Rightarrow\; c_b = 16`],
     ["Prepona.", R`c = 9 + 16 = 25`]
   ],
   res:R`$c_b = 16$, $c = 25$.`},
  {tool:"pytagoras", kind:"uloha", ask:R`Prepona má dĺžku 10. Nastav úsek $\va{c_a}$ tak, aby mala výška dĺžku 4.`,
   hint:R`$c_a \cdot (10 - c_a) = 16$.`,
   goal:P => near(P.ca, 2) || near(P.ca, 8),
   cfg:{typ:"euklid", c:L(10), ca:{v:5}, on:{kruznica:true}}},
  {warn:R`Veta hovorí o **druhej mocnine** výšky: $v^2 = c_a c_b$, nie $v = c_a c_b$. A platí len pre výšku na preponu v pravouhlom trojuholníku.`}
],

"Euklidova veta o odvesne":[
  R`Každá odvesna je stranou jedného z menších trojuholníkov a zároveň pôvodného. Z podobnosti vyjde: štvorec nad odvesnou má rovnaký obsah ako obdĺžnik z prepony a priľahlého úseku. Sčítaním oboch viet dostaneš Pytagorovu vetu.`,
  {def:"Euklidova veta o odvesne", tex:R`a^2 = \vd{c} \cdot \va{c_a},\qquad b^2 = \vd{c} \cdot \vb{c_b}`, note:R`Sčítaním: $a^2 + b^2 = c(c_a + c_b) = c^2$.`},
  {tool:"pytagoras", ask:R`Štvorec nad preponou je výškou rozdelený na dva obdĺžniky. Porovnaj ich obsahy so štvorcami nad odvesnami.`,
   take:R`obdĺžnik $c \cdot c_a$ má rovnaký obsah ako štvorec $a^2$ a obdĺžnik $c \cdot c_b$ ako $b^2$.`,
   cfg:{typ:"euklid", on:{obsahy:true}}},
  {ex:R`Prepona má 10 cm, úsek $c_a = 3{,}6$ cm. Vypočítaj odvesny.`,
   steps:[
     ["Odvesna $a$.", R`a = \sqrt{10 \cdot 3{,}6} = \sqrt{36} = 6`],
     ["Druhý úsek a odvesna $b$.", R`c_b = 6{,}4,\quad b = \sqrt{10 \cdot 6{,}4} = 8`]
   ],
   res:R`$a = 6$ cm, $b = 8$ cm.`},
  {ex:R`Odvesna $a = 15$, prepona $c = 25$. Vypočítaj úseky a výšku.`,
   steps:[
     ["Veta o odvesne.", R`225 = 25 \cdot c_a \;\Rightarrow\; c_a = 9`],
     ["Druhý úsek.", R`c_b = 25 - 9 = 16`],
     ["Veta o výške.", R`v = \sqrt{9 \cdot 16} = 12`]
   ],
   res:R`$c_a = 9$, $c_b = 16$, $v = 12$.`},
  {tool:"pytagoras", kind:"uloha", ask:R`Prepona má dĺžku 10. Nastav úsek $\va{c_a}$ tak, aby mala odvesna $a$ dĺžku 8.`,
   hint:R`$64 = 10 \cdot c_a$.`,
   goal:P => near(P.ca, 6.4),
   cfg:{typ:"euklid", c:L(10), ca:{v:3.6}, on:{obsahy:true}}},
  {warn:R`K odvesne $a$ patrí úsek $c_a$, ktorý k nej **prilieha** (má s ňou spoločný vrchol). Pri zámene úsekov vyjde dĺžka druhej odvesny.`}
]

  }
};
})();

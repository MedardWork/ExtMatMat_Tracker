/* Pytagorova veta */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);

THEORY.a29 = {
  mins:30,
  brief:[
    R`V pravouhlom trojuholníku s preponou $c$: $c^2 = a^2 + b^2$.`,
    R`Odvesna: $a = \sqrt{c^2 - b^2}$. Prepona je vždy najdlhšia strana.`,
    R`Obrátená veta: ak $a^2 + b^2 = c^2$, trojuholník je pravouhlý. Pri $<$ tupouhlý, pri $>$ ostrouhlý (pre najdlhšiu stranu $c$).`,
    R`Uhlopriečka štvorca $a\sqrt{2}$, výška rovnostranného trojuholníka $\frac{a\sqrt{3}}{2}$, telesová uhlopriečka kvádra $\sqrt{a^2 + b^2 + c^2}$.`
  ],
  subs:{

"Výpočet strany pravouhlého trojuholníka":[
  R`V pravouhlom trojuholníku sa strana oproti pravému uhlu volá **prepona** $c$, ostatné dve **odvesny** $a$, $b$. Obsah štvorca nad preponou sa rovná súčtu obsahov štvorcov nad odvesnami.`,
  {def:"Pytagorova veta", tex:R`\vd{c}^2 = \va{a}^2 + \vb{b}^2`, legend:[
    ["c", "d", "prepona", "oproti pravému uhlu, najdlhšia strana"],
    ["a, b", "a", "odvesny", "zvierajú pravý uhol"]
  ]},
  {tool:"pytagoras", ask:R`Meň odvesny $\va{a}$ a $\vb{b}$. Sedí vždy súčet obsahov malých štvorcov s veľkým?`,
   take:R`áno, $a^2 + b^2 = c^2$ pre každý pravouhlý trojuholník. Pri $3$, $4$ je $9 + 16 = 25$, prepona 5.`,
   cfg:{typ:"veta", on:{stvorce:true}}},
  {ex:R`Vypočítaj preponu pri odvesnách 6 a 8 a odvesnu pri prepone 13 a odvesne 5.`,
   steps:[
     ["Prepona.", R`c = \sqrt{36 + 64} = \sqrt{100} = 10`],
     ["Odvesna: od štvorca prepony odčítaj.", R`a = \sqrt{169 - 25} = \sqrt{144} = 12`]
   ],
   res:"$10$ a $12$."},
  {ex:R`Rebrík dlhý 5 m je opretý o stenu. Jeho spodný koniec je $1{,}4$ m od steny. Do akej výšky siaha?`,
   steps:[
     ["Rebrík je prepona, vzdialenosť od steny odvesna.", R`h = \sqrt{5^2 - 1{,}4^2}`],
     ["Vypočítaj.", R`h = \sqrt{25 - 1{,}96} = \sqrt{23{,}04} = 4{,}8`]
   ],
   res:R`$4{,}8$ m.`},
  {tool:"pytagoras", kind:"uloha", ask:R`Odvesna $\va{a} = 6$. Nastav druhú odvesnu $\vb{b}$ tak, aby prepona mala dĺžku 10.`,
   hint:R`$b = \sqrt{100 - 36}$.`,
   goal:P => P.b === 8,
   cfg:{typ:"veta", a:L(6), b:{v:3}, on:{stvorce:true}}},
  {warn:R`Pri výpočte odvesny sa odčítava: $a^2 = c^2 - b^2$. A $\sqrt{a^2 + b^2} \neq a + b$: pri 3 a 4 je to 5, nie 7.`}
],

"Obrátená veta — je trojuholník pravouhlý?":[
  R`Pytagorova veta platí aj obrátene: ak strany spĺňajú $a^2 + b^2 = c^2$, je trojuholník pravouhlý s pravým uhlom oproti $c$. Ak sa rovnosť nedosiahne, porovnanie povie, či je najväčší uhol ostrý, alebo tupý.`,
  {def:"Druh trojuholníka podľa strán", tex:R`c \text{ najdlhšia:}\quad a^2 + b^2 \begin{cases} > c^2 & \text{ostrouhlý}\\ = c^2 & \text{pravouhlý}\\ < c^2 & \text{tupouhlý}\end{cases}`},
  {tool:"pytagoras", ask:R`Meň tri strany a sleduj, aký trojuholník vznikne. Kedy nevznikne vôbec?`,
   take:R`porovnanie $a^2 + b^2$ s $c^2$ rozhodne o druhu. Ak je jedna strana dlhšia alebo rovná súčtu ostatných, trojuholník nevznikne (trojuholníková nerovnosť).`,
   cfg:{typ:"druh"}},
  {ex:R`Sú trojuholníky so stranami $7, 24, 25$ a $5, 6, 8$ pravouhlé?`,
   steps:[
     ["Prvý.", R`7^2 + 24^2 = 49 + 576 = 625 = 25^2`],
     ["Druhý.", R`5^2 + 6^2 = 61 < 64 = 8^2`]
   ],
   res:"Prvý je pravouhlý, druhý tupouhlý."},
  R`Trojice celých čísel, ktoré spĺňajú Pytagorovu vetu, sa volajú **pytagorejské**: $3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$ a ich násobky ($6, 8, 10$…).`,
  {tool:"pytagoras", kind:"uloha", ask:R`Strany $a = 5$ a $b = 12$. Nastav $\vd{c}$ tak, aby bol trojuholník pravouhlý.`,
   hint:R`$c^2 = 25 + 144$.`,
   goal:P => P.c === 13,
   cfg:{typ:"druh", a:L(5), b:L(12), c:{v:10, max:16}}},
  {warn:R`Pri overovaní dosaď za $c$ **najdlhšiu** stranu. Pri $5, 13, 12$ treba porovnať $5^2 + 12^2$ s $13^2$, nie $5^2 + 13^2$ s $12^2$.`}
],

"Použitie v útvaroch a v priestore":[
  R`Pravouhlý trojuholník sa skrýva v mnohých útvaroch: uhlopriečka obdĺžnika, výška rovnostranného trojuholníka, vzdialenosť bodov v súradnicovej sústave, uhlopriečka kvádra. Stačí ho nájsť a pomenovať preponu.`,
  {def:"Časté vzorce", tex:R`\text{štvorec: } u = a\sqrt{2},\qquad \text{rovnostranný: } v = \frac{a\sqrt{3}}{2},\qquad \text{kváder: } u = \sqrt{a^2 + b^2 + c^2}`},
  {tool:"graf", ask:R`Ťahaj body $A$ a $B$. Vzdialenosť je prepona pravouhlého trojuholníka s odvesnami $\Delta x$ a $\Delta y$.`,
   take:R`$|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$. Je to Pytagorova veta v súradniciach ([[b19]]).`,
   cfg:{view:[-1, 10, 10, -1], tick:1, fns:[],
     points:{A:[1, 1, {color:"a"}], B:[7, 9, {color:"b"}]},
     show:[{seg:[["Ax", "Ay"], ["Bx", "By"]], color:"d"}, {seg:[["Ax", "Ay"], ["Bx", "Ay"]], color:"soft", dash:2}, {seg:[["Bx", "Ay"], ["Bx", "By"]], color:"soft", dash:2}],
     out:(P, h) => { const dx = P.Bx - P.Ax, dy = P.By - P.Ay, d = Math.hypot(dx, dy);
       return h.calc(R`|AB| = \sqrt{${dx}^2 + ${dy}^2} = \sqrt{${dx * dx + dy * dy}} ${Number.isInteger(d) ? "=" : "\\doteq"} ${t2(h, d)}`); }}},
  {ex:R`Vypočítaj uhlopriečku obdĺžnika $5 \times 12$ a výšku rovnostranného trojuholníka so stranou 6.`,
   steps:[
     ["Uhlopriečka je prepona.", R`u = \sqrt{25 + 144} = 13`],
     ["Výška rozdelí trojuholník na dva pravouhlé, odvesna je polovica strany.", R`v = \sqrt{6^2 - 3^2} = \sqrt{27} = 3\sqrt{3} \doteq 5{,}2`]
   ],
   res:R`$13$ a $3\sqrt{3}$.`},
  {ex:R`Vypočítaj telesovú uhlopriečku kvádra s rozmermi $3 \times 4 \times 12$.`,
   steps:[
     ["Najprv stenová uhlopriečka podstavy.", R`u_1 = \sqrt{9 + 16} = 5`],
     ["Potom pravouhlý trojuholník s výškou.", R`u = \sqrt{5^2 + 12^2} = 13`]
   ],
   res:R`$13$, čo je aj $\sqrt{9 + 16 + 144}$.`},
  {ex:R`Aká je vzdialenosť bodov $A\,[1;\ 2]$ a $B\,[7;\ 10]$?`,
   steps:[
     ["Rozdiely súradníc.", R`\Delta x = 6,\quad \Delta y = 8`],
     ["Pytagorova veta.", R`|AB| = \sqrt{36 + 64} = 10`]
   ],
   res:"$10$"},
  {warn:R`Najprv si nakresli obrázok a vyznač pravý uhol. Bez neho sa ľahko stane, že za preponu zoberieš odvesnu. Prepona leží vždy oproti pravému uhlu.`}
]

  }
};
})();

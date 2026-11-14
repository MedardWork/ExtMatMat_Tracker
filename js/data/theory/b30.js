/* Súradnice v priestore, vzdialenosť bodov, stred úsečky */
/* TOOL-TODO: subtopic "Stred úsečky v priestore" has no picture; kocka cannot mark the midpoint of XY. Add the visual when the tool or option exists (see CLAUDE.md). */
(() => {
const cube = st => st.h && st.h.cube;

THEORY.b30 = {
  mins:20,
  brief:[
    R`Bod v priestore má tri súradnice $[x;\ y;\ z]$.`,
    R`$|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$.`,
    R`Stred: $S = \left[\frac{x_A + x_B}{2};\ \frac{y_A + y_B}{2};\ \frac{z_A + z_B}{2}\right]$.`
  ],
  subs:{

"Súradnice v priestore":[
  R`V priestore pribudne k osiam $x$ a $y$ tretia os $z$, kolmá na obe. Bod má tri súradnice. Pri kocke či kvádri je pohodlné dať vrchol $A$ do počiatku a hrany $AB$, $AD$, $AE$ na osi.`,
  {def:"Kocka v súradniciach", tex:R`A = [0;\ 0;\ 0],\quad B = [a;\ 0;\ 0],\quad D = [0;\ a;\ 0],\quad E = [0;\ 0;\ a],\quad G = [a;\ a;\ a]`},
  {tool:"kocka", ask:R`Posúvaj body $X$ a $Y$ po hranách kocky a sleduj ich súradnice.`,
   take:R`bod na hrane má dve súradnice rovnaké ako vrcholy hrany a jednu medzi nimi. Stred hrany má jednu súradnicu $\frac{a}{2}$.`,
   cfg:{typ:"vzdialenost"}},
  {ex:R`Kocka $ABCDEFGH$ má hranu 4 a $A$ v počiatku. Aké súradnice majú $G$, stred hrany $BF$ a stred steny $EFGH$?`,
   steps:[
     ["Protiľahlý vrchol.", R`G = [4;\ 4;\ 4]`],
     [R`$B = [4;\ 0;\ 0]$, $F = [4;\ 0;\ 4]$.`, R`S_{BF} = [4;\ 0;\ 2]`],
     ["Horná stena je vo výške 4.", R`S_{EFGH} = [2;\ 2;\ 4]`]
   ],
   res:R`$[4;\ 4;\ 4]$, $[4;\ 0;\ 2]$, $[2;\ 2;\ 4]$.`},
  {warn:R`Poradie súradníc musí sedieť s osami: ak je $AB$ na osi $x$ a $AD$ na osi $y$, potom $D = [0;\ a;\ 0]$, nie $[a;\ 0;\ 0]$.`}
],

"Vzdialenosť bodov v priestore":[
  R`Vzdialenosť sa počíta Pytagorovou vetou dvakrát: najprv v pôdoryse, potom s výškovým rozdielom. Vzorec je rovnaký ako v rovine, len s tretím členom.`,
  {def:"Vzdialenosť v priestore", tex:R`|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}`},
  {tool:"kocka", ask:R`Telesová uhlopriečka: $X$ v $A$, $Y$ v $G$. Pozri si pravouhlé kroky. Posúvaj body a sleduj vzdialenosť.`,
   take:R`vzdialenosť je odmocnina zo súčtu štvorcov troch rozdielov. Pri telesovej uhlopriečke kocky $a\sqrt{3}$.`,
   cfg:{typ:"vzdialenost", body:[["AE", 0], ["CG", 1]]}},
  {ex:R`Vypočítaj vzdialenosť bodov $A\,[1;\ 2;\ -1]$ a $B\,[3;\ -1;\ 5]$.`,
   steps:[
     ["Rozdiely.", R`(2;\ -3;\ 6)`],
     ["Vzorec.", R`|AB| = \sqrt{4 + 9 + 36} = \sqrt{49} = 7`]
   ],
   res:"$7$"},
  {ex:R`V kocke s hranou 4 vypočítaj vzdialenosť stredu hrany $BF$ od vrcholu $H$.`,
   steps:[
     [R`$S_{BF} = [4;\ 0;\ 2]$, $H = [0;\ 4;\ 4]$.`, R`(-4;\ 4;\ 2)`],
     ["Vzorec.", R`\sqrt{16 + 16 + 4} = 6`]
   ],
   res:"$6$"},
  {tool:"kocka", kind:"uloha", ask:R`Posuň body $X$ a $Y$ po ich hranách tak, aby bola ich vzdialenosť rovná hrane kocky (4).`,
   hint:"Napríklad oba body do rovnakej výšky, alebo jeden do vrcholu a druhý do susedného.",
   goal:(P, st) => !!cube(st) && Math.abs(cube(st).d - 4) < 1e-6,
   cfg:{typ:"vzdialenost", body:[["AE", .5], ["CG", .25]]}},
  {warn:R`V priestore nezabudni na tretí člen. $\sqrt{(\Delta x)^2 + (\Delta y)^2}$ je len vzdialenosť pôdorysov.`}
],

"Stred úsečky v priestore":[
  R`Stred úsečky má za súradnice priemery súradníc koncov, rovnako ako v rovine ([[b19]]), teraz tri.`,
  {def:"Stred úsečky", tex:R`S = \left[\frac{x_A + x_B}{2};\ \frac{y_A + y_B}{2};\ \frac{z_A + z_B}{2}\right]`},
  {ex:R`Nájdi stred úsečky $A\,[1;\ 2;\ -1]$, $B\,[3;\ -1;\ 5]$ a stred telesovej uhlopriečky kocky s hranou 4.`,
   steps:[
     ["Priemery.", R`S = [2;\ 0{,}5;\ 2]`],
     [R`Uhlopriečka $AG$: $[0;\ 0;\ 0]$ a $[4;\ 4;\ 4]$.`, R`S = [2;\ 2;\ 2]`]
   ],
   res:R`$[2;\ 0{,}5;\ 2]$ a stred kocky $[2;\ 2;\ 2]$.`},
  {warn:R`Stred je priemer, nie rozdiel. Pre $A\,[1;\ 2;\ -1]$ a $B\,[3;\ -1;\ 5]$ je $z$-ová súradnica stredu $\frac{-1 + 5}{2} = 2$, nie $3$.`}
]

  }
};
})();

/* Rovnica s neznámou v menovateli */
(() => {
const L = v => ({v, lock:true});

THEORY.a16 = {
  mins:25,
  brief:[
    R`Najprv podmienky: každý menovateľ $\neq 0$.`,
    R`Rovnicu vynásob spoločným menovateľom, vznikne rovnica bez zlomkov (lineárna alebo kvadratická).`,
    R`Na konci over každý koreň voči podmienkam. Koreň, ktorý ich porušuje, nie je riešením.`
  ],
  subs:{

"Podmienky riešiteľnosti":[
  R`Ak je neznáma v menovateli, rovnica nemá zmysel pre hodnoty, pri ktorých je niektorý menovateľ nulový. Tieto hodnoty sa vylúčia skôr, než sa začne čokoľvek upravovať. Sú to tie isté podmienky ako pri lomených výrazoch ([[a12]]).`,
  {def:"Podmienky", tex:R`\frac{A(x)}{B(x)} = \frac{C(x)}{D(x)}:\qquad B(x) \neq 0,\ D(x) \neq 0`},
  {tool:"graf", ask:R`Rovnica $\dfrac{x + 1}{x - 2} = \vd{k}$: priesečník grafu s vodorovnou priamkou. Meň $\vd{k}$. Pre ktoré $k$ riešenie neexistuje?`,
   take:R`pre $k = 1$: graf sa k priamke $y = 1$ len približuje (asymptota). Bod $x = 2$ je vylúčený pre každé $k$.`,
   cfg:{view:[-5, 6, 8, -4], tick:1, fns:[{f:"(x+1)/(x-2)", lhs:"y"}, {f:"k", lhs:"y", color:"d"}],
     params:{k:{v:3, min:-3, max:5, step:.5, color:"d"}},
     show:[{vline:2, color:"soft"}, {pt:["(2k+1)/(k-1)", "k"], color:"c", if:P => P.k !== 1}],
     out:(P, h) => P.k === 1 ? h.pill("k = 1: žiadne riešenie", "down") : h.calc(R`x = \frac{2\vd{k} + 1}{\vd{k} - 1} = ${h.tn(Math.round((2 * P.k + 1) / (P.k - 1) * 1000) / 1000)}`)}},
  {ex:R`Urči podmienky rovnice $\dfrac{x + 1}{x - 2} = \dfrac{3}{x^2 - 4} + \dfrac{1}{x}$.`,
   steps:[
     ["Menovatele rozlož.", R`x - 2,\quad (x - 2)(x + 2),\quad x`],
     ["Každý činiteľ musí byť nenulový.", R`x \neq 2,\ x \neq -2,\ x \neq 0`]
   ],
   res:R`$x \in \mathbb{R} - \{-2;\ 0;\ 2\}$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{k}$ tak, aby mala rovnica $\dfrac{k}{x - 1} = 2$ riešenie $x = 3$.`,
   hint:R`Dosaď $x = 3$: $\frac{k}{2} = 2$.`,
   goal:P => P.k === 4,
   cfg:{view:[-4, 6, 6, -4], tick:1, fns:[{f:"k/(x-1)", lhs:"y"}, {f:"2", lhs:"y", color:"c"}],
     params:{k:{v:1, min:-4, max:6, step:1, color:"a"}},
     show:[{vline:1, color:"soft"}, {pt:["1+k/2", 2], color:"d", if:P => P.k !== 0}]}},
  {warn:R`Podmienky píš hneď na začiatku. Po vynásobení menovateľom už nie je z rovnice vidieť, ktoré čísla boli zakázané.`}
],

"Odstránenie menovateľov":[
  R`Rovnicu vynásobíš **spoločným menovateľom** všetkých zlomkov. Vďaka podmienkam je nenulový, takže je to dovolená úprava. Zlomky zmiznú a ostane obyčajná rovnica.`,
  {steps:[
    {t:"Rozlož menovatele", d:"Nájdi najmenší spoločný menovateľ, ako pri sčítaní zlomkov."},
    {t:"Vynásob", d:"Každý člen rovnice, aj ten bez zlomku."},
    {t:"Vyrieš", d:"Lineárnu alebo kvadratickú rovnicu ([[a14]], [[a15]])."}
  ]},
  {ex:R`Vyrieš $\dfrac{x + 1}{x - 2} = 3$.`,
   steps:[
     [R`Podmienka $x \neq 2$. Vynásob $(x - 2)$.`, R`x + 1 = 3(x - 2)`],
     ["Vyrieš.", R`x + 1 = 3x - 6 \;\Rightarrow\; 7 = 2x \;\Rightarrow\; x = \frac{7}{2}`]
   ],
   res:R`$x = \dfrac{7}{2}$, podmienku spĺňa.`},
  {ex:R`Vyrieš $\dfrac{2}{x} + \dfrac{3}{x + 1} = 2$.`,
   steps:[
     [R`Podmienky $x \neq 0$, $x \neq -1$. Vynásob $x(x + 1)$.`, R`2(x + 1) + 3x = 2x(x + 1)`],
     ["Uprav na nulu.", R`5x + 2 = 2x^2 + 2x \;\Rightarrow\; 2x^2 - 3x - 2 = 0`],
     ["Kvadratická rovnica.", R`D = 25,\quad x = \frac{3 \pm 5}{4}`]
   ],
   res:R`$x \in \left\{-\dfrac{1}{2};\ 2\right\}$, oba spĺňajú podmienky.`},
  {tool:"graf", kind:"obr", ask:R`Rovnica $\dfrac{2}{x} + \dfrac{3}{x + 1} = 2$ v grafe.`,
   take:R`krivka pretína priamku $y = 2$ v bodoch $x = -\frac{1}{2}$ a $x = 2$, to sú korene.`,
   cfg:{view:[-5, 6, 5, -5], tick:1, fns:[{f:"2/x+3/(x+1)", lhs:"y"}, {f:"2", lhs:"y", color:"c"}],
     show:[{pt:[-0.5, 2], color:"d"}, {pt:[2, 2], color:"d"}, {vline:0, color:"soft"}, {vline:-1, color:"soft"}]}},
  {ex:R`Vyrieš $\dfrac{1}{x - 3} - \dfrac{1}{x + 3} = \dfrac{6}{x^2 - 9}$.`,
   steps:[
     [R`Podmienky $x \neq \pm 3$. Spoločný menovateľ $(x - 3)(x + 3)$.`, R`(x + 3) - (x - 3) = 6`],
     ["Uprav.", R`6 = 6`]
   ],
   res:R`Rovnosť platí vždy, riešením je každé $x \in \mathbb{R} - \{-3;\ 3\}$.`},
  {warn:R`Vynásob **každý** člen, aj ten bez zlomku: v $\frac{2}{x} + \frac{3}{x + 1} = 2$ sa aj dvojka na pravej strane násobí $x(x + 1)$.`}
],

"Kontrola koreňov voči podmienkam":[
  R`Po vynásobení menovateľom môže vzniknúť koreň, ktorý pôvodná rovnica nemá: práve ten, pri ktorom bol menovateľ nulový. Preto treba každý koreň porovnať s podmienkami alebo urobiť skúšku.`,
  {tool:"graf", kind:"obr", ask:R`Rovnica $\dfrac{x^2}{x - 2} = \dfrac{4}{x - 2}$ v grafe.`,
   take:R`krivky sa pretnú len pri $x = -2$. Pri $x = 2$ nie je definovaná ani jedna z nich, hoci $x^2 = 4$ by dalo aj $x = 2$.`,
   cfg:{view:[-5, 9, 6, -7], tick:1, fns:[{f:"x^2/(x-2)", lhs:"y"}, {f:"4/(x-2)", lhs:"y", color:"c"}],
     show:[{pt:[-2, -1], color:"d", label:"[−2; −1]", at:"b"}, {vline:2, color:"soft"}]}},
  {ex:R`Vyrieš $\dfrac{x^2}{x - 2} = \dfrac{4}{x - 2}$.`,
   steps:[
     [R`Podmienka $x \neq 2$. Vynásob $(x - 2)$.`, R`x^2 = 4 \;\Rightarrow\; x = \pm 2`],
     [R`$x = 2$ porušuje podmienku.`, R`x = -2`]
   ],
   res:R`Jediné riešenie $x = -2$.`},
  {ex:R`Vyrieš $\dfrac{2x}{x - 1} = \dfrac{2}{x - 1} + 1$.`,
   steps:[
     [R`Podmienka $x \neq 1$. Vynásob $(x - 1)$.`, R`2x = 2 + x - 1`],
     ["Vyrieš.", R`x = 1`],
     ["Porovnaj s podmienkou.", R`x = 1 \text{ je vylúčené}`]
   ],
   res:"Rovnica nemá riešenie."},
  {tool:"graf", kind:"uloha", ask:R`Rovnica $\dfrac{x^2}{x - a} = \dfrac{4}{x - a}$. Nastav $\vd{a}$ tak, aby mala **len jedno** riešenie.`,
   hint:R`Po vynásobení vyjde vždy $x = \pm 2$. Jeden z nich musí byť vylúčený podmienkou $x \neq a$.`,
   goal:P => Math.abs(P.a) === 2,
   cfg:{view:[-5, 9, 6, -7], tick:1, fns:[{f:"x^2/(x-a)", lhs:"y"}, {f:"4/(x-a)", lhs:"y", color:"c"}],
     params:{a:{v:0, min:-4, max:4, step:1, color:"d"}},
     show:[{pt:[-2, "4/(-2-a)"], color:"c", if:P => P.a !== -2}, {pt:[2, "4/(2-a)"], color:"c", if:P => P.a !== 2}, {vline:"a", color:"d"}],
     out:(P, h) => h.p(R`Podmienka $x \neq \vd{${P.a}}$. Korene po vynásobení: $\pm 2$.`) + h.p(`Počet riešení: **${Math.abs(P.a) === 2 ? 1 : 2}**`)}},
  {warn:R`Nevynechaj kontrolu. Koreň, ktorý vyšiel „pekne“, môže byť práve ten zakázaný. Na maturite je to častá pasca: správna odpoveď býva „rovnica nemá riešenie“.`}
]

  }
};
})();

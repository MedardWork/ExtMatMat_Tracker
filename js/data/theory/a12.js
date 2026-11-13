/* Lomené výrazy a ich definičný obor */
(() => {
const L = v => ({v, lock:true});

THEORY.a12 = {
  mins:30,
  brief:[
    R`Lomený výraz má zmysel, keď je menovateľ rôzny od nuly (a výraz pod párnou odmocninou nezáporný). Podmienky píš zo zadania, pred krátením.`,
    R`Krátiť sa dajú len **činitele**: najprv čitateľa aj menovateľa rozlož na súčin.`,
    R`Sčítanie: spoločný menovateľ = najmenší spoločný násobok rozložených menovateľov.`,
    R`Násobenie: čitateľ · čitateľ, menovateľ · menovateľ. Delenie: násob prevrátenou hodnotou, deliteľ nesmie byť nula.`
  ],
  subs:{

"Podmienky — kedy má výraz zmysel":[
  R`**Lomený výraz** je zlomok, v ktorého menovateli je premenná. Nulou sa deliť nedá, preto výraz nemá zmysel pre hodnoty, pri ktorých je menovateľ nulový. Tieto hodnoty sa vylúčia hneď na začiatku ako **podmienky**.`,
  {def:"Podmienky", tex:R`\frac{A}{B}:\ B \neq 0,\qquad \sqrt{A}:\ A \geq 0`},
  {tool:"graf", ask:R`Meň $\vd{a}$ vo výraze $\dfrac{1}{x - a}$. Pre ktoré $x$ graf neexistuje?`,
   take:R`pre $x = a$, kde je menovateľ nula. Graf sa tam roztrhne, má zvislú asymptotu.`,
   cfg:{view:[-6, 5, 6, -5], tick:1, fns:[{f:"1/(x-a)", lhs:"y"}],
     params:{a:{v:2, min:-4, max:4, step:1, color:"d"}},
     show:[{vline:"a", color:"d"}],
     out:(P, h) => h.calc(R`x - \vd{${h.tn(P.a)}} \neq 0 \;\Rightarrow\; x \neq \vd{${h.tn(P.a)}}`)}},
  {ex:R`Urči podmienky: a) $\dfrac{x + 2}{x^2 - 9}$, b) $\dfrac{x - 1}{x(x + 2)}$, c) $\dfrac{x}{x^2 + 1}$, d) $\dfrac{\sqrt{x - 2}}{x - 5}$.`,
   steps:[
     ["a) Menovateľ rozlož.", R`(x - 3)(x + 3) \neq 0 \;\Rightarrow\; x \neq \pm 3`],
     ["b) Súčin je nula, keď je nula niektorý činiteľ.", R`x \neq 0,\ x \neq -2`],
     [R`c) $x^2 + 1 \geq 1$, nikdy nie je nula.`, R`x \in \mathbb{R}`],
     ["d) Odmocnina aj menovateľ.", R`x \geq 2,\ x \neq 5`]
   ],
   res:R`a) $x \neq \pm 3$; b) $x \neq 0, -2$; c) bez podmienok; d) $x \in \langle 2;\ 5) \cup (5;\ \infty)$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{a}$ tak, aby výraz $\dfrac{1}{x^2 - a}$ nemal zmysel pre $x = 3$.`,
   hint:R`Pre $x = 3$ musí byť $9 - a = 0$.`,
   goal:P => P.a === 9,
   cfg:{view:[-6, 4, 6, -4], tick:1, fns:[{f:"1/(x^2-a)", lhs:"y"}],
     params:{a:{v:4, min:-2, max:16, step:1, color:"d"}},
     show:[{vline:3, color:"soft"}],
     out:(P, h) => h.calc(R`x^2 \neq \vd{${P.a}}`) + h.p(P.a > 0 ? R`Výraz nemá zmysel pre $x = \pm ${Number.isInteger(Math.sqrt(P.a)) ? Math.sqrt(P.a) : `\\sqrt{${P.a}}`}$.` : P.a === 0 ? "Výraz nemá zmysel pre $x = 0$." : "Menovateľ nie je nikdy nula.")}},
  {warn:R`Podmienky sa určujú zo **zadania**, nie z výsledku po krátení. Ak sa činiteľ $(x - 3)$ vykráti, $x \neq 3$ platí ďalej.`}
],

"Krátenie lomených výrazov":[
  R`Lomený výraz kráti rovnako ako zlomok: čitateľa aj menovateľa vydelíš tým istým nenulovým **činiteľom**. Preto ich treba najprv rozložiť na súčin ([[a10]]).`,
  {def:"Krátenie", tex:R`\frac{A \cdot C}{B \cdot C} = \frac{A}{B},\qquad C \neq 0`},
  {tool:"graf", kind:"obr", ask:R`Graf výrazu $\dfrac{x^2 - 1}{x - 1}$.`,
   take:R`po krátení je to $x + 1$, priamka. V bode $x = 1$ však výraz nemá zmysel, v grafe je diera.`,
   cfg:{view:[-4, 4, 4, -2], tick:1, fns:[{f:"(x^2-1)/(x-1)", lhs:"y"}],
     show:[{pt:[1, 2], open:true, color:"c", label:"x = 1 chýba", at:"r"}],
     out:(P, h) => h.calc(R`\frac{(x - 1)(x + 1)}{x - 1} = x + 1`) + h.p(R`pre $x \neq 1$`)}},
  {ex:R`Zjednoduš a urči podmienky: a) $\dfrac{x^2 - 4}{x^2 + 2x}$, b) $\dfrac{x^2 - 6x + 9}{x^2 - 9}$, c) $\dfrac{a - b}{b - a}$.`,
   steps:[
     ["a) Rozlož.", R`\frac{(x - 2)(x + 2)}{x(x + 2)} = \frac{x - 2}{x},\quad x \neq 0, -2`],
     ["b) Štvorec a rozdiel štvorcov.", R`\frac{(x - 3)^2}{(x - 3)(x + 3)} = \frac{x - 3}{x + 3},\quad x \neq \pm 3`],
     [R`c) $b - a = -(a - b)$.`, R`\frac{a - b}{-(a - b)} = -1,\quad a \neq b`]
   ],
   res:R`$\dfrac{x - 2}{x}$; $\dfrac{x - 3}{x + 3}$; $-1$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{p}$ tak, aby sa výraz $\dfrac{x^2 + px}{x + 2}$ dal vykrátiť na $x$.`,
   hint:R`Čitateľ musí byť $x(x + 2)$.`,
   goal:P => P.p === 2,
   cfg:{view:[-5, 5, 5, -5], tick:1, fns:[{f:"(x^2+p*x)/(x+2)", lhs:"y"}, {f:"x", color:"axis", dash:true, thin:true, ghost:true}],
     params:{p:{v:-1, min:-4, max:4, step:1, color:"a"}},
     show:[{pt:[-2, -2], open:true, color:"c", if:P => P.p === 2}],
     out:(P, h) => h.calc(R`\frac{x(x ${P.p < 0 ? "-" : "+"} \va{${Math.abs(P.p)}})}{x + 2}`) + (P.p === 2 ? h.p(R`Po krátení $x$, pre $x \neq -2$.`) : h.p("Čitateľ a menovateľ nemajú spoločného činiteľa."))}},
  {warn:R`Krátiť sa dajú len činitele, nie sčítance. $\dfrac{x + 2}{x + 5}$ sa nekráti na $\dfrac{2}{5}$ a $\dfrac{x^2 + 1}{x}$ nie je $x + 1$.`}
],

"Sčítanie a odčítanie (spoločný menovateľ)":[
  R`Lomené výrazy sa sčítajú ako zlomky: prevedú sa na spoločný menovateľ. Najmenší spoločný menovateľ nájdeš ako pri číslach: menovatele rozlož a vezmi každý činiteľ toľkokrát, koľkokrát je najviac v jednom z nich.`,
  {def:"Sčítanie", tex:R`\frac{A}{B} + \frac{C}{D} = \frac{A \cdot D + C \cdot B}{B \cdot D}`, note:"Ak majú menovatele spoločného činiteľa, stačí menší spoločný menovateľ."},
  {tool:"graf", kind:"obr", ask:R`Grafy výrazov $\dfrac{1}{x - 1} - \dfrac{1}{x + 1}$ a $\dfrac{2}{x^2 - 1}$.`,
   take:R`splývajú, rozdiel zlomkov sa rovná jednému zlomku. Obe majú rovnaké asymptoty $x = \pm 1$.`,
   cfg:{view:[-4, 4, 4, -4], tick:1, fns:[{f:"1/(x-1)-1/(x+1)", lhs:"y"}, {f:"2/(x^2-1)", color:"c", dash:true}]}},
  {ex:R`Uprav: a) $\dfrac{1}{x - 1} - \dfrac{1}{x + 1}$, b) $\dfrac{2}{x^2 - 4} + \dfrac{1}{x + 2}$.`,
   steps:[
     ["a) Spoločný menovateľ $(x - 1)(x + 1)$.", R`\frac{(x + 1) - (x - 1)}{(x - 1)(x + 1)} = \frac{2}{x^2 - 1},\quad x \neq \pm 1`],
     [R`b) $x^2 - 4 = (x - 2)(x + 2)$ už obsahuje $x + 2$.`, R`\frac{2 + (x - 2)}{(x - 2)(x + 2)} = \frac{x}{x^2 - 4},\quad x \neq \pm 2`]
   ],
   res:R`$\dfrac{2}{x^2 - 1}$ a $\dfrac{x}{x^2 - 4}$.`},
  {ex:R`Uprav $\dfrac{x}{x - 2} + \dfrac{4}{2 - x}$.`,
   steps:[
     [R`$2 - x = -(x - 2)$, mínus presuň pred zlomok.`, R`\frac{x}{x - 2} - \frac{4}{x - 2}`],
     ["Rovnaký menovateľ.", R`\frac{x - 4}{x - 2},\quad x \neq 2`]
   ],
   res:R`$\dfrac{x - 4}{x - 2}$`},
  {warn:R`Zlomky sa nesčítavajú „čitateľ plus čitateľ, menovateľ plus menovateľ“. $\dfrac{1}{x} + \dfrac{1}{y} \neq \dfrac{2}{x + y}$, správne $\dfrac{x + y}{xy}$. Pri odčítaní daj zátvorku okolo celého čitateľa.`}
],

"Násobenie a delenie":[
  R`Násobenie je jednoduchšie než sčítanie: čitatele sa násobia spolu a menovatele spolu. Pred násobením všetko rozlož, aby sa dalo krížom krátiť. Delenie je násobenie prevrátenou hodnotou.`,
  {def:"Násobenie a delenie", tex:R`\frac{A}{B} \cdot \frac{C}{D} = \frac{A \cdot C}{B \cdot D},\qquad \frac{A}{B} : \frac{C}{D} = \frac{A}{B} \cdot \frac{D}{C}`, note:R`Pri delení pribudne podmienka $C \neq 0$, lebo deliteľ $\frac{C}{D}$ nesmie byť nula.`},
  {ex:R`Uprav: a) $\dfrac{x^2 - 9}{x + 1} \cdot \dfrac{x + 1}{x - 3}$, b) $\dfrac{x^2 - 4}{x} : \dfrac{x + 2}{x^2}$.`,
   steps:[
     ["a) Rozlož a vykráť krížom.", R`\frac{(x - 3)(x + 3)}{x + 1} \cdot \frac{x + 1}{x - 3} = x + 3,\quad x \neq -1, 3`],
     ["b) Násob prevrátenou hodnotou.", R`\frac{(x - 2)(x + 2)}{x} \cdot \frac{x^2}{x + 2} = x(x - 2)`],
     [R`Podmienky: menovatele $x \neq 0$ a deliteľ $x + 2 \neq 0$.`, R`x \neq 0,\ x \neq -2`]
   ],
   res:R`$x + 3$; $x(x - 2)$.`},
  {ex:R`Zjednoduš zložený zlomok $\dfrac{1 - \frac{1}{x}}{1 - \frac{1}{x^2}}$.`,
   steps:[
     ["Uprav čitateľa aj menovateľa.", R`\frac{\frac{x - 1}{x}}{\frac{x^2 - 1}{x^2}}`],
     ["Deľ ako zlomky.", R`\frac{x - 1}{x} \cdot \frac{x^2}{(x - 1)(x + 1)} = \frac{x}{x + 1}`],
     ["Podmienky zo zadania.", R`x \neq 0,\ x \neq \pm 1`]
   ],
   res:R`$\dfrac{x}{x + 1}$ pre $x \neq 0, \pm 1$.`},
  {tool:"graf", kind:"obr", ask:R`Graf výrazu $\dfrac{1 - \frac{1}{x}}{1 - \frac{1}{x^2}}$.`,
   take:R`vyzerá ako graf $\dfrac{x}{x + 1}$, ale v bodoch $x = 0$ a $x = 1$ má diery. Podmienky zo zadania sa krátením nestratia.`,
   cfg:{view:[-5, 5, 5, -4], tick:1, fns:[{f:"(1-1/x)/(1-1/x^2)", lhs:"y"}],
     show:[{pt:[0, 0], open:true, color:"c"}, {pt:[1, .5], open:true, color:"c"}, {vline:-1, color:"soft"}]}},
  {warn:R`Pri delení nezabudni na podmienku z čitateľa deliteľa. V $\dfrac{A}{B} : \dfrac{x + 2}{x^2}$ musí byť $x + 2 \neq 0$, hoci $x + 2$ stojí v čitateli.`}
]

  }
};
})();

/* Mocniny, odmocniny, usmerňovanie zlomkov */
/* TOOL-TODO: no tool of its own, written with borrowed tools: powers, roots, rationalising (borrowed graf). Rework when the tool exists (see CLAUDE.md). */
(() => {
const fr = (h, v) => v >= 1 || v <= -1 || v === 0 ? h.tn(Math.round(v * 1000) / 1000) : `\\frac{1}{${h.tn(Math.round(1 / v * 1000) / 1000)}}`;

THEORY.a11 = {
  mins:30,
  brief:[
    R`$a^m \cdot a^n = a^{m + n}$, $\dfrac{a^m}{a^n} = a^{m - n}$, $(a^m)^n = a^{mn}$, $a^0 = 1$, $a^{-n} = \dfrac{1}{a^n}$.`,
    R`$a^{\frac{m}{n}} = \sqrt[n]{a^m}$ pre $a \geq 0$. $\sqrt{a^2} = |a|$.`,
    R`Usmerniť zlomok = odstrániť odmocninu z menovateľa: rozšír ho odmocninou alebo výrazom $\sqrt{b} \mp \sqrt{c}$.`
  ],
  subs:{

"Pravidlá pre mocniny (aj záporný exponent)":[
  R`Mocnina $a^n$ s prirodzeným exponentom je súčin $n$ rovnakých činiteľov $a$. Z toho vyplývajú pravidlá: pri násobení sa činitele sčítajú, pri delení sa krátia.`,
  {def:"Pravidlá pre mocniny", tex:R`\begin{aligned}a^m \cdot a^n &= a^{m + n} & \frac{a^m}{a^n} &= a^{m - n}\\ (a^m)^n &= a^{m \cdot n} & (ab)^n &= a^n b^n\\ a^0 &= 1 & a^{-n} &= \frac{1}{a^n}\end{aligned}`, note:R`Platí pre $a \neq 0$. Záporný exponent znamená prevrátenú hodnotu, nie záporné číslo.`},
  {tool:"graf", ask:R`Na grafe $y = 2^x$ posúvaj bod po celých $\vd{n}$. Akú hodnotu má $2^0$, $2^{-1}$, $2^{-2}$?`,
   take:R`$2^0 = 1$, $2^{-1} = \frac{1}{2}$, $2^{-2} = \frac{1}{4}$. Zníženie exponentu o 1 hodnotu vždy vydelí dvoma, aj pod nulou.`,
   cfg:{view:[-4, 9, 4, -1], tick:1, fns:[{f:"2^x", lhs:"y"}],
     params:{n:{v:-2, min:-3, max:3, step:1, color:"d"}},
     show:[{pt:["n", "2^n"], color:"d", label:"[{n}; {2^n}]", at:"tl"}, {drop:["n", "2^n"], color:"d"}],
     out:(P, h) => h.calc(R`2^{\vd{${P.n}}} = ${fr(h, 2 ** P.n)}`)}},
  {ex:R`Zjednoduš $(2x^3)^2 \cdot x^{-4}$ a $\dfrac{(a^{-2}b^3)^{-1}}{a\,b^{-2}}$.`,
   steps:[
     ["Umocni súčin a exponenty sčítaj.", R`4x^6 \cdot x^{-4} = 4x^2`],
     ["V čitateli vynásob exponenty $-1$.", R`\frac{a^2 b^{-3}}{a\,b^{-2}}`],
     ["Exponenty odčítaj.", R`a^{2 - 1} b^{-3 - (-2)} = a\,b^{-1} = \frac{a}{b}`]
   ],
   res:R`$4x^2$ a $\dfrac{a}{b}$ (pre $a, b, x \neq 0$).`},
  {ex:R`Vypočítaj $2^{-3} + \left(\dfrac{1}{2}\right)^{-2}$ a $3^{20} \cdot 9^{-9}$.`,
   steps:[
     ["Záporný exponent prevráti.", R`\frac{1}{8} + 2^2 = \frac{1}{8} + 4 = \frac{33}{8}`],
     [R`$9 = 3^2$, preveď na rovnaký základ.`, R`3^{20} \cdot 3^{-18} = 3^2 = 9`]
   ],
   res:R`$\dfrac{33}{8}$ a $9$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav základ $\va{a}$ tak, aby graf $y = a^x$ prechádzal bodom $\left[-2;\ \frac{1}{9}\right]$.`,
   hint:R`$a^{-2} = \frac{1}{a^2} = \frac{1}{9}$.`,
   goal:P => P.a === 3,
   cfg:{view:[-4, 9, 4, -1], tick:1, fns:[{f:"a^x", lhs:"y"}],
     params:{a:{v:2, min:.5, max:5, step:.5, color:"a"}},
     show:[{target:[-2, 1 / 9], fn:0, label:"[−2; 1/9]", at:"t"}],
     out:(P, h) => h.calc(R`\va{${h.tn(P.a)}}^{-2} = ${fr(h, P.a ** -2)}`)}},
  {warn:R`$-2^2 = -4$, ale $(-2)^2 = 4$: mocnina sa viaže len na číslo, nie na znamienko pred ním. A $2^{-3}$ nie je záporné, je to $\frac{1}{8}$.`}
],

"Odmocniny a mocniny so zlomkovým exponentom":[
  R`$n$-tá odmocnina z $a$ je číslo, ktorého $n$-tá mocnina je $a$. Druhú odmocninu poznáš: $\sqrt{9} = 3$, lebo $3^2 = 9$. Odmocnina sa dá zapísať aj ako mocnina so zlomkovým exponentom, a potom platia všetky pravidlá pre mocniny.`,
  {def:"Odmocnina a zlomkový exponent", tex:R`\sqrt[n]{a} = b \;\Leftrightarrow\; b^n = a,\qquad a^{\frac{m}{n}} = \sqrt[n]{a^m}`, note:R`Párna odmocnina je definovaná len pre $a \geq 0$ a výsledok je nezáporný.`},
  {tool:"graf", ask:R`Meň $\va{n}$ vo funkcii $y = x^{1/n} = \sqrt[n]{x}$. Akú hodnotu má $\sqrt[n]{8}$ a $\sqrt[n]{16}$?`,
   take:R`$\sqrt[3]{8} = 2$, $\sqrt[4]{16} = 2$. Čím väčšie $n$, tým plochejší graf. Všetky prechádzajú bodmi $[0;\ 0]$ a $[1;\ 1]$.`,
   cfg:{view:[-1, 4.5, 17, -.5], tick:[2, 1], free:true, aspect:"2.5", fns:[{f:"x^(1/n)", lhs:"y", dom:[0, 17]}, {f:"sqrt(x)", color:"axis", dash:true, thin:true, ghost:true, dom:[0, 17]}],
     params:{n:{v:3, min:2, max:5, step:1, color:"a"}},
     show:[{pt:[8, "8^(1/n)"], color:"a", label:"8", at:"t"}, {pt:[16, "16^(1/n)"], color:"a", label:"16", at:"t"}],
     out:(P, h) => h.calc(R`\sqrt[\va{${P.n}}]{8} \doteq ${h.tn(Math.round(8 ** (1 / P.n) * 1000) / 1000)},\quad \sqrt[\va{${P.n}}]{16} \doteq ${h.tn(Math.round(16 ** (1 / P.n) * 1000) / 1000)}`)}},
  {def:"Pravidlá pre odmocniny", tex:R`\sqrt{ab} = \sqrt{a}\,\sqrt{b},\qquad \sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}},\qquad \sqrt{a^2} = |a|`},
  {ex:R`Vypočítaj $8^{\frac{2}{3}}$, $27^{-\frac{1}{3}}$ a $16^{0{,}75}$.`,
   steps:[
     ["Najprv odmocnina, potom mocnina.", R`8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^2 = 2^2 = 4`],
     ["Záporný exponent prevráti.", R`27^{-\frac{1}{3}} = \frac{1}{\sqrt[3]{27}} = \frac{1}{3}`],
     [R`$0{,}75 = \frac{3}{4}$.`, R`16^{\frac{3}{4}} = \left(\sqrt[4]{16}\right)^3 = 2^3 = 8`]
   ],
   res:R`$4$, $\dfrac{1}{3}$, $8$.`},
  {ex:R`Zjednoduš $\sqrt{50} + \sqrt{18} - \sqrt{8}$ a $\sqrt{x} \cdot \sqrt[3]{x}$ pre $x > 0$.`,
   steps:[
     ["Vyber druhé mocniny spod odmocniny.", R`5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2} = 6\sqrt{2}`],
     ["Zlomkové exponenty sčítaj.", R`x^{\frac{1}{2}} \cdot x^{\frac{1}{3}} = x^{\frac{5}{6}} = \sqrt[6]{x^5}`]
   ],
   res:R`$6\sqrt{2}$ a $\sqrt[6]{x^5}$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{n}$ tak, aby graf $y = \sqrt[n]{x}$ prechádzal bodom $[16;\ 2]$.`,
   hint:R`$2^n = 16$.`,
   goal:P => P.n === 4,
   cfg:{view:[-1, 4.5, 17, -.5], tick:[2, 1], free:true, aspect:"2.5", fns:[{f:"x^(1/n)", lhs:"y", dom:[0, 17]}],
     params:{n:{v:2, min:2, max:6, step:1, color:"a"}},
     show:[{target:[16, 2], fn:0, label:"[16; 2]", at:"b"}],
     out:(P, h) => h.calc(R`y = \sqrt[\va{${P.n}}]{x},\qquad \sqrt[\va{${P.n}}]{16} \doteq ${h.tn(Math.round(16 ** (1 / P.n) * 1000) / 1000)}`)}},
  {warn:R`$\sqrt{a + b} \neq \sqrt{a} + \sqrt{b}$: $\sqrt{9 + 16} = 5$, ale $3 + 4 = 7$. A $\sqrt{x^2} = |x|$, nie $x$: $\sqrt{(-3)^2} = 3$.`}
],

"Usmerňovanie zlomkov":[
  R`**Usmerniť** zlomok znamená upraviť ho tak, aby v menovateli nebola odmocnina. Zlomok rozšíriš vhodným výrazom, jeho hodnota sa nezmení, lebo násobíš jednotkou.`,
  {def:"Usmernenie", tex:R`\frac{a}{\sqrt{b}} = \frac{a\sqrt{b}}{b},\qquad \frac{a}{\sqrt{b} + \sqrt{c}} = \frac{a\left(\sqrt{b} - \sqrt{c}\right)}{b - c}`, note:R`Pri súčte alebo rozdiele v menovateli rozšír výrazom s opačným znamienkom. Vznikne rozdiel štvorcov $(\sqrt{b})^2 - (\sqrt{c})^2 = b - c$.`},
  {tool:"graf", kind:"obr", ask:R`Grafy funkcií $y = \dfrac{1}{\sqrt{x + 1} + \sqrt{x}}$ a $y = \sqrt{x + 1} - \sqrt{x}$.`,
   take:R`krivky splývajú, sú to tie isté funkcie. Usmernením sa mení len zápis, nie hodnota.`,
   cfg:{view:[-.5, 1.3, 8, -.2], tick:[1, .5], free:true, aspect:"2.5", fns:[{f:"1/(sqrt(x+1)+sqrt(x))", lhs:"y", dom:[0, 8]}, {f:"sqrt(x+1)-sqrt(x)", color:"c", dash:true, dom:[0, 8]}]}},
  {ex:R`Usmerni $\dfrac{6}{\sqrt{3}}$ a $\dfrac{1}{\sqrt[3]{2}}$.`,
   steps:[
     [R`Rozšír $\sqrt{3}$.`, R`\frac{6\sqrt{3}}{3} = 2\sqrt{3}`],
     [R`Pri tretej odmocnine treba v menovateli $\sqrt[3]{2^3}$, rozšír $\sqrt[3]{4}$.`, R`\frac{\sqrt[3]{4}}{\sqrt[3]{8}} = \frac{\sqrt[3]{4}}{2}`]
   ],
   res:R`$2\sqrt{3}$ a $\dfrac{\sqrt[3]{4}}{2}$.`},
  {ex:R`Usmerni $\dfrac{1}{\sqrt{5} - 2}$ a $\dfrac{4}{\sqrt{7} + \sqrt{3}}$.`,
   steps:[
     [R`Rozšír $\sqrt{5} + 2$.`, R`\frac{\sqrt{5} + 2}{5 - 4} = \sqrt{5} + 2`],
     [R`Rozšír $\sqrt{7} - \sqrt{3}$.`, R`\frac{4\left(\sqrt{7} - \sqrt{3}\right)}{7 - 3} = \sqrt{7} - \sqrt{3}`]
   ],
   res:R`$\sqrt{5} + 2$ a $\sqrt{7} - \sqrt{3}$.`},
  {warn:R`Rozšíriť treba čitateľa aj menovateľa. Ak vynásobíš len menovateľ, zmeníš hodnotu zlomku. A pri $\sqrt{5} - 2$ nerozširuj $\sqrt{5}$, nepomôže to, menovateľ by bol $5 - 2\sqrt{5}$.`}
]

  }
};
})();

/* Iracionálne rovnice a nerovnice */
(() => {
const L = v => ({v, lock:true});
const V = [-4, 5, 5, -3];

THEORY.a17 = {
  mins:30,
  brief:[
    R`Rovnicu s odmocninou umocni: z $\sqrt{A} = B$ dostaneš $A = B^2$. Pred umocnením osamostatni odmocninu.`,
    R`Umocnenie nie je ekvivalentná úprava, môže pridať **cudzie korene**. Skúška je povinná.`,
    R`Podmienky: výraz pod odmocninou $\geq 0$; pri $\sqrt{A} = B$ aj $B \geq 0$.`,
    R`Nerovnicu rieš s podmienkami a podľa znamienka pravej strany; graficky: kde je krivka nad priamkou.`
  ],
  subs:{

"Umocnenie rovnice":[
  R`**Iracionálna rovnica** má neznámu pod odmocninou. Odmocnina sa odstráni umocnením oboch strán. Najprv ju však osamostatni na jednej strane, inak sa pri umocnení objaví znova.`,
  {def:"Umocnenie", tex:R`\sqrt{A} = B \;\Rightarrow\; A = B^2`, note:"Šípka vedie len jedným smerom. Preto je potrebná skúška."},
  {tool:"graf", ask:R`Rovnica $\sqrt{x + 3} = x + \vb{q}$: priesečník krivky s priamkou. Meň $\vb{q}$. Koľko riešení môže mať?`,
   take:R`najviac dve, ale pre väčšinu $q$ len jedno. Krivka $\sqrt{x + 3}$ začína v bode $[-3;\ 0]$ a ďalej rastie čoraz pomalšie.`,
   cfg:{view:V, tick:1, fns:[{f:"sqrt(x+3)", lhs:"y"}, {f:"x+q", lhs:"y", color:"c"}],
     params:{q:{v:1, min:-2, max:4, step:.5, color:"b"}},
     show:[{pt:[-3, 0], color:"soft"}]}},
  {ex:R`Vyrieš $\sqrt{2x - 1} = 3$.`,
   steps:[
     ["Odmocnina je osamote, umocni.", R`2x - 1 = 9`],
     ["Vyrieš.", R`x = 5`],
     ["Skúška.", R`\sqrt{10 - 1} = 3`]
   ],
   res:R`$x = 5$`},
  {ex:R`Vyrieš $\sqrt{x + 3} = x + 1$.`,
   steps:[
     ["Umocni.", R`x + 3 = x^2 + 2x + 1`],
     ["Kvadratická rovnica.", R`x^2 + x - 2 = 0 \;\Rightarrow\; x = 1 \vee x = -2`],
     [R`Skúška: $x = 1$: $\sqrt{4} = 2 = 1 + 1$. $x = -2$: $\sqrt{1} = 1$, ale $-2 + 1 = -1$.`, R`x = -2 \text{ nevyhovuje}`]
   ],
   res:R`$x = 1$`},
  {ex:R`Vyrieš $\sqrt{x + 5} = \sqrt{2x - 1}$.`,
   steps:[
     ["Umocni obe strany.", R`x + 5 = 2x - 1 \;\Rightarrow\; x = 6`],
     ["Skúška.", R`\sqrt{11} = \sqrt{11}`]
   ],
   res:R`$x = 6$`},
  {warn:R`$(x + 1)^2 = x^2 + 2x + 1$, nie $x^2 + 1$. A pred umocnením osamostatni odmocninu: $\sqrt{x} + 2 = x$ najprv uprav na $\sqrt{x} = x - 2$.`}
],

"Skúška a cudzie korene":[
  R`Umocnenie spojí dve rôzne rovnice do jednej: $\sqrt{A} = B$ aj $\sqrt{A} = -B$ dajú po umocnení to isté $A = B^2$. Korene druhej z nich sú pre pôvodnú rovnicu **cudzie**. Preto sa skúška robí vždy.`,
  {tool:"graf", kind:"obr", ask:R`Rovnica $\sqrt{x + 3} = x + 1$. Čiarkovane je aj „zrkadlová“ krivka $-\sqrt{x + 3}$.`,
   take:R`priamka pretína hornú vetvu pri $x = 1$ (skutočný koreň) a dolnú pri $x = -2$. Ten druhý je koreň rovnice $-\sqrt{x + 3} = x + 1$, umocnenie ich nerozlíši.`,
   cfg:{view:V, tick:1, fns:[{f:"sqrt(x+3)", lhs:"y"}, {f:"-sqrt(x+3)", color:"axis", dash:true, thin:true, ghost:true}, {f:"x+1", lhs:"y", color:"c"}],
     show:[{pt:[1, 2], color:"ok", label:"x = 1", at:"tl"}, {pt:[-2, -1], color:"d", label:"x = −2 cudzí", at:"r"}]}},
  {ex:R`Vyrieš $x - \sqrt{x - 1} = 3$.`,
   steps:[
     ["Osamostatni odmocninu.", R`\sqrt{x - 1} = x - 3`],
     ["Umocni.", R`x - 1 = x^2 - 6x + 9 \;\Rightarrow\; x^2 - 7x + 10 = 0`],
     ["Korene.", R`x = 2 \vee x = 5`],
     [R`Skúška: $2 - 1 = 1 \neq 3$; $5 - 2 = 3$.`, R`x = 2 \text{ je cudzí}`]
   ],
   res:R`$x = 5$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{q}$ tak, aby mala rovnica $\sqrt{x + 3} = x + q$ riešenie $x = 1$.`,
   hint:R`Pre $x = 1$ je ľavá strana $\sqrt{4} = 2$.`,
   goal:P => P.q === 1,
   cfg:{view:V, tick:1, fns:[{f:"sqrt(x+3)", lhs:"y"}, {f:"x+q", lhs:"y", color:"c"}],
     params:{q:{v:-1, min:-2, max:4, step:.5, color:"b"}},
     show:[{target:[1, 2], fn:1, label:"[1; 2]", at:"tl"}]}},
  {warn:R`Skúška sa robí dosadením do **pôvodnej** rovnice. Dosadenie do rovnice po umocnení cudzí koreň neodhalí, ten ju spĺňa.`}
],

"Podmienky pod odmocninou":[
  R`Párna odmocnina existuje len z nezáporného čísla a jej hodnota je nezáporná. Z toho plynú dve podmienky, ktoré často nahradia skúšku.`,
  {def:"Podmienky", tex:R`\sqrt{A} = B:\qquad A \geq 0,\quad B \geq 0`},
  {tool:"os", ask:R`Pre $\sqrt{x + 3} = x + 1$: podmienka $x + 3 \geq 0$ je množina $A$, podmienka $x + 1 \geq 0$ je $B$. Kde platia obe?`,
   take:R`na prieniku $\langle -1;\ \infty)$. Koreň $-2$ doň nepatrí, takže ho vylúčiš aj bez skúšky.`,
   cfg:{typ:"dva", A:"[+", B:"[+", a:L(-3), b:L(6), c:L(-1), d:L(6), on:{prienik:true}}},
  {ex:R`Vyrieš $\sqrt{x - 4} = \sqrt{2 - x}$.`,
   steps:[
     ["Podmienky.", R`x - 4 \geq 0 \;\wedge\; 2 - x \geq 0 \;\Rightarrow\; x \geq 4 \wedge x \leq 2`],
     ["Prienik je prázdny.", R`\emptyset`]
   ],
   res:"Rovnica nemá riešenie, netreba ani počítať."},
  {ex:R`Vyrieš $\sqrt{x + 7} = x - 5$ s podmienkami.`,
   steps:[
     [R`Podmienky $x \geq -7$ a $x \geq 5$, spolu $x \geq 5$.`, R`x \in \langle 5;\ \infty)`],
     ["Umocni.", R`x + 7 = x^2 - 10x + 25 \;\Rightarrow\; x^2 - 11x + 18 = 0`],
     [R`Korene 2 a 9, podmienku spĺňa len 9.`, R`x = 9:\ \sqrt{16} = 4 = 9 - 5`]
   ],
   res:R`$x = 9$`},
  {warn:R`Podmienka $A \geq 0$ nestačí, cudzie korene ju často spĺňajú. Dôležitejšia je $B \geq 0$: odmocnina nemôže byť záporná. Ak si nie si istý, sprav skúšku.`}
],

"Iracionálne nerovnice":[
  R`Pri nerovnici sa nedá spoľahnúť na skúšku, riešením je interval. Postupuje sa s podmienkami a podľa toho, či je strana bez odmocniny kladná alebo záporná. Graf pomôže skontrolovať výsledok.`,
  {def:"Nerovnica s odmocninou", tex:R`\sqrt{A} < B \;\Leftrightarrow\; A \geq 0 \;\wedge\; B > 0 \;\wedge\; A < B^2`},
  {tool:"graf", ask:R`Nerovnica $\sqrt{x + 3} > x + 1$: kde je krivka nad priamkou? Posúvaj bod $\vd{x_0}$ a porovnaj obe strany.`,
   take:R`krivka je nad priamkou od $-3$ (kde začína) po $1$ (priesečník). Riešenie je $\langle -3;\ 1)$.`,
   cfg:{view:V, tick:1, fns:[{f:"sqrt(x+3)", lhs:"y"}, {f:"x+1", lhs:"y", color:"c"}],
     params:{t:{v:-2, min:-3, max:4, step:.5, color:"d", name:"x₀"}},
     show:[{pt:["t", "sqrt(t+3)"], color:"a"}, {pt:["t", "t+1"], color:"c"}, {seg:[["t", "sqrt(t+3)"], ["t", "t+1"]], color:"d", dash:2}],
     out:(P, h) => { const l = Math.sqrt(P.t + 3), r = P.t + 1;
       return h.calc(R`\sqrt{${h.tn(P.t)} + 3} \doteq ${h.tn(Math.round(l * 100) / 100)},\quad ${h.tn(P.t)} + 1 = ${h.tn(r)}`) + (l > r ? h.pill("nerovnosť platí", "ok") : h.pill("neplatí", "down")); }}},
  {ex:R`Vyrieš $\sqrt{x - 2} < 3$.`,
   steps:[
     ["Podmienka.", R`x \geq 2`],
     ["Obe strany sú nezáporné, smieš umocniť.", R`x - 2 < 9 \;\Rightarrow\; x < 11`]
   ],
   res:R`$x \in \langle 2;\ 11)$`},
  {ex:R`Vyrieš $\sqrt{x + 3} > x + 1$.`,
   steps:[
     [R`Podmienka $x \geq -3$. Ak $x + 1 < 0$, nerovnosť platí vždy (odmocnina je nezáporná).`, R`x \in \langle -3;\ -1)`],
     [R`Ak $x + 1 \geq 0$, umocni.`, R`x + 3 > x^2 + 2x + 1 \;\Rightarrow\; x^2 + x - 2 < 0 \;\Rightarrow\; x \in (-2;\ 1)`],
     [R`S podmienkou $x \geq -1$.`, R`x \in \langle -1;\ 1)`]
   ],
   res:R`Zjednotenie: $x \in \langle -3;\ 1)$`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi riešenie nerovnice $\sqrt{x - 2} < 3$.`,
   hint:R`Podmienka $x \geq 2$ a po umocnení $x < 11$.`,
   goal:P => P.a === 2 && P.la && P.b === 11 && !P.lb && !P.linf && !P.rinf,
   cfg:{typ:"interval", min:-1, max:13, step:1, a:{v:0}, b:{v:6}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`Nerovnicu smieš umocniť len vtedy, keď sú obe strany nezáporné. Pri $\sqrt{x + 3} > x + 1$ by umocnenie bez rozdelenia na prípady stratilo celý interval $\langle -3;\ -1)$.`}
]

  }
};
})();

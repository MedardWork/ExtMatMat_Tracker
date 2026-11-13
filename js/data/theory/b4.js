/* Kvadratické nerovnice, súčinový a podielový tvar */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);

THEORY.b4 = {
  mins:30,
  brief:[
    R`Kvadratická nerovnica: nájdi korene, načrtni parabolu a prečítaj, kde je nad osou ($> 0$) alebo pod ňou ($< 0$).`,
    R`Súčin $(x - x_1)(x - x_2)\cdots$: znamienková tabuľka, na každom intervale medzi nulovými bodmi má súčin stále znamienko.`,
    R`Podiel: rovnako ako súčin, ale nulové body menovateľa do riešenia nikdy nepatria. Menovateľom nenásob.`
  ],
  subs:{

"Kvadratické nerovnice cez parabolu":[
  R`Nerovnica $ax^2 + bx + c > 0$ sa pýta, kde je parabola $y = ax^2 + bx + c$ **nad** osou $x$. Stačí poznať korene a to, či je parabola otvorená hore ($a > 0$), alebo dole ($a < 0$).`,
  {steps:[
    {t:"Korene", d:"Vyrieš rovnicu $ax^2 + bx + c = 0$ ([[a15]])."},
    {t:"Náčrt", d:"Parabola cez korene, otvorená hore pre $a > 0$, dole pre $a < 0$."},
    {t:"Odčítaj", d:"Kde je nad osou ($> 0$), kde pod ňou ($< 0$). Pri $\\geq$, $\\leq$ pridaj korene."}
  ]},
  {tool:"graf", ask:R`Meň koeficienty. Kde je parabola pod osou $x$? Čo sa stane, keď $D < 0$?`,
   take:R`pri $a > 0$ je pod osou medzi koreňmi, pri $a < 0$ mimo nich. Pri $D < 0$ je celá nad osou alebo celá pod ňou: nerovnica platí pre všetky $x$, alebo pre žiadne.`,
   cfg:{view:[-5, 6, 6, -6], tick:1, fns:[{f:"a*x^2+b*x+c", lhs:"y"}],
     params:{a:{v:1, min:-2, max:2, step:1, color:"a"}, b:{v:-1, min:-4, max:4, step:1, color:"b"}, c:{v:-6, min:-6, max:6, step:1, color:"d"}},
     show:[{roots:0, color:"c"}],
     out:(P, h) => { if(!P.a) return h.p("Pre $a = 0$ nie je kvadratická.");
       const D = P.b * P.b - 4 * P.a * P.c;
       if(D <= 0) return h.calc(R`D = ${h.tn(D)}`) + h.p(P.a > 0 ? `Parabola je celá nad osou${D === 0 ? " (dotýka sa jej)" : ""}: $< 0$ nemá riešenie.` : `Parabola je celá pod osou${D === 0 ? " (dotýka sa jej)" : ""}: $> 0$ nemá riešenie.`);
       const r = [(-P.b - Math.sqrt(D)) / 2 / P.a, (-P.b + Math.sqrt(D)) / 2 / P.a].sort((p, q) => p - q);
       return h.calc(R`x_1 ${Number.isInteger(r[0]) ? "=" : "\\doteq"} ${t2(h, r[0])},\ x_2 ${Number.isInteger(r[1]) ? "=" : "\\doteq"} ${t2(h, r[1])}`) + h.p(P.a > 0 ? R`$< 0$ medzi koreňmi: $(${t2(h, r[0])};\ ${t2(h, r[1])})$` : R`$< 0$ mimo koreňov: $(-\infty;\ ${t2(h, r[0])}) \cup (${t2(h, r[1])};\ \infty)$`); }}},
  {ex:R`Vyrieš $x^2 - x - 6 < 0$ a $-x^2 + 4x \geq 0$.`,
   steps:[
     [R`Korene $-2$ a $3$, parabola hore, pod osou medzi nimi.`, R`x \in (-2;\ 3)`],
     [R`$-x(x - 4) \geq 0$: korene $0$ a $4$, parabola dole, nad osou medzi nimi, aj s koreňmi.`, R`x \in \langle 0;\ 4 \rangle`]
   ],
   res:R`$(-2;\ 3)$ a $\langle 0;\ 4 \rangle$.`},
  {ex:R`Vyrieš $x^2 + 2x + 5 > 0$ a $x^2 - 6x + 9 \leq 0$.`,
   steps:[
     [R`$D = 4 - 20 < 0$, parabola hore, celá nad osou.`, R`x \in \mathbb{R}`],
     [R`$(x - 3)^2 \leq 0$: štvorec je nezáporný, nulový len pre $x = 3$.`, R`x = 3`]
   ],
   res:R`$\mathbb{R}$ a $\{3\}$.`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi riešenie nerovnice $x^2 - x - 6 < 0$.`,
   hint:R`Korene $-2$ a $3$, nerovnosť je ostrá.`,
   goal:P => P.a === -2 && !P.la && P.b === 3 && !P.lb && !P.linf && !P.rinf,
   cfg:{typ:"interval", a:{v:0}, b:{v:5}, on:{la:true}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`Nerovnicu $x^2 < 9$ neodmocňuj na $x < 3$, výsledok je $(-3;\ 3)$. A pri $a < 0$ si buď nakresli parabolu dole, alebo nerovnicu najprv vynásob $-1$ a otoč znak.`}
],

"Súčinový tvar a znamienková tabuľka":[
  R`Ak je výraz rozložený na súčin lineárnych činiteľov, jeho znamienko sa dá určiť bez počítania. Každý činiteľ mení znamienko len vo svojom nulovom bode. Nulové body rozdelia os na intervaly, na každom má súčin stále znamienko.`,
  {steps:[
    {t:"Nulové body", d:"Pre každý činiteľ $x - x_i = 0$."},
    {t:"Tabuľka", d:"Do riadkov činitele, do stĺpcov intervaly. Znamienko činiteľa zistíš dosadením jedného čísla."},
    {t:"Súčin", d:"Znamienka v stĺpci vynásob. Vyber intervaly so správnym znamienkom."}
  ]},
  {tool:"os", ask:R`Znamienková tabuľka súčinu $(x - x_1)(x - x_2)(x - x_3)$. Posúvaj nulové body a sleduj, ako sa striedajú znamienka.`,
   take:R`vpravo od všetkých nulových bodov je súčin kladný a v každom nulovom bode mení znamienko. Pri troch činiteľoch sa preto strieda $- + - +$.`,
   cfg:{typ:"znamienka", n:3, x1:{v:-2}, x2:{v:1}, x3:{v:4}, toggles:["kladne", "rovne"]}},
  {ex:R`Vyrieš $(x + 3)(2 - x) > 0$.`,
   steps:[
     [R`Činiteľ $2 - x = -(x - 2)$, vynásob $-1$ a otoč znak.`, R`(x + 3)(x - 2) < 0`],
     ["Nulové body $-3$ a $2$, súčin záporný medzi nimi.", R`x \in (-3;\ 2)`]
   ],
   res:R`$(-3;\ 2)$`},
  {ex:R`Vyrieš $x^3 - 4x \leq 0$.`,
   steps:[
     ["Rozlož.", R`x(x - 2)(x + 2) \leq 0`],
     [R`Nulové body $-2$, $0$, $2$. Znamienka zľava: $-$, $+$, $-$, $+$.`, R`(-\infty;\ -2\rangle \cup \langle 0;\ 2 \rangle`]
   ],
   res:R`$x \in (-\infty;\ -2\rangle \cup \langle 0;\ 2 \rangle$`},
  {tool:"os", kind:"uloha", ask:R`Nastav nulové body $\va{x_1}$ a $\vb{x_2}$ tak, aby mala nerovnica $(x - x_1)(x - x_2) < 0$ riešenie $(-1;\ 3)$.`,
   hint:"Súčin dvoch činiteľov je záporný medzi nulovými bodmi.",
   goal:P => (P.x1 === -1 && P.x2 === 3) || (P.x1 === 3 && P.x2 === -1),
   cfg:{typ:"znamienka", n:2, x1:{v:0}, x2:{v:2}, on:{kladne:false, rovne:false}}},
  {warn:R`Činiteľ typu $(2 - x)$ má opačné znamienko než $(x - 2)$. Buď ho prepíš na $-(x - 2)$ a otoč znak nerovnice, alebo jeho znamienka v tabuľke dosaď poctivo.`}
],

"Podielový tvar":[
  R`Podiel $\dfrac{A}{B}$ má rovnaké znamienko ako súčin $A \cdot B$. Rieši sa teda tou istou tabuľkou. Rozdiel je len v tom, že nulové body menovateľa do riešenia nikdy nepatria, ani pri $\geq$ či $\leq$.`,
  {def:"Podielový tvar", tex:R`\frac{A}{B} > 0 \;\Leftrightarrow\; A \cdot B > 0,\qquad B \neq 0`},
  {tool:"os", ask:R`Znamienka podielu $\dfrac{(x - x_1)(x - x_2)}{x - x_3}$. Zapni rovnosť ($\geq$). Ktoré nulové body sa pridajú do riešenia a ktoré nie?`,
   take:R`pridajú sa len nulové body čitateľa. Nulový bod menovateľa je vždy vylúčený, výraz tam nemá zmysel.`,
   cfg:{typ:"znamienka", n:3, dole:[3], x1:{v:-2}, x2:{v:1}, x3:{v:3}, on:{rovne:true}, toggles:["kladne", "rovne"]}},
  {ex:R`Vyrieš $\dfrac{x - 1}{x + 2} \leq 0$.`,
   steps:[
     [R`Nulové body $1$ (čitateľ) a $-2$ (menovateľ). Podiel záporný medzi nimi.`, R`(-2;\ 1)`],
     [R`Pri $\leq$ pridaj nulový bod čitateľa, $-2$ nie.`, R`(-2;\ 1\rangle`]
   ],
   res:R`$x \in (-2;\ 1\rangle$`},
  {ex:R`Vyrieš $\dfrac{2x + 1}{x - 3} \geq 1$.`,
   steps:[
     [R`Menovateľom nenásob (jeho znamienko nepoznáš). Presuň 1 doľava.`, R`\frac{2x + 1 - (x - 3)}{x - 3} \geq 0`],
     ["Uprav čitateľa.", R`\frac{x + 4}{x - 3} \geq 0`],
     [R`Nulové body $-4$ a $3$, podiel kladný mimo nich, $-4$ patrí, $3$ nie.`, R`(-\infty;\ -4\rangle \cup (3;\ \infty)`]
   ],
   res:R`$x \in (-\infty;\ -4\rangle \cup (3;\ \infty)$`},
  {warn:R`Nerovnicu $\frac{2x + 1}{x - 3} \geq 1$ nenásob $(x - 3)$. Pre $x < 3$ je záporné a znak by sa musel otočiť. Bezpečné je presunúť všetko na jednu stranu a riešiť podiel s nulou.`}
]

  }
};
})();

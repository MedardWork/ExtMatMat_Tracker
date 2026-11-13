/* Prostá, inverzná a zložená funkcia */
(() => {
const count = (h, word) => { const n = h.scan().meets.length; return [n, n === 1 ? "jeden priesečník" : n === 0 ? "žiadny priesečník" : n < 5 ? `${n} priesečníky` : `${n} priesečníkov`]; };

THEORY.a20 = {
  mins:20,
  brief:[
    R`**Prostá** funkcia nenadobúda žiadnu hodnotu dvakrát. Každá vodorovná priamka pretne jej graf najviac raz.`,
    R`**Inverzná** funkcia $f^{-1}$ vracia z $y$ späť $x$. Existuje len k prostej funkcii. Jej graf je súmerný s grafom $f$ podľa priamky $y = x$.`,
    R`Postup: zapíš $y = f(x)$, vymeň $x$ a $y$, vyjadri $y$.`,
    R`**Zložená** funkcia $f(g(x))$: najprv vypočítaj vnútornú $g(x)$, výsledok dosaď do vonkajšej $f$. Na poradí záleží.`
  ],
  subs:{

"Prostá funkcia":[
  R`Funkcia je **prostá**, ak rôznym číslam $x$ priradí vždy rôzne hodnoty. Žiadna hodnota $y$ sa v nej neobjaví dvakrát.`,
  {def:"Prostá funkcia", mid:true, tex:R`x_1 \neq x_2 \;\Rightarrow\; f(x_1) \neq f(x_2)`},
  R`Na grafe sa to overuje vodorovnou priamkou. Ak niektorá vodorovná priamka pretne graf viac než raz, tú istú hodnotu má funkcia pre dve rôzne $x$ a prostá nie je.`,
  {tool:"graf", ask:R`Posúvaj vodorovnú priamku $y = \vb{c}$ cez parabolu. Koľkokrát ju pretne?`,
   take:R`väčšina vodorovných priamok pretne parabolu dvakrát. Funkcia $y = x^2 - 2$ preto nie je prostá.`,
   cfg:{view:[-5, 6, 5, -4], tick:1, fns:[{f:"x^2-2", lhs:"f(x)"}, {f:"c", color:"b", ghost:true}],
     params:{c:{v:2, min:-3.5, max:5, step:.5, color:"b"}},
     show:[{meet:[0, 1], color:"b", at:"t"}],
     out:(P, h) => { const [n, w] = count(h); return h.calc(R`y = \vb{${h.tn(P.c)}}`) + h.pill(w, n > 1 ? "down" : "flat") + (n > 1 ? h.p("Dve rôzne $x$ majú rovnakú hodnotu. Nie je prostá.") : ""); }}},
  {tool:"graf", ask:R`To isté pre funkciu $y = \tfrac{1}{4}x^3$. Nájdeš priamku, ktorá ju pretne dvakrát?`,
   take:R`nenájdeš. Každá vodorovná priamka pretne tento graf práve raz, funkcia je prostá.`,
   cfg:{view:[-5, 5, 5, -5], tick:1, fns:[{f:"x^3/4", lhs:"f(x)"}, {f:"c", color:"b", ghost:true}],
     params:{c:{v:2, min:-4, max:4, step:.5, color:"b"}},
     show:[{meet:[0, 1], color:"b", at:"t"}],
     out:(P, h) => { const [n, w] = count(h); return h.calc(R`y = \vb{${h.tn(P.c)}}`) + h.pill(w, "up") + h.p("Každú hodnotu nadobúda len raz. Je prostá."); }}},
  {tip:"Každá funkcia, ktorá je na celom definičnom obore rastúca alebo klesajúca, je prostá. Väčšie $x$ totiž nikdy nedá rovnakú hodnotu."},
  R`Funkciu, ktorá prostá nie je, môžeš prostou spraviť zúžením definičného oboru.`,
  {tool:"graf", kind:"uloha", ask:R`Funkcia $y = x^2$ je definovaná na $\langle \va{l};\ 3\rangle$. Posuň ľavý koniec tak, aby bola prostá.`,
   hint:"Potrebuješ odrezať tú časť paraboly, ktorá má rovnaké hodnoty ako pravá vetva. Teda všetko naľavo od vrcholu.",
   goal:P => P.l >= 0,
   cfg:{view:[-4, 10, 4, -2], tick:1, fns:[{f:"x^2", dom:["l", 3], lhs:"f(x)"}, {f:"x^2", color:"axis", dash:true, thin:true, ghost:true}],
     params:{l:{v:-2, min:-3, max:2, step:.5, color:"a"}},
     show:[{seg:[["l", 0], [3, 0]], color:"a", w:5}, {pt:["l", "l^2"], color:"a"},
           {seg:[["l", "l^2"], ["-l", "l^2"]], color:"b", dash:true, if:P => P.l < 0}, {pt:["-l", "l^2"], color:"b", if:P => P.l < 0}],
     out:(P, h) => h.p(R`$D(f) = \langle \va{${h.tn(P.l)}};\ 3\rangle$`)
       + (P.l < 0 ? h.p(R`$f(${h.tn(P.l)}) = f(${h.tn(-P.l)}) = ${h.tn(P.l * P.l)}$, dve $x$ s rovnakou hodnotou.`) : h.pill("✓ Na tomto intervale je prostá", "ok"))}},
  {ex:R`Je funkcia $f(x) = x^2$ prostá? A funkcia $g(x) = 3x - 1$?`,
   steps:[
     [R`Pre $f$ stačí nájsť dve rôzne čísla s rovnakou hodnotou.`, R`f(2) = f(-2) = 4`],
     [R`$g$ je lineárna s $k = 3 > 0$, teda rastúca.`, R`\text{rastúca} \;\Rightarrow\; \text{prostá}`]
   ],
   res:R`$f$ prostá nie je, $g$ je.`}
],

"Inverzná funkcia":[
  R`Funkcia $f$ z čísla $x$ vyrobí $y$. **Inverzná funkcia** $f^{-1}$ robí opak: z $y$ vráti pôvodné $x$. Ak $f(2) = 7$, tak $f^{-1}(7) = 2$.`,
  {def:"Inverzná funkcia", mid:true, tex:R`f(\va{a}) = \vb{b} \quad\Longleftrightarrow\quad f^{-1}(\vb{b}) = \va{a}`,
   note:R`Definičný obor a obor hodnôt si vymenia úlohy: $D(f^{-1}) = H(f)$ a $H(f^{-1}) = D(f)$.`},
  R`Inverzná funkcia existuje len k **prostej** funkcii. Keby mali dve rôzne $x$ rovnakú hodnotu, nevedela by, ktoré z nich má vrátiť.`,
  {steps:[
    {t:R`Zapíš $y = f(x)$`, tex:R`y = 2x + 3`},
    {t:R`Vymeň $x$ a $y$`, tex:R`x = 2y + 3`},
    {t:R`Vyjadri $y$`, tex:R`y = \dfrac{x - 3}{2}`}
  ]},
  {tool:"graf", ask:R`Posúvaj bod po grafe $f$ (čierny). Kde leží zodpovedajúci bod na grafe $f^{-1}$ (modrý)?`,
   take:R`bodu $[a;\ b]$ na grafe $f$ zodpovedá bod $[b;\ a]$ na grafe $f^{-1}$. Grafy sú súmerné podľa priamky $y = x$.`,
   cfg:{view:[-7, 7, 7, -7], tick:1,
     fns:[{f:"k*x+q", lhs:"f(x)"}, {f:"(x-q)/k", color:"c", lhs:"f^{-1}(x)"}, {f:"x", color:"axis", dash:true, thin:true, ghost:true}],
     params:{k:{v:2, min:.5, max:3, step:.5, color:"a", lock:true}, q:{v:3, min:-3, max:3, step:.5, color:"b", lock:true}, s:{v:1, min:-4, max:2, step:.5, color:"d", name:"x", note:"bod na grafe f"}},
     show:[{seg:[["s", "k*s+q"], ["k*s+q", "s"]], color:"soft", dash:true},
       {pt:["s", "k*s+q"], color:"ink", label:"[{s}; {k*s+q}]", at:"l"}, {pt:["k*s+q", "s"], color:"c", label:"[{k*s+q}; {s}]", at:"r"}],
     out:(P, h) => h.calc(h.eq(0)) + h.calc(`\\vc{${h.eq(1)}}`)
       + h.calc(R`f(${h.tn(P.s)}) = ${h.tn(P.k * P.s + P.q)}, \quad f^{-1}(${h.tn(P.k * P.s + P.q)}) = ${h.tn(P.s)}`)}},
  {ex:R`Nájdi inverznú funkciu k $f(x) = 2x + 3$ a over ju na jednom čísle.`,
   steps:[
     [R`Zapíš $y = 2x + 3$ a vymeň $x$ a $y$.`, R`x = 2y + 3`],
     [R`Vyjadri $y$.`, R`y = \dfrac{x - 3}{2} \;\Rightarrow\; f^{-1}(x) = \dfrac{x - 3}{2}`],
     [R`Skúška: $f$ a potom $f^{-1}$ musia vrátiť pôvodné číslo.`, R`f(1) = 5,\qquad f^{-1}(5) = \dfrac{5 - 3}{2} = 1 \ \checkmark`]
   ],
   res:R`$f^{-1}(x) = \dfrac{x - 3}{2}$`},
  R`Pri funkcii, ktorá prostá nie je, treba najprv zúžiť definičný obor. Pre $y = x^2$ na $\langle 0;\ \infty)$ je inverznou funkciou odmocnina.`,
  {tool:"graf", ask:R`Posúvaj $x$. Ako spolu súvisia $x^2$ a $\sqrt{x}$?`,
   take:R`odmocnina vráti to, čo druhá mocnina spravila: $\sqrt{x^2} = x$ pre $x \geq 0$.`,
   cfg:{view:[-1.5, 9.5, 9.5, -1.5], tick:1,
     fns:[{f:"x^2", dom:[0, 4], lhs:"f(x)"}, {f:"sqrt(x)", color:"c", lhs:"f^{-1}(x)"}, {f:"x", color:"axis", dash:true, thin:true, ghost:true}],
     params:{s:{v:2, min:0, max:3, step:.25, color:"d", name:"x"}},
     show:[{seg:[["s", "s^2"], ["s^2", "s"]], color:"soft", dash:true}, {pt:["s", "s^2"], color:"ink"}, {pt:["s^2", "s"], color:"c"}],
     out:(P, h) => h.calc(R`${h.tn(P.s)}^2 = ${h.tn(P.s * P.s)}`) + h.calc(R`\vc{\sqrt{${h.tn(P.s * P.s)}} = ${h.tn(P.s)}}`)}},
  {warn:R`$f^{-1}$ neznamená $\dfrac{1}{f}$. Pre $f(x) = 2x$ je $f^{-1}(x) = \dfrac{x}{2}$, kým $\dfrac{1}{f(x)} = \dfrac{1}{2x}$.`},
  {tip:"Rovnakým spôsobom spolu súvisia exponenciálna a logaritmická funkcia. Logaritmus je inverzná funkcia k exponenciálnej, viac v téme [[b13]].", label:"Súvislosť"}
],

"Zložená funkcia":[
  R`Dve funkcie môžeš zapojiť za sebou: výstup jednej sa stane vstupom druhej. Vznikne **zložená funkcia** $f(g(x))$. Číta sa zvnútra: najprv $g$, potom $f$.`,
  {def:"Zložená funkcia", tex:R`x \;\xrightarrow{\ \vb{g}\ }\; \vb{g(x)} \;\xrightarrow{\ \va{f}\ }\; \va{f}(\vb{g(x)})`, mid:true, legend:[
    ["g", "b", "vnútorná funkcia", "Počíta sa ako prvá."],
    ["f", "a", "vonkajšia funkcia", "Dostane výsledok vnútornej."]
  ]},
  {tool:"graf", ask:R`Pre $f(x) = 2x + 3$ a $g(x) = x^2$ posúvaj $x$. Dá $f(g(x))$ to isté ako $g(f(x))$?`,
   take:R`nedá. Pri skladaní funkcií záleží na poradí, grafy $f(g(x))$ a $g(f(x))$ sú dve rôzne paraboly.`,
   cfg:{view:[-5, 14, 4, -2], tick:[1, 2], free:true, aspect:"1",
     fns:[{f:"2x^2+3", lhs:"f(g(x))"}, {f:"(2x+3)^2", color:"c", lhs:"g(f(x))"}],
     params:{s:{v:1, min:-3, max:2, step:.5, color:"d", name:"x"}},
     show:[{pt:["s", "2s^2+3"], color:"ink"}, {pt:["s", "(2s+3)^2"], color:"c"}],
     out:(P, h) => { const s = P.s, n = v => v < 0 ? `(${h.tn(v)})` : h.tn(v);
       return h.calc(R`\vb{g}(${h.tn(s)}) = ${h.tn(s * s)}, \quad \va{f}(${h.tn(s * s)}) = ${h.tn(2 * s * s + 3)}`)
         + h.calc(R`\va{f}(${h.tn(s)}) = ${h.tn(2 * s + 3)}, \quad \vb{g}(${n(2 * s + 3)}) = ${h.tn((2 * s + 3) ** 2)}`)
         + h.p(R`$f(g(x)) = ${h.tn(2 * s * s + 3)}$, ale $\vc{g(f(x)) = ${h.tn((2 * s + 3) ** 2)}}$`); }}},
  {ex:R`Pre $f(x) = 2x + 3$ a $g(x) = x^2$ vypočítaj $f(g(1))$ a $g(f(1))$. Potom napíš predpisy oboch zložených funkcií.`,
   steps:[
     [R`$f(g(1))$: najprv $g$.`, R`g(1) = 1,\qquad f(1) = 2 \cdot 1 + 3 = 5`],
     [R`$g(f(1))$: najprv $f$.`, R`f(1) = 5,\qquad g(5) = 25`],
     [R`Predpis $f(g(x))$: do $f$ dosaď $x^2$ namiesto $x$.`, R`f(g(x)) = 2x^2 + 3`],
     [R`Predpis $g(f(x))$: do $g$ dosaď $2x + 3$ namiesto $x$.`, R`g(f(x)) = (2x + 3)^2 = 4x^2 + 12x + 9`]
   ],
   res:R`$f(g(1)) = 5$, $g(f(1)) = 25$.`},
  {warn:R`$f(g(x))$ nie je súčin $f(x) \cdot g(x)$. Funkcie sa nenásobia, jedna sa dosadí do druhej.`},
  "V úlohách sa často pýtajú opačne: zloženú funkciu treba rozložiť na vnútornú a vonkajšiu. Vnútorná je to, čo by si pri výpočte hodnoty počítal ako prvé.",
  {ex:R`Rozlož funkciu $h(x) = \sqrt{x^2 + 1}$ na vnútornú a vonkajšiu.`,
   steps:[
     [R`Pri výpočte $h(3)$ by si najprv počítal $3^2 + 1$.`, R`\vb{g}(x) = x^2 + 1`],
     ["Z výsledku potom odmocninu.", R`\va{f}(x) = \sqrt{x}`]
   ],
   res:R`$h(x) = f(g(x))$, kde $g(x) = x^2 + 1$ a $f(x) = \sqrt{x}$.`},
  {tip:R`Definičný obor zloženej funkcie: $x$ musí patriť do $D(g)$ a zároveň výsledok $g(x)$ musí patriť do $D(f)$.`}
]

  }
};
})();

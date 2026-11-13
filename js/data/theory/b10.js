/* Goniometrické identity a vzorce pre dvojnásobný uhol */
(() => {
const d3 = (h, x) => h.tn(Math.round(x * 1000) / 1000, 3);
const deg = (h, d) => `${h.tn(d)}^\\circ`;
const DEG = {view:[-30, 2.4, 390, -2.4], tick:[90, 1], free:true, aspect:"2"};

THEORY.b10 = {
  mins:30,
  brief:[
    R`$\sin^2 x + \cos^2 x = 1$ pre každé $x$. Z jednej hodnoty dostaneš druhú, znamienko určí kvadrant.`,
    R`$\tg x = \dfrac{\sin x}{\cos x}$ pre $\cos x \neq 0$, a z toho $1 + \tg^2 x = \dfrac{1}{\cos^2 x}$.`,
    R`$\sin 2x = 2 \sin x \cos x$, $\cos 2x = \cos^2 x - \sin^2 x = 1 - 2\sin^2 x = 2\cos^2 x - 1$.`
  ],
  subs:{

"sin²x + cos²x = 1":[
  R`Bod $[\cos x;\ \sin x]$ leží na kružnici s polomerom 1. Jeho súradnice sú odvesny pravouhlého trojuholníka s preponou 1, takže podľa Pytagorovej vety platí vzťah, ktorý je najdôležitejší v celej goniometrii.`,
  {def:"Základná identita", tex:R`\va{\sin^2 x} + \vb{\cos^2 x} = 1`, note:R`$\sin^2 x$ znamená $(\sin x)^2$. Platí pre každé reálne $x$, nielen pre ostré uhly.`},
  {tool:"kruznica", ask:R`Ťahaj bod kamkoľvek po kružnici. Mení sa súčet štvorcov?`,
   take:R`$\sin \alpha$ aj $\cos \alpha$ sa menia, súčet ich druhých mocnín je vždy 1.`,
   cfg:{uhol:{v:40, step:5}, on:{sin:true, cos:true},
     out:(P, h) => { const s = h.kr.sin, c = h.kr.cos;
       return h.calc(R`\va{\sin ${deg(h, P.uhol)}} \doteq \va{${d3(h, s)}},\quad \vb{\cos ${deg(h, P.uhol)}} \doteq \vb{${d3(h, c)}}`)
         + h.calc(R`\va{${d3(h, s)}}^2 + \vb{${d3(h, c)}}^2 \doteq ${d3(h, s * s)} + ${d3(h, c * c)} \doteq 1`); }}},
  R`Identita sa najčastejšie používa naopak: poznáš jednu hodnotu a hľadáš druhú. Pri odmocnení vzniknú dve možnosti, správne znamienko určí kvadrant.`,
  {def:"Jedna hodnota z druhej", tex:R`\vb{\cos x} = \pm\sqrt{1 - \va{\sin^2 x}},\qquad \va{\sin x} = \pm\sqrt{1 - \vb{\cos^2 x}}`},
  {ex:R`Ak $\sin x = \dfrac{3}{5}$ a $x$ je ostrý uhol, vypočítaj $\cos x$ a $\tg x$.`,
   steps:[
     ["Dosaď do identity.", R`\cos^2 x = 1 - \frac{9}{25} = \frac{16}{25}`],
     [R`Ostrý uhol je v I. kvadrante, kosínus je kladný.`, R`\cos x = \frac{4}{5}`],
     ["Tangens je podiel.", R`\tg x = \frac{3/5}{4/5} = \frac{3}{4}`]
   ],
   res:R`$\cos x = \dfrac{4}{5}$, $\tg x = \dfrac{3}{4}$.`},
  {ex:R`Ak $\cos x = -\dfrac{5}{13}$ a $x \in \left(\pi;\ \dfrac{3\pi}{2}\right)$, vypočítaj $\sin x$ a $\tg x$.`,
   steps:[
     ["Dosaď do identity.", R`\sin^2 x = 1 - \frac{25}{169} = \frac{144}{169}`],
     [R`Interval $\left(\pi;\ \frac{3\pi}{2}\right)$ je III. kvadrant, sínus je záporný.`, R`\sin x = -\frac{12}{13}`],
     ["Dve záporné čísla dajú kladný podiel.", R`\tg x = \frac{-12/13}{-5/13} = \frac{12}{5}`]
   ],
   res:R`$\sin x = -\dfrac{12}{13}$, $\tg x = \dfrac{12}{5}$.`},
  {ex:R`Zjednoduš výraz $(1 - \cos x)(1 + \cos x)$.`,
   steps:[
     [R`Je to vzorec $(a - b)(a + b) = a^2 - b^2$.`, R`(1 - \cos x)(1 + \cos x) = 1 - \cos^2 x`],
     ["Z identity je to sínus na druhú.", R`1 - \cos^2 x = \sin^2 x`]
   ],
   res:R`$\sin^2 x$`},
  {tool:"kruznica", kind:"uloha", ask:R`Uhol $\alpha$ je v II. kvadrante a $\vb{\cos^2 \alpha} = \dfrac{1}{4}$. Nastav ho.`,
   hint:R`$\cos \alpha = \pm\frac{1}{2}$. V II. kvadrante je kosínus záporný, teda $-\frac{1}{2}$.`,
   goal:P => P.uhol === 120,
   cfg:{uhol:{v:30, step:15}, on:{cos:true, znam:true},
     out:(P, h) => h.calc(R`\vb{\cos ${deg(h, P.uhol)}} \doteq \vb{${d3(h, h.kr.cos)}},\quad \vb{\cos^2} \doteq ${d3(h, h.kr.cos ** 2)}`)
       + (P.uhol === 120 ? h.pill("✓ cos 120° = −1/2", "ok") : P.uhol === 60 || P.uhol === 240 || P.uhol === 300 ? h.p("Druhá mocnina sedí, ale uhol nie je v II. kvadrante.") : "")}},
  {warn:R`$\sin^2 x$ je $(\sin x)^2$, nie $\sin(x^2)$. A pri $\cos x = \pm\sqrt{1 - \sin^2 x}$ nevyberaj automaticky plus. Rozhodne kvadrant, v ktorom $x$ leží.`}
],

"tg x = sin x / cos x":[
  R`Tangens sa dá vždy zapísať pomocou sínusu a kosínusu. Na kružnici to vidno z podobných trojuholníkov: malý má odvesny $\cos x$ a $\sin x$, veľký pri dotyčnici má odvesny $1$ a $\tg x$.`,
  {def:"Tangens a kotangens", tex:R`\vc{\tg x} = \frac{\va{\sin x}}{\vb{\cos x}},\qquad \cotg x = \frac{\cos x}{\sin x} = \frac{1}{\tg x}`, note:R`Tangens existuje len pre $\cos x \neq 0$, teda $x \neq \frac{\pi}{2} + k\pi$. Kotangens len pre $\sin x \neq 0$, $x \neq k\pi$.`},
  {tool:"kruznica", ask:R`Ťahaj bod a porovnaj podiel $\va{\sin}$ a $\vb{\cos}$ s dĺžkou úsečky na dotyčnici.`,
   take:R`podiel sa vždy rovná $\tg \alpha$. Keď je $\cos \alpha$ blízko nuly, podiel aj úsečka sú veľmi veľké.`,
   cfg:{uhol:{v:50, step:5}, on:{sin:true, cos:true, tg:true},
     out:(P, h) => { const k = h.kr;
       return isFinite(k.tg) ? h.calc(R`\frac{\va{\sin ${deg(h, P.uhol)}}}{\vb{\cos ${deg(h, P.uhol)}}} \doteq \frac{\va{${d3(h, k.sin)}}}{\vb{${d3(h, k.cos)}}} \doteq \vc{${d3(h, k.tg)}} = \vc{\tg ${deg(h, P.uhol)}}`)
         : h.calc(R`\vb{\cos ${deg(h, P.uhol)}} = 0`) + h.pill("tangens neexistuje", "down"); }}},
  R`Keď identitu $\sin^2 x + \cos^2 x = 1$ vydelíš $\cos^2 x$, dostaneš vzťah medzi tangensom a kosínusom. Hodí sa, keď je zadaný tangens.`,
  {def:"Kosínus z tangensu", tex:R`1 + \vc{\tg^2 x} = \frac{1}{\vb{\cos^2 x}}`},
  {ex:R`Ak $\tg x = 2$ a $x$ je ostrý uhol, vypočítaj $\cos x$ a $\sin x$.`,
   steps:[
     ["Dosaď do vzťahu s tangensom.", R`\frac{1}{\cos^2 x} = 1 + 4 = 5 \;\Rightarrow\; \cos^2 x = \frac{1}{5}`],
     ["Ostrý uhol, kosínus je kladný. Odstráň odmocninu z menovateľa.", R`\cos x = \frac{1}{\sqrt{5}} = \frac{\sqrt{5}}{5}`],
     [R`Zo vzťahu $\sin x = \tg x \cdot \cos x$.`, R`\sin x = 2 \cdot \frac{\sqrt{5}}{5} = \frac{2\sqrt{5}}{5}`]
   ],
   res:R`$\cos x = \dfrac{\sqrt{5}}{5}$, $\sin x = \dfrac{2\sqrt{5}}{5}$. Kontrola: $\frac{1}{5} + \frac{4}{5} = 1$.`},
  {ex:R`Zjednoduš výraz $\dfrac{1 - \cos^2 x}{\sin x \cos x}$ a urči, kedy má zmysel.`,
   steps:[
     [R`Menovateľ nesmie byť nula.`, R`\sin x \neq 0,\ \cos x \neq 0 \;\Rightarrow\; x \neq k\frac{\pi}{2}`],
     [R`Čitateľ je podľa identity $\sin^2 x$.`, R`\frac{\sin^2 x}{\sin x \cos x}`],
     [R`Vykráť jedným $\sin x$.`, R`\frac{\sin x}{\cos x} = \tg x`]
   ],
   res:R`$\tg x$ pre $x \neq k\dfrac{\pi}{2}$, $k \in \mathbb{Z}$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nájdi uhol z $\langle 0^\circ;\ 360^\circ)$, pre ktorý je $\vc{\tg \alpha} = 1$ a $\va{\sin \alpha} < 0$.`,
   hint:R`$\tg \alpha = 1$ znamená $\sin \alpha = \cos \alpha$. Obe záporné sú v III. kvadrante.`,
   goal:P => P.uhol === 225,
   cfg:{uhol:{v:30, step:15}, on:{sin:true, cos:true, tg:true},
     out:(P, h) => h.calc(R`\vc{\tg ${deg(h, P.uhol)}} ${isFinite(h.kr.tg) ? `\\doteq \\vc{${d3(h, h.kr.tg)}}` : "\\text{ neexistuje}"}`)
       + (P.uhol === 225 ? h.pill("✓ tg 225° = 1, sin 225° < 0", "ok") : P.uhol === 45 ? h.p("Tangens sedí, ale sínus je kladný.") : "")}},
  {warn:R`Pri úprave výrazov s $\tg x$ alebo so zlomkami napíš podmienky. Výraz $\dfrac{\sin x}{\cos x}$ pre $x = 90^\circ$ neexistuje, aj keď sa po úprave „stratil“.`}
],

"Vzorce pre dvojnásobný uhol":[
  R`Ako súvisí $\sin 2x$ so $\sin x$? Na prvý pohľad by sa zdalo, že je dvojnásobný, ale nie je: $\sin 90^\circ = 1$, no $\sin 180^\circ = 0$. Správne vzorce obsahujú sínus aj kosínus.`,
  {def:"Dvojnásobný uhol", tex:R`\begin{aligned}\sin 2x &= 2\,\va{\sin x}\,\vb{\cos x}\\ \cos 2x &= \vb{\cos^2 x} - \va{\sin^2 x}\end{aligned}`, note:R`Pomocou $\sin^2 x + \cos^2 x = 1$ sa kosínus dá zapísať aj ako $\cos 2x = 1 - 2\sin^2 x = 2\cos^2 x - 1$.`},
  {tool:"kruznica", ask:R`Posúvaj uhol a porovnaj tri čísla. Ktoré dve sú vždy rovnaké?`,
   take:R`$\sin 2\alpha$ sa vždy rovná $2 \sin \alpha \cos \alpha$. Číslo $2 \sin \alpha$ je iné, môže byť dokonca väčšie než 1.`,
   cfg:{uhol:{v:30, step:5}, on:{sin:true, cos:true},
     out:(P, h) => { const k = h.kr, s2 = Math.sin(2 * k.rad);
       return h.calc(R`\sin ${deg(h, 2 * P.uhol)} \doteq ${d3(h, s2)}`)
         + h.calc(R`2 \cdot \va{${d3(h, k.sin)}} \cdot \vb{${d3(h, k.cos)}} \doteq ${d3(h, 2 * k.sin * k.cos)}`)
         + h.calc(R`2 \cdot \va{${d3(h, k.sin)}} \doteq ${d3(h, 2 * k.sin)}`)
         + h.p(R`Prvé dve sa zhodujú, tretie ${Math.abs(s2 - 2 * k.sin) < 1e-9 ? "tu náhodou tiež" : "nie"}.`); }}},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{a}$ tak, aby graf $y = a \sin x \cos x$ splynul s čiarkovaným grafom $y = \sin 2x$. Os $x$ je v stupňoch.`,
   hint:R`Vzorec pre dvojnásobný uhol.`,
   goal:P => P.a === 2,
   cfg:Object.assign({}, DEG, {fns:[{f:"a*sin(x*pi/180)*cos(x*pi/180)", lhs:"y"}, {f:"sin(2*x*pi/180)", color:"c", dash:true, thin:true}],
     params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}},
     out:(P, h) => h.big(R`y = \va{${h.tn(P.a)}} \sin x \cos x`) + (P.a === 2 ? h.pill("✓ 2 sin x cos x = sin 2x", "ok") : h.p("Čiarkovaná je $y = \\sin 2x$."))})},
  {ex:R`Ak $\sin x = \dfrac{3}{5}$ a $x$ je ostrý uhol, vypočítaj $\sin 2x$ a $\cos 2x$.`,
   steps:[
     [R`Najprv kosínus z identity, ostrý uhol, takže kladný.`, R`\cos x = \sqrt{1 - \tfrac{9}{25}} = \frac{4}{5}`],
     ["Dosaď do vzorca pre sínus.", R`\sin 2x = 2 \cdot \frac{3}{5} \cdot \frac{4}{5} = \frac{24}{25}`],
     ["A pre kosínus.", R`\cos 2x = \frac{16}{25} - \frac{9}{25} = \frac{7}{25}`]
   ],
   res:R`$\sin 2x = \dfrac{24}{25}$, $\cos 2x = \dfrac{7}{25}$.`},
  {ex:R`Vypočítaj bez kalkulačky $\sin 15^\circ \cos 15^\circ$ a $\cos^2 22{,}5^\circ - \sin^2 22{,}5^\circ$.`,
   steps:[
     [R`Chýba dvojka zo vzorca $\sin 2x = 2 \sin x \cos x$, preto polovica.`, R`\sin 15^\circ \cos 15^\circ = \tfrac{1}{2} \sin 30^\circ = \tfrac{1}{2} \cdot \tfrac{1}{2} = \tfrac{1}{4}`],
     [R`Druhý výraz je presne $\cos 2x$ pre $x = 22{,}5^\circ$.`, R`\cos^2 22{,}5^\circ - \sin^2 22{,}5^\circ = \cos 45^\circ = \frac{\sqrt{2}}{2}`]
   ],
   res:R`$\dfrac{1}{4}$ a $\dfrac{\sqrt{2}}{2}$.`},
  {ex:R`Zjednoduš $\dfrac{\sin 2x}{1 + \cos 2x}$.`,
   steps:[
     [R`V menovateli použi $\cos 2x = 2\cos^2 x - 1$, jednotky sa odčítajú.`, R`1 + \cos 2x = 2\cos^2 x`],
     [R`V čitateli $\sin 2x = 2 \sin x \cos x$.`, R`\frac{2 \sin x \cos x}{2 \cos^2 x}`],
     [R`Vykráť $2 \cos x$ (pre $\cos x \neq 0$).`, R`\frac{\sin x}{\cos x} = \tg x`]
   ],
   res:R`$\tg x$ pre $\cos x \neq 0$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nájdi uhol $\alpha \in (0^\circ;\ 90^\circ)$, pre ktorý je $\sin 2\alpha = \va{\sin \alpha}$.`,
   hint:R`$2 \sin \alpha \cos \alpha = \sin \alpha$. Vydeľ $\sin \alpha \neq 0$: $\cos \alpha = \frac{1}{2}$.`,
   goal:P => P.uhol === 60,
   cfg:{uhol:{v:20, min:0, max:90, step:5}, on:{sin:true, cos:true},
     out:(P, h) => h.calc(R`\sin ${deg(h, 2 * P.uhol)} \doteq ${d3(h, Math.sin(2 * h.kr.rad))},\quad \va{\sin ${deg(h, P.uhol)}} \doteq \va{${d3(h, h.kr.sin)}}`)
       + (P.uhol === 60 ? h.pill("✓ sin 120° = sin 60°", "ok") : "")}},
  {warn:R`$\sin 2x \neq 2 \sin x$. Dvojka „vnútri“ sa nedá vytiahnuť von. Skúška: pre $x = 90^\circ$ je $\sin 180^\circ = 0$, ale $2 \sin 90^\circ = 2$.`}
]

  }
};
})();

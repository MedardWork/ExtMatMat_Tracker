/* Goniometrické funkcie sin, cos, tg — hodnoty, grafy, perióda */
(() => {
const d3 = (h, x) => h.tn(Math.round(x * 1000) / 1000, 3);
const deg = (h, d) => `${h.tn(d)}^\\circ`;
/* exact value if there is one, else ≐ decimal */
const val = (h, f, d, v) => { const e = trigExact(d, f); return e != null ? `= ${e}` : isFinite(v) ? `\\doteq ${d3(h, v)}` : "\\text{ neexistuje}"; };
/* graphs in degrees: x axis 0…360 */
const DEG = {view:[-30, 1.7, 390, -1.7], tick:[90, 1], free:true, aspect:"2.2"};
const GH = f => ({f, color:"axis", dash:true, thin:true, ghost:true});

THEORY.b9 = {
  mins:35,
  brief:[
    R`$\sin$: $0,\ \frac{1}{2},\ \frac{\sqrt{2}}{2},\ \frac{\sqrt{3}}{2},\ 1$ pre $0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$. Kosínus má tie isté hodnoty v opačnom poradí.`,
    R`Kladné sú: v I. kvadrante všetky, v II. $\sin$, v III. $\tg$, v IV. $\cos$.`,
    R`$\sin$ a $\cos$ majú obor hodnôt $\langle -1;\ 1 \rangle$ a periódu $2\pi$, $\tg$ má obor hodnôt $\mathbb{R}$ a periódu $\pi$.`,
    R`$y = \sin(\va{b}x)$ má periódu $\dfrac{2\pi}{|b|}$.`
  ],
  subs:{

"Hodnoty pre 0°, 30°, 45°, 60°, 90°":[
  R`Pre päť uhlov sa dajú hodnoty sínusu a kosínusu vypočítať presne. Na maturite sa používajú stále dookola, oplatí sa ich vedieť naspamäť.`,
  R`| $\alpha$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
|---|---|---|---|---|---|
| radiány | $0$ | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ |
| $\sin \alpha$ | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ |
| $\cos \alpha$ | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ |
| $\tg \alpha$ | $0$ | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ | neexistuje |`,
  {def:"Pomôcka na zapamätanie", tex:R`\sin \alpha = \frac{\sqrt{\vd{n}}}{2},\quad \vd{n} = 0,\ 1,\ 2,\ 3,\ 4`, note:R`Pre $0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$ stačí dosadiť $n = 0, 1, 2, 3, 4$. Kosínus ide naopak, od $n = 4$ po $n = 0$.`},
  {tool:"kruznica", ask:R`Prejdi uhly $0^\circ$, $30^\circ$, $45^\circ$, $60^\circ$, $90^\circ$. Ako sa menia $\va{\sin}$ a $\vb{\cos}$?`,
   take:R`sínus rastie od 0 po 1, kosínus klesá od 1 po 0, s rovnakými hodnotami v opačnom poradí. Platí $\cos \alpha = \sin(90^\circ - \alpha)$.`,
   cfg:{uhol:{v:30, min:0, max:90, step:15}, on:{sin:true, cos:true, body:true}}},
  R`Odkiaľ sa hodnoty berú: rovnostranný trojuholník so stranou 1 rozdelí výška na dva pravouhlé s uhlami $30^\circ$ a $60^\circ$. Odvesna oproti $30^\circ$ má dĺžku $\frac{1}{2}$, výška $\frac{\sqrt{3}}{2}$. Pri $45^\circ$ je trojuholník rovnoramenný a obe odvesny sú $\frac{\sqrt{2}}{2}$.`,
  {ex:R`Vypočítaj $\sin 30^\circ + \cos 60^\circ$ a $\tg 60^\circ \cdot \cos 30^\circ$.`,
   steps:[
     ["Dosaď z tabuľky.", R`\sin 30^\circ + \cos 60^\circ = \tfrac{1}{2} + \tfrac{1}{2} = 1`],
     [R`Druhý výraz: $\sqrt{3} \cdot \sqrt{3} = 3$.`, R`\tg 60^\circ \cdot \cos 30^\circ = \sqrt{3} \cdot \frac{\sqrt{3}}{2} = \frac{3}{2}`]
   ],
   res:R`$1$ a $\dfrac{3}{2}$.`},
  {ex:R`Vypočítaj $2 \sin 45^\circ \cos 45^\circ - \tg 45^\circ$.`,
   steps:[
     [R`$\sin 45^\circ = \cos 45^\circ = \frac{\sqrt{2}}{2}$, $\tg 45^\circ = 1$.`, R`2 \cdot \frac{\sqrt{2}}{2} \cdot \frac{\sqrt{2}}{2} - 1`],
     [R`$\sqrt{2} \cdot \sqrt{2} = 2$.`, R`2 \cdot \frac{2}{4} - 1 = 1 - 1 = 0`]
   ],
   res:"$0$"},
  {tool:"kruznica", kind:"uloha", ask:R`Nájdi uhol z $\langle 0^\circ;\ 90^\circ \rangle$, pre ktorý je $\va{\sin \alpha} = \vb{\cos \alpha}$.`,
   hint:R`Úsečky budú rovnako dlhé, keď je bod presne v polovici medzi osami.`,
   goal:P => P.uhol === 45,
   cfg:{uhol:{v:20, min:0, max:90, step:5}, on:{sin:true, cos:true},
     out:(P, h) => h.calc(R`\va{\sin ${deg(h, P.uhol)}} ${val(h, "sin", P.uhol, h.kr.sin)},\quad \vb{\cos ${deg(h, P.uhol)}} ${val(h, "cos", P.uhol, h.kr.cos)}`)
       + (P.uhol === 45 ? h.pill("✓ Pri 45° sú obe √2/2", "ok") : "")}},
  {warn:R`$\tg 90^\circ$ neexistuje, lebo $\cos 90^\circ = 0$ a nulou sa deliť nedá. Nie je to ani 0, ani „nekonečno“. Podobne neexistuje $\tg 270^\circ$.`}
],

"Znamienka v kvadrantoch":[
  R`Osi rozdelia rovinu na štyri **kvadranty**, číslované proti smeru hodinových ručičiek od kladnej polosi $x$. Znamienko sínusu je znamienko $y$-ovej súradnice bodu, znamienko kosínusu je znamienko $x$-ovej. Tangens je ich podiel, je kladný, keď majú rovnaké znamienko.`,
  {tool:"kruznica", ask:R`Ťahaj bod cez všetky štyri kvadranty. V ktorom sú kladné všetky tri funkcie? V ktorom len $\vc{\tg}$?`,
   take:R`v I. kvadrante sú kladné všetky, v II. len sínus, v III. len tangens, v IV. len kosínus.`,
   cfg:{uhol:{v:130, step:5}, on:{sin:true, cos:true, tg:true, znam:true}}},
  R`| kvadrant | I. | II. | III. | IV. |
|---|---|---|---|---|
| uhol | $(0^\circ;\ 90^\circ)$ | $(90^\circ;\ 180^\circ)$ | $(180^\circ;\ 270^\circ)$ | $(270^\circ;\ 360^\circ)$ |
| $\sin$ | $+$ | $+$ | $-$ | $-$ |
| $\cos$ | $+$ | $-$ | $-$ | $+$ |
| $\tg$ | $+$ | $-$ | $+$ | $-$ |`,
  R`Bod pri $150^\circ$ je zrkadlovým obrazom bodu pri $30^\circ$ podľa osi $y$. Má rovnakú výšku, len je vľavo. Preto sa hodnota každého uhla dá vypočítať z ostrého uhla, ktorý jeho rameno zviera s osou $x$. Zmení sa nanajvýš znamienko.`,
  {def:"Prevod do I. kvadrantu", tex:R`\begin{aligned}\sin(180^\circ - \alpha) &= \sin \alpha & \cos(180^\circ - \alpha) &= -\cos \alpha\\ \sin(180^\circ + \alpha) &= -\sin \alpha & \cos(180^\circ + \alpha) &= -\cos \alpha\\ \sin(360^\circ - \alpha) &= -\sin \alpha & \cos(360^\circ - \alpha) &= \cos \alpha\end{aligned}`},
  {tool:"kruznica", ask:R`Porovnaj uhly $30^\circ$, $150^\circ$, $210^\circ$ a $330^\circ$. Čo majú hodnoty spoločné?`,
   take:R`všade je $|\sin \alpha| = \frac{1}{2}$ a $|\cos \alpha| = \frac{\sqrt{3}}{2}$. Mení sa len znamienko podľa kvadrantu.`,
   cfg:{uhol:{v:150, step:30}, on:{sin:true, cos:true, body:true}}},
  {steps:[
    {t:"Kvadrant", d:"Zisti, v ktorom kvadrante rameno leží, a podľa tabuľky urči znamienko."},
    {t:"Ostrý uhol k osi x", d:R`Vypočítaj ostrý uhol medzi ramenom a osou $x$: $180^\circ - \alpha$, $\alpha - 180^\circ$ alebo $360^\circ - \alpha$.`},
    {t:"Hodnota", d:"Hodnotu ostrého uhla vezmi z tabuľky a daj jej znamienko z prvého kroku."}
  ]},
  {ex:R`Vypočítaj $\cos 240^\circ$ a $\tg 315^\circ$.`,
   steps:[
     [R`$240^\circ$ je v III. kvadrante, kosínus je záporný. Ostrý uhol k osi $x$: $240 - 180 = 60$.`, R`\cos 240^\circ = -\cos 60^\circ = -\tfrac{1}{2}`],
     [R`$315^\circ$ je v IV. kvadrante, tangens je záporný. Ostrý uhol: $360 - 315 = 45$.`, R`\tg 315^\circ = -\tg 45^\circ = -1`]
   ],
   res:R`$\cos 240^\circ = -\dfrac{1}{2}$, $\tg 315^\circ = -1$.`},
  {ex:R`Vypočítaj $\sin \dfrac{7\pi}{6}$.`,
   steps:[
     [R`Preveď na stupne.`, R`\frac{7\pi}{6} = 7 \cdot 30^\circ = 210^\circ`],
     [R`III. kvadrant, sínus je záporný. Ostrý uhol: $210 - 180 = 30$.`, R`\sin 210^\circ = -\sin 30^\circ = -\tfrac{1}{2}`]
   ],
   res:R`$\sin \dfrac{7\pi}{6} = -\dfrac{1}{2}$`},
  {tool:"kruznica", kind:"uloha", ask:R`Uhol $\alpha$ leží v II. kvadrante a $\vb{\cos \alpha} = -\dfrac{\sqrt{2}}{2}$. Nastav ho.`,
   hint:R`Kosínus $\frac{\sqrt{2}}{2}$ patrí k $45^\circ$. V II. kvadrante je to $180^\circ - 45^\circ$.`,
   goal:P => P.uhol === 135,
   cfg:{uhol:{v:60, step:15}, on:{cos:true, znam:true},
     out:(P, h) => h.calc(R`\vb{\cos ${deg(h, P.uhol)}} ${val(h, "cos", P.uhol, h.kr.cos)}`)
       + (P.uhol === 135 ? h.pill("✓ cos 135° = −√2/2", "ok") : P.uhol === 225 ? h.p("Kosínus sedí, ale $225^\\circ$ je v III. kvadrante.") : "")}},
  {warn:R`Najprv kvadrant, potom hodnota. $\cos 120^\circ$ nie je $\frac{1}{2}$, ale $-\frac{1}{2}$, lebo bod je vľavo od osi $y$. Na kontrolu stačí predstaviť si, kde bod na kružnici leží.`}
],

"Grafy sin, cos, tg":[
  R`Ak uhol nanášaš na os $x$ a hodnotu sínusu na os $y$, vznikne vlnovka, **sínusoida**. Každý bod grafu má výšku rovnakú ako bod na kružnici pri tom istom uhle.`,
  {tool:"kruznica", ask:R`Posúvaj uhol a sleduj, ako sa výška bodu na kružnici prenáša do grafu. Kde má $\va{\sin}$ maximum, minimum a nulové body?`,
   take:R`maximum 1 pri $90^\circ$, minimum $-1$ pri $270^\circ$, nulové body pri $0^\circ$, $180^\circ$ a $360^\circ$.`,
   cfg:{uhol:{v:60, step:5}, on:{sin:true, graf:true}}},
  {tool:"kruznica", ask:R`Teraz kosínus. V čom sa jeho graf líši od sínusu?`,
   take:R`kosínusoida má rovnaký tvar, len je posunutá o $90^\circ$ doľava: začína v maxime 1. Platí $\cos x = \sin(x + 90^\circ)$.`,
   cfg:{uhol:{v:60, step:5}, on:{cos:true, graf:true}}},
  {tool:"kruznica", ask:R`A tangens. Čo sa deje s grafom pri $90^\circ$ a $270^\circ$?`,
   take:R`graf tam má zvislé asymptoty, tangens nie je definovaný. Medzi nimi rastie od $-\infty$ po $\infty$.`,
   cfg:{uhol:{v:45, step:5}, on:{tg:true, graf:true}}},
  R`| | $y = \sin x$ | $y = \cos x$ | $y = \tg x$ |
|---|---|---|---|
| $D(f)$ | $\mathbb{R}$ | $\mathbb{R}$ | $x \neq \frac{\pi}{2} + k\pi$ |
| $H(f)$ | $\langle -1;\ 1 \rangle$ | $\langle -1;\ 1 \rangle$ | $\mathbb{R}$ |
| nulové body | $k\pi$ | $\frac{\pi}{2} + k\pi$ | $k\pi$ |
| párnosť | nepárna | párna | nepárna |
| perióda | $2\pi$ | $2\pi$ | $\pi$ |`,
  {cards:[
    {fig:{fns:["sin(x)"], view:[-7, 2, 7, -2]}, t:R`$y = \sin x$`, d:"Súmerná podľa počiatku, prechádza bodom [0; 0]."},
    {fig:{fns:["cos(x)"], view:[-7, 2, 7, -2]}, t:R`$y = \cos x$`, d:"Súmerná podľa osi $y$, začína v maxime [0; 1]."},
    {fig:{fns:["tg(x)"], view:[-7, 3, 7, -3]}, t:R`$y = \tg x$`, d:"Rastúce vetvy medzi asymptotami $x = \\frac{\\pi}{2} + k\\pi$."}
  ]},
  {def:"Obor hodnôt sínusu a kosínusu", tex:R`-1 \leq \sin x \leq 1,\qquad -1 \leq \cos x \leq 1`},
  {ex:R`Urči obor hodnôt funkcie $f(x) = 3 + 2 \sin x$.`,
   steps:[
     [R`Začni nerovnosťou pre $\sin x$.`, R`-1 \leq \sin x \leq 1`],
     ["Vynásob dvomi.", R`-2 \leq 2 \sin x \leq 2`],
     ["Pripočítaj 3.", R`1 \leq 3 + 2 \sin x \leq 5`]
   ],
   res:R`$H(f) = \langle 1;\ 5 \rangle$`},
  {tool:"graf", kind:"uloha", ask:R`Posuň graf $y = \sin x + \vd{d}$ tak, aby mal obor hodnôt $\langle 1;\ 3 \rangle$. Os $x$ je v stupňoch.`,
   hint:R`Bez posunu je obor $\langle -1;\ 1 \rangle$. Obe hranice musia stúpnuť o rovnaké číslo.`,
   goal:P => P.d === 2,
   cfg:Object.assign({}, DEG, {view:[-30, 3.6, 390, -1.6], fns:[{f:"sin(x*pi/180)+d", lhs:"y"}, GH("sin(x*pi/180)")],
     params:{d:{v:-1, min:-2, max:3, step:.5, color:"d"}},
     show:[{hline:"1+d", color:"d"}, {hline:"d-1", color:"d"}],
     out:(P, h) => h.big(R`y = \sin x ${P.d ? `${P.d < 0 ? "-" : "+"} \\vd{${h.tn(Math.abs(P.d))}}` : ""}`)
       + h.p(R`$H = \langle \vd{${h.tn(P.d - 1)}};\ \vd{${h.tn(P.d + 1)}} \rangle$`)
       + (P.d === 2 ? h.pill("✓ H = ⟨1; 3⟩", "ok") : "")})},
  {warn:R`Sínus ani kosínus nikdy nie sú väčšie než 1 ani menšie než $-1$. Rovnica $\sin x = 2$ preto nemá riešenie. Tangens toto obmedzenie nemá.`}
],

"Perióda":[
  R`Funkcia je **periodická** s periódou $p > 0$, ak sa jej hodnoty opakujú po každom posune o $p$: $f(x + p) = f(x)$. Na kružnici je to jasné: po celej otočke je bod na tom istom mieste. Za periódu sa berie najmenšie také $p$.`,
  {def:"Perióda goniometrických funkcií", tex:R`\sin(x + 2k\pi) = \sin x,\quad \cos(x + 2k\pi) = \cos x,\quad \tg(x + k\pi) = \tg x`, note:R`Tangens má periódu polovičnú, $\pi = 180^\circ$, lebo protiľahlé body kružnice dajú ten istý priesečník s dotyčnicou.`},
  {tool:"kruznica", ask:R`Posúvaj uhol cez viac otočiek, od $-360^\circ$ do $720^\circ$. Čo sa deje s grafom po každých $360^\circ$?`,
   take:R`graf sa opakuje: úsek od $0^\circ$ do $360^\circ$ sa kopíruje doľava aj doprava.`,
   cfg:{uhol:{v:30, min:-360, max:720, step:15}, on:{sin:true, graf:true}}},
  R`Keď sa $x$ pred dosadením vynásobí číslom $\va{b}$, funkcia „beží“ $b$-krát rýchlejšie a celú vlnu prebehne na $b$-krát kratšom úseku. Graf sa stlačí k osi $y$, presne ako $f(bx)$ v [[b12]].`,
  {def:"Perióda po stlačení", tex:R`y = \sin(\va{b}x),\ y = \cos(\va{b}x):\quad p = \frac{2\pi}{|\va{b}|}`, note:R`Pre $y = \tg(\va{b}x)$ je $p = \dfrac{\pi}{|b|}$. Násobenie celej funkcie ($a \cdot \sin x$) ani pripočítanie čísla periódu nemení.`},
  {tool:"graf", ask:R`Meň $\va{b}$ vo funkcii $y = \sin(bx)$. Koľko celých vĺn sa zmestí do $360^\circ$?`,
   take:R`do $360^\circ$ sa zmestí $b$ vĺn, jedna vlna má dĺžku $\dfrac{360^\circ}{b}$. Pri $b < 1$ je vlna dlhšia než $360^\circ$.`,
   cfg:Object.assign({}, DEG, {fns:[{f:"sin(b*x*pi/180)", lhs:"y"}, GH("sin(x*pi/180)")],
     params:{b:{v:2, min:.5, max:4, step:.5, color:"a"}},
     show:[{seg:[[0, -1.35], ["360/b", -1.35]], color:"a"}, {pt:["360/b", 0], color:"a", label:"{360/b}°", at:"tr"}],
     out:(P, h) => h.big(R`y = \sin(\va{${h.tn(P.b)}}x)`) + h.calc(R`p = \frac{360^\circ}{\va{${h.tn(P.b)}}} = ${h.tn(360 / P.b)}^\circ`)})},
  {ex:R`Urči periódu funkcií $y = \sin 2x$, $y = \cos \dfrac{x}{3}$ a $y = \tg 2x$.`,
   steps:[
     [R`$b = 2$.`, R`p = \frac{2\pi}{2} = \pi`],
     [R`$b = \frac{1}{3}$, delenie zlomkom je násobenie prevrátenou hodnotou.`, R`p = \frac{2\pi}{1/3} = 6\pi`],
     [R`Tangens má základnú periódu $\pi$.`, R`p = \frac{\pi}{2}`]
   ],
   res:R`$\pi$, $6\pi$ a $\dfrac{\pi}{2}$.`},
  {ex:R`Urči periódu a obor hodnôt funkcie $f(x) = 3 \sin 4x + 1$.`,
   steps:[
     [R`Perióda závisí len od čísla pri $x$.`, R`p = \frac{2\pi}{4} = \frac{\pi}{2}`],
     [R`$\sin 4x \in \langle -1;\ 1 \rangle$, vynásob 3 a pripočítaj 1.`, R`-3 + 1 \leq f(x) \leq 3 + 1`]
   ],
   res:R`$p = \dfrac{\pi}{2}$, $H(f) = \langle -2;\ 4 \rangle$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{b}$ tak, aby mala funkcia $y = \cos(bx)$ periódu $120^\circ$.`,
   hint:R`Potrebuješ $\dfrac{360^\circ}{b} = 120^\circ$.`,
   goal:P => P.b === 3,
   cfg:Object.assign({}, DEG, {fns:[{f:"cos(b*x*pi/180)", lhs:"y"}, GH("cos(x*pi/180)")],
     params:{b:{v:1, min:.5, max:4, step:.5, color:"a"}},
     show:[{vline:120, color:"soft"}],
     out:(P, h) => h.big(R`y = \cos(\va{${h.tn(P.b)}}x)`) + h.calc(R`p = \frac{360^\circ}{\va{${h.tn(P.b)}}} = ${h.tn(360 / P.b)}^\circ`)
       + (P.b === 3 ? h.pill("✓ Perióda 120°", "ok") : "")})},
  {warn:R`Perióda $y = \sin 2x$ je $\pi$, nie $4\pi$. Väčšie číslo pri $x$ znamená **kratšiu** periódu, vlny sú hustejšie. Číslo pred sínusom ($3 \sin x$) mení len výšku vĺn, nie ich dĺžku.`}
]

  }
};
})();

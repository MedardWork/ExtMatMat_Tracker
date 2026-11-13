/* Goniometrické rovnice a nerovnice */
(() => {
const r1 = x => Math.round(x * 10) / 10;
const near = (a, b) => Math.abs(a - b) < 1e-9;
/* sin x > c  or  cos x > c  in one period, in degrees */
const ineq = fn => (P, h) => {
  const c = P.c, d = x => `${h.tn(r1(x))}^\\circ`, lhs = `\\${fn}\\, x > \\vc{${h.tn(c)}}`;
  if(c >= 1 - 1e-9) return h.calc(lhs) + h.pill("žiadne riešenie, väčšie než 1 to nebude", "down");
  if(c <= -1 + 1e-9) return h.calc(lhs) + h.p(R`Platí pre všetky $x$ okrem $x = ${fn === "sin" ? "270" : "180"}^\circ + k \cdot 360^\circ$.`);
  const a = fn === "sin" ? Math.asin(c) * 180 / Math.PI : Math.acos(c) * 180 / Math.PI;
  const [lo, hi] = fn === "sin" ? [a, 180 - a] : [-a, a];
  return h.calc(lhs) + h.p(`Hranice z rovnice: $${d(lo)}$ a $${d(hi)}$`)
    + h.calc(`x \\in (${d(lo)} + k \\cdot 360^\\circ;\\ ${d(hi)} + k \\cdot 360^\\circ)`);
};

THEORY.b11 = {
  mins:40,
  brief:[
    R`$\sin x = a$ má riešenie len pre $-1 \leq a \leq 1$. V jednej perióde sú dve: $x_1$ a $\pi - x_1$. Pri $\cos x = a$ sú to $x_1$ a $2\pi - x_1$.`,
    R`Všetky riešenia: pripočítaj $2k\pi$ ($k \in \mathbb{Z}$), pri tangense $k\pi$.`,
    R`V intervale: do všeobecného riešenia dosaď $k = 0, \pm 1, \pm 2, \ldots$ a nechaj len čísla, ktoré do intervalu patria.`,
    R`Nerovnica: vyrieš rovnicu, na kružnici alebo grafe nájdi oblúk, kde nerovnosť platí, a pripočítaj periódu.`
  ],
  subs:{

"Základné rovnice sin x = a":[
  R`Riešiť rovnicu $\sin x = \vc{c}$ znamená nájsť všetky uhly, ktorých bod na jednotkovej kružnici má výšku $c$. Nakresli vodorovnú priamku $y = c$: kde pretne kružnicu, tam sú riešenia.`,
  {tool:"kruznica", ask:R`Posúvaj pravú stranu $\vc{c}$. Koľko riešení má rovnica v $\langle 0^\circ;\ 360^\circ)$? Pre aké $c$ nemá žiadne?`,
   take:R`pre $-1 < c < 1$ má dve riešenia, súmerné podľa osi $y$: $x$ a $180^\circ - x$. Pre $c = \pm 1$ jedno a pre $|c| > 1$ žiadne.`,
   cfg:{eq:"sin", uhol:{v:30, lock:true}, c:{v:.5, min:-1.5, max:1.5, step:.05}, on:{sin:true, graf:true}}},
  R`Pri kosínuse hľadáš body so súradnicou $x = c$, teda zvislú priamku. Riešenia sú súmerné podľa osi $x$: $x$ a $360^\circ - x$. Pri tangense je na každej polovici otočky práve jedno riešenie, lebo tangens má periódu $180^\circ$.`,
  {def:"Riešenia v jednej perióde", tex:R`\begin{aligned}\sin x &= \vc{c}: & x_1 &= \alpha, & x_2 &= \pi - \alpha\\ \cos x &= \vc{c}: & x_1 &= \alpha, & x_2 &= 2\pi - \alpha\\ \tg x &= \vc{c}: & x_1 &= \alpha & &\end{aligned}`, note:R`$\alpha$ je jedno riešenie, ktoré poznáš z tabuľky alebo z kalkulačky. Pri sínuse a kosínuse musí byť $-1 \leq c \leq 1$.`},
  {tool:"kruznica", ask:R`Posúvaj $\vc{c}$ v rovnici $\cos x = c$. Kde ležia riešenia na kružnici?`,
   take:R`na zvislej priamke $x = c$, jedno nad osou $x$ a druhé pod ňou. Spolu dávajú $360^\circ$.`,
   cfg:{eq:"cos", uhol:{v:60, lock:true}, on:{cos:true, graf:true}}},
  {ex:R`Vyrieš $\sin x = \dfrac{1}{2}$ v intervale $\langle 0;\ 2\pi)$.`,
   steps:[
     [R`Z tabuľky: sínus $\frac{1}{2}$ má uhol $\frac{\pi}{6}$.`, R`x_1 = \frac{\pi}{6}`],
     [R`Druhé riešenie je zrkadlový bod v II. kvadrante.`, R`x_2 = \pi - \frac{\pi}{6} = \frac{5\pi}{6}`]
   ],
   res:R`$x \in \left\{\dfrac{\pi}{6};\ \dfrac{5\pi}{6}\right\}$, čiže $30^\circ$ a $150^\circ$.`},
  {ex:R`Vyrieš $\cos x = -\dfrac{\sqrt{2}}{2}$ v intervale $\langle 0;\ 2\pi)$.`,
   steps:[
     [R`Kosínus $\frac{\sqrt{2}}{2}$ má $\frac{\pi}{4}$. Záporný kosínus je v II. a III. kvadrante.`, R`x_1 = \pi - \frac{\pi}{4} = \frac{3\pi}{4}`],
     [R`Druhé riešenie podľa vzorca $2\pi - x_1$.`, R`x_2 = 2\pi - \frac{3\pi}{4} = \frac{5\pi}{4}`]
   ],
   res:R`$x \in \left\{\dfrac{3\pi}{4};\ \dfrac{5\pi}{4}\right\}$, čiže $135^\circ$ a $225^\circ$.`},
  {ex:R`Vyrieš $2 \sin x + 3 = 0$.`,
   steps:[
     [R`Osamostatni $\sin x$.`, R`\sin x = -\frac{3}{2}`],
     [R`Sínus nikdy nie je menší než $-1$.`, R`-\frac{3}{2} < -1`]
   ],
   res:"Rovnica nemá riešenie."},
  {tool:"kruznica", kind:"uloha", ask:R`Nastav $\vc{c}$ tak, aby rovnica $\sin x = c$ mala v $\langle 0^\circ;\ 360^\circ)$ **práve jedno** riešenie.`,
   hint:R`Vodorovná priamka sa musí kružnice len dotknúť: v najvyššom alebo najnižšom bode.`,
   goal:P => near(Math.abs(P.c), 1),
   cfg:{eq:"sin", uhol:{v:30, lock:true}, c:{v:.3}, on:{sin:true, graf:true}}},
  {warn:R`Kalkulačka (tlačidlo $\sin^{-1}$) dá len jedno riešenie, vždy z $\langle -90^\circ;\ 90^\circ \rangle$. Druhé si treba dopočítať zo súmernosti, inak polovica riešení chýba.`}
],

"Všetky riešenia (+ 2kπ)":[
  R`Sínus a kosínus sa opakujú po $2\pi$. Ak je $x_1$ riešením, sú riešeniami aj $x_1 + 2\pi$, $x_1 - 2\pi$, $x_1 + 4\pi$ a tak ďalej. Všetky naraz zapíšeš pomocou celého čísla $k$.`,
  {def:"Všeobecné riešenie", tex:R`x = x_1 + 2k\pi \;\vee\; x = x_2 + 2k\pi,\quad k \in \mathbb{Z}`, note:R`Pri tangense stačí jedno riešenie a perióda $\pi$: $x = x_1 + k\pi$.`},
  {tool:"kruznica", ask:R`Na troch periódach vidíš všetky riešenia rovnice $\sin x = \vc{c}$. Ako ďaleko od seba sú „rovnaké“ body?`,
   take:R`každé riešenie sa opakuje po $360^\circ$. Stačí poznať dve riešenia v jednej perióde.`,
   cfg:{eq:"sin", uhol:{v:30, min:-360, max:720, lock:true}, on:{sin:true, graf:true}}},
  R`Pri niektorých hodnotách sa dve riešenia zlejú do jedného alebo sa dajú zapísať kratšie:`,
  {def:"Špeciálne prípady", tex:R`\begin{aligned}\sin x = 0 &: x = k\pi & \cos x = 0 &: x = \tfrac{\pi}{2} + k\pi\\ \sin x = 1 &: x = \tfrac{\pi}{2} + 2k\pi & \cos x = 1 &: x = 2k\pi\\ \sin x = -1 &: x = \tfrac{3\pi}{2} + 2k\pi & \cos x = -1 &: x = \pi + 2k\pi\end{aligned}`},
  {ex:R`Vyrieš v $\mathbb{R}$: $\cos x = \dfrac{1}{2}$.`,
   steps:[
     [R`V jednej perióde: $\frac{\pi}{3}$ a $2\pi - \frac{\pi}{3} = \frac{5\pi}{3}$, čo je to isté ako $-\frac{\pi}{3}$.`, R`x_1 = \frac{\pi}{3},\quad x_2 = -\frac{\pi}{3}`],
     ["Pripočítaj periódu.", R`x = \pm\frac{\pi}{3} + 2k\pi,\quad k \in \mathbb{Z}`]
   ],
   res:R`$x = \pm\dfrac{\pi}{3} + 2k\pi$, $k \in \mathbb{Z}$.`},
  {ex:R`Vyrieš v $\mathbb{R}$: $\sin 2x = \dfrac{\sqrt{3}}{2}$.`,
   steps:[
     [R`Označ $t = 2x$ a vyrieš $\sin t = \frac{\sqrt{3}}{2}$.`, R`t = \frac{\pi}{3} + 2k\pi \;\vee\; t = \frac{2\pi}{3} + 2k\pi`],
     [R`Vráť sa k $x = \frac{t}{2}$. Vydeľ **všetko**, aj periódu.`, R`x = \frac{\pi}{6} + k\pi \;\vee\; x = \frac{\pi}{3} + k\pi`]
   ],
   res:R`$x = \dfrac{\pi}{6} + k\pi$ alebo $x = \dfrac{\pi}{3} + k\pi$, $k \in \mathbb{Z}$.`},
  {ex:R`Vyrieš v $\mathbb{R}$: $2\cos^2 x - \cos x - 1 = 0$.`,
   steps:[
     [R`Je to kvadratická rovnica pre $t = \cos x$.`, R`2t^2 - t - 1 = 0 \;\Rightarrow\; t = \frac{1 \pm 3}{4}`],
     [R`Dve hodnoty, obe z $\langle -1;\ 1 \rangle$.`, R`\cos x = 1 \;\vee\; \cos x = -\frac{1}{2}`],
     [R`$\cos x = 1$: špeciálny prípad. $\cos x = -\frac{1}{2}$: $\frac{2\pi}{3}$ a $\frac{4\pi}{3}$.`, R`x = 2k\pi \;\vee\; x = \frac{2\pi}{3} + 2k\pi \;\vee\; x = \frac{4\pi}{3} + 2k\pi`]
   ],
   res:R`$x = 2k\pi$, $x = \dfrac{2\pi}{3} + 2k\pi$ alebo $x = \dfrac{4\pi}{3} + 2k\pi$, $k \in \mathbb{Z}$.`},
  {ex:R`Vyrieš v $\mathbb{R}$: $\sin x = \cos x$.`,
   steps:[
     [R`Ak by $\cos x = 0$, bol by $\sin x = \pm 1$ a rovnosť by neplatila. Môžeš teda deliť $\cos x$.`, R`\frac{\sin x}{\cos x} = 1 \;\Rightarrow\; \tg x = 1`],
     [R`Tangens má periódu $\pi$.`, R`x = \frac{\pi}{4} + k\pi`]
   ],
   res:R`$x = \dfrac{\pi}{4} + k\pi$, $k \in \mathbb{Z}$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nastav $\vc{c}$ tak, aby jedným z riešení rovnice $\tg x = c$ bol uhol $135^\circ$. Ktoré ďalšie riešenie potom vidíš?`,
   hint:R`$135^\circ$ je v II. kvadrante, ostrý uhol k osi $x$ je $45^\circ$ a tangens je tam záporný.`,
   goal:P => near(P.c, -1),
   cfg:{eq:"tg", uhol:{v:45, lock:true}, c:{v:1}, on:{tg:true, graf:true}}},
  {warn:R`Pri substitúcii $t = 2x$ sa delí dvoma aj perióda: z $2k\pi$ je $k\pi$. Ak ostane $2k\pi$, stratí sa polovica riešení.`}
],

"Riešenia v danom intervale":[
  R`Úloha často chce len riešenia z určitého intervalu, napríklad $\langle 0;\ 2\pi)$ alebo $\langle -\pi;\ \pi \rangle$. Najistejšie je vziať všeobecné riešenie a dosadzovať doň postupne $k$.`,
  {steps:[
    {t:"Všeobecné riešenie", d:R`Vyrieš rovnicu v $\mathbb{R}$, s $+2k\pi$ alebo $+k\pi$.`},
    {t:"Dosaď k", d:R`Skús $k = 0$, potom $k = 1, 2, \ldots$ a $k = -1, -2, \ldots$, kým čísla neprekročia interval.`},
    {t:"Skontroluj hranice", d:R`Pozri, či je interval uzavretý ($\langle\ \rangle$) alebo otvorený ($(\ )$), hraničné body patria do riešenia len pri uzavretej zátvorke.`}
  ]},
  {tool:"kruznica", ask:R`Tu je interval $\langle -360^\circ;\ 360^\circ)$, teda dve periódy. Koľko riešení má $\sin x = \vc{c}$ pre rôzne $c$?`,
   take:R`pre $-1 < c < 1$ sú štyri, dve v každej perióde. Počet riešení v intervale = (počet periód) × (riešenia v jednej perióde), ak interval obsahuje celé periódy.`,
   cfg:{eq:"sin", uhol:{v:0, min:-360, max:360, lock:true}, on:{sin:true, graf:true}}},
  {ex:R`Vyrieš $\sin x = -\dfrac{1}{2}$ v intervale $\langle 0;\ 2\pi)$.`,
   steps:[
     [R`Všeobecné riešenie, z kalkulačky $x_1 = -\frac{\pi}{6}$, druhé $\pi - x_1$.`, R`x = -\frac{\pi}{6} + 2k\pi \;\vee\; x = \frac{7\pi}{6} + 2k\pi`],
     [R`Prvá skupina: $k = 0$ dá zápornú hodnotu, $k = 1$ už patrí do intervalu.`, R`-\frac{\pi}{6} + 2\pi = \frac{11\pi}{6}`],
     [R`Druhá skupina: $k = 0$.`, R`\frac{7\pi}{6}`]
   ],
   res:R`$x \in \left\{\dfrac{7\pi}{6};\ \dfrac{11\pi}{6}\right\}$, čiže $210^\circ$ a $330^\circ$.`},
  {ex:R`Vyrieš $\cos 2x = 0$ v intervale $\langle 0;\ \pi \rangle$.`,
   steps:[
     [R`Špeciálny prípad pre $t = 2x$.`, R`2x = \frac{\pi}{2} + k\pi \;\Rightarrow\; x = \frac{\pi}{4} + k\frac{\pi}{2}`],
     [R`Dosaď $k = 0, 1, 2$.`, R`\frac{\pi}{4},\quad \frac{3\pi}{4},\quad \frac{5\pi}{4}`],
     [R`$\frac{5\pi}{4} > \pi$, nepatrí. $k = -1$ dá $-\frac{\pi}{4}$, tiež nie.`, R`x \in \left\{\tfrac{\pi}{4};\ \tfrac{3\pi}{4}\right\}`]
   ],
   res:R`Dve riešenia: $\dfrac{\pi}{4}$ a $\dfrac{3\pi}{4}$.`},
  {ex:R`Koľko riešení má rovnica $\sin x = 0{,}3$ v intervale $\langle 0;\ 4\pi \rangle$?`,
   steps:[
     [R`$0{,}3$ je medzi $-1$ a $1$, v jednej perióde sú dve riešenia, obe v $(0;\ \pi)$.`, R`x_1 \doteq 0{,}305,\quad x_2 = \pi - x_1 \doteq 2{,}837`],
     [R`Interval $\langle 0;\ 4\pi \rangle$ obsahuje dve celé periódy. Hranice $0$ a $4\pi$ riešením nie sú, lebo $\sin 0 = 0 \neq 0{,}3$.`, R`2 \cdot 2 = 4`]
   ],
   res:"Štyri riešenia."},
  {tool:"kruznica", kind:"uloha", ask:R`Nastav $\vc{c}$ tak, aby jedným z riešení rovnice $\cos x = c$ v $\langle -360^\circ;\ 360^\circ)$ bol uhol $-60^\circ$.`,
   hint:R`Kosínus je párna funkcia: $\cos(-60^\circ) = \cos 60^\circ$.`,
   goal:P => near(P.c, .5),
   cfg:{eq:"cos", uhol:{v:0, min:-360, max:360, lock:true}, c:{v:-.3}, on:{cos:true, graf:true}}},
  {warn:R`Pozor na hranice intervalu. V $\langle 0;\ 2\pi)$ je $2\pi$ vylúčené, v $\langle 0;\ 2\pi \rangle$ patrí. Pri $\sin x = 0$ to rozhoduje, či sú riešenia dve ($0$ a $\pi$), alebo tri.`}
],

"Goniometrické nerovnice":[
  R`Nerovnicu $\sin x > c$ riešiš v dvoch krokoch. Najprv rovnica $\sin x = c$ dá hranice. Potom na kružnici alebo na grafe vidíš, na ktorom oblúku je sínus väčší: body **nad** priamkou $y = c$.`,
  {steps:[
    {t:"Hranice", d:R`Vyrieš rovnicu $\sin x = c$ (alebo $\cos x = c$) v jednej perióde.`},
    {t:"Oblúk", d:R`Na kružnici vyznač body nad priamkou $y = c$ (pri kosínuse vpravo od $x = c$). Na grafe je to časť krivky nad čiarkovanou priamkou.`},
    {t:"Interval + perióda", d:R`Zapíš interval idúci proti smeru hodinových ručičiek od menšej hranice k väčšej a pripočítaj $2k\pi$.`}
  ]},
  {tool:"kruznica", ask:R`Posúvaj $\vc{c}$. Kde je sínusoida nad čiarkovanou priamkou $y = c$?`,
   take:R`medzi dvoma riešeniami rovnice, od $x_1$ po $180^\circ - x_1$. Pre záporné $c$ začína interval pod nulou.`,
   cfg:{eq:"sin", uhol:{v:90, lock:true}, on:{sin:true, graf:true}, out:ineq("sin")}},
  {tool:"kruznica", ask:R`A teraz $\cos x > \vc{c}$. Kde je oblúk na kružnici?`,
   take:R`vpravo od zvislej priamky, okolo $0^\circ$. Interval preto prechádza cez nulu: od $-x_1$ po $x_1$.`,
   cfg:{eq:"cos", uhol:{v:0, lock:true}, on:{cos:true, graf:true}, out:ineq("cos")}},
  {ex:R`Vyrieš v $\mathbb{R}$: $\sin x \geq \dfrac{1}{2}$.`,
   steps:[
     [R`Hranice z rovnice $\sin x = \frac{1}{2}$.`, R`x_1 = \frac{\pi}{6},\quad x_2 = \frac{5\pi}{6}`],
     [R`Sínus je väčší medzi nimi, na hornom oblúku. Pri $\geq$ hranice patria.`, R`x \in \left\langle \frac{\pi}{6} + 2k\pi;\ \frac{5\pi}{6} + 2k\pi \right\rangle`]
   ],
   res:R`$x \in \left\langle \dfrac{\pi}{6} + 2k\pi;\ \dfrac{5\pi}{6} + 2k\pi \right\rangle$, $k \in \mathbb{Z}$.`},
  {ex:R`Vyrieš v $\mathbb{R}$: $\cos x < 0$ a $\cos x > \dfrac{\sqrt{2}}{2}$.`,
   steps:[
     [R`Kosínus je záporný vľavo od osi $y$, v II. a III. kvadrante.`, R`\cos x < 0:\ x \in \left(\frac{\pi}{2} + 2k\pi;\ \frac{3\pi}{2} + 2k\pi\right)`],
     [R`$\cos x = \frac{\sqrt{2}}{2}$ pri $\pm\frac{\pi}{4}$. Väčší je na oblúku okolo nuly.`, R`\cos x > \tfrac{\sqrt{2}}{2}:\ x \in \left(-\frac{\pi}{4} + 2k\pi;\ \frac{\pi}{4} + 2k\pi\right)`]
   ],
   res:R`$\left(\dfrac{\pi}{2} + 2k\pi;\ \dfrac{3\pi}{2} + 2k\pi\right)$ a $\left(-\dfrac{\pi}{4} + 2k\pi;\ \dfrac{\pi}{4} + 2k\pi\right)$, $k \in \mathbb{Z}$.`},
  {ex:R`Vyrieš v $\mathbb{R}$: $\tg x \geq 1$.`,
   steps:[
     [R`$\tg x = 1$ pri $\frac{\pi}{4}$. Tangens na vetve $\left(-\frac{\pi}{2};\ \frac{\pi}{2}\right)$ rastie.`, R`\tg x \geq 1 \text{ pre } x \in \left\langle \tfrac{\pi}{4};\ \tfrac{\pi}{2} \right)`],
     [R`Pri $\frac{\pi}{2}$ tangens neexistuje, zátvorka je otvorená. Perióda je $\pi$.`, R`x \in \left\langle \frac{\pi}{4} + k\pi;\ \frac{\pi}{2} + k\pi \right)`]
   ],
   res:R`$x \in \left\langle \dfrac{\pi}{4} + k\pi;\ \dfrac{\pi}{2} + k\pi \right)$, $k \in \mathbb{Z}$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nastav $\vc{c}$ tak, aby nerovnica $\sin x < c$ platila v $\langle 0^\circ;\ 360^\circ)$ práve pre $x \in (210^\circ;\ 330^\circ)$.`,
   hint:R`Hranice $210^\circ$ a $330^\circ$ musia byť riešeniami rovnice $\sin x = c$.`,
   goal:P => near(P.c, -.5),
   cfg:{eq:"sin", uhol:{v:270, lock:true}, c:{v:.2}, on:{sin:true, graf:true}}},
  {warn:R`Pri $\cos x > \frac{\sqrt{2}}{2}$ nie je riešením $\left(\frac{\pi}{4};\ \frac{7\pi}{4}\right)$, to je presne opačný oblúk, kde je kosínus menší. Interval musí ísť cez nulu: $\left(-\frac{\pi}{4};\ \frac{\pi}{4}\right)$. Pomôže skúška jedného čísla, napríklad $x = 0$: $\cos 0 = 1 > \frac{\sqrt{2}}{2}$.`}
]

  }
};
})();

/* Mocninové funkcie y = xⁿ pre celé n */
(() => {
const POW = (n, extra) => Object.assign({view:[-4, 5, 4, -5], tick:1, fns:[{f:"x^n"}], params:{n}}, extra);

THEORY.a23 = {
  mins:15,
  brief:[
    R`$y = x^n$ pre **párne kladné** $n$: tvar ako parabola, párna funkcia, $H(f) = \langle 0;\ \infty)$.`,
    R`Pre **nepárne kladné** $n$: rastúca na celom $\mathbb{R}$, nepárna, $H(f) = \mathbb{R}$.`,
    R`Pre **záporné** $n$ je $x^{-n} = \dfrac{1}{x^n}$: $D(f) = \mathbb{R} \setminus \{0\}$, obe osi sú asymptoty. Párne $n$ dá obe vetvy nad osou $x$, nepárne jednu hore a jednu dole.`,
    R`Všetky prechádzajú bodom $[1;\ 1]$.`
  ],
  subs:{

"Párne kladné n (x², x⁴)":[
  R`**Mocninová funkcia** má tvar $y = x^{\va{n}}$: premenná je v základe a exponent $\va{n}$ je pevné celé číslo. Ako graf vyzerá, závisí hlavne od toho, či je $\va{n}$ párne alebo nepárne a či je kladné alebo záporné.`,
  {def:"Mocninová funkcia", tex:R`y = x^{\va{n}}`, note:R`$n$ je celé číslo, $n \neq 0$`},
  R`Pre párne kladné $n$ je najznámejšia $y = x^2$. Vyššie párne mocniny majú rovnaký tvar, len sú pri nule plochšie a ďalej od nej strmšie.`,
  {tool:"graf", ask:R`Zvyšuj $\va{n}$ po párnych číslach. Čo sa deje s grafom medzi $-1$ a $1$? A čo za jednotkou?`,
   take:R`všetky tieto grafy prechádzajú bodmi $[-1;\ 1]$, $[0;\ 0]$ a $[1;\ 1]$. Medzi $-1$ a $1$ ich vyšší exponent pritláča k osi, mimo tohto úseku ich dvíha strmšie.`,
   cfg:POW({v:2, min:2, max:8, step:2, color:"a"}, {view:[-3, 5, 3, -1], fns:[{f:"x^n"}, {f:"x^2", color:"axis", dash:true, thin:true, ghost:true}],
     show:[{pt:[1, 1], color:"soft", size:3.5}, {pt:[-1, 1], color:"soft", size:3.5}, {pt:[0, 0], color:"soft", size:3.5}],
     out:(P, h) => h.big(h.eq(0)) + h.p(R`$0{,}5^{${P.n}} = ${h.tn(.5 ** P.n, 4)}$`) + h.p(R`$2^{${P.n}} = ${h.tn(2 ** P.n)}$`)})},
  {cards:[
    {t:"Definičný obor a obor hodnôt", d:R`$D(f) = \mathbb{R}$, $H(f) = \langle 0;\ \infty)$. Párna mocnina nie je nikdy záporná.`},
    {t:"Súmernosť", d:R`Párna funkcia: $(-x)^n = x^n$. Graf je súmerný podľa osi $y$.`},
    {t:"Priebeh", d:R`Klesá na $(-\infty;\ 0\rangle$, rastie na $\langle 0;\ \infty)$. V nule má minimum 0.`}
  ]},
  {ex:R`Bez kalkulačky porovnaj: ktoré číslo je väčšie, $0{,}9^4$ alebo $0{,}9^2$? A $1{,}5^4$ alebo $1{,}5^2$?`,
   steps:[
     [R`Pre čísla medzi 0 a 1 každé ďalšie násobenie výsledok zmenší.`, R`0{,}9^4 < 0{,}9^2`],
     [R`Pre čísla väčšie ako 1 ho zväčší.`, R`1{,}5^4 > 1{,}5^2`]
   ],
   res:R`$0{,}9^4 < 0{,}9^2$, ale $1{,}5^4 > 1{,}5^2$. Grafy sa v bode $[1;\ 1]$ pretínajú a vymenia si poradie.`}
],

"Nepárne n (x³)":[
  R`Pre nepárne kladné $n$ vyzerá graf inak. Záporné číslo umocnené na nepárny exponent zostane záporné, takže ľavá časť grafu leží pod osou $x$.`,
  {tool:"graf", ask:R`Zvyšuj $\va{n}$ po nepárnych číslach, začni od 1. Čo majú všetky grafy spoločné?`,
   take:R`všetky sú rastúce na celom $\mathbb{R}$ a prechádzajú bodmi $[-1;\ -1]$, $[0;\ 0]$, $[1;\ 1]$. Pre $n = 1$ je to priamka $y = x$.`,
   cfg:POW({v:3, min:1, max:7, step:2, color:"a"}, {view:[-3, 4, 3, -4], fns:[{f:"x^n"}, {f:"x^3", color:"axis", dash:true, thin:true, ghost:true}],
     show:[{pt:[1, 1], color:"soft", size:3.5}, {pt:[-1, -1], color:"soft", size:3.5}, {pt:[0, 0], color:"soft", size:3.5}],
     out:(P, h) => h.big(P.n === 1 ? "y = x" : h.eq(0)) + h.p(R`$(-2)^{${P.n}} = ${h.tn((-2) ** P.n)}$`) + h.p(R`$2^{${P.n}} = ${h.tn(2 ** P.n)}$`)})},
  {cards:[
    {t:"Definičný obor a obor hodnôt", d:R`$D(f) = \mathbb{R}$, $H(f) = \mathbb{R}$. Nadobúda každú hodnotu.`},
    {t:"Súmernosť", d:R`Nepárna funkcia: $(-x)^n = -x^n$. Graf je súmerný podľa počiatku.`},
    {t:"Priebeh", d:R`Rastúca na celom $\mathbb{R}$, preto aj prostá. Nemá maximum ani minimum.`}
  ]},
  R`Rozdiel medzi párnym a nepárnym exponentom je najviac vidno pri riešení rovníc.`,
  {ex:R`Vyrieš rovnice $x^3 = -8$, $x^2 = -8$ a $x^4 = 16$.`,
   steps:[
     [R`Nepárna mocnina je prostá a nadobúda všetky hodnoty: práve jedno riešenie.`, R`x^3 = -8 \;\Rightarrow\; x = -2`],
     [R`Párna mocnina nie je nikdy záporná: žiadne riešenie.`, R`x^2 = -8 \;\Rightarrow\; \text{nemá riešenie}`],
     [R`Párna mocnina kladného čísla: dve riešenia, kladné a záporné.`, R`x^4 = 16 \;\Rightarrow\; x = 2 \ \text{alebo}\ x = -2`]
   ],
   res:R`$x = -2$; žiadne riešenie; $x = \pm 2$.`},
  {warn:R`Pri párnej mocnine nezabudni na záporné riešenie. $x^2 = 9$ má riešenia $3$ aj $-3$.`}
],

"Záporné n (x⁻¹, x⁻²)":[
  R`Záporný exponent znamená prevrátenú hodnotu. Funkcia $y = x^{-1}$ je to isté ako $y = \dfrac{1}{x}$.`,
  {def:"Záporný exponent", mid:true, tex:R`x^{-n} = \dfrac{1}{x^n}`, note:R`Deliť nulou sa nedá, preto $D(f) = \mathbb{R} \setminus \{0\}$.`},
  {tool:"graf", ask:R`Meň $\va{n}$ od $-1$ po $-4$. Čím sa líšia grafy pre párne a nepárne $n$?`,
   take:R`pri nepárnom $n$ je jedna vetva hore a druhá dole. Pri párnom sú obe nad osou $x$. V oboch prípadoch sa graf k osiam blíži, ale nedotkne sa ich.`,
   cfg:POW({v:-1, min:-4, max:-1, step:1, color:"a"}, {
     show:[{pt:[1, 1], color:"soft", size:3.5}, {pt:[-1, P => (-1) ** P.n], color:"soft", size:3.5}, {pt:[0, 0], color:"a", open:true}],
     out:(P, h) => h.calc(`y = x^{\\va{${P.n}}} = \\dfrac{1}{x${P.n === -1 ? "" : `^{${-P.n}}`}}`)
       + (P.n % 2 ? h.pill("nepárna · vetvy hore a dole", "flat") + h.p(R`$H(f) = \mathbb{R} \setminus \{0\}$`) : h.pill("párna · obe vetvy hore", "up") + h.p(R`$H(f) = (0;\ \infty)$`))})},
  R`Priamka, ku ktorej sa graf približuje bez toho, aby sa jej dotkol, sa volá **asymptota**. Tieto funkcie majú dve: os $x$ (hodnoty sa pre veľké $x$ blížia k nule) a os $y$ (pri nule hodnoty rastú bez obmedzenia).`,
  {cards:[
    {fig:{fns:["x^2"], view:[-3, 4, 3, -4]}, t:R`$n$ párne kladné`, d:R`$x^2$, $x^4$. Tvar paraboly, párna.`},
    {fig:{fns:["x^3"], view:[-3, 4, 3, -4]}, t:R`$n$ nepárne kladné`, d:R`$x^3$, $x^5$. Rastúca, nepárna.`},
    {fig:{fns:["1/x^2"], view:[-3, 4, 3, -4]}, t:R`$n$ párne záporné`, d:R`$x^{-2}$. Obe vetvy hore, párna.`},
    {fig:{fns:["1/x"], view:[-3, 4, 3, -4]}, t:R`$n$ nepárne záporné`, d:R`$x^{-1}$. Vetvy hore a dole, nepárna.`}
  ]},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{n}$ tak, aby graf prechádzal bodom $[2;\ 0{,}25]$.`,
   hint:R`Hľadáš $n$, pre ktoré je $2^n = \dfrac{1}{4}$. Štvrtina je $\dfrac{1}{2^2}$.`,
   goal:P => P.n === -2,
   cfg:POW({v:2, min:-4, max:4, step:1, color:"a"}, {view:[-4, 4, 4, -4],
     show:[{target:[2, .25], fn:0, label:"[2; 0,25]", at:"tr"}],
     out:(P, h) => (P.n === 0 ? h.big("y = 1") : h.big(h.eq(0))) + h.p(R`$2^{${P.n}} = ${h.tn(2 ** P.n, 4)}$`) + (P.n === -2 ? h.pill("✓ Prechádza bodom", "ok") : "")})},
  {ex:R`Graf má dve vetvy, obe nad osou $x$, je súmerný podľa osi $y$ a k obom osiam sa len blíži. Ktorej z funkcií $y = x^2$, $y = x^{-1}$, $y = x^{-2}$ patrí?`,
   steps:[
     [R`Dve vetvy a asymptoty znamenajú záporný exponent. $y = x^2$ odpadá.`, R`n < 0`],
     [R`Obe vetvy nad osou $x$ a súmernosť podľa osi $y$ znamenajú párny exponent.`, R`n \text{ párne}`]
   ],
   res:R`$y = x^{-2}$`},
  {warn:R`Záporný exponent nerobí hodnotu zápornou. $2^{-2} = \dfrac{1}{4}$, nie $-4$.`}
]

  }
};
})();

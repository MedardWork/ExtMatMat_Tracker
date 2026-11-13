/* Oblúková miera a jednotková kružnica */
(() => {
const deg = (h, d) => `${h.tn(d)}^\\circ`;
const rad = (h, d) => d === 0 ? "0" : radTex(d) || h.tn(Math.round(d * Math.PI / 180 * 1000) / 1000, 3);

THEORY.b8 = {
  mins:30,
  brief:[
    R`$180^\circ = \pi$ rad. Stupne na radiány: $\alpha \cdot \dfrac{\pi}{180}$, radiány na stupne: $x \cdot \dfrac{180}{\pi}$.`,
    R`Na jednotkovej kružnici má bod pri uhle $\alpha$ súradnice $[\vb{\cos \alpha};\ \va{\sin \alpha}]$.`,
    R`Uhol proti smeru hodinových ručičiek je kladný, v smere záporný. Uhly $\alpha + k \cdot 360^\circ$ majú ten istý koncový bod.`
  ],
  subs:{

"Radiány a prevod zo stupňov":[
  R`Uhol sa dá merať aj inak než v stupňoch: dĺžkou oblúka, ktorý vytne na kružnici s polomerom 1. Táto miera sa volá **oblúková** a jej jednotka je **radián**. Celý obvod takej kružnice je $2\pi$, takže plný uhol $360^\circ$ má $2\pi$ radiánov.`,
  {def:"Prevod stupňov a radiánov", tex:R`180^\circ = \pi \text{ rad}`, legend:[
    ["°→rad", "d", "na radiány", R`vynásob $\dfrac{\pi}{180}$`],
    ["rad→°", "d", "na stupne", R`vynásob $\dfrac{180}{\pi}$`]
  ], note:R`$1 \text{ rad} \doteq 57{,}3^\circ$. Slovo „rad“ sa často vynecháva: $\alpha = \pi/2$ znamená $90^\circ$.`},
  {tool:"kruznica", ask:R`Posúvaj uhol $\vd{\alpha}$ a sleduj dĺžku fialového oblúka. Akú dĺžku má pri $90^\circ$, $180^\circ$ a $360^\circ$?`,
   take:R`oblúk pri $180^\circ$ meria $\pi \doteq 3{,}14$, pri $90^\circ$ polovicu, $\pi/2$, a celá kružnica $2\pi$.`,
   cfg:{uhol:{v:90, step:15}, on:{rad:true, body:true}}},
  R`Najčastejšie uhly sa oplatí poznať naspamäť. Všetky sú násobky $30^\circ = \pi/6$ alebo $45^\circ = \pi/4$.`,
  R`| stupne | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $120^\circ$ | $135^\circ$ | $150^\circ$ | $180^\circ$ | $270^\circ$ | $360^\circ$ |
|---|---|---|---|---|---|---|---|---|---|---|
| radiány | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ | $\frac{2\pi}{3}$ | $\frac{3\pi}{4}$ | $\frac{5\pi}{6}$ | $\pi$ | $\frac{3\pi}{2}$ | $2\pi$ |`,
  {ex:R`Preveď $135^\circ$ na radiány.`,
   steps:[
     [R`Vynásob $\dfrac{\pi}{180}$.`, R`135 \cdot \frac{\pi}{180} = \frac{135\pi}{180}`],
     ["Zlomok vykráť číslom 45.", R`\frac{135\pi}{180} = \frac{3\pi}{4}`]
   ],
   res:R`$135^\circ = \dfrac{3\pi}{4}$ rad.`},
  {ex:R`Preveď $\dfrac{5\pi}{6}$ a $2$ rad na stupne.`,
   steps:[
     [R`Vynásob $\dfrac{180}{\pi}$, $\pi$ sa vykráti.`, R`\frac{5\pi}{6} \cdot \frac{180}{\pi} = \frac{5 \cdot 180}{6} = 150^\circ`],
     [R`Pri čísle bez $\pi$ sa $\pi$ nevykráti, výsledok je približný.`, R`2 \cdot \frac{180}{\pi} = \frac{360}{\pi} \doteq 114{,}6^\circ`]
   ],
   res:R`$\dfrac{5\pi}{6} = 150^\circ$, $2 \text{ rad} \doteq 114{,}6^\circ$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nastav uhol $\vd{\alpha} = \dfrac{5\pi}{4}$.`,
   hint:R`$\dfrac{5\pi}{4} = 5 \cdot \dfrac{\pi}{4} = 5 \cdot 45^\circ$.`,
   goal:P => P.uhol === 225,
   cfg:{uhol:{v:60, step:15}, on:{rad:true},
     out:(P, h) => h.calc(R`\vd{\alpha} = \vd{${deg(h, P.uhol)}} = ${rad(h, P.uhol)}\ \text{rad}`)
       + (P.uhol === 225 ? h.pill("✓ 5π/4 = 225°", "ok") : "")}},
  {warn:R`$\pi$ samo osebe je číslo $3{,}14\ldots$, nie $180$. Rovnosť $\pi = 180^\circ$ platí len ako veľkosť uhla. Na kalkulačke skontroluj režim **DEG** (stupne) alebo **RAD** (radiány), inak dostaneš nezmysel.`}
],

"Jednotková kružnica":[
  R`**Jednotková kružnica** má stred v počiatku $O\,[0;\ 0]$ a polomer 1. Uhol $\alpha$ meriame od kladnej polosi $x$. Jeho druhé rameno pretne kružnicu v bode $P$ a súradnice tohto bodu sú práve kosínus a sínus uhla.`,
  {def:"Bod na jednotkovej kružnici", tex:R`P = [\vb{\cos \alpha};\ \va{\sin \alpha}]`, legend:[
    ["cos α", "b", "x-ová súradnica", "vodorovná vzdialenosť od osi $y$, so znamienkom"],
    ["sin α", "a", "y-ová súradnica", "zvislá vzdialenosť od osi $x$, so znamienkom"]
  ]},
  {tool:"kruznica", ask:R`Ťahaj bod po kružnici. Pri akom uhle je $\va{\sin \alpha}$ najväčší? Kde je $\vb{\cos \alpha}$ záporný?`,
   take:R`$\sin \alpha$ je najväčší, rovný 1, pri $90^\circ$. $\cos \alpha$ je záporný, keď je bod vľavo od osi $y$, teda medzi $90^\circ$ a $270^\circ$. Obe hodnoty sú vždy z $\langle -1;\ 1 \rangle$.`,
   cfg:{uhol:{v:40, step:5}, on:{sin:true, cos:true}}},
  R`Pre ostrý uhol je to známa definícia z pravouhlého trojuholníka. Trojuholník $O$, $P$ a päta kolmice z $P$ na os $x$ má preponu 1. Protiľahlá odvesna je $\sin \alpha$, priľahlá $\cos \alpha$. Kružnica len rozširuje túto definíciu na všetky uhly.`,
  R`Tangens nájdeš na dotyčnici ku kružnici v bode $[1;\ 0]$. Predĺž rameno uhla, kým ju nepretne. Výška priesečníka je $\vc{\tg \alpha}$.`,
  {def:"Tangens", tex:R`\vc{\tg \alpha} = \frac{\va{\sin \alpha}}{\vb{\cos \alpha}}`, note:R`Pre $\alpha = 90^\circ$ a $270^\circ$ je rameno rovnobežné s dotyčnicou, $\tg \alpha$ nie je definovaný.`},
  {tool:"kruznica", ask:R`Posúvaj uhol a sleduj $\vc{\tg \alpha}$. Čo sa deje, keď sa uhol blíži k $90^\circ$?`,
   take:R`tangens rastie nad všetky medze a pri $90^\circ$ neexistuje. Na rozdiel od sínusu a kosínusu môže byť ľubovoľne veľký.`,
   cfg:{uhol:{v:60, step:5}, on:{tg:true}}},
  {ex:R`Aké súradnice má bod $P$ jednotkovej kružnice pri uhle $\alpha = 120^\circ$?`,
   steps:[
     [R`Bod je v II. kvadrante, $60^\circ$ od zápornej polosi $x$. Vzdialenosti od osí sú ako pri $60^\circ$.`, R`\cos 60^\circ = \tfrac{1}{2},\quad \sin 60^\circ = \tfrac{\sqrt{3}}{2}`],
     [R`Vľavo od osi $y$ je $x$-ová súradnica záporná, nad osou $x$ je $y$-ová kladná.`, R`\cos 120^\circ = -\tfrac{1}{2},\quad \sin 120^\circ = \tfrac{\sqrt{3}}{2}`]
   ],
   res:R`$P = \left[-\dfrac{1}{2};\ \dfrac{\sqrt{3}}{2}\right]$`},
  {ex:R`Leží bod $Q\,[0{,}6;\ 0{,}8]$ na jednotkovej kružnici? Ak áno, aké sú $\sin$, $\cos$ a $\tg$ jeho uhla?`,
   steps:[
     ["Bod leží na kružnici s polomerom 1, ak má od počiatku vzdialenosť 1.", R`0{,}6^2 + 0{,}8^2 = 0{,}36 + 0{,}64 = 1`],
     ["Súradnice sú kosínus a sínus.", R`\cos \alpha = 0{,}6,\quad \sin \alpha = 0{,}8`],
     ["Tangens je ich podiel.", R`\tg \alpha = \frac{0{,}8}{0{,}6} = \frac{4}{3}`]
   ],
   res:R`Áno. $\cos \alpha = 0{,}6$, $\sin \alpha = 0{,}8$, $\tg \alpha = \dfrac{4}{3}$, uhol $\alpha \doteq 53{,}13^\circ$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nájdi uhol z $\langle 0^\circ;\ 360^\circ)$, pre ktorý je $\va{\sin \alpha} = -\dfrac{1}{2}$ a $\vb{\cos \alpha} > 0$.`,
   hint:R`Bod má byť pod osou $x$ (sínus záporný) a vpravo od osi $y$ (kosínus kladný): IV. kvadrant. Sínus $\frac{1}{2}$ má uhol $30^\circ$.`,
   goal:P => P.uhol === 330,
   cfg:{uhol:{v:45, step:15}, on:{sin:true, cos:true},
     out:(P, h) => h.calc(R`\vd{\alpha} = \vd{${deg(h, P.uhol)}}`) + h.calc(R`\va{\sin \alpha} \doteq \va{${h.tn(Math.round(h.kr.sin * 1000) / 1000, 3)}},\quad \vb{\cos \alpha} \doteq \vb{${h.tn(Math.round(h.kr.cos * 1000) / 1000, 3)}}`)
       + (P.uhol === 330 ? h.pill("✓ sin α = −1/2, cos α > 0", "ok") : "")}},
  {warn:R`Sínus je **zvislá** súradnica ($y$), kosínus **vodorovná** ($x$), v bode $P = [\cos \alpha;\ \sin \alpha]$ je kosínus prvý. Ľahko sa to popletie, pretože pri vyslovení „sínus a kosínus“ ide sínus prvý.`}
],

"Orientovaný uhol, uhly nad 360°":[
  R`Na kružnici uhol nevnímame ako „otvor“ medzi ramenami, ale ako **otočenie**. Začína sa na kladnej polosi $x$. Otáčanie proti smeru hodinových ručičiek dáva kladný uhol, v smere ručičiek záporný. Takto má zmysel aj uhol $-60^\circ$ alebo $750^\circ$.`,
  R`Po celej otočke ($360^\circ$, čiže $2\pi$) sa bod vráti na to isté miesto. Uhly, ktoré sa líšia o celé otočky, majú preto rovnaký koncový bod, a teda aj rovnaký sínus, kosínus a tangens.`,
  {def:"Uhly s rovnakým koncovým bodom", tex:R`\alpha + k \cdot 360^\circ = \alpha + 2k\pi,\quad k \in \mathbb{Z}`, note:R`Ten z nich, ktorý leží v $\langle 0^\circ;\ 360^\circ)$, sa volá **základná veľkosť** uhla.`},
  {tool:"kruznica", ask:R`Nastav postupne $\vd{-60^\circ}$, $\vd{300^\circ}$ a $\vd{660^\circ}$. Čo majú spoločné?`,
   take:R`všetky tri končia v tom istom bode a majú rovnaký sínus aj kosínus. Líšia sa o $360^\circ$: $-60 + 360 = 300$, $300 + 360 = 660$.`,
   cfg:{uhol:{v:-60, min:-360, max:720, step:15}, on:{sin:true, cos:true, rad:true}}},
  {steps:[
    {t:"Odčítaj alebo pripočítaj celé otočky", d:R`Kladný uhol nad $360^\circ$: odčítaj toľko $360^\circ$, koľko sa dá. Záporný uhol: pripočítaj $360^\circ$, kým nie je kladný.`},
    {t:"V radiánoch po 2π", d:R`Zlomok s $\pi$ najprv zapíš ako celú časť plus zvyšok. Odčítaj párny násobok $\pi$.`}
  ]},
  {ex:R`Urči základnú veľkosť uhla $1110^\circ$.`,
   steps:[
     [R`Koľko celých otočiek sa zmestí do $1110^\circ$?`, R`1110 : 360 = 3,\ \text{zvyšok } 30`],
     ["Odčítaj tri otočky.", R`1110^\circ - 3 \cdot 360^\circ = 30^\circ`]
   ],
   res:R`$1110^\circ$ má základnú veľkosť $30^\circ$, takže napríklad $\sin 1110^\circ = \sin 30^\circ = \dfrac{1}{2}$.`},
  {ex:R`Urči základnú veľkosť uhlov $-\dfrac{7\pi}{4}$ a $\dfrac{17\pi}{3}$.`,
   steps:[
     [R`Záporný uhol: pripočítaj $2\pi = \frac{8\pi}{4}$.`, R`-\frac{7\pi}{4} + \frac{8\pi}{4} = \frac{\pi}{4}`],
     [R`$\frac{17}{3} = 5\frac{2}{3}$, teda dve celé otočky $4\pi = \frac{12\pi}{3}$ a niečo navyše.`, R`\frac{17\pi}{3} - \frac{12\pi}{3} = \frac{5\pi}{3}`]
   ],
   res:R`$-\dfrac{7\pi}{4}$ má základnú veľkosť $\dfrac{\pi}{4} = 45^\circ$, $\dfrac{17\pi}{3}$ má $\dfrac{5\pi}{3} = 300^\circ$.`},
  {tool:"kruznica", kind:"uloha", ask:R`Nájdi uhol zo záporných čísel $(-360^\circ;\ 0^\circ)$, ktorý má rovnaký koncový bod ako $150^\circ$.`,
   hint:R`Od $150^\circ$ odčítaj jednu celú otočku.`,
   goal:P => P.uhol === -210,
   cfg:{uhol:{v:-30, min:-360, max:360, step:15}, on:{sin:true, cos:true},
     out:(P, h) => h.calc(R`\vd{\alpha} = \vd{${deg(h, P.uhol)}}`)
       + (P.uhol === -210 ? h.pill("✓ −210° + 360° = 150°", "ok") : P.uhol === 150 ? h.p("To je samotný uhol $150^\\circ$. Hľadaj záporný.") : "")}},
  {warn:R`Pri zápornom uhle sa pripočíta $360^\circ$, znamienko sa len tak nezahodí: $-60^\circ$ má základnú veľkosť $300^\circ$, nie $60^\circ$. Uhol $60^\circ$ je zrkadlovo nad osou $x$, $-60^\circ$ pod ňou.`}
]

  }
};
})();

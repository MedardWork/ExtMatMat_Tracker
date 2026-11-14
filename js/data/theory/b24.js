/* Rovnica kružnice, poloha priamky a kružnice, dvoch kružníc */
(() => {
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const two = {view:[-7, 6, 9, -6], tick:1, fns:[],
  show:[{curve:["4*cos(t)", "4*sin(t)"], t:[0, "2pi"], color:"a"}, {curve:["d+r*cos(t)", "r*sin(t)"], t:[0, "2pi"], color:"b"}, {pt:[0, 0], color:"a"}, {pt:["d", 0], color:"b"}]};

THEORY.b24 = {
  mins:30,
  brief:[
    R`Kružnica so stredom $S\,[m;\ n]$ a polomerom $r$: $(x - m)^2 + (y - n)^2 = r^2$.`,
    R`Z rozvinutého tvaru $x^2 + y^2 + ax + by + c = 0$ doplnením na štvorec dostaneš stred a polomer.`,
    R`Priamka a kružnica: porovnaj vzdialenosť stredu od priamky $d$ s polomerom ($d < r$ sečnica, $d = r$ dotyčnica, $d > r$ nepretína).`,
    R`Dve kružnice: porovnaj vzdialenosť stredov s $r_1 + r_2$ a $|r_1 - r_2|$.`
  ],
  subs:{

"Rovnica kružnice — stred a polomer":[
  R`Kružnica je množina bodov, ktoré majú od stredu $S$ vzdialenosť $r$. Keď túto podmienku zapíšeš vzorcom pre vzdialenosť ([[b19]]) a umocníš, dostaneš rovnicu kružnice.`,
  {def:"Stredový tvar rovnice kružnice", tex:R`(x - \va{m})^2 + (y - \vb{n})^2 = \vd{r}^2,\qquad S = [\va{m};\ \vb{n}]`},
  {tool:"analyticka", ask:R`Ťahaj stred $S$ a meň polomer. Ako sa mení rovnica?`,
   take:R`súradnice stredu sú v zátvorkách s opačným znamienkom, na pravej strane je druhá mocnina polomeru.`,
   cfg:{typ:"kruznica"}},
  {ex:R`Napíš rovnicu kružnice so stredom $S\,[2;\ -3]$ a polomerom 4. Leží na nej bod $[2;\ 1]$?`,
   steps:[
     ["Dosaď do vzorca.", R`(x - 2)^2 + (y + 3)^2 = 16`],
     ["Over bod.", R`0 + 16 = 16 \ \checkmark`]
   ],
   res:R`$(x - 2)^2 + (y + 3)^2 = 16$, bod na nej leží.`},
  {ex:R`Napíš rovnicu kružnice s priemerom $AB$, $A\,[-1;\ 2]$, $B\,[5;\ 10]$.`,
   steps:[
     ["Stred je stred úsečky.", R`S = [2;\ 6]`],
     ["Polomer je polovica $|AB|$.", R`|AB| = \sqrt{36 + 64} = 10,\ r = 5`]
   ],
   res:R`$(x - 2)^2 + (y - 6)^2 = 25$`},
  {warn:R`Pri $(x + 3)^2$ je súradnica stredu $-3$, nie $3$. A na pravej strane je $r^2$: kružnica $(x - 1)^2 + y^2 = 9$ má polomer 3.`}
],

"Doplnenie na štvorec v rovnici kružnice":[
  R`Rovnica môže byť zadaná roznásobená. Stred a polomer sa z nej dostanú doplnením na štvorec ([[a10]]) zvlášť pre $x$ a pre $y$.`,
  {def:"Všeobecný tvar", tex:R`x^2 + y^2 + ax + by + c = 0 \;\Rightarrow\; S = \left[-\frac{a}{2};\ -\frac{b}{2}\right],\quad r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c`},
  {ex:R`Urči stred a polomer kružnice $x^2 + y^2 - 6x + 4y - 12 = 0$.`,
   steps:[
     ["Zoskup a doplň.", R`(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4`],
     ["Zbaľ.", R`(x - 3)^2 + (y + 2)^2 = 25`]
   ],
   res:R`$S\,[3;\ -2]$, $r = 5$.`},
  {ex:R`Je $x^2 + y^2 + 2x - 4y + 10 = 0$ rovnica kružnice?`,
   steps:[
     ["Doplň.", R`(x + 1)^2 + (y - 2)^2 = -10 + 1 + 4 = -5`],
     ["Súčet štvorcov nemôže byť záporný.", R`\text{nie je kružnica}`]
   ],
   res:"Rovnicu nespĺňa žiadny bod."},
  {warn:R`Čo pridáš na ľavú stranu pri dopĺňaní, musíš pridať aj na pravú. A kladné $r^2$ je podmienka: pri nule je to bod, pri zápornom čísle nič.`}
],

"Priamka a kružnica":[
  R`Priamka môže kružnicu pretínať v dvoch bodoch (**sečnica**), dotýkať sa jej (**dotyčnica**) alebo ju míňať (**nesečnica**). Rozhodne vzdialenosť stredu od priamky ([[b23]]), alebo počet riešení sústavy.`,
  {def:"Poloha priamky a kružnice", tex:R`d(S, p) < r:\ \text{sečnica},\qquad d = r:\ \text{dotyčnica},\qquad d > r:\ \text{nesečnica}`},
  {tool:"analyticka", ask:R`Ťahaj body priamky a sleduj, koľko spoločných bodov má s kružnicou.`,
   take:R`keď je vzdialenosť stredu od priamky menšia než $r$, sú dva priesečníky, pri rovnosti jeden, inak žiadny.`,
   cfg:{typ:"kruznica"}},
  {ex:R`Nájdi spoločné body kružnice $x^2 + y^2 = 25$ a priamky $x - y + 1 = 0$.`,
   steps:[
     ["Z priamky $y = x + 1$, dosaď.", R`x^2 + (x + 1)^2 = 25 \;\Rightarrow\; 2x^2 + 2x - 24 = 0`],
     ["Vyrieš.", R`x^2 + x - 12 = 0 \;\Rightarrow\; x = 3 \vee x = -4`],
     ["Dopočítaj $y$.", R`[3;\ 4],\quad [-4;\ -3]`]
   ],
   res:R`Sečnica, priesečníky $[3;\ 4]$ a $[-4;\ -3]$.`},
  {ex:R`Pre aké $q$ je priamka $y = x + q$ dotyčnicou kružnice $x^2 + y^2 = 8$?`,
   steps:[
     ["Vzdialenosť stredu $[0;\\ 0]$ od $x - y + q = 0$.", R`\frac{|q|}{\sqrt{2}} = \sqrt{8}`],
     ["Vyrieš.", R`|q| = 4`]
   ],
   res:R`$q = 4$ alebo $q = -4$.`},
  {warn:R`Po dosadení do kružnice nezabudni dopočítať druhú súradnicu. Priesečník je bod, nie len $x$.`}
],

"Dve kružnice":[
  R`Poloha dvoch kružníc závisí od vzdialenosti stredov $d$ a od polomerov. Môžu sa pretínať, dotýkať (zvonku alebo zvnútra) alebo nemať spoločný bod.`,
  {def:"Poloha dvoch kružníc", tex:R`\begin{aligned}d > r_1 + r_2 &:\ \text{ležia mimo seba} & d = r_1 + r_2 &:\ \text{vonkajší dotyk}\\ |r_1 - r_2| < d < r_1 + r_2 &:\ \text{pretínajú sa} & d = |r_1 - r_2| &:\ \text{vnútorný dotyk}\end{aligned}`},
  {tool:"graf", ask:R`Prvá kružnica má polomer 4. Meň vzdialenosť stredov $\vd{d}$ a polomer druhej $\vb{r}$. Kedy sa kružnice dotýkajú?`,
   take:R`pri $d = 4 + r$ zvonku a pri $d = |4 - r|$ zvnútra. Medzi tým sa pretínajú v dvoch bodoch.`,
   cfg:Object.assign({}, two, {params:{d:{v:6, min:0, max:9, step:.5, color:"d"}, r:{v:3, min:.5, max:5, step:.5, color:"b"}},
     out:(P, h) => { const s = 4 + P.r, df = Math.abs(4 - P.r), d = P.d;
       const k = d > s ? "ležia mimo seba" : d === s ? "vonkajší dotyk" : d > df ? "pretínajú sa" : d === df ? (d === 0 ? "totožné" : "vnútorný dotyk") : "jedna vnútri druhej";
       return h.calc(R`\vd{d} = ${h.tn(d)},\quad r_1 + \vb{r_2} = ${h.tn(s)},\quad |r_1 - \vb{r_2}| = ${h.tn(df)}`) + h.pill(k, "flat"); }})},
  {ex:R`Aká je vzájomná poloha kružníc $x^2 + y^2 = 9$ a $(x - 4)^2 + (y - 3)^2 = 4$?`,
   steps:[
     ["Stredy a polomery.", R`S_1 = [0;\ 0],\ r_1 = 3;\quad S_2 = [4;\ 3],\ r_2 = 2`],
     ["Vzdialenosť stredov.", R`d = \sqrt{16 + 9} = 5 = r_1 + r_2`]
   ],
   res:"Dotýkajú sa zvonku."},
  {tool:"graf", kind:"uloha", ask:R`Pri polomere druhej kružnice $\vb{r} = 2$ nastav vzdialenosť stredov $\vd{d}$ tak, aby sa kružnice dotýkali zvnútra.`,
   hint:R`$d = |4 - 2|$.`,
   goal:P => P.d === 2,
   cfg:Object.assign({}, two, {params:{d:{v:5, min:0, max:9, step:.5, color:"d"}, r:{v:2, lock:true}}})},
  {warn:R`Pri vnútornom dotyku sa porovnáva s **rozdielom** polomerov, nie so súčtom. Kružnica s menším polomerom je vtedy vnútri väčšej.`}
]

  }
};
})();

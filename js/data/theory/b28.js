/* Konštrukčné úlohy: základné konštrukcie a počet riešení */
(() => {
const L = v => ({v, lock:true});

THEORY.b28 = {
  mins:25,
  brief:[
    R`Základné konštrukcie: os úsečky, os uhla, kolmica, rovnobežka, uhol $60^\circ$, Tálesova kružnica, dotyčnica z bodu.`,
    R`Postup: rozbor (náčrt), zápis postupu, konštrukcia, diskusia o počte riešení.`,
    R`Hľadaný bod leží v prieniku dvoch množín bodov (priamka, kružnica, Tálesova kružnica…).`,
    R`Počet riešení závisí od počtu priesečníkov: pri danom $c$, $a$ a uhle $\alpha$ môžu byť 0, 1 alebo 2.`
  ],
  subs:{

"Základné konštrukcie":[
  R`Konštrukcie sa robia len pravítkom a kružidlom. Všetky zložitejšie úlohy sa skladajú z niekoľkých základných krokov. Každý z nich je vlastne množina bodov ([[b25]]).`,
  {steps:[
    {t:"Os úsečky", d:"Kružnice so stredmi v koncoch úsečky a rovnakým polomerom (väčším než polovica) sa pretnú v dvoch bodoch osi."},
    {t:"Os uhla", d:"Kružnica z vrcholu pretne ramená. Z týchto bodov rovnakým polomerom dve kružnice, ich priesečník leží na osi."},
    {t:"Kolmica a rovnobežka", d:"Kolmica z bodu: os úsečky, ktorú bod vytne kružnicou na priamke. Rovnobežka: dve kolmice."},
    {t:"Uhol 60°", d:"Rovnostranný trojuholník: kružnica s polomerom rovným dĺžke strany."},
    {t:"Tálesova kružnica a dotyčnica", d:"Stred úsečky, kružnica s priemerom úsečky. Dotyčnice z bodu: Tálesova kružnica nad $SX$ ([[a31]])."}
  ]},
  {tool:"konstrukcia", ask:R`Os úsečky. Prejdi konštrukciu tlačidlom „Ďalší krok“. Potom zmenšuj polomer $\vd{r}$: kedy sa kružnice prestanú pretínať?`,
   take:R`kružnice sa pretnú v dvoch bodoch len pre $r > \tfrac{1}{2}|AB| = 3$. Spojnica priesečníkov je kolmá na $AB$ a prechádza jej stredom.`,
   cfg:{typ:"os", d:L(6), r:{v:4, min:2, max:6}, krok:{v:1}}},
  {tool:"konstrukcia", ask:R`Os uhla. Prejdi kroky a potom meň uhol $\vd{\alpha}$. Aký štvoruholník tvoria body $V$, $X$, $Z$, $Y$?`,
   take:R`kosoštvorec (všetky štyri strany majú dĺžku $r$). Jeho uhlopriečka $VZ$ delí uhol pri $V$ na polovice.`,
   cfg:{typ:"osuhla", r:L(3), krok:{v:1}}},
  {tool:"konstrukcia", ask:R`Kolmica z bodu $P$ na priamku $p$. Prejdi kroky. Čo sa stane, keď je polomer $\vd{r}$ menší než vzdialenosť bodu od priamky?`,
   take:R`kružnica priamku nepretne a konštrukcia sa nedá urobiť. Inak je $PQ$ os úsečky $XY$, teda kolmica na $p$.`,
   cfg:{typ:"kolmica", h:L(2.5), krok:{v:1}}},
  {tool:"konstrukcia", kind:"uloha", ask:R`Dotyčnice z bodu $M$ ku kružnici. Posuň bod $M$ (vzdialenosť $\vd{d}$) tak, aby existovala práve jedna dotyčnica.`,
   hint:R`Jedna dotyčnica vedie len z bodu, ktorý leží na kružnici.`,
   goal:(P, st) => st.h.kon.n === 1,
   cfg:{typ:"dotycnica", r:L(2.5), d:{v:6, min:1, max:8}, krok:L(4)}},
  {tool:"trojuholnik", ask:R`Zapni osi strán (opísaná kružnica) a osi uhlov (vpísaná kružnica). Kde sa pretínajú?`,
   take:R`osi strán v strede opísanej kružnice (rovnako ďaleko od vrcholov), osi uhlov v strede vpísanej (rovnako ďaleko od strán).`,
   cfg:{toggles:["opisana", "vpisana", "vysky", "taznice"], on:{opisana:true}}},
  {warn:R`Pri osi úsečky musí byť polomer kružníc väčší než polovica úsečky, inak sa kružnice nepretnú.`}
],

"Konštrukcia trojuholníka":[
  R`Konštrukčná úloha má štyri časti. **Rozbor**: náčrt hotového útvaru, vyznačenie zadaných prvkov a úvaha, odkiaľ začať. **Postup**: očíslované kroky. **Konštrukcia**: samotné rysovanie. **Diskusia**: koľko riešení úloha má.`,
  {steps:[
    {t:"Rozbor", d:"Načrtni trojuholník, vyznač zadané. Hľadaj úsečku, ktorú vieš narysovať hneď, a množiny, na ktorých leží zvyšný vrchol."},
    {t:"Postup", d:R`Zápis: 1. $AB$, $|AB| = c$; 2. $k$, $k(A;\ b)$; 3. $l$, $l(B;\ a)$; 4. $C \in k \cap l$; 5. $\triangle ABC$.`},
    {t:"Diskusia", d:"Koľko priesečníkov majú množiny, toľko riešení (v jednej polrovine)."}
  ]},
  {ex:R`Zostroj trojuholník $ABC$, ak $c = 6$ cm, $v_c = 3$ cm, $t_c = 4$ cm.`,
   steps:[
     ["Narysuj $AB$ a jej stred $S_c$ (ťažnica vedie zo stredu).", R`|AB| = 6`],
     [R`Vrchol $C$ leží na rovnobežke s $AB$ vo vzdialenosti $v_c$.`, R`C \in p,\ p \parallel AB,\ d(p, AB) = 3`],
     [R`A zároveň na kružnici so stredom $S_c$ a polomerom $t_c$.`, R`C \in k(S_c;\ 4)`],
     ["Priesečníky.", R`3 < 4 \Rightarrow \text{dva priesečníky}`]
   ],
   res:"V jednej polrovine dve riešenia, navzájom súmerné podľa osi úsečky $AB$."},
  {tool:"konstrukcia", ask:R`Ten istý príklad narysovaný: $c = 6$, $v_c = 3$, $t_c = 4$. Prejdi kroky. Potom skracuj ťažnicu $\vb{t_c}$: kedy zostane jedno riešenie a kedy žiadne?`,
   take:R`pre $t_c > v_c$ dve riešenia, pre $t_c = v_c = 3$ jedno (rovnoramenný trojuholník), pre $t_c < v_c$ žiadne.`,
   cfg:{typ:"cvt", c:L(6), v:L(3), t:{v:4, min:1, max:6}, krok:{v:1}}},
  {tool:"konstrukcia", ask:R`Veta sss: $c = 6$. Meň strany $\va{a}$ a $\vb{b}$. Kedy trojuholník nevznikne?`,
   take:R`keď $a + b \leq c$ (kružnice sa nedočiahnu) alebo keď sa jedna strana líši od druhej aspoň o $c$. To je trojuholníková nerovnosť.`,
   cfg:{typ:"sss", c:L(6), krok:L(4)}},
  {tool:"trojuholnik", ask:R`Ťahaj vrchol $C$ a zapni ťažnice a výšky. Ako sa mení $t_c$ a $v_c$?`,
   take:R`$v_c$ závisí len od vzdialenosti $C$ od priamky $AB$, $t_c$ od vzdialenosti $C$ od stredu $AB$. Preto $C$ hľadáme v prieniku rovnobežky a kružnice.`,
   cfg:{fixed:["A", "B"], on:{taznice:true, vysky:true}}},
  {warn:R`Pri konštrukcii podľa vety ssu treba poznať aj to, ktorá strana leží oproti danému uhlu. Rozbor s náčrtom je preto povinný.`}
],

"Počet riešení":[
  R`Počet riešení sa určí v diskusii. Ak hľadaný bod leží na priesečníku priamky a kružnice, môžu byť 0, 1 alebo 2 priesečníky ([[b24]]). Typický prípad je trojuholník zadaný $c$, $\alpha$ a stranou $a$ oproti uhlu $\alpha$ (ssu).`,
  {tool:"konstrukcia", ask:R`$|AB| = 6$, uhol $\alpha = 30^\circ$ pri vrchole $A$. Vrchol $C$ leží na polpriamke z $A$ a na kružnici $k(B;\ \va{a})$. Meň $\va{a}$. Koľko trojuholníkov vznikne?`,
   take:R`pre $a < 3$ žiadny, pre $a = 3$ jeden (pravouhlý), pre $3 < a < 6$ dva, pre $a \geq 6$ jeden. Hranica 3 je vzdialenosť $B$ od polpriamky: $6 \sin 30^\circ$.`,
   cfg:{typ:"ssu", c:L(6), alfa:L(30), a:{v:4, min:1, max:8}, krok:L(4)}},
  {ex:R`Koľko riešení má konštrukcia trojuholníka s $c = 6$, $\alpha = 30^\circ$ a $a = 4$?`,
   steps:[
     [R`Vzdialenosť $B$ od ramena uhla $\alpha$.`, R`6 \sin 30^\circ = 3`],
     [R`$3 < a = 4 < c = 6$: kružnica pretne polpriamku v dvoch bodoch, oba za $A$.`, R`2 \text{ riešenia}`]
   ],
   res:"Dva rôzne trojuholníky."},
  {tool:"konstrukcia", kind:"uloha", ask:R`Nastav dĺžku strany $\va{a}$ tak, aby mala úloha práve jedno riešenie a trojuholník bol pravouhlý.`,
   hint:R`Kružnica sa musí polpriamky len dotknúť.`,
   goal:P => P.a === 3,
   cfg:{typ:"ssu", c:L(6), alfa:L(30), a:{v:5, min:1, max:8}, krok:L(4)}},
  {tool:"konstrukcia", ask:R`Trojuholník z $c = 6$, výšky $\vd{v_c}$ a uhla $\gamma = 60^\circ$ pri vrchole $C$. Vrchol $C$ leží na oblúku, z ktorého vidno $AB$ pod uhlom $60^\circ$. Zväčšuj výšku: kedy riešenie zanikne?`,
   take:R`najvyšší bod oblúka je vo výške $3\sqrt{3} \doteq 5{,}2$. Pre menšiu výšku sú dve riešenia, pre väčšiu žiadne.`,
   cfg:{typ:"cvg", c:L(6), gama:L(60), v:{v:3, min:1, max:7}, krok:L(4)}},
  {warn:R`Riešenia súmerné podľa priamky $AB$ sa zvyčajne nepočítajú ako rôzne (sú zhodné). Počet riešení sa udáva v jednej polrovine.`}
]

  }
};
})();

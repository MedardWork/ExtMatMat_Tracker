/* Konštrukčné úlohy: základné konštrukcie a počet riešení */
/* TOOL-TODO: constructions are shown only as written steps; a ruler-and-compass tool that draws the construction step by step is missing. Add the visual when the tool or option exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});
/* Ssu: A = [0; 0], B = [6; 0], ray from A at 30°, circle k(B, a) */
const nSol = a => { const c = 6, al = Math.PI / 6, D = a * a - c * c * Math.sin(al) ** 2;
  if(D < -1e-9) return 0; const r = Math.abs(D) < 1e-9 ? 0 : Math.sqrt(D), m = c * Math.cos(al);
  return [m - r, m + r].filter((s, i, arr) => s > 1e-9 && arr.indexOf(s) === i).length; };

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
  {tool:"trojuholnik", ask:R`Ťahaj vrchol $C$ a zapni ťažnice a výšky. Ako sa mení $t_c$ a $v_c$?`,
   take:R`$v_c$ závisí len od vzdialenosti $C$ od priamky $AB$, $t_c$ od vzdialenosti $C$ od stredu $AB$. Preto $C$ hľadáme v prieniku rovnobežky a kružnice.`,
   cfg:{fixed:["A", "B"], on:{taznice:true, vysky:true}}},
  {warn:R`Pri konštrukcii podľa vety ssu treba poznať aj to, ktorá strana leží oproti danému uhlu. Rozbor s náčrtom je preto povinný.`}
],

"Počet riešení":[
  R`Počet riešení sa určí v diskusii. Ak hľadaný bod leží na priesečníku priamky a kružnice, môžu byť 0, 1 alebo 2 priesečníky ([[b24]]). Typický prípad je trojuholník zadaný $c$, $\alpha$ a stranou $a$ oproti uhlu $\alpha$ (ssu).`,
  {tool:"graf", ask:R`$|AB| = 6$, uhol $\alpha = 30^\circ$ pri vrchole $A$. Vrchol $C$ leží na polpriamke z $A$ a na kružnici $k(B;\ \va{a})$. Meň $\va{a}$. Koľko trojuholníkov vznikne?`,
   take:R`pre $a < 3$ žiadny, pre $a = 3$ jeden (pravouhlý), pre $3 < a < 6$ dva, pre $a \geq 6$ jeden. Hranica 3 je vzdialenosť $B$ od polpriamky: $6 \sin 30^\circ$.`,
   cfg:{view:[-1, 6, 13, -1.5], tick:1, fns:[{f:"tan(pi/6)*x", lhs:"y", dom:[0, 13]}],
     params:{a:{v:4, min:1, max:8, step:.5, color:"a"}},
     show:[{seg:[[0, 0], [6, 0]], color:"d", w:3}, {pt:[0, 0], color:"ink", label:"A", at:"bl"}, {pt:[6, 0], color:"ink", label:"B", at:"br"},
       {curve:["6+a*cos(t)", "a*sin(t)"], t:[0, "pi"], color:"a"}],
     out:(P, h) => { const n = nSol(P.a); return h.calc(R`d(B, \text{polpriamka}) = 6 \sin 30^\circ = 3,\quad \va{a} = ${h.tn(P.a)}`) + h.pill(`počet riešení: ${n}`, n ? "ok" : "down"); }}},
  {ex:R`Koľko riešení má konštrukcia trojuholníka s $c = 6$, $\alpha = 30^\circ$ a $a = 4$?`,
   steps:[
     [R`Vzdialenosť $B$ od ramena uhla $\alpha$.`, R`6 \sin 30^\circ = 3`],
     [R`$3 < a = 4 < c = 6$: kružnica pretne polpriamku v dvoch bodoch, oba za $A$.`, R`2 \text{ riešenia}`]
   ],
   res:"Dva rôzne trojuholníky."},
  {tool:"graf", kind:"uloha", ask:R`Nastav dĺžku strany $\va{a}$ tak, aby mala úloha práve jedno riešenie a trojuholník bol pravouhlý.`,
   hint:R`Kružnica sa musí polpriamky len dotknúť.`,
   goal:P => P.a === 3,
   cfg:{view:[-1, 6, 13, -1.5], tick:1, fns:[{f:"tan(pi/6)*x", lhs:"y", dom:[0, 13]}],
     params:{a:{v:5, min:1, max:8, step:.5, color:"a"}},
     show:[{seg:[[0, 0], [6, 0]], color:"d", w:3}, {pt:[0, 0], color:"ink", label:"A", at:"bl"}, {pt:[6, 0], color:"ink", label:"B", at:"br"},
       {curve:["6+a*cos(t)", "a*sin(t)"], t:[0, "pi"], color:"a"}],
     out:(P, h) => h.pill(`počet riešení: ${nSol(P.a)}`, "flat")}},
  {warn:R`Riešenia súmerné podľa priamky $AB$ sa zvyčajne nepočítajú ako rôzne (sú zhodné). Počet riešení sa udáva v jednej polrovine.`}
]

  }
};
})();

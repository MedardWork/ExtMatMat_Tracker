/* Nerovnica s dvoma neznámymi a jej obraz v rovine */
(() => {
const L = v => ({v, lock:true});
const V = {view:[-5, 6, 6, -4], tick:1};
/* the half-plane above / below y = k x + q, cut to the view */
const up = (k, q) => [[-6, `${k}*(-6)+${q}`], [7, `${k}*7+${q}`], [7, 9], [-6, 9]];
const dn = (k, q) => [[-6, `${k}*(-6)+${q}`], [7, `${k}*7+${q}`], [7, -9], [-6, -9]];
const lin = (h, k, q) => `${k === 1 ? "" : k === -1 ? "-" : `\\va{${h.tn(k)}}`}x ${q < 0 ? "-" : "+"} \\vb{${h.tn(Math.abs(q))}}`;

THEORY.b7 = {
  mins:25,
  brief:[
    R`Riešením nerovnice $ax + by + c > 0$ je **polrovina**. Jej hranica je priamka $ax + by + c = 0$.`,
    R`Pri $>$, $<$ hranica nepatrí (čiarkovaná), pri $\geq$, $\leq$ patrí (plná).`,
    R`Ktorá polrovina: dosaď kontrolný bod, napríklad $[0;\ 0]$. Alebo uprav na $y > \ldots$ (nad priamkou) či $y < \ldots$ (pod ňou).`,
    R`Sústava nerovníc: prienik polrovín, často mnohouholník.`
  ],
  subs:{

"Polrovina ako riešenie":[
  R`Rovnica $y = 2x - 1$ opisuje priamku: všetky body $[x;\ y]$, ktoré ju spĺňajú. Nerovnica $y > 2x - 1$ opisuje všetky body **nad** touto priamkou. Takej množine sa hovorí **polrovina**.`,
  {def:"Polrovina", tex:R`y > kx + q:\ \text{nad priamkou},\qquad y < kx + q:\ \text{pod priamkou}`},
  {tool:"graf", ask:R`Polrovina $y > \va{k}x + \vb{q}$. Ťahaj bod $A$ a sleduj, kedy nerovnosť platí.`,
   take:R`platí presne vtedy, keď je bod nad priamkou. Na samotnej priamke platí rovnosť, takže pri ostrej nerovnosti tam riešenie nie je.`,
   cfg:Object.assign({}, V, {fns:[{f:"k*x+q", lhs:"y", dash:true}],
     params:{k:{v:2, min:-3, max:3, step:.5, color:"a"}, q:{v:-1, min:-3, max:3, step:1, color:"b"}},
     points:{A:[1, 3, {color:"d"}]},
     show:[{poly:up("k", "q"), color:"c"}],
     out:(P, h) => { const r = P.k * P.Ax + P.q;
       return h.calc(R`y > ${lin(h, P.k, P.q)}`) + h.calc(R`A:\ ${h.tn(P.Ay)} ${P.Ay > r ? ">" : P.Ay === r ? "=" : "<"} ${h.tn(r)}`) + (P.Ay > r ? h.pill("A patrí do polroviny", "ok") : h.pill("A nepatrí", "down")); }})},
  {ex:R`Patria body $[1;\ 2]$ a $[-1;\ 0]$ do riešenia nerovnice $2x - y + 1 > 0$?`,
   steps:[
     [R`Dosaď $[1;\ 2]$.`, R`2 - 2 + 1 = 1 > 0 \ \checkmark`],
     [R`Dosaď $[-1;\ 0]$.`, R`-2 - 0 + 1 = -1 > 0 \ \text{neplatí}`]
   ],
   res:R`$[1;\ 2]$ áno, $[-1;\ 0]$ nie.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vb{q}$ tak, aby bod $[2;\ 1]$ ležal na hranici polroviny $y \geq x + q$.`,
   hint:R`Bod na hranici spĺňa rovnosť $1 = 2 + q$.`,
   goal:P => P.q === -1,
   cfg:Object.assign({}, V, {fns:[{f:"x+q", lhs:"y"}],
     params:{q:{v:2, min:-3, max:3, step:1, color:"b"}},
     show:[{poly:up(1, "q"), color:"c"}, {target:[2, 1], fn:0, label:"[2; 1]", at:"r"}]})},
  {warn:R`Polrovina nie je priamka. Riešením nerovnice s dvoma neznámymi je nekonečne veľa bodov, ktoré vypĺňajú celú časť roviny, nie len jedna čiara.`}
],

"Zakreslenie do súradnicovej sústavy":[
  R`Postup je vždy rovnaký: nakresli hraničnú priamku a rozhodni, ktorá strana je riešením. Najistejšie je dosadiť bod, ktorý na priamke neleží.`,
  {steps:[
    {t:"Hranica", d:R`Nahraď znak nerovnosti rovnosťou a nakresli priamku cez dva body. Pri $>$, $<$ čiarkovane, pri $\geq$, $\leq$ plnou čiarou.`},
    {t:"Kontrolný bod", d:R`Dosaď napríklad $[0;\ 0]$ (ak neleží na priamke). Ak nerovnosť platí, vyfarbi polrovinu s týmto bodom, inak druhú.`},
    {t:"Alebo uprav", d:R`Vyjadri $y$: $y > \ldots$ je nad priamkou, $y < \ldots$ pod ňou. Pri delení záporným číslom otoč znak.`}
  ]},
  {tool:"graf", ask:R`Prepínaj znamienko $\vd{s}$: $+1$ znamená $y > 1{,}5x - 3$, $-1$ znamená $y < 1{,}5x - 3$. Kde leží bod $[0;\ 0]$?`,
   take:R`$[0;\ 0]$ je nad priamkou, lebo $0 > -3$. Patrí teda do polroviny $y > 1{,}5x - 3$.`,
   cfg:Object.assign({}, V, {fns:[{f:"1.5x-3", lhs:"y", dash:true}],
     params:{s:{v:1, min:-1, max:1, step:2, color:"d"}},
     show:[{poly:up(1.5, -3), color:"c", if:P => P.s > 0}, {poly:dn(1.5, -3), color:"c", if:P => P.s < 0}, {pt:[0, 0], color:"d", label:"[0; 0]", at:"tl"}],
     out:(P, h) => h.calc(P.s > 0 ? R`y > 1{,}5x - 3` : R`y < 1{,}5x - 3`) + h.p(P.s > 0 ? "$[0;\\ 0]$ do polroviny patrí." : "$[0;\\ 0]$ do polroviny nepatrí.")})},
  {ex:R`Zakresli riešenie nerovnice $3x - 2y < 6$.`,
   steps:[
     [R`Vyjadri $y$. Deliť $-2$ znamená otočiť znak.`, R`-2y < 6 - 3x \;\Rightarrow\; y > 1{,}5x - 3`],
     [R`Hranica cez $[0;\ -3]$ a $[2;\ 0]$, čiarkovane.`, R`y = 1{,}5x - 3`],
     [R`Kontrola $[0;\ 0]$: $0 < 6$ platí.`, R`\text{polrovina nad priamkou, s počiatkom}`]
   ],
   res:"Polrovina nad čiarkovanou priamkou $y = 1{,}5x - 3$."},
  {ex:R`Zakresli $x \geq 2$ a $y < -1$.`,
   steps:[
     ["Neznáma $y$ chýba: hranica je zvislá priamka.", R`x = 2,\ \text{polrovina vpravo, s hranicou}`],
     ["Neznáma $x$ chýba: hranica je vodorovná.", R`y = -1,\ \text{polrovina pod ňou, bez hranice}`]
   ],
   res:"Polrovina vpravo od $x = 2$ (plná čiara) a pod $y = -1$ (čiarkovaná)."},
  {warn:R`Pri vyjadrovaní $y$ z $3x - 2y < 6$ sa delí záporným číslom $-2$ a znak sa otočí. Kto to prehliadne, vyfarbí opačnú polrovinu. Kontrolný bod chybu odhalí.`}
],

"Sústava nerovníc (prienik polrovín)":[
  R`Ak má platiť viac nerovníc naraz, riešením je **prienik** ich polrovín. Zvyčajne vznikne mnohouholník (trojuholník, štvoruholník) alebo neohraničená oblasť. Vrcholy sú priesečníky hraničných priamok.`,
  {tool:"graf", kind:"obr", ask:R`Sústava $y \geq x - 1$, $y \leq -x + 3$, $y \geq 0$.`,
   take:R`prienik troch polrovín je trojuholník s vrcholmi $[1;\ 0]$, $[3;\ 0]$ a $[2;\ 1]$. Hranice patria, lebo nerovnice sú neostré.`,
   cfg:Object.assign({}, V, {view:[-2, 4, 5, -2], fns:[{f:"x-1", lhs:"y"}, {f:"-x+3", lhs:"y", color:"b"}],
     show:[{poly:[[1, 0], [3, 0], [2, 1]], color:"d"}, {pt:[1, 0], color:"d"}, {pt:[3, 0], color:"d"}, {pt:[2, 1], color:"d", label:"[2; 1]", at:"t"}]})},
  {ex:R`Nájdi vrcholy oblasti $x \geq 0$, $y \geq 0$, $x + y \leq 4$ a spočítaj body s celočíselnými súradnicami v nej.`,
   steps:[
     ["Hranice sú osi a priamka $x + y = 4$.", R`[0;\ 0],\ [4;\ 0],\ [0;\ 4]`],
     [R`Celočíselné body po riadkoch $y = 0, 1, 2, 3, 4$.`, R`5 + 4 + 3 + 2 + 1 = 15`]
   ],
   res:"Trojuholník s vrcholmi $[0; 0]$, $[4; 0]$, $[0; 4]$, obsahuje 15 bodov s celými súradnicami."},
  {ex:R`Na oblasti $x \geq 0$, $y \geq 0$, $x + y \leq 4$ nájdi najväčšiu hodnotu výrazu $x + 2y$.`,
   steps:[
     ["Najväčšia hodnota lineárneho výrazu je vo vrchole.", R`[0;\ 0]:\ 0,\quad [4;\ 0]:\ 4,\quad [0;\ 4]:\ 8`]
   ],
   res:R`Najväčšia hodnota je 8 v bode $[0;\ 4]$.`},
  {tool:"graf", kind:"uloha", ask:R`Oblasť $x \geq 0$, $y \geq 0$, $y \leq -x + \vb{q}$. Nastav $\vb{q}$ tak, aby mala obsah 8.`,
   hint:R`Je to pravouhlý trojuholník s odvesnami $q$ a $q$: obsah $\frac{q^2}{2}$.`,
   goal:P => P.q === 4,
   cfg:Object.assign({}, V, {view:[-1, 6, 6, -1], fns:[{f:"-x+q", lhs:"y"}],
     params:{q:{v:2, min:1, max:5, step:.5, color:"b"}},
     show:[{poly:[[0, 0], ["q", 0], [0, "q"]], color:"d"}],
     out:(P, h) => h.calc(R`S = \frac{\vb{${h.tn(P.q)}}^2}{2} = ${h.tn(P.q * P.q / 2)}`)})},
  {warn:R`Sústava nerovníc je prienik, nie zjednotenie. Do riešenia patria len body, ktoré spĺňajú **všetky** nerovnice naraz.`}
]

  }
};
})();

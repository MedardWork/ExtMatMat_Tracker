/* Vlastnosti: monotónnosť, extrémy, ohraničenosť, parita, periodičnosť */
(() => {
const CUB = "(x^3-3x)/2";                       /* turns at [−1; 1] and [1; −1] */
const cub = x => (x * x * x - 3 * x) / 2;
const WAVE = "2sin(pi*x/2)";                    /* period 4 */
const wave = x => 2 * Math.sin(Math.PI * x / 2);

THEORY.a19 = {
  mins:25,
  brief:[
    R`**Rastúca**: väčšie $x$ dá väčšie $y$. **Klesajúca**: väčšie $x$ dá menšie $y$. Vždy sa hovorí o konkrétnom intervale.`,
    R`**Maximum** a **minimum** sú najväčšia a najmenšia hodnota. Na uzavretom intervale ich hľadaj vo vrcholoch aj na krajoch.`,
    R`**Ohraničená** funkcia má všetky hodnoty medzi dvoma číslami. Vidno to z $H(f)$.`,
    R`**Párna**: $f(-x) = f(x)$, graf súmerný podľa osi $y$. **Nepárna**: $f(-x) = -f(x)$, graf súmerný podľa počiatku.`,
    R`**Periodická**: $f(x + p) = f(x)$, graf sa opakuje po úsekoch dĺžky $p$.`
  ],
  subs:{

"Monotónnosť (rastúca, klesajúca)":[
  R`Funkcia je na intervale **rastúca**, ak väčšiemu $x$ vždy patrí väčšie $y$. Graf pri čítaní zľava doprava stúpa. Je **klesajúca**, ak väčšiemu $x$ patrí menšie $y$ a graf klesá.`,
  {def:"Rastúca a klesajúca funkcia", mid:true, tex:R`x_1 < x_2 \;\Rightarrow\; f(x_1) < f(x_2) \qquad\quad x_1 < x_2 \;\Rightarrow\; f(x_1) > f(x_2)`,
   note:"Vľavo rastúca, vpravo klesajúca. Musí to platiť pre každú dvojicu čísel z intervalu."},
  "Väčšina funkcií nie je rastúca ani klesajúca všade. Na niektorých intervaloch stúpajú, na iných klesajú.",
  {tool:"graf", ask:R`Posúvaj bod po grafe. Na ktorých intervaloch graf stúpa a na ktorých klesá?`,
   take:R`funkcia rastie na $(-\infty;\ -1\rangle$ a na $\langle 1;\ \infty)$, klesá na $\langle -1;\ 1\rangle$. Smer sa mení vo vrcholoch.`,
   cfg:{view:[-4, 4, 4, -4], tick:1,
     fns:[{f:CUB, dom:[-4, -1], color:"ok", ghost:true}, {f:CUB, dom:[-1, 1], color:"warn", ghost:true}, {f:CUB, dom:[1, 4], color:"ok", ghost:true}],
     params:{s:{v:-2, min:-2.5, max:2.5, step:.25, color:"a", name:"x"}},
     show:[{pt:[-1, 1], color:"soft", size:3.5}, {pt:[1, -1], color:"soft", size:3.5}, {pt:["s", P => cub(P.s)], color:"a", size:5.5}],
     out:(P, h) => h.calc(R`f(\va{${h.tn(P.s)}}) = ${h.tn(cub(P.s))}`)
       + (Math.abs(Math.abs(P.s) - 1) < 1e-9 ? h.pill("vrchol · smer sa mení", "flat") : Math.abs(P.s) > 1 ? h.pill("tu rastie", "up") : h.pill("tu klesá", "down"))}},
  {cards:[
    {fig:{fns:["0.7x+0.3"], view:[-3, 3, 3, -3]}, t:"Rastúca na celom $D$", d:"Napríklad priamka s kladnou smernicou."},
    {fig:{fns:["2^(-x)-1"], view:[-3, 3, 3, -3]}, t:"Klesajúca na celom $D$", d:"Napríklad $y = 0{,}5^x$."},
    {fig:{fns:["0.6x^2-2"], view:[-3, 3, 3, -3]}, t:"Mení sa", d:"Parabola najprv klesá, od vrcholu rastie."}
  ]},
  {ex:R`Urč, kde rastie a kde klesá funkcia $f(x) = x^2 - 4x + 1$.`,
   steps:[
     [R`Parabola otvorená nahor ($a = 1 > 0$). Smer sa mení vo vrchole.`, R`x_V = -\dfrac{-4}{2 \cdot 1} = 2`],
     ["Naľavo od vrcholu klesá, napravo rastie.", R`\text{klesá na } (-\infty;\ 2\rangle,\quad \text{rastie na } \langle 2;\ \infty)`]
   ],
   res:R`Klesá na $(-\infty;\ 2\rangle$, rastie na $\langle 2;\ \infty)$.`},
  {warn:R`Funkcia $y = \dfrac{1}{x}$ klesá na $(-\infty;\ 0)$ aj na $(0;\ \infty)$, ale nie je klesajúca na celom definičnom obore: $f(-1) = -1 < f(1) = 1$. Monotónnosť vždy uvádzaj po intervaloch.`}
],

"Extrémy (maximum, minimum)":[
  R`**Maximum** funkcie je jej najväčšia hodnota, **minimum** najmenšia. Pri každom extréme sú dve čísla: **kde** nastáva (hodnota $x$) a **aký je** (hodnota $y$).`,
  {cards:[
    {fig:{fns:["-0.7x^2+2"], view:[-3, 3, 3, -3], dots:[[0, 2]]}, t:"Maximum", d:"Najvyšší bod grafu. Okolo neho funkcia najprv rastie, potom klesá."},
    {fig:{fns:["0.7x^2-2"], view:[-3, 3, 3, -3], dots:[[0, -2]]}, t:"Minimum", d:"Najnižší bod grafu. Okolo neho funkcia najprv klesá, potom rastie."},
    {fig:{fns:["0.6x"], view:[-3, 3, 3, -3]}, t:"Žiadny extrém", d:"Priamka na celom $\\mathbb{R}$ rastie donekonečna oboma smermi."}
  ]},
  R`Na uzavretom intervale $\langle a;\ b\rangle$ môže byť extrém aj na jeho kraji, nielen vo vrchole grafu. Preto treba skontrolovať oboje.`,
  {tool:"graf", ask:R`Funkcia je definovaná na intervale $\langle -2;\ \va{b}\rangle$. Posúvaj jeho pravý koniec. Kedy je maximum vo vrchole a kedy na kraji?`,
   take:R`kým je pravý kraj nízko, maximum je vo vrchole $[-1;\ 1]$. Keď hodnota na kraji prerastie 1, maximum sa presunie tam.`,
   cfg:{view:[-4, 6, 4, -4], tick:1, fns:[{f:CUB, dom:[-2, "b"], lhs:"f(x)"}, {f:CUB, color:"axis", dash:true, thin:true, ghost:true}],
     params:{b:{v:1.5, min:-.5, max:2.5, step:.25, color:"a"}},
     show:[{seg:[[-2, 0], ["b", 0]], color:"a", w:5},
       {pt:[P => P.b > 2 ? P.b : -1, P => P.b > 2 ? cub(P.b) : 1], color:"ok", size:6, label:"max", at:"t"},
       {pt:[-2, -1], color:"warn", size:6, label:"min", at:"b"},
       {pt:[1, -1], color:"warn", size:6, label:"min", at:"b", if:P => P.b >= 1},
       {pt:["b", P => cub(P.b)], color:"ink", size:3.5}],
     out:(P, h) => {
       const mx = P.b > 2 ? [P.b, cub(P.b)] : [-1, 1];
       return h.p(R`$D(f) = \langle -2;\ \va{${h.tn(P.b)}}\rangle$`)
         + h.p(R`Maximum $${h.tn(mx[1])}$ v $x = ${h.tn(mx[0])}$${P.b > 2 ? " (pravý kraj)" : P.b === 2 ? " (vrchol aj pravý kraj)" : " (vrchol)"}`)
         + h.p(R`Minimum $-1$ v $x = -2$ (ľavý kraj)${P.b >= 1 ? " a v $x = 1$ (vrchol)" : ""}`);
     }}},
  {steps:[
    {t:"Nájdi vrcholy", d:"Tie, ktoré ležia vnútri intervalu, a vypočítaj v nich hodnoty."},
    {t:"Vypočítaj kraje", d:"Hodnoty $f(a)$ a $f(b)$."},
    {t:"Porovnaj", d:"Najväčšie z týchto čísel je maximum, najmenšie minimum."}
  ]},
  {ex:R`Nájdi najväčšiu a najmenšiu hodnotu funkcie $f(x) = x^2 - 4x + 5$ na intervale $\langle 0;\ 5\rangle$.`,
   steps:[
     ["Vrchol paraboly leží v intervale.", R`x_V = 2,\qquad f(2) = 4 - 8 + 5 = 1`],
     ["Hodnoty na krajoch.", R`f(0) = 5,\qquad f(5) = 25 - 20 + 5 = 10`],
     ["Porovnaj tri čísla: 1, 5, 10.", R`\min = 1,\qquad \max = 10`]
   ],
   res:R`Minimum $1$ pre $x = 2$, maximum $10$ pre $x = 5$.`},
  {warn:R`Na otvorenom intervale extrém nemusí existovať. Funkcia $y = x$ na $(0;\ 1)$ sa k hodnotám 0 a 1 ľubovoľne blíži, ale žiadnu z nich nenadobudne.`}
],

"Ohraničenosť":[
  R`Funkcia je **zhora ohraničená**, ak jej hodnoty nikdy neprekročia nejaké číslo $h$. Je **zdola ohraničená**, ak nikdy neklesnú pod nejaké číslo $d$. Ak platí oboje, je **ohraničená**.`,
  {def:"Ohraničená funkcia", mid:true, tex:R`\vb{d} \leq f(x) \leq \va{h} \quad \text{pre všetky } x \in D(f)`,
   note:"Celý graf leží v páse medzi dvoma vodorovnými priamkami."},
  {tool:"graf", kind:"uloha", ask:R`Nastav priamky $y = \va{h}$ a $y = \vb{d}$ tak, aby celý graf ležal medzi nimi.`,
   hint:"Najvyšší bod grafu je vo výške 4. Nadol sa graf blíži k osi $x$, ale pod ňu nikdy neklesne.",
   goal:P => P.h >= 4 && P.d <= 0,
   cfg:{view:[-6, 6, 6, -3], tick:1, fns:[{f:"4/(x^2+1)", lhs:"f(x)"}],
     params:{h:{v:2, min:0, max:5.5, step:.5, color:"a", note:"horná hranica"}, d:{v:1, min:-2.5, max:3, step:.5, color:"b", note:"dolná hranica"}},
     show:[{hline:"h", color:"a"}, {hline:"d", color:"b"}],
     out:(P, h) => h.p(P.h >= 4 ? "Zhora: graf priamku $y = h$ neprekročí. ✓" : "Zhora: časť grafu je nad priamkou $y = h$.")
       + h.p(P.d <= 0 ? "Zdola: graf pod priamku $y = d$ neklesne. ✓" : "Zdola: časť grafu je pod priamkou $y = d$.")
       + (P.h >= 4 && P.d <= 0 ? h.pill("✓ Funkcia je ohraničená", "ok") : "")}},
  {cards:[
    {fig:{fns:["0.5x^2-1.5"], view:[-3, 3, 3, -3]}, t:"Len zdola", d:"$y = x^2$: hodnoty sú aspoň 0, nahor rastú bez obmedzenia."},
    {fig:{fns:["-0.5x^2+1.5"], view:[-3, 3, 3, -3]}, t:"Len zhora", d:"$y = -x^2$: hodnoty sú najviac 0."},
    {fig:{fns:["3/(x^2+1)-1.2"], view:[-3, 3, 3, -3]}, t:"Ohraničená", d:"Zhora aj zdola."},
    {fig:{fns:["0.25x^3"], view:[-3, 3, 3, -3]}, t:"Neohraničená", d:"$y = x^3$: hodnoty idú do $+\\infty$ aj do $-\\infty$."}
  ]},
  {ex:R`Je funkcia $f(x) = x^2 + 1$ ohraničená?`,
   steps:[
     [R`$x^2 \geq 0$ pre každé $x$, takže hodnoty sú aspoň 1.`, R`f(x) \geq 1 \;\Rightarrow\; \text{zdola ohraničená}`],
     [R`Pre veľké $x$ rastie bez obmedzenia.`, R`\text{zhora nie je ohraničená}`]
   ],
   res:R`Je ohraničená len zdola. Zodpovedá to oboru hodnôt $H(f) = \langle 1;\ \infty)$.`},
  {tip:R`Ohraničenosť prečítaš z oboru hodnôt. Ak je $H(f)$ interval s konečnými koncami, napríklad $\langle -1;\ 1\rangle$, funkcia je ohraničená.`}
],

"Párnosť a nepárnosť":[
  "Niektoré grafy sú súmerné. Podľa typu súmernosti sa funkcia volá párna alebo nepárna.",
  {def:"Párna a nepárna funkcia", mid:true, tex:R`\va{f(-x) = f(x)} \qquad\qquad \vb{f(-x) = -f(x)}`,
   legend:[
     [R`\text{P}`, "a", "párna", "Opačné čísla majú rovnakú hodnotu. Graf je súmerný podľa osi $y$."],
     [R`\text{N}`, "b", "nepárna", "Opačné čísla majú opačné hodnoty. Graf je súmerný podľa počiatku."]
   ]},
  {tool:"graf", ask:R`Posúvaj $x$ a porovnávaj hodnoty v bodoch $x$ a $-x$.`,
   take:R`body sú vždy v rovnakej výške. Graf sa podľa osi $y$ preklopí sám na seba, funkcia je párna.`,
   cfg:{view:[-5, 6, 5, -4], tick:1, fns:[{f:"x^2-2", lhs:"f(x)"}],
     params:{s:{v:2, min:0, max:2.5, step:.25, color:"a", name:"x"}},
     show:[{seg:[["s", "s^2-2"], ["-s", "s^2-2"]], color:"a", dash:true}, {pt:["s", "s^2-2"], color:"a", label:"x", at:"r"}, {pt:["-s", "s^2-2"], color:"a", label:"−x", at:"l"}],
     out:(P, h) => h.calc(R`f(${h.tn(P.s)}) = ${h.tn(P.s * P.s - 2)}`) + h.calc(R`f(${h.tn(-P.s)}) = ${h.tn(P.s * P.s - 2)}`) + h.pill("f(−x) = f(x) · párna", "ok")}},
  {tool:"graf", ask:R`To isté pre inú funkciu. Čo majú spoločné hodnoty v bodoch $x$ a $-x$ teraz?`,
   take:R`hodnoty sú rovnako veľké, ale s opačným znamienkom. Spojnica bodov vždy prechádza počiatkom, funkcia je nepárna.`,
   cfg:{view:[-5, 5, 5, -5], tick:1, fns:[{f:"x^3/4", lhs:"f(x)"}],
     params:{s:{v:2, min:0, max:2.5, step:.25, color:"b", name:"x"}},
     show:[{seg:[["s", "s^3/4"], ["-s", "-s^3/4"]], color:"b", dash:true}, {pt:["s", "s^3/4"], color:"b", label:"x", at:"r"}, {pt:["-s", "-s^3/4"], color:"b", label:"−x", at:"l"}, {pt:[0, 0], color:"soft", size:3}],
     out:(P, h) => h.calc(R`f(${h.tn(P.s)}) = ${h.tn(P.s ** 3 / 4)}`) + h.calc(R`f(${h.tn(-P.s)}) = ${h.tn(-(P.s ** 3) / 4)}`) + h.pill("f(−x) = −f(x) · nepárna", "ok")}},
  {steps:[
    {t:R`Vypočítaj $f(-x)$`, d:"Do predpisu dosaď $-x$ namiesto $x$ a uprav."},
    {t:"Porovnaj", d:R`Vyšlo to isté ako $f(x)$? Párna. Vyšlo $-f(x)$? Nepárna.`},
    {t:"Inak ani jedno", d:"Na vyvrátenie stačí jedna dvojica čísel, pre ktorú to neplatí."}
  ]},
  {ex:R`Je funkcia $f(x) = x^3 - x$ párna, nepárna, alebo ani jedno?`,
   steps:[
     [R`Dosaď $-x$.`, R`f(-x) = (-x)^3 - (-x) = -x^3 + x`],
     [R`Vyber $-1$ pred zátvorku a porovnaj s $f(x)$.`, R`-x^3 + x = -(x^3 - x) = -f(x)`]
   ],
   res:"Funkcia je **nepárna**."},
  {ex:R`A funkcia $g(x) = x^2 + x$?`,
   steps:[
     [R`Dosaď $-x$.`, R`g(-x) = x^2 - x`],
     [R`To nie je $g(x)$ ani $-g(x)$. Over na číslach.`, R`g(1) = 2,\qquad g(-1) = 0`]
   ],
   res:"**Ani párna, ani nepárna.**"},
  {warn:"Väčšina funkcií nie je ani párna, ani nepárna. „Ani jedno“ je bežná správna odpoveď, nie chyba."},
  {tip:R`Mnohočlen, ktorý má len párne mocniny $x$ (a prípadne konštantu), je párny. Ak má len nepárne mocniny, je nepárny. Odtiaľ tie názvy.`}
],

"Periodičnosť":[
  R`Funkcia je **periodická**, ak sa jej hodnoty pravidelne opakujú. Existuje číslo $p > 0$, o ktoré môžeš $x$ posunúť a hodnota sa nezmení. Najmenšie také $p$ sa volá **perióda**.`,
  {def:"Periodická funkcia", mid:true, tex:R`f(x + \va{p}) = f(x) \quad \text{pre všetky } x \in D(f)`},
  {tool:"graf", ask:R`Posúvaj $x$. Čo majú spoločné tri vyznačené body?`,
   take:R`body vzdialené o 4 sú vždy v rovnakej výške. Graf sa opakuje po úsekoch dĺžky 4, to je perióda.`,
   cfg:{view:[-7, 4, 7, -4], tick:1, fns:[{f:WAVE, lhs:"f(x)"}],
     params:{s:{v:.5, min:-2, max:2, step:.25, color:"a", name:"x"}},
     show:[{seg:[["s-4", P => wave(P.s)], ["s+4", P => wave(P.s)]], color:"a", dash:true},
       {pt:["s-4", P => wave(P.s)], color:"a", label:"x − 4", at:"t"}, {pt:["s", P => wave(P.s)], color:"a", label:"x", at:"t"}, {pt:["s+4", P => wave(P.s)], color:"a", label:"x + 4", at:"t"}],
     out:(P, h) => h.calc(R`f(${h.tn(P.s - 4)}) = f(${h.tn(P.s)}) = f(${h.tn(P.s + 4)}) = ${h.tn(wave(P.s))}`) + h.p(R`Perióda $\va{p = 4}$`)}},
  {tool:"graf", kind:"uloha", ask:R`Modrá čiarkovaná krivka je kópia grafu posunutá o $\va{p}$. Nájdi najmenší kladný posun, pri ktorom kópia presne zakryje pôvodný graf.`,
   hint:"Sleduj dva susedné vrcholy grafu. Vzdialenosť medzi nimi je perióda.",
   goal:P => P.p === 3,
   cfg:{view:[-7, 3, 7, -3], tick:1, fns:[{f:"1.5sin(2pi*x/3)", lhs:"f(x)"}, {f:"1.5sin(2pi*(x-p)/3)", color:"c", dash:true, ghost:true}],
     params:{p:{v:1, min:.5, max:5, step:.5, color:"a", note:"posun"}},
     out:(P, h) => h.p(R`Posun $\va{p = ${h.tn(P.p)}}$`) + (P.p === 3 ? h.pill("✓ Grafy sa kryjú · perióda je 3", "ok") : h.p("Kópia leží inde než pôvodný graf."))}},
  {ex:R`Funkcia $f$ má periódu 4 a platí $f(1) = 3$. Urč $f(9)$ a $f(-3)$.`,
   steps:[
     [R`Od 1 po 9 sú to dve celé periódy.`, R`f(9) = f(1 + 2 \cdot 4) = f(1) = 3`],
     [R`Od 1 po $-3$ je to jedna perióda späť.`, R`f(-3) = f(1 - 4) = f(1) = 3`]
   ],
   res:R`$f(9) = 3$ aj $f(-3) = 3$.`},
  {tip:"Z bežných funkcií sú periodické goniometrické: sínus a kosínus s periódou $2\\pi$, tangens s periódou $\\pi$. Viac v téme [[b9]]."}
]

  }
};
})();

/* Objem a povrch rotačných telies: valec, kužeľ, guľa */
(() => {
const L = v => ({v, lock:true});

THEORY.a37 = {
  mins:30,
  brief:[
    R`Valec: $V = \pi r^2 v$, $S = 2\pi r^2 + 2\pi r v$.`,
    R`Kužeľ: $V = \frac{1}{3}\pi r^2 v$, $S = \pi r^2 + \pi r s$, strana $s = \sqrt{r^2 + v^2}$.`,
    R`Guľa: $V = \frac{4}{3}\pi r^3$, $S = 4\pi r^2$.`,
    R`Ak sa všetky rozmery zväčšia $k$-krát, povrch sa zväčší $k^2$-krát a objem $k^3$-krát.`
  ],
  subs:{

"Valec":[
  R`**Valec** je „okrúhly hranol“: podstavy sú kruhy, objem je opäť podstava krát výška. Plášť rozvinutý do roviny je obdĺžnik, ktorého jedna strana je obvod podstavy $2\pi r$.`,
  {def:"Valec", tex:R`V = \pi \va{r}^2 \vb{v},\qquad S = 2\pi \va{r}^2 + 2\pi \va{r}\vb{v} = 2\pi \va{r}(\va{r} + \vb{v})`},
  {tool:"telesa", ask:R`Meň polomer a výšku a prepni na sieť. Aký rozmer má obdĺžnik plášťa?`,
   take:R`$2\pi r \times v$. Valec sa dá rozstrihnúť na dva kruhy a jeden obdĺžnik.`,
   cfg:{typ:"valec", toggles:["siet"]}},
  {ex:R`Vypočítaj objem a povrch valca s polomerom 3 cm a výškou 5 cm.`,
   steps:[
     ["Objem.", R`V = \pi \cdot 9 \cdot 5 = 45\pi \doteq 141{,}37`],
     ["Povrch.", R`S = 2\pi \cdot 9 + 2\pi \cdot 3 \cdot 5 = 48\pi \doteq 150{,}80`]
   ],
   res:R`$V \doteq 141{,}37$ cm³, $S \doteq 150{,}80$ cm².`},
  {tool:"telesa", kind:"uloha", ask:R`Valec má polomer 3. Nastav výšku $\vb{v}$ tak, aby mal objem $36\pi$.`,
   hint:R`$9\pi v = 36\pi$.`,
   goal:P => P.v === 4,
   cfg:{typ:"valec", r:L(3), v:{v:2}}},
  {warn:R`V objeme je $r^2$, v plášti len $r$. A priemer nie je polomer: valec s priemerom 6 má $r = 3$.`}
],

"Kužeľ":[
  R`**Kužeľ** je „okrúhly ihlan“: objem je tretina objemu valca s rovnakou podstavou a výškou. Úsečka z vrcholu na okraj podstavy je **strana** $s$, plášť sa rozvinie do kruhového výseku s polomerom $s$.`,
  {def:"Kužeľ", tex:R`V = \frac{1}{3}\pi \va{r}^2 \vb{v},\qquad S = \pi \va{r}^2 + \pi \va{r} s,\qquad s = \sqrt{\va{r}^2 + \vb{v}^2}`},
  {tool:"telesa", ask:R`Meň polomer a výšku kužeľa a pozri sieť. Aký útvar je plášť?`,
   take:R`kruhový výsek s polomerom $s$, ktorého oblúk má dĺžku obvodu podstavy $2\pi r$.`,
   cfg:{typ:"kuzel", toggles:["siet"]}},
  {ex:R`Kužeľ má polomer 3 cm a výšku 4 cm. Vypočítaj stranu, objem a povrch.`,
   steps:[
     ["Strana.", R`s = \sqrt{9 + 16} = 5`],
     ["Objem.", R`V = \tfrac{1}{3}\pi \cdot 9 \cdot 4 = 12\pi \doteq 37{,}70`],
     ["Povrch.", R`S = 9\pi + 15\pi = 24\pi \doteq 75{,}40`]
   ],
   res:R`$s = 5$ cm, $V \doteq 37{,}70$ cm³, $S \doteq 75{,}40$ cm².`},
  {tool:"telesa", kind:"uloha", ask:R`Kužeľ má polomer 3. Nastav výšku $\vb{v}$ tak, aby mala strana dĺžku 5.`,
   hint:R`$s^2 = r^2 + v^2$.`,
   goal:P => P.v === 4,
   cfg:{typ:"kuzel", r:L(3), v:{v:2}}},
  {warn:R`Do plášťa patrí strana $s$, nie výška $v$. Výška stojí kolmo vnútri kužeľa, strana leží na jeho povrchu.`}
],

"Guľa":[
  R`**Guľa** je množina bodov, ktoré majú od stredu vzdialenosť najviac $r$. Jej povrch (guľová plocha) je presne štyri obsahy hlavného kruhu.`,
  {def:"Guľa", tex:R`V = \frac{4}{3}\pi \va{r}^3,\qquad S = 4\pi \va{r}^2`},
  {tool:"telesa", ask:R`Meň polomer gule. Pri akom polomere majú objem a povrch rovnakú číselnú hodnotu?`,
   take:R`pri $r = 3$: $V = 36\pi$ aj $S = 36\pi$. Pri väčšom polomere rastie objem rýchlejšie, lebo závisí od $r^3$.`,
   cfg:{typ:"gula"}},
  {ex:R`Guľa má objem $288\pi$ cm³. Aký má polomer a povrch?`,
   steps:[
     ["Z objemu.", R`\tfrac{4}{3}\pi r^3 = 288\pi \;\Rightarrow\; r^3 = 216 \;\Rightarrow\; r = 6`],
     ["Povrch.", R`S = 4\pi \cdot 36 = 144\pi \doteq 452{,}39`]
   ],
   res:R`$r = 6$ cm, $S = 144\pi \doteq 452{,}39$ cm².`},
  {tool:"telesa", kind:"uloha", ask:R`Nastav polomer gule tak, aby mali objem a povrch rovnakú číselnú hodnotu.`,
   hint:R`$\frac{4}{3}\pi r^3 = 4\pi r^2$.`,
   goal:P => P.r === 3,
   cfg:{typ:"gula", r:{v:2}}},
  {warn:R`$V = \frac{4}{3}\pi r^3$, nie $\frac{4}{3}\pi r^2$. Kontrola jednotkami: objem je v cm³, preto tretia mocnina.`}
],

"Zmena objemu pri zmene rozmerov":[
  R`Ak sa zmení len jeden rozmer, stačí pozrieť, s akou mocninou je vo vzorci. Ak sa zväčšia všetky rozmery rovnako ($k$-krát), teleso je podobné pôvodnému a platí: dĺžky $\cdot k$, povrch $\cdot k^2$, objem $\cdot k^3$ ([[b27]]).`,
  {def:"Podobné telesá", tex:R`S' = k^2 S,\qquad V' = k^3 V`},
  {tool:"telesa", ask:R`Valec. Zdvojnásob polomer a nechaj výšku. Koľkokrát sa zväčší objem? A keď zdvojnásobíš len výšku?`,
   take:R`pri dvojnásobnom polomere štyrikrát ($r^2$), pri dvojnásobnej výške dvakrát. Polomer ovplyvňuje objem viac.`,
   cfg:{typ:"valec", r:{v:2}, v:{v:3}}},
  {ex:R`Ako sa zmení objem a) gule, keď zdvojnásobíme polomer; b) valca, keď polomer zmenšíme na polovicu a výšku zdvojnásobíme?`,
   steps:[
     ["a) Objem závisí od $r^3$.", R`2^3 = 8`],
     ["b) Polomer v druhej mocnine, výška v prvej.", R`\left(\tfrac{1}{2}\right)^2 \cdot 2 = \tfrac{1}{2}`]
   ],
   res:"a) osemkrát väčší, b) polovičný."},
  {tool:"telesa", kind:"uloha", ask:R`Valec s polomerom 4 a výškou 1 má objem $16\pi$. Valec s polomerom 2 má mať rovnaký objem. Nastav jeho výšku.`,
   hint:R`$4\pi v = 16\pi$.`,
   goal:P => P.v === 4,
   cfg:{typ:"valec", r:L(2), v:{v:1}}},
  {warn:R`Dvojnásobné rozmery neznamenajú dvojnásobný objem. Guľa s dvojnásobným priemerom má osemkrát väčší objem.`}
]

  }
};
})();

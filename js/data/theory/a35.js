/* Štvoruholníky a mnohouholníky */
/* TOOL-TODO: the kite (deltoid) is text only; utvary has no typ "deltoid". Add the visual when the tool or option exists (see CLAUDE.md). */
(() => {
const L = v => ({v, lock:true});

THEORY.a35 = {
  mins:30,
  brief:[
    R`Rovnobežník: protiľahlé strany rovnobežné a zhodné, uhlopriečky sa rozpoľujú. Obdĺžnik má zhodné uhlopriečky, kosoštvorec kolmé, štvorec oboje.`,
    R`Lichobežník má jednu dvojicu rovnobežných strán, stredná priečka $\frac{a + c}{2}$. Deltoid má kolmé uhlopriečky, $S = \frac{ef}{2}$.`,
    R`Pravidelný šesťuholník sa skladá zo šiestich rovnostranných trojuholníkov, polomer opísanej kružnice je $a$.`,
    R`$n$-uholník: súčet vnútorných uhlov $(n - 2) \cdot 180^\circ$, počet uhlopriečok $\frac{n(n - 3)}{2}$.`
  ],
  subs:{

"Rovnobežníky (štvorec, obdĺžnik, kosoštvorec)":[
  R`**Rovnobežník** má obe dvojice protiľahlých strán rovnobežné. Z toho vyplýva, že sú aj zhodné, protiľahlé uhly sú zhodné a uhlopriečky sa navzájom rozpoľujú. Obdĺžnik, kosoštvorec a štvorec sú jeho špeciálne prípady.`,
  {cards:[
    {t:"Obdĺžnik", d:"Všetky uhly pravé. Uhlopriečky sú zhodné."},
    {t:"Kosoštvorec", d:"Všetky strany zhodné. Uhlopriečky sú kolmé a rozpoľujú uhly."},
    {t:"Štvorec", d:"Obdĺžnik aj kosoštvorec zároveň: uhlopriečky zhodné aj kolmé, $u = a\\sqrt{2}$."}
  ]},
  {tool:"utvary", ask:R`Rovnobežník. Meň uhol $\vd{\alpha}$ a strany. Pri akom uhle sa z neho stane obdĺžnik?`,
   take:R`pri $90^\circ$. Kosoštvorec vznikne, keď sú strany rovnaké, štvorec, keď platí oboje.`,
   cfg:{typ:"rovnobeznik"}},
  {ex:R`Obdĺžnik má strany 8 a 6. Kosoštvorec má stranu 10 a jednu uhlopriečku 12. Vypočítaj uhlopriečku obdĺžnika a druhú uhlopriečku kosoštvorca.`,
   steps:[
     ["Obdĺžnik: Pytagorova veta.", R`u = \sqrt{64 + 36} = 10`],
     ["Kosoštvorec: uhlopriečky sa rozpoľujú a sú kolmé.", R`\tfrac{f}{2} = \sqrt{10^2 - 6^2} = 8 \;\Rightarrow\; f = 16`]
   ],
   res:"$10$ a $16$."},
  {tool:"utvary", kind:"uloha", ask:R`Nastav uhol rovnobežníka $\vd{\alpha}$ tak, aby vznikol obdĺžnik.`,
   hint:"Obdĺžnik má všetky uhly pravé.",
   goal:P => P.uhol === 90,
   cfg:{typ:"rovnobeznik", uhol:{v:50}, lock:["a", "b"]}},
  {warn:R`Každý štvorec je obdĺžnik aj kosoštvorec, ale nie naopak. Uhlopriečky kosoštvorca sú kolmé, no zhodné nie sú (okrem štvorca).`}
],

"Lichobežník a deltoid":[
  R`**Lichobežník** má práve jednu dvojicu rovnobežných strán, **základne** $a$ a $c$. Ostatné dve strany sú **ramená**. Ak sú ramená zhodné, je **rovnoramenný**: má os súmernosti a zhodné uhly pri základni.`,
  {def:"Stredná priečka lichobežníka", tex:R`s = \frac{a + c}{2},\qquad S = s \cdot v`},
  {tool:"utvary", ask:R`Lichobežník. Posúvaj hornú základňu. Kedy je rovnoramenný?`,
   take:R`keď je horná základňa presne v strede nad dolnou, posun je $\frac{a - c}{2}$. Obsah sa posunom nemení.`,
   cfg:{typ:"lichobeznik", lock:["a", "c", "v"]}},
  {ex:R`Rovnoramenný lichobežník má základne 10 a 4 a ramená 5. Vypočítaj výšku a obsah.`,
   steps:[
     ["Rameno, výška a presah tvoria pravouhlý trojuholník. Presah na každej strane:", R`\frac{10 - 4}{2} = 3`],
     ["Výška.", R`v = \sqrt{25 - 9} = 4`],
     ["Obsah.", R`S = \frac{(10 + 4) \cdot 4}{2} = 28`]
   ],
   res:R`$v = 4$, $S = 28$.`},
  R`**Deltoid** má dve dvojice susedných zhodných strán (tvar šarkana). Jeho uhlopriečky sú kolmé, jedna z nich je osou súmernosti. Obsah sa preto počíta ako pri kosoštvorci: $S = \frac{ef}{2}$.`,
  {tool:"utvary", kind:"uloha", ask:R`Lichobežník so základňami 8 a 4. Nastav posun hornej základne tak, aby bol rovnoramenný.`,
   hint:R`Na každej strane musí horná základňa „chýbať“ rovnako: $\frac{8 - 4}{2}$.`,
   goal:P => P.posun === 2,
   cfg:{typ:"lichobeznik", a:L(8), c:L(4), v:L(4), posun:{v:0}}},
  {warn:R`Stredná priečka je priemer základní $\frac{a + c}{2}$, nie ich súčet. A výška lichobežníka nie je dĺžka ramena, pokiaľ rameno nie je kolmé na základne.`}
],

"Pravidelné mnohouholníky":[
  R`**Pravidelný** mnohouholník má všetky strany aj všetky uhly zhodné. Dá sa mu opísať aj vpísať kružnica so spoločným stredom. Spojnice stredu s vrcholmi ho rozdelia na $n$ zhodných rovnoramenných trojuholníkov.`,
  {def:"Pravidelný šesťuholník", tex:R`r = a,\qquad S = 6 \cdot \frac{a^2\sqrt{3}}{4} = \frac{3a^2\sqrt{3}}{2}`},
  {tool:"utvary", ask:R`Meň počet strán $n$. Pri ktorom $n$ sa polomer opísanej kružnice rovná strane?`,
   take:R`pri šesťuholníku: stredový uhol je $60^\circ$, trojuholníky sú rovnostranné. S rastúcim $n$ sa mnohouholník blíži ku kruhu.`,
   cfg:{typ:"mnohouholnik", lock:["a"]}},
  {ex:R`Vypočítaj obvod a obsah pravidelného šesťuholníka so stranou 4 cm.`,
   steps:[
     ["Obvod.", R`o = 6 \cdot 4 = 24`],
     ["Šesť rovnostranných trojuholníkov.", R`S = 6 \cdot \frac{16\sqrt{3}}{4} = 24\sqrt{3} \doteq 41{,}57`]
   ],
   res:R`$o = 24$ cm, $S \doteq 41{,}57$ cm².`},
  {ex:R`Do kružnice s polomerom 5 je vpísaný štvorec. Aká je jeho strana?`,
   steps:[["Uhlopriečka štvorca je priemer kružnice.", R`a\sqrt{2} = 10 \;\Rightarrow\; a = \frac{10}{\sqrt{2}} = 5\sqrt{2} \doteq 7{,}07`]],
   res:R`$5\sqrt{2}$`},
  {tool:"utvary", kind:"uloha", ask:R`Nastav počet strán tak, aby bol polomer opísanej kružnice rovný strane.`,
   hint:"Rovnostranné trojuholníky okolo stredu: stredový uhol $60^\\circ$.",
   goal:P => P.n === 6,
   cfg:{typ:"mnohouholnik", n:{v:4}, lock:["a"]}},
  {warn:R`Polomer opísanej kružnice sa rovná strane len pri šesťuholníku. Pri štvorci je $r = \frac{a\sqrt{2}}{2}$, pri rovnostrannom trojuholníku $r = \frac{a\sqrt{3}}{3}$.`}
],

"Súčet vnútorných uhlov":[
  R`Z jedného vrcholu $n$-uholníka vedie $n - 3$ uhlopriečok a rozdelia ho na $n - 2$ trojuholníkov ([[a27]]). Každý vrchol má $n - 3$ uhlopriečok, každá sa však započíta dvakrát.`,
  {def:"Mnohouholník", tex:R`\text{súčet uhlov} = (n - 2) \cdot 180^\circ,\qquad \text{uhlopriečky} = \frac{n(n - 3)}{2}`, note:R`Vonkajšie uhly konvexného mnohouholníka majú súčet $360^\circ$.`},
  {tool:"utvary", ask:R`Meň $n$ a sleduj vnútorný uhol a počet uhlopriečok.`,
   take:R`uhol rastie a blíži sa k $180^\circ$, počet uhlopriečok rastie rýchlo, približne s $n^2$.`,
   cfg:{typ:"mnohouholnik", lock:["a"]}},
  {ex:R`Desaťuholník: súčet uhlov, uhol pravidelného desaťuholníka a počet uhlopriečok.`,
   steps:[
     ["Súčet.", R`8 \cdot 180^\circ = 1\,440^\circ`],
     ["Jeden uhol.", R`1\,440^\circ : 10 = 144^\circ`],
     ["Uhlopriečky.", R`\frac{10 \cdot 7}{2} = 35`]
   ],
   res:R`$1\,440^\circ$, $144^\circ$, 35 uhlopriečok.`},
  {ex:R`Ktorý pravidelný mnohouholník má vnútorný uhol $150^\circ$?`,
   steps:[
     [R`Vonkajší uhol $30^\circ$, vonkajšie uhly majú súčet $360^\circ$.`, R`n = \frac{360^\circ}{30^\circ} = 12`]
   ],
   res:"Dvanásťuholník."},
  {tool:"utvary", kind:"uloha", ask:R`Nastav počet strán tak, aby mal mnohouholník 20 uhlopriečok.`,
   hint:R`$\frac{n(n - 3)}{2} = 20$, teda $n(n - 3) = 40$.`,
   goal:P => P.n === 8,
   cfg:{typ:"mnohouholnik", n:{v:5}, lock:["a"]}},
  {warn:R`Počet uhlopriečok nie je $n(n - 3)$: každá uhlopriečka spája dva vrcholy a bola by započítaná dvakrát. Preto delenie dvoma.`}
]

  }
};
})();

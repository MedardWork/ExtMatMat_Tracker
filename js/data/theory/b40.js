/* Modus, medián, stredná hodnota, aritmetický priemer */
(() => {
const sumTex = (h, s) => s.sorted.map(v => h.tn(v)).join(" + ");

THEORY.b40 = {
  mins:18,
  brief:[
    R`**Aritmetický priemer** $\va{\bar{x}}$: súčet hodnôt delený ich počtom. Citlivý na odľahlé hodnoty.`,
    R`**Vážený priemer**: každú hodnotu vynásob jej váhou (alebo početnosťou), sčítaj a vydeľ súčtom váh.`,
    R`**Medián**: prostredná hodnota **zoradeného** súboru. Pri párnom počte priemer dvoch prostredných. Odolný voči odľahlým hodnotám.`,
    R`**Modus**: najčastejšia hodnota. Môže ich byť viac a funguje aj pre nečíselné údaje.`
  ],
  subs:{

"Aritmetický a vážený priemer":[
  "Aritmetický priemer je jedno číslo, ktoré zastúpi celý súbor: sčítaš všetky hodnoty a vydelíš ich počtom.",
  {def:"Aritmetický priemer", mid:true, tex:R`\va{\bar{x}} = \dfrac{x_1 + x_2 + \dots + x_n}{n}`,
   note:R`$n$ je počet hodnôt.`},
  {tool:"statistika", ask:"Ťahaj bodky po osi. Predstav si os ako hojdačku: trojuholník ukazuje miesto, kde by zostala v rovnováhe.",
   take:"priemer zareaguje na posun ktorejkoľvek hodnoty. Čím ďalej bodku odtiahneš, tým viac ho potiahne.",
   cfg:{data:[2, 4, 4, 5, 10], min:0, max:12, on:{mean:true},
     out:(P, h) => h.calc(R`\va{\bar{x}} = \dfrac{${sumTex(h, h.stat)}}{${h.stat.n}} = \dfrac{${h.tn(h.stat.sum)}}{${h.stat.n}} = \va{${h.tn(h.stat.mean)}}`)}},
  R`Zo vzorca vyplýva užitočný obrat: **súčet = priemer · počet**. Hodí sa vždy, keď poznáš priemer a hľadáš chýbajúcu hodnotu.`,
  {ex:"Zo štyroch písomiek máš 62, 70, 81 a 75 bodov. Koľko bodov potrebuješ z piatej, aby bol tvoj priemer presne 75?",
   steps:[
     ["Aký musí byť súčet piatich písomiek?", R`75 \cdot 5 = 375`],
     ["Koľko máš zatiaľ?", R`62 + 70 + 81 + 75 = 288`],
     ["Rozdiel je to, čo potrebuješ.", R`375 - 288 = 87`]
   ],
   res:"Z piatej písomky treba **87 bodov**."},
  {tool:"statistika", kind:"uloha", ask:"Štyri hodnoty sú dané. Posuň zvýraznenú bodku tak, aby bol priemer všetkých piatich presne 6.",
   hint:"Päť hodnôt s priemerom 6 má súčet 30. Štyri dané majú súčet 20.",
   goal:(P, st) => Math.abs(statOf(st.data).mean - 6) < 1e-9,
   cfg:{data:[3, 5, 6, 6, 2], min:0, max:12, drag:[4], on:{mean:true},
     out:(P, h) => h.calc(R`\va{\bar{x}} = \dfrac{${h.tn(h.stat.sum)}}{5} = \va{${h.tn(h.stat.mean)}}`)
       + (Math.abs(h.stat.mean - 6) < 1e-9 ? h.pill("✓ Priemer je 6", "ok") : h.p(`Súčet je teraz ${h.n(h.stat.sum)}.`))}},

  {h:"Vážený priemer"},
  "Nie všetky hodnoty musia mať rovnakú dôležitosť. Veľká písomka zaváži viac ako domáca úloha. Vtedy každú hodnotu vynásobíš jej **váhou** a delíš súčtom váh.",
  {def:"Vážený priemer", mid:true, tex:R`\va{\bar{x}} = \dfrac{\vd{w_1}x_1 + \vd{w_2}x_2 + \dots + \vd{w_n}x_n}{\vd{w_1} + \vd{w_2} + \dots + \vd{w_n}}`,
   note:R`$\vd{w_1}, \vd{w_2}, \dots$ sú váhy hodnôt.`},
  {tool:"statistika", ask:"Máš tri známky: 1 z domácej úlohy, 2 z ústnej odpovede a 4 z písomky. Meň ich váhy. Ktorá známka ťahá priemer najviac?",
   take:"váha hovorí, koľkokrát sa hodnota započíta. Známka s váhou 3 sa správa ako tri rovnaké známky.",
   cfg:{min:1, max:5, on:{mean:true},
     params:{w1:{v:1, min:0, max:5, step:1, color:"d", name:"váha", note:"známka 1", plain:true},
             w2:{v:2, min:0, max:5, step:1, color:"d", name:"váha", note:"známka 2", plain:true},
             w4:{v:3, min:0, max:5, step:1, color:"d", name:"váha", note:"známka 4", plain:true}},
     dataFn:P => [...Array(P.w1).fill(1), ...Array(P.w2).fill(2), ...Array(P.w4).fill(4)],
     out:(P, h) => {
       const w = P.w1 + P.w2 + P.w4;
       if(!w) return h.p("Aspoň jedna váha musí byť väčšia ako nula.");
       return h.calc(R`\va{\bar{x}} = \dfrac{\vd{${P.w1}} \cdot 1 + \vd{${P.w2}} \cdot 2 + \vd{${P.w4}} \cdot 4}{\vd{${P.w1}} + \vd{${P.w2}} + \vd{${P.w4}}}`)
         + h.calc(R`= \dfrac{${P.w1 + 2 * P.w2 + 4 * P.w4}}{${w}} = \va{${h.tn((P.w1 + 2 * P.w2 + 4 * P.w4) / w)}}`);
     }}},
  R`Rovnako počítaš priemer z tabuľky početností. Váhou je tam počet, koľkokrát sa hodnota vyskytla.`,
  {ex:"V triede dopadla písomka takto: jednotku má 5 žiakov, dvojku 8, trojku 6 a štvorku 1. Aká je priemerná známka?",
   steps:[
     ["Každú známku vynásob počtom žiakov a sčítaj.", R`5 \cdot 1 + 8 \cdot 2 + 6 \cdot 3 + 1 \cdot 4 = 5 + 16 + 18 + 4 = 43`],
     ["Vydeľ počtom žiakov.", R`5 + 8 + 6 + 1 = 20,\qquad \bar{x} = \dfrac{43}{20} = 2{,}15`]
   ],
   res:"Priemerná známka je **2,15**."},
  {warn:R`Priemer dvoch priemerov nie je celkový priemer, ak sú skupiny rôzne veľké. Trieda s 10 žiakmi a priemerom 2 a trieda s 30 žiakmi a priemerom 3 majú spolu priemer $\dfrac{10 \cdot 2 + 30 \cdot 3}{40} = 2{,}75$, nie $2{,}5$.`}
],

"Medián":[
  R`**Medián** je hodnota presne v strede súboru zoradeného podľa veľkosti. Polovica hodnôt je menšia alebo rovnaká, polovica väčšia alebo rovnaká.`,
  {steps:[
    {t:"Zoraď hodnoty", d:"Od najmenšej po najväčšiu. Opakované hodnoty vypíš toľkokrát, koľkokrát sa vyskytujú."},
    {t:"Nepárny počet", d:"Medián je prostredná hodnota.", tex:R`\text{poradie } \dfrac{n + 1}{2}`},
    {t:"Párny počet", d:"Medián je priemer dvoch prostredných hodnôt.", tex:R`\text{poradia } \dfrac{n}{2} \text{ a } \dfrac{n}{2} + 1`}
  ]},
  {tool:"statistika", ask:"Súbor má 5 hodnôt. Pridaj šiestu tlačidlom a sleduj, ako sa medián určí pri párnom počte. Potom bodky poťahaj.",
   take:"pri nepárnom počte je medián jedna z hodnôt. Pri párnom leží v strede medzi dvoma prostrednými a nemusí byť hodnotou zo súboru.",
   cfg:{data:[2, 3, 5, 6, 9], min:0, max:10, on:{median:true}, edit:true,
     out:(P, h) => {
       const s = h.stat, row = s.sorted.map((v, i) => s.mid.includes(i) ? `<b class="vb">${h.n(v)}</b>` : h.n(v)).join(", ");
       return `<div>Zoradené: ${row}</div>` + h.p(`Počet hodnôt: ${s.n} (${s.n % 2 ? "nepárny" : "párny"})`)
         + (s.n % 2 ? h.calc(R`\text{medián} = \vb{${h.tn(s.median)}}`)
           : h.calc(R`\text{medián} = \dfrac{${h.tn(s.sorted[s.mid[0]])} + ${h.tn(s.sorted[s.mid[1]])}}{2} = \vb{${h.tn(s.median)}}`));
     }}},
  {ex:"Urč medián súboru 7, 3, 9, 4, 4, 10.",
   steps:[
     ["Zoraď.", R`3,\ 4,\ 4,\ 7,\ 9,\ 10`],
     ["Hodnôt je 6, teda párny počet. Prostredné sú tretia a štvrtá.", R`4 \ \text{a}\ 7`],
     ["Medián je ich priemer.", R`\dfrac{4 + 7}{2} = 5{,}5`]
   ],
   res:"Medián je **5,5**."},
  {warn:"Najčastejšia chyba je zabudnúť hodnoty zoradiť a vziať prostrednú tak, ako sú napísané v zadaní."},

  {h:"Prečo nestačí priemer"},
  "Medián sa pozerá len na poradie hodnôt, nie na to, aké sú veľké. Preto ho jedna extrémna hodnota nepohne.",
  {tool:"statistika", ask:"Odtiahni zvýraznenú bodku ďaleko doprava. Čo sa pohne a čo zostane na mieste?",
   take:"priemer ide za odľahlou hodnotou, medián sa nepohne. Preto sa pri platoch alebo cenách bytov uvádza medián.",
   cfg:{data:[3, 4, 4, 5, 5, 6, 7], min:0, max:30, drag:[6], on:{mean:true, median:true},
     out:(P, h) => {
       const s = h.stat, below = s.sorted.filter(v => v < s.mean).length;
       return h.p(R`Priemer $\va{${h.tn(s.mean)}}$, medián $\vb{${h.tn(s.median)}}$`)
         + h.p(`Pod priemerom je ${below} zo ${s.n} hodnôt.`);
     }}},
  {ex:"V tabuľke početností z minulej podtémy (jednotka 5×, dvojka 8×, trojka 6×, štvorka 1×) urč medián známok.",
   steps:[
     ["Hodnôt je 20, prostredné sú desiata a jedenásta.", R`\dfrac{20}{2} = 10 \ \text{a}\ 11`],
     ["Prvých 5 miest sú jednotky, miesta 6 až 13 sú dvojky.", R`10.\ \text{a}\ 11.\ \text{hodnota sú dvojky}`]
   ],
   res:"Medián je **2**."}
],

"Modus":[
  R`**Modus** je hodnota, ktorá sa v súbore vyskytuje najčastejšie. Nič sa pri ňom nepočíta, stačí spočítať výskyty.`,
  {tool:"statistika", ask:"Ťahaj bodky a pozoruj, ktorý stĺpec je najvyšší. Čo sa stane, keď sú dva stĺpce rovnako vysoké?",
   take:"modus je najvyšší stĺpec. Súbor môže mať aj dva alebo viac modusov naraz.",
   cfg:{data:[1, 2, 2, 3, 3, 3, 4, 5], min:1, max:6, on:{mode:true},
     out:(P, h) => {
       const s = h.stat;
       return `<div>Zoradené: ${s.sorted.map(v => h.n(v)).join(", ")}</div>`
         + h.p(s.modes.length ? R`Modus: $\vd{${s.modes.map(v => h.tn(v)).join(";\ ")}}$ (${s.top}-krát)` : "Žiadna hodnota nie je častejšia než ostatné, modus sa neurčuje.");
     }}},
  {cards:[
    {t:"Jeden modus", d:"Jedna hodnota je častejšia než všetky ostatné."},
    {t:"Viac modusov", d:"Dve alebo viac hodnôt má rovnaký najvyšší počet výskytov."},
    {t:"Žiadny modus", d:"Všetky hodnoty sa vyskytujú rovnako často, žiadna nevyčnieva."}
  ]},
  {tool:"statistika", kind:"uloha", ask:"Presuň bodky tak, aby mal súbor práve dva modusy.",
   hint:"Potrebuješ dva rovnako vysoké stĺpce, ktoré sú vyššie než všetky ostatné.",
   goal:(P, st) => statOf(st.data).modes.length === 2,
   cfg:{data:[1, 2, 2, 3, 3, 3, 4, 5], min:1, max:6, on:{mode:true},
     out:(P, h) => {
       const s = h.stat;
       return h.p(s.modes.length ? R`Modusy: $\vd{${s.modes.map(v => h.tn(v)).join(";\ ")}}$` : "Teraz súbor nemá žiadny modus.")
         + (s.modes.length === 2 ? h.pill("✓ Dva modusy", "ok") : "");
     }}},
  {ex:"Obchod predal za deň topánky veľkostí 38, 39, 39, 40, 40, 40, 41, 42. Ktorú veľkosť má objednať vo väčšom množstve?",
   steps:[
     ["Spočítaj výskyty.", R`38{:}\ 1\times,\quad 39{:}\ 2\times,\quad 40{:}\ 3\times,\quad 41{:}\ 1\times,\quad 42{:}\ 1\times`],
     ["Najčastejšia hodnota je modus.", R`\text{modus} = 40`]
   ],
   res:"Veľkosť **40**. Priemerná veľkosť 39,9 by obchodu nepomohla, taká topánka neexistuje."},
  {tip:"Modus je jediná z týchto troch charakteristík, ktorá funguje aj pre nečíselné údaje: najčastejšia farba auta, najobľúbenejší predmet, najčastejšie meno."},

  {h:"Tri pohľady na ten istý súbor"},
  {cards:[
    {t:R`Priemer $\va{\bar{x}}$`, d:"Používa všetky hodnoty. Jedna odľahlá ho výrazne posunie."},
    {t:R`Medián`, d:"Závisí len od poradia. Odľahlé hodnoty ho nepohnú."},
    {t:R`Modus`, d:"Najčastejšia hodnota. Funguje aj pre slová, môže ich byť viac."}
  ]},
  {tool:"statistika", kind:"uloha", ask:"Všetky tri charakteristiky sú zapnuté. Presuň bodky tak, aby bol priemer väčší ako medián aspoň o 2.",
   hint:"Nechaj väčšinu hodnôt vľavo pri sebe a jednu alebo dve odtiahni ďaleko doprava.",
   goal:(P, st) => { const s = statOf(st.data); return s.mean - s.median >= 2; },
   cfg:{data:[3, 4, 4, 5, 6, 6, 7], min:0, max:20, on:{mean:true, median:true, mode:true}, toggles:["mean", "median", "mode"],
     out:(P, h) => {
       const s = h.stat;
       return h.p(R`Priemer $\va{${h.tn(s.mean)}}$`) + h.p(R`Medián $\vb{${h.tn(s.median)}}$`)
         + h.p(s.modes.length ? R`Modus $\vd{${s.modes.map(v => h.tn(v)).join(";\ ")}}$` : "Modus sa neurčuje")
         + h.p(R`Rozdiel priemer − medián: $${h.tn(s.mean - s.median)}$`);
     }}},
  {ex:"Pre súbor 2, 3, 3, 5, 12 urč priemer, medián a modus.",
   steps:[
     ["Priemer.", R`\dfrac{2 + 3 + 3 + 5 + 12}{5} = \dfrac{25}{5} = 5`],
     ["Medián: súbor je zoradený, prostredná je tretia hodnota.", R`3`],
     ["Modus: trojka je tam dvakrát, ostatné raz.", R`3`]
   ],
   res:"Priemer **5**, medián **3**, modus **3**. Priemer je vyšší, lebo ho ťahá hodnota 12."}
]

  }
};
})();

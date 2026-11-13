/* Geometrická postupnosť a súčet n členov */
(() => {
const par = (h, x, col) => x < 0 ? R`\left(\v${col}{${h.tn(x)}}\right)` : R`\v${col}{${h.tn(x)}}`;
const eq = x => Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? "=" : R`\doteq`;

THEORY.a26 = {
  mins:30,
  brief:[
    R`V geometrickej postupnosti vznikne každý ďalší člen **vynásobením** predošlého tým istým číslom $\va{q}$ (kvocient).`,
    R`$n$-tý člen: $a_n = \vb{a_1} \cdot \va{q}^{\,\vd{n} - 1}$. Medzi dvoma členmi: $a_r = a_s \cdot \va{q}^{\,r - s}$.`,
    R`Súčet prvých $n$ členov: $s_n = \vb{a_1} \cdot \dfrac{\va{q}^{\vd{n}} - 1}{\va{q} - 1}$ pre $q \neq 1$.`,
    R`Rast o $p\,\%$ za obdobie znamená $\va{q} = 1 + \dfrac{p}{100}$, pokles $\va{q} = 1 - \dfrac{p}{100}$.`
  ],
  subs:{

"Kvocient a vzorec aₙ":[
  R`Postupnosť je **geometrická**, ak každý ďalší člen vznikne z predošlého **vynásobením tým istým číslom**. To číslo sa volá **kvocient** a značí sa $\va{q}$.`,
  {def:"Geometrická postupnosť", tex:R`a_{n+1} = a_n \cdot \va{q}`, note:R`Kvocient dostaneš ako podiel dvoch susedných členov: $\va{q} = \dfrac{a_{n+1}}{a_n}$`, legend:[
    ["q", "a", "kvocient", "Koľkokrát je nasledujúci člen väčší než predošlý. Môže to byť aj zlomok alebo záporné číslo."]
  ]},
  R`Od aritmetickej postupnosti ju rozoznáš tak, že susedné členy skúsiš odčítať aj vydeliť. Rovnaké vyjdú buď rozdiely, alebo podiely.`,
  {map:[
    [R`$2,\ 5,\ 8,\ 11,\ \dots$`, "rovnaké rozdiely: aritmetická", R`d = 3`],
    [R`$2,\ 6,\ 18,\ 54,\ \dots$`, "rovnaké podiely: geometrická", R`\va{q} = 3`],
    [R`$80,\ 40,\ 20,\ 10,\ \dots$`, "rovnaké podiely: geometrická", R`\va{q} = \tfrac{1}{2}`],
    [R`$1,\ 4,\ 9,\ 16,\ \dots$`, "ani jedno", R`\text{—}`]
  ]},
  {tool:"postupnost", ask:R`Prvý člen je $\vb{1}$. Meň kvocient $\va{q}$. Čo sa stane, keď je väčší než 1, keď je medzi 0 a 1 a keď je záporný?`,
   take:R`pre $q > 1$ členy rastú stále rýchlejšie, pre $0 < q < 1$ sa zmenšujú k nule, pre záporné $q$ sa striedajú znamienka.`,
   cfg:{typ:"geo", a1:{v:1, lock:true}, q:{v:2, min:-2, max:2, step:.25}, n:{v:1, lock:true, hide:true}, count:6, y:[-34, 34], on:{vals:true, steps:true},
     out:(P, h) => h.calc(h.seq.v.slice(0, 5).map(x => h.tn(x)).join(R`;\ `) + R`;\ \dots`)
       + (P.q > 1 ? h.pill("q > 1 · rastie", "up") : P.q === 1 ? h.pill("q = 1 · konštantná", "flat") : P.q > 0 ? h.pill("0 < q < 1 · klesá k nule", "down")
         : P.q === 0 ? h.pill("q = 0 · ďalej samé nuly", "flat") : h.pill("q < 0 · znamienka sa striedajú", "flat"))}},
  {cards:[
    {t:R`$\va{q} > 1$`, d:R`Pri kladnom $a_1$ postupnosť rastie a kroky sú čoraz väčšie.`, tex:R`3,\ 6,\ 12,\ 24,\ \dots`},
    {t:R`$0 < \va{q} < 1$`, d:R`Pri kladnom $a_1$ klesá a blíži sa k nule, ale nikdy ju nedosiahne.`, tex:R`80,\ 40,\ 20,\ 10,\ \dots`},
    {t:R`$\va{q} < 0$`, d:"Znamienka členov sa striedajú. Postupnosť nie je rastúca ani klesajúca.", tex:R`2,\ -6,\ 18,\ -54,\ \dots`},
    {t:R`$\va{q} = 1$`, d:"Všetky členy sú rovnaké.", tex:R`5,\ 5,\ 5,\ 5,\ \dots`}
  ]},
  R`K druhému členu sa dostaneš jedným násobením, k tretiemu dvoma. K $n$-tému členu treba prvý člen vynásobiť kvocientom $(n - 1)$-krát.`,
  {def:R`Vzorec pre $n$-tý člen`, tex:R`a_{\vd{n}} = \vb{a_1} \cdot \va{q}^{\,\vd{n} - 1}`, legend:[
    ["a_1", "b", "prvý člen", "Odtiaľ postupnosť štartuje."],
    ["q", "a", "kvocient", "Čím sa násobí pri každom kroku."],
    ["n", "d", "poradie", R`Ku členu $a_n$ treba od $a_1$ násobiť $(n - 1)$-krát.`]
  ]},
  {tool:"postupnost", ask:R`$\vb{a_1 = 3}$, $\va{q = 2}$. Meň $\vd{n}$ a sleduj exponent.`,
   take:R`exponent je vždy o jeden menší než poradie člena, lebo prvý člen ešte nie je ničím vynásobený.`,
   cfg:{typ:"geo", a1:{v:3, lock:true}, q:{v:2, lock:true}, n:{v:4}, count:6, y:[0, 100], on:{vals:true, steps:true},
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = \vb{3} \cdot \va{2}^{\,\vd{${P.n}} - 1} = 3 \cdot 2^{${P.n - 1}} = 3 \cdot ${2 ** (P.n - 1)} = ${h.tn(h.seq.an)}`)
       + h.p(R`Od $a_1$ sa násobilo **${P.n - 1}-krát**.`)}},
  {ex:R`V geometrickej postupnosti je $a_1 = 3$ a $q = 2$. Vypočítaj $a_8$.`,
   steps:[
     [R`Dosaď do vzorca $a_n = a_1 \cdot q^{n-1}$.`, R`a_8 = 3 \cdot 2^{8-1} = 3 \cdot 2^7`],
     ["Dopočítaj.", R`a_8 = 3 \cdot 128 = 384`]
   ],
   res:R`$a_8 = 384$`},
  R`Medzi členom $a_s$ a členom $a_r$ je $r - s$ násobení. Nemusíš preto vždy začínať od prvého člena.`,
  {def:"Vzťah medzi dvoma členmi", tex:R`a_r = a_s \cdot \va{q}^{\,r - s}`},
  {ex:R`V geometrickej postupnosti je $a_2 = 6$ a $a_5 = 162$. Urč $q$ a $a_1$.`,
   steps:[
     [R`Od $a_2$ po $a_5$ sú $5 - 2 = 3$ násobenia.`, R`162 = 6 \cdot q^3 \;\Rightarrow\; q^3 = 27 \;\Rightarrow\; \va{q} = 3`],
     [R`Od $a_2$ sa vráť o jeden krok: vydeľ kvocientom.`, R`\vb{a_1} = 6 : 3 = 2`],
     ["Skúška: vypíš členy.", R`2,\ 6,\ 18,\ 54,\ 162`]
   ],
   res:R`$q = 3$, $a_1 = 2$`},
  {tool:"postupnost", kind:"uloha", ask:R`Nastav $\vb{a_1}$ a $\va{q}$ tak, aby $a_2 = 6$ a $a_4 = 24$. Úloha má dve riešenia, nájdeš obe?`,
   hint:R`$a_4 = a_2 \cdot q^2$, teda $q^2 = 4$. Táto rovnica má dva korene.`,
   goal:P => P.a1 * P.q === 6 && P.a1 * P.q ** 3 === 24,
   take:R`z $q^2 = 4$ vyjde $q = 2$ aj $q = -2$. Prvému patrí $a_1 = 3$, druhému $a_1 = -3$. Pri párnom počte krokov preto vždy skontroluj aj záporný kvocient.`,
   cfg:{typ:"geo", a1:{v:1, min:-5, max:5}, q:{v:1, min:-3, max:3, step:.5}, n:{v:1, lock:true, hide:true}, count:5, y:[-50, 50], on:{vals:true},
     out:(P, h) => h.calc(R`a_2 = ${h.tn(h.seq.at(2))}`) + h.calc(R`a_4 = ${h.tn(h.seq.at(4))}`)
       + (P.a1 * P.q === 6 && P.a1 * P.q ** 3 === 24 ? h.pill(P.q > 0 ? "sedí · skús aj záporné q" : "sedí · skús aj kladné q", "ok") : "")}},
  R`Tri susedné členy spája podobná vlastnosť ako v aritmetickej postupnosti, len so súčinom namiesto súčtu. Prostredný člen je **geometrickým priemerom** svojich susedov.`,
  {def:"Druhá mocnina člena je súčin susedov", tex:R`a_n^{\,2} = a_{n-1} \cdot a_{n+1}`},
  {ex:R`Čísla $4,\ x,\ 9$ sú tri po sebe idúce členy geometrickej postupnosti. Urč $x$.`,
   steps:[
     ["Druhá mocnina prostredného člena je súčin krajných.", R`x^2 = 4 \cdot 9 = 36`],
     ["Rovnica má dve riešenia.", R`x = 6 \quad\text{alebo}\quad x = -6`],
     ["Skúška: kvocienty.", R`4,\ 6,\ 9:\ q = \tfrac{3}{2} \qquad 4,\ -6,\ 9:\ q = -\tfrac{3}{2}`]
   ],
   res:R`$x = 6$ alebo $x = -6$`},
  R`Vzorec $a_n = a_1 \cdot q^{n-1}$ má premennú v exponente. Členy geometrickej postupnosti s kladným $q$ preto ležia na grafe **exponenciálnej funkcie**.`,
  {tool:"postupnost", ask:R`Meň $\va{q}$ a sleduj krivku, na ktorej body ležia. Čo sa stane pri $q = 1$?`,
   take:R`pre $q > 1$ je to rastúca exponenciála, pre $q < 1$ klesajúca. Pri $q = 1$ sa zmení na vodorovnú priamku.`,
   cfg:{typ:"geo", dots:true, a1:{v:4, lock:true}, q:{v:1.5, min:.5, max:1.7, step:.1}, n:{v:4}, count:7, y:[0, 100], on:{vals:false, line:true},
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = \vb{4} \cdot \va{${h.tn(P.q)}}^{${P.n - 1}} ${eq(h.seq.an)} ${h.tn(h.seq.an)}`)
       + (P.q > 1 ? h.pill("rastúca exponenciála", "up") : P.q < 1 ? h.pill("klesajúca exponenciála", "down") : h.pill("konštantná", "flat"))}},
  {tip:"Exponenciálnu funkciu a jej graf nájdeš v téme [[a24]]. Aritmetická postupnosť patrí rovnako k lineárnej funkcii, pozri [[a25]].", label:"Súvislosť"},
  {warn:R`Exponent je $n - 1$, nie $n$. A kvocient je vždy **nasledujúci delené predošlým**: pre $80,\ 40,\ 20$ je $q = \dfrac{40}{80} = \dfrac{1}{2}$, nie 2.`}
],

"Súčet n členov":[
  R`Členy geometrickej postupnosti sa nedajú párovať ako v aritmetickej. Pomôže iný trik: súčet vynásobíš kvocientom a oba riadky odčítaš. Skoro všetko sa vyruší.`,
  {steps:[
    {t:"Zapíš súčet", tex:R`s_n = a_1 + a_1 q + a_1 q^2 + \dots + a_1 q^{n-1}`},
    {t:R`Vynásob ho $q$`, tex:R`q \cdot s_n = a_1 q + a_1 q^2 + \dots + a_1 q^{n-1} + a_1 q^{n}`},
    {t:"Odčítaj riadky", d:"Zostane len posledný člen druhého riadku a prvý člen prvého.", tex:R`q \cdot s_n - s_n = a_1 q^n - a_1`},
    {t:R`Vyjadri $s_n$`, tex:R`s_n\,(q - 1) = a_1\,(q^n - 1)`}
  ]},
  {def:R`Súčet prvých $n$ členov`, tex:R`s_{\vd{n}} = \vb{a_1} \cdot \dfrac{\va{q}^{\,\vd{n}} - 1}{\va{q} - 1}`, note:R`Platí pre $q \neq 1$. Pre $q = 1$ sú všetky členy rovnaké a $s_n = n \cdot a_1$.`, legend:[
    ["a_1", "b", "prvý člen", ""],
    ["q", "a", "kvocient", ""],
    ["n", "d", "počet členov", "V súčte je v exponente $n$, nie $n - 1$."]
  ]},
  {ex:R`Vypočítaj súčet $1 + 2 + 4 + 8 + \dots + 512$.`,
   steps:[
     [R`Je to geometrická postupnosť s $a_1 = 1$ a $q = 2$. Koľko má členov?`, R`512 = 2^9 = 1 \cdot 2^{n-1} \;\Rightarrow\; n = 10`],
     ["Dosaď do vzorca.", R`s_{10} = 1 \cdot \dfrac{2^{10} - 1}{2 - 1} = 1024 - 1 = 1\,023`]
   ],
   res:R`Súčet je $1\,023$.`},
  {tool:"postupnost", ask:R`Mocniny dvojky: $\vb{a_1 = 1}$, $\va{q = 2}$. Meň $\vd{n}$ a porovnaj súčet s **nasledujúcim** členom.`,
   take:R`súčet všetkých členov po $a_n$ je vždy o 1 menší než ďalší člen. Jeden nový člen je teda väčší než všetky predošlé dokopy.`,
   cfg:{typ:"geo", a1:{v:1, lock:true}, q:{v:2, lock:true}, n:{v:4, min:1, max:7}, count:8, y:[0, 140], on:{vals:true, sum:true},
     out:(P, h) => h.calc(R`s_{\vd{${P.n}}} = \dfrac{2^{\vd{${P.n}}} - 1}{2 - 1} = ${2 ** P.n} - 1 = ${h.tn(h.seq.sn)}`)
       + h.p(R`Nasledujúci člen: $a_{${P.n + 1}} = ${2 ** P.n}$`)}},
  {tip:R`Podľa legendy si vynálezca šachu pýtal za odmenu zrnká ryže: na prvé políčko jedno, na každé ďalšie dvojnásobok. Spolu je to $2^{64} - 1 \doteq 1{,}8 \cdot 10^{19}$ zrniek, viac než sa na Zemi urodí za stovky rokov.`, label:"Zaujímavosť"},
  R`Pre kvocient menší než 1 je pohodlnejšie čitateľa aj menovateľa otočiť, aby boli oba kladné. Je to ten istý vzorec.`,
  {def:R`Tvar vhodný pre $q < 1$`, tex:R`s_{\vd{n}} = \vb{a_1} \cdot \dfrac{1 - \va{q}^{\,\vd{n}}}{1 - \va{q}}`},
  {ex:R`V geometrickej postupnosti je $a_1 = 81$ a $q = \dfrac{1}{3}$. Vypočítaj súčet prvých piatich členov.`,
   steps:[
     ["Dosaď do vzorca.", R`s_5 = 81 \cdot \dfrac{1 - \left(\frac{1}{3}\right)^5}{1 - \frac{1}{3}} = 81 \cdot \dfrac{1 - \frac{1}{243}}{\frac{2}{3}}`],
     ["Uprav zložený zlomok.", R`s_5 = 81 \cdot \dfrac{242}{243} \cdot \dfrac{3}{2} = \dfrac{242}{3} \cdot \dfrac{3}{2} = 121`],
     ["Kontrola sčítaním.", R`81 + 27 + 9 + 3 + 1 = 121`]
   ],
   res:R`$s_5 = 121$`},
  {tool:"postupnost", ask:R`$\vb{a_1 = 64}$, $\va{q = \tfrac{1}{2}}$. Pridávaj členy. Dostane sa súčet niekedy na 128?`,
   take:R`každý ďalší člen zmenší zvyšok do 128 na polovicu, ale nikdy ho nevynuluje. Súčet rastie stále pomalšie a hranicu 128 neprekročí.`,
   cfg:{typ:"geo", a1:{v:64, lock:true}, q:{v:.5, lock:true}, n:{v:3}, count:8, y:[0, 70], on:{vals:true, sum:true},
     out:(P, h) => h.calc(R`s_{\vd{${P.n}}} = 64 \cdot \dfrac{1 - 0{,}5^{\vd{${P.n}}}}{1 - 0{,}5} = ${h.tn(h.seq.sn, 4)}`)
       + h.p(R`Do 128 chýba $${h.tn(128 - h.seq.sn, 4)}$.`)}},
  R`Keď poznáš súčet a hľadáš počet členov, vyjde rovnica s neznámou v exponente. V maturitných úlohách sa zvyčajne dá vyriešiť rozpoznaním mocniny.`,
  {ex:R`Koľko prvých členov postupnosti $2,\ 6,\ 18,\ \dots$ treba sčítať, aby súčet bol 728?`,
   steps:[
     [R`$a_1 = 2$, $q = 3$. Dosaď do vzorca.`, R`2 \cdot \dfrac{3^n - 1}{3 - 1} = 728`],
     ["Dvojky sa vykrátia.", R`3^n - 1 = 728 \;\Rightarrow\; 3^n = 729`],
     ["729 je mocnina trojky.", R`729 = 3^6 \;\Rightarrow\; n = 6`]
   ],
   res:R`Treba sčítať **6** členov: $2 + 6 + 18 + 54 + 162 + 486 = 728$.`},
  {tool:"postupnost", kind:"uloha", ask:R`Postupnosť $2,\ 6,\ 18,\ \dots$ Koľko prvých členov má súčet 242? Vyber posledný sčítanec.`,
   hint:R`$3^n - 1 = 242$, teda $3^n = 243$.`, goal:P => P.n === 5,
   cfg:{typ:"geo", a1:{v:2, lock:true}, q:{v:3, lock:true}, n:{v:2}, count:6, y:[0, 500], on:{vals:true, sum:true},
     out:(P, h) => h.calc(R`s_{\vd{${P.n}}} = 2 \cdot \dfrac{3^{\vd{${P.n}}} - 1}{3 - 1} = ${3 ** P.n} - 1 = ${h.tn(h.seq.sn)}`)
       + (P.n === 5 ? h.pill("súčet je 242", "ok") : "")}},
  {warn:R`Pre $q = 1$ vzorec nefunguje, v menovateli by bola nula. A pozor na exponenty: v $n$-tom **člene** je $q^{n-1}$, v **súčte** $n$ členov je $q^n$.`}
],

"Slovné úlohy (rast, úroky)":[
  R`Geometrickú postupnosť v texte spoznáš podľa slov „každý ďalší je **násobkom**“ alebo „zmení sa **o** … **percent**“. Zmena o rovnaké percento znamená násobenie rovnakým číslom.`,
  {map:[
    ["„Každú hodinu sa zdvojnásobí.“", "", R`\va{q} = 2`],
    ["„Rastie o 5 % ročne.“", "pripočítaj percentá k jednotke", R`\va{q} = 1{,}05`],
    ["„Každý rok stratí 15 % hodnoty.“", "odpočítaj percentá od jednotky", R`\va{q} = 0{,}85`],
    ["„Vyskočí do 60 % predošlej výšky.“", "percento z predošlej hodnoty je priamo kvocient", R`\va{q} = 0{,}6`]
  ]},
  R`Daj pozor na počítanie krokov. Ak poznáš hodnotu **na začiatku** a pýtajú sa na hodnotu **po $n$ obdobiach**, násobilo sa $n$-krát. Začiatočnú hodnotu je vtedy praktické označiť $a_0$.`,
  {def:R`Hodnota po $n$ obdobiach`, tex:R`a_{\vd{n}} = \vb{a_0} \cdot \va{q}^{\,\vd{n}}`, legend:[
    ["a_0", "b", "začiatočná hodnota", "Stav v čase nula, pred prvou zmenou."],
    ["q", "a", "kvocient", "Čím sa hodnota násobí za jedno obdobie."],
    ["n", "d", "počet období", "Koľkokrát zmena prebehla."]
  ]},
  {ex:"V kultúre je 500 baktérií a ich počet sa každú hodinu zdvojnásobí. Koľko ich bude po 10 hodinách?",
   steps:[
     ["Začiatočná hodnota a kvocient.", R`\vb{a_0} = 500,\qquad \va{q} = 2`],
     ["Po 10 hodinách sa násobilo desaťkrát.", R`a_{10} = 500 \cdot 2^{10} = 500 \cdot 1024 = 512\,000`]
   ],
   res:"Po 10 hodinách ich bude **512 000**."},
  {tool:"postupnost", kind:"uloha", ask:"Na začiatku je 100 baktérií a každú hodinu sa ich počet zdvojnásobí. Po koľkých hodinách ich bude prvýkrát viac než 5 000?",
   hint:R`$100 \cdot 2^n > 5000$, teda $2^n > 50$. Skús mocniny dvojky.`, goal:P => P.n === 6,
   cfg:{typ:"vzorec", f:"100*2^n", first:0, count:8, y:[0, 13000], n:{v:1, note:"hodiny"}, on:{vals:false}, marks:[{y:5000, label:"5 000"}],
     out:(P, h) => h.calc(R`a_{\vd{${P.n}}} = 100 \cdot 2^{\vd{${P.n}}} = ${h.tn(h.seq.an)}`)
       + (P.n === 6 ? h.pill("prvýkrát nad 5 000", "ok") : h.pill(h.seq.an > 5000 ? "nad 5 000, ale nie prvýkrát" : "ešte málo", "flat"))}},
  R`Najčastejšou úlohou tohto typu je **zložené úrokovanie**. Úrok sa každý rok pripíše k vkladu a ďalší rok sa úročí už väčšia suma.`,
  {def:"Zložené úrokovanie", tex:R`K_{\vd{n}} = \vb{K_0} \cdot \left(1 + \dfrac{\va{p}}{100}\right)^{\vd{n}}`, legend:[
    ["K_0", "b", "vklad", "Suma na začiatku."],
    ["p", "a", "úroková miera", "Ročný úrok v percentách."],
    ["n", "d", "počet rokov", ""]
  ]},
  {ex:"Do banky vložíš 2 000 € s ročným úrokom 3 %. Koľko budeš mať o 5 rokov?",
   steps:[
     ["Kvocient.", R`\va{q} = 1 + \tfrac{3}{100} = 1{,}03`],
     ["Dosaď.", R`K_5 = 2000 \cdot 1{,}03^5`],
     ["Vypočítaj na kalkulačke.", R`K_5 \doteq 2000 \cdot 1{,}15927 \doteq 2318{,}55`]
   ],
   res:"O 5 rokov budeš mať približne **2 318,55 €**."},
  {tool:"postupnost", ask:R`Vklad 1 000 €. Meň úrok $\va{p}$ a počet rokov $\vd{n}$. Čísla nad oblúčikmi sú úroky pripísané za jednotlivé roky.`,
   take:"úrok za každý ďalší rok je väčší než za predošlý, lebo sa počíta z väčšej sumy. Preto stĺpce nerastú po priamke, ale stále strmšie.",
   cfg:{typ:"vzorec", f:"1000*(1+p/100)^n", params:{p:{v:5, min:0, max:10, step:.5, color:"a", note:"% ročne"}}, sym:"K",
     first:0, count:11, y:[0, 2800], n:{v:5, note:"roky"}, on:{vals:true, steps:true},
     out:(P, h) => h.calc(R`K_{\vd{${P.n}}} = 1000 \cdot \va{${h.tn(1 + P.p / 100, 3)}}^{\vd{${P.n}}} ${eq(h.seq.an)} ${h.tn(h.seq.an)}`)
       + (P.n > 0 ? h.p(R`Úrok za ${P.n}. rok: $${h.tn(h.seq.an - h.seq.at(P.n - 1))}$ €`) : "")
       + h.p(R`Spolu pribudlo: $${h.tn(h.seq.an - 1000)}$ €`)}},
  {ex:"Nové auto stojí 20 000 € a každý rok stratí 15 % svojej hodnoty. Akú hodnotu bude mať o 4 roky?",
   steps:[
     ["Každý rok zostane 85 % hodnoty.", R`\va{q} = 1 - \tfrac{15}{100} = 0{,}85`],
     ["Po štyroch rokoch.", R`a_4 = 20\,000 \cdot 0{,}85^4 \doteq 20\,000 \cdot 0{,}52201 \doteq 10\,440`]
   ],
   res:"O 4 roky bude mať hodnotu približne **10 440 €**. To je o trochu viac než polovica, hoci $4 \\cdot 15\\,\\% = 60\\,\\%$."},
  R`Ak sa úloha pýta na množstvo **spolu** za viac období, potrebuješ súčet. Vtedy je prvé obdobie členom $a_1$ a platí vzorec pre $s_n$.`,
  {ex:"Firma vyrobila v prvom roku 1 000 výrobkov a každý ďalší rok o 10 % viac než v predošlom. Koľko výrobkov vyrobila spolu za prvých 5 rokov?",
   steps:[
     ["Ročné výroby tvoria geometrickú postupnosť.", R`\vb{a_1} = 1000,\qquad \va{q} = 1{,}1,\qquad \vd{n} = 5`],
     ["Súčet piatich členov.", R`s_5 = 1000 \cdot \dfrac{1{,}1^5 - 1}{1{,}1 - 1} = 1000 \cdot \dfrac{0{,}61051}{0{,}1}`],
     ["Dopočítaj.", R`s_5 = 1000 \cdot 6{,}1051 = 6105{,}1`]
   ],
   res:"Za 5 rokov vyrobila približne **6 105** výrobkov."},
  R`Keď je neznámy **počet období**, je neznáma v exponente. Buď skúšaš mocniny, alebo použiješ logaritmus.`,
  {ex:"Za koľko rokov sa vklad pri ročnom úroku 4 % zdvojnásobí?",
   steps:[
     [R`Hľadáš $n$, pre ktoré je $K_n = 2K_0$. Vklad sa vykráti.`, R`1{,}04^n = 2`],
     ["Zlogaritmuj obe strany.", R`n \cdot \log 1{,}04 = \log 2 \;\Rightarrow\; n = \dfrac{\log 2}{\log 1{,}04} \doteq \dfrac{0{,}30103}{0{,}01703} \doteq 17{,}7`],
     ["Úroky sa pripisujú raz ročne, treba celý počet rokov.", R`1{,}04^{17} \doteq 1{,}948,\qquad 1{,}04^{18} \doteq 2{,}026`]
   ],
   res:"Vklad sa zdvojnásobí po **18 rokoch**. Od veľkosti vkladu to nezávisí."},
  {tip:"Úroky, pôžičky a splátky podrobne rozoberá téma [[a2]], logaritmy téma [[b1]]. Porovnanie rastu o rovnakú sumu a o rovnaké percento nájdeš v [[a24]].", label:"Súvislosť"},
  {warn:R`Pokles o 15 % znamená kvocient $0{,}85$, nie $0{,}15$. A hodnota po $n$ rokoch má exponent $n$: ak začiatočnú hodnotu označíš $a_1$, po $n$ rokoch máš člen $a_{n+1}$.`}
]

  }
};
})();

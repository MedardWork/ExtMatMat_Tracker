/* Objem a povrch hranatých telies: kocka, kváder, hranol, ihlan */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);

THEORY.a36 = {
  mins:35,
  brief:[
    R`Kváder: $V = abc$, $S = 2(ab + bc + ca)$. Kocka: $V = a^3$, $S = 6a^2$.`,
    R`Hranol: $V = S_p \cdot v$, $S = 2S_p + S_{pl}$.`,
    R`Ihlan: $V = \frac{1}{3} S_p \cdot v$, $S = S_p + S_{pl}$. Výška steny $w$ z pravouhlého trojuholníka s výškou ihlana.`,
    R`Uhlopriečky kocky: stenová $a\sqrt{2}$, telesová $a\sqrt{3}$. Kvádra: $\sqrt{a^2 + b^2 + c^2}$.`
  ],
  subs:{

"Kocka a kváder":[
  R`**Objem** udáva, koľko jednotkových kociek sa do telesa zmestí. **Povrch** je súčet obsahov všetkých stien, teda plocha papiera na obalenie. Kváder má tri dvojice zhodných stien.`,
  {def:"Kváder a kocka", tex:R`\text{kváder: } V = \va{a}\vb{b}\vd{c},\quad S = 2(\va{a}\vb{b} + \vb{b}\vd{c} + \vd{c}\va{a});\qquad \text{kocka: } V = a^3,\quad S = 6a^2`},
  {tool:"telesa", ask:R`Meň rozmery kvádra a prepni na sieť. Ktoré steny sú zhodné?`,
   take:R`protiľahlé steny sú zhodné: dve $a \times b$, dve $b \times c$, dve $c \times a$. Preto je v povrchu dvojka.`,
   cfg:{typ:"kvader", toggles:["siet"]}},
  {ex:R`Vypočítaj objem a povrch kvádra $5 \times 3 \times 4$ cm. Potom hranu kocky s povrchom 150 cm².`,
   steps:[
     ["Kváder.", R`V = 60,\quad S = 2(15 + 12 + 20) = 94`],
     ["Kocka z povrchu.", R`6a^2 = 150 \;\Rightarrow\; a = 5,\quad V = 125`]
   ],
   res:R`$60$ cm³ a $94$ cm²; hrana 5 cm.`},
  {tool:"telesa", kind:"uloha", ask:R`Kváder má podstavu $5 \times 3$. Nastav výšku $\vd{c}$ tak, aby mal objem 75.`,
   hint:R`$15 \cdot c = 75$.`,
   goal:P => P.c === 5,
   cfg:{typ:"kvader", a:L(5), b:L(3), c:{v:2}}},
  {warn:R`Jednotky: objem v cm³, povrch v cm². $1 \text{ dm}^3 = 1\,000 \text{ cm}^3 = 1$ liter, ale $1 \text{ dm}^2 = 100 \text{ cm}^2$.`}
],

"Hranol":[
  R`**Hranol** má dve zhodné rovnobežné podstavy (mnohouholníky) a bočné steny tvorené obdĺžnikmi (pri kolmom hranole). Kváder je hranol so štvoruholníkovou podstavou. Objem je podstava krát výška.`,
  {def:"Hranol", tex:R`V = S_p \cdot \vb{v},\qquad S = 2S_p + S_{pl},\qquad S_{pl} = o_p \cdot \vb{v}`, note:"Plášť kolmého hranola rozvinutý do roviny je obdĺžnik s rozmermi obvod podstavy × výška."},
  {tool:"telesa", ask:R`Pravidelný hranol. Meň počet strán podstavy $n$ a výšku. Ako vyzerá sieť?`,
   take:R`dve podstavy a $n$ obdĺžnikov vedľa seba. Plášť je jeden obdĺžnik s dĺžkou rovnou obvodu podstavy.`,
   cfg:{typ:"hranol", toggles:["siet"]}},
  {ex:R`Pravidelný trojboký hranol má hranu podstavy 4 cm a výšku 10 cm. Vypočítaj objem a povrch.`,
   steps:[
     ["Podstava je rovnostranný trojuholník.", R`S_p = \frac{4^2\sqrt{3}}{4} = 4\sqrt{3} \doteq 6{,}93`],
     ["Objem.", R`V = 4\sqrt{3} \cdot 10 \doteq 69{,}28`],
     ["Plášť a povrch.", R`S_{pl} = 3 \cdot 4 \cdot 10 = 120,\quad S = 8\sqrt{3} + 120 \doteq 133{,}86`]
   ],
   res:R`$V \doteq 69{,}28$ cm³, $S \doteq 133{,}86$ cm².`},
  {tool:"telesa", kind:"uloha", ask:R`Pravidelný štvorboký hranol s hranou podstavy 3. Nastav výšku $\vb{v}$ tak, aby mal objem 36.`,
   hint:R`$S_p = 9$.`,
   goal:P => P.v === 4,
   cfg:{typ:"hranol", n:L(4), a:L(3), v:{v:2}}},
  {warn:R`Povrch hranola má **dve** podstavy, nie jednu. Pri ihlane je len jedna.`}
],

"Ihlan":[
  R`**Ihlan** má jednu podstavu a bočné steny sú trojuholníky so spoločným vrcholom. Objem ihlana je tretina objemu hranola s rovnakou podstavou a výškou: tri zhodné ihlany sa dajú poskladať do hranola.`,
  {def:"Ihlan", tex:R`V = \frac{1}{3} S_p \cdot \vb{v},\qquad S = S_p + S_{pl}`, note:"Pri pravidelnom ihlane je plášť zložený z $n$ zhodných rovnoramenných trojuholníkov s výškou $w$ (výška steny)."},
  {tool:"telesa", ask:R`Pravidelný ihlan. Meň výšku a sleduj výšku steny $w$ a plášť.`,
   take:R`výška steny $w$ je prepona pravouhlého trojuholníka s odvesnami $v$ a polomerom vpísanej kružnice podstavy. Vyššia pyramída má strmšie steny a väčší plášť.`,
   cfg:{typ:"ihlan", toggles:["siet"]}},
  {ex:R`Pravidelný štvorboký ihlan má hranu podstavy 6 cm a výšku 4 cm. Vypočítaj objem a povrch.`,
   steps:[
     ["Objem.", R`V = \tfrac{1}{3} \cdot 36 \cdot 4 = 48`],
     ["Výška steny: odvesny $v = 4$ a polovica hrany 3.", R`w = \sqrt{16 + 9} = 5`],
     ["Plášť a povrch.", R`S_{pl} = 4 \cdot \tfrac{6 \cdot 5}{2} = 60,\quad S = 36 + 60 = 96`]
   ],
   res:R`$V = 48$ cm³, $S = 96$ cm².`},
  {tool:"telesa", kind:"uloha", ask:R`Pravidelný štvorboký ihlan s hranou podstavy 3. Nastav výšku $\vb{v}$ tak, aby mal objem 12.`,
   hint:R`$\frac{1}{3} \cdot 9 \cdot v = 12$.`,
   goal:P => P.v === 4,
   cfg:{typ:"ihlan", n:L(4), a:L(3), v:{v:2}}},
  {warn:R`V objeme ihlana je $\frac{1}{3}$. A výška ihlana $v$ nie je výška steny $w$: $w$ je dlhšia, je to prepona.`}
],

"Stenová a telesová uhlopriečka":[
  R`**Stenová** uhlopriečka spája protiľahlé vrcholy jednej steny, **telesová** prechádza vnútrom telesa. Obe sa počítajú Pytagorovou vetou ([[a29]]): telesová uhlopriečka je prepona trojuholníka so stenovou uhlopriečkou a hranou.`,
  {def:"Uhlopriečky", tex:R`\text{kocka: } u_s = a\sqrt{2},\quad u_t = a\sqrt{3};\qquad \text{kváder: } u_t = \sqrt{a^2 + b^2 + c^2}`},
  {tool:"telesa", ask:R`Meň hranu kocky a sleduj telesovú uhlopriečku $u$.`,
   take:R`$u = a\sqrt{3} \doteq 1{,}73a$. Pri hrane 4 je to približne $6{,}93$.`,
   cfg:{typ:"kocka"}},
  {ex:R`Vypočítaj stenovú a telesovú uhlopriečku kocky s hranou 4 cm a telesovú uhlopriečku kvádra $3 \times 4 \times 12$.`,
   steps:[
     ["Kocka.", R`u_s = 4\sqrt{2} \doteq 5{,}66,\quad u_t = 4\sqrt{3} \doteq 6{,}93`],
     ["Kváder.", R`u_t = \sqrt{9 + 16 + 144} = 13`]
   ],
   res:R`$5{,}66$ cm, $6{,}93$ cm a $13$.`},
  {tool:"telesa", kind:"uloha", ask:R`Nastav hranu kocky tak, aby mala telesová uhlopriečka dĺžku $6\sqrt{3} \doteq 10{,}39$.`,
   hint:R`$u_t = a\sqrt{3}$.`,
   goal:P => P.a === 6,
   cfg:{typ:"kocka", a:{v:3}}},
  {warn:R`Telesová uhlopriečka kocky nie je $a\sqrt{2}$, to je stenová. Pomôže pamätať: 2 rozmery (stena) → $\sqrt{2}$, 3 rozmery (teleso) → $\sqrt{3}$.`}
]

  }
};
})();

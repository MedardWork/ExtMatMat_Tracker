/* Kružnica a kruh: tetiva, dotyčnica, výsek, odsek, dĺžka oblúka */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const ring = {view:[-6.5, 6.5, 6.5, -6.5], tick:1, fns:[], show:[{curve:["R*cos(t)", "R*sin(t)"], t:[0, "2pi"], color:"a"}, {curve:["r*cos(t)", "r*sin(t)"], t:[0, "2pi"], color:"b"}, {pt:[0, 0], color:"ink"}]};

THEORY.a34 = {
  mins:30,
  brief:[
    R`Tetiva vo vzdialenosti $d$ od stredu: $t = 2\sqrt{r^2 - d^2}$. Dotyčnica je kolmá na polomer v bode dotyku.`,
    R`Dĺžka oblúka so stredovým uhlom $\alpha$: $l = 2\pi r \cdot \frac{\alpha}{360^\circ}$.`,
    R`Výsek: $S = \pi r^2 \cdot \frac{\alpha}{360^\circ}$. Odsek = výsek $-$ trojuholník, $S = \pi r^2 \frac{\alpha}{360^\circ} - \frac{1}{2} r^2 \sin\alpha$.`,
    R`Medzikružie: $S = \pi(R^2 - r^2)$.`
  ],
  subs:{

"Tetiva a dotyčnica":[
  R`**Tetiva** je úsečka, ktorej oba konce ležia na kružnici. Najdlhšia tetiva je priemer. Kolmica zo stredu na tetivu ju rozpolí, takže polovica tetivy, vzdialenosť $d$ a polomer tvoria pravouhlý trojuholník.`,
  {def:"Dĺžka tetivy", tex:R`t = 2\sqrt{\vb{r}^2 - \va{d}^2}`},
  {tool:"kruh", ask:R`Meň vzdialenosť tetivy od stredu $\va{d}$. Kedy je tetiva najdlhšia a kedy sa zmení na dotyčnicu?`,
   take:R`pri $d = 0$ prechádza stredom, je to priemer $2r$. Pri $d = r$ sa tetiva zmení na bod a priamka sa kružnice len dotýka.`,
   cfg:{typ:"tetiva"}},
  {ex:R`Kružnica má polomer 5 cm. a) Aká dlhá je tetiva vo vzdialenosti 3 cm od stredu? b) V akej vzdialenosti od stredu je tetiva dlhá 8 cm?`,
   steps:[
     ["a) Pytagorova veta pre polovicu tetivy.", R`\tfrac{t}{2} = \sqrt{25 - 9} = 4 \;\Rightarrow\; t = 8`],
     ["b) Opačne.", R`d = \sqrt{25 - 16} = 3`]
   ],
   res:"a) 8 cm, b) 3 cm."},
  R`**Dotyčnica** má s kružnicou jediný spoločný bod a je kolmá na polomer v tomto bode. Z bodu mimo kružnice vedú dve dotyčnice rovnakej dĺžky ([[a31]]).`,
  {tool:"kruh", ask:R`Meň vzdialenosť bodu $X$ od stredu. Prečo sú obe dotyčnice rovnako dlhé?`,
   take:R`oba trojuholníky $S T_1 X$ a $S T_2 X$ sú pravouhlé, so spoločnou preponou $SX$ a odvesnou $r$. Sú zhodné.`,
   cfg:{typ:"dotycnica"}},
  {tool:"kruh", kind:"uloha", ask:R`Kružnica s polomerom 5. Nastav vzdialenosť $\va{d}$ tak, aby mala tetiva dĺžku 6.`,
   hint:R`$d = \sqrt{25 - 9}$.`,
   goal:P => P.d === 4,
   cfg:{typ:"tetiva", r:L(5), d:{v:1}}},
  {warn:R`Vzdialenosť tetivy od stredu sa meria **kolmo**, nie k jej koncu. Kolmica zo stredu padne presne do stredu tetivy.`}
],

"Dĺžka oblúka":[
  R`Oblúk je časť kružnice medzi dvoma bodmi. Jeho dĺžka je taká časť obvodu, aká časť z $360^\circ$ je stredový uhol. V radiánoch je to ešte jednoduchšie: $l = r \cdot \alpha$ ([[b8]]).`,
  {def:"Dĺžka oblúka", tex:R`l = 2\pi \vb{r} \cdot \frac{\vd{\alpha}}{360^\circ} = \vb{r} \cdot \vd{\alpha}_{\text{rad}}`},
  {tool:"kruh", ask:R`Meň stredový uhol $\vd{\alpha}$ a polomer $\vb{r}$. Akú časť obvodu tvorí oblúk pri $90^\circ$?`,
   take:R`štvrtinu, lebo $\frac{90}{360} = \frac{1}{4}$. Dĺžka oblúka rastie priamo úmerne s uhlom aj s polomerom.`,
   cfg:{typ:"vysek"}},
  {ex:R`Vypočítaj dĺžku oblúka s polomerom 6 cm a stredovým uhlom $60^\circ$. Potom stredový uhol oblúka dĺžky $5\pi$ pri polomere 10.`,
   steps:[
     ["Šestina obvodu.", R`l = 2\pi \cdot 6 \cdot \frac{60}{360} = 2\pi \doteq 6{,}28`],
     ["Z obvodu $20\\pi$ je $5\\pi$ štvrtina.", R`\alpha = 360^\circ \cdot \frac{5\pi}{20\pi} = 90^\circ`]
   ],
   res:R`$2\pi \doteq 6{,}28$ cm a $90^\circ$.`},
  {tool:"kruh", kind:"uloha", ask:R`Pri polomere 4 nastav stredový uhol $\vd{\alpha}$ tak, aby mal oblúk dĺžku $2\pi$.`,
   hint:R`Obvod je $8\pi$, potrebuješ štvrtinu.`,
   goal:P => P.alfa === 90,
   cfg:{typ:"vysek", r:L(4), alfa:{v:30}}},
  {warn:R`Uhol v stupňoch nedosadzuj do $l = r\alpha$. Tento vzorec platí len v radiánoch: pri $60^\circ$ je $\alpha = \frac{\pi}{3}$, nie 60.`}
],

"Kruhový výsek a odsek":[
  R`**Výsek** je časť kruhu medzi dvoma polomermi, ako kúsok pizze. **Odsek** je časť kruhu, ktorú odreže tetiva. Odsek dostaneš, keď od výseku odčítaš trojuholník zo stredu a koncov tetivy.`,
  {def:"Výsek a odsek", tex:R`S_{\text{výsek}} = \pi \vb{r}^2 \cdot \frac{\vd{\alpha}}{360^\circ},\qquad S_{\text{odsek}} = S_{\text{výsek}} - \frac{1}{2}\vb{r}^2 \sin\vd{\alpha}`},
  {tool:"kruh", ask:R`Zapni odsek a tetivu. Meň uhol $\vd{\alpha}$. Aký veľký je trojuholník, ktorý sa od výseku odčíta?`,
   take:R`trojuholník má obsah $\frac{1}{2}r^2\sin\alpha$. Pre $\alpha > 180^\circ$ je $\sin\alpha$ záporný a trojuholník sa naopak pripočíta.`,
   cfg:{typ:"vysek", alfa:{v:120}, on:{odsek:true, tetiva:true}}},
  {ex:R`Kruh s polomerom 6 cm, stredový uhol $60^\circ$. Vypočítaj obsah výseku a odseku.`,
   steps:[
     ["Výsek.", R`S_v = 36\pi \cdot \frac{60}{360} = 6\pi \doteq 18{,}85`],
     ["Trojuholník je rovnostranný.", R`S_t = \frac{1}{2} \cdot 36 \cdot \sin 60^\circ = 9\sqrt{3} \doteq 15{,}59`],
     ["Odsek.", R`S_o = 6\pi - 9\sqrt{3} \doteq 3{,}26`]
   ],
   res:R`Výsek $\doteq 18{,}85$ cm², odsek $\doteq 3{,}26$ cm².`},
  {ex:R`Kruh s polomerom 4, stredový uhol $90^\circ$. Aký obsah má odsek?`,
   steps:[
     ["Výsek je štvrtina kruhu.", R`S_v = \frac{16\pi}{4} = 4\pi`],
     ["Trojuholník je pravouhlý s odvesnami 4.", R`S_t = 8`]
   ],
   res:R`$4\pi - 8 \doteq 4{,}57$`},
  {tool:"kruh", kind:"uloha", ask:R`Pri polomere 4 nastav stredový uhol $\vd{\alpha}$ tak, aby mal výsek obsah $4\pi$.`,
   hint:R`Celý kruh má $16\pi$.`,
   goal:P => P.alfa === 90,
   cfg:{typ:"vysek", r:L(4), alfa:{v:200}}},
  {warn:R`Odsek nie je výsek. Pri odseku treba odčítať trojuholník, inak vyjde obsah celého výseku.`}
],

"Medzikružie":[
  R`**Medzikružie** je časť roviny medzi dvoma sústrednými kružnicami, napríklad tvar podložky alebo bežeckej dráhy. Jeho obsah je rozdiel obsahov dvoch kruhov.`,
  {def:"Medzikružie", tex:R`S = \pi\left(\va{R}^2 - \vb{r}^2\right)`},
  {tool:"graf", ask:R`Meň polomery $\va{R}$ a $\vb{r}$. Kedy má medzikružie obsah polovice veľkého kruhu?`,
   take:R`keď $r^2 = \frac{R^2}{2}$, teda $r = \frac{R}{\sqrt{2}} \doteq 0{,}71R$. Medzikružie zaberá prekvapivo veľkú časť kruhu, aj keď vyzerá úzke.`,
   cfg:Object.assign({}, ring, {params:{R:{v:5, min:2, max:6, step:.5, color:"a"}, r:{v:3, min:.5, max:6, step:.5, color:"b"}},
     out:(P, h) => P.r >= P.R ? h.p("Vnútorný polomer musí byť menší.") : h.calc(R`S = \pi(\va{${h.tn(P.R)}}^2 - \vb{${h.tn(P.r)}}^2) = ${h.tn(P.R * P.R - P.r * P.r)}\pi \doteq ${t2(h, Math.PI * (P.R * P.R - P.r * P.r))}`)})},
  {ex:R`Podložka má vonkajší polomer 5 cm a vnútorný 3 cm. Aký má obsah?`,
   steps:[["Rozdiel kruhov.", R`S = \pi(25 - 9) = 16\pi \doteq 50{,}27`]],
   res:R`$16\pi \doteq 50{,}27$ cm².`},
  {ex:R`Tetiva veľkej kružnice sa dotýka malej kružnice a má dĺžku 8. Aký obsah má medzikružie?`,
   steps:[
     [R`Polovica tetivy, $r$ a $R$ tvoria pravouhlý trojuholník (dotyčnica je kolmá na $r$).`, R`R^2 - r^2 = 4^2 = 16`],
     ["Dosaď.", R`S = 16\pi`]
   ],
   res:R`$16\pi$, a nemusíme poznať ani $R$, ani $r$.`},
  {tool:"graf", kind:"uloha", ask:R`Vonkajší polomer je 5. Nastav vnútorný polomer $\vb{r}$ tak, aby malo medzikružie obsah $9\pi$.`,
   hint:R`$25 - r^2 = 9$.`,
   goal:P => P.r === 4,
   cfg:Object.assign({}, ring, {params:{R:L(5), r:{v:2, min:.5, max:4.5, step:.5, color:"b"}},
     out:(P, h) => h.calc(R`S = \pi(25 - \vb{${h.tn(P.r)}}^2) = ${h.tn(25 - P.r * P.r)}\pi`)})},
  {warn:R`$\pi(R^2 - r^2) \neq \pi(R - r)^2$. Pre $R = 5$, $r = 3$ je to $16\pi$, nie $4\pi$.`}
]

  }
};
})();

/* Rez kocky a kvádra rovinou */
(() => {
const cube = st => st.h && st.h.cube;

THEORY.b32 = {
  mins:30,
  brief:[
    R`Rez je mnohouholník, v ktorom rovina pretne povrch telesa. Jeho strany ležia v stenách.`,
    R`Body v tej istej stene spoj priamo. Rovnobežné steny pretne rovina v rovnobežných úsečkách.`,
    R`Ak treba, predĺž stranu rezu do priesečníka s priamkou hrany (pomocný bod mimo telesa).`,
    R`Rez kocky môže byť trojuholník, štvoruholník, päťuholník alebo šesťuholník.`
  ],
  subs:{

"Rez kocky":[
  R`Rovina je určená tromi bodmi, ktoré neležia na priamke. **Rez** telesa rovinou je časť roviny vnútri telesa, mnohouholník na jeho povrchu. Konštruuje sa po stenách: v každej stene, ktorú rovina pretne, leží jedna strana rezu.`,
  {steps:[
    {t:"Body v jednej stene", d:"Dva body roviny, ktoré ležia v tej istej stene, spoj. To je strana rezu."},
    {t:"Rovnobežné steny", d:"Protiľahlé steny kocky sú rovnobežné, rovina ich pretne v rovnobežných úsečkách."},
    {t:"Pomocné body", d:"Ak to nestačí, predĺž stranu rezu, kým nepretne priamku hrany susednej steny. Z tohto bodu pokračuj v tej stene."}
  ]},
  {tool:"kocka", ask:R`Posúvaj body $X$, $Y$, $Z$ po hranách (alebo klikni na inú hranu). Ako sa mení tvar rezu?`,
   take:R`počet vrcholov rezu závisí od toho, koľko stien rovina pretne: 3 až 6. Strany v protiľahlých stenách sú vždy rovnobežné.`,
   cfg:{typ:"rez"}},
  {ex:R`Kocka $ABCDEFGH$ s hranou 4. Rez rovinou cez stredy hrán $AE$, $BF$ a bod $C$. Aký tvar má rez?`,
   steps:[
     [R`Stredy $AE$ a $BF$ ležia v stene $ABFE$, spoj ich. Úsečka je rovnobežná s $AB$.`, R`|S_{AE} S_{BF}| = 4`],
     [R`Stena $DCGH$ je rovnobežná s $ABFE$, rez v nej prejde cez $C$ rovnobežne s $AB$, teda po hrane $CD$.`, R`|CD| = 4`],
     [R`Zvyšné strany $S_{BF}C$ a $DS_{AE}$ ležia v bočných stenách.`, R`\sqrt{4^2 + 2^2} = 2\sqrt{5}`]
   ],
   res:"Rez je rovnobežník (obdĺžnik) so stranami 4 a $\\sqrt{4^2 + 2^2} = 2\\sqrt{5}$."},
  {tool:"kocka", kind:"uloha", ask:R`Body $X$, $Y$, $Z$ sú na hranách $AB$, $BC$, $GH$. Nastav ich polohy tak, aby bol rez pravidelný šesťuholník.`,
   hint:"Rez cez stredy hrán: všetky tri body do polovice hrany.",
   goal:P => P.t1 === .5 && P.t2 === .5 && P.t3 === .5,
   cfg:{typ:"rez", body:[["AB", .25], ["BC", .75], ["GH", .25]], klikaj:false}},
  {warn:R`Dva body spoj len vtedy, keď ležia v **tej istej stene**. Úsečka cez vnútro kocky nie je stranou rezu.`}
],

"Rez kvádra":[
  R`Pri kvádri platí to isté ako pri kocke, len hrany majú rôzne dĺžky. Strany rezu sa počítajú Pytagorovou vetou v stenách, obsah rezu rozdelením na trojuholníky alebo ako rovnobežník.`,
  {tool:"kocka", ask:R`Kváder $6 \times 4 \times 3$. Posúvaj body a sleduj obvod a obsah rezu.`,
   take:R`rez je opäť mnohouholník so stranami v stenách. Pri rovnobežných stranách je to často rovnobežník.`,
   cfg:{typ:"rez", kvader:true, a:6, b:4, c:3, lock:["a", "b", "c"], body:[["AE", .5], ["BF", 1], ["CD", .5]]}},
  {ex:R`Kváder $ABCDEFGH$ má $|AB| = 6$, $|BC| = 4$, $|AE| = 3$. Aký obsah má rez rovinou $ABG$?`,
   steps:[
     [R`Rovina $ABG$ obsahuje aj $H$ (rovnobežka s $AB$ v hornej stene). Rez je obdĺžnik $ABGH$.`, R`|AB| = 6`],
     [R`$|BG|$ je uhlopriečka steny $BCGF$.`, R`|BG| = \sqrt{4^2 + 3^2} = 5`],
     ["Obsah.", R`S = 6 \cdot 5 = 30`]
   ],
   res:"Obsah rezu je 30."},
  {warn:R`Uhlopriečky stien kvádra sú rôzne: $\sqrt{a^2 + b^2}$, $\sqrt{b^2 + c^2}$, $\sqrt{a^2 + c^2}$. Vyber tú, ktorá patrí k správnej stene.`}
],

"Tvar rezu":[
  R`Počet vrcholov rezu je počet stien, ktoré rovina pretne. Kocka má 6 stien, ale protiľahlé sú rovnobežné, takže rez má najviac 6 strán. Trojuholník vznikne, keď rovina „odreže roh“.`,
  {cards:[
    {t:"Trojuholník", d:"Rovina pretne tri steny pri jednom vrchole. Cez $B$, $D$, $E$: rovnostranný trojuholník so stranou $a\\sqrt{2}$."},
    {t:"Štvoruholník", d:"Napríklad obdĺžnik $ABGH$ alebo štvorec rovnobežný so stenou."},
    {t:"Päťuholník", d:"Rovina pretne päť stien."},
    {t:"Šesťuholník", d:"Rovina pretne všetkých šesť stien. Cez stredy šiestich hrán: pravidelný šesťuholník."}
  ]},
  {tool:"kocka", ask:R`Rez rovinou cez tri vrcholy susediace s rohom. Aký trojuholník vznikne?`,
   take:R`rovnostranný, každá jeho strana je stenová uhlopriečka $a\sqrt{2}$.`,
   cfg:{typ:"rez", body:[["AB", 1], ["DA", 0], ["AE", 1]]}},
  {ex:R`Vypočítaj obsah rezu kocky s hranou 4 rovinou $BDE$.`,
   steps:[
     ["Strany sú stenové uhlopriečky.", R`s = 4\sqrt{2}`],
     ["Rovnostranný trojuholník.", R`S = \frac{s^2\sqrt{3}}{4} = \frac{32\sqrt{3}}{4} = 8\sqrt{3} \doteq 13{,}86`]
   ],
   res:R`$8\sqrt{3} \doteq 13{,}86$`},
  {tool:"kocka", kind:"uloha", ask:R`Posúvaj body (a klikaním ich presúvaj na iné hrany) tak, aby bol rez päťuholník.`,
   hint:"Skús dať dva body na susedné hrany pri jednom vrchole a tretí na vzdialenejšiu hranu, napríklad do stredu.",
   goal:(P, st) => !!cube(st) && cube(st).n === 5,
   cfg:{typ:"rez"}},
  {warn:R`Rez kocky nikdy nemá viac než 6 vrcholov a nemôže to byť pravidelný päťuholník. Ak ti vyšlo viac strán, niektoré body si spojil cez vnútro kocky.`}
]

  }
};
})();

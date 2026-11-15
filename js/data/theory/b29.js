/* Voľné rovnobežné premietanie, pohľady na teleso, stavby z kociek */
(() => {
const L = v => ({v, lock:true});
const pr = st => st.h && st.h.pr;

THEORY.b29 = {
  mins:30,
  brief:[
    R`Voľné rovnobežné premietanie: predná stena sa kreslí v skutočnej veľkosti, hrany idúce dozadu pod uhlom $\omega$ (zvyčajne $45^\circ$) a skrátené na $q$-násobok (zvyčajne $\frac{1}{2}$).`,
    R`Rovnobežné úsečky ostávajú rovnobežné a pomer dĺžok na jednej priamke sa zachová. Uhly a dĺžky hrán dozadu sa menia.`,
    R`Nárys je pohľad spredu, pôdorys zhora, bokorys zboku. Nárys a pôdorys majú spoločnú šírku, nárys a bokorys výšku, pôdorys a bokorys hĺbku.`,
    R`Stavba z kociek: v nárose je v každom stĺpci najvyššia veža stĺpca, v bokorysi najvyššia veža radu.`
  ],
  subs:{

"Voľné rovnobežné premietanie":[
  R`Teleso v priestore kreslíme na papier tak, aby bolo vidieť jeho tvar. Vo **voľnom rovnobežnom premietaní** sa predná stena kreslí presne, ako je, a hrany, ktoré idú dozadu, sa kreslia šikmo a kratšie.`,
  {def:"Pravidlá voľného rovnobežného premietania", tex:R`\text{predná stena: skutočná veľkosť} \qquad \text{hrana dozadu: uhol } \va{\omega},\ \text{dĺžka } \vb{q} \cdot b \qquad \va{\omega} = 45^\circ,\ \vb{q} = \tfrac{1}{2}`,
   note:"Uhol a skrátenie sú dohoda. Ak zadanie nehovorí inak, použi 45° a polovicu."},
  {tool:"premietanie", ask:R`Kocka s hranou 4. Meň uhol $\omega$ a skrátenie $q$. Čo sa deje s prednou stenou a čo s hranami dozadu?`,
   take:R`predná stena ostáva štvorcom $4 \times 4$, mení sa len smer a dĺžka hrán idúcich dozadu.`,
   cfg:{typ:"teleso", teleso:"kvader", a:L(4), b:L(4), c:L(4), on:{narys:false, podorys:false, bokorys:false}}},
  R`Všetko, čo je v priestore rovnobežné, je rovnobežné aj na obrázku. Preto sa zadná stena kocky nakreslí ako rovnako veľký štvorec, len posunutý šikmo dozadu.`,
  {steps:[
    {t:"Predná stena", d:"Nakresli prednú stenu v skutočnej veľkosti (pri kocke štvorec)."},
    {t:"Hrany dozadu", d:"Z každého vrcholu prednej steny veď úsečku pod uhlom 45° dĺžky polovice hrany."},
    {t:"Zadná stena", d:"Spoj konce týchto úsečiek, vznikne kópia prednej steny."},
    {t:"Neviditeľné hrany", d:"Hrany zakryté telesom nakresli čiarkovane."}
  ]},
  {ex:R`Kváder má rozmery $8 \times 6 \times 5$ cm (šírka, hĺbka, výška). Ako ho nakreslíš vo voľnom rovnobežnom premietaní s $\omega = 45^\circ$ a $q = \frac{1}{2}$?`,
   steps:[
     ["Predná stena je obdĺžnik šírka × výška v skutočnej veľkosti.", R`8 \times 5\ \text{cm}`],
     ["Hĺbka sa kreslí šikmo pod 45° a skráti sa na polovicu.", R`\tfrac{1}{2} \cdot 6 = 3\ \text{cm}`],
     ["Zadná stena je rovnaký obdĺžnik posunutý o 3 cm šikmo hore doprava.", R`8 \times 5\ \text{cm}`]
   ],
   res:"Obdĺžnik 8 × 5 cm, z jeho vrcholov úsečky dĺžky 3 cm pod uhlom 45° a zadný obdĺžnik 8 × 5 cm."},
  {tool:"premietanie", kind:"uloha", ask:R`Kváder má šírku 4 a výšku 4. Nastav hĺbku $b$ a skrátenie $q$ tak, aby sa hrana dozadu nakreslila dĺžkou 3.`,
   hint:"Nakreslená dĺžka je q · b. Napríklad b = 6 a q = 0,5. Riešení je viac.",
   take:R`rovnaký obrázok môžu mať rôzne kvádre: z obrázka hĺbku neodmeriaš, ak nepoznáš $q$.`,
   goal:(P, st) => !!pr(st) && Math.abs(pr(st).kresli - 3) < 1e-9,
   cfg:{typ:"teleso", teleso:"kvader", a:L(4), c:L(4), uhol:L(45), on:{narys:false, podorys:false, bokorys:false}}},
  {ex:R`Kocka $ABCDEFGH$ s hranou 6 cm je nakreslená s $\omega = 45^\circ$, $q = \frac{1}{2}$. Akú dĺžku má na obrázku hrana $AD$ (dozadu) a akú stenová uhlopriečka $AF$ prednej steny?`,
   steps:[
     ["$AD$ ide dozadu, skráti sa na polovicu.", R`\tfrac{1}{2} \cdot 6 = 3\ \text{cm}`],
     ["$AF$ leží v prednej stene, tá je v skutočnej veľkosti.", R`6\sqrt{2} \doteq 8{,}49\ \text{cm}`]
   ],
   res:R`$|AD| = 3$ cm na obrázku (v skutočnosti 6 cm), $|AF| = 6\sqrt{2} \doteq 8{,}49$ cm.`},
  {warn:R`Na obrázku nemeraj dĺžky hrán dozadu ani uhly bočných stien. Pravý uhol $DAB$ sa nakreslí ako $45^\circ$ alebo $135^\circ$. Skutočné hodnoty počítaj z rozmerov telesa.`}
],

"Pôdorys, nárys, bokorys":[
  R`Teleso môžeme opísať aj troma rovinnými pohľadmi. **Nárys** je pohľad spredu, **pôdorys** zhora a **bokorys** zboku (tu sprava). V každom pohľade sa jeden rozmer stratí: v nárose hĺbka, v pôdoryse výška, v bokorysi šírka.`,
  {def:"Spoločné rozmery pohľadov", tex:R`\text{nárys a pôdorys: šírka} \qquad \text{nárys a bokorys: výška} \qquad \text{pôdorys a bokorys: hĺbka}`},
  {tool:"premietanie", ask:R`Pravidelný štvorboký ihlan. Meň hranu podstavy $a$ a výšku $v$ a porovnaj všetky tri pohľady.`,
   take:R`nárys aj bokorys sú rovnoramenné trojuholníky so základňou $a$ a výškou $v$, pôdorys je štvorec s uhlopriečkami (bočné hrany).`,
   cfg:{typ:"teleso", teleso:"ihlan", uhol:L(45), q:L(.5)}},
  {ex:R`Pravidelný štvorboký ihlan má hranu podstavy 4 cm a výšku 6 cm. Aké sú jeho pohľady a aký obsah má nárys?`,
   steps:[
     ["Pôdorys: štvorec s hranou 4 a s uhlopriečkami, to sú bočné hrany zhora.", R`4 \times 4`],
     ["Nárys: trojuholník so základňou 4 a výškou 6. Jeho ramená sú výšky bočných stien.", R`\sqrt{2^2 + 6^2} = \sqrt{40} \doteq 6{,}32`],
     ["Obsah nárysu.", R`S = \frac{4 \cdot 6}{2} = 12\ \text{cm}^2`]
   ],
   res:R`Nárys a bokorys sú zhodné trojuholníky s obsahom $12\ \text{cm}^2$, pôdorys je štvorec $4 \times 4$ s uhlopriečkami.`},
  {tool:"premietanie", ask:R`Valec. Ktorý pohľad prezradí, že ide o valec, a nie o hranol?`,
   take:R`nárys a bokorys sú obdĺžniky $2r \times v$, ako pri kvádri. Kruh v pôdoryse to rozhodne.`,
   cfg:{typ:"teleso", teleso:"valec", uhol:L(45), q:L(.5)}},
  {cards:[
    {t:"Kužeľ", d:"Nárys a bokorys: trojuholník. Pôdorys: kruh so stredom."},
    {t:"Ihlan", d:"Nárys a bokorys: trojuholník. Pôdorys: štvorec s uhlopriečkami."},
    {t:"Ležiaci trojboký hranol", d:"Nárys: trojuholník. Pôdorys aj bokorys: obdĺžnik."}
  ]},
  {tool:"premietanie", ask:R`Kužeľ s polomerom $r$ a výškou $v$. Pri $r = 2$, $v = 4$ porovnaj jeho nárys s nárysom ihlanu vyššie pri $a = 4$, $v = 4$.`,
   take:R`nárys oboch je rovnaký trojuholník so základňou 4 a výškou 4. Jeden pohľad teleso neurčí, treba aspoň dva.`,
   cfg:{typ:"teleso", teleso:"kuzel", uhol:L(45), q:L(.5)}},
  {ex:R`Valec má polomer 3 cm a výšku 5 cm. Aké sú jeho pohľady a aký obsah má každý z nich?`,
   steps:[
     ["Nárys: obdĺžnik so šírkou 2r a výškou v.", R`6 \cdot 5 = 30\ \text{cm}^2`],
     ["Bokorys: rovnaký obdĺžnik.", R`30\ \text{cm}^2`],
     ["Pôdorys: kruh s polomerom 3.", R`\pi \cdot 3^2 = 9\pi \doteq 28{,}27\ \text{cm}^2`]
   ],
   res:R`Nárys a bokorys $30\ \text{cm}^2$, pôdorys $9\pi \doteq 28{,}27\ \text{cm}^2$.`},
  {warn:R`Ramená nárysu ihlanu nie sú bočné hrany, ale výšky bočných stien. Bočná hrana ide šikmo do rohu a v nárose sa skracuje.`}
],

"Telesá poskladané z kociek":[
  R`Stavbu z rovnakých kociek najlepšie zapíšeš **pôdorysom s číslami**: v každom políčku je počet kociek vo veži. Z neho vyčítaš všetky pohľady aj počet kociek.`,
  {def:"Pohľady na stavbu z kociek", tex:R`\text{nárys: v každom stĺpci najvyššia veža} \qquad \text{bokorys: v každom rade najvyššia veža} \qquad n = \text{súčet čísel v pôdoryse}`},
  {tool:"premietanie", ask:R`Klikaj na políčka pôdorysu a pridávaj kocky. Sleduj, kedy sa zmení nárys a kedy nie.`,
   take:R`nárys sa zmení, len keď sa zvýši najvyššia veža v stĺpci. Kocky schované za ňou nárys nevidí.`,
   cfg:{typ:"kocky"}},
  {ex:R`Pôdorys stavby (zadný rad, stredný, predný): $3, 1, 0$; $2, 1, 0$; $1, 1, 1$. Koľko je kociek a aký je nárys a bokorys?`,
   steps:[
     ["Počet kociek je súčet všetkých čísel.", R`3 + 1 + 0 + 2 + 1 + 0 + 1 + 1 + 1 = 10`],
     ["Nárys: v stĺpcoch zľava najvyššie veže.", R`\max(3, 2, 1) = 3,\ \max(1, 1, 1) = 1,\ \max(0, 0, 1) = 1`],
     ["Bokorys: v radoch spredu najvyššie veže.", R`1,\ 2,\ 3`]
   ],
   res:"10 kociek, nárys má stĺpce 3, 1, 1, bokorys rady 1, 2, 3 (spredu dozadu). Povrch stavby je 36 štvorčekov."},
  {tool:"premietanie", kind:"uloha", ask:R`Obraz stavby je skrytý. Postav stavbu, ktorej nárys a bokorys sedia s čiarkovanými obrysmi.`,
   hint:"Stĺpec s najvyšším číslom nárysu a rad s najvyšším číslom bokorysu sa stretajú v jednom políčku: tam patrí najvyššia veža.",
   goal:(P, st) => !!pr(st) && pr(st).ok,
   cfg:{typ:"kocky", vysky:[[0, 0, 0], [0, 0, 0], [0, 0, 0]], on:{obraz:false}, ciel:{narys:[2, 3, 1], bokorys:[1, 3, 2]}}},
  R`Z nárysu a bokorysu sa stavba neurčí jednoznačne. Maturita sa často pýta na **najmenší a najväčší** možný počet kociek.`,
  {steps:[
    {t:"Najviac", d:"Do každého políčka daj menšie z dvoch čísel: číslo jeho stĺpca v nárose a číslo jeho radu v bokorysi. Sčítaj."},
    {t:"Najmenej", d:"Každá veža môže naraz splniť jeden stĺpec nárysu a jeden rad bokorysu s rovnakým číslom. Polož ju na ich spoločné políčko a ostatné nechaj prázdne."}
  ]},
  {ex:R`Nárys má stĺpce $2, 3, 1$ (zľava), bokorys rady $1, 3, 2$ (spredu). Pôdorys je $3 \times 3$. Koľko kociek môže mať stavba najmenej a najviac?`,
   steps:[
     ["Najviac: v každom políčku menšie z čísel stĺpca a radu. Rad s 1:", R`1 + 1 + 1 = 3`],
     ["Rad s 3:", R`2 + 3 + 1 = 6`],
     ["Rad s 2:", R`2 + 2 + 1 = 5`],
     ["Spolu najviac.", R`3 + 6 + 5 = 14`],
     ["Najmenej: čísla 3, 2, 1 sú v náryse aj v bokorysi, stačia tri veže, každá na priesečníku svojho stĺpca a radu.", R`3 + 2 + 1 = 6`]
   ],
   res:"Najmenej 6, najviac 14 kociek."},
  {tool:"premietanie", kind:"uloha", ask:R`Postav stavbu s rovnakým nárysom ($2, 3, 1$) a bokorysom ($1, 3, 2$) z čo najmenej kociek, teda zo 6.`,
   hint:"Tri veže výšok 3, 2 a 1. Veža 3 patrí do stredného stĺpca a stredného radu.",
   goal:(P, st) => !!pr(st) && pr(st).ok && pr(st).n === 6,
   cfg:{typ:"kocky", vysky:[[0, 0, 0], [0, 0, 0], [0, 0, 0]], ciel:{narys:[2, 3, 1], bokorys:[1, 3, 2]}}},
  {warn:R`Nárys nepočíta kocky, ukazuje len obrys. Stĺpec s číslom 3 môže mať 3 kocky, ale aj 3 + 2 + 1, ak sú za sebou tri veže.`}
]

  }
};
})();

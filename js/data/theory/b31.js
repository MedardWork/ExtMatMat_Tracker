/* Vzájomná poloha priamok a rovín v priestore */
(() => {
const pol = st => st.h && st.h.pol;

THEORY.b31 = {
  mins:30,
  brief:[
    R`Dve priamky v priestore sú totožné, rovnobežné, rôznobežné alebo mimobežné. Mimobežky neležia v jednej rovine a nemajú spoločný bod.`,
    R`Priamka a rovina: priamka leží v rovine, je s ňou rovnobežná, alebo ju pretína v jednom bode.`,
    R`Dve roviny sú totožné, rovnobežné, alebo rôznobežné a pretínajú sa v priamke (priesečnici).`,
    R`Priamka je rovnobežná s rovinou, ak je rovnobežná s niektorou priamkou roviny. Roviny sú rovnobežné, ak dve rôznobežky jednej sú rovnobežné s druhou.`
  ],
  subs:{

"Vzájomná poloha priamok":[
  R`V rovine sa dve rôzne priamky buď pretnú, alebo sú rovnobežné. V priestore pribudne tretia možnosť: priamky sa nepretnú, a predsa nie sú rovnobežné, lebo idú „ponad seba“. Také priamky sa volajú **mimobežky**.`,
  {cards:[
    {t:"Rovnobežky", d:"Ležia v jednej rovine a nemajú spoločný bod. Napríklad $AB$ a $HG$."},
    {t:"Rôznobežky", d:"Majú práve jeden spoločný bod. Napríklad telesové uhlopriečky $AG$ a $BH$."},
    {t:"Mimobežky", d:"Neležia v jednej rovine, nemajú spoločný bod. Napríklad $AB$ a $CG$."},
    {t:"Totožné", d:"Všetky body spoločné, napríklad $AB$ a $BA$."}
  ]},
  {def:"Rozhodovanie o polohe dvoch priamok", tex:R`\text{spoločný bod: rôznobežky} \qquad \text{rovnaký smer: rovnobežky} \qquad \text{ani jedno: mimobežky}`},
  {tool:"poloha", ask:R`Klikaj na vrcholy a urči nimi priamky $p$ a $q$. Nájdi rovnobežky, rôznobežky aj mimobežky.`,
   take:R`priamky, ktoré sa na obrázku „krížia“, nemusia mať spoločný bod. Rozhoduje, či ležia v jednej rovine.`,
   cfg:{typ:"priamky", p:"AB", q:"HG"}},
  {tool:"poloha", ask:R`Hrany kocky sú zafarbené podľa polohy k priamke $p = AB$. Koľko hrán je s ňou rovnobežných, koľko ju pretína a koľko je mimobežných?`,
   take:R`3 hrany sú rovnobežné, 4 rôznobežné a 4 mimobežné. Spolu s $AB$ je to všetkých 12 hrán.`,
   cfg:{typ:"priamky", p:"AB", q:"CG", pevne:"p", on:{hrany:true}}},
  {ex:R`V kocke $ABCDEFGH$ urči vzájomnú polohu priamok $AG$ a $BH$, $AB$ a $CH$.`,
   steps:[
     [R`$AG$ a $BH$ ležia v obdĺžniku $ABGH$, sú to jeho uhlopriečky. Pretínajú sa v strede kocky.`, R`\text{rôznobežky}`],
     [R`$AB$ leží v rovine $ABFE$, $CH$ v rovnobežnej rovine $DCGH$. Spoločný bod nemajú.`, R`AB \cap CH = \emptyset`],
     [R`Smery nie sú rovnaké: $AB$ je vodorovná, $CH$ ide šikmo hore.`, R`AB \nparallel CH`]
   ],
   res:R`$AG$ a $BH$ sú rôznobežky, $AB$ a $CH$ sú mimobežky.`},
  {tool:"poloha", kind:"uloha", ask:R`Priamka $p = AB$ je pevná. Klikaním na dva vrcholy vyber priamku $q$, ktorá je s ňou mimobežná.`,
   hint:"Hľadaj priamku v protiľahlej stene DCGH alebo v hornej stene, ktorá nemá smer AB. Napríklad CG.",
   goal:(P, st) => !!pol(st) && pol(st).vztah === "mimobezne",
   cfg:{typ:"priamky", p:"AB", q:"DC", pevne:"p"}},
  {warn:R`„Nepretínajú sa“ ešte neznamená „sú rovnobežné“. Rovnobežky musia navyše ležať v jednej rovine, teda mať rovnaký smer.`}
],

"Priamka a rovina":[
  R`Priamka môže v rovine **ležať** (všetky jej body sú v rovine), byť s ňou **rovnobežná** (nemajú spoločný bod) alebo ju **pretínať** v jednom bode, priesečníku. Špeciálny prípad pretínania je priamka **kolmá** na rovinu.`,
  {def:"Kritérium rovnobežnosti priamky a roviny", tex:R`p \parallel \varrho \iff p \parallel q \text{ pre nejakú priamku } q \subset \varrho`,
   note:"Ak má priamka s rovinou navyše spoločný bod, leží v nej."},
  {tool:"poloha", ask:R`Priamka $EG$ a rovina podstavy $ABC$. Prečo sú rovnobežné? Potom klikaním vyskúšaj iné priamky.`,
   take:R`$EG$ je rovnobežná s uhlopriečkou $AC$, ktorá leží v podstave, preto je $EG$ rovnobežná s rovinou $ABC$.`,
   cfg:{typ:"rovina", p:"EG", r:"ABC", pevne:"r"}},
  {tool:"poloha", ask:R`Telesová uhlopriečka $AG$ a rovina $BDE$. Kde ju pretína a pod akým uhlom?`,
   take:R`$AG$ je na rovinu $BDE$ kolmá a pretína ju v tretine uhlopriečky, bližšie k $A$.`,
   cfg:{typ:"rovina", p:"AG", r:"BDE", on:{miery:true}}},
  {ex:R`Kocka $ABCDEFGH$ s hranou 4. V akom bode pretína priamka $AG$ rovinu $BDE$?`,
   steps:[
     [R`Súradnice: $A = [0, 0, 0]$, $G = [4, 4, 4]$, $B = [4, 0, 0]$, $D = [0, 4, 0]$, $E = [0, 0, 4]$.`, R`\varrho:\ x + y + z = 4`],
     [R`Body priamky $AG$ majú tvar $[4t, 4t, 4t]$. Dosadíme do rovnice roviny.`, R`12t = 4 \Rightarrow t = \tfrac{1}{3}`],
     ["Priesečník.", R`X = \left[\tfrac{4}{3}, \tfrac{4}{3}, \tfrac{4}{3}\right]`]
   ],
   res:R`$X = \left[\frac{4}{3}, \frac{4}{3}, \frac{4}{3}\right]$, rovina odreže tretinu uhlopriečky $AG$.`},
  {tool:"poloha", kind:"uloha", ask:R`Rovina $\varrho = BDE$ je pevná. Vyber dvoma vrcholmi priamku, ktorá je s ňou rovnobežná a neleží v nej.`,
   hint:"Hľadaj priamku rovnobežnú s niektorou stranou trojuholníka BDE, napríklad FH je rovnobežná s BD.",
   goal:(P, st) => !!pol(st) && pol(st).vztah === "rovnobezna",
   cfg:{typ:"rovina", p:"AG", r:"BDE", pevne:"r"}},
  {warn:R`Priamka rovnobežná s rovinou nemusí byť rovnobežná so všetkými priamkami roviny. S niektorými je mimobežná: $EG$ je rovnobežná s rovinou $ABC$, ale s $AB$ je mimobežná.`}
],

"Dve roviny":[
  R`Dve rôzne roviny sú buď **rovnobežné** (nemajú spoločný bod), alebo **rôznobežné**. Rôznobežné roviny sa pretínajú vždy v celej priamke, ktorá sa volá **priesečnica**. Na jej nájdenie stačia dva spoločné body.`,
  {def:"Kritérium rovnobežnosti rovín", tex:R`\varrho \parallel \sigma \iff \text{dve rôznobežky roviny } \varrho \text{ sú rovnobežné so } \sigma`},
  {tool:"poloha", ask:R`Roviny $BDE$ a $CFH$. Over, že každá strana trojuholníka $BDE$ je rovnobežná so stranou $CFH$.`,
   take:R`$BD \parallel FH$, $BE \parallel CH$, $DE \parallel CF$, preto sú roviny rovnobežné. Rozdeľujú uhlopriečku $AG$ na tretiny.`,
   cfg:{typ:"roviny", r:"BDE", s:"CFH", on:{miery:true}}},
  {tool:"poloha", ask:R`Roviny $ABG$ a $BCE$. Ktoré vrcholy kocky ležia v oboch?`,
   take:R`obe roviny obsahujú $B$ aj $H$, preto je ich priesečnica priamka $BH$.`,
   cfg:{typ:"roviny", r:"ABG", s:"BCE"}},
  {ex:R`Urči priesečnicu rovín $ABG$ a $BCE$ v kocke $ABCDEFGH$.`,
   steps:[
     [R`Rovina $ABG$ obsahuje aj $H$, lebo $GH \parallel AB$. Je to obdĺžnik $ABGH$.`, R`ABG = ABGH`],
     [R`Rovina $BCE$ obsahuje aj $H$, lebo $EH \parallel BC$. Je to obdĺžnik $BCHE$.`, R`BCE = BCHE`],
     [R`Spoločné body sú $B$ a $H$.`, R`ABG \cap BCE = BH`]
   ],
   res:R`Priesečnica je telesová uhlopriečka $BH$.`},
  {tool:"poloha", kind:"uloha", ask:R`Rovina $\varrho = BDE$ je pevná. Vyber tromi vrcholmi rovinu $\sigma$, ktorá je s ňou rovnobežná.`,
   hint:"Ku každej strane BD, BE, DE nájdi rovnobežnú stenovú uhlopriečku na opačnej strane kocky.",
   goal:(P, st) => !!pol(st) && pol(st).vztah === "rovnobezne",
   cfg:{typ:"roviny", r:"BDE", s:"BCE", pevne:"r"}},
  {warn:R`Dve roviny sa nikdy nepretínajú v jedinom bode. Ak majú spoločný bod a nie sú totožné, majú spoločnú celú priamku.`},
  {tip:R`Keď rovina pretne dve rovnobežné roviny, priesečnice sú rovnobežné. Na tom stojí konštrukcia rezu kocky ([[b32]]).`, label:"Súvislosť"}
],

"Mimobežky":[
  R`Mimobežky nemajú spoločný bod a neexistuje rovina, v ktorej by ležali obe. Dá sa však zmerať ich **uhol** (jednu posunieš, aby pretla druhú) a ich **vzdialenosť**, teda dĺžka najkratšej úsečky, ktorá ich spája. Tá je kolmá na obe priamky.`,
  {def:"Uhol a vzdialenosť mimobežiek", tex:R`\angle(p, q) = \angle(p', q),\ p' \parallel p \qquad d(p, q) = d(p, \sigma),\ q \subset \sigma,\ \sigma \parallel p`,
   note:"Uhol mimobežiek je z intervalu (0°; 90°⟩. Vzdialenosť meria aj vzdialenosť priamky p od roviny σ, ktorá obsahuje q a je rovnobežná s p."},
  {tool:"poloha", ask:R`Mimobežky $AB$ a $CG$. Aký uhol zvierajú a ako sú ďaleko?`,
   take:R`uhol je $90^\circ$ a vzdialenosť je dĺžka hrany $BC$, ktorá je kolmá na obe priamky.`,
   cfg:{typ:"priamky", p:"AB", q:"CG", on:{miery:true}}},
  {ex:R`Kocka $ABCDEFGH$ s hranou 4. Urči uhol a vzdialenosť mimobežiek $AB$ a $CH$.`,
   steps:[
     [R`Posunieme $CH$ do bodu $B$: $CH \parallel BE$. Uhol je uhol $ABE$ v prednej stene.`, R`45^\circ`],
     [R`$CH$ leží v stene $DCGH$, tá je rovnobežná s $AB$. Vzdialenosť $AB$ od tejto steny je hrana $AD$.`, R`d = 4`]
   ],
   res:R`Uhol $45^\circ$, vzdialenosť 4.`},
  {tool:"poloha", ask:R`Telesová uhlopriečka $AG$ a hrana $BF$. Over výsledok nasledujúceho príkladu.`,
   take:R`odchýlka je asi $54{,}7^\circ$ a vzdialenosť $2\sqrt{2} \doteq 2{,}83$, polovica stenovej uhlopriečky.`,
   cfg:{typ:"priamky", p:"AG", q:"BF", on:{miery:true}}},
  {ex:R`Kocka $ABCDEFGH$ s hranou 4. Urči uhol a vzdialenosť mimobežiek $AG$ a $BF$.`,
   steps:[
     [R`$BF \parallel AE$, uhol je uhol $EAG$ v obdĺžniku $ACGE$ so stranami $|AE| = 4$ a $|AC| = 4\sqrt{2}$.`, R`\cos\varphi = \frac{|AE|}{|AG|} = \frac{4}{4\sqrt{3}} = \frac{1}{\sqrt{3}}`],
     ["Uhol.", R`\varphi \doteq 54{,}7^\circ`],
     [R`$AG$ leží v rovine $ACGE$, ktorá je rovnobežná s $BF$. Vzdialenosť $B$ od tejto roviny je polovica uhlopriečky $BD$.`, R`d = \tfrac{1}{2} \cdot 4\sqrt{2} = 2\sqrt{2} \doteq 2{,}83`]
   ],
   res:R`Uhol $\doteq 54{,}7^\circ$, vzdialenosť $2\sqrt{2} \doteq 2{,}83$.`},
  {tool:"poloha", kind:"uloha", ask:R`Priamka $p = AB$ je pevná. Nájdi priamku $q$ cez dva vrcholy, ktorá je s $AB$ mimobežná a zviera s ňou pravý uhol.`,
   hint:"Stačí, aby q nemala žiadnu zložku v smere AB a nepretínala ju: napríklad zvislá hrana vzadu alebo uhlopriečka bočnej steny BCGF.",
   goal:(P, st) => !!pol(st) && pol(st).vztah === "mimobezne" && Math.abs(pol(st).uhol - 90) < 1e-6,
   cfg:{typ:"priamky", p:"AB", q:"CH", pevne:"p", on:{miery:true}}},
  {warn:R`Kolmé mimobežky sa nepretínajú. Ak zadanie hovorí „$p \perp q$“ v priestore, priamky môžu byť aj mimobežné, napríklad $AB$ a $CG$.`},
  {tip:R`Viac o uhloch v [[b33]] a o vzdialenostiach v [[b34]].`, label:"Súvislosť"}
]

  }
};
})();

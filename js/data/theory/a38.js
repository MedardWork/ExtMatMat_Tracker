/* Pravidlo súčinu, pravidlo súčtu, stromový diagram */
(() => {
const L = v => ({v, lock:true});
const S = st => st.h && st.h.strom;

THEORY.a38 = {
  mins:25,
  brief:[
    R`**Pravidlo súčinu:** výber prebieha v krokoch, v 1. kroku je $n_1$ možností, v 2. kroku $n_2$ … Spolu $n_1 \cdot n_2 \cdots n_k$ možností.`,
    R`**Pravidlo súčtu:** možnosti sa rozpadnú na prípady, ktoré sa neprekrývajú. Spolu je súčet počtov v prípadoch.`,
    R`Ak sa prípady prekrývajú: $|A \cup B| = |A| + |B| - |A \cap B|$.`,
    R`Stromový diagram a systematické vypisovanie pomôžu, keď počet možností v kroku závisí od predošlej voľby.`
  ],
  subs:{

"Pravidlo súčinu":[
  R`Mnohé úlohy z kombinatoriky sú o tom, koľkými spôsobmi sa dá niečo vybrať v **niekoľkých krokoch**: najprv polievku, potom hlavné jedlo, potom dezert. Ku každej voľbe v prvom kroku sa dá pripojiť každá voľba v druhom kroku.`,
  {def:"Pravidlo súčinu", tex:R`N = \va{n_1} \cdot \vb{n_2} \cdot \vd{n_3} \cdots`,
   note:"n₁, n₂, … sú počty možností v jednotlivých krokoch. Počet v kroku nesmie závisieť od toho, čo sme vybrali predtým."},
  {tool:"strom", ask:R`Menu: polievka, hlavné jedlo, dezert. Meň počty možností a sleduj, koľko vetiev má strom.`,
   take:R`každá vetva je jedno celé menu. Vetiev je súčin počtov v jednotlivých krokoch.`,
   cfg:{typ:"strom", volby:[3, 2, 2], nazvy:["polievka", "hlavné jedlo", "dezert"], mena:[["P1", "P2", "P3"], ["H1", "H2"], ["D1", "D2"]]}},
  {ex:R`V jedálni ponúkajú 3 polievky, 4 hlavné jedlá a 2 dezerty. Koľko rôznych menu (polievka, hlavné jedlo, dezert) si môžeš vybrať?`,
   steps:[
     ["Tri kroky, počty možností sa nemenia.", R`n_1 = 3,\ n_2 = 4,\ n_3 = 2`],
     ["Pravidlo súčinu.", R`N = 3 \cdot 4 \cdot 2 = 24`]
   ],
   res:"24 menu."},
  {tool:"strom", kind:"uloha", ask:R`Máš 3 tričká. Koľko nohavíc potrebuješ, aby si mal 12 rôznych oblečení (tričko + nohavice)? Nastav $n_2$.`,
   hint:"3 · n₂ = 12.",
   goal:(P, st) => !!S(st) && S(st).N === 12,
   cfg:{typ:"strom", volby:[3, 2], nazvy:["tričko", "nohavice"], n1:L(3)}},
  R`Pravidlo súčinu platí aj vtedy, keď sa **možnosti** v kroku menia, ak sa nemení ich **počet**. Pri cifrách, ktoré sa nesmú opakovať, je v každom kroku o jednu možnosť menej.`,
  {ex:R`Koľko je štvormiestnych PIN kódov z cifier 0 až 9? A koľko z nich má všetky cifry rôzne?`,
   steps:[
     ["Každé miesto: 10 cifier.", R`10 \cdot 10 \cdot 10 \cdot 10 = 10\,000`],
     ["Rôzne cifry: každá ďalšia má o jednu možnosť menej.", R`10 \cdot 9 \cdot 8 \cdot 7 = 5\,040`]
   ],
   res:"10 000 PIN kódov, z toho 5 040 s rôznymi ciframi."},
  {ex:R`Koľko je trojciferných prirodzených čísel s rôznymi ciframi?`,
   steps:[
     ["Stovky: nesmie byť 0.", R`9`],
     ["Desiatky: hocijaká cifra okrem tej na mieste stoviek (0 už smie).", R`9`],
     ["Jednotky: okrem dvoch použitých.", R`8`],
     ["Spolu.", R`9 \cdot 9 \cdot 8 = 648`]
   ],
   res:"648 čísel."},
  {warn:R`Číslo sa nezačína nulou. Pri počítaní čísel začni **najprv miestom s obmedzením** (prvá cifra, posledná cifra pri párnych číslach), až potom ostatnými.`}
],

"Pravidlo súčtu":[
  R`Niekedy sa úloha rozpadne na **prípady**: buď sa ide autobusom, alebo vlakom. Ak sa prípady neprekrývajú (žiadna možnosť nepatrí do dvoch naraz), počty sa sčítajú.`,
  {def:"Pravidlo súčtu", tex:R`N = \va{n_A} + \vb{n_B} \qquad |A \cup B| = |A| + |B| - |A \cap B|`,
   note:"Prvý vzorec platí pre prípady, ktoré sa neprekrývajú. Druhý, keď sa prekrývajú: prvky v oboch by sme inak počítali dvakrát."},
  {cards:[
    {t:"„a potom“ → súčin", d:"Výber v krokoch: tričko **a** nohavice. Každá voľba sa kombinuje s každou."},
    {t:"„alebo“ → súčet", d:"Rozdelenie na prípady: číslo končí 0 **alebo** inou párnou cifrou. Prípady sa sčítajú."}
  ]},
  {ex:R`Koľko je párnych trojciferných čísel s rôznymi ciframi?`,
   steps:[
     ["Prípad 1: na konci je 0. Stovky: 9 možností (1 až 9), desiatky: 8.", R`9 \cdot 8 \cdot 1 = 72`],
     ["Prípad 2: na konci je 2, 4, 6 alebo 8. Stovky: nie 0 a nie posledná cifra, 8 možností. Desiatky: 8.", R`8 \cdot 8 \cdot 4 = 256`],
     ["Prípady sa neprekrývajú, sčítame.", R`72 + 256 = 328`]
   ],
   res:"328 čísel."},
  {tool:"mnoziny", kind:"uloha", ask:R`Čísla od 1 do 30: v $A$ sú párne (15), v $B$ deliteľné tromi (10). Čísla deliteľné aj dvoma, aj tromi sú deliteľné šiestimi. Nastav ich počet $|A \cap B|$.`,
   hint:"Deliteľné 6: 6, 12, 18, 24, 30.",
   take:R`zjednotenie má $15 + 10 - 5 = 20$ prvkov. Bez odčítania prieniku by sme 5 čísel počítali dvakrát.`,
   goal:P => P.ab === 5,
   cfg:{typ:"pocty", a:L(15), b:L(10), ab:{v:0, min:0, max:10}, u:L(30)}},
  {ex:R`Koľko je dvojciferných alebo trojciferných čísel s rôznymi ciframi?`,
   steps:[
     ["Dvojciferné: prvá cifra 9 možností, druhá 9.", R`9 \cdot 9 = 81`],
     ["Trojciferné (vyššie).", R`9 \cdot 9 \cdot 8 = 648`],
     ["Číslo nemôže byť dvoj- aj trojciferné, sčítame.", R`81 + 648 = 729`]
   ],
   res:"729 čísel."},
  {warn:R`Pred sčítaním skontroluj, či sa prípady neprekrývajú. „Deliteľné 2 alebo 3“ nie je $15 + 10$, ale $15 + 10 - 5$.`}
],

"Stromový diagram a vypisovanie":[
  R`**Stromový diagram** zakreslí každú možnosť ako jednu vetvu: z koreňa vychádza toľko čiar, koľko je možností v prvom kroku, z každej ich koncovej bodky toľko, koľko je v druhom kroku… Strom sa hodí, keď je možností málo alebo keď ich treba vypísať.`,
  {tool:"strom", ask:R`Tri hody mincou, $L$ je líc, $R$ rub. Klikni na koniec vetvy a pozri, ktorý výsledok predstavuje.`,
   take:R`strom má $2 \cdot 2 \cdot 2 = 8$ vetiev, každá je jedna postupnosť troch hodov.`,
   cfg:{typ:"strom", volby:[2, 2, 2], nazvy:["1. hod", "2. hod", "3. hod"], mena:[["L", "R"], ["L", "R"], ["L", "R"]], lock:["n1", "n2", "n3"]}},
  {tool:"strom", kind:"uloha", ask:R`Klikni na vetvu, v ktorej padol líc **práve dvakrát**. Koľko takých vetiev je?`,
   hint:"Napríklad L – L – R. Takých vetiev sú tri: LLR, LRL, RLL.",
   goal:(P, st) => !!S(st) && !!S(st).vetva && (S(st).vetva.match(/L/g) || []).length === 2,
   cfg:{typ:"strom", volby:[2, 2, 2], nazvy:["1. hod", "2. hod", "3. hod"], mena:[["L", "R"], ["L", "R"], ["L", "R"]], lock:["n1", "n2", "n3"]}},
  R`Pri **vypisovaní** postupuj podľa pravidla, aby si nič nevynechal a nič nezopakoval: napríklad „abecedne“ a pri výbere bez poradia vždy len dvojice s väčším druhým prvkom.`,
  {tool:"strom", ask:R`Výber 2 zo 4 prvkov $A$, $B$, $C$, $D$, poradie nezáleží. Pozri vypísaný zoznam: v akom poradí sú dvojice?`,
   take:R`$AB, AC, AD, BC, BD, CD$: po $A$ idú všetky väčšie, po $B$ už len $C$ a $D$. Tak sa žiadna dvojica nezopakuje.`,
   cfg:{typ:"vyber", n:L(4), k:L(2), on:{poradie:false}}},
  {ex:R`Zápas sa hrá na dva víťazné sety. Vypíš všetky možné priebehy zápasu medzi hráčmi $A$ a $B$.`,
   steps:[
     ["Po dvoch setoch 2 : 0 zápas končí.", R`AA,\ BB`],
     ["Pri stave 1 : 1 rozhodne tretí set.", R`ABA,\ ABB,\ BAA,\ BAB`],
     ["Spolu.", R`2 + 4 = 6`]
   ],
   res:"6 priebehov. Vetvy stromu sú rôzne dlhé, preto tu pravidlo súčinu nefunguje, kým to nerozdelíš na prípady."},
  {ex:R`Hodíme trikrát mincou. Koľko je výsledkov, v ktorých padol líc aspoň dvakrát?`,
   steps:[
     ["Práve dvakrát líc.", R`LLR,\ LRL,\ RLL`],
     ["Trikrát líc.", R`LLL`],
     ["Spolu.", R`3 + 1 = 4`]
   ],
   res:"4 výsledky z 8."},
  {warn:R`Pri vypisovaní sa ľahko stane, že $AB$ a $BA$ započítaš dvakrát, hoci ide o tú istú dvojicu. Najprv si ujasni, či na poradí záleží ([[a40]]).`}
]

  }
};
})();

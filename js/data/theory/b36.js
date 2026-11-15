/* Variácie a permutácie s opakovaním */
(() => {
const L = v => ({v, lock:true});
const S = st => st.h && st.h.strom;

THEORY.b36 = {
  mins:20,
  brief:[
    R`**Variácie s opakovaním** $k$-tej triedy z $n$ prvkov: usporiadané $k$-tice, prvky sa môžu opakovať. $V'_k(n) = n^k$.`,
    R`**Permutácie s opakovaním**: poradia $n$ prvkov, medzi ktorými sú rovnaké (písmená slova MAMA).`,
    R`$P'(k_1, k_2, \dots) = \frac{n!}{k_1!\,k_2! \cdots}$, kde $k_i$ je počet rovnakých prvkov $i$-tého druhu.`,
    R`Pri opakovaní sa $k$ môže byť aj väčšie ako $n$: kód z dvoch cifier 0 a 1 môže mať 8 miest.`
  ],
  subs:{

"Variácie s opakovaním":[
  R`Pri PIN kóde, ŠPZ či tipovaní zápasov **na poradí záleží** a ten istý prvok sa môže **zopakovať**. Na každé miesto je preto stále rovnaký počet $n$ možností a podľa pravidla súčinu ([[a38]]) ich je $n \cdot n \cdots n$.`,
  {def:"Variácie s opakovaním", tex:R`V'_{\vb{k}}(\va{n}) = \va{n}^{\vb{k}}`,
   note:"n je počet druhov prvkov, k počet miest. Tu k smie byť väčšie ako n."},
  {tool:"strom", ask:R`Trojmiestne kódy z cifier 1, 2, 3, cifry sa môžu opakovať. Meň $n$ a $k$ a sleduj počet vetiev.`,
   take:R`z každého uzla vychádza stále $n$ vetiev, lebo použitá cifra sa môže zopakovať. Spolu $n^k$.`,
   cfg:{typ:"vyber", n:3, k:3, prvky:"12345", on:{poradie:true, opak:true}, lock:["poradie", "opak"]}},
  {ex:R`Koľko je päťciferných čísel zložených len z cifier 1, 2, 3?`,
   steps:[
     ["Na každom z 5 miest je jedna z 3 cifier, cifry sa opakujú.", R`V'_5(3) = 3^5`],
     ["Výpočet.", R`3^5 = 243`]
   ],
   res:"243 čísel."},
  {ex:R`V tipovacej súťaži sa pri každom z 10 zápasov tipuje 1 (výhra domácich), X (remíza) alebo 2. Koľko je rôznych tiketov?`,
   steps:[
     ["10 miest, na každom 3 možnosti.", R`3^{10}`],
     ["Výpočet.", R`3^{10} = 59\,049`]
   ],
   res:"59 049 tiketov."},
  {ex:R`Koľko je štvorciferných čísel (cifry sa môžu opakovať)?`,
   steps:[
     ["Prvá cifra nesmie byť 0.", R`9`],
     ["Ostatné tri miesta: ľubovoľná cifra.", R`10^3`],
     ["Spolu.", R`9 \cdot 10^3 = 9\,000`]
   ],
   res:"9 000 čísel (od 1 000 po 9 999)."},
  {tool:"strom", kind:"uloha", ask:R`Nastav $n$ a $k$ tak, aby bolo práve 8 variácií s opakovaním.`,
   hint:"8 = 2³: dva prvky, tri miesta.",
   goal:(P, st) => !!S(st) && S(st).N === 8,
   cfg:{typ:"vyber", n:3, k:2, prvky:"01234", on:{poradie:true, opak:true}, lock:["poradie", "opak"]}},
  {tip:R`Počet všetkých podmnožín $n$-prvkovej množiny je $2^n$: pri každom prvku sa rozhodneme „áno“ alebo „nie“, to je variácia s opakovaním z 2 prvkov.`, label:"Súvislosť"},
  {warn:R`Nezamieňaj $n^k$ a $k^n$. Základ je počet možností na jednom mieste, exponent je počet miest. PIN s 4 miestami z 10 cifier: $10^4$, nie $4^{10}$.`}
],

"Permutácie s opakovaním":[
  R`Koľko rôznych „slov“ vznikne z písmen slova MAMA? Keby boli všetky písmená rôzne ($M_1 A_1 M_2 A_2$), bolo by ich $4! = 24$. Výmenou dvoch $M$ alebo dvoch $A$ sa však slovo nezmení, preto je každé zarátané $2! \cdot 2! = 4$-krát.`,
  {def:"Permutácie s opakovaním", tex:R`P'(\va{k_1}, \vb{k_2}, \dots, \vd{k_m}) = \frac{n!}{\va{k_1}!\,\vb{k_2}! \cdots \vd{k_m}!} \qquad n = \va{k_1} + \vb{k_2} + \dots + \vd{k_m}`,
   note:"kᵢ je počet rovnakých prvkov i-tého druhu. Prvky, ktoré sú len raz, majú 1! = 1 a dajú sa vynechať."},
  {tool:"strom", ask:R`Poradia písmen slova MAMA. Po kliknutí na „Odomknúť všetko“ môžeš do poľa napísať iné slovo (najviac 8 písmen). Porovnaj počet so vzorcom.`,
   take:R`$\frac{4!}{2!\,2!} = 6$. Čím viac rovnakých písmen, tým menej rôznych poradí.`,
   cfg:{typ:"slovo", slovo:"MAMA"}},
  {ex:R`Koľko rôznych slov (aj nezmyselných) vznikne preusporiadaním písmen slova MATEMATIKA?`,
   steps:[
     ["Spočítame písmená: M dvakrát, A trikrát, T dvakrát, E, I, K po jednom.", R`n = 10`],
     ["Vzorec.", R`\frac{10!}{2!\,3!\,2!} = \frac{3\,628\,800}{2 \cdot 6 \cdot 2}`],
     ["Výpočet.", R`= \frac{3\,628\,800}{24} = 151\,200`]
   ],
   res:"151 200 slov."},
  {tool:"strom", kind:"uloha", ask:R`Klikni na „Odomknúť všetko“ a napíš do poľa slovo zo 4 písmen, ktoré má presne 12 rôznych poradí.`,
   hint:"4!/2! = 12: jedno písmeno dvakrát, dve ďalšie po jednom, napríklad ANNE alebo KOLO.",
   goal:(P, st) => !!S(st) && S(st).druh === "slovo" && S(st).N === 12,
   cfg:{typ:"slovo", slovo:"MAMA"}},
  {ex:R`V mriežke ideme z ľavého dolného rohu do bodu, ktorý je o 4 políčka vpravo a 3 hore, len krokmi vpravo (V) a hore (H). Koľko je najkratších ciest?`,
   steps:[
     ["Každá cesta je slovo zo 4 písmen V a 3 písmen H.", R`n = 7`],
     ["Permutácie s opakovaním.", R`\frac{7!}{4!\,3!} = \frac{5\,040}{24 \cdot 6} = 35`]
   ],
   res:R`35 ciest. Je to aj $\binom{7}{3}$: vyberáme, ktoré 3 zo 7 krokov idú hore.`},
  {tool:"strom", kind:"uloha", ask:R`Poradia slova ANNA. Klikni na poradie, ktoré je palindróm (číta sa rovnako odpredu aj odzadu).`,
   hint:"ANNA a NAAN.",
   goal:(P, st) => !!S(st) && !!S(st).vetva && S(st).vetva === S(st).vetva.split("").reverse().join(""),
   cfg:{typ:"slovo", slovo:"ANNA"}},
  {ex:R`Na poličku chceme postaviť 3 rovnaké červené, 2 rovnaké modré a 1 zelenú vázu. Koľko je rôznych rozostavení?`,
   steps:[
     ["Šesť váz, rovnaké farby sa nerozlišujú.", R`\frac{6!}{3!\,2!\,1!}`],
     ["Výpočet.", R`\frac{720}{6 \cdot 2} = 60`]
   ],
   res:"60 rozostavení."},
  {warn:R`Delí sa faktoriálmi **počtov** rovnakých prvkov, nie počtom druhov. MAMA: $\frac{4!}{2!\,2!}$, nie $\frac{4!}{2}$.`}
]

  }
};
})();

/* Variácie, permutácie, kombinácie bez opakovania */
(() => {
const L = v => ({v, lock:true});
const S = st => st.h && st.h.strom;

THEORY.a40 = {
  mins:30,
  brief:[
    R`**Variácie** $k$-tej triedy z $n$ prvkov: usporiadané $k$-tice rôznych prvkov. $V_k(n) = \frac{n!}{(n - k)!}$.`,
    R`**Permutácie**: všetky prvky v nejakom poradí. $P(n) = n!$.`,
    R`**Kombinácie** $k$-tej triedy z $n$ prvkov: $k$-prvkové skupiny, poradie nezáleží. $C_k(n) = \binom{n}{k}$.`,
    R`Typ úlohy: záleží na poradí? Vyberáme všetky prvky? Môžu sa opakovať?`
  ],
  subs:{

"Variácie":[
  R`Z $n$ rôznych prvkov vyberáme $k$ a **záleží na poradí**: prvé, druhé, tretie miesto, predseda a podpredseda, cifry čísla. Taký výber je **variácia** $k$-tej triedy. Podľa pravidla súčinu máme $n$ možností na prvé miesto, $n - 1$ na druhé …`,
  {def:"Variácie bez opakovania", tex:R`V_{\vb{k}}(\va{n}) = \va{n}(\va{n} - 1) \cdots (\va{n} - \vb{k} + 1) = \frac{\va{n}!}{(\va{n} - \vb{k})!}`,
   note:"k činiteľov od n nadol."},
  {tool:"strom", ask:R`Výber 2 zo 4 prvkov, na poradí záleží. Meň $n$ a $k$ a sleduj počet vetiev.`,
   take:R`$AB$ a $BA$ sú dve rôzne vetvy. Vetiev je $n(n - 1) \cdots$, spolu $k$ činiteľov.`,
   cfg:{typ:"vyber", n:4, k:2, on:{poradie:true}, lock:["poradie", "opak"]}},
  {ex:R`Na pretekoch beží 8 bežcov. Koľkými spôsobmi môžu byť obsadené medailové miesta?`,
   steps:[
     ["Záleží na poradí (zlato, striebro, bronz), bežec nemôže mať dve medaily.", R`V_3(8)`],
     ["Tri činitele od 8 nadol.", R`8 \cdot 7 \cdot 6 = 336`]
   ],
   res:"336 spôsobov."},
  {ex:R`Z 10 členov klubu treba zvoliť predsedu, podpredsedu a pokladníka. Koľko je možností?`,
   steps:[
     ["Funkcie sú rôzne, záleží na tom, kto má ktorú.", R`V_3(10)`],
     ["Výpočet.", R`10 \cdot 9 \cdot 8 = 720`]
   ],
   res:"720 možností."},
  {tool:"strom", kind:"uloha", ask:R`Nastav $n$ a $k$ tak, aby bolo práve 20 variácií.`,
   hint:"20 = 5 · 4.",
   goal:(P, st) => !!S(st) && S(st).N === 20,
   cfg:{typ:"vyber", n:3, k:1, on:{poradie:true}, lock:["poradie", "opak"]}},
  {warn:R`Pri variáciách sa nedelí $k!$. To patrí ku kombináciám, kde na poradí nezáleží.`}
],

"Permutácie":[
  R`**Permutácia** je variácia, v ktorej použijeme všetky prvky: $k = n$. Je to jedno poradie všetkých $n$ prvkov, napríklad zasadací poriadok alebo poradie písmen slova s rôznymi písmenami.`,
  {def:"Permutácie bez opakovania", tex:R`P(\va{n}) = V_{\va{n}}(\va{n}) = \va{n}!`},
  {tool:"strom", ask:R`Permutácie: drž $k = n$ a zvyšuj obe čísla z 3 na 4 (a ďalej). Ako rýchlo rastie počet poradí?`,
   take:R`$3! = 6$, $4! = 24$, $5! = 120$: každý ďalší prvok sa dá vložiť na viac miest.`,
   cfg:{typ:"vyber", n:3, k:3, on:{poradie:true}, lock:["poradie", "opak"]}},
  {ex:R`Koľkými spôsobmi sa dá zoradiť 6 ľudí do radu? A koľkými, ak Jana a Peter chcú stáť vedľa seba?`,
   steps:[
     ["Všetci v poradí.", R`6! = 720`],
     ["Jana a Peter ako jeden „blok“: zoraďujeme 5 objektov.", R`5! = 120`],
     ["V bloku môžu stáť dvoma spôsobmi (JP, PJ).", R`2 \cdot 120 = 240`]
   ],
   res:"720 poradí, z toho 240 s Janou a Petrom vedľa seba."},
  {ex:R`Koľko „slov“ (aj nezmyselných) vznikne preusporiadaním písmen slova KNIHA? Koľko z nich sa začína na K?`,
   steps:[
     ["Päť rôznych písmen.", R`5! = 120`],
     ["K je pevne na začiatku, zvyšné 4 písmená ľubovoľne.", R`4! = 24`]
   ],
   res:"120 slov, 24 z nich sa začína na K."},
  {warn:R`Pri podmienke „vedľa seba“ nezabudni na poradie vnútri bloku. A pri slovách s opakovanými písmenami (MAMA) je poradí menej, to je [[b36]].`}
],

"Kombinácie":[
  R`**Kombinácia** $k$-tej triedy z $n$ prvkov je $k$-prvková skupina, v ktorej **na poradí nezáleží**: družstvo, trojica kopčekov zmrzliny, čísla v lotérii. Každú skupinu sa dá zoradiť $k!$ spôsobmi, preto je kombinácií $k!$-krát menej ako variácií.`,
  {def:"Kombinácie bez opakovania", tex:R`C_{\vb{k}}(\va{n}) = \frac{V_{\vb{k}}(\va{n})}{\vb{k}!} = \binom{\va{n}}{\vb{k}} = \frac{\va{n}!}{\vb{k}!\,(\va{n} - \vb{k})!}`},
  {tool:"strom", ask:R`Výber 2 zo 4 prvkov. Prepínaj „Záleží na poradí“ a porovnaj počty.`,
   take:R`s poradím 12, bez poradia 6. Každá dvojica $\{A, B\}$ je v strome dvakrát, ako $AB$ aj $BA$.`,
   cfg:{typ:"vyber", n:L(4), k:L(2), lock:["opak"], toggles:["poradie"]}},
  {ex:R`Na stretnutí je 8 ľudí a každý si podá ruku s každým. Koľko je podaní rúk?`,
   steps:[
     ["Podanie rúk je dvojica ľudí, poradie nezáleží.", R`C_2(8) = \binom{8}{2}`],
     ["Výpočet.", R`\frac{8 \cdot 7}{2} = 28`]
   ],
   res:"28 podaní rúk."},
  {ex:R`V triede je 5 chlapcov a 4 dievčatá. Koľkými spôsobmi sa dá vybrať trojčlenné družstvo s 2 chlapcami a 1 dievčaťom?`,
   steps:[
     ["Chlapci: 2 z 5.", R`\binom{5}{2} = 10`],
     ["Dievča: 1 zo 4.", R`\binom{4}{1} = 4`],
     ["Výber chlapcov a výber dievčaťa: pravidlo súčinu.", R`10 \cdot 4 = 40`]
   ],
   res:"40 družstiev."},
  {ex:R`V lotérii sa ťahá 5 čísel z 35. Koľko je rôznych výsledkov ťahania?`,
   steps:[
     ["Na poradí ťahania nezáleží.", R`\binom{35}{5}`],
     ["Výpočet.", R`\frac{35 \cdot 34 \cdot 33 \cdot 32 \cdot 31}{5!} = \frac{38\,955\,840}{120} = 324\,632`]
   ],
   res:"324 632 výsledkov."},
  {warn:R`„Vyberáme“ ešte neznamená kombinácie. Ak vybraní dostanú rôzne úlohy (predseda, pokladník), na poradí záleží a sú to variácie.`}
],

"Rozpoznanie typu úlohy":[
  R`Najťažšie býva rozhodnúť, o aký typ ide. Pomôžu tri otázky. Najdôležitejšia je prvá: **dostanem iný výsledok, keď vybrané prvky vymením?**`,
  {steps:[
    {t:"Záleží na poradí?", d:"Ak výmena dvoch prvkov dá iný výsledok (iné číslo, iné poradie, iné funkcie), áno: variácie alebo permutácie. Inak kombinácie."},
    {t:"Berieme všetky prvky?", d:"Ak áno a na poradí záleží: permutácie, n!."},
    {t:"Môžu sa prvky opakovať?", d:"Cifry PIN kódu áno, ľudia v družstve nie. S opakovaním: n^k ([[b36]])."}
  ]},
  {cards:[
    {t:"Variácie", d:"Poradie áno, k z n.", tex:R`\frac{n!}{(n - k)!}`},
    {t:"Permutácie", d:"Poradie áno, všetkých n.", tex:R`n!`},
    {t:"Kombinácie", d:"Poradie nie, k z n.", tex:R`\binom{n}{k}`},
    {t:"Variácie s opakovaním", d:"Poradie áno, prvky sa môžu opakovať.", tex:R`n^k`}
  ]},
  {tool:"strom", ask:R`Výber 2 z 3 prvkov. Prepínaj oba spínače a pre každú zo štyroch kombinácií si zapíš počet.`,
   take:R`poradie áno: 6 (s opakovaním 9), poradie nie: 3 (s opakovaním 6). Spínače zodpovedajú otázkam vyššie.`,
   cfg:{typ:"vyber", n:L(3), k:L(2), prvky:"ABC", toggles:["poradie", "opak"]}},
  {ex:R`Urči typ a vypočítaj: (a) trojciferný kód zámku z cifier 1 až 5, cifry sa môžu opakovať; (b) 3 rôzne kopčeky zmrzliny z 8 druhov do kornútika, poradie nezáleží; (c) 3 rôzne ceny pre 10 súťažiacich, každý najviac jednu.`,
   steps:[
     ["(a) Poradie áno, opakovanie áno.", R`5^3 = 125`],
     ["(b) Poradie nie, bez opakovania.", R`\binom{8}{3} = \frac{8 \cdot 7 \cdot 6}{6} = 56`],
     ["(c) Ceny sú rôzne, záleží, kto ktorú dostane.", R`V_3(10) = 10 \cdot 9 \cdot 8 = 720`]
   ],
   res:"(a) 125, (b) 56, (c) 720."},
  {tool:"strom", kind:"uloha", ask:R`Zo 4 hráčov ($A$ až $D$) treba vybrať kapitána a jeho zástupcu. Nastav spínače tak, aby zodpovedali úlohe.`,
   hint:"Kapitán a zástupca sú rôzne funkcie, jeden hráč nemôže mať obe.",
   take:R`variácie $V_2(4) = 12$: dvojica $AB$ (kapitán $A$) je iná ako $BA$.`,
   goal:(P, st) => !!S(st) && S(st).druh === "variacie",
   cfg:{typ:"vyber", n:L(4), k:L(2), prvky:"ABCD", toggles:["poradie", "opak"]}},
  {warn:R`Netipuj typ podľa slov („vyber“, „usporiadaj“). Vždy si predstav dva konkrétne výsledky, ktoré sa líšia len poradím, a spýtaj sa, či sú to dve rôzne možnosti.`}
]

  }
};
})();

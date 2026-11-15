/* Faktoriál a kombinačné číslo */
(() => {
const L = v => ({v, lock:true});
const pas = st => st.h && st.h.pas;

THEORY.a39 = {
  mins:20,
  brief:[
    R`$n! = n \cdot (n - 1) \cdots 2 \cdot 1$, navyše $0! = 1$. Je to počet poradí $n$ rôznych prvkov.`,
    R`$n! = n \cdot (n - 1)!$: pri zlomkoch s faktoriálmi krát, nepočítaj ich celé.`,
    R`Kombinačné číslo $\binom{n}{k} = \frac{n!}{k!\,(n - k)!}$ je počet $k$-prvkových podmnožín $n$-prvkovej množiny.`,
    R`$\binom{n}{0} = \binom{n}{n} = 1$, $\binom{n}{1} = n$, $\binom{n}{k} = \binom{n}{n - k}$.`
  ],
  subs:{

"Faktoriál":[
  R`Koľkými spôsobmi sa dá zoradiť $n$ rôznych vecí? Na prvé miesto máš $n$ možností, na druhé $n - 1$ … na posledné jednu. Tento súčin sa volá **faktoriál** a píše sa s výkričníkom.`,
  {def:"Faktoriál", tex:R`\va{n}! = \va{n} \cdot (\va{n} - 1) \cdot (\va{n} - 2) \cdots 2 \cdot 1 \qquad 0! = 1 \qquad \va{n}! = \va{n} \cdot (\va{n} - 1)!`,
   note:"0! = 1 je dohoda: prázdnu množinu sa dá zoradiť jediným spôsobom, a vzorec n! = n · (n − 1)! potom platí aj pre n = 1."},
  {tool:"strom", ask:R`Poradia 4 prvkov ako strom. Koľko vetiev má každé poschodie stromu menej?`,
   take:R`na prvom mieste 4 možnosti, potom 3, 2, 1. Vetiev je $4! = 24$.`,
   cfg:{typ:"vyber", n:L(4), k:L(4), on:{poradie:true}, lock:["poradie", "opak"]}},
  {tool:"pascal", ask:R`Tabuľka faktoriálov. Ako vznikne každý riadok z predošlého?`,
   take:R`$n!$ je predošlý faktoriál krát $n$. Faktoriál rastie veľmi rýchlo: $10!$ je už vyše troch miliónov.`,
   cfg:{typ:"faktorial"}},
  {ex:R`Vypočítaj $\frac{7!}{5!}$ a zjednoduš $\frac{(n + 1)!}{(n - 1)!}$.`,
   steps:[
     [R`$7! = 7 \cdot 6 \cdot 5!$, krátime $5!$.`, R`\frac{7!}{5!} = 7 \cdot 6 = 42`],
     [R`$(n + 1)! = (n + 1) \cdot n \cdot (n - 1)!$, krátime $(n - 1)!$.`, R`\frac{(n + 1)!}{(n - 1)!} = (n + 1)\,n`]
   ],
   res:R`$42$ a $n(n + 1)$ pre $n \geq 1$.`},
  {ex:R`Rieš rovnicu $\frac{(n + 1)!}{(n - 1)!} = 30$.`,
   steps:[
     ["Zjednodušíme ľavú stranu (príklad vyššie).", R`n(n + 1) = 30`],
     ["Kvadratická rovnica.", R`n^2 + n - 30 = 0 \Rightarrow (n + 6)(n - 5) = 0`],
     [R`$n$ musí byť prirodzené, $-6$ vypadne.`, R`n = 5`],
     ["Skúška.", R`\frac{6!}{4!} = 6 \cdot 5 = 30`]
   ],
   res:R`$n = 5$.`},
  {tool:"pascal", kind:"uloha", ask:R`Nájdi najmenšie $n$, pre ktoré je $n!$ väčšie ako milión.`,
   hint:"9! = 362 880, to ešte nestačí.",
   goal:P => P.n === 10,
   cfg:{typ:"faktorial", n:{v:4, min:0, max:10}}},
  {warn:R`$(2n)!$ nie je $2 \cdot n!$ a $\frac{8!}{4!}$ nie je $2!$. Faktoriály sa nedelia ako čísla, krátia sa rozpísaním: $\frac{8!}{4!} = 8 \cdot 7 \cdot 6 \cdot 5 = 1\,680$.`}
],

"Kombinačné číslo":[
  R`Koľkými spôsobmi sa dá z $n$ vecí vybrať $k$, keď na poradí nezáleží? Ak by na poradí záležalo, bolo by ich $n \cdot (n - 1) \cdots (n - k + 1)$. Každá skupina je však v tomto počte zarátaná $k!$-krát (toľko má poradí), preto ním vydelíme.`,
  {def:"Kombinačné číslo", tex:R`\binom{\va{n}}{\vb{k}} = \frac{\va{n}!}{\vb{k}!\,(\va{n} - \vb{k})!} = \frac{\va{n}(\va{n} - 1) \cdots (\va{n} - \vb{k} + 1)}{\vb{k}!}`,
   note:"Číta sa „n nad k“. Prakticky: v čitateli k činiteľov od n nadol, v menovateli k!."},
  {tool:"pascal", ask:R`Meň $n$ a $k$ a sleduj, ako sa faktoriály krátia.`,
   take:R`z $n!$ ostane po krátení s $(n - k)!$ práve $k$ činiteľov a tie sa vydelia $k!$. Výsledok je vždy celé číslo.`,
   cfg:{typ:"cislo"}},
  {def:"Vlastnosti", tex:R`\binom{n}{0} = \binom{n}{n} = 1 \qquad \binom{n}{1} = n \qquad \binom{n}{k} = \binom{n}{n - k}`,
   note:"Vybrať k vecí je to isté ako vybrať n − k vecí, ktoré ostanú. Preto počítaj s menším z čísel k a n − k."},
  {ex:R`Koľkými spôsobmi môže učiteľ vybrať 3 žiakov z 12 na súťaž?`,
   steps:[
     ["Na poradí nezáleží, je to kombinačné číslo.", R`\binom{12}{3}`],
     ["Tri činitele od 12 nadol, deleno 3!.", R`\frac{12 \cdot 11 \cdot 10}{3 \cdot 2 \cdot 1} = \frac{1\,320}{6} = 220`]
   ],
   res:"220 spôsobov."},
  {ex:R`Vypočítaj $\binom{20}{18}$.`,
   steps:[
     ["Súmernosť: počítaj s menším číslom.", R`\binom{20}{18} = \binom{20}{2}`],
     ["Výpočet.", R`\frac{20 \cdot 19}{2} = 190`]
   ],
   res:"190."},
  {tool:"pascal", kind:"uloha", ask:R`Nastav $n$ a $k$ tak, aby $\binom{n}{k} = 35$.`,
   hint:"Skús n = 7. Riešenia sú dve, k a n − k.",
   goal:(P, st) => !!pas(st) && pas(st).C === 35,
   cfg:{typ:"cislo", n:{v:5, min:1, max:10}, k:{v:2, min:0, max:10}}},
  {ex:R`Rieš rovnicu $\binom{n}{2} = 21$.`,
   steps:[
     ["Rozpíšeme.", R`\frac{n(n - 1)}{2} = 21 \Rightarrow n^2 - n - 42 = 0`],
     ["Rozklad.", R`(n - 7)(n + 6) = 0`],
     [R`$n \geq 2$ prirodzené.`, R`n = 7`]
   ],
   res:R`$n = 7$.`},
  {tip:R`Kombinačné čísla tvoria Pascalov trojuholník, každé je súčtom dvoch nad ním. Viac v [[b37]].`, label:"Súvislosť"},
  {warn:R`$\binom{n}{k}$ nie je zlomok $\frac{n}{k}$. A $\binom{n}{k}$ má zmysel len pre $0 \leq k \leq n$.`}
]

  }
};
})();

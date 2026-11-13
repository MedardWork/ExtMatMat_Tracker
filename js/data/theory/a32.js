/* Zhodnosť a podobnosť trojuholníkov (sss, sus, usu, Ssu, uu) */
(() => {
const L = v => ({v, lock:true});

THEORY.a32 = {
  mins:30,
  brief:[
    R`Zhodné trojuholníky majú rovnaké všetky strany aj uhly. Stačí overiť jednu vetu: sss, sus, usu alebo Ssu.`,
    R`Podobné trojuholníky majú rovnaké uhly a strany v rovnakom pomere $k$. Stačí, aby sa zhodovali v dvoch uhloch (uu).`,
    R`Pri podobnosti s pomerom $k$ sa dĺžky zväčšia $k$-krát, obsahy $k^2$-krát, objemy $k^3$-krát.`
  ],
  subs:{

"Vety o zhodnosti (sss, sus, usu, Ssu)":[
  R`Dva trojuholníky sú **zhodné**, ak sa dajú presne prekryť: majú rovnaké strany aj uhly. Netreba však overovať všetkých šesť údajov. Trojuholník je jednoznačne určený už tromi vhodnými údajmi.`,
  {cards:[
    {t:"sss", d:"Všetky tri strany sú rovnaké."},
    {t:"sus", d:"Dve strany a uhol, ktorý **zvierajú**."},
    {t:"usu", d:"Strana a dva uhly **priľahlé** k nej."},
    {t:"Ssu", d:"Dve strany a uhol oproti **väčšej** z nich."}
  ]},
  {tool:"podobnost", ask:R`Dve strany $\va{a}$, $\vb{b}$ a uhol $\gamma$ medzi nimi (veta sus). Meň ich. Je trojuholník nimi úplne určený?`,
   take:R`áno, tretia strana aj ostatné uhly vyjdú jednoznačne. Preto dva trojuholníky s rovnakými $a$, $b$, $\gamma$ sú zhodné.`,
   cfg:{typ:"trojuholniky", k:L(1)}},
  {ex:R`Ktorou vetou dokážeš zhodnosť? a) $a = 5$, $b = 7$, $\gamma = 40^\circ$. b) $c = 6$, $\alpha = 50^\circ$, $\beta = 60^\circ$. c) $a = 4$, $b = 6$, $\beta = 70^\circ$.`,
   steps:[
     [R`a) $\gamma$ leží medzi $a$ a $b$.`, R`\text{sus}`],
     [R`b) $\alpha$, $\beta$ priliehajú k strane $c$.`, R`\text{usu}`],
     [R`c) $\beta$ leží oproti $b$, ktorá je väčšia.`, R`\text{Ssu}`]
   ],
   res:"sus, usu, Ssu."},
  {ex:R`Dokáž, že uhlopriečka rozdelí rovnobežník na dva zhodné trojuholníky.`,
   steps:[
     [R`Rovnobežník $ABCD$, uhlopriečka $AC$. Protiľahlé strany sú zhodné.`, R`|AB| = |CD|,\quad |BC| = |DA|`],
     [R`Strana $AC$ je spoločná.`, R`\triangle ABC \cong \triangle CDA \ (\text{sss})`]
   ],
   res:"Trojuholníky sú zhodné podľa vety sss."},
  {warn:R`„ssu“ s uhlom oproti **menšej** strane zhodnosť nezaručuje: s takými údajmi môžu vzniknúť dva rôzne trojuholníky. Preto veľké S: uhol musí ležať oproti väčšej strane.`}
],

"Podobnosť trojuholníkov (uu)":[
  R`**Podobné** trojuholníky majú rovnaký tvar, môžu sa líšiť veľkosťou. Všetky uhly sú rovnaké a strany sú v rovnakom pomere $k$ (**koeficient podobnosti**). Keďže súčet uhlov je $180^\circ$, stačia dva rovnaké uhly.`,
  {def:"Podobnosť", tex:R`\triangle ABC \sim \triangle A'B'C' \;\Leftrightarrow\; \frac{a'}{a} = \frac{b'}{b} = \frac{c'}{c} = \vd{k}`, note:"Veta uu: ak sa trojuholníky zhodujú v dvoch uhloch, sú podobné."},
  {tool:"podobnost", ask:R`Meň koeficient $\vd{k}$. Čo sa deje s uhlami a čo so stranami?`,
   take:R`uhly sa nemenia, každá strana sa vynásobí tým istým $k$. Pri $k < 1$ je kópia menšia.`,
   cfg:{typ:"trojuholniky"}},
  {tool:"podobnost", ask:R`Tyč výšky $\va{h_1}$ vrhá tieň $\vb{s_1}$. V tom istom čase vrhá strom tieň $\vb{s_2}$. Prečo sa dá vypočítať výška stromu?`,
   take:R`slnečné lúče sú rovnobežné, trojuholníky tyč–tieň a strom–tieň majú rovnaké uhly, sú podobné. Platí $\frac{h_2}{s_2} = \frac{h_1}{s_1}$.`,
   cfg:{typ:"tien"}},
  {ex:R`Tyč dlhá 2 m vrhá tieň 3 m. Strom vrhá tieň 12 m. Aký je vysoký?`,
   steps:[
     ["Trojuholníky sú podobné.", R`\frac{h}{12} = \frac{2}{3}`],
     ["Vyjadri.", R`h = 12 \cdot \frac{2}{3} = 8`]
   ],
   res:"8 m."},
  {ex:R`V trojuholníku $ABC$ je $|AB| = 12$. Priamka rovnobežná s $AB$ pretne $AC$ v bode $X$ a $BC$ v $Y$, pričom $|CX| = 4$ a $|CA| = 10$. Aké dlhé je $XY$?`,
   steps:[
     [R`Trojuholníky $XYC$ a $ABC$ majú spoločný uhol pri $C$ a súhlasné uhly pri rovnobežkách: uu.`, R`k = \frac{|CX|}{|CA|} = \frac{4}{10} = 0{,}4`],
     ["Prenásob.", R`|XY| = 0{,}4 \cdot 12 = 4{,}8`]
   ],
   res:R`$|XY| = 4{,}8$`},
  {tool:"podobnost", kind:"uloha", ask:R`Tyč 2 m vrhá tieň 3 m. Nastav dĺžku tieňa stromu $\vb{s_2}$ tak, aby bol strom vysoký 10 m.`,
   hint:R`$\frac{10}{s_2} = \frac{2}{3}$.`,
   goal:P => P.s2 === 15,
   cfg:{typ:"tien", h1:L(2), s1:L(3), s2:{v:6}}},
  {warn:R`Pri podobnosti treba dávať do pomeru **zodpovedajúce** strany: tie, ktoré ležia oproti rovnakým uhlom. Najistejšie je trojuholníky nakresliť v rovnakej polohe.`}
],

"Pomer podobnosti — dĺžky a obsahy":[
  R`Ak sa všetky dĺžky zväčšia $k$-krát, obsah sa zväčší $k^2$-krát: obsah je súčin dvoch dĺžok. Objem telies je súčin troch dĺžok, zväčší sa $k^3$-krát.`,
  {def:"Pomer obsahov a objemov", tex:R`\frac{S'}{S} = \vd{k}^2,\qquad \frac{V'}{V} = \vd{k}^3`},
  {tool:"podobnost", ask:R`Zapni porovnanie obsahov a meň $\vd{k}$. Koľkokrát väčší obsah má kópia pri $k = 2$ a $k = 3$?`,
   take:R`štyrikrát a deväťkrát. Do kópie pri $k = 2$ sa zmestia štyri pôvodné trojuholníky.`,
   cfg:{typ:"trojuholniky", on:{obsah:true}}},
  {ex:R`Strany trojuholníka sa zväčšili trikrát. Pôvodný obsah bol $5$ cm². Aký je nový?`,
   steps:[
     ["Pomer obsahov.", R`k^2 = 9`],
     ["Nový obsah.", R`S' = 9 \cdot 5 = 45`]
   ],
   res:R`$45$ cm².`},
  {ex:R`Na mape s mierkou $1 : 50\,000$ má les obsah 4 cm². Aký je jeho skutočný obsah?`,
   steps:[
     ["Dĺžky sú $50\\,000$-krát väčšie, obsahy $k^2$-krát.", R`4 \cdot 50\,000^2 = 4 \cdot 2{,}5 \cdot 10^9 = 10^{10} \text{ cm}^2`],
     [R`$1 \text{ km}^2 = 10^{10} \text{ cm}^2$.`, R`10^{10} \text{ cm}^2 = 1 \text{ km}^2`]
   ],
   res:R`$1$ km².`},
  {tool:"podobnost", kind:"uloha", ask:R`Nastav koeficient $\vd{k}$ tak, aby mala kópia štvornásobný obsah.`,
   hint:R`$k^2 = 4$.`,
   goal:P => P.k === 2,
   cfg:{typ:"trojuholniky", k:{v:1}, on:{obsah:true}}},
  {warn:R`Dvojnásobné rozmery neznamenajú dvojnásobný obsah. Pizza s dvojnásobným priemerom má štvornásobnú plochu.`}
]

  }
};
})();

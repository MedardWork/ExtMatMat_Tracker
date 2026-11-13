/* Trojuholník: ťažnice, ťažisko, stredná priečka, vpísaná a opísaná kružnica */
(() => {
const TRI = (on, extra) => Object.assign({on, pts:{A:[1, 1], B:[9, 1], C:[4, 7]}}, extra);
const kind = d => Math.max(d.alfa, d.beta, d.gama) > 90.0001 ? "tupouhlý" : Math.max(d.alfa, d.beta, d.gama) > 89.9999 ? "pravouhlý" : "ostrouhlý";
const kindPill = (h, d) => h.pill(kind(d), kind(d) === "ostrouhlý" ? "up" : kind(d) === "pravouhlý" ? "flat" : "down");

THEORY.a28 = {
  mins:25,
  brief:[
    R`**Ťažnica** spája vrchol so stredom protiľahlej strany. Ťažnice sa pretínajú v **ťažisku** $T$, ktoré delí každú v pomere $2 : 1$ (dlhší úsek pri vrchole).`,
    R`**Výška** je kolmica z vrcholu na protiľahlú stranu. $S = \dfrac{a \cdot v_a}{2}$. V tupouhlom trojuholníku padajú dve výšky mimo neho.`,
    R`**Stredná priečka** spája stredy dvoch strán. Je rovnobežná s treťou stranou a má jej polovičnú dĺžku.`,
    R`**Opísaná kružnica** prechádza vrcholmi, stred je priesečník **osí strán**. $r = \dfrac{abc}{4S}$, v pravouhlom $r = \dfrac{c}{2}$.`,
    R`**Vpísaná kružnica** sa dotýka strán, stred je priesečník **osí uhlov**. $\varrho = \dfrac{2S}{o}$.`
  ],
  subs:{

"Ťažnice a ťažisko":[
  R`**Ťažnica** je úsečka, ktorá spája vrchol trojuholníka so stredom protiľahlej strany. Každý trojuholník má tri ťažnice. Označujú sa $\va{t_a}$, $\va{t_b}$, $\va{t_c}$ podľa strany, do ktorej stredu vedú.`,
  {tool:"trojuholnik", ask:"Ťahaj vrcholy. Pretnú sa všetky tri ťažnice vždy v jednom bode?",
   take:"áno, vždy v jednom bode a vždy vnútri trojuholníka. Ten bod sa volá ťažisko a označuje sa $T$.",
   cfg:TRI({taznice:true}, {out:(P, h) => {
     const d = h.geo;
     return h.p(R`Ťažnice: $\va{t_a = ${h.tn(d.ta)}}$, $\va{t_b = ${h.tn(d.tb)}}$, $\va{t_c = ${h.tn(d.tc)}}$`)
       + h.p(R`$A_1$, $B_1$, $C_1$ sú stredy strán $a$, $b$, $c$.`) + kindPill(h, d);
   }})},
  "Ťažisko nie je hocikde na ťažnici. Leží vždy v dvoch tretinách cesty od vrcholu k stredu strany.",
  {def:"Ťažisko delí ťažnicu v pomere 2 : 1", mid:true, tex:R`|AT| = \tfrac{2}{3}\,\va{t_a}, \qquad |TA_1| = \tfrac{1}{3}\,\va{t_a}`,
   note:"Dlhší úsek je vždy pri vrchole. To isté platí pre $t_b$ a $t_c$."},
  {tool:"trojuholnik", ask:R`Ťahaj vrcholy a sleduj dĺžky úsekov $|AT|$ a $|TA_1|$. Mení sa ich pomer?`,
   take:R`dĺžky sa menia, pomer $2 : 1$ zostáva.`,
   cfg:TRI({taznice:true}, {out:(P, h) => {
     const d = h.geo;
     return h.calc(R`\va{t_a} = ${h.tn(d.ta)}`) + h.calc(R`|AT| = ${h.tn(d.ta * 2 / 3)}, \quad |TA_1| = ${h.tn(d.ta / 3)}`)
       + h.calc(R`\dfrac{|AT|}{|TA_1|} = \dfrac{${h.tn(d.ta * 2 / 3)}}{${h.tn(d.ta / 3)}} = 2`);
   }})},
  {ex:R`Ťažnica $t_a$ meria 9 cm. Ako ďaleko je ťažisko od vrcholu $A$ a ako ďaleko od stredu strany $a$?`,
   steps:[
     ["Od vrcholu sú to dve tretiny ťažnice.", R`|AT| = \tfrac{2}{3} \cdot 9 = 6\ \text{cm}`],
     ["Od stredu strany jedna tretina.", R`|TA_1| = \tfrac{1}{3} \cdot 9 = 3\ \text{cm}`]
   ],
   res:"Od vrcholu 6 cm, od stredu strany 3 cm."},
  {h:"Ťažisko zo súradníc"},
  "Ak poznáš súradnice vrcholov, ťažisko je ich priemer. Každú súradnicu spriemeruješ zvlášť.",
  {def:"Súradnice ťažiska", mid:true, tex:R`T = \left[\dfrac{x_A + x_B + x_C}{3};\ \dfrac{y_A + y_B + y_C}{3}\right]`},
  {ex:R`Trojuholník má vrcholy $A\,[1;\ 1]$, $B\,[7;\ 2]$, $C\,[4;\ 6]$. Nájdi ťažisko.`,
   steps:[
     ["Prvá súradnica.", R`\dfrac{1 + 7 + 4}{3} = 4`],
     ["Druhá súradnica.", R`\dfrac{1 + 2 + 6}{3} = 3`]
   ],
   res:R`$T\,[4;\ 3]$`},
  {tip:"Každá ťažnica delí trojuholník na dve časti s rovnakým obsahom. Majú rovnako dlhú základňu (polovicu strany) a spoločnú výšku.", label:"Súvislosť"},
  {warn:"Ťažnica, výška a os uhla z toho istého vrcholu sú vo všeobecnosti tri rôzne čiary. Splývajú len v rovnoramennom trojuholníku (pri hlavnom vrchole) a v rovnostrannom."}
],

"Výšky":[
  R`**Výška** je úsečka z vrcholu kolmo na priamku, na ktorej leží protiľahlá strana. Bod, kde na ňu dopadne, je **päta výšky**. Výšky sa označujú $\vb{v_a}$, $\vb{v_b}$, $\vb{v_c}$.`,
  {tool:"trojuholnik", ask:"Ťahaj vrchol $C$ doľava, až kým nebude uhol pri vrchole $A$ tupý. Kam dopadne päta výšky z $C$?",
   take:"v tupouhlom trojuholníku padnú dve výšky mimo neho, na predĺženie strany. Priesečník výšok $V$ je vtedy tiež vonku.",
   cfg:TRI({vysky:true}, {fixed:["A", "B"], view:[-4.5, 8.5, 12.4, -4.5], out:(P, h) => {
     const d = h.geo;
     return h.p(R`Výšky: $\vb{v_a = ${h.tn(d.va)}}$, $\vb{v_b = ${h.tn(d.vb)}}$, $\vb{v_c = ${h.tn(d.vc)}}$`) + kindPill(h, d)
       + h.p(kind(d) === "ostrouhlý" ? "Priesečník výšok $V$ leží vnútri." : kind(d) === "pravouhlý" ? "Priesečník výšok $V$ je vo vrchole pravého uhla." : "Priesečník výšok $V$ leží mimo trojuholníka.");
   }})},
  {cards:[
    {t:"Ostrouhlý", d:"Všetky tri výšky aj ich priesečník $V$ ležia vnútri."},
    {t:"Pravouhlý", d:"Dve výšky sú odvesny. Priesečník $V$ je vrchol pravého uhla."},
    {t:"Tupouhlý", d:"Dve výšky dopadnú na predĺženie strán. Priesečník $V$ je vonku."}
  ]},
  "Výšky potrebuješ hlavne na obsah. Môžeš si vybrať ktorúkoľvek stranu, len k nej musíš vziať jej vlastnú výšku.",
  {def:"Obsah trojuholníka", mid:true, tex:R`S = \dfrac{a \cdot \vb{v_a}}{2} = \dfrac{b \cdot \vb{v_b}}{2} = \dfrac{c \cdot \vb{v_c}}{2}`},
  {tool:"trojuholnik", ask:"Ťahaj vrchol $C$ vodorovne, rovnobežne so stranou $AB$. Mení sa obsah?",
   take:"strana $c$ aj výška $v_c$ zostávajú rovnaké, takže obsah sa nemení, nech má trojuholník akýkoľvek tvar.",
   cfg:TRI({vysky:true, strany:true}, {fixed:["A", "B"], view:[-4.5, 8.5, 12.4, -4.5], out:(P, h) => {
     const d = h.geo;
     return h.calc(R`\dfrac{c \cdot \vb{v_c}}{2} = \dfrac{${h.tn(d.c)} \cdot \vb{${h.tn(d.vc)}}}{2} = ${h.tn(d.S)}`)
       + h.calc(R`\dfrac{a \cdot \vb{v_a}}{2} = \dfrac{${h.tn(d.a)} \cdot \vb{${h.tn(d.va)}}}{2} = ${h.tn(d.S)}`)
       + h.calc(R`\dfrac{b \cdot \vb{v_b}}{2} = \dfrac{${h.tn(d.b)} \cdot \vb{${h.tn(d.vb)}}}{2} = ${h.tn(d.S)}`);
   }})},
  {ex:R`Trojuholník má strany $a = 6$ cm, $b = 8$ cm a výšku $v_a = 4$ cm. Vypočítaj výšku $v_b$.`,
   steps:[
     [R`Obsah zo strany $a$ a jej výšky.`, R`S = \dfrac{6 \cdot 4}{2} = 12\ \text{cm}^2`],
     [R`Ten istý obsah vyjadri cez stranu $b$ a vypočítaj $v_b$.`, R`12 = \dfrac{8 \cdot v_b}{2} \;\Rightarrow\; v_b = 3\ \text{cm}`]
   ],
   res:R`$v_b = 3$ cm`},
  {tip:R`Pretože súčin $a \cdot v_a$ je pre všetky strany rovnaký, najdlhšej strane patrí najkratšia výška a naopak.`}
],

"Stredné priečky":[
  R`**Stredná priečka** spája stredy dvoch strán trojuholníka. Každý trojuholník má tri. Majú dve vlastnosti, ktoré sa oplatí pamätať spolu.`,
  {def:"Stredná priečka", mid:true, tex:R`\vd{A_1B_1} \parallel AB, \qquad \vd{|A_1B_1|} = \dfrac{c}{2}`,
   note:"Je rovnobežná so stranou, ktorej sa nedotýka, a má jej polovičnú dĺžku."},
  {tool:"trojuholnik", ask:"Ťahaj vrcholy a porovnávaj dĺžku každej strednej priečky so stranou, s ktorou je rovnobežná.",
   take:"priečka je vždy presne polovica protiľahlej strany a zostáva s ňou rovnobežná.",
   cfg:TRI({priecky:true, strany:true}, {out:(P, h) => {
     const d = h.geo;
     return h.calc(R`\vd{|A_1B_1|} = ${h.tn(d.c / 2)} = \tfrac{1}{2} \cdot ${h.tn(d.c)}`)
       + h.calc(R`\vd{|B_1C_1|} = ${h.tn(d.a / 2)} = \tfrac{1}{2} \cdot ${h.tn(d.a)}`)
       + h.calc(R`\vd{|C_1A_1|} = ${h.tn(d.b / 2)} = \tfrac{1}{2} \cdot ${h.tn(d.b)}`);
   }})},
  "Tri stredné priečky rozdelia trojuholník na štyri menšie. Všetky štyri sú navzájom zhodné a každý je podobný pôvodnému trojuholníku s polovičnými stranami.",
  {cards:[
    {t:"Strany", d:"Každý malý trojuholník má strany $\\tfrac{a}{2}$, $\\tfrac{b}{2}$, $\\tfrac{c}{2}$."},
    {t:"Obvod", d:"Obvod trojuholníka zo stredných priečok je polovica pôvodného."},
    {t:"Obsah", d:"Obsah každého malého trojuholníka je štvrtina pôvodného."}
  ]},
  {tool:"trojuholnik", ask:"Skontroluj to na číslach: porovnaj obvod a obsah veľkého trojuholníka a trojuholníka $A_1B_1C_1$.",
   take:"polovičné strany znamenajú polovičný obvod, ale len štvrtinový obsah.",
   cfg:TRI({priecky:true}, {out:(P, h) => {
     const d = h.geo;
     return h.p(R`Veľký: $o = ${h.tn(d.o)}$, $S = ${h.tn(d.S)}$`)
       + h.p(R`Priečkový: $\vd{o = ${h.tn(d.o / 2)}}$, $\vd{S = ${h.tn(d.S / 4)}}$`);
   }})},
  {ex:"Trojuholník má strany 6 cm, 8 cm a 10 cm. Aký obvod a obsah má trojuholník tvorený jeho strednými priečkami?",
   steps:[
     ["Stredné priečky sú polovice strán.", R`3\ \text{cm},\quad 4\ \text{cm},\quad 5\ \text{cm}`],
     ["Obvod.", R`o = 3 + 4 + 5 = 12\ \text{cm}`],
     [R`Pôvodný trojuholník je pravouhlý ($6^2 + 8^2 = 10^2$), jeho obsah je $\tfrac{1}{2} \cdot 6 \cdot 8 = 24$. Priečkový má štvrtinu.`, R`S = \dfrac{24}{4} = 6\ \text{cm}^2`]
   ],
   res:R`Obvod 12 cm, obsah $6\ \text{cm}^2$.`},
  {warn:"Nezamieňaj si strednú priečku s ťažnicou. Priečka spája dva stredy strán. Ťažnica spája vrchol so stredom strany."}
],

"Kružnica opísaná (osi strán)":[
  R`**Opísaná kružnica** prechádza všetkými tromi vrcholmi trojuholníka. Jej stred musí byť od všetkých troch vrcholov rovnako ďaleko.`,
  R`Body rovnako vzdialené od dvoch vrcholov ležia na **osi strany**: kolmici, ktorá prechádza stredom strany. Stred opísanej kružnice je preto priesečník osí strán.`,
  {tool:"trojuholnik", ask:"Ťahaj vrchol $C$. Kedy stred $S$ opísanej kružnice vyjde von z trojuholníka?",
   take:"v ostrouhlom trojuholníku je stred vnútri, v tupouhlom vonku. Pri pravom uhle leží presne na strane.",
   cfg:TRI({opisana:true}, {fixed:["A", "B"], pts:{A:[1, 1], B:[11, 1], C:[5, 7]}, view:[-2.6, 9.5, 14.6, -3.73], out:(P, h) => {
     const d = h.geo;
     return h.p(R`Polomer $\vc{r = ${h.tn(d.r)}}$`) + kindPill(h, d)
       + h.p(kind(d) === "ostrouhlý" ? "Stred $S$ leží vnútri." : kind(d) === "pravouhlý" ? "Stred $S$ leží v strede prepony." : "Stred $S$ leží mimo trojuholníka.");
   }})},
  {tool:"trojuholnik", kind:"uloha", ask:"Posuň vrchol $C$ tak, aby stred opísanej kružnice ležal presne na strane $AB$.",
   hint:"Stred leží na strane práve vtedy, keď je oproti nej pravý uhol. Strana $AB$ je potom priemerom kružnice (Tálesova veta).",
   goal:P => Math.abs(triGeo(P).gama - 90) < 1e-6,
   cfg:TRI({opisana:true, uhly:true}, {fixed:["A", "B"], pts:{A:[1, 1], B:[11, 1], C:[5, 7]}, snap:1, view:[-2.6, 9.5, 14.6, -3.73], out:(P, h) => {
     const d = h.geo;
     return h.p(R`Uhol pri $C$: $\gamma = ${h.tn(d.gama, 1)}°$`) + h.p(R`Polomer $\vc{r = ${h.tn(d.r)}}$, strana $c = ${h.tn(d.c)}$`)
       + (Math.abs(d.gama - 90) < 1e-6 ? h.pill("✓ Stred je v strede strany AB", "ok") + h.calc(R`\vc{r} = \dfrac{c}{2} = ${h.tn(d.c / 2)}`) : "");
   }})},
  {def:"Polomer opísanej kružnice", mid:true, tex:R`\vc{r} = \dfrac{a\,b\,c}{4S}`,
   note:R`V pravouhlom trojuholníku s preponou $c$ stačí $r = \dfrac{c}{2}$.`},
  {ex:"Aký je polomer kružnice opísanej rovnostrannému trojuholníku so stranou 6 cm?",
   steps:[
     ["Výška rovnostranného trojuholníka z Pytagorovej vety.", R`v = \sqrt{6^2 - 3^2} = \sqrt{27} = 3\sqrt{3}\ \text{cm}`],
     ["V rovnostrannom trojuholníku osi strán splývajú s ťažnicami, takže stred je v ťažisku. To je v dvoch tretinách výšky.", R`r = \tfrac{2}{3} \cdot 3\sqrt{3} = 2\sqrt{3} \doteq 3{,}46\ \text{cm}`]
   ],
   res:R`$r = 2\sqrt{3} \doteq 3{,}46$ cm`},
  {tip:R`Kontrola vzorcom: $S = \tfrac{1}{2} \cdot 6 \cdot 3\sqrt{3} = 9\sqrt{3}$, teda $r = \dfrac{6 \cdot 6 \cdot 6}{4 \cdot 9\sqrt{3}} = \dfrac{6}{\sqrt{3}} = 2\sqrt{3}$.`}
],

"Kružnica vpísaná (osi uhlov)":[
  R`**Vpísaná kružnica** leží vnútri trojuholníka a každej strany sa dotýka v jednom bode. Jej stred musí byť od všetkých troch strán rovnako ďaleko.`,
  R`Body rovnako vzdialené od dvoch strán ležia na **osi uhla**, ktorý tie strany zvierajú. Stred vpísanej kružnice je preto priesečník osí uhlov.`,
  {tool:"trojuholnik", ask:"Ťahaj vrcholy. Podarí sa ti dostať stred vpísanej kružnice mimo trojuholníka?",
   take:"nepodarí. Osi uhlov vedú vždy dovnútra, takže stred vpísanej kružnice je vnútri pri každom tvare.",
   cfg:TRI({vpisana:true}, {out:(P, h) => {
     const d = h.geo;
     return h.p(R`Polomer $\varrho = ${h.tn(d.ro)}$`) + kindPill(h, d) + h.p("Stred $O$ leží vnútri.");
   }})},
  R`Polomer $\varrho$ sa počíta z obsahu. Spoj stred $O$ s vrcholmi: trojuholník sa rozpadne na tri menšie so základňami $a$, $b$, $c$ a spoločnou výškou $\varrho$.`,
  {def:"Polomer vpísanej kružnice", mid:true, tex:R`S = \dfrac{a\varrho}{2} + \dfrac{b\varrho}{2} + \dfrac{c\varrho}{2} = \dfrac{o \cdot \varrho}{2} \quad\Rightarrow\quad \varrho = \dfrac{2S}{o}`},
  {tool:"trojuholnik", ask:R`Ťahaj vrcholy a sleduj, ako sa $\varrho$ počíta z obsahu a obvodu.`,
   take:R`polomer vpísanej kružnice je vždy dvojnásobok obsahu delený obvodom.`,
   cfg:TRI({vpisana:true, strany:true}, {out:(P, h) => {
     const d = h.geo;
     return h.p(R`$S = ${h.tn(d.S)}$, $o = ${h.tn(d.o)}$`) + h.calc(R`\varrho = \dfrac{2 \cdot ${h.tn(d.S)}}{${h.tn(d.o)}} = ${h.tn(d.ro)}`);
   }})},
  {ex:"Pravouhlý trojuholník má strany 6 cm, 8 cm a 10 cm. Vypočítaj polomer vpísanej aj opísanej kružnice.",
   steps:[
     ["Obsah z odvesien a obvod.", R`S = \dfrac{6 \cdot 8}{2} = 24,\qquad o = 6 + 8 + 10 = 24`],
     ["Polomer vpísanej kružnice.", R`\varrho = \dfrac{2 \cdot 24}{24} = 2\ \text{cm}`],
     ["Polomer opísanej je polovica prepony.", R`r = \dfrac{10}{2} = 5\ \text{cm}`]
   ],
   res:R`$\varrho = 2$ cm, $r = 5$ cm`},
  {h:"Opísaná a vpísaná vedľa seba"},
  {cards:[
    {t:"Opísaná kružnica", d:"Prechádza **vrcholmi**. Stred je priesečník **osí strán**. Môže ležať aj mimo trojuholníka.", tex:R`\vc{r} = \dfrac{abc}{4S}`},
    {t:"Vpísaná kružnica", d:"Dotýka sa **strán**. Stred je priesečník **osí uhlov**. Leží vždy vnútri.", tex:R`\varrho = \dfrac{2S}{o}`}
  ]},
  {tool:"trojuholnik", ask:"Zapni si obe kružnice naraz a ťahaj vrcholy. Kedy majú spoločný stred?",
   take:R`stredy splynú len v rovnostrannom trojuholníku. Tam platí aj $r = 2\varrho$.`,
   cfg:TRI({opisana:true, vpisana:true}, {toggles:["opisana", "vpisana", "taznice"], out:(P, h) => {
     const d = h.geo;
     return h.p(R`$\vc{r = ${h.tn(d.r)}}$, $\varrho = ${h.tn(d.ro)}$`) + h.p(R`Vzdialenosť stredov: $${h.tn(Math.hypot(d.O[0] - d.I[0], d.O[1] - d.I[1]))}$`);
   }})},
  {warn:"Najčastejšia zámena: osi **strán** dávajú **opísanú** kružnicu, osi **uhlov** dávajú **vpísanú**."}
]

  }
};
})();

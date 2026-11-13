/* Transformácie grafov: f(x)+a, f(x+a), a·f(x), f(ax), |f(x)| */
(() => {
const GH = f => ({f, color:"axis", dash:true, thin:true, ghost:true});
const pm = (v, h) => v < 0 ? `- ${h.tn(-v)}` : `+ ${h.tn(v)}`;          /* "+ 2" / "- 2" after a term */
const xin = (v, h, c) => v === 0 ? "x" : `x ${v < 0 ? "-" : "+"} \\${c}{${h.tn(Math.abs(v))}}`;   /* x + a inside a bracket */

THEORY.b12 = {
  mins:25,
  brief:[
    R`$y = f(x) + \vd{a}$: graf sa posunie o $a$ **hore** ($a > 0$) alebo **dole** ($a < 0$).`,
    R`$y = f(x + \vb{a})$: graf sa posunie o $a$ **doľava** ($a > 0$) alebo **doprava** ($a < 0$). Pozor, opačne než znamienko.`,
    R`$y = \va{a} \cdot f(x)$ naťahuje graf zvislo, $y = f(\va{a}x)$ ho $a$-krát stláča k osi $y$. Záporné $a$ graf navyše preklopí.`,
    R`$y = |f(x)|$: časti pod osou $x$ sa preklopia nad ňu. $y = f(|x|)$: pravá polovica sa zrkadlí aj doľava.`
  ],
  subs:{

"Posun hore a dole — f(x) + a":[
  R`Z grafu jednej funkcie vieš bez počítania nakresliť graf mnohých ďalších. Stačí vedieť, čo s grafom urobí malá zmena v predpise. Ako základ poslúžia grafy, ktoré poznáš: $x^2$, $\sqrt{x}$, $|x|$, $2^x$.`,
  R`Keď k hodnote funkcie pripočítaš číslo $\vd{a}$, každý bod grafu sa posunie o $\vd{a}$ zvislo. Pre každé $x$ je nová hodnota o $a$ väčšia.`,
  {def:"Zvislý posun", tex:R`y = f(x) + \vd{a}`, legend:[
    ["a", "d", "zvislý posun", "Pre $a > 0$ posun hore, pre $a < 0$ posun dole."]
  ]},
  {tool:"graf", ask:R`Posúvaj $\vd{a}$. O koľko sa posunie bod, ktorý bol v $[1;\ 1]$? Mení sa tvar paraboly?`,
   take:R`každý bod sa posunie o $a$ hore alebo dole. Tvar zostáva rovnaký, mení sa len poloha.`,
   cfg:{view:[-5, 7, 5, -5], tick:1, fns:[{f:"x^2+a", lhs:"y"}, GH("x^2")],
     params:{a:{v:2, min:-4, max:4, step:.5, color:"d"}},
     show:[{pt:[1, 1], color:"axis", size:3.5}, {seg:[[1, 1], [1, "1+a"]], color:"d", dash:2}, {pt:[1, "1+a"], color:"d", label:"[1; {1+a}]", at:"r"}],
     out:(P, h) => h.big(P.a === 0 ? "y = x^2" : `y = x^2 ${pm(P.a, h).replace(/[\d,{}]+$/, m => `\\vd{${m}}`)}`)
       + (P.a > 0 ? h.pill(`posun o ${h.n(P.a)} hore`, "up") : P.a < 0 ? h.pill(`posun o ${h.n(-P.a)} dole`, "down") : h.pill("bez posunu", "flat"))
       + h.p("Sivá čiarkovaná krivka $y = x^2$ je pôvodný graf.")}},
  R`S grafom sa posunie všetko, čo k nemu patrí: vrchol, priesečník s osou $y$, asymptota aj obor hodnôt. Definičný obor sa nemení, lebo $x$ si nikto nevšimol.`,
  {tool:"graf", ask:R`Posúvaj $\vd{a}$ vo funkcii $y = 2^x + a$. Kam ide asymptota a čo sa deje s oborom hodnôt?`,
   take:R`asymptota je priamka $y = a$ a obor hodnôt $(a;\ \infty)$. Posunuli sa spolu s grafom.`,
   cfg:{view:[-6, 7, 5, -5], tick:1, fns:[{f:"2^x+a", lhs:"y"}, GH("2^x")],
     params:{a:{v:-2, min:-4, max:3, step:.5, color:"d"}},
     show:[{hline:"a", color:"d"}, {pt:[0, "1+a"], color:"ink", label:"[0; {1+a}]", at:"tl"}],
     out:(P, h) => h.big(R`y = 2^x ${P.a ? pm(P.a, h) : ""}`) + h.p(R`Asymptota: $y = \vd{${h.tn(P.a)}}$`) + h.p(R`$H(f) = (\vd{${h.tn(P.a)}};\ \infty)$, $D(f) = \mathbb{R}$ sa nezmenil.`)}},
  {ex:R`Graf funkcie $g$ vznikol posunutím grafu $f(x) = 2^x$ o 3 jednotky nadol. Zapíš predpis $g$, urč jej obor hodnôt a priesečník s osou $y$.`,
   steps:[
     ["Posun nadol znamená odčítať od hodnoty funkcie.", R`g(x) = 2^x - 3`],
     [R`$2^x$ má hodnoty $(0;\ \infty)$. Všetky klesnú o 3.`, R`H(g) = (-3;\ \infty)`],
     [R`Priesečník s osou $y$: $x = 0$.`, R`g(0) = 2^0 - 3 = -2`]
   ],
   res:R`$g(x) = 2^x - 3$, $H(g) = (-3;\ \infty)$, priesečník $[0;\ -2]$.`},
  {tool:"graf", kind:"uloha", ask:R`Posuň graf $y = \sqrt{x}$ zvislo tak, aby prechádzal bodom $[4;\ 0]$.`,
   hint:R`Pôvodný graf prechádza bodom $[4;\ 2]$, lebo $\sqrt{4} = 2$. Ten treba dostať o 2 nižšie.`,
   goal:P => P.a === -2,
   cfg:{view:[-2, 5, 9, -4], tick:1, fns:[{f:"sqrt(x)+a", lhs:"y"}, GH("sqrt(x)")],
     params:{a:{v:1, min:-4, max:4, step:.5, color:"d"}},
     show:[{target:[4, 0], fn:0, label:"[4; 0]", at:"b"}, {pt:[0, "a"], color:"d", size:3.5}],
     out:(P, h) => h.big(R`y = \sqrt{x} ${P.a ? pm(P.a, h) : ""}`)
       + (P.a === -2 ? h.pill("✓ Graf prechádza bodom [4; 0]", "ok") : h.p(R`Pre $x = 4$ je teraz $y = 2 ${pm(P.a, h)} = ${h.tn(2 + P.a)}$.`))}},
  {warn:R`Pri $f(x) + a$ sa číslo pripočíta až k výsledku, mimo zátvorky. $x^2 + 3$ je posun hore, $(x + 3)^2$ je niečo úplne iné, posun do strany.`}
],

"Posun doľava a doprava — f(x + a)":[
  R`Ak číslo pripočítaš k $x$ ešte **pred** dosadením do funkcie, graf sa posunie vodorovne. Prekvapivo opačným smerom, než naznačuje znamienko: $f(x + 2)$ je posun o 2 **doľava**.`,
  {def:"Vodorovný posun", tex:R`y = f(x + \vb{a})`, legend:[
    ["a", "b", "vodorovný posun", "Pre $a > 0$ posun doľava, pre $a < 0$ doprava."]
  ], note:R`Inak zapísané: $y = f(x - m)$ je posun o $m$ **doprava**.`},
  {ex:R`Prečo je graf $g(x) = (x + 2)^2$ posunutý doľava oproti $f(x) = x^2$? Porovnaj ich hodnoty.`,
   steps:[
     [R`Funkcia $g$ dosadí do $x^2$ číslo o 2 väčšie.`, R`g(x) = f(x + 2)`],
     [R`Hodnotu, ktorú má $f$ v nule, dostane $g$ už pri $x = -2$.`, R`g(-2) = 0^2 = 0 = f(0)`],
     [R`Podobne pre ďalšie body: $g$ ich dosiahne o 2 skôr, teda viac vľavo.`, R`g(-1) = 1 = f(1),\quad g(0) = 4 = f(2)`]
   ],
   res:R`Celý graf sa posunie o 2 doľava, vrchol je v bode $[-2;\ 0]$.

| $x$ | $-4$ | $-3$ | $-2$ | $-1$ | $0$ |
|---|---|---|---|---|---|
| $(x + 2)^2$ | $4$ | $1$ | $0$ | $1$ | $4$ |`},
  {tool:"graf", ask:R`Posúvaj $\vb{a}$. Kam ide vrchol, keď je $a$ kladné?`,
   take:R`vrchol je v bode $[-a;\ 0]$. Kladné $a$ posúva graf doľava, záporné doprava.`,
   cfg:{view:[-6, 7, 6, -3], tick:1, fns:[{f:"(x+a)^2", lhs:"y"}, GH("x^2")],
     params:{a:{v:2, min:-4, max:4, step:.5, color:"b"}},
     show:[{pt:["-a", 0], color:"b", label:"[{-a}; 0]", at:"b"}],
     out:(P, h) => h.big(`y = (${xin(P.a, h, "vb")})^2`)
       + (P.a > 0 ? h.pill(`posun o ${h.n(P.a)} doľava`, "down") : P.a < 0 ? h.pill(`posun o ${h.n(-P.a)} doprava`, "up") : h.pill("bez posunu", "flat"))}},
  R`Pri vodorovnom posune sa mení definičný obor. Pri $\sqrt{x}$ to dobre vidno: graf začína tam, kde je výraz pod odmocninou nulový.`,
  {tool:"graf", ask:R`Posúvaj $\vb{a}$ vo funkcii $y = \sqrt{x + a}$. Kde graf začína?`,
   take:R`graf začína v bode $[-a;\ 0]$, lebo tam je $x + a = 0$. Definičný obor je $\langle -a;\ \infty)$.`,
   cfg:{view:[-6, 4, 6, -2], tick:1, fns:[{f:"sqrt(x+a)", lhs:"y"}, GH("sqrt(x)")],
     params:{a:{v:3, min:-4, max:4, step:.5, color:"b"}},
     show:[{pt:["-a", 0], color:"b", label:"{-a}", at:"b"}],
     out:(P, h) => h.big(`y = \\sqrt{${xin(P.a, h, "vb")}}`) + h.p(R`$D(f) = \langle \vb{${h.tn(-P.a)}};\ \infty)$`)}},

  {h:"Oba posuny naraz"},
  R`Posuny sa dajú kombinovať. Vo vnútri zátvorky je vodorovný, mimo nej zvislý. Toto je presne vrcholový tvar paraboly z [[a22]].`,
  {def:"Posun do bodu [m; n]", tex:R`y = f(x - \vb{m}) + \vd{n}`, note:R`Bod, ktorý bol v počiatku, sa dostane do $[\vb{m};\ \vd{n}]$.`},
  {ex:R`Ako vznikne graf $y = (x - 2)^2 + 1$ z grafu $y = x^2$?`,
   steps:[
     [R`V zátvorke je $x - 2$: posun o 2 doprava.`, R`(x - 2)^2`],
     ["Mimo zátvorky $+1$: posun o 1 hore.", R`(x - 2)^2 + 1`],
     ["Vrchol sa presunie z počiatku.", R`[0;\ 0] \to [2;\ 1]`]
   ],
   res:R`Posunutím o 2 doprava a o 1 hore. Vrchol je $V\,[2;\ 1]$.`},
  {tool:"graf", kind:"uloha", ask:R`Posuň graf $y = 2^x$ tak, aby jeho asymptota bola priamka $y = -1$ a graf prechádzal bodom $[1;\ 0]$.`,
   hint:R`Asymptota sa hýbe so zvislým posunom, takže $n = -1$. Potom musí platiť $2^{1 - m} = 1$, čiže $1 - m = 0$.`,
   goal:P => P.m === 1 && P.n === -1,
   cfg:{view:[-5, 6, 6, -4], tick:1, fns:[{f:"2^(x-m)+n", lhs:"y"}, GH("2^x")],
     params:{m:{v:-1, min:-4, max:4, step:.5, color:"b"}, n:{v:1, min:-3, max:3, step:.5, color:"d"}},
     show:[{hline:"n", color:"d"}, {target:[1, 0], fn:0, label:"[1; 0]", at:"br"}],
     out:(P, h) => h.big(`y = 2^{${P.m ? `x ${P.m > 0 ? "-" : "+"} \\vb{${h.tn(Math.abs(P.m))}}` : "x"}} ${P.n ? `${P.n < 0 ? "-" : "+"} \\vd{${h.tn(Math.abs(P.n))}}` : ""}`)
       + (P.m === 1 && P.n === -1 ? h.pill("✓ Asymptota aj bod sedia", "ok") : h.p(R`Asymptota: $y = \vd{${h.tn(P.n)}}$`))}},
  {warn:R`Najčastejšia chyba: $f(x + 3)$ nie je posun doprava. Plus v zátvorke posúva **doľava**, mínus **doprava**. Pomôže otázka: kde je výraz v zátvorke nulový? Pri $x + 3$ je to $x = -3$, tam sa presunie to, čo bolo v nule.`}
],

"Natiahnutie — a · f(x), f(ax)":[
  R`Keď hodnotu funkcie vynásobíš číslom $\va{a}$, každý bod sa vzdiali od osi $x$ $a$-krát. Body na osi $x$ zostanú na mieste, lebo $a \cdot 0 = 0$.`,
  {def:"Zvislé natiahnutie", tex:R`y = \va{a} \cdot f(x)`, legend:[
    ["a", "a", "činiteľ", "Pre $|a| > 1$ graf naťahuje, pre $|a| < 1$ stláča k osi $x$. Záporné $a$ ho navyše preklopí podľa osi $x$."]
  ]},
  {tool:"graf", ask:R`Meň $\va{a}$. Ktoré body grafu sa nepohnú? Čo sa stane pre záporné $a$?`,
   take:R`nulové body $-1$ a $3$ zostávajú. Vrchol sa vzďaľuje od osi $x$ $a$-krát a pre $a < 0$ sa parabola preklopí nahor.`,
   cfg:{view:[-4, 9, 6, -9], tick:1, fns:[{f:"a*(x^2-2x-3)", lhs:"y"}, GH("x^2-2x-3")],
     params:{a:{v:2, min:-2, max:2, step:.5, color:"a"}},
     show:[{pt:[-1, 0], color:"ink", size:3.5}, {pt:[3, 0], color:"ink", size:3.5}, {pt:[1, "-4a"], color:"a", label:"[1; {-4a}]", at:"r"}],
     out:(P, h) => h.big(`y = \\va{${h.tn(P.a)}} \\cdot (x^2 - 2x - 3)`)
       + h.p(R`Vrchol: $-4 \cdot \va{${h.tn(P.a)}} = ${h.tn(-4 * P.a)}$`)
       + (P.a < 0 ? h.pill("preklopený podľa osi x", "down") : P.a === 0 ? h.pill("a = 0 · zostane os x", "flat") : "")}},
  R`Ak násobíš $x$ ešte pred dosadením, mení sa vodorovný rozmer. Pri $f(2x)$ funkcia „beží dvakrát rýchlejšie“: hodnotu, ktorú mala $f$ v bode 4, dosiahne už v bode 2. Graf sa k osi $y$ **stlačí**.`,
  {def:"Vodorovné stlačenie", tex:R`y = f(\va{a}x)`, legend:[
    ["a", "a", "činiteľ", "Pre $|a| > 1$ graf $a$-krát stláča k osi $y$, pre $|a| < 1$ naťahuje. Záporné $a$ ho preklopí podľa osi $y$."]
  ], note:R`Body na osi $y$ zostávajú, lebo pre $x = 0$ je aj $ax = 0$.`},
  {tool:"graf", ask:R`Meň $\va{a}$ vo funkcii $y = \sqrt{ax}$. Kam sa presúva bod, ktorý bol pri $\sqrt{x}$ v $[4;\ 2]$?`,
   take:R`bod s výškou 2 je teraz pri $x = \dfrac{4}{a}$. Väčšie $a$ graf stláča, záporné $a$ ho preklopí doľava.`,
   cfg:{view:[-9, 4, 9, -2], tick:1, fns:[{f:"sqrt(a*x)", lhs:"y"}, GH("sqrt(x)")],
     params:{a:{v:2, min:-3, max:3, step:.5, color:"a"}},
     show:[{pt:[4, 2], color:"axis", size:3.5}, {pt:["4/a", 2], color:"a", label:"[{4/a}; 2]", at:"t", if:"a"}],
     out:(P, h) => P.a === 0 ? h.big("y = \\sqrt{0} = 0") + h.p("Pre $a = 0$ z grafu zostane len os $x$.")
       : h.big(`y = \\sqrt{\\va{${h.tn(P.a)}}x}`) + h.calc(R`\sqrt{\va{${h.tn(P.a)}} \cdot ${h.tn(4 / P.a)}} = \sqrt{4} = 2`)
       + (P.a < 0 ? h.pill("preklopený podľa osi y", "down") : "")}},
  {cards:[
    {fig:{fns:["x^2-1", "-(x^2-1)"], view:[-3, 3, 3, -3]}, t:R`$-f(x)$`, d:"Zrkadlo podľa osi $x$. Mení sa znamienko hodnôt."},
    {fig:{fns:["2^x", "2^(-x)"], view:[-3, 5, 3, -1]}, t:R`$f(-x)$`, d:"Zrkadlo podľa osi $y$. Mení sa znamienko $x$."},
    {fig:{fns:["x^2-2", "2*(x^2-2)"], view:[-3, 4, 3, -5]}, t:R`$2 \cdot f(x)$`, d:"Dvakrát vyššie, nulové body zostávajú."},
    {fig:{fns:["x^2-2", "(2x)^2-2"], view:[-3, 4, 3, -3]}, t:R`$f(2x)$`, d:"Dvakrát užšie, priesečník s osou $y$ zostáva."}
  ]},
  {ex:R`Je daná $f(x) = x^2 - 4$. Nájdi nulové body funkcií $g(x) = 3 \cdot f(x)$ a $h(x) = f(2x)$.`,
   steps:[
     [R`Nulové body $f$.`, R`x^2 - 4 = 0 \;\Rightarrow\; x = \pm 2`],
     [R`$3 \cdot f(x) = 0$ práve vtedy, keď $f(x) = 0$. Zvislé natiahnutie nulové body nemení.`, R`g:\ x = \pm 2`],
     [R`$f(2x) = (2x)^2 - 4 = 4x^2 - 4$. Graf je dvakrát užší.`, R`4x^2 - 4 = 0 \;\Rightarrow\; x = \pm 1`]
   ],
   res:R`$g$ má nulové body $\pm 2$, $h$ má nulové body $\pm 1$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{a}$ tak, aby graf $y = a(x^2 - 2x - 3)$ prechádzal bodom $[1;\ 8]$.`,
   hint:R`Pre $x = 1$ je $x^2 - 2x - 3 = -4$. Potrebuješ $a \cdot (-4) = 8$.`,
   goal:P => P.a === -2,
   cfg:{view:[-4, 10, 6, -6], tick:1, fns:[{f:"a*(x^2-2x-3)", lhs:"y"}],
     params:{a:{v:1, min:-3, max:3, step:.5, color:"a"}},
     show:[{target:[1, 8], fn:0, label:"[1; 8]", at:"r"}],
     out:(P, h) => h.big(`y = \\va{${h.tn(P.a)}}(x^2 - 2x - 3)`)
       + (P.a === -2 ? h.pill("✓ Graf prechádza bodom [1; 8]", "ok") : h.p(R`Pre $x = 1$: $\va{${h.tn(P.a)}} \cdot (-4) = ${h.tn(-4 * P.a)}$`))}},
  {warn:R`$f(2x)$ graf **nenaťahuje** dvakrát, ale dvakrát **stláča**. Vonku ($2 \cdot f(x)$) sa číslo správa, ako čakáš, vnútri ($f(2x)$) opačne. Rovnako ako pri posune.`}
],

"|f(x)| a f(|x|)":[
  R`Absolútna hodnota robí zo záporného čísla kladné. Pri $|f(x)|$ sa to týka hodnôt funkcie: kde bol graf pod osou $x$, preklopí sa nad ňu. Časti nad osou zostanú, ako boli.`,
  {def:"Absolútna hodnota funkcie", tex:R`y = |f(x)|`, note:R`Graf nikdy nie je pod osou $x$, $H \subseteq \langle 0;\ \infty)$.`},
  {tool:"graf", ask:R`Posúvaj $\vd{q}$ vo funkcii $y = |x^2 - 2x + q|$. Pri akom $q$ už nie je čo preklápať?`,
   take:R`preklápa sa len časť pod osou $x$. Od $q = 1$ je celá parabola nad osou (alebo sa jej dotýka) a $|f(x)| = f(x)$.`,
   cfg:{view:[-4, 7, 6, -5], tick:1, fns:[{f:"abs(x^2-2x+q)", lhs:"y"}, GH("x^2-2x+q")],
     params:{q:{v:-3, min:-5, max:3, step:.5, color:"d"}},
     show:[{pt:[1, "abs(q-1)"], color:"d", label:"[1; {abs(q-1)}]", at:"t"}],
     out:(P, h) => h.big(R`y = |x^2 - 2x ${P.q ? pm(P.q, h).replace(/[\d,{}]+$/, m => `\\vd{${m}}`) : ""}|`)
       + (P.q < 1 ? h.pill("časť pod osou x sa preklopila", "up") : h.pill("nič sa nepreklápa", "flat"))
       + (P.q < 1 ? h.p(R`Vrchol $[1;\ ${h.tn(P.q - 1)}]$ sa preklopí na $[1;\ ${h.tn(1 - P.q)}]$ nad osou.`) : h.p(R`Vrchol $[1;\ ${h.tn(P.q - 1)}]$ zostáva na mieste.`))}},
  {ex:R`Načrtni graf funkcie $y = |x^2 - 4|$.`,
   steps:[
     [R`Najprv graf $y = x^2 - 4$: parabola s vrcholom $[0;\ -4]$ a nulovými bodmi $\pm 2$.`, R`x^2 - 4 = 0 \;\Rightarrow\; x = \pm 2`],
     [R`Pod osou $x$ je pre $x \in (-2;\ 2)$. Tú časť preklop nahor.`, R`[0;\ -4] \to [0;\ 4]`],
     [R`Mimo intervalu $(-2;\ 2)$ graf zostáva.`, R`x \leq -2 \text{ alebo } x \geq 2:\ y = x^2 - 4`]
   ],
   res:R`Graf má tvar písmena W s „hrotmi“ na osi $x$ v bodoch $\pm 2$ a s vrcholom $[0;\ 4]$.`,
   fig:{tool:"graf", cfg:{view:[-4, 7, 4, -5], tick:1, fns:[{f:"abs(x^2-4)", lhs:"y"}, GH("x^2-4")],
     show:[{pt:[-2, 0], color:"c"}, {pt:[2, 0], color:"c"}, {pt:[0, 4], color:"a", label:"[0; 4]", at:"t"}],
     out:(P, h) => h.calc(R`y = |x^2 - 4|`) + h.p("Sivá je $x^2 - 4$ pred preklopením.")}}},
  {tool:"graf", kind:"uloha", ask:R`Pre aké $\vd{k}$ má rovnica $|x^2 - 4| = k$ práve **tri** riešenia? Posúvaj vodorovnú priamku $y = k$.`,
   hint:R`Riešenia sú priesečníky grafu s priamkou. Tri vzniknú, keď priamka prechádza vrcholom W.`,
   goal:P => P.k === 4,
   cfg:{view:[-4, 7, 4, -2], tick:1, fns:[{f:"abs(x^2-4)", lhs:"y"}, {f:"k", color:"d", lhs:"y"}],
     params:{k:{v:2, min:-1, max:6, step:.5, color:"d"}},
     show:[{meet:[0, 1], color:"d"}],
     out:(P, h) => {
       const n = P.k < 0 ? 0 : P.k === 0 ? 2 : P.k < 4 ? 4 : P.k === 4 ? 3 : 2;
       return h.big(R`|x^2 - 4| = \vd{${h.tn(P.k)}}`) + h.p(`Počet riešení: **${n}**`) + (n === 3 ? h.pill("✓ Práve tri riešenia", "ok") : "");
     }}},

  {h:"f(|x|)"},
  R`Pri $f(|x|)$ ide absolútna hodnota na $x$. Pre $x \geq 0$ sa nič nemení. Pre záporné $x$ dostane funkcia rovnaké číslo ako pre $-x$. Preto sa pravá polovica grafu zrkadlí doľava a ľavá pôvodná polovica sa zahodí.`,
  {def:"Funkcia absolútnej hodnoty x", tex:R`y = f(|x|)`, note:R`Graf je súmerný podľa osi $y$, funkcia je párna.`},
  {tool:"graf", ask:R`Posúvaj $\vb{m}$ vo funkcii $y = (|x| - m)^2 - 2$. Čo sa deje s časťou grafu vľavo od osi $y$?`,
   take:R`ľavá polovica je vždy zrkadlový obraz pravej. Keď je vrchol pôvodnej paraboly vpravo ($m > 0$), vzniknú dva vrcholy a tvar W.`,
   cfg:{view:[-6, 7, 6, -4], tick:1, fns:[{f:"(abs(x)-m)^2-2", lhs:"y"}, GH("(x-m)^2-2")],
     params:{m:{v:2, min:-3, max:3, step:.5, color:"b"}},
     show:[{vline:0, color:"soft"}],
     out:(P, h) => h.big(R`y = (|x| ${P.m ? `${P.m > 0 ? "-" : "+"} \\vb{${h.tn(Math.abs(P.m))}}` : ""})^2 - 2`)
       + h.p("Sivá čiarkovaná je pôvodná funkcia bez absolútnej hodnoty.")}},
  {cards:[
    {fig:{fns:["abs(x^2-2x-1)"], view:[-2, 4, 4, -2]}, t:R`$|f(x)|$`, d:"Mení **hodnoty**: časti pod osou $x$ sa preklopia hore."},
    {fig:{fns:["abs(x)^2-2abs(x)-1"], view:[-3.5, 3, 3.5, -3]}, t:R`$f(|x|)$`, d:"Mení **$x$**: pravá polovica sa zrkadlí doľava."}
  ]},
  {ex:R`Nájdi nulové body funkcie $y = x^2 - 4|x| + 3$.`,
   steps:[
     [R`Je to $f(|x|)$ pre $f(x) = x^2 - 4x + 3$, lebo $x^2 = |x|^2$.`, R`f(x) = (x - 1)(x - 3)`],
     [R`Pre $x \geq 0$ sú nulové body ako pri $f$.`, R`x = 1,\quad x = 3`],
     ["Graf je súmerný podľa osi $y$, takže pribudnú opačné čísla.", R`x = -1,\quad x = -3`]
   ],
   res:R`Štyri nulové body: $-3$, $-1$, $1$, $3$.`,
   fig:{tool:"graf", cfg:{view:[-5, 5, 5, -3], tick:1, fns:[{f:"x^2-4abs(x)+3", lhs:"y"}], show:[{roots:0, color:"c", at:"t"}],
     out:(P, h) => h.calc(R`y = x^2 - 4|x| + 3`) + h.p("Vrcholy $[-2;\\ -1]$ a $[2;\\ -1]$.")}}},
  {warn:R`Neplieť si $|f(x)|$ a $f(|x|)$. Prvé preklápa nahor to, čo je **pod osou $x$**. Druhé kopíruje doľava to, čo je **vpravo od osi $y$**.`}
]

  }
};
})();

/* Logaritmus: definícia, dekadický a prirodzený, pravidlá pre logaritmy */
(() => {
const L = v => ({v, lock:true});
const t3 = (h, v) => h.tn(Math.round(v * 1000) / 1000);

THEORY.b1 = {
  mins:35,
  brief:[
    R`$\log_a x = y \;\Leftrightarrow\; a^y = x$, kde $a > 0$, $a \neq 1$, $x > 0$. Logaritmus je exponent.`,
    R`$\log x = \log_{10} x$, $\ln x = \log_e x$, $e \doteq 2{,}718$.`,
    R`$\log(xy) = \log x + \log y$, $\log \frac{x}{y} = \log x - \log y$, $\log x^n = n \log x$.`,
    R`$\log_a x = \dfrac{\log x}{\log a} = \dfrac{\ln x}{\ln a}$`
  ],
  subs:{

"Definícia logaritmu":[
  R`Otázka „na koľkú treba umocniť 2, aby vyšlo 8?“ má odpoveď 3. Tejto odpovedi sa hovorí **logaritmus** 8 pri základe 2: $\log_2 8 = 3$. Logaritmus je teda exponent.`,
  {def:"Logaritmus", tex:R`\log_{\va{a}} \vb{x} = y \;\Leftrightarrow\; \va{a}^y = \vb{x}`, legend:[
    ["a", "a", "základ", R`$a > 0$, $a \neq 1$`],
    ["x", "b", "argument", R`$x > 0$, logaritmus nuly ani záporného čísla neexistuje`]
  ]},
  {tool:"graf", ask:R`Graf $y = 2^x$. Meň hodnotu $\vb{c}$. Pri akom $x$ dosiahne $2^x$ hodnotu $c$? To je $\log_2 c$.`,
   take:R`$\log_2 1 = 0$, $\log_2 2 = 1$, $\log_2 4 = 2$, $\log_2 8 = 3$. Pre $c$ medzi 0 a 1 je logaritmus záporný, pre $c \leq 0$ neexistuje.`,
   cfg:{view:[-4, 9, 4, -1], tick:1, fns:[{f:"2^x", lhs:"y"}],
     params:{c:{v:4, min:.25, max:8, step:.25, color:"b"}},
     show:[{hline:"c", color:"b"}, {pt:["ln(c)/ln(2)", "c"], color:"a"}, {drop:["ln(c)/ln(2)", "c"], color:"a"}],
     out:(P, h) => h.calc(R`\log_2 \vb{${h.tn(P.c)}} = ${t3(h, Math.log2(P.c))}`)}},
  {ex:R`Vypočítaj $\log_2 32$, $\log_3 \frac{1}{9}$, $\log_5 1$, $\log_4 2$.`,
   steps:[
     [R`$2^5 = 32$.`, R`\log_2 32 = 5`],
     [R`$3^{-2} = \frac{1}{9}$.`, R`\log_3 \tfrac{1}{9} = -2`],
     [R`$5^0 = 1$.`, R`\log_5 1 = 0`],
     [R`$4^{\frac{1}{2}} = \sqrt{4} = 2$.`, R`\log_4 2 = \tfrac{1}{2}`]
   ],
   res:R`$5$, $-2$, $0$, $\dfrac{1}{2}$.`},
  {ex:R`Nájdi $x$: $\log_x 49 = 2$ a $\log_2 x = -3$.`,
   steps:[
     ["Prepíš na mocninu.", R`x^2 = 49 \;\Rightarrow\; x = 7 \quad (\text{základ je kladný})`],
     ["Prepíš na mocninu.", R`x = 2^{-3} = \tfrac{1}{8}`]
   ],
   res:R`$x = 7$ a $x = \dfrac{1}{8}$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav základ $\va{a}$ tak, aby platilo $\log_a 9 = 2$.`,
   hint:R`$a^2 = 9$.`,
   goal:P => P.a === 3,
   cfg:{view:[-3, 10, 4, -1], tick:1, fns:[{f:"a^x", lhs:"y"}],
     params:{a:{v:2, min:1.5, max:5, step:.5, color:"a"}},
     show:[{target:[2, 9], fn:0, label:"[2; 9]", at:"l"}],
     out:(P, h) => h.calc(R`\va{${h.tn(P.a)}}^2 = ${h.tn(P.a * P.a)}`)}},
  {warn:R`$\log_a 0$ ani $\log_a(-4)$ neexistujú: kladné číslo umocnené na čokoľvek je kladné. Logaritmus však môže byť záporný, napríklad $\log_2 \frac{1}{4} = -2$.`}
],

"Dekadický a prirodzený logaritmus":[
  R`Dva základy sa používajú tak často, že majú vlastné značky. **Dekadický** logaritmus má základ 10 a píše sa bez indexu, **prirodzený** má základ $e \doteq 2{,}718$ (Eulerovo číslo) a píše sa $\ln$. Kalkulačka má na oba tlačidlá.`,
  {def:"Dekadický a prirodzený logaritmus", tex:R`\log x = \log_{10} x,\qquad \ln x = \log_e x`},
  {tool:"graf", ask:R`Grafy $y = \log x$ a $y = \ln x$. Posúvaj bod $\vd{x_0}$. Ktorý graf rastie rýchlejšie a kde sa pretínajú?`,
   take:R`oba prechádzajú bodom $[1;\ 0]$. $\ln$ rastie rýchlejšie, lebo $e < 10$: $\ln x \doteq 2{,}3 \cdot \log x$.`,
   cfg:{view:[-1, 3, 12, -3], tick:[1, 1], free:true, aspect:"2", fns:[{f:"log(x)", lhs:"y", dom:[.05, 12]}, {f:"ln(x)", lhs:"y", color:"c", dom:[.05, 12]}],
     params:{t:{v:10, min:.5, max:12, step:.5, color:"d", name:"x₀"}},
     show:[{pt:["t", "log(t)"], color:"a"}, {pt:["t", "ln(t)"], color:"c"}],
     out:(P, h) => h.calc(R`\log ${h.tn(P.t)} \doteq ${t3(h, Math.log10(P.t))},\quad \ln ${h.tn(P.t)} \doteq ${t3(h, Math.log(P.t))}`)}},
  {ex:R`Vypočítaj bez kalkulačky $\log 1\,000$, $\log 0{,}01$, $\ln e^3$, $\ln 1$.`,
   steps:[
     [R`$10^3 = 1\,000$, $10^{-2} = 0{,}01$.`, R`\log 1\,000 = 3,\quad \log 0{,}01 = -2`],
     [R`$e^3$ je $e$ na tretiu, $e^0 = 1$.`, R`\ln e^3 = 3,\quad \ln 1 = 0`]
   ],
   res:R`$3$, $-2$, $3$, $0$.`},
  {ex:R`Koľko cifier má číslo $2^{100}$? ($\log 2 \doteq 0{,}301$)`,
   steps:[
     ["Logaritmus mocniny.", R`\log 2^{100} = 100 \cdot \log 2 \doteq 30{,}1`],
     [R`$10^{30} \leq 2^{100} < 10^{31}$.`, R`30 + 1 = 31`]
   ],
   res:"Číslo $2^{100}$ má 31 cifier."},
  {tool:"graf", kind:"uloha", ask:R`Posuň bod $\vd{x_0}$ na grafe $y = \log x$ tam, kde je $\log x_0 = 2$.`,
   hint:R`$10^2$.`,
   goal:P => P.t === 100,
   cfg:{view:[-8, 2.6, 125, -1.2], tick:[20, 1], free:true, aspect:"2", fns:[{f:"log(x)", lhs:"y", dom:[.1, 125]}],
     params:{t:{v:20, min:10, max:120, step:10, color:"d", name:"x₀"}},
     show:[{pt:["t", "log(t)"], color:"d"}, {hline:2, color:"soft"}],
     out:(P, h) => h.calc(R`\log \vd{${P.t}} \doteq ${t3(h, Math.log10(P.t))}`)}},
  {warn:R`$\log$ na kalkulačke je dekadický, nie prirodzený. A $\ln$ nie je „$l \cdot n$“, je to jedna značka pre logaritmus so základom $e$.`}
],

"Pravidlá pre logaritmy":[
  R`Logaritmus je exponent, a exponenty sa pri násobení sčítajú. Preto sa logaritmus súčinu rovná súčtu logaritmov. Z toho plynú tri pravidlá, platia pre každý základ.`,
  {def:"Pravidlá pre logaritmy", tex:R`\begin{aligned}\log_a (xy) &= \log_a x + \log_a y\\ \log_a \frac{x}{y} &= \log_a x - \log_a y\\ \log_a x^n &= n \cdot \log_a x\end{aligned}`, note:R`Platia pre $x, y > 0$. Navyše $a^{\log_a x} = x$ a $\log_a a^n = n$.`},
  {tool:"graf", ask:R`Graf $y = \log(\va{k}x)$ a čiarkovane $y = \log x$. Meň $\va{k}$. Ako vznikne prvý graf z druhého?`,
   take:R`posunutím o $\log k$ zvislo: $\log(kx) = \log x + \log k$. Pri $k = 10$ je posun presne 1.`,
   cfg:{view:[-1, 3, 12, -3], tick:[1, 1], free:true, aspect:"2", fns:[{f:"log(k*x)", lhs:"y", dom:[.02, 12]}, {f:"log(x)", color:"axis", dash:true, thin:true, ghost:true, dom:[.02, 12]}],
     params:{k:{v:4, min:1, max:20, step:1, color:"a"}},
     out:(P, h) => h.calc(R`\log(\va{${P.k}}x) = \log x + \log \va{${P.k}} \doteq \log x + ${t3(h, Math.log10(P.k))}`)}},
  {ex:R`Vypočítaj $\log_2 12 - \log_2 3$ a $2\log 5 + \log 4$.`,
   steps:[
     ["Rozdiel logaritmov je logaritmus podielu.", R`\log_2 \frac{12}{3} = \log_2 4 = 2`],
     ["Exponent dovnútra, potom súčin.", R`\log 5^2 + \log 4 = \log(25 \cdot 4) = \log 100 = 2`]
   ],
   res:"$2$ a $2$."},
  {ex:R`Vyjadri pomocou $\log x$, $\log y$, $\log z$: $\log \dfrac{x^3 \sqrt{y}}{z^2}$.`,
   steps:[
     ["Podiel a súčin.", R`\log x^3 + \log \sqrt{y} - \log z^2`],
     [R`Exponenty pred logaritmus, $\sqrt{y} = y^{\frac{1}{2}}$.`, R`3\log x + \tfrac{1}{2}\log y - 2\log z`]
   ],
   res:R`$3\log x + \frac{1}{2}\log y - 2\log z$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\va{k}$ tak, aby bol graf $y = \log(kx)$ oproti $y = \log x$ posunutý presne o 1 hore.`,
   hint:R`$\log k = 1$.`,
   goal:P => P.k === 10,
   cfg:{view:[-1, 3, 12, -3], tick:[1, 1], free:true, aspect:"2", fns:[{f:"log(k*x)", lhs:"y", dom:[.02, 12]}, {f:"log(x)", color:"axis", dash:true, thin:true, ghost:true, dom:[.02, 12]}],
     params:{k:{v:2, min:1, max:20, step:1, color:"a"}},
     show:[{seg:[[1, 0], [1, "log(k)"]], color:"a"}],
     out:(P, h) => h.calc(R`\log \va{${P.k}} \doteq ${t3(h, Math.log10(P.k))}`)}},
  {warn:R`Pravidlo pre súčet neexistuje: $\log(x + y) \neq \log x + \log y$. Ani $\dfrac{\log x}{\log y}$ nie je $\log \dfrac{x}{y}$.`}
],

"Zmena základu":[
  R`Kalkulačka vie len $\log$ a $\ln$. Logaritmus s iným základom sa na ne prevedie vzorcom pre **zmenu základu**. Plynie z toho, že všetky logaritmické funkcie sú len zvislo natiahnuté kópie jednej.`,
  {def:"Zmena základu", tex:R`\log_{\va{a}} x = \frac{\log_b x}{\log_b \va{a}} = \frac{\log x}{\log \va{a}} = \frac{\ln x}{\ln \va{a}}`},
  {tool:"graf", ask:R`Graf $y = \log_{\va{a}} x = \dfrac{\ln x}{\ln a}$. Meň základ $\va{a}$. Čo majú všetky grafy spoločné?`,
   take:R`všetky prechádzajú bodom $[1;\ 0]$ a bodom $[a;\ 1]$. Pre $a > 1$ rastú, pre $0 < a < 1$ klesajú. Viac o grafe v [[b13]].`,
   cfg:{view:[-1, 3, 10, -3], tick:[1, 1], free:true, aspect:"2", fns:[{f:"ln(x)/ln(a)", lhs:"y", dom:[.02, 10]}],
     params:{a:{v:2, min:.25, max:8, step:.25, color:"a"}},
     show:[{pt:["a", 1], color:"a", label:"[a; 1]", at:"tl"}, {pt:[1, 0], color:"ink"}],
     out:(P, h) => P.a === 1 ? h.pill("základ 1 nie je dovolený", "down") : h.calc(R`y = \log_{\va{${h.tn(P.a)}}} x`)}},
  {ex:R`Vypočítaj $\log_2 10$ (kalkulačkou) a $\log_4 8$ (bez kalkulačky).`,
   steps:[
     ["Preveď na dekadický.", R`\log_2 10 = \frac{\log 10}{\log 2} = \frac{1}{0{,}301} \doteq 3{,}32`],
     ["Preveď na základ 2.", R`\log_4 8 = \frac{\log_2 8}{\log_2 4} = \frac{3}{2}`]
   ],
   res:R`$\log_2 10 \doteq 3{,}32$, $\log_4 8 = \dfrac{3}{2}$.`},
  {ex:R`Dokáž, že $\log_a b \cdot \log_b a = 1$.`,
   steps:[
     ["Oba preveď na dekadický.", R`\frac{\log b}{\log a} \cdot \frac{\log a}{\log b}`],
     ["Vykráť.", R`= 1`]
   ],
   res:"Platí pre všetky prípustné $a$, $b$."},
  {tool:"graf", kind:"uloha", ask:R`Nastav základ $\va{a}$ tak, aby graf $y = \log_a x$ prechádzal bodom $[8;\ 3]$.`,
   hint:R`$a^3 = 8$.`,
   goal:P => P.a === 2,
   cfg:{view:[-1, 4, 10, -3], tick:[1, 1], free:true, aspect:"1.6", fns:[{f:"ln(x)/ln(a)", lhs:"y", dom:[.02, 10]}],
     params:{a:{v:4, min:1.5, max:6, step:.5, color:"a"}},
     show:[{target:[8, 3], fn:0, label:"[8; 3]", at:"t"}]}},
  {warn:R`$\dfrac{\log x}{\log a}$ nie je $\log \dfrac{x}{a}$ ani $\log x - \log a$. Zlomok dvoch logaritmov sa neupravuje pravidlami, len počíta.`}
]

  }
};
})();

/* Exponenciálne rovnice a nerovnice */
(() => {
const L = v => ({v, lock:true});
const t3 = (h, v) => h.tn(Math.round(v * 1000) / 1000);
const EV = {view:[-4, 9, 4, -1], tick:1};

THEORY.b2 = {
  mins:35,
  brief:[
    R`Rovnaký základ: $a^{f(x)} = a^{g(x)} \;\Leftrightarrow\; f(x) = g(x)$.`,
    R`Iný základ: zlogaritmuj obe strany, $a^x = b \;\Rightarrow\; x = \dfrac{\log b}{\log a}$.`,
    R`Substitúcia $t = a^x$ (vždy $t > 0$) urobí z rovnice kvadratickú.`,
    R`Nerovnica: pri základe $a > 1$ znak ostáva, pri $0 < a < 1$ sa otočí.`
  ],
  subs:{

"Prevod na rovnaký základ":[
  R`**Exponenciálna rovnica** má neznámu v exponente. Funkcia $y = a^x$ je prostá ([[a20]]): rôzne exponenty dávajú rôzne hodnoty. Preto ak sa dve mocniny s rovnakým základom rovnajú, rovnajú sa aj exponenty.`,
  {def:"Rovnaký základ", tex:R`a^{f(x)} = a^{g(x)} \;\Leftrightarrow\; f(x) = g(x)\qquad (a > 0,\ a \neq 1)`},
  {tool:"graf", ask:R`Graf $y = 2^x$ a priamka $y = \vb{c}$. Pre ktoré $c$ vyjde riešenie rovnice $2^x = c$ celé číslo?`,
   take:R`pre mocniny dvojky: $c = 1, 2, 4, 8$ (a $\frac{1}{2}, \frac{1}{4}$). Vtedy stačí zapísať $c$ ako $2^n$ a porovnať exponenty.`,
   cfg:Object.assign({}, EV, {fns:[{f:"2^x", lhs:"y"}],
     params:{c:{v:8, min:.25, max:8, step:.25, color:"b"}},
     show:[{hline:"c", color:"b"}, {pt:["ln(c)/ln(2)", "c"], color:"a"}, {drop:["ln(c)/ln(2)", "c"], color:"a"}],
     out:(P, h) => { const x = Math.log2(P.c); return h.calc(R`2^x = \vb{${h.tn(P.c)}} \;\Rightarrow\; x ${Number.isInteger(x) ? "=" : "\\doteq"} ${t3(h, x)}`); }})},
  {ex:R`Vyrieš $4^x = 32$ a $9^{x + 1} = \left(\dfrac{1}{3}\right)^x$.`,
   steps:[
     [R`$4 = 2^2$, $32 = 2^5$.`, R`2^{2x} = 2^5 \;\Rightarrow\; 2x = 5 \;\Rightarrow\; x = \tfrac{5}{2}`],
     [R`$9 = 3^2$, $\frac{1}{3} = 3^{-1}$.`, R`3^{2x + 2} = 3^{-x} \;\Rightarrow\; 3x = -2 \;\Rightarrow\; x = -\tfrac{2}{3}`]
   ],
   res:R`$x = \dfrac{5}{2}$ a $x = -\dfrac{2}{3}$.`},
  {ex:R`Vyrieš $2^{x^2 - 3x} = \dfrac{1}{4}$.`,
   steps:[
     [R`$\frac{1}{4} = 2^{-2}$.`, R`x^2 - 3x = -2`],
     ["Kvadratická rovnica.", R`x^2 - 3x + 2 = 0 \;\Rightarrow\; x = 1 \vee x = 2`]
   ],
   res:R`$x \in \{1;\ 2\}$`},
  {tool:"graf", kind:"uloha", ask:R`Graf $y = 4^x$. Posuň bod $\vd{x_0}$ tak, aby $4^{x_0} = 32$.`,
   hint:R`$2^{2x} = 2^5$.`,
   goal:P => P.t === 2.5,
   cfg:{view:[-2, 34, 3, -3], tick:[1, 8], free:true, aspect:"1.2", fns:[{f:"4^x", lhs:"y"}],
     params:{t:{v:1, min:-1, max:3, step:.5, color:"d", name:"x₀"}},
     show:[{hline:32, color:"soft"}, {pt:["t", "4^t"], color:"d"}],
     out:(P, h) => h.calc(R`4^{\vd{${h.tn(P.t)}}} = ${t3(h, 4 ** P.t)}`)}},
  {warn:R`Exponenty sa smú porovnať len pri **rovnakom** základe. $2^x = 3^x$ neznamená „žiadne riešenie“: platí pre $x = 0$.`}
],

"Riešenie logaritmovaním":[
  R`Ak sa pravá strana nedá zapísať ako mocnina toho istého základu, obe strany sa **zlogaritmujú**. Exponent sa podľa pravidla $\log a^x = x \log a$ dostane pred logaritmus a rovnica je lineárna.`,
  {def:"Logaritmovanie", tex:R`a^x = b \;\Rightarrow\; x \log a = \log b \;\Rightarrow\; x = \frac{\log b}{\log a} = \log_a b`},
  {tool:"graf", ask:R`Graf $y = 3^x$ a priamka $y = \vb{c}$. Riešenie rovnice $3^x = c$ je $x = \frac{\log c}{\log 3}$. Over ho na grafe.`,
   take:R`priesečník je presne v $x = \log_3 c$. Pre $c = 7$ je to približne $1{,}771$.`,
   cfg:Object.assign({}, EV, {fns:[{f:"3^x", lhs:"y"}],
     params:{c:{v:7, min:.5, max:8.5, step:.5, color:"b"}},
     show:[{hline:"c", color:"b"}, {pt:["ln(c)/ln(3)", "c"], color:"a"}, {drop:["ln(c)/ln(3)", "c"], color:"a"}],
     out:(P, h) => h.calc(R`x = \frac{\log \vb{${h.tn(P.c)}}}{\log 3} \doteq ${t3(h, Math.log(P.c) / Math.log(3))}`)})},
  {ex:R`Vyrieš $3^x = 7$ a $5 \cdot 2^x = 40$.`,
   steps:[
     ["Zlogaritmuj.", R`x = \frac{\log 7}{\log 3} \doteq 1{,}771`],
     [R`Najprv vydeľ 5. Potom netreba logaritmus.`, R`2^x = 8 \;\Rightarrow\; x = 3`]
   ],
   res:R`$x \doteq 1{,}771$ a $x = 3$.`},
  {ex:R`Vyrieš $2^x = 3^{x - 1}$.`,
   steps:[
     ["Zlogaritmuj obe strany.", R`x \log 2 = (x - 1)\log 3`],
     ["Neznáme na jednu stranu.", R`x(\log 3 - \log 2) = \log 3`],
     ["Vyjadri.", R`x = \frac{\log 3}{\log 3 - \log 2} \doteq 2{,}71`]
   ],
   res:R`$x \doteq 2{,}71$`},
  {ex:R`Počet baktérií sa každú hodinu zdvojnásobí. Za koľko hodín vzrastie zo 100 na 1 000?`,
   steps:[
     ["Rovnica.", R`100 \cdot 2^t = 1\,000 \;\Rightarrow\; 2^t = 10`],
     ["Zlogaritmuj.", R`t = \frac{\log 10}{\log 2} = \frac{1}{0{,}301} \doteq 3{,}32`]
   ],
   res:"Približne za 3 hodiny a 20 minút."},
  {tool:"graf", kind:"uloha", ask:R`Nastav pravú stranu $\vb{c}$ tak, aby mala rovnica $3^x = c$ riešenie $x = 2$.`,
   hint:R`Dosaď $x = 2$.`,
   goal:P => P.c === 9,
   cfg:{view:[-3, 11, 3, -1], tick:1, free:true, aspect:"1", fns:[{f:"3^x", lhs:"y"}],
     params:{c:{v:4, min:1, max:10, step:.5, color:"b"}},
     show:[{hline:"c", color:"b"}, {vline:2, color:"soft"}]}},
  {warn:R`$\log 7 / \log 3$ nie je $\log \frac{7}{3}$ ani $\log 7 - \log 3$. Podiel logaritmov sa spočíta až na kalkulačke.`}
],

"Substitúcia":[
  R`Ak sa v rovnici vyskytuje $a^x$ aj $a^{2x}$, zaveď novú neznámu $t = a^x$. Potom $a^{2x} = (a^x)^2 = t^2$ a rovnica je kvadratická. Nakoniec sa vráť k $x$. Pozor: $t = a^x$ je vždy kladné.`,
  {def:"Substitúcia", tex:R`t = a^x > 0,\qquad a^{2x} = t^2,\qquad a^{x + k} = a^k \cdot t`},
  {ex:R`Vyrieš $4^x - 3 \cdot 2^x - 4 = 0$.`,
   steps:[
     [R`$4^x = (2^x)^2$, označ $t = 2^x$.`, R`t^2 - 3t - 4 = 0`],
     ["Korene.", R`t = 4 \vee t = -1`],
     [R`$t = -1$ nemôže byť, $2^x > 0$.`, R`2^x = 4 \;\Rightarrow\; x = 2`]
   ],
   res:R`$x = 2$`},
  {tool:"graf", kind:"obr", ask:R`Graf funkcie $y = 4^x - 3 \cdot 2^x - 4$.`,
   take:R`os $x$ pretína len raz, v bode $x = 2$. Druhý koreň kvadratickej rovnice $t = -1$ žiadnemu $x$ nezodpovedá.`,
   cfg:{view:[-4, 5, 3, -7], tick:1, free:true, aspect:"1", fns:[{f:"4^x-3*2^x-4", lhs:"y"}],
     show:[{pt:[2, 0], color:"c", label:"x = 2", at:"tl"}, {hline:-4, color:"soft"}]}},
  {ex:R`Vyrieš $9^x - 4 \cdot 3^x + 3 = 0$ a $2^{x + 1} + 2^x = 24$.`,
   steps:[
     [R`$t = 3^x$: $t^2 - 4t + 3 = 0$, $t = 1$ alebo $t = 3$.`, R`3^x = 1 \Rightarrow x = 0,\quad 3^x = 3 \Rightarrow x = 1`],
     [R`$2^{x + 1} = 2 \cdot 2^x$, vyber $2^x$.`, R`2^x(2 + 1) = 24 \;\Rightarrow\; 2^x = 8 \;\Rightarrow\; x = 3`]
   ],
   res:R`$\{0;\ 1\}$ a $x = 3$.`},
  {tool:"graf", kind:"uloha", ask:R`Nastav $\vd{q}$ tak, aby mala rovnica $9^x - 4 \cdot 3^x + q = 0$ riešenie $x = 0$.`,
   hint:R`Pre $x = 0$ je $9^0 = 3^0 = 1$.`,
   goal:P => P.q === 3,
   cfg:{view:[-3, 5, 2, -5], tick:1, fns:[{f:"9^x-4*3^x+q", lhs:"y"}],
     params:{q:{v:0, min:-2, max:5, step:1, color:"d"}},
     show:[{target:[0, 0], fn:0, label:"x = 0", at:"tl"}],
     out:(P, h) => h.calc(R`x = 0:\ 1 - 4 + \vd{${P.q}} = ${P.q - 3}`)}},
  {warn:R`Po substitúcii vyraď záporné (a nulové) hodnoty $t$. Rovnica $2^x = -1$ nemá riešenie.`}
],

"Exponenciálne nerovnice":[
  R`Pri nerovnici záleží na tom, či funkcia $a^x$ rastie, alebo klesá. Pri základe väčšom ako 1 väčší exponent dáva väčšiu hodnotu a znak ostáva. Pri základe medzi 0 a 1 je to naopak a znak sa otočí.`,
  {def:"Exponenciálna nerovnica", tex:R`a^{f(x)} < a^{g(x)} \;\Leftrightarrow\; \begin{cases} f(x) < g(x) & a > 1\\ f(x) > g(x) & 0 < a < 1\end{cases}`},
  {tool:"graf", ask:R`Graf $y = a^x$ a priamka $y = 4$. Meň základ $\va{a}$. Kedy je graf nad priamkou vpravo a kedy vľavo?`,
   take:R`pre $a > 1$ je $a^x > 4$ vpravo od priesečníka. Pre $0 < a < 1$ vľavo, nerovnosť pre exponent sa otočí.`,
   cfg:Object.assign({}, EV, {fns:[{f:"a^x", lhs:"y"}, {f:"4", lhs:"y", color:"c"}],
     params:{a:{v:.5, min:.25, max:4, step:.25, color:"a"}},
     show:[{pt:["ln(4)/ln(a)", 4], color:"d", if:P => P.a !== 1}],
     out:(P, h) => P.a === 1 ? h.pill("základ 1 nie je dovolený", "down") : h.calc(R`\va{${h.tn(P.a)}}^x > 4 \;\Leftrightarrow\; x ${P.a > 1 ? ">" : "<"} ${t3(h, Math.log(4) / Math.log(P.a))}`)})},
  {ex:R`Vyrieš $2^x > 8$, $\left(\dfrac{1}{2}\right)^x \geq 4$ a $3^{2x - 1} < 27$.`,
   steps:[
     [R`Základ 2 > 1, znak ostáva.`, R`2^x > 2^3 \;\Rightarrow\; x > 3`],
     [R`$4 = \left(\frac{1}{2}\right)^{-2}$, základ menší ako 1, znak sa otočí.`, R`x \leq -2`],
     [R`$27 = 3^3$.`, R`2x - 1 < 3 \;\Rightarrow\; x < 2`]
   ],
   res:R`$(3;\ \infty)$, $(-\infty;\ -2\rangle$, $(-\infty;\ 2)$.`},
  {tool:"os", kind:"uloha", ask:R`Nastav na osi riešenie nerovnice $\left(\dfrac{1}{2}\right)^x \geq 4$.`,
   hint:R`$\left(\frac{1}{2}\right)^x = 2^{-x}$, takže $-x \geq 2$.`,
   goal:P => P.linf && !P.rinf && P.b === -2 && P.lb,
   cfg:{typ:"interval", a:{v:0}, b:{v:3}, toggles:["la", "lb", "linf", "rinf"]}},
  {warn:R`Pri základe medzi 0 a 1 sa znak otočí. Kto to prehliadne, dostane presne opačný interval. Skúška jedným číslom: pre $x = -3$ je $\left(\frac{1}{2}\right)^{-3} = 8 \geq 4$, teda $-3$ do riešenia patrí.`}
]

  }
};
})();

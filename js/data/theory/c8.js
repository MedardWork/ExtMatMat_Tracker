/* Antiderivatives, indefinite and definite integral (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c8 = {
  mins:25,
  brief:[
    R`$F$ is an **antiderivative** of $f$ if $F' = f$. All antiderivatives are $F(x) + C$.`,
    R`$\int f(x)\,dx = F(x) + C$: $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ ($n \neq -1$), $\int \frac{1}{x}\,dx = \ln|x| + C$, $\int e^{kx}\,dx = \frac{1}{k}e^{kx} + C$.`,
    R`$\int \sin x\,dx = -\cos x + C$, $\int \cos x\,dx = \sin x + C$.`,
    R`Definite integral: $\int_a^b f(x)\,dx = \big[F(x)\big]_a^b = F(b) - F(a)$.`
  ],
  subs:{

"Antiderivatives":[
  R`Differentiation goes from a function to its slope. Now we go back: given $f$, find a function $F$ whose derivative is $f$. Such an $F$ is an **antiderivative** of $f$. Since constants disappear when we differentiate, $x^2$, $x^2 + 3$ and $x^2 - 7$ are all antiderivatives of $2x$.`,
  {def:"Antiderivative", tex:R`F'(x) = f(x) \qquad \text{all antiderivatives: } F(x) + \va{C}`},
  {tool:"graf", ask:R`The antiderivatives $F(x) = \frac{x^2}{2} + C$ of $f(x) = x$. Change $C$.`,
   take:R`the graph only moves up and down; the slope at each $x$ stays the same, so every curve has derivative $x$.`,
   cfg:{fns:["x^2/2 + C", {f:"x", color:"c", dash:true, thin:true}], params:{C:{v:0, min:-3, max:4, step:.5, color:"a"}}, view:[-4, 6, 4, -4]}},
  {ex:R`Find all antiderivatives of $f(x) = 3x^2 + 2$, and check.`,
   steps:[
     [R`$x^3$ has derivative $3x^2$, and $2x$ has derivative 2.`, R`F(x) = x^3 + 2x + C`],
     ["Check by differentiating.", R`F'(x) = 3x^2 + 2 = f(x)`]
   ],
   res:R`$F(x) = x^3 + 2x + C$.`},
  {tool:"graf", kind:"uloha", ask:R`Choose $C$ so that the antiderivative $F(x) = \frac{x^2}{2} + C$ passes through the point $[2, 5]$.`,
   hint:"F(2) = 2 + C = 5.",
   take:R`a single point fixes the constant: $F(x) = \frac{x^2}{2} + 3$.`,
   goal:P => P.C === 3,
   cfg:{fns:["x^2/2 + C"], params:{C:{v:0, min:-3, max:4, step:.5, color:"a"}}, view:[-4, 8, 4, -4], show:[{target:[2, 5], fn:0, label:"[2; 5]"}]}},
  {ex:R`Find the antiderivative of $f(x) = 2x$ whose graph passes through $[1, 4]$.`,
   steps:[
     ["All antiderivatives.", R`F(x) = x^2 + C`],
     ["Condition.", R`F(1) = 1 + C = 4 \Rightarrow C = 3`]
   ],
   res:R`$F(x) = x^2 + 3$.`},
  {warn:R`Always check an antiderivative by differentiating it. That is quicker than the integration and catches most mistakes (a wrong factor, a wrong sign).`}
],

"Indefinite integral":[
  R`The set of all antiderivatives is written as the **indefinite integral** $\int f(x)\,dx = F(x) + C$. The table below is the derivative table read backwards; the most used line is the power rule: raise the exponent by one and divide by the new exponent.`,
  {def:"Basic integrals", tex:R`\int x^n\,dx = \frac{x^{n+1}}{n+1} + C\ (n \neq -1) \qquad \int \frac{1}{x}\,dx = \ln|x| + C \qquad \int e^{kx}\,dx = \frac{1}{k}e^{kx} + C \qquad \int \sin x\,dx = -\cos x + C \qquad \int \cos x\,dx = \sin x + C`},
  {tool:"derivacia", ask:R`$F(x) = \frac{x^3}{3} - x$ and the graph of its derivative (dashed). Which function is it an antiderivative of?`,
   take:R`the dashed graph is $x^2 - 1$, so $\int (x^2 - 1)\,dx = \frac{x^3}{3} - x + C$.`,
   cfg:{typ:"dotycnica", en:true, f:"x^3/3 - x", x0:{v:1.5}, view:[-3, 4, 3, -3], on:{der:true}}},
  {ex:R`Find $\int (4x^3 - 6x + 1)\,dx$ and $\int \left(\sqrt{x} + \frac{1}{x^2}\right)dx$.`,
   steps:[
     ["Term by term.", R`\frac{4x^4}{4} - \frac{6x^2}{2} + x + C = x^4 - 3x^2 + x + C`],
     [R`Powers: $\sqrt{x} = x^{1/2}$, $\frac{1}{x^2} = x^{-2}$.`, R`\frac{x^{3/2}}{3/2} + \frac{x^{-1}}{-1} + C = \tfrac{2}{3}x\sqrt{x} - \frac{1}{x} + C`]
   ],
   res:R`$x^4 - 3x^2 + x + C$ and $\frac{2}{3}x\sqrt{x} - \frac{1}{x} + C$.`},
  {ex:R`Find $\int e^{2x}\,dx$ and $\int 3\cos x\,dx$.`,
   steps:[
     [R`$k = 2$.`, R`\tfrac{1}{2}e^{2x} + C`],
     ["Constant factor.", R`3\sin x + C`]
   ],
   res:R`$\frac{1}{2}e^{2x} + C$ and $3\sin x + C$.`},
  {warn:R`$\int \frac{1}{x}\,dx$ is not $\frac{x^0}{0}$: the power rule fails for $n = -1$, and the answer is $\ln|x|$. Also, $\int \sin x\,dx = -\cos x$, with a minus.`}
],

"Definite integral":[
  R`The **definite integral** from $a$ to $b$ is a number: the difference of an antiderivative at the two limits. The constant $C$ cancels, so any antiderivative will do. For $f \geq 0$ it is the area under the graph ([[c9]]); parts below the axis count negatively.`,
  {def:"Definite integral", tex:R`\int_{\va{a}}^{\vb{b}} f(x)\,dx = \big[F(x)\big]_{\va{a}}^{\vb{b}} = F(\vb{b}) - F(\va{a})`},
  {tool:"integral", ask:R`$f(x) = x^2 - 2x$ with $F(x) = \frac{x^3}{3} - x^2$. Move $a$ and $b$ and compare $F(b) - F(a)$ with the coloured area.`,
   take:R`the part below the axis is subtracted: the integral is the area above minus the area below.`,
   cfg:{typ:"plocha", en:true, F:"x^3/3 - x^2"}},
  {ex:R`Compute $\int_1^3 x^2\,dx$ and $\int_0^\pi \sin x\,dx$.`,
   steps:[
     ["Antiderivative of x².", R`\left[\frac{x^3}{3}\right]_1^3 = \frac{27}{3} - \frac{1}{3} = \frac{26}{3} \approx 8{,}67`],
     ["Antiderivative of sin x.", R`\big[-\cos x\big]_0^\pi = -\cos\pi + \cos 0 = 1 + 1 = 2`]
   ],
   res:R`$\frac{26}{3}$ and $2$.`},
  {tool:"integral", kind:"uloha", ask:R`$f(x) = x^2 - 2x$, $a = 0$. Move $b$ so that $\int_0^b f(x)\,dx = 0$.`,
   hint:"F(b) − F(0) = b³/3 − b² = b²(b/3 − 1) = 0.",
   take:R`at $b = 3$ the area above the axis (from 2 to 3) equals the area below (from 0 to 2): the integral is 0, the area is not.`,
   goal:P => P.b === 3,
   cfg:{typ:"plocha", en:true, F:"x^3/3 - x^2", a:L(0), b:{v:1}}},
  {warn:R`Brackets matter: $F(b) - F(a)$ with **all** of $F(a)$ subtracted. With $F(x) = \frac{x^3}{3} - x^2$ and $a = -1$: $F(-1) = -\frac{1}{3} - 1 = -\frac{4}{3}$, and minus that is $+\frac{4}{3}$.`}
]

  }
};
})();

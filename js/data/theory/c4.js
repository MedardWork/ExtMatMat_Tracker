/* Derivatives of the elementary functions (Danish Matematik A) */
(() => {
const D = st => st.h && st.h.der;
const cmp = (rule, g) => (P, h) => h.calc(R`f'(\va{${h.tn(P.x0)}}) \approx ${h.tn(h.der.m)} \qquad ${rule} = ${h.tn(g(P.x0))}`);

THEORY.c4 = {
  mins:25,
  brief:[
    R`$(x^n)' = n x^{n-1}$ for every real $n$: so $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$ and $\left(\frac{1}{x}\right)' = -\frac{1}{x^2}$.`,
    R`$(e^x)' = e^x$, $(a^x)' = a^x \ln a$, $(\ln x)' = \frac{1}{x}$.`,
    R`$(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(\tan x)' = 1 + \tan^2 x = \frac{1}{\cos^2 x}$, with $x$ in radians.`,
    R`Combine them with the rules of [[c3]]; these are in the formula booklet, but you should know them by heart.`
  ],
  subs:{

"Powers, √x and 1/x":[
  R`For $x^2$ the definition gave $2x$ ([[c2]]); for $x^3$ it gives $3x^2$. In general the exponent comes down in front and decreases by one. This **power rule** works for negative and fractional exponents too, so roots and fractions are written as powers first.`,
  {def:"Power rule", tex:R`(x^{\va{n}})' = \va{n}\,x^{\va{n} - 1} \qquad (\sqrt{x})' = \frac{1}{2\sqrt{x}} \qquad \left(\frac{1}{x}\right)' = -\frac{1}{x^2}`,
   note:"√x = x^(1/2) and 1/x = x^(−1). The rule holds where the function is defined (x > 0 for √x, x ≠ 0 for 1/x)."},
  {tool:"derivacia", ask:R`$f(x) = x^3$. The rule says $f'(x) = 3x^2$. Move $x_0$ and compare.`,
   take:R`the dashed $f'$ is the parabola $3x^2$. At 0 the tangent is horizontal, although $x^3$ keeps rising.`,
   cfg:{typ:"dotycnica", en:true, f:"x^3", x0:{v:1}, view:[-3, 5, 3, -5], on:{der:true}, out:cmp(R`3x_0^2`, x => 3 * x * x)}},
  {tool:"derivacia", ask:R`$f(x) = \frac{1}{x}$. Compare the slopes with $-\frac{1}{x^2}$.`,
   take:R`every tangent of the hyperbola falls: $-\frac{1}{x^2} < 0$ on both branches, steeply near 0 and flatly far away.`,
   cfg:{typ:"dotycnica", en:true, f:"1/x", x0:{v:1}, view:[-4, 4, 4, -4], on:{der:true}, out:cmp(R`-\frac{1}{x_0^2}`, x => -1 / (x * x))}},
  {ex:R`Differentiate $x^5$, $\frac{1}{x^2}$, $\sqrt[3]{x}$ and $3\sqrt{x} - \frac{4}{x}$.`,
   steps:[
     ["Power rule.", R`(x^5)' = 5x^4`],
     [R`$\frac{1}{x^2} = x^{-2}$.`, R`(x^{-2})' = -2x^{-3} = -\frac{2}{x^3}`],
     [R`$\sqrt[3]{x} = x^{1/3}$.`, R`\tfrac{1}{3} x^{-2/3} = \frac{1}{3\sqrt[3]{x^2}}`],
     ["Term by term.", R`3 \cdot \frac{1}{2\sqrt{x}} - 4 \cdot \left(-\frac{1}{x^2}\right) = \frac{3}{2\sqrt{x}} + \frac{4}{x^2}`]
   ],
   res:R`$5x^4$, $-\frac{2}{x^3}$, $\frac{1}{3\sqrt[3]{x^2}}$, $\frac{3}{2\sqrt{x}} + \frac{4}{x^2}$.`},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \sqrt{x}$. Move $x_0$ to the point where the tangent has slope $\frac{1}{4}$.`,
   hint:"1/(2√x) = 1/4 gives √x = 2.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - .25) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"sqrt(x)", x0:{v:1, min:.5, max:9}, view:[-1, 4, 9, -1], apart:true, tick:[1, 1], aspect:"2"}},
  {warn:R`Rewrite before you differentiate: $\frac{1}{x^2} = x^{-2}$ gives $-\frac{2}{x^3}$. Differentiating only the denominator, $\frac{1}{2x}$, is wrong, and so is $(\sqrt{x})' = \sqrt{1}$.`}
],

"eˣ, aˣ and ln x":[
  R`The number $e \approx 2{,}718$ is chosen exactly so that $e^x$ is its own derivative: at every point the slope of the graph equals its height. Every other exponential $a^x = e^{x \ln a}$ gets the extra factor $\ln a$ by the chain rule. The inverse function $\ln x$ has the derivative $\frac{1}{x}$.`,
  {def:"Exponentials and logarithm", tex:R`(e^x)' = e^x \qquad (e^{kx})' = k\,e^{kx} \qquad (a^x)' = a^x \ln a \qquad (\ln x)' = \frac{1}{x}`},
  {tool:"derivacia", ask:R`$f(x) = e^x$ with the graph of $f'$. Where is the dashed graph?`,
   take:R`it lies exactly on the graph of $f$: $(e^x)' = e^x$. The slope at $x_0$ equals the height $e^{x_0}$.`,
   cfg:{typ:"dotycnica", en:true, f:"exp(x)", x0:{v:0}, view:[-4, 6, 3, -1], on:{der:true}, out:cmp(R`e^{x_0}`, Math.exp)}},
  {tool:"derivacia", ask:R`$f(x) = 2^x$. Compare the slope with $2^{x_0}$: what is the ratio?`,
   take:R`slope : height is always $\ln 2 \approx 0{,}693$. That is the factor in $(2^x)' = 2^x \ln 2$.`,
   cfg:{typ:"dotycnica", en:true, f:"2^x", x0:{v:1}, view:[-4, 6, 3, -1], on:{der:true}, out:cmp(R`2^{x_0} \ln 2`, x => Math.pow(2, x) * Math.LN2)}},
  {ex:R`Differentiate $5e^x - 3$, $e^{3x}$, $4 \cdot 1{,}05^x$ and $\ln(3x)$.`,
   steps:[
     ["Constant factor, constant term.", R`(5e^x - 3)' = 5e^x`],
     ["Chain rule.", R`(e^{3x})' = 3e^{3x}`],
     [R`$a = 1{,}05$.`, R`(4 \cdot 1{,}05^x)' = 4 \cdot 1{,}05^x \ln 1{,}05 \approx 0{,}195 \cdot 1{,}05^x`],
     [R`$\ln(3x) = \ln 3 + \ln x$.`, R`(\ln(3x))' = \frac{1}{x}`]
   ],
   res:R`$5e^x$, $3e^{3x}$, $4 \ln(1{,}05) \cdot 1{,}05^x$, $\frac{1}{x}$.`},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \ln x$. Move $x_0$ to the point where the tangent has slope $\frac{1}{2}$.`,
   hint:"1/x = 1/2.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - .5) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"ln(x)", x0:{v:4, min:.5, max:6}, view:[-1, 3, 6, -3], on:{der:true}}},
  {warn:R`$(a^x)' \neq x\,a^{x-1}$: the power rule is for a variable base and a fixed exponent. For a fixed base and a variable exponent use $a^x \ln a$.`}
],

"sin and cos":[
  R`The slope of $\sin x$ at $x$ is $\cos x$: at $x = 0$ the sine rises with slope 1, at its top ($x = \frac{\pi}{2}$) the slope is 0. The cosine gets a minus sign: it starts by falling. These formulas only hold with $x$ in **radians**.`,
  {def:"Trigonometric functions", tex:R`(\sin x)' = \cos x \qquad (\cos x)' = -\sin x \qquad (\tan x)' = 1 + \tan^2 x = \frac{1}{\cos^2 x}`},
  {tool:"derivacia", ask:R`$f(x) = \sin x$ and its derivative. Which known graph is the dashed one?`,
   take:R`it is $\cos x$: where $\sin$ has a peak or a trough, $\cos$ crosses 0; where $\sin$ crosses the axis, $\cos$ is $\pm 1$.`,
   cfg:{typ:"dotycnica", en:true, f:"sin(x)", x0:{v:1}, view:[-7, 3, 7, -3], on:{der:true}, out:cmp(R`\cos x_0`, Math.cos)}},
  {tool:"derivacia", kind:"uloha", ask:R`$f(x) = \sin x$. Move $x_0$ to a point where the tangent is parallel to the line $y = x$.`,
   hint:"cos x = 1, for example at x = 0.",
   goal:(P, st) => !!D(st) && Math.abs(D(st).m - 1) < 1e-3,
   cfg:{typ:"dotycnica", en:true, f:"sin(x)", x0:{v:2}, view:[-7, 3, 7, -3]}},
  {ex:R`Differentiate $3\sin x - 2\cos x$, $\sin(2x)$ and $\sin x \cos x$.`,
   steps:[
     ["Term by term.", R`3\cos x - 2 \cdot (-\sin x) = 3\cos x + 2\sin x`],
     ["Chain rule.", R`\big(\sin(2x)\big)' = 2\cos(2x)`],
     ["Product rule.", R`\cos x \cdot \cos x + \sin x \cdot (-\sin x) = \cos^2 x - \sin^2 x`]
   ],
   res:R`$3\cos x + 2\sin x$; $2\cos(2x)$; $\cos^2 x - \sin^2 x = \cos(2x)$.`},
  {ex:R`Find the slope of $f(x) = 2\sin x + x$ at $x = \frac{\pi}{3}$.`,
   steps:[
     ["Derivative.", R`f'(x) = 2\cos x + 1`],
     ["Substitute.", R`f'\left(\tfrac{\pi}{3}\right) = 2 \cdot \tfrac{1}{2} + 1 = 2`]
   ],
   res:"The slope is 2."},
  {warn:R`Set the calculator (or CAS) to radians. In degrees, $(\sin x)' = \frac{\pi}{180}\cos x$, and the usual formulas no longer hold.`}
]

  }
};
})();

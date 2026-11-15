/* Volume of solids of revolution (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});

THEORY.c12 = {
  mins:20,
  brief:[
    R`Turning the region under $f$ on $[a, b]$ about the $x$-axis gives a solid with $V = \pi \int_a^b f(x)^2\,dx$.`,
    R`Each thin slice is a disc of radius $f(x)$ and area $\pi f(x)^2$.`,
    R`Cone, cylinder and sphere follow from the formula; it checks the known formulas.`,
    R`Region between two graphs ($f \geq g \geq 0$): $V = \pi \int_a^b \big(f(x)^2 - g(x)^2\big)\,dx$.`
  ],
  subs:{

"Volume formula π ∫ f(x)² dx":[
  R`Turn the graph of $f \geq 0$ on $[a, b]$ round the $x$-axis: it sweeps out a **solid of revolution**. Cut it across into thin slices. The slice at $x$ is almost a flat disc with radius $f(x)$, area $\pi f(x)^2$ and thickness $\Delta x$. Adding the slices and letting $\Delta x \to 0$ gives an integral.`,
  {def:"Volume of a solid of revolution", tex:R`V = \pi \int_{\va{a}}^{\vb{b}} f(x)^2\,dx`,
   note:"Square first, then integrate. The π stays outside the integral."},
  {tool:"integral", ask:R`$f(x) = \sqrt{x}$ on $[0, 4]$ turned about the $x$-axis. Move $a$ and $b$ and watch the volume.`,
   take:R`$V = \pi \int_0^4 x\,dx = 8\pi \approx 25{,}13$. Because $f^2 = x$, the cross-section grows evenly along the axis.`,
   cfg:{typ:"rotacia", en:true}},
  {ex:R`The line $f(x) = \frac{x}{2}$ on $[0, 4]$ is turned about the $x$-axis. Find the volume and compare with the cone formula.`,
   steps:[
     ["Square the function.", R`f(x)^2 = \frac{x^2}{4}`],
     ["Integral.", R`V = \pi \int_0^4 \frac{x^2}{4}\,dx = \pi \left[\frac{x^3}{12}\right]_0^4 = \frac{64\pi}{12} = \frac{16\pi}{3}`],
     [R`Cone with $r = f(4) = 2$, $h = 4$.`, R`\tfrac{1}{3}\pi r^2 h = \tfrac{1}{3}\pi \cdot 4 \cdot 4 = \tfrac{16\pi}{3}`]
   ],
   res:R`$V = \frac{16\pi}{3} \approx 16{,}76$, the same as the cone formula.`},
  {tool:"integral", ask:R`The line $f(x) = \frac{x}{2}$ from the example. What solid is it?`,
   take:R`a cone with the tip at the origin, radius 2 and height 4.`,
   cfg:{typ:"rotacia", en:true, f:"x/2", a:{v:0}, b:{v:4}}},
  {tool:"integral", kind:"uloha", ask:R`$f(x) = \sqrt{x}$, $a = 0$. Move $b$ so that the volume is $2\pi \approx 6{,}28$.`,
   hint:"V = π b²/2 = 2π.",
   take:R`$b = 2$. Half the length gives a quarter of the volume, because $V = \frac{\pi b^2}{2}$.`,
   goal:P => P.b === 2,
   cfg:{typ:"rotacia", en:true, a:L(0), b:{v:4}}},
  {ex:R`Derive the volume of a sphere with radius 3 from $f(x) = \sqrt{9 - x^2}$, $-3 \leq x \leq 3$.`,
   steps:[
     ["Square.", R`f(x)^2 = 9 - x^2`],
     ["Integral.", R`V = \pi \int_{-3}^{3} (9 - x^2)\,dx = \pi \left[9x - \tfrac{x^3}{3}\right]_{-3}^{3} = \pi(18 + 18)`],
     ["Compare.", R`36\pi = \tfrac{4}{3}\pi \cdot 3^3`]
   ],
   res:R`$V = 36\pi \approx 113{,}1$.`},
  {warn:R`$\pi \int f(x)^2\,dx$ is not $\pi \left(\int f(x)\,dx\right)^2$. Square the function first, and remember π.`}
],

"Solids of revolution in practice":[
  R`Bowls, vases, glasses and lenses are solids of revolution. Put the axis of symmetry on the $x$-axis, describe the profile by a function and integrate. If the solid is hollow (the region lies between two graphs), subtract the inner volume.`,
  {def:"Region between two graphs", tex:R`V = \pi \int_{\va{a}}^{\vb{b}} \big(f(x)^2 - g(x)^2\big)\,dx \qquad f(x) \geq g(x) \geq 0`,
   note:"Each slice is a ring (washer): a disc of radius f minus a disc of radius g."},
  {ex:R`A bowl has the profile $y = \sqrt{x}$ for $0 \leq x \leq 9$ (in cm, $x$ along the axis). How much does it hold?`,
   steps:[
     ["Volume.", R`V = \pi \int_0^9 x\,dx = \pi \left[\frac{x^2}{2}\right]_0^9 = \frac{81\pi}{2}`],
     ["Number.", R`\approx 127{,}2\ \text{cm}^3`]
   ],
   res:R`About $127\ \text{cm}^3$, i.e. 0,127 litre.`},
  {ex:R`The region between $f(x) = x$ and $g(x) = x^2$ on $[0, 1]$ is turned about the $x$-axis. Find the volume.`,
   steps:[
     [R`On $[0, 1]$, $x \geq x^2$.`, R`V = \pi \int_0^1 (x^2 - x^4)\,dx`],
     ["Evaluate.", R`\pi \left[\frac{x^3}{3} - \frac{x^5}{5}\right]_0^1 = \pi\left(\tfrac{1}{3} - \tfrac{1}{5}\right) = \frac{2\pi}{15}`]
   ],
   res:R`$V = \frac{2\pi}{15} \approx 0{,}419$.`},
  {tool:"integral", ask:R`The profile $f(x) = e^{x/2}$ on $[0, 2]$, a horn. Check the example below.`,
   take:R`$f(x)^2 = e^x$, so $V = \pi(e^2 - 1) \approx 20{,}07$.`,
   cfg:{typ:"rotacia", en:true, f:"exp(x/2)", a:{v:0}, b:{v:2}, view:[-1, 3.5, 4, -3.5]}},
  {ex:R`Find the volume when $f(x) = e^{x/2}$, $0 \leq x \leq 2$, is turned about the $x$-axis.`,
   steps:[
     ["Square.", R`\left(e^{x/2}\right)^2 = e^x`],
     ["Integral.", R`V = \pi \int_0^2 e^x\,dx = \pi \big[e^x\big]_0^2 = \pi(e^2 - 1)`]
   ],
   res:R`$V \approx 20{,}07$.`},
  {warn:R`For a hollow solid, $\pi\int (f - g)^2\,dx$ is wrong: subtract the squares, $\pi\int (f^2 - g^2)\,dx$. And check the units: lengths in cm give the volume in cm³.`}
]

  }
};
})();

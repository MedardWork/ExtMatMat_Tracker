/* Goniometria pravouhlého trojuholníka */
(() => {
const L = v => ({v, lock:true});
const t2 = (h, v) => h.tn(Math.round(v * 100) / 100);
const rad = d => d * Math.PI / 180;
/* right triangle: A at the origin, right angle at C = [c·cos α; 0], B = [c·cos α; c·sin α] */
const TRI = (extra = {}) => Object.assign({view:[-1, 9, 11, -1.5], tick:1, fns:[],
  show:[
    {poly:[[0, 0], ["c*cos(t*pi/180)", 0], ["c*cos(t*pi/180)", "c*sin(t*pi/180)"]], color:"c"},
    {seg:[[0, 0], ["c*cos(t*pi/180)", 0]], color:"b", w:3},
    {seg:[["c*cos(t*pi/180)", 0], ["c*cos(t*pi/180)", "c*sin(t*pi/180)"]], color:"a", w:3},
    {seg:[[0, 0], ["c*cos(t*pi/180)", "c*sin(t*pi/180)"]], color:"d", w:3},
    {text:[0.9, 0.35], s:"α", color:"ink"},
    {text:["c*cos(t*pi/180)/2", -0.5], s:"b", color:"b"},
    {text:["c*cos(t*pi/180)+0.3", "c*sin(t*pi/180)/2"], s:"a", color:"a", at:"r"},
    {text:["c*cos(t*pi/180)/2-0.4", "c*sin(t*pi/180)/2+0.4"], s:"c", color:"d"}
  ]}, extra);

THEORY.b16 = {
  mins:30,
  brief:[
    R`$\sin\alpha = \dfrac{\text{protiľahlá}}{\text{prepona}}$, $\cos\alpha = \dfrac{\text{priľahlá}}{\text{prepona}}$, $\tg\alpha = \dfrac{\text{protiľahlá}}{\text{priľahlá}}$.`,
    R`Strana: $a = c \sin\alpha$, $b = c\cos\alpha$, $a = b \tg\alpha$.`,
    R`Uhol: kalkulačkou $\sin^{-1}$, $\cos^{-1}$, $\tg^{-1}$ z pomeru strán (režim DEG).`,
    R`Sklon v percentách je $100 \cdot \tg\alpha$.`
  ],
  subs:{

"sin, cos, tg ako pomery strán":[
  R`V pravouhlom trojuholníku závisí pomer dvoch strán len od uhla, nie od veľkosti trojuholníka: všetky pravouhlé trojuholníky s uhlom $\alpha$ sú podobné. Tieto pomery dostali mená. Pre ostrý uhol $\alpha$ je $\va{a}$ **protiľahlá** odvesna, $\vb{b}$ **priľahlá** a $\vd{c}$ prepona.`,
  {def:"Goniometrické funkcie v pravouhlom trojuholníku", tex:R`\sin\alpha = \frac{\va{a}}{\vd{c}},\qquad \cos\alpha = \frac{\vb{b}}{\vd{c}},\qquad \tg\alpha = \frac{\va{a}}{\vb{b}}`},
  {tool:"graf", ask:R`Meň preponu $\vd{c}$ pri pevnom uhle. Menia sa pomery strán? A čo pri zmene uhla $\alpha$?`,
   take:R`pri zmene veľkosti sa pomery nemenia, menia sa len pri zmene uhla. Preto má zmysel hovoriť o $\sin 30^\circ$ bez ohľadu na trojuholník. Na jednotkovej kružnici ([[b8]]) je $c = 1$.`,
   cfg:TRI({params:{t:{v:35, min:5, max:85, step:5, color:"ink", name:"α"}, c:{v:8, min:3, max:10, step:.5, color:"d"}},
     out:(P, h) => { const a = P.c * Math.sin(rad(P.t)), b = P.c * Math.cos(rad(P.t));
       return h.calc(R`\sin ${P.t}^\circ = \frac{\va{${t2(h, a)}}}{\vd{${h.tn(P.c)}}} \doteq ${t2(h, a / P.c)}`) + h.calc(R`\cos ${P.t}^\circ = \frac{\vb{${t2(h, b)}}}{\vd{${h.tn(P.c)}}} \doteq ${t2(h, b / P.c)}`) + h.calc(R`\tg ${P.t}^\circ = \frac{\va{${t2(h, a)}}}{\vb{${t2(h, b)}}} \doteq ${t2(h, a / b)}`); }})},
  {ex:R`Pravouhlý trojuholník má odvesny $a = 3$, $b = 4$ a preponu $c = 5$. Urči $\sin$, $\cos$ a $\tg$ uhla $\alpha$ oproti strane $a$ a uhla $\beta$ oproti $b$.`,
   steps:[
     [R`Pre $\alpha$: protiľahlá $a$, priľahlá $b$.`, R`\sin\alpha = \tfrac{3}{5},\quad \cos\alpha = \tfrac{4}{5},\quad \tg\alpha = \tfrac{3}{4}`],
     [R`Pre $\beta$ sa úlohy odvesien vymenia.`, R`\sin\beta = \tfrac{4}{5},\quad \cos\beta = \tfrac{3}{5},\quad \tg\beta = \tfrac{4}{3}`]
   ],
   res:R`Všimni si: $\sin\alpha = \cos\beta$, lebo $\alpha + \beta = 90^\circ$.`},
  {warn:R`Ktorá odvesna je protiľahlá, závisí od uhla. Pre $\alpha$ je to $a$, pre $\beta$ je to $b$. Najprv si v obrázku vyznač uhol, potom pomenuj strany.`}
],

"Dopočítanie strán":[
  R`Ak poznáš jednu stranu a ostrý uhol, vyber funkciu, ktorá spája známu stranu s hľadanou. Z definície potom stranu vyjadríš.`,
  {def:"Strany z uhla", tex:R`\va{a} = \vd{c}\sin\alpha,\qquad \vb{b} = \vd{c}\cos\alpha,\qquad \va{a} = \vb{b}\tg\alpha`},
  {ex:R`Prepona má 10 cm, uhol $\alpha = 30^\circ$. Vypočítaj odvesny.`,
   steps:[
     ["Protiľahlá cez sínus.", R`a = 10 \cdot \sin 30^\circ = 5`],
     ["Priľahlá cez kosínus.", R`b = 10 \cdot \cos 30^\circ = 5\sqrt{3} \doteq 8{,}66`]
   ],
   res:R`$a = 5$ cm, $b \doteq 8{,}66$ cm.`},
  {ex:R`Priľahlá odvesna má 7 cm, $\alpha = 40^\circ$. Vypočítaj protiľahlú odvesnu a preponu.`,
   steps:[
     ["Tangens spája obe odvesny.", R`a = 7 \cdot \tg 40^\circ \doteq 5{,}87`],
     ["Prepona z kosínusu.", R`c = \frac{7}{\cos 40^\circ} \doteq 9{,}14`]
   ],
   res:R`$a \doteq 5{,}87$ cm, $c \doteq 9{,}14$ cm.`},
  {tool:"graf", kind:"uloha", ask:R`Prepona má dĺžku 10. Nastav uhol $\alpha$ tak, aby mala protiľahlá odvesna dĺžku 5.`,
   hint:R`$\sin\alpha = \frac{5}{10}$.`,
   goal:P => P.t === 30,
   cfg:TRI({params:{t:{v:60, min:5, max:85, step:5, color:"ink", name:"α"}, c:L(10)},
     out:(P, h) => h.calc(R`\va{a} = 10 \cdot \sin ${P.t}^\circ \doteq ${t2(h, 10 * Math.sin(rad(P.t)))}`)})},
  {warn:R`Pri delení goniometrickou funkciou pozor: $c = \frac{b}{\cos\alpha}$, nie $b \cdot \cos\alpha$. Kontrola: prepona musí vyjsť dlhšia než odvesna.`}
],

"Dopočítanie uhlov":[
  R`Ak poznáš dve strany, vypočítaš pomer a z neho uhol. Na kalkulačke slúžia tlačidlá $\sin^{-1}$, $\cos^{-1}$, $\tg^{-1}$ (v režime DEG). Druhý ostrý uhol je doplnok do $90^\circ$.`,
  {def:"Uhol z dvoch strán", tex:R`\alpha = \sin^{-1}\frac{a}{c} = \cos^{-1}\frac{b}{c} = \tg^{-1}\frac{a}{b},\qquad \beta = 90^\circ - \alpha`},
  {ex:R`Odvesny sú 5 a 12. Vypočítaj ostré uhly.`,
   steps:[
     ["Obe odvesny: tangens.", R`\tg\alpha = \frac{5}{12} \;\Rightarrow\; \alpha \doteq 22{,}62^\circ`],
     ["Doplnok.", R`\beta \doteq 67{,}38^\circ`]
   ],
   res:R`$\alpha \doteq 22{,}62^\circ$, $\beta \doteq 67{,}38^\circ$.`},
  {ex:R`Prepona 8, priľahlá odvesna 5. Aký je uhol $\alpha$?`,
   steps:[["Kosínus.", R`\cos\alpha = \frac{5}{8} = 0{,}625 \;\Rightarrow\; \alpha \doteq 51{,}32^\circ`]],
   res:R`$\alpha \doteq 51{,}32^\circ$`},
  {tool:"graf", kind:"uloha", ask:R`Nastav uhol $\alpha$ tak, aby boli obe odvesny rovnako dlhé.`,
   hint:R`$\tg\alpha = 1$.`,
   goal:P => P.t === 45,
   cfg:TRI({params:{t:{v:20, min:5, max:85, step:5, color:"ink", name:"α"}, c:L(9)},
     out:(P, h) => h.calc(R`\tg ${P.t}^\circ = \frac{\va{a}}{\vb{b}} \doteq ${t2(h, Math.tan(rad(P.t)))}`)})},
  {warn:R`Kalkulačka musí byť v režime **DEG**. V režime RAD vráti $\sin^{-1}(0{,}5) = 0{,}52$ (radiány) namiesto $30^\circ$.`}
],

"Slovné úlohy (výška, sklon)":[
  R`V praktických úlohách treba v situácii nájsť pravouhlý trojuholník. Typické sú **výškový uhol** (pod akým uhlom vidíme vrchol), **hĺbkový uhol** (pod akým uhlom pozeráme nadol) a **sklon** cesty, ktorý sa udáva v percentách.`,
  {def:"Sklon", tex:R`\text{sklon} = \frac{\text{prevýšenie}}{\text{vodorovná vzdialenosť}} \cdot 100\,\% = 100 \cdot \tg\alpha\ \%`},
  {tool:"graf", ask:R`Z miesta vzdialeného $\vb{d}$ od veže vidíme jej vrchol pod uhlom $\alpha$. Ako vysoká je veža?`,
   take:R`výška je protiľahlá odvesna, vzdialenosť priľahlá: $h = d \cdot \tg\alpha$. Väčší uhol alebo väčšia vzdialenosť dáva vyššiu vežu.`,
   cfg:{view:[-1, 13, 13, -1], tick:1, fns:[],
     params:{t:{v:35, min:10, max:45, step:5, color:"ink", name:"α"}, d:{v:10, min:4, max:12, step:1, color:"b"}},
     show:[{poly:[[0, 0], ["d", 0], ["d", "d*tan(t*pi/180)"]], color:"c"}, {seg:[[0, 0], ["d", 0]], color:"b", w:3}, {seg:[["d", 0], ["d", "d*tan(t*pi/180)"]], color:"a", w:4}],
     out:(P, h) => h.calc(R`h = \vb{${P.d}} \cdot \tg ${P.t}^\circ \doteq ${t2(h, P.d * Math.tan(rad(P.t)))}`)}},
  {ex:R`Z miesta vzdialeného 50 m od päty veže vidíme jej vrchol pod výškovým uhlom $32^\circ$. Oči máme vo výške $1{,}6$ m. Aká vysoká je veža?`,
   steps:[
     ["Výška nad očami.", R`50 \cdot \tg 32^\circ \doteq 31{,}24`],
     ["Pripočítaj výšku očí.", R`31{,}24 + 1{,}6 = 32{,}84`]
   ],
   res:R`Približne $32{,}8$ m.`},
  {ex:R`Cesta má sklon $8\,\%$. Aký uhol zviera s vodorovnou rovinou? O koľko stúpne na 2 km vodorovnej vzdialenosti?`,
   steps:[
     ["Sklon je tangens.", R`\tg\alpha = 0{,}08 \;\Rightarrow\; \alpha \doteq 4{,}57^\circ`],
     ["Prevýšenie.", R`2\,000 \cdot 0{,}08 = 160 \text{ m}`]
   ],
   res:R`$\alpha \doteq 4{,}57^\circ$, stúpne o 160 m.`},
  {ex:R`Rebrík dlhý 6 m zviera so zemou uhol $70^\circ$. Do akej výšky siaha?`,
   steps:[["Rebrík je prepona, výška protiľahlá odvesna.", R`h = 6 \cdot \sin 70^\circ \doteq 5{,}64`]],
   res:R`Približne $5{,}64$ m.`},
  {warn:R`Sklon $100\,\%$ nie je zvislá stena, ale uhol $45^\circ$ (stúpanie rovnaké ako vodorovná vzdialenosť). Percentá sklonu nie sú percentá z $90^\circ$.`}
]

  }
};
})();

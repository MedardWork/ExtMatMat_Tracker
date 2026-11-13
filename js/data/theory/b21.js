/* Priamka: parametrické, všeobecná a smernicová rovnica, smerový a normálový vektor */
(() => {

THEORY.b21 = {
  mins:35,
  brief:[
    R`Parametrické vyjadrenie: $x = x_A + t u_1$, $y = y_A + t u_2$, $t \in \mathbb{R}$, kde $\vec{u}$ je smerový vektor.`,
    R`Všeobecná rovnica: $ax + by + c = 0$, normálový vektor $\vec{n} = (a;\ b)$ je kolmý na priamku.`,
    R`Smernicový tvar: $y = kx + q$, smernica $k = \tg\alpha = \frac{u_2}{u_1}$.`,
    R`K $\vec{u} = (u_1;\ u_2)$ je normálový $\vec{n} = (-u_2;\ u_1)$ (alebo jeho násobok).`
  ],
  subs:{

"Parametrická rovnica":[
  R`Priamku určí bod $A$ a **smerový vektor** $\vec{u}$ (napríklad $\vec{AB}$). Každý bod priamky dostaneš, keď z $A$ prejdeš $t$-násobok vektora $\vec{u}$. Pre $t \in \langle 0;\ 1 \rangle$ vznikne úsečka $AB$.`,
  {def:"Parametrické vyjadrenie priamky", tex:R`X = A + t\vec{u}:\qquad x = x_A + t u_1,\quad y = y_A + t u_2,\quad t \in \mathbb{R}`},
  {tool:"analyticka", ask:R`Ťahaj body $A$ a $B$ a sleduj rovnice priamky. Ktoré čísla sa zmenia, keď posunieš len $B$?`,
   take:R`zmení sa smerový vektor $\vec{u} = \vec{AB}$. Bod $A$ v parametrickom vyjadrení zostane.`,
   cfg:{typ:"priamka", on:{vektory:true}}},
  {ex:R`Napíš parametrické vyjadrenie priamky cez $A\,[1;\ 2]$ a $B\,[4;\ -1]$. Leží na nej $C\,[7;\ -4]$?`,
   steps:[
     ["Smerový vektor.", R`\vec{u} = \vec{AB} = (3;\ -3)`],
     ["Parametrické vyjadrenie.", R`x = 1 + 3t,\quad y = 2 - 3t`],
     [R`Z $x$-ovej rovnice pre $C$: $7 = 1 + 3t$, $t = 2$. Over $y$.`, R`y = 2 - 6 = -4 \ \checkmark`]
   ],
   res:R`$x = 1 + 3t$, $y = 2 - 3t$; bod $C$ leží na priamke ($t = 2$).`},
  {warn:R`Parametrické vyjadrenie nie je jediné: iný bod alebo iný násobok smerového vektora opisuje tú istú priamku. Pri kontrole bodu musí vyjsť **to isté** $t$ z oboch rovníc.`}
],

"Všeobecná rovnica":[
  R`Z parametrického vyjadrenia sa vylúčením $t$ dostane rovnica bez parametra. Koeficienty pri $x$ a $y$ tvoria **normálový vektor** $\vec{n}$, ktorý je kolmý na priamku.`,
  {def:"Všeobecná rovnica priamky", tex:R`ax + by + c = 0,\qquad \vec{n} = (a;\ b)`},
  {ex:R`Napíš všeobecnú rovnicu priamky cez $A\,[1;\ 2]$ so smerovým vektorom $\vec{u} = (3;\ -3)$.`,
   steps:[
     [R`Normálový vektor je kolmý na $\vec{u}$, napríklad $(3;\ 3)$, zjednodušene $(1;\ 1)$.`, R`x + y + c = 0`],
     [R`Dosaď bod $A$.`, R`1 + 2 + c = 0 \;\Rightarrow\; c = -3`]
   ],
   res:R`$x + y - 3 = 0$`},
  {ex:R`Kde pretína priamka $2x - 3y + 6 = 0$ súradnicové osi?`,
   steps:[
     [R`Os $x$: $y = 0$.`, R`2x + 6 = 0 \;\Rightarrow\; x = -3`],
     [R`Os $y$: $x = 0$.`, R`-3y + 6 = 0 \;\Rightarrow\; y = 2`]
   ],
   res:R`$[-3;\ 0]$ a $[0;\ 2]$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Presuň body $A$ a $B$ tak, aby priamka $AB$ mala rovnicu $x - y + 1 = 0$.`,
   hint:R`Body na priamke spĺňajú $y = x + 1$, napríklad $[0;\ 1]$ a $[2;\ 3]$.`,
   goal:P => P.Ay === P.Ax + 1 && P.By === P.Bx + 1 && (P.Ax !== P.Bx),
   cfg:{typ:"priamka"}},
  {warn:R`Rovnica priamky nie je jediná: $x + y - 3 = 0$ a $2x + 2y - 6 = 0$ je tá istá priamka. Normálový vektor je určený len až na násobok.`}
],

"Smernicový tvar":[
  R`Ak priamka nie je zvislá, z všeobecnej rovnice sa dá vyjadriť $y$. Dostaneš lineárnu funkciu ([[a21]]): **smernica** $k$ udáva sklon, $q$ priesečník s osou $y$.`,
  {def:"Smernicový tvar", tex:R`y = kx + q,\qquad k = \tg\alpha = \frac{u_2}{u_1} = -\frac{a}{b}`, note:R`$\alpha$ je uhol priamky s kladnou polosou $x$. Zvislá priamka $x = c$ smernicu nemá.`},
  {ex:R`Preveď $x + y - 3 = 0$ na smernicový tvar a urči uhol s osou $x$.`,
   steps:[
     ["Vyjadri $y$.", R`y = -x + 3,\quad k = -1`],
     [R`$\tg\alpha = -1$.`, R`\alpha = 135^\circ`]
   ],
   res:R`$y = -x + 3$, $\alpha = 135^\circ$.`},
  {ex:R`Napíš rovnicu priamky cez $[0;\ 2]$, ktorá zviera s osou $x$ uhol $60^\circ$.`,
   steps:[["Smernica.", R`k = \tg 60^\circ = \sqrt{3},\quad q = 2`]],
   res:R`$y = \sqrt{3}x + 2$`},
  {tool:"analyticka", kind:"uloha", ask:R`Presuň body tak, aby priamka $AB$ bola vodorovná (smernica 0).`,
   hint:"Oba body musia mať rovnakú $y$-ovú súradnicu.",
   goal:P => P.Ay === P.By && P.Ax !== P.Bx,
   cfg:{typ:"priamka"}},
  {warn:R`Smernica je $\frac{u_2}{u_1}$ (zmena $y$ ku zmene $x$), nie naopak. A zvislá priamka nemá smernicový tvar, jej rovnica je $x = c$.`}
],

"Smerový a normálový vektor":[
  R`Smerový vektor ukazuje smer priamky, normálový je naň kolmý. Ak poznáš jeden, druhý dostaneš výmenou zložiek a zmenou jedného znamienka. Ich skalárny súčin je nula ([[b20]]).`,
  {def:"Vzťah vektorov", tex:R`\vec{u} = (u_1;\ u_2) \;\Rightarrow\; \vec{n} = (-u_2;\ u_1),\qquad \vec{n} = (a;\ b) \;\Rightarrow\; \vec{u} = (-b;\ a)`},
  {tool:"analyticka", ask:R`Ťahaj body a pozoruj smerový a normálový vektor. Zvierajú vždy pravý uhol?`,
   take:R`áno, normálový vektor je stále kolmý na priamku. Z neho sa priamo číta všeobecná rovnica.`,
   cfg:{typ:"priamka", on:{vektory:true}}},
  {ex:R`Priamka $p: 2x - 3y + 6 = 0$. Urči jej normálový a smerový vektor a smernicu.`,
   steps:[
     ["Normálový z koeficientov.", R`\vec{n} = (2;\ -3)`],
     ["Smerový: vymeň a zmeň znamienko.", R`\vec{u} = (3;\ 2)`],
     ["Smernica.", R`k = \frac{2}{3}`]
   ],
   res:R`$\vec{n} = (2;\ -3)$, $\vec{u} = (3;\ 2)$, $k = \frac{2}{3}$.`},
  {ex:R`Napíš rovnicu priamky cez $M\,[1;\ -2]$ kolmej na priamku $3x + y - 5 = 0$.`,
   steps:[
     [R`Normálový vektor danej priamky $(3;\ 1)$ je smerovým vektorom hľadanej.`, R`\vec{u} = (3;\ 1) \;\Rightarrow\; \vec{n} = (-1;\ 3)`],
     ["Dosaď bod.", R`-x + 3y + c = 0,\quad -1 - 6 + c = 0 \;\Rightarrow\; c = 7`]
   ],
   res:R`$-x + 3y + 7 = 0$, čiže $x - 3y - 7 = 0$.`},
  {warn:R`Smerový a normálový vektor sa ľahko zamenia. Kontrola: smerový vektor dosadený do $ax + by$ (bez $c$) musí dať nulu.`}
]

  }
};
})();

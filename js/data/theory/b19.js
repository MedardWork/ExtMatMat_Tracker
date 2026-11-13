/* Súradnice v rovine, vzdialenosť bodov, stred úsečky, deliaci pomer */
(() => {

THEORY.b19 = {
  mins:25,
  brief:[
    R`Bod $A = [x;\ y]$: najprv vodorovná súradnica, potom zvislá.`,
    R`Vzdialenosť: $|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$.`,
    R`Stred úsečky: $S = \left[\frac{x_A + x_B}{2};\ \frac{y_A + y_B}{2}\right]$.`,
    R`Bod, ktorý delí $AB$ v pomere $m : n$: $X = A + \frac{m}{m + n}(B - A)$.`
  ],
  subs:{

"Súradnice bodu":[
  R`Dve kolmé číselné osi so spoločným počiatkom $O$ tvoria **súradnicovú sústavu**. Poloha bodu je daná dvojicou čísel $[x;\ y]$: o koľko je vpravo (vľavo) od osi $y$ a o koľko hore (dole) od osi $x$. Osi delia rovinu na štyri kvadranty.`,
  {def:"Súmernosť bodov", tex:R`A = [x;\ y]:\quad \text{os } x \to [x;\ -y],\quad \text{os } y \to [-x;\ y],\quad O \to [-x;\ -y]`},
  {tool:"analyticka", ask:R`Ťahaj body $A$ a $B$ a sleduj ich súradnice. Aké znamienka majú súradnice v jednotlivých kvadrantoch?`,
   take:R`I. kvadrant $[+;\ +]$, II. $[-;\ +]$, III. $[-;\ -]$, IV. $[+;\ -]$. Body na osiach majú jednu súradnicu nulovú.`,
   cfg:{typ:"body"}},
  {tool:"analyticka", kind:"uloha", ask:R`Bod $B$ je $[5;\ 3]$. Presuň bod $A$ tak, aby bol súmerný s $B$ podľa osi $y$.`,
   hint:"Zmení sa len znamienko $x$-ovej súradnice.",
   goal:P => P.Ax === -5 && P.Ay === 3,
   cfg:{typ:"body", fixed:["B"]}},
  {warn:R`Poradie súradníc je dôležité: $[2;\ 5]$ a $[5;\ 2]$ sú rôzne body. Prvá je vždy $x$ (vodorovne).`}
],

"Vzdialenosť dvoch bodov":[
  R`Úsečka $AB$ je prepona pravouhlého trojuholníka s odvesnami $|x_B - x_A|$ a $|y_B - y_A|$. Z Pytagorovej vety ([[a29]]) plynie vzorec pre vzdialenosť.`,
  {def:"Vzdialenosť bodov", tex:R`|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`},
  {tool:"analyticka", ask:R`Ťahaj body a sleduj vzdialenosť. Kedy vyjde celé číslo?`,
   take:R`keď sú rozdiely súradníc odvesnami pytagorejského trojuholníka: napríklad $3$ a $4$ dajú $5$, $6$ a $8$ dajú $10$.`,
   cfg:{typ:"body"}},
  {ex:R`Vypočítaj vzdialenosť bodov $A\,[-3;\ -1]$ a $B\,[5;\ 3]$.`,
   steps:[["Rozdiely a vzorec.", R`|AB| = \sqrt{8^2 + 4^2} = \sqrt{80} = 4\sqrt{5} \doteq 8{,}94`]],
   res:R`$4\sqrt{5}$`},
  {ex:R`Bod $B\,[4;\ y]$ je od bodu $A\,[1;\ 2]$ vzdialený 5. Nájdi $y$.`,
   steps:[
     ["Dosaď do vzorca.", R`(4 - 1)^2 + (y - 2)^2 = 25 \;\Rightarrow\; (y - 2)^2 = 16`],
     ["Dve možnosti.", R`y - 2 = \pm 4 \;\Rightarrow\; y = 6 \vee y = -2`]
   ],
   res:R`$y = 6$ alebo $y = -2$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Bod $A = [-3;\ -1]$ je pevný. Presuň $B$ tak, aby bola vzdialenosť $|AB| = 5$ a $B$ neležal na rovnakej vodorovnej ani zvislej priamke ako $A$.`,
   hint:R`Rozdiely súradníc 3 a 4 (v ľubovoľnom poradí a so znamienkami).`,
   goal:P => Math.abs(Math.hypot(P.Bx - P.Ax, P.By - P.Ay) - 5) < 1e-9 && P.Bx !== P.Ax && P.By !== P.Ay,
   cfg:{typ:"body", fixed:["A"]}},
  {warn:R`Rozdiel súradníc sa umocňuje, takže znamienko nevadí: $(x_B - x_A)^2 = (x_A - x_B)^2$. Ale odmocninu zo súčtu neroztrhni: $\sqrt{64 + 16} \neq 8 + 4$.`}
],

"Stred úsečky":[
  R`Stred úsečky leží v polovici medzi koncami. Jeho súradnice sú priemery súradníc koncových bodov.`,
  {def:"Stred úsečky", tex:R`S = \left[\frac{x_A + x_B}{2};\ \frac{y_A + y_B}{2}\right]`},
  {ex:R`Nájdi stred úsečky $A\,[-3;\ -1]$, $B\,[5;\ 3]$. Potom nájdi bod $D$, ak $A\,[2;\ 5]$ a stred $AD$ je $S\,[4;\ 1]$.`,
   steps:[
     ["Priemery.", R`S = \left[\tfrac{-3 + 5}{2};\ \tfrac{-1 + 3}{2}\right] = [1;\ 1]`],
     [R`Opačne: $D = 2S - A$.`, R`D = [8 - 2;\ 2 - 5] = [6;\ -3]`]
   ],
   res:R`$[1;\ 1]$ a $D\,[6;\ -3]$.`},
  {tool:"analyticka", kind:"uloha", ask:R`Bod $A = [-3;\ -1]$ je pevný. Presuň $B$ tak, aby bol stred úsečky $AB$ v počiatku $[0;\ 0]$.`,
   hint:"Bod $B$ je súmerný s $A$ podľa počiatku.",
   goal:P => P.Bx === 3 && P.By === 1,
   cfg:{typ:"body", fixed:["A"]}},
  {warn:R`Stred je **priemer** súradníc, nie ich rozdiel: $\frac{x_A + x_B}{2}$. Rozdiel $x_B - x_A$ patrí do vzorca pre vzdialenosť a vektor.`}
],

"Deliaci pomer":[
  R`Bod $X$ delí úsečku $AB$ v pomere $m : n$, ak $|AX| : |XB| = m : n$. Od $A$ sa teda prejde $\frac{m}{m + n}$ celej úsečky. Stred je prípad $1 : 1$.`,
  {def:"Deliaci bod", tex:R`X = A + \frac{\va{m}}{\va{m} + \vb{n}}\,(B - A)`},
  {tool:"analyticka", ask:R`Meň pomer $\va{m} : \vb{n}$. Kde leží bod $X$ pri $1 : 1$, $1 : 2$ a $3 : 1$?`,
   take:R`pri $1 : 1$ v strede, pri $1 : 2$ v tretine od $A$, pri $3 : 1$ v troch štvrtinách. Čím väčšie $m$, tým bližšie k $B$.`,
   cfg:{typ:"body", on:{pomer:true}}},
  {ex:R`Úsečku $A\,[0;\ 0]$, $B\,[6;\ 9]$ rozdeľ v pomere $1 : 2$.`,
   steps:[["Tretina cesty od $A$.", R`X = [0;\ 0] + \tfrac{1}{3}[6;\ 9] = [2;\ 3]`]],
   res:R`$X\,[2;\ 3]$`},
  {ex:R`Nájdi ťažisko trojuholníka $A\,[1;\ 1]$, $B\,[7;\ 2]$, $C\,[4;\ 6]$.`,
   steps:[["Ťažisko delí ťažnicu v pomere $2 : 1$, jeho súradnice sú priemery vrcholov.", R`T = \left[\tfrac{1 + 7 + 4}{3};\ \tfrac{1 + 2 + 6}{3}\right] = [4;\ 3]`]],
   res:R`$T\,[4;\ 3]$`},
  {warn:R`Pomer $1 : 2$ neznamená polovicu, ale tretinu: celok má $1 + 2 = 3$ diely ([[a1]]).`}
]

  }
};
})();

/* ============================================================
   TOPICS
   t: "a" already taught (Y1–Y3) | "b" not taught yet | "c" Danish extra
   src: which year covered it     pre: prerequisite ids
   ============================================================ */
const T = [
/* ---------- A · ZÁKLADY ---------- */
{id:"a1", t:"a", area:"zaklady", n:"Percentá, promile, pomer, trojčlenka, priama a nepriama úmernosť", src:"Y1"},
{id:"a2", t:"a", area:"zaklady", n:"Finančná matematika: úrok, pôžička, hypotéka, umorovací plán", src:"Y1"},
{id:"a3", t:"a", area:"zaklady", n:"Zaokrúhľovanie, približné čísla, zápis v tvare a · 10ⁿ", src:"Y1"},
{id:"a4", t:"a", area:"zaklady", n:"Pozičné číselné sústavy — dvojková, šestnástková, rímske čísla", src:"Y1 Y2 Y3"},
{id:"a5", t:"a", area:"zaklady", n:"Deliteľnosť, prvočísla, prvočíselný rozklad, NSD a NSN", src:"Y2 Y3"},
{id:"a6", t:"a", area:"zaklady", n:"Množiny, číselné obory, intervaly, Vennove diagramy", src:"Y2 Y3"},
{id:"a7", t:"a", area:"zaklady", n:"Výrok, negácia, spojky, implikácia, ekvivalencia, pravdivostné tabuľky", src:"Y1 Y3"},
{id:"a8", t:"a", area:"zaklady", n:"Kvantifikované výroky a ich negácia", src:"Y3"},
{id:"a9", t:"a", area:"zaklady", n:"Dôkazy: priamy, nepriamy, sporom", src:"Y3 sem.", m:"V písomke sa to objaví ako protipríklad, obmena implikácie alebo posúdenie správnosti postupu riešenia — nie ako celý napísaný dôkaz."},
{id:"a10",t:"a", area:"zaklady", n:"Úpravy výrazov, mnohočleny, rozklad na súčin, doplnenie na štvorec", src:"Y1 Y2 Y3"},
{id:"a11",t:"a", area:"zaklady", n:"Mocniny, odmocniny, usmerňovanie zlomkov", src:"Y3"},
{id:"a12",t:"a", area:"zaklady", n:"Lomené výrazy a ich definičný obor", src:"Y3"},
{id:"a13",t:"a", area:"zaklady", n:"Výrazy s absolútnou hodnotou", src:"Y3"},
{id:"a14",t:"a", area:"zaklady", n:"Lineárne rovnice a nerovnice, sústavy", src:"Y1 Y2 Y3"},
{id:"a15",t:"a", area:"zaklady", n:"Kvadratická rovnica: diskriminant, doplnenie na štvorec", src:"Y2"},
{id:"a16",t:"a", area:"zaklady", n:"Rovnica s neznámou v menovateli", src:"Y2"},
{id:"a17",t:"a", area:"zaklady", n:"Iracionálne rovnice a nerovnice", src:"Y3"},

/* ---------- A · FUNKCIE ---------- */
{id:"a18",t:"a", area:"funkcie", n:"Pojem funkcie, definičný obor, obor hodnôt, graf", src:"Y2"},
{id:"a19",t:"a", area:"funkcie", n:"Vlastnosti: monotónnosť, extrémy, ohraničenosť, parita, periodičnosť", src:"Y2 Y3"},
{id:"a20",t:"a", area:"funkcie", n:"Prostá, inverzná a zložená funkcia", src:"Y3 sem."},
{id:"a21",t:"a", area:"funkcie", n:"Lineárna funkcia a smernica", src:"Y2"},
{id:"a22",t:"a", area:"funkcie", n:"Kvadratická funkcia a vrchol paraboly", src:"Y2"},
{id:"a23",t:"a", area:"funkcie", n:"Mocninové funkcie y = xⁿ pre celé n", src:"Y3"},
{id:"a24",t:"a", area:"funkcie", n:"Exponenciálna funkcia a jej graf", src:"Y3"},
{id:"a25",t:"a", area:"funkcie", n:"Aritmetická postupnosť a súčet n členov", src:"Y3 sem."},
{id:"a26",t:"a", area:"funkcie", n:"Geometrická postupnosť a súčet n členov", src:"Y3 sem."},

/* ---------- A · PLANIMETRIA ---------- */
{id:"a27",t:"a", area:"planimetria", n:"Uhly a ich dvojice, súhlasné a striedavé uhly", src:"Y1"},
{id:"a28",t:"a", area:"planimetria", n:"Trojuholník: ťažnice, ťažisko, stredná priečka, vpísaná a opísaná kružnica", src:"Y2"},
{id:"a29",t:"a", area:"planimetria", n:"Pytagorova veta", src:"Y1 Y2"},
{id:"a30",t:"a", area:"planimetria", n:"Euklidove vety", src:"Y2"},
{id:"a31",t:"a", area:"planimetria", n:"Tálesova veta a Tálesova kružnica", src:"Y2"},
{id:"a32",t:"a", area:"planimetria", n:"Zhodnosť a podobnosť trojuholníkov (sss, sus, usu, Ssu, uu)", src:"Y1 Y2"},
{id:"a33",t:"a", area:"planimetria", n:"Obvody a obsahy rovinných útvarov", src:"Y1 Y2"},
{id:"a34",t:"a", area:"planimetria", n:"Kružnica a kruh: tetiva, dotyčnica, výsek, odsek, dĺžka oblúka", src:"Y2"},
{id:"a35",t:"a", area:"planimetria", n:"Štvoruholníky a mnohouholníky", src:"Y2"},

/* ---------- A · STEREOMETRIA ---------- */
{id:"a36",t:"a", area:"stereometria", n:"Objem a povrch hranatých telies — kocka, kváder, hranol, ihlan", src:"Y2 Y3"},
{id:"a37",t:"a", area:"stereometria", n:"Objem a povrch rotačných telies — valec, kužeľ, guľa", src:"Y2 Y3"},

/* ---------- A · KPŠ ---------- */
{id:"a38",t:"a", area:"kps", n:"Pravidlo súčtu a súčinu, systematické vypisovanie možností", src:"Y1 Y2"},
{id:"a39",t:"a", area:"kps", n:"Faktoriál a kombinačné číslo", src:"Y1 Y2"},
{id:"a40",t:"a", area:"kps", n:"Variácie, permutácie a kombinácie bez opakovania", src:"Y2"},
{id:"a41",t:"a", area:"kps", n:"Pravdepodobnosť ako pomer priaznivých ku všetkým", src:"Y1"},
{id:"a42",t:"a", area:"kps", n:"Štatistický súbor, početnosť, histogram, kruhový a stĺpcový graf", src:"Y1"},

/* ---------- B · ZÁKLADY (chýba) ---------- */
{id:"b1", t:"b", area:"zaklady", n:"Logaritmus: definícia, dekadický a prirodzený, pravidlá pre logaritmy"},
{id:"b2", t:"b", area:"zaklady", n:"Exponenciálne rovnice a nerovnice", pre:["a24"]},
{id:"b3", t:"b", area:"zaklady", n:"Logaritmické rovnice a nerovnice", pre:["b1"]},
{id:"b4", t:"b", area:"zaklady", n:"Kvadratické nerovnice, súčinový a podielový tvar", pre:["a15"]},
{id:"b5", t:"b", area:"zaklady", n:"Rovnice a nerovnice s absolútnou hodnotou", pre:["a13"]},
{id:"b6", t:"b", area:"zaklady", n:"Viètove vzťahy a koreňoví činitelia", pre:["a15"]},
{id:"b7", t:"b", area:"zaklady", n:"Nerovnica s dvoma neznámymi a jej obraz v rovine"},

/* ---------- B · FUNKCIE (chýba) ---------- */
{id:"b8", t:"b", area:"funkcie", n:"Oblúková miera a jednotková kružnica", m:"Vstupná brána do celej goniometrie."},
{id:"b9", t:"b", area:"funkcie", n:"Goniometrické funkcie sin, cos, tg — hodnoty, grafy, perióda", pre:["b8"]},
{id:"b10",t:"b", area:"funkcie", n:"Goniometrické identity a vzorce pre dvojnásobný uhol", pre:["b9"]},
{id:"b11",t:"b", area:"funkcie", n:"Goniometrické rovnice a nerovnice", pre:["b9"]},
{id:"b12",t:"b", area:"funkcie", n:"Transformácie grafov: f(x)+a, f(x+a), a·f(x), f(ax), |f(x)|", pre:["a18"]},
{id:"b13",t:"b", area:"funkcie", n:"Logaritmická funkcia a jej graf", pre:["b1"]},
{id:"b14",t:"b", area:"funkcie", n:"Lineárna lomená funkcia a asymptoty", pre:["a12"]},
{id:"b15",t:"b", area:"funkcie", n:"Mnohočleny: stupeň, počet reálnych koreňov, polynomická funkcia"},

/* ---------- B · PLANIMETRIA (chýba) ---------- */
{id:"b16",t:"b", area:"planimetria", n:"Goniometria pravouhlého trojuholníka", pre:["b9"]},
{id:"b17",t:"b", area:"planimetria", n:"Sínusová a kosínusová veta, obsah S = ½ · a · b · sin γ", pre:["b9"]},
{id:"b18",t:"b", area:"planimetria", n:"Stredový a obvodový uhol", pre:["a34"]},
{id:"b19",t:"b", area:"planimetria", n:"Súradnice v rovine, vzdialenosť bodov, stred úsečky, deliaci pomer"},
{id:"b20",t:"b", area:"planimetria", n:"Vektory: súradnice, súčet, násobok, dĺžka, skalárny súčin, uhol", pre:["b19"]},
{id:"b21",t:"b", area:"planimetria", n:"Priamka: parametrické, všeobecná a smernicová rovnica, smerový a normálový vektor", pre:["b20"]},
{id:"b22",t:"b", area:"planimetria", n:"Vzájomná poloha priamok, priesečník, uhol dvoch priamok", pre:["b21"]},
{id:"b23",t:"b", area:"planimetria", n:"Vzdialenosť bodu od priamky, obsah trojuholníka z vrcholov", pre:["b21"]},
{id:"b24",t:"b", area:"planimetria", n:"Rovnica kružnice, poloha priamky a kružnice, dvoch kružníc", pre:["b21"]},
{id:"b25",t:"b", area:"planimetria", n:"Množiny bodov danej vlastnosti a ich analytické vyjadrenie", pre:["b24"]},
{id:"b26",t:"b", area:"planimetria", n:"Zhodné zobrazenia: osová a stredová súmernosť, posunutie, otočenie"},
{id:"b27",t:"b", area:"planimetria", n:"Rovnoľahlosť a podobné zobrazenia", pre:["b26"]},
{id:"b28",t:"b", area:"planimetria", n:"Konštrukčné úlohy: základné konštrukcie a počet riešení", pre:["b26"], m:"Do písomky ide počet riešení a to, že si vieš situáciu narysovať ako pomôcku — rysovacie potreby na EČ smieš mať."},

/* ---------- B · STEREOMETRIA (chýba) ---------- */
{id:"b29",t:"b", area:"stereometria", n:"Voľné rovnobežné premietanie, pôdorys, nárys, bokorys"},
{id:"b30",t:"b", area:"stereometria", n:"Súradnicová sústava v priestore, vzdialenosť bodov", pre:["b19"]},
{id:"b31",t:"b", area:"stereometria", n:"Vzájomná poloha priamok a rovín, mimobežky", pre:["b29"]},
{id:"b32",t:"b", area:"stereometria", n:"Rezy kocky a kvádra rovinou", pre:["b31"]},
{id:"b33",t:"b", area:"stereometria", n:"Uhly v priestore: dvoch priamok, priamky a roviny, dvoch rovín", pre:["b31","b16"]},
{id:"b34",t:"b", area:"stereometria", n:"Vzdialenosti v priestore", pre:["b31"]},
{id:"b35",t:"b", area:"stereometria", n:"Siete telies", pre:["a36"]},

/* ---------- B · KPŠ (chýba) ---------- */
{id:"b36",t:"b", area:"kps", n:"Variácie a permutácie s opakovaním", pre:["a40"]},
{id:"b37",t:"b", area:"kps", n:"Pascalov trojuholník a vlastnosti kombinačných čísel", pre:["a39"]},
{id:"b38",t:"b", area:"kps", n:"Doplnková pravdepodobnosť, nezávislé javy, súčet a súčin pravdepodobností", pre:["a41"]},
{id:"b39",t:"b", area:"kps", n:"Geometrická pravdepodobnosť", pre:["a41"]},
{id:"b40",t:"b", area:"kps", n:"Modus, medián, stredná hodnota, aritmetický priemer", pre:["a42"]},
{id:"b41",t:"b", area:"kps", n:"Rozptyl a smerodajná odchýlka", pre:["b40"]},
{id:"b42",t:"b", area:"kps", n:"Triedenie, výberový a základný súbor, bernoulliovské pokusy", pre:["a42"]},

/* ---------- C · DANISH DELTA ---------- */
{id:"c1", t:"c", area:"dkDif", n:"Limits and continuity", dk:"Grænseværdi og kontinuitet", m:"No counterpart anywhere in the Slovak requirements."},
{id:"c2", t:"c", area:"dkDif", n:"The derivative, and rate of change", dk:"Differentialkvotient og væksthastighed", pre:["c1"]},
{id:"c3", t:"c", area:"dkDif", n:"Differentiation rules: f + g, k · f, f · g, and the chain rule f ∘ g", dk:"Regneregler og kædereglen", pre:["c2"]},
{id:"c4", t:"c", area:"dkDif", n:"Derivatives of xⁿ, √x, 1/x, eˣ, ln x, sin, cos, aˣ", dk:"Afledede funktioner", pre:["c2"]},
{id:"c5", t:"c", area:"dkDif", n:"Tangents and the tangent line equation", dk:"Tangent og tangentligning", pre:["c4"]},
{id:"c6", t:"c", area:"dkDif", n:"Increasing and decreasing intervals, extrema, optimisation", dk:"Monotoniforhold, ekstrema og optimering", pre:["c4"]},
{id:"c7", t:"c", area:"dkDif", n:"Newton's method for finding roots numerically", dk:"Newtons metode", pre:["c5"]},

{id:"c8", t:"c", area:"dkInt", n:"Antiderivatives, indefinite and definite integrals", dk:"Stamfunktion, ubestemt og bestemt integral", pre:["c4"]},
{id:"c9", t:"c", area:"dkInt", n:"How area under a curve connects to the antiderivative", dk:"Sammenhængen mellem areal og stamfunktion", pre:["c8"]},
{id:"c10",t:"c", area:"dkInt", n:"Integration rules and integration by substitution", dk:"Regneregler og integration ved substitution", pre:["c8"]},
{id:"c11",t:"c", area:"dkInt", n:"Area between two graphs", dk:"Areal mellem to grafer", pre:["c9"]},
{id:"c12",t:"c", area:"dkInt", n:"Volume of solids of revolution", dk:"Volumen af omdrejningslegemer", pre:["c9"]},

{id:"c13",t:"c", area:"dkLig", n:"First-order differential equations and qualitative analysis", dk:"Differentialligninger af 1. orden", pre:["c8"]},
{id:"c14",t:"c", area:"dkLig", n:"The set forms y′ = k · y, y′ = b − a · y, and logistic y′ = a · y · (M − y)", dk:"De faste typer", pre:["c13"]},
{id:"c15",t:"c", area:"dkLig", n:"Separation of variables", dk:"Separation af variable", pre:["c10"]},
{id:"c16",t:"c", area:"dkLig", n:"Euler's method", dk:"Eulers metode", pre:["c13"]},
{id:"c17",t:"c", area:"dkLig", n:"Slope fields — reading and interpreting them", dk:"Hældningsfelter", pre:["c13"]},
{id:"c18",t:"c", area:"dkLig", n:"Building a differential equation model from a worded description", dk:"Opstille differentialligningsmodeller", pre:["c14"]},

{id:"c19",t:"c", area:"dkVek", n:"The perpendicular vector, determinant, area of a parallelogram", dk:"Tværvektor, determinant, areal af parallelogram", pre:["b20"]},
{id:"c20",t:"c", area:"dkVek", n:"Projection of one vector onto another", dk:"Projektion af vektor på vektor", pre:["b20"]},
{id:"c21",t:"c", area:"dkVek", n:"Parametric form of a line and a circle in the plane", dk:"Parameterfremstilling i planen", pre:["b21"]},
{id:"c22",t:"c", area:"dkVek", n:"Vectors in 3D and the cross product", dk:"Vektorer i rummet og krydsprodukt", pre:["b20"]},
{id:"c23",t:"c", area:"dkVek", n:"Equation and parametric form of a plane", dk:"Planens ligning og parameterfremstilling", pre:["c22"]},
{id:"c24",t:"c", area:"dkVek", n:"Lines in 3D and the equation of a sphere", dk:"Linje i rummet og kuglens ligning", pre:["c22"]},
{id:"c25",t:"c", area:"dkVek", n:"Intersections, angles and distances in 3D", dk:"Skæring, vinkler og afstande i rummet", pre:["c23"]},

{id:"c26",t:"c", area:"dkSta", n:"Random variables, expected value and standard deviation", dk:"Stokastisk variabel, middelværdi og spredning", pre:["b41"]},
{id:"c27",t:"c", area:"dkSta", n:"The binomial distribution", dk:"Binomialfordelingen", pre:["c26"]},
{id:"c28",t:"c", area:"dkSta", n:"The normal distribution", dk:"Normalfordelingen", pre:["c27"]},
{id:"c29",t:"c", area:"dkSta", n:"Grouped data: cumulative frequency curve, box plot, quartiles, percentiles", dk:"Grupperede data", pre:["b40"], m:"Not examined in writing, but it is taught and can come up orally."},
{id:"c30",t:"c", area:"dkSta", n:"Hypothesis testing on a binomial, significance level, p-value", dk:"Hypotesetest i binomialfordelingen", pre:["c27"], m:"Also kept out of the written paper — oral only."},

{id:"c31",t:"c", area:"dkFun", n:"b · aˣ and b · e^(k·x), doubling and halving constants", dk:"Fordoblings- og halveringskonstant", pre:["a24"]},
{id:"c32",t:"c", area:"dkFun", n:"Power functions and percent-to-percent growth", dk:"Potensfunktioner og procent-procentvækst", pre:["a23"]},
{id:"c33",t:"c", area:"dkFun", n:"f(x) = A · sin(ω·x + φ) + d — amplitude and period", dk:"Trigonometriske modeller", pre:["b9"]},
{id:"c34",t:"c", area:"dkFun", n:"Semi-log and log-log coordinate systems", dk:"Enkelt- og dobbeltlogaritmisk koordinatsystem", pre:["b13"]},
{id:"c35",t:"c", area:"dkFun", n:"Regression: linear, exponential, power, quadratic, trigonometric", dk:"Regression"},
{id:"c36",t:"c", area:"dkFun", n:"Judging a model: absolute and relative deviation, systematic variation", dk:"Modelkritik", pre:["c35"]},

{id:"c37",t:"c", area:"dkVrk", n:"CAS software — TI-Nspire, Maple or GeoGebra", dk:"CAS-værktøj", m:"Banned on the Slovak maturita, required in Denmark."},
{id:"c38",t:"c", area:"dkVrk", n:"Spreadsheets, and importing data from Excel", dk:"Regneark og dataimport", pre:["c37"]},
{id:"c39",t:"c", area:"dkVrk", n:"The official Matematik A formula booklet", dk:"Formelsamlingen"},
{id:"c40",t:"c", area:"dkVrk", n:"Exam wording and notation — decimal comma, \"find by calculation\" vs \"read off\"", dk:"„bestem ved beregning“ vs. „aflæs“"},
{id:"c41",t:"c", area:"dkVrk", n:"Part 1 of the written paper: 3 hours, no tools, everything by hand", dk:"Delprøve 1 uden hjælpemidler", pre:["c39"]},
{id:"c42",t:"c", area:"dkVrk", n:"Proofs prepared for the oral exam", dk:"Beviser til den mundtlige prøve", pre:["a9"]}
];

const BY_ID = Object.fromEntries(T.map(x=>[x.id,x]));
const EC_ITEMS = T.filter(x => x.t !== "c");

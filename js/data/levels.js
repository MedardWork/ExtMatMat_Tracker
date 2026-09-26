/* ============================================================
   AREAS — the five official test blocks and their item counts
   ============================================================ */
const AREAS = {
  zaklady:     {name:"Základy matematiky", w:7},
  funkcie:     {name:"Funkcie",            w:8},
  planimetria: {name:"Planimetria",        w:6},
  stereometria:{name:"Stereometria",       w:5},
  kps:         {name:"Kombinatorika, pravdepodobnosť, štatistika", w:4}
};
const DK_AREAS = {
  dkDif:  {name:"Differential calculus"},
  dkInt:  {name:"Integral calculus"},
  dkLig:  {name:"Differential equations"},
  dkVek:  {name:"Vectors — extended, and in 3D"},
  dkSta:  {name:"Probability and statistics"},
  dkFun:  {name:"Functions and modelling"},
  dkVrk:  {name:"Tools and exam format"}
};
const TAB_LABEL = {a:"Prebraté", b:"Čaká nás", c:"Matematik A"};
const areaName = x => (AREAS[x.area] || DK_AREAS[x.area]).name.split(",")[0];

/* ============================================================
   LEVELS
   ============================================================ */
const LV = [
  {k:0, label:"nepozreté", w:0,   desc:"ešte som to neotvoril"},
  {k:1, label:"neviem",    w:0,   desc:"pozrel som sa, sám to nevyriešim"},
  {k:2, label:"slabo",     w:1/3, desc:"s pomocou alebo pozeraním do vzorcov"},
  {k:3, label:"ide to",    w:2/3, desc:"vyriešim sám, občas sa pomýlim"},
  {k:4, label:"perfektne", w:1,   desc:"rýchlo a bez chyby"}
];
const LV_COLOR = ["var(--l0)","var(--l1)","var(--l2)","var(--l3)","var(--l4)"];

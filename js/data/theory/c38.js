/* Spreadsheets and importing data (Danish Matematik A) */
(() => {

THEORY.c38 = {
  mins:15,
  brief:[
    R`A spreadsheet computes the same formula for many rows: tables of values, Euler's method, sums, growth over years.`,
    R`Relative references (A2) shift when a formula is copied down; absolute references (\$B\$1) stay fixed, e.g. for a parameter.`,
    R`Data for regression often come as a table: copy or import them into CAS lists, check the decimal separator and the units.`,
    R`State in the answer where the numbers came from and show the first rows of a long table.`
  ],
  subs:{

"Spreadsheets":[
  R`A spreadsheet (Excel, the spreadsheet in GeoGebra or TI-Nspire) is a grid of cells. A formula refers to other cells and is copied down a column, so one line of thinking produces a whole table. That is ideal for step-by-step processes such as savings, populations or Euler's method ([[c16]]).`,
  {cards:[
    {t:"Relative reference", d:"=A2+1 in A3, copied down, becomes =A3+1, =A4+1 …"},
    {t:"Absolute reference", d:"=B2*\\$E\\$1 keeps E1 (e.g. the growth factor) when copied."},
    {t:"Sum", d:"=SUM(B2:B11) adds a column (Danish Excel: SUM as well)."},
    {t:"Fill down", d:"Write the formula once, then drag or double-click the corner of the cell."}
  ]},
  {ex:R`Set up Euler's method for $y' = x - y$, $y(0) = 1$, $h = 0{,}5$ in a spreadsheet.`,
   steps:[
     ["Row 2: start values.", R`A2 = 0,\quad B2 = 1`],
     ["Row 3: next x and next y.", R`A3 = A2 + 0{,}5,\quad B3 = B2 + 0{,}5 \cdot (A2 - B2)`],
     ["Copy row 3 down.", R`(0{,}5;\ 0{,}5),\ (1;\ 0{,}5),\ (1{,}5;\ 0{,}75),\ (2;\ 1{,}125)`]
   ],
   res:"The same numbers as by hand in c16, now for any number of steps."},
  {ex:R`A deposit of 10 000 kr grows by 2,5 % per year. Build a table for 10 years with the rate in cell E1.`,
   steps:[
     ["E1 = 0,025; A2 = 0 (year), B2 = 10000.", R`A3 = A2 + 1`],
     ["Absolute reference to the rate.", R`B3 = B2 \cdot (1 + \$E\$1)`],
     ["After copying to row 12.", R`10\,000 \cdot 1{,}025^{10} \approx 12\,801`]
   ],
   res:"About 12 801 kr after 10 years; change E1 and the whole table updates."},
  {warn:R`If a copied formula gives nonsense, check the references: a parameter must be absolute (\$E\$1), otherwise it slides down to empty cells and counts as 0.`}
],

"Importing data into CAS":[
  R`Exam data are often given as a table in the task file (Word, PDF or Excel). Copy them into CAS lists or a spreadsheet page instead of typing, but check them afterwards: a wrong separator or a missing row changes the regression.`,
  {steps:[
    {t:"Copy", d:"Select the table, paste into the CAS spreadsheet / lists (x in one column, y in the other)."},
    {t:"Clean", d:"Decimal comma → point if CAS needs it; remove units and headers from the number cells; check the count of rows."},
    {t:"Transform", d:"If needed, shift x (e.g. years since 2000 instead of the year) so that the parameters are sensible."},
    {t:"Plot first", d:"A scatter plot shows typos (one point far off) before you fit."}
  ]},
  {ex:R`A table gives the population for the years 2000, 2005, …, 2020. Why use $x$ = years since 2000?`,
   steps:[
     ["With x = year, the exponential model has b = f(0), the value in year 0.", R`b \cdot a^{2000} \text{ (huge or tiny numbers)}`],
     ["With x = years since 2000, b is the population in 2000.", R`b = f(0) \text{ has a meaning}`]
   ],
   res:"Shifted x makes the parameters readable and avoids rounding trouble."},
  {warn:R`After pasting, compare one or two values with the task: Danish files use decimal commas, and some programs silently read 2,5 as text or as 25.`}
]

  }
};
})();

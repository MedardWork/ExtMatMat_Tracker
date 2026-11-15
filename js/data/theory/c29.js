/* Grouped data, cumulative curve, quartiles, box plots (Danish Matematik A) */
(() => {
const L = v => ({v, lock:true});
const B = st => st.h && st.h.box;

THEORY.c29 = {
  mins:25,
  brief:[
    R`Grouped data: intervals with frequencies. The **cumulative frequency** at the right end of an interval is the share (in %) of all values up to there.`,
    R`The cumulative curve joins these points with straight lines; quartiles and percentiles are read off at 25 %, 50 %, 75 % or any $p$ %.`,
    R`Raw data: the median splits the sorted list into two halves; $Q_1$ and $Q_3$ are the medians of the halves.`,
    R`Box plot: min, $Q_1$, median, $Q_3$, max. The box holds the middle 50 %; its length is the interquartile range $Q_3 - Q_1$.`
  ],
  subs:{

"Grouped data and the cumulative curve":[
  R`When data are given only as counts in intervals (e.g. heights 150–160 cm: 3 people), we no longer know the exact values. We assume they are spread evenly inside each interval. Adding up the relative frequencies from the left gives the **cumulative frequency**, and joining the points at the interval ends gives the **cumulative curve**.`,
  {def:"Cumulative frequency", tex:R`F(x_i) = \frac{n_1 + n_2 + \dots + n_i}{n} \cdot 100\,\% \qquad \text{percentile } p:\ \text{the } x \text{ where the curve reaches } p\,\%`,
   note:"xᵢ is the right end of the i-th interval. The curve starts at 0 % and ends at 100 %."},
  {tool:"boxplot", ask:R`Heights of 30 people in five intervals. Move the percentile $p$ and read the height where the curve reaches $p$ %.`,
   take:R`the curve rises steeply where many values lie (170–180 cm) and flatly where few do.`,
   cfg:{typ:"skupiny", en:true}},
  {ex:R`Heights (cm): 150–160: 3, 160–170: 8, 170–180: 12, 180–190: 5, 190–200: 2. Find the cumulative frequencies and the median.`,
   steps:[
     ["Cumulative counts and %.", R`3,\ 11,\ 23,\ 28,\ 30 \ \to\ 10\,\%,\ 36{,}7\,\%,\ 76{,}7\,\%,\ 93{,}3\,\%,\ 100\,\%`],
     ["50 % lies in 170–180 (from 36,7 % to 76,7 %). Interpolate.", R`170 + \frac{50 - 36{,}7}{76{,}7 - 36{,}7} \cdot 10 \approx 173{,}3`]
   ],
   res:"The median height is about 173 cm."},
  {tool:"boxplot", kind:"uloha", ask:R`Read the 90th percentile: set $p$ so that the tool reads off the height below which 90 % of the people are.`,
   hint:"p = 90.",
   take:R`about 188 cm: 90 % are shorter, 10 % taller.`,
   goal:P => P.p === 90,
   cfg:{typ:"skupiny", en:true, p:{v:50}}},
  {warn:R`Plot the cumulative frequency at the **right** end of each interval: by 160 cm, all of the 150–160 group is counted, not by 150 cm.`}
],

"Box plot, quartiles, percentiles":[
  R`The quartiles cut the data into four equally large parts. Together with the smallest and largest value they form the **five-number summary**, drawn as a **box plot**. It shows the centre, the spread and the symmetry at a glance, and two box plots side by side compare two data sets.`,
  {def:"Quartiles and box plot", tex:R`\min \quad Q_1 \quad \text{median} \quad Q_3 \quad \max \qquad \text{IQR} = Q_3 - Q_1`,
   note:"Odd number of values: the median is left out of both halves when finding Q₁ and Q₃."},
  {tool:"boxplot", ask:R`Raw data as dots with their box plot. Drag a dot and watch the box.`,
   take:R`moving the largest value far right stretches the whisker but leaves the box (the middle half) unchanged: quartiles are robust.`,
   cfg:{typ:"data", en:true}},
  {ex:R`Find the five-number summary of 3, 5, 6, 6, 8, 9, 11, 12, 12, 15, 19.`,
   steps:[
     ["11 values: the 6th is the median.", R`\text{median} = 9`],
     ["Lower half 3, 5, 6, 6, 8.", R`Q_1 = 6`],
     ["Upper half 11, 12, 12, 15, 19.", R`Q_3 = 12`],
     ["Ends and IQR.", R`\min = 3,\ \max = 19,\quad \text{IQR} = 6`]
   ],
   res:"3; 6; 9; 12; 19 (IQR 6)."},
  {tool:"boxplot", ask:R`Two classes, A and B, with the same number of pupils. Compare their box plots.`,
   take:R`the medians are 17 and 18 and the boxes almost equal ($14{,}5$–$20{,}5$), but B has a much longer range (9 to 27).`,
   cfg:{typ:"data", en:true, data:[12, 14, 15, 15, 17, 18, 20, 21, 24], data2:[9, 13, 16, 17, 18, 19, 19, 22, 27], mena:["A", "B"], min:8, max:28}},
  {tool:"boxplot", kind:"uloha", ask:R`Drag the dots so that the median becomes 10 (keep 11 values).`,
   hint:"The 6th value in order must be 10: move the dot at 9 to 10, for example.",
   goal:(P, st) => !!B(st) && B(st).med === 10,
   cfg:{typ:"data", en:true}},
  {warn:R`Sort the data before finding quartiles. And a box plot hides the number of values: two boxes can look alike for 10 and for 1000 values.`}
]

  }
};
})();

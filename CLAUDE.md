# Working on this repository

A tracker for preparing for the Slovak external maths maturita (plus Danish Matematik A). Plain
`<script>` tags sharing one global scope, no build step, must keep working from `file://`, from
`server/main.js` (Docker, desktop app) and on GitHub Pages. README.md has the full layout.

## The person

- Write to them in **Slovak**. Code comments, commits and docs stay in English.
- Usage limits matter to them. Keep context small: don't re-read files you already know, look at
  screenshots only when a check can't answer the question, keep command output short.
- Commit and push to the working branch after every finished topic or batch (the container is
  ephemeral and sessions get cut off). After every finished batch or bigger change, also merge to
  `main` without asking (the person, 2026-11-14: they check the result on GitHub Pages).

## Starting a session

- "Pokračuj ďalšou dávkou teórie" means: take the next batch from *Next, in this order* below, do it, check
  it, update this file, commit, push. No questions needed.
- **A batch** is one stretch between two arrows in that list (usually 2–4 topics, plus the new tool they
  need). Finish and push one batch before starting the next.
- `main` holds everything listed under *Done* (last merged 2026-11-15). Start from `main`. If this file or a
  theory file listed under *Done* is missing on the session's branch, the branch is behind: fast-forward
  it to `origin/main` first.
- Before finishing: move the topics from *Next* to *Done* here, add anything new that bit, commit, push
  the working branch, then merge to `main` (a fast-forward: `git push origin HEAD:main`; if `main` moved,
  rebase on `origin/main` first).

### Which model does what

Agreed with the person on 2026-11-13, to save usage. `get_session` (no arguments) tells a session which
model it runs on; it cannot switch itself, the person picks the model when starting the session.

- **Every tool is written** (Fable, 2026-11-15). What is left is theory, and that is **Opus's** job: the table
  *Which tool for which topic* below says what to use where. Adding a small option to an existing tool is fine.
- **Strongest model (Fable):** only if a topic turns out to need a genuinely new tool. Then note the topic and
  the tool under *Next*, go on with the next topic, and tell the person.
- **The aim is the best learning experience** (the person, 2026-11-15; this replaces the old rule "no tool, no
  theory"). Use a tool wherever it helps to see or try something. Where a tool makes no sense (c37–c42 and
  single subtopics elsewhere), write the theory without one: text, formula boxes, steps, cards, worked examples.
- If the session runs on a model other than the one the work is meant for, say so in one line at the start
  and wait for the person's answer before spending usage.
- With any model, the page check does not catch wrong maths. Recompute every number of every worked
  example with `node -e` before committing, and read the Slovak once more as a reader would.

**Trial verdict (2026-11-13):** the person checked b12–b15, the first batch written by Opus, and was happy with it.
The split stays: theory by Opus, new tools by Fable.

## Ongoing job: theory + tools for all 126 topics

Decided with the person, don't reopen:

- **Full theory**, a topic can be learned from it from zero. Slovak for `a…`/`b…` topics,
  **English for the Danish `c…` topics**.
- Short pieces of text (2–3 sentences), **each followed by a visual**: an interactive tool, a formula
  box, cards, steps or a worked example. Many tools per subtopic, not one.
- A tool inside theory has **only the values that matter for that point unlocked** (`lock:true` on the rest).
  Each has a prompt (`ask`) and a one-sentence conclusion (`take`). Some are small tasks (`kind:"uloha"` + `goal`).
- Every formula worth remembering gets its own `def` box. Quantities keep one colour everywhere
  (`\va{}` `\vb{}` `\vc{}` `\vd{}` in formulas = `color:"a"…"d"` on params).
- Per subtopic roughly: explanation → formula box → tool(s) → worked example of the maturita kind →
  typical mistake (`warn`). Recompute every number in worked examples.
- Tools also live on their own under Nástroje, where everything is unlocked and values can be typed.

### Done

Theory, 114 of 126 topics: a1–a17, b1–b7 (Základy), a18 a19 a20 a21 a22 a23 a24 a25 a26 b8 b9 b10 b11 b12 b13 b14 b15 (Funkcie), a27–a35, b16–b28 (Planimetria), a36 a37 b29–b35 (Stereometria), a38–a42 b36–b42 (KPŠ), c1–c30 (Danish, English).
Tools (each file starts with its options and its `presets`; `topics` in each says where it belongs):

| Tool | For | What it does |
|---|---|---|
| `graf` | functions, b1–b3, b4, a14–a17 | graphs with parameters (JSXGraph); presets incl. sin, cos, tg, log |
| `trojuholnik` | a28 | triangle with its lines and circles |
| `statistika` | b40 b41 | dots on a line: mean, median, mode; `on:{var:true}` = deviations, variance, standard deviation (h.stat.var, .sd) |
| `postupnost` | a25 a26 | terms as bars/dots, sums |
| `kruznica` | b8–b11 | unit circle, sin/cos/tg segments, graph unrolling, `eq` = sin x = c |
| `os` | a6 a12–a14 a16 b4 b5 | number line: interval, two sets (∩ ∪ − ′), \|x − s\| < r, sign chart |
| `percenta` | a1 | percent of a base, change by %, ratio parts, direct/inverse proportion |
| `urok` | a2 | deposit, regular saving, loan plan (table with bars) |
| `sustavy` | a4 | bases 2–16, place values, division ladder, Roman numerals |
| `rozklad` | a5 | prime factorisation, gcd/lcm table, Euclid |
| `mnoziny` | a6 a41 | Venn 2/3 sets: shade an expression, click regions (`hladaj` = task), counts |
| `vyroky` | a7–a9 | truth table, several statements compared (equivalence, tautology) |
| `plochy` | a10 a15 | (a±b)², a²−b², (a+b)(c+d), completing the square as areas |
| `pytagoras` | a29 a30 b16 | squares on sides, Euclid's theorems, kind of triangle from sides |
| `kruh` | a31 a34 b18 | arc/sector/segment, chord, tangents, central and inscribed angle, Thales |
| `podobnost` | a32 b27 | triangle and its k-copy, shadow problem |
| `zobrazenia` | b26 b27 | reflections, translation, rotation, homothety on a grid |
| `uhly` | a27 | vertical/adjacent/corresponding/alternate angles |
| `utvary` | a33 a35 | perimeter and area of plane figures, kite (`deltoid`), regular polygons |
| `analyticka` | b19–b25 | points, vectors (`nasobok` k·u), line forms, two lines (distance when parallel), circle + line, area (JSXGraph); `en:true` (added 2026-11-15 for c19–c21) |
| `kocka` | b29–b34 | cube/cuboid: section through 3 points, distance (`stred`), angle; `vrchol` = corner–plane distance, `stena` = angle with a face |
| `telesa` | a36 a37 b35 | volume, surface, nets of solids; `siete` = the 11 cube nets (+ a T shape) folded, opposite faces coloured |
| `premietanie` | b29 | building of unit cubes (click the top view) or one solid in oblique projection (ω, q) with front/top/side views; `ciel` = views to match |
| `poloha` | b31 (b33 b34) | two lines / line and plane / two planes through corners of a cube: position, angle, distance; `hrany` colours the 12 edges by position to p |
| `strom` | a38 a40 b36 | tree of choices: product rule (`volby`), choosing k of n with switches order / repetition (variations, permutations, combinations), letters of a word |
| `pascal` | a39 b37 | Pascal's triangle (click a number; sum rule, symmetry, row sum), n over k with cancelling, factorial table, binomial theorem (p·x + q)^n |
| `pravdepodobnost` | a41 b38 b39 | two dice as a 6×6 grid with named events (or marked by the reader), one die, repeated experiment (law of large numbers), independent events as a unit square, “at least one”, geometric probability (segment, circle in square, target, meeting problem) |
| `histogram` | a42 b42 | frequency table → bar chart + pie chart (drag the bars), raw data sorted into classes → histogram, frequency polygon |
| `derivacia` | c1 c2 c4–c7 (c3) | JSXGraph: secant → tangent (`secna`), tangent line + graph of f′ (`dotycnica`), rising/falling + stationary points (`priebeh`), Newton's method, limit at a point / at infinity (`limita`, `inf`) |
| `integral` | c8–c12 | JSXGraph: rectangle sums (`sucty`, `druh`), signed area + antiderivative `F` + area function (`plocha`), area between graphs (`medzi`), solid of revolution (`rotacia`); `simpson()` is global |
| `smerpole` | c13–c18 | JSXGraph: slope field of y′ = F(x, y) with parameters, solution through the draggable point A, Euler's steps with a table |
| `rozdelenie` | b42 c26–c28 c30 | binomial bars with P(a ≤ X ≤ b), normal curve with area and 68–95–99.7 bands, random variable from a table, binomial test (critical region, p-value) |
| `boxplot` | c29 | cumulative curve of grouped data with quartiles/percentile read off, box plot; raw data as draggable dots with a box plot, two sets compared |
| `regresia` | c31–c36 | draggable data + fitted model (lin, exp, pot, kvad, sin), r², residuals and residual plot, prediction, semi-log / log-log axes; `regFit()` is global |
| `vektory3d` | c22–c25 | turnable 3D view: cross and dot product, plane (point + normal, or two directions), line (+ plane: intersection, angle; + point: distance), sphere |
| `konstrukcia` | b28 | ruler-and-compass constructions in 4 steps (`krok`): os, osuhla, kolmica, rovnobezka, dotycnica, sss, sus, usu, ssu, cvt, cvg; counts solutions |

The tools from `premietanie` on were written by Fable on 2026-11-15, all in one go on the person's request
("dokonči všetky nástroje"), each checked by `dev/check.js` and by eye (every preset). No theory uses them yet
except b28 (`konstrukcia`). The tools for the Danish topics take **`en:true`** in `cfg`: every text the tool
prints itself is then English (the frame around a tool, "Vyskúšaj" / "Čo si videl" / "Odomknúť všetko", is the
app's own and stays Slovak). Checked by mounting every preset with `en:true` and looking for Slovak letters in what the tool printed.

The tools from `kruznica` on were written by Fable on 2026-11-13 and checked by `dev/check.js` and by eye
(every preset), and theory uses `kruznica` (b8–b11) and every tool of Základy it reached so far (see the theory files). Opus writes the theory; if a tool lacks a small option, add it.

Size to aim for, from the last batch: 3–4 subtopics per topic, 3–4 tools per subtopic (one of them a
task), 2–4 worked examples per subtopic, about 150 lines per theory file.

### Visuals skipped for lack of a tool (flagged, add later)

Checked 2026-11-14 for every topic written that day (b8–b11, a1–a17, b1–b7, a27–a37, b16–b28, b30,
b32–b35). Agreed: a topic that does not need a tool of its own is fine without one (number sets,
"which theorem when", algebra of a circle equation…). Flagged are only the places where a picture was
left out because the tool or an option was missing. Each such file has a `/* TOOL-TODO: … */` line
(`grep -l TOOL-TODO js/data/theory/*.js`); add the visual and remove the line when the tool exists.

| Topic | Skipped visual | Needed |
|---|---|---|
| (none) | | |

The small options for b20, b23, b30, b33, b34, a35 and b35 were added on 2026-11-14 and the visuals put in.

Nice to have, nothing skipped: `graf` axis ticks in multiples of π (b9 uses degrees instead).

### Next, in this order

All for **Opus**, 2–4 topics per batch, each arrow is one batch:

c31 c32 c33 → c34 c35 c36 → c37 c38 c39 → c40 c41 c42

### Which tool for which topic

The 12 topics still without theory. Options are listed at the top of each tool's file; its presets on the
Nástroje page show what it can draw. Tools of earlier topics may be used as well wherever they fit.
For the Danish topics (`c…`) write in English and give **every** tool `en:true`.

| Topic | Tools: typ and the options that matter |
|---|---|
| c31 | `graf` (`"b*a^x"`, `"b*exp(k*x)"`); `regresia` `model:"exp"` prints the doubling / halving time |
| c32 | `graf` (`"b*x^a"`); `regresia` `model:"pot"` |
| c33 | `graf` (`"A*sin(w*x + f) + d"` with sliders); `regresia` `model:"sin"` |
| c34 | `regresia` with `os:"semilog"` and `os:"loglog"`, the same data on plain axes beside it |
| c35 | `regresia`, one data set under several `model`s |
| c36 | `regresia` with `on:{rezidua:true, graf2:true}` (a model that fits against one that bends away) |
| c37–c42 | no tool (CAS, spreadsheets, formula booklet, exam wording, part 1 by hand, oral proofs): text, `def` boxes, steps, cards and worked examples; a `graf` or `derivacia` picture only where a by-hand example gains from it |

## How to add theory for a topic

1. Copy the shape of an existing file: `js/data/theory/a22.js` (graph tool), `a28.js` (triangle),
   `b40.js` (statistics), `a25.js` (sequences). Block types are listed at the top of `js/theory.js`; the graph tool's options at
   the top of `js/tools/graf.js`; the engine at the top of `js/tools/core.js`.
2. Keys of `subs` must equal the subtopic names in `js/data/subtopics.js` character for character.
3. Add the id to `THEORY_LIST` in `js/data/theory/index.js`.
4. `node dev/check.js <id>` must print `ok` at both widths (a tool's name checks its Nástroje page). `SHOTS=<dir>` saves a picture of each tool
   when something needs a look.

Things that bite:

- Write strings containing backslashes as ``R`…` `` (String.raw). `${…}` still interpolates inside.
- In expressions letters are separate variables (`kx` = k·x). Multi-letter names work only for functions
  and for names of the tool's own params/points (`k1`, `Ax`). Powers: `x^2`; division binds like `*`.
- `fns` entries: `ghost:true` for helper curves, `lhs:"y"` to set the left side, `dom:[a, b]` to cut.
  With `free:true` (axes scaled apart) give `tick:[x, y]` and an `aspect`.
- `if:` and coordinates accept a number, an expression string or `P => …`.
- In `out`, use `h.tn(n)` inside formulas (decimal comma) and `h.n(n)` in plain text; `h.eq(i)` prints
  function i with current values, coloured.
- `shortName()` cuts topic names at the first comma/colon/dash; that is existing app behaviour.
- `.gitignore` ignores `/data/` at the root only. `js/data/` is tracked.
- A plain-SVG tool (`statistika`, `postupnost`) is the quicker kind to write: `svg(P, st)` returns the
  whole picture on every change, `bind(el, st)` adds clicks once. Hand theory its computed values through
  `h` in `out` (`h.stat`, `h.seq`) so a theory file's own `out` can print them.
- Inside `${…}` in an `R`…`` string, a nested plain template is not raw: write `\\vb{…}` there, or `\v` becomes a
  vertical tab and KaTeX fails. `dev/check.js` prints the failing formula.
- `if:` on a `show` item: use a number, a param name or `P => …`; a comparison string like `"abs(a-1) > 0.01"`
  silently hides the item.
- `findRoots(f, lo, hi)` from `core.js` is global; a theory `out` can use it to count roots.
- Labels of `inputs` are plain text: `$…$` inside them renders spaced out.
- A hint or caption that ends with a formula followed by a full stop wraps the stop onto its own line;
  put the formula mid-sentence.
- In theory give a tool a fixed vertical range (`y:` / `view:`); with a fitted range the picture rescales
  and moving a slider seems to change nothing.
- To look at many tool pictures at once, tile the `SHOTS` files into one image and read that.
- Writing a plain-SVG tool: use the kit in `core.js` (comment block "PLAIN-SVG KIT"): `toolParams` (cfg
  numbers/objects over default sliders, `free`/`lock`/`hide`/`on`/`toggles`), `SV.*` and `SG.*` writers with
  colour classes (`s ca`, `bg cb`, `t mid` …, CSS in theory.css "plain-SVG kit"), `svFit` for a plane in the
  picture, `svgDrag` / `svgPoint` for dragging and clicks, `toolTextIn` / `toolTextOut` for notes. A tool
  that shows a table returns `<div class="tw-tab">…` from `svg()`. `"c_a"` in `SV.text` writes a subscript.
- `node dev/check.js <tool>` clicks through every preset of the tool. `node dev/tile.js <dir> [prefix]`
  tiles `SHOTS` pictures into `<dir>/_all.png`. A full `node dev/check.js` takes over 2 minutes.
- A new tool needs its `<script>` tag in `maturita-matematika-tracker.html` and its styles in
  `css/theory.css`; `dev/check.js` picks it up from `js/tools/` by itself.
- `rm` with a shell variable in the path is refused by the safety check; write screenshots to a fresh folder.
- Trig graphs in degrees with `graf`: `f:"sin(b*x*pi/180)"`, `view:[-30, 1.7, 390, -1.7], tick:[90, 1], free:true,
  aspect:"2.2"` (see `b9.js`). Don't name the axis `"x (°)"`, the label covers the 360.
- `kruznica` in theory: `uhol:{v, min, max, step, lock:true}` fixes the angle for `eq` tools; `h.kr` is filled before a
  theory `out` runs (sin, cos, tg, rad, sols). `b11.js` has an `out` for sin/cos inequalities.
- `R"…"` (raw tag on a plain string) is a syntax error and the whole theory file renders nothing; always ``R`…` ``.
- `percenta` with `typ:"zmena"`: the second change `q` is an unlocked slider even when `druha` is off; add `hide:["q"]`.
- `graf` `meet` (and `roots`) between functions with a vertical asymptote can give NaN at 400px ("ellipse cy NaN"); draw the known intersections as `pt` instead. `pt` takes `open:true` for a hole.
- `mnoziny` `hladaj` prints the wanted set; add `skry:true` when the task text must not give it away.
- A half-plane in `graf`: `show:[{poly:[[-6, "k*(-6)+q"], [7, "k*7+q"], [7, 9], [-6, 9]], color:"c"}]` (see `b7.js`); poly corners take expressions.
- Labels and `text` in `graf` show "—" for `round(…)`; write the number in `out` instead.
- `kocka`: a task goal can read the section through `(P, st) => st.h.cube.n` (goal runs after `out`). With `kvader:true` lock a, b, c unless they matter.
- A formula box (`def`) is split at top-level `\qquad` into relations that wrap as wholes and shrink to fit (`defParts`, `fitDefs` in js/theory.js). Separate independent relations with `\qquad` (no comma), use one-column `aligned` blocks, put long words into `note`. `node dev/defwrap.js [ids]` lists boxes still too wide at 1280/900/400 px.
- Layout (2026-11-14): theory column fills the page (`.th-cols` 220px + 1fr), the topic page is 1320px from
  1400px screens, paragraphs stay at 68ch. A board is capped to `(100vh - 170px) * --ar` so it fits on screen;
  `--ar` comes from the tool's `aspect` (core.js `toolStart`).
- Long shell heredocs containing backticks or `${}` trip the command safety check. Put patch scripts
  in a file (Write tool) and run the file.
- In a patch script, `s.replace(a, b)` with a string `b` treats ``$` `` and `$'` as "text before / after the match" and
  pastes half the file in. Always pass a function: `s.replace(a, () => b)`.
- `h.p(…)` goes through the markdown writer and escapes HTML: for a `<span class=…>` in `out` return a plain `<div>…</div>`
  (and `h.m(…)` for the part with `$maths$`).
- `cfg.free` belongs to `toolParams` (the list of unlocked sliders). The new board tools (`derivacia`, `integral`, `smerpole`)
  therefore take **`apart:true`** for axes scaled separately; only `graf` uses `free:true` for that.
- `fact(n)` and `binom(n, k)` are global (core.js), so are `V3.*` (vectors in space), `solidEdges`, `simpson`, `binomPmf`,
  `normCdf`, `fiveNum`, `regFit`: a theory `out` can use them to recompute a worked example.
- `node dev/entext.js c1 c2` lists Slovak words that tools print on English pages (the frame's "Nápoveď" is ignored).
  `graf` has no `en`, but it prints only formulas and the notes you give its params, so it is fine in `c…` topics.
- `derivacia` takes `out` (it replaces the tool's own text): c3 uses it to print the slope next to the rule's value.
- `smerpole`: the drawn solution of `y′ = −x/y` (and anything that reaches y = 0) goes wild; use `on:{riesenie:false}` there and
  draw the curve with `graf`. `A` snaps to 0,5, so a goal can test `st.h.sp.x0`, `.y0` exactly.
- `vektory3d`: a line that points straight at the viewer shows as a dot; change `otoc` / `sklon` rather than the line.
- `git push origin HEAD:main` can be refused by the session's own permission check until the person says "merge to
  main" in that session. Then push the branch, say that `main` still waits, and merge once they answer.
- **Desktop app release:** bump `version` in `package.json` and both `version` fields at the top of `package-lock.json`,
  merge to `main`, then push the tag `v<version>` (or *Actions → Desktop app → Run workflow* on `main`). The workflow
  builds the three installers and publishes them under Releases. Do it whenever the person asks for a new download.
- **macOS build:** without an Apple certificate electron-builder signs nothing, and macOS then refuses the app
  ("is damaged"). `package.json` therefore has `mac.identity: "-"` (ad-hoc) with `hardenedRuntime: false`; keep both.
  The workflow checks the signature and starts every packaged build with `MATURITA_SMOKE=1` (desktop/main.js: page
  rendered + database answers, exit code 0/1). Locally: `npx electron-builder --linux dir`, then
  `MATURITA_SMOKE=1 xvfb-run -a dist/linux-unpacked/maturita-tracker --no-sandbox`. `dev/check.js` uses `file://`,
  so it does not cover the app shell.

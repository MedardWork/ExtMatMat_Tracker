# Working on this repository

A tracker for preparing for the Slovak external maths maturita (plus Danish Matematik A). Plain
`<script>` tags sharing one global scope, no build step, must keep working from `file://`, from
`server/main.js` (Docker, desktop app) and on GitHub Pages. README.md has the full layout.

## The person

- Write to them in **Slovak**. Code comments, commits and docs stay in English.
- Usage limits matter to them. Keep context small: don't re-read files you already know, look at
  screenshots only when a check can't answer the question, keep command output short.
- Commit and push to the working branch after every finished topic or batch (the container is
  ephemeral and sessions get cut off). Merge to `main` only when they say so.

## Starting a session

- "Pokračuj ďalšou dávkou teórie" means: take the next batch from *Next, in this order* below, do it, check
  it, update this file, commit, push. No questions needed.
- **A batch** is one stretch between two arrows in that list (usually 2–4 topics, plus the new tool they
  need). Finish and push one batch before starting the next.
- `main` holds everything listed under *Done* (last merged 2026-11-13, with the tools). Start from `main`. If this file or a
  theory file listed under *Done* is missing on the session's branch, the branch is behind: fast-forward
  it to `origin/main` first.
- Before finishing: move the topics from *Next* to *Done* here, add anything new that bit, commit, push
  the working branch. Merge to `main` only when asked (a fast-forward: `git push origin HEAD:main`).

### Which model does what

Agreed with the person on 2026-11-13, to save usage. `get_session` (no arguments) tells a session which
model it runs on; it cannot switch itself, the person picks the model when starting the session.

- **Strongest model (Fable):** a batch that needs a **new tool**. It writes the tool and the first topic
  that uses it, as the pattern for the rest.
- **Opus:** theory for topics whose tools already exist. Adding a small option to an existing tool is
  fine; writing a new tool is not — if a topic turns out to need one, skip that visual, note the topic
  and the tool under *Next*, and carry on with the rest of the batch.
- Each batch under *Next* is marked with the model it is meant for. If the session runs on the other
  one, say so in one line at the start and wait for the person's answer before spending usage.
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

Theory, 65 of 126 topics: a1–a17, b1–b7 (Základy), a18 a19 a20 a21 a22 a23 a24 a25 a26 b8 b9 b10 b11 b12 b13 b14 b15 (Funkcie), a27–a35, b16–b28 (Planimetria), a36 (Stereometria), b40 (KPŠ).
Tools (each file starts with its options and its `presets`; `topics` in each says where it belongs):

| Tool | For | What it does |
|---|---|---|
| `graf` | functions, b1–b3, b4, a14–a17 | graphs with parameters (JSXGraph) |
| `trojuholnik` | a28 | triangle with its lines and circles |
| `statistika` | b40 | dots on a line: mean, median, mode |
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
| `utvary` | a33 a35 | perimeter and area of plane figures, regular polygons |
| `analyticka` | b19–b25 | points, vectors, line forms, two lines, circle + line, area (JSXGraph) |
| `kocka` | b29–b34 | cube/cuboid: section through 3 points, distance, angle |
| `telesa` | a36 a37 b35 | volume, surface, nets of solids |

The tools from `kruznica` on were written by Fable on 2026-11-13 and checked by `dev/check.js` and by eye
(every preset), and theory uses `kruznica` (b8–b11) and every tool of Základy it reached so far (see the theory files). Opus writes the theory; if a tool lacks a small option, add it.

Size to aim for, from the last batch: 3–4 subtopics per topic, 3–4 tools per subtopic (one of them a
task), 2–4 worked examples per subtopic, about 150 lines per theory file.

### Next, in this order

1. **Opus**, theory with existing tools, 2–4 topics per batch, in this order:
   Stereometria a37, b29–b35 (tools `telesa`, `kocka`).
2. **Fable**, tools still missing, then Opus for their topics:
   KPŠ (a38–a42, b36–b42): tree of choices / counting, Pascal's triangle, probability simulator,
   histogram and pie chart, variance. Danish part (c1–c42): tangent/secant (derivative), area under a
   curve, slope field + Euler, distributions (binomial, normal), box plot, regression, 3D vectors.

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
- Long shell heredocs containing backticks or `${}` trip the command safety check. Put patch scripts
  in a file (Write tool) and run the file.

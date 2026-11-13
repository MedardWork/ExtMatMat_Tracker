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

Theory: a18 a19 a20 a21 a22 a23 a24 a25 a26 (Funkcie), a28 (Planimetria), b40 (KPŠ).
Tools: `graf`, `trojuholnik`, `statistika`, `postupnost` (bars/dots per term; options at the top of its file).

### Next, in this order

1. Funkcie: b8, b9, b10, b11 (new tool `kruznica`: unit circle, angle in degrees and radians, sin/cos/tg
   as segments, the sine graph unrolling beside it) → b12, b13, b14, b15 (the `graf` tool is enough).
2. Základy (a1–a17, b1–b7), then Planimetria, Stereometria, KPŠ, then the Danish part (c1–c42).
   Likely tools: number line (intervals, inequalities, absolute value), percent/ratio bar, interest and
   repayment table, number-base converter, prime factorisation, Venn diagram, truth table, area model for
   (a+b)², geometry scenes (Pythagoras, Thales, similarity, circle parts, transformations), analytic
   geometry (points, vectors, line, circle), 3D solids and cube sections, combinatorics, Pascal's triangle,
   probability simulator, tangent/secant, area under a curve, slope field, distributions, regression.

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
- A new tool needs its `<script>` tag in `maturita-matematika-tracker.html` and its styles in
  `css/theory.css`; `dev/check.js` picks it up from `js/tools/` by itself.
- `rm` with a shell variable in the path is refused by the safety check; write screenshots to a fresh folder.
- Long shell heredocs containing backticks or `${}` trip the command safety check. Put patch scripts
  in a file (Write tool) and run the file.

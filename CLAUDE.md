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
- `main` holds everything listed under *Done* (merged 2026-11-13). Start from `main`. If this file or a
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

**Trial running:** b12–b15 is the first batch written by Opus. The person compares one of its topics with
a24 / a25. Write the verdict here once they give it (keep the split, or go back to one model).

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

Theory, 11 of 126 topics: a18 a19 a20 a21 a22 a23 a24 a25 a26 (Funkcie), a28 (Planimetria), b40 (KPŠ).
Tools: `graf`, `trojuholnik`, `statistika`, `postupnost` (bars/dots per term; options at the top of its file).

Size to aim for, from the last batch: 3–4 subtopics per topic, 3–4 tools per subtopic (one of them a
task), 2–4 worked examples per subtopic, about 150 lines per theory file.

### Next, in this order

1. Funkcie, **Opus**: b12, b13, b14, b15 (the `graf` tool is enough; none of them needs b8–b11. b13 builds
   on b1, which has no theory yet: recall the logarithm in two sentences and link `[[b1]]`).
2. Funkcie, **Fable**: b8 + the new tool `kruznica` (unit circle, angle in degrees and radians, sin/cos/tg
   as segments, the sine graph unrolling beside it) → **Opus**: b9, b10, b11 with that tool and `graf`.
3. Základy (a1–a17, b1–b7), then Planimetria, Stereometria, KPŠ, then the Danish part (c1–c42). Split
   each area the same way: first a Fable batch per new tool with one topic, then Opus batches for the rest.
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
- A plain-SVG tool (`statistika`, `postupnost`) is the quicker kind to write: `svg(P, st)` returns the
  whole picture on every change, `bind(el, st)` adds clicks once. Hand theory its computed values through
  `h` in `out` (`h.stat`, `h.seq`) so a theory file's own `out` can print them.
- Labels of `inputs` are plain text: `$…$` inside them renders spaced out.
- A hint or caption that ends with a formula followed by a full stop wraps the stop onto its own line;
  put the formula mid-sentence.
- In theory give a tool a fixed vertical range (`y:` / `view:`); with a fitted range the picture rescales
  and moving a slider seems to change nothing.
- To look at many tool pictures at once, tile the `SHOTS` files into one image and read that.
- A new tool needs its `<script>` tag in `maturita-matematika-tracker.html` and its styles in
  `css/theory.css`; `dev/check.js` picks it up from `js/tools/` by itself.
- `rm` with a shell variable in the path is refused by the safety check; write screenshots to a fresh folder.
- Long shell heredocs containing backticks or `${}` trip the command safety check. Put patch scripts
  in a file (Write tool) and run the file.

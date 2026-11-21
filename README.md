# Maturita z matematiky — tracker

Three ways to run it:

| | How | Where your progress is saved |
|---|---|---|
| **Desktop app** (recommended) | Install it once, then open it like any other app | Its own database on your computer, saved automatically |
| **Docker** | `docker compose up -d`, then open <http://localhost:8080> | The same database, in `./data` next to `docker-compose.yml` |
| **Plain file** | Open `maturita-matematika-tracker.html` in a browser | The browser's `localStorage` — back it up by hand from *Info* |

## Desktop app

Download the installer for your system (step by step below), then install it:

- **Windows** — `Maturita-…-Windows.exe`. Installs for your user only and adds a desktop and Start menu
  shortcut. The installer isn't signed, so Windows may show "Windows protected your PC": click
  *More info → Run anyway*.
- **macOS** — `Maturita-…-macOS.dmg` (Apple Silicon only, M1 and later), drag the app to Applications. It is signed ad hoc, not by Apple: the first
  time, open it, then go to *System Settings → Privacy & Security* and click *Open Anyway*. If macOS
  says the app "is damaged", run `xattr -cr "/Applications/Maturita z matematiky.app"` in Terminal.
- **Linux** — `Maturita-…-Linux.AppImage`: make it executable (`chmod +x`) and run it.

Every change is saved by itself a moment after you make it — there's nothing to copy or paste, and
closing the window waits for the last save. Opening the app a second time just brings the running
window forward.

**First start:** the database starts empty. To bring over progress from the browser version, use
*Stiahnuť ako súbor* there, then *Načítať zo súboru* in the app (the overview offers it on first
start). Pasting the copied text works too.

**Where the data is:** *Súbor → Otvoriť priečinok s dátami* in the menu. It's
`data/maturita.db` inside the app's folder (`%APPDATA%\Maturita z matematiky` on Windows,
`~/Library/Application Support/Maturita z matematiky` on macOS, `~/.config/Maturita z matematiky` on
Linux). Updating or uninstalling the app leaves it alone. *Súbor → Uložiť kópiu databázy…* saves a
copy anywhere you like, e.g. to a USB stick or cloud folder.

**Updates (from 1.5.3):** the app checks the newest release at start and every 6 hours. When only the
page changed (theory, tools, calendar), it downloads those files (about 1.6 MB), asks, and reloads; no
reinstalling, on macOS too. When the app itself changed, it says so once and opens the download page.
*Pomocník → Skontrolovať aktualizácie* checks at once; *Pomocník → Vrátiť nainštalovanú verziu* goes back
to the files that came with the installer. The downloaded files sit next to the data (`web/`, one version
only). They come over HTTPS from this repository's releases and must match the size and SHA-256 listed
in the release's `web.json`. They are only the page, which runs sandboxed like a web page (no access to
other files, no programs); the study plan always stays the installed one.

### Nothing gets lost

- **History** (*Info → História*): while you work, the database keeps the earlier version every 10
  minutes, and always before an import, a restore or *Vymazať všetko*. Everything from the last two
  days stays; older versions thin out to one per day. Any of them can be restored or downloaded —
  restoring keeps the current state in the history too.
- **Daily backups:** once a day the whole database file is copied to `data/backups/`
  (`maturita-YYYY-MM-DD.db`, the last 30 days are kept). To go back to one, close the app and copy it
  over `data/maturita.db`.

### Downloading the installer — step by step

GitHub builds the installers itself (`.github/workflows/desktop.yml`). There are two places to get them.

**A. From a release** — the easy way, no sign-in needed:

1. Open the [Releases](https://github.com/MedardWork/ExtMatMat_Tracker/releases) page (on the
   repository's main page, *Releases* in the right-hand column).
2. Click the newest release, scroll down to **Assets**.
3. Click the file for your system: `…-Windows.exe`, `…-macOS.dmg` or `…-Linux.AppImage`.

If there's no release yet, make one (the workflow file has to be on `main` first):

1. On the repository page, click *Releases → Draft a new release* (or *Create a new release*).
2. *Choose a tag* → type a new version, e.g. `v1.0.0` → *Create new tag*. Target: `main`.
3. Give it a title (e.g. the same `v1.0.0`) and click **Publish release**.
4. Creating the tag starts the build. After about 3–5 minutes the three installers appear under
   **Assets** of that release (refresh the page). Progress is visible on the *Actions* tab.

For a later version, bump `version` in `package.json` and repeat with the next tag (`v1.0.1`, …).

**B. From a build on the Actions tab** — every push that changes the app builds it too. You have to be
signed in to GitHub, and builds are deleted after 90 days:

1. Open the repository's **Actions** tab (top bar, between *Pull requests* and *Projects*).
2. On the left, click **Desktop app**.
3. Click the newest run with a green ✓ (its title is the commit message).
4. Scroll to the very bottom of the run page, to the box **Artifacts**.
5. Click **Maturita-Windows**, **Maturita-macOS** or **Maturita-Linux** — a `.zip` downloads.
6. Unzip it (Windows: right-click → *Extract All*; macOS: double-click). Inside is the installer.

*Actions → Desktop app → Run workflow* (button on the right) builds the installers and publishes them
as a release `v<version>` from `package.json` — so bump the version first if that release already exists.

### Building it yourself

```
npm install
npm run desktop     # run the app from the source
npm run dist        # build the installer for this system into dist/
```

Pushing a tag such as `v1.0.1` (or creating a release with a new tag, as above) builds Windows, macOS
and Linux installers on GitHub Actions and attaches them to the release.

## Docker

```
docker compose up -d
```

Then open <http://localhost:8080> (bookmark it). The container starts again by itself whenever Docker
does, and everything is saved in `./data` — the same database, history and daily backups as the desktop
app. `docker compose up -d --build` after pulling changes updates it.

The port is only reachable from this computer. To reach it from other devices, change the port line in
`docker-compose.yml` to `"8080:8080"` — but anyone on your network can then read and change your
progress. Without Docker, `npm start` runs the same server (Node 22.13 or newer; set `DATA_DIR` to
choose the folder).

## What's in it

- **Prehľad** — countdown, score estimate by test block, and from your study plan: today's blocks, what comes
  next, pace (ahead or behind), milestones and the plan's rules; plus the last day you studied and your topic
  tests (the latest results, topics to go over again, finished topics without a test).
- **Témy** — the topic list with tabs, search (also inside notes), filters with counts (one of them: *Slabý test*),
  the latest test score of each topic and quick level buttons. Click a topic name to open it.
- **Topic page** (`#/tema/a5`) — the whole topic on one page: its subtopics, each with its own
  level (the topic's level and understanding % are computed from them; you can add your own
  subtopics), its tests (see *Tests on a topic* below), named notes (sorted by creation date, each with its own "rozumiem" level and optionally
  tied to a subtopic, filterable by both), description, prerequisites / what builds on it, and the
  diary notes that mention it, with a box that writes today's diary note for the topic (saved as you type).
- **Teória** (`#/tema/a21/teoria`) — the topic explained in short pieces, each followed by an
  interactive example with only the relevant values unlocked. See *Theory and tools* below.
- **Nástroje** — the same interactive tools on their own, fully unlocked: function graphs, sequences, a triangle
  with its lines and circles, mean / median / mode.
- **Kalendár** — your study plan as a month view and a week view split into the day's time blocks, each maths
  block with its topic (see *Study plan* below); switch to **Poznámky** for the study diary: a note for each day
  and for each topic taken that day (topics appear by themselves when rated, noted or tested), saved as you type.
  Both views show the topic tests written on each day with their score; *+ test* starts one for a topic and day.
  Replaced the old Denník tab; old `#/dennik` links land here.
- **Info** — data sources, backup (copy / download / paste / load a file), the study plan (make or change it
  with an AI), history of earlier versions (desktop app and Docker), keyboard shortcuts.

Press `/` (or Ctrl+K) anywhere to jump to a topic or note. On a topic page: `←` `→` previous /
next topic, `↑` `↓` pick a subtopic, `0`–`4` set its level, `N` new note, `T` new test, `Esc` back to the list.

### How levels add up

Each subtopic is rated on the five-level scale. The topic's level is the rounded average of its
subtopics (between *neviem* and *ide to*), *perfektne* only when every subtopic is, and *nepozreté*
while none is rated. The score estimate counts each subtopic by weight (*perfektne* 1, *ide to* ⅔,
*slabo* ⅓). The level buttons in the topic list set all subtopics at once (with undo). Note levels
are for your orientation only and don't feed the estimate.

Topics you know won't be on the test can be marked ⊘ (row button or topic page). They move to the
**Nerelevantné** tab and drop out of the estimate, "Čo ďalej" and the pace counter — each block's item
count is then spread over the topics still in play. Levels and notes stay; ↩ Vrátiť brings them back.

### Tests on a topic

A short test at the end of a topic goes under **Testy** on the topic page (`+ Nový test` or `T`): the day you wrote
it, an optional name and its tasks, each marked ✓ *správne*, ½ *čiastočne* or ✗ *zle*. The score counts itself: every
task is one point (½ is half a point), so `+ ✓ správne` pressed eight times and `+ ✗ zle` twice make 8/10 (with the
button focused, Enter adds the next one). A task can also carry a note, written in the same editor as the topic's notes
(`+ s poznámkou`, or ✎ on a task); tasks don't show among the topic's own notes, but the quick search finds them.

- The colour of a result follows the levels: from 90 % *perfektne*, from 70 % *ide to*, from 40 % *slabo*, below that *neviem*.
- A topic whose latest test is below 70 % is listed under *Na zopakovanie* on the overview and under the *Slabý test*
  filter. When the latest test disagrees with the topic's own level, the topic page says so.
- The calendar shows every test on the day it was written, with its score, in the plan and in the diary.
- A scored test counts as the plan's review of that topic (*opak:*) in the week it was written. Tests don't feed the
  score estimate or the pace.
- Tests are part of the saved progress, the backup and the text for an AI (Info → Plán v kalendári).

## Study plan

The calendar shows a study plan up to the exam: which topic you take in which block of which day. The app
starts without one; you make it with an AI chat (Claude, ChatGPT, …) and never have to write it by hand.

**Making a plan**

1. Open **Info → Plán v kalendári** and click **Vytvoriť plán s AI**. The app copies a text to the clipboard:
   what the plan looks like, how the app reads it, your topics with your current levels, and a small example plan.
2. Paste it into a chat with an AI. It asks you what it needs: when your exam is and when you want to start,
   what a normal week looks like (school, training, other subjects) and how much time each day has for maths,
   holidays and days off, whether you want to write past tests on time before the exam.
3. The AI answers with the whole plan as a ```json block. Click **Vložiť plán** and paste its **whole answer**:
   the app finds the plan in it, checks it and shows what it contains. **Použiť tento plán** puts it into the calendar.
4. If the app finds a mistake, it lists it (with the place in the plan); **Skopírovať chyby pre AI** copies the
   list so the AI can fix it.

**Changing it later** — when you are ahead or behind, click **Skopírovať pre AI** (the same card): the text now
holds your plan and your progress (pace, which topics are done, test scores). Tell the AI what to change and paste
its answer back the same way. Before anything changes you see what moves, what is added or removed and whether a
week overflows. The last 10 plans can be restored and the plan can be deleted.

**How the app reads a plan** — a plan is a list of weeks, each with its topics in order and the number of
sessions each needs (1 session = 2 blocks of 45 minutes), plus day templates (school day, weekend, test day …)
with their time blocks. The app fills each week's maths blocks with its topics in order; what does not fit goes
into the reserve blocks of the reserve days, and anything left is shown as a warning. A topic counts as done at
level *ide to* or better and as started at *neviem* / *slabo*, so there is nothing to tick off by hand; a review counts
once you write a note about its topic or a scored test on it that week; a test counts once its score is typed into its
day in the calendar.

The plan is part of your saved progress: *Skopírovať / Stiahnuť postup* include it, and *Stiahnuť plán* saves the
plan alone as a `.json` file. The format (`maturita-plan-1`) is described in `js/planmodel.js`.

## Writing notes

Notes and diary entries use a small Markdown dialect with formulas (rendered by KaTeX):

```
## Nadpis            **tučné**  *kurzíva*  ==zvýraznené==
- zoznam             - [ ] úloha na odškrtnutie
> [!pozor] …         boxes: pozor, vzorec, otázka, tip
$x^2 - 5x + 6 = 0$   formula in text        $$ \frac{-b \pm \sqrt{D}}{2a} $$  formula on its own line
| x | y |            tables
[[a15]]              link to another topic
x <= 3, a != 0       become ≤ and ≠
```

The editor toolbar inserts all of these, including a panel of math symbols, and shows a live preview.

An interactive tool can sit in a note too. *Nástroje → Skopírovať do poznámky* gives you the block for
whatever is on screen; by hand it looks like this:

```
:::nastroj graf            :::nastroj trojuholnik        :::nastroj statistika
f: a*x^2 + c               A: 1 1                        data: 2 3 3 4 5 6 8
a: 1 [-3, 3]               B: 9 1                        os: 0 10
c: -4                      C: 4 7                        ukaz: priemer, median
ukaz: nulove body          ukaz: taznice, vysky          :::
:::                        :::

:::nastroj postupnost
typ: geometricka           (or aritmeticka with d, or vzorec: n^2 - 2n)
a1: 3
q: 2
n: 4
clenov: 6
ukaz: hodnoty, kroky, sucet
:::
```

## Theory and tools

Every topic page has two faces: **Podtémy a poznámky** (your own work) and **Teória**. Theory is split
into short pieces of text, each followed by an interactive tool that shows what was just said. Inside
theory a tool is pre-filled for that one point and only the values that matter there can be changed —
*Odomknúť všetko* frees the rest, *Otvoriť v Nástrojoch* opens it on its own page with the same values.
Each subtopic ends with its level buttons, so you can rate it right after reading.

**Nástroje** in the top bar lists the same tools for free experimenting. Every value can be dragged or
typed: the number beside a slider is a field (it takes `2,5`, `-1/3`, `sqrt(2)`; on a tool's own page
the slider's range grows to fit), draggable points have coordinate fields, and the statistics tool
has a field for the whole data set.

Theory is written topic by topic; the Teória tab says *pripravuje sa* where it isn't there yet.

### Writing theory for a topic

1. Create `js/data/theory/<id>.js` that sets `THEORY.<id> = {mins, brief:[…], subs:{…}}`. The keys of
   `subs` are the subtopic names from `js/data/subtopics.js`; each value is a list of blocks.
2. Add the id to `THEORY_LIST` in `js/data/theory/index.js`.

A block is a string of Markdown or an object — a formula box (`def`), a tool (`tool`), cards, steps,
a worked example (`ex`), a words-to-symbols table (`map`), a warning or a tip. The full list with
examples is at the top of `js/theory.js`. Write formulas with ``R`…` `` so backslashes survive, and
colour a quantity with `\va{…}` `\vb{…}` `\vc{…}` `\vd{…}` — the same four colours the tools use, so
*k* looks the same in the sentence, the formula, the slider and the graph.

```js
{tool:"graf", ask:R`Meň $\va{k}$ a sleduj schodík.`, take:"znamienko $k$ rozhoduje, či funkcia rastie.",
 cfg:{fns:["k*x+q"], view:[-4, 5, 4, -3],
      params:{k:{v:2, min:-3, max:3, step:.5, color:"a"}, q:{v:1, lock:true, color:"b"}},
      show:[{step:0, color:"a"}, {pt:[0, "q"], color:"b"}]}}
```

`lock:true` is what keeps a value fixed in that example. `kind:"uloha"` with a `goal` turns the tool
into a small task that marks itself done.

### Adding a tool

Create `js/tools/<id>.js` with `defTool("<id>", {name, area, desc, presets, make(cfg, env)})` and add
its `<script>` tag. `make` returns what to draw and which values exist — see the header of
`js/tools/core.js` and the existing tools: `graf` (drawn on a JSXGraph board), `trojuholnik`
(draggable points), `statistika` and `postupnost` (plain SVG). The engine supplies sliders, locking, the three sizes
(in theory, on its own page, as a miniature), theme changes and clean-up.

## Layout

```
maturita-matematika-tracker.html   page shell: top bar, section nav, script order
css/base.css                       colour tokens (light + dark), buttons, chips, level control
css/layout.css                     top bar, bottom nav on phones, pages, toast
css/{overview,topics,topic,journal}.css   one stylesheet per page
css/markdown.css                   how rendered notes look
css/editor.css, css/palette.css    note editor, quick search
css/theory.css                     Teória tab, tool widgets, Nástroje pages
css/tests.css                      topic tests: the section on the topic page, scores in the list, calendar, overview
vendor/katex/                      KaTeX 0.16 (MIT) — formula rendering, bundled for offline use
vendor/jsxgraph/                   JSXGraph 1.13 (MIT) — graphs and geometry; loaded when first needed
js/data/levels.js                  test areas (with item counts), levels, tab labels
js/data/topics.js                  topic list T, plus BY_ID / EC_ITEMS lookups
js/data/subtopics.js               SUBS: the subtopics of every topic
js/data/descriptions.js            "O čom to je" text and a typical task per topic
js/data/theory/index.js            which topics have theory
js/data/theory/<id>.js             one topic's theory; loaded when its Teória tab opens
js/utils.js                        escaping, dates, Slovak plurals, plain-text snippets
js/markdown.js                     Markdown + math → HTML (escapes everything first)
js/state.js                        saved data (v4), migration, load/save, levels, notes + diary helpers, topic tests
js/core.js                         UI state, routing (#/…), data-act click handling, toast
js/theory.js                       theory blocks → HTML, loading theory files
js/tools/core.js                   tool engine: expressions, sliders and locking, mounting, drawing helpers
js/tools/<id>.js                   the tools themselves, one file each (the table in CLAUDE.md lists them)
js/components/editor.js            note editor: toolbar, symbols, live preview, list keys
js/components/palette.js           quick search / topic picker
js/components/{countdown,gauge,plancards}.js   pieces of the overview (plancards: today / next / pace / milestones from the plan)
js/components/testcards.js         topic tests outside the topic page: badges, calendar chips, the overview card
js/views/overview.js               #/
js/views/topics.js                 #/temy/a|c
js/views/topic.js                  #/tema/<id>
js/views/topictests.js             the Testy section of the topic page (#/tema/<id>/t/<testId> opens one test)
js/views/theory.js                 #/tema/<id>/teoria
js/views/tools.js                  #/nastroje, #/nastroje/<tool>
js/views/calendar.js               #/kalendar (plan + diary; data in js/data/plan.js)
js/planmodel.js                    the plan as data: compile, check, compare, copy for an AI (Info → Plán v kalendári)
js/data/plan.js                    the default plan (none in the public app: PLAN_DEFAULT = null)
js/views/info.js                   #/info
js/main.js                         theme, global keys, startup

dev/check.js                       opens theory and tool pages in a browser and reports errors
dev/app-check.js                   drives the app's own pages (overview, list, topic, calendar, Info) incl. topic tests
dev/desktop-check.js               starts the real desktop app and checks pages, saving, export, links, closing
CLAUDE.md                          notes for continuing the theory work with Claude Code

server/store.js                    the SQLite database: current save, history, daily backups
server/app.js                      serves the files above + the save API (web-standard Request → Response)
server/main.js                     runs it as a web server (npm start, Docker)
desktop/main.js                    the desktop app: Electron window serving the same handler over app://
build/icon.png                     app icon (a square root with rising bars; favicon.svg is the same picture)
Dockerfile, docker-compose.yml     the Docker setup
```

The scripts are plain `<script src>` tags, not ES modules, because modules don't load from
`file://`. They share one global scope, so load order in the HTML matters:
vendor → data → helpers → state → core → theory + tools → components → views → boot.
Two things load later with a `<script>` tag added on demand, which also works from `file://`:
JSXGraph (about 1 MB) and each topic's theory.

### Extending

- **New topic:** add it to `T` in `js/data/topics.js`, its subtopics to `SUBS` in
  `js/data/subtopics.js` and its description to `DESC` in `js/data/descriptions.js`.
- **Subtopics** are stored under a key made from their name, so adding or reordering them is safe;
  renaming one starts its level from zero.
- **New page:** create `js/views/<name>.js` that sets `VIEWS.<name> = {title, render(host)}`, add a
  route in `parseRoute()` in `js/core.js`, a link in the top bar, and its `<script>` tag.
- **New button:** give it `data-act="name"` and register `action("name", el => …)` — no
  `addEventListener` needed. Inputs work the same with `data-in` / `onInput`.

### Saved data

In the desktop app and Docker, the page finds the server's `api/state` and saves there: one SQLite file
(`maturita.db`) holding the current save as JSON, with a revision number. Each save names the revision
it builds on; if another tab or window saved in between, the server answers with its copy, the two are
merged (as below) and the save is retried. Coming back to a tab picks up what others saved meanwhile.
The same JSON is what *Skopírovať / Stiahnuť / Vložiť postup* move around.

Opened as a plain file, everything lives in `localStorage` under `maturita-mat-v2` (the data inside is version 4). Older saves
are upgraded automatically on first load — a topic's old level is copied to each of its subtopics, so
the estimate doesn't change — and the untouched original is kept under `maturita-mat-v<version>-backup`.

Several tabs can be open at once. Each level, note and diary entry remembers when it last changed
and deletions leave a tombstone; every save first merges what other tabs stored (newer version of
each item wins), and open tabs pick up each other's saves live (`mergeStates` in `js/state.js`).
Import and "Vymazať všetko" start a new epoch, which replaces other tabs' copies instead of merging.

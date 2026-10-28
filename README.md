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
- **macOS** — `Maturita-…-macOS.dmg`, drag the app to Applications. It isn't signed by Apple: the first
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

To start a build without pushing anything: *Actions → Desktop app → Run workflow* (button on the right).

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

- **Prehľad** — countdown, score estimate by test block, "Čo ďalej" suggestions, and
  "Pokračuj, kde si skončil" (last diary entry + recently opened topics).
- **Témy** — the topic list with tabs, search (also inside notes), filters with counts and
  quick level buttons. Click a topic name to open it.
- **Topic page** (`#/tema/a5`) — the whole topic on one page: its subtopics, each with its own
  level (the topic's level and understanding % are computed from them; you can add your own
  subtopics), named notes (sorted by creation date, each with its own "rozumiem" level and optionally
  tied to a subtopic, filterable by both), description, prerequisites / what builds on it, and the
  diary entries that mention it, with a quick "zapísať do denníka" box.
- **Denník** — study diary with an activity calendar, entries linked to topics or specific notes,
  suggestions from what you changed today, search, and editing.
- **Info** — data sources, backup (copy / download / paste / load a file), history of earlier versions
  (desktop app and Docker), keyboard shortcuts.

Press `/` (or Ctrl+K) anywhere to jump to a topic or note. On a topic page: `←` `→` previous /
next topic, `↑` `↓` pick a subtopic, `0`–`4` set its level, `N` new note, `Esc` back to the list.

### How levels add up

Each subtopic is rated on the five-level scale. The topic's level is the rounded average of its
subtopics (between *neviem* and *ide to*), *perfektne* only when every subtopic is, and *nepozreté*
while none is rated. The score estimate counts each subtopic by weight (*perfektne* 1, *ide to* ⅔,
*slabo* ⅓). The level buttons in the topic list set all subtopics at once (with undo). Note levels
are for your orientation only and don't feed the estimate.

Topics you know won't be on the test can be marked ⊘ (row button or topic page). They move to the
**Nerelevantné** tab and drop out of the estimate, "Čo ďalej" and the pace counter — each block's item
count is then spread over the topics still in play. Levels and notes stay; ↩ Vrátiť brings them back.

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

## Layout

```
maturita-matematika-tracker.html   page shell: top bar, section nav, script order
css/base.css                       colour tokens (light + dark), buttons, chips, level control
css/layout.css                     top bar, bottom nav on phones, pages, toast
css/{overview,topics,topic,journal}.css   one stylesheet per page
css/markdown.css                   how rendered notes look
css/editor.css, css/palette.css    note editor, quick search
vendor/katex/                      KaTeX 0.16 (MIT) — formula rendering, bundled for offline use
js/data/levels.js                  test areas (with item counts), levels, tab labels
js/data/topics.js                  topic list T, plus BY_ID / EC_ITEMS lookups
js/data/subtopics.js               SUBS: the subtopics of every topic
js/data/descriptions.js            "O čom to je" text and a typical task per topic
js/utils.js                        escaping, dates, Slovak plurals, plain-text snippets
js/markdown.js                     Markdown + math → HTML (escapes everything first)
js/state.js                        saved data (v4), migration, load/save, levels, notes + diary helpers
js/core.js                         UI state, routing (#/…), data-act click handling, toast
js/components/editor.js            note editor: toolbar, symbols, live preview, list keys
js/components/palette.js           quick search / topic picker
js/components/{countdown,gauge,next}.js   pieces of the overview
js/views/overview.js               #/
js/views/topics.js                 #/temy/a|c
js/views/topic.js                  #/tema/<id>
js/views/journal.js                #/dennik
js/views/info.js                   #/info
js/main.js                         theme, global keys, startup

server/store.js                    the SQLite database: current save, history, daily backups
server/app.js                      serves the files above + the save API (web-standard Request → Response)
server/main.js                     runs it as a web server (npm start, Docker)
desktop/main.js                    the desktop app: Electron window serving the same handler over app://
build/icon.png                     app icon
Dockerfile, docker-compose.yml     the Docker setup
```

The scripts are plain `<script src>` tags, not ES modules, because modules don't load from
`file://`. They share one global scope, so load order in the HTML matters:
vendor → data → helpers → state → core → components → views → boot.

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

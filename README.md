# Maturita z matematiky — tracker

Open `maturita-matematika-tracker.html` in a browser. No build step, no server, works offline.

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
- **Info** — data sources, backup (copy / download / paste), keyboard shortcuts.

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

Everything lives in `localStorage` under `maturita-mat-v2` (the data inside is version 4). Older saves
are upgraded automatically on first load — a topic's old level is copied to each of its subtopics, so
the estimate doesn't change — and the untouched original is kept under `maturita-mat-v<version>-backup`.

Several tabs can be open at once. Each level, note and diary entry remembers when it last changed
and deletions leave a tombstone; every save first merges what other tabs stored (newer version of
each item wins), and open tabs pick up each other's saves live (`mergeStates` in `js/state.js`).
Import and "Vymazať všetko" start a new epoch, which replaces other tabs' copies instead of merging.

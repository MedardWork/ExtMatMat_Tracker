# Maturita z matematiky — tracker

Open `maturita-matematika-tracker.html` in a browser. No build step, no server needed.

## Layout

```
maturita-matematika-tracker.html   page markup, loads everything below
css/styles.css                     all styles
js/data/levels.js                  test areas (with item counts) and the five mastery levels
js/data/topics.js                  topic list T, plus BY_ID / EC_ITEMS lookups
js/data/descriptions.js            "O čom to je" text and a typical task per topic
js/utils.js                        escaping, search normalisation, dates, Slovak plurals
js/state.js                        progress state, load/save (Claude storage or localStorage), accessors
js/views/countdown.js              countdown to the exam
js/views/gauge.js                  score estimate, blocks, level distribution
js/views/next.js                   "Čo ďalej" suggestions
js/views/log.js                    study diary
js/views/topics.js                 tabs, level key, filtered topic list
js/events.js                       click/input handlers, backup import/export
js/main.js                         renderAll() and startup
```

The scripts are plain `<script src>` tags, not ES modules, because modules don't load from
`file://`. They share one global scope, so load order in the HTML matters:
data → helpers → state → views → events → boot.

To add a topic: add it to `T` in `js/data/topics.js` and its description to `DESC` in
`js/data/descriptions.js`. To add a new panel: create a `js/views/*.js` file with a `render…()`
function, add its `<script>` tag before `events.js`, and call it from `renderAll()` in `js/main.js`.

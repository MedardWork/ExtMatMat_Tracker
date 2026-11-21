/* ============================================================
   ZÁPIS ZO SESSION — what an AI read out of an old study session, added to the progress (never replacing it).
   The person pastes the AI's answer into Info → Vložiť postup; importText (js/views/info.js) finds the block here,
   shows a preview (zapisPreview) and adds it on "Pridať do postupu" (zapisApply), with undo.
   Format "maturita-zapis-1" (ZAPIS_PROMPT asks the AI for it):
     { format, date: "YYYY-MM-DD" (the session's day),
       topics: [ { topic: id or the app's name of the topic, level: 1–4 or its name (whole topic), subtopics: [{name, level}],
                   tests: [{date, name, from_note, tasks: [{res: "ok"|"part"|"bad", note | title, text, subtopic}]}],
                   notes: [{note, level}] } ] }
   The person's tutor sessions wrote one note per task (also for a mini test), so a task usually names its note
   (id or title): that note moves under the test with its text (n.test, n.res); a task without one becomes a new note.
   Rules: a level is set only if the app has no rating of that subtopic from a later day; a test already in the app
   (same topic, day and name) is skipped; from_note = one note that held the whole test, removed once the test is in.
   Notes are found by id, then by title; topics and subtopics by id or name; names match without case and accents.
   ============================================================ */
const ZAPIS_FORMAT = "maturita-zapis-1";

/* every zápis block in an AI's answer (several answers pasted together are fine) */
function zapisFromText(txt){
  const t = String(txt || "").trim(), out = [], seen = new Set();
  const cands = [];
  const re = /```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
  let m;
  while((m = re.exec(t))) cands.push(m[1]);
  cands.push(t);
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if(a >= 0 && b > a) cands.push(t.slice(a, b + 1));
  for(const c of cands){
    let o;
    try{ o = JSON.parse(c.trim()); }catch(err){ continue; }
    for(const z of Array.isArray(o) ? o : [o]){
      if(!isObj(z) || z.format !== ZAPIS_FORMAT) continue;
      const key = JSON.stringify(z);
      if(!seen.has(key)){ seen.add(key); out.push(z); }
    }
  }
  return out;
}

/* "Kvadratické rovnice" → "kvadraticke rovnice" */
const zNorm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
/* exact (normalised) match first, then the only one that starts with it */
function zFind(list, name, key){
  const q = zNorm(name);
  if(!q) return null;
  const eq = list.filter(x => key(x).some(k => zNorm(k) === q));
  if(eq.length === 1) return eq[0];
  const pre = list.filter(x => key(x).some(k => zNorm(k).startsWith(q)));
  return pre.length === 1 ? pre[0] : null;
}
const zTopic = ref => BY_ID[String(ref || "").trim()] ? String(ref).trim()
  : (zFind(T, ref, x => [x.n, shortName(x)]) || {}).id || null;
const zIso = d => typeof d === "string" && /^\d{4}-\d\d-\d\d$/.test(d) && !isNaN(Date.parse(d)) ? d : null;
const ZLV = {neviem:1, slabo:2, "ide to":3, perfektne:4};
const zLevel = v => { const w = ZLV[zNorm(v)]; if(w) return w; const n = Math.round(+v); return n >= 1 && n <= 4 ? n : null; };
/* a topic's own note (not a task) by its id, else by its title */
function zNote(tid, ref){
  const r = String(ref || "").trim();
  if(!r) return null;
  const n = findNote(tid, r);
  if(n && !isTask(tid, n)) return n;
  return zFind(topicNotes(tid), r, y => [y.title]);
}
const ZRES = {ok:"ok", "✓":"ok", spravne:"ok", "1":"ok", part:"part", "½":"part", ciastocne:"part", "0.5":"part", "0,5":"part", bad:"bad", "✗":"bad", zle:"bad", "0":"bad"};
const zRes = r => ZRES[zNorm(r)] || ZRES[String(r).trim()] || "";

/* what the zápis would change, without changing anything: {ops, lines, skip} */
function zapisPreview(list){
  const ops = [], lines = [], skip = [];
  const lvTxt = v => LV[v].label;
  const used = new Set();      /* notes already taken by a task or a from_note */
  for(const z of list){
    const day = zIso(z.date);
    for(const tp of Array.isArray(z.topics) ? z.topics : []){
      if(!isObj(tp)) continue;
      const tid = zTopic(tp.topic);
      if(!tid){ skip.push(`Téma „${tp.topic}“ sa v appke nenašla, preskočím ju.`); continue; }
      const tname = shortName(BY_ID[tid]);
      /* levels: the whole topic, then single subtopics over it */
      const want = new Map(), top = zLevel(tp.level);
      if(top) for(const s of subsOf(tid)) want.set(s.k, top);
      for(const s of Array.isArray(tp.subtopics) ? tp.subtopics : []){
        const v = zLevel(s && s.level), x = s && zFind(subsOf(tid), s.name, y => [y.n]);
        if(!x){ skip.push(`${tname}: podtéma „${s && s.name}“ sa nenašla.`); continue; }
        if(v) want.set(x.k, v);
      }
      if(want.size){
        const lday = day || todayIso();
        const set = [], newer = [];
        for(const [k, v] of want){
          const at = state.slvAt[`${tid}/${k}`];
          if(at && isoOf(at) > lday) newer.push(k); else set.push([k, v]);
        }
        if(set.length){
          ops.push({kind:"lv", tid, day:lday, set});
          const subs = subsOf(tid);
          lines.push(set.length === subs.length && new Set(set.map(s => s[1])).size === 1
            ? `${tname}: úroveň <b>${lvTxt(set[0][1])}</b> (${fmtD(lday)})`
            : `${tname}: ${set.map(([k, v]) => `${esc(subName(tid, k))} <b>${lvTxt(v)}</b>`).join(", ")} (${fmtD(lday)})`);
        }
        if(newer.length) skip.push(`${tname}: ${newer.length === want.size ? "úroveň" : `${newer.length} ${plural(newer.length, "podtéma", "podtémy", "podtém")}`} v appke máš ohodnotenú neskôr, ostáva.`);
      }
      /* tests with their tasks */
      for(const x of Array.isArray(tp.tests) ? tp.tests : []){
        if(!isObj(x)) continue;
        const d = zIso(x.date) || day;
        if(!d){ skip.push(`${tname}: test bez dátumu, preskočím ho.`); continue; }
        const name = String(x.name || "").trim().slice(0, 80);
        const tasks = (Array.isArray(x.tasks) ? x.tasks : []).filter(isObj).map(k => {
          let src = k.note ? zNote(tid, k.note) : null;
          if(src && used.has(src.id)) src = null;
          if(src) used.add(src.id);
          else if(k.note) skip.push(`${tname}: poznámka „${esc(k.note)}“ sa nenašla, úloha sa zapíše nová.`);
          return {res: zRes(k.res), note: src ? src.id : null, title: String(k.title || (src ? "" : k.note) || "").trim(), body: String(k.text || k.body || "").trim(),
            sub: k.subtopic ? (zFind(subsOf(tid), k.subtopic, y => [y.n]) || {}).k || "" : ""};
        });
        if(!tasks.length){ skip.push(`${tname}: test ${fmtD(d)} nemá úlohy, preskočím ho.`); continue; }
        if(testsOf(tid).some(y => y.d === d && zNorm(y.n) === zNorm(name)) || ops.some(o => o.kind === "test" && o.tid === tid && o.d === d && zNorm(o.name) === zNorm(name))){
          skip.push(`${tname}: test ${fmtD(d)}${name ? ` „${esc(name)}“` : ""} už v appke je.`);
          continue;
        }
        let from = x.from_note ? zNote(tid, x.from_note) : null;
        if(from && used.has(from.id)) from = null;
        if(from) used.add(from.id);
        else if(x.from_note) skip.push(`${tname}: poznámka „${esc(x.from_note)}“ sa nenašla, nič sa nemaže.`);
        const pts = tasks.reduce((a, k) => a + (TASK_PTS[k.res] || 0), 0), open = tasks.filter(k => !k.res).length;
        const moved = tasks.filter(k => k.note).length;
        ops.push({kind:"test", tid, d, name, tasks, from: from ? from.id : null});
        lines.push(`${tname}: test ${fmtD(d)}${name ? ` „${esc(name)}“` : ""} · <b>${numTxt(pts)}/${tasks.length}</b>${open ? ` (${open} bez známky)` : ""}${moved ? ` · ${moved} ${plural(moved, "poznámka sa presunie", "poznámky sa presunú", "poznámok sa presunie")} k testu ako úlohy` : ""}${from ? ` · poznámka „${esc(noteTitle(from))}“ sa zmaže` : ""}`);
      }
      /* notes rated again */
      for(const r of Array.isArray(tp.notes) ? tp.notes : []){
        if(!isObj(r)) continue;
        const ref = r.note || r.id || r.title, v = zLevel(r.level), n = zNote(tid, ref);
        if(!n){ skip.push(`${tname}: poznámka „${esc(ref)}“ sa nenašla.`); continue; }
        if(used.has(n.id) || !v || n.lv === v) continue;
        ops.push({kind:"note", tid, n:n.id, v});
        lines.push(`${tname}: poznámka „${esc(noteTitle(n))}“ ${n.lv ? `${lvTxt(n.lv)} → ` : ""}<b>${lvTxt(v)}</b>`);
      }
    }
  }
  return {ops, lines, skip};
}

/* adds what zapisPreview found; returns counts for the toast */
function zapisApply(p){
  const now = Date.now();
  let tests = 0, removed = 0;
  for(const o of p.ops){
    if(o.kind === "lv"){
      const noon = Math.min(new Date(o.day + "T12:00:00").getTime(), now);
      for(const [k, v] of o.set){
        const key = `${o.tid}/${k}`, at = state.slvAt[key];
        state.slv[key] = v;
        state.slvAt[key] = at && isoOf(at) === o.day ? at : noon;   /* rated the same day: keep that time */
      }
      touch(o.tid);
    } else if(o.kind === "test"){
      const x = addTest(o.tid, o.d);
      x.n = o.name;
      o.tasks.forEach((k, i) => {
        if(k.note && findNote(o.tid, k.note)){ updateNote(o.tid, k.note, {test:x.id, res:k.res}); return; }   /* keeps its text and day */
        const n = addNote(o.tid, k.sub, x.id);
        Object.assign(n, {title:k.title, body:k.body, res:k.res, c:now + i, u:now});
      });
      if(o.from && findNote(o.tid, o.from)){ removeNote(o.tid, o.from); removed++; }
      tests++;
    } else if(o.kind === "note"){
      updateNote(o.tid, o.n, {lv:o.v});
    }
  }
  return {tests, removed};
}

/* the instructions for an old session's AI; withTopics adds the list of the app's topics with their ids.
   Written for tutor sessions that kept one note per task ("### Okruh / #### Téma / **Úloha:** … / Ako sa darilo")
   and sometimes returned the whole tracker file: this time only the zápis is wanted. */
function zapisPrompt(withTopics){
  return `Potrebujem preniesť túto session do novej verzie môjho trackera. Tracker má teraz testy z tém: test má deň, voliteľný názov a úlohy a každá úloha je ✓ správne, ½ čiastočne alebo ✗ zle (✓ 1 bod, ½ pol bodu, ✗ 0, body sa spočítajú samy). Tentoraz nevracaj celý súbor trackera, len zápis v tvare nižšie. Nič si nevymýšľaj, ber len to, čo v tejto session naozaj bolo.

1. Testy. Každý mini test z tejto session (časť A aj B spolu ako jeden test s názvom "Mini test") a každý iný test, ktorý som tu písal. Úlohy v poradí, ako boli v teste. Výsledok úlohy podľa toho, ako sa darilo:
   - "ok" (✓): správne na prvý pokus bez pomoci,
   - "part" (½): opravil som ju sám na ďalší pokus, po teórii alebo po podobnej úlohe,
   - "bad" (✗): až po „ukáž postup“, nevyriešil som ju alebo som hádal.
   Ak má úloha v trackeri poznámku (poznámky ku každej úlohe, ktoré si mi písal), daj do "note" jej id z JSON-u trackera, a ak ho nepoznáš, jej presný názov ("title"). Tracker tú poznámku presunie k testu aj s celým textom, takže "title" ani "text" k nej už nepíš. Úlohe bez poznámky daj "title" (krátko, napr. "B2: definičný obor") a "text" (zadanie, postup, výsledok, 💡).
   Ak je celý test zapísaný v jednej poznámke, daj jej id alebo presný názov do "from_note" testu; tracker ju po prenesení zmaže.
2. Úroveň každej témy zo session, ako som ju vedel na konci session: "neviem", "slabo", "ide to" alebo "perfektne" (perfektne až po 2 rôznych úlohách bez pomoci). Podtémy len ak poznáš ich presné názvy z trackera.
3. Ostatné poznámky z tejto session (tie, ktoré nie sú úlohou testu): id alebo presný názov a úroveň "neviem", "slabo", "ide to" alebo "perfektne" podľa toho, ako sa mi tá úloha darila.

"date" je deň tejto session (RRRR-MM-DD): vezmi ho z času poznámok ("c" v ms) alebo sa ma opýtaj. "topic" je id témy z trackera (a5, a12…), inak presný názov témy zo zoznamu tém.

Odpovedz krátkym zhrnutím a potom jedným blokom kódu presne v tomto tvare (platný JSON, bez komentárov; spätné lomky vo vzorcoch zdvoj, napr. "$\\\\frac{1}{2}$"):

\`\`\`json
{
  "format": "${ZAPIS_FORMAT}",
  "date": "2026-11-12",
  "topics": [
    {
      "topic": "a12",
      "level": "ide to",
      "tests": [
        {
          "date": "2026-11-12",
          "name": "Mini test",
          "tasks": [
            {"res": "ok", "note": "id poznámky k úlohe A1"},
            {"res": "part", "note": "id poznámky k úlohe A2"},
            {"res": "bad", "title": "B1: definičný obor", "text": "Zadanie, postup, výsledok, 💡"}
          ]
        }
      ],
      "notes": [{"note": "id alebo presný názov poznámky", "level": "slabo"}]
    }
  ]
}
\`\`\`

"res" je "ok", "part" alebo "bad". Čo nevieš, vynechaj (name, from_note, notes; "subtopics": [{"name": "…", "level": "…"}] pridaj len pri presných názvoch).${withTopics ? `

Témy v trackeri (id: názov):
${T.map(x => `${x.id}: ${x.n}`).join("\n")}` : ""}`;
}

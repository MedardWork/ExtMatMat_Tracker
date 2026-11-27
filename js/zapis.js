/* ============================================================
   ZÁPIS ZO SESSION — what an AI read out of an old study session, added to the progress (never replacing it).
   The person pastes the AI's answer into Nastavenia → Vložiť postup; importText (js/views/info.js) finds the block here,
   shows a preview (zapisPreview) and adds it on "Pridať do postupu" (zapisApply), with undo.
   Format "maturita-zapis-1" (ZAPIS_PROMPT asks the AI for it):
     { format, date: "YYYY-MM-DD" (the session's day),
       topics: [ { topic: id or the app's name of the topic, level: 1–4 or its name (whole topic), subtopics: [{name, level}],
                   tests: [{date, name, from_note, tasks: [{res: "ok"|"part"|"bad", note | title, text, subtopic}]}],
                   notes: [{note, title, level, text, subtopic, date}] } ] }
   The person's tutor sessions wrote one note per task (also for a mini test), so a task usually names its note
   (id or title): that note moves under the test with its text (n.test, n.res); a task without one becomes a new note.
   Rules: a level is set only if the app has no rating of that subtopic from a later day; a test already in the app
   (same topic, day and name) is skipped; from_note = one note that held the whole test, removed once the test is in.
   notes: an existing note (id, else title) is rated again; one with "text" that the app does not have becomes a new
   ordinary note (exact title match only, so pasting the zápis twice adds nothing twice); an id of a task of a test
   takes that task out of its test (an ordinary note again).
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
/* a topic's own note (not a task) by its id, else by its title; title = the note's title the AI gave beside the id,
   tried when the id is not in the app (an AI copying a 12-letter id gets it wrong or makes one up) */
function zNote(tid, ref, title){
  for(const r of [ref, title].map(v => String(v || "").trim()).filter(Boolean)){
    const n = findNote(tid, r);
    if(n && !isTask(tid, n)) return n;
    const f = zFind(topicNotes(tid), r, y => [y.title]);
    if(f) return f;
  }
  return null;
}
/* a task given only by its title is the topic's note of exactly that title, if there is one (an AI without the ids) */
function zSame(tid, title){
  const q = zNorm(title);
  const f = q ? topicNotes(tid).filter(y => zNorm(y.title) === q) : [];
  return f.length === 1 ? f[0] : null;
}
/* "mvs31wtcib58": looks like a note id, so it is no title for a new task */
const zIdLike = s => /^[a-z0-9]{8,16}$/.test(s) && /\d/.test(s) && /[a-z]/.test(s);
/* one line for all notes of a topic that were not found */
const zMiss = refs => refs.slice(0, 3).map(r => `„${esc(r)}“`).join(", ") + (refs.length > 3 ? ` a ${refs.length - 3} ${plural(refs.length - 3, "ďalšia", "ďalšie", "ďalších")}` : "");
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
        const lost = [];
        const tasks = (Array.isArray(x.tasks) ? x.tasks : []).filter(isObj).map(k => {
          const ref = String(k.note || "").trim();
          let src = ref ? zNote(tid, ref, k.title) : zSame(tid, k.title);
          if(src && used.has(src.id)) src = null;
          if(src) used.add(src.id);
          else if(ref) lost.push(ref);
          return {res: zRes(k.res), note: src ? src.id : null, title: String(k.title || (src || zIdLike(ref) ? "" : ref) || "").trim(), body: String(k.text || k.body || "").trim(),
            sub: k.subtopic ? (zFind(subsOf(tid), k.subtopic, y => [y.n]) || {}).k || "" : ""};
        });
        if(!tasks.length){ skip.push(`${tname}: test ${fmtD(d)} nemá úlohy, preskočím ho.`); continue; }
        if(lost.length) skip.push(`${tname}: ${lost.length} ${plural(lost.length, "poznámka k úlohe sa v appke nenašla", "poznámky k úlohám sa v appke nenašli", "poznámok k úlohám sa v appke nenašlo")} (${zMiss(lost)}), ${lost.length === 1 ? "úloha sa zapíše nová" : "úlohy sa zapíšu nové"}.`);
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
      /* notes: rated again, new ones added, tasks taken out of their tests */
      const miss = [], fresh = new Set();
      for(const r of Array.isArray(tp.notes) ? tp.notes : []){
        if(!isObj(r)) continue;
        const id = String(r.note || r.id || "").trim(), title = String(r.title || "").trim().slice(0, 200), body = String(r.text || r.body || "").trim();
        const ref = id || title, v = zLevel(r.level);
        const task = id ? findNote(tid, id) : null;
        if(task && isTask(tid, task)){
          if(used.has(task.id)) continue;
          used.add(task.id);
          ops.push({kind:"untask", tid, n:task.id, v});
          lines.push(`${tname}: úloha „${esc(noteTitle(task))}“ sa vyberie z testu medzi poznámky${v && task.lv !== v ? ` (<b>${lvTxt(v)}</b>)` : ""}`);
          continue;
        }
        const n = body ? (id ? zNote(tid, id, title) : null) || zSame(tid, title) : zNote(tid, id, title);
        if(!n && body){
          const key = zNorm(title || body.slice(0, 60));
          if(fresh.has(key)) continue;
          fresh.add(key);
          const sub = r.subtopic ? (zFind(subsOf(tid), r.subtopic, y => [y.n]) || {}).k || "" : "";
          ops.push({kind:"newnote", tid, title: zIdLike(title) ? "" : title, body, v, sub, day: zIso(r.date) || day});
          lines.push(`${tname}: nová poznámka „${esc(title || plainText(body, 60))}“${v ? ` (<b>${lvTxt(v)}</b>)` : ""}`);
          continue;
        }
        if(!n){ if(ref) miss.push(ref); continue; }
        if(used.has(n.id) || !v || n.lv === v) continue;
        ops.push({kind:"note", tid, n:n.id, v});
        lines.push(`${tname}: poznámka „${esc(noteTitle(n))}“ ${n.lv ? `${lvTxt(n.lv)} → ` : ""}<b>${lvTxt(v)}</b>`);
      }
      if(miss.length) skip.push(`${tname}: ${miss.length} ${plural(miss.length, "poznámka na nové hodnotenie sa v appke nenašla", "poznámky na nové hodnotenie sa v appke nenašli", "poznámok na nové hodnotenie sa v appke nenašlo")} (${zMiss(miss)}), ich hodnotenie sa preskočí.`);
    }
  }
  return {ops, lines, skip};
}

/* adds what zapisPreview found; returns counts for the toast */
function zapisApply(p){
  const now = Date.now();
  let tests = 0, removed = 0, notes = 0;
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
    } else if(o.kind === "untask"){
      taskToNote(o.tid, o.n);
      if(o.v) updateNote(o.tid, o.n, {lv:o.v});
      notes++;
    } else if(o.kind === "newnote"){
      const n = addNote(o.tid, o.sub);
      const c = o.day ? Math.min(new Date(o.day + "T12:00:00").getTime(), now) : now;
      Object.assign(n, {title:o.title, body:o.body, lv:o.v || 0, c, u:now});
      notes++;
    }
  }
  return {tests, removed, notes};
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
   Ak má úloha v trackeri poznámku (poznámky ku každej úlohe, ktoré si mi písal), daj do "note" jej id presne skopírované z JSON-u trackera a do "title" jej presný názov. Id nikdy nevymýšľaj: ak ho v JSON-e nevidíš, daj len "title". Tracker tú poznámku presunie k testu aj s celým textom, takže "text" k nej už nepíš. Úlohe bez poznámky daj "title" (krátko, napr. "B2: definičný obor") a "text" (zadanie, postup, výsledok, 💡).
   Ak je celý test zapísaný v jednej poznámke, daj jej id alebo presný názov do "from_note" testu; tracker ju po prenesení zmaže.
2. Úroveň každej témy zo session, ako som ju vedel na konci session: "neviem", "slabo", "ide to" alebo "perfektne" (perfektne až po 2 rôznych úlohách bez pomoci). Podtémy len ak poznáš ich presné názvy z trackera.
3. Ostatné poznámky z tejto session (tie, ktoré nie sú úlohou testu) idú do "notes" ako obyčajné poznámky témy, nie do testu:
   - poznámka, ktorá už v trackeri je: "note" (id z JSON-u trackera, nikdy nie vymyslené), "title" (presný názov) a "level" ("neviem", "slabo", "ide to" alebo "perfektne") podľa toho, ako sa mi tá úloha darila,
   - nová poznámka, ktorá v trackeri ešte nie je: bez "note", len "title", "text" (celý obsah poznámky) a "level"; tracker ju pridá ako novú poznámku témy (rovnaký názov sa druhýkrát nepridá),
   - úloha, ktorá je v trackeri omylom v teste a má byť obyčajnou poznámkou: jej "note" (id) a "level"; tracker ju vyberie z testu.

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
            {"res": "ok", "note": "id poznámky k úlohe A1", "title": "jej presný názov"},
            {"res": "part", "note": "id poznámky k úlohe A2", "title": "jej presný názov"},
            {"res": "bad", "title": "B1: definičný obor", "text": "Zadanie, postup, výsledok, 💡"}
          ]
        }
      ],
      "notes": [
        {"note": "id poznámky", "title": "jej presný názov", "level": "slabo"},
        {"title": "Diskriminant: kedy 2 korene", "text": "Obsah novej poznámky: vzorce, postup, 💡", "level": "ide to"}
      ]
    }
  ]
}
\`\`\`

"res" je "ok", "part" alebo "bad". Čo nevieš, vynechaj (name, from_note, notes; "subtopics": [{"name": "…", "level": "…"}] pridaj len pri presných názvoch).${withTopics ? `

Témy v trackeri (id: názov):
${T.map(x => `${x.id}: ${x.n}`).join("\n")}` : ""}`;
}

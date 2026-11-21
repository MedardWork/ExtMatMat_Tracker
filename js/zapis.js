/* ============================================================
   ZÁPIS ZO SESSION — what an AI read out of an old study session, added to the progress (never replacing it).
   The person pastes the AI's answer into Info → Vložiť postup; importText (js/views/info.js) finds the block here,
   shows a preview (zapisPreview) and adds it on "Pridať do postupu" (zapisApply), with undo.
   Format "maturita-zapis-1" (ZAPIS_PROMPT asks the AI for it):
     { format, date: "YYYY-MM-DD" (the session's day),
       topics: [ { topic: id or the app's name of the topic, level: 1–4 (whole topic), subtopics: [{name, level}],
                   tests: [{date, name, from_note, tasks: [{res: "ok"|"part"|"bad", title, text, subtopic}]}],
                   notes: [{title, level}] } ] }
   Rules: a level is set only if the app has no rating of that subtopic from a later day; a test already in the app
   (same topic, day and name) is skipped; from_note = the note that held the test, removed once the test is in;
   notes are found by their title. Topics, subtopics and notes are matched by name without case and accents.
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
const zLevel = v => { const n = Math.round(+v); return n >= 1 && n <= 4 ? n : null; };
const ZRES = {ok:"ok", "✓":"ok", spravne:"ok", "1":"ok", part:"part", "½":"part", ciastocne:"part", "0.5":"part", "0,5":"part", bad:"bad", "✗":"bad", zle:"bad", "0":"bad"};
const zRes = r => ZRES[zNorm(r)] || ZRES[String(r).trim()] || "";

/* what the zápis would change, without changing anything: {ops, lines, skip} */
function zapisPreview(list){
  const ops = [], lines = [], skip = [];
  const lvTxt = v => LV[v].label;
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
        const tasks = (Array.isArray(x.tasks) ? x.tasks : []).filter(isObj).map(k => ({
          res: zRes(k.res), title: String(k.title || "").trim(), body: String(k.text || k.body || "").trim(),
          sub: k.subtopic ? (zFind(subsOf(tid), k.subtopic, y => [y.n]) || {}).k || "" : ""}));
        if(!tasks.length){ skip.push(`${tname}: test ${fmtD(d)} nemá úlohy, preskočím ho.`); continue; }
        if(testsOf(tid).some(y => y.d === d && zNorm(y.n) === zNorm(name)) || ops.some(o => o.kind === "test" && o.tid === tid && o.d === d && zNorm(o.name) === zNorm(name))){
          skip.push(`${tname}: test ${fmtD(d)}${name ? ` „${esc(name)}“` : ""} už v appke je.`);
          continue;
        }
        const from = x.from_note ? zFind(topicNotes(tid), x.from_note, n => [n.title]) : null;
        if(x.from_note && !from) skip.push(`${tname}: poznámka „${esc(x.from_note)}“ sa nenašla, nič sa nemaže.`);
        const pts = tasks.reduce((a, k) => a + (TASK_PTS[k.res] || 0), 0), open = tasks.filter(k => !k.res).length;
        ops.push({kind:"test", tid, d, name, tasks, from: from ? from.id : null});
        lines.push(`${tname}: test ${fmtD(d)}${name ? ` „${esc(name)}“` : ""} · <b>${numTxt(pts)}/${tasks.length}</b>${open ? ` (${open} bez známky)` : ""}${from ? ` · poznámka „${esc(noteTitle(from))}“ sa zmaže` : ""}`);
      }
      /* notes rated again */
      for(const r of Array.isArray(tp.notes) ? tp.notes : []){
        const v = zLevel(r && r.level), n = r && zFind(topicNotes(tid), r.title, y => [y.title]);
        if(!n){ skip.push(`${tname}: poznámka „${esc(r && r.title)}“ sa nenašla.`); continue; }
        if(!v || n.lv === v) continue;
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

/* the instructions for an old session's AI; withTopics adds the list of the app's topics with their ids */
function zapisPrompt(withTopics){
  return `Ahoj, appka na maturitu, v ktorej si vediem postup, má teraz testy z tém: test má deň, voliteľný názov a úlohy a každá úloha je ✓ správne, ½ čiastočne alebo ✗ zle. Body sa spočítajú samy, každá úloha je 1 bod. Prejdi celú túto session a priprav mi zápis do appky:

1. Testy: každý test, ktorý som v tejto session robil (aj keď sme ho do appky zapísali len ako poznámku). Každá úloha testu je jedna položka s výsledkom. K úlohám, kde som chyboval (½ alebo ✗), daj krátky názov a text: zadanie, kde bola chyba a správny postup. Úlohy, ktoré som mal dobre, stačia s výsledkom bez textu. Ak je test v appke zapísaný ako poznámka a tá poznámka obsahuje len ten test, daj do "from_note" jej presný názov (appka ju po prenesení zmaže). Ak je v nej aj niečo iné, "from_note" vynechaj.
2. Úroveň témy, ako som ju vedel na konci tejto session (a ak sa dá, aj jednotlivých podtém): 1 neviem (sám to nevyriešim), 2 slabo (s pomocou alebo pozeraním do vzorcov), 3 ide to (vyriešim sám, občas sa pomýlim), 4 perfektne (rýchlo a bez chyby). Riaď sa tým, ako mi išli všetky úlohy v session, nie len jedným testom.
3. Poznámky, ktoré sme si v tejto session napísali do appky: ku každej jej presný názov a úroveň 1–4, ako som jej rozumel.

Nevymýšľaj nič, čo v session nebolo. "date" je deň tejto session (RRRR-MM-DD); ak ho nevieš, opýtaj sa ma. "topic" je id témy z appky (napr. a5), ak ho nevieš, presný názov témy z appky.

Odpovedz krátkym zhrnutím po slovensky a potom jedným blokom kódu presne v tomto tvare (platný JSON, bez komentárov; spätné lomky vo vzorcoch zdvoj, napr. "$\\\\frac{1}{2}$"):

\`\`\`json
{
  "format": "${ZAPIS_FORMAT}",
  "date": "2026-11-12",
  "topics": [
    {
      "topic": "a5",
      "level": 3,
      "subtopics": [{"name": "presný názov podtémy", "level": 2}],
      "tests": [
        {
          "date": "2026-11-12",
          "name": "napr. Zbierka str. 34",
          "from_note": "presný názov poznámky, v ktorej je test",
          "tasks": [
            {"res": "ok"},
            {"res": "part", "title": "Úloha 3: NSD", "text": "Zadanie, kde bola chyba a správny postup. Vzorce medzi $…$."},
            {"res": "bad", "title": "…", "text": "…"}
          ]
        }
      ],
      "notes": [{"title": "presný názov poznámky", "level": 2}]
    }
  ]
}
\`\`\`

"res" je "ok", "part" alebo "bad". Čo nevieš, vynechaj (subtopics, from_note, name, notes).${withTopics ? `

Témy v appke (id: názov):
${T.map(x => `${x.id}: ${x.n}`).join("\n")}` : ""}`;
}

/* ============================================================
   EVENTS
   ============================================================ */
document.getElementById("tabs").addEventListener("click", e => {
  const b = e.target.closest(".tab"); if(!b) return;
  tab = b.dataset.k; renderTabs(); renderList();
});

function setFilter(f){
  filter = f;
  [...document.querySelectorAll("#filters [data-f]")].forEach(c => c.setAttribute("aria-pressed", c.dataset.f === f));
  renderList();
}
document.getElementById("filters").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  if(b.id === "descAll"){
    allDesc = !allDesc;
    if(!allDesc) openDesc.clear();
    b.textContent = allDesc ? "Zbaliť všetky popisy" : "Rozbaliť všetky popisy";
    renderList();
    return;
  }
  setFilter(b.dataset.f);
});

document.getElementById("search").addEventListener("input", e => {
  query = e.target.value.trim(); renderList();
});

document.getElementById("list").addEventListener("click", e => {
  const lvBtn = e.target.closest(".seg button");
  if(lvBtn){
    setLevel(lvBtn.dataset.id, Number(lvBtn.dataset.v));
    save(); renderAll();
    return;
  }
  const dt = e.target.closest("[data-desc]");
  if(dt){
    const id = dt.dataset.desc;
    if(allDesc){
      /* leaving "all open" mode: keep everything open except this one */
      allDesc = false;
      document.getElementById("descAll").textContent = "Rozbaliť všetky popisy";
      T.forEach(x => openDesc.add(x.id));
      openDesc.delete(id);
    } else if(openDesc.has(id)) openDesc.delete(id);
    else openDesc.add(id);
    renderList();
    return;
  }
  const tg = e.target.closest("[data-toggle],[data-open]");
  if(tg){
    const id = tg.dataset.toggle || tg.dataset.open;
    if(openNotes.has(id)) openNotes.delete(id); else openNotes.add(id);
    renderList();
    if(openNotes.has(id)){
      const ta = document.querySelector(`textarea[data-note="${id}"]`);
      if(ta){ ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    }
  }
});

document.getElementById("list").addEventListener("input", e => {
  const ta = e.target.closest("textarea[data-note]"); if(!ta) return;
  const id = ta.dataset.note;
  if(ta.value.trim()) state.notes[id] = ta.value; else delete state.notes[id];
  state.upd[id] = Date.now();
  saveSoon();
  const btn = document.querySelector(`[data-toggle="${id}"]`);
  if(btn) btn.classList.toggle("has", !!ta.value.trim());
});

/* log */
document.getElementById("logDate").value = todayIso();
document.getElementById("logAdd").addEventListener("click", () => {
  const ta = document.getElementById("logText");
  const text = ta.value.trim();
  if(!text){ ta.focus(); return; }
  const d = document.getElementById("logDate").value || todayIso();
  state.log.push({id: Date.now().toString(36), d, text, ts: Date.now()});
  ta.value = "";
  save(); renderLog(); flash("Záznam pridaný.");
});
document.getElementById("logList").addEventListener("click", e => {
  const del = e.target.closest("[data-del]");
  if(del){
    if(!confirm("Zmazať tento záznam z denníka?")) return;
    state.log = state.log.filter(x => x.id !== del.dataset.del);
    save(); renderLog();
    return;
  }
  if(e.target.id === "logMore"){ showAllLog = !showAllLog; renderLog(); }
});
document.getElementById("todayLink").addEventListener("click", () => {
  setFilter("today");
  document.getElementById("tabs").scrollIntoView({behavior:"smooth"});
});

/* backup */
document.getElementById("btnExport").addEventListener("click", async () => {
  const txt = JSON.stringify(state);
  try{ await navigator.clipboard.writeText(txt); flash("Postup je v schránke."); }
  catch(err){
    document.getElementById("importBox").hidden = false;
    document.getElementById("importArea").value = txt;
    flash("Skopíruj text z poľa nižšie.");
  }
});
document.getElementById("btnImportToggle").addEventListener("click", () => {
  const box = document.getElementById("importBox");
  box.hidden = !box.hidden;
});
document.getElementById("btnImport").addEventListener("click", () => {
  try{
    state = migrate(JSON.parse(document.getElementById("importArea").value.trim()));
    save(); renderAll(); flash("Načítané.");
  }catch(err){ flash("Text sa nedal prečítať — skontroluj, či je celý."); }
});
document.getElementById("btnReset").addEventListener("click", () => {
  if(!confirm("Naozaj vymazať všetky hodnotenia, poznámky aj denník?")) return;
  state = emptyState(); openNotes.clear(); save(); renderAll(); flash("Vymazané.");
});
function flash(msg){
  const s = document.getElementById("status");
  s.textContent = msg;
  setTimeout(() => { s.textContent = ""; }, 4000);
}

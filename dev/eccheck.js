/* Checks the past-test data (js/data/ec.js) against the subtopic lists and prints the scopes.
   node dev/eccheck.js          problems only, then a summary per scope
   node dev/eccheck.js list     every subtopic with its tests, points per test and points per hour */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {state:{prefs:{}}, isOff:() => false, plural:(n, a, b, c) => n === 1 ? a : n >= 2 && n <= 4 ? b : c, action:() => {}};
vm.createContext(ctx);
for(const f of ["js/data/levels.js", "js/data/topics.js", "js/data/subtopics.js", "js/data/ec.js"])
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8").replace(/^const (\w+) =/gm, "var $1 ="), ctx);
vm.runInContext(`var norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
var subKey = name => norm(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
var BY_ID = Object.fromEntries(T.map(x => [x.id, x]));
var SUB_LIST = Object.fromEntries(T.map(x => [x.id, (SUBS[x.id] || [x.n]).map(n => ({k:subKey(n), n}))]));
var subsOf = id => SUB_LIST[id]; var subLv = () => 0;`, ctx);
vm.runInContext(fs.readFileSync(path.join(root, "js/ec.js"), "utf8").replace(/^const (\w+) =/gm, "var $1 ="), ctx);
let bad = 0;
for(const t of ctx.EC_TESTS){
  if(t.t.length !== 30){ console.log(`${t.y}: ${t.t.length} tasks, expected 30`); bad++; }
  t.t.forEach(([refs, d, l], i) => {
    for(const r of refs.split(" ")){
      const [tid, ix] = r.split(".");
      if(!ctx.SUBS[tid] || !ctx.SUBS[tid][+ix]){ console.log(`${t.y} task ${i + 1}: no subtopic ${r} (${l})`); bad++; }
      if(tid.startsWith("c")){ console.log(`${t.y} task ${i + 1}: ${r} is a Danish topic`); bad++; }
    }
    if(![1, 2, 3].includes(d)){ console.log(`${t.y} task ${i + 1}: difficulty ${d}`); bad++; }
  });
}
for(const ref in ctx.EC_NEEDS) for(const r of [ref, ...ctx.EC_NEEDS[ref]]){
  const [tid, ix] = r.split(".");
  if(!ctx.SUBS[tid] || !ctx.SUBS[tid][+ix]){ console.log(`EC_NEEDS: no subtopic ${r}`); bad++; }
}
const E = ctx.EC, n = v => v.toFixed(2);
if(process.argv[2] === "list"){
  for(const k of Object.keys(E.sub).sort((a, b) => E.sub[b].pph - E.sub[a].pph)){
    const o = E.sub[k];
    console.log(`${k.padEnd(50)} ${String(o.years.length).padStart(2)} tests  ${n(o.pts)} b./test  ${n(o.pph)} b./h  ${E.set.min.has(k) ? "min" : E.set.ec.has(k) ? "ec" : "-"}`);
  }
}
const total = Object.values(E.sub).reduce((a, o) => a + o.pts, 0);
console.log(`${E.nTests} tests ${E.first}–${E.last}, ${Object.keys(E.sub).length} subtopics asked, points sum ${n(total)} (should be 30)`);
for(const s of ctx.EC_SCOPES){
  const c = ctx.ecCover(s.k);
  console.log(`${s.k.padEnd(4)} ${c.topics} topics, ${c.subs} subtopics, ${n(c.pts)} of 30 points, about ${Math.round(c.h)} h from zero`);
}
if(Math.abs(total - 30) > 1e-6) bad++;
console.log(bad ? `${bad} problem(s)` : "ok");
process.exit(bad ? 1 : 0);

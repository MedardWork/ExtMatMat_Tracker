// Lists how the worked examples of theory are answered (js/exercise.js): checked as numbers, or opened and
// marked by the reader. Also tries each checked result against itself and a few typical ways to write it.
//   node dev/excheck.js            summary + any example whose own result does not pass
//   LIST=1 node dev/excheck.js     every checked example with the numbers it expects
//   LIST=2 node dev/excheck.js     every example marked by hand, with its result (to spot numbers left out)
//   node dev/excheck.js a1 b38     these topics only
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, "..");
const ctx = {console, Math, Number, String, Map, Set, Array, Object, isFinite, NaN, Infinity,
  action: () => {}, document: {addEventListener(){}}, state: {ex:{}}, THEORY: {}, R: String.raw,
  fact: () => 0, binom: () => 0, findRoots: () => [], fmtN: String, texN: String};
vm.createContext(ctx);
const core = fs.readFileSync(path.join(root, "js/tools/core.js"), "utf8");
const a = core.indexOf("const MATH_FN"), b = core.indexOf("/* ---------- printing");
vm.runInContext(core.slice(a, b).replace(/^const (\w+) =/gm, "var $1 ="), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "js/exercise.js"), "utf8").replace(/^const (\w+) =/gm, "var $1 ="), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "js/data/theory/index.js"), "utf8").replace(/^const (\w+) =/gm, "var $1 ="), ctx);
const only = process.argv.slice(2);
const ids = ctx.THEORY_LIST.filter(id => !only.length || only.includes(id));
let auto = 0, hand = 0, fail = 0;
for(const id of ids){
  vm.runInContext(fs.readFileSync(path.join(root, `js/data/theory/${id}.js`), "utf8"), ctx);
  for(const [sub, blocks] of Object.entries(ctx.THEORY[id].subs)) for(const bl of blocks){
    if(!bl || bl.ex == null) continue;
    const exp = ctx.exExpect(bl);
    const res = String(bl.res).replace(/\s+/g, " ").slice(0, 110);
    if(!exp){ hand++; if(process.env.LIST === "2") console.log(`${id}\t${res}`); continue; }
    auto++;
    /* the expected numbers written plainly must pass, and so must the same with a decimal comma */
    const own = exp.v.map(v => String(+v.toFixed(6))).join("; ");
    const ok = ctx.exCheck(exp, ctx.exParse(own)) === "ok" && ctx.exCheck(exp, ctx.exParse(own.replace(/\./g, ","))) === "ok";
    if(!ok){ fail++; console.log(`FAIL ${id}\t${own}\t${res}`); }
    if(process.env.LIST === "1") console.log(`${id}\t[${exp.v.map(v => +v.toFixed(4)).join("; ")}]${exp.ord ? " ord" : ""}${exp.ap ? " ≈" : ""}\t${res}`);
  }
}
console.log(`${auto + hand} examples: ${auto} checked as numbers, ${hand} marked by the reader${fail ? `, ${fail} FAIL` : ""}`);
process.exit(fail ? 1 : 0);

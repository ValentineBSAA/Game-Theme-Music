'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const path=require('path'),root=path.join(__dirname,'..');
const engine=fs.readFileSync(path.join(root,'src/visualizer-behaviors/chess-440.js'),'utf8');
const src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
assert(src.includes(engine),'editable source must include exact shipped chess engine');
assert(bundle.includes(engine),'built-in frontend must include exact shipped chess engine');
assert(engine.includes('deadline:Date.now()+6'),'AI must have a short main-thread budget');
assert(bundle.includes('Gtm440VisualizerBrowser'),'controller-safe visualizer navigator must be integrated');
let ctx=vm.createContext({Math,Date,g421Base:()=>({seed:4,elapsed:0})});
vm.runInContext(engine+'\nthis.create=()=>GTM440_CHESS.create();this.ai=g440AiMove;this.apply=g440Apply;',ctx);
let s=ctx.create(),max=0;
for(let i=0;i<24;i++){
 const start=performance.now(),move=ctx.ai(s,.93),elapsed=performance.now()-start;
 max=Math.max(max,elapsed);if(!move)break;s=ctx.apply(s,move);
}
assert(max<55,'AI synchronous move must not monopolize SteamUI renderer: '+max+'ms');
console.log('PASS chess AI deadline and source/bundle consistency; max simulated calculation '+max.toFixed(1)+' ms');

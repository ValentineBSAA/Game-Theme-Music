'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root=__dirname+'/../';
const pack=JSON.parse(fs.readFileSync(root+'visualizer-packs/sdk-examples/flux-shield-run-428/manifest.json','utf8'));
const scene=pack.scenes[0];assert.equal(scene.category,'arcade');assert.equal(scene.interaction.kind,'game');
assert.deepEqual(scene.interaction.modes,['ai_ai','player_ai','player_player','solo']);
const src=fs.readFileSync(root+'src/visualizer-behaviors/pack-program-418.js','utf8');
const ctx={Math,Date,Map,WeakMap,Set,console};vm.createContext(ctx);
vm.runInContext(src+'\nthis.run=gtm418RunCommands;',ctx);
const registers={...scene.program.state};
const input={p1x:0,p2x:0,p1lb:0,p1rb:0,p2lb:0,p2rb:0,human1:0,human2:0,opt_speed:1,dt:1/60};
let env={...registers,...input};
const fake={globalAlpha:1,fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){},fillText(){}};
function step(){const budget={left:12500,draw:0};ctx.run(scene.program.update,env,fake,600,125,budget,'update');assert(budget.left>0);}
function draw(){const budget={left:12500,draw:0};ctx.run(scene.program.draw,env,fake,600,125,budget,'draw');assert(budget.left>0&&budget.draw<320);}
// AI demo scores independently with no player claiming a pad.
for(let i=0;i<2400;i++){step();if(i%100===0)draw();}
assert(env.score1>1&&env.score2>1,'both AI ships should actually survive and score');
assert(env.x1>=.06&&env.x1<=.94&&env.x2>=.06&&env.x2<=.94,'AI ships must remain inside bounds');
console.log('PASS independent community AI game scores with validated declarative commands');
// Pulsing LB triggers a timed shield and 15-second cooldown; holding it doesn't retrigger.
env.human1=1;env.p1lb=1;step();
assert(env.shield1>2.4&&env.shieldcd1>14.9);
for(let i=0;i<190;i++)step();
assert.equal(env.shield1,0);assert(env.shieldcd1>11);
console.log('PASS externally defined LB shield obeys duration, cooldown and rising-edge latch');
// A fresh RB press starts the independent dash cooldown, even with LB spent.
env.p1rb=1;step();assert(env.boost1>1.9&&env.boostcd1>9.9);
console.log('PASS independently authored RB dash runs without a GTM source rebuild');

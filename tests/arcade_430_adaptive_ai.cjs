'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const ship=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const start='function gtm430PongAdaptiveBrain(s,dt,session){';
const end='function gtm413PongStep(s,dt,env){';
assert(src.includes(start)&&ship.includes(start));
const a=src.slice(src.indexOf(start),src.indexOf(end));
const b=ship.slice(ship.indexOf(start),ship.indexOf(end));
assert.equal(a,b,'adaptive rules in editable source and shipped frontend differ');
const ctx={Math};vm.createContext(ctx);
vm.runInContext(a+'\nthis.adapt=gtm430PongAdaptiveBrain;',ctx);
const leftHuman={left:{human:true},right:{human:false}};
const rightHuman={left:{human:false},right:{human:true}};
const bothAI={left:{human:false},right:{human:false}};
const bothHuman={left:{human:true},right:{human:true}};
const newGame=()=>({scoreLeft:0,scoreRight:0});
function evolve(s,players,seconds=6){let result;for(let i=0;i<seconds*60;i++)result=ctx.adapt(s,1/60,players);return result;}
// Weak player: deliberately misses four scores, with time between each point.
let s=newGame();let brain=evolve(s,leftHuman,2),startSkill=s.adaptiveSkill;
assert(startSkill<.55&&startSkill>.40,'starting human opponent should not be high-skill');
for(let i=0;i<4;i++){s.scoreRight++;evolve(s,leftHuman,4);}
const weakSkill=s.adaptiveSkill,weakBrain=brain=evolve(s,leftHuman,1);
assert(weakSkill<.35,`a clearly struggling player still faces strong AI (${weakSkill})`);
assert(weakBrain.speed<.45&&weakBrain.noise>.36&&weakBrain.tick>.37,'low-skill AI must slow tracking, add prediction error and wait longer');
console.log('PASS weak human loses 4 points => Adaptive AI relaxes:',weakSkill.toFixed(3),JSON.stringify(weakBrain));
// A player who improves must get steadily more capable opposition.
s=newGame();evolve(s,leftHuman,2);
for(let i=0;i<5;i++){s.scoreLeft++;evolve(s,leftHuman,4);}
const strongSkill=s.adaptiveSkill,strongBrain=evolve(s,leftHuman,1);
assert(strongSkill>.59,`winning human does not get a stronger opponent (${strongSkill})`);
assert(strongBrain.speed>weakBrain.speed+.1&&strongBrain.noise<weakBrain.noise-.08,'adaptive controls not responding in the correct direction');
console.log('PASS winning human earns a tougher opponent:',strongSkill.toFixed(3),JSON.stringify(strongBrain));
// Right-side human ownership MUST work too, and changing ownership resets stale AI skill.
s=newGame();evolve(s,rightHuman,1);for(let i=0;i<3;i++){s.scoreLeft++;evolve(s,rightHuman,3);}
assert(s.adaptiveSkill<.4,'right-side human loss is not recognized');
const afterSwap=evolve(s,leftHuman,1);
assert(s.adaptiveOpponent.role==='left'&&s.adaptiveSkill>.40,'human side ownership change retained stale difficulty');
console.log('PASS right-side player adaptive feedback and human-side reset');
// AI demo gets a stable, competitive baseline and never inherits a weak human's easier opposition.
brain=evolve(s,bothAI,3);
assert(s.adaptiveOpponent.role==='demo'&&Math.abs(s.adaptiveSkill-.70)<.001,'AI demo must not inherit weak human difficulty');
brain=evolve(s,bothHuman,1);assert(s.adaptiveOpponent.role==='demo','two humans should not trigger a phantom human-vs-AI difficulty adjustment');
console.log('PASS AI demo stays competitive and PvP does not trigger skill targeting');
// Reset score after championship does not create a sudden phantom goal event.
s=newGame();evolve(s,leftHuman,1);s.scoreRight=3;evolve(s,leftHuman,1);let previous=s.adaptiveSkill;
s.scoreLeft=0;s.scoreRight=0;evolve(s,leftHuman,.2);
assert(Number.isFinite(s.adaptiveSkill)&&s.adaptiveSkill>.18,'score reset caused invalid AI state');
console.log('PASS scoreboard reset, finite AI state');
// Manual difficulties must remain selectable and not be overwritten by adaptive settings.
assert(src.includes("difficulty==='adaptive'?gtm430PongAdaptiveBrain(s,dt,{...controls,adaptiveStyle:cfg.homeReactiveVisualizerArcadeAdaptiveStyle||'balanced'}):null"));
assert(src.includes("difficulty==='expert'?{speed:.79,noise:.15,tick:.19}"));
console.log('PASS manual difficulty pathways remain unchanged and source matches shipped frontend');
// Integration: run the actual shipping Pong step rather than only the policy helper.
const fullBox={Math,Date,console,gtm418ReadPlayers:()=>({left:{human:false},right:{human:false}}),
 gtm418DrawSessionStatus(){},gtm418ConsumeMenuAction:()=>false};
vm.createContext(fullBox);
vm.runInContext(src+'\nthis.game=GTM413_BEHAVIORS.get("neon_pong");this.pool=GTM414_PONG_POOL;',fullBox);
const cfg={homeReactiveVisualizerPongMode:'classic',homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerPongGoal:11};
const env={settings:cfg,arcade:{human1:true,human2:false,left:{human:true,y:0},right:{human:false,y:0}},beat:0,lo:0,hi:0};
const state=fullBox.game.create(env);state.serve=0;state.ball={x:.5,y:.5,vx:.001,vy:0};
fullBox.game.step(state,1/60,env);const initial=state.adaptiveSkill;
for(let n=0;n<4;n++){
 state.scoreRight++;
 for(let i=0;i<180;i++)fullBox.game.step(state,1/60,env);
}
assert(state.adaptiveSkill<initial-.12,`real Pong step ignored losing player: ${initial} -> ${state.adaptiveSkill}`);
assert(state.adaptiveOpponent.role==='left');
console.log('PASS shipping Pong engine invokes adaptive AI while real human loses points');

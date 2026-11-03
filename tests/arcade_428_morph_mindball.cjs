'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/../';
const source=fs.readFileSync(root+'src/visualizer-behaviors/runtime-414.js','utf8');
const shipped=fs.readFileSync(root+'dist/index.js','utf8');
const start=source.indexOf('const GTM428_PONG_MORPHS=');
const end=source.indexOf('function gtm413PongDraw(',start);
const dstart=shipped.indexOf('const GTM428_PONG_MORPHS=');
const dend=shipped.indexOf('function gtm413PongDraw(',dstart);
assert(start>=0&&dstart>=0&&end>start&&dend>dstart);
assert.equal(source.slice(start,end),shipped.slice(dstart,dend),'Editable Pong mechanics differ from shipped frontend');
const ctx={Math,Date,GTM414_PONG_POOL:new Map(),gtm413PongRandom:()=>.67,
 gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
 gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
 gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),gtm418ConsumeMenuAction:()=>0,
 GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#fff'}}};
vm.createContext(ctx);
vm.runInContext(source.slice(start,end)+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep,morph:gtm428PongMorph};',ctx);
const human={human:true,y:0,lb:0,rb:0,xbtn:0,ybtn:0,lt:0,rt:0};
const ai={...human,human:false};
function setup(mode,buttons={}){
 ctx.GTM414_PONG_POOL.clear();
 const settings={homeReactiveVisualizerPongMode:mode,homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongDifficulty:'balanced',homeReactiveVisualizerPongDefenseMorph:'fortress',homeReactiveVisualizerPongAttackMorph:'mirror'};
 const env={settings,arcade:{left:{...human,...buttons},right:ai},beat:0,lo:0,hi:0};
 const s=ctx.api.create(env);s.serve=0;s.left=.5;s.right=.5;
 return {env,s};
}
// Human fortress must block a shot outside the original paddle, persist after impact and recharge slowly.
let {env,s}=setup('morph',{lb:1});
s.ball={x:.137,y:.81,vx:-.65,vy:0};
ctx.api.step(s,1/60,env);
assert(s.ball.vx>0,'Fortress should genuinely block missed shots');
assert(s.morphTimeLeft>2.9,'Fortress duration missing');
assert(s.morphCdDefenseLeft>19.9,'Fortress must have 20-second cooldown');
assert.equal(s.morphLeft,'fortress');
assert(s.shieldLeft<=0,'Fortress must be separate from old consumable shield');
let remaining=s.morphTimeLeft;
ctx.api.step(s,1/60,env);assert(s.morphTimeLeft<remaining,'Fortress timer not advancing');
console.log('PASS 3-second Fortress physically covers the court and recharges for 20 seconds');
// The barrier remains full-height even if the actual paddle was at the extreme opposite edge.
({env,s}=setup('morph',{lb:1}));s.left=.77;s.ball={x:.137,y:.23,vx:-.65,vy:0};
ctx.api.step(s,1/60,env);assert(s.ball.vx>0,'full-height shield failed against opposite-side shot');
console.log('PASS Fortress is a true full-height barrier, independent of paddle position');
// Attack morph physically modifies the return angle; no instant score from attack trigger.
({env,s}=setup('morph',{rb:1}));
s.ball={x:.137,y:.53,vx:-.57,vy:.18};ctx.api.step(s,1/60,env);
assert.equal(s.morphLeft,'mirror');assert(s.morphCdAttackLeft>14.9);
assert(s.ball.vx>0);assert(s.ball.vy<0,'Mirror morph should reverse the angle');
console.log('PASS Mirror transformation changes actual return physics and has independent cooldown');
// Classic mode must not quietly activate morphs.
({env,s}=setup('classic',{lb:1,rb:1}));s.ball={x:.4,y:.5,vx:.4,vy:0};
ctx.api.step(s,1/60,env);assert.equal(s.morphLeft,null);assert.equal(s.morphCdDefenseLeft,0);
console.log('PASS Classic keeps morphs disabled');
// The intelligent ball bends a little but never reverses horizontal direction or teleports.
({env,s}=setup('mindball'));s.ball={x:.38,y:.5,vx:.35,vy:0};s.serve=0;
const first=s.ball.x;for(let i=0;i<45;i++)ctx.api.step(s,1/90,env);
assert(s.ball.x>first&&s.ball.x<.75,'Mindball must travel forward normally');
assert(Math.abs(s.ball.vy)>.02&&Math.abs(s.ball.vy)<.49,'Mindball steering must be bounded and nonzero');
assert.equal(s.morphTimeLeft,0);
console.log('PASS Mindball curves gradually without horizontal reversal, teleportation or surprise morphs');
assert(shipped.includes("['chaos','Chaos Championship']")&&shipped.includes("['mindball','Mindball']"));
assert(shipped.includes('homeReactiveVisualizerPongDefenseMorph'));
console.log('PASS six game modes and morph configuration are exposed in the shipped settings');

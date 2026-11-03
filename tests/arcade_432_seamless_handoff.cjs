'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const ctrl=fs.readFileSync(path.join(root,'src/visualizer-behaviors/controller-418.js'),'utf8');
const engine=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const bundled=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
for(const [src,start,end] of [[ctrl,'const GTM418_ARCADE_MODES=','// Use only on interactive game scenes.'],[engine,'function gtm413RunBehavior(','function gtm413PongRandom(']]){
 const a=src.slice(src.indexOf(start),src.indexOf(end));const b=bundled.slice(bundled.indexOf(start),bundled.indexOf(end));
 assert(a&&b&&a===b,'current source and installed bundle differ at '+start);
}
let now=1000;
const makePad=id=>({id,connected:true,axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0}))});
const pads=[makePad('PlayStation Red'),makePad('PlayStation Black')];
const ctx=new Proxy({fillStyle:'#fff',strokeStyle:'#fff',globalAlpha:1,
 createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get(t,k){return k in t?t[k]:()=>{};}});
const sandbox={Math,Map,Number,Date,console,navigator:{getGamepads:()=>pads},performance:{now:()=>now}};
vm.createContext(sandbox);
vm.runInContext(ctrl+'\n'+engine+'\nthis.bridge=gtm418ReadPlayers;this.session=gtm418Session;this.run=gtm413RunBehavior;this.pool=GTM414_PONG_POOL;',sandbox);
const cfg={homeReactiveVisualizerArcadeMode:'ai_ai',homeReactiveVisualizerArcadeHoldPauseMs:800,
 homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1,homeReactiveVisualizerPongMode:'chaos',
 homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerPongGoal:7};
const allowed=['ai_ai','player_ai','player_player'];
const read=()=>sandbox.bridge(cfg,allowed,'neon_pong');
const frame={physicsDt:1/30,wallDt:1/30,dt:1/30,behaviors:Object.create(null)};
const env={settings:cfg,ctx,w:900,h:460,dpr:1,lo:0,mid:0,hi:0,beat:0,frame,scene:{background:{style:'stars'}}};
const draw=()=>sandbox.run('neon_pong',frame,0,env);
const advance=(seconds=1/30)=>{now+=seconds*1000;frame.physicsDt=seconds;frame.wallDt=seconds;frame.dt=seconds;draw();};
const button=(index,code,on)=>{pads[index].buttons[code].pressed=on;};
const holdTriangle=(index)=>{button(index,3,true);advance(.03);advance(.83);button(index,3,false);advance(.03);};
const ready=(index)=>{pads[index].axes[3]=.9;advance(.35);pads[index].axes[3]=0;};
let status=read();assert.equal(status.mode,'ai_ai');assert(!status.paused);
draw();const state=frame.behaviors['neon_pong:0'].state;
state.scoreLeft=3;state.scoreRight=2;state.serve=0;state.ball={x:.5,y:.51,vx:.35,vy:.12};
for(let i=0;i<4;i++)advance();
const beforeJoin=state.simTime;const preservedBall=state.ball;
holdTriangle(0);status=read();
assert.equal(status.readyWaiting,true);assert.equal(status.requested,'player_ai');
assert.equal(status.mode,'ai_ai');assert(!status.paused,'AI exhibition froze while human was getting ready');
assert.equal(frame.behaviors['neon_pong:0'].state,state,'join destroyed the match object');
assert.equal(state.ball,preservedBall,'join replaced a running ball');
assert.equal(state.scoreLeft,3);assert.equal(state.scoreRight,2);
assert(state.simTime>beforeJoin,'AI exhibition stopped during join hold');
console.log('PASS interrupting AI exhibition keeps the same match, score, ball and live physics');
ready(0);status=read();assert.equal(status.readySeconds,15);assert(!status.paused&&!status.human1);
const early=state.simTime;for(let i=0;i<25;i++)advance();
assert(state.simTime>early+.5,'AI exhibition stopped during human countdown');
assert.equal(frame.behaviors['neon_pong:0'].state,state);
console.log('PASS ready-up countdown lets AI demo keep playing; no stationary ball');
// Human takes over without resetting Pong; an already-held LB is NOT a phantom morph activation.
button(0,4,true);advance(15.1);status=read();
assert.equal(status.human1,true);assert.equal(status.mode,'player_ai');assert(!status.paused);
assert.equal(frame.behaviors['neon_pong:0'].state,state);assert(state.simTime>early);
assert(!state.morphLeft||state.morphTimeLeft===0,'LB held before join incorrectly activated a morph');
advance();assert(!state.morphLeft||state.morphTimeLeft===0);
button(0,4,false);advance();button(0,4,true);advance();
assert(state.morphTimeLeft>0,'a deliberate new LB press did not activate the morph');
console.log('PASS AI -> P1 preserves match, blocks ghost shoulder trigger, accepts new LB edge');
// Second human may ready up while P1 continues playing, no stolen controller.
holdTriangle(1);status=read();
assert.equal(status.requested,'player_player');
assert(status.human1,'P1 lost control while P2 joined');assert(!status.human2);assert(!status.paused);
ready(1);for(let i=0;i<14;i++)advance();
assert(read().human1,'P1 lost control during P2 ready countdown');
advance(15.1);status=read();assert(status.human1&&status.human2);
console.log('PASS P1 continues gameplay while P2 joins and readies; both humans then control independently');
// Last-human handoff: not a new match, no phantom AI pause, status and physics recover.
const session=sandbox.session('neon_pong');session.manualPause=true;
button(1,2,true);advance(.03);button(1,2,false);advance(.03);
assert(read().human1&& !read().human2,'P2 handoff took over P1');
assert(read().paused,'P1 deliberate pause must persist');
session.manualPause=false;
button(0,3,true);advance(.03);advance(.83);button(0,3,false);advance(.03);
assert(read().manualPaused,'P1 failed to pause deliberately');
button(0,2,true);advance(.03);button(0,2,false);advance(.03);
assert.equal(read().mode,'ai_ai');assert(!read().paused);
const timeBefore=state.simTime;advance();advance();
assert(state.simTime>timeBefore);assert.equal(frame.behaviors['neon_pong:0'].state,state);
console.log('PASS final manual handoff returns to running AI vs AI without changing or restarting the match');

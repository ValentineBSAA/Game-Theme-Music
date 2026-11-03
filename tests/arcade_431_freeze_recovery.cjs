'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const ctrl=fs.readFileSync(path.join(root,'src/visualizer-behaviors/controller-418.js'),'utf8');
const engine=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const ship=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
for(const [src,start,end] of [
 [ctrl,'const GTM418_ARCADE_MODES=','// Use only on interactive game scenes.'],
 [engine,'function gtm413RunBehavior(','function gtm413PongRandom('],
 [engine,'function gtm413PongStep(','// Premium scoring sequence for Couch View.']]){
 const a=src.slice(src.indexOf(start),src.indexOf(end));
 const b=ship.slice(ship.indexOf(start),ship.indexOf(end));
 assert(a&&b&&a===b,`shipped ${start} diverges from source`);
}
console.log('PASS shipped physics, frame accumulator and controller bridge match editable source');
let now=1000;
const pad={id:'PlayStation Wireless Controller',connected:true,axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0}))};
const pads=[pad];
const gfx=new Proxy({fillStyle:'#fff',strokeStyle:'#fff',globalAlpha:1,
 createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},
 {get(t,k){if(k in t)return t[k];return ()=>{};}});
const box={Math,Number,Map,Date,console,navigator:{getGamepads:()=>pads},performance:{now:()=>now}};
vm.createContext(box);
vm.runInContext(ctrl+'\n'+engine+'\nthis.read=gtm418ReadPlayers;this.session=gtm418Session;this.run=gtm413RunBehavior;this.impl=GTM413_BEHAVIORS.get("neon_pong");this.pool=GTM414_PONG_POOL;',box);
const allowed=['ai_ai','player_ai','player_player'];
const settings={homeReactiveVisualizerArcadeMode:'player_ai',homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1,homeReactiveVisualizerArcadeDisconnectSec:5,
 homeReactiveVisualizerPongMode:'classic',homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerPongGoal:7};
const read=()=>box.read(settings,allowed,'neon_pong');
let state=read();assert.equal(state.mode,'ai_ai');assert(!state.paused);
let session=box.session('neon_pong');
// Simulate a real, deliberately claimed slot (not a persisted preference).
session.joinOwners[0]={index:0,id:pad.id};
state=read();assert.equal(state.requested,'player_ai');
session.readyPhase='playing';session.joined=true;session.readyAccepted[0]=true;session.manualPause=true;
state=read();assert(state.paused&&state.manualPaused&&state.human1,'active human can intentionally pause');
pad.connected=false;now+=300;state=read();assert(state.countdown===5,'human disconnect grace period is preserved');
now+=5400;state=read();assert.equal(session.joinOwners[0],null);
now+=30;state=read();assert.equal(state.mode,'ai_ai');assert(!state.paused,'AI demo inherited former human pause');
assert(!session.manualPause,'manual pause flag survived human->AI transition');
console.log('PASS paused human disconnect -> 5s grace -> automatically resumed AI demo');
// Exercise actual render/physics dispatcher, not just manual state values.
const env={settings,ctx:gfx,w:1000,h:500,dpr:1,lo:0,mid:0,hi:0,beat:0,frame:{elapsed:0},scene:{background:{style:'stars'}}};
const frame={physicsDt:1/30,wallDt:1/30,dt:1/30,behaviors:Object.create(null)};
box.run('neon_pong',frame,0,env);
const pong=box.pool.get('championship');assert(pong);
pong.serve=0;pong.ball={x:.5,y:.5,vx:.35,vy:.12};
const firstX=pong.ball.x;
for(let i=0;i<10;i++){now+=33;frame.physicsDt=1/30;box.run('neon_pong',frame,0,env);}
assert(pong.ball.x>firstX+.03,`actual game ball never resumed in AI demo: ${pong.ball.x}`);
assert(frame.pongPhysicsSteps>0&&frame.pongPhase==='PLAYING');
console.log('PASS actual Pong renderer resumes physically moving ball during restored AI demo');
// A manually paused AI demo remains intentional until the user resumes it.
session.manualPause=true;
state=read();assert(state.paused&&state.manualPaused);
const pausedX=pong.ball.x;box.run('neon_pong',frame,0,env);
assert.equal(pong.ball.x,pausedX);assert.equal(frame.pongPhase,'INTENTIONALLY PAUSED');
session.manualPause=false;
box.run('neon_pong',frame,0,env);assert(pong.ball.x>pausedX);
console.log('PASS intentional AI pause/resume remains available and is distinguishable from a ghost pause');
// Stalled frame: do not attempt 20+ physics steps and compound the renderer stutter.
frame.physicsDt=.3;box.run('neon_pong',frame,0,env);
assert(frame.pongPhysicsSteps<=24,'severe stall exceeded 24 bounded steps');
frame.physicsDt=.06;box.run('neon_pong',frame,0,env);assert(frame.pongPhysicsSteps<=12,'normal frame exceeded 12 steps');
frame.physicsDt=.7;box.run('neon_pong',frame,0,env);
assert.equal(frame.pongPhysicsSteps,0);assert.equal(frame.pongDroppedSuspendGap,true);
frame.physicsDt=1/30;box.run('neon_pong',frame,0,env);
assert.equal(frame.pongDroppedSuspendGap,false);assert(frame.pongPhysicsSteps>=2);
console.log('PASS long frame discarded, catch-up bound enforced, normal frames resume');
// Genuine collision-free stationary ball: recover with serve and no phantom score.
pong.serve=0;pong.gameOver=0;pong.goalHold=0;pong.goalLane='';
pong.ball={x:.5,y:.5,vx:0,vy:0};const before=[pong.scoreLeft,pong.scoreRight];
for(let i=0;i<230;i++)box.impl.step(pong,1/90,env);
assert(pong.ballRecoveries>=1);assert(pong.ball.vx!==0);assert.deepEqual([pong.scoreLeft,pong.scoreRight],before);
console.log('PASS stationary mid-rally ball recovers without awarding a point');
// Non-finite physics never poisons next frames.
pong.serve=0;pong.ball.vx=NaN;const repairs=pong.ballRecoveries;
box.impl.step(pong,1/90,env);assert.equal(pong.ballRecoveries,repairs+1);
assert(pong.serve>0&&Number.isFinite(pong.ball.vx));
console.log('PASS invalid ball state immediately recovers safely');
// An intentional goal hold must expire and score exactly once, not trip stall watchdog.
pong.serve=0;pong.gameOver=0;pong.goalAt='right';pong.goalLane='right';pong.goalHold=.84;
pong.ball={x:.987,y:.55,vx:-.35,vy:0};const oldRight=pong.scoreRight;
for(let i=0;i<100;i++)box.impl.step(pong,1/90,env);
assert.equal(pong.scoreRight,oldRight+1,'goal hold did not award one goal');
assert.equal(pong.goalHold,0);assert(pong.serve>=0);
console.log('PASS real 0.84s goal hold finishes and awards exactly one point');
// Change persistent preference while paused; no stale state leaks into new mode.
pad.connected=true;read();session.manualPause=true;
settings.homeReactiveVisualizerArcadeMode='player_player';state=read();
assert(!state.manualPaused&&!state.paused&&state.mode==='ai_ai');
console.log('PASS settings-mode switch cannot strand the AI demo in a previous pause');

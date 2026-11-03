'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const arc=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
function extract(str,start,end){const a=str.indexOf(start);const b=str.indexOf(end,a+start.length);assert(a>=0&&b>a,'missing '+start);return str.slice(a,b);}
for(const [start,end,from] of [['function gtm428PongMindBall(','function gtm414PongSignature(',src],['// GTM 4.3.5: A second real controller-playable rhythm mode,','// Cooperative space defense:',arc]]){
 assert.equal(extract(from,start,end),extract(bundle,start,end),'source vs shipped bundle mismatch at '+start);
}
const context={Math,gtm413PongRandom:()=>.65};vm.createContext(context);
vm.runInContext(extract(src,'function gtm413PongPredict(','function gtm413PongServe(')+extract(src,'function gtm428PongMindBall(','function gtm414PongSignature(')+'\nthis.steer=gtm428PongMindBall;',context);
const newMind=(paddle)=>({ball:{x:.49,y:.49,vx:.35,vy:.06},left:.49,right:paddle,goalLane:'',hitCount:4,mindTimer:0,mindCue:0});
const settings={homeReactiveVisualizerPongMindballPersonality:'adaptive',homeReactiveVisualizerPongMindballStrength:'standard',homeReactiveVisualizerPongMindballAwareness:'strategic'};
let high=newMind(.73),low=newMind(.30);
context.steer(high,1/60,settings);context.steer(low,1/60,settings);
assert(high.mindTarget*low.mindTarget<0,'Adaptive Mindball must respond to the receiving paddle position');
assert(high.mindPlan&&low.mindPlan,'Adaptive must report a tactical reason');
let conservative=newMind(.73),aggressive=newMind(.73);
context.steer(conservative,1/60,{...settings,homeReactiveVisualizerPongMindballAwareness:'gentle'});
context.steer(aggressive,1/60,{...settings,homeReactiveVisualizerPongMindballAwareness:'dynamic'});
assert.notEqual(conservative.mindTarget,aggressive.mindTarget,'awareness level should change planning');
for(const awareness of ['gentle','strategic','dynamic']){
 let s=newMind(.8);for(let i=0;i<800;i++){
  context.steer(s,1/90,{...settings,homeReactiveVisualizerPongMindballAwareness:awareness});
  assert(Number.isFinite(s.ball.vy)&&Math.abs(s.ball.vy)<=.48,'steering must remain bounded');
  assert.equal(s.ball.vx,.35,'never change ball horizontal direction');
 }
 s.ball.x=.88;const old=s.ball.vy;context.steer(s,1/90,settings);assert.equal(s.ball.vy,old);assert.equal(s.mindActive,false);
}
console.log('PASS Mindball adaptive predicts paddle position, tactical awareness options, bounded direction, midfield-only and explicit cue deactivation');

const env={Math, g421Base:()=>({seed:775,elapsed:0,score:0,wave:1,over:0,wait:0,needInput:false,ready:true,particles:[]}),
 g421Clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),g421Random:s=>{let n=s.seed|0;n^=n<<13;n^=n>>>17;n^=n<<5;s.seed=n;return (n>>>0)/4294967296;},
 g423UsePower:()=>false,g423PowerActive:()=>false,g421Controls:()=>{},g423AIApproach:(_s,_f,t)=>t,
 g423ArenaBackdrop:()=>{},g421Hud:()=>{},g423PowerHud:()=>{}};
vm.createContext(env);vm.runInContext(extract(arc,'// GTM 4.3.5: A second real controller-playable rhythm mode,','// Cooperative space defense:')+'\nthis.game=GTM421_CATCHER;this.init=g435RhythmInit;',env);
const game=env.game,options={rhythmMode:'lanes',notePace:1};
const player=(rt,x=0)=>({human1:true,human2:true,p1:{rt,x},p2:{rt:0,x:0}});
function makeNote(kind='tap'){const s=game.create();env.init(s);s.activeRhythmMode='lanes';s.rhythm.spawn=999;
 s.rhythm.notes=[{lane:1,y:.729,vy:.29,kind,duration:kind==='hold'?.45:0,progress:[0,0],judged:[false,false],stage:[false,false]}];return s;}
let s=makeNote();game.step(s,1/60,player(0),{},options);
assert.equal(s.score1,0,'aligned alone cannot earn points without RT');
game.step(s,1/60,player(1),{},options);assert(s.score1>=40,'RT on selected lane should score');
const after=s.score1;game.step(s,1/60,player(1),{},options);assert.equal(s.score1,after,'holding trigger must not repeat tap');
let bad=makeNote();bad.rhythm.lanes[0]=3;
game.step(bad,1/60,player(1),{},options);assert.equal(bad.score1,0,'wrong lane cannot score');
let hold=makeNote('hold');game.step(hold,1/60,player(1),{},options);assert.equal(hold.score1,0);
for(let i=0;i<34;i++)game.step(hold,1/60,player(1),{},options);
assert(hold.score1>=180,'long note must score only after sustained RT');assert.equal(hold.rhythm.miss[0],0);
let broken=makeNote('hold');game.step(broken,1/60,player(1),{},options);game.step(broken,1/60,player(0),{},options);
assert.equal(broken.rhythm.miss[0],1,'early trigger release must break hold');
let other=makeNote();other.rhythm.lanes[0]=1;other.rhythm.lanes[1]=1;
game.step(other,1/60,{human1:true,human2:true,p1:{rt:1,x:0},p2:{rt:1,x:0}},{},options);
assert(other.score1>0&&other.score2>0,'two controllers must judge separately');
// Legacy catcher still operates without RT and does not leak rhythm state.
let classic=game.create();classic.spawn=999;classic.notes=[{x:.32,y:.816,vy:.15,type:'normal'}];
game.step(classic,1/60,player(0),{},{rhythmMode:'catcher'});assert(classic.score1>0,'classic catcher was regressed');
// AI exhibition for a simulated long session; memory, note counts and scores
// must remain bounded. This does not certify physical Deck renderer FPS.
let demo=game.create();const ai={human1:false,human2:false,p1:{x:0,rt:0},p2:{x:0,rt:0}};
for(let i=0;i<18000;i++){game.step(demo,1/60,ai,{beat:.5},options);
 if(i%900===0){assert(demo.rhythm.notes.length<=18,'note count unbounded');assert(Number.isFinite(demo.score1)&&Number.isFinite(demo.score2));}}
assert(demo.rhythm.total>10,'AI demonstration did not generate a meaningful rhythm sequence');
const operations=[];const fakeD={};for(const key of ['c','r','l','t','ring','p'])fakeD[key]=(...args)=>{
 operations.push([key,...args]);for(const value of args)if(typeof value==='number')assert(Number.isFinite(value),'draw must not receive invalid coordinates');};
for(let k=0;k<35;k++){game.step(demo,1/60,ai,{beat:.3},options);game.draw(demo,fakeD,ai,{beat:.3},options);}
assert(operations.length>200,'four-lane mode did not draw enough real objects');
assert(bundle.includes("id:'rhythmMode',label:'Rhythm gameplay'"),'no accessible rhythm mode setting');
assert(bundle.includes("MindballAwareness"),'Mindball tactical awareness missing from Quick Menu');
console.log('PASS Piano Lanes controller tap / accurate judgment / held note / early release / local multiplayer / classic preservation / bounded AI exhibition');

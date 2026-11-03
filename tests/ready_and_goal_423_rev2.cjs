'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const controller=fs.readFileSync(path.join(root,'src/visualizer-behaviors/controller-418.js'),'utf8');
let clock=0;
const controllerObj={Math,Date,Map,performance:{now:()=>clock},navigator:{getGamepads:()=>pads}};
const mkpad=(index)=>({id:'PlayStation Controller'+index,connected:true,axes:[0,0,0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))});
let pads=[mkpad(0),mkpad(1)];
vm.createContext(controllerObj);
vm.runInContext(controller+'\nthis.read=gtm418ReadPlayers;',controllerObj);
const setMode=mode=>({homeReactiveVisualizerArcadeMode:mode,homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1});
const read=(s,key='test-arena')=>controllerObj.read(s,['ai_ai','player_ai','player_player','solo'],key);
let current=read(setMode('ai_ai'));
assert.equal(current.paused,false);assert.equal(current.mode,'ai_ai');
console.log('PASS AI demo starts immediately');
pads[0].buttons[3].pressed=true;clock=10;read(setMode('ai_ai'));clock=850;
current=read(setMode('ai_ai'));assert.equal(current.requested,'player_ai');assert.equal(current.readyWaiting,true);
assert.equal(current.paused,true);assert.equal(current.manualPaused,false);
console.log('PASS hold Triangle/Y joins AI demo and does not trigger pause');
pads[0].buttons[3].pressed=false;clock=930;read(setMode('ai_ai'));
pads[0].axes[3]=.85;clock=1300;current=read(setMode('ai_ai'));
assert.equal(current.readySeconds,15);assert.equal(current.paused,true);
clock=15500;current=read(setMode('ai_ai'));assert(current.readySeconds>=1&&current.paused);
clock=16350;current=read(setMode('ai_ai'));assert.equal(current.readySeconds,0);assert.equal(current.paused,false);
console.log('PASS 15-second human-ready countdown and music-independent gameplay resume');
clock=20000;pads[0].axes[3]=0;
current=read(setMode('player_player'),'pvp');
assert.equal(current.requested,'ai_ai');assert.equal(current.paused,false);
// Selection alone is not a join. Both pads must intentionally hold Triangle.
pads[0].buttons[3].pressed=true;clock=20020;read(setMode('player_player'),'pvp');
clock=20860;current=read(setMode('player_player'),'pvp');assert(current.readyWaiting&&current.paused);
pads[0].buttons[3].pressed=false;clock=20900;read(setMode('player_player'),'pvp');
pads[1].buttons[3].pressed=true;clock=20930;read(setMode('player_player'),'pvp');
clock=21780;current=read(setMode('player_player'),'pvp');assert.equal(current.requested,'player_player');assert(current.readyWaiting);
pads[1].buttons[3].pressed=false;clock=21840;read(setMode('player_player'),'pvp');
pads[1].axes[2]=.81;clock=22200;current=read(setMode('player_player'),'pvp');assert.equal(current.readySeconds,15);
clock=37400;current=read(setMode('player_player'),'pvp');assert.equal(current.paused,false);
console.log('PASS saved two-player preference stays in AI demo until intentional Triangle joins and right-stick ready-up');

const text=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const a=text.indexOf('function gtm413PongCreate('),b=text.indexOf("gtm417RegisterArcadeGame('neon_pong'",a);
const context={Math,Date,GTM414_PONG_POOL:new Map(),gtm414PongSignature:()=> 'goal-test',
 gtm413PongRandom:()=>.5,gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
 gtm414PongPickColors:()=>['#64ed8b','#ffad54'],gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
 gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),gtm418ConsumeMenuAction:()=>0,
 GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#ff9255'},plasma:{rgb:'#fc8fff'}}};
vm.createContext(context);vm.runInContext(text.slice(a,b)+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep,goalDraw:gtm423DrawGoalCelebration};',context);
const env={settings:{homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongFxLevel:'high'},arcade:{left:{human:false},right:{human:false}},beat:0};
let s=context.api.create(env);s.serve=0;s.ball={x:.969,y:.50,vx:.6,vy:0};s.goalLane='left';
context.api.step(s,1/60,env);
assert(s.goalHold>.7&&s.goalCelebration?.side==='left');
assert.equal(s.scoreLeft,0);
const clockBefore=s.matchElapsed;
for(let i=0;i<20;i++)context.api.step(s,1/90,env);
assert.equal(s.scoreLeft,0);assert.equal(s.matchElapsed,clockBefore);
for(let i=0;i<60;i++)context.api.step(s,1/90,env);
assert.equal(s.scoreLeft,1);assert(s.goalCelebration);
const ops={texts:[],arcs:0,strokes:0};
const c={save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){ops.strokes++},arc(){ops.arcs++},fill(){},fillText(t){ops.texts.push(t)}};
context.api.goalDraw(s,c,1280,230,1,['#64ed8b','#ffad54'],75,224,'high');
assert(ops.texts.some(t=>t==='GOAL!'));assert(ops.texts.some(t=>t.includes('SCORES')));assert(ops.arcs>=2);
for(let i=0;i<110;i++)context.api.step(s,1/90,env);
assert.equal(s.scoreLeft,1,'Goal must be awarded exactly once');
assert.equal(s.goalCelebration,null,'Goal visuals must not leak into later gameplay');
console.log('PASS cinematic goal freeze, visible score feedback, bounded FX lifetime, and single scoring');

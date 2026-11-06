'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const text=fs.readFileSync(__dirname+'/src/visualizer-behaviors/runtime-414.js','utf8');
const a=text.indexOf('function gtm413PongCreate('),b=text.indexOf('function gtm413PongDraw(',a);
const block=text.slice(a,b);
const pool=new Map();
const ctx={Math,Date,GTM414_PONG_POOL:pool,gtm414PongSignature:()=> 'test',
  gtm413PongRandom:()=>.5,gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
  gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
  gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),
  gtm418ConsumeMenuAction:()=>0,GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#fff'}}};
vm.createContext(ctx);
vm.runInContext(block+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep};',ctx);
const settings={homeReactiveVisualizerPongMode:'classic',homeReactiveVisualizerPongDifficulty:'balanced',homeReactiveVisualizerPongGoal:7};
const env={settings,arcade:{left:{human:0},right:{human:0}},beat:0};
const state=ctx.api.create(env);
state.ball={x:.145,y:.24,vx:-.6,vy:0};state.left=.77;state.right=.77;state.serve=0;
for(let i=0;i<6;i++)ctx.api.step(state,1/90,env);
assert.equal(state.scoreRight,0,'ball not scored after leaving paddle');
assert.equal(state.goalLane,'right','ball is behind left paddle');
for(let i=0;i<18;i++)ctx.api.step(state,1/90,env);
assert.equal(state.scoreRight,0,'ball must reach rear goal line and hold before scoring');
assert(state.goalHold>0,'goal event creates brief impact freeze');
for(let i=0;i<70;i++)ctx.api.step(state,1/90,env);
assert.equal(state.scoreRight,1,'right awarded one point after rear-goal impact');
assert.equal(state.goalLane,'','goal lane cleared after score');
console.log('PASS Pong miss travels behind paddle to rear goal, local impact freeze, point awarded exactly once');
assert(text.includes('s.cooldownLeft=Math.max(')&&text.includes('s.cooldownRight=Math.max('));
assert(text.includes('RB READY')&&text.includes('POWER RECHARGING'));
assert(text.includes("'PLAYER 1':'PLAYER 2'"));
console.log('PASS independent player cooldowns, readable power-state labels, player identity labels');

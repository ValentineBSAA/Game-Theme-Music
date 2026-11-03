'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const text=fs.readFileSync(__dirname+'/../src/visualizer-behaviors/runtime-414.js','utf8');
const a=text.indexOf('function gtm413PongCreate('),b=text.indexOf('function gtm413PongDraw(',a);
const ctx={Math,Date,GTM414_PONG_POOL:new Map(),gtm414PongSignature:()=> 'test',
 gtm413PongRandom:()=>.5,gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
 gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
 gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),gtm418ConsumeMenuAction:()=>0,
 GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#fff'}}};
vm.createContext(ctx);vm.runInContext(text.slice(a,b)+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep};',ctx);
const human={human:true,y:0,lb:0,rb:0,xbtn:0,ybtn:0,lt:0,rt:0};
const computer={...human,human:false};
const run=(button,offset)=>{
 ctx.GTM414_PONG_POOL.clear();
 const env={settings:{homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'balanced',homeReactiveVisualizerPongGoal:7},arcade:{left:{...human,[button]:1},right:computer},beat:0};
 const s=ctx.api.create(env);s.serve=0;s.left=.5;s.right=.5;
 s.ball={x:.138,y:.5+offset,vx:-.62,vy:0};
 ctx.api.step(s,1/60,env);
 return s;
};
const power=run('rb',0);
assert(power.ball.vx>.8,'RB Power Shot did not noticeably accelerate ball on return');
assert(power.cooldownLeft>3.8,'RB power failed to enter cooldown');
assert.equal(power.powerShotLeft,0,'RB power stayed armed after use');
console.log('PASS Pong RB Power Shot returns faster ball, consumes power');
const shield=run('lb',.24);
assert(shield.ball.vx>0,'LB shield did not recover a missed paddle shot');
assert(Math.abs(shield.ball.vy)>.12,'LB shield did not redirect trajectory');
assert.equal(shield.shieldLeft,0,'LB shield was not consumed after deflection');
assert(shield.shieldCooldownLeft>2.8,'LB shield did not enter independent cooldown');
console.log('PASS Pong LB Shield deflects missed shots, consumes shield');

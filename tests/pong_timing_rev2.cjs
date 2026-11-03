'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/../src/visualizer-behaviors/runtime-414.js','utf8');
const begin=src.indexOf('function gtm413PongCreate('),end=src.indexOf('function gtm413PongDraw(',begin);
let chance=.5;
const ctx={Math,Date,GTM414_PONG_POOL:new Map(),gtm414PongSignature:()=> 'rev2',
 gtm413PongRandom:()=>chance,gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
 gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
 gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),gtm418ConsumeMenuAction:()=>0,
 GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#fff'}}};
vm.createContext(ctx);vm.runInContext(src.slice(begin,end)+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep};',ctx);
const human={human:true,y:0,lb:0,rb:0,xbtn:0,ybtn:0,lt:0,rt:0};
const bot={...human,human:false};
const config={homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongDifficulty:'expert'};
function fresh(controls){ctx.GTM414_PONG_POOL.clear();const env={settings:config,arcade:controls,beat:0,lo:0,hi:0};const s=ctx.api.create(env);s.serve=0;s.ball={x:.138,y:.50,vx:-.62,vy:0};s.left=.5;s.right=.5;return {env,s};}
{
 const {env,s}=fresh({left:{...human,rb:1},right:bot});ctx.api.step(s,1/60,env);
 assert(s.ball.vx>.75,'Pre-contact RB must arm/boost on actual paddle return');
 assert(s.cooldownLeft>3,'Successful RB consumes its cooldown');
 assert(s.powerShotLeft===0,'Power shot must be consumed on return');
 console.log('PASS RB before contact boosts only that return');
}
{
 const {env,s}=fresh({left:{...human,rb:1},right:bot});s.ball={x:.26,y:.50,vx:.5,vy:0};
 ctx.api.step(s,1/60,env);
 assert.equal(s.cooldownLeft,0,'RB after return must NOT consume a charge');
 assert.equal(s.powerShotLeft,0,'RB after return must NOT arm a shot');
 assert(s.ball.vx<.55,'RB after return must NOT accelerate outgoing ball');
 assert(s.abilityMessage.includes('TOO LATE'));
 console.log('PASS RB cannot affect an already returned ball');
}
{
 chance=0;const {env,s}=fresh({left:bot,right:bot});s.ball={x:.22,y:.59,vx:-.5,vy:0};s.serve=0;s.shieldCooldownLeft=0;
 ctx.api.step(s,1/60,env);assert(s.shieldLeft>0,'Extreme AI did not strategically arm its shield');
 console.log('PASS expert AI uses deflection shield on incoming shot');
}
console.log('PASS Pong timing and AI power tests');

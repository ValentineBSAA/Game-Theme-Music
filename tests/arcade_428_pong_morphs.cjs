'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync(__dirname+'/../src/visualizer-behaviors/runtime-414.js','utf8');
const start=src.indexOf('const GTM428_PONG_MORPHS='),end=src.indexOf('function gtm413PongDraw(',start);
assert(start>0&&end>start);
const ctx={Math,Date,GTM414_PONG_POOL:new Map(),gtm413PongRandom:()=>0,
 gtm414PongRecord:s=>({match:s.match,winner:s.winner,left:s.scoreLeft,right:s.scoreRight}),
 gtm417ArcadeDelay:()=>1.5,gtm417ArcadeBeginTransition:s=>{s.gameOver=1.5},gtm417ArcadeAdvanceTransition:()=>false,
 gtm418ReadPlayers:()=>({left:{human:0},right:{human:0}}),gtm418ConsumeMenuAction:()=>0,
 GTM413_POWER_NAMES:['fire'],GTM413_EFFECTS:{fire:{rgb:'#fff'}},
 GTM414_PONG_PALETTES:{red_blue:['#ff6677','#6677ff']}};
vm.createContext(ctx);vm.runInContext(src.slice(start,end)+'\nthis.api={create:gtm413PongCreate,step:gtm413PongStep,morph:gtm428PongMorph,isMorph:gtm428PongIsMorph};',ctx);
const idle={human:false,y:0,lb:0,rb:0,xbtn:0,ybtn:0,lt:0,rt:0};
const human={...idle,human:true};
function setup(mode,settings={}){
 ctx.GTM414_PONG_POOL.clear();
 const env={settings:{homeReactiveVisualizerPongMode:mode,homeReactiveVisualizerPongDifficulty:'hard',homeReactiveVisualizerPongGoal:7,...settings},arcade:{left:{...human},right:{...idle}},beat:0};
 const s=ctx.api.create(env);s.serve=0;s.ball={x:.50,y:.53,vx:-.40,vy:0};return {env,s};
}
{
 const {env,s}=setup('morph');env.arcade.left.lb=1;
 ctx.api.step(s,1/60,env);
 assert.equal(s.morphLeft,'fortress');assert(s.morphTimeLeft>2.9);assert(s.morphCdDefenseLeft>19);
 env.arcade.left.lb=0;
 s.ball={x:.139,y:.85,vx:-.60,vy:0};s.serve=0;
 ctx.api.step(s,1/60,env);
 assert(s.ball.vx>0,'Fortress must block high shots that miss normal paddle');
 assert(s.morphTimeLeft>0,'Fortress must remain available for multiple blocks');
 assert.equal(ctx.api.morph(s,'left','attack','thunder'),false,'Morphs must not stack while active');
 console.log('PASS Fortress expands collision, lasts through shots, and enforces 20s cooldown');
}
{
 const {env,s}=setup('morph',{homeReactiveVisualizerPongAttackMorph:'cryo'});
 env.arcade.left.rb=1;ctx.api.step(s,1/60,env);
 assert.equal(s.morphLeft,'cryo');assert(s.morphCdAttackLeft>13);
 console.log('PASS RB attack morph accepts selected loadout and independent cooldown');
}
{
 const {env,s}=setup('mindball');s.ball={x:.51,y:.45,vx:.33,vy:0};
 ctx.api.step(s,1/60,env);
 assert.equal(s.ball.vx,.33,'Mindball should not alter horizontal velocity');
 assert(Math.abs(s.ball.vy)<.005,'Mindball adjustment must be gradual');
 const v=s.ball.vy;ctx.api.step(s,1/60,env);
 assert(Math.abs(s.ball.vy-v)<.005);
 s.ball={x:.94,y:.55,vx:.3,vy:.1};ctx.api.step(s,1/60,env);
 assert(Math.abs(s.ball.vy-.1)<1e-6,'Mindball must stop steering near goal');
 console.log('PASS Mindball is bounded, gradual, and does not steer near goals');
}
{
 const {env,s}=setup('morph');env.arcade.left=idle;env.arcade.right=idle;
 s.ball={x:.22,y:.84,vx:-.45,vy:0};s.left=.5;
 ctx.api.step(s,1/60,env);
 assert.equal(s.morphLeft,'fortress','AI must deploy a morph when a miss is imminent');
 console.log('PASS AI can select a defensive morph against a predicted miss');
}

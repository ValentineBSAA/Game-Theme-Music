'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');const source=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const ship=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
for(const [start,end] of [['function gtm428PongMindBall(', 'function gtm414PongSignature('],['function gtm430PongAdaptiveBrain(', 'function gtm413PongStep(']]){
 const extract=s=>s.slice(s.indexOf(start),s.indexOf(end));assert.equal(extract(source),extract(ship),'Pong source != bundle');
}
const context={Math,console,gtm418ReadPlayers:()=>({left:{human:false},right:{human:false},paused:false}),gtm418DrawSessionStatus(){},gtm418ConsumeMenuAction:()=>false};
vm.createContext(context);vm.runInContext(source+'\nthis.game=GTM413_BEHAVIORS.get("neon_pong");this.pool=GTM414_PONG_POOL;this.steer=gtm428PongMindBall;this.brain=gtm430PongAdaptiveBrain;',context);
function newGame(mode,modifier){context.pool.delete('championship');const settings={homeReactiveVisualizerPongMode:mode,homeReactiveVisualizerPongMindballModifier:modifier,homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerPongGoal:11,homeReactiveVisualizerPongMindballStrength:'standard'};
 const env={settings,beat:0,lo:0,hi:0,arcade:{human1:false,human2:false,left:{human:false},right:{human:false}}};const s=context.game.create(env);s.serve=0;s.goalHold=0;s.gameOver=0;s.ball={x:.5,y:.5,vx:.34,vy:0};s.mindTimer=0;return {s,env};}
// Default OFF, Classic never gets Mindball. Enabling for Morph preserves active rally.
for(const [mode,mod,expected] of [['classic',true,false],['morph',false,false],['morph',true,true],['power',true,true],['competitive',true,true],['mindball',false,true],['chaos',false,true]]){
 const {s,env}=newGame(mode,mod);context.game.step(s,1/60,env);assert.equal(s.mindActive,expected,`${mode} modifier ${mod} mindActive incorrect`);
 assert(Number.isFinite(s.ball.x)&&Number.isFinite(s.ball.y));
}
let {s,env}=newGame('morph',false);s.scoreLeft=3;s.scoreRight=2;context.game.step(s,1/60,env);
env.settings.homeReactiveVisualizerPongMindballModifier=true;context.game.step(s,1/60,env);
assert(s.mindActive&&s.scoreLeft===3&&s.scoreRight===2,'live modifier change incorrectly reset score');
const createMind=()=>({ball:{x:.5,y:.5,vx:.4,vy:0},left:.5,right:.75,goalLane:'',mindTimer:0,mindCue:0});
let weak=createMind(),strong=createMind();const subtle={homeReactiveVisualizerPongMindballStrength:'subtle',homeReactiveVisualizerPongMindballPersonality:'hunter'}, powerful={homeReactiveVisualizerPongMindballStrength:'strong',homeReactiveVisualizerPongMindballPersonality:'hunter'};
for(let i=0;i<25;i++){context.steer(weak,1/60,subtle);context.steer(strong,1/60,powerful);}
assert(Math.abs(strong.ball.vy)>Math.abs(weak.ball.vy),'strong Mindball should turn faster');
assert.equal(strong.ball.vx,.4,'Mindball cannot change horizontal velocity');
for(const personality of ['curious','hunter','trickster','survivor','adaptive']){
 let st=createMind();for(let i=0;i<100;i++)context.steer(st,1/60,{homeReactiveVisualizerPongMindballStrength:'strong',homeReactiveVisualizerPongMindballPersonality:personality});
 assert(Number.isFinite(st.ball.vy)&&Math.abs(st.ball.vy)<=.48,`${personality} turn is unsafe`);
 st.ball.x=.9;const old=st.ball.vy;context.steer(st,1/60,{homeReactiveVisualizerPongMindballPersonality:personality});assert.equal(st.ball.vy,old,`${personality} steered near goal`);
}
let profiles=[];for(const style of ['relaxed','balanced','challenging']){
 const stats={scoreLeft:0,scoreRight:0};const human={left:{human:true},right:{human:false},adaptiveStyle:style};
 for(let i=0;i<5;i++){stats.scoreLeft++;for(let j=0;j<100;j++)context.brain(stats,1/60,human);}
 profiles.push(stats.adaptiveSkill);
}
assert(profiles[0]<profiles[1]&&profiles[1]<profiles[2],`AI styles not ordered ${profiles}`);
const demo={scoreLeft:0,scoreRight:0};for(const style of ['relaxed','balanced','challenging'])context.brain(demo,1/60,{left:{human:false},right:{human:false},adaptiveStyle:style});assert.equal(demo.adaptiveSkill,.70,'demo cannot be handicapped by adaptive style');
for(const key of ['homeReactiveVisualizerPongMindballModifier','homeReactiveVisualizerPongMindballPersonality','homeReactiveVisualizerPongMindballStrength','homeReactiveVisualizerArcadeAdaptiveStyle'])assert(ship.includes(key),'Quick Access is missing '+key);
assert(ship.includes("'gtm434-adaptive-style'"),'Adaptive style not exposed in overview');
assert(ship.includes('MindballModifier|MindballStrength|MindballPersonality'),'Mindball settings hidden');
console.log('PASS 4.3.4: Mindball modifier, Classic preservation, live score, all steering personalities, strength fairness, Adaptive style ordering, AI demo stability, Quick Menu visibility');

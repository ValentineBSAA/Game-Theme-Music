'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bundled=read('dist/index.js');
function segment(text,start,end){const a=text.indexOf(start),b=text.indexOf(end,a+start.length);assert(a>=0&&b>a,`missing ${start}`);return text.slice(a,b);}
function parity(file,start,end){const a=segment(read('src/visualizer-behaviors/'+file),start,end),b=segment(bundled,start,end);assert.equal(a,b,`shipped code mismatch: ${file}`);return a;}
// The couch overlay covers the whole canvas, not a small unreadable strip.
const controller=parity('controller-418.js','function gtm418DrawSessionStatus(', '\n}')+'\n}';
let draw=[];
const ctx=new Proxy({save(){draw.push(['save']);},restore(){draw.push(['restore']);},fillRect(...x){draw.push(['fillRect',...x]);},strokeRect(...x){draw.push(['strokeRect',...x]);},fillText(...x){draw.push(['fillText',...x]);}},{get:(t,k)=>k in t?t[k]:()=>{}});
const box={Math};vm.createContext(box);vm.runInContext(controller+'\nthis.overlay=gtm418DrawSessionStatus;',box);
for(const ready of [{readyWaiting:true,readySeconds:0,status:'WAITING FOR PLAYERS'},{readyWaiting:false,readySeconds:9,status:'GET READY · 9'}]){
 draw=[];box.overlay(ctx,1000,500,{...ready,key:'neon_pong',manualPaused:false,countdown:0});
 assert(draw.some(x=>x[0]==='fillRect'&&x[1]===0&&x[2]===0&&x[3]===1000&&x[4]===500),'ready-up not full-screen');
 assert(draw.some(x=>x[0]==='fillText'&&String(x[1]).includes('MOVE RIGHT STICK')));
 assert(draw.some(x=>x[0]==='fillText'&&String(x[1]).includes('AI MATCH CONTINUES')));
 assert.equal(draw.filter(x=>x[0]==='save').length,draw.filter(x=>x[0]==='restore').length);
}
console.log('PASS full-screen legible ready-up in wait/countdown without gameplay state mutation');
// Mindball changes course only in steering zone and explicitly signals active.
const source=read('src/visualizer-behaviors/runtime-414.js');
const minds=parity('runtime-414.js','function gtm428PongMindBall(', 'function gtm414PongSignature(');
const mindContext={Math,gtm413PongRandom:()=>.5};vm.createContext(mindContext);
const predictor=parity('runtime-414.js','function gtm413PongPredict(', 'function gtm413PongServe(');
vm.runInContext(predictor+minds+'\nthis.steer=gtm428PongMindBall;',mindContext);
let state={ball:{x:.5,y:.5,vx:.4,vy:0},left:.5,right:.75,goalLane:'',mindTimer:0,mindCue:0};
mindContext.steer(state,1/60);assert.equal(state.mindActive,true);assert(state.ball.vy!==0);
state.ball.x=.84;state.mindActive=false;let prev=state.ball.vy;mindContext.steer(state,1/60);
assert.equal(state.ball.vy,prev,'Mindball steers near goal');assert(!state.mindActive);
assert(bundled.includes("circle(x,y,r*1.13,mindVisual?'#ffdf36'"),'active yellow ball missing from shipped draw');
console.log('PASS Mindball changes course in bounded zone, no late goal-line steering, yellow core in renderer');
// Human pressing a recharging morph must get a reason. AI failures stay silent.
const morph=parity('runtime-414.js','const GTM428_PONG_MORPHS=', 'function gtm428PongIsMorph(');
const morphCtx={Math};vm.createContext(morphCtx);vm.runInContext(morph+'\nthis.morph=gtm428PongMorph;',morphCtx);
state={left:.5,right:.5,bursts:[],powersUsed:0};
assert(morphCtx.morph(state,'left','defense','fortress',true));assert.equal(state.morphTimeLeft,3);
state.abilityMessage='';assert(!morphCtx.morph(state,'left','defense','fortress',true));assert.equal(state.abilityMessage,'MORPH ALREADY ACTIVE');
state.morphTimeLeft=0;state.abilityMessage='';assert(!morphCtx.morph(state,'left','defense','fortress',true));assert(state.abilityMessage.includes('RECHARGING'));
state.abilityMessage='';assert(!morphCtx.morph(state,'left','defense','fortress'));assert.equal(state.abilityMessage,'','AI failed ability should not spam messages');
console.log('PASS human Morph Battle clearly identifies active and recharging abilities');
// Non-Pong adaptive profile must derive performance from game outcomes, NOT stick movement.
const adaptive=parity('arcade-421.js','const G423_AI_MODES=', 'function g423AIApproach(');
const c={Math,snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'adaptive'},g421Clamp:(x,a,b)=>Math.max(a,Math.min(b,x))};vm.createContext(c);
vm.runInContext(adaptive+'\nthis.ai=g423AIDifficulty;',c);
const players={human1:true,human2:false,p1:{x:0},p2:{x:0}};
function evolve(s,id,update){for(let i=0;i<6;i++){if(update)update(i);c.ai(s,players,7,'adaptive',id);}return s.aiSkill;}
let beat={score1:0,score2:0,misses:0};let easy=evolve(beat,'world_arcade_beat_catcher',()=>{beat.misses+=3;});
assert(easy<.59,`many missed notes should reduce AI difficulty: ${easy}`);
let better={score1:0,score2:0,misses:0};let harder=evolve(better,'world_arcade_beat_catcher',()=>{better.score1+=350;});
assert(harder>easy,`more successful notes should increase skill (${harder} vs ${easy})`);
let base={base:12,kills:0};let support=evolve(base,'world_arcade_orbit_defenders',()=>{base.base=Math.max(1,base.base-2);});
assert(support>.66,'friendly AI should defend harder when base is threatened');
let demo={score1:0,score2:0,misses:50};const demoSkill=c.ai(demo,{human1:false,human2:false},7,'adaptive','world_arcade_beat_catcher');assert.equal(demoSkill,.68);
console.log('PASS AI adapts to actual outcomes; failing rhythm gets easier, threatened co-op base gets support, AI exhibition stable');
// Long notes take sustained correct positioning, not a single contact.
const program=parity('arcade-421.js','const GTM421_CATCHER=', '// Cooperative space defense:');
const gamesCtx={Math, g421Base:()=>({seed:7,elapsed:0,score:0,wave:1,over:0,wait:0,needInput:false,ready:true,particles:[]}),
 g423UsePower:()=>false,g423PowerActive:()=>false,g421Random:()=>.93,g421Controls:()=>{},g423AIApproach:()=>.5,
 g423ArenaBackdrop:()=>{},g421Hud:()=>{},g423PowerHud:()=>{}};
vm.createContext(gamesCtx);vm.runInContext(program+'\nthis.catchGame=GTM421_CATCHER;',gamesCtx);
const game=gamesCtx.catchGame;
const inputs={p1:{x:0},p2:{x:0},human1:true,human2:true,mode:'player_player'};
let catchState=game.create();catchState.spawn=999;
catchState.notes=[{x:.32,y:.816,vy:.15,type:'hold',duration:.45,holdLeft:.45,holder:-1}];
for(let i=0;i<12;i++)game.step(catchState,1/60,inputs,{},{});
assert.equal(catchState.notes.length,1,'long note was completed instantly');assert.equal(catchState.score1,0);
for(let i=0;i<23;i++)game.step(catchState,1/60,inputs,{},{});
assert.equal(catchState.notes.length,0);assert(catchState.score1>40);assert.equal(catchState.misses,0);
let dropped=game.create();dropped.spawn=999;dropped.notes=[{x:.32,y:.816,vy:.15,type:'hold',duration:.45,holdLeft:.45,holder:-1}];
game.step(dropped,1/60,inputs,{},{});dropped.ships[0].x=.7;game.step(dropped,1/60,inputs,{},{});
assert.equal(dropped.misses,1,'abandoning a hold should count as a miss');
console.log('PASS Beat Catcher long note requires sustained position and fails on release');

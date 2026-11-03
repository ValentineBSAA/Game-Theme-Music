'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
let mode={side:'left',mode:'ai_ai',requested:'ai_ai',human1:false,human2:false,paused:false,joinEpoch:0,
 left:{x:0,y:0,rb:0},right:{x:0,y:0,rb:0}};
const box={console,Math,snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'adaptive'},gtm418ReadPlayers:()=>mode,
 gtm418ProgramOptionValue:()=>1,gtm418DrawSessionStatus(){} };
vm.createContext(box);
vm.runInContext(src+'\nthis.api={games:GTM421_GAMES,render:gtm421DrawArcade,pools:GTM421_INSTANCE_POOLS}',box);
const {games,render,pools}=box.api;
const ctx={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},closePath(){},fillText(){}};
const manifest=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/manifest.json')));
const scene=manifest.scenes.find(s=>s.id==='world_arcade_neon_drift_circuit');
assert(scene);
const canvas={};
for(let i=0;i<240;i++)render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.4},1280,220);
const prior=pools.get(canvas).get(scene.id).state;
assert(prior.elapsed>3,'AI demo did not progress');
mode={...mode,requested:'player_ai',mode:'player_ai',human1:true,paused:true,joinEpoch:1,
 left:{x:1,y:-1,rb:0},right:{x:0,y:0,rb:0}};
render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.4},1280,220);
const newState=pools.get(canvas).get(scene.id).state;
assert.notEqual(newState,prior,'human join must start a fresh match');
assert.equal(newState.elapsed,0,'fresh match must wait for the ready countdown');
assert.equal(newState.cars[0].laps,0);
mode={...mode,paused:false};
for(let i=0;i<35;i++)render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.4},1280,220);
assert(newState.elapsed>0,'fresh race never resumed');
// Releasing a slot back to AI does not reset the round.
mode={...mode,requested:'ai_ai',mode:'ai_ai',human1:false,paused:false,joinEpoch:1};
render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.4},1280,220);
assert.equal(pools.get(canvas).get(scene.id).state,newState,'AI handoff reset an active match');
console.log('PASS fresh match on human join, countdown freeze, and in-progress AI handoff');
// Full five-heat championship completes in AI demo without stalled progression.
const race=games.world_arcade_neon_drift_circuit,s=race.create(),seenHeats=new Set();
const ai={p1:{x:0,y:0},p2:{x:0,y:0},human1:false,human2:false,mode:'ai_ai'};
for(let i=0;i<60*230;i++){
 race.step(s,1/60,ai,{low:.4,beat:.3},{});
 seenHeats.add(s.heat);
 assert(s.hazards.length<=18);
 assert(s.cars.length===2);
 for(const car of s.cars){assert(car.speed>=0&&Number.isFinite(car.speed));assert(Math.abs(car.lane)<=.981);}
}
assert.equal(seenHeats.size,5,'racing does not cycle through five circuits');
assert(s.race>=2,'racing championship never finishes and resets');
console.log('PASS 5-track championship cycles and bounded racer physics');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'))),plugin=JSON.parse(fs.readFileSync(path.join(root,'plugin.json')));
assert.equal(pkg.version,'4.2.5');assert.equal(plugin.version,'4.2.5');
assert(bundle.includes("homeReactiveVisualizerArcadeDifficulty: 'adaptive'"));
assert(bundle.includes("homeReactiveVisualizerPongDifficulty: 'adaptive'"));
assert(bundle.includes('gtm425OpenArcadeLibrary(gameChoices,selectedGame,activate)'));
assert(!bundle.includes("['world_arcade_prism_bastion','Prism Bastion']"));
assert(bundle.includes("GTM414_PONG_POOL.delete('championship')"));
assert(bundle.includes('update-ambient-wake-grace-skipped'));
assert(bundle.includes('update-stream-adoption-timeout'));
console.log('PASS defaults, no obsolete picker, responsive library and continuity guard linked');
// Prove timeout path resolves and emits diagnostics when RPC hangs.
const start=bundle.indexOf('async function gtmAdoptContinuityStreamEndpoint() {');
const end=bundle.indexOf('// Desktop Mode is a hard playback boundary',start);
assert(start>=0&&end>start);
let timer=0,events=[];
const state={rebinding:true};
const source=bundle.slice(start,end);
const ctx2={console,Promise,Boolean,Number,String,Date,URL,
 gtmContinuityWindow:()=>({continuity:state}),GTM_UPDATE_CONTINUITY_KEY:'continuity',
 audioEngine:{getSnapshot:()=>({url:'http://127.0.0.1:45721/audio/token123/music.mp3'})},
 call:()=>new Promise(()=>{}),
 setTimeout:fn=>{timer=1800;queueMicrotask(fn);return 1;},
 pushNavigationTrace:(event,data)=>events.push([event,data])};
vm.createContext(ctx2);vm.runInContext(source+'\nthis.adopt=gtmAdoptContinuityStreamEndpoint',ctx2);
ctx2.adopt().then(ok=>{
 assert.equal(ok,false);assert.equal(timer,1800);assert.equal(state.rebinding,false);
 assert(events.some(([event])=>event==='update-stream-adoption-timeout'));
 console.log('PASS pending stream adoption times out safely with diagnostic');
}).catch(e=>{console.error(e);process.exitCode=1;});

'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
let mode={side:'left',mode:'ai_ai',requested:'ai_ai',human1:false,human2:false,paused:false,joinEpoch:0,
 left:{x:0,y:0,rb:0},right:{x:0,y:0,rb:0}};
const box={console,Math,snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'adaptive'},gtm418ReadPlayers:()=>mode,
 gtm418ProgramOptionValue:()=>1,gtm418DrawSessionStatus(){} };
vm.createContext(box);
vm.runInContext(src+'\nthis.api={games:GTM421_GAMES,race:GTM425_RACING,render:gtm421DrawArcade,pools:GTM421_INSTANCE_POOLS}',box);
const {games,render,pools}=box.api;
const ctx={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},closePath(){},fillText(){}};
const manifest=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/manifest.json')));
const scene=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/retired-neon-drift-circuit.json')));
assert(!manifest.scenes.some(s=>s.id===scene.id),'rejected racing game must not ship as playable');
// User-reported racing game is retired: no trusted renderer can start it.
const canvas={};
assert.equal(render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.4},1280,220),false,
 'retired racer accidentally became playable after an update');
assert(!pools.get(canvas),'retired renderer must allocate no game state');
console.log('PASS rejected racing game never starts or consumes renderer resources');
// Full five-heat championship completes in AI demo without stalled progression.
const race=box.api.race,s=race.create(),seenHeats=new Set();
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
assert.equal(pkg.version,'4.4.1');assert.equal(plugin.version,'4.4.1');
assert(bundle.includes("homeReactiveVisualizerArcadeDifficulty: 'adaptive'"));
assert(bundle.includes("homeReactiveVisualizerPongDifficulty: 'adaptive'"));
assert(bundle.includes('libraryOpen&&gameList.map'));assert(!bundle.includes("['world_arcade_neon_drift_circuit','Neon Drift Circuit']"),'retired racer must not appear in built-ins list');
assert(!bundle.includes("['world_arcade_prism_bastion','Prism Bastion']"));
assert(bundle.includes("record.joinEpoch=arcade.joinEpoch"),"joining Pong must preserve active rally instead of rebuilding championship");
assert(!bundle.includes("GTM414_PONG_POOL.delete('championship')"),"legacy join reset still present");
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

'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');const src=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
// Unlike old string-assertion-only tests, trigger the real drawing cleanup
// when the background throws before arcade game layers are reached.
const a=src.indexOf('function gtm404RenderPacked('),b=src.indexOf('function gtmRetroDraw(',a);
assert(a>0&&b>a);const code=src.slice(a,b);
let saves=0,restores=0;
const ctx={clearRect(){},fillRect(){},save(){saves++},restore(){restores++}};
const canvas={clientWidth:1280,clientHeight:400,width:0,height:0,getContext:()=>ctx};
const map=new Map([['bad',{layers:[],background:{style:'stars'}}]]);
const box={console,Math,Number,window:{devicePixelRatio:1},GTM404_PACK_SCENES:map,
 gtm409QualityScale:()=>1,gtm404FrameState:()=>({}),gtm415DrawSceneBackground:()=>{throw Error('injected scenery fault')},snapshot$1:{}};
vm.createContext(box);vm.runInContext(code+'\nthis.draw=gtm404RenderPacked;',box);
for(let i=0;i<100;i++){
 assert.throws(()=>box.draw(canvas,'bad',{},'music',{},{}),/injected scenery fault/);
 assert.equal(saves,restores,`Canvas2D stack leaked on injected exception ${i}`);
}
assert(canvas.width*canvas.height<=550000 || canvas.width*canvas.height<=1400000,'canvas bound failed');
console.log('PASS 100 injected scenery faults restore canvas state without leaks');
// Also test a failure *inside* the scenery renderer after it saves a nested state.
// Previous patch only guarded the outer save, leaving a second hidden leak.
const scenery=fs.readFileSync(path.join(root,'src/visualizer-behaviors/scenery-415.js'),'utf8');
vm.runInContext(scenery+'\nthis.originalScenery=gtm415DrawSceneBackground;',box);
const gradient={addColorStop(){}};
ctx.createLinearGradient=()=>gradient;
ctx.createRadialGradient=()=>{throw Error('injected nested gradient fault')};
box.gtm415DrawSceneBackground=box.originalScenery;
map.set('bad',{layers:[{effect:'neon_pong'}],background:{style:'storm',base:'#111111',accent:'#222222'}});
for(let i=0;i<100;i++){
 assert.throws(()=>box.draw(canvas,'bad',{},'music',{},{}),/injected nested gradient fault/);
 assert.equal(saves,restores,'nested scenery draw leaked a saved context at '+i);
}
box.gtm415DrawSceneBackground=()=>{throw Error('injected scenery fault')};
console.log('PASS 100 faults inside nested scenery restore both Canvas2D saves');

// Measure actual back-buffer pixel limits with 4K-ish couch sizes, and arcade.
map.set('bad',{layers:[{effect:'neon_pong'}],interaction:{modes:['ai_ai']}});
canvas.clientWidth=3840;canvas.clientHeight=1440;
assert.throws(()=>box.draw(canvas,'bad',{},'music',{},{}),/injected scenery fault/);
assert(canvas.width<=1000,'Arcade canvas exceeds width budget');
assert(canvas.width*canvas.height<=550000+1600,'Arcade canvas exceeds pixel budget');
console.log('PASS large couch canvas clamps Arcade to 1000px / 550k pixels');
// Exercise the pure circuit breaker: fast recoveries, repeated errors,
// sustained >42ms frames, and no false positives from occasional spikes.
const start=src.indexOf('function gtm430RenderSafetyError('),end=src.indexOf('function GtmV371HomeBottomVisualizer()',start);
assert(start>0&&end>start);vm.runInContext(src.slice(start,end)+'\nthis.fault=gtm430RenderSafetyError;this.cost=gtm430RenderSafetyCost;',box);
const fresh=()=>({failures:0,slowFrames:0,latched:false,reason:'',lastError:''});
let state=fresh();for(let i=0;i<30;i++)box.cost(state,i%7===0?55:10,true);
assert.equal(state.latched,false,'sporadic costly frames should recover');
box.fault(state,'boom1');box.fault(state,'boom2');assert.equal(state.latched,false);
state.failures=0;box.fault(state,'boom3');assert.equal(state.latched,false);
box.fault(state,'boom4');box.fault(state,'boom5');assert.equal(state.latched,true);
assert.equal(state.reason,'Repeated render exception');assert.equal(state.failures,3);
state=fresh();for(let i=0;i<15;i++)box.cost(state,60,true);
assert.equal(state.latched,true);assert.equal(state.reason,'Sustained slow Arcade rendering');
state=fresh();for(let i=0;i<200;i++)box.cost(state,60,false);
assert.equal(state.latched,false,'non-Arcade must not trip Arcade cost guard');
assert(src.includes('if(renderSafety.latched)return;'),'failed frames must not be endlessly re-rendered');
assert(src.includes("attributeFilter:['class','role','aria-hidden','aria-modal']"),'never observe every SteamUI style mutation');
console.log('PASS failure circuit breaker and slow-frame threshold; sporadic stalls recover');

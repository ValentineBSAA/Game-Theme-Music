'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const text=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const f=text.slice(text.indexOf('// Continuous wall-clock animation state:'),text.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.'));
const b=text.slice(text.indexOf('const GTM413_BEHAVIORS = new Map();'),text.indexOf('function gtm413PongRandom(s){'));
function runCadence(fps,sec=12){
 const frameSandbox={performance:{now:()=>frameSandbox.now},now:0,console};vm.createContext(frameSandbox);
 vm.runInContext(f+b+`globalThis.getFrame=gtm404FrameState; globalThis.register=gtm413RegisterBehavior; globalThis.advance=gtm413RunBehavior;`,frameSandbox);
 const state={sim:0,steps:0};frameSandbox.register('neon_pong',{create:()=>state,step(s,dt){s.sim+=dt;s.steps++},draw(){}});
 const canvas={},frame0=frameSandbox.getFrame(canvas,'pong');frameSandbox.advance('neon_pong',frame0,0,{});
 for(let i=0;i<Math.round(sec*fps);i++){
   frameSandbox.now+=(1000/fps);
   const frame=frameSandbox.getFrame(canvas,'pong');frameSandbox.advance('neon_pong',frame,0,{});
   assert(frame.pongPhysicsSteps<=24);
 }
 assert(Math.abs(state.sim-sec)<.032,`Physics must match wall time at ${fps} fps: ${state.sim} vs ${sec}`);
 return {fps,sim:state.sim,steps:state.steps};
}
const rates=[5,16,30,60,90].map(fps=>runCadence(fps));
// Cap long gaps so Deck wake/hidden tab never advances minutes of gameplay at once.
const sandbox={now:0,performance:{now(){return sandbox.now}}};vm.createContext(sandbox);
vm.runInContext(f+b+`globalThis.getFrame=gtm404FrameState;globalThis.register=gtm413RegisterBehavior;globalThis.advance=gtm413RunBehavior;`,sandbox);
const state={sim:0};sandbox.register('neon_pong',{create:()=>state,step(s,dt){s.sim+=dt},draw(){}});
const canvas={};sandbox.advance('neon_pong',sandbox.getFrame(canvas,'pong'),0,{});
sandbox.now+=5000;sandbox.advance('neon_pong',sandbox.getFrame(canvas,'pong'),0,{});
assert(state.sim<.08,'Wake stall must not simulate five seconds of ball travel');
assert(text.includes('(pongBackdrop?Math.min(frameInterval,34):125)'),'Pong silent mode should not be limited to 16fps');
assert(text.includes('pongPhysicsSteps:pongBackdrop'),'visible diagnostics needed for device investigation');
const sceneStart=text.indexOf('// GTM 4.1.5: trusted, bounded scenery renderer.');
const sceneEnd=text.indexOf('function gtm404RenderPacked(canvas,mode,data,paletteName,theme,visual){',sceneStart);
assert(sceneStart>0&&sceneEnd>sceneStart);
vm.runInNewContext(text.slice(sceneStart,sceneEnd)+'globalThis.paint=gtm415DrawSceneBackground;',sandbox);
function mock(){let n=0;let colors=new Set(),paths=0;const ctx={globalAlpha:1,
 save(){},restore(){},beginPath(){paths++},closePath(){},moveTo(){},lineTo(){},stroke(){n++},strokeRect(){n++},
 arc(){},ellipse(){},fill(){n++},fillRect(){n++;colors.add(String(this.fillStyle))},
 createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}},};
 return {ctx,read:()=>({n,paths,colors:colors.size})};}
const complexity={};
for(const style of ['solid','arcade','storm','stars','nebula','aurora','ocean','sunset','forest','city']){
 const scene={layers:[{effect:'neon_pong'}],background:{style,base:'#091526',accent:'#b2b6fc',motion:.8,density:1}};
 const fr={elapsed:11,physicsDt:1/30,sceneryQuality:.72};
 const a=mock();sandbox.paint(a.ctx,1280,200,scene,{homeReactiveVisualizerPongArena:'scene',homeReactiveVisualizerPongBgReactivity:'off'},fr,{live:false});
 const count=a.read().n;
 assert(count>=2&&count<175,`scenery ${style} must stay bounded; got ${count}`);
 complexity[style]=count;
 // Music cannot shift the animation position. With reactivity Off, musical inputs change nothing.
 const quiet=mock();const loud=mock();const quietFr={elapsed:13,physicsDt:1/60};const loudFr={elapsed:13,physicsDt:1/60};
 const set={homeReactiveVisualizerPongArena:'scene',homeReactiveVisualizerPongBgReactivity:'off'};
 sandbox.paint(quiet.ctx,1280,200,scene,set,quietFr,{live:false,low:0,mid:0,high:0,beat:0});
 sandbox.paint(loud.ctx,1280,200,scene,set,loudFr,{live:true,low:1,mid:1,high:1,beat:1});
 assert.deepEqual(quiet.read(),loud.read(),'audio Off should leave scenery unchanged for '+style);
}
assert(Object.keys(complexity).length===10);
console.log('PASS simulation 5/16/30/60/90 fps + sleep guard',rates);
console.log('PASS 10 scenery bounded ops, audio-off stability, quiet Pong cadence',complexity);

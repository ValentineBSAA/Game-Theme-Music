'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const body=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const store=body.slice(body.indexOf('class StoreController {'),body.indexOf('const storeController = new StoreController();'));
assert(store.startsWith('class StoreController {'));
assert(!store.includes('sleepSurface'),'Store controller must never use Ambient-scoped sleepSurface');
assert(!store.includes('gtm411AmbientSleepGuard.blocked(settings'),'Store audio must not be gated by Ambient sleep');
assert(store.includes('gtm414ManualTransport.blocked(STORE_OWNER,snap.trackKey)'),'Store manual pause uses Store owner');
assert(store.includes('surfaceInfo.source'),'one controller handles Steam and Plugin Store');
const ambient=body.slice(body.indexOf('class AmbientController {'),body.indexOf('const ambientController = new AmbientController();'));
assert(ambient.includes("const sleepSurface = getAmbientSurface();"));
assert(ambient.includes('gtm414ManualTransport.blocked(AMBIENT_OWNER,audioEngine.getSnapshot()?.trackKey)'));
const frame=body.slice(body.indexOf('// Continuous wall-clock animation state:'),body.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.'));
const a=body.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.');
const b=body.indexOf('function gtm404RegisterPacks(packs){',a);
assert(a>=0&&b>a);
const check=`
const assert=globalThis.assert;
// Real timer must follow 16fps wall time, despite 90Hz fixed-step physics.
let state={gameOver:0,matchElapsed:0};
gtm413RegisterBehavior('neon_pong',{create:()=>state,step(s,dt){s.matchElapsed+=dt;if(s.gameOver>0)s.gameOver=Math.max(0,s.gameOver-dt);},draw(){}});
const canvas={};let f=gtm404FrameState(canvas,'world_pong_starlight');
for(let i=0;i<60;i++) { now+=62.5;f=gtm404FrameState(canvas,'world_pong_starlight');gtm413RunBehavior('neon_pong',f,0,{}); }
assert(state.matchElapsed>3.55 && state.matchElapsed<3.82,'clock not tied to capped physics time: '+state.matchElapsed);
assert(f.elapsed>3.55,'animation scenery progresses in wall time');
// No surplus timing at normal 60Hz.
state.matchElapsed=0;now=0;const canvas2={};gtm404FrameState(canvas2,'world_pong_starlight');
let fr;
for(let i=0;i<60;i++){now+=1000/60;fr=gtm404FrameState(canvas2,'world_pong_starlight');gtm413RunBehavior('neon_pong',fr,0,{});}
assert(Math.abs(state.matchElapsed-1)<.055,'60Hz match time unexpectedly sped up: '+state.matchElapsed);
console.log('PASS visible match clock and starfield timeline at 16fps and 60fps');
`;
const sandbox={assert,console,now:0};sandbox.performance={now:()=>sandbox.now};
vm.runInNewContext(frame+body.slice(a,b)+check,sandbox,{timeout:30000});
const hud=fs.readFileSync(__dirname+'/src/visualizer-behaviors/runtime-414.js','utf8');
assert(hud.includes('const courtY=y=>'),'court shifted under HUD');
assert(hud.includes('RESET IN ${Math.ceil(s.gameOver)}s'),'visible reset timer');
assert(hud.includes('SERVE '),'visible next serve');
assert(hud.includes('ctx.strokeText(text,x,y,maxW)'),'dark outline on pastel team HUD');
assert(body.includes("maxHeight:pongCouch?'18vh':'12vh'"));
console.log('PASS 4.1.6 Store playback scope, Ambient pause owner, couch HUD and countdown guards');

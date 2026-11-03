'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const bundle=fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const start=bundle.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.');
const end=bundle.indexOf('function gtm404RegisterPacks(packs){',start);
assert(start>0&&end>start,'4.1.4 behavior runtime embedded');
const checks=`
const assert=globalThis.nodeAssert;
const env={settings:{homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'balanced',
  homeReactiveVisualizerPongGoal:5,homeReactiveVisualizerPongSeries:'3',homeReactiveVisualizerPongResetSec:5,
  homeReactiveVisualizerPongTeamPalette:'purple_pink'},beat:.55};
assert.equal(GTM413_POWER_NAMES.length,20);
assert.equal(GTM413_BEHAVIORS.get('neon_pong').options.length,13);
const s=gtm413PongCreate(env);
assert.equal(gtm413PongCreate(env),s,'same state persists across Pong scene swaps');
assert.deepEqual(Array.from(gtm414PongPickColors(s,env.settings)),['#a67dff','#ff82c4']);
// Rival colors don't silently reset scores or champion history.
s.scoreLeft=3;s.winsLeft=1;
env.settings.homeReactiveVisualizerPongTeamPalette='magenta_cyan';
assert.equal(gtm413PongCreate(env).scoreLeft,3);
assert.deepEqual(Array.from(gtm414PongPickColors(s,env.settings)),['#f45bce','#59eeff']);
// Match 1 is completed; series 1/3, then match 2 resets after 5 seconds.
s.scoreLeft=4;s.scoreRight=3;s.matchElapsed=87;s.powersUsed=2;
gtm413PongScore(s,'left',5,env.settings);
assert.equal(s.winner,'left');assert.equal(s.winsLeft,2);
assert.equal(s.champion,'left');assert.equal(s.history.length,1);
assert.equal(s.history[0].duration,87);assert.equal(s.history[0].match,1);
assert.equal(s.gameOver,5);
for(let i=0;i<470;i++)gtm413PongStep(s,1/90,env);
assert.equal(s.match,1);assert.equal(s.winsLeft,0);assert.equal(s.winsRight,0);
assert.equal(s.previousChampionship.left,2);assert.equal(s.history.length,0);
// Get legitimate points and two-sided AI collisions without overshooting the goal.
s.serve=0;s.ball={x:.134,y:.84,vx:-.4,vy:0};s.left=.45;s.targetLeft=.45;s.thinkLeft=100;
gtm413PongStep(s,.02,env);assert.equal(s.scoreRight,1);
s.serve=0;s.ball={x:.134,y:.5,vx:-.4,vy:0};s.left=.5;s.targetLeft=.5;s.thinkLeft=100;
gtm413PongStep(s,.02,env);assert(s.ball.vx>0);
// All twenty powers reachable and no per-step burst/trail runaway.
const powers=new Set();for(let i=0;i<800;i++){gtm413PongActivate(s,env);powers.add(s.power);}
assert.equal(powers.size,20);gtm413PongStep(s,1/90,env);
assert(s.bursts.length<=8 && s.trails.length<=15);
const fake={dt:12};let steps=0,draws=0;
assert(gtm413RegisterBehavior('test_scene',{create:()=>({}),step:()=>steps++,draw:()=>draws++}));
assert(gtm413RunBehavior('test_scene',fake,0,{}));
assert(steps<=4 && draws===1,'suspend catch-up bounded');
console.log('PASS championship, 20 powers, state continuity, team colors, paddles, bounded work');
`;
vm.runInNewContext(bundle.slice(start,end)+checks,{nodeAssert:assert,console},{timeout:30000});
assert(bundle.includes('const GTM414_OVERLAY_LIMIT=4;'));
assert(bundle.includes('gtm414DrawOverlays(ctx,w,h,t,scene,data,color,gtm409QualityScale(canvas))'));
assert(bundle.includes('gtm414AudioParam(layer,'));
assert(bundle.includes('!gtm414ManualTransport.blocked(resumeOwner,snap.trackKey)'));
assert(bundle.includes('if (gtm414ManualTransport.blocked(AMBIENT_OWNER,audioEngine.getSnapshot()?.trackKey)) return;'));
assert(bundle.includes('if (settings.ambientEnabled && (sleepSurface'));
assert(bundle.includes('gtm414ManualTransport.blocked(AMBIENT_OWNER,audioEngine.getSnapshot()?.trackKey))'));
const pauseStart=bundle.indexOf('const gtm414ManualTransport={');
const pauseEnd=bundle.indexOf('class AmbientController {',pauseStart);
assert(pauseStart>0&&pauseEnd>pauseStart);
vm.runInNewContext(bundle.slice(pauseStart,pauseEnd)+`
  const a=gtm414ManualTransport;
  a.pause('deck-ambient','song1');nodeAssert(a.blocked('deck-ambient','song1'));
  nodeAssert(!a.blocked('deck-store','song1'));
  a.resume('deck-ambient');nodeAssert(!a.blocked('deck-ambient','song1'));
  a.pause('deck-ambient','song2');nodeAssert(!a.blocked('deck-ambient','song3'));
`,{nodeAssert:assert,audioEngine:{getSnapshot(){return {trackKey:'song1'}}}});
console.log('PASS SDK v2 overlay/audio hooks, safe pack API, user-owned Ambient pause latch');

// Execute every allowlisted v2 overlay in a headless Canvas2D shim.
const overlayNames=['sparks','lightning','rings','stardust','comets','scanlines','confetti','orbits','hexagons','laser','snow','embers','grid','waves','shards','flares','bubbles'];
const overlayStart=bundle.indexOf('const GTM414_OVERLAY_LIMIT=4;');
const overlayEnd=bundle.indexOf('function gtm404RenderPacked(canvas,mode,data,paletteName,theme,visual){',overlayStart);
assert(overlayStart>0&&overlayEnd>overlayStart);
const draws=[];
const canvasCtx=new Proxy({save(){},restore(){},clip(){},beginPath(){},rect(){},fillRect(){draws.push('fill');},
    stroke(){draws.push('stroke');},arc(){},ellipse(){},moveTo(){},lineTo(){},closePath(){},translate(){},rotate(){}},
    {get:(target,key)=>key in target?target[key]:undefined,set:(target,key,v)=>(target[key]=v,true)});
const overlayChecks=`
const names=globalThis.names,ctx=globalThis.canvasCtx;
for(const name of names){
    gtm414DrawOverlays(ctx,800,90,13,{overlays:[{effect:name,trigger:'always',intensity:1,density:1,speed:1,color:'#ff99aa'}]},
        {live:true,low:.5,mid:.5,high:.5,beat:1},()=> '#ffffff',1);
}
const mod={audio:{intensity:{source:'beat',amount:.5}}};
globalThis.nodeAssert.equal(gtm414AudioParam(mod,'intensity',1,{beat:1}),1.5);
`;
vm.runInNewContext(bundle.slice(overlayStart,overlayEnd)+overlayChecks,{nodeAssert:assert,names:overlayNames,canvasCtx,gtm404Clamp:(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0))},{timeout:2000});
assert(draws.length<1000 && draws.length>50,'bounded overlay primitive count');
console.log('PASS all 17 declarative overlays render safely in Canvas2D smoke test');

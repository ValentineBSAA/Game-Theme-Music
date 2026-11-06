'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const bundle=fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const start=bundle.indexOf('// GTM 4.1.3: bounded, non-executable visualizer behavior runtime.');
const end=bundle.indexOf('function gtm404RegisterPacks(packs){',start);
assert(start>0&&end>start,'Behavior framework present');
const source=bundle.slice(start,end);
const checks=`
const assert=globalThis.nodeAssert;
const env={settings:{homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'balanced',homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongStyle:'readable'},beat:.55};
assert.equal(GTM413_POWER_NAMES.length,12);
assert.equal(GTM413_BEHAVIORS.has('neon_pong'),true);
assert.equal(gtm413RegisterBehavior('invalid effect',{create(){},step(){},draw(){}}),false);
let s=gtm413PongCreate(env);
assert.equal(s.scoreLeft,0);assert.equal(s.scoreRight,0);
assert(gtm413PongPredict(.30,.34,.14,.4)>=.22);
// Real collision miss produces points rather than unconditional wall bounce.
s.serve=0;s.ball={x:.134,y:.84,vx:-.4,vy:0};s.left=.45;s.targetLeft=.45;s.thinkLeft=100;
gtm413PongStep(s,.02,env);assert.equal(s.scoreRight,1,'left paddle miss scores right');
// Hit with paddle aligned reverses velocity and starts a rally.
s.serve=0;s.ball={x:.134,y:.50,vx:-.35,vy:0};s.left=.5;s.targetLeft=.5;s.thinkLeft=100;
gtm413PongStep(s,.025,env);assert(s.ball.vx>0,'left paddle connects');assert(s.rally>0);
// Powers have gameplay effects and every type may be selected.
let powers=new Set();let samples=0;
for(let i=0;i<400;i++){s.cooldown=0;gtm413PongActivate(s,env);powers.add(s.power);samples++;}
assert.equal(powers.size,12,'all twelve power options reachable');
assert(s.bursts.length>0);
// Score-to-seven wins and rematch clears the scoreboard.
s.scoreLeft=6;s.scoreRight=4;gtm413PongScore(s,'left',7);
assert.equal(s.winner,'left');assert.equal(s.winsLeft,1);
for(let i=0;i<230;i++)gtm413PongStep(s,1/90,env);
assert.equal(s.winner,'');assert.equal(s.scoreLeft,0);assert.equal(s.scoreRight,0);
// Simulate two physically limited AI players over simulated minutes.
s=gtm413PongCreate(env);let peak=0,won=false,events=[];
for(let i=0;i<90*280;i++){
 const old=s.scoreLeft+s.scoreRight;
 gtm413PongStep(s,1/90,env);
 if(s.scoreLeft+s.scoreRight>old)events.push([s.scoreLeft,s.scoreRight]);
 peak=Math.max(peak,s.winsLeft+s.winsRight);
 if(peak>0){won=true;break}
}
console.log("DEBUG",{scoreLeft:s.scoreLeft,scoreRight:s.scoreRight,winsLeft:s.winsLeft,winsRight:s.winsRight,rally:s.rally,hits:s.hitCount,ball:s.ball,events:events.length});assert(won,'AI matches actually conclude with a winner, not endless bouncing');
assert(events.length>=7,'points happen naturally');
// Reusable behavior runtime should allow safe fixed steps and independent state.
const fake={behaviors:undefined,dt:1/60};let steps=0,draws=0;
assert(gtm413RegisterBehavior('mock_effect',{create:()=>({}),step:()=>steps++,draw:()=>draws++}));
assert(gtm413RunBehavior('mock_effect',fake,0,{}));
assert(steps>=1&&steps<=4);assert.equal(draws,1);
assert.equal(gtm413RunBehavior('unregistered_effect',fake,0,{}),false);
// On long suspend, never let the physics do unbounded catch-up.
const prev=steps;fake.dt=99;gtm413RunBehavior('mock_effect',fake,0,{});
assert(steps-prev<=4,'bounded work per render');
console.log('PASS: 12 powers, scored misses/hits, eventual AI match, cooldown, rematch, bounded shared behavior runtime');
`;
const vmEnv={nodeAssert:assert,console,performance:{now:()=>0}};
vm.runInNewContext(source+checks,vmEnv,{timeout:45000});
// Smoke guard the game logic was not inserted into the untrusted pack loader.
assert(bundle.includes('const GTM404_EFFECTS = new Set('));
assert(!bundle.includes('eval('));
assert(bundle.includes('window.SP_REACT.createElement(Gtm413VisualizerBehaviorSettings,{settings,updateSettings})'));
console.log('PASS: scene options are registered and pack layer allowlist remains intact');

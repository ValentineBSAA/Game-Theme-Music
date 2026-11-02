/** GTM 4.0.9: refresh pacing, adaptive Canvas quality, no renderer regressions. */
'use strict';
const fs=require('node:fs'), assert=require('node:assert/strict'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../dist/index.js','utf8');
const begin=source.indexOf('// GTM 4.0.9: a refresh-aware, render-cost-limited footer governor.');
const end=source.indexOf('function GtmV371HomeBottomVisualizer() {',begin);
assert(begin>0&&end>begin);
const ctx={WeakMap,Number,Math,Date,Array,console};vm.createContext(ctx);
vm.runInContext(source.slice(begin,end)+`\nthis.api={create:gtm409CreateGovernor,observe:gtm409ObserveVsync,interval:gtm409Interval,record:gtm409RecordCost,scale:gtm409QualityScale};`,ctx);
const {create,observe,interval,record,scale}=ctx.api;
function vsync(hz,frames=36){const obj={};const g=create(obj);let t=1000;
 for(let i=0;i<frames;i++){t+=1000/hz;observe(g,t)}return {g,t,obj};}
let {g:sixty,t:s60}=vsync(60);
assert.equal(sixty.hz,60);assert(Math.abs(interval(sixty)-1000/60)<.02);
let {g:ninety,t:s90,obj:nineCanvas}=vsync(90);
assert.equal(ninety.hz,90);assert(Math.abs(interval(ninety)-1000/45)<.02);
for(let i=0;i<24;i++)record(ninety,s90+i*11,2.1);
assert(Math.abs(interval(ninety)-1000/90)<.02,'light 90Hz scene can draw on each refresh');
let {g:forty}=vsync(40);assert.equal(forty.hz,40);assert(Math.abs(interval(forty)-25)<.02);
let {g:thirty}=vsync(30);assert.equal(thirty.hz,30);assert(Math.abs(interval(thirty)-1000/30)<.02);
// sustained expensive frames should lower *resolution* before dropping refresh rate.
let expensive=create({});let now=1000;
for(let i=0;i<32;i++){now+=20;record(expensive,now,12);}
assert.equal(expensive.quality,.83);
assert.equal(scale(expensive.canvas),.83);
assert.equal(expensive.economy,false);
now+=6000;for(let i=0;i<30;i++){now+=20;record(expensive,now,13)}
assert.equal(expensive.quality,.72);
now+=6000;for(let i=0;i<30;i++){now+=20;record(expensive,now,13)}
assert.equal(expensive.economy,true);
assert(Math.abs(interval(expensive)-1000/30)<.02);
// Hysteresis prevents rapid flicker in canvas dimensions when render time varies.
for(let i=0;i<60;i++){now+=20;record(expensive,now,i%2===0?2:12);}
assert.equal(expensive.quality,.72);
assert(source.includes('const dpr=Math.min(1.2,window.devicePixelRatio||1,1200/cw)*gtm409QualityScale(canvas)'));
assert(source.includes('const dpr=Math.min(1.35,window.devicePixelRatio||1,1300/cw)*gtm409QualityScale(canvas)'));
assert(!source.includes("filter:'drop-shadow(0 0 7px rgba(215,234,255,.45))'"),'avoid compositing a giant blurred canvas each frame');
assert(source.includes('displayBands[i]=follow(displayBands[i],bands[i])'),'interpolate 12 audio bands between incoming packets');
assert(source.includes("entry.target?.closest?.('[data-gtm-live-footer]')"),'ignore self-generated DOM changes');
assert(source.includes("key:'gtm406-scene-stable'"),'no-remount canvas preserved');
assert(source.includes('gtm406BlendOutgoingFrame(accentRef.current,gtm406Fade.current,now)'));
assert(source.includes('const GTM_VERSION = "4.1.2";'));
console.log('PASS GTM 4.0.9: 60/90/40/30Hz cadence, adaptive resolution before economy FPS, hysteresis, audio-envelope interpolation, glow-filter removal, footer continuity, version.');

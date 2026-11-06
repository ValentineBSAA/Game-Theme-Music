const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const js = fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const before = js.indexOf('const gtm411AmbientSleepGuard =');
const after = js.indexOf('class AmbientController {', before);
assert(before > 0 && after > before,'must define the 4.1.4 sleep guard');
const definitions = js.slice(before,after);
let now=1_000_000;
const callbacks = {document:{},window:{}};
const document = {hidden:false,addEventListener:(event,fn)=>callbacks.document[event]=fn,removeEventListener:(event)=>delete callbacks.document[event]};
const window = {addEventListener:(event,fn)=>callbacks.window[event]=fn,removeEventListener:(event)=>delete callbacks.window[event]};
let owner='deck-ambient',paused=0;
const audioEngine={getSnapshot:()=>({owner,state:'playing'}),pause:()=>{paused++;}};
const AMBIENT_OWNER='deck-ambient';
const settings={ambientSleepMode:true,ambientWakeDelaySec:12};
let cancel=0,loadingKey='song';
const controller={loadRequest:{},loadingKey,sync:async()=>{}};
const context = vm.createContext({document,window,audioEngine,AMBIENT_OWNER,snapshot$1:settings,Date:{now:()=>now},Object,Math,Number,String,setInterval:()=>22,clearInterval:()=>{},call:async()=>({seq:0,sleeping:false}),addDeckyEventListener:()=>()=>{},removeDeckyEventListener:()=>{},globalThis:{}});
vm.runInContext(definitions + '\nthis.g=gtm411AmbientSleepGuard;',context);
const g=context.g;
// Startup: block playback and pause a pre-existing ambient owner.
g.start(controller);
assert.equal(paused,1);
assert(g.blocked(settings,'home'));
assert.equal(controller.loadRequest,null);
assert.equal(controller.loadingKey,'');
now+=11999;
assert(g.blocked(settings,'home'));
now+=1;
assert(!g.blocked(settings,'home'));
assert(g.takeSoftStart(settings,'home'));
assert(!g.takeSoftStart(settings,'home'));
// Actual sleep visibility: no playback even if suspended longer than timer.
document.hidden=true;callbacks.document.visibilitychange();
now+=40000;
assert(g.blocked(settings,'home'),'hidden page must NEVER play while asleep');
document.hidden=false;callbacks.document.visibilitychange();
assert(g.blocked(settings,'home'),'waking must arm a fresh delayed start');
now+=12000;
assert(!g.blocked(settings,'home'));
// Clock jump detects suspend even if browser emitted no visibility change.
g.tick(settings);now+=8000;g.tick(settings);
assert(g.blocked(settings,'home'));
// A user explicitly previewing Ambient from GTM can do so right away.
assert(!g.blocked(settings,'ambient-preview'));
// Custom delay can extend a pending wake guard, without changing the 5–60s limits.
const longer={ambientSleepMode:true,ambientWakeDelaySec:30};g.onSettings(longer);
now+=12000;assert(g.blocked(longer,'home'));
now+=18000;assert(!g.blocked(longer,'home'));
// Turning off the switch restores immediate behavior.
g.arm('manual');const off={ambientSleepMode:false,ambientWakeDelaySec:12};g.onSettings(off);
assert(!g.blocked(off,'home'));
assert(!g.takeSoftStart(off,'home'));
// No GTM audio owner: guard should never pause the external Plex player.
g.stop();owner='resonadeck';const prev=paused;g.start(controller);assert.equal(paused,prev);
g.stop();assert.equal(callbacks.document.visibilitychange,undefined);
// Static binding checks enforce use at every playback entry point, not UI only.
assert(js.includes('gtm411AmbientSleepGuard.tick(settings);'));
assert(js.includes('if (gtm411AmbientSleepGuard.blocked(settings, sleepSurface))'));
assert(js.includes('gtm411AmbientSleepGuard.blocked(latest, latestSurface)'));
assert(js.includes('await this.gtm411ResumeOwnAudio(settings, surface);'));
assert(js.includes('label: \'Sleep Mode • delayed Ambient start\''));
assert(js.includes('label: \'Wake / restart delay\''));
assert(js.includes('Math.max(1600, latest.fadeInMs)'));
assert(js.includes('const GTM_VERSION = "4.2.3"'));
console.log('PASS 4.1.4: delayed startup, hidden/sleep, wake, timer jump, preview/manual override, adjustable grace, ResonaDeck priority, soft fade, cleanup');

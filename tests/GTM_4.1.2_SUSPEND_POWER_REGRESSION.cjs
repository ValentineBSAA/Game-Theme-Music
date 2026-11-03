const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const js=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const i=js.indexOf('const gtm411AmbientSleepGuard ='),j=js.indexOf('const ambientController = new AmbientController();',i);
assert(i>0 && j>i);
let now=1_000_000, external=false, surface='home';
const callbacks={}, deckyCallbacks={}, systemCallbacks={};let id=0;
const add=(map,k,fn)=>{map[k]=fn;return {unregister:()=>delete map[k]}};
const document={hidden:false,addEventListener:(k,fn)=>add(callbacks,k,fn),removeEventListener:k=>delete callbacks[k]};
const window={addEventListener:(k,fn)=>add(callbacks,k,fn),removeEventListener:k=>delete callbacks[k]};
let counter={load:0,play:0,pause:0};
const engine={snap:{state:'idle'},audio:{volume:.5},options:{},getSnapshot(){return {...this.snap}},pause(owner){counter.pause++;if(this.snap.owner===owner)this.snap.state='paused'},hardStop(){this.snap={state:'idle'}},getCurrentTime(){return 0},adopt(){return false},setVolume(){},prepareTrack(){},subscribe:()=>()=>{},
  load(url,owner,opts){counter.load++;this.snap={state:'ready',owner,url,trackKey:opts.trackKey};this.options=opts},
  async play(owner){counter.play++; assert(!document.hidden);assert(!external);assert(this.snap.owner===owner);this.snap.state='playing'}};
let prefs={ambientEnabled:true,ambientPlaylist:[{id:'a',provider:'local',title:'a'}],ambientVolume:.4,masterVolume:1,ambientSurfaces:{home:true},ambientInterruptionMode:'resume',ambientSleepMode:true,ambientWakeDelaySec:12};
const sandbox={document,window,Date:{now:()=>now},performance:{now:()=>now},Math,Number,Object,String,Promise,console,globalThis:{SteamClient:{System:{RegisterForOnSuspendRequest:(fn)=>add(systemCallbacks,'sleep',fn),RegisterForOnResumeFromSuspend:(fn)=>add(systemCallbacks,'wake',fn)}}},
 addDeckyEventListener:(name,fn)=>{deckyCallbacks[name]=fn;return fn},removeDeckyEventListener:(name)=>delete deckyCallbacks[name],
 call:async()=>({seq:0,sleeping:false,monitoring:true}),setInterval:()=>++id,clearInterval:()=>{},snapshot$1:prefs,audioEngine:engine,
 AMBIENT_OWNER:'deck-ambient',desktopPlaybackBlocked:false,gtm408ExternalOwnsAudio:()=>external,gtmUpdateContinuityHandoffActive:()=>false,gtmUpdateContinuityQuarantineActive:()=>false,
 getAmbientSurface:()=>surface,getStorePlaybackSurface:()=> 'home',gtmV390AmbientActive:null,gtmV390AmbientHandoffs:[],gtmV389SourceClass:()=> 'blob',
 gtmFriendlyTrackTitle:()=> 'Song',localStorage:{getItem:()=>null,setItem(){}},gtmResolveAssignedTrackUrl:async t=>'blob:'+t.id,playableUrl:x=>x,pushNavigationTrace(){}};
vm.createContext(sandbox);vm.runInContext(js.slice(i,j)+'\nthis.Ambient=AmbientController;this.guard=gtm411AmbientSleepGuard;',sandbox);
(async()=>{
 const a=new sandbox.Ambient();a.state={getPublicState:()=>({gamesRunning:[]})};a.start();
 assert.equal(typeof systemCallbacks.sleep,'function');assert.equal(typeof deckyCallbacks.gtm_power_v412,'function');
 await a.sync(true);assert.equal(counter.play,0,'no startup blasting');for(let n=0;n<34;n++){now+=350;await a.sync(true)}now+=150;await a.sync(true);assert.equal(counter.play,1);
 // Physical sleep hook: the audio element MUST be paused before CEF freezes.
 systemCallbacks.sleep();assert.equal(counter.pause,1);assert.equal(engine.snap.state,'paused');
 now+=120000;await a.sync(true);assert.equal(counter.play,1,'while suspended indefinite block');
 // Backend wakes, before SteamUI Home surface has repainted.
 deckyCallbacks.gtm_power_v412({seq:1,sleeping:true,monitoring:true});
 deckyCallbacks.gtm_power_v412({seq:2,sleeping:false,monitoring:true});
 assert(sandbox.guard.blocked(prefs,'home'));
 await a.sync(true);assert.equal(counter.play,1);
 for(let n=0;n<34;n++){now+=350;await a.sync(true)}assert.equal(counter.play,1,'11.9 sec blocked');
 now+=150;await a.sync(true);assert.equal(counter.play,2,'wake resumes after 12 seconds');
 assert(engine.options.fadeInMs>=1600,'smooth fade is retained');
 // A delayed stale sleep packet must not suspend audio now.
 deckyCallbacks.gtm_power_v412({seq:1,sleeping:true});assert.equal(sandbox.guard.blocked(prefs,'home'),false);
 // Subsequent suspend from backend can pause WITHOUT any visibility event.
 deckyCallbacks.gtm_power_v412({seq:3,sleeping:true});assert.equal(engine.snap.state,'paused');
 now+=1000000;await a.sync(true);assert.equal(counter.play,2);
 deckyCallbacks.gtm_power_v412({seq:4,sleeping:false});external=true;for(let n=0;n<43;n++){now+=350;await a.sync(true)}assert.equal(counter.play,2);
 external=false;await a.sync(true);assert.equal(counter.play,3);
 // OFF toggle returns old behavior, no indefinite wake block.
 deckyCallbacks.gtm_power_v412({seq:5,sleeping:true});prefs.ambientSleepMode=false;sandbox.guard.onSettings(prefs);
 assert.equal(sandbox.guard.blocked(prefs,'home'),false);
 a.stop();assert.equal(deckyCallbacks.gtm_power_v412,undefined);
 console.log('PASS GTM 4.1.2: SteamOS suspend pre-pause, backend sequencing, missed visibility, wake delay, stale packets, Plex focus, off toggle, unregister');
})().catch(e=>{console.error(e);process.exitCode=1});

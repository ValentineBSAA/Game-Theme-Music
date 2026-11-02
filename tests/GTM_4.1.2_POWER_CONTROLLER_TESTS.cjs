const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const js=fs.readFileSync(__dirname+'/../dist/index.js','utf8');
const i=js.indexOf('const gtm411AmbientSleepGuard ='),j=js.indexOf('const ambientController = new AmbientController();',i);
assert(i>0&&j>i);
let now=1_000_000;
const listeners={};const document={hidden:false,addEventListener:(k,fn)=>listeners[k]=fn,removeEventListener:k=>delete listeners[k]};
const window={addEventListener(){},removeEventListener(){}};
let surface='home',external=false,requestResolve=async track=>'blob:music/'+track.id;
let counts={load:0,play:0,pause:0,stops:0};
const engine={snap:{state:'idle'},audio:{volume:0.55},options:{},getSnapshot(){return {...this.snap}},
 getCurrentTime(){return 23},pause(owner){counts.pause++;if(this.snap.owner===owner)this.snap.state='paused'},
 hardStop(owner){counts.stops++;this.snap={state:'idle'}},adopt(){return false},
 load(url,owner,opts){counts.load++;this.snap={state:'ready',url,owner,trackKey:opts.trackKey};this.options=opts;this.audio.volume=opts.fadeInMs>0?0:opts.volume},
 async play(owner){counts.play++;assert(!external,'ResonaDeck must never hear GTM Ambient');assert(!document.hidden,'no Ambient while Deck sleeps');assert.equal(owner,this.snap.owner);this.snap.state='playing'},
 setVolume(v){this.audio.volume=v},prepareTrack(){},subscribe:()=>()=>{}};
let ambientSettings={ambientEnabled:true,ambientPlaylist:[{id:'a',provider:'local',title:'a'}],ambientShuffle:false,ambientVolume:0.35,masterVolume:1,
 ambientSurfaces:{home:true},ambientInterruptionMode:'resume',ambientSleepMode:true,ambientWakeDelaySec:12,fadeInMs:0,fadeOutMs:0,crossfadeEnabled:false,storeEnabled:false};
const storage=new Map();
const sandbox={setInterval:()=>77,clearInterval:()=>{},call:async()=>({seq:0,sleeping:false}),addDeckyEventListener:()=>()=>{},removeDeckyEventListener:()=>{},globalThis:{},document,window,Date:{now:()=>now},performance:{now:()=>now},Math,Number,String,Object,Promise,console,
 snapshot$1:ambientSettings,audioEngine:engine,AMBIENT_OWNER:'deck-ambient',desktopPlaybackBlocked:false,
 gtm408ExternalOwnsAudio:()=>external,gtmUpdateContinuityHandoffActive:()=>false,gtmUpdateContinuityQuarantineActive:()=>false,
 getAmbientSurface:()=>surface,getStorePlaybackSurface:()=> 'home',gtmV390AmbientActive:null,gtmV390AmbientHandoffs:[],gtmV389SourceClass:()=> 'blob',
 gtmFriendlyTrackTitle:()=> 'Song',localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 gtmResolveAssignedTrackUrl:(track)=>requestResolve(track),playableUrl:url=>url,pushNavigationTrace() {}};
vm.createContext(sandbox);vm.runInContext(js.slice(i,j)+'\nthis.Ambient=AmbientController;this.guard=gtm411AmbientSleepGuard;',sandbox);
(async()=>{
 let a=new sandbox.Ambient();a.state={getPublicState:()=>({gamesRunning:[]})};sandbox.guard.start(a);
 await a.sync(true);assert.equal(counts.load,0,'startup must not load');
 for(let k=0;k<34;k++){now+=350;await a.sync(true)}
 assert.equal(counts.play,0,'11.9s still silent');
 now+=100;await a.sync(true);assert.equal(counts.load,1);assert.equal(counts.play,1);
 assert(engine.options.fadeInMs>=1600,'first start must fade gently');
 // Sleep: pause immediately, remain silent for entire hidden interval.
 document.hidden=true;listeners.visibilitychange();assert.equal(engine.snap.state,'paused');
 const pre=counts.play;now+=60000;await a.sync(true);assert.equal(counts.play,pre,'no restart while hidden');
 document.hidden=false;listeners.visibilitychange();
 for(let k=0;k<32;k++){now+=350;await a.sync(true)}
 now+=300;await a.sync(true);assert.equal(counts.play,pre,'not yet out of wake delay');
 now+=500;await a.sync(true);assert.equal(counts.play,pre+1,'resume after wake delay');
 assert(engine.options.fadeInMs>=1600,'waking a loaded track must fade gently');
 // Plex owns focus throughout the delay: do not play at the deadline.
 sandbox.guard.arm('manual');external=true;for(let k=0;k<38;k++){now+=350;await a.sync(true)}assert.equal(counts.play,pre+1);
 external=false;await a.sync(true);assert.equal(counts.play,pre+2,'recover once Plex releases audio focus');
 // Delayed resolver must not start once the user suspends during request.
 a.startedKey='';a.currentId='';engine.snap={state:'idle'};sandbox.guard.stop();ambientSettings.ambientSleepMode=false;
 let finish;requestResolve=()=>new Promise(resolve=>{finish=resolve});
 const flight=a.sync(true);await Promise.resolve();assert.equal(typeof finish,'function');
 ambientSettings.ambientSleepMode=true;sandbox.guard.start(a);finish('blob:late');await flight;
 assert.equal(counts.load,1,'resolver must be cancelled by sleep before loading');
 await a.sync(true);assert.equal(counts.play,pre+2);
 sandbox.guard.stop();
 console.log('PASS 4.1.2 controller: startup 12s, gentle fade, hidden sleep pause, wake delay and resume, Plex priority, delayed URL cancellation');
})().catch(e=>{console.error(e);process.exitCode=1});

/** GTM 4.0.9 hardware scenario simulation: hot GTM reload with Plex already playing. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/../dist/index.js','utf8');
function extract(a,b){let x=src.indexOf(a),y=src.indexOf(b,x);assert(x>=0&&y>x,`missing ${a}`);return src.slice(x,y);}
const ownership=extract('const GTM408_RD_LIVE_FOCUS=', '// 3.8.9: Chromium captureStream');
const focus=extract('// 4.0.7: Recover an eligible Home Ambient session','\nconst AMBIENT_OWNER =');
const ambient=extract('class AmbientController {','\nconst ambientController = new AmbientController();');
const settings=()=>({ambientEnabled:true,ambientPlaylist:[{id:'a',provider:'test'}],ambientSurfaces:{home:true,store:false},ambientInterruptionMode:'resume',ambientVolume:.7,masterVolume:1,fadeInMs:0,fadeOutMs:0,crossfadeEnabled:false,storeEnabled:false,storePlaylist:[]});
const tick=()=>new Promise(r=>setImmediate(r));
function create({ownerActive=true,telemetry=false}={}){
 const activity={active:ownerActive,session:'resonadeck-live'};
 const window={__RESONADECK_GTM_AUDIO_FOCUS_V85__:activity,addEventListener(){},removeEventListener(){}};
 const timeline=[],timers=new Map(),intervals=new Map();let ident=0,remotePcm=telemetry;
 const audioEngine={snap:{state:'idle'},getSnapshot(){return {...this.snap}},getCurrentTime(){return 3},setVolume(){},adopt(){return false},prepareTrack(){},
  load(url,owner,opt){timeline.push(['load',owner]);this.snap={state:'ready',owner,trackKey:opt.trackKey,url}},
  async play(owner){timeline.push(['play',owner]);if(this.snap.owner===owner)this.snap.state='playing'},
  pause(owner){timeline.push(['pause',owner]);if(this.snap.owner===owner)this.snap.state='paused'},
  hardStop(owner){timeline.push(['hardStop',owner]);if(!owner||this.snap.owner===owner)this.snap={state:'idle'}}};
 const s={window,console,Date,Math,Promise,performance,AMBIENT_OWNER:'deck-ambient',desktopPlaybackBlocked:false,
  gtm411AmbientSleepGuard:{ tick(){}, blocked(){return false;},takeSoftStart(){return false;},start(){},stop(){},onSettings(){} },
  audioEngine,gtmResonaDeckFocus:{active:false,session:'',pausedByResonaDeck:false,owner:'',trackKey:'',installed:false},
  gtm404ExternalReady:()=>remotePcm,snapshot$1:settings(),getAmbientSurface:()=> 'home',
  getStorePlaybackSurface:()=> 'home',getStorePlaybackSurfaceInfo:()=>({surface:'home'}),
  gtmUpdateContinuityQuarantineActive:()=>false,gtmUpdateContinuityHandoffActive:()=>false,
  gtmFriendlyTrackTitle:()=> 'song',gtmV390AmbientActive:null,gtmV390AmbientHandoffs:[],gtmV389SourceClass:()=> 'blob',
  gtmResolveAssignedTrackUrl:async()=> 'blob:test',playableUrl:x=>x,pushNavigationTrace(){},
  localStorage:{getItem:()=>null,setItem(){}},CustomEvent:class{},
  setTimeout(fn,delay){let id=++ident;timers.set(id,{fn,delay});return id},clearTimeout(id){timers.delete(id)},
  setInterval(fn,delay){let id=++ident;intervals.set(id,{fn,delay});return id},clearInterval(id){intervals.delete(id)}
 };
 vm.createContext(s);vm.runInContext(ownership+'\n'+ambient+'\n'+focus+'\nthis.AmbientController=AmbientController;this.api={install:installResonaDeckAudioFocusBridge,uninstall:uninstallResonaDeckAudioFocusBridge,focus:setResonaDeckAudioFocus,check:gtm408ExternalOwnsAudio,reconcile:gtm408ReconcileResonaFocus};',s);
 const a=new s.AmbientController();a.state={getPublicState:()=>({gamesRunning:[]})};s.ambientController=a;
 return {s,a,api:s.api,timeline,activity,timers,intervals,audioEngine,move(){for(const [k,v] of [...timers]){timers.delete(k);v.fn()}},pcm:v=>{remotePcm=v}};
}
(async()=>{
 assert(src.includes('const GTM_VERSION = "4.1.2";'));
 // The real bug: updating GTM while Plex is already audible must not start Ambient.
 {
  const t=create();t.api.install();assert(t.s.gtmResonaDeckFocus.active,'startup reads existing Plex focus');
  await t.a.sync(true);assert.equal(t.timeline.filter(x=>x[0]==='load'||x[0]==='play').length,0,'no Ambient load or play while Plex is already playing');
  // A stale focus RELEASE packet during an active ResonaDeck crossfade must be ignored.
  t.api.focus(false,'old');t.move();await tick();await t.a.sync(true);
  assert(t.s.gtmResonaDeckFocus.active,'stale release ignored');assert(!t.timeline.some(x=>x[0]==='play'));
  // Actual pause/stop reflected in the shared ResonaDeck owner state; Ambient recovers.
  t.activity.active=false;t.api.reconcile();await tick();
  assert(t.timeline.some(x=>x[0]==='play'), 'Home Ambient should recover after Plex stops');
  // As soon as Plex starts again, GTM must give way.
  t.activity.active=true;t.api.reconcile();await tick();
  assert.equal(t.audioEngine.snap.state,'paused');
  const loads=t.timeline.filter(x=>x[0]==='load').length;
  await t.a.sync(true);assert.equal(t.timeline.filter(x=>x[0]==='load').length,loads);
  t.api.uninstall();assert.equal(t.intervals.size,0,'no leaked focus reconciler after unmount');
 }
 // Second race: a URL resolver was already running when ResonaDeck took focus.
 {
  const t=create({ownerActive:false});let done;const promise=new Promise(r=>done=r);
  t.s.gtmResolveAssignedTrackUrl=async()=>await promise;
  t.api.install();let working=t.a.sync(true);await tick();
  t.activity.active=true;t.api.reconcile();done('blob:late');await working;
  assert(!t.timeline.some(x=>x[0]==='load'||x[0]==='play'),'stale Ambient URL must not start over Plex');t.api.uninstall();
 }
 // Isolated window: valid active PCM can claim focus while cross-plugin event is lost.
 {
  const t=create({ownerActive:false,telemetry:true});delete t.activity.active;delete t.activity.session;
  t.api.install();assert(t.s.gtmResonaDeckFocus.active,'fresh validated PCM claims isolated-window audio focus');
  await t.a.sync(true);assert(!t.timeline.some(x=>x[0]==='load'||x[0]==='play'));
  t.pcm(false);t.api.focus(false,'resonadeck-pcm');await tick();assert(!t.s.gtmResonaDeckFocus.active);
  t.api.uninstall();
 }
 // Confirm original twelve scenes no longer snap their clock to zero when music goes quiet.
 assert(src.includes('const t=(data?.time||0)/1000;'),'visualizer time must remain monotonic across PCM pauses');
 assert(!src.includes('const t=live?(data.time||0)/1000:0;'),'old animation time-reset removed');
 assert(src.includes('receiveTelemetry(gtm404External.packet)'),'newly shuffled scene seeded with last real PCM');
 assert(src.includes('const GTM408_EXTERNAL_ACTIVE_GRACE_MS=18000'),'longer visual grace during active Plex track loads');
 assert(src.includes("key:'gtm406-scene-stable'"),'stable canvas mounted during shuffle');
 console.log('PASS GTM 4.0.9: Plex already playing at GTM update, stale release, real pause/stop recovery, reacquire, delayed track URL, isolated PCM focus, stable visualizer clock, no-flash setup');
})().catch(error=>{console.error(error);process.exitCode=1});

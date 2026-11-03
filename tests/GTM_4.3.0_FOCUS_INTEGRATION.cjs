/** 4.0.7 focused regression: ResonaDeck pause/stop returns to Home Ambient. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/dist/index.js','utf8');
function extract(a,b){const i=src.indexOf(a);const j=src.indexOf(b,i);assert(i>=0&&j>i,`${a}: missing`);return src.slice(i,j);}
const focusCode=extract('// 4.0.7: Recover an eligible Home Ambient session','\nconst AMBIENT_OWNER =');
const manualCode=extract('const gtm414ManualTransport={','class AmbientController {');
const ambientCode=extract('class AmbientController {','\nconst ambientController = new AmbientController();');
const settings=()=>({ambientEnabled:true,ambientPlaylist:[{id:'song1',provider:'youtube'},{id:'song2',provider:'youtube'}],ambientSurfaces:{home:true,library:false},ambientInterruptionMode:'resume',ambientVolume:.65,masterVolume:1,fadeInMs:0,fadeOutMs:0,ambientShuffle:false,storeEnabled:false,storePlaylist:[],crossfadeEnabled:false});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function create({surface='home',games=0}={}){
 let route=surface,running=games,timerId=0;
 const timers=new Map(),calls=[],cache=new Map();
 const engine={snapshot:{state:'idle'},getSnapshot(){return {...this.snapshot};},getCurrentTime:()=>11,
  subscribe:()=>()=>{},setVolume:()=>{},adopt:()=>false,prepareTrack:()=>{},
  load(url,owner,o){calls.push(['load',owner,o.trackKey]);this.snapshot={state:'ready',owner,trackKey:o.trackKey,url};},
  pause(owner){calls.push(['pause',owner]);if(this.snapshot.owner===owner)this.snapshot.state='paused';},
  async play(owner){calls.push(['play',owner]);if(owner===this.snapshot.owner&&!sandbox.gtmResonaDeckFocus.active)this.snapshot.state='playing';},
  hardStop(owner){calls.push(['stop',owner]);if(!owner||owner===this.snapshot.owner)this.snapshot={state:'idle'};}
 };
 const sandbox={console,Date,Math,Promise,performance,AMBIENT_OWNER:'deck-ambient',gtmResonaDeckFocus:{active:false,session:'',pausedByResonaDeck:false,owner:'',trackKey:'',installed:true},desktopPlaybackBlocked:false,
   window:{},CustomEvent:class{},setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);},
   gtm411AmbientSleepGuard:{ tick(){}, blocked(){return false;},takeSoftStart(){return false;},start(){},stop(){},onSettings(){} },
   gtm408ExternalOwnsAudio:()=>sandbox.gtmResonaDeckFocus.active,gtm408ReadLiveResonaFocus:()=>({known:false,active:false,session:""}),audioEngine:engine,snapshot$1:settings(),getAmbientSurface:()=>route,getStorePlaybackSurface:()=>route,
   getStorePlaybackSurfaceInfo:()=>({surface:route}),gtmUpdateContinuityQuarantineActive:()=>false,gtmUpdateContinuityHandoffActive:()=>false,
   gtmFriendlyTrackTitle:(s,id)=>String(s||id),gtmV390AmbientActive:null,gtmV390AmbientHandoffs:[],gtmV389SourceClass:()=> 'blob',
   gtmResolveAssignedTrackUrl:async (track)=>'blob:mock-'+track.id,playableUrl:u=>u,pushNavigationTrace:()=>{},
   localStorage:{getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)},
 };
 vm.createContext(sandbox);
 vm.runInContext(manualCode+'\nthis.manual=gtm414ManualTransport;',sandbox);
 vm.runInContext(ambientCode+'\nthis.Ambient=AmbientController;',sandbox);
 const ambient=new sandbox.Ambient();ambient.state={getPublicState:()=>({gamesRunning:Array(running).fill('game')})};
 sandbox.ambientController=ambient;
 vm.runInContext(focusCode+'\nthis.setFocus=setResonaDeckAudioFocus;this.cancelFocus=gtm407CancelAmbientRecovery;',sandbox);
 return {sandbox,ambient,calls,engine,timers,setSurface:r=>route=r,setGames:n=>running=n,flush:()=>{for(const [k,v] of [...timers]){timers.delete(k);v.fn();}}};
}
async function test(){
 assert(src.includes('const GTM_VERSION = "4.4.2";'));
 // Initially start Ambient, yield when ResonaDeck plays, then recover on pause.
 {
  const h=create();await h.ambient.sync(true);assert.equal(h.engine.snapshot.state,'playing');
  h.sandbox.setFocus(true,'plex-1');assert.equal(h.engine.snapshot.state,'paused');
  await h.ambient.sync(true);assert.equal(h.engine.snapshot.state,'paused','external focus must block Ambient');
  h.sandbox.setFocus(false,'plex-1');await tick();assert.equal(h.engine.snapshot.state,'playing','Ambient should resume on focus release');
  h.flush();await tick();assert.equal(h.engine.snapshot.state,'playing');
  assert.equal(h.calls.filter(x=>x[0]==='load').length,1,'focus recovery must not reload an already loaded track');
 }
 // If Ambient wasn't loaded, do not load until ResonaDeck focus is released.
 {
  const h=create();h.sandbox.setFocus(true);await h.ambient.sync(true);
  assert.equal(h.calls.filter(x=>x[0]==='load').length,0);
  h.sandbox.setFocus(false);await tick();assert.equal(h.engine.snapshot.state,'playing');
  assert.equal(h.calls.filter(x=>x[0]==='load').length,1);
 }
 // 4.0.6 regression: Ready + startedKey must become Playing rather than get stuck.
 {
  const h=create();h.ambient.reconcile();h.ambient.startedKey='youtube:song1';
  h.engine.snapshot={state:'ready',owner:'deck-ambient',trackKey:'youtube:song1',url:'blob:mock-song1'};
  await h.ambient.sync(true);assert.equal(h.engine.snapshot.state,'playing');
 }
 // No ambient when Store is active, when a game runs, or when disabled.
 for(const mode of ['store','game','disabled']){
  const h=create({surface:mode==='store'?'store':'home',games:mode==='game'?1:0});
  if(mode==='disabled')h.sandbox.snapshot$1.ambientEnabled=false;
  h.sandbox.setFocus(true);h.sandbox.setFocus(false);await tick();h.flush();await tick();
  assert(!h.calls.some(x=>x[0]==='play'||x[0]==='load'),`should not steal audio (${mode})`);
 }
 // Stale recovery timers cannot defeat newer ResonaDeck focus.
 {
  const h=create();h.sandbox.setFocus(true);h.sandbox.setFocus(false);
  h.sandbox.setFocus(true);h.flush();await tick();
  assert.equal(h.calls.filter(x=>x[0]==='load').length,0);
 }
 // A delayed resolver from Home may not load if ResonaDeck takes priority mid-flight.
 {
  const h=create();let unblock;const pending=new Promise(resolve=>unblock=resolve);
  h.sandbox.gtmResolveAssignedTrackUrl=async()=>await pending;
  const first=h.ambient.sync(true);await tick();h.sandbox.setFocus(true);
  unblock('blob:late');await first;
  assert.equal(h.calls.filter(x=>x[0]==='load').length,0,'delayed Ambient must yield');
 }
 // Intentional manual pause suppresses automatic recovery, until Play is pressed.
 { const h=create();await h.ambient.sync(true);h.sandbox.manual.pause('deck-ambient','youtube:song1');
   h.engine.pause('deck-ambient');await h.ambient.sync(true);
   assert.equal(h.engine.snapshot.state,'paused','manual Pause cannot be stolen by auto-resume');
   h.sandbox.manual.resume('deck-ambient');await h.ambient.sync(true);
   assert.equal(h.engine.snapshot.state,'playing','manual Play clears latch and resumes'); }
 console.log('PASS GTM 4.1.4: manual Pause, focus pause/stop, unloaded Home Ambient, Ready recovery, Store/game/disabled safety, stale timer cancellation, late resolver');
}
test().catch(e=>{console.error(e);process.exitCode=1;});

/* GTM 4.0.2 built-bundle regression tests. No Decky/runtime dependencies. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const src = fs.readFileSync(__dirname+'/dist/index.js','utf8');
function extract(begin,end) {
  const i=src.indexOf(begin); assert(i>=0,begin+' missing');
  const j=src.indexOf(end,i); assert(j>i,end+' missing');
  return src.slice(i,j);
}
const resolverCode = extract('function gtmV401InstantLocalUrl(', '\nclass AutoAudioResolver');
const ambientCode = extract('class AmbientController {', '\nconst ambientController = new AmbientController();');
const storeCode = extract('class StoreController {', '\nconst storeController = new StoreController();');
const pause = () => new Promise(resolve => setTimeout(resolve,0));
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
function context({playlist='store',resolveTrack}={}) {
  const settings = {
    storeEnabled:true,storePlaylist:[{id:'a',provider:'youtube'},{id:'b',provider:'youtube'}],
    storeShuffle:false,storeVolume:1,masterVolume:1,fadeInMs:0,fadeOutMs:0,
    ambientEnabled:true,ambientPlaylist:[{id:'a',provider:'youtube'},{id:'b',provider:'youtube'}],
    ambientShuffle:false,ambientVolume:1,ambientSurfaces:{home:true},ambientInterruptionMode:'resume'
  };
  const storage = new Map();
  const calls=[];
  const engine={
    snapshot:{state:'idle'},
    options:{},
    getSnapshot(){return this.snapshot;},
    getCurrentTime(){return 3;},
    subscribe(fn){fn(this.snapshot);return()=>{};},
    hardStop(owner){if(!owner||this.snapshot.owner===owner){calls.push(['stop',this.snapshot.trackKey]);this.snapshot={state:'idle'};}},
    stop(owner){this.hardStop(owner);return Promise.resolve();},
    load(url,owner,options){calls.push(['load',options.trackKey,url]);this.snapshot={state:'loading',owner,trackKey:options.trackKey,url};},
    async play(owner){if(owner===this.snapshot.owner){this.snapshot={...this.snapshot,state:'playing'};calls.push(['play',this.snapshot.trackKey]);}},
    adopt(){return false;},setVolume(){},pause(){},
  };
  let resolver=resolveTrack || (async item=>`https://audio.example/${item.id}`);
  const sandbox={
    console,setTimeout,clearTimeout,Date,Math,performance,Promise,
    snapshot$1:settings,STORE_OWNER:'deck-store',AMBIENT_OWNER:'deck-ambient',
    gtmV390AmbientActive:null,gtmV390AmbientHandoffs:[],gtmV401StoreHandoffs:[],
    gtmV389SourceClass:()=> 'gtm-loopback-audio',gtmFriendlyTrackTitle:(_title,id)=>String(id),
    audioEngine:engine,
    getAmbientSurface:()=> 'home',getStorePlaybackSurface:()=> playlist==='ambient'?'home':'store',
    getStorePlaybackSurfaceInfo:()=>({surface:'store',source:'mock'}),
    gtmV360BaseSteamSurfaceInfo:()=>({surface:'store'}),
    gtmUpdateContinuityQuarantineActive:()=>false,
    gtmUpdateContinuityHandoffActive:()=>false,
    gtmUpdateContinuityWindow:()=>({}),
    gtmContinuityWindow:()=>({}),
    gtmUpdateContinuityTransport:()=>null,
    gtmReleaseUpdateContinuityQuarantine:()=>{},
    pushNavigationTrace:()=>{},
    getResolverForMediaId:()=>({getAudioUrlFromVideo:async()=>''}),
    inferProvider:()=> 'youtube',
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    playableUrl:u=>u,
    gtmResolveAssignedTrackUrl:(track)=>resolver(track),
  };
  vm.createContext(sandbox);
  if(playlist==='store')vm.runInContext(storeCode+'\nthis.Controller=StoreController;',sandbox);
  if(playlist==='ambient')vm.runInContext(ambientCode+'\nthis.Controller=AmbientController;',sandbox);
  return {sandbox,settings,engine,calls,Controller:sandbox.Controller};
}
async function main(){
  assert(src.includes('const GTM_VERSION = "4.0.2";'));
  assert(src.includes("if (value.includes('/decky/store')) return 'decky';"));
  assert(src.includes('gtmV310FooterHostColor'));
  assert(src.includes('gtmV389PrepareAudioCors'));
  assert(src.includes('GTM_V371_MODES'));
  assert(src.includes('gtmResonaDeckFocus'));
  // Local transport: fast cache hit returns URL with no full-Blob fetch.
  {
    const calls=[];
    const sb={call:async (method,id)=>{calls.push([method,id]);return 'http://127.0.0.1:37231/audio/token/song.webm';},
      gtmContinuityResourceKey:()=> 'local:song.webm',gtmPersistentLocalAudioState:()=>({entries:new Map()}),
      inferProvider:()=> 'youtube',getResolverForMediaId:()=>{throw Error('Unexpected provider fetch')} };
    vm.createContext(sb);
    vm.runInContext(resolverCode+'\nthis.resolve = gtmResolveAssignedTrackUrl;',sb);
    const actual=await sb.resolve({id:'a',provider:'youtube'});
    assert.equal(actual,'http://127.0.0.1:37231/audio/token/song.webm');
    assert.equal(calls.length,1);
    assert(!src.includes('return await gtmPreparePersistentLocalAudioUrl(localUrl);'));
  }
  // Store should resolve B while A plays, and switch using its prepared URL.
  {
    const requests=[];
    const h=context({resolveTrack:async tr=>{requests.push(tr.id);return 'prepared:'+tr.id;}});
    const c=new h.Controller(); c.state={getPublicState:()=>({gamesRunning:[]})};
    await c.sync(true);await pause();
    assert.deepEqual(requests,['a','b']);
    assert.equal(c.preparedNext?.status,'ready');
    await c.next();
    // B was ready; A may now be prepared for the next pass through the queue.
    assert.equal(requests.filter(id=>id==='b').length,1);
    assert.deepEqual(h.calls.filter(x=>x[0]==='load').map(x=>x[1]),['youtube:a','youtube:b']);
  }
  // Slow previous response is barred from overwriting new selection (Store).
  {
    const slow=deferred();
    const h=context({resolveTrack:tr=>tr.id==='a'?slow.promise:Promise.resolve('ready:b')});
    const c=new h.Controller();c.state={getPublicState:()=>({gamesRunning:[]})};
    const initial=c.sync(true);await pause();
    await c.next();
    slow.resolve('late:a');await initial;
    assert.deepEqual(h.calls.filter(x=>x[0]==='load').map(x=>x[1]),['youtube:b']);
    assert.equal(h.engine.snapshot.trackKey,'youtube:b');
  }
  // Ambient prefetch B while A plays, and avoid stale A after manual Next.
  {
    const slow=deferred();
    const h=context({playlist:'ambient',resolveTrack:tr=>tr.id==='a'?slow.promise:Promise.resolve('ready:b')});
    const c=new h.Controller();c.state={getPublicState:()=>({gamesRunning:[]})};
    const initial=c.sync(true);await pause();
    await c.next(false);slow.resolve('late:a');await initial;
    assert.deepEqual(h.calls.filter(x=>x[0]==='load').map(x=>x[1]),['youtube:b']);
    assert.equal(h.engine.snapshot.trackKey,'youtube:b');
  }
  // Persisted Ambient and Store entries must never be truncated at 15.
  {
    const settingsCode=extract('function normalizeSettings(value) {','\nfunction publish(settings) {');
    const sb={ defaultSettings:{volume:1,masterVolume:1,storageLimitMb:2048,ambientVolume:0.35,storeVolume:0.35},
      gtmV377NormalizeMode:()=> 'off',GTM_V371_PALETTES:['auto'] };
    vm.createContext(sb);
    vm.runInContext(settingsCode+'\nthis.normalize = normalizeSettings;',sb);
    const tracks=Array.from({length:62},(_,i)=>({id:'song-'+i,provider:'youtube',title:'Song '+i}));
    const saved=sb.normalize({ambientPlaylist:[...tracks,tracks[0]],storePlaylist:[...tracks,tracks[1]]});
    assert.equal(saved.ambientPlaylist.length,62);
    assert.equal(saved.storePlaylist.length,62);
    assert.equal(saved.ambientPlaylist[61].id,'song-61');
  }
  // Game playlists, playlist editor and imports have no quota branches.
  {
    assert(!src.includes('MAX_PLAYLIST_TRACKS'));
    assert(!src.includes('PlaylistLimitError'));
    assert(!src.includes('projectedCount() >= 15'));
    assert(!src.includes('.slice(0, MAX_PLAYLIST_TRACKS)'));
    assert(!src.includes('return [...order].slice(0, 15)'));
    assert(src.includes('const chosen = [...importQueue];'));
    assert(src.includes('const next = (nextPlaylist || []).filter((track) => track?.id);'));
    // The remaining 15 is an RPC prewarm batch, not a saved playlist limit.
    assert(src.includes('const previewWarmIds = nextTracks.slice(0, 15)'));
  }
  // Simultaneous prefetch/playback resolution is coalesced, then released.
  {
    const wait=deferred();
    let providerCalls=0;
    const sb={call:async()=>'',inferProvider:()=> 'youtube',
      getResolverForMediaId:()=>({getAudioUrlFromVideo:async()=>{providerCalls++;return wait.promise;}}),
      gtmContinuityResourceKey:()=> '',gtmPersistentLocalAudioState:()=>({entries:new Map()})};
    vm.createContext(sb);
    vm.runInContext(resolverCode+'\nthis.resolve=gtmResolveAssignedTrackUrl;',sb);
    const a=sb.resolve({id:'song-42',provider:'youtube'});
    const b=sb.resolve({id:'song-42',provider:'youtube'});
    await pause();
    assert.equal(providerCalls,1,'prefetch and playback should share provider lookup');
    wait.resolve('provider-ready-url');
    assert.deepEqual(await Promise.all([a,b]),['provider-ready-url','provider-ready-url']);
    await sb.resolve({id:'song-42',provider:'youtube'});
    assert.equal(providerCalls,2,'remote provider URLs must not be cached indefinitely');
  }
  console.log('PASS 4.0.2: version, unbounded playlists, lookup coalescing, transport and visualizer invariants, Store/Ambient stale-request safety');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

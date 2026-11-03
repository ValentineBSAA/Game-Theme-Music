// 4.4.4 Shuffle All settings regression harness. Run from extracted plugin root.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src = fs.readFileSync(require('path').join(__dirname,'../dist/index.js'), 'utf8');
assert(src.includes('homeReactiveVisualizerShuffleAll: false'), 'default Shuffle All must be off');
assert(src.includes('if(!settingsLoaded||!snapshot$1.homeReactiveVisualizerShuffleAll||'), 'track-change guard missing');
const selection = src.slice(src.indexOf('function publish(settings) {'), src.indexOf('const useSettings = () => {'));
assert(selection.includes('gtm444SettingsWriteQueue'), 'serial write queue missing');
const context = {
  console, Promise,
  defaultSettings: {homeReactiveVisualizerShuffleAll:false, homeReactiveVisualizerMode:'ambience'},
};
context.normalizeSettings = v => ({...context.defaultSettings,...(v||{})});
let persistent = {homeReactiveVisualizerShuffleAll:false, homeReactiveVisualizerMode:'ambience'};
let sidecar = null;
const writes = [];
context.call = async (method, ...params) => {
  if (method === 'get_setting') return structuredClone(persistent);
  if (method === 'get_visualizer_shuffle_preference') return sidecar === null
     ? {exists:false,enabled:false}:{exists:true,enabled:sidecar};
  if (method === 'set_setting') {
    const next = structuredClone(params[1]);
    await new Promise(resolve=>setTimeout(resolve,next.homeReactiveVisualizerShuffleAll===false ? 8 : 1));
    persistent = next; writes.push(next); return null;
  }
  if (method === 'set_visualizer_shuffle_preference') {
    sidecar = params[0]; return {exists:true,enabled:sidecar};
  }
  throw new Error('unexpected backend RPC '+method);
};
vm.createContext(context);
vm.runInContext(`let snapshot$1=defaultSettings;
let loadPromise=null;
let settingsLoaded=false;
let gtm444SettingsWriteQueue=Promise.resolve();
const listeners$1=new Set();
let ambientSettingsChangedHook=null;
let storeSettingsChangedHook=null;
${selection}
this.api={loadSettings,setGlobalSetting,getSnapshot:()=>snapshot$1};`,context);
// Drive the real track-change handler with OFF, then ON, then OFF again.
// This is distinct from the preference storage test: it checks the actual
// visualizer-changing decision, not merely the displayed toggle state.
const visualStart=src.indexOf('const GTM404_VISUAL_SHUFFLE =');
const visualEnd=src.indexOf('if(typeof audioEngine!==',visualStart);
assert(visualStart>=0 && visualEnd>visualStart,'visualizer track handler not found');
const visualCode=src.slice(visualStart,visualEnd);
const visualCalls=[];
const visualContext={
  console, Math, Promise, settingsLoaded:true,
  snapshot$1:{homeReactiveVisualizerShuffleAll:false,homeReactiveVisualizerEnabled:true,homeReactiveVisualizerMode:'ambience'},
  GTM_V376_GROUPS:[{modes:['ambience','rings','neon_pong']}],
  GTM_V371_MODES:['off','ambience','rings','neon_pong'],
  setGlobalSetting:(k,v)=>{visualCalls.push([k,v]);return Promise.resolve();}
};
vm.createContext(visualContext);
vm.runInContext(visualCode+'\nthis.change=gtm404OnTrackChanged;',visualContext);
const play=key=>visualContext.change({owner:'deck-ambient',trackKey:key,state:'playing'});
play('song-a');play('song-b');
assert.equal(visualCalls.length,0,'OFF must block all auto scene changes');
visualContext.snapshot$1.homeReactiveVisualizerShuffleAll=true;
play('song-b'); // same track must not suddenly shuffle on a mid-song toggle
assert.equal(visualCalls.length,0,'same track must not shuffle retroactively');
play('song-c');
assert.equal(visualCalls.length,1,'ON should shuffle on the next song');
visualContext.snapshot$1.homeReactiveVisualizerShuffleAll=false;
play('song-d');
assert.equal(visualCalls.length,1,'OFF must immediately stop further automatic changes');

(async()=>{
  const api=context.api;
  await api.loadSettings();
  assert.equal(api.getSnapshot().homeReactiveVisualizerShuffleAll,false);
  // A delay in full blob saves should not reorder toggles/other preferences.
  await Promise.all([
    api.setGlobalSetting('homeReactiveVisualizerShuffleAll',true),
    api.setGlobalSetting('homeReactiveVisualizerShuffleAll',false),
    api.setGlobalSetting('homeReactiveVisualizerMode','rings'),
  ]);
  assert.equal(sidecar,false);
  assert.equal(persistent.homeReactiveVisualizerShuffleAll,false);
  assert.equal(persistent.homeReactiveVisualizerMode,'rings');
  assert.equal(writes.at(-1).homeReactiveVisualizerShuffleAll,false);
  // An installer/migration accidentally restoring a stale *full* settings
  // snapshot must not override the separate saved OFF choice.
  persistent={homeReactiveVisualizerShuffleAll:true,homeReactiveVisualizerMode:'rings'};
  await api.loadSettings(true);
  assert.equal(api.getSnapshot().homeReactiveVisualizerShuffleAll,false);
  // Also verify ON remains ON, toggling is not silently disabled forever.
  await api.setGlobalSetting('homeReactiveVisualizerShuffleAll',true);
  assert.equal(sidecar,true);
  assert.equal(persistent.homeReactiveVisualizerShuffleAll,true);
  await api.loadSettings(true);
  assert.equal(api.getSnapshot().homeReactiveVisualizerShuffleAll,true);
  await api.setGlobalSetting('homeReactiveVisualizerShuffleAll',false);
  assert.equal(sidecar,false);
  assert.equal(persistent.homeReactiveVisualizerShuffleAll,false);
  console.log('PASS: runtime OFF blocks track changes; explicit ON/OFF, serial updates, restart and stale-upgrade recovery');
})().catch(err=>{console.error(err);process.exitCode=1});

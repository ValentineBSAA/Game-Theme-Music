'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname;
const source=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const builtin=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/volume1/manifest.json'),'utf8'));
const demo={format:1,pack_id:'gtm_test_import',name:'Test Import',version:'1.0.0',scenes:[
  {id:'world_rc4_custom',title:'Test Custom',category:'anime',layers:[{effect:'neon_pong',scale:1,speed:1,density:1,intensity:1,hueShift:0}]}
]};
const a=source.indexOf('const GTM404_EFFECTS ='),b=source.indexOf('\nfunction gtmRetroDraw(',a);
assert(a>=0&&b>a);
const block=source.slice(a,b);
const listeners={};
let now=1000,subscriptions=[],settingsUpdates=[];
const window={devicePixelRatio:1,innerWidth:1280,
  addEventListener:(id,cb)=>(listeners[id]??=[]).push(cb),removeEventListener:()=>{},
  dispatchEvent:ev=>(listeners[ev.type]||[]).forEach(cb=>cb(ev))};
const audioEngine={getSnapshot(){return {state:'idle'};},subscribe(fn){subscriptions.push(fn);fn({state:'idle'});return()=>{subscriptions=subscriptions.filter(f=>f!==fn);}}};
const snapshot$1={homeReactiveVisualizerShuffleAll:false,homeReactiveVisualizerMode:'ambience',homeReactiveVisualizerEnabled:true};
const ctx={window,console,performance:{now:()=>now},Date,
    call:async (method)=>method==='list_visualizer_packs'?{ok:true,packs:[builtin,demo]}:{ok:false},
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},
    audioEngine,settingsLoaded:true,snapshot$1,
    setGlobalSetting:async (key,value)=>{settingsUpdates.push([key,value]);snapshot$1[key]=value;},
    GTM_V371_MODES:['off','ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope','bassfloor','pulseengine','skyline','arc','resonance'],
    GTM_V376_LABELS:{}, GTM_V376_GROUPS:[{id:'off',label:'Off',modes:['off']},
      {id:'retro',label:'Retro',modes:['ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope']},
      {id:'rhythm',label:'Rhythm',modes:['bassfloor','skyline']},
      {id:'signature',label:'GTM Signature',modes:['pulseengine','arc','resonance']}],
    SP_REACT:{useState:()=>[0,()=>{}],useEffect:()=>{}},
    gtmV371Hsl:(h,s=.9,l=.65)=>[Math.min(1,Math.max(0,h)),.6,l]};
vm.createContext(ctx);
vm.runInContext(block+`\nthis.api={register:gtm404RegisterPacks,shuffle:gtm404OnTrackChanged,pick:gtm404PickShuffledScene,all:gtm404AllSceneIds,
  render:gtm404RenderPacked,states:GTM404_FRAME_STATES,registered:GTM404_PACK_SCENES};`,ctx);
ctx.api.register([builtin,demo]);
assert.equal(subscriptions.length,1,'one visualizer subscription');
assert.equal(ctx.api.all().length,23,'22 built-in + one imported');
assert(ctx.GTM_V376_GROUPS.find(g=>g.id==='anime').modes.includes('world_rc4_custom'));
ctx.api.shuffle({owner:'deck-ambient',trackKey:'song1',state:'playing'});
assert.equal(settingsUpdates.length,0,'shuffle off is no-op');
snapshot$1.homeReactiveVisualizerShuffleAll=true;
ctx.api.shuffle({owner:'deck-ambient',trackKey:'song1',state:'playing'});
assert.equal(settingsUpdates.length,0,'switching setting mid-track should not shuffle immediately');
ctx.api.shuffle({owner:'deck-ambient',trackKey:'song2',state:'playing'});
assert.equal(settingsUpdates.length,1,'Ambient track change shuffles scene');
let previous=snapshot$1.homeReactiveVisualizerMode;
for(let n=3;n<16;n++){
  ctx.api.shuffle({owner:'deck-store',trackKey:'store'+n,state:'playing'});
  assert.notEqual(snapshot$1.homeReactiveVisualizerMode,previous,'no identical adjacent visualizers');
  previous=snapshot$1.homeReactiveVisualizerMode;
}
assert.equal(settingsUpdates.length,14,'one settings update per changed song');
ctx.api.shuffle({owner:'deck-store',trackKey:'store15',state:'playing'});
assert.equal(settingsUpdates.length,14,'no shuffle on duplicate transport snapshot');
ctx.api.shuffle({owner:'preview-modal',trackKey:'preview',state:'playing'});
assert.equal(settingsUpdates.length,14,'preview music does not reshuffle');
ctx.api.shuffle({owner:'theme-100',trackKey:'gameSong',state:'playing'});
assert.equal(settingsUpdates.length,15,'game theme music shuffles');
assert(source.includes("label:'Remove which pack?'"),'explicit pack removal picker');
assert(source.includes('strTitle:\'Remove visualizer pack?\''),'removal confirmation dialog');
assert(source.includes('maxHeight:\'204px\''),'scrollable custom pack list');
assert.equal(source.split('Shuffle all visualizers on track change').length,3,'shuffle toggle in both settings surfaces');
assert(source.includes("state.previousBalls=ballPositions.map"),'pinball uses swept motion');
assert(!block.includes("if(data?.live&&beat>.40&&t-state.lastHit"),'no beat-gated collisions');
assert(block.includes('const multicolor=['),'individual ball hue support');
// Rendering regression: record high-brightness ball colors and ensure at least 3 distinct tints.
const fills=[];
const gradient={addColorStop(){}};
let drawingProxy;
const drawing=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,
    fill(){fills.push(this.fillStyle);},arc(){},ellipse(){},moveTo(){},lineTo(){},fillRect(){},strokeRect(){},clearRect(){},save(){},restore(){},beginPath(){},closePath(){},stroke(){},translate(){},rotate(){}},
 {get(o,k){return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});
const canvas={clientWidth:1280,clientHeight:90,width:0,height:0,getContext:()=>drawing};
const data={live:true,low:.55,mid:.7,high:.6,rms:.4,beat:.3,time:1000,colorPhase:.4,bands:Array(12).fill(.65)};
for(let i=0;i<500;i++){
 now+=16;ctx.api.render(canvas,'world_beat_pinball',data,'music',null,{reactivity:100});
}
const pin=ctx.api.states.get(canvas).pinball[0];
assert(pin.hitCounter>0,'pinballs hit targets without requiring a strong beat');
assert(pin.targets.some(x=>x.level>0),'hit targets eventually respawn');
const ballColors=[...new Set(fills.filter(v=>typeof v==='string'&&v.startsWith('rgba(')))];
assert(ballColors.length>=4,'distinct music reactive colors rendered');
console.log('PASS RC4: explicit pack removal, custom scroll list, imported categories, opt-in shuffle on real Ambient/Store/Game changes, no repeat, per-frame pinball collision, distinct color balls.');

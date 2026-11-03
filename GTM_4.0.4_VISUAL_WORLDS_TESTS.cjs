/* Offline rendering and ResonaDeck data-bridge tests; not a Steam Deck performance benchmark. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');
const root=__dirname;
const src=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const pack=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/volume1/manifest.json'),'utf8'));
const a=src.indexOf('const GTM404_EFFECTS ='),b=src.indexOf('\nfunction gtmRetroDraw(',a);
assert(a>0&&b>a);
const code=src.slice(a,b);
assert.equal(pack.scenes.length,10);
assert.equal(new Set(pack.scenes.map(s=>s.layers[0].effect)).size,10,'ten distinct rendering effects');
const listeners={},window={addEventListener:(name,cb)=>(listeners[name]??=[]).push(cb),
  removeEventListener:()=>{},dispatchEvent:event=>{for(const cb of listeners[event.type]||[])cb(event);}};
const ctx={window,console,performance:{now:()=>1200},Date,
  call:async m=>m==='list_visualizer_packs'?{ok:true,packs:[pack]}:{ok:false},
  setTimeout:()=>0,
  CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail}},
  Event:class{constructor(type){this.type=type}},
  gtm408ReadLiveResonaFocus:()=>({known:false,active:false,session:""}),gtm408ReconcileResonaFocus:()=>{},gtmResonaDeckFocus:{active:false},setResonaDeckAudioFocus:()=>{},
  gtm409QualityScale:()=>1,
  GTM_V371_MODES:['off','ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope','bassfloor','pulseengine','skyline','arc','resonance'],
  GTM_V376_LABELS:{},GTM_V376_GROUPS:[{id:'off',label:'Off',modes:['off']},{id:'retro',label:'Retro',modes:['ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope']},{id:'rhythm',label:'Rhythm',modes:['bassfloor','skyline']},{id:'signature',label:'Signature',modes:['pulseengine','arc','resonance']}],
  settingsLoaded:true,listeners$1:new Set(),snapshot$1:{},gtmV371Hsl:h=>[h,.45,.65]
};
vm.createContext(ctx);
vm.runInContext(code+'\nthis.api={register:gtm404RegisterPacks,render:gtm404RenderPacked,accept:gtm404AcceptExternal,bridge:gtm404ExternalApi,ready:gtm404ExternalReady,status:GTM404_PACK_STATUS};',ctx);
ctx.api.register([pack]);
assert.equal(ctx.GTM_V371_MODES.length,23,'12 originals + Off + 10 new scenes');
assert.equal(ctx.GTM_V376_GROUPS.length,5,'Off plus four visualizer categories');
assert.equal(ctx.GTM_V376_GROUPS.find(g=>g.id==='anime').modes.length,2);
let calls=0;
const gradient={addColorStop(){}};
const drawing=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,measureText:()=>({width:5})},{get(target,key){return key in target?target[key]:(...args)=>{calls++;return undefined}},set(target,key,value){target[key]=value;return true;}});
const canvas={clientWidth:1280,clientHeight:90,width:0,height:0,getContext:()=>drawing};
for(const scene of pack.scenes){
 const data={live:true,low:.7,mid:.5,high:.4,rms:.48,beat:.6,colorPhase:.24,time:1800,bands:Array.from({length:12},(_,i)=>.2+i*.04)};
 assert.equal(ctx.api.render(canvas,scene.id,data,'music',false,{reactivity:100}),true,scene.id);
}
assert(calls>100,'draw calls were actually made');
const packet={protocol:1,source:'resonadeck',active:true,bands:Array(12).fill(.4),rms:.4,low:.5,mid:.3,high:.2,beat:.6};
assert.equal(ctx.api.accept(packet),true);
assert.equal(ctx.api.ready(),true);
assert.equal(ctx.api.bridge.getStatus().source,'resonadeck');
assert.equal(ctx.api.accept({...packet,source:'unauthorized'}),false);
ctx.api.bridge.stopExternalTelemetry();
assert.equal(ctx.api.ready(),false);
console.log('PASS GTM 4.0.4: 10 unique Canvas2D scenes, 4 categories, 22 visualizers, audio reaction, bridge packet validation & Stop');

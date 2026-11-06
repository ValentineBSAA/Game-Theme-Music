'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const sourcePath=process.argv[2]||'/mnt/data/gtm406_work/Game-Theme-Music/dist/index.js';
const source=fs.readFileSync(sourcePath,'utf8');

// Playback remains owned by the original plugin; these are UI-only rules.
assert(source.includes("key:'gtm406-scene-stable'"), 'scene canvas must stay mounted across mode updates');
assert(source.includes("key:'gtm406-outgoing-frame-stable'"), 'outgoing-buffer canvas must stay mounted');
assert(!source.includes("key:'gtm378-scene-'+visual.mode"), 'per-scene remount would expose the CSS background');
assert(!source.includes("key:'gtm378-accent-'+visual.mode"));
assert(source.includes('gtm406FreezeOutgoingFrame(outgoing,overlay,gtm406Fade.current,performance.now())'));
assert(source.includes('gtm406BlendOutgoingFrame(accentRef.current,gtm406Fade.current,now)'));
assert(source.includes('eligible=onHome&&(playing||trackHandoff||gtm406ExternalVisualGrace())'));
assert(source.includes('if(gtm404External.active&&!gtm406ExternalVisualGrace())'));
assert(source.includes('publishExternalTelemetry(packet){return gtm405ReceiveExternal(packet);}') );

const helperStart=source.indexOf('// GTM 4.0.6: small testable helpers');
const helperEnd=source.indexOf('// GTM 3.8.0 safety correction:',helperStart);
assert(helperStart>0&&helperEnd>helperStart);
const helper={};vm.createContext(helper);
vm.runInContext(source.slice(helperStart,helperEnd)+'\nthis.freeze=gtm406FreezeOutgoingFrame;this.blend=gtm406BlendOutgoingFrame;',helper);
let clears=0,copies=0;
const sourceCanvas={width:1280,height:80};
const overlay={width:0,height:0,style:{opacity:'0'}, getContext:()=>({
  clearRect:(x,y,w,h)=>{assert.equal(w,1280);assert.equal(h,80);clears++;},
  drawImage:(src,x,y)=>{assert.strictEqual(src,sourceCanvas);assert.equal(x,0);assert.equal(y,0);copies++;}
})};
const fade={startedAt:0,duration:520};
assert(helper.freeze(sourceCanvas,overlay,fade,1000));
assert.equal(copies,1);assert.equal(clears,1);assert.equal(overlay.style.opacity,'1');
assert.equal(fade.startedAt,1000);
assert.equal(helper.blend(overlay,fade,1000),1);
assert(Math.abs(helper.blend(overlay,fade,1260)-.25)<.001);
assert.equal(helper.blend(overlay,fade,1520),0);
assert.equal(fade.startedAt,0);assert.equal(overlay.style.opacity,'0');
assert.equal(helper.freeze(sourceCanvas,{width:0,height:0,style:{},getContext(){throw new Error('SecurityError');}},fade,2000),false,'capture failure must be nonfatal');
assert.equal(fade.startedAt,0);
assert.equal(helper.freeze({width:0,height:0},overlay,fade,2100),false);

const cutStart=source.indexOf('const GTM404_VISUAL_SHUFFLE =');
const cutEnd=source.indexOf('async function gtm404RefreshPacks()',cutStart);
assert(cutStart>0&&cutEnd>cutStart);
let now=10000;
const scenes=[];
const context={Math,Date,Number,console,performance:{now:()=>now},gtm408ReadLiveResonaFocus:()=>({known:false,active:false}),gtm408ExternalOwnsAudio:()=>false,gtm408ReconcileResonaFocus:()=>{},gtmResonaDeckFocus:{active:false},setResonaDeckAudioFocus:()=>{},
  window:{location:{origin:'http://localhost'},addEventListener(){},dispatchEvent(){},postMessage(){}},
  CustomEvent:class{constructor(type){this.type=type;}},
  GTM_V371_MODES:['ambient','retro_two','rhythm_one','off'],
  GTM_V376_GROUPS:[{id:'retro',modes:['ambient','retro_two']},{id:'rhythm',modes:['rhythm_one']}],
  snapshot$1:{homeReactiveVisualizerShuffleAll:true,homeReactiveVisualizerEnabled:true,homeReactiveVisualizerMode:'ambient'},
  settingsLoaded:true,
  setGlobalSetting:async(k,v)=>{scenes.push(v);context.snapshot$1.homeReactiveVisualizerMode=v;},
  gtm404Clamp:(n,a=0,b=1)=>Math.max(a,Math.min(b,Number(n)||0))};
vm.createContext(context);
vm.runInContext(source.slice(cutStart,cutEnd)+'\nthis.feed=gtm405ReceiveExternal;this.grace=gtm406ExternalVisualGrace;this.fresh=gtm404ExternalReady;',context);
const pcm=(seq)=>({source:'resonadeck',protocol:1,active:true,bands:Array(12).fill(.3),rms:.25,
  low:.3,mid:.2,high:.1,beat:.2,bridgeSession:100,trackSequence:seq});
const bridge=context.window.GameThemeMusicVisualizerBridgeV1;
assert(bridge,'direct shareable bridge not registered');
assert(bridge.publishExternalTelemetry(pcm(1)));
assert.equal(scenes.length,0,'first track cannot auto-shuffle');
assert(bridge.publishExternalTelemetry(pcm(2)));
assert.equal(scenes.length,1,'direct bridge must shuffle once on new track');
for(let i=0;i<30;i++)bridge.publishExternalTelemetry(pcm(2));
assert.equal(scenes.length,1,'duplicate packets cannot shuffle repeatedly');
now=13000;
assert.equal(context.fresh(),false,'fresh measured PCM must expire at original short TTL');
assert.equal(context.grace(),true,'visual footer remains mounted during short external handoff');
now=17000;
assert.equal(context.grace(),false,'a dead source cannot keep footer indefinitely');
now=17500;bridge.publishExternalTelemetry(pcm(3));
assert.equal(scenes.length,2,'bridge recovers after a longer gap');
bridge.stopExternalTelemetry();
assert.equal(context.grace(),false,'explicit external stop must clear visual session immediately');
console.log('PASS GTM 4.0.6: persistent canvas keys, 520ms outgoing frame fade, no white background flash, direct bridge shuffle, deduplication, 6.5s remote handoff grace, explicit stop cleanup.');

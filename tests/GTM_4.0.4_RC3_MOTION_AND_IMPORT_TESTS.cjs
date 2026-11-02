/* RC3 motion + pack regression tests. Offline Canvas simulation, not Deck FPS. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=__dirname;
const source=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const builtin=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/volume1/manifest.json'),'utf8'));
const start=source.indexOf('const GTM404_EFFECTS =');
const end=source.indexOf('\nfunction gtmRetroDraw(',start);
assert(start>0&&end>start,'renderer source boundaries');
const body=source.slice(start,end);
assert(!body.includes("case 'aincrad_duel'"),'rejected sword scene gone');
assert(!body.includes("case 'prism_forge'"),'rejected forge scene gone');
assert(!body.includes("case 'spirit_blade'"),'rejected blade scene gone');
const pongCode=body.slice(body.indexOf("case 'neon_pong':"),body.indexOf("case 'tidal_bloom':"));
assert(!pongCode.includes('line([[ballX,ballY]'),'no paddle-to-ball connecting strings');
assert(pongCode.includes('frame.pong'),'ball physics has persistent state');
assert(body.includes('gtm404UsePackEpoch'),'reactive pack refresh hook exists');
assert(source.includes('key: \'gtm-scene-\'+gtm404PackEpoch'),'dropdown reinitializes on pack refresh');
assert(source.includes('Custom scene • Preview'),'imported scenes directly selectable');
assert(/function Gtm404VisualizerPackManager\(\)\s*\{[\s\S]{0,700}const \{updateSettings\}=useSettings\(\)/.test(source), 'pack manager uses in-scope persisted updateSettings');
let now=1000;
const listeners={};
const window={devicePixelRatio:1,innerWidth:1280,
    addEventListener:(event,fn)=>(listeners[event]??=[]).push(fn),removeEventListener:()=>{},
    dispatchEvent:e=>(listeners[e.type]||[]).forEach(fn=>fn(e))};
const ctx={window,console,performance:{now:()=>now},Date,
    call:async method=>method==='list_visualizer_packs'?{ok:true,packs:[builtin]}:{ok:false},
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},
    GTM_V371_MODES:['off','ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope','bassfloor','pulseengine','skyline','arc','resonance'],
    GTM_V376_LABELS:{},
    GTM_V376_GROUPS:[{id:'off',label:'Off',modes:['off']},{id:'retro',label:'Retro',modes:['ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope']},{id:'rhythm',label:'Rhythm',modes:['bassfloor','skyline']},{id:'signature',label:'Signature',modes:['pulseengine','arc','resonance']}],
    SP_REACT:{useState:()=>[0,()=>{}],useEffect:()=>{}},
    settingsLoaded:true,listeners$1:new Set(),snapshot$1:{},gtmV371Hsl:(h)=>[Math.min(1,h),.6,.65]};
vm.createContext(ctx);
vm.runInContext(body+'\nthis.api={render:gtm404RenderPacked,register:gtm404RegisterPacks,states:GTM404_FRAME_STATES,packScenes:GTM404_PACK_SCENES,groups:GTM_V376_GROUPS};',ctx);
ctx.api.register([builtin]);
const gradient={addColorStop() {}};
const circles=[];
const drawing=new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient,
   arc(x,y,r){circles.push({x,y,r});},ellipse(){},moveTo(){},lineTo(){},fillRect(){},strokeRect(){},clearRect(){},save(){},restore(){},beginPath(){},closePath(){},stroke(){},fill(){},translate(){},rotate(){},scale(){}},
   {get(t,k){return k in t?t[k]:(...args)=>{};},set(t,k,v){t[k]=v;return true;}});
const canvas={clientWidth:1280,clientHeight:90,width:0,height:0,getContext:()=>drawing};
const data={live:true,low:.4,mid:.5,high:.3,rms:.4,beat:.7,time:85000,colorPhase:.2,bands:Array(12).fill(.4)};
let prev;
for(let frame=0;frame<420;frame++){
    now+=16;
    data.time=frame===50?0:frame*20;
    data.low=frame%3===0?.92:.05;
    circles.length=0;
    assert(ctx.api.render(canvas,'world_neon_pong',data,'music',null,{}),'pong render '+frame);
    const current=ctx.api.states.get(canvas).pong[0];
    assert(current&&current.x>=.12&&current.x<=.88&&current.y>=.10&&current.y<=.90,'pong inside footer '+frame);
    if(prev){
        assert(Math.abs(current.x-prev.x)<.02,'no horizontal teleport '+frame);
        assert(Math.abs(current.y-prev.y)<.02,'no vertical teleport '+frame);
    }
    prev={x:current.x,y:current.y};
}
assert(ctx.api.states.get(canvas).pong[0].bounces>=1,'ball hits paddles');
const custom={format:1,pack_id:'gtm_visual_worlds_demo_03',name:'Test Demo',version:'1.0.0',
    scenes:[{id:'world_test_pong_title',title:'A Pong Title',category:'anime',layers:[{effect:'neon_pong',scale:1,speed:1,density:1,intensity:1,hueShift:0}]}]};
ctx.api.register([builtin,custom]);
assert(ctx.api.packScenes.has('world_test_pong_title'),'Pong-titled imported scene registered');
assert(ctx.api.groups.find(group=>group.id==='anime').modes.includes('world_test_pong_title'),'Pong-titled scene in category');
assert(ctx.api.render(canvas,'world_test_pong_title',data,'music',null,{}),'imported Pong-title scene renders');
const pinball='world_beat_pinball';
let hit=false,respawn=false;
for(let i=0;i<350;i++){
    now+=16;
    data.beat=.92;
    ctx.api.render(canvas,pinball,data,'music',null,{});
    const state=ctx.api.states.get(canvas).pinball[0];
    if(state.targets.some(target=>!target.visible))hit=true;
    if(state.targets.some(target=>target.level>0))respawn=true;
}
assert(hit&&respawn,'pinball targets vanish and return on the next level');
console.log('PASS RC3: 420 jitter/track-reset frames, free Pong physics, no strings, paddle collision, imported Pong-title scene, and pinball target cycles.');

'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const body=fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const opener='// GTM 4.1.5: trusted, bounded scenery renderer.';
const start=body.indexOf(opener),end=body.indexOf('function gtm404RenderPacked(canvas,mode,data,paletteName,theme,visual){',start);
assert(start>0&&end>start);
const script=new vm.Script(body.slice(start,end)+'\n globalThis.paint=gtm415DrawSceneBackground;');
const sandbox={};vm.createContext(sandbox);script.runInContext(sandbox);
function mock(){const draws=[];const c={
    save(){},restore(){},beginPath(){},closePath(){},ellipse(){},moveTo(){},lineTo(){},stroke(){draws.push(['stroke',this.globalAlpha,this.lineWidth])},
    arc(){},fill(){draws.push(['fill',this.globalAlpha])},strokeRect(){draws.push(['rect',this.globalAlpha])},fillRect(x,y,w,h){draws.push(['fillRect',x,y,w,h,this.fillStyle,this.globalAlpha])},
    createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}},
};return {c,draws};}
const styles=['solid','arcade','storm','stars','nebula','aurora','ocean','sunset','forest','city'];
const complexity=[];
for(const style of styles){
  const scene={layers:[{effect:'neon_pong'}],background:{style,base:'#0f1535',accent:'#ca80ff',motion:.7,density:1}};
  const {c,draws}=mock();sandbox.paint(c,1080,100,scene,{homeReactiveVisualizerPongArena:'scene'}, {elapsed:9}, {live:true,beat:.8});
  assert(draws.length>0 && draws.length<200,'bounded drawing: '+style);
  assert.equal(draws[0][0],'fillRect');assert.equal(draws[0][1],0);assert.equal(draws[0][2],0);
  assert.equal(draws[0][3],1080);assert.equal(draws[0][4],100);
  complexity.push(draws.length);
}
assert(new Set(complexity).size>=6,'styles produce distinct draw paths');
const legacy={layers:[{effect:'crt_pulse'}]};const {c,draws}=mock();sandbox.paint(c,1080,100,legacy,{}, {elapsed:9}, {});
assert.equal(draws.length,0,'non-Pong legacy scenes remain transparent');
const change={layers:[{effect:'neon_pong'}],background:{style:'arcade',base:'#0b0f24',accent:'#c099ff'}};
const {c:ctx,draws:results}=mock();sandbox.paint(ctx,1080,100,change,{homeReactiveVisualizerPongArena:'forest',homeReactiveVisualizerPongBackgroundColors:'custom',homeReactiveVisualizerPongBgColor:'#224466',homeReactiveVisualizerPongBgAccent:'#bbeeff'},{elapsed:9},{live:false});
assert(results.some(item=>Array.isArray(item)&&item[0]==='fillRect'));
const behaviorSource=fs.readFileSync(path.join(__dirname,'src/visualizer-behaviors/runtime-414.js'),'utf8');
assert(!behaviorSource.includes('ctx.fillStyle=`rgba(255,255,255,${s.flash*.11})`'),'no white scoring wash');
assert(behaviorSource.includes('MATCH ${s.match} / ${seriesTarget}'),'match progress shown');
assert(behaviorSource.includes('RESET IN ${Math.ceil(s.gameOver)}s'),'championship reset announcement');
assert(behaviorSource.includes('const courtY=y=>'),'court action not hidden behind TV-size HUD');
assert(body.includes("homeReactiveVisualizerPongHudSize: 'couch'"),'TV-first HUD setting');
assert(body.includes("background:'#080e22'"),'stable dark underlay during transitions');
assert(body.includes('gtm415DrawSceneBackground(ctx,w,h,scene,'));
// Every scenery reacts differently to music while the backdrop stays opaque.
for(const style of styles){
 const scene={layers:[{effect:'neon_pong'}],background:{style,base:'#0f1535',accent:'#ca80ff',motion:.7,density:1,reactivity:1.2}};
 function render(reactivity,audio){const o=mock();sandbox.paint(o.c,1080,100,scene,
   {homeReactiveVisualizerPongArena:'scene',homeReactiveVisualizerPongBgReactivity:reactivity},{elapsed:10},audio);return o.draws;}
 const quiet=render('off',{live:true,low:1,mid:1,high:1,beat:1,rms:1});
 const music=render('dynamic',{live:true,low:1,mid:1,high:1,beat:1,rms:1});
 assert.notEqual(JSON.stringify(music),JSON.stringify(quiet),'music response for '+style);
 assert.equal(JSON.stringify(render('dynamic',{live:false,low:1,mid:1,high:1,beat:1,rms:1})),
   JSON.stringify(render('dynamic',{live:false,low:0,mid:0,high:0,beat:0,rms:0})),'no phantom music when paused '+style);
}
const renderStart=body.indexOf('function gtm404RenderPacked(canvas,mode,data,paletteName,theme,visual){');
const renderEnd=body.indexOf('function ',renderStart+20);
const renderBody=body.slice(renderStart,renderEnd);
assert.equal((renderBody.match(/gtm404FrameState\(canvas,mode\)/g)||[]).length,1,'frame clock advances only once per render');
assert(renderBody.indexOf('const frame=gtm404FrameState')<renderBody.indexOf('gtm415DrawSceneBackground'),
 'same elapsed frame drives scenery and Pong physics');
assert(body.includes("homeReactiveVisualizerPongBgReactivity: 'balanced'"));

console.log('PASS 4.1.6: ten music-reactive arenas, opaque reset, single frame tick, relocated HUD and safe transitions');

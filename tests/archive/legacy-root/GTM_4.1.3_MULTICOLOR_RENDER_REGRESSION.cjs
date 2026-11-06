'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const start=source.indexOf('// GTM 4.1.3: bounded, non-executable visualizer behavior runtime.');
const end=source.indexOf('function gtm404RegisterPacks(packs){',start);
assert(start!==-1&&end>start);
const test=`
const assert=globalThis.nodeAssert;
const events=[];
const gradient={addColorStop(){}};
const ctx={
    createRadialGradient(){return gradient},fillRect(...args){events.push(['rect',...args])},strokeRect(...args){events.push(['strokeRect',...args])},
    fillText(t,x,y){events.push(['text',String(t),x,y])},beginPath(){},arc(){},fill(){},stroke(){},
    moveTo(){},lineTo(){},save(){},restore(){},translate(){},rotate(){},globalAlpha:1
};
const frame={dt:1/60,behaviors:null,elapsed:0};
for(const paletteName of ['rainbow','music','auto','prism','gold']){
 for(const style of ['readable','vivid']){
  const env={ctx,w:1000,h:96,dpr:1,energy:.8,beat:.8,paletteName,settings:{
      homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'balanced',
      homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongStyle:style},frame};
  for(let i=0;i<40;i++){frame.elapsed+=1/60;assert(gtm413RunBehavior('neon_pong',frame,0,env));}
 }
}
assert(events.some(x=>x[0]==='text'&&x[1]==='00'),'score display');
assert(events.some(x=>x[0]==='text'&&x[1].includes('POWER')),'mode display');
assert(events.some(x=>x[0]==='strokeRect'),'scoreboard borders');
// Power label visible against dark plate and a white ball core are deliberate.
const drawText=gtm413PongDraw.toString();
assert(drawText.includes("'#f8ffff'")&&drawText.includes("rgba(3,7,18,.88)"));
console.log('PASS: Canvas draw across 5 palettes and 2 effect intensities, persistent high-contrast score and mode');
`;
vm.runInNewContext(source.slice(start,end)+test,{nodeAssert:assert,console},{timeout:45000});

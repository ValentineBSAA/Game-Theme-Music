'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const bundle=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const a=bundle.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.');
const b=bundle.indexOf('function gtm404RegisterPacks(packs){',a);
assert(a>=0&&b>a);
const source=bundle.slice(a,b);
const check=`
const assert=globalThis.assert;
for(const mode of ['classic','power']){
 const env={settings:{homeReactiveVisualizerPongMode:mode,homeReactiveVisualizerPongDifficulty:'balanced',
   homeReactiveVisualizerPongGoal:5,homeReactiveVisualizerPongSeries:'3',homeReactiveVisualizerPongResetSec:5},beat:.5};
 GTM414_PONG_POOL.clear();const s=gtm413PongCreate(env);let seen=0,champions=0,maxBurst=0;
 for(let i=0;i<90*900;i++){
   gtm413PongStep(s,1/90,env);
   seen=Math.max(seen,s.winsLeft+s.winsRight);
   champions=Math.max(champions,s.previousChampionship?1:0);
   maxBurst=Math.max(maxBurst,s.bursts.length);
   if(champions)break;
 }
 assert(seen>0,mode+' AI must finish matches');
 assert(champions>0,mode+' AI must finish a best-of-three series');
 assert(maxBurst<=8,mode+' burst cap');
 console.log('PASS '+mode+' simulation: natural AI match + championship completed');
}
`;
vm.runInNewContext(source+check,{assert,console},{timeout:30000});

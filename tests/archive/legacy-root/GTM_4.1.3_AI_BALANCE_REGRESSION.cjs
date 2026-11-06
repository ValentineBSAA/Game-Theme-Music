'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'dist/index.js'),'utf8');
const start=source.indexOf('// GTM 4.1.3: bounded, non-executable visualizer behavior runtime.');
const end=source.indexOf('function gtm404RegisterPacks(packs){',start);
const test=`
const assert=globalThis.nodeAssert;
for(const difficulty of ['casual','balanced','expert']){
 const env={settings:{homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:difficulty,homeReactiveVisualizerPongGoal:5},beat:.65};
 const s=gtm413PongCreate(env);let points=0,frames=0;
 while(s.winsLeft+s.winsRight<8&&frames<90*1800){
  const old=s.winsLeft+s.winsRight;
  const score=s.scoreLeft+s.scoreRight;
  gtm413PongStep(s,1/90,env);frames++;
  if(s.scoreLeft+s.scoreRight>score)points++;
 }
 assert.equal(s.winsLeft+s.winsRight,8,difficulty+' should complete repeated matches');
 assert(s.winsLeft>0&&s.winsRight>0,'both opponents should win on '+difficulty);
 console.log('PASS:',difficulty,'8 matches',s.winsLeft+'-'+s.winsRight,'frames',frames,'points',points);
}
`;
vm.runInNewContext(source.slice(start,end)+test,{nodeAssert:assert,console},{timeout:45000});

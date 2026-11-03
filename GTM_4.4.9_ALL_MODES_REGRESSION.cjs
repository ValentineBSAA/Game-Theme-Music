const fs=require('fs'),assert=require('assert'),vm=require('vm');
const path=require('path').join(__dirname,'dist','index.js');const src=fs.readFileSync(path,'utf8');
const slice=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i+2);assert(i>=0&&j>i,a);return src.slice(i,j)};
const base=fs.readFileSync(require('path').join(__dirname,'GTM_4.4.9_PONG_SCORING_REGRESSION.cjs'),'utf8');
const simulation=vm.runInNewContext(base.slice(0,base.indexOf('const t=Date.now()'))+';simulation',{require,console,process,__dirname});
const arr=[];const times=Date.now();
for(let mode=0;mode<12;mode++){
 const map=new Map(),store={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const ctx=vm.createContext({window:{localStorage:store},crypto:require('crypto').webcrypto,Uint32Array,Date,Math,JSON,console});vm.runInContext(simulation,ctx);
 const result=vm.runInContext(`(()=>{
  const env={settings:{homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongSeries:'endless'},arcade:{left:{human:false},right:{human:false}},beat:.5};
  const s=gtm413PongCreate(env);s.seed=${mode*123347+19111};gtm444PongNewMatch(s,true);s.gtm444Match.mode=${mode};
  GTM444_LEARN_DB.left.skill=.89;GTM444_LEARN_DB.right.skill=.89;
  let goals=0,points=[],prev=0,maxGap=0,last=0,maxX=0;
  for(let i=0;i<180*90;i++){
   gtm413PongStep(s,1/90,env);
   if(![s.ball.x,s.ball.y,s.ball.vx,s.ball.vy].every(Number.isFinite))throw Error('nonfinite ball');
   maxX=Math.max(maxX,Math.abs(s.ball.vx));
   const curr=GTM444_LEARN_DB.left.goals+GTM444_LEARN_DB.right.goals;
   if(curr>prev){goals++;points.push(+(i/90).toFixed(1));maxGap=Math.max(maxGap,i/90-last);last=i/90;}
   prev=curr;
  }
  return {mode:${mode},goals,points,maxGap:+Math.max(maxGap,180-last).toFixed(1),maxSpeed:maxX,misses:GTM444_LEARN_DB.left.misses+GTM444_LEARN_DB.right.misses,returns:GTM444_LEARN_DB.left.hits+GTM444_LEARN_DB.right.hits};
 })()`,ctx,{timeout:120000});
 assert(result.goals>0,`mode ${mode} failed to score in 3 minutes`);assert(result.maxGap<85,`mode ${mode} excessive scoreless gap ${result.maxGap}`);assert(result.maxSpeed<1.2,'ball speed bound');arr.push(result);console.log(JSON.stringify(result));
}
console.log('PASS 12/12 modes with max-learning AIs, no scoreless stretches >=85 seconds, 180s each. Elapsed ms',Date.now()-times);

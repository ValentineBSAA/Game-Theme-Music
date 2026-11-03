const fs=require('fs'), assert=require('assert'),vm=require('vm');
const path=process.argv[2]||require('path').join(__dirname,'dist','index.js');
const src=fs.readFileSync(path,'utf8');
const cut=(text,a,b)=>{const i=text.indexOf(a),j=text.indexOf(b,i+2);assert(i>=0&&j>i,a);return text.slice(i,j)};
const helpers=cut(src,'// GTM 4.4.4 Spectator Learning v1:','function gtm413PongCreate(env){');
const engine=cut(src,'function gtm413PongCreate(env){','function gtm413PongDraw(s,env){');
const keys=['fire','ice','lightning','plasma','comet','gravity','mirror','pulse','shadow','rainbow','magnet','vortex','shield','giant','shrink','warp','quake','meteor','storm','prism','solarflare','frostbite','cyclone','overdrive','portal','nova','eclipse','chromatic','thunderbolt','phase','nebula','ricochet'];
const simulation=`const GTM444_SPECTATOR_ONLY = true;
const GTM444_ARENAS = Array.from({length:12},(_,i)=>'arena'+i);
const GTM444_PADDLE_SKINS = Array.from({length:16},(_,i)=>'paddle'+i);
const GTM444_PADDLE_FX = ['fire','ice','plasma','rainbow','electric','reactive'];
const GTM414_PONG_POOL=new Map();const GTM414_PONG_PALETTES={red_blue:['#1','#2']};
const GTM413_POWER_NAMES=${JSON.stringify(keys)};
const GTM413_EFFECTS=Object.fromEntries(GTM413_POWER_NAMES.map(p=>[p,{label:p.toUpperCase(),rgb:'#fff',trail:'#bfb'}]));
function gtm444ScenePhase(t,period=26){return Math.floor(Math.max(0,t)/period);}
function gtm413PongRandom(s){let n=s.seed|0;n^=n<<13;n^=n>>>17;n^=n<<5;s.seed=n|0;return (n>>>0)/4294967296;}
function gtm414PongSignature(){return 'simulation';}
function gtm414PongRecord(s){return {winner:s.winner,match:s.match};}
function gtm417ArcadeBeginTransition(s,t,delay){s.gameOver=delay;s.gtmTransition=true;}
function gtm417ArcadeAdvanceTransition(s,dt,cb){if(!s.gtmTransition)return false;s.gameOver-=dt;if(s.gameOver<=0){s.gameOver=0;s.gtmTransition=false;cb();}return true;}
function gtm417ArcadeDelay(cfg,key,defaultVal,choices){return defaultVal;}
function gtm418ReadPlayers(){return {left:{human:false},right:{human:false},mode:'ai_ai'};}
function gtm428PongMindBall(){return false;}
function gtm428PongIsMorph(){return false;}
function gtm428PongMorph(){return false;}
${helpers}${engine}
`;
function run(seed,seconds,resetSkill=false){
 const map=new Map();const mock={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const ctx=vm.createContext({window:{localStorage:mock},crypto:require('crypto').webcrypto,Uint32Array,Date,Math,JSON,console});vm.runInContext(simulation,ctx,{timeout:10000});
 const metrics=vm.runInContext(`(()=>{
  const env={settings:{homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongSeries:'endless',homeReactiveVisualizerPongDifficulty:'adaptive'},arcade:{left:{human:false},right:{human:false}},beat:.5};
  const s=gtm413PongCreate(env);s.seed=${seed};gtm444PongNewMatch(s,true);
  ${resetSkill?`GTM444_LEARN_DB.left.skill=.89;GTM444_LEARN_DB.right.skill=.89;`:''}
  let previous=0,goals=0,goalTimes=[],misses=0,maxRally=0,maxGoalGap=0,lastGoal=0,oldHits=0;
  for(let frame=0;frame<${seconds}*90;frame++){
   gtm413PongStep(s,1/90,env);
   if(!Object.values(s.ball).every(Number.isFinite))throw Error('invalid ball');
   if(s.ball.vx>1.3||s.ball.vy>.9)throw Error('velocity out of bounds');
   maxRally=Math.max(maxRally,s.rally);oldHits=s.hitCount;
   const cur=GTM444_LEARN_DB.left.goals+GTM444_LEARN_DB.right.goals;
   if(cur>previous){goals+=cur-previous;goalTimes.push(Math.round(frame/90));maxGoalGap=Math.max(maxGoalGap,frame/90-lastGoal);lastGoal=frame/90;}previous=cur;
  }
  return {goals,goalTimes,maxGoalGap:Math.round(Math.max(maxGoalGap,${seconds}-lastGoal)),hits:s.hitCount,misses:GTM444_LEARN_DB.left.misses+GTM444_LEARN_DB.right.misses,maxRally,skills:[GTM444_LEARN_DB.left.skill,GTM444_LEARN_DB.right.skill],recoveries:s.ballRecoveries,match:s.match,mode:s.gtm444Match.mode};
 })()`,ctx,{timeout:120000});return metrics;
}
const t=Date.now();for(let seed=1;seed<=8;seed++)console.log('SEED',seed,JSON.stringify(run(seed*571273+83439,300,seed%3===0)));
console.log('Elapsed ms',Date.now()-t);

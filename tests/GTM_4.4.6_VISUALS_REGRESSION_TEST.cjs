const fs=require('fs'), assert=require('assert'),vm=require('vm');
const src=fs.readFileSync(require('path').join(__dirname,'../dist/index.js'),'utf8');
const base=fs.readFileSync(require('path').join(__dirname,'../dist/index.js'),'utf8');
const cut=(text,a,b)=>{const i=text.indexOf(a),j=text.indexOf(b,i+2);assert(i>=0&&j>i,a);return text.slice(i,j)};
// Key music subsystems remain completely unchanged in executable code.
for(const [a,b] of [['class AmbientController','class StoreController'],['class StoreController','function useAmbient'],['function gtm413PongCreate(env){','function gtm413PongDraw(s,env){']]){
 const p1=base.indexOf(a),p2=src.indexOf(a);
 if(p1>=0&&p2>=0&&src.includes(b)&&base.includes(b)){assert.strictEqual(cut(src,a,b),cut(base,a,b),a+' functional section unchanged');}
}
for(const s of ['const GTM_VERSION = "4.4.6";','const GTM444_SPECTATOR_ONLY = true;','function Gtm444VisualizersPage(){','function Gtm444ArcadeSpectatorPage(){','function Gtm446QuickActions','function Gtm446LearningDashboard','function gtm444PongFeedback','const GTM413_EFFECTS = Object.freeze({',"const GTM444_LEARN_KEY='gtm.spectator.learning.v1'"])
 assert(src.includes(s),'required preserved/surfaced '+s);
assert(!src.includes("const teamName=index=>env.arcade?."));
assert(src.includes("const teamName=index=>GTM444_SPECTATOR_ONLY?(index===0?'AI 1':'AI 2')"));
assert(src.includes('caption(leftName,w*.19,firstY,w*.19,`800 ${nameFont}px system-ui,sans-serif`,colors[0])'));
assert(src.includes("const powerLabel=armed?'POWER ARMED'"));
const settings=cut(src,'function GtmV3SettingsCenter() {','function GtmV3HealthPage() {');
assert(!settings.includes('Gtm430SettingsSplit'),'no automatic wrong-section sorter in Settings page');
assert(!settings.includes('Gtm440VisualizerBrowser'),'no duplicate visualizer browser');
assert(!settings.includes('Gtm404VisualizerPackManager'),'no duplicate pack manager');
assert(!settings.includes("label:'Shuffle all visualizers on track change'"),'no duplicate shuffle controls in general settings');
assert(settings.includes("label:'Automatic 8-second crossfade'") && settings.includes('rollback_yt_dlp'),'preserve music and update helpers');
const regular=cut(src,'function Gtm444VisualizersPage(){','function Gtm446LearningDashboard');
const arcade=cut(src,'function Gtm444ArcadeSpectatorPage(){','function GtmV3SettingsCenter()');
assert(regular.includes('Gtm446QuickActions')&&regular.includes('Gtm444ColorControls')&&regular.includes('Gtm444FooterLayout'));
assert(arcade.includes('Gtm446QuickActions')&&arcade.includes('Gtm446LearningDashboard')&&arcade.includes('Gtm444FooterLayout'));
assert(!arcade.includes('PongMode|PongGoal|PongSeries|PongBallSpeed'),'do not show modes that spectator overrides');
assert(src.includes("gtm444SettingsWriteQueue=committed.catch"),'serialized write queue kept');
assert(src.includes('get_visualizer_shuffle_preference'),'sidecar shuffle remains');
assert(src.includes('function gtm446EmptyLearning()'),'explicit reset for learning');
const keys=['fire','ice','lightning','plasma','comet','gravity','mirror','pulse','shadow','rainbow','magnet','vortex','shield','giant','shrink','warp','quake','meteor','storm','prism','solarflare','frostbite','cyclone','overdrive','portal','nova','eclipse','chromatic','thunderbolt','phase','nebula','ricochet'];
const effects=cut(src,'const GTM413_EFFECTS = Object.freeze({','const GTM413_POWER_NAMES=');for(const k of keys)assert(effects.includes(k+':{'),k);
console.log('PASS 4.4.6 menu source audit, 32 effects, stable scoreboard identities, settings ownership, version, music safety, sidecar shuffle');
// Simulate the original physics/AI engine from the untouched baseline.
const helpers=cut(src,'// GTM 4.4.4 Spectator Learning v1:','function gtm413PongCreate(env){');
const engine=cut(src,'function gtm413PongCreate(env){','function gtm413PongDraw(s,env){');
const storage=new Map();let mock={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const boot=`const GTM444_SPECTATOR_ONLY = true;
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
${helpers}${engine}`;
const ctx=vm.createContext({window:{localStorage:mock},crypto:require('crypto').webcrypto,Uint32Array,Date,Math,JSON,console});vm.runInContext(boot,ctx);
const call=name=>vm.runInContext(name,ctx);
let env={settings:{homeReactiveVisualizerPongGoal:3,homeReactiveVisualizerPongSeries:'endless',homeReactiveVisualizerPongDifficulty:'adaptive'},arcade:{left:{human:false},right:{human:false}},beat:.5};
const state=call('gtm413PongCreate')(env);let hits=0,goals=0,misses=0,prev=0;
for(let frame=0;frame<7200;frame++){call('gtm413PongStep')(state,1/60,env);const b=state.ball;
 assert(Object.values(b).every(Number.isFinite),'finite velocity '+frame);
 assert(Math.abs(b.vx)<1.2&&Math.abs(b.vy)<.8,'bounded velocity '+frame);
 hits=Math.max(hits,state.hitCount);const v=state.scoreLeft+state.scoreRight;if(v>prev)goals+=v-prev;prev=v;}
const memory=call('GTM444_LEARN_DB'); misses=memory.left.misses+memory.right.misses;
assert(hits>5&&goals>0&&misses>0&&memory.left.hits+memory.right.hits>10);
const saved=memory.left.misses;
call('gtm444LearningSave')(true);
assert(JSON.parse([...storage.values()][0]).left.misses===saved);
// Reset uses same object and same schema, and does not affect UI settings storage.
const fresh=vm.runInContext("({version:1,matches:0,left:gtm444NewBrain(null,.52),right:gtm444NewBrain(null,.54),games:{}})",ctx);
Object.assign(memory,fresh);call('gtm444LearningSave')(true);
assert(memory.left.hits===0&&memory.right.misses===0&&JSON.parse([...storage.values()][0]).matches===0);
console.log('PASS real Pong 120-second simulation, returns/misses, bounded ball, local persisted learning, manual reset. goals='+goals+' hits='+hits);

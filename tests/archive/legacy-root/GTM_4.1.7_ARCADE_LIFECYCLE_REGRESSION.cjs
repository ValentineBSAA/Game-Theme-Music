'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const bundle=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const start=bundle.indexOf('// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.');
const end=bundle.indexOf('function gtm404RegisterPacks(packs){',start);
assert(start>=0&&end>start,'arcade behavior source located');
const src=bundle.slice(start,end);
const script=`
const a=globalThis.assert;
a.equal(gtm417ArcadeDelay({},'round',1.5,[.5,1,1.5,2,3,5]),1.5);
a.equal(gtm417ArcadeDelay({round:.5},'round',1.5,[.5,1,1.5,2,3,5]),.5);
a.equal(gtm417ArcadeDelay({round:999},'round',1.5,[.5,1,1.5,2,3,5]),1.5);
let completed=0;const dummy={gameOver:0,resetCountdown:0};
gtm417ArcadeBeginTransition(dummy,'round',1.5);
a.equal(dummy.gameOver,1.5);
for(let i=0;i<90;i++){
 const active=gtm417ArcadeAdvanceTransition(dummy,1/90,()=>completed++);
 a.equal(active,true);
}
a.equal(completed,0);
a.ok(dummy.gameOver>.49&&dummy.gameOver<.51);
for(let i=0;i<60;i++)gtm417ArcadeAdvanceTransition(dummy,1/90,()=>completed++);
a.equal(completed,1,'transition fires completion once');
a.equal(dummy.gameOver,0);
a.equal(dummy.resetCountdown,0);
gtm417ArcadeAdvanceTransition(dummy,1/90,()=>completed++);
a.equal(completed,1,'no repeated callbacks');
// A future game has a separate name, lifecycle state and score model.
a.equal(gtm417RegisterArcadeGame('skee_ball_test',{
 create(){return {score:0}}, step(s){s.score++}, draw(){}},{title:'Skee-Ball prototype',scoring:'rings'}),true);
a.equal(GTM417_ARCADE_GAMES.get('skee_ball_test').scoring,'rings');
a.equal(GTM417_ARCADE_GAMES.get('skee_ball_test').simHz,90);
a.equal(GTM417_ARCADE_GAMES.has('neon_pong'),true);
a.equal(gtm417RegisterArcadeGame('../unsafe',{},{}),false,'reject untrusted IDs');
function newGame(overrides={}){
 GTM414_PONG_POOL.clear();
 const env={settings:{homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongGoal:5,homeReactiveVisualizerPongSeries:'3',...overrides},beat:.25};
 return [gtm413PongCreate(env),env];
}
// Default rematch: 1.5s, not the old 5-second blocking wait.
{
 const [s,env]=newGame();s.scoreLeft=4;
 gtm413PongScore(s,'left',5,env.settings);
 a.equal(s.transitionKind,'round');a.equal(s.gameOver,1.5);
 for(let i=0;i<135;i++)gtm413PongStep(s,1/90,env);
 a.equal(s.match,2,'next match automatically starts');a.equal(s.scoreLeft,0);
 a.equal(s.winsLeft,1,'series score persists');
}
// Champion: 3s, not the old 10 seconds.
{
 const [s,env]=newGame();s.scoreLeft=4;s.winsLeft=1;
 gtm413PongScore(s,'left',5,env.settings);
 a.equal(s.transitionKind,'championship');a.equal(s.gameOver,3);
 for(let i=0;i<270;i++)gtm413PongStep(s,1/90,env);
 a.equal(s.match,1);a.equal(s.winsLeft,0);a.ok(s.previousChampionship);
 a.equal(s.previousChampionship.winner,'left');
}
// User choices are respected for both types of reset.
{
 const [s,env]=newGame({homeReactiveVisualizerPongRoundPauseSec:.5,homeReactiveVisualizerPongChampionPauseSec:1});
 s.scoreRight=4;gtm413PongScore(s,'right',5,env.settings);a.equal(s.gameOver,.5);
 const [c,ce]=newGame({homeReactiveVisualizerPongRoundPauseSec:.5,homeReactiveVisualizerPongChampionPauseSec:1});
 c.winsRight=1;c.scoreRight=4;gtm413PongScore(c,'right',5,ce.settings);a.equal(c.gameOver,1);
}
console.log('PASS arcade registry, future-game isolation, configurable 1.5s/3s transitions and championship continuity');
`;
vm.runInNewContext(src+script,{assert,console},{timeout:30000});
assert(bundle.includes('homeReactiveVisualizerPongRoundPauseSec: 1.5'),'new profile default');
assert(bundle.includes('homeReactiveVisualizerPongChampionPauseSec: 3'),'champion default');
assert(bundle.includes('homeReactiveVisualizerPongResetSec: 10, // Legacy'),'old field retained but unused by new lifecycle');

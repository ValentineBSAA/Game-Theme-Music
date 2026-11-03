'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/visualizer-behaviors/runtime-414.js'),'utf8');
const box={Math,console,Date,gtm418ReadPlayers:()=>({human1:false,human2:false,left:{human:false},right:{human:false},paused:false}),gtm418DrawSessionStatus(){},gtm418ConsumeMenuAction:()=>false};
vm.createContext(box);
vm.runInContext(source+'\nthis.impl=GTM413_BEHAVIORS.get("neon_pong");this.pool=GTM414_PONG_POOL;',box);
let ops=0,draws=0;
const gradient=()=>({addColorStop(){}});
const context=new Proxy({fillStyle:'#ffffff',strokeStyle:'#ffffff',globalAlpha:1,
 createLinearGradient:gradient,createRadialGradient:gradient},
 {get(target,key){if(key in target)return target[key];return (...args)=>{ops++;};}});
const modes=['classic','competitive','power','morph','mindball','chaos'];
for(const mode of modes){
 box.pool.delete('championship');
 const settings={homeReactiveVisualizerPongMode:mode,homeReactiveVisualizerPongDifficulty:'adaptive',
  homeReactiveVisualizerPongGoal:7,homeReactiveVisualizerPongStyle:'vivid',homeReactiveVisualizerPongFxLevel:'high',
  homeReactiveVisualizerPongBgReactivity:'dynamic',homeReactiveVisualizerPongTeamPalette:'red_blue',
  homeReactiveVisualizerPongDefenseMorph:'fortress',homeReactiveVisualizerPongAttackMorph:'thunder'};
 const env={settings,ctx:context,w:1000,h:550,dpr:1,frame:{elapsed:0},energy:.8,lo:.8,mid:.5,hi:.4,beat:.9,
  paletteName:'music',arcade:{human1:false,human2:false,left:{human:false},right:{human:false}},
  scene:{background:{style:'stars'}}};
 const sim=box.impl.create(env);let prior=ops;
 // 15 minutes per mode. Render once per second to check effects while keeping test fast.
 for(let i=0;i<54000;i++){
  box.impl.step(sim,1/60,env);
  if(i%60===0){env.frame.elapsed=i/60;box.impl.draw(sim,env);draws++;
   assert(ops-prior<2000000,`Pong ${mode} canvas operations runaway`);prior=ops;}
  for(const key of ['left','right','scoreLeft','scoreRight','match','matchElapsed','simTime',
   'morphCdDefenseLeft','morphCdAttackLeft']){
   assert(Number.isFinite(sim[key]),`Pong ${mode} nonfinite ${key} at ${i}`);
  }
  assert(sim.trails.length<=80&&sim.bursts.length<=10,`Pong ${mode} effect arrays exceeded budget`);
  assert(Number.isFinite(sim.ball.x)&&Number.isFinite(sim.ball.y)&&Number.isFinite(sim.ball.vx)&&Number.isFinite(sim.ball.vy),`Pong ${mode} ball trajectory became invalid`);
 }
 console.log('PASS Pong 15-minute gameplay/draw stress:',mode);
}
assert(draws===5400);console.log('PASS 90-minute simulated Pong soak across all modes; actual GPU/reboot behavior requires Steam Deck verification');

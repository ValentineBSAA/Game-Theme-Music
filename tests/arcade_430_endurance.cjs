'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');const code=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const man=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/manifest.json')));
let now=0;let mode='ai_ai',paused=false,joinEpoch=0;
const box={console,Math,Date,performance:{now:()=>now},snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'adaptive'},
 gtm418ReadPlayers:()=>({side:'left',mode,requested:mode,joinEpoch,paused,human1:false,human2:false,
  left:{x:0,y:0,lb:0,rb:0},right:{x:0,y:0,lb:0,rb:0}}),
 gtm418ProgramOptionValue:(s,o)=>o?.choices?.[0]?.value??1,gtm418DrawSessionStatus:()=>{}};
vm.createContext(box);
vm.runInContext(code+'\nthis.games=GTM421_GAMES;this.draw=gtm421DrawArcade;this.pools=GTM421_INSTANCE_POOLS;',box);
const fake={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},closePath(){},fillText(){}};
const input={p1:{x:0,y:0,lb:0,rb:0},p2:{x:0,y:0,lb:0,rb:0},human1:false,human2:false,mode:'ai_ai'};
for(const [id,game] of Object.entries(box.games)){
 const scene=man.scenes.find(s=>s.id===id);assert(scene,'Missing scene: '+id);
 const sim=game.create();const canvas={};
 // Ten-minute simulated AI play, plus long stalls and repeated scene mounts.
 for(let i=0;i<36000;i++){
  game.step(sim,1/60,input,{beat:i%60<3?.9:0,low:.4,mid:.2},{});
  if(i%180===0){now+=(i%720===0?750:16.667);box.draw(fake,canvas,scene,id,
    {physicsDt:i%720===0?.75:1/60},{beat:.4,low:.4},1280,250);}
  for(const key of ['score','score1','score2','wave','round','misses','base','elapsed']){
   if(sim[key]!==undefined)assert(Number.isFinite(sim[key]),`${id}: nonfinite ${key} at ${i}`);
  }
  for(const key of ['particles','bursts','tracers','shots','notes','enemies','targets','hazards']){
   if(sim[key])assert(sim[key].length<=72,`${id}: unbounded ${key} at ${i} = ${sim[key].length}`);
  }
 }
 assert(box.pools.get(canvas).size<=24,`${id}: mode-state pool grew`);
 console.log('PASS 10-minute bounded-state/stalled-frame test',id);
}
console.log('PASS 40-minute simulated active AI-game soak; does not establish physical SteamOS/GPU stability');

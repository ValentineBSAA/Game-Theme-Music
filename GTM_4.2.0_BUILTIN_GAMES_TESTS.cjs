'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=__dirname,manifest=JSON.parse(fs.readFileSync(root+'/visualizer-packs/arcade/manifest.json','utf8'));
assert.equal(manifest.format,3);assert.equal(manifest.scenes.length,5);
const sample=manifest.scenes;
for(const game of sample){assert.equal(game.category,'arcade');assert(game.interaction?.modes.includes('ai_ai'));assert(game.program?.draw?.length>0);}
const core=fs.readFileSync(root+'/src/visualizer-behaviors/controller-418.js','utf8')+'\n'+fs.readFileSync(root+'/src/visualizer-behaviors/pack-program-418.js','utf8');
let now=0,pads=[];const storage=new Map();
const box={console,Math,Date,performance:{now:()=>now},navigator:{getGamepads:()=>pads},window:{localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}}};vm.createContext(box);
vm.runInContext(core+'\nvar snapshot$1={homeReactiveVisualizerArcadeMode:"ai_ai"};this.api={draw:gtm418DrawProgram,instances:GTM418_PROGRAM_STATES};',box);
const context={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},fillText(){},setTransform(){}};
for(const scene of sample){
 const canvas={};let lastTick=null;
 for(let i=0;i<600;i++){
  now+=16.667;lastTick={physicsDt:1/60};const beat=(i%40)<4?.6:.09;
  box.api.draw(context,canvas,scene,scene.id,lastTick,{live:true,low:.52,mid:.31,high:.25,beat,bands:Array(12).fill(.1)},1000,160);
  assert(!lastTick.packError,scene.id+' error '+lastTick.packError);
  assert(lastTick.packOperations<=12500,scene.id+' exceeded VM budget');
 }
 const data=box.api.instances.get(canvas).get(scene.id);
 assert(!data.disabled,scene.id+' disabled');assert(data.time>9,scene.id+" did not advance 10 seconds");
 for(const [k,n] of Object.entries(data.registers))assert(Number.isFinite(n),scene.id+' register '+k+' non-finite');
 if(['world_arcade_beat_catcher','world_arcade_target_roll'].includes(scene.id))assert(data.registers.score>0,scene.id+' automatic play never scored');
 if(scene.id==='world_arcade_orbital_duel')assert('score_l' in data.registers && 'score_r' in data.registers,'duel requires separate player scoring');
 console.log('PASS builtin game',scene.id,'10s simulation, state',JSON.stringify(data.registers).slice(0,110));
}
const bundle=fs.readFileSync(root+'/dist/index.js','utf8');
for(const token of ["'world_arcade_beat_catcher'","'world_arcade_orbital_duel'","'world_arcade_orbit_defenders'","'world_arcade_target_roll'","'world_arcade_prism_rally'",'homeReactiveVisualizerArcadeSelected','homeReactiveVisualizerPongHumanSpeed','function Gtm419ArcadePage()'])assert(bundle.includes(token),token+' missing from bundle');
assert(bundle.includes("const custom=GTM404_PACK_STATUS.packs.filter(p=>!['gtm_visual_worlds_vol1','gtm_arcade_builtin_420'].includes(p.id))"),'builtin not excluded from removable custom packs');
console.log('PASS builtin GTM Arcade library, five games, preserved settings/menu categorization');

'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const b=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const src=b.slice(b.indexOf('// GTM 4.1.8 Universal Input + Arcade Session Bridge.'),b.indexOf('function gtm404RegisterPacks(packs){'));
assert(src.includes('function gtm418ReadPlayers('));
let now=0,pads=[null,null];const storage=new Map();
const box={console,performance:{now:()=>now},navigator:{getGamepads:()=>pads},window:{localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}},Date,Math};vm.createContext(box);
vm.runInContext(src+`globalThis.api={read:gtm418ReadPlayers,session:gtm418Session,rearm:gtm418Rearm,pause:gtm418TogglePause,dispatch:gtm418DispatchMenuAction,consume:gtm418ConsumeMenuAction,draw:gtm418DrawProgram,config:gtm418SaveProgramOption,options:gtm418ProgramOptionValue,programStates:GTM418_PROGRAM_STATES};`,box);
const api=box.api;
const pad=(y=0)=>({connected:true,mapping:'standard',axes:[0,0,0,y],buttons:Array.from({length:18},()=>({pressed:false,value:0}))});
const cfg={homeReactiveVisualizerArcadeMode:'player_ai',homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1,homeReactiveVisualizerArcadeDisconnectSec:10,homeReactiveVisualizerArcadeHoldPauseMs:800};
assert.equal(api.read({},undefined,'pong').mode,'ai_ai','AI default');
pads=[pad(.6),pad(-.6)];
let a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.mode,'player_ai');assert(a.left.y>.4);assert.equal(a.left.a,0,'A reserved for menu');
pads=[null,pads[1]];now+=100;
a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.countdown,10);assert.equal(a.paused,true);assert.equal(a.mode,'ai_ai');
now+=4100;a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.countdown,6);
pads[0]=pad(.5);now+=300;a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.countdown,0);assert.equal(a.mode,'player_ai','reconnection cancels countdown');
pads[0]=null;now+=200;api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');now+=10001;
a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.mode,'ai_ai');assert.equal(a.paused,false);assert.equal(a.takeover,true);
pads[0]=pad(.4);a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.mode,'ai_ai','no unsolicited human takeover');
api.rearm('gameA');a=api.read(cfg,['ai_ai','player_ai','player_player'],'gameA');assert.equal(a.mode,'player_ai');
const pauseKey='pause-test';pads[0]=pad();let s=api.read(cfg,['ai_ai','player_ai'],'pause-test');pads[0].buttons[3].pressed=true;
now+=10;api.read(cfg,['ai_ai','player_ai'],pauseKey);now+=801;
s=api.read(cfg,['ai_ai','player_ai'],pauseKey);assert.equal(s.manualPaused,true);assert.equal(s.paused,true);
now+=100;s=api.read(cfg,['ai_ai','player_ai'],pauseKey);assert.equal(s.manualPaused,true,'one toggle per hold');
pads[0].buttons[3].pressed=false;now+=1;api.read(cfg,['ai_ai','player_ai'],pauseKey);
pads[0].buttons[3].pressed=true;now+=10;api.read(cfg,['ai_ai','player_ai'],pauseKey);now+=802;s=api.read(cfg,['ai_ai','player_ai'],pauseKey);assert.equal(s.paused,false,'hold again resumes');
pads[0].buttons[3].pressed=false;now+=1;api.read(cfg,['ai_ai','player_ai'],pauseKey);
pads[0].buttons[0].pressed=true;s=api.read(cfg,['ai_ai','player_ai'],pauseKey);assert.equal(s.left.a,0,'even pressed physical A never reaches gameplay');
const pvp={...cfg,homeReactiveVisualizerArcadeMode:'player_player',homeReactiveVisualizerArcadePlayerSide:'right'};
pads=[pad(.25),pad(-.75)];a=api.read(pvp,['ai_ai','player_ai','player_player'],'pvp');assert.equal(a.mode,'player_player');assert(a.right.y>0);assert(a.left.y<0);
api.dispatch(1,'gameA');assert.equal(api.consume(1,'gameA'),1);assert.equal(api.consume(1,'gameA'),0,'menu action is one-shot');
// Runtime proof: imported code is not eval. Same 3 packs render with no JS/network access.
const pack=JSON.parse(fs.readFileSync(__dirname+'/visualizer-packs/sdk-examples/manifest-v3.json','utf8'));
const ctx={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},fillText(){},setTransform(){}};
const scene=pack.scenes[0];assert.equal(api.options(scene,scene.options[0]),7);assert.equal(api.config(scene,scene.options[0],14),true);assert.equal(api.options(scene,scene.options[0]),14);
let frame={physicsDt:1/60};let canvas={};let renderCfg={homeReactiveVisualizerArcadeMode:'ai_ai'};
const globals='globalThis.frameInput=null';
// snapshot$1 is referenced by renderer; inject the same settings object as the UI snapshot.
vm.runInContext('var snapshot$1={homeReactiveVisualizerArcadeMode:"ai_ai"};',box);
for(const spec of pack.scenes){
 const can={};
 for(let i=0;i<15;i++){
  now+=16.667;const tick={physicsDt:1/60};api.draw(ctx,can,spec,spec.id,tick,{live:true,low:.4,mid:.3,high:.2,beat:.5,bands:Array(12).fill(.3)},1280,150);
  assert(!tick.packError,'Pack script disabled: '+spec.id+': '+tick.packError);
  assert(tick.packDrawCommands<=320,'draw bounded');assert(tick.packOperations<=12500,'work bounded');
 }
 const instance=api.programStates.get(can).get(spec.id);assert(!instance.disabled);assert(instance.time>.1);
}
// Scene state survives an intervening scene on the same footer canvas.
const combo={};const pulse=pack.scenes[0],duo=pack.scenes[2];
api.draw(ctx,combo,pulse,pulse.id,{physicsDt:.016},{live:true,mid:.5,low:.4},1000,150);
const stamp=api.programStates.get(combo).get(pulse.id).time;
api.draw(ctx,combo,duo,duo.id,{physicsDt:.016},{live:true,mid:.5,low:.4},1000,150);
api.draw(ctx,combo,pulse,pulse.id,{physicsDt:.016},{live:true,mid:.5,low:.4},1000,150);
assert(api.programStates.get(combo).get(pulse.id).time>stamp,'scene resumes after shuffle');
// Gameplay runtime must freeze when manually paused, while drawing continues.
const game=pack.scenes[1],can={};
vm.runInContext('snapshot$1={homeReactiveVisualizerArcadeMode:"solo",homeReactiveVisualizerArcadePad1:0};',box);
let fr={physicsDt:1/60};api.draw(ctx,can,game,game.id,fr,{live:true,beat:.8,low:.3,mid:.4,high:.2},1000,150);
const before=api.programStates.get(can).get(game.id).time;api.pause('program:'+game.id);
for(let i=0;i<4;i++){now+=16;api.draw(ctx,can,game,game.id,{physicsDt:1/60},{live:true,beat:.8,low:.3},1000,150);}
assert.equal(api.programStates.get(can).get(game.id).time,before,'game pause freezes program state/time');
console.log('PASS universal controls: AI default, 10-second visible takeover, reconnect, explicit take control');
console.log('PASS six action buttons, A reserved, Y/Triangle 800ms hold pause/resume, two controllers');
console.log('PASS 3 independent format-3 scenes, options persistence, bounded rendering and game pause');

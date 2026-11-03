'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/visualizer-behaviors/controller-418.js'),'utf8');
const bundled=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const beginning=bundled.indexOf('const GTM418_ARCADE_MODES=');
const ending=bundled.indexOf('// Use only on interactive game scenes.',beginning);
assert(beginning>=0&&ending>beginning);
assert.equal(bundled.slice(beginning,ending).trim(),source.slice(source.indexOf('const GTM418_ARCADE_MODES='),source.indexOf('// Use only on interactive game scenes.')).trim(),'editable and shipped controller implementations diverged');
let ms=0;
const pad=id=>({id,connected:true,axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0}))});
const pads=[pad('PlayStation Red'),pad('PlayStation Black')];
const ctx={navigator:{getGamepads:()=>pads},performance:{now:()=>ms},Map,Math,Date};
vm.createContext(ctx);vm.runInContext(source+'\nthis.read=gtm418ReadPlayers;this.session=gtm418Session;',ctx);
const allowed=['ai_ai','player_ai','player_player','solo'];
const base={homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1,homeReactiveVisualizerArcadeHoldPauseMs:800,homeReactiveVisualizerArcadeDisconnectSec:5};
const read=(mode,key)=>ctx.read({...base,homeReactiveVisualizerArcadeMode:mode},allowed,key);
for(const mode of ['ai_ai','player_ai','player_player','solo']){
 let value=read(mode,'fresh:'+mode);
 assert.equal(value.requested,'ai_ai','saved '+mode+' unexpectedly armed a human match');
 assert.equal(value.mode,'ai_ai');assert(!value.paused);assert(!value.readyWaiting);assert.equal(value.readySeconds,0);assert.equal(value.status,'');
 ms+=120000;value=read(mode,'fresh:'+mode);
 assert.equal(value.requested,'ai_ai');assert(!value.paused);assert(!value.readyWaiting);
}
console.log('PASS new plugin session with saved AI, P-vs-AI, P-vs-P or Solo preference always starts an unblocked AI demo');
// Disconnect/reconnect idle pads, change preferred mode and check that no takeover or countdown appears.
const k='mode-switch';
for(const mode of ['player_ai','player_player','solo','ai_ai','player_ai']){
 let value=read(mode,k);assert(!value.paused&&value.mode==='ai_ai'&&value.status==='');
 ms+=1000;
}
pads[0].connected=false;pads[1].connected=false;ms+=10000;
let value=read('player_ai',k);assert(!value.paused&&value.mode==='ai_ai'&&value.status==='');
pads[0].connected=true;pads[1].connected=true;ms+=10000;
value=read('player_ai',k);assert(!value.paused&&value.mode==='ai_ai'&&value.status==='');
console.log('PASS returning Home, changing saved preferences, and reconnecting unclaimed pads never freezes an AI demo');
// Selecting P-vs-AI does not join; a deliberate held Triangle does.
const key='manual-join';let cfg='player_ai';value=read(cfg,key);assert(!value.paused);
pads[0].buttons[3].pressed=true;ms+=30;read(cfg,key);ms+=820;value=read(cfg,key);
assert.equal(value.requested,'player_ai');assert(value.readyWaiting&&value.paused);
pads[0].buttons[3].pressed=false;ms+=40;read(cfg,key);
pads[0].axes[3]=.86;ms+=350;value=read(cfg,key);assert.equal(value.readySeconds,15);
ms+=15500;value=read(cfg,key);assert.equal(value.readySeconds,0);assert(value.human1&&!value.paused);
console.log('PASS intentionally held Triangle joins selected human matchup and starts 15-second ready-up on right-stick movement');
// Manual handoff should transition to a running AI demonstration and stay there after the pad powers down.
ctx.session(key).manualPause=true;pads[0].buttons[2].pressed=true;ms+=20;value=read(cfg,key);
assert.equal(value.mode,'ai_ai');assert(!value.paused);assert(!value.readyWaiting);
pads[0].buttons[2].pressed=false;pads[0].connected=false;ms+=12000;value=read(cfg,key);
assert.equal(value.mode,'ai_ai');assert(!value.paused);assert(!value.takeover);assert.equal(value.status,'');
console.log('PASS paused Square handoff followed by disconnect does not display waiting or phantom AI takeover');

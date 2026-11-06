'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const text=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const start=text.indexOf('// GTM 4.1.8 Universal Input + Arcade Session Bridge.');
const end=text.indexOf('// GTM 4.1.8',start+1)>=0?text.indexOf('function gtm404RegisterPacks(packs){',start):text.length;
const ctl=fs.readFileSync(__dirname+'/src/visualizer-behaviors/controller-418.js','utf8'); // source synchronized into bundle
assert(ctl.includes('function gtm418ReadPlayers('),'input bridge present');
let now=1000,pads=[];
const pad=(id,ry=0)=>({id,connected:true,axes:[0,0,0,ry],buttons:Array.from({length:18},()=>({pressed:false,value:0}))});
const ctx={console,Date,performance:{now:()=>now},navigator:{getGamepads:()=>pads},Math};vm.createContext(ctx);
vm.runInContext(ctl+`globalThis.api={read:gtm418ReadPlayers,devices:gtm419AvailablePads,label:gtm419PadLabel,choices:gtm419ControllerChoices,session:gtm418Session};`,ctx);
const api=ctx.api;
const opt={homeReactiveVisualizerArcadeMode:'player_player',homeReactiveVisualizerArcadePlayerSide:'left',homeReactiveVisualizerArcadePad1:1,homeReactiveVisualizerArcadePad2:2,homeReactiveVisualizerArcadeDisconnectSec:10};
pads=[pad('Steam Deck'),pad('Wireless Controller'),pad('Xbox Wireless Controller')];
let result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.mode,'player_player');assert.equal(api.devices().length,3);
assert.equal(api.choices().length,3);assert.match(String(api.choices()[2][1]),/Xbox/);
// Idle third controller must not trigger recovery.
pads[0]=null;now+=32;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.countdown,0);assert.equal(result.mode,'player_player');
// Player 2 disconnect: countdown 10, eventually AI, no loss of P1 ownership.
pads[2]=null;now+=100;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.countdown,10);assert(result.paused);
now+=10050;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.mode,'ai_ai');assert(result.takeover);
// Intent must originate from ASSIGNED physical controller after takeover.
pads[0]=pad('Steam Deck',1);now+=50;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');assert.equal(result.mode,'ai_ai');
pads[1].axes[3]=0;now+=10;api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
pads[1].axes[3]=.75;now+=20;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');assert.equal(result.mode,'ai_ai');
pads[1].axes[3]=0;now+=20;api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
pads[1].axes[3]=-.80;now+=20;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.mode,'player_ai','P1 reclaims without menu');assert(result.human1&&!result.human2);
// Rejoining P2 does not auto-seize its paddle; two separate flicks required.
pads[2]=pad('Xbox Wireless Controller',.15);now+=80;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');assert.equal(result.mode,'player_ai');
pads[2].axes[3]=0;now+=20;api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
pads[2].axes[3]=.78;now+=30;api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
pads[2].axes[3]=0;now+=20;api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
pads[2].axes[3]=-.81;now+=40;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');
assert.equal(result.mode,'player_player','P2 reclaims correctly');
// A different device replacing assigned slot must not steal the team.
pads[2]=pad('Different device');now+=16;result=api.read(opt,['ai_ai','player_ai','player_player'],'multitest');assert(!result.human2);
// Confirm menu pagination is 7 choices + 2 navigation buttons + implicit cancel.
assert(text.includes('function Gtm419SafeDropdown('));assert(text.includes('choices.slice(normalized*7,(normalized+1)*7)'));
assert(text.includes('backups.slice(0,10)'));
assert(text.includes("id: 'arcade', label: 'Arcade'"));
assert(text.includes("{id:'arcade',label:'GTM Arcade'"));
assert(text.includes("function Gtm419ArcadePage()"));
console.log('PASS 3 controllers, assigned-only disconnect, 10 sec takeover, P1/P2 right-stick reclaim, anti-slot-steal');
console.log('PASS Arcade page/category and paginated dropdown limit');

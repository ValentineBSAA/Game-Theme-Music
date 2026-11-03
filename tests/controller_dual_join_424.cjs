'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctl=fs.readFileSync(path.join(__dirname,'../src/visualizer-behaviors/controller-418.js'),'utf8');
let now=0;
const pad=id=>({id,connected:true,axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0}))});
const pads=[];pads[0]=pad('Steam Deck');pads[1]=pad('PlayStation Wireless Controller Red');pads[3]=pad('PlayStation Wireless Controller Black');
const ctx={Math,Date,Map,performance:{now:()=>now},navigator:{getGamepads:()=>pads}};
vm.createContext(ctx);vm.runInContext(ctl+'\nthis.read=gtm418ReadPlayers; this.session=gtm418Session;',ctx);
const cfg={homeReactiveVisualizerArcadeMode:'ai_ai',homeReactiveVisualizerArcadePad1:0,homeReactiveVisualizerArcadePad2:1,homeReactiveVisualizerArcadeHoldPauseMs:800};
const both=['ai_ai','solo','player_ai','player_player'];
const read=(key='dual',allowed=both)=>ctx.read(cfg,allowed,key);
const button=(index,code,pressed)=>pads[index].buttons[code].pressed=pressed;
const hold=(index,key='dual',allowed=both)=>{button(index,3,true);read(key,allowed);now+=810;return read(key,allowed)};
let s=read();assert.equal(s.mode,'ai_ai');assert(!s.paused);
// Two BT controllers claim in reverse Gamepad API order. Nobody takes Steam Deck.
s=hold(3);assert.equal(s.requested,'player_ai');assert.equal(s.pad1,3);assert(ctx.session('dual').joinOwners[0]?.id.includes('Black'));
button(3,3,false);now+=100;read();pads[3].axes[3]=.85;now+=350;s=read();assert.equal(s.readySeconds,15);
now+=15500;s=read();assert.equal(s.paused,false);assert(s.human1);assert.equal(s.pad1,3);
// Second pad claims P2 without replacing P1.
s=hold(1);assert.equal(s.requested,'player_player');assert.equal(s.pad1,3);assert.equal(s.pad2,1);
assert(ctx.session('dual').joinOwners[0]?.id.includes('Black'));
assert(ctx.session('dual').joinOwners[1]?.id.includes('Red'));
button(1,3,false);now+=100;read();pads[1].axes[3]=.86;now+=350;s=read();assert.equal(s.readySeconds,15);
now+=15500;s=read();assert.equal(s.paused,false);assert(s.human1&&s.human2);assert.equal(s.mode,'player_player');
// Square is inert while unpaused; the game must be paused first.
button(1,2,true);now+=16;s=read();assert(s.human2);assert.equal(ctx.session('dual').joinOwners.filter(Boolean).length,2);
button(1,2,false);now+=18;read();
// P2 holds Triangle: game pauses, music remains untouched.
s=hold(1);assert.equal(s.manualPaused,true);assert.equal(s.paused,true);
button(1,3,false);now+=60;read();
button(1,2,true);now+=20;s=read();assert.equal(s.manualPaused,true);
assert.equal(ctx.session('dual').joinOwners[1],null);assert(ctx.session('dual').joinOwners[0]);
assert.equal(s.pad1,3);assert.equal(s.mode,'player_ai');assert(s.human1&&!s.human2);
// A still-connected Red controller cannot steal its former slot without another hold.
button(1,2,false);now+=10;read();assert.equal(pads[1].connected,true);
// Remaining P1 resumes and then voluntarily hands over while paused.
s=hold(3);assert.equal(s.manualPaused,false);
button(3,3,false);now+=80;read();
s=hold(3);assert.equal(s.manualPaused,true);
button(3,3,false);now+=80;read();
button(3,2,true);now+=20;s=read();assert.equal(s.mode,'ai_ai');assert(!s.paused);assert.equal(ctx.session('dual').joinOwners.filter(Boolean).length,0);
button(3,2,false);now+=16;read();
// P2 cannot join a solo-only title, but P1 still can.
let limited=['ai_ai','solo'];now+=200;read('solo',limited);let a=hold(1,'solo',limited);assert.equal(a.requested,'solo');
button(1,3,false);now+=70;read('solo',limited);button(3,3,true);now+=20;read('solo',limited);now+=830;a=read('solo',limited);
assert.equal(ctx.session('solo').joinOwners.filter(Boolean).length,1);
// Explicit menu-selected Player vs Player also supports paused Square AI handoff.
const manual={...cfg,homeReactiveVisualizerArcadeMode:'player_player',homeReactiveVisualizerArcadePad1:1,homeReactiveVisualizerArcadePad2:3};
button(1,3,false);button(3,3,false);
let m=ctx.read(manual,both,'manual');assert.equal(m.requested,'ai_ai');assert(!m.paused);
// A saved manual PVP preference must not auto-claim either connected pad.
button(1,3,true);now+=15;ctx.read(manual,both,'manual');now+=830;m=ctx.read(manual,both,'manual');
assert.equal(m.requested,'player_ai');
button(1,3,false);now+=25;ctx.read(manual,both,'manual');
button(3,3,true);now+=15;ctx.read(manual,both,'manual');now+=830;m=ctx.read(manual,both,'manual');
assert.equal(m.requested,'player_player');
button(3,3,false);now+=25;ctx.read(manual,both,'manual');
ctx.session('manual').readyPhase='playing';ctx.session('manual').joined=true;
ctx.session('manual').manualPause=true;
button(1,2,true);now+=16;m=ctx.read(manual,both,'manual');
assert(!m.human1&&m.human2);assert(m.manualPaused);
button(1,2,false);now+=16;ctx.read(manual,both,'manual');
button(3,2,true);now+=16;m=ctx.read(manual,both,'manual');assert(!m.human1&&!m.human2&&m.mode==='ai_ai');assert(!m.manualPaused);
button(3,2,false);now+=16;ctx.read(manual,both,'manual');
// Rejoin the same assigned slot without disconnecting.
button(1,3,true);now+=10;ctx.read(manual,both,'manual');now+=830;m=ctx.read(manual,both,'manual');
assert.equal(ctx.session('manual').manualReleased[0],false);assert(m.readyWaiting);
button(1,3,false);now+=25;ctx.read(manual,both,'manual');
console.log('PASS two independent Triangle joins, 15s readiness, paused-only Square handoff, AI slot substitution, single-player limit, manual preference isolation, and Triangle rejoin');

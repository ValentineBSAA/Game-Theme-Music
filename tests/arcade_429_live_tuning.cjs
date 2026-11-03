'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.join(__dirname,'..'),dist=fs.readFileSync(path.join(root,'dist/index.js'),'utf8'),src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const start=dist.indexOf('// GTM 4.2.9: Bounded, per-game settings registry.');
const end=dist.indexOf('function Gtm419ArcadePage()',start);
const persisted=new Map();const win={localStorage:{getItem:k=>persisted.get(k)||null,setItem:(k,v)=>persisted.set(k,v)}};
const box={window:win,console,Math,snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'adaptive'},gtm418ReadPlayers:()=>({mode:'ai_ai',requested:'ai_ai',paused:false,left:{x:0,y:0},right:{x:0,y:0},human1:false,human2:false}),gtm418ProgramOptionValue:()=>1,gtm418DrawSessionStatus:()=>{}};
vm.createContext(box);vm.runInContext(dist.slice(start,end)+src+'\nthis.api={games:GTM421_GAMES,race:GTM425_RACING,read:gtm429ReadAll,save:gtm429SaveSetting,power:g423UsePower,render:gtm421DrawArcade};',box);
const {games,read,save,power,render}=box.api;
const pad={x:0,y:0,rb:0,lb:0,rt:0,lt:0},input={p1:pad,p2:pad,human1:true,human2:false},ai={p1:pad,p2:pad,human1:false,human2:false};
assert.equal(read('world_arcade_neon_drift_circuit').laps,3);assert(save('world_arcade_neon_drift_circuit','laps',5));assert.equal(read('world_arcade_neon_drift_circuit').laps,5);
assert.equal(read('world_arcade_beat_catcher').laps,undefined,'game options must not leak across game IDs');
assert(!save('world_arcade_neon_drift_circuit','races',999),'out-of-range or unknown choices rejected');
// Simulate pack render reading stored preferences. Invalid storage must not crash or inject script.
persisted.set('GTM_ARCADE_GAME_SETTINGS_V1_world_arcade_neon_drift_circuit','{invalid');
assert.equal(read('world_arcade_neon_drift_circuit').laps,3,'corrupted storage falls back to safe defaults');
assert(save('world_arcade_neon_drift_circuit','laps',5));assert(save('world_arcade_neon_drift_circuit','races',7));
const racing=box.api.race,run=racing.create();
racing.step(run,1/60,ai,{},read('world_arcade_neon_drift_circuit'));
assert.equal(run.lapTarget,5);assert.equal(run.rounds,7,'race settings must reach actual physics');
const catcher=games.world_arcade_beat_catcher;
const slow=catcher.create(),fast=catcher.create();catcher.step(slow,1/60,ai,{}, {notePace:.72,hazards:0});catcher.step(fast,1/60,ai,{}, {notePace:1.3,hazards:1});
assert(slow.notes.length&&fast.notes.length);assert(fast.notes[0].vy>slow.notes[0].vy,'note pace must affect note movement');
const defender=games.world_arcade_orbit_defenders,fort=defender.create();
defender.step(fort,1/60,ai,{}, {baseDurability:16,enemyPace:1});assert.equal(fort.base,16,'base durability choice must change game state');
const duel=games.world_arcade_orbital_duel,hulls=duel.create();duel.step(hulls,1/60,ai,{}, {roundHealth:7,blackhole:0});
assert.equal(hulls.ships[0].hp,7,'duel health must be adjustable');
const gallery=games.world_arcade_neon_strike_gallery,galleryState=gallery.create();galleryState.misses=13;
gallery.step(galleryState,1/60,ai,{}, {missLimit:12,targetSpeed:1});assert(galleryState.over>0,'gallery miss limit must change round ending');
const powers=catcher.create();powers.abilityRecharge=1.35;powers.elapsed=10;input.p1={...pad,rb:1};
const first=power(powers,input,0,'test','rb',8,2,false);assert(first);assert(powers.arcadePowers[0].test.cool>10.7,'longer ability recharge must affect cooldown');
// AI setting remains per-game, rather than globally forced for every selection.
assert(save('world_arcade_beat_catcher','difficulty','hard'));assert.equal(read('world_arcade_beat_catcher').difficulty,'hard');
assert.equal(read('world_arcade_orbit_defenders').difficulty,'adaptive');
// UI/engine contract cannot accidentally enable executable community packs.
assert(!dist.slice(start,end).includes('eval('));assert(!dist.slice(start,end).includes('new Function'));
console.log('PASS per-game settings persist, survive corruption, and control five actual game engines plus shared ability recharge and independent AI difficulty');

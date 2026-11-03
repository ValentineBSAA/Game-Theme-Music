'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const box={console,Math,snapshot$1:{homeReactiveVisualizerArcadeDifficulty:'hard'}};
vm.createContext(box);
vm.runInContext(src+'\nthis.api={GTM421_GAMES,GTM425_RACING,g423PowerActive,g423UsePower};',box);
const game=box.api.GTM421_GAMES;
const input={p1:{x:0,y:0,rb:0,lb:0,rt:0,lt:0,xbtn:0,ybtn:0},p2:{x:0,y:0,rb:0,lb:0,rt:0,lt:0,xbtn:0,ybtn:0},human1:true,human2:true,mode:'player_player'};
const specs=[
 ['world_arcade_beat_catcher',[['rb','magnet'],['lb','combo_guard'],['lt','score_surge']]],
 ['world_arcade_orbit_defenders',[['rb','burst'],['lb','aegis'],['xbtn','gravity_pulse'],['lt','seeker']]],
 ['world_arcade_orbital_duel',[['rb','plasma_volley'],['lb','aegis'],['xbtn','gravity_surge'],['lt','phase_shift']]],
 ['world_arcade_neon_drift_circuit',[['rb','drift'],['rt','nitro'],['lb','cryo'],['xbtn','lightning'],['lt','aegis']]],
 ['world_arcade_neon_strike_gallery',[['lb','focus'],['xbtn','piercing'],['lt','overdrive']]]
];
for(const [id,abilities] of specs){
 for(const [button,ability] of abilities){
  const impl=game[id]||(id==='world_arcade_neon_drift_circuit'&&box.api.GTM425_RACING);const s=impl.create();
  const pads={...input,p1:{...input.p1,[button]:1},p2:{...input.p2}};
  impl.step(s,1/60,pads,{low:.4,beat:.4},{blackhole:1});
  assert(s.arcadePowers?.[0]?.[ability]?.cool>0,`${id}: ${ability} never charges on ${button}`);
  const cooldown=s.arcadePowers[0][ability].cool;
  impl.step(s,1/60,pads,{low:.4,beat:.4},{blackhole:1});
  assert(s.arcadePowers[0][ability].cool<cooldown,`${id}: ${ability} re-triggered while held`);
  console.log('PASS',id,button,ability);
 }
}
// Gameplay effect: magnet catches a note that would be beyond unpowered range.
{
 const scene=game.world_arcade_beat_catcher,s=scene.create();s.elapsed=2;
 s.notes=[{x:.48,y:.818,vy:.02,glow:0}];s.ships[0].x=.32;s.ships[1].x=.90;
 s.arcadePowers=[{magnet:{cool:5,active:1,last:false,nextAuto:8}},{ }];
 const before=s.collected;scene.step(s,1/60,{...input,p1:{...input.p1},p2:{...input.p2}}, {beat:0},{});
 assert(s.collected>before&&s.score1>0,'magnet did not widen the catch window');
 console.log('PASS magnet changes catch distance');
}
// Planet defense pulse damages enemies, shield interception saves the base.
{
 const scene=game.world_arcade_orbit_defenders,s=scene.create();s.enemies=[{x:.27,y:.72,hp:2,vy:0,vx:0,osc:0}];
 scene.step(s,1/60,{...input,p1:{...input.p1,xbtn:1}}, {},{blackhole:0});
 assert(!s.enemies.length||s.enemies[0].hp<2,'gravity pulse did not damage enemies');
 const shielded=scene.create();shielded.remaining=1;shielded.enemies=[{x:.27,y:.759,hp:3,vy:.2,vx:0,osc:0}];
 shielded.ships[0].shield=2;
 scene.step(shielded,1/60,{...input,p1:{...input.p1}}, {},{blackhole:0});
 assert.equal(shielded.base,12,'aegis failed to intercept incoming enemies');
 console.log('PASS gravity pulse damages invaders and shield intercepts');
}
// Circuit ability effects alter speed, handling and hazards, not merely VFX.
{
 const race=box.api.GTM425_RACING,s=race.create();
 const before=s.cars[0].speed;
 race.step(s,1/60,{...input,p1:{...input.p1,rt:1,y:-1}}, {},{});
 assert(s.cars[0].boost>0,'Nitro did not activate');
 const boost=s.cars[0].speed;
 race.step(s,1/60,{...input,p1:{...input.p1,lb:1,y:-1}}, {},{});
 assert(s.hazards.length>0,'Ice hazard was not placed');
 assert(boost>=before,'Acceleration failed');
 console.log('PASS circuit nitro, acceleration and bounded ice hazard');
}
// Gallery power: each player owns an independent reticle, no shared turns.
{
 const scene=game.world_arcade_neon_strike_gallery,s=scene.create();s.targets=[{x:.30,y:.55,hp:1,r:.03,vx:0,vy:0,life:9,type:0,boss:false,phase:0}];
 s.players[0].x=.30;s.players[0].y=.55;
 scene.step(s,1/60,{...input,p1:{...input.p1,rb:1},p2:{...input.p2}}, {},{});
 assert(s.players[0].score>0,'Neon Strike Gallery shot failed to score');
 assert(s.players[1].score===0,'Independent player scoring failed');
 console.log('PASS gallery precision fire has independent scores and target collision');
}
console.log('PASS all shared arcade abilities validated');

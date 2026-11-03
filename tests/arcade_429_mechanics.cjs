'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src/visualizer-behaviors/arcade-421.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/manifest.json'),'utf8'));
let now=0;const box={console,Math,Date,performance:{now:()=>now},
 snapshot$1:{homeReactiveVisualizerArcadeMode:'ai_ai'},
 gtm418ReadPlayers:(_settings,allowed,key)=>({side:'left',mode:'ai_ai',requested:'ai_ai',human1:0,human2:0,
  left:{x:0,y:0,lb:0,rb:0},right:{x:0,y:0,lb:0,rb:0},paused:false}),
 gtm418ProgramOptionValue:(scene,option)=>option.choices?.find(x=>x.label==='Standard')?.value??option.choices?.[0]?.value??1,
 gtm418DrawSessionStatus:()=>{}};
vm.createContext(box);
vm.runInContext(src+'\nthis.api={games:GTM421_GAMES,render:gtm421DrawArcade,gravity:g421Gravity,ids:GTM421_ARCADE_IDS,pools:GTM421_INSTANCE_POOLS};',box);
const {games,render,gravity,ids,pools}=box.api;
const empty={p1:{x:0,y:0,lb:0,rb:0},p2:{x:0,y:0,lb:0,rb:0},human1:false,human2:false,mode:'ai_ai'};
for(const [id,game] of Object.entries(games)){
 const scene=manifest.scenes.find(s=>s.id===id);
 assert(scene,`${id} missing from builtin manifest`);
 assert(scene.interaction.modes.includes('ai_ai'));
 assert(scene.interaction.modes.some(m=>m==='solo'||m==='player_player'));
 const s=game.create(),seen={round:0,wave:0,score:0};const t0=performance.now();
 for(let step=0;step<7200;step++){
   game.step(s,1/60,empty,{low:.4,mid:.2,beat:.6},{blackhole:1});
   seen.wave=Math.max(seen.wave,s.wave||0);seen.round=Math.max(seen.round,s.round||0);
   seen.score=Math.max(seen.score,s.score||0,s.score1||0,s.score2||0,s.ships?.[0]?.score||0,s.ships?.[1]?.score||0);
   assert(s.particles?.length<=64,`${id}: growing particles`);
   for(const key of ['shots','enemies','notes','balls'])if(s[key])assert(s[key].length<=50,`${id}: unbounded ${key}`);
   for(const key of ['score','score1','score2','wave','round','base','credits','misses'])if(s[key]!==undefined)assert(Number.isFinite(s[key]),`${id}: nonfinite ${key}`);
 }
 console.log('PASS',id,'120s AI sim',JSON.stringify(seen));
 if(id==='world_arcade_neon_strike_gallery')assert(seen.score>0,'shooting score does not advance');
 if(id==='world_arcade_beat_catcher')assert(seen.score>0,'rhythm score does not advance');
 if(id==='world_arcade_neon_drift_circuit')assert(s.heat>=0&&s.cars.length===2,'racing championship never initializes');
 if(id==='world_arcade_orbit_defenders')assert(seen.wave>=2,'space defense wave never advances');
}
// Projectile is physically deflected at fixed dt only when gravity is on.
let no={x:.22,y:.40,vx:.7,vy:0},yes={...no};
for(let i=0;i<65;i++){gravity(no,.5,.5,0,1/60);gravity(yes,.5,.5,1,1/60);no.x+=no.vx/60;no.y+=no.vy/60;yes.x+=yes.vx/60;yes.y+=yes.vy/60;}
assert(Math.abs(no.y-.4)<1e-10,'gravity off must leave trajectory straight');
assert(Math.abs(yes.y-.4)>.001,'gravity on must bend projectile');
console.log('PASS black hole makes measurable physical trajectory change');
// Render all scenes with a minimal canvas mock; ensure no exceptions.
const ctx={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},arc(){},stroke(){},fill(){},moveTo(){},lineTo(){},closePath(){},fillText(){}};
for(const scene of manifest.scenes){const canvas={};for(let i=0;i<30;i++){now+=16.667;assert(render(ctx,canvas,scene,scene.id,{physicsDt:1/60},{beat:.5,low:.4},1100,180));}}
console.log('PASS all five built-in trusted games render for 30 frames');
// UI and code linkage: all five scenes, proper TV mode, menu readiness, separate library refresh.
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
for(const token of ["'world_arcade_neon_drift_circuit'",'homeReactiveVisualizerArcadeView','Couch / TV','Selected Game · ','GTM421_ARCADE_IDS','MOVE RIGHT STICK TO START','Choose another game'])assert(bundle.includes(token),`bundle missing ${token}`);
assert(!bundle.includes("['world_arcade_prism_rally','Prism Rally']"));
console.log('PASS UI, readiness, and built-in game linkage');

'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const piece=(from,to)=>{const a=bundle.indexOf(from),b=bundle.indexOf(to,a);assert(a>=0&&b>a,`missing ${from}`);return bundle.slice(a,b);};
const setup=[
 piece('const GTM_V371_MODES = ','// GTM 3.7.7 CURATED COLLECTION.'),
 piece('const GTM_V376_LABELS=(', 'const GTM_V376_SCENES='),
 piece('const GTM404_EFFECTS = ', 'function gtm404UsePackEpoch()'),
 piece('const GTM415_SCENERY=new Set(', 'function gtm415DrawSceneBackground('),
 piece('const GTM422_EMBEDDED_BUILTINS=', 'var index = definePlugin(() => {'),
 'function gtm404Clamp(value,min=0,max=1){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;}',
 piece('function gtm404RegisterPacks(packs){','// RC4 Visualizer Shuffle All:'),
 piece('async function gtm404RefreshPacks(){','// Called once at startup, and explicitly on pack-manager refresh.'),
 'this.inspect=()=>({games:GTM_V376_GROUPS.find(g=>g.id===\'arcade\').modes,packs:GTM404_PACK_STATUS.packs,error:GTM404_PACK_STATUS.error,scenes:[...GTM404_PACK_SCENES.keys()]});',
].join('\n');
const context={window:{dispatchEvent(){}},CustomEvent:class CustomEvent{},console};vm.createContext(context);
vm.runInContext(setup,context,{timeout:15000});
function verify(){const view=context.inspect();const expect=['world_neon_pong','world_arcade_beat_catcher','world_arcade_orbital_duel','world_arcade_orbit_defenders','world_arcade_neon_strike_gallery','world_arcade_neon_chess'];for(const id of expect)assert(view.games.includes(id),`Missing ${id}`);assert.equal(new Set(view.games).size,view.games.length);return view;}
let v=verify();console.log('PASS six active built-in games visible synchronously at frontend startup');
assert.equal(v.packs.length,2);
// The startup RPC is allowed to fail, or return only the old visual worlds pack.
const legacy=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/volume1/manifest.json'),'utf8'));
vm.runInContext('gtm404RegisterPacks([...GTM422_EMBEDDED_BUILTINS])',context,{timeout:10000});verify();
console.log('PASS repeated loads are idempotent');
assert(bundle.includes('const merged=new Map(GTM422_EMBEDDED_BUILTINS.map('));
assert(bundle.includes("function Gtm440VisualizerBrowser"));
assert(bundle.includes('function Gtm426InlineChoice'));
assert(bundle.includes("libraryOpen&&gameList.map"));
assert(!bundle.includes('gtm425OpenArcadeLibrary(gameChoices,selectedGame,activate)'));
console.log('PASS backend refresh preserves built-ins, music Settings exclude Arcade game picker');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'visualizer-packs/arcade/manifest.json'),'utf8'));
assert.equal(manifest.scenes.length,5);
console.log('PASS five active non-Pong Arcade manifests are packaged');
(async()=>{
 const pack=v.packs[0];
 for(const reply of [
    {ok:true,packs:[pack],errors:['arcade pack failed']},
    {ok:true,packs:[],errors:[]},
    {ok:false,error:'backend unavailable'},
 ]){
   context.call=async function(){return reply;};
   const result=await vm.runInContext('gtm404RefreshPacks()',context);
   verify();
   if(reply.ok)assert(result.ok,'success result expected');
 }
 context.call=async()=>{throw new Error('IPC not initialized');};
 const failed=await vm.runInContext('gtm404RefreshPacks()',context);
 assert.equal(failed.ok,false);verify();
 console.log('PASS six active games survive partial, empty, failed and throwing backend RPC');
})().catch(error=>{console.error(error);process.exitCode=1;});

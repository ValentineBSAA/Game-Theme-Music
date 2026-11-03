'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const start=bundle.indexOf('// GTM 4.2.9: Bounded, per-game settings registry.');
const end=bundle.indexOf('function GtmV3SettingsCenter()',start);
assert(start>0&&end>start,'Game settings registry and Arcade page must be shipped');
const data={};const localStorage={getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v;}};
const settings={homeReactiveVisualizerMode:'world_neon_pong',homeReactiveVisualizerArcadeSelected:'world_neon_pong',
 homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerArcadeMode:'ai_ai',
 homeReactiveVisualizerEnabled:true,homeReactiveVisualizerArcadeView:'couch'};
let slots=[],cursor=0;
function el(tag,props,...children){return {tag:typeof tag==='function'?tag.name:tag,props:props||{},children:children.flat(Infinity).filter(x=>x!==false&&x!==null&&x!==undefined)};}
const react={createElement:el,useState:init=>{const i=cursor++;if(!(i in slots))slots[i]=typeof init==='function'?init():init;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},useEffect:()=>{}};
const pongOpts=[
 {key:'homeReactiveVisualizerPongMode',label:'Pong game mode',options:[['classic','Classic'],['competitive','Competitive'],['power','Power Battle'],['morph','Morph Battle'],['mindball','Mindball'],['chaos','Chaos Championship']]},
 {key:'homeReactiveVisualizerPongDefenseMorph',label:'Defense Morph',options:[['fortress','Fortress'],['gravity','Gravity'],['magnet','Magnet']]},
 {key:'homeReactiveVisualizerPongAttackMorph',label:'Attack Morph',options:[['thunder','Thunder'],['inferno','Inferno'],['mirror','Mirror'],['cryo','Cryo']]},
 {key:'homeReactiveVisualizerPongGoal',label:'Points to Win',options:[[3,'3'],[7,'7']]},
];
const scenes=new Map([['world_neon_pong',{id:'world_neon_pong',layers:[{effect:'neon_pong'}],interaction:{modes:['ai_ai','player_ai','player_player']}}],
 ['world_arcade_neon_drift_circuit',{id:'world_arcade_neon_drift_circuit',layers:[],interaction:{modes:['ai_ai','player_ai','player_player']}}],
 ['world_arcade_beat_catcher',{id:'world_arcade_beat_catcher',layers:[],interaction:{modes:['ai_ai','solo','player_player']}}]]);
const box={window:{SP_REACT:react,localStorage},SP_REACT:react,DFL:{PanelSectionRow:'Row',ButtonItem:'Button'},
 useSettings:()=>({settings,updateSettings:async(k,v)=>{settings[k]=v;}}),
 gtm404UsePackEpoch:()=>0,gtm404RefreshPacks:async()=>{},
 GTM_V376_GROUPS:[{id:'arcade',modes:[...scenes.keys()]}],GTM404_PACK_SCENES:scenes,
 GTM_V376_LABELS:{},GTM420_ARCADE_GAMES:[['world_neon_pong','Neon Paddle Championship'],['world_arcade_beat_catcher','Beat Catcher'],['world_arcade_neon_drift_circuit','Neon Drift Circuit']],
 GTM421_GAME_INFO:{},gtm420IsPong:id=>id==='world_neon_pong',GTM413_BEHAVIORS:new Map([['neon_pong',{options:pongOpts}]]),
 GtmV3PageIntro:'Intro',PremiumSection:'Section',Gtm426InlineChoice:'Choice',Gtm413VisualizerBehaviorSettings:'LegacyScenery',
 gtm419ControllerChoices:()=>[[0,'Slot 1'],[1,'Slot 2']],gtm419AvailablePads:()=>[],
 gtm418ProgramOptionValue:()=>1,gtm418SaveProgramOption:()=>true,Gtm404VisualizerPackManager:'Packs',console};
vm.createContext(box);vm.runInContext(bundle.slice(start,end)+'\nthis.arcade=Gtm419ArcadePage;this.load=gtm429ReadAll;this.save=gtm429SaveSetting;',box);
function render(){cursor=0;return box.arcade();}
function all(node,out=[]){if(!node)return out;if(Array.isArray(node)){node.forEach(n=>all(n,out));return out;}if(typeof node==='object'){out.push(node);(node.children||[]).forEach(n=>all(n,out));}return out;}
function button(tree,label){return all(tree).find(n=>n.tag==='Button'&&n.props.label===label);}
function choice(tree,label){return all(tree).find(n=>n.tag==='Choice'&&n.props.label===label);}
let tree=render();
assert(choice(tree,'Pong game mode'),'new mode menu must be immediately visible under default Rules group');
assert(button(tree,'Game settings'),'selected game configuration exists');
assert(!button(tree,'Controller Bridge'),'advanced bridge must be collapsed by default');
choice(tree,'Settings category').props.onChange('abilities');
tree=render();assert(choice(tree,'Defense Morph')&&choice(tree,'Attack Morph'),'both morph loadouts reachable by switching category');
choice(tree,'Settings category').props.onChange('play');
tree=render();assert(choice(tree,'Pong AI difficulty'),'Pong Adaptive selector visible');
button(tree,'Choose another game').props.onClick();
tree=render();assert(button(tree,'Neon Drift Circuit'),'game library expands inline');
// Simulate selecting a game without relying on Steam native popup focus.
(async()=>{
 await button(tree,'Neon Drift Circuit').props.onClick();tree=render();
 assert(choice(tree,'Laps per race')&&choice(tree,'Championship races')&&choice(tree,'Vehicle handling'),
  'all racing gameplay options immediately reachable under selected game');
 assert.equal(box.load('world_arcade_neon_drift_circuit').laps,3);
 choice(tree,'Laps per race').props.onChange(5);
 assert.equal(box.load('world_arcade_neon_drift_circuit').laps,5);
 assert.equal(box.load('world_arcade_beat_catcher').laps,undefined,'tuning must stay per game');
 assert(!box.save('world_arcade_neon_drift_circuit','laps',999),'unsupported game values rejected');
 choice(tree,'Settings category').props.onChange('play');tree=render();
 assert(choice(tree,'AI difficulty'),'per-game AI controls visible');
 choice(tree,'AI difficulty').props.onChange('hard');
 assert.equal(box.load('world_arcade_neon_drift_circuit').difficulty,'hard');
 choice(tree,'Settings category').props.onChange('abilities');tree=render();
 assert(choice(tree,'Ability recharge'),'per-game ability recharge controls visible');
 choice(tree,'Settings category').props.onChange('visuals');tree=render();
 assert(choice(tree,'Cinematic scenery'),'per-game cinematic quality reachable');
 button(tree,'Advanced Arcade options').props.onClick();tree=render();
 assert(button(tree,'Controller Bridge'),'Controller Bridge nested under Advanced');
 button(tree,'Controller Bridge').props.onClick();tree=render();
 assert(choice(tree,'Player 1 controller')&&choice(tree,'Human disconnect recovery'),'Bridge settings actually usable');
 assert(!bundle.slice(start,end).includes('showModal('),'Arcade must never open native Steam modal dialogs');
 console.log('PASS UI render: Pong modes and morphs visible, game changes change settings, 5 racing rules, AI, abilities, visuals, nested controller bridge');
})().catch(e=>{console.error(e);process.exitCode=1;});

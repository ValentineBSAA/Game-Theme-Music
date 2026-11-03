'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),bundle=fs.readFileSync(path.join(root,'dist/index.js'),'utf8');
const begin=bundle.indexOf('// GTM 4.2.9: Bounded, per-game settings registry.');
const end=bundle.indexOf('function GtmV3SettingsCenter()',begin);
assert(begin>0&&end>begin);
const data={};const localStorage={getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v;}};
const settings={homeReactiveVisualizerMode:'world_neon_pong',homeReactiveVisualizerArcadeSelected:'world_neon_pong',homeReactiveVisualizerPongMode:'power',homeReactiveVisualizerPongDifficulty:'adaptive',homeReactiveVisualizerArcadeMode:'ai_ai',homeReactiveVisualizerEnabled:true,homeReactiveVisualizerArcadeView:'couch'};
let states=[],cursor=0;
function el(tag,props,...children){return {tag:typeof tag==='function'?tag.name:tag,props:props||{},children:children.flat(Infinity).filter(x=>x!==false&&x!==null&&x!==undefined)};}
const react={createElement:el,useState:initial=>{let i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},useEffect:()=>{}};
const pong=[{key:'homeReactiveVisualizerPongMode',label:'Pong game mode',options:[['classic','Classic'],['competitive','Competitive'],['power','Power Battle'],['morph','Morph Battle'],['mindball','Mindball'],['chaos','Chaos Championship']]},{key:'homeReactiveVisualizerPongDefenseMorph',label:'Defense Morph',options:[['fortress','Fortress'],['gravity','Gravity'],['magnet','Magnet']]},{key:'homeReactiveVisualizerPongAttackMorph',label:'Attack Morph',options:[['thunder','Thunder'],['inferno','Inferno'],['mirror','Mirror'],['cryo','Cryo']]},{key:'homeReactiveVisualizerPongGoal',label:'Points to Win',options:[[3,'3'],[7,'7']]}];
const scenes=new Map([['world_neon_pong',{id:'world_neon_pong',layers:[{effect:'neon_pong'}],interaction:{modes:['ai_ai','player_ai','player_player']}}],['world_arcade_neon_drift_circuit',{id:'world_arcade_neon_drift_circuit',layers:[],interaction:{modes:['ai_ai','player_ai','player_player']}}]]);
const box={window:{SP_REACT:react,localStorage},SP_REACT:react,DFL:{PanelSectionRow:'Row',ButtonItem:'Button'},
 useSettings:()=>({settings,updateSettings:async(k,v)=>{settings[k]=v;}}),gtm404UsePackEpoch:()=>0,gtm404RefreshPacks:async()=>{},
 GTM_V376_GROUPS:[{id:'arcade',modes:[...scenes.keys()]}],GTM404_PACK_SCENES:scenes,GTM_V376_LABELS:{},GTM420_ARCADE_GAMES:[['world_neon_pong','Neon Paddle Championship'],['world_arcade_neon_drift_circuit','Neon Drift Circuit']],GTM421_GAME_INFO:{},gtm420IsPong:id=>id==='world_neon_pong',GTM413_BEHAVIORS:new Map([['neon_pong',{options:pong}]]),
 GtmV3PageIntro:'Intro',PremiumSection:'Section',Gtm426InlineChoice:'Choice',Gtm413VisualizerBehaviorSettings:'LegacyScenery',Gtm430Tabs:function Gtm430Tabs(){},
 gtm419ControllerChoices:()=>[[0,'Slot 1'],[1,'Slot 2']],gtm419AvailablePads:()=>[],gtm418ProgramOptionValue:()=>1,gtm418SaveProgramOption:()=>true,Gtm404VisualizerPackManager:'Packs',console};
vm.createContext(box);vm.runInContext(bundle.slice(begin,end)+'\nthis.arcade=Gtm419ArcadePage;this.load=gtm429ReadAll;',box);
function render(){cursor=0;return box.arcade();}
function nodes(node,out=[]){if(!node)return out;if(Array.isArray(node)){node.forEach(n=>nodes(n,out));return out;}if(typeof node==='object'){out.push(node);(node.children||[]).forEach(n=>nodes(n,out));}return out;}
const get=(tree,tag,label)=>nodes(tree).find(n=>n.tag===tag&&(!label||n.props.label===label));
function tab(tree,name){return nodes(tree).find(n=>n.tag==='Gtm430Tabs'&&n.props.tabs.some(x=>x[0]===name));}
let tree=render();
assert(get(tree,'Button','Choose another game'),'game picker immediately visible');
assert(get(tree,'Choice','AI difficulty'),'difficulty immediately visible');
assert(get(tree,'Choice','Pong game mode'),'Pong mode immediately visible');
const size=tab(tree,'standard');assert(size,'size buttons immediately visible');
assert(size.props.tabs.some(([key,name])=>key==='standard'&&name==='Default Size'));
assert(size.props.tabs.some(([key,name])=>key==='couch'&&name==='Couch / TV'));
size.props.onSelect('standard');tree=render();assert.equal(settings.homeReactiveVisualizerArcadeView,'standard');
size.props.onSelect('couch');tree=render();assert.equal(settings.homeReactiveVisualizerArcadeView,'couch');
assert(!get(tree,'Button','Controller Bridge'),'bridge stays under Advanced');
let category=tab(tree,'abilities'); assert(category,'category navigation has four direct buttons');
assert.equal(category.props.tabs.length,4);
category.props.onSelect('abilities');tree=render();
assert(get(tree,'Choice','Defense Morph')&&get(tree,'Choice','Attack Morph'),'Pong morphs directly reachable');
get(tree,'Button','Choose another game').props.onClick();tree=render();
assert(get(tree,'Button','Neon Drift Circuit'));
(async()=>{
 await get(tree,'Button','Neon Drift Circuit').props.onClick();tree=render();
 assert(get(tree,'Choice','Laps per race')&&get(tree,'Choice','Vehicle handling'),'racing options appear immediately');
 assert(get(tree,'Choice','AI difficulty'),'selected game AI immediately visible');
 category=tab(tree,'abilities');
 category.props.onSelect('abilities');tree=render();assert(get(tree,'Choice','Ability recharge'),'racing recharge settings accessible');
 tab(tree,'visuals').props.onSelect('visuals');tree=render();assert(get(tree,'Choice','Cinematic scenery'),'scenery settings accessible');
 tab(tree,'play').props.onSelect('play');tree=render();assert(get(tree,'Choice','Arcade play mode'),'human/AI modes accessible');
 get(tree,'Button','Advanced Arcade options').props.onClick();tree=render();
 get(tree,'Button','Controller Bridge').props.onClick();tree=render();
 assert(get(tree,'Choice','Player 1 controller'),'Controller Bridge can expand');
 assert(!bundle.slice(begin,end).includes('showModal('),'No native Arcade popup');
 for(const name of ['GtmV3NowPlaying','GtmV3GameCenter','AmbientCenter','StoreCenter','StorageManager','Gtm419ArcadePage','GtmV3SettingsCenter','GtmV3HealthPage'])assert(bundle.includes(name),'main tab exists '+name);
 for(const name of ['Gtm430AmbientLayout','Gtm430StoreLayout','Gtm430SettingsSplit','Gtm430SectionGate'])assert(bundle.includes(name),'grouped layout exists '+name);
 console.log('PASS 4.2.10 menu: immediate size + AI + modes, four direct categories, game-specific tuning, Controller Bridge nested, all GTM tabs retained');
})().catch(e=>{console.error(e);process.exitCode=1;});

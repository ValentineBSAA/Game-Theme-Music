'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'../dist/index.js'),'utf8');
const start=s.indexOf('// GTM 4.2.10: Consistent, in-panel navigation.');
const end=s.indexOf('function GtmV3GameCenter(',start);
assert(start>0&&end>start,'shared grouped navigation helpers shipped');
function e(type,props,...children){return {type,props:{...props,children:children.length===1?children[0]:children}};}
const React={createElement:e,Children:{toArray:x=>[].concat(x||[]).filter(v=>v!=null)},useState:x=>[x,()=>{}]};
const scope={SP_REACT:React,window:{SP_REACT:React},PremiumSection:'PremiumSection',DFL:{PanelSectionRow:'Row',ButtonItem:'Button',Focusable:'Focusable',DialogButton:'DialogButton'},Gtm404VisualizerPackManager:'PackManager'};
vm.createContext(scope);vm.runInContext(s.slice(start,end)+'\nthis.ambient=Gtm430AmbientLayout;this.store=Gtm430StoreLayout;this.settings=Gtm430SettingsSplit;',scope);
const labeled=(label,cls='')=>e('control',{label,className:cls});
const ambient=[labeled('hero','gtm-ambient-hero'),labeled('Ambient playlist'),labeled('Ambient playback'),labeled('Ambient volume'),labeled('Sleep Mode • delayed Ambient start'),labeled('Wake / restart delay'),labeled('Shuffle on section change'),labeled('When Change Theme Music opens'),labeled('status','gtm-ambient-runtime-card'),labeled('Where','gtm-ambient-surface-title'),labeled('Home screen'),labeled('Library'),labeled('Steam Store'),labeled('Other Deck pages'),labeled('Clear Ambient playlist')];
const store=[labeled('hero','gtm-store-hero'),labeled('status','gtm-store-runtime-card'),labeled('Store playlist'),labeled('Store music'),labeled('Shuffle Store playlist'),labeled('Store volume'),labeled('Clear Store playlist')];
function sections(tree){return React.Children.toArray(tree.props.children);}
function flattened(children){return React.Children.toArray(children).flat(Infinity);}
for(const [fn,inputs] of [[scope.ambient,ambient],[scope.store,store]]){
 const result=fn({children:inputs});const groups=sections(result);let total=0;
 for(const group of groups)total+=flattened(group.props.children).length;
 assert.equal(total,inputs.length,'all controls must survive grouping');
 assert.equal(groups[0].type,'PremiumSection','current playback must stay expanded');
 for(const group of groups.slice(1))assert.equal(group.type.name,'Gtm430SectionGate','secondary options behind focusable fold');
}
const settingsRows=[e('Row',{},labeled('Show mini player HUD')),e('Row',{},labeled('Live Footer Visualizer · On / Off')),e('Row',{},labeled('Light intensity'))];
const split=scope.settings({children:settingsRows});const groups=sections(split);
assert.equal(groups.length,2);assert(groups.every(g=>g.type.name==='Gtm430SectionGate'));
assert.equal(groups.reduce((n,g)=>n+flattened(g.props.children).length,0),settingsRows.length);
assert(s.includes('GtmV3PageIntro')&&s.includes('GtmV3NowPlaying'));
console.log('PASS 4.2.10 grouped controls: all Ambient/Store/Settings rows preserved, everyday playback visible, secondary groups collapsed');

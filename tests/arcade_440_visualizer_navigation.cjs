const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/../dist/index.js','utf8');
const snippet=src.slice(src.indexOf('function Gtm419SafeDropdown(props){'),src.indexOf('// 4.1.9: one discoverable Arcade page.'));
assert(!snippet.includes('More choices ▶'),'dead-end dropdown More choices action must be removed');
assert(!src.includes('label: \'Live Footer scene\''),'old nested visualizer dropdown must be removed');
assert.equal((src.match(/window.SP_REACT.createElement\(Gtm440VisualizerBrowser,\{settings,updateSettings\}\)/g)||[]).length,2,'both nested browsers replaced');
const state=[];let pos=0;
const React={createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity).filter(x=>x!==undefined&&x!==null&&x!==false)}),
 useState:(initial)=>{const k=pos++;if(state[k]===undefined)state[k]=initial;return [state[k],x=>{state[k]=typeof x==='function'?x(state[k]):x;}];},
 useEffect:()=>{}};
const groups=[{id:'off',label:'Off',modes:['off']},{id:'retro',label:'Retro Worlds',modes:['a','b','c','d','e','f','g','h','i','j']},
 {id:'rhythm',label:'Rhythm',modes:['z']}];
const ctx={window:{SP_REACT:React},SP_REACT:React,
 DFL:{PanelSectionRow:'PanelSectionRow',DialogButton:'DialogButton',ButtonItem:'ButtonItem'},PremiumDropdownItem:'PremiumDropdownItem',
 GTM_V376_GROUPS:groups,GTM_V376_LABELS:Object.fromEntries('abcdefghijz'.split('').map(x=>[x,'Scene '+x])),
 GTM_V371_MODES:'offabcdefghijz'.split(''),gtmV376FindGroup:x=>groups.find(g=>g.modes.includes(x))||groups[0]};vm.createContext(ctx);
vm.runInContext(snippet+'\nthis.safe=Gtm419SafeDropdown;this.browser=Gtm440VisualizerBrowser;',ctx);
const find=(node,pred)=>{if(!node||typeof node!=='object')return [];return [ ...(pred(node)?[node]:[]),...(node.children||[]).flatMap(x=>find(x,pred))];};
const render=(fn,props)=>{pos=0;return fn(props)};
let selected=null;
const options=Array.from({length:13},(_,i)=>({data:'item'+i,label:'Item '+i}));
let tree=render(ctx.safe,{rgOptions:options,selectedOption:'item0',description:'Test',onChange:choice=>selected=choice.data});
assert.equal(find(tree,x=>x.type==='PremiumDropdownItem')[0].props.rgOptions.length,7);
const next=find(tree,x=>x.type==='DialogButton'&&x.children.join('').includes('Next'))[0];assert(next,'visible next page button');next.props.onClick();
tree=render(ctx.safe,{rgOptions:options,selectedOption:'item0',description:'Test',onChange:choice=>selected=choice.data});
const second=find(tree,x=>x.type==='PremiumDropdownItem')[0];assert.equal(second.props.rgOptions[0].data,'item7');
second.props.onChange({data:'item9'});assert.equal(selected,'item9');
state.length=0;let updated='';tree=render(ctx.browser,{settings:{homeReactiveVisualizerMode:'a'},updateSettings:async(_,v)=>{updated=v;}});
assert(find(tree,x=>x.type==='ButtonItem'&&x.props.label==='Retro Worlds').length,'visible category');
assert(find(tree,x=>x.type==='ButtonItem'&&x.props.label==='Scene a').length,'visible scene');
assert(!find(tree,x=>x.type==='ButtonItem'&&x.props.label==='Scene g').length,'scene page bounded');
const nav=find(tree,x=>x.type==='DialogButton'&&x.children.join('').includes('Next'))[0];assert(nav);nav.props.onClick();
tree=render(ctx.browser,{settings:{homeReactiveVisualizerMode:'a'},updateSettings:async(_,v)=>{updated=v;}});
assert(find(tree,x=>x.type==='ButtonItem'&&x.props.label==='Scene g').length,'page 2 accessible as real button');
const scene=find(tree,x=>x.type==='ButtonItem'&&x.props.label==='Scene g')[0];scene.props.onClick();assert.equal(updated,'g');
console.log('PASS 4.4.0 controller-friendly visualizer category and scene pagination, no dead-end choices, both settings locations');

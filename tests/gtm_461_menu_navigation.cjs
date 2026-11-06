#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const s=fs.readFileSync('dist/index.js','utf8');
for(const f of ['package.json','plugin.json']) assert.equal(JSON.parse(fs.readFileSync(f)).version,'4.6.1');
assert.ok(s.includes('const GTM_VERSION = "4.6.1";'),'runtime version');
for(const unwanted of ['contextMenuShowTitleDeck','contextMenuShowArtwork','contextMenuShowDeveloper','gtm460FilterExternalMenuItems']){
 assert.equal(s.includes(unwanted),false,'unwanted external menu modification '+unwanted);
}
const start=s.indexOf('const GTM_V301_PAGES = ['),end=s.indexOf('];',start);
assert.ok(start>0 && end>start,'live page list found');
const ctx=vm.createContext({});
vm.runInContext(s.slice(start,end+2)+'\nthis.pages=GTM_V301_PAGES',ctx);
const pages=Array.from(ctx.pages,x=>({id:x.id,label:x.label}));
assert.equal(pages.length,9,'all nine pages');
assert.deepEqual(pages.map(x=>x.label),pages.map(x=>x.label).sort((a,b)=>a.localeCompare(b,'en')),'alphabetical page order');
assert.deepEqual(pages.map(x=>x.id).sort(),['ambient','arcade','game','health','library','now','settings','store','visualizers'].sort());
const slice=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert.ok(i>=0&&j>i);return s.slice(i,j)};
const window={SP_REACT:{createElement(type,props,...children){return{type,key:props?.key,props:{...props,children}}}}};
const code=slice('const spliceChangeMusic =','const handleItemDupes =')+'\nthis.spliceChangeMusic=spliceChangeMusic;';
const runtimeContext=vm.createContext({snapshot$1:{},window,DFL:{MenuItem(){},findInReactTree(){return null}},ChangeMusicButton(){},GlobalPlaylistMenuButton(){}});
vm.runInContext(code,runtimeContext,{timeout:1000});
for(const [key,entry] of [['contextMenuShowMusic','game-theme-music-change-music'],['contextMenuShowAmbient','game-theme-music-ambient-playlist'],['contextMenuShowStore','game-theme-music-store-playlist']]){
 runtimeContext.snapshot$1={[key]:false};
 const items=[{key:'properties',props:{children:'Properties'}}];
 runtimeContext.spliceChangeMusic(items,123);
 assert.ok(!items.map(x=>x.key).includes(entry),'visibility off for '+key);
 assert.equal(items.length,3);
}
runtimeContext.snapshot$1={};
const entries=[{key:'properties',props:{children:'Properties'}}];
runtimeContext.spliceChangeMusic(entries,123);
assert.equal(entries.length,4,'three enabled by default');
assert.ok(s.includes('4.6.1 TEST · WHAT IS NEW'),'new welcome highlights');
assert.ok(s.includes('A–Z · LB/RB to browse'),'page rail hints');
assert.ok(s.includes('.gtm-v301-brand-version'),'brand badge contrast');
assert.ok(s.includes('65ms ease-out'),'fast steady switches retained');
console.log('PASS GTM 4.6.1: menu isolation, independent toggles, alphabetical navigation, welcome, and readability');

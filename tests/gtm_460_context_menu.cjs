#!/usr/bin/env node
'use strict';
// GTM 4.6.0: tests the shipped runtime, not a separate mock implementation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const runtime=fs.readFileSync('dist/index.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const plugin=JSON.parse(fs.readFileSync('plugin.json','utf8'));
assert.equal(pkg.version,'4.6.0');
assert.equal(plugin.version,'4.6.0');
assert.ok(runtime.includes('const GTM_VERSION = "4.6.0";'));
function section(start,end){
 const i=runtime.indexOf(start),j=runtime.indexOf(end,i+start.length);
 assert.ok(i>=0 && j>i,'Could not locate production runtime section '+start);
 return runtime.slice(i,j);
}
const mock={
 snapshot$1:{},
 window:{SP_REACT:{createElement(type,props,...children){
   return {type,key:props?.key,props:{...props,children:children.length===1?children[0]:children}};
 }}},
 DFL:{MenuItem(){},findInReactTree(){return null;}},
 ChangeMusicButton:function ChangeMusicButton(){},
 GlobalPlaylistMenuButton:function GlobalPlaylistMenuButton(){},
};
const ctx=vm.createContext(mock);
const code=section('const spliceChangeMusic =','const handleItemDupes =')+
 section('function gtm460MenuLabel(row)','const patchMenuItems =')+
 '\\nthis.suite={spliceChangeMusic,gtm460FilterExternalMenuItems};';
vm.runInContext(code,ctx,{timeout:1000});
const {spliceChangeMusic,gtm460FilterExternalMenuItems}=ctx.suite;
function menu(flags={}){
 ctx.snapshot$1=flags;
 const entries=[{key:'steam-properties',props:{children:'Properties'}}];
 spliceChangeMusic(entries,123456);
 return entries;
}
const keys=items=>Array.from(items,row=>row.key);
assert.equal(menu().length,4,'three GTM items should be present by default');
const settings=[
 ['contextMenuShowMusic','game-theme-music-change-music'],
 ['contextMenuShowAmbient','game-theme-music-ambient-playlist'],
 ['contextMenuShowStore','game-theme-music-store-playlist']
];
for(const [setting,key] of settings){
 const items=menu({[setting]:false});
 assert.ok(!keys(items).includes(key),setting+' should hide its own row');
 assert.ok(keys(items).includes('steam-properties'));
 assert.equal(items.length,3);
}
assert.equal(menu({contextMenuShowMusic:false,contextMenuShowAmbient:false,contextMenuShowStore:false}).length,1);
const sample=[
 {key:'steam-properties',props:{children:'Properties'}},
 {key:'titledeck-edit-game',props:{children:'Edit with TitleDeck'}},
 {key:'steamgrid-art',props:{children:'Change Artwork...'}},
 {key:'developer',props:{children:'Developer'}},
 {key:'steam-manage',props:{children:'Manage'}},
];
const off={contextMenuShowTitleDeck:false,contextMenuShowArtwork:false,contextMenuShowDeveloper:false};
ctx.snapshot$1=off;
gtm460FilterExternalMenuItems(sample);
assert.deepEqual(keys(sample),['steam-properties','steam-manage']);
const other=[{key:'custom-addon',props:{children:'Developer Tools'}},{key:'other',props:{children:'Change Artwork Settings'}}];
gtm460FilterExternalMenuItems(other);
assert.equal(other.length,2,'unrelated menu entries must remain');
ctx.snapshot$1={};
const unchanged=[{key:'developer',props:{children:'Developer'}},{key:'titledeck-edit-game',props:{children:'Edit with TitleDeck'}}];
gtm460FilterExternalMenuItems(unchanged);
assert.equal(unchanged.length,2,'new installs should show external entries');
for(const setting of ['contextMenuShowMusic','contextMenuShowAmbient','contextMenuShowStore','contextMenuShowTitleDeck','contextMenuShowArtwork','contextMenuShowDeveloper']){
 assert.ok(runtime.includes(setting+': true'),'Missing default: '+setting);
 assert.ok(runtime.includes(setting+': value?.'+setting+' !== false'),'Missing persistence normalization: '+setting);
}
assert.ok(runtime.includes('gtm-v3-chip is-version'));
assert.ok(runtime.includes('GTM460_CSS'));
assert.ok(runtime.includes('65ms ease-out'));
assert.ok(runtime.includes('var(--gtm-interactive-accent'));
console.log('GTM 4.6.0 PASS: default ON, individual switches, safe filtering, saved preferences and adaptive version styles');

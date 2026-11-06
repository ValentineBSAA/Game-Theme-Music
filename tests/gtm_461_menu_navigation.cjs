#!/usr/bin/env node
'use strict';
// 4.6.1: execute the shipped GTM context-menu function; verify A-Z live pages.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const runtime=fs.readFileSync('dist/index.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const plugin=JSON.parse(fs.readFileSync('plugin.json','utf8'));
assert.equal(pkg.version,'4.6.1');
assert.equal(plugin.version,'4.6.1');
assert.ok(runtime.includes('const GTM_VERSION = "4.6.1";'));
function section(start,end){
 const i=runtime.indexOf(start),j=runtime.indexOf(end,i+start.length);
 assert.ok(i>=0&&j>i,'Missing production section: '+start);
 return runtime.slice(i,j);
}
const mock={
 snapshot$1:{},window:{SP_REACT:{createElement(type,props,...children){
   return {type,key:props?.key,props:{...props,children:children.length===1?children[0]:children}};
 }}},
 DFL:{MenuItem(){},findInReactTree(){return null}},
 ChangeMusicButton:function ChangeMusicButton(){},
 GlobalPlaylistMenuButton:function GlobalPlaylistMenuButton(){},
};
const ctx=vm.createContext(mock);
vm.runInContext(section('const spliceChangeMusic =','const isOpeningAppContextMenu =')+
 '\nthis.exports={spliceChangeMusic,handleItemDupes};',ctx,{timeout:1500});
const {spliceChangeMusic,handleItemDupes}=ctx.exports;
const keys=rows=>Array.from(rows,row=>row.key);
function menu(flags={}){
 ctx.snapshot$1=flags;
 const rows=[
  {key:'steam-properties',props:{children:'Properties'}},
  {key:'titledeck-edit-game',props:{children:'Edit with TitleDeck'}},
  {key:'steam-artwork',props:{children:'Change Artwork'}},
  {key:'developer',props:{children:'Developer'}}
 ];
 spliceChangeMusic(rows,777);
 return rows;
}
const own=[
 ['contextMenuShowMusic','game-theme-music-change-music'],
 ['contextMenuShowAmbient','game-theme-music-ambient-playlist'],
 ['contextMenuShowStore','game-theme-music-store-playlist']
];
assert.equal(menu().length,7,'default ON shows three GTM shortcuts');
for(const [flag,key] of own){
 const rows=menu({[flag]:false});
 assert.ok(!keys(rows).includes(key),'should hide only '+flag);
 assert.equal(rows.length,6);
 assert.ok(keys(rows).includes('titledeck-edit-game'));
 assert.ok(keys(rows).includes('steam-artwork'));
 assert.ok(keys(rows).includes('developer'));
}
const mixed=menu({contextMenuShowAmbient:false});
assert.ok(keys(mixed).includes('game-theme-music-change-music'));
assert.ok(keys(mixed).includes('game-theme-music-store-playlist'));
assert.ok(!keys(mixed).includes('game-theme-music-ambient-playlist'));
const none=menu({contextMenuShowMusic:false,contextMenuShowAmbient:false,contextMenuShowStore:false});
assert.equal(none.length,4);
const duped=menu();spliceChangeMusic(duped,777); // Steam can refresh a menu, caller removes duplicates before patch.
handleItemDupes(duped);spliceChangeMusic(duped,777);
for(const [flag,key] of own)assert.equal(keys(duped).filter(k=>k===key).length,1);
for(const [flag] of own){
 assert.ok(runtime.includes(flag+': true'),'Missing default '+flag);
 assert.ok(runtime.includes(flag+': value?.'+flag+' !== false'),'Missing normalization '+flag);
}
for(const name of ['contextMenuShowTitleDeck','contextMenuShowArtwork','contextMenuShowDeveloper','gtm460FilterExternalMenuItems']){
 assert.ok(!runtime.includes(name),'The experimental external menu code must be removed: '+name);
}
function pages(start,end){
 const block=section(start,end);
 return [...block.matchAll(/\{ id: '([^']+)', label: '([^']+)'/g)].map(x=>({id:x[1],label:x[2]}));
}
const active=pages('const GTM_V301_PAGES = [','function GtmV301BrandBanner');
const old=pages('const GTM_V3_PAGES = [','function gtmV3LoadPage');
assert.equal(active.length,9);
assert.equal(new Set(active.map(x=>x.id)).size,9);
assert.deepEqual(active.map(x=>x.label),active.map(x=>x.label).sort((a,b)=>a.localeCompare(b,'en')));
assert.deepEqual(old.map(x=>x.id),active.map(x=>x.id),'legacy page definitions mirror live order');
assert.equal(active[0].label,'Ambient Music');
assert.equal(active[5].label,'Now Playing');
assert.ok(runtime.includes('A–Z order · LB/RB to switch'));
assert.ok(runtime.includes('GTM461_CSS'));
assert.ok(runtime.includes('gtm-v301-brand-badges .gtm-v301-brand-version'));
assert.ok(runtime.includes('WHAT CHANGED IN 4.6.1'));
assert.ok(!runtime.includes("'4.5.8 HIGHLIGHTS'"));
assert.ok(runtime.includes('const GTM448_WELCOME_KEY = `gtm:welcome:seen:${GTM_VERSION}`'));
assert.ok(runtime.includes('65ms ease-out'),'Keep proven flicker-free switch feedback');
console.log('PASS 4.6.1: GTM-only toggles, mixed states, external rows untouched, A-Z LB/RB pages, welcome, adaptive badge and metadata');

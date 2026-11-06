#!/usr/bin/env node
'use strict';
// 4.6.1: inspect the actual shipped runtime, not a duplicate implementation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const runtime=fs.readFileSync('dist/index.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const plugin=JSON.parse(fs.readFileSync('plugin.json','utf8'));
assert.equal(pkg.version,'4.6.1'); assert.equal(plugin.version,'4.6.1');
assert.match(runtime,/const GTM_VERSION = "4\.6\.1";/);
for(const marker of ['contextMenuShowTitleDeck','contextMenuShowArtwork','contextMenuShowDeveloper',
 'gtm460FilterExternalMenuItems','gtm460MenuLabel']){
 assert.ok(!runtime.includes(marker),'Unexpected third-party/Steam menu code: '+marker);
}
for(const key of ['contextMenuShowMusic','contextMenuShowAmbient','contextMenuShowStore']){
 assert.ok(runtime.includes(key+': true'),'Missing default ON: '+key);
 assert.ok(runtime.includes(key+': value?.'+key+' !== false'),'Missing settings migration: '+key);
}
function section(begin,end){
 const i=runtime.indexOf(begin),j=runtime.indexOf(end,i+begin.length);
 assert.ok(i>=0&&j>i,'Missing runtime section '+begin);
 return runtime.slice(i,j);
}
function pageRows(begin,end){
 const body=section(begin,end);
 return [...body.matchAll(/\{ id: '([^']+)', label: '([^']+)'/g)].map(m=>({id:m[1],label:m[2]}));
}
function assertAlphabetical(rows,n){
 assert.equal(rows.length,n,'Expected '+n+' tabs');
 const labels=rows.map(x=>x.label);
 assert.deepEqual(labels,[...labels].sort((a,b)=>a.localeCompare(b,'en')), 'Pages must be A-Z');
 assert.equal(new Set(rows.map(x=>x.id)).size,n,'Stable IDs must be unique');
}
const quick=pageRows('const GTM_V301_PAGES = [','function GtmV301BrandBanner');
const legacy=pageRows('const GTM_V3_PAGES = [','function gtmV3LoadPage');
const manager=pageRows('const GTM_V330_MANAGER_SECTIONS = [','function gtmV330ReadLaunch');
assertAlphabetical(quick,9);assertAlphabetical(legacy,9);assertAlphabetical(manager,6);
assert.deepEqual(quick.map(x=>x.id),legacy.map(x=>x.id));
assert.deepEqual(quick.map(x=>x.id),['ambient','arcade','game','health','library','now','settings','store','visualizers']);
assert.deepEqual(manager.map(x=>x.id),['ambient','find','games','import','library','store']);
assert.ok(runtime.includes("localStorage.getItem(GTM_V3_PAGE_KEY)"),'Existing page selection storage preserved');
assert.ok(runtime.includes('GTM_V301_PAGES.findIndex'),'LB/RB still use current ordered page IDs');
const mock={
 snapshot$1:{},
 window:{SP_REACT:{createElement(type,props,...children){return {type,key:props?.key,props:{...props,children}};}}},
 DFL:{MenuItem(){},findInReactTree(){return null;}},
 ChangeMusicButton:function ChangeMusicButton(){},
 GlobalPlaylistMenuButton:function GlobalPlaylistMenuButton(){}
};
const ctx=vm.createContext(mock);
vm.runInContext(section('const spliceChangeMusic =','const handleItemDupes =')+'\nthis.spliceChangeMusic=spliceChangeMusic;',ctx,{timeout:1000});
const keys=items=>items.map(row=>row.key);
const originals=[
 {key:'native-properties',props:{children:'Properties'}},
 {key:'titledeck-edit-game',props:{children:'Edit with TitleDeck'}},
 {key:'steamgrid-art',props:{children:'Change Artwork'}},
 {key:'developer',props:{children:'Developer'}}
];
for(let mask=0;mask<8;mask++){
 ctx.snapshot$1={
  contextMenuShowMusic:Boolean(mask&1),
  contextMenuShowAmbient:Boolean(mask&2),
  contextMenuShowStore:Boolean(mask&4)
 };
 const rows=originals.map(x=>({...x}));
 ctx.spliceChangeMusic(rows,123456);
 const found=keys(rows);
 const expected=['game-theme-music-change-music','game-theme-music-ambient-playlist','game-theme-music-store-playlist'];
 for(let n=0;n<3;n++)assert.equal(found.includes(expected[n]),Boolean(mask&(1<<n)),'GTM toggle '+n+' mask '+mask);
 for(const original of originals)assert.ok(found.includes(original.key),'Must not remove other plugins or Steam rows: '+original.key);
}
assert.match(runtime,/4\.6\.1 CHANGELOG/);
assert.ok(!runtime.includes('4.5.8 HIGHLIGHTS'),'Welcome must show this version');
assert.ok(runtime.includes('gtm-v301-brand-badges .gtm-v301-brand-version'),'Visible Quick Menu version badge themed');
assert.ok(runtime.includes('65ms ease-out'),'Fast switch effect retained');
console.log('PASS GTM 4.6.1: A-Z navigation, three independent GTM switches, external menus untouched, welcome + contrast');

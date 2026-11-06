#!/usr/bin/env node
'use strict';
// GTM 4.6.1: test the shipped frontend bundle and actual menu injection logic.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const js=fs.readFileSync('dist/index.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const plugin=JSON.parse(fs.readFileSync('plugin.json','utf8'));
assert.equal(pkg.version,'4.6.1');
assert.equal(plugin.version,'4.6.1');
assert.match(js,/const GTM_VERSION = "4\.6\.1";/);
for(const key of ['contextMenuShowMusic','contextMenuShowAmbient','contextMenuShowStore']){
 assert.ok(js.includes(key+': true'),key+' default ON');
 assert.ok(js.includes(key+': value?.'+key+' !== false'),key+' normalization');
}
for(const external of ['contextMenuShowTitleDeck','contextMenuShowArtwork','contextMenuShowDeveloper','gtm460FilterExternalMenuItems','gtm460MenuLabel']){
 assert.ok(!js.includes(external),'Removed non-GTM feature: '+external);
}
assert.ok(js.includes('65ms ease-out'),'Fast switch color timing retained');
assert.ok(js.includes('NEW IN 4.6.1'),'Welcome changelog updated');
assert.ok(js.includes('gtm:welcome:seen:${GTM_VERSION}'),'Per-version welcome retained');
assert.ok(js.includes('.gtm-v301-brand-badges .gtm-v301-brand-version'),'Actual banner version contrast styled');
assert.ok(js.includes('color-mix(in srgb, var(--gtm-text)'),'Banner contrast linked to theme');
function section(begin,end){
 const a=js.indexOf(begin),b=js.indexOf(end,a+begin.length);
 assert.ok(a>=0&&b>a,'Missing runtime section '+begin);
 return js.slice(a,b);
}
const mock={snapshot$1:{},window:{SP_REACT:{createElement:(type,props,...kids)=>({type,key:props?.key,props:{...props,children:kids}})}},DFL:{MenuItem(){},findInReactTree(){return null}},ChangeMusicButton(){},GlobalPlaylistMenuButton(){}};
const ctx=vm.createContext(mock);
vm.runInContext(section('const spliceChangeMusic =','const handleItemDupes =')+
 '\nthis.inject=spliceChangeMusic;',ctx,{timeout:1000});
const options=[['contextMenuShowMusic','game-theme-music-change-music'],['contextMenuShowAmbient','game-theme-music-ambient-playlist'],['contextMenuShowStore','game-theme-music-store-playlist']];
function entries(opts={}){
 ctx.snapshot$1=opts;
 const list=[{key:'steam-properties',props:{children:'Properties'}},{key:'titledeck-edit-game',props:{children:'Edit with TitleDeck'}},{key:'developer',props:{children:'Developer'}}];
 ctx.inject(list,12345);
 return list.map(x=>x.key);
}
const all=entries();
for(const [key,menuKey] of options)assert.ok(all.includes(menuKey),'Default present '+menuKey);
assert.ok(all.includes('titledeck-edit-game'),'TitleDeck remains owned by TitleDeck');
assert.ok(all.includes('developer'),'Steam Developer remains unchanged');
for(const [key,menuKey] of options) {
 const current=entries({[key]:false});
 assert.ok(!current.includes(menuKey),'OFF hides only '+menuKey);
 for(const [,otherKey] of options.filter(o=>o[0]!==key))assert.ok(current.includes(otherKey),'Other rows remain');
 assert.ok(current.includes('titledeck-edit-game'));
}
assert.equal(entries(Object.fromEntries(options.map(([key])=>[key,false]))).length,3,'No GTM entries when all OFF');
// Verify the actual LB/RB carousel is sorted by full visible labels.
const pageCode=section('const GTM_V301_PAGES =','function GtmV301BrandBanner');
const pageCtx=vm.createContext({});
vm.runInContext(pageCode+'\nthis.pages=GTM_V301_PAGES;',pageCtx,{timeout:1000});
const pages=Array.from(pageCtx.pages);
const labels=pages.map(p=>p.label);
assert.deepEqual(labels,[...labels].sort((a,b)=>a.localeCompare(b,'en')),'A-Z page order');
assert.equal(pages.length,9);
assert.equal(new Set(pages.map(p=>p.id)).size,9);
assert.ok(pages.some(p=>p.id==='now'&&p.label==='Now Playing'));
assert.ok(js.includes("saved : 'now'"),'Opening page remains Now Playing');
// Welcome covers each user-visible change and does not say 4.5.8 HIGHLIGHTS.
assert.ok(!js.includes("'4.5.8 HIGHLIGHTS'"));
assert.ok(js.includes("Unrelated TitleDeck, artwork and Developer options have been removed"));
console.log('PASS GTM 4.6.1: 3 switches, independent visibility, no external interference, alphabetical pages, updated welcome and banner');

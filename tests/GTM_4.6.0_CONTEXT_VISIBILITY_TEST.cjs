// GTM 4.6.0 Preview: test the actual bundled Steam Library injection function.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const root = require('node:path').resolve(__dirname,'..');
const js=readFileSync(require('node:path').join(root,'dist/index.js'),'utf8');
const plugin=JSON.parse(readFileSync(require('node:path').join(root,'plugin.json'),'utf8'));
const pkg=JSON.parse(readFileSync(require('node:path').join(root,'package.json'),'utf8'));
assert.equal(plugin.version,'4.6.0');
assert.equal(pkg.version,'4.6.0');
assert.match(js,/const GTM_VERSION = "4\.6\.0";/);
for(const key of ['contextMenuShowChangeMusic','contextMenuShowAmbientPlaylist','contextMenuShowStorePlaylist']){
  assert.ok(js.includes(key),'missing setting: '+key);
  assert.ok(js.includes(key+': value?.'+key+' !== false'),'missing migration default for '+key);
}
const a=js.indexOf('const spliceChangeMusic = (children, appid) => {');
const b=js.indexOf('const handleItemDupes =',a);
assert.ok(a>0&&b>a,'context menu implementation not found');
const snippet=js.slice(a,b);
const DFL={findInReactTree:()=>null};
const windowStub={SP_REACT:{createElement:(type,props)=>({type,key:props.key,props})}};
const makeFunction=(settings)=>new Function('snapshot$1','DFL','window','ChangeMusicButton','GlobalPlaylistMenuButton',snippet+';return spliceChangeMusic;')(settings,DFL,windowStub,()=>{},()=>{});
const keys=['game-theme-music-change-music','game-theme-music-ambient-playlist','game-theme-music-store-playlist'];
for(let mask=0;mask<8;mask++){
  const settings={
    contextMenuShowChangeMusic: !(mask&1),
    contextMenuShowAmbientPlaylist: !(mask&2),
    contextMenuShowStorePlaylist: !(mask&4)
  };
  const existing={key:'titledeck-change-artwork'};
  const items=[existing];
  makeFunction(settings)(items,12345);
  const expected=keys.filter((_,i)=>!(mask&(1<<i)));
  assert.deepEqual(items.slice(1).map(item=>item.key),expected,'menu state '+mask);
  assert.equal(items[0],existing,'do not disturb other plugins');
}
const legacy=[];
makeFunction({})(legacy,12345);
assert.deepEqual(legacy.map(x=>x.key),keys,'upgrades default to all visible');
const invalid=[];
makeFunction({})(invalid,0);
assert.equal(invalid.length,0,'invalid appid not patched');
assert.ok(js.includes('GTM460_FAST_SWITCH_CSS'),'fast switches missing');
assert.ok(js.includes('.gtm-v301-brand-badges .gtm-v301-brand-version'),'banner version accent missing');
assert.ok(js.includes('var(--gtm-on-accent'),'contrast pair missing');
console.log('PASS GTM 4.6.0 Preview: 8 context combinations, legacy settings, external items, banner, fast switches, metadata');

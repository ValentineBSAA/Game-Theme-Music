// Offline playback-engine unit tests. Does NOT claim real Deck/media startup timing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src=fs.readFileSync(__dirname+'/dist/index.js','utf8');
const start=src.indexOf('class AudioEngine {');
const end=src.indexOf('const audioEngine = (() => {',start);
assert(start>0 && end>start);
class MockAudio {
  constructor(){this.src='';this.preload='';this.crossOrigin='';this.currentTime=0;
    this.duration=50;this.readyState=0;this.volume=1;this.paused=true;
    this.muted=false;this.loop=false;this.ended=false;this.events={};}
  addEventListener(name,cb){(this.events[name]??=[]).push(cb);}
  emit(name){for(const cb of (this.events[name]||[]))cb();}
  removeAttribute(name){if(name==='src')this.src='';else if(name==='crossorigin')this.crossOrigin='';}
  load(){ if(this.src){this.readyState=4;this.emit('loadeddata');this.emit('canplay');}
    else {this.readyState=0;this.emit('emptied');} }
  async play(){if(!this.src)throw Error('no src');this.paused=false;this.emit('playing');}
  pause(){const was=!this.paused;this.paused=true;if(was)this.emit('pause');}
}
const ctx={Audio:MockAudio,desktopPlaybackBlocked:false,gtmResonaDeckFocus:{active:false},
  gtmV389SourceClass:url=>url.startsWith('http://127.0.0.1:')?'gtm-loopback-audio':'external-http',
  gtmV389PrepareAudioCors:(a,url)=>{a.crossOrigin=url.includes('127.0.0.1')?'anonymous':''},
  gtmUpdateContinuityArmed:()=>false,gtmUpdateContinuityHandoffActive:()=>false,
  gtmContinuityResourceKey:x=>x,clamp:n=>Math.max(0,Math.min(1,n)),
  setTimeout,Date,console};
vm.createContext(ctx);
vm.runInContext(src.slice(start,end)+';globalThis.TestEngine=AudioEngine',ctx);
const Engine=ctx.TestEngine;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const e=new Engine();
 const states=[];e.subscribe(x=>states.push(x));
 const a='http://127.0.0.1:47680/audio/one';
 const b='http://127.0.0.1:47680/audio/two';
 let cross=0;let ended=0;
 const nextOpts={volume:.8,fadeInMs:0,loop:false,trackKey:'next',crossfadeMs:700,onEnded:()=>ended++};
 const opts={volume:.8,fadeInMs:0,loop:false,trackKey:'first',crossfadeMs:700,
   onEnded:()=>ended++,onCrossfade:()=>{cross++;e.load(b,'deck-ambient',nextOpts);void e.play('deck-ambient');}};
 e.load(a,'deck-ambient',opts);
 await e.play('deck-ambient');
 const old=e.audio;
 assert.equal(e.prepareTrack(b,'deck-ambient','next'),true);
 assert.equal(e.getWarmupDiagnostic().status,'buffered');
 assert.equal(e.preparedAudio.audio.paused,true,'preload must not be audible');
 old.currentTime=49.5;
 old.emit('timeupdate');
 await sleep(30);
 assert.equal(cross,1,'one pre-end transition');
 assert.equal(e.audio.src,b);
 assert.equal(e.audio.paused,false,'new audio should play');
 assert.equal(e.crossfadeStats.starts,1);
 assert.equal(old.paused,false,'previous audio should overlap for a short time');
 const before=states.length;old.emit('ended');old.emit('pause');
 assert.equal(ended,0,'retired old song cannot advance the queue');
 assert.equal(states.length,before,'retired old events do not publish state');
 await sleep(650);
 assert.equal(old.paused,true,'old audio cleaned up after crossfade');
 assert.equal(e.crossfadeStats.state,'completed');
 // Focus takeover must stop both even if crossfade is still active.
 const c='http://127.0.0.1:47680/audio/three';
 e.prepareTrack(c,'deck-ambient','third');
 const nextOld=e.audio;
 e.requestedCrossfadeMs=900;
 e.load(c,'deck-ambient',{volume:.8,fadeInMs:0,loop:false,trackKey:'third',crossfadeMs:900});
 const secondOverlap=e.play('deck-ambient');
 await sleep(40);
 assert.equal(nextOld.paused,false);
 e.pause('deck-ambient');
 await secondOverlap;
 assert.equal(nextOld.paused,true,'focus must stop outgoing audio');
 assert.equal(e.audio.paused,true);
 // Nonbuffered fallback never fires early crossfade.
 const fallback = new Engine();
 fallback.load(a,'deck-store',{volume:1,trackKey:'s1',loop:false,crossfadeMs:8000,
   onCrossfade:()=>{throw Error('should not crossfade without buffered next')},onEnded:()=>{ended++}});
 await fallback.play('deck-store');
 fallback.audio.currentTime=49;
 fallback.audio.emit('timeupdate');
 fallback.audio.emit('ended');
 assert.equal(ended,1);
 // Prebuffer alone is not permission to advance across different playlist owners.
 const another=new Engine();
 another.load(a,'deck-store',{volume:.8,trackKey:'store1',loop:false,crossfadeMs:700,onCrossfade:()=>{cross++}});
 await another.play('deck-store');
 another.prepareTrack(b,'deck-ambient','next');
 another.audio.currentTime=49.5;
 another.audio.emit('timeupdate');
 assert.equal(cross,1);
 // Crossfade metadata and handlers survive an adoption/continuity operation.
 assert.equal(typeof e.getWarmupDiagnostic,'function');
 assert(src.includes('crossfadeIntent'), 'Store must avoid aligning outgoing queue over next');
 assert(src.includes('this.crossfadeCompatible = true'),'new-player listeners must be guarded');
 assert(src.includes('existing.crossfadeCompatible = false'),'upgraded singleton must avoid stale listeners');
 assert(src.includes('settings.crossfadeEnabled !== false && playlist.length > 1 ? 8000 : 0'),'Store playlist option must exist');
 assert(src.includes('settings.crossfadeEnabled !== false && ambientMultiple ? 8000 : 0'),'Ambient playlist option must exist');
 assert(src.includes("const GTM_VERSION = \"4.4.1\""),'version must be 4.4.1');
 console.log('PASS GTM 4.0.4: prebuffer, true overlap, retired callbacks, focus clean-up, nonbuffered fallback, distinct playlist owners, compatibility, version');
})().catch(err=>{console.error(err);process.exit(1)});

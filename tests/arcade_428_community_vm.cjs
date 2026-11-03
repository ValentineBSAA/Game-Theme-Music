'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');const root=path.join(__dirname,'..');
const pack=JSON.parse(fs.readFileSync(root+'/visualizer-packs/sdk-examples/Neon_Dodger_Community/manifest.json'));
assert.equal(pack.format,3);const program=pack.scenes[0].program;
const script=fs.readFileSync(root+'/src/visualizer-behaviors/pack-program-418.js','utf8');
const first=script.indexOf('const GTM418_PROGRAM_STATES');const last=script.indexOf('function gtm418DrawProgram(',first);
const sandbox={Math,Date,console};vm.createContext(sandbox);
vm.runInContext(script.slice(first,last)+'\nthis.update=gtm418RunCommands',sandbox);
const env={...program.state,dt:1/60,p1x:0,p1lb:0,p1rb:0,human1:0,beat:0,low:0};
function tick(n=1){for(let i=0;i<n;i++)sandbox.update(program.update,env,{},1280,220,{left:12500,draw:0},'update');}
const before=env.fall;tick(60);assert(env.fall>before,'hazard did not advance');
const score=env.score;tick(400);assert(env.score>score,'hazards did not reach a scoring cycle');
env.human1=1;env.shield_cd=0;env.last_lb=0;env.p1lb=1;tick();assert(env.shield>1.9&&env.shield_cd>11.9);
env.p1rb=1;tick();assert(env.dash>0&&env.dash_cd>7.9);
const shield=env.shield_cd;tick(15);assert(env.shield_cd<shield);
// Verify a protected collision causes no life loss.
env.player=.5;env.hazard=.5;env.fall=.818;env.invuln=0;env.shield=1.1;
const lives=env.lives;tick(2);assert.equal(env.lives,lives,'shield failed to block collision');
// Verify an unprotected collision loses a life and latches invulnerability.
env.player=.5;env.hazard=.5;env.fall=.818;env.invuln=0;env.shield=0;tick(2);
assert.equal(env.lives,lives-1,'collision must lose one life');
assert(env.invuln>0,'collision needs a brief invulnerability interval');
console.log('PASS community pack supports AI demo, scoring, shield/dash cooldowns, and collisions');

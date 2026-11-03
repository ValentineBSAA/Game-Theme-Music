// GTM 4.2.1 Preview: trusted built-in Arcade simulation, not part of the public pack SDK.
// Original procedurally drawn 2D games. No third-party images, brands, scripts or network use.
// Match simulation uses fixed timesteps; arrays, life pools, projectiles and waves are bounded.
const GTM421_ARCADE_IDS=new Set([
 'world_arcade_neon_chess','world_arcade_beat_catcher','world_arcade_orbital_duel','world_arcade_orbit_defenders',
 'world_arcade_neon_strike_gallery'
]);
const GTM421_INSTANCE_POOLS=new WeakMap();
const g421Clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const g421Dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
function g421Random(s){let n=s.seed|0;n^=n<<13;n^=n>>>17;n^=n<<5;s.seed=n;return (n>>>0)/4294967296;}
function g421Base(){return {seed:0x47544d,elapsed:0,score:0,wave:1,over:0,wait:.18,needInput:false,ready:true,particles:[]};}
function g421Input(controls){
 const first=controls.side==='right'?controls.right:controls.left;
 const second=controls.side==='right'?controls.left:controls.right;
 const clean=x=>x||{x:0,y:0,lb:0,rb:0,rt:0,lt:0,human:0};
 return {p1:clean(first),p2:clean(second),human1:!!controls.human1,human2:!!controls.human2,ai:controls.mode==='ai_ai',mode:controls.mode};
}
function g421Graph(ctx,w,h){
 const c=(x,y,r,color,alpha=1)=>{ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x*w,y*h,Math.max(0,r*h),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;};
 const r=(x,y,wide,tall,color,alpha=1)=>{ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(x*w,y*h,wide*w,tall*h);ctx.globalAlpha=1;};
 const l=(x,y,x2,y2,color,width=.006,alpha=1)=>{ctx.globalAlpha=alpha;ctx.beginPath();ctx.moveTo(x*w,y*h);ctx.lineTo(x2*w,y2*h);ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,h*width);ctx.stroke();ctx.globalAlpha=1;};
 const t=(label,x,y,color='#f1f5ff',size=.12,align='left')=>{ctx.font=`800 ${Math.max(10,Math.round(h*size))}px system-ui, sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(String(label),x*w,y*h,w*.95);};
 const p=(points,color,alpha=1)=>{if(!points.length)return;ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0]*w,points[0][1]*h);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0]*w,points[i][1]*h);ctx.closePath();ctx.fill();ctx.globalAlpha=1;};
 const ring=(x,y,radius,color,alpha=.7,width=.009)=>{ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,h*width);ctx.beginPath();ctx.arc(x*w,y*h,Math.max(1,radius*h),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;};
 return {c,r,l,t,p,ring,w,h};
}
function g421Hud(d,title,left,right,hint){
 const {r,t,l}=d;r(.015,.012,.97,.182,'#060d21',.96);l(.02,.198,.98,.198,'#67b9ff',.006,.76);
 t(title,.035,.073,'#f5f5ff',.114);
 t(left,.53,.073,'#9eebff',.105);
 t(right,.97,.073,'#ffe59a',.105,'right');
 r(.015,.89,.97,.092,'#080d21',.79);t(hint,.5,.939,'#dbe5fa',.108,'center');
}
function g421BlackHole(d,time,strength=1,x=.5,y=.45){
 const {c,l}=d;const shimmer=.5+.5*Math.sin(time*1.7);
 c(x,y,.15,'#8f63fb',.09*strength);c(x,y,.115,'#ffbb76',.09*strength);
 // Accretion disk: visually related to, but independent from, Chromatic Event Horizon.
 for(let i=0;i<18;i++){
  const a=i*Math.PI*2/18+time*.22;
  const radius=.1+.022*Math.sin(a*3+time);
  l(x+Math.cos(a)*radius*1.65,y+Math.sin(a)*radius*.38,
    x+Math.cos(a+.26)*radius*1.65,y+Math.sin(a+.26)*radius*.38,
    i%3?'#9c79ff':'#ffc487',.012,Math.min(.75,.25+shimmer*.23));
 }
 c(x,y,.069,'#030411',1);c(x,y,.073,'#cd98ff',.38);c(x,y,.058,'#01020a',1);
}
function g421Gravity(obj,x,y,power,dt){
 if(power<=0)return false;
 const dx=x-obj.x,dy=y-obj.y,r2=dx*dx+dy*dy+.008;
 const factor=g421Clamp(power*.0027/r2,0,1.6);
 obj.vx=g421Clamp(obj.vx+dx*factor*dt,-1.5,1.5);
 obj.vy=g421Clamp(obj.vy+dy*factor*dt,-1.5,1.5);
 return r2<.0052;
}
function g421Fire(s,x,y,vx,vy,owner,color,damage=1){
 if(s.shots.length>=44)return;
 s.shots.push({x,y,vx,vy,owner,color,damage,age:0});
}
function g421StepShots(s,dt,gravity,x,y){
 for(let i=s.shots.length-1;i>=0;i--){
  const b=s.shots[i];b.age+=dt;
  const swallowed=g421Gravity(b,x,y,gravity,dt);
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(swallowed||b.age>3.1||b.x<-.02||b.x>1.02||b.y<.18||b.y>.9)s.shots.splice(i,1);
 }
}
function g421Controls(s,input,dt){
 for(let i=0;i<2;i++){
  const p=i?input.p2:input.p1,human=i?input.human2:input.human1;
  const ship=s.ships[i];if(!ship)continue;
  if(human){ship.x=g421Clamp(ship.x+p.x*dt*1.05,.055,.945);
    if(ship.y!==undefined)ship.y=g421Clamp(ship.y+p.y*dt*.8,.32,.83);
  }
 }
}
// Arcade-wide bounded abilities. Game-specific powers share edge detection,
// human/AI ownership, true per-player cooldowns, and a lightweight HUD.
function g423UsePower(s,I,player,id,button,cooldown,duration=0,auto=false,allowed=true){
 if(!s.arcadePowers)s.arcadePowers=[Object.create(null),Object.create(null)];
 const slots=s.arcadePowers[player];
 if(!slots[id])slots[id]={cool:0,maxCool:cooldown,active:0,last:false,nextAuto:.9+player*.65};
 const a=slots[id],pad=player?I.p2:I.p1,human=player?I.human2:I.human1;
 const adjustedCooldown=cooldown*(Number(s.abilityRecharge)||1);
 a.maxCool=adjustedCooldown;
 a.cool=Math.max(0,a.cool-1/60);a.active=Math.max(0,a.active-1/60);
 const down=!!(pad&&pad[button]&&(button==='lt'||button==='rt'?pad[button]>.5:true));
 const rising=down&&!a.last;a.last=human&&down;
 const aiReady=!human&&auto&&s.elapsed>=a.nextAuto;
 if(allowed&&a.cool<=0&&(human?rising:aiReady)){
  a.cool=adjustedCooldown;a.active=duration;a.nextAuto=s.elapsed+adjustedCooldown+1.4+player*.6;
  s.abilityNotice=`P${player+1} ${id.toUpperCase().replace(/_/g,' ')}!`;
  s.abilityNoticeLeft=1.25;return true;
 }
 return false;
}
function g423PowerActive(s,player,id){return (s.arcadePowers?.[player]?.[id]?.active||0)>0;}
function g423PowerHud(d,s,leftLabel,rightLabel,keys='RB/LB'){
 const {r,t}=d;const powers=s.arcadePowers||[];
 for(let i=0;i<2;i++){
  const entries=Object.entries(powers[i]||{}).slice(0,3),start=i?.517:.018;
  const label=i?rightLabel:leftLabel;
  if(!entries.length)continue;
  t(`P${i+1} ${label}`,start,.158,i?'#ffb1db':'#9eeeff',.061);
  const tokens=keys.split('/');
  entries.forEach(([name,state],k)=>{
   const x=start+.15+k*.106,y=.139,width=.097;
   const recharge=state.cool<=0?1:Math.max(.04,1-state.cool/Math.max(1,state.maxCool||18));
   r(x,y,width,.032,'#172944',.97);
   r(x,y,width*recharge,.032,state.active>0?'#ffe99a':i?'#e384ba':'#6acff7',.55);
   // Top-of-scoreboard gauges remain outside the active playing field.
   t(`${tokens[k]||'X'} ${state.active>0?'ON':state.cool>0?Math.ceil(state.cool)+'s':'OK'}`,
     x+.003,.155,'#f9fbff',.059);
  });
 }
 if(s.abilityNoticeLeft>0){t(s.abilityNotice,.50,.237,'#ffe4ab',.103,'center');s.abilityNoticeLeft=Math.max(0,s.abilityNoticeLeft-1/60);}
}
// Rhythm catcher: continuous falling notes, combos, misses, lives, two-player race.

// GTM 4.2.3 Preview: original, deterministic low-cost vector artwork shared by
// built-in arcade games. No bitmap sprites, shaders, remote assets or texture uploads.
// Coordinates are normalized; all objects remain readable in small and Couch views.
function g423Sky(d,s,tone='space',audio={}){
 const {r,c,l}=d,time=s.elapsed||0,beat=g421Clamp(Number(audio.beat)||0,0,1);
 r(0,.18,1,.74,tone==='rhythm'?'#0e0b2b':tone==='defense'?'#090f25':'#050e26');
 // 4.2.8 cinematic scenery foundation: three parallax depths, drifting light
 // clouds and responsive sky illumination. Only drawing changes; gameplay,
 // audio, menu stacking and the fixed-step simulation remain untouched.
 // All effects stay beneath the HUD and above only the opaque scene canvas.
 const drift=Math.sin(time*.065)*.017,light=.9+beat*.25;
 c(.28+Math.sin(time*.031)*.045,.49,.30,tone==='rhythm'?'#8e51b5':'#45549d',.025*light);
 c(.75+Math.cos(time*.024)*.035,.39,.23,tone==='rhythm'?'#d353a8':'#744bab',.036*light);
 for(let i=0;i<(s.cinematic===0?12:s.cinematic===1?26:42);i++){
  const depth=i%3,travel=time*(.00055+depth*.0007);
  const raw=((i*73+19)%101)/101;
  const x=((raw+travel+drift*(depth+1))%1+1)%1;
  const y=.23+((i*59+7)%73)/105+Math.sin(time*.045+i)*(.002+depth*.0015);
  const glow=.25+.24*(.5+.5*Math.sin(time*(.32+i%4*.08)+i*2.8));
  c(x,y,(.0038+(i%5)*.0014)*(1+depth*.16),i%4?'#d7e8ff':'#a7a6ff',Math.min(.9,glow+.12*beat));
 }
 if(tone==='rhythm'){
  c(.52,.47,.29,'#d94ea8',.06+.03*beat);c(.52,.44,.18,'#8552ff',.08);
  for(let i=0;i<=10;i++){const xx=i/10;l(.5,.48,xx,.87,'#ba6fff',.002,.20);}
  for(let i=0;i<6;i++)l(0,.52+i*i*.013,1,.52+i*i*.013,'#da67df',.002,.21);
  for(let i=0;i<18;i++){const amp=.018+Math.abs(Math.sin(time*2+i*.42))*.085*(.4+.6*beat);
    r(i/19+.025,.86-amp,.009,amp,'#bd68f7',.19);}
 }else if(tone==='defense'){
  c(.84,.53,.23,'#386cd6',.14);c(.23,.45,.26,'#7739a0',.045);
 }else{
  c(.5,.55,.22,'#585ab2',.045);c(.8,.5,.25,'#8e38d0',.055);
 }
}
function g423Planet(d,x,y,rad,s,shade='#4c98e0'){
 const {c,l,ring}=d,t=s.elapsed||0;
 c(x,y,rad*1.55,shade,.055);c(x,y,rad*1.18,'#74d8ff',.15);
 c(x,y,rad,'#154179');c(x-rad*.16,y-rad*.13,rad*.75,'#397dba',.52);
 for(let i=0;i<6;i++){
  const q=i*1.67+t*.025;const px=x+Math.sin(q)*rad*.57,py=y+Math.cos(q*.71)*rad*.55;
  c(px,py,rad*(.12+(i%3)*.05),i%2?'#51a9af':'#89b8ed',.34);
 }
 for(let i=0;i<8;i++){const a=i*Math.PI/7;const x1=x+Math.cos(a)*rad*1.8,y1=y+Math.sin(a)*rad*.43;
  const x2=x+Math.cos(a+.2)*rad*1.8,y2=y+Math.sin(a+.2)*rad*.43;
  l(x1,y1,x2,y2,i%2?'#b8ddff':'#b6a5ff',.006,.45);}
 ring(x,y,rad,'#8adcfb',.6,.008);
 c(x-rad*.34,y-rad*.35,rad*.27,'#e6fcff',.055);
}
function g423Ship(d,x,y,color='#65eaff',scale=1,dir=-1,s={elapsed:0},flame=true){
 const {p,c,l,ring}=d,half=.021*scale,up=.074*scale;
 p([[x,y-dir*up],[x-half*1.2,y+dir*up*.42],[x-half*.55,y+dir*up*.13],
    [x,y+dir*up*.54],[x+half*.55,y+dir*up*.13],[x+half*1.2,y+dir*up*.42]],'#162b51');
 p([[x,y-dir*up],[x-half*.72,y+dir*up*.24],[x,y+dir*up*.34],[x+half*.72,y+dir*up*.24]],color,.91);
 p([[x,y-dir*up*.61],[x-half*.21,y],[x,y+dir*up*.25],[x+half*.21,y]],'#d6f6ff',.86);
 c(x,y-.002,.019*scale,'#142242');c(x,y-.015*dir,.010*scale,'#f1fbff');
 for(const side of [-1,1]){
  l(x+side*half*.62,y+dir*up*.18,x+side*half*.9,y+dir*up*.35,'#b4d9ff',.012,.75);
  if(flame){const f=.035+Math.abs(Math.sin((s.elapsed||0)*13+side))*.025;
   l(x+side*half*.31,y+dir*up*.4,x+side*half*.31,y+dir*(up*.4+f),color,.02,.7);}
 }
}
function g423Invader(d,e,s){
 const {p,c,l,ring}=d,x=e.x,y=e.y,boss=e.boss,rad=boss?.052:.021;
 const wing=boss?.053:.026,flap=Math.sin((s.elapsed||0)*5+(e.osc||0))*.018;
 const tint=e.type===1?'#ff9b61':e.type===2?'#75edcf':e.type===3?'#ff82dd':'#e780fa';
 c(x,y,rad*2.7,'#ed4bff',.08);
 p([[x,y-rad*1.4],[x-wing,y-rad*.3],[x-wing*1.35,y+flap],[x-wing*.3,y+rad*.6],
    [x,y+rad*1.3],[x+wing*.3,y+rad*.6],[x+wing*1.35,y+flap],[x+wing,y-rad*.3]],
    boss?'#902d91':e.type===1?'#693a23':e.type===2?'#155c63':'#733683',.96);
 p([[x,y-rad],[x-wing*.52,y],[x,y+rad],[x+wing*.52,y]],boss?'#ffb2e5':tint,.92);
 c(x,y,.012*(boss?2:1),'#f7dcff');
 for(const side of [-1,1]){l(x+side*wing*.65,y+rad*.13,x+side*wing*1.18,y+rad*.95,'#d86eff',.012,.82);}
 if(e.type===2&&!boss){ring(x,y,rad*1.6,'#9affea',.44,.009);}
 if(e.type===1&&!boss){l(x-wing,y,x+wing,y,'#ffc587',.012,.74);}
 if(boss){ring(x,y,rad*2,'#ffa0dd',.65,.01);c(x,y,rad*1.65,'#d647dc',.07);}
}
function g423Tower(d,x,y,tower,s){
 const {p,r,c,l,ring}=d;
 r(x-.025,y-.039,.05,.073,'#162b4a');
 p([[x-.026,y+.026],[x-.018,y-.033],[x+.019,y-.033],[x+.029,y+.026]],tower.level>=3?'#ffc47d':'#59b4eb');
 c(x,y-.026,.025,tower.level>=3?'#ffb775':'#76e9ff',.54);
 r(x-.012,y-.08,.024,.053,'#bed3f2');c(x,y-.081,.011,'#ffffff');
 for(let k=0;k<tower.level;k++)l(x-.022+k*.016,y+.04,x-.016+k*.016,y+.04,'#fff2b4',.014,.9);
 if(tower.flash>0){ring(x,y-.048,.055,'#c9fffc',tower.flash*3,.016);l(x,y-.085,x+.045,y-.145,'#ffe8a0',.014,tower.flash*4);}
}
function g423Lane(d,s){const {r,l,ring}=d;
 r(.03,.30,.94,.55,'#15182c',.79);
 for(let i=0;i<9;i++){const x=i/8;l(.5,.37,.02+x*.96,.85,'#a86eff',.004,.4);}
 for(let i=0;i<6;i++)l(.05,.38+i*i*.018,.95,.38+i*i*.018,'#66baff',.003,.27);
 ring(.5,.52,.27,'#bb91ff',.16,.008);
}
function g423ArenaBackdrop(d,s,kind,audio){
 g423Sky(d,s,kind==='catcher'?'rhythm':kind==='bastion'?'defense':'space',audio);
 if(kind==='defenders')g423Planet(d,.865,.54,.21,s);
 else if(kind==='duel')g423Planet(d,.82,.66,.14,s,'#b9a1ff');
 else if(kind==='roll')g423Lane(d,s);
 else if(kind==='bastion'){
  const {r,l}=d;r(.025,.26,.95,.64,'#101832',.64);
  for(let i=0;i<3;i++){
   r(.03,.275+i*.235,.94,.18,i%2?'#243049':'#192740',.72);
   l(.03,.35+i*.235,.97,.35+i*.235,'#66baff',.006,.24);
  }
 }
}
const G423_AI_MODES={easy:.36,normal:.57,hard:.78,extreme:.96,adaptive:.66};
function g423AIDifficulty(s,I,dt,overriddenDifficulty,gameId=''){
 const setting=overriddenDifficulty||snapshot$1?.homeReactiveVisualizerArcadeDifficulty||'adaptive';
 const human=I.human1!==I.human2?(I.human1?0:1):-1;
 const role=human<0?'demo':`${gameId}:${human}`;
 if(!s.aiMemory||s.aiMemory.role!==role){
  s.aiMemory={role,elapsed:0,skill:.66,observation:null,reason:'collecting gameplay evidence'};
 }
 const mem=s.aiMemory;
 if(setting!=='adaptive'){
  s.aiSkill=G423_AI_MODES[setting]??.57;mem.reason='fixed difficulty';return s.aiSkill;
 }
 // Keep AI-versus-AI competitive and stable. Two-human matches do not try
 // to handicap either human using the other player's activity.
 if(human<0){mem.skill=.68;s.aiSkill=.68;mem.reason='exhibition / two human players';return s.aiSkill;}
 // These are *game-specific outcomes*, never stick movement or raw wave
 // progress. Friendly AI in cooperative defense gets stronger under threat.
 let success=0,fail=0,cooperative=false;
 if(gameId==='world_arcade_neon_chess'){
  success=Number(human===0?s.capturesW:s.capturesB)||0;
  fail=Number(human===0?s.capturesB:s.capturesW)||0;
 }else if(gameId==='world_arcade_beat_catcher'){
  success=Number(s[human?'score2':'score1'])||0;
  fail=Number(s.misses)||0;
 }else if(gameId==='world_arcade_orbit_defenders'){
  success=Number(s.kills)||0;
  fail=Math.max(0,15-(Number(s.base)||0));cooperative=true;
 }else if(gameId==='world_arcade_orbital_duel'){
  success=Number(s.ships?.[human]?.score)||0;
  fail=Number(s.ships?.[1-human]?.score)||0;
 }else if(gameId==='world_arcade_neon_strike_gallery'){
  success=Number(s.players?.[human]?.hits)||0;
  fail=Number(s.misses)||0;
 }else{
  success=Number(s.score)||0;
  fail=Number(s.misses)||0;
 }
 mem.elapsed+=Math.max(0,dt);
 if(mem.observation===null||success<mem.observation.success||fail<mem.observation.fail){
  mem.observation={success,fail};mem.elapsed=0;
 }
 if(mem.elapsed>=7){
  const successes=Math.max(0,success-mem.observation.success);
  const failures=Math.max(0,fail-mem.observation.fail);
  const rate=successes/Math.max(1,mem.elapsed);
  let target;
  if(cooperative){
   // Low base health means a friendly AI should HELP more, not become worse.
   const base=Number(s.base)||0;
   target=g421Clamp(.54+Math.max(0,10-base)*.029+Math.min(.11,failures*.035),.47,.86);
   mem.reason=base<7?'supporting threatened base':'cooperative base defense';
  }else if(gameId==='world_arcade_beat_catcher'){
   target=g421Clamp(.44+Math.min(.24,rate*.027)-Math.min(.18,failures*.033),.35,.80);
   mem.reason=failures>successes?'missed notes':'note-collection accuracy';
  }else if(gameId==='world_arcade_neon_strike_gallery'){
   target=g421Clamp(.45+Math.min(.24,rate*.14)-Math.min(.17,failures*.030),.35,.82);
   mem.reason='targets hit versus missed';
  }else{
   target=g421Clamp(.48+Math.min(.22,successes*.065)-Math.min(.17,failures*.055),.36,.82);
   mem.reason='rounds won versus lost';
  }
  // Player-selected adaptive character changes challenge, not game rules.
  const style=snapshot$1?.homeReactiveVisualizerArcadeAdaptiveStyle||'balanced';
  target=g421Clamp(target+(style==='relaxed'?-.065:style==='challenging'?.065:0),.30,.88);
  // Rate limit shifts, preventing sudden obvious misses or oscillation.
  mem.skill+=g421Clamp(target-mem.skill,-.075,.075);
  mem.observation={success,fail};mem.elapsed=0;
 }
 s.aiSkill=g421Clamp(mem.skill,.35,.86);
 return s.aiSkill;
}
function g423AIApproach(s,from,target,dt,base=.9){
 const skill=s.aiSkill??.57;const lag=.36+skill*1.45;
 const wobble=(1-skill)*Math.sin((s.elapsed||0)*1.8+target*9)*.065;
 return g421Clamp(from+(target+wobble-from)*Math.min(1,dt*base*lag),.045,.955);
}

// GTM 4.3.5: A second real controller-playable rhythm mode, independent
// of legacy Catcher. Generated note patterns are NOT claimed to be precisely
// aligned with external tracks. All scoring is based on timing or holds.
const G435_LANES=[.185,.395,.605,.815];
function g435RhythmInit(s){
 s.rhythm={notes:[],spawn:.38,elapsed:0,next:0,prevTrigger:[false,false],
   lanes:[1,2],hits:[0,0],miss:[0,0],combo:[0,0],accuracy:[0,0],
   labels:['READY','READY'],labelTime:[0,0],total:0};
 s.score1=0;s.score2=0;s.combo1=0;s.combo2=0;s.misses=0;s.collected=0;
}
function g435RhythmNote(s,options){
 const v=s.rhythm;if(v.notes.length>=18)return;
 const roll=g421Random(s);const kind=roll<.27?'hold':roll<.38?'gold':'tap';
 const lane=Math.floor(g421Random(s)*4);
 const speed=(.32+Math.min(.065,s.wave*.003))*(options.notePace||1);
 v.notes.push({lane,y:.235,vy:speed,kind,duration:kind==='hold'?.52+.28*g421Random(s):0,
   progress:[0,0],judged:[false,false],stage:[false,false]});v.total++;
}
function g435RhythmStep(s,dt,I,A,options={}){
 if(!s.rhythm)g435RhythmInit(s);
 const v=s.rhythm;s.elapsed+=dt;v.elapsed+=dt;
 s.wave=1+Math.floor(v.total/18);
 v.spawn-=dt;
 if(v.spawn<=0){g435RhythmNote(s,options);v.spawn=Math.max(.43,.90-s.wave*.015)/(options.notePace||1);}
 const line=.735,perfect=.024,good=.053,missBelow=.80;
 // Use normal right-stick horizontal position to select a lane. Neutral
 // retains selection; trigger is only consumed on its rising edge.
 for(let p=0;p<2;p++){
  const pad=p?I.p2:I.p1,human=p?I.human2:I.human1;
  const x=Number(pad?.x)||0;
  if(human&&Math.abs(x)>.20)v.lanes[p]=g421Clamp(Math.floor((x+1)*2),0,3);
  const trigger=human?(Number(pad?.rt)||0)>.52:false;
  const rising=trigger&&!v.prevTrigger[p];
  v.prevTrigger[p]=human&&trigger;
  const key=p?'score2':'score1';const comboKey=p?'combo2':'combo1';
  const aiSkill=g421Clamp(s.aiSkill??.68,.35,.86);
  let candidate=null;
  for(const n of v.notes){if(n.judged[p])continue;
   if(Math.abs(n.y-line)>.055)continue;
   if(!candidate||Math.abs(n.y-line)<Math.abs(candidate.y-line))candidate=n;}
  if(!human&&candidate){
   // A skill-based deterministic timing decision rather than a fabricated
   // player's RT input. Never change note positions or award phantom scores.
   v.lanes[p]=candidate.lane;
  }
  if(candidate&&!candidate.stage[p]){
   const aligned=v.lanes[p]===candidate.lane;
   const accurate=Math.abs(candidate.y-line);
   const aiAttempt=!human&&accurate<.018&&g421Random(s)<(.60+aiSkill*.43);
   if(aligned&&(human?rising:aiAttempt)){
    candidate.stage[p]=true;
    if(candidate.kind==='hold'){candidate.progress[p]=.00001;v.labels[p]='HOLD';}
    else{
     candidate.judged[p]=true;
     const grade=accurate<perfect?'PERFECT':accurate<good?'GREAT':'GOOD';
     v.labels[p]=grade;v.hits[p]++;v.combo[p]++;
     s[key]+=(grade==='PERFECT'?100:grade==='GREAT'?70:40)+Math.min(100,v.combo[p]*3);
    }
    v.labelTime[p]=.6;
   }
  }
  for(const n of v.notes){if(n.judged[p]||!n.stage[p]||n.kind!=='hold')continue;
   const aligned=v.lanes[p]===n.lane;
   const held=human?trigger:true;
   if(!aligned||!held){n.judged[p]=true;v.miss[p]++;v.combo[p]=0;v.labels[p]='HOLD BROKEN';v.labelTime[p]=.8;}
   else{
    n.progress[p]+=dt;
    if(n.progress[p]>=n.duration){n.judged[p]=true;v.hits[p]++;v.combo[p]++;
     s[key]+=180+Math.min(100,v.combo[p]*4);v.labels[p]='HOLD CLEAR';v.labelTime[p]=.8;}
   }
  }
  s[comboKey]=v.combo[p];
  v.labelTime[p]=Math.max(0,v.labelTime[p]-dt);
 }
 for(let i=v.notes.length-1;i>=0;i--){const n=v.notes[i];n.y+=n.vy*dt;
  if(n.y>missBelow){
   for(let p=0;p<2;p++)if(!n.judged[p]&&!n.stage[p]){n.judged[p]=true;v.miss[p]++;v.combo[p]=0;
     v.labels[p]='MISS';v.labelTime[p]=.55;}
  }
  if(n.judged[0]&&n.judged[1])v.notes.splice(i,1);
 }
 s.misses=v.miss[0]+v.miss[1];s.collected=v.hits[0]+v.hits[1];
 // Never depend on drawing to update accuracy or state.
 for(let p=0;p<2;p++)v.accuracy[p]=v.hits[p]/Math.max(1,v.hits[p]+v.miss[p]);
 if(s.misses>=80){const best=Math.max(s.best||0,s.score1,s.score2);g435RhythmInit(s);s.best=best;}
}
function g435RhythmDraw(s,d,I,A){
 const {c,r,l,t,ring}=d,v=s.rhythm;if(!v)return;
 g423ArenaBackdrop(d,s,'catcher',A);
 r(.06,.28,.88,.57,'#0a1330',.91);
 for(let k=0;k<4;k++){
  const x=G435_LANES[k];r(x-.091,.29,.18,.55,k%2?'#1b2a48':'#15213b',.65);
  l(x-.091,.29,x-.091,.835,'#9bb5ef',.003,.44);
  t(String(k+1),x,.32,'#dee8ff',.095,'center');
 }
 r(.08,.723,.84,.026,'#f0e6ff',.86);
 for(const n of v.notes){const x=G435_LANES[n.lane],isHold=n.kind==='hold';
  const noteY=isHold&&n.stage.some(Boolean)?Math.min(.735,n.y):n.y;
  if(isHold){r(x-.055,noteY-.13,.11,.13,'#3279d5',.82);r(x-.044,noteY-.118,.088,.108,'#8df1ff',.76);
   for(let p=0;p<2;p++)if(n.stage[p]&&!n.judged[p]){
    const progress=Math.min(1,n.progress[p]/Math.max(.01,n.duration));
    r(x-.052,noteY-.067+p*.023,.104*progress,.016,p?'#ffb4e2':'#fff095',.95);
   }}
  c(x,noteY,.038,n.kind==='gold'?'#ffe385':isHold?'#86eaff':'#ff9edb',.88);
  ring(x,noteY,.054,isHold?'#a4f7ff':'#ffcfef',.63,.008);
 }
 for(let p=0;p<2;p++){
  const x=G435_LANES[v.lanes[p]],tone=p?'#ff9ccf':'#62e8ff',y=p?.85:.815;
  r(x-.081,y-.015,.162,.028,tone,.91);
  if(v.labelTime[p]>0)t(`P${p+1} ${v.labels[p]}`,p?.76:.23,.26,tone,.094,'center');
 }
 g421Hud(d,'BEAT CATCHER • PIANO LANES',`P1 ${s.score1}`,`P2 ${s.score2}`,
  'RIGHT STICK X CHOOSE LANE • RT TAP / HOLD • BLUE = HOLD • Y JOIN');
 t(`COMBO  P1 ${v.combo[0]}   P2 ${v.combo[1]}  •  ACC ${Math.round(v.accuracy[0]*100)}% / ${Math.round(v.accuracy[1]*100)}%`,
   .5,.866,'#f5e3ff',.083,'center');
}
const GTM421_CATCHER={
 create(){return {...g421Base(),notes:[],spawn:0,score1:0,score2:0,combo1:0,combo2:0,misses:0,
  ships:[{x:.32},{x:.68}],collected:0,track:0,best:0};},
 step(s,dt,I,A,options={}){
  if(options.rhythmMode==='lanes'){
   if(s.activeRhythmMode!=='lanes'){g435RhythmInit(s);s.activeRhythmMode='lanes';}
   g435RhythmStep(s,dt,I,A,options);return;
  }
  if(s.activeRhythmMode==='lanes'){const best=s.best;Object.assign(s,this.create(),{best});s.activeRhythmMode='catcher';}
  if(s.over>0){s.over-=dt;if(s.over<=0){const best=Math.max(s.best,s.score1,s.score2);Object.assign(s,this.create(),{best});}return;}
  s.elapsed+=dt;s.wave=1+Math.floor(s.collected/12);
  for(let i=0;i<2;i++){
   g423UsePower(s,I,i,'magnet','rb',8,2.3,true);
   g423UsePower(s,I,i,'combo_guard','lb',12,4,true);
   g423UsePower(s,I,i,'score_surge','lt',14,4,true);
  }
  s.spawn-=dt;
  if(s.spawn<=0){s.spawn=(Math.max(.35,.95-s.wave*.018)+g421Random(s)*.24)/(options.notePace||1);
    if(s.notes.length<14){
      const roll=g421Random(s),type=roll<.15?'hold':roll<.26?'gold':(options.hazards!==0&&roll<.44)?'hazard':'normal';
      s.notes.push({x:.09+g421Random(s)*.82,y:.22,vy:(.18+Math.min(.13,s.wave*.008))*(options.notePace||1),glow:A.beat||0,
        type,duration:type==='hold'?.45:0,holdLeft:type==='hold'?.45:0,holder:-1});
    }}
  g421Controls(s,I,dt);
  if(!I.human1)s.ships[0].x=g423AIApproach(s,s.ships[0].x,this.aim(s,0),dt,3.4);
  if(!I.human2)s.ships[1].x=g423AIApproach(s,s.ships[1].x,this.aim(s,1),dt,3.1);
  for(let i=s.notes.length-1;i>=0;i--){const n=s.notes[i];n.y+=n.vy*dt;
   if(n.y<.815)continue;
   const range0=g423PowerActive(s,0,'magnet')?.195:.095;
   const range1=g423PowerActive(s,1,'magnet')?.195:.095;
   const winner=Math.abs(s.ships[0].x-n.x)<range0?0:Math.abs(s.ships[1].x-n.x)<range1?1:-1;
   if(n.type==='hold'){
     if(n.holder<0&&winner>=0)n.holder=winner;
     if(n.holder>=0){
       const holderNear=Math.abs(s.ships[n.holder].x-n.x)<(n.holder?range1:range0);
       if(!holderNear){
         if(!g423PowerActive(s,n.holder,'combo_guard'))s[n.holder?'combo2':'combo1']=0;
         s.misses++;s.collected++;s.notes.splice(i,1);continue;
       }
       n.y=.815;n.holdLeft=Math.max(0,n.holdLeft-dt);
       if(n.holdLeft>0)continue;
       const key=n.holder?'score2':'score1',combo=n.holder?'combo2':'combo1';
       s[combo]++;s[key]+=(60+Math.min(90,s[combo]*2))*(g423PowerActive(s,n.holder,'score_surge')?2:1);
       s.collected++;s.notes.splice(i,1);continue;
     }
   }
   if(winner>=0&&n.type!=='hold'){const key=winner?'score2':'score1',combo=winner?'combo2':'combo1';
     if(n.type==='hazard'){if(!g423PowerActive(s,winner,'combo_guard'))s[combo]=0;s[key]=Math.max(0,s[key]-20);}else{s[combo]++;s[key]+=((n.type==='gold'?35:10)+Math.min(90,s[combo]*2))*(g423PowerActive(s,winner,'score_surge')?2:1);}s.collected++;s.notes.splice(i,1);
   }else if(n.y>.9){
    if(!g423PowerActive(s,0,'combo_guard'))s.combo1=0;
    if(!g423PowerActive(s,1,'combo_guard'))s.combo2=0;
    if(!g423PowerActive(s,0,'combo_guard')&&!g423PowerActive(s,1,'combo_guard'))s.misses++;
    s.collected++;s.notes.splice(i,1);
   }
  }
  if(s.misses>=20)s.over=3.4;
 },
 aim(s,i){const candidates=s.notes.filter(n=>n.y<.85).sort((a,b)=>b.y-a.y);return candidates[0]?.x??(i?.68:.32);},
 draw(s,d,I,A,options={}){if(options.rhythmMode==='lanes'){g435RhythmDraw(s,d,I,A);return;}const {c,r,t,ring,l}=d;g423ArenaBackdrop(d,s,'catcher',A);
  for(let x=0;x<14;x++)r(x/13,.29,.003,.53,'#8388d1',.13);
  r(.025,.825,.95,.03,'#9b8ff6',.65);
  for(const n of s.notes){
    if(n.type==='hold'){
      const charged=n.holder>=0,progress=charged?1-n.holdLeft/Math.max(.01,n.duration):0;
      r(n.x-.022,n.y-.125,.044,.12,'#273a80',.9);
      r(n.x-.020,n.y-.123,.040,.12*(charged?progress:.65),'#94e9ff',charged?.85:.35);
      ring(n.x,n.y,.044,charged?'#ffe58a':'#8cdeff',.9,.011);
      c(n.x,n.y,.026,charged?'#ffe58a':'#80edff');
    }else{c(n.x,n.y,.08,'#f9baff',.08);ring(n.x,n.y,.047,'#ffa5ff',.6,.01);
      c(n.x,n.y,.027,n.type==='gold'?'#ffe264':n.type==='hazard'?'#ff5e91':n.glow>.35?'#fce3ff':'#ffd06e');
      l(n.x,n.y-.09,n.x,n.y-.04,'#ffdfff',.008,.32);}
  }
  for(let i=0;i<2;i++){const x=s.ships[i].x;
    r(x-.052,.80,.104,.054,i?'#ff8ab1':'#69e8fa');c(x,.79,.035,i?'#ff8ab1':'#69e8fa',.16);c(x,.79,.023,'#f3f6ff');if(g423PowerActive(s,i,'magnet'))ring(x,.80,.11,'#a6faff',.65,.01);if(g423PowerActive(s,i,'combo_guard'))ring(x,.80,.06,'#ffe7a1',.78,.01);if(g423PowerActive(s,i,'score_surge'))ring(x,.80,.095,'#ffdc79',.72,.008);}
  g421Hud(d,'BEAT CATCHER',`P1 ${s.score1}`,`P2 ${s.score2}  ·  WAVE ${s.wave}`,'RIGHT STICK MOVE  •  HOLD UNDER BLUE NOTES  •  GOLD BONUS  •  AVOID RED');
  g423PowerHud(d,s,'ABILITIES','ABILITIES','RB/LB');
  if(s.over>0)t('RUN COMPLETE • NEW ROUND SOON',.5,.53,'#fff0aa',.2,'center');
 }
};
// Cooperative space defense: unlimited generated waves, escalating enemies, periodic boss,
// upgrade milestones and optional accretion-hazard affecting flight paths.
const GTM421_DEFENDERS={
 create(){return {...g421Base(),ships:[{x:.27,y:.79,shield:0,cool:0},{x:.73,y:.79,shield:0,cool:0}],
   shots:[],enemies:[],spawn:0,remaining:16,kills:0,base:12,bosses:0,level:1,
   danger:0,breaktime:0,gravity:0,bonus:0};},
 step(s,dt,I,A,options){
  if(s.over>0){s.over-=dt;if(s.over<=0)Object.assign(s,this.create());return;}
  s.elapsed+=dt;if(s.elapsed<=dt+1e-5)s.base=Number(options.baseDurability)||12;
  s.bonus=Math.max(0,(s.bonus||0)-dt);const gravityLevel=options.blackhole??1;
  s.gravity=gravityLevel&&s.wave%5===0?gravityLevel:0;
  g421Controls(s,I,dt);
  for(let i=0;i<2;i++){const p=i?I.p2:I.p1,human=i?I.human2:I.human1,ship=s.ships[i];
    ship.cool=Math.max(0,ship.cool-dt);ship.shield=Math.max(0,ship.shield-dt);
    if(!human){const nearest=s.enemies.filter(e=>!e.dead).sort((a,b)=>Math.abs(a.x-ship.x)-Math.abs(b.x-ship.x))[0];
      if(nearest)ship.x=g423AIApproach(s,ship.x,nearest.x,dt,2.4);}
    if((human?Boolean(p.rb||p.rt):true)&&ship.cool<=0){
      ship.cool=Math.max(.1,.52-(s.aiSkill??.57)*.23-Math.min(.11,s.wave*.002));
      g421Fire(s,ship.x,ship.y-.065,0,-.82-i*.03,i,i?'#ffb7db':'#8cebff',1+Math.floor(s.wave/7));
    }
    if(g423UsePower(s,I,i,'burst','rb',6.5,.35,true)){
      for(const spread of [-.20,0,.20])g421Fire(s,ship.x,ship.y-.065,spread,-.99,i,i?'#ffb7db':'#8cebff',2+Math.floor(s.wave/8));
    }
    if(g423UsePower(s,I,i,'aegis','lb',9,3.3,true))ship.shield=3.3;
    if(g423UsePower(s,I,i,'seeker','lt',14,0,true)&&s.enemies.length){
      const target=s.enemies.slice().sort((a,b)=>(b.boss?20:0)+b.hp-(a.boss?20:0)-a.hp)[0];
      target.hp-=Math.max(3,2+Math.floor(s.wave/8));
      s.bonus=1.25;
    }
    if(g423UsePower(s,I,i,'gravity_pulse','xbtn',12,.4,true)){
      for(const enemy of s.enemies){if(g421Dist(enemy.x,enemy.y,ship.x,ship.y)<.42){enemy.hp-=4;enemy.y=Math.max(.23,enemy.y-.07);}}
    }
  }
  if(s.breaktime>0){s.breaktime=Math.max(0,s.breaktime-dt);}
  else{s.spawn-=dt;
    if(s.remaining>0&&s.spawn<=0&&s.enemies.length<28){
      const boss=s.wave%10===0&&s.remaining===1;
      s.enemies.push({x:.08+g421Random(s)*.84,y:.24,vx:(g421Random(s)-.5)*.13,
        hp:boss?10+Math.ceil(s.wave*.35):1+Math.floor(s.wave/5),boss,type:Math.floor(g421Random(s)*4),
        vy:(.037+Math.min(.12,s.wave*.0025))*(options.enemyPace||1),osc:g421Random(s)*6});
      s.remaining--;s.spawn=Math.max(.16,.48-s.wave*.01)/(options.enemyPace||1);
    }
  }
  g421StepShots(s,dt,s.gravity,.5,.43);
  for(let i=s.enemies.length-1;i>=0;i--){const e=s.enemies[i];
    e.y+=e.vy*dt;e.x=g421Clamp(e.x+(Math.sin(s.elapsed*1.9+e.osc)*.023+e.vx)*dt,.05,.95);
    if(e.hp<=0){s.score+=e.boss?250:10;s.kills++;if(e.boss)s.bosses++;s.enemies.splice(i,1);continue;}
    if(e.y>=.76){
      const intercepted=s.ships.some(ship=>ship.shield>0&&Math.abs(ship.x-e.x)<.14);
      if(intercepted){s.score+=5;}else{s.base=Math.max(0,s.base-(e.boss?3:1));}
      s.enemies.splice(i,1);continue;
    }
    for(let k=s.shots.length-1;k>=0;k--){const b=s.shots[k];
      if(g421Dist(e.x,e.y,b.x,b.y)>(e.boss?.075:.043))continue;
      e.hp-=b.damage;s.shots.splice(k,1);
      if(e.hp<=0){s.score+=e.boss?250:10;s.kills++;if(e.boss)s.bosses++;s.enemies.splice(i,1);break;}
    }
  }
  if(!s.remaining&&!s.enemies.length&&s.breaktime<=0){s.wave++;s.remaining=Math.min(44,12+Math.ceil(s.wave*1.2));s.breaktime=1.8;
    s.base=Math.min(15,s.base+(s.wave%3===0?1:0));}
  if(s.base<=0)s.over=4;
 },
 draw(s,d,I,A){const {c,r,l,t}=d;g423ArenaBackdrop(d,s,'defenders',A);
  if(s.gravity>0)g421BlackHole(d,s.elapsed,s.gravity,.5,.43);
  for(let i=0;i<2;i++){const p=s.ships[i];g423Ship(d,p.x,p.y,i?'#ff91c6':'#87e5ff',1,-1,s);if(p.shield>0){d.ring(p.x,p.y,.09,'#65ebfb',.8,.012);c(p.x,p.y,.09,'#65ebfb',.10);}}
  for(const b of s.shots){c(b.x,b.y,.025,b.color,.18);c(b.x,b.y,.011,b.color);l(b.x,b.y+.065,b.x,b.y+.02,b.color,.01,.44);}
  for(const e of s.enemies)g423Invader(d,e,s);
  g421Hud(d,'ORBIT DEFENDERS',`SCORE ${s.score}`,`WAVE ${s.wave}  ·  BASE ${s.base}`,
    s.gravity>0?'BLACK HOLE  •  RB BURST  •  LB AEGIS  •  X GRAVITY PULSE':'CO-OP  •  RB FIRE/BURST  •  LB AEGIS  •  X GRAVITY PULSE');
  g423PowerHud(d,s,'ABILITIES','ABILITIES','RB/LB/X');
  if(s.breaktime>0)t('WAVE '+s.wave+' • UPGRADES ONLINE',.5,.49,'#ffe5a6',.18,'center');
  if(s.over>0)t('BASE LOST • RESTARTING',.5,.55,'#ffd6c6',.2,'center');
 }
};
// Orbital Duel: 2D gravitational projectiles; shields, health, scoring and indefinite matches.
const GTM421_DUEL={
 create(){return {...g421Base(),ships:[{x:.19,y:.46,hp:5,score:0,cool:0,shield:0},{x:.81,y:.46,hp:5,score:0,cool:0,shield:0}],
  shots:[],round:1,bhX:.5,bhY:.48,flash:0,bases:[{hp:8,shield:0},{hp:8,shield:0}]};},
 step(s,dt,I,A,opts){
  s.elapsed+=dt;if(s.elapsed<=dt+1e-5)s.ships.forEach(ship=>ship.hp=opts.roundHealth||5);
  s.flash=Math.max(0,s.flash-dt);const grav=opts.blackhole??1;
  for(let i=0;i<2;i++){const p=i?I.p2:I.p1,human=i?I.human2:I.human1;
    const ship=s.ships[i],target=s.ships[1-i],base=s.bases[i];ship.cool=Math.max(0,ship.cool-dt);ship.shield=Math.max(0,ship.shield-dt);
    base.shield=Math.max(0,base.shield-dt);if(Math.abs(ship.x-(i?.87:.13))<.11&&Math.abs(ship.y-.60)<.18){ship.shield=Math.min(1.7,ship.shield+dt*.8);base.shield=Math.max(base.shield,.16);}
    if(human){ship.y=g421Clamp(ship.y+p.y*dt*.95,.27,.78);
      ship.x=g421Clamp(ship.x+p.x*dt*.55,i?.56:.06,i?.94:.44);
    }else{ship.y=g421Clamp(g423AIApproach(s,ship.y,target.y,dt,2.1),.27,.78);}
    if((human?Boolean(p.rb||p.rt):true)&&ship.cool<=0){
      ship.cool=human?.32:1.1-(s.aiSkill??.57)*.66;
      const dx=target.x-ship.x,dy=target.y-ship.y,len=Math.hypot(dx,dy)||1;
      const predicted=human?0:(s.aiSkill??.57)*.18;const aimY=dy+predicted*Math.sin(s.elapsed*3.1+i);
      const corrected=Math.hypot(dx,aimY)||1;g421Fire(s,ship.x,ship.y,dx/corrected*.65,aimY/corrected*.65,i,i?'#ffc6ef':'#94eaff');
    }
    if(g423UsePower(s,I,i,'plasma_volley','rb',6.8,.35,true)){
      const dir=i?-1:1;
      for(const spread of [-.19,0,.19])g421Fire(s,ship.x,ship.y,dir*.83,spread,i,i?'#ffdaec':'#a4faff',2);
    }
    if(g423UsePower(s,I,i,'aegis','lb',8,1.7,true))ship.shield=1.7;
    if(g423UsePower(s,I,i,'phase_shift','lt',14,1.1,true))ship.shield=Math.max(ship.shield,1.1);
    g423UsePower(s,I,i,'gravity_surge','xbtn',11,2.1,Boolean(grav));
  }
  const gravityBoost=Number(grav)>0&&s.arcadePowers?.some(p=>p?.gravity_surge?.active>0)?1.75:1;
  g421StepShots(s,dt,Number(grav)*gravityBoost,s.bhX,s.bhY);
  for(let k=s.shots.length-1;k>=0;k--){const b=s.shots[k],other=s.ships[1-b.owner];
    if(g421Dist(b.x,b.y,other.x,other.y)<.058){
       const targetBase=s.bases[1-b.owner];const covered=Math.abs(other.x-((1-b.owner)?.87:.13))<.12&&Math.abs(other.y-.60)<.18;
       if(other.shield<=0){other.hp-=covered&&targetBase.hp>0?.5:1;s.flash=.15;}s.shots.splice(k,1);
    }else{const targetBase=s.bases[1-b.owner];const baseX=(1-b.owner)?.87:.13;
      if(g421Dist(b.x,b.y,baseX,.60)<.075){targetBase.hp=Math.max(0,targetBase.hp-b.damage);s.shots.splice(k,1);s.flash=.13;}
    }
  }
  for(let i=0;i<2;i++)if(s.ships[i].hp<=0){const winner=s.ships[1-i];winner.score++;
   s.round++;s.ships.forEach((p,j)=>{p.hp=opts.roundHealth||5;p.x=j?.81:.19;p.y=.46;});s.bases=[{hp:8,shield:0},{hp:8,shield:0}];s.shots.length=0;s.flash=.5;break;}
 },
 draw(s,d,I,A,opts){const {c,l,r,t}=d;g423ArenaBackdrop(d,s,'duel',A);
  if((opts.blackhole??1)>0)g421BlackHole(d,s.elapsed,opts.blackhole??1,s.bhX,s.bhY);
  l(.5,.26,.5,.87,'#9f8bcc',.002,.16);
  for(let i=0;i<2;i++){const base=s.bases[i],bx=i?.87:.13,color=i?'#ff90d7':'#7bdfff';
    r(bx-.065,.565,.13,.06,'#1a3454');d.ring(bx,.60,.064,color,.64,.008);
    r(bx-.054,.641,.108,.018,'#15233b');r(bx-.054,.641,.108*base.hp/8,.018,color,.72);
    if(base.shield>0)d.ring(bx,.60,.092,color,.32,.007);
  }
  for(let i=0;i<2;i++){const p=s.ships[i];const color=i?'#ff90d7':'#7bdfff';
    g423Ship(d,p.x,p.y,color,1.15,i?1:-1,s);
    r(p.x-.055,p.y+.065,.11,.015,'#131930');r(p.x-.055,p.y+.065,.11*p.hp/5,.015,'#a5ffa9');
    if(p.shield>0){d.ring(p.x,p.y,.084,color,.82,.009);c(p.x,p.y,.078,color,.12);}
  }
  for(const b of s.shots){c(b.x,b.y,.027,b.color,.17);c(b.x,b.y,.014,b.color,.9);l(b.x-b.vx*.04,b.y-b.vy*.04,b.x,b.y,b.color,.01,.5);}
  g421Hud(d,'ORBITAL DUEL',`BLUE ${s.ships[0].score}`,`PINK ${s.ships[1].score} · ROUND ${s.round}`,
    (opts.blackhole??1)>0?'HOME BASES PROVIDE COVER  •  RB VOLLEY  •  LB SHIELD  •  X GRAVITY':'RB PLASMA VOLLEY  •  LB SHIELD  •  RT FIRE');
  g423PowerHud(d,s,'ABILITIES','ABILITIES','RB/LB/X');
  if(s.flash>0)c(.5,.45,.12,'#e6e2ff',s.flash*.28);
 }
};
// Neon Strike Gallery: original precision shooter. Unlike retired Neon Strike Gallery,
// there are two independent reticles and no shared turn/platform or projectile lane.
// Waves and target arrays have hard limits to protect the Deck's Canvas renderer.
const GTM421_STRIKE={
 create(){return {...g421Base(),targets:[],tracers:[],bursts:[],players:[{x:.30,y:.55,fire:0,held:false,score:0,combo:0,hits:0},{x:.70,y:.55,fire:0,held:false,score:0,combo:0,hits:0}],
  remaining:9,spawn:.25,intermission:0,wave:1,misses:0,bosses:0,high:0,timeout:0};},
 step(s,dt,I,A,options={}){
  if(s.over>0){s.over=Math.max(0,s.over-dt);if(s.over===0){const high=s.high;Object.assign(s,this.create(),{high});}return;}
  s.elapsed+=dt;s.timeout+=dt;const skill=s.aiSkill??.57;
  for(let i=0;i<2;i++){
   const pl=s.players[i],pad=i?I.p2:I.p1,human=i?I.human2:I.human1;
   pl.fire=Math.max(0,pl.fire-dt);
   g423UsePower(s,I,i,'focus','lb',10,2.5,true);
   g423UsePower(s,I,i,'piercing','xbtn',11,1.8,true);
   g423UsePower(s,I,i,'overdrive','lt',15,3.3,true);
   const nearest=s.targets.slice().sort((a,b)=>
    (b.boss?2:0)+(b.life<1?1:0)-(a.boss?2:0)-(a.life<1?1:0))[0];
   if(human){pl.x=g421Clamp(pl.x+(pad.x||0)*dt*1.55,.05,.95);pl.y=g421Clamp(pl.y+(pad.y||0)*dt*1.12,.32,.83);}
   else if(nearest){pl.x=g423AIApproach(s,pl.x,nearest.x,dt,2.2+skill*3);
    pl.y=g423AIApproach(s,pl.y,nearest.y,dt,2.1+skill*2.5);}
   const down=Boolean(pad.rb||pad.rt),shoot=human?(down&&!pl.held):true;
   pl.held=human&&down;
   const solo=I.mode==='solo';if((i===1&&solo)||!shoot||pl.fire>0)continue;
   pl.fire=human?.16:Math.max(.19,.79-skill*.43)+g421Random(s)*(.22-skill*.12);
   const pierce=g423PowerActive(s,i,'piercing');const boost=g423PowerActive(s,i,'overdrive');
   const radius=(g423PowerActive(s,i,'focus')?.085:.048)+(pierce?.03:0);
   let hit=0;
   for(let j=s.targets.length-1;j>=0;j--){const e=s.targets[j];
    const d=g421Dist(pl.x,pl.y,e.x,e.y);if(d>radius+(e.boss?.064:e.r*.65))continue;
    e.hp-=boost?3:pierce?2:1;hit++;
    if(e.hp<=0){const points=(e.boss?250:e.type===2?60:e.type===1?35:20)*(1+Math.floor(pl.combo/5))*(boost?2:1);
     pl.score+=points;pl.combo++;pl.hits++;s.score=pl.score+s.players[1-i].score;
     s.bursts.push({x:e.x,y:e.y,age:0,color:e.boss?'#ffc378':i?'#ff9fda':'#87efff'});s.targets.splice(j,1);
    }else{s.bursts.push({x:e.x,y:e.y,age:0,color:'#ffdb92'});}
    if(!pierce)break;
   }
   if(!hit){pl.combo=0;}s.tracers.push({x:pl.x,y:pl.y,age:0,color:i?'#ff91c9':'#89eaff',hit:!!hit});
  }
  for(const e of s.targets){const slowdown=s.arcadePowers?.some(p=>p?.focus?.active>0)?.5:1;
   e.x+=e.vx*dt*slowdown*(options.targetSpeed||1);e.y+=e.vy*dt*slowdown*(options.targetSpeed||1);
   if(e.x<.06||e.x>.94){e.x=g421Clamp(e.x,.06,.94);e.vx=-e.vx;}
   if(e.y<.30||e.y>.78){e.y=g421Clamp(e.y,.30,.78);e.vy=-e.vy;}
   e.life-=dt;if(e.life<=0){e.dead=true;s.misses++;for(const pl of s.players)pl.combo=0;}
  }
  s.targets=s.targets.filter(e=>!e.dead);
  s.tracers=s.tracers.filter(e=>(e.age+=dt)<.18).slice(-24);
  s.bursts=s.bursts.filter(e=>(e.age+=dt)<.55).slice(-26);
  if(s.intermission>0){s.intermission=Math.max(0,s.intermission-dt);}
  else if(s.remaining>0){s.spawn-=dt;if(s.spawn<=0&&s.targets.length<15){
    const boss=s.wave%7===0&&s.remaining===1,type=Math.floor(g421Random(s)*3),r=boss?.054:.021+.006*type;
    s.targets.push({x:.12+g421Random(s)*.76,y:.35+g421Random(s)*.35,vx:(g421Random(s)>.5?1:-1)*(.09+type*.045+Math.min(.06,s.wave*.002)),
     vy:(g421Random(s)-.5)*.12,life:boss?8:Math.max(2.2,7.2-s.wave*.045),hp:boss?5+Math.floor(s.wave/7):type===2?2:1,boss,type,r,phase:g421Random(s)*6});
    s.remaining--;s.spawn=Math.max(.18,.8-s.wave*.013)+(g421Random(s)*.20);
   }}
  if(!s.remaining&&!s.targets.length&&s.intermission<=0){s.wave++;s.remaining=Math.min(60,8+Math.ceil(s.wave*1.5));s.intermission=1.4;
   s.misses=Math.max(0,s.misses-1);}
  if(s.misses>=(options.missLimit||22)){s.high=Math.max(s.high,s.score);s.over=3.5;}
 },
 draw(s,d,I,A){const {r,c,l,t,p,ring}=d;g423Sky(d,s,'space',A);
  // Three parallax target bays, depth rails and a softly pulsing firing platform.
  r(.035,.285,.93,.56,'#0a1832',.62);
  for(let z=0;z<6;z++){const y=.31+z*.092;l(.04,y,.96,y,'#6597d8',.002,.20);
   l(.05+z*.036,.28,.08+z*.036,.84,'#7b80df',.002,.16);}
  for(let k=0;k<4;k++){const x=.09+k*.26;r(x,.315,.021,.46,'#335077',.17);
   ring(x+.01,.31,.024,'#6ad6fb',.33,.006);}
  for(const e of s.targets){const wobble=.5+.5*Math.sin(s.elapsed*5+e.phase);
   const rad=e.r*1.5,body=e.boss?'#ff7d96':e.type===2?'#ffbd69':e.type===1?'#c185ff':'#65ddef';
   c(e.x,e.y,rad*2.5,body,.055);ring(e.x,e.y,rad*1.25,body,.45+wobble*.22,.01);
   p([[e.x,e.y-rad],[e.x-rad*.85,e.y-rad*.35],[e.x-rad*.5,e.y+rad*.8],
      [e.x,e.y+rad*.48],[e.x+rad*.5,e.y+rad*.8],[e.x+rad*.85,e.y-rad*.35]],'#132c50');
   p([[e.x,e.y-rad*.85],[e.x-rad*.55,e.y],[e.x,e.y+rad*.35],[e.x+rad*.55,e.y]],body,.93);
   c(e.x,e.y,rad*.29,'#fff4e6',.94);
   for(const side of [-1,1])l(e.x+side*rad*.35,e.y,e.x+side*rad*.95,e.y+rad*.75,body,.009,.63);
   if(e.boss){ring(e.x,e.y,rad*1.85,'#ffcb87',.70,.012);t('ELITE',e.x,e.y-rad*2.1,'#fff2bd',.055,'center');}
  }
  for(const b of s.bursts){const a=1-b.age/.55;ring(b.x,b.y,.035+b.age*.13,b.color,a,.012);
   c(b.x,b.y,.045+b.age*.025,b.color,a*.14);}
  for(const shot of s.tracers){const a=1-shot.age/.18;l(shot.x,shot.y+.13,shot.x,shot.y,shot.color,.012,a);
   c(shot.x,shot.y,.018,shot.color,a);}
  for(let i=0;i<2;i++){if(I.mode==='solo'&&i===1)continue;
   const pl=s.players[i],tone=i?'#ffa2dd':'#75eaff';
   ring(pl.x,pl.y,.064,tone,.90,.012);ring(pl.x,pl.y,.029,tone,.56,.008);
   l(pl.x-.082,pl.y,pl.x-.034,pl.y,tone,.008,.75);l(pl.x+.034,pl.y,pl.x+.082,pl.y,tone,.008,.75);
   l(pl.x,pl.y-.078,pl.x,pl.y-.035,tone,.008,.7);l(pl.x,pl.y+.035,pl.x,pl.y+.078,tone,.008,.7);
   t('P'+(i+1),pl.x,pl.y+.101,tone,.076,'center');}
  const best=Math.max(s.high,s.score);g421Hud(d,'NEON STRIKE GALLERY',`P1 ${s.players[0].score}`,`P2 ${s.players[1].score} · WAVE ${s.wave}`,
   `RIGHT STICK AIM · RB FIRE · LB FOCUS · X PIERCE · LT OVERDRIVE · BEST ${best}`);
  g423PowerHud(d,s,'MARKSMAN','MARKSMAN','LB/X/LT');
  if(s.intermission>0)t(`WAVE ${s.wave} · TARGETS INCOMING`,.5,.51,'#ffe9ac',.15,'center');
  if(s.over>0)t('RUN COMPLETE · RESTARTING',.5,.52,'#ffe9ac',.18,'center');
 }
};
// GTM 4.2.5 Preview. Original top-down circuit racer, fixed-timestep bounded
// simulation: real acceleration/braking, lateral slip, hazards, laps and AI.
// Built directly into the trusted Arcade source and its shipped frontend (no dynamic eval).
const GTM425_RACING={
 create(){return {...g421Base(),race:1,heat:0,raceTime:0,transition:0,finishOrder:[],
  championships:[0,0],track:0,rounds:5,lapTarget:3,
  cars:[0,1].map(i=>({angle:-Math.PI/2-i*.36,lane:i?.37:-.37,vlane:0,speed:.30,boost:0,shield:0,
    laps:0,rank:0,finished:false,lapTime:0,best:0,score:0,sparks:0,thunder:0,ice:0,drift:0})),
  hazards:[],particles:[],banner:'',bannerTimer:0,lastWinner:-1};},
 geom(s){const layouts=[[.322,.260],[.340,.236],[.285,.272],[.342,.271],[.300,.242]];
  return layouts[s.track%layouts.length];},
 place(s,car){const [rx,ry]=this.geom(s),a=car.angle,offset=car.lane*.048;
  return {x:.5+Math.cos(a)*(rx+offset),y:.547+Math.sin(a)*(ry+offset*.78)};},
 step(s,dt,I,A,options={}){
  s.rounds=options.races||5;s.lapTarget=options.laps||3;
  s.elapsed+=dt;s.bannerTimer=Math.max(0,s.bannerTimer-dt);
  if(s.transition>0){s.transition=Math.max(0,s.transition-dt);if(s.transition===0){
   const prev=s.championships.slice(),heat=s.heat+1,track=(s.track+1)%5;
   const completed=heat>=s.rounds;
   Object.assign(s,this.create(),{heat:completed?0:heat,track,championships:completed?[0,0]:prev,
    race:completed?s.race+1:s.race,raceTime:0});
  }return;}
  s.raceTime+=dt;
  const racers=[I.p1,I.p2],humans=[I.human1,I.human2],skill=s.aiSkill??.66;
  for(let i=0;i<2;i++){
   const car=s.cars[i],pad=racers[i]||{},human=humans[i];
   const pos=this.place(s,car),op=s.cars[1-i],opp=this.place(s,op);
   const leader=(op.laps*2*Math.PI+op.angle)-(car.laps*2*Math.PI+car.angle);
   const aiSteer=g421Clamp(Math.sin(s.elapsed*.48+i*2.1)*.18+(leader>.15?.09:-.07),-1,1);
   const steer=human?g421Clamp(pad.x||0,-1,1):aiSteer;
   // Right-stick UP accelerates, DOWN brakes. AI throttle depends on corner and skill.
   const throttle=human?g421Clamp(-(pad.y||0),0,1):g421Clamp(.84+skill*.19-Math.abs(car.lane)*.04,0,1);
   const braking=human?g421Clamp(pad.y||0,0,1):0;
   const slippery=car.ice>0;
   const grip=(slippery?.32:1)*(car.drift>0?.57:1)*(options.grip||1);
   car.ice=Math.max(0,car.ice-dt);car.thunder=Math.max(0,car.thunder-dt);
   car.shield=Math.max(0,car.shield-dt);car.sparks=Math.max(0,car.sparks-dt);
   car.drift=Math.max(0,car.drift-dt);car.boost=Math.max(0,car.boost-dt);
   if(g423UsePower(s,I,i,'drift','rb',4.2,1.25,true))car.drift=1.25;
   if(g423UsePower(s,I,i,'nitro','rt',7.5,2.15,true))car.boost=2.15;
   if(g423UsePower(s,I,i,'cryo','lb',11,0,true)&&s.hazards.length<18){
    s.hazards.push({x:pos.x,y:pos.y,age:0,owner:i,r:.037,color:'#8fe9ff'});
   }
   if(g423UsePower(s,I,i,'lightning','xbtn',15,0,true)){
    if(g421Dist(pos.x,pos.y,opp.x,opp.y)<.49&&op.shield<=0){op.thunder=1.2;op.sparks=.6;}
   }
   if(g423UsePower(s,I,i,'aegis','lt',13,3,true))car.shield=3;
   const maxSpeed=(car.boost>0?1.23:.79)*(car.thunder>0?.55:1);
   car.speed=g421Clamp(car.speed+(throttle*.73-braking*1.45-.25-car.speed*.23)*dt,0,maxSpeed);
   const cornerPenalty=Math.abs(car.vlane)*(.07+car.speed*.13);
   car.speed=Math.max(0,car.speed-cornerPenalty*dt);
   car.vlane=g421Clamp(car.vlane+(steer*grip*2.2-car.vlane*(slippery?1.1:4.4))*dt,-.85,.85);
   car.lane+=car.vlane*dt;
   if(Math.abs(car.lane)>.98){car.lane=g421Clamp(car.lane,-.98,.98);car.vlane*=-.36;car.speed*=.993;car.sparks=.24;}
   const prior=car.angle;
   // Angular speed advances the vehicle around the actual oval; traversing
   // the inside radius has a minor advantage but a higher barrier risk.
   car.angle+=(car.speed*(.98-car.lane*.07))*dt;
   car.lapTime+=dt;
   if(Math.floor((prior+Math.PI/2)/(Math.PI*2))<Math.floor((car.angle+Math.PI/2)/(Math.PI*2))){
    car.laps++;car.best=car.best?Math.min(car.best,car.lapTime):car.lapTime;car.lapTime=0;
    if(car.laps>=s.lapTarget&&!car.finished){car.finished=true;s.finishOrder.push(i);car.score+=s.finishOrder.length===1?10:7;
     s.championships[i]+=s.finishOrder.length===1?10:7;s.banner=(i?'PINK':'CYAN')+' FINISHED';s.bannerTimer=2;}
   }
   if(car.finished)car.speed=Math.max(0,car.speed-1.4*dt);
  }
  // Collision checks use actual on-track positions, with cooldown and shields.
  const p0=this.place(s,s.cars[0]),p1=this.place(s,s.cars[1]);
  if(g421Dist(p0.x,p0.y,p1.x,p1.y)<.037&&s.cars.every(c=>!c.finished)){
   for(const car of s.cars){if(car.shield<=0){car.speed*=.985;car.sparks=.14;car.vlane*=-.35;}}
  }
  for(let h=s.hazards.length-1;h>=0;h--){const hazard=s.hazards[h];hazard.age+=dt;
   if(hazard.age>9){s.hazards.splice(h,1);continue;}
   const target=1-hazard.owner,car=s.cars[target],p=this.place(s,car);
   if(hazard.age>.6&&g421Dist(p.x,p.y,hazard.x,hazard.y)<hazard.r&&car.shield<=0){
    car.ice=2.2;car.sparks=.5;s.hazards.splice(h,1);
   }
  }
  if(s.finishOrder.length===2||s.raceTime>=145){
   // Prevent a stalled human from trapping a championship indefinitely.
   if(s.finishOrder.length===0){const winner=s.cars[0].laps>=s.cars[1].laps?0:1;
    s.finishOrder.push(winner);s.championships[winner]+=10;}
   s.lastWinner=s.finishOrder[0];s.banner=s.heat===s.rounds-1?'CHAMPIONSHIP COMPLETE':'CHECKERED FLAG';
   s.bannerTimer=4;s.transition=4;
  }
 },
 draw(s,d,I,A){const {r,c,l,t,p,ring}=d;
  g423Sky(d,s,'space',A);
  r(.02,.225,.96,.635,'#10192e',.82);
  const [rx,ry]=this.geom(s),segments=68;
  // Draw a genuine traversable ribbon, with inside and outside barrier edges.
  const outline=(radius,offset,color,width)=>{for(let i=0;i<segments;i++){
   const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;
   l(.5+Math.cos(a)*(rx+offset),.547+Math.sin(a)*(ry+offset*.78),
     .5+Math.cos(b)*(rx+offset),.547+Math.sin(b)*(ry+offset*.78),color,width,.8);
  }};
  for(let k=12;k>=-12;k-=2)outline(k,k*.0042,'#293348',.023);
  outline(0,.076,'#85caff',.006);outline(0,-.076,'#85caff',.006);
  outline(0,0,'#f2e5be',.003);
  // Dashed lane dividers and a finish line.
  for(let i=0;i<36;i+=2){let a=i*Math.PI/18,b=(i+.7)*Math.PI/18;
   l(.5+Math.cos(a)*rx,.547+Math.sin(a)*ry,.5+Math.cos(b)*rx,.547+Math.sin(b)*ry,'#e8f1ff',.004,.45);
  }
  for(let k=-5;k<=5;k++){const off=k*.008;
   l(.5+off,.547-ry-.07,.5+off,.547-ry+.07,k%2?'#0d1727':'#f3f5ff',.008,1);}
  for(const h of s.hazards){ring(h.x,h.y,h.r,'#b8f7ff',.65,.011);c(h.x,h.y,.024,'#8ddfff',.52);}
  for(let i=0;i<2;i++){const car=s.cars[i],where=this.place(s,car),tone=i?'#ff95d7':'#64eaff';
   const angle=car.angle+Math.PI/2,dx=Math.cos(angle),dy=Math.sin(angle);
   // Directional, distinct car bodies and obvious speed/ability feedback.
   p([[where.x+dx*.038,where.y+dy*.038],
      [where.x-dy*.024-dx*.02,where.y+dx*.024-dy*.02],
      [where.x-dx*.038,where.y-dy*.038],
      [where.x+dy*.024-dx*.02,where.y-dx*.024-dy*.02]],tone,.96);
   c(where.x+dx*.011,where.y+dy*.011,.013,'#f7fdff',.95);
   if(car.boost>0){l(where.x-dx*.028,where.y-dy*.028,where.x-dx*.07,where.y-dy*.07,'#ffb75e',.023,.83);}
   if(car.ice>0){ring(where.x,where.y,.045,'#a5ecff',.65,.008);}
   if(car.shield>0){ring(where.x,where.y,.057,'#ffe9aa',.85,.012);}
   if(car.sparks>0){ring(where.x,where.y,.045,'#ffd175',car.sparks*1.8,.009);}
   t('P'+(i+1),where.x,where.y-.073,tone,.072,'center');
  }
  const laps=s.cars.map(car=>Math.min(s.lapTarget,car.laps+1));
  g421Hud(d,'NEON DRIFT CIRCUIT',`P1 LAP ${laps[0]}/${s.lapTarget}`,`P2 LAP ${laps[1]}/${s.lapTarget} · RACE ${s.heat+1}/${s.rounds}`,
   `UP GAS · DOWN BRAKE · LEFT/RIGHT STEER · RB DRIFT · RT NITRO · LB ICE · X LIGHTNING · LT SHIELD`);
  g423PowerHud(d,s,'RACER','RACER','RB/RT/LB');
  t(`CHAMPIONSHIP  ${s.championships[0]} : ${s.championships[1]}`,.50,.256,'#fce2a6',.090,'center');
  if(s.bannerTimer>0)t(s.banner,.5,.44,'#fff1b4',.20,'center');
  if(s.transition>0)t(`NEXT CIRCUIT IN ${Math.ceil(s.transition)}`,.5,.51,'#e8f4ff',.14,'center');
 }
};

// GTM 4.4.0 beta: original offline 2D chess implementation.
// Board orientation: a8=0, h1=63; upper-case White, lower-case Black.
// No engine workers, network connections or third-party assets.
const G440_START='rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR';
const G440_VALUES={p:100,n:320,b:335,r:510,q:900,k:20000};
const G440_WHITE='KQRBNP',G440_BLACK='kqrbnp';
const G440_GLYPHS={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
function g440Side(p){return p==='.'?null:p===p.toUpperCase()?'w':'b';}
function g440Own(p,c){return p!=='.'&&g440Side(p)===c;}
function g440Index(r,f){return r*8+f;}
function g440On(r,f){return r>=0&&r<8&&f>=0&&f<8;}
function g440Enemy(color){return color==='w'?'b':'w';}
function g440Clone(s){return {board:s.board.slice(),turn:s.turn,castle:s.castle,ep:s.ep,half:s.half,full:s.full};}
function g440Attacked(s,at,by){
 const b=s.board,r=Math.floor(at/8),f=at%8;
 const pawn=by==='w'?'P':'p',pr=by==='w'?r+1:r-1;
 for(const df of [-1,1])if(g440On(pr,f+df)&&b[g440Index(pr,f+df)]===pawn)return true;
 const knight=by==='w'?'N':'n';
 for(const [dr,df] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
  if(g440On(r+dr,f+df)&&b[g440Index(r+dr,f+df)]===knight)return true;
 for(const [dr,df] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
  let y=r+dr,x=f+df,step=1;
  while(g440On(y,x)){
   const p=b[g440Index(y,x)];
   if(p!=='.'){
    if(g440Side(p)===by){const v=p.toLowerCase();
     if((dr===0||df===0)?(v==='r'||v==='q'):(v==='b'||v==='q'))return true;
     if(step===1&&v==='k')return true;}
    break;
   }
   y+=dr;x+=df;step++;
  }
 }
 return false;
}
function g440KingIndex(s,color){return s.board.indexOf(color==='w'?'K':'k');}
function g440InCheck(s,color){const king=g440KingIndex(s,color);return king<0||g440Attacked(s,king,g440Enemy(color));}
function g440Apply(s,m){
 const out=g440Clone(s),b=out.board,p=b[m.from],target=b[m.to],color=s.turn;
 b[m.from]='.';
 if(p.toLowerCase()==='p'&&m.to===s.ep&&target==='.')b[m.to+(color==='w'?8:-8)]='.';
 b[m.to]=m.promotion?(color==='w'?m.promotion.toUpperCase():m.promotion.toLowerCase()):p;
 if(p.toLowerCase()==='k'&&Math.abs(m.to-m.from)===2){
  const rookFrom=m.to>m.from?m.from+3:m.from-4,rookTo=m.to>m.from?m.from+1:m.from-1;
  b[rookTo]=b[rookFrom];b[rookFrom]='.';
 }
 let castle=out.castle;
 if(p==='K')castle=castle.replace(/[KQ]/g,'');
 if(p==='k')castle=castle.replace(/[kq]/g,'');
 for(const [letter,sq] of [['K',63],['Q',56],['k',7],['q',0]])
  if(m.from===sq||m.to===sq)castle=castle.replace(letter,'');
 out.castle=castle;out.ep=-1;
 if(p.toLowerCase()==='p'&&Math.abs(m.to-m.from)===16)out.ep=(m.from+m.to)/2;
 out.half=p.toLowerCase()==='p'||target!=='.'||(p.toLowerCase()==='p'&&m.to===s.ep)?0:s.half+1;
 if(color==='b')out.full++;
 out.turn=g440Enemy(color);
 return out;
}
function g440Pseudo(s,color){
 const out=[],b=s.board,add=(from,to,promotion)=>{if(!g440Own(b[to],color)&&b[to].toLowerCase()!=='k')
  out.push({from,to,...(promotion?{promotion}:{})});};
 for(let i=0;i<64;i++){
  const p=b[i];if(!g440Own(p,color))continue;
  const r=Math.floor(i/8),f=i%8,t=p.toLowerCase();
  if(t==='p'){
   const d=color==='w'?-1:1,start=color==='w'?6:1,promote=color==='w'?0:7;
   const push=(to)=>{if(Math.floor(to/8)===promote)
    for(const kind of ['q','r','b','n'])add(i,to,kind);else add(i,to);};
   if(g440On(r+d,f)&&b[g440Index(r+d,f)]==='.'){push(g440Index(r+d,f));
    if(r===start&&b[g440Index(r+2*d,f)]==='.')add(i,g440Index(r+2*d,f));}
   for(const df of [-1,1])if(g440On(r+d,f+df)){
    const to=g440Index(r+d,f+df);
    if((b[to]!=='.'&&g440Side(b[to])!==color&&b[to].toLowerCase()!=='k')||
       (to===s.ep&&b[to]==='.'&&b[to+(color==='w'?8:-8)]===(color==='w'?'p':'P')))push(to);
   }
   continue;
  }
  if(t==='n'){
   for(const [dr,df] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
    if(g440On(r+dr,f+df))add(i,g440Index(r+dr,f+df));continue;
  }
  const dirs=[];
  if(t==='k'||t==='q'||t==='r')dirs.push([1,0],[-1,0],[0,1],[0,-1]);
  if(t==='k'||t==='q'||t==='b')dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
  for(const [dr,df] of dirs){let nr=r+dr,nf=f+df;
   while(g440On(nr,nf)){
    const to=g440Index(nr,nf);if(g440Own(b[to],color))break;
    add(i,to);if(b[to]!=='.'||t==='k')break;
    nr+=dr;nf+=df;
   }
  }
  if(t==='k'&&!g440InCheck(s,color)){
   if(color==='w'&&i===60){
    if(s.castle.includes('K')&&b[61]==='.'&&b[62]==='.'&&b[63]==='R'&&!g440Attacked(s,61,'b')&&!g440Attacked(s,62,'b'))add(i,62);
    if(s.castle.includes('Q')&&b[59]==='.'&&b[58]==='.'&&b[57]==='.'&&b[56]==='R'&&!g440Attacked(s,59,'b')&&!g440Attacked(s,58,'b'))add(i,58);
   }
   if(color==='b'&&i===4){
    if(s.castle.includes('k')&&b[5]==='.'&&b[6]==='.'&&b[7]==='r'&&!g440Attacked(s,5,'w')&&!g440Attacked(s,6,'w'))add(i,6);
    if(s.castle.includes('q')&&b[3]==='.'&&b[2]==='.'&&b[1]==='.'&&b[0]==='r'&&!g440Attacked(s,3,'w')&&!g440Attacked(s,2,'w'))add(i,2);
   }
  }
 }
 return out;
}
function g440Legal(s){
 return g440Pseudo(s,s.turn).filter(m=>!g440InCheck(g440Apply(s,m),s.turn));
}
function g440Hash(s){return s.board.join('')+'|'+s.turn+'|'+s.castle+'|'+s.ep;}
function g440Insufficient(s){
 const non=s.board.filter(p=>p!=='.'&&p.toLowerCase()!=='k');
 if(!non.length)return true;
 if(non.length===1&&['n','b'].includes(non[0].toLowerCase()))return true;
 if(non.length===2&&non.every(p=>p.toLowerCase()==='b')){
  const squares=s.board.flatMap((p,i)=>p.toLowerCase()==='b'?[i]:[]);
  return squares.every(i=>(Math.floor(i/8)+i%8)%2===(Math.floor(squares[0]/8)+squares[0]%8)%2);
 }
 return false;
}
function g440Result(s){
 if(s.half>=100)return 'DRAW · 50-MOVE RULE';
 if((s.repetitions?.[g440Hash(s)]||0)>=3)return 'DRAW · THREEFOLD REPETITION';
 if(g440Insufficient(s))return 'DRAW · INSUFFICIENT MATERIAL';
 const moves=g440Legal(s);if(!moves.length)return g440InCheck(s,s.turn)?
   (s.turn==='w'?'BLACK WINS · CHECKMATE':'WHITE WINS · CHECKMATE'):'DRAW · STALEMATE';
 return '';
}
function g440Score(s){
 let score=0;
 for(let i=0;i<64;i++){
  const p=s.board[i];if(p==='.')continue;
  const color=g440Side(p),t=p.toLowerCase(),v=G440_VALUES[t],r=Math.floor(i/8),f=i%8;
  const center=3.5-(Math.abs(f-3.5)+Math.abs(r-3.5))*.5;
  score+=(color==='w'?1:-1)*(v+(t==='k'?0:center*(t==='p'?5:6)));
 }
 return score;
}
function g440Search(s,depth,alpha,beta,ctx){
 ctx.nodes++;if(ctx.nodes>=ctx.limit||Date.now()>=ctx.deadline)return g440Score(s);
 if(depth<=0)return g440Score(s);
 const moves=g440Legal(s);
 if(!moves.length)return g440InCheck(s,s.turn)?(s.turn==='w'?-35000:35000):0;
 const white=s.turn==='w';
 moves.sort((a,b)=>(G440_VALUES[s.board[b.to].toLowerCase()]||0)-(G440_VALUES[s.board[a.to].toLowerCase()]||0));
 let best=white?-Infinity:Infinity;
 for(const move of moves){const score=g440Search(g440Apply(s,move),depth-1,alpha,beta,ctx);
  best=white?Math.max(best,score):Math.min(best,score);
  if(white)alpha=Math.max(alpha,best);else beta=Math.min(beta,best);
  if(beta<=alpha||ctx.nodes>=ctx.limit)break;
 }
 return best;
}
function g440AiMove(s,skill=.65){
 const choices=g440Legal(s);if(!choices.length)return null;
 const ctx={nodes:0,limit:skill>=.8?550:skill>=.6?400:220,deadline:Date.now()+6};
 const depth=skill>=.52?2:1,white=s.turn==='w';
 // All candidates get a legal, deterministic fallback score; bounded tactical
 // lookahead is allowed only while its strict CPU/time budget remains.
 const scored=choices.map(move=>{const next=g440Apply(s,move);
  const score=depth>1&&ctx.nodes<ctx.limit&&Date.now()<ctx.deadline?
   g440Search(next,depth-1,-40000,40000,ctx):g440Score(next);return {move,score};});
 scored.sort((a,b)=>white?b.score-a.score:a.score-b.score);
 // Lower difficulty chooses a plausible alternative, never scripted checkmate or score manipulation.
 const tolerance=(1-skill)*95,plausible=scored.filter(x=>Math.abs(x.score-scored[0].score)<=tolerance);
 const t=(s.seed=(Math.imul(s.seed||1,1664525)+1013904223)|0)>>>0;
 return plausible[t%Math.max(1,Math.min(plausible.length,skill<.5?4:2))].move;
}
const GTM440_CHESS={
 create(){const base={board:G440_START.split(''),turn:'w',castle:'KQkq',ep:-1,half:0,full:1};
  return {...g421Base(),...base,repetitions:{[g440Hash(base)]:1},last:null,selected:[-1,-1],cursor:[52,12],promotion:['q','q'],cool:[0,0],lastRt:[false,false],lastLt:[false,false],lastLb:[false,false],lastRb:[false,false],clocks:[300,300],clockSetting:'none',result:'',banner:'',bannerTimer:0,played:0,capturesW:0,capturesB:0,aiWait:.8,resetAt:0};
 },
 step(s,dt,I,data,opts){
  s.elapsed+=dt;s.bannerTimer=Math.max(0,s.bannerTimer-dt);
  if(s.result){s.resetAt+=dt;if(!I.human1&&!I.human2&&s.resetAt>7){const next=this.create();Object.assign(s,next);}return;}
  const timer=opts.clock||'none';
  if(s.clockSetting!==timer){s.clockSetting=timer;s.clocks=timer==='blitz3'?[180,180]:timer==='blitz5'?[300,300]:[99999,99999];}
  const which=s.turn==='w'?0:1;
  if(timer!=='none'){s.clocks[which]=Math.max(0,s.clocks[which]-dt);if(s.clocks[which]===0){s.result=which===0?'BLACK WINS · TIME':'WHITE WINS · TIME';return;}}
  const humans=[I.human1,I.human2];
  // Player 1 always controls White; Player 2 joins Black. AI takes any unclaimed seat.
  for(let k=0;k<2;k++){
   const pad=k===0?I.p1:I.p2;
   s.cool[k]=Math.max(0,s.cool[k]-dt);
   if(humans[k]&&s.cool[k]===0){
    const dx=Math.abs(pad.x)>.55?Math.sign(pad.x):0,dy=Math.abs(pad.y)>.55?Math.sign(pad.y):0;
    if(dx||dy){const pos=s.cursor[k],rank=Math.floor(pos/8),file=pos%8;
     s.cursor[k]=g440Index(Math.max(0,Math.min(7,rank+dy)),Math.max(0,Math.min(7,file+dx)));
     s.cool[k]=.17;
    }
   }
   const rt=pad.rt>.5,lt=pad.lt>.5,lb=pad.lb>.5,rb=pad.rb>.5;
   if(humans[k]&&s.turn===(k===0?'w':'b')){
    if(lb&&!s.lastLb[k]||rb&&!s.lastRb[k]){
     const list=['q','r','b','n'],idx=list.indexOf(s.promotion[k]);
     s.promotion[k]=list[(idx+(rb?1:3))%4];s.banner='PROMOTION · '+({q:'QUEEN',r:'ROOK',b:'BISHOP',n:'KNIGHT'}[s.promotion[k]]);s.bannerTimer=1.5;
    }
    if(lt&&!s.lastLt[k])s.selected[k]=-1;
    if(rt&&!s.lastRt[k]){
     const at=s.cursor[k];
     if(s.selected[k]<0){if(g440Own(s.board[at],s.turn))s.selected[k]=at;}
     else if(g440Own(s.board[at],s.turn))s.selected[k]=at;
     else {
      const moves=g440Legal(s).filter(m=>m.from===s.selected[k]&&m.to===at);
      const move=moves.find(m=>m.promotion===s.promotion[k])||moves.find(m=>m.promotion==='q')||moves[0];
      if(move)this.applyMove(s,move);
      else {s.banner='ILLEGAL MOVE';s.bannerTimer=1.0;}
      s.selected[k]=-1;
     }
    }
   }
   s.lastRt[k]=rt;s.lastLt[k]=lt;s.lastLb[k]=lb;s.lastRb[k]=rb;
  }
  if(s.result)return;
  if(!humans[which]){
   s.aiWait-=dt;
   if(s.aiWait<=0){const move=g440AiMove(s,s.aiSkill??.67);if(move)this.applyMove(s,move);
    s.aiWait=Math.max(.8,Math.min(2.5,Number(opts.aiPace)||1.4));}
  }else s.aiWait=Math.max(s.aiWait,.45);
 },
 applyMove(s,m){
  const captured=s.board[m.to]!=='.'||(s.board[m.from].toLowerCase()==='p'&&m.to===s.ep);
  const oldSide=s.turn,updated=g440Apply(s,m);
  for(const key of ['board','turn','castle','ep','half','full'])s[key]=updated[key];
  if(captured){if(oldSide==='w')s.capturesW++;else s.capturesB++;}
  s.last=m;s.played++;s.aiWait=1.3;
  const hash=g440Hash(s);s.repetitions[hash]=(s.repetitions[hash]||0)+1;
  s.result=g440Result(s);
  if(!s.result&&g440InCheck(s,s.turn)){s.banner='CHECK!';s.bannerTimer=1.5;}
  if(m.promotion){s.banner='PAWN PROMOTED';s.bannerTimer=1.5;}
 },
 draw(s,d,I,data,opts){
  // GTM 4.4.1: Focused Chess is an upright board inside a taller, non-fullscreen
  // footer. Geometry derives from the REAL canvas height (never stretch squares).
  const {r,l,t}=d;
  r(0,0,1,1,'#050d1e');
  for(let i=0;i<20;i++)d.c((i*73%97)/100,(i*29%91)/100,.0018,'#82b8ff',.24);
  r(.012,.012,.976,.105,'#111e3a',.96);
  t('NEON CHESS CHAMPIONSHIP',.035,.062,'#f1f7ff',.074);
  // Square board fills most of the available HEIGHT. Information lives to its
  // right instead of taking a header/footer slice out of the chessboard.
  const boardPx=Math.min(d.h*.822,d.w*.57);
  const bw=boardPx/d.w,bh=boardPx/d.h;
  const x0=.035,y0=.139,tw=bw/8,th=bh/8;
  const sideX=Math.min(.78,x0+bw+.037),sideW=Math.max(.17,.977-sideX);
  const themes={hologram:['#405879','#a8c8d9','#050d1e','#ffe489'],wood:['#986b44','#e7c99f','#25170e','#d4ed86'],gothic:['#473645','#a4a0a4','#0d0710','#e9b4e2'],frozen:['#6296ba','#c2e4ef','#051b35','#ffe489'],observatory:['#294c77','#9aa9c5','#080d27','#e7d1a6']};
  const pal=themes[opts.boardTheme]||themes.hologram;
  // Outer border and board stay fully inside the non-fullscreen stage.
  r(x0-.005,y0-.008,bw+.010,bh+.016,'#d4e5ff',.65);
  for(let sq=0;sq<64;sq++){
   const row=Math.floor(sq/8),file=sq%8,x=x0+file*tw,y=y0+row*th,p=s.board[sq],white=g440Side(p)==='w';
   r(x,y,tw,th,(row+file)%2?pal[0]:pal[1],1);
   if(s.last&&(s.last.from===sq||s.last.to===sq))r(x,y,tw,th,pal[3],.36);
   if(g440Own(p,s.turn)&&g440InCheck(s,s.turn)&&p.toLowerCase()==='k')r(x,y,tw,th,'#ff4d59',.48);
   for(let k=0;k<2;k++)if((k===0?I.human1:I.human2)&&s.selected[k]===sq)
     r(x+.002,y+.002,tw-.004,th-.004,'#ffef9e',.36);
   for(let k=0;k<2;k++)if((k===0?I.human1:I.human2)&&s.cursor[k]===sq){
    l(x+.002,y+.002,x+tw-.002,y+.002,k===0?'#ffe27b':'#6cf2e8',.007);
    l(x+.002,y+th-.002,x+tw-.002,y+th-.002,k===0?'#ffe27b':'#6cf2e8',.007);
   }
   if(p!=='.'){
    const cx=x+tw*.5,cy=y+th*.5;
    d.c(cx,cy,th*.375,white?'#f2eee6':'#11253d',.96);
    t(G440_GLYPHS[p],cx,cy,white?'#14283f':'#f6e5a9',th*.72,'center');
   }
  }
  // Vertical status/control card does not overlap any chess square.
  r(sideX,.139,sideW,.823,'#101f38',.94);
  l(sideX+.012,.247,sideX+sideW-.012,.247,'#527daf',.004,.74);
  const status=s.result||((s.turn==='w'?'WHITE':'BLACK')+' TO MOVE'+(g440InCheck(s,s.turn)?' · CHECK':''));
  const mode=I.human1&&I.human2?'LOCAL TWO-PLAYER':I.human1||I.human2?'PLAYER VS AI':'AI EXHIBITION';
  t(mode,sideX+.022,.19,'#9cddf8',.057);
  t(status,sideX+.022,.308,s.result?'#ffd37b':'#e6f5ff',.094);
  t('MOVE '+s.full,sideX+.022,.409,'#a7c8ee',.066);
  if(opts.clock!=='none'){
   t('WHITE  '+Math.ceil(s.clocks[0])+'s',sideX+.022,.505,'#f0f4ff',.062);
   t('BLACK  '+Math.ceil(s.clocks[1])+'s',sideX+.022,.576,'#ffe2b2',.062);
  }else{
   t('WHITE  '+(I.human1?'PLAYER 1':'AI'),sideX+.022,.505,'#f0f4ff',.060);
   t('BLACK  '+(I.human2?'PLAYER 2':'AI'),sideX+.022,.576,'#ffe2b2',.060);
  }
  if(s.bannerTimer>0&&s.banner)t(s.banner,sideX+.022,.650,'#ffe7a1',.064);
  l(sideX+.012,.693,sideX+sideW-.012,.693,'#527daf',.004,.74);
  t('RIGHT STICK  ·  MOVE',sideX+.022,.755,'#cde8ff',.055);
  t('RT SELECT  ·  LT CANCEL',sideX+.022,.824,'#cde8ff',.055);
  t('LB / RB  ·  PROMOTION',sideX+.022,.902,'#a6cee8',.052);
 }
};

const GTM421_GAMES={
 world_arcade_neon_chess:GTM440_CHESS,
 world_arcade_beat_catcher:GTM421_CATCHER,
 world_arcade_orbital_duel:GTM421_DUEL,
 world_arcade_orbit_defenders:GTM421_DEFENDERS,
 world_arcade_neon_strike_gallery:GTM421_STRIKE
};
function gtm421DrawArcade(ctx,canvas,scene,mode,frame,data,w,h){
 const game=GTM421_GAMES[scene.id];if(!game)return false;
 let instances=GTM421_INSTANCE_POOLS.get(canvas);
 if(!instances){instances=new Map();GTM421_INSTANCE_POOLS.set(canvas,instances);}
 let inst=instances.get(mode);if(!inst){if(instances.size>=24)instances.delete(instances.keys().next().value);
   inst={state:game.create(),elapsed:0,accum:0,lastMode:'ai_ai'};instances.set(mode,inst);}
 const allowed=scene.interaction?.modes||['ai_ai'];
 const controls=gtm418ReadPlayers(snapshot$1,allowed,'program:'+mode);
 const I=g421Input(controls);
 if(scene.id==='world_arcade_neon_chess'){
  const reset=typeof window!=='undefined'?(window.__GTM440_CHESS_NEW_GAME__||0):0;
  if(inst.lastChessReset!==reset){inst.lastChessReset=reset;inst.state=game.create();inst.accum=0;}
 }
 if(controls.joinEpoch && inst.lastJoinEpoch!==controls.joinEpoch){
    if(scene.id!=='world_arcade_neon_chess'){inst.state=game.create();inst.accum=0;}
    inst.lastJoinEpoch=controls.joinEpoch;
 }
 const s=inst.state;
 if(inst.lastMode!==controls.requested){inst.lastMode=controls.requested;
    s.ready=scene.id==='world_arcade_neon_chess'||!(controls.human1||controls.human2);s.needInput=!s.ready;s.wait=.28;inst.accum=0;}
 if(s.needInput){s.wait=Math.max(0,s.wait-Math.min(.06,frame.physicsDt||frame.wallDt||0));
   const motion=[I.human1&&Math.hypot(I.p1.x,I.p1.y)>.55,
     I.human2&&Math.hypot(I.p2.x,I.p2.y)>.55];
   if(s.wait===0&&motion.some(Boolean)){s.needInput=false;s.ready=true;}}
 const opts={...((typeof gtm429ReadAll==='function')?gtm429ReadAll(scene.id):{}),
  blackhole:gtm418ProgramOptionValue(scene,(scene.options||[]).find(o=>o.id==='blackhole')||{id:'blackhole',choices:[{value:1}]})};
 const activeSetting=opts.difficulty||snapshot$1?.homeReactiveVisualizerArcadeDifficulty||'adaptive';
 s.abilityRecharge=opts.recharge||1;s.cinematic=opts.cinematic??2;
 // The game state survives a temporary switch to music visualizers. It does not
 // silently run in the background or consume the Deck's CPU off-screen.
 const elapsed=g421Clamp(frame.physicsDt??frame.wallDt??frame.dt??1/60,0,.25);
 g423AIDifficulty(s,I,elapsed,activeSetting,scene.id);
 if(!controls.paused&&!s.needInput){inst.accum=Math.min(.26,inst.accum+elapsed);
  let count=0;while(inst.accum>=1/60&&count++<15){game.step(s,1/60,I,data||{},opts);inst.accum-=1/60;}
 }else inst.accum=0;
 ctx.save();try{ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();const d=g421Graph(ctx,w,h);
  game.draw(s,d,I,data||{},opts);
  if(s.needInput){d.r(.28,.39,.44,.25,'#071022',.95);
    d.t('READY • CLOSE QUICK MENU',.5,.48,'#fff2b2',.17,'center');
    d.t('MOVE RIGHT STICK TO START',.5,.57,'#9fecff',.14,'center');}
  gtm418DrawSessionStatus(ctx,w,h,controls);
 }finally{ctx.restore();}
 frame.arcadeWave=s.wave||s.round||1;frame.arcadeScore=s.score||s.score1||0;
 return true;
}

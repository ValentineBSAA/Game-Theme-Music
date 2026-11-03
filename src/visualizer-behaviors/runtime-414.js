// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.
// New built-in scenes may register fixed-step update/render hooks here.
// Imported packs only select allowlisted effects; pack JSON is never eval'd.
const GTM413_BEHAVIORS = new Map();
const GTM413_EFFECTS = Object.freeze({
    fire:{label:'FIRE',rgb:'#ff9255',trail:'#ff3f17'},
    ice:{label:'ICE',rgb:'#8debff',trail:'#2bbfff'},
    lightning:{label:'LIGHTNING',rgb:'#fff9a2',trail:'#b68aff'},
    plasma:{label:'PLASMA',rgb:'#fc8fff',trail:'#a35dff'},
    comet:{label:'COMET',rgb:'#ecfaff',trail:'#67afff'},
    gravity:{label:'GRAVITY',rgb:'#a0f7ce',trail:'#4cf5a6'},
    mirror:{label:'MIRROR',rgb:'#e1c9ff',trail:'#a88cff'},
    pulse:{label:'PULSE',rgb:'#ffee8c',trail:'#ffae53'},
    shadow:{label:'SHADOW',rgb:'#eacfff',trail:'#9584f7'},
    rainbow:{label:'RAINBOW',rgb:'#ffffff',trail:'#5fffdf'},
    magnet:{label:'MAGNET',rgb:'#8cffe3',trail:'#42ccba'},
    vortex:{label:'VORTEX',rgb:'#d5c3ff',trail:'#775dff'},
    shield:{label:'SHIELD',rgb:'#94e2ff',trail:'#2e91fa'},
    giant:{label:'GIANT',rgb:'#a9ffad',trail:'#4bff72'},
    shrink:{label:'SHRINK',rgb:'#ffb5e5',trail:'#f35ca6'},
    warp:{label:'WARP',rgb:'#d9b3ff',trail:'#8368ff'},
    quake:{label:'QUAKE',rgb:'#fff2bd',trail:'#eab34e'},
    meteor:{label:'METEOR',rgb:'#ff9c7d',trail:'#ff5329'},
    storm:{label:'STORM',rgb:'#baf4ff',trail:'#59b7ff'},
    prism:{label:'PRISM',rgb:'#ffdcfb',trail:'#9ad3ff'}
});
const GTM413_POWER_NAMES=Object.keys(GTM413_EFFECTS);
function gtm413RegisterBehavior(effect, hooks){
    if(!/^[a-z][a-z0-9_]{2,48}$/.test(effect)||!hooks||typeof hooks.create!=='function'||
       typeof hooks.step!=='function'||typeof hooks.draw!=='function')return false;
    GTM413_BEHAVIORS.set(effect,Object.freeze(hooks));return true;
}
// Trusted arcade-game contract shared by Pong and future built-in games, such
// as Skee-Ball. Community ZIPs may only select explicitly allowlisted IDs;
// they cannot provide arbitrary JavaScript or register executable handlers.
const GTM417_ARCADE_GAMES=new Map();
function gtm417RegisterArcadeGame(effect,hooks,metadata={}){
    if(!gtm413RegisterBehavior(effect,hooks))return false;
    GTM417_ARCADE_GAMES.set(effect,Object.freeze({
        id:effect,title:String(metadata.title||effect).slice(0,64),
        lifecycle:'create/step/draw',simHz:90,renderPolicy:'bounded',
        scoring:String(metadata.scoring||'points'),version:1
    }));
    return true;
}
// Round and championship transitions are independent from render FPS and from
// arena scenery, and are reusable by games with different scoring rules.
function gtm417ArcadeDelay(settings,key,fallback,allowed){
    const raw=Number(settings?.[key]);
    return Number.isFinite(raw)&&allowed.includes(raw)?raw:fallback;
}
function gtm417ArcadeBeginTransition(state,kind,seconds){
    state.transitionKind=kind;
    state.gameOver=Math.max(.1,Math.min(20,seconds));
    state.resetCountdown=state.gameOver;
}
function gtm417ArcadeAdvanceTransition(state,dt,complete){
    if(state.gameOver<=0)return false;
    state.gameOver=Math.max(0,state.gameOver-Math.max(0,dt));
    state.resetCountdown=state.gameOver;
    if(state.gameOver<=.000001){state.gameOver=0;state.resetCountdown=0;complete();state.transitionKind='';}
    return true;
}
function gtm413RunBehavior(effect,frame,layerIndex,env){
    const handler=GTM413_BEHAVIORS.get(effect);if(!handler)return false;
    const stateMap=frame.behaviors||(frame.behaviors=Object.create(null));
    const key=effect+':'+layerIndex;
    let record=stateMap[key];
    const signature=typeof handler.signature==='function'?handler.signature(env):'';
    if(!record||record.signature!==signature){
        if(record&&typeof handler.dispose==='function')handler.dispose(record.state);
        record={state:handler.create(env),signature,accumulator:0,steps:0};stateMap[key]=record;
    }
    // 4.1.7: A visual render frame is NOT a physics tick. At 16 FPS the old
    // 4-step cap advanced only 0.044 seconds per 0.0625 wall seconds; at 5 FPS
    // it advanced just 0.044 seconds per 0.2 wall seconds (22% real speed).
    // Pong now catches up small frame stalls with bounded 90Hz substeps.
    // A genuinely long suspend gap (>400ms) is discarded, not simulated.
    const pong=effect==='neon_pong';
    const arcade=pong?gtm418ReadPlayers(env.settings,['ai_ai','player_ai','player_player'],'neon_pong'):null;
    if(pong)env.arcade=arcade; // one controller snapshot per render, never per physics substep
    // 4.3.2: claiming a controller must never erase the live Pong rally,
    // scores, active morphs or ball velocity. The old full recreation caused
    // a fresh 0.68s serve delay every time someone interrupted AI-vs-AI.
    if(pong&&arcade?.joinEpoch&&record.joinEpoch!==arcade.joinEpoch){
        record.joinEpoch=arcade.joinEpoch;
        // Controller edges are rearmed on the *actual* AI-to-human transition
        // below, preventing held shoulder buttons from firing phantom abilities.
    }
    if(pong){
        const s=record.state;
        for(const side of ['left','right']){
            const human=Boolean(arcade?.[side]?.human);
            const prior=record['human_'+side];
            if(prior!==undefined&&prior!==human){
                s['think'+(side==='left'?'Left':'Right')]=0;
                const c=arcade[side];
                s['inputs_'+side]=human?((c.rb?1:0)|(c.lb?2:0)|(c.xbtn?4:0)|(c.ybtn?8:0)):0;
            }
            record['human_'+side]=human;
        }
    }
    // The shared Arcade controller bridge handles the same 15-second human
    // ready countdown for Pong and every other built-in or imported game.
    // AI vs AI continues without a ready delay.
    if(arcade?.paused){record.accumulator=0;record.steps=0;frame.pongPhysicsSteps=0;frame.pongPhysicsLagMs=0;
        frame.pongPhase=arcade.manualPaused?'INTENTIONALLY PAUSED':arcade.readyWaiting?'READY':arcade.countdown?'CONTROLLER RECOVERY':'READY COUNTDOWN';
        handler.draw(record.state,env);gtm418DrawSessionStatus(env.ctx,env.w,env.h,arcade);return true;}
    // 4.3.1: keep normal 30Hz draw / 90Hz physics smooth, but do not
    // simulate a huge stalled render frame in one expensive burst.
    const rawDt=pong?Number(frame.physicsDt??frame.wallDt??frame.dt??0):Number(frame.dt||0);
    const elapsed=pong?(Number.isFinite(rawDt)&&rawDt<=.4?Math.max(0,Math.min(.25,rawDt)):0):
        Math.min(.045,Math.max(0,Number.isFinite(rawDt)?rawDt:0));
    // Normal frames need at most 12 ticks. At genuine 5-8fps, allow up
    // to 24 to retain real-time ball physics instead of making it slow-motion.
    const step=1/90,limit=pong?(rawDt>.12?24:12):4;
    if(pong){frame.pongDroppedSuspendGap=false;}
    if(pong&&rawDt>.4){record.accumulator=0;frame.pongDroppedSuspendGap=true;}
    record.accumulator=Math.min(pong?.27:.052,record.accumulator+elapsed);
    record.steps=0;
    while(record.accumulator>=step&&record.steps<limit){
        handler.step(record.state,step,env);
        record.accumulator-=step;record.steps++;
    }
    if(pong){
        // This is measured simulation drift, not a fake correction to the HUD.
        record.physicsLag=record.accumulator;
        frame.pongPhysicsSteps=record.steps;
        frame.pongPhysicsLagMs=Math.round(record.accumulator*1000);
        const s=record.state;
        frame.pongPhase=s.goalHold>0?'GOAL CELEBRATION':s.gameOver>0?'MATCH TRANSITION':
            s.serve>0?'SERVING':'PLAYING';
        frame.pongBallRecoveryCount=s.ballRecoveries||0;
    }
    handler.draw(record.state,env);
    if(arcade)gtm418DrawSessionStatus(env.ctx,env.w,env.h,arcade);
    return true;
}
function gtm413PongRandom(s){
    let seed=s.seed|0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    s.seed=seed|0;return (seed>>>0)/4294967296;
}
// Shared championship state resumes after Shuffle All returns to ANY Pong scene.
// It deliberately pauses the simulation while Pong is off-screen, to avoid
// running invisible physics or stealing CPU from other visualizers.
const GTM414_PONG_POOL=new Map();
const GTM414_PONG_PALETTES=Object.freeze({
    red_blue:['#ff995e','#68caff'],purple_pink:['#a67dff','#ff82c4'],
    magenta_cyan:['#f45bce','#59eeff'],green_orange:['#64ed8b','#ffad54'],
    yellow_violet:['#f8e66b','#a583fa'],cherry_gold:['#e65776','#ffd777'],
    white_ice:['#f2f9ff','#5abef5'],lava_plasma:['#ff763f','#617bff'],
    rose_emerald:['#ff91b9','#45d69b'],ultraviolet_lime:['#914dff','#b8f95f']
});
// GTM 4.2.8: reusable, bounded Arcade ability descriptors. Packs use their own
// validated JSON state programs; executable game hooks remain trusted built-ins.
const GTM428_PONG_MORPHS=Object.freeze({
  fortress:Object.freeze({slot:'defense',duration:3,cooldown:20,label:'FORTRESS'}),
  magnet:Object.freeze({slot:'defense',duration:2.4,cooldown:16,label:'MAGNET'}),
  gravity:Object.freeze({slot:'defense',duration:2.4,cooldown:18,label:'GRAVITY'}),
  mirror:Object.freeze({slot:'attack',duration:2.0,cooldown:15,label:'MIRROR'}),
  thunder:Object.freeze({slot:'attack',duration:2.1,cooldown:12,label:'THUNDER'}),
  cryo:Object.freeze({slot:'attack',duration:2.2,cooldown:14,label:'CRYO'}),
  inferno:Object.freeze({slot:'attack',duration:2.1,cooldown:13,label:'INFERNO'})
});
function gtm428PongMorph(s,side,slot,chosen,human=false){
  const type=GTM428_PONG_MORPHS[chosen]&&GTM428_PONG_MORPHS[chosen].slot===slot?chosen:
    slot==='defense'?'fortress':'thunder';
  const cap=side==='left'?'Left':'Right';
  const morph=GTM428_PONG_MORPHS[type],active='morph'+cap,remaining='morphTime'+cap;
  const cool='morphCd'+(slot==='defense'?'Defense':'Attack')+cap;
  if(s[remaining]>0||s[cool]>0){
    if(human){
      s.abilityMessage=s[remaining]>0?'MORPH ALREADY ACTIVE':
        `${morph.label} RECHARGING ${Math.ceil(s[cool])}s`;
      s.abilityMessageTime=1.15;
    }
    return false; // transformations cannot stack
  }
  s[active]=type;s[remaining]=morph.duration;s[cool]=morph.cooldown;
  s.abilityMessage=side.toUpperCase()+' '+morph.label+' MORPH';s.abilityMessageTime=1.25;
  s.bursts.push({x:side==='left'?.12:.88,y:s[side],age:0,kind:type==='fortress'?'shield':type});
  s.powersUsed++;return true;
}
function gtm428PongIsMorph(s,side,type){const cap=side==='left'?'Left':'Right';return s['morphTime'+cap]>0&&s['morph'+cap]===type;}
function gtm428PongMindBall(s,dt,cfg={}){
  const b=s.ball;
  // Mindball changes only bounded Y velocity inside midfield. No teleports,
  // forced goals, horizontal acceleration, or steering after the goal approach.
  if(b.x<.26||b.x>.74||s.goalLane){s.mindActive=false;s.mindCue=Math.max(0,(s.mindCue||0)-dt*7);return;}
  const personality=['curious','hunter','trickster','survivor','adaptive'].includes(cfg.homeReactiveVisualizerPongMindballPersonality)
    ?cfg.homeReactiveVisualizerPongMindballPersonality:'adaptive';
  const strength=['subtle','standard','strong'].includes(cfg.homeReactiveVisualizerPongMindballStrength)
    ?cfg.homeReactiveVisualizerPongMindballStrength:'standard';
  const turnRate=strength==='subtle'?.075:strength==='strong'?.18:.13;
  const toRight=b.vx>=0,opponent=toRight?s.right:s.left;
  const distance=toRight?.868-b.x:b.x-.132;
  const timeToPaddle=Math.max(.01,distance/Math.max(.10,Math.abs(b.vx)));
  // Track the destination of the *current* trajectory and the receiver's
  // location, not a random target; both are normalized court coordinates.
  const crossing=gtm413PongPredict(b.y,b.vx,b.vy,distance);
  const gap=opponent-crossing;
  const direction=gap>=0?-1:1;
  const rally=Math.min(1,(s.hitCount||0)/9);
  const opponentMotion=(toRight?s.right:s.left)-(s.mindLastOpponent??opponent);
  s.mindLastOpponent=opponent;
  const coverage=Math.min(1,Math.abs(gap)/.22);
  const recent=Number(s.mindAccuracy)||0;
  const style=cfg.homeReactiveVisualizerPongMindballAwareness||'strategic';
  // Strategy makes a *fair tactical decision*, not a difficulty handicap:
  // if the opponent is already out of reach, do not amplify a likely winner.
  const planning=style==='gentle'?.6:style==='dynamic'?1.16:1;
  const budget=(.13+.11*(1-coverage)+.05*rally)*planning;
  const random=()=>gtm413PongRandom(s);
  s.mindTimer=Math.max(0,(s.mindTimer||0)-dt);
  if(s.mindTimer<=0){
    const dice=random();
    if(personality==='curious')s.mindTarget=(dice-.5)*.36;
    else if(personality==='survivor')s.mindTarget=Math.max(-.31,Math.min(.31,(.53-crossing)*.62));
    else if(personality==='trickster')s.mindTarget=direction*(dice>.55?-.18:.23);
    else if(personality==='hunter')s.mindTarget=direction*(.18+.09*(1-coverage));
    else {
      // Adaptive: compare projected crossing with the receiver, account for
      // its latest movement, rally maturity and limited steering opportunity.
      // Avoid steering harder when the opponent is already badly beaten.
      const pursuit=Math.max(.03,Math.min(.30,(Math.abs(gap)+Math.abs(opponentMotion)*2)*.74));
      const shaped=direction*(coverage>.85?.07:pursuit+budget*.18);
      s.mindTarget=Math.max(-.30,Math.min(.30,shaped+(recent*.012)));
      s.mindPlan=coverage>.85?'conserve':rally>.65?'rally pressure':'read paddle';
    }
    // Replanning faster than every few physics steps causes visible jitter.
    s.mindTimer=Math.max(.19,Math.min(.48,timeToPaddle*.28));
  }
  const difference=s.mindTarget-b.vy;
  const maxTurn=turnRate*dt;
  const change=Math.max(-maxTurn,Math.min(maxTurn,difference));
  b.vy=Math.max(-.48,Math.min(.48,b.vy+change));
  s.mindActive=Math.abs(change)>0.00001;
  s.mindCue=s.mindActive?Math.min(1,(s.mindCue||0)+dt*5):Math.max(0,(s.mindCue||0)-dt*7);
  if(!Number.isFinite(b.vy)){b.vy=0;s.mindActive=false;}
}
function gtm414PongSignature(env){const cfg=env.settings||{};
    return [cfg.homeReactiveVisualizerPongMode||'power',cfg.homeReactiveVisualizerPongDifficulty||'adaptive',
        cfg.homeReactiveVisualizerPongDefenseMorph||'fortress',cfg.homeReactiveVisualizerPongAttackMorph||'thunder',
        cfg.homeReactiveVisualizerPongGoal||7,cfg.homeReactiveVisualizerPongSeries||'5'].join('|');}
function gtm414PongPickColors(s,cfg){
    const palette=cfg.homeReactiveVisualizerPongTeamPalette||'red_blue';
    if(palette==='custom')return [cfg.homeReactiveVisualizerPongLeftColor||'#ff995e',cfg.homeReactiveVisualizerPongRightColor||'#68caff'];
    if(palette==='random'){
        if(s.colorMatch!==s.match||!s.colors){
            const names=Object.keys(GTM414_PONG_PALETTES);
            s.colors=GTM414_PONG_PALETTES[names[Math.floor(gtm413PongRandom(s)*names.length)]].slice();s.colorMatch=s.match;
        }
        return s.colors;
    }
    return GTM414_PONG_PALETTES[palette]||GTM414_PONG_PALETTES.red_blue;
}
function gtm414PongRecord(s){return {match:s.match,winner:s.winner,
    left:s.scoreLeft,right:s.scoreRight,duration:Math.round(s.matchElapsed),powers:s.powersUsed};}
function gtm414PongHistory(){const s=GTM414_PONG_POOL.get('championship');
    return s?{match:s.match,winsLeft:s.winsLeft,winsRight:s.winsRight,series:s.series,champion:s.champion,
        history:s.history.slice(),previous:s.previousChampionship||null,gameOver:s.gameOver,
        seconds:Math.round(s.matchElapsed),reset:s.resetCountdown}:null;
}
function gtm413PongCreate(env){
    const signature=gtm414PongSignature(env),prior=GTM414_PONG_POOL.get('championship');
    if(prior&&prior.signature===signature)return prior;
    const seed=0x5137cafe;
    const state={seed,signature,ball:{x:.5,y:.54,vx:.37,vy:.16},left:.52,right:.52,
        targetLeft:.52,targetRight:.52,thinkLeft:0,thinkRight:0,
        scoreLeft:0,scoreRight:0,winsLeft:0,winsRight:0,rally:0,series:env.settings?.homeReactiveVisualizerPongSeries||'5',
        serve:.68,gameOver:0,winner:'',champion:'',lastPoint:'',flash:0,match:1,matchElapsed:0,resetCountdown:0,
        history:[],previousChampionship:null,powersUsed:0,colorMatch:0,colors:null,
        cooldown:1.5,cooldownLeft:0,cooldownRight:0,shieldCooldownLeft:0,shieldCooldownRight:0,abilityMessage:'',abilityMessageTime:0,goalLane:'',goalHold:0,goalAt:'',goalPulse:0,goalCelebration:null,power:null,powerTime:0,freezeLeft:0,freezeRight:0,confuseLeft:0,confuseRight:0,
        shieldLeft:0,shieldRight:0,powerShotLeft:0,powerShotRight:0,giantLeft:0,giantRight:0,shrinkLeft:0,shrinkRight:0,
        trails:[],bursts:[],lastPower:'',simTime:0,hitCount:0,aiErrors:0,
        morphLeft:null,morphRight:null,morphTimeLeft:0,morphTimeRight:0,
        morphCdDefenseLeft:0,morphCdDefenseRight:0,morphCdAttackLeft:0,morphCdAttackRight:0,
        mindTimer:0,mindTarget:0,mindCue:0,mindActive:false,stuckBallSeconds:0,ballRecoveries:0};
    GTM414_PONG_POOL.set('championship',state);return state;
}
function gtm413PongPredict(y,vx,vy,dist){
    const span=.85-.22;if(Math.abs(vx)<.001)return y;
    const future=y+vy*Math.abs(dist/vx),period=span*2;
    let offset=((future-.22)%period+period)%period;
    return .22+(offset>span?period-offset:offset);
}
function gtm413PongServe(state,toward=1){
    const angle=(gtm413PongRandom(state)-.5)*.40;
    const pace=state.ballSpeed==='relaxed'?.79:state.ballSpeed==='extreme'?1.19:1;
    state.ball={x:.5,y:.50+(gtm413PongRandom(state)-.5)*.14,vx:toward*(.35+gtm413PongRandom(state)*.055)*pace,vy:angle*pace};
    state.serve=.78;state.stuckBallSeconds=0;state.trails.length=0;state.power=null;state.powerTime=0;
}
function gtm413PongScore(s,side,limit,cfg={}){
    if(side==='left')s.scoreLeft++;else s.scoreRight++;
    s.lastPoint=side;s.flash=.8;s.rally=0;s.cooldown=1.2;s.goalAt='';s.goalLane='';s.goalPulse=.9;
    const leftWon=s.scoreLeft>=limit,rightWon=s.scoreRight>=limit;
    if(leftWon||rightWon){
        s.winner=leftWon?'left':'right';if(leftWon)s.winsLeft++;else s.winsRight++;
        s.history.push(gtm414PongRecord(s));if(s.history.length>32)s.history.shift();
        const bestOf=Number(s.series),toWin=s.series==='endless'?Infinity:Math.ceil(bestOf/2);
        s.champion=s.winsLeft>=toWin?'left':s.winsRight>=toWin?'right':'';
        const isChampion=Boolean(s.champion);
        const pause=isChampion?
            gtm417ArcadeDelay(cfg,'homeReactiveVisualizerPongChampionPauseSec',3,[1,2,3,5,10]):
            gtm417ArcadeDelay(cfg,'homeReactiveVisualizerPongRoundPauseSec',1.5,[.5,1,1.5,2,3,5]);
        gtm417ArcadeBeginTransition(s,isChampion?'championship':'round',pause);
    }else gtm413PongServe(s,side==='left'?1:-1);
}
function gtm413PongActivate(s,env){
    const keys=GTM413_POWER_NAMES;
    const offset=Math.floor(gtm413PongRandom(s)*keys.length);
    const index=(offset+(s.lastPower===keys[offset]?1:0))%keys.length;
    const type=keys[index];s.lastPower=type;
    s.power=type;s.powerTime=1.65;s.cooldown=3.4+gtm413PongRandom(s)*1.5;s.powersUsed++;
    if(type==='fire'||type==='comet')s.ball.vx*=1.16;
    if(type==='ice'){
        if(s.ball.vx>0)s.freezeRight=1.35;else s.freezeLeft=1.35;
        s.ball.vx*=.92;
    }
    if(type==='lightning')s.ball.vx*=1.23;
    if(type==='plasma')s.ball.vy+=.065*(gtm413PongRandom(s)>.5?1:-1);
    if(type==='gravity')s.ball.vy*=.75;
    if(type==='pulse'){
        s.ball.vx*=1.09;
        s.ball.vy+=.075*(gtm413PongRandom(s)>.5?1:-1);
    }
    if(type==='mirror')s.ball.vy=-s.ball.vy;
    if(type==='shield'){if(s.ball.vx>0)s.shieldRight=2.6;else s.shieldLeft=2.6;}
    if(type==='giant'){if(s.ball.vx>0)s.giantRight=2.9;else s.giantLeft=2.9;}
    if(type==='shrink'){if(s.ball.vx>0)s.shrinkRight=2.7;else s.shrinkLeft=2.7;}
    if(type==='warp')s.ball.y=Math.max(.3,Math.min(.76,s.ball.y+(gtm413PongRandom(s)-.5)*.24));
    if(type==='quake')s.ball.vy+=(gtm413PongRandom(s)-.5)*.26;
    if(type==='meteor')s.ball.vx*=1.23;
    if(type==='storm')s.ball.vy+=(gtm413PongRandom(s)-.5)*.18;
    if(type==='prism')s.ball.vy*=1.17;
    if(type==='shadow'){
        if(s.ball.vx>0)s.confuseRight=1.45;else s.confuseLeft=1.45;
    }
    s.ball.vx=Math.max(-.78,Math.min(.78,s.ball.vx));
    s.bursts.push({x:s.ball.x,y:s.ball.y,age:0,kind:type});
}
// 4.3.0: adaptive is based on the HUMAN'S points against the AI, not
// arbitrary paddle movement or whether the game has been running awhile.
// AI demonstrations use a separate competitive profile. All modes retain
// identical ball and scoring physics: only the AI's perception/reaction changes.
function gtm430PongAdaptiveBrain(s,dt,session){
    const leftHuman=Boolean(session?.left?.human),rightHuman=Boolean(session?.right?.human);
    const solo=leftHuman!==rightHuman;
    const role=solo?(leftHuman?'left':'right'):'demo';
    let mem=s.adaptiveOpponent;
    if(!mem||mem.role!==role){
        mem={role,skill:solo?.49:.70,target:solo?.49:.70,
            left:s.scoreLeft,right:s.scoreRight,observed:0,humanPoints:0,aiPoints:0};
        s.adaptiveOpponent=mem;
    }
    if(solo){
        const humanSide=leftHuman?'left':'right';
        const aiSide=leftHuman?'right':'left';
        const humanPoints=s['score'+(humanSide==='left'?'Left':'Right')];
        const aiPoints=s['score'+(aiSide==='left'?'Left':'Right')];
        const priorHuman=mem[humanSide],priorAi=mem[aiSide];
        const won=Math.max(0,humanPoints-priorHuman);
        const lost=Math.max(0,aiPoints-priorAi);
        // Reset anchors after a round score reset; do not count resets as losses.
        if(humanPoints<priorHuman||aiPoints<priorAi){
            mem.humanPoints=0;mem.aiPoints=0;
        }else if(won||lost){
            mem.humanPoints+=won;mem.aiPoints+=lost;
            mem.observed=Math.min(10,mem.observed+won+lost);
        }
        mem[humanSide]=humanPoints;mem[aiSide]=aiPoints;
        // The more the player struggles, the more forgiving the AI becomes.
        // A strong player gradually faces better prediction and reaction time.
        const advantage=Math.max(-5,Math.min(5,humanPoints-aiPoints));
        const recent=(mem.humanPoints-mem.aiPoints)/Math.max(1,mem.humanPoints+mem.aiPoints);
        const aiStyle=['relaxed','balanced','challenging'].includes(session?.adaptiveStyle)?session.adaptiveStyle:'balanced';
        const bias=aiStyle==='relaxed' ? -.085 : aiStyle==='challenging' ? .080 : 0;
        mem.target=Math.max(.20,Math.min(.81,.46+advantage*.052+recent*.115+bias));
        if(lost>0){ // Respond within a rally or two; avoid a slow 10-second lag.
            mem.skill=Math.max(mem.target,mem.skill-Math.min(.13,.045*lost+.015));
        }else if(won>0){mem.skill=Math.min(mem.target,mem.skill+.026*won);}
        mem.skill+=(mem.target-mem.skill)*Math.min(1,Math.max(0,dt)*.34);
    }else{
        mem.target=.70;
        mem.skill+=(mem.target-mem.skill)*Math.min(1,Math.max(0,dt)*.3);
    }
    mem.skill=Math.max(.19,Math.min(.82,mem.skill));
    s.adaptiveSkill=mem.skill;
    // Reaction delay, prediction error and movement speed ALL scale; even
    // a losing human should see a meaningfully easier opponent.
    return {speed:.22+mem.skill*.58,noise:.52-mem.skill*.43,tick:.51-mem.skill*.37};
}
function gtm413PongStep(s,dt,env){
    const cfg=env.settings||{},mode=cfg.homeReactiveVisualizerPongMode||'power';
    const morphEnabled=mode==='morph'||mode==='chaos';
    const mindEnabled=mode==='mindball'||mode==='chaos'||
      (['morph','power','competitive'].includes(mode)&&cfg.homeReactiveVisualizerPongMindballModifier===true);
    s.ballSpeed=cfg.homeReactiveVisualizerPongBallSpeed||'competitive';
    const difficulty=cfg.homeReactiveVisualizerPongDifficulty||'adaptive';
    const limit=Math.max(3,Math.min(11,Number(cfg.homeReactiveVisualizerPongGoal)||7));
    s.simTime+=dt;s.flash=Math.max(0,s.flash-dt);
    s.abilityMessageTime=Math.max(0,(s.abilityMessageTime||0)-dt);
    s.cooldownLeft=Math.max(0,(s.cooldownLeft||0)-dt);
    s.cooldownRight=Math.max(0,(s.cooldownRight||0)-dt);
    s.shieldCooldownLeft=Math.max(0,(s.shieldCooldownLeft||0)-dt);
    s.shieldCooldownRight=Math.max(0,(s.shieldCooldownRight||0)-dt);
    for(const side of ['Left','Right']){
        s['morphTime'+side]=Math.max(0,(s['morphTime'+side]||0)-dt);
        for(const slot of ['Defense','Attack']){const key='morphCd'+slot+side;s[key]=Math.max(0,(s[key]||0)-dt);}
    }
    s.goalPulse=Math.max(0,(s.goalPulse||0)-dt);s.hyperBallTimer=Math.max(0,(s.hyperBallTimer||0)-dt);
    // Finite goal celebration: runs even while gameplay is momentarily frozen.
    // Rendering may adapt particle counts, but cannot affect physics or scoring.
    if(s.goalCelebration){
        s.goalCelebration.age+=dt;
        if(s.goalCelebration.age>=s.goalCelebration.duration)s.goalCelebration=null;
    }
    // Freeze the ball locally at the REAR goal line, then award the point.
    // Keep score clock frozen during this cinematic pause; no white-screen flash.
    if(s.goalHold>0){s.stuckBallSeconds=0;s.goalHold=Math.max(0,s.goalHold-dt);
        if(s.goalHold<=.000001){const side=s.goalAt;s.goalHold=0;if(side)gtm413PongScore(s,side,limit,cfg);}
        return;}

    if(!s.gameOver)s.matchElapsed+=dt;
    s.cooldown=Math.max(0,s.cooldown-dt);
    s.freezeLeft=Math.max(0,s.freezeLeft-dt);s.freezeRight=Math.max(0,s.freezeRight-dt);
    s.confuseLeft=Math.max(0,s.confuseLeft-dt);s.confuseRight=Math.max(0,s.confuseRight-dt);
    for(const key of ['shieldLeft','shieldRight','powerShotLeft','powerShotRight','giantLeft','giantRight','shrinkLeft','shrinkRight'])s[key]=Math.max(0,s[key]-dt);
    s.bursts=s.bursts.filter(b=>(b.age+=dt)<.55).slice(-8);
    s.powerTime=Math.max(0,s.powerTime-dt);if(!s.powerTime)s.power=null;
    if(gtm417ArcadeAdvanceTransition(s,dt,()=>{
        {
            if(s.champion){
                s.previousChampionship={winner:s.champion,left:s.winsLeft,right:s.winsRight,
                    history:s.history.slice(),at:s.simTime};
                s.history=[];s.winsLeft=s.winsRight=0;s.match=1;s.champion='';
            }else s.match++;
            s.scoreLeft=s.scoreRight=0;s.winner='';s.matchElapsed=0;s.powersUsed=0;
            s.colorMatch=0;s.shieldLeft=s.shieldRight=s.giantLeft=s.giantRight=s.shrinkLeft=s.shrinkRight=0;
            gtm413PongServe(s,s.lastPoint==='left'?-1:1);
        }
    }))return;
    if(s.serve>0){s.stuckBallSeconds=0;s.serve=Math.max(0,s.serve-dt);return;}
    // An invalid ball state is not a point: recover to a safe serve.
    // Never treat a legitimate goal/serve/match hold as an unexpected stall.
    const candidate=s.ball;
    if(!candidate||![candidate.x,candidate.y,candidate.vx,candidate.vy].every(Number.isFinite)){
        s.ballRecoveries=(s.ballRecoveries||0)+1;
        gtm413PongServe(s,1);
        s.abilityMessage='BALL RECOVERED · NEW SERVE';s.abilityMessageTime=1.5;return;
    }
    const b=s.ball;
    const controls=env.arcade||gtm418ReadPlayers(cfg,['ai_ai','player_ai','player_player'],'neon_pong');
    const adaptiveBrain=difficulty==='adaptive'?gtm430PongAdaptiveBrain(s,dt,{...controls,adaptiveStyle:cfg.homeReactiveVisualizerArcadeAdaptiveStyle||'balanced'}):null;
    const brain=difficulty==='adaptive'?adaptiveBrain:difficulty==='expert'?{speed:.79,noise:.15,tick:.19}:
         difficulty==='hard'?{speed:.73,noise:.15,tick:.22}:difficulty==='casual'?{speed:.51,noise:.26,tick:.32}:
         {speed:.65,noise:.18,tick:.24};
    function moveAI(side){
        const left=side==='left';const paddle=left?'left':'right',tick=left?'thinkLeft':'thinkRight',target=left?'targetLeft':'targetRight';
        s[tick]-=dt;
        const toward=left?b.vx<0:b.vx>0;
        if(s[tick]<=0){
            s[tick]=brain.tick*(.85+gtm413PongRandom(s)*.46);
            const estimate=toward?gtm413PongPredict(b.y,b.vx,b.vy,Math.abs((left?.125:.875)-b.x)):.51;
            const disoriented=(left?s.confuseLeft:s.confuseRight)>0;
            const error=(gtm413PongRandom(s)*2-1)*brain.noise*(1+s.rally*.011)*(disoriented?1.65:1);
            s[target]=Math.max(.32,Math.min(.77,estimate+error));
        }
        const debuff=(left?s.freezeLeft:s.freezeRight)>0?.49:1;
        const maxStep=brain.speed*debuff*dt;
        s[paddle]=Math.max(.32,Math.min(.77,s[paddle]+Math.max(-maxStep,Math.min(maxStep,s[target]-s[paddle]))));
    }
    for(const side of ['left','right']){
        const control=controls[side];
        if(!control.human){
            s['inputs_'+side]=0;moveAI(side);
            // AI understands shield timing and shot preparation. One decision per
            // approaching rally prevents repetitive/cooldown-spamming actions.
            const incoming=side==='left'?b.vx<0:b.vx>0;
            const distance=Math.abs(b.x-(side==='left'?.132:.868));
            const skill=difficulty==='expert'?.96:difficulty==='hard'?.80:difficulty==='adaptive'?s.adaptiveSkill:difficulty==='casual'?.39:.66;
            const shieldKey=side==='left'?'shieldLeft':'shieldRight';
            const shieldTimer=side==='left'?'shieldCooldownLeft':'shieldCooldownRight';
            const shotKey=side==='left'?'powerShotLeft':'powerShotRight';
            const shotTimer=side==='left'?'cooldownLeft':'cooldownRight';
            if(mode==='power'&&incoming&&!s.goalLane){
                const projected=gtm413PongPredict(b.y,b.vx,b.vy,distance);
                const tough=Math.abs(projected-s[side])>.067;
                if(distance<.22&&distance>.028&&s[shieldTimer]<=0&&s[shieldKey]<=0&&
                    (tough||skill>.8)&&gtm413PongRandom(s)<.007+skill*.010){
                    s[shieldKey]=2.2;s[shieldTimer]=4.3;s.abilityMessage=(side==='left'?'LEFT':'RIGHT')+' AI SHIELD';s.abilityMessageTime=.8;
                }
                if(distance<.29&&distance>.08&&s[shotTimer]<=0&&s[shotKey]<=0&&
                    gtm413PongRandom(s)<.004+skill*.010){s[shotKey]=2.4;s[shotTimer]=4;
                    s.abilityMessage=(side==='left'?'LEFT':'RIGHT')+' AI POWER SHOT';s.abilityMessageTime=.8;}
            }
            if(morphEnabled&&incoming&&distance<.22&&distance>.035&&s['morphTime'+(side==='left'?'Left':'Right')]<=0){
                const projected=gtm413PongPredict(b.y,b.vx,b.vy,distance);
                const threatened=Math.abs(projected-s[side])>.075;
                if(threatened&&gtm413PongRandom(s)<dt*(.5+skill))
                    gtm428PongMorph(s,side,'defense',cfg.homeReactiveVisualizerPongDefenseMorph||'fortress');
                else if(distance<.16&&gtm413PongRandom(s)<dt*(.35+skill))
                    gtm428PongMorph(s,side,'attack',cfg.homeReactiveVisualizerPongAttackMorph||'thunder');
            }
            continue;
        }
        const debuff=(side==='left'?s.freezeLeft:s.freezeRight)>0?.49:1;
        const precision=control.lt>.25?.55:1,boost=control.rt>.25?1.3:1;
        const humanSpeed=cfg.homeReactiveVisualizerPongHumanSpeed==='turbo'?2.6:cfg.homeReactiveVisualizerPongHumanSpeed==='comfortable'?1.25:1.92;
        s[side]=Math.max(.32,Math.min(.77,s[side]+control.y*dt*humanSpeed*debuff*precision*boost));
        // Each button's rising edge fires at most once. A/Cross remains Quick Menu only.
        const bits=(control.rb?1:0)|(control.lb?2:0)|(control.xbtn?4:0)|(control.ybtn?8:0);
        const previous=s['inputs_'+side]||0;
        const rising=bits&~previous;
        s['inputs_'+side]=bits;
        const personal=side==='left'?'cooldownLeft':'cooldownRight';
        if(mode==='power'&&(rising&1)){
            const incoming=side==='left'?b.vx<0:b.vx>0;
            if(!incoming||s.goalLane){
                // Never modify a ball which already left this player's paddle.
                s.abilityMessage='TOO LATE · ARM BEFORE CONTACT';s.abilityMessageTime=.8;
            }else if(s[personal]<=0){
                s[personal]=4;
                const armed=side==='left'?'powerShotLeft':'powerShotRight';s[armed]=2.7;
                s.abilityMessage=(side==='left'?'LEFT':'RIGHT')+' POWER SHOT ARMED';s.abilityMessageTime=1.2;
            }else{s.abilityMessage='POWER RECHARGING';s.abilityMessageTime=.75;}
        }
        if(mode==='power'&&(rising&8)&&s.cooldown<=0){gtm413PongActivate(s,env);}
        if(morphEnabled&&(rising&2))gtm428PongMorph(s,side,'defense',cfg.homeReactiveVisualizerPongDefenseMorph||'fortress',true);
        if(morphEnabled&&(rising&1))gtm428PongMorph(s,side,'attack',cfg.homeReactiveVisualizerPongAttackMorph||'thunder',true);
        const shieldCooldown=side==='left'?'shieldCooldownLeft':'shieldCooldownRight';
        if(mode==='power'&&(rising&2)&&s[shieldCooldown]<=0){
            const shield=side==='left'?'shieldLeft':'shieldRight';
            s[shield]=2.4;s[shieldCooldown]=3;s.power='shield';s.powerTime=1.4;s.abilityMessage='SHIELD ACTIVATED';s.abilityMessageTime=1.2;
        }
        if(rising&4){s[side]=Math.max(.32,Math.min(.77,s[side]+Math.max(-.14,Math.min(.14,s.ball.y-s[side]))));}
        // Physical A is reserved for the Quick Menu. Powers are automated or menu-triggered.
    }

    // A/Confirm activates only an actual Quick Menu button; not the physical gamepad A button.
    for(const n of [1,2]){if(!gtm418ConsumeMenuAction(n,'neon_pong'))continue;
        const left=(n===1)===(cfg.homeReactiveVisualizerArcadePlayerSide!=='right'),key=left?'cooldownLeft':'cooldownRight';
        if(mode==='power'&&s[key]<=0){gtm413PongActivate(s,env);s[key]=4;
            s.abilityMessage='PLAYER '+n+' POWER ACTIVATED';s.abilityMessageTime=1.25;}
        else {s.abilityMessage=mode!=='power'?'POWER BATTLE REQUIRED':'POWER RECHARGING';s.abilityMessageTime=1.1;}
    }
    s.mindActive=false;
    if(mindEnabled)gtm428PongMindBall(s,dt,cfg);
    if(morphEnabled){
        // Energy fields alter trajectories with bounded force near each paddle.
        for(const side of ['left','right']){
            const close=Math.abs(b.x-(side==='left'?.132:.868))<.24;
            if(!close)continue;
            if(gtm428PongIsMorph(s,side,'gravity'))b.vy+=(s[side]-b.y)*.45*dt;
            if(gtm428PongIsMorph(s,side,'magnet'))b.vy+=(s[side]-b.y)*.68*dt;
        }
    }
    // Physical acceleration is bounded. Both opponents can miss.
    if(s.power==='gravity')b.vy+=Math.sin(s.simTime*8)*.26*dt;
    if(s.power==='magnet')b.vy+=(b.vx>0?s.right-b.y:s.left-b.y)*.32*dt;
    if(s.power==='vortex')b.vy+=Math.sin(s.simTime*19)*.38*dt;
    if(s.power==='storm')b.vy+=Math.sin(s.simTime*25)*.31*dt;
    if(s.power==='rainbow')b.vy+=Math.sin(s.simTime*12)*.22*dt;
    b.vy=Math.max(-.53,Math.min(.53,b.vy));
    const prevX=b.x,prevY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
    const inFlightDisplacement=Math.hypot(b.x-prevX,b.y-prevY);
    s.stuckBallSeconds=inFlightDisplacement<1e-7?(s.stuckBallSeconds||0)+dt:0;
    if(s.stuckBallSeconds>1.8){
        s.ballRecoveries=(s.ballRecoveries||0)+1;
        gtm413PongServe(s,b.vx<0?-1:1);
        s.abilityMessage='BALL STALLED · NEW SERVE';s.abilityMessageTime=1.5;return;
    }
    if(b.y<.22){b.y=.44-b.y;b.vy=Math.abs(b.vy);}
    if(b.y>.85){b.y=1.7-b.y;b.vy=-Math.abs(b.vy);}
    const leftLine=.132,rightLine=.868,radius=.021;
    const atLeft=!s.goalLane&&b.vx<0&&prevX>=leftLine&&b.x<=leftLine;
    const atRight=!s.goalLane&&b.vx>0&&prevX<=rightLine&&b.x>=rightLine;
    if(atLeft||atRight){
        const paddle=atLeft?s.left:s.right;
        const half=.112*(atLeft?(s.giantLeft>0?1.45:s.shrinkLeft>0?.67:1):
            (s.giantRight>0?1.45:s.shrinkRight>0?.67:1));
        const shield=atLeft?'shieldLeft':'shieldRight';
        const defending=atLeft?'left':'right';
        const fortress=morphEnabled&&gtm428PongIsMorph(s,defending,'fortress');
        const changedHalf=fortress?.39:half;
        if(Math.abs(b.y-paddle)<=changedHalf+radius||s[shield]>0||fortress){
            const deflect=s[shield]>0||fortress;
            if(deflect){if(!fortress)s[shield]=0;s.bursts.push({x:b.x,y:b.y,age:0,kind:'shield'});}
            b.x=atLeft?leftLine:rightLine;
            b.vx=(atLeft?1:-1)*Math.min(.86,Math.abs(b.vx)*1.035+.007);
            b.vy=Math.max(-.50,Math.min(.50,b.vy+(b.y-paddle)*.70));
            if(deflect){
                const direction=b.y>=paddle?1:-1;
                b.vy=Math.max(-.51,Math.min(.51,b.vy*.25+direction*(.19+.10*gtm413PongRandom(s))));
                b.vx=(atLeft?1:-1)*Math.min(.92,Math.abs(b.vx)*1.15+.055);
                s.abilityMessage='SHIELD DEFLECTION!';s.abilityMessageTime=1.1;
            }
            if(morphEnabled){
                if(gtm428PongIsMorph(s,defending,'mirror'))b.vy=Math.max(-.53,Math.min(.53,-b.vy+(b.y-paddle)*.4));
                if(gtm428PongIsMorph(s,defending,'thunder'))b.vx=(atLeft?1:-1)*Math.min(.92,Math.abs(b.vx)*1.19+.05);
                if(gtm428PongIsMorph(s,defending,'inferno'))b.vx=(atLeft?1:-1)*Math.min(.90,Math.abs(b.vx)*1.13+.035);
                if(gtm428PongIsMorph(s,defending,'cryo'))s[atLeft?'freezeRight':'freezeLeft']=1.2;
                if(s['morphTime'+(defending==='left'?'Left':'Right')]>0)s.bursts.push({x:b.x,y:b.y,age:0,kind:s['morph'+(defending==='left'?'Left':'Right')]});
            }
            const armed=atLeft?'powerShotLeft':'powerShotRight';
            if(s[armed]>0){
                s[armed]=0;b.vx=(atLeft?1:-1)*Math.min(.96,Math.abs(b.vx)*1.34+.085);
                s.bursts.push({x:b.x,y:b.y,age:0,kind:'meteor'});
                s.hyperBallTimer=1.4;s.hyperBallSide=atLeft?'left':'right';
                s.abilityMessage='POWER SHOT!';s.abilityMessageTime=1.1;
            }
            s.rally++;s.hitCount++;
            s.bursts.push({x:b.x,y:b.y,age:0,kind:s.power||'pulse'});
            if((mode==='power'||mode==='chaos')&&s.cooldown<=0&&(s.hitCount%3===0||env.beat>.68))gtm413PongActivate(s,env);
        }else{
            s.goalLane=atLeft?'right':'left';s.abilityMessage='GOAL LANE';s.abilityMessageTime=.6;
        }
    }
    if((s.goalLane==='right'&&b.x<=.025)||(s.goalLane==='left'&&b.x>=.975)||b.x<.005||b.x>.995){
        s.goalAt=s.goalLane||(b.x<.5?'right':'left');s.goalLane=s.goalAt;
        s.ball.x=b.x=Math.max(.012,Math.min(.988,b.x));
        s.goalHold=.84;s.goalPulse=1.10;
        s.goalCelebration={side:s.goalAt,x:b.x,y:b.y,age:0,duration:1.28};
        s.abilityMessage='';s.abilityMessageTime=0;
        s.bursts.push({x:b.x,y:b.y,age:0,kind:'plasma'});return;
    }
    if(s.trails.length===0||Math.hypot(b.x-s.trails[0].x,b.y-s.trails[0].y)>.018){
        s.trails.unshift({x:b.x,y:b.y,age:0});if(s.trails.length>15)s.trails.pop();
    }
    for(const p of s.trails)p.age+=dt;
}
// Premium scoring sequence for Couch View. All effects are procedural, bounded,
// local to the goal zone and deterministic, with no full-screen white flash.
// Quality settings affect ONLY draw operations, never scoring or ball physics.
function gtm423DrawGoalCelebration(s,ctx,w,h,dpr,colors,courtTop,courtBottom,quality,names){
    const fx=s.goalCelebration;if(!fx)return;
    const t=fx.age,remaining=Math.max(0,1-t/fx.duration);
    const scorer=fx.side==='left'?0:1,primary=colors[scorer];
    const goalOnLeft=fx.side==='right'; // right scores at left rear goal line
    const edgeX=goalOnLeft?Math.max(2,w*.014):w-Math.max(2,w*.014);
    const arenaH=courtBottom-courtTop;
    const centerY=courtTop+(Math.max(.22,Math.min(.85,fx.y))-.22)/.63*arenaH;
    const impactX=Math.max(w*.024,Math.min(w*.976,fx.x*w));
    const opacity=Math.min(1,t/.10)*Math.min(1,remaining*2.7);
    const count=quality==='low'?8:quality==='high'?18:13;
    ctx.save();
    // Goal-mouth frame strobes only along the scoring edge, not across the game.
    const edgeWidth=Math.max(4,w*.009),edgePulse=.48+.52*Math.sin(t*26)**2;
    ctx.globalAlpha=.35*opacity+.27*edgePulse*opacity;
    ctx.fillStyle=primary;
    ctx.fillRect(goalOnLeft?0:w-edgeWidth,courtTop,edgeWidth,arenaH);
    ctx.globalAlpha=.65*opacity;
    ctx.strokeStyle=primary;ctx.lineWidth=Math.max(1.5,dpr*1.4);
    for(let j=0;j<3;j++){
        const span=(.13+t*.25+j*.09)*arenaH;
        ctx.beginPath();ctx.moveTo(edgeX,centerY-span*.5);ctx.lineTo(edgeX+(goalOnLeft?1:-1)*(w*.010+j*w*.009),centerY-span*.5);
        ctx.lineTo(edgeX+(goalOnLeft?1:-1)*(w*.010+j*w*.009),centerY+span*.5);
        ctx.lineTo(edgeX,centerY+span*.5);ctx.stroke();
    }
    // Two expanding rings, each with a distinct fade and slightly offset timing.
    for(let ring=0;ring<2;ring++){
        const u=Math.max(0,t-ring*.085),phase=Math.min(1,u/.64);
        const radius=Math.max(7,Math.min(w*.17,arenaH*.45)*(.18+phase*.82));
        ctx.globalAlpha=opacity*(ring?.42:.68)*(1-phase*.77);
        ctx.strokeStyle=ring?'#ffffff':primary;
        ctx.lineWidth=Math.max(1,dpr*(ring?1.3:2.2))*(1-phase*.35);
        ctx.beginPath();ctx.arc(impactX,centerY,radius,0,Math.PI*2);ctx.stroke();
    }
    // Bounded rays and sparks. No arrays, textures, shaders or unbounded particles.
    for(let i=0;i<count;i++){
        const a=i*Math.PI*2/count+.14;
        const travel=(.18+Math.min(.75,t)*1.3)*(arenaH*.34);
        const r0=5+travel*.25,r1=9+travel*(.64+((i*7)%5)*.045);
        ctx.globalAlpha=opacity*(.35+((i*3)%4)*.09);
        ctx.strokeStyle=i%3===0?'#ffffff':primary;
        ctx.lineWidth=Math.max(.7,dpr*(i%4===0?1.9:1.05));
        ctx.beginPath();ctx.moveTo(impactX+Math.cos(a)*r0,centerY+Math.sin(a)*r0);
        ctx.lineTo(impactX+Math.cos(a)*r1,centerY+Math.sin(a)*r1);ctx.stroke();
    }
    // Scoring callout is readable from a couch and never hides the paddles.
    const bannerW=Math.min(w*.47,Math.max(172,w*.32));
    const bannerH=Math.min(arenaH*.25,Math.max(33,h*.18));
    const bannerY=courtTop+arenaH*.18;
    ctx.globalAlpha=Math.min(1,opacity*.94);
    ctx.fillStyle='rgba(3,8,22,.91)';ctx.fillRect((w-bannerW)/2,bannerY,bannerW,bannerH);
    ctx.lineWidth=Math.max(1,dpr);ctx.strokeStyle=primary;
    ctx.strokeRect((w-bannerW)/2,bannerY,bannerW,bannerH);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.globalAlpha=opacity;ctx.fillStyle='#ffffff';
    ctx.font=`900 ${Math.max(14,Math.min(30,bannerH*.54))}px system-ui,sans-serif`;
    ctx.fillText('GOAL!',w/2,bannerY+bannerH*.38,bannerW*.9);
    ctx.font=`800 ${Math.max(9,Math.min(14,bannerH*.23))}px system-ui,sans-serif`;
    ctx.fillStyle=primary;
    ctx.fillText(`${(names?.[scorer]|| (scorer===0?'LEFT':'RIGHT'))} SCORES  +1`,w/2,bannerY+bannerH*.77,bannerW*.88);
    ctx.restore();
}
function gtm413PongDraw(s,env){
    const {ctx,w,h,dpr,energy,beat,paletteName}=env;
    const mode=env.settings?.homeReactiveVisualizerPongMode||'power';
    const powerVisual=mode==='power'||mode==='chaos';
    const vivid=env.settings?.homeReactiveVisualizerPongStyle==='vivid';
    const p=s.power,fx=GTM413_EFFECTS[p],b=s.ball;
    const cfg=env.settings||{},colors=gtm414PongPickColors(s,cfg);
    const teamName=index=>env.arcade?.[index===0?'left':'right']?.human?
        ((index===0)===(cfg.homeReactiveVisualizerArcadePlayerSide!=='right')?'PLAYER 1':'PLAYER 2'):
        cfg.homeReactiveVisualizerPongTeamPalette==='custom'?(index===0?'LEFT':'RIGHT'):
        cfg.homeReactiveVisualizerPongTeamPalette==='random'?(index===0?'TEAM 1':'TEAM 2'):
        (cfg.homeReactiveVisualizerPongTeamPalette||'red_blue').split('_')[index]?.toUpperCase()||'TEAM';
    const clock=Math.floor(s.matchElapsed/60)+':'+String(Math.floor(s.matchElapsed%60)).padStart(2,'0');
    const stroke=(pts,col,width)=>{ctx.strokeStyle=col;ctx.lineWidth=width*dpr;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke()};
    const circle=(x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()};
    const shine=(x,y,r,col,alpha=.35)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()};
    // 4.1.6: TV-readable championship banner. Match labels have their own
    // opaque strip, and the timer has its own bounded, high-contrast badge.
    // The footer remains the sole rendering surface: no Steam UI overlays.
    const hudTall=cfg.homeReactiveVisualizerPongHudSize!=='standard';
    const courtTop=h*(hudTall?.34:.31),courtBottom=h*.975;
    const courtY=y=>courtTop+(Math.max(.22,Math.min(.85,y))-.22)/.63*(courtBottom-courtTop);
    const courtSpan=courtBottom-courtTop;
    const leftName=teamName(0).slice(0,10),rightName=teamName(1).slice(0,10);
    const scoreFont=Math.max(16,Math.min(35,h*(hudTall?.26:.22)));
    const timerFont=Math.max(13,Math.min(24,h*(hudTall?.18:.16)));
    const statusFont=Math.max(10,Math.min(16,h*(hudTall?.115:.105)));
    const nameFont=Math.max(10,Math.min(17,h*.126));
    const timeLeft=Math.floor(s.matchElapsed/60),timeRight=String(Math.floor(s.matchElapsed%60)).padStart(2,'0');
    const timeString=`${String(timeLeft).padStart(2,'0')}:${timeRight}`;
    ctx.save();
    ctx.fillStyle='rgba(2,5,17,.98)';ctx.fillRect(0,0,w,courtTop);
    ctx.strokeStyle='rgba(182,217,255,.8)';ctx.lineWidth=Math.max(1,dpr);
    ctx.beginPath();ctx.moveTo(0,courtTop);ctx.lineTo(w,courtTop);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    // Pixel-wide dark text outlines survive pastel team colors and bright scenery.
    const caption=(text,x,y,maxW,font,fill)=>{
        ctx.font=font;ctx.lineJoin='round';ctx.lineWidth=Math.max(1.5,dpr*2.3);
        ctx.strokeStyle='#02040e';ctx.strokeText(text,x,y,maxW);
        ctx.fillStyle=fill;ctx.fillText(text,x,y,maxW);
    };
    const firstY=h*.112;
    caption(leftName,w*.19,firstY,w*.19,`800 ${nameFont}px system-ui,sans-serif`,'#f6faff');
    caption(rightName,w*.81,firstY,w*.19,`800 ${nameFont}px system-ui,sans-serif`,'#f6faff');
    caption(String(s.scoreLeft).padStart(2,'0'),w*.355,firstY,w*.105,`900 ${scoreFont}px system-ui,sans-serif`,colors[0]);
    caption(String(s.scoreRight).padStart(2,'0'),w*.645,firstY,w*.105,`900 ${scoreFont}px system-ui,sans-serif`,colors[1]);
    // Arcade 4.2.1: compact power meters live BESIDE the scores, in the top HUD.
    // Their translucent badges don't obscure the playing field. One independent
    // RB and LB meter is shown per team, with fill representing recharge.
    // In small Default View the bars shrink with the scoreboard, while Couch View
    // keeps labels large enough to read at TV distance.
    if(powerVisual||mode==='morph'){
        const compactHeader=h<155;
        const meterY=h*(compactHeader?.200:.168);
        const meterHeight=compactHeader?Math.max(3.5,h*.037):Math.max(10,Math.min(14,h*.065));
        const meterFont=Math.max(8,Math.min(11.5,h*.054));
        const drawMeter=(left,top,width,label,cooldown,period,active,tint)=>{
            const ready=cooldown<=.001;
            const fill=active||ready?1:Math.max(0,1-cooldown/period);
            ctx.fillStyle='rgba(3,8,22,.78)';ctx.fillRect(left,top,width,meterHeight);
            ctx.fillStyle=tint;ctx.globalAlpha=active?.46:ready?.32:.23;
            ctx.fillRect(left+1,top+1,Math.max(0,(width-2)*fill),Math.max(2,meterHeight-2));
            ctx.globalAlpha=1;
            ctx.strokeStyle=tint;ctx.globalAlpha=.72;ctx.lineWidth=Math.max(.7,dpr*.75);
            ctx.strokeRect(left+.5,top+.5,width-1,meterHeight-1);ctx.globalAlpha=1;
            // Default View is deliberately compact: show the miniature charge
            // gauge without printing unreadable microtext over match status.
            if(!compactHeader){
                ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`800 ${meterFont}px system-ui,sans-serif`;
                ctx.fillStyle='#f8fbff';ctx.fillText(label,left+width/2,top+meterHeight/2,width-5);
            }
        };
        for(let i=0;i<2;i++){
            const side=i===0?'left':'right';
            const morphMode=mode==='morph'||mode==='chaos';
            const powerCooldown=Math.max(0,s[morphMode?'morphCdAttack'+(side==='left'?'Left':'Right'):'cooldown'+(side==='left'?'Left':'Right')]||0);
            const shieldCooldown=Math.max(0,s[morphMode?'morphCdDefense'+(side==='left'?'Left':'Right'):'shieldCooldown'+(side==='left'?'Left':'Right')]||0);
            const shieldActive=morphMode?s['morphTime'+(side==='left'?'Left':'Right')]>0:s[side==='left'?'shieldLeft':'shieldRight']>0;
            const groupLeft=w*(i===0?.095:.585),meterWidth=w*.151,gap=w*.008;
            const armed=!morphMode&&s[side==='left'?'powerShotLeft':'powerShotRight']>0;
            const powerLabel=armed?'RB ARMED':powerCooldown>0?`RB ${powerCooldown.toFixed(1)}s`:'RB READY';
            const shieldLabel=shieldActive?'LB ACTIVE':shieldCooldown>0?`LB ${shieldCooldown.toFixed(1)}s`:'LB READY';
            drawMeter(groupLeft,meterY,meterWidth,powerLabel,powerCooldown,morphMode?(GTM428_PONG_MORPHS[cfg.homeReactiveVisualizerPongAttackMorph||'thunder']?.cooldown||12):4,false,colors[i]);
            drawMeter(groupLeft+meterWidth+gap,meterY,meterWidth,shieldLabel,shieldCooldown,morphMode?(GTM428_PONG_MORPHS[cfg.homeReactiveVisualizerPongDefenseMorph||'fortress']?.cooldown||20):3,shieldActive,colors[i]);
        }
    }
    // The match timer counts real visible play time, not capped physics ticks.
    ctx.fillStyle='#071326';ctx.fillRect(w*.421,h*.012,w*.158,h*.225);
    ctx.strokeStyle='#8cb9ff';ctx.lineWidth=Math.max(1,dpr);ctx.strokeRect(w*.421,h*.012,w*.158,h*.225);
    caption(timeString,w*.5,firstY,w*.141,`900 ${timerFont}px ui-monospace,monospace`,'#ffffff');
    const seriesTarget=s.series==='endless'?'∞':s.series;
    const leader=s.champion?`${s.champion==='left'?leftName:rightName} CHAMPION`:
        s.winner?`${s.winner==='left'?leftName:rightName} WINS MATCH ${s.match}`:
        `MATCH ${s.match} / ${seriesTarget}`;
    const status=s.champion?`${leader}   •   RESET IN ${Math.ceil(s.gameOver)}s`:
        s.winner?`${leader}   •   NEXT IN ${Math.ceil(s.gameOver)}s`:
        `${leader}   •   SERIES ${s.winsLeft} - ${s.winsRight}${s.serve>0?'   •   SERVE '+Math.ceil(s.serve)+'s':''}`;
    ctx.fillStyle='#030917';ctx.fillRect(w*.08,h*.239,w*.84,h*.095);
    ctx.strokeStyle='rgba(125,174,249,.65)';ctx.strokeRect(w*.08,h*.239,w*.84,h*.095);
    caption(status,w*.5,h*.287,w*.81,`900 ${statusFont}px system-ui,sans-serif`,'#ffffff');
    ctx.restore();
    // 4.2.0: prove the chosen arena is actually active, separate from music visualizer settings.
    const arenaKind=env.scene?.background?.style||'arcade';
    const arenaLabel=arenaKind==='storm'?'THUNDER COURT':arenaKind==='stars'?'STARLIGHT GALAXY':
       arenaKind==='arcade'?'NEON GRID':String(arenaKind).toUpperCase();
    ctx.save();ctx.textAlign='left';ctx.textBaseline='top';ctx.font=`800 ${Math.max(9,Math.min(12,h*.075))}px system-ui`;
    ctx.fillStyle='rgba(236,245,255,.86)';ctx.fillText(arenaLabel,w*.032,courtTop+Math.max(3,h*.016),w*.19);
    ctx.restore();
    // Scoring no longer creates an all-white wash. A bounded edge accent pulses instead.
    if(s.flash>0){
        ctx.save();ctx.globalAlpha=Math.min(.30,s.flash*.23);
        ctx.fillStyle=colors[s.lastPoint==='left'?0:1];
        ctx.fillRect(0,courtTop,Math.max(2,w*.006),courtSpan);
        ctx.fillRect(w-Math.max(2,w*.006),courtTop,Math.max(2,w*.006),courtSpan);
        ctx.restore();
    }
    // Championship Match Director: readable match point and bounded celebration.
    const pointGoal=Math.max(3,Math.min(11,Number(cfg.homeReactiveVisualizerPongGoal)||7));
    const isMatchPoint=!s.winner&&(s.scoreLeft===pointGoal-1||s.scoreRight===pointGoal-1);
    if(isMatchPoint){
        ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle='rgba(2,5,16,.92)';ctx.fillRect(w*.405,courtTop+h*.010,w*.19,h*.145);
        ctx.strokeStyle='#ffdc7b';ctx.lineWidth=Math.max(1,dpr);ctx.strokeRect(w*.405,courtTop+h*.010,w*.19,h*.145);
        ctx.font=`900 ${Math.max(11,Math.min(17,h*.132))}px system-ui,sans-serif`;
        ctx.fillStyle='#fff5c1';ctx.fillText('MATCH POINT',w*.5,courtTop+h*.082,w*.18);
        ctx.restore();
    }
    if(s.winner){
        const winColor=colors[s.winner==='left'?0:1],alpha=Math.min(.85,Math.max(.2,s.gameOver*.22));
        ctx.save();ctx.globalAlpha=alpha;
        for(let i=0;i<18;i++){
            const x=((i*73.17+s.simTime*13)%w+w)%w;
            const y=courtTop+courtSpan*((i*.067+s.simTime*.23)%1);
            ctx.fillStyle=i%3===0?'#f9fdff':i%3===1?winColor:'#ffda82';
            ctx.fillRect(x,y,Math.max(2,2.5*dpr),Math.max(2,1.5*dpr));
        }
        ctx.restore();
    }
    // Always-contrasting center line, independent of hue-shifting theme.
    ctx.fillStyle='rgba(226,239,255,.27)';for(let i=0;i<8;i++)
        ctx.fillRect(w*.499,courtTop+courtSpan*(i+.1)/8,Math.max(1,dpr*1.5),courtSpan*.049);
    function paddle(x,y,color,ice,side){
        const fxName=cfg[side==='left'?'homeReactiveVisualizerPongLeftFx':'homeReactiveVisualizerPongRightFx']||'none';
        const grow=s[side==='left'?'giantLeft':'giantRight']>0,
            shrink=s[side==='left'?'shrinkLeft':'shrinkRight']>0;
        const morph=s['morph'+(side==='left'?'Left':'Right')],active=(s['morphTime'+(side==='left'?'Left':'Right')]||0)>0;
        const fortress=active&&morph==='fortress';
        const yy=fortress?courtY(.535):courtY(y),half=fortress?courtSpan*.53:courtSpan*.112/.63*(grow?1.45:shrink?.67:1),ww=Math.max(4,5*dpr)*(fortress?1.65:1);
        ctx.fillStyle='rgba(4,7,16,.90)';ctx.fillRect(w*x-ww*.85,yy-half-1.2*dpr,ww*1.7,half*2+2.4*dpr);
        ctx.fillStyle=ice?'#e0fbff':color;ctx.fillRect(w*x-ww*.55,yy-half,ww*1.1,half*2);
        ctx.strokeStyle='#ffffff';ctx.lineWidth=.7*dpr;ctx.strokeRect(w*x-ww*.55,yy-half,ww*1.1,half*2);
        const level=cfg.homeReactiveVisualizerPongFxLevel==='high'?1.3:cfg.homeReactiveVisualizerPongFxLevel==='low'?.55:1;
        // All paddles are music-reactive, independent of their selected power style.
        const musicGlow=cfg.homeReactiveVisualizerPongBgReactivity==='off'?0:
            Math.min(.17,env.lo*.09+env.mid*.04+beat*.07);
        if(vivid||fxName!=='none'||musicGlow>.012)
            shine(w*x,yy,half*(1.7+Math.min(.3,env.lo*.24)),color,((vivid?.17:.08)+musicGlow)*level);
        if(fxName==='electric'||fxName==='plasma'||fxName==='reactive'){
            ctx.strokeStyle=fxName==='reactive'?'#ffffff':fxName==='plasma'?'#df9dff':'#e5f7ff';
            ctx.globalAlpha=.34*level+(fxName==='reactive'?beat*.34:0);
            ctx.lineWidth=dpr;ctx.beginPath();ctx.moveTo(w*x,yy-half);
            ctx.lineTo(w*x+(Math.sin(s.simTime*17+(side==='left'?0:2))*3*dpr),yy);
            ctx.lineTo(w*x,yy+half);ctx.stroke();ctx.globalAlpha=1;
        }else if(fxName==='flame'||fxName==='ice'){
            const tint=fxName==='ice'?'#bdffff':'#ffb359';ctx.strokeStyle=tint;ctx.lineWidth=1.2*dpr;
            for(let i=0;i<3;i++){const dy=(i-1)*half*.6;
                ctx.beginPath();ctx.moveTo(w*x,yy+dy);ctx.lineTo(w*x+(side==='left'?1:-1)*h*(.025+.015*Math.sin(s.simTime*9+i)),yy+dy-h*.015);ctx.stroke();}
        }else if(fxName==='rainbow'){
            ctx.strokeStyle=`hsl(${(s.simTime*90)%360},100%,72%)`;ctx.lineWidth=2*dpr;
            ctx.strokeRect(w*x-ww,yy-half-1.3*dpr,ww*2,half*2+2.6*dpr);
        }
        if(active){
            const morphTint=morph==='fortress'?'#a9f3ff':morph==='inferno'?'#ff9b58':morph==='cryo'?'#abfaff':morph==='mirror'?'#d8c7ff':'#d6ff9e';
            ctx.strokeStyle=morphTint;ctx.globalAlpha=.38+.2*Math.sin(s.simTime*18);ctx.lineWidth=Math.max(1.2,dpr*2.5);
            ctx.strokeRect(w*x-ww*1.9,yy-half-1*dpr,ww*3.8,half*2+2*dpr);ctx.globalAlpha=1;
            if(fortress){ctx.fillStyle='rgba(130,216,255,.18)';ctx.fillRect(w*x-ww*2,yy-half,ww*4,half*2);}
        }
        if(s[side==='left'?'shieldLeft':'shieldRight']>0){
            ctx.strokeStyle='#a0eeff';ctx.globalAlpha=.65;ctx.lineWidth=1.8*dpr;
            ctx.strokeRect(w*x-ww*2,yy-half-3*dpr,ww*4,half*2+6*dpr);ctx.globalAlpha=1;
        }
    }
    paddle(.12,s.left,colors[0],s.freezeLeft>0,'left');paddle(.88,s.right,colors[1],s.freezeRight>0,'right');
    const powerColor=fx?.rgb||'#f8ffff',color=fx?.trail||'#70d8ff';
    const count=powerVisual?(vivid?15:10):7;
    for(let i=Math.min(count,s.trails.length)-1;i>=0;i--){
        const pt=s.trails[i],alpha=Math.max(0,1-i/(count+1)),x=pt.x*w,y=courtY(pt.y);
        if(p==='rainbow'&&powerVisual){
            const hue=((i/count+env.frame.elapsed*.23)%1)*360;
            ctx.fillStyle=`hsla(${hue},95%,67%,${alpha*.5})`;
        }else ctx.fillStyle=powerVisual&&p?color:`rgba(170,228,255,${alpha*.35})`;
        circle(x,y,Math.max(1,dpr*(1.6+alpha*2.5))*(vivid?1.25:1),ctx.fillStyle);
        if(powerVisual&&p==='lightning'&&i<count-1&&i%2===0){
            const nxt=s.trails[i+1];if(nxt)stroke([[x,y],[((pt.x+nxt.x)*.5*w)+((i%2)*2-1)*3*dpr,y-3*dpr],[nxt.x*w,courtY(nxt.y)]],'#c6bdff',.8);
        }
        if(powerVisual&&p==='mirror'&&i%3===0)circle(x,courtY(1.07-pt.y),2*dpr,'rgba(202,190,255,.19)');
    }
    const x=b.x*w,y=courtY(b.y),r=Math.max(2.8*dpr,courtSpan*.055);
    const mindVisual=(mode==='mindball'||mode==='chaos'||
        (['morph','power','competitive'].includes(mode)&&cfg.homeReactiveVisualizerPongMindballModifier===true))&&!!s.mindActive&&
        s.serve<=0&&s.goalHold<=0&&s.gameOver<=0&&b.x>.26&&b.x<.74;
    if(mindVisual){
        ctx.save();ctx.strokeStyle='#ffdf3a';ctx.lineWidth=Math.max(1.5,dpr*1.4);
        ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(x,y,r*1.65,-.9,.9);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+b.vx*17*dpr,y+b.vy*17*dpr);ctx.stroke();ctx.restore();
    }
    const ballMusic=cfg.homeReactiveVisualizerPongBgReactivity==='off'?0:
        Math.min(.25,env.lo*.12+env.hi*.06+beat*.09);
    if(ballMusic>.01)shine(x,y,r*(2.7+ballMusic*3),colors[s.ball.vx<0?0:1],ballMusic);
    if(s.hyperBallTimer>0){const z=Math.min(1,s.hyperBallTimer);
        shine(x,y,r*(6+z*3),colors[s.hyperBallSide==='left'?0:1],.26+.24*z);
        ctx.strokeStyle=colors[s.hyperBallSide==='left'?0:1];ctx.globalAlpha=.8*z;
        ctx.lineWidth=Math.max(1,dpr*2);ctx.beginPath();ctx.arc(x,y,r*(2.0+z),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    }
    if(powerVisual&&p){
        shine(x,y,r*(vivid?5:3.2),color,vivid?.39:.24);
        if(p==='plasma'||p==='pulse'||p==='gravity'||p==='vortex'){
            ctx.beginPath();ctx.arc(x,y,r*(2.2+.35*Math.sin(s.simTime*9)),0,Math.PI*2);
            ctx.strokeStyle=color;ctx.lineWidth=dpr;ctx.stroke();
        }
        if(p==='ice')for(let i=0;i<4;i++){
            const a=i*Math.PI*.5+s.simTime*.6;
            stroke([[x+Math.cos(a)*r,y+Math.sin(a)*r],[x+Math.cos(a)*r*2,y+Math.sin(a)*r*2]],'#befaff',.85);
        }
        if(p==='fire'||p==='comet'){
            const direction=Math.sign(b.vx)||1;
            stroke([[x-direction*r,y],[x-direction*r*(vivid?5:3),y-r*.6]],color,vivid?2:1.4);
        }
        if(p==='magnet'){ctx.strokeStyle='#b7fff1';ctx.lineWidth=dpr;ctx.beginPath();ctx.arc(x,y,r*2,.1,Math.PI-.1);ctx.stroke()}
        ctx.fillStyle='rgba(2,5,16,.87)';ctx.fillRect(w*.68,courtTop+h*.012,w*.20,h*.128);
        ctx.font=`700 ${Math.max(7,Math.min(10,h*.10))}px system-ui,sans-serif`;
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';
        ctx.fillText(fx.label,w*.78,courtTop+h*.075);
        ctx.strokeStyle=color;ctx.lineWidth=dpr;ctx.strokeRect(w*.68,courtTop+h*.012,w*.20,h*.128);
    }
    // Guaranteed white ball core and dark keyline, even on high-contrast themes.
    if(s.goalHold>0||s.goalPulse>0){
        const bright=s.goalHold>0?Math.max(.3,Math.min(1,s.goalHold/.84)):.22*s.goalPulse;
        const side=s.goalAt||s.lastPoint||'left',tint=colors[side==='left'?0:1];
        shine(x,y,r*(4+bright*7),tint,.18+bright*.50);
        ctx.strokeStyle=tint;ctx.globalAlpha=.8*bright;ctx.lineWidth=2.2*dpr;
        ctx.beginPath();ctx.arc(x,y,r*(2.1+(1-bright)*3),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    }
    if(mindVisual){
        shine(x,y,r*3.5,'#ffe44d',.52);
        ctx.strokeStyle='#ffcf35';ctx.lineWidth=Math.max(1.4,dpr*1.6);
        ctx.beginPath();ctx.arc(x,y,r*2,0,Math.PI*2);ctx.stroke();
    }
    circle(x,y,r+1.4*dpr,'#030712');
    circle(x,y,r*1.13,mindVisual?'#ffdf36':p&&powerVisual?powerColor:'#f6fdff');
    circle(x-r*.26,y-r*.26,Math.max(1,r*.25),'rgba(255,255,255,.95)');
    if(s.abilityMessageTime>0){
        ctx.fillStyle='rgba(4,8,18,.91)';ctx.fillRect(w*.40,h*.72,w*.20,h*.11);
        ctx.fillStyle='#fff9d6';ctx.font=`800 ${Math.max(10,Math.min(15,h*.088))}px sans-serif`;
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.abilityMessage,w*.5,h*.775,w*.19);
    }
    for(const burst of s.bursts){
        const a=1-burst.age/.55,bcol=GTM413_EFFECTS[burst.kind]?.rgb||'#ffffff';
        if(a<=0)continue;
        const radius=(.025+(.55-burst.age)*.037)*courtSpan;
        ctx.beginPath();ctx.arc(burst.x*w,courtY(burst.y),radius,0,Math.PI*2);
        ctx.strokeStyle=bcol;ctx.globalAlpha=Math.min(.64,a*.64);ctx.lineWidth=Math.max(1,dpr)*a;ctx.stroke();ctx.globalAlpha=1;
    }
    gtm423DrawGoalCelebration(s,ctx,w,h,dpr,colors,courtTop,courtBottom,cfg.homeReactiveVisualizerPongFxLevel||'normal',[leftName,rightName]);
}
gtm417RegisterArcadeGame('neon_pong',{
    signature:gtm414PongSignature,
    create:gtm413PongCreate,step:gtm413PongStep,draw:gtm413PongDraw,
    options:[
        {key:'homeReactiveVisualizerPongMode',label:'Pong game mode',description:'Classic, competitive, powers, physical morphs, a self-steering ball, or both.',options:[['classic','Classic'],['competitive','Competitive'],['power','Power Battle'],['morph','Morph Battle'],['mindball','Mindball'],['chaos','Chaos Championship']]},
        {key:'homeReactiveVisualizerPongMindballModifier',label:'Mindball modifier',description:'Enable live self-steering alongside Morph Battle, Power Battle or Competitive. Classic remains untouched.',options:[[false,'Off'],[true,'On: mix into selected mode']]},
        {key:'homeReactiveVisualizerPongMindballStrength',label:'Mindball steering strength',description:'Gradual midcourt steering only. Ball cannot teleport or reverse its horizontal travel.',options:[['subtle','Subtle'],['standard','Standard'],['strong','Strong']]},
        {key:'homeReactiveVisualizerPongMindballAwareness',label:'Mindball tactical awareness',description:'How assertively Mindball reads the receiving paddle; never changes score, collisions, or horizontal movement.',options:[['gentle','Gentle'],['strategic','Strategic'],['dynamic','Dynamic']]},
        {key:'homeReactiveVisualizerPongMindballPersonality',label:'Mindball personality',description:'Choose autonomous steering behavior without changing scoring or the physics timestep.',options:[['adaptive','Adaptive'],['curious','Curious'],['hunter','Hunter'],['trickster','Trickster'],['survivor','Survivor']]},
        {key:'homeReactiveVisualizerPongDefenseMorph',label:'LB defensive morph',description:'Fortress blocks all shots for 3 seconds, then recharges for 20 seconds.',options:[['fortress','Fortress · full barrier'],['magnet','Magnet · attract the ball'],['gravity','Gravity · bend the shot']]},
        {key:'homeReactiveVisualizerPongAttackMorph',label:'RB attacking morph',description:'Choose a shot transformation. Cooldowns and effects are shared fairly with the AI.',options:[['thunder','Thunder · lightning return'],['mirror','Mirror · angle reversal'],['cryo','Cryo · freeze rival'],['inferno','Inferno · fire return']]},
        {key:'homeReactiveVisualizerPongHumanSpeed',label:'Human paddle speed',description:'Faster player response without changing AI movement. Competitive recommended.',options:[['comfortable','Comfortable'],['competitive','Competitive (default)'],['turbo','Turbo']]},
        {key:'homeReactiveVisualizerPongBallSpeed',label:'Ball speed',description:'Choose rally speed independently of your paddle.',options:[['relaxed','Relaxed'],['competitive','Competitive (default)'],['extreme','Extreme']]},
        {key:'homeReactiveVisualizerPongDifficulty',label:'AI rivals',description:'Both paddles aim to win. Expert predicts faster.',options:[['casual','Casual'],['balanced','Balanced'],['expert','Expert']]},
        {key:'homeReactiveVisualizerPongGoal',label:'Points per match',description:'First side to score this many points wins.',options:[[5,'5 points'],[7,'7 points'],[11,'11 points']]},
        {key:'homeReactiveVisualizerPongSeries',label:'Championship length',description:'Best-of series, or endless matches.',options:[['3','Best of 3'],['5','Best of 5'],['7','Best of 7'],['endless','Endless']]},
        {key:'homeReactiveVisualizerPongRoundPauseSec',label:'Between-match pause',description:'Time to read who won before the next game starts. Faster by default.',options:[[.5,'0.5 seconds'],[1,'1 second'],[1.5,'1.5 seconds'],[2,'2 seconds'],[3,'3 seconds'],[5,'5 seconds']]},
        {key:'homeReactiveVisualizerPongChampionPauseSec',label:'Championship trophy pause',description:'Time to read the champion before the series starts again.',options:[[1,'1 second'],[2,'2 seconds'],[3,'3 seconds'],[5,'5 seconds'],[10,'10 seconds']]},
        {key:'homeReactiveVisualizerPongTeamPalette',label:'Team color rivalry',description:'Select ten contrasting pairings, random match colors, or custom hex.',options:[
            ['red_blue','Crimson / Blue'],['purple_pink','Purple / Pink'],['magenta_cyan','Magenta / Cyan'],
            ['green_orange','Green / Orange'],['yellow_violet','Yellow / Violet'],['cherry_gold','Cherry / Gold'],
            ['white_ice','White / Ice'],['lava_plasma','Lava / Plasma'],['rose_emerald','Rose / Emerald'],
            ['ultraviolet_lime','Ultraviolet / Lime'],['random','Random each match'],['custom','Custom colors']]},
        {key:'homeReactiveVisualizerPongLeftFx',label:'Left paddle power style',description:'Separate cosmetic paddle style with readable team color.',options:[
            ['none','None'],['electric','Electric'],['flame','Fire'],['ice','Ice'],['plasma','Plasma'],['rainbow','Rainbow'],['reactive','Music Reactive']]},
        {key:'homeReactiveVisualizerPongRightFx',label:'Right paddle power style',description:'Independent effects for the opposing AI.',options:[
            ['none','None'],['electric','Electric'],['flame','Fire'],['ice','Ice'],['plasma','Plasma'],['rainbow','Rainbow'],['reactive','Music Reactive']]},
        {key:'homeReactiveVisualizerPongFxLevel',label:'Pong special effects',description:'Bounded particles and lighting for smoother Deck performance.',options:[
            ['low','Low'],['normal','Normal'],['high','High']]},
        {key:'homeReactiveVisualizerPongStyle',label:'Pong canvas style',description:'Keep the gameplay readable with any music-reactive palette.',options:[
            ['readable','Clear'],['vivid','Vivid']]},
        {key:'homeReactiveVisualizerPongArena',label:'Pong arena scenery',description:'Use the selected arena, or override with a different procedural background. Pack-safe.',options:[
            ['scene','Follow selected scene'],['arcade','Neon arcade grid'],['storm','Thunderstorm'],['stars','Starlight galaxy'],
            ['nebula','Purple nebula'],['aurora','Aurora sky'],['ocean','Moonlit ocean'],['sunset','Sunset mountains'],
            ['forest','Moonlit forest'],['city','Midnight skyline'],['solid','Solid color']]},
        {key:'homeReactiveVisualizerPongBackgroundColors',label:'Pong scenery colors',description:'Choose scene colors or your own two custom hex colors, without changing team colors.',options:[
            ['scene','Scene colors'],['custom','Custom background colors']]},
        {key:'homeReactiveVisualizerPongBgReactivity',label:'Music-reactive scenery',description:'Bass pulses, mids move the environment, treble adds sparkle and beats trigger accents. No full-screen flashes.',options:[
            ['off','Ambient animation only'],['subtle','Subtle'],['balanced','Balanced'],['dynamic','Dynamic']]},
        {key:'homeReactiveVisualizerPongHudSize',label:'Pong scoreboard readability',description:'Couch enlarges the footer (unless compact is selected) and improves match visibility.',options:[
            ['couch','Couch / TV'],['standard','Standard']]}
    ]
},{title:'Pong Championship',scoring:'match-and-series'});
// Future built-in scenes can use the same create/step/draw lifecycle with
// independent state, fixed CPU budgets and allowlisted declarative pack data.

// Settings are supplied by registered behaviors, not hardcoded into the
// manager. New built-in behavior modules can declare their own controls.
function Gtm413VisualizerBehaviorSettings({settings,updateSettings,section='play'}){
    const [epoch,setEpoch]=SP_REACT.useState(0);
    const [leftHex,setLeftHex]=SP_REACT.useState(settings.homeReactiveVisualizerPongLeftColor||'#ff995e');
    const [rightHex,setRightHex]=SP_REACT.useState(settings.homeReactiveVisualizerPongRightColor||'#68caff');
    const [bgHex,setBgHex]=SP_REACT.useState(settings.homeReactiveVisualizerPongBgColor||'#0b1230');
    const [accentHex,setAccentHex]=SP_REACT.useState(settings.homeReactiveVisualizerPongBgAccent||'#798bff');
    const [message,setMessage]=SP_REACT.useState('');
    const scene=GTM404_PACK_SCENES.get(settings.homeReactiveVisualizerMode);
    const behavior=scene?.layers?.map(layer=>GTM413_BEHAVIORS.get(layer.effect)).find(Boolean);
    SP_REACT.useEffect(()=>{if(!behavior?.options?.length&&!scene?.interaction&&!scene?.options?.length)return;
        const timer=setInterval(()=>setEpoch(n=>n+1),1000);return()=>clearInterval(timer);
    },[Boolean(behavior?.options?.length)]);
    if(!behavior?.options?.length&&!scene?.interaction&&!scene?.options?.length)return null;
    const isPong=scene.layers.some(layer=>layer.effect==='neon_pong');
    const performanceSample=isPong?window.__GTM_RETRO_VISUALIZER_DIAGNOSTIC__:null;
    const sampleFresh=Boolean(performanceSample&&typeof performance!=='undefined'&&
        Number.isFinite(performanceSample.observedAtMs)&&performance.now()-performanceSample.observedAtMs<5000);
    const performanceLine=sampleFresh?
        `Draw ${performanceSample.estimatedDrawFps||0} FPS · ${performanceSample.averageRenderCostMs||0} ms/frame · `+
        `Quality ${Math.round((performanceSample.qualityScale||1)*100)}% · `+
        `Pong steps ${performanceSample.pongPhysicsSteps||0} · Physics lag ${performanceSample.pongPhysicsLagMs||0} ms`:
        'Start Pong to capture render FPS, canvas cost, quality and physics lag.';
    const history=isPong?gtm414PongHistory():null;
    const current=history?.history||[];
    const clock=secs=>`${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
    const summary=history?`Match ${history.match}${history.series==='endless'?'/∞':'/'+history.series} · Series ${history.winsLeft}-${history.winsRight} · ${clock(history.seconds)}${history.champion?` · Trophy ${history.champion.toUpperCase()}`:''}`:
        'Start Pong to track match scores and championship history.';
    const allowedModes=isPong?['ai_ai','player_ai','player_player']:(scene?.interaction?.modes||['ai_ai']);
    const coopGame=['world_arcade_orbit_defenders','world_arcade_prism_bastion'].includes(scene?.id);
    const turnGame=false; // Neon Strike Gallery supports simultaneous solo and versus shooting.
    const arcadeControls=(isPong||scene?.interaction)?[
        {key:'homeReactiveVisualizerArcadeMode',label:'Arcade play mode',description:'AI demonstration is the default. Human matches wait for intentional right-stick movement after closing Quick Menu.',options:[['ai_ai','AI Demo (default)'],['player_ai','Player vs AI'],['player_player',coopGame?'Two Players • Co-op':turnGame?'Two Players • Turns':'Two Players • Versus'],['solo','Single Player']].filter(([id])=>allowedModes.includes(id))},
        {key:'homeReactiveVisualizerArcadePlayerSide',label:'First controller team',description:'Player one controls the left or right team color. Second controller takes the opposite team.',options:[['left','Left team'],['right','Right team']]},
        {key:'homeReactiveVisualizerArcadePad1',label:'Player 1 controller',description:'Assign a detected physical or Steam Input controller. The slot number distinguishes identical PlayStation pads.',options:gtm419ControllerChoices()},
        {key:'homeReactiveVisualizerArcadePad2',label:'Player 2 controller',description:'Must be a DIFFERENT slot from Player 1. Unassigned Steam Deck controls are ignored.',options:gtm419ControllerChoices()},
        {key:'homeReactiveVisualizerArcadeDisconnectSec',label:'Controller disconnected countdown',description:'Freeze the match, show remaining time, then automatically return to AI vs AI.',options:[[5,'5 seconds'],[10,'10 seconds (default)'],[15,'15 seconds'],[30,'30 seconds']]},
        {key:'homeReactiveVisualizerArcadeHoldPauseMs',label:'Hold Y/Triangle to join or pause',description:'Each connected controller can hold Y/Triangle to claim P1 or P2 in supported games. Hold Y to pause/resume, then press X/Square while paused to return your slot to AI. Music continues.',options:[[650,'650 ms'],[800,'800 ms (default)'],[1000,'1000 ms']]}
    ]:[];
    const renderOption=option=>window.SP_REACT.createElement(DFL.PanelSectionRow,{key:option.key},
        window.SP_REACT.createElement(Gtm419SafeDropdown,{
            label:option.label,description:option.description,
            rgOptions:option.options.map(([value,label])=>({data:value,label})),
            selectedOption:settings[option.key],
            onChange:choice=>{const selected=typeof choice==='object'?choice?.data:choice;
                const found=option.options.find(([value])=>String(value)===String(selected));
                if(found)void updateSettings(option.key,found[0]);}
        }));
    return window.SP_REACT.createElement(PremiumSection,{title:section==='controllers'?'Controller Assignments':section==='powers'?'Powers & Actions':section==='tournament'?'Championship':section==='scenery'?'Scenery & Customization':section==='diagnostics'?'Performance & Diagnostics':'Arcade Play & Recovery'},
        ...(section==='controllers'?arcadeControls.map(renderOption):[]),
        ...(section==='controllers'&&(isPong||scene?.interaction)?[1,2].map(n=>{
            const key=n===1?'homeReactiveVisualizerArcadePad1':'homeReactiveVisualizerArcadePad2';
            const devices=gtm419AvailablePads();
            const current=devices.find(d=>d.index===Number(settings[key]));
            return window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-cycle-'+n},
                window.SP_REACT.createElement(DFL.ButtonItem,{
                    label:'Player '+n+' • '+(current?gtm419PadLabel(current):'Disconnected / unassigned'),
                    description:'Cycle connected controllers without closing the Controllers section. Right-stick input identifies a device.',
                    onClick:()=>{const choices=devices.filter(d=>n!==2||d.index!==Number(settings.homeReactiveVisualizerArcadePad1));
                        if(!choices.length)return;const pos=choices.findIndex(d=>d.index===Number(settings[key]));
                        void updateSettings(key,choices[(pos+1)%choices.length].index);}
                },'Next controller ▶'));
        }):[]),
        (section==='controllers')&&(isPong||scene?.interaction)&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-input-status'},
            window.SP_REACT.createElement('div',{style:{padding:'7px 9px',background:'rgba(5,11,25,.93)',color:'#f3f8ff',borderRadius:7,fontSize:12}},
                'Controller bridge · '+gtm419AvailablePads().length+
                ' detected · '+(gtm418Session(isPong?'neon_pong':'program:'+scene.id).takeover?'AI takeover active':
                gtm418Session(isPong?'neon_pong':'program:'+scene.id).manualPause?'Game paused':'Ready / AI default'))),
        (section==='controllers')&&(isPong||scene?.interaction)&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-controls-help'},
            window.SP_REACT.createElement('div',{style:{padding:'8px 10px',borderRadius:8,background:'rgba(2,7,19,.95)',color:'#fff',lineHeight:1.5}},
                'GAME CONTROLS · Right stick moves. Pong: RB arm next Power Shot BEFORE a return, LB deflect incoming ball, LT precision, RT boost, X dash; hold Y/Triangle on each controller to claim P1/P2, then hold to pause/resume. When paused, press X/Square to return that slot to AI. Packs may remap actions. A/Cross is Quick Menu only.')),
        (section==='play')&&(isPong||scene?.interaction)&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-pause'},
            window.SP_REACT.createElement(DFL.ButtonItem,{label:'Pause / Resume Game',description:'Only gameplay pauses; music continues.',
                onClick:()=>{gtm418TogglePause(isPong?'neon_pong':'program:'+scene.id);setEpoch(n=>n+1);}},
                gtm418Session(isPong?'neon_pong':'program:'+scene.id).manualPause?'Resume Game':'Pause Game')),
        (section==='play')&&(isPong||scene?.interaction)&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-take-control'},
            window.SP_REACT.createElement(DFL.ButtonItem,{label:'Take Control / Reconnect',description:'When selecting a human mode, move right stick to begin a 15-second ready countdown. After AI takeover, move the assigned right stick twice to reclaim.',
                onClick:()=>{gtm418Rearm(isPong?'neon_pong':'program:'+scene.id);setEpoch(n=>n+1);}},'Take Control')),
        (section==='powers')&&(isPong||scene?.interaction)&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-p1-action'},
            window.SP_REACT.createElement(DFL.ButtonItem,{label:'Player 1 · '+(isPong?'Power':'Action'),description:'Press A here to trigger the pack action. A is not bound during gameplay.',
                onClick:()=>gtm418DispatchMenuAction(1,isPong?'neon_pong':'program:'+scene.id)},'Activate P1')),
        (section==='powers')&&(isPong||scene?.interaction?.modes?.includes('player_player'))&&window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'arcade-p2-action'},
            window.SP_REACT.createElement(DFL.ButtonItem,{label:'Player 2 · '+(isPong?'Power':'Action'),description:'Press A in Quick Menu to dispatch player 2 action.',
                onClick:()=>gtm418DispatchMenuAction(2,isPong?'neon_pong':'program:'+scene.id)},'Activate P2')),

        (section==='diagnostics')&&isPong&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement('div',{style:{padding:'6px 9px',background:'rgba(2,6,19,.90)',
                color:'#e9f5ff',borderRadius:7,fontSize:12,lineHeight:'1.4',border:'1px solid rgba(128,172,233,.38)'}},
                'LIVE PERFORMANCE · '+performanceLine)),
        ...((section==='scenery'||section==='powers')?(scene?.options||[]).filter(option=>section==='scenery'?option.id==='blackhole':option.id!=='blackhole'):[]).map(option=>window.SP_REACT.createElement(DFL.PanelSectionRow,{key:'pack-option-'+option.id},
            window.SP_REACT.createElement(Gtm419SafeDropdown,{label:option.label,
                description:'Pack-provided setting. Saved per visualizer without a core upgrade.',
                rgOptions:option.choices.map(choice=>({data:choice.value,label:choice.label})),
                selectedOption:gtm418ProgramOptionValue(scene,option),onChange:choice=>{
                    const selected=typeof choice==='object'?choice?.data:choice;
                    if(gtm418SaveProgramOption(scene,option,Number(selected)))setEpoch(n=>n+1);
                }}))),
        ...(behavior?.options||[]).filter(option=>{const k=option.key||'';return section==='tournament'?/Goal|Series|PauseSec|Difficulty|Mode|HumanSpeed|BallSpeed/.test(k):section==='scenery'?/Arena|Background|BgColor|BgAccent|BgReactivity|HudSize|Style|TeamPalette|LeftFx|RightFx|FxLevel/.test(k):false;}).map(option=>window.SP_REACT.createElement(DFL.PanelSectionRow,{key:option.key},
            window.SP_REACT.createElement(Gtm419SafeDropdown,{
                label:option.label,description:option.description,
                rgOptions:option.options.map(([value,label])=>({data:value,label})),
                selectedOption:settings[option.key],
                onChange:choice=>{
                    const selected=typeof choice==='object'?choice?.data:choice;
                    const matched=option.options.find(([value])=>String(value)===String(selected));
                    if(matched)void updateSettings(option.key,matched[0]);
                }
            }))),
        (section==='scenery')&&isPong&&settings.homeReactiveVisualizerPongTeamPalette==='custom'&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
                window.SP_REACT.createElement(DFL.TextField,{label:'Left team #RRGGBB',value:leftHex,onChange:e=>setLeftHex(e.target.value)}),
                window.SP_REACT.createElement(DFL.TextField,{label:'Right team #RRGGBB',value:rightHex,onChange:e=>setRightHex(e.target.value)}))),
        (section==='scenery')&&isPong&&settings.homeReactiveVisualizerPongTeamPalette==='custom'&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement(PremiumActionField,{label:'Apply custom team colors',description:message||'Six-digit hexadecimal colors. Match scores remain untouched.',action:'Apply colors',onClick:async()=>{
                if(!/^#[0-9a-fA-F]{6}$/.test(leftHex)||!/^#[0-9a-fA-F]{6}$/.test(rightHex)){
                    setMessage('Enter colors in #RRGGBB format.');return;}
                await updateSettings('homeReactiveVisualizerPongLeftColor',leftHex);
                await updateSettings('homeReactiveVisualizerPongRightColor',rightHex);
                setMessage('Team colors updated. Championship preserved.');}})),
        (section==='scenery')&&isPong&&settings.homeReactiveVisualizerPongBackgroundColors==='custom'&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
                window.SP_REACT.createElement(DFL.TextField,{label:'Scenery base #RRGGBB',value:bgHex,onChange:e=>setBgHex(e.target.value)}),
                window.SP_REACT.createElement(DFL.TextField,{label:'Scenery accent #RRGGBB',value:accentHex,onChange:e=>setAccentHex(e.target.value)}))),
        (section==='scenery')&&isPong&&settings.homeReactiveVisualizerPongBackgroundColors==='custom'&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement(PremiumActionField,{label:'Apply scenery colors',description:message||'Sets both arena colors; does not reset match scores.',action:'Apply scenery',onClick:async()=>{
                if(!/^#[0-9a-fA-F]{6}$/.test(bgHex)||!/^#[0-9a-fA-F]{6}$/.test(accentHex)){
                    setMessage('Enter valid six-digit hex colors.');return;}
                await updateSettings('homeReactiveVisualizerPongBgColor',bgHex);
                await updateSettings('homeReactiveVisualizerPongBgAccent',accentHex);
                setMessage('Arena colors updated. Championship preserved.');}})),
        (section==='tournament')&&isPong&&window.SP_REACT.createElement(DFL.PanelSectionRow,null,
            window.SP_REACT.createElement('div',{style:{padding:'7px 9px',border:'1px solid rgba(220,214,255,.28)',
                borderRadius:8,background:'rgba(5,8,20,.67)',color:'#f6f7ff'}},
                window.SP_REACT.createElement('div',{style:{fontWeight:800,fontSize:14}},'Championship live · '+summary),
                window.SP_REACT.createElement('div',{style:{fontSize:13,opacity:.95}},history?.champion?
                    `Championship resets in ${Math.ceil(history.reset)}s`:
                    history?.gameOver?`Next match begins in ${Math.ceil(history.gameOver)}s`:'Pong pauses when you switch to another scene.'),
                ...current.slice(-7).reverse().map((match,i)=>window.SP_REACT.createElement('div',
                    {key:i,style:{fontSize:13,opacity:.95,marginTop:5}},
                    `Match ${match.match}: ${match.winner==='left'?'LEFT':'RIGHT'} won ${match.left}-${match.right} · ${clock(match.duration)} · ${match.powers} powers`)),
                history?.previous&&window.SP_REACT.createElement('div',{style:{fontSize:11,marginTop:5,opacity:.82}},
                    `Previous championship: ${history.previous.winner.toUpperCase()} · ${history.previous.left}-${history.previous.right}`))));
}

// GTM 4.1.8 Universal Input + Arcade Session Bridge.
// Physical A/Cross is ALWAYS Steam/Quick Menu confirmation, never a gameplay input.
// All game actions are optional; AI vs AI remains the default.
const GTM418_ARCADE_MODES=Object.freeze(['ai_ai','player_ai','player_player','solo']);
const GTM418_SESSIONS=new Map();
const GTM418_MENU_ACTIONS=new Map();
const GTM418_NOW=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const GTM418_ZERO=()=>({x:0,y:0,lb:0,rb:0,lt:0,rt:0,xbtn:0,ybtn:0,a:0,connected:0,human:0,slot:-1});
const GTM418_CLAMP=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function gtm418Pads(){try{return typeof navigator!=='undefined'&&typeof navigator.getGamepads==='function'?Array.from(navigator.getGamepads()||[]):[];}catch(_){return [];}}
function gtm419AvailablePads(){return gtm418Pads().map((pad,index)=>pad&&pad.connected!==false?{index,pad,id:String(pad.id||'Unknown gamepad').slice(0,90)}:null).filter(Boolean);}
function gtm419PadLabel(device){if(!device)return 'Disconnected';const name=/steam deck|valve/i.test(device.id)?'Steam Deck':/xbox|xinput|045e/i.test(device.id)?'Xbox controller':/playstation|dualsense|dualshock|wireless controller|054c/i.test(device.id)?'PlayStation controller':device.id.slice(0,32);return `${name==='PlayStation controller'?'PS4/PS5':name==='Xbox controller'?'Steam Input/Xbox':name} · S${device.index+1}`;}
function gtm418Button(pad,index){const b=pad?.buttons?.[index];return b?.pressed?1:Math.max(0,Math.min(1,Number(b?.value)||0));}
function gtm418ReadPad(pad){
    if(!pad)return GTM418_ZERO();
    const axis=index=>{const n=Number(pad.axes?.[index])||0;return Math.abs(n)<.16?0:GTM418_CLAMP((n-Math.sign(n)*.16)/.84,-1,1);};
    return {x:axis(2),y:axis(3),lb:gtm418Button(pad,4),rb:gtm418Button(pad,5),
        lt:gtm418Button(pad,6),rt:gtm418Button(pad,7),xbtn:gtm418Button(pad,2),
        ybtn:0,a:0,connected:1,human:1};
}
function gtm418Session(key){
    if(!GTM418_SESSIONS.has(key)){
        if(GTM418_SESSIONS.size>=64)GTM418_SESSIONS.delete(GTM418_SESSIONS.keys().next().value);
        GTM418_SESSIONS.set(key,{key,request:'ai_ai',takeover:false,manualPause:false,missingAt:null,claimed:[false,false],intent:[{armed:false,pulses:0,first:0},{armed:false,pulses:0,first:0}],
            joined:false,baseMode:null,joinMode:null,joinSlot:null,joinHolds:new Map(),joinOwners:[null,null],readyAccepted:[false,false],manualReleased:[false,false],joinUsed:new Map(),squareHeld:new Map(),handoffAt:0,handoffPlayer:0,readyPhase:'playing',readyAt:null,selectedAt:0,hold:[{start:null,used:false,shortUntil:0},{start:null,used:false,shortUntil:0}]});
    }
    return GTM418_SESSIONS.get(key);
}
function gtm418Rearm(key){const s=gtm418Session(key);s.takeover=false;s.missingAt=null;s.joined=false;s.claimed=[false,false];s.intent=[{armed:false,pulses:0,first:0},{armed:false,pulses:0,first:0}];return true;}
function gtm418TogglePause(key){const s=gtm418Session(key);s.manualPause=!s.manualPause;return s.manualPause;}
function gtm418SetPause(key,paused){gtm418Session(key).manualPause=Boolean(paused);}
function gtm418DispatchMenuAction(player,key){
    if(player!==1&&player!==2)return false;
    GTM418_MENU_ACTIONS.set(key+':'+player,GTM418_NOW()+1200);return true;
}
function gtm418ConsumeMenuAction(player,key){
    const k=key+':'+player,t=GTM418_MENU_ACTIONS.get(k)||0;GTM418_MENU_ACTIONS.delete(k);
    return t>=GTM418_NOW()?1:0;
}
// 4.1.9: player slots are selected independently from the number of physical
// devices. Steam Deck + two BT controllers may expose three or more gamepads.
function gtm419DetectIntent(session,index,pad,now){
    const intent=session.intent[index]||(session.intent[index]={armed:false,pulses:0,first:0});
    if(!pad){intent.armed=false;intent.pulses=0;return false;}
    const x=Number(pad.axes?.[2])||0,y=Number(pad.axes?.[3])||0;
    const strength=Math.hypot(x,y);
    if(strength<.19){intent.armed=true;return false;}
    if(!intent.armed||strength<.52)return false;
    intent.armed=false;
    if(now-intent.first>3000){intent.pulses=0;intent.first=now;}
    intent.pulses++;
    if(intent.pulses<2)return false;
    intent.pulses=0;intent.first=now;return true;
}
function gtm419ControllerChoices(){
    const visible=gtm419AvailablePads();
    const candidates=visible.map(device=>[device.index,gtm419PadLabel(device)]);
    // Keep unconnected saved slots visible for explicit recovery, not as fake connected devices.
    return candidates.slice(0,10).length?candidates.slice(0,10):[[0,'No controller detected · Slot 1'],[1,'No controller detected · Slot 2']];
}
function gtm418ReadPlayers(settings={},allowed=GTM418_ARCADE_MODES,key='neon_pong'){
    const session=gtm418Session(key),now=GTM418_NOW();
    const preferred=GTM418_ARCADE_MODES.includes(settings.homeReactiveVisualizerArcadeMode)?settings.homeReactiveVisualizerArcadeMode:'ai_ai';
    if(session.baseMode!==preferred){
        session.baseMode=preferred;session.joinMode=null;session.joinSlot=null;
        session.joinHolds.clear();session.joinUsed.clear();session.joinOwners=[null,null];session.readyAccepted=[false,false];session.manualReleased=[false,false];session.squareHeld.clear();
        // Turning off an unclaimed or AI-owned controller does not cause takeover.
        session.joined=false;session.takeover=false;session.missingAt=null;
        // A different saved mode is not the same playing session.
        session.manualPause=false;session.readyPhase='playing';session.readyAt=null;
        session.handoffAt=0;session.joinNoticeAt=0;
    }
    const visiblePads=gtm419AvailablePads();
    const holdMs=[650,800,1000].includes(Number(settings.homeReactiveVisualizerArcadeHoldPauseMs))?Number(settings.homeReactiveVisualizerArcadeHoldPauseMs):800;
    // Claim a physical controller independently. First hold takes P1, second
    // takes P2 only when the active game supports local multiplayer. The
    // claims persist across game mode changes and never steal another slot.
    const supportsMulti=allowed.includes('player_player');
    const canJoin=allowed.includes('player_ai')||allowed.includes('solo')||supportsMulti;
    let joinChanged=false,releaseChanged=false,manualRejoined=false;
    for(const device of visiblePads){
        const id=String(device.pad.id||'Unknown device');
        const owned=session.joinOwners.findIndex(owner=>owner?.index===device.index&&owner.id===id);
        const pressed=Boolean(gtm418Button(device.pad,3));
        const used=session.joinUsed.get(device.index)||false;
        if(!pressed){session.joinHolds.delete(device.index);session.joinUsed.delete(device.index);}
        else if(!used){
            if(!session.joinHolds.has(device.index))session.joinHolds.set(device.index,now);
            if(now-session.joinHolds.get(device.index)>=holdMs){
                if(canJoin&&owned<0){
                    // A saved Player-vs-AI/Player-vs-Player preference is NOT
                    // permission to start a human game after a plugin reload.
                    // Only a held Y/Triangle claims a physical, eligible pad.
                    // In a manually selected mode, respect explicit assignments;
                    // in AI Demo, first claim takes P1 and second takes P2.
                    const assigned=[Number(settings.homeReactiveVisualizerArcadePad1??0),Number(settings.homeReactiveVisualizerArcadePad2??1)];
                    const target=preferred==='ai_ai'?
                        (session.joinOwners[0]===null?0:supportsMulti&&session.joinOwners[1]===null?1:-1):
                        device.index===assigned[0]&&session.joinOwners[0]===null?0:
                        preferred==='player_player'&&supportsMulti&&device.index===assigned[1]&&session.joinOwners[1]===null?1:-1;
                    if(target>=0){
                        session.joinOwners[target]={index:device.index,id};
                        session.readyAccepted[target]=false;
                        session.joinNoticeAt=now;session.joinPlayer=target+1;joinChanged=true;
                    }
                    session.joinUsed.set(device.index,true);
                }
                if(owned<0&&preferred!=='ai_ai'){
                    const assigned=[Number(settings.homeReactiveVisualizerArcadePad1??0),Number(settings.homeReactiveVisualizerArcadePad2??1)];
                    const slot=assigned.indexOf(device.index);
                    if(slot>=0&&session.manualReleased[slot]){
                        session.manualReleased[slot]=false;session.readyAccepted[slot]=false;session.joinUsed.set(device.index,true);
                        session.joinNoticeAt=now;session.joinPlayer=slot+1;manualRejoined=true;
                    }
                }
                // Existing human controller holds are handled by the pause
                // bridge below. Unassigned holds never pause another player.
            }
        }
        const square=Boolean(gtm418Button(device.pad,2));
        const priorSquare=session.squareHeld.get(device.index)||false;
        session.squareHeld.set(device.index,square);
        // Square gives ONLY THIS SLOT back to AI, and is completely inert
        // outside a user-paused game. No Bluetooth disconnect is necessary.
        if(square&&!priorSquare&&session.manualPause&&owned<0&&preferred!=='ai_ai'){
            const assigned=[Number(settings.homeReactiveVisualizerArcadePad1??0),Number(settings.homeReactiveVisualizerArcadePad2??1)];
            const slot=assigned.indexOf(device.index);
            if(slot>=0&&!session.manualReleased[slot]){
                session.manualReleased[slot]=true;session.readyAccepted[slot]=false;releaseChanged=true;
                session.handoffAt=now;session.handoffPlayer=slot+1;
                session.hold[slot]={start:null,used:false,shortUntil:0};
            }
        }
        if(square&&!priorSquare&&session.manualPause&&owned>=0){
            session.joinOwners[owned]=null;session.readyAccepted[owned]=false;
            session.joinHolds.delete(device.index);
            session.joinUsed.delete(device.index);
            session.handoffAt=now;session.handoffPlayer=owned+1;releaseChanged=true;
            session.ownership=[null,null];
            session.hold[owned]={start:null,used:false,shortUntil:0};
        }
    }
    // Keep ownership during the established 10-second disconnect grace period.
    // An unplugged pad cannot be controlled, and a different pad at the same
    // index is rejected by the ownership check below.
    if(!session.joinOwners.some(Boolean)&&releaseChanged){
        // Resume a pure AI demo when its final human exits.
        session.manualPause=false;
    }
    if(preferred!=='ai_ai'&&releaseChanged){
        const allReleased=preferred==='player_player'?session.manualReleased[0]&&session.manualReleased[1]:session.manualReleased[0];
        if(allReleased){session.manualPause=false;session.joined=false;
            session.takeover=false;session.missingAt=null;}
    }
    if(joinChanged||manualRejoined)session.matchJoinEpoch=(session.matchJoinEpoch||0)+1;
    const joinedCount=session.joinOwners.filter(Boolean).length;
    const joinedMulti=supportsMulti&&joinedCount===2;
    const joinedSingle=joinedCount===1;
    const joinMode=joinedMulti?'player_player':joinedSingle?
        (session.joinOwners[1]&&supportsMulti?'player_player':
        (allowed.includes('player_ai')?'player_ai':(allowed.includes('solo')?'solo':'player_player'))):null;
    // The persisted preference configures which humans MAY join, not who
    // has already joined. A fresh render always runs the AI demonstration.
    const requested=joinMode||(allowed.includes('ai_ai')?'ai_ai':allowed[0]);
    const joinDriven=joinedCount>0;
    if(manualRejoined){session.readyPhase='waiting';session.readyAt=null;session.selectedAt=now;}
    if(session.request!==requested){
        const fromDemo=session.request==='ai_ai';
        session.request=requested;gtm418Rearm(key);session.ownership=[null,null];
        // Clear pause only when the last human exits or a new human game
        // begins. In an ongoing P-vs-P match, handing P2 to AI must NOT
        // silently unpause the remaining human player's deliberate pause.
        if(requested==='ai_ai'||fromDemo)session.manualPause=false;
        session.readyPhase=requested==='ai_ai'||releaseChanged?'playing':'waiting';
        session.readyAt=null;session.selectedAt=now;
        // The joining Y/Triangle press must not immediately become Pause.
        for(const record of session.hold){record.start=null;record.used=true;record.shortUntil=0;}
    }
    const side=settings.homeReactiveVisualizerArcadePlayerSide==='right'?'right':'left';
    const pads=gtm418Pads();
    const selected=[session.joinOwners[0]?.index??Number(settings.homeReactiveVisualizerArcadePad1??0),session.joinOwners[1]?.index??Number(settings.homeReactiveVisualizerArcadePad2??1)];
    const get=i=>Number.isInteger(i)&&i>=0&&i<Math.min(pads.length,12)&&pads[i]&&pads[i].connected!==false?pads[i]:null;
    const rawP1=get(selected[0]),rawP2=selected[1]===selected[0]?null:get(selected[1]);
    session.ownership=session.ownership||[null,null];
    const validated=(pad,i)=>{
        if(!pad)return null;
        const id=String(pad.id||'Unknown device');
        const prior=session.ownership[i];
        // A different device at the same slot must not silently steal a team.
        if(prior&&prior.slot===selected[i]&&prior.id!==id)return null;
        if(!prior||prior.slot!==selected[i])session.ownership[i]={slot:selected[i],id};
        return pad;
    };
    const p1=validated(rawP1,0),p2=validated(rawP2,1);
    const humanMode=requested!=='ai_ai';
    const need2=requested==='player_player'||(joinDriven&&Boolean(session.joinOwners[1]));
    const ready=humanMode&&(joinDriven?
        session.joinOwners.every((owner,i)=>!owner||Boolean(i===0?p1:p2)):
        (session.manualReleased[0]||Boolean(p1))&&(!need2||session.manualReleased[1]||Boolean(p2)));
    // The 15-second ready countdown begins only after intentional right-stick
    // input, allowing players to close Decky's Quick Menu and get comfortable.
    // No countdown is applied to automatic AI demonstrations.
    if(!humanMode){session.readyPhase='playing';session.readyAt=null;
        session.missingAt=null;session.takeover=false;session.joined=false;}
    else if(!ready&&!session.takeover){session.readyPhase='waiting';session.readyAt=null;}
    else if(ready&&!session.takeover){
        const engaged=[joinDriven&&!session.joinOwners[0]?null:p1,need2?p2:null].some(pad=>pad&&
            Math.hypot(Number(pad.axes?.[2])||0,Number(pad.axes?.[3])||0)>.55);
        if(session.readyPhase==='waiting'&&engaged&&now-session.selectedAt>=260){
            session.readyPhase='countdown';session.readyAt=now;
        }
        if(session.readyPhase==='countdown'&&session.readyAt!==null&&now-session.readyAt>=15000){
            session.readyPhase='playing';session.readyAt=null;
        }
    }
    const activeHumanOwned=joinDriven?session.joinOwners.some(Boolean):
        !session.manualReleased[0]||(need2&&!session.manualReleased[1]);
    if(ready&&activeHumanOwned&&session.readyPhase==='playing'&&!session.joined&&!session.takeover){
        session.joined=true;session.missingAt=null;
        for(let i=0;i<2;i++)if(session.joinOwners[i])session.readyAccepted[i]=true;
    }
    // Explicit Take Control does not enter player mode unless assignments are valid.
    if(!ready&&humanMode&&!session.joined&&!session.takeover)session.warning='Assign connected controllers in the Arcade menu';
    else session.warning='';
    const lost=humanMode&&activeHumanOwned&&!ready&&session.joined&&!session.takeover;
    if(lost&&session.missingAt===null)session.missingAt=now;
    if(!lost&&ready)session.missingAt=null;
    const timeout=[5,10,15,30].includes(Number(settings.homeReactiveVisualizerArcadeDisconnectSec))?Number(settings.homeReactiveVisualizerArcadeDisconnectSec):10;
    const remaining=lost?Math.max(0,timeout-(now-session.missingAt)/1000):0;
    if(lost&&remaining<=0){
        if(joinDriven){
            // A disconnected joined slot becomes AI after the grace period.
            if(!p1&&session.joinOwners[0]){session.joinOwners[0]=null;session.readyAccepted[0]=false;}
            if(!p2&&session.joinOwners[1]){session.joinOwners[1]=null;session.readyAccepted[1]=false;}
            session.handoffAt=now;session.handoffPlayer=!p1?1:2;
            if(!session.joinOwners.some(Boolean))session.manualPause=false;
        }else {session.takeover=true;session.manualPause=false;}
        session.takeoverAt=now;session.missingAt=null;session.joined=false;session.claimed=[false,false];
    }
    const countdown=lost&&!session.takeover?Math.max(1,Math.ceil(remaining)):0;
    // After failover, only the previously assigned pads can reclaim their
    // original sides. Require two separate deliberate right-stick movements.
    if(session.takeover&&humanMode){
        if(!session.claimed[0]&&gtm419DetectIntent(session,0,p1,now)){
            session.claimed[0]=true;session.reclaimAt=now;session.reclaimPlayer=1;
        }
        if(need2&&!session.claimed[1]&&gtm419DetectIntent(session,1,p2,now)){
            session.claimed[1]=true;session.reclaimAt=now;session.reclaimPlayer=2;
        }
        // A reclaimed controller that disconnects again cannot keep moving.
        if(!p1)session.claimed[0]=false;
        if(!p2)session.claimed[1]=false;
    }
    // 4.3.2: Pong's AI exhibition must keep animating while a joining human
    // closes Quick Access and readies the controller. The 15-second ready-up
    // still applies, but does NOT freeze the ongoing AI rally in the meantime.
    // Other arcade games retain their original ready contract for this patch.
    const readyBlocking=humanMode&&activeHumanOwned&&!session.takeover&&session.readyPhase!=='playing';
    const demoDuringReady=key==='neon_pong'&&readyBlocking;
    // A P1 who was already playing should NOT lose control while P2 gets ready.
    // Only newly joining players stay AI-controlled during their readiness.
    const liveP1=!demoDuringReady||session.readyAccepted[0];
    const liveP2=!demoDuringReady||session.readyAccepted[1];
    const human1=humanMode&&liveP1&&Boolean(p1)&&(!joinDriven||Boolean(session.joinOwners[0]))&&!session.manualReleased[0]&&!countdown&&(!session.takeover||session.claimed[0]);
    const human2=need2&&liveP2&&Boolean(p2)&&(!joinDriven||Boolean(session.joinOwners[1]))&&!session.manualReleased[1]&&!countdown&&(!session.takeover||session.claimed[1]);
    let effective=human1&&human2?'player_player':human1||human2?'player_ai':'ai_ai';
    if(requested==='solo'&&human1)effective='solo';
    if(!allowed.includes(effective)&&!allowed.includes('ai_ai'))effective=allowed[0];
    const samples=[p1,p2].map((pad,i)=>{
        const current=gtm418ReadPad(pad),record=session.hold[i],pressed=Boolean(gtm418Button(pad,3));
        current.slot=selected[i];
        if(!humanMode||!pad||countdown||session.readyPhase!=='playing'||(session.takeover&&!session.claimed[i])||(i===1&&!need2)||
            (joinDriven&&!session.joinOwners[i])||session.manualReleased[i]){
            record.start=null;record.used=false;record.shortUntil=0;return current;
        }
        if(pressed){
            // A controller's claim hold cannot also count as its first pause.
            if(session.joinUsed.get(selected[i])){record.start=null;record.used=true;}
            else{
                if(record.start===null){record.start=now;record.used=false;}
                if(!record.used&&now-record.start>=holdMs){record.used=true;session.manualPause=!session.manualPause;}
            }
        }else if(record.start!==null){
            if(!record.used)record.shortUntil=now+85;record.start=null;record.used=false;
        }
        current.ybtn=now<(record.shortUntil||0)?1:0;
        return current;
    });
    const first=GTM418_ZERO(),second=GTM418_ZERO(),slot1=side==='left'?first:second,slot2=side==='left'?second:first;
    if(human1)Object.assign(slot1,samples[0]);
    if(human2)Object.assign(slot2,samples[1]);
    const readySeconds=session.readyPhase==='countdown'&&session.readyAt!==null?
        Math.max(1,Math.ceil((15000-(now-session.readyAt))/1000)):0;
    const readyWaiting=humanMode&&activeHumanOwned&&!session.takeover&&session.readyPhase==='waiting';
    const status=countdown?'CONTROLLER DISCONNECTED':
        readySeconds?`GET READY · ${readySeconds}`:
        readyWaiting?'WAITING FOR PLAYERS':
        session.handoffAt&&now-session.handoffAt<2200?`PLAYER ${session.handoffPlayer} RETURNED TO AI`:
        session.joinNoticeAt&&now-session.joinNoticeAt<1900?`PLAYER ${session.joinPlayer} JOINED · READY UP`:
        session.reclaimAt&&now-session.reclaimAt<2100?`PLAYER ${session.reclaimPlayer} RETURNED`:
        session.takeover&&now-(session.takeoverAt||0)<3100?'AI VS AI · AUTOMATIC TAKEOVER':
        session.manualPause?'GAME PAUSED':'';
    return {mode:effective,requested,side,left:first,right:second,numericMode:{ai_ai:0,player_ai:1,player_player:2,solo:3}[effective],
        human1,human2,pad1:selected[0],pad2:selected[1],manualPaused:session.manualPause,
        paused:session.manualPause||Boolean(countdown)||(readyBlocking&&!demoDuringReady),countdown,readySeconds,readyWaiting,takeover:session.takeover,
        needsController:humanMode&&!ready&&!session.takeover,status:status||session.warning,key,joinEpoch:session.matchJoinEpoch||0,available:gtm419AvailablePads().map(gtm419PadLabel),claimed:session.claimed.slice()};
}
// Use only on interactive game scenes. No listeners; never consumes or suppresses SteamUI events.
function gtm418DrawSessionStatus(ctx,w,h,session){
    if(!session||!session.status)return;
    const title=session.status,sub=session.countdown?`AI TAKEOVER IN ${session.countdown} SECONDS`:
        session.readySeconds?'AI KEEPS PLAYING UNTIL YOU ARE READY':
        session.readyWaiting?'CLOSE QUICK MENU · MOVE RIGHT STICK TO READY UP':
        session.takeover?'MOVE RIGHT STICK TWICE TO RETURN':
        session.manualPaused?'HOLD Y TO RESUME · SQUARE TO GIVE SLOT TO AI':'HOLD TRIANGLE / Y ON EACH CONTROLLER TO JOIN';
    // 4.3.3: Couch/TV users need a genuinely full-screen ready-up. This
    // overlay is DRAW-ONLY: it never changes the active AI simulation, score,
    // controller ownership, or ready-up countdown handled by the bridge.
    const readyScreen=session.key==='neon_pong'&&(session.readyWaiting||session.readySeconds)&&!session.manualPaused&&!session.countdown;
    if(readyScreen){
        ctx.save();
        try{
            ctx.fillStyle='rgba(2,7,19,.94)';ctx.fillRect(0,0,w,h);
            const mx=w*.045,my=h*.06,pw=w*.91,ph=h*.88;
            ctx.fillStyle='rgba(16,31,56,.93)';ctx.fillRect(mx,my,pw,ph);
            ctx.strokeStyle='#8fdfff';ctx.lineWidth=Math.max(2,h*.012);ctx.strokeRect(mx,my,pw,ph);
            ctx.textAlign='center';ctx.textBaseline='middle';
            const headline=session.readySeconds?`GET READY  ${session.readySeconds}`:'WAITING FOR PLAYERS';
            ctx.font=`900 ${Math.max(14,Math.round(h*.115))}px system-ui,sans-serif`;
            ctx.fillStyle='#ffffff';ctx.fillText(headline,w*.5,h*.33,pw*.94);
            ctx.font=`800 ${Math.max(12,Math.round(h*.088))}px system-ui,sans-serif`;
            ctx.fillStyle='#ffe29b';ctx.fillText('CLOSE QUICK MENU',w*.5,h*.53,pw*.94);
            ctx.fillStyle='#96ecff';ctx.fillText('MOVE RIGHT STICK TO READY UP',w*.5,h*.66,pw*.94);
            ctx.font=`700 ${Math.max(10,Math.round(h*.050))}px system-ui,sans-serif`;
            ctx.fillStyle='#c7daef';ctx.fillText('AI MATCH CONTINUES IN BACKGROUND',w*.5,h*.81,pw*.94);
        }finally{ctx.restore();}
        return;
    }
    ctx.save();ctx.fillStyle='rgba(2,7,19,.94)';ctx.fillRect(w*.27,h*.34,w*.46,h*.43);
    ctx.strokeStyle='#d7e5ff';ctx.lineWidth=Math.max(1,h*.009);ctx.strokeRect(w*.27,h*.34,w*.46,h*.43);
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`800 ${Math.max(11,Math.min(21,h*.17))}px sans-serif`;
    ctx.fillStyle='#fff';ctx.fillText(title,w*.5,h*.47,w*.43);
    ctx.font=`700 ${Math.max(10,Math.min(17,h*.115))}px sans-serif`;ctx.fillStyle='#ffdb86';ctx.fillText(sub,w*.5,h*.65,w*.43);
    ctx.restore();
}

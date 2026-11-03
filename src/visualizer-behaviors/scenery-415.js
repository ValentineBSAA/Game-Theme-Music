// GTM 4.1.5: trusted, bounded scenery renderer.
// 4.1.7 re-art direction: distinct worlds, stable ambient motion, music accents only.
// Shared by built-in and validated pack scenes. No scripts, shaders, external images.
const GTM415_SCENERY=new Set(['solid','arcade','storm','stars','nebula','aurora','ocean','sunset','forest','city']);
function gtm415DrawSceneBackground(ctx,w,h,scene,settings,frame,data){
    const pong=scene.layers.some(layer=>layer.effect==='neon_pong');
    if(!pong&&!scene.background)return;
    const raw=scene.background||{style:'arcade',base:'#07152b',accent:'#36b8ff',motion:1,density:1,reactivity:1};
    const override=pong&&settings?.homeReactiveVisualizerPongArena!=='scene'&&GTM415_SCENERY.has(settings?.homeReactiveVisualizerPongArena);
    const style=override?settings.homeReactiveVisualizerPongArena:raw.style||'solid';
    const custom=pong&&settings?.homeReactiveVisualizerPongBackgroundColors==='custom';
    const validHex=s=>typeof s==='string'&&/^#[0-9a-fA-F]{6}$/.test(s);
    const bg=validHex(custom?settings.homeReactiveVisualizerPongBgColor:raw.base)?
        (custom?settings.homeReactiveVisualizerPongBgColor:raw.base):'#081126';
    const edge=validHex(custom?settings.homeReactiveVisualizerPongBgAccent:raw.accent)?
        (custom?settings.homeReactiveVisualizerPongBgAccent:raw.accent):'#7aa9ff';
    const clamp=(v,min=0,max=1)=>Number.isFinite(v)?Math.min(max,Math.max(min,v)):min;
    const density=clamp(Number(raw.density??1),.3,1.5);
    const motion=clamp(Number(raw.motion??1),0,1);
    // Motion always follows real elapsed time; music does not affect position,
    // scroll rate or global scale. Low-pass the audio to avoid flicker/jumps.
    const t=Math.max(0,Number(frame?.elapsed)||0)*motion;
    const packet=(data?.live&&typeof data==='object')?data:{};
    const user=({off:0,subtle:.11,balanced:.24,dynamic:.46}[settings?.homeReactiveVisualizerPongBgReactivity]??.24);
    const response=clamp(Number(raw.reactivity??1),0,1.5)*(pong?user:.24);
    const dt=clamp(Number(frame?.physicsDt??frame?.wallDt??.033),.005,.25);
    const lerp=1-Math.exp(-dt/0.52);
    const audio=frame.sceneryAudio||(frame.sceneryAudio={lo:0,mid:0,hi:0,beat:0});
    for(const [key,name] of [['lo','low'],['mid','mid'],['hi','high'],['beat','beat']]){
        const target=packet.live?clamp(Number(packet[name]))*response:0;
        audio[key]+=(target-audio[key])*lerp;
    }
    const lo=audio.lo,mid=audio.mid,hi=audio.hi,beat=audio.beat;
    const pulse=1+lo*.075;
    const seed=n=>{const s=Math.sin(n*78.233+1.3)*43758.5453;return s-Math.floor(s);};
    const alpha=(n)=>{ctx.globalAlpha=clamp(n,0,.88);};
    const line=(x1,y1,x2,y2,n=.3,size=1)=>{
        alpha(n);ctx.strokeStyle=edge;ctx.lineWidth=size;
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    };
    const haze=(x,y,r,n)=>{
        // At most two radial gradients per frame in any scenery.
        const g=ctx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,edge);g.addColorStop(1,'rgba(0,0,0,0)');
        alpha(n);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
    };
    // First draw operation is an opaque fill, preserving anti-white-flash rule.
    const gradient=ctx.createLinearGradient(0,0,0,h);
    gradient.addColorStop(0,bg);gradient.addColorStop(1,'#030713');
    ctx.fillStyle=gradient;ctx.globalAlpha=1;ctx.fillRect(0,0,w,h);
    ctx.save();
    try {
    ctx.lineCap='round';ctx.lineJoin='round';
    const quality=clamp(Number(frame?.sceneryQuality??1),.6,1);
    if(style==='solid'){
        haze(w*.5,h*.72,h*1.55,.12+lo*.25);
    }else if(style==='arcade'){
        // Perspective floor and horizon, always visible even with no music.
        const y=h*.53;haze(w*.5,y,h*1.5,.23+lo*.4);
        line(0,y,w,y,.76,2);
        for(let i=0;i<=16;i++)line(w*.5,y,w*i/16,h,.24+hi*.16,1.2);
        for(let i=0;i<6;i++){
            const p=((i/6+t*.035)%1);const yy=y+(h-y)*p*p;
            line(0,yy,w,yy,.24+lo*.3,1.3);
        }
        alpha(.36+hi*.22);ctx.strokeStyle=edge;ctx.lineWidth=1.1;
        ctx.strokeRect(w*.045,h*.26,w*.91,h*.70);
    }else if(style==='storm'){
        // Large layered cloud silhouettes and a slowly moving rain sheet.
        haze(w*.72,h*.30,h*1.45,.24+lo*.2);
        for(let layer=0;layer<3;layer++){
            const bandY=h*(.47+layer*.145),offset=Math.sin(t*(.10+layer*.036))*.036*w;
            ctx.beginPath();ctx.moveTo(0,bandY+h*.07);
            for(let j=0;j<=14;j++){
                const x=(j/14)*w;
                const shape=Math.sin(j*.83+layer*1.8)*h*.095+Math.cos(j*1.81+layer)*h*.042;
                ctx.lineTo(x,bandY+shape+offset*.03);
            }
            ctx.lineTo(w,0);ctx.lineTo(0,0);ctx.closePath();
            alpha(.22+layer*.07+lo*.09);ctx.fillStyle=layer===0?'#101b3b':layer===1?'#2b3657':'#45506f';ctx.fill();
        }
        const drops=Math.round(44*density*quality);
        for(let i=0;i<drops;i++){
            const x=((seed(i+4)+t*(.024+seed(i+10)*.024))%1)*w;
            const y=((seed(i+51)+t*(.19+seed(i+40)*.12))%1)*h;
            line(x,y,x-h*.045,y+h*.24,.13+hi*.16,1);
        }
        // A periodic, LOCALIZED bolt. Never strobe the full screen and never
        // beat-spam. Wide dark cloud gaps make the bolt legible from a couch.
        const phase=(t+1.4)%3.7;
        if(phase<.82){
            const strength=(1-phase/.82)*(.82+lo*.14);
            const x=w*(.30+seed(Math.floor((t+1.4)/3.7)+110)*.4);
            const y=h*.35;
            ctx.strokeStyle='#f6f6ff';ctx.lineWidth=Math.max(2,h*.019);
            alpha(.52+.37*strength);
            ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-h*.12,y+h*.27);
            ctx.lineTo(x+h*.055,y+h*.37);ctx.lineTo(x-h*.11,y+h*.64);
            ctx.lineTo(x+h*.09,y+h*.8);ctx.stroke();
            haze(x,h*.45,h*.62,.14+strength*.19);
        }
        line(0,h*.88,w,h*.88,.23,1.2);
    }else if(style==='stars'||style==='nebula'||style==='aurora'){
        if(style==='nebula'){
            haze(w*.35+Math.sin(t*.09)*w*.04,h*.54,h*2.3,.23+lo*.25);
            haze(w*.72,h*.2,h*1.35,.15+mid*.20);
        }else if(style==='aurora'){
            haze(w*.52,h*.45,h*2.2,.21+lo*.15);
            ctx.strokeStyle=edge;
            for(let k=0;k<3;k++){
                ctx.lineWidth=h*(.09+k*.02);alpha(.10+k*.05+mid*.20);
                ctx.beginPath();for(let j=0;j<=16;j++){
                    const x=w*j/16;
                    const y=h*(.30+k*.15)+Math.sin(j*.39+t*.28+k)*h*.10;
                    j?ctx.lineTo(x,y):ctx.moveTo(x,y);
                }ctx.stroke();
            }
        }
        const count=Math.round((style==='stars'?122:62)*density*quality);
        for(let i=0;i<count;i++){
            const depth=.3+seed(i+200)*.7;
            const x=((seed(i+25)+t*(.0022+depth*.0033))%1)*w;
            const y=((seed(i+81)+t*(.002+depth*.0038))%1)*h;
            const blink=.5+.5*Math.sin(t*(.7+seed(i+13)*1.6)+i*1.8);
            alpha(.45+blink*.37+hi*.13);
            ctx.fillStyle=i%7===0?edge:'#e3efff';
            const r=Math.max(1.5,h*(i%9===0?.031:.016));ctx.fillRect(x,y,r,r);
        }
        if(style==='stars'){
            // Prominent nearby planet and comets distinguish this from nebula.
            const x=w*.80,y=h*.71,r=h*.28*pulse;
            haze(x,y,r*2.7,.19+lo*.2);
            ctx.fillStyle=edge;alpha(.58+mid*.13);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle='#e1edff';ctx.lineWidth=1.8;alpha(.62);
            ctx.beginPath();ctx.ellipse(x,y,r*1.8,r*.44,-.18,0,Math.PI*2);ctx.stroke();
            for(let k=0;k<2;k++){
                const u=(seed(k+305)+t*(.017+k*.011))%1;
                line(u*w,h*(.24+k*.27),u*w-w*.055,h*(.29+k*.27),.42+hi*.2,2);
            }
        }
    }else if(style==='ocean'){
        haze(w*.77,h*.35,h*1.4,.23+lo*.2);
        ctx.beginPath();ctx.arc(w*.77,h*.30,h*.24,0,Math.PI*2);
        ctx.fillStyle='#d8e5fc';alpha(.36);ctx.fill();
        for(let i=0;i<9;i++){
            ctx.beginPath();const yy=h*(.42+i*.066);
            for(let j=0;j<=26;j++){
                const x=w*j/26,dy=Math.sin(j*.45+i*.7+t*.5)*h*.017;
                j?ctx.lineTo(x,yy+dy):ctx.moveTo(x,yy+dy);
            }ctx.lineWidth=1+i*.08;ctx.strokeStyle=edge;alpha(.22+i*.025+hi*.18);ctx.stroke();
        }
    }else if(style==='sunset'){
        haze(w*.76,h*.45,h*1.65,.27+lo*.23);
        ctx.fillStyle=edge;alpha(.55+mid*.18);ctx.beginPath();ctx.arc(w*.76,h*.44,h*.27,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#020b1d';alpha(.87);ctx.beginPath();ctx.moveTo(0,h);
        for(let i=0;i<=24;i++){const x=i*w/24;ctx.lineTo(x,h*(.78+Math.sin(i*.47)*.12));}
        ctx.lineTo(w,h);ctx.fill();
        for(let i=0;i<7;i++)line(0,h*(.87+i*.021),w,h*(.87+i*.021),.09+hi*.16);
    }else if(style==='forest'){
        haze(w*.72,h*.49,h*1.45,.20+lo*.2);
        ctx.fillStyle='#d1e4ff';alpha(.43);ctx.beginPath();ctx.arc(w*.72,h*.26,h*.17,0,Math.PI*2);ctx.fill();
        for(let i=0;i<27;i++){
            const x=w*i/26,treeH=h*(.25+seed(i+5)*.42);
            ctx.fillStyle='#051522';alpha(.79);ctx.beginPath();ctx.moveTo(x,h*.98-treeH);
            ctx.lineTo(x-w*.024,h*.98);ctx.lineTo(x+w*.024,h*.98);ctx.fill();
        }
        for(let i=0;i<10;i++){
            const x=((seed(i+90)+t*.0025)%1)*w,y=(seed(i+120)+Math.sin(t*.25+i)*.025)*h;
            ctx.fillStyle=edge;alpha(.28+hi*.3);ctx.fillRect(x,y,2,2);
        }
    }else if(style==='city'){
        haze(w*.55,h*.60,h*1.3,.20+lo*.2);
        for(let i=0;i<27;i++){
            const x=w*i/27,bw=w/27,hh=h*(.21+seed(i+18)*.51);
            ctx.fillStyle='#020919';alpha(.9);ctx.fillRect(x,h-hh,bw*.96,hh);
            for(let j=0;j<3;j++){
                const y=h-hh+h*.048+j*h*.057;
                if(y<h*.96){ctx.fillStyle=edge;alpha(.33+hi*.35);ctx.fillRect(x+bw*.24,y,bw*.12,2);}
            }
        }
    }
    } finally {ctx.restore();ctx.globalAlpha=1;}
}

// GTM 3.8.0 — Retro Ambient: public, lightweight, CPU-Canvas2D release.
// All modes use the existing passive GTM audio telemetry. No WebGL, overlays,
// fullscreen showcase, extra audio stream or playback changes.
const GTM_RETRO_SCENES = ['ambience','alchemy','ribbons','plasma','scope','starlight','kaleidoscope','bassfloor','pulseengine','skyline','arc','resonance'];
function gtmRetroDraw(canvas,mode,data,paletteName,theme,visual) {
    const ctx=canvas?.getContext?.('2d',{alpha:true,desynchronized:true});
    if(!ctx)return;
    const cw=Math.max(1,canvas.clientWidth||window.innerWidth||1280),ch=Math.max(1,canvas.clientHeight||90);
    const dpr=Math.min(1.35,window.devicePixelRatio||1,1300/cw);
    const w=Math.max(1,Math.round(cw*dpr)),h=Math.max(1,Math.round(ch*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    ctx.clearRect(0,0,w,h);
    const pi=Math.PI,tau=pi*2;
    const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,Number(n)||0));
    const live=Boolean(data?.live),lo=live?clamp(data.low):0,
        mi=live?clamp(data.mid):0,hi=live?clamp(data.high):0,
        onset=live?clamp(data.beat):0,rms=live?clamp(data.rms):0;
    const bands=Array.isArray(data?.bands)?data.bands:Array(12).fill(0);
    const t=live?(data.time||0)/1000:0;
    const sensitivity=clamp((visual?.reactivity??100)/100,.35,1.75);
    const luminance=clamp((visual?.brightness??120)/120,.4,2.1)*
        (visual?.intensity==='soft'?.82:visual?.intensity==='ultra'?1.22:visual?.intensity==='normal'?.98:1.12);
    const impact=clamp((visual?.beatBoost??125)/125,0,1.65);
    const bass=clamp(lo*sensitivity*1.55),mids=clamp(mi*sensitivity*1.35),treble=clamp(hi*sensitivity*1.4);
    const beat=clamp((onset*.86+Math.max(0,lo-rms*.42)*.52)*impact);
    const energy=clamp((lo*.48+mi*.36+hi*.16)*sensitivity);
    const alphaMul=visual?.coverage==='blend'?.92:1;
    const pal=(fraction)=>gtmV371PaletteColor(paletteName,fraction,theme).map(v=>Math.round(clamp(v)*255));
    const p0=pal(.08),p1=pal(.38),p2=pal(.68),p3=pal(.94),white=[246,250,255];
    const spectrum=(u)=>clamp(bands[Math.min(11,Math.floor(Math.max(0,Math.min(.9999,u))*12))]||0);
    const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${clamp(a*alphaMul)})`;
    const noise=(i,seed=0)=>{const x=Math.sin((i+seed*738.17)*127.17)*43758.5453;return x-Math.floor(x);};
    const glow=(x,y,r,c,a)=>{if(r<.5||a<=0)return;const q=ctx.createRadialGradient(x,y,0,x,y,r);
        q.addColorStop(0,rgba(c,clamp(a*luminance)));q.addColorStop(.22,rgba(c,a*.43*luminance));q.addColorStop(1,rgba(c,0));
        ctx.fillStyle=q;ctx.fillRect(x-r,y-r,r*2,r*2);};
    const stroke=(c,a,lw=1)=>{ctx.strokeStyle=rgba(c,a*luminance);ctx.lineWidth=lw;ctx.stroke();};
    const dot=(x,y,r,c,a)=>{ctx.beginPath();ctx.arc(x,y,Math.max(.25,r),0,tau);ctx.fillStyle=rgba(c,a*luminance);ctx.fill();};
    const path=(points)=>{ctx.beginPath();for(let i=0;i<points.length;i++){const [x,y]=points[i];i?ctx.lineTo(x,y):ctx.moveTo(x,y);}};
    ctx.lineCap='round';ctx.lineJoin='round';
    // Visual palette remains theme-controlled. Starlight adds spectral accents
    // only when Auto/Prism/Rainbow is selected so user-chosen solid colors win.
    const multicolor=['auto','prism','rainbow'].includes(paletteName);
    const starColor=(u)=>multicolor?gtmV371Hsl((u+.05)%1,.94,.64).map(v=>Math.round(v*255)):pal(u);
    const baseline=h*.84;
    if(mode==='starlight'){
        // STELLAR NUCLEUS: 3-dimensional-looking orbit shells, bright multicolor
        // star dust, a luminous core and short-lived bass shock rings. No static
        // background dots masquerading as rhythmic output.
        const cx=w*.51,cy=h*.50,scale=h*(.28+bass*.10+beat*.10);
        ctx.globalCompositeOperation='screen';
        glow(cx,cy,scale*3.3,p1,.21+energy*.23+beat*.15);
        glow(cx,cy,scale*2.1,starColor(.05),.29+bass*.45);
        for(let i=0;i<205;i++){
            const depth=.16+noise(i,9)*.84;
            const x=(noise(i,2)*w+t*(4+depth*10))%w;
            const y=h*(.10+noise(i,3)*.8);
            const tw=.45+.55*Math.sin(t*(1.3+noise(i,11)*2.1)+i*3.13)**2;
            const c=starColor(noise(i,7));
            const bright=(.16+depth*.43+treble*.22)*tw;
            if(i%8===0)glow(x,y,2.0+depth*2,c,bright*.7);
            dot(x,y,.32+depth*1.15+treble*.24,c,bright);
        }
        // Three independently tilted, rotating dust orbits; transform positions
        // rather than rotating the canvas, ensuring anti-aliased stable motion.
        for(let shell=0;shell<3;shell++){
            const tilt=[.30,-.48,.69][shell],r=scale*(1.8+shell*.59);
            const phase=t*(.15+shell*.045)*(shell%2?-1:1)+shell*1.1;
            const ct=Math.cos(tilt),st=Math.sin(tilt);
            ctx.beginPath();
            for(let j=0;j<=96;j++){
                const a=j*tau/96+phase;
                const x=cx+r*(Math.cos(a)*ct-Math.sin(a)*st*.38);
                const y=cy+r*(Math.cos(a)*st*.43+Math.sin(a)*ct*.30);
                j?ctx.lineTo(x,y):ctx.moveTo(x,y);
            }
            stroke(starColor(shell*.30),.15+energy*.13+beat*.14,1.0+shell*.25);
            for(let j=0;j<68;j++){
                const a=j*tau/68+phase+.13*Math.sin(j*1.13);
                const irregular=(.80+noise(j,shell)*.36);
                const x=cx+r*irregular*(Math.cos(a)*ct-Math.sin(a)*st*.38);
                const y=cy+r*irregular*(Math.cos(a)*st*.43+Math.sin(a)*ct*.30);
                const c=starColor((j/68+shell*.19)%1);
                const z=.5+.5*Math.sin(a+shell);
                dot(x,y,.45+z*.9+beat*.3,c,.34+z*.37+treble*.17);
                if(j%15===0)glow(x,y,2.8,c,.14+beat*.16);
            }
        }
        // Gold-white nucleus with chromatic envelope.
        glow(cx,cy,scale*1.14,starColor(.88),.48+beat*.43);
        glow(cx,cy,scale*.72,white,.54+bass*.37);
        dot(cx,cy,1.7+beat*2.8,white,.86);
        if(beat>.14){
            ctx.beginPath();ctx.ellipse(cx,cy,scale*(1.1+beat*1.7),scale*(.36+beat*.38),0,0,tau);
            stroke(starColor(.24),.10+beat*.33,1.1+beat*1.4);
        }
        // Musical transient meteor tails are discreet, not constantly flashing.
        for(let j=0;j<3;j++){
            const sweep=(t*.19+j*.37)%1;
            if(sweep>.67){const x=w*(.12+.76*sweep),y=h*(.2+j*.23),c=starColor(j*.31);
                ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-w*(.035+beat*.065),y+h*.10);
                stroke(c,.13+treble*.28+beat*.28,.8+beat);}
        }
        ctx.globalCompositeOperation='source-over';
    }else if(mode==='ambience'){
        // Retro WMP Ambience with broad moving curtains and jewel-like glints.
        ctx.globalCompositeOperation='screen';
        for(let layer=0;layer<6;layer++){
            const c=[p0,p1,p2,p3,p0,white][layer],ph=t*(.23+layer*.065)+layer*1.32;
            const by=h*(.39+layer*.062),amp=h*(.075+energy*.21+beat*.07);
            ctx.beginPath();ctx.moveTo(0,h);
            for(let x=0;x<=w+9;x+=9){const v=.66*Math.sin(x/w*tau*(1.0+layer*.21)+ph)+.34*Math.sin(x/w*tau*2.3-ph*.5);
                ctx.lineTo(x,by+v*amp);}
            ctx.lineTo(w,h);ctx.closePath();
            const gr=ctx.createLinearGradient(0,by-amp,0,h);
            gr.addColorStop(0,rgba(c,(.13+energy*.22+beat*.07)*luminance));gr.addColorStop(.7,rgba(c,.10+energy*.08));gr.addColorStop(1,rgba(c,0));
            ctx.fillStyle=gr;ctx.fill();
            ctx.beginPath();for(let x=0;x<=w+9;x+=9){const v=.66*Math.sin(x/w*tau*(1.0+layer*.21)+ph)+.34*Math.sin(x/w*tau*2.3-ph*.5);
                x?ctx.lineTo(x,by+v*amp):ctx.moveTo(x,by+v*amp);}
            stroke(c,.23+energy*.34,1+energy*.65);
        }
        for(let i=0;i<35;i++){const x=noise(i,13)*w,y=h*(.23+noise(i,12)*.66),tw=.5+.5*Math.sin(t*(.45+noise(i,11)) + i);
            dot(x,y,.65+tw*.75,[p0,p1,p2,p3][i%4],.10+treble*.22+tw*.12);}
        glow(w*.5,h*.77,w*.28,p2,.12+energy*.2);
        ctx.globalCompositeOperation='source-over';
    }else if(mode==='alchemy'){
        ctx.globalCompositeOperation='screen';
        for(let i=0;i<3;i++){
            const x=w*(.22+.28*i),y=h*(.51+.065*Math.sin(t*.3+i)),rad=h*(.25+energy*.15+beat*.085)*(i===1?1.32:.91);
            const phase=t*(i===1?-.31:.24)+i;
            glow(x,y,rad*2.2,[p0,p2,p3][i],.23+energy*.16);
            ctx.save();ctx.translate(x,y);ctx.rotate(phase);
            for(let ring=0;ring<5;ring++){
                const r=rad*(.48+ring*.20);
                ctx.beginPath();ctx.ellipse(0,0,r,r*(.42+ring*.065),i*.38,0,tau);
                stroke([p0,p1,p2,p3,white][(i+ring)%5],.24+energy*.24+beat*.17,.85+ring*.26);
            }
            for(let j=0;j<13;j++){
                const a=j*tau/13+t*(i%2?-.3:.24);
                dot(Math.cos(a)*rad*.93,Math.sin(a)*rad*.43,1+treble*.75,p3,.26+treble*.45);
            }ctx.restore();
        }
        ctx.globalCompositeOperation='source-over';
    }else if(mode==='ribbons'){
        ctx.globalCompositeOperation='screen';
        for(let l=0;l<6;l++){
            const c=[p0,p1,p2,p3,white,p2][l],ph=t*(.36+l*.039)+l*.64;
            const y=h*(.27+l*.09),amp=h*(.075+energy*.21+beat*.07);
            for(let glowPass=2;glowPass>=0;glowPass--){ctx.beginPath();
                for(let x=0;x<=w+6;x+=6){const v=Math.sin(x/w*tau*1.7+ph)*amp+Math.cos(x/w*tau*3.25-ph*.61)*amp*.26;
                    x?ctx.lineTo(x,y+v):ctx.moveTo(x,y+v);}
                stroke(c,glowPass===0?.69+energy*.22:glowPass===1?.19:.05,
                       glowPass===0?1.4+energy*1.1:glowPass===1?5:12);
            }
        }
        for(let i=0;i<18;i++){const x=(noise(i,2)*w+t*12)%w;
            const y=h*(.28+noise(i,6)*.57);dot(x,y,.85,p3,.10+hi*.35);}
        ctx.globalCompositeOperation='source-over';
    }else if(mode==='plasma'){
        ctx.globalCompositeOperation='screen';
        for(let i=0;i<12;i++){
            const x=w*(.06+noise(i,3)*.88)+Math.sin(t*(.19+i*.018)+i)*w*.024;
            const y=h*(.27+noise(i,11)*.54)+Math.cos(t*(.17+i*.027)+i)*h*.07;
            const r=h*(.40+noise(i,7)*.39+energy*.28+beat*.08);
            glow(x,y,r,[p0,p1,p2,p3][i%4],.20+energy*.19+beat*.05);
        }
        for(let l=0;l<3;l++){
            ctx.beginPath();for(let x=0;x<=w+8;x+=8){const y=h*(.42+l*.125+.10*Math.sin(x/w*tau*(1.9+l*.44)+t*(.28+l*.12)));
                x?ctx.lineTo(x,y):ctx.moveTo(x,y);}
            stroke([p1,p3,p2][l],.18+energy*.24,1.1+l*.25);
        }ctx.globalCompositeOperation='source-over';
    }else if(mode==='scope'){
        ctx.save();for(let y=7;y<h;y+=7){ctx.fillStyle=rgba(p1,.025);ctx.fillRect(0,y,w,1);}
        const a=h*(.09+energy*.25+beat*.14);
        for(let pass=2;pass>=0;pass--){ctx.beginPath();
            for(let x=0;x<=w;x+=3){const u=x/w,v=spectrum(u)-.25;
                const n=Math.sin(u*tau*(3.7+bass*1.9)+t*2.4)*.52+Math.sin(u*tau*8.8-t*1.6)*.27+v*.44;
                const yy=h*.5+n*a;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}
            stroke(pass===0?white:p2,pass===0?.84:pass===1?.2:.05,pass===0?1.35:pass===1?5:12);
        }ctx.restore();
    }else if(mode==='kaleidoscope'){
        // 2000s fractal flower: symmetric rotating prisms with no shader costs.
        const cx=w*.5,cy=h*.54,rad=h*(.22+energy*.16+beat*.1);
        ctx.globalCompositeOperation='screen';glow(cx,cy,rad*3,p0,.24+energy*.27);
        for(let ring=0;ring<3;ring++){
            const rr=rad*(.75+ring*.65),lobes=8+ring*4;
            ctx.beginPath();for(let j=0;j<=lobes*12;j++){
                const a=j*tau/(lobes*12)+t*(ring%2?-.15:.19);
                const r=rr*(.74+.26*Math.cos(lobes*a+t*.38))*(1+beat*.09);
                const x=cx+Math.cos(a)*r*1.7,y=cy+Math.sin(a)*r*.76;
                j?ctx.lineTo(x,y):ctx.moveTo(x,y);}
            stroke([p1,p3,p2][ring],.33+energy*.32,1.2+ring*.13);
        }
        for(let j=0;j<24;j++){const a=j*tau/24+t*.21;
            const x=cx+Math.cos(a)*rad*2.4,y=cy+Math.sin(a)*rad*.67;
            dot(x,y,.6+treble*.65,j%2?p0:p2,.22+treble*.25);}
        glow(cx,cy,rad*.72,p3,.44+bass*.3);
        ctx.globalCompositeOperation='source-over';
    }else if(mode==='bassfloor'||mode==='skyline'){
        const city=mode==='skyline',n=city?65:44,gap=w/n;
        const horizon=baseline;
        const lineGr=ctx.createLinearGradient(0,0,w,0);
        lineGr.addColorStop(0,rgba(p0,0));lineGr.addColorStop(.5,rgba(p2,.43));lineGr.addColorStop(1,rgba(p1,0));
        ctx.fillStyle=lineGr;ctx.fillRect(0,horizon,w,1);
        for(let i=0;i<n;i++){
            const u=i/n,v=spectrum(u),height=h*(.055+v*(city?.65:.48)+beat*.095);
            const x=i*gap+.6,c=pal(u);
            const grad=ctx.createLinearGradient(0,horizon-height,0,horizon);
            grad.addColorStop(0,rgba(c,.65+v*.26));grad.addColorStop(1,rgba(c,.055));
            ctx.fillStyle=grad;ctx.fillRect(x,horizon-height,Math.max(1.2,gap-(city?1.3:2.6)),height);
            ctx.fillStyle=rgba(c,.81+v*.18);ctx.fillRect(x,horizon-height,Math.max(1.2,gap-(city?1.3:2.6)),1.5);
            if(city && i%2===0){for(let j=1;j<=3;j++){ctx.fillStyle=rgba(white,.12+treble*.29);
                ctx.fillRect(x+gap*.27,horizon-height+j*height*.20,1.2,1.3);}}
        }
        glow(w*.5,h*.92,w*.30,p2,.10+energy*.18);
    }else if(mode==='pulseengine'||mode==='arc'||mode==='resonance'){
        // GTM SIGNATURE: three separate machines with different geometry and
        // dedicated musical behaviors, not an equalizer recolored three times.
        const cx=w*.5,cy=h*.55,rad=h*(.25+beat*.08);
        ctx.globalCompositeOperation='screen';
        glow(cx,cy,rad*3.2,p1,.27+energy*.32+beat*.25);
        if(mode==='pulseengine'){
            // Segmented central hex reactor plus energy rails and bass wake.
            for(let ring=0;ring<6;ring++){
                const r=rad*(.65+ring*.32),phase=t*(ring%2?-.20:.17)+ring*.14;
                ctx.beginPath();for(let j=0;j<=6;j++){
                    const a=j*tau/6+phase;
                    const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.76;
                    j?ctx.lineTo(x,y):ctx.moveTo(x,y);}
                stroke([p0,p1,p2,p3,white,p2][ring],.30+energy*.30+beat*.22,1.05+ring*.22);
            }
            for(const dir of [-1,1]){
                const x0=cx+dir*rad*2.4,x1=cx+dir*w*.49;
                for(let l=0;l<3;l++){ctx.beginPath();ctx.moveTo(x0,cy+l*6-6);ctx.lineTo(x1,cy+l*6-6);
                    stroke([p0,p1,p3][l],.16+beat*.37,.85+l*.23);}
            }
            dot(cx,cy,3+beat*5,white,.74+energy*.2);
        }else if(mode==='arc'){
            // Independent asymmetrical orbits and bright lensed reactor core.
            for(let l=0;l<7;l++){
                const angle=t*(l%2?-.13:.17)+l*.36;
                ctx.beginPath();ctx.ellipse(cx,cy,rad*(.65+l*.28),rad*(.28+l*.13),angle,.1+ l*.18,tau-(l*.22));
                stroke([p0,p1,p2,p3,white][l%5],.23+energy*.31+beat*.19,1.0+l*.15);
            }
            glow(cx,cy,rad*.94,white,.35+bass*.37);dot(cx,cy,2.3+beat*4,white,.68);
        }else{
            // New Resonance Crown: breathing arcs fan out from the nucleus.
            for(let l=0;l<12;l++){
                const u=l/12,r=rad*(.7+u*2.6),angle=t*.10+u*.36;
                ctx.beginPath();ctx.ellipse(cx,cy,r*2.0,r*(.28+u*.28),angle,pi*(1.12-u*.23),tau*(.86+u*.04));
                stroke(pal(u),.16+energy*.29+beat*.27,1+u*.85);
            }
            for(let i=0;i<21;i++){
                const a=i*tau/21+t*.25,x=cx+Math.cos(a)*rad*2.7,y=cy+Math.sin(a)*rad*.69;
                dot(x,y,.5+treble*1.3,pal(i/21),.27+treble*.44);}
            glow(cx,cy,rad*1.2,p3,.32+bass*.25);
        }
        ctx.globalCompositeOperation='source-over';
    }
    ctx.globalCompositeOperation='source-over';ctx.lineCap='butt';ctx.shadowBlur=0;
}

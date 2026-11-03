// GTM 4.1.8: Universal Visualizer Pack v3, bounded expression and drawing VM.
// JSON-only pack scripts: never eval, Function, imports, network, DOM access or external modules.
// All coordinates are normalized 0..1 and rendered inside the existing footer canvas.
const GTM418_PACK_OPTION_PREFIX='GTM_PACK_V3_OPTIONS_';
function gtm418ProgramOptionValue(scene,option){
    const fallback=option.choices?.[0]?.value??0;
    try{const stored=JSON.parse(window.localStorage.getItem(GTM418_PACK_OPTION_PREFIX+scene.id)||'{}');
        const value=Number(stored[option.id]);return option.choices.some(c=>c.value===value)?value:fallback;
    }catch(_){return fallback;}
}
function gtm418SaveProgramOption(scene,option,value){
    if(!option.choices.some(c=>c.value===value))return false;
    try{const key=GTM418_PACK_OPTION_PREFIX+scene.id;
        let old={};try{old=JSON.parse(window.localStorage.getItem(key)||'{}')||{};}catch(_){}
        const next={};for(const o of scene.options||[])next[o.id]=o.id===option.id?value:
            (o.choices.some(c=>c.value===old[o.id])?old[o.id]:o.choices[0].value);
        window.localStorage.setItem(key,JSON.stringify(next));return true;
    }catch(_){return false;}
}
const GTM418_PROGRAM_STATES = new WeakMap();
const GTM418_PROGRAM_LIMIT = 12500;
const GTM418_PROGRAM_DRAW_LIMIT = 320;
const GTM418_PROGRAM_WARNINGS = new Set();
const gtm418Number=(v,fall=0)=>Number.isFinite(v)?Math.max(-1e6,Math.min(1e6,v)):fall;
const gtm418Clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function gtm418Eval(v,env,budget,depth=0){
    if(--budget.left<0 || depth>12)throw Error('visual program operation budget exhausted');
    if(typeof v==='number')return gtm418Number(v);
    if(!Array.isArray(v))return 0;
    const op=v[0];
    if(op==='get')return gtm418Number(env[v[1]]||0);
    const a=gtm418Eval(v[1],env,budget,depth+1);
    if(['sin','cos','tan','abs','sqrt','floor','ceil','round','fract','not','hash'].includes(op)){
        switch(op){
        case 'sin':return Math.sin(a);case 'cos':return Math.cos(a);case 'tan':return gtm418Number(Math.tan(a));
        case 'abs':return Math.abs(a);case 'sqrt':return Math.sqrt(Math.max(0,a));
        case 'floor':return Math.floor(a);case 'ceil':return Math.ceil(a);case 'round':return Math.round(a);
        case 'fract':return a-Math.floor(a);case 'not':return a?0:1;
        case 'hash':{const n=Math.sin(a*127.1+78.233)*43758.5453;return n-Math.floor(n);}
        }
    }
    const b=gtm418Eval(v[2],env,budget,depth+1);
    switch(op){
    case 'add':return gtm418Number(a+b);case 'sub':return gtm418Number(a-b);
    case 'mul':return gtm418Number(a*b);case 'div':return b===0?0:gtm418Number(a/b);
    case 'mod':return b===0?0:gtm418Number(a%b);case 'pow':return gtm418Number(Math.pow(a,b));
    case 'atan2':return Math.atan2(a,b);case 'min':return Math.min(a,b);case 'max':return Math.max(a,b);
    case 'lt':return a<b?1:0;case 'lte':return a<=b?1:0;case 'gt':return a>b?1:0;
    case 'gte':return a>=b?1:0;case 'eq':return a===b?1:0;
    case 'and':return a&&b?1:0;case 'or':return a||b?1:0;
    }
    const c=gtm418Eval(v[3],env,budget,depth+1);
    switch(op){
    case 'clamp':return gtm418Clamp(a,Math.min(b,c),Math.max(b,c));
    case 'mix':return gtm418Number(a+(b-a)*gtm418Clamp(c,0,1));
    case 'smoothstep':{const t=gtm418Clamp((c-a)/(b-a||1),0,1);return t*t*(3-2*t);}
    }
    return 0;
}
function gtm418Color(value,env,budget){
    if(typeof value==='string'&&/^#[0-9a-fA-F]{6}$/.test(value))return value;
    if(value&&Array.isArray(value.hsl)&&value.hsl.length===3){
        const parts=value.hsl.map(x=>gtm418Eval(x,env,budget));
        return `hsl(${((parts[0]%1)+1)%1*360} ${gtm418Clamp(parts[1],0,1)*100}% ${gtm418Clamp(parts[2],0,1)*100}%)`;
    }
    return '#ffffff';
}
function gtm418RunCommands(list,env,ctx,w,h,budget,stage){
    if(!Array.isArray(list))return;
    for(const cmd of list){
        if(--budget.left<0)throw Error('visual program operation budget exhausted');
        if(cmd.do==='set'){
            // Backend verified every variable is a declared state register.
            env[cmd.var]=gtm418Eval(cmd.value,env,budget);continue;
        }
        if(cmd.do==='if'){
            const yes=gtm418Eval(cmd.test,env,budget);
            gtm418RunCommands(yes?cmd.then:(cmd.else||[]),env,ctx,w,h,budget,stage);continue;
        }
        if(cmd.do==='repeat'){
            for(let i=0;i<cmd.count;i++){
                env[cmd.index]=i;
                gtm418RunCommands(cmd.body,env,ctx,w,h,budget,stage);
            }
            delete env[cmd.index];continue;
        }
        if(stage!=='draw'||++budget.draw>GTM418_PROGRAM_DRAW_LIMIT)
            throw Error('visual program draw budget exhausted');
        const read=(key,defaultValue=0)=>cmd[key]===undefined?defaultValue:gtm418Eval(cmd[key],env,budget);
        const x=gtm418Clamp(read('x'),-2,3)*w,y=gtm418Clamp(read('y'),-2,3)*h;
        const alpha=gtm418Clamp(read('alpha',1),0,1);
        ctx.globalAlpha=alpha;
        ctx.fillStyle=gtm418Color(cmd.color||'#ffffff',env,budget);
        ctx.strokeStyle=ctx.fillStyle;
        if(cmd.do==='rect'){
            ctx.fillRect(x,y,gtm418Clamp(read('w'),-2,2)*w,gtm418Clamp(read('h'),-2,2)*h);
        }else if(cmd.do==='circle'){
            ctx.beginPath();ctx.arc(x,y,Math.abs(gtm418Clamp(read('r'),-2,2))*h,0,Math.PI*2);
            if(cmd.stroke){ctx.lineWidth=1.5;ctx.stroke();}else ctx.fill();
        }else if(cmd.do==='line'){
            ctx.beginPath();ctx.moveTo(x,y);
            ctx.lineTo(gtm418Clamp(read('x2'),-2,3)*w,gtm418Clamp(read('y2'),-2,3)*h);
            ctx.lineWidth=gtm418Clamp(read('size',.016),.004,.08)*h;ctx.stroke();
        }else if(cmd.do==='text'){
            const size=gtm418Clamp(read('size',.15),.09,.35);
            ctx.font=`700 ${Math.max(10,Math.round(h*size))}px sans-serif`;
            ctx.textBaseline='middle';
            const suffix=cmd.value===undefined?'':String(Math.round(read('value')*100)/100);
            ctx.fillText(String(cmd.text||'').slice(0,64)+suffix,x,y,Math.max(10,w*.9));
        }
    }
    ctx.globalAlpha=1;
}
function gtm418DrawProgram(ctx,canvas,scene,mode,frame,data,w,h){
    if(!scene?.program)return;
    if(typeof GTM421_ARCADE_IDS!=='undefined'&&GTM421_ARCADE_IDS.has(scene.id))
        return gtm421DrawArcade(ctx,canvas,scene,mode,frame,data,w,h);
    const program=scene.program;
    // Keep each interactive scene's simulation across Shuffle All; don't burn CPU while off-screen.
    let states=GTM418_PROGRAM_STATES.get(canvas);
    if(!states){states=new Map();GTM418_PROGRAM_STATES.set(canvas,states);}
    let instance=states.get(mode);
    if(!instance||instance.program!==program){
        if(states.size>=32)states.delete(states.keys().next().value);
        instance={mode,program,registers:{...program.state},time:0,smoothed:{low:0,mid:0,high:0,beat:0,rms:0,energy:0},slowFrameStrikes:0,disabled:false};
        states.set(mode,instance);
    }
    if(instance.disabled)return;
    const budget={left:GTM418_PROGRAM_LIMIT,draw:0};
    const realDt=gtm418Clamp(frame.physicsDt??frame.wallDt??(1/60),0,.25);
    const env={...instance.registers,time:instance.time,dt:realDt,width:1,height:1,pi:Math.PI,tau:Math.PI*2,paused:0,audio_paused:data?.live?0:1};
    // Audio envelopes are eased; the physical scenery and game simulation advance independently.
    for(const name of ['low','mid','high','beat','rms','energy']){
        const value=data?.live?gtm418Clamp(Number(data?.[name])||0,0,1):0;
        const k=1-Math.exp(-realDt*(value>instance.smoothed[name]?7:3.5));
        instance.smoothed[name]+=(value-instance.smoothed[name])*k;
        env[name]=instance.smoothed[name];
    }
    for(let k=0;k<12;k++)env['band'+k]=data?.live?gtm418Clamp(Number(data?.bands?.[k])||0,0,1):0;
    const supported=Array.isArray(scene.interaction?.modes)?scene.interaction.modes:['ai_ai'];
    const controls=scene.interaction?gtm418ReadPlayers(snapshot$1,supported,'program:'+mode):null;
    env.mode=controls?.numericMode||0;env.paused=controls?.paused?1:0;
    env.player1_side=controls?.side==='right'?1:0;
    env.disconnect_countdown=controls?.countdown||0;
    for(const [number,side] of [[1,controls?.side==='right'?'right':'left'],[2,controls?.side==='right'?'left':'right']]){
        const sample=controls?.[side]||GTM418_ZERO();
        for(const prop of ['x','y','lb','rb','lt','rt','xbtn','ybtn'])env['p'+number+prop]=sample[prop]||0;
        env['p'+number+'a']=gtm418ConsumeMenuAction(number,'program:'+mode);
        env['human'+number]=sample.human||0;env['connected'+number]=sample.connected||0;
    }
    for(const option of scene.options||[])env['opt_'+option.id]=gtm418ProgramOptionValue(scene,option);
    const start=typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
    try{
        const steps=controls?.paused?0:Math.max(1,Math.min(5,Math.ceil(realDt/.05)));
        env.dt=steps?realDt/steps:0;
        for(let i=0;i<steps;i++){
            instance.time+=env.dt;env.time=instance.time;
            gtm418RunCommands(program.update,env,ctx,w,h,budget,'update');
        }
        for(const name of Object.keys(instance.registers))instance.registers[name]=gtm418Number(env[name]);
        ctx.save();
        try{ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();
            gtm418RunCommands(program.draw,env,ctx,w,h,budget,'draw');
            if(controls)gtm418DrawSessionStatus(ctx,w,h,controls);
        }finally{ctx.restore();}
        frame.packOperations=GTM418_PROGRAM_LIMIT-budget.left;
        frame.packDrawCommands=budget.draw;
        frame.packCostMs=(typeof performance!=='undefined'&&performance.now?performance.now():Date.now())-start;
        // Warm-up, first-use compilation, and frame scheduling can cause one
        // expensive draw even for a tiny scene. Only repeated expensive frames
        // disable the scene; operation/draw budgets remain immediate hard limits.
        if(frame.packCostMs>18)instance.slowFrameStrikes=Math.min(5,instance.slowFrameStrikes+1);
        else instance.slowFrameStrikes=Math.max(0,instance.slowFrameStrikes-2);
        if(instance.time>0.5&&instance.slowFrameStrikes>=4)instance.disabled=true;
    }catch(error){
        instance.disabled=true;
        if(!GTM418_PROGRAM_WARNINGS.has(mode)){
            GTM418_PROGRAM_WARNINGS.add(mode);console.warn('[GTM] disabled slow/invalid visualizer pack scene',mode,String(error));
        }
        frame.packError=String(error).slice(0,100);
    }
}

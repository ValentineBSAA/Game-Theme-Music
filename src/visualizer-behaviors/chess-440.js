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

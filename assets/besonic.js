/* BESONIC visual system: core, pipeline, modules, dials, feed */
(function(){
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function sig(){return (getComputedStyle(document.documentElement).getPropertyValue('--sig-d').trim()||'#2AA880')}
var J=sig();
function rgba(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')'}
function rnd(a,b){return a+Math.random()*(b-a)}
var FONT='"Switzer",sans-serif';
function mount(cv,draw){
  var ctx=cv.getContext('2d'),S={w:0,h:0},vis=false,t0=performance.now(),last=t0;
  function size(){var W=cv.clientWidth,H=cv.clientHeight,d=Math.min(window.devicePixelRatio||1,2);if(!W||!H)return;cv.width=Math.round(W*d);cv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);S.w=W;S.h=H;}
  size();if(window.ResizeObserver)new ResizeObserver(size).observe(cv);else addEventListener('resize',size);
  new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:0}).observe(cv);
  if(RM){setTimeout(function(){size();draw(ctx,S.w,S.h,9,0.016)},300);return;}
  (function loop(t){if(vis&&S.w){draw(ctx,S.w,S.h,(t-t0)/1000,Math.min(.05,(t-last)/1000));}last=t;requestAnimationFrame(loop)})(t0);
}
var mouse={x:-1e4,y:-1e4};addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY});

/* ---------- 1. SONIC CORE: noise in, one revenue signal out ---------- */
var D={};
D.core=function(cv){
  var src=['META','TIKTOK','GOOGLE','COMMERCE','CRM','P&L','PROJECTS','TEAM'],P=[],spawn=0,pulses=[],pspawn=0;
  mount(cv,function(c,w,h,t,dt){
    c.clearRect(0,0,w,h);
    var mob=w<720,cx=mob?w*.5:w*.74,cy=mob?Math.min(h*.22,210):h*.5,R=Math.min(mob?w*.31:h*.28,320),r0=R*.2;
    var r=cv.getBoundingClientRect(),mx=mouse.x-r.left,my=mouse.y-r.top,md=Math.hypot(mx-cx,my-cy),near=Math.max(0,1-md/(R*2.2));
    // faint polar grid
    c.strokeStyle='rgba(255,255,255,.045)';c.lineWidth=1;
    for(var g=1;g<=4;g++){c.beginPath();c.arc(cx,cy,R*.42*g,0,6.284);c.stroke();}
    for(var a=0;a<12;a++){var an=a*Math.PI/6;c.beginPath();c.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);c.lineTo(cx+Math.cos(an)*R*1.7,cy+Math.sin(an)*R*1.7);c.stroke();}
    // output beam: noisy at the core, clean and rising toward the edge
    if(!mob){
      var x0=cx+R*.95,x1=w-20,N=140;
      for(var k=0;k<3;k++){c.beginPath();
        for(var i=0;i<=N;i++){var u=i/N,x=x0+(x1-x0)*u,amp=(1-u)*(1-u)*R*.22,y=cy-u*u*h*.2+amp*Math.sin(u*38-t*5+k*1.7)*Math.sin(u*9+t+k);i?c.lineTo(x,y):c.moveTo(x,y);}
        c.strokeStyle=k?rgba(J,.16):J;c.lineWidth=k?1:2.2;c.stroke();}
      pspawn-=dt;if(pspawn<=0){pulses.push(0);pspawn=rnd(.25,.6);}
      for(var q=pulses.length-1;q>=0;q--){pulses[q]+=dt*.32;var u=pulses[q];if(u>1){pulses.splice(q,1);continue;}
        var x=x0+(x1-x0)*u,y=cy-u*u*h*.2+(1-u)*(1-u)*R*.22*Math.sin(u*38-t*5)*Math.sin(u*9+t);
        var gg=c.createRadialGradient(x,y,0,x,y,14);gg.addColorStop(0,rgba(J,.9));gg.addColorStop(1,rgba(J,0));c.fillStyle=gg;c.beginPath();c.arc(x,y,14,0,6.284);c.fill();}
      c.font='500 10px '+FONT;c.fillStyle=J;c.textAlign='right';c.fillText('REVENUE',x1,cy-h*.2-14);c.textAlign='start';
    }
    // sonic rings: a pressure wave travels outward
    var ph=(t*.55)%1;
    for(var k=0;k<9;k++){
      var base=r0+(R-r0)*k/8,env=Math.exp(-Math.pow((k/8-ph)*4,2)),amp=(4+R*.05*env)*(1+near*.8);
      c.beginPath();
      for(var i=0;i<=180;i++){var th=i/180*6.2832,rr=base+amp*(Math.sin(th*3+t*1.3+k)*.6+Math.sin(th*7-t*.9+k*.6)*.4);
        var x=cx+Math.cos(th)*rr,y=cy+Math.sin(th)*rr;i?c.lineTo(x,y):c.moveTo(x,y);}
      c.closePath();c.strokeStyle=rgba(J,(0.1+0.55*env)*(1-k/12));c.lineWidth=k===0?2:1+env;c.stroke();
    }
    // core glow
    var gl=c.createRadialGradient(cx,cy,0,cx,cy,r0*2.4);gl.addColorStop(0,rgba(J,.55));gl.addColorStop(.35,rgba(J,.14));gl.addColorStop(1,rgba(J,0));
    c.fillStyle=gl;c.beginPath();c.arc(cx,cy,r0*2.4,0,6.284);c.fill();
    c.fillStyle='#050505';c.beginPath();c.arc(cx,cy,r0*.62,0,6.284);c.fill();
    c.strokeStyle=J;c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,r0*.62,0,6.284);c.stroke();
    // equaliser mark inside the core
    var bw=r0*.12,hs=[.35,.6,.85,1];for(var b=0;b<4;b++){var hh=r0*.62*hs[b]*(.65+.35*Math.abs(Math.sin(t*2.4+b)));c.fillStyle=J;c.fillRect(cx-bw*2.4+b*bw*1.3,cy+r0*.3-hh,bw,hh);}
    // source nodes orbit; particles spiral in
    var Ro=R*(mob?1.22:1.42),rot=t*.04;
    var nodes=src.map(function(n,i){var a=rot+i/src.length*6.2832+(mob?0:.35);return [cx+Math.cos(a)*Ro,cy+Math.sin(a)*Ro*(mob?.8:1),a,n]});
    spawn-=dt;if(spawn<=0&&P.length<(mob?40:90)){P.push({i:Math.floor(rnd(0,src.length)),p:0,v:rnd(.22,.4),s:rnd(-.9,.9)});spawn=rnd(.02,.07);}
    for(var j=P.length-1;j>=0;j--){var p=P[j];p.p+=p.v*dt;if(p.p>=1){P.splice(j,1);continue;}
      var nd=nodes[p.i],a=nd[2]+p.s*p.p*1.6,rr=Ro*(1-p.p)+r0*.7*p.p,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*(mob?(.8+.2*p.p):1);
      var col=p.p>.55?rgba(J,.4+.6*p.p):'rgba(210,210,210,'+(0.25+0.6*(1-p.p)).toFixed(2)+')';
      c.fillStyle=col;c.beginPath();c.arc(x,y,1.2+1.4*p.p,0,6.284);c.fill();}
    c.font='500 10px '+FONT;
    nodes.forEach(function(nd){
      if(nd[0]<-20||nd[0]>w+20||nd[1]<-20||nd[1]>h+20)return;
      c.fillStyle='#050505';c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=1;c.beginPath();c.arc(nd[0],nd[1],4.5,0,6.284);c.fill();c.stroke();
      var left=nd[0]<cx,tw=c.measureText(nd[3]).width,lx=nd[0]+(left?-12:12);if((left&&lx-tw<6)||(!left&&lx+tw>w-6))return;c.textAlign=left?'right':'left';c.fillStyle='#8A8A8A';c.fillText(nd[3],lx,nd[1]+3.5);});
    c.textAlign='start';
  });
};

/* ---------- 2. PIPELINE: connect, unify, decide, compound ---------- */
D.pipe=function(cv){
  var src=['Meta Ads','TikTok Ads','Google Ads','Commerce','CRM · Zalo OA','Projects','Team time','Finance · P&L'],
      out=['CEO view','Team view','Client portal','Alerts','Forecast'],P=[],spawn=0,glow=0,steps=document.querySelectorAll('[data-bs-steps] div');
  mount(cv,function(c,w,h,t,dt){
    c.clearRect(0,0,w,h);
    var mob=w<720,fs=mob?10:12;c.font=fs+'px '+FONT;
    var cyc=12,st=Math.floor((t%cyc)/cyc*4);steps.forEach(function(s,i){s.classList.toggle('on',i===st)});
    var lw=Math.max.apply(0,src.map(function(x){return c.measureText(x).width})),rw=Math.max.apply(0,out.map(function(x){return c.measureText(x).width}));
    var sx=lw+(mob?18:40),ox=w-rw-(mob?18:40),ex=(sx+ox)/2,cy=h/2,cw=Math.min(mob?96:200,(ox-sx)*.42),ch=mob?110:170;
    var S=src.map(function(n,i){return [sx,h*.08+i*(h*.84)/(src.length-1)]}),O=out.map(function(n,i){return [ox,h*.2+i*(h*.6)/(out.length-1)]});
    function bz(a,b,u){var m=(a[0]+b[0])/2,v=1-u;return [v*v*v*a[0]+3*v*v*u*m+3*v*u*u*m+u*u*u*b[0],v*v*v*a[1]+3*v*v*u*a[1]+3*v*u*u*b[1]+u*u*u*b[1]]}
    function inP(i){return [S[i],[ex-cw/2,cy-ch*.36+i*(ch*.72)/(src.length-1)]]}
    function outP(i){return [[ex+cw/2,cy-ch*.3+i*(ch*.6)/(out.length-1)],O[i]]}
    function curve(a,b,col,lw){c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(a[0],a[1]);var m=(a[0]+b[0])/2;c.bezierCurveTo(m,a[1],m,b[1],b[0],b[1]);c.stroke();}
    var hiIn=st===0,hiOut=st>=2;
    for(var i=0;i<S.length;i++){var p=inP(i);curve(p[0],p[1],hiIn?'rgba(255,255,255,.22)':'rgba(255,255,255,.09)',1);}
    for(var i=0;i<O.length;i++){var p=outP(i);curve(p[0],p[1],rgba(J,hiOut?.5:.22),hiOut?1.4:1);}
    spawn-=dt;if(spawn<=0){P.push({k:0,i:Math.floor(rnd(0,S.length)),p:0,v:rnd(.4,.65)});spawn=rnd(.03,.09);}
    for(var j=P.length-1;j>=0;j--){var q=P[j];q.p+=q.v*dt;
      if(q.p>=1){P.splice(j,1);if(!q.k){glow=1;if(Math.random()<.55)P.push({k:1,i:Math.floor(rnd(0,O.length)),p:0,v:rnd(.45,.7)});}continue;}
      var pp=q.k?outP(q.i):inP(q.i),pt=bz(pp[0],pp[1],q.p);
      c.fillStyle=q.k?J:'rgba(225,225,225,.9)';c.beginPath();c.arc(pt[0],pt[1],q.k?2.6:2,0,6.284);c.fill();}
    glow=Math.max(0,glow-dt*1.4);
    // core block: layered model
    var x=ex-cw/2,y=cy-ch/2,unify=st===1;
    var gg=c.createRadialGradient(ex,cy,0,ex,cy,cw);gg.addColorStop(0,rgba(J,.12+glow*.1+(unify?.1:0)));gg.addColorStop(1,rgba(J,0));c.fillStyle=gg;c.fillRect(ex-cw,cy-cw,cw*2,cw*2);
    c.fillStyle='#0A0A0A';c.fillRect(x,y,cw,ch);c.strokeStyle=rgba(J,.45+glow*.4);c.lineWidth=1.2;c.strokeRect(x,y,cw,ch);
    var L=['RAW','CLEAN','MODEL','MARTS'];
    for(var l=0;l<4;l++){var ly=y+ch*.2+l*ch*.17,fill=Math.min(1,Math.max(0,((t*.6)%4)-l));
      c.fillStyle='rgba(255,255,255,.06)';c.fillRect(x+12,ly,cw-24,ch*.1);c.fillStyle=rgba(J,unify?.85:.5);c.fillRect(x+12,ly,(cw-24)*(unify?fill:1),ch*.1);
      if(!mob){c.font='500 9px '+FONT;c.fillStyle='#050505';c.fillText(L[l],x+18,ly+ch*.1-4);}}
    c.textAlign='center';c.font='500 '+(mob?12:15)+'px '+FONT;c.fillStyle='#F2F2F2';c.fillText('besonic',ex,y+ch*.13);
    c.font=fs+'px '+FONT;
    c.textAlign='right';S.forEach(function(p,i){c.fillStyle='#050505';c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;c.beginPath();c.arc(p[0],p[1],4.5,0,6.284);c.fill();c.stroke();c.fillStyle=hiIn?'#F2F2F2':'#9A9A9A';c.fillText(src[i],p[0]-12,p[1]+4);});
    c.textAlign='left';O.forEach(function(p,i){var hot=st===3?i===(Math.floor(t*1.5)%O.length):hiOut;c.fillStyle=hot?J:rgba(J,.5);c.beginPath();c.arc(p[0],p[1],hot?6:4.5,0,6.284);c.fill();c.fillStyle=hot?'#F2F2F2':'#9A9A9A';c.fillText(out[i],p[0]+12,p[1]+4);});
    c.textAlign='start';
  });
};

/* ---------- 3. MODULES ---------- */
function frame(c,w,h){c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=1;for(var g=1;g<4;g++){c.beginPath();c.moveTo(0,h*g/4);c.lineTo(w,h*g/4);c.stroke();}}
D.rep=function(cv){var n=18,v=[];for(var i=0;i<n;i++)v.push(rnd(.3,.9));var acc=0;
  mount(cv,function(c,w,h,t,dt){c.clearRect(0,0,w,h);frame(c,w,h);acc+=dt;if(acc>.5){acc=0;v.shift();v.push(Math.min(.95,Math.max(.2,v[v.length-1]+rnd(-.18,.22))));}
    var pad=20,bw=(w-pad*2)/n;for(var i=0;i<n;i++){var bh=(h-40)*v[i],last=i===n-1;c.fillStyle=last?J:'rgba(255,255,255,'+(0.12+i/n*.25)+')';c.fillRect(pad+i*bw+2,h-20-bh,bw-4,bh);}
    c.fillStyle=J;c.beginPath();c.arc(w-pad-bw/2,h-20-(h-40)*v[n-1]-8,3,0,6.284);c.fill();});};
D.attr=function(cv){var P=[],sp=0,W=[.4,.25,.2,.15];
  mount(cv,function(c,w,h,t,dt){c.clearRect(0,0,w,h);var sx=26,tx=w-30,ty=h/2;
    var ys=[h*.18,h*.4,h*.62,h*.84];W=W.map(function(x,i){return x+Math.sin(t*.6+i*1.7)*.0012});
    ys.forEach(function(y,i){c.strokeStyle=i===0?rgba(J,.55):'rgba(255,255,255,.16)';c.lineWidth=2+W[i]*22;c.beginPath();c.moveTo(sx,y);c.bezierCurveTo(w*.55,y,w*.55,ty,tx,ty);c.stroke();
      c.fillStyle=i===0?J:'#8A8A8A';c.beginPath();c.arc(sx,y,4,0,6.284);c.fill();});
    sp-=dt;if(sp<=0){P.push({i:Math.random()<.45?0:1+Math.floor(rnd(0,3)),p:0});sp=rnd(.04,.12);}
    for(var j=P.length-1;j>=0;j--){var q=P[j];q.p+=dt*.55;if(q.p>1){P.splice(j,1);continue;}var u=q.p,v=1-u,y0=ys[q.i];
      var x=v*v*v*sx+3*v*v*u*w*.55+3*v*u*u*w*.55+u*u*u*tx,y=v*v*v*y0+3*v*v*u*y0+3*v*u*u*ty+u*u*u*ty;c.fillStyle=q.i===0?'#fff':'rgba(200,200,200,.7)';c.fillRect(x-1,y-1,2,2);}
    c.fillStyle=J;c.beginPath();c.arc(tx,ty,7,0,6.284);c.fill();c.strokeStyle=rgba(J,.35);c.beginPath();c.arc(tx,ty,12+3*Math.sin(t*3),0,6.284);c.stroke();});};
D.out=function(cv){var pts=[];for(var i=0;i<46;i++){var x=Math.random();pts.push([x,.12+.6*x+rnd(-.12,.12)]);}var O=[.4,.9];
  mount(cv,function(c,w,h,t){c.clearRect(0,0,w,h);frame(c,w,h);var L=18,T=16,pw=w-36,ph=h-32,sc=(t%5)/3.8;
    function X(v){return L+pw*v}function Y(v){return T+ph*(1-v)}
    c.setLineDash([3,4]);c.strokeStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(X(0),Y(.12));c.lineTo(X(1),Y(.72));c.stroke();c.setLineDash([]);
    pts.forEach(function(p){var n=Math.abs(p[0]-sc)<.04;c.fillStyle=n?'#fff':'rgba(150,150,150,.6)';c.beginPath();c.arc(X(p[0]),Y(p[1]),n?3.2:2.4,0,6.284);c.fill();});
    var hit=sc>O[0],ox=X(O[0]),oy=Y(O[1]);c.fillStyle=hit?J:'rgba(150,150,150,.6)';c.beginPath();c.arc(ox,oy,hit?5:2.4,0,6.284);c.fill();
    if(hit){var k=(t*.8)%1;c.strokeStyle=rgba(J,1-k);c.lineWidth=1.4;c.beginPath();c.arc(ox,oy,6+k*22,0,6.284);c.stroke();c.font='500 10px '+FONT;c.fillStyle=J;c.fillText('4.2× AVG',ox+12,oy+4);}
    if(sc<=1){var sx=X(sc);c.strokeStyle=rgba(J,.8);c.lineWidth=1;c.beginPath();c.moveTo(sx,T);c.lineTo(sx,T+ph);c.stroke();}});};
D.fc=function(cv){var hist=[],v=.22;for(var i=0;i<26;i++){v+=rnd(-.025,.035);hist.push(Math.min(.55,v))}
  mount(cv,function(c,w,h,t){c.clearRect(0,0,w,h);frame(c,w,h);var n=40,L=14,pw=w-28,T=14,ph=h-28;
    function X(i){return L+pw*i/(n-1)}function Y(v){return T+ph*(1-v)}
    var e=hist[hist.length-1],k0=hist.length-1,rev=Math.min(1,(t%6)/3);
    [[.2,.07],[.11,.14]].forEach(function(b){c.beginPath();for(var i=k0;i<=k0+(n-1-k0)*rev;i++){var u=(i-k0)/(n-1-k0);c.lineTo(X(i),Y(e+u*.18+b[0]*u))}
      for(var i=Math.floor(k0+(n-1-k0)*rev);i>=k0;i--){var u=(i-k0)/(n-1-k0);c.lineTo(X(i),Y(e+u*.18-b[0]*u))}c.closePath();c.fillStyle=rgba(J,b[1]);c.fill();});
    c.beginPath();hist.forEach(function(y,i){i?c.lineTo(X(i),Y(y)):c.moveTo(X(i),Y(y))});c.strokeStyle='#E6E6E6';c.lineWidth=1.8;c.stroke();
    c.setLineDash([4,4]);c.beginPath();c.moveTo(X(k0),Y(e));c.lineTo(X(k0+(n-1-k0)*rev),Y(e+.18*rev));c.strokeStyle=J;c.stroke();c.setLineDash([]);
    c.strokeStyle='rgba(255,255,255,.2)';c.beginPath();c.moveTo(X(k0),T);c.lineTo(X(k0),T+ph);c.stroke();
    c.font='500 9px '+FONT;c.fillStyle='#7A7A7A';c.fillText('TODAY',X(k0)+6,T+10);c.fillStyle=J;c.fillText('P50',X(n-1)-22,Y(e+.18)-10);});};

/* ---------- 4. OPERATE: theme-aware company charts ---------- */
function pal(cv){var l=!!cv.closest('.light');return l?{l:1,ink:'#0A0A0A',mut:'#6B6B6B',dim:'#A8A8A8',grid:'rgba(10,10,10,.07)',j:'#0E8A63',neg:'#D9D7D2',bg:'#FFFFFF'}:{l:0,ink:'#F2F2F2',mut:'#8A8A8A',dim:'#5E5E5E',grid:'rgba(255,255,255,.07)',j:J,neg:'#3A3A3A',bg:'#0A0A0A'}}
function ease(u){u=Math.max(0,Math.min(1,u));return 1-Math.pow(1-u,3)}
// P&L waterfall
D.wf=function(cv){var S=[['Revenue',100,'t'],['Media',-38],['Creators',-17],['Production',-9],['Team',-21],['Overhead',-6],['EBITDA',9,'t']];
  mount(cv,function(c,w,h,t){var P=pal(cv);c.clearRect(0,0,w,h);var mob=w<520,L=mob?8:14,R=8,T=34,B=34,pw=w-L-R,ph=h-T-B,n=S.length,bw=pw/n,cyc=9,k=(t%cyc);
    function Y(v){return T+ph*(1-v/110)}
    c.strokeStyle=P.grid;c.lineWidth=1;[0,25,50,75,100].forEach(function(g){c.beginPath();c.moveTo(L,Y(g));c.lineTo(L+pw,Y(g));c.stroke();});
    var run=0;S.forEach(function(s,i){var u=ease((k-i*.35)/.8),top,bot;
      if(s[2]){top=s[1];bot=0;run=s[1]}else{top=run;bot=run+s[1];run=bot}
      var x=L+i*bw+bw*.16,ww=bw*.68,y1=Y(top),y0=Y(bot),hh=(y0-y1)*u;
      var yy=s[2]?y0-hh:y1;c.fillStyle=s[2]?P.j:P.neg;c.fillRect(x,yy,ww,hh);
      if(i<n-1&&u>.98){c.setLineDash([3,3]);c.strokeStyle=P.dim;c.beginPath();var yl=s[2]?Y(top):Y(bot);c.moveTo(x+ww,yl);c.lineTo(x+bw,yl);c.stroke();c.setLineDash([]);}
      c.globalAlpha=Math.max(0,Math.min(1,(k-i*.35-.5)/.4));c.textAlign='center';c.font='500 '+(mob?10:12)+'px Switzer,sans-serif';c.fillStyle=s[2]?P.j:P.ink;
      c.fillText((s[1]>0&&!s[2]?'+':'')+s[1]+(s[2]&&i?'%':''),x+ww/2,(s[2]?y0-hh:y1)-8);c.globalAlpha=1;
      c.font=(mob?9:10)+'px "Geist Mono",monospace';c.fillStyle=P.mut;c.fillText((w<600?['REV','MEDIA','KOC','PROD','TEAM','OPEX','EBITDA'][i]:s[0].toUpperCase()),x+ww/2,h-12);});
    c.textAlign='start';});};
// Sankey: spend -> outcome -> revenue
D.sk=function(cv){var A=[['Meta',34],['TikTok',28],['Creators',20],['Google',18]],M=[['Leads',42],['Orders',36],['Bookings',22]],
  F=[[0,0,18],[0,1,10],[0,2,6],[1,1,16],[1,0,8],[1,2,4],[2,1,10],[2,2,8],[2,0,2],[3,0,14],[3,2,4]],pts=[],sp=0;
  mount(cv,function(c,w,h,t,dt){var P=pal(cv);c.clearRect(0,0,w,h);var mob=w<520,T=18,B=18,ph=h-T-B,gap=10,x0=mob?62:90,x1=w*.5,x2=w-(mob?74:110),nw=8,K=(ph-gap*3)/100;
    function stack(arr){var y=T,o=[];arr.forEach(function(a){o.push([y,a[1]*K]);y+=a[1]*K+gap});return o}
    var a=stack(A),m=stack(M.map(function(x){return x})),offA=A.map(function(){return 0}),offM=M.map(function(){return 0}),R=[T+ (ph-100*K)/2,100*K];
    var paths=[];
    F.forEach(function(f,i){var ya=a[f[0]][0]+offA[f[0]],ym=m[f[1]][0]+offM[f[1]],hh=f[2]*K;offA[f[0]]+=hh;offM[f[1]]+=hh;paths.push([x0+nw,ya,x1,ym,hh,f[0]===0||f[0]===2]);});
    var offR=0;M.forEach(function(mm,i){paths.push([x1+nw,m[i][0],x2,R[0]+offR,m[i][1],true]);offR+=m[i][1];});
    paths.forEach(function(p,i){var mx=(p[0]+p[2])/2;c.beginPath();c.moveTo(p[0],p[1]);c.bezierCurveTo(mx,p[1],mx,p[3],p[2],p[3]);c.lineTo(p[2],p[3]+p[4]);c.bezierCurveTo(mx,p[3]+p[4],mx,p[1]+p[4],p[0],p[1]+p[4]);c.closePath();
      var hl=p[5];c.fillStyle=hl?rgba(P.j,.14+.06*Math.sin(t*1.5+i)):(P.l?'rgba(10,10,10,.06)':'rgba(255,255,255,.07)');c.fill();});
    sp-=dt;if(sp<=0){pts.push({i:Math.floor(rnd(0,paths.length)),u:0,o:Math.random()});sp=.03;}
    for(var j=pts.length-1;j>=0;j--){var q=pts[j];q.u+=dt*.45;if(q.u>1){pts.splice(j,1);continue;}var p=paths[q.i],u=q.u,v=1-u,mx=(p[0]+p[2])/2;
      var x=v*v*v*p[0]+3*v*v*u*mx+3*v*u*u*mx+u*u*u*p[2],yA=p[1]+p[4]*q.o,yB=p[3]+p[4]*q.o,y=v*v*v*yA+3*v*v*u*yA+3*v*u*u*yB+u*u*u*yB;
      c.fillStyle=p[5]?P.j:P.dim;c.fillRect(x-1,y-1,2,2);}
    c.font=(mob?10:12)+'px Switzer,sans-serif';
    A.forEach(function(n,i){c.fillStyle=P.ink;c.fillRect(x0,a[i][0],nw,a[i][1]);c.textAlign='right';c.fillText(n[0],x0-8,a[i][0]+a[i][1]/2+4);});
    M.forEach(function(n,i){c.fillStyle=P.ink;c.fillRect(x1,m[i][0],nw,m[i][1]);c.textAlign='center';c.fillStyle=P.bg;c.fillRect(x1+nw+4,m[i][0]+m[i][1]/2-9,c.measureText(n[0]).width+10,18);c.fillStyle=P.ink;c.textAlign='left';c.fillText(n[0],x1+nw+9,m[i][0]+m[i][1]/2+4);});
    c.fillStyle=P.j;c.fillRect(x2,R[0],nw+2,R[1]);c.textAlign='left';c.font='500 '+(mob?11:13)+'px Switzer,sans-serif';c.fillText('Revenue',x2+16,R[0]+R[1]/2);if(!mob){c.font='10px "Geist Mono",monospace';c.fillStyle=P.mut;c.fillText('3.24× SPEND',x2+16,R[0]+R[1]/2+16);}c.textAlign='start';});};
// team load heatmap (26 weeks)
D.hm=function(cv){var rows=['Strategy','Media','Creators','Content','Tech','Finance'],W=26,v=[];for(var r=0;r<rows.length;r++){var a=[],b=rnd(.45,.75);for(var k=0;k<W;k++){b=Math.max(.15,Math.min(1.05,b+rnd(-.12,.13)));a.push(b)}v.push(a)}
  mount(cv,function(c,w,h,t){var P=pal(cv);c.clearRect(0,0,w,h);var mob=w<520,L=mob?64:86,T=24,R=12,B=28,cw=(w-L-R)/W,ch=(h-T-B)/rows.length,now=Math.floor((t*2.2)%W);
    c.font=(mob?10:12)+'px Switzer,sans-serif';
    rows.forEach(function(r,i){c.fillStyle=P.mut;c.textAlign='right';c.fillText(r,L-10,T+i*ch+ch/2+4);
      for(var k=0;k<W;k++){var x=L+k*cw,y=T+i*ch,val=v[i][k],over=val>.95,rev=k<=now?1:.35;
        c.fillStyle=over?(P.l?'#0A0A0A':'#F2F2F2'):rgba(P.j,(0.08+val*.8)*rev);c.globalAlpha=over?rev:1;
        var pad=Math.max(1.5,cw*.12);c.fillRect(x+pad/2,y+pad/2,cw-pad,ch-pad);c.globalAlpha=1;}});
    var nx=L+now*cw;c.strokeStyle=P.j;c.lineWidth=1.5;c.strokeRect(nx,T-4,cw,rows.length*ch+8);
    c.textAlign='left';c.font=(mob?9:10)+'px "Geist Mono",monospace';c.fillStyle=P.mut;['W1','W13','W26'].forEach(function(s,i){var k=[0,12,25][i];c.textAlign=i==2?'right':'left';c.fillText(s,L+k*cw+(i==2?cw:0),h-8)});
    c.textAlign='right';c.fillStyle=P.ink;c.fillText('■ OVER 95% LOAD',w-R,14);c.textAlign='start';});};
// project margin bubbles
D.bb=function(cv){var pr=[];for(var i=0;i<14;i++){pr.push({x:rnd(.08,.92),y:rnd(.08,.36),r:rnd(.35,1),ph:rnd(0,6)})}pr[3]={x:.62,y:.4,r:.9,ph:1,hero:1};pr[9]={x:.3,y:.03,r:.7,ph:2,low:1};
  mount(cv,function(c,w,h,t){var P=pal(cv);c.clearRect(0,0,w,h);var mob=w<520,L=40,R=16,T=20,B=34,pw=w-L-R,ph=h-T-B,tg=.25;
    function X(v){return L+pw*v}function Y(v){return T+ph*(1-v/.5)}
    c.strokeStyle=P.grid;c.lineWidth=1;[0,.1,.2,.3,.4,.5].forEach(function(g){c.beginPath();c.moveTo(L,Y(g));c.lineTo(L+pw,Y(g));c.stroke();c.font='10px "Geist Mono",monospace';c.fillStyle=P.mut;c.textAlign='right';c.fillText(Math.round(g*100)+'%',L-6,Y(g)+3)});
    c.setLineDash([5,4]);c.strokeStyle=P.j;c.beginPath();c.moveTo(L,Y(tg));c.lineTo(L+pw,Y(tg));c.stroke();c.setLineDash([]);c.textAlign='left';c.fillStyle=P.j;c.fillText('TARGET 25%',L+6,Y(tg)-6);
    pr.forEach(function(p){var x=X(p.x)+Math.sin(t*.6+p.ph)*3,y=Y(p.y)+Math.cos(t*.5+p.ph)*3,rr=(mob?6:8)+p.r*(mob?14:20),ab=p.y>=tg;
      c.beginPath();c.arc(x,y,rr,0,6.284);c.fillStyle=ab?rgba(P.j,p.hero?.85:.28):(P.l?'rgba(10,10,10,.08)':'rgba(255,255,255,.08)');c.fill();c.strokeStyle=ab?P.j:P.dim;c.lineWidth=1;c.stroke();
      if(p.hero||p.low){var k=(t*.7)%1;c.strokeStyle=rgba(p.hero?P.j:(P.l?'#0A0A0A':'#F2F2F2'),(1-k)*.6);c.beginPath();c.arc(x,y,rr+4+k*16,0,6.284);c.stroke();
        c.font='500 '+(mob?10:12)+'px Switzer,sans-serif';c.fillStyle=P.ink;c.fillText(p.hero?'Retail always-on · 44%':'Launch event · 3%',x+rr+8,y+4);}});
    c.font='10px "Geist Mono",monospace';c.fillStyle=P.mut;c.textAlign='right';c.fillText('PROJECT REVENUE →',L+pw,h-10);c.textAlign='start';});};
// cash runway with monte carlo paths
D.cash=function(cv){var N=40,paths=[];for(var p=0;p<N;p++){var v=.42,a=[v];for(var k=1;k<24;k++){v+=rnd(-.05,.055)+.012;a.push(v)}paths.push(a)}
  mount(cv,function(c,w,h,t){var P=pal(cv);c.clearRect(0,0,w,h);var L=16,R=16,T=20,B=30,pw=w-L-R,ph=h-T-B,M=24,k0=6,rev=Math.min(1,(t%11)/5);
    function X(i){return L+pw*i/(M-1)}function Y(v){return T+ph*(1-v)}
    c.strokeStyle=P.grid;for(var g=1;g<4;g++){c.beginPath();c.moveTo(L,T+ph*g/4);c.lineTo(L+pw,T+ph*g/4);c.stroke();}
    var lim=k0+Math.floor((M-1-k0)*rev);
    paths.forEach(function(a,pi){c.beginPath();for(var i=k0;i<=lim;i++){var y=a[k0]+(a[i]-a[k0]);i==k0?c.moveTo(X(i),Y(paths[0][k0])):c.lineTo(X(i),Y(paths[0][k0]+(a[i]-a[k0])))}c.strokeStyle=rgba(P.j,.12);c.lineWidth=1;c.stroke();});
    var med=[];for(var i=k0;i<=lim;i++){var col=paths.map(function(a){return a[i]-a[k0]}).sort(function(x,y){return x-y});med.push(col[N>>1])}
    c.beginPath();med.forEach(function(m,j){var x=X(k0+j),y=Y(paths[0][k0]+m);j?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle=P.j;c.lineWidth=2.2;c.stroke();
    c.beginPath();for(var i=0;i<=k0;i++){var y=Y(paths[0][i]);i?c.lineTo(X(i),y):c.moveTo(X(i),y)}c.strokeStyle=P.ink;c.lineWidth=2;c.stroke();
    c.strokeStyle=P.dim;c.setLineDash([3,3]);c.beginPath();c.moveTo(X(k0),T);c.lineTo(X(k0),T+ph);c.stroke();c.setLineDash([]);
    c.font='10px "Geist Mono",monospace';c.fillStyle=P.mut;c.fillText('TODAY',X(k0)+6,T+10);c.textAlign='right';c.fillText('+18 MONTHS',L+pw,h-10);c.textAlign='left';c.fillText('CASH · 40 SIMULATED PATHS',L,h-10);c.textAlign='start';});};

// team data input: rows land, get checked or flagged
D.inp=function(cv){var R=[['COST','Retail','48.5M',1],['HOURS','Media','16h',1],['REVENUE','Invoice 0142','310M',1],['COST','Studio','32M',0],['COST','Creator','7.5M',1],['HOURS','Content','12h',1],['COST','New vendor','21M',0]],k=0,rows=[],acc=1;
  mount(cv,function(c,w,h,t,dt){c.clearRect(0,0,w,h);acc+=dt;if(acc>1.3){acc=0;rows.unshift({r:R[k++%R.length],a:0});if(rows.length>6)rows.pop();}
    var rh=(h-24)/5;rows.forEach(function(o,i){o.a=Math.min(1,o.a+dt*2.5);var y=12+i*rh-(1-o.a)*rh*.6;c.globalAlpha=o.a*(1-i*.14);
      c.strokeStyle='rgba(255,255,255,.08)';c.strokeRect(16,y+4,w-32,rh-8);c.font='10px "Geist Mono",monospace';c.fillStyle='#7A7A7A';c.fillText(o.r[0],28,y+rh/2+3);
      c.font='13px Switzer,sans-serif';c.fillStyle='#DADADA';c.fillText(o.r[1],96,y+rh/2+4);c.textAlign='right';c.fillStyle='#F2F2F2';c.fillText(o.r[2],w-64,y+rh/2+4);c.textAlign='start';
      var ok=o.r[3],cx=w-40,cy=y+rh/2;if(o.a>.9){c.fillStyle=ok?J:'#5E5E5E';c.beginPath();c.arc(cx,cy,7,0,6.284);c.fill();c.strokeStyle=ok?'#050505':'#F2F2F2';c.lineWidth=1.6;c.beginPath();if(ok){c.moveTo(cx-3,cy);c.lineTo(cx-1,cy+2.5);c.lineTo(cx+3.5,cy-2.5)}else{c.moveTo(cx,cy-3.5);c.lineTo(cx,cy+1);c.moveTo(cx,cy+3);c.lineTo(cx,cy+3.6)}c.stroke();c.lineWidth=1;}});c.globalAlpha=1;});};
function init(){
  J=sig();
  document.querySelectorAll('canvas[data-bs]').forEach(function(cv){var f=D[cv.getAttribute('data-bs')];if(f)f(cv)});
  // dials
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);
    var v=e.target.querySelector('.val'),max=+e.target.getAttribute('data-max'),val=+e.target.getAttribute('data-v'),C=2*Math.PI*52;
    v.style.strokeDashoffset=C*(1-val/max);var n=e.target.querySelector('.num'),dec=+(e.target.getAttribute('data-d')||0),t0=performance.now();
    (function tick(t){var u=Math.min(1,(t-t0)/2200),k=1-Math.pow(1-u,3);n.textContent=(val*k).toFixed(dec);if(u<1)requestAnimationFrame(tick)})(t0);});},{threshold:.4});
  document.querySelectorAll('[data-bs-dial]').forEach(function(d){var v=d.querySelector('.val'),C=2*Math.PI*52;v.style.strokeDasharray=C;v.style.strokeDashoffset=C;io.observe(d)});
  // feed
  document.querySelectorAll('[data-bs-feed]').forEach(function(ul){
    var F=[['hot','Outlier','Creator segment C returning 4.2× the average'],['','Pacing','TikTok budget 12% ahead of plan, day 18 of 30'],['hot','Forecast','Quarter revenue tracking at P50, on target'],['','Saturation','Meta frequency 3.8, rotate creative this week'],['hot','Budget','Move 15% from search to creators'],['','Data','8 of 8 sources synced']],k=0;
    function add(){var f=F[k++%F.length],li=document.createElement('li');li.className=f[0];li.innerHTML='<i></i><b>'+f[1]+'</b><span>'+f[2]+'</span>';ul.insertBefore(li,ul.firstChild);while(ul.children.length>5)ul.removeChild(ul.lastChild);}
    add();add();add();if(!RM)setInterval(add,2800);});
  // light / dark toggle on the product console
  document.querySelectorAll('[data-bs-theme]').forEach(function(tg){var tgt=document.querySelector(tg.getAttribute('data-bs-theme'));
    tg.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){tg.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});tgt.classList.toggle('light',b.getAttribute('data-t')==='light')})})});
  // hero entrance
  document.querySelectorAll('.bs-hero').forEach(function(h){requestAnimationFrame(function(){setTimeout(function(){h.classList.add('bs-go')},120)})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

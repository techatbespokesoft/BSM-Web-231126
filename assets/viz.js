/* v34: keep canvas text inside its canvas on every screen (skips rotated text) */
(function(){var P=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;if(!P||P.__bspClamp)return;P.__bspClamp=1;var ft=P.fillText;
P.fillText=function(t,x,y,mw){try{var m=this.getTransform?this.getTransform():null;if(m&&!m.b&&!m.c&&m.a>0){var tw=this.measureText(t).width,al=this.textAlign,l=al=='center'?x-tw/2:(al=='right'||al=='end')?x-tw:x,L=m.a*l+m.e,R=m.a*(l+tw)+m.e,W=this.canvas.width,pad=3*m.a,dx=0;if(L<pad)dx=(pad-L)/m.a;else if(R>W-pad)dx=(W-pad-R)/m.a;if(tw*m.a<W-2*pad)x+=dx}}catch(e){}return ft.call(this,t,x,y,mw)}})();
/* Bespoke viz library: service explorers with one animated model per item. */
(function(){
var root=getComputedStyle(document.documentElement);
var SIG=(root.getPropertyValue('--sig-d')||'').trim()||'#2AA880';
var W='#F2F2F2',T='#9A9A9A',M='#6A6A6A',G='rgba(255,255,255,.07)';
var F='"Be Vietnam Pro",system-ui,sans-serif';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(x){return x<0?0:x>1?1:x}
function e(t,d,s){var x=cl((t-(s||0))/(d||1));return 1-Math.pow(1-x,3)}
function A(hex,a){var n=parseInt(hex.replace('#',''),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}
function font(c,o){c.font=(o.w||400)+' '+(o.s||11)+'px '+F}
function tx(c,s,x,y,o){o=o||{};font(c,o);c.fillStyle=o.c||T;c.textAlign=o.a||'left';c.textBaseline=o.b||'alphabetic';
  if(o.mw&&c.measureText(s).width>o.mw){var t=s;while(t.length>3&&c.measureText(t.replace(/\s+$/,'')+'…').width>o.mw)t=t.slice(0,-2);s=t.replace(/\s+$/,'')+'…'}
  c.fillText(s,x,y)}
function cap(c,s,x,y,o){o=o||{};o.s=o.s||10;o.w=500;tx(c,s.toUpperCase().split('').join(' '),x,y,o)}
function capW(c,s,o){o=o||{};font(c,{s:o.s||10,w:500});return c.measureText(s.toUpperCase().split('').join(' ')).width}
/* legend: dot + caption items laid out left to right, wrapping upwards when the canvas is too narrow */
function legend(c,items,x0,yb,xmax){var rows=[[]],x=x0;items.forEach(function(it){var wd=10+capW(c,it[0]);if(it[2]!=null)x=Math.max(x,it[2]);if(rows[rows.length-1].length&&x+wd>xmax){rows.push([]);x=x0}rows[rows.length-1].push([it,x]);x+=wd+22});
  rows.forEach(function(r,i){var y=yb-(rows.length-1-i)*18;r.forEach(function(q){dot(c,q[1],y-4,4,q[0][1]);cap(c,q[0][0],q[1]+10,y)})})}
function lines(c,s,mw,o){font(c,o||{});var ws=s.split(' '),out=[],cur='';ws.forEach(function(w){var n=cur?cur+' '+w:w;if(c.measureText(n).width>mw&&cur){out.push(cur);cur=w}else cur=n});if(cur)out.push(cur);return out}
function wrap(c,s,x,y,mw,lh,o){lines(c,s,mw,o).forEach(function(l,i){tx(c,l,x,y+i*lh,o)})}
function rr(c,x,y,w,h,r){if(w<0){x+=w;w=-w}if(h<0){y+=h;h=-h}r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function bar(c,x,base,w,h,col,r){if(h<=.5)return;r=Math.min(r==null?3:r,w/2,h);c.beginPath();c.moveTo(x,base);c.lineTo(x,base-h+r);c.arcTo(x,base-h,x+r,base-h,r);c.lineTo(x+w-r,base-h);c.arcTo(x+w,base-h,x+w,base-h+r,r);c.lineTo(x+w,base);c.closePath();c.fillStyle=col;c.fill()}
function hbar(c,x,y,w,h,col){if(w<=.5)return;var r=Math.min(3,h/2,w);c.beginPath();c.moveTo(x,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);c.lineTo(x,y+h);c.closePath();c.fillStyle=col;c.fill()}
function hl(c,x1,x2,y,col){c.strokeStyle=col||G;c.lineWidth=1;c.beginPath();c.moveTo(x1,Math.round(y)+.5);c.lineTo(x2,Math.round(y)+.5);c.stroke()}
function vl(c,x,y1,y2,col,dash){c.save();if(dash)c.setLineDash(dash);c.strokeStyle=col||G;c.lineWidth=1;c.beginPath();c.moveTo(Math.round(x)+.5,y1);c.lineTo(Math.round(x)+.5,y2);c.stroke();c.restore()}
function dot(c,x,y,r,col){if(r<=0)return;c.beginPath();c.arc(x,y,r,0,7);c.fillStyle=col;c.fill()}
function ring(c,x,y,r,col,lw){c.beginPath();c.arc(x,y,Math.max(0,r),0,7);c.strokeStyle=col;c.lineWidth=lw||1;c.stroke()}
function R(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function line(c,pts,col,lw,p){if(p==null)p=1;if(p<=0||pts.length<2)return;var f=p*(pts.length-1),k=Math.floor(f);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<=k&&i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);if(k<pts.length-1){var a=pts[k],b=pts[k+1],r=f-k;c.lineTo(a[0]+(b[0]-a[0])*r,a[1]+(b[1]-a[1])*r)}c.strokeStyle=col;c.lineWidth=lw||1.5;c.lineJoin='round';c.lineCap='round';c.stroke();c.lineCap='butt'}
function box(w,h,p){var l=p.l,r=w-p.r,t=p.t,b=h-p.b;return{l:l,r:r,t:t,b:b,w:r-l,h:b-t}}
function grid(c,B,n){for(var k=0;k<=n;k++)hl(c,B.l,B.r,B.t+B.h*k/n)}
function bez(a,b,cc,d,s){var u=1-s;return u*u*u*a+3*u*u*s*b+3*u*s*s*cc+s*s*s*d}
function chip(c,x,y,w,h,label,o){o=o||{};c.fillStyle=o.fill||'#111';rr(c,x,y,w,h,5);c.fill();c.strokeStyle=o.stroke||'rgba(255,255,255,.12)';c.lineWidth=1;c.stroke();tx(c,label,x+(o.center?w/2:12),y+h/2,{b:'middle',s:o.s||12,c:o.c||W,a:o.center?'center':'left',mw:w-20})}

var V={};

/* ---------------- INTELLIGENCE ---------------- */
V['i-audit']=function(c,w,h,t){var B=box(w,h,{t:44,b:70,l:24,r:24});grid(c,B,4);
  var d=[['Media spend',100],['Non-converting audiences',-18],['Duplicate reach',-9],['Untracked sales',-7],['Productive spend',66]];
  if(w<560)d.forEach(function(r,i){r[0]=['Spend','Wasted','Duplicate','Untracked','Productive'][i]});var n=d.length,g=B.w/n,bw=Math.min(g*.52,72),run=100,Y=function(v){return B.b-B.h*v/100};
  d.forEach(function(r,i){var p=e(t,.8,.2+i*.45),x=B.l+g*i+(g-bw)/2,tot=(i==0||i==n-1),top,bot;
    if(tot){top=Y(r[1]);bot=B.b}else{top=Y(run);bot=Y(run+r[1]);run+=r[1]}
    var col=i==n-1?SIG:tot?'#8A8A8A':'#454545';
    if(tot)bar(c,x,bot,bw,(bot-top)*p,col);else if(p>0){c.fillStyle=col;rr(c,x,top,bw,(bot-top)*p,2);c.fill()}
    if(i<n-1){var q=e(t,.4,1+i*.45),yy=tot?top:bot;if(q>0){c.save();c.setLineDash([3,3]);c.strokeStyle=M;c.beginPath();c.moveTo(x+bw,yy);c.lineTo(x+bw+(g-bw)*q,yy);c.stroke();c.restore()}}
    c.globalAlpha=p;tx(c,(r[1]<0?'−':'')+Math.abs(r[1])+'%',x+bw/2,tot?top-10:bot+16,{a:'center',s:13,c:i==n-1?W:T,w:i==n-1?500:400});
    wrap(c,r[0],x+bw/2,B.b+22,g-6,14,{a:'center',s:11,c:i==n-1?W:T});c.globalAlpha=1});
  };
V['i-market']=function(c,w,h,t){var cx=w/2,cy=h/2-16,Rr=Math.min(w*.28,h*.32);
  var ax=['Market size','Competition','Media cost','Digital adoption','Margin'],
      mk=[['Vietnam',[.92,.78,.42,.86,.55]],['Singapore',[.45,.9,.92,.96,.82]],['Malaysia',[.6,.6,.58,.8,.66]],['Thailand',[.8,.74,.5,.84,.6]]];
  var n=ax.length,ang=function(i){return -Math.PI/2+i*2*Math.PI/n},i,a;
  for(var g=1;g<=4;g++){c.beginPath();for(i=0;i<=n;i++){a=ang(i%n);var r=Rr*g/4;c[i?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r)}c.strokeStyle=G;c.lineWidth=1;c.stroke()}
  for(i=0;i<n;i++){a=ang(i);c.strokeStyle=G;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr);c.stroke();
    var co=Math.cos(a);tx(c,ax[i],cx+co*(Rr+14),cy+Math.sin(a)*(Rr+14)+(Math.sin(a)<-.9?-4:0),{a:Math.abs(co)<.2?'center':co>0?'left':'right',b:'middle',s:11})}
  var per=1.9,act=Math.floor(Math.max(0,t-.6)/per)%4,pt=Math.max(0,t-.6)%per,grow=e(t,1.2);
  var order=[0,1,2,3].filter(function(j){return j!=act}).concat([act]);
  order.forEach(function(j){var m=mk[j],on=j==act,s=grow*(on?(.8+.2*e(pt,.6)):1);c.beginPath();
    m[1].forEach(function(v,i){var a=ang(i),r=Rr*v*s;c[i?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r)});c.closePath();
    if(on){c.fillStyle=A(SIG,.16);c.fill();c.strokeStyle=SIG;c.lineWidth=2}else{c.strokeStyle='#454545';c.lineWidth=1}c.stroke();
    if(on)m[1].forEach(function(v,i){var a=ang(i);dot(c,cx+Math.cos(a)*Rr*v*s,cy+Math.sin(a)*Rr*v*s,3.5,SIG)})});
  var sp=Math.min(112,w/4.3);mk.forEach(function(m,j){var x=cx+(j-1.5)*sp,on=j==act;dot(c,x-c.measureText(m[0]).width/2-10,h-22,3.5,on?SIG:'#454545');font(c,{s:12});tx(c,m[0],x,h-22,{a:'center',b:'middle',s:12,c:on?W:T})});
};
V['i-outlier']=function(c,w,h,t){var B=box(w,h,{t:56,b:44,l:30,r:30}),n=34,vals=[],i;
  for(i=0;i<n;i++){var v=Math.exp(-Math.pow(i-11,2)/38)+.04;if(i>=28)v=[.16,.21,.13,.18,.11,.08][i-28];vals.push(v)}
  var g=B.w/n,bw=Math.max(2,g-2);hl(c,B.l,B.r,B.b,'#3A3A3A');
  vals=vals.map(function(v){return v/1.2});vals.forEach(function(v,i){var p=e(t,.6,.1+i*.035),tail=i>=28;var pulse=tail&&t>2.6?.85+.15*Math.sin(t*3+i):1;c.globalAlpha=pulse;bar(c,B.l+g*i+1,B.b,bw,B.h*v*p,tail?SIG:'#555',2);c.globalAlpha=1});
  var ax=B.l+g*11.5,q=e(t,.6,1.4);c.globalAlpha=q;vl(c,ax,B.t-14,B.b,T,[3,4]);cap(c,'Portfolio average',ax+8,B.t-6);
  var q2=e(t,.6,2.2);c.globalAlpha=q2;var x1=B.l+g*28,x2=B.r,yb=B.b-B.h*.21/1.2-22;c.strokeStyle=SIG;c.lineWidth=1;c.beginPath();c.moveTo(x1,yb+6);c.lineTo(x1,yb);c.lineTo(x2,yb);c.lineTo(x2,yb+6);c.stroke();
  cap(c,'Outlier tail',x2,yb-10,{a:'right',c:W});c.globalAlpha=1;
  cap(c,'Return on spend →',B.r,B.b+24,{a:'right'});cap(c,'Segments',B.l,B.t-26);
};
V['i-attrib']=function(c,w,h,t){var B=box(w,h,{t:28,b:28,l:Math.min(110,w*.26),r:Math.min(96,w*.22)});
  var ch=[['Meta',30],['Google',24],['TikTok',18],['KOC',16],['Search',12]],hi=3,gap=10,H=B.h-gap*(ch.length-1);
  var x0=B.l,x1=B.r,xm=(x0+x1)/2,yl=B.t,yr=B.t+(B.h-H)/2,p=e(t,1.6,.1),geo=[];
  c.save();c.beginPath();c.rect(0,0,x0+(x1-x0)*p+2,h);c.clip();
  ch.forEach(function(r,i){var hh=H*r[1]/100,a0=yl,a1=yl+hh,b0=yr,b1=yr+hh;
    c.beginPath();c.moveTo(x0,a0);c.bezierCurveTo(xm,a0,xm,b0,x1,b0);c.lineTo(x1,b1);c.bezierCurveTo(xm,b1,xm,a1,x0,a1);c.closePath();
    c.fillStyle=i==hi?A(SIG,.38):'rgba(255,255,255,.08)';c.fill();geo.push([a0,a1,b0,b1]);yl=a1+gap;yr=b1});
  c.restore();
  geo.forEach(function(g,i){c.fillStyle=i==hi?SIG:'#8A8A8A';c.fillRect(x0-6,g[0],6,g[1]-g[0]);
    tx(c,ch[i][0],x0-14,(g[0]+g[1])/2-7,{a:'right',b:'middle',s:12,c:i==hi?W:T,w:i==hi?500:400});tx(c,ch[i][1]+'%',x0-14,(g[0]+g[1])/2+9,{a:'right',b:'middle',s:11,c:i==hi?SIG:M});
    if(p>.95)for(var j=0;j<4;j++){var s=(t*.22+j/4+i*.13)%1,a=(g[0]+g[1])/2,b=(g[2]+g[3])/2;dot(c,bez(x0,xm,xm,x1,s),bez(a,a,b,b,s),i==hi?2.2:1.6,i==hi?SIG:'rgba(255,255,255,.45)')}});
  c.fillStyle='#BDBDBD';c.fillRect(x1,yr-H,6,H);c.globalAlpha=p;tx(c,'Revenue',x1+16,B.t+B.h/2-8,{b:'middle',s:13,c:W,w:500});tx(c,'100%',x1+16,B.t+B.h/2+10,{b:'middle',s:11,c:T});c.globalAlpha=1;
};
V['i-growth']=function(c,w,h,t){var B=box(w,h,{t:36,b:44,l:28,r:84});grid(c,B,4);
  var hist=[40,44,43,49,52,55,58,63],N=12,last=63,up=[],ba=[],dn=[],i;
  for(i=1;i<=4;i++){up.push(last*Math.pow(1.11,i));ba.push(last*Math.pow(1.065,i));dn.push(last*Math.pow(1.02,i))}
  var mx=up[3]*1.08,X=function(i){return B.l+B.w*i/(N-1)},Y=function(v){return B.b-B.h*v/mx};
  line(c,hist.map(function(v,i){return[X(i),Y(v)]}),W,2,e(t,1.4,.1));
  var xT=X(7);vl(c,xT,B.t,B.b,M,[2,4]);cap(c,'Today',xT,B.b+20,{a:'center'});
  var q=e(t,1.4,1.5);if(q>0){c.save();c.beginPath();c.rect(xT,0,(B.r-xT)*q+2,h);c.clip();
    c.beginPath();c.moveTo(xT,Y(last));up.forEach(function(v,i){c.lineTo(X(8+i),Y(v))});for(i=3;i>=0;i--)c.lineTo(X(8+i),Y(dn[i]));c.closePath();c.fillStyle=A(SIG,.14);c.fill();
    [[up,'#5A5A5A',1],[dn,'#5A5A5A',1],[ba,SIG,2.2]].forEach(function(s){line(c,[[xT,Y(last)]].concat(s[0].map(function(v,i){return[X(8+i),Y(v)]})),s[1],s[2])});c.restore()}
  var q2=e(t,.5,2.9);c.globalAlpha=q2;tx(c,'Upside',B.r+10,Y(up[3]),{b:'middle',s:11});tx(c,'Base',B.r+10,Y(ba[3]),{b:'middle',s:12,c:W,w:500});tx(c,'Downside',B.r+10,Y(dn[3]),{b:'middle',s:11});c.globalAlpha=1;
  dot(c,xT,Y(last),4,W);cap(c,'Past 8 quarters',B.l,B.b+20);cap(c,'Next 4',B.r,B.b+20,{a:'right'});
};
V['i-media']=function(c,w,h,t){var rows=['Meta','Google','TikTok','YouTube','Zalo'],cols=['Prospecting','Lookalike','Retargeting','CRM'];
  var B=box(w,h,{t:46,b:46,l:Math.min(80,w*.2),r:20}),rnd=R(7),cw=B.w/cols.length,chh=B.h/rows.length,cells=[];
  rows.forEach(function(r,i){cols.forEach(function(cc,j){cells.push({i:i,j:j,v:.6+rnd()*3.6,o:rnd()})})});
  var s=cells.slice().sort(function(a,b){return b.v-a.v}),win=s.slice(0,4),lose=s.slice(-6),dec=e(t,.6,2.8);
  cols.forEach(function(x,j){cap(c,x,B.l+cw*j+cw/2,B.t-14,{a:'center',mw:cw-8})});rows.forEach(function(x,i){tx(c,x,B.l-12,B.t+chh*i+chh/2,{a:'right',b:'middle',s:12})});
  cells.forEach(function(k){var p=e(t,.35,.2+k.o*1.8),x=B.l+cw*k.j+2,y=B.t+chh*k.i+2,ww=cw-4,hh=chh-4,isW=win.indexOf(k)>=0,isL=lose.indexOf(k)>=0;
    var lum=Math.round(24+(k.v/4.2)*54);c.globalAlpha=p*(isL?1-.6*dec:1);c.fillStyle='rgb('+lum+','+lum+','+lum+')';rr(c,x,y,ww,hh,3);c.fill();
    if(isW&&dec>0){c.fillStyle=A(SIG,dec*(.82+.18*Math.sin(t*3)));rr(c,x,y,ww,hh,3);c.fill()}
    tx(c,k.v.toFixed(1)+'×',x+ww/2,y+hh/2,{a:'center',b:'middle',s:12,c:isW&&dec>.5?'#04130D':W,w:isW?600:400});c.globalAlpha=1});
  c.globalAlpha=dec;dot(c,B.l+4,h-20,4,SIG);cap(c,'Scale',B.l+14,h-16);dot(c,B.l+80,h-20,4,'#2A2A2A');cap(c,'Cut',B.l+90,h-16);c.globalAlpha=1;
};

/* ---------------- BOARD QUESTIONS ---------------- */
V['q-budget']=function(c,w,h,t){var d=[['Meta',32,24],['Google',22,30],['TikTok',18,12],['KOC',10,19],['Display',12,4],['Organic search',6,11]];
  var B=box(w,h,{t:54,b:16,l:Math.min(120,w*.3),r:52}),rh=B.h/d.length,sx=B.w/34;
  hbar(c,B.l,22,14,7,'#4A4A4A');cap(c,'Share of spend',B.l+20,29);hbar(c,B.l+140,22,14,7,'#9A9A9A');cap(c,'Share of revenue',B.l+160,29);
  d.forEach(function(r,i){var y=B.t+rh*i+rh/2,p=e(t,.8,.2+i*.12),bh=Math.min(9,rh*.22),hi=r[2]>r[1];
    tx(c,r[0],B.l-14,y,{a:'right',b:'middle',s:12,c:hi?W:T,mw:B.l-20});
    hbar(c,B.l,y-bh-2,r[1]*sx*p,bh,'#4A4A4A');hbar(c,B.l,y+2,r[2]*sx*p,bh,hi?SIG:'#9A9A9A');
    c.globalAlpha=e(t,.4,1+i*.12);tx(c,r[1]+'%',B.l+r[1]*sx*p+8,y-bh/2-2,{b:'middle',s:10,c:M});tx(c,r[2]+'%',B.l+r[2]*sx*p+8,y+bh/2+2,{b:'middle',s:11,c:hi?W:T,w:hi?500:400});c.globalAlpha=1});
};
V['q-marginal']=function(c,w,h,t){var B=box(w,h,{t:44,b:46,l:34,r:28}),k=.32,f=function(s){return 1-Math.exp(-s/k)},ss=k*Math.log(1/k);
  var X=function(s){return B.l+B.w*s},Y=function(v){return B.b-B.h*v*.92};grid(c,B,4);
  var p=e(t,1.4,.1),pts=[],i,s;for(i=0;i<=80;i++){s=i/80;pts.push([X(s),Y(f(s))])}
  c.save();c.beginPath();c.rect(B.l,0,B.w*p,h);c.clip();
  c.beginPath();c.moveTo(X(0),B.b);for(i=0;i<=80;i++){s=i/80;if(s>ss)break;c.lineTo(X(s),Y(f(s)))}c.lineTo(X(ss),Y(f(ss)));c.lineTo(X(ss),B.b);c.closePath();c.fillStyle=A(SIG,.15);c.fill();
  c.beginPath();c.moveTo(X(ss),B.b);for(s=ss;s<=1.0001;s+=1/80)c.lineTo(X(s),Y(f(s)));c.lineTo(X(1),B.b);c.closePath();c.fillStyle='rgba(255,255,255,.035)';c.fill();c.restore();
  line(c,pts,W,2,p);
  var q=e(t,.6,1.5);c.globalAlpha=q;vl(c,X(ss),B.t-8,B.b,SIG,[3,3]);cap(c,'Stop point',X(ss)+10,B.t+2,{c:W});tx(c,'Marginal return falls below 1.0',X(ss)+10,B.t+18,{s:11,mw:B.r-X(ss)-12});
  cap(c,'Efficient',X(ss/2),B.b-12,{a:'center',c:SIG});cap(c,'Diminishing',X((1+ss)/2),B.b-12,{a:'center'});
  if(t>1.8){var m=((t-1.8)*.16)%1;dot(c,X(m),Y(f(m)),5,m<ss?SIG:'#8A8A8A');ring(c,X(m),Y(f(m)),10,m<ss?A(SIG,.4):'rgba(255,255,255,.2)')}
  c.globalAlpha=1;cap(c,'Spend →',B.r,B.b+24,{a:'right'});cap(c,'Revenue',B.l,B.t-24);
};
var RK={};
V['q-rank']=function(c,w,h,t){var names=['HCMC · 25 to 34','Hanoi · 18 to 24','KOC · Beauty','Search · Brand','TikTok · Lookalike','Meta · Retargeting','Singapore · Prospecting','Zalo · CRM'];
  var base=[2.4,1.6,2.1,1.8,1.3,1.5,1.1,.9],B=box(w,h,{t:34,b:28,l:Math.min(160,w*.38),r:70}),n=names.length,rh=B.h/n,mx=3.4;
  var vals=base.map(function(v,i){return Math.max(.3,v+.55*Math.sin(t*.7+i*1.7))});
  var ord=vals.map(function(v,i){return i}).sort(function(a,b){return vals[b]-vals[a]});
  ord.forEach(function(idx,rank){var ty=B.t+rank*rh;RK[idx]=(RK[idx]==null||t<.05)?ty:RK[idx]+(ty-RK[idx])*.08});
  var x1=B.l+B.w/mx;vl(c,x1,B.t-12,B.b,M,[2,4]);cap(c,'Average',x1,B.t-18,{a:'center'});
  names.forEach(function(s,i){var y=RK[i],p=e(t,.9,.1+i*.06),top=ord[0]==i,bw=B.w*vals[i]/mx*p,bh=Math.min(16,rh*.5),yc=y+rh/2;
    tx(c,s,B.l-12,yc,{a:'right',b:'middle',s:12,c:top?W:T,w:top?500:400,mw:B.l-16});hbar(c,B.l,yc-bh/2,bw,bh,top?SIG:'#3E3E3E');
    tx(c,vals[i].toFixed(1)+'×',B.l+bw+8,yc,{b:'middle',s:11,c:top?W:T})});
};
V['q-target']=function(c,w,h,t){var B=box(w,h,{t:44,b:52,l:24,r:24}),act=[52,55,58,63],lo=[64,67,71,75],hi=[70,76,83,90],mid=[67,71.5,77,82.5],mx=96,n=8,g=B.w/n,bw=g*.46,Y=function(v){return B.b-B.h*v/mx};
  grid(c,B,4);
  act.forEach(function(v,i){var p=e(t,.7,.15+i*.15),x=B.l+g*i+(g-bw)/2;bar(c,x,B.b,bw,(B.b-Y(v))*p,'#555');c.globalAlpha=p;tx(c,''+v,x+bw/2,Y(v)-8,{a:'center',s:11});c.globalAlpha=1});
  lo.forEach(function(v,i){var p=e(t,.7,1+i*.22),x=B.l+g*(i+4)+(g-bw)/2,y1=Y(hi[i]),y0=Y(v),hh=(y0-y1)*p,yc=(y0+y1)/2;if(p<=0)return;
    c.fillStyle=A(SIG,.16);rr(c,x,yc-hh/2,bw,hh,3);c.fill();c.strokeStyle=A(SIG,.8);c.lineWidth=1;c.stroke();
    c.globalAlpha=p;c.fillStyle=SIG;c.fillRect(x-4,Y(mid[i])-1,bw+8,2);tx(c,v+' to '+hi[i],x+bw/2,y1-9,{a:'center',s:10,c:i==3?W:T});c.globalAlpha=1});
  ['Q1','Q2','Q3','Q4','Q1','Q2','Q3','Q4'].forEach(function(q,i){tx(c,q,B.l+g*i+g/2,B.b+18,{a:'center',s:11})});
  vl(c,B.l+g*4,B.t,B.b+30,M,[2,4]);cap(c,'Actual',B.l,B.b+42);cap(c,'Target range',B.l+g*4+8,B.b+42,{c:W});
};

/* ---------------- SYSTEMS ---------------- */
V['s-track']=function(c,w,h,t){var ev=['page_view','view_item','add_to_cart','begin_checkout','purchase','lead'],ds=['Pixel','Conv. API','GA4','CRM'];
  var B=box(w,h,{t:76,b:20,l:Math.min(128,w*.34),r:20}),rh=B.h/ev.length,cw=B.w/ds.length,lit=0,tot=ev.length*ds.length;
  ds.forEach(function(s,j){cap(c,s,B.l+cw*j+cw/2,B.t-14,{a:'center'})});
  ev.forEach(function(s,i){var y=B.t+rh*i+rh/2,t0=.3+i*.22;tx(c,s,B.l-16,y,{a:'right',b:'middle',s:12,c:W});hl(c,B.l,B.r,y,'rgba(255,255,255,.05)');
    ds.forEach(function(d,j){var x=B.l+cw*j+cw/2,tl=t0+j*.3,on=t>tl;if(on)lit++;ring(c,x,y,7,on?SIG:'#3A3A3A',1.2);if(on)dot(c,x,y,4*e(t,.3,tl),SIG)});
    var px=B.l+cw*(.5+(t-t0)/.3);if(t>t0-.15&&px<B.r)dot(c,px,y,2.6,W);
    if(t>t0+1.4){var f=(t*.45+i*.17)%1;dot(c,B.l+B.w*f,y,1.8,'rgba(255,255,255,.4)')}});
  var mr=Math.round(96*lit/tot);cap(c,'Events verified',24,30);tx(c,mr+'%',24,60,{s:26,w:300,c:W});
  hbar(c,B.l,44,B.w,3,'#222');hbar(c,B.l,44,B.w*lit/tot,3,SIG);
};
V['s-report']=function(c,w,h,t){var pad=22,gp=10,tw=(w-pad*2-gp*2)/3,th=78,k=[['Spend',184,'$','k','+4%'],['Revenue',742,'$','k','+18%'],['ROAS',4.0,'','×','+13%']];
  k.forEach(function(r,i){var x=pad+i*(tw+gp),y=22,p=e(t,1.6,.1+i*.15);c.strokeStyle=i==1?A(SIG,.5):'rgba(255,255,255,.1)';c.lineWidth=1;rr(c,x,y,tw,th,4);c.stroke();
    cap(c,r[0],x+12,y+22);var v=r[1]*p;tx(c,r[2]+(r[3]=='×'?v.toFixed(1):Math.round(v))+r[3],x+12,y+56,{s:Math.min(28,tw/4.6),w:300,c:W});
    font(c,{s:11});var tight=12+capW(c,r[0])+10+c.measureText(r[4]).width+12>tw;
    c.globalAlpha=e(t,.4,1.6);tx(c,r[4],x+tw-12,tight?y+th-10:y+22,{a:'right',s:11,c:i==1?SIG:T});c.globalAlpha=1});
  var B=box(w,h,{t:22+th+44,b:30,l:pad,r:pad});cap(c,'Weekly revenue',B.l,B.t-14);grid(c,B,3);
  var d=[38,42,40,47,45,52,55,53,60,64,62,71],n=d.length,g=B.w/n,bw=g*.56;
  d.forEach(function(v,i){bar(c,B.l+g*i+(g-bw)/2,B.b,bw,B.h*v/76*e(t,.6,.5+i*.07),i==n-1?SIG:'#4A4A4A')});
  if(t>1.6){var xl=B.l+g*(n-1)+g/2,yl=B.b-B.h*71/76-10;dot(c,xl,yl,3,SIG);ring(c,xl,yl,4+((t*1.2)%1)*10,A(SIG,1-((t*1.2)%1)))}
  cap(c,'Week 1',B.l,B.b+18);cap(c,'Week 12',B.r,B.b+18,{a:'right'});
};
V['s-crm']=function(c,w,h,t){var sw=Math.min(116,w*.28),sx=20,cy=h/2,bx=w*.6,bw=w-bx-20,br=[['Qualified',.3],['Nurture',.5],['Disqualified',.2]],ys=[h*.22,h*.5,h*.78],jx=sx+sw+w*.08;
  br.forEach(function(b,k){c.strokeStyle=k==0?A(SIG,.5):'rgba(255,255,255,.1)';c.lineWidth=k==0?1.5:1;c.beginPath();c.moveTo(sx+sw,cy);c.lineTo(jx,cy);c.bezierCurveTo((jx+bx)/2,cy,(jx+bx)/2,ys[k],bx,ys[k]);c.stroke()});
  for(var j=0;j<46;j++){var r=R(j+3),u=r(),k=u<.3?0:u<.8?1:2,age=t-j*.11;if(age<0)continue;var s=(age*.45)%1,x,y;
    if(s<.3){x=sx+sw+(jx-sx-sw)*s/.3;y=cy}else{var q=(s-.3)/.7;x=bez(jx,(jx+bx)/2,(jx+bx)/2,bx,q);y=bez(cy,cy,ys[k],ys[k],q)}
    dot(c,x,y,k==0?2.4:1.8,k==0?SIG:k==1?'rgba(255,255,255,.55)':'rgba(255,255,255,.25)')}
  var tot=Math.floor(Math.max(0,t-.6)*14);
  chip(c,sx,cy-30,sw,60,'',{});cap(c,'Inbound leads',sx+12,cy-8);tx(c,''+tot,sx+12,cy+18,{s:22,w:300,c:W});
  br.forEach(function(b,k){var y=ys[k]-26,cnt=Math.floor(tot*b[1]);c.fillStyle='#111';rr(c,bx,y,bw,52,5);c.fill();c.strokeStyle=k==0?SIG:'rgba(255,255,255,.12)';c.lineWidth=1;c.stroke();
    cap(c,b[0],bx+12,y+20,{c:k==0?SIG:T});tx(c,''+cnt,bx+12,y+42,{s:18,w:300,c:k==0?W:T});if(k==0&&bw>150)cap(c,'Routed to sales',bx+bw-12,y+42,{a:'right'})});
};
V['s-zalo']=function(c,w,h,t){var cw=Math.min(380,w-40),x=(w-cw)/2,y=16,H=h-32;c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;rr(c,x,y,cw,H,12);c.stroke();
  cap(c,'Official Account',x+16,y+26);dot(c,x+cw-22,y+22,3.5,SIG);hl(c,x,x+cw,y+42,'rgba(255,255,255,.08)');
  var msgs=[[0,'Hi, is a consultation available this week?'],[1,'Yes. Thursday 10:00 or Friday 15:00?'],[0,'Thursday, please.'],[1,'Confirmed for Thursday 10:00. We will remind you the day before.'],[2,'Booking synced to CRM']];
  var yy=y+58,mw=cw*.7;
  msgs.forEach(function(m,i){var at=.4+i*1.15;if(m[0]==1&&t>at-.7&&t<at){c.fillStyle='#151515';rr(c,x+14,yy,56,30,14);c.fill();for(var d=0;d<3;d++)dot(c,x+30+d*12,yy+15,2.5,'rgba(255,255,255,'+(.3+.5*((Math.sin(t*8-d)+1)/2))+')')}
    if(t<at)return;var p=e(t,.35,at);c.globalAlpha=p;var dy=(1-p)*8;
    if(m[0]==2){cap(c,'✓  '+m[1],x+cw/2,yy+16+dy,{a:'center',c:SIG});yy+=30;c.globalAlpha=1;return}
    var ls=lines(c,m[1],mw-24,{s:13}),bw=0;ls.forEach(function(l){bw=Math.max(bw,c.measureText(l).width)});bw+=24;var bh=ls.length*18+16,bx=m[0]==0?x+cw-14-bw:x+14,last=i==3;
    c.fillStyle=m[0]==0?'#262626':last?SIG:'#141414';rr(c,bx,yy+dy,bw,bh,10);c.fill();if(m[0]==1&&!last){c.strokeStyle='rgba(255,255,255,.12)';c.stroke()}
    ls.forEach(function(l,k){tx(c,l,bx+12,yy+dy+21+k*18,{s:13,c:last?'#04130D':W,w:last?500:400})});yy+=bh+10;c.globalAlpha=1});
};
V['s-web']=function(c,w,h,t){var g=[['LCP','Largest paint',4.6,1.8,'s',[2.5,4,6]],['INP','Interaction',420,120,'ms',[200,500,700]],['CLS','Layout shift',.28,.04,'',[.1,.25,.35]]];
  var cw=w/3,r=Math.min(cw*.34,h*.28),cy=h*.54;cap(c,'Core Web Vitals · before and after rebuild',24,30);
  g.forEach(function(m,i){var cx=cw*i+cw/2,mx=m[5][2],p=e(t,1.8,.5+i*.25),v=m[2]+(m[3]-m[2])*p;
    function arc(a,b,col){c.beginPath();c.arc(cx,cy,r,Math.PI+Math.PI*a/mx,Math.PI+Math.PI*b/mx);c.strokeStyle=col;c.lineWidth=7;c.stroke()}
    arc(0,m[5][0]-mx*.01,A(SIG,.6));arc(m[5][0]+mx*.01,m[5][1]-mx*.01,'#4A4A4A');arc(m[5][1]+mx*.01,mx,'#2A2A2A');c.lineWidth=1;
    var a=Math.PI+Math.PI*Math.min(v,mx)/mx;c.strokeStyle=W;c.lineWidth=2;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*(r-14),cy+Math.sin(a)*(r-14));c.stroke();c.lineWidth=1;dot(c,cx,cy,4,W);
    tx(c,(m[4]=='ms'?Math.round(v):v.toFixed(m[4]=='s'?1:2))+m[4],cx,cy+36,{a:'center',s:Math.min(26,cw/5),w:300,c:p>.98?W:T});
    cap(c,m[0],cx,cy+58,{a:'center'});if(cw>150)tx(c,m[1],cx,cy+74,{a:'center',s:11,c:M});
    c.globalAlpha=e(t,.4,2.4+i*.25);cap(c,'Good',cx,cy-r-16,{a:'center',c:SIG});c.globalAlpha=1});
};
V['s-ai']=function(c,w,h,t){var B={l:24,r:w-24,t:46,b:h*.42};B.w=B.r-B.l;B.h=B.b-B.t;var n=40,rnd=R(3),pts=[],i;
  for(i=0;i<n;i++){var v=.32+rnd()*.12+(i==31?.44:0)+(i==32?.16:0);pts.push([B.l+B.w*i/(n-1),B.b-B.h*v])}
  cap(c,'CTR · all creatives · 40 days',B.l,B.t-18);hl(c,B.l,B.r,B.b-B.h*.38,'rgba(255,255,255,.12)');line(c,pts,'#7A7A7A',1.5,e(t,1.4,.1));
  if(t>1.5){var pt=pts[31],ph=(t*1.2)%1;dot(c,pt[0],pt[1],4,SIG);ring(c,pt[0],pt[1],6+ph*14,A(SIG,1-ph),1.5)}
  var cards=[['Outlier','Creative B is running at 2.3× average CTR','Scale'],['Leak','Display CPA is 41% above target','Cut'],['Trend','TikTok ROAS up three weeks running','Add budget']];
  var cy=B.b+26,ch=Math.min(58,(h-cy-14)/3-8),small=w<520;
  cards.forEach(function(k,i){var at=1.8+i*.7,p=e(t,.5,at);if(p<=0)return;var x=24+(1-p)*40,y=cy+i*(ch+8),ww=w-48;c.globalAlpha=p;
    c.fillStyle='#111';rr(c,x,y,ww,ch,6);c.fill();c.strokeStyle=i==0?A(SIG,.6):'rgba(255,255,255,.1)';c.lineWidth=1;c.stroke();
    cap(c,k[0],x+14,y+ch/2+4,{c:i==0?SIG:T});tx(c,k[1],x+(small?84:96),y+ch/2,{b:'middle',s:13,c:W,mw:ww-(small?100:210)});if(!small)cap(c,k[2]+' →',x+ww-14,y+ch/2+4,{a:'right',c:i==0?SIG:T});c.globalAlpha=1});
};

/* ---------------- DEMAND ---------------- */
V['d-perf']=function(c,w,h,t){var ch=['Meta','Google','TikTok','YouTube','LinkedIn','Zalo'],B=box(w,h,{t:40,b:36,l:24,r:Math.min(108,w*.28)}),n=12,rnd=R(11);
  var S=ch.map(function(s,i){var v=1.5+rnd()*1.1,a=[];for(var k=0;k<n;k++){v+=(i==2?.17:(rnd()-.5)*.36)-.01;a.push(Math.max(.6,v))}return a});
  var mx=0;S.forEach(function(a){a.forEach(function(v){if(v>mx)mx=v})});mx*=1.12;var X=function(k){return B.l+B.w*k/(n-1)},Y=function(v){return B.b-B.h*v/mx};
  grid(c,B,4);cap(c,'ROAS by channel · 12 weeks',B.l,B.t-18);var p=e(t,2,.1);
  S.forEach(function(a,i){if(i!=2)line(c,a.map(function(v,k){return[X(k),Y(v)]}),'#4A4A4A',1.5,p)});line(c,S[2].map(function(v,k){return[X(k),Y(v)]}),SIG,2.5,p);
  var q=e(t,.5,2.1);if(q>0){c.globalAlpha=q;var lb=S.map(function(a,i){return{i:i,y:Y(a[n-1])}}).sort(function(a,b){return a.y-b.y});
    for(var j=1;j<lb.length;j++)if(lb[j].y-lb[j-1].y<15)lb[j].y=lb[j-1].y+15;
    lb.forEach(function(o){dot(c,X(n-1),Y(S[o.i][n-1]),o.i==2?4:2.5,o.i==2?SIG:'#6A6A6A');tx(c,ch[o.i]+' '+S[o.i][n-1].toFixed(1)+'×',X(n-1)+12,o.y,{b:'middle',s:11,c:o.i==2?W:T,w:o.i==2?500:400})});c.globalAlpha=1}
  cap(c,'Week 1',B.l,B.b+20);cap(c,'Week 12',B.r,B.b+20,{a:'right'});
};
V['d-koc']=function(c,w,h,t){var cx=w/2,cy=h/2-10,rnd=R(5),N=30,nodes=[],i;
  for(i=0;i<N;i++){var ring2=i>=12,a=(ring2?(i-12)/18:i/12)*Math.PI*2+(ring2?.2:0),rad=(ring2?.43:.25)*Math.min(w,h*1.25)+(rnd()-.5)*18,perf=rnd();nodes.push({a:a,r:rad,p:perf,i:i})}
  var top=nodes.slice().sort(function(a,b){return b.p-a.p}).slice(0,5);
  nodes.forEach(function(nd){var q=e(t,.5,.1+nd.i*.04);if(q<=0)return;var x=cx+Math.cos(nd.a)*nd.r*1.25*q+Math.sin(t*.8+nd.i)*3,y=cy+Math.sin(nd.a)*nd.r*.78*q+Math.cos(t*.7+nd.i)*3,on=top.indexOf(nd)>=0;nd.x=x;nd.y=y;
    c.strokeStyle=on?A(SIG,.35):'rgba(255,255,255,.07)';c.lineWidth=1;c.beginPath();c.moveTo(cx,cy);c.lineTo(x,y);c.stroke()});
  nodes.forEach(function(nd){if(nd.x==null)return;var on=top.indexOf(nd)>=0,r=3+nd.p*7;if(on){var s=(t*.5+nd.i*.3)%1;dot(c,nd.x+(cx-nd.x)*s,nd.y+(cy-nd.y)*s,2,SIG);dot(c,nd.x,nd.y,r,SIG);ring(c,nd.x,nd.y,r+4,A(SIG,.35))}else{dot(c,nd.x,nd.y,r,'#3E3E3E')}});
  dot(c,cx,cy,22,W);tx(c,'Brand',cx,cy,{a:'center',b:'middle',s:11,c:'#0A0A0A',w:600});
  legend(c,[['Top 5 creators by revenue',SIG],['30-creator programme','#3E3E3E',Math.min(220,w*.55)]],24,h-16,w-12);
};
V['d-ecom']=function(c,w,h,t){var B=box(w,h,{t:48,b:40,l:24,r:24}),n=122,rnd=R(21),pk=[[8,'9.9',.55],[39,'10.10',.62],[71,'11.11',1],[102,'12.12',.8]],v=[],i;
  for(i=0;i<n;i++){var b=.13+rnd()*.06+i*.0006;pk.forEach(function(p){var d=Math.abs(i-p[0]);if(d==0)b=p[2];else if(d<3)b+=.07/d});v.push(b)}
  cap(c,'Daily GMV · September to December',B.l,B.t-26);hl(c,B.l,B.r,B.b,'#3A3A3A');var g=B.w/n,bw=Math.max(1,g-1),sw=n*e(t,2.2,.1);
  v.forEach(function(x,i){if(i>sw)return;var isP=pk.some(function(p){return p[0]==i});bar(c,B.l+g*i,B.b,bw,B.h*x*.9,isP?SIG:'#4A4A4A',1)});
  pk.forEach(function(p){if(p[0]>sw)return;var x=B.l+g*p[0]+bw/2,y=B.b-B.h*p[2]*.9;c.globalAlpha=e(t,.4,.1+2.2*p[0]/n+.1);cap(c,p[1],x,y-10,{a:'center',c:W});c.globalAlpha=1});
  ['Sep','Oct','Nov','Dec'].forEach(function(m,k){cap(c,m,B.l+g*[0,30,61,91][k],B.b+20)});
};
V['d-seo']=function(c,w,h,t){var B=box(w,h,{t:44,b:40,l:24,r:76}),n=18,o=[],pd=[],rnd=R(4),i;for(i=0;i<n;i++){o.push(5*Math.pow(1.17,i));pd.push(40+(rnd()-.5)*6)}
  var mx=o[n-1]*1.08,X=function(i){return B.l+B.w*i/(n-1)},Y=function(v){return B.b-B.h*v/mx},p=e(t,2.4,.1);grid(c,B,4);cap(c,'Monthly sessions',B.l,B.t-20);
  c.save();c.beginPath();c.rect(B.l-2,0,(B.w+4)*p,h);c.clip();
  c.beginPath();c.moveTo(X(0),B.b);o.forEach(function(v,i){c.lineTo(X(i),Y(v))});c.lineTo(X(n-1),B.b);c.closePath();c.fillStyle=A(SIG,.16);c.fill();
  line(c,o.map(function(v,i){return[X(i),Y(v)]}),SIG,2.2);line(c,pd.map(function(v,i){return[X(i),Y(v)]}),'#7A7A7A',1.5);c.restore();
  var ci=13,q=e(t,.5,.1+2.4*ci/(n-1)+.2);c.globalAlpha=q;dot(c,X(ci),Y(o[ci]),4,W);ring(c,X(ci),Y(o[ci]),9,'rgba(255,255,255,.35)');cap(c,'Organic overtakes paid',X(ci)-10,Y(o[ci])-18,{a:'right',c:W});
  c.globalAlpha=e(t,.5,2.5);tx(c,'Organic',B.r+10,Y(o[n-1]),{b:'middle',s:12,c:W,w:500});tx(c,'Paid',B.r+10,Y(pd[n-1]),{b:'middle',s:11});c.globalAlpha=1;
  cap(c,'Month 1',B.l,B.b+20);cap(c,'Month 18',B.r,B.b+20,{a:'right'});
};
V['d-social']=function(c,w,h,t){var cols=w>560?4:3,rows=cols==4?3:4,N=12,pad=22,gx=10,top0=44,tw=(w-pad*2-gx*(cols-1))/cols,th=(h-top0-pad-gx*(rows-1))/rows,rnd=R(9),sc=[],i;
  for(i=0;i<N;i++)sc.push(.6+rnd()*2.4);var ord=sc.map(function(v,i){return i}).sort(function(a,b){return sc[b]-sc[a]}),tp=ord.slice(0,3),lw=ord.slice(-6),dec=e(t,.6,2.6);
  cap(c,'12 creatives · one test sprint',pad,26);c.globalAlpha=dec;cap(c,'3 scaled · 6 cut',w-pad,26,{a:'right',c:SIG});c.globalAlpha=1;
  for(i=0;i<N;i++){var x=pad+(i%cols)*(tw+gx),y=top0+Math.floor(i/cols)*(th+gx),p=e(t,.5,.1+i*.08),isT=tp.indexOf(i)>=0,isL=lw.indexOf(i)>=0;if(p<=0)continue;
    c.globalAlpha=p*(isL?1-.65*dec:1);c.fillStyle='#141414';rr(c,x,y,tw,th,6);c.fill();
    var ih=th*.46;c.fillStyle='#232323';rr(c,x+8,y+8,tw-16,ih,3);c.fill();c.fillStyle='#1E1E1E';c.fillRect(x+8,y+ih+16,(tw-16)*.7,4);c.fillRect(x+8,y+ih+25,(tw-16)*.45,4);
    cap(c,'CTR',x+10,y+th-11);tx(c,sc[i].toFixed(1)+'%',x+tw-10,y+th-9,{a:'right',s:14,c:isT&&dec>.5?W:T,w:isT?500:400});
    if(isT&&dec>0){c.strokeStyle=A(SIG,dec);c.lineWidth=2;rr(c,x,y,tw,th,6);c.stroke();c.lineWidth=1;c.fillStyle=A(SIG,dec);rr(c,x+tw-56,y+14,44,18,3);c.fill();cap(c,'Scale',x+tw-34,y+27,{a:'center',c:'#04130D'})}
    if(isL&&dec>0){c.strokeStyle='rgba(255,255,255,'+(.25*dec)+')';c.beginPath();c.moveTo(x+8,y+th-28);c.lineTo(x+tw-8,y+8);c.stroke()}
    c.globalAlpha=1}
};
V['d-brand']=function(c,w,h,t){var cx=w*.28,cy=h/2,r=Math.min(w*.18,h*.3),p=e(t,1.8,.1),v=.78*p;
  c.lineWidth=10;c.strokeStyle='#202020';c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.strokeStyle=SIG;c.lineCap='round';if(v>0){c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*v);c.stroke()}c.lineCap='butt';c.lineWidth=1;
  tx(c,Math.round(v*100)+'%',cx,cy+4,{a:'center',b:'middle',s:Math.round(r*.44),w:300,c:W});cap(c,'Reach',cx,cy+r*.44,{a:'center'});
  var B={l:w*.56,r:w-24,t:h*.24,b:h*.74};B.w=B.r-B.l;B.h=B.b-B.t;var f=[18,24,21,15,10,12],g=B.w/f.length,bw=g*.6;cap(c,'Frequency distribution',B.l,B.t-18);
  f.forEach(function(x,i){bar(c,B.l+g*i+(g-bw)/2,B.b,bw,B.h*x/26*e(t,.6,.6+i*.1),(i>=2&&i<=4)?SIG:'#4A4A4A');tx(c,i==5?'6+':''+(i+1),B.l+g*i+g/2,B.b+18,{a:'center',s:11})});
  c.globalAlpha=e(t,.4,1.6);cap(c,'Effective: 3 to 5 exposures',B.l,B.b+40,{c:W});c.globalAlpha=1;
};

/* ---------------- SYSTEMS: before / after ---------------- */
var WINS=[['Meta Ads','$812k'],['Google Ads','$640k'],['TikTok Ads','$395k'],['Shopee','$1.02M'],['GA4','$588k']];
function winPos(w,h,i){var r=R(40+i),row=i>=3;return{x:row?w*(.2+(i-3)*.32):w*(.04+i*.32),y:row?h*.5:h*.08,a:(r()-.5)*.12,j:r()*.02*w}}
function drawWin(c,x,y,ww,hh,a,title,val,alpha){c.save();c.translate(x+ww/2,y+hh/2);c.rotate(a);c.globalAlpha=alpha;c.fillStyle='#121212';rr(c,-ww/2,-hh/2,ww,hh,6);c.fill();c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=1;c.stroke();
  cap(c,title,-ww/2+12,-hh/2+20);if(hh>60){cap(c,'Revenue',-ww/2+12,-hh/2+42,{c:M});tx(c,val,-ww/2+12,-hh/2+Math.min(74,hh-14),{s:Math.min(22,ww/7),w:300,c:W})}c.restore()}
V['sb-before']=function(c,w,h,t){var ww=Math.min(190,w*.26),hh=Math.min(116,h*.32);
  WINS.forEach(function(k,i){var P=winPos(w,h,i),p=e(t,.5,.1+i*.2),j=Math.sin(t*2+i)*2;drawWin(c,P.x+P.j,P.y+j+(1-p)*12,ww,hh,P.a,k[0],k[1],p)});
  c.globalAlpha=e(t,.6,1.6);cap(c,'5 sources · 5 different numbers for revenue',w/2,h-20,{a:'center',c:W});c.globalAlpha=1};
V['sb-after']=function(c,w,h,t){var ww=Math.min(190,w*.26),hh=Math.min(116,h*.32),m=e(t,1.3,.2),cw=Math.min(150,w*.27),chh=34,stack=5*chh+40;
  WINS.forEach(function(k,i){var P=winPos(w,h,i),tx0=20,ty0=(h-stack)/2+i*(chh+10),x=P.x+P.j+(tx0-P.x-P.j)*m,y=P.y+(ty0-P.y)*m,W2=ww+(cw-ww)*m,H2=hh+(chh-hh)*m;
    if(m<.98)drawWin(c,x,y,W2,H2,P.a*(1-m),k[0],k[1],1-m*.5);else{chip(c,tx0,ty0,cw,chh,k[0],{s:12});dot(c,tx0+cw-14,ty0+chh/2,3,SIG)}});
  var q=e(t,.9,1.5);if(q<=0)return;var px=20+cw+Math.min(60,w*.08),pw=w-px-20,ph=Math.min(h*.66,280),py=(h-ph)/2;c.globalAlpha=q;
  for(var i=0;i<5;i++){var y0=(h-stack)/2+i*(chh+10)+chh/2,xa=20+cw,xb=px,ym=py+ph/2;c.strokeStyle=A(SIG,.4);c.lineWidth=1;c.beginPath();c.moveTo(xa,y0);c.bezierCurveTo((xa+xb)/2,y0,(xa+xb)/2,ym,xb,ym);c.stroke();
    var s=(t*.5+i*.2)%1;dot(c,bez(xa,(xa+xb)/2,(xa+xb)/2,xb,s),bez(y0,y0,ym,ym,s),2,SIG)}
  c.fillStyle='#101010';rr(c,px,py,pw,ph,8);c.fill();c.strokeStyle=A(SIG,.6);c.stroke();
  cap(c,'Revenue · deduplicated',px+18,py+28);tx(c,'$1.18M',px+18,py+28+Math.min(50,pw/4.5),{s:Math.min(44,pw/4.6),w:300,c:W});
  var bB={l:px+18,r:px+pw-18,b:py+ph-22,t:py+ph*.55},d=[40,46,44,52,57,55,63,70],g=(bB.r-bB.l)/d.length,bw=g*.55;
  d.forEach(function(v,i){bar(c,bB.l+g*i+(g-bw)/2,bB.b,bw,(bB.b-bB.t)*v/70*e(t,.5,1.9+i*.06),i==d.length-1?SIG:'#3E3E3E')});c.globalAlpha=1;
  c.globalAlpha=e(t,.6,2.4);cap(c,'One number · every team',px+pw/2,h-14,{a:'center',c:W});c.globalAlpha=1};

/* ---------------- DEMAND: 30-day sprint ---------------- */
function sprint(c,w,h,t,ph){var B=box(w,h,{t:48,b:34,l:62,r:Math.min(96,w*.24)}),n=8,rh=B.h/n,wk=B.w/4,rnd=R(17),i,k;
  var P=[0,1,2,3].map(function(k){return ph>k?1:ph==k?e(t,1.8,.15):0});
  for(k=0;k<4;k++){var x=B.l+wk*k,on=(k==0&&ph==0)||(k>0&&k<3&&ph==1)||(k==3&&ph==2);if(on){c.fillStyle='rgba(255,255,255,.03)';c.fillRect(x,B.t-4,wk,B.h+8)}vl(c,x,B.t-4,B.b+4,'rgba(255,255,255,.08)');cap(c,'Week '+(k+1),x+wk/2,B.t-18,{a:'center',c:on?W:T})}
  vl(c,B.r,B.t-4,B.b+4,'rgba(255,255,255,.08)');
  var sl=[];for(i=0;i<n;i++)sl.push((rnd()-.45)*1.3);var srt=sl.slice().sort(function(a,b){return b-a}),wins=srt.slice(0,3),loss=srt.slice(-3);
  var L=(P[0]*.33+P[1]*.67);
  for(i=0;i<n;i++){var y0=B.t+rh*i+rh/2,isW=wins.indexOf(sl[i])>=0,isL=loss.indexOf(sl[i])>=0,r2=R(i+50),pts=[];
    tx(c,'Cell '+'ABCDEFGH'[i],B.l-12,y0,{a:'right',b:'middle',s:11,c:isW&&P[2]>.5?W:T});
    for(k=0;k<=12;k++)pts.push([B.l+wk*3*k/12,y0-sl[i]*rh*.95*(k/12)+(r2()-.5)*rh*.3]);
    var col=P[2]>0?(isW?SIG:'#5A5A5A'):'#8A8A8A';c.globalAlpha=isL?1-.6*P[2]:1;dot(c,B.l,y0,3,col);line(c,pts,col,isW&&P[2]>0?2.2:1.4,L);
    var end=pts[12];if(P[2]>0&&isW){line(c,[end,[end[0]+wk*P[2],end[1]-sl[i]*rh*.4]],SIG,2.6,1)}
    if(P[2]>.4&&isL){c.globalAlpha=P[2];tx(c,'×',end[0]+8,end[1],{b:'middle',s:14,c:T});cap(c,'Cut',end[0]+22,end[1]+4)}
    if(P[2]>.4&&isW&&w>480){c.globalAlpha=P[2];cap(c,'Scale',B.l+wk*3.5,y0-rh*.5+2,{a:'center',c:SIG})}
    if(P[3]>0&&isW){c.globalAlpha=P[3];var ex=B.r,ey=end[1]-sl[i]*rh*.4;line(c,[[ex,ey],[ex+(B.r+Math.min(80,w*.2)-8-ex)*P[3],ey]],SIG,1.6,1);dot(c,ex+(Math.min(80,w*.2)-8)*P[3],ey,3,SIG)}
    c.globalAlpha=1}
  if(ph<2){var sx=B.l+wk*3*L;vl(c,sx,B.t-4,B.b+4,A(SIG,.6))}
  if(P[3]>0){c.globalAlpha=P[3];cap(c,'Sprint 2',B.r+10,B.t-18,{c:SIG});c.globalAlpha=1}
}
[0,1,2,3].forEach(function(k){V['sp-'+k]=function(c,w,h,t){sprint(c,w,h,t,k)}});

/* ---------------- ENGINE: connect, unify, decide, compound ---------------- */
function engine(c,w,h,t,ph){var src=['Meta','Google','TikTok','Shopee','GA4','CRM'],out=['Live dashboard','Alerts','Budget decisions'],sw=Math.min(90,w*.22),ow=Math.min(132,w*.27);
  var cx=w*.5,cy=h*.38,R0=Math.min(w*.11,h*.13),P=[0,1,2,3].map(function(k){return ph>k?1:ph==k?e(t,1.4,.1):0}),ac=function(k){return ph==k?SIG:'#7A7A7A'};
  var sy=function(i){return h*.08+i*(h*.6/5)},oy=function(i){return cy-h*.2+i*h*.2},i;
  src.forEach(function(s,i){var y=sy(i)+14,xa=20+sw,xb=cx-R0;c.globalAlpha=.35+.65*P[0];c.strokeStyle=ph==0?A(SIG,.45):'rgba(255,255,255,.12)';c.lineWidth=1;c.beginPath();c.moveTo(xa,y);c.bezierCurveTo((xa+xb)/2,y,(xa+xb)/2,cy,xb,cy);c.stroke();
    if(P[0]>.6){var s2=(t*.45+i*.17)%1;dot(c,bez(xa,(xa+xb)/2,(xa+xb)/2,xb,s2),bez(y,y,cy,cy,s2),ph==0?2.2:1.5,ph==0?SIG:'rgba(255,255,255,.4)')}
    chip(c,20,sy(i),sw,28,s,{s:11,stroke:ph==0&&P[0]>.3?A(SIG,.6):'rgba(255,255,255,.12)'});c.globalAlpha=1});
  c.globalAlpha=.3+.7*P[2];out.forEach(function(s,i){var y=oy(i),xa=cx+R0,xb=w-20-ow;c.strokeStyle=ph==2?A(SIG,.5):'rgba(255,255,255,.12)';c.beginPath();c.moveTo(xa,cy);c.bezierCurveTo((xa+xb)/2,cy,(xa+xb)/2,y,xb,y);c.stroke();
    if(P[2]>.6){var s2=(t*.45+i*.25)%1;dot(c,bez(xa,(xa+xb)/2,(xa+xb)/2,xb,s2),bez(cy,cy,y,y,s2),2,ph==2?SIG:'rgba(255,255,255,.4)')}
    chip(c,w-20-ow,y-15,ow,30,s,{s:11,stroke:ph==2&&P[2]>.3?A(SIG,.6):'rgba(255,255,255,.12)'})});c.globalAlpha=1;
  dot(c,cx,cy,R0,'#0F0F0F');ring(c,cx,cy,R0,P[1]>0?ac(1):'#3A3A3A',1.5);
  if(P[1]>0){for(i=0;i<3;i++){var a0=t*(1.2+i*.3)+i*2;c.beginPath();c.arc(cx,cy,R0-8-i*7,a0,a0+Math.PI*.7*P[1]);c.strokeStyle=ph==1?A(SIG,.9-i*.25):'rgba(255,255,255,'+(.4-i*.1)+')';c.lineWidth=2;c.stroke()}c.lineWidth=1}
  cap(c,'Engine',cx,cy+4,{a:'center',c:W});
  var mb={l:cx-Math.min(150,w*.3),r:cx+Math.min(150,w*.3),b:h-34,t:h*.66},q=8,g=(mb.r-mb.l)/q,bw=g*.6;
  vl(c,cx,cy+R0,mb.t-6,P[3]>0?A(SIG,.5):'rgba(255,255,255,.12)');
  for(i=0;i<q;i++)bar(c,mb.l+g*i+(g-bw)/2,mb.b,bw,(mb.b-mb.t)*(.25+.75*i/(q-1))*e(t,.5,.1+i*.12)*(ph>=3?1:ph==3?1:.12+.0*i)*(ph>3?1:1),ph==3?(i==q-1?SIG:'#4A4A4A'):'#2E2E2E');
  cap(c,ph==3?'Context stored, quarter by quarter':'Memory',cx,h-14,{a:'center',c:ph==3?W:T});
}
[0,1,2,3].forEach(function(k){V['en-'+k]=function(c,w,h,t){engine(c,w,h,t,k)}});

/* ---------------- HOME: method ---------------- */
function method(c,w,h,t,ph){var B=box(w,h,{t:40,b:40,l:Math.min(104,w*.26),r:24}),X=function(m){return B.l+B.w*m/12},rows=[['Architect',0,1.5],['Engineer',1.5,4],['Operate',4,12]],gh=B.h*.42,rh=gh/3,i;
  for(i=0;i<=12;i++)vl(c,X(i),B.t-6,B.b,'rgba(255,255,255,.05)');cap(c,'Month 1',X(0),B.b+20);cap(c,'Month 6',X(6),B.b+20,{a:'center'});cap(c,'Month 12',X(12),B.b+20,{a:'right'});
  rows.forEach(function(r,i){var y=B.t+rh*i+rh*.2,bh=rh*.6,p=ph>i?1:ph==i?e(t,1.4,.1):0,x0=X(r[1]),x1=X(r[2]);
    tx(c,r[0],B.l-14,y+bh/2,{a:'right',b:'middle',s:13,c:ph==i?W:T,w:ph==i?500:400});c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;rr(c,x0,y,x1-x0,bh,4);c.stroke();
    if(p>0){c.fillStyle=ph==i?SIG:'#5A5A5A';rr(c,x0,y,(x1-x0)*p,bh,4);c.fill()}});
  var top=B.t+gh+34,f=function(m){return m<4?.1+.012*m:.148+.8*(1-Math.exp(-(m-4)/4.2))},Y=function(v){return B.b-(B.b-top)*v};
  cap(c,'Revenue',B.l,top-8);hl(c,B.l,B.r,B.b,'#3A3A3A');
  var lim=ph==0?1.5*e(t,1.4,.1):ph==1?1.5+2.5*e(t,1.4,.1):4+8*e(t,2.4,.1),pts=[];for(var m=0;m<=lim+1e-6;m+=.1)pts.push([X(m),Y(f(m))]);
  if(pts.length>1){c.beginPath();c.moveTo(X(0),B.b);pts.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(X(lim),B.b);c.closePath();c.fillStyle=ph==2?A(SIG,.14):'rgba(255,255,255,.04)';c.fill();line(c,pts,ph==2?SIG:W,2)}
  vl(c,X(lim),B.t-6,B.b,A(SIG,.7));dot(c,X(lim),Y(f(lim)),4,SIG);
}
[0,1,2].forEach(function(k){V['me-'+k]=function(c,w,h,t){method(c,w,h,t,k)}});

/* ---------------- HOME: engagement ---------------- */
function engage(c,w,h,t,ph){var th=w/3,cy=h*.46,P=[0,1,2].map(function(k){return ph>k?1:ph==k?e(t,1.4,.1):0}),col=function(k){return ph==k?SIG:ph>k?'#9A9A9A':'#3A3A3A'},i;
  var x0=th*.14,x1=th*.86;hl(c,x0,x1,cy,'#2A2A2A');c.strokeStyle=col(0);c.lineWidth=2;c.beginPath();c.moveTo(x0,cy);c.lineTo(x0+(x1-x0)*P[0],cy);c.stroke();c.lineWidth=1;
  ['Audit','Data','Plan'].forEach(function(s,i){var x=x0+(x1-x0)*(.1+i*.4),on=P[0]>=.1+i*.4;dot(c,x,cy,on?5:4,on?col(0):'#2A2A2A');if(!on)ring(c,x,cy,5,'#3A3A3A');cap(c,s,x,cy+26,{a:'center',c:on?W:T})});
  var bx=th+th*.2,bw=th*.6,bh=Math.min(40,h*.11);['Engine','Reporting','Tracking'].forEach(function(s,i){var k=2-i,q=e(t,.6,.2+k*.4)*(ph>=1?1:0),y=cy+bh*1.5-(k+1)*(bh+6)+ (1-q)*-20;
    if(ph<1){c.strokeStyle='#2E2E2E';rr(c,bx,cy+bh*1.5-(k+1)*(bh+6),bw,bh,4);c.stroke();cap(c,s,bx+bw/2,cy+bh*1.5-(k+1)*(bh+6)+bh/2+4,{a:'center',c:'#4A4A4A'});return}
    c.globalAlpha=q;c.fillStyle=ph==1?(k==2?SIG:A(SIG,.25+k*.15)):'#2A2A2A';rr(c,bx,y,bw,bh,4);c.fill();cap(c,s,bx+bw/2,y+bh/2+4,{a:'center',c:ph==1&&k==2?'#04130D':W});c.globalAlpha=1});
  var lx=th*2.55,rR=Math.min(th*.24,h*.24);ring(c,lx,cy,rR,ph==2?A(SIG,.35):'#2E2E2E',2);
  ['Q1','Q2','Q3','Q4'].forEach(function(q,i){var a=-Math.PI/2+i*Math.PI/2;dot(c,lx+Math.cos(a)*rR,cy+Math.sin(a)*rR,4,ph==2?SIG:'#3A3A3A');cap(c,q,lx+Math.cos(a)*(rR+18),cy+Math.sin(a)*(rR+18)+4,{a:'center',c:ph==2?W:'#4A4A4A'})});
  if(ph==2){var a=-Math.PI/2+t*1.3;c.beginPath();c.arc(lx,cy,rR,a-1.2,a);c.strokeStyle=SIG;c.lineWidth=3;c.stroke();c.lineWidth=1;dot(c,lx+Math.cos(a)*rR,cy+Math.sin(a)*rR,6,SIG);
    var rev=Math.floor(t*1.3/(Math.PI/2));tx(c,''+Math.max(1,rev),lx,cy,{a:'center',b:'middle',s:Math.round(rR*.5),w:300,c:W});cap(c,'Reviews',lx,cy+rR*.38,{a:'center'})}
  for(i=0;i<2;i++){var ax=th*(i+1);c.strokeStyle='#3A3A3A';c.beginPath();c.moveTo(ax-8,cy-5);c.lineTo(ax-2,cy);c.lineTo(ax-8,cy+5);c.stroke()}
  [['Discovery','4 to 6 weeks'],['Build','2 to 4 months'],['Partnership','12 months +']].forEach(function(s,i){cap(c,s[0],th*i+th/2,h-36,{a:'center',c:ph==i?SIG:T});tx(c,s[1],th*i+th/2,h-18,{a:'center',s:11,c:ph==i?W:M})});
}
[0,1,2].forEach(function(k){V['eg-'+k]=function(c,w,h,t){engage(c,w,h,t,k)}});

/* ---------------- QUANT METHOD ---------------- */
V['z-mmm']=function(c,w,h,t){var B=box(w,h,{t:40,b:40,l:24,r:Math.min(110,w*.26)}),n=26,rnd=R(8),L=[[],[],[],[]],i,k;
  for(i=0;i<n;i++){L[0].push(38+i*.25+rnd()*2);L[1].push(20+6*Math.sin(i/3)+rnd()*3);L[2].push(4+i*.75+rnd()*1.5);L[3].push((i==8||i==17||i==23)?13:(i==9||i==18)?5:1.5)}
  var names=['Baseline','Paid media','Creators','Promotions'],cols=['#2C2C2C','#4E4E4E',SIG,'#8A8A8A'],mx=105,X=function(i){return B.l+B.w*i/(n-1)},Y=function(v){return B.b-B.h*v/mx},p=e(t,2,.1);
  grid(c,B,4);cap(c,'Weekly revenue, decomposed by driver',B.l,B.t-18);var acc=[];for(i=0;i<n;i++)acc.push(0);
  c.save();c.beginPath();c.rect(B.l,0,B.w*p+1,h);c.clip();
  for(k=0;k<4;k++){var lo=acc.slice();for(i=0;i<n;i++)acc[i]+=L[k][i];c.beginPath();for(i=0;i<n;i++)c[i?'lineTo':'moveTo'](X(i),Y(acc[i])-(k?1:0));for(i=n-1;i>=0;i--)c.lineTo(X(i),Y(lo[i]));c.closePath();c.fillStyle=cols[k];c.fill();
    L[k].mid=(Y(acc[n-1])+Y(lo[n-1]))/2}
  c.restore();c.globalAlpha=e(t,.5,2);var ys=L.map(function(a){return a.mid});for(k=2;k>=0;k--)if(ys[k]-ys[k+1]<15)ys[k]=ys[k+1]+15;
  names.forEach(function(s,k){dot(c,B.r+12,ys[k],3.5,cols[k]=='#2C2C2C'?'#555':cols[k]);tx(c,s,B.r+22,ys[k],{b:'middle',s:11,c:k==2?W:T,w:k==2?500:400})});c.globalAlpha=1;
  cap(c,'Week 1',B.l,B.b+20);cap(c,'Week 26',B.r,B.b+20,{a:'right'});
};
V['z-lift']=function(c,w,h,t){var d=[['Ho Chi Minh City',18,9,27],['Hanoi',12,2,22],['Da Nang',24,8,40],['Can Tho',6,-8,20],['Hai Phong',15,1,29]],pool=[15,10,20];
  var B=box(w,h,{t:50,b:44,l:Math.min(140,w*.34),r:30}),rows=d.length+1,rh=B.h/rows,X=function(v){return B.l+B.w*(v+12)/56};
  cap(c,'Incremental lift by test region, with 90% interval',B.l,B.t-22,{mw:B.w});vl(c,X(0),B.t-6,B.b,T,[3,4]);cap(c,w<560?'0':'No effect',X(0),B.b+18,{a:'center'});
  (w<560?[20,40]:[-10,10,20,30,40]).forEach(function(v){vl(c,X(v),B.t,B.b,'rgba(255,255,255,.05)');tx(c,(v>0?'+':'')+v+'%',X(v),B.b+18,{a:'center',s:10,c:M})});
  d.forEach(function(r,i){var y=B.t+rh*i+rh/2,p=e(t,.6,.2+i*.25);tx(c,r[0],B.l-14,y,{a:'right',b:'middle',s:12,mw:B.l-18});if(p<=0)return;
    var a=X(r[1])+(X(r[2])-X(r[1]))*p,b=X(r[1])+(X(r[3])-X(r[1]))*p;c.strokeStyle='#7A7A7A';c.lineWidth=1.5;c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.moveTo(a,y-4);c.lineTo(a,y+4);c.moveTo(b,y-4);c.lineTo(b,y+4);c.stroke();c.lineWidth=1;dot(c,X(r[1]),y,4.5,'#CFCFCF')});
  var y=B.t+rh*d.length+rh/2,p=e(t,.8,1.7);hl(c,B.l-Math.min(130,w*.3),B.r,y-rh/2,'rgba(255,255,255,.14)');tx(c,'Pooled estimate',B.l-14,y,{a:'right',b:'middle',s:12,c:W,w:500,mw:B.l-18});
  if(p>0){var a=X(pool[0])+(X(pool[1])-X(pool[0]))*p,b=X(pool[0])+(X(pool[2])-X(pool[0]))*p,x=X(pool[0]);c.strokeStyle=SIG;c.lineWidth=2.5;c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.stroke();c.lineWidth=1;
    c.fillStyle=SIG;c.beginPath();c.moveTo(x,y-8);c.lineTo(x+8,y);c.lineTo(x,y+8);c.lineTo(x-8,y);c.closePath();c.fill();c.globalAlpha=e(t,.4,2.4);tx(c,'+15%',b+10,y,{b:'middle',s:13,c:W,w:500});c.globalAlpha=1}
};
V['z-cohort']=function(c,w,h,t){var mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],n=8,B=box(w,h,{t:58,b:22,l:54,r:20}),cw=B.w/n,ch=B.h/n,i,j;
  cap(c,'Customers still buying, by cohort and months since first order',B.l,B.t-34,{mw:B.w});
  for(j=0;j<n;j++)cap(c,'M'+j,B.l+cw*j+cw/2,B.t-10,{a:'center'});
  for(i=0;i<n;i++){tx(c,mo[i],B.l-12,B.t+ch*i+ch/2,{a:'right',b:'middle',s:12,c:i>=4?W:T});
    for(j=0;j<n-i;j++){var late=i>=4,v=j==0?1:(late?.62:.44)*Math.pow(late?.9:.8,j-1)+.02*((i*7+j*3)%3),p=e(t,.35,.2+(i+j)*.16);if(p<=0)continue;
      c.globalAlpha=p;c.fillStyle=late?A(SIG,.12+v*.8):'rgba(255,255,255,'+(.04+v*.3)+')';rr(c,B.l+cw*j+2,B.t+ch*i+2,cw-4,ch-4,3);c.fill();
      if(cw>44)tx(c,Math.round(v*100)+'%',B.l+cw*j+cw/2,B.t+ch*i+ch/2,{a:'center',b:'middle',s:11,c:v>.6&&late?'#04130D':W});c.globalAlpha=1}}
  var q=e(t,.6,2.8);c.globalAlpha=q;var yy=B.t+ch*4;hl(c,B.l-44,B.l+cw*4,yy,SIG);cap(c,'After CRM and retention flows',B.r,B.b-ch*1.2,{a:'right',c:SIG});c.globalAlpha=1;
};
V['z-control']=function(c,w,h,t){var B=box(w,h,{t:44,b:40,l:24,r:64}),n=44,rnd=R(14),d=[],i;for(i=0;i<n;i++)d.push(50+(rnd()+rnd()+rnd()-1.5)*9);d[33]=82;d[34]=71;
  var X=function(i){return B.l+B.w*i/(n-1)},Y=function(v){return B.b-B.h*(v-20)/70},p=e(t,2,.1);cap(c,'Cost per acquisition, daily, with control limits',B.l,B.t-20,{mw:B.w});
  c.fillStyle='rgba(255,255,255,.03)';c.fillRect(B.l,Y(66),B.w,Y(34)-Y(66));
  [[66,'+3σ'],[50,'Mean'],[34,'−3σ']].forEach(function(r,k){c.save();c.setLineDash(k==1?[]:[4,4]);hl(c,B.l,B.r,Y(r[0]),k==1?'#4A4A4A':'#6A6A6A');c.restore();tx(c,r[1],B.r+10,Y(r[0]),{b:'middle',s:11})});
  line(c,d.map(function(v,i){return[X(i),Y(v)]}),'#BDBDBD',1.6,p);
  if(p*(n-1)>=33){var ph=(t*1.2)%1;dot(c,X(33),Y(82),4.5,SIG);ring(c,X(33),Y(82),7+ph*13,A(SIG,1-ph),1.5);c.globalAlpha=e(t,.4,1.9);cap(c,'Anomaly flagged',X(33)-12,Y(82)+4,{a:'right',c:W});tx(c,'Alert sent the same day',X(33)-12,Y(82)+20,{a:'right',s:11});c.globalAlpha=1}
  cap(c,'Day 1',B.l,B.b+20);cap(c,'Day 44',B.r,B.b+20,{a:'right'});
};
V['z-frontier']=function(c,w,h,t){var B=box(w,h,{t:40,b:46,l:34,r:28}),rnd=R(31),i,fr=function(x){return .16+.76*Math.sqrt(x)},X=function(x){return B.l+B.w*x},Y=function(y){return B.b-B.h*y};grid(c,B,4);
  for(i=0;i<120;i++){var x=.06+rnd()*.9,y=fr(x)*(.3+rnd()*.64),p=e(t,.4,.1+rnd()*1.1);c.globalAlpha=p*.9;dot(c,X(x),Y(y),2.2,'#555')}c.globalAlpha=1;
  var pts=[];for(i=0;i<=60;i++){var x2=.03+.95*i/60;pts.push([X(x2),Y(fr(x2))])}line(c,pts,SIG,2.2,e(t,1.2,1.3));
  c.globalAlpha=e(t,.4,2.4);cap(c,'Efficient frontier',X(.97),Y(fr(.97))-12,{a:'right',c:SIG});c.globalAlpha=1;
  var cx=.46,cy=fr(cx)*.56,q=e(t,.5,2.6),m=e(t,1.3,3.2);if(q>0){c.globalAlpha=q;ring(c,X(cx),Y(cy),7,W,1.5);tx(c,'Current mix',X(cx)+14,Y(cy)+4,{s:12,c:W});
    c.save();c.setLineDash([3,4]);c.strokeStyle=W;c.beginPath();c.moveTo(X(cx),Y(cy)-8);c.lineTo(X(cx),Y(cy+(fr(cx)-cy)*m)+6);c.stroke();c.restore();
    if(m>0){dot(c,X(cx),Y(cy+(fr(cx)-cy)*m),5.5,SIG)}if(m>.95){c.globalAlpha=e(t,.4,4.4);tx(c,'Same risk, higher return',X(cx)-14,Y(fr(cx))-12,{a:'right',s:12,c:W,w:500})}c.globalAlpha=1}
  cap(c,'Risk: volatility of return →',B.r,B.b+24,{a:'right'});cap(c,'Expected return',B.l,B.t-20);
};
V['z-monte']=function(c,w,h,t){var B=box(w,h,{t:40,b:40,l:24,r:70}),N=48,S=24,paths=[],i,k,hist=[40,42,41,45,47,46,50,52],x0=.3;
  for(i=0;i<N;i++){var r=R(100+i),v=52,a=[52];for(k=1;k<=S;k++){v+=.75+(r()+r()+r()-1.5)*4.6;a.push(v)}paths.push(a)}
  var X=function(k){return B.l+B.w*(x0+(1-x0)*k/S)},XH=function(k){return B.l+B.w*x0*k/7},Y=function(v){return B.b-B.h*(v-20)/95};grid(c,B,4);
  line(c,hist.map(function(v,k){return[XH(k),Y(v)]}),W,2,e(t,.8,.1));vl(c,X(0),B.t,B.b,M,[2,4]);cap(c,'Today',X(0),B.b+20,{a:'center'});
  paths.forEach(function(a,i){var p=e(t,1.2,.8+i*.03);if(p>0)line(c,a.map(function(v,k){return[X(k),Y(v)]}),'rgba(255,255,255,.13)',1,p)});
  var q=e(t,1,2.6);if(q>0){var lo=[],md=[],hi=[];for(k=0;k<=S;k++){var col=paths.map(function(a){return a[k]}).sort(function(a,b){return a-b});lo.push(col[4]);md.push(col[24]);hi.push(col[43])}
    c.save();c.beginPath();c.rect(X(0),0,(B.r-X(0))*q+1,h);c.clip();c.beginPath();for(k=0;k<=S;k++)c[k?'lineTo':'moveTo'](X(k),Y(hi[k]));for(k=S;k>=0;k--)c.lineTo(X(k),Y(lo[k]));c.closePath();c.fillStyle=A(SIG,.16);c.fill();
    line(c,md.map(function(v,k){return[X(k),Y(v)]}),SIG,2.4);c.restore();c.globalAlpha=e(t,.4,3.5);tx(c,'P90',B.r+10,Y(hi[S]),{b:'middle',s:11});tx(c,'Median',B.r+10,Y(md[S]),{b:'middle',s:12,c:W,w:500});tx(c,'P10',B.r+10,Y(lo[S]),{b:'middle',s:11});c.globalAlpha=1}
  cap(c,'Revenue: 48 simulated paths for the next 12 months',B.l,B.t-20,{mw:B.w});
};
V['z-bayes']=function(c,w,h,t){var B=box(w,h,{t:86,b:46,l:28,r:28}),g=function(x,m,s){return Math.exp(-Math.pow(x-m,2)/(2*s*s))},X=function(x){return B.l+B.w*x},p=e(t,1.2,.2),p2=e(t,1.2,.9),i;
  hl(c,B.l,B.r,B.b,'#3A3A3A');
  function curve(m,s,col,fill,pp,hgt){if(pp<=0)return;c.beginPath();c.moveTo(X(0),B.b);for(i=0;i<=100;i++)c.lineTo(X(i/100),B.b-B.h*hgt*g(i/100,m,s)*pp);c.lineTo(X(1),B.b);c.closePath();c.fillStyle=fill;c.fill();
    var pts=[];for(i=0;i<=100;i++)pts.push([X(i/100),B.b-B.h*hgt*g(i/100,m,s)*pp]);line(c,pts,col,2)}
  curve(.4,.085,'#8A8A8A','rgba(255,255,255,.06)',p,.82);curve(.6,.075,SIG,A(SIG,.18),p2,.94);
  c.globalAlpha=p;tx(c,'Variant A',X(.4),B.b-B.h*.82-12,{a:'center',s:12});c.globalAlpha=p2;tx(c,'Variant B',X(.6),B.b-B.h*.94-12,{a:'center',s:12,c:W,w:500});c.globalAlpha=1;
  var q=e(t,1.4,1.8);cap(c,'Probability B beats A',B.l,34);tx(c,Math.round(95*q)+'%',B.l,68,{s:30,w:300,c:W});
  c.globalAlpha=e(t,.4,3);cap(c,'Decision: ship B',B.r,62,{a:'right',c:SIG});c.globalAlpha=1;
  cap(c,'Conversion rate →',B.r,B.b+24,{a:'right'});cap(c,'Plausibility',B.l,B.b+24);
};
V['z-pareto']=function(c,w,h,t){var d=[34,22,14,8,6,4,3,3,2,2,1,1],n=d.length,B=box(w,h,{t:44,b:44,l:40,r:24}),g=B.w/n,bw=g*.62,Y=function(v){return B.b-B.h*v/100},cum=0,pts=[],i;
  [0,20,40,60,80,100].forEach(function(v){hl(c,B.l,B.r,Y(v),v==80?'rgba(255,255,255,.22)':G);tx(c,v+'%',B.l-8,Y(v),{a:'right',b:'middle',s:10,c:M})});
  d.forEach(function(v,i){bar(c,B.l+g*i+(g-bw)/2,B.b,bw,(B.b-Y(v))*e(t,.6,.15+i*.07),i<3?SIG:'#4A4A4A');cum+=v;pts.push([B.l+g*i+g/2,Y(cum)]);if(g>26)tx(c,'S'+(i+1),B.l+g*i+g/2,B.b+18,{a:'center',s:10,c:i<3?W:M})});
  var p=e(t,1.4,1.1);line(c,pts,W,1.8,p);pts.forEach(function(pt,i){if(p*(n-1)>=i)dot(c,pt[0],pt[1],2.6,W)});
  var q=e(t,.5,2.4);c.globalAlpha=q;ring(c,pts[2][0],pts[2][1],8,SIG,1.5);tx(c,'3 of 12 segments: 70% of revenue',pts[2][0]+14,pts[2][1]+16,{s:12,c:W,w:500,mw:B.r-pts[2][0]-16});c.globalAlpha=1;
  cap(c,'Share of revenue by segment, and cumulative share',B.l,B.t-20,{mw:B.w});
};
V['z-ltv']=function(c,w,h,t){var B=box(w,h,{t:44,b:44,l:28,r:28}),f=function(m){return 100*(1-Math.exp(-m/7))},cac=46,X=function(m){return B.l+B.w*m/18},Y=function(v){return B.b-B.h*v/100},pb=-7*Math.log(1-cac/100),p=e(t,1.8,.1),pts=[],m;
  grid(c,B,4);for(m=0;m<=18.001;m+=.25)pts.push([X(m),Y(f(m))]);
  c.save();c.beginPath();c.rect(B.l,0,B.w*p,h);c.clip();c.beginPath();c.moveTo(X(pb),Y(cac));for(m=pb;m<=18.001;m+=.25)c.lineTo(X(m),Y(f(m)));c.lineTo(X(18),Y(cac));c.closePath();c.fillStyle=A(SIG,.16);c.fill();c.restore();
  c.save();c.setLineDash([5,4]);hl(c,B.l,B.r,Y(cac),'#9A9A9A');c.restore();cap(c,'Acquisition cost',B.l+4,Y(cac)-8);line(c,pts,W,2,p);
  var q=e(t,.5,1.5);c.globalAlpha=q;vl(c,X(pb),Y(cac),B.b,SIG,[3,3]);dot(c,X(pb),Y(cac),5,SIG);cap(c,'Payback: month '+Math.round(pb),X(pb)+10,B.b-10,{c:W});cap(c,'Profit per customer',X(13.5),Y((cac+f(13.5))/2)+4,{a:'center',c:SIG});c.globalAlpha=1;
  cap(c,'Cumulative margin per customer',B.l,B.t-20);cap(c,'Months since acquisition →',B.r,B.b+24,{a:'right'});
};
V['z-counter']=function(c,w,h,t){var B=box(w,h,{t:44,b:40,l:24,r:Math.min(120,w*.28)}),n=30,rnd=R(23),act=[],cf=[],i,s=13;for(i=0;i<n;i++){var b=44+i*.35+Math.sin(i/2.2)*3+(rnd()-.5)*3;cf.push(44+i*.35+Math.sin(i/2.2)*3);act.push(i<s?b:b+(i-s)*1.55)}
  var X=function(i){return B.l+B.w*i/(n-1)},Y=function(v){return B.b-B.h*(v-25)/75},p=e(t,2,.1);grid(c,B,4);
  c.save();c.beginPath();c.rect(B.l,0,B.w*p+1,h);c.clip();
  c.beginPath();for(i=s;i<n;i++)c[i==s?'moveTo':'lineTo'](X(i),Y(act[i]));for(i=n-1;i>=s;i--)c.lineTo(X(i),Y(cf[i]));c.closePath();c.fillStyle=A(SIG,.18);c.fill();
  c.beginPath();for(i=s;i<n;i++)c[i==s?'moveTo':'lineTo'](X(i),Y(cf[i]+2+(i-s)*.35));for(i=n-1;i>=s;i--)c.lineTo(X(i),Y(cf[i]-2-(i-s)*.35));c.closePath();c.fillStyle='rgba(255,255,255,.06)';c.fill();
  c.setLineDash([5,4]);line(c,cf.slice(s).map(function(v,k){return[X(k+s),Y(v)]}),'#8A8A8A',1.5);c.setLineDash([]);line(c,act.map(function(v,i){return[X(i),Y(v)]}),W,2);c.restore();
  vl(c,X(s),B.t,B.b,M,[2,4]);cap(c,'Engagement starts',X(s),B.t-8,{a:'center'});
  c.globalAlpha=e(t,.5,2.1);tx(c,'Actual',B.r+10,Y(act[n-1]),{b:'middle',s:12,c:W,w:500});tx(c,'Modelled baseline',B.r+10,Y(cf[n-1]),{b:'middle',s:11,mw:B.r-B.l>0?Math.min(120,w*.28)-14:80});cap(c,'Incremental revenue',X((s+n)/2+2),Y((act[n-4]+cf[n-4])/2)+4,{a:'center',c:SIG});c.globalAlpha=1;
  cap(c,'Week 1',B.l,B.b+20);cap(c,'Week 30',B.r,B.b+20,{a:'right'});
};
V['z-corr']=function(c,w,h,t){var ch=['Meta','Google','TikTok','Creators','Search','CRM'],n=6,M2=[[1],[.3,1],[.5,.2,1],[.4,.1,.6,1],[.2,.5,.3,.8,1],[.1,.3,.1,.4,.5,1]];
  var S=Math.min(w-140,h-90),B={l:(w-S)/2+40,t:(h-S)/2+6},cs=S/n,i,j;cap(c,'How channels move together: correlation of weekly revenue',24,28,{mw:w-48});
  for(i=0;i<n;i++){tx(c,ch[i],B.l-12,B.t+cs*i+cs/2,{a:'right',b:'middle',s:12});tx(c,cs<52?ch[i].slice(0,3):ch[i],B.l+cs*i+cs/2,B.t+S+16,{a:'center',s:11})
    for(j=0;j<=i;j++){var v=M2[i][j],p=e(t,.4,.2+(i+j)*.14),x=B.l+cs*j+cs/2,y=B.t+cs*i+cs/2,hi=(i==4&&j==3);c.strokeStyle='rgba(255,255,255,.06)';c.strokeRect(B.l+cs*j+.5,B.t+cs*i+.5,cs,cs);
      if(i==j){dot(c,x,y,2,'#3A3A3A');continue}dot(c,x,y,cs*.42*v*p,hi?SIG:'rgba(255,255,255,'+(.12+v*.4)+')');if(hi&&t>2.4){var ph=(t*1.1)%1;ring(c,x,y,cs*.36+ph*10,A(SIG,1-ph),1.5)}
      if(cs>46&&p>.9)tx(c,v.toFixed(1),x,y,{a:'center',b:'middle',s:11,c:hi?'#04130D':W})}}
  c.globalAlpha=e(t,.5,2.6);var hx=B.l+cs*3+cs,hy=B.t+cs*4+cs/2;var nx=w<560?w-20:B.l+cs*4.3,na=w<560?'right':'left';tx(c,'Creators lift Search',nx,B.t+cs*1.2,{s:13,c:W,w:500,a:na});tx(c,'Cut one, lose both',nx,B.t+cs*1.2+18,{s:11,a:na});c.globalAlpha=1;
};

/* ---------------- LOGO MARQUEE: swaps in official logo files when present ---------------- */
function logos(){[].forEach.call(document.querySelectorAll('.mq-track'),function(t){var k=[].slice.call(t.children);k.forEach(function(n){var c=n.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c)});t.style.animationDuration=(t.parentNode.classList.contains('rev')?116:92)+'s'});var els=document.querySelectorAll('.mq [data-logo]');if(!els.length||!window.fetch)return;var base=(document.body.getAttribute('data-root')||'')+'assets/logos/';
  fetch(base+'index.json').then(function(r){return r.ok?r.json():[]}).then(function(list){var map={};(list||[]).forEach(function(f){map[String(f).replace(/\.[a-z]+$/,'')]=f});
    [].forEach.call(els,function(el){var f=map[el.getAttribute('data-logo')];if(!f)return;var im=new Image();im.alt=el.textContent;im.onload=function(){var m=el.closest('.mq'),sm=m&&m.classList.contains('sm');if(sm){el.insertBefore(im,el.firstChild)}else{el.textContent='';el.appendChild(im);if(m)m.classList.add('has-logos')}el.classList.add('has-img')};im.src=base+f})}).catch(function(){})}

/* ---------------- BUDGET SIMULATOR ---------------- */
/* ---------------- SCROLLY: pin an element and drive it by scroll progress ---------------- */
window.bspScrolly=function(el,cb,K){var wrap=document.createElement('div');wrap.className='scrolly';el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);var pinned=false,top=90;K=K||1.6;
  function layout(){var vh=window.innerHeight,h=el.offsetHeight;top=window.innerWidth<=900?72:90;pinned=h<=vh-top-8;el.classList.toggle('pinned',pinned);el.style.top=pinned?Math.max(top,Math.round((vh-h)/2))+'px':'';wrap.style.height=pinned?Math.round(h+vh*K)+'px':''}
  function upd(){var vh=window.innerHeight,r=wrap.getBoundingClientRect(),h=el.offsetHeight,p;if(pinned){var t=parseFloat(el.style.top)||top;p=(t-r.top)/Math.max(1,wrap.offsetHeight-h)}else{p=(vh*.75-r.top)/(r.height+vh*.15)}cb(Math.max(0,Math.min(1,p)))}
  layout();window.addEventListener('resize',function(){layout();upd()});window.addEventListener('scroll',upd,{passive:true});setTimeout(function(){layout();upd()},600);upd();return{wrap:wrap,relayout:function(){layout();upd()}}};
function sim(){var el=document.getElementById('sim');if(!el)return;var manual=false,ch=[{n:'Meta',a:60,k:22,s:40},{n:'Google',a:52,k:16,s:30},{n:'TikTok',a:48,k:30,s:10},{n:'Creators',a:70,k:38,s:20}],init=ch.map(function(x){return x.s});
  var rev=function(x,s){return x.a*(1-Math.exp(-s/x.k))},mar=function(x,s){return x.a/x.k*Math.exp(-s/x.k)},tot=function(a){return a.reduce(function(m,s,i){return m+rev(ch[i],s)},0)};
  var opt=[0,0,0,0],i;for(i=0;i<1000;i++){var b=0,bm=-1;ch.forEach(function(x,j){var m=mar(x,opt[j]);if(m>bm){bm=m;b=j}});opt[b]+=.1}var best=tot(opt);
  var ctl=el.querySelector('.sim-rows');ch.forEach(function(x,j){var r=document.createElement('div');r.className='sim-row';r.innerHTML='<div class="sim-h"><b>'+x.n+'</b><span class="sim-v"></span></div><input type="range" min="0" max="100" step="1" aria-label="'+x.n+' share of budget"><span class="sim-m"></span>';ctl.appendChild(r);x.el=r;
    r.querySelector('input').addEventListener('input',function(){manual=true;var v=+this.value,rest=ch.reduce(function(m,y,q){return q==j?m:m+y.s},0);ch.forEach(function(y,q){if(q!=j)y.s=rest>0?y.s*(100-v)/rest:(100-v)/3});x.s=v;anim=null;paint()})});
  var cv=el.querySelector('canvas'),c=cv.getContext('2d'),anim=null;
  function paint(){var cur=ch.map(function(x){return x.s}),now=tot(cur),mm=Math.max.apply(null,ch.map(function(x){return mar(x,x.s)}));
    ch.forEach(function(x){x.el.querySelector('input').value=Math.round(x.s);x.el.querySelector('.sim-v').textContent=Math.round(x.s)+'%';var m=mar(x,x.s),sm=x.el.querySelector('.sim-m');sm.textContent='Next unit returns '+m.toFixed(2)+'×';sm.classList.toggle('hot',m>=mm-1e-9)});
    el.querySelector('#sim-rev').textContent=(now/best*100).toFixed(1);el.querySelector('#sim-gap').textContent=Math.max(0,(1-now/best)*100).toFixed(1)+'%';draw()}
  function draw(){var dpr=Math.min(2,window.devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;if(!w)return;cv.width=w*dpr;cv.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    var B=box(w,h,{t:34,b:40,l:24,r:Math.min(92,w*.22)}),X=function(s){return B.l+B.w*s/100},Y=function(v){return B.b-B.h*v/70};grid(c,B,4);cap(c,'Revenue response by channel',B.l,B.t-14);cap(c,'Share of budget →',B.r,B.b+22,{a:'right'});
    var mm=Math.max.apply(null,ch.map(function(x){return mar(x,x.s)})),ends=ch.map(function(x,j){return{j:j,y:Y(rev(x,100))}}).sort(function(a,b){return a.y-b.y});for(var q=1;q<4;q++)if(ends[q].y-ends[q-1].y<15)ends[q].y=ends[q-1].y+15;
    ch.forEach(function(x,j){var pts=[],s;for(s=0;s<=100;s+=2)pts.push([X(s),Y(rev(x,s))]);var hot=mar(x,x.s)>=mm-1e-9;line(c,pts,hot?A(SIG,.9):'#4A4A4A',hot?2:1.5);ring(c,X(opt[j]),Y(rev(x,opt[j])),6,'rgba(255,255,255,.35)',1);dot(c,X(x.s),Y(rev(x,x.s)),5,hot?SIG:W)});
    ends.forEach(function(o){tx(c,ch[o.j].n,B.r+10,o.y,{b:'middle',s:11,c:T})});ring(c,B.l+6,h-12,4,'rgba(255,255,255,.35)');cap(c,'Optimal position',B.l+16,h-8)}
  function go(target){var from=ch.map(function(x){return x.s}),t0=performance.now();anim=function(now){if(!anim)return;var p=e((now-t0)/900,1);ch.forEach(function(x,j){x.s=from[j]+(target[j]-from[j])*p});paint();if(p<1)requestAnimationFrame(anim);else anim=null};requestAnimationFrame(anim)}
  el.querySelector('#sim-opt').addEventListener('click',function(){manual=true;go(opt)});el.querySelector('#sim-reset').addEventListener('click',function(){manual=true;go(init)});
  if(window.ResizeObserver)new ResizeObserver(draw).observe(cv);paint();
  var tcap=document.createElement('div');tcap.className='sim-tour';tcap.innerHTML='<span></span><i><b></b></i>';var so=el.querySelector('.sim-out');so.insertBefore(tcap,so.firstChild);
  window.bspScrolly(el,function(p){if(manual){tcap.firstChild.textContent='Your allocation';return}var x=Math.max(0,Math.min(1,(p-.12)/.66));x=x*x*(3-2*x);ch.forEach(function(c,j){c.s=init[j]+(opt[j]-init[j])*x});tcap.firstChild.textContent=x<.02?'Starting allocation · keep scrolling to optimise':x>.98?'Optimal allocation reached':'Rebalancing toward equal marginal return';tcap.querySelector('b').style.width=Math.round(x*100)+'%';anim=null;paint()},1.4)}

/* ---------------- GO-TO-MARKET ---------------- */
V['g-sequence']=function(c,w,h,t){var mk=[['Vietnam',[5,4,4,5,3]],['Singapore',[3,5,4,3,4]],['Malaysia',[4,3,3,4,3]],['Thailand',[4,4,2,3,3]]],cr=['Demand','Access','Partners','Economics','Regulation'],TH=18,wide=w>=560;
  var B=box(w,h,{t:wide?70:56,b:40,l:Math.min(104,w*.26),r:wide?96:110}),rh=B.h/mk.length,cx0=B.l,cw=wide?B.w*.52/5:0,bx=wide?B.l+B.w*.56:B.l,bwid=B.r-bx,i,j;
  cap(c,'Market readiness score, out of 25',24,28,{mw:w-48});
  if(wide)cr.forEach(function(s,j){tx(c,s,cx0+cw*j+cw/2,B.t-14,{a:'center',s:11,c:T,mw:cw-4})});
  var thx=bx+bwid*TH/25;vl(c,thx,B.t-6,B.b+6,'rgba(255,255,255,.35)',[3,4]);cap(c,'Entry threshold: '+TH,thx,B.b+24,{a:'center',c:W});
  mk.forEach(function(m,i){var y=B.t+rh*i+rh/2,st=.2+i*.45,tot=m[1].reduce(function(a,b){return a+b},0),go=tot>=TH,p=e(t,.9,st+.3),done=t>st+1.4;
    hl(c,24,B.r+B.l,B.t+rh*(i+1),'rgba(255,255,255,.05)');tx(c,m[0],B.l-14,y,{a:'right',b:'middle',s:13,c:done&&go?W:T,w:done&&go?500:400});
    if(wide)m[1].forEach(function(v,j){var q=e(t,.35,st+j*.08),x=cx0+cw*j+cw/2;ring(c,x,y,9,'rgba(255,255,255,.1)');dot(c,x,y,9*v/5*q,'#5A5A5A');if(q>.9)tx(c,''+v,x,y+22,{a:'center',s:10,c:M})});
    var bh=Math.min(14,rh*.3);hbar(c,bx,y-bh/2,bwid*tot/25*p,bh,done&&go?SIG:'#4A4A4A');
    c.globalAlpha=e(t,.4,st+1.2);tx(c,''+tot,bx+bwid*tot/25*p+8,y,{b:'middle',s:13,c:W});cap(c,go?'Enter now':'Prepare',w-20,y+4,{a:'right',c:go?SIG:T});c.globalAlpha=1})};
V['g-stack']=function(c,w,h,t){var it=['Marketplace stores','Tracking and attribution','CRM and Zalo OA','Creator roster','Media accounts and budgets','Reporting on Bespoke Engine'],n=it.length;
  var B=box(w,h,{t:96,b:30,l:24,r:24}),rh=B.h/n,lw=Math.min(210,w*.46),bx=B.l+lw,bw=B.r-bx-40,D=4.2,day=Math.round(-30+30*cl((t-.2)/D)),ready=t>.2+D;
  cap(c,'Countdown to launch',24,30);tx(c,day==0?'Day 0':'Day −'+Math.abs(day),24,70,{s:30,w:300,c:ready?SIG:W});
  c.globalAlpha=e(t,.4,.2+D);cap(c,'Ready for launch',w-24,64,{a:'right',c:SIG});c.globalAlpha=1;
  it.forEach(function(s,i){var y=B.t+rh*i+rh/2,st=.3+i*.55,p=e(t,1.2,st),ok=p>.99;
    tx(c,s,B.l,y,{b:'middle',s:13,c:ok?W:T,mw:lw-14});hbar(c,bx,y-2,bw,4,'#1E1E1E');hbar(c,bx,y-2,bw*p,4,ok?SIG:'#7A7A7A');
    if(ok){ring(c,B.r-12,y,8,SIG,1.5);c.strokeStyle=SIG;c.lineWidth=1.6;c.beginPath();c.moveTo(B.r-16,y);c.lineTo(B.r-13,y+3);c.lineTo(B.r-8,y-3);c.stroke();c.lineWidth=1}else ring(c,B.r-12,y,8,'#3A3A3A')})};
V['g-launch']=function(c,w,h,t,a){if(a==null)a=.6;var nar=w<560,RW=nar?96:Math.min(190,w*.36),B=box(w,h,{t:48,b:40,l:24,r:RW}),N=72,camp=[],inf=[],i,L=14+46*a;
  for(i=0;i<N;i++){var x=i*180/(N-1);camp.push(10+82*Math.exp(-x/11)+4*(1-Math.exp(-x/30)));inf.push(10+64*Math.exp(-x/13)+(L-10)*(1-Math.exp(-x/28)))}
  var X=function(i){return B.l+B.w*i/(N-1)},Y=function(v){return B.b-B.h*v/96},p=e(t,2.2,.1);grid(c,B,4);cap(c,'Weekly revenue after launch',B.l,B.t-20);
  c.save();c.beginPath();c.rect(B.l,0,B.w*p+1,h);c.clip();c.beginPath();var k0=12;for(i=k0;i<N;i++)c[i==k0?'moveTo':'lineTo'](X(i),Y(Math.max(inf[i],camp[i])));for(i=N-1;i>=k0;i--)c.lineTo(X(i),Y(camp[i]));c.closePath();c.fillStyle=A(SIG,.16);c.fill();
  line(c,camp.map(function(v,i){return[X(i),Y(v)]}),'#8A8A8A',1.6);line(c,inf.map(function(v,i){return[X(i),Y(v)]}),SIG,2.4);c.restore();
  vl(c,X(0),B.t,B.b,M,[2,4]);cap(c,'Day 0',X(0),B.b+20);cap(c,'Day 180',B.r,B.b+20,{a:'right'});
  c.globalAlpha=e(t,.5,2.2);var yc=Y(camp[N-1]),yi=Y(inf[N-1]);if(yc-yi<48)yi=yc-48
  tx(c,nar?'Campaign':'Campaign launch',B.r+12,yc,{b:'middle',s:12});tx(c,nar?'Infrastructure':'Built on infrastructure',B.r+12,yi-10,{b:'middle',s:12,c:W,w:500});
  tx(c,(inf[N-1]/camp[N-1]).toFixed(1)+'× revenue',B.r+12,yi+8,{b:'middle',s:11,c:SIG});if(!nar)tx(c,'held at Day 180',B.r+12,yi+24,{b:'middle',s:11,c:SIG});c.globalAlpha=1};
V['g-launch'].adj={label:'Built before launch',min:0,max:1,val:.6,fmt:function(v){return Math.round(v*100)+'% of the stack'}};
V['g-gate']=function(c,w,h,t){var g=[[30,'Signal','Cost per acquisition within target'],[60,'Traction','Repeat purchase rate above plan'],[90,'Scale','Contribution margin positive']],B=box(w,h,{t:40,b:44,l:30,r:30}),X=function(d){return B.l+B.w*d/90},D=6,day=90*cl((t-.3)/D),ty=B.t+B.h*.52,i;
  var bw=B.w/13*.56,bb=B.b;cap(c,'First 90 days',B.l,B.t-16);
  for(i=0;i<13;i++){var d=(i+.5)*90/13,v=.18+.7*(1-Math.exp(-i/5));bar(c,X(d)-bw/2,bb,bw,(bb-ty-24)*v*(day>=d?1:0)*e(t,.4,.3+D*d/90),'#3E3E3E')}
  hl(c,B.l,B.r,ty,'#3A3A3A');c.strokeStyle=SIG;c.lineWidth=2;c.beginPath();c.moveTo(B.l,ty);c.lineTo(X(day),ty);c.stroke();c.lineWidth=1;dot(c,X(day),ty,5,SIG);
  cap(c,'Day 0',B.l,B.b+22);cap(c,'Day '+Math.round(day),X(day),ty+22,{a:day>80?'right':'center',c:W});
  var cw=Math.min(220,B.w/3-14),sm=w<560;
  g.forEach(function(q,i){var x=X(q[0]),pass=day>=q[0]-.01,cy=B.t+4,ch=sm?44:72;cw=B.w/3-10;var cx=B.l+i*(B.w/3)+5;
    c.save();c.setLineDash([2,3]);c.strokeStyle=pass?A(SIG,.6):'rgba(255,255,255,.15)';c.beginPath();c.moveTo(cx+cw/2,cy+ch);c.lineTo(x,ty-8);c.stroke();c.restore();ring(c,x,ty,7,pass?SIG:'#4A4A4A',1.5);if(pass)dot(c,x,ty,3.5,SIG);
    c.fillStyle='#101010';rr(c,cx,cy,cw,ch,6);c.fill();c.strokeStyle=pass?A(SIG,.7):'rgba(255,255,255,.12)';c.stroke();
    cap(c,'Day '+q[0]+' · '+q[1],cx+10,cy+18,{c:pass?SIG:T,mw:cw-16});if(!sm)wrap(c,q[2],cx+10,cy+40,cw-20,16,{s:12,c:pass?W:T});else tx(c,pass?'Passed':'Pending',cx+10,cy+34,{s:11,c:pass?W:M})})};

/* ---------------- ABOUT + GTM VISUALS ---------------- */
V['a-network']=function(c,w,h,t){var N={hcm:[.56,.5,'Ho Chi Minh City','HQ'],sg:[.48,.86,'Singapore','Office'],kl:[.3,.76,'Kuala Lumpur',''],bkk:[.34,.26,'Bangkok',''],hn:[.62,.1,'Hanoi','']},P=function(k){return[N[k][0]*w,N[k][1]*h]},rnd=R(77),i;
  for(i=0;i<260;i++){var x=rnd(),y=rnd(),d=Math.hypot(x-.46,y-.52);if(d>.5)continue;c.globalAlpha=(1-d/.5)*.35*e(t,1,rnd()*.8);dot(c,x*w,y*h,1.1,'#5A5A5A')}c.globalAlpha=1;
  var hub=P('hcm');['sg','kl','bkk','hn'].forEach(function(k,j){var b=P(k),mx=(hub[0]+b[0])/2,my=Math.min(hub[1],b[1])-h*.12,p=e(t,1.2,.4+j*.25);if(p<=0)return;
    c.beginPath();c.moveTo(hub[0],hub[1]);for(var s=0;s<=p+1e-6;s+=.02){var u=Math.min(s,p);c.lineTo((1-u)*(1-u)*hub[0]+2*(1-u)*u*mx+u*u*b[0],(1-u)*(1-u)*hub[1]+2*(1-u)*u*my+u*u*b[1])}c.strokeStyle=k=='sg'?A(SIG,.7):'rgba(255,255,255,.22)';c.lineWidth=k=='sg'?1.6:1;c.stroke();
    if(p>.99)for(var q=0;q<2;q++){var u2=(t*.28+q*.5+j*.21)%1;dot(c,(1-u2)*(1-u2)*hub[0]+2*(1-u2)*u2*mx+u2*u2*b[0],(1-u2)*(1-u2)*hub[1]+2*(1-u2)*u2*my+u2*u2*b[1],1.8,k=='sg'?SIG:'rgba(255,255,255,.6)')}});
  Object.keys(N).forEach(function(k,j){var p=P(k),o=N[k][3],q=e(t,.6,.2+j*.15);if(q<=0)return;c.globalAlpha=q;
    if(o){var ph=(t*.7+j*.3)%1;ring(c,p[0],p[1],6+ph*22,A(SIG,(1-ph)*.6),1);dot(c,p[0],p[1],5,SIG)}else dot(c,p[0],p[1],3.5,'#BDBDBD');
    var rt=p[0]>w*.5;tx(c,N[k][2],p[0]+(rt?12:-12),p[1]-2,{a:rt?'left':'right',b:'middle',s:12,c:o?W:T,w:o?500:400});if(o)cap(c,o,p[0]+(rt?12:-12),p[1]+15,{a:rt?'left':'right',c:SIG});c.globalAlpha=1})};
V['a-story']=function(c,w,h,t){var mid=w*.5,B={t:56,b:h-58},bh=B.b-B.t,i,L=24,Rr=w-24;
  cap(c,'Campaign by campaign',L,30);cap(c,'One infrastructure',mid+24,30,{c:SIG});vl(c,mid,22,h-22,'rgba(255,255,255,.1)');hl(c,L,mid-24,B.b,'#3A3A3A');hl(c,mid+24,Rr,B.b,'#3A3A3A');
  var n=5,gw=(mid-24-L)/n;for(i=0;i<n;i++){var st=.2+i*.5,p=t-st;if(p<0)continue;var x0=L+gw*i,pk=Math.max(0,Math.min(1,p/.35)),fall=p>.6?Math.max(0,1-(p-.6)/.6):1,hv=bh*(.55+.25*((i*37)%3)/2)*pk*fall,pts=[],k;
    var hf=bh*(.55+.25*((i*37)%3)/2),gh=[];for(k=0;k<=24;k++){var u=k/24,y=Math.exp(-Math.pow((u-.4)/.16,2));pts.push([x0+gw*u,B.b-y*hv]);gh.push([x0+gw*u,B.b-y*hf])}if(p>.35){c.save();c.setLineDash([3,4]);line(c,gh,'rgba(255,255,255,.22)',1);c.restore()}line(c,pts,'#8A8A8A',1.6);
    var lr=Math.max(.15,1-(p-.9)/.8);if(p>.3){c.globalAlpha=lr;hbar(c,x0+gw*.2,B.b+12,gw*.6,4,'#5A5A5A');c.globalAlpha=1}}
  cap(c,'Learning ends with each campaign',L,h-18,{mw:mid-48});
  var m=8,gw2=(Rr-mid-24)/m,bw=gw2*.56,acc=0;for(i=0;i<m;i++){var st2=2.8+i*.32,q=e(t,.5,st2);acc=.18+.1*i;var x=mid+24+gw2*i+(gw2-bw)/2;bar(c,x,B.b,bw,bh*acc*q*.95,i==m-1?SIG:A(SIG,.35+.5*i/m));
    if(q>0){c.globalAlpha=q;hbar(c,mid+24,B.b+12,(gw2*(i+1)-6)*q,4,SIG);c.globalAlpha=1}}
  c.globalAlpha=e(t,.5,5.6);cap(c,'Learning compounds',mid+24,h-18,{c:W});c.globalAlpha=1};
V['a-evolution']=function(c,w,h,t){var cw=w/3,ty=h-26,base=ty-34,top=24,i,k,pr=e(t,3.2,.3),nowx=cw*2.5;
  hl(c,cw*.5,nowx,ty,'#2A2A2A');c.strokeStyle=SIG;c.lineWidth=2;c.beginPath();c.moveTo(cw*.5,ty);c.lineTo(cw*.5+(nowx-cw*.5)*pr,ty);c.stroke();c.lineWidth=1;
  for(i=0;i<3;i++){var cx=cw*i+cw/2,on=pr>=(i/2)-.001,q=e(t,.9,.3+i*1.4),x0=cw*i+cw*.14,x1=cw*(i+1)-cw*.14,gw=x1-x0,H=base-top;
    dot(c,cx,ty,on?5:4,on?(i==2?SIG:'#BDBDBD'):'#3A3A3A');if(i==2&&on){var ph=(t*.8)%1;ring(c,cx,ty,6+ph*14,A(SIG,1-ph),1.2)}
    if(q<=0)continue;c.globalAlpha=i==2?1:.85;
    if(i==0){for(k=0;k<9;k++){var v=.25+.6*Math.abs(Math.sin(k*1.7+1)),bw=gw/9*.5;bar(c,x0+gw*k/9+(gw/9-bw)/2,base,bw,H*v*e(t,.4,.3+k*.06),'#5A5A5A',2)}}
    else if(i==1){var pts=[];for(k=0;k<=40;k++){var u=k/40,y=u<.25?.12:.12+.8*Math.exp(-Math.pow((u-.4)/.1,2))+.12*(u>.4?1:0);pts.push([x0+gw*u,base-H*Math.min(1,y)])}line(c,pts,'#BDBDBD',1.8,q)}
    else{for(k=0;k<8;k++){var bw2=gw/8*.56;bar(c,x0+gw*k/8+(gw/8-bw2)/2,base,bw2,H*(.15+.1*k)*e(t,.4,3.1+k*.1),k==7?SIG:A(SIG,.3+.5*k/8),2)}}
    c.globalAlpha=1}};
V['g-inbound']=function(c,w,h,t){var src=[['Japan',.24],['Korea',.5],['Europe',.76]],dst=[['Singapore',.24],['Malaysia',.5],['Thailand',.76]],vn=[w*.5,h*.5],lx=Math.max(64,w*.16),rx=w-Math.max(76,w*.16),i;
  src.forEach(function(s,i){var y=h*s[1],p=e(t,1,.2+i*.2);c.globalAlpha=p;c.strokeStyle='rgba(255,255,255,.2)';c.beginPath();c.moveTo(lx,y);c.bezierCurveTo((lx+vn[0])/2,y,(lx+vn[0])/2,vn[1],vn[0]-14,vn[1]);c.stroke();
    tx(c,s[0],lx-10,y,{a:'right',b:'middle',s:12,c:T});dot(c,lx,y,3,'#8A8A8A');var u=(t*.35+i*.33)%1;if(p>.99)dot(c,bez(lx,(lx+vn[0])/2,(lx+vn[0])/2,vn[0],u),bez(y,y,vn[1],vn[1],u),2,'rgba(255,255,255,.7)');c.globalAlpha=1});
  dst.forEach(function(s,i){var y=h*s[1],p=e(t,1,1.4+i*.2);if(p<=0)return;c.globalAlpha=p;c.strokeStyle=A(SIG,.5);c.beginPath();c.moveTo(vn[0]+14,vn[1]);c.bezierCurveTo((rx+vn[0])/2,vn[1],(rx+vn[0])/2,y,rx,y);c.stroke();
    tx(c,s[0],rx+10,y,{b:'middle',s:12,c:W});dot(c,rx,y,3,SIG);var u=(t*.35+i*.33)%1;if(p>.99)dot(c,bez(vn[0],(rx+vn[0])/2,(rx+vn[0])/2,rx,u),bez(vn[1],vn[1],y,y,u),2,SIG);c.globalAlpha=1});
  var ph=(t*.8)%1;ring(c,vn[0],vn[1],12+ph*16,A(SIG,(1-ph)*.6),1.2);dot(c,vn[0],vn[1],12,SIG);cap(c,'Vietnam',vn[0],vn[1]+32,{a:'center',c:W})};
V['g-newline']=function(c,w,h,t){var B=box(w,h,{t:24,b:30,l:20,r:20}),n=30,X=function(i){return B.l+B.w*i/(n-1)},Y=function(v){return B.b-B.h*v},core=[],nw=[],i,s0=12,p=e(t,2,.1);
  for(i=0;i<n;i++){core.push(.34+.004*i+.02*Math.sin(i/2));nw.push(i<s0?0:.5*(1-Math.exp(-(i-s0)/6)))}
  c.save();c.beginPath();c.rect(B.l,0,B.w*p+1,h);c.clip();
  c.beginPath();c.moveTo(X(0),B.b);core.forEach(function(v,i){c.lineTo(X(i),Y(v))});c.lineTo(X(n-1),B.b);c.closePath();c.fillStyle='#2A2A2A';c.fill();
  c.beginPath();for(i=s0;i<n;i++)c.lineTo(X(i),Y(core[i]+nw[i])-1);for(i=n-1;i>=s0;i--)c.lineTo(X(i),Y(core[i]));c.closePath();c.fillStyle=A(SIG,.75);c.fill();c.restore();
  vl(c,X(s0),B.t,B.b,'rgba(255,255,255,.35)',[2,4]);cap(c,'Launch',X(s0)+8,B.t+10,{c:W});
  c.globalAlpha=e(t,.5,2);cap(c,'Core business',B.l+10,B.b-14);cap(c,'New category',B.r-10,Y(core[n-1]+nw[n-1]/2)+4,{a:'right',c:'#04130D'});c.globalAlpha=1};

/* ---------------- v21: "Bespoke in one minute" card visuals ---------------- */
function glow(c,x,y,r,a){var g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,A(SIG,a));g.addColorStop(1,A(SIG,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()}
function lbl(c,txt,x,y,al,col){c.font='500 10px "Be Vietnam Pro",sans-serif';c.textAlign=al||'left';c.fillStyle=col||'rgba(255,255,255,.45)';if(c.letterSpacing!==undefined)c.letterSpacing='1.5px';c.fillText(txt,x,y);if(c.letterSpacing!==undefined)c.letterSpacing='0px'}
/* 01 spend in, revenue out: particles pass through the engine core and stack into rising bars */
V['gl-what']=function(c,w,h,t){var cy=h*.52,cx=w*.44,R=Math.min(w*.13,h*.26),nar=w<320,i,k;
  lbl(c,'SPEND',12,18);lbl(c,'REVENUE',w-12,18,'right',A(SIG,.95));
  var src=[['META',.22],['TIKTOK',.42],['SEARCH',.62],['CREATORS',.82]],sx=w*.07;
  src.forEach(function(q,j){var y=h*q[1],a=.35+.25*Math.sin(t*2+j);c.fillStyle='rgba(255,255,255,'+(.5+a*.5)+')';c.beginPath();c.arc(sx,y,3,0,7);c.fill();
    if(!nar)lbl(c,q[0],sx+8,y-7,'left','rgba(255,255,255,.38)');
    c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=1;c.beginPath();c.moveTo(sx,y);c.bezierCurveTo(sx+(cx-sx)*.5,y,cx-R*1.6,cy,cx-R,cy);c.stroke();
    for(k=0;k<4;k++){var p=((t*.35+k/4+j*.13)%1),u=1-p,px=u*u*u*sx+3*u*u*p*(sx+(cx-sx)*.5)+3*u*p*p*(cx-R*1.6)+p*p*p*(cx-R),py=u*u*u*y+3*u*u*p*y+3*u*p*p*cy+p*p*p*cy;
      c.fillStyle='rgba(255,255,255,'+(.25+.6*p)+')';c.beginPath();c.arc(px,py,1.6+p,0,7);c.fill()}});
  glow(c,cx,cy,R*2.6,.22+.06*Math.sin(t*2));
  c.save();c.translate(cx,cy);c.rotate(t*.6);c.strokeStyle=A(SIG,.55);c.lineWidth=1;for(i=0;i<36;i++){var an=i/36*6.283,l=i%3?4:8;c.beginPath();c.moveTo(Math.cos(an)*R,Math.sin(an)*R);c.lineTo(Math.cos(an)*(R-l),Math.sin(an)*(R-l));c.stroke()}c.restore();
  c.strokeStyle=A(SIG,.9);c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,R*.72,t*1.4,t*1.4+4.2);c.stroke();
  c.strokeStyle=A(SIG,.35);c.beginPath();c.arc(cx,cy,R*.52,-t*1.1,-t*1.1+3);c.stroke();
  c.fillStyle='#0B0B0B';c.beginPath();c.arc(cx,cy,R*.34,0,7);c.fill();c.strokeStyle=SIG;c.lineWidth=1.2;c.stroke();
  c.fillStyle=SIG;c.beginPath();c.arc(cx,cy,R*.12+1.5*Math.sin(t*3),0,7);c.fill();
  var x0=w*.6,x1=w-12,base=h*.86,top=h*.2,gr=e(t,2,.2),n=40,pts=[];
  for(i=0;i<=n;i++){var u2=i/n,v=Math.pow(u2,1.6)*.85+.08+.03*Math.sin(u2*14+t*1.5);pts.push([x0+(x1-x0)*u2*gr,base-(base-top)*v*gr])}
  c.beginPath();c.moveTo(x0,base);pts.forEach(function(q){c.lineTo(q[0],q[1])});c.lineTo(pts[n][0],base);c.closePath();var g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,A(SIG,.35));g.addColorStop(1,A(SIG,0));c.fillStyle=g;c.fill();
  c.beginPath();pts.forEach(function(q,j){j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.strokeStyle=SIG;c.lineWidth=2;c.stroke();
  for(i=1;i<6;i++){var bx=x0+(x1-x0)*i/6*gr,by=base-(base-top)*(Math.pow(i/6,1.6)*.85+.08)*gr;c.strokeStyle='rgba(255,255,255,.06)';c.beginPath();c.moveTo(bx,base);c.lineTo(bx,by);c.stroke()}
  c.strokeStyle='rgba(255,255,255,.14)';c.beginPath();c.moveTo(x0,base+.5);c.lineTo(x1,base+.5);c.stroke();
  for(k=0;k<5;k++){var p2=((t*.5+k/5)%1);var ox=cx+R+(x0-cx-R)*p2;c.fillStyle=A(SIG,.9*(1-p2*.4));c.beginPath();c.arc(ox,cy+(base-(base-top)*.1-cy)*p2*p2,2.2,0,7);c.fill()}
  var hd=pts[n];glow(c,hd[0],hd[1],18,.6);c.fillStyle='#fff';c.beginPath();c.arc(hd[0],hd[1],3,0,7);c.fill()};

/* 02 Southeast Asia: dot-matrix region, HCMC hub with arcs to the markets we serve */
V['gl-who']=(function(){
  var LAND=[[[97.5,21],[102,21.5],[106,22.4],[108,21.5],[107,20],[105.8,19],[106.5,17.5],[108.8,15.5],[109.3,12],[108.7,11],[106.7,10.3],[104.8,8.6],[104.8,10.2],[103,11],[102.3,12.2],[100.8,12.7],[100,13.5],[99.2,11],[99.5,9],[100.3,6.5],[101,6.8],[102.1,6.2],[103.4,4.5],[103.5,2.8],[104.2,1.4],[103.5,1.3],[101.3,2.8],[100.4,4.5],[100.3,5.8],[98.7,8],[98.3,10],[98.6,13],[98,15.5],[97.5,17],[96,19.5],[97.5,21]],
   [[95.3,5.6],[97.5,5.2],[100,2.5],[104,-1],[106,-3],[105.8,-5.9],[104.5,-5.8],[102,-4],[100,-1],[98.5,1.5],[95.3,5.6]],
   [[109,1.5],[110,-1],[110.5,-3],[114.5,-4],[116.5,-3.5],[118,-1],[119,1],[119.3,5],[117,7],[116,6.5],[115,5],[113,3.2],[111,1.8],[109,1.5]],
   [[105.2,-6.8],[106,-5.9],[108.3,-6.3],[111,-6.5],[114.5,-7.7],[114.4,-8.7],[111,-8.3],[108,-7.8],[105.4,-7],[105.2,-6.8]],
   [[120,18.5],[122.2,18.5],[122,16],[121.6,14.2],[124,13],[123.5,12.7],[120.6,13.8],[120.6,15.5],[119.8,16.3],[120,18.5]],
   [[122,8],[123.5,7.5],[126.5,7],[126,9.5],[125.5,11.5],[124,12],[122.5,11],[123,9.5],[122,8]],
   [[119.5,0.5],[120,-2],[119.5,-5.5],[120.5,-5.5],[121.5,-3],[123,-1],[121.5,1],[124.8,1.5],[120.5,1],[119.5,0.5]]];
  function inP(x,y,P){var c=false;for(var i=0,j=P.length-1;i<P.length;j=i++){if((P[i][1]>y)!=(P[j][1]>y)&&x<(P[j][0]-P[i][0])*(y-P[i][1])/(P[j][1]-P[i][1])+P[i][0])c=!c}return c}
  var CITIES=[['BANGKOK',100.5,13.75,'l'],['KUALA LUMPUR',101.7,3.1,'l'],['SINGAPORE',103.8,1.35,'r'],['JAKARTA',106.8,-6.2,'r'],['MANILA',121,14.6,'r']],HUB=['HO CHI MINH CITY',106.7,10.8];
  var cache={};
  return function(c,w,h,t){var L0=94,L1=127,B0=-10,B1=22.5,pad=10,sc=Math.min((w-pad*2)/(L1-L0),(h-pad*2-14)/(B1-B0)),ox=(w-(L1-L0)*sc)/2,oy=(h-(B1-B0)*sc)/2+6,nar=w<320;
    function X(lon){return ox+(lon-L0)*sc}function Y(lat){return oy+(B1-lat)*sc}
    var key=w+'x'+h;if(!cache[key]){var dots=[],st=Math.max(5,sc*.62);for(var py=oy;py<oy+(B1-B0)*sc;py+=st)for(var px=ox;px<ox+(L1-L0)*sc;px+=st){var lon=L0+(px-ox)/sc,lat=B1-(py-oy)/sc;for(var q=0;q<LAND.length;q++)if(inP(lon,lat,LAND[q])){dots.push([px,py]);break}}cache={};cache[key]=dots}
    var D=cache[key],hx=X(HUB[1]),hy=Y(HUB[2]);
    D.forEach(function(d){var dd=Math.hypot(d[0]-hx,d[1]-hy),wave=Math.max(0,1-Math.abs(dd-((t*60)%(w*.7)))/22);c.fillStyle='rgba(255,255,255,'+(.13+.35*wave)+')';c.fillRect(d[0]-.8,d[1]-.8,1.7,1.7)});
    CITIES.forEach(function(p,k){var x=X(p[1]),y=Y(p[2]),pr=e(t,1.2,.2+k*.22),mx=(hx+x)/2,my=Math.min(hy,y)-Math.abs(x-hx)*.25-12;
      c.strokeStyle=A(SIG,.5);c.lineWidth=1.1;c.setLineDash([3,4]);c.lineDashOffset=-t*14;c.beginPath();c.moveTo(hx,hy);
      for(var q=0;q<=pr+1e-6;q+=.02){var a=1-q;c.lineTo(a*a*hx+2*a*q*mx+q*q*x,a*a*hy+2*a*q*my+q*q*y)}c.stroke();c.setLineDash([]);
      if(pr>.98){var tq=(t*.4+k*.21)%1,a2=1-tq;c.fillStyle=SIG;c.beginPath();c.arc(a2*a2*hx+2*a2*tq*mx+tq*tq*x,a2*a2*hy+2*a2*tq*my+tq*tq*y,2.2,0,7);c.fill()}
      var pu=(t*1.2+k)%2;c.strokeStyle='rgba(255,255,255,'+(.4*Math.max(0,1-pu))+')';c.beginPath();c.arc(x,y,3+pu*6,0,7);c.stroke();
      c.fillStyle='#fff';c.beginPath();c.arc(x,y,2.6*pr,0,7);c.fill();
      if(pr>.9){var nm=nar?{BANGKOK:'BKK','KUALA LUMPUR':'KL',SINGAPORE:'SG',JAKARTA:'JKT',MANILA:'MNL'}[p[0]]:p[0];c.font='500 10px "Be Vietnam Pro",sans-serif';var side=p[3];if(side=='l'&&x-8-c.measureText(nm).width*1.15<4)side='r';lbl(c,nm,side=='l'?x-8:x+8,y+3.5,side=='l'?'right':'left','rgba(255,255,255,.62)')}});
    for(var i=0;i<3;i++){var r=((t*.55+i/3)%1);c.strokeStyle=A(SIG,.7*(1-r));c.lineWidth=1.2;c.beginPath();c.arc(hx,hy,5+r*sc*4,0,7);c.stroke()}
    glow(c,hx,hy,26,.55);c.fillStyle=SIG;c.beginPath();c.arc(hx,hy,4.5,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=1.2;c.beginPath();c.arc(hx,hy,7,0,7);c.stroke();
    var hl=nar?'HCMC':HUB[0];c.font='600 10.5px "Be Vietnam Pro",sans-serif';var tw=c.measureText(hl).width+16;c.fillStyle='rgba(10,10,10,.85)';c.strokeStyle=A(SIG,.6);c.lineWidth=1;
    var bx=hx+12,by=hy+12;if(bx+tw>w-4)bx=hx-12-tw;c.beginPath();if(c.roundRect)c.roundRect(bx,by,tw,20,10);else c.rect(bx,by,tw,20);c.fill();c.stroke();lbl(c,hl,bx+8,by+13.5,'left',A(SIG,1))}})();

/* 03 three layers: isometric plates with data pulses rising through them */
V['gl-how']=function(c,w,h,t){var nar=w<340,cx=w*(nar?.33:.4),pw=Math.min(w*(nar?.25:.28),h*.6),ph=pw*.36,L=[['DEMAND',.78],['SYSTEMS',.52],['INTELLIGENCE',.26]],i;
  function plate(y,on,name,k){var off=Math.sin(t*1.2+k)*3;y+=off;c.beginPath();c.moveTo(cx,y-ph);c.lineTo(cx+pw,y);c.lineTo(cx,y+ph);c.lineTo(cx-pw,y);c.closePath();
    var g=c.createLinearGradient(cx-pw,y,cx+pw,y);g.addColorStop(0,A(SIG,.05+.12*on));g.addColorStop(1,A(SIG,.22+.25*on));c.fillStyle=g;c.fill();c.strokeStyle=A(SIG,.35+.5*on);c.lineWidth=1;c.stroke();
    c.beginPath();c.moveTo(cx-pw,y);c.lineTo(cx-pw,y+5);c.lineTo(cx,y+ph+5);c.lineTo(cx+pw,y+5);c.lineTo(cx+pw,y);c.strokeStyle=A(SIG,.2);c.stroke();
    for(var a=-2;a<=2;a++)for(var b=-2;b<=2;b++){var px=cx+(a-b)*pw/6,py=y+(a+b)*ph/6;c.fillStyle='rgba(255,255,255,'+(.08+.25*on*(Math.sin(t*4+a*b+k)>.3?1:0))+')';c.fillRect(px-1,py-1,2,2)}
    lbl(c,name,cx+pw+10,y+4,'left',on>.5?A(SIG,1):'rgba(255,255,255,.4)');return y}
  var act=Math.floor(t*.8)%3,ys=[];for(i=0;i<3;i++){var y=h*L[i][1];ys.push(plate(y,(2-i)==act?1:.25,L[i][0],i))}
  for(i=0;i<5;i++){var p=(t*.45+i/5)%1,yy=ys[0]+(ys[2]-ys[0])*p,xx=cx+Math.sin(i*2.1)*pw*.35;c.fillStyle=A(SIG,1-Math.abs(p-.5));c.fillRect(xx-1,yy-6,2,8)}};
/* 04 how to start: a path through three milestones, then a revenue line lifts off */
V['gl-start']=function(c,w,h,t){var y0=h*.72,x0=w*.08,x1=w*.92,ms=[[.0,'DISCOVERY'],[.36,'BUILD'],[.68,'OPERATE']],i,cyc=(t*.14)%1.15,p=Math.min(1,cyc);
  c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y0);c.stroke();
  function curveY(u){return u<.68?y0:y0-(h*.55)*Math.pow((u-.68)/.32,1.6)}
  c.beginPath();c.moveTo(x0,y0);for(var u=0;u<=p;u+=.005)c.lineTo(x0+(x1-x0)*u,curveY(u));c.strokeStyle=SIG;c.lineWidth=2;c.stroke();
  if(p>.68){c.lineTo(x0+(x1-x0)*p,y0);c.lineTo(x0+(x1-x0)*.68,y0);c.closePath();var g=c.createLinearGradient(0,y0-h*.55,0,y0);g.addColorStop(0,A(SIG,.3));g.addColorStop(1,A(SIG,0));c.fillStyle=g;c.fill()}
  ms.forEach(function(m,k){var x=x0+(x1-x0)*m[0],on=p>=m[0];if(on)glow(c,x,y0,18,.45);c.fillStyle=on?SIG:'#0B0B0B';c.strokeStyle=on?SIG:'rgba(255,255,255,.3)';c.lineWidth=1.5;c.beginPath();c.arc(x,y0,5,0,7);c.fill();c.stroke();
    lbl(c,m[1],x,k==1?y0-14:y0+22,k==0?'left':'center',on?'rgba(255,255,255,.85)':'rgba(255,255,255,.35)')});
  var hx=x0+(x1-x0)*p,hy=curveY(p);glow(c,hx,hy,22,.6);c.fillStyle='#fff';c.beginPath();c.arc(hx,hy,3,0,7);c.fill();
  if(p>.85)lbl(c,'REVENUE',hx-8,hy-12,'right',A(SIG,Math.min(1,(p-.85)*8)))};


/* ---------------- v22: Selected work visuals ---------------- */
/* always-on: a live stream of daily media pulses (three channels) and the visit line they lift */
V['wk-ent']=function(c,w,h,t){var top=64,bot=h-104,H=bot-top,n=48,dx=w/(n-4),sh=(t*18)%dx,i,x,v,pts=[];
  function f(k){return .4+.22*Math.sin(k*.19)+.12*Math.sin(k*.41+1)+.05*Math.sin(k*1.3)}
  var k0=Math.floor(t*18/dx);
  c.strokeStyle='rgba(255,255,255,.06)';c.lineWidth=1;for(i=0;i<4;i++){c.beginPath();c.moveTo(0,top+H*i/3);c.lineTo(w,top+H*i/3);c.stroke()}
  for(i=0;i<n;i++){x=i*dx-sh;var k=i+k0;var m=.2+.5*Math.abs(Math.sin(k*1.31)),tt=.15+.35*Math.abs(Math.sin(k*.77)),g=.1+.3*Math.abs(Math.sin(k*2.03));
    var y=bot,sc=H*.42;[[m,.95],[tt,.55],[g,.3]].forEach(function(q){var hh=q[0]*sc*.5;c.fillStyle=A(SIG,q[1]*.55);c.fillRect(x+1,y-hh,dx-3,hh);y-=hh+1});
    v=f(k)+.004*k%1*0;pts.push([x+dx/2,top+H*(1-Math.min(.95,.25+v*.7))])}
  c.beginPath();pts.forEach(function(p,j){j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])});c.strokeStyle='#fff';c.lineWidth=1.6;c.stroke();
  var last=pts[pts.length-6];glow(c,last[0],last[1],20,.5);c.fillStyle=SIG;c.beginPath();c.arc(last[0],last[1],3.5,0,7);c.fill();
  if(w>=420){lbl(c,'META',w-150,h-28,'left',A(SIG,.95));lbl(c,'TIKTOK',w-108,h-28,'left',A(SIG,.6));lbl(c,'GOOGLE',w-56,h-28,'left',A(SIG,.4))}
  lbl(c,'VISITS',last[0]-8,last[1]-12,'right','rgba(255,255,255,.75)')};
/* compounding: each period's learning lifts the next, bars build and a trend curve compounds */
V['wk-mob']=function(c,w,h,t){var top=70,bot=h-104,H=bot-top,n=14,x0=w*.28,bw=(w*.68)/n,cyc=(t*2.4)%(n+8),i;
  for(i=0;i<n;i++){var on=Math.min(1,Math.max(0,cyc-i)),v=.12+.82*Math.pow(i/(n-1),1.8),hh=H*v*e(on,1,0);
    var g=c.createLinearGradient(0,bot-hh,0,bot);g.addColorStop(0,A(SIG,i==n-1?1:.75));g.addColorStop(1,A(SIG,.08));c.fillStyle=i==n-1?g:'rgba(255,255,255,'+(.08+.25*i/n)+')';if(i>=n-3)c.fillStyle=g;
    c.beginPath();c.roundRect?c.roundRect(x0+i*bw+2,bot-hh,bw-4,hh,[3,3,0,0]):c.rect(x0+i*bw+2,bot-hh,bw-4,hh);c.fill();
    if(on>0&&on<1&&i){var px=x0+(i-1)*bw+bw/2,py=bot-H*(.12+.82*Math.pow((i-1)/(n-1),1.8));c.strokeStyle=A(SIG,.8*(1-on));c.setLineDash([2,3]);c.beginPath();c.moveTo(px,py-6);c.quadraticCurveTo(px+bw*.5,py-30,x0+i*bw+bw/2,bot-hh-6);c.stroke();c.setLineDash([])}}
  c.beginPath();for(i=0;i<=Math.min(cyc,n-1)*10;i++){var u=i/10,xx=x0+u*bw+bw/2,yy=bot-H*(.12+.82*Math.pow(u/(n-1),1.8))-10;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.strokeStyle='#fff';c.lineWidth=1.4;c.stroke();
  c.strokeStyle='rgba(255,255,255,.12)';c.beginPath();c.moveTo(x0,bot+.5);c.lineTo(w-10,bot+.5);c.stroke();
  if(w>=420)lbl(c,'COMPOUNDING DEMAND',w-14,h-28,'right',A(SIG,.9))};
/* KOC programme: creator nodes orbit three brand hubs, with content pulses flowing in */
V['wk-koc']=function(c,w,h,t){var cy=(64+h-104)/2+10,hubs=[[w*.34,cy+20],[w*.6,cy-30],[w*.82,cy+26]],i,j,R=Math.min(w,h)*.16;
  hubs.forEach(function(hb,k){for(i=0;i<14;i++){var a=i/14*6.283+t*(.15+k*.05)*(k%2?-1:1),rr=R*(.75+.35*Math.sin(i*3.7+k)),x=hb[0]+Math.cos(a)*rr,y=hb[1]+Math.sin(a)*rr*.7;
      c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(hb[0],hb[1]);c.stroke();
      var p=(t*.5+i*.13+k*.3)%1;if(i%3==0){c.fillStyle=A(SIG,.9*(1-p));c.beginPath();c.arc(x+(hb[0]-x)*p,y+(hb[1]-y)*p,1.6,0,7);c.fill()}
      c.fillStyle='rgba(255,255,255,'+(.35+.3*Math.sin(t*2+i))+')';c.beginPath();c.arc(x,y,2.2,0,7);c.fill()}});
  c.strokeStyle=A(SIG,.25);c.setLineDash([3,5]);c.lineDashOffset=-t*10;c.beginPath();c.moveTo(hubs[0][0],hubs[0][1]);c.lineTo(hubs[1][0],hubs[1][1]);c.lineTo(hubs[2][0],hubs[2][1]);c.stroke();c.setLineDash([]);
  hubs.forEach(function(hb,k){glow(c,hb[0],hb[1],34,.45+.1*Math.sin(t*2+k));c.fillStyle='#0B0B0B';c.beginPath();c.arc(hb[0],hb[1],9,0,7);c.fill();c.strokeStyle=SIG;c.lineWidth=1.5;c.stroke();c.fillStyle=SIG;c.beginPath();c.arc(hb[0],hb[1],3,0,7);c.fill()});
  if(w>=420)lbl(c,'ONE PLAYBOOK',w-14,h-28,'right',A(SIG,.9))};

function mountVz(){[].forEach.call(document.querySelectorAll('canvas.vz'),function(cv){var k=cv.getAttribute('data-k'),ctx=cv.getContext('2d'),t0=0,vis=false,w=0,h=0,dpr=1;
  function size(){dpr=Math.min(2,window.devicePixelRatio||1);w=cv.clientWidth;h=cv.clientHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  if(window.ResizeObserver)new ResizeObserver(size).observe(cv);size();
  new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis&&!t0)t0=performance.now();vis=v},{threshold:.15}).observe(cv);
  (function loop(now){requestAnimationFrame(loop);if(!vis||!w||!V[k])return;var t=RM?30:(now-t0)/1000;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.save();try{V[k](ctx,w,h,t)}catch(err){console.error(err)}ctx.restore()})(performance.now())})}

/* ---------------- INTERACTIVE MODELS: a fifth argument carries the value set by the viewer ---------------- */
function Phi(z){var k=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*k*(.3193815+k*(-.3565638+k*(1.781478+k*(-1.821256+k*1.330274))));return z>0?1-p:p}
V['q-marginal']=function(c,w,h,t,a){if(a==null)a=.2;var B=box(w,h,{t:44,b:46,l:34,r:28}),k=.32,f=function(s){return 1-Math.exp(-s/k)},ss=k*Math.log(1/k),X=function(s){return B.l+B.w*s},Y=function(v){return B.b-B.h*v*.92},i,s;
  grid(c,B,4);var p=e(t,1.4,.1),pts=[];for(i=0;i<=80;i++){s=i/80;pts.push([X(s),Y(f(s))])}
  c.save();c.beginPath();c.rect(B.l,0,B.w*p,h);c.clip();
  c.beginPath();c.moveTo(X(0),B.b);for(i=0;i<=80;i++){s=i/80;if(s>ss)break;c.lineTo(X(s),Y(f(s)))}c.lineTo(X(ss),Y(f(ss)));c.lineTo(X(ss),B.b);c.closePath();c.fillStyle=A(SIG,.15);c.fill();
  c.beginPath();c.moveTo(X(ss),B.b);for(s=ss;s<=1.0001;s+=1/80)c.lineTo(X(s),Y(f(s)));c.lineTo(X(1),B.b);c.closePath();c.fillStyle='rgba(255,255,255,.035)';c.fill();c.restore();
  line(c,pts,W,2,p);var q=e(t,.6,1.5);c.globalAlpha=q;vl(c,X(ss),B.t-8,B.b,SIG,[3,3]);cap(c,'Stop point',X(ss)+10,B.t+2,{c:W});
  cap(c,'Efficient',X(ss/2),B.b-12,{a:'center',c:SIG});cap(c,'Diminishing',X((1+ss)/2),B.b-12,{a:'center'});c.globalAlpha=1;
  if(p>.9){var m=Math.exp(-a/k)/k,x=X(a),y=Y(f(a)),ok=m>=1,col=ok?SIG:'#BDBDBD',rt=x>B.l+B.w*.55,lx=rt?x-16:x+16,al=rt?'right':'left';
    vl(c,x,y,B.b,col,[2,3]);ring(c,x,y,11,ok?A(SIG,.45):'rgba(255,255,255,.25)',1.5);dot(c,x,y,5.5,col);
    var y1=y-30<B.t+16?y+28:y-30;tx(c,'Next unit returns '+m.toFixed(2)+'×',lx,y1,{a:al,s:14,c:W,w:500});tx(c,ok?'Keep spending here':'Move budget to another channel',lx,y1+18,{a:al,s:12,c:ok?SIG:T})}
  cap(c,'Spend →',B.r,B.b+24,{a:'right'});cap(c,'Revenue',B.l,B.t-24)};
V['q-marginal'].adj={label:'Spend level',min:0,max:1,val:.2,auto:function(t){return .5+.42*Math.sin(t*.45-1.4)},fmt:function(v){return Math.round(v*100)+'% of max'}};

V['i-audit']=function(c,w,h,t,r){if(r==null)r=0;var B=box(w,h,{t:44,b:70,l:24,r:24});grid(c,B,4);var sm=w<560,L=[[sm?'Wasted':'Non-converting audiences',18],[sm?'Duplicate':'Duplicate reach',9],[sm?'Untracked':'Untracked sales',7]];
  var d=[[sm?'Spend':'Media spend',100]];L.forEach(function(l){d.push([l[0],-l[1]*(1-r)])});d.push([sm?'Productive':'Productive spend',100-34*(1-r)]);
  var n=d.length,g=B.w/n,bw=Math.min(g*.52,72),run=100,Y=function(v){return B.b-B.h*v/100};
  d.forEach(function(q,i){var p=e(t,.8,.2+i*.45),x=B.l+g*i+(g-bw)/2,tot=(i==0||i==n-1),top,bot;
    if(tot){top=Y(q[1]);bot=B.b}else{top=Y(run);bot=Y(run+q[1]);run+=q[1]}
    var col=i==n-1?SIG:tot?'#8A8A8A':'#454545';if(tot)bar(c,x,bot,bw,(bot-top)*p,col);else if(p>0&&bot-top>.5){c.fillStyle=col;rr(c,x,top,bw,(bot-top)*p,2);c.fill()}
    if(i<n-1){var qq=e(t,.4,1+i*.45),yy=tot?top:bot;if(qq>0){c.save();c.setLineDash([3,3]);c.strokeStyle=M;c.beginPath();c.moveTo(x+bw,yy);c.lineTo(x+bw+(g-bw)*qq,yy);c.stroke();c.restore()}}
    c.globalAlpha=p;var v=Math.round(Math.abs(q[1]));tx(c,(q[1]<-.4?'−':'')+v+'%',x+bw/2,tot?top-10:Math.max(bot,top)+16,{a:'center',s:13,c:i==n-1?W:T,w:i==n-1?500:400});
    wrap(c,q[0],x+bw/2,B.b+22,g-6,14,{a:'center',s:11,c:i==n-1?W:T});c.globalAlpha=1});
  if(r>.01)cap(c,'+'+Math.round(34*r)+' points of spend put back to work',B.r,B.t-22,{a:'right',c:SIG})};
V['i-audit'].adj={label:'Leakage fixed',min:0,max:1,val:0,auto:function(t){return t<3.2?0:.5-.5*Math.cos((t-3.2)*.55)},fmt:function(v){return Math.round(v*100)+'%'}};

V['i-growth']=function(c,w,h,t,a){if(a==null)a=.065;var B=box(w,h,{t:36,b:44,l:28,r:104});grid(c,B,4);
  var hist=[40,44,43,49,52,55,58,63],N=12,last=63,up=[],ba=[],dn=[],i;
  for(i=1;i<=4;i++){up.push(last*Math.pow(1+a+.045,i));ba.push(last*Math.pow(1+a,i));dn.push(last*Math.pow(1+Math.max(-.03,a-.045),i))}
  var mx=last*Math.pow(1.165,4)*1.06,X=function(i){return B.l+B.w*i/(N-1)},Y=function(v){return B.b-B.h*v/mx};
  line(c,hist.map(function(v,i){return[X(i),Y(v)]}),W,2,e(t,1.4,.1));var xT=X(7);vl(c,xT,B.t,B.b,M,[2,4]);cap(c,'Today',xT,B.b+20,{a:'center'});
  var q=e(t,1.4,1.5);if(q>0){c.save();c.beginPath();c.rect(xT,0,(B.r-xT)*q+2,h);c.clip();
    c.beginPath();c.moveTo(xT,Y(last));up.forEach(function(v,i){c.lineTo(X(8+i),Y(v))});for(i=3;i>=0;i--)c.lineTo(X(8+i),Y(dn[i]));c.closePath();c.fillStyle=A(SIG,.14);c.fill();
    [[up,'#5A5A5A',1],[dn,'#5A5A5A',1],[ba,SIG,2.2]].forEach(function(s){line(c,[[xT,Y(last)]].concat(s[0].map(function(v,i){return[X(8+i),Y(v)]})),s[1],s[2])});c.restore()}
  c.globalAlpha=e(t,.5,2.9);tx(c,'Upside',B.r+10,Y(up[3]),{b:'middle',s:11});tx(c,'Base +'+Math.round((Math.pow(1+a,4)-1)*100)+'%',B.r+10,Y(ba[3]),{b:'middle',s:12,c:W,w:500});tx(c,'Downside',B.r+10,Y(dn[3]),{b:'middle',s:11});c.globalAlpha=1;
  dot(c,xT,Y(last),4,W);cap(c,'Past 8 quarters',B.l,B.b+20);cap(c,'Next 4',B.r,B.b+20,{a:'right'})};
V['i-growth'].adj={label:'Growth per quarter',min:.01,max:.12,val:.065,fmt:function(v){return (v*100).toFixed(1)+'%'}};

V['z-monte']=function(c,w,h,t,vol){if(vol==null)vol=1;var B=box(w,h,{t:40,b:40,l:24,r:70}),N=48,S=24,paths=[],i,k,hist=[40,42,41,45,47,46,50,52],x0=.3,TG=78;
  for(i=0;i<N;i++){var r=R(100+i),v=52,a=[52];for(k=1;k<=S;k++){v+=.75+(r()+r()+r()-1.5)*4.6*vol;a.push(v)}paths.push(a)}
  var X=function(k){return B.l+B.w*(x0+(1-x0)*k/S)},XH=function(k){return B.l+B.w*x0*k/7},Y=function(v){return B.b-B.h*(v-15)/105};grid(c,B,4);
  c.save();c.beginPath();c.rect(B.l,B.t-30,B.w,B.h+30);c.clip();
  line(c,hist.map(function(v,k){return[XH(k),Y(v)]}),W,2,e(t,.8,.1));vl(c,X(0),B.t,B.b,M,[2,4]);
  paths.forEach(function(a,i){var p=e(t,1.2,.8+i*.03);if(p>0)line(c,a.map(function(v,k){return[X(k),Y(v)]}),'rgba(255,255,255,.13)',1,p)});
  var q=e(t,1,2.6),hit=paths.filter(function(a){return a[S]>=TG}).length/N;
  if(q>0){var lo=[],md=[],hi=[];for(k=0;k<=S;k++){var col=paths.map(function(a){return a[k]}).sort(function(a,b){return a-b});lo.push(col[4]);md.push(col[24]);hi.push(col[43])}
    c.save();c.beginPath();c.rect(X(0),0,(B.r-X(0))*q+1,h);c.clip();c.beginPath();for(k=0;k<=S;k++)c[k?'lineTo':'moveTo'](X(k),Y(hi[k]));for(k=S;k>=0;k--)c.lineTo(X(k),Y(lo[k]));c.closePath();c.fillStyle=A(SIG,.16);c.fill();
    line(c,md.map(function(v,k){return[X(k),Y(v)]}),SIG,2.4);c.restore()}
  c.save();c.setLineDash([5,4]);hl(c,X(0),B.r,Y(TG),'rgba(255,255,255,.4)');c.restore();c.restore();
  cap(c,'Target',B.r+10,Y(TG)+4,{c:W});cap(c,'Today',X(0),B.b+20,{a:'center'});
  /* readout: the percentage follows the measured caption, and the caption shortens if the canvas is too narrow */
  c.globalAlpha=e(t,.4,3.4);var pct=Math.round(hit*100)+'%',cl='Chance of reaching target';font(c,{s:18,w:500});var pw=c.measureText(pct).width;
  if(B.l+capW(c,cl)+12+pw>w-12)cl='Chance of target';cap(c,cl,B.l,B.t-20);tx(c,pct,B.l+capW(c,cl)+12,B.t-16,{s:18,c:SIG,w:500});c.globalAlpha=1};
V['z-monte'].adj={label:'Market volatility',min:.4,max:2,val:1,fmt:function(v){return v.toFixed(1)+'× normal'}};

V['z-bayes']=function(c,w,h,t,n){if(n==null)n=1000;var B=box(w,h,{t:86,b:46,l:28,r:28}),sd=.09*Math.sqrt(1000/n),mA=.44,mB=.56,hg=.95*Math.sqrt(.0367/sd),X=function(x){return B.l+B.w*x},p=e(t,1.2,.2),p2=e(t,1.2,.9),i;
  var g=function(x,m){return Math.exp(-Math.pow(x-m,2)/(2*sd*sd))};hl(c,B.l,B.r,B.b,'#3A3A3A');
  function curve(m,col,fill,pp){if(pp<=0)return;var pts=[];for(i=0;i<=160;i++)pts.push([X(i/160),B.b-B.h*hg*g(i/160,m)*pp]);c.beginPath();c.moveTo(X(0),B.b);pts.forEach(function(q){c.lineTo(q[0],q[1])});c.lineTo(X(1),B.b);c.closePath();c.fillStyle=fill;c.fill();line(c,pts,col,2)}
  curve(mA,'#8A8A8A','rgba(255,255,255,.06)',p);curve(mB,SIG,A(SIG,.18),p2);
  /* keep the two variant labels apart when the peaks sit close together on narrow screens */
  var lA=X(mA),lB=X(mB),ly=B.b-B.h*hg-12,aA='center',aB='center';font(c,{s:12});var wA=c.measureText('Variant A').width;font(c,{s:12,w:500});var wB=c.measureText('Variant B').width;
  if(lB-lA<(wA+wB)/2+12){var mid=(lA+lB)/2;lA=mid-6;lB=mid+6;aA='right';aB='left'}
  c.globalAlpha=p;tx(c,'Variant A',lA,ly,{a:aA,s:12});c.globalAlpha=p2;tx(c,'Variant B',lB,ly,{a:aB,s:12,c:W,w:500});c.globalAlpha=1;
  var pr=Phi((mB-mA)/(sd*Math.SQRT2)),q=e(t,1.4,1.8),ship=pr>=.95;cap(c,'Probability B beats A',B.l,34);tx(c,Math.round(pr*100*q)+'%',B.l,68,{s:30,w:300,c:W});
  c.globalAlpha=e(t,.4,3);cap(c,ship?'Decision: ship B':'Decision: keep testing',B.r,62,{a:'right',c:ship?SIG:T});c.globalAlpha=1;
  cap(c,'Conversion rate →',B.r,B.b+24,{a:'right'});cap(c,'Plausibility',B.l,B.b+24)};
V['z-bayes'].adj={label:'Visitors per variant',min:200,max:6000,val:1000,fmt:function(v){return (Math.round(v/50)*50).toLocaleString('en')}};

V['z-ltv']=function(c,w,h,t,cac){if(cac==null)cac=46;var B=box(w,h,{t:44,b:44,l:28,r:28}),f=function(m){return 100*(1-Math.exp(-m/7))},X=function(m){return B.l+B.w*m/18},Y=function(v){return B.b-B.h*v/100},pb=-7*Math.log(1-cac/100),p=e(t,1.8,.1),pts=[],m;
  grid(c,B,4);for(m=0;m<=18.001;m+=.25)pts.push([X(m),Y(f(m))]);
  if(pb<18){c.save();c.beginPath();c.rect(B.l,0,B.w*p,h);c.clip();c.beginPath();c.moveTo(X(pb),Y(cac));for(m=pb;m<=18.001;m+=.25)c.lineTo(X(m),Y(f(m)));c.lineTo(X(18),Y(cac));c.closePath();c.fillStyle=A(SIG,.16);c.fill();c.restore()}
  c.save();c.setLineDash([5,4]);hl(c,B.l,B.r,Y(cac),'#9A9A9A');c.restore();cap(c,'Acquisition cost',B.l+4,Y(cac)-8);line(c,pts,W,2,p);
  var q=e(t,.5,1.5);c.globalAlpha=q;if(pb<18){vl(c,X(pb),Y(cac),B.b,SIG,[3,3]);dot(c,X(pb),Y(cac),5,SIG);cap(c,'Payback: month '+Math.max(1,Math.round(pb)),X(pb)+10,B.b-10,{c:W})}
  if(18-pb>3)cap(c,'Profit per customer',X((pb+18)/2+1),Y((cac+f((pb+18)/2+1))/2)+4,{a:'center',c:SIG});c.globalAlpha=1;
  cap(c,'Cumulative margin per customer',B.l,B.t-20);cap(c,'Months since acquisition →',B.r,B.b+24,{a:'right'})};
V['z-ltv'].adj={label:'Acquisition cost',min:20,max:80,val:46,fmt:function(v){return Math.round(v)+'% of 18-month margin'}};

V['d-brand']=function(c,w,h,t,b){if(b==null)b=1;var cx=w*.28,cy=h/2,r=Math.min(w*.18,h*.3),p=e(t,1.8,.1),reach=1-Math.exp(-1.515*b),v=reach*p,lam=.9+2.6*b,i;
  var pm=[],acc=0,fct=1;for(i=1;i<=5;i++){fct*=i;var x=Math.pow(lam,i)*Math.exp(-lam)/fct;pm.push(x);acc+=x}pm.push(Math.max(0,1-Math.exp(-lam)-acc));var Z=1-Math.exp(-lam);pm=pm.map(function(x){return x/Z});
  c.lineWidth=10;c.strokeStyle='#202020';c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.strokeStyle=SIG;c.lineCap='round';if(v>0){c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*v);c.stroke()}c.lineCap='butt';c.lineWidth=1;
  tx(c,Math.round(v*100)+'%',cx,cy+4,{a:'center',b:'middle',s:Math.round(r*.44),w:300,c:W});cap(c,'Reach',cx,cy+r*.44,{a:'center'});
  var B={l:w*.56,r:w-24,t:h*.24,b:h*.72};B.w=B.r-B.l;B.h=B.b-B.t;var g=B.w/6,bw=g*.6;cap(c,'Frequency distribution',B.l,B.t-18);
  pm.forEach(function(x,i){bar(c,B.l+g*i+(g-bw)/2,B.b,bw,B.h*Math.min(1,x/.42)*e(t,.6,.6+i*.1),(i>=2&&i<=4)?SIG:'#4A4A4A');tx(c,i==5?'6+':''+(i+1),B.l+g*i+g/2,B.b+18,{a:'center',s:11})});
  var eff=(pm[2]+pm[3]+pm[4])*reach;c.globalAlpha=e(t,.4,1.6);cap(c,'Effective reach, 3 to 5 exposures',B.l,B.b+42,{c:W});tx(c,Math.round(eff*100)+'%',B.l,B.b+66,{s:18,c:SIG,w:500});c.globalAlpha=1};
V['d-brand'].adj={label:'Budget',min:.2,max:1.6,val:1,fmt:function(v){return Math.round(v*100)+'% of plan'}};

/* ---------------- EXPLORER ---------------- */
function init(el){var items=[].slice.call(el.querySelectorAll('.svx-item')),cv=el.querySelector('canvas'),ctx=cv.getContext('2d'),file=el.querySelector('.svx-file'),capn=el.querySelector('.svx-cap'),bot=el.querySelector('.svx-bot');
  var DUR=+(el.getAttribute('data-dur')||7),idx=0,t0=performance.now(),hover=false,stopped=false,pt=0,vis=false,w=0,h=0,dpr=1,last=performance.now(),solo=el.classList.contains('solo'),user=null,drag=false;
  var ctl=bot.lastElementChild;ctl.className='svx-ctl';ctl.innerHTML='';
  var adj=document.createElement('div');adj.className='svx-adj';adj.innerHTML='<span class="sa-l"></span><input type="range" min="0" max="1" step="0.001"><b class="sa-v"></b><button type="button" class="sa-r">Auto</button>';bot.parentNode.insertBefore(adj,bot);
  var rng=adj.querySelector('input'),sal=adj.querySelector('.sa-l'),sav=adj.querySelector('.sa-v'),auto=adj.querySelector('.sa-r');
  function F(){return V[items[idx].getAttribute('data-k')]}
  function cfg(){var f=F();return f&&f.adj}
  function playBtn(){var b=ctl.querySelector('.sc-play');if(!b)return;b.textContent=stopped?'▶':'❚❚';b.setAttribute('aria-label',stopped?'Play':'Pause')}
  function stop(){stopped=true;playBtn()}
  function set(i){idx=(i+items.length)%items.length;t0=performance.now();pt=0;user=null;
    items.forEach(function(b,j){b.classList.toggle('on',j==idx);b.setAttribute('aria-selected',j==idx?'true':'false');b.querySelector('.bar').style.width='0'});
    if(file)file.textContent=items[idx].getAttribute('data-file');if(capn)capn.textContent=items[idx].getAttribute('data-cap');
    var n=ctl.querySelector('.sc-n');if(n)n.textContent=(idx+1)+' / '+items.length;var a=cfg();adj.classList.toggle('on',!!a);cv.classList.toggle('adj',!!a);
    if(a){sal.textContent=a.label;auto.style.display=a.auto?'':'none';rng.setAttribute('aria-label',a.label)}}
  var SM=!solo&&items.length>1&&window.matchMedia&&matchMedia('(min-width: 901px)').matches,sp=null,step=0,topOff=90;
  function layout(){if(!SM)return;var vh=window.innerHeight;step=Math.max(320,vh*.5);topOff=Math.max(84,Math.round((vh-el.offsetHeight)/2));el.style.top=topOff+'px';sp.style.height=(el.offsetHeight+(items.length-1)*step)+'px'}
  function onSc(){if(!SM)return;var r=sp.getBoundingClientRect(),d=topOff-r.top,f=d/step,i=Math.max(0,Math.min(items.length-1,Math.floor(f)));if(i!==idx)set(i);items[idx].querySelector('.bar').style.width=(i==items.length-1&&f>=items.length-1?100:Math.max(0,Math.min(1,f-i))*100)+'%'}
  if(SM){sp=document.createElement('div');sp.className='svx-sp';el.parentNode.insertBefore(sp,el);sp.appendChild(el);el.classList.add('svx-sticky');layout();window.addEventListener('resize',function(){layout();onSc()});window.addEventListener('scroll',onSc,{passive:true})}
  function goTo(i){if(!SM){set(i);stop();return}var y=window.scrollY+sp.getBoundingClientRect().top-topOff+i*step+2;window.scrollTo({top:y,behavior:'smooth'})}
  items.forEach(function(b,i){b.addEventListener('click',function(){goTo(i)})});
  ctl.addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;
    if(b.classList.contains('sc-prev')){set(idx-1);stop()}else if(b.classList.contains('sc-next')){set(idx+1);stop()}
    else if(b.classList.contains('sc-play')){stopped=!stopped;playBtn()}else if(b.classList.contains('sc-re')){set(idx)}});
  auto.addEventListener('click',function(){user=null});
  rng.addEventListener('input',function(){user=+rng.value;stop()});
  function fromX(ev){var b=cv.getBoundingClientRect();user=Math.max(0,Math.min(1,(ev.clientX-b.left-24)/(b.width-48)));stop()}
  cv.addEventListener('pointerdown',function(ev){if(!cfg())return;drag=true;try{cv.setPointerCapture(ev.pointerId)}catch(_){}fromX(ev)});
  cv.addEventListener('pointermove',function(ev){if(drag)fromX(ev)});
  cv.addEventListener('pointerup',function(){drag=false});cv.addEventListener('pointercancel',function(){drag=false});
  el.addEventListener('keydown',function(ev){if(ev.target===rng)return;if(ev.key=='ArrowRight'&&!solo){set(idx+1);stop();ev.preventDefault()}else if(ev.key=='ArrowLeft'&&!solo){set(idx-1);stop();ev.preventDefault()}});
  el.addEventListener('mouseenter',function(){hover=true});el.addEventListener('mouseleave',function(){hover=false});
  function size(){dpr=Math.min(2,window.devicePixelRatio||1);w=cv.clientWidth;h=cv.clientHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  if(window.ResizeObserver)new ResizeObserver(size).observe(cv);else window.addEventListener('resize',size);size();
  new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis){t0=performance.now()}vis=v},{threshold:.2}).observe(el);
  function loop(now){requestAnimationFrame(loop);var dt=Math.min(.1,(now-last)/1000);last=now;if(!vis||!w)return;
    if(!SM){if(!hover&&!stopped&&!RM&&!solo&&items.length>1)pt+=dt;items[idx].querySelector('.bar').style.width=Math.min(100,pt/DUR*100)+'%';if(pt>=DUR)set(idx+1)}
    var t=RM?30:(now-t0)/1000,a=cfg(),val=null;
    if(a){var u=user!=null?user:(a.auto&&!RM?a.auto(t):(a.val-a.min)/(a.max-a.min));if(!drag&&document.activeElement!==rng)rng.value=u;val=a.min+(a.max-a.min)*u;sav.textContent=a.fmt(val)}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);var f=F();if(f){ctx.save();try{f(ctx,w,h,t,val)}catch(err){console.error(err)}ctx.restore()}}
  el._pick=function(i){goTo(i)};set(0);playBtn();if(SM){onSc()}requestAnimationFrame(loop)}
function deep(){var hs=decodeURIComponent(location.hash.slice(1));if(hs.indexOf('m-')!==0)return;var it=document.querySelector('.svx-item[data-k="'+hs.slice(2)+'"]');if(!it)return;var box2=it.closest('.svx');box2._pick([].indexOf.call(box2.querySelectorAll('.svx-item'),it));box2.scrollIntoView({block:'center'})}
function unroll(){if(!(window.matchMedia&&matchMedia('(max-width: 900px)').matches))return;[].forEach.call(document.querySelectorAll('.svx:not(.solo)'),function(el){var its=el.querySelectorAll('.svx-item');if(its.length<2)return;var box=document.createElement('div');box.className='svx-stack';
  [].forEach.call(its,function(it){var s=document.createElement('div');s.className='svx solo unrolled reveal in';s.setAttribute('data-dur','9');var c=it.cloneNode(true);c.classList.add('on');c.removeAttribute('role');s.innerHTML='<div class="svx-stage"><div class="svx-top"><span class="svx-file"></span><span class="lv"><i></i>Exhibit</span></div><canvas aria-hidden="true"></canvas><div class="svx-bot"><span class="svx-cap"></span><span class="svx-ctl"></span></div></div><div class="svx-list"></div>';s.querySelector('.svx-list').appendChild(c);box.appendChild(s)});
  el.parentNode.replaceChild(box,el)})}
function boot(){unroll();[].forEach.call(document.querySelectorAll('.svx'),init);logos();sim();mountVz();deep();window.addEventListener('hashchange',deep)}
if(document.readyState!='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
window.BespokeViz=V;
})();

/* Bespoke exhibits and tools for articles.
   Charts:  <figure class="xb" data-x='{"t":"hbar",...}'></figure>
   Tools:   <div class="xt" data-tool="roi"></div>
   No dependencies. Charts animate in when scrolled into view. */
(function(){
var NS='http://www.w3.org/2000/svg';
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function txt(p,x,y,s,cls,anchor){var t=el('text',{x:x,y:y,'class':cls||'xt-l','text-anchor':anchor||'start'},p);t.textContent=s;return t}
function fmt(v,d){if(d==null)d=0;return Number(v).toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d})}
function head(f,o){var h=document.createElement('figcaption');h.className='xb-h';h.innerHTML='<span class="xb-n">'+(o.n||'Exhibit')+'</span><span class="xb-t">'+o.title+'</span>';f.appendChild(h)}
function foot(f,o){if(!o.src)return;var s=document.createElement('p');s.className='xb-src';s.textContent='Source: '+o.src;f.appendChild(s)}

var R={};function cw(f){var w=f.clientWidth||640;return Math.max(330,Math.min(640,w))}
R.hbar=function(f,o){var W=cw(f),rh=40,H=o.rows.length*rh+10,mx=o.max||Math.max.apply(0,o.rows.map(function(r){return r[1]})),lw=Math.min(o.lw||190,W*.42);
  var s=el('svg',{viewBox:'0 0 '+W+' '+H,'class':'xb-svg',role:'img','aria-label':o.title},f);
  o.rows.forEach(function(r,i){var y=i*rh+6,w=(W-lw-90)*r[1]/mx;txt(s,lw-14,y+20,r[0],'xt-l','end');
    el('rect',{x:lw,y:y+6,width:W-lw-90,height:20,rx:4,'class':'xb-track'},s);
    var b=el('rect',{x:lw,y:y+6,width:w,height:20,rx:4,'class':r[2]?'xb-sig':'xb-ctx','data-w':w},s);b.style.setProperty('--w',w);
    txt(s,lw+w+10,y+21,(o.pre||'')+fmt(r[1],o.d)+(o.unit||''),'xt-v'+(r[2]?' sig':''))});};
/* measure label text so bar-chart axis labels can wrap inside their column on narrow screens */
var MC;function mtw(s,px){MC=MC||document.createElement('canvas').getContext('2d');MC.font='400 '+px+'px "Be Vietnam Pro",sans-serif';return MC.measureText(s).width}
function wrapL(s,max,px){var out=[],cur='';s.split(' ').forEach(function(w){var n=cur?cur+' '+w:w;if(mtw(n,px)>max&&cur){out.push(cur);cur=w}else cur=n});if(cur)out.push(cur);return out}
R.bar=function(f,o){var W=cw(f),pt=24,n=o.rows.length,gw=(W-40)/n,mx=o.max||Math.max.apply(0,o.rows.map(function(r){return r[1]}));
  var sm=o.rows.some(function(r){return wrapL(r[0],gw-6,12.5).some(function(l){return mtw(l,12.5)>gw-2})}),px=sm?10.5:12.5,lh=sm?12:14,
      labs=o.rows.map(function(r){return mtw(r[0],px)<=gw-6?[r[0]]:wrapL(r[0],gw-6,px)}),nl=Math.max.apply(0,labs.map(function(l){return l.length})),pb=Math.max(40,24+nl*lh),H=220+pb;
  var s=el('svg',{viewBox:'0 0 '+W+' '+H,'class':'xb-svg',role:'img','aria-label':o.title},f);
  el('line',{x1:20,x2:W-20,y1:H-pb,y2:H-pb,'class':'xb-axis'},s);
  o.rows.forEach(function(r,i){var h=(H-pb-pt-20)*r[1]/mx,x=20+i*gw+gw*.2,bw=gw*.6;
    var b=el('rect',{x:x,y:H-pb-h,width:bw,height:h,rx:4,'class':r[2]?'xb-sig':'xb-ctx'},s);b.classList.add('xb-grow');
    txt(s,x+bw/2,H-pb-h-8,(o.pre||'')+fmt(r[1],o.d)+(o.unit||''),'xt-v'+(r[2]?' sig':''),'middle');
    labs[i].forEach(function(l,k){txt(s,x+bw/2,H-pb+20+k*lh,l,sm?'xt-l sm':'xt-l','middle')})});};
R.wf=function(f,o){var W=cw(f),H=280,pb=44,pt=24,items=[[o.start[0],o.start[1],'base']].concat(o.steps.map(function(x){return [x[0],x[1],'step']}));var end=o.start[1];o.steps.forEach(function(x){end+=x[1]});items.push([o.end,end,'base']);
  var n=items.length,gw=(W-40)/n,mx=o.start[1],sc=function(v){return (H-pb-pt)*v/mx};
  var s=el('svg',{viewBox:'0 0 '+W+' '+H,'class':'xb-svg',role:'img','aria-label':o.title},f);el('line',{x1:20,x2:W-20,y1:H-pb,y2:H-pb,'class':'xb-axis'},s);
  var run=o.start[1];items.forEach(function(it,i){var x=20+i*gw+gw*.18,bw=gw*.64,y,h,cls;
    if(it[2]=='base'){h=sc(it[1]);y=H-pb-h;cls=i==0?'xb-ctx':'xb-sig'}else{h=sc(Math.abs(it[1]));y=H-pb-sc(run);run+=it[1];cls='xb-neg'}
    var b=el('rect',{x:x,y:y,width:bw,height:Math.max(1,h),rx:3,'class':cls},s);b.classList.add('xb-grow');
    txt(s,x+bw/2,y-8,(it[2]=='step'?'−':'')+fmt(Math.abs(it[1])),'xt-v'+(cls=='xb-sig'?' sig':''),'middle');
    var lb=W<500?it[0].replace(/\n/g,' ').split(' '):it[0].split('\n');lb.forEach(function(l,k){txt(s,x+bw/2,H-pb+18+k*13,l,'xt-l sm','middle')})});};
R.flow=function(f,o){var d=document.createElement('ol');d.className='xb-flow';o.steps.forEach(function(st,i){var li=document.createElement('li');li.innerHTML='<span>'+(st[2]||String(i+1).padStart(2,'0'))+'</span><b>'+st[0]+'</b>'+(st[1]?'<em>'+st[1]+'</em>':'');d.appendChild(li)});f.appendChild(d)};
R.layers=function(f,o){var d=document.createElement('div');d.className='xb-layers';o.rows.forEach(function(r,i){var x=document.createElement('div');x.style.setProperty('--i',i);x.className=r[2]?'on':'';x.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span><b>'+r[0]+'</b><em>'+r[1]+'</em>';d.appendChild(x)});f.appendChild(d)};
R.stats=function(f,o){var d=document.createElement('div');d.className='xb-stats';o.rows.forEach(function(r){var x=document.createElement('div');x.innerHTML='<b'+(r[2]?' class="sig"':'')+'>'+r[0]+'</b><span>'+r[1]+'</span>';d.appendChild(x)});f.appendChild(d)};
R.matrix=function(f,o){var t=document.createElement('table');t.className='xb-table';t.innerHTML='<thead><tr>'+o.cols.map(function(c){return '<th>'+c+'</th>'}).join('')+'</tr></thead><tbody>'+o.rows.map(function(r){return '<tr>'+r.map(function(c,i){return i==0?'<th>'+c+'</th>':'<td>'+c+'</td>'}).join('')+'</tr>'}).join('')+'</tbody>';var w=document.createElement('div');w.className='xb-tw';w.appendChild(t);f.appendChild(w)};

/* ---------------- tools ---------------- */
function field(k,l,v,u,st){return '<label class="xt-f"><span>'+l+'</span><span class="xt-in">'+(u&&u.pre?'<i>'+u.pre+'</i>':'')+'<input type="text" inputmode="decimal" data-k="'+k+'" value="'+fmt(v,st||0)+'">'+(u&&u.suf?'<i>'+u.suf+'</i>':'')+'</span></label>'}
function num(x){return +String(x).replace(/[^\d.\-]/g,'')||0}
function out(rows){return rows.map(function(r){return '<div class="xt-o'+(r[2]?' '+r[2]:'')+'"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'}).join('')}
var T={};
T.roi={title:'Trend hijacking ROI calculator',note:'Default values reproduce the worked example in this article. Replace them with your own.',
  f:[['rev','Revenue attributed',0,{pre:'USD '}],['cost','Total cost (content, time, tools, paid)',5000,{pre:'USD '}],['trad','Traditional media cost for the same reach',50000,{pre:'USD '}],['pr','PR equivalent value',25000,{pre:'USD '}],['inf','Influencer equivalent cost',30000,{pre:'USD '}]],
  c:function(v){var emv=v.trad+v.pr+v.inf,r1=v.cost?(v.rev-v.cost)/v.cost*100:0,r3=v.cost?(emv-v.cost)/v.cost*100:0;
    return out([['Direct revenue ROI',v.rev?fmt(r1)+'%':'Add revenue'],['Earned media value','USD '+fmt(emv)],['Cost avoidance ROI',fmt(r3)+'%','big']])}};
T.gagsc={title:'GA vs Search Console gap checker',note:'Default values are the October 2024 example in this article.',
  f:[['gsc','Search Console clicks',10000],['ga','GA4 organic sessions',8500]],
  c:function(v){var d=v.gsc?(v.gsc-v.ga)/v.gsc*100:0,b=d<0?['GA is higher than Search Console. Check other search engines and channel attribution.','warn']:d<=20?['Normal range (10 to 20%). Watch the trend, not the gap.','ok']:d<=30?['Check tracking: tag placement, JavaScript errors, consent and page speed.','warn']:['Serious. Audit implementation, bot traffic and server response now.','bad'];
    return out([['Discrepancy',fmt(d,1)+'%','big '+b[1]],['What it means',b[0]]])}};
T.cod={title:'NMV to net sales leakage check',note:'Example inputs. The 1.2x EBITDA rule of thumb is from this article.',
  f:[['nmv','Monthly NMV',10000000000,{pre:'VND '}],['net','Monthly net sales',9600000000,{pre:'VND '}],['codf','COD failure rate',4,{suf:'%'},1]],
  c:function(v){var g=v.nmv?(v.nmv-v.net)/v.nmv*100:0;return out([['NMV to net sales gap',fmt(g,1)+'%','big '+(g>3?'bad':'ok')],['Cash not yet collected','VND '+fmt(v.nmv-v.net)],['Estimated EBITDA impact of COD failure',fmt(v.codf*1.2,1)+'% of EBITDA'],['Status',g>3?'Above the 3% red line. Start with carrier consolidation and pre-delivery reminders.':'Within the 3% line.']])}};
T.otb={title:'Open-to-buy calculator',note:'OTB = planned sales + planned markdowns + planned end-of-month stock - beginning-of-month stock. Example inputs.',
  f:[['ps','Planned sales',2000000000,{pre:'VND '}],['md','Planned markdowns',200000000,{pre:'VND '}],['eom','Planned end-of-month stock',3000000000,{pre:'VND '}],['bom','Beginning-of-month stock',2600000000,{pre:'VND '}]],
  c:function(v){var o=v.ps+v.md+v.eom-v.bom;return out([['Open to buy','VND '+fmt(o),'big'],['As share of planned sales',v.ps?fmt(o/v.ps*100,0)+'%':'-']])}};
T.percap={title:'Revenue per guest model',note:'Example inputs. Move spend into premium experiences and memberships to see the effect without adding guests.',
  f:[['g','Annual guests',1000000],['adm','Admission per guest',250000,{pre:'VND '}],['fnb','F&B and retail per guest',90000,{pre:'VND '}],['pre','Premium experiences per guest',20000,{pre:'VND '}],['mem','Memberships per guest',10000,{pre:'VND '}]],
  c:function(v){var pc=v.adm+v.fnb+v.pre+v.mem,tot=pc*v.g,L=[['Admission',v.adm],['F&B and retail',v.fnb],['Premium',v.pre],['Memberships',v.mem]];
    return out([['Revenue per guest','VND '+fmt(pc),'big'],['Annual revenue','VND '+fmt(tot)]])+'<div class="xt-mix">'+L.map(function(l,i){var p=pc?l[1]/pc*100:0;return '<i style="flex:'+p.toFixed(2)+'" class="m'+i+'" title="'+l[0]+'"></i>'}).join('')+'</div><div class="xt-leg">'+L.map(function(l,i){return '<span class="m'+i+'">'+l[0]+' '+(pc?fmt(l[1]/pc*100):0)+'%</span>'}).join('')+'</div>'}};
T.ev={title:'EV cost-of-ownership snapshot',note:'Tax rates and the charging tariff are from this article. Price, distance, consumption and fuel price are example inputs; edit them.',
  f:[['p','Pre-tax vehicle price',600000000,{pre:'VND '}],['km','Distance per year',15000,{suf:' km'}],['kwh','EV consumption',15,{suf:' kWh/100 km'},1],['tar','Charging tariff',2204,{pre:'VND ',suf:'/kWh'}],['l','Petrol car consumption',7,{suf:' L/100 km'},1],['fp','Petrol price',20000,{pre:'VND ',suf:'/L'}]],
  c:function(v){var tax=v.p*(0.15-0.03),ev=v.km/100*v.kwh*v.tar,ice=v.km/100*v.l*v.fp;return out([['Special consumption tax saved (3% vs 15%)','VND '+fmt(tax)],['Energy cost per year, EV','VND '+fmt(ev)],['Fuel cost per year, petrol','VND '+fmt(ice)],['Running cost saved per year','VND '+fmt(ice-ev),'big']])}};
T.kpi={title:'Retail KPI stack health check',note:'Benchmarks are from this article. Enter your latest figures.',
  f:[['nmv','NMV as % of GMV',88,{suf:'%'}],['gm','Gross margin',52,{suf:'%'}],['st','Stock turn per year',5,{suf:'x'},1],['mer','Marketing efficiency ratio',28,{suf:'%'}],['rep','Repeat rate per year',30,{suf:'%'}],['cod','COD success rate',95,{suf:'%'},1],['sph','Sales per staff hour',2.2,{pre:'VND ',suf:' m'},1],['ccc','Cash conversion cycle',70,{suf:' days'}]],
  c:function(v){var C=[['NMV vs GMV',v.nmv>=85],['Gross margin',v.gm>=55],['Stock turn',v.st>=6],['MER',v.mer<=30],['Repeat rate',v.rep>=35],['COD success',v.cod>=96],['Sales per staff hour',v.sph>=2],['Cash conversion cycle',v.ccc<=60]],ok=C.filter(function(c){return c[1]}).length;
    return out([['On benchmark',ok+' of 8','big '+(ok>=6?'ok':ok>=4?'warn':'bad')]])+'<div class="xt-chips">'+C.map(function(c){return '<span class="'+(c[1]?'ok':'bad')+'">'+(c[1]?'✓ ':'✕ ')+c[0]+'</span>'}).join('')+'</div>'}};
T.glide={title:'Market rollout: cost against return',note:'Enter acquisition cost and return for your home market and a new market.',
  f:[['c1','Home market CPA',100,{pre:''}],['r1','Home market ROAS',3.5,{suf:'x'},1],['c2','New market CPA',112],['r2','New market ROAS',3.2,{suf:'x'},1]],
  c:function(v){var dc=v.c1?(v.c2-v.c1)/v.c1*100:0,dr=v.r1?(v.r2-v.r1)/v.r1*100:0;return out([['CPA change',(dc>0?'+':'')+fmt(dc,1)+'%'],['ROAS change',(dr>0?'+':'')+fmt(dr,1)+'%'],['Verdict',v.r2>=1?'Return holds above break-even. Scale with localisation.':'Below break-even. Fix localisation before scaling.','big '+(v.r2>=1?'ok':'bad')]])}};

function tool(box){var k=box.getAttribute('data-tool'),t=T[k];if(!t)return;
  box.innerHTML='<div class="xt-h"><span>Tool</span><b>'+t.title+'</b></div><div class="xt-g"><div class="xt-fs">'+t.f.map(function(x){return field(x[0],x[1],x[2],x[3],x[4])}).join('')+'</div><div class="xt-out"></div></div><p class="xt-note">'+t.note+'</p>';
  var o=box.querySelector('.xt-out');function run(){var v={};[].forEach.call(box.querySelectorAll('input'),function(i){v[i.getAttribute('data-k')]=num(i.value)});o.innerHTML=t.c(v)}
  [].forEach.call(box.querySelectorAll('input'),function(i){i.addEventListener('input',run);i.addEventListener('blur',function(){var st=(t.f.filter(function(x){return x[0]==i.getAttribute('data-k')})[0]||[])[4]||0;i.value=fmt(num(i.value),st)})});run()}

function chart(f){var o;try{o=JSON.parse(f.getAttribute('data-x'))}catch(e){return}head(f,o);var w=document.createElement('div');w.className='xb-body';f.appendChild(w);(R[o.t]||function(){})(w,o);foot(f,o)}
function boot(){[].forEach.call(document.querySelectorAll('figure.xb'),chart);[].forEach.call(document.querySelectorAll('.xt[data-tool]'),tool);
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.25}):null;
  [].forEach.call(document.querySelectorAll('figure.xb'),function(f){io?io.observe(f):f.classList.add('in')})}
if(document.readyState!='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();

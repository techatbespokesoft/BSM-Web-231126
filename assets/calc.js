/* Bespoke media benchmark calculator.
   Two sources, tagged per format:
   ACTUAL    = leisure and entertainment account managed by BSM, Ho Chi Minh City, Meta / TikTok / Google Ads, Aug to Oct 2026 (best month to latest month)
   RATE CARD = BSM committed planning rates, FMCG full-funnel plan, July 2026
   Unit costs are stored in VND (source data) and shown in USD at FX below, excluding VAT and the 10% foreign contractor tax. Edit CH / PRESETS / FX to update. */
(function(){
var CH=[
 {k:'meta',n:'Meta',sub:'Facebook, Instagram, Threads',f:[
   {n:'Traffic (link click)',w:.65,u:'CPR',ud:'per landing page visit',c:[3232,4461],src:'Actual',out:'visits',cpm:[115000,115000],cpmSrc:'Actual'},
   {n:'Awareness, reach and frequency',w:.28,u:'CPM',ud:'per 1,000 impressions',c:[21360,39000],src:'Actual + rate card',out:'impressions'},
   {n:'Engagement',w:.07,u:'CPE',ud:'per engagement',c:[211,414],src:'Actual',out:'engagements'}]},
 {k:'tiktok',n:'TikTok',sub:'In-feed, Spark Ads',f:[
   {n:'Reach and Spark Ads',w:.5,u:'CPM',ud:'per 1,000 impressions',c:[35000,35000],src:'Rate card',out:'impressions'},
   {n:'Video views',w:.5,u:'CPV',ud:'per video view',c:[30,88],src:'Actual',out:'views'}]},
 {k:'youtube',n:'YouTube',sub:'In-stream, in-feed, Bumper',f:[
   {n:'In-stream and in-feed video',w:.75,u:'CPV',ud:'per video view',c:[98,98],src:'Rate card',out:'views'},
   {n:'Bumper 6s',w:.25,u:'CPM',ud:'per 1,000 impressions',c:[45000,45000],src:'Rate card',out:'impressions'}]},
 {k:'search',n:'Google Search',sub:'Brand, category, competitor',f:[
   {n:'Search ads',w:1,u:'CPC',ud:'per click',c:[5078,20067],src:'Actual',out:'clicks',note:'Rate card $0.27'}]},
 {k:'display',n:'Google Display and Demand Gen',sub:'GDN, Performance Max, geo',f:[
   {n:'Display, Demand Gen, PMax',w:1,u:'CPM',ud:'per 1,000 impressions',c:[24000,30600],src:'Rate card',out:'impressions'}]},
 {k:'retail',n:'Retail media',sub:'Shopee, Lazada, TikTok Shop',f:[
   {n:'Marketplace search and product ads',w:1,u:'CPC',ud:'per click',c:[1980,1980],src:'Rate card',out:'clicks'}]}];
var PRESETS=[
 {n:'Leisure and F&B',s:{meta:.7,tiktok:.2,search:.1}},
 {n:'E-commerce and FMCG',s:{meta:.27,tiktok:.17,youtube:.21,search:.1,display:.1,retail:.15}},
 {n:'Brand launch',s:{meta:.35,tiktok:.25,youtube:.3,display:.1}},
 {n:'Lead generation and services',s:{meta:.5,search:.35,display:.15}}];
var FX=26000; /* VND per USD, mid-market, November 2026 */
window.BSM_BENCHMARKS={channels:CH,presets:PRESETS,fx:FX};
function ud(v){v=v/FX;return v>=10?Math.round(v).toLocaleString('en-US'):v>=0.1?v.toFixed(2):v>=0.01?v.toFixed(3):v.toFixed(4)}
function urng(a,b){if(a>b){var x=a;a=b;b=x}var A=ud(a),Bv=ud(b);return A==Bv?'≈ $'+A:'$'+A+' – $'+Bv}
function f(n){return Math.round(n).toLocaleString('en-US')}
function rng(a,b){a=Math.round(a);b=Math.round(b);if(a>b){var x=a;a=b;b=x}return a==b?'≈ '+f(a):f(a)+' – '+f(b)}
function short(n){if(n>=1e9)return (n/1e9).toFixed(n>=1e10?0:1).replace(/\.0$/,'')+'B';if(n>=1e6)return (n/1e6).toFixed(n>=1e7?0:1).replace(/\.0$/,'')+'M';if(n>=1e3)return Math.round(n/1e3)+'K';return ''+Math.round(n)}
function srng(a,b){if(a>b){var x=a;a=b;b=x}return Math.round(a)==Math.round(b)||short(a)==short(b)?short(a):short(a)+' – '+short(b)}
function compute(B,share){var T={impressions:[0,0],visits:[0,0],clicks:[0,0],views:[0,0],engagements:[0,0]},rows=[];
  CH.forEach(function(ch){var sp=B*(share[ch.k]||0);ch.f.forEach(function(fm){var s=sp*fm.w,v=fm.u=='CPM'?[s/fm.c[1]*1000,s/fm.c[0]*1000]:[s/fm.c[1],s/fm.c[0]];
    T[fm.out][0]+=v[0];T[fm.out][1]+=v[1];if(fm.cpm){T.impressions[0]+=s/fm.cpm[1]*1000;T.impressions[1]+=s/fm.cpm[0]*1000}rows.push({ch:ch.k,fm:fm,spend:s,v:v})})});return{T:T,rows:rows}}
function mount(el){var manual=false,share={meta:.7,tiktok:.2,search:.1},bud=el.querySelector('.c-budget'),pre=el.querySelector('.c-pre'),sls=el.querySelector('.c-sls'),out=el.querySelector('.c-chs'),kpi=el.querySelector('.c-kpi');
  pre.innerHTML=PRESETS.map(function(p,i){return '<button type="button" data-p="'+i+'"'+(i==0?' class="on"':'')+'>'+p.n+'</button>'}).join('');
  sls.innerHTML=CH.map(function(c){return '<div class="c-sl" data-k="'+c.k+'"><div><span>'+c.n+'</span><b></b></div><input type="range" min="0" max="100" aria-label="'+c.n+' share"></div>'}).join('');
  function getB(){return Math.max(0,+(bud.value||'').replace(/[^\d]/g,''))*FX}
  function setB(v){bud.value=f(v);paint()}function usdB(){return getB()/FX}
  bud.addEventListener('input',function(){manual=true;var v=usdB();bud.value=v?f(v):'';paint()});
  [].forEach.call(el.querySelectorAll('[data-b]'),function(c){c.addEventListener('click',function(){manual=true;setB(+c.getAttribute('data-b'))})});
  pre.addEventListener('click',function(e){var b=e.target.closest('[data-p]');if(!b)return;manual=true;var p=PRESETS[+b.getAttribute('data-p')];share={};CH.forEach(function(c){share[c.k]=p.s[c.k]||0});[].forEach.call(pre.children,function(x){x.classList.toggle('on',x===b)});paint()});
  [].forEach.call(sls.querySelectorAll('.c-sl'),function(row){var k=row.getAttribute('data-k'),r=row.querySelector('input');r.addEventListener('input',function(){manual=true;var v=+r.value/100,rest=0;CH.forEach(function(c){if(c.k!==k)rest+=share[c.k]||0});
    CH.forEach(function(c){if(c.k===k)share[k]=v;else share[c.k]=rest>0?(share[c.k]||0)*(1-v)/rest:(1-v)/(CH.length-1)});[].forEach.call(pre.children,function(x){x.classList.remove('on')});paint()})});
  function paint(){var B=getB(),R=compute(B,share),T=R.T;
    [].forEach.call(sls.querySelectorAll('.c-sl'),function(row){var k=row.getAttribute('data-k'),v=share[k]||0;row.querySelector('input').value=Math.round(v*100);row.querySelector('b').textContent=Math.round(v*100)+'%'+(v>0?' · $'+short(B*v/FX):'');row.classList.toggle('off',v<.005)});
    kpi.innerHTML='<div><span>Impressions</span><b>'+srng(T.impressions[0],T.impressions[1])+'</b></div><div><span>Visits and clicks</span><b>'+srng(T.visits[0]+T.clicks[0],T.visits[1]+T.clicks[1])+'</b></div><div><span>Video views</span><b>'+srng(T.views[0],T.views[1])+'</b></div><div><span>Engagements</span><b>'+srng(T.engagements[0],T.engagements[1])+'</b></div>';
    if(bars)bars.innerHTML=CH.map(function(c){var v=share[c.k]||0;return '<div class="cb'+(v<.005?' off':'')+'"><span>'+c.n+'</span><i><b style="width:'+(v*100).toFixed(1)+'%"></b></i><em>'+(v<.005?'0%':Math.round(v*100)+'% · $'+short(B*v/FX))+'</em></div>'}).join('');
    out.innerHTML=CH.filter(function(c){return (share[c.k]||0)>=.005}).map(function(c){var rs=R.rows.filter(function(r){return r.ch==c.k});
      return '<div class="c-ch"><h4>'+c.n+' <em>'+c.sub+'</em><span>$'+short(B*share[c.k]/FX)+'</span></h4>'+rs.map(function(r){var fm=r.fm;
        return '<div class="c-row"><span class="c-l">'+fm.u+'<small>'+fm.n+(c.f.length>1?' · '+Math.round(fm.w*100)+'%':'')+'</small></span><span class="c-c">'+urng(fm.c[0],fm.c[1])+'<small>'+fm.ud+(fm.cpm?' · CPM ≈ $'+ud(fm.cpm[0]):'')+(fm.note?' · '+fm.note:'')+'</small></span><span class="c-tag'+(fm.src=='Actual'?' act':'')+'">'+fm.src+'</span><span class="c-v">'+srng(r.v[0],r.v[1])+' '+fm.out+'</span></div>'}).join('')+'</div>'}).join('')||'<p class="c-empty">Move a slider to allocate budget.</p>'}
  var bars=null;
  if(el.hasAttribute('data-tour')){var co=el.querySelector('.c-out');var cap=document.createElement('div');cap.className='c-tour';cap.innerHTML='<span></span><i><b></b></i><ol>'+PRESETS.map(function(p){return '<li></li>'}).join('')+'</ol>';co.insertBefore(cap,co.firstChild);
    bars=document.createElement('div');bars.className='c-bars';co.insertBefore(bars,kpi.nextSibling);
    var det=document.createElement('div');det.className='c-detail';det.innerHTML='<div class="c-dh"><span class="c-t">Breakdown by format</span><p>Unit costs and volumes for the scenario above. Tap a business type or move a slider to make it yours.</p></div>';
    var mob=window.innerWidth<=900;if(mob){det.appendChild(pre.parentNode);det.appendChild(sls.parentNode);}det.appendChild(out);det.appendChild(el.querySelector('.c-note'));
    /* v24: no scroll pinning. Scenarios auto-play while the calculator is on screen; tap a dot to jump; any edit stops the tour */
    var n=PRESETS.length,BUD=[4000,12000,20000,60000],cur=0,from=null,t0=0,vis=false,last=0,DWELL=4200,TW=700;
    function snap(i){var o={};CH.forEach(function(c){o[c.k]=PRESETS[i].s[c.k]||0});return o}
    function show(i){var prevS=share,prevB=usdB();cur=i;from={s:prevS,b:prevB};t0=performance.now();
      [].forEach.call(pre.children,function(x2,k){x2.classList.toggle('on',k==i)});[].forEach.call(cap.querySelectorAll('li'),function(li,k){li.classList.toggle('on',k==i)});
      cap.firstChild.textContent='Scenario '+(i+1)+' of '+n+': '+PRESETS[i].n}
    [].forEach.call(cap.querySelectorAll('li'),function(li,k){li.setAttribute('role','button');li.setAttribute('aria-label','Scenario '+(k+1));li.addEventListener('click',function(){if(manual){manual=false;cap.classList.remove('man')}show(k);last=performance.now()})});
    new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!last){last=performance.now();show(0)}},{threshold:.25}).observe(el);
    (function loop(now){requestAnimationFrame(loop);if(manual){cap.firstChild.textContent='Your scenario';cap.classList.add('man');cap.querySelector('b').style.width='0%';return}
      if(!vis||!from)return;var k=Math.min(1,(now-t0)/TW);k=k*k*(3-2*k);var to=snap(cur);share={};CH.forEach(function(c){share[c.k]=(from.s[c.k]||0)*(1-k)+to[c.k]*k});
      bud.value=f(Math.round((from.b+(BUD[cur]-from.b)*k)/100)*100);if(k<1||!loop.done||loop.done!==cur){paint();if(k>=1)loop.done=cur}
      var el2=now-last;cap.querySelector('b').style.width=Math.min(100,el2/DWELL*100).toFixed(1)+'%';if(el2>DWELL){last=now;loop.done=-1;show((cur+1)%n)}})(performance.now());
    el.parentNode.insertBefore(det,el.nextSibling)}
  setB(+(el.getAttribute('data-budget')||4000))}
function boot(){[].forEach.call(document.querySelectorAll('.calc'),mount)}
if(document.readyState!='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();

/* Motion layer. No dependencies. See fx.css. */
(function(){
function all(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function inview(el,cb,th){if(!window.IntersectionObserver){cb();return}var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){cb();io.disconnect()}},{threshold:th||.3});io.observe(el)}
function boot(){
  // ===== Navigation: resize on scroll, hide on scroll down, hover pill, progress, glyphs =====
  var nav=document.querySelector('header.nav');if(nav){var inner=nav.querySelector('.nav-inner'),links=nav.querySelector('.nav-links'),lastY=window.scrollY,ticking=false;
    var prog=document.createElement('span');prog.className='nav-prog';prog.setAttribute('aria-hidden','true');inner.appendChild(prog);
    var ann=document.querySelector('.announce');function onScroll(){ticking=false;var y=window.scrollY,dh=document.documentElement.scrollHeight-window.innerHeight;nav.style.top=ann?Math.max(0,ann.offsetHeight-y)+'px':'0px';nav.classList.toggle('sc',y>30);
      var open=document.documentElement.classList.contains('menu-open');nav.classList.toggle('hid',!open&&y>480&&y>lastY+2&&!nav.matches(':hover'));if(y<lastY-2)nav.classList.remove('hid');lastY=y;prog.style.transform='scaleX('+(dh>0?Math.min(1,y/dh):0)+')'}
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();window.addEventListener('resize',onScroll);
    if(links){var hl=document.createElement('span');hl.className='nav-hl';hl.setAttribute('aria-hidden','true');links.insertBefore(hl,links.firstChild);
      [].forEach.call(links.children,function(el){if(el===hl)return;var a=el.tagName=='A'?el:el.querySelector(':scope>a');if(!a)return;el.addEventListener('mouseenter',function(){var lb=links.getBoundingClientRect(),b=a.getBoundingClientRect();hl.style.width=b.width+'px';hl.style.transform='translateX('+(b.left-lb.left)+'px)';hl.style.opacity='1'})});
      links.addEventListener('mouseleave',function(){hl.style.opacity='0'})}
    var G={architecture:'<path class="ac" d="M3 20h18"/><rect x="5" y="13" width="4" height="7"/><rect x="10" y="8" width="4" height="12"/><rect x="15" y="4" width="4" height="16"/>',
      intelligence:'<circle cx="10.5" cy="10.5" r="6.5"/><path class="ac" d="M15.5 15.5 21 21"/><polyline class="ac" points="7,12 9.5,9.5 11.5,11.5 14,8.5"/>',
      systems:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="15" width="18" height="5" rx="1.5"/><path class="ac" d="M7 9v6M17 9v6"/>',
      demand:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/><path class="ac" d="M10 13h4"/>',
      method:'<path d="M4 20V4"/><path d="M4 20h16"/><path class="ac" d="M6 17c3-1 5-7 8-9s4-2 6-3"/><circle class="ac" cx="14" cy="8" r="1.4"/>',
      about:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/><path class="ac" d="M12 14v6"/>',
      engine:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle class="ac" cx="12" cy="12" r="1"/>',
      contact:'<rect x="3" y="5" width="18" height="14" rx="2"/><path class="ac" d="M3 7l9 6 9-6"/>',
      'go-to-market':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/><path class="ac" d="M15 6l4-2-2 4"/>'};
    [].forEach.call(nav.querySelectorAll('.dd-inner a'),function(a){var k=(a.getAttribute('href')||'').split('/').pop().replace('.html','');if(a.querySelector('.gl'))return;if(!G[k])k='architecture';var s=document.createElement('span');s.className='gl';s.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+G[k]+'</svg>';a.insertBefore(s,a.firstChild)});
    var mn=document.getElementById('mnav'),bg=nav.querySelector('.burger');if(mn&&bg){var sync=function(){document.documentElement.classList.toggle('menu-open',mn.classList.contains('open'))};
      new MutationObserver(sync).observe(mn,{attributes:true,attributeFilter:['class']});
      [].forEach.call(mn.querySelectorAll('a'),function(a){a.addEventListener('click',function(){mn.classList.remove('open');bg.setAttribute('aria-expanded','false')})});
      document.addEventListener('keydown',function(ev){if(ev.key=='Escape'&&mn.classList.contains('open')){mn.classList.remove('open');bg.setAttribute('aria-expanded','false')}})}}
  // ===== Page transitions: wipe on arrival; fade-out fallback where View Transitions are not supported =====
  var wipe=document.createElement('div');wipe.className='page-wipe';wipe.setAttribute('aria-hidden','true');document.body.appendChild(wipe);setTimeout(function(){wipe.remove()},1200);
  if(!('onpagereveal' in window)&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    document.addEventListener('click',function(ev){var a=ev.target.closest&&ev.target.closest('a[href]');if(!a||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey||a.target&&a.target!='_self'||a.hasAttribute('download'))return;
      var u;try{u=new URL(a.href,location.href)}catch(_){return}if(u.origin!==location.origin||(u.pathname===location.pathname&&u.hash)||u.protocol.indexOf('http')!==0)return;
      ev.preventDefault();document.documentElement.classList.add('pg-out');setTimeout(function(){location.href=u.href},260)});
    window.addEventListener('pageshow',function(e){if(e.persisted)document.documentElement.classList.remove('pg-out')})}
  // ===== Cookie consent (Google Consent Mode v2). Choice is stored as bsp_consent; listen for the "bsp:consent" event to load tags =====
  (function(){var KEY='bsp_consent',pre=/\/(insights|work)\//.test(location.pathname)?'../':'';
    function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return window.__bspc||null}}
    function save(c){c.ts=new Date().toISOString();window.__bspc=c;try{localStorage.setItem(KEY,JSON.stringify(c))}catch(_){}
      if(window.gtag)gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});
      try{document.dispatchEvent(new CustomEvent('bsp:consent',{detail:c}))}catch(_){}}
    window.bspConsent={get:read,open:show};
    var box=null;
    function show(){if(box){box.classList.add('on','open');return}var c=read()||{analytics:false,marketing:false};
      box=document.createElement('div');box.className='ck';box.setAttribute('role','dialog');box.setAttribute('aria-label','Cookie preferences');
      box.innerHTML='<h4><i></i>Cookies and tracking</h4><p>We use cookies to measure visits and improve the site. Analytics and marketing cookies run only if you accept them. <a href="'+pre+'privacy.html#cookies">Privacy notice</a></p>'+
        '<div class="ck-set"><div><div class="ck-opt"><div><b>Necessary</b><small>Keeps the site working. Always on.</small></div><label class="ck-sw"><input type="checkbox" checked disabled aria-label="Necessary cookies"><span></span></label></div>'+
        '<div class="ck-opt"><div><b>Analytics</b><small>Visits and how pages are used.</small></div><label class="ck-sw"><input type="checkbox" data-c="analytics" aria-label="Analytics cookies"'+(c.analytics?' checked':'')+'><span></span></label></div>'+
        '<div class="ck-opt"><div><b>Marketing</b><small>Measure and personalise advertising.</small></div><label class="ck-sw"><input type="checkbox" data-c="marketing" aria-label="Marketing cookies"'+(c.marketing?' checked':'')+'><span></span></label></div></div></div>'+
        '<div class="ck-btn"><button type="button" class="ck-a">Accept all</button><button type="button" class="ck-r">Reject non-essential</button><button type="button" class="ck-s">Settings</button></div>';
      document.body.appendChild(box);requestAnimationFrame(function(){requestAnimationFrame(function(){box.classList.add('on')})});
      function close(c2){save(c2);box.classList.remove('on');setTimeout(function(){if(box){box.remove();box=null}},600)}
      box.querySelector('.ck-a').addEventListener('click',function(){close({analytics:true,marketing:true})});
      box.querySelector('.ck-r').addEventListener('click',function(){close({analytics:false,marketing:false})});
      var s=box.querySelector('.ck-s');s.addEventListener('click',function(){if(!box.classList.contains('open')){box.classList.add('open');s.textContent='Save choices'}else close({analytics:box.querySelector('[data-c=analytics]').checked,marketing:box.querySelector('[data-c=marketing]').checked})})}
    var fb=document.querySelector('.foot-bottom span:last-child');if(fb&&!document.querySelector('[data-cookie-settings]')){var a=document.createElement('a');a.href='#';a.setAttribute('data-cookie-settings','');a.textContent='Cookie settings';a.addEventListener('click',function(e){e.preventDefault();show()});fb.insertBefore(document.createTextNode(' · '),fb.firstChild);fb.insertBefore(a,fb.firstChild)}
    if(!read()&&!document.documentElement.classList.contains('embed'))setTimeout(show,900)})();
  // ===== Scroll-linked: word scrub, counters, stacking model cards =====
  (function(){var RMq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrubs=[].slice.call(document.querySelectorAll('[data-scrub]')).map(function(el){var ws=[];
      (function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType==3){var parts=c.textContent.split(/(\s+)/),fr=document.createDocumentFragment();parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){fr.appendChild(document.createTextNode(p))}else{var s=document.createElement('span');s.className='scw';s.textContent=p;ws.push(s);fr.appendChild(s)}});c.parentNode.replaceChild(fr,c)}else if(c.nodeType==1&&c.tagName!='BR')walk(c)})})(el);
      el.classList.add('scrub');return{el:el,ws:ws}});
    function upd(){var vh=window.innerHeight;scrubs.forEach(function(o){var r=o.el.getBoundingClientRect(),p=RMq?1:Math.max(0,Math.min(1,(vh*.88-r.top)/(r.height+vh*.42))),lit=p*o.ws.length;o.ws.forEach(function(w,i){var a=Math.max(0,Math.min(1,lit-i));w.style.opacity=(.14+.86*a).toFixed(3)})});
      stack()}
    // counters
    [].forEach.call(document.querySelectorAll('.mk-stats b'),function(b){var m=b.textContent.trim().match(/^(\d+)(\+?)$/);if(m){b.setAttribute('data-to',m[1]);b.setAttribute('data-suf',m[2])}});
    var cnt=[].slice.call(document.querySelectorAll('[data-to]'));if(window.IntersectionObserver)cnt.forEach(function(b){var to=+b.getAttribute('data-to'),suf=b.getAttribute('data-suf')||'';if(!RMq)b.textContent='0'+suf;var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();if(RMq){b.textContent=to+suf;return}var t0=performance.now();(function tick(now){var p=Math.min(1,(now-t0)/1400),e=1-Math.pow(1-p,3);b.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(tick)})(t0)},{threshold:.6});io.observe(b)});
    // stacking model cards (desktop)
    var cards=[].slice.call(document.querySelectorAll('.models .model.legacy-stk')),useStack=false;
    function setupStack(){useStack=!RMq&&window.innerWidth>1024&&cards.length>1&&cards.every(function(c){return c.offsetHeight<window.innerHeight-130});cards.forEach(function(c,i){c.classList.toggle('stk',useStack);c.style.top=useStack?(96+i*16)+'px':'';if(!useStack){c.style.transform='';c.style.filter=''}})}
    function stack(){if(!useStack)return;cards.forEach(function(c,i){var nx=cards[i+1];if(!nx){c.style.transform='';c.style.filter='';return}var top=96+i*16,nt=nx.getBoundingClientRect().top,h=c.offsetHeight,p=Math.max(0,Math.min(1,(top+h-nt)/h));c.style.transform=p>0?'scale('+(1-.06*p).toFixed(4)+')':'';c.style.filter=p>0?'brightness('+(1-.55*p).toFixed(3)+')':''})}
    setupStack();window.addEventListener('resize',function(){setupStack();upd()});
    var tk=false;window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;upd()})}},{passive:true});upd()})();
  // ===== Article reader: insights open as a sheet over the page (NYT-style), with a link to the full page =====
  (function(){if(location.pathname.indexOf('/insights/')>-1)return;var links=document.querySelectorAll('a.ed-open');if(!links.length)return;var box=null,ifr=null,prev=null;
    function close(fromPop){if(!box)return;box.classList.remove('on');document.documentElement.classList.remove('reading');setTimeout(function(){if(box&&!box.classList.contains('on')&&ifr)ifr.src='about:blank'},600);if(!fromPop&&history.state&&history.state.reader)history.back()}
    function open(href,title){if(!box){box=document.createElement('div');box.className='reader';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
        box.innerHTML='<div class="rd-bg"></div><div class="rd-sheet"><div class="rd-bar"><span class="rd-t"></span><a class="rd-full" href="#">Open full page ↗</a><button type="button" class="rd-x" aria-label="Close article">✕</button></div><div class="rd-load"><i></i></div><iframe title="Article"></iframe></div>';
        document.body.appendChild(box);ifr=box.querySelector('iframe');box.querySelector('.rd-bg').addEventListener('click',function(){close()});box.querySelector('.rd-x').addEventListener('click',function(){close()});
        ifr.addEventListener('load',function(){box.classList.add('ready')});document.addEventListener('keydown',function(e){if(e.key=='Escape')close()});window.addEventListener('popstate',function(){if(box&&box.classList.contains('on'))close(true)})}
      box.classList.remove('ready');box.querySelector('.rd-t').textContent=title;box.querySelector('.rd-full').href=href;ifr.src=href+(href.indexOf('?')>-1?'&':'?')+'embed=1';
      requestAnimationFrame(function(){box.classList.add('on');document.documentElement.classList.add('reading')});try{history.pushState({reader:1},'',href)}catch(_){}}
    [].forEach.call(links,function(a){a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0)return;e.preventDefault();var t=a.querySelector('h3,h4');open(a.getAttribute('href'),t?t.textContent:'')})})})();
  // ===== Full-screen stacking cards (home insights) =====
  (function(){var cs=[].slice.call(document.querySelectorAll('.fsc'));if(!cs.length)return;var tk=false;
    function u(){tk=false;var vh=window.innerHeight;cs.forEach(function(c,i){var r=c.getBoundingClientRect(),a=c.querySelector(':scope>a'),nx=cs[i+1];c.classList.toggle('act',r.top<vh*.55&&r.bottom>vh*.3);
      if(!nx){a.style.transform='';a.style.filter='';return}var p=Math.max(0,Math.min(1,(vh-nx.getBoundingClientRect().top)/vh));a.style.transform=p>0?'scale('+(1-.08*p).toFixed(4)+')':'';a.style.filter=p>0?'brightness('+(1-.6*p).toFixed(3)+')':''})}
    window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(u)}},{passive:true});window.addEventListener('resize',u);u()})();
  // Spotlight: hero
  var hero=document.getElementById('hero');if(hero){var sp=document.createElement('div');sp.className='fx-spot';sp.setAttribute('aria-hidden','true');hero.insertBefore(sp,hero.firstChild)}
  // Moving border: primary calls to action
  all('#hero .btn-solid, .cta3 .btn-solid').forEach(function(b){b.classList.add('fx-mb')});
  // Text generate effect: section headings
  all('.sec-head h2').forEach(function(h){if(h.children.length)return;var ws=h.textContent.trim().split(/\s+/);h.setAttribute('aria-label',h.textContent.trim());h.textContent='';
    ws.forEach(function(w,i){var s=document.createElement('span');s.className='w';s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);s.textContent=w;h.appendChild(s);if(i<ws.length-1)h.appendChild(document.createTextNode(' '))});
    h.classList.add('fx-tg');inview(h,function(){h.classList.add('go')},.4)});
  // Lamp: quant section
  var q=document.querySelector('#quant .wrap');if(q){var l=document.createElement('div');l.className='fx-lamp';l.setAttribute('aria-hidden','true');l.innerHTML='<b></b><i></i>';q.insertBefore(l,q.firstChild);inview(l,function(){l.classList.add('go')},.6)}
  // Background beams: closing call to action
  all('.cta3, section.cta').forEach(function(c){c.classList.add('fx-host');var p='',i;for(i=0;i<8;i++){var d='M-120 '+(640-i*34)+' C 380 '+(600-i*70)+', 820 '+(180+i*26)+', 1560 '+(-60+i*78);p+='<path class="b0" d="'+d+'"/><path class="b1" d="'+d+'" style="animation-delay:-'+(i*1.9%7).toFixed(1)+'s;animation-duration:'+(6+i%3*1.5)+'s"/>'}
    var w=document.createElement('div');w.innerHTML='<svg class="fx-beams" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+p+'</svg>';c.insertBefore(w.firstChild,c.firstChild)});
  // Sticky scroll rail: Architecture chapters
  var chs=all('nav.chapters a');if(chs.length&&window.IntersectionObserver){var rail=document.createElement('nav');rail.className='fx-rail';rail.setAttribute('aria-label','Chapters');var secs=[];
    chs.forEach(function(a){var id=a.getAttribute('href'),sec=document.querySelector(id);if(!sec)return;var l=document.createElement('a');l.href=id;l.innerHTML='<span>'+a.textContent+'</span><i></i>';rail.appendChild(l);secs.push([sec,l])});document.body.appendChild(rail);
    function spy(){var mid=window.innerHeight*.5,cur=null;secs.forEach(function(p){var b=p[0].getBoundingClientRect();if(b.top<=mid&&b.bottom>mid)cur=p});secs.forEach(function(p){p[1].classList.toggle('cur',p===cur)});
      var f=secs[0][0].getBoundingClientRect(),e=secs[secs.length-1][0].getBoundingClientRect();rail.classList.toggle('on',f.top<mid&&e.bottom>mid)}
    window.addEventListener('scroll',spy,{passive:true});spy()}
  // Tracing beam: articles
  var pr=document.querySelector('.art-body .prose');if(pr){pr.style.position='relative';var t=document.createElement('div');t.className='fx-trace';t.setAttribute('aria-hidden','true');t.innerHTML='<u></u><s></s>';pr.appendChild(t);var u=t.firstChild,d=t.lastChild,tick=false;
    function upd(){tick=false;var b=t.getBoundingClientRect(),p=Math.max(0,Math.min(1,(window.innerHeight*.5-b.top)/b.height)),y=p*b.height;u.style.height=y+'px';d.style.top=y+'px'}
    window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});window.addEventListener('resize',upd);upd()}
}
if(document.readyState!='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();

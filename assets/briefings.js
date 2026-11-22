/* Strategic Briefings: email capture rendered on the homepage, Work, Method, case studies and Insight articles.
   Include with <script src="assets/briefings.js" data-page="home|hub|case|article" defer></script>.
   Submissions post to FormSubmit (AJAX) and arrive at partners@bespokemarketing.asia. */
(function(){
  var me=document.currentScript||document.querySelector('script[src*="briefings.js"]');
  var PAGE=(me&&me.getAttribute('data-page'))||'hub';
  var ENDPOINT='https://formsubmit.co/ajax/partners@bespokemarketing.asia';
  var PRIVACY=((me&&me.getAttribute('src'))||'').replace(/assets\/briefings\.js.*$/,'')+'privacy.html';
  var K_SUB='bf_subscribed',K_DISMISS='bf_dismissed_until',K_MIN='bf_min';
  var EMBED=document.documentElement.classList.contains('embed');
  var RE=/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  var uid=0;

  function store(fn){try{return fn(window.localStorage)}catch(e){return null}}
  function sess(fn){try{return fn(window.sessionStorage)}catch(e){return null}}
  function subscribed(){return store(function(s){return s.getItem(K_SUB)})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  var COPY={
    k:'Strategic Briefings',
    h:'Strategic Briefings.',
    p:'Periodic, curated perspectives on the industry shifts reshaping Southeast Asian markets, the strategic choices they raise for leadership teams, and the practical solutions that follow.',
    pShort:'Curated perspectives on industry shifts, strategic choices and practical solutions in Southeast Asia.',
    note:'Sent selectively. Opt out anytime. See our <a href="'+PRIVACY+'">privacy policy</a>.'
  };

  function formHTML(place){
    var i=++uid;
    return '<form class="bf-form" action="'+ENDPOINT+'" method="POST" novalidate data-place="'+place+'">'+
      '<div class="bf-row"><label class="bf-sr" for="bf-e'+i+'">Work email address</label>'+
      '<input id="bf-e'+i+'" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="Work email address" required aria-describedby="bf-m'+i+'">'+
      '<button class="bf-btn" type="submit"><span class="bf-lbl">Request briefings</span><i aria-hidden="true">→</i><span class="bf-spin" aria-hidden="true"></span></button></div>'+
      '<div class="bf-hp" aria-hidden="true"><label for="bf-h'+i+'">Leave this field empty</label><input id="bf-h'+i+'" type="text" name="_honey" tabindex="-1" autocomplete="off"></div>'+
      '<p class="bf-msg" id="bf-m'+i+'" aria-live="polite">'+COPY.note+'</p>'+
      '<div class="bf-done" role="status" tabindex="-1"><b>Confirmed.</b><span>Future briefings will be sent to <em class="bf-addr"></em>.</span></div>'+
    '</form>';
  }
  function card(place,extra){
    var el=document.createElement('aside');
    el.className='bf-card'+(extra?' '+extra:'');
    el.setAttribute('aria-label','Strategic Briefings signup');
    var short=/inline|end/.test(place);
    el.innerHTML='<div class="bf-txt"><p class="bf-k">'+(short?'Strategic Briefings':'For leadership teams')+'</p>'+
      '<h3 class="bf-h">'+(short?'Receive our next briefing.':COPY.h)+'</h3>'+
      '<p class="bf-p">'+(short?COPY.pShort:COPY.p)+'</p></div>'+formHTML(place);
    return el;
  }

  /* ---------- form behaviour (shared by every instance) ---------- */
  function wire(f){
    var input=f.querySelector('input[type=email]'),hp=f.querySelector('input[name=_honey]'),btn=f.querySelector('.bf-btn'),
        lbl=f.querySelector('.bf-lbl'),msg=f.querySelector('.bf-msg'),done=f.querySelector('.bf-done'),addr=f.querySelector('.bf-addr'),note=msg.innerHTML;
    function error(t){f.classList.add('err');input.setAttribute('aria-invalid','true');msg.innerHTML=t}
    function reset(){f.classList.remove('err');input.removeAttribute('aria-invalid');msg.innerHTML=note}
    function busy(on){f.classList.toggle('busy',on);btn.disabled=on;input.readOnly=on;f.setAttribute('aria-busy',on?'true':'false');lbl.textContent=on?'Submitting':'Request briefings'}
    function success(email,real){
      addr.textContent=email;f.classList.add('sent');done.focus({preventScroll:true});
      if(!real)return;
      store(function(s){s.setItem(K_SUB,email)});
      [].forEach.call(document.querySelectorAll('.bf-form:not(.sent)'),function(o){o.querySelector('.bf-addr').textContent=email;o.classList.add('sent')});
      if(window.gtag)try{gtag('event','generate_lead',{form_name:'strategic_briefings',placement:f.getAttribute('data-place')})}catch(e){}
      if(float&&!float.contains(f))setTimeout(hideFloat,300);
    }
    input.addEventListener('input',function(){if(f.classList.contains('err'))reset()});
    f.addEventListener('submit',function(e){
      e.preventDefault();if(f.classList.contains('busy'))return;
      var email=input.value.trim();
      if(!email){error('Please enter your work email address.');input.focus();return}
      if(email.length>254||!RE.test(email)){error('Please enter a valid email address, for example name@company.com.');input.focus();return}
      reset();
      if(hp.value){success(email,false);return} /* honeypot filled: pretend it worked, send nothing */
      busy(true);
      var ctl='AbortController' in window?new AbortController():null,t=setTimeout(function(){ctl&&ctl.abort()},15000);
      fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:ctl&&ctl.signal,
        body:JSON.stringify({email:email,_subject:'Strategic Briefings request: '+email,_template:'table',_honey:'',
          placement:f.getAttribute('data-place'),page:document.title,source:location.href,submitted:new Date().toISOString()})})
      .then(function(r){return r.json().catch(function(){return{}}).then(function(d){if(!r.ok||String(d.success)!=='true')throw new Error(d.message||'Request failed')})})
      .then(function(){success(email,true)})
      .catch(function(){error('Your request could not be sent. Please try again, or write to <a href="mailto:partners@bespokemarketing.asia">partners@bespokemarketing.asia</a>.')})
      .then(function(){clearTimeout(t);busy(false)});
    });
    var known=subscribed();
    if(known){addr.textContent=known;f.classList.add('sent')}
  }

  /* ---------- floating bar ---------- */
  var float=null,watched=[],seen=new Set(),scrolledEnough=false,ticking=false;
  var ICON_X='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8"/></svg>';
  var ICON_MIN='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8"/></svg>';
  function floatAllowed(){
    if(EMBED||subscribed())return false;
    var until=+store(function(s){return s.getItem(K_DISMISS)})||0;
    return Date.now()>until;
  }
  function buildFloat(){
    float=document.createElement('aside');
    float.className='bf-float';float.setAttribute('aria-label','Strategic Briefings signup');
    float.innerHTML=
      '<div class="bf-bar"><div class="bf-bar-t"><b>Strategic Briefings</b><span>Curated perspectives for leadership teams</span></div>'+
      '<button class="bf-btn bf-open" type="button" aria-expanded="false">Request <i aria-hidden="true">→</i></button>'+
      '<button class="bf-x bf-close" type="button" aria-label="Dismiss Strategic Briefings">'+ICON_X+'</button></div>'+
      '<div class="bf-panel"><div class="bf-tools"><button class="bf-x bf-min" type="button" aria-label="Minimise">'+ICON_MIN+'</button>'+
      '<button class="bf-x bf-close" type="button" aria-label="Dismiss Strategic Briefings">'+ICON_X+'</button></div>'+
      '<p class="bf-k">Strategic Briefings</p><h3 class="bf-h">Receive our next briefing.</h3><p class="bf-p">'+COPY.pShort+'</p>'+formHTML('float')+'</div>';
    document.body.appendChild(float);
    wire(float.querySelector('.bf-form'));
    var openBtn=float.querySelector('.bf-open');
    openBtn.addEventListener('click',function(){float.classList.add('open');openBtn.setAttribute('aria-expanded','true');sess(function(s){s.removeItem(K_MIN)});setTimeout(function(){float.querySelector('input[type=email]').focus({preventScroll:true})},60)});
    float.querySelector('.bf-min').addEventListener('click',function(){float.classList.remove('open');openBtn.setAttribute('aria-expanded','false');sess(function(s){s.setItem(K_MIN,'1')});openBtn.focus({preventScroll:true})});
    [].forEach.call(float.querySelectorAll('.bf-close'),function(b){b.addEventListener('click',function(){
      store(function(s){s.setItem(K_DISMISS,String(Date.now()+7*864e5))});hideFloat(true)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&float.classList.contains('open'))float.querySelector('.bf-min').click()});
  }
  function hideFloat(remove){if(!float)return;float.classList.remove('show');if(remove===true){var f=float;float=null;setTimeout(function(){f.remove()},600)}}
  function update(){
    ticking=false;if(!float)return;
    var d=document.documentElement,max=d.scrollHeight-innerHeight;
    if(!scrolledEnough&&scrollY>Math.min(700,max*0.2))scrolledEnough=true;
    var ck=document.querySelector('.ck.on');
    var cookieBlocks=ck&&(innerWidth<=720||ck.getBoundingClientRect().right>innerWidth-420);
    var typing=float.contains(document.activeElement)&&float.classList.contains('open');
    var show=typing||(scrolledEnough&&!seen.size&&!cookieBlocks);
    float.classList.toggle('show',!!show);
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  function initFloat(){
    if(!floatAllowed())return;
    buildFloat();
    watched=[].slice.call(document.querySelectorAll('.bf-card,.foot,.cta3,.related'));
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?seen.add(e.target):seen.delete(e.target)});onScroll()},{rootMargin:'0px 0px -12% 0px'});
      watched.forEach(function(el){io.observe(el)});
    }
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
    var ckEl=document.querySelector('.ck');
    if(ckEl&&'MutationObserver' in window)new MutationObserver(onScroll).observe(ckEl,{attributes:true,attributeFilter:['class']});
    setInterval(onScroll,1500); /* cheap safety net for the cookie banner being added late */
    onScroll();
  }

  /* ---------- placement per page type ---------- */
  function mount(){
    var prose=document.querySelector('article.prose');
    if(PAGE==='home'){
      var slot=document.querySelector('[data-bf-mount]');
      if(slot)slot.appendChild(card('home-feature','bf-home'));
    }else if(PAGE==='article'||PAGE==='case'){
      if(prose){
        var notes=prose.querySelector(':scope > .notes');
        var end=card(PAGE+'-end','bf-inline');
        notes?prose.insertBefore(end,notes):prose.appendChild(end);
        if(PAGE==='article'&&!subscribed()){
          var hs=[].slice.call(prose.querySelectorAll(':scope > h2'));
          if(hs.length>=3)prose.insertBefore(card('article-inline','bf-inline'),hs[Math.floor(hs.length/2)]);
        }
      }
    }else{
      var anchor=document.querySelector('section.cta3')||document.querySelector('footer.foot');
      if(anchor){
        var band=document.createElement('section');band.className='bf-band';band.id='briefings';
        var w=document.createElement('div');w.className='wrap';w.appendChild(card('hub-band'));band.appendChild(w);
        anchor.parentNode.insertBefore(band,anchor);
      }
    }
    [].forEach.call(document.querySelectorAll('.bf-card .bf-form'),wire);
    if(PAGE!=='home')initFloat();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();

// A shared, measured viewport keeps both navigation panels in one surface.
(()=>{
 const nav=document.querySelector('#navigation'),viewport=nav.querySelector('.nav-viewport');
 const triggers=[...nav.querySelectorAll('.nav-trigger')];
 const mobile=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let active=null,closeTimer,openedByHover=false;
 function close(restoreFocus=false){
  clearTimeout(closeTimer);
  const previous=active;active=null;openedByHover=false;
  triggers.forEach(trigger=>trigger.setAttribute('aria-expanded','false'));
  viewport.hidden=true;viewport.querySelectorAll('.nav-panel').forEach(panel=>panel.hidden=true);
  if(restoreFocus&&previous)previous.focus();
 }
 function measure(){if(active)viewport.style.height=`${document.getElementById(active.getAttribute('aria-controls')).offsetHeight}px`}
 function open(trigger){
  clearTimeout(closeTimer);if(active===trigger)return;
  active=trigger;viewport.hidden=false;
  triggers.forEach(item=>{
   const selected=item===trigger,panel=document.getElementById(item.getAttribute('aria-controls'));
   item.setAttribute('aria-expanded',String(selected));panel.hidden=!selected;
   if(selected&&!reduced.matches)panel.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'});
  });
  measure();
 }
 triggers.forEach((trigger,index)=>{
  trigger.addEventListener('click',()=>{if(active===trigger&&!openedByHover)close();else open(trigger);openedByHover=false});
  trigger.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!mobile.matches&&active!==trigger){open(trigger);openedByHover=true}});
  trigger.addEventListener('keydown',event=>{
   if(event.key==='ArrowDown'){event.preventDefault();open(trigger);document.getElementById(trigger.getAttribute('aria-controls')).querySelector('a').focus()}
   if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();const next=triggers[(index+(event.key==='ArrowRight'?1:triggers.length-1))%triggers.length];next.focus();if(active)open(next);
   }
  });
 });
 nav.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
 nav.addEventListener('pointerleave',()=>{if(!mobile.matches)closeTimer=setTimeout(()=>close(),220)});
 nav.addEventListener('focusout',event=>{if(!nav.contains(event.relatedTarget))close()});
 nav.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();event.stopPropagation();close(true)}});
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close()));
 nav.querySelectorAll('.nav-list>li>a').forEach(link=>link.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')close()}));
 document.addEventListener('pointerdown',event=>{if(!nav.contains(event.target))close()});
 mobile.addEventListener('change',()=>close());
 if('ResizeObserver'in window)new ResizeObserver(measure).observe(nav);
 window.addEventListener('resize',measure);
})();

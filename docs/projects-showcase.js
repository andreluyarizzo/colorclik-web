(() => {
 'use strict';
 const root=document.querySelector('.work-showcase');
 if(!root)return;
 const slides=[...root.querySelectorAll('.work-slide')];
 const choices=[...root.querySelectorAll('[data-work-index]')];
 const controls=root.querySelector('.work-controls');
 const play=root.querySelector('[data-work-play]');
 const status=root.querySelector('[role=status]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,timer=null,paused=reduced.matches,visible=false,hovered=false,focused=false,animation;
 function schedule(){
  clearInterval(timer);timer=null;
  if(!paused&&visible&&!hovered&&!focused&&!document.hidden)timer=setInterval(()=>select((active+1)%slides.length,false),5500);
 }
 function select(index,announce=true){
  if(index===active)return;
  animation?.cancel();
  slides[active].hidden=true;active=index;slides[active].hidden=false;
  choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  if(!reduced.matches)animation=slides[active].animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});
  if(announce)status.textContent=slides[active].querySelector('.work-name').textContent;
 }
 function updatePlay(){play.textContent=paused?'Reproducir':'Pausar';play.setAttribute('aria-label',paused?'Reproducir proyectos automáticamente':'Pausar proyectos automáticos');}
 choices.forEach((button,i)=>button.addEventListener('click',()=>{select(i);schedule();}));
 play.addEventListener('click',()=>{paused=!paused;updatePlay();schedule();});
 root.addEventListener('pointerenter',()=>{hovered=true;schedule();});
 root.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 root.addEventListener('focusin',()=>{focused=true;schedule();});
 root.addEventListener('focusout',event=>{focused=root.contains(event.relatedTarget);schedule();});
 root.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();select((active+(event.key==='ArrowRight'?1:slides.length-1))%slides.length);choices[active].focus();
 });
 document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',()=>{animation?.cancel();paused=reduced.matches;updatePlay();schedule();});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(root);
 else{visible=true;schedule();}
 controls.hidden=false;updatePlay();
})();

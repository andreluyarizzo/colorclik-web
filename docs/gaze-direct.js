/* ColorClik gaze: direct nine-direction canvas, desktop + touch. */
(() => {
  const host = document.getElementById('hero-gaze');
  const hero = document.querySelector('.hero');
  if (!host || !hero) return;
  const stage = host.querySelector('.gaze-stage');
  const canvas = host.querySelector('canvas');
  let ctx = null;
  const names=['arriba-izquierda','arriba','arriba-derecha','izquierda','frente','derecha','abajo-izquierda','abajo','abajo-derecha'];
  let frames=[],loading=false;
  let ready=false, visible=false, index=4, activeTouch=null, lastPosition=null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = () => visible && !document.hidden && !reduced.matches;
  const draw = n => {
    if (!ready || !frames[n]) return;
    if (!ctx) ctx = canvas.getContext('2d', {alpha:false});
    if (!ctx) return;
    ctx.drawImage(frames[n],0,0,1280,720);
    index=n;
    stage.classList.add('has-frame');
    hero.dataset.gaze='tracking';
  };
  const show = (x,y) => {
    lastPosition={x,y};
    if (!ready) {loadFrames();return;}
    const r=hero.getBoundingClientRect();
    const px=Math.max(-1,Math.min(1,2*(x-r.left)/r.width-1));
    const py=Math.max(-1,Math.min(1,2*(y-r.top)/r.height-1));
    const col=px<-.32?0:px>.32?2:1;
    const row=py<-.32?0:py>.32?2:1;
    const next=row*3+col;
    if(next!==index)draw(next);
  };
  const center = () => {lastPosition=null;if(ready)draw(4);hero.dataset.gazeMoving='false';};
  // The images are exactly those from the approved direct-transition demo.
  // No MP4 seeking or decoding during pointer movement.
  function loadFrames(){
   if(loading||reduced.matches)return;
   loading=true;
   frames=names.map(name=>{const image=new Image();image.src='assets/gaze/frames/'+name+'.webp';return image});
   Promise.all(frames.map(image=>image.decode())).then(()=>{
    ready=true;
    draw(4);
    if(lastPosition)show(lastPosition.x,lastPosition.y);
    else{stage.classList.remove('has-frame');hero.dataset.gaze='static';}
  }).catch(error=>{
    console.warn('ColorClik gaze frames unavailable; retaining original poster',error);
    stage.classList.remove('has-frame');hero.dataset.gaze='static';
  });
  }
  hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')loadFrames()},{passive:true});
  // Desktop: pointer hover across the hero, without intercepting clicks.
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||!allowed())return;
    show(e.clientX,e.clientY);
  },{passive:true});
  hero.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')center();});

  // Mobile: capture only gestures that START on the doll, not the entire hero.
  // Preserve natural vertical scrolling everywhere else.
  let touchStart=null;
  const dollZone=(x,y)=>{
    const r=host.getBoundingClientRect();
    return x>=r.left+r.width*.20 && x<=r.right-r.width*.20 &&
           y>=r.top+r.height*.08 && y<=r.bottom-r.height*.08;
  };
  hero.addEventListener('touchstart',e=>{
    if(!allowed()||e.touches.length!==1)return;
    const t=e.touches[0];
    if(!dollZone(t.clientX,t.clientY))return;
    touchStart={id:t.identifier};
    show(t.clientX,t.clientY);
  },{passive:true});
  hero.addEventListener('touchmove',e=>{
    if(!touchStart||!allowed())return;
    const t=Array.from(e.changedTouches).find(t=>t.identifier===touchStart.id);
    if(!t)return;
    if(e.cancelable)e.preventDefault();
    show(t.clientX,t.clientY);
  },{passive:false});
  const endTouch=e=>{
    if(!touchStart)return;
    if(Array.from(e.changedTouches).some(t=>t.identifier===touchStart.id)){
      touchStart=null;center();
    }
  };
  hero.addEventListener('touchend',endTouch,{passive:true});
  hero.addEventListener('touchcancel',endTouch,{passive:true});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){stage.classList.remove('has-frame');hero.dataset.gaze='static';}},{threshold:.01});
  observer.observe(hero);

  document.addEventListener('visibilitychange',()=>{if(document.hidden){stage.classList.remove('has-frame');hero.dataset.gaze='static';}});
  reduced.addEventListener('change',()=>{if(reduced.matches){stage.classList.remove('has-frame');hero.dataset.gaze='static';}});
  hero.dataset.gaze='static';hero.dataset.gazeMoving='false';
})();

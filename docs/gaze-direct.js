/* ColorClik gaze: direct nine-direction canvas, desktop + touch. */
(() => {
  const host = document.getElementById('hero-gaze');
  const hero = document.querySelector('.hero');
  if (!host || !hero) return;
  host.innerHTML = '<div class="gaze-stage"><img class="gaze-poster" src="assets/gaze/original.webp" alt="" width="1672" height="941"><canvas class="gaze-source" width="1280" height="720" aria-hidden="true"></canvas></div>';
  const stage = host.querySelector('.gaze-stage');
  const canvas = host.querySelector('canvas');
  const ctx = canvas.getContext('2d', {alpha:false});
  if (!ctx) return;
  const times = [2.45,3.42,3.65,1.55,9.42,4.55,7.55,6.35,5.45];
  const frames = [];
  let ready=false, loading=false, visible=false, index=4, activeTouch=null, lastPosition=null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = () => visible && !document.hidden && !reduced.matches;
  const draw = n => {
    if (!ready || !frames[n]) return;
    ctx.drawImage(frames[n],0,0,1280,720);
    index=n;
    stage.classList.add('has-frame');
    hero.dataset.gaze='tracking';
  };
  const show = (x,y) => {
    lastPosition={x,y};
    if (!ready) return;
    const r=hero.getBoundingClientRect();
    const px=Math.max(-1,Math.min(1,2*(x-r.left)/r.width-1));
    const py=Math.max(-1,Math.min(1,2*(y-r.top)/r.height-1));
    const col=px<-.32?0:px>.32?2:1;
    const row=py<-.32?0:py>.32?2:1;
    const next=row*3+col;
    if(next!==index)draw(next);
  };
  const center = () => {lastPosition=null;if(ready)draw(4);hero.dataset.gazeMoving='false';};
  const resize=()=>{
    const r=hero.getBoundingClientRect();
    const scale=Math.min(r.height/720,(r.width-24)/650);
    stage.style.width=(1280*scale)+'px';
    stage.style.height=(720*scale)+'px';
  };
  const seek=(video,time)=>new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{cleanup();reject(new Error('Frame timeout'));},4500);
    const cleanup=()=>{clearTimeout(timeout);video.removeEventListener('seeked',done);video.removeEventListener('error',fail);};
    const done=()=>{cleanup();resolve();};
    const fail=()=>{cleanup();reject(new Error('Video error'));};
    video.addEventListener('seeked',done,{once:true});
    video.addEventListener('error',fail,{once:true});
    video.currentTime=time;
  });
  async function load(){
    if(loading||ready||!allowed())return;
    loading=true;
    const video=document.createElement('video');
    video.muted=true;video.playsInline=true;video.preload='auto';
    try{
      video.src='assets/gaze/hero-scrub.mp4';
      await new Promise((resolve,reject)=>{
        video.addEventListener('loadedmetadata',resolve,{once:true});
        video.addEventListener('error',()=>reject(new Error('Video unavailable')),{once:true});
        video.load();
      });
      for(const t of times){
        await seek(video,Math.min(t,video.duration-.05));
        const frame=document.createElement('canvas');
        frame.width=1280;frame.height=720;
        frame.getContext('2d').drawImage(video,0,0,1280,720);
        frames.push(frame);
      }
      ready=true;
      draw(4);
      if(lastPosition)show(lastPosition.x,lastPosition.y);
      else{stage.classList.remove('has-frame');hero.dataset.gaze='static';}
    }catch(error){console.warn('ColorClik gaze: original poster retained',error);stage.classList.remove('has-frame');hero.dataset.gaze='static';}
    finally{video.removeAttribute('src');video.load();loading=false;}
  }
  hero.addEventListener('pointerdown',e=>{
    if(!allowed()||e.pointerType==='mouse')return;
    activeTouch=e.pointerId;
    try{hero.setPointerCapture(e.pointerId);}catch{}
    show(e.clientX,e.clientY);load();
  });
  hero.addEventListener('pointermove',e=>{
    if(!allowed())return;
    if(e.pointerType==='touch'&&activeTouch!==e.pointerId)return;
    show(e.clientX,e.clientY);load();
  },{passive:true});
  hero.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'&&activeTouch===e.pointerId){activeTouch=null;center();}});
  hero.addEventListener('pointercancel',e=>{if(activeTouch===e.pointerId){activeTouch=null;center();}});
  hero.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')center();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){stage.classList.remove('has-frame');hero.dataset.gaze='static';}},{threshold:.01});
  observer.observe(hero);
  new ResizeObserver(resize).observe(hero);resize();
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stage.classList.remove('has-frame');hero.dataset.gaze='static';}});
  reduced.addEventListener('change',()=>{if(reduced.matches){stage.classList.remove('has-frame');hero.dataset.gaze='static';}});
  hero.dataset.gaze='static';hero.dataset.gazeMoving='false';
})();
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { normalizePointer } from './gaze-motion.mjs';

// Prototype: decode nine frames ONCE; pointer movement never seeks the MP4.
const DIRECTIONS = [
  { x:-1,y:-1,t:2.45 }, { x:0,y:-1,t:3.42 }, { x:1,y:-1,t:3.65 },
  { x:-1,y:0,t:1.55 }, { x:0,y:0,t:9.42 }, { x:1,y:0,t:4.55 },
  { x:-1,y:1,t:7.55 }, { x:0,y:1,t:6.35 }, { x:1,y:1,t:5.45 }
];
const IMAGE_W=1280, IMAGE_H=720;
const frameAt = (video, t) => new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{cleanup();reject(new Error('Frame seek timeout'));},4000);
  const cleanup=()=>{clearTimeout(timeout);video.removeEventListener('seeked',done);video.removeEventListener('error',error);};
  const error=()=>{cleanup();reject(new Error('Video decoding error'));};
  const done=()=>{cleanup();resolve();};
  video.addEventListener('seeked',done,{once:true});
  video.addEventListener('error',error,{once:true});
  video.currentTime=t;
});
function Gaze(){
  const canvasRef=useRef(null),stageRef=useRef(null);
  useEffect(()=>{
    const hero=document.querySelector('.hero'),stage=stageRef.current,canvas=canvasRef.current;
    if(!hero||!canvas)return;
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    
    let disposed=false,visible=false,inside=false,ready=false,loading=false,activePointer=null;
    let currentIndex=4;
    const frames=[];
    const allowed=()=>!disposed&&visible&&!document.hidden&&!reduced.matches;
    const draw=(index)=>{
      const img=frames[index];if(!img)return;
      ctx.drawImage(img,0,0,IMAGE_W,IMAGE_H);
      stage.classList.add('has-frame');
      hero.dataset.gaze='tracking';
    };
    // Direct mode is intentional: exactly the behavior approved in the mobile demo.
    function showAt(clientX,clientY){
      const rect=hero.getBoundingClientRect();
      const p=normalizePointer(clientX,clientY,rect);
      const col=p.x<-.32?0:p.x>.32?2:1;
      const row=p.y<-.32?0:p.y>.32?2:1;
      const next=row*3+col;
      if(ready&&next!==currentIndex){currentIndex=next;draw(next);}
    }
    function reset(){
      inside=false;
      if(ready){currentIndex=4;draw(4);}
      hero.dataset.gazeMoving='false';
    }
    async function prepare(){
      if(loading||ready||!allowed()||navigator.connection?.saveData)return;
      loading=true;
      const video=document.createElement('video');
      video.muted=true;video.playsInline=true;video.preload='auto';
      video.src='assets/gaze/hero-scrub.mp4';
      try{
        await new Promise((resolve,reject)=>{
          video.addEventListener('loadedmetadata',resolve,{once:true});
          video.addEventListener('error',()=>reject(new Error('Video unavailable')),{once:true});
          video.load();
        });
        for(const dir of DIRECTIONS){
          if(disposed)break;
          await frameAt(video,Math.min(dir.t,Math.max(0,video.duration-.05)));
          const bitmap=document.createElement('canvas');
          bitmap.width=IMAGE_W;bitmap.height=IMAGE_H;
          bitmap.getContext('2d').drawImage(video,0,0,IMAGE_W,IMAGE_H);
          frames.push(bitmap);
        }
        if(!disposed&&frames.length===9){
          ready=true;currentIndex=4;draw(4);
          if(inside)draw(currentIndex);
          else {stage.classList.remove('has-frame');hero.dataset.gaze='static';}
        }
      }catch(err){console.warn('Gaze Canvas: keeping original poster',err);hero.dataset.gaze='static';}
      finally{video.removeAttribute('src');video.load();loading=false;}
    }
    const move=e=>{
      if(!allowed())return;
      if(e.pointerType==='touch'&&activePointer!==e.pointerId)return;
      inside=true;
      if(!ready)prepare();
      else showAt(e.clientX,e.clientY);
      hero.dataset.gazeMoving='false';
    };
    const down=e=>{
      if(!allowed()||e.pointerType==='mouse')return;
      activePointer=e.pointerId;
      try{hero.setPointerCapture(e.pointerId);}catch{}
      move(e);
    };
    const up=e=>{
      if(e.pointerType!=='mouse'&&activePointer!==e.pointerId)return;
      activePointer=null;reset();
    };
    const leave=e=>{if(e.pointerType==='mouse')reset();};
    const policy=()=>{
      if(!allowed()){
        activePointer=null;inside=false;
        stage.classList.remove('has-frame');hero.dataset.gaze='static';
      }
    };
    const resize=()=>{
      const r=hero.getBoundingClientRect();
      const scale=Math.min(r.height/720,(r.width-24)/650);
      stage.style.width=`${1280*scale}px`;stage.style.height=`${720*scale}px`;
    };
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;policy();},{threshold:.01});
    observer.observe(hero);
    const ro=new ResizeObserver(resize);ro.observe(hero);resize();
    hero.addEventListener('pointerdown',down);hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerup',up);
    hero.addEventListener('pointerleave',leave);
    hero.addEventListener('pointercancel',up);
    document.addEventListener('visibilitychange',policy);
    reduced.addEventListener('change',policy);
    hero.dataset.gaze='static';hero.dataset.gazeMoving='false';
    return()=>{
      disposed=true;observer.disconnect();ro.disconnect();
      hero.removeEventListener('pointerdown',down);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerup',up);hero.removeEventListener('pointerleave',leave);
      hero.removeEventListener('pointercancel',up);
      document.removeEventListener('visibilitychange',policy);
      reduced.removeEventListener('change',policy);
    };
  },[]);
  return <div className="gaze-stage" ref={stageRef}>
    <img className="gaze-poster" src="assets/gaze/original.webp" alt="" width="1672" height="941" fetchPriority="high"/>
    <canvas ref={canvasRef} className="gaze-source" width={1280} height={720} aria-hidden="true"/>
  </div>;
}
const mount=document.getElementById('hero-gaze');
if(mount)createRoot(mount).render(<Gaze/>);

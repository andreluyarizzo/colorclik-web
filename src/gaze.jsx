import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { normalizePointer, gazeTime, damp, clamp } from './gaze-motion.mjs';

function Gaze() {
  const videoRef=useRef(null),stageRef=useRef(null);
  useEffect(()=>{
    const hero=document.querySelector('.hero'),video=videoRef.current,stage=stageRef.current;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
    let visible=false,inside=false,returning=false,disposed=false,failed=false,ready=false,frame=0,last=0;
    let target={x:0,y:0},point={x:0,y:0},time=0,destination=0,seekPending=false,seekSafety;
    const allowed=()=>!disposed&&!failed&&visible&&!document.hidden&&!reduced.matches&&fine.matches;
    function cancel(){cancelAnimationFrame(frame);frame=0;last=0;hero.dataset.gazeMoving='false';}
    function schedule(){if(allowed()&&(inside||returning)&&ready&&!frame&&!seekPending){hero.dataset.gazeMoving='true';frame=requestAnimationFrame(update);}}
    function fallback(){
      cancel();clearTimeout(seekSafety);seekPending=false;time=destination=0;point={x:0,y:0};target={x:0,y:0};
      hero.dataset.gaze='static';stage.classList.remove('has-frame');
      if(ready&&!failed&&video.hasAttribute('src')){try{video.currentTime=0;}catch{}}
    }
    function fail(){failed=true;clearTimeout(seekSafety);seekPending=false;fallback();}
    function decoded(){
      clearTimeout(seekSafety);seekPending=false;
      if(!allowed()||(!inside&&!returning))return;
      if(video.readyState<2)return;
      stage.classList.add('has-frame');
      hero.dataset.gazeTime=video.currentTime.toFixed(3);
      // Seeking is serialized: keep the last decoded frame until the next is ready.
      if(returning&&video.currentTime<.025){returning=false;stage.classList.remove('has-frame');hero.dataset.gaze='static';hero.dataset.gazeMoving='false';}
      else if(Math.abs(time-destination)>.018||(!returning&&Math.hypot(point.x-target.x,point.y-target.y)>.003))schedule();
      else hero.dataset.gazeMoving='false';
    }
    function update(now){
      frame=0;if(!allowed()||(!inside&&!returning)){cancel();return;}
      const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;
      point={x:damp(point.x,target.x,dt,.09),y:damp(point.y,target.y,dt,.09)};
      destination=returning?0:gazeTime(point.x,point.y,time);
      // Damp time and bound travel through the recorded source sequence.
      const proposed=damp(time,destination,dt,.28);
      time+=clamp(proposed-time,-dt*2.5,dt*2.5);
      const wanted=Math.round(time*24)/24;
      if(Math.abs(wanted-video.currentTime)>.025){
        const requested=clamp(wanted,0,9.75);seekPending=true;
        seekSafety=setTimeout(fail,2500);
        video.currentTime=requested;
      }else if(returning&&video.currentTime<.025){returning=false;stage.classList.remove('has-frame');hero.dataset.gaze='static';hero.dataset.gazeMoving='false';}
      else if(Math.abs(time-destination)>.018||(!returning&&Math.hypot(point.x-target.x,point.y-target.y)>.003))schedule();
      else {hero.dataset.gazeMoving='false';if(returning){returning=false;stage.classList.remove('has-frame');hero.dataset.gaze='static';}}
    }
    function load(){
      if(!allowed()||video.hasAttribute('src')||navigator.connection?.saveData)return;
      video.src='assets/gaze/hero-scrub.mp4';video.load();
    }
    function move(event){
      if(!allowed()||event.pointerType==='touch')return;
      inside=true;returning=false;target=normalizePointer(event.clientX,event.clientY,hero.getBoundingClientRect());
      hero.dataset.gaze='tracking';load();if(ready&&!video.seeking)stage.classList.add('has-frame');schedule();
    }
    function leave(){
      inside=false;returning=time>.025;hero.dataset.gaze='returning';
      if(allowed()&&returning)schedule();else{cancel();stage.classList.remove('has-frame');hero.dataset.gaze='static';}
    }
    function policy(){if(!allowed()){inside=returning=false;fallback();if(reduced.matches||!fine.matches){video.removeAttribute('src');video.load();ready=false;}}else load();}
    function resize(){
      const r=hero.getBoundingClientRect();
      // Keep the complete head/glasses/shoulder envelope inside any viewport.
      const scale=Math.min(r.height/720,(r.width-24)/650);
      stage.style.width=`${1280*scale}px`;stage.style.height=`${720*scale}px`;
    }
    video.addEventListener('loadeddata',()=>{ready=true;video.pause();if(inside){stage.classList.add('has-frame');schedule();}});
    video.addEventListener('seeked',decoded);video.addEventListener('error',fail);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){inside=returning=false;fallback();}else policy();},{threshold:.01});observer.observe(hero);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(hero);resize();
    hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave);hero.addEventListener('pointercancel',leave);
    document.addEventListener('visibilitychange',policy);window.addEventListener('blur',leave);reduced.addEventListener('change',policy);fine.addEventListener('change',policy);
    hero.dataset.gaze='static';hero.dataset.gazeMoving='false';
    return()=>{disposed=true;cancel();clearTimeout(seekSafety);observer.disconnect();resizeObserver.disconnect();video.pause();video.removeAttribute('src');video.load();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);hero.removeEventListener('pointercancel',leave);document.removeEventListener('visibilitychange',policy);window.removeEventListener('blur',leave);reduced.removeEventListener('change',policy);fine.removeEventListener('change',policy);video.removeEventListener('seeked',decoded);video.removeEventListener('error',fail);};
  },[]);
  return <div className="gaze-stage" ref={stageRef}><img className="gaze-poster" src="assets/gaze/original.webp" alt="" width="1672" height="941" fetchPriority="high"/><video ref={videoRef} className="gaze-source" muted playsInline preload="none" disablePictureInPicture aria-hidden="true"/></div>;
}
const mount=document.getElementById('hero-gaze');
if(mount)createRoot(mount).render(<Gaze/>);

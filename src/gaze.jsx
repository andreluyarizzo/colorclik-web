import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const directions = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
const states = ['center', ...directions];
export function directionAt(x, y, previous = 'center') {
  if (Math.hypot(x, y) < (previous === 'center' ? .2 : .14)) return 'center';
  const angle = Math.atan2(y, x);
  const index = (Math.round(angle / (Math.PI / 4)) + 8) % 8;
  if (previous !== 'center') {
    const oldAngle = directions.indexOf(previous) * Math.PI / 4;
    const difference = Math.atan2(Math.sin(angle - oldAngle), Math.cos(angle - oldAngle));
    if (Math.abs(difference) < Math.PI / 8 + .09) return previous;
  }
  return directions[index];
}

function Gaze() {
  const videoRefs = useRef([]);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const videos = videoRefs.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const poses = {center:9.6, left:1.6, 'up-left':2.6, up:3.4, 'up-right':3.85, right:4.6, 'down-right':5.6, down:6.6, 'down-left':7.6};
    let active = 0, current = 'center', candidate = 'center';
    let dwell, idle, settle, frame, point, anchor, seekHandler;
    let transitioning = false, tracking = false, holding = false, lastChange = -Infinity;
    function play(video = videos[active]) {
      if (reduced.matches) videos.forEach(v => v.pause());
      else if (!tracking) video.play().catch(() => {});
    }
    function orient(name) {
      if (!tracking || reduced.matches || (name === current && holding)) return;
      if (transitioning || performance.now()-lastChange < 600) {
        dwell = setTimeout(() => orient(candidate), 180); return;
      }
      const outgoing = videos[active], incoming = videos[1-active];
      if (incoming.readyState < 2) return;
      transitioning = true;
      // Freeze both original poses while blending, so neither pair of eyes drifts.
      outgoing.pause(); incoming.pause(); holding = true;
      seekHandler = () => {
        seekHandler = null;
        if (reduced.matches) { transitioning=false; return; }
        requestAnimationFrame(() => {
          incoming.style.opacity = '1'; outgoing.style.opacity = '0';
          active = 1-active; current = name;
          hero.dataset.gaze = name; lastChange = performance.now();
          settle = setTimeout(() => { outgoing.pause(); transitioning = false; if (!tracking) play(); }, 440);
        });
      };
      incoming.addEventListener('seeked', seekHandler, {once:true});
      incoming.currentTime = poses[name];
    }
    function reset() {
      clearTimeout(dwell); clearTimeout(idle);
      point = anchor = null; candidate = current;
      tracking = holding = false;
      hero.dataset.gaze = 'idle';
      // Keep the current film, time and remembered direction intact.
      play();
    }
    function update() {
      frame = 0;
      if (!point || reduced.matches) return;
      const r = hero.getBoundingClientRect();
      const next = directionAt((point.x-r.left-r.width/2)/(r.width/2), (point.y-r.top-r.height*.53)/(r.height/2), current);
      if (next === candidate && holding) return;
      candidate = next; clearTimeout(dwell);
      // A deliberate move must remain in its sector before changing the gaze.
      dwell = setTimeout(() => orient(next), 150);
    }
    function move(event) {
      if (reduced.matches) return;
      const next = {x:event.clientX,y:event.clientY};
      clearTimeout(idle); idle = setTimeout(reset, 1200);
      if (anchor && Math.hypot(next.x-anchor.x,next.y-anchor.y) < 24) return;
      tracking = true;
      anchor = next; point = next;
      if (!frame) frame = requestAnimationFrame(update);
    }
    function release(event) { if (event.pointerType !== 'mouse') reset(); }
    function preference() { reset(); }
    function resume() { if (!document.hidden) play(); }
    const loaded = videos.map((video,index) => {
      const callback = () => { if(index===active) play(video); };
      video.addEventListener('loadeddata', callback); return callback;
    });
    hero.addEventListener('pointermove', move, {passive:true});
    hero.addEventListener('pointerleave', reset);
    hero.addEventListener('pointerup', release);
    hero.addEventListener('pointercancel', reset);
    reduced.addEventListener('change', preference);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('blur', reset);
    play();
    return () => {
      clearTimeout(dwell); clearTimeout(idle); clearTimeout(settle); cancelAnimationFrame(frame);
      videos.forEach((video,index) => { video.removeEventListener('loadeddata',loaded[index]); if(seekHandler)video.removeEventListener('seeked',seekHandler); video.pause(); });
      hero.removeEventListener('pointermove',move); hero.removeEventListener('pointerleave',reset);
      hero.removeEventListener('pointerup',release); hero.removeEventListener('pointercancel',reset);
      reduced.removeEventListener('change',preference); document.removeEventListener('visibilitychange',resume); window.removeEventListener('blur',reset);
    };
  }, []);
  return [0,1].map(index => <video key={index} ref={element => {videoRefs.current[index]=element;}}
    className="gaze-frame gaze-film" style={{opacity:index===0?1:0}}
    src="assets/hero-flow.mp4" poster="assets/gaze/center.webp" muted loop playsInline preload="auto" disablePictureInPicture />);
}

createRoot(document.getElementById('hero-gaze')).render(<Gaze />);

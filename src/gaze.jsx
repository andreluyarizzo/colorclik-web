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
    let dwell, settle, frame, seekTimeout, point, pendingSeek;
    let transitioning = false, tracking = false, holding = false, disposed = false;
    function play() {
      videos.forEach((video,index) => {
        if (reduced.matches || tracking || index !== active) video.pause();
        else video.play().catch(() => {});
      });
    }
    function clearSeek() {
      clearTimeout(seekTimeout);
      if (pendingSeek) pendingSeek.video.removeEventListener('seeked', pendingSeek.callback);
      pendingSeek = null;
    }
    function orient() {
      if (disposed || !tracking || reduced.matches || transitioning || (candidate === current && holding)) return;
      const name = candidate, outgoing = videos[active], incoming = videos[1-active];
      // Metadata is enough to seek; loadeddata retries when the decoder is ready.
      if (incoming.readyState < 1) return;
      transitioning = true;
      outgoing.pause(); incoming.pause();
      const reveal = () => {
        clearSeek();
        if (disposed) return;
        if (!tracking || reduced.matches) { transitioning = false; play(); return; }
        incoming.style.opacity = '1'; outgoing.style.opacity = '0';
        active = 1-active; current = name; holding = true;
        hero.dataset.gaze = name;
        settle = setTimeout(() => { transitioning = false; orient(); }, 440);
      };
      const time = Math.min(poses[name], Math.max(0, incoming.duration - .05));
      // Seeking to an already decoded frame need not emit another seeked event.
      if (Math.abs(incoming.currentTime-time) < .025 && incoming.readyState >= 2) reveal();
      else {
        pendingSeek = {video:incoming,callback:reveal};
        incoming.addEventListener('seeked', reveal, {once:true});
        seekTimeout = setTimeout(() => { clearSeek(); transitioning = false; if (tracking) dwell = setTimeout(() => { dwell = null; orient(); }, 150); }, 1600);
        incoming.currentTime = time;
      }
    }
    function reset() {
      clearTimeout(dwell); dwell = null; clearTimeout(settle); clearSeek();
      cancelAnimationFrame(frame); frame = 0; point = null;
      tracking = holding = transitioning = false;
      candidate = current; hero.dataset.gaze = 'idle'; play();
    }
    function update() {
      frame = 0;
      if (!point || reduced.matches) return;
      const r = hero.getBoundingClientRect();
      const next = directionAt((point.x-r.left-r.width/2)/(r.width/2), (point.y-r.top-r.height*.53)/(r.height/2), candidate);
      // Only restart the dwell when crossing sectors, never on every mouse move.
      if (next === candidate && (holding || dwell || transitioning)) return;
      candidate = next; clearTimeout(dwell);
      dwell = setTimeout(() => { dwell = null; orient(); }, 100);
    }
    function move(event) {
      if (reduced.matches || event.pointerType === 'touch') return;
      tracking = true; point = {x:event.clientX,y:event.clientY};
      if (!frame) frame = requestAnimationFrame(update);
    }
    function resume() { if (document.hidden) reset(); else play(); }
    const loaded = videos.map(video => {
      const callback = () => { if (tracking) orient(); else play(); };
      video.addEventListener('loadeddata', callback); return callback;
    });
    hero.addEventListener('pointermove', move, {passive:true});
    hero.addEventListener('pointerleave', reset);
    hero.addEventListener('pointercancel', reset);
    reduced.addEventListener('change', reset);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('blur', reset);
    play();
    return () => {
      disposed = true; reset();
      videos.forEach((video,index) => { video.removeEventListener('loadeddata',loaded[index]); video.pause(); });
      hero.removeEventListener('pointermove',move); hero.removeEventListener('pointerleave',reset);
      hero.removeEventListener('pointercancel',reset); reduced.removeEventListener('change',reset);
      document.removeEventListener('visibilitychange',resume); window.removeEventListener('blur',reset);
    };
  }, []);
  return <><img className="gaze-poster" src="assets/gaze/center.webp" alt="" width="1280" height="720" />{[0,1].map(index => <video key={index} ref={element => {videoRefs.current[index]=element;}}
    className="gaze-frame gaze-film" style={{opacity:index===0?1:0}}
    src="assets/hero-flow.mp4" poster="assets/gaze/center.webp" muted loop playsInline preload="auto" disablePictureInPicture />)}</>;
}

createRoot(document.getElementById('hero-gaze')).render(<Gaze />);

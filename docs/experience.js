(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 // One curtain entrance, bounded even if a media resource never finishes loading.
 const preloader=document.querySelector('#page-preloader');
 let loaderDone=false,loaderInterval,loaderExit,loaderSafety;
 const lockedElements=[document.querySelector('header'),document.querySelector('main')];
 const originalInert=lockedElements.map(el=>el.inert),previousOverflow=document.documentElement.style.overflow;
 function releaseLoader(){if(loaderDone)return;loaderDone=true;clearInterval(loaderInterval);clearTimeout(loaderSafety);preloader.remove();document.documentElement.style.overflow=previousOverflow;lockedElements.forEach((el,i)=>el.inert=originalInert[i]);window.dispatchEvent(new CustomEvent('colorclik:ready'))}
  window.addEventListener('colorclik:ready',()=>{if(reduce.matches)return;const visibleHeadings=Array.from(document.querySelectorAll('[data-letters]')).filter(h=>{const r=h.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight});visibleHeadings.forEach(h=>h.classList.remove('letters-in'));requestAnimationFrame(()=>requestAnimationFrame(()=>visibleHeadings.forEach(h=>h.classList.add('letters-in'))))},{once:true});
 if(reduce.matches){releaseLoader()}else{
  preloader.hidden=false;document.documentElement.style.overflow='hidden';lockedElements.forEach(el=>el.inert=true);
  const words=['Ideas.','Color.','Hacemos clik.'];let wordIndex=0;const word=preloader.querySelector('.preloader-word');
  loaderInterval=setInterval(()=>{word.classList.add('changing');setTimeout(()=>{if(loaderDone)return;wordIndex=(wordIndex+1)%words.length;word.textContent=words[wordIndex];word.classList.remove('changing')},130)},520);
  loaderExit=setTimeout(()=>{clearInterval(loaderInterval);preloader.classList.add('is-exiting');setTimeout(releaseLoader,820)},1680);
  loaderSafety=setTimeout(releaseLoader,3300);
 }
 reduce.addEventListener('change',()=>{if(reduce.matches){clearTimeout(loaderExit);releaseLoader()}});
 // Presentation-only services: the destination pages will be added later.
 const panels=Array.from(document.querySelectorAll('.service-grid .service'));
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 panels.forEach(panel=>{
  panel.classList.remove('is-active');panel.removeAttribute('aria-pressed');panel.setAttribute('aria-label',panel.dataset.service);
  panel.querySelector('h3').textContent=panel.dataset.service;
  const glow=document.createElement('span');glow.className='service-glow';glow.setAttribute('aria-hidden','true');panel.append(glow);
  panel.addEventListener('pointermove',event=>{if(!finePointer.matches||reduce.matches)return;const r=panel.getBoundingClientRect();panel.style.setProperty('--glow-x',`${event.clientX-r.left}px`);panel.style.setProperty('--glow-y',`${event.clientY-r.top}px`)});
  panel.addEventListener('pointerleave',()=>{panel.style.removeProperty('--glow-x');panel.style.removeProperty('--glow-y')});
 });
 // Clip the frame while the image travels independently inside an overscanned area.
 const revealFrames=[];document.querySelectorAll('.project>img').forEach(img=>{const frame=document.createElement('span');frame.className='image-reveal';img.before(frame);frame.append(img);revealFrames.push(frame)});
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.querySelector('.image-reveal').classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});revealFrames.forEach(frame=>{if(reduce.matches)frame.classList.add('is-visible');else observer.observe(frame.parentElement)})}else revealFrames.forEach(frame=>frame.classList.add('is-visible'));
 // Project stories rotate automatically; no invented client quotations.
 const carousel=document.querySelector('.reviews-carousel'),cards=Array.from(document.querySelectorAll('.review-card')),dots=Array.from(document.querySelectorAll('.review-dots>button')),previous=carousel.querySelector('.review-prev'),next=carousel.querySelector('.review-next'),play=carousel.querySelector('.review-play'),announce=carousel.querySelector('.review-announcement');
 // Size the shared viewport to the longest card, including narrow screens and fonts.
 const reviewStack=carousel.querySelector('.review-stack');
 function fitReviews(){let height=0;cards.forEach(card=>{const top=card.getBoundingClientRect().top;const padding=parseFloat(getComputedStyle(card).paddingBottom);for(const child of card.children)height=Math.max(height,child.getBoundingClientRect().bottom-top+padding)});reviewStack.style.minHeight=`${Math.max(230,Math.ceil(height)+2)}px`}
 if('ResizeObserver'in window)new ResizeObserver(fitReviews).observe(carousel);else addEventListener('resize',fitReviews);
 document.fonts.ready.then(fitReviews);fitReviews();
 let current=0,userPaused=false,carouselVisible=false,hovering=false,focused=false,interval;
 function renderReview(index,manual=false){current=(index+cards.length)%cards.length;cards.forEach((card,i)=>{const position=(i-current+cards.length)%cards.length;card.dataset.position=String(position);card.setAttribute('aria-hidden',String(position!==0));card.inert=position!==0});dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));previous.disabled=false;next.disabled=false;carousel.querySelector(".review-counter").textContent=`${String(current+1).padStart(2,"0")} / ${String(cards.length).padStart(2,"0")}`;if(manual)announce.textContent=`${cards[current].querySelector("h3").textContent}, proyecto ${current+1} de ${cards.length}`}
 function syncReviewPlayback(){clearInterval(interval);if(!userPaused&&!reduce.matches&&carouselVisible&&!hovering&&!focused&&!document.hidden)interval=setInterval(()=>renderReview(current+1),5500);play.textContent='';play.classList.toggle('is-paused',userPaused);play.setAttribute('aria-label',userPaused?'Activar carrusel':'Pausar carrusel');play.setAttribute('aria-pressed',String(userPaused))}
 previous.addEventListener('click',()=>{renderReview(current-1,true);syncReviewPlayback()});next.addEventListener('click',()=>{renderReview(current+1,true);syncReviewPlayback()});dots.forEach((dot,i)=>dot.addEventListener('click',()=>{renderReview(i,true);syncReviewPlayback()}));play.addEventListener('click',()=>{userPaused=!userPaused;syncReviewPlayback()});
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();renderReview(current+1,true)}else if(event.key==='ArrowLeft'){event.preventDefault();renderReview(current-1,true)}});
 carousel.addEventListener('pointerenter',()=>{hovering=true;syncReviewPlayback()});carousel.addEventListener('pointerleave',()=>{hovering=false;syncReviewPlayback()});carousel.addEventListener('focusin',()=>{focused=true;syncReviewPlayback()});carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;syncReviewPlayback()}});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{carouselVisible=entries[0].isIntersecting;syncReviewPlayback()},{threshold:.2}).observe(carousel);else carouselVisible=true;
 reduce.addEventListener('change',syncReviewPlayback);document.addEventListener('visibilitychange',syncReviewPlayback);renderReview(0);syncReviewPlayback();
})();





// Sample only the clean service blue; testimonial media owns its playback.
(()=>{
 const webVideo=document.querySelector('.web-service-video');
 if(!webVideo)return;
 const sample=document.createElement('canvas');sample.width=sample.height=1;const ctx=sample.getContext('2d',{willReadFrequently:true});
 function paint(){if(webVideo.readyState<2)return;ctx.drawImage(webVideo,webVideo.videoWidth*.94,webVideo.videoHeight*.5,1,1,0,0,1,1);const p=ctx.getImageData(0,0,1,1).data;const blue=`rgb(${p[0]} ${p[1]} ${p[2]})`;webVideo.closest('.service').style.setProperty('--web-blue',blue);document.documentElement.style.setProperty('--web-blue',blue)}
 webVideo.addEventListener('loadeddata',paint);paint();
})();

// Loop on arrival, pause outside the section, and respect explicit controls.
(()=>{
 const section=document.querySelector('#resenas'),video=section.querySelector('video'),sound=section.querySelector('.reviews-sound'),play=section.querySelector('.reviews-video-play');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let visible=false,userPaused=false,userMuted=false,request=0;
 video.loop=true;
 const icon=paths=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
 const speaker='<path d="M11 5 6 9H3v6h3l5 4Z"/>';
 function reflect(){
  const muted=video.muted,paused=video.paused;
  sound.innerHTML=icon(speaker+(muted?'<path d="m16 9 5 6m0-6-5 6"/>':'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>'));
  const soundLabel=muted?'Activar sonido':'Silenciar';sound.setAttribute('aria-label',soundLabel);sound.title=soundLabel;sound.setAttribute('aria-pressed',String(!muted));
  play.innerHTML=icon(paused?'<path d="m9 5 11 7-11 7Z"/>':'<path d="M8 5v14M16 5v14"/>');
  const playLabel=paused?'Reproducir video':'Pausar video';play.setAttribute('aria-label',playLabel);play.title=playLabel;
 }
 async function start(audible=true){
  const token=++request;video.muted=!audible||userMuted;video.volume=.65;
  try{await video.play()}catch{if(token!==request)return;video.muted=true;try{await video.play()}catch{}}
  if(token!==request){video.pause();video.muted=true}reflect();
 }
 function stop(){request++;video.pause();video.muted=true;reflect()}
 function sync(){if(visible&&!document.hidden&&!userPaused&&!reduced.matches)start();else stop()}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.4}).observe(video);
 sound.addEventListener('click',()=>{userMuted=!video.muted;if(!userMuted){userPaused=false;if(video.ended)video.currentTime=0;start(true)}else{video.muted=true;reflect()}});
 play.addEventListener('click',()=>{if(video.paused){userPaused=false;if(video.ended)video.currentTime=0;start(!userMuted)}else{userPaused=true;stop()}});
 // A preceding interaction allows an audible start in browsers that require it.
 document.addEventListener('pointerdown',event=>{if(visible&&!section.contains(event.target)&&!userMuted&&!userPaused&&!reduced.matches)start()});
 for(const event of ['play','pause','volumechange','ended'])video.addEventListener(event,reflect);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);reflect();
})();

// All projects share a rotating fan; mobile keeps native swipe navigation.
(()=>{
 const gallery=document.querySelector('.project-grid'),projects=[...gallery.querySelectorAll('.project')],buttons=[...document.querySelectorAll('[data-project-index]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)');
 let frame,current=0;
 function highlight(index){
  current=index;
  projects.forEach((project,i)=>{
   let slot=(i-index+projects.length)%projects.length;if(slot>projects.length/2)slot-=projects.length;
   const hidden=!mobile.matches&&Math.abs(slot)>2;
   project.style.setProperty('--slot',slot);project.style.setProperty('--card-angle',`${slot*9}deg`);project.style.setProperty('--card-y',`${Math.abs(slot)*20}px`);project.style.setProperty('--card-order',10-Math.abs(slot));
   project.classList.toggle('is-featured',i===index);project.classList.toggle('is-outside-fan',hidden);project.inert=hidden;
  });
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 }
 function select(index){highlight(index);if(mobile.matches)gallery.scrollTo({left:projects[index].offsetLeft+(projects[index].offsetWidth-gallery.clientWidth)/2,behavior:'instant'})}
 function reflect(){frame=null;if(!mobile.matches)return;let index=0,distance=Infinity;projects.forEach((project,i)=>{const delta=Math.abs(project.getBoundingClientRect().left+project.offsetWidth/2-gallery.getBoundingClientRect().left-gallery.clientWidth/2);if(delta<distance){index=i;distance=delta}});highlight(index)}
 buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
 projects.forEach((project,index)=>project.addEventListener('focus',()=>{if(!mobile.matches&&project.matches(':focus-visible'))select(index)}));
 gallery.addEventListener('scroll',()=>{if(!frame&&mobile.matches)frame=requestAnimationFrame(reflect)},{passive:true});
 gallery.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();select(event.key==='Home'?0:event.key==='End'?projects.length-1:(current+(event.key==='ArrowRight'?1:projects.length-1))%projects.length)});
 mobile.addEventListener('change',()=>{gallery.scrollLeft=0;highlight(0)});
 highlight(0);
})();

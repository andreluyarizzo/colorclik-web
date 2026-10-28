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
 // A keyboard-accessible review stack. All copy is clearly marked as illustrative.
 const carousel=document.querySelector('.reviews-carousel'),cards=Array.from(document.querySelectorAll('.review-card')),dots=Array.from(document.querySelectorAll('.review-dots>button')),previous=carousel.querySelector('.review-prev'),next=carousel.querySelector('.review-next'),play=carousel.querySelector('.review-play'),announce=carousel.querySelector('.review-announcement');
 let current=0,userPaused=false,carouselVisible=false,hovering=false,focused=false,interval;
 function renderReview(index,manual=false){current=(index+cards.length)%cards.length;cards.forEach((card,i)=>{const position=(i-current+cards.length)%cards.length;card.dataset.position=String(position);card.setAttribute('aria-hidden',String(position!==0));card.inert=position!==0});dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));previous.disabled=current===0;next.disabled=current===cards.length-1;if(manual)announce.textContent=`Ejemplo de reseña ${current+1} de ${cards.length}`}
 function syncReviewPlayback(){clearInterval(interval);if(!userPaused&&!reduce.matches&&carouselVisible&&!hovering&&!focused&&!document.hidden)interval=setInterval(()=>renderReview(current+1),6500);play.textContent=userPaused?'▶':'Ⅱ';play.setAttribute('aria-label',userPaused?'Activar carrusel':'Pausar carrusel');play.setAttribute('aria-pressed',String(userPaused))}
 previous.addEventListener('click',()=>{renderReview(current-1,true);syncReviewPlayback()});next.addEventListener('click',()=>{renderReview(current+1,true);syncReviewPlayback()});dots.forEach((dot,i)=>dot.addEventListener('click',()=>{renderReview(i,true);syncReviewPlayback()}));play.addEventListener('click',()=>{userPaused=!userPaused;syncReviewPlayback()});
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();renderReview(Math.min(current+1,cards.length-1),true)}else if(event.key==='ArrowLeft'){event.preventDefault();renderReview(Math.max(current-1,0),true)}});
 carousel.addEventListener('pointerenter',()=>{hovering=true;syncReviewPlayback()});carousel.addEventListener('pointerleave',()=>{hovering=false;syncReviewPlayback()});carousel.addEventListener('focusin',()=>{focused=true;syncReviewPlayback()});carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;syncReviewPlayback()}});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{carouselVisible=entries[0].isIntersecting;syncReviewPlayback()},{threshold:.2}).observe(carousel);else carouselVisible=true;
 reduce.addEventListener('change',syncReviewPlayback);document.addEventListener('visibilitychange',syncReviewPlayback);renderReview(0);syncReviewPlayback();
})();





// Loop the new service film and extend the banner's actual red backdrop.
(()=>{
 const mediaReduced=matchMedia('(prefers-reduced-motion: reduce)');
 const webVideo=document.querySelector('.web-service-video'),banner=document.querySelector('.reviews-video'),reviewSection=document.querySelector('#resenas');
 const sample=document.createElement('canvas');sample.width=1;sample.height=1;const sampleContext=sample.getContext('2d',{willReadFrequently:true});
 function sampleWebBlue(){if(webVideo.readyState<2)return;sampleContext.drawImage(webVideo,webVideo.videoWidth*.94,webVideo.videoHeight*.5,1,1,0,0,1,1);const pixel=sampleContext.getImageData(0,0,1,1).data;const blue=`rgb(${pixel[0]} ${pixel[1]} ${pixel[2]})`;webVideo.closest('.service').style.setProperty('--web-blue',blue);document.documentElement.style.setProperty('--web-blue',blue)}
 const backdrop=document.createElement('canvas');backdrop.className='reviews-backdrop';backdrop.setAttribute('aria-hidden','true');backdrop.width=96;backdrop.height=160;reviewSection.prepend(backdrop);const backdropContext=backdrop.getContext('2d',{alpha:false});
 function paintRed(){
  if(banner.readyState<2||!banner.videoWidth)return;
  const section=reviewSection.getBoundingClientRect(),film=banner.getBoundingClientRect();
  if(!section.width||!section.height)return;
  const width=384,height=Math.max(1,Math.round(width*section.height/section.width));
  if(backdrop.width!==width||backdrop.height!==height){backdrop.width=width;backdrop.height=height}
  const scale=width/section.width,x=(film.left-section.left)*scale,y=(film.top-section.top)*scale,w=film.width*scale,h=film.height*scale;
  // Extend the clean right edge with its original vertical lighting, then the
  // top row above the film. Both joins match the source frame at the same point.
  backdropContext.drawImage(banner,banner.videoWidth-3,0,1,1,0,0,width,height);
  backdropContext.drawImage(banner,banner.videoWidth-3,0,1,banner.videoHeight,0,y,width,h);
  if(y>0)backdropContext.drawImage(banner,0,0,banner.videoWidth,1,x,0,w,y+1);

 }
 for(const film of [banner]){film.muted=true;film.loop=true;const sync=()=>{if(mediaReduced.matches){film.pause();film.controls=true}else{film.controls=false;film.play().catch(()=>{})}};film.addEventListener('loadeddata',sync);mediaReduced.addEventListener('change',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});sync()}
 webVideo.addEventListener('loadeddata',sampleWebBlue);sampleWebBlue();banner.addEventListener('loadeddata',paintRed);paintRed();banner.addEventListener('seeked',paintRed);
 if('requestVideoFrameCallback'in banner){const paint=()=>{paintRed();banner.requestVideoFrameCallback(paint)};banner.requestVideoFrameCallback(paint)}else banner.addEventListener('timeupdate',paintRed);
})();



// The fan responds to pointer/focus; on mobile the selectors follow native swiping.
(()=>{
 const gallery=document.querySelector('.project-grid'),projects=[...gallery.querySelectorAll('.project')],buttons=[...document.querySelectorAll('[data-project-index]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)');
 let frame,current=1;
 function highlight(index){current=index;projects.forEach((project,i)=>project.classList.toggle('is-featured',i===index));buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)))}
 function select(index){highlight(index);if(mobile.matches)gallery.scrollTo({left:projects[index].offsetLeft-projects[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'})}
 function reflect(){frame=null;if(!mobile.matches)return;let index=0,distance=Infinity;projects.forEach((project,i)=>{const delta=Math.abs(project.getBoundingClientRect().left-gallery.getBoundingClientRect().left);if(delta<distance){index=i;distance=delta}});highlight(index)}
 buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
 projects.forEach((project,index)=>{project.addEventListener('pointerenter',event=>{if(!mobile.matches&&event.pointerType==='mouse')highlight(index)});project.addEventListener('focus',()=>select(index))});
 gallery.addEventListener('scroll',()=>{if(!frame&&mobile.matches)frame=requestAnimationFrame(reflect)},{passive:true});
 gallery.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();select(event.key==='Home'?0:event.key==='End'?projects.length-1:Math.max(0,Math.min(projects.length-1,current+(event.key==='ArrowRight'?1:-1))))});
 mobile.addEventListener('change',()=>{gallery.scrollLeft=0;highlight(mobile.matches?0:1)});
 highlight(mobile.matches?0:1);
})();

(()=>{
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const root=document.documentElement,backToTop=document.querySelector('.back-to-top');
 let progressFrame=0;
 function updateProgress(){progressFrame=0;const travel=root.scrollHeight-innerHeight;root.style.setProperty('--page-progress',String(travel>0?Math.min(1,Math.max(0,scrollY/travel)):0));backToTop.hidden=!!document.querySelector('#page-preloader')||scrollY<Math.max(550,innerHeight*.7)}
 addEventListener('scroll',()=>{if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress)},{passive:true});addEventListener('resize',updateProgress);addEventListener('colorclik:ready',updateProgress);updateProgress();
 const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
 function closeMobileMenu(restoreFocus=false){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menú');if(restoreFocus)menuButton.focus()}
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMobileMenu(true)}});
 document.addEventListener('pointerdown',event=>{if(nav.classList.contains('open')&&!nav.contains(event.target)&&!menuButton.contains(event.target))closeMobileMenu()});
 const desktop=matchMedia('(min-width:701px)');desktop.addEventListener('change',()=>{if(desktop.matches)closeMobileMenu()});
 const links=Array.from(nav.querySelectorAll('a[href^="#"]'));
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;links.forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}},{rootMargin:'-15% 0px -60% 0px',threshold:0});document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section))}
 // A real video character stays intact: existing directional frames are retained.
 // Native smooth scrolling already supplies transitions without scroll interception.
 const gif=document.querySelector('.service-marketing>img');
 if(gif){const animatedSource=gif.getAttribute('src');function syncGif(){gif.src=reducedMotion.matches?'assets/character-poster.png':animatedSource}reducedMotion.addEventListener('change',syncGif);syncGif()}
})();


// Scroll-linked reveals stay visible for the entire approach to each section.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const selectors=['.about-copy > *','.services .section-heading > *','.service-grid > .service','.projects .section-heading > *','.project-grid > .project','.reviews-carousel','.contact > div > *'];
 const elements=[...document.querySelectorAll(selectors.join(','))].filter(element=>element.id!=='quote');
 if(!elements.length||!elements[0].animate)return;
 let tracks=[],raf=0;
 function layoutTop(element){let top=0;for(let node=element;node;node=node.offsetParent)top+=node.offsetTop;return top}
 function build(){
  tracks.forEach(track=>track.animation.cancel());tracks=[];
  if(reduced.matches)return;
  tracks=elements.map(element=>{
   const siblings=[...element.parentElement.children];
   const index=siblings.indexOf(element);
   const card=element.matches('.service,.project');
   const animation=element.animate([
    {opacity:.06,transform:`translateY(${card?90:60}px) scale(${card ? .93 : .98})`},
    {opacity:1,transform:'translateY(0px) scale(1)'}
   ],{duration:1000,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'});
   animation.pause();
   return {element,animation,top:layoutTop(element),stagger:Math.min(index,4)*24};
  });
  update();
 }
 function update(){
  raf=0;if(reduced.matches)return;
  const scroll=scrollY,height=innerHeight;
  for(const track of tracks){
   const distance=height*.94-(track.top-scroll)-track.stagger;
   const progress=Math.max(0,Math.min(1,distance/Math.max(220,height*.43)));
   track.animation.currentTime=progress*1000;
  }
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(update)}
 function measure(){tracks.forEach(track=>track.top=layoutTop(track.element));schedule()}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);
 addEventListener('load',measure,{once:true});addEventListener('colorclik:ready',measure);
 reduced.addEventListener('change',build);
 // Keyboard focus reveals its complete block immediately.
 elements.forEach(element=>element.addEventListener('focusin',()=>{const track=tracks.find(item=>item.element===element);if(track)track.animation.currentTime=1000}));
 build();
})();



// Extend the original backdrops for the square character service films.
document.querySelectorAll('.service > video').forEach(video=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const card=video.closest('.service');
 const backdrop=document.createElement('canvas');backdrop.className='branding-backdrop';backdrop.setAttribute('aria-hidden','true');video.before(backdrop);
 const context=backdrop.getContext('2d',{alpha:false});
 const cleanPurple=video.classList.contains('custom-service-video');
 const poster=new Image();poster.src=video.poster;
 function paint(){
  const media=video.readyState>=2?video:poster;
  const sourceWidth=media.videoWidth||media.naturalWidth,sourceHeight=media.videoHeight||media.naturalHeight;
  if(!sourceWidth||!card.clientWidth||!card.clientHeight)return;
  const width=320,height=Math.max(1,Math.round(width*card.clientHeight/card.clientWidth));
  if(backdrop.width!==width||backdrop.height!==height){backdrop.width=width;backdrop.height=height}
  const scale=Math.min(width/sourceWidth,height/sourceHeight),filmWidth=sourceWidth*scale,filmHeight=sourceHeight*scale,x=(width-filmWidth)/2,y=height-filmHeight;
  if(cleanPurple){
   // Render the original scene and its extension as one continuous composition.
   context.filter='blur(8px)';
   context.drawImage(media,0,0,sourceWidth,12,-16,-16,width+32,height+32);
   context.filter='none';
   return;
  }
  // Extend only clean border pixels, keeping the film's own lighting at each join.
  context.drawImage(media,0,0,sourceWidth,1,0,0,width,height);
  if(y>0)context.drawImage(media,0,0,sourceWidth,1,x,0,filmWidth,y+1);
  if(x>0){
   context.drawImage(media,0,0,1,1,0,0,x,y+1);
   context.drawImage(media,sourceWidth-1,0,1,1,x+filmWidth,0,x+1,y+1);
   context.drawImage(media,0,0,1,sourceHeight,0,y,x+1,filmHeight);
   context.drawImage(media,sourceWidth-1,0,1,sourceHeight,x+filmWidth-1,y,x+1,filmHeight);
  }
 }
 poster.addEventListener('load',paint);video.addEventListener('loadeddata',paint);
 if('ResizeObserver' in window)new ResizeObserver(paint).observe(card);
 if('requestVideoFrameCallback' in video){const update=()=>{paint();video.requestVideoFrameCallback(update)};video.requestVideoFrameCallback(update)}
 else video.addEventListener('timeupdate',paint);
 function sync(){video.muted=true;video.loop=true;if(reduced.matches)video.pause();else video.play().catch(()=>{})}
 video.addEventListener('loadeddata',sync);reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});sync();
});


// Hover restarts each service from zero. Only one service may play sound.
(()=>{
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 const controllers=[];
 document.querySelectorAll('.service > video').forEach(video=>{
  const card=video.closest('.service'),name=card.dataset.service;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='service-sound';toggle.innerHTML='<span aria-hidden="true">♪</span>';card.append(toggle);
  let request=0;
  function reflect(){const audible=!video.muted;toggle.setAttribute('aria-pressed',String(audible));toggle.setAttribute('aria-label',audible?`Silenciar ${name}`:`Activar sonido de ${name}`);toggle.title=audible?'Silenciar':'Activar sonido';toggle.classList.toggle('is-audible',audible)}
  function silence(){request++;video.muted=true;reflect()}
  async function sound(){
   controllers.forEach(controller=>{if(controller.video!==video)controller.silence()});
   const token=++request;
   try{video.currentTime=0}catch{}
   video.volume=.45;video.muted=false;
   try{await video.play();if(token!==request)video.muted=true}
   catch{if(token===request){video.muted=true;video.play().catch(()=>{})}}
   reflect();
  }
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&finePointer.matches)sound()});
  card.addEventListener('pointerleave',silence);
  toggle.addEventListener('click',()=>{if(video.muted)sound();else silence()});
  toggle.addEventListener('keydown',event=>{if(event.key==='Escape')silence()});
  video.addEventListener('volumechange',reflect);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)silence()});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)silence()}).observe(card);
  controllers.push({video,silence});reflect();
 });
})();


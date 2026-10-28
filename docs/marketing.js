// Page-only interactions reuse the shared header, letter effects, gaze and quote UI.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const loader=document.querySelector('#page-preloader');
 let loaderExit;
 function finish(){if(!loader?.isConnected)return;loader.remove();dispatchEvent(new CustomEvent('colorclik:ready'));}
 if(reduced.matches)finish();else{
  loader.hidden=false;
  loaderExit=setTimeout(()=>{loader.classList.add('is-exiting');setTimeout(finish,820)},900);
  setTimeout(finish,2400);
 }
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(loaderExit);finish()}});

 const marquee=document.querySelector('.marketing-marquee');let marqueeVisible=false;
 function syncMarquee(){marquee.classList.toggle('is-visible',marqueeVisible&&!document.hidden&&!reduced.matches)}
 new IntersectionObserver(entries=>{marqueeVisible=entries[0].isIntersecting;syncMarquee()}).observe(marquee);
 document.addEventListener('visibilitychange',syncMarquee);reduced.addEventListener('change',syncMarquee);

 const revealItems=[...document.querySelectorAll('[data-reveal],.marketing-underline')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('is-drawn');
  if(!reduced.matches&&entry.target.hasAttribute('data-reveal'))entry.target.animate([{opacity:.2,transform:'translateY(28px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
  observer.unobserve(entry.target);
 }),{threshold:.12});revealItems.forEach(item=>observer.observe(item));

 document.querySelectorAll('.offer-toggle').forEach(toggle=>toggle.addEventListener('click',()=>{
  const panel=document.getElementById(toggle.getAttribute('aria-controls'));
  const expanded=toggle.getAttribute('aria-expanded')!=='true';
  toggle.setAttribute('aria-expanded',String(expanded));panel.hidden=!expanded;
  if(expanded&&!reduced.matches)panel.animate([{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});
 }));

 document.querySelector("#service-select").value="Marketing Digital";

 // All plan buttons work with the native quote fallback when React is unavailable.
 document.querySelectorAll('[data-quote]').forEach(trigger=>trigger.addEventListener('click',()=>{
  const dialog=document.querySelector('#quote-dialog');if(dialog.hasAttribute('data-enhanced'))return;
  document.querySelector('#service-select').value='Marketing Digital';
  const plan=trigger.dataset.plan,price=trigger.dataset.price;
  if(plan)document.querySelector('#brief').value=`Me interesa el plan ${plan} (${price} CLP/mes + IVA). Inversión publicitaria no incluida.\n\nMi proyecto: `;
  dialog.showModal();
 }));

 // Muted decorative films run only while visible; touch has no hover dependency.
 const films=[...document.querySelectorAll('[data-ambient],.about-video')];
 const visibility=new Map(films.map(video=>[video,false]));
 function syncVideo(video){if(visibility.get(video)&&!document.hidden&&!reduced.matches){video.muted=true;video.loop=true;video.play().catch(()=>{})}else video.pause();}
 const filmObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{visibility.set(entry.target,entry.isIntersecting);syncVideo(entry.target)}),{threshold:.12});
 films.forEach(video=>{video.removeAttribute('autoplay');filmObserver.observe(video)});
 document.addEventListener('visibilitychange',()=>films.forEach(syncVideo));reduced.addEventListener('change',()=>films.forEach(syncVideo));
})();

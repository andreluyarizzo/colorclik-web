const menuButton=document.querySelector('.menu-toggle'),navigation=document.querySelector('#navigation');
menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menú')}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Build text spans without interpreting reference text as HTML or changing its semantics.
document.querySelectorAll('[data-letters]').forEach(heading=>{heading.setAttribute('aria-label',heading.innerText.replace(/\n/g,' '));let index=0;function split(node){Array.from(node.childNodes).forEach(child=>{if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return}const group=document.createElement('span');group.className='word';group.setAttribute('aria-hidden','true');Array.from(word).forEach(letter=>{const span=document.createElement('span');span.className='letter';span.style.setProperty('--i',index++);span.textContent=letter;group.append(span)});fragment.append(group)});child.replaceWith(fragment)}else if(child.nodeType===Node.ELEMENT_NODE){split(child)}})}split(heading);if(!reduced.matches)heading.classList.add('letters-pending')});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('letters-pending');entry.target.classList.add('letters-in');observer.unobserve(entry.target)}}),{threshold:.15});document.querySelectorAll('[data-letters]').forEach(h=>observer.observe(h))}else document.querySelectorAll('.letters-pending').forEach(h=>h.classList.remove('letters-pending'));
const quoteDialog=document.querySelector('#quote-dialog'),serviceSelect=document.querySelector('#service-select');document.querySelector('#quote').addEventListener('click',()=>{if(!quoteDialog.hasAttribute('data-enhanced'))quoteDialog.showModal()});document.querySelectorAll('dialog .close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
document.querySelector('#brief-form').addEventListener('submit',event=>{event.preventDefault();const file=new Blob([`COLORCLIK — Mi proyecto\n\nServicio: ${serviceSelect.value}\n\n${document.querySelector('#brief').value}\n`],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download='mi-idea-colorclik.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});







// Shared hover treatment: expanding dot, sliding label, and incoming arrow.
document.querySelectorAll('.pill:not(#quote)').forEach(control=>{
 const label=control.textContent.replace(/[→↗↓]/g,'').trim();
 control.classList.add('interactive-hover');if(!control.hasAttribute('aria-label'))control.setAttribute('aria-label',label);
 const dot=document.createElement('span');dot.className='hover-dot';dot.setAttribute('aria-hidden','true');
 const text=document.createElement('span');text.className='hover-label';text.textContent=label;
 const incoming=document.createElement('span');incoming.className='hover-incoming';incoming.setAttribute('aria-hidden','true');
 const nextText=document.createElement('span');nextText.textContent=label;
 const arrow=document.createElement('span');arrow.className='hover-arrow';arrow.textContent=control.matches('button[type="submit"]')?'↓':'→';
 incoming.append(nextText,arrow);control.replaceChildren(dot,text,incoming);
});
// Keep the supplied studio animation looping, including when scrolling away.
const aboutVideo=document.querySelector('.about-video');
function syncAboutVideo(){if(!aboutVideo||document.body.classList.contains("marketing-page"))return;aboutVideo.muted=true;aboutVideo.loop=true;if(reduced.matches){aboutVideo.pause();aboutVideo.controls=true}else{aboutVideo.play().catch(()=>{aboutVideo.controls=true})}}
aboutVideo?.addEventListener('loadeddata',syncAboutVideo);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncAboutVideo()});
reduced.addEventListener('change',syncAboutVideo);syncAboutVideo();

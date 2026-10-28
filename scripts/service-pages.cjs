const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const data=require('../src/data/remaining-services.json');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(paths,viewBox='0 0 24 24')=>`<svg viewBox="${viewBox}" aria-hidden="true">${paths}</svg>`;
const arrow=svg('<path d="M5 12h14m-6-6 6 6-6 6"/>');
const next=svg('<path d="m9 5 7 7-7 7"/>');
const icons={
 spark:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/>',
 pen:'<path d="m12 3 8 12-8 6-8-6Zm0 0v10m-3 5h6"/><circle cx="12" cy="14" r="1.5"/>',
 book:'<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4m-3 14h2"/>',
 people:'<circle cx="12" cy="7" r="3"/><circle cx="4" cy="9" r="2"/><circle cx="20" cy="9" r="2"/><path d="M6 21v-3a6 6 0 0 1 12 0v3Zm-4-2v-3a3 3 0 0 1 3-3m17 6v-3a3 3 0 0 0-3-3"/>',
 code:'<path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18"/>',
 gear:'<path d="m9 3-1 3-3 1-2 4 2 3v3l4 3 3-1 3 1 4-3v-3l2-3-2-4-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
 share:'<circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="m8 11 8-5m-8 7 8 5"/>',
 rocket:'<path d="M14 10c2-4 5-5 7-5 0 3-1 6-5 8l-3 1-3-3 1-3 3-1m0 3 2 2M10 9l-4 1-2 4 5 1m6-1-1 5-4 2-1-5m-4 3-2 2"/>',
 diamond:'<path d="m3 8 9 13 9-13-4-5H7ZM3 8h18M7 3l5 18 5-18"/>',
 star:'<path d="m12 2 3 6.5 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
 send:'<path d="m3 10 19-8-7 20-4-8Zm19-8L11 14m0 0-2 6"/>',
 puzzle:'<path d="M4 4h5a3 3 0 1 1 6 0h5v5a3 3 0 1 0 0 6v5h-5a3 3 0 1 0-6 0H4v-5a3 3 0 1 1 0-6Z"/>',
 cube:'<path d="m12 2 10 5v10l-10 5-10-5V7Zm0 10v10M2 7l10 5 10-5M7 4l10 5"/>',
 growth:'<path d="M4 21V14h4v7m2 0V8h4v13m2 0V2h4v19"/>'
};
function renderHeader(page){
 let header=read('src/templates/header.html').trim();
 if(page==='estudio.html')header=header.replace('href="#servicios"','href="index.html#servicios"');
 return header.replace(`href="${page}"><strong>`,`href="${page}" aria-current="page"><strong>`).replace(`href="${page}"><small>`,`href="${page}" aria-current="page"><small>`);
}
function quoteButton(s,text,extra='',className='pill dark'){
 return `<button type="button" class="${escape(className)}" data-quote data-quote-service="${escape(s.service)}" ${extra}>${escape(text)} <span>↗</span></button>`;
}
function hero(s){
 const aside=s.customHero?`<h2 data-letters>TU IDEA<br><span class="marketing-promise">EMPIEZA AQUÍ.</span></h2><ul class="hero-idea-list">${['Ideas','Automatización','Integraciones','Inteligencia artificial'].map(item=>`<li>${escape(item)}<span aria-hidden="true">✓</span></li>`).join('')}</ul>`:`<h2 data-letters>${escape(s.promise[0])}<br><span class="marketing-promise">${escape(s.promise[1])}</span></h2><p>${escape(s.starting)}</p><a class="pill dark" href="#planes">Ver planes <span>↗</span></a>`;
 return `<section class="hero marketing-hero ${s.customHero?'custom-hero':''}" id="inicio" aria-labelledby="service-title"><div class="service-hero-film" aria-hidden="true"><div class="service-film-stage"><img class="service-film-poster" src="assets/${s.key}/hero-motion-poster.webp" width="1280" height="720" alt="" fetchpriority="high"><video class="service-hero-video" data-start="${s.start||1}" data-desktop="assets/${s.key}/hero-motion.mp4" data-mobile="assets/${s.key}/hero-motion-mobile.mp4" poster="assets/${s.key}/hero-motion-poster.webp" muted loop playsinline preload="none" disablepictureinpicture></video></div></div><button type="button" class="service-hero-pause" aria-label="Pausar animación del hero" aria-pressed="false" hidden>${svg('<path d="M8 5v14M16 5v14"/>')}</button><div class="hero-inner"><div class="hero-title"><h1 id="service-title" data-letters><strong>${escape(s.title[0])}</strong><br><span class="headline-light">${escape(s.title[1])}</span></h1><p class="marketing-hero-description">${escape(s.description)}</p>${s.customHero?quoteButton(s,'Cuéntanos tu idea'):''}</div><div class="hero-intro">${aside}</div></div><a class="hero-scroll-cue" href="#direccion" aria-label="Descubre nuestro enfoque"><span>Desliza para descubrir</span><span class="scroll-cue-icon" aria-hidden="true">↓</span></a></section>`;
}
function direction(s){const [w,h]=s.dimensions.pointing;return `<section class="about marketing-direction" id="direccion" aria-labelledby="direction-title"><div class="about-copy"><p class="eyebrow">IDEAS CON PERSONALIDAD</p><h2 id="direction-title" data-letters>${escape(s.directionTitle[0])}<br><em class="marketing-underline">${escape(s.directionTitle[1])}</em></h2><p>${escape(s.directionCopy)}</p><a class="pill dark" href="#servicios">Descubre lo que podemos crear <span>↗</span></a></div><div class="about-media service-direction-art"><span class="service-art-note" aria-hidden="true">${escape(s.artNote)}${svg('<path d="M8 5c40 0 48 13 51 35m-10-8 11 10 10-10"/>','0 0 90 50')}</span><img src="assets/${s.key}/pointing.webp" width="${w}" height="${h}" alt="Personaje de ${escape(s.service)} señalando nuestra propuesta" loading="lazy"></div></section>`;}
function offers(s){const [w,h]=s.dimensions.feature;return `<section class="marketing-services marketing-section" id="servicios" aria-labelledby="services-title"><div class="marketing-heading"><p class="eyebrow">NUESTROS SERVICIOS</p><h2 id="services-title" data-letters>${escape(s.servicesTitle[0])} <em>${escape(s.servicesTitle[1])}</em></h2></div><div class="marketing-offers">${s.offers.map((offer,i)=>`<article class="marketing-offer ${i===0?'marketing-meta':''}" data-reveal>${i===0?`<div class="marketing-meta-art"><img src="assets/${s.key}/feature.webp" width="${w}" height="${h}" alt="Personaje original de ${escape(s.service)} trabajando en una idea" loading="lazy"></div>`:''}<div class="marketing-offer-copy"><span class="offer-icon" aria-hidden="true">${svg(icons[offer.icon])}</span><h3>${escape(offer.name)}</h3><p>${escape(offer.copy)}</p><button class="offer-toggle" type="button" aria-expanded="false" aria-controls="offer-${i}" aria-label="Conocer más sobre ${escape(offer.name)}">${next}</button></div><div class="offer-detail" id="offer-${i}" hidden><p>${escape(offer.detail)}</p><a href="#planes">Explorar planes →</a></div></article>`).join('')}</div></section>`;}
function ticker(s){return `<div class="marketing-marquee" aria-label="${escape(s.ticker.join(', '))}"><div class="marketing-marquee-track" aria-hidden="true">${Array.from({length:3},()=>s.ticker.map(word=>`<span>${escape(word)}</span><i>•</i>`).join('')).join('')}</div></div>`;}
function pricing(s){return `<section class="marketing-pricing marketing-section" id="planes" aria-labelledby="plans-title"><div class="marketing-heading"><p class="eyebrow">PLANES DE ${escape(s.service.toUpperCase())}</p><h2 id="plans-title" data-letters>${escape(s.plansTitle[0])} <em>${escape(s.plansTitle[1])}</em></h2></div><div class="marketing-plans">${s.plans.map((plan,i)=>`<article class="marketing-plan ${i===1?'is-recommended':''}" data-reveal>${i===1?'<span class="plan-badge">RECOMENDADO</span>':''}<div class="plan-heading"><span class="plan-icon" aria-hidden="true">${svg(icons[plan.icon])}</span><div><h3>${escape(plan.name)}</h3><p>${escape(plan.subtitle)}</p></div></div><p class="plan-price">$${escape(plan.price)}</p><p class="plan-currency">${escape(s.billing)}</p><ul>${plan.features.map(feature=>`<li><span aria-hidden="true">✓</span>${escape(feature)}</li>`).join('')}</ul>${quoteButton(s,`Elegir ${plan.name}`,`data-plan="${escape(plan.name)}" data-price="$${escape(plan.price)}" data-billing="${escape(s.billing)}" data-plan-note="${escape(s.note+' '+s.subnote)}" aria-label="Elegir plan ${escape(plan.name)}"`,'pill dark plan-select')}</article>`).join('')}</div><p class="marketing-price-note"><strong>${escape(s.note)}</strong><br>${escape(s.subnote)}</p></section>`;}
function processSection(s){return `<section class="marketing-process" id="proceso" aria-labelledby="process-title"><h2 class="eyebrow" id="process-title">NUESTRO PROCESO</h2><ol>${s.process.map(([name,copy],i)=>`<li data-reveal><span class="process-number">0${i+1}</span><div><h3>${escape(name)}</h3><p>${escape(copy)}</p></div><span class="process-arrow" aria-hidden="true">↗</span></li>`).join('')}</ol></section>`;}
function faq(s){return `<section class="marketing-faq marketing-section" id="preguntas" aria-labelledby="faq-title"><div><p class="eyebrow">PREGUNTAS FRECUENTES</p><h2 id="faq-title" data-letters>¿Hacemos<br><em class="marketing-underline">clik?</em></h2></div><div class="marketing-faq-list">${s.faq.map(([q,a])=>`<details><summary>${escape(q)}<span aria-hidden="true">+</span></summary><p>${escape(a)}</p></details>`).join('')}</div></section>`;}
function contact(s){const [w,h]=s.dimensions.contact;return `<section class="contact section" id="contacto"><div><p class="eyebrow">¿TIENES UN PROYECTO EN MENTE?</p><h2 data-letters>Hagamos <em>clik</em> juntos.</h2><p>Cuéntanos tu proyecto y creemos algo increíble.</p><button class="pill" id="quote" data-quote-service="${escape(s.service)}"><span>${escape(s.cta)}</span>${arrow}</button></div><img id="contact-character" src="assets/${s.key}/contact.webp" width="${w}" height="${h}" alt="Personaje original de ${escape(s.service)} apoyado entre las secciones" loading="lazy"></section>`;}
function renderServicePages(){
 const template=read('src/templates/service-page.html');
 for(const s of data){const values={TITLE:s.service+' | ColorClik',DESCRIPTION:s.description,COLOR:s.color,THEME:s.theme,SERVICE:s.service,HEADER:renderHeader(s.slug+'.html'),FOOTER:read('src/templates/footer.html').trim(),CONTENT:[hero(s),direction(s),offers(s),ticker(s),pricing(s),processSection(s),faq(s),contact(s)].join('\n')};
 const html=template.replace(/\{\{([A-Z]+)\}\}/g,(_,key)=>['HEADER','CONTENT','FOOTER'].includes(key)?values[key]:escape(values[key]));
 fs.writeFileSync(path.join(root,'docs',s.slug+'.html'),html);
 }
}
module.exports={renderServicePages,renderHeader,pages:['estudio.html','index.html','marketing-digital.html','desarrollo-web.html',...data.map(s=>s.slug+'.html')]};

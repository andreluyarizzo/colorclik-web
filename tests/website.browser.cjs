const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');
const root = path.join(__dirname, '..');
const port = 4287;
const base = `http://127.0.0.1:${port}`;
const pages = ['index','marketing-digital','desarrollo-web','branding-diseno','redes-contenido','soluciones-medida','estudio','proyectos','contacto','privacidad'];
const services = ['marketing-digital','desarrollo-web','branding-diseno','redes-contenido','soluciones-medida'];
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
(async () => {
 const server = spawn(process.execPath, ['preview.cjs'], {cwd:root,env:{...process.env,COLORCLIK_PORT:String(port)},stdio:'ignore'});
 let browser;
 try {
  for(let attempt=0;;attempt++){
   try{if((await fetch(base)).ok)break}catch{}
   if(attempt>50)throw new Error('Preview server did not start');
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
  const evidence=[];
  for(const width of [320,768,1440]){
   const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   let errors=[];page.on('pageerror',error=>errors.push(error.message));
   for(const name of pages){
    errors=[];const response=await page.goto(`${base}/${name}.html`,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,name);assert.deepEqual(errors,[],name);
    assert.match(response.headers()['content-security-policy'], /frame-ancestors 'none'/);
    assert.equal(response.headers()['x-content-type-options'],'nosniff');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`${name}: overflow at ${width}`);
    assert.equal(await page.locator('#page-preloader').count(),0);
    await page.evaluate(axe);
    const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
    assert.deepEqual(violations,[],`${name}: accessibility at ${width}`);
    evidence.push(`${name}@${width}`);
   }
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  // Portraits open service details; every CTA opens the corresponding plans.
  for(let i=0;i<services.length;i++){
   await page.goto(base,{waitUntil:'networkidle'});
   const portrait=page.locator('.service-avatars a').nth(i);
   assert.equal(await portrait.getAttribute('href'),services[i]+'.html');
   await portrait.focus();
   const cta=page.locator('.scene:not([hidden]) .scene-cta');
   assert.equal((await cta.innerText()).trim(),'Ver planes');
   await cta.click();
   await page.waitForURL(`${base}/${services[i]}.html#planes`);
   assert.equal(await page.locator('#planes').count(),1);
  }
  for(const service of services){
   await page.goto(`${base}/${service}.html`,{waitUntil:'networkidle'});
   const triggers=page.locator('[data-quote][data-plan]');
   for(let i=0;i<await triggers.count();i++){
    const trigger=triggers.nth(i),expected=await trigger.getAttribute('data-plan');
    await trigger.click();await page.locator('[role=dialog]').waitFor();
    assert.equal(await page.locator('input[name=plan]:checked').inputValue(),expected);
    await page.keyboard.press('Escape');await page.locator('[role=dialog]').waitFor({state:'detached'});
    await page.waitForFunction(el=>document.activeElement===el,await trigger.elementHandle());
   }
  }
  // Drafts survive dismissing the modal, but an explicit restart clears them.
  await page.locator('[data-quote][data-plan]').first().click();
  const text='<img src=x onerror=alert(1)> Necesito una web para mi negocio.';
  await page.locator('#quote-brief').fill(text);
  await page.keyboard.press('Escape');await page.locator('[role=dialog]').waitFor({state:'detached'});
  await page.locator('[data-quote][data-plan]').first().click();
  assert.equal(await page.locator('#quote-brief').inputValue(),text);
  await page.locator('input[name=goal]').first().check();await page.locator('#quote-answer').selectOption({index:1});
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.locator('#quote-name').fill('Auditoría');await page.locator('#quote-email').fill('invalido');
  await page.getByRole('button',{name:'Ver mi resumen'}).click();
  assert.equal(await page.locator('.quote-summary').count(),0,'Invalid email must not advance');
  await page.locator('#quote-email').fill('auditoria@example.com');await page.getByRole('button',{name:'Ver mi resumen'}).click();
  assert.match(await page.locator('.quote-summary').innerText(),/onerror=alert/);
  assert.equal(await page.locator('.quote-summary img').count(),0,'User input must remain plain text');
  await page.evaluate(()=>{window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null};Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('Unavailable'))}})});
  await page.getByRole('button',{name:'Enviar por WhatsApp'}).click();
  const opened=await page.evaluate(()=>window.__opened);
  assert.equal(new URL(opened[0][0]).hostname,'wa.me');assert.equal(new URL(opened[0][0]).searchParams.get('text').includes(text),true);
  await page.getByRole('button',{name:'Copiar mensaje'}).click();await page.locator('#quote-copy').waitFor();
  assert.match(await page.locator('#quote-copy').inputValue(),/hola@colorclik.cl/);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar solicitud'}).click();
  assert.equal((await download).suggestedFilename(),'solicitud-colorclik.txt');
  await page.getByRole('button',{name:'Empezar de nuevo'}).click();assert.equal(await page.locator('.quote-service-picker').isVisible(),true);
  await page.keyboard.press('Escape');
  // The embedded contact flow still mounts immediately and has no modal dependency.
  await page.goto(`${base}/contacto.html`,{waitUntil:'networkidle'});assert.equal(await page.locator('.contact-wizard').isVisible(),true);
  // With JavaScript disabled all service destinations remain reachable on a phone.
  const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await nojs.goto(base);assert.equal(await nojs.locator('#navigation').isVisible(),true);
  assert.equal(await nojs.locator('.menu-toggle').isVisible(),false);
  for(const service of services)assert.equal(await nojs.locator(`.nav-fallback-services a[href="${service}.html"]`).isVisible(),true);
  // A failed optional module keeps native quoting and direct contact usable.
  const fallbackPage=await browser.newPage();
  await fallbackPage.route('**/chunks/quote-*.js', route=>route.abort());
  await fallbackPage.goto(`${base}/desarrollo-web.html`,{waitUntil:'networkidle'});
  await fallbackPage.locator('[data-quote][data-plan]').first().click();
  await fallbackPage.locator('#quote-dialog[open]').waitFor();
  await fallbackPage.goto(`${base}/contacto.html`,{waitUntil:'networkidle'});
  await fallbackPage.getByRole('alert').waitFor();
  assert.equal(await fallbackPage.locator('.contact-direct a[href="mailto:hola@colorclik.cl"]').isVisible(),true);
  // No automatic interaction may turn audio on.
  const motion=await browser.newPage({viewport:{width:390,height:844}});
  await motion.goto(base);await motion.mouse.move(200,250);
  await motion.waitForFunction(()=>document.querySelector('.hero').dataset.gaze==='tracking');
  await motion.locator('#resenas').scrollIntoViewIfNeeded();await motion.locator('.reviews-video-play').click();
  assert.equal(await motion.locator('.reviews-video').evaluate(video=>video.muted),true);
  console.log(`PASS: ${evidence.length} page/viewport accessibility scans, 5 service routes, 15 plan selections, draft, validation, safe rendering, contact fallbacks, no-JS navigation and muted media.`);
 } finally {await browser?.close();server.kill()}
})().catch(error=>{console.error(error);process.exitCode=1});

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const esbuild = require('esbuild');
const root = path.join(__dirname, '..', 'docs');
const navigationInit = "document.documentElement.classList.add('navigation-ready')";
const navigationHash = crypto.createHash('sha256').update(navigationInit).digest('base64');
const contentSecurityPolicy = `default-src 'self'; script-src 'self' 'sha256-${navigationHash}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'`;
const images = {
 'assets/about-green-original.png': 'about-green',
 'assets/branding/showcase-original.png': 'branding-showcase',
 'assets/custom/showcase-original.png': 'custom-showcase',
 'assets/contact-character-corrected.png': 'contact-character',
 'assets/reviews-presenter-poster.png': 'reviews-poster',
 'assets/marketing/hero.webp': 'marketing-hero',
 'assets/web/hero.webp': 'web-hero',
 'assets/social/hero.webp': 'social-hero',
 'assets/projects-character.webp': 'projects-character',
 'assets/marketing/pointing.webp': 'marketing-pointing',
 'assets/web/pointing.webp': 'web-pointing',
 'assets/branding/pointing.webp': 'branding-pointing',
 'assets/social/pointing.webp': 'social-pointing',
 'assets/custom/pointing.webp': 'custom-pointing'
};
function optimizePage(html) {
 html = html.replace(/<link\b[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g, '');
 html = html.replace(/src="assets\/image-2.png"/g, 'src="assets/optimized/logo.webp"');
 html = html.replace(/src="assets\/(marketing|web|branding|social|custom)-poster.webp"/g, 'src="assets/optimized/$1-avatar.webp" loading="lazy" decoding="async"');
 html = html.replace(/<div id="page-preloader"[\s\S]*?<div class="preloader-progress"><\/div><\/div><\/div>/g, '');
 if (!html.includes('href="quality.css')) html = html.replace('</head>', '<link rel="stylesheet" href="quality.css"></head>');
 if (!html.includes('rel="icon"')) html = html.replace('</head>', '<link rel="icon" href="favicon.svg" type="image/svg+xml"></head>');
 html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');
 html = html.replace(/<script data-navigation-init>[\s\S]*?<\/script>/g, '');
 html = html.replace(/<meta charset="utf-8">/, `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}"><script data-navigation-init>${navigationInit}</script>`);
 if (!html.includes('name="referrer"')) html = html.replace('</head>', '<meta name="referrer" content="strict-origin-when-cross-origin"></head>');
 html = html.replace(/<img\b[^>]*>/g, tag => {
   const source = /\bsrc="([^"]+)"/.exec(tag)?.[1];
   // Already optimized output remains stable on subsequent builds.
   const name = images[source] || /assets\/optimized\/(.*)-(?:480|960)\.webp/.exec(source || '')?.[1];
   if (!name) return tag;
   if (!tag.includes('srcset=')) {
     tag = tag.replace(/\bsrc="[^"]*"/, `src="assets/optimized/${name}-960.webp" srcset="assets/optimized/${name}-480.webp 480w, assets/optimized/${name}-960.webp 960w" sizes="(max-width: 700px) 60vw, 35vw"`);
   }
   tag = tag.replace(/\bsizes="[^"]*"/, 'sizes="(max-width: 700px) 60vw, 35vw"');
   if (!tag.includes('decoding=')) tag = tag.replace('<img ', '<img decoding="async" ');
   if (!tag.includes('fetchpriority="high"') && !tag.includes('loading=')) tag = tag.replace('<img ', '<img loading="lazy" ');
   return tag;
 });
 html = html.replace(/poster="assets\/reviews-presenter-poster.png"/g, 'poster="assets/optimized/reviews-poster-960.webp"');
 html = html.replace(/<picture data-service-poster>[\s\S]*?(<img\b[^>]*class="service-film-poster"[^>]*>)<\/picture>/g, '$1');
 html = html.replace(/<img\b[^>]*class="service-film-poster"[^>]*>/g, tag => {
   const key = /src="assets\/(marketing|web|branding|social|custom)\/hero-motion-poster.webp"/.exec(tag)?.[1];
   if (!key) return tag;
   return `<picture data-service-poster><source media="(max-width:700px)" type="image/avif" srcset="assets/optimized/${key}-film-640.avif"><source type="image/avif" srcset="assets/optimized/${key}-film-1280.avif">${tag}</picture>`;
 });
 html = html.replace(/<video\b[^>]*class="service-hero-video"[^>]*>/g, tag => tag.replace(/\sposter="[^"]*"/, ''));
 // Background media should not be fetched before its section is approached.
 html = html.replace(/<video\b[^>]*class="reviews-video"[^>]*>[\s\S]*?<\/video>/g, tag => tag.replace('preload="metadata"', 'preload="none"').replace(/<source src=/g, '<source data-src='));
 html = html.replace(/fetchpriority="high"(?=[^>]*>\s*<div class="scene-copy")/g, 'loading="lazy"');
 // Native lazy loading can fetch images a full section ahead. Keep decorative
 // below-fold artwork out of the initial network queue, with an HTML fallback.
 html = html.replace(/<noscript>[\s\S]*?<\/noscript>|<img\b[^>]*>/g, tag => {
   if (tag.startsWith('<noscript>') || !tag.includes('loading="lazy"') || tag.includes('data-src=') || /\sid=/.test(tag)) return tag;
   const deferred = tag.replace(/\ssrc="[^"]*"/, match => ` data-src=${match.slice(match.indexOf('=') + 1)} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"`).replace(/\ssrcset=/, ' data-srcset=');
   return deferred + `<noscript>${tag}</noscript>`;
 });
 html = html.replace(/<script(?![^>]*type=)[^>]*src="app\.js[^"]*"[^>]*>/g, tag => tag.replace('<script ', '<script type="module" '));
 html = html.replace(/<script src="([^"]+)"/g, '<script defer src="$1"');
 // Cache keys track content, including generated bundles, on static hosting.
 html = html.replace(/\b(src|href)="([\w./-]+\.(?:js|css))(?:\?[^"#]*)?"/g, (match, attr, asset) => {
   const file = path.join(root, asset);
   if (!fs.existsSync(file)) throw new Error(`Missing public asset: ${asset}`);
   const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
   return `${attr}="${asset}?v=${hash}"`;
 });
 return html;
}
function applySiteQuality(pages) {
 fs.writeFileSync(path.join(root, '_headers'), `/*
  Content-Security-Policy: ${contentSecurityPolicy}; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
`);
 for (const page of pages) {
  const file = path.join(root, page);
  let html = optimizePage(fs.readFileSync(file, 'utf8'));
  if (page === 'index.html' && !html.includes('data-hero-preload')) {
    html = html.replace('<head>', '<head><link data-hero-preload rel="preload" as="image" type="image/avif" href="assets/optimized/hero-960.avif" media="(max-width:700px)" fetchpriority="high"><link data-hero-preload rel="preload" as="image" type="image/avif" href="assets/optimized/hero-1600.avif" media="(min-width:701px)" fetchpriority="high">');
  }
  const previous = /<!-- styles: (.*?) -->/.exec(html);
  const sources = previous ? JSON.parse(previous[1]) : [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)(?:\?[^"]*)?">/g)].map(match => match[1]);
  const unique = [...new Set([...sources, 'quality.css'])];
  const css = unique.map(name => fs.readFileSync(path.join(root, name), 'utf8')).join('\n');
  const result = esbuild.transformSync(css, {loader:'css', minify:true, target:'es2020'}).code;
  html = html.replace(/<style data-site-styles>[\s\S]*?<\/style>/g, '');
  html = html.replace(/<!-- styles: .*? -->/g, '').replace(/<link rel="stylesheet" href="[^"]+">/g, '');
  const stylesheet = `<style data-site-styles>${result}</style>`;
  html = html.replace('</head>', `<!-- styles: ${JSON.stringify(unique)} -->${stylesheet}</head>`);
  fs.writeFileSync(file, html);
 }
}
module.exports = {applySiteQuality, optimizePage, contentSecurityPolicy};

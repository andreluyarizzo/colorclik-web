const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const { renderServicePages, renderHeader, pages } = require('./scripts/service-pages.cjs');
renderServicePages();
require('./scripts/studio-page.cjs').renderStudioPage();
require('./scripts/projects-page.cjs').renderProjectsPage();
require('./scripts/contact-page.cjs').renderContactPage();
fs.copyFileSync(path.join(__dirname, 'src/templates/privacy-page.html'), path.join(__dirname, 'docs/privacidad.html'));
const publicPages = [...pages, 'privacidad.html'];

// Render shared navigation and footer into static HTML, without client-side fetches.
const footer = fs.readFileSync(path.join(__dirname, 'src/templates/footer.html'), 'utf8').trim();
for (const page of publicPages) {
  const file = path.join(__dirname, 'docs', page);
  const html = fs.readFileSync(file, 'utf8');
  const marker = /<!-- site-footer:start -->[\s\S]*?<!-- site-footer:end -->/;
  if (!marker.test(html)) throw new Error(`Shared footer marker missing in ${page}`);
  const whatsapp=fs.readFileSync(path.join(__dirname,'src/templates/whatsapp.html'),'utf8').trim();
  const whatsappMarker=/<!-- whatsapp:start -->[\s\S]*?<!-- whatsapp:end -->/;
  const withWhatsApp=whatsappMarker.test(html)?html.replace(whatsappMarker,whatsapp):html.replace('</body>',whatsapp+'</body>');
  fs.writeFileSync(file, withWhatsApp.replace(/<header class="site-header">[\s\S]*?<\/header>/, renderHeader(page)).replace(marker, `<!-- site-footer:start -->${footer}<!-- site-footer:end -->`));
}


const styles = spawnSync(process.execPath, [
  path.join(__dirname, 'node_modules/@tailwindcss/cli/dist/index.mjs'),
  '-i', 'src/styles/ui.css', '-o', 'docs/ui-components.css', '--minify'
], { cwd: __dirname, stdio: 'inherit' });
if (styles.error) throw styles.error;
if (styles.status !== 0) process.exit(styles.status || 1);

const chunksDirectory = path.join(__dirname, 'docs/chunks');
if (fs.existsSync(chunksDirectory)) for (const file of fs.readdirSync(chunksDirectory)) {
  if (/^quote-[A-Z0-9]+\.js$/.test(file)) fs.unlinkSync(path.join(chunksDirectory,file));
}
require('esbuild').buildSync({
  entryPoints: ['src/main.tsx'], bundle: true, minify: true, jsx: 'automatic',
  target: 'es2020', format:'esm', splitting:true, outdir:'docs', entryNames:'app', chunkNames:'chunks/[name]-[hash]', legalComments: 'eof'
});

require('./scripts/site-quality.cjs').applySiteQuality(publicPages);
for (const page of publicPages) fs.rmSync(path.join(__dirname,'docs',page.replace('.html','.bundle.css')), {force:true});

// Share the exact initial contact UI with the browser: no empty form or layout jump.
const ssrFile = path.join(__dirname, '.build/quote-ssr.cjs');
fs.mkdirSync(path.dirname(ssrFile), {recursive:true});
try {
  require('esbuild').buildSync({entryPoints:['src/quote.tsx'],bundle:true,platform:'node',format:'cjs',jsx:'automatic',outfile:ssrFile,external:['react','react/jsx-runtime','react-dom','react-dom/client'],logLevel:'silent'});
  delete require.cache[ssrFile];
  const {Quote} = require(ssrFile);
  const markup = require('react-dom/server').renderToString(require('react').createElement(Quote, {embedded:true}));
  const contactFile = path.join(__dirname, 'docs/contacto.html');
  const contactHtml = fs.readFileSync(contactFile, 'utf8');
  fs.writeFileSync(contactFile, contactHtml.replace(/<div id="contact-app">[\s\S]*?<\/div>/, `<div id="contact-app">${markup}</div>`));
} finally {
  delete require.cache[ssrFile];
  if (fs.existsSync(ssrFile)) fs.unlinkSync(ssrFile);
}

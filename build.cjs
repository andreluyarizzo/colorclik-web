const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Render one shared footer into static HTML; it remains available without JS.
const footer = fs.readFileSync(path.join(__dirname, 'src/templates/footer.html'), 'utf8').trim();
for (const page of ['index.html', 'marketing-digital.html', 'desarrollo-web.html']) {
  const file = path.join(__dirname, 'docs', page);
  const html = fs.readFileSync(file, 'utf8');
  const marker = /<!-- site-footer:start -->[\s\S]*?<!-- site-footer:end -->/;
  if (!marker.test(html)) throw new Error(`Shared footer marker missing in ${page}`);
  fs.writeFileSync(file, html.replace(marker, `<!-- site-footer:start -->${footer}<!-- site-footer:end -->`));
}


const styles = spawnSync(process.execPath, [
  path.join(__dirname, 'node_modules/@tailwindcss/cli/dist/index.mjs'),
  '-i', 'src/styles/ui.css', '-o', 'docs/ui-components.css', '--minify'
], { cwd: __dirname, stdio: 'inherit' });
if (styles.error) throw styles.error;
if (styles.status !== 0) process.exit(styles.status || 1);

require('esbuild').buildSync({
  entryPoints: ['src/main.tsx'], bundle: true, minify: true, jsx: 'automatic',
  target: 'es2020', outfile: 'docs/app.js', legalComments: 'eof'
});

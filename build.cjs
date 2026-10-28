const { spawnSync } = require('node:child_process');
const path = require('node:path');

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

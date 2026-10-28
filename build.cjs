require('esbuild').buildSync({entryPoints:['src/gaze.jsx'],bundle:true,minify:true,outfile:'docs/gaze.js',legalComments:'eof'});

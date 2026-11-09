const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const {contentSecurityPolicy} = require('./scripts/site-quality.cjs');
const root = path.join(__dirname, 'docs');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.mp4':'video/mp4','.gif':'image/gif','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
http.createServer((req, res) => {
 const security = {'Content-Security-Policy':contentSecurityPolicy+"; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','X-Frame-Options':'DENY'};
 for (const [name,value] of Object.entries(security)) res.setHeader(name,value);
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {'Allow':'GET, HEAD'});return res.end()}
 let url,pathname;
 try {url=new URL(req.url,'http://localhost');pathname=decodeURIComponent(url.pathname)} catch {res.writeHead(400);return res.end()}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if (!file.startsWith(root+path.sep)) {res.writeHead(403);return res.end()}
 fs.realpath(file,(realError,realFile)=>{
  if(realError){res.writeHead(404);return res.end('No encontrado')}
  if(!realFile.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
  fs.stat(realFile,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404);return res.end('No encontrado')}
   const extension=path.extname(file);
   const headers={'Content-Type':mime[extension]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':extension==='.html'?'no-cache':url.searchParams.has('v')?'public, max-age=31536000, immutable':'public, max-age=86400'};
   let start=0,end=stat.size-1,status=200;
   if(req.headers.range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end()}
    if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end)}else start=Math.max(0,stat.size-Number(match[2]));
    if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end()}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
   }
   if(status===200&&/\.(html|css|js|svg|txt)$/.test(file)){
    headers.Vary='Accept-Encoding';
    if(/\bgzip\b/.test(req.headers['accept-encoding']||'')){
     const body=zlib.gzipSync(fs.readFileSync(realFile));headers['Content-Encoding']='gzip';headers['Content-Length']=body.length;
     res.writeHead(200,headers);return res.end(req.method==='HEAD'?undefined:body);
    }
   }
   headers['Content-Length']=end-start+1;res.writeHead(status,headers);
   if(req.method==='HEAD')return res.end();
   const stream=fs.createReadStream(realFile,{start,end});stream.on('error',()=>res.destroy());req.on('close',()=>stream.destroy());stream.pipe(res);
  });
 });
}).listen(Number(process.env.COLORCLIK_PORT||4173),process.env.COLORCLIK_HOST||'127.0.0.1',()=>console.log('ColorClik preview ready'));

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webmanifest':'application/manifest+json','.pdf':'application/pdf'};
const server=http.createServer(async (req,res)=>{
  try{
    let path=decodeURIComponent((req.url||'/').split('?')[0]);
    if(path==='/'||path==='') path='/index.html';
    const file=normalize(join(root,path));
    if(!file.startsWith(root)) throw new Error('forbidden');
    let resolved=file;
    let st=statSync(resolved);
    if(st.isDirectory()){
      resolved=join(resolved,'index.html');
      st=statSync(resolved);
    }
    if(!st.isFile()) throw new Error('not found');
    res.writeHead(200,{'Content-Type':types[extname(resolved)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(resolved));
  }catch{ res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found'); }
});
server.listen(port,'127.0.0.1',()=>console.log(`IGERS local server: http://127.0.0.1:${port}/`));

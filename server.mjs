import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { URL } from 'node:url';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webmanifest':'application/manifest+json'};

// Same-origin provider gateway: removes browser CORS dependency without creating an open proxy.
const PROVIDERS = {
  weather: 'https://api.open-meteo.com/',
  usgs: 'https://earthquake.usgs.gov/',
  eonet: 'https://eonet.gsfc.nasa.gov/',
  nasa: 'https://api.nasa.gov/',
  gibs: 'https://gibs.earthdata.nasa.gov/'
};
const MAX_PROXY_BYTES = 8 * 1024 * 1024;
async function providerProxy(req, res, target) {
  const origin = PROVIDERS[target.provider];
  if (!origin) throw new Error('provider not allowed');
  const u = new URL(origin);
  u.pathname = target.pathname;
  for (const [k,v] of target.searchParams) u.searchParams.set(k,v);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let upstream;
  try { upstream = await fetch(u, {signal: controller.signal, headers:{'User-Agent':'IGERS-POWERCORE/1.0'}}); } finally { clearTimeout(timer); }
  if (!upstream.ok) {
    res.writeHead(upstream.status, {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
    res.end(`Upstream ${upstream.status} ${upstream.statusText}`);
    return;
  }
  const len = Number(upstream.headers.get('content-length') || 0);
  if (len > MAX_PROXY_BYTES) throw new Error('upstream response too large');
  const buf = Buffer.from(await upstream.arrayBuffer());
  if (buf.length > MAX_PROXY_BYTES) throw new Error('upstream response too large');
  const ct = upstream.headers.get('content-type') || 'application/octet-stream';
  res.writeHead(200, {'Content-Type':ct,'Cache-Control':'no-store','X-IGERS-Provider':target.provider});
  res.end(buf);
}

const server=http.createServer(async (req,res)=>{
  try{
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
    if (requestUrl.pathname === '/api/provider') {
      const provider=requestUrl.searchParams.get('provider') || '';
      let pathname='', params=new URLSearchParams();
      if(provider==='weather'){
        pathname='/v1/forecast';
        for(const [k,v] of requestUrl.searchParams) if(k!=='provider') params.set(k,v);
      } else if(provider==='usgs'){
        pathname='/earthquakes/feed/v1.0/summary/all_hour.geojson';
      } else if(provider==='eonet'){
        pathname='/api/v3/events/geojson';
        for(const [k,v] of requestUrl.searchParams) if(k!=='provider') params.set(k,v);
      } else if(provider==='nasa'){
        pathname='/planetary/apod';
        for(const [k,v] of requestUrl.searchParams) if(k!=='provider') params.set(k,v);
      } else if(provider==='gibs'){
        pathname='/wms/epsg4326/best/wms.cgi';
        for(const [k,v] of requestUrl.searchParams) if(k!=='provider') params.set(k,v);
      } else {
        res.writeHead(400, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
        res.end(JSON.stringify({ok:false,error:'provider_not_allowed'}));
        return;
      }
      try {
        await providerProxy(req,res,{provider,pathname,searchParams:params});
      } catch (err) {
        res.writeHead(502, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-IGERS-Provider':provider});
        res.end(JSON.stringify({ok:false,error:'UPSTREAM_UNAVAILABLE',provider,message:String(err?.message||err)}));
      }
      return;
    }
    let path=decodeURIComponent(requestUrl.pathname);
    if(path==='/'||path==='') path='/index.html';
    const file=normalize(join(root,path));
    if(!file.startsWith(root)) throw new Error('forbidden');
    const st=statSync(file); if(!st.isFile()) throw new Error('not found');
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(file));
  }catch{ res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found'); }
});
server.listen(port,'127.0.0.1',()=>console.log(`IGERS local server: http://127.0.0.1:${port}/`));

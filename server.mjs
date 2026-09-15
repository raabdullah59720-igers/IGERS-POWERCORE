
import http from 'node:http';
import { readFile, writeFile, mkdir, readdir, unlink, rename } from 'node:fs/promises';
import { statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const dataRoot = join(root, '.data', 'voicemails');
const metaPath = join(dataRoot, 'index.json');
const maxBody = 10 * 1024 * 1024;
const maxAudioBytes = 7 * 1024 * 1024;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webmanifest':'application/manifest+json','.ico':'image/x-icon','.webm':'audio/webm','.ogg':'audio/ogg','.mp4':'audio/mp4'};
const rate = new Map();

await mkdir(dataRoot,{recursive:true});
if(!existsSync(metaPath)) await writeFile(metaPath,'[]','utf8');

function send(res,status,payload,headers={}){ const body=typeof payload==='string'?payload:JSON.stringify(payload); res.writeHead(status,{'Content-Type':typeof payload==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*',...headers}); res.end(body); }
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');}
function safeId(id){return /^[a-f0-9]{24,64}$/.test(id);}
function extForMime(m){ if(String(m).includes('ogg'))return '.ogg'; if(String(m).includes('mp4'))return '.mp4'; if(String(m).includes('wav'))return '.wav'; return '.webm'; }
function mimeAllowed(m){ return ['audio/webm','audio/ogg','audio/mp4','audio/wav','audio/x-wav'].includes(String(m).split(';')[0].toLowerCase()); }
async function readMeta(){try{return JSON.parse(await readFile(metaPath,'utf8'));}catch{return [];}}
async function writeMeta(items){const tmp=metaPath+'.tmp';await writeFile(tmp,JSON.stringify(items,null,2),'utf8');await rename(tmp,metaPath);}
async function readBody(req){return await new Promise((resolve,reject)=>{let total=0;const chunks=[];req.on('data',c=>{total+=c.length;if(total>maxBody){reject(Object.assign(new Error('Request too large'),{status:413}));req.destroy();return;}chunks.push(c);});req.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));req.on('error',reject);});}
function rateAllowed(req){const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').toString().split(',')[0].trim();const now=Date.now();const row=rate.get(ip)||{at:0,count:0};if(now-row.at>300000){row.at=now;row.count=0;} if(row.count>=10)return false;row.count++;rate.set(ip,row);return true;}

const server=http.createServer(async(req,res)=>{
  cors(res);
  try{
    if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
    const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);

    if(url.pathname==='/api/voicemails'&&req.method==='GET'){
      const items=(await readMeta()).filter(x=>safeId(x.id)).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,100).map(({id,createdAt,duration,mimeType})=>({id,createdAt,duration,mimeType}));
      send(res,200,{items});return;
    }
    if(url.pathname==='/api/voicemails'&&req.method==='POST'){
      if(!rateAllowed(req)){send(res,429,{error:'Too many voicemail submissions from this connection. Please try again later.'});return;}
      const raw=await readBody(req); const body=JSON.parse(raw); const audio=String(body.audio||''); const mime=String(body.mimeType||'audio/webm').split(';')[0].toLowerCase();
      if(!audio.startsWith('data:audio/')){send(res,400,{error:'Invalid audio payload.'});return;}
      const match=audio.match(/^data:(audio\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/i); if(!match){send(res,400,{error:'Unsupported audio encoding.'});return;}
      if(!mimeAllowed(mime)){send(res,400,{error:'Unsupported audio format. Use browser-recorded WebM, OGG or MP4 audio.'});return;}
      const buf=Buffer.from(match[2].replace(/\s+/g,''),'base64'); if(!buf.length||buf.length>maxAudioBytes){send(res,413,{error:'Audio file is empty or larger than the 7 MB limit.'});return;}
      const duration=Math.min(60,Math.max(1,Number(body.duration)||1));
      const id=randomBytes(16).toString('hex'); const ext=extForMime(mime); const fileName=id+ext;
      await writeFile(join(dataRoot,fileName),buf,{flag:'wx'});
      const items=await readMeta(); items.unshift({id,createdAt:new Date().toISOString(),duration,mimeType:mime,file:fileName}); await writeMeta(items.slice(0,200));
      send(res,201,{ok:true,id,createdAt:items[0].createdAt,duration});return;
    }
    const m=url.pathname.match(/^\/api\/voicemails\/([a-f0-9]{32})\/audio$/i);
    if(m&&req.method==='GET'){
      const id=m[1].toLowerCase(); const item=(await readMeta()).find(x=>x.id===id); if(!item){send(res,404,'Voice message not found');return;}
      const file=join(dataRoot,item.file); const bytes=await readFile(file); res.writeHead(200,{'Content-Type':types[extname(file)]||item.mimeType||'audio/webm','Content-Length':bytes.length,'Cache-Control':'public, max-age=300','Accept-Ranges':'bytes','Access-Control-Allow-Origin':'*'});res.end(bytes);return;
    }

    let path=decodeURIComponent(url.pathname);
    if(path==='/'||path==='') path='/index.html';
    const file=normalize(join(root,path)); if(!file.startsWith(root)) throw new Error('forbidden');
    const st=statSync(file); if(!st.isFile()) throw new Error('not found');
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Access-Control-Allow-Origin':'*'}); res.end(await readFile(file));
  }catch(err){ if(err?.status){send(res,err.status,{error:err.message});return;} console.error(err); send(res,500,{error:'Server error'}); }
});
server.listen(port,host,()=>console.log(`IGERS server: http://${host}:${port}/`));

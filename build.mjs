import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root=resolve(process.cwd());
const dist=join(root,'dist');
if(existsSync(dist)) rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
const skip=new Set(['node_modules','dist','.git']);
function copyTree(src,dst){
  mkdirSync(dst,{recursive:true});
  for(const name of readdirSync(src)){
    if(skip.has(name)) continue;
    const from=join(src,name), to=join(dst,name), st=statSync(from);
    if(st.isDirectory()) copyTree(from,to); else cpSync(from,to);
  }
}
copyTree(root,dist);
console.log('IGERS static GitHub Pages production build created in dist/');

const CACHE='igers-live-monitor-2026.10.06-3d-pwa.2';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',
  './designer.css','./upgrade-pro.css','./script.js','./designer.js','./upgrade-pro.js','./igers-live-enhancer.js',
  './admin-control.css','./admin-control.js','./igers-advanced-panels-2026-10-03.css','./igers-advanced-panels-2026-10-03.js',
  './satellite-connection-pro.js','./igers-bd-satellite-monitor.css','./igers-bd-satellite-monitor.js',
  './mobile-tower-control.css','./mobile-tower-control.js','./igers-3d-engineering.css','./igers-3d-engineering.js','./magazine/IGERS-BD-01_Professional_Engineering_Magazine.pdf','./IGERS-BD-01-App-Package.zip'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async c=>{
    for(const url of CORE){try{await c.add(url);}catch(_){}}
  }).finally(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('igers-live-monitor-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}return res;
  }).catch(()=>cached)));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||'/IGERS-POWERCORE/';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c){try{c.navigate(url);}catch(_){}return c.focus();}}
    return clients.openWindow(url);
  }));
});

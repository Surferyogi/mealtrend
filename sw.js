// MealTrend service worker
// Network-first for the page itself so a redeployed index.html shows up immediately;
// cache is the offline fallback. Static assets are cache-first.
const C="mealtrend-v11";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png","./favicon-64.png"])).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const url=new URL(e.request.url);
  const isPage = e.request.mode==="navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  if(isPage){
    e.respondWith(fetch(e.request).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return res; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  if(url.origin!==location.origin) return; // fonts etc: let the browser handle
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return res; })));
});

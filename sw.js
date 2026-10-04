/* 하루 문법 — 오프라인 저장. 화면·자료는 인터넷 먼저(고친 게 바로 보이게), 안 되면 저장본 */
const V='haru-grammar-v5';
const CORE=['./','./index.html','./data/all.json','./data/words.json','./data/dialogues.json','./data/gloss.json','./data/words_mid.json','./data/words_adv.json','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE).catch(()=>{})).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys()) if(k!==V) await caches.delete(k); await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.indexOf('/audio/')>=0) return;   // 음성 파일은 브라우저가 직접(구간 요청이라 SW 를 거치면 아이폰에서 안 나올 수 있음)
  e.respondWith((async()=>{
    const c=await caches.open(V);
    try{ const r=await fetch(e.request,{cache:'no-cache'}); if(r&&r.ok) c.put(e.request,r.clone()); return r; }
    catch(err){ return (await c.match(e.request,{ignoreSearch:true})) || new Response('',{status:504}); }
  })());
});

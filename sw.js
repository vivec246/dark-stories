/* Служебный скрипт приложения: сайт можно поставить на телефон, а уже открытые страницы и рассказы читаются без интернета.
   Сеть всегда в приоритете (поэтому обновления сайта приходят сразу), кэш нужен только когда связи нет. */
var CACHE = 'dark-stories-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || /admin/.test(url.pathname)) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});

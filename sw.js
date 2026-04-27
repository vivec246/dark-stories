// Имя нашего кэша. Если захотите обновить, смените v1 на v2.
const CACHE_NAME = 'dark-stories-v1';

// Список самых важных файлов, которые приложение загрузит один раз и запомнит
const urlsToCache = [
  '/dark-stories/',
  '/dark-stories/index.html',
  '/dark-stories/manifest.json',
  '/dark-stories/favicon-16x16.png',
  '/dark-stories/favicon-32x32.png',
  '/dark-stories/apple-touch-icon.png'
];

// Устанавливаем и запоминаем файлы из списка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Отвечаем сохранёнными файлами, если нет интернета
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Обновляем кэш, когда выходит новая версия
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});
/* ЯНДЕКС МЕТРИКА. Включается, только если в админке («Сайт → Статистика») указан номер счётчика (SITE.metrikaId).
   Сайт одностраничный: каждый переход между страницами и рассказами отправляется как отдельный просмотр с названием,
   поэтому в отчёте «Страницы» видно, какие именно рассказы читают. Вебвизор (запись действий) включён флагом SITE.metrikaWebvisor в data.js. Цель «finished» — дочитали до конца (с названием рассказа). */
(function () {
  var id = parseInt(SITE.metrikaId, 10);
  var off = !id || window.parent !== window || /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname);
  if (off) return;
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date();
    k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + id, 'ym');
  ym(id, 'init', { defer: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: SITE.metrikaWebvisor !== false });
  var last = '';
  var baseSetMeta = setMeta;
  setMeta = function (title) {
    baseSetMeta.apply(this, arguments);
    var url = location.href;
    if (url === last) return; last = url;
    ym(id, 'hit', url, { title: title || document.title });
  };
  var done = {};
  window.addEventListener('scroll', function () {
    if (!R || !R.work || done[R.work.slug]) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 400 && window.scrollY / h > 0.92) { done[R.work.slug] = 1; ym(id, 'reachGoal', 'finished', { story: R.work.title }); }
  }, { passive: true });
})();

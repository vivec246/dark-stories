/* ЗАПУСК: переход со старых ссылок ?story=… и первый показ страницы. */

window.addEventListener('hashchange', route);

/* старые ссылки вида ?story=stories/.../file.md → новый адрес */
(function legacy() {
  var s = new URLSearchParams(location.search).get('story');
  if (!s) return;
  var w = WORKS.filter(function (x) { return x.path === s; })[0];
  if (w) history.replaceState(null, '', location.pathname + '#/read/' + w.slug);
})();

route();

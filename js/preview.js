/* ПРЕДПРОСМОТР ИЗ АДМИНКИ. Работает только когда сайт открыт внутри окна админки (admin.html кладёт сюда черновик):
   подменяет список текстов и сами тексты на ещё не опубликованные, а всё остальное — настоящий сайт и настоящая читалка. */
(function () {
  var P = null;
  try { P = window.parent !== window ? window.parent.__DS_PREVIEW : null; } catch (e) {}
  if (!P) return;
  WORKS = P.WORKS; SITE = P.SITE;
  var realFetch = fetchText;
  fetchText = function (path) {
    if (Object.prototype.hasOwnProperty.call(P.texts, path)) return Promise.resolve(P.texts[path]);
    return realFetch(path);
  };
  document.documentElement.classList.add('ds-preview');
})();

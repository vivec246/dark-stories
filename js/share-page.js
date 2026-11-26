/* СТРАНИЦА ДЛЯ ШАРИНГА: s/<slug>.html. Мессенджеры (Telegram, ВК) не выполняют скрипты и не видят часть ссылки после «#»,
   поэтому для каждого текста лежит маленькая страница с его названием, описанием и обложкой в метатегах.
   Человека она сразу перекидывает в читалку. Подключается и в админке, и в tools/make-share-pages.js. */
function sharePageHtml(w, siteName, base) {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var url = base + 's/' + w.slug + '.html';
  var img = base + 's/' + w.slug + '.jpg';   /* карточка-«книга» или «газета», её рисует админка */
  var title = w.title + ' — ' + siteName;
  var desc = w.description || '';
  var go = w.status === 'soon' ? '../#/' + (w.kind === 'article' ? 'articles' : 'books') : '../#/read/' + w.slug;
  return '<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(title) + '</title>\n<meta name="description" content="' + esc(desc) + '">\n' +
    '<meta property="og:type" content="article"><meta property="og:site_name" content="' + esc(siteName) + '">\n' +
    '<meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '">\n' +
    '<meta property="og:image" content="' + esc(img) + '"><meta property="og:url" content="' + esc(url) + '">\n' +
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(title) + '">\n' +
    '<meta name="twitter:description" content="' + esc(desc) + '"><meta name="twitter:image" content="' + esc(img) + '">\n' +
    '<link rel="canonical" href="' + esc(url) + '">\n' +
    '<script>location.replace("' + go + '")</script>\n' +
    '<style>body{background:#0b0b0d;color:#ddd;font:16px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#e8c27a}</style>\n' +
    '</head><body><p><a href="' + esc(go) + '">' + (w.status === 'soon' ? 'Скоро: «' : 'Читать «') + esc(w.title) + '»</a></p></body></html>\n';
}
if (typeof module !== 'undefined') module.exports = sharePageHtml;

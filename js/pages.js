/* крестик «Закрыть» на страницах «О сайте», «Политика», «Авторские права» */
function docCloseBtn() {
  return '<button type="button" class="btn control doc-close" data-docclose aria-label="Закрыть">' + icon('x') + '</button>';
}
/* СТРАНИЦЫ: главная («Ваша полка», новинки), книги, статьи, о сайте, политика, связь, донат. */

var PAGES = {};
function shelfHtml() {
  var items = Store.s.favorites.map(getWork).filter(function (w) { return w && w.kind === 'story'; });
  var h = '<h2 class="h-label">Ваша полка</h2>';
  var cont = Store.s.recent.map(getWork).filter(function (w) {
    if (!w) return false; var p = Store.pct(w.slug); return p > 4 && p < 96;
  })[0];
  if (cont) {
    h += '<div class="cont"><div><p class="eyebrow">Продолжить чтение</p><p class="tt">' + esc(cont.title) + '</p><p class="pc">' + Store.pct(cont.slug) + '% прочитано</p></div>' +
      '<a class="btn" href="#/read/' + cont.slug + '?resume=1">Продолжить</a></div>';
  }
  if (!items.length) {
    h += '<div class="panel"><p class="eyebrow">Полка пуста</p><p class="t">Нажмите на звезду на карточке книги — текст появится здесь, и вы всегда сможете быстро к нему вернуться.</p><a class="btn" href="#/books">К книгам</a></div>';
  } else {
    h += shelfBooksHtml(items);
  }
  return h;
}
function homeHtml() {
  var h = '<div class="stack"><section id="shelf">' + shelfHtml() + '</section>';
  var rec = recommend();
  if (rec) h += '<section><h2 class="h-label" style="margin-bottom:.5rem">Похоже на то, что вы читали</h2><p class="acc" style="margin-bottom:1.25rem;font-size:.875rem">' + rec.genres.map(esc).join(' · ') + '</p>' + gridHtml(rec.items) + '</section>';
  var fresh = WORKS.filter(function (w) { return w.year === '2026' || w.status === 'wip'; }).sort(function (a, b) { return Number(b.year) - Number(a.year); });
  h += '<section><h2 class="h-label">Новинки</h2>' + gridHtml(fresh) + '<ul class="news">' + NEWS.map(function (n) {
    return '<li><p class="eyebrow">' + esc(n.date) + '</p><h3>' + (n.slug ? '<a href="#/read/' + n.slug + '">' + esc(n.title) + '</a>' : esc(n.title)) + '</h3><p>' + esc(n.text) + '</p></li>';
  }).join('') + '</ul></section></div>';
  return h;
}
PAGES['/'] = { hero: true, title: SITE.name, render: homeHtml };
PAGES['/books'] = { hero: true, title: 'Книги — ' + SITE.name, desc: 'Рассказы Дмитрия Ланцева: мистика и тёмное фэнтези.', render: function () { return gridHtml(byKind('story')); } };
PAGES['/articles'] = { hero: true, title: 'Статьи — ' + SITE.name, desc: 'Аналитика и эссе Дмитрия Ланцева о литературе и тёмных историях.', render: function () { return gridHtml(byKind('article')); } };
PAGES['/about'] = { title: 'О сайте — ' + SITE.name, render: function () {
  return '<article class="doc">' + docCloseBtn() + '<h1>О сайте</h1><p><strong>Dark Stories</strong> — авторский проект Дмитрия Ланцева.</p>' +
    '<p><strong>Жанры:</strong> мистика, тёмное фэнтези, научная фантастика, детектив.</p>' +
    '<p><strong>Версия:</strong> ' + SITE.version + '</p><p><strong>Год:</strong> ' + SITE.year + '</p>' +
    '<p>Читалка запоминает вашу полку, прогресс чтения и закладки на этом устройстве. У каждого текста — своя страница, поиск подсвечивает найденное, незаконченные вещи помечены как «Пишется».</p>' +
    '<p>Email: <a class="l" href="mailto:' + SITE.email + '">' + SITE.email + '</a></p>' +
    '<p>Telegram: <a class="l" href="' + SITE.telegram + '">' + SITE.telegramHandle + '</a></p></article>';
}};
PAGES['/policy'] = { title: 'Политика — ' + SITE.name, render: function () {
  return '<article class="doc">' + docCloseBtn() + '<h1>Политика конфиденциальности</h1><p>Сайт ' + SITE.name + ' уважает вашу конфиденциальность.</p>' +
    '<p><strong>1.</strong> Часть материалов предназначена для читателей старше 16 или 18 лет — это указано на карточке. Продолжая читать, вы подтверждаете возраст.</p>' +
    '<p><strong>2.</strong> Сайт не собирает анкеты и не просит регистрацию.</p>' +
    '<p><strong>3.</strong> Ваша полка (книги со звездой), прогресс чтения и закладки хранятся только в браузере (localStorage) и никуда не отправляются.</p>' +
    '<p><strong>4.</strong> Ссылки на Telegram и Дзен ведут на чужие сервисы — там действуют их политики.</p>' +
    '<p>Контакт: <a class="l" href="mailto:' + SITE.email + '">' + SITE.email + '</a></p></article>';
}};
PAGES['/copyright'] = { title: 'Авторские права — ' + SITE.name, render: function () {
  return '<article class="doc">' + docCloseBtn() + '<h1>Авторские права</h1><p><strong>' + SITE.year + ' ' + SITE.author + '. Все права защищены.</strong></p>' +
    '<p><strong>1.</strong> Цитирование допускается с активной ссылкой на источник.</p>' +
    '<p><strong>2.</strong> Полное копирование текстов без письменного разрешения автора запрещено.</p>' +
    '<p><strong>3.</strong> Коммерческое использование — только по согласованию.</p>' +
    '<p>Контакт: <a class="l" href="mailto:' + SITE.email + '">' + SITE.email + '</a></p></article>';
}};
PAGES['/contact'] = { hero: true, title: 'Связь — ' + SITE.name, render: function () {
  var L = [[SITE.telegram, 'Telegram', SITE.telegramHandle, 'send', true], ['mailto:' + SITE.email, 'Email', SITE.email, 'mail', false], [SITE.dzen, 'Дзен', SITE.dzenHandle, 'pen', true]];
  return '<div class="doc center"><h1 style="color:var(--foreground)">Давайте создавать вместе</h1><p class="muted">Всегда открыт для идей и общения с читателями.</p></div><div class="contact-list">' +
    L.map(function (i) {
      return '<a class="contact-item" href="' + esc(i[0]) + '"' + (i[4] ? ' target="_blank" rel="noreferrer"' : '') + '>' + icon(i[3], 'lg') +
        '<span><span class="n">' + i[1] + '</span><span class="v">' + esc(i[2]) + '</span></span></a>';
    }).join('') + '</div>';
}};
PAGES['/support'] = { hero: true, title: 'Поддержать — ' + SITE.name, render: function () {
  return '<section class="support">' + '<span class="support-icon" aria-hidden="true">' + icon('heartfill') + '</span>' + '<h1>Поддержать проект</h1>' +
    '<p>Донаты пока недоступны. Если хотите поддержать проект, напишите мне во вкладке «Связь» — договоримся.</p>' +
    '<div class="cta"><a class="btn" href="#/contact">' + icon('msg') + 'Перейти в «Связь»</a></div></section>';
}};

function recommend() {
  var weight = {}, s = Store.s;
  function bump(slug, n) { var w = getWork(slug); if (w) weight[w.genre] = (weight[w.genre] || 0) + n; }
  s.favorites.forEach(function (x) { bump(x, 3); });
  Object.keys(s.progress).forEach(function (x) { if (s.progress[x].percent >= 25) bump(x, 1); });
  var genres = Object.keys(weight).sort(function (a, b) { return weight[b] - weight[a]; }).slice(0, 2);
  if (!genres.length) return null;
  var items = WORKS.filter(function (w) { return genres.indexOf(w.genre) >= 0 && !Store.isFav(w.slug) && Store.pct(w.slug) < 92; });
  return items.length ? { genres: genres, items: items.slice(0, 4) } : null;
}
function notFoundHtml() {
  return '<div class="nf"><h1>Страница не найдена</h1><p>Этого адреса нет на полке. Вернитесь к книгам.</p><a class="btn" href="#/">К книгам</a></div>';
}

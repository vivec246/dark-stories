/* ОБОЛОЧКА САЙТА: шапка с картинками, меню, поиск, подвал. */

var TABS = [
  ['/', 'Главная', 'home'], ['/books', 'Книги', 'book'],
  ['/articles', 'Статьи', 'file'], ['/support', 'Донат', 'ruble'], ['/contact', 'Связь', 'msg']
];
function shell(path, inner, showHero) {
  var h = '<div class="shell"><button type="button" class="skip" data-goto="main">К содержанию</button>';
  if (showHero) {
    h += '<header class="hero">' + HERO.map(function (s, i) {
      return '<img class="slide' + (i === 0 ? ' on' : '') + '" src="' + s + '" alt="" draggable="false" onload="heroFocusOne(this)" onerror="heroImgFail(this)">';
    }).join('') +
      '<div class="title-group"><div class="author-line" style="margin-bottom:16px;animation-delay:0s"><span class="author-name">' + SITE.author + '</span></div>' +
      '<h1 class="site-title">Dark<br>Stories</h1>' +
      '<div class="author-line"><span class="author-name">' + SITE.tagline + '</span></div>' +
      '<div class="hero-dots" role="tablist" aria-label="Слайды шапки">' + HERO.map(function (s, i) {
        return '<button type="button" class="hero-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '" role="tab" aria-selected="' + (i === 0) + '" aria-label="Слайд ' + (i + 1) + '"></button>';
      }).join('') + '</div></div>' +
      '<button type="button" class="scroll-indicator" data-goto="nav" aria-label="Прокрутить к навигации"><span>ВНИЗ</span><div class="scroll-line"></div></button></header>';
  }
  /* продолжение картинки шапки под меню: настоящие нижние строки той же картинки (видно, пока меню стоит под шапкой) */
  var navBg = showHero ? '<div class="nav-bg" aria-hidden="true">' + HERO.map(function (s, i) {
    return '<img class="nav-slide' + (i === 0 ? ' on' : '') + '" src="' + s + '" alt="" draggable="false" onload="heroFocusOne(this)">';
  }).join('') + '</div>' : '';
  h += '<nav class="nav' + (showHero ? ' parked' : '') + '" id="nav" aria-label="Разделы">' + navBg + '<div class="nav-in"><div class="tabs">' + TABS.map(function (t) {
    var active = path === t[0];
    return '<a class="tab' + (active ? ' active' : '') + '" href="#' + t[0] + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(t[2]) + t[1] + '<i></i></a>';
  }).join('') + '</div>' +
    '<div class="search"><div class="search-box"><input id="q" type="search" autocomplete="off" placeholder="Поиск…" aria-label="Поиск по рассказам и статьям">' +
    '<button type="button" class="side" id="qclear" hidden aria-label="Очистить поиск">' + icon('x') + '</button>' +
    '<button type="button" class="side" id="qicon" aria-label="Поиск" aria-expanded="false">' + icon('search') + '</button></div><div class="results" id="results" hidden></div></div></div></nav>';
  h += '<main id="main">' + inner + '</main>' +
    '<footer class="footer"><div class="footer-in"><div><p class="name">' + SITE.name + '</p><p class="au"><a href="#/author">' + SITE.author + '</a></p></div>' +
    '<div class="links"><a href="#/policy">Политика</a><span aria-hidden="true">·</span><a href="#/copyright">Авторские права</a><span aria-hidden="true">·</span><a href="#/about">' + SITE.year + '</a></div></div></footer></div>';
  return h;
}

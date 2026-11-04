/* КАРТОЧКИ текстов (как в версии 3) и сетка карточек. */

function cardHtml(w) {
  var fav = Store.isFav(w.slug), href = '#/read/' + w.slug;
  var pct = Math.min(100, Math.round(Store.pct(w.slug)));   /* сколько уже прочитано, в процентах */
  var label = fav ? 'Убрать с полки' : 'Добавить на полку';
  return '<article class="card" data-href="' + href + '" tabindex="0" aria-label="Читать: ' + esc(w.title) + '">' +
    '<div class="card-image-wrapper">' +
      '<img class="card-image" src="' + esc(w.cover) + '" alt="" loading="lazy" decoding="async" onerror="coverFail(this)">' +
      '<div class="card-image-fallback" style="display:none"><span>' + esc(w.genre) + '</span></div>' +
      '<div class="card-badges"><div class="card-badges-left"><span class="card-year-badge">' + esc(w.year) + '</span>' +
          (pct >= 1 ? '<span class="card-year-badge card-progress-badge" title="Прочитано">' + pct + '%</span>' : '') + '</div>' +
        '<button type="button" class="card-favorite-badge' + (fav ? ' active' : '') + '" data-fav="' + w.slug + '" aria-pressed="' + fav + '" aria-label="' + label + '" title="' + label + '">' + icon('star') + '</button></div>' +
    '</div>' +
    '<div class="card-content">' +
      '<div class="card-genre">' + esc(w.genre) + '</div>' +
      '<h3>' + esc(w.shortTitle) + '</h3>' +
      '<div class="card-desc">' + esc(w.description) + '</div>' +
      '<div class="card-footer"><span class="age-rating">' + esc(w.age) + '</span>' +
        '<div class="card-footer-actions"><button type="button" class="btn-desc" data-desc>Описание</button>' +
        '<a class="btn-read" href="' + href + '">Читать</a></div></div>' +
    '</div></article>';
}

/* КНИГА (раздел «Книги»): настоящий объёмный том с переплётом, наклоняется за курсором. */
function bookCardHtml(w) {
  var fav = Store.isFav(w.slug), href = '#/read/' + w.slug;
  var pct = Math.min(100, Math.round(Store.pct(w.slug)));
  var label = fav ? 'Убрать с полки' : 'Добавить на полку';
  var bg = "background-image:url('" + esc(w.cover) + "')";
  return '<article class="bcard" data-href="' + href + '" tabindex="0" aria-label="Читать: ' + esc(w.title) + '">' +
    '<div class="bc-3d">' +
      '<div class="bc-face bc-front">' +
        '<img class="bk-cover" src="' + esc(w.cover) + '" alt="" loading="lazy" decoding="async" onerror="coverFail(this)">' +
        '<div class="bk-fallback" style="display:none"><span>' + esc(w.genre) + '</span></div>' +
        '<div class="bk-shade"></div><div class="bk-hinge"></div><div class="bc-gloss"></div>' +
        '<div class="bk-top"><div class="bc-tl"><span class="bk-badge">' + esc(w.year) + '</span>' + (pct >= 1 ? '<span class="bk-badge bk-badge-pct">' + pct + '%</span>' : '') + '</div>' +
          '<button type="button" class="card-favorite-badge' + (fav ? ' active' : '') + '" data-fav="' + w.slug + '" aria-pressed="' + fav + '" aria-label="' + label + '" title="' + label + '">' + icon('star') + '</button></div>' +
        '<div class="bk-info"><div class="bk-genre">' + esc(w.genre) + '</div><h3>' + esc(w.shortTitle) + '</h3>' +
          (pct >= 1 ? '<div class="bk-line"><i style="width:' + pct + '%"></i></div>' : '') +
          '<div class="bk-foot"><span class="age-rating">' + esc(w.age) + '</span>' +
          '<div class="card-footer-actions"><button type="button" class="btn-desc" data-desc>Описание</button>' +
          '<a class="btn-read" href="' + href + '">' + (pct >= 1 && pct < 96 ? 'Продолжить' : 'Читать') + '</a></div></div></div>' +
      '</div>' +
      '<div class="bc-face bc-spine"><div class="bc-spine-bg" style="' + bg + '"></div><div class="bc-title-wrap"><div class="bc-title">' + esc(w.shortTitle) + '</div></div><span class="bc-emblem">DS</span></div>' +
      '<div class="bc-face bc-right"></div><div class="bc-face bc-top-f"></div><div class="bc-face bc-bottom-f"></div><div class="bc-face bc-back">' +
        '<div class="bc-back-bg" style="' + bg + '"></div>' +
        '<div class="bc-back-in"><div class="bk-genre">' + esc(w.genre) + '</div><h3>' + esc(w.title) + '</h3><div class="bc-rule"></div>' +
          '<div class="bc-desc-full">' + esc(w.description) + '</div>' +
          '<div class="bc-meta">' + [esc(w.year), esc(w.age), w.minutes ? '~' + esc(w.minutes) + ' мин' : '', w.status === 'wip' ? 'пишется' : ''].filter(Boolean).join(' · ') + '</div>' +
          '<div class="bk-foot"><button type="button" class="btn-desc" data-desc>К обложке</button>' +
          '<a class="btn-read" href="' + href + '">' + (pct >= 1 && pct < 96 ? 'Продолжить' : 'Читать') + '</a></div></div>' +
        '<div class="bc-back-hinge"></div></div>' +
    '</div></article>';
}

/* ГАЗЕТА (раздел «Статьи»): вырезка с шапкой, заголовком, чёрно-белым фото и колонками. */
function paperHtml(w) {
  var href = '#/read/' + w.slug;
  var pct = Math.min(100, Math.round(Store.pct(w.slug)));
  var text = String(w.description || '');
  return '<article class="paper" data-href="' + href + '" tabindex="0" aria-label="Читать: ' + esc(w.title) + '">' +
    '<div class="pp-sheet">' +
      '<div class="pp-meta"><span>Выпуск ' + esc(w.year) + '</span><span class="pp-genre">' + esc(w.genre) + '</span></div>' +
      '<h3 class="pp-mast">' + esc(w.title) + '</h3>' +
      '<div class="pp-rule"></div>' +
      '<figure class="pp-photo"><img src="' + esc(w.cover) + '" alt="" loading="lazy" decoding="async" onerror="coverFail(this)"><div class="pp-fallback" style="display:none"></div><i class="pp-tint"></i><i class="pp-dots"></i></figure>' +
      '<p class="pp-body">' + esc(text) + '</p>' +
      '<div class="pp-foot"><span class="pp-age">' + esc(w.age) + '</span>' +
        '<span class="pp-time">' + (pct >= 1 ? 'прочитано ' + pct + '%' : (w.minutes ? esc(w.minutes) + ' мин. чтения' : '')) + '</span>' +
        '<a class="pp-read" href="' + href + '">Читать →</a></div>' +
    '</div></article>';
}
function coverFail(img) {
  img.style.display = 'none';
  if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex';
}
function gridHtml(items) {
  if (!items.length) return '<p class="empty">Пока пусто — нажмите на звезду на карточке, чтобы добавить рассказ или статью.</p>';
  return '<div class="grid">' + items.map(function (w) { return w.kind === 'article' ? paperHtml(w) : bookCardHtml(w); }).join('') + '</div>';
}

/* ПОЛКА: книги стоят корешком к читателю, при наведении поворачиваются обложкой. */
function bookHtml(w) {
  var fav = Store.isFav(w.slug), href = '#/read/' + w.slug;
  var pct = Math.min(100, Math.round(Store.pct(w.slug)));
  var len = w.shortTitle.length;
  var fs = len <= 11 ? 24 : len <= 16 ? 21 : len <= 22 ? 18 : len <= 30 ? 15 : 14;   /* длинное название — мельче */
  var bg = "background-image:url('" + esc(w.cover) + "')";
  var label = fav ? 'Убрать с полки' : 'Добавить на полку';
  return '<article class="book" data-href="' + href + '" tabindex="0" aria-label="Читать: ' + esc(w.title) + '">' +
    '<div class="book-3d">' +
      /* корешок */
      '<div class="bk-face bk-spine">' +
        '<div class="bk-spine-bg" style="' + bg + '"></div>' +
        (pct >= 1 ? '<div class="bk-prog"><i style="height:' + pct + '%"></i></div>' : '') +
        (pct >= 1 && pct < 100 ? '<div class="bk-ribbon"></div>' : '') +
        '<span class="bk-year">' + esc(w.year) + '</span><span class="bk-orn"></span>' +
        '<div class="bk-title-wrap"><div class="bk-title" style="font-size:' + fs + 'px">' + esc(w.shortTitle) + '</div></div>' +
        '<span class="bk-orn"></span><span class="bk-emblem">DS</span>' +
      '</div>' +
      /* обложка */
      '<div class="bk-face bk-front">' +
        '<img class="bk-cover" src="' + esc(w.cover) + '" alt="" loading="lazy" decoding="async" onerror="coverFail(this)">' +
        '<div class="bk-fallback" style="display:none"><span>' + esc(w.genre) + '</span></div>' +
        '<div class="bk-shade"></div><div class="bk-hinge"></div><div class="bk-gloss"></div>' +
        '<div class="bk-top">' + (pct >= 1 ? '<span class="bk-badge">' + pct + '%</span>' : '<span></span>') +
          '<button type="button" class="card-favorite-badge' + (fav ? ' active' : '') + '" data-fav="' + w.slug + '" aria-pressed="' + fav + '" aria-label="' + label + '" title="' + label + '">' + icon('star') + '</button></div>' +
        '<div class="bk-info"><div class="bk-genre">' + esc(w.genre) + '</div><h3>' + esc(w.shortTitle) + '</h3>' +
          (pct >= 1 ? '<div class="bk-line"><i style="width:' + pct + '%"></i></div>' : '') +
          '<div class="bk-foot"><span class="age-rating">' + esc(w.age) + '</span><a class="btn-read" href="' + href + '">' + (pct >= 1 && pct < 96 ? 'Продолжить' : 'Читать') + '</a></div></div>' +
      '</div>' +
      '<div class="bk-face bk-right"></div><div class="bk-face bk-top-f"></div><div class="bk-face bk-bottom-f"></div><div class="bk-face bk-back"></div>' +
    '</div></article>';
}
function shelfBooksHtml(items) {
  return '<div class="shelf">' + items.map(bookHtml).join('') + '</div>';
}

/* на телефонах карточка «оживает», когда почти целиком видна на экране */
var cardObserver = null;
function initCardAnimation() {
  if (cardObserver) { cardObserver.disconnect(); cardObserver = null; }
  if (window.innerWidth > 768 || !('IntersectionObserver' in window)) return;
  cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.target.classList.toggle('card-visible', en.isIntersecting); });
  }, { threshold: 0.75 });
  $$('.card, .bcard, .paper').forEach(function (c) { cardObserver.observe(c); });
}

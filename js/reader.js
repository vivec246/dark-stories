/* ЧИТАЛКА: страница текста, прогресс и время до конца, закладки, оглавление, настройки чтения (тема, шрифт, ширина, интервал),
   анимация открытия книги и газеты, следующая книга в конце.
   Кнопки управления — из версии 4. Меню правой кнопки и цитаты — в reader-menu.js. */

var R = null; // состояние открытой читалки
var controlsOn = true;

var SPINNER = '<svg class="ico spin" viewBox="0 0 24 24" style="width:2em;height:2em" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-opacity="0.25"/><path d="M21 12a9 9 0 00-9-9"/></svg>';
var TRASH = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

/* темы, шрифт, ширина строки, интервал */
var THEMES = ['night', 'day', 'candle'];
var THEME_NAMES = { night: 'Ночь', day: 'День', candle: 'Свеча' };

function prefIsOn(key, val) {
  return Store.s[key] === val;
}
function chipsHtml(key, opts) {
  return opts.map(function (o) {
    return '<button type="button" class="chip' + (prefIsOn(key, o[0]) ? ' on' : '') + '" data-pref="' + key + '" data-val="' + o[0] + '">' + o[1] + '</button>';
  }).join('');
}
/* настройки текста под кнопкой «T»: размер, шрифт, ширина строки, интервал */
function textPanelHtml() {
  return '<div class="spop" id="fontpop" hidden>' +
    '<div class="sp-sec"><div class="sp-t">Размер</div><input type="range" id="fontrange" min="0.8" max="2.0" step="0.1" value="' + Store.s.fontSize + '" aria-label="Размер шрифта"></div>' +
    '<div class="sp-sec"><div class="sp-t">Шрифт</div><div class="sp-chips">' + chipsHtml('readerFont', [['sans', 'Без засечек'], ['serif', 'С засечками']]) + '</div></div>' +
    '<div class="sp-sec sp-desk"><div class="sp-t">Ширина строки</div><div class="sp-chips">' + chipsHtml('readerWidth', [['narrow', 'Узко'], ['normal', 'Средне'], ['wide', 'Широко']]) + '</div></div>' +
    '<div class="sp-sec"><div class="sp-t">Интервал</div><div class="sp-chips">' + chipsHtml('readerLead', [['tight', 'Плотно'], ['normal', 'Обычно'], ['loose', 'Свободно']]) + '</div></div>' +
    '<p class="sp-keys">Клавиши: ← → листать · + − размер · T тема · F без кнопок</p></div>';
}
function readerClass() {
  var t = Store.s.readerTheme;
  return 'reader ' + (t === 'day' ? 'day' : 'night' + (t === 'candle' ? ' candle' : ''));
}

function readerShell(w) {
  var S = Store.s;
  return '<div class="' + readerClass() + '" id="reader" data-font="' + S.readerFont + '" data-width="' + S.readerWidth + '" data-lead="' + S.readerLead + '">' +
    '<div class="rbar" aria-hidden="true"><i id="rbar"></i></div>' +
    '<div class="rtools" id="rtools">' +
    '<button type="button" class="btn control" data-act="close" aria-label="Закрыть читалку">' + icon('back') + '</button>' +
    '<button type="button" class="btn control" data-act="theme" aria-label="Сменить тему">' + icon('moon') + '</button>' +
    '<button type="button" class="btn control" data-act="bookmarks" aria-label="Закладки">' + icon('bookmark') + '</button>' +
    '<button type="button" class="btn control" data-act="font" aria-label="Настройки текста">' + icon('type') + '</button>' +
    '<button type="button" class="btn control" data-act="toc" aria-label="Содержание">' + icon('list') + '</button></div>' +
    textPanelHtml() +
    '<div class="rtime" id="rtime" aria-live="off"></div>' +
    '<button type="button" class="btn control share" id="rshare" data-act="share" aria-label="Поделиться">' + icon('share') + '</button>' +
    '<div class="rcontent" id="rcontent"><div id="rart"><div class="loadmsg">' + SPINNER + '<p>ЗАГРУЗКА</p></div></div></div></div>';
}

/* применяем настройки к открытой читалке и подсвечиваем выбранные кнопки */
function applyReaderPrefs() {
  var rd = $('#reader'); if (!rd) return;
  var S = Store.s;
  rd.classList.toggle('day', S.readerTheme === 'day');
  rd.classList.toggle('night', S.readerTheme !== 'day');
  rd.classList.toggle('candle', S.readerTheme === 'candle');
  rd.setAttribute('data-font', S.readerFont);
  rd.setAttribute('data-width', S.readerWidth);
  rd.setAttribute('data-lead', S.readerLead);
  $$('#fontpop .chip').forEach(function (c) { c.classList.toggle('on', prefIsOn(c.getAttribute('data-pref'), c.getAttribute('data-val'))); });
  updateProgressBar();
}
function setReaderPref(k, v) {
  Store.setPref(k, v);
  applyReaderPrefs();
}
function cycleTheme() {
  var n = THEMES[(THEMES.indexOf(Store.s.readerTheme) + 1) % THEMES.length];
  setReaderPref('readerTheme', n);
  toast('Тема: ' + THEME_NAMES[n]);
}
function readerFontStep(d) {
  var v = Math.max(0.8, Math.min(2.0, Math.round((Store.s.fontSize + d) * 10) / 10));
  Store.setFont(v); applyFont();
  var r = $('#fontrange'); if (r) r.value = v;
}

/* ОТКРЫТИЕ: книга раскрывает обложку, газета разворачивается; по касанию можно пропустить */
function playOpenFx(w) {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var old = $('#rfx'); if (old) old.remove();
  var el = document.createElement('div');
  el.id = 'rfx';
  el.setAttribute('aria-hidden', 'true');
  if (w.kind === 'article') {
    el.className = 'rfx rfx-paper';
    el.innerHTML = '<div class="rfx-sheet"><div class="rfx-half rfx-top"><div class="rfx-front"><div class="rfx-mast">' + esc(w.title) + '</div><i class="rfx-rule"></i></div><div class="rfx-back"></div></div>' +
      '<div class="rfx-half rfx-bot"><i class="rfx-lines"></i></div></div>';
  } else {
    el.className = 'rfx rfx-book';
    el.innerHTML = '<div class="rfx-vol"><div class="rfx-pages"><i></i></div><div class="rfx-cover">' +
      '<div class="rfx-cf" style="background-image:url(\'' + esc(w.cover) + '\')"></div><div class="rfx-cb"></div></div></div>';
  }
  document.body.appendChild(el);
  var kill = function () { if (el.parentNode) el.parentNode.removeChild(el); };
  el.addEventListener('click', kill);
  setTimeout(kill, 1900);
}

/* КОНЕЦ ТЕКСТА: предлагаем следующую книгу или статью */
function pickNext(w) {
  var pool = WORKS.filter(function (x) { return x.slug !== w.slug && x.status === 'published'; });
  if (!pool.length) return null;
  function unread(x) { return Store.pct(x.slug) < 92; }
  var sameGenre = pool.filter(function (x) { return x.genre === w.genre && unread(x); });
  var sameKind = pool.filter(function (x) { return x.kind === w.kind && unread(x); });
  var anyUnread = pool.filter(unread);
  return sameGenre[0] || sameKind[0] || anyUnread[0] || pool[0];
}
function nextHtml(w) {
  var n = pickNext(w);
  if (!n) return '';
  return '<div class="rnext"><div class="rend" aria-hidden="true">· · ·</div><p class="rnext-t">Читать дальше</p>' +
    (n.kind === 'article' ? paperHtml(n) : bookCardHtml(n)) + '</div>';
}
function countWords(blocks) {
  var n = 0;
  blocks.forEach(function (b) {
    var t = (b.t === 'ul' || b.t === 'ol') ? b.items.join(' ') : (b.text || '');
    n += (t.match(/\S+/g) || []).length;
  });
  return n;
}

function applyFont() {
  $$('#rart .reader-body p').forEach(function (p) { p.style.fontSize = Store.s.fontSize + 'em'; });
}
function toggleControls() {
  controlsOn = !controlsOn;
  ['#rtools', '#rshare', '#rtime'].forEach(function (id) { var e = $(id); if (e) e.classList.toggle('off', !controlsOn); });
  var sp = $('#fontpop'); if (sp && !controlsOn) sp.hidden = true;
}
function fillReader(w, text, params) {
  var q = params.get('q') || '', blocks = parseMd(text), saved = Store.s.progress[w.slug], token = R;
  R.blocks = blocks; R.words = countWords(blocks);
  $('#rart').innerHTML = mdHtml(w.title, blocks, q) + nextHtml(w);
  $$('#rart h2, #rart h3').forEach(function (h) { if (!h.id) h.id = slugify(h.textContent); });
  applyFont();
  if (typeof initCardAnimation === 'function') initCardAnimation();
  if (q) {
    var mk = $('mark', $('#rart'));
    if (mk) setTimeout(function () { mk.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
  } else if (saved && saved.scrollTop > 100) {
    /* как в версии 3: сразу возвращаем на место, где остановились */
    setTimeout(function () { if (R === token) { window.scrollTo(0, saved.scrollTop); updateProgressBar(); } }, 300);
  }
  updateProgressBar();
}
/* «конец чтения» — конец самого текста, а не блока «Читать дальше» под ним */
function textMax() {
  var el = document.documentElement, body = $('#rart .reader-body');
  var full = el.scrollHeight - el.clientHeight;
  if (!body) return full;
  var end = body.getBoundingClientRect().bottom + el.scrollTop + 40;
  return Math.max(1, Math.min(full, end - el.clientHeight));
}
function updateProgressBar() {
  var el = document.documentElement, max = textMax();
  var frac = Math.min(1, el.scrollTop / max);
  var pct = max > 1 ? Math.round(frac * 100) : 0;
  var bar = $('#rbar'); if (bar) bar.style.width = pct + '%';
  var rt = $('#rtime');
  if (rt && R && R.words) {
    var left = Math.round(R.words / 190 * (1 - frac));   /* ~190 слов в минуту */
    rt.textContent = frac >= 0.985 ? 'дочитано' : left < 1 ? 'меньше минуты' : 'осталось ~' + left + ' мин';
  }
  return pct;
}

/* окна: «Содержание» и «Закладки» (оформление из версии 3) */
function modalHtml(inner) {
  return '<div class="v3modal" data-bgclose><div class="modal-box">' + inner +
    '<button type="button" class="modal-x" data-close aria-label="Закрыть">✕</button></div></div>';
}
function openDialog(kind) {
  if (!R) return;
  var w = R.work, body = '';
  if (kind === 'toc') {
    var hs = R.blocks.filter(function (b) { return b.t === 'h2' || b.t === 'h3'; });
    body = '<h4 class="modal-title center">Содержание</h4>' + (hs.length
      ? '<div class="toc-list">' + hs.map(function (b) {
          return '<button type="button" data-goto-id="' + esc(b.id) + '" data-close' + (b.t === 'h3' ? ' style="margin-left:18px;width:calc(100% - 18px)"' : '') + '>' + esc(b.text) + '</button>';
        }).join('') + '</div>'
      : '<p class="modal-empty">Нет заголовков</p>');
  } else {
    var list = Store.s.bookmarks[w.slug] || [];
    body = '<h3 class="modal-title">ЗАКЛАДКИ</h3><div id="bookmarksList">' + (list.length
      ? list.map(function (b) {
          return '<div class="bookmark-item" data-bm-go="' + b.pos + '"><div><strong>' + esc(b.text) + '</strong><br><span>' + esc(b.time) + '</span></div>' +
            '<div class="delete-bm" data-bm-del="' + b.id + '" role="button" aria-label="Удалить закладку">' + TRASH + '</div></div>';
        }).join('')
      : '<p class="modal-empty">Нет закладок</p>') +
      '</div><div class="modal-actions"><button type="button" class="btn outline" data-act="bm-save">+ Сохранить позицию</button></div>';
  }
  R.dialog = kind;
  $('#overlay-root').innerHTML = modalHtml(body);
}
function closeDialog() { $('#overlay-root').innerHTML = ''; if (R) R.dialog = null; }

function openReader(path, params) {
  var slug = path.slice('/read/'.length), w = getWork(slug);
  if (!w) return false;
  R = { work: w, blocks: [], dialog: null, words: 0 };
  controlsOn = true;
  Store.addRecent(w.slug);
  $('#app').innerHTML = readerShell(w);
  playOpenFx(w);
  setMeta(w.title + ' — ' + SITE.name, w.description, w.cover);
  $('#ldWork').textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': w.kind === 'article' ? 'Article' : 'Book', name: w.title, headline: w.title, description: w.description, datePublished: w.year + '-01-01', inLanguage: 'ru', image: w.cover, author: { '@type': 'Person', name: SITE.author }, isAccessibleForFree: true });
  var token = R;
  fetchText(w.path).then(function (text) { if (R === token) fillReader(w, text, params); })
    .catch(function () {
      if (R !== token) return;
      var file = location.protocol === 'file:';
      $('#rart').innerHTML = '<div class="loadmsg"><p>Не удалось загрузить текст</p>' +
        (file ? '<p class="small">Сайт нужно открывать через веб-сервер (GitHub Pages или <code>python -m http.server</code>) — из папки напрямую браузер не даёт читать файлы.</p>' : '') +
        '<button type="button" class="btn" data-act="close" style="margin-top:1.25rem">Закрыть</button></div>';
    });
  return true;
}

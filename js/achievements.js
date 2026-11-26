/* ДОСТИЖЕНИЯ. Хранятся только в браузере читателя (localStorage, ключ ds-achievements).
   Модуль ничего не меняет в остальном коде: он подцепляется к существующим функциям (openReader, Store.addBookmark, Store.toggleFav…)
   и сам определяет, когда выдать значок. Чтобы добавить новое достижение, допишите запись в ACH и вызовите Ach.unlock('id') в нужный момент. */
var ACH_COLLECTOR = 3;   /* сколько рассказов нужно дочитать для «Коллекционера» — когда рассказов станет больше, поднимите число */

var ACH = [
  { id: 'first', name: 'Первый шаг', desc: 'Открыть свой первый рассказ', tier: 'bronze', img: 'img/ach/first.webp' },
  { id: 'mark', name: 'Я остановился тут?', desc: 'Поставить первую закладку', tier: 'bronze', img: 'img/ach/mark.webp' },
  { id: 'heart', name: 'От всего сердца', desc: 'Поделиться рассказом или цитатой', tier: 'bronze', img: 'img/ach/heart.webp' },
  { id: 'scout', name: 'Разведчик', desc: 'Заглянуть в подвал и разузнать о сайте и об авторе', tier: 'bronze', img: 'img/ach/scout.webp' },
  { id: 'shelf1', name: 'Первый том', desc: 'Добавить первый рассказ на полку', tier: 'bronze', img: 'img/ach/shelf1.webp' },
  { id: 'another', name: 'Ещё один!', desc: 'Открыть второй рассказ за один день', tier: 'bronze', img: 'img/ach/another.webp' },
  { id: 'dark1', name: 'Тушите свет!', desc: 'Первый раз включить тёмную тему', tier: 'bronze', img: 'img/ach/dark1.webp' },
  { id: 'day1', name: 'С первыми лучами', desc: 'Первый раз включить дневную тему', tier: 'bronze', img: 'img/ach/day1.webp' },
  { id: 'time15', name: 'На досуге', desc: 'Провести за чтением 15 минут', tier: 'bronze', img: 'img/ach/time15.webp' },
  { id: 'search', name: 'Исследователь', desc: 'Воспользоваться поиском рассказов', tier: 'bronze', img: 'img/ach/search.webp' },
  { id: 'paths', name: 'Следопыт', desc: 'Открыть пять разных разделов сайта: главная, книги, статьи, донат и связь', tier: 'bronze', img: 'img/ach/paths.webp' },
  { id: 'annot', name: 'Аннотация', desc: 'Перевернуть карточку книги или статьи, чтобы прочитать описание', tier: 'bronze', img: 'img/ach/annot.webp' },
  { id: 'paper1', name: 'Это… газета?', desc: 'Прочитать первую статью', tier: 'bronze', img: 'img/ach/paper1.webp' },
  { id: 'eye', name: 'Любопытный', desc: 'Открыть пять разных рассказов или статей', tier: 'bronze', img: 'img/ach/eye.webp' },
  { id: 'back', name: 'С возвращением!', desc: 'Вернуться на сайт на следующий день', tier: 'bronze', img: 'img/ach/back.webp' },
  { id: 'chapter', name: 'Ещё одну главу!', desc: 'Провести за чтением суммарно 30 минут', tier: 'silver', img: 'img/ach/chapter.webp' },
  { id: 'club', name: 'Книжный клуб', desc: 'Поделиться тремя разными рассказами', tier: 'silver', img: 'img/ach/club.webp' },
  { id: 'articler', name: 'Жёлтая пресса', desc: 'Прочитать три статьи', tier: 'silver', img: 'img/ach/articler.webp' },
  { id: 'regular', name: 'Постоянный гость', desc: 'Посетить сайт 3 дня подряд', tier: 'silver', img: 'img/ach/regular.webp' },
  { id: 'owl', name: 'Сова', desc: 'Читать в тёмной теме суммарно 30 минут', tier: 'silver', img: 'img/ach/owl.webp' },
  { id: 'lark', name: 'Жаворонок', desc: 'Читать в дневной теме суммарно 30 минут', tier: 'silver', img: 'img/ach/lark.webp' },
  { id: 'done', name: 'От корки до корки', desc: 'Дочитать текст рассказа до конца', tier: 'silver', img: 'img/ach/done.webp' },
  { id: 'shelf', name: 'Начало коллекции', desc: 'Добавить три рассказа на полку', tier: 'silver', img: 'img/ach/shelf.webp' },
  { id: 'quote', name: 'Крылатая фраза', desc: 'Сделать 5 открыток из цитаты (нажать «Поделиться цитатой» и открыть карточку)', tier: 'silver', img: 'img/ach/quote.webp' },
  { id: 'gatherer', name: 'Собиратель', desc: 'Получить все бронзовые награды', tier: 'silver', img: 'img/ach/gatherer.webp' },
  { id: 'bookworm', name: 'Книгочей', desc: 'Дочитать три рассказа до конца', tier: 'gold', img: 'img/ach/bookworm.webp' },
  { id: 'themer', name: 'Хамелеон', desc: 'Прочитать во всех стилях и всех режимах читалки', tier: 'gold', img: 'img/ach/themer.webp' },
  { id: 'session', name: 'Не оторваться!', desc: 'Провести за чтением 1 час за один сеанс', tier: 'gold', img: 'img/ach/session.webp' },
  { id: 'shadow', name: 'Вошедший в тени', desc: 'Посетить сайт 5 дней подряд', tier: 'gold', img: 'img/ach/shadow.webp' },
  { id: 'keeper', name: 'Коллекционер', desc: 'Получить все бронзовые и серебряные награды', tier: 'gold', img: 'img/ach/keeper.webp' },
  { id: 'midnight', name: 'Полуночник', desc: 'Читать рассказ в первые 15 минут после полуночи (с 00:00 до 00:15)', tier: 'purple', hidden: true, img: 'img/ach/midnight.webp' },
  { id: 'abyss', name: 'На полпути в бездну', desc: 'Читать суммарно 3 часа 33 минуты', tier: 'purple', hidden: true, img: 'img/ach/abyss.webp' },
  { id: 'night3', name: 'Не до сна', desc: 'Читать глубокой ночью, с 2:00 до 5:00, когда все спят', tier: 'purple', hidden: true, img: 'img/ach/night3.webp' },
  { id: 'easter', name: 'Пасхалка', desc: 'Пять быстрых нажатий подряд на название сайта внизу страницы', tier: 'purple', hidden: true, img: 'img/ach/easter.webp' },
  { id: 'shadow7', name: 'Властелин теней', desc: 'Посетить сайт 7 дней подряд', tier: 'purple', hidden: true, img: 'img/ach/shadow7.webp' },
  { id: 'allmetal', name: 'Повелитель медалей', desc: 'Получить все металлические достижения (бронзу, серебро и золото)', tier: 'purple', hidden: true, img: 'img/ach/allmetal.webp' },
  { id: 'cycle', name: 'Вне цикла', desc: 'Зайти на сайт в каждый из четырёх периодов суток: с 06:00 до 12:00, с 12:00 до 18:00, с 18:00 до 00:00 и с 00:00 до 06:00', tier: 'purple', hidden: true, img: 'img/ach/cycle.webp' },
  { id: 'tune', name: 'Тонкая настройка', desc: 'Изменить размер шрифта, тему и стиль читалки за один сеанс внутри одного рассказа', tier: 'purple', hidden: true, img: 'img/ach/tune.webp' },
  { id: 'again', name: 'Блудный читатель', desc: 'Вернуться после недельного перерыва', tier: 'purple', hidden: true, img: 'img/ach/again.webp' },
  { id: 'replay', name: 'Бесконечное чтение', desc: 'Открыть рассказ, который уже был прочитан до конца ранее', tier: 'purple', hidden: true, img: 'img/ach/replay.webp' },
];

var Ach = (function () {
  var KEY = 'ds-achievements', st = { got: {}, done: [], last: '', time: {}, reached: {}, combos: [], shared: [], pages: [], total: 0, opened: [], dayOpen: { d: '', s: [] }, sections: [], nightSec: 0, daySec: 0, streak: 0, periods: [], cards: 0 };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (raw && typeof raw === 'object') { st.got = raw.got || {}; st.done = raw.done || []; st.last = raw.last || ''; st.time = raw.time || {}; st.reached = raw.reached || {}; st.combos = raw.combos || []; st.shared = raw.shared || []; st.pages = raw.pages || []; st.total = raw.total || 0; st.opened = raw.opened || []; st.dayOpen = raw.dayOpen || { d: '', s: [] }; st.sections = raw.sections || []; st.nightSec = raw.nightSec || 0; st.daySec = raw.daySec || 0; st.streak = raw.streak || 0; st.periods = raw.periods || []; st.cards = raw.cards || 0; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function find(id) { for (var i = 0; i < ACH.length; i++) if (ACH[i].id === id) return ACH[i]; return null; }

  var TIERS = { bronze: ['#e0a070', '#7a4a26'], silver: ['#eef2f8', '#7d8794'], gold: ['#fff0b8', '#b98a2c'], purple: ['#e2cfff', '#6b3fb0'] };
  function defs() {
    if (document.getElementById('achDefs')) return;
    var g = '';
    Object.keys(TIERS).forEach(function (k) {
      g += '<linearGradient id="ar-' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + TIERS[k][0] + '"/><stop offset=".5" stop-color="' + TIERS[k][1] + '"/><stop offset="1" stop-color="' + TIERS[k][0] + '"/></linearGradient>';
    });
    g += '<radialGradient id="af" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#1c2740"/><stop offset="1" stop-color="#080c15"/></radialGradient>';
    var d = document.createElement('div'); d.id = 'achDefs'; d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0"><defs>' + g + '</defs></svg>'; document.body.appendChild(d);
  }
  function medal(a, locked) {
    if (a.img) return '<img class="ach-medal' + (locked ? ' locked' : '') + '" src="' + a.img + '" alt="" width="120" height="120" decoding="async" aria-hidden="true">';
    var c = TIERS[a.tier][0];
    return '<svg class="ach-medal' + (locked ? ' locked' : '') + '" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="url(#ar-' + a.tier + ')"/><circle cx="50" cy="50" r="44.5" fill="url(#af)"/>' +
      '<circle cx="50" cy="50" r="41" fill="none" stroke="' + c + '" stroke-opacity=".45" stroke-width=".7" stroke-dasharray="1.2 2.2"/>' +
      '<g color="' + c + '" fill="none" stroke="' + c + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + a.ico + '</g></svg>';
  }

  /* всплывающая плашка; если получено сразу несколько, показываем по очереди */
  var queue = [], showing = false;
  function pump() {
    if (showing || !queue.length) return;
    showing = true;
    var a = queue.shift(), el = document.createElement('div');
    el.className = 'ach-toast'; el.setAttribute('role', 'status');
    el.innerHTML = medal(a) + '<div class="at"><div class="ak">Достижение</div><div class="an">' + esc(a.name) + '</div><div class="ad">' + esc(a.desc) + '</div></div>';
    el.addEventListener('click', function () { location.hash = '#/achievements'; });
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('on'); }, 30);
    setTimeout(function () { el.classList.remove('on'); setTimeout(function () { el.remove(); showing = false; pump(); }, 500); }, 4200);
  }
  function unlock(id) {
    if (st.got[id] || !find(id)) return;
    st.got[id] = Date.now(); save();
    defs(); queue.push(find(id)); setTimeout(pump, 700);
    meta();
  }
  /* награды «за все»: Собиратель (вся бронза), Коллекционер (бронза и серебро), Повелитель медалей (бронза, серебро и золото) */
  function tiersDone(tiers, self) { return ACH.every(function (a) { return a.id === self || tiers.indexOf(a.tier) < 0 || !!st.got[a.id]; }); }
  function meta() {
    if (tiersDone(['bronze'], 'gatherer')) unlock('gatherer');
    if (tiersDone(['bronze', 'silver'], 'keeper')) unlock('keeper');
    if (tiersDone(['bronze', 'silver', 'gold'], 'allmetal')) unlock('allmetal');
  }

  function doneStories() { return st.done.filter(function (s) { var w = getWork(s); return w && w.kind === 'story'; }); }
  function markDone(slug) {
    var w = getWork(slug); if (!w) return;
    if (st.done.indexOf(slug) < 0) { st.done.push(slug); save(); }
    if (w.kind === 'story') { unlock('done'); if (doneStories().length >= ACH_COLLECTOR) unlock('bookworm'); }
    else { unlock('paper1'); if (doneArticles().length >= 3) unlock('articler'); }
  }
  function doneArticles() { return st.done.filter(function (s) { var w = getWork(s); return w && w.kind === 'article'; }); }
  function shelfStories() { return Store.s.favorites.filter(function (s) { var w = getWork(s); return w && w.kind === 'story'; }); }
  function noteShare(slug) {
    if (slug && st.shared.indexOf(slug) < 0) { var w = getWork(slug); if (w && w.kind === 'story') { st.shared.push(slug); save(); } }
    unlock('heart'); if (st.shared.length >= 3) unlock('club');
  }
  function favCount() { return shelfStories().length; }
  function night() { var r = document.getElementById('reader'); return !!(r && r.classList.contains('night')); }

  /* скрытая «Доброй ночи»: читает между 2:00 и 4:59 по местному времени */
  function deepNight() { var h = new Date().getHours(); return h >= 2 && h < 5; }
  /* все сочетания «стиль × режим»: 5 стилей (стандартная, фэнтези, sci-fi, газета, нуар) × 3 режима (день, ночь, тёплый) */
  var COMBO_STYLES = ['standard', 'fantasy', 'scifi', 'gazette', 'noir'], COMBO_MODES = ['day', 'night', 'candle'];
  function comboNow() {
    var r = document.getElementById('reader'); if (!r) return null;
    var cl = r.classList, style = cl.contains('scifi') ? 'scifi' : cl.contains('fantasy') ? 'fantasy' : cl.contains('gazette') ? 'gazette' : cl.contains('noir') ? 'noir' : 'standard';
    var mode = cl.contains('candle') ? 'candle' : cl.contains('night') ? 'night' : 'day';
    return style + '|' + mode;
  }
  function midnight() { var d = new Date(); return d.getHours() === 0 && d.getMinutes() < 15; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  /* открытые тексты: «Любопытный» (пять разных) и «Ну ещё один!» (два разных рассказа за один день) */
  function noteOpen(w) {
    if (st.opened.indexOf(w.slug) < 0) { st.opened.push(w.slug); save(); }
    if (st.opened.length >= 5) unlock('eye');
    if (w.kind === 'story') {
      var t = today(); if (st.dayOpen.d !== t) st.dayOpen = { d: t, s: [] };
      if (st.dayOpen.s.indexOf(w.slug) < 0) { st.dayOpen.s.push(w.slug); save(); }
      if (st.dayOpen.s.length >= 2) unlock('another');
    }
  }

  function init() {
    defs();
    /* возвращение в другой день, дни подряд, периоды суток */
    var t = today(), gap = 0;
    if (st.last && st.last !== t) {
      unlock('back');
      var pp = st.last.split('-'), prev = new Date(+pp[0], +pp[1] - 1, +pp[2]), now = new Date(); now.setHours(0, 0, 0, 0);
      gap = Math.round((now - prev) / 864e5);
      if (gap >= 7) unlock('again');
    }
    if (st.last !== t) { st.streak = (st.last && gap === 1) ? (st.streak || 1) + 1 : 1; st.last = t; save(); }
    else if (!st.streak) { st.streak = 1; save(); }
    if (st.streak >= 3) unlock('regular');
    if (st.streak >= 5) unlock('shadow');
    if (st.streak >= 7) unlock('shadow7');
    function notePeriod() {
      var h = new Date().getHours(), k = h < 6 ? 'n' : h < 12 ? 'm' : h < 18 ? 'd' : 'e';
      if (st.periods.indexOf(k) < 0) { st.periods.push(k); save(); }
      if (st.periods.length >= 4) unlock('cycle');
    }
    notePeriod(); meta();
    var sessionSec = 0, tune = { slug: '', f: 0, t: '', s: '', fd: false, td: false, sd: false };

    /* открыл рассказ + читает в ночной теме */
    if (typeof openReader === 'function') {
      var baseOpen = openReader;
      openReader = function () {
        var r = baseOpen.apply(this, arguments);
        if (r !== false && typeof R !== 'undefined' && R && R.work) { noteOpen(R.work); if (R.work.kind === 'story') { if (st.done.indexOf(R.work.slug) >= 0) unlock('replay'); unlock('first'); } tune = { slug: R.work.slug, f: Store.s.fontSize, t: Store.s.readerTheme, s: (typeof workStyle === 'function' ? workStyle(R.work) : ''), fd: false, td: false, sd: false }; }
        return r;
      };
    }
    if (typeof setReaderPref === 'function') {
      var basePref = setReaderPref;
      setReaderPref = function (k) { var r = basePref.apply(this, arguments); if (k === 'readerTheme' && R) setTimeout(function () { var rd = document.getElementById('reader'); if (rd) { if (rd.classList.contains('night') && !rd.classList.contains('candle')) unlock('dark1'); else if (!rd.classList.contains('night')) unlock('day1'); } }, 100); return r; };
    }
    /* закладка и полка */
    var addBm = Store.addBookmark; Store.addBookmark = function () { var r = addBm.apply(this, arguments); unlock('mark'); return r; };
    var tf = Store.toggleFav; Store.toggleFav = function () { var r = tf.apply(this, arguments); var fc = favCount(); if (fc >= 1) unlock('shelf1'); if (fc >= 3) unlock('shelf'); return r; };
    /* поделился: системное «Поделиться» или копирование ссылки/цитаты */
    if (navigator.share) { var ns = navigator.share.bind(navigator); navigator.share = function () { noteShare(R && R.work ? R.work.slug : ''); return ns.apply(null, arguments); }; }
    var ct = copyText;
    copyText = function (text) {
      if (typeof text === 'string') {
        var m = text.match(/\/s\/([a-z0-9-]+)\.html/);
        if (m) noteShare(m[1]); else if (text.indexOf('— «') >= 0) noteShare(R && R.work ? R.work.slug : '');
      }
      return ct.apply(this, arguments);
    };
    /* открытка из цитаты */
    if (typeof showCardPreview === 'function') { var scp = showCardPreview; showCardPreview = function () { st.cards = (st.cards || 0) + 1; save(); if (st.cards >= 5) unlock('quote'); return scp.apply(this, arguments); }; }
    /* разведчик: обе служебные страницы */
    function visitPage() {
      var h = location.hash.replace(/^#/, ''), ch = false;
      if ((h === '/about' || h === '/author') && st.pages.indexOf(h) < 0) { st.pages.push(h); save(); }
      if (st.pages.indexOf('/about') >= 0 && st.pages.indexOf('/author') >= 0) unlock('scout');
    }
    visitPage(); window.addEventListener('hashchange', visitPage);
    /* следопыт: пять разделов меню */
    function visitSection() {
      var h = location.hash.replace(/^#/, '') || '/', ch = false;
      if (h.charAt(0) !== '/') h = '/' + h;
      if (h === '/') h = '/home';
      if (['/home', '/books', '/articles', '/support', '/contact'].indexOf(h) >= 0 && st.sections.indexOf(h) < 0) { st.sections.push(h); save(); }
      if (st.sections.length >= 5) unlock('paths');
    }
    visitSection(); window.addEventListener('hashchange', visitSection);
    /* исследователь: набрал запрос в поиске */
    document.addEventListener('input', function (e) { if (e.target && e.target.id === 'q' && String(e.target.value).trim().length >= 2) unlock('search'); });
    /* пасхалка: пять нажатий подряд на название сайта в подвале */
    var eggN = 0, eggT = 0;
    document.addEventListener('click', function (e) {
      var n = e.target.closest && e.target.closest('.footer .name'); if (!n) return;
      var now = Date.now(); eggN = now - eggT < 1500 ? eggN + 1 : 1; eggT = now;
      if (eggN >= 5) unlock('easter');
    });
    /* дочитал до конца: мало долистать, нужно ещё провести в тексте разумное время (чтобы не засчитывалось быстрое пролистывание) */
    var lastAct = Date.now();
    ['scroll', 'touchstart', 'touchmove', 'keydown', 'mousemove', 'click', 'wheel'].forEach(function (ev) {
      window.addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true });
    });
    var comboKey = '', comboSec = 0;
    function trackCombo() {
      var k = comboNow(); if (!k) return;
      if (k !== comboKey) { comboKey = k; comboSec = 0; return; }
      comboSec++;
      if (comboSec === 8) {
        if (st.combos.indexOf(k) < 0) { st.combos.push(k); save(); }
        var all = COMBO_STYLES.every(function (a) { return COMBO_MODES.every(function (m) { return st.combos.indexOf(a + '|' + m) >= 0; }); });
        if (all) unlock('themer');
      }
    }
    function needSec(w) { var words = (R && R.words) || 0; return Math.max(75, Math.round(words / 190 * 60 * 0.35)); }
    function check() {
      if (!R || !R.work) return;
      var slug = R.work.slug;
      if (st.done.indexOf(slug) >= 0) return;
      if (st.reached[slug] && (st.time[slug] || 0) >= needSec(R.work)) markDone(slug);
    }
    setInterval(function () {
      if (!document.hidden && new Date().getSeconds() === 0) notePeriod();
      if (R && R.work && !document.hidden && Date.now() - lastAct < 45000) { if (deepNight()) unlock('night3'); if (midnight()) unlock('midnight'); trackCombo();
        if (tune.slug === R.work.slug) {
          if (Store.s.fontSize !== tune.f) tune.fd = true;
          if (Store.s.readerTheme !== tune.t) tune.td = true;
          if (typeof workStyle === 'function' && workStyle(R.work) !== tune.s) tune.sd = true;
          if (tune.fd && tune.td && tune.sd) unlock('tune');
        } }
      if (!R || !R.work || document.hidden || Date.now() - lastAct > 45000) return;
      st.total = (st.total || 0) + 1; sessionSec++;
      if (night()) st.nightSec = (st.nightSec || 0) + 1; else st.daySec = (st.daySec || 0) + 1;
      if (st.total % 10 === 0) save();
      if (st.total >= 900) unlock('time15'); if (st.total >= 1800) unlock('chapter'); if (st.total >= 12780) unlock('abyss');
      if (st.nightSec >= 1800) unlock('owl'); if (st.daySec >= 1800) unlock('lark'); if (sessionSec >= 3600) unlock('session');
      var slug = R.work.slug;
      if (st.done.indexOf(slug) >= 0) return;
      st.time[slug] = (st.time[slug] || 0) + 1;
      if (st.time[slug] % 10 === 0) save();
      check();
    }, 1000);
    window.addEventListener('scroll', function () {
      if (!R || !R.work || st.done.indexOf(R.work.slug) >= 0 || st.reached[R.work.slug]) return;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 400 && window.scrollY / h > 0.92) { st.reached[R.work.slug] = 1; save(); check(); }
    }, { passive: true });
  }

  function pageHtml() {
    defs();
    var vis = ACH.filter(function (a) { return !a.hidden || st.got[a.id]; }), n = ACH.filter(function (a) { return st.got[a.id]; }).length;
    var hiddenLeft = ACH.filter(function (a) { return a.hidden && !st.got[a.id]; }).length;
    function card(a) {
      var got = !!st.got[a.id], extra = '';
      if (a.id === 'bookworm' && !got) extra = '<div class="ap">' + Math.min(doneStories().length, ACH_COLLECTOR) + ' из ' + ACH_COLLECTOR + '</div>';
      if (a.id === 'chapter' && !got) extra = '<div class="ap">' + Math.min(Math.floor(st.total / 60), 30) + ' из 30 мин</div>';
      if (a.id === 'owl' && !got) extra = '<div class="ap">' + Math.min(Math.floor((st.nightSec || 0) / 60), 30) + ' из 30 мин</div>';
      if (a.id === 'lark' && !got) extra = '<div class="ap">' + Math.min(Math.floor((st.daySec || 0) / 60), 30) + ' из 30 мин</div>';
      if (a.id === 'quote' && !got) extra = '<div class="ap">' + Math.min(st.cards || 0, 5) + ' из 5</div>';
      if (a.id === 'regular' && !got) extra = '<div class="ap">' + Math.min(st.streak || 0, 3) + ' из 3 дн.</div>';
      if (a.id === 'shadow' && !got) extra = '<div class="ap">' + Math.min(st.streak || 0, 5) + ' из 5 дн.</div>';
      if (a.id === 'themer' && !got) extra = '<div class="ap">' + Math.min(st.combos.length, COMBO_STYLES.length * COMBO_MODES.length) + ' из ' + COMBO_STYLES.length * COMBO_MODES.length + '</div>';
      if ((a.id === 'gatherer' || a.id === 'keeper') && !got) { var tl = a.id === 'gatherer' ? ['bronze'] : ['bronze', 'silver'], pool = ACH.filter(function (x) { return tl.indexOf(x.tier) >= 0 && x.id !== a.id; }); extra = '<div class="ap">' + pool.filter(function (x) { return st.got[x.id]; }).length + ' из ' + pool.length + '</div>'; }
      if (a.id === 'club' && !got) extra = '<div class="ap">' + Math.min(st.shared.length, 3) + ' из 3</div>';
      if (a.id === 'articler' && !got) extra = '<div class="ap">' + Math.min(doneArticles().length, 3) + ' из 3</div>';
      if (a.id === 'scout' && !got) extra = '<div class="ap">' + Math.min(st.pages.length, 2) + ' из 2</div>';
      if (a.id === 'shelf' && !got) extra = '<div class="ap">' + Math.min(favCount(), 3) + ' из 3</div>';
      if (a.id === 'paths' && !got) extra = '<div class="ap">' + Math.min(st.sections.length, 5) + ' из 5</div>';
      if (a.id === 'eye' && !got) extra = '<div class="ap">' + Math.min(st.opened.length, 5) + ' из 5</div>';
      if (a.id === 'time15' && !got) extra = '<div class="ap">' + Math.min(Math.floor(st.total / 60), 15) + ' из 15 мин</div>';
      return '<div class="ach-card' + (got ? ' got' : '') + '">' + medal(a, !got) + '<div class="an">' + esc(a.name) + '</div><div class="ad">' + esc(a.desc) + '</div>' +
        (got ? '<div class="ap ok">Получено ' + new Date(st.got[a.id]).toLocaleDateString('ru-RU') + '</div>' : (extra || '<div class="ap">Пока не получено</div>')) + '</div>';
    }
    var TN = { bronze: 'Бронза', silver: 'Серебро', gold: 'Золото', purple: 'Пурпур' };
    var sections = ['bronze', 'silver', 'gold', 'purple'].map(function (t) {
      var list = vis.filter(function (a) { return a.tier === t; }); if (!list.length) return '';
      var have = list.filter(function (a) { return st.got[a.id]; }).length;
      return '<section class="ach-tier ' + t + '"><h2 class="ach-th"><span class="ach-dot"></span>' + TN[t] + '<em>' + have + ' / ' + list.length + '</em></h2><div class="ach-grid">' + list.map(card).join('') + '</div></section>';
    }).join('');
    return '<article class="doc ach-page">' + docCloseBtn() + '<h1>Достижения</h1><p class="ach-sub">Получено: ' + n + ' из ' + vis.length + (hiddenLeft ? ' (+ секретные: ' + hiddenLeft + ')' : '') + '. Прогресс хранится только в вашем браузере.</p>' + sections + '</article>';
  }
  return { init: init, unlock: unlock, markDone: markDone, pageHtml: pageHtml };
})();

/* «Аннотация»: перевернуть карточку, чтобы прочитать описание */
document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-desc]')) Ach.unlock('annot'); });

/* касание на телефоне: подсветить и увеличить нажатую медаль */
document.addEventListener('click', function (e) {
  var c = e.target.closest && e.target.closest('.ach-card');
  document.querySelectorAll('.ach-card.tap').forEach(function (x) { if (x !== c) x.classList.remove('tap'); });
  if (c) c.classList.toggle('tap');
});

PAGES['/achievements'] = { title: 'Достижения — ' + SITE.name, render: function () { return Ach.pageHtml(); } };
if (typeof DOC_PATHS !== 'undefined') DOC_PATHS.push('/achievements');
Ach.init();

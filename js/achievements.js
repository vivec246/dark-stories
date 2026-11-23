/* ДОСТИЖЕНИЯ. Хранятся только в браузере читателя (localStorage, ключ ds-achievements).
   Модуль ничего не меняет в остальном коде: он подцепляется к существующим функциям (openReader, Store.addBookmark, Store.toggleFav…)
   и сам определяет, когда выдать значок. Чтобы добавить новое достижение, допишите запись в ACH и вызовите Ach.unlock('id') в нужный момент. */
var ACH_COLLECTOR = 5;   /* сколько рассказов нужно дочитать для «Коллекционера» — когда рассказов станет больше, поднимите число */

var ACH = [
  { id: 'first', name: 'Первый шаг', desc: 'Открыть свой первый рассказ', tier: 'bronze', img: 'img/ach/first.webp' },
  { id: 'mark', name: 'Я остановился тут?', desc: 'Поставить первую закладку', tier: 'bronze', img: 'img/ach/mark.webp' },
  { id: 'heart', name: 'От всего сердца', desc: 'Поделиться рассказом или цитатой', tier: 'bronze', img: 'img/ach/heart.webp' },
  { id: 'scout', name: 'Разведчик', desc: 'Заглянуть в подвал и разузнать о сайте и об авторе', tier: 'bronze', img: 'img/ach/scout.webp' },
  { id: 'shelf1', name: 'Первый том', desc: 'Добавить первый рассказ на полку', tier: 'bronze', img: 'img/ach/shelf1.webp' },
  { id: 'shelf3', name: 'Начало коллекции', desc: 'Добавить три рассказа на полку', tier: 'bronze', img: 'img/ach/shelf3.webp' },
  { id: 'another', name: 'Ну ещё один!', desc: 'Открыть второй рассказ за один день', tier: 'bronze', img: 'img/ach/another.webp' },
  { id: 'dark1', name: 'Тушите свет!', desc: 'Первый раз включить тёмную тему', tier: 'bronze', img: 'img/ach/dark1.webp' },
  { id: 'day1', name: 'С первыми лучами', desc: 'Первый раз включить дневную тему', tier: 'bronze', img: 'img/ach/day1.webp' },
  { id: 'time15', name: 'На досуге', desc: 'Провести за чтением 15 минут', tier: 'bronze', img: 'img/ach/time15.webp' },
  { id: 'search', name: 'Исследователь', desc: 'Воспользоваться поиском рассказов', tier: 'bronze', img: 'img/ach/search.webp' },
  { id: 'paths', name: 'Следопыт', desc: 'Открыть пять разных разделов сайта: главная, книги, статьи, донат и связь', tier: 'bronze', img: 'img/ach/paths.webp' },
  { id: 'paper1', name: 'Это.. газета?', desc: 'Прочитать первую статью', tier: 'bronze', img: 'img/ach/paper1.webp' },
  { id: 'eye', name: 'Любопытный', desc: 'Открыть пять разных рассказов или статей', tier: 'bronze', img: 'img/ach/eye.webp' },
  { id: 'back', name: 'С возвращением!', desc: 'Вернуться на сайт на следующий день', tier: 'bronze', img: 'img/ach/back.webp' },
  { id: 'done', name: 'Стойкий', desc: 'Дочитать рассказ до конца', tier: 'silver',
    ico: '<rect x="30" y="24" width="40" height="52" rx="3"/><path d="M38 24 V76"/><path d="M45 52 L53 60 L66 42"/>' },
  { id: 'shelf', name: 'Мой книжный шкаф', desc: 'Положить 5 рассказов на полку', tier: 'silver',
    ico: '<g transform="translate(5 0)"><rect x="26" y="40" width="12" height="36" rx="1.5"/><rect x="40" y="30" width="12" height="46" rx="1.5"/><rect x="54" y="44" width="10" height="32" rx="1.5"/></g><path d="M20 78 H80"/><path d="M34 48 H40 M48 40 H54" opacity=".6"/>' },
  { id: 'owl', name: 'Сова', desc: 'Читать в ночной теме', tier: 'silver',
    ico: '<path d="M30 38 L35 24 L45 33 H55 L65 24 L70 38 V58 C70 70 61 76 50 76 C39 76 30 70 30 58 Z"/><circle cx="41" cy="46" r="7.5"/><circle cx="59" cy="46" r="7.5"/><circle cx="41" cy="46" r="2.6" fill="currentColor" stroke="none"/><circle cx="59" cy="46" r="2.6" fill="currentColor" stroke="none"/><path d="M47 53 L50 59 L53 53 Z" fill="currentColor" fill-opacity=".5"/><path d="M40 66 C43 69 47 69 50 66 C53 69 57 69 60 66" opacity=".6"/><path d="M26 80 H74"/>' },
  { id: 'collector', name: 'Коллекционер', desc: 'Дочитать ' + ACH_COLLECTOR + ' рассказов', tier: 'gold',
    ico: '<path d="M24 64 L28 36 L41 50 L50 30 L59 50 L72 36 L76 64 Z"/><path d="M24 72 H76"/><circle cx="28" cy="33" r="2.5"/><circle cx="50" cy="27" r="2.5"/><circle cx="72" cy="33" r="2.5"/><path d="M40 58 H60" opacity=".6"/>' },
  { id: 'club', name: 'Книжный клуб', desc: 'Поделиться тремя разными рассказами', tier: 'silver',
    ico: '<circle cx="50" cy="38" r="9"/><path d="M33 66 C33 55 41 50 50 50 C59 50 67 55 67 66"/><circle cx="29" cy="46" r="6.5" opacity=".75"/><path d="M17 68 C17 60 22 56 29 56" opacity=".75"/><circle cx="71" cy="46" r="6.5" opacity=".75"/><path d="M83 68 C83 60 78 56 71 56" opacity=".75"/><path d="M30 74 H70" opacity=".5"/>' },
  { id: 'articler', name: 'Статейник', desc: 'Прочитать три статьи', tier: 'silver',
    ico: '<rect x="24" y="24" width="52" height="52" rx="3"/><path d="M32 34 H68" stroke-width="3.6"/><rect x="32" y="42" width="20" height="16" rx="1"/><path d="M58 44 H68 M58 50 H68 M58 56 H66 M32 66 H68 M32 71 H58" opacity=".75"/>' },
  { id: 'allshelf', name: 'Вся полка', desc: 'Дочитать всё, что лежит на полке (от 3 рассказов)', tier: 'gold',
    ico: '<rect x="25" y="38" width="11" height="34" rx="1.5"/><rect x="38" y="28" width="11" height="44" rx="1.5"/><rect x="51" y="42" width="10" height="30" rx="1.5"/><rect x="63" y="34" width="12" height="38" rx="1.5"/><path d="M19 75 H81"/><circle cx="72" cy="30" r="11" fill="#080c15"/><path d="M66.5 30 L70.5 34 L78 25.5"/>' },
  { id: 'midnight', name: 'Полуночник', desc: 'Читать, когда часы бьют полночь', tier: 'silver', hidden: true,
    ico: '<circle cx="50" cy="52" r="24"/><path d="M50 52 V34 M50 52 H50.1" /><path d="M50 52 L50 36" stroke-width="3.4"/><path d="M50 52 H50" /><path d="M50 32 V36 M50 68 V72 M30 52 H34 M66 52 H70" opacity=".6"/><path d="M26 26 V31 M23.5 28.5 H28.5 M76 24 V28 M74 26 H78" opacity=".7"/>' },
  { id: 'echo', name: 'Эхо', desc: 'Сделать открытку из цитаты', tier: 'silver', hidden: true,
    ico: '<g fill="currentColor" stroke="none"><circle cx="35" cy="38" r="8.5"/><circle cx="65" cy="38" r="8.5"/></g><path d="M27 42 C27 54 31 59 38 62 M57 42 C57 54 61 59 68 62"/><path d="M30 74 C42 82 58 82 70 74" opacity=".6"/>' },
  { id: 'easter', name: 'Пасхалка', desc: 'Найти то, что не должно было быть найдено', tier: 'gold', hidden: true,
    ico: '<path d="M50 24 C64 24 72 42 72 56 C72 68 62 76 50 76 C38 76 28 68 28 56 C28 42 36 24 50 24 Z"/><path d="M30 52 L38 46 L46 54 L54 46 L62 54 L70 46"/><path d="M33 64 H67" opacity=".6"/>' },
  { id: 'again', name: 'Заходи, если что', desc: 'Вернуться после недельного перерыва', tier: 'silver',
    ico: '<path d="M30 76 V26 H62 V76"/><path d="M24 76 H72"/><path d="M30 26 L50 32 V72 L30 76 Z"/><circle cx="45" cy="54" r="1.8" fill="currentColor"/><path d="M54 40 L68 36 M54 52 L70 52 M54 64 L68 68" opacity=".55"/>' },
  { id: 'lord', name: 'Тёмный Лорд вернулся!', desc: 'Вернуться на сайт после месяца отсутствия', tier: 'gold', hidden: true,
    ico: '<path d="M50 30 C39 30 33 40 33 51 C33 63 37 71 31 78 H69 C63 71 67 63 67 51 C67 40 61 30 50 30 Z"/><path d="M43 46 C43 41 57 41 57 46 V55 C57 60 43 60 43 55 Z" fill="currentColor" fill-opacity=".25"/><circle cx="46.5" cy="49" r="1.7" fill="currentColor" stroke="none"/><circle cx="53.5" cy="49" r="1.7" fill="currentColor" stroke="none"/><path d="M37 30 L40 18 L45 26 L50 16 L55 26 L60 18 L63 30" />' },
  { id: 'lark', name: 'Жаворонок', desc: 'Читать в дневной теме', tier: 'silver',
    ico: '<path d="M22 58 C30 46 42 44 50 50 C54 40 64 34 76 36 C70 40 68 46 68 52 C66 64 54 72 42 68 L32 72 L35 63 C30 63 25 61 22 58 Z"/><circle cx="62" cy="44" r="1.6" fill="currentColor" stroke="none"/><path d="M76 36 L84 33" /><path d="M30 28 V34 M24 31 H36 M70 22 V27 M67.5 24.5 H72.5" opacity=".7"/>' },
  { id: 'themer', name: 'Темщик', desc: 'Прочитать во всех стилях и всех режимах читалки', tier: 'gold', hidden: true,
    ico: '<circle cx="50" cy="50" r="22"/><path d="M50 28 V72" /><path d="M50 28 A22 22 0 0 1 50 72 Z" fill="currentColor" fill-opacity=".35"/><path d="M28 50 H72" opacity=".6"/><circle cx="50" cy="50" r="31" stroke-dasharray="2 4" opacity=".6"/>' },
  { id: 'night3', name: 'Доброй ночи', desc: 'Читать глубокой ночью, когда все спят', tier: 'silver', hidden: true,
    ico: '<path d="M52 30 A20 20 0 1 0 68 62 A17 17 0 0 1 52 30 Z"/><path d="M62 24 H72 L62 36 H72" /><path d="M74 40 H80 L74 48 H80" opacity=".8"/><path d="M28 28 V34 M25 31 H31 M76 66 V70 M74 68 H78" opacity=".7"/>' }
];

var Ach = (function () {
  var KEY = 'ds-achievements', st = { got: {}, done: [], last: '', time: {}, reached: {}, combos: [], shared: [], pages: [], total: 0, opened: [], dayOpen: { d: '', s: [] }, sections: [] };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (raw && typeof raw === 'object') { st.got = raw.got || {}; st.done = raw.done || []; st.last = raw.last || ''; st.time = raw.time || {}; st.reached = raw.reached || {}; st.combos = raw.combos || []; st.shared = raw.shared || []; st.pages = raw.pages || []; st.total = raw.total || 0; st.opened = raw.opened || []; st.dayOpen = raw.dayOpen || { d: '', s: [] }; st.sections = raw.sections || []; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function find(id) { for (var i = 0; i < ACH.length; i++) if (ACH[i].id === id) return ACH[i]; return null; }

  var TIERS = { bronze: ['#e0a070', '#7a4a26'], silver: ['#eef2f8', '#7d8794'], gold: ['#fff0b8', '#b98a2c'] };
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
  }

  function doneStories() { return st.done.filter(function (s) { var w = getWork(s); return w && w.kind === 'story'; }); }
  function markDone(slug) {
    var w = getWork(slug); if (!w) return;
    if (st.done.indexOf(slug) < 0) { st.done.push(slug); save(); }
    if (w.kind === 'story') { unlock('done'); if (doneStories().length >= ACH_COLLECTOR) unlock('collector'); checkShelf(); }
    else { unlock('paper1'); if (doneArticles().length >= 3) unlock('articler'); }
  }
  function doneArticles() { return st.done.filter(function (s) { var w = getWork(s); return w && w.kind === 'article'; }); }
  function shelfStories() { return Store.s.favorites.filter(function (s) { var w = getWork(s); return w && w.kind === 'story'; }); }
  function checkShelf() { var sh = shelfStories(); if (sh.length >= 3 && sh.every(function (x) { return st.done.indexOf(x) >= 0; })) unlock('allshelf'); }
  function noteShare(slug) {
    if (slug && st.shared.indexOf(slug) < 0) { var w = getWork(slug); if (w && w.kind === 'story') { st.shared.push(slug); save(); } }
    unlock('heart'); if (st.shared.length >= 3) unlock('club');
  }
  function favCount() { return shelfStories().length; }
  function night() { var r = document.getElementById('reader'); return !!(r && r.classList.contains('night')); }

  /* скрытая «Доброй ночи»: читает между 2:00 и 4:59 по местному времени */
  function deepNight() { var h = new Date().getHours(); return h >= 2 && h < 5; }
  /* все сочетания «стиль × режим»: 4 стиля (стандартная, фэнтези, sci-fi, газета) × 3 режима (день, ночь, тёплый) */
  var COMBO_STYLES = ['standard', 'fantasy', 'scifi', 'gazette'], COMBO_MODES = ['day', 'night', 'candle'];
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
    /* возвращение в другой день */
    var t = today();
    if (st.last && st.last !== t) {
      unlock('back');
      var pp = st.last.split('-'), prev = new Date(+pp[0], +pp[1] - 1, +pp[2]), now = new Date(); now.setHours(0, 0, 0, 0);
      var gap = Math.round((now - prev) / 864e5);
      if (gap >= 7) unlock('again');
      if (gap >= 30) unlock('lord');
    }
    if (st.last !== t) { st.last = t; save(); }

    /* открыл рассказ + читает в ночной теме */
    if (typeof openReader === 'function') {
      var baseOpen = openReader;
      openReader = function () {
        var r = baseOpen.apply(this, arguments);
        if (r !== false && typeof R !== 'undefined' && R && R.work) { noteOpen(R.work); if (R.work.kind === 'story') unlock('first'); setTimeout(function () { if (night()) unlock('owl'); }, 400); }
        return r;
      };
    }
    if (typeof setReaderPref === 'function') {
      var basePref = setReaderPref;
      setReaderPref = function (k) { var r = basePref.apply(this, arguments); if (k === 'readerTheme' && R) setTimeout(function () { if (night()) unlock('owl'); var rd = document.getElementById('reader'); if (rd) { if (rd.classList.contains('night') && !rd.classList.contains('candle')) unlock('dark1'); else if (!rd.classList.contains('night')) unlock('day1'); } }, 100); return r; };
    }
    /* закладка и полка */
    var addBm = Store.addBookmark; Store.addBookmark = function () { var r = addBm.apply(this, arguments); unlock('mark'); return r; };
    var tf = Store.toggleFav; Store.toggleFav = function () { var r = tf.apply(this, arguments); var fc = favCount(); if (fc >= 1) unlock('shelf1'); if (fc >= 3) unlock('shelf3'); if (fc >= 5) unlock('shelf'); checkShelf(); return r; };
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
    if (typeof showCardPreview === 'function') { var scp = showCardPreview; showCardPreview = function () { unlock('echo'); return scp.apply(this, arguments); }; }
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
        if (k.split('|')[1] === 'day') unlock('lark');
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
      if (R && R.work && !document.hidden && Date.now() - lastAct < 45000) { if (deepNight()) unlock('night3'); if (midnight()) unlock('midnight'); trackCombo(); }
      if (!R || !R.work || document.hidden || Date.now() - lastAct > 45000) return;
      st.total = (st.total || 0) + 1; if (st.total % 10 === 0) save(); if (st.total >= 900) unlock('time15');
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
      if (a.id === 'collector' && !got) extra = '<div class="ap">' + Math.min(doneStories().length, ACH_COLLECTOR) + ' из ' + ACH_COLLECTOR + '</div>';
      if (a.id === 'club' && !got) extra = '<div class="ap">' + Math.min(st.shared.length, 3) + ' из 3</div>';
      if (a.id === 'articler' && !got) extra = '<div class="ap">' + Math.min(doneArticles().length, 3) + ' из 3</div>';
      if (a.id === 'scout' && !got) extra = '<div class="ap">' + Math.min(st.pages.length, 2) + ' из 2</div>';
      if (a.id === 'shelf' && !got) extra = '<div class="ap">' + Math.min(favCount(), 5) + ' из 5</div>';
      if (a.id === 'shelf3' && !got) extra = '<div class="ap">' + Math.min(favCount(), 3) + ' из 3</div>';
      if (a.id === 'paths' && !got) extra = '<div class="ap">' + Math.min(st.sections.length, 5) + ' из 5</div>';
      if (a.id === 'eye' && !got) extra = '<div class="ap">' + Math.min(st.opened.length, 5) + ' из 5</div>';
      if (a.id === 'time15' && !got) extra = '<div class="ap">' + Math.min(Math.floor(st.total / 60), 15) + ' из 15 мин</div>';
      return '<div class="ach-card' + (got ? ' got' : '') + '">' + medal(a, !got) + '<div class="an">' + esc(a.name) + '</div><div class="ad">' + esc(a.desc) + '</div>' +
        (got ? '<div class="ap ok">Получено ' + new Date(st.got[a.id]).toLocaleDateString('ru-RU') + '</div>' : (extra || '<div class="ap">Пока не получено</div>')) + '</div>';
    }
    var TN = { bronze: 'Бронза', silver: 'Серебро', gold: 'Золото' };
    var sections = ['bronze', 'silver', 'gold'].map(function (t) {
      var list = vis.filter(function (a) { return a.tier === t; }); if (!list.length) return '';
      var have = list.filter(function (a) { return st.got[a.id]; }).length;
      return '<section class="ach-tier ' + t + '"><h2 class="ach-th"><span class="ach-dot"></span>' + TN[t] + '<em>' + have + ' / ' + list.length + '</em></h2><div class="ach-grid">' + list.map(card).join('') + '</div></section>';
    }).join('');
    return '<article class="doc ach-page">' + docCloseBtn() + '<h1>Достижения</h1><p class="ach-sub">Получено: ' + n + ' из ' + vis.length + (hiddenLeft ? ' (+ секретные: ' + hiddenLeft + ')' : '') + '. Прогресс хранится только в вашем браузере.</p>' + sections + '</article>';
  }
  return { init: init, unlock: unlock, markDone: markDone, pageHtml: pageHtml };
})();

PAGES['/achievements'] = { title: 'Достижения — ' + SITE.name, render: function () { return Ach.pageHtml(); } };
if (typeof DOC_PATHS !== 'undefined') DOC_PATHS.push('/achievements');
Ach.init();

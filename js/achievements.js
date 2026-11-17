/* ДОСТИЖЕНИЯ. Хранятся только в браузере читателя (localStorage, ключ ds-achievements).
   Модуль ничего не меняет в остальном коде: он подцепляется к существующим функциям (openReader, Store.addBookmark, Store.toggleFav…)
   и сам определяет, когда выдать значок. Чтобы добавить новое достижение, допишите запись в ACH и вызовите Ach.unlock('id') в нужный момент. */
var ACH_COLLECTOR = 5;   /* сколько рассказов нужно дочитать для «Коллекционера» — когда рассказов станет больше, поднимите число */

var ACH = [
  { id: 'first', name: 'Ну, поехали', desc: 'Открыть первый рассказ', tier: 'bronze',
    ico: '<path d="M50 34 C40 28 28 28 20 32 V68 C28 64 40 64 50 70 C60 64 72 64 80 68 V32 C72 28 60 28 50 34 Z"/><path d="M50 34 V70"/><path d="M27 40 C33 39 38 39 43 41 M27 48 C33 47 38 47 43 49 M57 41 C62 39 67 39 73 40 M57 49 C62 47 67 47 73 48" opacity=".6"/>' },
  { id: 'done', name: 'Стойкий', desc: 'Дочитать рассказ до конца', tier: 'bronze',
    ico: '<rect x="30" y="24" width="40" height="52" rx="3"/><path d="M38 24 V76"/><path d="M45 52 L53 60 L66 42"/>' },
  { id: 'mark', name: 'Я остановился тут?', desc: 'Поставить закладку', tier: 'bronze',
    ico: '<path d="M34 22 H66 V80 L50 67 L34 80 Z"/><path d="M50 36 L53 43 L60 44 L55 49 L56 56 L50 52 L44 56 L45 49 L40 44 L47 43 Z" opacity=".8"/>' },
  { id: 'shelf', name: 'Мой книжный шкаф', desc: 'Положить 3 рассказа на полку', tier: 'silver',
    ico: '<g transform="translate(5 0)"><rect x="26" y="40" width="12" height="36" rx="1.5"/><rect x="40" y="30" width="12" height="46" rx="1.5"/><rect x="54" y="44" width="10" height="32" rx="1.5"/></g><path d="M20 78 H80"/><path d="M34 48 H40 M48 40 H54" opacity=".6"/>' },
  { id: 'owl', name: 'Сова', desc: 'Читать в ночной теме', tier: 'silver',
    ico: '<path d="M58 24 A27 27 0 1 0 76 62 A23 23 0 0 1 58 24 Z"/><path d="M70 30 V38 M66 34 H74 M78 48 V53 M75.5 50.5 H80.5" opacity=".8"/>' },
  { id: 'back', name: 'С возвращением!', desc: 'Прийти на сайт в другой день', tier: 'silver',
    ico: '<path d="M30 62 A20 20 0 0 1 70 62"/><path d="M20 62 H80"/><path d="M50 30 V37 M31 40 L36 45 M69 40 L64 45 M24 54 L30 55 M76 54 L70 55"/><path d="M30 70 H70 M38 77 H62" opacity=".6"/>' },
  { id: 'heart', name: 'От всего сердца', desc: 'Поделиться рассказом или цитатой', tier: 'bronze',
    ico: '<g transform="translate(-3.5 1)"><path d="M22 47 L80 24 L64 76 L50 58 Z"/><path d="M50 58 L80 24"/><path d="M50 58 L48 74 L58 66"/></g>' },
  { id: 'collector', name: 'Коллекционер', desc: 'Дочитать ' + ACH_COLLECTOR + ' рассказов', tier: 'gold',
    ico: '<path d="M24 64 L28 36 L41 50 L50 30 L59 50 L72 36 L76 64 Z"/><path d="M24 72 H76"/><circle cx="28" cy="33" r="2.5"/><circle cx="50" cy="27" r="2.5"/><circle cx="72" cy="33" r="2.5"/><path d="M40 58 H60" opacity=".6"/>' },
  { id: 'lark', name: 'Жаворонок', desc: 'Читать в дневной теме', tier: 'silver',
    ico: '<path d="M22 58 C30 46 42 44 50 50 C54 40 64 34 76 36 C70 40 68 46 68 52 C66 64 54 72 42 68 L32 72 L35 63 C30 63 25 61 22 58 Z"/><circle cx="62" cy="44" r="1.6" fill="currentColor" stroke="none"/><path d="M76 36 L84 33" /><path d="M30 28 V34 M24 31 H36 M70 22 V27 M67.5 24.5 H72.5" opacity=".7"/>' },
  { id: 'themer', name: 'Темщик', desc: 'Прочитать во всех стилях и всех режимах читалки', tier: 'gold', hidden: true,
    ico: '<circle cx="50" cy="50" r="22"/><path d="M50 28 V72" /><path d="M50 28 A22 22 0 0 1 50 72 Z" fill="currentColor" fill-opacity=".35"/><path d="M28 50 H72" opacity=".6"/><circle cx="50" cy="50" r="31" stroke-dasharray="2 4" opacity=".6"/>' },
  { id: 'night3', name: 'Доброй ночи', desc: 'Читать глубокой ночью, когда все спят', tier: 'silver', hidden: true,
    ico: '<path d="M52 30 A20 20 0 1 0 68 62 A17 17 0 0 1 52 30 Z"/><path d="M62 24 H72 L62 36 H72" /><path d="M74 40 H80 L74 48 H80" opacity=".8"/><path d="M28 28 V34 M25 31 H31 M76 66 V70 M74 68 H78" opacity=".7"/>' }
];

var Ach = (function () {
  var KEY = 'ds-achievements', st = { got: {}, done: [], last: '', time: {}, reached: {}, combos: [] };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (raw && typeof raw === 'object') { st.got = raw.got || {}; st.done = raw.done || []; st.last = raw.last || ''; st.time = raw.time || {}; st.reached = raw.reached || {}; st.combos = raw.combos || []; } } catch (e) {}
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
    if (w.kind === 'story') { unlock('done'); if (doneStories().length >= ACH_COLLECTOR) unlock('collector'); }
  }
  function favCount() { return Store.s.favorites.filter(function (s) { var w = getWork(s); return w && w.kind === 'story'; }).length; }
  function night() { var r = document.getElementById('reader'); return !!(r && r.classList.contains('night')); }

  /* скрытая «Доброй ночи»: читает между 2:00 и 4:59 по местному времени */
  function deepNight() { var h = new Date().getHours(); return h >= 2 && h < 5; }
  /* все сочетания «стиль × режим»: 4 стиля (стандартная, фэнтези, sci-fi, газета) × 3 режима (день, ночь, тёплый) */
  var COMBO_STYLES = ['standard', 'fantasy', 'scifi', 'gazette'], COMBO_MODES = ['day', 'night', 'candle'];
  function comboNow() {
    var r = document.getElementById('reader'); if (!r) return null;
    var cl = r.classList, style = cl.contains('scifi') ? 'scifi' : cl.contains('fantasy') ? 'fantasy' : cl.contains('gazette') ? 'gazette' : 'standard';
    var mode = cl.contains('candle') ? 'candle' : cl.contains('night') ? 'night' : 'day';
    return style + '|' + mode;
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  function init() {
    defs();
    /* возвращение в другой день */
    var t = today();
    if (st.last && st.last !== t) unlock('back');
    if (st.last !== t) { st.last = t; save(); }

    /* открыл рассказ + читает в ночной теме */
    if (typeof openReader === 'function') {
      var baseOpen = openReader;
      openReader = function () {
        var r = baseOpen.apply(this, arguments);
        if (r !== false && typeof R !== 'undefined' && R && R.work) { if (R.work.kind === 'story') unlock('first'); setTimeout(function () { if (night()) unlock('owl'); }, 400); }
        return r;
      };
    }
    if (typeof setReaderPref === 'function') {
      var basePref = setReaderPref;
      setReaderPref = function (k) { var r = basePref.apply(this, arguments); if (k === 'readerTheme' && R) setTimeout(function () { if (night()) unlock('owl'); }, 100); return r; };
    }
    /* закладка и полка */
    var addBm = Store.addBookmark; Store.addBookmark = function () { var r = addBm.apply(this, arguments); unlock('mark'); return r; };
    var tf = Store.toggleFav; Store.toggleFav = function () { var r = tf.apply(this, arguments); if (favCount() >= 3) unlock('shelf'); return r; };
    /* поделился: системное «Поделиться» или копирование ссылки/цитаты */
    if (navigator.share) { var ns = navigator.share.bind(navigator); navigator.share = function () { unlock('heart'); return ns.apply(null, arguments); }; }
    var ct = copyText;
    copyText = function (text) {
      if (typeof text === 'string' && ((text.indexOf('/s/') >= 0 && text.indexOf('.html') >= 0) || text.indexOf('— «') >= 0)) unlock('heart');
      return ct.apply(this, arguments);
    };
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
      if (R && R.work && !document.hidden && Date.now() - lastAct < 45000) { if (deepNight()) unlock('night3'); trackCombo(); }
      if (!R || !R.work || document.hidden || Date.now() - lastAct > 45000) return;
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
    var cards = vis.map(function (a) {
      var got = !!st.got[a.id], extra = '';
      if (a.id === 'collector' && !got) extra = '<div class="ap">' + Math.min(doneStories().length, ACH_COLLECTOR) + ' из ' + ACH_COLLECTOR + '</div>';
      if (a.id === 'shelf' && !got) extra = '<div class="ap">' + Math.min(favCount(), 3) + ' из 3</div>';
      return '<div class="ach-card' + (got ? ' got' : '') + '">' + medal(a, !got) + '<div class="an">' + esc(a.name) + '</div><div class="ad">' + esc(a.desc) + '</div>' +
        (got ? '<div class="ap ok">Получено ' + new Date(st.got[a.id]).toLocaleDateString('ru-RU') + '</div>' : (extra || '<div class="ap">Пока не получено</div>')) + '</div>';
    }).join('');
    return '<article class="doc ach-page">' + docCloseBtn() + '<h1>Достижения</h1><p class="ach-sub">Получено: ' + n + ' из ' + vis.length + (hiddenLeft ? ' (+ секретные: ' + hiddenLeft + ')' : '') + '. Прогресс хранится только в вашем браузере.</p><div class="ach-grid">' + cards + '</div></article>';
  }
  return { init: init, unlock: unlock, markDone: markDone, pageHtml: pageHtml };
})();

PAGES['/achievements'] = { title: 'Достижения — ' + SITE.name, render: function () { return Ach.pageHtml(); } };
if (typeof DOC_PATHS !== 'undefined') DOC_PATHS.push('/achievements');
Ach.init();

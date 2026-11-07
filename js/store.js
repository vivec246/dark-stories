/* ХРАНИЛИЩЕ в localStorage: избранное («Ваша полка»), прогресс чтения, закладки, настройки читалки (тема, шрифт, ширина, интервал). */

var KEY = 'dark-stories-library';
var memory = {};
function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return memory[k] || null; } }
function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { memory[k] = v; } }
var Store = (function () {
  var s = { favorites: [], recent: [], progress: {}, bookmarks: {}, fontSize: 1.1, readerNight: true,
    readerTheme: '', readerFont: 'sans', readerWidth: 'normal', readerLead: 'normal', styleBy: {} };
  try {
    var raw = JSON.parse(lsGet(KEY) || 'null');
    if (raw && raw.state) for (var k in s) if (raw.state[k] !== undefined) s[k] = raw.state[k];
  } catch (e) {}
  /* старое сохранение знало только «ночь/день» — переводим в новую тему */
  if (!s.readerTheme) s.readerTheme = s.readerNight ? 'night' : 'day';
  var timer = null;
  function save(now) {
    clearTimeout(timer);
    var run = function () { lsSet(KEY, JSON.stringify({ state: s, version: 0 })); };
    now ? run() : (timer = setTimeout(run, 250));
  }
  window.addEventListener('pagehide', function () { save(true); });
  return {
    s: s,
    toggleFav: function (slug) {
      var i = s.favorites.indexOf(slug);
      i >= 0 ? s.favorites.splice(i, 1) : s.favorites.push(slug); save(true);
    },
    isFav: function (slug) { return s.favorites.indexOf(slug) >= 0; },
    addRecent: function (slug) {
      if (s.recent[0] === slug) return;
      s.recent = [slug].concat(s.recent.filter(function (x) { return x !== slug; })).slice(0, 10); save(true);
    },
    setProgress: function (slug, p) {
      var prev = s.progress[slug];
      if (prev && prev.percent === p.percent && Math.abs(prev.scrollTop - p.scrollTop) < 8) return;
      s.progress[slug] = p; save();
    },
    clearProgress: function (slug) { delete s.progress[slug]; save(true); },
    pct: function (slug) { return (s.progress[slug] && s.progress[slug].percent) || 0; },
    addBookmark: function (slug, bm) {
      var list = s.bookmarks[slug] || [];
      list.push({ id: 'bm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7), text: bm.text, pos: bm.pos, time: new Date().toLocaleString('ru-RU') });
      s.bookmarks[slug] = list; save(true);
    },
    removeBookmark: function (slug, id) { s.bookmarks[slug] = (s.bookmarks[slug] || []).filter(function (b) { return b.id !== id; }); save(true); },
    setFont: function (v) { s.fontSize = v; save(); },
    setNight: function (v) { s.readerNight = v; save(true); },
    setStyle: function (slug, v) { s.styleBy[slug] = v; save(true); },
    setPref: function (k, v) { s[k] = v; if (k === 'readerTheme') s.readerNight = v !== 'day'; save(true); }
  };
})();

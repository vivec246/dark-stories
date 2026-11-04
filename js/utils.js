/* ОБЩИЕ ФУНКЦИИ: выбор элементов, экранирование, тосты, копирование, тексты по slug. */

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function icon(n, cls) { return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[n] + '</svg>'; }
function slugify(v) { var s = v.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-+|-+$/g, ''); return s || 'section'; }
function fmtMin(m) { return (m < 1 ? 1 : m) + ' мин'; }
function getWork(slug) { for (var i = 0; i < WORKS.length; i++) if (WORKS[i].slug === slug) return WORKS[i]; return null; }
function byKind(k) { return WORKS.filter(function (w) { return w.kind === k; }); }
function toast(msg) {
  var t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('on'); }, 2600);
}
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  return new Promise(function (res, rej) {
    try {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); var ok = document.execCommand('copy'); ta.remove(); ok ? res() : rej();
    } catch (e) { rej(e); }
  });
}

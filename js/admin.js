/* АДМИНКА Dark Stories (admin.html).
   Сайт статичный: список текстов лежит в js/data.js, сами тексты — в .md, обложки — в covers/, картинки шапки — в cap/.
   Админка правит те же файлы: все изменения копятся в черновике и уходят на сайт кнопкой «Опубликовать» тремя способами:
     1) в репозиторий GitHub одним коммитом (нужен токен доступа — именно он защищает сайт от посторонних);
     2) прямо в папку сайта на компьютере (Chrome / Edge);
     3) ZIP-архивом с изменёнными файлами.
   Данные (SITE, HERO, HERO_FOCUS, WORKS, NEWS) и функции esc / icon / parseMd / rich / stripMd берутся из файлов самого сайта. */

(function () {
'use strict';

/* ───────── иконки ───────── */
Object.assign(ICONS, {
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  zip: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>'
});

/* ───────── состояние ───────── */
var S = null;           // рабочая копия данных сайта: SITE, HERO, HERO_FOCUS, NOTES, WORKS, NEWS
var BASE = null;        // то, что сейчас на сайте (для сравнения)
var REPO = new Set();   // файлы, которые уже есть на сайте (обложки, тексты, картинки шапки)
var files = {};         // изменения файлов: путь → {type:'text'|'bin'|'del', text|blob}
var texts = {};         // загруженные тексты .md (рабочая версия)
var origTexts = {};     // тексты, какими они лежат на сайте
var URLS = {};          // путь → blob-адрес только что загруженной картинки (для предпросмотра)
var UI = { q: '', filter: 'all', tab: 'edit' };
var CONN = { mode: localGet('ds-admin-mode') || 'github', dir: null, dirName: '', gh: loadGh() };
var KEYS = ['slug', 'kind', 'path', 'cover', 'title', 'shortTitle', 'description', 'genre', 'age', 'year', 'status', 'minutes', 'readerStyle', 'readerStyleChoice', 'art', 'cycle'];
var MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

function localGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function localSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function localDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
function loadGh() {
  var g = { owner: '', repo: '', branch: 'main', prefix: '', token: '', remember: true };
  try { var r = JSON.parse(localGet('ds-admin-gh') || 'null'); if (r) for (var k in g) if (r[k] !== undefined) g[k] = r[k]; } catch (e) {}
  return g;
}
function saveGh() {
  var g = CONN.gh, c = { owner: g.owner, repo: g.repo, branch: g.branch, prefix: g.prefix, remember: g.remember, token: g.remember ? g.token : '' };
  localSet('ds-admin-gh', JSON.stringify(c));
}
var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

function initState(d, notes) {
  S = { SITE: clone(d.SITE), HERO: clone(d.HERO), HERO_FOCUS: clone(d.HERO_FOCUS), NOTES: notes || {}, WORKS: clone(d.WORKS), NEWS: clone(d.NEWS) };
  baseline();
}
function baseline() {
  BASE = clone(S);
  REPO = new Set();
  S.WORKS.forEach(function (w) { REPO.add(w.path); REPO.add(w.cover); if (w.art) REPO.add(w.art); });
  REPO.add('art/fantasy.jpg');
  S.HERO.forEach(function (p) { REPO.add(p); });
  files = {};
  Object.keys(texts).forEach(function (p) { origTexts[p] = texts[p]; });
}

/* ───────── мелочи ───────── */
var TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
function toSlug(s) {
  return s.toLowerCase().split('').map(function (c) { return TR[c] !== undefined ? TR[c] : c; }).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function fmtSize(n) { return n < 1024 ? n + ' Б' : n < 1048576 ? Math.round(n / 1024) + ' КБ' : (n / 1048576).toFixed(1) + ' МБ'; }
function calcMinutes(t) { return Math.max(1, Math.round(stripMd(t).length / 1090)); }
function monthNow() { var d = new Date(); return MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
function wordsN(n, a, b, c) { var m = n % 100, k = n % 10; return n + ' ' + (m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c); }
function kindName(k) { return k === 'article' ? 'Статья' : 'Рассказ'; }
function work(slug) { for (var i = 0; i < S.WORKS.length; i++) if (S.WORKS[i].slug === slug) return S.WORKS[i]; return null; }
function imgUrl(p) { return URLS[p] || p; }
var toastT;
function notify(msg, err) {
  var t = document.getElementById('toast'); t.textContent = msg; t.className = 'toast on' + (err ? ' err' : '');
  clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'toast'; }, err ? 5000 : 2600);
}
function dirOf(slug) { return slug.replace(/-/g, '_'); }

/* ───────── вывод data.js ───────── */
function serialize() {
  var J = function (v) { return JSON.stringify(v, null, 2); };
  var site = Object.keys(S.SITE).map(function (k) { return '  ' + k + ': ' + JSON.stringify(S.SITE[k]); }).join(',\n');
  var focus = S.HERO.map(function (p, i) {
    var f = Number(S.HERO_FOCUS[p]); if (isNaN(f)) f = 50;
    var n = (S.NOTES[p] || '').replace(/[\r\n]+/g, ' ').trim();
    return "  '" + p + "': " + Math.round(f) + (i < S.HERO.length - 1 ? ',' : '') + (n ? '   // ' + n : '');
  }).join('\n');
  var works = S.WORKS.map(function (w) {
    var o = {};
    KEYS.forEach(function (k) {
      if (w[k] === undefined) return;
      if (k === 'cycle' && !(w.cycle && w.cycle.length)) return;
      var custom = w.readerStyle === 'scifi' || w.readerStyle === 'fantasy';
      if (k === 'readerStyle' && !custom) return;
      if (k === 'readerStyleChoice' && !(w.readerStyleChoice && custom)) return;
      if (k === 'art' && !(w.art && w.readerStyle === 'fantasy')) return;
      o[k] = w[k];
    });
    return o;
  });
  var news = S.NEWS.map(function (n) {
    return '  { ' + Object.keys(n).map(function (k) { return k + ': ' + JSON.stringify(n[k]); }).join(', ') + ' }';
  }).join(',\n');
  return '/* ДАННЫЕ САЙТА: контакты, шапка, список текстов (WORKS), новости.\n' +
    '   Файл обновляется админкой (admin.html), но его можно править и руками.\n' +
    '   Чтобы добавить рассказ или статью — положите .md в stories/ или articles/ и добавьте блок в WORKS. */\n\n' +
    'var SITE = {\n' + site + '\n};\n' +
    'var HERO = ' + J(S.HERO) + ';\n' +
    '/* Где в картинке главный объект (число — процент от ширины картинки: 0 — левый край, 50 — середина, 100 — правый).\n' +
    '   Когда экран узкий (телефон) и картинка обрезается по бокам, сайт сам подбирает кадр так,\n' +
    '   чтобы этот объект оказался по центру. По вертикали всегда показывается верх картинки. */\n' +
    'var HERO_FOCUS = {\n' + focus + '\n};\n\n' +
    '/* Список текстов: чтобы добавить рассказ — положите .md в stories/ или articles/ и добавьте строку сюда */\n' +
    'var WORKS = ' + J(works) + ';\n\n' +
    'var NEWS = [\n' + news + '\n];\n';
}
function parseData(text) {
  var d = new Function(text + '\n;return {SITE:SITE,HERO:HERO,HERO_FOCUS:HERO_FOCUS,WORKS:WORKS,NEWS:NEWS};')();
  var notes = {}, re = /'(cap\/[^']+)'\s*:\s*[\d.]+\s*,?[ \t]*\/\/[ \t]*(.*)$/gm, m;
  while ((m = re.exec(text))) notes[m[1]] = m[2].trim();
  return { d: d, notes: notes };
}
function pickData(x) { return JSON.stringify({ a: x.SITE, b: x.HERO, c: x.HERO_FOCUS, d: x.NOTES, e: x.WORKS, f: x.NEWS }); }
function dataChanged() { return pickData(S) !== pickData(BASE); }

/* что изменилось, словами */
function summary() {
  var out = [], a = {}, b = {};
  BASE.WORKS.forEach(function (w) { a[w.slug] = w; });
  S.WORKS.forEach(function (w) { b[w.slug] = w; });
  S.WORKS.forEach(function (w) { if (!a[w.slug]) out.push('Новый текст: «' + w.title + '»'); else if (JSON.stringify(a[w.slug]) !== JSON.stringify(w)) out.push('Изменены данные: «' + w.title + '»'); });
  BASE.WORKS.forEach(function (w) { if (!b[w.slug]) out.push('Удалён текст: «' + w.title + '»'); });
  var oa = BASE.WORKS.filter(function (w) { return b[w.slug]; }).map(function (w) { return w.slug; }).join();
  var ob = S.WORKS.filter(function (w) { return a[w.slug]; }).map(function (w) { return w.slug; }).join();
  if (oa !== ob) out.push('Изменён порядок текстов на полке');
  if (JSON.stringify(BASE.NEWS) !== JSON.stringify(S.NEWS)) out.push('Новости изменены');
  if (JSON.stringify([BASE.HERO, BASE.HERO_FOCUS, BASE.NOTES]) !== JSON.stringify([S.HERO, S.HERO_FOCUS, S.NOTES])) out.push('Шапка сайта изменена');
  if (JSON.stringify(BASE.SITE) !== JSON.stringify(S.SITE)) out.push('Настройки сайта изменены');
  return out;
}
function pendingCount() { return (dataChanged() ? 1 : 0) + Object.keys(files).length; }

/* проверка перед публикацией */
function validate() {
  var errs = [], warns = [], seen = {};
  S.WORKS.forEach(function (w) {
    var at = '#/works/' + w.slug, name = '«' + (w.title || w.slug) + '»';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(w.slug)) errs.push({ t: name + ': адрес должен состоять из латинских букв, цифр и дефисов', at: at });
    if (seen[w.slug]) errs.push({ t: name + ': такой адрес уже занят другим текстом', at: at });
    seen[w.slug] = 1;
    if (!(w.title || '').trim()) errs.push({ t: 'У текста «' + w.slug + '» нет названия', at: at });
    if (!(w.description || '').trim()) errs.push({ t: name + ': нет описания', at: at });
    if (!(w.genre || '').trim()) errs.push({ t: name + ': не указан жанр', at: at });
    var hasText = (files[w.path] && files[w.path].type === 'text' && files[w.path].text.trim()) || (REPO.has(w.path) && !(files[w.path] && files[w.path].type === 'del'));
    if (!hasText) errs.push({ t: name + ': нет текста (файл ' + w.path + ' пуст или не создан)', at: at });
    if (!(files[w.cover] && files[w.cover].type === 'bin') && !REPO.has(w.cover)) warns.push({ t: name + ': нет обложки — на сайте будет заглушка', at: at });
    if (!(w.shortTitle || '').trim()) warns.push({ t: name + ': нет короткого названия для корешка', at: at });
  });
  S.NEWS.forEach(function (n, i) { if (!(n.title || '').trim()) errs.push({ t: 'Новость №' + (i + 1) + ': нет заголовка', at: '#/news' }); });
  if (!S.HERO.length) errs.push({ t: 'В шапке сайта нет ни одной картинки', at: '#/hero' });
  return { errs: errs, warns: warns };
}

/* ───────── чтение и запись файлов ───────── */
function splitPath(p) { return p.split('/').filter(Boolean); }
async function dirHandle(parts, create) {
  var d = CONN.dir;
  for (var i = 0; i < parts.length; i++) d = await d.getDirectoryHandle(parts[i], { create: !!create });
  return d;
}
async function folderRead(path) {
  var parts = splitPath(path), name = parts.pop();
  var fh = await (await dirHandle(parts)).getFileHandle(name);
  return (await fh.getFile()).text();
}
async function readText(path) {
  if (path in texts) return texts[path];
  var t;
  if (CONN.dir) t = await folderRead(path);
  else {
    var r = await fetch(path + '?_=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    t = await r.text();
  }
  texts[path] = t; origTexts[path] = t;
  return t;
}
function setText(path, t) {
  texts[path] = t;
  if (origTexts[path] === undefined) files[path] = { type: 'text', text: t };
  else if (t === origTexts[path]) delete files[path];
  else files[path] = { type: 'text', text: t };
  chrome();
}
function setBin(path, blob) {
  if (URLS[path]) URL.revokeObjectURL(URLS[path]);
  URLS[path] = URL.createObjectURL(blob);
  files[path] = { type: 'bin', blob: blob };
  chrome();
}
function removeFile(path) {
  if (REPO.has(path)) files[path] = { type: 'del' }; else delete files[path];
  delete texts[path]; delete origTexts[path];
}

/* список файлов к отправке (data.js собирается из рабочей копии) */
function outgoing() {
  var list = [];
  if (dataChanged()) list.push({ path: 'js/data.js', type: 'text', text: serialize() });
  Object.keys(files).forEach(function (p) { list.push(Object.assign({ path: p }, files[p])); });
  return list;
}
function fileSize(f) { return f.type === 'text' ? new Blob([f.text]).size : f.type === 'bin' ? f.blob.size : 0; }

/* ───────── окна ───────── */
function modal(o) {
  return new Promise(function (res) {
    var ov = document.createElement('div'); ov.className = 'ov';
    ov.innerHTML = '<div class="modal' + (o.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(o.title) + '"><h3>' + esc(o.title) + '</h3><div class="body">' + o.body + '</div><div class="foot">' +
      o.actions.map(function (a, i) { return '<button type="button" class="btn ' + (a.cls || '') + '" data-i="' + i + '">' + a.label + '</button>'; }).join('') + '</div></div>';
    var close = function (v) { ov.remove(); document.removeEventListener('keydown', key); res(v); };
    var key = function (e) { if (e.key === 'Escape') close(null); };
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(null); });
    ov.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]'); if (!b) return;
      var a = o.actions[+b.dataset.i];
      var r = a.run ? a.run(ov, close) : a.value;
      if (r !== false) close(r);
    });
    document.addEventListener('keydown', key);
    document.body.appendChild(ov);
    if (o.onOpen) o.onOpen(ov, close);
    var f = ov.querySelector('input:not([type=range]),select,textarea'); if (f) f.focus();
  });
}
function ask(title, text, ok, danger) {
  return modal({ title: title, body: '<p>' + text + '</p>', actions: [{ label: 'Отмена', cls: 'ghost', value: null }, { label: ok || 'Да', cls: danger ? 'danger' : '', value: true }] }).then(function (v) { return v === true; });
}

/* ───────── картинки ───────── */
function loadImg(file) {
  return new Promise(function (res, rej) {
    var u = URL.createObjectURL(file), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); res(im); };
    im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('Не удалось открыть картинку')); };
    im.src = u;
  });
}
function toBlob(canvas) { return new Promise(function (res) { canvas.toBlob(res, 'image/jpeg', 0.86); }); }
function drawCrop(ctx, im, cw, ch, zoom, x, y) {
  var sc = Math.max(cw / im.naturalWidth, ch / im.naturalHeight) * zoom, dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(im, -(dw - cw) * x / 100, -(dh - ch) * y / 100, dw, dh);
  return { ox: dw - cw, oy: dh - ch };
}
/* окно кадрирования обложки: 3:4, 600×800, как у остальных обложек сайта */
async function cropCover(file) {
  var im = await loadImg(file), st = { z: 1, x: 50, y: 50 }, PW = 270, PH = 360, cv, ctx;
  var paint = function () { return drawCrop(ctx, im, PW, PH, st.z, st.x, st.y); };
  return modal({
    title: 'Обложка', wide: true,
    body: '<div class="crop"><canvas width="' + PW + '" height="' + PH + '" id="cropCv" aria-label="Кадр обложки"></canvas><div style="display:grid;gap:1rem">' +
      '<p class="small muted">Перетащите картинку мышью или пальцем, чтобы выбрать кадр. Обложка сохранится в размере 600×800 (3:4), как остальные.</p>' +
      '<div class="f"><label for="cz">Масштаб</label><input id="cz" type="range" min="1" max="3" step="0.01" value="1"></div>' +
      '<div class="f"><label for="cx">По горизонтали</label><input id="cx" type="range" min="0" max="100" value="50"></div>' +
      '<div class="f"><label for="cy">По вертикали</label><input id="cy" type="range" min="0" max="100" value="50"></div></div></div>',
    actions: [{ label: 'Отмена', cls: 'ghost', value: null }, {
      label: 'Использовать', run: function (ov, close) {
        var c = document.createElement('canvas'); c.width = 600; c.height = 800;
        drawCrop(c.getContext('2d'), im, 600, 800, st.z, st.x, st.y);
        toBlob(c).then(close); return false;
      }
    }],
    onOpen: function (ov) {
      cv = ov.querySelector('#cropCv'); ctx = cv.getContext('2d'); paint();
      var sync = function () { ov.querySelector('#cx').value = st.x; ov.querySelector('#cy').value = st.y; };
      ov.querySelector('#cz').oninput = function (e) { st.z = +e.target.value; paint(); };
      ov.querySelector('#cx').oninput = function (e) { st.x = +e.target.value; paint(); };
      ov.querySelector('#cy').oninput = function (e) { st.y = +e.target.value; paint(); };
      var drag = null;
      cv.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
      cv.addEventListener('pointerup', function () { drag = null; cv.style.cursor = ''; });
      cv.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var k = cv.getBoundingClientRect().width / PW, o = paint();
        if (o.ox > 1) st.x = Math.min(100, Math.max(0, st.x - (e.clientX - drag.x) / k / o.ox * 100));
        if (o.oy > 1) st.y = Math.min(100, Math.max(0, st.y - (e.clientY - drag.y) / k / o.oy * 100));
        drag = { x: e.clientX, y: e.clientY }; paint(); sync();
      });
    }
  });
}
/* картинка шапки: без кадрирования, только сжатие до 1792 px по ширине */
async function prepareHeader(file) {
  var im = await loadImg(file), k = Math.min(1, 1792 / im.naturalWidth);
  var c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
  c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
  return toBlob(c);
}

/* ───────── каркас страницы ───────── */
var NAV = [['home', 'Обзор', 'grid'], ['works', 'Тексты', 'book'], ['news', 'Новости', 'news'], ['hero', 'Шапка', 'image'], ['site', 'Сайт', 'sliders'], ['publish', 'Публикация', 'send']];
function renderShell() {
  document.getElementById('app').innerHTML =
    '<div class="adm"><aside class="side"><div class="brand"><b>Dark Stories</b><span class="eyebrow">Панель автора</span></div>' +
    '<nav class="nav" aria-label="Разделы админки">' + NAV.map(function (n) {
      return '<a href="#/' + n[0] + '" data-nav="' + n[0] + '">' + icon(n[2]) + '<span>' + n[1] + '</span>' + (n[0] === 'publish' ? '<i class="n hide" id="navN"></i>' : '') + '</a>';
    }).join('') + '</nav>' +
    '<div class="side-foot"><a href="index.html" target="_blank" rel="noopener">' + icon('external') + 'Открыть сайт</a></div></aside>' +
    '<div class="col"><header class="top"><h1 id="ttl"></h1><span class="sp"></span><span class="pend" id="pend"></span>' +
    '<a class="btn sm" href="#/publish">' + icon('send') + '<span>Опубликовать</span></a></header><main class="view" id="view"></main></div></div>';
}
/* обновляем значок «изменения не опубликованы» без перерисовки страницы */
function chrome() {
  var n = pendingCount(), p = document.getElementById('pend'), b = document.getElementById('navN');
  if (p) { p.className = 'pend' + (n ? '' : ' clean'); p.innerHTML = '<i></i><span>' + (n ? 'Не опубликовано: ' + n : 'Всё опубликовано') + '</span>'; }
  if (b) { b.textContent = n; b.classList.toggle('hide', !n); }
}
function setTitle(t) { var e = document.getElementById('ttl'); if (e) e.textContent = t; document.title = t + ' — Админка Dark Stories'; }

/* ───────── разделы ───────── */
function field(label, bind, val, o) {
  o = o || {};
  var id = 'f_' + bind.replace(/\W/g, '_');
  var inner = o.area ? '<textarea class="ta" id="' + id + '" data-bind="' + bind + '" rows="' + (o.rows || 3) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>' + esc(val == null ? '' : val) + '</textarea>'
    : o.options ? '<select class="sel" id="' + id + '" data-bind="' + bind + '">' + o.options.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>'
    : '<input class="in" id="' + id + '" data-bind="' + bind + '" type="' + (o.type || 'text') + '" value="' + esc(val == null ? '' : val) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.list ? ' list="' + o.list + '"' : '') + (o.ro ? ' readonly' : '') + (o.attrs || '') + '>';
  return '<div class="f"' + (o.cls ? ' style="' + o.cls + '"' : '') + '><label for="' + id + '">' + label + '</label>' + inner + (o.hint ? '<small>' + o.hint + '</small>' : '') + '</div>';
}

var VIEWS = {};

VIEWS.home = function () {
  var w = S.WORKS, pub = w.filter(function (x) { return x.status === 'published'; }).length;
  var v = validate(), probs = v.errs.map(function (x) { return Object.assign({ c: 'err' }, x); }).concat(v.warns.map(function (x) { return Object.assign({ c: 'warn' }, x); }));
  var hero = S.HERO[Math.floor(Math.random() * S.HERO.length)] || '';
  var sum = summary(), n = pendingCount();
  return { title: 'Обзор', html:
    '<div class="banner">' + (hero ? '<img src="' + esc(imgUrl(hero)) + '" alt="">' : '') + '<div class="banner-in"><span class="eyebrow">Панель автора</span><h2>' + esc(S.SITE.name) + '</h2><p class="muted">' + esc(S.SITE.author) + '</p></div></div>' +
    (location.protocol === 'file:' ? '<div class="note" style="margin-bottom:1.2rem"><b>Админка открыта как файл.</b> Чтобы она видела тексты, подключите папку сайта на вкладке «<a class="acc" href="#/publish">Публикация</a>».</div>' : '') +
    '<div class="stats"><div class="stat"><b>' + w.length + '</b><span>Текстов</span></div><div class="stat"><b>' + w.filter(function (x) { return x.kind === 'story'; }).length + '</b><span>Рассказов</span></div><div class="stat"><b>' + w.filter(function (x) { return x.kind === 'article'; }).length + '</b><span>Статей</span></div><div class="stat"><b>' + (w.length - pub) + '</b><span>Пишутся</span></div></div>' +
    '<div class="card"><h2>Быстрые действия</h2><p class="lead">Всё, что вы меняете, сначала попадает в черновик и появляется на сайте только после публикации.</p><div class="acts">' +
    '<button class="btn" data-act="new-work">' + icon('plus') + 'Новый текст</button><a class="btn outline" href="#/news">' + icon('news') + 'Новость</a><a class="btn outline" href="#/hero">' + icon('image') + 'Шапка</a><a class="btn outline" href="#/publish">' + icon('send') + 'Опубликовать</a></div></div>' +
    '<div class="grid g2"><div class="card"><h2>Черновик</h2><p class="lead">' + (n ? 'Ждёт публикации (' + n + '):' : 'Изменений нет — сайт соответствует админке.') + '</p>' +
    (sum.length ? '<ul class="chg">' + sum.map(function (s) { return '<li><span class="p">' + esc(s) + '</span></li>'; }).join('') + '</ul>' : '') +
    (Object.keys(files).length ? '<p class="small muted" style="margin-top:.8rem">Файлов изменено: ' + Object.keys(files).length + '</p>' : '') + '</div>' +
    '<div class="card"><h2>Проверка</h2><p class="lead">' + (probs.length ? 'Стоит поправить:' : 'Всё в порядке.') + '</p>' +
    (probs.length ? '<div class="probs">' + probs.slice(0, 6).map(function (p) { return '<div class="prob ' + p.c + '"><span>' + esc(p.t) + ' <a href="' + p.at + '">Открыть</a></span></div>'; }).join('') + (probs.length > 6 ? '<p class="small muted">…и ещё ' + (probs.length - 6) + '</p>' : '') + '</div>' : '') + '</div></div>' };
};

/* —— Тексты: список —— */
function listHtml() {
  var q = UI.q.trim().toLowerCase(), flt = UI.filter, movable = flt === 'all' && !q;
  var rows = S.WORKS.map(function (x, i) { return { w: x, i: i }; }).filter(function (o) {
    var w = o.w;
    if (flt === 'story' && w.kind !== 'story') return false;
    if (flt === 'article' && w.kind !== 'article') return false;
    if (flt === 'wip' && w.status !== 'wip') return false;
    return !q || (w.title + ' ' + w.genre + ' ' + w.slug).toLowerCase().indexOf(q) >= 0;
  });
  if (!rows.length) return '<div class="empty">Ничего не найдено</div>';
  return '<div class="rows">' + rows.map(function (o) {
    var w = o.w, isNew = !BASE.WORKS.some(function (b) { return b.slug === w.slug; });
    return '<div class="row" data-href="#/works/' + esc(w.slug) + '"><div class="thumb"><img src="' + esc(imgUrl(w.cover)) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
      '<div style="min-width:0"><h3>' + esc(w.title) + '</h3><div class="meta"><span>' + kindName(w.kind) + '</span><span>·</span><span>' + esc(w.genre) + '</span><span>·</span><span>' + esc(w.year) + '</span><span>·</span><span>' + esc(w.age) + '</span><span>·</span><span>~' + esc(w.minutes) + ' мин</span></div></div>' +
      '<div class="bds">' + (isNew ? '<span class="badge acc">новый</span>' : '') + (w.cycle && w.cycle.length ? '<span class="badge">цикл · ' + w.cycle.length + '</span>' : '') + (w.readerStyle === 'scifi' ? '<span class="badge acc">Sci-Fi</span>' : w.readerStyle === 'fantasy' ? '<span class="badge acc">Фэнтези</span>' : '') + '<span class="badge ' + (w.status === 'wip' ? 'wip' : 'ok') + '">' + (w.status === 'wip' ? 'Пишется' : 'Опубликован') + '</span></div>' +
      (movable ? '<div class="mv"><button type="button" class="btn ghost sm ico-only" data-act="mv-work" data-i="' + o.i + '" data-d="-1" aria-label="Выше"' + (o.i === 0 ? ' disabled' : '') + '>' + icon('up') + '</button><button type="button" class="btn ghost sm ico-only" data-act="mv-work" data-i="' + o.i + '" data-d="1" aria-label="Ниже"' + (o.i === S.WORKS.length - 1 ? ' disabled' : '') + '>' + icon('down') + '</button></div>' : '<span></span>') + '</div>';
  }).join('') + '</div>';
}
VIEWS.works = function (arg) {
  if (arg) return VIEWS.work(arg);
  return { title: 'Тексты', html:
    '<div class="page-h"><div><span class="eyebrow">Полка</span><h2>Рассказы и статьи</h2></div><span class="sp"></span><button class="btn" data-act="new-work">' + icon('plus') + 'Новый текст</button></div>' +
    '<div class="tools"><input class="in" id="wq" type="search" placeholder="Поиск по названию, жанру…" aria-label="Поиск" value="' + esc(UI.q) + '"><div class="chips" id="wf">' +
    [['all', 'Все'], ['story', 'Рассказы'], ['article', 'Статьи'], ['wip', 'Пишутся']].map(function (c) { return '<button type="button" class="chip' + (UI.filter === c[0] ? ' on' : '') + '" data-act="filter" data-v="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div></div>' +
    '<div class="acts" style="margin-bottom:1rem"><button class="btn outline sm" data-act="scifi-all">Sci-Fi для всей научной фантастики</button><button class="btn outline sm" data-act="fantasy-all">«Фэнтези» для всего фэнтези</button></div>' +
    '<p class="small muted" style="margin-bottom:1rem">Порядок здесь — порядок на сайте. Стрелки доступны, когда включён фильтр «Все» и поиск пуст.</p>' +
    '<div id="list">' + listHtml() + '</div>' };
};

/* —— Тексты: редактор —— */
function editorHtml(w, t) {
  var prev = UI.tab === 'prev';
  return '<div class="tb"' + (prev ? ' style="display:none"' : '') + ' id="tb">' +
    '<button type="button" data-act="md" data-m="h2" title="Заголовок раздела">H2</button><button type="button" data-act="md" data-m="h3" title="Подзаголовок">H3</button><span class="sep"></span>' +
    '<button type="button" data-act="md" data-m="b" title="Жирный (Ctrl+B)"><b>Ж</b></button><button type="button" data-act="md" data-m="i" title="Курсив (Ctrl+I)"><i>К</i></button><span class="sep"></span>' +
    '<button type="button" data-act="md" data-m="q" title="Цитата">❝</button><button type="button" data-act="md" data-m="c" title="По центру">⟷</button><button type="button" data-act="md" data-m="hr" title="Разделитель">—</button></div>' +
    (prev ? '<div class="prev" id="prev"></div>' : '<textarea class="ta ed" id="ed" spellcheck="true" aria-label="Текст"></textarea>') +
    '<div class="counts" id="counts"></div>';
}
function updCounts() {
  var c = document.getElementById('counts'), w = curWork(); if (!c || !w) return;
  var t = texts[w.path] || '', words = (t.trim() ? t.trim().split(/\s+/).length : 0), ch = stripMd(t).length;
  c.innerHTML = '<span>' + wordsN(words, 'слово', 'слова', 'слов') + '</span><span>' + ch.toLocaleString('ru-RU') + ' знаков</span><span>~' + calcMinutes(t) + ' мин чтения</span>' + (files[w.path] ? '<span class="acc">изменён</span>' : '');
}
function curWork() { var p = parseHash(); return p[0] === 'works' && p[1] ? work(decodeURIComponent(p[1])) : null; }

VIEWS.work = function (slug) {
  var w = work(slug);
  if (!w) return { title: 'Не найдено', html: '<div class="empty">Такого текста нет. <a class="acc" href="#/works">К списку</a></div>' };
  var genres = Array.from(new Set(S.WORKS.map(function (x) { return x.genre; }))).filter(Boolean);
  return { title: w.title || 'Текст', after: loadEditor, html:
    '<div class="page-h"><div><a class="eyebrow" href="#/works">← Все тексты</a><h2 id="wh">' + esc(w.title) + '</h2></div><span class="sp"></span><div class="acts">' +
    (REPO.has(w.path) ? '<a class="btn outline sm" href="index.html#/read/' + esc(w.slug) + '" target="_blank" rel="noopener">' + icon('external') + 'На сайте</a>' : '') +
    '<button class="btn danger sm" data-act="del-work">' + icon('trash') + 'Удалить</button></div></div>' +
    '<div class="card"><div class="edit-top"><div class="cover-col"><div class="cover"><div class="ph">Нет обложки</div><img id="coverImg" src="' + esc(imgUrl(w.cover)) + '" alt="Обложка" onerror="this.style.display=\'none\'"></div>' +
    '<div style="display:grid;gap:.5rem;align-content:start"><button class="btn outline sm" data-act="cover-pick">' + icon('upload') + 'Обложка</button><input type="file" accept="image/*" data-file="cover" hidden><p class="small muted">3:4, лучше от 600×800</p></div></div>' +
    '<div class="grid g2">' +
    field('Название', 'work:title', w.title, { cls: 'grid-column:1/-1' }) +
    field('Короткое название', 'work:shortTitle', w.shortTitle, { hint: 'Для корешка книги и списков' }) +
    field('Жанр', 'work:genre', w.genre, { list: 'genres' }) +
    field('Описание', 'work:description', w.description, { area: true, rows: 4, cls: 'grid-column:1/-1', hint: 'Показывается на обороте карточки и в поиске' }) +
    field('Тип', 'work:kind', w.kind, { options: [['story', 'Рассказ / книга'], ['article', 'Статья']] }) +
    field('Статус', 'work:status', w.status, { options: [['published', 'Опубликован'], ['wip', 'Пишется (анонс)']] }) +
    field('Возраст', 'work:age', w.age, { options: ['0+', '6+', '12+', '16+', '18+'].map(function (a) { return [a, a]; }) }) +
    field('Год', 'work:year', w.year, { attrs: ' inputmode="numeric" maxlength="4"' }) +
    '<div class="f"><label for="f_work_minutes">Время чтения, минут</label><div class="in-row"><input class="in" id="f_work_minutes" data-bind="work:minutes" type="number" min="1" value="' + esc(w.minutes) + '"><button type="button" class="btn ghost sm" style="height:auto" data-act="calc-min">По тексту</button></div></div>' +
    field('Адрес', 'work:slug', w.slug, { ro: true, hint: 'index.html#/read/' + esc(w.slug) + ' · после создания не меняется — по нему хранятся закладки читателей' }) +
    '</div></div><datalist id="genres">' + genres.map(function (g) { return '<option value="' + esc(g) + '">'; }).join('') + '</datalist></div>' +
    '<div class="card"><h2>Стиль читалки</h2><p class="lead">Как выглядит страница чтения. «Sci-Fi» — терминал будущего (названия глав справа, большими буквами). «Фэнтези» — пергамент, золотые рамки и иллюстрация вверху. Оба стиля работают в темах «Ночь», «День» и «Свеча».</p><div class="grid g2">' +
    field('Стиль по умолчанию', 'work:readerStyle', w.readerStyle || 'standard', { options: [['standard', 'Стандартная'], ['scifi', 'Sci-Fi (терминал будущего)'], ['fantasy', 'Фэнтези (пергамент)']] }) +
    '<div class="f"><label>Выбор читателя</label><label class="check" style="padding:.75rem 0' + (!w.readerStyle || w.readerStyle === 'standard' ? ';opacity:.5' : '') + '"><input type="checkbox" data-bind="work:readerStyleChoice"' + (w.readerStyleChoice ? ' checked' : '') + (!w.readerStyle || w.readerStyle === 'standard' ? ' disabled' : '') + '> Показывать переключатель стиля в окне смены темы</label><small>Читатель увидит под «Ночь / День / Свеча» кнопки «Стандартная» и выбранный вами стиль, его выбор запомнится.</small></div>' +
    (w.readerStyle === 'fantasy' ? '<div class="f" style="grid-column:1/-1"><label>Иллюстрация вверху страницы</label><div class="hero-pic" style="max-width:520px"><img id="artImg" src="' + esc(imgUrl(w.art || 'art/fantasy.jpg')) + '" alt="" onerror="this.style.display=\'none\'"></div><div class="acts" style="margin-top:.6rem"><button class="btn outline sm" data-act="art-pick">' + icon('upload') + 'Загрузить иллюстрацию</button><input type="file" accept="image/*" data-file="art" hidden>' + (w.art ? '<button class="btn ghost sm" data-act="art-del">Вернуть стандартную</button>' : '') + '</div><small>Широкая картинка 3:1 (например, 2100×700): главный объект справа, слева — пустое место под название. Внизу и по краям она плавно растворяется. В тёмных темах цвета подстраиваются сами. Без загрузки показывается картинка по умолчанию.</small></div>' : '') + '</div></div>' +
    (w.kind === 'story' || (w.cycle && w.cycle.length) ? '<div class="card"><div class="card-h"><h2>Части цикла</h2><button class="btn ghost sm" data-act="cycle-from-h">Взять из заголовков ##</button></div><p class="lead">Если рассказ — цикл из нескольких частей, перечислите их по одной на строку (как в тексте). Иначе оставьте пустым.</p>' +
      '<textarea class="ta" id="f_work_cycleText" data-bind="work:cycleText" rows="4" placeholder="Сказ первый. Глина">' + esc((w.cycle || []).join('\n')) + '</textarea></div>' : '') +
    '<div class="card"><div class="card-h"><h2>Текст</h2><div class="seg" role="tablist"><button type="button" data-act="ed-tab" data-v="edit" class="' + (UI.tab === 'edit' ? 'on' : '') + '">' + icon('pen') + 'Редактор</button><button type="button" data-act="ed-tab" data-v="prev" class="' + (UI.tab === 'prev' ? 'on' : '') + '">' + icon('eye') + 'Просмотр</button></div>' +
    '<button class="btn ghost sm" data-act="txt-pick">' + icon('upload') + 'Загрузить .md</button><input type="file" accept=".md,.txt,text/plain,text/markdown" data-file="txt" hidden></div>' +
    '<p class="small muted" style="margin-bottom:.9rem">Файл <code>' + esc(w.path) + '</code>. Разметка как на сайте: <code>## Глава</code>, <code>**жирный**</code>, <code>*курсив*</code>, <code>&gt; цитата</code>, <code>---</code> разделитель, <code>&lt;center&gt;…&lt;/center&gt;</code> по центру.</p>' +
    '<div id="edWrap"><p class="muted">Загрузка текста…</p></div></div>' };
};
async function loadEditor() {
  var w = curWork(), wrap = document.getElementById('edWrap'); if (!w || !wrap) return;
  try {
    var t = await readText(w.path);
    if (curWork() !== w) return;
    wrap.innerHTML = editorHtml(w, t);
    fillEditor(w);
  } catch (e) {
    wrap.innerHTML = '<div class="note"><b>Не удалось загрузить текст</b> (' + esc(e.message) + '). ' + (location.protocol === 'file:' ? 'Админка открыта как файл — подключите папку сайта на вкладке «Публикация».' : 'Проверьте, что файл <code>' + esc(w.path) + '</code> есть на сайте.') +
      '</div><p style="margin-top:.8rem"><button class="btn outline sm" data-act="txt-retry">Повторить</button> <button class="btn ghost sm" data-act="txt-blank">Начать с пустого текста</button></p>';
  }
}
function fillEditor(w) {
  var ed = document.getElementById('ed'), pv = document.getElementById('prev'), t = texts[w.path] || '';
  if (ed) ed.value = t;
  if (pv) pv.innerHTML = mdPreview(t);
  updCounts();
}
function mdPreview(md) {
  var blocks = parseMd(md);
  if (!blocks.length) return '<p class="muted">Пока пусто.</p>';
  return blocks.map(function (b) {
    if (b.t === 'h2') return '<h2>' + rich(b.text) + '</h2>';
    if (b.t === 'h3') return '<h3>' + rich(b.text) + '</h3>';
    if (b.t === 'bq') return '<blockquote>' + rich(b.text) + '</blockquote>';
    if (b.t === 'hr') return '<hr>';
    if (b.t === 'ul' || b.t === 'ol') return '<' + b.t + '>' + b.items.map(function (i) { return '<li>' + rich(i) + '</li>'; }).join('') + '</' + b.t + '>';
    return '<p' + (b.center ? ' class="c"' : '') + '>' + rich(b.text) + '</p>';
  }).join('');
}
/* вставка в поле с сохранением истории отмены (Ctrl+Z) */
function insertAt(s, e, text) {
  var t = document.getElementById('ed'); t.focus(); t.setSelectionRange(s, e);
  if (!document.execCommand('insertText', false, text)) { t.setRangeText(text, s, e, 'end'); t.dispatchEvent(new Event('input', { bubbles: true })); }
}
function mdAction(m) {
  var t = document.getElementById('ed'); if (!t) return;
  var s = t.selectionStart, e = t.selectionEnd, v = t.value, sel = v.slice(s, e);
  if (m === 'b' || m === 'i' || m === 'c') {
    var a = m === 'b' ? '**' : m === 'i' ? '*' : '<center>', b = m === 'b' ? '**' : m === 'i' ? '*' : '</center>';
    insertAt(s, e, a + (sel || 'текст') + b);
    if (!sel) t.setSelectionRange(s + a.length, s + a.length + 5);
    else t.setSelectionRange(s + a.length, s + a.length + sel.length);
  } else if (m === 'hr') insertAt(s, e, '\n\n---\n\n');
  else {
    var pre = m === 'h2' ? '## ' : m === 'h3' ? '### ' : '> ';
    var ls = v.lastIndexOf('\n', s - 1) + 1, ee = e > s && v.charAt(e - 1) === '\n' ? e - 1 : e, le = v.indexOf('\n', ee); if (le < 0) le = v.length;
    var block = v.slice(ls, le), on = block.split('\n').every(function (l) { return l.indexOf(pre) === 0; });
    insertAt(ls, le, block.split('\n').map(function (l) { return on ? l.slice(pre.length) : pre + l.replace(/^#{1,3}\s+|^>\s+/, ''); }).join('\n'));
  }
}

/* —— Новости —— */
VIEWS.news = function () {
  var opts = [['', '— без ссылки —']].concat(S.WORKS.map(function (w) { return [w.slug, w.title]; }));
  return { title: 'Новости', html:
    '<div class="page-h"><div><span class="eyebrow">Главная страница</span><h2>Новости</h2></div><span class="sp"></span><button class="btn" data-act="news-add">' + icon('plus') + 'Новая новость</button></div>' +
    (S.NEWS.length ? S.NEWS.map(function (n, i) {
      return '<div class="news-item"><div class="head"><span class="badge">№ ' + (i + 1) + '</span><button type="button" class="btn ghost sm ico-only" data-act="news-mv" data-i="' + i + '" data-d="-1" aria-label="Выше"' + (i === 0 ? ' disabled' : '') + '>' + icon('up') + '</button><button type="button" class="btn ghost sm ico-only" data-act="news-mv" data-i="' + i + '" data-d="1" aria-label="Ниже"' + (i === S.NEWS.length - 1 ? ' disabled' : '') + '>' + icon('down') + '</button><button type="button" class="btn danger sm ico-only" data-act="news-del" data-i="' + i + '" aria-label="Удалить">' + icon('trash') + '</button></div>' +
        '<div class="grid g2">' + field('Дата', 'news:' + i + ':date', n.date, { ph: monthNow() }) + field('Заголовок', 'news:' + i + ':title', n.title) + '</div>' +
        field('Текст', 'news:' + i + ':text', n.text, { area: true, rows: 2 }) +
        field('Ссылка на текст', 'news:' + i + ':slug', n.slug || '', { options: opts, hint: 'Если выбрать — новость откроет этот рассказ или статью' }) + '</div>';
    }).join('') : '<div class="empty">Новостей пока нет</div>') };
};

/* —— Шапка —— */
function heroPhone(item) {
  var pic = item.querySelector('.hero-pic img'), ph = item.querySelector('.phone img'), box = item.querySelector('.phone');
  if (!pic || !pic.naturalWidth) return;
  var q = Number(item.dataset.focus); if (isNaN(q)) q = 50;
  var cw = box.clientWidth, ch = box.clientHeight, iw = pic.naturalWidth, ih = pic.naturalHeight;
  var sc = Math.max(cw / iw, ch / ih), dw = iw * sc, over = dw - cw;
  var p = over > 1 ? Math.min(1, Math.max(0, (q / 100 * dw - cw / 2) / over)) : .5;
  ph.style.objectPosition = (p * 100).toFixed(1) + '% 0%';
}
VIEWS.hero = function () {
  return { title: 'Шапка', after: function () { $$('.hero-item').forEach(heroPhone); }, html:
    '<div class="page-h"><div><span class="eyebrow">Главная страница</span><h2>Картинки шапки</h2></div><span class="sp"></span><button class="btn" data-act="hero-add">' + icon('plus') + 'Добавить картинку</button><input type="file" accept="image/*" data-file="hero" hidden></div>' +
    '<p class="lead muted" style="margin-bottom:1.2rem;max-width:680px">Картинки листаются на главной. На узком экране телефона их края обрезаются — отметьте, где главный объект, и сайт поставит его по центру. Справа видно, как кадр выглядит на телефоне.</p>' +
    '<div class="hero-list">' + S.HERO.map(function (p, i) {
      var f = S.HERO_FOCUS[p]; if (f === undefined) f = 50;
      return '<div class="hero-item" data-i="' + i + '" data-focus="' + f + '"><div><div class="hero-pic"><img src="' + esc(imgUrl(p)) + '" alt="" onload="this.closest(\'.hero-item\').dispatchEvent(new Event(\'heroload\'))"><i class="guide" style="left:' + f + '%"></i></div>' +
        '<div class="hero-ctl"><div class="row-r"><div class="f"><label for="hr' + i + '">Главный объект по горизонтали</label><input id="hr' + i + '" type="range" min="0" max="100" value="' + f + '" data-bind="hero:' + i + ':focus"></div><input class="in" type="number" min="0" max="100" value="' + f + '" data-bind="hero:' + i + ':focus" aria-label="Процент"></div>' +
        field('Заметка для себя', 'hero:' + i + ':note', S.NOTES[p] || '', { ph: 'что на картинке' }) +
        '<div class="acts"><span class="badge">' + esc(p) + '</span><span class="sp" style="flex:1"></span><button type="button" class="btn ghost sm ico-only" data-act="hero-mv" data-i="' + i + '" data-d="-1" aria-label="Левее"' + (i === 0 ? ' disabled' : '') + '>' + icon('up') + '</button><button type="button" class="btn ghost sm ico-only" data-act="hero-mv" data-i="' + i + '" data-d="1" aria-label="Правее"' + (i === S.HERO.length - 1 ? ' disabled' : '') + '>' + icon('down') + '</button><button type="button" class="btn danger sm ico-only" data-act="hero-del" data-i="' + i + '" aria-label="Удалить">' + icon('trash') + '</button></div></div></div>' +
        '<div><div class="phone"><img src="' + esc(imgUrl(p)) + '" alt=""></div><p class="phone-cap muted small">на телефоне</p></div></div>';
    }).join('') + '</div>' };
};

/* —— Настройки сайта —— */
VIEWS.site = function () {
  var s = S.SITE;
  return { title: 'Сайт', html:
    '<div class="page-h"><div><span class="eyebrow">Общее</span><h2>Настройки сайта</h2></div></div>' +
    '<div class="card"><h2>Основное</h2><p class="lead">Название, автор и описание для поисковиков и соцсетей.</p><div class="grid g2">' +
    field('Название сайта', 'site:name', s.name) + field('Автор', 'site:author', s.author) + field('Подзаголовок в шапке', 'site:tagline', s.tagline) + field('Версия издания', 'site:version', s.version) +
    field('Описание сайта', 'site:description', s.description, { area: true, cls: 'grid-column:1/-1' }) + '</div></div>' +
    '<div class="card"><h2>Связь и ссылки</h2><p class="lead">Показываются на страницах «Связь» и «Донат».</p><div class="grid g2">' +
    field('Почта', 'site:email', s.email, { type: 'email' }) + field('Год в подвале', 'site:year', s.year, { attrs: ' inputmode="numeric"' }) +
    field('Telegram — ссылка', 'site:telegram', s.telegram, { type: 'url' }) + field('Telegram — как показывать', 'site:telegramHandle', s.telegramHandle) +
    field('Дзен — ссылка', 'site:dzen', s.dzen, { type: 'url' }) + field('Дзен — как показывать', 'site:dzenHandle', s.dzenHandle) + '</div></div>' };
};

/* —— Публикация —— */
function ghNorm() {
  var g = CONN.gh;
  return { owner: g.owner.trim(), repo: g.repo.trim().replace(/\.git$/, ''), branch: (g.branch || 'main').trim(), prefix: g.prefix.trim().replace(/^\/+|\/+$/g, ''), token: g.token.trim() };
}
VIEWS.publish = function () {
  var list = outgoing(), sum = summary(), v = validate(), g = CONN.gh, m = CONN.mode, can = list.length > 0 && !v.errs.length;
  var dirOk = typeof window.showDirectoryPicker === 'function';
  var changes = !list.length ? '<div class="empty">Изменений нет. Правьте тексты, новости и шапку — здесь появится список.</div>' :
    '<ul class="chg">' + list.map(function (f) {
      var lab = f.path === 'js/data.js' ? 'Данные сайта' : f.type === 'del' ? 'Удаление' : f.type === 'bin' ? 'Картинка' : (REPO.has(f.path) ? 'Текст' : 'Новый файл');
      return '<li><span class="badge ' + (f.type === 'del' ? 'del' : 'acc') + '">' + lab + '</span><span class="p">' + esc(f.path) + '</span><span class="sz">' + (f.type === 'del' ? '' : fmtSize(fileSize(f))) + '</span></li>';
    }).join('') + '</ul>' + (sum.length ? '<ul class="steps" style="list-style:disc;margin-top:.9rem">' + sum.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '');
  var probs = v.errs.map(function (x) { return '<div class="prob err"><span>' + esc(x.t) + ' <a href="' + x.at + '">Исправить</a></span></div>'; }).concat(v.warns.map(function (x) { return '<div class="prob warn"><span>' + esc(x.t) + ' <a href="' + x.at + '">Открыть</a></span></div>'; })).join('');
  var gh = '<div class="grid g2">' + field('Владелец (аккаунт)', 'gh:owner', g.owner, { ph: 'lancev' }) + field('Репозиторий', 'gh:repo', g.repo, { ph: 'darkstories' }) +
    field('Ветка', 'gh:branch', g.branch, { ph: 'main' }) + field('Папка сайта в репозитории', 'gh:prefix', g.prefix, { ph: 'пусто, если сайт в корне', hint: 'Например <code>docs</code>, если GitHub Pages берёт сайт из папки docs' }) +
    '<div class="f" style="grid-column:1/-1"><label for="f_gh_token">Токен доступа</label><input class="in" id="f_gh_token" data-bind="gh:token" type="password" autocomplete="off" value="' + esc(g.token) + '" placeholder="github_pat_…"><small>Токен — это «ключ», который разрешает менять сайт. Без него опубликовать нельзя, поэтому админка безопасна, даже если её адрес известен.</small></div>' +
    '<label class="check" style="grid-column:1/-1"><input type="checkbox" data-bind="gh:remember"' + (g.remember ? ' checked' : '') + '> Запомнить токен в этом браузере (не включайте на чужом компьютере)</label></div>' +
    '<details style="margin:1rem 0"><summary class="small muted" style="cursor:pointer">Как получить токен</summary><ol class="steps"><li>GitHub → Settings → Developer settings → Personal access tokens → <b>Fine-grained tokens</b> → Generate new token.</li><li>Repository access: <b>Only select repositories</b> → выберите репозиторий сайта.</li><li>Permissions → Repository permissions → <b>Contents: Read and write</b>.</li><li>Скопируйте токен и вставьте выше.</li></ol></details>' +
    '<div class="acts"><button class="btn ghost" data-act="gh-test">' + icon('check') + 'Проверить доступ</button><button class="btn" data-act="gh-publish"' + (can ? '' : ' disabled') + '>' + icon('github') + 'Опубликовать на GitHub</button></div>';
  var dir = !dirOk ? '<div class="note">Этот браузер не умеет работать с папками. Откройте админку в Chrome или Edge на компьютере — или выберите другой способ.</div>' :
    '<p class="small muted" style="margin-bottom:1rem">Выберите папку, в которой лежит <code>index.html</code> сайта (с папками <code>js</code>, <code>stories</code>, <code>covers</code>). Админка запишет туда изменённые файлы. Подходит, если вы потом сами загружаете сайт на хостинг или делаете коммит.</p>' +
    (CONN.dir ? '<p style="margin-bottom:1rem"><span class="badge ok">Подключена: ' + esc(CONN.dirName) + '</span></p>' : '') +
    '<div class="acts"><button class="btn ghost" data-act="dir-pick">' + icon('folder') + (CONN.dir ? 'Выбрать другую' : 'Выбрать папку сайта') + '</button><button class="btn" data-act="dir-write"' + (can && CONN.dir ? '' : ' disabled') + '>' + icon('check') + 'Записать в папку</button></div>';
  var zip = '<p class="small muted" style="margin-bottom:1rem">Скачайте архив с изменёнными файлами и распакуйте его поверх папки сайта с заменой. Удалённые файлы перечислены в <code>_УДАЛИТЬ.txt</code> внутри архива.</p>' +
    '<div class="acts"><button class="btn" data-act="zip-dl"' + (can ? '' : ' disabled') + '>' + icon('zip') + 'Скачать ZIP</button>' + (list.length ? '<button class="btn ghost" data-act="reset-base">Я применил изменения — очистить черновик</button>' : '') + '</div>';
  return { title: 'Публикация', html:
    '<div class="page-h"><div><span class="eyebrow">Выпуск</span><h2>Публикация</h2></div></div>' +
    '<div class="card"><h2>Что изменится на сайте</h2><p class="lead">Список собирается автоматически из всего, что вы поправили.</p>' + changes + '</div>' +
    (probs ? '<div class="probs">' + probs + '</div>' : '') +
    '<div class="card"><div class="card-h"><h2>Куда опубликовать</h2><div class="seg" role="tablist">' +
    [['github', 'GitHub', 'github'], ['folder', 'Папка', 'folder'], ['zip', 'ZIP', 'zip']].map(function (x) { return '<button type="button" class="' + (m === x[0] ? 'on' : '') + '" data-act="mode" data-v="' + x[0] + '">' + icon(x[2]) + x[1] + '</button>'; }).join('') + '</div></div>' +
    (m === 'github' ? field('Описание изменений (коммит)', 'gh:msg', '', { ph: 'Автоматически, если оставить пустым' }) + '<div style="height:1rem"></div>' + gh : m === 'folder' ? dir : zip) +
    '<div class="log hide" id="log" role="log"></div></div>' };
};

/* ───────── публикация ───────── */
var busy = false;
function logLine(msg, cls) {
  var l = document.getElementById('log'); if (!l) return;
  l.classList.remove('hide'); var s = document.createElement('div'); if (cls) s.className = cls; s.textContent = msg; l.appendChild(s); l.scrollTop = l.scrollHeight;
}
async function run(btn, fn) {
  if (busy) return; busy = true; btn.classList.add('busy');
  var l = document.getElementById('log'); if (l) { l.innerHTML = ''; }
  try { await fn(); } catch (e) { logLine('✗ ' + e.message, 'e'); notify(e.message, true); }
  busy = false; btn.classList.remove('busy');
}
function ghCall(path, method, body) {
  var c = ghNorm();
  return fetch('https://api.github.com/repos/' + encodeURIComponent(c.owner) + '/' + encodeURIComponent(c.repo) + path, {
    method: method || 'GET',
    headers: { Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  }).then(async function (r) {
    var j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok) {
      var m = (j && j.message) || ('HTTP ' + r.status);
      if (r.status === 401) m = 'Токен не подходит или просрочен (401). Создайте новый.';
      else if (r.status === 404) m = 'Репозиторий или ветка не найдены, либо у токена нет к ним доступа (404). Проверьте имя, ветку и права токена.';
      else if (r.status === 403) m = 'Доступ запрещён (403): у токена нет права «Contents: Read and write» или превышен лимит запросов. ' + m;
      else if (r.status === 422 || r.status === 409) m = 'GitHub отклонил изменение (' + r.status + '): ' + m + '. Возможно, в репозитории появились новые правки — обновите страницу админки и повторите.';
      throw new Error(m);
    }
    return j;
  }, function () { throw new Error('Нет связи с GitHub. Проверьте интернет.'); });
}
function ghCheckFields() {
  var c = ghNorm();
  if (!c.owner || !c.repo || !c.token) throw new Error('Заполните владельца, репозиторий и токен.');
  return c;
}
function toB64(blob) {
  return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1]); }; r.onerror = rej; r.readAsDataURL(blob); });
}
async function ghTest() {
  var c = ghCheckFields(), r = await ghCall('');
  logLine('✓ Репозиторий найден: ' + r.full_name, 'o');
  if (r.permissions && r.permissions.push === false) throw new Error('Токен видит репозиторий, но не может в него писать. Нужно право Contents: Read and write.');
  var br = c.branch.split('/').map(encodeURIComponent).join('/');
  await ghCall('/git/ref/heads/' + br);
  logLine('✓ Ветка «' + c.branch + '» на месте. Можно публиковать.', 'o');
}
async function ghPublish() {
  var c = ghCheckFields(), list = outgoing(), pre = c.prefix ? c.prefix + '/' : '';
  var br = c.branch.split('/').map(encodeURIComponent).join('/');
  var msg = (CONN.gh.msg || '').trim() || ('Админка: ' + (summary().slice(0, 3).join('; ') || 'обновление файлов'));
  logLine('Читаю ветку «' + c.branch + '»…');
  var ref = await ghCall('/git/ref/heads/' + br), head = ref.object.sha, commit = await ghCall('/git/commits/' + head);
  var entries = [], n = 0;
  for (var i = 0; i < list.length; i++) {
    var f = list[i], path = pre + f.path;
    if (f.type === 'del') { entries.push({ path: path, mode: '100644', type: 'blob', sha: null }); continue; }
    logLine('Загружаю ' + f.path + ' (' + fmtSize(fileSize(f)) + ')…');
    var blob = await ghCall('/git/blobs', 'POST', f.type === 'text' ? { content: f.text, encoding: 'utf-8' } : { content: await toB64(f.blob), encoding: 'base64' });
    entries.push({ path: path, mode: '100644', type: 'blob', sha: blob.sha }); n++;
  }
  logLine('Собираю коммит…');
  var tree = await ghCall('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: entries });
  var nc = await ghCall('/git/commits', 'POST', { message: msg, tree: tree.sha, parents: [head] });
  await ghCall('/git/refs/heads/' + br, 'PATCH', { sha: nc.sha });
  logLine('✓ Опубликовано. Коммит ' + nc.sha.slice(0, 7) + '. GitHub Pages обновит сайт через 1–2 минуты.', 'o');
  done('Опубликовано на GitHub');
}
async function dirPick() {
  var h;
  try { h = await window.showDirectoryPicker({ mode: 'readwrite' }); } catch (e) { return; }
  CONN.dir = h; CONN.dirName = h.name;
  var ok = false;
  try { var d = await h.getDirectoryHandle('js'); await d.getFileHandle('data.js'); ok = true; } catch (e) {}
  if (!ok) { CONN.dir = null; CONN.dirName = ''; notify('В этой папке нет js/data.js — выберите папку, где лежит index.html', true); render(); return; }
  if (!pendingCount()) {
    try {
      var p = parseData(await folderRead('js/data.js')); texts = {}; origTexts = {}; initState(p.d, p.notes);
      notify('Папка подключена, данные прочитаны из неё');
    } catch (e) { notify('Папка подключена, но data.js не прочитался: ' + e.message, true); }
  } else notify('Папка подключена. Записанные файлы заменят те, что в папке');
  render();
}
async function dirWrite() {
  var list = outgoing(); if (!CONN.dir) throw new Error('Сначала выберите папку сайта.');
  for (var i = 0; i < list.length; i++) {
    var f = list[i], parts = splitPath(f.path), name = parts.pop();
    if (f.type === 'del') {
      try {
        var d = await dirHandle(parts); await d.removeEntry(name); logLine('✓ Удалён ' + f.path, 'o');
        if (parts.length >= 2) { try { var up = await dirHandle(parts.slice(0, -1)); await up.removeEntry(parts[parts.length - 1]); } catch (e) {} }
      } catch (e) { logLine('— ' + f.path + ' уже отсутствует'); }
      continue;
    }
    var fh = await (await dirHandle(parts, true)).getFileHandle(name, { create: true }), w = await fh.createWritable();
    await w.write(f.type === 'text' ? f.text : f.blob); await w.close();
    logLine('✓ ' + f.path + ' (' + fmtSize(fileSize(f)) + ')', 'o');
  }
  logLine('Готово. Теперь загрузите папку на хостинг или сделайте коммит.', 'o');
  done('Файлы записаны в папку');
}
function loadJSZip() {
  if (window.JSZip) return Promise.resolve();
  return new Promise(function (res, rej) {
    var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = res; s.onerror = function () { rej(new Error('Не удалось загрузить модуль ZIP. Проверьте интернет.')); }; document.head.appendChild(s);
  });
}
async function zipDl() {
  await loadJSZip();
  var list = outgoing(), z = new JSZip(), del = [];
  list.forEach(function (f) { if (f.type === 'del') del.push(f.path); else z.file(f.path, f.type === 'text' ? f.text : f.blob); });
  if (del.length) z.file('_УДАЛИТЬ.txt', 'Эти файлы нужно удалить из папки сайта:\n\n' + del.join('\n') + '\n');
  var blob = await z.generateAsync({ type: 'blob' }), a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'darkstories-update-' + new Date().toISOString().slice(0, 10) + '.zip'; document.body.appendChild(a); a.click(); a.remove();
  logLine('✓ Архив скачан (' + fmtSize(blob.size) + '). Распакуйте его поверх папки сайта.', 'o');
}
function done(msg) { baseline(); chrome(); notify(msg); setTimeout(function () { if (parseHash()[0] === 'publish') { var l = document.getElementById('log'), html = l ? l.innerHTML : ''; render(); var l2 = document.getElementById('log'); if (l2) { l2.innerHTML = html; l2.classList.remove('hide'); } } }, 50); }

/* ───────── события ───────── */
function parseHash() { return location.hash.replace(/^#\/?/, '').split('/'); }

function onBind(el) {
  var parts = el.dataset.bind.split(':'), scope = parts[0], v = el.type === 'checkbox' ? el.checked : el.value;
  if (scope === 'site') S.SITE[parts[1]] = (parts[1] === 'year' && /^\d+$/.test(v)) ? Number(v) : v;
  else if (scope === 'work') {
    var w = curWork(), k = parts[1]; if (!w) return;
    if (k === 'minutes') w.minutes = Math.max(0, Math.round(Number(v)) || 0);
    else if (k === 'cycleText') w.cycle = v.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    else w[k] = v;
    if (k === 'title') { var h = document.getElementById('wh'); if (h) h.textContent = v; setTitle(v || 'Текст'); }
    if (k === 'kind') { /* раздел сайта определяется типом — путь к файлу не трогаем */ }
  } else if (scope === 'news') {
    var it = S.NEWS[+parts[1]], key = parts[2]; if (!it) return;
    if (key === 'slug' && !v) delete it.slug; else it[key] = v;
    if (key === 'slug' && v) { var o = {}; ['date', 'title', 'text', 'slug'].forEach(function (k2) { if (it[k2] !== undefined) o[k2] = it[k2]; }); S.NEWS[+parts[1]] = o; }
  } else if (scope === 'hero') {
    var p = S.HERO[+parts[1]], item = el.closest('.hero-item'); if (p === undefined) return;
    if (parts[2] === 'note') { if (v.trim()) S.NOTES[p] = v; else delete S.NOTES[p]; }
    else {
      var f = Math.min(100, Math.max(0, Number(v) || 0)); S.HERO_FOCUS[p] = f; item.dataset.focus = f;
      $$('[data-bind^="hero:' + parts[1] + ':focus"]', item).forEach(function (x) { if (x !== el) x.value = f; });
      item.querySelector('.guide').style.left = f + '%'; heroPhone(item);
    }
  } else if (scope === 'gh') {
    if (parts[1] === 'remember') { CONN.gh.remember = v; } else CONN.gh[parts[1]] = v;
    if (parts[1] !== 'msg') saveGh();
  }
  chrome();
}

var ACT = {
  'new-work': async function () {
    var autoSlug = true;
    var r = await modal({
      title: 'Новый текст',
      body: '<div class="f"><label for="nw_t">Название</label><input class="in" id="nw_t" placeholder="Например: Дом на краю"></div>' +
        '<div class="f"><label for="nw_k">Тип</label><select class="sel" id="nw_k"><option value="story">Рассказ / книга</option><option value="article">Статья</option></select></div>' +
        '<div class="f"><label for="nw_s">Адрес (латиницей)</label><input class="in" id="nw_s" placeholder="dom-na-krayu"><small>Это часть ссылки: <code>#/read/адрес</code>. Потом не меняется.</small></div><p class="small" id="nw_e" style="color:var(--destructive)"></p>',
      actions: [{ label: 'Отмена', cls: 'ghost', value: null }, {
        label: 'Создать', run: function (ov) {
          var t = ov.querySelector('#nw_t').value.trim(), s = ov.querySelector('#nw_s').value.trim(), e = ov.querySelector('#nw_e');
          if (!t) { e.textContent = 'Введите название'; return false; }
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) { e.textContent = 'Адрес: только латинские буквы, цифры и дефис (например, dom-na-krayu)'; return false; }
          if (work(s)) { e.textContent = 'Такой адрес уже есть'; return false; }
          return { title: t, slug: s, kind: ov.querySelector('#nw_k').value };
        }
      }],
      onOpen: function (ov) {
        ov.querySelector('#nw_t').addEventListener('input', function (e) { if (autoSlug) ov.querySelector('#nw_s').value = toSlug(e.target.value); });
        ov.querySelector('#nw_s').addEventListener('input', function () { autoSlug = false; });
      }
    });
    if (!r) return;
    var d = dirOf(r.slug), dirName = r.kind === 'article' ? 'articles' : 'stories', path = dirName + '/' + d + '/' + d + '.md';
    var nw = { slug: r.slug, kind: r.kind, path: path, cover: 'covers/' + d + '.jpg', title: r.title, shortTitle: r.title, description: '', genre: '', age: '16+', year: String(new Date().getFullYear()), status: 'wip', minutes: 1 };
    S.WORKS.push(nw);
    texts[path] = r.kind === 'article' ? 'Первый абзац статьи.\n\n## Первый раздел\n\nТекст раздела.\n' : '## Анонс\n\nКороткий анонс рассказа.\n\n## Глава 1\n\nТекст первой главы.\n';
    files[path] = { type: 'text', text: texts[path] };
    location.hash = '#/works/' + r.slug; notify('Текст создан — заполните описание и добавьте обложку');
  },
  'fantasy-all': async function () {
    var hit = S.WORKS.filter(function (x) { return (x.genre || '').toLowerCase().indexOf('фэнтези') >= 0; });
    if (!hit.length) { notify('Текстов в жанре «фэнтези» нет', true); return; }
    if (!await ask('Включить «Фэнтези»?', 'Стиль «Фэнтези» получат: ' + hit.map(function (x) { return '«' + esc(x.title) + '»'; }).join(', ') + '. Читатель сможет переключить его на стандартный.', 'Включить')) return;
    hit.forEach(function (x) { x.readerStyle = 'fantasy'; x.readerStyleChoice = true; });
    document.getElementById('list').innerHTML = listHtml(); chrome(); notify('Стиль «Фэнтези» включён: ' + hit.length);
  },
  'art-pick': function (el) { el.parentNode.querySelector('input[data-file=art]').click(); },
  'art-del': function () { var w = curWork(); if (!w || !w.art) return; removeFile(w.art); delete URLS[w.art]; delete w.art; render(true); },
  'scifi-all': async function () {
    var hit = S.WORKS.filter(function (x) { return (x.genre || '').trim().toLowerCase() === 'научная фантастика'; });
    if (!hit.length) { notify('Текстов в жанре «Научная фантастика» нет', true); return; }
    if (!await ask('Включить Sci-Fi?', 'Стиль Sci-Fi получат тексты жанра «Научная фантастика»: ' + hit.map(function (x) { return '«' + esc(x.title) + '»'; }).join(', ') + '. Читатель сможет переключить его на стандартный.', 'Включить')) return;
    hit.forEach(function (x) { x.readerStyle = 'scifi'; x.readerStyleChoice = true; });
    document.getElementById('list').innerHTML = listHtml(); chrome(); notify('Sci-Fi включён: ' + hit.length);
  },
  'filter': function (el) { UI.filter = el.dataset.v; $$('#wf .chip').forEach(function (c) { c.classList.toggle('on', c === el); }); document.getElementById('list').innerHTML = listHtml(); },
  'mv-work': function (el) { move(S.WORKS, +el.dataset.i, +el.dataset.d); document.getElementById('list').innerHTML = listHtml(); chrome(); },
  'del-work': async function () {
    var w = curWork(); if (!w) return;
    if (!await ask('Удалить «' + esc(w.title) + '»?', 'Текст, обложка и карточка исчезнут с сайта после публикации. Пока вы не опубликовали, удаление можно отменить, перезагрузив страницу.', 'Удалить', true)) return;
    S.WORKS = S.WORKS.filter(function (x) { return x !== w; });
    removeFile(w.path);
    if (w.art) { removeFile(w.art); delete URLS[w.art]; }
    if (!S.WORKS.some(function (x) { return x.cover === w.cover; })) { removeFile(w.cover); delete URLS[w.cover]; }
    var cleared = 0; S.NEWS.forEach(function (n) { if (n.slug === w.slug) { delete n.slug; cleared++; } });
    notify('Текст удалён' + (cleared ? '; ссылки в новостях очищены' : '')); location.hash = '#/works';
  },
  'cover-pick': function (el) { el.parentNode.querySelector('input[type=file]').click(); },
  'calc-min': function () { var w = curWork(); if (!w) return; w.minutes = calcMinutes(texts[w.path] || ''); document.getElementById('f_work_minutes').value = w.minutes; chrome(); },
  'cycle-from-h': function () {
    var w = curWork(); if (!w) return;
    var hs = parseMd(texts[w.path] || '').filter(function (b) { return b.t === 'h2' && !/^анонс$/i.test(b.text.replace(/[*_]/g, '').trim()); }).map(function (b) { return b.text.replace(/[*_]/g, '').trim(); });
    if (!hs.length) { notify('В тексте нет заголовков ##', true); return; }
    w.cycle = hs; document.getElementById('f_work_cycleText').value = hs.join('\n'); chrome(); notify('Найдено частей: ' + hs.length);
  },
  'ed-tab': function (el) {
    var w = curWork(); if (!w) return; UI.tab = el.dataset.v;
    $$('[data-act=ed-tab]').forEach(function (b) { b.classList.toggle('on', b === el); });
    document.getElementById('edWrap').innerHTML = editorHtml(w, texts[w.path] || ''); fillEditor(w);
  },
  'md': function (el) { mdAction(el.dataset.m); },
  'txt-pick': function (el) { el.parentNode.querySelector('input[data-file=txt]').click(); },
  'txt-retry': function () { loadEditor(); },
  'txt-blank': function () { var w = curWork(); texts[w.path] = ''; files[w.path] = { type: 'text', text: '' }; origTexts[w.path] = undefined; document.getElementById('edWrap').innerHTML = editorHtml(w, ''); fillEditor(w); chrome(); },
  'news-add': function () { S.NEWS.unshift({ date: monthNow(), title: '', text: '' }); render(); var t = document.querySelector('[data-bind="news:0:title"]'); if (t) t.focus(); },
  'news-mv': function (el) { move(S.NEWS, +el.dataset.i, +el.dataset.d); render(); },
  'news-del': async function (el) { var n = S.NEWS[+el.dataset.i]; if (await ask('Удалить новость?', esc(n.title || 'Без заголовка'), 'Удалить', true)) { S.NEWS.splice(+el.dataset.i, 1); render(); } },
  'hero-add': function (el) { el.parentNode.querySelector('input[type=file]').click(); },
  'hero-mv': function (el) { move(S.HERO, +el.dataset.i, +el.dataset.d); render(); },
  'hero-del': async function (el) {
    var p = S.HERO[+el.dataset.i];
    if (S.HERO.length < 2) { notify('В шапке должна остаться хотя бы одна картинка', true); return; }
    if (!await ask('Убрать картинку из шапки?', esc(p) + ' перестанет показываться на главной.', 'Убрать', true)) return;
    S.HERO.splice(+el.dataset.i, 1); delete S.HERO_FOCUS[p]; delete S.NOTES[p]; removeFile(p); render();
  },
  'mode': function (el) { CONN.mode = el.dataset.v; localSet('ds-admin-mode', CONN.mode); render(); },
  'gh-test': function (el) { run(el, ghTest); },
  'gh-publish': function (el) { run(el, ghPublish); },
  'dir-pick': function () { dirPick(); },
  'dir-write': function (el) { run(el, dirWrite); },
  'zip-dl': function (el) { run(el, zipDl); },
  'reset-base': async function () { if (await ask('Очистить черновик?', 'Админка будет считать, что все изменения уже применены на сайте.', 'Очистить')) { baseline(); render(); } }
};
function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

async function onFile(input) {
  var f = input.files && input.files[0]; input.value = ''; if (!f) return;
  var kind = input.dataset.file;
  try {
    if (kind === 'cover') {
      var w = curWork(), b = await cropCover(f); if (!b || !w) return;
      setBin(w.cover, b); var im = document.getElementById('coverImg'); im.style.display = ''; im.src = URLS[w.cover]; notify('Обложка заменена (не опубликована)');
    } else if (kind === 'hero') {
      var blob = await prepareHeader(f), n = 1; S.HERO.forEach(function (p) { var m = /header_(\d+)/.exec(p); if (m) n = Math.max(n, +m[1] + 1); });
      var path = 'cap/header_' + n + '.jpg'; setBin(path, blob); S.HERO.push(path); S.HERO_FOCUS[path] = 50; render(); notify('Картинка добавлена — отметьте главный объект');
    } else if (kind === 'art') {
      var wa = curWork(); if (!wa) return;
      var ab = await prepareHeader(f), ap = wa.art || ('art/' + dirOf(wa.slug) + '.jpg');
      setBin(ap, ab); wa.art = ap; render(true); notify('Иллюстрация загружена (не опубликована)');
    } else if (kind === 'txt') {
      var w2 = curWork(); if (!w2) return;
      var t = await f.text(); if (texts[w2.path] && texts[w2.path].trim() && !await ask('Заменить текст?', 'Текущий текст будет заменён содержимым файла «' + esc(f.name) + '».', 'Заменить')) return;
      setText(w2.path, t.replace(/\r\n/g, '\n')); fillEditor(w2); notify('Текст загружен из файла');
    }
  } catch (e) { notify(e.message, true); }
}

function bindEvents() {
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]');
    if (a) { e.preventDefault(); if (ACT[a.dataset.act]) ACT[a.dataset.act](a); return; }
    var r = e.target.closest('.row[data-href]'); if (r && !e.target.closest('button,a')) location.hash = r.dataset.href;
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'ed') { var w = curWork(); if (w) { setText(w.path, t.value); updCounts(); } return; }
    if (t.id === 'wq') { UI.q = t.value; document.getElementById('list').innerHTML = listHtml(); return; }
    if (t.dataset && t.dataset.bind) onBind(t);
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.file) onFile(t);
    else if (t.dataset && t.dataset.bind && (t.tagName === 'SELECT' || t.type === 'checkbox')) { onBind(t); if (t.dataset.bind === 'work:kind' || t.dataset.bind === 'work:status' || t.dataset.bind === 'work:readerStyle') render(true); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.id === 'ed' && (e.ctrlKey || e.metaKey)) {
      if (e.code === 'KeyB') { e.preventDefault(); mdAction('b'); } else if (e.code === 'KeyI') { e.preventDefault(); mdAction('i'); }
    }
    if (e.target.id === 'ed' && e.key === 'Tab') { e.preventDefault(); var t = e.target; insertAt(t.selectionStart, t.selectionEnd, '  '); }
  });
  document.addEventListener('load', function (e) { var it = e.target.closest && e.target.closest('.hero-item'); if (it && e.target.tagName === 'IMG') heroPhone(it); }, true);
  window.addEventListener('resize', function () { $$('.hero-item').forEach(heroPhone); });
  window.addEventListener('hashchange', function () { render(); });
  window.addEventListener('beforeunload', function (e) { if (pendingCount()) { e.preventDefault(); e.returnValue = ''; } });
}

/* ───────── показ страницы ───────── */
function render(keepScroll) {
  var p = parseHash(), name = VIEWS[p[0]] ? p[0] : 'home', y = window.scrollY;
  var v = VIEWS[name](p[1] ? decodeURIComponent(p[1]) : null);
  document.getElementById('view').innerHTML = v.html; setTitle(v.title);
  $$('[data-nav]').forEach(function (a) { var on = a.dataset.nav === name; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  chrome();
  window.scrollTo(0, keepScroll === true ? y : 0);
  if (v.after) v.after();
}

function start() {
  renderShell();
  var notes = {};
  initState({ SITE: SITE, HERO: HERO, HERO_FOCUS: HERO_FOCUS, WORKS: WORKS, NEWS: NEWS }, notes);
  bindEvents(); render();
  /* комментарии к картинкам шапки (// …) в загруженный data.js не попадают — подтягиваем их из самого файла */
  fetch('js/data.js', { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
    if (!t) return; var p = parseData(t).notes;
    if (Object.keys(p).length && !Object.keys(S.NOTES).length) { S.NOTES = p; BASE.NOTES = clone(p); if (parseHash()[0] === 'hero') render(true); }
  }).catch(function () {});
}
start();
})();

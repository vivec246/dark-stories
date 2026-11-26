/* ШАПКА: настройки слайдов и эффекты надписи «Dark Stories».
   Настройки лежат в SITE (js/data.js) и меняются в админке на странице «Шапка»:
     heroSeconds     — сколько секунд показывается картинка (2–30)
     heroCount       — сколько слайдов показывать (0 — все)
     heroOrder       — 'normal' по порядку или 'random' в случайном порядке при каждом заходе
     heroFx          — эффект надписи: mist, pixel, aurora, embers, glitch, none
     heroFxIntensity — сила эффекта (1–10)
     heroFxSpeed     — скорость (1–10)
     heroFxColor     — цвет: frost, gold, blood, emerald
   Файл подключается и сайтом, и админкой (там тот же движок рисует живой предпросмотр). */

var HERO_FX_LIST = [
  ['mist', 'Dark Stories'], ['pixel', 'Пиксельная волна'], ['aurora', 'Северное сияние'],
  ['embers', 'Угли и искры'], ['glitch', 'Глитч'], ['none', 'Без эффекта']
];
var HERO_FX_COLORS = {
  frost:   ['Голубой (основной)',     '#88aadd', '#ffffff', '136,170,221'],
  gold:    ['Золото',  '#e3c470', '#fff3cf', '227,196,112'],
  blood:   ['Кровь',   '#e0584c', '#ffe3dc', '224,88,76'],
  emerald: ['Изумруд', '#4fd1a1', '#e0fff3', '79,209,161']
};

function heroCfg(site) {
  site = site || {};
  function num(v, d, a, b) { if (v === undefined || v === null || v === '') return d; v = Number(v); return isFinite(v) ? Math.max(a, Math.min(b, v)) : d; }
  var fx = String(site.heroFx || 'mist'); if (!HERO_FX_LIST.some(function (x) { return x[0] === fx; })) fx = 'mist';
  var col = site.heroFxColor && HERO_FX_COLORS[site.heroFxColor] ? site.heroFxColor : 'frost';
  return {
    seconds: num(site.heroSeconds, 5, 2, 30),
    count: Math.round(num(site.heroCount, 0, 0, 99)),
    order: site.heroOrder === 'random' ? 'random' : 'normal',
    fx: fx, intensity: num(site.heroFxIntensity, 5, 1, 10), speed: num(site.heroFxSpeed, 5, 1, 10), color: col
  };
}

/* применить к списку картинок шапки число слайдов и порядок (вызывается один раз при запуске сайта, не в админке) */
function heroApplyOptions() {
  var c = heroCfg(SITE), list = HERO.slice();
  if (c.order === 'random') for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = list[i]; list[i] = list[j]; list[j] = t; }
  if (c.count > 0 && c.count < list.length) list = list.slice(0, c.count);
  HERO.length = 0; Array.prototype.push.apply(HERO, list);
}

var HeroFx = (function () {
  var reduce = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches; };

  /* текст заголовка с переносами — для эффекта «Глитч» (копия текста в псевдоэлементах) */
  function plainText(h1) {
    var s = ''; h1.childNodes.forEach(function (n) { s += n.nodeName === 'BR' ? '\n' : (n.nodeType === 3 ? n.textContent : ''); });
    return s;
  }

  /* маска текста: список «клеток» (x, y, покрытие) по контуру букв; по ним рисуются пиксели и вылетают искры */
  function sampleCells(h1, pad, cell) {
    var hr = h1.getBoundingClientRect(), W = Math.ceil(hr.width) + pad * 2, H = Math.ceil(hr.height) + pad * 2;
    var cs = getComputedStyle(h1), off = document.createElement('canvas'); off.width = W; off.height = H;
    var ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT), n, r = document.createRange();
    while ((n = walker.nextNode())) {
      var txt = n.textContent; if (!txt.trim()) continue;
      r.selectNodeContents(n); var rc = r.getClientRects()[0]; if (!rc) continue;
      var m = ctx.measureText(txt), asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.9;
      ctx.fillText(txt, rc.left - hr.left + pad, rc.top - hr.top + pad + asc);
    }
    var data = ctx.getImageData(0, 0, W, H).data, cells = [];
    for (var y = 0; y < H - cell; y += cell) for (var x = 0; x < W - cell; x += cell) {
      var sum = 0, cnt = 0;
      for (var yy = 0; yy < cell; yy += 2) for (var xx = 0; xx < cell; xx += 2) { sum += data[((y + yy) * W + x + xx) * 4 + 3]; cnt++; }
      var cov = sum / cnt / 255;
      if (cov > 0.18) cells.push([x, y, Math.min(1, cov * 1.25)]);
    }
    return { cells: cells, W: W, H: H };
  }

  function placeCanvas(cv, h1, pad) {
    cv.style.left = (h1.offsetLeft - pad) + 'px'; cv.style.top = (h1.offsetTop - pad) + 'px';
  }

  function mount(h1, cfg) {
    if (!h1) return;
    if (h1._fx) h1._fx.stop();
    cfg = cfg || heroCfg(SITE);
    var col = HERO_FX_COLORS[cfg.color];
    ['mist', 'pixel', 'aurora', 'embers', 'glitch', 'none'].forEach(function (f) { h1.classList.remove('fx-' + f); });
    h1.classList.add('fx-title', 'fx-' + cfg.fx);
    var st = h1.style;
    st.setProperty('--fx-a', col[1]); st.setProperty('--fx-b', col[2]); st.setProperty('--fx-rgb', col[3]);
    st.setProperty('--fx-dur', (35 / cfg.speed).toFixed(2) + 's');
    st.setProperty('--fx-gdur', (12 / cfg.speed).toFixed(2) + 's');
    st.setProperty('--fx-int', (cfg.intensity / 10).toFixed(2));
    st.setProperty('--fx-glow', (0.25 + cfg.intensity * 0.12).toFixed(2));
    h1.setAttribute('data-text', plainText(h1));

    var raf = 0, cv = null, stopped = false, onResize = null;
    var inst = { stop: function () {
      stopped = true; cancelAnimationFrame(raf); if (cv) cv.remove(); if (onResize) window.removeEventListener('resize', onResize);
      h1.classList.remove('fx-canvas-on'); h1._fx = null;
    } };
    h1._fx = inst;
    if ((cfg.fx !== 'pixel' && cfg.fx !== 'embers') || reduce()) return inst;

    var pad = cfg.fx === 'embers' ? 70 : 24, parent = h1.parentNode;
    function start() {
      if (stopped || !h1.isConnected) return;
      if (cv) cv.remove();
      var fs = parseFloat(getComputedStyle(h1).fontSize) || 100;
      var cell = cfg.fx === 'pixel' ? Math.max(3, Math.round(fs / 30 + cfg.intensity * 0.35)) : Math.max(3, Math.round(fs / 24));
      var S = sampleCells(h1, pad, cell);
      cv = document.createElement('canvas'); cv.className = 'fx-canvas fx-canvas-' + cfg.fx; cv.width = S.W; cv.height = S.H; cv.setAttribute('aria-hidden', 'true');
      cv.style.width = S.W + 'px'; cv.style.height = S.H + 'px'; placeCanvas(cv, h1, pad); parent.appendChild(cv);
      if (cfg.fx === 'pixel') h1.classList.add('fx-canvas-on');
      var ctx = cv.getContext('2d'), t0 = performance.now(), cells = S.cells, last = 0;
      var ar = parseInt(col[3].split(',')[0], 10), ag = parseInt(col[3].split(',')[1], 10), ab = parseInt(col[3].split(',')[2], 10);
      var lr = parseInt(col[2].slice(1, 3), 16), lg = parseInt(col[2].slice(3, 5), 16), lb = parseInt(col[2].slice(5, 7), 16);
      var amp = cell * (0.35 + cfg.intensity * 0.22), spd = 0.5 + cfg.speed * 0.28, parts = [];

      function frame(now) {
        if (stopped) return;
        if (!h1.isConnected) { inst.stop(); return; }
        raf = requestAnimationFrame(frame);
        if (now - last < 33) return; last = now;     /* ~30 кадров в секунду */
        var t = (now - t0) / 1000;
        ctx.clearRect(0, 0, S.W, S.H);
        if (cfg.fx === 'pixel') {
          var band = ((t * spd * 120) % (S.W + 400)) - 200;      /* яркая полоса, бегущая слева направо */
          for (var i = 0; i < cells.length; i++) {
            var c = cells[i], x = c[0], y = c[1];
            var ph = x * 0.021 - t * spd * 1.6;
            var v = (Math.sin(ph) + 1) / 2;
            var dy = Math.sin(ph * 1.15 + y * 0.012) * amp;
            var d = (x - band) / 70, gl = Math.exp(-d * d);
            var k = Math.min(1, v * 0.55 + gl * 0.9);
            var r = ar + (lr - ar) * k, g = ag + (lg - ag) * k, b = ab + (lb - ab) * k;
            ctx.fillStyle = 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + (0.5 + 0.5 * Math.max(v, gl)) * c[2] + ')';
            var s = cell - 1;
            ctx.fillRect(x, y + dy, s, s);
          }
        } else {
          /* угли и искры */
          var rate = cfg.intensity * 0.9;
          for (var n = 0; n < rate; n++) if (parts.length < 40 + cfg.intensity * 26 && cells.length && Math.random() < 0.7) {
            var cc = cells[(Math.random() * cells.length) | 0];
            parts.push({ x: cc[0] + Math.random() * cell, y: cc[1] + Math.random() * cell, vx: (Math.random() - 0.5) * 10, vy: -(14 + Math.random() * 38) * (0.5 + cfg.speed * 0.12), life: 0, max: 1.1 + Math.random() * 1.9, sz: 0.8 + Math.random() * (0.8 + cfg.intensity * 0.18), ph: Math.random() * 6 });
          }
          ctx.globalCompositeOperation = 'lighter';
          var dt = 0.033;
          for (var p = parts.length - 1; p >= 0; p--) {
            var q = parts[p]; q.life += dt;
            if (q.life > q.max) { parts.splice(p, 1); continue; }
            q.x += (q.vx + Math.sin(t * 2 + q.ph) * 9) * dt; q.y += q.vy * dt;
            var u = q.life / q.max, a = (1 - u) * (0.55 + 0.45 * Math.sin(t * 14 + q.ph));
            var rr = 255, gg = (230 - u * 150) | 0, bb = (150 - u * 130) | 0;
            ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + Math.max(0, a) + ')';
            ctx.beginPath(); ctx.arc(q.x, q.y, q.sz * (1 - u * 0.5), 0, 6.283); ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      raf = requestAnimationFrame(frame);
    }
    onResize = function () { clearTimeout(onResize._t); onResize._t = setTimeout(function () { cancelAnimationFrame(raf); start(); }, 200); };
    window.addEventListener('resize', onResize);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(start, cfg.delay == null ? 1100 : cfg.delay); });
    return inst;
  }

  function mountSite() { mount(document.querySelector('.hero .site-title'), heroCfg(SITE)); }
  return { mount: mount, mountSite: mountSite };
})();

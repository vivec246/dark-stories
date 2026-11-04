/* МЕНЮ ПРАВОЙ КНОПКИ В ЧИТАЛКЕ и ЦИТАТЫ (как в версии 3):
   «Копировать», «Процитировать», «Выделить всё». Цитату можно отправить ВКонтакте, в Telegram или скопировать. */

var capturedSelectionText = '';
var pendingQuoteShareText = '';

function hideContextMenu() { var m = $('#readerContextMenu'); if (m) m.classList.remove('show'); }
function contextMenuOpen() { var m = $('#readerContextMenu'); return !!(m && m.classList.contains('show')); }
function showContextMenu(x, y) {
  var m = $('#readerContextMenu'); if (!m) return;
  var has = capturedSelectionText.length > 0;
  $$('[data-action="copy"], [data-action="quote"], [data-action="card"]', m).forEach(function (i) { i.style.display = has ? 'flex' : 'none'; });
  m.classList.add('show');
  var r = m.getBoundingClientRect();
  m.style.left = Math.max(10, Math.min(x, window.innerWidth - r.width - 10)) + 'px';
  m.style.top = Math.max(10, Math.min(y, window.innerHeight - r.height - 10)) + 'px';
}

document.addEventListener('contextmenu', function (e) {
  if (!R || !e.target.closest || !e.target.closest('#reader') || e.target.closest('.v3modal')) return;
  e.preventDefault();
  /* выделение запоминаем сразу: после клика по меню браузер его снимет */
  capturedSelectionText = String(window.getSelection() || '').trim();
  showContextMenu(e.clientX, e.clientY);
});
document.addEventListener('click', function (e) {
  var m = $('#readerContextMenu');
  if (m && m.classList.contains('show') && !m.contains(e.target)) hideContextMenu();
});
window.addEventListener('scroll', hideContextMenu, { passive: true });
window.addEventListener('resize', hideContextMenu);

(function () {
  var m = $('#readerContextMenu'); if (!m) return;
  m.addEventListener('click', function (e) {
    var item = e.target.closest('.context-menu-item'); if (!item) return;
    var action = item.getAttribute('data-action');
    hideContextMenu();
    if (action === 'copy') copySelection();
    else if (action === 'selectAll') selectAllReaderText();
    else if (action === 'quote') quoteSelection();
    else if (action === 'card') quoteCard();
  });
})();

function copySelection() {
  if (!capturedSelectionText) return;
  copyText(capturedSelectionText).then(function () { toast('Текст скопирован'); }).catch(function () { toast('Не удалось скопировать текст'); });
}
function selectAllReaderText() {
  var body = $('#rart'); if (!body) return;
  var range = document.createRange(); range.selectNodeContents(body);
  var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
}
function quoteSelection() {
  if (!capturedSelectionText || !R) return;
  var w = R.work, fullText = '«' + capturedSelectionText + '»\n— «' + w.title + '», ' + SITE.name;
  var shareUrl = location.origin + location.pathname + '#/read/' + w.slug;
  /* на телефоне — сразу системное «Поделиться» */
  if (navigator.share) { navigator.share({ text: fullText, url: shareUrl }).catch(function () {}); return; }
  openQuoteShareModal(capturedSelectionText, fullText, shareUrl);
}
function openQuoteShareModal(quoteOnly, fullText, shareUrl) {
  pendingQuoteShareText = fullText;
  var pv = $('#quoteSharePreview'); if (pv) pv.textContent = '«' + quoteOnly + '»';
  var vk = $('#quoteShareVk'); if (vk) vk.href = 'https://vk.com/share.php?url=' + encodeURIComponent(shareUrl) + '&title=' + encodeURIComponent(fullText);
  var tg = $('#quoteShareTelegram'); if (tg) tg.href = 'https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(fullText);
  var modal = $('#quoteShareModal'); if (modal) modal.style.display = 'flex';
}
function closeQuoteShare() { var m = $('#quoteShareModal'); if (m) m.style.display = 'none'; }
function quoteShareOpen() { var m = $('#quoteShareModal'); return !!(m && m.style.display === 'flex'); }
function copyQuoteToClipboard() {
  if (!pendingQuoteShareText) return;
  copyText(pendingQuoteShareText).then(function () { toast('Цитата скопирована'); closeQuoteShare(); })
    .catch(function () { toast('Не удалось скопировать цитату'); });
}

/* ОТКРЫТКА С ЦИТАТОЙ: картинка 1080×1350 — обложка текста на фоне, цитата, название и автор */
(function () {
  var ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
  var m = $('#readerContextMenu'), q = m && m.querySelector('[data-action="quote"]');
  if (q && !m.querySelector('[data-action="card"]')) {
    var it = document.createElement('div');
    it.className = 'context-menu-item'; it.setAttribute('data-action', 'card'); it.setAttribute('role', 'menuitem');
    it.innerHTML = ICON + '<span>Открытка</span>';
    q.parentNode.insertBefore(it, q.nextSibling);
  }
  var vk = $('#quoteShareVk');
  if (vk && vk.parentNode && !$('#quoteShareCard')) {
    var b = document.createElement('div');
    b.id = 'quoteShareCard'; b.className = 'quote-share-btn'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
    b.innerHTML = ICON + '<span>Сделать открытку</span>';
    b.addEventListener('click', function () { closeQuoteShare(); quoteCard(); });
    vk.parentNode.appendChild(b);
  }
})();

var cardUrl = '';
function cardPreviewOpen() { var m = $('#cardPreview'); return !!(m && m.style.display === 'flex'); }
function closeCardPreview() {
  var m = $('#cardPreview'); if (m) m.style.display = 'none';
  if (cardUrl) { URL.revokeObjectURL(cardUrl); cardUrl = ''; }
}
function wrapCanvasText(g, text, maxW) {
  var words = text.split(/\s+/), lines = [], cur = '';
  words.forEach(function (w) {
    var t = cur ? cur + ' ' + w : w;
    if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  });
  if (cur) lines.push(cur);
  return lines;
}
function buildQuoteCard(quote, w) {
  return new Promise(function (resolve, reject) {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d'), img = new Image(), SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
    var text = quote.replace(/\s+/g, ' ').trim();
    if (text.length > 480) text = text.slice(0, 477).replace(/\s+\S*$/, '') + '…';
    function draw(withImg) {
      try {
        g.clearRect(0, 0, W, H);
        g.fillStyle = '#05070a'; g.fillRect(0, 0, W, H);
        if (withImg) {   /* обложка от верха, чтобы не терять лица */
          var k = Math.max(W / img.width, H / img.height), iw = img.width * k, ih = img.height * k;
          g.drawImage(img, (W - iw) / 2, 0, iw, ih);
        }
        var gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, 'rgba(5,7,10,.5)'); gr.addColorStop(.4, 'rgba(5,7,10,.84)'); gr.addColorStop(1, 'rgba(5,7,10,.95)');
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(136,170,221,.5)'; g.lineWidth = 2; g.strokeRect(44, 44, W - 88, H - 88);
        g.strokeStyle = 'rgba(136,170,221,.2)'; g.lineWidth = 1; g.strokeRect(58, 58, W - 116, H - 116);
        g.textBaseline = 'alphabetic'; g.textAlign = 'left';
        g.fillStyle = '#88aadd'; g.font = '700 200px ' + SERIF; g.fillText('«', 110, 330);
        var size = 84, lines = [], lh = 0, areaTop = 400, areaH = 640;   /* чем длиннее цитата, тем мельче шрифт */
        for (; size >= 32; size -= 2) {
          g.font = '600 ' + size + 'px ' + SERIF;
          lines = wrapCanvasText(g, text, 840); lh = size * 1.34;
          if (lines.length * lh <= areaH) break;
        }
        g.fillStyle = '#f3f6fb'; g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 18;
        lines.forEach(function (ln, i) { g.fillText(ln, 120, areaTop + size + i * lh); });
        g.shadowBlur = 0;
        g.fillStyle = '#88aadd'; g.fillRect(120, 1100, 120, 3);
        var title = w.title, ts = 42;
        for (; ts >= 24; ts -= 2) { g.font = '700 ' + ts + 'px ' + SERIF; if (g.measureText(title).width <= 840) break; }
        g.fillStyle = '#ffffff'; g.fillText(title, 120, 1172);
        g.fillStyle = 'rgba(136,170,221,.9)'; g.font = '600 24px Montserrat, Arial, sans-serif';
        if ('letterSpacing' in g) g.letterSpacing = '6px';
        g.fillText((SITE.author + ' · ' + SITE.name).toUpperCase(), 120, 1230);
        if ('letterSpacing' in g) g.letterSpacing = '0px';
        c.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('blob')); }, 'image/png');
      } catch (err) {
        if (withImg) draw(false); else reject(err);   /* если браузер не дал читать обложку — рисуем без неё */
      }
    }
    img.onload = function () { draw(true); };
    img.onerror = function () { draw(false); };
    img.src = w.cover;
  });
}
function showCardPreview(blob, w) {
  if (cardUrl) URL.revokeObjectURL(cardUrl);
  cardUrl = URL.createObjectURL(blob);
  var file = null, canShare = false;
  try { file = new File([blob], 'dark-stories-citata.png', { type: 'image/png' }); canShare = !!(navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) {}
  var m = $('#cardPreview');
  if (!m) {
    m = document.createElement('div'); m.id = 'cardPreview'; m.className = 'v3modal'; m.style.display = 'none';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('[data-cardclose]')) { closeCardPreview(); return; }
      if (e.target.closest('#cardShare') && m._file) navigator.share({ files: [m._file], title: m._title, text: m._title }).catch(function () {});
      else if (e.target.closest('#cardDl')) toast('Открытка сохранена');
    });
  }
  m._file = canShare ? file : null; m._title = '«' + w.title + '», ' + SITE.name;
  m.innerHTML = '<div class="modal-box card-box"><button type="button" class="modal-x" data-cardclose aria-label="Закрыть">✕</button><h3 class="modal-title">ОТКРЫТКА</h3>' +
    '<img class="card-img" src="' + cardUrl + '" alt="Открытка с цитатой">' +
    '<div class="quote-share-actions"><a id="cardDl" class="quote-share-btn" href="' + cardUrl + '" download="dark-stories-citata.png">' +
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Скачать картинку</span></a>' +
    (canShare ? '<div id="cardShare" class="quote-share-btn" role="button" tabindex="0"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><span>Поделиться</span></div>' : '') +
    '</div></div>';
  m.style.display = 'flex';
}
function quoteCard() {
  if (!capturedSelectionText || !R) return;
  var w = R.work, text = capturedSelectionText;
  var fonts = (document.fonts && document.fonts.load)
    ? Promise.all([document.fonts.load('600 40px "Playfair Display"'), document.fonts.load('700 40px "Playfair Display"')]).catch(function () {})
    : Promise.resolve();
  toast('Готовлю открытку…');
  fonts.then(function () { return buildQuoteCard(text, w); })
    .then(function (blob) { showCardPreview(blob, w); })
    .catch(function () { toast('Не удалось сделать открытку'); });
}

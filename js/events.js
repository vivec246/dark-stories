/* СОБЫТИЯ: клики, поиск, скролл, клавиши. */

document.addEventListener('click', function (e) {
  var t = e.target;
  function up(sel) { return t.closest ? t.closest(sel) : null; }
  var el;
  var fpop = $('#fontpop');
  if (fpop && !fpop.hidden && !up('#fontpop') && !up('[data-act="font"]')) fpop.hidden = true;
  var spop = $('#spop');
  var closedSp = false;
  if (spop && !spop.hidden && !up('#spop') && !up('[data-act="settings"]')) { spop.hidden = true; closedSp = true; }
  /* кнопки настроек чтения: тема, шрифт, ширина, интервал, режим страха */
  if ((el = up('[data-pref]')) && R) { setReaderPref(el.getAttribute('data-pref'), el.getAttribute('data-val')); return; }
  if ((el = up('.hero-dot'))) {
    showHeroSlide(Number(el.getAttribute('data-slide')));
    startHero(); /* после ручного выбора автолистание отсчитывает 5 секунд заново */
    return;
  }
  /* полка: касание вне книги закрывает открытую (на телефоне) */
  if (!up('.book')) $$('.book.open').forEach(function (b) { b.classList.remove('open'); });
  if (up('[data-docclose]')) { closeDoc(); return; }
  if (up('#backToTopBtn')) {
    var hero = $('.hero');
    window.scrollTo({ top: hero ? hero.offsetHeight - 1 : 0, behavior: 'smooth' });
    return;
  }
  if ((el = up('[data-goto]'))) {
    e.preventDefault();
    var tgt = document.getElementById(el.getAttribute('data-goto')); if (tgt) tgt.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if ((el = up('[data-goto-id]'))) {
    var id = el.getAttribute('data-goto-id'), node = document.getElementById(id);
    if (el.hasAttribute('data-close')) closeDialog();
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if ((el = up('[data-fav]'))) {
    var slug = el.getAttribute('data-fav'); Store.toggleFav(slug);
    var on = Store.isFav(slug);
    if (parseHash().path === '/') {
      /* на главной обновляем полку и рекомендации, шапку и меню не трогаем */
      var mainEl = $('#main'); if (mainEl) mainEl.innerHTML = PAGES['/'].render();
      initCardAnimation();
      toast(on ? 'Добавлено на вашу полку' : 'Убрано с полки');
      return;
    }
    $$('[data-fav="' + slug + '"]').forEach(function (b) {
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Убрать с полки' : 'Добавить на полку');
    });
    toast(on ? 'Добавлено на вашу полку' : 'Убрано с полки');
    return;
  }
  if ((el = up('[data-desc]'))) {
    var dcard = el.closest('.card, .bcard');
    if (dcard.classList.contains('bcard')) {   /* книга переворачивается: на обороте описание */
      dcard.classList.add('flip-anim'); dcard.classList.toggle('flipped');
      setTimeout(function () { dcard.classList.remove('flip-anim'); }, 950);
    } else dcard.classList.toggle('desc-open');
    return;
  }
  if ((el = up('.book[data-href]')) && !up('a, button')) {
    /* на сенсорном экране нет наведения: первое касание разворачивает книгу, второе открывает */
    if (window.matchMedia && matchMedia('(hover:none)').matches && !el.classList.contains('open')) {
      $$('.book.open').forEach(function (b) { b.classList.remove('open'); });
      el.classList.add('open');
      if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    location.hash = el.getAttribute('data-href'); return;
  }
  if ((el = up('.card[data-href], .bcard[data-href], .paper[data-href]')) && !up('a, button, .bc-back')) { location.hash = el.getAttribute('data-href'); return; }
  if (up('#qicon')) { toggleSearchBar(); return; }
  if (up('#qclear')) { var q = $('#q'); q.value = ''; runSearch(''); q.focus(); return; }
  if (up('.results a')) { closeResults(); var qi = $('#q'); if (qi) qi.value = ''; if (searchBarOpen()) { var nv = $('.nav'); nv.classList.remove('search-open'); var lb = $('#qicon'); if (lb) lb.setAttribute('aria-expanded', 'false'); } return; }
  if (!up('.search')) { closeResults(); if (searchBarOpen() && !($('#q') || {}).value) closeSearchBar(); }

  if ((el = up('[data-bm-del]'))) { Store.removeBookmark(R.work.slug, el.getAttribute('data-bm-del')); openDialog('bookmarks'); return; }
  if ((el = up('[data-bm-go]'))) { window.scrollTo({ top: Number(el.getAttribute('data-bm-go')), behavior: 'smooth' }); closeDialog(); return; }
  if (t.hasAttribute && t.hasAttribute('data-bgclose')) { closeDialog(); return; }
  if (up('[data-close]')) { closeDialog(); return; }

  /* на телефоне касание по тексту прячет/показывает кнопки (как в версии 3) */
  if (R && window.innerWidth <= 768 && up('#reader') && !closedSp && !up('.rtools, .share, .spop, .v3modal, [data-act]') && !String(window.getSelection() || '').trim()) {
    toggleControls();
    return;
  }

  if ((el = up('[data-act]')) && R) {
    var act = el.getAttribute('data-act'), w = R.work;
    if (act === 'close') { location.hash = returnHash || (w.kind === 'article' ? '#/articles' : '#/'); }
    else if (act === 'theme') cycleTheme();
    else if (act === 'settings') { var sp = $('#spop'); sp.hidden = !sp.hidden; var fp0 = $('#fontpop'); if (fp0) fp0.hidden = true; }
    else if (act === 'bookmarks') openDialog('bookmarks');
    else if (act === 'toc') openDialog('toc');
    else if (act === 'font') { var fp = $('#fontpop'); fp.hidden = !fp.hidden; var sp1 = $('#spop'); if (sp1) sp1.hidden = true; }
    else if (act === 'share') {
      var url = location.origin + location.pathname + '#/read/' + w.slug;
      if (navigator.share) navigator.share({ title: w.title, url: url }).catch(function () {});
      else copyText(url).then(function () { toast('Ссылка скопирована — можно отправлять'); }).catch(function () { toast(url); });
    }
    else if (act === 'bm-save') {
      Store.addBookmark(w.slug, { text: w.title, pos: window.scrollY });
      toast('Закладка сохранена'); openDialog('bookmarks');
    }
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (contextMenuOpen()) { hideContextMenu(); return; }
    if (cardPreviewOpen()) { closeCardPreview(); return; }
    var spEsc = $('#spop'); if (spEsc && !spEsc.hidden) { spEsc.hidden = true; return; }
    if (quoteShareOpen()) { closeQuoteShare(); return; }
    if ($('#overlay-root .v3modal')) { closeDialog(); return; }
    var rs = $('#results'); if (rs && !rs.hidden) { closeResults(); return; }
    if (searchBarOpen()) { closeSearchBar(); return; }
    if (isDocPath(parseHash().path)) { closeDoc(); return; }
    if (R) location.hash = returnHash || (R.work.kind === 'article' ? '#/articles' : '#/');
    return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && (e.target.classList.contains('card') || e.target.classList.contains('book') || e.target.classList.contains('bcard') || e.target.classList.contains('paper')) && e.target.getAttribute('data-href')) {
    e.preventDefault(); location.hash = e.target.getAttribute('data-href');
  }
  /* горячие клавиши читалки: ← → листать, + − размер, T тема, F скрыть кнопки */
  if (R && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || '') &&
      !$('#overlay-root .v3modal') && !quoteShareOpen() && !cardPreviewOpen() && !contextMenuOpen()) {
    var page = window.innerHeight * 0.85;
    if (e.key === 'ArrowRight') { e.preventDefault(); window.scrollBy({ top: page, behavior: 'smooth' }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); window.scrollBy({ top: -page, behavior: 'smooth' }); }
    else if (e.key === '+' || e.key === '=') readerFontStep(0.1);
    else if (e.key === '-' || e.key === '_') readerFontStep(-0.1);
    else if (e.code === 'KeyT') cycleTheme();
    else if (e.code === 'KeyF') toggleControls();
  }
});

document.addEventListener('input', function (e) {
  if (e.target.id === 'fontrange') {
    var v = Number(e.target.value); Store.setFont(v); applyFont();
  }
  if (e.target.id === 'q') runSearch(e.target.value);
});
document.addEventListener('focusin', function (e) {
  if (e.target.id === 'q') { loadAllBodies().then(function () { var q = $('#q'); if (q && q.value) runSearch(q.value); }); runSearch(e.target.value); }
});
/* поиск на телефоне: за лупой справа, раскрывается по нажатию */
function searchBarOpen() { var n = $('.nav'); return !!(n && n.classList.contains('search-open')); }
function openSearchBar() {
  var n = $('.nav'); if (!n) return;
  n.classList.add('search-open'); n.classList.remove('hide');
  var b = $('#qicon'); if (b) b.setAttribute('aria-expanded', 'true');
  var q = $('#q'); if (q) q.focus();
}
function closeSearchBar() {
  var n = $('.nav'); if (!n) return;
  n.classList.remove('search-open');
  var b = $('#qicon'); if (b) b.setAttribute('aria-expanded', 'false');
  var q = $('#q'); if (q) { q.value = ''; runSearch(''); q.blur(); }
}
function toggleSearchBar() {
  if (window.innerWidth > 768) { var q = $('#q'); if (q) q.focus(); return; }
  if (searchBarOpen()) closeSearchBar(); else openSearchBar();
}
function closeResults() { var r = $('#results'); if (r) { r.hidden = true; r.innerHTML = ''; } }
function runSearch(value) {
  var clear = $('#qclear'), ic = $('#qicon'), box = $('#results');
  if (!box) return;
  /* крестик появляется только когда в поле есть текст; лупа остаётся всегда */
  if (clear) clear.hidden = !value;
  var q = value.trim();
  if (q.length < 2) { closeResults(); return; }
  var hits = searchWorks(q);
  box.hidden = false;
  box.innerHTML = '<p class="head">' + (hits.length ? 'Найдено: ' + hits.length : 'Ничего не найдено') + '</p>' + hits.map(function (h) {
    return '<a href="#/read/' + h.w.slug + '?q=' + encodeURIComponent(q) + '"><p class="t">' + esc(h.w.title) + ' <small>' + (h.w.kind === 'story' ? 'Рассказ' : 'Статья') + '</small></p><p class="s">' + hl(h.snippet, q) + '</p></a>';
  }).join('');
}

/* кнопка «Наверх»: появляется после 400 px, в читалке скрыта */
/* пока меню стоит прямо под шапкой («припарковано»), под ним продолжение картинки; когда прилипло к верху — обычный тёмный вид */
function updateNavParked() {
  var nav = $('.nav'); if (!nav) return;
  var parked = !!$('.hero') && nav.getBoundingClientRect().top > 1;
  nav.classList.toggle('parked', parked);
}
function updateBackToTop() {
  updateNavParked();
  var b = $('#backToTopBtn'); if (!b) return;
  b.classList.toggle('show', window.scrollY > 400 && !$('#reader'));
  /* когда внизу показывается подвал, кнопка поднимается и остаётся над ним, не заходя на него */
  var f = $('.footer'), lift = 0;
  if (f) lift = Math.max(0, window.innerHeight - f.getBoundingClientRect().top);
  b.style.setProperty('--lift', lift + 'px');
}

/* скролл: прогресс чтения и прячущееся меню на телефоне */
var lastY = window.scrollY, ticking = false;
window.addEventListener('scroll', function () {
  if (ticking) return; ticking = true;
  window.requestAnimationFrame(function () {
    var y = window.scrollY, nav = $('.nav');
    if (nav) {
      var heroEl = $('.hero'), limit = heroEl ? heroEl.offsetHeight : 80;
      if (window.innerWidth > 768 || y < limit || nav.classList.contains('search-open')) nav.classList.remove('hide');
      else if (y - lastY > 10) nav.classList.add('hide');
      else if (lastY - y > 10) nav.classList.remove('hide');
    }
    lastY = y;
    updateBackToTop();
    if (R && $('#rart') && R.blocks.length) {
      var el = document.documentElement, pct = updateProgressBar();
      Store.setProgress(R.work.slug, { percent: pct, scrollTop: el.scrollTop, date: new Date().toISOString() });
    }
    ticking = false;
  });
}, { passive: true });

window.addEventListener('resize', updateBackToTop);

/* книги в разделе «Книги» наклоняются за курсором мыши */
document.addEventListener('pointermove', function (e) {
  if (e.pointerType === 'touch' || !e.target.closest) return;
  var c = e.target.closest('.bcard'); if (!c) return;
  var r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  c.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
});
document.addEventListener('pointerout', function (e) {
  var c = e.target.closest && e.target.closest('.bcard');
  if (c && !c.contains(e.relatedTarget)) { c.style.removeProperty('--mx'); c.style.removeProperty('--my'); }
});

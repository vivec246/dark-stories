/* РАЗБОР MARKDOWN: заголовки, абзацы, цитаты, списки, **жирный**, __жирный__, *курсив*, <center>…</center>, подсветка поиска. */

function parseMd(md) {
  var lines = md.replace(/\r\n/g, '\n').split('\n'), blocks = [], para = [], list = null;
  function flush() { if (para.length) { var t = para.join(' ').trim(); if (t) blocks.push({ t: 'p', text: t }); para = []; } }
  function flushList() { if (list) { blocks.push(list); list = null; } }
  lines.forEach(function (raw) {
    var tr = raw.trim(), m;
    /* <center>…</center> — выравнивание по центру (так размечены главы и титульные строки) */
    var center = /<\/?center>/i.test(tr);
    if (center) tr = tr.replace(/<\/?center>/gi, '').trim();
    if (!tr) { flush(); flushList(); return; }
    if (tr === '---' || tr === '***') { flush(); flushList(); blocks.push({ t: 'hr' }); return; }
    if ((m = tr.match(/^(#{1,3})\s+(.*)$/))) {
      flush(); flushList();
      var lvl = m[1].length, ht = m[2].replace(/<\/?center>/gi, '').trim();
      blocks.push({ t: lvl === 3 ? 'h3' : 'h2', id: slugify(ht.replace(/[*_]+/g, '')), text: ht, top: lvl === 1, center: center });
      return;
    }
    if (center) { flush(); flushList(); blocks.push({ t: 'p', text: tr, center: true }); return; }
    if (tr.indexOf('> ') === 0) { flush(); flushList(); blocks.push({ t: 'bq', text: tr.slice(2).trim() }); return; }
    if ((m = tr.match(/^[-*+]\s+(.*)$/))) { flush(); if (!list || list.t !== 'ul') { flushList(); list = { t: 'ul', items: [] }; } list.items.push(m[1]); return; }
    if ((m = tr.match(/^\d+\.\s+(.*)$/))) { flush(); if (!list || list.t !== 'ol') { flushList(); list = { t: 'ol', items: [] }; } list.items.push(m[1]); return; }
    flushList(); para.push(tr);
  });
  flush(); flushList();
  return blocks;
}
function stripMd(md) {
  return md.replace(/^#{1,3}\s+/gm, '').replace(/^>\s+/gm, '').replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1').replace(/<\/?center>/gi, '').replace(/^---$/gm, '').replace(/\s+/g, ' ').trim();
}
function excerpt(text, q, radius) {
  radius = radius || 72;
  var i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text.slice(0, radius * 2);
  var a = Math.max(0, i - radius), b = Math.min(text.length, i + q.length + radius);
  return (a > 0 ? '…' : '') + text.slice(a, b) + (b < text.length ? '…' : '');
}
function hl(text, q) {
  if (!q || q.length < 2) return esc(text);
  var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.split(re).filter(Boolean).map(function (c) {
    return c.toLowerCase() === q.toLowerCase() ? '<mark>' + esc(c) + '</mark>' : esc(c);
  }).join('');
}
function rich(text, q) {
  var out = '', re = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*)/g, last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out += hl(text.slice(last, m.index), q);
    out += (m[0].indexOf('**') === 0 || m[0].indexOf('__') === 0) ? '<strong>' + hl(m[0].slice(2, -2), q) + '</strong>' : '<em>' + hl(m[0].slice(1, -1), q) + '</em>';
    last = m.index + m[0].length;
  }
  if (last < text.length) out += hl(text.slice(last), q);
  return out;
}
function mdHtml(title, blocks, q) {
  var h = '<div class="reader-body"><h1>' + rich(title, q) + '</h1>';
  blocks.forEach(function (b) {
    if (b.t === 'hr') h += '<hr>';
    else if (b.t === 'h2') h += '<h2 id="' + esc(b.id) + '"' + (b.center ? ' class="center"' : '') + '>' + rich(b.text, q) + '</h2>';
    else if (b.t === 'h3') h += '<h3 id="' + esc(b.id) + '"' + (b.center ? ' class="center"' : '') + '>' + rich(b.text, q) + '</h3>';
    else if (b.t === 'bq') h += '<blockquote>' + rich(b.text, q) + '</blockquote>';
    else if (b.t === 'ul' || b.t === 'ol') h += '<' + b.t + '>' + b.items.map(function (i) { return '<li>' + rich(i, q) + '</li>'; }).join('') + '</' + b.t + '>';
    else h += '<p' + (b.center ? ' class="center"' : '') + '>' + rich(b.text, q) + '</p>';
  });
  return h + '</div>';
}

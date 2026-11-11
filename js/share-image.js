/* КАРТОЧКА ДЛЯ ШАРИНГА: s/<slug>.jpg (1200×630). Рассказ — объёмная книга с обложкой, статья — газетный лист.
   Рисуется на canvas в браузере (админка делает это при публикации). Возвращает Promise<Blob>. */
function shareImageBlob(w, coverUrl, siteName) {
  return new Promise(function (resolve, reject) {
    var im = new Image();
    im.onload = function () { try { draw(im); } catch (e) { reject(e); } };
    im.onerror = function () { draw(null); };
    im.src = coverUrl;

    function wrap(ctx, text, maxW, maxLines) {
      var words = String(text || '').split(/\s+/), lines = [], cur = '';
      words.forEach(function (wd) {
        var t = cur ? cur + ' ' + wd : wd;
        if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t;
      });
      if (cur) lines.push(cur);
      if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s.,;:—-]*$/, '') + '…'; }
      return lines;
    }
    function cover(ctx, img, x, y, W, H) {
      if (!img) { var g = ctx.createLinearGradient(x, y, x + W, y + H); g.addColorStop(0, '#2a2236'); g.addColorStop(1, '#0f0c16'); ctx.fillStyle = g; ctx.fillRect(x, y, W, H); return; }
      var r = Math.max(W / img.width, H / img.height), sw = W / r, sh = H / r;
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, W, H);
    }
    function draw(img) {
      var W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
      var ctx = c.getContext('2d'), article = w.kind === 'article';
      var SERIF = 'Cormorant Garamond, Georgia, "Times New Roman", "DejaVu Serif", serif';

      /* фон: размытая обложка, затемнённая */
      ctx.save(); ctx.filter = 'blur(28px) brightness(.5) saturate(1.1)'; cover(ctx, img, -60, -60, W + 120, H + 120); ctx.restore();
      var vg = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 760); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      var tx, tw;
      if (!article) {
        /* КНИГА: лицевая сторона как карточка на сайте + корешок и торец страниц */
        var bw = 390, bh = 520, bx = 100, by = (H - bh) / 2, SANS = 'Arial, "DejaVu Sans", sans-serif';
        function rr(x, y, w2, h2, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w2, y, x + w2, y + h2, r); ctx.arcTo(x + w2, y + h2, x, y + h2, r); ctx.arcTo(x, y + h2, x, y, r); ctx.arcTo(x, y, x + w2, y, r); ctx.closePath(); }
        ctx.save(); ctx.translate(bx, by);
        ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 16; ctx.shadowOffsetY = 22;
        ctx.fillStyle = '#0b1018'; ctx.fillRect(0, 0, bw, bh); ctx.shadowColor = 'transparent';
        /* лицевая сторона */
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetX = 6; ctx.fillStyle = '#111'; ctx.fillRect(0, 0, bw, bh); ctx.shadowColor = 'transparent';
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, bw, bh); ctx.clip(); cover(ctx, img, 0, 0, bw, bh);
        var sh = ctx.createLinearGradient(0, bh * .42, 0, bh); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.75, 'rgba(4,8,18,.88)'); sh.addColorStop(1, 'rgba(4,8,18,.95)');
        ctx.fillStyle = sh; ctx.fillRect(0, 0, bw, bh);
        var hg = ctx.createLinearGradient(0, 0, 40, 0); hg.addColorStop(0, 'rgba(0,0,0,.55)'); hg.addColorStop(.4, 'rgba(255,255,255,.1)'); hg.addColorStop(.6, 'rgba(0,0,0,.2)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hg; ctx.fillRect(0, 0, 40, bh);
        /* год */
        ctx.font = '700 15px ' + SANS; var yw = ctx.measureText(w.year || '').width + 30;
        ctx.fillStyle = 'rgba(8,12,22,.7)'; rr(24, 20, yw, 30, 15); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#e6eefc'; ctx.textAlign = 'left'; ctx.fillText(w.year || '', 39, 41);
        /* жанр, название */
        ctx.textAlign = 'center'; ctx.fillStyle = '#9fb6e0'; ctx.font = '700 14px ' + SANS;
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '3px';
        ctx.fillText(String(w.genre || '').toUpperCase(), bw / 2 + 12, bh - 128);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        var tf = 40, tl; ctx.fillStyle = '#cfe0ff';
        do { ctx.font = '700 ' + tf + 'px ' + SERIF; tl = wrap(ctx, w.shortTitle || w.title, bw - 90, 2); tf -= 3; } while (tl.length > 1 && tf > 26 && ctx.measureText(tl[0]).width > bw - 90);
        var ty = bh - 82 - (tl.length - 1) * (tf + 6); tl.forEach(function (l) { ctx.fillText(l, bw / 2 + 12, ty); ty += tf + 4; });
        /* нижняя строка: возраст и «кнопки» */
        var ry = bh - 52; ctx.textAlign = 'left'; ctx.fillStyle = '#e6eefc'; ctx.font = '700 17px ' + SANS; ctx.fillText(w.age || '', 58, ry + 24);
        function pill(x, wd, label, hi) { ctx.strokeStyle = hi ? '#88aadd' : 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5; rr(x, ry, wd, 34, 17); ctx.stroke(); ctx.fillStyle = hi ? '#a9c4f2' : '#d0d8ea'; ctx.font = '700 12px ' + SANS; ctx.textAlign = 'center'; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '1.5px'; ctx.fillText(label, x + wd / 2, ry + 22); if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'; }
        pill(110, 140, 'ОПИСАНИЕ', false); pill(262, 110, 'ЧИТАТЬ', true);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, bw - 2, bh - 2);
        ctx.restore();
        tx = 590; tw = 520;
      } else {
        /* ГАЗЕТНЫЙ ЛИСТ — как карточка статьи на сайте: шапка, заголовок, почти весь лист занимает фото, подвал */
        var pw = 440, ph = 586, px = 70, py = (H - ph) / 2, pd = 20, SANS = 'Arial, "DejaVu Sans", sans-serif';
        ctx.save(); ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(-0.03); ctx.translate(-pw / 2, -ph / 2);
        ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 36; ctx.shadowOffsetX = 12; ctx.shadowOffsetY = 18;
        ctx.fillStyle = '#efe6c8'; ctx.fillRect(0, 0, pw, ph); ctx.shadowColor = 'transparent';
        var y = pd + 12;
        ctx.textBaseline = 'alphabetic'; ctx.font = '700 12px ' + SANS; ctx.fillStyle = '#1c1a17'; ctx.textAlign = 'left';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '1.5px';
        ctx.fillText('ВЫПУСК ' + (w.year || ''), pd, y);
        ctx.fillStyle = '#8a1c1c'; ctx.textAlign = 'right'; ctx.fillText(String(w.genre || 'СТАТЬЯ').toUpperCase(), pw - pd, y);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        y += 14;
        ctx.fillStyle = '#14120f'; ctx.textAlign = 'center';
        var mf = 40; ctx.font = '900 ' + mf + 'px "Playfair Display", ' + SERIF;
        var ml = wrap(ctx, w.title, pw - pd * 2, 3);
        while (ml.length > 2 && mf > 28) { mf -= 3; ctx.font = '900 ' + mf + 'px "Playfair Display", ' + SERIF; ml = wrap(ctx, w.title, pw - pd * 2, 3); }
        y += mf * 0.85;
        ml.forEach(function (l) { ctx.fillText(l, pw / 2, y); y += mf * 1.08; });
        y += -mf * 0.35;
        ctx.fillStyle = '#1c1a17'; ctx.fillRect(pd, y, pw - pd * 2, 2.5); ctx.fillRect(pd, y + 5, pw - pd * 2, 1); y += 14;
        var footH = 42, phh = ph - pd - footH - y - 6;
        ctx.save(); ctx.beginPath(); ctx.rect(pd, y, pw - pd * 2, phh); ctx.clip();
        ctx.filter = 'grayscale(1) contrast(1.4) brightness(.97)';
        if (img) { var rr = Math.max((pw - pd * 2) / img.width, phh / img.height), sw = (pw - pd * 2) / rr, sh2 = phh / rr; ctx.drawImage(img, (img.width - sw) / 2, 0, sw, sh2, pd, y, pw - pd * 2, phh); } else { ctx.fillStyle = '#b9b3a1'; ctx.fillRect(pd, y, pw - pd * 2, phh); }
        ctx.filter = 'none'; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#faf6e6'; ctx.fillRect(pd, y, pw - pd * 2, phh); ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(250,246,230,.6)';
        for (var gx = pd; gx < pw - pd; gx += 3) for (var gy = y; gy < y + phh; gy += 3) ctx.fillRect(gx, gy, 1.4, 1.4);
        ctx.restore();
        ctx.strokeStyle = '#1c1a17'; ctx.lineWidth = 1.5; ctx.strokeRect(pd, y, pw - pd * 2, phh);
        var fy = y + phh + 8; ctx.fillStyle = '#1c1a17'; ctx.fillRect(pd, fy, pw - pd * 2, 2);
        fy += 28;
        ctx.save(); ctx.translate(pd + 4, fy - 4); ctx.rotate(-0.07); ctx.strokeStyle = '#8a1c1c'; ctx.lineWidth = 1.5; ctx.fillStyle = '#8a1c1c';
        ctx.font = '700 13px ' + SANS; ctx.textAlign = 'left'; var aw = ctx.measureText(w.age || '').width + 12; ctx.strokeRect(0, -15, aw, 22); ctx.fillText(w.age || '', 6, 1); ctx.restore();
        ctx.fillStyle = '#5b5444'; ctx.font = '600 12px ' + SANS; ctx.textAlign = 'left'; ctx.fillText(w.minutes ? w.minutes + ' МИН' : '', pd + aw + 20, fy);
        ctx.fillStyle = '#14120f'; ctx.font = '700 13px ' + SANS; ctx.textAlign = 'right';
        var rt = 'ЧИТАТЬ →', rw = ctx.measureText(rt).width; ctx.fillText(rt, pw - pd, fy);
        ctx.fillStyle = '#8a1c1c'; ctx.fillRect(pw - pd - rw, fy + 6, rw, 2);
        ctx.restore();
        tx = 580; tw = 540;
      }

      /* текст справа */
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      var cy = 150;
      ctx.fillStyle = '#e3c470'; ctx.font = '600 26px ' + SERIF;
      var kicker = article ? 'СТАТЬЯ' : String(w.genre || 'РАССКАЗ').toUpperCase();
      if (!article && w.genre) kicker = String(w.genre).toUpperCase();
      ctx.fillText(kicker, tx, cy); cy += 20;
      ctx.fillStyle = 'rgba(227,196,112,.6)'; ctx.fillRect(tx, cy, 90, 3); cy += 62;
      ctx.fillStyle = '#fff'; var fs = 66; ctx.font = '700 ' + fs + 'px ' + SERIF;
      var lines = wrap(ctx, w.title, tw, 3);
      while (lines.length > 3 || (lines.length === 3 && fs > 52)) { fs -= 4; ctx.font = '700 ' + fs + 'px ' + SERIF; lines = wrap(ctx, w.title, tw, 3); if (fs <= 44) break; }
      lines.forEach(function (l) { ctx.fillText(l, tx, cy); cy += fs * 1.12; });
      cy += 8;
      if (!article && w.description) {
        ctx.fillStyle = 'rgba(255,255,255,.82)'; ctx.font = '400 25px ' + SERIF;
        wrap(ctx, w.description, tw, lines.length > 1 ? 3 : 5).forEach(function (l) { ctx.fillText(l, tx, cy - 22); cy += 34; });
        cy += 18;
      }
      var meta = [w.age, w.year].filter(Boolean).join(' · ');
      if (meta) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 26px ' + SERIF; ctx.fillText(meta, tx, cy); }
      ctx.fillStyle = '#e3c470'; ctx.font = '600 30px ' + SERIF; ctx.fillText(String(siteName || '') + ' — читать', tx, H - 64);

      c.toBlob(function (b) { b ? resolve(b) : reject(new Error('toBlob')); }, 'image/jpeg', 0.88);
    }
  });
}

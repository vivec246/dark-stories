/* Создаёт s/<slug>.html для всех текстов из js/data.js. Запуск из корня сайта: node tools/make-share-pages.js
   (админка делает то же самое сама при публикации — этот скрипт нужен, только если правите data.js руками). */
var fs = require('fs'), path = require('path');
var root = path.join(__dirname, '..');
var data = new Function(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\n;return {SITE:SITE,WORKS:WORKS};')();
var cname = ''; try { cname = fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim(); } catch (e) {}
var base = cname ? 'https://' + cname + '/' : process.argv[2];
if (!base) { console.error('Нет файла CNAME — укажите адрес сайта: node tools/make-share-pages.js https://имя.github.io/репозиторий/'); process.exit(1); }
var page = require('../js/share-page.js');
fs.mkdirSync(path.join(root, 's'), { recursive: true });
data.WORKS.forEach(function (w) { fs.writeFileSync(path.join(root, 's', w.slug + '.html'), page(w, data.SITE.name, base)); });
console.log('Готово: ' + data.WORKS.length + ' страниц в s/');

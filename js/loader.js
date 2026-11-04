/* ЗАГРУЗКА .md-файлов и ПОИСК по названиям и текстам. */

var cache = {};
function fetchText(path) {
  if (cache[path]) return cache[path];
  cache[path] = fetch(path).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).catch(function (e) { delete cache[path]; throw e; });
  return cache[path];
}
var bodies = {}, bodiesLoading = null;
function loadAllBodies() {
  if (bodiesLoading) return bodiesLoading;
  bodiesLoading = Promise.all(WORKS.map(function (w) {
    return fetchText(w.path).then(function (t) { bodies[w.slug] = stripMd(t); }).catch(function () {});
  }));
  return bodiesLoading;
}
function searchWorks(query) {
  var q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  var hits = [], seen = {};
  WORKS.forEach(function (w) {
    var meta = (w.title + ' ' + w.genre + ' ' + w.description).toLowerCase();
    if (meta.indexOf(q) >= 0) { seen[w.slug] = 1; hits.push({ w: w, snippet: w.description }); }
  });
  WORKS.forEach(function (w) {
    if (seen[w.slug] || !bodies[w.slug] || bodies[w.slug].toLowerCase().indexOf(q) < 0) return;
    hits.push({ w: w, snippet: excerpt(bodies[w.slug], q) });
  });
  return hits;
}

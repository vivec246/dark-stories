/* ДАННЫЕ САЙТА: контакты, шапка, список текстов (WORKS), новости.
   Чтобы добавить рассказ или статью — положите .md в stories/ или articles/ и добавьте блок в WORKS. */

var SITE = {
  name: 'Dark Stories', author: 'Дмитрий Ланцев', tagline: 'Цифровое издание',
  description: 'Тёмные истории от Дмитрия Ланцева — рассказы и статьи в жанре мистика и тёмное фэнтези',
  email: 'lancev.dmitrij.avtor@gmail.com',
  telegram: 'https://t.me/lancev_dark', telegramHandle: '@lancev_dark',
  dzen: 'https://dzen.ru/slovo_lanceva', dzenHandle: 'slovo_lanceva',
  year: 2026, version: '4.0'
};
var HERO = ['cap/header_1.jpg','cap/header_2.jpg','cap/header_3.jpg','cap/header_4.jpg','cap/header_5.jpg','cap/header_6.jpg','cap/header_7.jpg'];
/* Где в картинке главный объект (число — процент от ширины картинки: 0 — левый край, 50 — середина, 100 — правый).
   Когда экран узкий (телефон) и картинка обрезается по бокам, сайт сам подбирает кадр так,
   чтобы этот объект оказался по центру. По вертикали всегда показывается верх картинки. */
var HERO_FOCUS = {
  'cap/header_1.jpg': 46,   // героиня с огнём
  'cap/header_2.jpg': 50,   // ворон
  'cap/header_3.jpg': 65,   // олень у озера
  'cap/header_4.jpg': 68,   // замок
  'cap/header_5.jpg': 50,   // улица, фигура в центре
  'cap/header_6.jpg': 55,   // воин с мечом
  'cap/header_7.jpg': 50    // лес
};

/* Список текстов: чтобы добавить рассказ — положите .md в stories/ или articles/ и добавьте строку сюда */
var WORKS = [
  {
    "slug": "the-fox-folk",
    "kind": "story",
    "path": "stories/the_fox_folk/the_fox_folk.md",
    "cover": "covers/the_fox_folk.jpg",
    "title": "Лисий народ",
    "shortTitle": "Лисий народ",
    "description": "Беглянка с золотыми глазами нанимает проводника с тёмным прошлым, чтобы пройти трудный путь и вернуться домой.",
    "genre": "Тёмное фэнтези",
    "age": "18+",
    "year": "2025",
    "status": "published",
    "minutes": 90
  },
  {
    "slug": "mission-hades",
    "kind": "story",
    "path": "stories/mission_hades/mission_hades.md",
    "cover": "covers/mission_hades.jpg",
    "title": "Миссия «Аид»",
    "shortTitle": "Миссия «Аид»",
    "description": "Экипаж «Химеры» отправляется в полёт на край Солнечной системы, чтобы проверить сигнал, которого не должно существовать.",
    "genre": "Научная фантастика",
    "age": "18+",
    "year": "2025",
    "status": "published",
    "minutes": 22
  },
  {
    "slug": "detective-murr",
    "kind": "story",
    "path": "stories/detective_murr/det_murr_1.md",
    "cover": "covers/det_murr_1.jpg",
    "title": "Детектив Мурр и «Чистая Лапа». Часть I",
    "shortTitle": "Детектив Мурр. Часть I",
    "description": "Детектив Мурр находит странную записку и, пытаясь разобраться, оказывается втянут в дело, которое перевернёт его жизнь.",
    "genre": "Детективный нуар",
    "age": "16+",
    "year": "2025",
    "status": "published",
    "minutes": 59
  },
  {
    "slug": "new-guy",
    "kind": "story",
    "path": "stories/new_guy/new_guy.md",
    "cover": "covers/new-guy.jpg",
    "title": "Новенький из параллельного класса",
    "shortTitle": "Новенький из параллельного класса",
    "description": "Рассказ находится в стадии написания. Школьное фэнтези о зазоре между двумя расписаниями.",
    "genre": "Школьное фэнтези",
    "age": "16+",
    "year": "2025",
    "status": "wip",
    "minutes": 1
  },
  {
    "slug": "bear-at-a-crossroads",
    "kind": "story",
    "path": "stories/bear_at_a_crossroads/bear_at_a_crossroads.md",
    "cover": "covers/bear_at_a_crossroads.jpg",
    "title": "Медведь на перепутье",
    "shortTitle": "Медведь на перепутье",
    "description": "Рассказ находится в стадии написания. Тёмный сказ о цене выбора, который притворяется инстинктом.",
    "genre": "Тёмное фэнтези",
    "age": "18+",
    "year": "2026",
    "status": "wip",
    "minutes": 1
  },
  {
    "slug": "lord-balderon",
    "kind": "story",
    "path": "stories/lord_balderon/lord_balderon.md",
    "cover": "covers/lord_balderon.jpg",
    "title": "Лорд Балдерон. Цикл сказов",
    "shortTitle": "Лорд Балдерон",
    "description": "Шесть сказов о создателе, который познаёт свой же мир. О цене добрых намерений, о прощении, о покое. И о том, что даже бог может ошибаться.",
    "genre": "Философское фэнтези",
    "age": "16+",
    "year": "2026",
    "status": "published",
    "minutes": 3,
    "cycle": [
      "Сказ первый. Глина",
      "Сказ второй. Дар",
      "Сказ третий. Город, который молился слишком хорошо",
      "Сказ четвёртый. Прощение",
      "Сказ пятый. Покой",
      "Сказ шестой. Ошибка"
    ]
  },
  {
    "slug": "albus-dumbledore",
    "kind": "article",
    "path": "articles/albus_dumbledore/albus_dumbledore.md",
    "cover": "covers/albus_dumbledore.jpg",
    "title": "Цена мудрости Альбуса Дамблдора",
    "shortTitle": "Цена мудрости Дамблдора",
    "description": "Почему величайший волшебник эпохи раз за разом выбирал манипуляции — и чем это отличается от мудрости.",
    "genre": "Аналитика",
    "age": "16+",
    "year": "2025",
    "status": "published",
    "minutes": 2
  },
  {
    "slug": "cuckoos-nest",
    "kind": "article",
    "path": "articles/cuckoos_nest/cuckoos_nest.md",
    "cover": "covers/cuckoos_nest.jpg",
    "title": "Пролетая над гнездом кукушки",
    "shortTitle": "Над гнездом кукушки",
    "description": "Почему мы сами держим себя в клетке. Разбор культового романа Кизи.",
    "genre": "Аналитика",
    "age": "18+",
    "year": "2026",
    "status": "published",
    "minutes": 2
  }
];

var NEWS = [
  { date: 'Ноябрь 2026', title: 'Издание 4.1', text: 'Обновление внешнего вида карточек книг и статей.' },
  { date: 'Октябрь 2026', title: 'Издание 4.0', text: 'У каждого текста свой адрес. На карточке видно, сколько уже прочитано. Цикл Балдерона открывается шестью сказами, а не одним полотном.' },
  { date: 'Март 2026', title: 'Медведь на перепутье', text: 'Новый сказ в работе. На полке пока анонс.', slug: 'bear-at-a-crossroads' },
  { date: 'Январь 2026', title: 'Цикл Балдерона', text: 'Шесть сказов о создателе, который ошибается. Философское фэнтези, 16+.', slug: 'lord-balderon' },
  { date: 'Декабрь 2025', title: 'Пролетая над гнездом кукушки', text: 'Статья о романе Кизи: почему клетка держится изнутри.', slug: 'cuckoos-nest' },
  { date: 'Ноябрь 2025', title: 'Лисий народ', text: 'Тёмное фэнтези о проводнике, который слишком хорошо помнит охоту.', slug: 'the-fox-folk' },
  { date: 'Октябрь 2025', title: 'Миссия «Аид» и детектив Мурр', text: 'Два новых текста: холодный космос и мокрый город, где стирают не только бельё.', slug: 'mission-hades' }
];

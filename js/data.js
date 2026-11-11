/* ДАННЫЕ САЙТА: контакты, шапка, список текстов (WORKS), новости.
   Файл обновляется админкой (admin.html), но его можно править и руками.
   Чтобы добавить рассказ или статью — положите .md в stories/ или articles/ и добавьте блок в WORKS. */

var SITE = {
  name: "Dark Stories",
  author: "Дмитрий Ланцев",
  tagline: "Цифровое издание",
  description: "Тёмные истории от Дмитрия Ланцева — рассказы и статьи в жанре тёмное фэнтези и научная фантастика",
  email: "lancev.dmitrij.avtor@gmail.com",
  telegram: "https://t.me/lancev_dark",
  telegramHandle: "@lancev_dark",
  dzen: "https://dzen.ru/slovo_lanceva",
  dzenHandle: "slovo_lanceva",
  year: 2026,
  version: "4.2",
  metrikaId: "108542095",
  metrikaWebvisor: true
};
var HERO = [
  "cap/header_1.jpg",
  "cap/header_2.jpg",
  "cap/header_3.jpg",
  "cap/header_4.jpg",
  "cap/header_5.jpg",
  "cap/header_6.jpg",
  "cap/header_7.jpg"
];
/* Где в картинке главный объект (число — процент от ширины картинки: 0 — левый край, 50 — середина, 100 — правый).
   Когда экран узкий (телефон) и картинка обрезается по бокам, сайт сам подбирает кадр так,
   чтобы этот объект оказался по центру. По вертикали всегда показывается верх картинки. */
var HERO_FOCUS = {
  'cap/header_1.jpg': 50,   // Воительница
  'cap/header_2.jpg': 49,   // Ворон
  'cap/header_3.jpg': 54,   // Дух леса
  'cap/header_4.jpg': 60,   // Горная крепость
  'cap/header_5.jpg': 51,   // Фигура в центре улицы
  'cap/header_6.jpg': 52,   // Полководец
  'cap/header_7.jpg': 51   // Лунный лес
};
/* То же по вертикали: на каком проценте высоты картинки главный объект (0 — верх, 100 — низ).
   Работает на широких экранах (компьютер), где картинка обрезается сверху и снизу. Если картинки здесь нет — показывается верх. */
var HERO_FOCUS_Y = {};

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
    "minutes": 90,
    "readerStyle": "fantasy",
    "readerStyleChoice": true
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
    "minutes": 22,
    "readerStyle": "scifi",
    "readerStyleChoice": true
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
    "minutes": 1,
    "readerStyle": "fantasy",
    "readerStyleChoice": true
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
    "readerStyle": "fantasy",
    "readerStyleChoice": true,
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
    "description": "Мы привыкли видеть в Дамблдоре доброго наставника, что всегда знает, как правильно. Но если присмотреться, за этой улыбкой скрывается стратег. Это эссе того, как величайший волшебник эпохи годами вёл свою игру, не спрашивая мнения тех, кем играл, и какую цену за это заплатил.",
    "genre": "Авторское эссе",
    "age": "16+",
    "year": "2025",
    "status": "published",
    "minutes": 8
  },
  {
    "slug": "cuckoos-nest",
    "kind": "article",
    "path": "articles/cuckoos_nest/cuckoos_nest.md",
    "cover": "covers/cuckoos_nest.jpg",
    "title": "Пролетая над гнездом кукушки",
    "shortTitle": "Над гнездом кукушки",
    "description": "Почему мы сами держим себя в клетке. Разбор культового романа Кена Кизи. Как система превращает свободных людей в послушных пациентов без решёток и шокеров и какую цену приходится платить тем, кто решается сказать «нет».",
    "genre": "Авторское эссе",
    "age": "18+",
    "year": "2025",
    "status": "published",
    "minutes": 12
  }
];

var NEWS = [
  { date: "Ноябрь 2026", title: "Издание 4.2", text: "В читалке появились темы по жанрам. Нажмите кнопку темы в читалке: рядом с «Ночью», «Днём» и «Теплой» можно выбрать Sci-Fi или «Фэнтези» в зависимости от жанра. Ваш выбор запомнится для каждого рассказа." },
  { date: "Ноябрь 2026", title: "Издание 4.1", text: "Обновление внешнего вида карточек книг и статей. Теперь рассказы выглядят как книги, а статьи как газеты. Приятного пользования." },
  { date: "Октябрь 2026", title: "Издание 4.0", text: "У каждого текста свой адрес. На карточке видно, сколько уже прочитано." },
  { date: "Март 2026", title: "Медведь на перепутье", text: "Новый сказ в работе. На полке пока анонс.", slug: "bear-at-a-crossroads" }
];

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
  metrikaWebvisor: true,
  heroFx: "pixel",
  heroFxIntensity: 1,
  heroFxSpeed: 1,
  heroOrder: "random",
  heroSeconds: 6,
  fresh: ["vedmak-ot-sapkovskogo-do-netflix","bear-at-a-crossroads","lord-balderon","new-guy"]
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
  'cap/header_4.jpg': 46,   // Горная крепость
  'cap/header_5.jpg': 51,   // Фигура в центре улицы
  'cap/header_6.jpg': 58,   // Полководец
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
    "minutes": 59,
    "readerStyle": "noir"
  },
  {
    "slug": "bear-at-a-crossroads",
    "kind": "story",
    "path": "stories/bear_at_a_crossroads/bear_at_a_crossroads.md",
    "cover": "covers/bear_at_a_crossroads.jpg",
    "title": "Медведь на перепутье",
    "shortTitle": "Медведь на перепутье",
    "description": "1196 год. Школа Медведя гниет изнутри, а юный ведьмак Якоб, чудом выживший после мутаций, отправляется на свой первый Большак. Он столкнется со странными контрактами, политическими интригами и древними сущностями.\n\nЭто история о цене выживания, о дружбе, и о том, как из беспомощного мальчика, рождается безжалостный убийца чудовищ.",
    "genre": "Тёмное фэнтези",
    "age": "18+",
    "year": "2026",
    "status": "soon",
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
    "description": "По ухабистым тропам да селениям людским,\nбродит страж терпеливый к созданьям своим. \nСлышит крики во мгле, поспешит он к тебе.\nДа от зверя иль от лиха поможет в беде.\n\nШесть сказов о милосердии и гордости, исцелении и жадности, о добре, которое оборачивается войной, и о создателе, который однажды должен научиться отпустить своё творение — и уйти.",
    "genre": "Философское фэнтези",
    "age": "16+",
    "year": "2026",
    "status": "soon",
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
    "slug": "new-guy",
    "kind": "story",
    "path": "stories/new_guy/new_guy.md",
    "cover": "covers/new-guy.jpg",
    "title": "Новенький из параллельного класса",
    "shortTitle": "Новенький из параллельного класса",
    "description": "Сато вновь переезжает в новый город. Он думает, что просто попал в странную школу.\nНо чем дольше он там находится, тем яснее понимает: странности не заканчиваются школьными коридорами.\nИ кто-то очень внимательно следит за тем, как Сато осваивается на новом месте.",
    "genre": "Школьное фэнтези",
    "age": "16+",
    "year": "2025",
    "status": "soon",
    "minutes": 1
  },
  {
    "slug": "albus-dumbledore",
    "kind": "article",
    "path": "articles/albus_dumbledore/albus_dumbledore.md",
    "cover": "covers/albus_dumbledore.jpg",
    "title": "Цена мудрости Альбуса Дамблдора",
    "shortTitle": "Цена мудрости Дамблдора",
    "description": "Мы привыкли видеть в Дамблдоре доброго наставника, что всегда знает, как правильно. Но если присмотреться, за этой улыбкой скрывается стратег. Это эссе о том, как величайший волшебник эпохи годами вёл свою игру, не спрашивая мнения тех, кем играл, и какую цену за это заплатил.",
    "genre": "Авторское эссе",
    "age": "16+",
    "year": "2026",
    "status": "published",
    "minutes": 7,
    "coverX": 25,
    "month": "апрель"
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
    "year": "2026",
    "status": "published",
    "minutes": 12,
    "month": "август"
  },
  {
    "slug": "vedmak-ot-sapkovskogo-do-netflix",
    "kind": "article",
    "path": "stories/vedmak_ot_sapkovskogo_do_netflix/vedmak_ot_sapkovskogo_do_netflix.md",
    "cover": "covers/vedmak_ot_sapkovskogo_do_netflix.jpg",
    "title": "Ведьмак. От Сапковского до Netflix",
    "shortTitle": "Ведьмак. От Сапковского до Netflix",
    "description": "От книг Сапковского до провала Netflix: разбор трех этапов жизни «Ведьмака». Почему CD Projekt RED удалось сохранить душу, а сериал потерял всё.",
    "genre": "критика/анализ",
    "age": "16+",
    "year": "2026",
    "status": "published",
    "minutes": 13,
    "coverX": 47,
    "coverY": 42,
    "month": "ноябрь"
  }
];

var NEWS = [
  { date: "Ноябрь 2026", title: "Новая статья.", text: "Привет! Вышла новая статья «Ведьмак. От Сапковского до Netflix». Там я разбираю причины успеха игра и неудачи адаптации от  Netflix. Приятного чтения.", slug: "vedmak-ot-sapkovskogo-do-netflix" },
  { date: "Ноябрь 2026", title: "Издание 4.2", text: "В читалке появились темы по жанрам. Нажмите кнопку темы в читалке: рядом с «Ночью», «Днём» и «Теплой» можно выбрать Sci-Fi или «Фэнтези» в зависимости от жанра. Ваш выбор запомнится для каждого рассказа." },
  { date: "Ноябрь 2026", title: "Издание 4.1", text: "Обновление внешнего вида карточек книг и статей. Теперь рассказы выглядят как книги, а статьи как газеты. Приятного пользования." },
  { date: "Октябрь 2026", title: "Издание 4.0", text: "У каждого текста свой адрес. На карточке видно, сколько уже прочитано." }
];

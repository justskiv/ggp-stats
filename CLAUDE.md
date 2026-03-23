# GGP Stats — GoGetPodcast Analytics Dashboard

## Описание проекта

SPA-дашборд для визуализации статистики выпусков подкаста GoGetPodcast.
Построен на React + Recharts + HTM, работает без системы сборки через CDN.
Поддерживает несколько выпусков с общим кодом дашборда и отдельными
файлами данных.

## Структура проекта

```
index.html                         # Shell: CDN imports, <div id=root>, module entry
styles.css                         # CSS custom properties + classes
src/
  lib.js                           # HTM binding + re-export React/Recharts
  hooks.js                         # useRoute, useEpisodeData
  utils.js                         # pluralize
  constants.js                     # DASH_TABS, CATEGORY_GROUPS, GROUP_ORDER
  main.js                          # App + ReactDOM.createRoot
  components/
    shared.js                      # Tip, PieLabel, Card, LoadingScreen, ErrorScreen
    EpisodeCard.js                 # Episode card for list page
    EpisodeList.js                 # Main listing page
    EpisodeView.js                 # Episode loader wrapper
    Dashboard.js                   # Dashboard shell: header, tabs, routing
    tabs/
      OverviewTab.js               # Pie/bar charts, speaker summary
      SpeakersTab.js               # Radar chart, speaker cards, key insight
      TopicsTab.js                 # Timeline, top topics bar chart
      ResourcesTab.js              # Resource catalog with filters
      FunFactsTab.js               # Fun facts, persons, quick stats
episodes/
  index.js                         # Episode registry (lightweight list metadata)
  ep20/data.js                     # Episode #20 full data
  ep21/data.js                     # Episode #21 full data
assets/
  icons/                           # Resource icons (claude.png, codex.png)
```

## Стек

- React 18.2.0 (CDN, UMD)
- Recharts 2.12.7 (CDN, UMD)
- HTM 3.1.1 (ESM from esm.sh) — JSX-like tagged templates
- ES Modules (`<script type="module">`)
- CSS custom properties (dark theme)
- Hash-routing (`#/` — list, `#/ep21` — dashboard, `#/ep21/resources` — tab)

## Запуск

```bash
npx serve -l 8000
```

> `python3 -m http.server` не поддерживает HTTP Range requests —
> seeking в длинных MP3 не будет работать. Используй `npx serve`.

## Табы дашборда

- **Обзор** — pie chart (слова/время/реплики), bar chart сравнения
- **Спикеры** — radar chart, карточки с метриками, key insight
- **Темы** — timeline тем, top topics bar chart
- **Ресурсы** — каталог с фильтрами (категория/спикер/поиск), группировка, сворачивание
- **Fun Facts** — факты, персоны, «В цифрах»

## Добавление нового выпуска

1. Создать `episodes/epNN/data.js` по образцу `episodes/ep21/data.js`
   — формат: `window.GGP_EPISODES["epNN"] = { meta, speakers, ... }`
2. Добавить запись в `episodes/index.js` в массив `_registry`

## Добавление нового таба

1. Создать `src/components/tabs/NewTab.js`
2. Добавить в `DASH_TABS` в `src/constants.js`
3. Добавить в `TAB_COMPONENTS` в `src/components/Dashboard.js`

## Формат данных выпуска (`data.js`)

- `meta` — id, number, title, subtitle, description, date, durationMinutes, audioUrl
- `headerStats` — массив `[emoji, value, label]`
- `colors` — цвета спикеров (ключи совпадают с dataKey в barData/radarData)
- `speakers` — массив (name, full, role, words, pct, time, timePct, utt, avgW, maxW, color)
- `radarData` — `{ m, <speakerKey>... }`
- `barData` — `{ m, <speakerKey>... }`
- `topics` — `{ t, s, d, c }` (title, start min, duration min, color)
- `resources` — `{ t, cat, w, tp, desc?, url?, icon? }`
- `keyInsight` — `{ color, parts: [[bold, text], ...] }`
- `funFacts` — `{ i, t }` (emoji, text)
- `persons` — массив строк
- `quickStats` — `[value, label, sublabel]`

## Категории ресурсов

Определены в `src/constants.js`:
`books` (cs, os, db, algo, code, biz, sci), `course`, `platform`, `article`, `ai`, `tool`

## Соглашения

- Без системы сборки — CDN + ES Modules
- HTM tagged templates вместо React.createElement
- CSS custom properties для цветов, радиусов, отступов
- Данные выпусков в `episodes/epNN/data.js`, загружаются lazy через script injection
- Registry (`episodes/index.js`) — preview-индекс для списка, не дублировать вычислимые поля
- Иконки ресурсов в `assets/icons/`, подключаются через поле `icon`
- Язык интерфейса — русский, код и комментарии — английский
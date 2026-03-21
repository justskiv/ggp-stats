# GGP Stats — GoGetPodcast Analytics Dashboard

## Описание проекта

Standalone интерактивный дашборд для визуализации статистики подкаста
GoGetPodcast. Построен на React + Recharts, работает без системы сборки
через CDN.

## Структура проекта

- `index.html` — основной файл, самодостаточное SPA (React 18 + Recharts
  через CDN, inline-стили, тёмная тема)
- `gogetpodcast-dashboard.jsx` — JSX-версия компонента для интеграции
  в React-проект с системой сборки

## Стек

- React 18.2.0 (CDN)
- Recharts 2.12.7 (CDN)
- Чистый CSS (inline, тёмная тема)

## Запуск

```bash
# Вариант 1: напрямую в браузере
open index.html

# Вариант 2: через локальный сервер
python3 -m http.server 8000
```

## Соглашения

- Проект без системы сборки — все зависимости подключены через CDN
- В `index.html` используется `React.createElement()` вместо JSX
- Данные захардкожены непосредственно в коде
- Язык интерфейса — русский

# Сайт-портфолио Точилкиной О. С.

Статический сайт на Astro: портфолио воспитателя детского сада. Собирается в `dist/` и
публикуется на GitHub Pages по адресу https://tochilkina-os.github.io/site/.

## Запуск

```bash
npm install
npm run build    # сборка в dist/
npm run preview  # локальный просмотр сборки на http://127.0.0.1:4321/site/
npm run dev      # dev-сервер Astro, http://localhost:4321/site
```

## Структура

```
src/
  data/          JSON с документами, редактируется через /admin/
  components/    секции страницы и иконка
  layouts/       Base.astro: head, навигация, футер
  pages/         index, privacy, 404
  styles/        tokens.css, base.css, site.css
  scripts/       site.js: меню, reveal, переключатель лет, валидация формы
public/          PDF, DOCX, фото, шрифты страницы, favicon, admin/
tools/           локальный сервер для проверки сборки с base /site
```

## Дизайн-система

Значения зафиксированы в `src/styles/tokens.css` и повторяют правила скилла
`landing-page-design`:

- типографика по шкале Tailwind, один шрифт Manrope, без курсива и веса 900;
- отступы только из таблицы (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96);
- радиусы по шкале, вложенный радиус считается как `внешний − зазор`;
- фоны плоские, единственный градиент на заголовке hero;
- движение: `cubic-bezier(0.22, 1, 0.36, 1)`, анимируются только `transform` и `opacity`,
  учитывается `prefers-reduced-motion`.

## Документы

Данные лежат в `src/data/*.json`, файлы в `public/<раздел>/`. Правки через Decap CMS:
`/admin/`. Подробности в `docs/admin-guide.md`.

## Деплой

`.github/workflows/deploy.yml` собирает сайт и публикует артефакт на GitHub Pages при
push в `main`. В настройках репозитория источник Pages должен быть переключён на
GitHub Actions.

## Проверка сборки локально

`npm run preview` поднимает `tools/preview_server.py`: он отдаёт `dist/` по пути `/site/`,
как на GitHub Pages. Отдельный скрипт нужен потому, что `astro preview` в этом окружении
слушает только IPv6 loopback.

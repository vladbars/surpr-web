# surpr web

Отдельный Git-репозиторий сайта Surpr: React + TypeScript + Vite + GSAP.
Все команды ниже выполняются из корня **этого репозитория**.
Локальная папка в общем workspace — `~/surpr/apps/web`.

## Локальный запуск

Node.js 24+, npm:

```bash
npm ci
npm run dev
```

Для телефона в общей сети: `npm run dev -- --host 0.0.0.0`.

```bash
npm test
npm run build
npm run test:e2e
```

Для E2E нужен Google Chrome. Playwright запускает собственный тестовый сервер.
Сборка находится в `dist/`.

## Локализация

DE/EN, язык браузера и переключатель в шапке. Переводы загружаются лениво,
по одному языку. Web использует опубликованный `locon@1.6.1` из npm;
registry URL и настоящий checksum зафиксированы в `package-lock.json`.
Локальные архивы, соседний checkout locon и React Native для production-сборки
не нужны. Для обновления зависимости из корня web:

```bash
npm install locon@1.6.1 --save-exact --ignore-scripts
```

Команда обновляет npm integrity в `package-lock.json`. Если npm использует
устаревшие метаданные реестра, добавить `--prefer-online`.
Релизный порядок описан в [docs/LOCON_RELEASE.md](docs/LOCON_RELEASE.md).

Язык исходников — немецкий (`projectLocale: 'de'`), fallback для неподдерживаемых
языков браузера — английский (`defaultLocale: 'en'`). В коде пишем
`<L>Überraschung öffnen</L>`, `<L params={{ name }}>{'Buh, {name}!'}</L>`;
`l()` остаётся для строковых атрибутов и metadata, например `placeholder={l('Name eingeben')}`.
Технические ключи для перевода не используем. JSON содержит исходную немецкую
фразу и соответствующий перевод, поэтому первый визит на EN не требует загрузки
немецкого ресурса. Длинные правовые тексты на немецком находятся в
`src/legal/content.ts` и переводятся таким же способом.

Проверка фраз, паритета DE/EN, параметров и дубликатов: `npm run i18n:check`.

## Docker

Из корня репозитория web:

```bash
docker build -t surpr-web:local .
docker run --rm -p 127.0.0.1:8081:8080 surpr-web:local
```

Node.js используется при сборке. Runtime — nginx без root на порту 8080.
Healthcheck: `GET /healthz` → `200 ok`. `compose.yaml` использует текущую
папку как build context, read-only FS, tmpfs и не публикует порт на хост.

## Coolify

Создать приложение из отдельного Git-репозитория web:

| Параметр | Значение |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory / build context | `/` — корень репозитория web |
| Dockerfile Location | `/Dockerfile` |
| Port | `8080` |
| Healthcheck path | `/healthz` |
| Domain | `https://surpr.link` |

API разворачивается из своего Git-репозитория отдельным приложением,
с доменом `https://api.surpr.link`. MongoDB URI и серверные ключи в web
не передаются. Для текущего демо build/runtime env не нужны. Будущие
`VITE_*` настройки публичны и применяются во время сборки.

## Маршруты и данные

- `index.html` и SPA-маршруты: `no-cache`.
- Хешированные `/assets/*`: immutable cache на год.
- Отсутствующие ресурсы и `/api/*`: 404; API обслуживает отдельный домен.
- `noindex, nofollow`, `no-referrer`; access logs без полных URL/query/IP.
- SPA fallback доставляет HTML, но не включает публикацию или checkout.

Демо: Intro → Door → Character → Message → End, три персонажа, звук после
первого взаимодействия, повтор и поддержка reduced motion. Персональный
текст остаётся в памяти браузерной страницы. Текущий web не вызывает API.

Правовые страницы на DE/EN: `/impressum`, `/privacy`, `/terms`, `/support`,
`/delete`. Реквизиты — vlad.mobi; хостинг — Hetzner, Германия.
На `/delete` можно сбросить сохранённые язык и звук.
Источники и обновления перед продажами: [docs/LEGAL.md](docs/LEGAL.md).

Справочники: [NGINX unprivileged](https://github.com/nginx/docker-nginx-unprivileged),
[nginx try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files),
[Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/).

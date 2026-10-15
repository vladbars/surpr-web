# surpr web

React + Vite + GSAP; production — статическая сборка под nginx.
Исходники и npm lockfile берутся из корня монорепозитория.

## Docker

После публикации `locon@1.6.0` в npm и обновления lockfile, из корня Surpr:

```bash
docker build -f apps/web/Dockerfile -t surpr-web:local .
docker run --rm -p 127.0.0.1:8081:8080 surpr-web:local
```

Сайт: `http://127.0.0.1:8081`. Node.js используется только при сборке;
готовый контейнер содержит nginx и `dist`, работает без root на порту 8080.
Healthcheck: `GET /healthz` → `200 ok`.

Альтернатива — `apps/web/compose.yaml`; он подходит для Coolify и не публикует
порт на хост. Включены read-only FS, tmpfs для временных файлов nginx,
удаление capabilities и запрет повышения привилегий.

## Coolify

Создать отдельное приложение web в том же репозитории:

| Параметр | Значение |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory / build context | `/` — корень монорепозитория |
| Dockerfile Location | `/apps/web/Dockerfile` |
| Port | `8080` |
| Healthcheck path | `/healthz` |
| Domain | `https://surpr.link` |

API разворачивается отдельным приложением через `/apps/api/Dockerfile`,
с доменом `https://api.surpr.link`. TLS завершает proxy Coolify.
Ни MongoDB URI, ни OpenAI/Gumroad credentials в web не передаются.
Текущему локальному демо не нужны build/runtime environment variables.
Если позже появятся `VITE_*` настройки, они будут публичными и потребуют
передачи на этапе сборки, а не изменения runtime env nginx.

## Раздача и маршруты

- `index.html` и маршруты SPA: `no-cache`, чтобы браузер перепроверял HTML
  после обновления; `/c/:slug` получает SPA shell при прямом открытии.
- `/assets/*`: годовой immutable cache для хешированных файлов Vite.
- Отсутствующие JS/CSS, переводы и аудио возвращают 404, а не HTML.
- `/api/*` не перенаправляется в SPA; маршруты API обслуживает отдельный сервис.
- Отдаётся `noindex, nofollow`, как и в текущем HTML демо.
- Access logs содержат request ID, метод и статус, без полных URL/query/IP.

SPA fallback только доставляет HTML: загрузка опубликованной карточки по slug
и checkout/Gumroad пока не реализованы. Docker сам по себе не включает эти функции.

Правовые страницы демо: `/impressum`, `/privacy`, `/terms`, `/support`, `/delete`
на DE/EN. Реквизиты взяты с vlad.mobi; хостинг — Hetzner, Германия.
Тексты описывают локальное демо, без продаж и серверного хранения карточек.
На `/delete` можно удалить сохранённые язык и настройку звука.
Источники и необходимые обновления перед продажами: [07_LEGAL.md](../../docs/07_LEGAL.md).

## Предварительное условие locon

`locon` устанавливается исключительно из npm как `1.6.0`.
Пока версия не опубликована, полная web Docker-сборка остановится на `npm ci`
с 404. Локальные tarball и соседняя папка не используются.
После успешного Release workflow locon из корня Surpr выполнить:

```bash
npm install --workspace @surpr/web locon@1.6.0 --save-exact --ignore-scripts
```

Сохранить обновлённый `package-lock.json` вместе с исходниками перед сборкой.

Основа: [NGINX unprivileged](https://github.com/nginx/docker-nginx-unprivileged),
[nginx try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files),
[Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/).

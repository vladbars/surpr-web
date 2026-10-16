# locon 1.6.1 и Surpr

Текстовые узлы используют `L` из `locon/react`. Компонент возвращает React
fragment без span или другого DOM-элемента; работает также внутри SVG `<text>`.
Для `aria-label`, placeholder, metadata и строковых данных используется `l()`.

Исходный язык — DE, fallback — EN. Ленивая загрузка ресурсов не меняется.

## Подготовлено в библиотеке

- Версия 1.6.1, `L`, `LProps`, тесты параметров, plurals, locale, fallback,
  безопасного текста и SVG, поддержка `<L>` в locon-sync.
- CHANGELOG, README, RELEASING.md и примеры locon.dev обновлены.
- React Native API остаётся в прежнем входе. Веб использует `locon/react`.

## Публикация владельцем

В checkout locon сначала самостоятельно закоммитить подготовленные изменения.
Только после коммита версии 1.6.1 создать и отправить тег этого коммита:

```sh
git tag -a v1.6.1 -m "locon 1.6.1: localized React text with L"
git push origin main
git push origin v1.6.1
```

Release workflow публикует npm только по тегу. Пуш одного main этого не делает.
Изменения без коммита в тег не входят.

После успешной публикации, из отдельного репозитория web:

```sh
npm install locon@1.6.1 --save-exact --ignore-scripts
npm run i18n:check
npm test
npm run build
```

Релиз 1.6.1 опубликован. В web установлен пакет из npm, lockfile содержит
настоящую registry integrity. Обновлённый lockfile сохранить в репозитории.
Если npm возвращает ETARGET из-за устаревших метаданных, повторить установку
с `--prefer-online --registry=https://registry.npmjs.org`.

## Проверка до публикации

До публикации упакованный релиз проверен в изолированной копии Surpr вне репозитория.
Tarball не добавляется в production manifests, lockfile, Dockerfile или Git.
После публикации web устанавливает пакет исключительно из npm.

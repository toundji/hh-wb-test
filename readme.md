# Шаблон для выполнения тестового задания

## Описание
Шаблон подготовлен для того, чтобы попробовать сократить трудоемкость выполнения тестового задания.

В шаблоне настоены контейнеры для `postgres` и приложения на `nodejs`.  
Для взаимодействия с БД используется `knex.js`.  
В контейнере `app` используется `build` для приложения на `ts`, но можно использовать и `js`.

Шаблон не является обязательным!\
Можно использовать как есть или изменять на свой вкус.

Все настройки можно найти в файлах:
- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Команды:

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

PS: С наилучшими пожеланиями!


## Требования к окружению

Перед запуском необходимо:

1. **Создать файл .env** на основе .env.example
2. **Настроить Google Service Account** с правами доступа к Google Sheets API
3. **Добавить GOOGLE_PRIVATE_KEY и GOOGLE_CLIENT_EMAIL** в .env
4. **Создать Google Таблицу** и предоставить доступ сервисному аккаунту
5. **Добавить DEFAULT_SPREADSHEETS_ID** в .env

Wildberries API Configuration
6. **WB_API_URL**  Базовый URL API Wildberries
7. **WB_API_TOKEN** ваш токен авторизации wb



## Тестирование:
Проект включает комплексные тесты в директории `/tests`:

- **`wbprices-service.test.ts`** - Тесты сервиса цен Wildberries
- **`sheet-services.test.ts`** - Тесты работы с Google Sheets  
- **`syncAllSheetsForDay.test.ts`** - Тесты синхронизации
- **`schedulePriceWritten.test.ts`** - Тесты планировщика

Запуск всех тестов:
```bash
npm run test
```

## Техническое примечание

**Обработка значений `"-"`:**

API может возвращать `"-"` для некоторых полей. Возможны две интерпретации:
1. Значение не изменилось (сохраняем предыдущее значение)
2. Значение неизвестно (удаляем предыдущее значение)

**Выбор реализации:** Принята гипотеза 1.
Значения `"-"`, полученные от API, **не перезаписывают** существующие значения в базе за текущий день.

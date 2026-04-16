# PayFlow — Асинхронная платёжная платформа

Полноценная production-ready платёжная платформа с асинхронным бэкендом, SPA-фронтом и контейнеризацией.

---

## Технологический стек

| Слой | Технологии |
|------|-----------|
| **Backend** | Python 3.12, Sanic 23.12 (async), SQLAlchemy 2.0 async, asyncpg, Alembic, Pydantic v2, PyJWT |
| **Frontend** | React 18, TypeScript (strict), Vite 5, Tailwind CSS 3, TanStack Query v5, React Router v6, Framer Motion |
| **База данных** | PostgreSQL 16 |
| **Инфраструктура** | Docker Compose, multi-stage Dockerfile, nginx (reverse proxy) |

---

## Архитектура

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│    Frontend      │─────▶│    Backend       │─────▶│   PostgreSQL     │
│    React SPA     │ /api │    Sanic API     │      │       16         │
│    nginx :80     │      │      :8000       │      │     :5432        │
│                  │      │                  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

- **Frontend** собирается Vite в статику, раздаётся nginx. Все запросы `/api/*` проксируются на бэкенд.
- **Backend** — полностью асинхронный. Каждая операция с деньгами использует `SELECT ... FOR UPDATE` для защиты от гонок.
- **БД** — PostgreSQL с миграциями через Alembic. При старте автоматически применяются миграции и создаются дефолтные пользователи.

---

## Быстрый старт

### Через Docker Compose (рекомендуется)

```bash
git clone <repo>
cd payment-platform
cp .env.example .env
docker compose up --build
```

После запуска:

| Сервис | URL |
|--------|-----|
| Веб-интерфейс | http://localhost:3000 |
| REST API | http://localhost:8000/api/v1 |
| PostgreSQL | localhost:5432 |

> **Если порты заняты** (например, локальный PostgreSQL на 5432), можно переопределить:
> ```bash
> DB_EXTERNAL_PORT=5433 FRONTEND_PORT=3010 docker compose up --build
> ```
> Тогда UI будет на http://localhost:3010, БД на порту 5433.

### Без Docker (локальная разработка)

**Backend:**
```bash
cd backend
cp .env.example .env          # настроить DATABASE_URL на локальный Postgres
pip install -e ".[dev]"
alembic upgrade head           # миграции + seed-данные
sanic app.main:create_app --factory --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev                    # порт 5173, проксирует /api на localhost:8000
```

---

## Учётные данные для входа

### Пользователь
| Параметр | Значение |
|----------|----------|
| URL входа | `/login` |
| Email | `user@example.com` |
| Пароль | `user_pass_123` |

### Администратор
| Параметр | Значение |
|----------|----------|
| URL входа | `/admin/login` |
| Email | `admin@example.com` |
| Пароль | `admin_pass_123` |

### Регистрация
Новые пользователи могут зарегистрироваться самостоятельно через `/register`. При регистрации автоматически создаётся счёт.

---

## Функциональность

### Пользовательский кабинет

| Действие | Описание |
|----------|----------|
| **Регистрация** | Форма регистрации (`/register`) — создаёт пользователя, счёт и автоматически логинит |
| **Дашборд** | Общий баланс с анимацией, список счетов и последние платежи |
| **Создание счёта** | Кнопка «New Account» — создаёт новый пустой счёт |
| **Пополнение** | Кнопка «Deposit» на карточке счёта — модалка с вводом суммы |
| **Вывод средств** | Кнопка «Withdraw» на карточке счёта — с проверкой достаточности средств |
| **Перевод** | Кнопка «Transfer» — перевод между своими счетами (доступна при 2+ счетах) |
| **История** | Полный список транзакций с поиском по ID, копированием, относительными датами |
| **Профиль** | Просмотр данных профиля |

### Админ-панель

| Действие | Описание |
|----------|----------|
| **Дашборд** | Метрики: пользователи, счета, суммарный баланс |
| **Список пользователей** | Таблица с поиском, сортировкой, раскрытием счетов |
| **Создание пользователя** | Модалка с валидацией (email, имя, пароль + подтверждение) |
| **Редактирование** | Изменение email и имени пользователя |
| **Удаление** | С подтверждением, каскадное удаление счетов и платежей |
| **Детали пользователя** | Отдельная страница со счетами и историей платежей |

### Webhook-платежи (внешнее API)

Внешние системы начисляют деньги через `POST /api/v1/webhooks/payment` с подписью SHA-256. Обеспечена идемпотентность: повторная отправка с тем же `transaction_id` не дублирует начисление.

---

## API-эндпоинты

### Авторизация и регистрация

```bash
# Регистрация нового пользователя
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@example.com","password":"mypass123","full_name":"Иван Иванов"}'

# Вход пользователя
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user_pass_123"}'

# Вход администратора
curl -X POST http://localhost:8000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_pass_123"}'
```

### Пользовательские операции (требуется Bearer-токен)

```bash
TOKEN="<токен из ответа login>"

# Профиль
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"

# Список счетов
curl http://localhost:8000/api/v1/users/me/accounts \
  -H "Authorization: Bearer $TOKEN"

# Создать новый счёт
curl -X POST http://localhost:8000/api/v1/users/me/accounts \
  -H "Authorization: Bearer $TOKEN"

# Пополнить счёт (account_id = 1)
curl -X POST http://localhost:8000/api/v1/users/me/accounts/1/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 500}'

# Вывести средства
curl -X POST http://localhost:8000/api/v1/users/me/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 100}'

# Перевод между счетами
curl -X POST http://localhost:8000/api/v1/users/me/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"from_account_id": 1, "to_account_id": 2, "amount": 50}'

# История платежей
curl http://localhost:8000/api/v1/users/me/payments \
  -H "Authorization: Bearer $TOKEN"
```

### Админ-операции (требуется Bearer-токен администратора)

```bash
ADMIN_TOKEN="<токен из ответа admin login>"

# Профиль админа
curl http://localhost:8000/api/v1/admin/me \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Список пользователей (со счетами и балансами)
curl http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Создать пользователя
curl -X POST http://localhost:8000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"new@example.com","password":"pass123","full_name":"Новый Пользователь"}'

# Обновить пользователя
curl -X PATCH http://localhost:8000/api/v1/admin/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"full_name":"Обновлённое Имя"}'

# Удалить пользователя (каскадно удаляет счета и платежи)
curl -X DELETE http://localhost:8000/api/v1/admin/users/2 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Webhook (публичный, без токена)

```bash
curl -X POST http://localhost:8000/api/v1/webhooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "5eae174f-7cd0-472c-bd36-35660f00132b",
    "user_id": 1,
    "account_id": 1,
    "amount": 100,
    "signature": "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
  }'
```

---

## Генерация подписи webhook

Подпись вычисляется конкатенацией полей **в алфавитном порядке** + секретный ключ → SHA-256:

```python
import hashlib

def compute_signature(account_id, amount, transaction_id, user_id, secret_key):
    raw = f"{account_id}{amount}{transaction_id}{user_id}{secret_key}"
    return hashlib.sha256(raw.encode()).hexdigest()

# Пример:
sig = compute_signature(1, 100, "5eae174f-7cd0-472c-bd36-35660f00132b", 1, "gfdmhghif38yrf9ew0jkf32")
# → "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
```

---

## Переменные окружения

| Переменная | Описание | Значение по умолчанию |
|------------|----------|-----------------------|
| `DATABASE_URL` | Строка подключения к PostgreSQL (async) | `postgresql+asyncpg://app:app@db:5432/app` |
| `JWT_SECRET` | Секрет для подписи JWT-токенов (HS256) | `jwt-super-secret-change-me` |
| `JWT_TTL_MINUTES` | Время жизни токена в минутах | `60` |
| `WEBHOOK_SECRET_KEY` | Секрет для проверки подписи webhook | `gfdmhghif38yrf9ew0jkf32` |
| `CORS_ORIGINS` | Разрешённые origin'ы через запятую | `http://localhost:3000,http://localhost:5173` |
| `DEFAULT_USER_EMAIL` | Email пользователя при seed | `user@example.com` |
| `DEFAULT_USER_PASSWORD` | Пароль пользователя при seed | `user_pass_123` |
| `DEFAULT_ADMIN_EMAIL` | Email администратора при seed | `admin@example.com` |
| `DEFAULT_ADMIN_PASSWORD` | Пароль администратора при seed | `admin_pass_123` |

---

## Запуск тестов

```bash
# Юнит-тесты бэкенда (подпись, пароли, JWT)
cd backend && pytest tests/unit/ -v

# Интеграционные тесты (требуется PostgreSQL)
cd backend && pytest tests/integration/ -v

# Проверка типов фронтенда
cd frontend && npx tsc --noEmit

# Линтинг фронтенда
cd frontend && npx eslint .
```

---

## Makefile-команды

| Команда | Описание |
|---------|----------|
| `make up` | Собрать и запустить все сервисы |
| `make down` | Остановить и удалить всё (включая данные БД) |
| `make test` | Запустить все тесты |
| `make lint` | Запустить все линтеры (ruff, mypy, eslint, tsc) |
| `make migrate` | Применить миграции БД |
| `make smoke` | Smoke-тесты через curl на запущенные сервисы |

---

## Структура проекта

```
payment-platform/
├── backend/
│   ├── src/app/
│   │   ├── main.py               # Фабрика приложения Sanic
│   │   ├── config.py             # Pydantic Settings
│   │   ├── db/models/            # SQLAlchemy модели (User, Admin, Account, Payment)
│   │   ├── schemas/              # Pydantic-схемы запросов/ответов
│   │   ├── repositories/         # Слой доступа к данным (базовый generic + специфичные)
│   │   ├── services/             # Бизнес-логика (auth, user, admin, payment)
│   │   ├── api/v1/               # HTTP-хендлеры (auth, users, admin, webhook)
│   │   ├── api/middleware/       # CORS, auth, DB-сессия, error handling
│   │   └── security/             # JWT, пароли (bcrypt), подпись webhook
│   ├── migrations/               # Alembic — schema + seed
│   ├── tests/                    # pytest (unit + integration)
│   └── docker/                   # Dockerfile + entrypoint
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios-клиент с interceptors + API-функции
│   │   ├── hooks/                # React Query хуки + Auth-контекст
│   │   ├── components/           # UI-компоненты (shadcn-стиль), layout, формы
│   │   ├── pages/                # Страницы (login, register, dashboard, admin)
│   │   ├── schemas/              # Zod-схемы валидации форм
│   │   └── lib/                  # Утилиты (cn, format, constants)
│   ├── nginx.conf                # Reverse proxy + SPA fallback
│   └── docker/                   # Multi-stage: node build → nginx
├── docs/ADR/                     # Архитектурные решения (3 шт.)
├── scripts/                      # Smoke-тесты, webhook-скрипт
├── docker-compose.yml
├── Makefile
└── .env.example
```

---

## Архитектурные решения (ADR)

| ADR | Решение |
|-----|---------|
| 0001 | Раздельные таблицы `users` и `admins` вместо одной с колонкой `role` |
| 0002 | Полностью асинхронный стек (Sanic + asyncpg + SQLAlchemy async) |
| 0003 | Идемпотентность webhook через `UNIQUE(transaction_id)` + `FOR UPDATE` |

Подробности — в `docs/ADR/`.

---

## Безопасность

- Пароли хешируются через **bcrypt** (passlib)
- JWT-токены подписываются **HS256**, TTL 60 минут
- Webhook-подпись проверяется через **hmac.compare_digest** (защита от timing attack)
- Денежные операции используют **`SELECT ... FOR UPDATE`** для блокировки строки в транзакции
- User-токен не имеет доступа к admin-эндпоинтам (и наоборот) — проверка роли
- Все ошибки возвращаются в формате `{"error": {"code": "...", "message": "..."}}`

# БП24 — Готовый бизнес-план онлайн

AI-сервис автоматической генерации бизнес-планов под РФ-аудиторию.

**Сайт:** https://kristall2002-art.github.io/gotovyplan/
**API:** https://bp24-api.152-53-60-176.nip.io
**Telegram-бот:** https://t.me/businessplan24_bot
**Telegram-канал:** https://t.me/+NxIFCQBuxsA3Mzdi (приватный, потом @bp24)

---

## В двух предложениях

Клиент рассказывает идею голосом или текстом на сайте, прикладывает файл (опционально), оставляет Telegram или email. Заявка падает на FastAPI-бэкенд, пишется в SQLite + Excel в Sync-папке Сергея, потом AI генерирует PDF и присылает контактом, который выбрал клиент.

---

## Тарифы

| Тариф | Цена | Для кого |
|---|---|---|
| Попробовать `/try` | бесплатно | Юр.чистка + карта конкурентов 500 м + топ-3 риска (без цифр) |
| Быстрый `/quick` | 990 ₽ | «Стоит ли вообще влезать» — диапазоны, 5–7 страниц PDF |
| Соцконтракт `/soc` | 3 990 ₽ | Под комиссию соцзащиты (до 350 000 ₽ от государства) |
| Конструктор `/pro` | от 4 990 ₽ или 9 990 ₽/мес | Консультантам — модульная сборка, свой брендинг, выгрузка в Word/Excel/PDF |
| Полный `/full` | от 14 990 ₽ | Для банка/инвестора — 30–40 страниц + Excel-финмодель |

---

## Архитектура (актуальная)

```
Клиент в РФ (любой браузер с https)
  │
  │ Forms через fetch на bp24-api.152-53-60-176.nip.io
  ▼
Сайт https://kristall2002-art.github.io/gotovyplan/
  Next.js 16 static export, deploy через GitHub Actions
  │
  │ HTTPS POST /api/order, /api/order/{id}/attachment
  ▼
nginx + Let's Encrypt (auto-renew) на netcup VPS (Германия)
  │
  ▼
FastAPI (uvicorn) под systemd user-unit bp24-backend.service
  127.0.0.1:8001
  │
  ├─ POST /api/order         — приём заявки (Pydantic-валидация, max_length, EmailStr, enum)
  ├─ POST /api/order/{id}/attachment  — загрузка файла (multipart, ≤10 МБ)
  ├─ POST /api/order/{id}/status      — изменение статуса (admin token)
  ├─ GET  /api/orders         — список заявок (admin token)
  └─ GET  /api/health         — liveness
  │
  ▼
SQLite WAL + автоэкспорт в Excel (атомарный, BackgroundTasks, asyncio.Lock)
  /home/sergei/sync/KRISTALL2002/KRISTALL2002/БП24/data/
  ├─ orders.db                   ← в .stignore (НЕ синхронизируется)
  ├─ orders.xlsx                 ← синхронизируется на ноут Сергея
  └─ uploads/{order_id}/...      ← файлы клиентов, синхронизируется
  │
  ▼ Syncthing
ПК Сергея в Рязани: D:\sync\KRISTALL2002\KRISTALL2002\БП24\data\
```

**Почему netcup, а не РФ-VPS:** изначально хотели Yandex Cloud Function как РФ-фасад → Yandex заблокировал аккаунт «за подозрительную активность», для разблокировки требует депозит 5 000 ₽. На ту же проблему наткнулись с Cloud.ru (Сбер — гос-риск). Beget VPS 210 ₽/мес — рабочий план Б, но пока не нужен. Сейчас тестируем без новой аренды на существующем netcup.

**152-ФЗ (персональные данные):**
- На текущем этапе (тест без реальных клиентов) — допустимо.
- При запуске продаж: либо переехать `BP24_DATA_DIR` на ПК в РФ через Sergey-tunnel (`C:\proxy\start.bat`), либо взять РФ-VPS Beget. Код архитектурно готов — одна env-переменная.

---

## Стек

**Frontend** (`/home/sergei/gotovyplan/`)
- Next.js 16 + React 19 + Tailwind 4 + TypeScript
- Статический экспорт `output: "export"`, basePath `/gotovyplan`
- Иконки: lucide-react
- Темы: next-themes (тёмная/светлая)
- CI/CD: GitHub Actions → GitHub Pages

**Backend** (`/home/sergei/bp24-backend/`)
- Python 3.13, FastAPI 0.136, Pydantic 2.13, uvicorn 0.46
- openpyxl для Excel, sqlite3 stdlib, python-multipart
- Запуск: systemd user-unit `bp24-backend.service` (Linger=yes, Restart=on-failure)
- Конфиг: `/home/sergei/bp24-backend/.env` (BP24_ADMIN_TOKEN, BP24_DATA_DIR)
- Виртуальное окружение: `.venv/`

**Хранение**
- SQLite WAL для конкурентных read+write
- Excel пересобирается атомарно (tempfile + os.replace) в фоне после каждой записи
- `.stignore` в data/ исключает orders.db* из Syncthing (избегаем порчу при синке открытой БД)
- Excel и uploads/ — синхронизируются на ПК

---

## Voice + текст + файл (компонент IdeaInput)

- **Микрофон:** Web Speech API (Chrome/Edge/Yandex.Browser)
  - getUserMedia с echoCancellation + noiseSuppression + autoGainControl
  - non-continuous + auto-restart на onend для меньшего количества повторов
  - Транскрипт идёт в textarea, можно править руками
  - Не работает на iOS Safari / Firefox — пользователь видит warning, печатает текст
- **Textarea:** min-height 320px, на всю ширину
- **Файл:** PDF / DOC / DOCX / TXT / RTF / ODT / JPG / PNG / WEBP / HEIC, ≤10 МБ
- **Отдельный компонент `<ContactPicker />`:** выбор Telegram или email + поле, валидация regex/EmailStr

---

## Схема БД (orders)

| Поле | Тип | Описание |
|---|---|---|
| id | INTEGER PK | автоинкремент |
| created_at | TEXT | ISO с TZ +03:00 (МСК) |
| source | TEXT | site / bot / admin |
| tariff | TEXT | try / quick / soc / full / pro / other |
| name | TEXT | имя клиента |
| telegram | TEXT | @username (если выбрал TG) |
| email | TEXT | email (если выбрал email) |
| promo_code | TEXT | START25 / LAUNCH50 / TGCHANNEL |
| discount_pct | INT | 0–100 |
| base_price | INT | цена тарифа |
| final_price | INT | после промокода |
| idea | TEXT | описание идеи (≤10 000 символов) |
| region | TEXT | для будущей карты конкурентов |
| city | TEXT | то же |
| address | TEXT | то же |
| lat | REAL | координаты |
| lon | REAL | координаты |
| attachment | TEXT | uploads/{id}/имя_файла |
| status | TEXT | new / in_progress / done / cancelled |
| notes | TEXT | служебные заметки |

Миграции через `ALTER TABLE ADD COLUMN IF NOT EXISTS` в `init_db()`.

---

## Защита

- **CORS** ограничен `https://kristall2002-art.github.io` + localhost
- **Admin token** в env (fail-fast если не задан), `secrets.compare_digest`
- **CSV-injection защита**: апостроф перед `=`, `+`, `-`, `@`, `\t`, `\r` в Excel-полях
- **Pydantic `extra="forbid"`**, max_length, EmailStr, ge/le для чисел
- **Upload**: whitelist расширений, лимит 10 МБ, _safe_filename(), tempfile + os.replace
- **HTTPS** Let's Encrypt с auto-renew

---

## SEO

- **Metadata** на каждой странице: уникальные title (50–60 симв.), description (140–160), keywords, OpenGraph, Twitter Card, canonical
- **JSON-LD**: Organization + WebSite на главной, Service+Offer на каждом тарифе, Product+aggregateRating+Review на /reviews
- **sitemap.xml** через `app/sitemap.ts` (`force-static`, trailingSlash)
- **robots.txt** в `/public/`
- **`<html lang="ru">`**, metadataBase, themeColor (light/dark)

---

## Telegram

- **Бот:** @businessplan24_bot, ID 8781723520, токен в `~/gotovyplan/.env.local` (gitignored)
- **Канал:** «БП24 — готовый бизнес-план», ID 3891051784, invite `https://t.me/+NxIFCQBuxsA3Mzdi`
- Бот = админ канала, может постить
- На странице успеха `/try`: кликабельная ссылка на бот в подписи (Telegram-вариант), напоминание про папку «Спам» (email-вариант)

---

## Юр.документы

`/home/sergei/sync/KRISTALL2002/KRISTALL2002/БП24/legal/`:
- `offer.md` — публичная оферта (16 разделов, жёсткая, ст. 437 ГК РФ)
- `privacy.md` — политика конфиденциальности (152-ФЗ)
- `consent.md` — согласие на обработку ПД (3 варианта чекбокса + полный текст)
- `README.md` — что заменить (плейсхолдеры [ИНН], [ДАТА]), что показать юристу

Чек-боксы согласия + страницы /offer, /privacy, /consent — TODO.

---

## Структура локального репо

```
~/gotovyplan/
├── app/
│   ├── layout.tsx              корневой layout с metadataBase, JSON-LD Organization
│   ├── page.tsx                главная (с MicButton → /try)
│   ├── sitemap.ts              автоматический sitemap.xml
│   ├── globals.css             темы + анимации (mic-pulse, ring-pulse — концентричные)
│   ├── quick/
│   │   ├── layout.tsx          metadata для /quick
│   │   └── page.tsx            "use client", IdeaInput + NextStep + OrderForm
│   ├── try/
│   │   ├── layout.tsx          metadata для /try
│   │   └── page.tsx            "use client", IdeaInput + ContactPicker → API
│   ├── soc/page.tsx            metadata + JSON-LD Service
│   ├── full/page.tsx           metadata + JSON-LD Service+Offer
│   ├── pro/page.tsx            metadata + JSON-LD Service+Offer
│   └── reviews/page.tsx        metadata + JSON-LD Product+Review
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   ├── ThemeProvider.tsx
│   ├── SocialLinks.tsx         TG канал + VK
│   ├── MicButton.tsx           главная — клик → /try
│   ├── PlanCard.tsx
│   ├── DataSources.tsx         16 баз
│   ├── Deliverables.tsx        что в результате
│   ├── ReviewBubble.tsx
│   ├── OrderForm.tsx           id="order-form" для scrollIntoView
│   ├── IdeaInput.tsx           микрофон + textarea + файл
│   ├── ContactPicker.tsx       Telegram или email
│   └── NextStep.tsx            CTA + альтернативные тарифы
├── lib/
│   └── api.ts                  createOrder, uploadAttachment, API_BASE
├── public/
│   ├── robots.txt
│   └── avatar_channel.jpg
├── .github/workflows/deploy.yml
├── .env.local                  TELEGRAM_BOT_TOKEN (gitignored)
└── PROJECT.md                  этот файл

~/bp24-backend/
├── main.py                     FastAPI (orders + uploads + admin)
├── run.sh                      загружает .env, запускает uvicorn
├── .env                        BP24_ADMIN_TOKEN + BP24_DATA_DIR (chmod 600)
├── .gitignore                  .env / .venv / __pycache__
└── .venv/

~/.config/systemd/user/bp24-backend.service
```

---

## Полный поток заявки `/try` (текущий)

1. Клиент открывает https://kristall2002-art.github.io/gotovyplan/try/
2. Жмёт микрофон → говорит идею (Web Speech API → текст в textarea)
3. Или печатает в textarea
4. Опционально прикладывает файл (PDF, DOCX, JPG…)
5. Выбирает Telegram или email + вводит контакт
6. Жмёт «Получить бизнес-план бесплатно»
7. fetch POST на `https://bp24-api.152-53-60-176.nip.io/api/order` с tariff="try"
8. API возвращает `{id}`, фронт делает второй POST на `/api/order/{id}/attachment` с файлом (если есть)
9. Заявка пишется в SQLite, BackgroundTask пересобирает orders.xlsx
10. Файл сохраняется в `data/uploads/{id}/имя_файла`
11. orders.xlsx и uploads/ синхронизируются через Syncthing на ПК Сергея
12. Клиент видит экран «Идея принята! План придёт в Telegram через @businessplan24_bot / на email (проверь Спам)»
13. **TODO:** AI-генерация плана + автоотправка в Telegram/email — пока не реализовано

---

## TODO (приоритет сверху)

1. **Раскатать IdeaInput + ContactPicker + API на /soc, /full, /pro** (после теста /try Сергеем)
2. **Страницы /offer, /privacy, /consent** + чекбокс согласия в платных формах
3. **Автогенерация плана** — pink-agent → Claude → PDF → отправка через бот / SMTP
4. **API подсказок** для расширения формы (DaData / OSM Nominatim — регион/город/адрес автокомплит)
5. **API карты конкурентов** (OSM Overpass / 2GIS)
6. **USP-блок «Проверяем источники каждый раз для каждого бизнес-плана»**
7. **Превьюшки тарифов внизу каждой страницы**
8. **Самозанятость** при первой продаже + ЮKassa подключение
9. **Купить .ru домен** (до 01.09.2026 — потом только через Госуслуги по паспорту)
10. **При запуске продаж — переехать БД на ПК в РФ** (через Sergey-tunnel) или Beget VPS — для соответствия 152-ФЗ

---

## Контакты и доступы

- **GitHub:** [kristall2002-art/gotovyplan](https://github.com/kristall2002-art/gotovyplan) (public)
- **Сайт локально:** `~/gotovyplan/`
- **Бэкенд локально:** `~/bp24-backend/`
- **TG-бот токен:** `~/gotovyplan/.env.local` → `TELEGRAM_BOT_TOKEN=8781723520:AAH_eyS99WNXwzu2-Aj0ZpZaYigxVnbk5mM`
- **Admin token API:** `~/bp24-backend/.env` → `BP24_ADMIN_TOKEN`
- **Юра @YuraZol** — потенциальный второй админ
- **Email Сергея:** kristall2002@gmail.com

---

## История ключевых решений

- **Изначально:** YCF (Yandex Cloud Function) как РФ-фасад → отброшено (требует депозит 5 000 ₽ для разблокировки)
- **Cloud.ru (Сбер) Functions:** есть Free Tier, но риск повторения «Yandex-сценария» (госкомпания) — отложено
- **netcup напрямую без РФ-фасада:** работает, но 152-ФЗ требует первичную запись ПД в РФ — для теста OK, для прода нет
- **Whisper для транскрипции:** Сергей отверг (хочет бесплатное в браузере) → используем Web Speech API
- **«Получить бизнес-план бесплатно», а не «бесплатный отчёт»** — продукт = бизнес-план, не «отчёт»
- **Микрофон на главной → /try, а не модалка/круговое меню** — упростили UX
- **«Реальный анализ для твоей идеи» вместо «честный ответ»** — на /quick
- **Источники проверяем «каждый раз для каждого бизнес-плана»** (не «построчно» — Сергею не нравилось это слово)

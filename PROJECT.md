# БП24 — Готовый бизнес-план онлайн

AI-сервис автоматической генерации бизнес-планов под РФ-аудиторию.

- **Сайт:** https://kristall2002-art.github.io/gotovyplan/
- **API:** https://bp24-api.152-53-60-176.nip.io
- **Telegram-бот:** https://t.me/businessplan24_bot
- **Telegram-канал:** https://t.me/+NxIFCQBuxsA3Mzdi (приватный)
- **VK-сообщество:** https://vk.com/club238464496

---

## В двух предложениях

Клиент рассказывает идею голосом или текстом на сайте, прикладывает файл, оставляет email/Telegram → заявка падает на FastAPI-бэкенд → пишется в SQLite + автоэкспорт в Excel в Sync-папке владельца. Оплата через ЮKassa (live), AI-генерация плана и автоотправка пока в TODO.

---

## Тарифы

| Тариф | URL | Цена |
|---|---|---|
| Попробовать бесплатно | `/try` | 0 ₽ |
| Быстрый расчёт | `/quick` | 990 ₽ |
| Соцконтракт | `/soc` | 3 990 ₽ |
| Полный план | `/full` | от 14 990 ₽ |
| Конструктор Pro | `/pro` | от 9 990 ₽/мес |

Промокоды: `START25` (25%), `LAUNCH50` (50%), `TGCHANNEL` (30%), `BP24-OWNER` (100% — мастер для владельца, пропускает ЮKassa).

---

## Архитектура

```
Клиент в РФ → kristall2002-art.github.io/gotovyplan (Next.js 16 static export)
                      │
                      │ fetch на bp24-api.152-53-60-176.nip.io
                      ▼
nginx + Let's Encrypt на netcup VPS
                      │
                      ▼
FastAPI uvicorn, systemd user-unit, 127.0.0.1:8001
   ├─ POST /api/order
   ├─ POST /api/order/{id}/attachment (multipart)
   ├─ POST /api/order/{id}/payment (YooKassa)
   ├─ POST /api/yookassa/webhook
   ├─ POST /api/order/{id}/status (admin)
   ├─ GET  /api/orders (admin)
   └─ GET  /api/health
   │
   ▼
SQLite WAL + автоэкспорт в Excel
~/sync/KRISTALL2002/KRISTALL2002/БП24/data/
   ├─ orders.db (в .stignore)
   ├─ orders.xlsx (синкается на ноут)
   └─ uploads/{order_id}/ (синкается)
```

---

## Стек

**Frontend** (`~/gotovyplan/`):
- Next.js 16 + React 19 + Tailwind 4 + TypeScript
- Static export, deploy через GitHub Actions → GitHub Pages

**Backend** (`~/bp24-backend/`):
- FastAPI + uvicorn + Pydantic
- yookassa SDK + python-multipart + openpyxl + sqlite3
- systemd user-unit `bp24-backend.service`
- Конфиг в `.env` (gitignored): BP24_ADMIN_TOKEN, BP24_DATA_DIR, YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY, YOOKASSA_RETURN_URL

**ВК-инструменты** (`~/bp24-vk/`):
- setup.py — обложка + закреп-пост + описание
- create_market.py — генерация картинок товаров

**Автопостинг** (`~/bp24-autopost/`):
- 15 постов в `posts.json`
- Cron: `0 10 * * *` → пост в TG-канал + ВК-стену
- Картинки 1200×630 (тёмный фон + cyan + glassmorphism)

---

## Ключевые компоненты сайта

**components/IdeaInput.tsx** — микрофон (Web Speech API continuous) + textarea + загрузка файла. sessionTextRef сохраняет текст между auto-restart'ами SR.

**components/ContactPicker.tsx** — выбор Telegram или email, валидация regex.

**components/OrderForm.tsx** — заполнение контактов + промокод. createOrder → createPayment → редирект на ЮKassa. BP24-OWNER пропускает оплату → сразу на /paid.

**components/PlanPreview.tsx** — галерея 6 SVG-образцов страниц бизнес-плана (карта конкурентов, P&L, Excel-финмодель, окупаемость, CAPEX-pie, структура PDF). Tier-aware locking — заблюренные карточки на бесплатном тарифе.

**components/NextStep.tsx** — кнопка-якорь к форме + быстрые ссылки на другие тарифы.

**lib/api.ts** — createOrder, uploadAttachment, createPayment. API_BASE = `https://bp24-api.152-53-60-176.nip.io`.

---

## Схема БД (orders)

| Поле | Тип | Описание |
|---|---|---|
| id | INTEGER PK | автоинкремент |
| created_at | TEXT | ISO с TZ +03:00 (МСК) |
| source | TEXT | site / bot / admin |
| tariff | TEXT | try / quick / soc / full / pro / other |
| name | TEXT | имя клиента |
| telegram | TEXT | @username |
| email | TEXT | email |
| promo_code | TEXT | START25 / LAUNCH50 / TGCHANNEL / BP24-OWNER |
| discount_pct | INT | 0–100 |
| base_price | INT | базовая цена тарифа |
| final_price | INT | после промокода |
| idea | TEXT | описание идеи (≤10 000 символов) |
| region | TEXT | для будущей карты |
| city | TEXT | то же |
| address | TEXT | то же |
| lat | REAL | координаты |
| lon | REAL | координаты |
| attachment | TEXT | uploads/{id}/имя_файла |
| payment_id | TEXT | UUID платежа в ЮKassa |
| paid_at | TEXT | дата оплаты |
| status | TEXT | new / awaiting_payment / paid / cancelled / in_progress / done |
| notes | TEXT | служебные заметки |

Миграции через `ALTER TABLE ADD COLUMN IF NOT EXISTS` в init_db().

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

- Уникальные `metadata` на каждой странице: title, description, keywords, OpenGraph, Twitter Card, canonical
- JSON-LD: Organization + WebSite на главной, Service+Offer на каждом тарифе, Product+aggregateRating+Review на /reviews
- `app/sitemap.ts` → `sitemap.xml` с force-static
- `public/robots.txt`
- `<html lang="ru">`, metadataBase, themeColor (light/dark)

---

## Структура локального репо

```
~/gotovyplan/
├── app/
│   ├── layout.tsx              корневой layout с metadataBase, JSON-LD Organization
│   ├── page.tsx                главная (MicButton → /try)
│   ├── sitemap.ts              автоматический sitemap.xml
│   ├── globals.css             темы + анимации (mic-pulse, ring-pulse)
│   ├── quick/
│   │   ├── layout.tsx          metadata
│   │   └── page.tsx            "use client", IdeaInput + NextStep + OrderForm + PlanPreview
│   ├── try/
│   │   ├── layout.tsx          metadata
│   │   └── page.tsx            "use client", IdeaInput + ContactPicker + PlanPreview → API
│   ├── soc/page.tsx            metadata + JSON-LD
│   ├── full/page.tsx           metadata + JSON-LD + PlanPreview
│   ├── pro/page.tsx            metadata + JSON-LD + PlanPreview
│   ├── reviews/page.tsx        metadata + JSON-LD
│   └── paid/page.tsx           noindex, экран «Спасибо за заказ»
├── components/
│   ├── Header.tsx, Footer.tsx
│   ├── ThemeToggle.tsx, ThemeProvider.tsx
│   ├── SocialLinks.tsx         TG + ВК иконки
│   ├── MicButton.tsx           главная — клик → /try
│   ├── PlanCard.tsx
│   ├── DataSources.tsx         16 баз
│   ├── Deliverables.tsx
│   ├── ReviewBubble.tsx
│   ├── OrderForm.tsx           id="order-form" для scrollIntoView
│   ├── IdeaInput.tsx           микрофон + textarea + файл
│   ├── ContactPicker.tsx       Telegram или email
│   ├── NextStep.tsx            CTA + альтернативные тарифы
│   └── PlanPreview.tsx         6 SVG-образцов страниц плана
├── lib/
│   └── api.ts                  createOrder, uploadAttachment, createPayment
├── public/
│   ├── robots.txt
│   └── avatar_channel.jpg
├── .github/workflows/deploy.yml
├── .env.local                  TELEGRAM_BOT_TOKEN (gitignored)
└── PROJECT.md                  этот файл
```

---

## Полный поток заявки

### Платный (любой тариф):

1. Клиент открывает /quick (или другой)
2. Жмёт микрофон → говорит идею (Web Speech API → текст в textarea)
3. Опционально прикладывает файл (PDF, DOCX, JPG…)
4. Заполняет имя/email/Telegram, может ввести промокод
5. Жмёт «Заказать за X ₽»
6. fetch POST `/api/order` → возвращает `{id}`
7. Если есть файл — POST `/api/order/{id}/attachment` (multipart)
8. POST `/api/order/{id}/payment` → возвращает `confirmation_url` от ЮKassa
9. Браузер редиректит на yoomoney.ru/checkout
10. Клиент платит → ЮKassa возвращает на `/paid`
11. ЮKassa параллельно отправляет webhook на `/api/yookassa/webhook` → status=paid + paid_at
12. Заявка появляется в orders.xlsx со статусом `paid`
13. **TODO:** AI-генерация плана + автоотправка клиенту

### С промокодом BP24-OWNER:

1-7. Те же шаги
8. Промокод `BP24-OWNER` → `final_price=0`, `notes="owner test order"` → ЮKassa **пропускается**
9. Сразу `/paid`

---

## TODO (приоритет сверху)

### Критично для запуска продаж:

1. **Webhook URL в ЛК ЮKassa** — `https://bp24-api.152-53-60-176.nip.io/api/yookassa/webhook` + события `payment.succeeded`, `payment.canceled`, `payment.waiting_for_capture`. Без него статус не обновляется.

2. **Налоговый режим Юры** — vat_code в чеке. Сейчас `1` (УСН/НПД, без НДС). Если ОСН с НДС — `4` или `6`.

3. **Юр.страницы /offer, /privacy, /consent** — раскатать содержимое из `~/sync/KRISTALL2002/KRISTALL2002/БП24/legal/` в Next.js. Заменить плейсхолдеры на реквизиты Юры. Чекбокс «согласен» в OrderForm обязательным.

4. **AI-генерация бизнес-плана** — главный TODO. Сейчас заявки попадают в Excel, дальше руками. Нужно: pink-agent → Claude session per order → формирование PDF → отправка через бот / SMTP.

5. **Telegram-уведомление** Сергея о новой оплате (через webhook handler).

### ВК:

6. **5 товаров в ВК-Маркет** руками — картинки готовы в `~/bp24-vk/market/*.png`, тексты в `create_market.py`.
7. **Аватарка ВК** руками (квадрат 1024×1024, готова в `/tmp/bp24_avatar_square_1024.jpg`).
8. **Закрепить новый пост** `wall-238464496_4`, открепить старый `wall-238464496_2`.

### Аналитика:

9. **Yandex.Metrica** + цели
10. **Google Analytics 4**
11. **Yandex.Webmaster** + Google Search Console
12. **VK Pixel** для ретаргета

### Полезное:

13. localStorage для idea
14. Open Graph image на сайте
15. Кастомная 404
16. USP-блок «Проверяем источники каждый раз для каждого бизнес-плана»
17. Превьюшки тарифов внизу каждой страницы (как NextStep на /quick)
18. Раскатать IdeaInput на /soc, /full, /pro
19. API подсказок (DaData/Nominatim) для региона/города
20. API карты конкурентов (OSM Overpass / 2GIS)

---

## История ключевых решений

- **Изначально:** YCF (Yandex Cloud Function) как РФ-фасад → отброшено (требует депозит 5 000 ₽)
- **Cloud.ru (Сбер):** Free Tier есть, но риск повторения «Yandex-сценария» — отложено
- **netcup напрямую без РФ-фасада:** работает, но 152-ФЗ требует первичную запись в РФ — для теста OK, для прода нужен переезд (Beget VPS 210 ₽/мес или ПК Сергея в Рязани)
- **Whisper для транскрипции:** Сергей отверг (хочет бесплатное в браузере) → Web Speech API
- **«Получить бизнес-план бесплатно»**, не «бесплатный отчёт» — продукт = бизнес-план
- **Микрофон на главной → /try**, без модалки — упростили UX
- **«Реальный анализ для твоей идеи»** вместо «честный ответ» на /quick
- **Источники проверяем «каждый раз для каждого бизнес-плана»** (не «построчно»)
- **Web Speech API: continuous + sessionTextRef** — текст не теряется между auto-restart'ами
- **2026-05-02:** инцидент с утечкой токена бота в PROJECT.md → revoke + новый. Запомнили: НИКОГДА не записывать токены в публичный репо.

---

## Связанные файлы (вне репо)

- `~/sync/CLAUDE/PROJECT_BiznesPlan2.md` — полный контекст с токенами и доступами (Sync-папка, не публичный)
- `~/sync/KRISTALL2002/KRISTALL2002/БП24/legal/` — юр.документы
- `~/sync/KRISTALL2002/KRISTALL2002/БП24/data/orders.xlsx` — таблица заявок (синкается)
- `~/bp24-backend/.env` — секреты бэкенда (chmod 600)
- `~/bp24-vk/.env` — VK group token
- `~/bp24-autopost/.env` — токены для автопостинга

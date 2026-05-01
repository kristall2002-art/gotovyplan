# БП24 — Готовый бизнес-план онлайн

AI-сервис автоматической генерации бизнес-планов под РФ-аудиторию.

## В двух предложениях

Клиент наговаривает идею голосом на сайте → AI задаёт уточняющие вопросы прямо в чате на сайте → выдаёт структурированный PDF с реальными цифрами по РФ (Росстат, ФНС, ОКВЭД), финмоделью в Excel и графиками. Платит через ЮKassa, получает PDF в браузере и на email.

## Целевая аудитория и тарифы

| Тариф | Цена | Для кого |
|---|---|---|
| Быстрый расчёт `/quick` | 990 ₽ | Бытовые предприниматели — «открыть кофейню, шиномонтаж, маникюр» |
| Соцконтракт `/soc` | 3 990 ₽ | Малоимущие под госпрограмму до 350 000 ₽ |
| Конструктор `/pro` | от 4 990 ₽ или подписка 9 990 ₽/мес | Консультанты, экономисты — для своих клиентов |
| Полный план `/full` | от 14 990 ₽ | Предприниматели для банка/инвестора |

## Архитектура

```
Клиент в РФ
  │ HTTPS POST { message, session_id }
  ▼
Сайт bp24.ru (Next.js статика, GitHub Pages CNAME)
  │ HTTPS POST на YCF endpoint
  ▼
Yandex Cloud Function "chat-ingest" (РФ-фасад, бесплатно)
  │ HTTPS POST с секретным токеном
  ▼
Бэкенд на netcup VPS (Python FastAPI, ~50 МБ RAM)
  ├─ POST /api/message — приём сообщения
  ├─ POST /api/payment-webhook — ЮKassa webhook
  └─ pink-agent CLI integration
       │
       ▼
   pink-agent создаёт топик в TG-супергруппе Сергея
       │
       ▼
   Claude (эта сессия) = AI-движок:
   анализирует идею, задаёт уточнения, генерит PDF
       │
       ▼
   Ответ через stdout → pink-agent → netcup → YCF → сайт → клиент
```

**Telegram бот и канал** — параллельные каналы для маркетинга и опционального общения, НЕ критическая инфраструктура.

## Почему так

🇷🇺 **Telegram нестабилен в РФ** — диалог с клиентом идёт ЧЕРЕЗ САЙТ, не через бота
🇷🇺 **Yandex Cloud Function** = РФ-фасад поверх netcup. Бесплатно (1 млн вызовов/мес). Только сетевой прокси, данные хранятся на netcup
🇷🇺 **Cloudflare заблокирован в РФ** — не используем
🤖 **AI-движок ТОЛЬКО Claude через pink-agent** — никакого YandexGPT, GigaChat или прямого Anthropic API

## Стек (на проде)

- **Frontend**: Next.js 16 + React 19 + Tailwind 4 + TypeScript, статический экспорт
- **Иконки**: lucide-react
- **Тёмная/светлая темы**: next-themes
- **CI/CD**: GitHub Actions (deploy.yml) → GitHub Pages
- **Хостинг сайта**: GitHub Pages (бесплатно), позже привязка `.ru` домена через CNAME

## Стек (планируется)

- **РФ-фасад**: Yandex Cloud Function (Python ~30 строк, бесплатно)
- **Бэкенд**: Python FastAPI на netcup VPS (под systemd рядом с pink-agent)
- **БД**: SQLite на netcup для заявок, промокодов, истории чата
- **Платежи**: ЮKassa Checkout виджет (карта/СБП/SberPay/YandexPay)
- **PDF**: HTML → Edge headless (как в `~/sync/CLAUDE/` пайплайне Сергея)
- **Excel**: openpyxl
- **Голос**: Web Speech API (browser, бесплатно)
- **AI-движок**: pink-agent → Claude session per order (НЕ YandexGPT, НЕ Anthropic API напрямую)

## Источники данных РФ (16 баз — будущая RAG)

**Финансы и налоги:** ФНС (bo.nalog.ru, ЕГРЮЛ, ЕГРИП), ОКВЭД 2, ЦБ РФ
**Рынок и статистика:** Росстат, СПАРК-Интерфакс, Реестр МСП, Yandex Wordstat
**География:** 2GIS, OpenStreetMap, Yandex Геокодер, DaData
**Регулирование:** Роспотребнадзор (СанПиН), МЧС (пожарные), МСП.РФ, соцзащита 85 регионов

## Структура страниц

- `/` — главная: hero с микрофоном, 4 карточки тарифов, блок «Что в результате» (PDF/Excel/графики/карта/чек-лист), 16 баз данных, CTA
- `/quick`, `/full`, `/pro`, `/soc` — тарифы с формой заказа + промокод
- `/reviews` — 12 отзывов в TG-стиле

## Telegram-инфра

- **Канал**: «БП24 — готовый бизнес-план», ID 3891051784, инвайт https://t.me/+NxIFCQBuxsA3Mzdi (планируется @bp24)
- **Бот**: @businessplan24_bot, ID 8781723520
- Бот = админ канала, может постить
- Команды настроены: /start /order /promo /help — обработчик ещё не написан

## Текущий статус (2026-05-01)

✅ Сделано:
- Лендинг 6 страниц на GitHub Pages, тёмная/светлая темы, форма заказа с промокодами, страница отзывов в TG-стиле
- TG-канал и бот созданы, бот — админ канала
- 10 промптов для аватарки в Nano Banana
- Проект сохранён в memory + этот PROJECT.md

⏳ Следующие шаги:
1. Решить юр-форму (самозанятость / ИП)
2. Купить `.ru` домен
3. Написать FastAPI бэкенд на netcup для приёма заявок и WebSocket-чата
4. Добавить чат-компонент на сайт
5. Подключить ЮKassa виджет

## Структура локального репо

```
~/gotovyplan/
├── app/                    Next.js страницы
│   ├── page.tsx            Главная
│   ├── layout.tsx          Корневой layout
│   ├── globals.css         Стили + темы
│   ├── quick/              Быстрый расчёт
│   ├── full/               Полный план
│   ├── pro/                Конструктор
│   ├── soc/                Соцконтракт
│   └── reviews/            Отзывы
├── components/
│   ├── Header.tsx          Шапка с навигацией
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx     Pill-кнопка день/ночь
│   ├── ThemeProvider.tsx
│   ├── SocialLinks.tsx     TG + VK иконки
│   ├── MicButton.tsx       Пульсирующий микрофон
│   ├── PlanCard.tsx        Карточка тарифа
│   ├── DataSources.tsx     Блок 16 источников
│   ├── Deliverables.tsx    Блок «Что в результате»
│   ├── ReviewBubble.tsx    TG-стиль отзыв
│   └── OrderForm.tsx       Форма заказа с промокодом
├── public/
├── .github/workflows/
│   └── deploy.yml          GitHub Pages auto-deploy
├── .env.local              TELEGRAM_BOT_TOKEN (gitignored)
└── PROJECT.md              этот файл
```

## Контакты и доступы

- GitHub: kristall2002-art/gotovyplan (public)
- Локально: `~/gotovyplan/`
- TG-бот токен: `~/gotovyplan/.env.local` → `TELEGRAM_BOT_TOKEN`
- Юра @YuraZol — потенциальный второй админ

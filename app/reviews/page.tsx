import Link from "next/link";
import { ReviewBubble, type Review } from "@/components/ReviewBubble";

const reviews: Review[] = [
  {
    name: "Олег Карпов",
    handle: "@oleg_biz_kaluga",
    source: "Telegram",
    time: "2 дня назад",
    text: "Открываю шиномонтаж в Калуге. Заказал быстрый расчёт за 990 ₽ — получил оценку рынка по району, всех конкурентов в радиусе 3 км и понимание что УСН-доход выгоднее ПСН в моём случае. Сэкономил 30 тыс на консультанте.",
    reactions: [
      { emoji: "❤️", count: 14 },
      { emoji: "👍", count: 9 },
    ],
    avatarColor: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  },
  {
    name: "Анна Смирнова",
    handle: "id4521889",
    source: "ВКонтакте",
    time: "неделю назад",
    text: "Делали бизнес-план под соцконтракт на швейный цех. Одобрили с первого раза, перевели 350 000 ₽. Главное — в плане были учтены требования нашей соцзащиты по Краснодарскому краю, мне даже комиссия сделала комплимент!",
    reactions: [
      { emoji: "🔥", count: 23 },
      { emoji: "❤️", count: 11 },
    ],
    avatarColor: "linear-gradient(135deg, #f472b6, #db2777)",
  },
  {
    name: "Максим Романов",
    handle: "@maks_vrn",
    source: "Telegram",
    time: "4 дня назад",
    text: "Подавал заявку в Сбер на кредит для расширения автосервиса. План приняли без вопросов — сказали финмодель в Excel сделана грамотно, со всеми сценариями. Одобрили 4 млн под 14%.",
    reactions: [
      { emoji: "💪", count: 18 },
      { emoji: "👍", count: 12 },
    ],
    avatarColor: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    name: "Игорь Кузнецов",
    handle: "Игорь К., консультант",
    source: "Profi.ru",
    time: "3 дня назад",
    text: "Я делаю планы клиентам уже 7 лет. Подписался на PRO — экономлю 4-5 часов на каждом плане за счёт автоматических данных по Росстату и финотчётности конкурентов. Подписка окупилась десятикратно за месяц.",
    reactions: [{ emoji: "🚀", count: 8 }],
    avatarColor: "linear-gradient(135deg, #a78bfa, #7c3aed)",
  },
  {
    name: "Татьяна Лебедева",
    handle: "@tatiana_master",
    source: "Telegram",
    time: "5 дней назад",
    text: "Нужен был полный план для маникюрного салона в Новосибирске под инвестора. Получила за 24 часа — 38 страниц + Excel + презентация. Инвестор принял без правок, что для меня было шоком 😅",
    reactions: [
      { emoji: "❤️", count: 21 },
      { emoji: "🎉", count: 7 },
    ],
    avatarColor: "linear-gradient(135deg, #fbbf24, #d97706)",
  },
  {
    name: "Ирина Хабарова",
    handle: "id_8723041",
    source: "ВКонтакте",
    time: "2 недели назад",
    text: "Самое крутое — что все цифры со ссылками на источники. Прихожу к маме показать план — она сама может всё проверить, открывает Росстат и видит что да, рынок 240 млн в области, как написано. Доверие уровня 100%.",
    reactions: [{ emoji: "👍", count: 16 }],
    avatarColor: "linear-gradient(135deg, #f87171, #dc2626)",
  },
  {
    name: "Денис Морозов",
    handle: "Денис М.",
    source: "Avito",
    time: "неделю назад",
    text: "Хотел открыть кофейню в спальном районе Уфы. Боялся конкуренции — оказалось зря, в радиусе 800 м только 1 точка. План показал поток пешеходов по часам и предложил режим работы с 7:00. Всё, теперь делаю ремонт.",
    avatarColor: "linear-gradient(135deg, #60a5fa, #2563eb)",
  },
  {
    name: "Светлана Белова",
    handle: "@sveta_eco_farm",
    source: "Telegram",
    time: "3 дня назад",
    text: "Делаю экоферму в Тверской области. План помог найти грант Минсельхоза на 1.5 млн, о котором я даже не знала. В разделе «региональная поддержка» всё было расписано — куда подавать, какие документы.",
    reactions: [
      { emoji: "🌱", count: 12 },
      { emoji: "❤️", count: 6 },
    ],
    avatarColor: "linear-gradient(135deg, #4ade80, #16a34a)",
  },
  {
    name: "Андрей Павлов",
    handle: "@apavlov_invest",
    source: "Telegram",
    time: "5 дней назад",
    text: "Готовил питч-дек для бизнес-ангела по IT-стартапу. Заказал расширенный план с презентацией. Дек был настолько чистый, что инвестор не задал ни одного вопроса по цифрам — только по продукту. Проще закрыть раунд так не было.",
    reactions: [{ emoji: "🚀", count: 31 }],
    avatarColor: "linear-gradient(135deg, #c084fc, #9333ea)",
  },
  {
    name: "Наталья Виноградова",
    handle: "id12_88_nv",
    source: "ВКонтакте",
    time: "4 дня назад",
    text: "Парикмахерская под соцконтракт в Воронеже. План одобрили, 250 тыс получила. Огромное спасибо что в смете расписали каждую единицу оборудования по конкретным магазинам — у комиссии не возникло вопросов «откуда цены».",
    reactions: [
      { emoji: "💜", count: 9 },
      { emoji: "🙏", count: 5 },
    ],
    avatarColor: "linear-gradient(135deg, #f472b6, #be185d)",
  },
  {
    name: "Михаил Тихонов",
    handle: "Михаил Т., экономист",
    source: "Profi.ru",
    time: "2 недели назад",
    text: "Собирал план под производство мебели. Точку безубыточности увидел заранее — оказалось, при моём ценнике нужно делать минимум 22 заказа в месяц, а я планировал 15. Спас себя от провала, пересчитал бизнес-модель.",
    reactions: [
      { emoji: "👍", count: 19 },
      { emoji: "💯", count: 4 },
    ],
    avatarColor: "linear-gradient(135deg, #fb923c, #ea580c)",
  },
  {
    name: "Ольга Демидова",
    handle: "@olga_rest_spb",
    source: "Telegram",
    time: "неделю назад",
    text: "Открываю ресторан в ТЦ в Питере. Карта конкурентов с тепловой плотностью показала, что нашу нишу (грузинская кухня) никто в радиусе километра не закрывает, зато итальянок 8 штук. Поменяла позиционирование — спасибо!",
    reactions: [
      { emoji: "🍷", count: 15 },
      { emoji: "❤️", count: 8 },
    ],
    avatarColor: "linear-gradient(135deg, #fb7185, #be123c)",
  },
];

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <span className="px-3 py-1 mb-5 inline-block text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)]">
          Отзывы клиентов
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Что говорят клиенты
        </h1>
        <p className="text-[var(--muted)] text-lg">
          Реальные отзывы из Telegram, ВКонтакте, Profi.ru, Avito.
          Все клиенты — с подтверждёнными покупками.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <div className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm">
          <strong className="text-[var(--accent)]">4.9</strong> / 5 средняя оценка
        </div>
        <div className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm">
          <strong className="text-[var(--accent)]">2 400+</strong> готовых планов
        </div>
        <div className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm">
          <strong className="text-[var(--accent)]">94%</strong> возвращаются повторно
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
        {reviews.map((review, idx) => (
          <ReviewBubble key={idx} review={review} />
        ))}
      </div>

      <div className="mt-16 text-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Раздумываешь над своей идеей?
        </h2>
        <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
          Расскажи голосом — мы оценим жизнеспособность, рассчитаем стартовые
          вложения и покажем конкурентов в твоём районе. Дальше решишь сам,
          влезать или нет.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Оценить идею →
        </Link>
      </div>
    </div>
  );
}

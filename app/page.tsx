import { MicButton } from "@/components/MicButton";
import { PlanCard } from "@/components/PlanCard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero */}
      <section className="py-24 md:py-32 flex flex-col items-center text-center">
        <span className="px-3 py-1 mb-6 text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)]">
          AI-сервис · готовый бизнес-план
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
          <span className="gradient-text">Готовый бизнес-план</span>
          <br />
          за минуты, а не недели
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mb-12">
          Расскажи свою идею голосом — получи структурированный план с расчётами,
          анализом рынка и оценкой осуществимости. От быстрого чек-апа до плана
          под банк или соцконтракт.
        </p>

        <MicButton />
      </section>

      {/* Tariffs */}
      <section id="tariffs" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Четыре направления</h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto">
            Выбери задачу — и переходи на нужную страницу.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PlanCard
            href="/quick"
            title="Быстрый расчёт"
            price="990 ₽"
            description="Понять, стоит ли вообще влезать"
            features={[
              "Юр-чек: что нужно для запуска",
              "Налоги и режим",
              "Конкуренты в районе",
              "Диапазон вложений",
              "5–7 страниц PDF · 15 минут",
            ]}
          />
          <PlanCard
            href="/full"
            title="Полный бизнес-план"
            price="от 14 990 ₽"
            description="Для банка, инвестора, гранта"
            features={[
              "30–40 страниц + Excel-финмодель",
              "Анализ рынка с источниками",
              "P&L, cash flow, NPV/IRR",
              "Маркетинг и юнит-экономика",
              "Готовность за 24 часа",
            ]}
            badge="Хит"
            highlight
          />
          <PlanCard
            href="/pro"
            title="Конструктор для PRO"
            price="от 4 990 ₽"
            description="Для консультантов и сметчиков"
            features={[
              "Модульная сборка плана",
              "Доступ к данным Росстата, ФНС",
              "Свой брендинг в PDF",
              "Word, Excel, PDF выгрузка",
              "Подписка для постоянных",
            ]}
          />
          <PlanCard
            href="/soc"
            title="Соцконтракт"
            price="3 990 ₽"
            description="План под господдержку"
            features={[
              "До 350 000 ₽ от государства",
              "Шаблон под комиссию соцзащиты",
              "Учёт региональных требований",
              "Гарантия одобрения",
              "Готовность за 48 часов",
            ]}
          />
        </div>
      </section>

      {/* Why */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Чем мы отличаемся
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Реальные данные РФ</h3>
            <p className="text-sm text-[var(--muted)]">
              Подключаемся напрямую к Росстату, ФНС, ЕГРЮЛ. Никаких выдуманных
              цифр — только проверяемые источники со ссылками.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="text-2xl mb-3">🎤</div>
            <h3 className="font-semibold mb-2">Голосовой ввод</h3>
            <p className="text-sm text-[var(--muted)]">
              Не нужно писать длинные брифы — наговори идею своими словами.
              AI задаст уточняющие вопросы, если чего-то не хватает.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="text-2xl mb-3">📐</div>
            <h3 className="font-semibold mb-2">Налоги и СанПиН</h3>
            <p className="text-sm text-[var(--muted)]">
              Учитываем УСН, ПСН, НПД, региональные субсидии и санитарные нормы
              для твоей деятельности по ОКВЭД.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

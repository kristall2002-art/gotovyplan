import { OrderForm } from "@/components/OrderForm";

export default function FullPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="text-sm text-[var(--accent)] font-medium">Тариф 2</span>
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        Полный бизнес-план
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Готовый документ для подачи в банк, фонд, инвестору или для собственного
        запуска. С финмоделью в Excel, графиками и расчётами по месяцам.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что включено (30–40 страниц)</h2>
        <ul className="space-y-3 text-sm">
          <li>📋 Резюме проекта</li>
          <li>🎯 Описание продукта и ЦА</li>
          <li>📊 Анализ рынка с цифрами Росстата и ссылками</li>
          <li>🔍 Конкуренты: финансовые показатели по ИНН (ФНС)</li>
          <li>📐 Производственный / операционный план</li>
          <li>🚀 Маркетинг-план с юнит-экономикой</li>
          <li>💰 Финмодель Excel: P&L, cash flow, balance sheet</li>
          <li>📈 NPV, IRR, точка безубыточности, 3 сценария</li>
          <li>⚠️ Анализ рисков с матрицей</li>
          <li>📜 Юр. часть: налоги, лицензии, СанПиН</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold mb-2">Стандартный — 14 990 ₽</h3>
          <p className="text-sm text-[var(--muted)]">
            30 страниц, готовность 24 часа
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-6">
          <h3 className="font-semibold mb-2">Расширенный — 24 990 ₽</h3>
          <p className="text-sm text-[var(--muted)]">
            40 страниц + презентация для инвестора + 1 правка
          </p>
        </div>
      </div>

      <OrderForm tariff="full" basePrice={14990} buttonLabel="Заказать полный план за" />
    </div>
  );
}

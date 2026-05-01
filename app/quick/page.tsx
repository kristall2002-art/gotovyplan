export default function QuickPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="text-sm text-[var(--accent)] font-medium">
        Тариф 1
      </span>
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        Быстрый расчёт
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Для тех, кто думает «открыть бы кофейню / шаурму / маникюр» и хочет
        понять — стоит ли вообще влезать. За 990 ₽ получишь честный ответ
        со ссылками на источники.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что внутри PDF (5–7 страниц)</h2>
        <ul className="space-y-3 text-sm">
          <li>✅ Можно ли это вообще делать — лицензии, ОКВЭД, ограничения</li>
          <li>✅ Какой налоговый режим выгоднее (УСН / ПСН / НПД)</li>
          <li>✅ Конкуренты в твоём районе с радиусом и плотностью</li>
          <li>✅ Диапазон стартовых вложений и срок окупаемости</li>
          <li>✅ Топ-3 риска с оценкой вероятности</li>
          <li>✅ Готов ли регион поддержать субсидией</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Чего НЕТ в этом тарифе</h2>
        <ul className="space-y-3 text-sm text-[var(--muted)]">
          <li>— точных цифр выручки и прибыли (только диапазоны)</li>
          <li>— Excel-финмодели по месяцам</li>
          <li>— подробного маркетинг-плана</li>
          <li>— документов для банка/инвестора</li>
        </ul>
        <p className="text-sm mt-5">
          Это нужно? Тогда смотри{" "}
          <a href="/full" className="text-[var(--accent)] underline">
            Полный бизнес-план
          </a>
          .
        </p>
      </div>

      <button
        type="button"
        className="w-full md:w-auto px-8 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity"
      >
        Заказать за 990 ₽
      </button>
    </div>
  );
}

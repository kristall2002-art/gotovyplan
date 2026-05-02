"use client";

import { ArrowRight } from "lucide-react";

interface Tariff {
  href: string;
  title: string;
  price: string;
  hint: string;
}

interface Props {
  currentLabel: string;
  currentPrice: string;
  others: Tariff[];
}

export function NextStep({ currentLabel, currentPrice, others }: Props) {
  function scrollToForm() {
    const el = document.getElementById("order-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Что дальше?</h3>

      <button
        type="button"
        onClick={scrollToForm}
        className="w-full px-6 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-5"
      >
        {currentLabel} за {currentPrice}
        <ArrowRight size={18} />
      </button>

      <p className="text-sm text-[var(--muted)] mb-3">
        Или выбери другой формат:
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {others.map((t) => (
          <a
            key={t.href}
            href={t.href}
            className="block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted-bg)] transition-all"
          >
            <div className="text-sm font-semibold mb-1">{t.title}</div>
            <div className="text-xs text-[var(--accent)] mb-1">{t.price}</div>
            <div className="text-xs text-[var(--muted)]">{t.hint}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

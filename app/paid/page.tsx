import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Оплата принята",
  description: "Заявка оплачена, бизнес-план в работе.",
  robots: { index: false, follow: false },
};

export default function PaidPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Спасибо за заказ!</h1>
      <p className="text-[var(--muted)] mb-2 max-w-xl mx-auto">
        Мы получили оплату и взяли заявку в работу. Готовый бизнес-план придёт
        на твой email вместе с электронным чеком.
      </p>
      <p className="text-[var(--muted)] mb-8 max-w-xl mx-auto">
        Если письма не будет в течение 24 часов — проверь папку «Спам» или
        напиши в наш{" "}
        <a
          href="https://t.me/businessplan24_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] underline font-medium"
        >
          Telegram-бот
        </a>
        .
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        ← На главную
      </a>
    </div>
  );
}

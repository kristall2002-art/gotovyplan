"use client";

import { useState } from "react";
import { Tag, Check } from "lucide-react";

interface Props {
  buttonLabel: string;
  basePrice: number;
  tariff: string;
}

export function OrderForm({ buttonLabel, basePrice, tariff }: Props) {
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "applied" | "invalid"
  >("idle");
  const [discountPct, setDiscountPct] = useState(0);

  const finalPrice = Math.round(basePrice * (1 - discountPct / 100));

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    const valid: Record<string, number> = {
      START25: 25,
      LAUNCH50: 50,
      TGCHANNEL: 30,
    };
    if (valid[code]) {
      setDiscountPct(valid[code]);
      setPromoStatus("applied");
    } else if (code.length > 0) {
      setPromoStatus("invalid");
      setDiscountPct(0);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Ваше имя"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <input
          type="text"
          placeholder="Telegram (@username)"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />

        {!showPromo ? (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
          >
            <Tag size={14} /> Есть промокод?
          </button>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoStatus("idle");
                }}
                placeholder="ПРОМОКОД"
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] uppercase tracking-wider text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="px-5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-sm font-medium transition-colors"
              >
                Применить
              </button>
            </div>
            {promoStatus === "applied" && (
              <p className="mt-2 text-xs text-emerald-500 inline-flex items-center gap-1">
                <Check size={14} /> Скидка {discountPct}% применена
              </p>
            )}
            {promoStatus === "invalid" && (
              <p className="mt-2 text-xs text-rose-500">
                Промокод не найден или истёк
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className="w-full px-8 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity"
      >
        {buttonLabel} {finalPrice.toLocaleString("ru-RU")} ₽
        {discountPct > 0 && (
          <span className="ml-2 text-sm opacity-80 line-through">
            {basePrice.toLocaleString("ru-RU")} ₽
          </span>
        )}
      </button>

      <p className="text-xs text-[var(--muted)] text-center mt-3">
        💡 Подпишись на{" "}
        <a
          href="https://t.me/+NxIFCQBuxsA3Mzdi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Telegram-канал
        </a>{" "}
        — там разыгрываем промокоды со скидками до 100%
      </p>

      <input type="hidden" name="tariff" value={tariff} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Tag, Check, Loader2 } from "lucide-react";
import { createOrder, createPayment } from "@/lib/api";

interface Props {
  buttonLabel: string;
  basePrice: number;
  tariff: "quick" | "soc" | "full" | "pro" | "other";
  idea?: string;
}

const PROMOS: Record<string, number> = {
  START25: 25,
  LAUNCH50: 50,
  TGCHANNEL: 30,
};

const OWNER_CODE = "BP24-OWNER";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function OrderForm({ buttonLabel, basePrice, tariff, idea }: Props) {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "applied" | "invalid">("idle");
  const [discountPct, setDiscountPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalPrice = Math.round(basePrice * (1 - discountPct / 100));

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (code === OWNER_CODE) {
      setDiscountPct(100);
      setPromoStatus("applied");
      return;
    }
    if (PROMOS[code]) {
      setDiscountPct(PROMOS[code]);
      setPromoStatus("applied");
    } else if (code.length > 0) {
      setPromoStatus("invalid");
      setDiscountPct(0);
    }
  }

  async function submit() {
    setError(null);
    if (!name.trim()) {
      setError("Укажи имя — как к тебе обращаться.");
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setError("Email нужен для отправки чека и плана. Проверь формат.");
      return;
    }
    // Авто-применение если код введён но забыли нажать «Применить»
    const typedCode = promoCode.trim().toUpperCase();
    let effectiveDiscount = discountPct;
    if (promoStatus !== "applied" && typedCode) {
      if (typedCode === OWNER_CODE) {
        effectiveDiscount = 100;
        setDiscountPct(100);
        setPromoStatus("applied");
      } else if (PROMOS[typedCode]) {
        effectiveDiscount = PROMOS[typedCode];
        setDiscountPct(PROMOS[typedCode]);
        setPromoStatus("applied");
      }
    }
    const code = (promoStatus === "applied" || effectiveDiscount > 0) ? typedCode : undefined;
    const isOwner = code === OWNER_CODE;
    const effectiveFinalPrice = Math.round(basePrice * (1 - effectiveDiscount / 100));

    setSubmitting(true);
    try {
      const order = await createOrder({
        tariff,
        name: name.trim(),
        telegram: telegram.trim() || undefined,
        email: email.trim(),
        promo_code: code,
        discount_pct: effectiveDiscount,
        base_price: basePrice,
        final_price: isOwner ? 0 : effectiveFinalPrice,
        idea: idea?.trim() || undefined,
        notes: isOwner ? "owner test order — bypass payment" : undefined,
      });
      if (isOwner) {
        window.location.href = "/paid";
        return;
      }
      const payment = await createPayment(order.id);
      window.location.href = payment.confirmation_url;
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div
      id="order-form"
      className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 scroll-mt-24"
    >
      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <input
          type="text"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="Telegram (@username) — необязательно"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email — обязательно для чека и плана"
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
                onBlur={applyPromo}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPromo();
                  }
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

      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="w-full px-8 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Готовим оплату…
          </>
        ) : (
          <>
            {buttonLabel} {finalPrice.toLocaleString("ru-RU")} ₽
            {discountPct > 0 && (
              <span className="ml-2 text-sm opacity-80 line-through">
                {basePrice.toLocaleString("ru-RU")} ₽
              </span>
            )}
          </>
        )}
      </button>

      <p className="text-xs text-[var(--muted)] text-center mt-3">
        Оплата через ЮKassa: карта, СБП, SberPay, YandexPay. Чек на email.
      </p>

      <p className="text-xs text-[var(--muted)] text-center mt-2">
        Нажимая кнопку, ты подтверждаешь согласие с{" "}
        <a href="/offer" className="underline hover:text-[var(--accent)]">
          офертой
        </a>{" "}
        и{" "}
        <a href="/privacy" className="underline hover:text-[var(--accent)]">
          обработкой персональных данных
        </a>
        .
      </p>

      <p className="text-xs text-[var(--muted)] text-center mt-3">
        Подпишись на{" "}
        <a
          href="https://t.me/+NxIFCQBuxsA3Mzdi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Telegram-канал
        </a>{" "}
        — там разыгрываем промокоды со скидками до 100%.
      </p>
    </div>
  );
}

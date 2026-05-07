"use client";

import { useState } from "react";
import { ArrowRight, KeyRound, Loader2, Mail, Lock, ChevronRight } from "lucide-react";
import { upgradeRequest, upgradeVerify } from "@/lib/api";

const TARGETS = [
  { value: "quick", label: "Быстрый расчёт", price: 990 },
  { value: "soc", label: "Соцконтракт", price: 3990 },
  { value: "full", label: "Полный план", price: 14990 },
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function UpgradePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState("full");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode() {
    setError(null);
    const id = parseInt(orderId.trim(), 10);
    if (!Number.isFinite(id) || id < 1) {
      setError("Номер заказа должен быть числом — он пришёл в письме после оплаты.");
      return;
    }
    if (!isEmail(email)) {
      setError("Email указан некорректно.");
      return;
    }
    setSubmitting(true);
    try {
      await upgradeRequest(id, email.trim(), target);
      setStep(2);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("404")) setError("Не нашли заказ с таким номером. Проверь номер.");
      else if (msg.includes("403")) setError("Email не совпадает с тем, что был при заказе.");
      else if (msg.includes("400")) setError("Этот тариф уже открыт или ниже текущего. Выбери выше.");
      else setError(`Ошибка: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyAndPay() {
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Код — 6 цифр из письма.");
      return;
    }
    const id = parseInt(orderId.trim(), 10);
    setSubmitting(true);
    try {
      const result = await upgradeVerify(id, code.trim(), target);
      window.location.href = result.confirmation_url;
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("403")) setError("Код неверный — проверь письмо.");
      else if (msg.includes("400") && msg.includes("expired")) setError("Код устарел. Запроси новый.");
      else if (msg.includes("400")) setError("Не получилось продолжить. Запроси код заново.");
      else setError(`Ошибка: ${msg}`);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Открыть полный план</h1>
      <p className="text-[var(--muted)] mb-8">
        Если ты уже заказывал план у нас — введи номер заказа и email, чтобы перейти на старший тариф.
        Цифры и анализ останутся теми же — мы откроем закрытые страницы того же документа.
      </p>

      <div className="flex items-center gap-2 mb-8 text-sm">
        <span
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            step === 1 ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--muted-bg)] text-[var(--muted)]"
          }`}
        >
          <span className="font-bold">1</span> Заказ + email
        </span>
        <ChevronRight size={16} className="text-[var(--muted)]" />
        <span
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            step === 2 ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--muted-bg)] text-[var(--muted)]"
          }`}
        >
          <span className="font-bold">2</span> Код из письма
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <KeyRound size={14} className="text-[var(--accent)]" /> Номер заказа
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Например, 42"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                Номер пришёл на email после первого заказа.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Mail size={14} className="text-[var(--accent)]" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Тот же, что был при заказе"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                Хочу открыть тариф
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TARGETS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTarget(t.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      target === t.value
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-xs opacity-80 mt-1">{t.price.toLocaleString("ru-RU")} ₽</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={requestCode}
              disabled={submitting}
              className="w-full px-6 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Отправляем код…</> : <>Получить код на email <ArrowRight size={18} /></>}
            </button>
          </>
        ) : (
          <>
            <div className="px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
              Отправили 6-значный код на <strong>{email}</strong>. Письмо может прийти за 1-2 минуты.
              Если не видишь — проверь «Спам».
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Lock size={14} className="text-[var(--accent)]" /> Код из письма
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] text-center text-2xl tracking-widest font-mono placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={verifyAndPay}
              disabled={submitting || code.length !== 6}
              className="w-full px-6 py-4 rounded-xl bg-[var(--accent)] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Готовим оплату…</> : <>Перейти к оплате разницы <ArrowRight size={18} /></>}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setCode(""); setError(null); }}
              className="w-full text-center text-sm text-[var(--muted)] hover:text-[var(--accent)]"
            >
              ← Назад
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-[var(--muted)] text-center mt-6">
        После оплаты мы переотправим тебе тот же план — с уже открытыми страницами того тарифа.
        Цифры и расчёты не пересчитываются.
      </p>
    </div>
  );
}

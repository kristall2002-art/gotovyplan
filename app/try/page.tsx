"use client";

import { useState } from "react";
import { IdeaInput } from "@/components/IdeaInput";
import { ContactPicker, type ContactType } from "@/components/ContactPicker";
import { createOrder, uploadAttachment } from "@/lib/api";
import { Gift, MapPin, Scale, AlertTriangle, Loader2 } from "lucide-react";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidTelegram(v: string) {
  return /^@?[A-Za-z0-9_]{4,32}$/.test(v.trim());
}

export default function TryPage() {
  const [idea, setIdea] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [contactType, setContactType] = useState<ContactType>("telegram");
  const [contactValue, setContactValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (!idea.trim() || idea.trim().length < 10) {
      setError("Расскажи идею подробнее — минимум 10 символов.");
      return;
    }
    if (!contactValue.trim()) {
      setError(
        contactType === "telegram"
          ? "Укажи Telegram-username, чтобы прислать бизнес-план."
          : "Укажи email, чтобы прислать бизнес-план."
      );
      return;
    }
    if (contactType === "telegram" && !isValidTelegram(contactValue)) {
      setError("Telegram-username должен быть 4–32 символа, латиница, цифры, _.");
      return;
    }
    if (contactType === "email" && !isValidEmail(contactValue)) {
      setError("Email выглядит некорректно — проверь.");
      return;
    }

    setSubmitting(true);
    try {
      const tg =
        contactType === "telegram"
          ? contactValue.startsWith("@")
            ? contactValue
            : "@" + contactValue.trim()
          : undefined;
      const em = contactType === "email" ? contactValue.trim() : undefined;
      const order = await createOrder({
        tariff: "try",
        idea: idea.trim(),
        telegram: tg,
        email: em,
        base_price: 0,
        final_price: 0,
      });
      if (file) {
        await uploadAttachment(order.id, file);
      }
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mb-6">
          <Gift size={40} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Идея принята!</h1>
        <p className="text-[var(--muted)] mb-2 max-w-xl mx-auto">
          Сейчас собираем бесплатный бизнес-план — юридическую чистку, карту
          конкурентов и топ-3 риска.
        </p>
        <p className="text-[var(--muted)] mb-8 max-w-xl mx-auto">
          Это займёт 1–3 минуты. Готовый план придёт{" "}
          <strong className="text-[var(--foreground)]">
            {contactType === "telegram"
              ? `в Telegram на ${contactValue.startsWith("@") ? contactValue : "@" + contactValue}`
              : `на email ${contactValue}`}
          </strong>
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
        <Gift size={14} /> Бесплатно
      </span>
      <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
        Попробуй бесплатно
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Расскажи свою идею — голосом или текстом — и получи короткий бизнес-план
        бесплатно. Без обязательств, без оплаты, без ввода карты. Подойдёт,
        чтобы понять — есть ли вообще смысл копать дальше.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Что будет в бизнес-плане</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] grid place-items-center">
              <Scale size={20} />
            </div>
            <div>
              <div className="font-semibold mb-1">
                Можно ли это вообще делать
              </div>
              <p className="text-sm text-[var(--muted)]">
                Подходящие ОКВЭД-коды, нужны ли лицензии и разрешения,
                ограничения по локации, доступные налоговые режимы (УСН, ПСН,
                НПД).
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] grid place-items-center">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-semibold mb-1">
                Карта конкурентов в радиусе 500 м
              </div>
              <p className="text-sm text-[var(--muted)]">
                Точка на карте, ближайшие конкуренты с адресами, счётчик «N
                штук рядом». Чтобы сразу видеть — место занято или ещё нет.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] grid place-items-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="font-semibold mb-1">Топ-3 риска</div>
              <p className="text-sm text-[var(--muted)]">
                Главные опасности именно для этой идеи. Без оценок и
                вероятностей — это в платных тарифах. Просто факт «вот что
                может пойти не так».
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[var(--border)] text-sm text-[var(--muted)]">
          <strong className="text-[var(--foreground)]">
            Чего нет в пробнике:
          </strong>{" "}
          расчёта окупаемости, выбора оптимального налога, оценки выручки,
          Excel-финмодели, маркетинг-плана. Это всё в платных тарифах от 990 ₽.
        </div>
      </div>

      <IdeaInput value={idea} onChange={setIdea} onFileChange={setFile} />

      <ContactPicker
        type={contactType}
        value={contactValue}
        onTypeChange={setContactType}
        onValueChange={setContactValue}
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="w-full px-8 py-5 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-wait"
        style={{ boxShadow: "0 0 30px rgba(14,165,233,0.35)" }}
      >
        {submitting ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Отправляем…
          </>
        ) : (
          <>
            <Gift size={20} /> Получить бизнес-план бесплатно
          </>
        )}
      </button>

      <p className="text-xs text-[var(--muted)] text-center mt-4">
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

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-sm text-[var(--muted)] mb-4">
          Уже понятно, что нужно глубже? Сразу выбери формат:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/quick"
            className="block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted-bg)] transition-all"
          >
            <div className="text-sm font-semibold mb-1">Быстрый расчёт</div>
            <div className="text-xs text-[var(--accent)] mb-1">990 ₽</div>
            <div className="text-xs text-[var(--muted)]">PDF, 5–7 страниц</div>
          </a>
          <a
            href="/soc"
            className="block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted-bg)] transition-all"
          >
            <div className="text-sm font-semibold mb-1">Соцконтракт</div>
            <div className="text-xs text-[var(--accent)] mb-1">3 990 ₽</div>
            <div className="text-xs text-[var(--muted)]">
              Под комиссию соцзащиты
            </div>
          </a>
          <a
            href="/full"
            className="block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted-bg)] transition-all"
          >
            <div className="text-sm font-semibold mb-1">Полный план</div>
            <div className="text-xs text-[var(--accent)] mb-1">от 14 990 ₽</div>
            <div className="text-xs text-[var(--muted)]">
              30–40 страниц + Excel
            </div>
          </a>
          <a
            href="/pro"
            className="block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted-bg)] transition-all"
          >
            <div className="text-sm font-semibold mb-1">Конструктор Pro</div>
            <div className="text-xs text-[var(--accent)] mb-1">
              от 9 990 ₽/мес
            </div>
            <div className="text-xs text-[var(--muted)]">
              Для консультантов
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

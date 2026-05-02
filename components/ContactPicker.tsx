"use client";

import { Send, Mail } from "lucide-react";

export type ContactType = "telegram" | "email";

interface Props {
  type: ContactType;
  value: string;
  onTypeChange: (t: ContactType) => void;
  onValueChange: (v: string) => void;
}

export function ContactPicker({ type, value, onTypeChange, onValueChange }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Куда прислать бизнес-план?</h3>
      <p className="text-sm text-[var(--muted)] mb-4">
        Выбери способ связи и укажи контакт. Туда придёт готовый план.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => onTypeChange("telegram")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
            type === "telegram"
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          <Send size={18} /> Telegram
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("email")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
            type === "email"
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          <Mail size={18} /> Email
        </button>
      </div>

      {type === "telegram" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="@username"
          inputMode="text"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      ) : (
        <input
          type="email"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="you@example.com"
          inputMode="email"
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      )}
    </div>
  );
}

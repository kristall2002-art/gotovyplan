"use client";

import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { WhisperRecorder } from "@/components/WhisperRecorder";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onFileChange?: (file: File | null) => void;
}

export function IdeaInput({ value, onChange, onFileChange }: Props) {
  const [file, setFile] = useState<File | null>(null);

  function appendTranscript(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;
    const base = value.trim();
    onChange(base ? `${base} ${cleaned}` : cleaned);
  }

  function onFile(f: File | null) {
    setFile(f);
    onFileChange?.(f);
  }

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Расскажи свою идею</h3>
      <p className="text-sm text-[var(--muted)] mb-4">
        Нажми на микрофон и наговори, или напиши текстом, или приложи файл.
        Распознавание работает прямо в твоём браузере — аудио никуда не отправляется.
      </p>

      <div className="flex justify-center mb-4">
        <WhisperRecorder onText={appendTranscript} />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Опиши: что хочешь делать, кто покупатель, чем отличаешься от конкурентов, есть ли уже опыт в этой нише…"
        className="w-full px-4 py-3 mb-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] resize-y min-h-[320px]"
      />

      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-sm font-medium transition-colors cursor-pointer">
          <Paperclip size={16} />
          Приложить файл
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.rtf,.odt,image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--muted-bg)] text-sm">
            {file.name}
            <button
              type="button"
              onClick={() => onFile(null)}
              aria-label="Удалить файл"
              className="text-[var(--muted)] hover:text-rose-500"
            >
              <X size={14} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

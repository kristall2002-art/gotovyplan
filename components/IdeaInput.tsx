"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Paperclip, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onFileChange?: (file: File | null) => void;
}

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: { new (): SR };
    webkitSpeechRecognition?: { new (): SR };
  }
}

export function IdeaInput({ value, onChange, onFileChange }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const recRef = useRef<SR | null>(null);
  // Текст до начала записи (то что уже было в textarea).
  const prefixRef = useRef<string>("");
  // Накопленный финальный распознанный текст за текущую сессию.
  const finalRef = useRef<string>("");
  // До какого индекса в e.results мы уже подняли final.
  const finalIdxRef = useRef<number>(0);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) setSupported(false);
  }, []);

  function start() {
    setError(null);
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }

    const rec = new Ctor();
    rec.lang = "ru-RU";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    prefixRef.current = value ? value.replace(/\s+$/, "") + " " : "";
    finalRef.current = "";
    finalIdxRef.current = 0;

    rec.onresult = (e) => {
      // Каждое событие приносит весь массив results с начала сессии.
      // resultIndex — индекс первого результата, который изменился в этом событии.
      // Считаем интерим из всего массива (последний интерим всегда актуален).
      // Final аккумулируем только раз — отслеживая finalIdxRef.
      let interim = "";
      const len = e.results.length;
      for (let i = 0; i < len; i++) {
        const r = e.results[i];
        const t = r[0].transcript;
        if (r.isFinal) {
          if (i >= finalIdxRef.current) {
            finalRef.current += t;
            finalIdxRef.current = i + 1;
          }
        } else {
          interim += t;
        }
      }
      onChange(prefixRef.current + finalRef.current + interim);
    };

    rec.onerror = (ev) => {
      if (ev.error === "no-speech" || ev.error === "aborted") return;
      setError(`Ошибка распознавания: ${ev.error}`);
    };

    rec.onend = () => {
      // Очищаем хвостовой interim — оставляем только final.
      onChange(prefixRef.current + finalRef.current);
      setRecording(false);
    };

    recRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch (err) {
      setError(`Не удалось включить микрофон: ${(err as Error).message}`);
    }
  }

  function stop() {
    const r = recRef.current;
    recRef.current = null;
    if (r) {
      r.stop();
    }
    setRecording(false);
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
      </p>

      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={recording ? stop : start}
          disabled={!supported}
          aria-label={recording ? "Остановить запись" : "Начать запись"}
          className={`w-20 h-20 rounded-full grid place-items-center text-white transition-all ${
            recording
              ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
              : "bg-[var(--accent)] hover:opacity-90 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
          style={
            recording
              ? { boxShadow: "0 0 30px rgba(244,63,94,0.55)" }
              : { boxShadow: "0 0 25px rgba(14,165,233,0.4)" }
          }
        >
          {recording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Опиши: что хочешь делать, в каком городе, какой бюджет, кто покупатель…"
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

      {recording && (
        <p className="mt-3 text-xs text-rose-500">
          ● Запись идёт. Говори в микрофон. Текст появляется в поле справа.
        </p>
      )}
      {!supported && (
        <p className="mt-3 text-xs text-amber-500">
          Голосовой ввод не поддерживается в этом браузере. Используй Chrome / Edge / Yandex.Browser, или просто напиши текстом.
        </p>
      )}
      {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

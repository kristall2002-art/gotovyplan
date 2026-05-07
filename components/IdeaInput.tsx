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
  const wantRef = useRef<boolean>(false);
  const prefixRef = useRef<string>("");
  const restartTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) setSupported(false);
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, []);

  function buildRecognition(): SR | null {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return null;
    }
    const rec = new Ctor();
    rec.lang = "ru-RU";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      // В continuous-режиме e.results содержит весь массив с начала сессии.
      // Берём целиком — без ручной аккумуляции, без рисков пропуска и дублей.
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      onChange(prefixRef.current + text);
    };

    rec.onerror = (ev) => {
      if (ev.error === "aborted" || ev.error === "no-speech") return;
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        wantRef.current = false;
        setError("Доступ к микрофону запрещён. Разреши в настройках сайта и перезагрузи страницу.");
        setRecording(false);
        return;
      }
      if (ev.error === "audio-capture") {
        wantRef.current = false;
        setError("Микрофон не найден. Проверь, подключён ли он.");
        setRecording(false);
        return;
      }
      if (ev.error === "network") {
        setError("Нет связи с сервером распознавания. Проверь интернет.");
        return;
      }
      setError(`Ошибка распознавания: ${ev.error}`);
    };

    rec.onend = () => {
      // Continuous-режим иногда сам закрывается на длинных паузах — авто-перезапуск
      // с фрешем prefixRef, чтобы текущий распознанный текст стал «уже введённым».
      if (wantRef.current) {
        const currentValue = (prefixRef.current ? prefixRef.current : "") + value;
        prefixRef.current = currentValue ? currentValue.replace(/\s+$/, "") + " " : "";
        restartTimerRef.current = window.setTimeout(() => {
          if (!wantRef.current) return;
          const fresh = buildRecognition();
          if (fresh) {
            recRef.current = fresh;
            try {
              fresh.start();
            } catch {
              // ignore double-start
            }
          }
        }, 200);
      } else {
        setRecording(false);
      }
    };

    return rec;
  }

  function start() {
    setError(null);
    if (!window.isSecureContext && location.hostname !== "localhost") {
      setError("Микрофон работает только на HTTPS-сайтах.");
      return;
    }

    prefixRef.current = value ? value.replace(/\s+$/, "") + " " : "";
    wantRef.current = true;

    const rec = buildRecognition();
    if (!rec) return;
    recRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch (err) {
      setError(`Не удалось включить микрофон: ${(err as Error).message}`);
    }
  }

  function stop() {
    wantRef.current = false;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    const r = recRef.current;
    recRef.current = null;
    if (r) r.stop();
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
          ● Запись идёт. Говори в микрофон. Текст появляется ниже.
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

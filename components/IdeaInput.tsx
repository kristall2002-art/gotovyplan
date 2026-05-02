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
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
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
  const baseTextRef = useRef<string>("");

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
    }
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
    baseTextRef.current = value ? value + " " : "";

    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) baseTextRef.current += final;
      onChange((baseTextRef.current + interim).trimStart());
    };
    rec.onerror = (e) => {
      setError(`Ошибка распознавания: ${e.error}`);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);

    recRef.current = rec;
    rec.start();
    setRecording(true);
  }

  function stop() {
    recRef.current?.stop();
    recRef.current = null;
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

      <div className="flex gap-3 items-start mb-3">
        <button
          type="button"
          onClick={recording ? stop : start}
          disabled={!supported}
          aria-label={recording ? "Остановить запись" : "Начать запись"}
          className={`shrink-0 w-14 h-14 rounded-full grid place-items-center text-white transition-all ${
            recording
              ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
              : "bg-[var(--accent)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
          style={
            recording
              ? { boxShadow: "0 0 20px rgba(244,63,94,0.5)" }
              : undefined
          }
        >
          {recording ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="Опиши: что хочешь делать, в каком городе, какой бюджет, кто покупатель…"
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] resize-y min-h-[120px]"
        />
      </div>

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

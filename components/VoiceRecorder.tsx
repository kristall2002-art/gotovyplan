"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2, AlertTriangle } from "lucide-react";
import { transcribeAudio } from "@/lib/api";

type Phase = "idle" | "recording" | "transcribing" | "error";

interface Props {
  onText: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onText, disabled }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    };
  }, []);

  function showTransientError(msg: string) {
    setPhase("error");
    setError(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setPhase("idle");
      setError(null);
      errorTimeoutRef.current = null;
    }, 4000);
  }

  async function start() {
    if (disabled) return;
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setError(null);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
        MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = handleStop;
      rec.start();
      setPhase("recording");
    } catch (e) {
      setPhase("error");
      const msg = (e as Error).message || String(e);
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setError("Доступ к микрофону запрещён. Разреши в настройках сайта и обнови страницу.");
      } else if (msg.includes("NotFound") || msg.includes("audio-capture")) {
        setError("Микрофон не найден. Проверь, подключён ли он.");
      } else {
        setError(`Ошибка: ${msg}`);
      }
    } finally {
      isStartingRef.current = false;
    }
  }

  function stop() {
    const rec = mediaRecRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecRef.current = null;
  }

  async function handleStop() {
    setPhase("transcribing");
    try {
      const type = chunksRef.current[0]?.type || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      if (blob.size < 2000) {
        setPhase("idle");
        return;
      }
      const { text } = await transcribeAudio(blob);
      if (!text || !text.trim()) {
        showTransientError("Не удалось разобрать речь — попробуй ещё раз громче и чётче.");
        return;
      }
      onText(text);
      setPhase("idle");
    } catch (e) {
      const err = e as Error;
      const msg = err?.message || String(e);
      if (e instanceof TypeError || msg.includes("Failed to fetch")) {
        setPhase("error");
        setError("Нет связи с сервером — проверь интернет и попробуй снова.");
      } else {
        setPhase("error");
        setError(`Не получилось распознать: ${msg}`);
      }
    }
  }

  const isRecording = phase === "recording";
  const isTranscribing = phase === "transcribing";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={isRecording ? stop : start}
        disabled={isTranscribing || disabled}
        aria-label={isRecording ? "Остановить запись" : "Начать запись"}
        className={`w-20 h-20 rounded-full grid place-items-center text-white transition-all ${
          isRecording
            ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
            : "bg-[var(--accent)] hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
        }`}
        style={
          isRecording
            ? { boxShadow: "0 0 30px rgba(244,63,94,0.55)" }
            : { boxShadow: "0 0 25px rgba(14,165,233,0.4)" }
        }
      >
        {isTranscribing ? <Loader2 size={28} className="animate-spin" /> :
         isRecording ? <MicOff size={32} /> : <Mic size={32} />}
      </button>

      {isRecording && (
        <p className="text-xs text-rose-500">● Идёт запись. Говори, потом нажми ещё раз — расшифруем.</p>
      )}
      {isTranscribing && (
        <p className="text-xs text-[var(--muted)]">Распознаём речь…</p>
      )}
      {error && (
        <p className="text-xs text-rose-500 inline-flex items-center gap-1.5">
          <AlertTriangle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

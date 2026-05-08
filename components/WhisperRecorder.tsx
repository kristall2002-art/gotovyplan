"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Download, Loader2, AlertTriangle } from "lucide-react";

const MODEL = "Xenova/whisper-tiny";
const MODEL_DTYPE = "fp16";
const LOCAL_MODEL_PATH = "/gotovyplan/whisper/";
const TARGET_SR = 16000;

type Phase = "idle" | "loading" | "ready" | "recording" | "transcribing" | "error";

interface Props {
  onText: (text: string) => void;
  disabled?: boolean;
}

interface ProgressEvent {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export function WhisperRecorder({ onText, disabled }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [progressLabel, setProgressLabel] = useState<string>("");

  const transcriberRef = useRef<unknown>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function ensureModel() {
    if (transcriberRef.current) return;
    setPhase("loading");
    setProgress(0);
    setProgressLabel("Подключаемся к модели…");

    const tx = (await import("@huggingface/transformers")) as unknown as {
      pipeline: (task: string, model: string, opts: Record<string, unknown>) => Promise<unknown>;
      env: {
        allowLocalModels: boolean;
        allowRemoteModels: boolean;
        localModelPath: string;
      };
    };
    tx.env.allowLocalModels = true;
    tx.env.allowRemoteModels = false;
    tx.env.localModelPath = LOCAL_MODEL_PATH;

    transcriberRef.current = await tx.pipeline("automatic-speech-recognition", MODEL, {
      dtype: MODEL_DTYPE,
      progress_callback: (data: ProgressEvent) => {
        if (data.status === "progress") {
          if (typeof data.progress === "number") {
            setProgress(Math.round(data.progress));
          } else if (data.loaded && data.total) {
            setProgress(Math.round((data.loaded / data.total) * 100));
          }
          if (data.file) setProgressLabel(`Загружаем модель распознавания… ${data.file}`);
        } else if (data.status === "ready") {
          setProgressLabel("Модель готова");
        } else if (data.status === "download" && data.file) {
          setProgressLabel(`Скачиваем ${data.file}…`);
        }
      },
    });
  }

  async function decodeAudio(blob: Blob): Promise<Float32Array> {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
    const ctx = new AC({ sampleRate: TARGET_SR });
    try {
      const buf = await blob.arrayBuffer();
      const decoded = await ctx.decodeAudioData(buf.slice(0));
      if (decoded.numberOfChannels === 1 && decoded.sampleRate === TARGET_SR) {
        return decoded.getChannelData(0);
      }
      const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * TARGET_SR), TARGET_SR);
      const src = offline.createBufferSource();
      src.buffer = decoded;
      src.connect(offline.destination);
      src.start();
      const rendered = await offline.startRendering();
      return rendered.getChannelData(0);
    } finally {
      try { await ctx.close(); } catch {}
    }
  }

  async function start() {
    setError(null);
    if (disabled) return;
    try {
      await ensureModel();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
        MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" :
        "";
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
    setProgressLabel("Распознаём речь…");
    try {
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" });
      if (blob.size < 2000) {
        setPhase("ready");
        return;
      }
      const audio = await decodeAudio(blob);
      const transcriber = transcriberRef.current as (audio: Float32Array, opts: Record<string, unknown>) => Promise<{ text: string }>;
      const result = await transcriber(audio, {
        language: "russian",
        task: "transcribe",
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false,
      });
      const text = (result.text || "").trim();
      if (text) onText(text);
      setPhase("ready");
    } catch (e) {
      setPhase("error");
      setError(`Не получилось распознать: ${(e as Error).message}`);
    }
  }

  const isLoading = phase === "loading";
  const isRecording = phase === "recording";
  const isTranscribing = phase === "transcribing";
  const canRecord = phase === "idle" || phase === "ready" || phase === "error";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={isRecording ? stop : start}
        disabled={isLoading || isTranscribing || disabled}
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
        {isLoading ? <Download size={28} className="animate-pulse" /> :
         isTranscribing ? <Loader2 size={28} className="animate-spin" /> :
         isRecording ? <MicOff size={32} /> : <Mic size={32} />}
      </button>

      {isLoading && (
        <div className="w-full max-w-md">
          <p className="text-xs text-center text-[var(--muted)] mb-2">
            {progressLabel || "Загружаем модель распознавания (один раз ≈190 МБ)"}
          </p>
          <div className="w-full h-2 rounded-full bg-[var(--muted-bg)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-[var(--muted)] mt-1">{progress}%</p>
        </div>
      )}

      {isRecording && (
        <p className="text-xs text-rose-500">● Идёт запись. Говори, потом нажми ещё раз — расшифруем.</p>
      )}
      {isTranscribing && (
        <p className="text-xs text-[var(--muted)]">Распознаём речь… (несколько секунд)</p>
      )}
      {error && (
        <p className="text-xs text-rose-500 inline-flex items-center gap-1.5">
          <AlertTriangle size={14} /> {error}
        </p>
      )}
      {phase === "ready" && (
        <p className="text-xs text-emerald-500">✓ Готово. Текст добавлен ниже — можешь дополнить.</p>
      )}
    </div>
  );
}

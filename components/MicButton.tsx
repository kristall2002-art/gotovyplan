"use client";

import { Mic } from "lucide-react";
import { useState } from "react";

export function MicButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="relative grid place-items-center">
      <span
        className="absolute w-44 h-44 rounded-full border border-[var(--accent)] opacity-40 pointer-events-none"
        style={{ animation: "ring-pulse 2.4s ease-out infinite" }}
      />
      <span
        className="absolute w-44 h-44 rounded-full border border-[var(--accent)] opacity-40 pointer-events-none"
        style={{ animation: "ring-pulse 2.4s ease-out 1.2s infinite" }}
      />
      <button
        type="button"
        aria-label="Записать идею голосом"
        onClick={() => setPressed((v) => !v)}
        className="relative grid place-items-center w-44 h-44 rounded-full text-white shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.98]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0ea5e9 40%, #1d4ed8 100%)",
          boxShadow:
            "0 0 60px rgba(14,165,233,0.45), inset 0 0 40px rgba(255,255,255,0.1)",
          animation: "mic-pulse 2.4s ease-in-out infinite",
        }}
      >
        <Mic size={56} strokeWidth={2.2} />
      </button>
      <p className="mt-6 text-sm text-[var(--muted)] max-w-xs text-center">
        {pressed
          ? "Запись идёт... (демо: подключим Web Speech API)"
          : "Нажми и расскажи свою идею голосом"}
      </p>
    </div>
  );
}

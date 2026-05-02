"use client";

import { Mic } from "lucide-react";
import Link from "next/link";

export function MicButton() {
  return (
    <div className="flex flex-col items-center">
      <span className="px-4 py-1.5 mb-6 text-sm font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
        Попробовать бесплатно
      </span>

      <div className="relative w-44 h-44 grid place-items-center">
        <span
          className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full border-2 border-[var(--accent)] pointer-events-none"
          style={{ animation: "ring-pulse 2.6s ease-out infinite" }}
        />
        <span
          className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full border-2 border-[var(--accent)] pointer-events-none"
          style={{ animation: "ring-pulse 2.6s ease-out 0.87s infinite" }}
        />
        <span
          className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full border-2 border-[var(--accent)] pointer-events-none"
          style={{ animation: "ring-pulse 2.6s ease-out 1.73s infinite" }}
        />
        <Link
          href="/try"
          aria-label="Попробовать бесплатно — рассказать идею голосом"
          className="relative grid place-items-center w-44 h-44 rounded-full text-white shadow-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0ea5e9 40%, #1d4ed8 100%)",
            boxShadow:
              "0 0 60px rgba(14,165,233,0.45), inset 0 0 40px rgba(255,255,255,0.1)",
            animation: "mic-pulse 2.4s ease-in-out infinite",
          }}
        >
          <Mic size={56} strokeWidth={2.2} />
        </Link>
      </div>

      <p className="mt-6 text-sm text-[var(--muted)] max-w-xs text-center">
        Нажми на микрофон — расскажи идею голосом и получи бесплатный отчёт
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[120px] h-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Переключить тему"
      className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
    >
      {isDark ? <Moon size={15} /> : <Sun size={15} />}
      <span>{isDark ? "Тёмная" : "Светлая"}</span>
    </button>
  );
}

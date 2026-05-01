import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SocialLinks } from "./SocialLinks";

const nav = [
  { href: "/quick", label: "Быстрый расчёт" },
  { href: "/soc", label: "Соцконтракт" },
  { href: "/pro", label: "Конструктор" },
  { href: "/full", label: "Полный план" },
  { href: "/reviews", label: "Отзывы" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/70 border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--accent)] text-white font-bold text-sm">
            БП
          </span>
          <span className="text-lg">БП24</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[var(--foreground)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SocialLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

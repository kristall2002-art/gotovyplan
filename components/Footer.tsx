export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-1">
          <div>© {new Date().getFullYear()} БП24 — готовый бизнес-план онлайн</div>
          <a href="mailto:bp24info@mail.ru" className="hover:text-[var(--foreground)]">
            bp24info@mail.ru
          </a>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[var(--foreground)]">
            Договор-оферта
          </a>
          <a href="#" className="hover:text-[var(--foreground)]">
            Политика
          </a>
          <a href="mailto:bp24info@mail.ru" className="hover:text-[var(--foreground)]">
            Контакты
          </a>
        </div>
      </div>
    </footer>
  );
}

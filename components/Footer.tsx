export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-6 text-sm text-[var(--muted)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div>© {new Date().getFullYear()} БП24 — готовый бизнес-план онлайн</div>
            <a href="mailto:bp24info@mail.ru" className="hover:text-[var(--foreground)]">
              bp24info@mail.ru
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/offer" className="hover:text-[var(--foreground)]">
              Оферта
            </a>
            <a href="/privacy" className="hover:text-[var(--foreground)]">
              Политика конфиденциальности
            </a>
            <a href="/consent" className="hover:text-[var(--foreground)]">
              Согласие на обработку ПД
            </a>
            <a href="mailto:bp24info@mail.ru" className="hover:text-[var(--foreground)]">
              Контакты
            </a>
          </div>
        </div>
        <div className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
          ИП Золотарев Юрий Николаевич · ИНН 183474446770 · АУСН
        </div>
      </div>
    </footer>
  );
}

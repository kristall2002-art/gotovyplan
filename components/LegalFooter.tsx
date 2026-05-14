type LegalFooterProps = {
  current: "offer" | "privacy" | "consent";
};

const DOCS = {
  offer: { href: "/offer", label: "Публичная оферта" },
  privacy: { href: "/privacy", label: "Политика конфиденциальности" },
  consent: { href: "/consent", label: "Согласие на обработку персональных данных" },
} as const;

export function LegalFooter({ current }: LegalFooterProps) {
  const others = (Object.keys(DOCS) as (keyof typeof DOCS)[]).filter((k) => k !== current);
  return (
    <div className="legal-footer">
      <p>
        <strong>Контакты по документам:</strong>{" "}
        <a href="mailto:bp24info@mail.ru">bp24info@mail.ru</a>
      </p>
      <p>
        ИП Золотарев Юрий Николаевич · ИНН 183474446770 · АУСН
      </p>
      <p style={{ marginTop: "0.75rem" }}>
        Связанные документы:{" "}
        {others.map((k, i) => (
          <span key={k}>
            <a href={DOCS[k].href}>{DOCS[k].label}</a>
            {i < others.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>
    </div>
  );
}

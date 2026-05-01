interface Review {
  name: string;
  handle: string;
  source: "Telegram" | "ВКонтакте" | "Profi.ru" | "Avito" | "Otzovik";
  time: string;
  text: string;
  reactions?: { emoji: string; count: number }[];
  avatarColor: string;
}

const sourceColors: Record<Review["source"], string> = {
  Telegram: "bg-[#229ED9] text-white",
  ВКонтакте: "bg-[#0077ff] text-white",
  "Profi.ru": "bg-[#a166ff] text-white",
  Avito: "bg-[#00a046] text-white",
  Otzovik: "bg-[#f57c00] text-white",
};

export function ReviewBubble({ review }: { review: Review }) {
  const initial = review.name.charAt(0);

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 break-inside-avoid mb-5">
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-11 h-11 rounded-full grid place-items-center text-white font-semibold text-base"
          style={{ background: review.avatarColor }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="font-semibold text-sm truncate">{review.name}</div>
            <span
              className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${sourceColors[review.source]}`}
            >
              {review.source}
            </span>
          </div>
          <div className="text-xs text-[var(--muted)] mb-3">
            {review.handle} · {review.time}
          </div>

          <div className="rounded-xl rounded-tl-sm bg-[var(--muted-bg)] p-3 text-sm leading-relaxed">
            {review.text}
          </div>

          {review.reactions && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {review.reactions.map((r) => (
                <span
                  key={r.emoji}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium"
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { Review };

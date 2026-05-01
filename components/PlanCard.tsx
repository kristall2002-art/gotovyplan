import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  href: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

export function PlanCard({
  href,
  title,
  price,
  description,
  features,
  badge,
  highlight,
}: Props) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-2xl border p-6 transition-all hover:border-[var(--accent)] hover:shadow-xl ${
        highlight
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--card-border)] bg-[var(--card-bg)]"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-white">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] mb-5">{description}</p>
      <div className="text-3xl font-bold mb-5">{price}</div>
      <ul className="text-sm space-y-2 mb-6 text-[var(--muted)]">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-[var(--accent)] mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-2 text-[var(--accent)] font-medium group-hover:gap-3 transition-all">
        Подробнее <ArrowRight size={16} />
      </div>
    </Link>
  );
}

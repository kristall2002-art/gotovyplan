import {
  FileText,
  Sheet,
  ChartLine,
  Map as MapIcon,
  Briefcase,
  ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge: string;
}

const items: Item[] = [
  {
    icon: FileText,
    title: "PDF со ссылками",
    desc: "30-страничный бизнес-план с активными ссылками на Росстат, ФНС, ЕГРЮЛ. Каждая цифра — со ссылкой на источник. Без «по экспертным оценкам».",
    badge: "Все тарифы",
  },
  {
    icon: Sheet,
    title: "Excel-финмодель",
    desc: "P&L, cash flow, balance sheet помесячно на 3 года. Три сценария: пессимистичный / базовый / оптимистичный. Все формулы открыты — правь под себя.",
    badge: "От 14 990 ₽",
  },
  {
    icon: ChartLine,
    title: "Графики и инфографика",
    desc: "Динамика рынка, структура CAPEX и OPEX, точка безубыточности, NPV/IRR-кривые, sensitivity-анализ. В бизнес-плане PNG, в Excel — динамические.",
    badge: "От 14 990 ₽",
  },
  {
    icon: MapIcon,
    title: "Карта конкурентов",
    desc: "POI в радиусе 1-3-5 км с рейтингами, часами работы, фото. Тепловая карта плотности, поток пешеходов и транспорта по часам.",
    badge: "От 4 990 ₽",
  },
  {
    icon: Briefcase,
    title: "Готовые приложения",
    desc: "Резюме для банка, питч-дек для инвестора, Business Model Canvas, смета для соцзащиты, письма. Под формат каждого получателя.",
    badge: "От 14 990 ₽",
  },
  {
    icon: ListChecks,
    title: "Чек-лист запуска",
    desc: "Пошаговый план первых 90 дней: документы, лицензии, аренда, найм, маркетинг. С дедлайнами, ответственными и стоимостью каждого шага.",
    badge: "Все тарифы",
  },
];

export function Deliverables() {
  return (
    <section className="py-24 border-t border-[var(--border)]">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="px-3 py-1 mb-5 inline-block text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)]">
          Что в результате
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          Не одна страница текста.
          <br />
          А целый набор документов.
        </h2>
        <p className="text-[var(--muted)] text-lg">
          В премиум-тарифах ты получаешь не просто PDF — а готовую папку с
          расчётами, графиками, картой и пакетом для банка или инвестора.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative flex flex-col p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 grid place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={24} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

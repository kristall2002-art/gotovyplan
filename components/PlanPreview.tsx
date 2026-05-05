"use client";

import { Lock } from "lucide-react";

type Tier = "try" | "quick" | "full" | "pro";

interface SampleProps {
  title: string;
  caption: string;
  availableIn: Tier[];
  currentTier: Tier;
  children: React.ReactNode;
}

function Sample({ title, caption, availableIn, currentTier, children }: SampleProps) {
  const locked = !availableIn.includes(currentTier);
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs text-[var(--muted)]">{caption}</p>
      </div>
      <div
        className={`relative aspect-[4/5] bg-gradient-to-br from-[var(--muted-bg)] to-[var(--background)] border-t border-[var(--border)] p-5 ${
          locked ? "blur-[2px] opacity-60" : ""
        }`}
      >
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--background)]/95 border border-[var(--border)] text-xs font-medium shadow-lg">
            <Lock size={12} /> доступно в платных
          </span>
        </div>
      )}
    </div>
  );
}

const ACC = "var(--accent)";
const MUT = "var(--muted)";

function CompetitorMap() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="cm-grid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="200" height="200" fill="url(#cm-grid)" />
      <g stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`h${i}`} x1="0" y1={i * 25} x2="200" y2={i * 25} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="200" />
        ))}
      </g>
      <g fill={ACC} fillOpacity="0.08" stroke={ACC} strokeOpacity="0.5" strokeWidth="1">
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="55" />
        <circle cx="100" cy="100" r="30" />
      </g>
      <text x="100" y="32" textAnchor="middle" fontSize="8" fill={ACC} opacity="0.7">1 км</text>
      <text x="100" y="58" textAnchor="middle" fontSize="8" fill={ACC} opacity="0.7">500 м</text>
      <g fill={MUT} fillOpacity="0.7">
        <circle cx="65" cy="80" r="3" />
        <circle cx="135" cy="70" r="3" />
        <circle cx="80" cy="135" r="3" />
        <circle cx="140" cy="130" r="3" />
        <circle cx="50" cy="105" r="3" />
        <circle cx="155" cy="95" r="3" />
        <circle cx="120" cy="155" r="3" />
        <circle cx="40" cy="60" r="3" />
        <circle cx="170" cy="125" r="3" />
      </g>
      <g>
        <circle cx="100" cy="100" r="8" fill={ACC} />
        <circle cx="100" cy="100" r="14" fill="none" stroke={ACC} strokeWidth="1.5" opacity="0.5" />
      </g>
    </svg>
  );
}

function PnLTable() {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const revenue = [120, 145, 168, 192, 215, 240];
  const cost = [95, 105, 115, 122, 130, 138];
  return (
    <div className="w-full h-full flex flex-col text-[10px] font-mono">
      <div className="grid grid-cols-7 gap-px bg-[var(--border)] mb-px">
        <div className="bg-[var(--card-bg)] px-1.5 py-1 font-semibold">P&L</div>
        {months.map((m) => (
          <div key={m} className="bg-[var(--card-bg)] px-1.5 py-1 text-center font-semibold text-[var(--accent)]">
            {m}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--border)] mb-px">
        <div className="bg-[var(--card-bg)] px-1.5 py-1 text-[var(--muted)]">Выручка</div>
        {revenue.map((v, i) => (
          <div key={i} className="bg-[var(--card-bg)] px-1.5 py-1 text-right">{v}к</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--border)] mb-px">
        <div className="bg-[var(--card-bg)] px-1.5 py-1 text-[var(--muted)]">Расходы</div>
        {cost.map((v, i) => (
          <div key={i} className="bg-[var(--card-bg)] px-1.5 py-1 text-right text-rose-500">−{v}к</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--border)] mb-2">
        <div className="bg-[var(--card-bg)] px-1.5 py-1 font-semibold">Прибыль</div>
        {revenue.map((v, i) => (
          <div key={i} className="bg-[var(--card-bg)] px-1.5 py-1 text-right font-semibold text-emerald-500">
            {v - cost[i]}к
          </div>
        ))}
      </div>
      <div className="flex-1 flex items-end gap-1 px-1">
        {revenue.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-t bg-[var(--accent)] opacity-80"
              style={{ height: `${(v - cost[i]) * 1.2}%` }}
            />
            <div className="text-[8px] text-[var(--muted)]">{months[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaybackChart() {
  const points = [
    [0, 80], [10, 78], [20, 75], [30, 70], [40, 64],
    [50, 56], [60, 47], [70, 38], [80, 28], [90, 18], [100, 8],
  ];
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x * 2} ${y * 1.5}`).join(" ");
  const area = `${path} L 200 150 L 0 150 Z`;
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <line x1="0" y1="75" x2="200" y2="75" stroke={MUT} strokeOpacity="0.3" strokeDasharray="4 3" />
      <text x="195" y="73" textAnchor="end" fontSize="7" fill={MUT}>0</text>
      <g stroke={MUT} strokeOpacity="0.15" strokeWidth="0.5">
        {[0, 25, 50, 75, 100, 125, 150].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} />
        ))}
      </g>
      <path d={area} fill={ACC} fillOpacity="0.15" />
      <path d={path} fill="none" stroke={ACC} strokeWidth="2" />
      <circle cx="200" cy="12" r="3" fill={ACC} />
      <text x="195" y="6" textAnchor="end" fontSize="8" fill={ACC} fontWeight="600">прибыль</text>
      <line x1="125" y1="0" x2="125" y2="150" stroke={ACC} strokeOpacity="0.5" strokeDasharray="3 3" />
      <text x="128" y="14" fontSize="8" fill={ACC} fontWeight="600">точка</text>
      <text x="128" y="24" fontSize="7" fill={MUT}>безубыточности</text>
    </svg>
  );
}

function CapexPie() {
  const slices = [
    { value: 35, color: ACC, label: "Оборудование" },
    { value: 25, color: "#a855f7", label: "Аренда" },
    { value: 20, color: "#10b981", label: "Маркетинг" },
    { value: 12, color: "#f59e0b", label: "Зарплаты" },
    { value: 8, color: "#ef4444", label: "Прочее" },
  ];
  let acc = 0;
  const cx = 80, cy = 80, r = 60;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 160 160" width="60%" height="auto">
        {slices.map((s, i) => {
          const startA = (acc / 100) * 2 * Math.PI - Math.PI / 2;
          acc += s.value;
          const endA = (acc / 100) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(startA);
          const y1 = cy + r * Math.sin(startA);
          const x2 = cx + r * Math.cos(endA);
          const y2 = cy + r * Math.sin(endA);
          const large = endA - startA > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={s.color}
              opacity="0.85"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="28" fill="var(--card-bg)" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">2.4М</text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7" fill={MUT}>CAPEX, ₽</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] w-full">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[var(--muted)] truncate">{s.label}</span>
            <span className="ml-auto font-semibold">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PdfStructure() {
  const sections = [
    "1. Резюме проекта",
    "2. Описание идеи",
    "3. Анализ рынка",
    "4. Конкуренты",
    "5. Маркетинг-план",
    "6. Производство",
    "7. Финмодель",
    "8. Риски",
    "9. План запуска",
    "10. Приложения",
  ];
  return (
    <div className="w-full h-full flex flex-col gap-1.5 text-[11px] font-mono">
      <div className="text-center text-[10px] font-semibold mb-1 text-[var(--accent)]">
        БИЗНЕС-ПЛАН · 32 СТР
      </div>
      {sections.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[var(--muted)] w-4 text-right">{i + 1}</span>
          <span className="flex-1 truncate">{s.replace(/^\d+\. /, "")}</span>
          <span className="border-b border-dotted border-[var(--muted)] flex-1 mx-1 opacity-40" />
          <span className="text-[var(--muted)]">{(i + 1) * 3 + 2}</span>
        </div>
      ))}
    </div>
  );
}

function ExcelModel() {
  const cols = ["A", "B", "C", "D", "E"];
  const rows = [
    ["Месяц", "Q1", "Q2", "Q3", "Q4"],
    ["Выручка", "450к", "612к", "780к", "920к"],
    ["COGS", "180к", "230к", "290к", "340к"],
    ["GP", "270к", "382к", "490к", "580к"],
    ["OPEX", "180к", "195к", "210к", "225к"],
    ["EBITDA", "90к", "187к", "280к", "355к"],
    ["NPV", "=SUM(", "B6:E6)", "/(1+r)", ""],
  ];
  return (
    <div className="w-full h-full flex flex-col text-[9px] font-mono">
      <div className="grid grid-cols-6 bg-[var(--muted-bg)] border border-[var(--border)] mb-px">
        <div className="px-1 py-1 text-center text-[var(--muted)]"></div>
        {cols.map((c) => (
          <div key={c} className="px-1 py-1 text-center text-[var(--muted)] border-l border-[var(--border)]">
            {c}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 border-x border-b border-[var(--border)]">
          <div className="px-1 py-1 text-center text-[var(--muted)] bg-[var(--muted-bg)]">{ri + 1}</div>
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`px-1 py-1 truncate border-l border-[var(--border)] ${
                ri === 0 ? "bg-[var(--muted-bg)] font-semibold" : ""
              } ${ri === 5 ? "bg-emerald-500/10 font-semibold text-emerald-600" : ""} ${
                ri === 6 && ci > 0 ? "text-[var(--accent)]" : ""
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const SAMPLES = [
  {
    title: "Карта конкурентов",
    caption: "Радиус 500 м, 1 км, 3 км · точки конкурентов на местности",
    availableIn: ["try", "quick", "full", "pro"] as Tier[],
    render: <CompetitorMap />,
  },
  {
    title: "Структура бизнес-плана",
    caption: "Полный список разделов PDF · 30–40 страниц",
    availableIn: ["try", "quick", "full", "pro"] as Tier[],
    render: <PdfStructure />,
  },
  {
    title: "P&L по месяцам",
    caption: "Выручка, расходы, прибыль · с разбивкой и графиком",
    availableIn: ["full", "pro"] as Tier[],
    render: <PnLTable />,
  },
  {
    title: "Excel-финмодель",
    caption: "Открытые формулы, 3 сценария, 36 месяцев",
    availableIn: ["full", "pro"] as Tier[],
    render: <ExcelModel />,
  },
  {
    title: "Срок окупаемости",
    caption: "Точка безубыточности · NPV / IRR · cash flow",
    availableIn: ["full", "pro"] as Tier[],
    render: <PaybackChart />,
  },
  {
    title: "Структура CAPEX",
    caption: "Распределение стартовых вложений по статьям",
    availableIn: ["quick", "full", "pro"] as Tier[],
    render: <CapexPie />,
  },
];

interface Props {
  tier: Tier;
  title?: string;
  subtitle?: string;
}

export function PlanPreview({ tier, title, subtitle }: Props) {
  return (
    <section className="mt-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {title ?? "Так будет выглядеть твой бизнес-план"}
        </h2>
        <p className="text-sm text-[var(--muted)] max-w-xl mx-auto">
          {subtitle ?? "Образцы страниц — что именно ты получаешь. Заблокированные доступны в платных тарифах."}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLES.map((s, i) => (
          <Sample
            key={i}
            title={s.title}
            caption={s.caption}
            availableIn={s.availableIn}
            currentTier={tier}
          >
            {s.render}
          </Sample>
        ))}
      </div>
    </section>
  );
}

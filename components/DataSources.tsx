import {
  Banknote,
  Building2,
  ScrollText,
  Landmark,
  BarChart3,
  TrendingUp,
  Database,
  Search,
  MapPin,
  Map,
  Compass,
  MapPinned,
  ShieldCheck,
  Flame,
  HandCoins,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Source {
  icon: LucideIcon;
  name: string;
  desc: string;
}

interface Category {
  title: string;
  hint: string;
  sources: Source[];
}

const categories: Category[] = [
  {
    title: "Финансы и налоги",
    hint: "Считаем по реальным цифрам, а не «в среднем по больнице»",
    sources: [
      {
        icon: Banknote,
        name: "ФНС России",
        desc: "Бухотчётность всех ООО и ИП + расчёт УСН/ПСН/НПД для региона",
      },
      {
        icon: Building2,
        name: "ЕГРЮЛ / ЕГРИП",
        desc: "Реестры юрлиц и ИП: учредители, статус, история",
      },
      {
        icon: ScrollText,
        name: "ОКВЭД 2",
        desc: "Классификатор деятельности — 2700+ кодов с маппингом на лицензии",
      },
      {
        icon: Landmark,
        name: "ЦБ РФ",
        desc: "Ключевая ставка, инфляция, курсы валют — для дисконтирования",
      },
    ],
  },
  {
    title: "Рынок и статистика",
    hint: "Размер рынка, тренды, ёмкость отрасли",
    sources: [
      {
        icon: BarChart3,
        name: "Росстат",
        desc: "Отраслевая статистика, цены, демография по 85 регионам",
      },
      {
        icon: TrendingUp,
        name: "СПАРК-Интерфакс",
        desc: "Финансы конкурентов, скоринг, тендеры, аффилиации",
      },
      {
        icon: Database,
        name: "Реестр МСП",
        desc: "Все малые и средние предприятия страны — rmsp.nalog.ru",
      },
      {
        icon: Search,
        name: "Yandex Wordstat",
        desc: "Поисковый спрос на товар/услугу по регионам и сезонам",
      },
    ],
  },
  {
    title: "География и конкуренты",
    hint: "Кто работает рядом, плотность, поток людей",
    sources: [
      {
        icon: MapPin,
        name: "2GIS",
        desc: "Точки конкурентов, рейтинги, часы работы, фото",
      },
      {
        icon: Map,
        name: "OpenStreetMap",
        desc: "POI в радиусе, инфраструктура района, транспорт",
      },
      {
        icon: Compass,
        name: "Yandex Геокодер",
        desc: "Адрес → координаты, плотность населения, проходимость",
      },
      {
        icon: MapPinned,
        name: "DaData",
        desc: "Стандартизация адресов, поиск компаний по ИНН",
      },
    ],
  },
  {
    title: "Регулирование и господдержка",
    hint: "Что разрешено, что запрещено, кто даёт деньги",
    sources: [
      {
        icon: ShieldCheck,
        name: "Роспотребнадзор",
        desc: "СанПиН для общепита, торговли, услуг, производства",
      },
      {
        icon: Flame,
        name: "МЧС России",
        desc: "Пожарные нормы для производства, общепита, складов",
      },
      {
        icon: HandCoins,
        name: "МСП.РФ",
        desc: "Гранты, льготные кредиты, субсидии регионов и Минэка",
      },
      {
        icon: FileText,
        name: "Соцзащита регионов",
        desc: "Требования к плану под соцконтракт по 85 регионам РФ",
      },
    ],
  },
];

export function DataSources() {
  return (
    <section className="py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="px-3 py-1 mb-5 inline-block text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)]">
          За что ты платишь
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          16 государственных баз —
          <br />
          в одном бизнес-плане
        </h2>
        <p className="text-[var(--muted)] text-lg">
          Каждая цифра в бизнес-плане — со ссылкой на источник. Никаких выдуманных
          «по мнению экспертов» — только проверяемые данные из официальных
          реестров и API.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.title}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">{cat.title}</h3>
              <p className="text-sm text-[var(--muted)]">{cat.hint}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.sources.map((src) => {
                const Icon = src.icon;
                return (
                  <div
                    key={src.name}
                    className="flex gap-4 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm mb-1">
                        {src.name}
                      </div>
                      <div className="text-xs text-[var(--muted)] leading-snug">
                        {src.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="text-3xl font-bold text-[var(--accent)] mb-2">
            16+
          </div>
          <div className="font-semibold mb-1">источников данных</div>
          <p className="text-sm text-[var(--muted)]">
            Государственные реестры, API ФНС и Росстата, ЦБ РФ,
            картографические сервисы.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="text-3xl font-bold text-[var(--accent)] mb-2">85</div>
          <div className="font-semibold mb-1">регионов РФ</div>
          <p className="text-sm text-[var(--muted)]">
            Налоговые ставки, субсидии, требования соцзащиты для каждого
            субъекта федерации.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="text-3xl font-bold text-[var(--accent)] mb-2">
            100%
          </div>
          <div className="font-semibold mb-1">с источниками</div>
          <p className="text-sm text-[var(--muted)]">
            Каждая цифра в плане — с активной ссылкой на первоисточник.
            Проверяемо построчно.
          </p>
        </div>
      </div>
    </section>
  );
}

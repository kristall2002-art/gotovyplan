import type { Metadata } from "next";
import Script from "next/script";
import { OrderForm } from "@/components/OrderForm";
import { PlanPreview } from "@/components/PlanPreview";

export const metadata: Metadata = {
  title: "Полный бизнес-план для банка с финмоделью Excel",
  description:
    "Готовый бизнес-план для банка, инвестора или гранта: 30–40 страниц, Excel-финмодель с P&L, cash flow, NPV/IRR, анализ рынка по Росстату. Готовность за 24 часа.",
  keywords: [
    "бизнес-план для банка",
    "бизнес-план с финмоделью",
    "бизнес-план с Excel",
    "бизнес-план для инвестора",
    "бизнес-план для гранта",
    "бизнес-план NPV IRR",
    "финансовая модель бизнес-плана",
    "бизнес-план с анализом рынка",
  ],
  alternates: {
    canonical: "/full",
  },
  openGraph: {
    title: "Полный бизнес-план для банка с финмоделью Excel",
    description:
      "30–40 страниц + Excel: P&L, cash flow, NPV/IRR. Анализ рынка с источниками. Готовность за 24 часа.",
    url: "/full",
    type: "website",
    locale: "ru_RU",
    siteName: "БП24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Полный бизнес-план для банка с финмоделью Excel",
    description:
      "30–40 страниц + Excel-финмодель. Готовность за 24 часа от 14 990 ₽.",
  },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Полный бизнес-план для банка",
  description:
    "Бизнес-план 30–40 страниц с Excel-финмоделью (P&L, cash flow, NPV/IRR), анализ рынка по Росстату, конкуренты по ФНС, маркетинг-план.",
  provider: {
    "@type": "Organization",
    name: "БП24",
  },
  areaServed: "RU",
  offers: [
    {
      "@type": "Offer",
      name: "Стандартный",
      price: "14990",
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: "https://kristall2002-art.github.io/gotovyplan/full",
    },
    {
      "@type": "Offer",
      name: "Расширенный",
      price: "24990",
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: "https://kristall2002-art.github.io/gotovyplan/full",
    },
  ],
};

export default function FullPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Script
        id="ld-full"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <span className="text-sm text-[var(--accent)] font-medium">Тариф 2</span>
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        Полный бизнес-план
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Готовый документ для подачи в банк, фонд, инвестору или для собственного
        запуска. С финмоделью в Excel, графиками и расчётами по месяцам.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что включено (30–40 страниц)</h2>
        <ul className="space-y-3 text-sm">
          <li>📋 Резюме проекта</li>
          <li>🎯 Описание продукта и ЦА</li>
          <li>📊 Анализ рынка с цифрами Росстата и ссылками</li>
          <li>🔍 Конкуренты: финансовые показатели по ИНН (ФНС)</li>
          <li>📐 Производственный / операционный план</li>
          <li>🚀 Маркетинг-план с юнит-экономикой</li>
          <li>💰 Финмодель Excel: P&L, cash flow, balance sheet</li>
          <li>📈 NPV, IRR, точка безубыточности, 3 сценария</li>
          <li>⚠️ Анализ рисков с матрицей</li>
          <li>📜 Юр. часть: налоги, лицензии, СанПиН</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold mb-2">Стандартный — 14 990 ₽</h3>
          <p className="text-sm text-[var(--muted)]">
            30 страниц, готовность 24 часа
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-6">
          <h3 className="font-semibold mb-2">Расширенный — 24 990 ₽</h3>
          <p className="text-sm text-[var(--muted)]">
            40 страниц + презентация для инвестора + 1 правка
          </p>
        </div>
      </div>

      <OrderForm tariff="full" basePrice={14990} buttonLabel="Заказать полный план за" />

      <PlanPreview tier="full" />
    </div>
  );
}

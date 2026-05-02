import type { Metadata } from "next";
import Script from "next/script";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Бизнес-план для соцконтракта — до 350 000 ₽ от государства",
  description:
    "Бизнес-план под соцконтракт за 3 990 ₽ с гарантией одобрения комиссией соцзащиты. Готовность 48 часов, шаблон под регион, расчёт сметы и подбор ОКВЭД.",
  keywords: [
    "бизнес-план для соцконтракта",
    "соцконтракт 350000",
    "бизнес-план соцзащита",
    "грант на бизнес от государства",
    "бизнес-план ИП самозанятость",
    "соцконтракт 2026",
  ],
  alternates: {
    canonical: "/soc",
  },
  openGraph: {
    title: "Бизнес-план под соцконтракт — до 350 000 ₽ от государства",
    description:
      "Готовый план под комиссию соцзащиты с гарантией одобрения. 3 990 ₽, готовность за 48 часов.",
    url: "/soc",
    type: "website",
    locale: "ru_RU",
    siteName: "БП24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Бизнес-план под соцконтракт — до 350 000 ₽",
    description:
      "Готовый план под комиссию соцзащиты с гарантией одобрения. 3 990 ₽, 48 часов.",
  },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Бизнес-план под соцконтракт",
  description:
    "Бизнес-план под требования соцзащиты с гарантией одобрения комиссией. Подбор ОКВЭД, смета расходов, подготовка к собеседованию.",
  provider: {
    "@type": "Organization",
    name: "БП24",
  },
  areaServed: "RU",
  offers: {
    "@type": "Offer",
    price: "3990",
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    url: "https://kristall2002-art.github.io/gotovyplan/soc",
  },
};

export default function SocPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Script
        id="ld-soc"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <span className="text-sm text-[var(--accent)] font-medium">
        Госпрограмма
      </span>
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        Бизнес-план под соцконтракт
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Государство даёт <strong>до 350 000 ₽ безвозвратно</strong> на запуск
        своего дела — нужно только подать правильный бизнес-план.
        Мы делаем его так, чтобы комиссия одобрила.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что такое соцконтракт</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Если доход на члена семьи ниже прожиточного минимума региона — ты
          можешь получить от государства до 350 000 ₽ на ИП/самозанятость, до
          200 000 ₽ на ЛПХ или до 30 000 ₽ на переобучение. Деньги
          безвозвратные, но нужно отчитаться по бизнес-плану.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что мы делаем</h2>
        <ul className="space-y-3 text-sm">
          <li>📑 Бизнес-план под требования соцзащиты твоего региона</li>
          <li>📊 Смета расходов с обоснованием каждой строки</li>
          <li>🎯 Подбор подходящего ОКВЭД</li>
          <li>📋 Подготовка к собеседованию с комиссией</li>
          <li>🛡 Гарантия одобрения или возврат денег</li>
        </ul>
      </div>

      <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-2">Стоимость</h2>
        <p className="text-3xl font-bold mb-2">3 990 ₽</p>
        <p className="text-sm text-[var(--muted)]">
          Готовность 48 часов · с гарантией одобрения комиссией
        </p>
      </div>

      <OrderForm tariff="soc" basePrice={3990} buttonLabel="Заказать план под соцконтракт за" />
    </div>
  );
}

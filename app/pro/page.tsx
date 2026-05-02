import type { Metadata } from "next";
import Script from "next/script";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Конструктор бизнес-планов Pro для консультантов",
  description:
    "Сервис автоматической генерации бизнес-планов для консультантов и сметчиков: модульная сборка, данные Росстата и ФНС, white-label PDF, выгрузка Word, Excel, PDF.",
  keywords: [
    "конструктор бизнес-планов",
    "автоматическая генерация бизнес-плана",
    "бизнес-план для консультантов",
    "white-label бизнес-план",
    "бизнес-план Росстат ФНС",
    "подписка бизнес-план",
    "сервис бизнес-планов Pro",
  ],
  alternates: {
    canonical: "/pro",
  },
  openGraph: {
    title: "Конструктор бизнес-планов Pro для консультантов",
    description:
      "Модульная сборка плана, данные Росстата и ФНС, white-label PDF. От 4 990 ₽ или подписка 9 990 ₽/мес.",
    url: "/pro",
    type: "website",
    locale: "ru_RU",
    siteName: "БП24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Конструктор бизнес-планов Pro",
    description:
      "Для консультантов и сметчиков: модули, данные Росстата и ФНС, white-label.",
  },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Конструктор бизнес-планов Pro",
  description:
    "Модульная сборка бизнес-планов с прямым доступом к данным Росстата и ФНС, white-label PDF, выгрузка Word/Excel/PDF, шаблоны под банки и фонды.",
  provider: {
    "@type": "Organization",
    name: "БП24",
  },
  areaServed: "RU",
  offers: [
    {
      "@type": "Offer",
      name: "Разовый план",
      price: "4990",
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: "https://kristall2002-art.github.io/gotovyplan/pro",
    },
    {
      "@type": "Offer",
      name: "Подписка PRO",
      price: "9990",
      priceCurrency: "RUB",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "9990",
        priceCurrency: "RUB",
        unitCode: "MON",
      },
      availability: "https://schema.org/InStock",
      url: "https://kristall2002-art.github.io/gotovyplan/pro",
    },
  ],
};

export default function ProPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Script
        id="ld-pro"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <span className="text-sm text-[var(--accent)] font-medium">PRO</span>
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        Конструктор для специалистов
      </h1>
      <p className="text-lg text-[var(--muted)] mb-8">
        Если ты сам пишешь бизнес-планы клиентам — собирай документ из модулей,
        тяни данные напрямую и сдавай со своим брендингом.
      </p>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Кому подходит</h2>
        <ul className="space-y-3 text-sm">
          <li>👥 Консультантам с FL.ru, Profi.ru, Kwork</li>
          <li>📐 Сметчикам и экономистам</li>
          <li>🏦 Финансовым директорам на аутсорсе</li>
          <li>📊 Бизнес-аналитикам</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Что внутри</h2>
        <ul className="space-y-3 text-sm">
          <li>🛠 Модульная сборка: чекбоксы — какие разделы нужны</li>
          <li>🔌 Прямой доступ к данным: Росстат, ФНС, ЕГРЮЛ, ОКВЭД</li>
          <li>🏷 White-label: PDF без нашего логотипа, твой бренд</li>
          <li>📦 Выгрузка: Word, Excel, PDF — для дальнейшей правки</li>
          <li>🎨 Шаблоны под банки (Сбер, ВТБ), ФРП, региональные фонды</li>
          <li>♻️ История проектов с возможностью клонирования</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold mb-2">Разовый план</h3>
          <p className="text-2xl font-bold mb-1">от 4 990 ₽</p>
          <p className="text-sm text-[var(--muted)]">
            Цена считается по выбранным модулям
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-6">
          <h3 className="font-semibold mb-2">Подписка PRO</h3>
          <p className="text-2xl font-bold mb-1">9 990 ₽ / мес</p>
          <p className="text-sm text-[var(--muted)]">
            До 5 планов в месяц + полный доступ к данным
          </p>
        </div>
      </div>

      <OrderForm tariff="pro" basePrice={4990} buttonLabel="Начать сборку за" />
    </div>
  );
}

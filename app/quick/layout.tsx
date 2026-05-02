import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Быстрый расчёт бизнес-плана онлайн за 990 ₽",
  description:
    "Быстрый AI-анализ идеи бизнеса за 990 ₽ и 15 минут: ОКВЭД, налоговый режим, конкуренты в радиусе, диапазон вложений, топ-3 риска. PDF 5–7 страниц.",
  keywords: [
    "быстрый бизнес-план",
    "бизнес-план 990",
    "AI анализ идеи бизнеса",
    "проверка идеи бизнеса",
    "бизнес-план за 15 минут",
    "ОКВЭД и налоги",
    "конкуренты в районе",
  ],
  alternates: {
    canonical: "/quick",
  },
  openGraph: {
    title: "Быстрый расчёт бизнес-плана за 990 ₽",
    description:
      "AI-анализ идеи за 15 минут: налоги, ОКВЭД, конкуренты, диапазон вложений, топ-3 риска. PDF 5–7 страниц.",
    url: "/quick",
    type: "website",
    locale: "ru_RU",
    siteName: "БП24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Быстрый расчёт бизнес-плана за 990 ₽",
    description:
      "AI-анализ идеи бизнеса за 15 минут. PDF 5–7 страниц с налогами, конкурентами и рисками.",
  },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Быстрый расчёт бизнес-плана",
  description:
    "Анализ идеи бизнеса: ОКВЭД, налоговый режим, конкуренты в радиусе, диапазон вложений, топ-3 риска. PDF 5–7 страниц за 15 минут.",
  provider: {
    "@type": "Organization",
    name: "БП24",
  },
  areaServed: "RU",
  offers: {
    "@type": "Offer",
    price: "990",
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    url: "https://kristall2002-art.github.io/gotovyplan/quick",
  },
};

export default function QuickLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Script
        id="ld-quick"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      {children}
    </>
  );
}

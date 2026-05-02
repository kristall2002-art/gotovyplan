import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Попробовать бесплатно — бизнес-план онлайн с AI",
  description:
    "Бесплатный AI-бизнес-план: расскажи идею голосом или текстом и получи юр-чек, карту конкурентов в радиусе 500 м и топ-3 риска. Без карты, без обязательств.",
  keywords: [
    "бесплатный бизнес-план",
    "бизнес-план онлайн бесплатно",
    "AI бизнес-план бесплатно",
    "проверить идею бизнеса",
    "карта конкурентов",
    "анализ бизнес-идеи онлайн",
  ],
  alternates: {
    canonical: "/try",
  },
  openGraph: {
    title: "Попробовать бесплатно — бизнес-план онлайн с AI",
    description:
      "Бесплатный AI-бизнес-план: ОКВЭД, карта конкурентов, топ-3 риска. Без карты и обязательств.",
    url: "/try",
    type: "website",
    locale: "ru_RU",
    siteName: "БП24",
  },
  twitter: {
    card: "summary_large_image",
    title: "Бесплатный AI-бизнес-план онлайн",
    description:
      "Расскажи идею — получи юр-чек, карту конкурентов и топ-3 риска. Без оплаты.",
  },
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Бесплатный AI-бизнес-план",
  description:
    "Короткий бизнес-план бесплатно: юр-чек, карта конкурентов в радиусе 500 м, топ-3 риска. Без оплаты.",
  provider: {
    "@type": "Organization",
    name: "БП24",
  },
  areaServed: "RU",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    url: "https://kristall2002-art.github.io/gotovyplan/try",
  },
};

export default function TryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Script
        id="ld-try"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      {children}
    </>
  );
}

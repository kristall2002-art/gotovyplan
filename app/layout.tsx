import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const SITE_URL = "https://kristall2002-art.github.io/gotovyplan";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "БП24 — готовый бизнес-план онлайн с AI",
    template: "%s — БП24",
  },
  description:
    "AI-сервис для генерации бизнес-планов: быстрый расчёт от 990 ₽, план под соцконтракт, полный план для банка с финмоделью в Excel и конструктор Pro для консультантов.",
  applicationName: "БП24",
  keywords: [
    "бизнес-план онлайн",
    "AI бизнес-план",
    "готовый бизнес-план",
    "бизнес-план для соцконтракта",
    "бизнес-план для банка",
    "автоматическая генерация бизнес-плана",
    "бизнес-план Россия",
    "бизнес-план с финмоделью",
    "бизнес-план с Excel",
  ],
  authors: [{ name: "БП24" }],
  creator: "БП24",
  publisher: "БП24",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "БП24",
    title: "БП24 — готовый бизнес-план онлайн с AI",
    description:
      "AI-сервис генерации бизнес-планов: быстрый расчёт, соцконтракт, план для банка с финмоделью, конструктор для консультантов.",
  },
  twitter: {
    card: "summary_large_image",
    title: "БП24 — готовый бизнес-план онлайн с AI",
    description:
      "AI-сервис генерации бизнес-планов: быстрый расчёт, соцконтракт, план для банка с финмоделью, конструктор для консультантов.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "БП24",
  url: SITE_URL,
  description:
    "AI-сервис для генерации бизнес-планов: от быстрого расчёта до полного плана для банка с Excel-финмоделью.",
  sameAs: ["https://t.me/businessplan24_bot"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

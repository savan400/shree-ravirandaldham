import type { Metadata } from "next";
import "@/app/globals.css";
import {
  Poppins,
  Tiro_Devanagari_Hindi,
  Cinzel_Decorative,
  Cinzel,
  Cormorant_Garamond,
  EB_Garamond,
  Playfair_Display,
  Noto_Sans_Devanagari,
} from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-hindi",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  variable: "--font-noto-hindi",
});

import { SEO_CONFIG } from "@/lib/seoConfig";
import { generateStructuredData } from "@/lib/seo";
import { getImageUrl, EventEntry, fetchEvents } from "@/services/events-service";
import { fetchSeoData, fetchGlobalSettings } from "@/services/seo-service";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await fetchGlobalSettings();
  const siteName = settings?.siteName?.[locale] || settings?.siteName?.en || SEO_CONFIG.siteName;
  const keywords = settings?.keywords?.[locale] || settings?.keywords?.en || SEO_CONFIG.keywords;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: "Official website of Shree Ravirandaldham",
    keywords: keywords,
    metadataBase: new URL(settings?.baseUrl || SEO_CONFIG.baseUrl),
    openGraph: {
      type: "website",
      siteName: siteName,
      images: [{ url: settings?.defaultOgImage || SEO_CONFIG.defaultOgImage }],
    },
    verification: {
      google: settings?.googleSearchConsoleId,
    }
  };
}

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${poppins.variable} ${tiroHindi.variable} ${cinzelDecorative.variable} ${cinzel.variable} ${cormorant.variable} ${ebGaramond.variable} ${playfair.variable} ${notoHindi.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify(await generateStructuredData("Organization", locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify(await generateStructuredData("Website", locale)),
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

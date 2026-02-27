'use client';

import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/NotFoundContent";
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
import "@/app/globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-sans" });
const tiroHindi = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-hindi" });
const cinzelDecorative = Cinzel_Decorative({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-display" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-playfair" });
const notoHindi = Noto_Sans_Devanagari({ subsets: ["devanagari", "latin"], weight: ["400", "600"], variable: "--font-noto-hindi" });

export default function GlobalNotFound() {
  // Use a minimal messages object or empty for the fallback root 404
  const messages = {}; 

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${tiroHindi.variable} ${cinzelDecorative.variable} ${cinzel.variable} ${cormorant.variable} ${ebGaramond.variable} ${playfair.variable} ${notoHindi.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale="en">
          <Header />
          <main>
            <NotFoundContent />
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

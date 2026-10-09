import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

const display = Archivo({ variable: "--font-display", subsets: ["latin"], weight: ["600", "800"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

const title = `${BUSINESS.name} · Quincaillerie & droguerie à Marrakech Guéliz`;
const description =
  "Peinture, outillage, plomberie, sanitaire, électricité, quincaillerie, jardinage et produits d'entretien à Guéliz, Marrakech, depuis 1998.";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: { default: title, template: `%s · ${BUSINESS.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", locale: "fr_MA", siteName: BUSINESS.name },
  robots: { index: false, follow: false }, // demo: flip to true once the shop approves going live
};
export const viewport: Viewport = { themeColor: "#f4f1ea", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: BUSINESS.name,
  foundingDate: String(BUSINESS.since),
  url: BUSINESS.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.city,
    addressRegion: "Marrakech-Safi",
    addressCountry: BUSINESS.country,
  },
  ...(BUSINESS.phone && { telephone: BUSINESS.phone }),
  currenciesAccepted: "MAD",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

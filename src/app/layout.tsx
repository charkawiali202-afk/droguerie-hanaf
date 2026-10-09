import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan, Noto_Kufi_Arabic } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";
import CartDrawer from "@/components/CartDrawer";
import { BUSINESS } from "@/lib/business";
import "./globals.css";

const display = League_Spartan({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const arabic = Noto_Kufi_Arabic({ variable: "--font-ar", subsets: ["arabic"], weight: ["400", "600", "700"] });

const title = `${BUSINESS.name} · Quincaillerie & droguerie à Marrakech Guéliz`;
const description =
  "Peinture, outillage, plomberie, sanitaire, électricité, quincaillerie, jardinage et produits d'entretien à Guéliz, Marrakech, depuis 1998.";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: { default: title, template: `%s · ${BUSINESS.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", locale: "fr_MA", siteName: BUSINESS.name, images: ["/logo.webp"] },
  icons: { icon: "/logo.webp" },
  robots: { index: false, follow: false }, // demo: flip to true once the shop approves going live
};
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover", colorScheme: "light" };

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
  paymentAccepted: "Cash",
  logo: `${BUSINESS.url}/logo.webp`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${arabic.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Hide the intro before first paint if it already played this session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if(sessionStorage.getItem("hanaf-intro"))d.dataset.intro="seen";var l=localStorage.getItem("hanaf-lang");if(l==="ar"||l==="en"){d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <Splash />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

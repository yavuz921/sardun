import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE = "https://sardun.vercel.app";
const TITLE = "Sardun Mühendislik & Mimarlık | Statik Proje ve Yapısal Analiz";
const DESC =
  "Ankara merkezli Sardun Mühendislik — betonarme ve çelik yapılarda statik proje, sonlu eleman analizi ve mühendislik danışmanlığı.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  keywords: [
    "statik proje", "çelik yapı tasarımı", "betonarme", "yapısal analiz",
    "SAP2000", "ETABS", "Tekla Structures", "inşaat mühendisliği", "Ankara",
  ],
  authors: [{ name: "Sardun Mühendislik & Mimarlık" }],
  icons: { icon: "/favicon.png" },
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE,
    siteName: "Sardun Mühendislik & Mimarlık",
    title: TITLE,
    description: DESC,
    images: [{ url: "/projects/celik-hal.jpeg", width: 1600, height: 711, alt: "Sardun — çelik yapı modeli" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/projects/celik-hal.jpeg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={inter.className}>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Sardun Mühendislik & Mimarlık",
              description: DESC,
              url: SITE,
              areaServed: "TR",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Çankaya",
                addressRegion: "Ankara",
                addressCountry: "TR",
              },
              telephone: "+90-554-551-13-58",
              email: "info@sardun.com.tr",
              knowsAbout: ["Statik Proje", "Çelik Yapı Tasarımı", "Yapısal Analiz", "Betonarme"],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}

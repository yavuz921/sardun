import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sardun Mühendislik & Mimarlık | Statik Proje ve Yapısal Analiz",
  description:
    "Ankara merkezli Sardun Mühendislik — betonarme ve çelik yapılarda statik proje, sonlu eleman analizi ve mühendislik danışmanlığı.",
  icons: {
    icon: "/favicon.png",
  },
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
        {children}
      </body>
    </html>
  );
}

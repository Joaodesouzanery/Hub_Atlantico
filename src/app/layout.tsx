import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "HuB - Atlântico | Notícias de Saneamento",
    template: "%s | HuB - Atlântico",
  },
  description:
    "Hub de notícias do setor de saneamento, engenharia e tecnologia. Informações atualizadas diariamente das principais fontes do Brasil.",
  keywords: [
    "saneamento",
    "notícias saneamento",
    "engenharia sanitária",
    "água e esgoto",
    "tratamento de água",
    "tecnologia saneamento",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-dark-bg text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}

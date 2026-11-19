import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sem Parar | Black Friday 2024 - Oferta Exclusiva",
  description: "Ate 12 meses de mensalidade gratis + adesao zero + frete gratis. Oferta exclusiva Black Friday Sem Parar.",
  openGraph: {
    title: "Sem Parar | Black Friday 2024",
    description: "Ate 12 meses de mensalidade gratis na sua TAG!",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-black">{children}</body>
    </html>
  );
}

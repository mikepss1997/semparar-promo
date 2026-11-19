import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sem Parar | Oferta Exclusiva",
  description: "Sua oferta personalizada Sem Parar. TAG de pedagio com desconto exclusivo, adesao gratis e frete gratis.",
  openGraph: {
    title: "Sem Parar | Oferta Exclusiva",
    description: "TAG de pedagio com desconto exclusivo para voce.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Hanken_Grotesk',system-ui,sans-serif] antialiased text-[#0e0d0d] bg-white">{children}</body>
    </html>
  );
}

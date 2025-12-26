import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { locales, Locale } from "../dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MooveLabs – Inovação em Apps, Automação e IA",
  description: "MooveLabs oferece desenvolvimento de aplicativos, automação de processos e agentes de IA 24/7. Conheça nossos projetos e entre em contato via WhatsApp.",
  openGraph: {
    title: "MooveLabs – Inovação em Apps, Automação e IA",
    description: "Desenvolvimento de apps, automação e IA 24/7. Veja nossos projetos e entre em contato.",
    url: "https://moovelabs.com",
    siteName: "MooveLabs",
    images: [
      {
        url: "https://moovelabs.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MooveLabs – Inovação em Apps, Automação e IA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MooveLabs – Inovação em Apps, Automação e IA",
    description: "Desenvolvimento de apps, automação e IA 24/7.",
    images: ["https://moovelabs.com/og-image.jpg"],
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

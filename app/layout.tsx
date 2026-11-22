import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "../Recursos/BricolageGrotesque-Variable.ttf",
  weight: "200 800",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "../Recursos/Inter-Variable.ttf",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.communitybuilderslatam.com"),
  title: "Community Builders LATAM | Impulsamos el community building",
  description:
    "El espacio de encuentro, desarrollo y referencia para quienes construyen comunidades como práctica profesional en Latinoamérica.",
  keywords: ["community building", "comunidades", "Latinoamérica", "Community Builders LATAM"],
  openGraph: {
    title: "Community Builders LATAM",
    description: "Una comunidad profesional para quienes hacen comunidad.",
    url: "https://www.communitybuilderslatam.com",
    siteName: "Community Builders LATAM",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

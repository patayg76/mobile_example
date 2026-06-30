import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const displaySans = Plus_Jakarta_Sans({
  variable: "--font-display-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Mikrobióta-transzfer terápia (MTT) FMT kapszulával. Teljes értékű, kivizsgált donoroktól származó humán baktérium-mátrix — könnyű, biztonságos, kézenfekvő.",
};

export const viewport: Viewport = {
  themeColor: "#14302a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${displaySans.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

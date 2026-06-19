import type { Metadata, Viewport } from "next";
import { Exo, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const exo = Exo({
  variable: "--font-exo",
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
    "MicrobiomeBank securely preserves, sequences and distributes microbial strains and samples for the global research community.",
};

export const viewport: Viewport = {
  themeColor: "#041f33",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${exo.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

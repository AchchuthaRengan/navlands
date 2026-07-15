import type { Metadata } from "next";
import {
  Caveat,
  DM_Sans as DMSans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";

import "./globals.css";

const headingFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const accentFont = Caveat({
  subsets: ["latin"],
  variable: "--font-accent",
});

const bodyFont = DMSans({
  subsets: ["latin"],
  variable: "--font-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Wayframe",
  description: "Visual-first career exploration foundations for M1.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${accentFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen bg-parchment bg-paper-wash font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

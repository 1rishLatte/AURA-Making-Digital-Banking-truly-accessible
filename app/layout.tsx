import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono, Space_Mono, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { AdaptiveProvider } from "@/lib/adaptive-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const spaceMono = Space_Mono({ weight: ["400"], subsets: ["latin"], variable: "--font-space-mono", display: "swap" });
const atkinson = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-atkinson", display: "swap" });

export const metadata: Metadata = {
  title: "AURA — Adaptive Banking",
  description: "Adaptive Universal Banking & Proactive Fraud Shield — vault at dusk, WCAG 2.2 AA, INR en-IN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable} ${jetbrains.variable} ${spaceMono.variable} ${atkinson.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f111a" />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-bone text-vault-ink">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-vault-ink focus:text-white focus:rounded-[8px]">Skip to main content</a>
        <AdaptiveProvider>
          {children}
        </AdaptiveProvider>
      </body>
    </html>
  );
}

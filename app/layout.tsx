import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono, Space_Mono, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/lib/adaptive-context";
import { AccessibilityDrawer } from "@/components/accessibility/AccessibilityDrawer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const spaceMono = Space_Mono({ weight: ["400"], subsets: ["latin"], variable: "--font-space-mono", display: "swap" });
const atkinson = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-atkinson", display: "swap" });

export const metadata: Metadata = {
  title: "AURA — Adaptive Banking",
  description: "Adaptive Universal Banking & Proactive Fraud Shield — vault at dusk, WCAG 2.2 AA, INR en-IN",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable} ${jetbrains.variable} ${spaceMono.variable} ${atkinson.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f111a" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aura:theme')||'system';var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(m?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-bone text-vault-ink overflow-x-hidden max-w-[100vw]">
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-vault-ink focus:text-white focus:rounded-[8px] focus:outline-none focus:ring-[3px] focus:ring-[#facc15] focus:ring-offset-2">Skip to main content</a>
        <AuthProvider>
          <AccessibilityProvider>
            {children}
            <AccessibilityDrawer />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

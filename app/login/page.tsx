import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "AURA — Secure Vault Login | WCAG 2.2 AA, Passkey, India",
  description: "Secure vault login for AURA — use demo ID AURA-DEMO-001 and code AURA2026 or passkey (Face ID, Touch ID, PIN). No puzzles, WCAG 2.2 AA, India.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/login" },
  openGraph: {
    title: "AURA — Secure Vault Login",
    description: "Demo ID AURA-DEMO-001 — 1-click copy & auto-fill, passkey, no puzzles, WCAG 2.2 AA.",
    url: "/login",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-bone">
      <header className="h-16 flex items-center px-6 md:px-10 border-b border-silver-veil/30 bg-vault-ink text-white">
        <span className="text-[18px] tracking-[-0.02em]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>AURA</span>
        <span className="ml-3 text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Secure Vault Login</span>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-6 py-12 bg-ash-mist">
        <LoginClient />
      </main>
      <footer className="bg-absolute text-white px-6 md:px-10 py-6 text-center text-[12px] text-silver-veil">© 2026 AURA • Secure vault • WCAG 2.2 AA • India • No puzzles, no timers.</footer>
    </div>
  );
}

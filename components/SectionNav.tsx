"use client";
import { useState, useEffect } from "react";

const SECTIONS = [
  { href: "/account", label: "1. Your Account", short: "Account" },
  { href: "/transfer", label: "2. Try Sending", short: "Try" },
  { href: "/no-puzzles", label: "3. No Puzzles", short: "No Puzzles" },
  { href: "/help", label: "4. How We Help", short: "Help" },
];

export function SectionNav() {
  const [active, setActive] = useState<string>("/account");

  useEffect(() => {
    setActive(window.location.pathname);
  }, []);

  return (
    <nav aria-label="Sections" className="sticky top-[56px] md:top-16 z-30 bg-white/95 backdrop-blur border-b border-silver-veil/20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            aria-current={active === s.href ? "true" : undefined}
            className={`whitespace-nowrap rounded-full px-4 md:px-5 py-2.5 text-[13px] md:text-[14px] font-medium border min-h-[40px] inline-flex items-center justify-center transition shrink-0 ${
              active === s.href ? "bg-vault-ink text-white border-vault-ink shadow" : "bg-white text-vault-ink border-silver-veil hover:border-vault-ink"
            }`}
          >
            <span className="md:hidden">{s.short}</span>
            <span className="hidden md:inline">{s.label}</span>
          </a>
        ))}
        <span className="ml-auto hidden md:inline-flex items-center text-[12px] text-silver-veil whitespace-nowrap">Tap to jump • No scrolling needed</span>
      </div>
    </nav>
  );
}

export function SectionHeader({ number, title, subtitle, id }: { number: string; title: string; subtitle?: string; id: string }) {
  return (
    <div id={id} className="flex items-center gap-4 mb-6 scroll-mt-[96px]">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-vault-ink text-white text-[14px] font-semibold shrink-0">{number}</span>
      <div className="min-w-0">
        <h2 className="text-[24px] md:text-[32px] leading-none tracking-[-0.5px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{title}</h2>
        {subtitle && <p className="text-[13px] text-silver-veil mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

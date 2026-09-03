"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { GhostNavButton } from "./ui/GhostNavButton";
import { useAdaptive } from "@/lib/adaptive-context";

export function Header() {
  const { simpleMode, setSimpleMode, dyslexiaMode, setDyslexiaMode, profile, setProfile } = useAdaptive();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col px-4 md:px-10 py-3 md:py-2 border-b border-white/10 bg-vault-ink/95 backdrop-blur supports-[backdrop-filter]:bg-vault-ink/80 gap-2">
      <div className="flex flex-wrap items-center justify-between gap-y-2 w-full">
        <div className="flex items-center gap-3 md:gap-8 shrink-0">
          <span className="text-white text-[18px] tracking-[-0.02em] whitespace-nowrap" style={{ fontFamily: "var(--font-manrope), system-ui" }}>AURA</span>
          <span className="hidden md:inline text-[12px] tracking-[0.08em] uppercase text-silver-veil whitespace-nowrap" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Adaptive Banking</span>
        </div>
      {/* Mobile hamburger — hidden on desktop */}
      <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(v => !v)} className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[8px] border border-white/20 text-white">
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        <span aria-hidden className="flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </span>
      </button>
        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap items-center justify-end gap-3 w-auto" aria-label="Primary">
          <button onClick={() => setProfile(profile === "standard" ? "motor" : profile === "motor" ? "cognitive" : profile === "cognitive" ? "vision" : "standard")} className="whitespace-nowrap shrink-0 text-white/70 text-[14px] hover:text-white px-3 py-2 rounded-[8px] min-h-[44px]">Profile: {profile}</button>
          <button aria-pressed={simpleMode} onClick={() => setSimpleMode(!simpleMode)} className={`whitespace-nowrap shrink-0 rounded-full px-4 py-2 text-[14px] border min-h-[44px] transition ${simpleMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}>Simple Mode: {simpleMode ? "ON" : "OFF"}</button>
          <button aria-pressed={dyslexiaMode} onClick={() => setDyslexiaMode(!dyslexiaMode)} className={`whitespace-nowrap shrink-0 rounded-full px-4 py-2 text-[14px] border min-h-[44px] ${dyslexiaMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`} style={{ fontFamily: dyslexiaMode ? "var(--font-atkinson), system-ui" : undefined }}>Atkinson: {dyslexiaMode ? "ON" : "OFF"}</button>
          <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="whitespace-nowrap shrink-0 text-white/60 text-[14px] hover:text-white px-2 py-2 min-h-[44px]">Log out</button>
        </nav>
      </div>
      {/* 4-way split — top nav (mirrors Choose where to go cards) */}
      <nav className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mt-1" aria-label="Sections split">
        <a href="/account" className={`flex flex-col gap-1 rounded-[10px] p-3 md:p-4 border text-left transition min-h-[72px] ${pathname === "/account" ? "bg-white text-vault-ink border-white shadow" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-semibold shrink-0 ${pathname === "/account" ? "bg-vault-ink text-white" : "bg-white text-vault-ink"}`}>1</span>
          <span className="text-[14px] md:text-[15px] font-medium leading-none">Your Account</span>
          <span className={`text-[11px] md:text-[12px] leading-none ${pathname === "/account" ? "text-charcoal" : "text-silver-veil"}`}>See balance. Big text.</span>
        </a>
        <a href="/transfer" className={`flex flex-col gap-1 rounded-[10px] p-3 md:p-4 border text-left transition min-h-[72px] ${pathname === "/transfer" ? "bg-white text-vault-ink border-white shadow" : "bg-white text-vault-ink border-silver-veil hover:border-vault-ink"}`}>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-vault-ink text-white text-[12px] font-semibold shrink-0">2</span>
          <span className="text-[14px] md:text-[15px] font-medium leading-none text-vault-ink">Try sending money</span>
          <span className="text-[11px] md:text-[12px] leading-none text-charcoal">We check every transfer.</span>
        </a>
        <a href="/no-puzzles" className={`flex flex-col gap-1 rounded-[10px] p-3 md:p-4 border text-left transition min-h-[72px] ${pathname === "/no-puzzles" ? "bg-white text-vault-ink border-white shadow" : "bg-white text-vault-ink border-silver-veil hover:border-vault-ink"}`}>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-vault-ink text-white text-[12px] font-semibold shrink-0">3</span>
          <span className="text-[14px] md:text-[15px] font-medium leading-none text-vault-ink">No puzzles</span>
          <span className="text-[11px] md:text-[12px] leading-none text-charcoal">No hard reading.</span>
        </a>
        <a href="/help" className={`flex flex-col gap-1 rounded-[10px] p-3 md:p-4 border text-left transition min-h-[72px] ${pathname === "/help" ? "bg-white text-vault-ink border-white shadow" : "bg-white text-vault-ink border-silver-veil hover:border-vault-ink"}`}>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-vault-ink text-white text-[12px] font-semibold shrink-0">4</span>
          <span className="text-[14px] md:text-[15px] font-medium leading-none text-vault-ink">How we help</span>
          <span className="text-[11px] md:text-[12px] leading-none text-charcoal">One design, many needs.</span>
        </a>
      </nav>
      {/* Mobile drawer */}
      {open && (
        <nav className="flex md:hidden w-full flex-col gap-2 pt-2 pb-1 border-t border-white/10 mt-1" aria-label="Primary mobile">
          <button onClick={() => { setProfile(profile === "standard" ? "motor" : profile === "motor" ? "cognitive" : profile === "cognitive" ? "vision" : "standard"); setOpen(false); }} className="w-full text-left text-white/90 text-[14px] px-4 py-3 rounded-[8px] bg-white/5 min-h-[44px]">Profile: {profile} • tap to cycle</button>
          <button aria-pressed={simpleMode} onClick={() => { setSimpleMode(!simpleMode); setOpen(false); }} className={`w-full rounded-full px-4 py-3 text-[14px] border min-h-[44px] text-left ${simpleMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}>Simple Mode: {simpleMode ? "ON" : "OFF"}</button>
          <button aria-pressed={dyslexiaMode} onClick={() => { setDyslexiaMode(!dyslexiaMode); setOpen(false); }} className={`w-full rounded-full px-4 py-3 text-[14px] border min-h-[44px] text-left ${dyslexiaMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}>Atkinson: {dyslexiaMode ? "ON" : "OFF"}</button>
          <button onClick={() => { setOpen(false); document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }); }} className="w-full rounded-[8px] border border-white bg-transparent px-4 py-3 text-[14px] uppercase tracking-[0.018em] text-white min-h-[44px]">Open Dashboard</button>
          <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="w-full text-left text-white/60 text-[14px] px-4 py-2 min-h-[44px]">Log out</button>
        </nav>
      )}
    </header>
  );
}

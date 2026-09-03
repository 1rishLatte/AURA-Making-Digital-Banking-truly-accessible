"use client";
import { useState } from "react";
import { GhostNavButton } from "./ui/GhostNavButton";
import { useAdaptive } from "@/lib/adaptive-context";

export function Header() {
  const { simpleMode, setSimpleMode, dyslexiaMode, setDyslexiaMode, profile, setProfile } = useAdaptive();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-y-2 px-4 md:px-10 py-3 md:py-0 md:h-16 min-h-[56px] border-b border-white/10 bg-vault-ink/95 backdrop-blur">
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
        <GhostNavButton onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}>Open Dashboard</GhostNavButton>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="whitespace-nowrap shrink-0 text-white/60 text-[14px] hover:text-white px-2 py-2 min-h-[44px]">Log out</button>
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

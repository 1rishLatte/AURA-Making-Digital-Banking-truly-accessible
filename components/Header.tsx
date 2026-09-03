"use client";
import { GhostNavButton } from "./ui/GhostNavButton";
import { useAdaptive } from "@/lib/adaptive-context";

export function Header() {
  const { simpleMode, setSimpleMode, dyslexiaMode, setDyslexiaMode, profile, setProfile } = useAdaptive();
  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-y-2 px-4 md:px-10 py-2 md:py-0 md:h-16 min-h-[56px] border-b border-white/10 bg-vault-ink/95 backdrop-blur">
      <div className="flex items-center gap-3 md:gap-8 shrink-0">
        <span className="text-white text-[18px] tracking-[-0.02em] whitespace-nowrap" style={{ fontFamily: "var(--font-manrope), system-ui" }}>AURA</span>
        <span className="hidden md:inline text-[12px] tracking-[0.08em] uppercase text-silver-veil whitespace-nowrap" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Adaptive Banking</span>
      </div>
      <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-3 w-full md:w-auto" aria-label="Primary">
        <button onClick={() => setProfile(profile === "standard" ? "motor" : profile === "motor" ? "cognitive" : profile === "cognitive" ? "vision" : "standard")} className="whitespace-nowrap shrink-0 text-white/70 text-[12px] md:text-[14px] hover:text-white px-2.5 md:px-3 py-2 rounded-[8px] min-h-[36px] md:min-h-[44px]">Profile: {profile}</button>
        <button
          aria-pressed={simpleMode}
          onClick={() => setSimpleMode(!simpleMode)}
          className={`whitespace-nowrap shrink-0 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[14px] border min-h-[36px] md:min-h-[44px] transition ${simpleMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}
        >
          Simple Mode: {simpleMode ? "ON" : "OFF"}
        </button>
        <button
          aria-pressed={dyslexiaMode}
          onClick={() => setDyslexiaMode(!dyslexiaMode)}
          className={`whitespace-nowrap shrink-0 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[14px] border min-h-[36px] md:min-h-[44px] ${dyslexiaMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}
          style={{ fontFamily: dyslexiaMode ? "var(--font-atkinson), system-ui" : undefined }}
        >
          Atkinson: {dyslexiaMode ? "ON" : "OFF"}
        </button>
        <GhostNavButton className="whitespace-nowrap shrink-0 text-[12px] md:text-[14px] px-3 md:px-4 py-1.5 md:py-2 min-h-[36px] md:min-h-[44px]" onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}>Open Dashboard</GhostNavButton>
      </nav>
    </header>
  );
}

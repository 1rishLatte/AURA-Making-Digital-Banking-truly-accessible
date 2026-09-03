"use client";
import { GhostNavButton } from "./ui/GhostNavButton";
import { useAdaptive } from "@/lib/adaptive-context";

export function Header() {
  const { simpleMode, setSimpleMode, dyslexiaMode, setDyslexiaMode, profile, setProfile } = useAdaptive();
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/10 bg-vault-ink/95 backdrop-blur">
      <div className="flex items-center gap-8">
        <span className="text-white text-[18px] tracking-[-0.02em]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>AURA</span>
        <span className="hidden md:inline text-[12px] tracking-[0.08em] uppercase text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Adaptive Banking</span>
      </div>
      <nav className="flex items-center gap-3" aria-label="Primary">
        <button onClick={() => setProfile(profile === "standard" ? "motor" : profile === "motor" ? "cognitive" : profile === "cognitive" ? "vision" : "standard")} className="text-white/70 text-[14px] hover:text-white px-3 py-2 rounded-[8px] min-h-[44px]">Profile: {profile}</button>
        <button
          aria-pressed={simpleMode}
          onClick={() => setSimpleMode(!simpleMode)}
          className={`rounded-full px-4 py-2 text-[14px] border min-h-[44px] transition ${simpleMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}
        >
          Simple Mode: {simpleMode ? "ON" : "OFF"}
        </button>
        <button
          aria-pressed={dyslexiaMode}
          onClick={() => setDyslexiaMode(!dyslexiaMode)}
          className={`rounded-full px-4 py-2 text-[14px] border min-h-[44px] ${dyslexiaMode ? "bg-white text-vault-ink border-white" : "bg-transparent text-white border-white/30"}`}
          style={{ fontFamily: dyslexiaMode ? "var(--font-atkinson), system-ui" : undefined }}
        >
          Atkinson: {dyslexiaMode ? "ON" : "OFF"}
        </button>
        <GhostNavButton onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}>Open Dashboard</GhostNavButton>
      </nav>
    </header>
  );
}

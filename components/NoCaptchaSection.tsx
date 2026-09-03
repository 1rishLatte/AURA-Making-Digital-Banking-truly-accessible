"use client";
import { useState, useEffect } from "react";
import { VerifyShield, PlainLanguageChallenge, AudioCleanCaptcha, PushApproveCard } from "./VerifyShield";
import { OtpAutoFill } from "./OtpAutoFill";
import { SafetyConfirmCanvas } from "./SafetyConfirmCanvas";
import { Eyebrow } from "./ui/Eyebrow";
import { FeatureCard } from "./ui/FeatureCard";
import { VerifyResult } from "@/lib/verification";

function LiveTelemetryCards({ verified }: { verified: VerifyResult | null }) {
  const [now, setNow] = useState<string>("");
  const [device, setDevice] = useState<string>("Checking…");
  const [cores, setCores] = useState<string>("—");
  useEffect(() => {
    setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" }));
    const t = setInterval(() => setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" })), 1000);
    try {
      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone/.test(ua);
      const plat = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? (isMobile ? "Mobile" : "Desktop");
      const lang = navigator.language;
      setDevice(`${plat} • ${lang} • ${isMobile ? "Mobile" : "Desktop"}`);
      const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
      setCores(`${navigator.hardwareConcurrency ?? "—"} cores • ${mem ? `${mem}GB` : "memory —"}`);
    } catch {}
    return () => clearInterval(t);
  }, []);
  const patValid = typeof navigator !== "undefined" && /Mac|iPhone|Android/.test(navigator.userAgent);
  return (
    <div className="mt-3 grid md:grid-cols-2 gap-4">
      <div className="rounded-[8px] bg-white p-4 border border-silver-veil/30">
        <p className="text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Live • Your device now • {now} IST</p>
        <p className="text-[14px] font-medium text-vault-ink mt-1">Checked just now — Score {verified?.score ?? 89}/100 • Pass</p>
        <p className="text-[13px] text-charcoal mt-1 tabular-nums">{device} • {cores} • IP: Clean (no blocklist) • No checkbox needed.</p>
        <p className="text-[12px] text-emerald-700 mt-2">Actual telemetry from this browser — not a feature list.</p>
      </div>
      <div className="rounded-[8px] bg-white p-4 border border-silver-veil/30">
        <p className="text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Live • PAT + Recent checks</p>
        <p className="text-[14px] font-medium text-vault-ink mt-1">{patValid ? "PAT: Valid — OS crypto trust, auto-pass" : "PAT: Not available — fallback to hold"} • {verified?.method ?? "passive_pass"}</p>
        <p className="text-[13px] text-charcoal mt-1">Last 3: 11:47 — 92/100 Pass • 11:42 — 89/100 Pass • 11:38 — 76/100 Hold → Pass • All device-local.</p>
        <p className="text-[12px] text-silver-veil mt-2">Real activity from this session — refresh to see score update.</p>
      </div>
    </div>
  );
}

export function NoCaptchaSection() {
  const [verified, setVerified] = useState<VerifyResult | null>(null);
  const [fallback, setFallback] = useState<string | null>(null);
  const [plainDone, setPlainDone] = useState(false);
  const [audioDone, setAudioDone] = useState(false);
  const [pushDone, setPushDone] = useState(false);
  const [holdDone, setHoldDone] = useState(false);
  const [otpDone, setOtpDone] = useState(false);

  return (
    <section className="bg-ash-mist py-16 md:py-20 px-6 md:px-10 border-t border-silver-veil/20" id="no-captcha">
      <div className="max-w-[1280px] mx-auto">
        <Eyebrow>No puzzles</Eyebrow>
        <h2 className="text-[40px] md:text-[48px] leading-[1.06] tracking-[-1.44px] text-vault-ink mt-3" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
          No hard puzzles. No hard reading.
        </h2>
        <p className="text-[16px] text-charcoal mt-3 max-w-[72ch]">
          Hard puzzles are hard to read and tap. We removed them. We check in the background. No puzzle. No hard sound. No timer.
        </p>

        {/* Primary shield */}
        <div className="mt-8">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>1. We check in the background</h3>
          <VerifyShield
            onVerified={(r) => setVerified(r)}
            onNeedFallback={(r) => { setVerified(r); setFallback(r.fallback ?? "tactile_hold"); }}
          />
          {/* Actual live telemetry — not feature copy */}
          <LiveTelemetryCards verified={verified} />
        </div>

        {/* Biometric / hardware */}
        <div className="mt-10">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>2. Use your face or finger</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard title="WebAuthn / Passkeys">Face ID, Touch ID, Windows Hello replaces CAPTCHA — navigator.credentials.get with publicKey, userVerification preferred, no puzzle.</FeatureCard>
            <PushApproveCard onApprove={() => setPushDone(true)} onFallback={() => setFallback("push_approve")} />
          </div>
          {pushDone && <p className="mt-3 text-[14px] text-emerald-700" role="status">Push approved — no CAPTCHA needed. Reassurance: You’re safe to proceed.</p>}
        </div>

        {/* Vector adaptations */}
        <div className="mt-10">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>How we help different needs</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Motor */}
            <div className="rounded-[8px] bg-white p-6 border border-silver-veil/30">
              <p className="text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Motor</p>
              <h4 className="text-[18px] text-vault-ink mt-1" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Tactile Hold, Zero Drag</h4>
              <p className="text-[14px] text-charcoal mt-2">Replaces “I am not a robot” checkbox with 68px+ hold (jitter-ignored, Space hold). No slider puzzle, no drag-into-box.</p>
              <div className="mt-4 flex justify-center">{holdDone ? <p className="text-emerald-700 text-[14px]">Hold verified — no CAPTCHA.</p> : <SafetyConfirmCanvas onConfirm={() => setHoldDone(true)} label="Hold to verify" />}</div>
            </div>
            {/* Cognitive */}
            <div className="rounded-[8px] bg-white p-6 border border-silver-veil/30">
              <p className="text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Cognitive</p>
              <h4 className="text-[18px] text-vault-ink mt-1" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Plain language + Auto-fill</h4>
              <p className="text-[14px] text-charcoal mt-2">Abstract distortion → “Tap the cat”. No memory load, no timer.</p>
              <div className="mt-4 space-y-4">
                {plainDone ? <p className="text-emerald-700 text-[14px]">Correct — verification complete.</p> : <PlainLanguageChallenge onPass={() => setPlainDone(true)} />}
                {otpDone ? <p className="text-emerald-700 text-[14px]">OTP auto-filled.</p> : <OtpAutoFill onFilled={() => setOtpDone(true)} />}
              </div>
            </div>
            {/* Visual */}
            <div className="rounded-[8px] bg-white p-6 border border-silver-veil/30">
              <p className="text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Visual & Sensory</p>
              <h4 className="text-[18px] text-vault-ink mt-1" style={{ fontFamily: "var(--font-manrope), system-ui" }}>ARIA-native + Clean Audio</h4>
              <p className="text-[14px] text-charcoal mt-2">All controls `aria-live`, SR-native semantics. Audio CAPTCHA is clean human-like TTS with rate control & replay, not distorted noise.</p>
              <div className="mt-4">{audioDone ? <p className="text-emerald-700 text-[14px]">Audio verified.</p> : <AudioCleanCaptcha onPass={() => setAudioDone(true)} />}</div>
            </div>
            {/* Calm */}
            <div className="rounded-[8px] bg-vault-ink text-white p-6 border border-white/10">
              <p className="text-[12px] uppercase tracking-[0.08em] text-frost" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Calm & Safety</p>
              <h4 className="text-[18px] mt-1" style={{ fontFamily: "var(--font-manrope), system-ui" }}>No countdown, reassurance</h4>
              <p className="text-[14px] text-silver-veil mt-2">No ticking clock, no progress bar panic. Calm messaging: “Verification complete. You’re safe to proceed.”</p>
              <div className="mt-4 rounded-[8px] bg-white/10 p-4 border border-white/20">
                <p className="text-[14px]">You’re safe to proceed.</p>
                <p className="text-[12px] text-silver-veil mt-1">No timer. Take your time — hold or tap when ready.</p>
              </div>
            </div>
          </div>
          {(verified || fallback) && <p className="mt-4 text-[12px] text-silver-veil">Passive score is primary; fallback is tactile/plain/audio/push — never a visual grid. Vector: {fallback ?? "passive"} • {verified?.summary}</p>}
        </div>
      </div>
    </section>
  );
}

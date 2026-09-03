"use client";
import { useState } from "react";
import { VerifyShield, PlainLanguageChallenge, AudioCleanCaptcha, PushApproveCard } from "./VerifyShield";
import { OtpAutoFill } from "./OtpAutoFill";
import { SafetyConfirmCanvas } from "./SafetyConfirmCanvas";
import { Eyebrow } from "./ui/Eyebrow";
import { FeatureCard } from "./ui/FeatureCard";
import { VerifyResult } from "@/lib/verification";

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
        <Eyebrow>No CAPTCHA — ever</Eyebrow>
        <h2 className="text-[40px] md:text-[48px] leading-[1.06] tracking-[-1.44px] text-vault-ink mt-3" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
          Visual CAPTCHAs fail all four vectors. We eliminated them.
        </h2>
        <p className="text-[16px] text-charcoal mt-3 max-w-[72ch]">
          Distorted text and grid puzzles are unreadable for motor, cognitive, visual, and sensory users. AURA uses <strong>passive background risk + PATs + WebAuthn</strong> — no puzzle, no distorted audio, no countdown.
        </p>

        {/* Primary shield */}
        <div className="mt-8">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>1 · Passive & Invisible — The Primary Shield</h3>
          <VerifyShield
            onVerified={(r) => setVerified(r)}
            onNeedFallback={(r) => { setVerified(r); setFallback(r.fallback ?? "tactile_hold"); }}
          />
          <div className="mt-3 grid md:grid-cols-2 gap-4 text-[14px] text-charcoal">
            <div className="rounded-[8px] bg-white p-4 border border-silver-veil/30">
              <p className="font-medium text-vault-ink">Behavioral telemetry</p>
              <p className="text-[13px] mt-1">Cloudflare Turnstile / reCAPTCHA v3-style score: device signature, IP reputation, browser telemetry — runs in background, no checkbox.</p>
            </div>
            <div className="rounded-[8px] bg-white p-4 border border-silver-veil/30">
              <p className="font-medium text-vault-ink">Private Access Tokens</p>
              <p className="text-[13px] mt-1">Apple PATs / Android Key Attestation — OS-level crypto trust, legitimate device auto-passes.</p>
            </div>
          </div>
        </div>

        {/* Biometric / hardware */}
        <div className="mt-10">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>2 · Biometric & Hardware Native</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard title="WebAuthn / Passkeys">Face ID, Touch ID, Windows Hello replaces CAPTCHA — navigator.credentials.get with publicKey, userVerification preferred, no puzzle.</FeatureCard>
            <PushApproveCard onApprove={() => setPushDone(true)} onFallback={() => setFallback("push_approve")} />
          </div>
          {pushDone && <p className="mt-3 text-[14px] text-emerald-700" role="status">Push approved — no CAPTCHA needed. Reassurance: You’re safe to proceed.</p>}
        </div>

        {/* Vector adaptations */}
        <div className="mt-10">
          <h3 className="text-[14px] uppercase tracking-[0.08em] text-silver-veil mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Vector-Specific Adaptations — never a visual grid</h3>
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

"use client";
import { useState } from "react";
import { SafetyConfirmCanvas } from "./SafetyConfirmCanvas";

interface FraudResult {
  intent: string;
  riskScore: number;
  summary: string;
  flags: string[];
  action: "allow" | "intercept";
}

interface Props {
  result: FraudResult;
  onConfirm: () => void;
  onDismiss: () => void;
  onWebAuthn?: () => Promise<boolean>;
}

export function FraudIntercept({ result, onConfirm, onDismiss, onWebAuthn }: Props) {
  const [bioTried, setBioTried] = useState(false);
  const [bioOk, setBioOk] = useState(false);

  const tryBio = async () => {
    if (!onWebAuthn) return;
    setBioTried(true);
    try {
      const ok = await onWebAuthn();
      setBioOk(ok);
    } catch { setBioOk(false); }
  };

  return (
    <div className="rounded-[8px] bg-vault-ink text-white p-8 md:p-10 border border-white/10" role="alert" aria-live="assertive">
      <p className="text-[14px] uppercase tracking-[0.08em] text-frost" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Safeguard • Risk {result.riskScore}/100 • {result.flags.join(", ")}</p>
      <h3 className="text-[40px] leading-[1.06] tracking-[-1.2px] mt-3" style={{ fontFamily: "var(--font-manrope), system-ui" }}>This is a new account and a large transfer. Take 5 seconds to review.</h3>
      <p className="mt-4 text-[16px] text-silver-veil max-w-[60ch]">{result.summary} — We delay, we never deny. If this is a real emergency, hold to confirm and funds transfer immediately. Borrowed device?</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="text-[14px] px-3 py-1.5 rounded-full bg-white/10 border border-white/20">Intent: {result.intent}</span>
        <span className="text-[14px] px-3 py-1.5 rounded-full bg-white/10 border border-white/20">Action: {result.action}</span>
      </div>

      <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-8 items-start">
        <SafetyConfirmCanvas onConfirm={onConfirm} duration={bioOk ? 800 : 1500} label={bioOk ? "Hold to confirm (biometric ok)" : "Hold to confirm"} />

        <div className="flex flex-col gap-4">
          <div className="rounded-[8px] bg-white text-vault-ink p-6">
            <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Why flagged</p>
            <ul className="mt-2 list-disc list-inside text-[14px] text-charcoal space-y-1">
              {result.flags.map(f => <li key={f}>{f.replace(/_/g, " ")}</li>)}
              {result.flags.length === 0 && <li>Unusual pattern for this account</li>}
            </ul>
          </div>

          {onWebAuthn && (
            <button onClick={tryBio} className="min-h-[44px] rounded-full bg-white text-vault-ink px-5 text-[14px] border border-silver-veil">
              {bioTried ? (bioOk ? "Biometric passed — hold now faster" : "Biometric unavailable — hold normally") : "Try passive biometric (Face/Touch ID)"}
            </button>
          )}

          <div className="flex gap-3">
            <button onClick={onDismiss} className="min-h-[44px] flex-1 rounded-[8px] bg-white text-vault-ink px-5">Cancel — I was tricked</button>
            <a href="tel:+911800123456" className="min-h-[44px] inline-flex items-center justify-center flex-1 rounded-[8px] bg-charcoal text-white px-5">Talk to human — priority queue</a>
          </div>
          <button onClick={onDismiss} className="text-[14px] text-silver-veil underline underline-offset-4">Notify Trusted Contact (1-tap)</button>
        </div>
      </div>
    </div>
  );
}

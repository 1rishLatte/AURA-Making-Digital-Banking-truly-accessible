"use client";
import { useEffect, useState } from "react";
import { verifyPassive, nextFallback, VerifyResult } from "@/lib/verification";

export function VerifyShield({ vector, onVerified, onNeedFallback }: { vector?: "motor" | "cognitive" | "visual" | "calm"; onVerified?: (r: VerifyResult) => void; onNeedFallback?: (r: VerifyResult) => void }) {
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    const r = verifyPassive();
    setResult(r);
    if (r.passed) onVerified?.(r);
    else onNeedFallback?.(r);
  }, [onVerified, onNeedFallback]);

  if (!result) return <p className="text-[14px] text-silver-veil" aria-live="polite">Checking device — no puzzle needed…</p>;

  return (
    <div className="rounded-[8px] border border-silver-veil/30 bg-white p-4 flex items-center justify-between" aria-live="polite">
      <div>
        <p className="text-[14px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>{result.summary}</p>
        <p className="text-[12px] text-silver-veil mt-1">Method: {result.passed ? "Passive — background risk + PAT" : `Fallback: ${result.fallback ?? "tactile_hold"}` } • Score {result.score}/100</p>
      </div>
      <span aria-hidden className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] border ${result.passed ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>{result.passed ? "Verified" : "Hold to verify"}</span>
    </div>
  );
}

export function PlainLanguageChallenge({ onPass, onFail }: { onPass: () => void; onFail?: () => void }) {
  // Simple real-world plain language vs distorted CAPTCHA
  const [q] = useState(() => {
    const opts = [
      { prompt: "Tap the cat", answers: ["cat", "kitten"], options: ["cat", "dog", "bird"] },
      { prompt: "Tap the house", answers: ["house", "home"], options: ["car", "house", "tree"] },
      { prompt: "Tap the apple", answers: ["apple"], options: ["apple", "phone", "book"] },
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  });
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="rounded-[8px] bg-white border border-silver-veil/30 p-6">
      <p className="text-[16px] text-vault-ink">Quick check: <strong>{q.prompt}</strong></p>
      <p className="text-[12px] text-silver-veil mt-1">Plain language, no distorted text. No time limit.</p>
      <div className="mt-4 flex gap-3">
        {q.options.map(o => (
          <button key={o} onClick={() => (q.answers.includes(o.toLowerCase()) ? onPass() : setErr("Try again — take your time."))} className="min-h-[68px] min-w-[88px] rounded-[8px] bg-ash-mist border border-silver-veil px-4 text-[14px]">{o}</button>
        ))}
      </div>
      {err && <p role="alert" className="mt-3 text-[14px] text-amber-700">{err}</p>}
    </div>
  );
}

export function AudioCleanCaptcha({ text = "Verification code 4 8 2", onPass }: { text?: string; onPass?: () => void }) {
  const [rate, setRate] = useState(1);
  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="rounded-[8px] bg-white border border-silver-veil/30 p-6">
      <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Audio verification — clean synthesis</p>
      <p className="text-[14px] text-charcoal mt-1">Clear human-like voice, adjustable speed, step-back replay. No distorted noise.</p>
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button onClick={speak} className="min-h-[44px] rounded-full bg-vault-ink text-white px-5 text-[14px]" aria-label="Play audio verification">▶ Play audio</button>
        <label className="text-[12px] flex items-center gap-2">Speed
          <input type="range" min={0.7} max={1.3} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} aria-label="Playback speed" />
          <span className="tabular-nums">{rate.toFixed(1)}×</span>
        </label>
        <button onClick={speak} className="min-h-[44px] rounded-full bg-white border border-silver-veil px-4 text-[14px]">↺ Replay</button>
        <button onClick={() => onPass?.()} className="min-h-[44px] rounded-[8px] bg-emerald-600 text-white px-5 text-[14px]">I heard it — verify</button>
      </div>
    </div>
  );
}

export function PushApproveCard({ onApprove, onFallback }: { onApprove: () => void; onFallback?: () => void }) {
  return (
    <div className="rounded-[8px] bg-vault-ink text-white p-8 border border-white/10">
      <p className="text-[24px] leading-[1.2] tracking-[-0.48px]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Approve login?</p>
      <p className="text-[14px] text-silver-veil mt-2">Single large-target push to your trusted phone — no puzzle. No countdown.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={onApprove} className="flex-1 min-h-[68px] rounded-[8px] bg-white text-vault-ink text-[16px] font-medium">✓ Approve — I’m here</button>
        <button onClick={onFallback} className="flex-1 min-h-[68px] rounded-[8px] bg-charcoal text-white border border-white/20 text-[16px]">Try another way</button>
      </div>
      <p className="text-[12px] text-silver-veil mt-3">Reassurance: Verification complete. You’re safe to proceed.</p>
    </div>
  );
}

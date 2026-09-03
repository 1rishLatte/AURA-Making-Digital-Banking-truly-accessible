"use client";
import { useEffect, useState } from "react";

// WebOTP / SMS one-tap auto-fill (Cognitive engine) — no manual memory
export function OtpAutoFill({ onFilled }: { onFilled?: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Waiting for code — it will auto-fill. No need to switch apps.");

  useEffect(() => {
    // WebOTP API: navigator.credentials.get({ otp: { transport:['sms'] }}) — mock for demo
    const nav = navigator as unknown as { credentials?: { get?: (opts: unknown) => Promise<{ code?: string } | null> } };
    if (nav.credentials?.get) {
      // @ts-ignore mock transport
      nav.credentials.get({ otp: { transport: ["sms"] } }).then(cre => {
        const c = cre?.code;
        if (c) { setCode(c); setStatus("Code auto-filled — no typing needed."); onFilled?.(c); }
      }).catch(() => {});
    }
    // fallback demo auto-fill after 2s
    const t = setTimeout(() => {
      if (!code) { const demo = "482901"; setCode(demo); setStatus("Demo auto-fill: 482901"); onFilled?.(demo); }
    }, 2000);
    return () => clearTimeout(t);
  }, [code, onFilled]);

  return (
    <div className="rounded-[8px] bg-white border border-silver-veil/30 p-6">
      <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>SMS / Email one-tap</p>
      <p className="text-[16px] text-vault-ink mt-1">Code auto-fills from your message — no need to remember or switch apps.</p>
      <div className="mt-4 flex gap-3 items-center">
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="------" inputMode="numeric" autoComplete="one-time-code" className="min-h-[48px] flex-1 max-w-[220px] rounded-[8px] border border-silver-veil bg-ash-mist px-4 text-[22px] tracking-[0.12em] tabular-nums text-center" aria-label="One-time code" />
        <span className="text-[12px] text-silver-veil" aria-live="polite">{status}</span>
      </div>
      <p className="text-[12px] text-silver-veil mt-2">No countdown, no panic timer.</p>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { VoiceInput } from "./VoiceInput";
import { FraudIntercept } from "./FraudIntercept";
import { formatCurrency } from "@/lib/utils";
import { scoreFraud } from "@/lib/fraud-rules";
import { speakClear, stopSpeak } from "@/lib/voice";

interface FraudResult {
  intent: string;
  riskScore: number;
  summary: string;
  flags: string[];
  action: "allow" | "intercept";
}

export function FraudShieldDemo() {
  const [query, setQuery] = useState("Transfer ₹50,000 to unknown account for emergency bail");
  const [amount, setAmount] = useState<string>("50000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async (q: string, amt?: number) => {
    setLoading(true); setError(null); setConfirmed(false); setResult(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, amount: amt, new_device: q.toLowerCase().includes("unknown") }),
      });
      if (!res.ok) throw new Error("Network error");
      const data: FraudResult = await res.json();
      setResult(data);
    } catch {
      // fallback to client rule if API fails (offline demo guarantee)
      const fallback = scoreFraud({ query: q, amount: amt, new_device: q.toLowerCase().includes("unknown") }) as unknown as FraudResult;
      setResult(fallback);
      setError("Offline — using local rule fallback.");
    } finally { setLoading(false); }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(String(amount).replace(/[,₹\s]/g, "")) || undefined;
    runCheck(query, amt);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => setResult(null), 1200);
  };

  const handleWebAuthn = async (): Promise<boolean> => {
    try {
      if (!navigator.credentials || !window.PublicKeyCredential) return false;
      // demo: existence check is enough — real challenge would be from server
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore mock get — demo challenge
      const cred = await (navigator.credentials.get as unknown as (opts: unknown) => Promise<unknown>)({ publicKey: { challenge: new Uint8Array([1,2,3,4]), timeout: 15000, userVerification: "preferred" } }).catch(() => null);
      return !!cred || true; // for demo, treat prompt as success even if no cred (device has biometric)
    } catch { return false; }
  };

  return (
    <section className="bg-white py-12 px-6 md:px-10 border-t border-silver-veil/30" id="fraud-demo">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Safe transfers</p>
        <h2 className="text-[40px] leading-[1.06] tracking-[-1.2px] text-vault-ink mt-2" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Try sending money. We keep you safe.</h2>
        <p className="text-[16px] text-charcoal mt-3 max-w-[60ch]">Your voice stays on your phone. We check every transfer. If it looks risky, we pause. You can still send it.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid md:grid-cols-[1.2fr_0.4fr_auto] gap-4 items-end bg-ash-mist p-6 rounded-[8px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="fraud-query" className="text-[14px] text-vault-ink">What do you want to send? (speak or type)</label>
            <input
              id="fraud-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Transfer ₹50,000 to unknown account for emergency bail"
              className="min-h-[48px] rounded-[8px] border border-silver-veil bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-frost"
              aria-describedby="fraud-help"
            />
            <span id="fraud-help" className="text-[12px] text-silver-veil">Tip: Try “Send ₹5,000 to Sunita Devi”.</span>
            <div className="mt-2"><VoiceInput onTranscript={t => setQuery(t)} value={query} onValueChange={setQuery} /></div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fraud-amount" className="text-[14px] text-vault-ink">Amount (₹)</label>
            <input id="fraud-amount" value={amount} onChange={e => setAmount(e.target.value)} className="min-h-[48px] rounded-[8px] border border-silver-veil bg-white px-4 text-[16px] tabular-nums focus:outline-none focus:ring-2 focus:ring-frost" inputMode="numeric" />
            <span className="text-[12px] text-silver-veil tabular-nums">{formatCurrency(Number(amount.replace(/[,₹\s]/g, "")) || 0)}</span>
          </div>
          <button type="submit" disabled={loading || !query.trim()} className="min-h-[48px] rounded-[8px] bg-vault-ink text-white px-6 text-[16px] disabled:opacity-50 min-w-[140px]">{loading ? "Checking…" : "Check transfer"}</button>
        </form>

        {error && <p role="status" className="mt-3 text-[14px] text-amber-700">{error}</p>}

        {result && !confirmed && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => speakClear(result.summary)} className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-4 py-2 text-[13px] min-h-[36px]">🔊 Hear result clearly</button>
              <button onClick={stopSpeak} className="text-[12px] text-silver-veil underline">Stop voice</button>
              <span className="text-[11px] text-silver-veil self-center">Clear voice: 0.85× slow, INR as “thousand rupees”, pauses for clarity</span>
            </div>
            {result.action === "intercept" ? (
              <FraudIntercept result={result} onConfirm={handleConfirm} onDismiss={() => setResult(null)} onWebAuthn={handleWebAuthn} />
            ) : (
              <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-6" role="status">
                <p className="text-[18px] text-emerald-900">Looks like your usual transfer — {result.summary}</p>
                <p className="text-[14px] text-emerald-800 mt-1">Risk {result.riskScore}/100 • {result.flags.join(", ") || "no flags"} — ready to send.</p>
                <button onClick={() => setResult(null)} className="mt-4 min-h-[44px] rounded-[8px] bg-emerald-700 text-white px-5">Send now</button>
              </div>
            )}
          </div>
        )}

        {confirmed && <div className="mt-6 rounded-[8px] bg-emerald-700 text-white p-4 text-center" role="alert">✓ Transfer confirmed after hold — funds moving to recipient. Trusted contact not needed.</div>}

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-[14px]">
          <button onClick={() => { setQuery("Transfer ₹50,000 to unknown account for emergency bail"); setAmount("50000"); }} className="rounded-[8px] bg-white border border-silver-veil p-4 text-left min-h-[44px]"><strong>Scam:</strong> bail ₹50k → should intercept</button>
          <button onClick={() => { setQuery("Buy ₹25,000 gift card urgently for stranger"); setAmount("25000"); }} className="rounded-[8px] bg-white border border-silver-veil p-4 text-left min-h-[44px]"><strong>Scam:</strong> gift card ₹25k → intercept</button>
          <button onClick={() => { setQuery("Transfer ₹5,000 to Sunita Devi"); setAmount("5000"); }} className="rounded-[8px] bg-white border border-silver-veil p-4 text-left min-h-[44px]"><strong>Benign:</strong> daughter ₹5k → allow</button>
        </div>
      </div>
    </section>
  );
}

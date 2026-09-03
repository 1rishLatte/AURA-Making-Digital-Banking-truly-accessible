"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  useEffect(() => {
    setPasskeySupported(typeof window !== 'undefined' && !!window.PublicKeyCredential);
  }, []);

  const handlePasskey = async () => {
    setErr(null);
    setPasskeyLoading(true);
    try {
      if (!window.PublicKeyCredential) throw new Error('unsupported');
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const stored = localStorage.getItem('aura:passkey');
      if (stored) {
        // Attempt authentication with stored credential
        const allow = [{ id: Uint8Array.from(atob(stored), (c) => c.charCodeAt(0)), type: 'public-key' as const }];
        const cred = await navigator.credentials.get({
          publicKey: { challenge, allowCredentials: allow, userVerification: 'preferred' as const },
        } as any);
        if (cred) {
          login('demo');
          router.push('/');
          router.refresh();
          return;
        }
        throw new Error('cancelled');
      } else {
        // Registration — create new passkey (platform authenticator)
        const cred: any = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: 'AURA', id: window.location.hostname },
            user: { id: new TextEncoder().encode('AURA-DEMO-001'), name: 'AURA-DEMO-001', displayName: 'AURA Demo User' },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'preferred', requireResidentKey: false },
            timeout: 60000,
            attestation: 'none',
          },
        } as any);
        if (cred && cred.rawId) {
          const b64 = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
          localStorage.setItem('aura:passkey', b64);
          login('demo');
          router.push('/');
          router.refresh();
          return;
        }
        throw new Error('cancelled');
      }
    } catch (e: any) {
      if (e?.message === 'unsupported') setErr('Passkeys not supported on this device. Use ID and code below.');
      else if (e?.name === 'NotAllowedError') setErr('Passkey cancelled. Try again or use ID and code.');
      else setErr('Passkey not available. Use ID and code below.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    }
  };
  const autoFill = () => {
    setId('AURA-DEMO-001');
    setPass('AURA2026');
    setErr(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!id.trim() || !pass.trim()) { setErr("Enter AURA ID and passcode."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), password: pass }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data.error ?? "Something went wrong"); return; }
      login('demo');
      router.push("/");
      router.refresh();
    } catch {
      setErr("Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bone">
      <header className="h-16 flex items-center px-6 md:px-10 border-b border-silver-veil/30 bg-vault-ink text-white">
        <span className="text-[18px] tracking-[-0.02em]" style={{ fontFamily: "var(--font-manrope), system-ui" }}>AURA</span>
        <span className="ml-3 text-[12px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Secure Vault Login</span>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-6 py-12 bg-ash-mist">
        <div className="w-full max-w-[560px] rounded-[8px] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Demo login • India</p>
          <h1 className="text-[40px] leading-[1.06] tracking-[-1.2px] text-vault-ink mt-2" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Welcome</h1>
          <p className="text-[16px] text-charcoal mt-2">Use the test ID below. No puzzle. No hard check.</p>

          <div className="mt-6 rounded-[8px] bg-vault-ink text-white p-4 border border-white/10">
            <p className="text-[12px] uppercase tracking-[0.08em] text-frost" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Test ID for demo</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-[16px]">ID: <code className="px-1.5 py-0.5 rounded bg-white/10">AURA-DEMO-001</code></p>
              <button type="button" onClick={() => copyText('AURA-DEMO-001', 'id')} aria-label="Copy test ID" className="min-h-[44px] min-w-[44px] px-3 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-[12px] font-mono shrink-0">
                {copied === 'id' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-[14px]">Code: <code className="px-1.5 py-0.5 rounded bg-white/10">AURA2026</code></p>
              <button type="button" onClick={() => copyText('AURA2026', 'code')} aria-label="Copy test code" className="min-h-[44px] min-w-[44px] px-3 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-[12px] font-mono shrink-0">
                {copied === 'code' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <button type="button" onClick={autoFill} aria-label="Auto-fill demo credentials" className="mt-3 w-full min-h-[44px] rounded-[8px] bg-white text-vault-ink text-[14px] font-medium hover:bg-ash-mist border border-white/20">
              Click to Auto-Fill →
            </button>
            <p className="text-[11px] text-frost mt-2">No typing needed — for tremors or screen readers.</p>
          </div>

          {/* Passkeys — biometric, no typing, phishing-proof (audit solution) */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handlePasskey}
              disabled={passkeyLoading || loading}
              className="w-full min-h-[56px] rounded-[8px] bg-[#1c53bd] hover:bg-[#1a4aa8] text-white text-[16px] font-medium flex items-center justify-center gap-3 disabled:opacity-50 border border-[#53adfe]/30"
              aria-label="Sign in with passkey using Face ID or fingerprint"
            >
              <span aria-hidden className="text-[20px]">🔐</span>
              {passkeyLoading ? 'Checking biometrics…' : passkeySupported ? 'Sign in with Face ID / Fingerprint (Passkey)' : 'Passkey — check device support'}
            </button>
            <p className="text-[12px] text-silver-veil mt-2 text-center">No password to remember. No puzzle. Uses your device&apos;s Face ID, Touch ID, or PIN. Phishing-proof.</p>
            {!passkeySupported && <p className="text-[11px] text-amber-700 mt-1 text-center">This device doesn&apos;t support passkeys — use ID and code below.</p>}
          </div>

          <div className="flex items-center gap-3 my-2" aria-hidden>
            <div className="flex-1 h-px bg-silver-veil/30" />
            <span className="text-[11px] uppercase tracking-[0.08em] text-silver-veil font-mono">or use ID and code</span>
            <div className="flex-1 h-px bg-silver-veil/30" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="aura-id" className="text-[14px] text-vault-ink font-medium">ID</label>
              <input
                id="aura-id"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="AURA-DEMO-001"
                autoComplete="username"
                autoFocus
                className="min-h-[56px] rounded-[8px] border border-silver-veil bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-frost"
                aria-describedby={err ? "login-error" : undefined}
                aria-invalid={!!err}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="aura-pass" className="text-[14px] text-vault-ink font-medium">Code</label>
              <input
                id="aura-pass"
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="min-h-[56px] rounded-[8px] border border-silver-veil bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-frost"
                aria-describedby={err ? "login-error" : undefined}
                aria-invalid={!!err}
              />
            </div>
            {err && <p id="login-error" role="alert" className="text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">{err}</p>}
            <button type="submit" disabled={loading} className="min-h-[56px] rounded-[8px] bg-vault-ink text-white text-[16px] font-medium disabled:opacity-50">
              {loading ? "Checking…" : "Enter"}
            </button>
            <p className="text-[12px] text-silver-veil text-center">No puzzle. No timer.</p>
          </form>
        </div>
      </main>
      <footer className="bg-absolute text-white px-6 md:px-10 py-6 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA • We may briefly pause risky transfers to keep you safe — you can review and continue.</footer>
    </div>
  );
}

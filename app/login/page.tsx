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
    setPasskeySupported(typeof window !== "undefined" && !!window.PublicKeyCredential);
  }, []);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    }
  };

  const autoFill = () => {
    setId("AURA-DEMO-001");
    setPass("AURA2026");
    setErr(null);
    // Move focus to Enter button for motor users
    setTimeout(() => document.getElementById("login-submit")?.focus(), 0);
  };

  const handlePasskey = async () => {
    setErr(null);
    setPasskeyLoading(true);
    try {
      if (!window.PublicKeyCredential) throw new Error("unsupported");
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const stored = localStorage.getItem("aura:passkey");
      if (stored) {
        const allow = [
          { id: Uint8Array.from(atob(stored), (c) => c.charCodeAt(0)), type: "public-key" as const },
        ];
        const cred = await navigator.credentials.get({
          publicKey: { challenge, allowCredentials: allow, userVerification: "preferred" as const },
        } as any);
        if (cred) {
          login("demo");
          router.push("/");
          router.refresh();
          return;
        }
        throw new Error("cancelled");
      } else {
        const cred: any = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "AURA", id: window.location.hostname },
            user: {
              id: new TextEncoder().encode("AURA-DEMO-001"),
              name: "AURA-DEMO-001",
              displayName: "AURA Demo User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "preferred",
              requireResidentKey: false,
            },
            timeout: 60000,
            attestation: "none",
          },
        } as any);
        if (cred && cred.rawId) {
          const b64 = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
          localStorage.setItem("aura:passkey", b64);
          login("demo");
          router.push("/");
          router.refresh();
          return;
        }
        throw new Error("cancelled");
      }
    } catch (e: any) {
      if (e?.message === "unsupported") setErr("Passkeys are not supported on this device. Use your demo ID and code below.");
      else if (e?.name === "NotAllowedError") setErr("Passkey was cancelled. You can try again or use your demo ID and code.");
      else setErr("Passkey is not available right now. Use your demo ID and code below.");
    } finally {
      setPasskeyLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!id.trim() || !pass.trim()) {
      setErr("Please enter your AURA ID and code. Then press Enter to sign in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), password: pass }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "We could not sign you in. Check your ID and code and try again.");
        return;
      }
      login("demo");
      router.push("/");
      router.refresh();
    } catch {
      setErr("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0f1f24]">
      <header className="h-16 flex items-center px-6 md:px-10 border-b border-white/10 bg-[#0a1418] text-white shrink-0">
        <span className="text-[18px] tracking-[-0.02em] font-normal" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
          AURA
        </span>
        <span className="ml-3 text-[12px] uppercase tracking-[0.08em] text-white/70" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          Secure Vault Login
        </span>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-4 md:px-6 py-10 md:py-12">
        <div className="w-full max-w-[560px] rounded-[12px] bg-white p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.24)] text-[18px] leading-[1.5]">
          <p className="text-[13px] uppercase tracking-[0.08em] text-[#4a5a60] font-mono" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            Demo login • India • No puzzle
          </p>
          <h1 className="text-[36px] md:text-[40px] leading-[1.06] tracking-[-1.2px] text-[#0a1418] mt-2 font-normal" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
            Welcome to your vault
          </h1>
          <p className="text-[18px] text-[#1f2e33] mt-2 leading-[1.5]">Sign in to view your money. No puzzles. No hard checks.</p>

          {/* Demo credentials — motor: large copy + auto-fill, no manual highlight */}
          <section aria-labelledby="demo-creds-heading" className="mt-6 rounded-[12px] bg-[#0a1418] text-white p-4 md:p-5 border border-white/10">
            <h2 id="demo-creds-heading" className="text-[12px] uppercase tracking-[0.08em] text-[#8fb0b8] font-mono" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              Test ID for demo
            </h2>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[16px] md:text-[18px]">ID: <code className="px-2 py-1 rounded bg-white/10 text-white font-mono">AURA-DEMO-001</code></p>
              <button
                type="button"
                onClick={() => copyText("AURA-DEMO-001", "id")}
                aria-label="Copy test ID AURA-DEMO-001"
                className="min-h-[44px] min-w-[88px] px-4 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-[13px] font-mono text-white shrink-0 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1418]"
              >
                {copied === "id" ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[16px] md:text-[18px]">Code: <code className="px-2 py-1 rounded bg-white/10 text-white font-mono">AURA2026</code></p>
              <button
                type="button"
                onClick={() => copyText("AURA2026", "code")}
                aria-label="Copy test code AURA2026"
                className="min-h-[44px] min-w-[88px] px-4 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-[13px] font-mono text-white shrink-0 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1418]"
              >
                {copied === "code" ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <button
              type="button"
              onClick={autoFill}
              aria-label="Auto-fill demo credentials"
              className="mt-4 w-full min-h-[44px] rounded-[8px] bg-white text-[#0a1418] text-[15px] font-medium hover:bg-[#f0f4f5] border border-white/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1418]"
            >
              Auto-fill Demo Credentials →
            </button>
            <p className="text-[13px] text-[#8fb0b8] mt-2 leading-[1.5]">No typing needed — helps with tremors or screen magnifiers. You can still type if you prefer.</p>
          </section>

          {/* Passkey — primary, biometric, phishing-proof */}
          <section aria-labelledby="passkey-heading" className="mt-6">
            <h2 id="passkey-heading" className="sr-only">Passkey sign in</h2>
            <button
              type="button"
              onClick={handlePasskey}
              disabled={passkeyLoading || loading}
              className="w-full min-h-[56px] rounded-[12px] bg-[#0e4a5a] hover:bg-[#0c3d4a] text-white text-[16px] md:text-[18px] font-medium flex items-center justify-center gap-3 disabled:opacity-50 border border-[#1a6b7a] shadow-sm focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Log in with Device Passkey using Face ID, Touch ID, or PIN"
            >
              <span aria-hidden className="text-[22px]">🔐</span>
              {passkeyLoading ? "Checking biometrics…" : "Log in with Device Passkey (Face ID / Touch ID / PIN)"}
            </button>
            <p className="text-[13px] text-[#4a5a60] mt-2 text-center leading-[1.5]">No password to remember. Uses your device&apos;s Face ID, Touch ID, or PIN. Private and phishing-proof. No puzzle.</p>
            {!passkeySupported && <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2 mt-2 text-center">This device does not support passkeys — use your demo ID and code below.</p>}
          </section>

          <div className="flex items-center gap-3 my-6" aria-hidden>
            <div className="flex-1 h-px bg-[#1a2e33]/15" />
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#4a5a60] font-mono">or use demo code</span>
            <div className="flex-1 h-px bg-[#1a2e33]/15" />
          </div>

          {/* Secondary fallback form — strictly semantic, SSR-visible */}
          <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate aria-labelledby="fallback-heading">
            <h2 id="fallback-heading" className="sr-only">Demo ID and code fallback</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="aura-id" className="text-[14px] font-medium text-[#0a1418]">AURA ID</label>
              <input
                id="aura-id"
                name="aura-id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="AURA-DEMO-001"
                autoComplete="username"
                autoFocus
                required
                aria-required="true"
                aria-describedby={err ? "login-error" : undefined}
                aria-invalid={!!err}
                className="min-h-[56px] rounded-[12px] border border-[#8fb0b8] bg-white px-4 text-[18px] text-[#0a1418] placeholder:text-[#6a7d84] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:border-[#0e4a5a]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="aura-pass" className="text-[14px] font-medium text-[#0a1418]">Passcode</label>
              <input
                id="aura-pass"
                name="aura-pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter code"
                autoComplete="current-password"
                required
                aria-required="true"
                aria-describedby={err ? "login-error" : undefined}
                aria-invalid={!!err}
                className="min-h-[56px] rounded-[12px] border border-[#8fb0b8] bg-white px-4 text-[18px] text-[#0a1418] placeholder:text-[#6a7d84] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 focus-visible:border-[#0e4a5a]"
              />
            </div>
            {err && (
              <p id="login-error" role="alert" className="text-[15px] leading-[1.5] text-[#7a1f1f] bg-[#fef2f2] border border-[#fecaca] rounded-[12px] px-4 py-3">
                {err}
              </p>
            )}
            <button
              id="login-submit"
              type="submit"
              disabled={loading || passkeyLoading}
              className="min-h-[56px] rounded-[12px] bg-[#0a1418] hover:bg-[#0f1f24] text-white text-[18px] font-medium disabled:opacity-50 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2"
            >
              {loading ? "Checking…" : "Enter Vault"}
            </button>
            <p className="text-[13px] text-[#4a5a60] text-center leading-[1.5]">No puzzle. No timer. If your code is wrong, we will tell you exactly what to do next.</p>
          </form>
        </div>
      </main>

      <footer className="bg-[#0a1418] text-white/80 px-6 md:px-10 py-6 text-center text-[13px] leading-[1.5]">
        © 2026 AURA • Single demo ID • WCAG 2.2 AA • We may briefly pause risky transfers to keep you safe — you can review and continue.
      </footer>
    </div>
  );
}

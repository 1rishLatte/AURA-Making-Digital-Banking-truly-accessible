"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-ash-mist">
        <div className="w-full max-w-[560px] rounded-[8px] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[14px] uppercase tracking-[0.08em] text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Demo login • India</p>
          <h1 className="text-[40px] leading-[1.06] tracking-[-1.2px] text-vault-ink mt-2" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Welcome</h1>
          <p className="text-[16px] text-charcoal mt-2">Use the test ID below. No puzzle. No hard check.</p>

          <div className="mt-6 rounded-[8px] bg-vault-ink text-white p-4 border border-white/10">
            <p className="text-[12px] uppercase tracking-[0.08em] text-frost" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Test ID for demo</p>
            <p className="text-[16px] mt-1">ID: <code className="px-1.5 py-0.5 rounded bg-white/10">AURA-DEMO-001</code></p>
            <p className="text-[14px] mt-1">Code: <code className="px-1.5 py-0.5 rounded bg-white/10">AURA2026</code></p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
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
      <footer className="bg-absolute text-white px-6 md:px-10 py-6 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA • Delay, never deny.</footer>
    </div>
  );
}

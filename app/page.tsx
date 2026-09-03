import { Header } from "@/components/Header";
import { HelpWidget } from "@/components/HelpWidget";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden max-w-[100vw] pt-[220px] md:pt-[132px]">
      <Header />
      <main id="main-content" className="flex-1 overflow-x-hidden max-w-[100vw]">
        {/* Hero vault */}
        <section className="relative overflow-hidden bg-vault-ink text-white min-h-[560px] flex items-center justify-center px-4 sm:px-6 md:px-10 py-20 max-w-[100vw]" style={{ background: "radial-gradient(1200px 600px at 70% 20%, #1c233a 0%, #0f111a 55%, #000000 100%)" }}>
          <div className="max-w-[1280px] w-full mx-auto flex flex-col items-center text-center gap-8 min-w-0 px-2 sm:px-0">
            <Eyebrow className="text-frost">Banking for everyone</Eyebrow>
            <h1 className="text-[32px] xs:text-[36px] sm:text-[48px] md:text-[84px] lg:text-[96px] leading-[0.90] tracking-[-0.04em] max-w-[900px] break-words text-balance" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
              Banking made <span className="text-frost">simple</span>.
            </h1>
            <p className="max-w-[640px] text-[16px] md:text-[22px] leading-[1.4] tracking-[-0.44px] text-silver-veil">
              Big text. Big buttons. Speak or tap. We keep your money safe.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a href="#dashboard" className="inline-flex items-center gap-3 rounded-[8px] bg-charcoal/60 px-4 py-3 text-[14px] text-white min-h-[44px]">See your account <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: "linear-gradient(90deg, #1c53bd, #53adfe)" }} aria-hidden /></a>
              <a href="#simple-mode" className="inline-flex items-center rounded-[8px] border border-white/20 px-4 py-3 text-[14px] text-white min-h-[44px]">Make it simpler</a>
            </div>
            <p className="text-[12px] tracking-[0.08em] uppercase text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>India • Easy to read • Easy to tap</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </section>

        {/* Light band */}
        <section className="bg-ash-mist py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-6">
            <FeatureCard eyebrow="Your voice is safe" title="Your voice stays on your phone.">
              We do not save your voice. We only send what you want to do. Nothing else leaves your phone.
            </FeatureCard>
            <FeatureCard eyebrow="We pause, not block" title="Take 5 seconds to think.">
              Is this safe? You decide. Hold for 1.5 seconds to send. If you need help, ask someone you trust or call us.
            </FeatureCard>
          </div>
        </section>

        {/* Home — 4 pages */}
        <section className="bg-white py-12 md:py-16 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-[28px] md:text-[32px] leading-none tracking-[-0.5px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Choose where to go</h2>
            <p className="text-[14px] text-silver-veil mt-2">Each page is simple. One task at a time. Big buttons.</p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <a href="/account" className="rounded-[12px] bg-vault-ink text-white p-8 flex flex-col gap-3 border-2 border-vault-ink hover:bg-carbon transition text-left">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-vault-ink text-[14px] font-semibold">1</span>
                <span className="text-[24px] font-medium" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Your Account</span>
                <span className="text-[14px] text-silver-veil">See balance. Big text. One step.</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-medium">Go to account →</span>
              </a>
              <a href="/transfer" className="rounded-[12px] bg-white p-8 flex flex-col gap-3 border-2 border-silver-veil hover:border-vault-ink transition text-left">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-vault-ink text-white text-[14px] font-semibold">2</span>
                <span className="text-[24px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Try sending money</span>
                <span className="text-[14px] text-charcoal">We check every transfer. You stay safe.</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-medium text-vault-ink">Try sending →</span>
              </a>
              <a href="/no-puzzles" className="rounded-[12px] bg-white p-8 flex flex-col gap-3 border-2 border-silver-veil hover:border-vault-ink transition text-left">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-vault-ink text-white text-[14px] font-semibold">3</span>
                <span className="text-[24px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>No puzzles</span>
                <span className="text-[14px] text-charcoal">No hard reading. We check in the background.</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-medium text-vault-ink">See how →</span>
              </a>
              <a href="/help" className="rounded-[12px] bg-white p-8 flex flex-col gap-3 border-2 border-silver-veil hover:border-vault-ink transition text-left">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-vault-ink text-white text-[14px] font-semibold">4</span>
                <span className="text-[24px] font-medium text-vault-ink" style={{ fontFamily: "var(--font-manrope), system-ui" }}>How we help</span>
                <span className="text-[14px] text-charcoal">One simple design works for many needs.</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-medium text-vault-ink">Learn more →</span>
              </a>
            </div>
          </div>
        </section>

        <HelpWidget />
      </main>

      <footer className="bg-absolute text-white px-6 md:px-10 py-14">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="text-[14px] tracking-[0.08em] uppercase text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>AURA</p>
            <p className="text-[14px] text-silver-veil mt-2 max-w-[420px]">Adaptive Universal Banking & Proactive Fraud Shield — vault at dusk. Built for India (ap-south-1, INR, en-IN). Push-per-ticket to GitHub.</p>
          </div>
          <div className="text-[14px] text-silver-veil">© 2026 AURA • WCAG 2.2 AA • DPDP Act aligned</div>
        </div>
      </footer>
    </div>
  );
}

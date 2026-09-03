import { Header } from "@/components/Header";
import { AdaptiveDashboard } from "@/components/AdaptiveDashboard";
import { FraudShieldDemo } from "@/components/FraudShieldDemo";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { HelpWidget } from "@/components/HelpWidget";
import { SectionNav, SectionHeader } from "@/components/SectionNav";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden max-w-[100vw] pt-[56px] md:pt-16">
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

        <SectionNav />

        {/* 1 — Your Account */}
        <section className="bg-vault-ink py-8 md:py-12" id="simple-mode">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <SectionHeader number="1" title="Your Account" subtitle="Big text, big buttons — easy to read" id="simple-mode-header" />
          </div>
          <AdaptiveDashboard />
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-2 flex justify-center">
            <a href="#fraud-demo" className="inline-flex items-center gap-2 rounded-full bg-white text-vault-ink px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: Try sending →</a>
          </div>
        </section>

        <FraudShieldDemo />
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-6 flex justify-center bg-white">
          <a href="#no-captcha" className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: No puzzles →</a>
        </div>

        <NoCaptchaSection />

        {/* 4 — How We Help */}
        <section className="bg-white py-16 px-6 md:px-10" id="how-we-help">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeader number="4" title="How we help" subtitle="One simple design works for many needs" id="how-we-help-header" />
            <div className="grid md:grid-cols-3 gap-6 mt-2">
              <FeatureCard title="Thinking and reading">For trouble reading or focusing. Big text. One clear step at a time.</FeatureCard>
              <FeatureCard title="Hands and movement">For shaky hands or hard to tap. Big buttons. No dragging. Hold to confirm.</FeatureCard>
              <FeatureCard title="Seeing and hearing">For low vision or hearing loss. Loud and clear. Works with screen readers.</FeatureCard>
            </div>
            <div className="mt-8 flex justify-center">
              <a href="#simple-mode" className="inline-flex items-center gap-2 rounded-full border border-silver-veil px-6 py-3 text-[14px] min-h-[44px]">Back to top ↑</a>
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

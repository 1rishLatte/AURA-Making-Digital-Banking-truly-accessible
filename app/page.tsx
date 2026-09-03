import { Header } from "@/components/Header";
import { AdaptiveDashboard } from "@/components/AdaptiveDashboard";
import { FraudShieldDemo } from "@/components/FraudShieldDemo";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { HelpWidget } from "@/components/HelpWidget";
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
            <Eyebrow className="text-frost">AURA — Adaptive Universal Banking</Eyebrow>
            <h1 className="text-[32px] xs:text-[36px] sm:text-[48px] md:text-[84px] lg:text-[96px] leading-[0.90] tracking-[-0.04em] max-w-[900px] break-words text-balance" style={{ fontFamily: "var(--font-manrope), system-ui" }}>
              Banking that adapts to <span className="text-frost">you</span>.
            </h1>
            <p className="max-w-[640px] text-[16px] md:text-[22px] leading-[1.2] tracking-[-0.44px] text-silver-veil">
              One vault, every need — motor, vision, cognitive, dyslexia. Voice-first, high-contrast, 72px targets. Proactive fraud shield that delays, never denies.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a href="#dashboard" className="inline-flex items-center gap-3 rounded-[8px] bg-charcoal/60 px-4 py-3 text-[14px] text-white min-h-[44px]">Explore dashboard <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: "linear-gradient(90deg, #1c53bd, #53adfe)" }} aria-hidden /></a>
              <a href="#simple-mode" className="inline-flex items-center rounded-[8px] border border-white/20 px-4 py-3 text-[14px] text-white min-h-[44px]">Watch Simple Mode</a>
            </div>
            <p className="text-[12px] tracking-[0.08em] uppercase text-silver-veil" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>INR • en-IN • Asia/Kolkata • WCAG 2.2 AA • Atkinson Hyperlegible</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </section>

        {/* Light band */}
        <section className="bg-ash-mist py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-6">
            <FeatureCard eyebrow="Privacy — on-device" title="We listen on-device, we send intent-only.">
              Voice speech-to-text runs in your browser. Only <code className="px-1 py-0.5 bg-ash-mist rounded text-[13px]">{`{action:"TRANSFER", amount:50000, recipient_type:"UNKNOWN_NEW_CONTACT"}`}</code> leaves the device — raw audio never stored.
            </FeatureCard>
            <FeatureCard eyebrow="Smart friction" title="AURA delays; it never denies.">
              Scam panic vs real emergency: 5s plain-language pause — “This is a new account and a large transfer. Take 5 seconds to review.” — then 1.5s hold completes. Borrowed device? Trusted Contact 1-tap or priority human handoff.
            </FeatureCard>
          </div>
        </section>

        {/* Dark band - dashboard */}
        <section className="bg-vault-ink py-8 md:py-12" id="simple-mode">
          <AdaptiveDashboard />
        </section>

        <FraudShieldDemo />

        <NoCaptchaSection />

        {/* Light band - features for 30 */}
        <section className="bg-white py-16 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto">
            <Eyebrow>Five vectors cover thirty</Eyebrow>
            <h2 className="text-[40px] md:text-[48px] leading-[1.06] tracking-[-1.44px] text-vault-ink mt-3" style={{ fontFamily: "var(--font-manrope), system-ui" }}>One parameterized engine. Five live journeys.</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <FeatureCard title="Neuro & Cognitive">ASD, ADHD, Down, ID, Dyslexia, Aphasia → Simple Mode (1 action/card, Atkinson, 65ch, voice+card dual output).</FeatureCard>
              <FeatureCard title="Physical & Motor">CP, MD, SCI, MS, ALS, Parkinson, RA → 68-72px targets, hold-not-drag, jitter forgiveness, Space hold.</FeatureCard>
              <FeatureCard title="Sensory">Blindness, Deafness, Deaf-Blindness, SPD → SR landmarks + typed fallback + reduced-motion, near-monochrome Eco.</FeatureCard>
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

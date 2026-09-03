import { Header } from "@/components/Header";
import { HelpWidget } from "@/components/HelpWidget";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { AccessibilityShortcut } from "@/components/HomeActions";
import { StepNavigation } from "@/components/dashboard/StepNavigation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden max-w-[100vw]">
      <Header />
      <StepNavigation />
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

        {/* Home — Overview & Quick Actions (Page 1) */}
        <section className="bg-white py-12 md:py-16 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto space-y-8">
            {/* Welcome + Safety Status */}
            <div className="grid md:grid-cols-[1.4fr_0.6fr] gap-6">
              <div className="rounded-[8px] bg-[#0f111a] p-8 border border-[#2a2a2a]">
                <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">WELCOME BACK</span>
                <h2 className="text-[#ffffff] text-[32px] md:text-[40px] font-normal leading-none tracking-[-1.2px] mt-2" style={{ fontFamily: "var(--font-manrope), system-ui" }}>Good morning, Priya</h2>
                <p className="text-[#aeaeae] text-[14px] mt-2">Your vault is secure and ready.</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#aeaeae] text-[11px] font-mono uppercase tracking-[0.08em]">Balance</p>
                    <p className="text-[#ffffff] text-[28px] font-normal tracking-[-0.8px]">$124,500.00</p>
                    <p className="text-[#aeaeae] text-[12px] font-mono">Across 1 account • Updated just now</p>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#1c53bd]/20 border border-[#53adfe]/30 text-[#53adfe] text-[12px] font-mono uppercase tracking-[0.08em] px-3 py-1.5">● System Safe</span>
                    <span className="text-[#aeaeae] text-[11px] font-mono mt-2">Verified • No threats</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[8px] bg-[#efefef] p-6 border border-[#aeaeae]/20">
                <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] block">RECENT ACTIVITY</span>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-[13px]"><span className="text-[#141414]">Asha Medical • 28 Aug</span><span className="text-[#141414] font-mono">−₹1,250</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-[#141414]">Pension Credit • 25 Aug</span><span className="text-emerald-700 font-mono">+₹32,000</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-[#141414]">UPI to Daughter • 20 Aug</span><span className="text-[#141414] font-mono">−₹5,000</span></div>
                </div>
                <a href="/account" className="mt-6 inline-flex w-full justify-center rounded-[8px] border border-[#2a2a2a] bg-white text-[#0f111a] px-4 py-3 text-[14px] font-normal hover:border-[#0f111a]">View all activity →</a>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em] mb-3">QUICK ACTIONS</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <a href="/transfer" className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6 hover:border-[#aeaeae] transition text-left">
                  <span className="w-10 h-10 rounded-full bg-[#1c53bd] text-white flex items-center justify-center text-[18px]">→</span>
                  <p className="text-[#ffffff] text-[18px] font-normal mt-3">Send Money</p>
                  <p className="text-[#aeaeae] text-[12px] font-mono mt-1">We check every transfer</p>
                </a>
                <a href="/account#trusted-contact-manager" className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6 hover:border-[#aeaeae] transition text-left">
                  <span className="w-10 h-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-[16px]">🛡️</span>
                  <p className="text-[#ffffff] text-[18px] font-normal mt-3">Safety Setup</p>
                  <p className="text-[#aeaeae] text-[12px] font-mono mt-1">Add trusted contact</p>
                </a>
                <AccessibilityShortcut />
              </div>
            </div>

            {/* Choose where to go — kept as secondary nav */}
            <div>
              <h3 className="text-[16px] font-normal text-[#0f111a] mb-3">Or choose a page</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="/account" className="rounded-[8px] bg-[#0f111a] text-white p-6 flex flex-col gap-2 border border-[#0f111a] hover:bg-[#141414] transition text-left">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#0f111a] text-[12px] font-semibold">2</span>
                  <span className="text-[18px] font-normal">Your Account</span>
                  <span className="text-[13px] text-[#aeaeae]">See balance. Big text. One step.</span>
                </a>
                <a href="/no-puzzles" className="rounded-[8px] bg-white p-6 flex flex-col gap-2 border border-[#2a2a2a] hover:border-[#0f111a] transition text-left">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0f111a] text-white text-[12px] font-semibold">4</span>
                  <span className="text-[18px] font-normal text-[#0f111a]">No puzzles</span>
                  <span className="text-[13px] text-[#666666]">No hard reading. We check in the background.</span>
                </a>
              </div>
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

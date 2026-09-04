import Link from "next/link";
import { Header } from "@/components/Header";
import { HelpWidget } from "@/components/HelpWidget";
import { SectionHeader } from "@/components/SectionNav";
import { StepNavigation } from "@/components/dashboard/StepNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function HelpPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <StepNavigation />
        <main id="main-content" tabIndex={-1} className="bg-white flex-1 py-8 md:py-12 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader number="5" title="How we help" subtitle="One simple design works for many needs" id="help-header" />
        <div className="grid md:grid-cols-3 gap-6 mt-2">
          <FeatureCard title="Thinking and reading">For trouble reading or focusing. Big text. One clear step at a time.</FeatureCard>
          <FeatureCard title="Hands and movement">For shaky hands or hard to tap. Big buttons. No dragging. Hold to confirm.</FeatureCard>
          <FeatureCard title="Seeing and hearing">For low vision or hearing loss. Loud and clear. Works with screen readers.</FeatureCard>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <FeatureCard title="Need help?" eyebrow="Support">Call us or ask someone you trust. Help is always in the same place — bottom right, on every page.</FeatureCard>
          <FeatureCard title="Want to go back?" eyebrow="Navigation">Use the top bar to jump between pages. Or go back to your account.</FeatureCard>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/account" className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px]">Back to your account →</Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-silver-veil px-6 py-3 text-[14px] min-h-[44px]">Back to home ↑</Link>
        </div>
      </div>
      </main>
        <HelpWidget />
        <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
      </div>
    </ProtectedRoute>
  );
}

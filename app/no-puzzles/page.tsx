import Link from "next/link";
import { Header } from "@/components/Header";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { SectionHeader } from "@/components/SectionNav";
import { StepNavigation } from "@/components/dashboard/StepNavigation";
import { HelpWidget } from "@/components/HelpWidget";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NoPuzzlesPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <StepNavigation />
        <div className="bg-ash-mist flex-1">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8">
          <SectionHeader number="4" title="No puzzles" subtitle="No hard reading, no hard tapping — we check in the background" id="no-puzzles-header" />
        </div>
        <NoCaptchaSection />
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-8 flex justify-center">
          <Link href="/help" className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: How we help →</Link>
        </div>
      </div>
        <HelpWidget />
        <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
      </div>
    </ProtectedRoute>
  );
}

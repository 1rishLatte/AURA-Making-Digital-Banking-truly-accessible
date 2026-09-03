"use client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { SectionHeader } from "@/components/SectionNav";
import { StepNavigation } from "@/components/dashboard/StepNavigation";
import { HelpWidget } from "@/components/HelpWidget";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAccessibility } from "@/lib/adaptive-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NoPuzzlesPage() {
  const { setIsDrawerOpen } = useAccessibility();
  const router = useRouter();
  const [bypassNotice, setBypassNotice] = useState<string | null>(null);

  // Clear any open drawer/backdrop when leaving Page 4 (fixes overlay blocking next page)
  useEffect(() => {
    return () => {
      setIsDrawerOpen(false);
      // Ensure no leftover backdrop blocks pointer events on next route
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [setIsDrawerOpen]);

  const handleNext = (e: React.MouseEvent) => {
    // Fallback navigation: always allow, show visible inline warning if verification incomplete
    // Do NOT silently return — provide feedback and still navigate
    const hasVerification = document.querySelector('[data-verified="true"]') || document.querySelector('[role="status"]');
    if (!hasVerification) {
      setBypassNotice("You can continue — verification is optional. We recommend completing one check, but you may proceed.");
      // Allow navigation to continue, don't preventDefault
      setTimeout(() => setBypassNotice(null), 4000);
    }
    // Ensure proper client-side routing even if form inside NoCaptchaSection called preventDefault
    // Use router.push as fallback if Link is intercepted
    // (Link will handle it, this is just visual feedback)
  };

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
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-8 flex flex-col items-center gap-3">
            {bypassNotice && (
              <p role="status" aria-live="polite" className="w-full max-w-[560px] text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[8px] px-4 py-3 text-center">
                {bypassNotice}
              </p>
            )}
            <Link
              href="/help"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px] border border-transparent hover:border-white/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2"
            >
              Next: How we help →
            </Link>
            <p className="text-[12px] text-silver-veil">All checks are optional — use Step bar above to jump to any page.</p>
          </div>
        </div>
        <HelpWidget />
        <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
      </div>
    </ProtectedRoute>
  );
}

"use client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { SectionHeader } from "@/components/SectionNav";
import { StepNavigation } from "@/components/dashboard/StepNavigation";
import { HelpWidget } from "@/components/HelpWidget";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAccessibility } from "@/lib/adaptive-context";
import { useEffect } from "react";

export default function NoPuzzlesPage() {
  const { setIsDrawerOpen } = useAccessibility();

  // Clear any open drawer/backdrop when leaving Page 4 (fixes overlay blocking next page)
  useEffect(() => {
    return () => {
      setIsDrawerOpen(false);
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [setIsDrawerOpen]);

  const handleNext = () => {
    console.log("Next button clicked! href=/help");
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
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24 flex flex-col items-center gap-3 relative z-10">
            <Link
              href="/help"
              onClick={handleNext}
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px] border border-vault-ink hover:border-white/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#facc15] focus-visible:ring-offset-2 pointer-events-auto"
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

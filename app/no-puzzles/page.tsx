import { Header } from "@/components/Header";
import { NoCaptchaSection } from "@/components/NoCaptchaSection";
import { SectionHeader } from "@/components/SectionNav";
import { HelpWidget } from "@/components/HelpWidget";

export default function NoPuzzlesPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] pt-[220px] md:pt-[132px]">
      <Header />      <div className="bg-ash-mist flex-1">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8">
        <SectionHeader number="3" title="No puzzles" subtitle="No hard reading, no hard tapping — we check in the background" id="no-puzzles-header" />
      </div>
      <NoCaptchaSection />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-8 flex justify-center">
        <a href="/help" className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: How we help →</a>
      </div>
      </div>
      <HelpWidget />
      <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
    </div>
  );
}

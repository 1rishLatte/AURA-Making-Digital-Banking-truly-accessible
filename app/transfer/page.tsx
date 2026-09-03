import { Header } from "@/components/Header";
import { FraudShieldDemo } from "@/components/FraudShieldDemo";
import { SectionNav, SectionHeader } from "@/components/SectionNav";
import { HelpWidget } from "@/components/HelpWidget";

export default function TransferPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] pt-[56px] md:pt-16">
      <Header />
      <SectionNav />
      <div className="bg-white flex-1">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8">
        <SectionHeader number="2" title="Try sending money" subtitle="We check every transfer — you stay in control" id="transfer-header" />
      </div>
      <FraudShieldDemo />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-8 flex justify-center">
        <a href="/no-puzzles" className="inline-flex items-center gap-2 rounded-full bg-vault-ink text-white px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: No puzzles →</a>
      </div>
      </div>
      <HelpWidget />
      <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
    </div>
  );
}

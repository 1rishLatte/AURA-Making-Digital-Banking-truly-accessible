import { Header } from "@/components/Header";
import { AdaptiveDashboard } from "@/components/AdaptiveDashboard";
import { SectionNav, SectionHeader } from "@/components/SectionNav";
import { HelpWidget } from "@/components/HelpWidget";

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] pt-[56px] md:pt-16">
      <Header />
      <SectionNav />
      <div className="bg-vault-ink flex-1">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8">
        <SectionHeader number="1" title="Your Account" subtitle="Big text, big buttons — easy to read" id="account-header" />
      </div>
      <AdaptiveDashboard />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-8 flex justify-center">
        <a href="/transfer" className="inline-flex items-center gap-2 rounded-full bg-white text-vault-ink px-6 py-3 text-[14px] font-medium min-h-[44px]">Next: Try sending →</a>
      </div>
      </div>
      <HelpWidget />
      <footer className="bg-absolute text-white px-6 md:px-10 py-8 text-center text-[12px] text-silver-veil">© 2026 AURA • Single demo ID • WCAG 2.2 AA</footer>
    </div>
  );
}

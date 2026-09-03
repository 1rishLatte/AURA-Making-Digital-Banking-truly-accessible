"use client";
export function HelpWidget() {
  return (
    <div className="fixed bottom-[24px] inset-x-[16px] md:inset-x-auto md:right-10 md:bottom-6 z-30 flex justify-end pointer-events-none" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="pointer-events-auto flex flex-col md:flex-row gap-2 w-full md:w-auto items-center justify-end max-w-none ml-auto will-change-transform">
        <a href="tel:+911800123456" className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-vault-ink text-white px-4 md:px-5 py-3 text-[12px] md:text-[14px] min-h-[44px] shadow-lg leading-none text-center w-full md:w-auto shrink-0">Talk to a human — priority queue</a>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white border border-silver-veil px-4 md:px-5 py-3 text-[12px] md:text-[14px] min-h-[44px] shadow leading-none w-full md:w-auto shrink-0">Trusted Contact</button>
      </div>
    </div>
  );
}

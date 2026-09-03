"use client";
export function HelpWidget() {
  return (
    <div className="fixed bottom-[24px] inset-x-[16px] md:inset-x-auto md:right-10 md:bottom-6 z-30 flex justify-end pointer-events-none" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="pointer-events-auto flex flex-col md:flex-row gap-2 w-full md:w-auto items-stretch md:items-center ml-auto max-w-none">
        <a href="tel:+911800123456" className="inline-flex items-center justify-center rounded-full bg-vault-ink text-white px-4 md:px-5 py-3 text-[12px] md:text-[14px] min-h-[44px] shadow-lg leading-tight text-center w-full md:w-auto" aria-label="Talk to a human — priority queue">Talk to a human — priority queue</a>
        <button className="inline-flex items-center justify-center rounded-full bg-white border border-silver-veil px-4 md:px-5 py-3 text-[12px] md:text-[14px] min-h-[44px] shadow leading-tight w-full md:w-auto">Trusted Contact</button>
      </div>
    </div>
  );
}

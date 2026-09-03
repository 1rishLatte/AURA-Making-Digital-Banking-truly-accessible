"use client";
export function HelpWidget() {
  return (
    <div className="sticky bottom-6 z-30 flex justify-end pr-6 md:pr-10 pointer-events-none">
      <div className="pointer-events-auto flex gap-2">
        <a href="tel:+911800123456" className="inline-flex items-center rounded-full bg-vault-ink text-white px-5 py-3 text-[14px] min-h-[44px] shadow-lg" aria-label="Talk to a human — priority queue">Talk to a human — priority queue</a>
        <button className="inline-flex items-center rounded-full bg-white border border-silver-veil px-5 py-3 text-[14px] min-h-[44px] shadow">Trusted Contact</button>
      </div>
    </div>
  );
}

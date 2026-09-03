'use client';

import { useAccessibility } from '@/lib/adaptive-context';

export function AccessibilityShortcut() {
  const { setIsDrawerOpen } = useAccessibility();
  return (
    <button onClick={() => setIsDrawerOpen(true)} className="rounded-[8px] bg-[#141414] border border-[#2a2a2a] p-6 hover:border-[#aeaeae] transition text-left w-full">
      <span className="w-10 h-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-[16px]">♿</span>
      <p className="text-[#ffffff] text-[18px] font-normal mt-3">Accessibility</p>
      <p className="text-[#aeaeae] text-[12px] font-mono mt-1">Make it easier to use</p>
    </button>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/lib/adaptive-context';

export const Header: React.FC = () => {
  const { setIsDrawerOpen, activeProfile } = useAccessibility();

  return (
    <header className="w-full bg-[#0f111a] border-b border-[#2a2a2a] sticky top-0 z-40 px-2 md:px-6 py-1 flex items-center justify-between gap-1 overflow-hidden">
      {/* Left: Brand Identity & Status */}
      <div className="flex items-center space-x-2 md:space-x-4 min-w-0 shrink-0">
        <Link className="flex items-baseline space-x-1 md:space-x-2 no-underline shrink-0" href="/">
          <span className="text-[#ffffff] text-[16px] md:text-[20px] font-normal tracking-[-0.03em]">AURA</span>
          <span className="text-[#aeaeae] text-[10px] md:text-[12px] font-mono tracking-[0.018em] uppercase">ADAPTIVE BANKING</span>
        </Link>
        <div className="hidden sm:flex items-center space-x-2 pl-2 md:pl-4 border-l border-[#2a2a2a] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#53adfe] animate-pulse" />
          <span className="text-[#aeaeae] text-[12px] font-mono uppercase tracking-[0.018em]">
            SECURE SESSION
          </span>
        </div>
      </div>

      {/* Right: Navigation & Action Controls */}
      <nav className="flex items-center space-x-1 md:space-x-3 overflow-x-auto no-scrollbar">
        {/* Home Button */}
        <Link className="text-[#aeaeae] hover:text-[#ffffff] text-[12px] md:text-[14px] px-2 md:px-3 py-1 md:py-1.5 transition-colors font-normal hover:bg-[#141414] rounded-[8px] whitespace-nowrap" href="/">
          Home
        </Link>

        {/* Dashboard Link */}
        <Link className="bg-transparent border border-[#2a2a2a] hover:border-[#ffffff] text-[#ffffff] text-[12px] md:text-[14px] px-2 md:px-3 py-1 md:py-1.5 rounded-[8px] transition-colors font-normal whitespace-nowrap" href="/account">
          Dashboard
        </Link>

        {/* Accessibility Drawer Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center space-x-1 md:space-x-2 bg-transparent border border-[#2a2a2a] hover:border-[#aeaeae] text-[#ffffff] text-[12px] md:text-[14px] px-2 md:px-3 py-1 md:py-1.5 rounded-[8px] transition-colors whitespace-nowrap"
          aria-label="Open Accessibility Options"
        >
          <span className="text-[14px] md:text-[16px]">♿</span>
          <span className="hidden md:inline text-[14px] font-normal">Accessibility</span>
          {activeProfile !== 'standard' && (
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#1c53bd]" />
          )}
        </button>

        {/* Log Out Action */}
        <Link href="/api/logout" className="text-[#aeaeae] hover:text-[#ffffff] text-[12px] md:text-[14px] px-1.5 md:px-2 py-1 md:py-1.5 transition-colors whitespace-nowrap">
          Log Out
        </Link>
      </nav>
    </header>
  );
};

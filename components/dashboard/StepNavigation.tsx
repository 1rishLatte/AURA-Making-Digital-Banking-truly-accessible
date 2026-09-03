'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const DASHBOARD_STEPS = [
  { id: 1, title: 'Home', description: 'Overview & Quick Actions', href: '/' },
  { id: 2, title: 'Your Account', description: 'See balance. Big text.', href: '/account' },
  { id: 3, title: 'Send Money', description: 'We check every transfer.', href: '/transfer' },
  { id: 4, title: 'No Puzzles', description: 'No hard reading or CAPTCHAs.', href: '/no-puzzles' },
  { id: 5, title: 'How We Help', description: 'One design, many needs.', href: '/help' },
];

const shortTitles: Record<number, string> = {
  1: 'Home',
  2: 'Account',
  3: 'Send',
  4: 'Puzzles',
  5: 'Help',
};

export const StepNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Map pathname to step id
  const hrefToId: Record<string, number> = {
    '/': 1,
    '/account': 2,
    '/transfer': 3,
    '/no-puzzles': 4,
    '/help': 5,
  };
  const currentStep = hrefToId[pathname] ?? 1;

  const onSelectStep = (id: number) => {
    const step = DASHBOARD_STEPS.find((s) => s.id === id);
    if (step) router.push(step.href);
  };

  return (
    <nav className="w-full bg-[#0f111a] border-b border-[#2a2a2a] sticky top-[56px] md:top-[64px] z-30">
      {/* MOBILE: single-row pill strip 52px max, DESKTOP: 5-col grid */}
      <div className="flex md:grid md:grid-cols-5 gap-2 p-2 sm:p-3 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
        {DASHBOARD_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`flex-none md:w-full flex items-center space-x-2 px-3 py-2 md:p-3 rounded-[128px] md:rounded-[8px] border transition-all text-left shrink-0 ${
                isActive
                  ? 'bg-[#141414] border-[#53adfe] text-[#ffffff]'
                  : 'bg-[#0f111a] border-[#2a2a2a] text-[#aeaeae] hover:border-[#ffffff]'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[11px] md:text-[12px] font-mono shrink-0 ${
                  isActive ? 'bg-[#ffffff] text-[#0f111a]' : 'bg-[#2a2a2a] text-[#ffffff]'
                }`}
              >
                {step.id}
              </span>
              <div className="truncate">
                <span className="text-[13px] md:text-[14px] font-normal block truncate">
                  <span className="md:hidden">{shortTitles[step.id]}</span>
                  <span className="hidden md:inline">{step.title}</span>
                </span>
                <p className="hidden md:block text-[11px] text-[#aeaeae] truncate mt-0.5">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '@/lib/adaptive-context';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

export const STEPS: StepItem[] = [
  { id: 1, title: 'Home', description: 'Overview & Quick Actions' },
  { id: 2, title: 'Your Account', description: 'See balance. Big text.' },
  { id: 3, title: 'Send Money', description: 'We check every transfer.' },
  { id: 4, title: 'No Puzzles', description: 'No hard reading or CAPTCHAs.' },
  { id: 5, title: 'How We Help', description: 'One design, many needs.' },
];

export const DASHBOARD_STEPS = STEPS.map((s) => ({
  ...s,
  href: s.id === 1 ? '/' : s.id === 2 ? '/account' : s.id === 3 ? '/transfer' : s.id === 4 ? '/no-puzzles' : '/help',
}));

interface StepNavigationProps {
  activeStep?: number;
  onSelectStep?: (stepId: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ activeStep: propActive, onSelectStep: propOnSelect }) => {
  const pathname = usePathname();
  const router = useRouter();
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  const { activeProfile, reducedMotion } = useAccessibility();
  const isVision = activeProfile === 'vision';
  const shouldReduceMotion = useReducedMotion() || reducedMotion;

  const hrefToId: Record<string, number> = {
    '/': 1,
    '/account': 2,
    '/transfer': 3,
    '/no-puzzles': 4,
    '/help': 5,
  };
  const derivedActive = hrefToId[pathname] ?? 1;
  const activeStep = propActive ?? derivedActive;

  const onSelectStep = (id: number) => {
    if (propOnSelect) return propOnSelect(id);
    const step = DASHBOARD_STEPS.find((s) => s.id === id);
    if (!step) return;
    console.log("StepNavigation: clicking step", id, "->", step.href, "from", pathname);
    // Primary: Next.js router
    router.push(step.href);
    // Fallback: hard navigate if router doesn't change path within 200ms (e.g., blocked by overlay/validation)
    setTimeout(() => {
      if (window.location.pathname !== step.href) {
        console.log("StepNavigation: router.push didn't change path, falling back to window.location", step.href);
        window.location.href = step.href;
      }
    }, 200);
  };

  useEffect(() => {
    if (!activeTabRef.current) return;
    // Fix page 4 stuck: don't auto-scroll on mount if user is trying to click — only ensure visible without smooth jitter
    // Use 'auto' (instant) and only if not already in view
    const el = activeTabRef.current;
    const parent = el.parentElement;
    if (!parent) return;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // If reduced motion or vision, skip smooth; use auto to avoid stealing pointer position
    const behavior: ScrollBehavior = prefersReduced || activeProfile === 'vision' ? 'auto' : 'auto';
    try {
      // Only scroll if not fully visible
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const isVisible = elRect.left >= parentRect.left && elRect.right <= parentRect.right;
      if (!isVisible) {
        el.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
      }
    } catch {
      el.scrollIntoView();
    }
  }, [activeStep, activeProfile]);

  return (
    <nav className="w-full bg-[#0f111a] border-b border-[#2a2a2a] sticky top-[56px] sm:top-[64px] z-30 shadow-md" aria-label="Dashboard Steps">
      <div className="max-w-7xl mx-auto p-2 sm:p-3">
        <div role="tablist" className="flex md:grid md:grid-cols-5 gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap items-center py-1">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <Link
                key={step.id}
                href={DASHBOARD_STEPS.find((s) => s.id === step.id)!.href}
                ref={isActive ? (activeTabRef as any) : null}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'step' : undefined}
                prefetch
                onClick={(e) => {
                  if (propOnSelect) {
                    e.preventDefault();
                    onSelectStep(step.id);
                    return;
                  }
                  // Fallback: ensure navigation even if Link is intercepted — log and hard fallback
                  console.log("StepNavigation Link click", step.id, "->", DASHBOARD_STEPS.find((s) => s.id === step.id)!.href);
                  // Let Next.js Link handle primary navigation; fallback after 300ms if still on same page
                  const href = DASHBOARD_STEPS.find((s) => s.id === step.id)!.href;
                  setTimeout(() => {
                    if (window.location.pathname !== href) {
                      window.location.href = href;
                    }
                  }, 300);
                }}
                className={`flex-none md:w-full flex items-center space-x-2 px-3 py-2 md:p-3 border transition-all text-left shrink-0 relative overflow-hidden no-underline ${
                  isVision
                    ? `rounded-[8px] ${isActive ? 'text-[#000000] border-[#000000] border-2' : 'bg-[#000000] text-[#ffffff] border-[#ffffff]'}`
                    : `rounded-[128px] md:rounded-[8px] ${isActive ? 'text-[#ffffff] border-[#53adfe]' : 'bg-[#0f111a] text-[#aeaeae] border-[#2a2a2a] hover:border-[#ffffff]'}`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className={`absolute inset-0 -z-0 ${isVision ? 'bg-[#ffffff] rounded-[8px]' : 'bg-[#141414] rounded-[128px] md:rounded-[8px]'}`}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-10 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[11px] md:text-[12px] font-mono shrink-0 border-2 font-bold ${
                    isVision
                      ? isActive
                        ? 'rounded-[4px] bg-[#000000] text-[#ffffff] border-[#ffffff]'
                        : 'rounded-[4px] bg-[#ffffff] text-[#000000] border-[#000000]'
                      : `rounded-full border-transparent ${isActive ? 'bg-[#ffffff] text-[#0f111a]' : 'bg-[#2a2a2a] text-[#ffffff]'}`
                  }`}
                  aria-hidden
                >
                  {step.id}
                </span>
                <div className="truncate relative z-10">
                  <span
                    className={`text-[13px] md:text-[14px] font-normal block truncate ${isVision ? (isActive ? 'text-[#000000]' : 'text-[#ffffff]') : ''}`}
                    style={isVision ? { color: isActive ? '#000000' : '#ffffff' } : undefined}
                  >
                    {step.title}
                  </span>
                  <p
                    className={`hidden md:block text-[11px] truncate mt-0.5 ${isVision ? (isActive ? 'text-[#000000]' : 'text-[#ffffff]') : 'text-[#aeaeae]'}`}
                    style={isVision ? { color: isActive ? '#000000' : '#ffffff', opacity: isActive ? 0.8 : 1 } : undefined}
                  >
                    {step.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

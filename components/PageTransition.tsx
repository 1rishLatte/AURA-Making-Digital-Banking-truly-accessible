'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Also respect app's data-reduced-motion attribute
    const check = () => {
      const attr = document.documentElement.getAttribute('data-reduced-motion') === 'true';
      setReduced(shouldReduceMotion || attr || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion', 'class'] });
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', check);
    return () => {
      obs.disconnect();
      mq.removeEventListener('change', check);
    };
  }, [shouldReduceMotion]);

  // Calm personality: 280ms, ease-out, transform + opacity only, interruptible spring-like
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={
          reduced
            ? { duration: 0.12, ease: 'easeOut' }
            : { duration: 0.28, ease: [0.23, 1, 0.32, 1] } // ease-out, calm, interruptible
        }
        // Ensure compositor-only props
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

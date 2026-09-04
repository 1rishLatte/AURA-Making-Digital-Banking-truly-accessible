'use client';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // FIX: Invisible ghost — removed Framer fade that stuck at opacity 0 (page 4 black but links hoverable)
  return <div key={pathname}>{children}</div>;
}

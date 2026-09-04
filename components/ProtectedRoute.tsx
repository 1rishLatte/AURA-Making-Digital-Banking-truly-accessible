'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    // GOOD: Conditional rendering with ternary — completely removed when false, not hidden
    return (
      <div className="min-h-screen bg-ash-mist flex items-center justify-center p-6" role="status" aria-live="polite" aria-busy="true">
        <div className="bg-white border border-silver-veil/30 rounded-[12px] px-6 py-4 flex items-center gap-3 shadow-sm max-w-[320px]">
          <div className="w-3 h-3 bg-[#53adfe] rounded-full animate-pulse shrink-0" aria-hidden />
          <span className="text-[14px] text-vault-ink font-medium">Loading your vault…</span>
          <span className="text-[12px] text-silver-veil">Please wait</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

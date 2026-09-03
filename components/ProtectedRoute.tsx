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
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-[#ffffff]">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#53adfe] rounded-full"></div>
          <span className="text-[14px]">Verifying secure session...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

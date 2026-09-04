'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserSession {
  username: string;
  loginTime: number;
  authMethod: 'passkey' | 'demo' | 'trusted';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserSession | null;
  login: (method?: 'passkey' | 'demo' | 'trusted') => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AURA_SESSION_KEY = 'aura_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Restore session — GOOD: finally guarantees loader off, safety timeout prevents black screen if blocked
  useEffect(() => {
    let cancelled = false;
    const safety = setTimeout(() => {
      if (!cancelled) setIsLoading(false);
    }, 1200); // Reason 1: never leave isLoading true

    const checkSession = () => {
      try {
        const storedSession = localStorage.getItem(AURA_SESSION_KEY);
        if (storedSession) {
          const parsedUser: UserSession = JSON.parse(storedSession);
          const isValid = Date.now() - parsedUser.loginTime < 24 * 60 * 60 * 1000;
          if (isValid) {
            setIsAuthenticated(true);
            setUser(parsedUser);
          } else {
            localStorage.removeItem(AURA_SESSION_KEY);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          const hasCookie = document.cookie.includes('aura_session=demo');
          if (hasCookie) {
            const legacySession: UserSession = {
              username: 'Demo User',
              loginTime: Date.now(),
              authMethod: 'demo',
            };
            localStorage.setItem(AURA_SESSION_KEY, JSON.stringify(legacySession));
            setIsAuthenticated(true);
            setUser(legacySession);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to parse auth session:', error);
        localStorage.removeItem(AURA_SESSION_KEY);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        if (!cancelled) {
          clearTimeout(safety);
          setIsLoading(false); // GOOD: guaranteed
        }
      }
    };

    // Defer to next tick so heavy NoCaptchaSection (page 4) doesn't block
    const id = setTimeout(checkSession, 0);
    return () => {
      cancelled = true;
      clearTimeout(safety);
      clearTimeout(id);
    };
  }, [pathname]);

  const login = (method: 'passkey' | 'demo' | 'trusted' = 'demo') => {
    const sessionData: UserSession = {
      username: 'Demo User',
      loginTime: Date.now(),
      authMethod: method,
    };

    localStorage.setItem(AURA_SESSION_KEY, JSON.stringify(sessionData));
    // Also set legacy cookie for middleware compatibility
    document.cookie = `aura_session=demo; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
    setIsAuthenticated(true);
    setUser(sessionData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem(AURA_SESSION_KEY);
    // Clear legacy cookie via API for httpOnly
    fetch('/api/logout', { method: 'POST' }).catch(() => {
      document.cookie = 'aura_session=; path=/; max-age=0';
    });
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

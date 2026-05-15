'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAccessTokenAction, refreshAccessTokenAction } from '@/app/auth/actions';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  reloadAccessTokenState: () => Promise<void>;
  refreshAccessTokenState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const pathname = usePathname();

  const reloadAccessTokenState = async () => {
    try {
      const token = await getAccessTokenAction();
      setAccessToken(token);
    } catch (error) {
      console.error('Failed to reload access token:', error);
    }
  };

  const refreshAccessTokenState = async () => {
    try {
      const newToken = await refreshAccessTokenAction();
      setAccessToken(newToken);
    } catch (error) {
      console.error('Failed to refresh access token:', error);
    }
  };

  useEffect(() => {
    reloadAccessTokenState();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, reloadAccessTokenState, refreshAccessTokenState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
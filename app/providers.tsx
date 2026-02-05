'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useMemo } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Ensure NextAuth client calls the correct origin/port (avoids defaulting to localhost:3000).
  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.location.origin;
  }, []);

  return <SessionProvider baseUrl={baseUrl}>{children}</SessionProvider>;
}

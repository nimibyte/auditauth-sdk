'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SETTINGS } from './settings.js';
import { SessionUser } from "@auditauth/core";

type AuthContextValue = {
  user: SessionUser;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const useAuditAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuditAuth must be used within AuditAuthGuard');
  }
  return ctx;
}

type AuditAuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  unauthenticatedFallback?: ReactNode;
  mode?: 'redirect' | 'fallback';
};

type GuardState =
  | { status: 'loading' | 'unauthenticated'; user: null }
  | { status: 'authenticated'; user: SessionUser };

const defaultFallback = <div>Verificando sesion...</div>;

const AuditAuthGuard = ({
  children,
  fallback,
  unauthenticatedFallback,
  mode = 'redirect',
}: AuditAuthGuardProps) => {
  const router = useRouter();
  const [state, setState] = useState<GuardState>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const checkSession = async () => {
      try {
        const response = await fetch(SETTINGS.bff.paths.session, {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          setState({ status: 'unauthenticated', user: null });
          if (mode === 'redirect') router.replace(SETTINGS.bff.paths.login);
          return;
        }

        const data = await response.json() as { user?: SessionUser | null };

        if (!data?.user || typeof data.user !== 'object') {
          setState({ status: 'unauthenticated', user: null });
          if (mode === 'redirect') router.replace(SETTINGS.bff.paths.login);
          return;
        }

        setState({ status: 'authenticated', user: data.user });
      } catch {
        if (controller.signal.aborted) return;
        setState({ status: 'unauthenticated', user: null });
        if (mode === 'redirect') router.replace(SETTINGS.bff.paths.login);
        return;
      }
    };

    checkSession();

    return () => {
      controller.abort();
    }
  }, [mode, router]);

  const value = useMemo<AuthContextValue | null>(() => {
    if (state.status !== 'authenticated') return null;
    return { user: state.user };
  }, [state]);

  if (!value) {
    if (state.status === 'unauthenticated') {
      return <>{unauthenticatedFallback ?? fallback ?? defaultFallback}</>;
    }

    return <>{fallback ?? defaultFallback}</>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuditAuthGuard, useAuditAuth };

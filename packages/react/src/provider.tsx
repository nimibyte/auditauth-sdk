'use client'

import { ReactNode, useMemo, useContext, useRef, useEffect, useState } from 'react'
import type { AuditAuthConfig, SessionUser } from '@auditauth/core'
import { createContext } from 'react'
import { AuditAuthWeb } from '@auditauth/web'

type AuditAuthContextValue = {
  user: SessionUser | null;
  fetch: AuditAuthWeb['fetch'];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  goToPortal: () => Promise<void>;
  isAuthenticated: () => boolean;
  trackNavigationPath: (path: string) => void;
}

const AuditAuthContext =
  createContext<AuditAuthContextValue | null>(null)

type AuditAuthProviderProps = {
  config: AuditAuthConfig
  children: ReactNode
}

const AuditAuthProvider = ({ config, children }: AuditAuthProviderProps) => {
  const sdkRef = useRef<AuditAuthWeb | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null)

  if (!sdkRef.current) {
    sdkRef.current = new AuditAuthWeb(config, {
      get: (name) => localStorage.getItem(name),
      set: (name, value) => localStorage.setItem(name, value),
      remove: (name) => localStorage.removeItem(name),
    })
  }

  const sdk = sdkRef.current;

  useEffect(() => {
    const init = async () => {
      await sdk.handleRedirect();
      const sessionUser = sdk.getSessionUser();
      setUser(sessionUser);
    };

    init();
  }, [sdk]);

  const value = useMemo(() => {
    return {
      user,
      fetch: sdk.fetch.bind(sdk),
      login: sdk.login.bind(sdk),
      logout: sdk.logout.bind(sdk),
      goToPortal: sdk.gotToPortal.bind(sdk),
      isAuthenticated: sdk.isAuthenticated.bind(sdk),
      trackNavigationPath: (path: string) => {
        sdk.pushMetric({
          event_type: 'navigation',
          runtime: 'browser',
          target: {
            type: 'page',
            path,
          },
        })
      }
    } as AuditAuthContextValue
  }, [sdk, user])

  return (
    <AuditAuthContext.Provider value={value}>
      {children}
    </AuditAuthContext.Provider>
  )
}


const useAuditAuth = () => {
  const ctx = useContext(AuditAuthContext)

  if (!ctx) {
    throw new Error('useAuditAuth must be used inside AuditAuthProvider')
  }

  return ctx
}

export { AuditAuthProvider, useAuditAuth }

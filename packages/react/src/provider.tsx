'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuditAuthConfig, SessionUser } from '@auditauth/core'
import { AuditAuthWeb } from '@auditauth/web'

type AuditAuthContextValue = {
  ready: boolean
  user: SessionUser | null
  fetch: AuditAuthWeb['fetch']
  login: () => Promise<void>
  logout: () => Promise<void>
  goToPortal: () => Promise<void>
  isAuthenticated: () => boolean
  trackNavigationPath: (path: string) => void
}

const AuditAuthContext = createContext<AuditAuthContextValue | null>(null)

type AuditAuthProviderProps = {
  config: AuditAuthConfig
  children: ReactNode
}

const createSdk = (config: AuditAuthConfig) => {
  const safeStorage = {
    get: (name: string) => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(name)
    },
    set: (name: string, value: string) => {
      if (typeof window === 'undefined') return
      localStorage.setItem(name, value)
    },
    remove: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    },
  }

  return new AuditAuthWeb(config, safeStorage)
}

const AuditAuthProvider = ({ config, children }: AuditAuthProviderProps) => {
  const sdkRef = useRef<AuditAuthWeb | null>(null)

  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)

  if (!sdkRef.current) {
    sdkRef.current = createSdk(config)
  }

  const sdk = sdkRef.current

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        await sdk.handleRedirect()
        const sessionUser = sdk.getSessionUser()

        if (!mounted) return
        setUser(sessionUser)
      } catch {
        if (!mounted) return
        setUser(null)
      } finally {
        if (!mounted) return
        setReady(true)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [sdk])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (event: StorageEvent) => {
      if (event.key !== '__auditauth_sync__') return;

      const sessionUser = sdk.getSessionUser()
      setUser(sessionUser)
    }

    window.addEventListener('storage', handler)

    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [sdk])

  const logout = useMemo(() => {
    return async () => {
      await sdk.logout()
      setUser(null)
      localStorage.setItem('__auditauth_sync__', Date.now().toString());
    }
  }, [sdk])

  const fetchWrapper = useMemo(() => {
    return async (...args: Parameters<AuditAuthWeb['fetch']>) => {
      try {
        const res = await sdk.fetch(...args)
        return res
      } catch (err) {
        setUser(null)
        throw err
      }
    }
  }, [sdk])

  const value = useMemo<AuditAuthContextValue>(() => {
    return {
      ready,
      user,
      fetch: fetchWrapper,
      login: sdk.login.bind(sdk),
      logout,
      goToPortal: sdk.goToPortal.bind(sdk),
      isAuthenticated: () => !!user,
      trackNavigationPath: sdk.trackNavigationPath.bind(sdk),
    }
  }, [ready, user, sdk, logout, fetchWrapper])

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

export {
  AuditAuthProvider,
  useAuditAuth,
}

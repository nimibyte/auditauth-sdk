import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuditAuth } from './provider'

type RequireAuthProps = {
  children: ReactNode
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { ready, isAuthenticated, login } = useAuditAuth()
  const startedRef = useRef(false)

  const authed = isAuthenticated()

  useEffect(() => {
    if (!ready) return
    if (authed) return
    if (startedRef.current) return

    startedRef.current = true
    login()
  }, [ready, authed, login])

  if (!ready) return null
  if (!authed) return null

  return <>{children}</>
};

export { RequireAuth };

import { ReactNode, useEffect } from 'react'
import { useAuditAuth } from './provider'

type RequireAuthProps = {
  children: ReactNode
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, login } = useAuditAuth()

  useEffect(() => {
    const authed = isAuthenticated()
    const check = async () => {
      if (!authed) {
        login();
      };
    }

    check();
  }, [login])

  return <>{children}</>
}

export { RequireAuth };

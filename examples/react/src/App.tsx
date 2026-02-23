import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Public from './pages/public'
import Private from './pages/private'
import { AuditAuthProvider, useAuditAuth } from '@auditauth/react'
import { useEffect } from 'react'

const env = import.meta.env as Record<string, string | undefined>

function requireEnv(name: 'VITE_AUDITAUTH_API_KEY' | 'VITE_AUDITAUTH_APP_ID') {
  const value = env[name]
  if (!value) {
    throw new Error(
      `[AuditAuth example-react] Missing ${name}. Add it to examples/react/.env.local.`
    )
  }

  return value
}

function NavigationTracker() {
  const location = useLocation()
  const { trackNavigationPath } = useAuditAuth()

  useEffect(() => {
    trackNavigationPath(location.pathname)
  }, [location.pathname, trackNavigationPath])

  return null
}

function App() {
  return (
    <AuditAuthProvider
      config={{
        apiKey: requireEnv('VITE_AUDITAUTH_API_KEY'),
        appId: requireEnv('VITE_AUDITAUTH_APP_ID'),
        baseUrl: 'http://localhost:5173',
        redirectUrl: 'http://localhost:5173/private',
      }}
    >
      <BrowserRouter>
        <NavigationTracker />
        <Routes>
          <Route path="/" element={<Public />} />
          <Route path="/private" element={<Private />} />
        </Routes>
      </BrowserRouter>
    </AuditAuthProvider>
  )
}

export default App

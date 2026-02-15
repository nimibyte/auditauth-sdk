import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Public from './pages/public'
import Private from './pages/private'
import { AuditAuthProvider, useAuditAuth } from '@auditauth/react'
import { useEffect } from 'react'

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
        apiKey: 'aa_911d16484b0ef79c4d94dd8e1884b6ddc9bd445ef9e56077',
        appId: '698b4ad0fbddf401832cb942',
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

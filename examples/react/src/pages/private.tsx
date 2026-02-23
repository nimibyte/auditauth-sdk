import { RequireAuth, useAuditAuth } from '@auditauth/react'
import { Link } from 'react-router-dom'

export default function Private() {
  const { user, logout, fetch, goToPortal } = useAuditAuth()

  const testPublic = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
      { method: 'GET' }
    )

    console.log('Request status:', res.status)
  }

  return (
    <RequireAuth>
      <div className="header">
        <div className="header-left">
          <img src="/logo.png" className="logo" />
          <div>
            <div className="title">AuditAuth SDK</div>
            <div className="subtitle">
              <a href="https://auditauth.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                React Example
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="badge">Authenticated</div>
          <div className="powered">
            Powered by <a href="https://github.com/nimibyte/auditauth-sdk" target="_blank" rel="noreferrer">auditauth-sdk</a>
          </div>
        </div>
      </div>

      <div className="main">

        <div className="section">
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>

          {user?.avatar?.url && (
            <img
              src={user.avatar.url}
              className="user-avatar"
            />
          )}
        </div>

        <div className="section">
          <h3>API Tests</h3>
          <div className="buttons">
            <button onClick={testPublic}>
              Test Public API
            </button>
          </div>
        </div>

        <div className="section">
          <h3>Session Actions</h3>
          <div className="buttons">
            <button onClick={goToPortal} className="primary">
              Go to Portal
            </button>

            <button onClick={logout} className="danger">
              Logout
            </button>
          </div>
        </div>

        <Link to="/">← Back to Public</Link>
      </div>
    </RequireAuth>
  )
}

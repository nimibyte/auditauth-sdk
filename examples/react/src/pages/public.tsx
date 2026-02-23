import { Link } from 'react-router-dom'

export default function Public() {
  return (
    <>
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

          <div className="powered">
          Powered by <a href="https://github.com/nimibyte/auditauth-sdk" target="_blank" rel="noreferrer">auditauth-sdk</a>
          </div>
        </div>

      <div className="main">
        <div className="section">
          <p>
            This example demonstrates the React integration of the AuditAuth SDK.
          </p>

          <div className="buttons">
            <Link to="/private">
              <button className="primary">Go to Private Area</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

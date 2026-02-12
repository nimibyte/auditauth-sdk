import { Link } from 'react-router-dom'

export default function Public() {
  return (
    <>
      <div className="header">
        <div className="header-left">
          <img src="/logo.png" className="logo" />
          <div>
            <div className="title">AuditAuth SDK</div>
            <div className="subtitle">React Example</div>
          </div>
        </div>

        <div className="powered">
          Powered by <a href="#" target="_blank">@auditauth/react</a>
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

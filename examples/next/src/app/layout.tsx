/* eslint-disable @next/next/no-img-element */
import './globals.css'

export const metadata = {
  title: 'AA SDK – Next Example',
}

export default function RootLayout({ children,}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="header">
          <div className="header-left">
            <img src="/logo.png" className="logo"  alt='auditauth'/>
            <div>
              <div className="title">AuditAuth SDK</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Next.js Example
              </div>
            </div>
          </div>

          <div className="powered">
            Powered by <a href="#">@auditauth/next</a>
          </div>
        </div>

        <div className="main">{children}</div>
      </body>
    </html>
  )
}

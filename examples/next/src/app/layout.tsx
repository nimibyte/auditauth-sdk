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
                <a
                  href="https://auditauth.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Next.js Example
                </a>
              </div>
            </div>
          </div>

          <div className="powered">
            Powered by <a href="https://github.com/nimibyte/auditauth-sdk" target="_blank" rel="noreferrer">auditauth-sdk</a>
          </div>
        </div>

        <div className="main">{children}</div>
      </body>
    </html>
  )
}

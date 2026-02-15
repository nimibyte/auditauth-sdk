import Link from 'next/link'
import UserAvatar from './user-avatar';
import { auditauth } from '@/providers/auth';
import ApiTester from './api-tester';

export default async function PrivatePage() {
  const session = await auditauth.getSession();

  if (!session) return null;

  return (
    <>
      <div className="section">
        <h2>Private Area</h2>

        <UserAvatar />
        <p><strong>Name: {session.name}</strong></p>
        <p><strong>Email: {session.email}</strong></p>
      </div>

      <ApiTester />

      <div className="section">
        <a
          href={auditauth.getPortalUrl().href}
          className="button button-primary"
          style={{ marginRight: '20px' }}
        >
          Go to Portal
        </a>

        <a href={auditauth.getLogoutUrl().href} className="button button-danger">
          Logout
        </a>
      </div>

      <Link href="/" className='button button-ghost'>← Back</Link>
    </>
  )
}

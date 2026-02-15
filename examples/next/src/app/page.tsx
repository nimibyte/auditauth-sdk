import Link from 'next/link'

export default function PublicPage() {
  return (
    <div className="section">
      <h2>Public Page</h2>
      <p>This page does not require authentication.</p>

      <Link href="/private">
        <button className="primary">Go to Private Area</button>
      </Link>
    </div>
  )
}

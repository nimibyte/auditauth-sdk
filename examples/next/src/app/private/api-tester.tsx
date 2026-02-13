'use client'

import { useState } from 'react'
import { testAuthCall } from './actions';

export default function ApiTester() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const authCall = async (path: string) => {
    setLoading(true)
    setResult(null)

    try {
      const data = await testAuthCall(path);

      setResult(JSON.stringify(data, null, 2))
    } catch {
      setResult('Request failed')
    } finally {
      setLoading(false)
    }
  };

  const regularCall = async (path: string) => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(path, {
        credentials: 'include',
      })
;
      const data = await res.json()

      setResult(JSON.stringify(data, null, 2))
    } catch {
      setResult('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <h3>API Tests</h3>

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          className="button button-primary"
          onClick={() => regularCall('/api/test/protected')}
        >
          Normal fetch
        </button>

        <button
          className="button button-primary"
          onClick={() => authCall('/api/test/protected')}
        >
          Auth fetch
        </button>

        <button
          className="button button-primary"
          onClick={() => authCall('/api/test/refresh')}
        >
          Refresh fetch
        </button>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Loading...</p>}

      {result && (
        <pre
          style={{
            marginTop: 16,
            padding: 16,
            background: '#111',
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}

// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuditAuthProvider, useAuditAuth } from '../src/provider'

vi.mock('@auditauth/web', () => {
  class AuditAuthWeb {
    constructor(_config: unknown, _storage: unknown) {}
    handleRedirect = vi.fn().mockResolvedValue(null)
    getSessionUser = vi.fn().mockReturnValue(null)
    fetch = vi.fn()
    login = vi.fn().mockResolvedValue(undefined)
    logout = vi.fn().mockResolvedValue(undefined)
    goToPortal = vi.fn().mockResolvedValue(undefined)
    trackNavigationPath = vi.fn()
  }

  return { AuditAuthWeb }
})

const Consumer = () => {
  const { ready } = useAuditAuth()
  return <div>{ready ? 'ready' : 'loading'}</div>
}

describe('@auditauth/react smoke', () => {
  it('renders provider without crashing', async () => {
    render(
      <AuditAuthProvider
        config={{
          apiKey: 'key',
          appId: 'app',
          baseUrl: 'https://app.example.com',
          redirectUrl: 'https://app.example.com/private',
        }}
      >
        <Consumer />
      </AuditAuthProvider>
    )

    expect(await screen.findByText('ready')).toBeTruthy()
  })
})

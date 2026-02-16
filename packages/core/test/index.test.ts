import { describe, expect, it, vi } from 'vitest'
import { CORE_SETTINGS, refreshTokens } from '../src/index'

describe('@auditauth/core smoke', () => {
  it('imports core settings', () => {
    expect(CORE_SETTINGS.jwt_issuer).toBeTruthy()
  })

  it('calls a helper successfully', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'token' }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const result = await refreshTokens({
      client_type: 'browser',
      refresh_token: 'refresh',
    })

    expect(result).toEqual({ access_token: 'token' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/auth/refresh')

    vi.unstubAllGlobals()
  })
})

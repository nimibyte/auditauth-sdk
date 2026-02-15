import { describe, expect, it } from 'vitest'
import { SignJWT, exportSPKI, generateKeyPair } from 'jose'
import { CORE_SETTINGS } from '@auditauth/core'
import { verifyAccessToken, verifyRequest } from '../src/index'

describe('@auditauth/node smoke', () => {
  it('verifies a signed token with a test key', async () => {
    const appId = 'app_test'
    const issuer = 'https://issuer.auditauth.test'

    const { publicKey, privateKey } = await generateKeyPair('RS256')
    const publicKeyPem = await exportSPKI(publicKey)

    const mutableSettings = CORE_SETTINGS as unknown as {
      jwt_public_key: string
      jwt_issuer: string
    }
    mutableSettings.jwt_public_key = publicKeyPem
    mutableSettings.jwt_issuer = issuer

    const token = await new SignJWT({
      sub: 'user_1',
      email: 'user@example.com',
      account_id: 'acc_1',
      app_id: appId,
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(issuer)
      .setAudience(appId)
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(privateKey)

    const byToken = await verifyAccessToken({ token, appId })
    expect(byToken.sub).toBe('user_1')

    const byRequest = await verifyRequest({
      request: { headers: { authorization: `Bearer ${token}` } },
      appId,
    })
    expect(byRequest.email).toBe('user@example.com')
  })
})

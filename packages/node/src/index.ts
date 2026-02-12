import { importSPKI, jwtVerify, JWTPayload, KeyLike } from 'jose'
import { CORE_SETTINGS } from '@auditauth/core'

let cachedKey: KeyLike | null = null

type VerifyAccessTokenPayload = {
  token: string;
  appId: string;
};

const verifyAccessToken = async ({ token, appId }: VerifyAccessTokenPayload): Promise<JWTPayload> => {
  if (!token) {
    throw new Error('Missing token')
  }

  if (!cachedKey) {
    cachedKey = await importSPKI(
      CORE_SETTINGS.jwt_public_key,
      'RS256'
    )
  }

  const { payload } = await jwtVerify(token, cachedKey, {
    issuer: CORE_SETTINGS.jwt_issuer,
    audience: appId,
  })

  return payload
}

export { verifyAccessToken };

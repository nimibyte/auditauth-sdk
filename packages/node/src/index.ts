import { importSPKI, jwtVerify, KeyLike } from 'jose'
import { CORE_SETTINGS } from '@auditauth/core'
import type { AuditAuthTokenPayload } from './types.js';

let cachedKey: KeyLike | null = null

type VerifyAccessTokenPayload = {
  token: string;
  appId: string;
};

const verifyAccessToken = async ({ token, appId }: VerifyAccessTokenPayload): Promise<AuditAuthTokenPayload> => {
  if (!token) {
    throw new Error('Missing token');
  }

  if (!cachedKey) {
    cachedKey = await importSPKI(
      CORE_SETTINGS.jwt_public_key,
      'RS256'
    );
  }

  const { payload } = await jwtVerify(token, cachedKey, {
    issuer: CORE_SETTINGS.jwt_issuer,
    audience: appId,
  });

  return payload as AuditAuthTokenPayload;
}

type VerifyRequestParams = {
  request: Request | { headers: Headers } | { headers: Record<string, string> }
  appId: string
}

const verifyRequest = async ({ request, appId }: VerifyRequestParams) => {
  const authHeader =
    request.headers instanceof Headers
      ? request.headers.get('authorization')
      : request.headers['authorization'] || request.headers['Authorization']

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }

  const token = authHeader.replace('Bearer ', '').trim()

  return verifyAccessToken({ token, appId })
}

export { verifyAccessToken, verifyRequest };
export type { VerifyRequestParams, VerifyAccessTokenPayload, AuditAuthTokenPayload };

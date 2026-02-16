import { CORE_SETTINGS } from '../settings.js';
import type { SessionUser } from '../types.js';

type AuthorizePayload = {
  code: string | null;
  client_type: 'browser' | 'server';
};

type AuthorizeData = {
  user: SessionUser;
  access_token: string;
  access_expires_seconds: number;
  refresh_token?: string;
  refresh_expires_seconds: number;
}

type AuthorizeReturns = {
  response: Response;
  data: AuthorizeData;
};

const authorizeCode = async ({ code, client_type }: AuthorizePayload): Promise<AuthorizeReturns> => {
  if (!code) throw new Error('Invalid code');

  const response = await fetch(`${CORE_SETTINGS.domains.api}/auth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_type }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  const data = await response.json();

  return {
    response,
    data: data as AuthorizeData,
  };
};

export default authorizeCode;

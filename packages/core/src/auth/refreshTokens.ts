import { CORE_SETTINGS } from "../settings";
import { CredentialsResponse } from "../types";

type RefreshTokensPayload = {
  client_type: 'browser' | 'server';
  refresh_token?: string;
};

const refreshTokens = async ({ client_type, refresh_token }: RefreshTokensPayload): Promise<CredentialsResponse | null> => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_type, refresh_token }),
  })

  if (!response.ok) return null

  const data = await response.json() as CredentialsResponse;
  return data;
};

export default refreshTokens;

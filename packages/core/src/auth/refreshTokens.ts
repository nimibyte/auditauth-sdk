import { CORE_SETTINGS } from "../settings";

type RefreshTokensPayload = {
  client_type: 'browser' | 'server';
  refresh_token?: string;
};

const refreshTokens = async ({ client_type, refresh_token }: RefreshTokensPayload) => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_type, refresh_token }),
  })

  if (!response.ok) return null

  return response.json()
};

export default refreshTokens;

import { CORE_SETTINGS } from "../settings";

type BuildAuthUrlPayload = {
  apiKey: string;
  redirectUrl: string;
};

const buildAuthUrl = async ({ apiKey, redirectUrl }: BuildAuthUrlPayload) => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/applications/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ redirect_url: redirectUrl }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const body = await response.json();
  const { redirectUrl: authRedirectUrl, code } = body as any;
  const url = new URL(authRedirectUrl);
  url.searchParams.set('code', code);

  return url;
}

export default buildAuthUrl;

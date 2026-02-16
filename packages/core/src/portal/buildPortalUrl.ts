import { CORE_SETTINGS } from '../settings.js';

type BuildPortalUrlPayload = {
  access_token: string;
  redirectUrl: string;
};

type PortalExchangeBody = {
  code: string;
  redirectUrl: string;
}

const buildPortalUrl = async ({ access_token, redirectUrl }: BuildPortalUrlPayload) => {
  const response = await fetch(`${CORE_SETTINGS.domains.api}/portal/exchange`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const body = await response.json() as PortalExchangeBody;
  const { code, redirectUrl: portalUrl } = body;

  const url = new URL(portalUrl);
  url.searchParams.set('code', code);
  url.searchParams.set('redirectUrl', redirectUrl);

  return url;
};

export default buildPortalUrl;

'use server'

import { cookies } from 'next/headers.js';
import { SETTINGS } from './settings.js';
import { headers } from 'next/headers.js';
import { refreshTokens, RequestMethod } from "@auditauth/core";

const getRequestOrigin = async (): Promise<string> => {
  const h = await headers();

  const proto =
    h.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'production' ? 'https' : 'http');

  const host =
    h.get('x-forwarded-host') ??
    h.get('host');

  if (!host) {
    throw new Error('Cannot resolve request origin');
  }

  return `${proto}://${host}`;
}

const auditauthFetch = async (url: string, init: RequestInit = {}) => {
  const cookieManager = await cookies();
  const origin = await getRequestOrigin();
  const access_token = cookieManager.get(SETTINGS.storage_keys.access)?.value;
  const refresh_token = cookieManager.get(SETTINGS.storage_keys.refresh)?.value;
  const session_id = cookieManager.get(SETTINGS.storage_keys.session_id)?.value;

  const doFetch = (token?: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const start = performance.now();

  let response = await doFetch(access_token);

  if (response.status === 401 && refresh_token) {
    const refreshData = await refreshTokens({ refresh_token, client_type: 'server' });

    if (!refreshData) {
      return response;
    }

    if (refreshData.access_token && refreshData.refresh_token) {
      response = await doFetch(refreshData.access_token);
    }
  }

  queueMicrotask(() => {
    const payload = {
      event_type: 'request',
      runtime: 'server',
      target: {
        type: 'api',
        method: (init.method as RequestMethod) || 'GET',
        path: url,
        status: response.status,
        duration_ms: Math.round(performance.now() - start),
      },
    };

    fetch(`${origin}${SETTINGS.bff.paths.metrics}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, session_id }),
    }).catch(() => { });
  });

  return response;
};

export { auditauthFetch };

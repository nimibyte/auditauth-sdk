'use server'
import { NextRequest, NextResponse } from "next/server";
import { importSPKI, jwtVerify } from 'jose';
import {
  CookieAdapter,
  CredentialResponse,
  Metric,
  RequestMethod,
  Session,
  SessionUser
} from "./types";
import { SETTINGS } from "./settings";
import { buildAuthUrl, AuditAuthConfig, authorizeCode, revokeSession, buildPortalUrl } from '@auditauth/core';

/* -------------------------------------------------------------------------- */
/*                                    KEYS                                    */
/* -------------------------------------------------------------------------- */

let cachedKey: CryptoKey | null = null;

/* -------------------------------------------------------------------------- */
/*                               MAIN CLASS                                   */
/* -------------------------------------------------------------------------- */

class AuditAuthNext {
  private config: AuditAuthConfig;
  private cookies: CookieAdapter;

  constructor(config: AuditAuthConfig, cookies: CookieAdapter) {
    if (!config.appId) throw new Error('Missing appId');
    if (!config.apiKey) throw new Error('Missing apiKey');
    if (!config.baseUrl) throw new Error('Missing baseUrl');
    if (!config.redirectUrl) throw new Error('Missing redirectUrl');

    if (!cookies?.get || !cookies?.set || !cookies?.remove) {
      throw new Error('Invalid cookie adapter');
    }

    this.config = config;
    this.cookies = cookies;
  }

  /* ------------------------------------------------------------------------ */
  /*                             AUTH PRIMITIVES                              */
  /* ------------------------------------------------------------------------ */

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      cachedKey =
        cachedKey ||
        await importSPKI(SETTINGS.jwt_public_key, 'RS256') as CryptoKey;

      await jwtVerify(token, cachedKey, {
        issuer: SETTINGS.jwt_issuer,
        audience: this.config.appId,
      });

      return true;
    } catch {
      return false;
    }
  }

  private getCookieTokens() {
    return {
      access: this.cookies.get(SETTINGS.storage_keys.access),
      refresh: this.cookies.get(SETTINGS.storage_keys.refresh),
    };
  }

  private setCookieTokens(params: CredentialResponse) {
    const isSecure = this.config.redirectUrl.includes('https');

    this.cookies.set(
      SETTINGS.storage_keys.access,
      params.access_token,
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: isSecure,
        path: '/',
        maxAge: params.access_expires_seconds - 60,
      },
    );

    this.cookies.set(
      SETTINGS.storage_keys.refresh,
      params.refresh_token,
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: isSecure,
        path: '/',
        maxAge: params.refresh_expires_seconds - 60,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              SESSION HELPERS                             */
  /* ------------------------------------------------------------------------ */

  getSession(): SessionUser | null {
    return JSON.parse(
      this.cookies.get(SETTINGS.storage_keys.session) || '{}'
    )?.user || null;
  }

  hasSession(): boolean {
    return !!this.cookies.get(SETTINGS.storage_keys.session);
  }

  /* ------------------------------------------------------------------------ */
  /*                              AUTH FLOWS                                  */
  /* ------------------------------------------------------------------------ */

  async callback(request: NextRequest) {
    const code = new URL(request.url).searchParams.get('code');

    try {
      const { data } = await authorizeCode({ code, client_type: 'server' });

      const session: Session = {
        user: data.user,
      };

      const isSecure = this.config.redirectUrl.includes('http');

      this.cookies.set(
        SETTINGS.storage_keys.session,
        JSON.stringify(session),
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: isSecure,
          path: '/',
          maxAge: data.refresh_expires_seconds - 60,
        },
      );

      this.setCookieTokens({
        access_token: data.access_token,
        access_expires_seconds: data.access_expires_seconds,
        refresh_token: data.refresh_token!,
        refresh_expires_seconds: data.refresh_expires_seconds,
      });

      return { ok: true, url: this.config.redirectUrl };
    } catch {
      return {
        ok: false,
        url: `${SETTINGS.domains.client}/auth/invalid?reason=wrong_config`,
      };
    }
  }

  async logout() {
    const { access } = this.getCookieTokens();

    await revokeSession({ access_token: access }).catch(() => { });

    this.cookies.remove(SETTINGS.storage_keys.access);
    this.cookies.remove(SETTINGS.storage_keys.refresh);
    this.cookies.remove(SETTINGS.storage_keys.session);
  }

  async getPortalUrl({ redirectUrl }: any) {
    const { access } = this.getCookieTokens();

    try {
      if (!access) throw new Error('Not auth token');

      const url = await buildPortalUrl({ access_token: access, redirectUrl });

      return {
        ok: true,
        url,
        reason: null,
      };
    } catch (err: any) {
      return { ok: false, url: null, reason: err.message };

    }
  }

  /* ------------------------------------------------------------------------ */
  /*                              REFRESH FLOW                                 */
  /* ------------------------------------------------------------------------ */

  private async refreshRequest(refreshToken: string): Promise<CredentialResponse | null> {
    try {
      const response = await fetch(`${SETTINGS.domains.api}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_token: refreshToken,
          client_type: 'server',
        }),
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                         REQUEST WITH AUTO-REFRESH                         */
  /* ------------------------------------------------------------------------ */

  async request(url: string, init: RequestInit = {}) {
    const { access, refresh } = this.getCookieTokens();

    const doFetch = (token?: string) =>
      fetch(url, {
        ...init,
        headers: {
          ...init.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    const start = performance.now();
    let res = await doFetch(access);

    if (res.status === 401 && refresh) {
      const data = await this.refreshRequest(refresh);
      if (data?.access_token && data?.refresh_token) {
        res = await doFetch(data.access_token);
      }
    }

    this.pushMetric({
      event_type: 'request',
      runtime: 'server',
      target: {
        type: 'api',
        method: (init.method as RequestMethod) || 'GET',
        path: url,
        status: res.status,
        duration_ms: Math.round(performance.now() - start),
      },
    });

    return res;
  }

  /* ------------------------------------------------------------------------ */
  /*                                METRICS                                    */
  /* ------------------------------------------------------------------------ */

  async metrics(payload: Metric) {
    await fetch(`${SETTINGS.domains.api}/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auditauth-app': this.config.appId,
        'x-auditauth-key': this.config.apiKey,
      },
      body: JSON.stringify({ ...payload }),
    });

    return new Response(null, { status: 204 });
  }

  private pushMetric(payload: Metric) {
    const session_id = this.cookies.get(SETTINGS.storage_keys.session_id);
    queueMicrotask(() => {
      fetch(`${this.config.baseUrl}${SETTINGS.bff.paths.metrics}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, session_id }),
      }).catch(() => { });
    });
  }
  /* ------------------------------------------------------------------------ */
  /*                                METRICS                                    */
  /* ------------------------------------------------------------------------ */

  async refresh() {
    const { refresh } = this.getCookieTokens();

    if (!refresh) return { ok: false };

    const result = await this.refreshRequest(refresh);

    if (!result) return { ok: false };

    this.setCookieTokens(result);

    return { ok: true };
  }

  /* ------------------------------------------------------------------------ */
  /*                               MIDDLEWARE                                  */
  /* ------------------------------------------------------------------------ */

  async middleware(request: NextRequest) {
    const { access, refresh } = this.getCookieTokens();
    const url = request.nextUrl;

    if (access && refresh) {
      const sid = this.cookies.get(SETTINGS.storage_keys.session_id);
      if (!sid) {
        this.cookies.set(SETTINGS.storage_keys.session_id, crypto.randomUUID(), {
          httpOnly: true,
          sameSite: 'lax',
          secure: this.config.baseUrl.startsWith('https'),
          path: '/',
          maxAge: 60 * 30,
        })
      }

      this.pushMetric({
        event_type: 'navigation',
        runtime: 'browser',
        target: {
          type: 'page',
          path: url.pathname,
        },
      });

      return NextResponse.next();
    }

    if (!refresh) return NextResponse.redirect(new URL(SETTINGS.bff.paths.login, request.url));

    if (refresh && !access) return NextResponse.redirect(new URL(`${SETTINGS.bff.paths.refresh}?redirectUrl=${url}`, request.url));

    return NextResponse.next();
  }

  /* ------------------------------------------------------------------------ */
  /*                               BFF HANDLERS                               */
  /* ------------------------------------------------------------------------ */

  getHandlers() {
    return {
      GET: async (req: NextRequest, ctx: { params: Promise<{ auditauth: string[] }> }) => {
        const action = (await ctx.params).auditauth[0];
        const redirectUrl = req.nextUrl.searchParams.get('redirectUrl');

        switch (action) {
          case 'login': {
            const url = await buildAuthUrl({ apiKey: this.config.apiKey, redirectUrl: `${this.config.baseUrl}/api/auditauth/callback` });
            return NextResponse.redirect(url);
          };
          case 'refresh': {
            const { ok } = await this.refresh();
            if (ok) return NextResponse.redirect(redirectUrl || this.config.redirectUrl);

            const url = await buildAuthUrl({ apiKey: this.config.apiKey, redirectUrl: `${this.config.baseUrl}/api/auditauth/callback` });
            return NextResponse.redirect(url);
          };
          case 'callback': {
            const { url } = await this.callback(req);
            return NextResponse.redirect(url);
          };
          case 'logout': {
            await this.logout();
            return NextResponse.redirect(this.config.redirectUrl);
          };
          case 'portal': {
            const { ok, url } = await this.getPortalUrl({ redirectUrl: this.config.redirectUrl });
            return ok && url
              ? NextResponse.redirect(url)
              : NextResponse.redirect(`${SETTINGS.domains.client}/auth/invalid`);
          };
          case 'session': {
            const user = this.getSession();
            if (!user) return new NextResponse(null, { status: 401 });
            return NextResponse.json({ user });
          };
          default: {
            return new Response('not found', { status: 404 });
          };
        }
      },

      POST: async (req: Request, ctx: { params: Promise<{ auditauth: string[] }> }) => {
        const action = (await ctx.params).auditauth[0];
        if (action === 'metrics') {
          return this.metrics(await req.json());
        }
        return new Response('not found', { status: 404 });
      },
    };
  }

}

export { AuditAuthNext };

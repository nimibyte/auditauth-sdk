import { AuditAuthConfig, authorizeCode, buildAuthUrl, buildPortalUrl, CORE_SETTINGS, Metric, refreshTokens, RequestMethod, revokeSession } from "@auditauth/core";
import { StorageAdapter } from "./types";

class AuditAuthWeb {
  private config: AuditAuthConfig;
  private storage: StorageAdapter;

  constructor(config: AuditAuthConfig, storage: StorageAdapter) {
    this.config = config;
    this.storage = storage;
  }

  private getWithExpiry(key: string) {
    const itemStr = this.storage.get(key)
    if (!itemStr) return null

    const item = JSON.parse(itemStr)

    if (Date.now() > item.expiresAt) {
      this.storage.remove(key)
      return null
    }

    return item.value
  }

  private setWithExpiry(key: string, value: unknown, ttlSeconds: number) {
    const now = Date.now()

    const item = {
      value,
      expiresAt: now + ttlSeconds * 1000,
    }

    this.storage.set(key, JSON.stringify(item))
  }

  private getSessionId() {
    let session_id = this.getWithExpiry(CORE_SETTINGS.storage_keys.session_id);

    if (!session_id) {
      session_id = crypto.randomUUID();
      this.setWithExpiry(CORE_SETTINGS.storage_keys.session_id, session_id, 60 * 5);
    }

    return session_id;
  }

  private pushMetric(metric: Omit<Metric, 'session_id'>) {
    const session_id = this.getSessionId();

    const body = JSON.stringify({
      appId: this.config.appId,
      apiKey: this.config.apiKey,
      session_id,
      ...metric,
    });

    const url = `${CORE_SETTINGS.domains.api}/metrics`;

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
      return
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => { });
  }

  trackNavigationPath(path: string) {
    this.pushMetric({
      event_type: 'navigation',
      runtime: 'browser',
      target: {
        type: 'page',
        path: path,
      },
    });
  }

  initNavigationTracking() {
    const track = () => {
      this.pushMetric({
        event_type: 'navigation',
        runtime: 'browser',
        target: {
          type: 'page',
          path: window.location.pathname,
        },
      });
    };

    window.addEventListener('popstate', track);

    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      track();
    };
  }

  async fetch(input: RequestInfo, init: RequestInit = {}) {
    const start = performance.now();
    let access = this.getWithExpiry(CORE_SETTINGS.storage_keys.access)

    const doFetch = (token?: string) =>
      fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
          ...init.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

    let res = await doFetch(access || undefined)

    if (res.status === 401) {
      const refreshData = await refreshTokens({ client_type: 'browser' });

      if (!refreshData) {
        await this.logout()
        return res
      }

      this.setWithExpiry(
        CORE_SETTINGS.storage_keys.access,
        refreshData.access_token,
        refreshData.access_expires_seconds
      )

      res = await doFetch(refreshData.access_token)
    }

    this.pushMetric({
      event_type: 'request',
      runtime: 'browser',
      target: {
        type: 'api',
        method: (init.method as RequestMethod) || 'GET',
        path:
          typeof input === 'string'
            ? input
            : input instanceof Request
              ? input.url
              : '',
        status: res.status,
        duration_ms: Math.round(performance.now() - start),
      },
    });

    return res
  }

  isAuthenticated() {
    return !!this.getWithExpiry(CORE_SETTINGS.storage_keys.session);
  }

  getSessionUser() {
    const value = this.getWithExpiry(CORE_SETTINGS.storage_keys.session);
    return value ? value?.user : null;
  }

  async goToPortal() {
    const access_token = this.getWithExpiry(CORE_SETTINGS.storage_keys.access);

    if (!access_token) return this.login();

    const url = await buildPortalUrl({ access_token, redirectUrl: this.config.redirectUrl });

    window.location.href = url.href;
  }

  async logout() {
    const access_token = this.getWithExpiry(CORE_SETTINGS.storage_keys.access);
    await revokeSession({ access_token }).catch(() => { });

    this.storage.remove(CORE_SETTINGS.storage_keys.access);
    this.storage.remove(CORE_SETTINGS.storage_keys.session);

    window.location.reload();
  }

  async login() {
    const url = await buildAuthUrl({
      apiKey: this.config.apiKey,
      redirectUrl: this.config.redirectUrl,
    });

    window.location.href = url.href;
  }

  async handleRedirect() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    try {
      const { data } = await authorizeCode({ code, client_type: 'browser' });

      this.setWithExpiry(CORE_SETTINGS.storage_keys.access, data.access_token, data.access_expires_seconds);
      this.setWithExpiry(CORE_SETTINGS.storage_keys.session, { user: data.user }, data.access_expires_seconds);

      url.searchParams.delete('code');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } catch {
      return null;
    }
  }
}

export { AuditAuthWeb };

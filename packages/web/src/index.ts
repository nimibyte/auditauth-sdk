import { AuditAuthConfig, authorizeCode, buildAuthUrl, buildPortalUrl, CORE_SETTINGS, refreshTokens, revokeSession } from "@auditauth/core";

type StorageAdapter = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string) => void;
  remove: (name: string) => void;
}

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

  async fetch(input: RequestInfo, init: RequestInit = {}) {
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

    return res
  }

  isAuthenticated() {
    return !!this.getWithExpiry(CORE_SETTINGS.storage_keys.session);
  }

  getSessionUser() {
    const value = this.getWithExpiry(CORE_SETTINGS.storage_keys.session);
    return value ? value?.user : null;
  }

  async gotToPortal() {
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
      console.log('testlog>>>>>', { user: data.user });
      this.setWithExpiry(CORE_SETTINGS.storage_keys.session, { user: data.user }, data.access_expires_seconds);

      url.searchParams.delete('code');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } catch {
      return null;
    }
  }
}

export { AuditAuthWeb };

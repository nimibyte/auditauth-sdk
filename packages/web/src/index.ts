import { AuditAuthConfig, authorizeCode, buildAuthUrl, CORE_SETTINGS, revokeSession } from "@auditauth/core";

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

  isAuthenticated() {
    return !!this.storage.get(CORE_SETTINGS.storage_keys.session);
  }

  getSessionUser() {
    const value = this.storage.get(CORE_SETTINGS.storage_keys.session) || '{}';
    return JSON.parse(value).user;
  }

  async logout() {
    const access_token = this.storage.get(CORE_SETTINGS.storage_keys.access);
    await revokeSession({ access_token }).catch(() => {});

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

      this.storage.set(CORE_SETTINGS.storage_keys.access, data.access_token);
      this.storage.set(CORE_SETTINGS.storage_keys.session, JSON.stringify({ user: data.user }));

      url.searchParams.delete('code');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } catch {
      return null;
    }
  }
}

export { AuditAuthWeb };

import { AuditAuthConfig, CORE_SETTINGS } from "@auditauth/core";

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
    return !!this.storage.get(CORE_SETTINGS.storage_keys.refresh);
  }
}

export { AuditAuthWeb };

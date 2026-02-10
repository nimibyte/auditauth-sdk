type AuditAuthConfig = {
  apiKey: string;
  redirectUrl: string;
  baseUrl: string;
  appId: string;
};

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

    console.log('testlog>>>>', { config, storage });
  }
}

export { AuditAuthWeb };

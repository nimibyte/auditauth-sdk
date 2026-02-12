type StorageAdapter = {
  get: (name: string) => string | null;
  set: (name: string, value: string) => void;
  remove: (name: string) => void;
}

export type { StorageAdapter };

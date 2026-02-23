import { AuditAuthWeb } from '@auditauth/web'

const auditauth = new AuditAuthWeb({
  apiKey: 'aa_cd4f5541c6c31c16a1932982d63758631cc6131044ff1faa',
  appId: '699c105fcf9d1a9d93780188',
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
}, {
  get: (name) => localStorage.getItem(name),
  set: (name, value) => localStorage.setItem(name, value),
  remove: (name) => localStorage.removeItem(name),
});

export { auditauth };

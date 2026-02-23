import { AuditAuthWeb } from '@auditauth/web'

const getEnv = (name) => import.meta.env[name] ?? `example_${name.toLowerCase()}`

const auditauth = new AuditAuthWeb({
  apiKey: getEnv('VITE_AUDITAUTH_API_KEY'),
  appId: getEnv('VITE_AUDITAUTH_APP_ID'),
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
}, {
  get: (name) => localStorage.getItem(name),
  set: (name, value) => localStorage.setItem(name, value),
  remove: (name) => localStorage.removeItem(name),
});

export { auditauth };

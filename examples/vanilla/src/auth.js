import { AuditAuthWeb } from '@auditauth/web'

const requireEnv = (name) => {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(
      `[AuditAuth example-vanilla] Missing ${name}. Add it to examples/vanilla/.env.local.`
    )
  }

  return value
}

const auditauth = new AuditAuthWeb({
  apiKey: requireEnv('VITE_AUDITAUTH_API_KEY'),
  appId: requireEnv('VITE_AUDITAUTH_APP_ID'),
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
}, {
  get: (name) => localStorage.getItem(name),
  set: (name, value) => localStorage.setItem(name, value),
  remove: (name) => localStorage.removeItem(name),
});

export { auditauth };

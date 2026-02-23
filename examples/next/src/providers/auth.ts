import { createAuditAuthNext } from '@auditauth/next';

const getEnv = (name: 'AUDITAUTH_API_KEY' | 'AUDITAUTH_APP_ID') =>
  process.env[name] ?? `example_${name.toLowerCase()}`;

const auditauth = createAuditAuthNext({
  apiKey: getEnv('AUDITAUTH_API_KEY'),
  appId: getEnv('AUDITAUTH_APP_ID'),
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
});

export { auditauth };

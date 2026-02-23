import { createAuditAuthNext } from '@auditauth/next';

const requireEnv = (name: 'AUDITAUTH_API_KEY' | 'AUDITAUTH_APP_ID') => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[AuditAuth example-next] Missing ${name}. Add it to examples/next/.env.local.`
    );
  }
  return value;
};

const auditauth = createAuditAuthNext({
  apiKey: requireEnv('AUDITAUTH_API_KEY'),
  appId: requireEnv('AUDITAUTH_APP_ID'),
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
});

export { auditauth };

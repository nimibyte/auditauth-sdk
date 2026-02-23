import { createAuditAuthNext } from '@auditauth/next';

const auditauth = createAuditAuthNext({
  apiKey: 'aa_d80b57881df9ac381287315ea390247ca031079d2696d903',
  appId: '699bf2e3eb30f53c85d0dc4a',
  baseUrl: 'http://localhost:5173',
  redirectUrl: 'http://localhost:5173/private',
});

export { auditauth };

